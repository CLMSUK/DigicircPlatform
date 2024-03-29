// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
using AppCode;
using DigicircMatchmaking.BO;
using DigicircMatchmaking.DAL.Queries;
using DigicircMatchmaking.UI.ViewModels.ThematicExpertiseList;
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

namespace DigicircMatchmaking.UI.Controllers.ThematicExpertiseList
{

    [RoutePrefix("ThematicExpertiseList")]
    public class ThematicExpertiseListController : ControllerBase<ThematicExpertiseListViewModel, ThematicExpertiseListViewModelDTO>
    {

        /*<Form:ThematicExpertiseList:0/>*/
        public ThematicExpertiseListController()
        {
            _logger = log4net.LogManager.GetLogger(typeof(ThematicExpertiseListController));
            if (ViewModelDTOBase.DTOHelper == null)
            {
                ViewModelDTOBase.DTOHelper = new DTOHelper();
            }
        }

        protected override void ViewModelLoaded()
        {
            var masterViewModel = new DigicircMatchmaking.UI.ViewModels.MasterPage.MasterPageViewModel
            {
                Title = model.Title, AnalyticsId = model.AnalyticsId
            };
            _parentController = new MasterPage.MasterPageController(masterViewModel);
            _parentController.IsDirty = IsDirty;
        }

        public ThematicExpertiseListController SetModel(ThematicExpertiseListViewModel m)
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
            return PrepareUpdateInstanceResult(typeof(ThematicExpertiseListViewModel));
        }

        [HttpPost]

        [Route("_Raise")]
        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName = "GeneralOperation", ClaimType = ClaimTypes.GenericAction)]
        public ActionResult _Raise()
        {
            return _RaiseEvent();
        }

        [HttpGet]
        [Route("DownloadFile")]
        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName = "DownloadFile")]
        public FileContentResult DownloadFile(string id)
        {
            return FileHelper.PendingDownloadInstance.DownloadByKey("ThematicExpertiseList", id);
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


        [Route("SaveListView")]
        [HttpPost]
        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName = "GeneralOperation", ClaimType = ClaimTypes.GenericAction)]
        public JsonResult SaveListView()
        {
            var postedData = _ParsePostedData();
            return SaveListView(postedData, "ThematicExpertiseList");
        }


        [Route("DeleteListView")]
        [HttpPost]
        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName = "GeneralOperation", ClaimType = ClaimTypes.GenericAction)]
        public JsonResult DeleteListView()
        {
            var postedData = _ParsePostedData();
            return DeleteListView(postedData, "ThematicExpertiseList");
        }


        [Route("LoadListViews")]
        [HttpPost]
        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName = "GeneralOperation", ClaimType = ClaimTypes.GenericAction)]
        public JsonResult LoadListViews()
        {
            var postedData = _ParsePostedData();
            return LoadListViews(postedData, "ThematicExpertiseList");
        }



        #region Controller Actions
        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName="Index", ClaimType = ClaimTypes.ControllerAction)]
        [HttpGet]
        [Route("Index")]
        [Route("")]

        public ActionResult Index()

        {
            @model = new ThematicExpertiseListViewModel();
            System.Web.HttpContext.Current.Session["LastEntryPoint_ThematicExpertiseList"] = "Index";
            return null;
        }

        [CustomControllerActionFilter(FillDropDownInitialValues=true, ActionName="Index", ClaimType = ClaimTypes.ControllerAction)]
        [HttpGet]
        [Route("_API_Index")]
        public ActionResult _API_Index()

        {
            @model = new ThematicExpertiseListViewModel();
            System.Web.HttpContext.Current.Session["LastEntryPoint_ThematicExpertiseList"] = "Index";
            PushToHistory();
            var _masterController = new DigicircMatchmaking.UI.Controllers.MasterPage.MasterPageController(@model);
            _masterController.ExecuteRender();
            var redirectInfo = ExecuteIndex();
            return redirectInfo;
        }


        #endregion
        #region Controller Actions Implementation
        /*<ControllerActionImplementation:Index:1/>*/
        public ActionResult ExecuteIndex()
        {
            if (_parentController == null) _parentController = new MasterPage.MasterPageController(new  DigicircMatchmaking.UI.ViewModels.MasterPage.MasterPageViewModel());
            ((MasterPage.MasterPageController) _parentController).ExecuteRender();
            ActionResult _result = null;
            @model.Title = BaseViewPage<string>.GetResourceValue("ThematicExpertiseList", "RES_PAGETITLE_Index").ToString();
            return _result;
        }
        #endregion
        #region Datasource controls
        /*<Datasource:ThematicExpertiseList:1/>*/
        /*<DataSourceFilter:ThematicExpertiseList:2/>*/
        public IQueryable<DigicircMatchmaking.BO.ThematicExpertise> Get_ThematicExpertiseList_DatasourceQueryable(DatasourceRequest __request = null, bool shouldEvict = true)
        {
            __request = __request ?? new DatasourceRequest(0, int.MaxValue);
            if (shouldEvict)
            {
                @model?.Evict();
            }
            var __items = Get_ThematicExpertiseList_DatasourceQueryableImplementation(__request);
            return __items;
        }
        public IQueryable<DigicircMatchmaking.BO.ThematicExpertise> Get_ThematicExpertiseList_DatasourceQueryableImplementation(DatasourceRequest __request = null, bool shouldEvict = true)
        {
            __request = __request ?? new DatasourceRequest(0, int.MaxValue);
            var __items = new DigicircMatchmaking.DAL.Repository().GetAsQueryable<DigicircMatchmaking.BO.ThematicExpertise>().AsQueryable();
            return __items.Where(@this => true);
        }


        /*<DataSourceGetFullRecordset:ThematicExpertiseList:1/>*/

        [HttpPost]
        [Route("ThematicExpertiseList_GetFullRecordset")]
        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName = "ThematicExpertiseDataSet", ClaimType = ClaimTypes.Dataset)]
        public JsonResult ThematicExpertiseList_GetFullRecordset()
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
            var queryable = Get_ThematicExpertiseList_DatasourceQueryable(datasourceRequest);
            var items = DatasourceRetriever.ApplyDynamicFilterToQueryable(datasourceRequest, queryable);
            //The following method of creating DTO responses has been changed due to the fact that the returned objects were missing properties that were not used by the client.
            //It now uses the UpdateInstance method. To be removed after some testing if no problems occur.
            //var data = items.Select(i => new ThematicExpertiseDataSet_ThematicExpertiseDTO(i, true)).ToList();
            var data = CreateDtoInstancesFromKeys(typeof(ThematicExpertiseListViewModel), dataType, items.Select(i => i.Id.ToString()).ToList(), "ThematicExpertiseList");
            string __data = Utilities.Serialize(data);
            var __result = Json(new
            {
                Type = "UpdateInstance",Data = __data
            }, JsonRequestBehavior.AllowGet);
            __result.MaxJsonLength = int.MaxValue;
            return __result;
        }
        /*<DataSourceEntryPoint:ThematicExpertiseList:1/>*/

        [HttpPost]

        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName = "ThematicExpertiseDataSet", ClaimType = ClaimTypes.Dataset)]
        [Route("ThematicExpertiseList_Datasource")]
        public JsonResult ThematicExpertiseList_Datasource()
        {
            var postedData = _LoadViewModel();
            var datasourceRequest = DeserializeDatasourceRequest(postedData["datasourceRequest"].ToString());
            var queryable = Get_ThematicExpertiseList_DatasourceQueryable(datasourceRequest);
            var response = new ListResponse
            {
                TotalRows = DatasourceRetriever.ApplyDynamicFilterToQueryable(datasourceRequest, queryable).Count(),
            };
            //Total items count
            if (CLMS.AppDev.Cache.CacheManager.Current.HasKey($"{Request.RequestContext.HttpContext.Session.SessionID}_ThematicExpertiseList_TotalItems"))
            {
                CLMS.AppDev.Cache.CacheManager.Current.Set($"{Request.RequestContext.HttpContext.Session.SessionID}_ThematicExpertiseList_TotalItems", response.TotalRows);
            }
            else
            {
                CLMS.AppDev.Cache.CacheManager.Current.Add($"{Request.RequestContext.HttpContext.Session.SessionID}_ThematicExpertiseList_TotalItems", response.TotalRows);
            }
            if (response.TotalRows < datasourceRequest.StartRow + 1)
            {
                datasourceRequest.StartRow = 0;
            }
            if (datasourceRequest.GroupBy.Any())
            {
                var groups = DatasourceRetriever.RetrieveGrouped(datasourceRequest, queryable, q => q.Id, postedData);
                var items = groups.GetAllItems();
                response.Data = items.ToList().Select(i => new ThematicExpertiseDataSet_ThematicExpertiseDTO(i, true)).ToList();
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
                response.Data = items.ToList().Select(i => new ThematicExpertiseDataSet_ThematicExpertiseDTO(i, true)).ToList();
            }
            string __data = Serialize(response);
            var __result = Json(new
            {
                Type = "DatasourceData",Data = __data
            }, JsonRequestBehavior.AllowGet);
            __result.MaxJsonLength = int.MaxValue;
            return __result;
        }


        /*<DataSourceAggregators:ThematicExpertiseList:1/>*/

        [HttpPost]
        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName = "ThematicExpertiseDataSet", ClaimType = ClaimTypes.Dataset)]
        [Route("ThematicExpertiseList_DatasourceAggregators")]
        public JsonResult ThematicExpertiseList_DatasourceAggregators()
        {
            object aggregatorsResponse = null;
            var postedData = _LoadViewModel();
            var datasourceRequest = DeserializeDatasourceRequest(postedData["datasourceRequest"].ToString());
            var queryable = Get_ThematicExpertiseList_DatasourceQueryable(datasourceRequest);
            queryable = DatasourceRetriever.ApplyDynamicFilterToQueryable(datasourceRequest, queryable);
            var comparer = StringComparer.InvariantCultureIgnoreCase;
            var formattings = new Dictionary<string, string>(comparer);
            if (datasourceRequest.GroupBy.Any()/* && datasourceRequest.GroupBy.First().GetGroupsClosed*/)
            {
                var groups = DatasourceRetriever.RetrieveGrouped(datasourceRequest, queryable, q => q.Id, postedData, true);
                GroupsHelper.FormatGroupedAggregators(groups, formattings);
                aggregatorsResponse = new ListResponse()
                {
                    Groups = groups
                };
            }
            else
            {
                var aggregatorsInfo = DeserializeAggregatorsRequest<DigicircMatchmaking.BO.ThematicExpertise>(postedData["aggregatorsRequest"].ToString());
                var aggregators = RuntimePredicateBuilder.BuildAggregatorPredicates(aggregatorsInfo);
                foreach (var a in aggregators)
                {
                    var formatting = formattings.ContainsKey(a.Column) ? formattings[a.Column] : null;
                    a.Calculate(queryable, formatting);
                }
                aggregatorsResponse = aggregators;
            }
            string __data = Serialize(aggregatorsResponse);
            var __result = Json(new
            {
                Type = "DatasourceData",Data = __data
            }, JsonRequestBehavior.AllowGet);
            __result.MaxJsonLength = int.MaxValue;
            return __result;
        }




        [Route("ThematicExpertiseList_ExportV2")]
        [HttpPost]
        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName = "GeneralOperation", ClaimType = ClaimTypes.GenericAction)]
        public JsonResult ThematicExpertiseList_ExportV2()
        {
            var postedData = _LoadViewModel();
            var datasourceRequest = DeserializeDatasourceRequest(postedData["datasourceRequest"].ToString());
            var exportOptions = Utilities.Deserialize<ExportOptionsV2>(postedData["exportData"]?.ToString());
            var aggregatorsInfo = DeserializeAggregatorsRequest<DigicircMatchmaking.BO.ThematicExpertise>(postedData["aggregatorsRequest"]?.ToString());
            var downloadKey = ThematicExpertiseList_ExportV2Implementation(datasourceRequest, exportOptions, aggregatorsInfo);
            string __data = downloadKey;
            var __result = Json(new
            {
                Data = __data
            }, JsonRequestBehavior.AllowGet);
            __result.MaxJsonLength = int.MaxValue;
            return __result;
        }

        [NonAction]
        public string ThematicExpertiseList_ExportV2Implementation(DatasourceRequest datasourceRequest,
                ExportOptionsV2 exportOptions, List<AggregatorInfo<DigicircMatchmaking.BO.ThematicExpertise>> aggregatorsInfo,
                Func<MigraDoc.DocumentObjectModel.Document, MigraDoc.DocumentObjectModel.Tables.Table, object> _pdfOvverideFunction = null,
                Func<OfficeOpenXml.ExcelPackage, object> _excelOverrideFunction = null)
        {
            var watch = System.Diagnostics.Stopwatch.StartNew();
            long elapsedMilliseconds = 0;
            switch (exportOptions.Range)
            {
            case ExportHelper.Range.ALL:
                datasourceRequest.StartRow = 0;
                datasourceRequest.PageSize = int.MaxValue;
                break;
            case ExportHelper.Range.TOP100:
                datasourceRequest.StartRow = 0;
                datasourceRequest.PageSize = 100;
                break;
            }
            var queryable = Get_ThematicExpertiseList_DatasourceQueryable(datasourceRequest);
            var comparer = StringComparer.InvariantCultureIgnoreCase;
            var formattings = new Dictionary<string, string>(comparer);
            var path = "";
            var exportHelper = new ExportHelperV2<DigicircMatchmaking.BO.ThematicExpertise>(exportOptions, new Dictionary<string, Func<DigicircMatchmaking.BO.ThematicExpertise, object>>
            {
                {"Code" , item => item?.Code }, {"Value" , item => item?.Value },
            });
            if (exportHelper.Options.ColumnInfo == null)
            {
                exportHelper.Options.ColumnInfo = new List<ColumnOptionsV2>
                {
                    new ColumnOptionsV2 { Caption = BaseViewPage<object>.GetResourceValue("ThematicExpertiseList", "RES_LIST_ThematicExpertiseList_COLUMN_Code"), Formatting = "", Name = "Code", ExcelFormat = @"" },
                    new ColumnOptionsV2 { Caption = BaseViewPage<object>.GetResourceValue("ThematicExpertiseList", "RES_LIST_ThematicExpertiseList_COLUMN_Value"), Formatting = "", Name = "Value", ExcelFormat = @"" },

                };
            }
            if (string.IsNullOrWhiteSpace(exportHelper.Options.Filename))
            {
                exportHelper.Options.Filename = "ThematicExpertiseList";
            }
            if (datasourceRequest.GroupBy.Any())
            {
                var groups = DatasourceRetriever.RetrieveGrouped(datasourceRequest, queryable, q => q.Id, aggregatorsInfo);
                var aggregators = DatasourceRetriever.RetrieveGrouped(datasourceRequest, queryable, q => q.Id, aggregatorsInfo, true);
                GroupsHelper.FormatGroupedAggregators(aggregators, formattings);
                watch.Stop();
                elapsedMilliseconds = watch.ElapsedMilliseconds;
                _logger.Info($"ExportV2 Performance: ThematicExpertiseList export query with grouping and range {exportOptions.Range} took {elapsedMilliseconds}ms");
                watch.Restart();
                path = exportHelper.Export(groups, aggregators, null, _pdfOvverideFunction, _excelOverrideFunction);
                watch.Stop();
                elapsedMilliseconds += watch.ElapsedMilliseconds;
                _logger.Info($"ExportV2 Performance: ThematicExpertiseList export to excel with grouping and range {exportOptions.Range} took {watch.ElapsedMilliseconds}ms");
            }
            else
            {
                var items = DatasourceRetriever.Retrieve(datasourceRequest, queryable);;
                var aggregators = RuntimePredicateBuilder.BuildAggregatorPredicates(aggregatorsInfo);
                foreach (var a in aggregators)
                {
                    var formatting = formattings.ContainsKey(a.Column) ? formattings[a.Column] : null;
                    a.Calculate(queryable, formatting);
                }
                var loadedItems = items.ToList();
                watch.Stop();
                elapsedMilliseconds = watch.ElapsedMilliseconds;
                _logger.Info($"ExportV2 Performance: ThematicExpertiseList export query with range {exportOptions.Range} took {elapsedMilliseconds}ms");
                watch.Restart();
                path = exportHelper.Export(loadedItems, aggregators, _pdfOvverideFunction, _excelOverrideFunction);
                watch.Stop();
                elapsedMilliseconds += watch.ElapsedMilliseconds;
                _logger.Info($"ExportV2 Performance: ThematicExpertiseList export to excel with range {exportOptions.Range} took {elapsedMilliseconds}ms");
            }
            var content = System.IO.File.ReadAllBytes(Path.Combine(Path.GetTempPath(), path));
            var fileName = Path.GetFileName(path);
            var downloadKey = FileHelper.PendingDownloadInstance.Add("ThematicExpertiseList", content, fileName);
            _logger.Info($"ExportV2 Performance: Total export time for ThematicExpertiseList: {elapsedMilliseconds}ms");
            return downloadKey;
        }



        /*<Datasource:ThematicExpertiseList_ThematicExpertiseDataSet:1/>*/
        /*<DataSourceFilter:ThematicExpertiseList_ThematicExpertiseDataSet:2/>*/
        public IQueryable<DigicircMatchmaking.BO.ThematicExpertise> Get_ThematicExpertiseList_ThematicExpertiseDataSet_DatasourceQueryable(DatasourceRequest __request = null, bool shouldEvict = true)
        {
            __request = __request ?? new DatasourceRequest(0, int.MaxValue);
            if (shouldEvict)
            {
                @model?.Evict();
            }
            var __items = Get_ThematicExpertiseList_ThematicExpertiseDataSet_DatasourceQueryableImplementation(__request);
            return __items;
        }
        public IQueryable<DigicircMatchmaking.BO.ThematicExpertise> Get_ThematicExpertiseList_ThematicExpertiseDataSet_DatasourceQueryableImplementation(DatasourceRequest __request = null, bool shouldEvict = true)
        {
            __request = __request ?? new DatasourceRequest(0, int.MaxValue);
            var __items = new DigicircMatchmaking.DAL.Repository().GetAsQueryable<DigicircMatchmaking.BO.ThematicExpertise>().AsQueryable();
            return __items.Where(@this => true);
        }


        /*<DataSourceGetFullRecordset:ThematicExpertiseList_ThematicExpertiseDataSet:1/>*/

        [HttpPost]
        [Route("ThematicExpertiseList_ThematicExpertiseDataSet_GetFullRecordset")]
        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName = "ThematicExpertiseDataSet", ClaimType = ClaimTypes.Dataset)]
        public JsonResult ThematicExpertiseList_ThematicExpertiseDataSet_GetFullRecordset()
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
            var queryable = Get_ThematicExpertiseList_ThematicExpertiseDataSet_DatasourceQueryable(datasourceRequest);
            var items = DatasourceRetriever.ApplyDynamicFilterToQueryable(datasourceRequest, queryable);
            //The following method of creating DTO responses has been changed due to the fact that the returned objects were missing properties that were not used by the client.
            //It now uses the UpdateInstance method. To be removed after some testing if no problems occur.
            //var data = items.Select(i => new ThematicExpertiseDataSet_ThematicExpertiseDTO(i, true)).ToList();
            var data = CreateDtoInstancesFromKeys(typeof(ThematicExpertiseListViewModel), dataType, items.Select(i => i.Id.ToString()).ToList(), "ThematicExpertiseList_ThematicExpertiseDataSet");
            string __data = Utilities.Serialize(data);
            var __result = Json(new
            {
                Type = "UpdateInstance",Data = __data
            }, JsonRequestBehavior.AllowGet);
            __result.MaxJsonLength = int.MaxValue;
            return __result;
        }
        /*<DataSourceEntryPoint:ThematicExpertiseList_ThematicExpertiseDataSet:1/>*/

        [HttpPost]

        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName = "ThematicExpertiseDataSet", ClaimType = ClaimTypes.Dataset)]
        [Route("ThematicExpertiseList_ThematicExpertiseDataSet_Datasource")]
        public JsonResult ThematicExpertiseList_ThematicExpertiseDataSet_Datasource()
        {
            var postedData = _LoadViewModel();
            var datasourceRequest = DeserializeDatasourceRequest(postedData["datasourceRequest"].ToString());
            var queryable = Get_ThematicExpertiseList_ThematicExpertiseDataSet_DatasourceQueryable(datasourceRequest);
            var response = new ListResponse
            {
                TotalRows = DatasourceRetriever.ApplyDynamicFilterToQueryable(datasourceRequest, queryable).Count(),
            };
            //Total items count
            if (CLMS.AppDev.Cache.CacheManager.Current.HasKey($"{Request.RequestContext.HttpContext.Session.SessionID}_ThematicExpertiseList_ThematicExpertiseDataSet_TotalItems"))
            {
                CLMS.AppDev.Cache.CacheManager.Current.Set($"{Request.RequestContext.HttpContext.Session.SessionID}_ThematicExpertiseList_ThematicExpertiseDataSet_TotalItems", response.TotalRows);
            }
            else
            {
                CLMS.AppDev.Cache.CacheManager.Current.Add($"{Request.RequestContext.HttpContext.Session.SessionID}_ThematicExpertiseList_ThematicExpertiseDataSet_TotalItems", response.TotalRows);
            }
            if (response.TotalRows < datasourceRequest.StartRow + 1)
            {
                datasourceRequest.StartRow = 0;
            }
            var _dto = DynamicDtoInfo.CreateFromPropsArray(datasourceRequest.DtoProperties);
            var _convertionMethod = _dto.GetConvertionFunc<DigicircMatchmaking.BO.ThematicExpertise>();
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
                var _modelDTO = new ThematicExpertiseListViewModelDTO(@model);
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
            return View("ThematicExpertiseList");
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
                log4net.LogManager.GetLogger(this.GetType()).Error("Form: ThematicExpertiseList, Action: " + System.Web.HttpContext.Current.Items["_currentControllerAction"], e);
                //throw;
                return null;
            }
        }
        public List<RuleResult> RunDataValidations(List<string> groupsToCheck = null)
        {
            var masterPageDataValidations = (_parentController as Controllers.MasterPage.MasterPageController).RunDataValidations();
            if (masterPageDataValidations?.Any() == true)
            {
                viewDTO.RuleEvaluations.DataValidations.AddRange(masterPageDataValidations);
            }
            return viewDTO.RuleEvaluations.DataValidations;
        }

        #endregion
    }
}
