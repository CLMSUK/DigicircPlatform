// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
using AppCode;
using DigicircMatchmaking.BO;
using DigicircMatchmaking.DAL.Queries;
using DigicircMatchmaking.UI.ViewModels.FirstAdminSetup;
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

namespace DigicircMatchmaking.UI.Controllers.FirstAdminSetup
{

    [RoutePrefix("FirstAdminSetup")]
    public class FirstAdminSetupController : ControllerBase<FirstAdminSetupViewModel, FirstAdminSetupViewModelDTO>
    {

        /*<Form:FirstAdminSetup:0/>*/
        public FirstAdminSetupController()
        {
            _logger = log4net.LogManager.GetLogger(typeof(FirstAdminSetupController));
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

        public FirstAdminSetupController SetModel(FirstAdminSetupViewModel m)
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
            return PrepareUpdateInstanceResult(typeof(FirstAdminSetupViewModel));
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
        [CustomControllerActionFilter(HasDefaultResultView=true, ActionName="Render", ClaimType = ClaimTypes.ControllerAction)]
        [HttpGet]
        [Route("Render")]
        public ActionResult Render()

        {
            @model = new FirstAdminSetupViewModel();
            System.Web.HttpContext.Current.Session["LastEntryPoint_FirstAdminSetup"] = "Render";
            return null;
        }

        [CustomControllerActionFilter(FillDropDownInitialValues=true, ActionName="Render", ClaimType = ClaimTypes.ControllerAction)]
        [HttpGet]
        [Route("_API_Render")]
        public ActionResult _API_Render()

        {
            @model = new FirstAdminSetupViewModel();
            System.Web.HttpContext.Current.Session["LastEntryPoint_FirstAdminSetup"] = "Render";
            PushToHistory();
            var _masterController = new DigicircMatchmaking.UI.Controllers.MasterPage.MasterPageController(@model);
            _masterController.ExecuteRender();
            var redirectInfo = ExecuteRender();
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

        #endregion
        #region Controller Actions Implementation
        /*<ControllerActionImplementation:Render:1/>*/
        public ActionResult ExecuteRender()
        {
            if (_parentController == null) _parentController = new MasterPage.MasterPageController(new  DigicircMatchmaking.UI.ViewModels.MasterPage.MasterPageViewModel());
            ((MasterPage.MasterPageController) _parentController).ExecuteRender();
            ActionResult _result = null;
            if ((new DigicircMatchmaking.DAL.Repository().GetAsQueryable<zAppDev.DotNet.Framework.Identity.Model.ApplicationUser>()?.Any((x) => x.Roles.Any((r) => r.Name == "Administrator")) ?? false))
            {
                ClientCommand(ClientCommands.SHOW_MESSAGE, BaseViewPage<string>.GetResourceValue("FirstAdminSetup", "RES_CUSTOM_NoAccess").ToString(), MessageType.Error, (!string.IsNullOrEmpty(System.Configuration.ConfigurationManager.AppSettings["ServerExternalPath"]) ?
                              System.Configuration.ConfigurationManager.AppSettings["ServerExternalPath"] : zAppDev.DotNet.Framework.Utilities.Web.GetApplicationPathUri(false)) +
                              "/HomePage/Render");
                zAppDev.DotNet.Framework.Utilities.DebugHelper.Log(zAppDev.DotNet.Framework.Utilities.DebugMessageType.Warning, "FirstAdminSetup", DigicircMatchmaking.Hubs.EventsHub.RaiseDebugMessage, "Admin user already exists");
                return null;
            }
            @model.ApplicationUser = zAppDev.DotNet.Framework.Identity.IdentityHelper.GetCurrentApplicationUser();
            @model.Title = BaseViewPage<string>.GetResourceValue("FirstAdminSetup", "RES_PAGETITLE_Render").ToString();
            return _result;
        }
        /*<ControllerActionImplementation:Save:1/>*/
        public ActionResult ExecuteSave()
        {
            ActionResult _result = null;
            zAppDev.DotNet.Framework.Identity.Model.ApplicationRole role = new DigicircMatchmaking.DAL.Repository().GetAsQueryable<zAppDev.DotNet.Framework.Identity.Model.ApplicationRole>((r) => r.Name == "Administrator")?.FirstOrDefault();
            if (role == null)
            {
                throw new Exception((BaseViewPage<string>.GetResourceValue("FirstAdminSetup", "RES_CUSTOM_NoAdminRoleFound").ToString()));
            }
            if ((@model.ApplicationUser?.IsInRole("Administrator") ?? false))
            {
                throw new Exception((BaseViewPage<string>.GetResourceValue("FirstAdminSetup", "RES_CUSTOM_AlreadyAdmin").ToString()));
            }
            @model.ApplicationUser?.AddRoles(role);
            new DigicircMatchmaking.DAL.Repository().Save<zAppDev.DotNet.Framework.Identity.Model.ApplicationUser>(@model.ApplicationUser);
            _result = GetRedirectInfo("HomePage", "Render", new  RouteValueDictionary(new {  }));
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
                var _modelDTO = new FirstAdminSetupViewModelDTO(@model);
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
            return View("FirstAdminSetup");
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
                log4net.LogManager.GetLogger(this.GetType()).Error("Form: FirstAdminSetup, Action: " + System.Web.HttpContext.Current.Items["_currentControllerAction"], e);
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
