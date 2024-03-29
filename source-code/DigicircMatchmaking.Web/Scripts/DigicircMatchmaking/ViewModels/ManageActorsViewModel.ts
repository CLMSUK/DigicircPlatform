// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
namespace DigicircMatchmaking.ViewModels.ManageActors {
export class ManageActorsViewModel extends DigicircMatchmaking.ViewModels.MasterPage.MasterPageViewModel {
    public constructor() {
        super();
    }


    public static _lightCast(instance: any): any {
        if (instance == null) return;

        if(instance.SelectedActor != null)
            instance.SelectedActor = SelectedActor_ActorViewModel._lightCast(instance.SelectedActor);
        return instance;
    }

    public static _initializeFrom(original: ManageActorsViewModel, ignoreReadOnlyProperties: boolean = false, context = new Joove.DTOHelper()): ManageActorsViewModel {
        if(original == null) return null;
        // if (context.Has(original)) {
        //    return context.Get(original);
        // }
var result:
        ManageActorsViewModel = new ManageActorsViewModel();
        if (context != null && context.fillDb == true) {
            context.addToDb(original);
        }
        result._hydrateManageActorsViewModel(original, ignoreReadOnlyProperties, context);
        // context.Add(original, result);
        return result;
    }


    public _hydrateManageActorsViewModel(original: ManageActorsViewModel, ignoreReadOnlyProperties: boolean, context = new Joove.DTOHelper()): void {
        if(original == null) return;

        this._hydrateMasterPageViewModel(original, ignoreReadOnlyProperties, context);

        if(original._key !== undefined) this._key = original._key;
        if(original._clientKey !== undefined) this._clientKey = original._clientKey;
        if(original._originalTypeClassName !== undefined) this._originalTypeClassName = original._originalTypeClassName;
        if(original._typeHash !== undefined) this._typeHash = original._typeHash;


        if(original.SelectedActor !== undefined) this.SelectedActor = SelectedActor_ActorViewModel._initializeFrom(original.SelectedActor, ignoreReadOnlyProperties, context);
        this.TableSelectedItemKeys = original.TableSelectedItemKeys;
        this.PartialViewPickListSelectedItemKeys = original.PartialViewPickListSelectedItemKeys;

        this._reduceData = function(ignoreReadOnlyProperties: boolean) {
            var reduced = ManageActorsViewModel._initializeFrom(this, ignoreReadOnlyProperties);
            ManageActorsViewModel._deleteDropDownInitialValues(reduced);
            return reduced;
        };
    } /* end _initializeFrom() */


    public _reduceData(ignoreReadOnlyProperties: boolean): ManageActorsViewModel {
        var reduced = ManageActorsViewModel._initializeFrom(this, ignoreReadOnlyProperties);
        ManageActorsViewModel._deleteDropDownInitialValues(reduced);
        return reduced;
    }

    public static _deleteDropDownInitialValues(reduced: ManageActorsViewModel) {
        if (reduced == null) return;


        DigicircMatchmaking.ViewModels.MasterPage.MasterPageViewModel._deleteDropDownInitialValues(reduced);
    }
public SelectedActor:
    any;
public TableSelectedItemKeys:
    any[];
public PartialViewPickListSelectedItemKeys:
    any[];
}

export class SelectedActor_ActorViewModel extends BaseClass.ViewModel  {
    public constructor() {
        super();
        this.Administrators = new Array<any>();
    }


    public static _lightCast(instance: any): any {
        if (instance == null) return;


        if(instance.Administrators != null) {
            for(let i = 0; i < instance.Administrators.length; i++) {
                instance.Administrators[i] = SelectedActor_Actor_Administrators_DigicircUserViewModel._lightCast(instance.Administrators[i]);

            }
        }
        return instance;
    }

    public static _initializeFrom(original: SelectedActor_ActorViewModel, ignoreReadOnlyProperties: boolean = false, context = new Joove.DTOHelper()): SelectedActor_ActorViewModel {
        if(original == null) return null;
        // if (context.Has(original)) {
        //    return context.Get(original);
        // }
var result:
        SelectedActor_ActorViewModel = new SelectedActor_ActorViewModel();
        if (context != null && context.fillDb == true) {
            context.addToDb(original);
        }
        result._hydrateSelectedActor_ActorViewModel(original, ignoreReadOnlyProperties, context);
        // context.Add(original, result);
        return result;
    }


    public _hydrateSelectedActor_ActorViewModel(original: SelectedActor_ActorViewModel, ignoreReadOnlyProperties: boolean, context = new Joove.DTOHelper()): void {
        if(original == null) return;


        if(original._key !== undefined) this._key = original._key;
        if(original._clientKey !== undefined) this._clientKey = original._clientKey;
        if(original._originalTypeClassName !== undefined) this._originalTypeClassName = original._originalTypeClassName;
        if(original._typeHash !== undefined) this._typeHash = original._typeHash;

        if (original._versionTimestamp !== undefined) this._versionTimestamp = original._versionTimestamp;
        if(original.Id !== undefined) this.Id = original.Id;
        if(original.Name !== undefined) this.Name = original.Name;
        if(original.Description !== undefined) this.Description = original.Description;
        if(original.ShortDescription !== undefined) this.ShortDescription = original.ShortDescription;
        if(original.Url !== undefined) this.Url = original.Url;
        if(original.Email !== undefined) this.Email = original.Email;
        if(original.SpecifiedEnityType !== undefined) this.SpecifiedEnityType = original.SpecifiedEnityType;
        if(original.MemberOfCluster !== undefined) this.MemberOfCluster = original.MemberOfCluster;
        if(original.GetCountOfClusterMembers !== undefined) this.GetCountOfClusterMembers = original.GetCountOfClusterMembers;
        if(original.ClusterName !== undefined) this.ClusterName = original.ClusterName;

        if(original.Administrators != null) {
            for(let i = 0; i < original.Administrators.length; i++) {
                this.Administrators.push(SelectedActor_Actor_Administrators_DigicircUserViewModel._initializeFrom(original.Administrators[i], ignoreReadOnlyProperties, context));
            }
        }

        this._reduceData = function(ignoreReadOnlyProperties: boolean) {
            var reduced = SelectedActor_ActorViewModel._initializeFrom(this, ignoreReadOnlyProperties);

            return reduced;
        };
    } /* end _initializeFrom() */


    public _reduceData(ignoreReadOnlyProperties: boolean): SelectedActor_ActorViewModel {
        var reduced = SelectedActor_ActorViewModel._initializeFrom(this, ignoreReadOnlyProperties);

        return reduced;
    }
public Id:
    any;
public Name:
    any;
public Description:
    any;
public ShortDescription:
    any;
public Url:
    any;
public Email:
    any;
public SpecifiedEnityType:
    any;
public MemberOfCluster:
    any;
public GetCountOfClusterMembers:
    any;
public ClusterName:
    any;
public Administrators:
    Array<any>;
    public _versionTimestamp?: string;
}

export class SelectedActor_Actor_Administrators_DigicircUserViewModel extends BaseClass.ViewModel  {
    public constructor() {
        super();
    }


    public static _lightCast(instance: any): any {
        if (instance == null) return;

        if(instance.LockoutEndDate != null) instance.LockoutEndDate = new Date(instance.LockoutEndDate);
        return instance;
    }

    public static _initializeFrom(original: SelectedActor_Actor_Administrators_DigicircUserViewModel, ignoreReadOnlyProperties: boolean = false, context = new Joove.DTOHelper()): SelectedActor_Actor_Administrators_DigicircUserViewModel {
        if(original == null) return null;
        // if (context.Has(original)) {
        //    return context.Get(original);
        // }
var result:
        SelectedActor_Actor_Administrators_DigicircUserViewModel = new SelectedActor_Actor_Administrators_DigicircUserViewModel();
        if (context != null && context.fillDb == true) {
            context.addToDb(original);
        }
        result._hydrateSelectedActor_Actor_Administrators_DigicircUserViewModel(original, ignoreReadOnlyProperties, context);
        // context.Add(original, result);
        return result;
    }


    public _hydrateSelectedActor_Actor_Administrators_DigicircUserViewModel(original: SelectedActor_Actor_Administrators_DigicircUserViewModel, ignoreReadOnlyProperties: boolean, context = new Joove.DTOHelper()): void {
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
            var reduced = SelectedActor_Actor_Administrators_DigicircUserViewModel._initializeFrom(this, ignoreReadOnlyProperties);

            return reduced;
        };
    } /* end _initializeFrom() */


    public _reduceData(ignoreReadOnlyProperties: boolean): SelectedActor_Actor_Administrators_DigicircUserViewModel {
        var reduced = SelectedActor_Actor_Administrators_DigicircUserViewModel._initializeFrom(this, ignoreReadOnlyProperties);

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
