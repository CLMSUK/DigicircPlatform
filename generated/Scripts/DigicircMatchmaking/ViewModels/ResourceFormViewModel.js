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
        var ResourceForm;
        (function (ResourceForm) {
            var ResourceFormViewModel = /** @class */ (function (_super) {
                __extends(ResourceFormViewModel, _super);
                function ResourceFormViewModel() {
                    return _super.call(this) || this;
                }
                ResourceFormViewModel._lightCast = function (instance) {
                    if (instance == null)
                        return;
                    if (instance.Product != null)
                        instance.Product = Product_ProductViewModel._lightCast(instance.Product);
                    return instance;
                };
                ResourceFormViewModel._initializeFrom = function (original, ignoreReadOnlyProperties, context) {
                    if (ignoreReadOnlyProperties === void 0) { ignoreReadOnlyProperties = false; }
                    if (context === void 0) { context = new Joove.DTOHelper(); }
                    if (original == null)
                        return null;
                    // if (context.Has(original)) {
                    //    return context.Get(original);
                    // }
                    var result = new ResourceFormViewModel();
                    if (context != null && context.fillDb == true) {
                        context.addToDb(original);
                    }
                    result._hydrateResourceFormViewModel(original, ignoreReadOnlyProperties, context);
                    // context.Add(original, result);
                    return result;
                };
                ResourceFormViewModel.prototype._hydrateResourceFormViewModel = function (original, ignoreReadOnlyProperties, context) {
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
                    if (original.Product !== undefined)
                        this.Product = Product_ProductViewModel._initializeFrom(original.Product, ignoreReadOnlyProperties, context);
                    if (original.ActorId !== undefined)
                        this.ActorId = original.ActorId;
                    if (original.DropdownBox4__InitialSelection !== undefined)
                        this.DropdownBox4__InitialSelection = original.DropdownBox4__InitialSelection;
                    if (original.DropdownBox__InitialSelection !== undefined)
                        this.DropdownBox__InitialSelection = original.DropdownBox__InitialSelection;
                    this.DropdownBox4SelectedItemKeys = original.DropdownBox4SelectedItemKeys;
                    this.DropdownBoxSelectedItemKeys = original.DropdownBoxSelectedItemKeys;
                    this._reduceData = function (ignoreReadOnlyProperties) {
                        var reduced = ResourceFormViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                        ResourceFormViewModel._deleteDropDownInitialValues(reduced);
                        return reduced;
                    };
                }; /* end _initializeFrom() */
                ResourceFormViewModel.prototype._reduceData = function (ignoreReadOnlyProperties) {
                    var reduced = ResourceFormViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                    ResourceFormViewModel._deleteDropDownInitialValues(reduced);
                    return reduced;
                };
                ResourceFormViewModel._deleteDropDownInitialValues = function (reduced) {
                    if (reduced == null)
                        return;
                    delete reduced.DropdownBox4__InitialSelection;
                    delete reduced.DropdownBox__InitialSelection;
                };
                return ResourceFormViewModel;
            }(BaseClass.ViewModel));
            ResourceForm.ResourceFormViewModel = ResourceFormViewModel;
            var Product_ProductViewModel = /** @class */ (function (_super) {
                __extends(Product_ProductViewModel, _super);
                function Product_ProductViewModel() {
                    return _super.call(this) || this;
                }
                Product_ProductViewModel._lightCast = function (instance) {
                    if (instance == null)
                        return;
                    if (instance.ValidFrom != null)
                        instance.ValidFrom = new Date(instance.ValidFrom);
                    if (instance.ValidTo != null)
                        instance.ValidTo = new Date(instance.ValidTo);
                    if (instance.Resource != null)
                        instance.Resource = Product_Product_Resource_MaterialViewModel._lightCast(instance.Resource);
                    if (instance.Site != null)
                        instance.Site = Product_Product_Site_AddressViewModel._lightCast(instance.Site);
                    return instance;
                };
                Product_ProductViewModel._initializeFrom = function (original, ignoreReadOnlyProperties, context) {
                    if (ignoreReadOnlyProperties === void 0) { ignoreReadOnlyProperties = false; }
                    if (context === void 0) { context = new Joove.DTOHelper(); }
                    if (original == null)
                        return null;
                    // if (context.Has(original)) {
                    //    return context.Get(original);
                    // }
                    var result = new Product_ProductViewModel();
                    if (context != null && context.fillDb == true) {
                        context.addToDb(original);
                    }
                    result._hydrateProduct_ProductViewModel(original, ignoreReadOnlyProperties, context);
                    // context.Add(original, result);
                    return result;
                };
                Product_ProductViewModel.prototype._hydrateProduct_ProductViewModel = function (original, ignoreReadOnlyProperties, context) {
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
                    if (original.IsDesired !== undefined)
                        this.IsDesired = original.IsDesired;
                    if (original.Quantity !== undefined)
                        this.Quantity = original.Quantity;
                    if (!CLMS.Framework.String.IsNullOrEmpty(original.ValidFrom))
                        this.ValidFrom = new Date(original.ValidFrom);
                    if (!CLMS.Framework.String.IsNullOrEmpty(original.ValidTo))
                        this.ValidTo = new Date(original.ValidTo);
                    if (original.Resource !== undefined)
                        this.Resource = Product_Product_Resource_MaterialViewModel._initializeFrom(original.Resource, ignoreReadOnlyProperties, context);
                    if (original.Site !== undefined)
                        this.Site = Product_Product_Site_AddressViewModel._initializeFrom(original.Site, ignoreReadOnlyProperties, context);
                    this._reduceData = function (ignoreReadOnlyProperties) {
                        var reduced = Product_ProductViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                        return reduced;
                    };
                }; /* end _initializeFrom() */
                Product_ProductViewModel.prototype._reduceData = function (ignoreReadOnlyProperties) {
                    var reduced = Product_ProductViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                    return reduced;
                };
                return Product_ProductViewModel;
            }(BaseClass.ViewModel));
            ResourceForm.Product_ProductViewModel = Product_ProductViewModel;
            var Product_Product_Resource_MaterialViewModel = /** @class */ (function (_super) {
                __extends(Product_Product_Resource_MaterialViewModel, _super);
                function Product_Product_Resource_MaterialViewModel() {
                    return _super.call(this) || this;
                }
                Product_Product_Resource_MaterialViewModel._lightCast = function (instance) {
                    if (instance == null)
                        return;
                    return instance;
                };
                Product_Product_Resource_MaterialViewModel._initializeFrom = function (original, ignoreReadOnlyProperties, context) {
                    if (ignoreReadOnlyProperties === void 0) { ignoreReadOnlyProperties = false; }
                    if (context === void 0) { context = new Joove.DTOHelper(); }
                    if (original == null)
                        return null;
                    // if (context.Has(original)) {
                    //    return context.Get(original);
                    // }
                    var result = new Product_Product_Resource_MaterialViewModel();
                    if (context != null && context.fillDb == true) {
                        context.addToDb(original);
                    }
                    result._hydrateProduct_Product_Resource_MaterialViewModel(original, ignoreReadOnlyProperties, context);
                    // context.Add(original, result);
                    return result;
                };
                Product_Product_Resource_MaterialViewModel.prototype._hydrateProduct_Product_Resource_MaterialViewModel = function (original, ignoreReadOnlyProperties, context) {
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
                    if (original.Description !== undefined)
                        this.Description = original.Description;
                    if (original.HsSpecific !== undefined)
                        this.HsSpecific = original.HsSpecific;
                    if (original.Id !== undefined)
                        this.Id = original.Id;
                    if (original.Name !== undefined)
                        this.Name = original.Name;
                    this._reduceData = function (ignoreReadOnlyProperties) {
                        var reduced = Product_Product_Resource_MaterialViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                        return reduced;
                    };
                }; /* end _initializeFrom() */
                Product_Product_Resource_MaterialViewModel.prototype._reduceData = function (ignoreReadOnlyProperties) {
                    var reduced = Product_Product_Resource_MaterialViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                    return reduced;
                };
                return Product_Product_Resource_MaterialViewModel;
            }(BaseClass.ViewModel));
            ResourceForm.Product_Product_Resource_MaterialViewModel = Product_Product_Resource_MaterialViewModel;
            var Product_Product_Site_AddressViewModel = /** @class */ (function (_super) {
                __extends(Product_Product_Site_AddressViewModel, _super);
                function Product_Product_Site_AddressViewModel() {
                    return _super.call(this) || this;
                }
                Product_Product_Site_AddressViewModel._lightCast = function (instance) {
                    if (instance == null)
                        return;
                    return instance;
                };
                Product_Product_Site_AddressViewModel._initializeFrom = function (original, ignoreReadOnlyProperties, context) {
                    if (ignoreReadOnlyProperties === void 0) { ignoreReadOnlyProperties = false; }
                    if (context === void 0) { context = new Joove.DTOHelper(); }
                    if (original == null)
                        return null;
                    // if (context.Has(original)) {
                    //    return context.Get(original);
                    // }
                    var result = new Product_Product_Site_AddressViewModel();
                    if (context != null && context.fillDb == true) {
                        context.addToDb(original);
                    }
                    result._hydrateProduct_Product_Site_AddressViewModel(original, ignoreReadOnlyProperties, context);
                    // context.Add(original, result);
                    return result;
                };
                Product_Product_Site_AddressViewModel.prototype._hydrateProduct_Product_Site_AddressViewModel = function (original, ignoreReadOnlyProperties, context) {
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
                    if (original.FullAddress !== undefined)
                        this.FullAddress = original.FullAddress;
                    if (original.Id !== undefined)
                        this.Id = original.Id;
                    if (original.Latitude !== undefined)
                        this.Latitude = original.Latitude;
                    if (original.Longitude !== undefined)
                        this.Longitude = original.Longitude;
                    if (original.Number !== undefined)
                        this.Number = original.Number;
                    if (original.StreetName !== undefined)
                        this.StreetName = original.StreetName;
                    if (original.Town !== undefined)
                        this.Town = original.Town;
                    if (original.Zip !== undefined)
                        this.Zip = original.Zip;
                    this._reduceData = function (ignoreReadOnlyProperties) {
                        var reduced = Product_Product_Site_AddressViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                        return reduced;
                    };
                }; /* end _initializeFrom() */
                Product_Product_Site_AddressViewModel.prototype._reduceData = function (ignoreReadOnlyProperties) {
                    var reduced = Product_Product_Site_AddressViewModel._initializeFrom(this, ignoreReadOnlyProperties);
                    return reduced;
                };
                return Product_Product_Site_AddressViewModel;
            }(BaseClass.ViewModel));
            ResourceForm.Product_Product_Site_AddressViewModel = Product_Product_Site_AddressViewModel;
        })(ResourceForm = ViewModels.ResourceForm || (ViewModels.ResourceForm = {}));
    })(ViewModels = DigicircMatchmaking.ViewModels || (DigicircMatchmaking.ViewModels = {}));
})(DigicircMatchmaking || (DigicircMatchmaking = {}));