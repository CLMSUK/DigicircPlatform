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
        var SimpleSelectProvider = /** @class */ (function (_super) {
            __extends(SimpleSelectProvider, _super);
            function SimpleSelectProvider() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SimpleSelectProvider;
        }(Joove.BaseAngularProvider));
        Widgets.SimpleSelectProvider = SimpleSelectProvider;
        function ngSimpleSelect($timeout, $interval, ngRadio) {
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
                link: function ($scope, $element, $attrs, ngModelCtrl) {
                    if (Joove.Common.directiveScopeIsReady($element))
                        return;
                    Joove.Common.setDirectiveScope($element, $scope);
                    $scope.datesetType = parseInt($scope.datesetType);
                    $scope.selectedItems = [];
                    $scope.controlType = GetSelectionBoxType($scope.type);
                    $scope.control = GetControl($scope, $element);
                    $scope.selectedItemKeys = [];
                    $scope.options = [];
                    $scope.bindingType = $element.attr("data-binding-type");
                    $scope.dataLoaded = false;
                    $scope.requestInitialValueOnly = $scope.bindingType != null && $scope.control.IsManual();
                    $scope.refreshDataFromServerOnFocus = false;
                    var serverSideElementId = Joove.Core.getElementName($element);
                    $scope.contextIsReady = function () {
                        if ($scope.contextDepth == null)
                            return true;
                        var indexes = Joove.Common.getIndexesOfControl($element).indexes;
                        return indexes != null && indexes.length === $scope.contextDepth;
                    };
                    $scope.$on("$destroy", function () {
                        var uniqueName = SelectionControl.GetControlUniqueName($scope, $element, $scope.model);
                        var selectedItem = $scope.control.FindOptionObjectByValue($scope.model);
                        if (selectedItem != null) {
                            window[uniqueName] = selectedItem;
                        }
                        else {
                            delete window[uniqueName];
                        }
                    });
                    $scope.fetchData = function (requestInfo, attemptNumber, cb) {
                        attemptNumber = attemptNumber || 0;
                        $scope.dataLoaded = false;
                        // if context is ready, request data
                        if ($scope.contextIsReady()) {
                            $timeout(function () {
                                Joove.DatasourceManager.fetch($element, serverSideElementId, requestInfo, {
                                    success: function (datasourceResponse) {
                                        $scope.options = datasourceResponse.Data;
                                        $scope.nullOptionAvailable = false;
                                        if ($scope.control.IsManual()) {
                                            $scope.refreshDataFromServerOnFocus = false;
                                            $scope.dataLoaded = true;
                                            $scope.nullOptionAvailable = $scope.options.filter(function (o) { return o._key == null; }).length > 0;
                                            $scope.control.SetDefaultValue($scope.options.filter(function (o) { return o._default; })[0]);
                                            RefreshUI(cb, true);
                                            Joove.Logger.debug("$scope.fetchData(Manual)", $scope.options.length);
                                        }
                                        else if ($scope.control.IsViewModelBindend() && Joove.DatasourceManager.couldUseFetchViewModelDataseClientSideHandler($element, $scope.fromMasterForm)) {
                                            RefreshUI(cb, true);
                                            Joove.Logger.debug("$scope.fetchData(ViewModel)", $scope.options.length);
                                        }
                                        else {
                                            RefreshUI(cb, false);
                                            Joove.Logger.debug("$scope.fetchData(Dataset)", $scope.options.length);
                                        }
                                    }
                                }, [], $scope.fromMasterForm);
                            });
                        } // else allow 500ms for context to bind (10 * 50ms timeout)
                        else if (attemptNumber <= 10) {
                            setTimeout(function () { $scope.fetchData(requestInfo, ++attemptNumber); }, 50);
                        }
                    };
                    $scope.control.RegisterEventListeners();
                    $element.addClass("jb-initialized");
                    if ($scope.control.IsManual()) {
                        $scope.fetchData(null, null, function () {
                            RemoveInitialValues(serverSideElementId, $element);
                        });
                    }
                    $timeout(function () {
                        var oldValue = window[SelectionControl.GetControlUniqueName($scope, $element, $scope.model)];
                        if (oldValue != null) {
                            Joove.Logger.debug("Retrieve old value(" + $element.attr("jb-id") + ")");
                            populateOptions([oldValue], true);
                            $scope.control.UpdateSelection($scope.model, true);
                            $scope.refreshDataFromServerOnFocus = true;
                            $scope.requestInitialValueOnly = false;
                            $scope.dataLoaded = true;
                        }
                        else {
                            Joove.Logger.debug("Initial DS fetch(" + $element.attr("jb-id") + ")");
                            $scope.fetchData(null, null, function () {
                                RemoveInitialValues(serverSideElementId, $element);
                            });
                        }
                        Joove.Logger.debug("Register $scope.$watch(" + $element.attr("jb-id") + ")");
                        $scope.$watch("model", function (value) {
                            if (value != null) {
                                Joove.Logger.debug("Watch " + $element.attr("jb-id"), value);
                            }
                            $scope.control.UpdateSelection(value);
                        });
                    });
                    Joove.DatasourceManager.watchDependencies(SelectionControl.GetScope($scope), $element, function () {
                        Joove.Logger.debug("DatasourceManager.watchDependencies", $element.attr("jb-id"));
                        $scope.fetchData(null, null, function () {
                            $scope.refreshDataFromServerOnFocus = false;
                            RemoveInitialValues(serverSideElementId, $element);
                        });
                    });
                    Joove.Common.markDirectiveScopeAsReady($element);
                    function populateOptions(options, force) {
                        if (force === void 0) { force = false; }
                        if (!force && $scope.dataLoaded === false)
                            return;
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
                    function RefreshUI(cb, slowdown) {
                        if (slowdown) {
                            $timeout(function () { populateOptions($scope.options); });
                            $scope.dataLoaded = true;
                        }
                        else {
                            $scope.dataLoaded = true;
                            populateOptions($scope.options);
                        }
                        cb && cb();
                        Joove.Core.applyScope($scope);
                    }
                    ;
                    function RemoveInitialValues(name, $control) {
                        Joove.DatasourceManager.removeInitialValue(name, $control);
                    }
                    function GetManualDatasetOptions(serverSideElementId) {
                        var dataContainerVariableName = "dataFor" + serverSideElementId;
                        if ($scope.fromMasterForm === true) {
                            dataContainerVariableName += "Master";
                        }
                        return window[dataContainerVariableName];
                    }
                }
            };
        }
        Widgets.ngSimpleSelect = ngSimpleSelect;
        angular
            .module("ngSimpleSelect", [])
            .provider("ngSimpleSelect", new SimpleSelectProvider())
            .directive("ngSimpleSelect", ["$timeout", "$interval", "ngSimpleSelect", ngSimpleSelect]);
        var SelectionControl = /** @class */ (function () {
            function SelectionControl($scope, $element) {
                this.$scope = $scope;
                this.$element = $element;
                this.optionElementsToOptionObjects = {};
                this.defaultText = window._resourcesManager.getComboBoxDefaultText($element, $scope.fromMasterForm);
            }
            SelectionControl.prototype.SetDefaultValue = function (option) {
                this.defaultOption = option;
            };
            SelectionControl.prototype.GetDefaultValue = function () {
                return this.defaultOption || "?";
            };
            SelectionControl.prototype.PopulateOptions = function (options, clear) {
                if (clear === void 0) { clear = true; }
                if (clear) {
                    this.ClearOptions(false);
                    this.optionElementsToOptionObjects = {};
                }
                // Create Option Elements
                for (var i = 0; i < options.length; i++) {
                    var option = options[i];
                    var val = this.GetOptionProperty(option, this.$scope.val);
                    var txt = this.GetOptionProperty(option, this.$scope.txt);
                    if (option.isDefault) {
                        val = option.value;
                        txt = option.label;
                    }
                    if (Joove.Common.stringIsNullOrEmpty(txt)) {
                        txt = window._resourcesManager.getGlobalResource("RES_SITE_NullValue");
                    }
                    var $options = this.PopulateOption(val, txt);
                    $options.$valueHolder.data("instance", option);
                    var optionKey = (new Date().getMilliseconds() + i).toString();
                    this.optionElementsToOptionObjects[optionKey] = option;
                    if (this.$scope.val === "$this") {
                        if (!option.isDefault && Joove.Common.keyHasDefaultValue(option._key)) {
                            $options.$valueHolder.data("value", option);
                            $options.$valueHolder.attr("value", option._clientKey);
                        }
                        else {
                            // Value is the object it self
                            $options.$valueHolder.data("value", option);
                            $options.$valueHolder.attr("value", option._key);
                        }
                    }
                    else {
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
            };
            SelectionControl.prototype.OnChange = function ($valueHolderElement) {
                if ($valueHolderElement.length === 0) {
                    SelectionControl.UpdateScopeAndModelKeys(this.$scope, this.$element, null, null);
                }
                else {
                    var value = $valueHolderElement.data("value");
                    var needsUpdate = value != null && typeof (value._key) != "undefined";
                    if (needsUpdate) {
                        Joove.Logger.debug("OnChange-UpdateObject", $valueHolderElement, value);
                        SelectionControl.UpdateObject(this.$scope, this.$element, value, value._key);
                    }
                    else {
                        Joove.Logger.debug("OnChange-UpdateScopeAndModelKeys", $valueHolderElement, value);
                        SelectionControl.UpdateScopeAndModelKeys(this.$scope, this.$element, value, value);
                    }
                }
            };
            SelectionControl.prototype.UpdateSelection = function (value, force) {
                if (force === void 0) { force = false; }
                if (!force && this.$scope.dataLoaded === false)
                    return;
                if (this.UpdateValueMatchesToAvailableOptions(value)) {
                    if (this.IsNotNull() && this.IsManual() && this.GetDefaultValue() != null) {
                        this.SetModelValue(this.GetDefaultValue()._key);
                    }
                    else if (this.$scope.dontAddEmptyValue) {
                        var firstOptionValue = this.$element.find("option:first").data("value");
                        if (firstOptionValue != null) {
                            this.SetModelValue(firstOptionValue);
                        }
                    }
                    return;
                }
                this.SetValue(value);
                this.UpdateInitialValue();
            };
            SelectionControl.prototype.OnValueChanged = function ($valueHolderElement) {
                this.$scope.control.OnChange($valueHolderElement);
                Joove.Core.applyScope(SelectionControl.GetScope(this.$scope));
                Joove.Logger.debug("OnValueChanged", $($valueHolderElement).attr('jb-id'));
                if (this.$scope.controlType === SelectionBoxType.Dropdown) {
                    SelectionControl.RemoveEmptyOptions(this.$element);
                }
            };
            SelectionControl.prototype.SetModelValue = function (value, selectedItem) {
                var modelPath = this.$element.attr("ng-model");
                var parts = modelPath.split(".");
                var last = parts[parts.length - 1];
                if (selectedItem != null)
                    delete selectedItem.$id; // This ID is used by deserialization on backend side, probably is safe to ignore it.
                var reconstructor = new Joove.ReferencesReconstructor();
                reconstructor.addFreshInstance(selectedItem);
                reconstructor.reconstructReferences(Joove.Common.getModel());
                if (parts[0] != "model") {
                    Joove.Core.setBoClassPropertyFromInstance(last, this.$scope.owner, value);
                }
                else {
                    var currentPointer_1 = Joove.Common.getModel();
                    if (parts.length == 2) {
                        currentPointer_1[parts[1]] = value;
                    }
                    else {
                        parts.forEach(function (part, index) {
                            if (index == 0)
                                return;
                            if (index < parts.length - 1) {
                                currentPointer_1 = currentPointer_1[part];
                            }
                            else {
                                Joove.Core.setBoClassPropertyFromInstance(last, currentPointer_1, value);
                            }
                        });
                    }
                }
            };
            SelectionControl.prototype.IsNotNull = function () {
                return SelectionControl.IsNotNull(this.$scope);
            };
            SelectionControl.prototype.ValueMatchesToAvailableOptions = function (value) {
                return this.FindOptionInstanceByValue(value) != Joove.DatasourceManager.NO_VALUE;
            };
            SelectionControl.prototype.FindOptionInstanceByValue = function (value) {
                if (value == null) {
                    return this.$scope.nullOptionAvailable === true
                        ? null
                        : Joove.DatasourceManager.NO_VALUE;
                }
                var searchByKey = typeof (value._key) != "undefined";
                var $options = this.$element.find(".value-holder");
                for (var i = 0; i < $options.length; i++) {
                    var $opt = $options.eq(i);
                    var currentValue = $opt.data("value");
                    if (currentValue == null)
                        continue;
                    if (searchByKey) {
                        if (currentValue._key === value._key)
                            return currentValue;
                    }
                    else {
                        if (Joove.Comparator.IsEqual(currentValue, value, this.$scope.bindingType)) {
                            return currentValue;
                        }
                    }
                }
                return Joove.DatasourceManager.NO_VALUE;
            };
            SelectionControl.prototype.FindOptionObjectByValue = function (value) {
                if (value == null)
                    return Joove.DatasourceManager.NO_VALUE;
                var searchByKey = typeof (value._key) != "undefined";
                var $options = this.$element.find(".value-holder");
                for (var i = 0; i < $options.length; i++) {
                    var $opt = $options.eq(i);
                    var currentOption = this.optionElementsToOptionObjects[$opt.attr("jb-option-id")];
                    if (currentOption == null)
                        continue;
                    var currentValue = (this.$scope.val === "$this") ? currentOption :
                        this.GetOptionProperty(currentOption, this.$scope.val);
                    if (currentValue == null)
                        continue;
                    if (currentOption.isDefault) {
                        currentValue = currentOption.value;
                    }
                    if (searchByKey) {
                        if (currentValue._key === value._key)
                            return currentOption;
                    }
                    else {
                        if (Joove.Comparator.IsEqual(currentValue, value, this.$scope.bindingType)) {
                            return currentOption;
                        }
                    }
                }
                return Joove.DatasourceManager.NO_VALUE;
            };
            SelectionControl.prototype.GetRelativeProperty = function (prop) {
                return prop.replace("$this.", "").replace("this.", "");
            };
            SelectionControl.prototype.GetOptionProperty = function (option, prop) {
                var propRelative = this.GetRelativeProperty(prop);
                if (option != null && Joove.Common.valueIsPrimitive(option) && prop === "_key") {
                    return option;
                }
                var parts = propRelative.split(".");
                var current = option;
                for (var i = 0; i < parts.length; i++) {
                    if (parts[i].length == 0) {
                        continue;
                    }
                    var currentOption = current[parts[i]];
                    if (currentOption == null) {
                        return null;
                    }
                    current = currentOption;
                }
                return current;
            };
            SelectionControl.prototype.GetDefaultOption = function (label, value) {
                return {
                    isDefault: true,
                    value: value,
                    label: label
                };
            };
            SelectionControl.prototype.HasDefaultOptions = function (items) {
                var defaultItem = items.filter(function (item) { return item.isDefault; });
                if (defaultItem.length <= 0)
                    return false;
                return items.filter(function (item) { return item.isDefault; })[0] != null;
            };
            SelectionControl.prototype.IsManual = function () {
                return this.$scope.datesetType === Joove.DataSourceTypes.MANUAL;
            };
            SelectionControl.prototype.IsViewModelBindend = function () {
                return this.$scope.datesetType === Joove.DataSourceTypes.VIEWMODEL;
            };
            SelectionControl.prototype.SetValue = function (value) {
                var val = SelectionControl.GetKey(value);
                Joove.Logger.debug("SetValue(" + this.$element.attr("jb-id") + ")");
                var $target = this.$element.find("[value='" + val + "']");
                this.$scope.control.UpdateValue(val);
                var selectedInstance = $target.data("instance");
                if (selectedInstance != null) {
                    var selectedKey = typeof (selectedInstance._key) == "undefined"
                        ? selectedInstance
                        : selectedInstance._key;
                    this.$scope.selectedItems = [selectedInstance];
                    this.$scope.selectedItemKeys = [selectedKey];
                }
                SelectionControl.UpdateKeysInModel(this.$scope, this.$element);
            };
            SelectionControl.prototype.UpdateValueMatchesToAvailableOptions = function (value) {
                var _this = this;
                if (this.$scope.control.ValueMatchesToAvailableOptions(value) === false) {
                    // When updating data on a dropdown that does not have its full recordset loaded
                    // before assigning default value, we must fetch the data first.
                    // This is not very good performance wise, but it's a rare case not worth
                    // spending resources optimizing it, at least for the moment...
                    if (value != null && this.$scope.refreshDataFromServerOnFocus) {
                        // allow DOM creation for 250ms
                        setTimeout(function () {
                            // check again
                            if (_this.$scope.control.ValueMatchesToAvailableOptions(value))
                                return;
                            // if still no match, request data and try to update selection
                            _this.$scope.fetchData(null, null, function () {
                                _this.$scope.refreshDataFromServerOnFocus = false;
                                _this.UpdateSelection(value);
                            });
                        }, 250);
                    }
                    else {
                        SelectionControl.ApplyDefaultSelection(this.$scope, this.$element);
                    }
                    return true;
                }
                return false;
            };
            SelectionControl.IsNotNull = function ($scope) {
                if ($scope.notNull == null)
                    return false;
                return $scope.notNull;
            };
            SelectionControl.RemoveEmptyOptions = function ($element) {
                setTimeout(function () {
                    $element.find("option:not(.value-holder)").remove();
                    $element.trigger("select2:updated");
                }, 50);
            };
            SelectionControl.UpdateTitle = function ($element, $target) {
                if ($target === void 0) { $target = null; }
                if ($element == null)
                    return;
                var title = $element.attr('title');
                if (title == null || title.trim() == "")
                    return;
                if ($target == null) {
                    $target = $element.next().find("span.selection span.select2-selection span.select2-selection__rendered");
                }
                if ($target == null)
                    return;
                $target.attr('title', title);
            };
            SelectionControl.ApplyDefaultSelection = function ($scope, $element) {
                SelectionControl.RemoveEmptyOptions($element);
                if ($scope.controlType === SelectionBoxType.Dropdown) {
                    var defaultValue = SelectionControl.IsNotNull($scope)
                        ? $scope.control.GetDefaultValue()
                        : $element.children().eq(0).attr("value");
                    $element.val(defaultValue);
                    $element.trigger("select2:updated");
                    //Select2 doesn't always detect the changes in the original select element. The following forces
                    //the Select2 text to be refreshed
                    var $renderedSelection = $element.next().find("span.selection span.select2-selection span.select2-selection__rendered");
                    $renderedSelection.text($element.find("option:selected").text());
                }
                else {
                    $element.find("input").removeAttr("checked");
                }
                $scope.selectedItems = [];
                $scope.selectedItemKeys = [];
                SelectionControl.UpdateKeysInModel($scope, $element);
                return;
            };
            SelectionControl.GetControlUniqueName = function ($scope, $element, model) {
                var name = "Dropdown_" + Joove.Common.getIndexesOfControl($element).indexes + "_" + $element.attr("jb-id") + "_" + SelectionControl.GetKey(model);
                if ($scope.fromMasterForm === true) {
                    name = "Master_" + name;
                }
                return name;
            };
            SelectionControl.UpdateKeysInModel = function ($scope, $element) {
                Joove.DatasourceManager.updateSelectedKeysInModel(String($scope.id), $scope.selectedItemKeys, false, Joove.Common.getIndexesOfControl($element).indexes, $scope.fromMasterForm);
            };
            SelectionControl.UpdateObject = function ($scope, $element, value, key) {
                if (Joove.Common.keyHasDefaultValue(key)) {
                    SelectionControl.UpdateScopeAndModelKeys($scope, $element, value, value._clientKey);
                    return;
                }
                var targetController = $scope.fromMasterForm === true
                    ? window._context.currentMasterPageController
                    : window._context.currentController;
                if ($scope.control.IsViewModelBindend()) {
                    var item = Joove.DatasourceManager.fetchItemFromViewModelDataset($element, key, $scope.fromMasterForm);
                    SelectionControl.UpdateScopeAndModelKeys($scope, $element, item, key);
                    Joove.Logger.debug("UpdateObject: Skip call to server because dropdown consumes ViewModel DS.", value, item, key);
                }
                else {
                    Joove.Core.executeControllerActionNew({
                        controller: targetController,
                        action: "UpdateInstance",
                        verb: "POST",
                        queryData: [],
                        postData: { keys: key.toString(), jbID: $element.attr("jb-id"), dataType: Joove.DatasourceManager.getDtoTypeFromControl($element) },
                        cb: function (data) {
                            SelectionControl.UpdateScopeAndModelKeys($scope, $element, Joove.Common.modelToJson(data), key);
                        }
                    });
                }
            };
            SelectionControl.UpdateScopeAndModelKeys = function ($scope, $element, selectedObject, selectedKey) {
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
                Joove.DatasourceManager.invokeOnChangeHandler($element);
            };
            SelectionControl.GetScope = function ($scope) {
                return $scope.fromMasterForm === true
                    ? Joove.Common.getMasterScope()
                    : Joove.Common.getScope();
            };
            SelectionControl.GetKey = function (value) {
                if (value == null)
                    return null;
                if (typeof (value._key) == "undefined")
                    return value;
                return Joove.Common.keyHasDefaultValue(value._key) ? value._clientKey : value._key;
            };
            return SelectionControl;
        }());
        Widgets.SelectionControl = SelectionControl;
        var DropdownControl = /** @class */ (function (_super) {
            __extends(DropdownControl, _super);
            function DropdownControl() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            DropdownControl.prototype.PopulateOptions = function (options, clear) {
                if (clear === void 0) { clear = true; }
                // 'Please Select' Option for DropDown
                if (!this.$scope.dontAddEmptyValue) {
                    if (!this.IsNotNull() && !this.HasDefaultOptions(options)) {
                        options.unshift(this.GetDefaultOption(this.defaultText, "?"));
                    }
                }
                _super.prototype.PopulateOptions.call(this, options, clear);
            };
            DropdownControl.prototype.PopulateOption = function (val, txt) {
                var $option = $("<option class='value-holder' class='' value='" + val + "'>" + txt + "</option>");
                var $valueHolder = $option;
                return {
                    $option: $option,
                    $valueHolder: $valueHolder
                };
            };
            DropdownControl.prototype.ClearOptions = function (redraw) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    _this.$element.empty();
                    var options = (_this.IsNotNull()) ? [] : [_this.GetDefaultOption(_this.defaultText, "?")];
                    if (redraw) {
                        _this.PopulateOptions(options, false);
                    }
                    return true;
                });
            };
            DropdownControl.prototype.OnChange = function (value) {
                _super.prototype.OnChange.call(this, value);
            };
            DropdownControl.prototype.UpdateInitialValue = function () {
                var $renderedSelection = this.$element.next().find("span.selection span.select2-selection span.select2-selection__rendered");
                $renderedSelection.text(this.$element.find("option:selected").text());
                SelectionControl.UpdateTitle(this.$element, $renderedSelection);
            };
            DropdownControl.prototype.UpdateValue = function (value) {
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
                var $renderedSelection = this.$element.next().find("span.selection span.select2-selection span.select2-selection__rendered");
                SelectionControl.UpdateTitle(this.$element, $renderedSelection);
            };
            DropdownControl.prototype.Refresh = function () {
                var _this = this;
                SelectionControl.RemoveEmptyOptions(this.$element);
                if (this.$element.hasClass("select2-enabled")) {
                    this.$element.trigger("select2:updated");
                    SelectionControl.UpdateTitle(this.$element);
                }
                else {
                    var noDataText_1 = window._resourcesManager.getComboBoxNoDataText(this.$element, this.$scope.fromMasterForm);
                    this.$element.addClass("select2-enabled");
                    var options = {
                        "language": {
                            "noResults": function () {
                                return noDataText_1;
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
                        var userDataClassesString = $select2Container.context.getAttribute("user-data-classes");
                        if (userDataClassesString != null) {
                            for (var i = 0; i < $select2Container.length; i++) {
                                $select2Container[i].className += "  " + userDataClassesString;
                            }
                        }
                    } /* else if ($chosenContainer.length === 0 && $chosenContainer.context != null
                                    //chosen plugin is not supported for mobile browsers so we need to override the default css
                                    //visibility value in such cases
                                    && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                                    $element.attr("style", "visibility: visible !important");
                                }*/
                    this.$element.on("select2:updated", function () {
                        var isDisabled = _this.$element.is(":disabled");
                        var isReadonly = _this.$element.is("[readonly='readonly']");
                        // Make Readonly
                        if (isReadonly || isDisabled) {
                            _this.$element.prop("disabled", true);
                        }
                        else {
                            _this.$element.prop("disabled", false);
                        }
                        // Transfer classes from original element to select2 container
                        window._themeManager
                            .transferClassesOfStateToOtherElement(_this.$element, $select2Container, Joove.ThemeManager.States.Required);
                        window._themeManager
                            .transferClassesOfStateToOtherElement(_this.$element, $select2Container, Joove.ThemeManager.States.Readonly);
                        window._themeManager
                            .transferClassesOfStateToOtherElement(_this.$element, $select2Container, Joove.ThemeManager.States.Disabled);
                        window._themeManager
                            .transferRemovalOfClassesOfStateToOtherElement(_this.$element, $select2Container, Joove.ThemeManager.States.RequiredEmpty);
                        SelectionControl.UpdateTitle(_this.$element);
                    });
                    $select2Container.on("click", function () {
                        var $resultsContainer = jQuery("span.select2-container .select2-results ul");
                        if (_this.$scope.refreshDataFromServerOnFocus) {
                            $resultsContainer.hide();
                            _this.$scope.refreshDataFromServerOnFocus = false;
                            var loadingElement = jQuery("<span class='select2-loading-element' style='display: block; text-align:center; padding: 7px;'><i class='glyphicon glyphicon-refresh spin' style='font-size: 20px; opacity: 0.7'></i></span>");
                            jQuery("span.select2-container .select2-results").append(loadingElement);
                            setTimeout(function () {
                                _this.$scope.fetchData(null, null, function () {
                                    $resultsContainer.show();
                                    jQuery("span.select2-container .select2-results .select2-loading-element")
                                        .remove();
                                    _this.$element.select2("close");
                                    setTimeout(function () { _this.$element.select2("open"); }, 150);
                                });
                            }, 250);
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
            };
            DropdownControl.prototype.RegisterEventListeners = function () {
                var _this = this;
                this.$element.on("change", function () {
                    _this.OnValueChanged(_this.$element.find(":selected").eq(0));
                });
            };
            return DropdownControl;
        }(SelectionControl));
        Widgets.DropdownControl = DropdownControl;
        var RadioButtonControl = /** @class */ (function (_super) {
            __extends(RadioButtonControl, _super);
            function RadioButtonControl() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            RadioButtonControl.prototype.Refresh = function () {
            };
            RadioButtonControl.prototype.UpdateValue = function (value) {
                var attributeValue = value;
                if (this.$scope.bindingType === "bool") {
                    attributeValue = value.toString();
                }
                else if (this.$scope.nullOptionAvailable === true && value == null) {
                    attributeValue = "null";
                }
                var $target = this.$element.find("[value='" + attributeValue + "']");
                $target.prop("checked", true);
            };
            RadioButtonControl.prototype.UpdateInitialValue = function () {
            };
            RadioButtonControl.prototype.ClearOptions = function (redraw) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    _this.$element.empty();
                    return true;
                });
            };
            RadioButtonControl.prototype.RegisterEventListeners = function () {
                var _this = this;
                this.$element.on("click", "[jb-type='OptionButtonEntryContainer']", function () {
                    _this.OnValueChanged(_this.$element.find("input:checked"));
                });
            };
            RadioButtonControl.prototype.PopulateOption = function (val, txt) {
                var $option = window.$entryContainerTemplate.clone(true);
                if (this.$scope.nullOptionAvailable === true && val == null) {
                    val = "null";
                }
                $option.find('[jb-type="OptionButtonEntry"]')
                    .addClass("value-holder")
                    .attr("name", this.$scope.id + "_" + Joove.Common.getIndexesOfControl(this.$element).indexes)
                    .attr("value", val)
                    .prop("disabled", (this.$element.attr("readonly") != null || this.$element.hasClass("jb-disabled") === true));
                $option.find('[jb-type="OptionButtonEntryCaption"]').text(txt);
                var $valueHolder = $option.find(".value-holder");
                return {
                    $option: $option,
                    $valueHolder: $valueHolder
                };
            };
            RadioButtonControl.prototype.PopulateOptions = function (options, clear) {
                if (clear === void 0) { clear = true; }
                var $template = this.$element.find("[jb-type='OptionButtonEntryContainer']").eq(0);
                window.$entryContainerTemplate = $template.clone(true);
                $template.remove();
                _super.prototype.PopulateOptions.call(this, options, clear);
            };
            RadioButtonControl.prototype.OnChange = function (value) {
                _super.prototype.OnChange.call(this, value);
            };
            return RadioButtonControl;
        }(SelectionControl));
        Widgets.RadioButtonControl = RadioButtonControl;
        var TypeaheadControl = /** @class */ (function (_super) {
            __extends(TypeaheadControl, _super);
            function TypeaheadControl() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            TypeaheadControl.prototype.Refresh = function () {
            };
            TypeaheadControl.prototype.UpdateInitialValue = function () {
            };
            TypeaheadControl.prototype.ClearOptions = function (redraw) {
                return new Promise(function (resolve, reject) {
                    return true;
                });
            };
            TypeaheadControl.prototype.RegisterEventListeners = function () {
                var _this = this;
                this.$element.bind("typeahead:select", function (ev, suggestion) {
                    _this.OnValueChanged(TypeaheadControl.GetValue(ev));
                });
                this.$element.on("change", function (ev) {
                    _this.OnValueChanged(TypeaheadControl.GetValue(ev));
                });
            };
            TypeaheadControl.prototype.UpdateValue = function (value) {
                $(".tt-input", this.$element).val(value);
            };
            TypeaheadControl.prototype.PopulateOption = function (val, txt) {
                return null;
            };
            TypeaheadControl.prototype.PopulateOptions = function (items, clear) {
                if (clear === void 0) { clear = true; }
                var options = {
                    hint: true,
                    highlight: true,
                    minLength: 1
                };
                var ds = {
                    name: "items",
                    displayKey: this.GetRelativeProperty(this.$scope.txt),
                    source: this.GetDataset(items)
                };
                if (this.$placeholder != null) {
                    this.$placeholder.typeahead('destroy');
                }
                this.$placeholder = $(".typeahead", this.$element).typeahead(options, ds);
                this.$scope.control.UpdateSelection(this.$scope.model);
            };
            TypeaheadControl.prototype.OnChange = function (value) {
                var _this = this;
                if (this.$scope.val == "$this") {
                    var filterdValues = this.$scope.options.filter(function (x) { return x[_this.GetRelativeProperty(_this.$scope.txt)] === value; });
                    value = filterdValues.length > 0 ? filterdValues[0] : null;
                }
                this.$scope.model = value;
                if (this.$scope.owner != undefined) {
                    this.SetModelValue(value);
                }
                SelectionControl.GetScope(this.$scope).$apply();
            };
            TypeaheadControl.prototype.ValueMatchesToAvailableOptions = function (value) {
                if (this.$scope.controlType === SelectionBoxType.Typeahead)
                    return true;
                return false;
            };
            TypeaheadControl.GetValue = function (ev) {
                return $(ev.target).typeahead("val");
            };
            TypeaheadControl.prototype.GetDataset = function (items) {
                var datumTokenizer = Bloodhound.tokenizers
                    .obj.whitespace(this.GetRelativeProperty(this.$scope.txt));
                var engine = new Bloodhound({
                    initialize: true,
                    identify: this.GetDatasetKey,
                    dupDetector: this.Equals,
                    datumTokenizer: datumTokenizer,
                    queryTokenizer: Bloodhound.tokenizers.whitespace,
                    local: items
                });
                return engine;
            };
            TypeaheadControl.prototype.Equals = function (a, b) {
                return a._key === b._key;
            };
            TypeaheadControl.prototype.GetDatasetKey = function (item) {
                if (item == null)
                    return null;
                return item._key;
            };
            TypeaheadControl.prototype.IsObject = function () {
                //console.log(this.$scope.itemDataType);
                //console.log(this.IsManual());
                return true;
            };
            TypeaheadControl.prototype.PrepareItems = function (items) {
                var parsedItems = [];
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if (item != null && Joove.Common.valueIsPrimitive(item)) {
                        parsedItems.push(item);
                    }
                    else {
                        parsedItems.push(this.GetOptionProperty(item, this.$scope.val));
                    }
                }
                return parsedItems;
            };
            return TypeaheadControl;
        }(SelectionControl));
        Widgets.TypeaheadControl = TypeaheadControl;
        var SelectionBoxType;
        (function (SelectionBoxType) {
            SelectionBoxType[SelectionBoxType["Dropdown"] = 0] = "Dropdown";
            SelectionBoxType[SelectionBoxType["RadioButton"] = 1] = "RadioButton";
            SelectionBoxType[SelectionBoxType["Typeahead"] = 2] = "Typeahead";
        })(SelectionBoxType = Widgets.SelectionBoxType || (Widgets.SelectionBoxType = {}));
        function GetSelectionBoxType(type) {
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
        Widgets.GetSelectionBoxType = GetSelectionBoxType;
        function GetControl($scope, $element) {
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
        Widgets.GetControl = GetControl;
    })(Widgets = Joove.Widgets || (Joove.Widgets = {}));
})(Joove || (Joove = {}));
