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
        var ExpertiseForm;
        (function (ExpertiseForm) {
            var ExpertiseFormViewModel = /** @class */ (function (_super) {
                __extends(ExpertiseFormViewModel, _super);
                function ExpertiseFormViewModel() {
                    return _super.call(this) || this;
                }
                ExpertiseFormViewModel._lightCast = function (instance) {
                    if (instance == null)
                        return;
                    if (instance.Expertise != null)
                        instance.Expertise = Expertise_ExpertiseViewModel._lightCast(instance.Expertise);
                    return instance;
                };
                ExpertiseFormViewModel._initializeFrom = function (original, ignoreReadOnlyProperties, context) {
                    if (ignoreReadOnlyProperties === void 0) { ignoreReadOnlyProperties = false; }
                    if (context === void 0) { context = new Joove.DTOHelper(); }
                    if (original == null)
                        return null;
                    // if (context.Has(original)) {
                    //    return context.Get(original);
                    // }
                    var result = new ExpertiseFormViewModel();
                    if (context != null && context.fillDb == true) {
                        context.addToDb(original);
                    }
                    result._hydrateExpertiseFormViewModel(original, ignoreReadOnlyProperties, context);
                    // context.Add(original, result);
                    return result;
                };
                ExpertiseFormViewModel.prototype._hydrateExpertiseFormViewModel = function (original, ignoreReadOnlyProperties, context) {
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
                    if (original.Expertise !== undefined)
                        this.Expertise = Expertise_ExpertiseViewModel._initializeFrom(original.Expertise, ignoreReadOnlyProperties, context);
                    this._reduceData = function (ignoreReadOnlyProperties) {
                        var reduced = ExpertiseFormViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                        ExpertiseFormViewModel._deleteDropDownInitialValues(reduced);
                        return reduced;
                    };
                }; /* end _initializeFrom() */
                ExpertiseFormViewModel.prototype._reduceData = function (ignoreReadOnlyProperties) {
                    var reduced = ExpertiseFormViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                    ExpertiseFormViewModel._deleteDropDownInitialValues(reduced);
                    return reduced;
                };
                ExpertiseFormViewModel._deleteDropDownInitialValues = function (reduced) {
                    if (reduced == null)
                        return;
                    DigicircMatchmaking.ViewModels.MasterPage.MasterPageViewModel._deleteDropDownInitialValues(reduced);
                };
                return ExpertiseFormViewModel;
            }(DigicircMatchmaking.ViewModels.MasterPage.MasterPageViewModel));
            ExpertiseForm.ExpertiseFormViewModel = ExpertiseFormViewModel;
            var Expertise_ExpertiseViewModel = /** @class */ (function (_super) {
                __extends(Expertise_ExpertiseViewModel, _super);
                function Expertise_ExpertiseViewModel() {
                    return _super.call(this) || this;
                }
                Expertise_ExpertiseViewModel._lightCast = function (instance) {
                    if (instance == null)
                        return;
                    return instance;
                };
                Expertise_ExpertiseViewModel._initializeFrom = function (original, ignoreReadOnlyProperties, context) {
                    if (ignoreReadOnlyProperties === void 0) { ignoreReadOnlyProperties = false; }
                    if (context === void 0) { context = new Joove.DTOHelper(); }
                    if (original == null)
                        return null;
                    // if (context.Has(original)) {
                    //    return context.Get(original);
                    // }
                    var result = new Expertise_ExpertiseViewModel();
                    if (context != null && context.fillDb == true) {
                        context.addToDb(original);
                    }
                    result._hydrateExpertise_ExpertiseViewModel(original, ignoreReadOnlyProperties, context);
                    // context.Add(original, result);
                    return result;
                };
                Expertise_ExpertiseViewModel.prototype._hydrateExpertise_ExpertiseViewModel = function (original, ignoreReadOnlyProperties, context) {
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
                        var reduced = Expertise_ExpertiseViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                        return reduced;
                    };
                }; /* end _initializeFrom() */
                Expertise_ExpertiseViewModel.prototype._reduceData = function (ignoreReadOnlyProperties) {
                    var reduced = Expertise_ExpertiseViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                    return reduced;
                };
                return Expertise_ExpertiseViewModel;
            }(BaseClass.ViewModel));
            ExpertiseForm.Expertise_ExpertiseViewModel = Expertise_ExpertiseViewModel;
        })(ExpertiseForm = ViewModels.ExpertiseForm || (ViewModels.ExpertiseForm = {}));
    })(ViewModels = DigicircMatchmaking.ViewModels || (DigicircMatchmaking.ViewModels = {}));
})(DigicircMatchmaking || (DigicircMatchmaking = {}));
