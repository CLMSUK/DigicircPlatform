// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
var directiveScopeReadyLimit = 10;
var directiveScopeReadyTimeout = 200;
$(document).keyup((e) => {
    if (e.which === 13 && Joove.Common.eventPreventsDefaultFormAction(e as JQueryEventObject) === false && !$(e.target).parent().hasClass("search-element")) {
        window._popUpManager.previouslyFocusedElement = document.activeElement;
        $(":focus").blur();
        Joove.Core.getScope().eventCallbacks.Button1Clicked(e);
    }
});
window.onbeforeunload = (e) => {
    if (window._context.isDirty) {
        var msg = window._resourcesManager.getGlobalResource("RES_WEBFORM_DirtyMessage");
        e.returnValue = msg;     // Gecko, Trident, Chrome 34+
        return msg;
    }
};
interface Window { scope_ManageRole: DigicircMatchmaking.Controllers.IManageRoleScope; }
namespace DigicircMatchmaking.Controllers {
const ManageRoleConditionalFormattings = [
new Joove.JbRule({
name: "HideOnNewConditional",
type: Joove.RuleTypes.ConditionalFormatting,
isDataSetRule: false,
evaluatedAtServer: false,
contextControlName: null,


condition: async (_parents) => {
        return Joove.Common.nullSafe<any>(() => window._context.currentAction == "NewRole", false);

    },
evaluationTimes: [Joove.EvaluationTimes.OnLoad],
isRelatedToDataValidation: false
}),
        ];
const ManageRoleDataValidations = [
                                  ];
const ManageRoleCalculatedExpressions = [
                                        ];

// Datasets Column Info
var AddPermission_ColumnInfo = [
new Joove.Widgets.DataListColumnInfo({
dataType: "int",
dataTypeIsEnum: false,
name: "Id",
caption: window._resourcesManager.getDataListColumnCaption("AddPermission", "Id", true),
groupable: true,
searchable: false,
visible: false,
orderable: true,
editable: false,
style: "",
classes: "",
itemType: Joove.Widgets.DataListColumnItemType.TEXTBOX,
importable: false,
supportsAggregators: true,
length: null,
formatting: null,
width: null,
css: "",
isEncrypted: false,
showFullImage: false
}),

new Joove.Widgets.DataListColumnInfo({
dataType: "string",
dataTypeIsEnum: false,
name: "Name",
caption: window._resourcesManager.getDataListColumnCaption("AddPermission", "Name", true),
groupable: true,
searchable: false,
visible: true,
orderable: true,
editable: false,
style: "",
classes: "",
itemType: Joove.Widgets.DataListColumnItemType.TEXTBOX,
importable: false,
supportsAggregators: true,
    length: 255,
formatting: null,
width: null,
css: "",
isEncrypted: false,
showFullImage: false
}),

new Joove.Widgets.DataListColumnInfo({
dataType: "string",
dataTypeIsEnum: false,
name: "Description",
caption: window._resourcesManager.getDataListColumnCaption("AddPermission", "Description", true),
groupable: true,
searchable: false,
visible: true,
orderable: true,
editable: false,
style: "",
classes: "",
itemType: Joove.Widgets.DataListColumnItemType.TEXTBOX,
importable: false,
supportsAggregators: true,
    length: 1000,
formatting: null,
width: null,
css: "",
isEncrypted: false,
showFullImage: false
})] as any;
window["AddPermission_ColumnInfo"] = AddPermission_ColumnInfo;

// Datasets Projection Shemas
window["AddPermission_ProjectionScema"] = {};


export interface IManageRoleScope extends Joove.IWebPageScope {
model:
    DigicircMatchmaking.ViewModels.ManageRole.ManageRoleViewModel;
_partialModelStructure:
    any;
    _validations?: {
summary: Array<Joove.Validation.BindingEntry>,
Name: Joove.Validation.BindingEntry,
    },
    _masterValidations?: any;
}

class ManageRoleController {
private timeoutDelayLockButton1Clicked:
    any;
private timeoutDelayLockButton2Clicked:
    any;
private timeoutDelayLockButton3Clicked:
    any;


    private controllerActionFinished = (resetDirty: boolean) => {
        //window.scope_ManageRole.model = window.scope_ManageRole.dehydrate();
        //window.scope_MasterPageForSlide.model = window.scope_ManageRole.model;
        DigicircMatchmaking.ViewModels.ManageRole.ManageRoleViewModel._lightCast(window.scope_ManageRole.model);
        // Joove.Common.applyScope(window.scope_ManageRole);
        if (resetDirty) {
            window._context.isDirty = false;
        }
        window._ruleEngine.update(Joove.EvaluationTimes.OnChange);
    }

    constructor(private $scope: IManageRoleScope, $timeout: ng.ITimeoutService) {
        window.scope_ManageRole = $scope;
        $scope.$onControlChanged = function (event, newValue, dontMakeDirty) {
            Joove.Core.onChange(event.target, newValue, dontMakeDirty)
        }

        $scope.dehydrate = (context = null) => DigicircMatchmaking.ViewModels.ManageRole.ManageRoleViewModel._initializeFrom($scope.model, context);
        $scope._validationsMaster =  window.scope_MasterPageForSlide._validations;
        $scope._validations = { summary:
                                [],
                                Name:
                                { requiredControlId: 'Name', group: null },
                              };

        this.init($scope, $timeout);
        $timeout(() => {

            window._ruleEngine.update(Joove.EvaluationTimes.OnLoad, null, () => {

                $("body").fadeIn(200);

            });
        });

    }

    init($scope: IManageRoleScope, $timeout: ng.ITimeoutService) {


        $scope.model = DigicircMatchmaking.ViewModels.ManageRole.ManageRoleViewModel._initializeFrom(window.viewDTO.Model);

        window.scope_MasterPageForSlide.model = $scope.model;

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
NewRole:
            async (_cb, _modalOptions, _e) => {
                Joove.Common.autocompleteFix();


                Joove.Core.executeRedirectControllerAction("ManageRole", "NewRole", "GET", [], {}, _modalOptions);
            },
EditRole:
            async (Id, _cb, _modalOptions, _e) => {
                Joove.Common.autocompleteFix();


                Joove.Core.executeRedirectControllerAction("ManageRole", "EditRole", "GET", [Id], {}, _modalOptions);
            },
SaveRole:
            async (_cb, _modalOptions, _e) => {
                Joove.Common.autocompleteFix();
                await window._ruleEngine.update(Joove.EvaluationTimes.OnSubmit);

                window._context.isDirty = false;
                Joove.Core.executeControllerActionNew({
verb: 'POST', controller: 'ManageRole', action: 'SaveRole',
queryData: [], postData: {'model': $scope.model},
cb: _cb, modalOptions: _modalOptions, event: _e
                });
            },
DeleteRole:
            async (_cb, _modalOptions, _e) => {
                Joove.Common.autocompleteFix();

                window._context.isDirty = false;
                Joove.Core.executeControllerActionNew({
verb: 'POST', controller: 'ManageRole', action: 'DeleteRole',
queryData: [], postData: {'model': $scope.model},
cb: _cb, modalOptions: _modalOptions, event: _e
                });
            },
        };
// Events
        $scope.eventCallbacks = {
Button1Clicked:
            (e, DataItem, _parents) => {


                if (e != null) {
                    e.stopPropagation();
                    e.preventDefault();
                }

                if (this.timeoutDelayLockButton1Clicked != null) {
                    $timeout.cancel(this.timeoutDelayLockButton1Clicked);
                }

                this.timeoutDelayLockButton1Clicked = $timeout(() => {
                    Joove.Common.setControlKeyPressed(e, 0); Joove.Common.setLastClickedElement(e);

                    Joove.Validation.Manager.validateFormAndExecute(() => {
                        $scope.actions.SaveRole(null, null, e);
}, { groups: [Joove.Validation.Constants.ALL_GROUPS], withDataValidationsCheck: true, withRequiredFieldsCheck: true });
                }, 0);
            },

Button2Clicked:
            (e, DataItem, _parents) => {


                if (e != null) {
                    e.stopPropagation();
                    e.preventDefault();
                }

                if (this.timeoutDelayLockButton2Clicked != null) {
                    $timeout.cancel(this.timeoutDelayLockButton2Clicked);
                }

                this.timeoutDelayLockButton2Clicked = $timeout(() => {
                    Joove.Common.setControlKeyPressed(e, 0); Joove.Common.setLastClickedElement(e);
                    window._popUpManager.question(window._resourcesManager.getGlobalResource("RES_WEBFORM_GenericConfirmationQuestion"),
                    window._resourcesManager.getEventConfirmation("Button2", false), (isConfirm) => {
                        if (!isConfirm) return;

                        setTimeout(() => {

                            Joove.Validation.Manager.validateFormAndExecute(() => {
                                $scope.actions.DeleteRole(null, null, e);
}, { groups: [Joove.Validation.Constants.ALL_GROUPS], withDataValidationsCheck: false, withRequiredFieldsCheck: false });
                        }, 1000);
                    });
                }, 0);
            },

Button3Clicked:
            (e, DataItem, _parents) => {


                if (e != null) {
                    e.stopPropagation();
                    e.preventDefault();
                }

                Joove.Common.setControlKeyPressed(e, 0);
                window._commander.closeForm();
            },

        };

// Rules
        window._ruleEngine.addDataValidations(ManageRoleDataValidations);
        window._ruleEngine.addConditionalFormattings(ManageRoleConditionalFormattings);
        window._ruleEngine.addCalculatedExpressions(ManageRoleCalculatedExpressions);

        window._commander.executeCommands(window.viewDTO.ClientCommands);
        window.viewDTO.ClientCommands = [];

        Joove.Common.setNumberLocalizationSettings();
        Joove.DeveloperApi.init($scope as any, window.scope_MasterPageForSlide as any);
        window.$formExtend && window.$formExtend();
        window.$onFormLoaded && window.$onFormLoaded();
    }
}
angular.module("Application").controller("ManageRoleController", ["$scope", "$timeout", ManageRoleController] as Array<string>);
}
