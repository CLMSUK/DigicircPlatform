// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
namespace DigicircMatchmaking.ViewModels.ActivitiesList {
export class ActivitiesListViewModel extends DigicircMatchmaking.ViewModels.MasterPage.MasterPageViewModel {
    public constructor() {
        super();
    }


    public static _lightCast(instance: any): any {
        if (instance == null) return;

        return instance;
    }

    public static _initializeFrom(original: ActivitiesListViewModel, ignoreReadOnlyProperties: boolean = false, context = new Joove.DTOHelper()): ActivitiesListViewModel {
        if(original == null) return null;
        // if (context.Has(original)) {
        //    return context.Get(original);
        // }
var result:
        ActivitiesListViewModel = new ActivitiesListViewModel();
        if (context != null && context.fillDb == true) {
            context.addToDb(original);
        }
        result._hydrateActivitiesListViewModel(original, ignoreReadOnlyProperties, context);
        // context.Add(original, result);
        return result;
    }


    public _hydrateActivitiesListViewModel(original: ActivitiesListViewModel, ignoreReadOnlyProperties: boolean, context = new Joove.DTOHelper()): void {
        if(original == null) return;

        this._hydrateMasterPageViewModel(original, ignoreReadOnlyProperties, context);

        if(original._key !== undefined) this._key = original._key;
        if(original._clientKey !== undefined) this._clientKey = original._clientKey;
        if(original._originalTypeClassName !== undefined) this._originalTypeClassName = original._originalTypeClassName;
        if(original._typeHash !== undefined) this._typeHash = original._typeHash;

        this.ActivitiesListSelectedItemKeys = original.ActivitiesListSelectedItemKeys;

        this._reduceData = function(ignoreReadOnlyProperties: boolean) {
            var reduced = ActivitiesListViewModel._initializeFrom(this, ignoreReadOnlyProperties);
            ActivitiesListViewModel._deleteDropDownInitialValues(reduced);
            return reduced;
        };
    } /* end _initializeFrom() */


    public _reduceData(ignoreReadOnlyProperties: boolean): ActivitiesListViewModel {
        var reduced = ActivitiesListViewModel._initializeFrom(this, ignoreReadOnlyProperties);
        ActivitiesListViewModel._deleteDropDownInitialValues(reduced);
        return reduced;
    }

    public static _deleteDropDownInitialValues(reduced: ActivitiesListViewModel) {
        if (reduced == null) return;


        DigicircMatchmaking.ViewModels.MasterPage.MasterPageViewModel._deleteDropDownInitialValues(reduced);
    }
public ActivitiesListSelectedItemKeys:
    any[];
}

}