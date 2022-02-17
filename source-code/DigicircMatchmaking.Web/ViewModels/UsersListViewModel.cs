// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
using System;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using DigicircMatchmaking.BO;
using DigicircMatchmaking.UI.Controllers.UsersList;
using AppCode;
using zAppDev.DotNet.Framework.Data;
using zAppDev.DotNet.Framework.Utilities;
using zAppDev.DotNet.Framework.Data.Domain;
using zAppDev.DotNet.Framework.Mvc;
using zAppDev.DotNet.Framework.Locales;
using System.ComponentModel.DataAnnotations;
using DigicircMatchmaking.UI.ViewModels.MasterPage;
using DigicircMatchmaking.UI.Controllers.MasterPage;
namespace DigicircMatchmaking.UI.ViewModels.UsersList
{
    public class UsersListViewModel : MasterPageViewModel
    {
        public List<SelectedItemInfo<zAppDev.DotNet.Framework.Identity.Model.ApplicationUser>> ListSelectedItems;


        public UsersListViewModel()
        {
        }


        public override void Evict()
        {
            var manager = MiniSessionManager.Instance;
        }

    }


    [OriginalType(typeof(DigicircMatchmaking.UI.ViewModels.UsersList.UsersListViewModel))]
    public class UsersListViewModelDTO : MasterPageViewModelDTO, IViewModelDTO<DigicircMatchmaking.UI.ViewModels.UsersList.UsersListViewModel>
    {

        [JsonConstructor]
        public UsersListViewModelDTO() { }
        public UsersListViewModelDTO(DigicircMatchmaking.UI.ViewModels.UsersList.UsersListViewModel original, bool parentIsDirty = false)  : base(original)
        {
            if (original == null) return;
            ListSelectedItemKeys = original.ListSelectedItems == null
                                   ? null
                                   : original.ListSelectedItems.Select(x => new SelectedItemInfo<string>(x.SelectedItems.Select(y => y.UserName).ToList(), x.Indexes, x.FullRecordsetSelected)).ToList();
        }
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.UI.ViewModels.UsersList.UsersListViewModel).FullName;
        public List<SelectedItemInfo<string>> ListSelectedItemKeys;

        public new DigicircMatchmaking.UI.ViewModels.UsersList.UsersListViewModel GetModel()
        {
            var alreadySeenInstance = DTOHelper.GetSeenModelInstance<DigicircMatchmaking.UI.ViewModels.UsersList.UsersListViewModel>(_clientKey, _originalTypeClassName, _baseClasses);
            if (alreadySeenInstance != null) return alreadySeenInstance;
            return new DigicircMatchmaking.UI.ViewModels.UsersList.UsersListViewModel();
        }
        new  public DigicircMatchmaking.UI.ViewModels.UsersList.UsersListViewModel Convert()
        {
            var original = GetModel();
            if (original == null)
            {
                original = new DigicircMatchmaking.UI.ViewModels.UsersList.UsersListViewModel();
            }
            DTOHelper.UpdateSeenModelInstances(this, original);
            Hydrate(original);
            return original;
        }
        public void Hydrate(DigicircMatchmaking.UI.ViewModels.UsersList.UsersListViewModel original)
        {
            if (original == null) return;
            base.Hydrate(original);
            original.ListSelectedItems = ListSelectedItemKeys == null
                                         ? new List<SelectedItemInfo<zAppDev.DotNet.Framework.Identity.Model.ApplicationUser>>()
                                         : ListSelectedItemKeys.Select(x => new SelectedItemInfo<zAppDev.DotNet.Framework.Identity.Model.ApplicationUser>(x.SelectedItems.Select(y => ViewModels.UsersList.List1DataSet_ApplicationUserDTO.GetModelByKey(y)).ToList(), x.Indexes, x.FullRecordsetSelected)).ToList();
        }
    }


    #region Datasource DTOs
    [OriginalType(typeof(zAppDev.DotNet.Framework.Identity.Model.ApplicationUser))]
    [DataSetDTO]
    public class List1DataSet_ApplicationUserDTO : ViewModelDTOBase, IViewModelDTO<zAppDev.DotNet.Framework.Identity.Model.ApplicationUser>
    {
        public override string _originalTypeClassName => typeof(zAppDev.DotNet.Framework.Identity.Model.ApplicationUser).FullName;
        public string _versionTimestamp;
        public string UserName;
        public new object _key
        {
            get;
            set;
        }
        public string Email;
        public string Name;
        public bool LockoutEnabled;


        [JsonConstructor]
        public List1DataSet_ApplicationUserDTO() : base() {}
        public  static List1DataSet_ApplicationUserDTO GetInstance(object key, string jbID)
        {
            if (key == null) return null;
            var rawKey = key.ToString();
            var parsedKey = (rawKey);
            var foundEntry = new DAL.Repository().GetById<zAppDev.DotNet.Framework.Identity.Model.ApplicationUser>(parsedKey, false, false);
            if(foundEntry == null && !string.IsNullOrWhiteSpace(jbID))
            {
                if(int.TryParse(rawKey, out int _uniqueKey))
                {
                    var controller = new UsersListController();
                    var method = controller.GetType().GetMethod($"Get_{jbID}_DatasourceQueryable");
                    var records = method.Invoke(controller, new object[] { System.Type.Missing, System.Type.Missing }) as IQueryable<zAppDev.DotNet.Framework.Identity.Model.ApplicationUser>;
                    foundEntry = records.Where(c => c._GetUniqueIdentifier() == _uniqueKey).FirstOrDefault();
                }
            }
            if(foundEntry != null)
            {
                return new List1DataSet_ApplicationUserDTO(foundEntry);
            }
            return null;
        }
        public List1DataSet_ApplicationUserDTO(zAppDev.DotNet.Framework.Identity.Model.ApplicationUser original, bool assignClientKey) : this(original)
        {
            _clientKey = DTOHelper.GetClientKey(original, UserName);
        }
        public List1DataSet_ApplicationUserDTO(zAppDev.DotNet.Framework.Identity.Model.ApplicationUser original)
        {
            if(original == null) throw new ApplicationException(BaseViewPage<object>.GetResourceValue("GlobalResources", "RES_DATASOURCE_Null_Value_In_Resultset", null, "The resultset of your DataSource contains null values."));
            _key = (original.UserName == "") ? original._GetUniqueIdentifier() as object : original.UserName as object;
            if (original.VersionTimestamp != null)
            {
                _versionTimestamp = original.VersionTimestamp.ToString();
            }
            UserName = original.UserName;
            if (!DTOHelper.SeenDTOInstances.ContainsKey(original))
            {
                DTOHelper.SeenDTOInstances.Add(original, this);
            }
            Email = original.Email;
            Name = original.Name;
            LockoutEnabled = original.LockoutEnabled;
        }

        public static zAppDev.DotNet.Framework.Identity.Model.ApplicationUser GetModelByKey(object _key)
        {
            var rawKey = _key.ToString();
            var parsedKey = (rawKey);
            return new DAL.Repository().GetById<zAppDev.DotNet.Framework.Identity.Model.ApplicationUser>(parsedKey, false, false);
        }
        public zAppDev.DotNet.Framework.Identity.Model.ApplicationUser Convert()
        {
            var model = new zAppDev.DotNet.Framework.Identity.Model.ApplicationUser();
            if (_key != null && _key.ToString() != "")
            {
                var rawKey = _key.ToString();
                var parsedKey = (rawKey);
                model = new DAL.Repository().GetById<zAppDev.DotNet.Framework.Identity.Model.ApplicationUser>(parsedKey, false, false) ?? model;
            }
            if (!DTOHelper.SeenModelInstances.ContainsKey(this))
            {
                DTOHelper.SeenModelInstances.Add(this, model);
            }
            model.UserName = UserName ?? "";
            model.Email = Email;
            model.Name = Name;
            model.LockoutEnabled = LockoutEnabled;
            DTOHelper.UpdateSeenModelInstances(this, model);
            return model;
        }

    }

    #endregion

}
