// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
using System;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using DigicircMatchmaking.BO;
using DigicircMatchmaking.UI.Controllers.CompanyList;
using AppCode;
using zAppDev.DotNet.Framework.Data;
using zAppDev.DotNet.Framework.Utilities;
using zAppDev.DotNet.Framework.Data.Domain;
using zAppDev.DotNet.Framework.Mvc;
using zAppDev.DotNet.Framework.Locales;
using System.ComponentModel.DataAnnotations;
using DigicircMatchmaking.UI.ViewModels.MasterPage;
using DigicircMatchmaking.UI.Controllers.MasterPage;
namespace DigicircMatchmaking.UI.ViewModels.CompanyList
{
    public class CompanyListViewModel : MasterPageViewModel
    {
        public DigicircMatchmaking.BO.EntityType SelectedEntityType;
        public List<SelectedItemInfo<DigicircMatchmaking.BO.EntityType>> DropdownBoxSelectedItems;
        public List<SelectedItemInfo<DigicircMatchmaking.BO.Company>> CompanyListSelectedItems;


        public CompanyListViewModel()
        {
            SelectedEntityType = new DigicircMatchmaking.BO.EntityType();
        }


        public override void Evict()
        {
            var manager = MiniSessionManager.Instance;
            if (manager.Session.Contains(SelectedEntityType))
            {
                manager.Session.Evict(SelectedEntityType);
            }
        }

    }


    [OriginalType(typeof(DigicircMatchmaking.UI.ViewModels.CompanyList.CompanyListViewModel))]
    public class CompanyListViewModelDTO : MasterPageViewModelDTO, IViewModelDTO<DigicircMatchmaking.UI.ViewModels.CompanyList.CompanyListViewModel>
    {

        [JsonConstructor]
        public CompanyListViewModelDTO() { }
        public CompanyListViewModelDTO(DigicircMatchmaking.UI.ViewModels.CompanyList.CompanyListViewModel original, bool parentIsDirty = false)  : base(original)
        {
            if (original == null) return;
            SelectedEntityType = original.SelectedEntityType == null ? null : new SelectedEntityType_EntityTypeDTO(original.SelectedEntityType);
            DropdownBoxSelectedItemKeys = original.DropdownBoxSelectedItems == null
                                          ? null
                                          : original.DropdownBoxSelectedItems.Select(x => new SelectedItemInfo<int?>(x.SelectedItems.Select(y => y.Id).ToList(), x.Indexes, x.FullRecordsetSelected)).ToList();
            CompanyListSelectedItemKeys = original.CompanyListSelectedItems == null
                                          ? null
                                          : original.CompanyListSelectedItems.Select(x => new SelectedItemInfo<int?>(x.SelectedItems.Select(y => y.Id).ToList(), x.Indexes, x.FullRecordsetSelected)).ToList();
        }
        public SelectedEntityType_EntityTypeDTO SelectedEntityType;
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.UI.ViewModels.CompanyList.CompanyListViewModel).FullName;
        public List<SelectedItemInfo<int?>> DropdownBoxSelectedItemKeys;
        public List<SelectedItemInfo<ViewModels.CompanyList.EntityTypeDataSet_EntityTypeDTO>> DropdownBox__InitialSelection;
        public List<SelectedItemInfo<int?>> CompanyListSelectedItemKeys;

        public new DigicircMatchmaking.UI.ViewModels.CompanyList.CompanyListViewModel GetModel()
        {
            var alreadySeenInstance = DTOHelper.GetSeenModelInstance<DigicircMatchmaking.UI.ViewModels.CompanyList.CompanyListViewModel>(_clientKey, _originalTypeClassName, _baseClasses);
            if (alreadySeenInstance != null) return alreadySeenInstance;
            return new DigicircMatchmaking.UI.ViewModels.CompanyList.CompanyListViewModel();
        }
        new  public DigicircMatchmaking.UI.ViewModels.CompanyList.CompanyListViewModel Convert()
        {
            var original = GetModel();
            if (original == null)
            {
                original = new DigicircMatchmaking.UI.ViewModels.CompanyList.CompanyListViewModel();
            }
            DTOHelper.UpdateSeenModelInstances(this, original);
            Hydrate(original);
            return original;
        }
        public void Hydrate(DigicircMatchmaking.UI.ViewModels.CompanyList.CompanyListViewModel original)
        {
            if (original == null) return;
            base.Hydrate(original);
            original.SelectedEntityType = SelectedEntityType == null
                                          ? null
                                          : SelectedEntityType.Convert();
            original.DropdownBoxSelectedItems = DropdownBoxSelectedItemKeys == null
                                                ? new List<SelectedItemInfo<DigicircMatchmaking.BO.EntityType>>()
                                                : DropdownBoxSelectedItemKeys.Select(x => new SelectedItemInfo<DigicircMatchmaking.BO.EntityType>(x.SelectedItems.Select(y => ViewModels.CompanyList.EntityTypeDataSet_EntityTypeDTO.GetModelByKey(y)).ToList(), x.Indexes, x.FullRecordsetSelected)).ToList();
            original.CompanyListSelectedItems = CompanyListSelectedItemKeys == null
                                                ? new List<SelectedItemInfo<DigicircMatchmaking.BO.Company>>()
                                                : CompanyListSelectedItemKeys.Select(x => new SelectedItemInfo<DigicircMatchmaking.BO.Company>(x.SelectedItems.Select(y => ViewModels.CompanyList.CompanyDataSet_CompanyDTO.GetModelByKey(y)).ToList(), x.Indexes, x.FullRecordsetSelected)).ToList();
        }
        public void FillDropDownsInitialValues(CompanyListViewModel original, CompanyListController _controller)
        {
            DropdownBox__InitialSelection = new List<SelectedItemInfo<ViewModels.CompanyList.EntityTypeDataSet_EntityTypeDTO>>();
            if (original == null) return;
            var DropdownBoxInitiallySelectedItem = original?.SelectedEntityType == null
                                                   ? null
                                                   : new DAL.Repository().Get<DigicircMatchmaking.BO.EntityType>(c => c.Id == original.SelectedEntityType.Id).FirstOrDefault();
            if (DropdownBoxInitiallySelectedItem != null)
            {
                DropdownBox__InitialSelection.Add
                (
                    new SelectedItemInfo<ViewModels.CompanyList.EntityTypeDataSet_EntityTypeDTO>(new List<ViewModels.CompanyList.EntityTypeDataSet_EntityTypeDTO>
                {
                    new EntityTypeDataSet_EntityTypeDTO(DropdownBoxInitiallySelectedItem)
                }, "_", false)
                );
            }
        }
    }

    [OriginalType(typeof(DigicircMatchmaking.BO.EntityType))]
    public class SelectedEntityType_EntityTypeDTO : ViewModelDTOBase, IViewModelDTO<DigicircMatchmaking.BO.EntityType>
    {

        [JsonConstructor]
        public SelectedEntityType_EntityTypeDTO() { }
        public SelectedEntityType_EntityTypeDTO(DigicircMatchmaking.BO.EntityType original, bool parentIsDirty = false)
        {
            if (original == null) return;
            _key = original.Id as object;
            Id = original.Id;
            Code = original.Code;
            Value = original.Value;
            IsProvider = original.IsProvider;
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
        public bool IsProvider;
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.BO.EntityType).FullName;
        public override List<string> _baseClasses => new List<string> {typeof(DigicircMatchmaking.BO.ValueType).FullName};
        public DigicircMatchmaking.BO.EntityType GetModel()
        {
            var alreadySeenInstance = DTOHelper.GetSeenModelInstance<DigicircMatchmaking.BO.EntityType>(_clientKey, _originalTypeClassName, _baseClasses);
            if (alreadySeenInstance != null) return alreadySeenInstance;
            if (_key == null) return null;
            var rawKey = _key.ToString();
            var parsedKey = int.Parse(rawKey);
            if (parsedKey == default(int) || Equals(parsedKey, default(int)))
            {
                return new DigicircMatchmaking.BO.EntityType();
            }
            return new DAL.Repository().GetById<DigicircMatchmaking.BO.EntityType>(parsedKey, false, false);
        }
        public DigicircMatchmaking.BO.EntityType Convert()
        {
            var original = GetModel();
            if (original == null)
            {
                original = new DigicircMatchmaking.BO.EntityType();
            }
            DTOHelper.UpdateSeenModelInstances(this, original);
            Hydrate(original);
            return original;
        }
        public void Hydrate(DigicircMatchmaking.BO.EntityType original)
        {
            if (original == null) return;
            original.Id = Id ?? 0;
            original.Code = Code;
            original.Value = Value;
            original.IsProvider = IsProvider;
        }
        public static SelectedEntityType_EntityTypeDTO GetInstance(object key, string jbID)
        {
            if (key == null) return null;
            var rawKey = key.ToString();
            var parsedKey = int.Parse(rawKey);
            var foundEntry = new DAL.Repository().GetById<DigicircMatchmaking.BO.EntityType>(parsedKey, true, false);
            if(foundEntry != null)
            {
                return new SelectedEntityType_EntityTypeDTO(foundEntry);
            }
            return null;
        }
    }
    #region Controller Action DTOS
    [OriginalType(typeof(DigicircMatchmaking.BO.Company))]
    public class CompanyDTO : ViewModelDTOBase, IViewModelDTO<DigicircMatchmaking.BO.Company>
    {
        public int? Id;
        public new object _key
        {
            get;
            set;
        }
        public string company_name;
        public string description;
        public string url;
        public string city;
        public string zip_code;
        public string country;
        public string company_category;


        [JsonConstructor]
        public CompanyDTO() : base() {}
        public  static CompanyDTO GetInstance(object key, string jbID)
        {
            if (key == null) return null;
            var rawKey = key.ToString();
            var parsedKey = int.Parse(rawKey);
            var foundEntry = new DAL.Repository().GetById<DigicircMatchmaking.BO.Company>(parsedKey, false, false);
            if(foundEntry == null && !string.IsNullOrWhiteSpace(jbID))
            {
                if(int.TryParse(rawKey, out int _uniqueKey))
                {
                    var controller = new CompanyListController();
                    var method = controller.GetType().GetMethod($"Get_{jbID}_DatasourceQueryable");
                    var records = method.Invoke(controller, new object[] { System.Type.Missing, System.Type.Missing }) as IQueryable<DigicircMatchmaking.BO.Company>;
                    foundEntry = records.Where(c => c._GetUniqueIdentifier() == _uniqueKey).FirstOrDefault();
                }
            }
            if(foundEntry != null)
            {
                return new CompanyDTO(foundEntry);
            }
            return null;
        }
        public CompanyDTO(DigicircMatchmaking.BO.Company original, bool assignClientKey) : this(original)
        {
            _clientKey = DTOHelper.GetClientKey(original, Id);
        }
        public CompanyDTO(DigicircMatchmaking.BO.Company original)
        {
            if(original == null) throw new ApplicationException(BaseViewPage<object>.GetResourceValue("GlobalResources", "RES_DATASOURCE_Null_Value_In_Resultset", null, "The resultset of your DataSource contains null values."));
            _key = (original.Id == 0) ? original._GetUniqueIdentifier() as object : original.Id as object;
            Id = original.Id;
            if (!DTOHelper.SeenDTOInstances.ContainsKey(original))
            {
                DTOHelper.SeenDTOInstances.Add(original, this);
            }
            company_name = original.company_name;
            description = original.description;
            url = original.url;
            city = original.city;
            zip_code = original.zip_code;
            country = original.country;
            company_category = original.company_category;
        }

        public static DigicircMatchmaking.BO.Company GetModelByKey(object _key)
        {
            var rawKey = _key.ToString();
            var parsedKey = int.Parse(rawKey);
            return new DAL.Repository().GetById<DigicircMatchmaking.BO.Company>(parsedKey, false, false);
        }
        public DigicircMatchmaking.BO.Company Convert()
        {
            var model = new DigicircMatchmaking.BO.Company();
            if (_key != null && _key.ToString() != "0")
            {
                var rawKey = _key.ToString();
                var parsedKey = int.Parse(rawKey);
                model = new DAL.Repository().GetById<DigicircMatchmaking.BO.Company>(parsedKey, false, false) ?? model;
            }
            if (!DTOHelper.SeenModelInstances.ContainsKey(this))
            {
                DTOHelper.SeenModelInstances.Add(this, model);
            }
            model.Id = Id ?? 0;
            model.company_name = company_name;
            model.description = description;
            model.url = url;
            model.city = city;
            model.zip_code = zip_code;
            model.country = country;
            model.company_category = company_category;
            DTOHelper.UpdateSeenModelInstances(this, model);
            return model;
        }

    }

    #endregion


    #region Datasource DTOs
    [OriginalType(typeof(DigicircMatchmaking.BO.Company))]
    [DataSetDTO]
    public class CompanyDataSet_CompanyDTO : ViewModelDTOBase, IViewModelDTO<DigicircMatchmaking.BO.Company>
    {
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.BO.Company).FullName;
        public string _versionTimestamp;
        public int? Id;
        public new object _key
        {
            get;
            set;
        }
        public string company_name;
        public string url;
        public string city;
        public string country;
        public string zip_code;
        public string company_category;
        public string description;


        [JsonConstructor]
        public CompanyDataSet_CompanyDTO() : base() {}
        public  static CompanyDataSet_CompanyDTO GetInstance(object key, string jbID)
        {
            if (key == null) return null;
            var rawKey = key.ToString();
            var parsedKey = int.Parse(rawKey);
            var foundEntry = new DAL.Repository().GetById<DigicircMatchmaking.BO.Company>(parsedKey, false, false);
            if(foundEntry == null && !string.IsNullOrWhiteSpace(jbID))
            {
                if(int.TryParse(rawKey, out int _uniqueKey))
                {
                    var controller = new CompanyListController();
                    var method = controller.GetType().GetMethod($"Get_{jbID}_DatasourceQueryable");
                    var records = method.Invoke(controller, new object[] { System.Type.Missing, System.Type.Missing }) as IQueryable<DigicircMatchmaking.BO.Company>;
                    foundEntry = records.Where(c => c._GetUniqueIdentifier() == _uniqueKey).FirstOrDefault();
                }
            }
            if(foundEntry != null)
            {
                return new CompanyDataSet_CompanyDTO(foundEntry);
            }
            return null;
        }
        public CompanyDataSet_CompanyDTO(DigicircMatchmaking.BO.Company original, bool assignClientKey) : this(original)
        {
            _clientKey = DTOHelper.GetClientKey(original, Id);
        }
        public CompanyDataSet_CompanyDTO(DigicircMatchmaking.BO.Company original)
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
            company_name = original.company_name;
            url = original.url;
            city = original.city;
            country = original.country;
            zip_code = original.zip_code;
            company_category = original.company_category;
            description = original.description;
        }

        public static DigicircMatchmaking.BO.Company GetModelByKey(object _key)
        {
            var rawKey = _key.ToString();
            var parsedKey = int.Parse(rawKey);
            return new DAL.Repository().GetById<DigicircMatchmaking.BO.Company>(parsedKey, false, false);
        }
        public DigicircMatchmaking.BO.Company Convert()
        {
            var model = new DigicircMatchmaking.BO.Company();
            if (_key != null && _key.ToString() != "0")
            {
                var rawKey = _key.ToString();
                var parsedKey = int.Parse(rawKey);
                model = new DAL.Repository().GetById<DigicircMatchmaking.BO.Company>(parsedKey, false, false) ?? model;
            }
            if (!DTOHelper.SeenModelInstances.ContainsKey(this))
            {
                DTOHelper.SeenModelInstances.Add(this, model);
            }
            model.Id = Id ?? 0;
            model.company_name = company_name;
            model.url = url;
            model.city = city;
            model.country = country;
            model.zip_code = zip_code;
            model.company_category = company_category;
            model.description = description;
            DTOHelper.UpdateSeenModelInstances(this, model);
            return model;
        }

    }

    [OriginalType(typeof(DigicircMatchmaking.BO.EntityType))]
    [DataSetDTO]
    public class EntityTypeDataSet_EntityTypeDTO : EntityTypeDataSet_ValueTypeDTO, IViewModelDTO<DigicircMatchmaking.BO.EntityType>
    {
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.BO.EntityType).FullName;
        public int? Id;
        public new object _key
        {
            get;
            set;
        }
        public string Value;


        [JsonConstructor]
        public EntityTypeDataSet_EntityTypeDTO() : base() {}
        public new static EntityTypeDataSet_EntityTypeDTO GetInstance(object key, string jbID)
        {
            if (key == null) return null;
            var rawKey = key.ToString();
            var parsedKey = int.Parse(rawKey);
            var foundEntry = new DAL.Repository().GetById<DigicircMatchmaking.BO.EntityType>(parsedKey, false, false);
            if(foundEntry == null && !string.IsNullOrWhiteSpace(jbID))
            {
                if(int.TryParse(rawKey, out int _uniqueKey))
                {
                    var controller = new CompanyListController();
                    var method = controller.GetType().GetMethod($"Get_{jbID}_DatasourceQueryable");
                    var records = method.Invoke(controller, new object[] { System.Type.Missing, System.Type.Missing }) as IQueryable<DigicircMatchmaking.BO.EntityType>;
                    foundEntry = records.Where(c => c._GetUniqueIdentifier() == _uniqueKey).FirstOrDefault();
                }
            }
            if(foundEntry != null)
            {
                return new EntityTypeDataSet_EntityTypeDTO(foundEntry);
            }
            return null;
        }
        public EntityTypeDataSet_EntityTypeDTO(DigicircMatchmaking.BO.EntityType original, bool assignClientKey) : this(original)
        {
            _clientKey = DTOHelper.GetClientKey(original, Id);
        }
        public EntityTypeDataSet_EntityTypeDTO(DigicircMatchmaking.BO.EntityType original)
        {
            if(original == null) throw new ApplicationException(BaseViewPage<object>.GetResourceValue("GlobalResources", "RES_DATASOURCE_Null_Value_In_Resultset", null, "The resultset of your DataSource contains null values."));
            _key = (original.Id == 0) ? original._GetUniqueIdentifier() as object : original.Id as object;
            Id = original.Id;
            if (!DTOHelper.SeenDTOInstances.ContainsKey(original))
            {
                DTOHelper.SeenDTOInstances.Add(original, this);
            }
            Value = original.Value;
        }

        public new static DigicircMatchmaking.BO.EntityType GetModelByKey(object _key)
        {
            var rawKey = _key.ToString();
            var parsedKey = int.Parse(rawKey);
            return new DAL.Repository().GetById<DigicircMatchmaking.BO.EntityType>(parsedKey, false, false);
        }
        public new DigicircMatchmaking.BO.EntityType Convert()
        {
            var model = new DigicircMatchmaking.BO.EntityType();
            if (_key != null && _key.ToString() != "0")
            {
                var rawKey = _key.ToString();
                var parsedKey = int.Parse(rawKey);
                model = new DAL.Repository().GetById<DigicircMatchmaking.BO.EntityType>(parsedKey, false, false) ?? model;
            }
            if (!DTOHelper.SeenModelInstances.ContainsKey(this))
            {
                DTOHelper.SeenModelInstances.Add(this, model);
            }
            model.Id = Id ?? 0;
            model.Value = Value;
            DTOHelper.UpdateSeenModelInstances(this, model);
            return model;
        }

    }
    [OriginalType(typeof(DigicircMatchmaking.BO.ValueType))]
    [DataSetDTO]
    public class EntityTypeDataSet_ValueTypeDTO : ViewModelDTOBase, IViewModelDTO<DigicircMatchmaking.BO.ValueType>
    {
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.BO.ValueType).FullName;
        public string _versionTimestamp;
        public int? Id;
        public new object _key
        {
            get;
            set;
        }
        public string Value;


        [JsonConstructor]
        public EntityTypeDataSet_ValueTypeDTO() : base() {}
        public  static EntityTypeDataSet_ValueTypeDTO GetInstance(object key, string jbID)
        {
            if (key == null) return null;
            var rawKey = key.ToString();
            var parsedKey = int.Parse(rawKey);
            var foundEntry = new DAL.Repository().GetById<DigicircMatchmaking.BO.ValueType>(parsedKey, false, false);
            if(foundEntry == null && !string.IsNullOrWhiteSpace(jbID))
            {
                if(int.TryParse(rawKey, out int _uniqueKey))
                {
                    var controller = new CompanyListController();
                    var method = controller.GetType().GetMethod($"Get_{jbID}_DatasourceQueryable");
                    var records = method.Invoke(controller, new object[] { System.Type.Missing, System.Type.Missing }) as IQueryable<DigicircMatchmaking.BO.ValueType>;
                    foundEntry = records.Where(c => c._GetUniqueIdentifier() == _uniqueKey).FirstOrDefault();
                }
            }
            if(foundEntry != null)
            {
                return new EntityTypeDataSet_ValueTypeDTO(foundEntry);
            }
            return null;
        }
        public EntityTypeDataSet_ValueTypeDTO(DigicircMatchmaking.BO.ValueType original, bool assignClientKey) : this(original)
        {
            _clientKey = DTOHelper.GetClientKey(original, Id);
        }
        public EntityTypeDataSet_ValueTypeDTO(DigicircMatchmaking.BO.ValueType original)
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
            model.Value = Value;
            DTOHelper.UpdateSeenModelInstances(this, model);
            return model;
        }

    }


    #endregion

}