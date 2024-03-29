// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
var directiveScopeReadyLimit = 10;
var directiveScopeReadyTimeout = 200;
$(document).keyup((e) => {
    if (e.which === 13 && Joove.Common.eventPreventsDefaultFormAction(e as JQueryEventObject) === false && !$(e.target).parent().hasClass("search-element")) {
        window._popUpManager.previouslyFocusedElement = document.activeElement;
        $(":focus").blur();
        Joove.Core.getScope().eventCallbacks.SaveBtnClicked(e);
    }
});
interface Window { scope_UserPreferences: DigicircMatchmaking.Controllers.IUserPreferencesScope; }
namespace DigicircMatchmaking.Controllers {
const UserPreferencesConditionalFormattings = [
        ];
const UserPreferencesDataValidations = [
                                       ];
const UserPreferencesCalculatedExpressions = [
        ];

// Datasets Column Info
export var LanguageBoxDataSet_ColumnInfo = [new Joove.ColumnInfo("Name", "string", null, false),
           new Joove.ColumnInfo("Id", "int", null, false)];
window["LanguageBoxDataSet_ColumnInfo"] = LanguageBoxDataSet_ColumnInfo;
export var LocaleBoxDataSet_ColumnInfo = [new Joove.ColumnInfo("Name", "string", null, false),
           new Joove.ColumnInfo("Id", "int", null, false)];
window["LocaleBoxDataSet_ColumnInfo"] = LocaleBoxDataSet_ColumnInfo;
export var ApplicationThemeDataSet_ColumnInfo = [new Joove.ColumnInfo("Name", "string", null, false)];
window["ApplicationThemeDataSet_ColumnInfo"] = ApplicationThemeDataSet_ColumnInfo;

// Datasets Projection Shemas
window["LanguageBox_ProjectionScema"] = {};
window["LocaleBox_ProjectionScema"] = {};
window["DropdownApplicationThemeDataSet_ProjectionScema"] = {};


export interface IUserPreferencesScope extends Joove.IWebPageScope {
model:
    DigicircMatchmaking.ViewModels.UserPreferences.UserPreferencesViewModel;
_partialModelStructure:
    any;
    _validations?: {
summary: Array<Joove.Validation.BindingEntry>,

    },
    _masterValidations?: any;
}

class UserPreferencesController {
private timeoutDelayLockSaveBtnClicked:
    any;
private timeoutDelayLockCancelBtnClicked:
    any;


    private controllerActionFinished = (resetDirty: boolean) => {
        //window.scope_UserPreferences.model = window.scope_UserPreferences.dehydrate();
        //window.scope_MasterPage.model = window.scope_UserPreferences.model;
        DigicircMatchmaking.ViewModels.UserPreferences.UserPreferencesViewModel._lightCast(window.scope_UserPreferences.model);
        // Joove.Common.applyScope(window.scope_UserPreferences);
        if (resetDirty) {
            window._context.isDirty = false;
        }
        window._ruleEngine.update(Joove.EvaluationTimes.OnChange);
    }

    constructor(private $scope: IUserPreferencesScope, $timeout: ng.ITimeoutService) {
        window.scope_UserPreferences = $scope;
        $scope.$onControlChanged = function (event, newValue, dontMakeDirty) {
            Joove.Core.onChange(event.target, newValue, dontMakeDirty)
        }

        $scope.dehydrate = (context = null) => DigicircMatchmaking.ViewModels.UserPreferences.UserPreferencesViewModel._initializeFrom($scope.model, context);
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

    init($scope: IUserPreferencesScope, $timeout: ng.ITimeoutService) {


        $scope.model = DigicircMatchmaking.ViewModels.UserPreferences.UserPreferencesViewModel._initializeFrom(window.viewDTO.Model);

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


                Joove.Core.executeRedirectControllerAction("UserPreferences", "Render", "GET", [], {}, _modalOptions);
            },
Save:
            async (_cb, _modalOptions, _e) => {
                Joove.Common.autocompleteFix();
                await window._ruleEngine.update(Joove.EvaluationTimes.OnSubmit);

                window._context.isDirty = false;
                Joove.Core.executeControllerActionNew({
verb: 'POST', controller: 'UserPreferences', action: 'Save',
queryData: [], postData: {'model': $scope.model},
cb: _cb, modalOptions: _modalOptions, event: _e
                });
            },
        };
// Events
        $scope.eventCallbacks = {
SaveBtnClicked:
            (e, DataItem, _parents) => {


                if (e != null) {
                    e.stopPropagation();
                    e.preventDefault();
                }

                if (this.timeoutDelayLockSaveBtnClicked != null) {
                    $timeout.cancel(this.timeoutDelayLockSaveBtnClicked);
                }

                this.timeoutDelayLockSaveBtnClicked = $timeout(() => {
                    Joove.Common.setControlKeyPressed(e, 0); Joove.Common.setLastClickedElement(e);

                    Joove.Validation.Manager.validateFormAndExecute(() => {
                        $scope.actions.Save(null, null, e);
}, { groups: [Joove.Validation.Constants.ALL_GROUPS], withDataValidationsCheck: true, withRequiredFieldsCheck: true });
                }, 0);
            },

CancelBtnClicked:
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
        window._ruleEngine.addDataValidations(UserPreferencesDataValidations);
        window._ruleEngine.addConditionalFormattings(UserPreferencesConditionalFormattings);
        window._ruleEngine.addCalculatedExpressions(UserPreferencesCalculatedExpressions);

        window._commander.executeCommands(window.viewDTO.ClientCommands);
        window.viewDTO.ClientCommands = [];

        Joove.Common.setNumberLocalizationSettings();
        Joove.DeveloperApi.init($scope as any, window.scope_MasterPage as any);
        window.$formExtend && window.$formExtend();
        window.$onFormLoaded && window.$onFormLoaded();
    }
}
angular.module("Application").controller("UserPreferencesController", ["$scope", "$timeout", UserPreferencesController] as Array<string>);
}
