// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
var directiveScopeReadyLimit = 10;
var directiveScopeReadyTimeout = 200;
var DigicircMatchmaking;
(function (DigicircMatchmaking) {
    var Controllers;
    (function (Controllers) {
        var ActorsToAdministratorsConditionalFormattings = function (controlName) {
            return [];
        };
        var ActorsToAdministratorsDataValidations = function (controlName) {
            return [];
        };
        var ActorsToAdministratorsCalculatedExpressions = function (controlName) {
            return [];
        };
        // Datasets Column Info
        var ActorsToAdministrators_PickList_ColumnInfo = [
            new Joove.Widgets.DataListColumnInfo({
                dataType: "string",
                dataTypeIsEnum: false,
                name: "UserName",
                caption: window._resourcesManager.getDataListColumnCaption("PickList", "UserName", true, "ActorsToAdministrators"),
                groupable: true,
                searchable: true,
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
                name: "Name",
                caption: window._resourcesManager.getDataListColumnCaption("PickList", "Name", true, "ActorsToAdministrators"),
                groupable: true,
                searchable: true,
                visible: true,
                orderable: true,
                editable: false,
                style: "",
                classes: "",
                itemType: Joove.Widgets.DataListColumnItemType.TEXTBOX,
                importable: false,
                supportsAggregators: true,
                length: 256,
                formatting: null,
                width: null,
                css: "",
                isEncrypted: false,
                showFullImage: false
            }),
            new Joove.Widgets.DataListColumnInfo({
                dataType: "string",
                dataTypeIsEnum: false,
                name: "Email",
                caption: window._resourcesManager.getDataListColumnCaption("PickList", "Email", true, "ActorsToAdministrators"),
                groupable: true,
                searchable: true,
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
            })
        ];
        Joove.Core.registerPartialColumnInfo('ActorsToAdministrators', 'PickList', ActorsToAdministrators_PickList_ColumnInfo);
        // Datasets Projection Shemas
        window["PickList_ProjectionScema"] = {};
        var ActorsToAdministratorsController = /** @class */ (function () {
            function ActorsToAdministratorsController(normalToPartialModelMappingStructure) {
                this._normalToPartialModelMappingStructure = normalToPartialModelMappingStructure;
            }
            ActorsToAdministratorsController.prototype.IncludePartialMethods = function ($scope, controls, $timeout) {
                window["scope_ActorsToAdministrators"] = $scope;
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
                $scope.eventCallbacks.ActorsToAdministrators = {};
                // Rules
                window._ruleEngine.addDataValidations(Joove.JbRule.createRulesForPartialControls(controls, ActorsToAdministratorsDataValidations));
                window._ruleEngine.addConditionalFormattings(Joove.JbRule.createRulesForPartialControls(controls, ActorsToAdministratorsConditionalFormattings));
                window._ruleEngine.addCalculatedExpressions(Joove.JbRule.createRulesForPartialControls(controls, ActorsToAdministratorsCalculatedExpressions));
            };
            return ActorsToAdministratorsController;
        }());
        Controllers.ActorsToAdministratorsController = ActorsToAdministratorsController;
        ;
        angular.module("Application").controller("ActorsToAdministratorsController", ["$scope", "$timeout", ActorsToAdministratorsController]);
    })(Controllers = DigicircMatchmaking.Controllers || (DigicircMatchmaking.Controllers = {}));
})(DigicircMatchmaking || (DigicircMatchmaking = {}));
