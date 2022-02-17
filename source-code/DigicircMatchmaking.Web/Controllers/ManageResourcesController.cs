// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
using AppCode;
using DigicircMatchmaking.BO;
using DigicircMatchmaking.DAL.Queries;
using DigicircMatchmaking.UI.ViewModels.ManageResources;
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

namespace DigicircMatchmaking.UI.Controllers.ManageResources
{

    [RoutePrefix("ManageResources")]
    public class ManageResourcesController : ControllerBase<ManageResourcesViewModel, ManageResourcesViewModelDTO>
    {

        /*<Form:ManageResources:0/>*/
        public ManageResourcesController()
        {
            _logger = log4net.LogManager.GetLogger(typeof(ManageResourcesController));
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

        public ManageResourcesController SetModel(ManageResourcesViewModel m)
        {
            @model = m;
            return this;
        }


        public override void CommitAllFiles()
        {
            GetPartialController("PartialView")?.CommitAllFiles();
            FileHelper.PendingUploadInstance.CommitAllFilesNew("ManageResources", @model);
        }

        public override void CommitAllFilesLegacy()
        {
            GetPartialController("PartialView")?.CommitAllFilesLegacy();
        }

        public override void ClearPendingFiles()
        {
            GetPartialController("PartialView")?.ClearPendingFiles();
            FileHelper.PendingUploadInstance.Clear("ManageResources");
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
            return PrepareUpdateInstanceResult(typeof(ManageResourcesViewModel),new [] { typeof(ManageResourcesViewModel),typeof(ViewModels.ResourceForm.ResourceFormViewModel) });
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
            return FileHelper.PendingDownloadInstance.DownloadByKey("ManageResources", id);
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




        protected override CustomControllerBase GetPartialController(string partialControlName)
        {
            var _ResourceForm = GetResourceFormController(partialControlName, false);
            if (_ResourceForm != null) return _ResourceForm;
            return null;
        }
        private ResourceForm.ResourceFormController GetResourceFormController(string partialControlName, bool throwIfNotFound = true)
        {
            ViewModels.ResourceForm.ResourceFormViewModel partialsModel = null;
            switch (partialControlName)
            {
            case "PartialView":
                partialsModel = new ViewModels.ResourceForm.ResourceFormViewModel
                {
                    Product = @model.SelectedProduct,
                    ActorId = @model.Actor.Id,
                    DropdownBox4SelectedItems = @model.PartialViewDropdownBox4SelectedItems,
                    DropdownBoxSelectedItems = @model.PartialViewDropdownBoxSelectedItems
                };
                break;
            default:
                if (throwIfNotFound) throw new Exception($"Partial control '{partialControlName}' not found");
                return null;
            }
            var partialController = new ResourceForm.ResourceFormController();
            partialController.__PartialControlName = partialControlName;
            partialController.SetModel(partialsModel);
            partialController.ControllerContext = this.ControllerContext;
            return partialController;
        }
        private Action<ManageResourcesViewModel, ViewModels.ResourceForm.ResourceFormViewModel> GetResourceFormTransformer(string partialControlName, bool throwIfNotFound = true)
        {
            switch (partialControlName)
            {
            case "PartialView":
                return (model, partial_model) =>
                {
                    model.SelectedProduct = partial_model.Product;
                    model.Actor.Id = partial_model.ActorId;
                };
                break;
            default:
                if (throwIfNotFound) throw new Exception($"Partial control '{partialControlName}' not found");
                return null;
            }
        }
        private void FillDropDownInitialValuesFromPartial_ResourceForm(string partialControlName, ManageResourcesViewModelDTO parentDTO)
        {
            var controller = GetResourceFormController(partialControlName);
            var model = controller.GetModel();
            var partialDto = new ViewModels.ResourceForm.ResourceFormViewModelDTO(controller.GetModel());
            partialDto.FillDropDownsInitialValues(model, controller);
            switch (partialControlName)
            {
            case "PartialView":
                parentDTO.PartialViewDropdownBox4__InitialSelection = partialDto.DropdownBox4__InitialSelection;
                parentDTO.PartialViewDropdownBox__InitialSelection = partialDto.DropdownBox__InitialSelection;
                break;
            }
        }
        #region Partial Views Actions
        [CustomControllerActionFilter(ActionName="ResourceForm", ClaimType = ClaimTypes.ControllerAction)]
        [HttpPost]
        [Route("_API_ResourceForm")]
        public ActionResult _API_ResourceForm(string controlName, string actionName)

        {
            var _data = _LoadViewModel();
            if (!_redirectionFromSameController)
            {
                controlName = DeserializeViewModelProperty<string>(_data["controlName"] as Newtonsoft.Json.Linq.JValue);
                actionName = DeserializeViewModelProperty<string>(_data["actionName"] as Newtonsoft.Json.Linq.JValue);
            }
            var partialController = GetResourceFormController(controlName);
            ActionResult redirectInfo = null;
            switch (actionName)
            {
            default:
                throw new Exception($"Partial view 'ResourceForm' does not have an action named '{actionName}'");
            }
            viewDTO.ClientCommands = partialController.viewDTO.ClientCommands;
            var copyTo = GetResourceFormTransformer(controlName);
            copyTo?.Invoke(model, partialController.GetModel());
            return redirectInfo;
        }

        [CustomControllerActionFilter(ActionName="ResourceForm", ClaimType = ClaimTypes.ControllerAction)]
        [HttpPost]
        [Route("ResourceForm")]
        public ActionResult ResourceForm(string controlName, string actionName)

        {
            var _data = _LoadViewModel();
            if (!_redirectionFromSameController)
            {
                controlName = DeserializeViewModelProperty<string>(_data["controlName"] as Newtonsoft.Json.Linq.JValue);
                actionName = DeserializeViewModelProperty<string>(_data["actionName"] as Newtonsoft.Json.Linq.JValue);
            }
            var partialController = GetResourceFormController(controlName);
            ActionResult redirectInfo = null;
            switch (actionName)
            {
            default:
                throw new Exception($"Partial view 'ResourceForm' does not have an action named '{actionName}'");
            }
            viewDTO.ClientCommands = partialController.viewDTO.ClientCommands;
            var copyTo = GetResourceFormTransformer(controlName);
            copyTo?.Invoke(model, partialController.GetModel());
            return redirectInfo;
        }

        #endregion
        #region Controller Actions
        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName="Index", ClaimType = ClaimTypes.ControllerAction)]
        [HttpGet]
        [Route("Index/{*id:int?}")]
        public ActionResult Index(int? id)

        {
            @model = new ManageResourcesViewModel();
            System.Web.HttpContext.Current.Session["LastEntryPoint_ManageResources"] = "Index";
            FileHelper.PendingUploadInstance.Clear("ManageResources");
            FileHelper.PendingDownloadInstance.Clear("ManageResources");
            return null;
        }

        [CustomControllerActionFilter(FillDropDownInitialValues=true, ActionName="Index", ClaimType = ClaimTypes.ControllerAction)]
        [HttpGet]
        [Route("_API_Index/{*id:int?}")]
        public ActionResult _API_Index(int? id)

        {
            @model = new ManageResourcesViewModel();
            System.Web.HttpContext.Current.Session["LastEntryPoint_ManageResources"] = "Index";
            PushToHistory();
            FileHelper.PendingUploadInstance.Clear("ManageResources");
            FileHelper.PendingDownloadInstance.Clear("ManageResources");
            var _masterController = new DigicircMatchmaking.UI.Controllers.MasterPage.MasterPageController(@model);
            _masterController.ExecuteRender();
            var redirectInfo = ExecuteIndex(id);
            return redirectInfo;
        }


        [CustomControllerActionFilter(ActionName="AddNewResource", ClaimType = ClaimTypes.ControllerAction)]
        [HttpPost]
        [Route("AddNewResource")]
        public ActionResult AddNewResource(bool desired = false)

        {
            var _data = _LoadViewModel();
            if (!_redirectionFromSameController)
            {
                desired = _data["desired"]?.ToString()?.ToLower() == "true";
            }
            var redirectInfo = ExecuteAddNewResource(desired);
            return redirectInfo;
        }

        [CustomControllerActionFilter(ActionName="EditResource", ClaimType = ClaimTypes.ControllerAction)]
        [HttpPost]
        [Route("EditResource")]
        public ActionResult EditResource(DigicircMatchmaking.BO.Product product)

        {
            var _data = _LoadViewModel();
            if (!_redirectionFromSameController)
            {
                product = DeserializeViewModelProperty<DigicircMatchmaking.BO.Product, ViewModels.ManageResources.ProductDTO>(_data["product"].ToString());
            }
            var redirectInfo = ExecuteEditResource(product);
            return redirectInfo;
        }

        [CustomControllerActionFilter(LogEnabled=true, ActionName="CloseModal", ClaimType = ClaimTypes.ControllerAction)]
        [HttpPost]
        [Route("CloseModal")]
        public ActionResult CloseModal()

        {
            var _data = _LoadViewModel();
            var redirectInfo = ExecuteCloseModal();
            return redirectInfo;
        }

        [CustomControllerActionFilter(ActionName="DeleteResource", ClaimType = ClaimTypes.ControllerAction)]
        [HttpPost]
        [Route("DeleteResource")]
        public ActionResult DeleteResource(DigicircMatchmaking.BO.Product product)

        {
            var _data = _LoadViewModel();
            if (!_redirectionFromSameController)
            {
                product = DeserializeViewModelProperty<DigicircMatchmaking.BO.Product, ViewModels.ManageResources.ProductDTO>(_data["product"].ToString());
            }
            var redirectInfo = ExecuteDeleteResource(product);
            return redirectInfo;
        }

        [CustomControllerActionFilter(ActionName="Save", ClaimType = ClaimTypes.ControllerAction)]
        [HttpPost]
        [Route("Save")]
        public ActionResult Save()

        {
            var _data = _LoadViewModel();
            var redirectInfo = ExecuteSave();
            return redirectInfo;
        }

        [CustomControllerActionFilter(ActionName="RequestNewMaterial", ClaimType = ClaimTypes.ControllerAction)]
        [HttpPost]
        [Route("RequestNewMaterial")]
        public ActionResult RequestNewMaterial()

        {
            var _data = _LoadViewModel();
            var redirectInfo = ExecuteRequestNewMaterial();
            return redirectInfo;
        }

        [CustomControllerActionFilter(ActionName="CloseMaterialModal", ClaimType = ClaimTypes.ControllerAction)]
        [HttpPost]
        [Route("CloseMaterialModal")]
        public ActionResult CloseMaterialModal(bool save = false)

        {
            var _data = _LoadViewModel();
            if (!_redirectionFromSameController)
            {
                save = _data["save"]?.ToString()?.ToLower() == "true";
            }
            var redirectInfo = ExecuteCloseMaterialModal(save);
            return redirectInfo;
        }

        #endregion
        #region Controller Actions Implementation
        /*<ControllerActionImplementation:Index:1/>*/
        public ActionResult ExecuteIndex(int? id)
        {
            if (_parentController == null) _parentController = new MasterPage.MasterPageController(new  DigicircMatchmaking.UI.ViewModels.MasterPage.MasterPageViewModel());
            ((MasterPage.MasterPageController) _parentController).ExecuteRender();
            ActionResult _result = null;
            @model.Actor =  new DigicircMatchmaking.DAL.Repository().GetById<DigicircMatchmaking.BO.Actor>(id);
            @model.Title = "'" + (@model.Actor?.Name ?? "") + "' " + BaseViewPage<string>.GetResourceValue("ManageResources", "RES_PAGETITLE_Index").ToString();
            @model.IsEdited = false;
            string currentUserName = zAppDev.DotNet.Framework.Identity.IdentityHelper.GetCurrentUserName();
            if ((currentUserName != @model.Actor?.AddedBy?.UserName && @model.Actor?.Administrators?.Where((a) => a.UserName == currentUserName).Count() == 0))
            {
                ClientCommand(ClientCommands.SHOW_MESSAGE, "You don't have permission to edit this actor.", MessageType.Warning, (!string.IsNullOrEmpty(System.Configuration.ConfigurationManager.AppSettings["ServerExternalPath"]) ?
                              System.Configuration.ConfigurationManager.AppSettings["ServerExternalPath"] : zAppDev.DotNet.Framework.Utilities.Web.GetApplicationPathUri(false)) +
                              "/ActorForm/Show"+ "?id=" + (id));
                return null;
            }
            return _result;
        }
        /*<ControllerActionImplementation:AddNewResource:1/>*/
        public ActionResult ExecuteAddNewResource(bool desired)
        {
            ActionResult _result = null;
            @model.ModalTitle = "Add new Resource";
            @model.SelectedProduct = new DigicircMatchmaking.BO.Product();
            @model.SelectedProduct.IsDesired = desired;
            @model.IsEdited = false;
            ClientCommand(ClientCommands.SHOW_MODAL, $"Modal");
            return _result;
        }
        /*<ControllerActionImplementation:EditResource:1/>*/
        public ActionResult ExecuteEditResource(DigicircMatchmaking.BO.Product product)
        {
            ActionResult _result = null;
            @model.ModalTitle = "Edit " + (product?.Resource?.Name ?? "");
            @model.IsEdited = true;
            @model.SelectedProduct = product;
            ClientCommand(ClientCommands.SHOW_MODAL, $"Modal");
            return _result;
        }
        /*<ControllerActionImplementation:CloseModal:1/>*/
        public ActionResult ExecuteCloseModal()
        {
            ActionResult _result = null;
            if (((@model.SelectedProduct?.IsDesired ?? false)))
            {
                if ((@model.IsEdited))
                {
                    @model.UpdateDesiredResources?.Add(@model.SelectedProduct);
                }
                else
                {
                    @model.Actor?.CircularEconomyRequirements?.AddDesiredResources(@model.SelectedProduct);
                    @model.NewDesiredResources?.Add(@model.SelectedProduct);
                }
            }
            else
            {
                if ((@model.IsEdited))
                {
                    @model.UpdateResource?.Add(@model.SelectedProduct);
                }
                else
                {
                    @model.Actor?.CircularEconomyRequirements?.AddResources(@model.SelectedProduct);
                    @model.NewResources?.Add(@model.SelectedProduct);
                }
            }
            @model.SelectedProduct = null;
            @model.IsEdited = false;
            ClientCommand(ClientCommands.HIDE_MODAL, $"Modal");
            return _result;
        }
        /*<ControllerActionImplementation:DeleteResource:1/>*/
        public ActionResult ExecuteDeleteResource(DigicircMatchmaking.BO.Product product)
        {
            ActionResult _result = null;
            if (((product?.IsDesired ?? false)))
            {
                @model.Actor?.CircularEconomyRequirements?.RemoveDesiredResources(product);
            }
            else
            {
                @model.Actor?.CircularEconomyRequirements?.RemoveResources(product);
            }
            DigicircMatchmaking.BO.ActorBackendExtensions.DeleteRelationShips((@model.Actor?.Id ?? 0), (product?.Resource?.Id ?? 0));
            if ((product?.Id != 0))
            {
                new DigicircMatchmaking.DAL.Repository().DeleteProduct(product);
            }
            return _result;
        }
        /*<ControllerActionImplementation:Save:1/>*/
        public ActionResult ExecuteSave()
        {
            ActionResult _result = null;
            foreach (var product in @model.NewResources ?? Enumerable.Empty<DigicircMatchmaking.BO.Product>())
            {
                DigicircMatchmaking.BO.ActorBackendExtensions.ConnectActorOfferedBy((@model.Actor?.Id ?? 0), product);
            }
            foreach (var product in @model.NewDesiredResources ?? Enumerable.Empty<DigicircMatchmaking.BO.Product>())
            {
                DigicircMatchmaking.BO.ActorBackendExtensions.ConnectActorRequests((@model.Actor?.Id ?? 0), product);
            }
            string response = DigicircMatchmaking.BO.ElasticDocExtensions.SendActorDoc(@model.Actor);
            zAppDev.DotNet.Framework.Utilities.DebugHelper.Log(zAppDev.DotNet.Framework.Utilities.DebugMessageType.Info, "ManageResources", DigicircMatchmaking.Hubs.EventsHub.RaiseDebugMessage, "response elastic " + response);
            new DigicircMatchmaking.DAL.Repository().Save<DigicircMatchmaking.BO.Actor>(@model.Actor);
            ClientCommand(ClientCommands.SHOW_MESSAGE, "Resources saved successfully.", MessageType.Success);
            return _result;
        }
        /*<ControllerActionImplementation:RequestNewMaterial:1/>*/
        public ActionResult ExecuteRequestNewMaterial()
        {
            ActionResult _result = null;
            ClientCommand(ClientCommands.SHOW_MODAL, $"NewMaterialModal");
            return _result;
        }
        /*<ControllerActionImplementation:CloseMaterialModal:1/>*/
        public ActionResult ExecuteCloseMaterialModal(bool save)
        {
            ActionResult _result = null;
            if ((save))
            {
                @model.Material.RequestedBy =  new DigicircMatchmaking.DAL.Repository().GetById<DigicircMatchmaking.BO.DigicircUser>(zAppDev.DotNet.Framework.Identity.IdentityHelper.GetCurrentUserName());
                @model.Material.PendingGraph = true;
                new DigicircMatchmaking.DAL.Repository().Save<DigicircMatchmaking.BO.Material>(@model.Material);
            }
            @model.Material = null;
            ClientCommand(ClientCommands.HIDE_MODAL, $"NewMaterialModal");
            return _result;
        }
        #endregion
        #region Datasource controls
        /*<Datasource:ManageResources_Resources:1/>*/
        /*<DataSourceFilter:ManageResources_Resources:2/>*/
        public IQueryable<DigicircMatchmaking.BO.Product> Get_ManageResources_Resources_DatasourceQueryable(DatasourceRequest __request = null, bool shouldEvict = true)
        {
            __request = __request ?? new DatasourceRequest(0, int.MaxValue);
            if (shouldEvict)
            {
                @model?.Evict();
            }
            var __items = Get_ManageResources_Resources_DatasourceQueryableImplementation(__request);
            return __items;
        }
        public IQueryable<DigicircMatchmaking.BO.Product> Get_ManageResources_Resources_DatasourceQueryableImplementation(DatasourceRequest __request = null, bool shouldEvict = true)
        {
            __request = __request ?? new DatasourceRequest(0, int.MaxValue);
            var __items = model?.Actor?.CircularEconomyRequirements?.Resources?.AsQueryable();
            if (__items == null) return new List<DigicircMatchmaking.BO.Product>().AsQueryable();
            return __items.Where(@this => true);
        }


        /*<DataSourceGetFullRecordset:ManageResources_Resources:1/>*/

        [HttpPost]
        [Route("ManageResources_Resources_GetFullRecordset")]
        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName = "Resources", ClaimType = ClaimTypes.Dataset)]
        public JsonResult ManageResources_Resources_GetFullRecordset()
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
            var queryable = Get_ManageResources_Resources_DatasourceQueryable(datasourceRequest);
            var items = DatasourceRetriever.ApplyDynamicFilterToQueryable(datasourceRequest, queryable);
            //The following method of creating DTO responses has been changed due to the fact that the returned objects were missing properties that were not used by the client.
            //It now uses the UpdateInstance method. To be removed after some testing if no problems occur.
            //var data = items.Select(i => new Resources_ProductDTO(i, true)).ToList();
            var data = CreateDtoInstancesFromKeys(typeof(ManageResourcesViewModel), dataType, items.Select(i => i.Id.ToString()).ToList(), "ManageResources_Resources");
            string __data = Utilities.Serialize(data);
            var __result = Json(new
            {
                Type = "UpdateInstance",Data = __data
            }, JsonRequestBehavior.AllowGet);
            __result.MaxJsonLength = int.MaxValue;
            return __result;
        }
        /*<DataSourceEntryPoint:ManageResources_Resources:1/>*/

        [HttpPost]

        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName = "Resources", ClaimType = ClaimTypes.Dataset)]
        [Route("ManageResources_Resources_Datasource")]
        public JsonResult ManageResources_Resources_Datasource()
        {
            var postedData = _LoadViewModel();
            var datasourceRequest = DeserializeDatasourceRequest(postedData["datasourceRequest"].ToString());
            var queryable = Get_ManageResources_Resources_DatasourceQueryable(datasourceRequest);
            var response = new ListResponse
            {
                TotalRows = DatasourceRetriever.ApplyDynamicFilterToQueryable(datasourceRequest, queryable).Count(),
            };
            //Total items count
            if (CLMS.AppDev.Cache.CacheManager.Current.HasKey($"{Request.RequestContext.HttpContext.Session.SessionID}_ManageResources_Resources_TotalItems"))
            {
                CLMS.AppDev.Cache.CacheManager.Current.Set($"{Request.RequestContext.HttpContext.Session.SessionID}_ManageResources_Resources_TotalItems", response.TotalRows);
            }
            else
            {
                CLMS.AppDev.Cache.CacheManager.Current.Add($"{Request.RequestContext.HttpContext.Session.SessionID}_ManageResources_Resources_TotalItems", response.TotalRows);
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
                var _modelDTO = new ManageResourcesViewModelDTO(@model);
                if (fillDropDownInitialValues)
                {
                    FillDropDownInitialValuesFromPartial_ResourceForm("PartialView", _modelDTO);
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
            return View("ManageResources");
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
                log4net.LogManager.GetLogger(this.GetType()).Error("Form: ManageResources, Action: " + System.Web.HttpContext.Current.Items["_currentControllerAction"], e);
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
