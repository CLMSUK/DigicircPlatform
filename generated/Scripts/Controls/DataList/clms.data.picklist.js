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
        var JbDataPickList = /** @class */ (function (_super) {
            __extends(JbDataPickList, _super);
            function JbDataPickList() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return JbDataPickList;
        }(Joove.BaseAngularProvider));
        var DataPickListControl = /** @class */ (function () {
            function DataPickListControl(element, options) {
                this.$element = element;
                this.$clearAllButton = this.$element.next(".picklist-clear-selection-button");
                this.options = $.extend(this.options, options);
                var indexes = Joove.Common.getIndexesOfControl(this.$element);
                //Initialize paramenters
                var elementId = this.$element.attr("jb-id");
                this.popupName = this.$element.attr("jb-id") + indexes.key;
                //Add reference to dictionary
                Widgets.DataPickListControl.instancesDic[elementId + indexes.key] = this;
                //Configure PickList events
                this.configureEvents();
            }
            Object.defineProperty(DataPickListControl.prototype, "isBoundToRoot", {
                get: function () {
                    return this.$element.attr("ng-owner") === "model";
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(DataPickListControl.prototype, "selectedItemKeys", {
                get: function () {
                    var directiveScope = Joove.Common.getDirectiveScope(this.$element);
                    return Joove.DatasourceManager.getKeys(directiveScope.model);
                },
                enumerable: false,
                configurable: true
            });
            DataPickListControl.prototype.initializePickList = function () {
                if (this.$element.attr("initialized") == "true")
                    return;
                var elementID = this.$element.attr("jb-id");
                var $table = this.$element.parent().find("[jb-id='" + elementID + "_PickList']");
                var dtScope = Joove.Common.getDirectiveScope($table);
                var indexes = Joove.Common.getIndexesOfControl(this.$element);
                var uniqueId = Joove.Common.createRandomId(8);
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
            };
            DataPickListControl.prototype.configurePopUp = function () {
                var _this = this;
                //Clear any previous popup instance with the same name
                window._popUpManager.destroyPopUp(this.popupName);
                //Register a new one
                window._popUpManager.registerPopUp({
                    name: this.popupName,
                    width: "90%",
                    height: "80%",
                    cancelButton: true,
                    okButton: true,
                    okCallback: function () { _this.okCallback(); },
                    title: window._resourcesManager.getPickListModalTitle(this.$element, this.options.fromMasterPage),
                    $elementContent: this.dataList.$wrapperElement,
                    closeCallback: function () { _this.closeCallback(); }
                });
                //Attach a handler to close on Esc
                $(document).keyup(function (e) {
                    if (e.which === 27) {
                        window._popUpManager.hidePopUp(_this.popupName);
                    }
                });
            };
            DataPickListControl.prototype.configureEvents = function () {
                var _this = this;
                this.$element.on("click", function () {
                    _this.initializePickList();
                    //Add this class to hide previously loaded content until the draw() command finishes
                    _this.dataList.$wrapperElement.addClass("hide-content");
                    //If exclude selected keys is on, clear the selected items in the datalist control and set
                    //as excluded the selected items in this control
                    if (_this.options.excludeSelected) {
                        _this.dataList.status.allKeysSelected = false;
                        _this.dataList.status.selectedKeys = [];
                        _this.dataList.status.selectedItems = [];
                        _this.dataList.status.excludedKeys = _this.selectedItemKeys;
                        _this.dataList.dataTableInstance.rows().deselect();
                    }
                    else {
                        //...else update the selected keys
                        _this.dataList.setSelectedItemKeys(_this.selectedItemKeys);
                    }
                    //Hide all picklist actions
                    _this.dataList.$wrapperElement.find(".actions button").hide();
                    //Set the callback to be executed after the first opening in the popup windown 
                    _this.dataList.drawCallbackExtraFunctionality = function () {
                        //Display the refreshed content
                        _this.dataList.$wrapperElement.removeClass("hide-content");
                        //Refresh the picklist button visibility state based on the newly loaded content
                        _this.dataList.updateActionButtonVisibility();
                        //Remove this callback from being executed on every datatables draw event
                        _this.dataList.drawCallbackExtraFunctionality = null;
                    };
                    //Display the picklist on the popup manager
                    window._popUpManager.showPopUp(_this.popupName);
                    //Refresh the content
                    _this.dataList.dataTableInstance.draw();
                    //Adjust the datalist size to the popup window
                    _this.dataList.updateDataTableSize();
                });
                this.$clearAllButton.on("click", function () {
                    var self = _this;
                    window._popUpManager.question(window._resourcesManager.getPicklistClearConfirmation(), "", function (confirm) {
                        if (confirm == false)
                            return;
                        self.initializePickList();
                        self.dataList.deselectAll();
                        self.okCallback(true);
                    });
                });
            };
            DataPickListControl.prototype.okCallback = function (forClearSelectionButton) {
                var _this = this;
                /* NOTE: Before we proceed we must request from server the selected items again in order get
                 *       every property and collection that was not present in the DataList control to avoid
                 *       inconsistencies with the model. The only case this is not required is when the
                 *       allKeysSelected in the DataList is true.
                 */
                if (!this.dataList.status.allKeysSelected) {
                    var directiveScope = Joove.Common.getDirectiveScope(this.dataList.$scopeElement);
                    var selectedItemKeys = this.dataList.status.selectedItems.map(function (item) { return item._key; });
                    //If we have selected items that are not present in the selected items collection
                    //and exlude selected option is enabled, add add them to the keys to be requested
                    if (forClearSelectionButton !== true &&
                        this.selectedItems == undefined &&
                        this.options.excludeSelected &&
                        this.selectedItemKeys.length > 0 &&
                        this.dataList.options.hasMultiSelect) {
                        selectedItemKeys = this.selectedItemKeys.concat(selectedItemKeys);
                    }
                    var type = Joove.DatasourceManager.getDatasetType(this.$element);
                    if (type == Joove.DataSourceTypes.VIEWMODEL) {
                        var selectedItemsData = Joove.DatasourceManager.fetchItemsFromViewModelDataset(this.$element, selectedItemKeys, false);
                        this.dataList.status.selectedItems = selectedItemsData;
                        this.dataList.updateDirectiveScopeAndModel(false);
                        this.handleSelectedItems(forClearSelectionButton);
                    }
                    else {
                        //Show loading panel
                        this.dataList.$loadingPanel.show();
                        //Request again every item from server
                        Joove.DatasourceManager.requestSelectedItemsfromServer(this.dataList.serversideElementId, this.dataList.$scopeElement, directiveScope.itemDataType, this.dataList.status.allKeysSelected, selectedItemKeys, this.dataList.status.excludedKeys, this.dataList.prepareDatasourceRequestInfo(), function (selectedItemsData) {
                            //Hide the loading panel
                            _this.dataList.$loadingPanel.hide();
                            //Ensure we always handle an array
                            if (!Joove.Common.isArray(selectedItemsData)) {
                                selectedItemsData = [selectedItemsData];
                            }
                            _this.dataList.status.selectedItems = selectedItemsData;
                            _this.dataList.updateDirectiveScopeAndModel(false); //Avoid refreshLogic execution since it's triggered later
                            //Proceed using updated selected items
                            _this.handleSelectedItems(forClearSelectionButton);
                        });
                    }
                }
                else {
                    //No need to update the selected items
                    this.handleSelectedItems(forClearSelectionButton);
                }
            };
            DataPickListControl.prototype.closeCallback = function () {
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
            };
            DataPickListControl.prototype.handleSelectedItems = function (forClearSelectionButton) {
                //Trigger the onchange event of the list
                Joove.DatasourceManager.invokeOnChangeHandler(this.$element);
                var dtoTypeName = this.$element.attr("jb-client-dto");
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
                var dtoType = window[window._context.appName]["ViewModels"][window._context.currentController][dtoTypeName];
                if (dtoType == null) {
                    this.handleError("PICKLIST ERROR: Couldn't find DTO type: " + dtoTypeName);
                }
                for (var i = 0; i < this.dataList.status.selectedItems.length; i++) {
                    if (dtoType != null) {
                        this.selectedItems.push(dtoType._initializeFrom(this.dataList.status.selectedItems[i]));
                    }
                    else {
                        this.selectedItems.push(this.dataList.status.selectedItems[i]);
                    }
                }
                this.updateModel();
            };
            DataPickListControl.prototype.updateModel = function () {
                var directiveScope = Joove.Common.getDirectiveScope(this.$element);
                //If the picklist doesn't have multi-selection enabled the first item is chosen
                directiveScope.model = this.dataList.options.hasMultiSelect ? this.selectedItems : this.selectedItems[0];
                if (this.options.owner != undefined) {
                    var modelPath = this.$element.attr("ng-model");
                    var parts = modelPath.split(".");
                    var last = parts[parts.length - 1];
                    if (this.isBoundToRoot) {
                        this.options.owner[last] = directiveScope.model;
                    }
                    else {
                        Joove.Core.setBoClassPropertyFromInstance(last, this.options.owner, directiveScope.model);
                    }
                }
                var scope = this.options.fromMasterPage ? Joove.Common.getMasterScope() : directiveScope;
                /*TODO: Dehydrate messes up the updated model and discards the applied changes
                 *      Re-check to ensure that no side-effect is caused by not running it
                 */
                Joove.Core.applyScope(scope);
                //Refresh conditinal formatting and calculated expressions
                window.$refreshLogic();
            };
            DataPickListControl.prototype.handleError = function (error) {
                //TODO: Handle errors in a more sophisticated way :P
                console.log(error);
            };
            DataPickListControl.instancesDic = {};
            return DataPickListControl;
        }());
        Widgets.DataPickListControl = DataPickListControl;
        function jbDataPickList(jbDataPickList) {
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
                link: function ($scope, $element) {
                    if (Joove.Common.directiveScopeIsReady($element))
                        return;
                    Joove.Common.setDirectiveScope($element, $scope);
                    var picklistOptions = {};
                    picklistOptions.fromMasterPage = $scope.fromMasterForm === true; //WARNING: This attribute is not set anywhere...
                    picklistOptions.model = $scope.model;
                    picklistOptions.owner = $scope.owner;
                    picklistOptions.itemDataType = $scope.itemDataType;
                    picklistOptions.excludeSelected = $scope.excludeSelected;
                    var _initInterval = setInterval(function () {
                        if (Joove.Common.getIndexesOfControl($element) == null)
                            return;
                        clearInterval(_initInterval);
                        $scope.pickList = new Widgets.DataPickListControl($element, picklistOptions);
                    }, 250);
                    Joove.Common.markDirectiveScopeAsReady($element);
                }
            };
        }
        angular.module("jbDataPickList", [])
            .provider("jbDataPickList", new JbDataPickList())
            .directive("jbDataPickList", ["jbDataPickList", jbDataPickList]);
    })(Widgets = Joove.Widgets || (Joove.Widgets = {}));
})(Joove || (Joove = {}));
