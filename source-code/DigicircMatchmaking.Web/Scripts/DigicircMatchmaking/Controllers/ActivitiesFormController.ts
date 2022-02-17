// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
var directiveScopeReadyLimit = 10;
var directiveScopeReadyTimeout = 200;
$(document).keyup((e) => {
    if (e.which === 13 && Joove.Common.eventPreventsDefaultFormAction(e as JQueryEventObject) === false && !$(e.target).parent().hasClass("search-element")) {
        window._popUpManager.previouslyFocusedElement = document.activeElement;
        $(":focus").blur();
        Joove.Core.getScope().eventCallbacks.cmdCompanySaveClicked(e);
    }
});
window.onbeforeunload = (e) => {
    if (window._context.isDirty) {
        var msg = window._resourcesManager.getGlobalResource("RES_WEBFORM_DirtyMessage");
        e.returnValue = msg;     // Gecko, Trident, Chrome 34+
        return msg;
    }
};
interface Window { scope_ActivitiesForm: DigicircMatchmaking.Controllers.IActivitiesFormScope; }
namespace DigicircMatchmaking.Controllers {
const ActivitiesFormConditionalFormattings = [
new Joove.JbRule({
name: "HideIfNewConditional",
type: Joove.RuleTypes.ConditionalFormatting,
isDataSetRule: false,
evaluatedAtServer: false,
contextControlName: null,


condition: async (_parents) => {
        return Joove.Common.nullSafe<any>(() => window._context.currentAction == "Add", false);

    },
evaluationTimes: [Joove.EvaluationTimes.OnLoad],
isRelatedToDataValidation: false
}),
new Joove.JbRule({
name: "HideEmptyTitleConditional",
type: Joove.RuleTypes.ConditionalFormatting,
isDataSetRule: false,
evaluatedAtServer: false,
contextControlName: null,


condition: async (_parents) => {
        return Joove.Common.nullSafe<any>(() => CLMS.Framework.String.IsNullOrEmpty(Joove.Common.nullSafe(function () {
            return Joove.Common.nullSafe<any>(() => window["scope_ActivitiesForm"].model.Title, "").trim();
        }, "")), false);

    },
evaluationTimes: [Joove.EvaluationTimes.OnLoad,Joove.EvaluationTimes.OnSubmit,Joove.EvaluationTimes.OnChange],
isRelatedToDataValidation: false
}),
new Joove.JbRule({
name: "PendingChangesConditional",
type: Joove.RuleTypes.ConditionalFormatting,
isDataSetRule: false,
evaluatedAtServer: false,
contextControlName: null,


condition: async (_parents) => {
        return window._context.isDirty;

    },
evaluationTimes: [Joove.EvaluationTimes.OnLoad,Joove.EvaluationTimes.OnSubmit,Joove.EvaluationTimes.OnChange],
isRelatedToDataValidation: false
}),
        ];
const ActivitiesFormDataValidations = [
                                      ];
const ActivitiesFormCalculatedExpressions = [
        ];

// Datasets Column Info

// Datasets Projection Shemas


export interface IActivitiesFormScope extends Joove.IWebPageScope {
model:
    DigicircMatchmaking.ViewModels.ActivitiesForm.ActivitiesFormViewModel;
_partialModelStructure:
    any;
    _validations?: {
summary: Array<Joove.Validation.BindingEntry>,

    },
    _masterValidations?: any;
}

class ActivitiesFormController {
private timeoutDelayLockcmdExit1Clicked:
    any;
private timeoutDelayLockcmdDeleteCompanyClicked:
    any;
private timeoutDelayLockcmdCompanySaveClicked:
    any;


    private controllerActionFinished = (resetDirty: boolean) => {
        //window.scope_ActivitiesForm.model = window.scope_ActivitiesForm.dehydrate();
        //window.scope_MasterPage.model = window.scope_ActivitiesForm.model;
        DigicircMatchmaking.ViewModels.ActivitiesForm.ActivitiesFormViewModel._lightCast(window.scope_ActivitiesForm.model);
        // Joove.Common.applyScope(window.scope_ActivitiesForm);
        if (resetDirty) {
            window._context.isDirty = false;
        }
        window._ruleEngine.update(Joove.EvaluationTimes.OnChange);
    }

    constructor(private $scope: IActivitiesFormScope, $timeout: ng.ITimeoutService) {
        window.scope_ActivitiesForm = $scope;
        $scope.$onControlChanged = function (event, newValue, dontMakeDirty) {
            Joove.Core.onChange(event.target, newValue, dontMakeDirty)
        }

        $scope.dehydrate = (context = null) => DigicircMatchmaking.ViewModels.ActivitiesForm.ActivitiesFormViewModel._initializeFrom($scope.model, context);
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

    init($scope: IActivitiesFormScope, $timeout: ng.ITimeoutService) {


        $scope.model = DigicircMatchmaking.ViewModels.ActivitiesForm.ActivitiesFormViewModel._initializeFrom(window.viewDTO.Model);

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
Add:
            async (_cb, _modalOptions, _e) => {
                Joove.Common.autocompleteFix();


                Joove.Core.executeRedirectControllerAction("ActivitiesForm", "Add", "GET", [], {}, _modalOptions);
            },
Edit:
            async (id, _cb, _modalOptions, _e) => {
                Joove.Common.autocompleteFix();


                Joove.Core.executeRedirectControllerAction("ActivitiesForm", "Edit", "GET", [id], {}, _modalOptions);
            },
Save:
            async (_cb, _modalOptions, _e) => {
                Joove.Common.autocompleteFix();
                await window._ruleEngine.update(Joove.EvaluationTimes.OnSubmit);

                window._context.isDirty = false;
                Joove.Core.executeControllerActionNew({
verb: 'POST', controller: 'ActivitiesForm', action: 'Save',
queryData: [], postData: {'model': $scope.model},
cb: _cb, modalOptions: _modalOptions, event: _e
                });
            },
Delete:
            async (_cb, _modalOptions, _e) => {
                Joove.Common.autocompleteFix();

                window._context.isDirty = false;
                Joove.Core.executeControllerActionNew({
verb: 'POST', controller: 'ActivitiesForm', action: 'Delete',
queryData: [], postData: {'model': $scope.model},
cb: _cb, modalOptions: _modalOptions, event: _e
                });
            },
        };
// Events
        $scope.eventCallbacks = {
cmdExit1Clicked:
            (e, DataItem, _parents) => {


                if (e != null) {
                    e.stopPropagation();
                    e.preventDefault();
                }

                Joove.Common.setControlKeyPressed(e, 0);
                window._commander.closeForm();
            },

cmdDeleteCompanyClicked:
            (e, DataItem, _parents) => {


                if (e != null) {
                    e.stopPropagation();
                    e.preventDefault();
                }

                if (this.timeoutDelayLockcmdDeleteCompanyClicked != null) {
                    $timeout.cancel(this.timeoutDelayLockcmdDeleteCompanyClicked);
                }

                this.timeoutDelayLockcmdDeleteCompanyClicked = $timeout(() => {
                    Joove.Common.setControlKeyPressed(e, 0); Joove.Common.setLastClickedElement(e);
                    window._popUpManager.question(window._resourcesManager.getGlobalResource("RES_WEBFORM_GenericConfirmationQuestion"),
                    window._resourcesManager.getEventConfirmation("cmdDeleteCompany", false), (isConfirm) => {
                        if (!isConfirm) return;

                        setTimeout(() => {

                            Joove.Validation.Manager.validateFormAndExecute(() => {
                                $scope.actions.Delete(null, null, e);
}, { groups: [Joove.Validation.Constants.ALL_GROUPS], withDataValidationsCheck: false, withRequiredFieldsCheck: false });
                        }, 1000);
                    });
                }, 0);
            },

cmdCompanySaveClicked:
            (e, DataItem, _parents) => {


                if (e != null) {
                    e.stopPropagation();
                    e.preventDefault();
                }

                if (this.timeoutDelayLockcmdCompanySaveClicked != null) {
                    $timeout.cancel(this.timeoutDelayLockcmdCompanySaveClicked);
                }

                this.timeoutDelayLockcmdCompanySaveClicked = $timeout(() => {
                    Joove.Common.setControlKeyPressed(e, 0); Joove.Common.setLastClickedElement(e);

                    Joove.Validation.Manager.validateFormAndExecute(() => {
                        $scope.actions.Save(null, null, e);
}, { groups: [Joove.Validation.Constants.ALL_GROUPS], withDataValidationsCheck: true, withRequiredFieldsCheck: true });
                }, 0);
            },

        };

// Rules
        window._ruleEngine.addDataValidations(ActivitiesFormDataValidations);
        window._ruleEngine.addConditionalFormattings(ActivitiesFormConditionalFormattings);
        window._ruleEngine.addCalculatedExpressions(ActivitiesFormCalculatedExpressions);

        window._commander.executeCommands(window.viewDTO.ClientCommands);
        window.viewDTO.ClientCommands = [];

        Joove.Common.setNumberLocalizationSettings();
        Joove.DeveloperApi.init($scope as any, window.scope_MasterPage as any);
        window.$formExtend && window.$formExtend();
        window.$onFormLoaded && window.$onFormLoaded();
    }
}
angular.module("Application").controller("ActivitiesFormController", ["$scope", "$timeout", ActivitiesFormController] as Array<string>);
}
