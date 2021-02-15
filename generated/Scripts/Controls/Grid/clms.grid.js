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
        var JooveGridProvider = /** @class */ (function (_super) {
            __extends(JooveGridProvider, _super);
            function JooveGridProvider() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return JooveGridProvider;
        }(Joove.BaseAngularProvider));
        var CheckManager = /** @class */ (function () {
            function CheckManager(collection, scope) {
                var _this = this;
                this.check = function (item) {
                    _this._checkedItems.push(item);
                };
                this.uncheck = function (item) {
                    _this._checkedItems.remove(item);
                };
                this.uncheckMultiple = function (items) {
                    for (var i = 0; i < items.length; i++) {
                        _this.uncheck(items[i]);
                    }
                };
                this.isChecked = function (item) {
                    return _this._checkedItems.contains(item);
                };
                this.isUnchecked = function (item) {
                    return !_this.isChecked(item);
                };
                this.toggle = function (item) {
                    var checked = _this._checkedItems.contains(item);
                    checked === true ? _this.uncheck(item) : _this.check(item);
                };
                this.getChecked = function () {
                    return _this._checkedItems;
                };
                this.getUnchecked = function () {
                    var unchecked;
                    for (var i = 0; i < _this.collection.length; i++) {
                        var notExists = _this._checkedItems.indexOf(_this.collection[i]) == -1;
                        if (notExists === false)
                            unchecked.push(_this.collection[i]);
                    }
                    return unchecked;
                };
                this.checkAll = function () {
                    _this.uncheckAll();
                    for (var i = 0; i < _this.collection.length; i++) {
                        _this._checkedItems.push(_this.collection[i]);
                    }
                };
                this.uncheckAll = function () {
                    _this._checkedItems.splice(0, _this._checkedItems.length);
                };
                this.toggleCheckAll = function (check) {
                    check ? _this.checkAll() : _this.uncheckAll();
                };
                this.collection = collection;
                this._checkedItems = new Array();
            }
            return CheckManager;
        }());
        function jooveGrid($timeout, $interval, $compile, joovegrid) {
            var defaultOptions = joovegrid.getOptions();
            return {
                priority: 1001,
                require: ["ngModel"],
                restrict: "AE",
                scope: true,
                link: function ($scope, $table, $attrs, ngModelCtrl) {
                    var $model = function () { return $scope.$eval($attrs.ngModel); };
                    var _itemsTypeName = $table.attr("jb-original-typeclass-name");
                    var _itemsTypeNameAsViewModel = $table.attr("jb-client-dto");
                    if ($model() == null) {
                        $scope.$eval($attrs.ngModel + " = []");
                    }
                    Joove.Common.setDirectiveScope($table, $scope);
                    var changeTimeout;
                    var changeByUserInProgress = false;
                    var options = JSON.parse($attrs.joovegridoptions);
                    function gridChanged(dontMakeFormDirty) {
                        changeByUserInProgress = true;
                        clearTimeout(changeTimeout);
                        changeTimeout = setTimeout(function () {
                            triggerChange(dontMakeFormDirty);
                        }, 45);
                        setTimeout(function () {
                            changeByUserInProgress = false;
                        }, 500);
                    }
                    var loadingTm = null;
                    function triggerChange(dontMakeFormDirty) {
                        clearTimeout(loadingTm);
                        if ($table.is(":visible") === false) {
                            loadingTm = setTimeout(function () {
                                triggerChange(dontMakeFormDirty);
                            }, 300);
                            return;
                        }
                        Joove.Core.onChange($table, null, dontMakeFormDirty);
                    }
                    $scope.$on("$destroy", function () {
                        clearTimeout(loadingTm);
                    });
                    //No need to apply a watcher if no search box is present
                    if (options.appliedFilter === "ByFields") {
                        $scope.$watch('$searchTerm', function (newValue, oldValue) {
                            updateVisiblePages();
                        });
                    }
                    //Watch for the filteredItems only if a dynamic filter is present
                    if (options.appliedFilter === "ByExpression") {
                        $scope.$watch("$scope.$filteredItems", function (newValue, oldValue) {
                            updateVisiblePages();
                        });
                    }
                    $scope.$watchCollection($attrs.ngModel, function (newValue, oldValue) {
                        if (Joove.Common.collectionsAreEqual(newValue, oldValue))
                            return;
                        updateVisiblePages();
                        if (changeByUserInProgress === true)
                            return;
                        triggerChange(true);
                    });
                    $scope.$pageSize = parseInt(options.pageSize);
                    if (isNaN($scope.$pageSize)) {
                        $scope.$pageSize = defaultOptions.pageSize;
                    }
                    $scope.$visiblePagerPages = [];
                    $scope.$currentPage = 0;
                    $scope.$add = function (item) {
                        var toAdd;
                        var usedTypeName;
                        if (item != null) {
                            toAdd = item;
                        }
                        else {
                            try {
                                toAdd = eval("new " + _itemsTypeNameAsViewModel + "()");
                                usedTypeName = _itemsTypeNameAsViewModel;
                            }
                            catch (e) {
                                try {
                                    toAdd = eval("new " + _itemsTypeName + "()");
                                    usedTypeName = _itemsTypeName;
                                }
                                catch (e) {
                                    toAdd = {};
                                }
                            }
                        }
                        if (toAdd._originalTypeClassName == null) {
                            toAdd._originalTypeClassName = usedTypeName;
                        }
                        if ($model() == null) {
                            $scope.$eval($attrs.ngModel + " = []");
                        }
                        $model().push(toAdd);
                        $scope.$gotoLastPage();
                        gridChanged(false);
                    };
                    $scope.$remove = function (item, e) {
                        if (options.confirm === true) {
                            var question = options.confirmMessage;
                            if (question == null || question.trim() == "") {
                                question = window._resourcesManager.getGlobalResource("RES_WEBFORM_GenericConfirmationQuestion");
                            }
                            window._popUpManager.question(question, "", function (confirm) {
                                if (confirm == false)
                                    return;
                                $scope.$doRemove(item, e);
                                $scope.$digest();
                            });
                        }
                        else {
                            $scope.$doRemove(item, e);
                        }
                    };
                    $scope.$doRemove = function (item, e) {
                        var model = $model();
                        var _loop_1 = function (i) {
                            if (item === model[i]) {
                                removeAnyFileAttachments(e, function () {
                                    model.splice(i, 1);
                                    gridChanged(false);
                                });
                                return "break";
                            }
                        };
                        for (var i = 0; i < $model().length; i++) {
                            var state_1 = _loop_1(i);
                            if (state_1 === "break")
                                break;
                        }
                        $scope.$gotoPage($scope.$currentPage, true);
                    };
                    $scope.$nextPage = function () {
                        $scope.$gotoPage($scope.$currentPage + 1);
                    };
                    $scope.$prevPage = function () {
                        $scope.$gotoPage($scope.$currentPage - 1);
                    };
                    $scope.$gotoLastPage = function (wait) {
                        //Wait only if you're told to and the grid is to be filtered
                        if (wait === true) {
                            if ((options.appliedFilter === "ByExpression") || (options.appliedFilter === "ByFields" && Joove.Common.stringIsNullOrEmpty($scope.$searchTerm) == false)) {
                                setTimeout(function () {
                                    $scope.$gotoPage(Math.ceil($scope.getCollectionCount() / $scope.$pageSize) - 1);
                                }, 1000);
                            }
                        }
                        else {
                            $scope.$gotoPage(Math.ceil($scope.getCollectionCount() / $scope.$pageSize) - 1);
                        }
                    };
                    $scope.$gotoFirstPage = function () {
                        $scope.$gotoPage(0);
                    };
                    $scope.$gotoPage = function (page, offTheRecord) {
                        if (page < 0)
                            return;
                        var totalPages = Math.ceil($scope.getCollectionCount() / $scope.$pageSize);
                        if (page > totalPages - 1 && totalPages > 0)
                            page = totalPages - 1;
                        $scope.$currentPage = page;
                        updateVisiblePages(page);
                        if (!offTheRecord) {
                            gridChanged(true);
                        }
                    };
                    $scope.$clearSearch = function () {
                        $scope.$searchTerm = null;
                        updateVisiblePages();
                    };
                    $scope.$updateSearchTerm = function ($event) {
                        if ($event.keyCode == 13) {
                            $($event.target).blur();
                        }
                    };
                    $scope.$gridFilter = function (searchColumns) {
                        return function (item) {
                            if (options.appliedFilter !== "ByFields")
                                return true;
                            if ($scope.$searchTerm == null || $scope.$searchTerm.trim() == "")
                                return true;
                            if (searchColumns == null || searchColumns.length == 0)
                                return true;
                            var searchTerm = $scope.$searchTerm.toLowerCase();
                            var found = false;
                            for (var i = 0; i < searchColumns.length; i++) {
                                var column = searchColumns[i];
                                if (item[column] && item[column].toString() && item[column].toString().toLowerCase().indexOf(searchTerm) > -1) {
                                    return true;
                                }
                            }
                            return false;
                        };
                    };
                    function removeAnyFileAttachments(e, onFinish) {
                        if (e == null) {
                            onFinish();
                            return;
                        }
                        var $row = $(e.target).closest("tr");
                        var $attachments = $row.find("[jb-type='FileAttachment']:not(.grid-removed)");
                        if ($attachments.length > 0) {
                            removeAttachment($attachments.eq(0), function () {
                                removeAnyFileAttachments(e, onFinish);
                            });
                        }
                        else {
                            onFinish();
                        }
                    }
                    function removeAttachment($attachment, cb) {
                        $attachment.addClass("grid-removed");
                        var indexes = Joove.Common.getIndexesOfControl($attachment);
                        var id = $attachment.attr("jb-id");
                        var controller = Joove.Core.getControllerForElement($attachment, false);
                        Joove.Core.executeControllerAction(controller, id + "_Remove", "POST", [], { model: Joove.Common.getModel(), indexes: indexes.key, removedAutomatically: true }, null, function (data) { cb && cb(); });
                    }
                    $scope.getCollectionCount = function () {
                        //In the beginning, nothing is filtered. Thus, $model() and $filteredItems should be the same
                        //Same goes for the case that the searchTerm is empty
                        if (options.appliedFilter == "ByFields") {
                            if ($scope.$filteredItems == null || Joove.Common.stringIsNullOrEmpty($scope.$searchTerm) == true)
                                $scope.$filteredItems = $model();
                        }
                        var filteredItemsCount = $scope.$filteredItems == null ? 0 : $scope.$filteredItems.length;
                        return filteredItemsCount;
                    };
                    function updateVisiblePages(page) {
                        var visiblePages = [];
                        var totalPages = Math.ceil($scope.getCollectionCount() / $scope.$pageSize);
                        for (var i = 0; i < totalPages; i++) {
                            if (i === 0 || // first
                                i === totalPages - 1 || // last
                                i === $scope.$currentPage || // current
                                i === $scope.$currentPage - 1 || // prev
                                i === $scope.$currentPage + 1) { // next
                                visiblePages.push(i);
                            }
                            else {
                                if (i === 1) {
                                    visiblePages.push(-1); // ... for all prev pages
                                }
                                else if (i === totalPages - 2) {
                                    visiblePages.push(-2); // ... for all next pages
                                }
                            }
                        }
                        $scope.$visiblePagerPages = visiblePages;
                        //Correct currently selected page, if needed 
                        if ((totalPages - 1) < $scope.$currentPage) {
                            $scope.$gotoLastPage();
                            return;
                        }
                        if ($scope.$currentPage < 0) {
                            $scope.$gotoFirstPage();
                            return;
                        }
                    }
                    /* BEGIN */
                    $scope.$filteredItems = $model(); //in the beginning nothing is filtered.
                    $scope.$gotoPage(0, true);
                    $scope.$multiDeleteEnabled = false;
                    $scope.$enableMultiDelete = function (doEnable) {
                        $scope.$checkManager = new CheckManager($scope.$filteredItems, $scope);
                        $scope.$multiDeleteEnabled = doEnable;
                    };
                    $scope.$doMultiRemove = function () {
                        var items = $scope.$checkManager.getChecked();
                        var removed = new Array();
                        for (var i = 0; i < items.length; i++) {
                            $scope.$doRemove(items[i]);
                            removed.push(items[i]);
                        }
                        $scope.$checkManager.uncheckMultiple(removed);
                        $scope.$enableMultiDelete(false);
                    };
                    $scope.$multiRemove = function () {
                        if (options.multiConfirm === true) {
                            var question = options.multiConfirmMessage;
                            if (question == null || question.trim() == "") {
                                question = window._resourcesManager.getGlobalResource("RES_WEBFORM_GenericConfirmationQuestion");
                            }
                            window._popUpManager.question(question, "", function (confirm) {
                                if (confirm == false)
                                    return;
                                $scope.$doMultiRemove();
                            });
                        }
                        else {
                            $scope.$doMultiRemove();
                        }
                    };
                    $scope.$toggleSelectAll = function ($event) {
                        $scope.$checkManager.toggleCheckAll(event.target.checked);
                    };
                    $scope.$navigateToRelatedControlFromValidation = function (entry) {
                        Joove.Validation.UiHelper.navigateToRelatedControl(entry);
                    };
                    /* END */
                    Joove.Common.markDirectiveScopeAsReady($table);
                }
            };
        }
        angular
            .module("joovegrid", [])
            .provider("joovegrid", new JooveGridProvider())
            .directive("joovegrid", [
            "$timeout",
            "$interval",
            "$compile",
            "joovegrid",
            jooveGrid
        ]);
    })(Widgets = Joove.Widgets || (Joove.Widgets = {}));
})(Joove || (Joove = {}));
