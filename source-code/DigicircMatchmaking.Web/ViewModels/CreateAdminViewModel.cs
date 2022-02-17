// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
using System;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using DigicircMatchmaking.BO;
using DigicircMatchmaking.UI.Controllers.CreateAdmin;
using AppCode;
using zAppDev.DotNet.Framework.Data;
using zAppDev.DotNet.Framework.Utilities;
using zAppDev.DotNet.Framework.Data.Domain;
using zAppDev.DotNet.Framework.Mvc;
using zAppDev.DotNet.Framework.Locales;
using System.ComponentModel.DataAnnotations;
using DigicircMatchmaking.UI.ViewModels.MasterPageSignIn;
using DigicircMatchmaking.UI.Controllers.MasterPageSignIn;
namespace DigicircMatchmaking.UI.ViewModels.CreateAdmin
{
    public class CreateAdminViewModel : MasterPageSignInViewModel
    {
        public string username;
        public string password;
        public string repeatPassword;
        public string email;


        public CreateAdminViewModel()
        {
        }


        public override void Evict()
        {
            var manager = MiniSessionManager.Instance;
        }

    }


    [OriginalType(typeof(DigicircMatchmaking.UI.ViewModels.CreateAdmin.CreateAdminViewModel))]
    public class CreateAdminViewModelDTO : MasterPageSignInViewModelDTO, IViewModelDTO<DigicircMatchmaking.UI.ViewModels.CreateAdmin.CreateAdminViewModel>
    {

        [JsonConstructor]
        public CreateAdminViewModelDTO() { }
        public CreateAdminViewModelDTO(DigicircMatchmaking.UI.ViewModels.CreateAdmin.CreateAdminViewModel original, bool parentIsDirty = false)  : base(original)
        {
            if (original == null) return;
            username = original.username;
            password = original.password;
            repeatPassword = original.repeatPassword;
            email = original.email;
        }
        public string username;
        public string password;
        public string repeatPassword;
        public string email;
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.UI.ViewModels.CreateAdmin.CreateAdminViewModel).FullName;

        public new DigicircMatchmaking.UI.ViewModels.CreateAdmin.CreateAdminViewModel GetModel()
        {
            var alreadySeenInstance = DTOHelper.GetSeenModelInstance<DigicircMatchmaking.UI.ViewModels.CreateAdmin.CreateAdminViewModel>(_clientKey, _originalTypeClassName, _baseClasses);
            if (alreadySeenInstance != null) return alreadySeenInstance;
            return new DigicircMatchmaking.UI.ViewModels.CreateAdmin.CreateAdminViewModel();
        }
        new  public DigicircMatchmaking.UI.ViewModels.CreateAdmin.CreateAdminViewModel Convert()
        {
            var original = GetModel();
            if (original == null)
            {
                original = new DigicircMatchmaking.UI.ViewModels.CreateAdmin.CreateAdminViewModel();
            }
            DTOHelper.UpdateSeenModelInstances(this, original);
            Hydrate(original);
            return original;
        }
        public void Hydrate(DigicircMatchmaking.UI.ViewModels.CreateAdmin.CreateAdminViewModel original)
        {
            if (original == null) return;
            base.Hydrate(original);
            original.username = username;
            original.password = password;
            original.repeatPassword = repeatPassword;
            original.email = email;
        }
    }



}
