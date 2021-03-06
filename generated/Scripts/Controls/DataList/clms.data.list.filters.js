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
        var JbCompositeFiltersPopUp = /** @class */ (function (_super) {
            __extends(JbCompositeFiltersPopUp, _super);
            function JbCompositeFiltersPopUp() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return JbCompositeFiltersPopUp;
        }(Joove.BaseAngularProvider));
        function jbCompositeFilters($timeout, $interval, ngRadio) {
            return {
                priority: 1001,
                restrict: "AE",
                scope: true,
                link: function ($scope, $element, $attrs) {
                    if (Joove.Common.directiveScopeIsReady($element))
                        return;
                    Joove.Common.setDirectiveScope($element, $scope);
                    $scope.refreshFilters = function (filters) {
                        $scope.$filters = JSON.parse(JSON.stringify(filters)); // clone
                    };
                    $scope.getFilters = function () {
                        return $scope.$filters;
                    };
                    $scope.$removeFilter = function (filter) {
                        var index = $scope.$filters.indexOf(filter);
                        if (index == -1)
                            return;
                        $scope.$filters.splice(index, 1);
                    };
                    $scope.$addFilter = function () {
                        var filter = new Joove.Widgets.DataListFilterInfo(null, "", Joove.RowOperators.OR, Joove.FilterOperators.LIKE, "", Widgets.DataListFilterType.Custom);
                        if ($scope.$filters == null) {
                            $scope.$filters = [];
                        }
                        $scope.$filters.push(filter);
                    };
                    $scope.$findCompatibleOperators = function (filter) {
                        return function (item) {
                            if (filter == null || filter.column == null)
                                return false;
                            var common = [
                                Joove.FilterOperators.NONE,
                                Joove.FilterOperators.EQUAL_TO,
                                Joove.FilterOperators.NOT_EQUAL_TO,
                                Joove.FilterOperators.HAS_VALUE,
                                Joove.FilterOperators.HAS_NO_VALUE,
                            ];
                            if (common.indexOf(item.value) > -1)
                                return true;
                            if (filter.column.dataType != "bool" && item.value == Joove.FilterOperators.LIKE)
                                return true;
                            var ordinableTypes = ["DateTime", "int", "long", "float", "decimal", "double"];
                            return ordinableTypes.indexOf(filter.column.dataType) > -1;
                        };
                    };
                    $scope.$commit = function () {
                        $scope.$helper.commit();
                    };
                    $scope.$cancel = function () {
                        $scope.$helper.cancel();
                    };
                    Joove.Common.markDirectiveScopeAsReady($element);
                }
            };
        }
        var CompositeFiltersHelper = /** @class */ (function () {
            function CompositeFiltersHelper(list) {
                var _this = this;
                this.createFiltersArray = function () {
                    return [
                        //{ caption: "None", value: Joove.FilterOperators.NONE },
                        { caption: _this.resources.like, value: Joove.FilterOperators.LIKE },
                        { caption: _this.resources.equalTo, value: Joove.FilterOperators.EQUAL_TO },
                        { caption: _this.resources.notEqualTo, value: Joove.FilterOperators.NOT_EQUAL_TO },
                        { caption: _this.resources.hasNoValue, value: Joove.FilterOperators.HAS_NO_VALUE },
                        { caption: _this.resources.hasValue, value: Joove.FilterOperators.HAS_VALUE },
                        { caption: _this.resources.greaterThan, value: Joove.FilterOperators.GREATER_THAN },
                        { caption: _this.resources.greaterThanOrEqualTo, value: Joove.FilterOperators.GREATER_THAN_OR_EQUAL_TO },
                        { caption: _this.resources.lessThan, value: Joove.FilterOperators.LESS_THAN },
                        { caption: _this.resources.lessThanOrEqualTo, value: Joove.FilterOperators.LESS_THAN_OR_EQUAL_TO },
                        { caption: _this.resources.between, value: Joove.FilterOperators.RANGE },
                    ];
                };
                this.createRowOperatorsArray = function () {
                    return [
                        //{ caption: "None", value: Joove.RowOperators.NONE },                
                        { caption: _this.resources.and, value: Joove.RowOperators.AND },
                        { caption: _this.resources.or, value: Joove.RowOperators.OR },
                    ];
                };
                this.getScopeBySelector = function (selector) {
                    return Joove.Common.getDirectiveScope($(selector));
                };
                this.list = list;
                this.modalSelector = "#" + list.serversideElementId + "_CompositeFiltersModal";
                this.init();
            }
            CompositeFiltersHelper.prototype.init = function () {
                var _this = this;
                this.scope = this.getScopeBySelector(this.modalSelector);
                if (this.scope == null) {
                    setTimeout(function () {
                        _this.init();
                    }, 1000);
                    return;
                }
                this.scope.$helper = this;
                this.fillResources();
                this.scope.$resources = this.resources;
                this.scope.$operators = this.createFiltersArray();
                this.scope.$rowOperators = this.createRowOperatorsArray();
                this.scope.$columns = this.list.status.columnInfo;
            };
            CompositeFiltersHelper.prototype.show = function () {
                this.scope.$filters = JSON.parse(JSON.stringify(this.list.status.filters));
                this.scope.$hasErrors = false;
                this.scope.$apply();
                this.toggleModal("show");
            };
            CompositeFiltersHelper.prototype.cancel = function () {
                this.toggleModal("hide");
            };
            CompositeFiltersHelper.prototype.commit = function () {
                var _this = this;
                this.validateFilters();
                if (this.scope.$hasErrors === true)
                    return;
                this.toggleModal("hide");
                for (var i = 0; i < this.scope.$filters.length; i++) {
                    this.scope.$filters[i].type = Widgets.DataListFilterType.Custom;
                }
                this.list.clearAllSearchFields();
                setTimeout(function () {
                    _this.list.status.filters = _this.scope.$filters;
                    _this.list.dataTableInstance.ajax.reload();
                }, 500);
            };
            CompositeFiltersHelper.prototype.fillResources = function () {
                var listResources = window._resourcesManager.getDataListResources();
                this.resources = {
                    compositeFilters: listResources.FiltersPopUpTitle,
                    column: listResources.Column,
                    filterType: listResources.Operator,
                    criteria: listResources.Criteria,
                    rowOperator: listResources.RowOperator,
                    valueTrue: listResources.True,
                    valueFalse: listResources.False,
                    pleaseFillInAllFields: listResources.RequiredFiltersMissingMessage,
                    add: listResources.AddFilter,
                    clearAll: listResources.ClearAll,
                    ok: listResources.Ok,
                    cancel: listResources.Cancel,
                    and: listResources.And,
                    or: listResources.Or,
                    like: listResources.Like,
                    equalTo: listResources.EqualTo,
                    notEqualTo: listResources.NotEqualTo,
                    hasNoValue: listResources.HasNoValue,
                    hasValue: listResources.HasValue,
                    greaterThan: listResources.GreaterThan,
                    greaterThanOrEqualTo: listResources.GreaterThanOrEqualTo,
                    lessThan: listResources.LessThan,
                    lessThanOrEqualTo: listResources.LessThanOrEqualTo,
                    between: listResources.Range,
                };
            };
            CompositeFiltersHelper.prototype.toggleModal = function (action) {
                if (this.list.options.useCustomModal) {
                    if (action == "show") {
                        this.list.showCustomModal($(this.modalSelector));
                    }
                    else {
                        this.list.hideCustomModal($(this.modalSelector));
                    }
                }
                else {
                    $(this.modalSelector).modal(action);
                }
            };
            CompositeFiltersHelper.prototype.validateFilters = function () {
                this.scope.$hasErrors = false;
                for (var i = 0; i < this.scope.$filters.length; i++) {
                    var filter = this.scope.$filters[i];
                    // Basic Fields are empty (ALL)
                    if (filter.column == null ||
                        filter.rowOperator == null ||
                        filter.rowOperator == Joove.RowOperators.NONE ||
                        filter.operator == null ||
                        filter.operator == Joove.FilterOperators.NONE) {
                        this.scope.$hasErrors = true;
                        break;
                    }
                    // Filter Value is empty (ALL except from HAS_VALUE / HAS_NO_VALUE)
                    if (filter.operator != Joove.FilterOperators.HAS_VALUE &&
                        filter.operator != Joove.FilterOperators.HAS_NO_VALUE &&
                        Joove.Common.stringIsNullOrEmpty(filter.value) === true) {
                        this.scope.$hasErrors = true;
                        break;
                    }
                    // Second Filter Value is empty (RANGE only)
                    if (filter.operator == Joove.FilterOperators.RANGE &&
                        Joove.Common.stringIsNullOrEmpty(filter.secondValue) === true) {
                        this.scope.$hasErrors = true;
                        break;
                    }
                }
            };
            return CompositeFiltersHelper;
        }());
        Widgets.CompositeFiltersHelper = CompositeFiltersHelper;
        angular
            .module("jbCompositeFilters", [])
            .provider("jbCompositeFilters", new JbCompositeFiltersPopUp())
            .directive("jbCompositeFilters", ["$timeout", "$interval", "jbCompositeFilters", jbCompositeFilters]);
        /////////////////////////// Mini Date Picker Directive ////////////////////////////////
        var JbQuickDateTimePicker = /** @class */ (function (_super) {
            __extends(JbQuickDateTimePicker, _super);
            function JbQuickDateTimePicker() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return JbQuickDateTimePicker;
        }(Joove.BaseAngularProvider));
        function jbQuickDateTimePicker($timeout, $interval, ngRadio) {
            return {
                priority: 1001,
                restrict: "AE",
                scope: {},
                link: function ($scope, $element, $attrs, ngModelCtrl) {
                    if (Joove.Common.directiveScopeIsReady($element))
                        return;
                    var formatting = $element.attr("formatting");
                    $element.datetimepicker({
                        format: Widgets.DataListControl.DEFAULT_DATETIME_FORMAT,
                        formatDate: Widgets.DataListControl.DEFAULT_DATETIME_FORMAT,
                        timepicker: false,
                        datepicker: true,
                        onChangeDateTime: function (currentTime, $element, event) {
                            var currentTimeAsUTC = Date.parseDate(currentTime).toISOString();
                            $scope.model = currentTimeAsUTC;
                        }
                    });
                    Joove.Common.markDirectiveScopeAsReady($element);
                }
            };
        }
        angular.module("jbQuickDateTimePicker", [])
            .provider("jbQuickDateTimePicker", new JbQuickDateTimePicker())
            .directive("jbQuickDateTimePicker", ["$timeout", "$interval", "jbQuickDateTimePicker", jbQuickDateTimePicker]);
    })(Widgets = Joove.Widgets || (Joove.Widgets = {}));
})(Joove || (Joove = {}));
