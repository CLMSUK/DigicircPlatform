// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
using System;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using DigicircMatchmaking.BO;
using DigicircMatchmaking.UI.Controllers.ApplicationSettingsList;
using AppCode;
using zAppDev.DotNet.Framework.Data;
using zAppDev.DotNet.Framework.Utilities;
using zAppDev.DotNet.Framework.Data.Domain;
using zAppDev.DotNet.Framework.Mvc;
using zAppDev.DotNet.Framework.Locales;
using System.ComponentModel.DataAnnotations;
using DigicircMatchmaking.UI.ViewModels.MasterPage;
using DigicircMatchmaking.UI.Controllers.MasterPage;
namespace DigicircMatchmaking.UI.ViewModels.ApplicationSettingsList
{
    public class ApplicationSettingsListViewModel : MasterPageViewModel
    {
        public List<SelectedItemInfo<zAppDev.DotNet.Framework.Identity.Model.ApplicationSetting>> ListSelectedItems;


        public ApplicationSettingsListViewModel()
        {
        }


        public override void Evict()
        {
            var manager = MiniSessionManager.Instance;
        }

    }


    [OriginalType(typeof(DigicircMatchmaking.UI.ViewModels.ApplicationSettingsList.ApplicationSettingsListViewModel))]
    public class ApplicationSettingsListViewModelDTO : MasterPageViewModelDTO, IViewModelDTO<DigicircMatchmaking.UI.ViewModels.ApplicationSettingsList.ApplicationSettingsListViewModel>
    {

        [JsonConstructor]
        public ApplicationSettingsListViewModelDTO() { }
        public ApplicationSettingsListViewModelDTO(DigicircMatchmaking.UI.ViewModels.ApplicationSettingsList.ApplicationSettingsListViewModel original, bool parentIsDirty = false)  : base(original)
        {
            if (original == null) return;
            ListSelectedItemKeys = original.ListSelectedItems == null
                                   ? null
                                   : original.ListSelectedItems.Select(x => new SelectedItemInfo<int?>(x.SelectedItems.Select(y => y.Id).ToList(), x.Indexes, x.FullRecordsetSelected)).ToList();
        }
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.UI.ViewModels.ApplicationSettingsList.ApplicationSettingsListViewModel).FullName;
        public List<SelectedItemInfo<int?>> ListSelectedItemKeys;

        public new DigicircMatchmaking.UI.ViewModels.ApplicationSettingsList.ApplicationSettingsListViewModel GetModel()
        {
            var alreadySeenInstance = DTOHelper.GetSeenModelInstance<DigicircMatchmaking.UI.ViewModels.ApplicationSettingsList.ApplicationSettingsListViewModel>(_clientKey, _originalTypeClassName, _baseClasses);
            if (alreadySeenInstance != null) return alreadySeenInstance;
            return new DigicircMatchmaking.UI.ViewModels.ApplicationSettingsList.ApplicationSettingsListViewModel();
        }
        new  public DigicircMatchmaking.UI.ViewModels.ApplicationSettingsList.ApplicationSettingsListViewModel Convert()
        {
            var original = GetModel();
            if (original == null)
            {
                original = new DigicircMatchmaking.UI.ViewModels.ApplicationSettingsList.ApplicationSettingsListViewModel();
            }
            DTOHelper.UpdateSeenModelInstances(this, original);
            Hydrate(original);
            return original;
        }
        public void Hydrate(DigicircMatchmaking.UI.ViewModels.ApplicationSettingsList.ApplicationSettingsListViewModel original)
        {
            if (original == null) return;
            base.Hydrate(original);
            original.ListSelectedItems = ListSelectedItemKeys == null
                                         ? new List<SelectedItemInfo<zAppDev.DotNet.Framework.Identity.Model.ApplicationSetting>>()
                                         : ListSelectedItemKeys.Select(x => new SelectedItemInfo<zAppDev.DotNet.Framework.Identity.Model.ApplicationSetting>(x.SelectedItems.Select(y => ViewModels.ApplicationSettingsList.List1DataSet_ApplicationSettingDTO.GetModelByKey(y)).ToList(), x.Indexes, x.FullRecordsetSelected)).ToList();
        }
    }


    #region Datasource DTOs
    [OriginalType(typeof(zAppDev.DotNet.Framework.Identity.Model.ApplicationSetting))]
    [DataSetDTO]
    public class List1DataSet_ApplicationSettingDTO : ViewModelDTOBase, IViewModelDTO<zAppDev.DotNet.Framework.Identity.Model.ApplicationSetting>
    {
        public override string _originalTypeClassName => typeof(zAppDev.DotNet.Framework.Identity.Model.ApplicationSetting).FullName;
        public string _versionTimestamp;
        public int? Id;
        public new object _key
        {
            get;
            set;
        }
        public string Key;
        public string Value;
        public bool IsCustom;


        [JsonConstructor]
        public List1DataSet_ApplicationSettingDTO() : base() {}
        public  static List1DataSet_ApplicationSettingDTO GetInstance(object key, string jbID)
        {
            if (key == null) return null;
            var rawKey = key.ToString();
            var parsedKey = int.Parse(rawKey);
            var foundEntry = new DAL.Repository().GetById<zAppDev.DotNet.Framework.Identity.Model.ApplicationSetting>(parsedKey, false, false);
            if(foundEntry == null && !string.IsNullOrWhiteSpace(jbID))
            {
                if(int.TryParse(rawKey, out int _uniqueKey))
                {
                    var controller = new ApplicationSettingsListController();
                    var method = controller.GetType().GetMethod($"Get_{jbID}_DatasourceQueryable");
                    var records = method.Invoke(controller, new object[] { System.Type.Missing, System.Type.Missing }) as IQueryable<zAppDev.DotNet.Framework.Identity.Model.ApplicationSetting>;
                    foundEntry = records.Where(c => c._GetUniqueIdentifier() == _uniqueKey).FirstOrDefault();
                }
            }
            if(foundEntry != null)
            {
                return new List1DataSet_ApplicationSettingDTO(foundEntry);
            }
            return null;
        }
        public List1DataSet_ApplicationSettingDTO(zAppDev.DotNet.Framework.Identity.Model.ApplicationSetting original, bool assignClientKey) : this(original)
        {
            _clientKey = DTOHelper.GetClientKey(original, Id);
        }
        public List1DataSet_ApplicationSettingDTO(zAppDev.DotNet.Framework.Identity.Model.ApplicationSetting original)
        {
            if(original == null) throw new ApplicationException(BaseViewPage<object>.GetResourceValue("GlobalResources", "RES_DATASOURCE_Null_Value_In_Resultset", null, "The resultset of your DataSource contains null values."));
            _key = (original.Id == 0) ? original._GetUniqueIdentifier() as object : original.Id as object;
            if (original.VersionTimestamp != null)
            {
                _versionTimestamp = original.VersionTimestamp.ToString();
            }
            Id = original.Id;
            if (!DTOHelper.SeenDTOInstances.ContainsKey(original))
            {
                DTOHelper.SeenDTOInstances.Add(original, this);
            }
            Key = original.Key;
            Value = original.Value;
            IsCustom = original.IsCustom;
        }

        public static zAppDev.DotNet.Framework.Identity.Model.ApplicationSetting GetModelByKey(object _key)
        {
            var rawKey = _key.ToString();
            var parsedKey = int.Parse(rawKey);
            return new DAL.Repository().GetById<zAppDev.DotNet.Framework.Identity.Model.ApplicationSetting>(parsedKey, false, false);
        }
        public zAppDev.DotNet.Framework.Identity.Model.ApplicationSetting Convert()
        {
            var model = new zAppDev.DotNet.Framework.Identity.Model.ApplicationSetting();
            if (_key != null && _key.ToString() != "0")
            {
                var rawKey = _key.ToString();
                var parsedKey = int.Parse(rawKey);
                model = new DAL.Repository().GetById<zAppDev.DotNet.Framework.Identity.Model.ApplicationSetting>(parsedKey, false, false) ?? model;
            }
            if (!DTOHelper.SeenModelInstances.ContainsKey(this))
            {
                DTOHelper.SeenModelInstances.Add(this, model);
            }
            model.Id = Id ?? 0;
            model.Key = Key;
            model.Value = Value;
            model.IsCustom = IsCustom;
            DTOHelper.UpdateSeenModelInstances(this, model);
            return model;
        }

    }

    #endregion

}
