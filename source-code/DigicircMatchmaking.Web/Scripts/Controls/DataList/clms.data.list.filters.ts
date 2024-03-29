namespace Joove.Widgets {

    class JbCompositeFiltersPopUp extends BaseAngularProvider {        
    }

    export interface IJbCompositeFiltersPopUpScope extends IJooveScope {
        $columns: Array<Joove.Widgets.DataListColumnInfo>;
        $filters: Array<Joove.Widgets.DataListFilterInfo>;
        $rowOperators: Array<{ caption: string, value: Joove.RowOperators }>;
        $operators: Array<{ caption: string, value: Joove.FilterOperators }>;
        $helper: CompositeFiltersHelper;
        $hasErrors: boolean;
        $resources: ICompositeFiltersResources;

        $removeFilter: (filter: Joove.Widgets.DataListFilterInfo) => void;
        $addFilter: () => void;    
        refreshFilters: (filters: Array<Joove.Widgets.DataListFilterInfo>) => void;
        getFilters: () => Array<Joove.Widgets.DataListFilterInfo>;

        $commit: () => void;
        $cancel: () => void;
    }

    function jbCompositeFilters($timeout: ng.ITimeoutService, $interval: ng.IIntervalService, ngRadio: any): ng.IDirective {
        return {
            priority: 1001,
            restrict: "AE",
            scope: true,
            link($scope: IJbCompositeFiltersPopUpScope, $element: JQuery, $attrs) {
                if (Common.directiveScopeIsReady($element)) return;

                Common.setDirectiveScope($element, $scope);
                              
                $scope.refreshFilters = (filters: Array<Joove.Widgets.DataListFilterInfo>) => {
                    $scope.$filters = JSON.parse(JSON.stringify(filters)); // clone
                }

                $scope.getFilters = (): Array<Joove.Widgets.DataListFilterInfo> => {
                    return $scope.$filters;                
                }

                $scope.$removeFilter = (filter: Joove.Widgets.DataListFilterInfo) => {
                    var index = $scope.$filters.indexOf(filter);

                    if (index == -1) return;

                    $scope.$filters.splice(index, 1);
                }

                $scope.$addFilter = () => {
                    var filter = new Joove.Widgets.DataListFilterInfo(null, "", RowOperators.OR, FilterOperators.LIKE, "", DataListFilterType.Custom);

                    if ($scope.$filters == null) {
                        $scope.$filters = [];
                    }
                   
                    $scope.$filters.push(filter);
                }

                $scope.$findCompatibleOperators = function (filter: Joove.Widgets.DataListFilterInfo) {
                    return function (item: { caption: string, value: Joove.FilterOperators }) {
                        if (filter == null || filter.column == null) return false;

                        const common = [
                            Joove.FilterOperators.NONE,
                            Joove.FilterOperators.EQUAL_TO,
                            Joove.FilterOperators.NOT_EQUAL_TO,                            
                            Joove.FilterOperators.HAS_VALUE,
                            Joove.FilterOperators.HAS_NO_VALUE,                                                                                  
                        ];

                        if (common.indexOf(item.value) > -1) return true;

                        if (filter.column.dataType != "bool" && item.value == Joove.FilterOperators.LIKE) return true;

                        const ordinableTypes = ["DateTime", "int", "long", "float", "decimal", "double"];

                        return ordinableTypes.indexOf(filter.column.dataType) > -1;
                    };
                };

                $scope.$commit = () => {
                    $scope.$helper.commit();
                }

                $scope.$cancel = () => {
                    $scope.$helper.cancel();
                }

                Common.markDirectiveScopeAsReady($element);
            }
        };
    }

    export interface ICompositeFiltersResources {
        compositeFilters: string;
        column: string;
        filterType: string;
        criteria: string;
        rowOperator: string;
        valueTrue: string;
        valueFalse: string;
        pleaseFillInAllFields: string;
        add: string;
        clearAll: string;
        ok: string;
        cancel: string;
        and: string;
        or: string;
        like: string;
        equalTo: string;
        notEqualTo: string;
        hasNoValue: string;
        hasValue: string;
        greaterThan: string;
        greaterThanOrEqualTo: string;
        lessThan: string;
        lessThanOrEqualTo: string;
        between: string;
    }

    export class CompositeFiltersHelper {
        list: DataListControl;
        scope: IJbCompositeFiltersPopUpScope;
        modalSelector: string;
        resources: ICompositeFiltersResources;

        constructor(list: DataListControl) {
            this.list = list;
            this.modalSelector = "#" + list.serversideElementId + "_CompositeFiltersModal";
            this.init();
        }

        private init() {
            this.scope = this.getScopeBySelector(this.modalSelector);

            if (this.scope == null) {
                setTimeout(() => {
                    this.init();
                }, 1000);
                return;
            }

            this.scope.$helper = this;
            this.fillResources();
            this.scope.$resources = this.resources;
            this.scope.$operators = this.createFiltersArray();
            this.scope.$rowOperators = this.createRowOperatorsArray();
            this.scope.$columns = this.list.status.columnInfo;                      
        }

        public show() {
            this.scope.$filters = JSON.parse(JSON.stringify(this.list.status.filters));            
            this.scope.$hasErrors = false;
            this.scope.$apply();
            this.toggleModal("show");
        }
        
        public cancel() {
            this.toggleModal("hide");            
        }

        public commit() {
            this.validateFilters();

            if (this.scope.$hasErrors === true) return;
                        
            this.toggleModal("hide");                        

            for (let i = 0; i < this.scope.$filters.length; i++) {
                this.scope.$filters[i].type = DataListFilterType.Custom;
            }

            this.list.clearAllSearchFields();            
            
            setTimeout(() => {
                this.list.status.filters = this.scope.$filters;
                this.list.dataTableInstance.ajax.reload();
            }, 500);            
        }

        private fillResources() {
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
        }

        private toggleModal(action: string) {
            if (this.list.options.useCustomModal) {
                if (action == "show") {
                    this.list.showCustomModal($(this.modalSelector));
                } else {
                    this.list.hideCustomModal($(this.modalSelector));
                }
            } else {
                $(this.modalSelector).modal(action);
            }
        }

        private validateFilters() {
            this.scope.$hasErrors = false;

            for (let i = 0; i < this.scope.$filters.length; i++) {
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
                    Common.stringIsNullOrEmpty(filter.value) === true) {
                    this.scope.$hasErrors = true;
                    break;
                }

                // Second Filter Value is empty (RANGE only)
                if (filter.operator == Joove.FilterOperators.RANGE &&
                    Common.stringIsNullOrEmpty(filter.secondValue) === true) {
                    this.scope.$hasErrors = true;
                    break;
                }
            }
        }

        private createFiltersArray = (): Array<{ caption: string, value: Joove.FilterOperators }> => {
            return [
                //{ caption: "None", value: Joove.FilterOperators.NONE },
                { caption: this.resources.like, value: Joove.FilterOperators.LIKE },
                { caption: this.resources.equalTo, value: Joove.FilterOperators.EQUAL_TO },
                { caption: this.resources.notEqualTo, value: Joove.FilterOperators.NOT_EQUAL_TO },
                { caption: this.resources.hasNoValue, value: Joove.FilterOperators.HAS_NO_VALUE },
                { caption: this.resources.hasValue, value: Joove.FilterOperators.HAS_VALUE },
                { caption: this.resources.greaterThan, value: Joove.FilterOperators.GREATER_THAN },
                { caption: this.resources.greaterThanOrEqualTo, value: Joove.FilterOperators.GREATER_THAN_OR_EQUAL_TO },
                { caption: this.resources.lessThan, value: Joove.FilterOperators.LESS_THAN },
                { caption: this.resources.lessThanOrEqualTo, value: Joove.FilterOperators.LESS_THAN_OR_EQUAL_TO },
                { caption: this.resources.between, value: Joove.FilterOperators.RANGE },
            ];
        }

        private createRowOperatorsArray = (): Array<{ caption: string, value: Joove.RowOperators }> => {
            return [
                //{ caption: "None", value: Joove.RowOperators.NONE },                
                { caption: this.resources.and, value: Joove.RowOperators.AND },
                { caption: this.resources.or, value: Joove.RowOperators.OR },                                
            ];
        }

        private getScopeBySelector = (selector: string): IJbCompositeFiltersPopUpScope => {
            return Joove.Common.getDirectiveScope($(selector));
        }
    }

    angular
        .module("jbCompositeFilters", [])
        .provider("jbCompositeFilters", new JbCompositeFiltersPopUp())
        .directive("jbCompositeFilters", ["$timeout", "$interval", "jbCompositeFilters", jbCompositeFilters]);


    /////////////////////////// Mini Date Picker Directive ////////////////////////////////

    class JbQuickDateTimePicker extends BaseAngularProvider { }

    function jbQuickDateTimePicker($timeout: ng.ITimeoutService, $interval: ng.IIntervalService, ngRadio: any): ng.IDirective {
        return {
            priority: 1001,
            restrict: "AE",
            scope: {

            },
            link: ($scope: IJooveScope, $element: JQuery, $attrs: ng.IAttributes, ngModelCtrl: any): void => {
                if (Common.directiveScopeIsReady($element)) return;

                var formatting = $element.attr("formatting");

                ($element as any).datetimepicker({
                    format: DataListControl.DEFAULT_DATETIME_FORMAT,
                    formatDate: DataListControl.DEFAULT_DATETIME_FORMAT,
                    timepicker: false,
                    datepicker: true,
                    onChangeDateTime: function (currentTime, $element, event) {
                        const currentTimeAsUTC = (Date as any).parseDate(currentTime).toISOString();

                        $scope.model = currentTimeAsUTC;
                    }
                });
                

                Common.markDirectiveScopeAsReady($element);
            }
        };
    }

    angular.module("jbQuickDateTimePicker", [])
        .provider("jbQuickDateTimePicker", new JbQuickDateTimePicker())
        .directive("jbQuickDateTimePicker", ["$timeout", "$interval", "jbQuickDateTimePicker", jbQuickDateTimePicker]);

}