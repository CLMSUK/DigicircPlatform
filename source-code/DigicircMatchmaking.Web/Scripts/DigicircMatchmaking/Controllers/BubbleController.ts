// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
var directiveScopeReadyLimit = 10;
var directiveScopeReadyTimeout = 200;
interface Window { scope_Bubble: DigicircMatchmaking.Controllers.IBubbleScope; }
namespace DigicircMatchmaking.Controllers {
const BubbleConditionalFormattings = (controlName?: string): Array<Joove.JbRule> => {
    return [
           ];
};
const BubbleDataValidations = (controlName?: string): Array<Joove.JbRule> => {
    return [
           ];
};
const BubbleCalculatedExpressions = (controlName?: string): Array<Joove.JbRule> => {
    return [
           ];
};

// Datasets Column Info

// Datasets Projection Shemas

export interface IBubbleScope extends Joove.IWebPageScope {
model:
    any;
_partialModelStructure:
    any;
    _validations?: {
summary: Array<Joove.Validation.BindingEntry>,

    },
    _masterValidations?: any;
}

export interface IBubblePartialModelStructure {
Actor:
    any;
}


export class BubbleController {

private _normalToPartialModelMappingStructure:
    any;

    constructor( normalToPartialModelMappingStructure: {
                     [partialControlName: string] :
                     IBubblePartialModelStructure
                 } ) {
        this._normalToPartialModelMappingStructure = normalToPartialModelMappingStructure;
    }

private timeoutDelayLockIcon1Clicked:
    any;
private timeoutDelayLockButtonClicked:
    any;

    IncludePartialMethods ($scope: any, controls: Array<string>, $timeout: ng.ITimeoutService): void {
        window["scope_Bubble"] = $scope;

        if($scope._partialModelStructure == null) {
            $scope._partialModelStructure = {};
        }

        for (let key in this._normalToPartialModelMappingStructure) {
            let value = this._normalToPartialModelMappingStructure[key];
            $scope._partialModelStructure[key] = value;
        }

        //$scope._partialModelStructure = this._normalToPartialModelMappingStructure;






        $.connection['eventsHub'].on('forcePageReload', () => {
            window.onbeforeunload = null;
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        });
// Events
        $scope.eventCallbacks.Bubble = {
Icon1Clicked:
            (e, DataItem, _parents) => {


                if (e != null) {
                    e.stopPropagation();
                    e.preventDefault();
                }

                if (this.timeoutDelayLockIcon1Clicked != null) {
                    $timeout.cancel(this.timeoutDelayLockIcon1Clicked);
                }

                this.timeoutDelayLockIcon1Clicked = $timeout(() => {
                    Joove.Common.setControlKeyPressed(e, 0); Joove.Common.setLastClickedElement(e);

                    Joove.Validation.Manager.validateFormAndExecute(() => {
                        var controlName = $(e.currentTarget || e.target).closest("[jb-type='PartialView']").attr("jb-id"); $scope.actions.Bubble.Close(controlName, null, null, e);
}, { groups: [Joove.Validation.Constants.ALL_GROUPS], withDataValidationsCheck: false, withRequiredFieldsCheck: false });
                }, 0);
            },

ButtonClicked:
            (e, DataItem, _parents) => {


                if (e != null) {
                    e.stopPropagation();
                    e.preventDefault();
                }

                if (this.timeoutDelayLockButtonClicked != null) {
                    $timeout.cancel(this.timeoutDelayLockButtonClicked);
                }

                this.timeoutDelayLockButtonClicked = $timeout(() => {
                    Joove.Common.setControlKeyPressed(e, 0); Joove.Common.setLastClickedElement(e);

                    Joove.Validation.Manager.validateFormAndExecute(() => {
                        var controlName = $(e.currentTarget || e.target).closest("[jb-type='PartialView']").attr("jb-id"); $scope.actions.Bubble.RedirectToActorForm(controlName, null, null, e);
}, { groups: [Joove.Validation.Constants.ALL_GROUPS], withDataValidationsCheck: false, withRequiredFieldsCheck: false });
                }, 0);
            },

        };

// Rules
        window._ruleEngine.addDataValidations(Joove.JbRule.createRulesForPartialControls(controls, BubbleDataValidations));
        window._ruleEngine.addConditionalFormattings(Joove.JbRule.createRulesForPartialControls(controls, BubbleConditionalFormattings));
        window._ruleEngine.addCalculatedExpressions(Joove.JbRule.createRulesForPartialControls(controls, BubbleCalculatedExpressions));

    }
};
angular.module("Application").controller("BubbleController", ["$scope", "$timeout", BubbleController] as Array<string>);
}
