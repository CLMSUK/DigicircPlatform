namespace Joove.Widgets {

    class JooveGridProvider extends BaseAngularProvider {
    }

   

    class CheckManager {

        public collection: Array<any>;
        private _checkedItems: Array<any>;

        constructor(collection: Array<any>,  scope: IJooveScope) {
            this.collection = collection;
            this._checkedItems = new Array<any>();
        }

        check = (item: any) => {
            this._checkedItems.push(item);
        }

        uncheck = (item: any) => {
            this._checkedItems.remove(item);
        }

        uncheckMultiple = (items: Array<any>) => {
            for (let i = 0; i < items.length; i++) {
                this.uncheck(items[i]);
            }
        }

        isChecked = (item: any): boolean => {
            return this._checkedItems.contains(item);
        }

        isUnchecked = (item: any): boolean => {
            return !this.isChecked(item);
        }

        toggle = (item: any) => {
            var checked = this._checkedItems.contains(item);
            checked === true ? this.uncheck(item) : this.check(item);
        }

        getChecked = (): Array<any> => {
            return this._checkedItems;
        }

        getUnchecked = (): Array<any> => {
            var unchecked: Array<any>;
            for (let i = 0; i < this.collection.length; i++) {
                var notExists = this._checkedItems.indexOf(this.collection[i]) == -1;
                if (notExists === false) unchecked.push(this.collection[i]);
            }
            return unchecked;
        }

        checkAll = () => {
            this.uncheckAll();
            for (let i = 0; i < this.collection.length; i++) {
                this._checkedItems.push(this.collection[i]);
            }
        }

        uncheckAll = () => {
            this._checkedItems.splice(0, this._checkedItems.length);
        }

        toggleCheckAll = (check:boolean) => {
            check ? this.checkAll() : this.uncheckAll();
        }

    }

    interface IJooveGridScope extends IJooveScope {
        collection;
        $filteredItems: Array<any>;

        $visiblePagerPages: typeof undefined[];
        $currentPage: number;
        $pageSize: number;
        $add: (item: any) => void;
        $gotoLastPage(wait?:boolean);
        $remove: (item: any, e?: Event) => void;
        $doRemove(item: any, e?: Event);
        $gotoPage(page: number, offTheRecord?: boolean);
        $nextPage: () => void;
        $prevPage: () => void;
        $gotoFirstPage: () => void;

        $checkedAll: boolean;

        $searchTerm: string;
        $clearSearch: () => void;
        $gridFilter: (searchColumns: Array<string>) => any;

        $checkManager: CheckManager;
        $multiDeleteEnabled: boolean;
    }

    function jooveGrid($timeout: ng.ITimeoutService, $interval: ng.IIntervalService, $compile: any, joovegrid): ng.
        IDirective {
        var defaultOptions = joovegrid.getOptions();

        return {
            priority: 1001,
            require: ["ngModel"],
            restrict: "AE",
            scope: true,
            link: ($scope: IJooveGridScope, $table: any, $attrs: any, ngModelCtrl) => {
                var $model = () => $scope.$eval($attrs.ngModel);

                var _itemsTypeName = $table.attr("jb-original-typeclass-name");
                var _itemsTypeNameAsViewModel = $table.attr("jb-client-dto");

                if ($model() == null) {
                    $scope.$eval($attrs.ngModel + " = []");
                }

                Common.setDirectiveScope($table, $scope);

                var changeTimeout: number;
                var changeByUserInProgress: boolean = false;

                var options = JSON.parse($attrs.joovegridoptions);

                function gridChanged(dontMakeFormDirty: boolean) {                 
                    changeByUserInProgress = true;

                    clearTimeout(changeTimeout);

                    changeTimeout = setTimeout(() => {                                                
                        triggerChange(dontMakeFormDirty);                                                                                                       
                    }, 45) as any;                

                    setTimeout(() => {
                        changeByUserInProgress = false;
                    }, 500);          
                }

                var loadingTm = null;
                function triggerChange(dontMakeFormDirty) {
                    clearTimeout(loadingTm);
                    if ($table.is(":visible") === false) {
                        loadingTm = setTimeout(() => {
                            triggerChange(dontMakeFormDirty);
                        }, 300);
                        return;
                    }

                    Joove.Core.onChange($table as any, null, dontMakeFormDirty);
                }

                $scope.$on("$destroy", () => {
                    clearTimeout(loadingTm);
                });

                //No need to apply a watcher if no search box is present
                if (options.appliedFilter === "ByFields") {
                    $scope.$watch('$searchTerm',
                        (newValue: Array<any>, oldValue: Array<any>) => {
                            updateVisiblePages();
                        });
                }

                //Watch for the filteredItems only if a dynamic filter is present
                if (options.appliedFilter === "ByExpression") {
                    $scope.$watch("$scope.$filteredItems",
                        (newValue: Array<any>, oldValue: Array<any>) => {
                            updateVisiblePages();
                        });
                }


                $scope.$watchCollection($attrs.ngModel,
                    (newValue: Array<any>, oldValue: Array<any>) => {
                        if (Common.collectionsAreEqual(newValue, oldValue)) return;

                        updateVisiblePages();

                        if (changeByUserInProgress === true) return;
                        
                        triggerChange(true);
                    });              

                $scope.$pageSize = parseInt(options.pageSize);
    
                if (isNaN($scope.$pageSize)) {
                    $scope.$pageSize  = defaultOptions.pageSize;
                }

                $scope.$visiblePagerPages = [];
                $scope.$currentPage = 0;

                $scope.$add = item => {
                    let toAdd: any;
                    let usedTypeName: any;

                    if (item != null) {
                        toAdd = item;
                    }
                    else {
                        try {
                            toAdd = eval(`new ${_itemsTypeNameAsViewModel}()`);
                            usedTypeName = _itemsTypeNameAsViewModel;
                        } catch (e) {
                            try {
                                toAdd = eval(`new ${_itemsTypeName}()`);
                                usedTypeName = _itemsTypeName;
                            } catch (e) {
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

                $scope.$remove = (item, e?: Event) => {
                    if (options.confirm === true) {
                        let question = options.confirmMessage;
                        if (question == null || question.trim() == "") {
                            question = window._resourcesManager.getGlobalResource("RES_WEBFORM_GenericConfirmationQuestion");
                        }
                        window._popUpManager.question(question, "",
                            function (confirm) {
                                if (confirm == false) return;

                                $scope.$doRemove(item, e);
                                $scope.$digest();
                            });
                    } else {                       
                        $scope.$doRemove(item, e);
                    }
                };

                $scope.$doRemove = (item, e?: Event) => {
                    var model = $model();
                    for (let i = 0; i < $model().length; i++) {                          
                        if (item === model[i]) {                            
                            removeAnyFileAttachments(e, () => {                                
                                model.splice(i, 1);
                                gridChanged(false);                                
                            });                            
                            break;
                        }                        
                    }
                    $scope.$gotoPage($scope.$currentPage, true);
                };

                $scope.$nextPage = () => {
                    $scope.$gotoPage($scope.$currentPage + 1);
                };

                $scope.$prevPage = () => {
                    $scope.$gotoPage($scope.$currentPage - 1);
                };

                $scope.$gotoLastPage = (wait?: boolean) => {
                    //Wait only if you're told to and the grid is to be filtered
                    if (wait === true) {
                        if ((options.appliedFilter === "ByExpression") || (options.appliedFilter === "ByFields" && Common.stringIsNullOrEmpty($scope.$searchTerm) == false)) {
                            setTimeout(() => {
                                $scope.$gotoPage(Math.ceil($scope.getCollectionCount() / $scope.$pageSize) - 1);
                            }, 1000);  
                        }
                    }
                    else {
                        $scope.$gotoPage(Math.ceil($scope.getCollectionCount() / $scope.$pageSize) - 1);
                    }
                };

                $scope.$gotoFirstPage = () => {
                    $scope.$gotoPage(0);
                };

                $scope.$gotoPage = (page: number, offTheRecord?: boolean) => {
                    if (page < 0) return;

                    var totalPages = Math.ceil($scope.getCollectionCount() / $scope.$pageSize);

                    if (page > totalPages - 1 && totalPages > 0) page = totalPages - 1;

                    $scope.$currentPage = page;

                    updateVisiblePages(page);

                    if (!offTheRecord) {
                        gridChanged(true);
                    }
                };

                $scope.$clearSearch = () => {
                    $scope.$searchTerm = null;
                    updateVisiblePages();
                }

                $scope.$updateSearchTerm = ($event) => {
                    if ($event.keyCode == 13) {
                        $($event.target).blur();
                    }
                }

                $scope.$gridFilter = function (searchColumns: Array<string>) {
                    return function (item) {
                        if (options.appliedFilter !== "ByFields") return true;
                        if ($scope.$searchTerm == null || $scope.$searchTerm.trim() == "") return true;
                        if (searchColumns == null || searchColumns.length == 0) return true;

                        let searchTerm = $scope.$searchTerm.toLowerCase();
                        let found = false;
                        for (let i = 0; i < searchColumns.length; i++) {
                            let column = searchColumns[i];
                            if (item[column] && item[column].toString() && item[column].toString().toLowerCase().indexOf(searchTerm) > -1) {                               
                                return true;
                            }
                        }
                        
                        return false;
                    };                   
                };

                function removeAnyFileAttachments(e: Event, onFinish: Function) {
                    if (e == null) {
                        onFinish();
                        return;
                    }
                    
                    const $row = $(e.target).closest("tr");                                        
                    const $attachments = $row.find("[jb-type='FileAttachment']:not(.grid-removed)");
                    
                    if ($attachments.length > 0) {
                        removeAttachment($attachments.eq(0), () => {
                            removeAnyFileAttachments(e, onFinish);
                        });
                    }
                    else {
                        onFinish();
                    }
                 
                }

                function removeAttachment($attachment: JQuery, cb: Function) {
                    $attachment.addClass("grid-removed");

                    const indexes = Common.getIndexesOfControl($attachment);
                    const id = $attachment.attr("jb-id");
                    const controller = Core.getControllerForElement($attachment, false);
                    
                    Core.executeControllerAction(controller,
                        `${id}_Remove`,
                        "POST",
                        [],
                        { model: Common.getModel(), indexes: indexes.key, removedAutomatically: true },
                        null,
                        data => { cb && cb(); }
                    );
                }

                $scope.getCollectionCount = function() { 
                    //In the beginning, nothing is filtered. Thus, $model() and $filteredItems should be the same
                    //Same goes for the case that the searchTerm is empty
                    if (options.appliedFilter == "ByFields") {
                        if ($scope.$filteredItems == null || Common.stringIsNullOrEmpty($scope.$searchTerm) == true) $scope.$filteredItems = $model();
                    }

                    var filteredItemsCount = $scope.$filteredItems == null ? 0 : $scope.$filteredItems.length;
                    return filteredItemsCount;
                }

                function updateVisiblePages(page?: number) {
                    const visiblePages = [];
                    const totalPages = Math.ceil($scope.getCollectionCount() / $scope.$pageSize );
                
                    for (let i = 0; i < totalPages; i++) {
                        if (i === 0 || // first
                            i === totalPages - 1 || // last
                            i === $scope.$currentPage || // current
                            i === $scope.$currentPage - 1 || // prev
                            i === $scope.$currentPage + 1) { // next
                            visiblePages.push(i);
                        } else {
                            if (i === 1) {
                                visiblePages.push(-1); // ... for all prev pages
                            } else if (i === totalPages - 2) {
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

                $scope.$enableMultiDelete = (doEnable: boolean) => {
                    $scope.$checkManager = new CheckManager($scope.$filteredItems, $scope);
                    $scope.$multiDeleteEnabled = doEnable;
                }

                $scope.$doMultiRemove = () => {
                    var items = $scope.$checkManager.getChecked();
                    var removed = new Array<any>();

                    for (var i = 0; i < items.length; i++) {
                        $scope.$doRemove(items[i]);
                        removed.push(items[i]);
                    }

                    $scope.$checkManager.uncheckMultiple(removed);
                    $scope.$enableMultiDelete(false);
                }

                $scope.$multiRemove = () => {
                    if (options.multiConfirm === true) {
                        let question = options.multiConfirmMessage;
                        if (question == null || question.trim() == "") {
                            question = window._resourcesManager.getGlobalResource("RES_WEBFORM_GenericConfirmationQuestion");
                        }
                        window._popUpManager.question(question, "",
                            function (confirm) {
                                if (confirm == false) return;

                                $scope.$doMultiRemove();
                            });
                    } else {
                        $scope.$doMultiRemove();
                    }
                };


                $scope.$toggleSelectAll = ($event) => {
                    $scope.$checkManager.toggleCheckAll((event.target as any).checked);
                }
               
                $scope.$navigateToRelatedControlFromValidation = (entry: Joove.Validation.BindingEntry) => {
                    Joove.Validation.UiHelper.navigateToRelatedControl(entry);
                }

                 /* END */

                Common.markDirectiveScopeAsReady($table);
            }
        };

    }

    angular
        .module("joovegrid", [])
        .provider("joovegrid", new JooveGridProvider())
        .directive("joovegrid",
        [
            "$timeout",
            "$interval",
            "$compile",
            "joovegrid",
            jooveGrid
        ]);

}