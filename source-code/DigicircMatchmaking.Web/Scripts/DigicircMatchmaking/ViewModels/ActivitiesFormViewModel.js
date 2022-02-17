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
        var ActivitiesForm;
        (function (ActivitiesForm) {
            var ActivitiesFormViewModel = /** @class */ (function (_super) {
                __extends(ActivitiesFormViewModel, _super);
                function ActivitiesFormViewModel() {
                    return _super.call(this) || this;
                }
                ActivitiesFormViewModel._lightCast = function (instance) {
                    if (instance == null)
                        return;
                    if (instance.Activities != null)
                        instance.Activities = Activities_ActivitiesViewModel._lightCast(instance.Activities);
                    return instance;
                };
                ActivitiesFormViewModel._initializeFrom = function (original, ignoreReadOnlyProperties, context) {
                    if (ignoreReadOnlyProperties === void 0) { ignoreReadOnlyProperties = false; }
                    if (context === void 0) { context = new Joove.DTOHelper(); }
                    if (original == null)
                        return null;
                    // if (context.Has(original)) {
                    //    return context.Get(original);
                    // }
                    var result = new ActivitiesFormViewModel();
                    if (context != null && context.fillDb == true) {
                        context.addToDb(original);
                    }
                    result._hydrateActivitiesFormViewModel(original, ignoreReadOnlyProperties, context);
                    // context.Add(original, result);
                    return result;
                };
                ActivitiesFormViewModel.prototype._hydrateActivitiesFormViewModel = function (original, ignoreReadOnlyProperties, context) {
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
                    if (original.Activities !== undefined)
                        this.Activities = Activities_ActivitiesViewModel._initializeFrom(original.Activities, ignoreReadOnlyProperties, context);
                    this._reduceData = function (ignoreReadOnlyProperties) {
                        var reduced = ActivitiesFormViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                        ActivitiesFormViewModel._deleteDropDownInitialValues(reduced);
                        return reduced;
                    };
                }; /* end _initializeFrom() */
                ActivitiesFormViewModel.prototype._reduceData = function (ignoreReadOnlyProperties) {
                    var reduced = ActivitiesFormViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                    ActivitiesFormViewModel._deleteDropDownInitialValues(reduced);
                    return reduced;
                };
                ActivitiesFormViewModel._deleteDropDownInitialValues = function (reduced) {
                    if (reduced == null)
                        return;
                    DigicircMatchmaking.ViewModels.MasterPage.MasterPageViewModel._deleteDropDownInitialValues(reduced);
                };
                return ActivitiesFormViewModel;
            }(DigicircMatchmaking.ViewModels.MasterPage.MasterPageViewModel));
            ActivitiesForm.ActivitiesFormViewModel = ActivitiesFormViewModel;
            var Activities_ActivitiesViewModel = /** @class */ (function (_super) {
                __extends(Activities_ActivitiesViewModel, _super);
                function Activities_ActivitiesViewModel() {
                    return _super.call(this) || this;
                }
                Activities_ActivitiesViewModel._lightCast = function (instance) {
                    if (instance == null)
                        return;
                    return instance;
                };
                Activities_ActivitiesViewModel._initializeFrom = function (original, ignoreReadOnlyProperties, context) {
                    if (ignoreReadOnlyProperties === void 0) { ignoreReadOnlyProperties = false; }
                    if (context === void 0) { context = new Joove.DTOHelper(); }
                    if (original == null)
                        return null;
                    // if (context.Has(original)) {
                    //    return context.Get(original);
                    // }
                    var result = new Activities_ActivitiesViewModel();
                    if (context != null && context.fillDb == true) {
                        context.addToDb(original);
                    }
                    result._hydrateActivities_ActivitiesViewModel(original, ignoreReadOnlyProperties, context);
                    // context.Add(original, result);
                    return result;
                };
                Activities_ActivitiesViewModel.prototype._hydrateActivities_ActivitiesViewModel = function (original, ignoreReadOnlyProperties, context) {
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
                        var reduced = Activities_ActivitiesViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                        return reduced;
                    };
                }; /* end _initializeFrom() */
                Activities_ActivitiesViewModel.prototype._reduceData = function (ignoreReadOnlyProperties) {
                    var reduced = Activities_ActivitiesViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                    return reduced;
                };
                return Activities_ActivitiesViewModel;
            }(BaseClass.ViewModel));
            ActivitiesForm.Activities_ActivitiesViewModel = Activities_ActivitiesViewModel;
        })(ActivitiesForm = ViewModels.ActivitiesForm || (ViewModels.ActivitiesForm = {}));
    })(ViewModels = DigicircMatchmaking.ViewModels || (DigicircMatchmaking.ViewModels = {}));
})(DigicircMatchmaking || (DigicircMatchmaking = {}));
