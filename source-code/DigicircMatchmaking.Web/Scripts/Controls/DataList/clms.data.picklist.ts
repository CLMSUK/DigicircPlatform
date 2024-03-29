﻿namespace Joove.Widgets {

    class JbDataPickList extends BaseAngularProvider {
    }

    export interface IDataPickListOptions {
        fromMasterPage: boolean;
        excludeSelected: boolean;
        model: any;
        owner: any;
        itemDataType;
    }

    export class DataPickListControl {
        private readonly $element: JQuery;
        private readonly $clearAllButton: JQuery;
        private readonly options: IDataPickListOptions;
        private dataList: Widgets.DataListControl;
        private readonly popupName: string;
        private selectedItems: any[];

        get isBoundToRoot(): boolean {
            return this.$element.attr("ng-owner") === "model";
        }

        get selectedItemKeys(): any[] {
            const directiveScope = Common.getDirectiveScope(this.$element);
            return DatasourceManager.getKeys(directiveScope.model);
        }

        static instancesDic: { [name: string]: Widgets.DataPickListControl } = {};

        constructor(element: JQuery, options: any) {
            this.$element = element;
            this.$clearAllButton = this.$element.next(".picklist-clear-selection-button");
            this.options = $.extend(this.options, options);

            const indexes = Common.getIndexesOfControl(this.$element);
            
            //Initialize paramenters
            const elementId = this.$element.attr("jb-id");

            this.popupName = this.$element.attr("jb-id") + indexes.key;

            //Add reference to dictionary
            Widgets.DataPickListControl.instancesDic[elementId + indexes.key] = this;


            //Configure PickList events
            this.configureEvents();
        }
        
        initializePickList() {
            if (this.$element.attr("initialized") == "true") return;

            let elementID = this.$element.attr("jb-id");
            var $table = this.$element.parent().find("[jb-id='" + elementID + "_PickList']");
            var dtScope = Common.getDirectiveScope($table);
            const indexes = Common.getIndexesOfControl(this.$element);

            var uniqueId = Common.createRandomId(8);
            this.$element.attr("unique-id", uniqueId);
            $table.attr("unique-id", uniqueId);

            dtScope.initialize();

            /*  NOTE: Because Angular's HTML compiler arranges the order for compiling by depth first down,
            *        it's important that the DataList html element precedes the PickList html element.
            *        The related DataList's constructor should run before the current constructor in order
            *        to register the DataList class instance and access it here.
            */
            this.dataList = Widgets.DataListControl.instancesDic[Joove.Core.GetElementNameFromId(elementID) + "_PickList" + uniqueId];

            if (this.dataList === undefined) {
                this.handleError("PICKLIST ERROR: DataList control with id: \"" + elementID + "_PickList\" was not found. Aborting initialization.");
                return;
            }

            //Initialize DataList control with the picklist button element as the scope element
            this.dataList.init(this.$element);
            //...and detach it from the DOM tree since it's displayed in a pop-up
            this.dataList.$wrapperElement.detach();

            //Configure popup manager
            this.configurePopUp();

            this.$element.attr("initialized", "true");
        }

        configurePopUp() {

            //Clear any previous popup instance with the same name
            window._popUpManager.destroyPopUp(this.popupName);

            //Register a new one
            window._popUpManager.registerPopUp({
                name: this.popupName,
                width: "90%",
                height: "80%",
                cancelButton: true,
                okButton: true,
                okCallback: () => { this.okCallback(); },
                title: window._resourcesManager.getPickListModalTitle(this.$element, this.options.fromMasterPage),
                $elementContent: this.dataList.$wrapperElement,
                closeCallback: () => { this.closeCallback(); }
            });

            //Attach a handler to close on Esc
            $(document).keyup(e => {
                if (e.which === 27) {
                    window._popUpManager.hidePopUp(this.popupName);
                }
            });            
        }

        configureEvents() {
            this.$element.on("click", () => {
                this.initializePickList();


                //Add this class to hide previously loaded content until the draw() command finishes
                this.dataList.$wrapperElement.addClass("hide-content");

                //If exclude selected keys is on, clear the selected items in the datalist control and set
                //as excluded the selected items in this control
                if (this.options.excludeSelected) {
                    this.dataList.status.allKeysSelected = false;
                    this.dataList.status.selectedKeys = [];
                    this.dataList.status.selectedItems = [];
                    this.dataList.status.excludedKeys = this.selectedItemKeys;
                    this.dataList.dataTableInstance.rows().deselect();
                } else {
                    //...else update the selected keys
                    this.dataList.setSelectedItemKeys(this.selectedItemKeys);
                }

                //Hide all picklist actions
                this.dataList.$wrapperElement.find(".actions button").hide();

                //Set the callback to be executed after the first opening in the popup windown 
                this.dataList.drawCallbackExtraFunctionality = () => {
                    //Display the refreshed content
                    this.dataList.$wrapperElement.removeClass("hide-content");
                    //Refresh the picklist button visibility state based on the newly loaded content
                    this.dataList.updateActionButtonVisibility();
                    //Remove this callback from being executed on every datatables draw event
                    this.dataList.drawCallbackExtraFunctionality = null;
                };

                //Display the picklist on the popup manager
                window._popUpManager.showPopUp(this.popupName);
                //Refresh the content
                this.dataList.dataTableInstance.draw();
                //Adjust the datalist size to the popup window
                this.dataList.updateDataTableSize();
            });

            this.$clearAllButton.on("click", () => {                  
                var self = this;

                window._popUpManager.question(window._resourcesManager.getPicklistClearConfirmation(), "",
                    function (confirm) {
                        if (confirm == false) return;

                        self.initializePickList();
                        self.dataList.deselectAll();
                        self.okCallback(true);
                    });
            });
        }

        okCallback(forClearSelectionButton?: boolean) {            
            /* NOTE: Before we proceed we must request from server the selected items again in order get
             *       every property and collection that was not present in the DataList control to avoid
             *       inconsistencies with the model. The only case this is not required is when the
             *       allKeysSelected in the DataList is true.
             */
            if (!this.dataList.status.allKeysSelected) {
                const directiveScope = Common.getDirectiveScope(this.dataList.$scopeElement);
                let selectedItemKeys = this.dataList.status.selectedItems.map((item) => { return item._key; });
                //If we have selected items that are not present in the selected items collection
                //and exlude selected option is enabled, add add them to the keys to be requested
                if (forClearSelectionButton !== true &&
                    this.selectedItems == undefined &&
                    this.options.excludeSelected &&
                    this.selectedItemKeys.length > 0 &&
                    this.dataList.options.hasMultiSelect) {
                    selectedItemKeys = this.selectedItemKeys.concat(selectedItemKeys);
                }

                const type = DatasourceManager.getDatasetType(this.$element);
                if (type == Joove.DataSourceTypes.VIEWMODEL) {
                    const selectedItemsData = DatasourceManager.fetchItemsFromViewModelDataset(this.$element, selectedItemKeys, false);
                    this.dataList.status.selectedItems = selectedItemsData;
                    this.dataList.updateDirectiveScopeAndModel(false); 
                    this.handleSelectedItems(forClearSelectionButton);
                } else {
                    //Show loading panel
                    this.dataList.$loadingPanel.show();
                    //Request again every item from server
                    DatasourceManager.requestSelectedItemsfromServer(
                        this.dataList.serversideElementId,
                        this.dataList.$scopeElement,
                        directiveScope.itemDataType,
                        this.dataList.status.allKeysSelected,
                        selectedItemKeys,
                        this.dataList.status.excludedKeys,
                        this.dataList.prepareDatasourceRequestInfo(),
                        selectedItemsData => {
                            //Hide the loading panel
                            this.dataList.$loadingPanel.hide();
                            //Ensure we always handle an array
                            if (!Common.isArray(selectedItemsData)) {
                                selectedItemsData = [selectedItemsData];
                            }
                            this.dataList.status.selectedItems = selectedItemsData;
                            this.dataList.updateDirectiveScopeAndModel(false); //Avoid refreshLogic execution since it's triggered later
                            //Proceed using updated selected items
                            this.handleSelectedItems(forClearSelectionButton);
                        });
                }
            } else {
                //No need to update the selected items
                this.handleSelectedItems(forClearSelectionButton);
            }
        }

        closeCallback() {
            if (!this.dataList.options.rememberLastState) {
                
                // Clear Filters
                this.dataList.status.filters = [];
                this.dataList.clearAllSearchFields();

                // Reset Order
                this.dataList.status.orderBy = [];
                this.dataList.dataTableInstance.order([]);

                // Group By
                this.dataList.status.groupBy = [];

                // Paging options
                if (this.dataList.options.hasPaging == true) {
                    this.dataList.status.pageSize = this.dataList.options.pageSizes[0];
                    this.dataList.dataTableInstance.page.len(this.dataList.status.pageSize);
                    this.$element.find(".dataTables_length").val(this.dataList.status.pageSize);
                }
            }
        }

        handleSelectedItems(forClearSelectionButton?: boolean) {
            //Trigger the onchange event of the list
            DatasourceManager.invokeOnChangeHandler(this.$element);

            const dtoTypeName = this.$element.attr("jb-client-dto");

            //If exclude selected is used we append to the already selected items
            //If the selected items is undefined initialize it
            //If signle selection is enabled remove previous selections
            if (forClearSelectionButton === true ||
                !this.options.excludeSelected ||
                this.selectedItems == undefined ||
                !this.dataList.options.hasMultiSelect) {
                //...otherwise we clear previously selected items
                this.selectedItems = [];
            }

            const dtoType = window[window._context.appName]["ViewModels"][window._context.currentController][dtoTypeName];

            if (dtoType == null) {
                this.handleError("PICKLIST ERROR: Couldn't find DTO type: " + dtoTypeName);
            }

            for (let i = 0; i < this.dataList.status.selectedItems.length; i++) {
                if (dtoType != null) {
                    this.selectedItems.push(dtoType._initializeFrom(this.dataList.status.selectedItems[i]));
                } else {
                    this.selectedItems.push(this.dataList.status.selectedItems[i]);
                }
            }

            this.updateModel();
        }

        updateModel() {
            const directiveScope = Common.getDirectiveScope(this.$element);

            //If the picklist doesn't have multi-selection enabled the first item is chosen
            directiveScope.model = this.dataList.options.hasMultiSelect ? this.selectedItems : this.selectedItems[0];

            if (this.options.owner != undefined) {
                const modelPath = this.$element.attr("ng-model");
                const parts = modelPath.split(".");
                const last = parts[parts.length - 1];

                if (this.isBoundToRoot) {
                    this.options.owner[last] = directiveScope.model;
                } else {
                    Core.setBoClassPropertyFromInstance(last, this.options.owner, directiveScope.model);
                }
            }

            const scope = this.options.fromMasterPage ? Common.getMasterScope() : directiveScope;
            /*TODO: Dehydrate messes up the updated model and discards the applied changes
             *      Re-check to ensure that no side-effect is caused by not running it
             */
            Core.applyScope(scope);

            //Refresh conditinal formatting and calculated expressions
            window.$refreshLogic();
        }

        handleError(error) {
            //TODO: Handle errors in a more sophisticated way :P
            console.log(error);
        }
    }

    interface IJbDataPickListScope extends IJooveScope {
        pickList: Widgets.DataPickListControl;
        options: any;
    }

    function jbDataPickList(jbDataPickList: JbDataPickList): ng.IDirective {
        return {
            priority: 1001,
            restrict: "AE",
            require: "?ngModel",
            scope: {
                model: "=ngModel",
                owner: "=ngOwner",
                itemDataType: "=ngDatatype",
                excludeSelected: "=ngExclude"
            },
            link: ($scope: IJbDataPickListScope, $element: JQuery) => {
                if (Common.directiveScopeIsReady($element)) return;
                
                Common.setDirectiveScope($element, $scope);

                const picklistOptions: any = {};
                picklistOptions.fromMasterPage = ($scope as any).fromMasterForm === true; //WARNING: This attribute is not set anywhere...
                picklistOptions.model = $scope.model;
                picklistOptions.owner = ($scope as any).owner;
                picklistOptions.itemDataType = ($scope as any).itemDataType;
                picklistOptions.excludeSelected = ($scope as any).excludeSelected;

                var _initInterval = setInterval(() => {
                    if (Common.getIndexesOfControl($element) == null) return;

                    clearInterval(_initInterval);

                    $scope.pickList = new Widgets.DataPickListControl($element, picklistOptions);                    
                }, 250);

                Common.markDirectiveScopeAsReady($element);
            }
        }
    }

    angular.module("jbDataPickList", [])
        .provider("jbDataPickList", new JbDataPickList())
        .directive("jbDataPickList", ["jbDataPickList", jbDataPickList]);
}
