// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
using System;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using DigicircMatchmaking.BO;
using DigicircMatchmaking.UI.Controllers.ThematicExpertiseList;
using AppCode;
using zAppDev.DotNet.Framework.Data;
using zAppDev.DotNet.Framework.Utilities;
using zAppDev.DotNet.Framework.Data.Domain;
using zAppDev.DotNet.Framework.Mvc;
using zAppDev.DotNet.Framework.Locales;
using System.ComponentModel.DataAnnotations;
using DigicircMatchmaking.UI.ViewModels.MasterPage;
using DigicircMatchmaking.UI.Controllers.MasterPage;
namespace DigicircMatchmaking.UI.ViewModels.ThematicExpertiseList
{
    public class ThematicExpertiseListViewModel : MasterPageViewModel
    {
        public List<SelectedItemInfo<DigicircMatchmaking.BO.ThematicExpertise>> ThematicExpertiseListSelectedItems;


        public ThematicExpertiseListViewModel()
        {
        }


        public override void Evict()
        {
            var manager = MiniSessionManager.Instance;
        }

    }


    [OriginalType(typeof(DigicircMatchmaking.UI.ViewModels.ThematicExpertiseList.ThematicExpertiseListViewModel))]
    public class ThematicExpertiseListViewModelDTO : MasterPageViewModelDTO, IViewModelDTO<DigicircMatchmaking.UI.ViewModels.ThematicExpertiseList.ThematicExpertiseListViewModel>
    {

        [JsonConstructor]
        public ThematicExpertiseListViewModelDTO() { }
        public ThematicExpertiseListViewModelDTO(DigicircMatchmaking.UI.ViewModels.ThematicExpertiseList.ThematicExpertiseListViewModel original, bool parentIsDirty = false)  : base(original)
        {
            if (original == null) return;
            ThematicExpertiseListSelectedItemKeys = original.ThematicExpertiseListSelectedItems == null
                                                    ? null
                                                    : original.ThematicExpertiseListSelectedItems.Select(x => new SelectedItemInfo<int?>(x.SelectedItems.Select(y => y.Id).ToList(), x.Indexes, x.FullRecordsetSelected)).ToList();
        }
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.UI.ViewModels.ThematicExpertiseList.ThematicExpertiseListViewModel).FullName;
        public List<SelectedItemInfo<int?>> ThematicExpertiseListSelectedItemKeys;

        public new DigicircMatchmaking.UI.ViewModels.ThematicExpertiseList.ThematicExpertiseListViewModel GetModel()
        {
            var alreadySeenInstance = DTOHelper.GetSeenModelInstance<DigicircMatchmaking.UI.ViewModels.ThematicExpertiseList.ThematicExpertiseListViewModel>(_clientKey, _originalTypeClassName, _baseClasses);
            if (alreadySeenInstance != null) return alreadySeenInstance;
            return new DigicircMatchmaking.UI.ViewModels.ThematicExpertiseList.ThematicExpertiseListViewModel();
        }
        new  public DigicircMatchmaking.UI.ViewModels.ThematicExpertiseList.ThematicExpertiseListViewModel Convert()
        {
            var original = GetModel();
            if (original == null)
            {
                original = new DigicircMatchmaking.UI.ViewModels.ThematicExpertiseList.ThematicExpertiseListViewModel();
            }
            DTOHelper.UpdateSeenModelInstances(this, original);
            Hydrate(original);
            return original;
        }
        public void Hydrate(DigicircMatchmaking.UI.ViewModels.ThematicExpertiseList.ThematicExpertiseListViewModel original)
        {
            if (original == null) return;
            base.Hydrate(original);
            original.ThematicExpertiseListSelectedItems = ThematicExpertiseListSelectedItemKeys == null
                    ? new List<SelectedItemInfo<DigicircMatchmaking.BO.ThematicExpertise>>()
                    : ThematicExpertiseListSelectedItemKeys.Select(x => new SelectedItemInfo<DigicircMatchmaking.BO.ThematicExpertise>(x.SelectedItems.Select(y => ViewModels.ThematicExpertiseList.ThematicExpertiseDataSet_ThematicExpertiseDTO.GetModelByKey(y)).ToList(), x.Indexes, x.FullRecordsetSelected)).ToList();
        }
    }


    #region Datasource DTOs
    [OriginalType(typeof(DigicircMatchmaking.BO.ThematicExpertise))]
    [DataSetDTO]
    public class ThematicExpertiseDataSet_ThematicExpertiseDTO : ThematicExpertiseDataSet_ValueTypeDTO, IViewModelDTO<DigicircMatchmaking.BO.ThematicExpertise>
    {
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.BO.ThematicExpertise).FullName;
        public int? Id;
        public new object _key
        {
            get;
            set;
        }
        public string Code;
        public string Value;


        [JsonConstructor]
        public ThematicExpertiseDataSet_ThematicExpertiseDTO() : base() {}
        public new static ThematicExpertiseDataSet_ThematicExpertiseDTO GetInstance(object key, string jbID)
        {
            if (key == null) return null;
            var rawKey = key.ToString();
            var parsedKey = int.Parse(rawKey);
            var foundEntry = new DAL.Repository().GetById<DigicircMatchmaking.BO.ThematicExpertise>(parsedKey, false, false);
            if(foundEntry == null && !string.IsNullOrWhiteSpace(jbID))
            {
                if(int.TryParse(rawKey, out int _uniqueKey))
                {
                    var controller = new ThematicExpertiseListController();
                    var method = controller.GetType().GetMethod($"Get_{jbID}_DatasourceQueryable");
                    var records = method.Invoke(controller, new object[] { System.Type.Missing, System.Type.Missing }) as IQueryable<DigicircMatchmaking.BO.ThematicExpertise>;
                    foundEntry = records.Where(c => c._GetUniqueIdentifier() == _uniqueKey).FirstOrDefault();
                }
            }
            if(foundEntry != null)
            {
                return new ThematicExpertiseDataSet_ThematicExpertiseDTO(foundEntry);
            }
            return null;
        }
        public ThematicExpertiseDataSet_ThematicExpertiseDTO(DigicircMatchmaking.BO.ThematicExpertise original, bool assignClientKey) : this(original)
        {
            _clientKey = DTOHelper.GetClientKey(original, Id);
        }
        public ThematicExpertiseDataSet_ThematicExpertiseDTO(DigicircMatchmaking.BO.ThematicExpertise original)
        {
            if(original == null) throw new ApplicationException(BaseViewPage<object>.GetResourceValue("GlobalResources", "RES_DATASOURCE_Null_Value_In_Resultset", null, "The resultset of your DataSource contains null values."));
            _key = (original.Id == 0) ? original._GetUniqueIdentifier() as object : original.Id as object;
            Id = original.Id;
            if (!DTOHelper.SeenDTOInstances.ContainsKey(original))
            {
                DTOHelper.SeenDTOInstances.Add(original, this);
            }
            Code = original.Code;
            Value = original.Value;
        }

        public new static DigicircMatchmaking.BO.ThematicExpertise GetModelByKey(object _key)
        {
            var rawKey = _key.ToString();
            var parsedKey = int.Parse(rawKey);
            return new DAL.Repository().GetById<DigicircMatchmaking.BO.ThematicExpertise>(parsedKey, false, false);
        }
        public new DigicircMatchmaking.BO.ThematicExpertise Convert()
        {
            var model = new DigicircMatchmaking.BO.ThematicExpertise();
            if (_key != null && _key.ToString() != "0")
            {
                var rawKey = _key.ToString();
                var parsedKey = int.Parse(rawKey);
                model = new DAL.Repository().GetById<DigicircMatchmaking.BO.ThematicExpertise>(parsedKey, false, false) ?? model;
            }
            if (!DTOHelper.SeenModelInstances.ContainsKey(this))
            {
                DTOHelper.SeenModelInstances.Add(this, model);
            }
            model.Id = Id ?? 0;
            model.Code = Code;
            model.Value = Value;
            DTOHelper.UpdateSeenModelInstances(this, model);
            return model;
        }

    }
    [OriginalType(typeof(DigicircMatchmaking.BO.ValueType))]
    [DataSetDTO]
    public class ThematicExpertiseDataSet_ValueTypeDTO : ViewModelDTOBase, IViewModelDTO<DigicircMatchmaking.BO.ValueType>
    {
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.BO.ValueType).FullName;
        public string _versionTimestamp;
        public int? Id;
        public new object _key
        {
            get;
            set;
        }
        public string Code;
        public string Value;


        [JsonConstructor]
        public ThematicExpertiseDataSet_ValueTypeDTO() : base() {}
        public  static ThematicExpertiseDataSet_ValueTypeDTO GetInstance(object key, string jbID)
        {
            if (key == null) return null;
            var rawKey = key.ToString();
            var parsedKey = int.Parse(rawKey);
            var foundEntry = new DAL.Repository().GetById<DigicircMatchmaking.BO.ValueType>(parsedKey, false, false);
            if(foundEntry == null && !string.IsNullOrWhiteSpace(jbID))
            {
                if(int.TryParse(rawKey, out int _uniqueKey))
                {
                    var controller = new ThematicExpertiseListController();
                    var method = controller.GetType().GetMethod($"Get_{jbID}_DatasourceQueryable");
                    var records = method.Invoke(controller, new object[] { System.Type.Missing, System.Type.Missing }) as IQueryable<DigicircMatchmaking.BO.ValueType>;
                    foundEntry = records.Where(c => c._GetUniqueIdentifier() == _uniqueKey).FirstOrDefault();
                }
            }
            if(foundEntry != null)
            {
                return new ThematicExpertiseDataSet_ValueTypeDTO(foundEntry);
            }
            return null;
        }
        public ThematicExpertiseDataSet_ValueTypeDTO(DigicircMatchmaking.BO.ValueType original, bool assignClientKey) : this(original)
        {
            _clientKey = DTOHelper.GetClientKey(original, Id);
        }
        public ThematicExpertiseDataSet_ValueTypeDTO(DigicircMatchmaking.BO.ValueType original)
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
            Code = original.Code;
            Value = original.Value;
        }

        public static DigicircMatchmaking.BO.ValueType GetModelByKey(object _key)
        {
            var rawKey = _key.ToString();
            var parsedKey = int.Parse(rawKey);
            return new DAL.Repository().GetById<DigicircMatchmaking.BO.ValueType>(parsedKey, false, false);
        }
        public DigicircMatchmaking.BO.ValueType Convert()
        {
            var model = new DigicircMatchmaking.BO.ValueType();
            if (_key != null && _key.ToString() != "0")
            {
                var rawKey = _key.ToString();
                var parsedKey = int.Parse(rawKey);
                model = new DAL.Repository().GetById<DigicircMatchmaking.BO.ValueType>(parsedKey, false, false) ?? model;
            }
            if (!DTOHelper.SeenModelInstances.ContainsKey(this))
            {
                DTOHelper.SeenModelInstances.Add(this, model);
            }
            model.Id = Id ?? 0;
            model.Code = Code;
            model.Value = Value;
            DTOHelper.UpdateSeenModelInstances(this, model);
            return model;
        }

    }


    #endregion

}
