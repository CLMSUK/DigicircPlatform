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
// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
var DigicircMatchmaking;
(function (DigicircMatchmaking) {
    var ViewModels;
    (function (ViewModels) {
        var GraphCreateDebug;
        (function (GraphCreateDebug) {
            var GraphCreateDebugViewModel = /** @class */ (function (_super) {
                __extends(GraphCreateDebugViewModel, _super);
                function GraphCreateDebugViewModel() {
                    return _super.call(this) || this;
                }
                GraphCreateDebugViewModel._lightCast = function (instance) {
                    if (instance == null)
                        return;
                    if (instance.UpdateRequest != null)
                        instance.UpdateRequest = UpdateRequest_GraphUpdateElementViewModel._lightCast(instance.UpdateRequest);
                    if (instance.Result != null)
                        instance.Result = Result_UpdateResponseViewModel._lightCast(instance.Result);
                    return instance;
                };
                GraphCreateDebugViewModel._initializeFrom = function (original, ignoreReadOnlyProperties, context) {
                    if (ignoreReadOnlyProperties === void 0) { ignoreReadOnlyProperties = false; }
                    if (context === void 0) { context = new Joove.DTOHelper(); }
                    if (original == null)
                        return null;
                    // if (context.Has(original)) {
                    //    return context.Get(original);
                    // }
                    var result = new GraphCreateDebugViewModel();
                    if (context != null && context.fillDb == true) {
                        context.addToDb(original);
                    }
                    result._hydrateGraphCreateDebugViewModel(original, ignoreReadOnlyProperties, context);
                    // context.Add(original, result);
                    return result;
                };
                GraphCreateDebugViewModel.prototype._hydrateGraphCreateDebugViewModel = function (original, ignoreReadOnlyProperties, context) {
                    if (context === void 0) { context = new Joove.DTOHelper(); }
                    if (original == null)
                        return;
                    this._hydrateMasterPageViewModel(original, ignoreReadOnlyProperties, context);
                    if (original._key !== undefined)
                        this._key = original._key;
                    if (original._clientKey !== undefined)
                        this._clientKey = original._clientKey;
                    if (original._originalTypeClassName !== undefined)
                        this._originalTypeClassName = original._originalTypeClassName;
                    if (original._typeHash !== undefined)
                        this._typeHash = original._typeHash;
                    if (original.UpdateRequest !== undefined)
                        this.UpdateRequest = UpdateRequest_GraphUpdateElementViewModel._initializeFrom(original.UpdateRequest, ignoreReadOnlyProperties, context);
                    if (original.Result !== undefined)
                        this.Result = Result_UpdateResponseViewModel._initializeFrom(original.Result, ignoreReadOnlyProperties, context);
                    this._reduceData = function (ignoreReadOnlyProperties) {
                        var reduced = GraphCreateDebugViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                        GraphCreateDebugViewModel._deleteDropDownInitialValues(reduced);
                        return reduced;
                    };
                }; /* end _initializeFrom() */
                GraphCreateDebugViewModel.prototype._reduceData = function (ignoreReadOnlyProperties) {
                    var reduced = GraphCreateDebugViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                    GraphCreateDebugViewModel._deleteDropDownInitialValues(reduced);
                    return reduced;
                };
                GraphCreateDebugViewModel._deleteDropDownInitialValues = function (reduced) {
                    if (reduced == null)
                        return;
                    DigicircMatchmaking.ViewModels.MasterPage.MasterPageViewModel._deleteDropDownInitialValues(reduced);
                };
                return GraphCreateDebugViewModel;
            }(DigicircMatchmaking.ViewModels.MasterPage.MasterPageViewModel));
            GraphCreateDebug.GraphCreateDebugViewModel = GraphCreateDebugViewModel;
            var UpdateRequest_GraphUpdateElementViewModel = /** @class */ (function (_super) {
                __extends(UpdateRequest_GraphUpdateElementViewModel, _super);
                function UpdateRequest_GraphUpdateElementViewModel() {
                    return _super.call(this) || this;
                }
                UpdateRequest_GraphUpdateElementViewModel._lightCast = function (instance) {
                    if (instance == null)
                        return;
                    return instance;
                };
                UpdateRequest_GraphUpdateElementViewModel._initializeFrom = function (original, ignoreReadOnlyProperties, context) {
                    if (ignoreReadOnlyProperties === void 0) { ignoreReadOnlyProperties = false; }
                    if (context === void 0) { context = new Joove.DTOHelper(); }
                    if (original == null)
                        return null;
                    // if (context.Has(original)) {
                    //    return context.Get(original);
                    // }
                    var result = new UpdateRequest_GraphUpdateElementViewModel();
                    if (context != null && context.fillDb == true) {
                        context.addToDb(original);
                    }
                    result._hydrateUpdateRequest_GraphUpdateElementViewModel(original, ignoreReadOnlyProperties, context);
                    // context.Add(original, result);
                    return result;
                };
                UpdateRequest_GraphUpdateElementViewModel.prototype._hydrateUpdateRequest_GraphUpdateElementViewModel = function (original, ignoreReadOnlyProperties, context) {
                    if (context === void 0) { context = new Joove.DTOHelper(); }
                    if (original == null)
                        return;
                    if (original._key !== undefined)
                        this._key = original._key;
                    if (original._clientKey !== undefined)
                        this._clientKey = original._clientKey;
                    if (original._originalTypeClassName !== undefined)
                        this._originalTypeClassName = original._originalTypeClassName;
                    if (original._typeHash !== undefined)
                        this._typeHash = original._typeHash;
                    if (original.RelationType !== undefined)
                        this.RelationType = original.RelationType;
                    if (original.SourceNodeName !== undefined)
                        this.SourceNodeName = original.SourceNodeName;
                    if (original.SourceNodeType !== undefined)
                        this.SourceNodeType = original.SourceNodeType;
                    if (original.DestinationNodeName !== undefined)
                        this.DestinationNodeName = original.DestinationNodeName;
                    if (original.DestinationNodeType !== undefined)
                        this.DestinationNodeType = original.DestinationNodeType;
                    this._reduceData = function (ignoreReadOnlyProperties) {
                        var reduced = UpdateRequest_GraphUpdateElementViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                        return reduced;
                    };
                }; /* end _initializeFrom() */
                UpdateRequest_GraphUpdateElementViewModel.prototype._reduceData = function (ignoreReadOnlyProperties) {
                    var reduced = UpdateRequest_GraphUpdateElementViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                    return reduced;
                };
                return UpdateRequest_GraphUpdateElementViewModel;
            }(BaseClass.ViewModel));
            GraphCreateDebug.UpdateRequest_GraphUpdateElementViewModel = UpdateRequest_GraphUpdateElementViewModel;
            var Result_UpdateResponseViewModel = /** @class */ (function (_super) {
                __extends(Result_UpdateResponseViewModel, _super);
                function Result_UpdateResponseViewModel() {
                    return _super.call(this) || this;
                }
                Result_UpdateResponseViewModel._lightCast = function (instance) {
                    if (instance == null)
                        return;
                    return instance;
                };
                Result_UpdateResponseViewModel._initializeFrom = function (original, ignoreReadOnlyProperties, context) {
                    if (ignoreReadOnlyProperties === void 0) { ignoreReadOnlyProperties = false; }
                    if (context === void 0) { context = new Joove.DTOHelper(); }
                    if (original == null)
                        return null;
                    // if (context.Has(original)) {
                    //    return context.Get(original);
                    // }
                    var result = new Result_UpdateResponseViewModel();
                    if (context != null && context.fillDb == true) {
                        context.addToDb(original);
                    }
                    result._hydrateResult_UpdateResponseViewModel(original, ignoreReadOnlyProperties, context);
                    // context.Add(original, result);
                    return result;
                };
                Result_UpdateResponseViewModel.prototype._hydrateResult_UpdateResponseViewModel = function (original, ignoreReadOnlyProperties, context) {
                    if (context === void 0) { context = new Joove.DTOHelper(); }
                    if (original == null)
                        return;
                    if (original._key !== undefined)
                        this._key = original._key;
                    if (original._clientKey !== undefined)
                        this._clientKey = original._clientKey;
                    if (original._originalTypeClassName !== undefined)
                        this._originalTypeClassName = original._originalTypeClassName;
                    if (original._typeHash !== undefined)
                        this._typeHash = original._typeHash;
                    if (original.Type !== undefined)
                        this.Type = original.Type;
                    if (original.Desc !== undefined)
                        this.Desc = original.Desc;
                    this._reduceData = function (ignoreReadOnlyProperties) {
                        var reduced = Result_UpdateResponseViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                        return reduced;
                    };
                }; /* end _initializeFrom() */
                Result_UpdateResponseViewModel.prototype._reduceData = function (ignoreReadOnlyProperties) {
                    var reduced = Result_UpdateResponseViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                    return reduced;
                };
                return Result_UpdateResponseViewModel;
            }(BaseClass.ViewModel));
            GraphCreateDebug.Result_UpdateResponseViewModel = Result_UpdateResponseViewModel;
        })(GraphCreateDebug = ViewModels.GraphCreateDebug || (ViewModels.GraphCreateDebug = {}));
    })(ViewModels = DigicircMatchmaking.ViewModels || (DigicircMatchmaking.ViewModels = {}));
})(DigicircMatchmaking || (DigicircMatchmaking = {}));
