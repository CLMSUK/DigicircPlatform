﻿namespace Joove.Widgets {

    class JbDataList extends BaseAngularProvider {
    }

    export class DataListControl {
        // Static Constant values
        private static readonly MAX_ROWS: number = 1000;
        private static readonly DOUBLE_CLICK_THRESHOLD: number = 250;
        private static readonly STANDALONE_OUTER_ELEMENTS_DUMMY_CLASS: string = "data-list-standalone-outer-static-elements-dummy";
        private static readonly PICKLIST_POPUP_MODAL_CLASS: string = "modal-body";
        private static readonly DEFAULT_DATATABLES_MIN_HEIGHT: string = "200px";
        private static readonly GROUP_PATH_SEPARATOR: string = " /*+!+*/ ";   //IMPORTANT: The group separator must contain at least one space in order to work with the jQuery selectors
        private static readonly GROUP_VALUE_SEPARATOR: string = "/++***++/";
        private static readonly SANITIZE_COLUMN_REPLACEMENT_VALUE: string = ""; //IMPORTANT: This should match the replacement value that the function SanitizeCSharpIdentifier uses in LinqRuntimeTypeBuilder.cs
        private static readonly DEFAULT_PAGE_SIZE: number = 25;
        public static readonly DEFAULT_DATETIME_FORMAT = "DD/MM/YYYY";

        // For External Access and debugging
        static instancesDic: { [name: string]: Widgets.DataListControl } = {};

        // Instance props
        public $element: JQuery;   //JQuery initial table element, NOT the wrapper/container
        public $scopeElement: JQuery;   //This the element responsible for the angular scope, server side bindings etc.
        public serversideElementId: string;
        public clientsideElementId: string;
        public dataTableInstance: DataTables.DataTable;
        public options: IDataListOptions = {        //Default option values
            isStandAlone: false,
            isPickList: false,
            waitForPredefinedFilters: false,
            showRowNumbers: true,
            displayRecordsInfoRow: true,
            hasMultiSelect: false,
            hasPaging: true,
            hasReorderableColumns: false,
            hasResizableColumns: true,
            canHideShowColumns: false,
            canCopyToClipboard: false,
            showRefreshButton: true,
            isExportable: false,
            isGroupable: false,
            isSearchable: true,
            importData: false,
            saveViews: false,
            predefinedGroups: [],
            predefinedAggregators: [],
            onUpdateAction: null,
            pageSizes: [],
            userCanSelectPageSize: true,
            maxSelectedRows: -1,
            structuredFiltering: false,
            rememberSelectedItems: false,
            rememberLastState: false,
            minColumnWidth: 150,
            useCustomModal: false
        };
        public status: IDataListStatus;
        public $wrapperElement: JQuery;
        public $loadingPanel: JQuery;
        public resources: DataListControlResources;
        public isInitialized;
        public drawCallbackExtraFunctionality: Function;
        private aggregatorsInfo = [];
        private cache: any;
        private updateFromCache: boolean;
        private ruleEvaluations: Array<Joove.DataSetRuleEvaluationResult>;
        private fromMasterPage = false;
        private dataSetName: string;
        private exportHelper: any;
        private viewsHelper: UserViewsHelper;
        private importHelper: ImportHelper;
        private compositeFiltersHelper: CompositeFiltersHelper;
        private lastSearchEventTimestamp: number;
        private destroyInProgress: boolean;
        private resetInProgress: boolean;

        constructor(element: JQuery, options: any) {
            this.viewsHelper = this.configureViewsHelper();
            this.instantiate(element, options, false);
        }

        /********************************************** [BEGIN] Initialization *********************************************/
        reInit() {
            this.destroyInProgress = true;
            this.dataTableInstance.destroy();
            this.destroyInProgress = false;
            this.dataTableInstance = null;
            this.$element.empty();
            this.instantiate(this.$element, this.options, true);
        }

        private instantiate(element: JQuery, options: any, fromReInit: boolean) {
            this.isInitialized = false;
            this.options = $.extend(this.options, options);

            this.exportHelper = new ExportHelperV2(this);
            this.importHelper = new ImportHelper(this);
            this.ruleEvaluations = null;
            this.dataSetName = "";
            this.$element = element;
            this.$element.empty();
            this.serversideElementId = Core.GetServerSideElementName(this.$element);
            this.clientsideElementId = Core.GetClientSideName(this.$element);

            const userPageSize = this.options.pageSizes.some((size) => { return size > 0 }) ? this.options.pageSizes.filter((size) => { return size > 0 })[0] : DataListControl.DEFAULT_PAGE_SIZE;

            this.status = {
                startRow: 0,
                pageSize: this.options.hasPaging ? userPageSize : Widgets.DataListControl.MAX_ROWS,
                columnInfo: [],
                filters: [],
                orderBy: [],
                aggregators: [],
                groupBy: [],
                getGroupsClosed: false,
                mergeGroupLevels: false,
                excludedKeys: [],
                selectedKeys: [],
                selectedItems: [],
                allKeysSelected: false,
                exportSettings: {
                    type: "Excel",
                    range: "",
                    fileName: "",
                    exportTitle: "",
                    includeGridLines: true,
                    portraitOrientation: false,
                    columnInfo: [],
                    groupInfo: [],
                    headerColor: "",
                    evenColor: "",
                    oddColor: "",
                    groupColor: "",
                    aggregateColor: ""
                }
            };

            this.cache = {
                data: {
                    data: [],
                    recordsTotal: 0,
                    recordsFiltered: 0
                },
                aggregators: null
            }

            this.resources = new DataListControlResources(window._resourcesManager.getDataListResources());

            if (this.options.isPickList === true) {
                const uniqueId = this.$element.attr("unique-id");
                console.log("table ", uniqueId);
                Widgets.DataListControl.instancesDic[this.clientsideElementId + uniqueId] = this;
            }
            else {
                Widgets.DataListControl.instancesDic[this.clientsideElementId] = this;
            }

            this.aggregatorsInfo = [
                {
                    type: AggregatorTypes.COUNT,
                    pageText: this.resources.textResources.PageCount,
                    totalText: this.resources.textResources.GrandCount
                },
                {
                    type: AggregatorTypes.SUM,
                    pageText: this.resources.textResources.PageTotal,
                    totalText: this.resources.textResources.GrandTotal
                },
                {
                    type: AggregatorTypes.AVERAGE,
                    pageText: this.resources.textResources.PageAverage,
                    totalText: this.resources.textResources.GrandAverage
                }
            ];

            if (this.options.isPickList) {
                return;
            }

            var loggedIn = window._context.currentUsername != null && window._context.currentUsername !== "";

            //This should be tested as it's behaviour is related to the script execution and page load timings
            if (this.$element.is(":visible") == false || fromReInit) {
                
                const initHiddenListPolling = window.setInterval(() => {
                    if (this.$element.is(":visible")) {
                        if (fromReInit === true || loggedIn === false) {
                            this.init();
                        }
                        else {
                            this.viewsHelper.fetchAllAvailableViews();
                        }
                        window.clearInterval(initHiddenListPolling);
                    }
                }, 500);

                return;
            }
        }

        getColumnInfoKey(): string {
            return this.options.isPickList ? this.clientsideElementId.substr(0, this.clientsideElementId.lastIndexOf("_PickList")) : this.clientsideElementId;
        }

        resetColumnInfo() {
            this.status.columnInfo = JSON.parse(JSON.stringify(window[this.getColumnInfoKey() + "_ColumnInfo"]));
        }

        init(scopeElement?: JQuery) {
            this.resetColumnInfo();

            if (this.status.columnInfo == undefined || this.status.columnInfo.length == undefined || this.status.columnInfo.length === 0) {
                this.handleError("DATALIST ERROR: No ColumnInfo array found for DataList control with id " + this.getColumnInfoKey() + ". Aborting initialization.");
                return;
            }
            this.$scopeElement = scopeElement || this.$element;

            this.dataSetName = DatasourceManager.getDataSetNameFromControl(this.$scopeElement);

            //Initialize aggregator state including all possible aggregators in a disabled state
            for (let i = 0; i < this.status.columnInfo.length; i++) {
                const columnInfo = this.status.columnInfo[i];

                if (!columnInfo.supportsAggregators) continue;

                this.status.aggregators.push(new DataListAggregatorInfo(this.status.columnInfo[i].name, AggregatorTypes.COUNT, this.status.columnInfo[i].formatting));

                if (Common.getMambaDataType(columnInfo.mambaDataType) === MambaDataType.NUMBER) {
                    const sumAggregator = new DataListAggregatorInfo(this.status.columnInfo[i].name, AggregatorTypes.SUM, this.status.columnInfo[i].formatting);
                    const avgAggregator = new DataListAggregatorInfo(this.status.columnInfo[i].name, AggregatorTypes.AVERAGE, this.status.columnInfo[i].formatting);
                    sumAggregator.encrypted = this.status.columnInfo[i].isEncrypted;
                    avgAggregator.encrypted = this.status.columnInfo[i].isEncrypted;
                    this.status.aggregators.push(sumAggregator);
                    this.status.aggregators.push(avgAggregator);
                }
            }

            //Create the table footer
            const $footer = $("<tfoot class='datalist-footer'></tfoot>");
            const $footerRow = $("<tr></tr>");
            $.each(this.status.columnInfo, (i) => { $footerRow.append($("<th></th>")); });
            if (this.options.showRowNumbers) $footerRow.append($("<th></th>"));
            $footer.append($footerRow);
            this.$element.append($footer);


            /*********************** [BEGIN] Settings ***********************/
            const dataTableSettings: any = {
                processing: true,
                serverSide: true,
                order: [],                                          //TODO: Test dataset with ordering
                scrollX: true,
                scrollCollapse: false,                              //Allow the table to reduce in height when a limited number of rows are shown
                deferRender: true,                                  //Elements will be created only when required
                language: this.resources.dataTablesResources
            };

            dataTableSettings.colReorder = this.options.hasReorderableColumns && this.options.showRowNumbers
                ? { fixedColumnsLeft: 1 }
                : this.options.hasReorderableColumns;

            dataTableSettings.lengthMenu = this.getPageSizeInfo();  //TODO: These values should be defined by the user

            dataTableSettings.select = this.options.hasMultiSelect ? "multi" : "single";

            const pagerLayout = this.options.hasPaging ? "p" : "";
            const pagerSizeLayout = this.options.hasPaging && this.options.userCanSelectPageSize ? "l" : "";
            const searchAndActionsLayout = this.options.isSearchable ? "<'col-sm-3 filter'f><'col-sm-5'<'actions'>>" : "<'col-sm-8'<'actions'>>";
            let bottomInfoLayout = "";

            if (this.options.hasMultiSelect && this.options.displayRecordsInfoRow) {
                //Show info & multi-select buttons & pager
                bottomInfoLayout = "<'col-sm-3 info'i><'col-sm-5 select-actions'><'col-sm-4 paginate'" + pagerLayout + ">"
            } else if (this.options.displayRecordsInfoRow) {
                //Show info & pager
                bottomInfoLayout = "<'col-sm-5 info'i><'col-sm-7 paginate'" + pagerLayout + ">";
            } else if (this.options.hasMultiSelect) {
                //Show multi-select buttons & pager
                bottomInfoLayout = "<'col-sm-6 select-actions'><'col-sm-6 paginate'" + pagerLayout + ">";
            } else {
                //Show pager only
                bottomInfoLayout = "<'col-sm-12 paginate'" + pagerLayout + ">";
            }


            dataTableSettings.dom = "<'row' \
                                       " + searchAndActionsLayout + " \
                                        <'col-sm-4 settings'<'buttons'B>" + pagerSizeLayout + "> \
                                     > \
                                     <'row' \
                                        <'col-sm-12'Ztr> \
                                     > \
                                     <'row' \
                                        " + bottomInfoLayout + " \
                                     >";

            let dataListHeight: string = null;
            var heightRegexp = /[\s;]*height\s*:\s*([0-9]+.?([0-9]+)?(px|em|ex|%|in|cm|mm|pt|pc));?.*/;
            var match = heightRegexp.exec(this.$element.parent().attr("style"));
            if (match != null) { dataListHeight = match[1]; }

            //The standalone/picklist check is used just to initialize the datatables plugin with a scrollY value,
            //and then the value is overriden in the updateDataTableSize function manually. If the scrollY
            //value is omitted then scrolling container elements are not generated.
            if (this.options.isStandAlone || this.options.isPickList || dataListHeight !== null) {
                dataTableSettings.scrollY = dataListHeight || DataListControl.DEFAULT_DATATABLES_MIN_HEIGHT;
            }

            dataTableSettings.buttons = this.getDatatablesButtonsConfiguration();
            dataTableSettings.columns = this.getColumnsConfiguration();

            dataTableSettings.initComplete = (settings, json) => {
                this.onDataTablesInit(settings);
                this.initializationComplete(settings, json);
            };
            dataTableSettings.ajax = (data, callback, settings) => {
                this.makeDatasourceRequest(data, callback, settings);
            };
            dataTableSettings.footerCallback = (row, data, start, end, display) => { this.renderAggregators(row, data, start, end, display); };
            dataTableSettings.drawCallback = (settings) => { this.drawCallback(); }
            dataTableSettings.rowId = "_key";

            dataTableSettings.bAutoWidth = !this.options.hasResizableColumns;

            dataTableSettings.stateSave = true;
            dataTableSettings.stateDuration = -1;
            dataTableSettings.stateSaveCallback = (settings, data) => {
                data.status = JSON.parse(JSON.stringify(this.status)); // clone

                if (this.options.rememberLastState == true) {
                    // save state to local storage
                    this.viewsHelper.currentViewSerializedStatus = JSON.stringify(data);
                    this.viewsHelper.saveStateToLocalStorage();
                }

                // set views helper status with 0 start row
                // so that any custom views saved, start from first page
                data.status.startRow = 0;
                this.viewsHelper.currentViewSerializedStatus = JSON.stringify(data);
            };
            dataTableSettings.stateLoadCallback = (settings, cb) => {
                this.viewsHelper.dataTablesLoadStateFunction = cb;

                var currentStatusSerialized = this.viewsHelper.currentViewSerializedStatus;

                if (currentStatusSerialized != null) {
                    try {
                        var savedStatus = JSON.parse(currentStatusSerialized);
                        var isStatusValid = this.viewsHelper.viewStatusIsValid(savedStatus);

                        if (isStatusValid === true) {
                            this.status = savedStatus.status;
                            cb(savedStatus);
                        }
                        else {
                            console.error(`List View '${this.viewsHelper.currentView.ViewName}' is invalid!`);
                            cb(settings);
                        }
                    }
                    catch (e) {
                        console.error(`Error while loading list View '${this.viewsHelper.currentView.ViewName}'`);
                        cb(settings);
                    }
                }
                else {
                    cb(settings);
                }

                //This is to show the clear button in case a search term is applied in any search input
                this.$wrapperElement.find(".search-input").trigger("change");
            };

            /*********************** Settings [END] ***********************/

            this.$element.DataTable(dataTableSettings);

            this.compositeFiltersHelper = new CompositeFiltersHelper(this);
        }

        onDataTablesInit(dataTableSettings: any) {
            var self = this;

            this.dataTableInstance = dataTableSettings.oInstance.api(); //Temporary assignment to avoid undefined exceptions
            this.$wrapperElement = $(this.dataTableInstance.table().container());
            this.$loadingPanel = this.$wrapperElement.find(".dataTables_processing");

            this.$wrapperElement.addClass("datatables-wrapper");
            this.$wrapperElement.addClass("not-initialized");
            this.$wrapperElement.toggleClass("standalone", this.options.isStandAlone);

            /*********************** [BEGIN] Register DataTables events ***********************/
            this.$element.on("page.dt", (event, settings) => {
                this.dataTablePageEvent();
            });

            this.$element.on("length.dt", (event, settings) => {
                this.dataTablePageSizeEvent();
            });

            /**
             * NOTE: Normally the order.dt event is triggered before the ajax request as the documentation suggests. But
             *       in the current implementation for some reason it is triggered after the request. Also for some reason
             *       the search event is triggered before the ajax request when sorting columns. So the order event is moved
             *       with the search event until this is fixed.
             */

            this.$element.on("order.dt", (event, settings) => {

            });

            this.$element.on("search.dt", (event, settings) => {
                if (this.isInitialized === false || this.destroyInProgress === true || this.resetInProgress ===  true) return;

                //This is to avoid multiple search triggers when switching views
                if (this.lastSearchEventTimestamp == null) { this.lastSearchEventTimestamp = event.timeStamp; }
                else if (event.timeStamp - this.lastSearchEventTimestamp < 500) { return; }
                this.lastSearchEventTimestamp = event.timeStamp;

                this.dataTableSearchEvent();
                this.dataTableOrderEvent(event);
                /**
                 *   When a search event is triggered the selected items should be cleared
                 * 
                 *   NOTE: On Picklist mode this clears the selected items when the picklist opens
                 *         because the search event is triggered when refreshing the data.
                 *         This should ne further tested on picklist mode when searching
                 *
                 *         Also the datatables draw() function seems to trigger a search event,
                 *         which is not valid when updating a cell and refreshing from cache
                 */
                if ((!this.options.isPickList || (this.options.isPickList && !this.options.hasMultiSelect)) && !this.updateFromCache) {
                    this.setSelectedItemKeys([]);
                }
                //When the data length is affected the aggregators should be refreshed
                this.makeAggregatorRequest();
            });

            this.$element.on("column-reorder.dt", (event, settings, details) => {
                this.dataTableColumnReorderEvent(details);
            });

            this.$element.on('column-visibility.dt', (event, settings, columnIndex, state) => {
                this.dataTableColumnVisibilityEvent(event, settings, columnIndex, state);
            });

            this.$element.on('user-select.dt', (event, datatable, type, cell, originalEvent) => {
                //Prevent default select behaviour to manually handle single and double click actions
                event.preventDefault();
                //If an editable input is clicked then prevent selection
                if ($(originalEvent.target).hasClass("editable-input")) { return; }
                //Execute the selection after the specified double click threshold to give time
                //to a possible double click event to be captured
                const $row = $(originalEvent.target).closest("tr");
                setTimeout(() => {
                    if ($row.data("dblclick") !== true) {
                        //Any user action resets the allKeysSelected state
                        this.status.allKeysSelected = false;

                        if ($row.hasClass("selected")) {
                            datatable.row($row.get(0)).deselect();
                        }
                        else {
                            //In case there is a selected item in its inital state make sure to clear it
                            //if no multi-selection is enabled
                            if (!this.options.hasMultiSelect && this.status.selectedItems.length > 0) {
                                this.setSelectedItemKeys([]);
                            }

                            //Check that maxSelectedRows option is honoured (if enabled)
                            if (this.maxSelectedRowsReached()) {
                                return;
                            }

                            datatable.row($row.get(0)).select();
                        }
                        //Update directive & model. Picklist handles the directive scope when pressing ok
                        this.listSelectionChanged();

                    }
                }, DataListControl.DOUBLE_CLICK_THRESHOLD);
            });

            this.$element.on("select.dt", (event, datatable, type, indexes) => {
                this.dataTableSelectEvent(event, datatable, type, indexes);
            });

            this.$element.on("deselect.dt", (event, datatable, type, indexes) => {
                this.dataTableSelectEvent(event, datatable, type, indexes);
            });

            /*********************** Register DataTables events [END] ***********************/

            /*********************** [BEGIN] Register custom events ***********************/
            /*********************** [BEGIN] Hover column effect ***********************/
            this.$element.on("mouseenter", "td", (event) => {
                const cellInfo = this.dataTableInstance.cell(event.currentTarget).index();
                if (cellInfo == undefined) return;

                const columnIndex = cellInfo.column;
                $(this.dataTableInstance.column(columnIndex).nodes()).addClass("highlight");
            });

            this.$element.on("mouseleave", "td", (event) => {
                const cellInfo = this.dataTableInstance.cell(event.currentTarget).index();
                if (cellInfo == undefined) return;

                const columnIndex = cellInfo.column;
                $(this.dataTableInstance.column(columnIndex).nodes()).removeClass("highlight");
            });
            /*********************** Hover column effect [END] ***********************/
            /*********************** [BEGIN] Double click Event ***********************/
            this.$element.on("dblclick", "tr", function (event) {
                const $row = $(this);
                //Picklist mode and group rows don't have double click functionality
                if ((self.options.isPickList && self.options.hasMultiSelect) || $row.hasClass("group-row") || self.dataTableInstance.table().rows().count() == 0) { return; }
                //Set the dblclick flag to avoid executing row selection in the user-select.dt event
                $row.data("dblclick", true);
                //Deselect any selected rows
                self.dataTableInstance.table().rows().deselect();
                //And select the current row
                self.dataTableInstance.row(this).select();
                //Update directive & model
                self.updateDirectiveScopeAndModel();
                //Execute the default list action if any
                const $defaultAction = self.$wrapperElement.find(".actions button.list-default-action");
                if ($defaultAction.length === 1) $defaultAction.click();
                //Change the dblclick flag to allow single click selection again in the current row
                setTimeout(() => {
                    $row.data("dblclick", false);
                }, DataListControl.DOUBLE_CLICK_THRESHOLD);

                //If it is a PickList control then it has only single select enabled and only for this specific case the double click action
                //auto presses the OK button in the modal window that this list is contained
                if (self.options.isPickList) {
                    self.$wrapperElement.closest("div[jb-type='ModalContent']").find("button[jb-id='_modalOKButton']").click();
                }
            });
            /*********************** Double click Event [END] ***********************/
            /*********************** [BEGIN] Editable change Event ***********************/
            this.$element.on("change", ".editable-input", function (event) {
                //For datetime pickers the updateCellValue should be triggered by their onClose event
                if ($(this).hasClass("datetime-picker")) return;
                self.updateCellValue($(this));
            });
            /*********************** Editable change Event [END] ***********************/

            /*********************** [BEGIN] Image Click change Event ***********************/
            this.$element.on("click", ".datalist-img.show-full", function (event) {
                self.showFullImage($(this));
            });
            /*********************** Editable change Event [END] ***********************/

            //Trigger updates on window resize
            if (this.options.isStandAlone || this.options.isPickList) {
                $(window).on("resize", () => {
                    this.updateDataTableSize();
                    this.updateActionButtonVisibility(); //To enable/disable compact mode
                });
            }
            /*********************** Register custom events [END] ***********************/

            //Initialize datepicker plugin
            this.initializeDatepickerPlugIn();

            if (this.options.waitForPredefinedFilters == true) {
                this.$wrapperElement.hide();
            }
        }
        listSelectionChanged() {
            //Invoke onChange handler if we're not in picklist mode
            //picklist handles this event on its own
            if (this.options.isPickList) {
                this.updateActionButtonVisibility();
                return;
            }
            this.updateDirectiveScopeAndModel();
            /* NOTE: When multi-select is enabled, the selected items may be distibuted across
                     multiple pages. Because the automated info text doesn't support this feature,
                     the selected items it displays is invalid. To resolve this the selected items
                     count is stored in a jQuery data key within the wrapper element. The select
                     plugin is patched to read from that part.
             */
            this.$wrapperElement.data["selectedRows"] = this.status.selectedKeys.length;
            //Trigger the selection info event to update with the new selection count value
            this.$element.trigger("info.dt");
            DatasourceManager.invokeOnChangeHandler(this.$scopeElement);
        }

        configureViewsHelper(): UserViewsHelper {
            var fetchCb = () => {
                this.viewsHelper.loadInitialView(false);
                this.init();
            };

            var saveCb = () => {
                console.log("TODO: VIEW SAVE CB");
            };

            var loadCb = (redraw: boolean) => {
                if (redraw === true) {
                    this.reInit();
                }
                else {
                    // who knows what...
                }
            };

            return new UserViewsHelper(this, {
                fetchCb: fetchCb,
                saveCb: saveCb,
                loadCb: loadCb
            });
        }

        //Callback function
        initializationComplete(settings, json) {
            this.configureGlobalSearch();
            this.configureQuickFilters();
            this.configureCustomFunctionalityButtons();
            this.configureActionButtons();
            this.configureActionButtonContextMenu();
            this.configureSelectionButtons();
            this.configureGrouping();
            this.configureAggregators();
            this.configureColumnResize();

            //Enable bootstrap tooltips for the configuration buttons
            this.$wrapperElement.find(".bootstrap-tooltip").tooltip();

            //Configure loading panel
            this.$loadingPanel.html("<div class='spinner'></div>");

            /*     NOTE: Becase the static headers plugin clones the original table element in order to achive
             *           the static header effect we need to remove the jb-id attribute from the cloned element,
             *           otherwise functionalities based on this attribute may not work.
             */
            const $tableElements = $("table[jb-id='" + this.$element.attr('jb-id') + "']", this.$wrapperElement);
            if ($tableElements.length > 1) {
                for (let i = 0; i < $tableElements.length; i++) {
                    if ($tableElements.eq(i).children("tbody").length === 0) {
                        //Remove jb-id and conditional formattings from the cloned elements
                        var attributes = $tableElements.get(i).attributes;
                        for (let j = attributes.length - 1; j >= 0; j--) {
                            if (attributes[j].name == "jb-id" || attributes[j].name.indexOf("cf-") === 0) {
                                $tableElements.eq(i).removeAttr(attributes[j].name);
                            }
                        }
                    }
                }
            }

            /*  NOTE: The following searches for a custom handling function that could run after the Datatable initialization
             *        and handle customizations in appearance and usability. This suggestion could keep the actual code clean
             *        from customizations
             */
            const dataListCustomInitFunction = window["DataListCustomInitFunction"];

            if (dataListCustomInitFunction) {
                dataListCustomInitFunction(this.$element, settings.oInstance.api());
            }

            //Hide columns that are defined as not visible
            this.setColumnVisibility();

            /* NOTE: The following page reset should be done when ordering is actually triggered. The events: order.dt, search.dt etc.
             *       only maintain the status object to be up to date with the datalist state. Because they're triggered on multiple
             *       occasions the following page reset is done only when the user actually clicks on the column header.
             */
            this.$wrapperElement.on("click", "table[jb-type='DataList'] thead th.sorting, table[jb-type='DataList'] thead th.sorting_asc, table[jb-type='DataList'] thead th.sorting_desc", (event) => {
                this.dataTableInstance.page(0);
            });

            //Apply custom width on columns if present in the columnInfo section
            for (let i = 0; i < this.status.columnInfo.length; i++) {
                const columnInfo = this.status.columnInfo[i];
                const datatablesColumnSettings = settings.aoColumns;  //Column settings used by the datatables plugin
                const columnSettings = datatablesColumnSettings.filter((c) => { return c.data === columnInfo.name })[0];
                if (columnSettings == undefined) continue;
                columnSettings.sWidth = columnInfo.width;
            }

            //Update group by dialog
            this.updateGroupingDialogState();

            this.isInitialized = true;

            // Request a redraw in order to get the actual data now that the datatables element is initialized
            // If it's a picklist it will request the actual data when displayed
            // TODO: Investigate why this needs a 'minimum' timeout. Data is not requested without it!
            if (!this.options.isPickList) {
                setTimeout(() => { this.dataTableInstance.draw(); }, 10);
            }
        }

        setColumnVisibility(forReset?: boolean) {
            for (let j = this.options.showRowNumbers ? 1 : 0; j < this.dataTableInstance.columns().count(); j++) {
                const columnInfo = this.getColumnInfoForElement($(this.dataTableInstance.column(j).header()));
                if (columnInfo == undefined) {
                    this.handleError("DATALIST ERROR: ColumnInfo not found for column with index " + j);
                    continue;
                }

                if (!columnInfo.visible) {
                    this.dataTableInstance.column(j).visible(false);
                }
                else if (forReset === true && !columnInfo.visible) {
                    this.dataTableInstance.column(j).visible(true);
                }
            }
        }
        /********************************************** Initialization [END] *********************************************/

        /****************************************** [BEGIN] Data Helper Functions ******************************************/
        prepareDatasourceRequestInfo(): DatasourceRequest {
            const request = new DatasourceRequest(this.$scopeElement,
                this.status.startRow,
                this.status.pageSize,
                this.status.filters,
                this.status.orderBy,
                this.status.excludedKeys,
                this.status.groupBy);

            return request;
        }
        updateDatasourceFromCache() {
            this.updateFromCache = true;
            this.dataTableInstance.draw(false);
            this.updateFromCache = false;
        }

        makeDatasourceRequest(data, callback, settings) {
            /*   NOTE: If not initialized proceed with an empty dataset to avoid UI glitches
             *         due to custom elements being initialized after the datasource request
             */

            if (!this.isInitialized || this.updateFromCache) {
                callback(this.cache.data);
                return;
            }
            const datasourceRequestInfo = this.prepareDatasourceRequestInfo();

            DatasourceManager.fetch(
                this.$scopeElement,
                this.serversideElementId,
                datasourceRequestInfo,
                {
                    success: (response) => {
                        //The following Cycles.reconstructObject is being executed already in the
                        //DatasourceManager module. If executed again it causes infinite loop and
                        //stackoverflow occurs.
                        //
                        //Restore references
                        //Cycles.reconstructObject(response.Data);

                        //Save the response to the client cache for future reference
                        this.cache.data.data = response.Data;
                        this.cache.groups = response.Groups;
                        this.cache.data.recordsTotal = response.TotalRows;
                        this.cache.data.recordsFiltered = response.TotalRows;
                        this.ruleEvaluations = response.RuleEvaluations;

                        //The following callback is defined in the Datatables implementation
                        callback(this.cache.data);

                        //Remove the not-initialized class that was added in the init function
                        this.$wrapperElement.removeClass("not-initialized");

                        this.updateRowNumbers();

                        //Update UI according to the selected keys
                        const rowIdSelector = this.status.selectedKeys.map((t) => { return "#" + t; });
                        this.dataTableInstance.rows(rowIdSelector).select();

                        this.updateActionButtonVisibility();
                    },
                    error: (data) => {
                        this.handleError(data);
                    }
                },
                []
            );
        }

        makeAggregatorRequest() {
            const activeAggregators = $.grep(this.status.aggregators, (item) => { return item.enabled; });

            if (activeAggregators.length === 0) {
                this.cache.aggregators = null;
                this.renderAggregators(null, null, null, null, null);
                if (this.cache.groups != null) {
                    this.renderGroups();
                }
                this.dataTableInstance.state.save();
                return;
            }

            const datasourceRequestInfo = this.prepareDatasourceRequestInfo();

            DatasourceManager.fetch(
                this.$scopeElement,
                this.serversideElementId,
                datasourceRequestInfo,
                {
                    success: (data) => {
                        this.cache.aggregators = data;
                        if (this.cache.groups != null) {
                            this.renderGroups();
                        }
                        this.renderAggregators(null, null, null, null, null);
                        this.dataTableInstance.state.save();
                    },
                    error: (data) => {
                        this.handleError(data);
                    }
                },
                activeAggregators
            );
        }

        setSelectedItemKeys(selectedItemKeys) {
            if (this.options.isPickList !== true) {
                var storedSelectedKeys = this.viewsHelper.getStoredSelectedKeys(true);
                if (storedSelectedKeys != null) {
                    selectedItemKeys = storedSelectedKeys;
                }
            }

            const directiveScope = Common.getDirectiveScope(this.$scopeElement);

            if (!selectedItemKeys) {
                this.handleError("DATALIST ERROR: The selected item keys requires an array of keys to select which was not provided");
                return;
            }
            var notDefaultSelectedItemKeys = [];
            for (let i = 0; i < selectedItemKeys.length; i++) {
                var key = selectedItemKeys[i];
                if (Common.keyHasDefaultValue(key) === true) continue;
                notDefaultSelectedItemKeys.push(key);
            }
            selectedItemKeys = notDefaultSelectedItemKeys;
            if (selectedItemKeys.length === 0) {
                //When the provided selected item keys array is empty then everything is deselected
                this.dataTableInstance.rows().deselect();
                this.status.selectedItems = [];
                this.updateDirectiveScopeAndModel();
                return;
            } else if (this.options.maxSelectedRows > 0 && selectedItemKeys.length > this.options.maxSelectedRows) {
                this.handleError("DATALIST ERROR: The selected item keys exceed the maxSelectedRows limit. Requested keys were not set as selected");
                return;
            }
            //Get the rows according to the selected keys
            const rowIdSelector = selectedItemKeys.map((t) => { return "#" + t; });
            const selectedRows = this.dataTableInstance.rows(rowIdSelector);

            //If any key is missing from the available data client-side then make a request
            directiveScope.requestSelectedItemsfromServer = selectedRows.count() !== selectedItemKeys.length;

            //Deselect all rows in client
            this.dataTableInstance.rows().deselect();
            //Clear the currently selected items from status (items that are not present 
            //in client will not be removed from status by deselect)
            this.status.selectedItems = [];
            //Reset the allKeysSelected flag
            this.status.allKeysSelected = false;

            //Select the available rows
            selectedRows.select();

            if (directiveScope.requestSelectedItemsfromServer) {
                //Show loading panel
                this.$loadingPanel.show();

                DatasourceManager.requestSelectedItemsfromServer(
                    this.serversideElementId,
                    this.$scopeElement,
                    directiveScope.itemDataType,
                    this.status.allKeysSelected,
                    selectedItemKeys,
                    this.status.excludedKeys, //This option is the keysToExclude which is used only when allKeysSelected is true
                    this.prepareDatasourceRequestInfo(),
                    selectedItemsData => {
                        //Hide the loading panel
                        this.$loadingPanel.hide();
                        if (selectedItemsData == null) selectedItemsData = [];
                        //Ensure we always handle an array
                        if (!Common.isArray(selectedItemsData)) { selectedItemsData = [selectedItemsData]; }
                        this.status.selectedItems = selectedItemsData;
                        if (storedSelectedKeys != null) {
                            this.listSelectionChanged();
                        }
                        else {
                            this.updateDirectiveScopeAndModel();
                        }
                    });
            }
            else {
                if (storedSelectedKeys != null) {
                    this.listSelectionChanged();
                }
                else {
                    this.updateDirectiveScopeAndModel();
                }
            }
        }

        maxSelectedRowsReached(numberOfRowsToCheck?: number) {
            numberOfRowsToCheck = numberOfRowsToCheck || -1;
            const conditionReached = this.options.maxSelectedRows > 0 && (this.status.selectedItems.length >= this.options.maxSelectedRows || numberOfRowsToCheck > this.options.maxSelectedRows);

            if (conditionReached) {
                (this.dataTableInstance as any).buttons.info(this.resources.textResources.MaxSelectedRowsLimitationTitle,
                    (this.resources.textResources.MaxSelectedRowsLimitationMessage || "").replace("%d", this.options.maxSelectedRows),
                    2000);
            }

            return conditionReached;
        }

        updateDirectiveScopeAndModel(callback?) {
            const directiveScope = Common.getDirectiveScope(this.$scopeElement);
            //Update the directive scope
            directiveScope.selectedItems = this.status.selectedItems;
            directiveScope.selectedItemKeys = DatasourceManager.getKeys(directiveScope.selectedItems);

            //Update the model
            DatasourceManager.updateSelectedKeysInModel(this.serversideElementId,
                directiveScope.selectedItemKeys,
                this.status.allKeysSelected,
                Common.getIndexesOfControl(this.$scopeElement).indexes); //TODO: there is a 5th parameter for master page...

            //Refresh status from directive scope
            this.status.selectedKeys = directiveScope.selectedItemKeys;

            this.dataTableInstance.state.save();
            if (callback === false) return; //This case is only true when called from the picklist to avoid refreshLogic double execution

            //Update conditional formattings based on selected items
            window.$refreshLogic(() => {
                //Update action buttons and picklist buttons visibility based on the selected items state
                //after posible conditional formattings are executed
                this.updateActionButtonVisibility();
                //Execute callback if any
                if (callback) callback();
            });
        }

        showFullImage($img: JQuery) {
            var src = $img.attr("src");
            var $fullImg = $(`<img style='max-width: 100%; max-height: 100%; position: relative; top: 50%; transform: translateY(-50%);' src='${src}&thumbnail=false' />`).appendTo("body");

            window._popUpManager.showCustomPopUp({
                name: this.serversideElementId + src,
                title: "",
                width: "85%",
                height: "85%",
                destroyOnHide: true,
                $elementContent: $fullImg,
                cancelButton: true,
                onShowCallback: $popUp => {
                    $popUp.find("[jb-type='ModalBody']").css("text-align", "center");
                },
                dismissible: true
            });
        }

        updateCellValue($input: JQuery) {
            //Get the corresponding column header of the editable input in action
            const $columnHeader = $(this.dataTableInstance.column(this.dataTableInstance.cell($input.closest("td")).index().column).header());
            //Get the columnInfo for from the column header
            const columnInfo = this.getColumnInfoForElement($columnHeader);
            const rowData = (this.dataTableInstance.row(this.dataTableInstance.cell($input.closest("td")).index().row).data() as any);
            let cellValue = $input.val();
            if ($input.is("input[type='checkbox']")) {
                cellValue = $input.is(":checked");
            } else if ($input.hasClass("datetime-picker")) {
                cellValue = $input.data("selectedTime");
            }
            const requestParameters = {
                "key": rowData._key,
                "property": columnInfo.name,
                "value": cellValue
            };

            //We also need to update the altered value in datatables instance. To do that we need to make the update the cache
            //and refresh the instance from the altered cache state.
            const cachedRowData = this.cache.data.data.filter(item => item._key === requestParameters.key)[0];
            if (cachedRowData == undefined) {
                this.handleError("DATALIST ERROR: Could not find item with key " + requestParameters.key + " in datatables cache. The updated item will have its value overwriten in the server!");
            }
            cachedRowData[requestParameters.property] = requestParameters.value;
            this.updateDatasourceFromCache();

            /* NOTE: If the updated row data exists in the ViewModel (e.g. the datasource is associated with the viewmodel)
             *       then every reference of this instance must be updated too. Otherwise during the desirialization process
             *       the first unique instance will be used for reconstructing every other reference in the ViewModel. This means
             *       that even though we change the cell value in the DataList, this value will be overwriten by a previous outdated
             *       value of the same row instance, if such references exist.
             *
             *       The original approach was to handle this scenario through the reference reconstructor, but it still had some
             *       bugs in the code (or an architectural flow) and the following call does not work currently:
             *
             *          Common.updateInstanceReferencesAccrossModel(cachedRowData);
             *
             *       As an alternative and only for the case of datalist update feature, the following function parses the entire ViewModel
             *       and returns every reference of the row data instance we currently handle in order to update the new cell value manually.
             */
            const referencesAccrossModel = this.getReferencesAccrossViewModel(rowData._key, rowData._originalTypeClassName);
            for (let i = 0; i < referencesAccrossModel.length; i++) {
                if (referencesAccrossModel[i][requestParameters.property] !== undefined) {
                    referencesAccrossModel[i][requestParameters.property] = requestParameters.value;
                }
            }

            if (this.options.onUpdateAction === null) {
                const options = {
                    controller: window._context.currentController,
                    action: this.serversideElementId + "_UpdateCell",
                    postData: requestParameters,
                    cb: () => { this.updateRowNumbers(); }
                };
                Core.executeControllerActionNew(options);
            } else {
                Core.getScope().actions[this.options.onUpdateAction](rowData);
            }
        }

        getReferencesAccrossViewModel(key, runtimeType) {
            const seenInstances = [];
            const results = [];

            if (key == undefined || key == null || runtimeType == undefined || runtimeType == null || typeof runtimeType !== "string" || runtimeType.length === 0) {
                this.handleError("DATALIST ERROR: Invalid key and/or runtime type during cell update. Cannot dected references accross model with invalid search info.");
                return [];
            }

            //Recursive function that searches by _key and class name
            const searchForReferences = (rootObject, key, runtimeType) => {
                //If we parsed this object instance skip to avoid cycles
                if (seenInstances.indexOf(rootObject) > -1) { return; }

                //Add the current instance to the seen instances
                seenInstances.push(rootObject);

                //Handle the array type case
                if (rootObject instanceof Array) {
                    for (var i = 0; i < rootObject.length; i++) {
                        searchForReferences(rootObject[i], key, runtimeType);
                    }
                }
                else {
                    //If it's not a complex object stop the iteration
                    if (!(rootObject instanceof Object)) { return; }

                    //...else check for the key and the runtime type
                    if (rootObject._key != undefined && rootObject._originalTypeClassName != undefined
                        && rootObject._key == key && rootObject._originalTypeClassName == runtimeType
                        && results.indexOf(rootObject) === -1) {
                        results.push(rootObject);
                    }

                    //Check the current object
                    for (var prop in rootObject) {
                        //Ignore primitive datatypes and functions
                        if (!(rootObject[prop] instanceof Object) || typeof rootObject[prop] === "function") { continue; }

                        searchForReferences(rootObject[prop], key, runtimeType);
                    }
                }
            };

            searchForReferences(window["$form"].model, key, runtimeType);
            return results;
        }

        getColumnsConfiguration(): Array<any> {
            const dataTablesColumnInfo: Array<any> = [];

            if (this.options.showRowNumbers) {
                dataTablesColumnInfo.push({     //This is the row index column
                    "data": null,
                    "className": "row-number-column",
                    "title": "",
                    "orderable": false,
                    "searchable": false,
                    "width": "50px",
                    "render": (data, type, row) => {
                        return "";
                    }
                });
            }

            for (let i = 0; i < this.status.columnInfo.length; i++) {
                const columnInfo = this.status.columnInfo[i];

                dataTablesColumnInfo.push({
                    "title": this.getColumnHeaderHTML(columnInfo, i),
                    "data": columnInfo.name,
                    "name": columnInfo.name,
                    "orderable": columnInfo.orderable,
                    "searchable": this.options.isSearchable && columnInfo.searchable,
                    "width": columnInfo.width,
                    "className": columnInfo.classes || "",
                    "render": (data, type, row) => { return this.cellRender(data, type, row, columnInfo); }
                });
            }

            return dataTablesColumnInfo;
        }

        cellRender(data: any, type: string, row: any, columnInfo: DataListColumnInfo) {
            let outputData: string;
            const numericDataTypes = ["byte", "int", "long", "float", "decimal", "double"];
            var valueFormat = new ValueFormat(columnInfo.formatting as any);

            //Safely handle empty fields
            if (data == null) {
                outputData = "";
            }
            else if (columnInfo.dataType == "FileData" && data != null) {
                outputData = `${window._context.siteRoot}${window._context.currentController}/Download_${this.serversideElementId}_${columnInfo.name}?key=${row._key}`;
            }
            else if (columnInfo.formatting != null) {
                outputData = valueFormat.format(data);
            }
            else if (columnInfo.mambaDataTypeIsEnum === true) {
                //Try to find the enum in order to display string info instead of numbers
                const enumClass = window[window["_context"].appName].BO[columnInfo.mambaDataType];
                outputData = enumClass != undefined && enumClass[data] != undefined ? enumClass[data] : data;
            }
            else {
                outputData = data;
            }

            if (type === "groupKey") {
                return outputData;
            }

            if (columnInfo.editable) {
                switch (columnInfo.dataType.toLowerCase()) {
                    case "datetime":
                        // return "<input type='text' class='form-control datetime-picker editable-input' value='" + outputData + "' formatting='" + columnInfo.formatting + "' />";
                        // FORCE formatting for now...
                        // We use moment.js compatible formats for cell values and datepickers, but our C# backend 
                        // is incompatible with them and we need A LOT of effort to implement convertions between them
                        // See related comment on RuntimePredicateBuilder.cs
                        const forcedDateFormat = "DD/MM/YYYY";
                        const inputValue = data != null ? valueFormat.format(data) : "";
                        
                        return "<input type='text' class='form-control datetime-picker editable-input' value='" + inputValue + "' formatting='" + forcedDateFormat + "' editable-formatting='" + (valueFormat as any).dateFormat + "' style='" + columnInfo.css + "' />";

                    case "bool":
                        const isChecked = outputData ? "checked='checked'" : "";
                        return "<input type='checkbox' class='editable-input' " + isChecked + " style='" + columnInfo.css + "' />";

                    default:
                        const value = data == null ? "" : data;
                        const isNumeric = Common.getMambaDataType(columnInfo.dataType) === MambaDataType.NUMBER;

                        return "<input type='text' class='form-control editable-input" + (isNumeric ? " numeric-mask" : "") + "' value='" + value + "' style='" + columnInfo.css + "' />";
                }
            }
            else {
                switch (columnInfo.itemType) {
                    case DataListColumnItemType.IMAGEBOX:
                        var extraImgCls = columnInfo.showFullImage == true
                            ? "show-full"
                            : "";

                        var extraCss = columnInfo.showFullImage == true
                            ? "cursor: pointer;"
                            : "";

                        return outputData == "" || outputData == null
                            ? ""
                            : `<img class='datalist-img ${extraImgCls}' data-src='${outputData}' style='${extraCss} ${columnInfo.css}' />`

                    case DataListColumnItemType.DOWNLOADLINK:
                        if (outputData == "" || outputData == null) return "";

                        return columnInfo.dataType == "FileData"
                            ? `<a class='download-link' target='_blank' href='${outputData}' style='${columnInfo.css}'>${data.FileName}</a>`
                            : `<a class='download-link' target='_blank' href='DownloadFileByPath?path=${outputData}' style='${columnInfo.css}'>${outputData}</a>`;

                    case DataListColumnItemType.CHECKBOX:
                        const isChecked = outputData ? "checked='checked'" : "";
                        return "<input type='checkbox' " + isChecked + "disabled='disabled' style='" + columnInfo.css + "' />";

                    case DataListColumnItemType.HYPERLINK:
                        return `<a target='_blank' href='${outputData}' style='${columnInfo.css}'>${outputData}</a>`;

                    case DataListColumnItemType.HTML:
                        var content = $("<div></div>").html(outputData).text();
                        return "<div class='output-data' style='" + columnInfo.css + "'>" + content + "</div>";

                    default:
                        return "<div class='output-data' style='" + columnInfo.css + "'>" + outputData + "</div>";
                }
            }
        }

        /* NOTE: Because the header is currently handled as a string and not as jQuery elements
         *       the html is passed to the title column attribute and the element behaviour is
         *       defined at the init callback function
         */
        getColumnHeaderHTML(columnInfo, index) {
            const caption = columnInfo.caption || columnInfo.name;
            const resizableGrip = this.options.hasResizableColumns ? "<div class='resize-grip'></div>" : "";
            const labelHTML = `<label class='header-label' data-original-index='${index}' data-name='${columnInfo.name}'>${caption}</label>${resizableGrip}`;

            if (!(this.options.isSearchable && columnInfo.searchable)) { return labelHTML; }

            const $wrapper = $("<div class='quick-filter'></div>");
            let $input: JQuery;

            switch (columnInfo.dataType.toLowerCase()) {
                case "bool":
                    $input = $("<select class='form-control search-select'> \
                                    <option value=''></option> \
                                    <option value='true'>"+ this.resources.textResources.True + "</option> \
                                    <option value='false'>"+ this.resources.textResources.False + "</option> \
                                </select>");
                    break;
                case "datetime":
                    $input = $("<input type='text' class='datetime-picker search-input form-control' placeholder='" + this.resources.textResources.Search + "' />");
                    $input.attr("formatting", columnInfo.formatting.dateFormat);
                    break;
                default:
                    $input = $("<input type='text' class='search-input form-control' placeholder='" + this.resources.textResources.Search + "' />");
                    break;
            }

            //Convert input to search element
            const $searchElement = this.convertInputToSearchElement($input);
            $wrapper.append($searchElement);

            return labelHTML + $wrapper.get(0).outerHTML;
        }

        getDatatablesButtonsConfiguration() {
            const buttons: Array<Object> = [];
            const columnFilter = this.options.showRowNumbers ? ":gt(0)" : undefined;

            /* NOTE: These buttons are displaying only an icon and their description
             *       is passed as a bootstrap tooltip. The tooltip needs to be enabled
             *       after producing the actual HTML element.
             */
            if (this.options.canHideShowColumns) {
                buttons.push({
                    extend: "colvis",
                    text: "<span class='bootstrap-tooltip' data-toggle='tooltip' data-placement='top' title='" + this.resources.dataTablesResources.buttons.colvis + "'><span class='glyphicon glyphicon-th-list'></span></span>",
                    className: "column-visibility-button",
                    columns: columnFilter,
                    columnText: (dt, idx, title) => {
                        //Both glyphicon hidden/visible elements are added and the proper icon visibility is handled through css
                        return "<span class='glyphicon glyphicon-eye-open'></span> \
                                <span class='glyphicon glyphicon-eye-close'></span> \
                                <span class='caption'>" + title + "</span>";
                    }
                });
            }

            if (this.options.canCopyToClipboard) {
                buttons.push({
                    extend: "copy",
                    text: "<span class='bootstrap-tooltip' data-toggle='tooltip' data-placement='top' title='" + this.resources.dataTablesResources.buttons.copy + "'><span class='glyphicon glyphicon-duplicate'></span></span>",
                    className: "copy-button"
                });
            }

            return buttons;
        }

        getPageSizeInfo() {
            let sizesValue: Array<number>;
            const sizesText: Array<string> = [];

            if (!this.options.hasPaging) {
                sizesValue = [-1];
            } else {
                sizesValue = this.options.pageSizes;
            }

            for (let i = sizesValue.length - 1; i >= 0; i--) {
                if (sizesValue[i] > 0) {
                    sizesText.push(sizesValue[i] + " " + this.resources.textResources.Records);
                } else if (sizesValue[i] == -1) {
                    sizesText.push(this.resources.textResources.All);
                } else {
                    sizesValue.splice(i, 1);
                }
            }

            return [sizesValue, sizesText.reverse()];
        }

        getColumnInfoForElement($columnHeader) {
            const columnIndex = $columnHeader.find(".header-label").data("original-index");
            const columnInfo = this.status.columnInfo[columnIndex];

            return columnInfo;
        }

        getAggregator(columnName, aggregatorType) {
            const aggregator = $.grep(this.status.aggregators, (item) => {
                return item.column === columnName && item.type === aggregatorType;
            });

            return aggregator[0];
        }

        isAggregatorDisabled($columnHeader, aggregatorType) {
            const columnInfo = this.getColumnInfoForElement($columnHeader);
            return this.getAggregator(columnInfo.name, aggregatorType) == undefined;
        }

        sanitizeColumnName(name) {
            return name.replace(/\W/, DataListControl.SANITIZE_COLUMN_REPLACEMENT_VALUE);
        }
        handleError(error) {
            //TODO: Handle errors in a more sophisticated way :P
            console.log(error);
            this.$loadingPanel.hide();
        }
        /****************************************** Data Helper Functions [END] ******************************************/

        /************************************* [BEGIN] State-Status Mapping Functions **************************************/
        dataTablePageEvent() {
            const pageInfo = this.dataTableInstance.page.info();
            this.status.startRow = pageInfo.page * this.status.pageSize;
            //If single selection is active clear selected item from previous pages
            if (!this.options.hasMultiSelect && this.status.selectedItems.length === 1) {
                this.setSelectedItemKeys([]);
                this.listSelectionChanged();
            }
        }

        dataTablePageSizeEvent() {
            const pagelength = this.dataTableInstance.page.len();
            this.dataTableInstance.page(0);
            this.status.startRow = 0;

            if (pagelength > 0) {
                this.status.pageSize = pagelength;
            } else {
                this.dataTableInstance.page.len(DataListControl.MAX_ROWS);
                this.status.pageSize = DataListControl.MAX_ROWS;
                this.$wrapperElement.find(".dataTables_length select").val(-1);
            }
        }

        dataTableOrderEvent(event) {
            const order = this.dataTableInstance.order();
            const previousOrderStatus = this.status.orderBy;

            this.status.orderBy = []; //Always reset status
            this.$wrapperElement.find(".order-indicator").remove(); //...and remove order indicators

            if (order !== undefined) {
                const excludedColumns = []; /* This is used to remove a column ordering when the ordering switching skips the NoOrder state
                                               e.g. a column that goes from OrderDesc to OrderAsc state instead of NoOrder */

                for (let i = 0; i < order.length; i++) {
                    const $columnHeader = $(this.dataTableInstance.columns(order[i][0]).header()[0]);
                    const orderingColumn = this.getColumnInfoForElement($columnHeader);
                    const orderingDirection = order[i][1] === "asc" ? OrderByDirections.ASC : OrderByDirections.DESC;
                    const orderColumnInStatus = $.grep(previousOrderStatus, (o) => { return o.column.name == orderingColumn.name; })[0];

                    /* This last check is to add an extra state while switching the ordering
                     * in a column. The states are changed circularly: NoOrder -> OrderAsc -> OrderDesc -> NoOrder 
                     * It's required for single column sorting cases */
                    if (orderColumnInStatus != undefined && orderColumnInStatus.direction === OrderByDirections.DESC && orderingDirection === OrderByDirections.ASC) {
                        excludedColumns.add({ "name": orderColumnInStatus.column.name, "index": order[i][0] });
                    } else {
                        this.status.orderBy.add(new OrderByInfo(orderingColumn, orderingDirection));

                        //Create order indicators if multiple columns are ordered
                        if (order.length > 1) {
                            const $indicator = $("<span></span>");
                            $indicator.addClass("order-indicator");
                            $indicator.text(i + 1);
                            $columnHeader.append($indicator);
                        }
                    }
                }

                if (excludedColumns.length > 0) {
                    this.dataTableInstance.order($.grep(order, (o) => { return !excludedColumns.some((i) => { return i.index == o[0]; }); }));
                }
            } else {
                this.dataTableInstance.order([]);
            }
        }

        dataTableColumnReorderEvent(details: any) {
            //If datatables is not initialized return
            if (!this.isInitialized) { return; }

            //If we have groups and aggregators redraw the groups in order to
            //reposition the group aggregators under the correct column
            if (this.cache.groups != null && this.cache.aggregators != null) {
                this.renderGroups();
            }
            this.updateRowNumbers();
        }

        dataTableColumnVisibilityEvent(event, settings, columnIndex, state) {
            const self = this;
            const $columnHeader = $(this.dataTableInstance.column(columnIndex).header());
            var columnInfo = this.getColumnInfoForElement($columnHeader);

            if (columnInfo != null) {
                columnInfo.isVisible = state;
                columnInfo.visible = state;
            }

            this.dataTableInstance.state.save();

            //If we have groups and aggregators redraw the whole table to properly handle group aggregator cells
            if (this.cache.groups != null && this.cache.aggregators != null) {
                this.updateDatasourceFromCache();
                return;
            }

            //If the state was changed to hidden the specific column is removed from DOM
            //and nothing should be done apart from hiding the according group aggregator
            //cell if any
            if (state === false) {
                //Hide group aggregator column cell
                if (this.cache.groups != null && this.cache.aggregators != null) {
                    this.$element.find(".group-aggregators-row td:nth-child(" + (this.options.showRowNumbers ? columnIndex + 1 : columnIndex) + ")").hide();
                }
                return;
            }

            //Else update the quick-filter in the header based on the quick-filter visibility state            
            const $quickfilterButton = this.$wrapperElement.find(".quick-filter-button");
            const quickfiltersVisible = $quickfilterButton.data("visible") != undefined && $quickfilterButton.data("visible") === true;

            $columnHeader.find(".quick-filter").toggle(quickfiltersVisible);

            //Show group aggregator column cell
            if (this.cache.groups != null && this.cache.aggregators != null) {
                this.$element.find(".group-aggregators-row td:nth-child(" + (this.options.showRowNumbers ? columnIndex + 1 : columnIndex) + ")").show();
            }
            //Initialize possible datetime editable input field...
            //If an editable column exists but is hidden it wouldn't be initialized in the drawCallback so it must be initialized here
            this.$element.find("tbody .datetime-picker").each(function () {
                self.intializeDateTimePicker($(this));
            });

            //Initialize possible numeric editable input masks...
            this.$element.find("tbody .numeric-mask").each(function () {
                self.applyNumericMask($(this));
            });
        }

        /*********************** [BEGIN] Search ***********************/

        addGlobalSearch(globalSearchTerm: string, autoApply: boolean) {
            this.removeFiltersFromGlobalSearch();

            if (globalSearchTerm != null && globalSearchTerm.trim() != "") {
                const guessedSearchTermType = Common.guessStringMambaDataType(globalSearchTerm);

                for (let i = 0; i < this.status.columnInfo.length; i++) {
                    const columnInfo = this.status.columnInfo[i];

                    if (columnInfo.searchable === false) { continue; }
                    
                    const columnInfoMambaDataType = Common.getMambaDataType(columnInfo.mambaDataType);
                    //send undefined for back-end handling. Propably enumerators
                    if (columnInfoMambaDataType !== undefined) {
                        //Skip non compatible columns.
                        switch (guessedSearchTermType) {
                            case MambaDataType.BOOL:
                                if (!(columnInfoMambaDataType === MambaDataType.BOOL ||
                                    columnInfoMambaDataType === MambaDataType.STRING))
                                    continue;
                                break;
                            case MambaDataType.NUMBER:
                                if (!(columnInfoMambaDataType === MambaDataType.NUMBER ||
                                    columnInfoMambaDataType === MambaDataType.STRING))
                                    continue;
                                break;
                            case MambaDataType.DATETIME:
                                if (!(columnInfoMambaDataType === MambaDataType.DATETIME ||
                                    columnInfoMambaDataType === MambaDataType.STRING))
                                    continue;
                                break;
                            case MambaDataType.STRING:
                                if (columnInfoMambaDataType !== MambaDataType.STRING)
                                    continue;
                                break;
                        }
                    }

                    let operator = this.getFilterOperatorBasedOnColumnDataType(columnInfo);

                    var filter =
                        new DataListFilterInfo(columnInfo, globalSearchTerm, RowOperators.OR, operator, undefined, DataListFilterType.Global);

                    this.status.filters.push(filter);
                }
            }

            if (autoApply === true) {
                this.dataTableInstance.ajax.reload();
            }
        }

        getFilterOperatorBasedOnColumnDataType(col: DataListColumnInfo): FilterOperators {
            var colDataType = Common.getMambaDataType(col.mambaDataType);
            var useLikeOperator = colDataType === MambaDataType.STRING || colDataType === MambaDataType.DATETIME || colDataType === undefined;

            return useLikeOperator
                ? FilterOperators.LIKE
                : FilterOperators.EQUAL_TO;
        }

        removeFiltersFromGlobalSearch() {
            // reverse loop when removing, for keeping indexes valid!
            for (let i = this.status.filters.length - 1; i > -1; i--) {
                var current = this.status.filters[i];

                if (current.type != DataListFilterType.Global) continue;

                this.status.filters.splice(i, 1);
            }
        }

        addQuickFilter(columnInfo: DataListColumnInfo, quickFilterSearchTerm: string) {
            this.removeQuickFilterFromColumn(columnInfo);

            if (quickFilterSearchTerm == null ||
                (quickFilterSearchTerm.trim && quickFilterSearchTerm.trim() === "")) return;

            var operator = this.getFilterOperatorBasedOnColumnDataType(columnInfo);

            var filter = new DataListFilterInfo(columnInfo, quickFilterSearchTerm, RowOperators.AND, operator, undefined, DataListFilterType.Quick);

            this.status.filters.push(filter);
        }

        removeQuickFilterFromColumn(col: ColumnInfo) {
            // reverse loop when removing, for keeping indexes valid!
            for (let i = this.status.filters.length - 1; i > -1; i--) {
                var current = this.status.filters[i];

                if (current.type != DataListFilterType.Quick || current.column.name != col.name) continue;

                this.status.filters.splice(i, 1);
            }
        }

        addCustomFilter(term: string, columnName: string, controlId: string, filterOp: string, rowOp: string, overwriteExisting: boolean, autoApply: boolean) {
            var columnInfo = this.getColumnInfoByName(columnName);

            if (overwriteExisting === true) {
                this.removeCustomFilterFromColumn(columnInfo);
            }

            if (term != null && (term.trim == null || (term.trim() != "" && term.trim() != "?"))) {
                var operator: FilterOperators = FilterOperators[filterOp];
                var rowOperator: RowOperators = RowOperators[rowOp];

                var filter =
                    new DataListFilterInfo(columnInfo, term.toString(), rowOperator, operator, undefined, DataListFilterType.Custom, controlId);

                this.status.filters.push(filter);
            }
            else {
                this.removeCustomFilterByControlId(controlId);
            }

            if (autoApply === true) {
                this.dataTableInstance.ajax.reload();
            }
        }

        removeCustomFilterByControlId(id: string) {
            // reverse loop when removing, for keeping indexes valid!
            for (let i = this.status.filters.length - 1; i > -1; i--) {
                var current = this.status.filters[i];

                if (current.controlId != id) continue;

                this.status.filters.splice(i, 1);
            }
        }

        removeCustomFilterFromColumn(col: ColumnInfo) {
            // reverse loop when removing, for keeping indexes valid!
            for (let i = this.status.filters.length - 1; i > -1; i--) {
                var current = this.status.filters[i];

                if (current.type != DataListFilterType.Custom || current.column.name != col.name) continue;

                this.status.filters.splice(i, 1);
            }
        }

        removeAllCustomFilters() {
            // reverse loop when removing, for keeping indexes valid!
            for (let i = this.status.filters.length - 1; i > -1; i--) {
                var current = this.status.filters[i];

                if (current.type != DataListFilterType.Custom) continue;

                this.status.filters.splice(i, 1);
            }

            $("[joove-ds-filter='true'][joove-ds-filter-for='" + this.dataSetName + "']").val("");
        }

        getColumnInfoByName(name: string) {
            for (let i = 0; i < this.status.columnInfo.length; i++) {
                var current = this.status.columnInfo[i];

                if (current.name == name) return current;
            }
        }

        clearAllSearchFields() {
            this.$wrapperElement.find(".search-input").val("").change();
            this.$wrapperElement.find(".search-select").val(null);

            this.dataTableInstance.search("");
            for (let i = 0; i < this.dataTableInstance.columns().count(); i++) {
                const currentSearchTerm = this.dataTableInstance.columns(i).search()[0];
                if (currentSearchTerm.length > 0) {
                    this.dataTableInstance.columns().search("");
                }
            }
        }

        dataTableSearchEvent() {
            // Quick filters
            for (let i = 0; i < this.status.columnInfo.length; i++) {
                const columnIndex = this.options.showRowNumbers ? i + 1 : i;
                const quickFilterSearchTerm = this.dataTableInstance.columns(columnIndex).search()[0].trim();

                const $columnHeader = $(this.dataTableInstance.columns(columnIndex).header()[0]);
                const columnInfo = this.getColumnInfoForElement($columnHeader);

                if (quickFilterSearchTerm.length === 0) {
                    this.removeQuickFilterFromColumn(columnInfo);
                }
                else {
                    this.addQuickFilter(columnInfo, quickFilterSearchTerm);
                }
            }

            // Global Search
            const globalSearchTerm = this.dataTableInstance.search().trim();

            if (globalSearchTerm.length > 0) {
                this.addGlobalSearch(globalSearchTerm, false);
            }
            else {
                this.removeFiltersFromGlobalSearch();
            }
        }
        /*********************** Search [END] ***********************/

        dataTableSelectEvent(event, datatable, type, indexes) {
            //NOTE: This event only handles selections that are triggered by the datatables select event
            //      Other cases such as select all recordset and programmatically selecting values are handled
            //      in seperate functions.
            if (type === "row") {
                for (let i = 0; i < indexes.length; i++) {
                    const rowData = datatable.rows().data()[indexes[i]];
                    if (event.type === "select") {
                        //If the is item isn't already included add it to status
                        if (!this.status.selectedItems.some((item) => { return item._key === rowData._key })) {
                            this.status.selectedItems.push(rowData);
                        }
                    } else if (event.type === "deselect") {
                        const indexOnSelectedItems = this.status.selectedItems.indexOf(this.status.selectedItems.filter((item) => { return item._key === rowData._key })[0]);

                        if (indexOnSelectedItems > -1) {
                            this.status.selectedItems.splice(indexOnSelectedItems, 1);
                        }
                    }
                }
            }
        }

        /************************************* State-Status Mapping Functions [END] **************************************/

        /***************************************** [BEGIN] Custom functionalities ******************************************/
        initializeDatepickerPlugIn() {
            if (window.momentJsInitialized || window.moment == null || $.datetimepicker == null) return;

            // Configure Timepicker to use moment.js (only once)
            Date["parseDate"] = (input, format) => moment(input, format).toDate();
            Date.prototype.dateFormat = function (format) {
                return moment(this).format(format);
            };
            window.momentJsInitialized = true;

            // Apply Locales
            $.datetimepicker.setLocale(window._context.locale);
        }

        drawCallback() {
            const self = this;
            //Draw callback should be executed only after initialization
            if (!this.isInitialized) return;

            if (this.status.groupBy.length > 0 && this.cache.groups != null) {
                this.renderGroups();
            }

            // apply rules (that may change size, so before resizing)
            this.applyConditionalFormattings();

            //Initialize datetime-picker editable controls
            this.$element.find("tbody .datetime-picker").each(function () {
                self.intializeDateTimePicker($(this));
            });

            //Initialize possible numeric editable input masks
            this.$element.find("tbody .numeric-mask").each(function () {
                self.applyNumericMask($(this));
            });

            //Readjust size
            if (this.options.isStandAlone || this.options.isPickList) {
                this.updateDataTableSize();
            }


            //Execute possible externaly assigned logic
            if (this.drawCallbackExtraFunctionality) {
                this.drawCallbackExtraFunctionality();
            }

            //Initialize lazy image loading
            this.$element.find(".datalist-img").each(function () {
                new LazyImageLoader($(this), false);
            });

            this.fixPager();
        }

        // This dirty function is used to "fix" pager and records info
        // when a view is loaded from local storage. DataTables lib resets to first page
        // and we have to simulate a call (updateFromCache flag prevents actuall call)
        // in order to sync them. Of course this needs testing, since it may cause issues.
        fixPager() {
            if (this.options.hasPaging != true) return;

            var controlPagingInfo = this.dataTableInstance.page.info();
            var pageFromStatus = Math.floor(this.status.startRow / this.status.pageSize);
            var pageFromControl = controlPagingInfo.page;

            if (pageFromStatus == pageFromControl || pageFromStatus < 0 || pageFromStatus + 1 > controlPagingInfo.pages) return;

            this.updateFromCache = true;
            this.dataTableInstance.page(pageFromStatus);
            this.dataTableInstance.ajax.reload(null, false);
            this.updateFromCache = false;
        }

        updateDataTableSize() {
            const controlStandardHeight = this.$wrapperElement.height() - this.$element.parent().height();
            if (this.options.isPickList) {
                const modalPopUpHeight = this.$wrapperElement.closest("." + DataListControl.PICKLIST_POPUP_MODAL_CLASS).height();
                this.$element.parent().height(modalPopUpHeight - controlStandardHeight);
            } else if (this.options.isStandAlone) {
                const themeSettingForHeight = window._themeManager.getControlVariableByElement("@StaticElementsHeight", this.$element);
                let outerElementsHeight = themeSettingForHeight == null
                    ? null
                    : parseInt(themeSettingForHeight.value);

                if (outerElementsHeight == null || isNaN(outerElementsHeight)) {
                    const $dummyElement = $("<div class='" + DataListControl.STANDALONE_OUTER_ELEMENTS_DUMMY_CLASS + "' ></div>");

                    //The dummy element is attached and detached to the body in order to get it's
                    //height from the dummy class. This height specifies the total height of any
                    //other elements in page
                    $("body").append($dummyElement);
                    outerElementsHeight = $dummyElement.height();
                    $dummyElement.remove();
                }

                this.$element.parent().height(window.innerHeight - controlStandardHeight - outerElementsHeight);
            }
            //Re-adjust width
            this.dataTableInstance.columns.adjust();

            /* NOTE: Because Edge browser, the Retarded cousin of IE, doesn't honour the word-break
             *       CSS rule we inject a colgroup to the main table in order to obey the th widths
             */
            if (window.navigator.userAgent.indexOf("Edge") > -1) {
                const $colGroup = $("<colgroup></colgroup>");
                for (let i = 0; i < this.dataTableInstance.columns().count(); i++) {
                    const header = this.dataTableInstance.column(i).header();
                    var widthRegexp = /[\s;]*width\s*:\s*([0-9]+.?([0-9]+)?px);?.*/;
                    var match = widthRegexp.exec($(header).attr("style"));

                    if (match != null) {
                        $colGroup.append($("<col style='width: " + match[1] + "'></col>"));
                    } else {
                        $colGroup.append($("<col></col>"));
                    }
                }

                this.$element.children("colgroup").remove();
                this.$element.append($colGroup);
            }
        }

        updateRowNumbers() {
            if (this.options.showRowNumbers) {
                (this.dataTableInstance.column(0).nodes() as any).each((cell, i) => {
                    cell.innerHTML = this.status.startRow + i + 1;
                });
                //Re-adjust table width to avoid differences between header and body content width
                this.dataTableInstance.columns.adjust();
            }
        }

        /*********************** [BEGIN] Global search configuration ***********************/
        configureGlobalSearch() {
            //Get the search element
            const $globalSearchInputWrapper = this.$wrapperElement.find(".filter .dataTables_filter");
            const $globalSearchInput = $globalSearchInputWrapper.find("input");
            $globalSearchInput.attr("placeholder", this.resources.textResources.Search);
            //The following classes are needed in order to attach the search element event handlers
            $globalSearchInput.addClass("search-input");
            $globalSearchInputWrapper.addClass("global-search");

            //Remove the automatic search request on each keypress
            $globalSearchInput.off();

            //Convert input to search element
            const $searchElement = this.convertInputToSearchElement($globalSearchInput);
            this.attachSearchElementEventHandlers($searchElement);
            //...and append it to the inputs original place
            $globalSearchInputWrapper.append($searchElement);
        }
        /*********************** Global Search configuration [END] ***********************/

        /*********************** [BEGIN] Quick-filters configuration ***********************/
        configureQuickFilters() {
            const $quickfilterButton = $("<button class='btn btn-default quick-filter-button'> \
                                                <span class='bootstrap-tooltip' data-toggle='tooltip' data-placement='top' title='" + this.resources.textResources.QuickFilters + "' > \
                                                    <span class='" + DataListControlResources.icons.filter.bs + "' ></span> \
                                                </span> \
                                          </button>");
            const $globalSearchActions = this.$wrapperElement.find(".global-search .search-actions");
            $globalSearchActions.append($quickfilterButton);

            const self = this;
            /*      
             *      IMPORTANT: Some event handlers are intentionally not a lamba expressions in order to keep the scope 
             *                 refering to indentifier 'this' as a HTML element and not as the DataListControl class
             */

            //Toggle quick-filters
            if (this.$wrapperElement.find(".quick-filter").length > 0) {
                $quickfilterButton.on("click",
                    (event) => {
                        const visible = $quickfilterButton.data("visible") != undefined && $quickfilterButton.data("visible") === true; //Check the quickfilter visibility state
                        this.$wrapperElement.find(".quick-filter").toggle();
                        $quickfilterButton.data("visible", !visible); //Update the quickfilter visibility state
                        this.updateDataTableSize();
                    });
            } else {
                $quickfilterButton.hide();
            }

            //Attach event handlers to quick-filter elements
            this.$wrapperElement.find(".quick-filter .search-element").each(function () {
                self.attachSearchElementEventHandlers($(this));
            });

            //If there are quickfilters loaded from the saved state of the list
            //show the quickfilters in the list header
            const enabledQuickFilters = this.status.filters.filter(f => { return f.type == DataListFilterType.Quick; });
            if (enabledQuickFilters.length > 0) {
                $quickfilterButton.click();
            }

            //Disable header sort functionality when accessing quick-filter elements
            this.$wrapperElement.find(".quick-filter").each(function () {
                if (enabledQuickFilters.length > 0) {
                    //If quickfilter values are set, check whether they relate to the current element
                    const columnInfo = self.getColumnInfoForElement($(this).parent());
                    const currentQuickfilterValue = enabledQuickFilters.filter(f => { return f.column.name == (columnInfo != undefined ? columnInfo.name : ""); });
                    if (currentQuickfilterValue.length === 1) {
                        //...if so set the value and trigger the change event
                        const $searchInput = $(this).find(".search-input");
                        $searchInput.val(currentQuickfilterValue[0].value);
                        $searchInput.change();
                    }
                }
                $(this).on("click", (event) => {
                    event.stopPropagation();
                });
            });

            //Initialize any datepicker element on quick-filters
            this.$wrapperElement.find(".quick-filter .datetime-picker ").each(function () {
                self.intializeDateTimePicker($(this));
            });
        }
        /*********************** Quick-filters configuration [END] ***********************/

        /*********************** [BEGIN] Custom button functionalities ***********************/
        configureCustomFunctionalityButtons() {
            const $buttonsGroup = this.$wrapperElement.find(".settings .buttons .dt-buttons");

            // Composite Filters
            if (this.options.structuredFiltering === true) {
                var res = this.resources.textResources.FiltersPopUpTitle

                const $filtersButton = $("<a class='btn btn-default composite-filters' > \
                                                <span class='bootstrap-tooltip' data-toggle='tooltip' data-placement='top' title='" + res + "'> \
                                                    <span class='glyphicon glyphicon-zoom-in'></span> \
                                            </span> \
                                         </a>");

                $filtersButton.on("click", (event) => {
                    this.compositeFiltersHelper.show();
                });

                $buttonsGroup.append($filtersButton);
            }

            // Refresh Button
            if (this.options.showRefreshButton) {
                const $refreshButton = $("<a class='btn btn-default refresh' data-toggle='modal' > \
                                                <span class='bootstrap-tooltip' data-toggle='tooltip' data-placement='top' title='" + this.resources.textResources.Refresh + "'> \
                                                    <span class='glyphicon glyphicon-refresh'></span> \
                                            </span> \
                                         </a>");
                $refreshButton.on("click", (event) => {
                    this.dataTableInstance.draw(false);
                });
                $buttonsGroup.append($refreshButton);
            }

            // Reset Button
            const $resetButton = $("<a class='btn btn-default reset' > \
                                                <span class='bootstrap-tooltip' data-toggle='tooltip' data-placement='top' title='" + this.resources.textResources.Reset + "'> \
                                                    <span class='glyphicon glyphicon-repeat'></span> \
                                            </span> \
                                         </a>");
            $resetButton.on("click", (event) => {
                this.reset();
            });
            $buttonsGroup.append($resetButton);

            //Grouping
            if (this.options.isGroupable && this.status.columnInfo.some((column) => { return column.groupable; })) {
                const $groupingButton = $("<a class='btn btn-default bootstrap-modal grouping' data-toggle='modal' data-target='#" + this.clientsideElementId + "_grouping' > \
                                                <span class='bootstrap-tooltip' data-toggle='tooltip' data-placement='top' title='" + this.resources.textResources.Grouping + "'> \
                                                    <span class='glyphicon glyphicon-th'></span> \
                                            </span> \
                                       </a>");

                const $groupingModalDialog = this.getModalDialogElement("grouping", this.resources.textResources.Grouping, true);
                const $groupingDialogContent = this.getGroupDialogContent();
                $groupingModalDialog.addClass("datalist-grouping");

                this.initializeGroupingOptions($groupingDialogContent); //Set values
                $groupingModalDialog.find(".modal-footer .btn-ok").on("click", () => { this.applyGrouping(); });
                $groupingModalDialog.find(".modal-body").append($groupingDialogContent);  //Attach content to dialog
                this.$wrapperElement.append($groupingModalDialog);
                $buttonsGroup.append($groupingButton);
            }

            //Export
            if (this.options.isExportable) {
                const $exportButton = $("<a class='btn btn-default bootstrap-modal export' data-toggle='modal' data-target='#" + this.clientsideElementId + "_export'> \
                                                <span class='bootstrap-tooltip' data-toggle='tooltip' data-placement='top' title='" + this.resources.textResources.Export + "'> \
                                                    <span class='glyphicon glyphicon-download'></span> \
                                            </span> \
                                       </a>");

                const $exportModalDialog = this.getModalDialogElement("export", this.resources.textResources.Export, true);

                $exportButton.on("click", () => {
                    var $content = this.exportHelper.getPopUpContent();

                    $exportModalDialog.find(".modal-body").empty().append($content);
                });

                $exportModalDialog.find(".btn-ok").on("click", () => { this.exportHelper.okCallback($exportModalDialog); });

                this.$wrapperElement.append($exportModalDialog);

                $buttonsGroup.append($exportButton);
            }

            // Views
            var loggedIn = window._context.currentUsername != null && window._context.currentUsername != "";

            if (this.options.saveViews === true && loggedIn === true) {
                const $viewsButton = $("<a class='btn btn-default bootstrap-modal views' data-toggle='modal' data-target='#" + this.clientsideElementId + "_views'> \
                                                <span class='bootstrap-tooltip' data-toggle='tooltip' data-placement='top' title='" + this.resources.textResources.Views + "'> \
                                                    <span class='glyphicon glyphicon-floppy-disk'></span> \
                                            </span> \
                                       </a>");

                const $viewsModalDialog = this.getModalDialogElement("views", this.resources.textResources.Views, false);

                $viewsButton.on("click", () => {
                    var $content = this.viewsHelper.getPopUpContent();

                    $viewsModalDialog.find(".modal-body").empty().append($content);
                });

                this.$wrapperElement.append($viewsModalDialog);

                $buttonsGroup.append($viewsButton);
            }

            // Import
            if (this.options.importData === true) {
                var importResource = this.resources.textResources.Import;

                const $importButton = $("<a class='btn btn-default bootstrap-modal import' data-toggle='modal' data-target='#" + this.clientsideElementId + "_import'> \
                                                <span class='bootstrap-tooltip' data-toggle='tooltip' data-placement='top' title='" + importResource + "'> \
                                                    <span class='glyphicon glyphicon-upload'></span> \
                                            </span> \
                                       </a>");

                const $importModalDialog = this.getModalDialogElement("import", importResource, true);

                this.$wrapperElement.append($importModalDialog);

                $importButton.on("click", () => {
                    var $content = this.importHelper.getPopUpContent();

                    $importModalDialog.find(".modal-body").empty().append($content);

                    this.importHelper.resetResults($content);
                });

                $buttonsGroup.append($importButton);
            }

            if (this.options.useCustomModal) {
                this.intializeCustomModalListeners();
            }
        }

        /*********************** [BEGIN] Grouping ***********************/
        getGroupDialogContent() {
            const $content = $(`<div class='row'>
    <div class='col-xs-6 group-left'>
        <label>${this.resources.textResources.Column}</label>
        <div class='column-group'>
            <select class='available-columns' multiple='multiple'></select>
            <div class="btn-group btn-group-sm">
                <button type='button' jb-type="Button" class='jb-control jb-simple-btn btn btn-default add-group' ui-role-color="default">
                    <span class='glyphicon glyphicon-arrow-right'></span>
                </button>
                <button type='button' jb-type="Button" class='jb-control jb-simple-btn btn btn-default remove-group' ui-role-color="default">
                    <span class='glyphicon glyphicon-arrow-left'></span>
                </button>
            </div>
        </div>
        <div jb-type="HtmlContainer" class="pretty p-smooth p-default jb-control" ui-role-color="default">
            <input type='checkbox' class='get-groups-closed'/>
            <div class="state">
                <label>${this.resources.textResources.GetGroupsClosed}</label>
            </div>
        </div>
    </div>
    <div class='col-xs-6 group-right'>
        <label>${this.resources.textResources.GroupingOrder}</label>
        <div  class='column-group'>
            <select class='grouping-columns' multiple='multiple'></select>
            <div class='btn-group btn-group-sm'>
                <button jb-type="Button" class='jb-control jb-simple-btn btn btn-default move-up' ui-role-color="default">
                    <span class='glyphicon glyphicon-arrow-up'></span>
                </button>
                <button jb-type="Button" class='jb-control jb-simple-btn btn btn-default move-down' ui-role-color="default">
                    <span class='glyphicon glyphicon-arrow-down'></span>
                </button>
            </div>
        </div>
        <div jb-type="HtmlContainer" class="pretty p-smooth p-default jb-control" ui-role-color="default">
            <input type='checkbox' class='merge-group-levels'/>
            <div class="state">
                <label>${this.resources.textResources.MergedGroupLevels}</label>
            </div>
        </div>
    </div>
</div>
`);

            const $availableColumns = $content.find(".available-columns");
            const $groupingColumns = $content.find(".grouping-columns");
            /************************************ [BEGIN] Grouping dialog events ************************************/
            $content.find(".add-group").on("click", () => {
                const $selectedColumns = $availableColumns.find(":selected");
                for (let i = 0; i < $selectedColumns.length; i++) {
                    //If the selected column is not already added
                    if ($groupingColumns.find("option[value='" + $selectedColumns.eq(i).val() + "']").length === 0) {
                        //...hide from the available columns and clone it on the grouping columns
                        $groupingColumns.append($selectedColumns.eq(i).clone());
                        $selectedColumns.eq(i).hide();
                    }
                }
                //Focus on the first available column
                if ($availableColumns.children(":visible").length > 0) {
                    $availableColumns.val($availableColumns.children(":visible").first().val()).focus();
                }
            });
            $content.find(".remove-group").on("click", () => {
                const $selectedColumns = $groupingColumns.find(":selected");
                for (let i = $selectedColumns.length - 1; i >= 0; i--) {
                    //Make it visible in the available columns
                    $availableColumns.find("option[value='" + $selectedColumns.eq(i).val() + "']").show();
                }
                //...and remove from the grouping columns
                $selectedColumns.remove();
                //Focus on the first grouping column
                if ($groupingColumns.children().length > 0) {
                    $groupingColumns.val($groupingColumns.children().first().val()).focus();
                }
            });
            $content.find(".move-up").on("click", () => {
                const $selected = $groupingColumns.find(":selected");
                $selected.eq(0).prev().before($selected);
            });
            $content.find(".move-down").on("click", () => {
                const $selected = $groupingColumns.find(":selected");
                $selected.eq($selected.length - 1).next().after($selected);
            });
            $availableColumns.on("dblclick", () => {
                $content.find(".add-group").click();
            });
            $groupingColumns.on("dblclick", () => {
                $content.find(".remove-group").click();
            });
            /************************************ Grouping dialog events [END] ************************************/
            return $content;
        }
        initializeGroupingOptions($content) {
            const $availableColumns = $content.find(".available-columns");
            for (let i = 0; i < this.status.columnInfo.length; i++) {
                if (!this.status.columnInfo[i].groupable) continue;
                const $option = $("<option value='" + this.status.columnInfo[i].name + "'>" + this.status.columnInfo[i].caption + "</option>");
                $availableColumns.append($option);
            }
        }
        updateGroupingDialogState() {
            //Get the grouping dialog content
            const $groupingContent = this.$wrapperElement.find("#" + this.clientsideElementId + "_grouping");
            //Select all options and reset the active selections
            $groupingContent.find("option").prop("selected", true);
            $groupingContent.find("button.remove-group").click();
            $groupingContent.find("option").prop("selected", false);

            for (let i = 0; i < this.status.groupBy.length; i++) {
                $groupingContent.find("option[value='" + this.status.groupBy[i].column.name + "']").prop("selected", true);
            }
            $groupingContent.find("button.add-group").click();

            $groupingContent.find("input.get-groups-closed").prop("checked", this.status.getGroupsClosed);
            $groupingContent.find("input.merge-group-levels").prop("checked", this.status.mergeGroupLevels);
        }
        applyGrouping() {
            const $groupingColumns = this.$wrapperElement.find(".datalist-grouping .grouping-columns").children();
            const getGroupsClosed = this.$wrapperElement.find(".datalist-grouping .get-groups-closed").is(":checked");
            if (getGroupsClosed && this.options.hasPaging) {
                this.$wrapperElement.find(".dataTables_length select").prop("disabled", true);
                this.dataTableInstance.page.len(DataListControl.MAX_ROWS);
                this.status.pageSize = DataListControl.MAX_ROWS;
                this.$wrapperElement.find(".dataTables_length select").val(-1);
            } else {
                this.$wrapperElement.find(".dataTables_length select").prop("disabled", false);
                this.status.pageSize = this.options.pageSizes[0];
                this.dataTableInstance.page.len(this.status.pageSize);
                this.$wrapperElement.find(".dataTables_length select").val(this.status.pageSize);
            }
            const mergeGroupLevels = this.$wrapperElement.find(".datalist-grouping .merge-group-levels").is(":checked");
            const groupBy = [];
            for (let i = 0; i < $groupingColumns.length; i++) {
                const state = /*options.getGroupsClosed === true && i === groupsArray.length - 1 ? "COLLAPSED" :*/ "EXPANDED";
                const columnInfo = $.grep(this.status.columnInfo, (c) => { return c.name === $groupingColumns.eq(i).val(); });
                if (columnInfo.length !== 1) {
                    this.handleError("DATALIST ERROR: Column info was not found for column " + $groupingColumns.eq(i).val());
                    continue;
                }
                groupBy.push(new DataListGroupByInfo(columnInfo[0], state, getGroupsClosed));
            }
            this.status.groupBy = groupBy;
            this.status.getGroupsClosed = getGroupsClosed;
            this.status.mergeGroupLevels = mergeGroupLevels;
            this.status.startRow = 0;  //Reset paging
            this.dataTableInstance.draw();
            //If aggregators are enabled then request them again
            if (this.cache.aggregators != null) {
                this.makeAggregatorRequest();
            }
            this.dataTableInstance.state.save();
        }
        renderGroups() {
            let renderGroupsInfo = [];
            let aggregatorDictionary = [];
            /*   NOTE: This recursive function traverses the group tree and flattens its structure
             *         in order to inject the grouping rows into the already rendered data rows effectively
             */
            const parseGroupsData = (groupInfo, aggregatorInfo, currentPath) => {
                //Do not include the root column as it does not require rendering
                if (groupInfo.Column.Name !== "ROOT" && groupInfo.Key !== "ROOT") {
                    if (currentPath.length > 0) {
                        currentPath += DataListControl.GROUP_PATH_SEPARATOR;
                    }
                    currentPath += groupInfo.Column.Name + DataListControl.GROUP_VALUE_SEPARATOR + groupInfo.Key;
                }
                //If UniqueItemKeys is not null then we are on a leaf so store the related keys
                //In case of getGroupsClosed there are no actual records so leafs are detected by
                //checking the subgroups length
                if ((!this.status.getGroupsClosed && groupInfo.UniqueItemKeys != null)
                    || this.status.getGroupsClosed && groupInfo.SubGroups.length === 0) {
                    aggregatorDictionary[currentPath] = aggregatorInfo != null && aggregatorInfo != undefined ? aggregatorInfo.Aggregates : null;
                    const aggregatorDictionaryKeys = Object.keys(aggregatorDictionary);
                    const currentAggregators = [];
                    for (var k = 0; k < aggregatorDictionaryKeys.length; k++) {
                        currentAggregators[aggregatorDictionaryKeys[k]] = aggregatorDictionary[aggregatorDictionaryKeys[k]];
                    }

                    renderGroupsInfo.push({
                        "relatedKeys": groupInfo.UniqueItemKeys,
                        "groupPath": currentPath,
                        "groupAggregators": currentAggregators
                    });
                    aggregatorDictionary = [];
                } else {
                    aggregatorDictionary[currentPath] = aggregatorInfo != null && aggregatorInfo != undefined ? aggregatorInfo.Aggregates : null;
                    //...else traverse the subgroups recursively
                    for (let i = 0; i < groupInfo.SubGroups.length; i++) {
                        let subGroupAggregatorInfo = aggregatorInfo != null && Common.isArray(aggregatorInfo.SubGroups)
                            ? aggregatorInfo.SubGroups.filter((a) => { return a.Key == groupInfo.SubGroups[i].Key; })
                            : null;
                        subGroupAggregatorInfo = subGroupAggregatorInfo != null && subGroupAggregatorInfo.length == 1 ? subGroupAggregatorInfo[0] : null;
                        parseGroupsData(groupInfo.SubGroups[i], subGroupAggregatorInfo, currentPath);
                    }
                }
            }
            const groupAggregators = this.cache.aggregators != null && this.cache.aggregators.Groups != undefined
                ? this.cache.aggregators.Groups
                : null;
            parseGroupsData(this.cache.groups, groupAggregators, "");
            let $selectedRows: JQuery;
            //When getGroupsClosed is true the group rows are appended to the "No results found row"
            //This row is generated when there are no data rows so groups are injected
            //before it and its removed afterwards
            if (this.status.getGroupsClosed) {
                this.$element.find("tbody tr").remove();
                $selectedRows = $("<tr class='dummy-row'></tr>");
                this.$element.find("tbody").append($selectedRows);
            }
            //Remove any existing data group rows
            this.$element.find(".group-row, .group-aggregators-row").remove();

            //FLAT EARTH SOCIETY INFLUENCED FEATURE
            if (this.status.mergeGroupLevels) {
                //Copy the group info in order to alter the group structure properly
                const renderGroupsInfoCopy = JSON.parse(JSON.stringify(renderGroupsInfo));

                for (let i = 0; i < renderGroupsInfo.length; i++) {
                    //Remove all aggregators per group
                    renderGroupsInfoCopy[i].groupAggregators = [];
                    //...and get only the innermost path to be set after the new group path is calculated
                    const innermostGroupAggregators = renderGroupsInfo[i].groupAggregators[renderGroupsInfo[i].groupPath];

                    //Split the total groups levels and iterate
                    const totalGroupLevels = renderGroupsInfoCopy[i].groupPath.split(DataListControl.GROUP_PATH_SEPARATOR).filter(grp => { return grp !== ""; });
                    let flattenGroupValues = [];
                    //For each level get the key/value pairs
                    for (let j = 0; j < totalGroupLevels.length; j++) {
                        const groupInfo = totalGroupLevels[j].split(DataListControl.GROUP_VALUE_SEPARATOR);
                        if (groupInfo.length !== 2) {
                            this.handleError("DATALIST ERROR: Invalid group parsing. Group value separator failed with " + totalGroupLevels[j]);
                            continue;
                        }
                        //...and assign the pair as the flatten value part
                        flattenGroupValues.push(groupInfo[0] + ": " + groupInfo[1]);
                    }
                    //Set the new flat group path
                    renderGroupsInfoCopy[i].groupPath = this.resources.textResources.MergedGroupLevels + DataListControl.GROUP_VALUE_SEPARATOR + flattenGroupValues.join(" | ");
                    //...and assign the innermost aggregator group to the newly calculated flat group path
                    if (innermostGroupAggregators != undefined) {
                        renderGroupsInfoCopy[i].groupAggregators[renderGroupsInfoCopy[i].groupPath] = innermostGroupAggregators;
                    }
                }
                //Overwrite the original group structure with the flatten one
                renderGroupsInfo = renderGroupsInfoCopy;
            }


            //Iterate the groups info
            for (let j = 0; j < renderGroupsInfo.length; j++) {
                const groupsInfo = renderGroupsInfo[j].groupPath.split(DataListControl.GROUP_PATH_SEPARATOR).filter(grp => { return grp !== ""; });
                if (!this.status.getGroupsClosed) {
                    const rowIdSelector = renderGroupsInfo[j].relatedKeys.map((t) => { return "#" + t; });
                    $selectedRows = $(this.dataTableInstance.rows(rowIdSelector).nodes());

                    $selectedRows.each(function () {
                        $(this).attr("data-group-path", renderGroupsInfo[j].groupPath);
                        $(this).attr("data-group-level", groupsInfo.length);
                    });
                }

                //This array will be used for proper group row injection after the current group parsing
                const groupsToCreate = [];

                for (let k = 0; k < groupsInfo.length; k++) {
                    const groupInfo = groupsInfo[k].split(DataListControl.GROUP_VALUE_SEPARATOR);
                    if (groupInfo.length !== 2) {
                        this.handleError("DATALIST ERROR: Invalid group parsing. Group value separator failed with " + groupsInfo[k]);
                        continue;
                    }

                    const groupPath = groupsInfo.slice(0, k + 1).join(DataListControl.GROUP_PATH_SEPARATOR);
                    const column = $.grep(this.status.columnInfo, (col) => { return col.name === groupInfo[0] });
                    const columnName = column.length === 1 ? column[0].caption : groupInfo[0];
                    const groupKey = column.length === 1 ? this.cellRender(groupInfo[1], "groupKey", null, column[0]) : groupInfo[1];
                    const groupState = this.status.getGroupsClosed && k + 1 == groupsInfo.length ? "CLOSED" : "EXPANDED";
                    const groupIcon = groupState == "CLOSED" ? "" : "glyphicon-collapse-up";

                    const $groupRow = $("<tr class='group-row'> \
                                            <td colspan='" + (this.status.columnInfo.length + (this.options.showRowNumbers ? 1 : 0)) + "'> \
                                                <span class='group-toggle glyphicon " + groupIcon + "' style='margin-left: " + (k * 20) + "px'></span> \
                                                <span class='group-caption'>" + columnName + ":</span> \
                                                <span class='group-key'>" + groupKey + "</span> \
                                            </td> \
                                         </tr>");
                    //Set these attributes for proper exand/collapse (see the click event in .group-toggle class)
                    $groupRow.attr("data-group-level", k);
                    $groupRow.attr("data-group-path", groupPath);
                    $groupRow.attr("data-group-state", groupState);

                    //Create group aggregator row if any data exists
                    let $groupAggregatorsRow = null;
                    if (renderGroupsInfo[j].groupAggregators[groupPath] != null) {
                        $groupAggregatorsRow = $("<tr class='group-aggregators-row'></tr>");
                        $groupAggregatorsRow.append(this.options.showRowNumbers ? "<td></td>" : "");
                        const datatablesHeader = this.dataTableInstance.columns().header();
                        for (let l = this.options.showRowNumbers ? 1 : 0; l < (datatablesHeader as any).length; l++) {
                            const columnInfo = this.getColumnInfoForElement($(datatablesHeader[l]));
                            if (columnInfo == undefined) {
                                this.handleError("DATALIST ERROR: ColumnInfo not found for column with index " + l);
                                $groupAggregatorsRow.append("<td></td>");
                                continue;
                            }
                            const $aggregatorsWrapper = $("<ul></ul>");
                            for (let m = 0; m < this.aggregatorsInfo.length; m++) {
                                const aggregators = renderGroupsInfo[j].groupAggregators[groupPath];
                                if (aggregators == undefined) { continue; }
                                const aggregatorValue = $.grep(aggregators, (item: any) => {
                                    //The aggregator type is intentionally not strict because the Newtonsoft serializer
                                    //handles the enum JSON value as string. Also the sanitization of the column name breaks the CamelCase format thus we compare in lowercase
                                    return item.Type == this.aggregatorsInfo[m].type && item.Column.toLowerCase() === this.sanitizeColumnName(columnInfo.name).toLowerCase();
                                });
                                if (aggregatorValue.length !== 1) {
                                    continue;
                                }
                                const $aggregatorElement = $("<li> \
                                                                <span class='aggregator-caption'>" + this.aggregatorsInfo[m].totalText + "</span> \
                                                                <span span class='aggregator-value'>" + aggregatorValue[0].ValueFormatted + "</span> \
                                                              </li>");
                                $aggregatorsWrapper.append($aggregatorElement);
                            }
                            const $aggregatorCell = $("<td data-group-aggregator-column='" + columnInfo.name + "'></td>");
                            //Set the cell visibility according to the column visibility
                            if (!this.dataTableInstance.column(l).visible()) {
                                $aggregatorCell.hide();
                            }
                            $aggregatorCell.append($aggregatorsWrapper);
                            $groupAggregatorsRow.append($aggregatorCell);
                        }
                        //Set these attributes for proper exand/collapse (see the click event in .group-toggle class)
                        $groupAggregatorsRow.attr("data-group-level", k);
                        $groupAggregatorsRow.attr("data-group-path", groupPath);
                    }

                    //Add the created group the the array
                    groupsToCreate.push({ path: groupPath, groupRow: $groupRow, aggregatorRow: $groupAggregatorsRow });
                }

                //Inject the inner group before its first item
                const innerGroup = groupsToCreate[groupsToCreate.length - 1];
                $selectedRows.eq(0).before(innerGroup.groupRow);
                if (innerGroup.aggregatorRow != null) {
                    innerGroup.groupRow.after(innerGroup.aggregatorRow);
                }

                //Now inject each outer group to the current inner group only if it's not present in the table
                for (let i = groupsToCreate.length - 2; i >= 0; i--) {
                    if (this.$element.find("tbody tr.group-row[data-group-path='" + groupsToCreate[i].path + "']").length == 0) {
                        groupsToCreate[i + 1].groupRow.before(groupsToCreate[i].groupRow);
                        if (groupsToCreate[i].aggregatorRow != null) {
                            groupsToCreate[i].groupRow.after(groupsToCreate[i].aggregatorRow);
                        }
                    }
                }
            }
            if (this.status.getGroupsClosed) {
                //The removed row is the "No results found row"
                $selectedRows.remove();
            }
        }

        configureGrouping() {
            //Toggles open and closed 
            this.$wrapperElement.on("click", "tr.group-row .group-toggle", function (event) {
                const $currentRow = $(this).closest("tr.group-row");
                const currentLevel = $currentRow.data("group-level");
                const currentPath = $currentRow.data("group-path");
                const $targetNodes = $currentRow.siblings("[data-group-path~='" + currentPath + "']").filter(function () {
                    return parseInt($(this).attr("data-group-level")) > currentLevel;
                });
                if ($currentRow.data("group-state") === "EXPANDED") {
                    $targetNodes.hide();
                    $currentRow.data("group-state", "COLLAPSED");
                    $(this).removeClass("glyphicon-collapse-up");
                    $(this).addClass("glyphicon-expand");
                } else {
                    $targetNodes.show();
                    $currentRow.data("group-state", "EXPANDED");
                    $(this).removeClass("glyphicon-expand");
                    $(this).addClass("glyphicon-collapse-up");
                }
            });

            this.applyPredefinedGrouping();
        }

        applyPredefinedGrouping() {
            const groupBy = [];

            if (!(this.options.rememberLastState || this.viewsHelper.currentView != null)) {
                for (let i = 0; i < this.options.predefinedGroups.length; i++) {
                    const state = /*options.getGroupsClosed === true && i === groupsArray.length - 1 ? "COLLAPSED" :*/ "EXPANDED";
                    const columnInfo = $.grep(this.status.columnInfo, (c) => { return c.name === this.options.predefinedGroups[i].column; });
                    if (columnInfo.length !== 1) {
                        this.handleError("DATALIST ERROR: Column info was not found for column " + this.options.predefinedGroups[i].column);
                        continue;
                    }
                    groupBy.push(new DataListGroupByInfo(columnInfo[0], state, false));
                }

                //Set the status
                this.status.groupBy = groupBy;
            }

            //Set in the UI
            const columnNames = $.map(this.status.groupBy as any, (g) => { return g.column; });
            const $availableColumns = this.$wrapperElement.find(".datalist-grouping .available-columns");
            $availableColumns.val(columnNames);
            this.$wrapperElement.find(".datalist-grouping button.add-group").click();
        }
        /*********************** Grouping [END] ***********************/

        /*********************** Custom button functionalities [END] ***********************/

        /*********************** [BEGIN] Action buttons / Picklist buttons ***********************/
        configureActionButtons() {
            //Picklist does not have actions
            if (this.options.isPickList) return;

            const $listActions = this.$wrapperElement.find(".actions");
            const $actionButtons = this.$wrapperElement.siblings(".data-list-action-buttons").find("button");
            const $compactActionsContainer = $("<div class='dropdown btn-group btn-group-sm compact-actions'> \
                                                        <button class='btn dropdown-toggle actionsDropdown' type='button' data-toggle='dropdown'> \
                                                            " + this.resources.textResources.Actions + " \
                                                            <span class='caret'></span> \
                                                        </button> \
                                                        <ul class='dropdown-menu'> \
                                                        </ul> \
                                                    </div>");
            const $compactActions = $compactActionsContainer.find(".dropdown-menu");

            /*********************** [BEGIN] Action buttons ***********************/
            for (let i = 0; i < $actionButtons.length; i++) {
                const $actionButtonContainer = $("<div class='btn-group btn-group-sm'></div>");
                const $actionButton = $actionButtons.eq(i);

                //Remove the default size if the button has a specified size
                if ($actionButton.attr("ui-role-element-size") != undefined) {
                    $actionButtonContainer.removeClass("btn-group-sm");
                }

                /* NOTE: It seems that on some use cases, that moving the action button to
                 *       a different place in the DOM may break the ng-click functionality.
                 *       In order to avoid this a dummy action button is created that triggers
                 *       the original, and the original is hidden.
                 */
                const $dummyActionButton = $actionButton.clone();
                $dummyActionButton.removeAttr("jb-id");
                $dummyActionButton.attr("related-to", $actionButton.attr("jb-id"));
                $dummyActionButton.on("click", (event) => {
                    if (!$actionButton.is(":disabled")) {
                        $actionButton.click();
                    }
                });

                //Create another dummy button for compact mode display setting
                const $dummyCompactActionButton = $("<a class='dropdown-item' href='#'></a>");
                $dummyCompactActionButton.attr("related-to", $actionButton.attr("jb-id"));
                $dummyCompactActionButton.text($actionButton.text());
                $dummyCompactActionButton.on("click", (event) => {
                    if (!$actionButton.is(":disabled")) {
                        $actionButton.click();
                        $('.actionsDropdown').next('ul').toggle();
                    }
                });
                $dummyCompactActionButton.wrap("<li></li>");
                $dummyCompactActionButton.parent().appendTo($compactActions);

                $dummyActionButton.hide(); //This is to avoid flikering while loading...
                $dummyActionButton.appendTo($actionButtonContainer);
                $actionButtonContainer.appendTo($listActions);
            }

            $compactActionsContainer.hide(); //This is to avoid flikering while loading...
            $compactActionsContainer.appendTo($listActions);
            /*********************** Action buttons [END] ***********************/
        }

        /*********************** [BEGIN] Action buttons context menu ***********************/
        configureActionButtonContextMenu() {
            //Picklist mode does not have actions menu on right click
            if (this.options.isPickList) return;

            const $actionButtons = this.$wrapperElement.find(".actions button[jb-type='ListCommandButton']");
            const contextMenuActions = [];

            for (let i = 0; i < $actionButtons.length; i++) {
                const $actionButton = $actionButtons.eq(i);

                const action = {
                    title: $actionButton.text(),
                    uiIcon: DataListControlResources.icons.menuItem.bs,
                    cmd: $actionButton.attr("related-to"),
                    disabled: (event, ui) => {
                        if ($actionButton.hasClass("show-single")) return this.status.selectedItems.length !== 1;
                        if ($actionButton.hasClass("show-multi")) return this.status.selectedItems.length < 1;
                        return false;
                    }
                };

                contextMenuActions.push(action);
            }

            //Create the context menu on the headers
            (this.$element as any).contextmenu({
                delegate: "tbody tr:not(.group-row):not(.group-aggregators-row)",
                addClass: "datalist-actions",
                menu: contextMenuActions,
                select: (event, ui) => { this.actionContextMenuSelect(event, ui) },
                beforeOpen: (event, ui) => { this.actionContextMenuBeforeOpen(event, ui); }
            });

            //Remove the jQueryUI icon classes from the context menu
            $(".datalist-actions .ui-icon").each(function (event) {
                $(this).removeClass("ui-icon");
            });

        }

        /*********************** [BEGIN] Select / Deselect buttons ***********************/
        configureSelectionButtons() {
            if (!this.options.hasMultiSelect) return;

            const $selectActions = this.$wrapperElement.find(".select-actions");
            const $compactSelectActionsContainer = $("<div class='dropup btn-group btn-group-sm compact-select-actions'> \
                                                        <button class='btn dropdown-toggle' type='button' data-toggle='dropdown'> \
                                                            " + this.resources.textResources.SelectionActions + " \
                                                            <span class='caret'></span> \
                                                        </button> \
                                                        <ul class='dropdown-menu'> \
                                                        </ul> \
                                                    </div>");
            const $compactActions = $compactSelectActionsContainer.find(".dropdown-menu");

            /******** SELECT ALL RECORDS OF PAGE BUTTON ********/
            const $selectAllPageRecordsButtonContainer = $("<div class='btn-group btn-group-sm'><button jb-id='datalist-select-all-page' class='btn btn-default datalist-select select-all-page'></button></div>");
            const $selectAllPageRecords = $selectAllPageRecordsButtonContainer.find("button");
            $selectAllPageRecords.text(this.resources.textResources.SelectAllPageRecordsText);
            $selectAllPageRecords.on("click", (event) => {
                if (this.maxSelectedRowsReached(this.dataTableInstance.rows().count())) {
                    return;
                }
                this.status.allKeysSelected = false;
                this.dataTableInstance.rows().select();
                //Update directive & model. Picklist handles the directive scope when pressing ok
                if (!this.options.isPickList) {
                    this.listSelectionChanged();
                }
            });
            $selectAllPageRecordsButtonContainer.appendTo($selectActions);

            //Create a dummy button for compact mode display setting
            const $dummySelectAllPageRecordsButton = $("<a class='dropdown-item' href='#'></a>");
            $dummySelectAllPageRecordsButton.attr("related-to", $selectAllPageRecords.attr("jb-id"));
            $dummySelectAllPageRecordsButton.text($selectAllPageRecords.text());
            $dummySelectAllPageRecordsButton.on("click", (event) => {
                $selectAllPageRecords.click();
            });
            $dummySelectAllPageRecordsButton.wrap("<li></li>");
            $dummySelectAllPageRecordsButton.parent().appendTo($compactActions);

            /******** SELECT ALL RECORDS BUTTON ********/
            const $selectAllRecordsButtonContainer = $("<div class='btn-group btn-group-sm'><button jb-id='datalist-select-all' class='btn btn-default datalist-select select-all'></button></div>");
            const $selectAllRecords = $selectAllRecordsButtonContainer.find("button");
            $selectAllRecords.text(this.resources.textResources.SelectAllRecordsText);
            $selectAllRecords.on("click", (event) => {
                if (this.maxSelectedRowsReached(this.dataTableInstance.page.info().recordsTotal)) {
                    return;
                }

                const directiveScope = Common.getDirectiveScope(this.$scopeElement);

                //Select all in current page to refresh the UI
                this.dataTableInstance.rows().select();
                //Update status
                this.status.allKeysSelected = this.status.filters.length == 0;
                //Show loading panel
                this.$loadingPanel.show();

                DatasourceManager.requestSelectedItemsfromServer(
                    this.serversideElementId,
                    this.$scopeElement,
                    directiveScope.itemDataType,
                    true, //This is forced to true since FullRecordSet controller action now handles filtering
                    [], //No keys are posted since every key is selected
                    this.status.excludedKeys, //This option is the keysToExclude which is used only when allKeysSelected is true
                    this.prepareDatasourceRequestInfo(),
                    selectedItemsData => {
                        //Hide the loading panel
                        this.$loadingPanel.hide();
                        //Ensure we always handle an array
                        if (!Common.isArray(selectedItemsData)) { selectedItemsData = [selectedItemsData]; }
                        this.status.selectedItems = selectedItemsData;
                        /* NOTE: The select all records request is the only case in the Picklist mode
                         *       that should update the directive scope since the request to the server is
                         *       already made.
                         */
                        this.listSelectionChanged();
                        window.$refreshLogic();
                    });
            });
            $selectAllRecordsButtonContainer.appendTo($selectActions);

            //Create a dummy button for compact mode display setting
            const $dummySelectAllRecordsButton = $("<a class='dropdown-item' href='#'></a>");
            $dummySelectAllRecordsButton.attr("related-to", $selectAllRecords.attr("jb-id"));
            $dummySelectAllRecordsButton.text($selectAllRecords.text());
            $dummySelectAllRecordsButton.on("click", (event) => {
                $selectAllRecords.click();
            });
            $dummySelectAllRecordsButton.wrap("<li></li>");
            $dummySelectAllRecordsButton.parent().appendTo($compactActions);

            /******** DESELECT ALL RECORDS OF PAGE BUTTON ********/
            const $deselectAllPageRecordsButtonContainer = $("<div class='btn-group btn-group-sm'><button jb-id='datalist-deselect-all-page' class='btn btn-default datalist-select deselect-all-page'></button></div>");
            const $deselectAllPageRecords = $deselectAllPageRecordsButtonContainer.find("button");
            $deselectAllPageRecords.text(this.resources.textResources.DeselectAllPageRecordsText);
            $deselectAllPageRecords.on("click", (event) => {
                this.dataTableInstance.rows().deselect();
                this.status.allKeysSelected = false;
                this.listSelectionChanged();
            });
            $deselectAllPageRecordsButtonContainer.appendTo($selectActions);

            //Create a dummy button for compact mode display setting
            const $dummyDeselectAllPageRecordsButton = $("<a class='dropdown-item' href='#'></a>");
            $dummyDeselectAllPageRecordsButton.attr("related-to", $deselectAllPageRecordsButtonContainer.attr("jb-id"));
            $dummyDeselectAllPageRecordsButton.text($deselectAllPageRecordsButtonContainer.text());
            $dummyDeselectAllPageRecordsButton.on("click", (event) => {
                $deselectAllPageRecords.click();
            });
            $dummyDeselectAllPageRecordsButton.wrap("<li></li>");
            $dummyDeselectAllPageRecordsButton.parent().appendTo($compactActions);

            /******** DESELECT ALL RECORDS BUTTON ********/
            const $deselectAllRecordsButtonContainer = $("<div class='btn-group btn-group-sm'><button jb-id='datalist-deselect-all' class='btn btn-default datalist-select deselect-all'></button></div>");
            const $deselectAllRecords = $deselectAllRecordsButtonContainer.find("button");
            $deselectAllRecords.text(this.resources.textResources.DeselectAllRecordsText);
            $deselectAllRecords.on("click", (event) => {
                this.deselectAll();
            });
            $deselectAllRecordsButtonContainer.appendTo($selectActions);

            //Create a dummy button for compact mode display setting
            const $dummyDeselectAllRecordsButton = $("<a class='dropdown-item' href='#'></a>");
            $dummyDeselectAllRecordsButton.attr("related-to", $deselectAllRecordsButtonContainer.attr("jb-id"));
            $dummyDeselectAllRecordsButton.text($deselectAllRecordsButtonContainer.text());
            $dummyDeselectAllRecordsButton.on("click", (event) => {
                $deselectAllRecords.click();
            });
            $dummyDeselectAllRecordsButton.wrap("<li></li>");
            $dummyDeselectAllRecordsButton.parent().appendTo($compactActions);

            $compactSelectActionsContainer.appendTo($selectActions);
        }
        deselectAll() {
            //Update status
            this.status.allKeysSelected = false;
            this.setSelectedItemKeys([]);
            this.listSelectionChanged();
        }
        /*********************** Select / Deselect buttons [END] ***********************/

        actionContextMenuSelect(event, ui) {
            //Trigger the actual button based on the jb-id
            this.$wrapperElement.find(".actions button[related-to='" + ui.item.data().command + "']").click();
        }

        actionContextMenuBeforeOpen(event, ui) {
            const $row = $(ui.target).closest("tr");
            this.dataTableInstance.row($row.get(0)).select();
            this.updateDirectiveScopeAndModel(() => {
                //Sync actions state to the actual buttons state. Doing this keeps the context menu
                //up-to-date with conditional formatings applied on list actions
                ui.menu.find("li").each((index, element) => {
                    const $element = $(element);
                    const $originalActionButton = this.$wrapperElement.siblings(".data-list-action-buttons").find("[jb-id='" + $element.data("command") + "']");
                    $element.toggle(!$originalActionButton.hasClass("cf-hidden"));
                });
            });

            ui.menu.css("z-index", 9999);
        }

        /*********************** Action buttons context menu [END] ***********************/

        updateActionButtonVisibility() {
            let visibleActionsWidth = 0;
            let compactMode = false;

            /*********************** [BEGIN] Select / Deselect buttons ***********************/
            const $selectionActionsContainer = this.$wrapperElement.find(".select-actions");
            const $selectAllPageRecords = $selectionActionsContainer.find(".select-all-page");
            const $selectAllRecords = $selectionActionsContainer.find(".select-all");
            const $deselectAllPageRecords = $selectionActionsContainer.find(".deselect-all-page");
            const $deselectAllRecords = $selectionActionsContainer.find(".deselect-all");

            const pageCount = this.dataTableInstance.page.info().pages;
            const pageRecordCount = this.dataTableInstance.rows().count();
            const pageSelectedRecordCount = this.dataTableInstance.rows({ selected: true }).count();

            $selectAllPageRecords.toggle((pageRecordCount !== pageSelectedRecordCount) && (pageCount > 1));
            $deselectAllPageRecords.toggle((pageSelectedRecordCount > 0) && (pageCount > 1));
            $selectAllRecords.toggle((!this.status.allKeysSelected) && (pageRecordCount > 0));
            $deselectAllRecords.toggle((this.status.selectedItems.length > 0) && (pageRecordCount > 0));

            //Handle the compact selection actions visibility
            $selectionActionsContainer.find("button.datalist-select").each((index, button) => {
                const $selectAction = $(button);
                const $dummyOption = $selectionActionsContainer.find(".compact-select-actions a[related-to='" + $selectAction.attr("jb-id") + "']");

                $dummyOption.toggle($selectAction.is(":visible"));
                if ($selectAction.is(":visible")) {
                    visibleActionsWidth += $selectAction.parent().width();
                }
            });

            //Finally display either the actual buttons or the compact actions dropdown button
            compactMode = visibleActionsWidth > $selectionActionsContainer.width();
            if (compactMode) {
                $selectionActionsContainer.find("button.datalist-select").toggle(false);
            }
            $selectionActionsContainer.find(".compact-select-actions").toggle(compactMode);

            /*********************** Select / Deselect buttons [END] ***********************/

            /*********************** [BEGIN] Action buttons ***********************/
            const $actionsContainer = this.$wrapperElement.find(".actions");
            visibleActionsWidth = 0;

            //Select all buttons that are not affected by conditional formattings that affect visibility
            const $showAlwaysButtons = $actionsContainer.find("button.show-always:not(.cf-hidden)");
            const $singleSelectionButtons = $actionsContainer.find("button.show-single:not(.cf-hidden)");
            const $multiSelectionButtons = $actionsContainer.find("button.show-multi:not(.cf-hidden)");

            $showAlwaysButtons.toggle(true); //Needed for reseting the hidden state
            if ($singleSelectionButtons.length > 0) { $singleSelectionButtons.toggle(this.status.selectedItems.length === 1); }
            if ($multiSelectionButtons.length > 0) { $multiSelectionButtons.toggle(this.status.selectedItems.length >= 1); }

            //Handle the compact actions visibility
            $actionsContainer.find("button[jb-type='ListCommandButton']").each((index, button) => {
                const $action = $(button);
                const $dummyOption = $actionsContainer.find(".compact-actions a[related-to='" + $action.attr("related-to") + "']");

                $dummyOption.toggle($action.is(":visible"));
                if ($action.is(":visible")) {
                    visibleActionsWidth += $action.parent().width();
                }
            });

            //Finally display either the actual buttons or the compact actions dropdown button
            compactMode = visibleActionsWidth > $actionsContainer.width();
            if (compactMode) {
                $actionsContainer.find("button[jb-type='ListCommandButton']").toggle(false);
            }
            $actionsContainer.find(".compact-actions").toggle(compactMode);
            $actionsContainer.find(".actionsDropdown").on("click", (event) => {
                event.stopImmediatePropagation();
                $('.actionsDropdown').next('ul').toggle();
                
                event.preventDefault();
            });

            /*********************** Action buttons [END] ***********************/
        }

        /*********************** Action buttons / Picklist buttons [END] ***********************/

        /*********************** [BEGIN] Search element ***********************/
        convertInputToSearchElement($input) {
            const $searchElement = $("<div class='input-group input-group-sm search-element empty'></div>");

            const $actionButtons = $("<div class='input-group-btn search-actions'> \
                                        <button class='btn btn-default clear-button'> \
                                            <span class='bootstrap-tooltip' data-toggle='tooltip' data-placement='top' title='" + this.resources.textResources.ClearSearch + "' > \
                                                <span class='"+ DataListControlResources.icons.remove.bs + "'></span> \
                                            </span> \
                                        </button> \
                                        <button class='btn btn-default search-button'> \
                                            <span class='bootstrap-tooltip' data-toggle='tooltip' data-placement='top' title='" + this.resources.textResources.Search + "' > \
                                                <span class='"+ DataListControlResources.icons.search.bs + "'></span> \
                                            </span> \
                                        </button> \
                                      </div>");

            $searchElement.append($input);
            $searchElement.append($actionButtons);

            return $searchElement;
        }

        attachSearchElementEventHandlers($searchElement) {
            const $searchInput = $searchElement.find("input.search-input");
            const $clearButton = $searchElement.find("button.clear-button");
            const $searchButton = $searchElement.find("button.search-button");
            const $searchDropDown = $searchElement.find("select").eq(0);

            $searchDropDown.on("change", (event) => {
                this.applySearch($searchElement, event);
            });

            $searchInput.on("change", (event) => {
                $searchElement.toggleClass("empty", $searchInput.val().length === 0);
            });

            $searchInput.on("keypress",
                (event) => {
                    if (event.keyCode === 13) {
                        $searchButton.click();
                        $searchInput.trigger("change");
                    }
                });

            $clearButton.on("click", (event) => {
                $searchInput.val("");
                this.applySearch($searchElement, event);
                $searchElement.addClass("empty");
            });

            $searchButton.on("click", (event) => {
                event.stopImmediatePropagation();
                this.applySearch($searchElement, event);
            });
        }

        applySearch($searchElement, event) {
            const isGloabalSearch = $searchElement.parent().hasClass("global-search");
            const isQuickFilter = $searchElement.parent().hasClass("quick-filter");
            const $searchInput = $searchElement.find("input");
            const $searchDropDown = $searchElement.find("select");

            if (isGloabalSearch) {
                this.dataTableInstance.search($searchInput.val()).draw();
            }

            if (isQuickFilter) {
                const $columnHeader = $(event.target).closest("th");

                var value = $searchDropDown.length == 0
                    ? $searchInput.val()
                    : $searchDropDown.val();

                this.dataTableInstance.columns($columnHeader).search(value).draw();
            }
        }

        /*********************** Search element [END] ***********************/

        /*********************** [BEGIN] Aggregators ***********************/

        configureAggregators() {
            //Picklist does not utilizes aggregators. This part is disabled for that mode
            if (this.options.isPickList) { return; }

            //Create the context menu on the headers
            (this.$wrapperElement as any).contextmenu({
                delegate: "table.data-list thead th:not(.row-number-column)",
                addClass: "datalist-aggregators",
                menu: [
                    {
                        title: this.resources.textResources.CalculateCount,
                        cmd: AggregatorTypes.COUNT,
                        uiIcon: DataListControlResources.icons.aggregator.bs,
                        data: { enabled: false },
                        disabled: (event, ui) => {
                            return this.isAggregatorDisabled($(ui.target).closest("th"), AggregatorTypes.COUNT);
                        }
                    },
                    {
                        title: this.resources.textResources.CalculateSum,
                        cmd: AggregatorTypes.SUM,
                        uiIcon: DataListControlResources.icons.aggregator.bs,
                        data: { enabled: false },
                        disabled: (event, ui) => {
                            return this.isAggregatorDisabled($(ui.target).closest("th"), AggregatorTypes.SUM);
                        }
                    },
                    {
                        title: this.resources.textResources.CalculateAverage,
                        cmd: AggregatorTypes.AVERAGE,
                        uiIcon: DataListControlResources.icons.aggregator.bs,
                        data: { enabled: false },
                        disabled: (event, ui) => {
                            return this.isAggregatorDisabled($(ui.target).closest("th"), AggregatorTypes.AVERAGE);
                        }
                    }
                ],
                select: (event, ui) => { this.aggregatorContextMenuSelect(event, ui) },
                beforeOpen: (event, ui) => { this.aggregatorContextMenuBeforeOpen(event, ui); }
            });

            //Remove the jQueryUI icon classes from the context menu
            $(".datalist-aggregators .ui-icon").each(function (event) {
                $(this).removeClass("ui-icon");
            });

            //Append an indicator for the state of each menu item
            $(".datalist-aggregators .ui-menu-item-wrapper").each(function (event) {
                const $statusElement = $("<span class='aggragator-state glyphicon glyphicon-ok'></span>");
                //Check in case we have multiple datalist instances, since the contextmenu item is created under the body element
                if ($(this).children(".aggragator-state").length === 0) {
                    $(this).append($statusElement);
                }
            });

            this.applyPredefinedAggregators();
        }

        applyPredefinedAggregators() {
            for (let i = 0; i < this.options.predefinedAggregators.length; i++) {
                const aggregator = this.getAggregator(this.options.predefinedAggregators[i].column, AggregatorTypes[this.options.predefinedAggregators[i].type]);
                if (aggregator == undefined) {
                    this.handleError("DATALIST ERROR: Could not find aggregator " + this.options.predefinedAggregators[i].type + " for column " + this.options.predefinedAggregators[i].column + " in datalist status");
                    continue;
                }
                aggregator.enabled = true;
            }

            this.makeAggregatorRequest();
        }

        aggregatorContextMenuBeforeOpen(event, ui) {
            /*  NOTE: Because the context menu is the same object across all columns
             *        it should be refreshed to reflect the current aggregator state of
             *        the clicked column
             */
            const self = this;
            const $columnHeader = $(ui.target).closest("th");
            const columnInfo = this.getColumnInfoForElement($columnHeader);

            $(ui.menu).children().each(function (e) {
                const aggregator = self.getAggregator(columnInfo.name, $(this).data().command);
                $(this).data("enabled", aggregator != undefined && aggregator.enabled);
                $(this).find(".aggragator-state").toggle($(this).data("enabled"));
            });

            ui.menu.css("z-index", 9999);
        }

        aggregatorContextMenuSelect(event, ui) {
            const $columnHeader = $(ui.target).closest("th");
            const columnInfo = this.getColumnInfoForElement($columnHeader);

            const aggregator = this.getAggregator(columnInfo.name, ui.item.data().command);
            aggregator.enabled = !ui.item.data("enabled");

            this.makeAggregatorRequest();
        }

        renderAggregators(row, data, start, end, display) {
            const self = this;
            //If not initialized the dataTableInstance property is undefined
            if (!this.isInitialized) return;
            const hasAggregators = this.cache.aggregators != null;
            const $footer = $(this.dataTableInstance.table().footer());

            //If there are no aggregators add a class make it take zero space
            $footer.parent().toggleClass("empty-footer", !hasAggregators);
            $footer.parent().toggleClass("aggregator-footer", hasAggregators);


            for (let i = this.options.showRowNumbers ? 1 : 0; i < this.dataTableInstance.columns()[0].length; i++) {
                const columnInfo = this.getColumnInfoForElement($(this.dataTableInstance.column(i).header()));
                const $columnFooter = $(this.dataTableInstance.column(i).footer());
                const $aggregatorsWrapper = $("<ul></ul>");

                for (let j = 0; j < this.aggregatorsInfo.length; j++) {
                    if (columnInfo == undefined) {
                        this.handleError("DATALIST ERROR: ColumnInfo not found for column with index " + i);
                        continue;
                    }
                    let aggregator = this.getAggregator(columnInfo.name, this.aggregatorsInfo[j].type);

                    if (aggregator != undefined && aggregator.enabled &&
                        ((this.cache.groups == null && this.cache.aggregators != null)
                            || (this.cache.groups != null && this.cache.aggregators != null && this.cache.aggregators.Groups != null))) {
                        const aggregators = Common.isArray(this.cache.aggregators) && this.cache.groups == null
                            ? this.cache.aggregators
                            : this.cache.aggregators.Groups.Aggregates; //If grouping is enabled get the total/root values
                        const aggregatorValue = $.grep(aggregators, function (item: any) {
                            //The aggregator type is intentionally not strict because the Newtonsoft serializer
                            //handles the enum JSON value as string
                            return item.Type == aggregator.type && self.sanitizeColumnName(item.Column).toLowerCase() === self.sanitizeColumnName(aggregator.column).toLowerCase();
                        });
                        if (aggregatorValue.length !== 1) {
                            this.handleError("DATALIST ERROR: Aggregator value not found for column " + columnInfo.name);
                            continue;
                        }
                        const $aggregatorElement = $("<li> \
                                                        <span class='aggregator-caption'>" + this.aggregatorsInfo[j].totalText + "</span> \
                                                        <span span class='aggregator-value'>" + aggregatorValue[0].ValueFormatted + "</span> \
                                                      </li>");
                        $aggregatorsWrapper.append($aggregatorElement);
                    }
                }

                //Refresh footer with the new elements
                $columnFooter.empty();
                $columnFooter.append($aggregatorsWrapper);
            }

            this.updateDataTableSize();
        }

        /*********************** Aggregators [END] ***********************/

        /*********************** [BEGIN] Column Resize ***********************/

        configureColumnResize() {
            const self = this;

            //If resize is not enable don't do anything
            if (!this.options.hasResizableColumns) { return; }

            this.$wrapperElement.find("table thead th .resize-grip").each(function (event) {
                const $grip = $(this);

                //Use the jquery-ui draggable functionality
                $grip.draggable({
                    containment: $(this).closest("tr"),
                    axis: "x",
                    drag: (event, ui) => {
                        //Prevent the column to be less than the min column width
                        if (ui.position.left < self.options.minColumnWidth) {
                            ui.position.left = self.options.minColumnWidth;
                        }
                    },
                    stop: (event, ui) => {
                        /* NOTE: In order to adjust the column width to the position of the dragged grip
                         *       we inject the calculated width values to the datatables column settings
                         *       and NOT to the actual dom elements. This way we keep the compatibility
                         *       with the columns.adjust() function of the plugin and use it to apply the
                         *       redraw. Otherwise if the column widths are directly applied to the dom,
                         *       on each redraw the column widths get messed up.
                         */
                        const datatablesColumnSettings = self.dataTableInstance.settings()[0].aoColumns;  //Column settings used by the datatables plugin
                        const $headerTable = $grip.closest("table");
                        const $currentTh = $grip.closest("th");
                        const $allTh = $headerTable.find("th");

                        let totalWidth = 0;
                        $allTh.each(function (event) {
                            const $resizeGrip = $(this).find(".resize-grip");
                            const $th = $(this);
                            let columnWidth = 0;

                            if ($(this).hasClass(("row-number-column"))) {
                                //For the row number row just include it in the total width
                                columnWidth += this.offsetWidth;
                            } else {
                                //If we are at the active column get the width from the grip
                                if ($currentTh.get(0) === this) {
                                    columnWidth += $resizeGrip.get(0).offsetLeft; //The grip's left offset is the actual th width
                                } else {
                                    //...else get the width from the th element
                                    columnWidth += $th.get(0).offsetWidth; //The th actual width
                                }

                                //Get the columnInfo and use it to find the correct column setting
                                //since a column reorder could be applied
                                const columnInfo = self.getColumnInfoForElement($th);
                                const columnSettings = datatablesColumnSettings.filter((c) => { return c.data === columnInfo.name })[0];

                                if (columnSettings != undefined) {
                                    //This check is to update every column width if the original value is null or when we need to update
                                    //the column that triggered the change. Also save the new values to columnInfo in status.
                                    if (($currentTh.get(0) === this || columnSettings.sWidth == null)) {
                                        columnSettings.sWidth = columnWidth + "px";
                                        columnInfo.width = columnWidth + "px";
                                    }
                                    totalWidth += parseInt(columnSettings.sWidth);
                                }
                                //Because the resize is not done with pixel precision (due to the nature of table sizing),
                                //the column width may result in few more or few less pixels we need to remove the left css
                                //attribute from the grip to keep it in the correct possition
                                $resizeGrip.css("left", "");
                            }
                        });

                        //It's important to change the main table width for the columns.adjust function to work properly
                        self.$element.css("width", totalWidth);
                        //Trigger the resize through the plugin
                        self.dataTableInstance.columns.adjust();
                        //Save new state
                        self.dataTableInstance.state.save();
                    }
                });
            });
        }

        /*********************** Column Resize [END] ***********************/

        public intializeDateTimePicker($element) {
            if ($element.data("xdsoft_datetimepicker") == undefined) {
                //editable-formatting should exist only in editable datetime inputs and is used only for input values
                //and not for queries. For backend filtering the forced formatting should be used
                var fullFormat = $element.attr("editable-formatting") || DataListControl.DEFAULT_DATETIME_FORMAT;
                var dateSupport = fullFormat.match("[dDMY]") != null;
                var timeSupport = fullFormat.match("[HhmstfFz]") != null;
                var editedValue = $element.attr("editable-formatting") != null;
                var initialValue = moment($element.val(), fullFormat);

                $element.datetimepicker({
                    "format": fullFormat,
                    "datepicker": dateSupport,
                    "timepicker": timeSupport,
                    "onClose": (selectedTime, $pickerElement, event) => {
                        //Set zero time if not from editable field since filters only work with default DateTime formatted values
                        if (!editedValue || (editedValue && !timeSupport)) {
                            selectedTime.setUTCHours(0, 0, 0, 0); 
                        }

                        const previousSelectedTimeAsUTC = $pickerElement.data("selectedTime");
                        const selectedCustomInput = moment($pickerElement.val(), fullFormat);
                        const selectedTimeAsUTC = selectedCustomInput.isValid() ? selectedCustomInput.toDate().toISOString() : (Date as any).parseDate(selectedTime).toISOString();

                        if (selectedTimeAsUTC == previousSelectedTimeAsUTC) return;

                        //Set new value
                        $pickerElement.data("selectedTime", selectedTimeAsUTC);
                        //...and trigger on change if needed
                        if (editedValue) {
                            this.updateCellValue($pickerElement);
                        }
                    }
                });

                //If we have a valid moment.js date value then set it to the appropriate data key
                if (editedValue && initialValue.isValid()) {
                    $element.data("selectedTime", initialValue.toDate().toISOString());
                }
            }
        }

        public static getTotalRecords(jbID: string): number {
            let totalRecords: number = 0;
            try {
                totalRecords = this.instancesDic[jbID].cache.data.recordsTotal;
            } catch (e) {
                totalRecords = 0;
            }
            return totalRecords;
        }

        getModalDialogElement(dialogId: string, title: string, withCancel: boolean): JQuery {
            title = title || "";

            var cancel = withCancel === true
                ? `<button type='button' jb-type='Button' class='jb-control jb-simple-btn btn btn-default cancel-${dialogId}-modal-btn' ui-role-color='default' 
data-dismiss='modal'>${this.resources.textResources.DialogCancelButton}</button>`
                : ``;

            const $bootstrapModalHTML = $(`<div id='${this.clientsideElementId + '_' + dialogId}' class='modal fade' role='dialog'>
                                            <div class='modal-dialog'>
                                                <div class='modal-content'>
                                                    <div class='modal-header' >
                                                        <h4 class='modal-title'>${title}</h4>
                                                    </div>
                                                    <div class='modal-body'>
                                                    </div>
                                                    <div class='modal-footer'>
                                                        <button type='button' jb-type='Button' class='jb-control jb-simple-btn btn btn-primary btn-ok ok-${dialogId}-modal-btn'
ui-role-color='primary' data-dismiss='modal'>${this.resources.textResources.DialogOkButton}</button>
                                                        ${cancel}
                                                    </div>
                                                </div>
                                            </div>
                                         </div>`);

            if (this.options.useCustomModal) {
                this.$wrapperElement.on("click", `button.cancel-${dialogId}-modal-btn, button.ok-${dialogId}-modal-btn`, (e) => {
                    this.hideCustomModal(this.$wrapperElement.children(`div#${this.clientsideElementId}_${dialogId}`));
                });
            }

            return $bootstrapModalHTML;
        }

        reset() {
            this.resetInProgress = true;
            window.location.hash = "";

            // Clear Filters
            this.status.filters = [];
            this.clearAllSearchFields();

            // Reset Order
            this.status.orderBy = [];
            this.dataTableInstance.order([]);

            // Group By
            this.status.groupBy = [];

            // Aggregators
            for (let i = 0; i < this.status.aggregators.length; i++) {
                this.status.aggregators[i].enabled = false;
            }

            // Start Row
            this.status.startRow = 0;

            // Selection
            this.status.allKeysSelected = false;
            this.deselectAll();

            // Paging options
            if (this.options.hasPaging == true) {
                this.status.pageSize = this.options.pageSizes[0];
                this.dataTableInstance.page.len(this.status.pageSize);
                this.$element.find(".dataTables_length").val(this.status.pageSize);
            }

            // Column Order
            this.options.hasReorderableColumns === true && this.dataTableInstance["colReorder"] && this.dataTableInstance["colReorder"].reset();

            // Column Visibility
            this.resetColumnInfo();
            this.setColumnVisibility(true);

            // Active view
            this.viewsHelper.currentView = null;

            //Clear export settings
            this.status.exportSettings = {
                type: "Excel",
                range: "",
                fileName: "",
                exportTitle: "",
                includeGridLines: true,
                portraitOrientation: false,
                columnInfo: [],
                groupInfo: [],
                headerColor: "",
                evenColor: "",
                oddColor: "",
                groupColor: "",
                aggregateColor: ""
            };

            // Reload...
            this.dataTableInstance.ajax.reload();
            this.resetInProgress = false;
        }

        applyNumericMask($inputElement) {
            //If the mask is not already applied
            if ($inputElement.data("numericMaskOn") !== true) {
                $inputElement.on("keypress", (event) => {
                    const keyCode = event.which || event.keyCode;

                    const isNumber = keyCode >= 48 && keyCode <= 57;
                    const isDot = keyCode == 46;
                    const isComma = keyCode == 44;

                    //Reject invalid characters
                    if (!isNumber && !isDot && !isComma) {
                        return false;
                    }

                    if (isDot || isComma) {
                        //Allow only one decimal separator
                        if ($inputElement.val().indexOf(window._context.decimalSeparator) > -1) {
                            return false;
                        }

                        //Get the current input selection from 3rd-party black magic functions
                        const selection = this.getInputSelection($inputElement.get(0));
                        //Inject the proper decimal separator regardless of the pressed key (dot or comma)
                        $inputElement.val($inputElement.val().slice(0, selection.start) + window._context.decimalSeparator + $inputElement.val().slice(selection.end));
                        //Move the caret back to it's proper position using evil 3rd-party functions from hell
                        this.setInputSelection($inputElement.get(0), selection.start + 1, selection.start + 1);
                        return false;
                    }
                });

                //Disable paste functionality to be super safe
                $inputElement.on("paste", (event) => {
                    event.preventDefault();
                });
                $inputElement.data("numericMaskOn", true);
            }
        }

        intializeCustomModalListeners() {
            const self = this;
            this.$wrapperElement.find(".bootstrap-modal").each(function () {
                const $btnElement = $(this);
                const $targetDialog = self.$wrapperElement.find($btnElement.attr("data-target"));

                if ($targetDialog.length != 1) {
                    self.handleError("ERROR: Custom modal dialog button could not find it's related modal window");
                    return;
                }

                $btnElement.on("click", () => {
                    self.showCustomModal($targetDialog);
                });

                $targetDialog.on("click", (e) => {
                    if (e.target == $targetDialog.get(0)) {
                        self.hideCustomModal($targetDialog);
                    }
                });
            });
        }

        showCustomModal($element: JQuery) {
            //Handle fade background functionality
            const $modalBackdrop = $("<div class='modal-backdrop fade in'></div>");
            $("body").append($modalBackdrop);

            //Handle modal
            $element.attr("style", "display: block; padding-right: 5px;");
            $element.addClass("in");
        }

        hideCustomModal($element: JQuery) {
            //Handle fade background functionality
            $("body").children("div.modal-backdrop").remove();
            //Handle modal
            $element.attr("style", "display: none;");
            $element.removeClass("in");
        }

        /***************************************** Custom functionalities [END] ******************************************/

        /***************************************** Conditional Formattings ***********************************************/

        private getRowElementByRecordKey(key: any): JQuery {
            var dataTablesRow = this.dataTableInstance.rows('#' + key);

            if (dataTablesRow == null) return null;

            var dataTablesNodes = dataTablesRow.nodes();

            if (dataTablesNodes == null || dataTablesNodes.length == 0) return null;

            return $(dataTablesNodes[0]);
        }

        private getHeaderColumnElementByName(name: string): JQuery {
            return this.$element.find(`.header-label[data-name='${name}']`).eq(0).closest("th");
        }

        private applyConditionalFormattings() {
            if (this.ruleEvaluations == null || this.ruleEvaluations.length == 0) return;

            var rulesVarName =
                `${window._context.appName}.Controllers.${window._context.currentController}_${this.clientsideElementId}_ConditionalFormattings`;

            var rulesData = eval(rulesVarName);

            if (rulesData == null) {
                console.error("No c.f. Rules Data found for list!");
                return;
            }

            for (var i = 0; i < this.ruleEvaluations.length; i++) {
                var rule = this.ruleEvaluations[i];
                var state = rule.Status;
                var ruleInfo = rulesData[rule.RuleName];

                if (ruleInfo == null) {
                    console.error(`No data Rule Info found for list c.f. ${rule.RuleName}`);
                    continue;
                }

                // Row
                var $rowToApply = this.getRowElementByRecordKey(rule.Key);

                if (rule.ApplyToRow === true) {
                    var ruleInfoForRow = ruleInfo["forRow"];

                    if (ruleInfoForRow == null) {
                        console.error(`Row action cf data not found ${rule.RuleName}`);
                    } else {
                        var actions = state === true
                            ? ruleInfoForRow["whenTrue"]
                            : ruleInfoForRow["whenFalse"];

                        if (actions != null) {
                            window._ruleEngine.applyConditionalFormattingOnControl($rowToApply, state, actions);
                        }
                    }
                }

                // Cells
                if (rule.ApplyToColumn === true) {
                    for (let j = 0; j < rule.ColumnNames.length; j++) {
                        const colName = rule.ColumnNames[j];
                        const $columnToApply = this.getHeaderColumnElementByName(colName);

                        if ($columnToApply.length === 0) continue; // column not visible

                        const ruleInfoForColumn = ruleInfo["forColumns"][colName];

                        if (ruleInfoForColumn == null) {
                            console.error(`column action cf data not found ${colName}`);
                            continue; // column action data not found
                        }

                        var actions = state === true
                            ? ruleInfoForColumn["whenTrue"]
                            : ruleInfoForColumn["whenFalse"];

                        if (actions == null) continue; // state to do data not found

                        const index = $columnToApply.index();

                        const $cellToApply = $rowToApply.children("td").eq(index);

                        window._ruleEngine.applyConditionalFormattingOnControl($cellToApply, state, actions);
                    }
                }
            }
        }
        /***************************************** Conditional Formattings [END] *****************************************/

        /***************************************** [BEGIN] Input selections functions (3rd Party) ******************************************/
        getInputSelection(el) {
            var start = 0, end = 0, normalizedValue, range,
                textInputRange, len, endRange;

            if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
                start = el.selectionStart;
                end = el.selectionEnd;
            } else {
                range = (document as any).selection.createRange();

                if (range && range.parentElement() == el) {
                    len = el.value.length;
                    normalizedValue = el.value.replace(/\r\n/g, "\n");

                    // Create a working TextRange that lives only in the input
                    textInputRange = el.createTextRange();
                    textInputRange.moveToBookmark(range.getBookmark());

                    // Check if the start and end of the selection are at the very end
                    // of the input, since moveStart/moveEnd doesn't return what we want
                    // in those cases
                    endRange = el.createTextRange();
                    endRange.collapse(false);

                    if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                        start = end = len;
                    } else {
                        start = -textInputRange.moveStart("character", -len);
                        start += normalizedValue.slice(0, start).split("\n").length - 1;

                        if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                            end = len;
                        } else {
                            end = -textInputRange.moveEnd("character", -len);
                            end += normalizedValue.slice(0, end).split("\n").length - 1;
                        }
                    }
                }
            }

            return {
                start: start,
                end: end
            };
        }

        setInputSelection(el, startOffset, endOffset) {
            el.focus();
            if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
                el.selectionStart = startOffset;
                el.selectionEnd = endOffset;
            } else {
                var range = el.createTextRange();
                var startCharMove = this.offsetToRangeCharacterMove(el, startOffset);
                range.collapse(true);
                if (startOffset == endOffset) {
                    range.move("character", startCharMove);
                } else {
                    range.moveEnd("character", this.offsetToRangeCharacterMove(el, endOffset));
                    range.moveStart("character", startCharMove);
                }
                range.select();
            }
        }

        offsetToRangeCharacterMove(el, offset) {
            return offset - (el.value.slice(0, offset).split("\r\n").length - 1);
        }
        /***************************************** Input selections functions (3rd Party) [END] ******************************************/
    }

    interface IJbDataListScope extends IDataSourceControlScope {
        list: DataListControl;
        opts: any;
        forPickList: boolean;
    }

    function jbDataList(jbDataList: JbDataList): ng.IDirective {
        return {
            restrict: "AE",
            scope: {
                opts: "=?jbDataListOptions"
            },
            link: ($scope: IJbDataListScope, $element: JQuery) => {

                if (Common.directiveScopeIsReady($element)) return;

                Common.setDirectiveScope($element, $scope);

                $scope.initialize = () => {
                    $scope.list = new DataListControl($element, $scope.opts);
                }

                if ($scope.opts && $scope.opts.isPickList !== true) {
                    $scope.initialize();
                }

                Common.markDirectiveScopeAsReady($element);

                // Scope Inteface Implementation
                $scope.$addFilter = (e: Event, columnName: string, filterOp: string, rowOp: string, overwriteExisting: boolean, autoApply: boolean) => {
                    if (e.type != "blur") return;

                    const $target = $(e.target);
                    const isCheckBox = $target.attr("jb-type") == "CheckBox";
                    const id = $target.attr("jb-id");
                    const value = isCheckBox
                        ? $target.is(":checked")
                        : $target.val();

                    $scope.list.addCustomFilter(value, columnName, id, filterOp, rowOp, overwriteExisting, autoApply);
                }

                $scope.$clearFilters = (e: Event) => {
                    $scope.list.removeAllCustomFilters();
                    $scope.list.dataTableInstance.ajax.reload();
                }

                $scope.$applyFilters = (e: Event) => {
                    if ($scope.opts.waitForPredefinedFilters === true) {
                        $scope.list.dataTableInstance.draw();
                        $scope.list.$wrapperElement.fadeIn(2000);
                    }
                    else {
                        $scope.list.dataTableInstance.ajax.reload();
                    }
                }

                $scope.$globalFilter = (e: Event, autoApply: boolean) => {
                    var value = $(e.target).val();
                    $scope.list.addGlobalSearch(value, false);
                }

                $scope.$sortBy = (e: Event, member: string) => {
                    console.error("$sortBy Not Implemented yet!");
                }

                //var initCustomFilterListeners = () => {
                //    var dsName = DatasourceManager.getDataSetNameFromControl($element);

                //    $("[joove-ds-filter='true'][joove-ds-filter-for='" + dsName + "']").on("keydown", (e: JQueryEventObject) => {
                //        if (e.keyCode == 13) {
                //            $scope.$applyFilters(e);
                //        }
                //        else if (e.keyCode == 27) {
                //            $(e.target).val("").blur();
                //            $scope.$applyFilters(e);
                //        }
                //    });
                //}

                //initCustomFilterListeners();
            }
        }
    }

    angular.module("jbDataList", [])
        .provider("jbDataList", new JbDataList())
        .directive("jbDataList", ["$timeout", "jbDataList", jbDataList]);

    ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop']
        .forEach((event) => {
            window.addEventListener(event, (e: any) => {
                e = e || event;
                e.preventDefault();
            }, false);
        });
}
