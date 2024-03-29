// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
using System;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using DigicircMatchmaking.BO;
using DigicircMatchmaking.UI.Controllers.BusinessFunctionForm;
using AppCode;
using zAppDev.DotNet.Framework.Data;
using zAppDev.DotNet.Framework.Utilities;
using zAppDev.DotNet.Framework.Data.Domain;
using zAppDev.DotNet.Framework.Mvc;
using zAppDev.DotNet.Framework.Locales;
using System.ComponentModel.DataAnnotations;
using DigicircMatchmaking.UI.ViewModels.MasterPage;
using DigicircMatchmaking.UI.Controllers.MasterPage;
namespace DigicircMatchmaking.UI.ViewModels.BusinessFunctionForm
{
    public class BusinessFunctionFormViewModel : MasterPageViewModel
    {
        public DigicircMatchmaking.BO.BusinessFunction BusinessFunction;


        public BusinessFunctionFormViewModel()
        {
            BusinessFunction = new DigicircMatchmaking.BO.BusinessFunction();
        }


        public override void Evict()
        {
            var manager = MiniSessionManager.Instance;
            if (manager.Session.Contains(BusinessFunction))
            {
                manager.Session.Evict(BusinessFunction);
            }
        }

    }


    [OriginalType(typeof(DigicircMatchmaking.UI.ViewModels.BusinessFunctionForm.BusinessFunctionFormViewModel))]
    public class BusinessFunctionFormViewModelDTO : MasterPageViewModelDTO, IViewModelDTO<DigicircMatchmaking.UI.ViewModels.BusinessFunctionForm.BusinessFunctionFormViewModel>
    {

        [JsonConstructor]
        public BusinessFunctionFormViewModelDTO() { }
        public BusinessFunctionFormViewModelDTO(DigicircMatchmaking.UI.ViewModels.BusinessFunctionForm.BusinessFunctionFormViewModel original, bool parentIsDirty = false)  : base(original)
        {
            if (original == null) return;
            BusinessFunction = original.BusinessFunction == null ? null : new BusinessFunction_BusinessFunctionDTO(original.BusinessFunction);
        }
        public BusinessFunction_BusinessFunctionDTO BusinessFunction;
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.UI.ViewModels.BusinessFunctionForm.BusinessFunctionFormViewModel).FullName;

        public new DigicircMatchmaking.UI.ViewModels.BusinessFunctionForm.BusinessFunctionFormViewModel GetModel()
        {
            var alreadySeenInstance = DTOHelper.GetSeenModelInstance<DigicircMatchmaking.UI.ViewModels.BusinessFunctionForm.BusinessFunctionFormViewModel>(_clientKey, _originalTypeClassName, _baseClasses);
            if (alreadySeenInstance != null) return alreadySeenInstance;
            return new DigicircMatchmaking.UI.ViewModels.BusinessFunctionForm.BusinessFunctionFormViewModel();
        }
        new  public DigicircMatchmaking.UI.ViewModels.BusinessFunctionForm.BusinessFunctionFormViewModel Convert()
        {
            var original = GetModel();
            if (original == null)
            {
                original = new DigicircMatchmaking.UI.ViewModels.BusinessFunctionForm.BusinessFunctionFormViewModel();
            }
            DTOHelper.UpdateSeenModelInstances(this, original);
            Hydrate(original);
            return original;
        }
        public void Hydrate(DigicircMatchmaking.UI.ViewModels.BusinessFunctionForm.BusinessFunctionFormViewModel original)
        {
            if (original == null) return;
            base.Hydrate(original);
            original.BusinessFunction = BusinessFunction == null
                                        ? null
                                        : BusinessFunction.Convert();
        }
    }

    [OriginalType(typeof(DigicircMatchmaking.BO.BusinessFunction))]
    public class BusinessFunction_BusinessFunctionDTO : ViewModelDTOBase, IViewModelDTO<DigicircMatchmaking.BO.BusinessFunction>
    {

        [JsonConstructor]
        public BusinessFunction_BusinessFunctionDTO() { }
        public BusinessFunction_BusinessFunctionDTO(DigicircMatchmaking.BO.BusinessFunction original, bool parentIsDirty = false)
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
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.BO.BusinessFunction).FullName;
        public override List<string> _baseClasses => null;
        public DigicircMatchmaking.BO.BusinessFunction GetModel()
        {
            var alreadySeenInstance = DTOHelper.GetSeenModelInstance<DigicircMatchmaking.BO.BusinessFunction>(_clientKey, _originalTypeClassName, _baseClasses);
            if (alreadySeenInstance != null) return alreadySeenInstance;
            if (_key == null) return null;
            var rawKey = _key.ToString();
            var parsedKey = int.Parse(rawKey);
            if (parsedKey == default(int) || Equals(parsedKey, default(int)))
            {
                return new DigicircMatchmaking.BO.BusinessFunction();
            }
            return new DAL.Repository().GetById<DigicircMatchmaking.BO.BusinessFunction>(parsedKey, false, false);
        }
        public DigicircMatchmaking.BO.BusinessFunction Convert()
        {
            var original = GetModel();
            if (original == null)
            {
                original = new DigicircMatchmaking.BO.BusinessFunction();
            }
            DTOHelper.UpdateSeenModelInstances(this, original);
            Hydrate(original);
            return original;
        }
        public void Hydrate(DigicircMatchmaking.BO.BusinessFunction original)
        {
            if (original == null) return;
            original.Id = Id ?? 0;
            original.Value = Value;
            if (string.IsNullOrEmpty(this._versionTimestamp))
                original.VersionTimestamp = 1;
            else
                original.VersionTimestamp = Int32.Parse(this._versionTimestamp);
        }
        public static BusinessFunction_BusinessFunctionDTO GetInstance(object key, string jbID)
        {
            if (key == null) return null;
            var rawKey = key.ToString();
            var parsedKey = int.Parse(rawKey);
            var foundEntry = new DAL.Repository().GetById<DigicircMatchmaking.BO.BusinessFunction>(parsedKey, true, false);
            if(foundEntry != null)
            {
                return new BusinessFunction_BusinessFunctionDTO(foundEntry);
            }
            return null;
        }
    }



}
