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
        var ApplicationSettingForm;
        (function (ApplicationSettingForm) {
            var ApplicationSettingFormViewModel = /** @class */ (function (_super) {
                __extends(ApplicationSettingFormViewModel, _super);
                function ApplicationSettingFormViewModel() {
                    return _super.call(this) || this;
                }
                ApplicationSettingFormViewModel._lightCast = function (instance) {
                    if (instance == null)
                        return;
                    if (instance.ApplicationSetting != null)
                        instance.ApplicationSetting = ApplicationSetting_ApplicationSettingViewModel._lightCast(instance.ApplicationSetting);
                    return instance;
                };
                ApplicationSettingFormViewModel._initializeFrom = function (original, ignoreReadOnlyProperties, context) {
                    if (ignoreReadOnlyProperties === void 0) { ignoreReadOnlyProperties = false; }
                    if (context === void 0) { context = new Joove.DTOHelper(); }
                    if (original == null)
                        return null;
                    // if (context.Has(original)) {
                    //    return context.Get(original);
                    // }
                    var result = new ApplicationSettingFormViewModel();
                    if (context != null && context.fillDb == true) {
                        context.addToDb(original);
                    }
                    result._hydrateApplicationSettingFormViewModel(original, ignoreReadOnlyProperties, context);
                    // context.Add(original, result);
                    return result;
                };
                ApplicationSettingFormViewModel.prototype._hydrateApplicationSettingFormViewModel = function (original, ignoreReadOnlyProperties, context) {
                    if (context === void 0) { context = new Joove.DTOHelper(); }
                    if (original == null)
                        return;
                    this._hydrateMasterPageForSlideViewModel(original, ignoreReadOnlyProperties, context);
                    if (original._key !== undefined)
                        this._key = original._key;
                    if (original._clientKey !== undefined)
                        this._clientKey = original._clientKey;
                    if (original._originalTypeClassName !== undefined)
                        this._originalTypeClassName = original._originalTypeClassName;
                    if (original._typeHash !== undefined)
                        this._typeHash = original._typeHash;
                    if (original.ApplicationSetting !== undefined)
                        this.ApplicationSetting = ApplicationSetting_ApplicationSettingViewModel._initializeFrom(original.ApplicationSetting, ignoreReadOnlyProperties, context);
                    this._reduceData = function (ignoreReadOnlyProperties) {
                        var reduced = ApplicationSettingFormViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                        ApplicationSettingFormViewModel._deleteDropDownInitialValues(reduced);
                        return reduced;
                    };
                }; /* end _initializeFrom() */
                ApplicationSettingFormViewModel.prototype._reduceData = function (ignoreReadOnlyProperties) {
                    var reduced = ApplicationSettingFormViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                    ApplicationSettingFormViewModel._deleteDropDownInitialValues(reduced);
                    return reduced;
                };
                ApplicationSettingFormViewModel._deleteDropDownInitialValues = function (reduced) {
                    if (reduced == null)
                        return;
                    DigicircMatchmaking.ViewModels.MasterPageForSlide.MasterPageForSlideViewModel._deleteDropDownInitialValues(reduced);
                };
                return ApplicationSettingFormViewModel;
            }(DigicircMatchmaking.ViewModels.MasterPageForSlide.MasterPageForSlideViewModel));
            ApplicationSettingForm.ApplicationSettingFormViewModel = ApplicationSettingFormViewModel;
            var ApplicationSetting_ApplicationSettingViewModel = /** @class */ (function (_super) {
                __extends(ApplicationSetting_ApplicationSettingViewModel, _super);
                function ApplicationSetting_ApplicationSettingViewModel() {
                    return _super.call(this) || this;
                }
                ApplicationSetting_ApplicationSettingViewModel._lightCast = function (instance) {
                    if (instance == null)
                        return;
                    return instance;
                };
                ApplicationSetting_ApplicationSettingViewModel._initializeFrom = function (original, ignoreReadOnlyProperties, context) {
                    if (ignoreReadOnlyProperties === void 0) { ignoreReadOnlyProperties = false; }
                    if (context === void 0) { context = new Joove.DTOHelper(); }
                    if (original == null)
                        return null;
                    // if (context.Has(original)) {
                    //    return context.Get(original);
                    // }
                    var result = new ApplicationSetting_ApplicationSettingViewModel();
                    if (context != null && context.fillDb == true) {
                        context.addToDb(original);
                    }
                    result._hydrateApplicationSetting_ApplicationSettingViewModel(original, ignoreReadOnlyProperties, context);
                    // context.Add(original, result);
                    return result;
                };
                ApplicationSetting_ApplicationSettingViewModel.prototype._hydrateApplicationSetting_ApplicationSettingViewModel = function (original, ignoreReadOnlyProperties, context) {
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
                    if (original.IsCustom !== undefined)
                        this.IsCustom = original.IsCustom;
                    if (original.Key !== undefined)
                        this.Key = original.Key;
                    if (original.Value !== undefined)
                        this.Value = original.Value;
                    this._reduceData = function (ignoreReadOnlyProperties) {
                        var reduced = ApplicationSetting_ApplicationSettingViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                        return reduced;
                    };
                }; /* end _initializeFrom() */
                ApplicationSetting_ApplicationSettingViewModel.prototype._reduceData = function (ignoreReadOnlyProperties) {
                    var reduced = ApplicationSetting_ApplicationSettingViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                    return reduced;
                };
                return ApplicationSetting_ApplicationSettingViewModel;
            }(BaseClass.ViewModel));
            ApplicationSettingForm.ApplicationSetting_ApplicationSettingViewModel = ApplicationSetting_ApplicationSettingViewModel;
        })(ApplicationSettingForm = ViewModels.ApplicationSettingForm || (ViewModels.ApplicationSettingForm = {}));
    })(ViewModels = DigicircMatchmaking.ViewModels || (DigicircMatchmaking.ViewModels = {}));
})(DigicircMatchmaking || (DigicircMatchmaking = {}));