// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
using System;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using DigicircMatchmaking.BO;
using DigicircMatchmaking.UI.Controllers.UnderContructionPage;
using AppCode;
using zAppDev.DotNet.Framework.Data;
using zAppDev.DotNet.Framework.Utilities;
using zAppDev.DotNet.Framework.Data.Domain;
using zAppDev.DotNet.Framework.Mvc;
using zAppDev.DotNet.Framework.Locales;
using System.ComponentModel.DataAnnotations;
using DigicircMatchmaking.UI.ViewModels.MasterPageSignIn;
using DigicircMatchmaking.UI.Controllers.MasterPageSignIn;
namespace DigicircMatchmaking.UI.ViewModels.UnderContructionPage
{
    public class UnderContructionPageViewModel : MasterPageSignInViewModel
    {


        public UnderContructionPageViewModel()
        {
        }


        public override void Evict()
        {
            var manager = MiniSessionManager.Instance;
        }

    }


    [OriginalType(typeof(DigicircMatchmaking.UI.ViewModels.UnderContructionPage.UnderContructionPageViewModel))]
    public class UnderContructionPageViewModelDTO : MasterPageSignInViewModelDTO, IViewModelDTO<DigicircMatchmaking.UI.ViewModels.UnderContructionPage.UnderContructionPageViewModel>
    {

        [JsonConstructor]
        public UnderContructionPageViewModelDTO() { }
        public UnderContructionPageViewModelDTO(DigicircMatchmaking.UI.ViewModels.UnderContructionPage.UnderContructionPageViewModel original, bool parentIsDirty = false)  : base(original)
        {
            if (original == null) return;
        }
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.UI.ViewModels.UnderContructionPage.UnderContructionPageViewModel).FullName;

        public new DigicircMatchmaking.UI.ViewModels.UnderContructionPage.UnderContructionPageViewModel GetModel()
        {
            var alreadySeenInstance = DTOHelper.GetSeenModelInstance<DigicircMatchmaking.UI.ViewModels.UnderContructionPage.UnderContructionPageViewModel>(_clientKey, _originalTypeClassName, _baseClasses);
            if (alreadySeenInstance != null) return alreadySeenInstance;
            return new DigicircMatchmaking.UI.ViewModels.UnderContructionPage.UnderContructionPageViewModel();
        }
        new  public DigicircMatchmaking.UI.ViewModels.UnderContructionPage.UnderContructionPageViewModel Convert()
        {
            var original = GetModel();
            if (original == null)
            {
                original = new DigicircMatchmaking.UI.ViewModels.UnderContructionPage.UnderContructionPageViewModel();
            }
            DTOHelper.UpdateSeenModelInstances(this, original);
            Hydrate(original);
            return original;
        }
        public void Hydrate(DigicircMatchmaking.UI.ViewModels.UnderContructionPage.UnderContructionPageViewModel original)
        {
            if (original == null) return;
            base.Hydrate(original);
        }
    }



}
