// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
namespace DigicircMatchmaking.ViewModels.MyActors {
export class MyActorsViewModel extends DigicircMatchmaking.ViewModels.MasterPage.MasterPageViewModel {
    public constructor() {
        super();
    }


    public static _lightCast(instance: any): any {
        if (instance == null) return;

        if(instance.CurrentUser != null)
            instance.CurrentUser = CurrentUser_DigicircUserViewModel._lightCast(instance.CurrentUser);
        return instance;
    }

    public static _initializeFrom(original: MyActorsViewModel, ignoreReadOnlyProperties: boolean = false, context = new Joove.DTOHelper()): MyActorsViewModel {
        if(original == null) return null;
        // if (context.Has(original)) {
        //    return context.Get(original);
        // }
var result:
        MyActorsViewModel = new MyActorsViewModel();
        if (context != null && context.fillDb == true) {
            context.addToDb(original);
        }
        result._hydrateMyActorsViewModel(original, ignoreReadOnlyProperties, context);
        // context.Add(original, result);
        return result;
    }


    public _hydrateMyActorsViewModel(original: MyActorsViewModel, ignoreReadOnlyProperties: boolean, context = new Joove.DTOHelper()): void {
        if(original == null) return;

        this._hydrateMasterPageViewModel(original, ignoreReadOnlyProperties, context);

        if(original._key !== undefined) this._key = original._key;
        if(original._clientKey !== undefined) this._clientKey = original._clientKey;
        if(original._originalTypeClassName !== undefined) this._originalTypeClassName = original._originalTypeClassName;
        if(original._typeHash !== undefined) this._typeHash = original._typeHash;


        if(original.CurrentUser !== undefined) this.CurrentUser = CurrentUser_DigicircUserViewModel._initializeFrom(original.CurrentUser, ignoreReadOnlyProperties, context);
        this.ListActorDataSetSelectedItemKeys = original.ListActorDataSetSelectedItemKeys;

        this._reduceData = function(ignoreReadOnlyProperties: boolean) {
            var reduced = MyActorsViewModel._initializeFrom(this, ignoreReadOnlyProperties);
            MyActorsViewModel._deleteDropDownInitialValues(reduced);
            return reduced;
        };
    } /* end _initializeFrom() */


    public _reduceData(ignoreReadOnlyProperties: boolean): MyActorsViewModel {
        var reduced = MyActorsViewModel._initializeFrom(this, ignoreReadOnlyProperties);
        MyActorsViewModel._deleteDropDownInitialValues(reduced);
        return reduced;
    }

    public static _deleteDropDownInitialValues(reduced: MyActorsViewModel) {
        if (reduced == null) return;


        DigicircMatchmaking.ViewModels.MasterPage.MasterPageViewModel._deleteDropDownInitialValues(reduced);
    }
public CurrentUser:
    any;
public ListActorDataSetSelectedItemKeys:
    any[];
}

export class CurrentUser_DigicircUserViewModel extends BaseClass.ViewModel  {
    public constructor() {
        super();
    }


    public static _lightCast(instance: any): any {
        if (instance == null) return;

        if(instance.LockoutEndDate != null) instance.LockoutEndDate = new Date(instance.LockoutEndDate);
        return instance;
    }

    public static _initializeFrom(original: CurrentUser_DigicircUserViewModel, ignoreReadOnlyProperties: boolean = false, context = new Joove.DTOHelper()): CurrentUser_DigicircUserViewModel {
        if(original == null) return null;
        // if (context.Has(original)) {
        //    return context.Get(original);
        // }
var result:
        CurrentUser_DigicircUserViewModel = new CurrentUser_DigicircUserViewModel();
        if (context != null && context.fillDb == true) {
            context.addToDb(original);
        }
        result._hydrateCurrentUser_DigicircUserViewModel(original, ignoreReadOnlyProperties, context);
        // context.Add(original, result);
        return result;
    }


    public _hydrateCurrentUser_DigicircUserViewModel(original: CurrentUser_DigicircUserViewModel, ignoreReadOnlyProperties: boolean, context = new Joove.DTOHelper()): void {
        if(original == null) return;


        if(original._key !== undefined) this._key = original._key;
        if(original._clientKey !== undefined) this._clientKey = original._clientKey;
        if(original._originalTypeClassName !== undefined) this._originalTypeClassName = original._originalTypeClassName;
        if(original._typeHash !== undefined) this._typeHash = original._typeHash;

        if(original.UserName !== undefined) this.UserName = original.UserName;
        if(original.EmailConfirmed !== undefined) this.EmailConfirmed = original.EmailConfirmed;
        if(original.LockoutEnabled !== undefined) this.LockoutEnabled = original.LockoutEnabled;
        if(original.PhoneNumberConfirmed !== undefined) this.PhoneNumberConfirmed = original.PhoneNumberConfirmed;
        if(original.TwoFactorEnabled !== undefined) this.TwoFactorEnabled = original.TwoFactorEnabled;
        if(original.AccessFailedCount !== undefined) this.AccessFailedCount = original.AccessFailedCount;
        if(original.Name !== undefined) this.Name = original.Name;
        if(original.Email !== undefined) this.Email = original.Email;
        if(original.PhoneNumber !== undefined) this.PhoneNumber = original.PhoneNumber;
        if(!CLMS.Framework.String.IsNullOrEmpty(original.LockoutEndDate)) this.LockoutEndDate = new Date(original.LockoutEndDate);
        if(original.FirstName !== undefined) this.FirstName = original.FirstName;
        if(original.LastName !== undefined) this.LastName = original.LastName;
        if(original.SubscribeToNewsLetter !== undefined) this.SubscribeToNewsLetter = original.SubscribeToNewsLetter;

        this._reduceData = function(ignoreReadOnlyProperties: boolean) {
            var reduced = CurrentUser_DigicircUserViewModel._initializeFrom(this, ignoreReadOnlyProperties);

            return reduced;
        };
    } /* end _initializeFrom() */


    public _reduceData(ignoreReadOnlyProperties: boolean): CurrentUser_DigicircUserViewModel {
        var reduced = CurrentUser_DigicircUserViewModel._initializeFrom(this, ignoreReadOnlyProperties);

        return reduced;
    }
public UserName:
    any;
public EmailConfirmed:
    any;
public LockoutEnabled:
    any;
public PhoneNumberConfirmed:
    any;
public TwoFactorEnabled:
    any;
public AccessFailedCount:
    any;
public Name:
    any;
public Email:
    any;
public PhoneNumber:
    any;
public LockoutEndDate:
    any;
public FirstName:
    any;
public LastName:
    any;
public SubscribeToNewsLetter:
    any;
}

}
