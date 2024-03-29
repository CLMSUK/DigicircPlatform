namespace Joove.Widgets {
    class JbPicklist extends BaseAngularProvider {
    }

    interface IJbPicklistScope extends IJooveScope {
        selectedItems: typeof undefined[];
        selectedItemKeys: typeof undefined[];
        fullRecordsetIsSelected: boolean;
        requestSelectedItemsfromServer: boolean;
        initialized: boolean;
        popUpName: any;
        picklist: ListControl;
        options: any;
        fromMasterForm;
        init();
        updateSelectionFromModel();
        updateModel: (items: Array<any>) => void;
        excludeSelected;
        owner: any;
    }

    function jbPicklist(): ng.IDirective {
        return {
            priority: 1001,
            require: "?ngModel",
            scope: {
                model: "=ngModel",
                owner: "=ngOwner",
                itemDataType: "=ngDatatype",
                excludeSelected: "=ngExclude"
            },
            restrict: "AE",
            link($scope: IJbPicklistScope, $element) {
                if (Common.directiveScopeIsReady($element)) return;

                $scope.selectedItems = [];
                $scope.selectedItemKeys = [];
                $scope.fullRecordsetIsSelected = false;
                $scope.requestSelectedItemsfromServer = false;

                $scope.initialized = false;
                $scope.popUpName = null;
                $scope.picklist = null;
                $scope.options = null;

                $element.addClass("picklist-enabled");

                Common.setDirectiveScope($element, $scope);

                var formScope = $scope.fromMasterForm === true
                    ? Common.getMasterScope()
                    : Common.getScope();

                const isBoundToRoot = $element.attr("ng-owner") === "model";
                const dtoTypeName = $element.attr("jb-client-dto");

                $element.on("click",
                    () => {
                        if ($scope.initialized === false) {
                            $scope.init();
                        }

                        window._popUpManager.showPopUp($scope.popUpName);
                        setTimeout(() => {
                            $scope.updateSelectionFromModel();
                            $scope.picklist.enable($scope.selectedItemKeys);

                            if ($scope.picklist.isInitialized === true) {
                                $scope.picklist.createInitializationLoadingElement();
                                $scope.picklist.updateData();
                            }
                        },
                            100);
                    });

                $scope.updateSelectionFromModel = () => {
                    $scope.selectedItemKeys = DatasourceManager.getKeys($scope.model);
                    $scope.picklist.status.selectedItemKeys = DatasourceManager
                        .getKeys($scope
                            .model); // run again to prevent assignment as pointer                    

                    if ($scope.model == null) {
                        $scope.selectedItems = [];
                    } else if ($scope.model.constructor === Array) {
                        $scope.selectedItems = $scope.model;
                    } else {
                        $scope.selectedItems = [$scope.model];
                    }
                }

                $scope.updateModel = (items) => {
                    // Multiselection means that picklist is bound to collection!!!!
                    var boundToCollection = $scope.options.hasMultiselection !== false;
                    var selectionIsArray = Array.isArray(items);

                    if (boundToCollection) {
                        $scope.model = selectionIsArray
                            ? items      // collection to collection: use as is
                            : [items];   // convert to collection
                    }
                    else {
                        $scope.model = selectionIsArray
                            ? items[0]   // use first
                            : items;     // single to single: use as is                        
                    }
           
                    if ($scope.owner != undefined) {
                        const modelPath = $element.attr("ng-model");
                        const parts = modelPath.split(".");
                        const last = parts[parts.length - 1];

                        if (isBoundToRoot) {
                            $scope.owner[last] = $scope.model;
                        } else {
                            Core.setBoClassPropertyFromInstance(last, $scope.owner, $scope.model);
                        }
                    }
                    formScope.model = formScope.dehydrate();
                    Joove.Core.applyScope(formScope);
                }

                $scope.init = () => {
                    var indexes = Common.getIndexesOfControl($element);
                    var buttonName = $element.attr("jb-id");
                    var picklistName = buttonName + "_PickList";
                    var $listContainer = $element.siblings('[jb-id="' + picklistName + '"]').eq(0);

                    $scope.popUpName = buttonName + indexes.key;
                    $scope.options = Common
                        .modelToJson(Common.replaceAll($listContainer.data("options"), "'", "\""));
                    $scope.options.excludeSelected = $scope.excludeSelected;
                    $scope.options.showRowNumbers = true;

                    $scope.picklist = new ListControl();
                    $scope.picklist.$ownerButton = $element;
                    $scope.picklist.init($listContainer.get(0), $scope.options);

                    window._popUpManager.destroyPopUp($scope.popUpName);

                    window._popUpManager.registerPopUp({
                        name: $scope.popUpName,
                        //draggable: true,
                        width: "90%",
                        height: "80%",
                        cancelButton: true,
                        okButton: true,
                        parentModal: window._popUpManager.getModalParent($element), 
                        okCallback: () => {
                            $scope.picklist.updateSelection((items) => {
                                const dtoType = window[window._context.appName]["ViewModels"][window._context.currentController][dtoTypeName];
                                if (items != null && dtoType != null) {
                                    if (Common.isArray(items)) {
                                        for (let c = 0; c < items.length; c++) {
                                            items[c] = dtoType._initializeFrom(items[c]);
                                        }
                                    } else {
                                        items = dtoType._initializeFrom(items);
                                    }
                                }

                                $scope.updateModel(items);

                                setTimeout(() => {
                                    Core.onChange($element.get(0), $scope.selectedItemKeys.join(","));
                                    $listContainer.hide().css("opacity", 0);
                                }, 1000);
                            });
                        },
                        title: window._resourcesManager.getPickListModalTitle($element, false), //todo: from master
                        $elementContent: $listContainer,
                        closeCallback: () => {
                            $listContainer.hide().css("opacity", 0);
                        }
                    });

                    $(document)
                        .keyup(e => {
                            if (e.which === 27) {
                                window._popUpManager.hidePopUp($scope.popUpName);
                            }
                        });

                    $scope.initialized = true;
                }

                Common.markDirectiveScopeAsReady($element);
            }
        };
    }

    angular
        .module("jbPicklist", [])
        .provider("jbPicklist",
        JbPicklist)
        .directive("jbPicklist",
        [
            "$timeout",
            "$interval",
            "jbPicklist",
            jbPicklist
        ]);

}