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
        var ThematicExpertiseList;
        (function (ThematicExpertiseList) {
            var ThematicExpertiseListViewModel = /** @class */ (function (_super) {
                __extends(ThematicExpertiseListViewModel, _super);
                function ThematicExpertiseListViewModel() {
                    return _super.call(this) || this;
                }
                ThematicExpertiseListViewModel._lightCast = function (instance) {
                    if (instance == null)
                        return;
                    return instance;
                };
                ThematicExpertiseListViewModel._initializeFrom = function (original, ignoreReadOnlyProperties, context) {
                    if (ignoreReadOnlyProperties === void 0) { ignoreReadOnlyProperties = false; }
                    if (context === void 0) { context = new Joove.DTOHelper(); }
                    if (original == null)
                        return null;
                    // if (context.Has(original)) {
                    //    return context.Get(original);
                    // }
                    var result = new ThematicExpertiseListViewModel();
                    if (context != null && context.fillDb == true) {
                        context.addToDb(original);
                    }
                    result._hydrateThematicExpertiseListViewModel(original, ignoreReadOnlyProperties, context);
                    // context.Add(original, result);
                    return result;
                };
                ThematicExpertiseListViewModel.prototype._hydrateThematicExpertiseListViewModel = function (original, ignoreReadOnlyProperties, context) {
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
                    this.ThematicExpertiseListSelectedItemKeys = original.ThematicExpertiseListSelectedItemKeys;
                    this._reduceData = function (ignoreReadOnlyProperties) {
                        var reduced = ThematicExpertiseListViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                        ThematicExpertiseListViewModel._deleteDropDownInitialValues(reduced);
                        return reduced;
                    };
                }; /* end _initializeFrom() */
                ThematicExpertiseListViewModel.prototype._reduceData = function (ignoreReadOnlyProperties) {
                    var reduced = ThematicExpertiseListViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                    ThematicExpertiseListViewModel._deleteDropDownInitialValues(reduced);
                    return reduced;
                };
                ThematicExpertiseListViewModel._deleteDropDownInitialValues = function (reduced) {
                    if (reduced == null)
                        return;
                    DigicircMatchmaking.ViewModels.MasterPage.MasterPageViewModel._deleteDropDownInitialValues(reduced);
                };
                return ThematicExpertiseListViewModel;
            }(DigicircMatchmaking.ViewModels.MasterPage.MasterPageViewModel));
            ThematicExpertiseList.ThematicExpertiseListViewModel = ThematicExpertiseListViewModel;
        })(ThematicExpertiseList = ViewModels.ThematicExpertiseList || (ViewModels.ThematicExpertiseList = {}));
    })(ViewModels = DigicircMatchmaking.ViewModels || (DigicircMatchmaking.ViewModels = {}));
})(DigicircMatchmaking || (DigicircMatchmaking = {}));
