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
interface Window { scope_GraphQueryDebug: DigicircMatchmaking.Controllers.IGraphQueryDebugScope; }
namespace DigicircMatchmaking.Controllers {
const GraphQueryDebugConditionalFormattings = [
new Joove.JbRule({
name: "IsExtendedSearchEnableConditional",
type: Joove.RuleTypes.ConditionalFormatting,
isDataSetRule: false,
evaluatedAtServer: false,
contextControlName: null,


condition: async (_parents) => {
        return Joove.Common.nullSafe<any>(() => window["scope_GraphQueryDebug"].model.IsExtended, false);

    },
evaluationTimes: [Joove.EvaluationTimes.OnLoad,Joove.EvaluationTimes.OnSubmit,Joove.EvaluationTimes.OnChange],
isRelatedToDataValidation: false
}),
new Joove.JbRule({
name: "IsExtendedSearchDisabledConditional",
type: Joove.RuleTypes.ConditionalFormatting,
isDataSetRule: false,
evaluatedAtServer: false,
contextControlName: null,


condition: async (_parents) => {
        return !(Joove.Common.nullSafe<any>(() => window["scope_GraphQueryDebug"].model.IsExtended, false));

    },
evaluationTimes: [Joove.EvaluationTimes.OnLoad,Joove.EvaluationTimes.OnSubmit,Joove.EvaluationTimes.OnChange],
isRelatedToDataValidation: false
}),
        ];
const GraphQueryDebugDataValidations = [
                                       ];
const GraphQueryDebugCalculatedExpressions = [
        ];

// Datasets Column Info
export var CountryDataSet_ColumnInfo = [new Joove.ColumnInfo("Name", "string", null, false)];
window["CountryDataSet_ColumnInfo"] = CountryDataSet_ColumnInfo;
var ListNodes_ColumnInfo = [
new Joove.Widgets.DataListColumnInfo({
dataType: "string",
dataTypeIsEnum: false,
name: "Name",
caption: window._resourcesManager.getDataListColumnCaption("ListNodes", "Name", false),
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
    length: 100,
formatting: null,
width: null,
css: "",
isEncrypted: false,
showFullImage: false
}),

new Joove.Widgets.DataListColumnInfo({
dataType: "string",
dataTypeIsEnum: false,
name: "LabelType",
caption: window._resourcesManager.getDataListColumnCaption("ListNodes", "LabelType", false),
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
    length: 100,
formatting: null,
width: null,
css: "",
isEncrypted: false,
showFullImage: false
}),

new Joove.Widgets.DataListColumnInfo({
dataType: "string",
dataTypeIsEnum: false,
name: "Label",
caption: window._resourcesManager.getDataListColumnCaption("ListNodes", "Label", false),
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
    length: 100,
formatting: null,
width: null,
css: "",
isEncrypted: false,
showFullImage: false
}),

new Joove.Widgets.DataListColumnInfo({
dataType: "bool",
dataTypeIsEnum: false,
name: "CC",
caption: window._resourcesManager.getDataListColumnCaption("ListNodes", "CC", false),
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
length: null,
formatting: null,
width: null,
css: "",
isEncrypted: false,
showFullImage: false
}),

new Joove.Widgets.DataListColumnInfo({
dataType: "bool",
dataTypeIsEnum: false,
name: "IA",
caption: window._resourcesManager.getDataListColumnCaption("ListNodes", "IA", false),
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
length: null,
formatting: null,
width: null,
css: "",
isEncrypted: false,
showFullImage: false
}),

new Joove.Widgets.DataListColumnInfo({
dataType: "bool",
dataTypeIsEnum: false,
name: "Attr",
caption: window._resourcesManager.getDataListColumnCaption("ListNodes", "Attr", false),
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
length: null,
formatting: null,
width: null,
css: "",
isEncrypted: false,
showFullImage: false
}),

new Joove.Widgets.DataListColumnInfo({
dataType: "int",
dataTypeIsEnum: false,
name: "Id",
caption: window._resourcesManager.getDataListColumnCaption("ListNodes", "Id", false),
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
length: null,
formatting: null,
width: null,
css: "",
isEncrypted: false,
showFullImage: false
}),

new Joove.Widgets.DataListColumnInfo({
dataType: "int",
dataTypeIsEnum: false,
name: "Graphid",
caption: window._resourcesManager.getDataListColumnCaption("ListNodes", "Graphid", false),
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
length: null,
formatting: null,
width: null,
css: "",
isEncrypted: false,
showFullImage: false
}),

new Joove.Widgets.DataListColumnInfo({
dataType: "int",
dataTypeIsEnum: false,
name: "SL",
caption: window._resourcesManager.getDataListColumnCaption("ListNodes", "SL", false),
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
length: null,
formatting: null,
width: null,
css: "",
isEncrypted: false,
showFullImage: false
}),

new Joove.Widgets.DataListColumnInfo({
dataType: "int",
dataTypeIsEnum: false,
name: "AL",
caption: window._resourcesManager.getDataListColumnCaption("ListNodes", "AL", false),
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
length: null,
formatting: null,
width: null,
css: "",
isEncrypted: false,
showFullImage: false
}),

new Joove.Widgets.DataListColumnInfo({
dataType: "float",
dataTypeIsEnum: false,
name: "CL",
caption: window._resourcesManager.getDataListColumnCaption("ListNodes", "CL", false),
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
length: null,
formatting: null,
width: null,
css: "",
isEncrypted: false,
showFullImage: false
}),

new Joove.Widgets.DataListColumnInfo({
dataType: "float",
dataTypeIsEnum: false,
name: "RL",
caption: window._resourcesManager.getDataListColumnCaption("ListNodes", "RL", false),
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
length: null,
formatting: null,
width: null,
css: "",
isEncrypted: false,
showFullImage: false
}),

new Joove.Widgets.DataListColumnInfo({
dataType: "float",
dataTypeIsEnum: false,
name: "AC",
caption: window._resourcesManager.getDataListColumnCaption("ListNodes", "AC", false),
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
length: null,
formatting: null,
width: null,
css: "",
isEncrypted: false,
showFullImage: false
})] as any;
window["ListNodes_ColumnInfo"] = ListNodes_ColumnInfo;
var ListLinks_ColumnInfo = [
new Joove.Widgets.DataListColumnInfo({
dataType: "int",
dataTypeIsEnum: false,
name: "Source",
caption: window._resourcesManager.getDataListColumnCaption("ListLinks", "Source", false),
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
length: null,
formatting: null,
width: null,
css: "",
isEncrypted: false,
showFullImage: false
}),

new Joove.Widgets.DataListColumnInfo({
dataType: "int",
dataTypeIsEnum: false,
name: "Target",
caption: window._resourcesManager.getDataListColumnCaption("ListLinks", "Target", false),
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
length: null,
formatting: null,
width: null,
css: "",
isEncrypted: false,
showFullImage: false
}),

new Joove.Widgets.DataListColumnInfo({
dataType: "int",
dataTypeIsEnum: false,
name: "Sid",
caption: window._resourcesManager.getDataListColumnCaption("ListLinks", "Sid", false),
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
length: null,
formatting: null,
width: null,
css: "",
isEncrypted: false,
showFullImage: false
}),

new Joove.Widgets.DataListColumnInfo({
dataType: "int",
dataTypeIsEnum: false,
name: "Tid",
caption: window._resourcesManager.getDataListColumnCaption("ListLinks", "Tid", false),
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
length: null,
formatting: null,
width: null,
css: "",
isEncrypted: false,
showFullImage: false
}),

new Joove.Widgets.DataListColumnInfo({
dataType: "bool",
dataTypeIsEnum: false,
name: "IA",
caption: window._resourcesManager.getDataListColumnCaption("ListLinks", "IA", false),
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
length: null,
formatting: null,
width: null,
css: "",
isEncrypted: false,
showFullImage: false
}),

new Joove.Widgets.DataListColumnInfo({
dataType: "int",
dataTypeIsEnum: false,
name: "AL",
caption: window._resourcesManager.getDataListColumnCaption("ListLinks", "AL", false),
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
length: null,
formatting: null,
width: null,
css: "",
isEncrypted: false,
showFullImage: false
}),

new Joove.Widgets.DataListColumnInfo({
dataType: "bool",
dataTypeIsEnum: false,
name: "Attr",
caption: window._resourcesManager.getDataListColumnCaption("ListLinks", "Attr", false),
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
length: null,
formatting: null,
width: null,
css: "",
isEncrypted: false,
showFullImage: false
}),

new Joove.Widgets.DataListColumnInfo({
dataType: "float",
dataTypeIsEnum: false,
name: "Weight",
caption: window._resourcesManager.getDataListColumnCaption("ListLinks", "Weight", false),
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
length: null,
formatting: null,
width: null,
css: "",
isEncrypted: false,
showFullImage: false
}),

new Joove.Widgets.DataListColumnInfo({
dataType: "float",
dataTypeIsEnum: false,
name: "CL",
caption: window._resourcesManager.getDataListColumnCaption("ListLinks", "CL", false),
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
length: null,
formatting: null,
width: null,
css: "",
isEncrypted: false,
showFullImage: false
}),

new Joove.Widgets.DataListColumnInfo({
dataType: "float",
dataTypeIsEnum: false,
name: "RL",
caption: window._resourcesManager.getDataListColumnCaption("ListLinks", "RL", false),
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
length: null,
formatting: null,
width: null,
css: "",
isEncrypted: false,
showFullImage: false
}),

new Joove.Widgets.DataListColumnInfo({
dataType: "float",
dataTypeIsEnum: false,
name: "AC",
caption: window._resourcesManager.getDataListColumnCaption("ListLinks", "AC", false),
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
name: "Type",
caption: window._resourcesManager.getDataListColumnCaption("ListLinks", "Type", false),
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
    length: 100,
formatting: null,
width: null,
css: "",
isEncrypted: false,
showFullImage: false
}),

new Joove.Widgets.DataListColumnInfo({
dataType: "string",
dataTypeIsEnum: false,
name: "TypeRel",
caption: window._resourcesManager.getDataListColumnCaption("ListLinks", "TypeRel", false),
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
    length: 100,
formatting: null,
width: null,
css: "",
isEncrypted: false,
showFullImage: false
})] as any;
window["ListLinks_ColumnInfo"] = ListLinks_ColumnInfo;

export class GraphQueryDebugGetAllLinksViewModelDataset extends Joove.IViewModelDataset<any> {


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
        return this.model.Info.Result.Links;
    }


}



export class GraphQueryDebugGetAllNodesViewModelDataset extends Joove.IViewModelDataset<any> {


    constructor(model, partialViewControlName: string = null) {
        super(model, partialViewControlName);
        this.limit = 0;
    }

    Filter(inputs: any): (DataItem: any, index: number, items: Array<any>) => boolean {
        var $scope = { model: this.model };

        return (DataItem, index, items) => {
            return CLMS.Framework.Number.GreaterThanOrEqual(() => DataItem.RL, () => 0);


        };
    }

    PackInputs($control: JQuery): any {
        return Joove.DatasourceManager.getDatasetControlInputs($control);
    }

    Sort(items: Joove.ViewModelCollection): Joove.ViewModelCollection {
        return items;
    }

    GetSource(parents: number[]): Joove.ViewModelCollection {
        return this.model.Info.Result.Nodes;
    }


}



// Datasets Projection Shemas
window["TextBox1_ProjectionScema"] = {};




export interface IGraphQueryDebugScope extends Joove.IWebPageScope {
model:
    DigicircMatchmaking.ViewModels.GraphQueryDebug.GraphQueryDebugViewModel;
_partialModelStructure:
    any;
    _validations?: {
summary: Array<Joove.Validation.BindingEntry>,

    },
    _masterValidations?: any;
}

class GraphQueryDebugController {
private timeoutDelayLockInfoSearchButtonClicked:
    any;
private timeoutDelayLockExtendSearchButtonClicked:
    any;


    private controllerActionFinished = (resetDirty: boolean) => {
        //window.scope_GraphQueryDebug.model = window.scope_GraphQueryDebug.dehydrate();
        //window.scope_MasterPage.model = window.scope_GraphQueryDebug.model;
        DigicircMatchmaking.ViewModels.GraphQueryDebug.GraphQueryDebugViewModel._lightCast(window.scope_GraphQueryDebug.model);
        // Joove.Common.applyScope(window.scope_GraphQueryDebug);
        if (resetDirty) {
            window._context.isDirty = false;
        }
        window._ruleEngine.update(Joove.EvaluationTimes.OnChange);
    }

    constructor(private $scope: IGraphQueryDebugScope, $timeout: ng.ITimeoutService) {
        window.scope_GraphQueryDebug = $scope;
        $scope.$onControlChanged = function (event, newValue, dontMakeDirty) {
            Joove.Core.onChange(event.target, newValue, dontMakeDirty)
        }

        $scope.dehydrate = (context = null) => DigicircMatchmaking.ViewModels.GraphQueryDebug.GraphQueryDebugViewModel._initializeFrom($scope.model, context);
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

    init($scope: IGraphQueryDebugScope, $timeout: ng.ITimeoutService) {


        $scope.model = DigicircMatchmaking.ViewModels.GraphQueryDebug.GraphQueryDebugViewModel._initializeFrom(window.viewDTO.Model);

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

GetAllLinks:
            (partialViewControlName: string = null) => {
                return new DigicircMatchmaking.Controllers.GraphQueryDebugGetAllLinksViewModelDataset($scope.model, partialViewControlName);
            },

GetAllNodes:
            (partialViewControlName: string = null) => {
                return new DigicircMatchmaking.Controllers.GraphQueryDebugGetAllNodesViewModelDataset($scope.model, partialViewControlName);
            },
        };
// Controller actions
        $scope.actions = {
Index:
            async (_cb, _modalOptions, _e) => {
                Joove.Common.autocompleteFix();


                Joove.Core.executeRedirectControllerAction("GraphQueryDebug", "Index", "GET", [], {}, _modalOptions);
            },
Search:
            async (_cb, _modalOptions, _e) => {
                Joove.Common.autocompleteFix();


                Joove.Core.executeControllerActionNew({
verb: 'POST', controller: 'GraphQueryDebug', action: 'Search',
queryData: [], postData: {'model': $scope.model},
cb: _cb, modalOptions: _modalOptions, event: _e
                });
            },
SearchExtend:
            async (_cb, _modalOptions, _e) => {
                Joove.Common.autocompleteFix();


                Joove.Core.executeControllerActionNew({
verb: 'POST', controller: 'GraphQueryDebug', action: 'SearchExtend',
queryData: [], postData: {'model': $scope.model},
cb: _cb, modalOptions: _modalOptions, event: _e
                });
            },
        };
// Events
        $scope.eventCallbacks = {
InfoSearchButtonClicked:
            (e, DataItem, _parents) => {


                if (e != null) {
                    e.stopPropagation();
                    e.preventDefault();
                }

                if (this.timeoutDelayLockInfoSearchButtonClicked != null) {
                    $timeout.cancel(this.timeoutDelayLockInfoSearchButtonClicked);
                }

                this.timeoutDelayLockInfoSearchButtonClicked = $timeout(() => {
                    Joove.Common.setControlKeyPressed(e, 0); Joove.Common.setLastClickedElement(e);

                    Joove.Validation.Manager.validateFormAndExecute(() => {
                        $scope.actions.Search(null, null, e);
}, { groups: [Joove.Validation.Constants.ALL_GROUPS], withDataValidationsCheck: false, withRequiredFieldsCheck: false });
                }, 0);
            },

ExtendSearchButtonClicked:
            (e, DataItem, _parents) => {


                if (e != null) {
                    e.stopPropagation();
                    e.preventDefault();
                }

                if (this.timeoutDelayLockExtendSearchButtonClicked != null) {
                    $timeout.cancel(this.timeoutDelayLockExtendSearchButtonClicked);
                }

                this.timeoutDelayLockExtendSearchButtonClicked = $timeout(() => {
                    Joove.Common.setControlKeyPressed(e, 0); Joove.Common.setLastClickedElement(e);

                    Joove.Validation.Manager.validateFormAndExecute(() => {
                        $scope.actions.SearchExtend(null, null, e);
}, { groups: [Joove.Validation.Constants.ALL_GROUPS], withDataValidationsCheck: false, withRequiredFieldsCheck: false });
                }, 0);
            },

        };

// Rules
        window._ruleEngine.addDataValidations(GraphQueryDebugDataValidations);
        window._ruleEngine.addConditionalFormattings(GraphQueryDebugConditionalFormattings);
        window._ruleEngine.addCalculatedExpressions(GraphQueryDebugCalculatedExpressions);

        window._commander.executeCommands(window.viewDTO.ClientCommands);
        window.viewDTO.ClientCommands = [];

        Joove.Common.setNumberLocalizationSettings();
        Joove.DeveloperApi.init($scope as any, window.scope_MasterPage as any);
        window.$formExtend && window.$formExtend();
        window.$onFormLoaded && window.$onFormLoaded();
    }
}
angular.module("Application").controller("GraphQueryDebugController", ["$scope", "$timeout", GraphQueryDebugController] as Array<string>);
}
