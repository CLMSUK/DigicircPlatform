// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
using System;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using DigicircMatchmaking.BO;
using DigicircMatchmaking.UI.Controllers.RolesList;
using AppCode;
using zAppDev.DotNet.Framework.Data;
using zAppDev.DotNet.Framework.Utilities;
using zAppDev.DotNet.Framework.Data.Domain;
using zAppDev.DotNet.Framework.Mvc;
using zAppDev.DotNet.Framework.Locales;
using System.ComponentModel.DataAnnotations;
using DigicircMatchmaking.UI.ViewModels.MasterPage;
using DigicircMatchmaking.UI.Controllers.MasterPage;
namespace DigicircMatchmaking.UI.ViewModels.RolesList
{
    public class RolesListViewModel : MasterPageViewModel
    {
        public zAppDev.DotNet.Framework.Identity.Model.ApplicationRole ApplicationRole;
        public List<SelectedItemInfo<zAppDev.DotNet.Framework.Identity.Model.ApplicationRole>> ListSelectedItems;


        public RolesListViewModel()
        {
            ApplicationRole = new zAppDev.DotNet.Framework.Identity.Model.ApplicationRole();
        }


        public override void Evict()
        {
            var manager = MiniSessionManager.Instance;
            if (manager.Session.Contains(ApplicationRole))
            {
                manager.Session.Evict(ApplicationRole);
            }
        }

    }


    [OriginalType(typeof(DigicircMatchmaking.UI.ViewModels.RolesList.RolesListViewModel))]
    public class RolesListViewModelDTO : MasterPageViewModelDTO, IViewModelDTO<DigicircMatchmaking.UI.ViewModels.RolesList.RolesListViewModel>
    {

        [JsonConstructor]
        public RolesListViewModelDTO() { }
        public RolesListViewModelDTO(DigicircMatchmaking.UI.ViewModels.RolesList.RolesListViewModel original, bool parentIsDirty = false)  : base(original)
        {
            if (original == null) return;
            ApplicationRole = original.ApplicationRole == null ? null : new ApplicationRole_ApplicationRoleDTO(original.ApplicationRole);
            ListSelectedItemKeys = original.ListSelectedItems == null
                                   ? null
                                   : original.ListSelectedItems.Select(x => new SelectedItemInfo<int?>(x.SelectedItems.Select(y => y.Id).ToList(), x.Indexes, x.FullRecordsetSelected)).ToList();
        }
        public ApplicationRole_ApplicationRoleDTO ApplicationRole;
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.UI.ViewModels.RolesList.RolesListViewModel).FullName;
        public List<SelectedItemInfo<int?>> ListSelectedItemKeys;

        public new DigicircMatchmaking.UI.ViewModels.RolesList.RolesListViewModel GetModel()
        {
            var alreadySeenInstance = DTOHelper.GetSeenModelInstance<DigicircMatchmaking.UI.ViewModels.RolesList.RolesListViewModel>(_clientKey, _originalTypeClassName, _baseClasses);
            if (alreadySeenInstance != null) return alreadySeenInstance;
            return new DigicircMatchmaking.UI.ViewModels.RolesList.RolesListViewModel();
        }
        new  public DigicircMatchmaking.UI.ViewModels.RolesList.RolesListViewModel Convert()
        {
            var original = GetModel();
            if (original == null)
            {
                original = new DigicircMatchmaking.UI.ViewModels.RolesList.RolesListViewModel();
            }
            DTOHelper.UpdateSeenModelInstances(this, original);
            Hydrate(original);
            return original;
        }
        public void Hydrate(DigicircMatchmaking.UI.ViewModels.RolesList.RolesListViewModel original)
        {
            if (original == null) return;
            base.Hydrate(original);
            original.ApplicationRole = ApplicationRole == null
                                       ? null
                                       : ApplicationRole.Convert();
            original.ListSelectedItems = ListSelectedItemKeys == null
                                         ? new List<SelectedItemInfo<zAppDev.DotNet.Framework.Identity.Model.ApplicationRole>>()
                                         : ListSelectedItemKeys.Select(x => new SelectedItemInfo<zAppDev.DotNet.Framework.Identity.Model.ApplicationRole>(x.SelectedItems.Select(y => ViewModels.RolesList.List1DataSet_ApplicationRoleDTO.GetModelByKey(y)).ToList(), x.Indexes, x.FullRecordsetSelected)).ToList();
        }
    }

    [OriginalType(typeof(zAppDev.DotNet.Framework.Identity.Model.ApplicationRole))]
    public class ApplicationRole_ApplicationRoleDTO : ViewModelDTOBase, IViewModelDTO<zAppDev.DotNet.Framework.Identity.Model.ApplicationRole>
    {

        [JsonConstructor]
        public ApplicationRole_ApplicationRoleDTO() { }
        public ApplicationRole_ApplicationRoleDTO(zAppDev.DotNet.Framework.Identity.Model.ApplicationRole original, bool parentIsDirty = false)
        {
            if (original == null) return;
            _key = original.Id as object;
            Description = original.Description;
            Id = original.Id;
            IsCustom = original.IsCustom;
            Name = original.Name;
            Permissions = original.Permissions?.Select(x => new ApplicationRole_ApplicationRole_Permissions_ApplicationPermissionDTO(x)).ToList();
            if (original.VersionTimestamp != null)
            {
                _versionTimestamp = original.VersionTimestamp.ToString();
            }
            _clientKey = DTOHelper.GetClientKey(original, Id);
        }
        public string Description;
        public int? Id;
        public new object _key
        {
            get;
            set;
        }
        public bool IsCustom;
        public string Name;
        public List<ApplicationRole_ApplicationRole_Permissions_ApplicationPermissionDTO> Permissions;
        public string _versionTimestamp;
        public override string _originalTypeClassName => typeof(zAppDev.DotNet.Framework.Identity.Model.ApplicationRole).FullName;
        public override List<string> _baseClasses => null;
        public zAppDev.DotNet.Framework.Identity.Model.ApplicationRole GetModel()
        {
            var alreadySeenInstance = DTOHelper.GetSeenModelInstance<zAppDev.DotNet.Framework.Identity.Model.ApplicationRole>(_clientKey, _originalTypeClassName, _baseClasses);
            if (alreadySeenInstance != null) return alreadySeenInstance;
            if (_key == null) return null;
            var rawKey = _key.ToString();
            var parsedKey = int.Parse(rawKey);
            if (parsedKey == default(int) || Equals(parsedKey, default(int)))
            {
                return new zAppDev.DotNet.Framework.Identity.Model.ApplicationRole();
            }
            return new DAL.Repository().GetById<zAppDev.DotNet.Framework.Identity.Model.ApplicationRole>(parsedKey, false, false);
        }
        public zAppDev.DotNet.Framework.Identity.Model.ApplicationRole Convert()
        {
            var original = GetModel();
            if (original == null)
            {
                original = new zAppDev.DotNet.Framework.Identity.Model.ApplicationRole();
            }
            DTOHelper.UpdateSeenModelInstances(this, original);
            Hydrate(original);
            return original;
        }
        public void Hydrate(zAppDev.DotNet.Framework.Identity.Model.ApplicationRole original)
        {
            if (original == null) return;
            original.Description = Description;
            original.Id = Id ?? 0;
            original.IsCustom = IsCustom;
            original.Name = Name;
            original.Permissions = Permissions == null
                                   ? null
                                   : Permissions.Select(q => q.Convert()).ToList();
            if (string.IsNullOrEmpty(this._versionTimestamp))
                original.VersionTimestamp = 1;
            else
                original.VersionTimestamp = Int32.Parse(this._versionTimestamp);
        }
        public static ApplicationRole_ApplicationRoleDTO GetInstance(object key, string jbID)
        {
            if (key == null) return null;
            var rawKey = key.ToString();
            var parsedKey = int.Parse(rawKey);
            var foundEntry = new DAL.Repository().GetById<zAppDev.DotNet.Framework.Identity.Model.ApplicationRole>(parsedKey, true, false);
            if(foundEntry != null)
            {
                return new ApplicationRole_ApplicationRoleDTO(foundEntry);
            }
            return null;
        }
    }

    [OriginalType(typeof(zAppDev.DotNet.Framework.Identity.Model.ApplicationPermission))]
    public class ApplicationRole_ApplicationRole_Permissions_ApplicationPermissionDTO : ViewModelDTOBase, IViewModelDTO<zAppDev.DotNet.Framework.Identity.Model.ApplicationPermission>
    {

        [JsonConstructor]
        public ApplicationRole_ApplicationRole_Permissions_ApplicationPermissionDTO() { }
        public ApplicationRole_ApplicationRole_Permissions_ApplicationPermissionDTO(zAppDev.DotNet.Framework.Identity.Model.ApplicationPermission original, bool parentIsDirty = false)
        {
            if (original == null) return;
            _key = original.Id as object;
            Description = original.Description;
            Id = original.Id;
            IsCustom = original.IsCustom;
            Name = original.Name;
            if (original.VersionTimestamp != null)
            {
                _versionTimestamp = original.VersionTimestamp.ToString();
            }
            _clientKey = DTOHelper.GetClientKey(original, Id);
        }
        public string Description;
        public int? Id;
        public new object _key
        {
            get;
            set;
        }
        public bool IsCustom;
        public string Name;
        public string _versionTimestamp;
        public override string _originalTypeClassName => typeof(zAppDev.DotNet.Framework.Identity.Model.ApplicationPermission).FullName;
        public override List<string> _baseClasses => null;
        public zAppDev.DotNet.Framework.Identity.Model.ApplicationPermission GetModel()
        {
            var alreadySeenInstance = DTOHelper.GetSeenModelInstance<zAppDev.DotNet.Framework.Identity.Model.ApplicationPermission>(_clientKey, _originalTypeClassName, _baseClasses);
            if (alreadySeenInstance != null) return alreadySeenInstance;
            if (_key == null) return null;
            var rawKey = _key.ToString();
            var parsedKey = int.Parse(rawKey);
            if (parsedKey == default(int) || Equals(parsedKey, default(int)))
            {
                return new zAppDev.DotNet.Framework.Identity.Model.ApplicationPermission();
            }
            return new DAL.Repository().GetById<zAppDev.DotNet.Framework.Identity.Model.ApplicationPermission>(parsedKey, false, false);
        }
        public zAppDev.DotNet.Framework.Identity.Model.ApplicationPermission Convert()
        {
            var original = GetModel();
            if (original == null)
            {
                original = new zAppDev.DotNet.Framework.Identity.Model.ApplicationPermission();
            }
            DTOHelper.UpdateSeenModelInstances(this, original);
            Hydrate(original);
            return original;
        }
        public void Hydrate(zAppDev.DotNet.Framework.Identity.Model.ApplicationPermission original)
        {
            if (original == null) return;
            original.Description = Description;
            original.Id = Id ?? 0;
            original.IsCustom = IsCustom;
            original.Name = Name;
            if (string.IsNullOrEmpty(this._versionTimestamp))
                original.VersionTimestamp = 1;
            else
                original.VersionTimestamp = Int32.Parse(this._versionTimestamp);
        }
        public static ApplicationRole_ApplicationRole_Permissions_ApplicationPermissionDTO GetInstance(object key, string jbID)
        {
            if (key == null) return null;
            var rawKey = key.ToString();
            var parsedKey = int.Parse(rawKey);
            var foundEntry = new DAL.Repository().GetById<zAppDev.DotNet.Framework.Identity.Model.ApplicationPermission>(parsedKey, true, false);
            if(foundEntry != null)
            {
                return new ApplicationRole_ApplicationRole_Permissions_ApplicationPermissionDTO(foundEntry);
            }
            return null;
        }
    }


    #region Datasource DTOs
    [OriginalType(typeof(zAppDev.DotNet.Framework.Identity.Model.ApplicationRole))]
    [DataSetDTO]
    public class List1DataSet_ApplicationRoleDTO : ViewModelDTOBase, IViewModelDTO<zAppDev.DotNet.Framework.Identity.Model.ApplicationRole>
    {
        public override string _originalTypeClassName => typeof(zAppDev.DotNet.Framework.Identity.Model.ApplicationRole).FullName;
        public string _versionTimestamp;
        public int? Id;
        public new object _key
        {
            get;
            set;
        }
        public string Name;
        public string Description;
        public bool IsCustom;


        [JsonConstructor]
        public List1DataSet_ApplicationRoleDTO() : base() {}
        public  static List1DataSet_ApplicationRoleDTO GetInstance(object key, string jbID)
        {
            if (key == null) return null;
            var rawKey = key.ToString();
            var parsedKey = int.Parse(rawKey);
            var foundEntry = new DAL.Repository().GetById<zAppDev.DotNet.Framework.Identity.Model.ApplicationRole>(parsedKey, false, false);
            if(foundEntry == null && !string.IsNullOrWhiteSpace(jbID))
            {
                if(int.TryParse(rawKey, out int _uniqueKey))
                {
                    var controller = new RolesListController();
                    var method = controller.GetType().GetMethod($"Get_{jbID}_DatasourceQueryable");
                    var records = method.Invoke(controller, new object[] { System.Type.Missing, System.Type.Missing }) as IQueryable<zAppDev.DotNet.Framework.Identity.Model.ApplicationRole>;
                    foundEntry = records.Where(c => c._GetUniqueIdentifier() == _uniqueKey).FirstOrDefault();
                }
            }
            if(foundEntry != null)
            {
                return new List1DataSet_ApplicationRoleDTO(foundEntry);
            }
            return null;
        }
        public List1DataSet_ApplicationRoleDTO(zAppDev.DotNet.Framework.Identity.Model.ApplicationRole original, bool assignClientKey) : this(original)
        {
            _clientKey = DTOHelper.GetClientKey(original, Id);
        }
        public List1DataSet_ApplicationRoleDTO(zAppDev.DotNet.Framework.Identity.Model.ApplicationRole original)
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
            Description = original.Description;
            IsCustom = original.IsCustom;
        }

        public static zAppDev.DotNet.Framework.Identity.Model.ApplicationRole GetModelByKey(object _key)
        {
            var rawKey = _key.ToString();
            var parsedKey = int.Parse(rawKey);
            return new DAL.Repository().GetById<zAppDev.DotNet.Framework.Identity.Model.ApplicationRole>(parsedKey, false, false);
        }
        public zAppDev.DotNet.Framework.Identity.Model.ApplicationRole Convert()
        {
            var model = new zAppDev.DotNet.Framework.Identity.Model.ApplicationRole();
            if (_key != null && _key.ToString() != "0")
            {
                var rawKey = _key.ToString();
                var parsedKey = int.Parse(rawKey);
                model = new DAL.Repository().GetById<zAppDev.DotNet.Framework.Identity.Model.ApplicationRole>(parsedKey, false, false) ?? model;
            }
            if (!DTOHelper.SeenModelInstances.ContainsKey(this))
            {
                DTOHelper.SeenModelInstances.Add(this, model);
            }
            model.Id = Id ?? 0;
            model.Name = Name;
            model.Description = Description;
            model.IsCustom = IsCustom;
            DTOHelper.UpdateSeenModelInstances(this, model);
            return model;
        }

    }

    #endregion

}
