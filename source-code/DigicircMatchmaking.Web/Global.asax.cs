// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.


using AppCode;
using Autofac.Integration.WebApi;
using Autofac;
using CacheManager.Core;
using log4net.Config;
using log4net;
using System.Collections.Generic;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.SessionState;
using System.Web;
using System.IO;
using System;
using zAppDev.DotNet.Framework.Logging;
using zAppDev.DotNet.Framework.Mvc;
using zAppDev.DotNet.Framework.Workflow;
using DigicircMatchmaking.Hubs;
using DigicircMatchmaking.BO;
using DigicircMatchmaking.DAL;
using DigicircMatchmaking.Web.Code;
using System.Security.Authentication;
using System.Security;
using zAppDev.DotNet.Framework.Identity.Model;
using zAppDev.DotNet.Framework.Web.UI;

namespace DigicircMatchmaking.Web
{
    internal class CustomViewEngine : RazorViewEngine
    {
        public CustomViewEngine()
        {
            var viewLocations = new[]
            {
                "~/Views/{0}.cshtml"
            };
            PartialViewLocationFormats = viewLocations;
            ViewLocationFormats = viewLocations;
        }
    }

    public class Global : HttpApplication
    {
        public void Application_Start(object sender, EventArgs e)
        {
            MvcHandler.DisableMvcResponseHeader = true;
            System.Web.Helpers.AntiForgeryConfig.UniqueClaimTypeIdentifier = System.Security.Claims.ClaimTypes.Name;
            ViewEngines.Engines.Clear();
            ViewEngines.Engines.Add(new CustomViewEngine());
            XmlConfigurator.Configure();
            var config = GlobalConfiguration.Configuration;
            config.MapHttpAttributeRoutes();
            config.EnsureInitialized();
            LogManager.GetLogger(GetType()).Info("Application start!");
            var dbMigrator = new DatabaseMigrator();
            if (dbMigrator.ShouldRun)
            {
                if (!dbMigrator.CanConnectToDatabase())
                {
                    throw new Exception("Cannot connect to the database. Please check your connection string and ensure the database exists.");
                }
                if (!dbMigrator.Run())
                {
                    throw new Exception("Failed to Upgrade the Database using the pending Migrations. Please, see the Log file for further details.");
                }
            }
            RegisterRoutes(RouteTable.Routes);
            RuntimePredicateBuilder.RequiredAssembliesPaths = new List<string>()
            {
                Server.MapPath(Path.Combine("bin", "DigicircMatchmaking.Backend.dll")),
                               Server.MapPath(Path.Combine("bin", "DigicircMatchmaking.Web.dll")),
                               Server.MapPath(Path.Combine("bin", "zAppDev.DotNet.Framework.dll"))
            };
            WebFormResources.ClearResources = true;
            Utilities.InitXssEncoder();
        }

        protected void Session_Start(object sender, EventArgs e)
        {
            if (!Session.IsNewSession) return;
            ScheduleThread.CheckScheduleThreadStatus(HttpContext.Current);
            ScheduleThread.NumberOfSessions++;
            LogManager.GetLogger(GetType()).Info($"Session: {Session.SessionID} started, user:{User.Identity?.Name} (Number Of Sessions: {ScheduleThread.NumberOfSessions})");
            EventsHub.RaiseSessionStart();
        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {
        }

        protected void Application_EndRequest(object sender, EventArgs e)
        {
            var accessError = HttpContext.Current?.Response?.Headers[nameof(SecurityException)];
            if (!string.IsNullOrWhiteSpace(accessError))
            {
                BaseViewPage<int>.SendSecurityErrorReponse(accessError);
            }
        }

        protected void Application_PostAuthorizeRequest()
        {
            var userCreationError = HttpContext.Current.Response.Headers[nameof(AuthenticationException)];
            if (!string.IsNullOrWhiteSpace(userCreationError))
            {
                BaseViewPage<int>.SendApplicationUserCreationErrorReponse(userCreationError);
            }
            if (HttpContext.Current.Request.Url.AbsolutePath.Contains("/FormAPIs/"))
            {
                HttpContext.Current.SetSessionStateBehavior(SessionStateBehavior.Required);
            }
        }

        private void UserAccessCheck()
        {
            try
            {
                EventsHub.RaiseUserAuthenticating(HttpContext.Current.User.Identity.Name);
            }
            catch (Exception e)
            {
                BaseViewPage<int>.SendSecurityErrorReponse(e.InnerException == null ? e.Message : e.InnerException.Message);
            }
        }

        protected void Application_Error(object sender, EventArgs e)
        {
            // Get the exception object.
            var exc = Server.GetLastError();
            // Log the exception and notify system operators
            LogManager.GetLogger(GetType()).Error($"Error in: {HttpContext.Current?.Request?.Url}", exc);
            // Raise the ApplicationError Event
            EventsHub.RaiseApplicationError(exc);
            // Clear the error from the server
            Server.ClearError();
        }

        protected void Session_End(object sender, EventArgs e)
        {
            zAppDev.DotNet.Framework.Identity.IdentityHelper.RemoveUserSession(Session?.SessionID);
            ScheduleThread.NumberOfSessions--;
            LogManager.GetLogger(GetType()).InfoFormat("Session: {0} expired/ended. {1} remaining.", Session.SessionID, ScheduleThread.NumberOfSessions);
        }

        public void Application_End(object sender, EventArgs e)
        {
            EventsHub.RaiseApplicationEnd();
            ScheduleThread.StopScheduleThread();
            ScheduleThread.NumberOfSessions = 0;
            LogManager.GetLogger(GetType()).Info("Application end!");
        }

        private static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.MapMvcAttributeRoutes();
        }
    }
}