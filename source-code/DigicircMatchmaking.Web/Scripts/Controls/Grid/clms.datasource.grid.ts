﻿namespace Joove.Widgets {

    class JooveDatasourceGridProvider extends BaseAngularProvider {
    }

    interface IJooveDatasourceGridScope extends IDataSourceControlScope {
        $collection: Array<any>;
        $cardMode: boolean;
        $mobileThreshold: number;
        $dataSetName: string;      
        $currentPage: number;
        $visiblePagerPages: Array<any>
        $totalRows: number;
        $totalPages: number;
        $pageSize: number;
        $add: (item: any) => void;        
        $gotoLastPage();
        $remove: (item: any) => void;
        $doRemove(item);
        $gotoPage(page: number, offTheRecord?: boolean, force?: boolean);
        $nextPage: () => void;
        $prevPage: () => void;
        $gotoFirstPage: () => void;
        $refresh: (cb?: Function) => void;    
        $fromMasterForm: boolean;
        _helper: JooveGridHelper;
    }

    function jooveDsGrid($timeout: ng.ITimeoutService, $interval: ng.IIntervalService, $compile: any, jooveDsGrid): ng.
        IDirective {

        var defaultOptions = {
            pageSize: 10
        }

        return {
            priority: 1001,           
            restrict: "AE",
            scope: true,
            link: ($scope: IJooveDatasourceGridScope, $table: any, $attrs: any, ngModelCtrl) => {                              
                Common.setDirectiveScope($table, $scope);

                let ngMaster: any = $attrs.ngMaster; 
                if (ngMaster != null && ngMaster.trim && ngMaster.trim().toLowerCase() == "true") {
                    $scope.fromMasterForm = true;
                }

                var formScope = $scope.fromMasterForm ? Common.getMasterScope() : Common.getScope();

                var securityTimeout: number;

                var _tools = {
                    updateVisiblePages: function (page?: number) {
                        const visiblePages = [];

                        for (let i = 0; i < $scope.$totalPages; i++) {
                            if (i === 0 || // first
                                i === $scope.$totalPages - 1 || // last
                                i === $scope.$currentPage || // current
                                i === $scope.$currentPage - 1 || // prev
                                i === $scope.$currentPage + 1) { // next
                                visiblePages.push(i);
                            } else {
                                if (i === 1) {
                                    visiblePages.push(-1); // ... for all prev pages
                                } else if (i === $scope.$totalPages - 2) {
                                    visiblePages.push(-2); // ... for all next pages
                                }
                            }
                        }

                        $scope.$visiblePagerPages = visiblePages;
                    },

                    gridChanged: function (dontMakeFormDirty: boolean) {                        
                       clearTimeout(securityTimeout);
                        
                       dontMakeFormDirty = true; // force this since for the moment DS Grids are readonly

                       securityTimeout = setTimeout(() => {
                           Core.onChange($table as any, null, dontMakeFormDirty);                          
                        }, 45) as any;
                    },

                    init: function () {
                        $scope.$mobileThreshold = parseInt($table.attr("data-mobile-width"));
                        $scope.$cardMode = false;
                        $scope.$gotoPage(0, true, true);                     
                        $scope.$dataSetName = Joove.DatasourceManager.getDataSetNameFromControl($table);

                        //$("[jb-clear-filters='" + $scope.$dataSetName + "']").on("click", () => {
                        //    _tools.clearAllFilters();
                        //});

                        //$("[jb-apply-filters='" + $scope.$dataSetName + "']").on("click", () => {                            
                        //    $scope.$gotoPage(0, true, true);
                        //});
                        
                        $table.find("[joove-ds-sort]").after("<span style='font-size: 22px; visibility: hidden' class='order-by-mark-placeholder'>⇩</span>");
                        
                        $(window).on("resize", () => {
                            _tools.onResize();
                        });

                        setTimeout(() => {
                            _tools.onResize();
                        }, 500);
                    },

                    scrollToTop: function () {
                        var $fieldSet = $table.closest("[jb-type='FieldSet']").get(0);

                        if ($fieldSet == null) return;

                        $fieldSet.scrollIntoView({ behavior: "smooth", block: "start" });
                    },

                    onResize: function () {
                        if ($scope.$mobileThreshold == null ||
                            isNaN($scope.$mobileThreshold) === true ||
                            $scope.$mobileThreshold < 0) {
                            return;
                        }
                        
                        var newCardMode = $(window).width() < $scope.$mobileThreshold;
                        
                        if ($scope.$cardMode == newCardMode) return;

                        $scope.$cardMode = newCardMode;

                        Joove.Core.applyScope($scope);
                    },

                    getOrderMark: function (dir: OrderByDirections): string {
                        if (dir == OrderByDirections.DESC) {
                            return "<span style='font-size: 22px' class='order-by-mark order-mark-desc'>⇩</span>";
                        }
                        else if (dir == OrderByDirections.ASC) {
                            return "<span style='font-size: 22px' class='order-by-mark order-mark-asc'>⇧</span>";
                        }
                        else {
                            return null;
                        }
                    },

                    clearAllFilters: function () {                        
                        $scope._helper.clearAllFilters();
                        const filterTextBox = $table.find("[joove-ds-filter]");
                        if (filterTextBox.length > 0) {
                            filterTextBox.val("");
                        } else {
                            $("[joove-ds-filter-for='" + $attrs.jooveDataset + "']").val("");
                        }
                        $scope.$refresh();
                    }                    
                }
               
                $scope.$watchCollection("$collection",
                    (newValue: Array<any>, oldValue: Array<any>) => {
                        if (Common.collectionsAreEqual(newValue, oldValue)) return;
                      
                        _tools.updateVisiblePages();
                        _tools.gridChanged(false);
                    });

                var options = JSON.parse($attrs.joovegridoptions);
                $scope.$pageSize = parseInt(options.pageSize);

                if (isNaN($scope.$pageSize)) {
                    $scope.$pageSize = defaultOptions.pageSize;
                }

                $scope._helper = new JooveGridHelper($table, $scope.$pageSize, $scope.fromMasterForm);

                $scope._helper.hideParentFieldSet();
                $scope.$visiblePagerPages = [];
                $scope.$currentPage = -1;

                $scope.$clearFilters = (e: Event) => {
                    _tools.clearAllFilters();
                };

                $scope.$applyFilters = (e: Event) => {
                    $scope.$gotoPage(0, true, true);
                };

                $scope.$add = item => {
                    console.error("Datasource Grid -ADD- not implemented");
                    //$model().push(item || {});
                    //$scope.$gotoLastPage();
                };

                $scope.$remove = item => {
                    if (options.confirm === true) {
                        window._popUpManager.question(window._resourcesManager
                            .getGlobalResource("RES_WEBFORM_GenericConfirmationQuestion"),
                            "",
                            function () {
                                $scope.$doRemove(item);
                                $scope.$digest();
                            });
                    } else {
                        $scope.$doRemove(item);
                    }
                };

                $scope.$doRemove = item => {
                    console.error("Datasource Grid -REMOVE- not implemented");

                    //var model = $model();
                    //for (let i = 0; i < getCollectionCount(); i++) {
                    //    if (item === model[i]) {
                    //        model.splice(i, 1);
                    //        break;
                    //    }
                    //}
                    //$scope.$gotoPage($scope.$currentPage);
                };

                $scope.$nextPage = () => {
                    $scope.$gotoPage($scope.$currentPage + 1);
                };

                $scope.$prevPage = () => {
                    $scope.$gotoPage($scope.$currentPage - 1);
                };

                $scope.$gotoLastPage = () => {
                    $scope.$gotoPage(Math.ceil($scope.$totalRows / $scope.$pageSize) - 1);
                };

                $scope.$gotoFirstPage = () => {
                    $scope.$gotoPage(0);
                };

                $scope.$gotoPage = (page: number, offTheRecord?: boolean, force?: boolean) => {                    
                    if (page < 0) return;

                    if (page > $scope.$totalPages - 1) page = $scope.$totalPages - 1;

                    if ($scope.$currentPage == page && force !== true) return;
                 
                    $scope.$currentPage = page;

                    $scope._helper.status.currentPage = page;
                    
                    $scope.$refresh((data) => {
                        _tools.updateVisiblePages();
                    });                    

                    //if (!offTheRecord) {
                    //    gridChanged(true);
                    //}
                    //do not scroll on page refresh
                    if(force !== true)
                    {
                        _tools.scrollToTop();
                    }
                    //if ($scope.$cardMode === true) {
                    //}
                };

                $scope.$refresh = (cb?: Function) => {                 
                    $scope._helper.fetchData((resp) => {
                        $scope.$totalRows = resp.TotalRows;
                        $scope.$totalPages = Math.ceil($scope.$totalRows / $scope.$pageSize);
                        $scope.$collection = resp.Data;

                        if ($scope._helper.status.currentPage < 0) {
                            $scope._helper.status.currentPage = 0;
                        }

                        if ($scope.$currentPage < 0) {
                            $scope.$currentPage = 0;
                        }
                       
                        Joove.Core.applyScope($scope);                       
                      
                        _tools.gridChanged(true);

                        setTimeout(() => {
                            window._ruleEngine.applyDataSetRulesResult(resp.RuleEvaluations);
                        }, 10);

                        $scope._helper.refreshImages();

                        cb && cb(resp);
                    });
                }

                $scope.$addFilter = (e: Event, columnName: string, filterOp: string, rowOp: string, overwriteExisting: boolean, autoApply: boolean) => {                    
                    var value = $(e.target).val();

                    var filterOpEnum = DatasourceManager.parseStringToFilterOperator(filterOp);
                    var rowOpEnum = DatasourceManager.parseStringToRowOperator(rowOp);

                    $scope._helper.clearGlobalFilter();
                    $table.find("[joove-ds-global-filter]").val("");

                    $scope._helper.addFilter(columnName, value, filterOpEnum, rowOpEnum, overwriteExisting, FilterType.Simple);

                    if (autoApply === true) {
                        $scope.$gotoPage(0, true, true);
                    }
                }

                $scope.$globalFilter = (e: Event, autoApply: boolean) => {                    
                    var value = $(e.target).val();

                    $table.find("[joove-ds-filter]:not([joove-ds-global-filter])").val("");

                    if ($scope._helper.globalFilterChanged(value) === false) return;

                    $scope._helper.globalFilter(value);

                    if (autoApply === true) {
                        $scope.$gotoPage(0, true, true);
                    }                 
                }

                $scope.$sortBy = (e: Event, columnName: string) => {
                    var $el = $(e.target);

                    var orderDirectionData = $el.data("ordeBy");
                    var orderByEnum = OrderByDirections.NONE;


                    if (orderDirectionData == "ASC") {
                        orderByEnum = OrderByDirections.DESC;
                        $el.data("ordeBy", "DESC");                        
                    }
                    else if (orderDirectionData == "DESC") {
                        orderByEnum = OrderByDirections.NONE;
                        $el.data("ordeBy", "NONE");
                    }
                    else if (orderDirectionData == "NONE" || orderDirectionData == null) {
                        orderByEnum = OrderByDirections.ASC;
                        $el.data("ordeBy", "ASC");
                    }
                    
                    $(".order-by-mark").remove();

                    var $mark = _tools.getOrderMark(orderByEnum);

                    if ($mark != null) {                      
                        $el.after($mark);
                    }

                    $scope._helper.addOrderBy(columnName, orderByEnum, true);
                    $scope.$gotoPage(0, true, true);                             
                }

                $timeout(() => {
                    _tools.init();
                });

                DatasourceManager.watchDependencies(formScope,
                    $table,
                    (): void => {
                        $scope.$refresh();
                });      

                Common.markDirectiveScopeAsReady($table);
            }
        };

    }

    angular
        .module("jooveDsGrid", [])
        .provider("jooveDsGrid", new JooveDatasourceGridProvider())
        .directive("jooveDsGrid",
        [
            "$timeout",
            "$interval",
            "$compile",
            "jooveDsGrid",
            jooveDsGrid
        ]);

    export interface IDatasourceGridStatus {
        columns: Array<ColumnInfo>;       
        filterBy: Array<DataSourceGridFilter>;
        orderBy: Array<OrderByInfo>;
        currentPage: number;
        pageSize: number;
    }

    export enum FilterType {
        Global,
        Simple
    }

    export class DataSourceGridFilter extends FilterInfo {
        type: FilterType
    }

    export class JooveGridHelper {
        public status: IDatasourceGridStatus;
        private $element: JQuery;
        private parentIsVisible: boolean = true;
        private hideTimeout: number = 150;
        private fromMasterForm: boolean = false;
        private lastGlobalFilter: string;

        constructor($el: JQuery, pageSize: number, fromMasterForm: boolean) {
            this.status = {
                filterBy: [],
                orderBy: [],
                currentPage: 0,
                pageSize: pageSize,
                columns: DatasourceManager.getDataSetColumnInfoFromControl($el)
            }

            this.$element = $el;
            this.fromMasterForm = fromMasterForm;
        }

        public hideParentFieldSet() {
            this.$element.closest("[jb-type='FieldSet']").css("opacity", "0");
            this.parentIsVisible = false;
        }

        public showParentFieldSet() {
            setTimeout(() => {
                this.$element.closest("[jb-type='FieldSet']").css("opacity", "1");
                this.parentIsVisible = true;
            }, this.hideTimeout);
        }

        public refreshImages() {
            var elements = $("[jb-type='ImageBox']", this.$element);

            const ids = [];

            elements.each(function (index) {
                var id = $(this).attr('jb-id');

                if (ids.indexOf(id) == -1)
                {
                    ids.add(id);
                }
            });

            if (ids.length > 0)
            {
                window._commander.imageRefresh(ids);
            }

        }

        private prepareRequest() {
            var startRow = this.status.currentPage * this.status.pageSize;

            if (startRow < 0) {
                startRow = 0;               
            }

            const request = new DatasourceRequest(this.$element,
                                                    startRow,
                                                    this.status.pageSize,
                                                    this.status.filterBy,
                                                    this.status.orderBy);                        
            
            return request;
        }

        public fetchData(cb?: Function) {
            var self = this;
            const requestInfo = this.prepareRequest();

            DatasourceManager.fetchDatasource(this.$element,
                Core.getElementName(this.$element),
                requestInfo,
                {
                    success: (response) => {                 
                        cb && cb(response);      

                        if (this.parentIsVisible == true) return;
                        
                        this.showParentFieldSet();                        
                    },
                    error: () => {
                        console.error("Error fetching grid datasource");
                    }
                }, self.fromMasterForm);
        }

        public globalFilterChanged(newValue: string) {            
            return this.lastGlobalFilter != newValue;
        }

        public globalFilter(value: string) {            
            this.clearAllFilters();

            this.lastGlobalFilter = value;

            if (value == null || value.trim().length == 0) return;

            for (let i = 0; i < this.status.columns.length; i++) {
                var current = this.status.columns[i];
                if (current.searchable !== true) continue;

                this.addFilter(current.name, value, FilterOperators.LIKE, RowOperators.OR, true, FilterType.Global);                
            }            
        }

        public clearAllFilters() {
            this.status.filterBy = [];      
        }

        public clearGlobalFilter() {
            var indexesToSplice: Array<number> = [];

            var filtersToRemain: Array<DataSourceGridFilter> = [];

            for (let i = 0; i < this.status.filterBy.length; i++) {
                var current = this.status.filterBy[i];

                if (current.type != FilterType.Global) {
                    filtersToRemain.push(current);                    
                }
            }

            this.status.filterBy = filtersToRemain;
        }

        public addFilter(columnName: string, value: string, filterOp: FilterOperators, rowOp: RowOperators, overwriteExisting: boolean, type: FilterType) {            
            var column = this.getColumnInfoByName(columnName);
           
            if (overwriteExisting === true) {
                var indexToSplice = -1;

                for (let i = 0; i < this.status.filterBy.length; i++) {
                    var current = this.status.filterBy[i];

                    if (current.column.name == columnName) {
                        indexToSplice = i;
                        break;
                    }
                }

                if (indexToSplice > -1) {
                    this.status.filterBy.splice(indexToSplice, 1);
                }
            }

            var filter = new DataSourceGridFilter(column, value, rowOp, filterOp, null);
            filter.type = type;

            this.status.filterBy.push(filter);
        }

        public addOrderBy(columnName: string, direction: OrderByDirections, removeOthers: boolean) {
            var indexToSplice = -1;

            if (removeOthers == true) {
                this.status.orderBy = [];
            }
            else {
                for (let i = 0; i < this.status.orderBy.length; i++) {
                    var current = this.status.orderBy[i];

                    if (current.column.name == columnName) {
                        indexToSplice = i;
                        break;
                    }
                }

                if (indexToSplice > -1) {
                    this.status.orderBy.splice(indexToSplice, 1);
                }
            }
            
            if (direction == OrderByDirections.NONE) return;

            var column = this.getColumnInfoByName(columnName);
            this.status.orderBy.push(new OrderByInfo(column, direction));
        }

        private getColumnInfoByName(name: string): ColumnInfo {
            for (let i = 0; i < this.status.columns.length; i++) {
                var current = this.status.columns[i];

                if (current.name == name) return current;
            }

            return null;
        }
    }  
}