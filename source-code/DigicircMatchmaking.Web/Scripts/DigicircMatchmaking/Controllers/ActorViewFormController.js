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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
var directiveScopeReadyLimit = 10;
var directiveScopeReadyTimeout = 200;
window.onbeforeunload = function (e) {
    if (window._context.isDirty) {
        var msg = window._resourcesManager.getGlobalResource("RES_WEBFORM_DirtyMessage");
        e.returnValue = msg; // Gecko, Trident, Chrome 34+
        return msg;
    }
};
var DigicircMatchmaking;
(function (DigicircMatchmaking) {
    var Controllers;
    (function (Controllers) {
        var _this = this;
        var ActorViewFormConditionalFormattings = [
            new Joove.JbRule({
                name: "HideForProvidersConditional",
                type: Joove.RuleTypes.ConditionalFormatting,
                isDataSetRule: false,
                evaluatedAtServer: false,
                contextControlName: null,
                condition: function (_parents) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, Joove.Common.nullSafe(function () { return window["scope_ActorViewForm"].model.Actor.EntityType.IsProvider; }, false)];
                    });
                }); },
                evaluationTimes: [Joove.EvaluationTimes.OnLoad, Joove.EvaluationTimes.OnSubmit, Joove.EvaluationTimes.OnChange],
                isRelatedToDataValidation: false
            }),
            new Joove.JbRule({
                name: "ReadOnlyConditional",
                type: Joove.RuleTypes.ConditionalFormatting,
                isDataSetRule: false,
                evaluatedAtServer: false,
                contextControlName: null,
                condition: function (_parents) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, Joove.Common.nullSafe(function () { return window._context.currentAction == "Show"; }, false)];
                    });
                }); },
                evaluationTimes: [Joove.EvaluationTimes.OnLoad, Joove.EvaluationTimes.OnChange],
                isRelatedToDataValidation: false
            }),
            new Joove.JbRule({
                name: "HideEmptyTitleConditional",
                type: Joove.RuleTypes.ConditionalFormatting,
                isDataSetRule: false,
                evaluatedAtServer: false,
                contextControlName: null,
                condition: function (_parents) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, Joove.Common.nullSafe(function () { return CLMS.Framework.String.IsNullOrEmpty(Joove.Common.nullSafe(function () {
                                return Joove.Common.nullSafe(function () { return window["scope_ActorViewForm"].model.Title; }, "").trim();
                            }, "")); }, false)];
                    });
                }); },
                evaluationTimes: [Joove.EvaluationTimes.OnLoad, Joove.EvaluationTimes.OnSubmit, Joove.EvaluationTimes.OnChange],
                isRelatedToDataValidation: false
            }),
            new Joove.JbRule({
                name: "ShowOnEditConditional",
                type: Joove.RuleTypes.ConditionalFormatting,
                isDataSetRule: false,
                evaluatedAtServer: false,
                contextControlName: null,
                condition: function (_parents) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, Joove.Common.nullSafe(function () { return window._context.currentAction == "Show"; }, false) && (Joove.Common.nullSafe(function () { return window["scope_ActorViewForm"].model.SignInUser; }, null) == Joove.Common.nullSafe(function () { return window["scope_ActorViewForm"].model.Actor.AddedBy; }, null) || Joove.Common.nullSafe(function () { return window["scope_ActorViewForm"].model.Actor.Administrators.linq.any(function (a) { return Joove.Common.nullSafe(function () { return a.UserName; }, "") == Joove.Common.nullSafe(function () { return window["scope_ActorViewForm"].model.SignInUser.UserName; }, ""); }); }, false)) && !(Joove.Common.nullSafe(function () { return window["scope_ActorViewForm"].model.Actor.EntityType.IsCluster; }, false))];
                    });
                }); },
                evaluationTimes: [Joove.EvaluationTimes.OnLoad, Joove.EvaluationTimes.OnSubmit, Joove.EvaluationTimes.OnChange],
                isRelatedToDataValidation: false
            }),
            new Joove.JbRule({
                name: "SpecifyEnityIfOtherConditional",
                type: Joove.RuleTypes.ConditionalFormatting,
                isDataSetRule: false,
                evaluatedAtServer: false,
                contextControlName: null,
                condition: function (_parents) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, Joove.Common.nullSafe(function () { return window["scope_ActorViewForm"].model.Actor.EntityType.Code; }, "") == "Other"];
                    });
                }); },
                evaluationTimes: [Joove.EvaluationTimes.OnLoad, Joove.EvaluationTimes.OnSubmit, Joove.EvaluationTimes.OnChange],
                isRelatedToDataValidation: false
            }),
            new Joove.JbRule({
                name: "SpecifyExperienceInCircularEconomyConditional",
                type: Joove.RuleTypes.ConditionalFormatting,
                isDataSetRule: false,
                evaluatedAtServer: false,
                contextControlName: null,
                condition: function (_parents) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, Joove.Common.nullSafe(function () { return window["scope_ActorViewForm"].model.Actor.CircularEconomyRequirements.ExperienceInCircularEconomy; }, false)];
                    });
                }); },
                evaluationTimes: [Joove.EvaluationTimes.OnLoad, Joove.EvaluationTimes.OnChange],
                isRelatedToDataValidation: false
            }),
            new Joove.JbRule({
                name: "ShowForProvidersConditional",
                type: Joove.RuleTypes.ConditionalFormatting,
                isDataSetRule: false,
                evaluatedAtServer: false,
                contextControlName: null,
                condition: function (_parents) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, Joove.Common.nullSafe(function () { return window["scope_ActorViewForm"].model.Actor.EntityType.IsProvider; }, false)];
                    });
                }); },
                evaluationTimes: [Joove.EvaluationTimes.OnLoad, Joove.EvaluationTimes.OnSubmit, Joove.EvaluationTimes.OnChange],
                isRelatedToDataValidation: false
            }),
            new Joove.JbRule({
                name: "HideIfNotMemberOfClusterConditional",
                type: Joove.RuleTypes.ConditionalFormatting,
                isDataSetRule: false,
                evaluatedAtServer: false,
                contextControlName: null,
                condition: function (_parents) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, Joove.Common.nullSafe(function () { return window["scope_ActorViewForm"].model.Actor.MemberOfCluster; }, false)];
                    });
                }); },
                evaluationTimes: [Joove.EvaluationTimes.OnLoad, Joove.EvaluationTimes.OnChange],
                isRelatedToDataValidation: false
            }),
            new Joove.JbRule({
                name: "ShowSpecifiedClusterNameConditional",
                type: Joove.RuleTypes.ConditionalFormatting,
                isDataSetRule: false,
                evaluatedAtServer: false,
                contextControlName: null,
                condition: function (_parents) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, Joove.Common.nullSafe(function () { return window["scope_ActorViewForm"].model.Actor.MemberOfCluster; }, false) && Joove.Common.nullSafe(function () { return window["scope_ActorViewForm"].model.Actor.Cluster; }, null) == null];
                    });
                }); },
                evaluationTimes: [Joove.EvaluationTimes.OnLoad, Joove.EvaluationTimes.OnChange],
                isRelatedToDataValidation: false
            }),
        ];
        var ActorViewFormDataValidations = [];
        var ActorViewFormCalculatedExpressions = [];
        // Datasets Column Info
        Controllers.SectorTypeDataSet_ColumnInfo = [new Joove.ColumnInfo("Value", "string", null, false),
            new Joove.ColumnInfo("original", "SectorType", null, false)];
        window["SectorTypeDataSet_ColumnInfo"] = Controllers.SectorTypeDataSet_ColumnInfo;
        Controllers.MapPoints_ColumnInfo = [new Joove.ColumnInfo("Address.Latitude", "double", null, false),
            new Joove.ColumnInfo("Address.Longitude", "double", null, false)];
        window["MapPoints_ColumnInfo"] = Controllers.MapPoints_ColumnInfo;
        var ActorViewFormMapPointsViewModelDataset = /** @class */ (function (_super) {
            __extends(ActorViewFormMapPointsViewModelDataset, _super);
            function ActorViewFormMapPointsViewModelDataset(model, partialViewControlName) {
                if (partialViewControlName === void 0) { partialViewControlName = null; }
                var _this = _super.call(this, model, partialViewControlName) || this;
                _this.limit = 0;
                return _this;
            }
            ActorViewFormMapPointsViewModelDataset.prototype.Filter = function (inputs) {
                var $scope = { model: this.model };
                return function (DataItem, index, items) {
                    return true;
                };
            };
            ActorViewFormMapPointsViewModelDataset.prototype.PackInputs = function ($control) {
                return Joove.DatasourceManager.getDatasetControlInputs($control);
            };
            ActorViewFormMapPointsViewModelDataset.prototype.Sort = function (items) {
                return items;
            };
            ActorViewFormMapPointsViewModelDataset.prototype.GetSource = function (parents) {
                return this.model.Points;
            };
            return ActorViewFormMapPointsViewModelDataset;
        }(Joove.IViewModelDataset));
        Controllers.ActorViewFormMapPointsViewModelDataset = ActorViewFormMapPointsViewModelDataset;
        // Datasets Projection Shemas
        window["DropdownBox2_ProjectionScema"] = {};
        window["ImageBox1_ProjectionScema"] = { Actor: { Id: '',
                _key: '',
                ActorLogo: { Id: '',
                    _key: '',
                    Description: {},
                    FileName: {},
                    StorageMedium: {},
                    FolderPath: {},
                    UploadDateTime: {},
                    UploadedBy: {}
                }
            }
        };
        var ActorViewFormController = /** @class */ (function () {
            function ActorViewFormController($scope, $timeout) {
                this.$scope = $scope;
                this.controllerActionFinished = function (resetDirty) {
                    //window.scope_ActorViewForm.model = window.scope_ActorViewForm.dehydrate();
                    //window.scope_MasterPage.model = window.scope_ActorViewForm.model;
                    DigicircMatchmaking.ViewModels.ActorViewForm.ActorViewFormViewModel._lightCast(window.scope_ActorViewForm.model);
                    // Joove.Common.applyScope(window.scope_ActorViewForm);
                    if (resetDirty) {
                        window._context.isDirty = false;
                    }
                    window._ruleEngine.update(Joove.EvaluationTimes.OnChange);
                };
                window.scope_ActorViewForm = $scope;
                $scope.$onControlChanged = function (event, newValue, dontMakeDirty) {
                    Joove.Core.onChange(event.target, newValue, dontMakeDirty);
                };
                $scope.dehydrate = function (context) {
                    if (context === void 0) { context = null; }
                    return DigicircMatchmaking.ViewModels.ActorViewForm.ActorViewFormViewModel._initializeFrom($scope.model, context);
                };
                $scope._validationsMaster = window.scope_MasterPage._validations;
                $scope._validations = { summary: [],
                };
                this.init($scope, $timeout);
                $timeout(function () {
                    window._ruleEngine.update(Joove.EvaluationTimes.OnLoad, null, function () {
                        $("body").fadeIn(200);
                    });
                });
            }
            ActorViewFormController.prototype.init = function ($scope, $timeout) {
                var _this = this;
                $scope.model = DigicircMatchmaking.ViewModels.ActorViewForm.ActorViewFormViewModel._initializeFrom(window.viewDTO.Model);
                window.scope_MasterPage.model = $scope.model;
                new Joove.ReferencesReconstructor().reconstructReferences($scope.model);
                $scope.trackObject = function (obj) { return Joove.Common.trackObject(obj); };
                //}
                $.connection['eventsHub'].on('__connectedEvent', function () { });
                $.connection['eventsHub'].on('forcePageReload', function () {
                    window.onbeforeunload = null;
                    setTimeout(function () {
                        window.location.reload();
                    }, 3000);
                });
                $.connection.hub.start().then(function () {
                    Joove.Common.getScope().connectedToSignals();
                    Joove.Common.getMasterScope().connectedToSignals();
                });
                $scope.connectedToSignals = function () {
                };
                // Event Listeners
                $scope.events = {};
                $scope.expressions = {};
                // Dataset Handler
                $scope.datasets = {
                    MapPoints: function (partialViewControlName) {
                        if (partialViewControlName === void 0) { partialViewControlName = null; }
                        return new DigicircMatchmaking.Controllers.ActorViewFormMapPointsViewModelDataset($scope.model, partialViewControlName);
                    },
                };
                // Controller actions
                $scope.actions = {
                    GoToWebsite: function (_cb, _modalOptions, _e) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            Joove.Common.autocompleteFix();
                            Joove.Core.executeControllerActionNew({
                                verb: 'POST', controller: 'ActorViewForm', action: 'GoToWebsite',
                                queryData: [], postData: { 'model': $scope.model },
                                cb: _cb, modalOptions: _modalOptions, event: _e
                            });
                            return [2 /*return*/];
                        });
                    }); },
                    Show: function (id, fromGraph, _cb, _modalOptions, _e) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            Joove.Common.autocompleteFix();
                            Joove.Core.executeRedirectControllerAction("ActorViewForm", "Show", "GET", [id, fromGraph], {}, _modalOptions);
                            return [2 /*return*/];
                        });
                    }); },
                    Save: function (_cb, _modalOptions, _e) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    Joove.Common.autocompleteFix();
                                    return [4 /*yield*/, window._ruleEngine.update(Joove.EvaluationTimes.OnSubmit)];
                                case 1:
                                    _a.sent();
                                    window._context.isDirty = false;
                                    Joove.Core.executeControllerActionNew({
                                        verb: 'POST', controller: 'ActorViewForm', action: 'Save',
                                        queryData: [], postData: { 'model': $scope.model },
                                        cb: _cb, modalOptions: _modalOptions, event: _e
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); },
                    Delete: function (_cb, _modalOptions, _e) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            Joove.Common.autocompleteFix();
                            window._context.isDirty = false;
                            Joove.Core.executeControllerActionNew({
                                verb: 'POST', controller: 'ActorViewForm', action: 'Delete',
                                queryData: [], postData: { 'model': $scope.model },
                                cb: _cb, modalOptions: _modalOptions, event: _e
                            });
                            return [2 /*return*/];
                        });
                    }); },
                    SetSector: function (_cb, _modalOptions, _e) { return __awaiter(_this, void 0, void 0, function () {
                        var implementation, spamHelper;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    Joove.Common.autocompleteFix();
                                    implementation = function () { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            Joove.Common.nullSafe(function () { return window["scope_ActorViewForm"].model.Actor.SectorTypes.clear(); }, null);
                                            Joove.Common.nullSafe(function () { return window["scope_ActorViewForm"].model.Actor.SectorTypes.add(Joove.Common.nullSafe(function () { return window["scope_ActorViewForm"].model.SelectedSector; }, null)); }, null);
                                            return [2 /*return*/];
                                        });
                                    }); };
                                    spamHelper = new Joove.SpamControlHelper(_e);
                                    spamHelper.Disable();
                                    return [4 /*yield*/, implementation()];
                                case 1:
                                    _a.sent();
                                    spamHelper.Enable();
                                    this.controllerActionFinished(false);
                                    return [2 /*return*/];
                            }
                        });
                    }); },
                    Back: function (_cb, _modalOptions, _e) { return __awaiter(_this, void 0, void 0, function () {
                        var implementation, spamHelper;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    Joove.Common.autocompleteFix();
                                    implementation = function () { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            if ((Joove.Common.nullSafe(function () { return window["scope_ActorViewForm"].model.FromGraph; }, false))) {
                                                Joove.Common.nullSafe(function () { return Joove.Core.executeRedirectControllerAction("MatchBaseExplorer", "FromBack", "GET", [Joove.Common.nullSafe(function () { return window["scope_ActorViewForm"].model.Actor.Id; }, 0)], {}, _modalOptions); }, null);
                                            }
                                            else {
                                                Joove.Common.nullSafe(function () { return Joove.Core.executeRedirectControllerAction("SearchForm", "FromBack", "GET", [Joove.Common.nullSafe(function () { return window["scope_ActorViewForm"].model.Actor.Id; }, 0)], {}, _modalOptions); }, null);
                                            }
                                            return [2 /*return*/];
                                        });
                                    }); };
                                    spamHelper = new Joove.SpamControlHelper(_e);
                                    spamHelper.Disable();
                                    return [4 /*yield*/, implementation()];
                                case 1:
                                    _a.sent();
                                    spamHelper.Enable();
                                    this.controllerActionFinished(false);
                                    return [2 /*return*/];
                            }
                        });
                    }); },
                };
                // Events
                $scope.eventCallbacks = {
                    cmdExitClicked: function (e, DataItem, _parents) {
                        if (e != null) {
                            e.stopPropagation();
                            e.preventDefault();
                        }
                        if (_this.timeoutDelayLockcmdExitClicked != null) {
                            $timeout.cancel(_this.timeoutDelayLockcmdExitClicked);
                        }
                        _this.timeoutDelayLockcmdExitClicked = $timeout(function () {
                            Joove.Common.setControlKeyPressed(e, 0);
                            Joove.Common.setLastClickedElement(e);
                            Joove.Validation.Manager.validateFormAndExecute(function () {
                                $scope.actions.Back(null, null, e);
                            }, { groups: [Joove.Validation.Constants.ALL_GROUPS], withDataValidationsCheck: false, withRequiredFieldsCheck: false });
                        }, 0);
                    },
                    cmdDeleteCompanyClicked: function (e, DataItem, _parents) {
                        if (e != null) {
                            e.stopPropagation();
                            e.preventDefault();
                        }
                        if (_this.timeoutDelayLockcmdDeleteCompanyClicked != null) {
                            $timeout.cancel(_this.timeoutDelayLockcmdDeleteCompanyClicked);
                        }
                        _this.timeoutDelayLockcmdDeleteCompanyClicked = $timeout(function () {
                            Joove.Common.setControlKeyPressed(e, 0);
                            Joove.Common.setLastClickedElement(e);
                            window._popUpManager.question(window._resourcesManager.getGlobalResource("RES_WEBFORM_GenericConfirmationQuestion"), window._resourcesManager.getEventConfirmation("cmdDeleteCompany", false), function (isConfirm) {
                                if (!isConfirm)
                                    return;
                                setTimeout(function () {
                                    Joove.Validation.Manager.validateFormAndExecute(function () {
                                        $scope.actions.Delete(null, null, e);
                                    }, { groups: [Joove.Validation.Constants.ALL_GROUPS], withDataValidationsCheck: false, withRequiredFieldsCheck: false });
                                }, 1000);
                            });
                        }, 0);
                    },
                    ResourceManagementButtonClicked: function (e, DataItem, _parents) {
                        if (e != null) {
                            e.stopPropagation();
                            e.preventDefault();
                        }
                        if (_this.timeoutDelayLockResourceManagementButtonClicked != null) {
                            $timeout.cancel(_this.timeoutDelayLockResourceManagementButtonClicked);
                        }
                        _this.timeoutDelayLockResourceManagementButtonClicked = $timeout(function () {
                            Joove.Common.setControlKeyPressed(e, 0);
                            Joove.Common.setLastClickedElement(e);
                            Joove.Validation.Manager.validateFormAndExecute(function () {
                                //This is true only when the menu item is clicked programmatically
                                //and occurs when the middle mouse button click is triggered
                                var openInNewWindow = $(e.target).data("openInNewWindow") === true || undefined;
                                if (openInNewWindow)
                                    $(e.target).data("openInNewWindow", undefined);
                                Joove.Core.executeRedirectControllerAction("ManageResources", "Index", "GET", [Joove.Common.nullSafe(function () { return window["scope_ActorViewForm"].model.Actor.Id; }, 0)], null, null, openInNewWindow);
                            }, { groups: [], withDataValidationsCheck: false, withRequiredFieldsCheck: false });
                        }, 0);
                    },
                    EditButtonClicked: function (e, DataItem, _parents) {
                        if (e != null) {
                            e.stopPropagation();
                            e.preventDefault();
                        }
                        if (_this.timeoutDelayLockEditButtonClicked != null) {
                            $timeout.cancel(_this.timeoutDelayLockEditButtonClicked);
                        }
                        _this.timeoutDelayLockEditButtonClicked = $timeout(function () {
                            Joove.Common.setControlKeyPressed(e, 0);
                            Joove.Common.setLastClickedElement(e);
                            Joove.Validation.Manager.validateFormAndExecute(function () {
                                //This is true only when the menu item is clicked programmatically
                                //and occurs when the middle mouse button click is triggered
                                var openInNewWindow = $(e.target).data("openInNewWindow") === true || undefined;
                                if (openInNewWindow)
                                    $(e.target).data("openInNewWindow", undefined);
                                Joove.Core.executeRedirectControllerAction("ActorForm", "Edit", "GET", [Joove.Common.nullSafe(function () { return window["scope_ActorViewForm"].model.Actor.Id; }, 0)], null, null, openInNewWindow);
                            }, { groups: [], withDataValidationsCheck: false, withRequiredFieldsCheck: false });
                        }, 0);
                    },
                    HyperLinkClicked: function (e, DataItem, _parents) {
                        if (e != null) {
                            e.stopPropagation();
                            e.preventDefault();
                        }
                        if (_this.timeoutDelayLockHyperLinkClicked != null) {
                            $timeout.cancel(_this.timeoutDelayLockHyperLinkClicked);
                        }
                        _this.timeoutDelayLockHyperLinkClicked = $timeout(function () {
                            Joove.Common.setControlKeyPressed(e, 0);
                            Joove.Common.setLastClickedElement(e);
                            Joove.Validation.Manager.validateFormAndExecute(function () {
                                $scope.actions.GoToWebsite(null, null, e);
                            }, { groups: [Joove.Validation.Constants.ALL_GROUPS], withDataValidationsCheck: false, withRequiredFieldsCheck: false });
                        }, 0);
                    },
                };
                // Rules
                window._ruleEngine.addDataValidations(ActorViewFormDataValidations);
                window._ruleEngine.addConditionalFormattings(ActorViewFormConditionalFormattings);
                window._ruleEngine.addCalculatedExpressions(ActorViewFormCalculatedExpressions);
                window._commander.executeCommands(window.viewDTO.ClientCommands);
                window.viewDTO.ClientCommands = [];
                Joove.Common.setNumberLocalizationSettings();
                Joove.DeveloperApi.init($scope, window.scope_MasterPage);
                window.$formExtend && window.$formExtend();
                window.$onFormLoaded && window.$onFormLoaded();
            };
            return ActorViewFormController;
        }());
        angular.module("Application").controller("ActorViewFormController", ["$scope", "$timeout", ActorViewFormController]);
    })(Controllers = DigicircMatchmaking.Controllers || (DigicircMatchmaking.Controllers = {}));
})(DigicircMatchmaking || (DigicircMatchmaking = {}));
