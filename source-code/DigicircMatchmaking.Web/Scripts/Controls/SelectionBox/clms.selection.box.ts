namespace Joove.Widgets {
    export class SimpleSelectProvider extends BaseAngularProvider {
    }

    export interface ISimpleSelectScope extends IJooveScope {
        selectedItems: typeof undefined[];
        selectedItemKeys: typeof undefined[];
        options: typeof undefined[];
        bindingType: string;
        dataLoaded: boolean;
        requestInitialValueOnly: boolean;
        refreshDataFromServerOnFocus: boolean;
        datesetType: Joove.DataSourceTypes;
        fromMasterForm;
        contextIsReady: () => boolean;
        contextDepth;
        fetchData: (requestInfo: any, attemptNumber: any, cb?: any) => void;
        type: string;
        controlType: SelectionBoxType;
        control: SelectionControl | null;
        itemDataType;
        notNull;
        val;
        txt;
        id: string | number;
        orientation;
        searchEverywhere;
        owner: any;
        dontAddEmptyValue: boolean;
        nullOptionAvailable: boolean;
    }

    export function ngSimpleSelect($timeout: ng.ITimeoutService, $interval: ng.IIntervalService, ngRadio: any): ng.IDirective {
        return {
            priority: 1001,
            require: "?ngModel",
            restrict: "AE",
            scope: {
                val: "=ngVal",
                txt: "=ngTxt",
                model: "=ngModel",
                owner: "=ngOwner",
                datesetType: "=jooveDatesetType",
                type: "=ngType",
                id: "=ngId",
                isSearchable: "=ngSearchable",
                dontAddEmptyValue: "=ngDontallowemptyvalue",
                itemDataType: "=ngDatatype",
                fromMasterForm: "=ngMaster",
                searchEverywhere: "=ngSearchEverywhere",
                orientation: "=ngOrientation",
                contextDepth: "=ngContextDepth",
                notNull: "=ngNotNull"
            },
            link($scope: ISimpleSelectScope, $element: any, $attrs: any, ngModelCtrl: any) {
                if (Common.directiveScopeIsReady($element)) return;
                Common.setDirectiveScope($element, $scope);

                $scope.datesetType = parseInt($scope.datesetType as any);
                $scope.selectedItems = [];
                $scope.controlType = GetSelectionBoxType($scope.type);
                $scope.control = GetControl($scope, $element);
                $scope.selectedItemKeys = [];
                $scope.options = [];
                $scope.bindingType = $element.attr("data-binding-type");
                $scope.dataLoaded = false;
                $scope.requestInitialValueOnly = $scope.bindingType != null && $scope.control.IsManual();
                $scope.refreshDataFromServerOnFocus = false;

                var serverSideElementId = Core.getElementName($element);

                $scope.contextIsReady = () => {
                    if ($scope.contextDepth == null) return true;

                    var indexes = Common.getIndexesOfControl($element).indexes;

                    return indexes != null && indexes.length === $scope.contextDepth;
                };

                $scope.$on("$destroy",
                    () => {
                        var uniqueName = SelectionControl.GetControlUniqueName($scope, $element, $scope.model);

                        let selectedItem = $scope.control.FindOptionObjectByValue($scope.model);

                        if (selectedItem != null) {
                            window[uniqueName] = selectedItem;
                        } else {
                            delete window[uniqueName];
                        }
                    });

                $scope.fetchData = (requestInfo, attemptNumber, cb) => {
                    attemptNumber = attemptNumber || 0;
                    $scope.dataLoaded = false;

                    // if context is ready, request data
                    if ($scope.contextIsReady()) {
                        $timeout(() => {
                            DatasourceManager.fetch($element,
                                serverSideElementId,
                                requestInfo,
                                {
                                    success(datasourceResponse) {
                                        $scope.options = datasourceResponse.Data;
                                        $scope.nullOptionAvailable = false;

                                        if ($scope.control.IsManual()) {
                                            $scope.refreshDataFromServerOnFocus = false;
                                            $scope.dataLoaded = true;
                                            $scope.nullOptionAvailable = $scope.options.filter(o => o._key == null).length > 0;

                                            $scope.control.SetDefaultValue($scope.options.filter(o => o._default)[0]);
                                            RefreshUI(cb, true);
                                            Joove.Logger.debug("$scope.fetchData(Manual)", $scope.options.length);
                                        }
                                        else if ($scope.control.IsViewModelBindend() && DatasourceManager.couldUseFetchViewModelDataseClientSideHandler($element, $scope.fromMasterForm)) {
                                            RefreshUI(cb, true);
                                            Joove.Logger.debug("$scope.fetchData(ViewModel)", $scope.options.length);
                                        }
                                        else {
                                            RefreshUI(cb, false);
                                            Joove.Logger.debug("$scope.fetchData(Dataset)", $scope.options.length);
                                        }
                                    }
                                },
                                [],
                                $scope.fromMasterForm);
                        });
                    }// else allow 500ms for context to bind (10 * 50ms timeout)
                    else if (attemptNumber <= 10) {
                        setTimeout(() => { $scope.fetchData(requestInfo, ++attemptNumber); }, 50);
                    }
                };

                $scope.control.RegisterEventListeners();

                $element.addClass("jb-initialized");

                if ($scope.control.IsManual()) {
                    $scope.fetchData(null, null, () => {
                        RemoveInitialValues(serverSideElementId, $element);
                    });
                }

                $timeout(() => {
                    const oldValue = window[SelectionControl.GetControlUniqueName($scope, $element, $scope.model)];
                    if (oldValue != null) {
                        Joove.Logger.debug(`Retrieve old value(${$element.attr("jb-id")})`);
                        populateOptions([oldValue], true);
                        $scope.control.UpdateSelection($scope.model, true);
                        $scope.refreshDataFromServerOnFocus = true;
                        $scope.requestInitialValueOnly = false;
                        $scope.dataLoaded = true;
                    } else {
                        Joove.Logger.debug(`Initial DS fetch(${$element.attr("jb-id")})`);
                        $scope.fetchData(null, null, () => {
                            RemoveInitialValues(serverSideElementId, $element);
                        });
                    }

                    Joove.Logger.debug(`Register $scope.$watch(${$element.attr("jb-id")})`);
                    $scope.$watch("model", value => {
                        if (value != null) {
                            Joove.Logger.debug("Watch " + $element.attr("jb-id"), value);
                        }
                        $scope.control.UpdateSelection(value);
                    });
                });

                DatasourceManager.watchDependencies(SelectionControl.GetScope($scope),
                    $element,
                    (): void => {
                        Joove.Logger.debug("DatasourceManager.watchDependencies", $element.attr("jb-id"));
                        $scope.fetchData(null,
                            null,
                            () => {
                                $scope.refreshDataFromServerOnFocus = false;
                                RemoveInitialValues(serverSideElementId, $element);
                            });
                    });

                Common.markDirectiveScopeAsReady($element);

                function populateOptions(options: any, force = false): void {
                    if (!force && $scope.dataLoaded === false) return;

                    // Collection is empty, early exit here
                    if (options == null || options.length === 0) {
                        $scope.model = null;
                        $scope.control.ClearOptions(true);

                        SelectionControl.ApplyDefaultSelection($scope, $element);
                        $scope.control.Refresh();
                        return;
                    }

                    $scope.control.PopulateOptions(options);
                }

                function RefreshUI(cb: Function, slowdown: boolean) {
                    if (slowdown) {
                        $timeout(() => { populateOptions($scope.options); });
                        $scope.dataLoaded = true;
                    } else {
                        $scope.dataLoaded = true;
                        populateOptions($scope.options);
                    }
                    cb && cb();
                    Core.applyScope($scope);
                };

                function RemoveInitialValues(name: string, $control: JQuery) {
                    DatasourceManager.removeInitialValue(name, $control)
                }

                function GetManualDatasetOptions(serverSideElementId: string): Array<any> {
                    let dataContainerVariableName = `dataFor${serverSideElementId}`;

                    if ($scope.fromMasterForm === true) {
                        dataContainerVariableName += "Master";
                    }

                    return window[dataContainerVariableName];
                }
            }
        };
    }

    angular
        .module("ngSimpleSelect", [])
        .provider("ngSimpleSelect", new SimpleSelectProvider())
        .directive("ngSimpleSelect", ["$timeout", "$interval", "ngSimpleSelect", ngSimpleSelect]);

    export interface ISelectionControl {
        PopulateOption(val: string, txt: string): { $option: JQuery, $valueHolder: JQuery };
        PopulateOptions(items: Array<any>, clear: boolean): void;
        ClearOptions(redraw: boolean): Promise<boolean>;
        OnChange($valueHolderElement: JQuery): void;
        UpdateSelection(value: any, force: boolean): void;
        UpdateValue(value: any): void;
        UpdateInitialValue(): void;
        Refresh(): void;
        RegisterEventListeners(): void;
        OnValueChanged($valueHolderElement: any): void;
        SetModelValue(value: string | JQuery): void;
        ValueMatchesToAvailableOptions(value: any): boolean;
        IsManual(): boolean;
        IsViewModelBindend(): boolean;
    }

    export abstract class SelectionControl implements ISelectionControl {
        protected defaultText: string;
        protected defaultOption: any;

        constructor(protected readonly $scope: ISimpleSelectScope, protected readonly $element: JQuery) {
            this.defaultText = window._resourcesManager.getComboBoxDefaultText($element, $scope.fromMasterForm);
        }

        abstract Refresh(): void;

        abstract PopulateOption(val: string, txt: string): { $option: JQuery, $valueHolder: JQuery };

        abstract UpdateValue(value: any): void;

        abstract UpdateInitialValue(): void;

        abstract RegisterEventListeners(): void;

        abstract ClearOptions(redraw: boolean): Promise<boolean>;

        public optionElementsToOptionObjects: { [id: string]: any; } = {};

        SetDefaultValue(option: any): void {
            this.defaultOption = option;
        }

        GetDefaultValue(): any {
            return this.defaultOption || "?";
        }

        PopulateOptions(options: Array<any>, clear = true): void {
            if (clear) {
                this.ClearOptions(false);
                this.optionElementsToOptionObjects = {};
            }

            // Create Option Elements
            for (let i = 0; i < options.length; i++) {
                var option = options[i];
                let val = this.GetOptionProperty(option, this.$scope.val);
                let txt = this.GetOptionProperty(option, this.$scope.txt);

                if (option.isDefault) {
                    val = option.value;
                    txt = option.label;
                }

                if (Common.stringIsNullOrEmpty(txt)) {
                    txt = window._resourcesManager.getGlobalResource("RES_SITE_NullValue");
                }

                const $options = this.PopulateOption(val, txt);

                $options.$valueHolder.data("instance", option);
                var optionKey = (new Date().getMilliseconds() + i).toString();
                this.optionElementsToOptionObjects[optionKey] = option;

                if (this.$scope.val === "$this") {
                    if (!option.isDefault && Common.keyHasDefaultValue(option._key)) {
                        $options.$valueHolder.data("value", option);
                        $options.$valueHolder.attr("value", option._clientKey);
                    } else {
                        // Value is the object it self
                        $options.$valueHolder.data("value", option);
                        $options.$valueHolder.attr("value", option._key);
                    }
                } else {
                    // Value is an object's property
                    $options.$valueHolder.data("value", val);
                }
                $options.$valueHolder.attr("jb-option-id", optionKey);

                // Append Element
                this.$element.append($options.$option);

                // Honour Radio Button Orientation
                if (this.$scope.controlType === SelectionBoxType.RadioButton) {
                    this.$element.append(this.$scope.orientation === "HORIZONTAL" ? "&nbsp;&nbsp;&nbsp;" : "<br/>");
                }
            }

            this.$scope.control.Refresh();

            // Trigger selection update
            this.$scope.control.UpdateSelection(this.$scope.model);
        }

        OnChange($valueHolderElement: JQuery) {
            if ($valueHolderElement.length === 0) {
                SelectionControl.UpdateScopeAndModelKeys(this.$scope, this.$element, null, null);
            } else {
                const value = $valueHolderElement.data("value");
                const needsUpdate = value != null && typeof (value._key) != "undefined";
                if (needsUpdate) {
                    Joove.Logger.debug("OnChange-UpdateObject", $valueHolderElement, value);
                    SelectionControl.UpdateObject(this.$scope, this.$element, value, value._key);
                } else {
                    Joove.Logger.debug("OnChange-UpdateScopeAndModelKeys", $valueHolderElement, value);
                    SelectionControl.UpdateScopeAndModelKeys(this.$scope, this.$element, value, value);
                }
            }
        }

        UpdateSelection(value: any, force: boolean = false) {
            if (!force && this.$scope.dataLoaded === false) return;
            
            if (this.UpdateValueMatchesToAvailableOptions(value)) {                                              
                if (this.IsNotNull() && this.IsManual() && this.GetDefaultValue() != null) {
                    this.SetModelValue(this.GetDefaultValue()._key);
                } else if (this.$scope.dontAddEmptyValue) {
                    const firstOptionValue = this.$element.find("option:first").data("value");
                    if (firstOptionValue != null) {
                        this.SetModelValue(firstOptionValue);
                    }
                }
                return;
            }

            this.SetValue(value);

            this.UpdateInitialValue();
        }

        OnValueChanged($valueHolderElement: any): void {
            this.$scope.control.OnChange($valueHolderElement);

            Core.applyScope(SelectionControl.GetScope(this.$scope));

            Joove.Logger.debug("OnValueChanged", $($valueHolderElement).attr('jb-id'));
            if (this.$scope.controlType === SelectionBoxType.Dropdown) {
                SelectionControl.RemoveEmptyOptions(this.$element);
            }
        }

        SetModelValue(value: string | JQuery, selectedItem?: any): void {
            const modelPath = this.$element.attr("ng-model");
            const parts = modelPath.split(".");
            const last = parts[parts.length - 1];

            if (selectedItem != null)
                delete selectedItem.$id; // This ID is used by deserialization on backend side, probably is safe to ignore it.

            var reconstructor = new ReferencesReconstructor();
            reconstructor.addFreshInstance(selectedItem);
            reconstructor.reconstructReferences(Common.getModel());

            if (parts[0] != "model") {
                Core.setBoClassPropertyFromInstance(last, this.$scope.owner, value);
            } else {
                let currentPointer = Common.getModel();
                if (parts.length == 2) {
                    currentPointer[parts[1]] = value;
                } else {
                    parts.forEach((part, index) => {
                        if (index == 0) return;

                        if (index < parts.length - 1) {
                            currentPointer = currentPointer[part];
                        } else {
                            Core.setBoClassPropertyFromInstance(last, currentPointer, value);
                        }
                    });
                }
            }
        }

        IsNotNull(): boolean {
            return SelectionControl.IsNotNull(this.$scope);
        }

        ValueMatchesToAvailableOptions(value: any): boolean {
            return this.FindOptionInstanceByValue(value) != DatasourceManager.NO_VALUE;
        }

        FindOptionInstanceByValue(value: any): any {
            if (value == null) {                
                return this.$scope.nullOptionAvailable === true
                    ? null
                    : DatasourceManager.NO_VALUE;                
            }            

            const searchByKey = typeof (value._key) != "undefined";
            const $options = this.$element.find(".value-holder");

            for (let i = 0; i < $options.length; i++) {
                const $opt = $options.eq(i);
                var currentValue = $opt.data("value");

                if (currentValue == null) continue;

                if (searchByKey) {
                    if (currentValue._key === value._key) return currentValue;
                }
                else {
                    if (Joove.Comparator.IsEqual(currentValue, value, this.$scope.bindingType)) {
                        return currentValue;
                    }
                }
            }

            return DatasourceManager.NO_VALUE;
        }

        FindOptionObjectByValue(value: any): any {
            if (value == null) return DatasourceManager.NO_VALUE;
            const searchByKey = typeof (value._key) != "undefined";
            const $options = this.$element.find(".value-holder");

            for (let i = 0; i < $options.length; i++) {
                const $opt = $options.eq(i);
                var currentOption = this.optionElementsToOptionObjects[$opt.attr("jb-option-id")];
                if (currentOption == null) continue;

                let currentValue = (this.$scope.val === "$this") ? currentOption :
                    this.GetOptionProperty(currentOption, this.$scope.val);
                if (currentValue == null) continue;

                if (currentOption.isDefault) {
                    currentValue = currentOption.value;
                }

                if (searchByKey) {
                    if (currentValue._key === value._key) return currentOption;
                }
                else {
                    if (Joove.Comparator.IsEqual(currentValue, value, this.$scope.bindingType)) {
                        return currentOption;
                    }
                }
            }
            return DatasourceManager.NO_VALUE;
        }

        GetRelativeProperty(prop: string): string {
            return prop.replace("$this.", "").replace("this.", "");
        }

        GetOptionProperty(option: any, prop: string): any {
            const propRelative = this.GetRelativeProperty(prop);

            if (option != null && Common.valueIsPrimitive(option) && prop === "_key") {
                return option;
            }

            const parts = propRelative.split(".");

            let current = option;

            for (let i = 0; i < parts.length; i++) {
                if (parts[i].length == 0) {
                    continue;
                }

                const currentOption = current[parts[i]];

                if (currentOption == null) {
                    return null;
                }

                current = currentOption;
            }

            return current;
        }

        GetDefaultOption(label: string, value: string): any {
            return {
                isDefault: true,
                value,
                label
            };
        }

        HasDefaultOptions(items: any[]): boolean {
            const defaultItem = items.filter((item) => { return item.isDefault; });

            if (defaultItem.length <= 0) return false;

            return items.filter((item) => { return item.isDefault; })[0] != null;
        }

        IsManual(): boolean {
            return this.$scope.datesetType === Joove.DataSourceTypes.MANUAL;
        }

        IsViewModelBindend(): boolean {
            return this.$scope.datesetType === Joove.DataSourceTypes.VIEWMODEL;
        }

        private SetValue(value: any) {
            const val = SelectionControl.GetKey(value);
            Joove.Logger.debug(`SetValue(${this.$element.attr("jb-id")})`);

            const $target = this.$element.find(`[value='${val}']`);
            this.$scope.control.UpdateValue(val);
            
            const selectedInstance = $target.data("instance");
            if (selectedInstance != null) {
                const selectedKey = typeof (selectedInstance._key) == "undefined"
                    ? selectedInstance
                    : selectedInstance._key;

                this.$scope.selectedItems = [selectedInstance];
                this.$scope.selectedItemKeys = [selectedKey];
            }

            SelectionControl.UpdateKeysInModel(this.$scope, this.$element);
        }

        private UpdateValueMatchesToAvailableOptions(value: any): boolean {            
            if (this.$scope.control.ValueMatchesToAvailableOptions(value) === false) {
                
                // When updating data on a dropdown that does not have its full recordset loaded
                // before assigning default value, we must fetch the data first.
                // This is not very good performance wise, but it's a rare case not worth
                // spending resources optimizing it, at least for the moment...
                if (value != null && this.$scope.refreshDataFromServerOnFocus) {
                    // allow DOM creation for 250ms
                    setTimeout(() => {
                        // check again
                        if (this.$scope.control.ValueMatchesToAvailableOptions(value)) return;

                        // if still no match, request data and try to update selection
                        this.$scope.fetchData(null,
                            null,
                            () => {
                                this.$scope.refreshDataFromServerOnFocus = false;
                                this.UpdateSelection(value);
                            });
                    },
                        250);
                }
                else {
                    SelectionControl.ApplyDefaultSelection(this.$scope, this.$element);
                }

                return true;
            }            
            return false;
        }

        static IsNotNull($scope: ISimpleSelectScope): boolean {
            if ($scope.notNull == null)
                return false;

            return $scope.notNull;
        }

        static RemoveEmptyOptions($element: JQuery) {
            setTimeout(() => {
                $element.find("option:not(.value-holder)").remove();
                $element.trigger("select2:updated");
            }, 50);
        }

        static UpdateTitle($element: JQuery, $target: JQuery = null) {
            if ($element == null) return;

            let title = $element.attr('title');
            if (title == null || title.trim() == "") return;

            if ($target == null) {
                $target = $element.next().find("span.selection span.select2-selection span.select2-selection__rendered");
            }

            if ($target == null) return;

            $target.attr('title', title);
        }

        static ApplyDefaultSelection($scope: ISimpleSelectScope, $element: JQuery) {
            SelectionControl.RemoveEmptyOptions($element);
            if ($scope.controlType === SelectionBoxType.Dropdown) {
                const defaultValue = SelectionControl.IsNotNull($scope)
                    ? $scope.control.GetDefaultValue()
                    : $element.children().eq(0).attr("value");

                $element.val(defaultValue);
                $element.trigger("select2:updated");
                //Select2 doesn't always detect the changes in the original select element. The following forces
                //the Select2 text to be refreshed

                let $renderedSelection = $element.next().find("span.selection span.select2-selection span.select2-selection__rendered");

                $renderedSelection.text($element.find("option:selected").text());

            } else {
                $element.find("input").removeAttr("checked");
            }

            $scope.selectedItems = [];
            $scope.selectedItemKeys = [];

            SelectionControl.UpdateKeysInModel($scope, $element);

            return;
        }

        static GetControlUniqueName($scope: ISimpleSelectScope, $element: JQuery, model: any): string {
            let name = `Dropdown_${Common.getIndexesOfControl($element).indexes}_${$element.attr("jb-id")}_${SelectionControl.GetKey(model)}`;
            if ($scope.fromMasterForm === true) {
                name = `Master_${name}`;
            }
            return name;
        }

        static UpdateKeysInModel($scope: ISimpleSelectScope, $element: JQuery): void {
            DatasourceManager.updateSelectedKeysInModel(String($scope.id),
                $scope.selectedItemKeys,
                false,
                Common.getIndexesOfControl($element).indexes,
                $scope.fromMasterForm);
        }

        static UpdateObject($scope: ISimpleSelectScope, $element: JQuery, value: any, key: any): void {
            if (Common.keyHasDefaultValue(key)) {
                SelectionControl.UpdateScopeAndModelKeys($scope, $element, value, value._clientKey);
                return;
            }

            const targetController = $scope.fromMasterForm === true
                ? window._context.currentMasterPageController
                : window._context.currentController;

            if ($scope.control.IsViewModelBindend()) {
                const item = DatasourceManager.fetchItemFromViewModelDataset($element, key, $scope.fromMasterForm);
                SelectionControl.UpdateScopeAndModelKeys($scope, $element, item, key);
                Joove.Logger.debug("UpdateObject: Skip call to server because dropdown consumes ViewModel DS.", value, item, key);
            } else {
                Core.executeControllerActionNew({
                    controller: targetController,
                    action: "UpdateInstance",
                    verb: "POST",
                    queryData: [],
                    postData: { keys: key.toString(), jbID: $element.attr("jb-id"), dataType: Joove.DatasourceManager.getDtoTypeFromControl($element) },
                    cb: data => {                        
                        SelectionControl.UpdateScopeAndModelKeys($scope, $element, Common.modelToJson(data), key);
                    }
                });
            }            
        }

        static UpdateScopeAndModelKeys($scope: ISimpleSelectScope,
            $element: JQuery,
            selectedObject: any,
            selectedKey: any) {
            
            if ($scope.bindingType === "bool") {
                selectedObject = String(selectedObject) === "true";
            }

            if (selectedKey == "?" || (selectedObject != null && selectedObject.isDefault == true && selectedObject.value == "?")) {
                selectedObject = null;
                selectedKey = null;
            }

            $scope.selectedItems = selectedObject == null ? [] : [selectedObject];
            $scope.selectedItemKeys = selectedKey == null ? [] : [selectedKey];
            
            $scope.model = selectedObject;
            SelectionControl.UpdateKeysInModel($scope, $element);

            if ($scope.owner != undefined) {
                $scope.control.SetModelValue(selectedObject, selectedObject);
            }

            SelectionControl.GetScope($scope).$apply();

            DatasourceManager.invokeOnChangeHandler($element);
        }

        static GetScope($scope: ISimpleSelectScope): IJooveScope {
            return $scope.fromMasterForm === true
                ? Common.getMasterScope()
                : Common.getScope();
        }

        static GetKey(value: any): string {
            if (value == null) return null;

            if (typeof (value._key) == "undefined") return value;
            return Common.keyHasDefaultValue(value._key) ? value._clientKey : value._key;
        }
    }

    export class DropdownControl extends SelectionControl {
        PopulateOptions(options: Array<any>, clear = true) {
            // 'Please Select' Option for DropDown
            if (!this.$scope.dontAddEmptyValue) {
                if (!this.IsNotNull() && !this.HasDefaultOptions(options)) {
                    options.unshift(this.GetDefaultOption(this.defaultText, "?"));
                }
            }

            super.PopulateOptions(options, clear);
        }

        PopulateOption(val: string, txt: string): { $option: JQuery, $valueHolder: JQuery } {
            const $option = $(`<option class='value-holder' class='' value='${val}'>${txt}</option>`);
            const $valueHolder = $option;
            return {
                $option,
                $valueHolder
            };
        }

        ClearOptions(redraw): Promise<boolean> {

            return new Promise((resolve, reject) => {
                this.$element.empty();
                const options = (this.IsNotNull()) ? [] : [this.GetDefaultOption(this.defaultText, "?")];

                if (redraw) {
                    this.PopulateOptions(options, false);
                }

                return true;
            });
        }

        OnChange(value: string | JQuery): void {
            super.OnChange(value as JQuery);
        }

        UpdateInitialValue() {
            let $renderedSelection = this.$element.next().find("span.selection span.select2-selection span.select2-selection__rendered");
            
            $renderedSelection.text(this.$element.find("option:selected").text());

            SelectionControl.UpdateTitle(this.$element, $renderedSelection);
        }

        UpdateValue(value: any): void {            
            if (this.$scope.bindingType === "bool") {
                this.$element.val(value.toString());
            }
            else if (this.$scope.nullOptionAvailable === true && value == null) {
                this.$element.val("null");
            }
            else {
                this.$element.val(value);
            }
            SelectionControl.RemoveEmptyOptions(this.$element);
            let $renderedSelection = this.$element.next().find("span.selection span.select2-selection span.select2-selection__rendered");
            SelectionControl.UpdateTitle(this.$element, $renderedSelection);
        }

        Refresh(): void {
            SelectionControl.RemoveEmptyOptions(this.$element);
            if (this.$element.hasClass("select2-enabled")) {
                this.$element.trigger("select2:updated");
                SelectionControl.UpdateTitle(this.$element);
            } else {
                const noDataText =
                    window._resourcesManager.getComboBoxNoDataText(this.$element, this.$scope.fromMasterForm);

                this.$element.addClass("select2-enabled");
                const options = {
                    "language": {
                        "noResults": () => {
                            return noDataText;
                        }
                    },
                    "placeholder": this.defaultText,
                    "minimumResultsForSearch": -1,

                    "width": "100%"
                };

                if (this.$scope.isSearchable) {
                    delete options["minimumResultsForSearch"];
                }

                this.$element.select2(options);

                var $select2Container = this.$element.next();

                //Get the CSS Classes (user-data-classes) from the "select" object of the Container and copy them to the DIV element
                if ($select2Container.length > 0 && $select2Container.context != null) {
                    const userDataClassesString = $select2Container.context.getAttribute("user-data-classes");
                    if (userDataClassesString != null) {
                        for (let i = 0; i < $select2Container.length; i++) {
                            $select2Container[i].className += `  ${userDataClassesString}`;
                        }
                    }
                } /* else if ($chosenContainer.length === 0 && $chosenContainer.context != null
                                //chosen plugin is not supported for mobile browsers so we need to override the default css
                                //visibility value in such cases
                                && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                                $element.attr("style", "visibility: visible !important");
                            }*/

                this.$element.on("select2:updated",
                    () => {
                        var isDisabled = this.$element.is(":disabled");
                        var isReadonly = this.$element.is("[readonly='readonly']");

                        // Make Readonly
                        if (isReadonly || isDisabled) {
                            this.$element.prop("disabled", true);
                        } else {
                            this.$element.prop("disabled", false);
                        }

                        // Transfer classes from original element to select2 container
                        window._themeManager
                            .transferClassesOfStateToOtherElement(this.$element,
                                $select2Container,
                                ThemeManager.States.Required);
                        window._themeManager
                            .transferClassesOfStateToOtherElement(this.$element,
                                $select2Container,
                                ThemeManager.States.Readonly);
                        window._themeManager
                            .transferClassesOfStateToOtherElement(this.$element,
                                $select2Container,
                                ThemeManager.States.Disabled);
                        window._themeManager
                            .transferRemovalOfClassesOfStateToOtherElement(this.$element,
                                $select2Container,
                                ThemeManager.States.RequiredEmpty);

                        SelectionControl.UpdateTitle(this.$element);
                    });

                $select2Container.on("click",
                    (): void => {
                        var $resultsContainer = jQuery("span.select2-container .select2-results ul");
                        if (this.$scope.refreshDataFromServerOnFocus) {
                            $resultsContainer.hide();
                            this.$scope.refreshDataFromServerOnFocus = false;

                            const loadingElement =
                                jQuery(
                                    "<span class='select2-loading-element' style='display: block; text-align:center; padding: 7px;'><i class='glyphicon glyphicon-refresh spin' style='font-size: 20px; opacity: 0.7'></i></span>");
                            jQuery("span.select2-container .select2-results").append(loadingElement);

                            setTimeout(() => {
                                this.$scope.fetchData(null,
                                    null,
                                    () => {
                                        $resultsContainer.show();
                                        jQuery("span.select2-container .select2-results .select2-loading-element")
                                            .remove();
                                        this.$element.select2("close");
                                        setTimeout(() => { this.$element.select2("open"); }, 150);
                                    });
                            },
                                250);
                        }
                    });

                this.$element.trigger("select2:updated");

                // If original element has a hide cf applied, before chosen has been initialized
                // manualy hide it!
                // TODO: add a callback function array to this scope
                // so that we could apply a variety of actions to the chosen container after 
                // its initialization.
                if (this.$element.hasClass("cf-hidden")) {
                    $select2Container.hide();
                }
            }
        }

        RegisterEventListeners(): void {
            this.$element.on("change", () => {
                this.OnValueChanged(this.$element.find(":selected").eq(0));
            });
        }
    }

    export class RadioButtonControl extends SelectionControl {
        Refresh(): void {

        }

        UpdateValue(value: any): void {
            var attributeValue = value;

            if (this.$scope.bindingType === "bool") {
                attributeValue = value.toString();
            }
            else if (this.$scope.nullOptionAvailable === true && value == null) {
                attributeValue = "null";
            }
            const $target = this.$element.find(`[value='${attributeValue}']`);
            
            $target.prop("checked", true);
        }

        UpdateInitialValue() {

        }

        ClearOptions(redraw: boolean): Promise<boolean> {
            return new Promise((resolve, reject) => {
                this.$element.empty();
                return true;
            });
        }

        RegisterEventListeners(): void {
            this.$element.on("click", "[jb-type='OptionButtonEntryContainer']", () => {
                this.OnValueChanged(this.$element.find("input:checked"));
            });
        }

        PopulateOption(val: string, txt: string): { $option: JQuery, $valueHolder: JQuery } {
            const $option = window.$entryContainerTemplate.clone(true);

            if (this.$scope.nullOptionAvailable === true && val == null) {
                val = "null";
            }

            $option.find('[jb-type="OptionButtonEntry"]')
                .addClass("value-holder")
                .attr("name", this.$scope.id + "_" + Common.getIndexesOfControl(this.$element).indexes)
                .attr("value", val)
                .prop("disabled", (this.$element.attr("readonly") != null || this.$element.hasClass("jb-disabled") === true));
            $option.find('[jb-type="OptionButtonEntryCaption"]').text(txt);

            const $valueHolder = $option.find(".value-holder");

            return {
                $option,
                $valueHolder
            }
        }

        PopulateOptions(options: Array<any>, clear = true) {
            const $template = this.$element.find("[jb-type='OptionButtonEntryContainer']").eq(0);
            window.$entryContainerTemplate = $template.clone(true);
            $template.remove();
            super.PopulateOptions(options, clear);
        }

        OnChange(value: string | JQuery): void {
            super.OnChange(value as JQuery);
        }
    }

    export class TypeaheadControl extends SelectionControl {
        private $placeholder: JQuery;

        Refresh(): void {

        }

        UpdateInitialValue() {

        }

        ClearOptions(redraw: boolean): Promise<boolean> {
            return new Promise((resolve, reject) => {
                return true;
            });
        }

        RegisterEventListeners(): void {
            this.$element.bind("typeahead:select", (ev, suggestion) => {
                this.OnValueChanged(TypeaheadControl.GetValue(ev));
            });

            this.$element.on("change", (ev) => {
                this.OnValueChanged(TypeaheadControl.GetValue(ev));
            });
        }

        UpdateValue(value: any): void {
            $(".tt-input", this.$element).val(value);
        }

        PopulateOption(val: string, txt: string): { $option: JQuery, $valueHolder: JQuery } {
            return null;
        }

        PopulateOptions(items: Array<any>, clear: boolean = true) {
            const options = {
                hint: true,
                highlight: true,
                minLength: 1
            };

            const ds = {
                name: "items",
                displayKey: this.GetRelativeProperty(this.$scope.txt),
                source: this.GetDataset(items)
            };

            if (this.$placeholder != null) {
                this.$placeholder.typeahead('destroy');
            }

            this.$placeholder = $(".typeahead", this.$element).typeahead(options, ds);

            this.$scope.control.UpdateSelection(this.$scope.model);
        }

        OnChange(value: string | JQuery): void {
            if (this.$scope.val == "$this") {
                var filterdValues = this.$scope.options.filter(x => x[this.GetRelativeProperty(this.$scope.txt)] === value);
                value = filterdValues.length > 0 ? filterdValues[0] : null;
            }
            this.$scope.model = value;

            if (this.$scope.owner != undefined) {
                this.SetModelValue(value);
            }

            SelectionControl.GetScope(this.$scope).$apply();
        }

        ValueMatchesToAvailableOptions(value: any): boolean {
            if (this.$scope.controlType === SelectionBoxType.Typeahead)
                return true;
            return false;
        }

        static GetValue(ev: Event): string {
            return $(ev.target).typeahead("val") as any;
        }

        private GetDataset(items: Array<any>) {
            const datumTokenizer = Bloodhound.tokenizers
                .obj.whitespace(this.GetRelativeProperty(this.$scope.txt));

            const engine = new Bloodhound({
                initialize: true,
                identify: this.GetDatasetKey,
                dupDetector: this.Equals,
                datumTokenizer: datumTokenizer,
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                local: items
            });

            return engine;
        }

        private Equals(a: any, b: any): boolean {
            return a._key === b._key;
        }

        private GetDatasetKey(item: any): string {
            if (item == null) return null;
            return item._key;
        }

        private IsObject(): boolean {
            //console.log(this.$scope.itemDataType);
            //console.log(this.IsManual());
            return true;
        }

        private PrepareItems(items: Array<any>): Array<string> {
            const parsedItems = [];
            for (let i = 0; i < items.length; i++) {
                const item = items[i];

                if (item != null && Common.valueIsPrimitive(item)) {
                    parsedItems.push(item);
                }
                else {
                    parsedItems.push(this.GetOptionProperty(item, this.$scope.val));
                }
            }
            return parsedItems;
        }
    }

    export enum SelectionBoxType {
        Dropdown,
        RadioButton,
        Typeahead
    }

    export function GetSelectionBoxType(type: string) {
        switch (type) {
            case "SELECT":
                return SelectionBoxType.Dropdown;
            case "RADIO":
                return SelectionBoxType.RadioButton;
            case "TYPEAHEAD":
                return SelectionBoxType.Typeahead;
            default:
                return SelectionBoxType.Dropdown;
        }
    }

    export function GetControl($scope: ISimpleSelectScope, $element: any): SelectionControl | null {
        switch ($scope.controlType) {
            case SelectionBoxType.Dropdown:
                return new DropdownControl($scope, $element);
            case SelectionBoxType.Typeahead:
                return new TypeaheadControl($scope, $element);
            case SelectionBoxType.RadioButton:
                return new RadioButtonControl($scope, $element);
            default:
                return null;
        }
    }
}

interface JQuery {
    typeahead(options?: any, data?: any): JQuery;
    bind(event: string, onFire: Function);
    select2(options?: any): JQuery;
}

declare let Bloodhound: any;