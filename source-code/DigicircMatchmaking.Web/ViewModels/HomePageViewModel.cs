// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
using System;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using DigicircMatchmaking.BO;
using DigicircMatchmaking.UI.Controllers.HomePage;
using AppCode;
using zAppDev.DotNet.Framework.Data;
using zAppDev.DotNet.Framework.Utilities;
using zAppDev.DotNet.Framework.Data.Domain;
using zAppDev.DotNet.Framework.Mvc;
using zAppDev.DotNet.Framework.Locales;
using System.ComponentModel.DataAnnotations;
using DigicircMatchmaking.UI.ViewModels.MasterPage;
using DigicircMatchmaking.UI.Controllers.MasterPage;
namespace DigicircMatchmaking.UI.ViewModels.HomePage
{
    public class HomePageViewModel : MasterPageViewModel
    {


        public HomePageViewModel()
        {
        }


        public override void Evict()
        {
            var manager = MiniSessionManager.Instance;
        }

    }


    [OriginalType(typeof(DigicircMatchmaking.UI.ViewModels.HomePage.HomePageViewModel))]
    public class HomePageViewModelDTO : MasterPageViewModelDTO, IViewModelDTO<DigicircMatchmaking.UI.ViewModels.HomePage.HomePageViewModel>
    {

        [JsonConstructor]
        public HomePageViewModelDTO() { }
        public HomePageViewModelDTO(DigicircMatchmaking.UI.ViewModels.HomePage.HomePageViewModel original, bool parentIsDirty = false)  : base(original)
        {
            if (original == null) return;
        }
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.UI.ViewModels.HomePage.HomePageViewModel).FullName;

        public new DigicircMatchmaking.UI.ViewModels.HomePage.HomePageViewModel GetModel()
        {
            var alreadySeenInstance = DTOHelper.GetSeenModelInstance<DigicircMatchmaking.UI.ViewModels.HomePage.HomePageViewModel>(_clientKey, _originalTypeClassName, _baseClasses);
            if (alreadySeenInstance != null) return alreadySeenInstance;
            return new DigicircMatchmaking.UI.ViewModels.HomePage.HomePageViewModel();
        }
        new  public DigicircMatchmaking.UI.ViewModels.HomePage.HomePageViewModel Convert()
        {
            var original = GetModel();
            if (original == null)
            {
                original = new DigicircMatchmaking.UI.ViewModels.HomePage.HomePageViewModel();
            }
            DTOHelper.UpdateSeenModelInstances(this, original);
            Hydrate(original);
            return original;
        }
        public void Hydrate(DigicircMatchmaking.UI.ViewModels.HomePage.HomePageViewModel original)
        {
            if (original == null) return;
            base.Hydrate(original);
        }
    }



}
