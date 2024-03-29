// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
using System;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using DigicircMatchmaking.BO;
using DigicircMatchmaking.UI.Controllers.ActivitiesForm;
using AppCode;
using zAppDev.DotNet.Framework.Data;
using zAppDev.DotNet.Framework.Utilities;
using zAppDev.DotNet.Framework.Data.Domain;
using zAppDev.DotNet.Framework.Mvc;
using zAppDev.DotNet.Framework.Locales;
using System.ComponentModel.DataAnnotations;
using DigicircMatchmaking.UI.ViewModels.MasterPage;
using DigicircMatchmaking.UI.Controllers.MasterPage;
namespace DigicircMatchmaking.UI.ViewModels.ActivitiesForm
{
    public class ActivitiesFormViewModel : MasterPageViewModel
    {
        public DigicircMatchmaking.BO.Activities Activities;


        public ActivitiesFormViewModel()
        {
            Activities = new DigicircMatchmaking.BO.Activities();
        }


        public override void Evict()
        {
            var manager = MiniSessionManager.Instance;
            if (manager.Session.Contains(Activities))
            {
                manager.Session.Evict(Activities);
            }
        }

    }


    [OriginalType(typeof(DigicircMatchmaking.UI.ViewModels.ActivitiesForm.ActivitiesFormViewModel))]
    public class ActivitiesFormViewModelDTO : MasterPageViewModelDTO, IViewModelDTO<DigicircMatchmaking.UI.ViewModels.ActivitiesForm.ActivitiesFormViewModel>
    {

        [JsonConstructor]
        public ActivitiesFormViewModelDTO() { }
        public ActivitiesFormViewModelDTO(DigicircMatchmaking.UI.ViewModels.ActivitiesForm.ActivitiesFormViewModel original, bool parentIsDirty = false)  : base(original)
        {
            if (original == null) return;
            Activities = original.Activities == null ? null : new Activities_ActivitiesDTO(original.Activities);
        }
        public Activities_ActivitiesDTO Activities;
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.UI.ViewModels.ActivitiesForm.ActivitiesFormViewModel).FullName;

        public new DigicircMatchmaking.UI.ViewModels.ActivitiesForm.ActivitiesFormViewModel GetModel()
        {
            var alreadySeenInstance = DTOHelper.GetSeenModelInstance<DigicircMatchmaking.UI.ViewModels.ActivitiesForm.ActivitiesFormViewModel>(_clientKey, _originalTypeClassName, _baseClasses);
            if (alreadySeenInstance != null) return alreadySeenInstance;
            return new DigicircMatchmaking.UI.ViewModels.ActivitiesForm.ActivitiesFormViewModel();
        }
        new  public DigicircMatchmaking.UI.ViewModels.ActivitiesForm.ActivitiesFormViewModel Convert()
        {
            var original = GetModel();
            if (original == null)
            {
                original = new DigicircMatchmaking.UI.ViewModels.ActivitiesForm.ActivitiesFormViewModel();
            }
            DTOHelper.UpdateSeenModelInstances(this, original);
            Hydrate(original);
            return original;
        }
        public void Hydrate(DigicircMatchmaking.UI.ViewModels.ActivitiesForm.ActivitiesFormViewModel original)
        {
            if (original == null) return;
            base.Hydrate(original);
            original.Activities = Activities == null
                                  ? null
                                  : Activities.Convert();
        }
    }

    [OriginalType(typeof(DigicircMatchmaking.BO.Activities))]
    public class Activities_ActivitiesDTO : ViewModelDTOBase, IViewModelDTO<DigicircMatchmaking.BO.Activities>
    {

        [JsonConstructor]
        public Activities_ActivitiesDTO() { }
        public Activities_ActivitiesDTO(DigicircMatchmaking.BO.Activities original, bool parentIsDirty = false)
        {
            if (original == null) return;
            _key = original.Id as object;
            Id = original.Id;
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
        public string Value;
        public string _versionTimestamp;
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.BO.Activities).FullName;
        public override List<string> _baseClasses => null;
        public DigicircMatchmaking.BO.Activities GetModel()
        {
            var alreadySeenInstance = DTOHelper.GetSeenModelInstance<DigicircMatchmaking.BO.Activities>(_clientKey, _originalTypeClassName, _baseClasses);
            if (alreadySeenInstance != null) return alreadySeenInstance;
            if (_key == null) return null;
            var rawKey = _key.ToString();
            var parsedKey = int.Parse(rawKey);
            if (parsedKey == default(int) || Equals(parsedKey, default(int)))
            {
                return new DigicircMatchmaking.BO.Activities();
            }
            return new DAL.Repository().GetById<DigicircMatchmaking.BO.Activities>(parsedKey, false, false);
        }
        public DigicircMatchmaking.BO.Activities Convert()
        {
            var original = GetModel();
            if (original == null)
            {
                original = new DigicircMatchmaking.BO.Activities();
            }
            DTOHelper.UpdateSeenModelInstances(this, original);
            Hydrate(original);
            return original;
        }
        public void Hydrate(DigicircMatchmaking.BO.Activities original)
        {
            if (original == null) return;
            original.Id = Id ?? 0;
            original.Value = Value;
            if (string.IsNullOrEmpty(this._versionTimestamp))
                original.VersionTimestamp = 1;
            else
                original.VersionTimestamp = Int32.Parse(this._versionTimestamp);
        }
        public static Activities_ActivitiesDTO GetInstance(object key, string jbID)
        {
            if (key == null) return null;
            var rawKey = key.ToString();
            var parsedKey = int.Parse(rawKey);
            var foundEntry = new DAL.Repository().GetById<DigicircMatchmaking.BO.Activities>(parsedKey, true, false);
            if(foundEntry != null)
            {
                return new Activities_ActivitiesDTO(foundEntry);
            }
            return null;
        }
    }



}
