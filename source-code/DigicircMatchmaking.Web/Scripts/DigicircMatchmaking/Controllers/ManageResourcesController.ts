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
interface Window { scope_ManageResources: DigicircMatchmaking.Controllers.IManageResourcesScope; }
namespace DigicircMatchmaking.Controllers {
const ManageResourcesConditionalFormattings = [
new Joove.JbRule({
name: "HideEmptyTitleConditional",
type: Joove.RuleTypes.ConditionalFormatting,
isDataSetRule: false,
evaluatedAtServer: false,
contextControlName: null,


condition: async (_parents) => {
        return Joove.Common.nullSafe<any>(() => CLMS.Framework.String.IsNullOrEmpty(Joove.Common.nullSafe(function () {
            return Joove.Common.nullSafe<any>(() => window["scope_ManageResources"].model.Title, "").trim();
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
const ManageResourcesDataValidations = [
                                       ];
const ManageResourcesCalculatedExpressions = [
        ];

// Datasets Column Info

export class ManageResourcesResourcesViewModelDataset extends Joove.IViewModelDataset<any> {


    constructor(model, partialViewControlName: string = null) {
        super(model, partialViewControlName);
        this.limit = 0;
    }

    Filter(inputs: any): (DataItem: any, index: number, items: Array<any>) => boolean {
        var $scope = { model: this.model };

        return (DataItem, index, items) => {
            return true;


        };
    }

    PackInputs($control: JQuery): any {
        return Joove.DatasourceManager.getDatasetControlInputs($control);
    }

    Sort(items: Joove.ViewModelCollection): Joove.ViewModelCollection {
        return items;
    }

    GetSource(parents: number[]): Joove.ViewModelCollection {
        return this.model.Actor.CircularEconomyRequirements.Resources;
    }


}



// Datasets Projection Shemas
class PartialViewPartialModelStructure implements IResourceFormPartialModelStructure {
private _name:
    string;
    constructor($scope, name: string) {
        this._name = name;
    }
    get Product(): any { return window["scope_ResourceForm"].model.SelectedProduct };
        set Product(__val: any) {
        window["scope_ResourceForm"].model.SelectedProduct = __val;
    };

    get ActorId(): any { return window["scope_ResourceForm"].model.Actor.Id };
        set ActorId(__val: any) {
        window["scope_ResourceForm"].model.Actor.Id = __val;
    };

}//end class PartialViewPartialModelStructure


export interface IManageResourcesScope extends Joove.IWebPageScope {
model:
    DigicircMatchmaking.ViewModels.ManageResources.ManageResourcesViewModel;
_partialModelStructure:
    any;
    _validations?: {
summary: Array<Joove.Validation.BindingEntry>,

    },
    _masterValidations?: any;
}

class ManageResourcesController {
private timeoutDelayLockcmdExitClicked:
    any;
private timeoutDelayLockcmdCompanySaveClicked:
    any;
private timeoutDelayLockButton4Clicked:
    any;
private timeoutDelayLockIcon2Clicked:
    any;
private timeoutDelayLockIcon1Clicked:
    any;
private timeoutDelayLockButtonClicked:
    any;
private timeoutDelayLockIcon21Clicked:
    any;
private timeoutDelayLockIcon11Clicked:
    any;
private timeoutDelayLockButton2Clicked:
    any;
private timeoutDelayLockIcon3Clicked:
    any;
private timeoutDelayLockButton1Clicked:
    any;
private timeoutDelayLockClearButtonClicked:
    any;
private timeoutDelayLockIcon4Clicked:
    any;
private timeoutDelayLockButton3Clicked:
    any;


    private controllerActionFinished = (resetDirty: boolean) => {
        //window.scope_ManageResources.model = window.scope_ManageResources.dehydrate();
        //window.scope_MasterPage.model = window.scope_ManageResources.model;
        DigicircMatchmaking.ViewModels.ManageResources.ManageResourcesViewModel._lightCast(window.scope_ManageResources.model);
        // Joove.Common.applyScope(window.scope_ManageResources);
        if (resetDirty) {
            window._context.isDirty = false;
        }
        window._ruleEngine.update(Joove.EvaluationTimes.OnChange);
    }

    constructor(private $scope: IManageResourcesScope, $timeout: ng.ITimeoutService) {
        window.scope_ManageResources = $scope;
        $scope.$onControlChanged = function (event, newValue, dontMakeDirty) {
            Joove.Core.onChange(event.target, newValue, dontMakeDirty)
        }

        $scope.dehydrate = (context = null) => DigicircMatchmaking.ViewModels.ManageResources.ManageResourcesViewModel._initializeFrom($scope.model, context);
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

    init($scope: IManageResourcesScope, $timeout: ng.ITimeoutService) {


        $scope.model = DigicircMatchmaking.ViewModels.ManageResources.ManageResourcesViewModel._initializeFrom(window.viewDTO.Model);

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

Resources:
            (partialViewControlName: string = null) => {
                return new DigicircMatchmaking.Controllers.ManageResourcesResourcesViewModelDataset($scope.model, partialViewControlName);
            },
        };
// Controller actions
        $scope.actions = {
Index:
            async (id, _cb, _modalOptions, _e) => {
                Joove.Common.autocompleteFix();


                Joove.Core.executeRedirectControllerAction("ManageResources", "Index", "GET", [id], {}, _modalOptions);
            },
AddNewResource:
            async (desired, _cb, _modalOptions, _e) => {
                Joove.Common.autocompleteFix();

                const implementation = async (): Promise<any> => {
                    window["scope_ManageResources"].model.ModalTitle = "Add new Resource";

                    window["scope_ManageResources"].model.SelectedProduct = Joove.Common.nullSafe<any>(() => new DigicircMatchmaking.BO.Product(), null);

                    window["scope_ManageResources"].model.SelectedProduct.IsDesired = desired;

                    window["scope_ManageResources"].model.IsEdited = false;

                    Joove.Common.nullSafe<any>(() => window._commander.showModal("Modal"), null);


                    // Joove.Common.applyScope(window.scope_ManageResources);
                }


                let spamHelper = new Joove.SpamControlHelper(_e);
                spamHelper.Disable();
                await implementation();
                spamHelper.Enable();
                this.controllerActionFinished(false);
            },
EditResource:
            async (product, _cb, _modalOptions, _e) => {
                Joove.Common.autocompleteFix();

                const implementation = async (): Promise<any> => {
                    window["scope_ManageResources"].model.ModalTitle = "Edit " + Joove.Common.nullSafe<any>(() => product.Resource.Name, "");

                    window["scope_ManageResources"].model.IsEdited = true;

                    window["scope_ManageResources"].model.SelectedProduct = product;

                    Joove.Common.nullSafe<any>(() => window._commander.showModal("Modal"), null);


                    // Joove.Common.applyScope(window.scope_ManageResources);
                }


                let spamHelper = new Joove.SpamControlHelper(_e);
                spamHelper.Disable();
                await implementation();
                spamHelper.Enable();
                this.controllerActionFinished(false);
            },
CloseModal:
            async (_cb, _modalOptions, _e) => {
                Joove.Common.autocompleteFix();


                Joove.Core.executeControllerActionNew({
verb: 'POST', controller: 'ManageResources', action: 'CloseModal',
queryData: [], postData: {'model': $scope.model},
cb: _cb, modalOptions: _modalOptions, event: _e
                });
            },
DeleteResource:
            async (product, _cb, _modalOptions, _e) => {
                Joove.Common.autocompleteFix();


                Joove.Core.executeControllerActionNew({
verb: 'POST', controller: 'ManageResources', action: 'DeleteResource',
queryData: [], postData: {'model': $scope.model, 'product': product},
cb: _cb, modalOptions: _modalOptions, event: _e
                });
            },
Save:
            async (_cb, _modalOptions, _e) => {
                Joove.Common.autocompleteFix();

                window._context.isDirty = false;
                Joove.Core.executeControllerActionNew({
verb: 'POST', controller: 'ManageResources', action: 'Save',
queryData: [], postData: {'model': $scope.model},
cb: _cb, modalOptions: _modalOptions, event: _e
                });
            },
RequestNewMaterial:
            async (_cb, _modalOptions, _e) => {
                Joove.Common.autocompleteFix();

                const implementation = async (): Promise<any> => {
                    Joove.Common.nullSafe<any>(() => window._commander.showModal("NewMaterialModal"), null);


                    // Joove.Common.applyScope(window.scope_ManageResources);
                }


                let spamHelper = new Joove.SpamControlHelper(_e);
                spamHelper.Disable();
                await implementation();
                spamHelper.Enable();
                this.controllerActionFinished(false);
            },
CloseMaterialModal:
            async (save, _cb, _modalOptions, _e) => {
                Joove.Common.autocompleteFix();

                window._context.isDirty = false;
                Joove.Core.executeControllerActionNew({
verb: 'POST', controller: 'ManageResources', action: 'CloseMaterialModal',
queryData: [], postData: {'model': $scope.model, 'save': save},
cb: _cb, modalOptions: _modalOptions, event: _e
                });
            },
        };
//Partial ResourceForm Event Listeners
        $scope.events.ResourceForm = {
        };
        $scope.expressions.ResourceForm = {
        }
// Partial ResourceForm Dataset Handler
        $scope.datasets.ResourceForm = {
        };
//Partial ResourceForm actions
        $scope.actions.ResourceForm = {
        };
// Events
        $scope.eventCallbacks = {
cmdExitClicked:
            (e, DataItem, _parents) => {


                if (e != null) {
                    e.stopPropagation();
                    e.preventDefault();
                }

                if (this.timeoutDelayLockcmdExitClicked != null) {
                    $timeout.cancel(this.timeoutDelayLockcmdExitClicked);
                }

                this.timeoutDelayLockcmdExitClicked = $timeout(() => {
                    Joove.Common.setControlKeyPressed(e, 0); Joove.Common.setLastClickedElement(e);

                    Joove.Validation.Manager.validateFormAndExecute(() => {
                        //This is true only when the menu item is clicked programmatically
                        //and occurs when the middle mouse button click is triggered
                        var openInNewWindow = $(e.target).data("openInNewWindow") === true || undefined;
                        if (openInNewWindow) $(e.target).data("openInNewWindow", undefined); Joove.Core.executeRedirectControllerAction("ActorViewForm", "Show", "GET", [Joove.Common.nullSafe<any>(() => window["scope_ManageResources"].model.Actor.Id, 0),false], null, null, openInNewWindow);
}, { groups: [], withDataValidationsCheck: false, withRequiredFieldsCheck: false });
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
}, { groups: [Joove.Validation.Constants.ALL_GROUPS], withDataValidationsCheck: false, withRequiredFieldsCheck: false });
                }, 0);
            },

Button4Clicked:
            (e, DataItem, _parents) => {


                if (e != null) {
                    e.stopPropagation();
                    e.preventDefault();
                }

                if (this.timeoutDelayLockButton4Clicked != null) {
                    $timeout.cancel(this.timeoutDelayLockButton4Clicked);
                }

                this.timeoutDelayLockButton4Clicked = $timeout(() => {
                    Joove.Common.setControlKeyPressed(e, 0); Joove.Common.setLastClickedElement(e);

                    Joove.Validation.Manager.validateFormAndExecute(() => {
                        $scope.actions.RequestNewMaterial(null, null, e);
}, { groups: [Joove.Validation.Constants.ALL_GROUPS], withDataValidationsCheck: false, withRequiredFieldsCheck: false });
                }, 0);
            },

Icon2Clicked:
            (e, DataItem, _parents) => {


                if (e != null) {
                    e.stopPropagation();
                    e.preventDefault();
                }

                if (this.timeoutDelayLockIcon2Clicked != null) {
                    $timeout.cancel(this.timeoutDelayLockIcon2Clicked);
                }

                this.timeoutDelayLockIcon2Clicked = $timeout(() => {
                    Joove.Common.setControlKeyPressed(e, 0); Joove.Common.setLastClickedElement(e);

                    Joove.Validation.Manager.validateFormAndExecute(() => {
                        $scope.actions.DeleteResource(_parents[0], null, null, e);
}, { groups: [Joove.Validation.Constants.ALL_GROUPS], withDataValidationsCheck: false, withRequiredFieldsCheck: false });
                }, 0);
            },

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
                        $scope.actions.EditResource(_parents[0], false, null, null, e);
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
                        $scope.actions.AddNewResource(false, null, null, e);
}, { groups: [Joove.Validation.Constants.ALL_GROUPS], withDataValidationsCheck: false, withRequiredFieldsCheck: false });
                }, 0);
            },

Icon21Clicked:
            (e, DataItem, _parents) => {


                if (e != null) {
                    e.stopPropagation();
                    e.preventDefault();
                }

                if (this.timeoutDelayLockIcon21Clicked != null) {
                    $timeout.cancel(this.timeoutDelayLockIcon21Clicked);
                }

                this.timeoutDelayLockIcon21Clicked = $timeout(() => {
                    Joove.Common.setControlKeyPressed(e, 0); Joove.Common.setLastClickedElement(e);

                    Joove.Validation.Manager.validateFormAndExecute(() => {
                        $scope.actions.DeleteResource(_parents[0], null, null, e);
}, { groups: [Joove.Validation.Constants.ALL_GROUPS], withDataValidationsCheck: false, withRequiredFieldsCheck: false });
                }, 0);
            },

Icon11Clicked:
            (e, DataItem, _parents) => {


                if (e != null) {
                    e.stopPropagation();
                    e.preventDefault();
                }

                if (this.timeoutDelayLockIcon11Clicked != null) {
                    $timeout.cancel(this.timeoutDelayLockIcon11Clicked);
                }

                this.timeoutDelayLockIcon11Clicked = $timeout(() => {
                    Joove.Common.setControlKeyPressed(e, 0); Joove.Common.setLastClickedElement(e);

                    Joove.Validation.Manager.validateFormAndExecute(() => {
                        $scope.actions.EditResource(_parents[0], null, null, e);
}, { groups: [Joove.Validation.Constants.ALL_GROUPS], withDataValidationsCheck: false, withRequiredFieldsCheck: false });
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

                    Joove.Validation.Manager.validateFormAndExecute(() => {
                        $scope.actions.AddNewResource(true, null, null, e);
}, { groups: [Joove.Validation.Constants.ALL_GROUPS], withDataValidationsCheck: false, withRequiredFieldsCheck: false });
                }, 0);
            },

Icon3Clicked:
            (e: any): any => {


                if (e != null) {
                    e.stopPropagation();
                    e.preventDefault();
                }
                const name = Joove.Core.getPartialOwnerControlElementId($(e.currentTarget)) || '';
                window._commander.hideModal(name + 'Modal');
            },

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
                        $scope.actions.CloseModal(null, null, e);
}, { groups: [Joove.Validation.Constants.ALL_GROUPS], withDataValidationsCheck: false, withRequiredFieldsCheck: false });
                }, 0);
            },

ClearButtonClicked:
            (e: any): any => {


                if (e != null) {
                    e.stopPropagation();
                    e.preventDefault();
                }
                const name = Joove.Core.getPartialOwnerControlElementId($(e.currentTarget)) || '';
                window._commander.hideModal(name + 'Modal');
            },

Icon4Clicked:
            (e, DataItem, _parents) => {


                if (e != null) {
                    e.stopPropagation();
                    e.preventDefault();
                }

                if (this.timeoutDelayLockIcon4Clicked != null) {
                    $timeout.cancel(this.timeoutDelayLockIcon4Clicked);
                }

                this.timeoutDelayLockIcon4Clicked = $timeout(() => {
                    Joove.Common.setControlKeyPressed(e, 0); Joove.Common.setLastClickedElement(e);

                    Joove.Validation.Manager.validateFormAndExecute(() => {
                        $scope.actions.CloseMaterialModal(false, null, null, e);
}, { groups: [Joove.Validation.Constants.ALL_GROUPS], withDataValidationsCheck: false, withRequiredFieldsCheck: false });
                }, 0);
            },

Button3Clicked:
            (e, DataItem, _parents) => {


                if (e != null) {
                    e.stopPropagation();
                    e.preventDefault();
                }

                if (this.timeoutDelayLockButton3Clicked != null) {
                    $timeout.cancel(this.timeoutDelayLockButton3Clicked);
                }

                this.timeoutDelayLockButton3Clicked = $timeout(() => {
                    Joove.Common.setControlKeyPressed(e, 0); Joove.Common.setLastClickedElement(e);

                    Joove.Validation.Manager.validateFormAndExecute(() => {
                        $scope.actions.CloseMaterialModal(true, null, null, e);
}, { groups: [Joove.Validation.Constants.ALL_GROUPS], withDataValidationsCheck: false, withRequiredFieldsCheck: false });
                }, 0);
            },

        };

// Rules
        window._ruleEngine.addDataValidations(ManageResourcesDataValidations);
        window._ruleEngine.addConditionalFormattings(ManageResourcesConditionalFormattings);
        window._ruleEngine.addCalculatedExpressions(ManageResourcesCalculatedExpressions);

        window._commander.executeCommands(window.viewDTO.ClientCommands);
        window.viewDTO.ClientCommands = [];
        new DigicircMatchmaking.Controllers.ResourceFormController({
'PartialView': new PartialViewPartialModelStructure($scope, 'PartialView'),

        }).IncludePartialMethods($scope, ["PartialView"], $timeout);

        Joove.Common.setNumberLocalizationSettings();
        Joove.DeveloperApi.init($scope as any, window.scope_MasterPage as any);
        window.$formExtend && window.$formExtend();
        window.$onFormLoaded && window.$onFormLoaded();
    }
}
angular.module("Application").controller("ManageResourcesController", ["$scope", "$timeout", ManageResourcesController] as Array<string>);
}