// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
var directiveScopeReadyLimit = 10;
var directiveScopeReadyTimeout = 200;
$(document).keyup((e) => {
    if (e.which === 13 && Joove.Common.eventPreventsDefaultFormAction(e as JQueryEventObject) === false && !$(e.target).parent().hasClass("search-element")) {
        window._popUpManager.previouslyFocusedElement = document.activeElement;
        $(":focus").blur();
        Joove.Core.getScope().eventCallbacks.btnChangePasswordClicked(e);
    }
});
window.onbeforeunload = (e) => {
    if (window._context.isDirty) {
        var msg = window._resourcesManager.getGlobalResource("RES_WEBFORM_DirtyMessage");
        e.returnValue = msg;     // Gecko, Trident, Chrome 34+
        return msg;
    }
};
interface Window { scope_ChangePassword: DigicircMatchmaking.Controllers.IChangePasswordScope; }
namespace DigicircMatchmaking.Controllers {
const ChangePasswordConditionalFormattings = [
        ];
const ChangePasswordDataValidations = [
new Joove.JbRule({
name: "CurrentPasswordEmptyValidation",
type: Joove.RuleTypes.DataValidation,
evaluatedAtServer: false,
isDataSetRule: false,
group: "",



condition: async (_parents) => {
        return Joove.Common.nullSafe<any>(() => CLMS.Framework.String.IsNullOrEmpty(Joove.Common.nullSafe(function () {
            return Joove.Common.nullSafe<any>(() => window["scope_ChangePassword"].model.txtCurrent, "").trim();
        }, "")), false);


    },
expression: async function(_parents) {
        return Joove.Common.nullSafe<any>(() => window._resourcesManager.getLocalResource("RES_DATAVALIDATION_MESSAGE_CurrentPasswordEmpty", false), "");
    },
dataValidationMessageType:  Joove.DataValidationMessageType.ERROR,
evaluationTimes: [Joove.EvaluationTimes.OnSubmit],
originalName: 'CurrentPasswordEmpty',
fromMasterPage: false
}),
new Joove.JbRule({
name: "NewPasswordEmptyValidation",
type: Joove.RuleTypes.DataValidation,
evaluatedAtServer: false,
isDataSetRule: false,
group: "",



condition: async (_parents) => {
        return Joove.Common.nullSafe<any>(() => CLMS.Framework.String.IsNullOrEmpty(Joove.Common.nullSafe(function () {
            return Joove.Common.nullSafe<any>(() => window["scope_ChangePassword"].model.txtNew, "").trim();
        }, "")), false);


    },
expression: async function(_parents) {
        return Joove.Common.nullSafe<any>(() => window._resourcesManager.getLocalResource("RES_DATAVALIDATION_MESSAGE_NewPasswordEmpty", false), "");
    },
dataValidationMessageType:  Joove.DataValidationMessageType.ERROR,
evaluationTimes: [Joove.EvaluationTimes.OnSubmit],
originalName: 'NewPasswordEmpty',
fromMasterPage: false
}),
new Joove.JbRule({
name: "RepeatPasswordEmptyValidation",
type: Joove.RuleTypes.DataValidation,
evaluatedAtServer: false,
isDataSetRule: false,
group: "",



condition: async (_parents) => {
        return Joove.Common.nullSafe<any>(() => CLMS.Framework.String.IsNullOrEmpty(Joove.Common.nullSafe(function () {
            return Joove.Common.nullSafe<any>(() => window["scope_ChangePassword"].model.txtNewRepeat, "").trim();
        }, "")), false);


    },
expression: async function(_parents) {
        return Joove.Common.nullSafe<any>(() => window._resourcesManager.getLocalResource("RES_DATAVALIDATION_MESSAGE_RepeatPasswordEmpty", false), "");
    },
dataValidationMessageType:  Joove.DataValidationMessageType.ERROR,
evaluationTimes: [Joove.EvaluationTimes.OnSubmit],
originalName: 'RepeatPasswordEmpty',
fromMasterPage: false
}),
                                      ];
const ChangePasswordCalculatedExpressions = [
        ];

// Datasets Column Info

// Datasets Projection Shemas


export interface IChangePasswordScope extends Joove.IWebPageScope {
model:
    DigicircMatchmaking.ViewModels.ChangePassword.ChangePasswordViewModel;
_partialModelStructure:
    any;
    _validations?: {
summary: Array<Joove.Validation.BindingEntry>,
CurrentPasswordEmpty: Joove.Validation.BindingEntry,NewPasswordEmpty: Joove.Validation.BindingEntry,RepeatPasswordEmpty: Joove.Validation.BindingEntry,txtCurrent: Joove.Validation.BindingEntry,txtNew: Joove.Validation.BindingEntry,txtNewRepeat: Joove.Validation.BindingEntry,
    },
    _masterValidations?: any;
}

class ChangePasswordController {
private timeoutDelayLockbtnChangePasswordClicked:
    any;
private timeoutDelayLockButton11Clicked:
    any;


    private controllerActionFinished = (resetDirty: boolean) => {
        //window.scope_ChangePassword.model = window.scope_ChangePassword.dehydrate();
        //window.scope_MasterPage.model = window.scope_ChangePassword.model;
        DigicircMatchmaking.ViewModels.ChangePassword.ChangePasswordViewModel._lightCast(window.scope_ChangePassword.model);
        // Joove.Common.applyScope(window.scope_ChangePassword);
        if (resetDirty) {
            window._context.isDirty = false;
        }
        window._ruleEngine.update(Joove.EvaluationTimes.OnChange);
    }

    constructor(private $scope: IChangePasswordScope, $timeout: ng.ITimeoutService) {
        window.scope_ChangePassword = $scope;
        $scope.$onControlChanged = function (event, newValue, dontMakeDirty) {
            Joove.Core.onChange(event.target, newValue, dontMakeDirty)
        }

        $scope.dehydrate = (context = null) => DigicircMatchmaking.ViewModels.ChangePassword.ChangePasswordViewModel._initializeFrom($scope.model, context);
        $scope._validationsMaster =  window.scope_MasterPage._validations;
        $scope._validations = { summary:
                                [],
                                CurrentPasswordEmpty:
                                { rule: ChangePasswordDataValidations[0], group: ChangePasswordDataValidations[0].group },
                                NewPasswordEmpty:
                                { rule: ChangePasswordDataValidations[1], group: ChangePasswordDataValidations[1].group },
                                RepeatPasswordEmpty:
                                { rule: ChangePasswordDataValidations[2], group: ChangePasswordDataValidations[2].group },
                                txtCurrent:
                                { requiredControlId: 'txtCurrent', group: null },
                                txtNew:
                                { requiredControlId: 'txtNew', group: null },
                                txtNewRepeat:
                                { requiredControlId: 'txtNewRepeat', group: null },
                              };

        this.init($scope, $timeout);
        $timeout(() => {

            window._ruleEngine.update(Joove.EvaluationTimes.OnLoad, null, () => {

                $("body").fadeIn(200);

            });
        });

    }

    init($scope: IChangePasswordScope, $timeout: ng.ITimeoutService) {


        $scope.model = DigicircMatchmaking.ViewModels.ChangePassword.ChangePasswordViewModel._initializeFrom(window.viewDTO.Model);

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
Render:
            async (_cb, _modalOptions, _e) => {
                Joove.Common.autocompleteFix();


                Joove.Core.executeRedirectControllerAction("ChangePassword", "Render", "GET", [], {}, _modalOptions);
            },
ChangePassword:
            async (_cb, _modalOptions, _e) => {
                Joove.Common.autocompleteFix();
                await window._ruleEngine.update(Joove.EvaluationTimes.OnSubmit);

                window._context.isDirty = false;
                Joove.Core.executeControllerActionNew({
verb: 'POST', controller: 'ChangePassword', action: 'ChangePassword',
queryData: [], postData: {'model': $scope.model},
cb: _cb, modalOptions: _modalOptions, event: _e
                });
            },
        };
// Events
        $scope.eventCallbacks = {
btnChangePasswordClicked:
            (e, DataItem, _parents) => {


                if (e != null) {
                    e.stopPropagation();
                    e.preventDefault();
                }

                if (this.timeoutDelayLockbtnChangePasswordClicked != null) {
                    $timeout.cancel(this.timeoutDelayLockbtnChangePasswordClicked);
                }

                this.timeoutDelayLockbtnChangePasswordClicked = $timeout(() => {
                    Joove.Common.setControlKeyPressed(e, 0); Joove.Common.setLastClickedElement(e);

                    Joove.Validation.Manager.validateFormAndExecute(() => {
                        $scope.actions.ChangePassword(null, null, e);
}, { groups: [Joove.Validation.Constants.ALL_GROUPS], withDataValidationsCheck: true, withRequiredFieldsCheck: true });
                }, 0);
            },

Button11Clicked:
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
        window._ruleEngine.addDataValidations(ChangePasswordDataValidations);
        window._ruleEngine.addConditionalFormattings(ChangePasswordConditionalFormattings);
        window._ruleEngine.addCalculatedExpressions(ChangePasswordCalculatedExpressions);

        window._commander.executeCommands(window.viewDTO.ClientCommands);
        window.viewDTO.ClientCommands = [];

        Joove.Common.setNumberLocalizationSettings();
        Joove.DeveloperApi.init($scope as any, window.scope_MasterPage as any);
        window.$formExtend && window.$formExtend();
        window.$onFormLoaded && window.$onFormLoaded();
    }
}
angular.module("Application").controller("ChangePasswordController", ["$scope", "$timeout", ChangePasswordController] as Array<string>);
}
