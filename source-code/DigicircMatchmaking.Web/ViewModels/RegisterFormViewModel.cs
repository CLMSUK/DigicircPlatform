// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
using System;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using DigicircMatchmaking.BO;
using DigicircMatchmaking.UI.Controllers.RegisterForm;
using AppCode;
using zAppDev.DotNet.Framework.Data;
using zAppDev.DotNet.Framework.Utilities;
using zAppDev.DotNet.Framework.Data.Domain;
using zAppDev.DotNet.Framework.Mvc;
using zAppDev.DotNet.Framework.Locales;
using System.ComponentModel.DataAnnotations;
using DigicircMatchmaking.UI.ViewModels.MasterPageSignIn;
using DigicircMatchmaking.UI.Controllers.MasterPageSignIn;
namespace DigicircMatchmaking.UI.ViewModels.RegisterForm
{
    public class RegisterFormViewModel : MasterPageSignInViewModel
    {
        public DigicircMatchmaking.BO.DigicircUser DigicircUser;
        public string Password;
        public string RetypePassword;
        public string UserName;
        public bool AcceptTerms;
        public bool FromMatching;


        public RegisterFormViewModel()
        {
            DigicircUser = new DigicircMatchmaking.BO.DigicircUser();
        }


        public override void Evict()
        {
            var manager = MiniSessionManager.Instance;
            if (manager.Session.Contains(DigicircUser))
            {
                manager.Session.Evict(DigicircUser);
            }
        }

    }


    [OriginalType(typeof(DigicircMatchmaking.UI.ViewModels.RegisterForm.RegisterFormViewModel))]
    public class RegisterFormViewModelDTO : MasterPageSignInViewModelDTO, IViewModelDTO<DigicircMatchmaking.UI.ViewModels.RegisterForm.RegisterFormViewModel>
    {

        [JsonConstructor]
        public RegisterFormViewModelDTO() { }
        public RegisterFormViewModelDTO(DigicircMatchmaking.UI.ViewModels.RegisterForm.RegisterFormViewModel original, bool parentIsDirty = false)  : base(original)
        {
            if (original == null) return;
            DigicircUser = original.DigicircUser == null ? null : new DigicircUser_DigicircUserDTO(original.DigicircUser);
            Password = original.Password;
            RetypePassword = original.RetypePassword;
            UserName = original.UserName;
            AcceptTerms = original.AcceptTerms;
            FromMatching = original.FromMatching;
        }
        public DigicircUser_DigicircUserDTO DigicircUser;
        public string Password;
        public string RetypePassword;
        public string UserName;
        public bool AcceptTerms;
        public bool FromMatching;
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.UI.ViewModels.RegisterForm.RegisterFormViewModel).FullName;

        public new DigicircMatchmaking.UI.ViewModels.RegisterForm.RegisterFormViewModel GetModel()
        {
            var alreadySeenInstance = DTOHelper.GetSeenModelInstance<DigicircMatchmaking.UI.ViewModels.RegisterForm.RegisterFormViewModel>(_clientKey, _originalTypeClassName, _baseClasses);
            if (alreadySeenInstance != null) return alreadySeenInstance;
            return new DigicircMatchmaking.UI.ViewModels.RegisterForm.RegisterFormViewModel();
        }
        new  public DigicircMatchmaking.UI.ViewModels.RegisterForm.RegisterFormViewModel Convert()
        {
            var original = GetModel();
            if (original == null)
            {
                original = new DigicircMatchmaking.UI.ViewModels.RegisterForm.RegisterFormViewModel();
            }
            DTOHelper.UpdateSeenModelInstances(this, original);
            Hydrate(original);
            return original;
        }
        public void Hydrate(DigicircMatchmaking.UI.ViewModels.RegisterForm.RegisterFormViewModel original)
        {
            if (original == null) return;
            base.Hydrate(original);
            original.DigicircUser = DigicircUser == null
                                    ? null
                                    : DigicircUser.Convert();
            original.Password = Password;
            original.RetypePassword = RetypePassword;
            original.UserName = UserName;
            original.AcceptTerms = AcceptTerms;
            original.FromMatching = FromMatching;
        }
    }

    [OriginalType(typeof(DigicircMatchmaking.BO.DigicircUser))]
    public class DigicircUser_DigicircUserDTO : ViewModelDTOBase, IViewModelDTO<DigicircMatchmaking.BO.DigicircUser>
    {

        [JsonConstructor]
        public DigicircUser_DigicircUserDTO() { }
        public DigicircUser_DigicircUserDTO(DigicircMatchmaking.BO.DigicircUser original, bool parentIsDirty = false)
        {
            if (original == null) return;
            _key = original.UserName as object;
            Email = original.Email;
            FirstName = original.FirstName;
            LastName = original.LastName;
            Name = original.Name;
            SubscribeToNewsLetter = original.SubscribeToNewsLetter;
            UserName = original.UserName;
            Roles = original.Roles?.Select(x => new DigicircUser_DigicircUser_Roles_ApplicationRoleDTO(x)).ToList();
            Permissions = original.Permissions?.Select(x => new DigicircUser_DigicircUser_Permissions_ApplicationPermissionDTO(x)).ToList();
            _clientKey = DTOHelper.GetClientKey(original, UserName);
        }
        public string Email;
        public string FirstName;
        public string LastName;
        public string Name;
        public bool SubscribeToNewsLetter;
        public string UserName;
        public new object _key
        {
            get;
            set;
        }
        public List<DigicircUser_DigicircUser_Roles_ApplicationRoleDTO> Roles;
        public List<DigicircUser_DigicircUser_Permissions_ApplicationPermissionDTO> Permissions;
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.BO.DigicircUser).FullName;
        public override List<string> _baseClasses => new List<string> {typeof(zAppDev.DotNet.Framework.Identity.Model.ApplicationUser).FullName};
        public DigicircMatchmaking.BO.DigicircUser GetModel()
        {
            var alreadySeenInstance = DTOHelper.GetSeenModelInstance<DigicircMatchmaking.BO.DigicircUser>(_clientKey, _originalTypeClassName, _baseClasses);
            if (alreadySeenInstance != null) return alreadySeenInstance;
            if (_key == null) return null;
            var rawKey = _key.ToString();
            var parsedKey = (rawKey);
            if (parsedKey == default(string) || Equals(parsedKey, default(string)))
            {
                return new DigicircMatchmaking.BO.DigicircUser();
            }
            return new DAL.Repository().GetById<DigicircMatchmaking.BO.DigicircUser>(parsedKey, false, false);
        }
        public DigicircMatchmaking.BO.DigicircUser Convert()
        {
            var original = GetModel();
            if (original == null)
            {
                original = new DigicircMatchmaking.BO.DigicircUser();
            }
            DTOHelper.UpdateSeenModelInstances(this, original);
            Hydrate(original);
            return original;
        }
        public void Hydrate(DigicircMatchmaking.BO.DigicircUser original)
        {
            if (original == null) return;
            original.Email = Email;
            original.FirstName = FirstName;
            original.LastName = LastName;
            original.Name = Name;
            original.SubscribeToNewsLetter = SubscribeToNewsLetter;
            original.UserName = UserName ?? "";
            original.Roles = Roles == null
                             ? null
                             : Roles.Select(q => q.Convert()).ToList();
            original.Permissions = Permissions == null
                                   ? null
                                   : Permissions.Select(q => q.Convert()).ToList();
        }
        public static DigicircUser_DigicircUserDTO GetInstance(object key, string jbID)
        {
            if (key == null) return null;
            var rawKey = key.ToString();
            var parsedKey = (rawKey);
            var foundEntry = new DAL.Repository().GetById<DigicircMatchmaking.BO.DigicircUser>(parsedKey, true, false);
            if(foundEntry != null)
            {
                return new DigicircUser_DigicircUserDTO(foundEntry);
            }
            return null;
        }
    }

    [OriginalType(typeof(zAppDev.DotNet.Framework.Identity.Model.ApplicationRole))]
    public class DigicircUser_DigicircUser_Roles_ApplicationRoleDTO : ViewModelDTOBase, IViewModelDTO<zAppDev.DotNet.Framework.Identity.Model.ApplicationRole>
    {

        [JsonConstructor]
        public DigicircUser_DigicircUser_Roles_ApplicationRoleDTO() { }
        public DigicircUser_DigicircUser_Roles_ApplicationRoleDTO(zAppDev.DotNet.Framework.Identity.Model.ApplicationRole original, bool parentIsDirty = false)
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
            if (string.IsNullOrEmpty(this._versionTimestamp))
                original.VersionTimestamp = 1;
            else
                original.VersionTimestamp = Int32.Parse(this._versionTimestamp);
        }
        public static DigicircUser_DigicircUser_Roles_ApplicationRoleDTO GetInstance(object key, string jbID)
        {
            if (key == null) return null;
            var rawKey = key.ToString();
            var parsedKey = int.Parse(rawKey);
            var foundEntry = new DAL.Repository().GetById<zAppDev.DotNet.Framework.Identity.Model.ApplicationRole>(parsedKey, true, false);
            if(foundEntry != null)
            {
                return new DigicircUser_DigicircUser_Roles_ApplicationRoleDTO(foundEntry);
            }
            return null;
        }
    }

    [OriginalType(typeof(zAppDev.DotNet.Framework.Identity.Model.ApplicationPermission))]
    public class DigicircUser_DigicircUser_Permissions_ApplicationPermissionDTO : ViewModelDTOBase, IViewModelDTO<zAppDev.DotNet.Framework.Identity.Model.ApplicationPermission>
    {

        [JsonConstructor]
        public DigicircUser_DigicircUser_Permissions_ApplicationPermissionDTO() { }
        public DigicircUser_DigicircUser_Permissions_ApplicationPermissionDTO(zAppDev.DotNet.Framework.Identity.Model.ApplicationPermission original, bool parentIsDirty = false)
        {
            if (original == null) return;
            _key = original.Id as object;
            Id = original.Id;
            Name = original.Name;
            Description = original.Description;
            IsCustom = original.IsCustom;
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
        public string Name;
        public string Description;
        public bool IsCustom;
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
            original.Id = Id ?? 0;
            original.Name = Name;
            original.Description = Description;
            original.IsCustom = IsCustom;
            if (string.IsNullOrEmpty(this._versionTimestamp))
                original.VersionTimestamp = 1;
            else
                original.VersionTimestamp = Int32.Parse(this._versionTimestamp);
        }
        public static DigicircUser_DigicircUser_Permissions_ApplicationPermissionDTO GetInstance(object key, string jbID)
        {
            if (key == null) return null;
            var rawKey = key.ToString();
            var parsedKey = int.Parse(rawKey);
            var foundEntry = new DAL.Repository().GetById<zAppDev.DotNet.Framework.Identity.Model.ApplicationPermission>(parsedKey, true, false);
            if(foundEntry != null)
            {
                return new DigicircUser_DigicircUser_Permissions_ApplicationPermissionDTO(foundEntry);
            }
            return null;
        }
    }


    #region Datasource DTOs
    [OriginalType(typeof(zAppDev.DotNet.Framework.Identity.Model.Profile))]
    [DataSetDTO]
    public class ProfileDataSource_ProfileDTO : ViewModelDTOBase, IViewModelDTO<zAppDev.DotNet.Framework.Identity.Model.Profile>
    {
        public override string _originalTypeClassName => typeof(zAppDev.DotNet.Framework.Identity.Model.Profile).FullName;
        public string _versionTimestamp;
        public int? Id;
        public new object _key
        {
            get;
            set;
        }


        [JsonConstructor]
        public ProfileDataSource_ProfileDTO() : base() {}
        public  static ProfileDataSource_ProfileDTO GetInstance(object key, string jbID)
        {
            if (key == null) return null;
            var rawKey = key.ToString();
            var parsedKey = int.Parse(rawKey);
            var foundEntry = new DAL.Repository().GetById<zAppDev.DotNet.Framework.Identity.Model.Profile>(parsedKey, false, false);
            if(foundEntry == null && !string.IsNullOrWhiteSpace(jbID))
            {
                if(int.TryParse(rawKey, out int _uniqueKey))
                {
                    var controller = new RegisterFormController();
                    var method = controller.GetType().GetMethod($"Get_{jbID}_DatasourceQueryable");
                    var records = method.Invoke(controller, new object[] { System.Type.Missing, System.Type.Missing }) as IQueryable<zAppDev.DotNet.Framework.Identity.Model.Profile>;
                    foundEntry = records.Where(c => c._GetUniqueIdentifier() == _uniqueKey).FirstOrDefault();
                }
            }
            if(foundEntry != null)
            {
                return new ProfileDataSource_ProfileDTO(foundEntry);
            }
            return null;
        }
        public ProfileDataSource_ProfileDTO(zAppDev.DotNet.Framework.Identity.Model.Profile original, bool assignClientKey) : this(original)
        {
            _clientKey = DTOHelper.GetClientKey(original, Id);
        }
        public ProfileDataSource_ProfileDTO(zAppDev.DotNet.Framework.Identity.Model.Profile original)
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
        }

        public static zAppDev.DotNet.Framework.Identity.Model.Profile GetModelByKey(object _key)
        {
            var rawKey = _key.ToString();
            var parsedKey = int.Parse(rawKey);
            return new DAL.Repository().GetById<zAppDev.DotNet.Framework.Identity.Model.Profile>(parsedKey, false, false);
        }
        public zAppDev.DotNet.Framework.Identity.Model.Profile Convert()
        {
            var model = new zAppDev.DotNet.Framework.Identity.Model.Profile();
            if (_key != null && _key.ToString() != "0")
            {
                var rawKey = _key.ToString();
                var parsedKey = int.Parse(rawKey);
                model = new DAL.Repository().GetById<zAppDev.DotNet.Framework.Identity.Model.Profile>(parsedKey, false, false) ?? model;
            }
            if (!DTOHelper.SeenModelInstances.ContainsKey(this))
            {
                DTOHelper.SeenModelInstances.Add(this, model);
            }
            model.Id = Id ?? 0;
            DTOHelper.UpdateSeenModelInstances(this, model);
            return model;
        }

    }

    #endregion

}