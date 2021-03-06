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
        var ThematicExpertiseForm;
        (function (ThematicExpertiseForm) {
            var ThematicExpertiseFormViewModel = /** @class */ (function (_super) {
                __extends(ThematicExpertiseFormViewModel, _super);
                function ThematicExpertiseFormViewModel() {
                    return _super.call(this) || this;
                }
                ThematicExpertiseFormViewModel._lightCast = function (instance) {
                    if (instance == null)
                        return;
                    if (instance.ThematicExpertise != null)
                        instance.ThematicExpertise = ThematicExpertise_ThematicExpertiseViewModel._lightCast(instance.ThematicExpertise);
                    return instance;
                };
                ThematicExpertiseFormViewModel._initializeFrom = function (original, ignoreReadOnlyProperties, context) {
                    if (ignoreReadOnlyProperties === void 0) { ignoreReadOnlyProperties = false; }
                    if (context === void 0) { context = new Joove.DTOHelper(); }
                    if (original == null)
                        return null;
                    // if (context.Has(original)) {
                    //    return context.Get(original);
                    // }
                    var result = new ThematicExpertiseFormViewModel();
                    if (context != null && context.fillDb == true) {
                        context.addToDb(original);
                    }
                    result._hydrateThematicExpertiseFormViewModel(original, ignoreReadOnlyProperties, context);
                    // context.Add(original, result);
                    return result;
                };
                ThematicExpertiseFormViewModel.prototype._hydrateThematicExpertiseFormViewModel = function (original, ignoreReadOnlyProperties, context) {
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
                    if (original.ThematicExpertise !== undefined)
                        this.ThematicExpertise = ThematicExpertise_ThematicExpertiseViewModel._initializeFrom(original.ThematicExpertise, ignoreReadOnlyProperties, context);
                    this._reduceData = function (ignoreReadOnlyProperties) {
                        var reduced = ThematicExpertiseFormViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                        ThematicExpertiseFormViewModel._deleteDropDownInitialValues(reduced);
                        return reduced;
                    };
                }; /* end _initializeFrom() */
                ThematicExpertiseFormViewModel.prototype._reduceData = function (ignoreReadOnlyProperties) {
                    var reduced = ThematicExpertiseFormViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                    ThematicExpertiseFormViewModel._deleteDropDownInitialValues(reduced);
                    return reduced;
                };
                ThematicExpertiseFormViewModel._deleteDropDownInitialValues = function (reduced) {
                    if (reduced == null)
                        return;
                    DigicircMatchmaking.ViewModels.MasterPage.MasterPageViewModel._deleteDropDownInitialValues(reduced);
                };
                return ThematicExpertiseFormViewModel;
            }(DigicircMatchmaking.ViewModels.MasterPage.MasterPageViewModel));
            ThematicExpertiseForm.ThematicExpertiseFormViewModel = ThematicExpertiseFormViewModel;
            var ThematicExpertise_ThematicExpertiseViewModel = /** @class */ (function (_super) {
                __extends(ThematicExpertise_ThematicExpertiseViewModel, _super);
                function ThematicExpertise_ThematicExpertiseViewModel() {
                    return _super.call(this) || this;
                }
                ThematicExpertise_ThematicExpertiseViewModel._lightCast = function (instance) {
                    if (instance == null)
                        return;
                    return instance;
                };
                ThematicExpertise_ThematicExpertiseViewModel._initializeFrom = function (original, ignoreReadOnlyProperties, context) {
                    if (ignoreReadOnlyProperties === void 0) { ignoreReadOnlyProperties = false; }
                    if (context === void 0) { context = new Joove.DTOHelper(); }
                    if (original == null)
                        return null;
                    // if (context.Has(original)) {
                    //    return context.Get(original);
                    // }
                    var result = new ThematicExpertise_ThematicExpertiseViewModel();
                    if (context != null && context.fillDb == true) {
                        context.addToDb(original);
                    }
                    result._hydrateThematicExpertise_ThematicExpertiseViewModel(original, ignoreReadOnlyProperties, context);
                    // context.Add(original, result);
                    return result;
                };
                ThematicExpertise_ThematicExpertiseViewModel.prototype._hydrateThematicExpertise_ThematicExpertiseViewModel = function (original, ignoreReadOnlyProperties, context) {
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
                        var reduced = ThematicExpertise_ThematicExpertiseViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                        return reduced;
                    };
                }; /* end _initializeFrom() */
                ThematicExpertise_ThematicExpertiseViewModel.prototype._reduceData = function (ignoreReadOnlyProperties) {
                    var reduced = ThematicExpertise_ThematicExpertiseViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                    return reduced;
                };
                return ThematicExpertise_ThematicExpertiseViewModel;
            }(BaseClass.ViewModel));
            ThematicExpertiseForm.ThematicExpertise_ThematicExpertiseViewModel = ThematicExpertise_ThematicExpertiseViewModel;
        })(ThematicExpertiseForm = ViewModels.ThematicExpertiseForm || (ViewModels.ThematicExpertiseForm = {}));
    })(ViewModels = DigicircMatchmaking.ViewModels || (DigicircMatchmaking.ViewModels = {}));
})(DigicircMatchmaking || (DigicircMatchmaking = {}));
