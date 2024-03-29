// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
using System;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using DigicircMatchmaking.BO;
using DigicircMatchmaking.UI.Controllers.ForgotUsername;
using AppCode;
using zAppDev.DotNet.Framework.Data;
using zAppDev.DotNet.Framework.Utilities;
using zAppDev.DotNet.Framework.Data.Domain;
using zAppDev.DotNet.Framework.Mvc;
using zAppDev.DotNet.Framework.Locales;
using System.ComponentModel.DataAnnotations;
using DigicircMatchmaking.UI.ViewModels.MasterPageSignIn;
using DigicircMatchmaking.UI.Controllers.MasterPageSignIn;
namespace DigicircMatchmaking.UI.ViewModels.ForgotUsername
{
    public class ForgotUsernameViewModel : MasterPageSignInViewModel
    {
        public string txtEmail;
        public bool FromMatching;


        public ForgotUsernameViewModel()
        {
        }


        public override void Evict()
        {
            var manager = MiniSessionManager.Instance;
        }

    }


    [OriginalType(typeof(DigicircMatchmaking.UI.ViewModels.ForgotUsername.ForgotUsernameViewModel))]
    public class ForgotUsernameViewModelDTO : MasterPageSignInViewModelDTO, IViewModelDTO<DigicircMatchmaking.UI.ViewModels.ForgotUsername.ForgotUsernameViewModel>
    {

        [JsonConstructor]
        public ForgotUsernameViewModelDTO() { }
        public ForgotUsernameViewModelDTO(DigicircMatchmaking.UI.ViewModels.ForgotUsername.ForgotUsernameViewModel original, bool parentIsDirty = false)  : base(original)
        {
            if (original == null) return;
            txtEmail = original.txtEmail;
            FromMatching = original.FromMatching;
        }
        public string txtEmail;
        public bool FromMatching;
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.UI.ViewModels.ForgotUsername.ForgotUsernameViewModel).FullName;

        public new DigicircMatchmaking.UI.ViewModels.ForgotUsername.ForgotUsernameViewModel GetModel()
        {
            var alreadySeenInstance = DTOHelper.GetSeenModelInstance<DigicircMatchmaking.UI.ViewModels.ForgotUsername.ForgotUsernameViewModel>(_clientKey, _originalTypeClassName, _baseClasses);
            if (alreadySeenInstance != null) return alreadySeenInstance;
            return new DigicircMatchmaking.UI.ViewModels.ForgotUsername.ForgotUsernameViewModel();
        }
        new  public DigicircMatchmaking.UI.ViewModels.ForgotUsername.ForgotUsernameViewModel Convert()
        {
            var original = GetModel();
            if (original == null)
            {
                original = new DigicircMatchmaking.UI.ViewModels.ForgotUsername.ForgotUsernameViewModel();
            }
            DTOHelper.UpdateSeenModelInstances(this, original);
            Hydrate(original);
            return original;
        }
        public void Hydrate(DigicircMatchmaking.UI.ViewModels.ForgotUsername.ForgotUsernameViewModel original)
        {
            if (original == null) return;
            base.Hydrate(original);
            original.txtEmail = txtEmail;
            original.FromMatching = FromMatching;
        }
    }



}
