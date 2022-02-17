// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
using AppCode;
using DigicircMatchmaking.BO;
using DigicircMatchmaking.DAL.Queries;
using DigicircMatchmaking.UI.ViewModels.ExpertiseList;
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

namespace DigicircMatchmaking.UI.Controllers.ExpertiseList
{

    [RoutePrefix("ExpertiseList")]
    public class ExpertiseListController : ControllerBase<ExpertiseListViewModel, ExpertiseListViewModelDTO>
    {

        /*<Form:ExpertiseList:0/>*/
        public ExpertiseListController()
        {
            _logger = log4net.LogManager.GetLogger(typeof(ExpertiseListController));
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

        public ExpertiseListController SetModel(ExpertiseListViewModel m)
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
            return PrepareUpdateInstanceResult(typeof(ExpertiseListViewModel));
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
            return FileHelper.PendingDownloadInstance.DownloadByKey("ExpertiseList", id);
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
            return SaveListView(postedData, "ExpertiseList");
        }


        [Route("DeleteListView")]
        [HttpPost]
        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName = "GeneralOperation", ClaimType = ClaimTypes.GenericAction)]
        public JsonResult DeleteListView()
        {
            var postedData = _ParsePostedData();
            return DeleteListView(postedData, "ExpertiseList");
        }


        [Route("LoadListViews")]
        [HttpPost]
        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName = "GeneralOperation", ClaimType = ClaimTypes.GenericAction)]
        public JsonResult LoadListViews()
        {
            var postedData = _ParsePostedData();
            return LoadListViews(postedData, "ExpertiseList");
        }



        #region Controller Actions
        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName="Index", ClaimType = ClaimTypes.ControllerAction)]
        [HttpGet]
        [Route("Index")]
        [Route("")]

        public ActionResult Index()

        {
            @model = new ExpertiseListViewModel();
            System.Web.HttpContext.Current.Session["LastEntryPoint_ExpertiseList"] = "Index";
            return null;
        }

        [CustomControllerActionFilter(FillDropDownInitialValues=true, ActionName="Index", ClaimType = ClaimTypes.ControllerAction)]
        [HttpGet]
        [Route("_API_Index")]
        public ActionResult _API_Index()

        {
            @model = new ExpertiseListViewModel();
            System.Web.HttpContext.Current.Session["LastEntryPoint_ExpertiseList"] = "Index";
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
            @model.Title = BaseViewPage<string>.GetResourceValue("ExpertiseList", "RES_PAGETITLE_Index").ToString();
            return _result;
        }
        #endregion
        #region Datasource controls
        /*<Datasource:ExpertiseList:1/>*/
        /*<DataSourceFilter:ExpertiseList:2/>*/
        public IQueryable<DigicircMatchmaking.BO.Expertise> Get_ExpertiseList_DatasourceQueryable(DatasourceRequest __request = null, bool shouldEvict = true)
        {
            __request = __request ?? new DatasourceRequest(0, int.MaxValue);
            if (shouldEvict)
            {
                @model?.Evict();
            }
            var __items = Get_ExpertiseList_DatasourceQueryableImplementation(__request);
            return __items;
        }
        public IQueryable<DigicircMatchmaking.BO.Expertise> Get_ExpertiseList_DatasourceQueryableImplementation(DatasourceRequest __request = null, bool shouldEvict = true)
        {
            __request = __request ?? new DatasourceRequest(0, int.MaxValue);
            var __items = new DigicircMatchmaking.DAL.Repository().GetAsQueryable<DigicircMatchmaking.BO.Expertise>().AsQueryable();
            return __items.Where(@this => true);
        }


        /*<DataSourceGetFullRecordset:ExpertiseList:1/>*/

        [HttpPost]
        [Route("ExpertiseList_GetFullRecordset")]
        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName = "ExpertiseDataSet", ClaimType = ClaimTypes.Dataset)]
        public JsonResult ExpertiseList_GetFullRecordset()
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
            var queryable = Get_ExpertiseList_DatasourceQueryable(datasourceRequest);
            var items = DatasourceRetriever.ApplyDynamicFilterToQueryable(datasourceRequest, queryable);
            //The following method of creating DTO responses has been changed due to the fact that the returned objects were missing properties that were not used by the client.
            //It now uses the UpdateInstance method. To be removed after some testing if no problems occur.
            //var data = items.Select(i => new ExpertiseDataSet_ExpertiseDTO(i, true)).ToList();
            var data = CreateDtoInstancesFromKeys(typeof(ExpertiseListViewModel), dataType, items.Select(i => i.Id.ToString()).ToList(), "ExpertiseList");
            string __data = Utilities.Serialize(data);
            var __result = Json(new
            {
                Type = "UpdateInstance",Data = __data
            }, JsonRequestBehavior.AllowGet);
            __result.MaxJsonLength = int.MaxValue;
            return __result;
        }
        /*<DataSourceEntryPoint:ExpertiseList:1/>*/

        [HttpPost]

        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName = "ExpertiseDataSet", ClaimType = ClaimTypes.Dataset)]
        [Route("ExpertiseList_Datasource")]
        public JsonResult ExpertiseList_Datasource()
        {
            var postedData = _LoadViewModel();
            var datasourceRequest = DeserializeDatasourceRequest(postedData["datasourceRequest"].ToString());
            var queryable = Get_ExpertiseList_DatasourceQueryable(datasourceRequest);
            var response = new ListResponse
            {
                TotalRows = DatasourceRetriever.ApplyDynamicFilterToQueryable(datasourceRequest, queryable).Count(),
            };
            //Total items count
            if (CLMS.AppDev.Cache.CacheManager.Current.HasKey($"{Request.RequestContext.HttpContext.Session.SessionID}_ExpertiseList_TotalItems"))
            {
                CLMS.AppDev.Cache.CacheManager.Current.Set($"{Request.RequestContext.HttpContext.Session.SessionID}_ExpertiseList_TotalItems", response.TotalRows);
            }
            else
            {
                CLMS.AppDev.Cache.CacheManager.Current.Add($"{Request.RequestContext.HttpContext.Session.SessionID}_ExpertiseList_TotalItems", response.TotalRows);
            }
            if (response.TotalRows < datasourceRequest.StartRow + 1)
            {
                datasourceRequest.StartRow = 0;
            }
            if (datasourceRequest.GroupBy.Any())
            {
                var groups = DatasourceRetriever.RetrieveGrouped(datasourceRequest, queryable, q => q.Id, postedData);
                var items = groups.GetAllItems();
                response.Data = items.ToList().Select(i => new ExpertiseDataSet_ExpertiseDTO(i, true)).ToList();
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
                response.Data = items.ToList().Select(i => new ExpertiseDataSet_ExpertiseDTO(i, true)).ToList();
            }
            string __data = Serialize(response);
            var __result = Json(new
            {
                Type = "DatasourceData",Data = __data
            }, JsonRequestBehavior.AllowGet);
            __result.MaxJsonLength = int.MaxValue;
            return __result;
        }


        /*<DataSourceAggregators:ExpertiseList:1/>*/

        [HttpPost]
        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName = "ExpertiseDataSet", ClaimType = ClaimTypes.Dataset)]
        [Route("ExpertiseList_DatasourceAggregators")]
        public JsonResult ExpertiseList_DatasourceAggregators()
        {
            object aggregatorsResponse = null;
            var postedData = _LoadViewModel();
            var datasourceRequest = DeserializeDatasourceRequest(postedData["datasourceRequest"].ToString());
            var queryable = Get_ExpertiseList_DatasourceQueryable(datasourceRequest);
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
                var aggregatorsInfo = DeserializeAggregatorsRequest<DigicircMatchmaking.BO.Expertise>(postedData["aggregatorsRequest"].ToString());
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




        [Route("ExpertiseList_ExportV2")]
        [HttpPost]
        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName = "GeneralOperation", ClaimType = ClaimTypes.GenericAction)]
        public JsonResult ExpertiseList_ExportV2()
        {
            var postedData = _LoadViewModel();
            var datasourceRequest = DeserializeDatasourceRequest(postedData["datasourceRequest"].ToString());
            var exportOptions = Utilities.Deserialize<ExportOptionsV2>(postedData["exportData"]?.ToString());
            var aggregatorsInfo = DeserializeAggregatorsRequest<DigicircMatchmaking.BO.Expertise>(postedData["aggregatorsRequest"]?.ToString());
            var downloadKey = ExpertiseList_ExportV2Implementation(datasourceRequest, exportOptions, aggregatorsInfo);
            string __data = downloadKey;
            var __result = Json(new
            {
                Data = __data
            }, JsonRequestBehavior.AllowGet);
            __result.MaxJsonLength = int.MaxValue;
            return __result;
        }

        [NonAction]
        public string ExpertiseList_ExportV2Implementation(DatasourceRequest datasourceRequest,
                ExportOptionsV2 exportOptions, List<AggregatorInfo<DigicircMatchmaking.BO.Expertise>> aggregatorsInfo,
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
            var queryable = Get_ExpertiseList_DatasourceQueryable(datasourceRequest);
            var comparer = StringComparer.InvariantCultureIgnoreCase;
            var formattings = new Dictionary<string, string>(comparer);
            var path = "";
            var exportHelper = new ExportHelperV2<DigicircMatchmaking.BO.Expertise>(exportOptions, new Dictionary<string, Func<DigicircMatchmaking.BO.Expertise, object>>
            {
                {"Code" , item => item?.Code }, {"Value" , item => item?.Value },
            });
            if (exportHelper.Options.ColumnInfo == null)
            {
                exportHelper.Options.ColumnInfo = new List<ColumnOptionsV2>
                {
                    new ColumnOptionsV2 { Caption = BaseViewPage<object>.GetResourceValue("ExpertiseList", "RES_LIST_ExpertiseList_COLUMN_Code"), Formatting = "", Name = "Code", ExcelFormat = @"" },
                    new ColumnOptionsV2 { Caption = BaseViewPage<object>.GetResourceValue("ExpertiseList", "RES_LIST_ExpertiseList_COLUMN_Value"), Formatting = "", Name = "Value", ExcelFormat = @"" },

                };
            }
            if (string.IsNullOrWhiteSpace(exportHelper.Options.Filename))
            {
                exportHelper.Options.Filename = "ExpertiseList";
            }
            if (datasourceRequest.GroupBy.Any())
            {
                var groups = DatasourceRetriever.RetrieveGrouped(datasourceRequest, queryable, q => q.Id, aggregatorsInfo);
                var aggregators = DatasourceRetriever.RetrieveGrouped(datasourceRequest, queryable, q => q.Id, aggregatorsInfo, true);
                GroupsHelper.FormatGroupedAggregators(aggregators, formattings);
                watch.Stop();
                elapsedMilliseconds = watch.ElapsedMilliseconds;
                _logger.Info($"ExportV2 Performance: ExpertiseList export query with grouping and range {exportOptions.Range} took {elapsedMilliseconds}ms");
                watch.Restart();
                path = exportHelper.Export(groups, aggregators, null, _pdfOvverideFunction, _excelOverrideFunction);
                watch.Stop();
                elapsedMilliseconds += watch.ElapsedMilliseconds;
                _logger.Info($"ExportV2 Performance: ExpertiseList export to excel with grouping and range {exportOptions.Range} took {watch.ElapsedMilliseconds}ms");
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
                _logger.Info($"ExportV2 Performance: ExpertiseList export query with range {exportOptions.Range} took {elapsedMilliseconds}ms");
                watch.Restart();
                path = exportHelper.Export(loadedItems, aggregators, _pdfOvverideFunction, _excelOverrideFunction);
                watch.Stop();
                elapsedMilliseconds += watch.ElapsedMilliseconds;
                _logger.Info($"ExportV2 Performance: ExpertiseList export to excel with range {exportOptions.Range} took {elapsedMilliseconds}ms");
            }
            var content = System.IO.File.ReadAllBytes(Path.Combine(Path.GetTempPath(), path));
            var fileName = Path.GetFileName(path);
            var downloadKey = FileHelper.PendingDownloadInstance.Add("ExpertiseList", content, fileName);
            _logger.Info($"ExportV2 Performance: Total export time for ExpertiseList: {elapsedMilliseconds}ms");
            return downloadKey;
        }



        /*<Datasource:ExpertiseList_ExpertiseDataSet:1/>*/
        /*<DataSourceFilter:ExpertiseList_ExpertiseDataSet:2/>*/
        public IQueryable<DigicircMatchmaking.BO.Expertise> Get_ExpertiseList_ExpertiseDataSet_DatasourceQueryable(DatasourceRequest __request = null, bool shouldEvict = true)
        {
            __request = __request ?? new DatasourceRequest(0, int.MaxValue);
            if (shouldEvict)
            {
                @model?.Evict();
            }
            var __items = Get_ExpertiseList_ExpertiseDataSet_DatasourceQueryableImplementation(__request);
            return __items;
        }
        public IQueryable<DigicircMatchmaking.BO.Expertise> Get_ExpertiseList_ExpertiseDataSet_DatasourceQueryableImplementation(DatasourceRequest __request = null, bool shouldEvict = true)
        {
            __request = __request ?? new DatasourceRequest(0, int.MaxValue);
            var __items = new DigicircMatchmaking.DAL.Repository().GetAsQueryable<DigicircMatchmaking.BO.Expertise>().AsQueryable();
            return __items.Where(@this => true);
        }


        /*<DataSourceGetFullRecordset:ExpertiseList_ExpertiseDataSet:1/>*/

        [HttpPost]
        [Route("ExpertiseList_ExpertiseDataSet_GetFullRecordset")]
        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName = "ExpertiseDataSet", ClaimType = ClaimTypes.Dataset)]
        public JsonResult ExpertiseList_ExpertiseDataSet_GetFullRecordset()
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
            var queryable = Get_ExpertiseList_ExpertiseDataSet_DatasourceQueryable(datasourceRequest);
            var items = DatasourceRetriever.ApplyDynamicFilterToQueryable(datasourceRequest, queryable);
            //The following method of creating DTO responses has been changed due to the fact that the returned objects were missing properties that were not used by the client.
            //It now uses the UpdateInstance method. To be removed after some testing if no problems occur.
            //var data = items.Select(i => new ExpertiseDataSet_ExpertiseDTO(i, true)).ToList();
            var data = CreateDtoInstancesFromKeys(typeof(ExpertiseListViewModel), dataType, items.Select(i => i.Id.ToString()).ToList(), "ExpertiseList_ExpertiseDataSet");
            string __data = Utilities.Serialize(data);
            var __result = Json(new
            {
                Type = "UpdateInstance",Data = __data
            }, JsonRequestBehavior.AllowGet);
            __result.MaxJsonLength = int.MaxValue;
            return __result;
        }
        /*<DataSourceEntryPoint:ExpertiseList_ExpertiseDataSet:1/>*/

        [HttpPost]

        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName = "ExpertiseDataSet", ClaimType = ClaimTypes.Dataset)]
        [Route("ExpertiseList_ExpertiseDataSet_Datasource")]
        public JsonResult ExpertiseList_ExpertiseDataSet_Datasource()
        {
            var postedData = _LoadViewModel();
            var datasourceRequest = DeserializeDatasourceRequest(postedData["datasourceRequest"].ToString());
            var queryable = Get_ExpertiseList_ExpertiseDataSet_DatasourceQueryable(datasourceRequest);
            var response = new ListResponse
            {
                TotalRows = DatasourceRetriever.ApplyDynamicFilterToQueryable(datasourceRequest, queryable).Count(),
            };
            //Total items count
            if (CLMS.AppDev.Cache.CacheManager.Current.HasKey($"{Request.RequestContext.HttpContext.Session.SessionID}_ExpertiseList_ExpertiseDataSet_TotalItems"))
            {
                CLMS.AppDev.Cache.CacheManager.Current.Set($"{Request.RequestContext.HttpContext.Session.SessionID}_ExpertiseList_ExpertiseDataSet_TotalItems", response.TotalRows);
            }
            else
            {
                CLMS.AppDev.Cache.CacheManager.Current.Add($"{Request.RequestContext.HttpContext.Session.SessionID}_ExpertiseList_ExpertiseDataSet_TotalItems", response.TotalRows);
            }
            if (response.TotalRows < datasourceRequest.StartRow + 1)
            {
                datasourceRequest.StartRow = 0;
            }
            var _dto = DynamicDtoInfo.CreateFromPropsArray(datasourceRequest.DtoProperties);
            var _convertionMethod = _dto.GetConvertionFunc<DigicircMatchmaking.BO.Expertise>();
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
                var _modelDTO = new ExpertiseListViewModelDTO(@model);
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
            return View("ExpertiseList");
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
                log4net.LogManager.GetLogger(this.GetType()).Error("Form: ExpertiseList, Action: " + System.Web.HttpContext.Current.Items["_currentControllerAction"], e);
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
