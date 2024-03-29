// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
using System;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using DigicircMatchmaking.BO;
using DigicircMatchmaking.UI.Controllers.GraphQueryDebug;
using AppCode;
using zAppDev.DotNet.Framework.Data;
using zAppDev.DotNet.Framework.Utilities;
using zAppDev.DotNet.Framework.Data.Domain;
using zAppDev.DotNet.Framework.Mvc;
using zAppDev.DotNet.Framework.Locales;
using System.ComponentModel.DataAnnotations;
using DigicircMatchmaking.UI.ViewModels.MasterPage;
using DigicircMatchmaking.UI.Controllers.MasterPage;
namespace DigicircMatchmaking.UI.ViewModels.GraphQueryDebug
{
    public class GraphQueryDebugViewModel : MasterPageViewModel
    {
        public DigicircMatchmaking.BO.GraphDebugResult Info;
        public string CountryName;
        public bool IsExtended;
        public List<SelectedItemInfo<DigicircMatchmaking.BO.Country>> TextBox1SelectedItems;
        public List<SelectedItemInfo<DigicircMatchmaking.BO.Nodes>> ListNodesSelectedItems;
        public List<SelectedItemInfo<DigicircMatchmaking.BO.Links>> ListLinksSelectedItems;


        public GraphQueryDebugViewModel()
        {
            Info = new DigicircMatchmaking.BO.GraphDebugResult();
        }


        public override void Evict()
        {
            var manager = MiniSessionManager.Instance;
            if (manager.Session.Contains(Info))
            {
                manager.Session.Evict(Info);
            }
        }

    }


    [OriginalType(typeof(DigicircMatchmaking.UI.ViewModels.GraphQueryDebug.GraphQueryDebugViewModel))]
    public class GraphQueryDebugViewModelDTO : MasterPageViewModelDTO, IViewModelDTO<DigicircMatchmaking.UI.ViewModels.GraphQueryDebug.GraphQueryDebugViewModel>
    {

        [JsonConstructor]
        public GraphQueryDebugViewModelDTO() { }
        public GraphQueryDebugViewModelDTO(DigicircMatchmaking.UI.ViewModels.GraphQueryDebug.GraphQueryDebugViewModel original, bool parentIsDirty = false)  : base(original)
        {
            if (original == null) return;
            Info = original.Info == null ? null : new Info_GraphDebugResultDTO(original.Info);
            CountryName = original.CountryName;
            IsExtended = original.IsExtended;
            TextBox1SelectedItemKeys = original.TextBox1SelectedItems == null
                                       ? null
                                       : original.TextBox1SelectedItems.Select(x => new SelectedItemInfo<int?>(x.SelectedItems.Select(y => y.Id).ToList(), x.Indexes, x.FullRecordsetSelected)).ToList();
            ListNodesSelectedItemKeys = original.ListNodesSelectedItems == null
                                        ? null
                                        : original.ListNodesSelectedItems.Select(x => new SelectedItemInfo<int?>(x.SelectedItems.Select(y => y.NodesKey).ToList(), x.Indexes, x.FullRecordsetSelected)).ToList();
            ListLinksSelectedItemKeys = original.ListLinksSelectedItems == null
                                        ? null
                                        : original.ListLinksSelectedItems.Select(x => new SelectedItemInfo<int?>(x.SelectedItems.Select(y => y.LinksKey).ToList(), x.Indexes, x.FullRecordsetSelected)).ToList();
        }
        public Info_GraphDebugResultDTO Info;
        public string CountryName;
        public bool IsExtended;
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.UI.ViewModels.GraphQueryDebug.GraphQueryDebugViewModel).FullName;
        public List<SelectedItemInfo<int?>> TextBox1SelectedItemKeys;
        public List<SelectedItemInfo<ViewModels.GraphQueryDebug.CountryDataSet_CountryDTO>> TextBox1__InitialSelection;
        public List<SelectedItemInfo<int?>> ListNodesSelectedItemKeys;
        public List<SelectedItemInfo<int?>> ListLinksSelectedItemKeys;

        public new DigicircMatchmaking.UI.ViewModels.GraphQueryDebug.GraphQueryDebugViewModel GetModel()
        {
            var alreadySeenInstance = DTOHelper.GetSeenModelInstance<DigicircMatchmaking.UI.ViewModels.GraphQueryDebug.GraphQueryDebugViewModel>(_clientKey, _originalTypeClassName, _baseClasses);
            if (alreadySeenInstance != null) return alreadySeenInstance;
            return new DigicircMatchmaking.UI.ViewModels.GraphQueryDebug.GraphQueryDebugViewModel();
        }
        new  public DigicircMatchmaking.UI.ViewModels.GraphQueryDebug.GraphQueryDebugViewModel Convert()
        {
            var original = GetModel();
            if (original == null)
            {
                original = new DigicircMatchmaking.UI.ViewModels.GraphQueryDebug.GraphQueryDebugViewModel();
            }
            DTOHelper.UpdateSeenModelInstances(this, original);
            Hydrate(original);
            return original;
        }
        public void Hydrate(DigicircMatchmaking.UI.ViewModels.GraphQueryDebug.GraphQueryDebugViewModel original)
        {
            if (original == null) return;
            base.Hydrate(original);
            original.Info = Info == null
                            ? null
                            : Info.Convert();
            original.CountryName = CountryName;
            original.IsExtended = IsExtended;
            original.TextBox1SelectedItems = TextBox1SelectedItemKeys == null
                                             ? new List<SelectedItemInfo<DigicircMatchmaking.BO.Country>>()
                                             : TextBox1SelectedItemKeys.Select(x => new SelectedItemInfo<DigicircMatchmaking.BO.Country>(x.SelectedItems.Select(y => ViewModels.GraphQueryDebug.CountryDataSet_CountryDTO.GetModelByKey(y)).ToList(), x.Indexes, x.FullRecordsetSelected)).ToList();
            original.ListNodesSelectedItems = ListNodesSelectedItemKeys == null
                                              ? new List<SelectedItemInfo<DigicircMatchmaking.BO.Nodes>>()
                                              : ListNodesSelectedItemKeys.Select(x => new SelectedItemInfo<DigicircMatchmaking.BO.Nodes>(x.SelectedItems.Select(y => ViewModels.GraphQueryDebug.GetAllNodes_NodesDTO.GetModelByKey(y)).ToList(), x.Indexes, x.FullRecordsetSelected)).ToList();
            original.ListLinksSelectedItems = ListLinksSelectedItemKeys == null
                                              ? new List<SelectedItemInfo<DigicircMatchmaking.BO.Links>>()
                                              : ListLinksSelectedItemKeys.Select(x => new SelectedItemInfo<DigicircMatchmaking.BO.Links>(x.SelectedItems.Select(y => ViewModels.GraphQueryDebug.GetAllLinks_LinksDTO.GetModelByKey(y)).ToList(), x.Indexes, x.FullRecordsetSelected)).ToList();
        }
        public void FillDropDownsInitialValues(GraphQueryDebugViewModel original, GraphQueryDebugController _controller)
        {
            TextBox1__InitialSelection = new List<SelectedItemInfo<ViewModels.GraphQueryDebug.CountryDataSet_CountryDTO>>();
            if (original == null) return;
            var TextBox1InitiallySelectedItem = original == null
                                                ? null
                                                : new DAL.Repository().Get<DigicircMatchmaking.BO.Country>(c => c.Name == original.CountryName).FirstOrDefault();
            if (TextBox1InitiallySelectedItem != null)
            {
                TextBox1__InitialSelection.Add
                (
                    new SelectedItemInfo<ViewModels.GraphQueryDebug.CountryDataSet_CountryDTO>(new List<ViewModels.GraphQueryDebug.CountryDataSet_CountryDTO>
                {
                    new CountryDataSet_CountryDTO(TextBox1InitiallySelectedItem)
                }, "_", false)
                );
            }
        }
    }

    [OriginalType(typeof(DigicircMatchmaking.BO.GraphDebugResult))]
    public class Info_GraphDebugResultDTO : ViewModelDTOBase, IViewModelDTO<DigicircMatchmaking.BO.GraphDebugResult>
    {

        [JsonConstructor]
        public Info_GraphDebugResultDTO() { }
        public Info_GraphDebugResultDTO(DigicircMatchmaking.BO.GraphDebugResult original, bool parentIsDirty = false)
        {
            if (original == null) return;
            Query = original.Query;
            RawResult = original.RawResult;
            Result = original.Result == null ? null : new Info_GraphDebugResult_Result_GraphBackendResponseDTO(original.Result);
        }
        public string Query;
        public string RawResult;
        public Info_GraphDebugResult_Result_GraphBackendResponseDTO Result;
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.BO.GraphDebugResult).FullName;
        public override List<string> _baseClasses => null;
        public DigicircMatchmaking.BO.GraphDebugResult GetModel()
        {
            var alreadySeenInstance = DTOHelper.GetSeenModelInstance<DigicircMatchmaking.BO.GraphDebugResult>(_clientKey, _originalTypeClassName, _baseClasses);
            if (alreadySeenInstance != null) return alreadySeenInstance;
            return new DigicircMatchmaking.BO.GraphDebugResult();
        }
        public DigicircMatchmaking.BO.GraphDebugResult Convert()
        {
            var original = GetModel();
            if (original == null)
            {
                original = new DigicircMatchmaking.BO.GraphDebugResult();
            }
            DTOHelper.UpdateSeenModelInstances(this, original);
            Hydrate(original);
            return original;
        }
        public void Hydrate(DigicircMatchmaking.BO.GraphDebugResult original)
        {
            if (original == null) return;
            original.Query = Query;
            original.RawResult = RawResult;
            original.Result = Result == null
                              ? null
                              : Result.Convert();
        }
        public  static Info_GraphDebugResultDTO GetInstance(object key, string jbID)
        {
            if (key == null) return null;
            if(string.IsNullOrWhiteSpace(jbID)) return null;
            var rawKey = key.ToString();
            var parsedKey = int.Parse(rawKey);
            var controller = new GraphQueryDebugController();
            var method = controller.GetType().GetMethod($"Get_{jbID}_DatasourceQueryable");
            var records = method.Invoke(controller, new object[] { System.Type.Missing, System.Type.Missing }) as IQueryable<DigicircMatchmaking.BO.GraphDebugResult>;
            var foundEntry = records.Where(c => c.GraphDebugResultKey == parsedKey).FirstOrDefault();
            //Second attempt, using the Unique Identifier
            if(foundEntry == null)
            {
                if(int.TryParse(rawKey, out int _uniqueKey))
                {
                    foundEntry = records.Where(x => x._GetUniqueIdentifier() == _uniqueKey).FirstOrDefault();
                }
            }
            if (foundEntry != null)
            {
                return new Info_GraphDebugResultDTO(foundEntry);
            }
            return null;
        }
    }

    [OriginalType(typeof(DigicircMatchmaking.BO.GraphBackendResponse))]
    public class Info_GraphDebugResult_Result_GraphBackendResponseDTO : ViewModelDTOBase, IViewModelDTO<DigicircMatchmaking.BO.GraphBackendResponse>
    {

        [JsonConstructor]
        public Info_GraphDebugResult_Result_GraphBackendResponseDTO() { }
        public Info_GraphDebugResult_Result_GraphBackendResponseDTO(DigicircMatchmaking.BO.GraphBackendResponse original, bool parentIsDirty = false)
        {
            if (original == null) return;
            Metadata = original.Metadata == null ? null : new Info_GraphDebugResult_Result_GraphBackendResponse_Metadata_MetadataDTO(original.Metadata);
            Nodes = original.Nodes?.Select(x => new Info_GraphDebugResult_Result_GraphBackendResponse_Nodes_NodesDTO(x)).ToList();
            Links = original.Links?.Select(x => new Info_GraphDebugResult_Result_GraphBackendResponse_Links_LinksDTO(x)).ToList();
        }
        public Info_GraphDebugResult_Result_GraphBackendResponse_Metadata_MetadataDTO Metadata;
        public List<Info_GraphDebugResult_Result_GraphBackendResponse_Nodes_NodesDTO> Nodes;
        public List<Info_GraphDebugResult_Result_GraphBackendResponse_Links_LinksDTO> Links;
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.BO.GraphBackendResponse).FullName;
        public override List<string> _baseClasses => null;
        public DigicircMatchmaking.BO.GraphBackendResponse GetModel()
        {
            var alreadySeenInstance = DTOHelper.GetSeenModelInstance<DigicircMatchmaking.BO.GraphBackendResponse>(_clientKey, _originalTypeClassName, _baseClasses);
            if (alreadySeenInstance != null) return alreadySeenInstance;
            return new DigicircMatchmaking.BO.GraphBackendResponse();
        }
        public DigicircMatchmaking.BO.GraphBackendResponse Convert()
        {
            var original = GetModel();
            if (original == null)
            {
                original = new DigicircMatchmaking.BO.GraphBackendResponse();
            }
            DTOHelper.UpdateSeenModelInstances(this, original);
            Hydrate(original);
            return original;
        }
        public void Hydrate(DigicircMatchmaking.BO.GraphBackendResponse original)
        {
            if (original == null) return;
            original.Metadata = Metadata == null
                                ? null
                                : Metadata.Convert();
            original.Nodes = Nodes == null
                             ? null
                             : Nodes.Select(q => q.Convert()).ToList();
            original.Links = Links == null
                             ? null
                             : Links.Select(q => q.Convert()).ToList();
        }
        public  static Info_GraphDebugResult_Result_GraphBackendResponseDTO GetInstance(object key, string jbID)
        {
            if (key == null) return null;
            if(string.IsNullOrWhiteSpace(jbID)) return null;
            var rawKey = key.ToString();
            var parsedKey = int.Parse(rawKey);
            var controller = new GraphQueryDebugController();
            var method = controller.GetType().GetMethod($"Get_{jbID}_DatasourceQueryable");
            var records = method.Invoke(controller, new object[] { System.Type.Missing, System.Type.Missing }) as IQueryable<DigicircMatchmaking.BO.GraphBackendResponse>;
            var foundEntry = records.Where(c => c.GraphBackendResponseKey == parsedKey).FirstOrDefault();
            //Second attempt, using the Unique Identifier
            if(foundEntry == null)
            {
                if(int.TryParse(rawKey, out int _uniqueKey))
                {
                    foundEntry = records.Where(x => x._GetUniqueIdentifier() == _uniqueKey).FirstOrDefault();
                }
            }
            if (foundEntry != null)
            {
                return new Info_GraphDebugResult_Result_GraphBackendResponseDTO(foundEntry);
            }
            return null;
        }
    }

    [OriginalType(typeof(DigicircMatchmaking.BO.Metadata))]
    public class Info_GraphDebugResult_Result_GraphBackendResponse_Metadata_MetadataDTO : ViewModelDTOBase, IViewModelDTO<DigicircMatchmaking.BO.Metadata>
    {

        [JsonConstructor]
        public Info_GraphDebugResult_Result_GraphBackendResponse_Metadata_MetadataDTO() { }
        public Info_GraphDebugResult_Result_GraphBackendResponse_Metadata_MetadataDTO(DigicircMatchmaking.BO.Metadata original, bool parentIsDirty = false)
        {
            if (original == null) return;
            ExportDataAsJson = original.ExportDataAsJson;
            Pages = original.Pages;
            PageSize = original.PageSize;
            QueryElapsedTime = original.QueryElapsedTime;
            TotalResponseElementsWithPositiveRelevanceLevel = original.TotalResponseElementsWithPositiveRelevanceLevel;
            Elements = original.Elements;
            Relations = original.Relations;
            ExportType = original.ExportType;
        }
        public bool ExportDataAsJson;
        public int? Pages;
        public int? PageSize;
        public int? QueryElapsedTime;
        public int? TotalResponseElementsWithPositiveRelevanceLevel;
        public int? Elements;
        public int? Relations;
        public string ExportType;
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.BO.Metadata).FullName;
        public override List<string> _baseClasses => null;
        public DigicircMatchmaking.BO.Metadata GetModel()
        {
            var alreadySeenInstance = DTOHelper.GetSeenModelInstance<DigicircMatchmaking.BO.Metadata>(_clientKey, _originalTypeClassName, _baseClasses);
            if (alreadySeenInstance != null) return alreadySeenInstance;
            return new DigicircMatchmaking.BO.Metadata();
        }
        public DigicircMatchmaking.BO.Metadata Convert()
        {
            var original = GetModel();
            if (original == null)
            {
                original = new DigicircMatchmaking.BO.Metadata();
            }
            DTOHelper.UpdateSeenModelInstances(this, original);
            Hydrate(original);
            return original;
        }
        public void Hydrate(DigicircMatchmaking.BO.Metadata original)
        {
            if (original == null) return;
            original.ExportDataAsJson = ExportDataAsJson;
            original.Pages = Pages;
            original.PageSize = PageSize;
            original.QueryElapsedTime = QueryElapsedTime;
            original.TotalResponseElementsWithPositiveRelevanceLevel = TotalResponseElementsWithPositiveRelevanceLevel;
            original.Elements = Elements;
            original.Relations = Relations;
            original.ExportType = ExportType;
        }
        public  static Info_GraphDebugResult_Result_GraphBackendResponse_Metadata_MetadataDTO GetInstance(object key, string jbID)
        {
            if (key == null) return null;
            if(string.IsNullOrWhiteSpace(jbID)) return null;
            var rawKey = key.ToString();
            var parsedKey = int.Parse(rawKey);
            var controller = new GraphQueryDebugController();
            var method = controller.GetType().GetMethod($"Get_{jbID}_DatasourceQueryable");
            var records = method.Invoke(controller, new object[] { System.Type.Missing, System.Type.Missing }) as IQueryable<DigicircMatchmaking.BO.Metadata>;
            var foundEntry = records.Where(c => c.MetadataKey == parsedKey).FirstOrDefault();
            //Second attempt, using the Unique Identifier
            if(foundEntry == null)
            {
                if(int.TryParse(rawKey, out int _uniqueKey))
                {
                    foundEntry = records.Where(x => x._GetUniqueIdentifier() == _uniqueKey).FirstOrDefault();
                }
            }
            if (foundEntry != null)
            {
                return new Info_GraphDebugResult_Result_GraphBackendResponse_Metadata_MetadataDTO(foundEntry);
            }
            return null;
        }
    }

    [OriginalType(typeof(DigicircMatchmaking.BO.Nodes))]
    public class Info_GraphDebugResult_Result_GraphBackendResponse_Nodes_NodesDTO : ViewModelDTOBase, IViewModelDTO<DigicircMatchmaking.BO.Nodes>
    {

        [JsonConstructor]
        public Info_GraphDebugResult_Result_GraphBackendResponse_Nodes_NodesDTO() { }
        public Info_GraphDebugResult_Result_GraphBackendResponse_Nodes_NodesDTO(DigicircMatchmaking.BO.Nodes original, bool parentIsDirty = false)
        {
            if (original == null) return;
            Name = original.Name;
            Label = original.Label;
            LabelType = original.LabelType;
            Id = original.Id;
            Graphid = original.Graphid;
            CC = original.CC;
            SL = original.SL;
            CL = original.CL;
            RL = original.RL;
            IA = original.IA;
            AL = original.AL;
            AC = original.AC;
            Attr = original.Attr;
        }
        public string Name;
        public string Label;
        public string LabelType;
        public int? Id;
        public int? Graphid;
        public bool CC;
        public int? SL;
        public float? CL;
        public float? RL;
        public bool IA;
        public int? AL;
        public float? AC;
        public bool Attr;
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.BO.Nodes).FullName;
        public override List<string> _baseClasses => null;
        public DigicircMatchmaking.BO.Nodes GetModel()
        {
            var alreadySeenInstance = DTOHelper.GetSeenModelInstance<DigicircMatchmaking.BO.Nodes>(_clientKey, _originalTypeClassName, _baseClasses);
            if (alreadySeenInstance != null) return alreadySeenInstance;
            return new DigicircMatchmaking.BO.Nodes();
        }
        public DigicircMatchmaking.BO.Nodes Convert()
        {
            var original = GetModel();
            if (original == null)
            {
                original = new DigicircMatchmaking.BO.Nodes();
            }
            DTOHelper.UpdateSeenModelInstances(this, original);
            Hydrate(original);
            return original;
        }
        public void Hydrate(DigicircMatchmaking.BO.Nodes original)
        {
            if (original == null) return;
            original.Name = Name;
            original.Label = Label;
            original.LabelType = LabelType;
            original.Id = Id;
            original.Graphid = Graphid;
            original.CC = CC;
            original.SL = SL;
            original.CL = CL;
            original.RL = RL;
            original.IA = IA;
            original.AL = AL;
            original.AC = AC;
            original.Attr = Attr;
        }
        public  static Info_GraphDebugResult_Result_GraphBackendResponse_Nodes_NodesDTO GetInstance(object key, string jbID)
        {
            if (key == null) return null;
            if(string.IsNullOrWhiteSpace(jbID)) return null;
            var rawKey = key.ToString();
            var parsedKey = int.Parse(rawKey);
            var controller = new GraphQueryDebugController();
            var method = controller.GetType().GetMethod($"Get_{jbID}_DatasourceQueryable");
            var records = method.Invoke(controller, new object[] { System.Type.Missing, System.Type.Missing }) as IQueryable<DigicircMatchmaking.BO.Nodes>;
            var foundEntry = records.Where(c => c.NodesKey == parsedKey).FirstOrDefault();
            //Second attempt, using the Unique Identifier
            if(foundEntry == null)
            {
                if(int.TryParse(rawKey, out int _uniqueKey))
                {
                    foundEntry = records.Where(x => x._GetUniqueIdentifier() == _uniqueKey).FirstOrDefault();
                }
            }
            if (foundEntry != null)
            {
                return new Info_GraphDebugResult_Result_GraphBackendResponse_Nodes_NodesDTO(foundEntry);
            }
            return null;
        }
    }

    [OriginalType(typeof(DigicircMatchmaking.BO.Links))]
    public class Info_GraphDebugResult_Result_GraphBackendResponse_Links_LinksDTO : ViewModelDTOBase, IViewModelDTO<DigicircMatchmaking.BO.Links>
    {

        [JsonConstructor]
        public Info_GraphDebugResult_Result_GraphBackendResponse_Links_LinksDTO() { }
        public Info_GraphDebugResult_Result_GraphBackendResponse_Links_LinksDTO(DigicircMatchmaking.BO.Links original, bool parentIsDirty = false)
        {
            if (original == null) return;
            Source = original.Source;
            Target = original.Target;
            Type = original.Type;
            TypeRel = original.TypeRel;
            Sid = original.Sid;
            Tid = original.Tid;
            Weight = original.Weight;
            CL = original.CL;
            RL = original.RL;
            IA = original.IA;
            AL = original.AL;
            AC = original.AC;
            Attr = original.Attr;
        }
        public int? Source;
        public int? Target;
        public string Type;
        public string TypeRel;
        public int? Sid;
        public int? Tid;
        public float? Weight;
        public float? CL;
        public float? RL;
        public bool IA;
        public int? AL;
        public float? AC;
        public bool Attr;
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.BO.Links).FullName;
        public override List<string> _baseClasses => null;
        public DigicircMatchmaking.BO.Links GetModel()
        {
            var alreadySeenInstance = DTOHelper.GetSeenModelInstance<DigicircMatchmaking.BO.Links>(_clientKey, _originalTypeClassName, _baseClasses);
            if (alreadySeenInstance != null) return alreadySeenInstance;
            return new DigicircMatchmaking.BO.Links();
        }
        public DigicircMatchmaking.BO.Links Convert()
        {
            var original = GetModel();
            if (original == null)
            {
                original = new DigicircMatchmaking.BO.Links();
            }
            DTOHelper.UpdateSeenModelInstances(this, original);
            Hydrate(original);
            return original;
        }
        public void Hydrate(DigicircMatchmaking.BO.Links original)
        {
            if (original == null) return;
            original.Source = Source;
            original.Target = Target;
            original.Type = Type;
            original.TypeRel = TypeRel;
            original.Sid = Sid;
            original.Tid = Tid;
            original.Weight = Weight;
            original.CL = CL;
            original.RL = RL;
            original.IA = IA;
            original.AL = AL;
            original.AC = AC;
            original.Attr = Attr;
        }
        public  static Info_GraphDebugResult_Result_GraphBackendResponse_Links_LinksDTO GetInstance(object key, string jbID)
        {
            if (key == null) return null;
            if(string.IsNullOrWhiteSpace(jbID)) return null;
            var rawKey = key.ToString();
            var parsedKey = int.Parse(rawKey);
            var controller = new GraphQueryDebugController();
            var method = controller.GetType().GetMethod($"Get_{jbID}_DatasourceQueryable");
            var records = method.Invoke(controller, new object[] { System.Type.Missing, System.Type.Missing }) as IQueryable<DigicircMatchmaking.BO.Links>;
            var foundEntry = records.Where(c => c.LinksKey == parsedKey).FirstOrDefault();
            //Second attempt, using the Unique Identifier
            if(foundEntry == null)
            {
                if(int.TryParse(rawKey, out int _uniqueKey))
                {
                    foundEntry = records.Where(x => x._GetUniqueIdentifier() == _uniqueKey).FirstOrDefault();
                }
            }
            if (foundEntry != null)
            {
                return new Info_GraphDebugResult_Result_GraphBackendResponse_Links_LinksDTO(foundEntry);
            }
            return null;
        }
    }


    #region Datasource DTOs
    [OriginalType(typeof(DigicircMatchmaking.BO.Links))]
    [DataSetDTO]
    public class GetAllLinks_LinksDTO : ViewModelDTOBase, IViewModelDTO<DigicircMatchmaking.BO.Links>
    {
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.BO.Links).FullName;
        public int? LinksKey;
        public new object _key
        {
            get;
            set;
        }
        public int? Source;
        public int? Target;
        public int? Sid;
        public int? Tid;
        public bool IA;
        public int? AL;
        public bool Attr;
        public float? Weight;
        public float? CL;
        public float? RL;
        public float? AC;
        public string Type;
        public string TypeRel;


        [JsonConstructor]
        public GetAllLinks_LinksDTO() : base() {}
        public  static GetAllLinks_LinksDTO GetInstance(object key, string jbID)
        {
            if (key == null) return null;
            var rawKey = key.ToString();
            var parsedKey = int.Parse(rawKey);
            var records = new GraphQueryDebugController().Get_ListLinks_DatasourceQueryable();
            var foundEntry = records.Where(c => c.LinksKey == parsedKey).FirstOrDefault();
            //Second attempt, using the Unique Identifier
            if(foundEntry == null && !string.IsNullOrWhiteSpace(jbID))
            {
                if(int.TryParse(rawKey, out int _uniqueKey))
                {
                    foundEntry = records.Where(x => x._GetUniqueIdentifier() == _uniqueKey).FirstOrDefault();
                }
            }
            if (foundEntry != null)
            {
                return new GetAllLinks_LinksDTO(foundEntry);
            }
            return null;
        }
        public GetAllLinks_LinksDTO(DigicircMatchmaking.BO.Links original, bool assignClientKey) : this(original)
        {
            _clientKey = DTOHelper.GetClientKey(original, null);
        }
        public GetAllLinks_LinksDTO(DigicircMatchmaking.BO.Links original)
        {
            if(original == null) throw new ApplicationException(BaseViewPage<object>.GetResourceValue("GlobalResources", "RES_DATASOURCE_Null_Value_In_Resultset", null, "The resultset of your DataSource contains null values."));
            _key = (original.LinksKey == 0) ? original._GetUniqueIdentifier() as object : original.LinksKey as object;
            LinksKey = original.LinksKey;
            if (!DTOHelper.SeenDTOInstances.ContainsKey(original))
            {
                DTOHelper.SeenDTOInstances.Add(original, this);
            }
            Source = original.Source;
            Target = original.Target;
            Sid = original.Sid;
            Tid = original.Tid;
            IA = original.IA;
            AL = original.AL;
            Attr = original.Attr;
            Weight = original.Weight;
            CL = original.CL;
            RL = original.RL;
            AC = original.AC;
            Type = original.Type;
            TypeRel = original.TypeRel;
        }

        public static DigicircMatchmaking.BO.Links GetModelByKey(object _key)
        {
            return null;
        }
        public DigicircMatchmaking.BO.Links Convert()
        {
            var model = new DigicircMatchmaking.BO.Links();
            if (!DTOHelper.SeenModelInstances.ContainsKey(this))
            {
                DTOHelper.SeenModelInstances.Add(this, model);
            }
            model.LinksKey = LinksKey ?? 0;
            model.Source = Source;
            model.Target = Target;
            model.Sid = Sid;
            model.Tid = Tid;
            model.IA = IA;
            model.AL = AL;
            model.Attr = Attr;
            model.Weight = Weight;
            model.CL = CL;
            model.RL = RL;
            model.AC = AC;
            model.Type = Type;
            model.TypeRel = TypeRel;
            DTOHelper.UpdateSeenModelInstances(this, model);
            return model;
        }

    }

    [OriginalType(typeof(DigicircMatchmaking.BO.Nodes))]
    [DataSetDTO]
    public class GetAllNodes_NodesDTO : ViewModelDTOBase, IViewModelDTO<DigicircMatchmaking.BO.Nodes>
    {
        public override string _originalTypeClassName => typeof(DigicircMatchmaking.BO.Nodes).FullName;
        public int? NodesKey;
        public new object _key
        {
            get;
            set;
        }
        public string Name;
        public string LabelType;
        public string Label;
        public bool CC;
        public bool IA;
        public bool Attr;
        public int? Id;
        public int? Graphid;
        public int? SL;
        public int? AL;
        public float? CL;
        public float? RL;
        public float? AC;


        [JsonConstructor]
        public GetAllNodes_NodesDTO() : base() {}
        public  static GetAllNodes_NodesDTO GetInstance(object key, string jbID)
        {
            if (key == null) return null;
            var rawKey = key.ToString();
            var parsedKey = int.Parse(rawKey);
            var records = new GraphQueryDebugController().Get_ListNodes_DatasourceQueryable();
            var foundEntry = records.Where(c => c.NodesKey == parsedKey).FirstOrDefault();
            //Second attempt, using the Unique Identifier
            if(foundEntry == null && !string.IsNullOrWhiteSpace(jbID))
            {
                if(int.TryParse(rawKey, out int _uniqueKey))
                {
                    foundEntry = records.Where(x => x._GetUniqueIdentifier() == _uniqueKey).FirstOrDefault();
                }
            }
            if (foundEntry != null)
            {
                return new GetAllNodes_NodesDTO(foundEntry);
            }
            return null;
        }
        public GetAllNodes_NodesDTO(DigicircMatchmaking.BO.Nodes original, bool assignClientKey) : this(original)
        {
            _clientKey = DTOHelper.GetClientKey(original, null);
        }
        public GetAllNodes_NodesDTO(DigicircMatchmaking.BO.Nodes original)
        {
            if(original == null) throw new ApplicationException(BaseViewPage<object>.GetResourceValue("GlobalResources", "RES_DATASOURCE_Null_Value_In_Resultset", null, "The resultset of your DataSource contains null values."));
            _key = (original.NodesKey == 0) ? original._GetUniqueIdentifier() as object : original.NodesKey as object;
            NodesKey = original.NodesKey;
            if (!DTOHelper.SeenDTOInstances.ContainsKey(original))
            {
                DTOHelper.SeenDTOInstances.Add(original, this);
            }
            Name = original.Name;
            LabelType = original.LabelType;
            Label = original.Label;
            CC = original.CC;
            IA = original.IA;
            Attr = original.Attr;
            Id = original.Id;
            Graphid = original.Graphid;
            SL = original.SL;
            AL = original.AL;
            CL = original.CL;
            RL = original.RL;
            AC = original.AC;
        }

        public static DigicircMatchmaking.BO.Nodes GetModelByKey(object _key)
        {
            return null;
        }
        public DigicircMatchmaking.BO.Nodes Convert()
        {
            var model = new DigicircMatchmaking.BO.Nodes();
            if (!DTOHelper.SeenModelInstances.ContainsKey(this))
            {
                DTOHelper.SeenModelInstances.Add(this, model);
            }
            model.NodesKey = NodesKey ?? 0;
            model.Name = Name;
            model.LabelType = LabelType;
            model.Label = Label;
            model.CC = CC;
            model.IA = IA;
            model.Attr = Attr;
            model.Id = Id;
            model.Graphid = Graphid;
            model.SL = SL;
            model.AL = AL;
            model.CL = CL;
            model.RL = RL;
            model.AC = AC;
            DTOHelper.UpdateSeenModelInstances(this, model);
            return model;
        }

    }

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
                    var controller = new GraphQueryDebugController();
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
            DTOHelper.UpdateSeenModelInstances(this, model);
            return model;
        }

    }

    #endregion

}
