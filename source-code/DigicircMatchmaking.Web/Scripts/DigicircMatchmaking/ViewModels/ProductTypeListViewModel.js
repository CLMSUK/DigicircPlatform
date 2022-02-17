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
        var ProductTypeList;
        (function (ProductTypeList) {
            var ProductTypeListViewModel = /** @class */ (function (_super) {
                __extends(ProductTypeListViewModel, _super);
                function ProductTypeListViewModel() {
                    return _super.call(this) || this;
                }
                ProductTypeListViewModel._lightCast = function (instance) {
                    if (instance == null)
                        return;
                    return instance;
                };
                ProductTypeListViewModel._initializeFrom = function (original, ignoreReadOnlyProperties, context) {
                    if (ignoreReadOnlyProperties === void 0) { ignoreReadOnlyProperties = false; }
                    if (context === void 0) { context = new Joove.DTOHelper(); }
                    if (original == null)
                        return null;
                    // if (context.Has(original)) {
                    //    return context.Get(original);
                    // }
                    var result = new ProductTypeListViewModel();
                    if (context != null && context.fillDb == true) {
                        context.addToDb(original);
                    }
                    result._hydrateProductTypeListViewModel(original, ignoreReadOnlyProperties, context);
                    // context.Add(original, result);
                    return result;
                };
                ProductTypeListViewModel.prototype._hydrateProductTypeListViewModel = function (original, ignoreReadOnlyProperties, context) {
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
                    this.ProductTypeListSelectedItemKeys = original.ProductTypeListSelectedItemKeys;
                    this._reduceData = function (ignoreReadOnlyProperties) {
                        var reduced = ProductTypeListViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                        ProductTypeListViewModel._deleteDropDownInitialValues(reduced);
                        return reduced;
                    };
                }; /* end _initializeFrom() */
                ProductTypeListViewModel.prototype._reduceData = function (ignoreReadOnlyProperties) {
                    var reduced = ProductTypeListViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                    ProductTypeListViewModel._deleteDropDownInitialValues(reduced);
                    return reduced;
                };
                ProductTypeListViewModel._deleteDropDownInitialValues = function (reduced) {
                    if (reduced == null)
                        return;
                    DigicircMatchmaking.ViewModels.SymbiosisMasterPage.SymbiosisMasterPageViewModel._deleteDropDownInitialValues(reduced);
                };
                return ProductTypeListViewModel;
            }(DigicircMatchmaking.ViewModels.SymbiosisMasterPage.SymbiosisMasterPageViewModel));
            ProductTypeList.ProductTypeListViewModel = ProductTypeListViewModel;
        })(ProductTypeList = ViewModels.ProductTypeList || (ViewModels.ProductTypeList = {}));
    })(ViewModels = DigicircMatchmaking.ViewModels || (DigicircMatchmaking.ViewModels = {}));
})(DigicircMatchmaking || (DigicircMatchmaking = {}));
