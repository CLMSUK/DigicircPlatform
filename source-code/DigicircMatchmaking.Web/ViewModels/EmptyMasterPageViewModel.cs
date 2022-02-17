// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
using System;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using DigicircMatchmaking.BO;
using DigicircMatchmaking.UI.Controllers.EmptyMasterPage;
using AppCode;
using zAppDev.DotNet.Framework.Data;
using zAppDev.DotNet.Framework.Utilities;
using zAppDev.DotNet.Framework.Data.Domain;
using zAppDev.DotNet.Framework.Mvc;
using zAppDev.DotNet.Framework.Locales;
using System.ComponentModel.DataAnnotations;
namespace DigicircMatchmaking.UI.ViewModels.EmptyMasterPage
{
    public class EmptyMasterPageViewModel
    {


        public EmptyMasterPageViewModel()
        {
        }


        public virtual void Evict()
        {
            var manager = MiniSessionManager.Instance;
        }

    }


    [OriginalType(typeof(DigicircMatchmaking.UI.ViewModels.EmptyMasterPage.EmptyMasterPageViewModel))]
    public class EmptyMasterPageViewModelDTO : ViewModelDTOBase, IViewModelDTO<DigicircMatchmaking.UI.ViewModels.EmptyMasterPage.EmptyMasterPageViewModel>
    {

        [JsonConstructor]
        public EmptyMasterPageViewModelDTO() { }
        public EmptyMasterPageViewModelDTO(DigicircMatchmaking.UI.ViewModels.EmptyMasterPage.EmptyMasterPageViewModel original, bool parentIsDirty = false)
        {
            if (original == null) return;
        }
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.UI.ViewModels.EmptyMasterPage.EmptyMasterPageViewModel).FullName;

        public DigicircMatchmaking.UI.ViewModels.EmptyMasterPage.EmptyMasterPageViewModel GetModel()
        {
            var alreadySeenInstance = DTOHelper.GetSeenModelInstance<DigicircMatchmaking.UI.ViewModels.EmptyMasterPage.EmptyMasterPageViewModel>(_clientKey, _originalTypeClassName, _baseClasses);
            if (alreadySeenInstance != null) return alreadySeenInstance;
            return new DigicircMatchmaking.UI.ViewModels.EmptyMasterPage.EmptyMasterPageViewModel();
        }
        public DigicircMatchmaking.UI.ViewModels.EmptyMasterPage.EmptyMasterPageViewModel Convert()
        {
            var original = GetModel();
            if (original == null)
            {
                original = new DigicircMatchmaking.UI.ViewModels.EmptyMasterPage.EmptyMasterPageViewModel();
            }
            DTOHelper.UpdateSeenModelInstances(this, original);
            Hydrate(original);
            return original;
        }
        public void Hydrate(DigicircMatchmaking.UI.ViewModels.EmptyMasterPage.EmptyMasterPageViewModel original)
        {
            if (original == null) return;
        }
    }



}