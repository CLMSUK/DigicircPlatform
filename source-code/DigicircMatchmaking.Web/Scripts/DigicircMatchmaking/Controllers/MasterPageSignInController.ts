// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
var directiveScopeReadyLimit = 10;
var directiveScopeReadyTimeout = 200;
interface Window { scope_MasterPageSignIn: DigicircMatchmaking.Controllers.IMasterPageSignInScope; }
namespace DigicircMatchmaking.Controllers {
var _treeNodesConfiguration = { };
const MasterPageSignInConditionalFormattings = [
        ];
const MasterPageSignInDataValidations = [
                                        ];
const MasterPageSignInCalculatedExpressions = [
        ];

// Datasets Column Info

// Datasets Projection Shemas


export interface IMasterPageSignInScope extends Joove.IWebPageScope {
model:
    DigicircMatchmaking.ViewModels.MasterPageSignIn.MasterPageSignInViewModel;
_partialModelStructure:
    any;
    _validations?: {
summary: Array<Joove.Validation.BindingEntry>,

    },
    _masterValidations?: any;
}

class MasterPageSignInController {


    private controllerActionFinished = (resetDirty: boolean) => {
        //window.scope_MasterPageSignIn.model = window.scope_MasterPageSignIn.dehydrate();
        //
        DigicircMatchmaking.ViewModels.MasterPageSignIn.MasterPageSignInViewModel._lightCast(window.scope_MasterPageSignIn.model);
        // Joove.Common.applyScope(window.scope_MasterPageSignIn);
        if (resetDirty) {
            window._context.isDirty = false;
        }
        window._ruleEngine.update(Joove.EvaluationTimes.OnChange);
    }

    constructor(private $scope: IMasterPageSignInScope, $timeout: ng.ITimeoutService) {
        window.scope_MasterPageSignIn = $scope;
        $scope.$onControlChanged = function (event, newValue, dontMakeDirty) {
            Joove.Core.onChange(event.target, newValue, dontMakeDirty)
        }

        $scope._ready = false;
        window._context.currentMasterPageObject = this;
        $scope.dehydrate = (context = null) => DigicircMatchmaking.ViewModels.MasterPageSignIn.MasterPageSignInViewModel._initializeFrom($scope.model, context);
        $scope._validations = { summary:
                                [],
                              };

        let onSuccess = (data: any, textStatus: string, jqXhr: JQueryXHR)  => {
            Joove.Core.checkAppVersion();
            Joove.Core.handleServerResponse("MasterPageSignIn", data);
            this.init($scope, $timeout);
            //Joove.Common.applyScope($scope);
            //window._ruleEngine.update(Joove.EvaluationTimes.OnLoad, null, () => {
            $scope._ready = true;
            CLMS.Framework.Utilities.FocusOnFirstInputElementOfModal();
            //});
        }; //end onSuccess()

        window._backEndInfoAggregator.get(false, { success: onSuccess });

    }

    init($scope: IMasterPageSignInScope, $timeout: ng.ITimeoutService) {


        $scope.trackObject = obj => Joove.Common.trackObject(obj);




        //}

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


                Joove.Core.executeRedirectControllerAction("MasterPageSignIn", "Render", "GET", [], {}, _modalOptions);
            },
        };
// Events
        $scope.eventCallbacks = {
        };

// Rules
        window._ruleEngine.addDataValidations(MasterPageSignInDataValidations);
        window._ruleEngine.addConditionalFormattings(MasterPageSignInConditionalFormattings);
        window._ruleEngine.addCalculatedExpressions(MasterPageSignInCalculatedExpressions);

        window._commander.executeCommands(window.viewDTO.ClientCommands);
        window.viewDTO.ClientCommands = [];
    }
}
angular.module("Application").controller("MasterPageSignInController", ["$scope", "$timeout", MasterPageSignInController] as Array<string>);
}
