var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Joove;
(function (Joove) {
    var Widgets;
    (function (Widgets) {
        var JbDataList = /** @class */ (function (_super) {
            __extends(JbDataList, _super);
            function JbDataList() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return JbDataList;
        }(Joove.BaseAngularProvider));
        var DataListControl = /** @class */ (function () {
            function DataListControl(element, options) {
                this.options = {
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
                this.aggregatorsInfo = [];
                this.fromMasterPage = false;
                this.viewsHelper = this.configureViewsHelper();
                this.instantiate(element, options, false);
            }
            /********************************************** [BEGIN] Initialization *********************************************/
            DataListControl.prototype.reInit = function () {
                this.destroyInProgress = true;
                this.dataTableInstance.destroy();
                this.destroyInProgress = false;
                this.dataTableInstance = null;
                this.$element.empty();
                this.instantiate(this.$element, this.options, true);
            };
            DataListControl.prototype.instantiate = function (element, options, fromReInit) {
                var _this = this;
                this.isInitialized = false;
                this.options = $.extend(this.options, options);
                this.exportHelper = new Widgets.ExportHelperV2(this);
                this.importHelper = new Widgets.ImportHelper(this);
                this.ruleEvaluations = null;
                this.dataSetName = "";
                this.$element = element;
                this.$element.empty();
                this.serversideElementId = Joove.Core.GetServerSideElementName(this.$element);
                this.clientsideElementId = Joove.Core.GetClientSideName(this.$element);
                var userPageSize = this.options.pageSizes.some(function (size) { return size > 0; }) ? this.options.pageSizes.filter(function (size) { return size > 0; })[0] : DataListControl.DEFAULT_PAGE_SIZE;
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
                };
                this.resources = new Widgets.DataListControlResources(window._resourcesManager.getDataListResources());
                if (this.options.isPickList === true) {
                    var uniqueId = this.$element.attr("unique-id");
                    console.log("table ", uniqueId);
                    Widgets.DataListControl.instancesDic[this.clientsideElementId + uniqueId] = this;
                }
                else {
                    Widgets.DataListControl.instancesDic[this.clientsideElementId] = this;
                }
                this.aggregatorsInfo = [
                    {
                        type: Joove.AggregatorTypes.COUNT,
                        pageText: this.resources.textResources.PageCount,
                        totalText: this.resources.textResources.GrandCount
                    },
                    {
                        type: Joove.AggregatorTypes.SUM,
                        pageText: this.resources.textResources.PageTotal,
                        totalText: this.resources.textResources.GrandTotal
                    },
                    {
                        type: Joove.AggregatorTypes.AVERAGE,
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
                    var initHiddenListPolling_1 = window.setInterval(function () {
                        if (_this.$element.is(":visible")) {
                            if (fromReInit === true || loggedIn === false) {
                                _this.init();
                            }
                            else {
                                _this.viewsHelper.fetchAllAvailableViews();
                            }
                            window.clearInterval(initHiddenListPolling_1);
                        }
                    }, 500);
                    return;
                }
            };
            DataListControl.prototype.getColumnInfoKey = function () {
                return this.options.isPickList ? this.clientsideElementId.substr(0, this.clientsideElementId.lastIndexOf("_PickList")) : this.clientsideElementId;
            };
            DataListControl.prototype.resetColumnInfo = function () {
                this.status.columnInfo = JSON.parse(JSON.stringify(window[this.getColumnInfoKey() + "_ColumnInfo"]));
            };
            DataListControl.prototype.init = function (scopeElement) {
                var _this = this;
                this.resetColumnInfo();
                if (this.status.columnInfo == undefined || this.status.columnInfo.length == undefined || this.status.columnInfo.length === 0) {
                    this.handleError("DATALIST ERROR: No ColumnInfo array found for DataList control with id " + this.getColumnInfoKey() + ". Aborting initialization.");
                    return;
                }
                this.$scopeElement = scopeElement || this.$element;
                this.dataSetName = Joove.DatasourceManager.getDataSetNameFromControl(this.$scopeElement);
                //Initialize aggregator state including all possible aggregators in a disabled state
                for (var i = 0; i < this.status.columnInfo.length; i++) {
                    var columnInfo = this.status.columnInfo[i];
                    if (!columnInfo.supportsAggregators)
                        continue;
                    this.status.aggregators.push(new Widgets.DataListAggregatorInfo(this.status.columnInfo[i].name, Joove.AggregatorTypes.COUNT, this.status.columnInfo[i].formatting));
                    if (Joove.Common.getMambaDataType(columnInfo.mambaDataType) === Joove.MambaDataType.NUMBER) {
                        var sumAggregator = new Widgets.DataListAggregatorInfo(this.status.columnInfo[i].name, Joove.AggregatorTypes.SUM, this.status.columnInfo[i].formatting);
                        var avgAggregator = new Widgets.DataListAggregatorInfo(this.status.columnInfo[i].name, Joove.AggregatorTypes.AVERAGE, this.status.columnInfo[i].formatting);
                        sumAggregator.encrypted = this.status.columnInfo[i].isEncrypted;
                        avgAggregator.encrypted = this.status.columnInfo[i].isEncrypted;
                        this.status.aggregators.push(sumAggregator);
                        this.status.aggregators.push(avgAggregator);
                    }
                }
                //Create the table footer
                var $footer = $("<tfoot class='datalist-footer'></tfoot>");
                var $footerRow = $("<tr></tr>");
                $.each(this.status.columnInfo, function (i) { $footerRow.append($("<th></th>")); });
                if (this.options.showRowNumbers)
                    $footerRow.append($("<th></th>"));
                $footer.append($footerRow);
                this.$element.append($footer);
                /*********************** [BEGIN] Settings ***********************/
                var dataTableSettings = {
                    processing: true,
                    serverSide: true,
                    order: [],
                    scrollX: true,
                    scrollCollapse: false,
                    deferRender: true,
                    language: this.resources.dataTablesResources
                };
                dataTableSettings.colReorder = this.options.hasReorderableColumns && this.options.showRowNumbers
                    ? { fixedColumnsLeft: 1 }
                    : this.options.hasReorderableColumns;
                dataTableSettings.lengthMenu = this.getPageSizeInfo(); //TODO: These values should be defined by the user
                dataTableSettings.select = this.options.hasMultiSelect ? "multi" : "single";
                var pagerLayout = this.options.hasPaging ? "p" : "";
                var pagerSizeLayout = this.options.hasPaging && this.options.userCanSelectPageSize ? "l" : "";
                var searchAndActionsLayout = this.options.isSearchable ? "<'col-sm-3 filter'f><'col-sm-5'<'actions'>>" : "<'col-sm-8'<'actions'>>";
                var bottomInfoLayout = "";
                if (this.options.hasMultiSelect && this.options.displayRecordsInfoRow) {
                    //Show info & multi-select buttons & pager
                    bottomInfoLayout = "<'col-sm-3 info'i><'col-sm-5 select-actions'><'col-sm-4 paginate'" + pagerLayout + ">";
                }
                else if (this.options.displayRecordsInfoRow) {
                    //Show info & pager
                    bottomInfoLayout = "<'col-sm-5 info'i><'col-sm-7 paginate'" + pagerLayout + ">";
                }
                else if (this.options.hasMultiSelect) {
                    //Show multi-select buttons & pager
                    bottomInfoLayout = "<'col-sm-6 select-actions'><'col-sm-6 paginate'" + pagerLayout + ">";
                }
                else {
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
                var dataListHeight = null;
                var heightRegexp = /[\s;]*height\s*:\s*([0-9]+.?([0-9]+)?(px|em|ex|%|in|cm|mm|pt|pc));?.*/;
                var match = heightRegexp.exec(this.$element.parent().attr("style"));
                if (match != null) {
                    dataListHeight = match[1];
                }
                //The standalone/picklist check is used just to initialize the datatables plugin with a scrollY value,
                //and then the value is overriden in the updateDataTableSize function manually. If the scrollY
                //value is omitted then scrolling container elements are not generated.
                if (this.options.isStandAlone || this.options.isPickList || dataListHeight !== null) {
                    dataTableSettings.scrollY = dataListHeight || DataListControl.DEFAULT_DATATABLES_MIN_HEIGHT;
                }
                dataTableSettings.buttons = this.getDatatablesButtonsConfiguration();
                dataTableSettings.columns = this.getColumnsConfiguration();
                dataTableSettings.initComplete = function (settings, json) {
                    _this.onDataTablesInit(settings);
                    _this.initializationComplete(settings, json);
                };
                dataTableSettings.ajax = function (data, callback, settings) {
                    _this.makeDatasourceRequest(data, callback, settings);
                };
                dataTableSettings.footerCallback = function (row, data, start, end, display) { _this.renderAggregators(row, data, start, end, display); };
                dataTableSettings.drawCallback = function (settings) { _this.drawCallback(); };
                dataTableSettings.rowId = "_key";
                dataTableSettings.bAutoWidth = !this.options.hasResizableColumns;
                dataTableSettings.stateSave = true;
                dataTableSettings.stateDuration = -1;
                dataTableSettings.stateSaveCallback = function (settings, data) {
                    data.status = JSON.parse(JSON.stringify(_this.status)); // clone
                    if (_this.options.rememberLastState == true) {
                        // save state to local storage
                        _this.viewsHelper.currentViewSerializedStatus = JSON.stringify(data);
                        _this.viewsHelper.saveStateToLocalStorage();
                    }
                    // set views helper status with 0 start row
                    // so that any custom views saved, start from first page
                    data.status.startRow = 0;
                    _this.viewsHelper.currentViewSerializedStatus = JSON.stringify(data);
                };
                dataTableSettings.stateLoadCallback = function (settings, cb) {
                    _this.viewsHelper.dataTablesLoadStateFunction = cb;
                    var currentStatusSerialized = _this.viewsHelper.currentViewSerializedStatus;
                    if (currentStatusSerialized != null) {
                        try {
                            var savedStatus = JSON.parse(currentStatusSerialized);
                            var isStatusValid = _this.viewsHelper.viewStatusIsValid(savedStatus);
                            if (isStatusValid === true) {
                                _this.status = savedStatus.status;
                                cb(savedStatus);
                            }
                            else {
                                console.error("List View '" + _this.viewsHelper.currentView.ViewName + "' is invalid!");
                                cb(settings);
                            }
                        }
                        catch (e) {
                            console.error("Error while loading list View '" + _this.viewsHelper.currentView.ViewName + "'");
                            cb(settings);
                        }
                    }
                    else {
                        cb(settings);
                    }
                    //This is to show the clear button in case a search term is applied in any search input
                    _this.$wrapperElement.find(".search-input").trigger("change");
                };
                /*********************** Settings [END] ***********************/
                this.$element.DataTable(dataTableSettings);
                this.compositeFiltersHelper = new Widgets.CompositeFiltersHelper(this);
            };
            DataListControl.prototype.onDataTablesInit = function (dataTableSettings) {
                var _this = this;
                var self = this;
                this.dataTableInstance = dataTableSettings.oInstance.api(); //Temporary assignment to avoid undefined exceptions
                this.$wrapperElement = $(this.dataTableInstance.table().container());
                this.$loadingPanel = this.$wrapperElement.find(".dataTables_processing");
                this.$wrapperElement.addClass("datatables-wrapper");
                this.$wrapperElement.addClass("not-initialized");
                this.$wrapperElement.toggleClass("standalone", this.options.isStandAlone);
                /*********************** [BEGIN] Register DataTables events ***********************/
                this.$element.on("page.dt", function (event, settings) {
                    _this.dataTablePageEvent();
                });
                this.$element.on("length.dt", function (event, settings) {
                    _this.dataTablePageSizeEvent();
                });
                /**
                 * NOTE: Normally the order.dt event is triggered before the ajax request as the documentation suggests. But
                 *       in the current implementation for some reason it is triggered after the request. Also for some reason
                 *       the search event is triggered before the ajax request when sorting columns. So the order event is moved
                 *       with the search event until this is fixed.
                 */
                this.$element.on("order.dt", function (event, settings) {
                });
                this.$element.on("search.dt", function (event, settings) {
                    if (_this.isInitialized === false || _this.destroyInProgress === true || _this.resetInProgress === true)
                        return;
                    //This is to avoid multiple search triggers when switching views
                    if (_this.lastSearchEventTimestamp == null) {
                        _this.lastSearchEventTimestamp = event.timeStamp;
                    }
                    else if (event.timeStamp - _this.lastSearchEventTimestamp < 500) {
                        return;
                    }
                    _this.lastSearchEventTimestamp = event.timeStamp;
                    _this.dataTableSearchEvent();
                    _this.dataTableOrderEvent(event);
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
                    if ((!_this.options.isPickList || (_this.options.isPickList && !_this.options.hasMultiSelect)) && !_this.updateFromCache) {
                        _this.setSelectedItemKeys([]);
                    }
                    //When the data length is affected the aggregators should be refreshed
                    _this.makeAggregatorRequest();
                });
                this.$element.on("column-reorder.dt", function (event, settings, details) {
                    _this.dataTableColumnReorderEvent(details);
                });
                this.$element.on('column-visibility.dt', function (event, settings, columnIndex, state) {
                    _this.dataTableColumnVisibilityEvent(event, settings, columnIndex, state);
                });
                this.$element.on('user-select.dt', function (event, datatable, type, cell, originalEvent) {
                    //Prevent default select behaviour to manually handle single and double click actions
                    event.preventDefault();
                    //If an editable input is clicked then prevent selection
                    if ($(originalEvent.target).hasClass("editable-input")) {
                        return;
                    }
                    //Execute the selection after the specified double click threshold to give time
                    //to a possible double click event to be captured
                    var $row = $(originalEvent.target).closest("tr");
                    setTimeout(function () {
                        if ($row.data("dblclick") !== true) {
                            //Any user action resets the allKeysSelected state
                            _this.status.allKeysSelected = false;
                            if ($row.hasClass("selected")) {
                                datatable.row($row.get(0)).deselect();
                            }
                            else {
                                //In case there is a selected item in its inital state make sure to clear it
                                //if no multi-selection is enabled
                                if (!_this.options.hasMultiSelect && _this.status.selectedItems.length > 0) {
                                    _this.setSelectedItemKeys([]);
                                }
                                //Check that maxSelectedRows option is honoured (if enabled)
                                if (_this.maxSelectedRowsReached()) {
                                    return;
                                }
                                datatable.row($row.get(0)).select();
                            }
                            //Update directive & model. Picklist handles the directive scope when pressing ok
                            _this.listSelectionChanged();
                        }
                    }, DataListControl.DOUBLE_CLICK_THRESHOLD);
                });
                this.$element.on("select.dt", function (event, datatable, type, indexes) {
                    _this.dataTableSelectEvent(event, datatable, type, indexes);
                });
                this.$element.on("deselect.dt", function (event, datatable, type, indexes) {
                    _this.dataTableSelectEvent(event, datatable, type, indexes);
                });
                /*********************** Register DataTables events [END] ***********************/
                /*********************** [BEGIN] Register custom events ***********************/
                /*********************** [BEGIN] Hover column effect ***********************/
                this.$element.on("mouseenter", "td", function (event) {
                    var cellInfo = _this.dataTableInstance.cell(event.currentTarget).index();
                    if (cellInfo == undefined)
                        return;
                    var columnIndex = cellInfo.column;
                    $(_this.dataTableInstance.column(columnIndex).nodes()).addClass("highlight");
                });
                this.$element.on("mouseleave", "td", function (event) {
                    var cellInfo = _this.dataTableInstance.cell(event.currentTarget).index();
                    if (cellInfo == undefined)
                        return;
                    var columnIndex = cellInfo.column;
                    $(_this.dataTableInstance.column(columnIndex).nodes()).removeClass("highlight");
                });
                /*********************** Hover column effect [END] ***********************/
                /*********************** [BEGIN] Double click Event ***********************/
                this.$element.on("dblclick", "tr", function (event) {
                    var $row = $(this);
                    //Picklist mode and group rows don't have double click functionality
                    if ((self.options.isPickList && self.options.hasMultiSelect) || $row.hasClass("group-row") || self.dataTableInstance.table().rows().count() == 0) {
                        return;
                    }
                    //Set the dblclick flag to avoid executing row selection in the user-select.dt event
                    $row.data("dblclick", true);
                    //Deselect any selected rows
                    self.dataTableInstance.table().rows().deselect();
                    //And select the current row
                    self.dataTableInstance.row(this).select();
                    //Update directive & model
                    self.updateDirectiveScopeAndModel();
                    //Execute the default list action if any
                    var $defaultAction = self.$wrapperElement.find(".actions button.list-default-action");
                    if ($defaultAction.length === 1)
                        $defaultAction.click();
                    //Change the dblclick flag to allow single click selection again in the current row
                    setTimeout(function () {
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
                    if ($(this).hasClass("datetime-picker"))
                        return;
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
                    $(window).on("resize", function () {
                        _this.updateDataTableSize();
                        _this.updateActionButtonVisibility(); //To enable/disable compact mode
                    });
                }
                /*********************** Register custom events [END] ***********************/
                //Initialize datepicker plugin
                this.initializeDatepickerPlugIn();
                if (this.options.waitForPredefinedFilters == true) {
                    this.$wrapperElement.hide();
                }
            };
            DataListControl.prototype.listSelectionChanged = function () {
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
                Joove.DatasourceManager.invokeOnChangeHandler(this.$scopeElement);
            };
            DataListControl.prototype.configureViewsHelper = function () {
                var _this = this;
                var fetchCb = function () {
                    _this.viewsHelper.loadInitialView(false);
                    _this.init();
                };
                var saveCb = function () {
                    console.log("TODO: VIEW SAVE CB");
                };
                var loadCb = function (redraw) {
                    if (redraw === true) {
                        _this.reInit();
                    }
                    else {
                        // who knows what...
                    }
                };
                return new Widgets.UserViewsHelper(this, {
                    fetchCb: fetchCb,
                    saveCb: saveCb,
                    loadCb: loadCb
                });
            };
            //Callback function
            DataListControl.prototype.initializationComplete = function (settings, json) {
                var _this = this;
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
                var $tableElements = $("table[jb-id='" + this.$element.attr('jb-id') + "']", this.$wrapperElement);
                if ($tableElements.length > 1) {
                    for (var i = 0; i < $tableElements.length; i++) {
                        if ($tableElements.eq(i).children("tbody").length === 0) {
                            //Remove jb-id and conditional formattings from the cloned elements
                            var attributes = $tableElements.get(i).attributes;
                            for (var j = attributes.length - 1; j >= 0; j--) {
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
                var dataListCustomInitFunction = window["DataListCustomInitFunction"];
                if (dataListCustomInitFunction) {
                    dataListCustomInitFunction(this.$element, settings.oInstance.api());
                }
                //Hide columns that are defined as not visible
                this.setColumnVisibility();
                /* NOTE: The following page reset should be done when ordering is actually triggered. The events: order.dt, search.dt etc.
                 *       only maintain the status object to be up to date with the datalist state. Because they're triggered on multiple
                 *       occasions the following page reset is done only when the user actually clicks on the column header.
                 */
                this.$wrapperElement.on("click", "table[jb-type='DataList'] thead th.sorting, table[jb-type='DataList'] thead th.sorting_asc, table[jb-type='DataList'] thead th.sorting_desc", function (event) {
                    _this.dataTableInstance.page(0);
                });
                var _loop_1 = function (i) {
                    var columnInfo = this_1.status.columnInfo[i];
                    var datatablesColumnSettings = settings.aoColumns; //Column settings used by the datatables plugin
                    var columnSettings = datatablesColumnSettings.filter(function (c) { return c.data === columnInfo.name; })[0];
                    if (columnSettings == undefined)
                        return "continue";
                    columnSettings.sWidth = columnInfo.width;
                };
                var this_1 = this;
                //Apply custom width on columns if present in the columnInfo section
                for (var i = 0; i < this.status.columnInfo.length; i++) {
                    _loop_1(i);
                }
                //Update group by dialog
                this.updateGroupingDialogState();
                this.isInitialized = true;
                // Request a redraw in order to get the actual data now that the datatables element is initialized
                // If it's a picklist it will request the actual data when displayed
                // TODO: Investigate why this needs a 'minimum' timeout. Data is not requested without it!
                if (!this.options.isPickList) {
                    setTimeout(function () { _this.dataTableInstance.draw(); }, 10);
                }
            };
            DataListControl.prototype.setColumnVisibility = function (forReset) {
                for (var j = this.options.showRowNumbers ? 1 : 0; j < this.dataTableInstance.columns().count(); j++) {
                    var columnInfo = this.getColumnInfoForElement($(this.dataTableInstance.column(j).header()));
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
            };
            /********************************************** Initialization [END] *********************************************/
            /****************************************** [BEGIN] Data Helper Functions ******************************************/
            DataListControl.prototype.prepareDatasourceRequestInfo = function () {
                var request = new Joove.DatasourceRequest(this.$scopeElement, this.status.startRow, this.status.pageSize, this.status.filters, this.status.orderBy, this.status.excludedKeys, this.status.groupBy);
                return request;
            };
            DataListControl.prototype.updateDatasourceFromCache = function () {
                this.updateFromCache = true;
                this.dataTableInstance.draw(false);
                this.updateFromCache = false;
            };
            DataListControl.prototype.makeDatasourceRequest = function (data, callback, settings) {
                /*   NOTE: If not initialized proceed with an empty dataset to avoid UI glitches
                 *         due to custom elements being initialized after the datasource request
                 */
                var _this = this;
                if (!this.isInitialized || this.updateFromCache) {
                    callback(this.cache.data);
                    return;
                }
                var datasourceRequestInfo = this.prepareDatasourceRequestInfo();
                Joove.DatasourceManager.fetch(this.$scopeElement, this.serversideElementId, datasourceRequestInfo, {
                    success: function (response) {
                        //The following Cycles.reconstructObject is being executed already in the
                        //DatasourceManager module. If executed again it causes infinite loop and
                        //stackoverflow occurs.
                        //
                        //Restore references
                        //Cycles.reconstructObject(response.Data);
                        //Save the response to the client cache for future reference
                        _this.cache.data.data = response.Data;
                        _this.cache.groups = response.Groups;
                        _this.cache.data.recordsTotal = response.TotalRows;
                        _this.cache.data.recordsFiltered = response.TotalRows;
                        _this.ruleEvaluations = response.RuleEvaluations;
                        //The following callback is defined in the Datatables implementation
                        callback(_this.cache.data);
                        //Remove the not-initialized class that was added in the init function
                        _this.$wrapperElement.removeClass("not-initialized");
                        _this.updateRowNumbers();
                        //Update UI according to the selected keys
                        var rowIdSelector = _this.status.selectedKeys.map(function (t) { return "#" + t; });
                        _this.dataTableInstance.rows(rowIdSelector).select();
                        _this.updateActionButtonVisibility();
                    },
                    error: function (data) {
                        _this.handleError(data);
                    }
                }, []);
            };
            DataListControl.prototype.makeAggregatorRequest = function () {
                var _this = this;
                var activeAggregators = $.grep(this.status.aggregators, function (item) { return item.enabled; });
                if (activeAggregators.length === 0) {
                    this.cache.aggregators = null;
                    this.renderAggregators(null, null, null, null, null);
                    if (this.cache.groups != null) {
                        this.renderGroups();
                    }
                    this.dataTableInstance.state.save();
                    return;
                }
                var datasourceRequestInfo = this.prepareDatasourceRequestInfo();
                Joove.DatasourceManager.fetch(this.$scopeElement, this.serversideElementId, datasourceRequestInfo, {
                    success: function (data) {
                        _this.cache.aggregators = data;
                        if (_this.cache.groups != null) {
                            _this.renderGroups();
                        }
                        _this.renderAggregators(null, null, null, null, null);
                        _this.dataTableInstance.state.save();
                    },
                    error: function (data) {
                        _this.handleError(data);
                    }
                }, activeAggregators);
            };
            DataListControl.prototype.setSelectedItemKeys = function (selectedItemKeys) {
                var _this = this;
                if (this.options.isPickList !== true) {
                    var storedSelectedKeys = this.viewsHelper.getStoredSelectedKeys(true);
                    if (storedSelectedKeys != null) {
                        selectedItemKeys = storedSelectedKeys;
                    }
                }
                var directiveScope = Joove.Common.getDirectiveScope(this.$scopeElement);
                if (!selectedItemKeys) {
                    this.handleError("DATALIST ERROR: The selected item keys requires an array of keys to select which was not provided");
                    return;
                }
                var notDefaultSelectedItemKeys = [];
                for (var i = 0; i < selectedItemKeys.length; i++) {
                    var key = selectedItemKeys[i];
                    if (Joove.Common.keyHasDefaultValue(key) === true)
                        continue;
                    notDefaultSelectedItemKeys.push(key);
                }
                selectedItemKeys = notDefaultSelectedItemKeys;
                if (selectedItemKeys.length === 0) {
                    //When the provided selected item keys array is empty then everything is deselected
                    this.dataTableInstance.rows().deselect();
                    this.status.selectedItems = [];
                    this.updateDirectiveScopeAndModel();
                    return;
                }
                else if (this.options.maxSelectedRows > 0 && selectedItemKeys.length > this.options.maxSelectedRows) {
                    this.handleError("DATALIST ERROR: The selected item keys exceed the maxSelectedRows limit. Requested keys were not set as selected");
                    return;
                }
                //Get the rows according to the selected keys
                var rowIdSelector = selectedItemKeys.map(function (t) { return "#" + t; });
                var selectedRows = this.dataTableInstance.rows(rowIdSelector);
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
                    Joove.DatasourceManager.requestSelectedItemsfromServer(this.serversideElementId, this.$scopeElement, directiveScope.itemDataType, this.status.allKeysSelected, selectedItemKeys, this.status.excludedKeys, //This option is the keysToExclude which is used only when allKeysSelected is true
                    this.prepareDatasourceRequestInfo(), function (selectedItemsData) {
                        //Hide the loading panel
                        _this.$loadingPanel.hide();
                        if (selectedItemsData == null)
                            selectedItemsData = [];
                        //Ensure we always handle an array
                        if (!Joove.Common.isArray(selectedItemsData)) {
                            selectedItemsData = [selectedItemsData];
                        }
                        _this.status.selectedItems = selectedItemsData;
                        if (storedSelectedKeys != null) {
                            _this.listSelectionChanged();
                        }
                        else {
                            _this.updateDirectiveScopeAndModel();
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
            };
            DataListControl.prototype.maxSelectedRowsReached = function (numberOfRowsToCheck) {
                numberOfRowsToCheck = numberOfRowsToCheck || -1;
                var conditionReached = this.options.maxSelectedRows > 0 && (this.status.selectedItems.length >= this.options.maxSelectedRows || numberOfRowsToCheck > this.options.maxSelectedRows);
                if (conditionReached) {
                    this.dataTableInstance.buttons.info(this.resources.textResources.MaxSelectedRowsLimitationTitle, (this.resources.textResources.MaxSelectedRowsLimitationMessage || "").replace("%d", this.options.maxSelectedRows), 2000);
                }
                return conditionReached;
            };
            DataListControl.prototype.updateDirectiveScopeAndModel = function (callback) {
                var _this = this;
                var directiveScope = Joove.Common.getDirectiveScope(this.$scopeElement);
                //Update the directive scope
                directiveScope.selectedItems = this.status.selectedItems;
                directiveScope.selectedItemKeys = Joove.DatasourceManager.getKeys(directiveScope.selectedItems);
                //Update the model
                Joove.DatasourceManager.updateSelectedKeysInModel(this.serversideElementId, directiveScope.selectedItemKeys, this.status.allKeysSelected, Joove.Common.getIndexesOfControl(this.$scopeElement).indexes); //TODO: there is a 5th parameter for master page...
                //Refresh status from directive scope
                this.status.selectedKeys = directiveScope.selectedItemKeys;
                this.dataTableInstance.state.save();
                if (callback === false)
                    return; //This case is only true when called from the picklist to avoid refreshLogic double execution
                //Update conditional formattings based on selected items
                window.$refreshLogic(function () {
                    //Update action buttons and picklist buttons visibility based on the selected items state
                    //after posible conditional formattings are executed
                    _this.updateActionButtonVisibility();
                    //Execute callback if any
                    if (callback)
                        callback();
                });
            };
            DataListControl.prototype.showFullImage = function ($img) {
                var src = $img.attr("src");
                var $fullImg = $("<img style='max-width: 100%; max-height: 100%; position: relative; top: 50%; transform: translateY(-50%);' src='" + src + "&thumbnail=false' />").appendTo("body");
                window._popUpManager.showCustomPopUp({
                    name: this.serversideElementId + src,
                    title: "",
                    width: "85%",
                    height: "85%",
                    destroyOnHide: true,
                    $elementContent: $fullImg,
                    cancelButton: true,
                    onShowCallback: function ($popUp) {
                        $popUp.find("[jb-type='ModalBody']").css("text-align", "center");
                    },
                    dismissible: true
                });
            };
            DataListControl.prototype.updateCellValue = function ($input) {
                var _this = this;
                //Get the corresponding column header of the editable input in action
                var $columnHeader = $(this.dataTableInstance.column(this.dataTableInstance.cell($input.closest("td")).index().column).header());
                //Get the columnInfo for from the column header
                var columnInfo = this.getColumnInfoForElement($columnHeader);
                var rowData = this.dataTableInstance.row(this.dataTableInstance.cell($input.closest("td")).index().row).data();
                var cellValue = $input.val();
                if ($input.is("input[type='checkbox']")) {
                    cellValue = $input.is(":checked");
                }
                else if ($input.hasClass("datetime-picker")) {
                    cellValue = $input.data("selectedTime");
                }
                var requestParameters = {
                    "key": rowData._key,
                    "property": columnInfo.name,
                    "value": cellValue
                };
                //We also need to update the altered value in datatables instance. To do that we need to make the update the cache
                //and refresh the instance from the altered cache state.
                var cachedRowData = this.cache.data.data.filter(function (item) { return item._key === requestParameters.key; })[0];
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
                var referencesAccrossModel = this.getReferencesAccrossViewModel(rowData._key, rowData._originalTypeClassName);
                for (var i = 0; i < referencesAccrossModel.length; i++) {
                    if (referencesAccrossModel[i][requestParameters.property] !== undefined) {
                        referencesAccrossModel[i][requestParameters.property] = requestParameters.value;
                    }
                }
                if (this.options.onUpdateAction === null) {
                    var options = {
                        controller: window._context.currentController,
                        action: this.serversideElementId + "_UpdateCell",
                        postData: requestParameters,
                        cb: function () { _this.updateRowNumbers(); }
                    };
                    Joove.Core.executeControllerActionNew(options);
                }
                else {
                    Joove.Core.getScope().actions[this.options.onUpdateAction](rowData);
                }
            };
            DataListControl.prototype.getReferencesAccrossViewModel = function (key, runtimeType) {
                var seenInstances = [];
                var results = [];
                if (key == undefined || key == null || runtimeType == undefined || runtimeType == null || typeof runtimeType !== "string" || runtimeType.length === 0) {
                    this.handleError("DATALIST ERROR: Invalid key and/or runtime type during cell update. Cannot dected references accross model with invalid search info.");
                    return [];
                }
                //Recursive function that searches by _key and class name
                var searchForReferences = function (rootObject, key, runtimeType) {
                    //If we parsed this object instance skip to avoid cycles
                    if (seenInstances.indexOf(rootObject) > -1) {
                        return;
                    }
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
                        if (!(rootObject instanceof Object)) {
                            return;
                        }
                        //...else check for the key and the runtime type
                        if (rootObject._key != undefined && rootObject._originalTypeClassName != undefined
                            && rootObject._key == key && rootObject._originalTypeClassName == runtimeType
                            && results.indexOf(rootObject) === -1) {
                            results.push(rootObject);
                        }
                        //Check the current object
                        for (var prop in rootObject) {
                            //Ignore primitive datatypes and functions
                            if (!(rootObject[prop] instanceof Object) || typeof rootObject[prop] === "function") {
                                continue;
                            }
                            searchForReferences(rootObject[prop], key, runtimeType);
                        }
                    }
                };
                searchForReferences(window["$form"].model, key, runtimeType);
                return results;
            };
            DataListControl.prototype.getColumnsConfiguration = function () {
                var _this = this;
                var dataTablesColumnInfo = [];
                if (this.options.showRowNumbers) {
                    dataTablesColumnInfo.push({
                        "data": null,
                        "className": "row-number-column",
                        "title": "",
                        "orderable": false,
                        "searchable": false,
                        "width": "50px",
                        "render": function (data, type, row) {
                            return "";
                        }
                    });
                }
                var _loop_2 = function (i) {
                    var columnInfo = this_2.status.columnInfo[i];
                    dataTablesColumnInfo.push({
                        "title": this_2.getColumnHeaderHTML(columnInfo, i),
                        "data": columnInfo.name,
                        "name": columnInfo.name,
                        "orderable": columnInfo.orderable,
                        "searchable": this_2.options.isSearchable && columnInfo.searchable,
                        "width": columnInfo.width,
                        "className": columnInfo.classes || "",
                        "render": function (data, type, row) { return _this.cellRender(data, type, row, columnInfo); }
                    });
                };
                var this_2 = this;
                for (var i = 0; i < this.status.columnInfo.length; i++) {
                    _loop_2(i);
                }
                return dataTablesColumnInfo;
            };
            DataListControl.prototype.cellRender = function (data, type, row, columnInfo) {
                var outputData;
                var numericDataTypes = ["byte", "int", "long", "float", "decimal", "double"];
                var valueFormat = new Joove.ValueFormat(columnInfo.formatting);
                //Safely handle empty fields
                if (data == null) {
                    outputData = "";
                }
                else if (columnInfo.dataType == "FileData" && data != null) {
                    outputData = "" + window._context.siteRoot + window._context.currentController + "/Download_" + this.serversideElementId + "_" + columnInfo.name + "?key=" + row._key;
                }
                else if (columnInfo.formatting != null) {
                    outputData = valueFormat.format(data);
                }
                else if (columnInfo.mambaDataTypeIsEnum === true) {
                    //Try to find the enum in order to display string info instead of numbers
                    var enumClass = window[window["_context"].appName].BO[columnInfo.mambaDataType];
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
                            var forcedDateFormat = "DD/MM/YYYY";
                            var inputValue = data != null ? valueFormat.format(data) : "";
                            return "<input type='text' class='form-control datetime-picker editable-input' value='" + inputValue + "' formatting='" + forcedDateFormat + "' editable-formatting='" + valueFormat.dateFormat + "' style='" + columnInfo.css + "' />";
                        case "bool":
                            var isChecked = outputData ? "checked='checked'" : "";
                            return "<input type='checkbox' class='editable-input' " + isChecked + " style='" + columnInfo.css + "' />";
                        default:
                            var value = data == null ? "" : data;
                            var isNumeric = Joove.Common.getMambaDataType(columnInfo.dataType) === Joove.MambaDataType.NUMBER;
                            return "<input type='text' class='form-control editable-input" + (isNumeric ? " numeric-mask" : "") + "' value='" + value + "' style='" + columnInfo.css + "' />";
                    }
                }
                else {
                    switch (columnInfo.itemType) {
                        case Widgets.DataListColumnItemType.IMAGEBOX:
                            var extraImgCls = columnInfo.showFullImage == true
                                ? "show-full"
                                : "";
                            var extraCss = columnInfo.showFullImage == true
                                ? "cursor: pointer;"
                                : "";
                            return outputData == "" || outputData == null
                                ? ""
                                : "<img class='datalist-img " + extraImgCls + "' data-src='" + outputData + "' style='" + extraCss + " " + columnInfo.css + "' />";
                        case Widgets.DataListColumnItemType.DOWNLOADLINK:
                            if (outputData == "" || outputData == null)
                                return "";
                            return columnInfo.dataType == "FileData"
                                ? "<a class='download-link' target='_blank' href='" + outputData + "' style='" + columnInfo.css + "'>" + data.FileName + "</a>"
                                : "<a class='download-link' target='_blank' href='DownloadFileByPath?path=" + outputData + "' style='" + columnInfo.css + "'>" + outputData + "</a>";
                        case Widgets.DataListColumnItemType.CHECKBOX:
                            var isChecked = outputData ? "checked='checked'" : "";
                            return "<input type='checkbox' " + isChecked + "disabled='disabled' style='" + columnInfo.css + "' />";
                        case Widgets.DataListColumnItemType.HYPERLINK:
                            return "<a target='_blank' href='" + outputData + "' style='" + columnInfo.css + "'>" + outputData + "</a>";
                        case Widgets.DataListColumnItemType.HTML:
                            var content = $("<div></div>").html(outputData).text();
                            return "<div class='output-data' style='" + columnInfo.css + "'>" + content + "</div>";
                        default:
                            return "<div class='output-data' style='" + columnInfo.css + "'>" + outputData + "</div>";
                    }
                }
            };
            /* NOTE: Because the header is currently handled as a string and not as jQuery elements
             *       the html is passed to the title column attribute and the element behaviour is
             *       defined at the init callback function
             */
            DataListControl.prototype.getColumnHeaderHTML = function (columnInfo, index) {
                var caption = columnInfo.caption || columnInfo.name;
                var resizableGrip = this.options.hasResizableColumns ? "<div class='resize-grip'></div>" : "";
                var labelHTML = "<label class='header-label' data-original-index='" + index + "' data-name='" + columnInfo.name + "'>" + caption + "</label>" + resizableGrip;
                if (!(this.options.isSearchable && columnInfo.searchable)) {
                    return labelHTML;
                }
                var $wrapper = $("<div class='quick-filter'></div>");
                var $input;
                switch (columnInfo.dataType.toLowerCase()) {
                    case "bool":
                        $input = $("<select class='form-control search-select'> \
                                    <option value=''></option> \
                                    <option value='true'>" + this.resources.textResources.True + "</option> \
                                    <option value='false'>" + this.resources.textResources.False + "</option> \
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
                var $searchElement = this.convertInputToSearchElement($input);
                $wrapper.append($searchElement);
                return labelHTML + $wrapper.get(0).outerHTML;
            };
            DataListControl.prototype.getDatatablesButtonsConfiguration = function () {
                var buttons = [];
                var columnFilter = this.options.showRowNumbers ? ":gt(0)" : undefined;
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
                        columnText: function (dt, idx, title) {
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
            };
            DataListControl.prototype.getPageSizeInfo = function () {
                var sizesValue;
                var sizesText = [];
                if (!this.options.hasPaging) {
                    sizesValue = [-1];
                }
                else {
                    sizesValue = this.options.pageSizes;
                }
                for (var i = sizesValue.length - 1; i >= 0; i--) {
                    if (sizesValue[i] > 0) {
                        sizesText.push(sizesValue[i] + " " + this.resources.textResources.Records);
                    }
                    else if (sizesValue[i] == -1) {
                        sizesText.push(this.resources.textResources.All);
                    }
                    else {
                        sizesValue.splice(i, 1);
                    }
                }
                return [sizesValue, sizesText.reverse()];
            };
            DataListControl.prototype.getColumnInfoForElement = function ($columnHeader) {
                var columnIndex = $columnHeader.find(".header-label").data("original-index");
                var columnInfo = this.status.columnInfo[columnIndex];
                return columnInfo;
            };
            DataListControl.prototype.getAggregator = function (columnName, aggregatorType) {
                var aggregator = $.grep(this.status.aggregators, function (item) {
                    return item.column === columnName && item.type === aggregatorType;
                });
                return aggregator[0];
            };
            DataListControl.prototype.isAggregatorDisabled = function ($columnHeader, aggregatorType) {
                var columnInfo = this.getColumnInfoForElement($columnHeader);
                return this.getAggregator(columnInfo.name, aggregatorType) == undefined;
            };
            DataListControl.prototype.sanitizeColumnName = function (name) {
                return name.replace(/\W/, DataListControl.SANITIZE_COLUMN_REPLACEMENT_VALUE);
            };
            DataListControl.prototype.handleError = function (error) {
                //TODO: Handle errors in a more sophisticated way :P
                console.log(error);
                this.$loadingPanel.hide();
            };
            /****************************************** Data Helper Functions [END] ******************************************/
            /************************************* [BEGIN] State-Status Mapping Functions **************************************/
            DataListControl.prototype.dataTablePageEvent = function () {
                var pageInfo = this.dataTableInstance.page.info();
                this.status.startRow = pageInfo.page * this.status.pageSize;
                //If single selection is active clear selected item from previous pages
                if (!this.options.hasMultiSelect && this.status.selectedItems.length === 1) {
                    this.setSelectedItemKeys([]);
                    this.listSelectionChanged();
                }
            };
            DataListControl.prototype.dataTablePageSizeEvent = function () {
                var pagelength = this.dataTableInstance.page.len();
                this.dataTableInstance.page(0);
                this.status.startRow = 0;
                if (pagelength > 0) {
                    this.status.pageSize = pagelength;
                }
                else {
                    this.dataTableInstance.page.len(DataListControl.MAX_ROWS);
                    this.status.pageSize = DataListControl.MAX_ROWS;
                    this.$wrapperElement.find(".dataTables_length select").val(-1);
                }
            };
            DataListControl.prototype.dataTableOrderEvent = function (event) {
                var order = this.dataTableInstance.order();
                var previousOrderStatus = this.status.orderBy;
                this.status.orderBy = []; //Always reset status
                this.$wrapperElement.find(".order-indicator").remove(); //...and remove order indicators
                if (order !== undefined) {
                    var excludedColumns_1 = []; /* This is used to remove a column ordering when the ordering switching skips the NoOrder state
                                                   e.g. a column that goes from OrderDesc to OrderAsc state instead of NoOrder */
                    var _loop_3 = function (i) {
                        var $columnHeader = $(this_3.dataTableInstance.columns(order[i][0]).header()[0]);
                        var orderingColumn = this_3.getColumnInfoForElement($columnHeader);
                        var orderingDirection = order[i][1] === "asc" ? Joove.OrderByDirections.ASC : Joove.OrderByDirections.DESC;
                        var orderColumnInStatus = $.grep(previousOrderStatus, function (o) { return o.column.name == orderingColumn.name; })[0];
                        /* This last check is to add an extra state while switching the ordering
                         * in a column. The states are changed circularly: NoOrder -> OrderAsc -> OrderDesc -> NoOrder
                         * It's required for single column sorting cases */
                        if (orderColumnInStatus != undefined && orderColumnInStatus.direction === Joove.OrderByDirections.DESC && orderingDirection === Joove.OrderByDirections.ASC) {
                            excludedColumns_1.add({ "name": orderColumnInStatus.column.name, "index": order[i][0] });
                        }
                        else {
                            this_3.status.orderBy.add(new Joove.OrderByInfo(orderingColumn, orderingDirection));
                            //Create order indicators if multiple columns are ordered
                            if (order.length > 1) {
                                var $indicator = $("<span></span>");
                                $indicator.addClass("order-indicator");
                                $indicator.text(i + 1);
                                $columnHeader.append($indicator);
                            }
                        }
                    };
                    var this_3 = this;
                    for (var i = 0; i < order.length; i++) {
                        _loop_3(i);
                    }
                    if (excludedColumns_1.length > 0) {
                        this.dataTableInstance.order($.grep(order, function (o) { return !excludedColumns_1.some(function (i) { return i.index == o[0]; }); }));
                    }
                }
                else {
                    this.dataTableInstance.order([]);
                }
            };
            DataListControl.prototype.dataTableColumnReorderEvent = function (details) {
                //If datatables is not initialized return
                if (!this.isInitialized) {
                    return;
                }
                //If we have groups and aggregators redraw the groups in order to
                //reposition the group aggregators under the correct column
                if (this.cache.groups != null && this.cache.aggregators != null) {
                    this.renderGroups();
                }
                this.updateRowNumbers();
            };
            DataListControl.prototype.dataTableColumnVisibilityEvent = function (event, settings, columnIndex, state) {
                var self = this;
                var $columnHeader = $(this.dataTableInstance.column(columnIndex).header());
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
                var $quickfilterButton = this.$wrapperElement.find(".quick-filter-button");
                var quickfiltersVisible = $quickfilterButton.data("visible") != undefined && $quickfilterButton.data("visible") === true;
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
            };
            /*********************** [BEGIN] Search ***********************/
            DataListControl.prototype.addGlobalSearch = function (globalSearchTerm, autoApply) {
                this.removeFiltersFromGlobalSearch();
                if (globalSearchTerm != null && globalSearchTerm.trim() != "") {
                    var guessedSearchTermType = Joove.Common.guessStringMambaDataType(globalSearchTerm);
                    for (var i = 0; i < this.status.columnInfo.length; i++) {
                        var columnInfo = this.status.columnInfo[i];
                        if (columnInfo.searchable === false) {
                            continue;
                        }
                        var columnInfoMambaDataType = Joove.Common.getMambaDataType(columnInfo.mambaDataType);
                        //send undefined for back-end handling. Propably enumerators
                        if (columnInfoMambaDataType !== undefined) {
                            //Skip non compatible columns.
                            switch (guessedSearchTermType) {
                                case Joove.MambaDataType.BOOL:
                                    if (!(columnInfoMambaDataType === Joove.MambaDataType.BOOL ||
                                        columnInfoMambaDataType === Joove.MambaDataType.STRING))
                                        continue;
                                    break;
                                case Joove.MambaDataType.NUMBER:
                                    if (!(columnInfoMambaDataType === Joove.MambaDataType.NUMBER ||
                                        columnInfoMambaDataType === Joove.MambaDataType.STRING))
                                        continue;
                                    break;
                                case Joove.MambaDataType.DATETIME:
                                    if (!(columnInfoMambaDataType === Joove.MambaDataType.DATETIME ||
                                        columnInfoMambaDataType === Joove.MambaDataType.STRING))
                                        continue;
                                    break;
                                case Joove.MambaDataType.STRING:
                                    if (columnInfoMambaDataType !== Joove.MambaDataType.STRING)
                                        continue;
                                    break;
                            }
                        }
                        var operator = this.getFilterOperatorBasedOnColumnDataType(columnInfo);
                        var filter = new Widgets.DataListFilterInfo(columnInfo, globalSearchTerm, Joove.RowOperators.OR, operator, undefined, Widgets.DataListFilterType.Global);
                        this.status.filters.push(filter);
                    }
                }
                if (autoApply === true) {
                    this.dataTableInstance.ajax.reload();
                }
            };
            DataListControl.prototype.getFilterOperatorBasedOnColumnDataType = function (col) {
                var colDataType = Joove.Common.getMambaDataType(col.mambaDataType);
                var useLikeOperator = colDataType === Joove.MambaDataType.STRING || colDataType === Joove.MambaDataType.DATETIME || colDataType === undefined;
                return useLikeOperator
                    ? Joove.FilterOperators.LIKE
                    : Joove.FilterOperators.EQUAL_TO;
            };
            DataListControl.prototype.removeFiltersFromGlobalSearch = function () {
                // reverse loop when removing, for keeping indexes valid!
                for (var i = this.status.filters.length - 1; i > -1; i--) {
                    var current = this.status.filters[i];
                    if (current.type != Widgets.DataListFilterType.Global)
                        continue;
                    this.status.filters.splice(i, 1);
                }
            };
            DataListControl.prototype.addQuickFilter = function (columnInfo, quickFilterSearchTerm) {
                this.removeQuickFilterFromColumn(columnInfo);
                if (quickFilterSearchTerm == null ||
                    (quickFilterSearchTerm.trim && quickFilterSearchTerm.trim() === ""))
                    return;
                var operator = this.getFilterOperatorBasedOnColumnDataType(columnInfo);
                var filter = new Widgets.DataListFilterInfo(columnInfo, quickFilterSearchTerm, Joove.RowOperators.AND, operator, undefined, Widgets.DataListFilterType.Quick);
                this.status.filters.push(filter);
            };
            DataListControl.prototype.removeQuickFilterFromColumn = function (col) {
                // reverse loop when removing, for keeping indexes valid!
                for (var i = this.status.filters.length - 1; i > -1; i--) {
                    var current = this.status.filters[i];
                    if (current.type != Widgets.DataListFilterType.Quick || current.column.name != col.name)
                        continue;
                    this.status.filters.splice(i, 1);
                }
            };
            DataListControl.prototype.addCustomFilter = function (term, columnName, controlId, filterOp, rowOp, overwriteExisting, autoApply) {
                var columnInfo = this.getColumnInfoByName(columnName);
                if (overwriteExisting === true) {
                    this.removeCustomFilterFromColumn(columnInfo);
                }
                if (term != null && (term.trim == null || (term.trim() != "" && term.trim() != "?"))) {
                    var operator = Joove.FilterOperators[filterOp];
                    var rowOperator = Joove.RowOperators[rowOp];
                    var filter = new Widgets.DataListFilterInfo(columnInfo, term.toString(), rowOperator, operator, undefined, Widgets.DataListFilterType.Custom, controlId);
                    this.status.filters.push(filter);
                }
                else {
                    this.removeCustomFilterByControlId(controlId);
                }
                if (autoApply === true) {
                    this.dataTableInstance.ajax.reload();
                }
            };
            DataListControl.prototype.removeCustomFilterByControlId = function (id) {
                // reverse loop when removing, for keeping indexes valid!
                for (var i = this.status.filters.length - 1; i > -1; i--) {
                    var current = this.status.filters[i];
                    if (current.controlId != id)
                        continue;
                    this.status.filters.splice(i, 1);
                }
            };
            DataListControl.prototype.removeCustomFilterFromColumn = function (col) {
                // reverse loop when removing, for keeping indexes valid!
                for (var i = this.status.filters.length - 1; i > -1; i--) {
                    var current = this.status.filters[i];
                    if (current.type != Widgets.DataListFilterType.Custom || current.column.name != col.name)
                        continue;
                    this.status.filters.splice(i, 1);
                }
            };
            DataListControl.prototype.removeAllCustomFilters = function () {
                // reverse loop when removing, for keeping indexes valid!
                for (var i = this.status.filters.length - 1; i > -1; i--) {
                    var current = this.status.filters[i];
                    if (current.type != Widgets.DataListFilterType.Custom)
                        continue;
                    this.status.filters.splice(i, 1);
                }
                $("[joove-ds-filter='true'][joove-ds-filter-for='" + this.dataSetName + "']").val("");
            };
            DataListControl.prototype.getColumnInfoByName = function (name) {
                for (var i = 0; i < this.status.columnInfo.length; i++) {
                    var current = this.status.columnInfo[i];
                    if (current.name == name)
                        return current;
                }
            };
            DataListControl.prototype.clearAllSearchFields = function () {
                this.$wrapperElement.find(".search-input").val("").change();
                this.$wrapperElement.find(".search-select").val(null);
                this.dataTableInstance.search("");
                for (var i = 0; i < this.dataTableInstance.columns().count(); i++) {
                    var currentSearchTerm = this.dataTableInstance.columns(i).search()[0];
                    if (currentSearchTerm.length > 0) {
                        this.dataTableInstance.columns().search("");
                    }
                }
            };
            DataListControl.prototype.dataTableSearchEvent = function () {
                // Quick filters
                for (var i = 0; i < this.status.columnInfo.length; i++) {
                    var columnIndex = this.options.showRowNumbers ? i + 1 : i;
                    var quickFilterSearchTerm = this.dataTableInstance.columns(columnIndex).search()[0].trim();
                    var $columnHeader = $(this.dataTableInstance.columns(columnIndex).header()[0]);
                    var columnInfo = this.getColumnInfoForElement($columnHeader);
                    if (quickFilterSearchTerm.length === 0) {
                        this.removeQuickFilterFromColumn(columnInfo);
                    }
                    else {
                        this.addQuickFilter(columnInfo, quickFilterSearchTerm);
                    }
                }
                // Global Search
                var globalSearchTerm = this.dataTableInstance.search().trim();
                if (globalSearchTerm.length > 0) {
                    this.addGlobalSearch(globalSearchTerm, false);
                }
                else {
                    this.removeFiltersFromGlobalSearch();
                }
            };
            /*********************** Search [END] ***********************/
            DataListControl.prototype.dataTableSelectEvent = function (event, datatable, type, indexes) {
                //NOTE: This event only handles selections that are triggered by the datatables select event
                //      Other cases such as select all recordset and programmatically selecting values are handled
                //      in seperate functions.
                if (type === "row") {
                    var _loop_4 = function (i) {
                        var rowData = datatable.rows().data()[indexes[i]];
                        if (event.type === "select") {
                            //If the is item isn't already included add it to status
                            if (!this_4.status.selectedItems.some(function (item) { return item._key === rowData._key; })) {
                                this_4.status.selectedItems.push(rowData);
                            }
                        }
                        else if (event.type === "deselect") {
                            var indexOnSelectedItems = this_4.status.selectedItems.indexOf(this_4.status.selectedItems.filter(function (item) { return item._key === rowData._key; })[0]);
                            if (indexOnSelectedItems > -1) {
                                this_4.status.selectedItems.splice(indexOnSelectedItems, 1);
                            }
                        }
                    };
                    var this_4 = this;
                    for (var i = 0; i < indexes.length; i++) {
                        _loop_4(i);
                    }
                }
            };
            /************************************* State-Status Mapping Functions [END] **************************************/
            /***************************************** [BEGIN] Custom functionalities ******************************************/
            DataListControl.prototype.initializeDatepickerPlugIn = function () {
                if (window.momentJsInitialized || window.moment == null || $.datetimepicker == null)
                    return;
                // Configure Timepicker to use moment.js (only once)
                Date["parseDate"] = function (input, format) { return moment(input, format).toDate(); };
                Date.prototype.dateFormat = function (format) {
                    return moment(this).format(format);
                };
                window.momentJsInitialized = true;
                // Apply Locales
                $.datetimepicker.setLocale(window._context.locale);
            };
            DataListControl.prototype.drawCallback = function () {
                var self = this;
                //Draw callback should be executed only after initialization
                if (!this.isInitialized)
                    return;
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
                    new Joove.LazyImageLoader($(this), false);
                });
                this.fixPager();
            };
            // This dirty function is used to "fix" pager and records info
            // when a view is loaded from local storage. DataTables lib resets to first page
            // and we have to simulate a call (updateFromCache flag prevents actuall call)
            // in order to sync them. Of course this needs testing, since it may cause issues.
            DataListControl.prototype.fixPager = function () {
                if (this.options.hasPaging != true)
                    return;
                var controlPagingInfo = this.dataTableInstance.page.info();
                var pageFromStatus = Math.floor(this.status.startRow / this.status.pageSize);
                var pageFromControl = controlPagingInfo.page;
                if (pageFromStatus == pageFromControl || pageFromStatus < 0 || pageFromStatus + 1 > controlPagingInfo.pages)
                    return;
                this.updateFromCache = true;
                this.dataTableInstance.page(pageFromStatus);
                this.dataTableInstance.ajax.reload(null, false);
                this.updateFromCache = false;
            };
            DataListControl.prototype.updateDataTableSize = function () {
                var controlStandardHeight = this.$wrapperElement.height() - this.$element.parent().height();
                if (this.options.isPickList) {
                    var modalPopUpHeight = this.$wrapperElement.closest("." + DataListControl.PICKLIST_POPUP_MODAL_CLASS).height();
                    this.$element.parent().height(modalPopUpHeight - controlStandardHeight);
                }
                else if (this.options.isStandAlone) {
                    var themeSettingForHeight = window._themeManager.getControlVariableByElement("@StaticElementsHeight", this.$element);
                    var outerElementsHeight = themeSettingForHeight == null
                        ? null
                        : parseInt(themeSettingForHeight.value);
                    if (outerElementsHeight == null || isNaN(outerElementsHeight)) {
                        var $dummyElement = $("<div class='" + DataListControl.STANDALONE_OUTER_ELEMENTS_DUMMY_CLASS + "' ></div>");
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
                    var $colGroup = $("<colgroup></colgroup>");
                    for (var i = 0; i < this.dataTableInstance.columns().count(); i++) {
                        var header = this.dataTableInstance.column(i).header();
                        var widthRegexp = /[\s;]*width\s*:\s*([0-9]+.?([0-9]+)?px);?.*/;
                        var match = widthRegexp.exec($(header).attr("style"));
                        if (match != null) {
                            $colGroup.append($("<col style='width: " + match[1] + "'></col>"));
                        }
                        else {
                            $colGroup.append($("<col></col>"));
                        }
                    }
                    this.$element.children("colgroup").remove();
                    this.$element.append($colGroup);
                }
            };
            DataListControl.prototype.updateRowNumbers = function () {
                var _this = this;
                if (this.options.showRowNumbers) {
                    this.dataTableInstance.column(0).nodes().each(function (cell, i) {
                        cell.innerHTML = _this.status.startRow + i + 1;
                    });
                    //Re-adjust table width to avoid differences between header and body content width
                    this.dataTableInstance.columns.adjust();
                }
            };
            /*********************** [BEGIN] Global search configuration ***********************/
            DataListControl.prototype.configureGlobalSearch = function () {
                //Get the search element
                var $globalSearchInputWrapper = this.$wrapperElement.find(".filter .dataTables_filter");
                var $globalSearchInput = $globalSearchInputWrapper.find("input");
                $globalSearchInput.attr("placeholder", this.resources.textResources.Search);
                //The following classes are needed in order to attach the search element event handlers
                $globalSearchInput.addClass("search-input");
                $globalSearchInputWrapper.addClass("global-search");
                //Remove the automatic search request on each keypress
                $globalSearchInput.off();
                //Convert input to search element
                var $searchElement = this.convertInputToSearchElement($globalSearchInput);
                this.attachSearchElementEventHandlers($searchElement);
                //...and append it to the inputs original place
                $globalSearchInputWrapper.append($searchElement);
            };
            /*********************** Global Search configuration [END] ***********************/
            /*********************** [BEGIN] Quick-filters configuration ***********************/
            DataListControl.prototype.configureQuickFilters = function () {
                var _this = this;
                var $quickfilterButton = $("<button class='btn btn-default quick-filter-button'> \
                                                <span class='bootstrap-tooltip' data-toggle='tooltip' data-placement='top' title='" + this.resources.textResources.QuickFilters + "' > \
                                                    <span class='" + Widgets.DataListControlResources.icons.filter.bs + "' ></span> \
                                                </span> \
                                          </button>");
                var $globalSearchActions = this.$wrapperElement.find(".global-search .search-actions");
                $globalSearchActions.append($quickfilterButton);
                var self = this;
                /*
                 *      IMPORTANT: Some event handlers are intentionally not a lamba expressions in order to keep the scope
                 *                 refering to indentifier 'this' as a HTML element and not as the DataListControl class
                 */
                //Toggle quick-filters
                if (this.$wrapperElement.find(".quick-filter").length > 0) {
                    $quickfilterButton.on("click", function (event) {
                        var visible = $quickfilterButton.data("visible") != undefined && $quickfilterButton.data("visible") === true; //Check the quickfilter visibility state
                        _this.$wrapperElement.find(".quick-filter").toggle();
                        $quickfilterButton.data("visible", !visible); //Update the quickfilter visibility state
                        _this.updateDataTableSize();
                    });
                }
                else {
                    $quickfilterButton.hide();
                }
                //Attach event handlers to quick-filter elements
                this.$wrapperElement.find(".quick-filter .search-element").each(function () {
                    self.attachSearchElementEventHandlers($(this));
                });
                //If there are quickfilters loaded from the saved state of the list
                //show the quickfilters in the list header
                var enabledQuickFilters = this.status.filters.filter(function (f) { return f.type == Widgets.DataListFilterType.Quick; });
                if (enabledQuickFilters.length > 0) {
                    $quickfilterButton.click();
                }
                //Disable header sort functionality when accessing quick-filter elements
                this.$wrapperElement.find(".quick-filter").each(function () {
                    if (enabledQuickFilters.length > 0) {
                        //If quickfilter values are set, check whether they relate to the current element
                        var columnInfo_1 = self.getColumnInfoForElement($(this).parent());
                        var currentQuickfilterValue = enabledQuickFilters.filter(function (f) { return f.column.name == (columnInfo_1 != undefined ? columnInfo_1.name : ""); });
                        if (currentQuickfilterValue.length === 1) {
                            //...if so set the value and trigger the change event
                            var $searchInput = $(this).find(".search-input");
                            $searchInput.val(currentQuickfilterValue[0].value);
                            $searchInput.change();
                        }
                    }
                    $(this).on("click", function (event) {
                        event.stopPropagation();
                    });
                });
                //Initialize any datepicker element on quick-filters
                this.$wrapperElement.find(".quick-filter .datetime-picker ").each(function () {
                    self.intializeDateTimePicker($(this));
                });
            };
            /*********************** Quick-filters configuration [END] ***********************/
            /*********************** [BEGIN] Custom button functionalities ***********************/
            DataListControl.prototype.configureCustomFunctionalityButtons = function () {
                var _this = this;
                var $buttonsGroup = this.$wrapperElement.find(".settings .buttons .dt-buttons");
                // Composite Filters
                if (this.options.structuredFiltering === true) {
                    var res = this.resources.textResources.FiltersPopUpTitle;
                    var $filtersButton = $("<a class='btn btn-default composite-filters' > \
                                                <span class='bootstrap-tooltip' data-toggle='tooltip' data-placement='top' title='" + res + "'> \
                                                    <span class='glyphicon glyphicon-zoom-in'></span> \
                                            </span> \
                                         </a>");
                    $filtersButton.on("click", function (event) {
                        _this.compositeFiltersHelper.show();
                    });
                    $buttonsGroup.append($filtersButton);
                }
                // Refresh Button
                if (this.options.showRefreshButton) {
                    var $refreshButton = $("<a class='btn btn-default refresh' data-toggle='modal' > \
                                                <span class='bootstrap-tooltip' data-toggle='tooltip' data-placement='top' title='" + this.resources.textResources.Refresh + "'> \
                                                    <span class='glyphicon glyphicon-refresh'></span> \
                                            </span> \
                                         </a>");
                    $refreshButton.on("click", function (event) {
                        _this.dataTableInstance.draw(false);
                    });
                    $buttonsGroup.append($refreshButton);
                }
                // Reset Button
                var $resetButton = $("<a class='btn btn-default reset' > \
                                                <span class='bootstrap-tooltip' data-toggle='tooltip' data-placement='top' title='" + this.resources.textResources.Reset + "'> \
                                                    <span class='glyphicon glyphicon-repeat'></span> \
                                            </span> \
                                         </a>");
                $resetButton.on("click", function (event) {
                    _this.reset();
                });
                $buttonsGroup.append($resetButton);
                //Grouping
                if (this.options.isGroupable && this.status.columnInfo.some(function (column) { return column.groupable; })) {
                    var $groupingButton = $("<a class='btn btn-default bootstrap-modal grouping' data-toggle='modal' data-target='#" + this.clientsideElementId + "_grouping' > \
                                                <span class='bootstrap-tooltip' data-toggle='tooltip' data-placement='top' title='" + this.resources.textResources.Grouping + "'> \
                                                    <span class='glyphicon glyphicon-th'></span> \
                                            </span> \
                                       </a>");
                    var $groupingModalDialog = this.getModalDialogElement("grouping", this.resources.textResources.Grouping, true);
                    var $groupingDialogContent = this.getGroupDialogContent();
                    $groupingModalDialog.addClass("datalist-grouping");
                    this.initializeGroupingOptions($groupingDialogContent); //Set values
                    $groupingModalDialog.find(".modal-footer .btn-ok").on("click", function () { _this.applyGrouping(); });
                    $groupingModalDialog.find(".modal-body").append($groupingDialogContent); //Attach content to dialog
                    this.$wrapperElement.append($groupingModalDialog);
                    $buttonsGroup.append($groupingButton);
                }
                //Export
                if (this.options.isExportable) {
                    var $exportButton = $("<a class='btn btn-default bootstrap-modal export' data-toggle='modal' data-target='#" + this.clientsideElementId + "_export'> \
                                                <span class='bootstrap-tooltip' data-toggle='tooltip' data-placement='top' title='" + this.resources.textResources.Export + "'> \
                                                    <span class='glyphicon glyphicon-download'></span> \
                                            </span> \
                                       </a>");
                    var $exportModalDialog_1 = this.getModalDialogElement("export", this.resources.textResources.Export, true);
                    $exportButton.on("click", function () {
                        var $content = _this.exportHelper.getPopUpContent();
                        $exportModalDialog_1.find(".modal-body").empty().append($content);
                    });
                    $exportModalDialog_1.find(".btn-ok").on("click", function () { _this.exportHelper.okCallback($exportModalDialog_1); });
                    this.$wrapperElement.append($exportModalDialog_1);
                    $buttonsGroup.append($exportButton);
                }
                // Views
                var loggedIn = window._context.currentUsername != null && window._context.currentUsername != "";
                if (this.options.saveViews === true && loggedIn === true) {
                    var $viewsButton = $("<a class='btn btn-default bootstrap-modal views' data-toggle='modal' data-target='#" + this.clientsideElementId + "_views'> \
                                                <span class='bootstrap-tooltip' data-toggle='tooltip' data-placement='top' title='" + this.resources.textResources.Views + "'> \
                                                    <span class='glyphicon glyphicon-floppy-disk'></span> \
                                            </span> \
                                       </a>");
                    var $viewsModalDialog_1 = this.getModalDialogElement("views", this.resources.textResources.Views, false);
                    $viewsButton.on("click", function () {
                        var $content = _this.viewsHelper.getPopUpContent();
                        $viewsModalDialog_1.find(".modal-body").empty().append($content);
                    });
                    this.$wrapperElement.append($viewsModalDialog_1);
                    $buttonsGroup.append($viewsButton);
                }
                // Import
                if (this.options.importData === true) {
                    var importResource = this.resources.textResources.Import;
                    var $importButton = $("<a class='btn btn-default bootstrap-modal import' data-toggle='modal' data-target='#" + this.clientsideElementId + "_import'> \
                                                <span class='bootstrap-tooltip' data-toggle='tooltip' data-placement='top' title='" + importResource + "'> \
                                                    <span class='glyphicon glyphicon-upload'></span> \
                                            </span> \
                                       </a>");
                    var $importModalDialog_1 = this.getModalDialogElement("import", importResource, true);
                    this.$wrapperElement.append($importModalDialog_1);
                    $importButton.on("click", function () {
                        var $content = _this.importHelper.getPopUpContent();
                        $importModalDialog_1.find(".modal-body").empty().append($content);
                        _this.importHelper.resetResults($content);
                    });
                    $buttonsGroup.append($importButton);
                }
                if (this.options.useCustomModal) {
                    this.intializeCustomModalListeners();
                }
            };
            /*********************** [BEGIN] Grouping ***********************/
            DataListControl.prototype.getGroupDialogContent = function () {
                var $content = $("<div class='row'>\n    <div class='col-xs-6 group-left'>\n        <label>" + this.resources.textResources.Column + "</label>\n        <div class='column-group'>\n            <select class='available-columns' multiple='multiple'></select>\n            <div class=\"btn-group btn-group-sm\">\n                <button type='button' jb-type=\"Button\" class='jb-control jb-simple-btn btn btn-default add-group' ui-role-color=\"default\">\n                    <span class='glyphicon glyphicon-arrow-right'></span>\n                </button>\n                <button type='button' jb-type=\"Button\" class='jb-control jb-simple-btn btn btn-default remove-group' ui-role-color=\"default\">\n                    <span class='glyphicon glyphicon-arrow-left'></span>\n                </button>\n            </div>\n        </div>\n        <div jb-type=\"HtmlContainer\" class=\"pretty p-smooth p-default jb-control\" ui-role-color=\"default\">\n            <input type='checkbox' class='get-groups-closed'/>\n            <div class=\"state\">\n                <label>" + this.resources.textResources.GetGroupsClosed + "</label>\n            </div>\n        </div>\n    </div>\n    <div class='col-xs-6 group-right'>\n        <label>" + this.resources.textResources.GroupingOrder + "</label>\n        <div  class='column-group'>\n            <select class='grouping-columns' multiple='multiple'></select>\n            <div class='btn-group btn-group-sm'>\n                <button jb-type=\"Button\" class='jb-control jb-simple-btn btn btn-default move-up' ui-role-color=\"default\">\n                    <span class='glyphicon glyphicon-arrow-up'></span>\n                </button>\n                <button jb-type=\"Button\" class='jb-control jb-simple-btn btn btn-default move-down' ui-role-color=\"default\">\n                    <span class='glyphicon glyphicon-arrow-down'></span>\n                </button>\n            </div>\n        </div>\n        <div jb-type=\"HtmlContainer\" class=\"pretty p-smooth p-default jb-control\" ui-role-color=\"default\">\n            <input type='checkbox' class='merge-group-levels'/>\n            <div class=\"state\">\n                <label>" + this.resources.textResources.MergedGroupLevels + "</label>\n            </div>\n        </div>\n    </div>\n</div>\n");
                var $availableColumns = $content.find(".available-columns");
                var $groupingColumns = $content.find(".grouping-columns");
                /************************************ [BEGIN] Grouping dialog events ************************************/
                $content.find(".add-group").on("click", function () {
                    var $selectedColumns = $availableColumns.find(":selected");
                    for (var i = 0; i < $selectedColumns.length; i++) {
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
                $content.find(".remove-group").on("click", function () {
                    var $selectedColumns = $groupingColumns.find(":selected");
                    for (var i = $selectedColumns.length - 1; i >= 0; i--) {
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
                $content.find(".move-up").on("click", function () {
                    var $selected = $groupingColumns.find(":selected");
                    $selected.eq(0).prev().before($selected);
                });
                $content.find(".move-down").on("click", function () {
                    var $selected = $groupingColumns.find(":selected");
                    $selected.eq($selected.length - 1).next().after($selected);
                });
                $availableColumns.on("dblclick", function () {
                    $content.find(".add-group").click();
                });
                $groupingColumns.on("dblclick", function () {
                    $content.find(".remove-group").click();
                });
                /************************************ Grouping dialog events [END] ************************************/
                return $content;
            };
            DataListControl.prototype.initializeGroupingOptions = function ($content) {
                var $availableColumns = $content.find(".available-columns");
                for (var i = 0; i < this.status.columnInfo.length; i++) {
                    if (!this.status.columnInfo[i].groupable)
                        continue;
                    var $option = $("<option value='" + this.status.columnInfo[i].name + "'>" + this.status.columnInfo[i].caption + "</option>");
                    $availableColumns.append($option);
                }
            };
            DataListControl.prototype.updateGroupingDialogState = function () {
                //Get the grouping dialog content
                var $groupingContent = this.$wrapperElement.find("#" + this.clientsideElementId + "_grouping");
                //Select all options and reset the active selections
                $groupingContent.find("option").prop("selected", true);
                $groupingContent.find("button.remove-group").click();
                $groupingContent.find("option").prop("selected", false);
                for (var i = 0; i < this.status.groupBy.length; i++) {
                    $groupingContent.find("option[value='" + this.status.groupBy[i].column.name + "']").prop("selected", true);
                }
                $groupingContent.find("button.add-group").click();
                $groupingContent.find("input.get-groups-closed").prop("checked", this.status.getGroupsClosed);
                $groupingContent.find("input.merge-group-levels").prop("checked", this.status.mergeGroupLevels);
            };
            DataListControl.prototype.applyGrouping = function () {
                var $groupingColumns = this.$wrapperElement.find(".datalist-grouping .grouping-columns").children();
                var getGroupsClosed = this.$wrapperElement.find(".datalist-grouping .get-groups-closed").is(":checked");
                if (getGroupsClosed && this.options.hasPaging) {
                    this.$wrapperElement.find(".dataTables_length select").prop("disabled", true);
                    this.dataTableInstance.page.len(DataListControl.MAX_ROWS);
                    this.status.pageSize = DataListControl.MAX_ROWS;
                    this.$wrapperElement.find(".dataTables_length select").val(-1);
                }
                else {
                    this.$wrapperElement.find(".dataTables_length select").prop("disabled", false);
                    this.status.pageSize = this.options.pageSizes[0];
                    this.dataTableInstance.page.len(this.status.pageSize);
                    this.$wrapperElement.find(".dataTables_length select").val(this.status.pageSize);
                }
                var mergeGroupLevels = this.$wrapperElement.find(".datalist-grouping .merge-group-levels").is(":checked");
                var groupBy = [];
                var _loop_5 = function (i) {
                    var state = /*options.getGroupsClosed === true && i === groupsArray.length - 1 ? "COLLAPSED" :*/ "EXPANDED";
                    var columnInfo = $.grep(this_5.status.columnInfo, function (c) { return c.name === $groupingColumns.eq(i).val(); });
                    if (columnInfo.length !== 1) {
                        this_5.handleError("DATALIST ERROR: Column info was not found for column " + $groupingColumns.eq(i).val());
                        return "continue";
                    }
                    groupBy.push(new Widgets.DataListGroupByInfo(columnInfo[0], state, getGroupsClosed));
                };
                var this_5 = this;
                for (var i = 0; i < $groupingColumns.length; i++) {
                    _loop_5(i);
                }
                this.status.groupBy = groupBy;
                this.status.getGroupsClosed = getGroupsClosed;
                this.status.mergeGroupLevels = mergeGroupLevels;
                this.status.startRow = 0; //Reset paging
                this.dataTableInstance.draw();
                //If aggregators are enabled then request them again
                if (this.cache.aggregators != null) {
                    this.makeAggregatorRequest();
                }
                this.dataTableInstance.state.save();
            };
            DataListControl.prototype.renderGroups = function () {
                var _this = this;
                var renderGroupsInfo = [];
                var aggregatorDictionary = [];
                /*   NOTE: This recursive function traverses the group tree and flattens its structure
                 *         in order to inject the grouping rows into the already rendered data rows effectively
                 */
                var parseGroupsData = function (groupInfo, aggregatorInfo, currentPath) {
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
                    if ((!_this.status.getGroupsClosed && groupInfo.UniqueItemKeys != null)
                        || _this.status.getGroupsClosed && groupInfo.SubGroups.length === 0) {
                        aggregatorDictionary[currentPath] = aggregatorInfo != null && aggregatorInfo != undefined ? aggregatorInfo.Aggregates : null;
                        var aggregatorDictionaryKeys = Object.keys(aggregatorDictionary);
                        var currentAggregators = [];
                        for (var k = 0; k < aggregatorDictionaryKeys.length; k++) {
                            currentAggregators[aggregatorDictionaryKeys[k]] = aggregatorDictionary[aggregatorDictionaryKeys[k]];
                        }
                        renderGroupsInfo.push({
                            "relatedKeys": groupInfo.UniqueItemKeys,
                            "groupPath": currentPath,
                            "groupAggregators": currentAggregators
                        });
                        aggregatorDictionary = [];
                    }
                    else {
                        aggregatorDictionary[currentPath] = aggregatorInfo != null && aggregatorInfo != undefined ? aggregatorInfo.Aggregates : null;
                        var _loop_7 = function (i) {
                            var subGroupAggregatorInfo = aggregatorInfo != null && Joove.Common.isArray(aggregatorInfo.SubGroups)
                                ? aggregatorInfo.SubGroups.filter(function (a) { return a.Key == groupInfo.SubGroups[i].Key; })
                                : null;
                            subGroupAggregatorInfo = subGroupAggregatorInfo != null && subGroupAggregatorInfo.length == 1 ? subGroupAggregatorInfo[0] : null;
                            parseGroupsData(groupInfo.SubGroups[i], subGroupAggregatorInfo, currentPath);
                        };
                        //...else traverse the subgroups recursively
                        for (var i = 0; i < groupInfo.SubGroups.length; i++) {
                            _loop_7(i);
                        }
                    }
                };
                var groupAggregators = this.cache.aggregators != null && this.cache.aggregators.Groups != undefined
                    ? this.cache.aggregators.Groups
                    : null;
                parseGroupsData(this.cache.groups, groupAggregators, "");
                var $selectedRows;
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
                    var renderGroupsInfoCopy = JSON.parse(JSON.stringify(renderGroupsInfo));
                    for (var i = 0; i < renderGroupsInfo.length; i++) {
                        //Remove all aggregators per group
                        renderGroupsInfoCopy[i].groupAggregators = [];
                        //...and get only the innermost path to be set after the new group path is calculated
                        var innermostGroupAggregators = renderGroupsInfo[i].groupAggregators[renderGroupsInfo[i].groupPath];
                        //Split the total groups levels and iterate
                        var totalGroupLevels = renderGroupsInfoCopy[i].groupPath.split(DataListControl.GROUP_PATH_SEPARATOR).filter(function (grp) { return grp !== ""; });
                        var flattenGroupValues = [];
                        //For each level get the key/value pairs
                        for (var j = 0; j < totalGroupLevels.length; j++) {
                            var groupInfo = totalGroupLevels[j].split(DataListControl.GROUP_VALUE_SEPARATOR);
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
                var _loop_6 = function (j) {
                    var groupsInfo = renderGroupsInfo[j].groupPath.split(DataListControl.GROUP_PATH_SEPARATOR).filter(function (grp) { return grp !== ""; });
                    if (!this_6.status.getGroupsClosed) {
                        var rowIdSelector = renderGroupsInfo[j].relatedKeys.map(function (t) { return "#" + t; });
                        $selectedRows = $(this_6.dataTableInstance.rows(rowIdSelector).nodes());
                        $selectedRows.each(function () {
                            $(this).attr("data-group-path", renderGroupsInfo[j].groupPath);
                            $(this).attr("data-group-level", groupsInfo.length);
                        });
                    }
                    //This array will be used for proper group row injection after the current group parsing
                    var groupsToCreate = [];
                    var _loop_8 = function (k) {
                        var groupInfo = groupsInfo[k].split(DataListControl.GROUP_VALUE_SEPARATOR);
                        if (groupInfo.length !== 2) {
                            this_6.handleError("DATALIST ERROR: Invalid group parsing. Group value separator failed with " + groupsInfo[k]);
                            return "continue";
                        }
                        var groupPath = groupsInfo.slice(0, k + 1).join(DataListControl.GROUP_PATH_SEPARATOR);
                        var column = $.grep(this_6.status.columnInfo, function (col) { return col.name === groupInfo[0]; });
                        var columnName = column.length === 1 ? column[0].caption : groupInfo[0];
                        var groupKey = column.length === 1 ? this_6.cellRender(groupInfo[1], "groupKey", null, column[0]) : groupInfo[1];
                        var groupState = this_6.status.getGroupsClosed && k + 1 == groupsInfo.length ? "CLOSED" : "EXPANDED";
                        var groupIcon = groupState == "CLOSED" ? "" : "glyphicon-collapse-up";
                        var $groupRow = $("<tr class='group-row'> \
                                            <td colspan='" + (this_6.status.columnInfo.length + (this_6.options.showRowNumbers ? 1 : 0)) + "'> \
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
                        var $groupAggregatorsRow = null;
                        if (renderGroupsInfo[j].groupAggregators[groupPath] != null) {
                            $groupAggregatorsRow = $("<tr class='group-aggregators-row'></tr>");
                            $groupAggregatorsRow.append(this_6.options.showRowNumbers ? "<td></td>" : "");
                            var datatablesHeader = this_6.dataTableInstance.columns().header();
                            var _loop_9 = function (l) {
                                var columnInfo = this_6.getColumnInfoForElement($(datatablesHeader[l]));
                                if (columnInfo == undefined) {
                                    this_6.handleError("DATALIST ERROR: ColumnInfo not found for column with index " + l);
                                    $groupAggregatorsRow.append("<td></td>");
                                    return "continue";
                                }
                                var $aggregatorsWrapper = $("<ul></ul>");
                                var _loop_10 = function (m) {
                                    var aggregators = renderGroupsInfo[j].groupAggregators[groupPath];
                                    if (aggregators == undefined) {
                                        return "continue";
                                    }
                                    var aggregatorValue = $.grep(aggregators, function (item) {
                                        //The aggregator type is intentionally not strict because the Newtonsoft serializer
                                        //handles the enum JSON value as string. Also the sanitization of the column name breaks the CamelCase format thus we compare in lowercase
                                        return item.Type == _this.aggregatorsInfo[m].type && item.Column.toLowerCase() === _this.sanitizeColumnName(columnInfo.name).toLowerCase();
                                    });
                                    if (aggregatorValue.length !== 1) {
                                        return "continue";
                                    }
                                    var $aggregatorElement = $("<li> \
                                                                <span class='aggregator-caption'>" + this_6.aggregatorsInfo[m].totalText + "</span> \
                                                                <span span class='aggregator-value'>" + aggregatorValue[0].ValueFormatted + "</span> \
                                                              </li>");
                                    $aggregatorsWrapper.append($aggregatorElement);
                                };
                                for (var m = 0; m < this_6.aggregatorsInfo.length; m++) {
                                    _loop_10(m);
                                }
                                var $aggregatorCell = $("<td data-group-aggregator-column='" + columnInfo.name + "'></td>");
                                //Set the cell visibility according to the column visibility
                                if (!this_6.dataTableInstance.column(l).visible()) {
                                    $aggregatorCell.hide();
                                }
                                $aggregatorCell.append($aggregatorsWrapper);
                                $groupAggregatorsRow.append($aggregatorCell);
                            };
                            for (var l = this_6.options.showRowNumbers ? 1 : 0; l < datatablesHeader.length; l++) {
                                _loop_9(l);
                            }
                            //Set these attributes for proper exand/collapse (see the click event in .group-toggle class)
                            $groupAggregatorsRow.attr("data-group-level", k);
                            $groupAggregatorsRow.attr("data-group-path", groupPath);
                        }
                        //Add the created group the the array
                        groupsToCreate.push({ path: groupPath, groupRow: $groupRow, aggregatorRow: $groupAggregatorsRow });
                    };
                    for (var k = 0; k < groupsInfo.length; k++) {
                        _loop_8(k);
                    }
                    //Inject the inner group before its first item
                    var innerGroup = groupsToCreate[groupsToCreate.length - 1];
                    $selectedRows.eq(0).before(innerGroup.groupRow);
                    if (innerGroup.aggregatorRow != null) {
                        innerGroup.groupRow.after(innerGroup.aggregatorRow);
                    }
                    //Now inject each outer group to the current inner group only if it's not present in the table
                    for (var i = groupsToCreate.length - 2; i >= 0; i--) {
                        if (this_6.$element.find("tbody tr.group-row[data-group-path='" + groupsToCreate[i].path + "']").length == 0) {
                            groupsToCreate[i + 1].groupRow.before(groupsToCreate[i].groupRow);
                            if (groupsToCreate[i].aggregatorRow != null) {
                                groupsToCreate[i].groupRow.after(groupsToCreate[i].aggregatorRow);
                            }
                        }
                    }
                };
                var this_6 = this;
                //Iterate the groups info
                for (var j = 0; j < renderGroupsInfo.length; j++) {
                    _loop_6(j);
                }
                if (this.status.getGroupsClosed) {
                    //The removed row is the "No results found row"
                    $selectedRows.remove();
                }
            };
            DataListControl.prototype.configureGrouping = function () {
                //Toggles open and closed 
                this.$wrapperElement.on("click", "tr.group-row .group-toggle", function (event) {
                    var $currentRow = $(this).closest("tr.group-row");
                    var currentLevel = $currentRow.data("group-level");
                    var currentPath = $currentRow.data("group-path");
                    var $targetNodes = $currentRow.siblings("[data-group-path~='" + currentPath + "']").filter(function () {
                        return parseInt($(this).attr("data-group-level")) > currentLevel;
                    });
                    if ($currentRow.data("group-state") === "EXPANDED") {
                        $targetNodes.hide();
                        $currentRow.data("group-state", "COLLAPSED");
                        $(this).removeClass("glyphicon-collapse-up");
                        $(this).addClass("glyphicon-expand");
                    }
                    else {
                        $targetNodes.show();
                        $currentRow.data("group-state", "EXPANDED");
                        $(this).removeClass("glyphicon-expand");
                        $(this).addClass("glyphicon-collapse-up");
                    }
                });
                this.applyPredefinedGrouping();
            };
            DataListControl.prototype.applyPredefinedGrouping = function () {
                var _this = this;
                var groupBy = [];
                if (!(this.options.rememberLastState || this.viewsHelper.currentView != null)) {
                    var _loop_11 = function (i) {
                        var state = /*options.getGroupsClosed === true && i === groupsArray.length - 1 ? "COLLAPSED" :*/ "EXPANDED";
                        var columnInfo = $.grep(this_7.status.columnInfo, function (c) { return c.name === _this.options.predefinedGroups[i].column; });
                        if (columnInfo.length !== 1) {
                            this_7.handleError("DATALIST ERROR: Column info was not found for column " + this_7.options.predefinedGroups[i].column);
                            return "continue";
                        }
                        groupBy.push(new Widgets.DataListGroupByInfo(columnInfo[0], state, false));
                    };
                    var this_7 = this;
                    for (var i = 0; i < this.options.predefinedGroups.length; i++) {
                        _loop_11(i);
                    }
                    //Set the status
                    this.status.groupBy = groupBy;
                }
                //Set in the UI
                var columnNames = $.map(this.status.groupBy, function (g) { return g.column; });
                var $availableColumns = this.$wrapperElement.find(".datalist-grouping .available-columns");
                $availableColumns.val(columnNames);
                this.$wrapperElement.find(".datalist-grouping button.add-group").click();
            };
            /*********************** Grouping [END] ***********************/
            /*********************** Custom button functionalities [END] ***********************/
            /*********************** [BEGIN] Action buttons / Picklist buttons ***********************/
            DataListControl.prototype.configureActionButtons = function () {
                //Picklist does not have actions
                if (this.options.isPickList)
                    return;
                var $listActions = this.$wrapperElement.find(".actions");
                var $actionButtons = this.$wrapperElement.siblings(".data-list-action-buttons").find("button");
                var $compactActionsContainer = $("<div class='dropdown btn-group btn-group-sm compact-actions'> \
                                                        <button class='btn dropdown-toggle actionsDropdown' type='button' data-toggle='dropdown'> \
                                                            " + this.resources.textResources.Actions + " \
                                                            <span class='caret'></span> \
                                                        </button> \
                                                        <ul class='dropdown-menu'> \
                                                        </ul> \
                                                    </div>");
                var $compactActions = $compactActionsContainer.find(".dropdown-menu");
                var _loop_12 = function (i) {
                    var $actionButtonContainer = $("<div class='btn-group btn-group-sm'></div>");
                    var $actionButton = $actionButtons.eq(i);
                    //Remove the default size if the button has a specified size
                    if ($actionButton.attr("ui-role-element-size") != undefined) {
                        $actionButtonContainer.removeClass("btn-group-sm");
                    }
                    /* NOTE: It seems that on some use cases, that moving the action button to
                     *       a different place in the DOM may break the ng-click functionality.
                     *       In order to avoid this a dummy action button is created that triggers
                     *       the original, and the original is hidden.
                     */
                    var $dummyActionButton = $actionButton.clone();
                    $dummyActionButton.removeAttr("jb-id");
                    $dummyActionButton.attr("related-to", $actionButton.attr("jb-id"));
                    $dummyActionButton.on("click", function (event) {
                        if (!$actionButton.is(":disabled")) {
                            $actionButton.click();
                        }
                    });
                    //Create another dummy button for compact mode display setting
                    var $dummyCompactActionButton = $("<a class='dropdown-item' href='#'></a>");
                    $dummyCompactActionButton.attr("related-to", $actionButton.attr("jb-id"));
                    $dummyCompactActionButton.text($actionButton.text());
                    $dummyCompactActionButton.on("click", function (event) {
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
                };
                /*********************** [BEGIN] Action buttons ***********************/
                for (var i = 0; i < $actionButtons.length; i++) {
                    _loop_12(i);
                }
                $compactActionsContainer.hide(); //This is to avoid flikering while loading...
                $compactActionsContainer.appendTo($listActions);
                /*********************** Action buttons [END] ***********************/
            };
            /*********************** [BEGIN] Action buttons context menu ***********************/
            DataListControl.prototype.configureActionButtonContextMenu = function () {
                var _this = this;
                //Picklist mode does not have actions menu on right click
                if (this.options.isPickList)
                    return;
                var $actionButtons = this.$wrapperElement.find(".actions button[jb-type='ListCommandButton']");
                var contextMenuActions = [];
                var _loop_13 = function (i) {
                    var $actionButton = $actionButtons.eq(i);
                    var action = {
                        title: $actionButton.text(),
                        uiIcon: Widgets.DataListControlResources.icons.menuItem.bs,
                        cmd: $actionButton.attr("related-to"),
                        disabled: function (event, ui) {
                            if ($actionButton.hasClass("show-single"))
                                return _this.status.selectedItems.length !== 1;
                            if ($actionButton.hasClass("show-multi"))
                                return _this.status.selectedItems.length < 1;
                            return false;
                        }
                    };
                    contextMenuActions.push(action);
                };
                for (var i = 0; i < $actionButtons.length; i++) {
                    _loop_13(i);
                }
                //Create the context menu on the headers
                this.$element.contextmenu({
                    delegate: "tbody tr:not(.group-row):not(.group-aggregators-row)",
                    addClass: "datalist-actions",
                    menu: contextMenuActions,
                    select: function (event, ui) { _this.actionContextMenuSelect(event, ui); },
                    beforeOpen: function (event, ui) { _this.actionContextMenuBeforeOpen(event, ui); }
                });
                //Remove the jQueryUI icon classes from the context menu
                $(".datalist-actions .ui-icon").each(function (event) {
                    $(this).removeClass("ui-icon");
                });
            };
            /*********************** [BEGIN] Select / Deselect buttons ***********************/
            DataListControl.prototype.configureSelectionButtons = function () {
                var _this = this;
                if (!this.options.hasMultiSelect)
                    return;
                var $selectActions = this.$wrapperElement.find(".select-actions");
                var $compactSelectActionsContainer = $("<div class='dropup btn-group btn-group-sm compact-select-actions'> \
                                                        <button class='btn dropdown-toggle' type='button' data-toggle='dropdown'> \
                                                            " + this.resources.textResources.SelectionActions + " \
                                                            <span class='caret'></span> \
                                                        </button> \
                                                        <ul class='dropdown-menu'> \
                                                        </ul> \
                                                    </div>");
                var $compactActions = $compactSelectActionsContainer.find(".dropdown-menu");
                /******** SELECT ALL RECORDS OF PAGE BUTTON ********/
                var $selectAllPageRecordsButtonContainer = $("<div class='btn-group btn-group-sm'><button jb-id='datalist-select-all-page' class='btn btn-default datalist-select select-all-page'></button></div>");
                var $selectAllPageRecords = $selectAllPageRecordsButtonContainer.find("button");
                $selectAllPageRecords.text(this.resources.textResources.SelectAllPageRecordsText);
                $selectAllPageRecords.on("click", function (event) {
                    if (_this.maxSelectedRowsReached(_this.dataTableInstance.rows().count())) {
                        return;
                    }
                    _this.status.allKeysSelected = false;
                    _this.dataTableInstance.rows().select();
                    //Update directive & model. Picklist handles the directive scope when pressing ok
                    if (!_this.options.isPickList) {
                        _this.listSelectionChanged();
                    }
                });
                $selectAllPageRecordsButtonContainer.appendTo($selectActions);
                //Create a dummy button for compact mode display setting
                var $dummySelectAllPageRecordsButton = $("<a class='dropdown-item' href='#'></a>");
                $dummySelectAllPageRecordsButton.attr("related-to", $selectAllPageRecords.attr("jb-id"));
                $dummySelectAllPageRecordsButton.text($selectAllPageRecords.text());
                $dummySelectAllPageRecordsButton.on("click", function (event) {
                    $selectAllPageRecords.click();
                });
                $dummySelectAllPageRecordsButton.wrap("<li></li>");
                $dummySelectAllPageRecordsButton.parent().appendTo($compactActions);
                /******** SELECT ALL RECORDS BUTTON ********/
                var $selectAllRecordsButtonContainer = $("<div class='btn-group btn-group-sm'><button jb-id='datalist-select-all' class='btn btn-default datalist-select select-all'></button></div>");
                var $selectAllRecords = $selectAllRecordsButtonContainer.find("button");
                $selectAllRecords.text(this.resources.textResources.SelectAllRecordsText);
                $selectAllRecords.on("click", function (event) {
                    if (_this.maxSelectedRowsReached(_this.dataTableInstance.page.info().recordsTotal)) {
                        return;
                    }
                    var directiveScope = Joove.Common.getDirectiveScope(_this.$scopeElement);
                    //Select all in current page to refresh the UI
                    _this.dataTableInstance.rows().select();
                    //Update status
                    _this.status.allKeysSelected = _this.status.filters.length == 0;
                    //Show loading panel
                    _this.$loadingPanel.show();
                    Joove.DatasourceManager.requestSelectedItemsfromServer(_this.serversideElementId, _this.$scopeElement, directiveScope.itemDataType, true, //This is forced to true since FullRecordSet controller action now handles filtering
                    [], //No keys are posted since every key is selected
                    _this.status.excludedKeys, //This option is the keysToExclude which is used only when allKeysSelected is true
                    _this.prepareDatasourceRequestInfo(), function (selectedItemsData) {
                        //Hide the loading panel
                        _this.$loadingPanel.hide();
                        //Ensure we always handle an array
                        if (!Joove.Common.isArray(selectedItemsData)) {
                            selectedItemsData = [selectedItemsData];
                        }
                        _this.status.selectedItems = selectedItemsData;
                        /* NOTE: The select all records request is the only case in the Picklist mode
                         *       that should update the directive scope since the request to the server is
                         *       already made.
                         */
                        _this.listSelectionChanged();
                        window.$refreshLogic();
                    });
                });
                $selectAllRecordsButtonContainer.appendTo($selectActions);
                //Create a dummy button for compact mode display setting
                var $dummySelectAllRecordsButton = $("<a class='dropdown-item' href='#'></a>");
                $dummySelectAllRecordsButton.attr("related-to", $selectAllRecords.attr("jb-id"));
                $dummySelectAllRecordsButton.text($selectAllRecords.text());
                $dummySelectAllRecordsButton.on("click", function (event) {
                    $selectAllRecords.click();
                });
                $dummySelectAllRecordsButton.wrap("<li></li>");
                $dummySelectAllRecordsButton.parent().appendTo($compactActions);
                /******** DESELECT ALL RECORDS OF PAGE BUTTON ********/
                var $deselectAllPageRecordsButtonContainer = $("<div class='btn-group btn-group-sm'><button jb-id='datalist-deselect-all-page' class='btn btn-default datalist-select deselect-all-page'></button></div>");
                var $deselectAllPageRecords = $deselectAllPageRecordsButtonContainer.find("button");
                $deselectAllPageRecords.text(this.resources.textResources.DeselectAllPageRecordsText);
                $deselectAllPageRecords.on("click", function (event) {
                    _this.dataTableInstance.rows().deselect();
                    _this.status.allKeysSelected = false;
                    _this.listSelectionChanged();
                });
                $deselectAllPageRecordsButtonContainer.appendTo($selectActions);
                //Create a dummy button for compact mode display setting
                var $dummyDeselectAllPageRecordsButton = $("<a class='dropdown-item' href='#'></a>");
                $dummyDeselectAllPageRecordsButton.attr("related-to", $deselectAllPageRecordsButtonContainer.attr("jb-id"));
                $dummyDeselectAllPageRecordsButton.text($deselectAllPageRecordsButtonContainer.text());
                $dummyDeselectAllPageRecordsButton.on("click", function (event) {
                    $deselectAllPageRecords.click();
                });
                $dummyDeselectAllPageRecordsButton.wrap("<li></li>");
                $dummyDeselectAllPageRecordsButton.parent().appendTo($compactActions);
                /******** DESELECT ALL RECORDS BUTTON ********/
                var $deselectAllRecordsButtonContainer = $("<div class='btn-group btn-group-sm'><button jb-id='datalist-deselect-all' class='btn btn-default datalist-select deselect-all'></button></div>");
                var $deselectAllRecords = $deselectAllRecordsButtonContainer.find("button");
                $deselectAllRecords.text(this.resources.textResources.DeselectAllRecordsText);
                $deselectAllRecords.on("click", function (event) {
                    _this.deselectAll();
                });
                $deselectAllRecordsButtonContainer.appendTo($selectActions);
                //Create a dummy button for compact mode display setting
                var $dummyDeselectAllRecordsButton = $("<a class='dropdown-item' href='#'></a>");
                $dummyDeselectAllRecordsButton.attr("related-to", $deselectAllRecordsButtonContainer.attr("jb-id"));
                $dummyDeselectAllRecordsButton.text($deselectAllRecordsButtonContainer.text());
                $dummyDeselectAllRecordsButton.on("click", function (event) {
                    $deselectAllRecords.click();
                });
                $dummyDeselectAllRecordsButton.wrap("<li></li>");
                $dummyDeselectAllRecordsButton.parent().appendTo($compactActions);
                $compactSelectActionsContainer.appendTo($selectActions);
            };
            DataListControl.prototype.deselectAll = function () {
                //Update status
                this.status.allKeysSelected = false;
                this.setSelectedItemKeys([]);
                this.listSelectionChanged();
            };
            /*********************** Select / Deselect buttons [END] ***********************/
            DataListControl.prototype.actionContextMenuSelect = function (event, ui) {
                //Trigger the actual button based on the jb-id
                this.$wrapperElement.find(".actions button[related-to='" + ui.item.data().command + "']").click();
            };
            DataListControl.prototype.actionContextMenuBeforeOpen = function (event, ui) {
                var _this = this;
                var $row = $(ui.target).closest("tr");
                this.dataTableInstance.row($row.get(0)).select();
                this.updateDirectiveScopeAndModel(function () {
                    //Sync actions state to the actual buttons state. Doing this keeps the context menu
                    //up-to-date with conditional formatings applied on list actions
                    ui.menu.find("li").each(function (index, element) {
                        var $element = $(element);
                        var $originalActionButton = _this.$wrapperElement.siblings(".data-list-action-buttons").find("[jb-id='" + $element.data("command") + "']");
                        $element.toggle(!$originalActionButton.hasClass("cf-hidden"));
                    });
                });
                ui.menu.css("z-index", 9999);
            };
            /*********************** Action buttons context menu [END] ***********************/
            DataListControl.prototype.updateActionButtonVisibility = function () {
                var visibleActionsWidth = 0;
                var compactMode = false;
                /*********************** [BEGIN] Select / Deselect buttons ***********************/
                var $selectionActionsContainer = this.$wrapperElement.find(".select-actions");
                var $selectAllPageRecords = $selectionActionsContainer.find(".select-all-page");
                var $selectAllRecords = $selectionActionsContainer.find(".select-all");
                var $deselectAllPageRecords = $selectionActionsContainer.find(".deselect-all-page");
                var $deselectAllRecords = $selectionActionsContainer.find(".deselect-all");
                var pageCount = this.dataTableInstance.page.info().pages;
                var pageRecordCount = this.dataTableInstance.rows().count();
                var pageSelectedRecordCount = this.dataTableInstance.rows({ selected: true }).count();
                $selectAllPageRecords.toggle((pageRecordCount !== pageSelectedRecordCount) && (pageCount > 1));
                $deselectAllPageRecords.toggle((pageSelectedRecordCount > 0) && (pageCount > 1));
                $selectAllRecords.toggle((!this.status.allKeysSelected) && (pageRecordCount > 0));
                $deselectAllRecords.toggle((this.status.selectedItems.length > 0) && (pageRecordCount > 0));
                //Handle the compact selection actions visibility
                $selectionActionsContainer.find("button.datalist-select").each(function (index, button) {
                    var $selectAction = $(button);
                    var $dummyOption = $selectionActionsContainer.find(".compact-select-actions a[related-to='" + $selectAction.attr("jb-id") + "']");
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
                var $actionsContainer = this.$wrapperElement.find(".actions");
                visibleActionsWidth = 0;
                //Select all buttons that are not affected by conditional formattings that affect visibility
                var $showAlwaysButtons = $actionsContainer.find("button.show-always:not(.cf-hidden)");
                var $singleSelectionButtons = $actionsContainer.find("button.show-single:not(.cf-hidden)");
                var $multiSelectionButtons = $actionsContainer.find("button.show-multi:not(.cf-hidden)");
                $showAlwaysButtons.toggle(true); //Needed for reseting the hidden state
                if ($singleSelectionButtons.length > 0) {
                    $singleSelectionButtons.toggle(this.status.selectedItems.length === 1);
                }
                if ($multiSelectionButtons.length > 0) {
                    $multiSelectionButtons.toggle(this.status.selectedItems.length >= 1);
                }
                //Handle the compact actions visibility
                $actionsContainer.find("button[jb-type='ListCommandButton']").each(function (index, button) {
                    var $action = $(button);
                    var $dummyOption = $actionsContainer.find(".compact-actions a[related-to='" + $action.attr("related-to") + "']");
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
                $actionsContainer.find(".actionsDropdown").on("click", function (event) {
                    event.stopImmediatePropagation();
                    $('.actionsDropdown').next('ul').toggle();
                    event.preventDefault();
                });
                /*********************** Action buttons [END] ***********************/
            };
            /*********************** Action buttons / Picklist buttons [END] ***********************/
            /*********************** [BEGIN] Search element ***********************/
            DataListControl.prototype.convertInputToSearchElement = function ($input) {
                var $searchElement = $("<div class='input-group input-group-sm search-element empty'></div>");
                var $actionButtons = $("<div class='input-group-btn search-actions'> \
                                        <button class='btn btn-default clear-button'> \
                                            <span class='bootstrap-tooltip' data-toggle='tooltip' data-placement='top' title='" + this.resources.textResources.ClearSearch + "' > \
                                                <span class='" + Widgets.DataListControlResources.icons.remove.bs + "'></span> \
                                            </span> \
                                        </button> \
                                        <button class='btn btn-default search-button'> \
                                            <span class='bootstrap-tooltip' data-toggle='tooltip' data-placement='top' title='" + this.resources.textResources.Search + "' > \
                                                <span class='" + Widgets.DataListControlResources.icons.search.bs + "'></span> \
                                            </span> \
                                        </button> \
                                      </div>");
                $searchElement.append($input);
                $searchElement.append($actionButtons);
                return $searchElement;
            };
            DataListControl.prototype.attachSearchElementEventHandlers = function ($searchElement) {
                var _this = this;
                var $searchInput = $searchElement.find("input.search-input");
                var $clearButton = $searchElement.find("button.clear-button");
                var $searchButton = $searchElement.find("button.search-button");
                var $searchDropDown = $searchElement.find("select").eq(0);
                $searchDropDown.on("change", function (event) {
                    _this.applySearch($searchElement, event);
                });
                $searchInput.on("change", function (event) {
                    $searchElement.toggleClass("empty", $searchInput.val().length === 0);
                });
                $searchInput.on("keypress", function (event) {
                    if (event.keyCode === 13) {
                        $searchButton.click();
                        $searchInput.trigger("change");
                    }
                });
                $clearButton.on("click", function (event) {
                    $searchInput.val("");
                    _this.applySearch($searchElement, event);
                    $searchElement.addClass("empty");
                });
                $searchButton.on("click", function (event) {
                    event.stopImmediatePropagation();
                    _this.applySearch($searchElement, event);
                });
            };
            DataListControl.prototype.applySearch = function ($searchElement, event) {
                var isGloabalSearch = $searchElement.parent().hasClass("global-search");
                var isQuickFilter = $searchElement.parent().hasClass("quick-filter");
                var $searchInput = $searchElement.find("input");
                var $searchDropDown = $searchElement.find("select");
                if (isGloabalSearch) {
                    this.dataTableInstance.search($searchInput.val()).draw();
                }
                if (isQuickFilter) {
                    var $columnHeader = $(event.target).closest("th");
                    var value = $searchDropDown.length == 0
                        ? $searchInput.val()
                        : $searchDropDown.val();
                    this.dataTableInstance.columns($columnHeader).search(value).draw();
                }
            };
            /*********************** Search element [END] ***********************/
            /*********************** [BEGIN] Aggregators ***********************/
            DataListControl.prototype.configureAggregators = function () {
                var _this = this;
                //Picklist does not utilizes aggregators. This part is disabled for that mode
                if (this.options.isPickList) {
                    return;
                }
                //Create the context menu on the headers
                this.$wrapperElement.contextmenu({
                    delegate: "table.data-list thead th:not(.row-number-column)",
                    addClass: "datalist-aggregators",
                    menu: [
                        {
                            title: this.resources.textResources.CalculateCount,
                            cmd: Joove.AggregatorTypes.COUNT,
                            uiIcon: Widgets.DataListControlResources.icons.aggregator.bs,
                            data: { enabled: false },
                            disabled: function (event, ui) {
                                return _this.isAggregatorDisabled($(ui.target).closest("th"), Joove.AggregatorTypes.COUNT);
                            }
                        },
                        {
                            title: this.resources.textResources.CalculateSum,
                            cmd: Joove.AggregatorTypes.SUM,
                            uiIcon: Widgets.DataListControlResources.icons.aggregator.bs,
                            data: { enabled: false },
                            disabled: function (event, ui) {
                                return _this.isAggregatorDisabled($(ui.target).closest("th"), Joove.AggregatorTypes.SUM);
                            }
                        },
                        {
                            title: this.resources.textResources.CalculateAverage,
                            cmd: Joove.AggregatorTypes.AVERAGE,
                            uiIcon: Widgets.DataListControlResources.icons.aggregator.bs,
                            data: { enabled: false },
                            disabled: function (event, ui) {
                                return _this.isAggregatorDisabled($(ui.target).closest("th"), Joove.AggregatorTypes.AVERAGE);
                            }
                        }
                    ],
                    select: function (event, ui) { _this.aggregatorContextMenuSelect(event, ui); },
                    beforeOpen: function (event, ui) { _this.aggregatorContextMenuBeforeOpen(event, ui); }
                });
                //Remove the jQueryUI icon classes from the context menu
                $(".datalist-aggregators .ui-icon").each(function (event) {
                    $(this).removeClass("ui-icon");
                });
                //Append an indicator for the state of each menu item
                $(".datalist-aggregators .ui-menu-item-wrapper").each(function (event) {
                    var $statusElement = $("<span class='aggragator-state glyphicon glyphicon-ok'></span>");
                    //Check in case we have multiple datalist instances, since the contextmenu item is created under the body element
                    if ($(this).children(".aggragator-state").length === 0) {
                        $(this).append($statusElement);
                    }
                });
                this.applyPredefinedAggregators();
            };
            DataListControl.prototype.applyPredefinedAggregators = function () {
                for (var i = 0; i < this.options.predefinedAggregators.length; i++) {
                    var aggregator = this.getAggregator(this.options.predefinedAggregators[i].column, Joove.AggregatorTypes[this.options.predefinedAggregators[i].type]);
                    if (aggregator == undefined) {
                        this.handleError("DATALIST ERROR: Could not find aggregator " + this.options.predefinedAggregators[i].type + " for column " + this.options.predefinedAggregators[i].column + " in datalist status");
                        continue;
                    }
                    aggregator.enabled = true;
                }
                this.makeAggregatorRequest();
            };
            DataListControl.prototype.aggregatorContextMenuBeforeOpen = function (event, ui) {
                /*  NOTE: Because the context menu is the same object across all columns
                 *        it should be refreshed to reflect the current aggregator state of
                 *        the clicked column
                 */
                var self = this;
                var $columnHeader = $(ui.target).closest("th");
                var columnInfo = this.getColumnInfoForElement($columnHeader);
                $(ui.menu).children().each(function (e) {
                    var aggregator = self.getAggregator(columnInfo.name, $(this).data().command);
                    $(this).data("enabled", aggregator != undefined && aggregator.enabled);
                    $(this).find(".aggragator-state").toggle($(this).data("enabled"));
                });
                ui.menu.css("z-index", 9999);
            };
            DataListControl.prototype.aggregatorContextMenuSelect = function (event, ui) {
                var $columnHeader = $(ui.target).closest("th");
                var columnInfo = this.getColumnInfoForElement($columnHeader);
                var aggregator = this.getAggregator(columnInfo.name, ui.item.data().command);
                aggregator.enabled = !ui.item.data("enabled");
                this.makeAggregatorRequest();
            };
            DataListControl.prototype.renderAggregators = function (row, data, start, end, display) {
                var self = this;
                //If not initialized the dataTableInstance property is undefined
                if (!this.isInitialized)
                    return;
                var hasAggregators = this.cache.aggregators != null;
                var $footer = $(this.dataTableInstance.table().footer());
                //If there are no aggregators add a class make it take zero space
                $footer.parent().toggleClass("empty-footer", !hasAggregators);
                $footer.parent().toggleClass("aggregator-footer", hasAggregators);
                for (var i = this.options.showRowNumbers ? 1 : 0; i < this.dataTableInstance.columns()[0].length; i++) {
                    var columnInfo = this.getColumnInfoForElement($(this.dataTableInstance.column(i).header()));
                    var $columnFooter = $(this.dataTableInstance.column(i).footer());
                    var $aggregatorsWrapper = $("<ul></ul>");
                    var _loop_14 = function (j) {
                        if (columnInfo == undefined) {
                            this_8.handleError("DATALIST ERROR: ColumnInfo not found for column with index " + i);
                            return "continue";
                        }
                        var aggregator = this_8.getAggregator(columnInfo.name, this_8.aggregatorsInfo[j].type);
                        if (aggregator != undefined && aggregator.enabled &&
                            ((this_8.cache.groups == null && this_8.cache.aggregators != null)
                                || (this_8.cache.groups != null && this_8.cache.aggregators != null && this_8.cache.aggregators.Groups != null))) {
                            var aggregators = Joove.Common.isArray(this_8.cache.aggregators) && this_8.cache.groups == null
                                ? this_8.cache.aggregators
                                : this_8.cache.aggregators.Groups.Aggregates; //If grouping is enabled get the total/root values
                            var aggregatorValue = $.grep(aggregators, function (item) {
                                //The aggregator type is intentionally not strict because the Newtonsoft serializer
                                //handles the enum JSON value as string
                                return item.Type == aggregator.type && self.sanitizeColumnName(item.Column).toLowerCase() === self.sanitizeColumnName(aggregator.column).toLowerCase();
                            });
                            if (aggregatorValue.length !== 1) {
                                this_8.handleError("DATALIST ERROR: Aggregator value not found for column " + columnInfo.name);
                                return "continue";
                            }
                            var $aggregatorElement = $("<li> \
                                                        <span class='aggregator-caption'>" + this_8.aggregatorsInfo[j].totalText + "</span> \
                                                        <span span class='aggregator-value'>" + aggregatorValue[0].ValueFormatted + "</span> \
                                                      </li>");
                            $aggregatorsWrapper.append($aggregatorElement);
                        }
                    };
                    var this_8 = this;
                    for (var j = 0; j < this.aggregatorsInfo.length; j++) {
                        _loop_14(j);
                    }
                    //Refresh footer with the new elements
                    $columnFooter.empty();
                    $columnFooter.append($aggregatorsWrapper);
                }
                this.updateDataTableSize();
            };
            /*********************** Aggregators [END] ***********************/
            /*********************** [BEGIN] Column Resize ***********************/
            DataListControl.prototype.configureColumnResize = function () {
                var self = this;
                //If resize is not enable don't do anything
                if (!this.options.hasResizableColumns) {
                    return;
                }
                this.$wrapperElement.find("table thead th .resize-grip").each(function (event) {
                    var $grip = $(this);
                    //Use the jquery-ui draggable functionality
                    $grip.draggable({
                        containment: $(this).closest("tr"),
                        axis: "x",
                        drag: function (event, ui) {
                            //Prevent the column to be less than the min column width
                            if (ui.position.left < self.options.minColumnWidth) {
                                ui.position.left = self.options.minColumnWidth;
                            }
                        },
                        stop: function (event, ui) {
                            /* NOTE: In order to adjust the column width to the position of the dragged grip
                             *       we inject the calculated width values to the datatables column settings
                             *       and NOT to the actual dom elements. This way we keep the compatibility
                             *       with the columns.adjust() function of the plugin and use it to apply the
                             *       redraw. Otherwise if the column widths are directly applied to the dom,
                             *       on each redraw the column widths get messed up.
                             */
                            var datatablesColumnSettings = self.dataTableInstance.settings()[0].aoColumns; //Column settings used by the datatables plugin
                            var $headerTable = $grip.closest("table");
                            var $currentTh = $grip.closest("th");
                            var $allTh = $headerTable.find("th");
                            var totalWidth = 0;
                            $allTh.each(function (event) {
                                var $resizeGrip = $(this).find(".resize-grip");
                                var $th = $(this);
                                var columnWidth = 0;
                                if ($(this).hasClass(("row-number-column"))) {
                                    //For the row number row just include it in the total width
                                    columnWidth += this.offsetWidth;
                                }
                                else {
                                    //If we are at the active column get the width from the grip
                                    if ($currentTh.get(0) === this) {
                                        columnWidth += $resizeGrip.get(0).offsetLeft; //The grip's left offset is the actual th width
                                    }
                                    else {
                                        //...else get the width from the th element
                                        columnWidth += $th.get(0).offsetWidth; //The th actual width
                                    }
                                    //Get the columnInfo and use it to find the correct column setting
                                    //since a column reorder could be applied
                                    var columnInfo_2 = self.getColumnInfoForElement($th);
                                    var columnSettings = datatablesColumnSettings.filter(function (c) { return c.data === columnInfo_2.name; })[0];
                                    if (columnSettings != undefined) {
                                        //This check is to update every column width if the original value is null or when we need to update
                                        //the column that triggered the change. Also save the new values to columnInfo in status.
                                        if (($currentTh.get(0) === this || columnSettings.sWidth == null)) {
                                            columnSettings.sWidth = columnWidth + "px";
                                            columnInfo_2.width = columnWidth + "px";
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
            };
            /*********************** Column Resize [END] ***********************/
            DataListControl.prototype.intializeDateTimePicker = function ($element) {
                var _this = this;
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
                        "onClose": function (selectedTime, $pickerElement, event) {
                            //Set zero time if not from editable field since filters only work with default DateTime formatted values
                            if (!editedValue || (editedValue && !timeSupport)) {
                                selectedTime.setUTCHours(0, 0, 0, 0);
                            }
                            var previousSelectedTimeAsUTC = $pickerElement.data("selectedTime");
                            var selectedCustomInput = moment($pickerElement.val(), fullFormat);
                            var selectedTimeAsUTC = selectedCustomInput.isValid() ? selectedCustomInput.toDate().toISOString() : Date.parseDate(selectedTime).toISOString();
                            if (selectedTimeAsUTC == previousSelectedTimeAsUTC)
                                return;
                            //Set new value
                            $pickerElement.data("selectedTime", selectedTimeAsUTC);
                            //...and trigger on change if needed
                            if (editedValue) {
                                _this.updateCellValue($pickerElement);
                            }
                        }
                    });
                    //If we have a valid moment.js date value then set it to the appropriate data key
                    if (editedValue && initialValue.isValid()) {
                        $element.data("selectedTime", initialValue.toDate().toISOString());
                    }
                }
            };
            DataListControl.getTotalRecords = function (jbID) {
                var totalRecords = 0;
                try {
                    totalRecords = this.instancesDic[jbID].cache.data.recordsTotal;
                }
                catch (e) {
                    totalRecords = 0;
                }
                return totalRecords;
            };
            DataListControl.prototype.getModalDialogElement = function (dialogId, title, withCancel) {
                var _this = this;
                title = title || "";
                var cancel = withCancel === true
                    ? "<button type='button' jb-type='Button' class='jb-control jb-simple-btn btn btn-default cancel-" + dialogId + "-modal-btn' ui-role-color='default' \ndata-dismiss='modal'>" + this.resources.textResources.DialogCancelButton + "</button>"
                    : "";
                var $bootstrapModalHTML = $("<div id='" + (this.clientsideElementId + '_' + dialogId) + "' class='modal fade' role='dialog'>\n                                            <div class='modal-dialog'>\n                                                <div class='modal-content'>\n                                                    <div class='modal-header' >\n                                                        <h4 class='modal-title'>" + title + "</h4>\n                                                    </div>\n                                                    <div class='modal-body'>\n                                                    </div>\n                                                    <div class='modal-footer'>\n                                                        <button type='button' jb-type='Button' class='jb-control jb-simple-btn btn btn-primary btn-ok ok-" + dialogId + "-modal-btn'\nui-role-color='primary' data-dismiss='modal'>" + this.resources.textResources.DialogOkButton + "</button>\n                                                        " + cancel + "\n                                                    </div>\n                                                </div>\n                                            </div>\n                                         </div>");
                if (this.options.useCustomModal) {
                    this.$wrapperElement.on("click", "button.cancel-" + dialogId + "-modal-btn, button.ok-" + dialogId + "-modal-btn", function (e) {
                        _this.hideCustomModal(_this.$wrapperElement.children("div#" + _this.clientsideElementId + "_" + dialogId));
                    });
                }
                return $bootstrapModalHTML;
            };
            DataListControl.prototype.reset = function () {
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
                for (var i = 0; i < this.status.aggregators.length; i++) {
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
            };
            DataListControl.prototype.applyNumericMask = function ($inputElement) {
                var _this = this;
                //If the mask is not already applied
                if ($inputElement.data("numericMaskOn") !== true) {
                    $inputElement.on("keypress", function (event) {
                        var keyCode = event.which || event.keyCode;
                        var isNumber = keyCode >= 48 && keyCode <= 57;
                        var isDot = keyCode == 46;
                        var isComma = keyCode == 44;
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
                            var selection = _this.getInputSelection($inputElement.get(0));
                            //Inject the proper decimal separator regardless of the pressed key (dot or comma)
                            $inputElement.val($inputElement.val().slice(0, selection.start) + window._context.decimalSeparator + $inputElement.val().slice(selection.end));
                            //Move the caret back to it's proper position using evil 3rd-party functions from hell
                            _this.setInputSelection($inputElement.get(0), selection.start + 1, selection.start + 1);
                            return false;
                        }
                    });
                    //Disable paste functionality to be super safe
                    $inputElement.on("paste", function (event) {
                        event.preventDefault();
                    });
                    $inputElement.data("numericMaskOn", true);
                }
            };
            DataListControl.prototype.intializeCustomModalListeners = function () {
                var self = this;
                this.$wrapperElement.find(".bootstrap-modal").each(function () {
                    var $btnElement = $(this);
                    var $targetDialog = self.$wrapperElement.find($btnElement.attr("data-target"));
                    if ($targetDialog.length != 1) {
                        self.handleError("ERROR: Custom modal dialog button could not find it's related modal window");
                        return;
                    }
                    $btnElement.on("click", function () {
                        self.showCustomModal($targetDialog);
                    });
                    $targetDialog.on("click", function (e) {
                        if (e.target == $targetDialog.get(0)) {
                            self.hideCustomModal($targetDialog);
                        }
                    });
                });
            };
            DataListControl.prototype.showCustomModal = function ($element) {
                //Handle fade background functionality
                var $modalBackdrop = $("<div class='modal-backdrop fade in'></div>");
                $("body").append($modalBackdrop);
                //Handle modal
                $element.attr("style", "display: block; padding-right: 5px;");
                $element.addClass("in");
            };
            DataListControl.prototype.hideCustomModal = function ($element) {
                //Handle fade background functionality
                $("body").children("div.modal-backdrop").remove();
                //Handle modal
                $element.attr("style", "display: none;");
                $element.removeClass("in");
            };
            /***************************************** Custom functionalities [END] ******************************************/
            /***************************************** Conditional Formattings ***********************************************/
            DataListControl.prototype.getRowElementByRecordKey = function (key) {
                var dataTablesRow = this.dataTableInstance.rows('#' + key);
                if (dataTablesRow == null)
                    return null;
                var dataTablesNodes = dataTablesRow.nodes();
                if (dataTablesNodes == null || dataTablesNodes.length == 0)
                    return null;
                return $(dataTablesNodes[0]);
            };
            DataListControl.prototype.getHeaderColumnElementByName = function (name) {
                return this.$element.find(".header-label[data-name='" + name + "']").eq(0).closest("th");
            };
            DataListControl.prototype.applyConditionalFormattings = function () {
                if (this.ruleEvaluations == null || this.ruleEvaluations.length == 0)
                    return;
                var rulesVarName = window._context.appName + ".Controllers." + window._context.currentController + "_" + this.clientsideElementId + "_ConditionalFormattings";
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
                        console.error("No data Rule Info found for list c.f. " + rule.RuleName);
                        continue;
                    }
                    // Row
                    var $rowToApply = this.getRowElementByRecordKey(rule.Key);
                    if (rule.ApplyToRow === true) {
                        var ruleInfoForRow = ruleInfo["forRow"];
                        if (ruleInfoForRow == null) {
                            console.error("Row action cf data not found " + rule.RuleName);
                        }
                        else {
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
                        for (var j = 0; j < rule.ColumnNames.length; j++) {
                            var colName = rule.ColumnNames[j];
                            var $columnToApply = this.getHeaderColumnElementByName(colName);
                            if ($columnToApply.length === 0)
                                continue; // column not visible
                            var ruleInfoForColumn = ruleInfo["forColumns"][colName];
                            if (ruleInfoForColumn == null) {
                                console.error("column action cf data not found " + colName);
                                continue; // column action data not found
                            }
                            var actions = state === true
                                ? ruleInfoForColumn["whenTrue"]
                                : ruleInfoForColumn["whenFalse"];
                            if (actions == null)
                                continue; // state to do data not found
                            var index = $columnToApply.index();
                            var $cellToApply = $rowToApply.children("td").eq(index);
                            window._ruleEngine.applyConditionalFormattingOnControl($cellToApply, state, actions);
                        }
                    }
                }
            };
            /***************************************** Conditional Formattings [END] *****************************************/
            /***************************************** [BEGIN] Input selections functions (3rd Party) ******************************************/
            DataListControl.prototype.getInputSelection = function (el) {
                var start = 0, end = 0, normalizedValue, range, textInputRange, len, endRange;
                if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
                    start = el.selectionStart;
                    end = el.selectionEnd;
                }
                else {
                    range = document.selection.createRange();
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
                        }
                        else {
                            start = -textInputRange.moveStart("character", -len);
                            start += normalizedValue.slice(0, start).split("\n").length - 1;
                            if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                                end = len;
                            }
                            else {
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
            };
            DataListControl.prototype.setInputSelection = function (el, startOffset, endOffset) {
                el.focus();
                if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
                    el.selectionStart = startOffset;
                    el.selectionEnd = endOffset;
                }
                else {
                    var range = el.createTextRange();
                    var startCharMove = this.offsetToRangeCharacterMove(el, startOffset);
                    range.collapse(true);
                    if (startOffset == endOffset) {
                        range.move("character", startCharMove);
                    }
                    else {
                        range.moveEnd("character", this.offsetToRangeCharacterMove(el, endOffset));
                        range.moveStart("character", startCharMove);
                    }
                    range.select();
                }
            };
            DataListControl.prototype.offsetToRangeCharacterMove = function (el, offset) {
                return offset - (el.value.slice(0, offset).split("\r\n").length - 1);
            };
            // Static Constant values
            DataListControl.MAX_ROWS = 1000;
            DataListControl.DOUBLE_CLICK_THRESHOLD = 250;
            DataListControl.STANDALONE_OUTER_ELEMENTS_DUMMY_CLASS = "data-list-standalone-outer-static-elements-dummy";
            DataListControl.PICKLIST_POPUP_MODAL_CLASS = "modal-body";
            DataListControl.DEFAULT_DATATABLES_MIN_HEIGHT = "200px";
            DataListControl.GROUP_PATH_SEPARATOR = " /*+!+*/ "; //IMPORTANT: The group separator must contain at least one space in order to work with the jQuery selectors
            DataListControl.GROUP_VALUE_SEPARATOR = "/++***++/";
            DataListControl.SANITIZE_COLUMN_REPLACEMENT_VALUE = ""; //IMPORTANT: This should match the replacement value that the function SanitizeCSharpIdentifier uses in LinqRuntimeTypeBuilder.cs
            DataListControl.DEFAULT_PAGE_SIZE = 25;
            DataListControl.DEFAULT_DATETIME_FORMAT = "DD/MM/YYYY";
            // For External Access and debugging
            DataListControl.instancesDic = {};
            return DataListControl;
        }());
        Widgets.DataListControl = DataListControl;
        function jbDataList(jbDataList) {
            return {
                restrict: "AE",
                scope: {
                    opts: "=?jbDataListOptions"
                },
                link: function ($scope, $element) {
                    if (Joove.Common.directiveScopeIsReady($element))
                        return;
                    Joove.Common.setDirectiveScope($element, $scope);
                    $scope.initialize = function () {
                        $scope.list = new DataListControl($element, $scope.opts);
                    };
                    if ($scope.opts && $scope.opts.isPickList !== true) {
                        $scope.initialize();
                    }
                    Joove.Common.markDirectiveScopeAsReady($element);
                    // Scope Inteface Implementation
                    $scope.$addFilter = function (e, columnName, filterOp, rowOp, overwriteExisting, autoApply) {
                        if (e.type != "blur")
                            return;
                        var $target = $(e.target);
                        var isCheckBox = $target.attr("jb-type") == "CheckBox";
                        var id = $target.attr("jb-id");
                        var value = isCheckBox
                            ? $target.is(":checked")
                            : $target.val();
                        $scope.list.addCustomFilter(value, columnName, id, filterOp, rowOp, overwriteExisting, autoApply);
                    };
                    $scope.$clearFilters = function (e) {
                        $scope.list.removeAllCustomFilters();
                        $scope.list.dataTableInstance.ajax.reload();
                    };
                    $scope.$applyFilters = function (e) {
                        if ($scope.opts.waitForPredefinedFilters === true) {
                            $scope.list.dataTableInstance.draw();
                            $scope.list.$wrapperElement.fadeIn(2000);
                        }
                        else {
                            $scope.list.dataTableInstance.ajax.reload();
                        }
                    };
                    $scope.$globalFilter = function (e, autoApply) {
                        var value = $(e.target).val();
                        $scope.list.addGlobalSearch(value, false);
                    };
                    $scope.$sortBy = function (e, member) {
                        console.error("$sortBy Not Implemented yet!");
                    };
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
            };
        }
        angular.module("jbDataList", [])
            .provider("jbDataList", new JbDataList())
            .directive("jbDataList", ["$timeout", "jbDataList", jbDataList]);
        ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop']
            .forEach(function (event) {
            window.addEventListener(event, function (e) {
                e = e || event;
                e.preventDefault();
            }, false);
        });
    })(Widgets = Joove.Widgets || (Joove.Widgets = {}));
})(Joove || (Joove = {}));
