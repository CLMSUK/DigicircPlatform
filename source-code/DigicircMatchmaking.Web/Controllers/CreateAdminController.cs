// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
using AppCode;
using DigicircMatchmaking.BO;
using DigicircMatchmaking.DAL.Queries;
using DigicircMatchmaking.UI.ViewModels.CreateAdmin;
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

namespace DigicircMatchmaking.UI.Controllers.CreateAdmin
{

    [RoutePrefix("CreateAdmin")]
    public class CreateAdminController : ControllerBase<CreateAdminViewModel, CreateAdminViewModelDTO>
    {

        /*<Form:CreateAdmin:0/>*/
        public CreateAdminController()
        {
            _logger = log4net.LogManager.GetLogger(typeof(CreateAdminController));
            if (ViewModelDTOBase.DTOHelper == null)
            {
                ViewModelDTOBase.DTOHelper = new DTOHelper();
            }
        }

        protected override void ViewModelLoaded()
        {
            var masterViewModel = new DigicircMatchmaking.UI.ViewModels.MasterPageSignIn.MasterPageSignInViewModel
            {

            };
            _parentController = new MasterPageSignIn.MasterPageSignInController(masterViewModel);
            _parentController.IsDirty = IsDirty;
        }

        public CreateAdminController SetModel(CreateAdminViewModel m)
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
            return PrepareUpdateInstanceResult(typeof(CreateAdminViewModel));
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
        [CustomControllerActionFilter(LogEnabled=true, HasDefaultResultView=true, ActionName="Index", ClaimType = ClaimTypes.ControllerAction)]
        [HttpGet]
        [Route("Index")]
        public ActionResult Index()

        {
            @model = new CreateAdminViewModel();
            System.Web.HttpContext.Current.Session["LastEntryPoint_CreateAdmin"] = "Index";
            return null;
        }

        [CustomControllerActionFilter(LogEnabled=true, FillDropDownInitialValues=true, ActionName="Index", ClaimType = ClaimTypes.ControllerAction)]
        [HttpGet]
        [Route("_API_Index")]
        public ActionResult _API_Index()

        {
            @model = new CreateAdminViewModel();
            System.Web.HttpContext.Current.Session["LastEntryPoint_CreateAdmin"] = "Index";
            PushToHistory();
            var _masterController = new DigicircMatchmaking.UI.Controllers.MasterPageSignIn.MasterPageSignInController(@model);
            _masterController.ExecuteRender();
            var redirectInfo = ExecuteIndex();
            return redirectInfo;
        }


        [CustomControllerActionFilter(LogEnabled=true, CausesValidation=true, ActionName="Create", ClaimType = ClaimTypes.ControllerAction)]
        [HttpPost]
        [Route("Create")]
        public ActionResult Create()

        {
            var _data = _LoadViewModel();
            var _failedValidationsResult = GetFailedDataValidationsResult();
            if (_failedValidationsResult != null) return _failedValidationsResult;
            var redirectInfo = ExecuteCreate();
            return redirectInfo;
        }

        [CustomControllerActionFilter(ActionName="AuthorizeAccess", ClaimType = ClaimTypes.ControllerAction)]
        [HttpPost]
        [Route("AuthorizeAccess")]
        public ActionResult AuthorizeAccess()

        {
            var _data = _LoadViewModel();
            var redirectInfo = ExecuteAuthorizeAccess();
            return redirectInfo;
        }

        #endregion
        #region Controller Actions Implementation
        /*<ControllerActionImplementation:Index:1/>*/
        public ActionResult ExecuteIndex()
        {
            if (_parentController == null) _parentController = new MasterPageSignIn.MasterPageSignInController(new  DigicircMatchmaking.UI.ViewModels.MasterPageSignIn.MasterPageSignInViewModel());
            ((MasterPageSignIn.MasterPageSignInController) _parentController).ExecuteRender();
            ActionResult _result = null;
            _result = this.ExecuteAuthorizeAccess();
            return _result;
        }
        /*<ControllerActionImplementation:Create:1/>*/
        public ActionResult ExecuteCreate()
        {
            ActionResult _result = null;
            _result = this.ExecuteAuthorizeAccess();
            if (@model.password?.Trim() != @model.repeatPassword?.Trim())
            {
                throw new Exception("Passwords do not match!");
            }
            if (@model.username?.Trim() == "")
            {
                throw new Exception("No username provided!");
            }
            zAppDev.DotNet.Framework.Identity.Model.ApplicationRole adminRole = new DigicircMatchmaking.DAL.Repository().GetAsQueryable<zAppDev.DotNet.Framework.Identity.Model.ApplicationRole>((r) => r.Name == "Administrator")?.FirstOrDefault();
            if ((adminRole == null))
            {
                throw new Exception("No Administrator role found in Database!");
            }
            zAppDev.DotNet.Framework.Identity.Model.ApplicationUser adminUser = new zAppDev.DotNet.Framework.Identity.Model.ApplicationUser();
            adminUser.UserName = (@model.username?.Trim() ?? "");
            adminUser.Email = (@model.email?.Trim() ?? "");
            adminUser?.AddRoles(adminRole);
            string possibleError = zAppDev.DotNet.Framework.Identity.IdentityHelper.CreateUser(adminUser, (@model.password?.Trim() ?? ""));
            if ((((possibleError == null || possibleError == "")) == false))
            {
                ClientCommand(ClientCommands.SHOW_MESSAGE, possibleError, MessageType.Error);
                return null;
            }
            _result = GetRedirectInfo("SignInPage", "Load", new  RouteValueDictionary(new { fromMatching = true }));
            return _result;
        }
        /*<ControllerActionImplementation:AuthorizeAccess:1/>*/
        public ActionResult ExecuteAuthorizeAccess()
        {
            ActionResult _result = null;
            if ((new DigicircMatchmaking.DAL.Repository().GetCount<zAppDev.DotNet.Framework.Identity.Model.ApplicationUser>((u) => u.Roles.Any((r) => r.Name == "Administrator")) > 0))
            {
                throw new Exception("There is already a user with the Administrator role!");
            }
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
                var _modelDTO = new CreateAdminViewModelDTO(@model);
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
            return View("CreateAdmin");
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
                log4net.LogManager.GetLogger(this.GetType()).Error("Form: CreateAdmin, Action: " + System.Web.HttpContext.Current.Items["_currentControllerAction"], e);
                //throw;
                return null;
            }
        }
        public List<RuleResult> RunDataValidations(List<string> groupsToCheck = null)
        {
            viewDTO.RuleEvaluations.DataValidations.Add(PasswordsMatchValidation(groupsToCheck));
            viewDTO.RuleEvaluations.DataValidations.Add(EmptyUsernameValidation(groupsToCheck));
            var masterPageDataValidations = (_parentController as Controllers.MasterPageSignIn.MasterPageSignInController).RunDataValidations();
            if (masterPageDataValidations?.Any() == true)
            {
                viewDTO.RuleEvaluations.DataValidations.AddRange(masterPageDataValidations);
            }
            return viewDTO.RuleEvaluations.DataValidations;
        }


        /*<DataValidation:PasswordsMatchValidation:1/>*/
        [zAppDev.DotNet.Framework.Mvc.Rule(RuleType.DataValidation, EvalTime.OnSubmit)]
        public RuleResult PasswordsMatchValidation(List<string> groupsToCheck = null)
        {
            var __evaluations = new List<RuleEvaluation>();
            Func<int[], bool> __evaluation = (indexes) =>
            {
                /*<DataValidationCondition:PasswordsMatchValidation:2/>*/
                return @model.password?.Trim() != @model.repeatPassword?.Trim();
            };
            Func<string> __message = () =>
            {
                /*<DataValidationMesage:PasswordsMatchValidation:2/>*/
                return BaseViewPage<string>.GetResourceValue("CreateAdmin", "RES_DATAVALIDATION_MESSAGE_PasswordsMatch").ToString();
            };
            var __indexes = new int[] {};
            var __status = __evaluation.Invoke(__indexes);
            var __messageToSend = __status == true ? __message.Invoke() : null;
            __evaluations.Add(new RuleEvaluation
            {
                Status = __status,
                Expression = __messageToSend,
                Indexes = __indexes,
                DataValidationMessageType = DataValidationMessageType.ERROR
            });
            return new RuleResult
            {
                Name = "PasswordsMatchValidation",
                Evaluations = __evaluations
            };
        }


        /*<DataValidation:EmptyUsernameValidation:1/>*/
        [zAppDev.DotNet.Framework.Mvc.Rule(RuleType.DataValidation, EvalTime.OnSubmit)]
        public RuleResult EmptyUsernameValidation(List<string> groupsToCheck = null)
        {
            var __evaluations = new List<RuleEvaluation>();
            Func<int[], bool> __evaluation = (indexes) =>
            {
                /*<DataValidationCondition:EmptyUsernameValidation:2/>*/
                return @model.username?.Trim() == "";
            };
            Func<string> __message = () =>
            {
                /*<DataValidationMesage:EmptyUsernameValidation:2/>*/
                return BaseViewPage<string>.GetResourceValue("CreateAdmin", "RES_DATAVALIDATION_MESSAGE_EmptyUsername").ToString();
            };
            var __indexes = new int[] {};
            var __status = __evaluation.Invoke(__indexes);
            var __messageToSend = __status == true ? __message.Invoke() : null;
            __evaluations.Add(new RuleEvaluation
            {
                Status = __status,
                Expression = __messageToSend,
                Indexes = __indexes,
                DataValidationMessageType = DataValidationMessageType.ERROR
            });
            return new RuleResult
            {
                Name = "EmptyUsernameValidation",
                Evaluations = __evaluations
            };
        }

        #endregion
    }
}
