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
    public class ElasticSearchRestService
    {
        public static string BaseUrl
        {
            get
            {
                var baseUrl = System.Configuration.ConfigurationManager.AppSettings["externalapis:ElasticSearch:baseurl"];
                if (string.IsNullOrWhiteSpace(baseUrl))
                {
                    baseUrl = "https://es-graph.clmsuk.com/";
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

        public static string CreateDoc(int? id, DigicircMatchmaking.ExternalStructs.ElasticSearch.ActorDoc doc)
        {
            System.Func<string> getUrl = () =>
            {
                System.Threading.Thread.CurrentThread.CurrentCulture = System.Globalization.CultureInfo.InvariantCulture;
                return "/" + zAppDev.DotNet.Framework.Utilities.Common.GetConfigurationKey("ElasticSearchIndex") + "/_doc/" + id.GetValueOrDefault(0);
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
                ExtraHeaderData = new System.Collections.Generic.Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) {   },
                LogAccess = false,
                IsCachingEnabled = false,
                ApiName = "ElasticSearch",
                Operation = "CreateDoc",
                ProxyAddress = System.Configuration.ConfigurationManager.AppSettings["externalapis:proxy:address"],
                ProxyPort = int.Parse(ProxyPort),
                ProxyUser = System.Configuration.ConfigurationManager.AppSettings["externalapis:proxy:user"],
                ProxyPassword = System.Configuration.ConfigurationManager.AppSettings["externalapis:proxy:password"],
                PostType = PostType.JSON,
                Data = doc, FormData = new Dictionary<string, object> {{"doc",doc}}
            };
            Func<ServiceConsumptionContainer, string> _invocation = (_httpResponse) =>
            {
                var _returnedItem = RestServiceConsumer.Consume<object>(_options, _httpResponse)?.ToString();
                return zAppDev.DotNet.Framework.Utilities.Common.SafeCast<string>(_returnedItem);
            };
            var _consumer = new ServiceConsumer<string>(_invocation);
            return _consumer.Invoke(_options);
        }
        public static string DeleteDoc(int? id)
        {
            System.Func<string> getUrl = () =>
            {
                System.Threading.Thread.CurrentThread.CurrentCulture = System.Globalization.CultureInfo.InvariantCulture;
                return "/" + zAppDev.DotNet.Framework.Utilities.Common.GetConfigurationKey("ElasticSearchIndex") + "/_doc/" + id.GetValueOrDefault(0);
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
                Verb = RestHTTPVerb.DELETE,
                ExtraHeaderData = new System.Collections.Generic.Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) {   },
                LogAccess = false,
                IsCachingEnabled = false,
                ApiName = "ElasticSearch",
                Operation = "DeleteDoc",
                ProxyAddress = System.Configuration.ConfigurationManager.AppSettings["externalapis:proxy:address"],
                ProxyPort = int.Parse(ProxyPort),
                ProxyUser = System.Configuration.ConfigurationManager.AppSettings["externalapis:proxy:user"],
                ProxyPassword = System.Configuration.ConfigurationManager.AppSettings["externalapis:proxy:password"],
                PostType = PostType.JSON
            };
            Func<ServiceConsumptionContainer, string> _invocation = (_httpResponse) =>
            {
                var _returnedItem = RestServiceConsumer.Consume<object>(_options, _httpResponse)?.ToString();
                return zAppDev.DotNet.Framework.Utilities.Common.SafeCast<string>(_returnedItem);
            };
            var _consumer = new ServiceConsumer<string>(_invocation);
            return _consumer.Invoke(_options);
        }
        public static DigicircMatchmaking.ExternalStructs.ElasticSearch.SearchResponse Search(DigicircMatchmaking.ExternalStructs.ElasticSearch.SearchRequest Request)
        {
            System.Func<string> getUrl = () =>
            {
                System.Threading.Thread.CurrentThread.CurrentCulture = System.Globalization.CultureInfo.InvariantCulture;
                return "/" + zAppDev.DotNet.Framework.Utilities.Common.GetConfigurationKey("ElasticSearchIndex") + "/_search/";
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
                ExtraHeaderData = new System.Collections.Generic.Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) {   },
                LogAccess = false,
                IsCachingEnabled = false,
                ApiName = "ElasticSearch",
                Operation = "Search",
                ProxyAddress = System.Configuration.ConfigurationManager.AppSettings["externalapis:proxy:address"],
                ProxyPort = int.Parse(ProxyPort),
                ProxyUser = System.Configuration.ConfigurationManager.AppSettings["externalapis:proxy:user"],
                ProxyPassword = System.Configuration.ConfigurationManager.AppSettings["externalapis:proxy:password"],
                PostType = PostType.JSON,
                Data = Request, FormData = new Dictionary<string, object> {{"Request",Request}}
            };
            Func<ServiceConsumptionContainer, DigicircMatchmaking.ExternalStructs.ElasticSearch.SearchResponse> _invocation = (_httpResponse) =>
            {
                var _returnedItem = RestServiceConsumer.Consume<DigicircMatchmaking.ExternalStructs.ElasticSearch.SearchResponse>(_options, _httpResponse);
                return zAppDev.DotNet.Framework.Utilities.Common.SafeCast<DigicircMatchmaking.ExternalStructs.ElasticSearch.SearchResponse>(_returnedItem);
            };
            var _consumer = new ServiceConsumer<DigicircMatchmaking.ExternalStructs.ElasticSearch.SearchResponse>(_invocation);
            return _consumer.Invoke(_options);
        }

    }
}