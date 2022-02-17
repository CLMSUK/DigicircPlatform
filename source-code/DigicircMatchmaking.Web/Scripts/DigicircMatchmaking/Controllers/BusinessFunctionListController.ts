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
interface Window { scope_BusinessFunctionList: DigicircMatchmaking.Controllers.IBusinessFunctionListScope; }
namespace DigicircMatchmaking.Controllers {
const BusinessFunctionListConditionalFormattings = [
        ];
const BusinessFunctionListDataValidations = [
        ];
const BusinessFunctionListCalculatedExpressions = [
        ];

// Datasets Column Info
var BusinessFunctionList_ColumnInfo = [
new Joove.Widgets.DataListColumnInfo({
dataType: "string",
dataTypeIsEnum: false,
name: "Value",
caption: window._resourcesManager.getDataListColumnCaption("BusinessFunctionList", "Value", false),
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
window["BusinessFunctionList_ColumnInfo"] = BusinessFunctionList_ColumnInfo;

// Datasets Projection Shemas
window["BusinessFunctionList_ProjectionScema"] = {};


export interface IBusinessFunctionListScope extends Joove.IWebPageScope {
model:
    DigicircMatchmaking.ViewModels.BusinessFunctionList.BusinessFunctionListViewModel;
_partialModelStructure:
    any;
    _validations?: {
summary: Array<Joove.Validation.BindingEntry>,

    },
    _masterValidations?: any;
}

class BusinessFunctionListController {
private timeoutDelayLockAddNewClicked:
    any;
private timeoutDelayLockModifyClicked:
    any;


    private controllerActionFinished = (resetDirty: boolean) => {
        //window.scope_BusinessFunctionList.model = window.scope_BusinessFunctionList.dehydrate();
        //window.scope_MasterPage.model = window.scope_BusinessFunctionList.model;
        DigicircMatchmaking.ViewModels.BusinessFunctionList.BusinessFunctionListViewModel._lightCast(window.scope_BusinessFunctionList.model);
        // Joove.Common.applyScope(window.scope_BusinessFunctionList);
        if (resetDirty) {
            window._context.isDirty = false;
        }
        window._ruleEngine.update(Joove.EvaluationTimes.OnChange);
    }

    constructor(private $scope: IBusinessFunctionListScope, $timeout: ng.ITimeoutService) {
        window.scope_BusinessFunctionList = $scope;
        $scope.$onControlChanged = function (event, newValue, dontMakeDirty) {
            Joove.Core.onChange(event.target, newValue, dontMakeDirty)
        }

        $scope.dehydrate = (context = null) => DigicircMatchmaking.ViewModels.BusinessFunctionList.BusinessFunctionListViewModel._initializeFrom($scope.model, context);
        $scope._validationsMaster =  window.scope_MasterPage._validations;
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

    init($scope: IBusinessFunctionListScope, $timeout: ng.ITimeoutService) {


        $scope.model = DigicircMatchmaking.ViewModels.BusinessFunctionList.BusinessFunctionListViewModel._initializeFrom(window.viewDTO.Model);

        window.scope_MasterPage.model = $scope.model;

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


                Joove.Core.executeRedirectControllerAction("BusinessFunctionList", "", "GET", [], {}, _modalOptions);
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
                        if (openInNewWindow) $(e.target).data("openInNewWindow", undefined); Joove.Core.executeRedirectControllerAction("BusinessFunctionForm", "Add", "GET", [], null, null, openInNewWindow);
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
                        if (openInNewWindow) $(e.target).data("openInNewWindow", undefined); Joove.Core.executeRedirectControllerAction("BusinessFunctionForm", "Edit", "GET", [Joove.Common.nullSafe<any>(() => Joove.DatasourceManager.getSelectedItem($("[jb-id='BusinessFunctionList']"), e).Id, 0)], null, null, openInNewWindow);
}, { groups: [], withDataValidationsCheck: false, withRequiredFieldsCheck: false });
                }, 0);
            },

        };

// Rules
        window._ruleEngine.addDataValidations(BusinessFunctionListDataValidations);
        window._ruleEngine.addConditionalFormattings(BusinessFunctionListConditionalFormattings);
        window._ruleEngine.addCalculatedExpressions(BusinessFunctionListCalculatedExpressions);

        window._commander.executeCommands(window.viewDTO.ClientCommands);
        window.viewDTO.ClientCommands = [];

        Joove.Common.setNumberLocalizationSettings();
        Joove.DeveloperApi.init($scope as any, window.scope_MasterPage as any);
        window.$formExtend && window.$formExtend();
        window.$onFormLoaded && window.$onFormLoaded();
    }
}
angular.module("Application").controller("BusinessFunctionListController", ["$scope", "$timeout", BusinessFunctionListController] as Array<string>);
}