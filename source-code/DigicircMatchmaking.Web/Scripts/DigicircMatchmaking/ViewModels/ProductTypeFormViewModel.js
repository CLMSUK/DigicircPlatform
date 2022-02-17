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
        var ProductTypeForm;
        (function (ProductTypeForm) {
            var ProductTypeFormViewModel = /** @class */ (function (_super) {
                __extends(ProductTypeFormViewModel, _super);
                function ProductTypeFormViewModel() {
                    return _super.call(this) || this;
                }
                ProductTypeFormViewModel._lightCast = function (instance) {
                    if (instance == null)
                        return;
                    if (instance.ProductType != null)
                        instance.ProductType = ProductType_ProductTypeViewModel._lightCast(instance.ProductType);
                    return instance;
                };
                ProductTypeFormViewModel._initializeFrom = function (original, ignoreReadOnlyProperties, context) {
                    if (ignoreReadOnlyProperties === void 0) { ignoreReadOnlyProperties = false; }
                    if (context === void 0) { context = new Joove.DTOHelper(); }
                    if (original == null)
                        return null;
                    // if (context.Has(original)) {
                    //    return context.Get(original);
                    // }
                    var result = new ProductTypeFormViewModel();
                    if (context != null && context.fillDb == true) {
                        context.addToDb(original);
                    }
                    result._hydrateProductTypeFormViewModel(original, ignoreReadOnlyProperties, context);
                    // context.Add(original, result);
                    return result;
                };
                ProductTypeFormViewModel.prototype._hydrateProductTypeFormViewModel = function (original, ignoreReadOnlyProperties, context) {
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
                    if (original.ProductType !== undefined)
                        this.ProductType = ProductType_ProductTypeViewModel._initializeFrom(original.ProductType, ignoreReadOnlyProperties, context);
                    this.PickListSelectedItemKeys = original.PickListSelectedItemKeys;
                    this._reduceData = function (ignoreReadOnlyProperties) {
                        var reduced = ProductTypeFormViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                        ProductTypeFormViewModel._deleteDropDownInitialValues(reduced);
                        return reduced;
                    };
                }; /* end _initializeFrom() */
                ProductTypeFormViewModel.prototype._reduceData = function (ignoreReadOnlyProperties) {
                    var reduced = ProductTypeFormViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                    ProductTypeFormViewModel._deleteDropDownInitialValues(reduced);
                    return reduced;
                };
                ProductTypeFormViewModel._deleteDropDownInitialValues = function (reduced) {
                    if (reduced == null)
                        return;
                    DigicircMatchmaking.ViewModels.SymbiosisMasterPage.SymbiosisMasterPageViewModel._deleteDropDownInitialValues(reduced);
                };
                return ProductTypeFormViewModel;
            }(DigicircMatchmaking.ViewModels.SymbiosisMasterPage.SymbiosisMasterPageViewModel));
            ProductTypeForm.ProductTypeFormViewModel = ProductTypeFormViewModel;
            var ProductType_ProductTypeViewModel = /** @class */ (function (_super) {
                __extends(ProductType_ProductTypeViewModel, _super);
                function ProductType_ProductTypeViewModel() {
                    var _this = _super.call(this) || this;
                    _this.SybTypes = new Array();
                    return _this;
                }
                ProductType_ProductTypeViewModel._lightCast = function (instance) {
                    if (instance == null)
                        return;
                    if (instance.SybTypes != null) {
                        for (var i = 0; i < instance.SybTypes.length; i++) {
                            instance.SybTypes[i] = ProductType_ProductType_SybTypes_ProductTypeViewModel._lightCast(instance.SybTypes[i]);
                        }
                    }
                    return instance;
                };
                ProductType_ProductTypeViewModel._initializeFrom = function (original, ignoreReadOnlyProperties, context) {
                    if (ignoreReadOnlyProperties === void 0) { ignoreReadOnlyProperties = false; }
                    if (context === void 0) { context = new Joove.DTOHelper(); }
                    if (original == null)
                        return null;
                    // if (context.Has(original)) {
                    //    return context.Get(original);
                    // }
                    var result = new ProductType_ProductTypeViewModel();
                    if (context != null && context.fillDb == true) {
                        context.addToDb(original);
                    }
                    result._hydrateProductType_ProductTypeViewModel(original, ignoreReadOnlyProperties, context);
                    // context.Add(original, result);
                    return result;
                };
                ProductType_ProductTypeViewModel.prototype._hydrateProductType_ProductTypeViewModel = function (original, ignoreReadOnlyProperties, context) {
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
                    if (original.Name !== undefined)
                        this.Name = original.Name;
                    if (original.SybTypes != null) {
                        for (var i = 0; i < original.SybTypes.length; i++) {
                            this.SybTypes.push(ProductType_ProductType_SybTypes_ProductTypeViewModel._initializeFrom(original.SybTypes[i], ignoreReadOnlyProperties, context));
                        }
                    }
                    this._reduceData = function (ignoreReadOnlyProperties) {
                        var reduced = ProductType_ProductTypeViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                        return reduced;
                    };
                }; /* end _initializeFrom() */
                ProductType_ProductTypeViewModel.prototype._reduceData = function (ignoreReadOnlyProperties) {
                    var reduced = ProductType_ProductTypeViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                    return reduced;
                };
                return ProductType_ProductTypeViewModel;
            }(BaseClass.ViewModel));
            ProductTypeForm.ProductType_ProductTypeViewModel = ProductType_ProductTypeViewModel;
            var ProductType_ProductType_SybTypes_ProductTypeViewModel = /** @class */ (function (_super) {
                __extends(ProductType_ProductType_SybTypes_ProductTypeViewModel, _super);
                function ProductType_ProductType_SybTypes_ProductTypeViewModel() {
                    var _this = _super.call(this) || this;
                    _this.SybTypes = new Array();
                    return _this;
                }
                ProductType_ProductType_SybTypes_ProductTypeViewModel._lightCast = function (instance) {
                    if (instance == null)
                        return;
                    if (instance.SybTypes != null) {
                        for (var i = 0; i < instance.SybTypes.length; i++) {
                            instance.SybTypes[i] = ProductType_ProductType_SybTypes_ProductType_SybTypes_ProductTypeViewModel._lightCast(instance.SybTypes[i]);
                        }
                    }
                    return instance;
                };
                ProductType_ProductType_SybTypes_ProductTypeViewModel._initializeFrom = function (original, ignoreReadOnlyProperties, context) {
                    if (ignoreReadOnlyProperties === void 0) { ignoreReadOnlyProperties = false; }
                    if (context === void 0) { context = new Joove.DTOHelper(); }
                    if (original == null)
                        return null;
                    // if (context.Has(original)) {
                    //    return context.Get(original);
                    // }
                    var result = new ProductType_ProductType_SybTypes_ProductTypeViewModel();
                    if (context != null && context.fillDb == true) {
                        context.addToDb(original);
                    }
                    result._hydrateProductType_ProductType_SybTypes_ProductTypeViewModel(original, ignoreReadOnlyProperties, context);
                    // context.Add(original, result);
                    return result;
                };
                ProductType_ProductType_SybTypes_ProductTypeViewModel.prototype._hydrateProductType_ProductType_SybTypes_ProductTypeViewModel = function (original, ignoreReadOnlyProperties, context) {
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
                    if (original.Name !== undefined)
                        this.Name = original.Name;
                    if (original.SybTypes != null) {
                        for (var i = 0; i < original.SybTypes.length; i++) {
                            this.SybTypes.push(ProductType_ProductType_SybTypes_ProductType_SybTypes_ProductTypeViewModel._initializeFrom(original.SybTypes[i], ignoreReadOnlyProperties, context));
                        }
                    }
                    this._reduceData = function (ignoreReadOnlyProperties) {
                        var reduced = ProductType_ProductType_SybTypes_ProductTypeViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                        return reduced;
                    };
                }; /* end _initializeFrom() */
                ProductType_ProductType_SybTypes_ProductTypeViewModel.prototype._reduceData = function (ignoreReadOnlyProperties) {
                    var reduced = ProductType_ProductType_SybTypes_ProductTypeViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                    return reduced;
                };
                return ProductType_ProductType_SybTypes_ProductTypeViewModel;
            }(BaseClass.ViewModel));
            ProductTypeForm.ProductType_ProductType_SybTypes_ProductTypeViewModel = ProductType_ProductType_SybTypes_ProductTypeViewModel;
            var ProductType_ProductType_SybTypes_ProductType_SybTypes_ProductTypeViewModel = /** @class */ (function (_super) {
                __extends(ProductType_ProductType_SybTypes_ProductType_SybTypes_ProductTypeViewModel, _super);
                function ProductType_ProductType_SybTypes_ProductType_SybTypes_ProductTypeViewModel() {
                    return _super.call(this) || this;
                }
                ProductType_ProductType_SybTypes_ProductType_SybTypes_ProductTypeViewModel._lightCast = function (instance) {
                    if (instance == null)
                        return;
                    return instance;
                };
                ProductType_ProductType_SybTypes_ProductType_SybTypes_ProductTypeViewModel._initializeFrom = function (original, ignoreReadOnlyProperties, context) {
                    if (ignoreReadOnlyProperties === void 0) { ignoreReadOnlyProperties = false; }
                    if (context === void 0) { context = new Joove.DTOHelper(); }
                    if (original == null)
                        return null;
                    // if (context.Has(original)) {
                    //    return context.Get(original);
                    // }
                    var result = new ProductType_ProductType_SybTypes_ProductType_SybTypes_ProductTypeViewModel();
                    if (context != null && context.fillDb == true) {
                        context.addToDb(original);
                    }
                    result._hydrateProductType_ProductType_SybTypes_ProductType_SybTypes_ProductTypeViewModel(original, ignoreReadOnlyProperties, context);
                    // context.Add(original, result);
                    return result;
                };
                ProductType_ProductType_SybTypes_ProductType_SybTypes_ProductTypeViewModel.prototype._hydrateProductType_ProductType_SybTypes_ProductType_SybTypes_ProductTypeViewModel = function (original, ignoreReadOnlyProperties, context) {
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
                    if (original.Name !== undefined)
                        this.Name = original.Name;
                    this._reduceData = function (ignoreReadOnlyProperties) {
                        var reduced = ProductType_ProductType_SybTypes_ProductType_SybTypes_ProductTypeViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                        return reduced;
                    };
                }; /* end _initializeFrom() */
                ProductType_ProductType_SybTypes_ProductType_SybTypes_ProductTypeViewModel.prototype._reduceData = function (ignoreReadOnlyProperties) {
                    var reduced = ProductType_ProductType_SybTypes_ProductType_SybTypes_ProductTypeViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                    return reduced;
                };
                return ProductType_ProductType_SybTypes_ProductType_SybTypes_ProductTypeViewModel;
            }(BaseClass.ViewModel));
            ProductTypeForm.ProductType_ProductType_SybTypes_ProductType_SybTypes_ProductTypeViewModel = ProductType_ProductType_SybTypes_ProductType_SybTypes_ProductTypeViewModel;
        })(ProductTypeForm = ViewModels.ProductTypeForm || (ViewModels.ProductTypeForm = {}));
    })(ViewModels = DigicircMatchmaking.ViewModels || (DigicircMatchmaking.ViewModels = {}));
})(DigicircMatchmaking || (DigicircMatchmaking = {}));
