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
        var BusinessTypeForm;
        (function (BusinessTypeForm) {
            var BusinessTypeFormViewModel = /** @class */ (function (_super) {
                __extends(BusinessTypeFormViewModel, _super);
                function BusinessTypeFormViewModel() {
                    return _super.call(this) || this;
                }
                BusinessTypeFormViewModel._lightCast = function (instance) {
                    if (instance == null)
                        return;
                    if (instance.BusinessType != null)
                        instance.BusinessType = BusinessType_BusinessTypeViewModel._lightCast(instance.BusinessType);
                    return instance;
                };
                BusinessTypeFormViewModel._initializeFrom = function (original, ignoreReadOnlyProperties, context) {
                    if (ignoreReadOnlyProperties === void 0) { ignoreReadOnlyProperties = false; }
                    if (context === void 0) { context = new Joove.DTOHelper(); }
                    if (original == null)
                        return null;
                    // if (context.Has(original)) {
                    //    return context.Get(original);
                    // }
                    var result = new BusinessTypeFormViewModel();
                    if (context != null && context.fillDb == true) {
                        context.addToDb(original);
                    }
                    result._hydrateBusinessTypeFormViewModel(original, ignoreReadOnlyProperties, context);
                    // context.Add(original, result);
                    return result;
                };
                BusinessTypeFormViewModel.prototype._hydrateBusinessTypeFormViewModel = function (original, ignoreReadOnlyProperties, context) {
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
                    if (original.BusinessType !== undefined)
                        this.BusinessType = BusinessType_BusinessTypeViewModel._initializeFrom(original.BusinessType, ignoreReadOnlyProperties, context);
                    this._reduceData = function (ignoreReadOnlyProperties) {
                        var reduced = BusinessTypeFormViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                        BusinessTypeFormViewModel._deleteDropDownInitialValues(reduced);
                        return reduced;
                    };
                }; /* end _initializeFrom() */
                BusinessTypeFormViewModel.prototype._reduceData = function (ignoreReadOnlyProperties) {
                    var reduced = BusinessTypeFormViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                    BusinessTypeFormViewModel._deleteDropDownInitialValues(reduced);
                    return reduced;
                };
                BusinessTypeFormViewModel._deleteDropDownInitialValues = function (reduced) {
                    if (reduced == null)
                        return;
                    DigicircMatchmaking.ViewModels.MasterPage.MasterPageViewModel._deleteDropDownInitialValues(reduced);
                };
                return BusinessTypeFormViewModel;
            }(DigicircMatchmaking.ViewModels.MasterPage.MasterPageViewModel));
            BusinessTypeForm.BusinessTypeFormViewModel = BusinessTypeFormViewModel;
            var BusinessType_BusinessTypeViewModel = /** @class */ (function (_super) {
                __extends(BusinessType_BusinessTypeViewModel, _super);
                function BusinessType_BusinessTypeViewModel() {
                    return _super.call(this) || this;
                }
                BusinessType_BusinessTypeViewModel._lightCast = function (instance) {
                    if (instance == null)
                        return;
                    return instance;
                };
                BusinessType_BusinessTypeViewModel._initializeFrom = function (original, ignoreReadOnlyProperties, context) {
                    if (ignoreReadOnlyProperties === void 0) { ignoreReadOnlyProperties = false; }
                    if (context === void 0) { context = new Joove.DTOHelper(); }
                    if (original == null)
                        return null;
                    // if (context.Has(original)) {
                    //    return context.Get(original);
                    // }
                    var result = new BusinessType_BusinessTypeViewModel();
                    if (context != null && context.fillDb == true) {
                        context.addToDb(original);
                    }
                    result._hydrateBusinessType_BusinessTypeViewModel(original, ignoreReadOnlyProperties, context);
                    // context.Add(original, result);
                    return result;
                };
                BusinessType_BusinessTypeViewModel.prototype._hydrateBusinessType_BusinessTypeViewModel = function (original, ignoreReadOnlyProperties, context) {
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
                        var reduced = BusinessType_BusinessTypeViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                        return reduced;
                    };
                }; /* end _initializeFrom() */
                BusinessType_BusinessTypeViewModel.prototype._reduceData = function (ignoreReadOnlyProperties) {
                    var reduced = BusinessType_BusinessTypeViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                    return reduced;
                };
                return BusinessType_BusinessTypeViewModel;
            }(BaseClass.ViewModel));
            BusinessTypeForm.BusinessType_BusinessTypeViewModel = BusinessType_BusinessTypeViewModel;
        })(BusinessTypeForm = ViewModels.BusinessTypeForm || (ViewModels.BusinessTypeForm = {}));
    })(ViewModels = DigicircMatchmaking.ViewModels || (DigicircMatchmaking.ViewModels = {}));
})(DigicircMatchmaking || (DigicircMatchmaking = {}));