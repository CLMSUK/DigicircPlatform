// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
namespace DigicircMatchmaking.ViewModels.ApplicationSettingForm {
export class ApplicationSettingFormViewModel extends DigicircMatchmaking.ViewModels.MasterPageForSlide.MasterPageForSlideViewModel {
    public constructor() {
        super();
    }


    public static _lightCast(instance: any): any {
        if (instance == null) return;

        if(instance.ApplicationSetting != null)
            instance.ApplicationSetting = ApplicationSetting_ApplicationSettingViewModel._lightCast(instance.ApplicationSetting);
        return instance;
    }

    public static _initializeFrom(original: ApplicationSettingFormViewModel, ignoreReadOnlyProperties: boolean = false, context = new Joove.DTOHelper()): ApplicationSettingFormViewModel {
        if(original == null) return null;
        // if (context.Has(original)) {
        //    return context.Get(original);
        // }
var result:
        ApplicationSettingFormViewModel = new ApplicationSettingFormViewModel();
        if (context != null && context.fillDb == true) {
            context.addToDb(original);
        }
        result._hydrateApplicationSettingFormViewModel(original, ignoreReadOnlyProperties, context);
        // context.Add(original, result);
        return result;
    }


    public _hydrateApplicationSettingFormViewModel(original: ApplicationSettingFormViewModel, ignoreReadOnlyProperties: boolean, context = new Joove.DTOHelper()): void {
        if(original == null) return;

        this._hydrateMasterPageForSlideViewModel(original, ignoreReadOnlyProperties, context);

        if(original._key !== undefined) this._key = original._key;
        if(original._clientKey !== undefined) this._clientKey = original._clientKey;
        if(original._originalTypeClassName !== undefined) this._originalTypeClassName = original._originalTypeClassName;
        if(original._typeHash !== undefined) this._typeHash = original._typeHash;


        if(original.ApplicationSetting !== undefined) this.ApplicationSetting = ApplicationSetting_ApplicationSettingViewModel._initializeFrom(original.ApplicationSetting, ignoreReadOnlyProperties, context);

        this._reduceData = function(ignoreReadOnlyProperties: boolean) {
            var reduced = ApplicationSettingFormViewModel._initializeFrom(this, ignoreReadOnlyProperties);
            ApplicationSettingFormViewModel._deleteDropDownInitialValues(reduced);
            return reduced;
        };
    } /* end _initializeFrom() */


    public _reduceData(ignoreReadOnlyProperties: boolean): ApplicationSettingFormViewModel {
        var reduced = ApplicationSettingFormViewModel._initializeFrom(this, ignoreReadOnlyProperties);
        ApplicationSettingFormViewModel._deleteDropDownInitialValues(reduced);
        return reduced;
    }

    public static _deleteDropDownInitialValues(reduced: ApplicationSettingFormViewModel) {
        if (reduced == null) return;


        DigicircMatchmaking.ViewModels.MasterPageForSlide.MasterPageForSlideViewModel._deleteDropDownInitialValues(reduced);
    }
public ApplicationSetting:
    any;
}

export class ApplicationSetting_ApplicationSettingViewModel extends BaseClass.ViewModel  {
    public constructor() {
        super();
    }


    public static _lightCast(instance: any): any {
        if (instance == null) return;

        return instance;
    }

    public static _initializeFrom(original: ApplicationSetting_ApplicationSettingViewModel, ignoreReadOnlyProperties: boolean = false, context = new Joove.DTOHelper()): ApplicationSetting_ApplicationSettingViewModel {
        if(original == null) return null;
        // if (context.Has(original)) {
        //    return context.Get(original);
        // }
var result:
        ApplicationSetting_ApplicationSettingViewModel = new ApplicationSetting_ApplicationSettingViewModel();
        if (context != null && context.fillDb == true) {
            context.addToDb(original);
        }
        result._hydrateApplicationSetting_ApplicationSettingViewModel(original, ignoreReadOnlyProperties, context);
        // context.Add(original, result);
        return result;
    }


    public _hydrateApplicationSetting_ApplicationSettingViewModel(original: ApplicationSetting_ApplicationSettingViewModel, ignoreReadOnlyProperties: boolean, context = new Joove.DTOHelper()): void {
        if(original == null) return;


        if(original._key !== undefined) this._key = original._key;
        if(original._clientKey !== undefined) this._clientKey = original._clientKey;
        if(original._originalTypeClassName !== undefined) this._originalTypeClassName = original._originalTypeClassName;
        if(original._typeHash !== undefined) this._typeHash = original._typeHash;

        if (original._versionTimestamp !== undefined) this._versionTimestamp = original._versionTimestamp;
        if(original.Id !== undefined) this.Id = original.Id;
        if(original.IsCustom !== undefined) this.IsCustom = original.IsCustom;
        if(original.Key !== undefined) this.Key = original.Key;
        if(original.Value !== undefined) this.Value = original.Value;

        this._reduceData = function(ignoreReadOnlyProperties: boolean) {
            var reduced = ApplicationSetting_ApplicationSettingViewModel._initializeFrom(this, ignoreReadOnlyProperties);

            return reduced;
        };
    } /* end _initializeFrom() */


    public _reduceData(ignoreReadOnlyProperties: boolean): ApplicationSetting_ApplicationSettingViewModel {
        var reduced = ApplicationSetting_ApplicationSettingViewModel._initializeFrom(this, ignoreReadOnlyProperties);

        return reduced;
    }
public Id:
    any;
public IsCustom:
    any;
public Key:
    any;
public Value:
    any;
    public _versionTimestamp?: string;
}

}
