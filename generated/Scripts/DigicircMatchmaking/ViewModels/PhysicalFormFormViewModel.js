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
        var PhysicalFormForm;
        (function (PhysicalFormForm) {
            var PhysicalFormFormViewModel = /** @class */ (function (_super) {
                __extends(PhysicalFormFormViewModel, _super);
                function PhysicalFormFormViewModel() {
                    return _super.call(this) || this;
                }
                PhysicalFormFormViewModel._lightCast = function (instance) {
                    if (instance == null)
                        return;
                    if (instance.PhysicalForm != null)
                        instance.PhysicalForm = PhysicalForm_PhysicalFormViewModel._lightCast(instance.PhysicalForm);
                    return instance;
                };
                PhysicalFormFormViewModel._initializeFrom = function (original, ignoreReadOnlyProperties, context) {
                    if (ignoreReadOnlyProperties === void 0) { ignoreReadOnlyProperties = false; }
                    if (context === void 0) { context = new Joove.DTOHelper(); }
                    if (original == null)
                        return null;
                    // if (context.Has(original)) {
                    //    return context.Get(original);
                    // }
                    var result = new PhysicalFormFormViewModel();
                    if (context != null && context.fillDb == true) {
                        context.addToDb(original);
                    }
                    result._hydratePhysicalFormFormViewModel(original, ignoreReadOnlyProperties, context);
                    // context.Add(original, result);
                    return result;
                };
                PhysicalFormFormViewModel.prototype._hydratePhysicalFormFormViewModel = function (original, ignoreReadOnlyProperties, context) {
                    if (context === void 0) { context = new Joove.DTOHelper(); }
                    if (original == null)
                        return;
                    this._hydrateSymbiosisMasterPageViewModel(original, ignoreReadOnlyProperties, context);
                    if (original._key !== undefined)
                        this._key = original._key;
                    if (original._clientKey !== undefined)
                        this._clientKey = original._clientKey;
                    if (original._originalTypeClassName !== undefined)
                        this._originalTypeClassName = original._originalTypeClassName;
                    if (original._typeHash !== undefined)
                        this._typeHash = original._typeHash;
                    if (original.PhysicalForm !== undefined)
                        this.PhysicalForm = PhysicalForm_PhysicalFormViewModel._initializeFrom(original.PhysicalForm, ignoreReadOnlyProperties, context);
                    this._reduceData = function (ignoreReadOnlyProperties) {
                        var reduced = PhysicalFormFormViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                        PhysicalFormFormViewModel._deleteDropDownInitialValues(reduced);
                        return reduced;
                    };
                }; /* end _initializeFrom() */
                PhysicalFormFormViewModel.prototype._reduceData = function (ignoreReadOnlyProperties) {
                    var reduced = PhysicalFormFormViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                    PhysicalFormFormViewModel._deleteDropDownInitialValues(reduced);
                    return reduced;
                };
                PhysicalFormFormViewModel._deleteDropDownInitialValues = function (reduced) {
                    if (reduced == null)
                        return;
                    DigicircMatchmaking.ViewModels.SymbiosisMasterPage.SymbiosisMasterPageViewModel._deleteDropDownInitialValues(reduced);
                };
                return PhysicalFormFormViewModel;
            }(DigicircMatchmaking.ViewModels.SymbiosisMasterPage.SymbiosisMasterPageViewModel));
            PhysicalFormForm.PhysicalFormFormViewModel = PhysicalFormFormViewModel;
            var PhysicalForm_PhysicalFormViewModel = /** @class */ (function (_super) {
                __extends(PhysicalForm_PhysicalFormViewModel, _super);
                function PhysicalForm_PhysicalFormViewModel() {
                    return _super.call(this) || this;
                }
                PhysicalForm_PhysicalFormViewModel._lightCast = function (instance) {
                    if (instance == null)
                        return;
                    return instance;
                };
                PhysicalForm_PhysicalFormViewModel._initializeFrom = function (original, ignoreReadOnlyProperties, context) {
                    if (ignoreReadOnlyProperties === void 0) { ignoreReadOnlyProperties = false; }
                    if (context === void 0) { context = new Joove.DTOHelper(); }
                    if (original == null)
                        return null;
                    // if (context.Has(original)) {
                    //    return context.Get(original);
                    // }
                    var result = new PhysicalForm_PhysicalFormViewModel();
                    if (context != null && context.fillDb == true) {
                        context.addToDb(original);
                    }
                    result._hydratePhysicalForm_PhysicalFormViewModel(original, ignoreReadOnlyProperties, context);
                    // context.Add(original, result);
                    return result;
                };
                PhysicalForm_PhysicalFormViewModel.prototype._hydratePhysicalForm_PhysicalFormViewModel = function (original, ignoreReadOnlyProperties, context) {
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
                    if (original.Id !== undefined)
                        this.Id = original.Id;
                    if (original.Code !== undefined)
                        this.Code = original.Code;
                    if (original.Value !== undefined)
                        this.Value = original.Value;
                    this._reduceData = function (ignoreReadOnlyProperties) {
                        var reduced = PhysicalForm_PhysicalFormViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                        return reduced;
                    };
                }; /* end _initializeFrom() */
                PhysicalForm_PhysicalFormViewModel.prototype._reduceData = function (ignoreReadOnlyProperties) {
                    var reduced = PhysicalForm_PhysicalFormViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                    return reduced;
                };
                return PhysicalForm_PhysicalFormViewModel;
            }(BaseClass.ViewModel));
            PhysicalFormForm.PhysicalForm_PhysicalFormViewModel = PhysicalForm_PhysicalFormViewModel;
        })(PhysicalFormForm = ViewModels.PhysicalFormForm || (ViewModels.PhysicalFormForm = {}));
    })(ViewModels = DigicircMatchmaking.ViewModels || (DigicircMatchmaking.ViewModels = {}));
})(DigicircMatchmaking || (DigicircMatchmaking = {}));
