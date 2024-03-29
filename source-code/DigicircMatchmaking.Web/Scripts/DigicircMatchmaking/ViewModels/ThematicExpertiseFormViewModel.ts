// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
namespace DigicircMatchmaking.ViewModels.ThematicExpertiseForm {
export class ThematicExpertiseFormViewModel extends DigicircMatchmaking.ViewModels.MasterPage.MasterPageViewModel {
    public constructor() {
        super();
    }


    public static _lightCast(instance: any): any {
        if (instance == null) return;

        if(instance.ThematicExpertise != null)
            instance.ThematicExpertise = ThematicExpertise_ThematicExpertiseViewModel._lightCast(instance.ThematicExpertise);
        return instance;
    }

    public static _initializeFrom(original: ThematicExpertiseFormViewModel, ignoreReadOnlyProperties: boolean = false, context = new Joove.DTOHelper()): ThematicExpertiseFormViewModel {
        if(original == null) return null;
        // if (context.Has(original)) {
        //    return context.Get(original);
        // }
var result:
        ThematicExpertiseFormViewModel = new ThematicExpertiseFormViewModel();
        if (context != null && context.fillDb == true) {
            context.addToDb(original);
        }
        result._hydrateThematicExpertiseFormViewModel(original, ignoreReadOnlyProperties, context);
        // context.Add(original, result);
        return result;
    }


    public _hydrateThematicExpertiseFormViewModel(original: ThematicExpertiseFormViewModel, ignoreReadOnlyProperties: boolean, context = new Joove.DTOHelper()): void {
        if(original == null) return;

        this._hydrateMasterPageViewModel(original, ignoreReadOnlyProperties, context);

        if(original._key !== undefined) this._key = original._key;
        if(original._clientKey !== undefined) this._clientKey = original._clientKey;
        if(original._originalTypeClassName !== undefined) this._originalTypeClassName = original._originalTypeClassName;
        if(original._typeHash !== undefined) this._typeHash = original._typeHash;


        if(original.ThematicExpertise !== undefined) this.ThematicExpertise = ThematicExpertise_ThematicExpertiseViewModel._initializeFrom(original.ThematicExpertise, ignoreReadOnlyProperties, context);

        this._reduceData = function(ignoreReadOnlyProperties: boolean) {
            var reduced = ThematicExpertiseFormViewModel._initializeFrom(this, ignoreReadOnlyProperties);
            ThematicExpertiseFormViewModel._deleteDropDownInitialValues(reduced);
            return reduced;
        };
    } /* end _initializeFrom() */


    public _reduceData(ignoreReadOnlyProperties: boolean): ThematicExpertiseFormViewModel {
        var reduced = ThematicExpertiseFormViewModel._initializeFrom(this, ignoreReadOnlyProperties);
        ThematicExpertiseFormViewModel._deleteDropDownInitialValues(reduced);
        return reduced;
    }

    public static _deleteDropDownInitialValues(reduced: ThematicExpertiseFormViewModel) {
        if (reduced == null) return;


        DigicircMatchmaking.ViewModels.MasterPage.MasterPageViewModel._deleteDropDownInitialValues(reduced);
    }
public ThematicExpertise:
    any;
}

export class ThematicExpertise_ThematicExpertiseViewModel extends BaseClass.ViewModel  {
    public constructor() {
        super();
    }


    public static _lightCast(instance: any): any {
        if (instance == null) return;

        return instance;
    }

    public static _initializeFrom(original: ThematicExpertise_ThematicExpertiseViewModel, ignoreReadOnlyProperties: boolean = false, context = new Joove.DTOHelper()): ThematicExpertise_ThematicExpertiseViewModel {
        if(original == null) return null;
        // if (context.Has(original)) {
        //    return context.Get(original);
        // }
var result:
        ThematicExpertise_ThematicExpertiseViewModel = new ThematicExpertise_ThematicExpertiseViewModel();
        if (context != null && context.fillDb == true) {
            context.addToDb(original);
        }
        result._hydrateThematicExpertise_ThematicExpertiseViewModel(original, ignoreReadOnlyProperties, context);
        // context.Add(original, result);
        return result;
    }


    public _hydrateThematicExpertise_ThematicExpertiseViewModel(original: ThematicExpertise_ThematicExpertiseViewModel, ignoreReadOnlyProperties: boolean, context = new Joove.DTOHelper()): void {
        if(original == null) return;


        if(original._key !== undefined) this._key = original._key;
        if(original._clientKey !== undefined) this._clientKey = original._clientKey;
        if(original._originalTypeClassName !== undefined) this._originalTypeClassName = original._originalTypeClassName;
        if(original._typeHash !== undefined) this._typeHash = original._typeHash;

        if(original.Id !== undefined) this.Id = original.Id;
        if(original.Code !== undefined) this.Code = original.Code;
        if(original.Value !== undefined) this.Value = original.Value;

        this._reduceData = function(ignoreReadOnlyProperties: boolean) {
            var reduced = ThematicExpertise_ThematicExpertiseViewModel._initializeFrom(this, ignoreReadOnlyProperties);

            return reduced;
        };
    } /* end _initializeFrom() */


    public _reduceData(ignoreReadOnlyProperties: boolean): ThematicExpertise_ThematicExpertiseViewModel {
        var reduced = ThematicExpertise_ThematicExpertiseViewModel._initializeFrom(this, ignoreReadOnlyProperties);

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
