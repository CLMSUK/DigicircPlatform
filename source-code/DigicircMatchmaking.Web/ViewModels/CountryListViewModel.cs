// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
using System;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using DigicircMatchmaking.BO;
using DigicircMatchmaking.UI.Controllers.CountryList;
using AppCode;
using zAppDev.DotNet.Framework.Data;
using zAppDev.DotNet.Framework.Utilities;
using zAppDev.DotNet.Framework.Data.Domain;
using zAppDev.DotNet.Framework.Mvc;
using zAppDev.DotNet.Framework.Locales;
using System.ComponentModel.DataAnnotations;
using DigicircMatchmaking.UI.ViewModels.MasterPage;
using DigicircMatchmaking.UI.Controllers.MasterPage;
namespace DigicircMatchmaking.UI.ViewModels.CountryList
{
    public class CountryListViewModel : MasterPageViewModel
    {
        public List<SelectedItemInfo<DigicircMatchmaking.BO.Country>> CountryListSelectedItems;


        public CountryListViewModel()
        {
        }


        public override void Evict()
        {
            var manager = MiniSessionManager.Instance;
        }

    }


    [OriginalType(typeof(DigicircMatchmaking.UI.ViewModels.CountryList.CountryListViewModel))]
    public class CountryListViewModelDTO : MasterPageViewModelDTO, IViewModelDTO<DigicircMatchmaking.UI.ViewModels.CountryList.CountryListViewModel>
    {

        [JsonConstructor]
        public CountryListViewModelDTO() { }
        public CountryListViewModelDTO(DigicircMatchmaking.UI.ViewModels.CountryList.CountryListViewModel original, bool parentIsDirty = false)  : base(original)
        {
            if (original == null) return;
            CountryListSelectedItemKeys = original.CountryListSelectedItems == null
                                          ? null
                                          : original.CountryListSelectedItems.Select(x => new SelectedItemInfo<int?>(x.SelectedItems.Select(y => y.Id).ToList(), x.Indexes, x.FullRecordsetSelected)).ToList();
        }
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.UI.ViewModels.CountryList.CountryListViewModel).FullName;
        public List<SelectedItemInfo<int?>> CountryListSelectedItemKeys;

        public new DigicircMatchmaking.UI.ViewModels.CountryList.CountryListViewModel GetModel()
        {
            var alreadySeenInstance = DTOHelper.GetSeenModelInstance<DigicircMatchmaking.UI.ViewModels.CountryList.CountryListViewModel>(_clientKey, _originalTypeClassName, _baseClasses);
            if (alreadySeenInstance != null) return alreadySeenInstance;
            return new DigicircMatchmaking.UI.ViewModels.CountryList.CountryListViewModel();
        }
        new  public DigicircMatchmaking.UI.ViewModels.CountryList.CountryListViewModel Convert()
        {
            var original = GetModel();
            if (original == null)
            {
                original = new DigicircMatchmaking.UI.ViewModels.CountryList.CountryListViewModel();
            }
            DTOHelper.UpdateSeenModelInstances(this, original);
            Hydrate(original);
            return original;
        }
        public void Hydrate(DigicircMatchmaking.UI.ViewModels.CountryList.CountryListViewModel original)
        {
            if (original == null) return;
            base.Hydrate(original);
            original.CountryListSelectedItems = CountryListSelectedItemKeys == null
                                                ? new List<SelectedItemInfo<DigicircMatchmaking.BO.Country>>()
                                                : CountryListSelectedItemKeys.Select(x => new SelectedItemInfo<DigicircMatchmaking.BO.Country>(x.SelectedItems.Select(y => ViewModels.CountryList.CountryDataSet_CountryDTO.GetModelByKey(y)).ToList(), x.Indexes, x.FullRecordsetSelected)).ToList();
        }
    }


    #region Datasource DTOs
    [OriginalType(typeof(DigicircMatchmaking.BO.Country))]
    [DataSetDTO]
    public class CountryDataSet_CountryDTO : ViewModelDTOBase, IViewModelDTO<DigicircMatchmaking.BO.Country>
    {
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.BO.Country).FullName;
        public string _versionTimestamp;
        public int? Id;
        public new object _key
        {
            get;
            set;
        }
        public string Name;
        public string ShortName;


        [JsonConstructor]
        public CountryDataSet_CountryDTO() : base() {}
        public  static CountryDataSet_CountryDTO GetInstance(object key, string jbID)
        {
            if (key == null) return null;
            var rawKey = key.ToString();
            var parsedKey = int.Parse(rawKey);
            var foundEntry = new DAL.Repository().GetById<DigicircMatchmaking.BO.Country>(parsedKey, false, false);
            if(foundEntry == null && !string.IsNullOrWhiteSpace(jbID))
            {
                if(int.TryParse(rawKey, out int _uniqueKey))
                {
                    var controller = new CountryListController();
                    var method = controller.GetType().GetMethod($"Get_{jbID}_DatasourceQueryable");
                    var records = method.Invoke(controller, new object[] { System.Type.Missing, System.Type.Missing }) as IQueryable<DigicircMatchmaking.BO.Country>;
                    foundEntry = records.Where(c => c._GetUniqueIdentifier() == _uniqueKey).FirstOrDefault();
                }
            }
            if(foundEntry != null)
            {
                return new CountryDataSet_CountryDTO(foundEntry);
            }
            return null;
        }
        public CountryDataSet_CountryDTO(DigicircMatchmaking.BO.Country original, bool assignClientKey) : this(original)
        {
            _clientKey = DTOHelper.GetClientKey(original, Id);
        }
        public CountryDataSet_CountryDTO(DigicircMatchmaking.BO.Country original)
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
            Name = original.Name;
            ShortName = original.ShortName;
        }

        public static DigicircMatchmaking.BO.Country GetModelByKey(object _key)
        {
            var rawKey = _key.ToString();
            var parsedKey = int.Parse(rawKey);
            return new DAL.Repository().GetById<DigicircMatchmaking.BO.Country>(parsedKey, false, false);
        }
        public DigicircMatchmaking.BO.Country Convert()
        {
            var model = new DigicircMatchmaking.BO.Country();
            if (_key != null && _key.ToString() != "0")
            {
                var rawKey = _key.ToString();
                var parsedKey = int.Parse(rawKey);
                model = new DAL.Repository().GetById<DigicircMatchmaking.BO.Country>(parsedKey, false, false) ?? model;
            }
            if (!DTOHelper.SeenModelInstances.ContainsKey(this))
            {
                DTOHelper.SeenModelInstances.Add(this, model);
            }
            model.Id = Id ?? 0;
            model.Name = Name;
            model.ShortName = ShortName;
            DTOHelper.UpdateSeenModelInstances(this, model);
            return model;
        }

    }

    #endregion

}
