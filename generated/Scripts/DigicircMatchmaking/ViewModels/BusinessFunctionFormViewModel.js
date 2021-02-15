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
        var BusinessFunctionForm;
        (function (BusinessFunctionForm) {
            var BusinessFunctionFormViewModel = /** @class */ (function (_super) {
                __extends(BusinessFunctionFormViewModel, _super);
                function BusinessFunctionFormViewModel() {
                    return _super.call(this) || this;
                }
                BusinessFunctionFormViewModel._lightCast = function (instance) {
                    if (instance == null)
                        return;
                    if (instance.BusinessFunction != null)
                        instance.BusinessFunction = BusinessFunction_BusinessFunctionViewModel._lightCast(instance.BusinessFunction);
                    return instance;
                };
                BusinessFunctionFormViewModel._initializeFrom = function (original, ignoreReadOnlyProperties, context) {
                    if (ignoreReadOnlyProperties === void 0) { ignoreReadOnlyProperties = false; }
                    if (context === void 0) { context = new Joove.DTOHelper(); }
                    if (original == null)
                        return null;
                    // if (context.Has(original)) {
                    //    return context.Get(original);
                    // }
                    var result = new BusinessFunctionFormViewModel();
                    if (context != null && context.fillDb == true) {
                        context.addToDb(original);
                    }
                    result._hydrateBusinessFunctionFormViewModel(original, ignoreReadOnlyProperties, context);
                    // context.Add(original, result);
                    return result;
                };
                BusinessFunctionFormViewModel.prototype._hydrateBusinessFunctionFormViewModel = function (original, ignoreReadOnlyProperties, context) {
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
                    if (original.BusinessFunction !== undefined)
                        this.BusinessFunction = BusinessFunction_BusinessFunctionViewModel._initializeFrom(original.BusinessFunction, ignoreReadOnlyProperties, context);
                    this._reduceData = function (ignoreReadOnlyProperties) {
                        var reduced = BusinessFunctionFormViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                        BusinessFunctionFormViewModel._deleteDropDownInitialValues(reduced);
                        return reduced;
                    };
                }; /* end _initializeFrom() */
                BusinessFunctionFormViewModel.prototype._reduceData = function (ignoreReadOnlyProperties) {
                    var reduced = BusinessFunctionFormViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                    BusinessFunctionFormViewModel._deleteDropDownInitialValues(reduced);
                    return reduced;
                };
                BusinessFunctionFormViewModel._deleteDropDownInitialValues = function (reduced) {
                    if (reduced == null)
                        return;
                    DigicircMatchmaking.ViewModels.MasterPage.MasterPageViewModel._deleteDropDownInitialValues(reduced);
                };
                return BusinessFunctionFormViewModel;
            }(DigicircMatchmaking.ViewModels.MasterPage.MasterPageViewModel));
            BusinessFunctionForm.BusinessFunctionFormViewModel = BusinessFunctionFormViewModel;
            var BusinessFunction_BusinessFunctionViewModel = /** @class */ (function (_super) {
                __extends(BusinessFunction_BusinessFunctionViewModel, _super);
                function BusinessFunction_BusinessFunctionViewModel() {
                    return _super.call(this) || this;
                }
                BusinessFunction_BusinessFunctionViewModel._lightCast = function (instance) {
                    if (instance == null)
                        return;
                    return instance;
                };
                BusinessFunction_BusinessFunctionViewModel._initializeFrom = function (original, ignoreReadOnlyProperties, context) {
                    if (ignoreReadOnlyProperties === void 0) { ignoreReadOnlyProperties = false; }
                    if (context === void 0) { context = new Joove.DTOHelper(); }
                    if (original == null)
                        return null;
                    // if (context.Has(original)) {
                    //    return context.Get(original);
                    // }
                    var result = new BusinessFunction_BusinessFunctionViewModel();
                    if (context != null && context.fillDb == true) {
                        context.addToDb(original);
                    }
                    result._hydrateBusinessFunction_BusinessFunctionViewModel(original, ignoreReadOnlyProperties, context);
                    // context.Add(original, result);
                    return result;
                };
                BusinessFunction_BusinessFunctionViewModel.prototype._hydrateBusinessFunction_BusinessFunctionViewModel = function (original, ignoreReadOnlyProperties, context) {
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
                    if (original._versionTimestamp !== undefined)
                        this._versionTimestamp = original._versionTimestamp;
                    if (original.Id !== undefined)
                        this.Id = original.Id;
                    if (original.Value !== undefined)
                        this.Value = original.Value;
                    this._reduceData = function (ignoreReadOnlyProperties) {
                        var reduced = BusinessFunction_BusinessFunctionViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                        return reduced;
                    };
                }; /* end _initializeFrom() */
                BusinessFunction_BusinessFunctionViewModel.prototype._reduceData = function (ignoreReadOnlyProperties) {
                    var reduced = BusinessFunction_BusinessFunctionViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                    return reduced;
                };
                return BusinessFunction_BusinessFunctionViewModel;
            }(BaseClass.ViewModel));
            BusinessFunctionForm.BusinessFunction_BusinessFunctionViewModel = BusinessFunction_BusinessFunctionViewModel;
        })(BusinessFunctionForm = ViewModels.BusinessFunctionForm || (ViewModels.BusinessFunctionForm = {}));
    })(ViewModels = DigicircMatchmaking.ViewModels || (DigicircMatchmaking.ViewModels = {}));
})(DigicircMatchmaking || (DigicircMatchmaking = {}));