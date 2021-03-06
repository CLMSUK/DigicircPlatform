// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
var directiveScopeReadyLimit = 10;
var directiveScopeReadyTimeout = 200;
var DigicircMatchmaking;
(function (DigicircMatchmaking) {
    var Controllers;
    (function (Controllers) {
        var BubbleConditionalFormattings = function (controlName) {
            return [];
        };
        var BubbleDataValidations = function (controlName) {
            return [];
        };
        var BubbleCalculatedExpressions = function (controlName) {
            return [];
        };
        var BubbleController = /** @class */ (function () {
            function BubbleController(normalToPartialModelMappingStructure) {
                this._normalToPartialModelMappingStructure = normalToPartialModelMappingStructure;
            }
            BubbleController.prototype.IncludePartialMethods = function ($scope, controls, $timeout) {
                var _this = this;
                window["scope_Bubble"] = $scope;
                if ($scope._partialModelStructure == null) {
                    $scope._partialModelStructure = {};
                }
                for (var key in this._normalToPartialModelMappingStructure) {
                    var value = this._normalToPartialModelMappingStructure[key];
                    $scope._partialModelStructure[key] = value;
                }
                //$scope._partialModelStructure = this._normalToPartialModelMappingStructure;
                $.connection['eventsHub'].on('forcePageReload', function () {
                    window.onbeforeunload = null;
                    setTimeout(function () {
                        window.location.reload();
                    }, 3000);
                });
                // Events
                $scope.eventCallbacks.Bubble = {
                    Icon1Clicked: function (e, DataItem, _parents) {
                        if (e != null) {
                            e.stopPropagation();
                            e.preventDefault();
                        }
                        if (_this.timeoutDelayLockIcon1Clicked != null) {
                            $timeout.cancel(_this.timeoutDelayLockIcon1Clicked);
                        }
                        _this.timeoutDelayLockIcon1Clicked = $timeout(function () {
                            Joove.Common.setControlKeyPressed(e, 0);
                            Joove.Common.setLastClickedElement(e);
                            Joove.Validation.Manager.validateFormAndExecute(function () {
                                var controlName = $(e.currentTarget || e.target).closest("[jb-type='PartialView']").attr("jb-id");
                                $scope.actions.Bubble.Close(controlName, null, null, e);
                            }, { groups: [Joove.Validation.Constants.ALL_GROUPS], withDataValidationsCheck: false, withRequiredFieldsCheck: false });
                        }, 0);
                    },
                    ButtonClicked: function (e, DataItem, _parents) {
                        if (e != null) {
                            e.stopPropagation();
                            e.preventDefault();
                        }
                        if (_this.timeoutDelayLockButtonClicked != null) {
                            $timeout.cancel(_this.timeoutDelayLockButtonClicked);
                        }
                        _this.timeoutDelayLockButtonClicked = $timeout(function () {
                            Joove.Common.setControlKeyPressed(e, 0);
                            Joove.Common.setLastClickedElement(e);
                            Joove.Validation.Manager.validateFormAndExecute(function () {
                                var controlName = $(e.currentTarget || e.target).closest("[jb-type='PartialView']").attr("jb-id");
                                $scope.actions.Bubble.RedirectToActorForm(controlName, null, null, e);
                            }, { groups: [Joove.Validation.Constants.ALL_GROUPS], withDataValidationsCheck: false, withRequiredFieldsCheck: false });
                        }, 0);
                    },
                };
                // Rules
                window._ruleEngine.addDataValidations(Joove.JbRule.createRulesForPartialControls(controls, BubbleDataValidations));
                window._ruleEngine.addConditionalFormattings(Joove.JbRule.createRulesForPartialControls(controls, BubbleConditionalFormattings));
                window._ruleEngine.addCalculatedExpressions(Joove.JbRule.createRulesForPartialControls(controls, BubbleCalculatedExpressions));
            };
            return BubbleController;
        }());
        Controllers.BubbleController = BubbleController;
        ;
        angular.module("Application").controller("BubbleController", ["$scope", "$timeout", BubbleController]);
    })(Controllers = DigicircMatchmaking.Controllers || (DigicircMatchmaking.Controllers = {}));
})(DigicircMatchmaking || (DigicircMatchmaking = {}));
