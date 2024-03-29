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
        var JbPicklist = /** @class */ (function (_super) {
            __extends(JbPicklist, _super);
            function JbPicklist() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return JbPicklist;
        }(Joove.BaseAngularProvider));
        function jbPicklist() {
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
                link: function ($scope, $element) {
                    if (Joove.Common.directiveScopeIsReady($element))
                        return;
                    $scope.selectedItems = [];
                    $scope.selectedItemKeys = [];
                    $scope.fullRecordsetIsSelected = false;
                    $scope.requestSelectedItemsfromServer = false;
                    $scope.initialized = false;
                    $scope.popUpName = null;
                    $scope.picklist = null;
                    $scope.options = null;
                    $element.addClass("picklist-enabled");
                    Joove.Common.setDirectiveScope($element, $scope);
                    var formScope = $scope.fromMasterForm === true
                        ? Joove.Common.getMasterScope()
                        : Joove.Common.getScope();
                    var isBoundToRoot = $element.attr("ng-owner") === "model";
                    var dtoTypeName = $element.attr("jb-client-dto");
                    $element.on("click", function () {
                        if ($scope.initialized === false) {
                            $scope.init();
                        }
                        window._popUpManager.showPopUp($scope.popUpName);
                        setTimeout(function () {
                            $scope.updateSelectionFromModel();
                            $scope.picklist.enable($scope.selectedItemKeys);
                            if ($scope.picklist.isInitialized === true) {
                                $scope.picklist.createInitializationLoadingElement();
                                $scope.picklist.updateData();
                            }
                        }, 100);
                    });
                    $scope.updateSelectionFromModel = function () {
                        $scope.selectedItemKeys = Joove.DatasourceManager.getKeys($scope.model);
                        $scope.picklist.status.selectedItemKeys = Joove.DatasourceManager
                            .getKeys($scope
                            .model); // run again to prevent assignment as pointer                    
                        if ($scope.model == null) {
                            $scope.selectedItems = [];
                        }
                        else if ($scope.model.constructor === Array) {
                            $scope.selectedItems = $scope.model;
                        }
                        else {
                            $scope.selectedItems = [$scope.model];
                        }
                    };
                    $scope.updateModel = function (items) {
                        // Multiselection means that picklist is bound to collection!!!!
                        var boundToCollection = $scope.options.hasMultiselection !== false;
                        var selectionIsArray = Array.isArray(items);
                        if (boundToCollection) {
                            $scope.model = selectionIsArray
                                ? items // collection to collection: use as is
                                : [items]; // convert to collection
                        }
                        else {
                            $scope.model = selectionIsArray
                                ? items[0] // use first
                                : items; // single to single: use as is                        
                        }
                        if ($scope.owner != undefined) {
                            var modelPath = $element.attr("ng-model");
                            var parts = modelPath.split(".");
                            var last = parts[parts.length - 1];
                            if (isBoundToRoot) {
                                $scope.owner[last] = $scope.model;
                            }
                            else {
                                Joove.Core.setBoClassPropertyFromInstance(last, $scope.owner, $scope.model);
                            }
                        }
                        formScope.model = formScope.dehydrate();
                        Joove.Core.applyScope(formScope);
                    };
                    $scope.init = function () {
                        var indexes = Joove.Common.getIndexesOfControl($element);
                        var buttonName = $element.attr("jb-id");
                        var picklistName = buttonName + "_PickList";
                        var $listContainer = $element.siblings('[jb-id="' + picklistName + '"]').eq(0);
                        $scope.popUpName = buttonName + indexes.key;
                        $scope.options = Joove.Common
                            .modelToJson(Joove.Common.replaceAll($listContainer.data("options"), "'", "\""));
                        $scope.options.excludeSelected = $scope.excludeSelected;
                        $scope.options.showRowNumbers = true;
                        $scope.picklist = new Widgets.ListControl();
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
                            okCallback: function () {
                                $scope.picklist.updateSelection(function (items) {
                                    var dtoType = window[window._context.appName]["ViewModels"][window._context.currentController][dtoTypeName];
                                    if (items != null && dtoType != null) {
                                        if (Joove.Common.isArray(items)) {
                                            for (var c = 0; c < items.length; c++) {
                                                items[c] = dtoType._initializeFrom(items[c]);
                                            }
                                        }
                                        else {
                                            items = dtoType._initializeFrom(items);
                                        }
                                    }
                                    $scope.updateModel(items);
                                    setTimeout(function () {
                                        Joove.Core.onChange($element.get(0), $scope.selectedItemKeys.join(","));
                                        $listContainer.hide().css("opacity", 0);
                                    }, 1000);
                                });
                            },
                            title: window._resourcesManager.getPickListModalTitle($element, false),
                            $elementContent: $listContainer,
                            closeCallback: function () {
                                $listContainer.hide().css("opacity", 0);
                            }
                        });
                        $(document)
                            .keyup(function (e) {
                            if (e.which === 27) {
                                window._popUpManager.hidePopUp($scope.popUpName);
                            }
                        });
                        $scope.initialized = true;
                    };
                    Joove.Common.markDirectiveScopeAsReady($element);
                }
            };
        }
        angular
            .module("jbPicklist", [])
            .provider("jbPicklist", JbPicklist)
            .directive("jbPicklist", [
            "$timeout",
            "$interval",
            "jbPicklist",
            jbPicklist
        ]);
    })(Widgets = Joove.Widgets || (Joove.Widgets = {}));
})(Joove || (Joove = {}));
