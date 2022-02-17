// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
using System;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using DigicircMatchmaking.BO;
using DigicircMatchmaking.UI.Controllers.ApplicationSettingForm;
using AppCode;
using zAppDev.DotNet.Framework.Data;
using zAppDev.DotNet.Framework.Utilities;
using zAppDev.DotNet.Framework.Data.Domain;
using zAppDev.DotNet.Framework.Mvc;
using zAppDev.DotNet.Framework.Locales;
using System.ComponentModel.DataAnnotations;
using DigicircMatchmaking.UI.ViewModels.MasterPageForSlide;
using DigicircMatchmaking.UI.Controllers.MasterPageForSlide;
namespace DigicircMatchmaking.UI.ViewModels.ApplicationSettingForm
{
    public class ApplicationSettingFormViewModel : MasterPageForSlideViewModel
    {
        public zAppDev.DotNet.Framework.Identity.Model.ApplicationSetting ApplicationSetting;


        public ApplicationSettingFormViewModel()
        {
            ApplicationSetting = new zAppDev.DotNet.Framework.Identity.Model.ApplicationSetting();
        }


        public override void Evict()
        {
            var manager = MiniSessionManager.Instance;
            if (manager.Session.Contains(ApplicationSetting))
            {
                manager.Session.Evict(ApplicationSetting);
            }
        }

    }


    [OriginalType(typeof(DigicircMatchmaking.UI.ViewModels.ApplicationSettingForm.ApplicationSettingFormViewModel))]
    public class ApplicationSettingFormViewModelDTO : MasterPageForSlideViewModelDTO, IViewModelDTO<DigicircMatchmaking.UI.ViewModels.ApplicationSettingForm.ApplicationSettingFormViewModel>
    {

        [JsonConstructor]
        public ApplicationSettingFormViewModelDTO() { }
        public ApplicationSettingFormViewModelDTO(DigicircMatchmaking.UI.ViewModels.ApplicationSettingForm.ApplicationSettingFormViewModel original, bool parentIsDirty = false)  : base(original)
        {
            if (original == null) return;
            ApplicationSetting = original.ApplicationSetting == null ? null : new ApplicationSetting_ApplicationSettingDTO(original.ApplicationSetting);
        }
        public ApplicationSetting_ApplicationSettingDTO ApplicationSetting;
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.UI.ViewModels.ApplicationSettingForm.ApplicationSettingFormViewModel).FullName;

        public new DigicircMatchmaking.UI.ViewModels.ApplicationSettingForm.ApplicationSettingFormViewModel GetModel()
        {
            var alreadySeenInstance = DTOHelper.GetSeenModelInstance<DigicircMatchmaking.UI.ViewModels.ApplicationSettingForm.ApplicationSettingFormViewModel>(_clientKey, _originalTypeClassName, _baseClasses);
            if (alreadySeenInstance != null) return alreadySeenInstance;
            return new DigicircMatchmaking.UI.ViewModels.ApplicationSettingForm.ApplicationSettingFormViewModel();
        }
        new  public DigicircMatchmaking.UI.ViewModels.ApplicationSettingForm.ApplicationSettingFormViewModel Convert()
        {
            var original = GetModel();
            if (original == null)
            {
                original = new DigicircMatchmaking.UI.ViewModels.ApplicationSettingForm.ApplicationSettingFormViewModel();
            }
            DTOHelper.UpdateSeenModelInstances(this, original);
            Hydrate(original);
            return original;
        }
        public void Hydrate(DigicircMatchmaking.UI.ViewModels.ApplicationSettingForm.ApplicationSettingFormViewModel original)
        {
            if (original == null) return;
            base.Hydrate(original);
            original.ApplicationSetting = ApplicationSetting == null
                                          ? null
                                          : ApplicationSetting.Convert();
        }
    }

    [OriginalType(typeof(zAppDev.DotNet.Framework.Identity.Model.ApplicationSetting))]
    public class ApplicationSetting_ApplicationSettingDTO : ViewModelDTOBase, IViewModelDTO<zAppDev.DotNet.Framework.Identity.Model.ApplicationSetting>
    {

        [JsonConstructor]
        public ApplicationSetting_ApplicationSettingDTO() { }
        public ApplicationSetting_ApplicationSettingDTO(zAppDev.DotNet.Framework.Identity.Model.ApplicationSetting original, bool parentIsDirty = false)
        {
            if (original == null) return;
            _key = original.Id as object;
            Id = original.Id;
            IsCustom = original.IsCustom;
            Key = original.Key;
            Value = original.Value;
            if (original.VersionTimestamp != null)
            {
                _versionTimestamp = original.VersionTimestamp.ToString();
            }
            _clientKey = DTOHelper.GetClientKey(original, Id);
        }
        public int? Id;
        public new object _key
        {
            get;
            set;
        }
        public bool IsCustom;
        public string Key;
        public string Value;
        public string _versionTimestamp;
        public override string _originalTypeClassName => typeof(zAppDev.DotNet.Framework.Identity.Model.ApplicationSetting).FullName;
        public override List<string> _baseClasses => null;
        public zAppDev.DotNet.Framework.Identity.Model.ApplicationSetting GetModel()
        {
            var alreadySeenInstance = DTOHelper.GetSeenModelInstance<zAppDev.DotNet.Framework.Identity.Model.ApplicationSetting>(_clientKey, _originalTypeClassName, _baseClasses);
            if (alreadySeenInstance != null) return alreadySeenInstance;
            if (_key == null) return null;
            var rawKey = _key.ToString();
            var parsedKey = int.Parse(rawKey);
            if (parsedKey == default(int) || Equals(parsedKey, default(int)))
            {
                return new zAppDev.DotNet.Framework.Identity.Model.ApplicationSetting();
            }
            return new DAL.Repository().GetById<zAppDev.DotNet.Framework.Identity.Model.ApplicationSetting>(parsedKey, false, false);
        }
        public zAppDev.DotNet.Framework.Identity.Model.ApplicationSetting Convert()
        {
            var original = GetModel();
            if (original == null)
            {
                original = new zAppDev.DotNet.Framework.Identity.Model.ApplicationSetting();
            }
            DTOHelper.UpdateSeenModelInstances(this, original);
            Hydrate(original);
            return original;
        }
        public void Hydrate(zAppDev.DotNet.Framework.Identity.Model.ApplicationSetting original)
        {
            if (original == null) return;
            original.Id = Id ?? 0;
            original.IsCustom = IsCustom;
            original.Key = Key;
            original.Value = Value;
            if (string.IsNullOrEmpty(this._versionTimestamp))
                original.VersionTimestamp = 1;
            else
                original.VersionTimestamp = Int32.Parse(this._versionTimestamp);
        }
        public static ApplicationSetting_ApplicationSettingDTO GetInstance(object key, string jbID)
        {
            if (key == null) return null;
            var rawKey = key.ToString();
            var parsedKey = int.Parse(rawKey);
            var foundEntry = new DAL.Repository().GetById<zAppDev.DotNet.Framework.Identity.Model.ApplicationSetting>(parsedKey, true, false);
            if(foundEntry != null)
            {
                return new ApplicationSetting_ApplicationSettingDTO(foundEntry);
            }
            return null;
        }
    }



}
