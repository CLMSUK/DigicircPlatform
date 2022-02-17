// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
namespace DigicircMatchmaking.ViewModels.ForgotPassword {
export class ForgotPasswordViewModel extends DigicircMatchmaking.ViewModels.MasterPageSignIn.MasterPageSignInViewModel {
    public constructor() {
        super();
    }


    public static _lightCast(instance: any): any {
        if (instance == null) return;

        return instance;
    }

    public static _initializeFrom(original: ForgotPasswordViewModel, ignoreReadOnlyProperties: boolean = false, context = new Joove.DTOHelper()): ForgotPasswordViewModel {
        if(original == null) return null;
        // if (context.Has(original)) {
        //    return context.Get(original);
        // }
var result:
        ForgotPasswordViewModel = new ForgotPasswordViewModel();
        if (context != null && context.fillDb == true) {
            context.addToDb(original);
        }
        result._hydrateForgotPasswordViewModel(original, ignoreReadOnlyProperties, context);
        // context.Add(original, result);
        return result;
    }


    public _hydrateForgotPasswordViewModel(original: ForgotPasswordViewModel, ignoreReadOnlyProperties: boolean, context = new Joove.DTOHelper()): void {
        if(original == null) return;

        this._hydrateMasterPageSignInViewModel(original, ignoreReadOnlyProperties, context);

        if(original._key !== undefined) this._key = original._key;
        if(original._clientKey !== undefined) this._clientKey = original._clientKey;
        if(original._originalTypeClassName !== undefined) this._originalTypeClassName = original._originalTypeClassName;
        if(original._typeHash !== undefined) this._typeHash = original._typeHash;

        if(original.txtUsername !== undefined) this.txtUsername = original.txtUsername;
        if(original.FromMatching !== undefined) this.FromMatching = original.FromMatching;

        this._reduceData = function(ignoreReadOnlyProperties: boolean) {
            var reduced = ForgotPasswordViewModel._initializeFrom(this, ignoreReadOnlyProperties);
            ForgotPasswordViewModel._deleteDropDownInitialValues(reduced);
            return reduced;
        };
    } /* end _initializeFrom() */


    public _reduceData(ignoreReadOnlyProperties: boolean): ForgotPasswordViewModel {
        var reduced = ForgotPasswordViewModel._initializeFrom(this, ignoreReadOnlyProperties);
        ForgotPasswordViewModel._deleteDropDownInitialValues(reduced);
        return reduced;
    }

    public static _deleteDropDownInitialValues(reduced: ForgotPasswordViewModel) {
        if (reduced == null) return;


        DigicircMatchmaking.ViewModels.MasterPageSignIn.MasterPageSignInViewModel._deleteDropDownInitialValues(reduced);
    }
public txtUsername:
    any;
public FromMatching:
    any;
}

}
