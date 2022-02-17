// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
namespace DigicircMatchmaking.ViewModels.SectorTypeForm {
export class SectorTypeFormViewModel extends DigicircMatchmaking.ViewModels.MasterPage.MasterPageViewModel {
    public constructor() {
        super();
    }


    public static _lightCast(instance: any): any {
        if (instance == null) return;

        if(instance.SectorType != null)
            instance.SectorType = SectorType_SectorTypeViewModel._lightCast(instance.SectorType);
        return instance;
    }

    public static _initializeFrom(original: SectorTypeFormViewModel, ignoreReadOnlyProperties: boolean = false, context = new Joove.DTOHelper()): SectorTypeFormViewModel {
        if(original == null) return null;
        // if (context.Has(original)) {
        //    return context.Get(original);
        // }
var result:
        SectorTypeFormViewModel = new SectorTypeFormViewModel();
        if (context != null && context.fillDb == true) {
            context.addToDb(original);
        }
        result._hydrateSectorTypeFormViewModel(original, ignoreReadOnlyProperties, context);
        // context.Add(original, result);
        return result;
    }


    public _hydrateSectorTypeFormViewModel(original: SectorTypeFormViewModel, ignoreReadOnlyProperties: boolean, context = new Joove.DTOHelper()): void {
        if(original == null) return;

        this._hydrateMasterPageViewModel(original, ignoreReadOnlyProperties, context);

        if(original._key !== undefined) this._key = original._key;
        if(original._clientKey !== undefined) this._clientKey = original._clientKey;
        if(original._originalTypeClassName !== undefined) this._originalTypeClassName = original._originalTypeClassName;
        if(original._typeHash !== undefined) this._typeHash = original._typeHash;


        if(original.SectorType !== undefined) this.SectorType = SectorType_SectorTypeViewModel._initializeFrom(original.SectorType, ignoreReadOnlyProperties, context);

        this._reduceData = function(ignoreReadOnlyProperties: boolean) {
            var reduced = SectorTypeFormViewModel._initializeFrom(this, ignoreReadOnlyProperties);
            SectorTypeFormViewModel._deleteDropDownInitialValues(reduced);
            return reduced;
        };
    } /* end _initializeFrom() */


    public _reduceData(ignoreReadOnlyProperties: boolean): SectorTypeFormViewModel {
        var reduced = SectorTypeFormViewModel._initializeFrom(this, ignoreReadOnlyProperties);
        SectorTypeFormViewModel._deleteDropDownInitialValues(reduced);
        return reduced;
    }

    public static _deleteDropDownInitialValues(reduced: SectorTypeFormViewModel) {
        if (reduced == null) return;


        DigicircMatchmaking.ViewModels.MasterPage.MasterPageViewModel._deleteDropDownInitialValues(reduced);
    }
public SectorType:
    any;
}

export class SectorType_SectorTypeViewModel extends BaseClass.ViewModel  {
    public constructor() {
        super();
    }


    public static _lightCast(instance: any): any {
        if (instance == null) return;

        return instance;
    }

    public static _initializeFrom(original: SectorType_SectorTypeViewModel, ignoreReadOnlyProperties: boolean = false, context = new Joove.DTOHelper()): SectorType_SectorTypeViewModel {
        if(original == null) return null;
        // if (context.Has(original)) {
        //    return context.Get(original);
        // }
var result:
        SectorType_SectorTypeViewModel = new SectorType_SectorTypeViewModel();
        if (context != null && context.fillDb == true) {
            context.addToDb(original);
        }
        result._hydrateSectorType_SectorTypeViewModel(original, ignoreReadOnlyProperties, context);
        // context.Add(original, result);
        return result;
    }


    public _hydrateSectorType_SectorTypeViewModel(original: SectorType_SectorTypeViewModel, ignoreReadOnlyProperties: boolean, context = new Joove.DTOHelper()): void {
        if(original == null) return;


        if(original._key !== undefined) this._key = original._key;
        if(original._clientKey !== undefined) this._clientKey = original._clientKey;
        if(original._originalTypeClassName !== undefined) this._originalTypeClassName = original._originalTypeClassName;
        if(original._typeHash !== undefined) this._typeHash = original._typeHash;

        if(original.Id !== undefined) this.Id = original.Id;
        if(original.Code !== undefined) this.Code = original.Code;
        if(original.Value !== undefined) this.Value = original.Value;

        this._reduceData = function(ignoreReadOnlyProperties: boolean) {
            var reduced = SectorType_SectorTypeViewModel._initializeFrom(this, ignoreReadOnlyProperties);

            return reduced;
        };
    } /* end _initializeFrom() */


    public _reduceData(ignoreReadOnlyProperties: boolean): SectorType_SectorTypeViewModel {
        var reduced = SectorType_SectorTypeViewModel._initializeFrom(this, ignoreReadOnlyProperties);

        return reduced;
    }
public Id:
    any;
public Code:
    any;
public Value:
    any;
}

}
