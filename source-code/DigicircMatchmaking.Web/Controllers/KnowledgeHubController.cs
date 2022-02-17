// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
using AppCode;
using DigicircMatchmaking.BO;
using DigicircMatchmaking.DAL.Queries;
using DigicircMatchmaking.UI.ViewModels.KnowledgeHub;
using Identity = zAppDev.DotNet.Framework.Identity;
using log4net;
using Newtonsoft.Json;
using NHibernate.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using zAppDev.DotNet.Framework.Configuration;
using zAppDev.DotNet.Framework.Data.Domain;
using zAppDev.DotNet.Framework.Identity;
using zAppDev.DotNet.Framework.Identity.Model;
using zAppDev.DotNet.Framework.Linq;
using zAppDev.DotNet.Framework.Mvc;
using zAppDev.DotNet.Framework.Utilities;

namespace DigicircMatchmaking.UI.Controllers.KnowledgeHub
{

    [RoutePrefix("KnowledgeHub")]
    public class KnowledgeHubController : ControllerBase<KnowledgeHubViewModel, KnowledgeHubViewModelDTO>
    {

        /*<Form:KnowledgeHub:0/>*/
        public KnowledgeHubController()
        {
            _logger = log4net.LogManager.GetLogger(typeof(KnowledgeHubController));
            if (ViewModelDTOBase.DTOHelper == null)
            {
                ViewModelDTOBase.DTOHelper = new DTOHelper();
            }
        }

        protected override void ViewModelLoaded()
        {
            var masterViewModel = new DigicircMatchmaking.UI.ViewModels.SymbiosisMasterPage.SymbiosisMasterPageViewModel
            {
                Title = model.Title, AnalyticsId = model.AnalyticsId
            };
            _parentController = new SymbiosisMasterPage.SymbiosisMasterPageController(masterViewModel);
            _parentController.IsDirty = IsDirty;
        }

        public KnowledgeHubController SetModel(KnowledgeHubViewModel m)
        {
            @model = m;
            return this;
        }


        public override void CommitAllFiles()
        {
        }

        public override void CommitAllFilesLegacy()
        {
        }

        public override void ClearPendingFiles()
        {
        }




        [HttpGet]

        [Route("GetViewDTO")]
        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName = "GeneralOperation", ClaimType = ClaimTypes.GenericAction)]
        public ContentResult GetViewDTO(int hash)
        {
            return Content(GetViewFromViewDTOsDicSerialized(hash));
        }

        [HttpPost]

        [Route("UpdateInstance")]
        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName = "GeneralOperation", ClaimType = ClaimTypes.GenericAction)]
        public ActionResult UpdateInstance()
        {
            return PrepareUpdateInstanceResult(typeof(KnowledgeHubViewModel));
        }

        [HttpPost]

        [Route("_Raise")]
        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName = "GeneralOperation", ClaimType = ClaimTypes.GenericAction)]
        public ActionResult _Raise()
        {
            return _RaiseEvent();
        }


        [HttpGet]
        [Route("DownloadFileByPath")]
        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName = "DownloadFileByPath")]
        public FileContentResult DownloadFileByPath(string path, string defaultPath = null)
        {
            if (IdentityHelper.GetCurrentIdentityUser() == null) return null;
            if (string.IsNullOrWhiteSpace(path) && string.IsNullOrWhiteSpace(defaultPath))
            {
                throw new ApplicationException("Please provide a path.");
            }
            return FileHelper.PendingDownloadInstance.DownloadByPath(path, defaultPath);
        }




        #region Controller Actions
        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName="Index", ClaimType = ClaimTypes.ControllerAction)]
        [HttpGet]
        [Route("Index")]
        public ActionResult Index()

        {
            @model = new KnowledgeHubViewModel();
            System.Web.HttpContext.Current.Session["LastEntryPoint_KnowledgeHub"] = "Index";
            return null;
        }

        [CustomControllerActionFilter(FillDropDownInitialValues=true, ActionName="Index", ClaimType = ClaimTypes.ControllerAction)]
        [HttpGet]
        [Route("_API_Index")]
        public ActionResult _API_Index()

        {
            @model = new KnowledgeHubViewModel();
            System.Web.HttpContext.Current.Session["LastEntryPoint_KnowledgeHub"] = "Index";
            PushToHistory();
            var _masterController = new DigicircMatchmaking.UI.Controllers.SymbiosisMasterPage.SymbiosisMasterPageController(@model);
            _masterController.ExecuteRender();
            var redirectInfo = ExecuteIndex();
            return redirectInfo;
        }


        [CustomControllerActionFilter(ActionName="Search", ClaimType = ClaimTypes.ControllerAction)]
        [HttpPost]
        [Route("Search")]
        public ActionResult Search()

        {
            var _data = _LoadViewModel();
            var redirectInfo = ExecuteSearch();
            return redirectInfo;
        }

        #endregion
        #region Controller Actions Implementation
        /*<ControllerActionImplementation:Index:1/>*/
        public ActionResult ExecuteIndex()
        {
            if (_parentController == null) _parentController = new SymbiosisMasterPage.SymbiosisMasterPageController(new  DigicircMatchmaking.UI.ViewModels.SymbiosisMasterPage.SymbiosisMasterPageViewModel());
            ((SymbiosisMasterPage.SymbiosisMasterPageController) _parentController).ExecuteRender();
            ActionResult _result = null;
            @model.Title = BaseViewPage<string>.GetResourceValue("KnowledgeHub", "RES_PAGETITLE_Index").ToString();
            @model.Endpoint = zAppDev.DotNet.Framework.Utilities.Common.GetConfigurationKey("GraphDBEndpoint");
            string currentUserName = zAppDev.DotNet.Framework.Identity.IdentityHelper.GetCurrentUserName();
            if (((((currentUserName == null || currentUserName == "")) == false)))
            {
                @model.Actor = new DigicircMatchmaking.DAL.Repository().GetAsQueryable<DigicircMatchmaking.BO.Actor>((a) => a.AddedBy.UserName == currentUserName)?.Where((a) => a.Id == 601).FirstOrDefault();
            }
            @model.AnalyticsId = zAppDev.DotNet.Framework.Utilities.Common.GetConfigurationKey("SymbiosisAnalyticsId");
            return _result;
        }
        /*<ControllerActionImplementation:Search:1/>*/
        public ActionResult ExecuteSearch()
        {
            ActionResult _result = null;
            ClientCommand(ClientCommands.EXECUTE_JS, "update('" + (@model.Waste?.Id ?? 0) + "', '" + (@model.Product?.Id ?? 0) + "')");
            return _result;
        }
        #endregion
        #region Datasource controls
        /*<Datasource:TextBox:1/>*/
        /*<DataSourceFilter:TextBox:2/>*/
        public IQueryable<DigicircMatchmaking.BO.Material> Get_TextBox_DatasourceQueryable(DatasourceRequest __request = null, bool shouldEvict = true)
        {
            __request = __request ?? new DatasourceRequest(0, int.MaxValue);
            if (shouldEvict)
            {
                @model?.Evict();
            }
            var __items = Get_TextBox_DatasourceQueryableImplementation(__request);
// Predefined Ordering
            if (!__request.OrderBy.Any() && !__request.GroupBy.Any())
            {
                __items = __items.OrderBy(@this => @this.Name != null ? @this.Name : null)
                          ;
            }
            if (!__request.OrderBy.Any() && __request.GroupBy.Any())
            {
                var columnInfo0 = new ColumnInfo("Name", "string");
                var orderByInfo0 = new OrderByInfo(columnInfo0,OrderByDirection.ASC);
                __request.OrderBy.Add(orderByInfo0);
            }
            return __items;
        }
        public IQueryable<DigicircMatchmaking.BO.Material> Get_TextBox_DatasourceQueryableImplementation(DatasourceRequest __request = null, bool shouldEvict = true)
        {
            __request = __request ?? new DatasourceRequest(0, int.MaxValue);
            var __items = new DigicircMatchmaking.DAL.Repository().GetAsQueryable<DigicircMatchmaking.BO.Material>().AsQueryable();
            return __items.Where(@this => true);
        }


        /*<DataSourceGetFullRecordset:TextBox:1/>*/

        [HttpPost]
        [Route("TextBox_GetFullRecordset")]
        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName = "MaterialDataSet", ClaimType = ClaimTypes.Dataset)]
        public JsonResult TextBox_GetFullRecordset()
        {
            var postedData = _ParsePostedData();
            var dataType = postedData["dataType"].ToString();
            var keysToExclude = postedData["keys"] == null
                                ? new List<object>()
                                : postedData["keys"].ToString()
                                .Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                                .Select(x => x as object)
                                .ToList();
            var indexes = postedData["indexes"] == null
                          ? null
                          : postedData["indexes"].ToString()
                          .Split(new char[] { '_' }, StringSplitOptions.RemoveEmptyEntries)
                          .Select(x => int.Parse(x))
                          .ToArray();
            var postedDatasourceRequest = DeserializeDatasourceRequest(postedData["datasourceRequest"].ToString());
            _LoadViewModel();
            var datasourceRequest = new DatasourceRequest(0, 2147483647, postedDatasourceRequest.Filters, null, keysToExclude, indexes);
            var queryable = Get_TextBox_DatasourceQueryable(datasourceRequest);
            var items = DatasourceRetriever.ApplyDynamicFilterToQueryable(datasourceRequest, queryable);
            //The following method of creating DTO responses has been changed due to the fact that the returned objects were missing properties that were not used by the client.
            //It now uses the UpdateInstance method. To be removed after some testing if no problems occur.
            //var data = items.Select(i => new MaterialDataSet_MaterialDTO(i, true)).ToList();
            var data = CreateDtoInstancesFromKeys(typeof(KnowledgeHubViewModel), dataType, items.Select(i => i.Id.ToString()).ToList(), "TextBox");
            string __data = Utilities.Serialize(data);
            var __result = Json(new
            {
                Type = "UpdateInstance",Data = __data
            }, JsonRequestBehavior.AllowGet);
            __result.MaxJsonLength = int.MaxValue;
            return __result;
        }
        /*<DataSourceEntryPoint:TextBox:1/>*/

        [HttpPost]

        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName = "MaterialDataSet", ClaimType = ClaimTypes.Dataset)]
        [Route("TextBox_Datasource")]
        public JsonResult TextBox_Datasource()
        {
            var postedData = _LoadViewModel();
            var datasourceRequest = DeserializeDatasourceRequest(postedData["datasourceRequest"].ToString());
            var queryable = Get_TextBox_DatasourceQueryable(datasourceRequest);
            var response = new ListResponse
            {
                TotalRows = DatasourceRetriever.ApplyDynamicFilterToQueryable(datasourceRequest, queryable).Count(),
            };
            //Total items count
            if (CLMS.AppDev.Cache.CacheManager.Current.HasKey($"{Request.RequestContext.HttpContext.Session.SessionID}_TextBox_TotalItems"))
            {
                CLMS.AppDev.Cache.CacheManager.Current.Set($"{Request.RequestContext.HttpContext.Session.SessionID}_TextBox_TotalItems", response.TotalRows);
            }
            else
            {
                CLMS.AppDev.Cache.CacheManager.Current.Add($"{Request.RequestContext.HttpContext.Session.SessionID}_TextBox_TotalItems", response.TotalRows);
            }
            if (response.TotalRows < datasourceRequest.StartRow + 1)
            {
                datasourceRequest.StartRow = 0;
            }
            var items = DatasourceRetriever.Retrieve(datasourceRequest, queryable);;
            response.Data = items.ToList().Select(i => new MaterialDataSet_MaterialDTO(i, true)).ToList();
            string __data = Serialize(response);
            var __result = Json(new
            {
                Type = "DatasourceData",Data = __data
            }, JsonRequestBehavior.AllowGet);
            __result.MaxJsonLength = int.MaxValue;
            return __result;
        }



        /*<Datasource:TextBox1:1/>*/
        /*<DataSourceFilter:TextBox1:2/>*/
        public IQueryable<DigicircMatchmaking.BO.Material> Get_TextBox1_DatasourceQueryable(DatasourceRequest __request = null, bool shouldEvict = true)
        {
            __request = __request ?? new DatasourceRequest(0, int.MaxValue);
            if (shouldEvict)
            {
                @model?.Evict();
            }
            var __items = Get_TextBox1_DatasourceQueryableImplementation(__request);
// Predefined Ordering
            if (!__request.OrderBy.Any() && !__request.GroupBy.Any())
            {
                __items = __items.OrderBy(@this => @this.Name != null ? @this.Name : null)
                          ;
            }
            if (!__request.OrderBy.Any() && __request.GroupBy.Any())
            {
                var columnInfo0 = new ColumnInfo("Name", "string");
                var orderByInfo0 = new OrderByInfo(columnInfo0,OrderByDirection.ASC);
                __request.OrderBy.Add(orderByInfo0);
            }
            return __items;
        }
        public IQueryable<DigicircMatchmaking.BO.Material> Get_TextBox1_DatasourceQueryableImplementation(DatasourceRequest __request = null, bool shouldEvict = true)
        {
            __request = __request ?? new DatasourceRequest(0, int.MaxValue);
            var __items = new DigicircMatchmaking.DAL.Repository().GetAsQueryable<DigicircMatchmaking.BO.Material>().AsQueryable();
            return __items.Where(@this => true);
        }


        /*<DataSourceGetFullRecordset:TextBox1:1/>*/

        [HttpPost]
        [Route("TextBox1_GetFullRecordset")]
        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName = "MaterialDataSet", ClaimType = ClaimTypes.Dataset)]
        public JsonResult TextBox1_GetFullRecordset()
        {
            var postedData = _ParsePostedData();
            var dataType = postedData["dataType"].ToString();
            var keysToExclude = postedData["keys"] == null
                                ? new List<object>()
                                : postedData["keys"].ToString()
                                .Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                                .Select(x => x as object)
                                .ToList();
            var indexes = postedData["indexes"] == null
                          ? null
                          : postedData["indexes"].ToString()
                          .Split(new char[] { '_' }, StringSplitOptions.RemoveEmptyEntries)
                          .Select(x => int.Parse(x))
                          .ToArray();
            var postedDatasourceRequest = DeserializeDatasourceRequest(postedData["datasourceRequest"].ToString());
            _LoadViewModel();
            var datasourceRequest = new DatasourceRequest(0, 2147483647, postedDatasourceRequest.Filters, null, keysToExclude, indexes);
            var queryable = Get_TextBox1_DatasourceQueryable(datasourceRequest);
            var items = DatasourceRetriever.ApplyDynamicFilterToQueryable(datasourceRequest, queryable);
            //The following method of creating DTO responses has been changed due to the fact that the returned objects were missing properties that were not used by the client.
            //It now uses the UpdateInstance method. To be removed after some testing if no problems occur.
            //var data = items.Select(i => new MaterialDataSet_MaterialDTO(i, true)).ToList();
            var data = CreateDtoInstancesFromKeys(typeof(KnowledgeHubViewModel), dataType, items.Select(i => i.Id.ToString()).ToList(), "TextBox1");
            string __data = Utilities.Serialize(data);
            var __result = Json(new
            {
                Type = "UpdateInstance",Data = __data
            }, JsonRequestBehavior.AllowGet);
            __result.MaxJsonLength = int.MaxValue;
            return __result;
        }
        /*<DataSourceEntryPoint:TextBox1:1/>*/

        [HttpPost]

        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName = "MaterialDataSet", ClaimType = ClaimTypes.Dataset)]
        [Route("TextBox1_Datasource")]
        public JsonResult TextBox1_Datasource()
        {
            var postedData = _LoadViewModel();
            var datasourceRequest = DeserializeDatasourceRequest(postedData["datasourceRequest"].ToString());
            var queryable = Get_TextBox1_DatasourceQueryable(datasourceRequest);
            var response = new ListResponse
            {
                TotalRows = DatasourceRetriever.ApplyDynamicFilterToQueryable(datasourceRequest, queryable).Count(),
            };
            //Total items count
            if (CLMS.AppDev.Cache.CacheManager.Current.HasKey($"{Request.RequestContext.HttpContext.Session.SessionID}_TextBox1_TotalItems"))
            {
                CLMS.AppDev.Cache.CacheManager.Current.Set($"{Request.RequestContext.HttpContext.Session.SessionID}_TextBox1_TotalItems", response.TotalRows);
            }
            else
            {
                CLMS.AppDev.Cache.CacheManager.Current.Add($"{Request.RequestContext.HttpContext.Session.SessionID}_TextBox1_TotalItems", response.TotalRows);
            }
            if (response.TotalRows < datasourceRequest.StartRow + 1)
            {
                datasourceRequest.StartRow = 0;
            }
            var items = DatasourceRetriever.Retrieve(datasourceRequest, queryable);;
            response.Data = items.ToList().Select(i => new MaterialDataSet_MaterialDTO(i, true)).ToList();
            string __data = Serialize(response);
            var __result = Json(new
            {
                Type = "DatasourceData",Data = __data
            }, JsonRequestBehavior.AllowGet);
            __result.MaxJsonLength = int.MaxValue;
            return __result;
        }



        /*<Datasource:KnowledgeHub_MaterialDataSet:1/>*/
        /*<DataSourceFilter:KnowledgeHub_MaterialDataSet:2/>*/
        public IQueryable<DigicircMatchmaking.BO.Material> Get_KnowledgeHub_MaterialDataSet_DatasourceQueryable(DatasourceRequest __request = null, bool shouldEvict = true)
        {
            __request = __request ?? new DatasourceRequest(0, int.MaxValue);
            if (shouldEvict)
            {
                @model?.Evict();
            }
            var __items = Get_KnowledgeHub_MaterialDataSet_DatasourceQueryableImplementation(__request);
// Predefined Ordering
            if (!__request.OrderBy.Any() && !__request.GroupBy.Any())
            {
                __items = __items.OrderBy(@this => @this.Name != null ? @this.Name : null)
                          ;
            }
            if (!__request.OrderBy.Any() && __request.GroupBy.Any())
            {
                var columnInfo0 = new ColumnInfo("Name", "string");
                var orderByInfo0 = new OrderByInfo(columnInfo0,OrderByDirection.ASC);
                __request.OrderBy.Add(orderByInfo0);
            }
            return __items;
        }
        public IQueryable<DigicircMatchmaking.BO.Material> Get_KnowledgeHub_MaterialDataSet_DatasourceQueryableImplementation(DatasourceRequest __request = null, bool shouldEvict = true)
        {
            __request = __request ?? new DatasourceRequest(0, int.MaxValue);
            var __items = new DigicircMatchmaking.DAL.Repository().GetAsQueryable<DigicircMatchmaking.BO.Material>().AsQueryable();
            return __items.Where(@this => true);
        }


        /*<DataSourceGetFullRecordset:KnowledgeHub_MaterialDataSet:1/>*/

        [HttpPost]
        [Route("KnowledgeHub_MaterialDataSet_GetFullRecordset")]
        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName = "MaterialDataSet", ClaimType = ClaimTypes.Dataset)]
        public JsonResult KnowledgeHub_MaterialDataSet_GetFullRecordset()
        {
            var postedData = _ParsePostedData();
            var dataType = postedData["dataType"].ToString();
            var keysToExclude = postedData["keys"] == null
                                ? new List<object>()
                                : postedData["keys"].ToString()
                                .Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                                .Select(x => x as object)
                                .ToList();
            var indexes = postedData["indexes"] == null
                          ? null
                          : postedData["indexes"].ToString()
                          .Split(new char[] { '_' }, StringSplitOptions.RemoveEmptyEntries)
                          .Select(x => int.Parse(x))
                          .ToArray();
            var postedDatasourceRequest = DeserializeDatasourceRequest(postedData["datasourceRequest"].ToString());
            _LoadViewModel();
            var datasourceRequest = new DatasourceRequest(0, 2147483647, postedDatasourceRequest.Filters, null, keysToExclude, indexes);
            var queryable = Get_KnowledgeHub_MaterialDataSet_DatasourceQueryable(datasourceRequest);
            var items = DatasourceRetriever.ApplyDynamicFilterToQueryable(datasourceRequest, queryable);
            //The following method of creating DTO responses has been changed due to the fact that the returned objects were missing properties that were not used by the client.
            //It now uses the UpdateInstance method. To be removed after some testing if no problems occur.
            //var data = items.Select(i => new MaterialDataSet_MaterialDTO(i, true)).ToList();
            var data = CreateDtoInstancesFromKeys(typeof(KnowledgeHubViewModel), dataType, items.Select(i => i.Id.ToString()).ToList(), "KnowledgeHub_MaterialDataSet");
            string __data = Utilities.Serialize(data);
            var __result = Json(new
            {
                Type = "UpdateInstance",Data = __data
            }, JsonRequestBehavior.AllowGet);
            __result.MaxJsonLength = int.MaxValue;
            return __result;
        }
        /*<DataSourceEntryPoint:KnowledgeHub_MaterialDataSet:1/>*/

        [HttpPost]

        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName = "MaterialDataSet", ClaimType = ClaimTypes.Dataset)]
        [Route("KnowledgeHub_MaterialDataSet_Datasource")]
        public JsonResult KnowledgeHub_MaterialDataSet_Datasource()
        {
            var postedData = _LoadViewModel();
            var datasourceRequest = DeserializeDatasourceRequest(postedData["datasourceRequest"].ToString());
            var queryable = Get_KnowledgeHub_MaterialDataSet_DatasourceQueryable(datasourceRequest);
            var response = new ListResponse
            {
                TotalRows = DatasourceRetriever.ApplyDynamicFilterToQueryable(datasourceRequest, queryable).Count(),
            };
            //Total items count
            if (CLMS.AppDev.Cache.CacheManager.Current.HasKey($"{Request.RequestContext.HttpContext.Session.SessionID}_KnowledgeHub_MaterialDataSet_TotalItems"))
            {
                CLMS.AppDev.Cache.CacheManager.Current.Set($"{Request.RequestContext.HttpContext.Session.SessionID}_KnowledgeHub_MaterialDataSet_TotalItems", response.TotalRows);
            }
            else
            {
                CLMS.AppDev.Cache.CacheManager.Current.Add($"{Request.RequestContext.HttpContext.Session.SessionID}_KnowledgeHub_MaterialDataSet_TotalItems", response.TotalRows);
            }
            if (response.TotalRows < datasourceRequest.StartRow + 1)
            {
                datasourceRequest.StartRow = 0;
            }
            var _dto = DynamicDtoInfo.CreateFromPropsArray(datasourceRequest.DtoProperties);
            var _convertionMethod = _dto.GetConvertionFunc<DigicircMatchmaking.BO.Material>();
            if (datasourceRequest.GroupBy.Any())
            {
                var groups = DatasourceRetriever.RetrieveGrouped(datasourceRequest, queryable, q => q.Id, postedData);
                var items = groups.GetAllItems();
                response.Data = items.ToList().Select(i => _convertionMethod(i)).ToList();
                response.Groups = groups;
//Fix for total items in GetGroupsClosed
                if (datasourceRequest.GroupBy.FirstOrDefault().GetGroupsClosed)
                {
                    response.TotalRows = DatasourceRetriever.GetTotalGroups(groups);
                }
            }
            else
            {
                var items = DatasourceRetriever.Retrieve(datasourceRequest, queryable);;
                response.Data = items.ToList().Select(i => _convertionMethod(i)).ToList();
            }
            string __data = Serialize(response);
            var __result = Json(new
            {
                Type = "DatasourceData",Data = __data
            }, JsonRequestBehavior.AllowGet);
            __result.MaxJsonLength = int.MaxValue;
            return __result;
        }



        /*<Datasource:KnowledgeHub_ProductDataset:1/>*/
        /*<DataSourceFilter:KnowledgeHub_ProductDataset:2/>*/
        public IQueryable<DigicircMatchmaking.BO.Product> Get_KnowledgeHub_ProductDataset_DatasourceQueryable(DatasourceRequest __request = null, bool shouldEvict = true)
        {
            __request = __request ?? new DatasourceRequest(0, int.MaxValue);
            if (shouldEvict)
            {
                @model?.Evict();
            }
            var __items = Get_KnowledgeHub_ProductDataset_DatasourceQueryableImplementation(__request);
            return __items;
        }
        public IQueryable<DigicircMatchmaking.BO.Product> Get_KnowledgeHub_ProductDataset_DatasourceQueryableImplementation(DatasourceRequest __request = null, bool shouldEvict = true)
        {
            __request = __request ?? new DatasourceRequest(0, int.MaxValue);
            var __items = model?.Actor?.CircularEconomyRequirements?.DesiredResources?.AsQueryable();
            if (__items == null) return new List<DigicircMatchmaking.BO.Product>().AsQueryable();
            return __items.Where(@this => true);
        }


        /*<DataSourceGetFullRecordset:KnowledgeHub_ProductDataset:1/>*/

        [HttpPost]
        [Route("KnowledgeHub_ProductDataset_GetFullRecordset")]
        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName = "ProductDataset", ClaimType = ClaimTypes.Dataset)]
        public JsonResult KnowledgeHub_ProductDataset_GetFullRecordset()
        {
            var postedData = _ParsePostedData();
            var dataType = postedData["dataType"].ToString();
            var keysToExclude = postedData["keys"] == null
                                ? new List<object>()
                                : postedData["keys"].ToString()
                                .Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                                .Select(x => x as object)
                                .ToList();
            var indexes = postedData["indexes"] == null
                          ? null
                          : postedData["indexes"].ToString()
                          .Split(new char[] { '_' }, StringSplitOptions.RemoveEmptyEntries)
                          .Select(x => int.Parse(x))
                          .ToArray();
            var postedDatasourceRequest = DeserializeDatasourceRequest(postedData["datasourceRequest"].ToString());
            _LoadViewModel();
            var datasourceRequest = new DatasourceRequest(0, 2147483647, postedDatasourceRequest.Filters, null, keysToExclude, indexes);
            var queryable = Get_KnowledgeHub_ProductDataset_DatasourceQueryable(datasourceRequest);
            var items = DatasourceRetriever.ApplyDynamicFilterToQueryable(datasourceRequest, queryable);
            //The following method of creating DTO responses has been changed due to the fact that the returned objects were missing properties that were not used by the client.
            //It now uses the UpdateInstance method. To be removed after some testing if no problems occur.
            //var data = items.Select(i => new ProductDataset_ProductDTO(i, true)).ToList();
            var data = CreateDtoInstancesFromKeys(typeof(KnowledgeHubViewModel), dataType, items.Select(i => i.Id.ToString()).ToList(), "KnowledgeHub_ProductDataset");
            string __data = Utilities.Serialize(data);
            var __result = Json(new
            {
                Type = "UpdateInstance",Data = __data
            }, JsonRequestBehavior.AllowGet);
            __result.MaxJsonLength = int.MaxValue;
            return __result;
        }
        /*<DataSourceEntryPoint:KnowledgeHub_ProductDataset:1/>*/

        [HttpPost]

        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName = "ProductDataset", ClaimType = ClaimTypes.Dataset)]
        [Route("KnowledgeHub_ProductDataset_Datasource")]
        public JsonResult KnowledgeHub_ProductDataset_Datasource()
        {
            var postedData = _LoadViewModel();
            var datasourceRequest = DeserializeDatasourceRequest(postedData["datasourceRequest"].ToString());
            var queryable = Get_KnowledgeHub_ProductDataset_DatasourceQueryable(datasourceRequest);
            var response = new ListResponse
            {
                TotalRows = DatasourceRetriever.ApplyDynamicFilterToQueryable(datasourceRequest, queryable).Count(),
            };
            //Total items count
            if (CLMS.AppDev.Cache.CacheManager.Current.HasKey($"{Request.RequestContext.HttpContext.Session.SessionID}_KnowledgeHub_ProductDataset_TotalItems"))
            {
                CLMS.AppDev.Cache.CacheManager.Current.Set($"{Request.RequestContext.HttpContext.Session.SessionID}_KnowledgeHub_ProductDataset_TotalItems", response.TotalRows);
            }
            else
            {
                CLMS.AppDev.Cache.CacheManager.Current.Add($"{Request.RequestContext.HttpContext.Session.SessionID}_KnowledgeHub_ProductDataset_TotalItems", response.TotalRows);
            }
            if (response.TotalRows < datasourceRequest.StartRow + 1)
            {
                datasourceRequest.StartRow = 0;
            }
            var _dto = DynamicDtoInfo.CreateFromPropsArray(datasourceRequest.DtoProperties);
            var _convertionMethod = _dto.GetConvertionFunc<DigicircMatchmaking.BO.Product>();
            if (datasourceRequest.GroupBy.Any())
            {
                var groups = DatasourceRetriever.RetrieveGrouped(datasourceRequest, queryable, q => q.Id, postedData);
                var items = groups.GetAllItems();
                response.Data = items.ToList().Select(i => _convertionMethod(i)).ToList();
                response.Groups = groups;
//Fix for total items in GetGroupsClosed
                if (datasourceRequest.GroupBy.FirstOrDefault().GetGroupsClosed)
                {
                    response.TotalRows = DatasourceRetriever.GetTotalGroups(groups);
                }
            }
            else
            {
                var items = DatasourceRetriever.Retrieve(datasourceRequest, queryable);;
                response.Data = items.ToList().Select(i => _convertionMethod(i)).ToList();
            }
            string __data = Serialize(response);
            var __result = Json(new
            {
                Type = "DatasourceData",Data = __data
            }, JsonRequestBehavior.AllowGet);
            __result.MaxJsonLength = int.MaxValue;
            return __result;
        }



        #endregion

        public override ActionResult PreActionFilterHook(bool causesValidation, bool listenToEvent, string actionName)
        {
            System.Web.HttpContext.Current.Items["_currentControllerAction"] = actionName;
            if (listenToEvent) return null;
            return null;
        }
        public override ActionResult PostActionFilterHook(bool hasDefaultResultView, bool fillDropDownInitialValues = false)
        {
            if (HasClientResponse())
            {
                viewDTO.ClientResponse = GetClientResponse();
            }
            else
            {
                var _modelDTO = new KnowledgeHubViewModelDTO(@model);
                if (fillDropDownInitialValues)
                {
                    _modelDTO.FillDropDownsInitialValues(@model, this);
                }
                viewDTO.Model = _modelDTO;
            }
            if (!hasDefaultResultView)
            {
                var __result = Json(new
                {
                    Type = "Data",Data = viewDTO.Serialize()
                }, JsonRequestBehavior.AllowGet);
                __result.MaxJsonLength = int.MaxValue;
                return __result;
            }
            return View("KnowledgeHub");
        }

        #region Data Validations


        private ActionResult GetFailedDataValidationsResult(List<string> groupsToCheck = null)
        {
            try
            {
                RunDataValidations(groupsToCheck);
                if (!viewDTO.DataValidationsHaveFailed) return null;
                var __result = Json(new
                {
                    Type = "RuleEvaluation",Data = viewDTO.Serialize()
                }, JsonRequestBehavior.AllowGet);
                __result.MaxJsonLength = int.MaxValue;
                return __result;
            }
            catch (Exception e)
            {
                _logger.Error("!!! DANGER: Error while evaluating Data Validations !!!", e);
                log4net.LogManager.GetLogger(this.GetType()).Error("Form: KnowledgeHub, Action: " + System.Web.HttpContext.Current.Items["_currentControllerAction"], e);
                //throw;
                return null;
            }
        }
        public List<RuleResult> RunDataValidations(List<string> groupsToCheck = null)
        {
            var masterPageDataValidations = (_parentController as Controllers.SymbiosisMasterPage.SymbiosisMasterPageController).RunDataValidations();
            if (masterPageDataValidations?.Any() == true)
            {
                viewDTO.RuleEvaluations.DataValidations.AddRange(masterPageDataValidations);
            }
            return viewDTO.RuleEvaluations.DataValidations;
        }

        #endregion
    }
}
