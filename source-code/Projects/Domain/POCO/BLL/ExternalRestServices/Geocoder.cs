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
    public class GeocoderRestService
    {
        public static string BaseUrl
        {
            get
            {
                var baseUrl = System.Configuration.ConfigurationManager.AppSettings["externalapis:Geocoder:baseurl"];
                if (string.IsNullOrWhiteSpace(baseUrl))
                {
                    baseUrl = "https://api.opencagedata.com/geocode/v1/";
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

        public static DigicircMatchmaking.ExternalStructs.Geocoder.Result Query(string q, string key)
        {
            System.Func<string> getUrl = () =>
            {
                System.Threading.Thread.CurrentThread.CurrentCulture = System.Globalization.CultureInfo.InvariantCulture;
                return "json" + "?q=" + q + "&key=" + key;
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
                Verb = RestHTTPVerb.GET,
                ExtraHeaderData = new System.Collections.Generic.Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) {   },
                LogAccess = false,
                IsCachingEnabled = false,
                ApiName = "Geocoder",
                Operation = "Query",
                ProxyAddress = System.Configuration.ConfigurationManager.AppSettings["externalapis:proxy:address"],
                ProxyPort = int.Parse(ProxyPort),
                ProxyUser = System.Configuration.ConfigurationManager.AppSettings["externalapis:proxy:user"],
                ProxyPassword = System.Configuration.ConfigurationManager.AppSettings["externalapis:proxy:password"]
            };
            Func<ServiceConsumptionContainer, DigicircMatchmaking.ExternalStructs.Geocoder.Result> _invocation = (_httpResponse) =>
            {
                var _returnedItem = RestServiceConsumer.Consume<DigicircMatchmaking.ExternalStructs.Geocoder.Result>(_options, _httpResponse);
                return zAppDev.DotNet.Framework.Utilities.Common.SafeCast<DigicircMatchmaking.ExternalStructs.Geocoder.Result>(_returnedItem);
            };
            var _consumer = new ServiceConsumer<DigicircMatchmaking.ExternalStructs.Geocoder.Result>(_invocation);
            return _consumer.Invoke(_options);
        }

    }
}