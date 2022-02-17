// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.

using zAppDev.DotNet.Framework.Services;
using System;
using System.IO;
using System.Text;
using System.Linq;
using System.Xml.Serialization;
using System.Collections.Generic;
using zAppDev.DotNet.Framework.Utilities;

namespace DigicircMatchmaking.BLL.ExternalRestServices
{
    public class KnowledgeBaseRestService
    {
        public static string BaseUrl
        {
            get
            {
                var baseUrl = System.Configuration.ConfigurationManager.AppSettings["externalapis:KnowledgeBase:baseurl"];
                if (string.IsNullOrWhiteSpace(baseUrl))
                {
                    baseUrl = "https://knowledge-graph.clmsuk.com";
                }
                if (!string.IsNullOrWhiteSpace(baseUrl) && !baseUrl.EndsWith("/"))
                {
                    baseUrl += "/";
                }
                return baseUrl;
            }
        }

        private static string ProxyPort
        {
            get
            {
                var val = System.Configuration.ConfigurationManager.AppSettings["externalapis:proxy:port"];
                return string.IsNullOrEmpty(val) ? "0" : val;
            }
        }
        private static string BasicAuthUsername
        {
            get
            {
                var val = System.Configuration.ConfigurationManager.AppSettings["externalapis:KnowledgeBase:username"];
                return string.IsNullOrEmpty(val) ? "neo4j" : val;
            }
        }

        private static string BasicAuthPassword
        {
            get
            {
                var val = System.Configuration.ConfigurationManager.AppSettings["externalapis:KnowledgeBase:password"];
                return string.IsNullOrEmpty(val) ? "dd6VDrRwUutx72EM" : val;
            }
        }

        public static DigicircMatchmaking.ExternalStructs.KnowledgeBase.KnowledgeBaseResult CreateMaterial(DigicircMatchmaking.ExternalStructs.KnowledgeBase.MaterialCreateRequest parameter)
        {
            System.Func<string> getUrl = () =>
            {
                System.Threading.Thread.CurrentThread.CurrentCulture = System.Globalization.CultureInfo.InvariantCulture;
                return "/db/neo4j/tx/commit";
            };
            var _operationRelativeUrl = getUrl.Invoke().Trim();
            if (_operationRelativeUrl?.StartsWith("/") == true && BaseUrl?.EndsWith("/") == true)
            {
                _operationRelativeUrl = _operationRelativeUrl.TrimStart('/');
            }
            var _targetUrl = BaseUrl + _operationRelativeUrl;
            var _options = new RestServiceConsumptionOptions
            {
                Url = _targetUrl,
                Verb = RestHTTPVerb.POST,
                SecurityType = RestSecurityType.BasicAuth,
                UserName = BasicAuthUsername,
                Password = BasicAuthPassword,
                ExtraHeaderData = new System.Collections.Generic.Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) {   },
                LogAccess = false,
                IsCachingEnabled = false,
                ApiName = "KnowledgeBase",
                Operation = "CreateMaterial",
                ProxyAddress = System.Configuration.ConfigurationManager.AppSettings["externalapis:proxy:address"],
                ProxyPort = int.Parse(ProxyPort),
                ProxyUser = System.Configuration.ConfigurationManager.AppSettings["externalapis:proxy:user"],
                ProxyPassword = System.Configuration.ConfigurationManager.AppSettings["externalapis:proxy:password"],
                PostType = PostType.JSON,
                Data = parameter, FormData = new Dictionary<string, object> {{"parameter",parameter}}
            };
            Func<ServiceConsumptionContainer, DigicircMatchmaking.ExternalStructs.KnowledgeBase.KnowledgeBaseResult> _invocation = (_httpResponse) =>
            {
                var _returnedItem = RestServiceConsumer.Consume<DigicircMatchmaking.ExternalStructs.KnowledgeBase.KnowledgeBaseResult>(_options, _httpResponse);
                return zAppDev.DotNet.Framework.Utilities.Common.SafeCast<DigicircMatchmaking.ExternalStructs.KnowledgeBase.KnowledgeBaseResult>(_returnedItem);
            };
            var _consumer = new ServiceConsumer<DigicircMatchmaking.ExternalStructs.KnowledgeBase.KnowledgeBaseResult>(_invocation);
            return _consumer.Invoke(_options);
        }
        public static DigicircMatchmaking.ExternalStructs.KnowledgeBase.KnowledgeBaseResult CreateProcess(DigicircMatchmaking.ExternalStructs.KnowledgeBase.ProcessCreateRequest parameter)
        {
            System.Func<string> getUrl = () =>
            {
                System.Threading.Thread.CurrentThread.CurrentCulture = System.Globalization.CultureInfo.InvariantCulture;
                return "/db/neo4j/tx/commit";
            };
            var _operationRelativeUrl = getUrl.Invoke().Trim();
            if (_operationRelativeUrl?.StartsWith("/") == true && BaseUrl?.EndsWith("/") == true)
            {
                _operationRelativeUrl = _operationRelativeUrl.TrimStart('/');
            }
            var _targetUrl = BaseUrl + _operationRelativeUrl;
            var _options = new RestServiceConsumptionOptions
            {
                Url = _targetUrl,
                Verb = RestHTTPVerb.POST,
                SecurityType = RestSecurityType.BasicAuth,
                UserName = BasicAuthUsername,
                Password = BasicAuthPassword,
                ExtraHeaderData = new System.Collections.Generic.Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) {   },
                LogAccess = false,
                IsCachingEnabled = false,
                ApiName = "KnowledgeBase",
                Operation = "CreateProcess",
                ProxyAddress = System.Configuration.ConfigurationManager.AppSettings["externalapis:proxy:address"],
                ProxyPort = int.Parse(ProxyPort),
                ProxyUser = System.Configuration.ConfigurationManager.AppSettings["externalapis:proxy:user"],
                ProxyPassword = System.Configuration.ConfigurationManager.AppSettings["externalapis:proxy:password"],
                PostType = PostType.JSON,
                Data = parameter, FormData = new Dictionary<string, object> {{"parameter",parameter}}
            };
            Func<ServiceConsumptionContainer, DigicircMatchmaking.ExternalStructs.KnowledgeBase.KnowledgeBaseResult> _invocation = (_httpResponse) =>
            {
                var _returnedItem = RestServiceConsumer.Consume<DigicircMatchmaking.ExternalStructs.KnowledgeBase.KnowledgeBaseResult>(_options, _httpResponse);
                return zAppDev.DotNet.Framework.Utilities.Common.SafeCast<DigicircMatchmaking.ExternalStructs.KnowledgeBase.KnowledgeBaseResult>(_returnedItem);
            };
            var _consumer = new ServiceConsumer<DigicircMatchmaking.ExternalStructs.KnowledgeBase.KnowledgeBaseResult>(_invocation);
            return _consumer.Invoke(_options);
        }
        public static DigicircMatchmaking.ExternalStructs.KnowledgeBase.KnowledgeBaseResult CreateActor(DigicircMatchmaking.ExternalStructs.KnowledgeBase.ActorCreateRequest parameter)
        {
            System.Func<string> getUrl = () =>
            {
                System.Threading.Thread.CurrentThread.CurrentCulture = System.Globalization.CultureInfo.InvariantCulture;
                return "/db/neo4j/tx/commit";
            };
            var _operationRelativeUrl = getUrl.Invoke().Trim();
            if (_operationRelativeUrl?.StartsWith("/") == true && BaseUrl?.EndsWith("/") == true)
            {
                _operationRelativeUrl = _operationRelativeUrl.TrimStart('/');
            }
            var _targetUrl = BaseUrl + _operationRelativeUrl;
            var _options = new RestServiceConsumptionOptions
            {
                Url = _targetUrl,
                Verb = RestHTTPVerb.POST,
                SecurityType = RestSecurityType.BasicAuth,
                UserName = BasicAuthUsername,
                Password = BasicAuthPassword,
                ExtraHeaderData = new System.Collections.Generic.Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) {   },
                LogAccess = false,
                IsCachingEnabled = false,
                ApiName = "KnowledgeBase",
                Operation = "CreateActor",
                ProxyAddress = System.Configuration.ConfigurationManager.AppSettings["externalapis:proxy:address"],
                ProxyPort = int.Parse(ProxyPort),
                ProxyUser = System.Configuration.ConfigurationManager.AppSettings["externalapis:proxy:user"],
                ProxyPassword = System.Configuration.ConfigurationManager.AppSettings["externalapis:proxy:password"],
                PostType = PostType.JSON,
                Data = parameter, FormData = new Dictionary<string, object> {{"parameter",parameter}}
            };
            Func<ServiceConsumptionContainer, DigicircMatchmaking.ExternalStructs.KnowledgeBase.KnowledgeBaseResult> _invocation = (_httpResponse) =>
            {
                var _returnedItem = RestServiceConsumer.Consume<DigicircMatchmaking.ExternalStructs.KnowledgeBase.KnowledgeBaseResult>(_options, _httpResponse);
                return zAppDev.DotNet.Framework.Utilities.Common.SafeCast<DigicircMatchmaking.ExternalStructs.KnowledgeBase.KnowledgeBaseResult>(_returnedItem);
            };
            var _consumer = new ServiceConsumer<DigicircMatchmaking.ExternalStructs.KnowledgeBase.KnowledgeBaseResult>(_invocation);
            return _consumer.Invoke(_options);
        }
        public static void ConnectActorOfferedBy(DigicircMatchmaking.ExternalStructs.KnowledgeBase.ConnectActorMaterialRequest parameter)
        {
            System.Func<string> getUrl = () =>
            {
                System.Threading.Thread.CurrentThread.CurrentCulture = System.Globalization.CultureInfo.InvariantCulture;
                return "/db/neo4j/tx/commit";
            };
            var _operationRelativeUrl = getUrl.Invoke().Trim();
            if (_operationRelativeUrl?.StartsWith("/") == true && BaseUrl?.EndsWith("/") == true)
            {
                _operationRelativeUrl = _operationRelativeUrl.TrimStart('/');
            }
            var _targetUrl = BaseUrl + _operationRelativeUrl;
            var _options = new RestServiceConsumptionOptions
            {
                Url = _targetUrl,
                Verb = RestHTTPVerb.POST,
                SecurityType = RestSecurityType.BasicAuth,
                UserName = BasicAuthUsername,
                Password = BasicAuthPassword,
                ExtraHeaderData = new System.Collections.Generic.Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) {   },
                LogAccess = false,
                IsCachingEnabled = false,
                ApiName = "KnowledgeBase",
                Operation = "ConnectActorOfferedBy",
                ProxyAddress = System.Configuration.ConfigurationManager.AppSettings["externalapis:proxy:address"],
                ProxyPort = int.Parse(ProxyPort),
                ProxyUser = System.Configuration.ConfigurationManager.AppSettings["externalapis:proxy:user"],
                ProxyPassword = System.Configuration.ConfigurationManager.AppSettings["externalapis:proxy:password"],
                PostType = PostType.JSON,
                Data = parameter, FormData = new Dictionary<string, object> {{"parameter",parameter}}
            };
            Func<ServiceConsumptionContainer, object> _invocation = (_httpResponse) =>
            {
                RestServiceConsumer.Consume<object>(_options, _httpResponse);
                return null;
            };
            var _consumer = new ServiceConsumer<object>(_invocation);
            _consumer.Invoke(_options);
        }
        public static void ConnectActorRequests(DigicircMatchmaking.ExternalStructs.KnowledgeBase.ConnectActorMaterialRequest parameter)
        {
            System.Func<string> getUrl = () =>
            {
                System.Threading.Thread.CurrentThread.CurrentCulture = System.Globalization.CultureInfo.InvariantCulture;
                return "/db/neo4j/tx/commit";
            };
            var _operationRelativeUrl = getUrl.Invoke().Trim();
            if (_operationRelativeUrl?.StartsWith("/") == true && BaseUrl?.EndsWith("/") == true)
            {
                _operationRelativeUrl = _operationRelativeUrl.TrimStart('/');
            }
            var _targetUrl = BaseUrl + _operationRelativeUrl;
            var _options = new RestServiceConsumptionOptions
            {
                Url = _targetUrl,
                Verb = RestHTTPVerb.POST,
                SecurityType = RestSecurityType.BasicAuth,
                UserName = BasicAuthUsername,
                Password = BasicAuthPassword,
                ExtraHeaderData = new System.Collections.Generic.Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) {   },
                LogAccess = false,
                IsCachingEnabled = false,
                ApiName = "KnowledgeBase",
                Operation = "ConnectActorRequests",
                ProxyAddress = System.Configuration.ConfigurationManager.AppSettings["externalapis:proxy:address"],
                ProxyPort = int.Parse(ProxyPort),
                ProxyUser = System.Configuration.ConfigurationManager.AppSettings["externalapis:proxy:user"],
                ProxyPassword = System.Configuration.ConfigurationManager.AppSettings["externalapis:proxy:password"],
                PostType = PostType.JSON,
                Data = parameter, FormData = new Dictionary<string, object> {{"parameter",parameter}}
            };
            Func<ServiceConsumptionContainer, object> _invocation = (_httpResponse) =>
            {
                RestServiceConsumer.Consume<object>(_options, _httpResponse);
                return null;
            };
            var _consumer = new ServiceConsumer<object>(_invocation);
            _consumer.Invoke(_options);
        }
        public static DigicircMatchmaking.ExternalStructs.KnowledgeBase.KnowledgeBaseResult ListPossibleMatches(DigicircMatchmaking.ExternalStructs.KnowledgeBase.ListProducersMaterialRequest parameter)
        {
            System.Func<string> getUrl = () =>
            {
                System.Threading.Thread.CurrentThread.CurrentCulture = System.Globalization.CultureInfo.InvariantCulture;
                return "/db/neo4j/tx/commit";
            };
            var _operationRelativeUrl = getUrl.Invoke().Trim();
            if (_operationRelativeUrl?.StartsWith("/") == true && BaseUrl?.EndsWith("/") == true)
            {
                _operationRelativeUrl = _operationRelativeUrl.TrimStart('/');
            }
            var _targetUrl = BaseUrl + _operationRelativeUrl;
            var _options = new RestServiceConsumptionOptions
            {
                Url = _targetUrl,
                Verb = RestHTTPVerb.POST,
                SecurityType = RestSecurityType.BasicAuth,
                UserName = BasicAuthUsername,
                Password = BasicAuthPassword,
                ExtraHeaderData = new System.Collections.Generic.Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) {   },
                LogAccess = false,
                IsCachingEnabled = false,
                ApiName = "KnowledgeBase",
                Operation = "ListPossibleMatches",
                ProxyAddress = System.Configuration.ConfigurationManager.AppSettings["externalapis:proxy:address"],
                ProxyPort = int.Parse(ProxyPort),
                ProxyUser = System.Configuration.ConfigurationManager.AppSettings["externalapis:proxy:user"],
                ProxyPassword = System.Configuration.ConfigurationManager.AppSettings["externalapis:proxy:password"],
                PostType = PostType.JSON,
                Data = parameter, FormData = new Dictionary<string, object> {{"parameter",parameter}}
            };
            Func<ServiceConsumptionContainer, DigicircMatchmaking.ExternalStructs.KnowledgeBase.KnowledgeBaseResult> _invocation = (_httpResponse) =>
            {
                var _returnedItem = RestServiceConsumer.Consume<DigicircMatchmaking.ExternalStructs.KnowledgeBase.KnowledgeBaseResult>(_options, _httpResponse);
                return zAppDev.DotNet.Framework.Utilities.Common.SafeCast<DigicircMatchmaking.ExternalStructs.KnowledgeBase.KnowledgeBaseResult>(_returnedItem);
            };
            var _consumer = new ServiceConsumer<DigicircMatchmaking.ExternalStructs.KnowledgeBase.KnowledgeBaseResult>(_invocation);
            return _consumer.Invoke(_options);
        }
        public static void DeleteRelationships(DigicircMatchmaking.ExternalStructs.KnowledgeBase.ConnectActorMaterialRequest parameter)
        {
            System.Func<string> getUrl = () =>
            {
                System.Threading.Thread.CurrentThread.CurrentCulture = System.Globalization.CultureInfo.InvariantCulture;
                return "/db/neo4j/tx/commit";
            };
            var _operationRelativeUrl = getUrl.Invoke().Trim();
            if (_operationRelativeUrl?.StartsWith("/") == true && BaseUrl?.EndsWith("/") == true)
            {
                _operationRelativeUrl = _operationRelativeUrl.TrimStart('/');
            }
            var _targetUrl = BaseUrl + _operationRelativeUrl;
            var _options = new RestServiceConsumptionOptions
            {
                Url = _targetUrl,
                Verb = RestHTTPVerb.POST,
                SecurityType = RestSecurityType.BasicAuth,
                UserName = BasicAuthUsername,
                Password = BasicAuthPassword,
                ExtraHeaderData = new System.Collections.Generic.Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) {   },
                LogAccess = false,
                IsCachingEnabled = false,
                ApiName = "KnowledgeBase",
                Operation = "DeleteRelationships",
                ProxyAddress = System.Configuration.ConfigurationManager.AppSettings["externalapis:proxy:address"],
                ProxyPort = int.Parse(ProxyPort),
                ProxyUser = System.Configuration.ConfigurationManager.AppSettings["externalapis:proxy:user"],
                ProxyPassword = System.Configuration.ConfigurationManager.AppSettings["externalapis:proxy:password"],
                PostType = PostType.JSON,
                Data = parameter, FormData = new Dictionary<string, object> {{"parameter",parameter}}
            };
            Func<ServiceConsumptionContainer, object> _invocation = (_httpResponse) =>
            {
                RestServiceConsumer.Consume<object>(_options, _httpResponse);
                return null;
            };
            var _consumer = new ServiceConsumer<object>(_invocation);
            _consumer.Invoke(_options);
        }

    }
}