// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.IO;
using Microsoft.AspNet.SignalR;
using System.Threading;
using System.Web;
using zAppDev.DotNet.Framework.Data;
using log4net;
using System.Collections.Concurrent;
using zAppDev.DotNet.Framework.Hubs;
using zAppDev.DotNet.Framework.Identity.Model;

namespace DigicircMatchmaking.Hubs
{
    public class EventsHub : Hub, IApplicationHub
    {
        public static ConcurrentDictionary<string, string> ConnectedUsers = new ConcurrentDictionary<string, string>();

        public List<string> GetAllConnectedUsers()
        {
            return ConnectedUsers.Values.ToList();
        }

        public static bool UserIsConnected(string username)
        {
            return string.IsNullOrWhiteSpace(username)
                   ? false
                   : ConnectedUsers.Any(v => v.Value == username);
        }

        public bool IsUserConnected(string username)
        {
            return UserIsConnected(username);
        }

        public EventsHub()
        {
        }

        /* Connection Events. They are used to keep the ConnectionID to User Dictionary Updated */
        public override Task OnConnected()
        {
            //LogManager.GetLogger("SIGNALR").Error("Connected: " + Context.ConnectionId);
            string name = Context.User.Identity.Name;
            if (!string.IsNullOrWhiteSpace(name))
            {
                Groups.Add(Context.ConnectionId, name);
                ConnectedUsers.TryAdd(Context.ConnectionId, name);
            }
            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            string name = Context.User.Identity.Name;
            if (ConnectedUsers.ContainsKey(Context.ConnectionId))
            {
                ConnectedUsers.TryRemove(Context.ConnectionId, out string val);
            }
            return base.OnDisconnected(stopCalled);
        }

        public override Task OnReconnected()
        {
            return base.OnReconnected();
        }

        public string JoinGroup(string groupName)
        {
            Groups.Add(Context.ConnectionId, groupName);
            return string.Format("Group '{0}' successfully joined", groupName);
        }

        public void NTierUserConnected(string username, string connectionId)
        {
            ConnectedUsers.TryAdd(connectionId, username);
        }

        public void NTierUserDisconnected(string connectionId)
        {
            ConnectedUsers.TryRemove(connectionId, out string val);
        }

        private static void RunInNewThread(Action body)
        {
            body();
        }

        public static List<object> GetEventInputs(Guid guid)
        {
            //return System.Web.HttpContext.Current.Cache.Get(guid.ToString()) as List<object>;
            return CLMS.AppDev.Cache.CacheManager.Current.Get<List<object>>(guid.ToString());
        }

        public static void ForceUserPageReload(string username)
        {
            var hub = GlobalHost.ConnectionManager.GetHubContext<DigicircMatchmaking.Hubs.EventsHub>();
            hub.Clients.Group(username).ForcePageReload();
            hub.Clients.Group("WEB_SERVER").ForcePageReload(Guid.NewGuid(), DateTime.Now.Ticks, username);
        }

        public void ForceUserPageReloadEvent(string username)
        {
            ForceUserPageReload(username);
        }

        /* Events for Debug Messages Listeners */
        private static List<Func<string , string ,  bool>> DebugListeners = new List<Func<string , string ,  bool>>();

        public static void AddDebugListener(Func<string, string, bool> listener)
        {
            DebugListeners.Add(listener);
        }

        public static void RaiseDebugMessage(string type, string data)
        {
            if ((System.Web.HttpContext.Current == null) || (HttpContext.Current.User?.Identity?.Name != "Administrator")) // In memory of Antonis
                return;
            LogManager.GetLogger("Events").Debug("Event 'DebugMessage' was triggered");
            RunInNewThread(() =>
            {
                foreach (var listener in DebugListeners)
                {
                    listener(type, data);
                }
            });
            var guid = Guid.NewGuid();
            var sessionID = System.Web.HttpContext.Current?.Session == null
                            ? guid.ToString()
                            : System.Web.HttpContext.Current.Session.SessionID;
            System.Web.HttpContext.Current?.Cache.Add(guid.ToString(),
                    new List<object> { type, data },
                    null,
                    System.Web.Caching.Cache.NoAbsoluteExpiration,
                    TimeSpan.FromSeconds(30),
                    System.Web.Caching.CacheItemPriority.Default,
            (_k, _v, _r) => { });
            Microsoft.AspNet.SignalR.IHubContext hub = Microsoft.AspNet.SignalR.GlobalHost.ConnectionManager.GetHubContext<DigicircMatchmaking.Hubs.EventsHub>();
            var timeStamp = DateTime.UtcNow;
            var name = HttpContext.Current?.User.Identity.Name;
            hub.Clients.Group(name).debug(sessionID, guid, timeStamp.Ticks, timeStamp.ToString(System.Globalization.CultureInfo.InstalledUICulture), type, data);
        }

        private static void ProcessListeners(IEnumerable<Action> listeners, bool parallel, bool throwErrors = false)
        {
            if (parallel)
            {
                Parallel.ForEach(listeners, listener =>
                {
                    try
                    {
                        MiniSessionManager.ExecuteInUoW(manager =>
                        {
                            listener();
                        });
                    }
                    catch (Exception x)
                    {
                        LogManager.GetLogger(typeof(EventsHub)).Warn("Error in Listener", x);
                        if (throwErrors) throw;
                    }
                });
            }
            else
            {
                foreach (var listener in listeners)
                {
                    try
                    {
                        MiniSessionManager.ExecuteInUoW(manager =>
                        {
                            listener();
                        });
                    }
                    catch (Exception x)
                    {
                        // continue to the next listener on error
                        LogManager.GetLogger(typeof(EventsHub)).Warn("Error in Listener", x);
                        if (throwErrors) throw;
                    }
                }
            }
        }

        /* Events */
        public void SignIn(Guid eventGuid) { }
        private static readonly List<Func<string , DateTime? ,  bool>> SignInListeners = new List<Func<string , DateTime? ,  bool>>();
        public static void AddSignInListener(Func<string , DateTime? ,  bool> listener)
        {
            SignInListeners.Add(listener);
        }
        public static void RaiseSignIn(string UserName, DateTime? Time, string _groupName = null)
        {
            LogManager.GetLogger(typeof(EventsHub)).Debug("Event 'SignIn' was triggered");
            if (SignInListeners.Count > 0)
            {
                ProcessListeners(SignInListeners.Select(listener => new Action(() =>
                {
                    listener(UserName, Time);
                })), true );
            }
        }
        public void RaiseSignInEvent (string UserName, DateTime? Time, string _groupName = null)
        {
            RaiseSignIn(UserName,Time,_groupName);
        }
        public void SignOut(Guid eventGuid) { }
        private static readonly List<Func<string , DateTime? ,  bool>> SignOutListeners = new List<Func<string , DateTime? ,  bool>>();
        public static void AddSignOutListener(Func<string , DateTime? ,  bool> listener)
        {
            SignOutListeners.Add(listener);
        }
        public static void RaiseSignOut(string UserName, DateTime? Time, string _groupName = null)
        {
            LogManager.GetLogger(typeof(EventsHub)).Debug("Event 'SignOut' was triggered");
            if (SignOutListeners.Count > 0)
            {
                ProcessListeners(SignOutListeners.Select(listener => new Action(() =>
                {
                    listener(UserName, Time);
                })), true );
            }
        }
        public void RaiseSignOutEvent (string UserName, DateTime? Time, string _groupName = null)
        {
            RaiseSignOut(UserName,Time,_groupName);
        }
        public void ApplicationStart(Guid eventGuid) { }
        private static readonly List<Func< bool>> ApplicationStartListeners = new List<Func< bool>>();
        public static void AddApplicationStartListener(Func< bool> listener)
        {
            ApplicationStartListeners.Add(listener);
        }
        public static void RaiseApplicationStart(string _groupName = null)
        {
            LogManager.GetLogger(typeof(EventsHub)).Debug("Event 'ApplicationStart' was triggered");
            if (ApplicationStartListeners.Count > 0)
            {
                ProcessListeners(ApplicationStartListeners.Select(listener => new Action(() =>
                {
                    listener();
                })), true );
            }
        }
        public void RaiseApplicationStartEvent (string _groupName = null)
        {
            RaiseApplicationStart(_groupName);
        }
        public void ApplicationEnd(Guid eventGuid) { }
        private static readonly List<Func< bool>> ApplicationEndListeners = new List<Func< bool>>();
        public static void AddApplicationEndListener(Func< bool> listener)
        {
            ApplicationEndListeners.Add(listener);
        }
        public static void RaiseApplicationEnd(string _groupName = null)
        {
            LogManager.GetLogger(typeof(EventsHub)).Debug("Event 'ApplicationEnd' was triggered");
            if (ApplicationEndListeners.Count > 0)
            {
                ProcessListeners(ApplicationEndListeners.Select(listener => new Action(() =>
                {
                    listener();
                })), true );
            }
        }
        public void RaiseApplicationEndEvent (string _groupName = null)
        {
            RaiseApplicationEnd(_groupName);
        }
        public void ApplicationError(Guid eventGuid) { }
        private static readonly List<Func<System.Exception ,  bool>> ApplicationErrorListeners = new List<Func<System.Exception ,  bool>>();
        public static void AddApplicationErrorListener(Func<System.Exception ,  bool> listener)
        {
            ApplicationErrorListeners.Add(listener);
        }
        public static void RaiseApplicationError(System.Exception exception, string _groupName = null)
        {
            LogManager.GetLogger(typeof(EventsHub)).Debug("Event 'ApplicationError' was triggered");
            if (ApplicationErrorListeners.Count > 0)
            {
                ProcessListeners(ApplicationErrorListeners.Select(listener => new Action(() =>
                {
                    listener(exception);
                })), true );
            }
        }
        public void RaiseApplicationErrorEvent (System.Exception exception, string _groupName = null)
        {
            RaiseApplicationError(exception,_groupName);
        }
        public void SessionStart(Guid eventGuid) { }
        private static readonly List<Func< bool>> SessionStartListeners = new List<Func< bool>>();
        public static void AddSessionStartListener(Func< bool> listener)
        {
            SessionStartListeners.Add(listener);
        }
        public static void RaiseSessionStart(string _groupName = null)
        {
            LogManager.GetLogger(typeof(EventsHub)).Debug("Event 'SessionStart' was triggered");
            if (SessionStartListeners.Count > 0)
            {
                ProcessListeners(SessionStartListeners.Select(listener => new Action(() =>
                {
                    listener();
                })), true );
            }
        }
        public void RaiseSessionStartEvent (string _groupName = null)
        {
            RaiseSessionStart(_groupName);
        }
        public void OnInstanceSave(Guid eventGuid) { }
        private static readonly List<Func<System.Object ,  bool>> OnInstanceSaveListeners = new List<Func<System.Object ,  bool>>();
        public static void AddOnInstanceSaveListener(Func<System.Object ,  bool> listener)
        {
            OnInstanceSaveListeners.Add(listener);
        }
        public static void RaiseOnInstanceSave(System.Object Instance, string _groupName = null)
        {
            if (OnInstanceSaveListeners.Count > 0)
            {
                ProcessListeners(OnInstanceSaveListeners.Select(listener => new Action(() =>
                {
                    listener(Instance);
                })), true , true);
            }
        }
        public void RaiseOnInstanceSaveEvent (System.Object Instance, string _groupName = null)
        {
            RaiseOnInstanceSave(Instance,_groupName);
        }
        public void FileDownload(Guid eventGuid) { }
        private static readonly List<Func<string , string ,  bool>> FileDownloadListeners = new List<Func<string , string ,  bool>>();
        public static void AddFileDownloadListener(Func<string , string ,  bool> listener)
        {
            FileDownloadListeners.Add(listener);
        }
        public static void RaiseFileDownload(string path, string username, string _groupName = null)
        {
            LogManager.GetLogger(typeof(EventsHub)).Debug("Event 'FileDownload' was triggered");
            if (FileDownloadListeners.Count > 0)
            {
                ProcessListeners(FileDownloadListeners.Select(listener => new Action(() =>
                {
                    listener(path, username);
                })), true );
            }
        }
        public void RaiseFileDownloadEvent (string path, string username, string _groupName = null)
        {
            RaiseFileDownload(path,username,_groupName);
        }
        public void ExternalUserCreating(Guid eventGuid) { }
        private static readonly List<Func<zAppDev.DotNet.Framework.Identity.Model.ApplicationUser ,  bool>> ExternalUserCreatingListeners = new List<Func<zAppDev.DotNet.Framework.Identity.Model.ApplicationUser ,  bool>>();
        public static void AddExternalUserCreatingListener(Func<zAppDev.DotNet.Framework.Identity.Model.ApplicationUser ,  bool> listener)
        {
            ExternalUserCreatingListeners.Add(listener);
        }
        public static void RaiseExternalUserCreating(zAppDev.DotNet.Framework.Identity.Model.ApplicationUser user, string _groupName = null)
        {
            LogManager.GetLogger(typeof(EventsHub)).Debug("Event 'ExternalUserCreating' was triggered");
            if (ExternalUserCreatingListeners.Count > 0)
            {
                ProcessListeners(ExternalUserCreatingListeners.Select(listener => new Action(() =>
                {
                    listener(user);
                })), true , true);
            }
        }
        public void RaiseExternalUserCreatingEvent (zAppDev.DotNet.Framework.Identity.Model.ApplicationUser user, string _groupName = null)
        {
            RaiseExternalUserCreating(user,_groupName);
        }
        public void UserAuthenticating(Guid eventGuid) { }
        private static readonly List<Func<string ,  bool>> UserAuthenticatingListeners = new List<Func<string ,  bool>>();
        public static void AddUserAuthenticatingListener(Func<string ,  bool> listener)
        {
            UserAuthenticatingListeners.Add(listener);
        }
        public static void RaiseUserAuthenticating(string username, string _groupName = null)
        {
            LogManager.GetLogger(typeof(EventsHub)).Debug("Event 'UserAuthenticating' was triggered");
            if (UserAuthenticatingListeners.Count > 0)
            {
                ProcessListeners(UserAuthenticatingListeners.Select(listener => new Action(() =>
                {
                    listener(username);
                })), true , true);
            }
        }
        public void RaiseUserAuthenticatingEvent (string username, string _groupName = null)
        {
            RaiseUserAuthenticating(username,_groupName);
        }

    }
}