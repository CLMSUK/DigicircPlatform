// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
using System;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using DigicircMatchmaking.BO;
using DigicircMatchmaking.UI.Controllers.ThematicExpertiseForm;
using AppCode;
using zAppDev.DotNet.Framework.Data;
using zAppDev.DotNet.Framework.Utilities;
using zAppDev.DotNet.Framework.Data.Domain;
using zAppDev.DotNet.Framework.Mvc;
using zAppDev.DotNet.Framework.Locales;
using System.ComponentModel.DataAnnotations;
using DigicircMatchmaking.UI.ViewModels.MasterPage;
using DigicircMatchmaking.UI.Controllers.MasterPage;
namespace DigicircMatchmaking.UI.ViewModels.ThematicExpertiseForm
{
    public class ThematicExpertiseFormViewModel : MasterPageViewModel
    {
        public DigicircMatchmaking.BO.ThematicExpertise ThematicExpertise;


        public ThematicExpertiseFormViewModel()
        {
            ThematicExpertise = new DigicircMatchmaking.BO.ThematicExpertise();
        }


        public override void Evict()
        {
            var manager = MiniSessionManager.Instance;
            if (manager.Session.Contains(ThematicExpertise))
            {
                manager.Session.Evict(ThematicExpertise);
            }
        }

    }


    [OriginalType(typeof(DigicircMatchmaking.UI.ViewModels.ThematicExpertiseForm.ThematicExpertiseFormViewModel))]
    public class ThematicExpertiseFormViewModelDTO : MasterPageViewModelDTO, IViewModelDTO<DigicircMatchmaking.UI.ViewModels.ThematicExpertiseForm.ThematicExpertiseFormViewModel>
    {

        [JsonConstructor]
        public ThematicExpertiseFormViewModelDTO() { }
        public ThematicExpertiseFormViewModelDTO(DigicircMatchmaking.UI.ViewModels.ThematicExpertiseForm.ThematicExpertiseFormViewModel original, bool parentIsDirty = false)  : base(original)
        {
            if (original == null) return;
            ThematicExpertise = original.ThematicExpertise == null ? null : new ThematicExpertise_ThematicExpertiseDTO(original.ThematicExpertise);
        }
        public ThematicExpertise_ThematicExpertiseDTO ThematicExpertise;
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.UI.ViewModels.ThematicExpertiseForm.ThematicExpertiseFormViewModel).FullName;

        public new DigicircMatchmaking.UI.ViewModels.ThematicExpertiseForm.ThematicExpertiseFormViewModel GetModel()
        {
            var alreadySeenInstance = DTOHelper.GetSeenModelInstance<DigicircMatchmaking.UI.ViewModels.ThematicExpertiseForm.ThematicExpertiseFormViewModel>(_clientKey, _originalTypeClassName, _baseClasses);
            if (alreadySeenInstance != null) return alreadySeenInstance;
            return new DigicircMatchmaking.UI.ViewModels.ThematicExpertiseForm.ThematicExpertiseFormViewModel();
        }
        new  public DigicircMatchmaking.UI.ViewModels.ThematicExpertiseForm.ThematicExpertiseFormViewModel Convert()
        {
            var original = GetModel();
            if (original == null)
            {
                original = new DigicircMatchmaking.UI.ViewModels.ThematicExpertiseForm.ThematicExpertiseFormViewModel();
            }
            DTOHelper.UpdateSeenModelInstances(this, original);
            Hydrate(original);
            return original;
        }
        public void Hydrate(DigicircMatchmaking.UI.ViewModels.ThematicExpertiseForm.ThematicExpertiseFormViewModel original)
        {
            if (original == null) return;
            base.Hydrate(original);
            original.ThematicExpertise = ThematicExpertise == null
                                         ? null
                                         : ThematicExpertise.Convert();
        }
    }

    [OriginalType(typeof(DigicircMatchmaking.BO.ThematicExpertise))]
    public class ThematicExpertise_ThematicExpertiseDTO : ViewModelDTOBase, IViewModelDTO<DigicircMatchmaking.BO.ThematicExpertise>
    {

        [JsonConstructor]
        public ThematicExpertise_ThematicExpertiseDTO() { }
        public ThematicExpertise_ThematicExpertiseDTO(DigicircMatchmaking.BO.ThematicExpertise original, bool parentIsDirty = false)
        {
            if (original == null) return;
            _key = original.Id as object;
            Id = original.Id;
            Code = original.Code;
            Value = original.Value;
            _clientKey = DTOHelper.GetClientKey(original, Id);
        }
        public int? Id;
        public new object _key
        {
            get;
            set;
        }
        public string Code;
        public string Value;
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.BO.ThematicExpertise).FullName;
        public override List<string> _baseClasses => new List<string> {typeof(DigicircMatchmaking.BO.ValueType).FullName};
        public DigicircMatchmaking.BO.ThematicExpertise GetModel()
        {
            var alreadySeenInstance = DTOHelper.GetSeenModelInstance<DigicircMatchmaking.BO.ThematicExpertise>(_clientKey, _originalTypeClassName, _baseClasses);
            if (alreadySeenInstance != null) return alreadySeenInstance;
            if (_key == null) return null;
            var rawKey = _key.ToString();
            var parsedKey = int.Parse(rawKey);
            if (parsedKey == default(int) || Equals(parsedKey, default(int)))
            {
                return new DigicircMatchmaking.BO.ThematicExpertise();
            }
            return new DAL.Repository().GetById<DigicircMatchmaking.BO.ThematicExpertise>(parsedKey, false, false);
        }
        public DigicircMatchmaking.BO.ThematicExpertise Convert()
        {
            var original = GetModel();
            if (original == null)
            {
                original = new DigicircMatchmaking.BO.ThematicExpertise();
            }
            DTOHelper.UpdateSeenModelInstances(this, original);
            Hydrate(original);
            return original;
        }
        public void Hydrate(DigicircMatchmaking.BO.ThematicExpertise original)
        {
            if (original == null) return;
            original.Id = Id ?? 0;
            original.Code = Code;
            original.Value = Value;
        }
        public static ThematicExpertise_ThematicExpertiseDTO GetInstance(object key, string jbID)
        {
            if (key == null) return null;
            var rawKey = key.ToString();
            var parsedKey = int.Parse(rawKey);
            var foundEntry = new DAL.Repository().GetById<DigicircMatchmaking.BO.ThematicExpertise>(parsedKey, true, false);
            if(foundEntry != null)
            {
                return new ThematicExpertise_ThematicExpertiseDTO(foundEntry);
            }
            return null;
        }
    }



}
