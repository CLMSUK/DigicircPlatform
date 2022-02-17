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
        var JooveDatasourceGridProvider = /** @class */ (function (_super) {
            __extends(JooveDatasourceGridProvider, _super);
            function JooveDatasourceGridProvider() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return JooveDatasourceGridProvider;
        }(Joove.BaseAngularProvider));
        function jooveDsGrid($timeout, $interval, $compile, jooveDsGrid) {
            var defaultOptions = {
                pageSize: 10
            };
            return {
                priority: 1001,
                restrict: "AE",
                scope: true,
                link: function ($scope, $table, $attrs, ngModelCtrl) {
                    Joove.Common.setDirectiveScope($table, $scope);
                    var ngMaster = $attrs.ngMaster;
                    if (ngMaster != null && ngMaster.trim && ngMaster.trim().toLowerCase() == "true") {
                        $scope.fromMasterForm = true;
                    }
                    var formScope = $scope.fromMasterForm ? Joove.Common.getMasterScope() : Joove.Common.getScope();
                    var securityTimeout;
                    var _tools = {
                        updateVisiblePages: function (page) {
                            var visiblePages = [];
                            for (var i = 0; i < $scope.$totalPages; i++) {
                                if (i === 0 || // first
                                    i === $scope.$totalPages - 1 || // last
                                    i === $scope.$currentPage || // current
                                    i === $scope.$currentPage - 1 || // prev
                                    i === $scope.$currentPage + 1) { // next
                                    visiblePages.push(i);
                                }
                                else {
                                    if (i === 1) {
                                        visiblePages.push(-1); // ... for all prev pages
                                    }
                                    else if (i === $scope.$totalPages - 2) {
                                        visiblePages.push(-2); // ... for all next pages
                                    }
                                }
                            }
                            $scope.$visiblePagerPages = visiblePages;
                        },
                        gridChanged: function (dontMakeFormDirty) {
                            clearTimeout(securityTimeout);
                            dontMakeFormDirty = true; // force this since for the moment DS Grids are readonly
                            securityTimeout = setTimeout(function () {
                                Joove.Core.onChange($table, null, dontMakeFormDirty);
                            }, 45);
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
                            $(window).on("resize", function () {
                                _tools.onResize();
                            });
                            setTimeout(function () {
                                _tools.onResize();
                            }, 500);
                        },
                        scrollToTop: function () {
                            var $fieldSet = $table.closest("[jb-type='FieldSet']").get(0);
                            if ($fieldSet == null)
                                return;
                            $fieldSet.scrollIntoView({ behavior: "smooth", block: "start" });
                        },
                        onResize: function () {
                            if ($scope.$mobileThreshold == null ||
                                isNaN($scope.$mobileThreshold) === true ||
                                $scope.$mobileThreshold < 0) {
                                return;
                            }
                            var newCardMode = $(window).width() < $scope.$mobileThreshold;
                            if ($scope.$cardMode == newCardMode)
                                return;
                            $scope.$cardMode = newCardMode;
                            Joove.Core.applyScope($scope);
                        },
                        getOrderMark: function (dir) {
                            if (dir == Joove.OrderByDirections.DESC) {
                                return "<span style='font-size: 22px' class='order-by-mark order-mark-desc'>⇩</span>";
                            }
                            else if (dir == Joove.OrderByDirections.ASC) {
                                return "<span style='font-size: 22px' class='order-by-mark order-mark-asc'>⇧</span>";
                            }
                            else {
                                return null;
                            }
                        },
                        clearAllFilters: function () {
                            $scope._helper.clearAllFilters();
                            var filterTextBox = $table.find("[joove-ds-filter]");
                            if (filterTextBox.length > 0) {
                                filterTextBox.val("");
                            }
                            else {
                                $("[joove-ds-filter-for='" + $attrs.jooveDataset + "']").val("");
                            }
                            $scope.$refresh();
                        }
                    };
                    $scope.$watchCollection("$collection", function (newValue, oldValue) {
                        if (Joove.Common.collectionsAreEqual(newValue, oldValue))
                            return;
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
                    $scope.$clearFilters = function (e) {
                        _tools.clearAllFilters();
                    };
                    $scope.$applyFilters = function (e) {
                        $scope.$gotoPage(0, true, true);
                    };
                    $scope.$add = function (item) {
                        console.error("Datasource Grid -ADD- not implemented");
                        //$model().push(item || {});
                        //$scope.$gotoLastPage();
                    };
                    $scope.$remove = function (item) {
                        if (options.confirm === true) {
                            window._popUpManager.question(window._resourcesManager
                                .getGlobalResource("RES_WEBFORM_GenericConfirmationQuestion"), "", function () {
                                $scope.$doRemove(item);
                                $scope.$digest();
                            });
                        }
                        else {
                            $scope.$doRemove(item);
                        }
                    };
                    $scope.$doRemove = function (item) {
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
                    $scope.$nextPage = function () {
                        $scope.$gotoPage($scope.$currentPage + 1);
                    };
                    $scope.$prevPage = function () {
                        $scope.$gotoPage($scope.$currentPage - 1);
                    };
                    $scope.$gotoLastPage = function () {
                        $scope.$gotoPage(Math.ceil($scope.$totalRows / $scope.$pageSize) - 1);
                    };
                    $scope.$gotoFirstPage = function () {
                        $scope.$gotoPage(0);
                    };
                    $scope.$gotoPage = function (page, offTheRecord, force) {
                        if (page < 0)
                            return;
                        if (page > $scope.$totalPages - 1)
                            page = $scope.$totalPages - 1;
                        if ($scope.$currentPage == page && force !== true)
                            return;
                        $scope.$currentPage = page;
                        $scope._helper.status.currentPage = page;
                        $scope.$refresh(function (data) {
                            _tools.updateVisiblePages();
                        });
                        //if (!offTheRecord) {
                        //    gridChanged(true);
                        //}
                        //do not scroll on page refresh
                        if (force !== true) {
                            _tools.scrollToTop();
                        }
                        //if ($scope.$cardMode === true) {
                        //}
                    };
                    $scope.$refresh = function (cb) {
                        $scope._helper.fetchData(function (resp) {
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
                            setTimeout(function () {
                                window._ruleEngine.applyDataSetRulesResult(resp.RuleEvaluations);
                            }, 10);
                            $scope._helper.refreshImages();
                            cb && cb(resp);
                        });
                    };
                    $scope.$addFilter = function (e, columnName, filterOp, rowOp, overwriteExisting, autoApply) {
                        var value = $(e.target).val();
                        var filterOpEnum = Joove.DatasourceManager.parseStringToFilterOperator(filterOp);
                        var rowOpEnum = Joove.DatasourceManager.parseStringToRowOperator(rowOp);
                        $scope._helper.clearGlobalFilter();
                        $table.find("[joove-ds-global-filter]").val("");
                        $scope._helper.addFilter(columnName, value, filterOpEnum, rowOpEnum, overwriteExisting, FilterType.Simple);
                        if (autoApply === true) {
                            $scope.$gotoPage(0, true, true);
                        }
                    };
                    $scope.$globalFilter = function (e, autoApply) {
                        var value = $(e.target).val();
                        $table.find("[joove-ds-filter]:not([joove-ds-global-filter])").val("");
                        if ($scope._helper.globalFilterChanged(value) === false)
                            return;
                        $scope._helper.globalFilter(value);
                        if (autoApply === true) {
                            $scope.$gotoPage(0, true, true);
                        }
                    };
                    $scope.$sortBy = function (e, columnName) {
                        var $el = $(e.target);
                        var orderDirectionData = $el.data("ordeBy");
                        var orderByEnum = Joove.OrderByDirections.NONE;
                        if (orderDirectionData == "ASC") {
                            orderByEnum = Joove.OrderByDirections.DESC;
                            $el.data("ordeBy", "DESC");
                        }
                        else if (orderDirectionData == "DESC") {
                            orderByEnum = Joove.OrderByDirections.NONE;
                            $el.data("ordeBy", "NONE");
                        }
                        else if (orderDirectionData == "NONE" || orderDirectionData == null) {
                            orderByEnum = Joove.OrderByDirections.ASC;
                            $el.data("ordeBy", "ASC");
                        }
                        $(".order-by-mark").remove();
                        var $mark = _tools.getOrderMark(orderByEnum);
                        if ($mark != null) {
                            $el.after($mark);
                        }
                        $scope._helper.addOrderBy(columnName, orderByEnum, true);
                        $scope.$gotoPage(0, true, true);
                    };
                    $timeout(function () {
                        _tools.init();
                    });
                    Joove.DatasourceManager.watchDependencies(formScope, $table, function () {
                        $scope.$refresh();
                    });
                    Joove.Common.markDirectiveScopeAsReady($table);
                }
            };
        }
        angular
            .module("jooveDsGrid", [])
            .provider("jooveDsGrid", new JooveDatasourceGridProvider())
            .directive("jooveDsGrid", [
            "$timeout",
            "$interval",
            "$compile",
            "jooveDsGrid",
            jooveDsGrid
        ]);
        var FilterType;
        (function (FilterType) {
            FilterType[FilterType["Global"] = 0] = "Global";
            FilterType[FilterType["Simple"] = 1] = "Simple";
        })(FilterType = Widgets.FilterType || (Widgets.FilterType = {}));
        var DataSourceGridFilter = /** @class */ (function (_super) {
            __extends(DataSourceGridFilter, _super);
            function DataSourceGridFilter() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return DataSourceGridFilter;
        }(Joove.FilterInfo));
        Widgets.DataSourceGridFilter = DataSourceGridFilter;
        var JooveGridHelper = /** @class */ (function () {
            function JooveGridHelper($el, pageSize, fromMasterForm) {
                this.parentIsVisible = true;
                this.hideTimeout = 150;
                this.fromMasterForm = false;
                this.status = {
                    filterBy: [],
                    orderBy: [],
                    currentPage: 0,
                    pageSize: pageSize,
                    columns: Joove.DatasourceManager.getDataSetColumnInfoFromControl($el)
                };
                this.$element = $el;
                this.fromMasterForm = fromMasterForm;
            }
            JooveGridHelper.prototype.hideParentFieldSet = function () {
                this.$element.closest("[jb-type='FieldSet']").css("opacity", "0");
                this.parentIsVisible = false;
            };
            JooveGridHelper.prototype.showParentFieldSet = function () {
                var _this = this;
                setTimeout(function () {
                    _this.$element.closest("[jb-type='FieldSet']").css("opacity", "1");
                    _this.parentIsVisible = true;
                }, this.hideTimeout);
            };
            JooveGridHelper.prototype.refreshImages = function () {
                var elements = $("[jb-type='ImageBox']", this.$element);
                var ids = [];
                elements.each(function (index) {
                    var id = $(this).attr('jb-id');
                    if (ids.indexOf(id) == -1) {
                        ids.add(id);
                    }
                });
                if (ids.length > 0) {
                    window._commander.imageRefresh(ids);
                }
            };
            JooveGridHelper.prototype.prepareRequest = function () {
                var startRow = this.status.currentPage * this.status.pageSize;
                if (startRow < 0) {
                    startRow = 0;
                }
                var request = new Joove.DatasourceRequest(this.$element, startRow, this.status.pageSize, this.status.filterBy, this.status.orderBy);
                return request;
            };
            JooveGridHelper.prototype.fetchData = function (cb) {
                var _this = this;
                var self = this;
                var requestInfo = this.prepareRequest();
                Joove.DatasourceManager.fetchDatasource(this.$element, Joove.Core.getElementName(this.$element), requestInfo, {
                    success: function (response) {
                        cb && cb(response);
                        if (_this.parentIsVisible == true)
                            return;
                        _this.showParentFieldSet();
                    },
                    error: function () {
                        console.error("Error fetching grid datasource");
                    }
                }, self.fromMasterForm);
            };
            JooveGridHelper.prototype.globalFilterChanged = function (newValue) {
                return this.lastGlobalFilter != newValue;
            };
            JooveGridHelper.prototype.globalFilter = function (value) {
                this.clearAllFilters();
                this.lastGlobalFilter = value;
                if (value == null || value.trim().length == 0)
                    return;
                for (var i = 0; i < this.status.columns.length; i++) {
                    var current = this.status.columns[i];
                    if (current.searchable !== true)
                        continue;
                    this.addFilter(current.name, value, Joove.FilterOperators.LIKE, Joove.RowOperators.OR, true, FilterType.Global);
                }
            };
            JooveGridHelper.prototype.clearAllFilters = function () {
                this.status.filterBy = [];
            };
            JooveGridHelper.prototype.clearGlobalFilter = function () {
                var indexesToSplice = [];
                var filtersToRemain = [];
                for (var i = 0; i < this.status.filterBy.length; i++) {
                    var current = this.status.filterBy[i];
                    if (current.type != FilterType.Global) {
                        filtersToRemain.push(current);
                    }
                }
                this.status.filterBy = filtersToRemain;
            };
            JooveGridHelper.prototype.addFilter = function (columnName, value, filterOp, rowOp, overwriteExisting, type) {
                var column = this.getColumnInfoByName(columnName);
                if (overwriteExisting === true) {
                    var indexToSplice = -1;
                    for (var i = 0; i < this.status.filterBy.length; i++) {
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
            };
            JooveGridHelper.prototype.addOrderBy = function (columnName, direction, removeOthers) {
                var indexToSplice = -1;
                if (removeOthers == true) {
                    this.status.orderBy = [];
                }
                else {
                    for (var i = 0; i < this.status.orderBy.length; i++) {
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
                if (direction == Joove.OrderByDirections.NONE)
                    return;
                var column = this.getColumnInfoByName(columnName);
                this.status.orderBy.push(new Joove.OrderByInfo(column, direction));
            };
            JooveGridHelper.prototype.getColumnInfoByName = function (name) {
                for (var i = 0; i < this.status.columns.length; i++) {
                    var current = this.status.columns[i];
                    if (current.name == name)
                        return current;
                }
                return null;
            };
            return JooveGridHelper;
        }());
        Widgets.JooveGridHelper = JooveGridHelper;
    })(Widgets = Joove.Widgets || (Joove.Widgets = {}));
})(Joove || (Joove = {}));
