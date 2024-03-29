// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
namespace DigicircMatchmaking.ViewModels.RegisterForm {
export class RegisterFormViewModel extends DigicircMatchmaking.ViewModels.MasterPageSignIn.MasterPageSignInViewModel {
    public constructor() {
        super();
    }


    public static _lightCast(instance: any): any {
        if (instance == null) return;

        if(instance.DigicircUser != null)
            instance.DigicircUser = DigicircUser_DigicircUserViewModel._lightCast(instance.DigicircUser);
        return instance;
    }

    public static _initializeFrom(original: RegisterFormViewModel, ignoreReadOnlyProperties: boolean = false, context = new Joove.DTOHelper()): RegisterFormViewModel {
        if(original == null) return null;
        // if (context.Has(original)) {
        //    return context.Get(original);
        // }
var result:
        RegisterFormViewModel = new RegisterFormViewModel();
        if (context != null && context.fillDb == true) {
            context.addToDb(original);
        }
        result._hydrateRegisterFormViewModel(original, ignoreReadOnlyProperties, context);
        // context.Add(original, result);
        return result;
    }


    public _hydrateRegisterFormViewModel(original: RegisterFormViewModel, ignoreReadOnlyProperties: boolean, context = new Joove.DTOHelper()): void {
        if(original == null) return;

        this._hydrateMasterPageSignInViewModel(original, ignoreReadOnlyProperties, context);

        if(original._key !== undefined) this._key = original._key;
        if(original._clientKey !== undefined) this._clientKey = original._clientKey;
        if(original._originalTypeClassName !== undefined) this._originalTypeClassName = original._originalTypeClassName;
        if(original._typeHash !== undefined) this._typeHash = original._typeHash;


        if(original.DigicircUser !== undefined) this.DigicircUser = DigicircUser_DigicircUserViewModel._initializeFrom(original.DigicircUser, ignoreReadOnlyProperties, context);
        if(original.Password !== undefined) this.Password = original.Password;
        if(original.RetypePassword !== undefined) this.RetypePassword = original.RetypePassword;
        if(original.UserName !== undefined) this.UserName = original.UserName;
        if(original.AcceptTerms !== undefined) this.AcceptTerms = original.AcceptTerms;
        if(original.FromMatching !== undefined) this.FromMatching = original.FromMatching;

        this._reduceData = function(ignoreReadOnlyProperties: boolean) {
            var reduced = RegisterFormViewModel._initializeFrom(this, ignoreReadOnlyProperties);
            RegisterFormViewModel._deleteDropDownInitialValues(reduced);
            return reduced;
        };
    } /* end _initializeFrom() */


    public _reduceData(ignoreReadOnlyProperties: boolean): RegisterFormViewModel {
        var reduced = RegisterFormViewModel._initializeFrom(this, ignoreReadOnlyProperties);
        RegisterFormViewModel._deleteDropDownInitialValues(reduced);
        return reduced;
    }

    public static _deleteDropDownInitialValues(reduced: RegisterFormViewModel) {
        if (reduced == null) return;


        DigicircMatchmaking.ViewModels.MasterPageSignIn.MasterPageSignInViewModel._deleteDropDownInitialValues(reduced);
    }
public DigicircUser:
    any;
public Password:
    any;
public RetypePassword:
    any;
public UserName:
    any;
public AcceptTerms:
    any;
public FromMatching:
    any;
}

export class DigicircUser_DigicircUserViewModel extends BaseClass.ViewModel  {
    public constructor() {
        super();
        this.Roles = new Array<any>();
        this.Permissions = new Array<any>();
    }


    public static _lightCast(instance: any): any {
        if (instance == null) return;


        if(instance.Roles != null) {
            for(let i = 0; i < instance.Roles.length; i++) {
                instance.Roles[i] = DigicircUser_DigicircUser_Roles_ApplicationRoleViewModel._lightCast(instance.Roles[i]);

            }
        }

        if(instance.Permissions != null) {
            for(let i = 0; i < instance.Permissions.length; i++) {
                instance.Permissions[i] = DigicircUser_DigicircUser_Permissions_ApplicationPermissionViewModel._lightCast(instance.Permissions[i]);

            }
        }
        return instance;
    }

    public static _initializeFrom(original: DigicircUser_DigicircUserViewModel, ignoreReadOnlyProperties: boolean = false, context = new Joove.DTOHelper()): DigicircUser_DigicircUserViewModel {
        if(original == null) return null;
        // if (context.Has(original)) {
        //    return context.Get(original);
        // }
var result:
        DigicircUser_DigicircUserViewModel = new DigicircUser_DigicircUserViewModel();
        if (context != null && context.fillDb == true) {
            context.addToDb(original);
        }
        result._hydrateDigicircUser_DigicircUserViewModel(original, ignoreReadOnlyProperties, context);
        // context.Add(original, result);
        return result;
    }


    public _hydrateDigicircUser_DigicircUserViewModel(original: DigicircUser_DigicircUserViewModel, ignoreReadOnlyProperties: boolean, context = new Joove.DTOHelper()): void {
        if(original == null) return;


        if(original._key !== undefined) this._key = original._key;
        if(original._clientKey !== undefined) this._clientKey = original._clientKey;
        if(original._originalTypeClassName !== undefined) this._originalTypeClassName = original._originalTypeClassName;
        if(original._typeHash !== undefined) this._typeHash = original._typeHash;

        if(original.Email !== undefined) this.Email = original.Email;
        if(original.FirstName !== undefined) this.FirstName = original.FirstName;
        if(original.LastName !== undefined) this.LastName = original.LastName;
        if(original.Name !== undefined) this.Name = original.Name;
        if(original.SubscribeToNewsLetter !== undefined) this.SubscribeToNewsLetter = original.SubscribeToNewsLetter;
        if(original.UserName !== undefined) this.UserName = original.UserName;

        if(original.Roles != null) {
            for(let i = 0; i < original.Roles.length; i++) {
                this.Roles.push(DigicircUser_DigicircUser_Roles_ApplicationRoleViewModel._initializeFrom(original.Roles[i], ignoreReadOnlyProperties, context));
            }
        }

        if(original.Permissions != null) {
            for(let i = 0; i < original.Permissions.length; i++) {
                this.Permissions.push(DigicircUser_DigicircUser_Permissions_ApplicationPermissionViewModel._initializeFrom(original.Permissions[i], ignoreReadOnlyProperties, context));
            }
        }

        this._reduceData = function(ignoreReadOnlyProperties: boolean) {
            var reduced = DigicircUser_DigicircUserViewModel._initializeFrom(this, ignoreReadOnlyProperties);

            return reduced;
        };
    } /* end _initializeFrom() */


    public _reduceData(ignoreReadOnlyProperties: boolean): DigicircUser_DigicircUserViewModel {
        var reduced = DigicircUser_DigicircUserViewModel._initializeFrom(this, ignoreReadOnlyProperties);

        return reduced;
    }
public Email:
    any;
public FirstName:
    any;
public LastName:
    any;
public Name:
    any;
public SubscribeToNewsLetter:
    any;
public UserName:
    any;
public Roles:
    Array<any>;
public Permissions:
    Array<any>;
}

export class DigicircUser_DigicircUser_Roles_ApplicationRoleViewModel extends BaseClass.ViewModel  {
    public constructor() {
        super();
    }


    public static _lightCast(instance: any): any {
        if (instance == null) return;

        return instance;
    }

    public static _initializeFrom(original: DigicircUser_DigicircUser_Roles_ApplicationRoleViewModel, ignoreReadOnlyProperties: boolean = false, context = new Joove.DTOHelper()): DigicircUser_DigicircUser_Roles_ApplicationRoleViewModel {
        if(original == null) return null;
        // if (context.Has(original)) {
        //    return context.Get(original);
        // }
var result:
        DigicircUser_DigicircUser_Roles_ApplicationRoleViewModel = new DigicircUser_DigicircUser_Roles_ApplicationRoleViewModel();
        if (context != null && context.fillDb == true) {
            context.addToDb(original);
        }
        result._hydrateDigicircUser_DigicircUser_Roles_ApplicationRoleViewModel(original, ignoreReadOnlyProperties, context);
        // context.Add(original, result);
        return result;
    }


    public _hydrateDigicircUser_DigicircUser_Roles_ApplicationRoleViewModel(original: DigicircUser_DigicircUser_Roles_ApplicationRoleViewModel, ignoreReadOnlyProperties: boolean, context = new Joove.DTOHelper()): void {
        if(original == null) return;


        if(original._key !== undefined) this._key = original._key;
        if(original._clientKey !== undefined) this._clientKey = original._clientKey;
        if(original._originalTypeClassName !== undefined) this._originalTypeClassName = original._originalTypeClassName;
        if(original._typeHash !== undefined) this._typeHash = original._typeHash;

        if (original._versionTimestamp !== undefined) this._versionTimestamp = original._versionTimestamp;
        if(original.Description !== undefined) this.Description = original.Description;
        if(original.Id !== undefined) this.Id = original.Id;
        if(original.IsCustom !== undefined) this.IsCustom = original.IsCustom;
        if(original.Name !== undefined) this.Name = original.Name;

        this._reduceData = function(ignoreReadOnlyProperties: boolean) {
            var reduced = DigicircUser_DigicircUser_Roles_ApplicationRoleViewModel._initializeFrom(this, ignoreReadOnlyProperties);

            return reduced;
        };
    } /* end _initializeFrom() */


    public _reduceData(ignoreReadOnlyProperties: boolean): DigicircUser_DigicircUser_Roles_ApplicationRoleViewModel {
        var reduced = DigicircUser_DigicircUser_Roles_ApplicationRoleViewModel._initializeFrom(this, ignoreReadOnlyProperties);

        return reduced;
    }
public Description:
    any;
public Id:
    any;
public IsCustom:
    any;
public Name:
    any;
    public _versionTimestamp?: string;
}

export class DigicircUser_DigicircUser_Permissions_ApplicationPermissionViewModel extends BaseClass.ViewModel  {
    public constructor() {
        super();
    }


    public static _lightCast(instance: any): any {
        if (instance == null) return;

        return instance;
    }

    public static _initializeFrom(original: DigicircUser_DigicircUser_Permissions_ApplicationPermissionViewModel, ignoreReadOnlyProperties: boolean = false, context = new Joove.DTOHelper()): DigicircUser_DigicircUser_Permissions_ApplicationPermissionViewModel {
        if(original == null) return null;
        // if (context.Has(original)) {
        //    return context.Get(original);
        // }
var result:
        DigicircUser_DigicircUser_Permissions_ApplicationPermissionViewModel = new DigicircUser_DigicircUser_Permissions_ApplicationPermissionViewModel();
        if (context != null && context.fillDb == true) {
            context.addToDb(original);
        }
        result._hydrateDigicircUser_DigicircUser_Permissions_ApplicationPermissionViewModel(original, ignoreReadOnlyProperties, context);
        // context.Add(original, result);
        return result;
    }


    public _hydrateDigicircUser_DigicircUser_Permissions_ApplicationPermissionViewModel(original: DigicircUser_DigicircUser_Permissions_ApplicationPermissionViewModel, ignoreReadOnlyProperties: boolean, context = new Joove.DTOHelper()): void {
        if(original == null) return;


        if(original._key !== undefined) this._key = original._key;
        if(original._clientKey !== undefined) this._clientKey = original._clientKey;
        if(original._originalTypeClassName !== undefined) this._originalTypeClassName = original._originalTypeClassName;
        if(original._typeHash !== undefined) this._typeHash = original._typeHash;

        if (original._versionTimestamp !== undefined) this._versionTimestamp = original._versionTimestamp;
        if(original.Id !== undefined) this.Id = original.Id;
        if(original.Name !== undefined) this.Name = original.Name;
        if(original.Description !== undefined) this.Description = original.Description;
        if(original.IsCustom !== undefined) this.IsCustom = original.IsCustom;

        this._reduceData = function(ignoreReadOnlyProperties: boolean) {
            var reduced = DigicircUser_DigicircUser_Permissions_ApplicationPermissionViewModel._initializeFrom(this, ignoreReadOnlyProperties);

            return reduced;
        };
    } /* end _initializeFrom() */


    public _reduceData(ignoreReadOnlyProperties: boolean): DigicircUser_DigicircUser_Permissions_ApplicationPermissionViewModel {
        var reduced = DigicircUser_DigicircUser_Permissions_ApplicationPermissionViewModel._initializeFrom(this, ignoreReadOnlyProperties);

        return reduced;
    }
public Id:
    any;
public Name:
    any;
public Description:
    any;
public IsCustom:
    any;
    public _versionTimestamp?: string;
}

}
