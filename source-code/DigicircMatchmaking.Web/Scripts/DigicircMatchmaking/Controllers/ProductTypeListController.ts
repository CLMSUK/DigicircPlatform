// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
var directiveScopeReadyLimit = 10;
var directiveScopeReadyTimeout = 200;
window.onbeforeunload = (e) => {
    if (window._context.isDirty) {
        var msg = window._resourcesManager.getGlobalResource("RES_WEBFORM_DirtyMessage");
        e.returnValue = msg;     // Gecko, Trident, Chrome 34+
        return msg;
    }
};
interface Window { scope_ProductTypeList: DigicircMatchmaking.Controllers.IProductTypeListScope; }
namespace DigicircMatchmaking.Controllers {
const ProductTypeListConditionalFormattings = [
        ];
const ProductTypeListDataValidations = [
                                       ];
const ProductTypeListCalculatedExpressions = [
        ];

// Datasets Column Info
var ProductTypeList_ColumnInfo = [
new Joove.Widgets.DataListColumnInfo({
dataType: "string",
dataTypeIsEnum: false,
name: "Name",
caption: window._resourcesManager.getDataListColumnCaption("ProductTypeList", "Name", false),
groupable: true,
searchable: true,
visible: true,
orderable: true,
editable: false,
style: "",
classes: "",
itemType: Joove.Widgets.DataListColumnItemType.TEXTBOX,
importable: false,
supportsAggregators: true,
    length: 100,
formatting: null,
width: null,
css: "",
isEncrypted: false,
showFullImage: false
})] as any;
window["ProductTypeList_ColumnInfo"] = ProductTypeList_ColumnInfo;

// Datasets Projection Shemas
window["ProductTypeList_ProjectionScema"] = {};


export interface IProductTypeListScope extends Joove.IWebPageScope {
model:
    DigicircMatchmaking.ViewModels.ProductTypeList.ProductTypeListViewModel;
_partialModelStructure:
    any;
    _validations?: {
summary: Array<Joove.Validation.BindingEntry>,

    },
    _masterValidations?: any;
}

class ProductTypeListController {
private timeoutDelayLockAddNewClicked:
    any;
private timeoutDelayLockModifyClicked:
    any;


    private controllerActionFinished = (resetDirty: boolean) => {
        //window.scope_ProductTypeList.model = window.scope_ProductTypeList.dehydrate();
        //window.scope_SymbiosisMasterPage.model = window.scope_ProductTypeList.model;
        DigicircMatchmaking.ViewModels.ProductTypeList.ProductTypeListViewModel._lightCast(window.scope_ProductTypeList.model);
        // Joove.Common.applyScope(window.scope_ProductTypeList);
        if (resetDirty) {
            window._context.isDirty = false;
        }
        window._ruleEngine.update(Joove.EvaluationTimes.OnChange);
    }

    constructor(private $scope: IProductTypeListScope, $timeout: ng.ITimeoutService) {
        window.scope_ProductTypeList = $scope;
        $scope.$onControlChanged = function (event, newValue, dontMakeDirty) {
            Joove.Core.onChange(event.target, newValue, dontMakeDirty)
        }

        $scope.dehydrate = (context = null) => DigicircMatchmaking.ViewModels.ProductTypeList.ProductTypeListViewModel._initializeFrom($scope.model, context);
        $scope._validationsMaster =  window.scope_SymbiosisMasterPage._validations;
        $scope._validations = { summary:
                                [],
                              };

        this.init($scope, $timeout);
        $timeout(() => {

            window._ruleEngine.update(Joove.EvaluationTimes.OnLoad, null, () => {

                $("body").fadeIn(200);

            });
        });

    }

    init($scope: IProductTypeListScope, $timeout: ng.ITimeoutService) {


        $scope.model = DigicircMatchmaking.ViewModels.ProductTypeList.ProductTypeListViewModel._initializeFrom(window.viewDTO.Model);

        window.scope_SymbiosisMasterPage.model = $scope.model;

        new Joove.ReferencesReconstructor().reconstructReferences($scope.model);
        $scope.trackObject = obj => Joove.Common.trackObject(obj);




        //}

        $.connection['eventsHub'].on('__connectedEvent', () => { });

        $.connection['eventsHub'].on('forcePageReload', () => {
            window.onbeforeunload = null;
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        });
        $.connection.hub.start().then(() => {
            Joove.Common.getScope().connectedToSignals();
            Joove.Common.getMasterScope().connectedToSignals();

        });
        $scope.connectedToSignals = () => {
        }
// Event Listeners
        $scope.events = {
        };
        $scope.expressions = {
        }
// Dataset Handler
        $scope.datasets = {
        };
// Controller actions
        $scope.actions = {
Index:
            async (_cb, _modalOptions, _e) => {
                Joove.Common.autocompleteFix();


                Joove.Core.executeRedirectControllerAction("ProductTypeList", "", "GET", [], {}, _modalOptions);
            },
        };
// Events
        $scope.eventCallbacks = {
AddNewClicked:
            (e, DataItem, _parents) => {


                if (e != null) {
                    e.stopPropagation();
                    e.preventDefault();
                }

                if (this.timeoutDelayLockAddNewClicked != null) {
                    $timeout.cancel(this.timeoutDelayLockAddNewClicked);
                }

                this.timeoutDelayLockAddNewClicked = $timeout(() => {
                    Joove.Common.setControlKeyPressed(e, 0); Joove.Common.setLastClickedElement(e);

                    Joove.Validation.Manager.validateFormAndExecute(() => {
                        //This is true only when the menu item is clicked programmatically
                        //and occurs when the middle mouse button click is triggered
                        var openInNewWindow = $(e.target).data("openInNewWindow") === true || undefined;
                        if (openInNewWindow) $(e.target).data("openInNewWindow", undefined); Joove.Core.executeRedirectControllerAction("ProductTypeForm", "Add", "GET", [], null, null, openInNewWindow);
}, { groups: [], withDataValidationsCheck: false, withRequiredFieldsCheck: false });
                }, 0);
            },

ModifyClicked:
            (e, DataItem, _parents) => {


                if (e != null) {
                    e.stopPropagation();
                    e.preventDefault();
                }

                if (this.timeoutDelayLockModifyClicked != null) {
                    $timeout.cancel(this.timeoutDelayLockModifyClicked);
                }

                this.timeoutDelayLockModifyClicked = $timeout(() => {
                    Joove.Common.setControlKeyPressed(e, 0); Joove.Common.setLastClickedElement(e);

                    Joove.Validation.Manager.validateFormAndExecute(() => {
                        //This is true only when the menu item is clicked programmatically
                        //and occurs when the middle mouse button click is triggered
                        var openInNewWindow = $(e.target).data("openInNewWindow") === true || undefined;
                        if (openInNewWindow) $(e.target).data("openInNewWindow", undefined); Joove.Core.executeRedirectControllerAction("ProductTypeForm", "Edit", "GET", [Joove.Common.nullSafe<any>(() => Joove.DatasourceManager.getSelectedItem($("[jb-id='ProductTypeList']"), e).Id, 0)], null, null, openInNewWindow);
}, { groups: [], withDataValidationsCheck: false, withRequiredFieldsCheck: false });
                }, 0);
            },

        };

// Rules
        window._ruleEngine.addDataValidations(ProductTypeListDataValidations);
        window._ruleEngine.addConditionalFormattings(ProductTypeListConditionalFormattings);
        window._ruleEngine.addCalculatedExpressions(ProductTypeListCalculatedExpressions);

        window._commander.executeCommands(window.viewDTO.ClientCommands);
        window.viewDTO.ClientCommands = [];

        Joove.Common.setNumberLocalizationSettings();
        Joove.DeveloperApi.init($scope as any, window.scope_SymbiosisMasterPage as any);
        window.$formExtend && window.$formExtend();
        window.$onFormLoaded && window.$onFormLoaded();
    }
}
angular.module("Application").controller("ProductTypeListController", ["$scope", "$timeout", ProductTypeListController] as Array<string>);
}