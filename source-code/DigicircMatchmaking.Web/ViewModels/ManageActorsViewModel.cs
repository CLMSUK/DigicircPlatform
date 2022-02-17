// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
using System;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using DigicircMatchmaking.BO;
using DigicircMatchmaking.UI.Controllers.ManageActors;
using AppCode;
using zAppDev.DotNet.Framework.Data;
using zAppDev.DotNet.Framework.Utilities;
using zAppDev.DotNet.Framework.Data.Domain;
using zAppDev.DotNet.Framework.Mvc;
using zAppDev.DotNet.Framework.Locales;
using System.ComponentModel.DataAnnotations;
using DigicircMatchmaking.UI.ViewModels.MasterPage;
using DigicircMatchmaking.UI.Controllers.MasterPage;
namespace DigicircMatchmaking.UI.ViewModels.ManageActors
{
    public class ManageActorsViewModel : MasterPageViewModel
    {
        public DigicircMatchmaking.BO.Actor SelectedActor;
        public List<SelectedItemInfo<DigicircMatchmaking.BO.Actor>> TableSelectedItems;

        public List<SelectedItemInfo<DigicircMatchmaking.BO.DigicircUser>> PartialViewPickListSelectedItems;


        public ManageActorsViewModel()
        {
            SelectedActor = new DigicircMatchmaking.BO.Actor();
        }


        public override void Evict()
        {
            var manager = MiniSessionManager.Instance;
            if (manager.Session.Contains(SelectedActor))
            {
                manager.Session.Evict(SelectedActor);
            }
        }

    }


    [OriginalType(typeof(DigicircMatchmaking.UI.ViewModels.ManageActors.ManageActorsViewModel))]
    public class ManageActorsViewModelDTO : MasterPageViewModelDTO, IViewModelDTO<DigicircMatchmaking.UI.ViewModels.ManageActors.ManageActorsViewModel>
    {

        [JsonConstructor]
        public ManageActorsViewModelDTO() { }
        public ManageActorsViewModelDTO(DigicircMatchmaking.UI.ViewModels.ManageActors.ManageActorsViewModel original, bool parentIsDirty = false)  : base(original)
        {
            if (original == null) return;
            SelectedActor = original.SelectedActor == null ? null : new SelectedActor_ActorDTO(original.SelectedActor);
            TableSelectedItemKeys = original.TableSelectedItems == null
                                    ? null
                                    : original.TableSelectedItems.Select(x => new SelectedItemInfo<int?>(x.SelectedItems.Select(y => y.Id).ToList(), x.Indexes, x.FullRecordsetSelected)).ToList();
        }
        public SelectedActor_ActorDTO SelectedActor;
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.UI.ViewModels.ManageActors.ManageActorsViewModel).FullName;
        public List<SelectedItemInfo<int?>> TableSelectedItemKeys;

        public List<SelectedItemInfo<string>> PartialViewPickListSelectedItemKeys;

        public new DigicircMatchmaking.UI.ViewModels.ManageActors.ManageActorsViewModel GetModel()
        {
            var alreadySeenInstance = DTOHelper.GetSeenModelInstance<DigicircMatchmaking.UI.ViewModels.ManageActors.ManageActorsViewModel>(_clientKey, _originalTypeClassName, _baseClasses);
            if (alreadySeenInstance != null) return alreadySeenInstance;
            return new DigicircMatchmaking.UI.ViewModels.ManageActors.ManageActorsViewModel();
        }
        new  public DigicircMatchmaking.UI.ViewModels.ManageActors.ManageActorsViewModel Convert()
        {
            var original = GetModel();
            if (original == null)
            {
                original = new DigicircMatchmaking.UI.ViewModels.ManageActors.ManageActorsViewModel();
            }
            DTOHelper.UpdateSeenModelInstances(this, original);
            Hydrate(original);
            return original;
        }
        public void Hydrate(DigicircMatchmaking.UI.ViewModels.ManageActors.ManageActorsViewModel original)
        {
            if (original == null) return;
            base.Hydrate(original);
            original.SelectedActor = SelectedActor == null
                                     ? null
                                     : SelectedActor.Convert();
            original.TableSelectedItems = TableSelectedItemKeys == null
                                          ? new List<SelectedItemInfo<DigicircMatchmaking.BO.Actor>>()
                                          : TableSelectedItemKeys.Select(x => new SelectedItemInfo<DigicircMatchmaking.BO.Actor>(x.SelectedItems.Select(y => ViewModels.ManageActors.ActorDataSet_ActorDTO.GetModelByKey(y)).ToList(), x.Indexes, x.FullRecordsetSelected)).ToList();
            original.PartialViewPickListSelectedItems = PartialViewPickListSelectedItemKeys == null
                    ? new List<SelectedItemInfo<DigicircMatchmaking.BO.DigicircUser>>()
                    : PartialViewPickListSelectedItemKeys.Select(x => new SelectedItemInfo<DigicircMatchmaking.BO.DigicircUser>(x.SelectedItems.Select(y => ViewModels.ActorsToAdministrators.DigicircUserDataSet_DigicircUserDTO.GetModelByKey(y)).ToList(), x.Indexes, x.FullRecordsetSelected)).ToList();
        }
    }

    [OriginalType(typeof(DigicircMatchmaking.BO.Actor))]
    public class SelectedActor_ActorDTO : ViewModelDTOBase, IViewModelDTO<DigicircMatchmaking.BO.Actor>
    {

        [JsonConstructor]
        public SelectedActor_ActorDTO() { }
        public SelectedActor_ActorDTO(DigicircMatchmaking.BO.Actor original, bool parentIsDirty = false)
        {
            if (original == null) return;
            _key = original.Id as object;
            Id = original.Id;
            Name = original.Name;
            Description = original.Description;
            ShortDescription = original.ShortDescription;
            Url = original.Url;
            Email = original.Email;
            SpecifiedEnityType = original.SpecifiedEnityType;
            MemberOfCluster = original.MemberOfCluster;
            GetCountOfClusterMembers = original.GetCountOfClusterMembers;
            ClusterName = original.ClusterName;
            Administrators = original.Administrators?.Select(x => new SelectedActor_Actor_Administrators_DigicircUserDTO(x)).ToList();
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
        public string ShortDescription;
        public string Url;
        public string Email;
        public string SpecifiedEnityType;
        public bool MemberOfCluster;
        public int? GetCountOfClusterMembers;
        public string ClusterName;
        public List<SelectedActor_Actor_Administrators_DigicircUserDTO> Administrators;
        public string _versionTimestamp;
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.BO.Actor).FullName;
        public override List<string> _baseClasses => null;
        public DigicircMatchmaking.BO.Actor GetModel()
        {
            var alreadySeenInstance = DTOHelper.GetSeenModelInstance<DigicircMatchmaking.BO.Actor>(_clientKey, _originalTypeClassName, _baseClasses);
            if (alreadySeenInstance != null) return alreadySeenInstance;
            if (_key == null) return null;
            var rawKey = _key.ToString();
            var parsedKey = int.Parse(rawKey);
            if (parsedKey == default(int) || Equals(parsedKey, default(int)))
            {
                return new DigicircMatchmaking.BO.Actor();
            }
            return new DAL.Repository().GetById<DigicircMatchmaking.BO.Actor>(parsedKey, false, false);
        }
        public DigicircMatchmaking.BO.Actor Convert()
        {
            var original = GetModel();
            if (original == null)
            {
                original = new DigicircMatchmaking.BO.Actor();
            }
            DTOHelper.UpdateSeenModelInstances(this, original);
            Hydrate(original);
            return original;
        }
        public void Hydrate(DigicircMatchmaking.BO.Actor original)
        {
            if (original == null) return;
            original.Id = Id ?? 0;
            original.Name = Name;
            original.Description = Description;
            original.ShortDescription = ShortDescription;
            original.Url = Url;
            original.Email = Email;
            original.SpecifiedEnityType = SpecifiedEnityType;
            original.MemberOfCluster = MemberOfCluster;
            original.GetCountOfClusterMembers = GetCountOfClusterMembers;
            original.ClusterName = ClusterName;
            original.Administrators = Administrators == null
                                      ? null
                                      : Administrators.Select(q => q.Convert()).ToList();
            if (string.IsNullOrEmpty(this._versionTimestamp))
                original.VersionTimestamp = 1;
            else
                original.VersionTimestamp = Int32.Parse(this._versionTimestamp);
        }
        public static SelectedActor_ActorDTO GetInstance(object key, string jbID)
        {
            if (key == null) return null;
            var rawKey = key.ToString();
            var parsedKey = int.Parse(rawKey);
            var foundEntry = new DAL.Repository().GetById<DigicircMatchmaking.BO.Actor>(parsedKey, true, false);
            if(foundEntry != null)
            {
                return new SelectedActor_ActorDTO(foundEntry);
            }
            return null;
        }
    }

    [OriginalType(typeof(DigicircMatchmaking.BO.DigicircUser))]
    public class SelectedActor_Actor_Administrators_DigicircUserDTO : ViewModelDTOBase, IViewModelDTO<DigicircMatchmaking.BO.DigicircUser>
    {

        [JsonConstructor]
        public SelectedActor_Actor_Administrators_DigicircUserDTO() { }
        public SelectedActor_Actor_Administrators_DigicircUserDTO(DigicircMatchmaking.BO.DigicircUser original, bool parentIsDirty = false)
        {
            if (original == null) return;
            _key = original.UserName as object;
            UserName = original.UserName;
            EmailConfirmed = original.EmailConfirmed;
            LockoutEnabled = original.LockoutEnabled;
            PhoneNumberConfirmed = original.PhoneNumberConfirmed;
            TwoFactorEnabled = original.TwoFactorEnabled;
            AccessFailedCount = original.AccessFailedCount;
            Name = original.Name;
            Email = original.Email;
            PhoneNumber = original.PhoneNumber;
            LockoutEndDate = original.LockoutEndDate;
            FirstName = original.FirstName;
            LastName = original.LastName;
            SubscribeToNewsLetter = original.SubscribeToNewsLetter;
            _clientKey = DTOHelper.GetClientKey(original, UserName);
        }
        public string UserName;
        public new object _key
        {
            get;
            set;
        }
        public bool EmailConfirmed;
        public bool LockoutEnabled;
        public bool PhoneNumberConfirmed;
        public bool TwoFactorEnabled;
        public int? AccessFailedCount;
        public string Name;
        public string Email;
        public string PhoneNumber;
        public DateTime? LockoutEndDate;
        public string FirstName;
        public string LastName;
        public bool SubscribeToNewsLetter;
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
            original.UserName = UserName ?? "";
            original.EmailConfirmed = EmailConfirmed;
            original.LockoutEnabled = LockoutEnabled;
            original.PhoneNumberConfirmed = PhoneNumberConfirmed;
            original.TwoFactorEnabled = TwoFactorEnabled;
            original.AccessFailedCount = AccessFailedCount;
            original.Name = Name;
            original.Email = Email;
            original.PhoneNumber = PhoneNumber;
            original.LockoutEndDate = LockoutEndDate;
            original.FirstName = FirstName;
            original.LastName = LastName;
            original.SubscribeToNewsLetter = SubscribeToNewsLetter;
        }
        public static SelectedActor_Actor_Administrators_DigicircUserDTO GetInstance(object key, string jbID)
        {
            if (key == null) return null;
            var rawKey = key.ToString();
            var parsedKey = (rawKey);
            var foundEntry = new DAL.Repository().GetById<DigicircMatchmaking.BO.DigicircUser>(parsedKey, true, false);
            if(foundEntry != null)
            {
                return new SelectedActor_Actor_Administrators_DigicircUserDTO(foundEntry);
            }
            return null;
        }
    }
    #region Controller Action DTOS
    [OriginalType(typeof(DigicircMatchmaking.BO.Actor))]
    public class ActorDTO : ViewModelDTOBase, IViewModelDTO<DigicircMatchmaking.BO.Actor>
    {
        public int? Id;
        public new object _key
        {
            get;
            set;
        }
        public string Name;
        public List<DigicircUserDTO> Administrators;


        [JsonConstructor]
        public ActorDTO() : base() {}
        public  static ActorDTO GetInstance(object key, string jbID)
        {
            if (key == null) return null;
            var rawKey = key.ToString();
            var parsedKey = int.Parse(rawKey);
            var foundEntry = new DAL.Repository().GetById<DigicircMatchmaking.BO.Actor>(parsedKey, false, false);
            if(foundEntry == null && !string.IsNullOrWhiteSpace(jbID))
            {
                if(int.TryParse(rawKey, out int _uniqueKey))
                {
                    var controller = new ManageActorsController();
                    var method = controller.GetType().GetMethod($"Get_{jbID}_DatasourceQueryable");
                    var records = method.Invoke(controller, new object[] { System.Type.Missing, System.Type.Missing }) as IQueryable<DigicircMatchmaking.BO.Actor>;
                    foundEntry = records.Where(c => c._GetUniqueIdentifier() == _uniqueKey).FirstOrDefault();
                }
            }
            if(foundEntry != null)
            {
                return new ActorDTO(foundEntry);
            }
            return null;
        }
        public ActorDTO(DigicircMatchmaking.BO.Actor original, bool assignClientKey) : this(original)
        {
            _clientKey = DTOHelper.GetClientKey(original, Id);
        }
        public ActorDTO(DigicircMatchmaking.BO.Actor original)
        {
            if(original == null) throw new ApplicationException(BaseViewPage<object>.GetResourceValue("GlobalResources", "RES_DATASOURCE_Null_Value_In_Resultset", null, "The resultset of your DataSource contains null values."));
            _key = (original.Id == 0) ? original._GetUniqueIdentifier() as object : original.Id as object;
            Id = original.Id;
            if (!DTOHelper.SeenDTOInstances.ContainsKey(original))
            {
                DTOHelper.SeenDTOInstances.Add(original, this);
            }
            Name = original.Name;
            Administrators = original.Administrators == null
                             ? new List<DigicircUserDTO>()
                             : original.Administrators.Select(q => DTOHelper.GetDTOFromModel<DigicircUserDTO>(q as DigicircMatchmaking.BO.DigicircUser)).ToList();
        }

        public static DigicircMatchmaking.BO.Actor GetModelByKey(object _key)
        {
            var rawKey = _key.ToString();
            var parsedKey = int.Parse(rawKey);
            return new DAL.Repository().GetById<DigicircMatchmaking.BO.Actor>(parsedKey, false, false);
        }
        public DigicircMatchmaking.BO.Actor Convert()
        {
            var model = new DigicircMatchmaking.BO.Actor();
            if (_key != null && _key.ToString() != "0")
            {
                var rawKey = _key.ToString();
                var parsedKey = int.Parse(rawKey);
                model = new DAL.Repository().GetById<DigicircMatchmaking.BO.Actor>(parsedKey, false, false) ?? model;
            }
            if (!DTOHelper.SeenModelInstances.ContainsKey(this))
            {
                DTOHelper.SeenModelInstances.Add(this, model);
            }
            model.Id = Id ?? 0;
            model.Name = Name;
            model.Administrators = Administrators == null
                                   ? null
                                   : Administrators.Select(q => DTOHelper.GetModelFromDTO<DigicircMatchmaking.BO.DigicircUser>(q)).ToList();
            DTOHelper.UpdateSeenModelInstances(this, model);
            return model;
        }

    }
    [OriginalType(typeof(DigicircMatchmaking.BO.DigicircUser))]
    public class DigicircUserDTO : ApplicationUserDTO, IViewModelDTO<DigicircMatchmaking.BO.DigicircUser>
    {
        public string UserName;
        public new object _key
        {
            get;
            set;
        }
        public string Name;
        public string Email;


        [JsonConstructor]
        public DigicircUserDTO() : base() {}
        public new static DigicircUserDTO GetInstance(object key, string jbID)
        {
            if (key == null) return null;
            var rawKey = key.ToString();
            var parsedKey = (rawKey);
            var foundEntry = new DAL.Repository().GetById<DigicircMatchmaking.BO.DigicircUser>(parsedKey, false, false);
            if(foundEntry == null && !string.IsNullOrWhiteSpace(jbID))
            {
                if(int.TryParse(rawKey, out int _uniqueKey))
                {
                    var controller = new ManageActorsController();
                    var method = controller.GetType().GetMethod($"Get_{jbID}_DatasourceQueryable");
                    var records = method.Invoke(controller, new object[] { System.Type.Missing, System.Type.Missing }) as IQueryable<DigicircMatchmaking.BO.DigicircUser>;
                    foundEntry = records.Where(c => c._GetUniqueIdentifier() == _uniqueKey).FirstOrDefault();
                }
            }
            if(foundEntry != null)
            {
                return new DigicircUserDTO(foundEntry);
            }
            return null;
        }
        public DigicircUserDTO(DigicircMatchmaking.BO.DigicircUser original, bool assignClientKey) : this(original)
        {
            _clientKey = DTOHelper.GetClientKey(original, UserName);
        }
        public DigicircUserDTO(DigicircMatchmaking.BO.DigicircUser original)
        {
            if(original == null) throw new ApplicationException(BaseViewPage<object>.GetResourceValue("GlobalResources", "RES_DATASOURCE_Null_Value_In_Resultset", null, "The resultset of your DataSource contains null values."));
            _key = (original.UserName == "") ? original._GetUniqueIdentifier() as object : original.UserName as object;
            UserName = original.UserName;
            if (!DTOHelper.SeenDTOInstances.ContainsKey(original))
            {
                DTOHelper.SeenDTOInstances.Add(original, this);
            }
            Name = original.Name;
            Email = original.Email;
        }

        public new static DigicircMatchmaking.BO.DigicircUser GetModelByKey(object _key)
        {
            var rawKey = _key.ToString();
            var parsedKey = (rawKey);
            return new DAL.Repository().GetById<DigicircMatchmaking.BO.DigicircUser>(parsedKey, false, false);
        }
        public new DigicircMatchmaking.BO.DigicircUser Convert()
        {
            var model = new DigicircMatchmaking.BO.DigicircUser();
            if (_key != null && _key.ToString() != "")
            {
                var rawKey = _key.ToString();
                var parsedKey = (rawKey);
                model = new DAL.Repository().GetById<DigicircMatchmaking.BO.DigicircUser>(parsedKey, false, false) ?? model;
            }
            if (!DTOHelper.SeenModelInstances.ContainsKey(this))
            {
                DTOHelper.SeenModelInstances.Add(this, model);
            }
            model.UserName = UserName ?? "";
            model.Name = Name;
            model.Email = Email;
            DTOHelper.UpdateSeenModelInstances(this, model);
            return model;
        }

    }
    [OriginalType(typeof(zAppDev.DotNet.Framework.Identity.Model.ApplicationUser))]
    public class ApplicationUserDTO : ViewModelDTOBase, IViewModelDTO<zAppDev.DotNet.Framework.Identity.Model.ApplicationUser>
    {
        public string UserName;
        public new object _key
        {
            get;
            set;
        }
        public string Name;
        public string Email;


        [JsonConstructor]
        public ApplicationUserDTO() : base() {}
        public  static ApplicationUserDTO GetInstance(object key, string jbID)
        {
            if (key == null) return null;
            var rawKey = key.ToString();
            var parsedKey = (rawKey);
            var foundEntry = new DAL.Repository().GetById<zAppDev.DotNet.Framework.Identity.Model.ApplicationUser>(parsedKey, false, false);
            if(foundEntry == null && !string.IsNullOrWhiteSpace(jbID))
            {
                if(int.TryParse(rawKey, out int _uniqueKey))
                {
                    var controller = new ManageActorsController();
                    var method = controller.GetType().GetMethod($"Get_{jbID}_DatasourceQueryable");
                    var records = method.Invoke(controller, new object[] { System.Type.Missing, System.Type.Missing }) as IQueryable<zAppDev.DotNet.Framework.Identity.Model.ApplicationUser>;
                    foundEntry = records.Where(c => c._GetUniqueIdentifier() == _uniqueKey).FirstOrDefault();
                }
            }
            if(foundEntry != null)
            {
                return new ApplicationUserDTO(foundEntry);
            }
            return null;
        }
        public ApplicationUserDTO(zAppDev.DotNet.Framework.Identity.Model.ApplicationUser original, bool assignClientKey) : this(original)
        {
            _clientKey = DTOHelper.GetClientKey(original, UserName);
        }
        public ApplicationUserDTO(zAppDev.DotNet.Framework.Identity.Model.ApplicationUser original)
        {
            if(original == null) throw new ApplicationException(BaseViewPage<object>.GetResourceValue("GlobalResources", "RES_DATASOURCE_Null_Value_In_Resultset", null, "The resultset of your DataSource contains null values."));
            _key = (original.UserName == "") ? original._GetUniqueIdentifier() as object : original.UserName as object;
            UserName = original.UserName;
            if (!DTOHelper.SeenDTOInstances.ContainsKey(original))
            {
                DTOHelper.SeenDTOInstances.Add(original, this);
            }
            Name = original.Name;
            Email = original.Email;
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
            model.Name = Name;
            model.Email = Email;
            DTOHelper.UpdateSeenModelInstances(this, model);
            return model;
        }

    }



    #endregion


    #region Datasource DTOs
    [OriginalType(typeof(DigicircMatchmaking.BO.Actor))]
    [DataSetDTO]
    public class ActorDataSet_ActorDTO : ViewModelDTOBase, IViewModelDTO<DigicircMatchmaking.BO.Actor>
    {
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.BO.Actor).FullName;
        public string _versionTimestamp;
        public int? Id;
        public new object _key
        {
            get;
            set;
        }
        public string Name;


        [JsonConstructor]
        public ActorDataSet_ActorDTO() : base() {}
        public  static ActorDataSet_ActorDTO GetInstance(object key, string jbID)
        {
            if (key == null) return null;
            var rawKey = key.ToString();
            var parsedKey = int.Parse(rawKey);
            var foundEntry = new DAL.Repository().GetById<DigicircMatchmaking.BO.Actor>(parsedKey, false, false);
            if(foundEntry == null && !string.IsNullOrWhiteSpace(jbID))
            {
                if(int.TryParse(rawKey, out int _uniqueKey))
                {
                    var controller = new ManageActorsController();
                    var method = controller.GetType().GetMethod($"Get_{jbID}_DatasourceQueryable");
                    var records = method.Invoke(controller, new object[] { System.Type.Missing, System.Type.Missing }) as IQueryable<DigicircMatchmaking.BO.Actor>;
                    foundEntry = records.Where(c => c._GetUniqueIdentifier() == _uniqueKey).FirstOrDefault();
                }
            }
            if(foundEntry != null)
            {
                return new ActorDataSet_ActorDTO(foundEntry);
            }
            return null;
        }
        public ActorDataSet_ActorDTO(DigicircMatchmaking.BO.Actor original, bool assignClientKey) : this(original)
        {
            _clientKey = DTOHelper.GetClientKey(original, Id);
        }
        public ActorDataSet_ActorDTO(DigicircMatchmaking.BO.Actor original)
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
        }

        public static DigicircMatchmaking.BO.Actor GetModelByKey(object _key)
        {
            var rawKey = _key.ToString();
            var parsedKey = int.Parse(rawKey);
            return new DAL.Repository().GetById<DigicircMatchmaking.BO.Actor>(parsedKey, false, false);
        }
        public DigicircMatchmaking.BO.Actor Convert()
        {
            var model = new DigicircMatchmaking.BO.Actor();
            if (_key != null && _key.ToString() != "0")
            {
                var rawKey = _key.ToString();
                var parsedKey = int.Parse(rawKey);
                model = new DAL.Repository().GetById<DigicircMatchmaking.BO.Actor>(parsedKey, false, false) ?? model;
            }
            if (!DTOHelper.SeenModelInstances.ContainsKey(this))
            {
                DTOHelper.SeenModelInstances.Add(this, model);
            }
            model.Id = Id ?? 0;
            model.Name = Name;
            DTOHelper.UpdateSeenModelInstances(this, model);
            return model;
        }

    }

    [OriginalType(typeof(DigicircMatchmaking.BO.DigicircUser))]
    [DataSetDTO]
    public class DigicircUserDataSet_DigicircUserDTO : DigicircUserDataSet_ApplicationUserDTO, IViewModelDTO<DigicircMatchmaking.BO.DigicircUser>
    {
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.BO.DigicircUser).FullName;
        public string UserName;
        public new object _key
        {
            get;
            set;
        }


        [JsonConstructor]
        public DigicircUserDataSet_DigicircUserDTO() : base() {}
        public new static DigicircUserDataSet_DigicircUserDTO GetInstance(object key, string jbID)
        {
            if (key == null) return null;
            var rawKey = key.ToString();
            var parsedKey = (rawKey);
            var foundEntry = new DAL.Repository().GetById<DigicircMatchmaking.BO.DigicircUser>(parsedKey, false, false);
            if(foundEntry == null && !string.IsNullOrWhiteSpace(jbID))
            {
                if(int.TryParse(rawKey, out int _uniqueKey))
                {
                    var controller = new ManageActorsController();
                    var method = controller.GetType().GetMethod($"Get_{jbID}_DatasourceQueryable");
                    var records = method.Invoke(controller, new object[] { System.Type.Missing, System.Type.Missing }) as IQueryable<DigicircMatchmaking.BO.DigicircUser>;
                    foundEntry = records.Where(c => c._GetUniqueIdentifier() == _uniqueKey).FirstOrDefault();
                }
            }
            if(foundEntry != null)
            {
                return new DigicircUserDataSet_DigicircUserDTO(foundEntry);
            }
            return null;
        }
        public DigicircUserDataSet_DigicircUserDTO(DigicircMatchmaking.BO.DigicircUser original, bool assignClientKey) : this(original)
        {
            _clientKey = DTOHelper.GetClientKey(original, UserName);
        }
        public DigicircUserDataSet_DigicircUserDTO(DigicircMatchmaking.BO.DigicircUser original)
        {
            if(original == null) throw new ApplicationException(BaseViewPage<object>.GetResourceValue("GlobalResources", "RES_DATASOURCE_Null_Value_In_Resultset", null, "The resultset of your DataSource contains null values."));
            _key = (original.UserName == "") ? original._GetUniqueIdentifier() as object : original.UserName as object;
            UserName = original.UserName;
            if (!DTOHelper.SeenDTOInstances.ContainsKey(original))
            {
                DTOHelper.SeenDTOInstances.Add(original, this);
            }
        }

        public new static DigicircMatchmaking.BO.DigicircUser GetModelByKey(object _key)
        {
            var rawKey = _key.ToString();
            var parsedKey = (rawKey);
            return new DAL.Repository().GetById<DigicircMatchmaking.BO.DigicircUser>(parsedKey, false, false);
        }
        public new DigicircMatchmaking.BO.DigicircUser Convert()
        {
            var model = new DigicircMatchmaking.BO.DigicircUser();
            if (_key != null && _key.ToString() != "")
            {
                var rawKey = _key.ToString();
                var parsedKey = (rawKey);
                model = new DAL.Repository().GetById<DigicircMatchmaking.BO.DigicircUser>(parsedKey, false, false) ?? model;
            }
            if (!DTOHelper.SeenModelInstances.ContainsKey(this))
            {
                DTOHelper.SeenModelInstances.Add(this, model);
            }
            model.UserName = UserName ?? "";
            DTOHelper.UpdateSeenModelInstances(this, model);
            return model;
        }

    }
    [OriginalType(typeof(zAppDev.DotNet.Framework.Identity.Model.ApplicationUser))]
    [DataSetDTO]
    public class DigicircUserDataSet_ApplicationUserDTO : ViewModelDTOBase, IViewModelDTO<zAppDev.DotNet.Framework.Identity.Model.ApplicationUser>
    {
        public override string _originalTypeClassName => typeof(zAppDev.DotNet.Framework.Identity.Model.ApplicationUser).FullName;
        public string _versionTimestamp;
        public string UserName;
        public new object _key
        {
            get;
            set;
        }


        [JsonConstructor]
        public DigicircUserDataSet_ApplicationUserDTO() : base() {}
        public  static DigicircUserDataSet_ApplicationUserDTO GetInstance(object key, string jbID)
        {
            if (key == null) return null;
            var rawKey = key.ToString();
            var parsedKey = (rawKey);
            var foundEntry = new DAL.Repository().GetById<zAppDev.DotNet.Framework.Identity.Model.ApplicationUser>(parsedKey, false, false);
            if(foundEntry == null && !string.IsNullOrWhiteSpace(jbID))
            {
                if(int.TryParse(rawKey, out int _uniqueKey))
                {
                    var controller = new ManageActorsController();
                    var method = controller.GetType().GetMethod($"Get_{jbID}_DatasourceQueryable");
                    var records = method.Invoke(controller, new object[] { System.Type.Missing, System.Type.Missing }) as IQueryable<zAppDev.DotNet.Framework.Identity.Model.ApplicationUser>;
                    foundEntry = records.Where(c => c._GetUniqueIdentifier() == _uniqueKey).FirstOrDefault();
                }
            }
            if(foundEntry != null)
            {
                return new DigicircUserDataSet_ApplicationUserDTO(foundEntry);
            }
            return null;
        }
        public DigicircUserDataSet_ApplicationUserDTO(zAppDev.DotNet.Framework.Identity.Model.ApplicationUser original, bool assignClientKey) : this(original)
        {
            _clientKey = DTOHelper.GetClientKey(original, UserName);
        }
        public DigicircUserDataSet_ApplicationUserDTO(zAppDev.DotNet.Framework.Identity.Model.ApplicationUser original)
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
            DTOHelper.UpdateSeenModelInstances(this, model);
            return model;
        }

    }


    #endregion

}
