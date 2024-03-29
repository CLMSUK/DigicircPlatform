// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
using AppCode;
using DigicircMatchmaking.BO;
using DigicircMatchmaking.DAL.Queries;
using DigicircMatchmaking.UI.ViewModels.ApplicationSettingForm;
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

namespace DigicircMatchmaking.UI.Controllers.ApplicationSettingForm
{

    [RoutePrefix("ApplicationSettingForm")]
    public class ApplicationSettingFormController : ControllerBase<ApplicationSettingFormViewModel, ApplicationSettingFormViewModelDTO>
    {

        /*<Form:ApplicationSettingForm:0/>*/
        public ApplicationSettingFormController()
        {
            _logger = log4net.LogManager.GetLogger(typeof(ApplicationSettingFormController));
            if (ViewModelDTOBase.DTOHelper == null)
            {
                ViewModelDTOBase.DTOHelper = new DTOHelper();
            }
        }

        protected override void ViewModelLoaded()
        {
            var masterViewModel = new DigicircMatchmaking.UI.ViewModels.MasterPageForSlide.MasterPageForSlideViewModel
            {
                Title = model.Title
            };
            _parentController = new MasterPageForSlide.MasterPageForSlideController(masterViewModel);
            _parentController.IsDirty = IsDirty;
        }

        public ApplicationSettingFormController SetModel(ApplicationSettingFormViewModel m)
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
            return PrepareUpdateInstanceResult(typeof(ApplicationSettingFormViewModel));
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
        [CustomControllerActionFilter(LogEnabled=true, HasDefaultResultView=true, ActionName="AddApplicationSetting", ClaimType = ClaimTypes.ControllerAction)]
        [HttpGet]
        [Route("AddApplicationSetting")]
        public ActionResult AddApplicationSetting()

        {
            @model = new ApplicationSettingFormViewModel();
            System.Web.HttpContext.Current.Session["LastEntryPoint_ApplicationSettingForm"] = "AddApplicationSetting";
            return null;
        }

        [CustomControllerActionFilter(LogEnabled=true, FillDropDownInitialValues=true, ActionName="AddApplicationSetting", ClaimType = ClaimTypes.ControllerAction)]
        [HttpGet]
        [Route("_API_AddApplicationSetting")]
        public ActionResult _API_AddApplicationSetting()

        {
            @model = new ApplicationSettingFormViewModel();
            System.Web.HttpContext.Current.Session["LastEntryPoint_ApplicationSettingForm"] = "AddApplicationSetting";
            PushToHistory();
            var _masterController = new DigicircMatchmaking.UI.Controllers.MasterPageForSlide.MasterPageForSlideController(@model);
            _masterController.ExecuteRender();
            var redirectInfo = ExecuteAddApplicationSetting();
            return redirectInfo;
        }


        [CustomControllerActionFilter(LogEnabled=true, HasDefaultResultView=true, ActionName="EditApplicationSetting", ClaimType = ClaimTypes.ControllerAction)]
        [HttpGet]
        [Route("EditApplicationSetting/{*Id:int?}")]
        public ActionResult EditApplicationSetting(int? Id)

        {
            @model = new ApplicationSettingFormViewModel();
            System.Web.HttpContext.Current.Session["LastEntryPoint_ApplicationSettingForm"] = "EditApplicationSetting";
            return null;
        }

        [CustomControllerActionFilter(LogEnabled=true, FillDropDownInitialValues=true, ActionName="EditApplicationSetting", ClaimType = ClaimTypes.ControllerAction)]
        [HttpGet]
        [Route("_API_EditApplicationSetting/{*Id:int?}")]
        public ActionResult _API_EditApplicationSetting(int? Id)

        {
            @model = new ApplicationSettingFormViewModel();
            System.Web.HttpContext.Current.Session["LastEntryPoint_ApplicationSettingForm"] = "EditApplicationSetting";
            PushToHistory();
            var _masterController = new DigicircMatchmaking.UI.Controllers.MasterPageForSlide.MasterPageForSlideController(@model);
            _masterController.ExecuteRender();
            var redirectInfo = ExecuteEditApplicationSetting(Id);
            return redirectInfo;
        }


        [CustomControllerActionFilter(LogEnabled=true, CausesValidation=true, ActionName="SaveApplicationSetting", ClaimType = ClaimTypes.ControllerAction)]
        [HttpPost]
        [Route("SaveApplicationSetting")]
        public ActionResult SaveApplicationSetting()

        {
            var _data = _LoadViewModel();
            var _failedValidationsResult = GetFailedDataValidationsResult();
            if (_failedValidationsResult != null) return _failedValidationsResult;
            var redirectInfo = ExecuteSaveApplicationSetting();
            return redirectInfo;
        }

        [CustomControllerActionFilter(LogEnabled=true, ActionName="DeleteApplicationSetting", ClaimType = ClaimTypes.ControllerAction)]
        [HttpPost]
        [Route("DeleteApplicationSetting")]
        public ActionResult DeleteApplicationSetting()

        {
            var _data = _LoadViewModel();
            var redirectInfo = ExecuteDeleteApplicationSetting();
            return redirectInfo;
        }

        #endregion
        #region Controller Actions Implementation
        /*<ControllerActionImplementation:AddApplicationSetting:1/>*/
        public ActionResult ExecuteAddApplicationSetting()
        {
            if (_parentController == null) _parentController = new MasterPageForSlide.MasterPageForSlideController(new  DigicircMatchmaking.UI.ViewModels.MasterPageForSlide.MasterPageForSlideViewModel());
            ((MasterPageForSlide.MasterPageForSlideController) _parentController).ExecuteRender();
            ActionResult _result = null;
            @model.ApplicationSetting = new zAppDev.DotNet.Framework.Identity.Model.ApplicationSetting();
            @model.ApplicationSetting.IsCustom = true;
            @model.Title = BaseViewPage<string>.GetResourceValue("ApplicationSettingForm", "RES_PAGETITLE_AddApplicationSetting").ToString();
            return _result;
        }
        /*<ControllerActionImplementation:EditApplicationSetting:1/>*/
        public ActionResult ExecuteEditApplicationSetting(int? Id)
        {
            if (_parentController == null) _parentController = new MasterPageForSlide.MasterPageForSlideController(new  DigicircMatchmaking.UI.ViewModels.MasterPageForSlide.MasterPageForSlideViewModel());
            ((MasterPageForSlide.MasterPageForSlideController) _parentController).ExecuteRender();
            ActionResult _result = null;
            @model.ApplicationSetting =  new DigicircMatchmaking.DAL.Repository().GetById<zAppDev.DotNet.Framework.Identity.Model.ApplicationSetting>(Id);
            @model.Title = BaseViewPage<string>.GetResourceValue("ApplicationSettingForm", "RES_PAGETITLE_EditApplicationSetting").ToString();
            return _result;
        }
        /*<ControllerActionImplementation:SaveApplicationSetting:1/>*/
        public ActionResult ExecuteSaveApplicationSetting()
        {
            ActionResult _result = null;
            new DigicircMatchmaking.DAL.Repository().Save<zAppDev.DotNet.Framework.Identity.Model.ApplicationSetting>(@model.ApplicationSetting);
            _result = CloseForm();
            return _result;
        }
        /*<ControllerActionImplementation:DeleteApplicationSetting:1/>*/
        public ActionResult ExecuteDeleteApplicationSetting()
        {
            ActionResult _result = null;
            new DigicircMatchmaking.DAL.Repository().DeleteApplicationSetting(@model.ApplicationSetting);
            _result = CloseForm();
            return _result;
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
                var _modelDTO = new ApplicationSettingFormViewModelDTO(@model);
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
            return View("ApplicationSettingForm");
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
                log4net.LogManager.GetLogger(this.GetType()).Error("Form: ApplicationSettingForm, Action: " + System.Web.HttpContext.Current.Items["_currentControllerAction"], e);
                //throw;
                return null;
            }
        }
        public List<RuleResult> RunDataValidations(List<string> groupsToCheck = null)
        {
            var masterPageDataValidations = (_parentController as Controllers.MasterPageForSlide.MasterPageForSlideController).RunDataValidations();
            if (masterPageDataValidations?.Any() == true)
            {
                viewDTO.RuleEvaluations.DataValidations.AddRange(masterPageDataValidations);
            }
            return viewDTO.RuleEvaluations.DataValidations;
        }

        #endregion
    }
}
