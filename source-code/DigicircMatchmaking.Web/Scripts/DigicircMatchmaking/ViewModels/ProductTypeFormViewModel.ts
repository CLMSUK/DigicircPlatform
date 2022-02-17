// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
namespace DigicircMatchmaking.ViewModels.ProductTypeForm {
export class ProductTypeFormViewModel extends DigicircMatchmaking.ViewModels.SymbiosisMasterPage.SymbiosisMasterPageViewModel {
    public constructor() {
        super();
    }


    public static _lightCast(instance: any): any {
        if (instance == null) return;

        if(instance.ProductType != null)
            instance.ProductType = ProductType_ProductTypeViewModel._lightCast(instance.ProductType);
        return instance;
    }

    public static _initializeFrom(original: ProductTypeFormViewModel, ignoreReadOnlyProperties: boolean = false, context = new Joove.DTOHelper()): ProductTypeFormViewModel {
        if(original == null) return null;
        // if (context.Has(original)) {
        //    return context.Get(original);
        // }
var result:
        ProductTypeFormViewModel = new ProductTypeFormViewModel();
        if (context != null && context.fillDb == true) {
            context.addToDb(original);
        }
        result._hydrateProductTypeFormViewModel(original, ignoreReadOnlyProperties, context);
        // context.Add(original, result);
        return result;
    }


    public _hydrateProductTypeFormViewModel(original: ProductTypeFormViewModel, ignoreReadOnlyProperties: boolean, context = new Joove.DTOHelper()): void {
        if(original == null) return;

        this._hydrateSymbiosisMasterPageViewModel(original, ignoreReadOnlyProperties, context);

        if(original._key !== undefined) this._key = original._key;
        if(original._clientKey !== undefined) this._clientKey = original._clientKey;
        if(original._originalTypeClassName !== undefined) this._originalTypeClassName = original._originalTypeClassName;
        if(original._typeHash !== undefined) this._typeHash = original._typeHash;


        if(original.ProductType !== undefined) this.ProductType = ProductType_ProductTypeViewModel._initializeFrom(original.ProductType, ignoreReadOnlyProperties, context);
        this.PickListSelectedItemKeys = original.PickListSelectedItemKeys;

        this._reduceData = function(ignoreReadOnlyProperties: boolean) {
            var reduced = ProductTypeFormViewModel._initializeFrom(this, ignoreReadOnlyProperties);
            ProductTypeFormViewModel._deleteDropDownInitialValues(reduced);
            return reduced;
        };
    } /* end _initializeFrom() */


    public _reduceData(ignoreReadOnlyProperties: boolean): ProductTypeFormViewModel {
        var reduced = ProductTypeFormViewModel._initializeFrom(this, ignoreReadOnlyProperties);
        ProductTypeFormViewModel._deleteDropDownInitialValues(reduced);
        return reduced;
    }

    public static _deleteDropDownInitialValues(reduced: ProductTypeFormViewModel) {
        if (reduced == null) return;


        DigicircMatchmaking.ViewModels.SymbiosisMasterPage.SymbiosisMasterPageViewModel._deleteDropDownInitialValues(reduced);
    }
public ProductType:
    any;
public PickListSelectedItemKeys:
    any[];
}

export class ProductType_ProductTypeViewModel extends BaseClass.ViewModel  {
    public constructor() {
        super();
        this.SybTypes = new Array<any>();
    }


    public static _lightCast(instance: any): any {
        if (instance == null) return;


        if(instance.SybTypes != null) {
            for(let i = 0; i < instance.SybTypes.length; i++) {
                instance.SybTypes[i] = ProductType_ProductType_SybTypes_ProductTypeViewModel._lightCast(instance.SybTypes[i]);

            }
        }
        return instance;
    }

    public static _initializeFrom(original: ProductType_ProductTypeViewModel, ignoreReadOnlyProperties: boolean = false, context = new Joove.DTOHelper()): ProductType_ProductTypeViewModel {
        if(original == null) return null;
        // if (context.Has(original)) {
        //    return context.Get(original);
        // }
var result:
        ProductType_ProductTypeViewModel = new ProductType_ProductTypeViewModel();
        if (context != null && context.fillDb == true) {
            context.addToDb(original);
        }
        result._hydrateProductType_ProductTypeViewModel(original, ignoreReadOnlyProperties, context);
        // context.Add(original, result);
        return result;
    }


    public _hydrateProductType_ProductTypeViewModel(original: ProductType_ProductTypeViewModel, ignoreReadOnlyProperties: boolean, context = new Joove.DTOHelper()): void {
        if(original == null) return;


        if(original._key !== undefined) this._key = original._key;
        if(original._clientKey !== undefined) this._clientKey = original._clientKey;
        if(original._originalTypeClassName !== undefined) this._originalTypeClassName = original._originalTypeClassName;
        if(original._typeHash !== undefined) this._typeHash = original._typeHash;

        if (original._versionTimestamp !== undefined) this._versionTimestamp = original._versionTimestamp;
        if(original.Id !== undefined) this.Id = original.Id;
        if(original.Name !== undefined) this.Name = original.Name;

        if(original.SybTypes != null) {
            for(let i = 0; i < original.SybTypes.length; i++) {
                this.SybTypes.push(ProductType_ProductType_SybTypes_ProductTypeViewModel._initializeFrom(original.SybTypes[i], ignoreReadOnlyProperties, context));
            }
        }

        this._reduceData = function(ignoreReadOnlyProperties: boolean) {
            var reduced = ProductType_ProductTypeViewModel._initializeFrom(this, ignoreReadOnlyProperties);

            return reduced;
        };
    } /* end _initializeFrom() */


    public _reduceData(ignoreReadOnlyProperties: boolean): ProductType_ProductTypeViewModel {
        var reduced = ProductType_ProductTypeViewModel._initializeFrom(this, ignoreReadOnlyProperties);

        return reduced;
    }
public Id:
    any;
public Name:
    any;
public SybTypes:
    Array<any>;
    public _versionTimestamp?: string;
}

export class ProductType_ProductType_SybTypes_ProductTypeViewModel extends BaseClass.ViewModel  {
    public constructor() {
        super();
        this.SybTypes = new Array<any>();
    }


    public static _lightCast(instance: any): any {
        if (instance == null) return;


        if(instance.SybTypes != null) {
            for(let i = 0; i < instance.SybTypes.length; i++) {
                instance.SybTypes[i] = ProductType_ProductType_SybTypes_ProductType_SybTypes_ProductTypeViewModel._lightCast(instance.SybTypes[i]);

            }
        }
        return instance;
    }

    public static _initializeFrom(original: ProductType_ProductType_SybTypes_ProductTypeViewModel, ignoreReadOnlyProperties: boolean = false, context = new Joove.DTOHelper()): ProductType_ProductType_SybTypes_ProductTypeViewModel {
        if(original == null) return null;
        // if (context.Has(original)) {
        //    return context.Get(original);
        // }
var result:
        ProductType_ProductType_SybTypes_ProductTypeViewModel = new ProductType_ProductType_SybTypes_ProductTypeViewModel();
        if (context != null && context.fillDb == true) {
            context.addToDb(original);
        }
        result._hydrateProductType_ProductType_SybTypes_ProductTypeViewModel(original, ignoreReadOnlyProperties, context);
        // context.Add(original, result);
        return result;
    }


    public _hydrateProductType_ProductType_SybTypes_ProductTypeViewModel(original: ProductType_ProductType_SybTypes_ProductTypeViewModel, ignoreReadOnlyProperties: boolean, context = new Joove.DTOHelper()): void {
        if(original == null) return;


        if(original._key !== undefined) this._key = original._key;
        if(original._clientKey !== undefined) this._clientKey = original._clientKey;
        if(original._originalTypeClassName !== undefined) this._originalTypeClassName = original._originalTypeClassName;
        if(original._typeHash !== undefined) this._typeHash = original._typeHash;

        if (original._versionTimestamp !== undefined) this._versionTimestamp = original._versionTimestamp;
        if(original.Id !== undefined) this.Id = original.Id;
        if(original.Name !== undefined) this.Name = original.Name;

        if(original.SybTypes != null) {
            for(let i = 0; i < original.SybTypes.length; i++) {
                this.SybTypes.push(ProductType_ProductType_SybTypes_ProductType_SybTypes_ProductTypeViewModel._initializeFrom(original.SybTypes[i], ignoreReadOnlyProperties, context));
            }
        }

        this._reduceData = function(ignoreReadOnlyProperties: boolean) {
            var reduced = ProductType_ProductType_SybTypes_ProductTypeViewModel._initializeFrom(this, ignoreReadOnlyProperties);

            return reduced;
        };
    } /* end _initializeFrom() */


    public _reduceData(ignoreReadOnlyProperties: boolean): ProductType_ProductType_SybTypes_ProductTypeViewModel {
        var reduced = ProductType_ProductType_SybTypes_ProductTypeViewModel._initializeFrom(this, ignoreReadOnlyProperties);

        return reduced;
    }
public Id:
    any;
public Name:
    any;
public SybTypes:
    Array<any>;
    public _versionTimestamp?: string;
}

export class ProductType_ProductType_SybTypes_ProductType_SybTypes_ProductTypeViewModel extends BaseClass.ViewModel  {
    public constructor() {
        super();
    }


    public static _lightCast(instance: any): any {
        if (instance == null) return;

        return instance;
    }

    public static _initializeFrom(original: ProductType_ProductType_SybTypes_ProductType_SybTypes_ProductTypeViewModel, ignoreReadOnlyProperties: boolean = false, context = new Joove.DTOHelper()): ProductType_ProductType_SybTypes_ProductType_SybTypes_ProductTypeViewModel {
        if(original == null) return null;
        // if (context.Has(original)) {
        //    return context.Get(original);
        // }
var result:
        ProductType_ProductType_SybTypes_ProductType_SybTypes_ProductTypeViewModel = new ProductType_ProductType_SybTypes_ProductType_SybTypes_ProductTypeViewModel();
        if (context != null && context.fillDb == true) {
            context.addToDb(original);
        }
        result._hydrateProductType_ProductType_SybTypes_ProductType_SybTypes_ProductTypeViewModel(original, ignoreReadOnlyProperties, context);
        // context.Add(original, result);
        return result;
    }


    public _hydrateProductType_ProductType_SybTypes_ProductType_SybTypes_ProductTypeViewModel(original: ProductType_ProductType_SybTypes_ProductType_SybTypes_ProductTypeViewModel, ignoreReadOnlyProperties: boolean, context = new Joove.DTOHelper()): void {
        if(original == null) return;


        if(original._key !== undefined) this._key = original._key;
        if(original._clientKey !== undefined) this._clientKey = original._clientKey;
        if(original._originalTypeClassName !== undefined) this._originalTypeClassName = original._originalTypeClassName;
        if(original._typeHash !== undefined) this._typeHash = original._typeHash;

        if (original._versionTimestamp !== undefined) this._versionTimestamp = original._versionTimestamp;
        if(original.Id !== undefined) this.Id = original.Id;
        if(original.Name !== undefined) this.Name = original.Name;

        this._reduceData = function(ignoreReadOnlyProperties: boolean) {
            var reduced = ProductType_ProductType_SybTypes_ProductType_SybTypes_ProductTypeViewModel._initializeFrom(this, ignoreReadOnlyProperties);

            return reduced;
        };
    } /* end _initializeFrom() */


    public _reduceData(ignoreReadOnlyProperties: boolean): ProductType_ProductType_SybTypes_ProductType_SybTypes_ProductTypeViewModel {
        var reduced = ProductType_ProductType_SybTypes_ProductType_SybTypes_ProductTypeViewModel._initializeFrom(this, ignoreReadOnlyProperties);

        return reduced;
    }
public Id:
    any;
public Name:
    any;
    public _versionTimestamp?: string;
}

}