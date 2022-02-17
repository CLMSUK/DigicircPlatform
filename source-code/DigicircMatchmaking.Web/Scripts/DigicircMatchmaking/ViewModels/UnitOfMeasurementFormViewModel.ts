// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
namespace DigicircMatchmaking.ViewModels.UnitOfMeasurementForm {
export class UnitOfMeasurementFormViewModel extends DigicircMatchmaking.ViewModels.SymbiosisMasterPage.SymbiosisMasterPageViewModel {
    public constructor() {
        super();
    }


    public static _lightCast(instance: any): any {
        if (instance == null) return;

        if(instance.UnitOfMeasurement != null)
            instance.UnitOfMeasurement = UnitOfMeasurement_UnitOfMeasurementViewModel._lightCast(instance.UnitOfMeasurement);
        return instance;
    }

    public static _initializeFrom(original: UnitOfMeasurementFormViewModel, ignoreReadOnlyProperties: boolean = false, context = new Joove.DTOHelper()): UnitOfMeasurementFormViewModel {
        if(original == null) return null;
        // if (context.Has(original)) {
        //    return context.Get(original);
        // }
var result:
        UnitOfMeasurementFormViewModel = new UnitOfMeasurementFormViewModel();
        if (context != null && context.fillDb == true) {
            context.addToDb(original);
        }
        result._hydrateUnitOfMeasurementFormViewModel(original, ignoreReadOnlyProperties, context);
        // context.Add(original, result);
        return result;
    }


    public _hydrateUnitOfMeasurementFormViewModel(original: UnitOfMeasurementFormViewModel, ignoreReadOnlyProperties: boolean, context = new Joove.DTOHelper()): void {
        if(original == null) return;

        this._hydrateSymbiosisMasterPageViewModel(original, ignoreReadOnlyProperties, context);

        if(original._key !== undefined) this._key = original._key;
        if(original._clientKey !== undefined) this._clientKey = original._clientKey;
        if(original._originalTypeClassName !== undefined) this._originalTypeClassName = original._originalTypeClassName;
        if(original._typeHash !== undefined) this._typeHash = original._typeHash;


        if(original.UnitOfMeasurement !== undefined) this.UnitOfMeasurement = UnitOfMeasurement_UnitOfMeasurementViewModel._initializeFrom(original.UnitOfMeasurement, ignoreReadOnlyProperties, context);

        this._reduceData = function(ignoreReadOnlyProperties: boolean) {
            var reduced = UnitOfMeasurementFormViewModel._initializeFrom(this, ignoreReadOnlyProperties);
            UnitOfMeasurementFormViewModel._deleteDropDownInitialValues(reduced);
            return reduced;
        };
    } /* end _initializeFrom() */


    public _reduceData(ignoreReadOnlyProperties: boolean): UnitOfMeasurementFormViewModel {
        var reduced = UnitOfMeasurementFormViewModel._initializeFrom(this, ignoreReadOnlyProperties);
        UnitOfMeasurementFormViewModel._deleteDropDownInitialValues(reduced);
        return reduced;
    }

    public static _deleteDropDownInitialValues(reduced: UnitOfMeasurementFormViewModel) {
        if (reduced == null) return;


        DigicircMatchmaking.ViewModels.SymbiosisMasterPage.SymbiosisMasterPageViewModel._deleteDropDownInitialValues(reduced);
    }
public UnitOfMeasurement:
    any;
}

export class UnitOfMeasurement_UnitOfMeasurementViewModel extends BaseClass.ViewModel  {
    public constructor() {
        super();
    }


    public static _lightCast(instance: any): any {
        if (instance == null) return;

        return instance;
    }

    public static _initializeFrom(original: UnitOfMeasurement_UnitOfMeasurementViewModel, ignoreReadOnlyProperties: boolean = false, context = new Joove.DTOHelper()): UnitOfMeasurement_UnitOfMeasurementViewModel {
        if(original == null) return null;
        // if (context.Has(original)) {
        //    return context.Get(original);
        // }
var result:
        UnitOfMeasurement_UnitOfMeasurementViewModel = new UnitOfMeasurement_UnitOfMeasurementViewModel();
        if (context != null && context.fillDb == true) {
            context.addToDb(original);
        }
        result._hydrateUnitOfMeasurement_UnitOfMeasurementViewModel(original, ignoreReadOnlyProperties, context);
        // context.Add(original, result);
        return result;
    }


    public _hydrateUnitOfMeasurement_UnitOfMeasurementViewModel(original: UnitOfMeasurement_UnitOfMeasurementViewModel, ignoreReadOnlyProperties: boolean, context = new Joove.DTOHelper()): void {
        if(original == null) return;


        if(original._key !== undefined) this._key = original._key;
        if(original._clientKey !== undefined) this._clientKey = original._clientKey;
        if(original._originalTypeClassName !== undefined) this._originalTypeClassName = original._originalTypeClassName;
        if(original._typeHash !== undefined) this._typeHash = original._typeHash;

        if(original.Id !== undefined) this.Id = original.Id;
        if(original.Code !== undefined) this.Code = original.Code;
        if(original.Value !== undefined) this.Value = original.Value;

        this._reduceData = function(ignoreReadOnlyProperties: boolean) {
            var reduced = UnitOfMeasurement_UnitOfMeasurementViewModel._initializeFrom(this, ignoreReadOnlyProperties);

            return reduced;
        };
    } /* end _initializeFrom() */


    public _reduceData(ignoreReadOnlyProperties: boolean): UnitOfMeasurement_UnitOfMeasurementViewModel {
        var reduced = UnitOfMeasurement_UnitOfMeasurementViewModel._initializeFrom(this, ignoreReadOnlyProperties);

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