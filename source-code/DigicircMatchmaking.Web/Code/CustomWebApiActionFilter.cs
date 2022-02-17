using System;
using System.Diagnostics;
using System.Web.Http.Filters;
using zAppDev.DotNet.Framework.Data;
using zAppDev.DotNet.Framework.Identity;
using zAppDev.DotNet.Framework.Logging;
using zAppDev.DotNet.Framework.WebApi;

namespace DigicircMatchmaking.Web.Code
{
    public class CustomWebApiActionFilter : CustomWebApiActionFilterBase
    {
        public override void OnActionExecuted(HttpActionExecutedContext filterContext)
        {
            try
            {
                MiniSessionManager.Instance.CommitChanges(filterContext.Exception);
                if(AllowPartialResponse) TryToCreatePartialResponse(filterContext);
            }
            catch (Exception x)
            {
                filterContext.Exception = x;
            }
            HandleException(filterContext);
            var timer = (Stopwatch)filterContext.Request.Properties["logtimer"];
            timer.Stop();
            _elapsed = timer.Elapsed;
            if (!LogEnabled) return;
            IdentityHelper.LogAction(
                filterContext.ActionContext.ActionDescriptor.ControllerDescriptor.ControllerName,
                filterContext.ActionContext.ActionDescriptor.ActionName,
                filterContext.Exception == null,
                filterContext.Exception?.Message);
            var loggingTimer = Stopwatch.StartNew();
            var serviceMetadata = new ExposedServiceMetadataStruct(filterContext, _elapsed);
            ExposedServiceLogger.LogExposedAPIMetadata(serviceMetadata);
            loggingTimer.Stop();
            log4net.LogManager.GetLogger(typeof(CustomWebApiActionFilter)).Info($"Logging API Metadata took {loggingTimer.ElapsedMilliseconds} ms");
            if (!(bool)filterContext.Request.Properties["requestIsLogged"])
            {
                APILogger?.LogExposedAPIAccess(_id, filterContext.ActionContext, _elapsed, false);
                filterContext.Request.Properties["requestIsLogged"] = true;
            }
        }
    }
}