// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
using System;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using DigicircMatchmaking.BO;
using DigicircMatchmaking.UI.Controllers.ClusterList;
using AppCode;
using zAppDev.DotNet.Framework.Data;
using zAppDev.DotNet.Framework.Utilities;
using zAppDev.DotNet.Framework.Data.Domain;
using zAppDev.DotNet.Framework.Mvc;
using zAppDev.DotNet.Framework.Locales;
using System.ComponentModel.DataAnnotations;
using DigicircMatchmaking.UI.ViewModels.MasterPage;
using DigicircMatchmaking.UI.Controllers.MasterPage;
namespace DigicircMatchmaking.UI.ViewModels.ClusterList
{
    public class ClusterListViewModel : MasterPageViewModel
    {
        public List<SelectedItemInfo<DigicircMatchmaking.BO.Actor>> ActorListSelectedItems;


        public ClusterListViewModel()
        {
        }


        public override void Evict()
        {
            var manager = MiniSessionManager.Instance;
        }

    }


    [OriginalType(typeof(DigicircMatchmaking.UI.ViewModels.ClusterList.ClusterListViewModel))]
    public class ClusterListViewModelDTO : MasterPageViewModelDTO, IViewModelDTO<DigicircMatchmaking.UI.ViewModels.ClusterList.ClusterListViewModel>
    {

        [JsonConstructor]
        public ClusterListViewModelDTO() { }
        public ClusterListViewModelDTO(DigicircMatchmaking.UI.ViewModels.ClusterList.ClusterListViewModel original, bool parentIsDirty = false)  : base(original)
        {
            if (original == null) return;
            ActorListSelectedItemKeys = original.ActorListSelectedItems == null
                                        ? null
                                        : original.ActorListSelectedItems.Select(x => new SelectedItemInfo<int?>(x.SelectedItems.Select(y => y.Id).ToList(), x.Indexes, x.FullRecordsetSelected)).ToList();
        }
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.UI.ViewModels.ClusterList.ClusterListViewModel).FullName;
        public List<SelectedItemInfo<int?>> ActorListSelectedItemKeys;

        public new DigicircMatchmaking.UI.ViewModels.ClusterList.ClusterListViewModel GetModel()
        {
            var alreadySeenInstance = DTOHelper.GetSeenModelInstance<DigicircMatchmaking.UI.ViewModels.ClusterList.ClusterListViewModel>(_clientKey, _originalTypeClassName, _baseClasses);
            if (alreadySeenInstance != null) return alreadySeenInstance;
            return new DigicircMatchmaking.UI.ViewModels.ClusterList.ClusterListViewModel();
        }
        new  public DigicircMatchmaking.UI.ViewModels.ClusterList.ClusterListViewModel Convert()
        {
            var original = GetModel();
            if (original == null)
            {
                original = new DigicircMatchmaking.UI.ViewModels.ClusterList.ClusterListViewModel();
            }
            DTOHelper.UpdateSeenModelInstances(this, original);
            Hydrate(original);
            return original;
        }
        public void Hydrate(DigicircMatchmaking.UI.ViewModels.ClusterList.ClusterListViewModel original)
        {
            if (original == null) return;
            base.Hydrate(original);
            original.ActorListSelectedItems = ActorListSelectedItemKeys == null
                                              ? new List<SelectedItemInfo<DigicircMatchmaking.BO.Actor>>()
                                              : ActorListSelectedItemKeys.Select(x => new SelectedItemInfo<DigicircMatchmaking.BO.Actor>(x.SelectedItems.Select(y => ViewModels.ClusterList.ActorDataSet_ActorDTO.GetModelByKey(y)).ToList(), x.Indexes, x.FullRecordsetSelected)).ToList();
        }
    }


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
        public int? GetCountOfClusterMembers;


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
                    var controller = new ClusterListController();
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
            GetCountOfClusterMembers = original.GetCountOfClusterMembers;
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
            model.GetCountOfClusterMembers = GetCountOfClusterMembers;
            DTOHelper.UpdateSeenModelInstances(this, model);
            return model;
        }

    }

    #endregion

}
