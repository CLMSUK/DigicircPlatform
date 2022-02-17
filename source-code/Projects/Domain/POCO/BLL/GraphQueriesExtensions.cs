
// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.

using System;
using System.Runtime.Serialization;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Collections;
using zAppDev.DotNet.Framework.Utilities;
using zAppDev.DotNet.Framework.Configuration;
using zAppDev.DotNet.Framework.Data.Domain;
using NHibernate.Linq;

using DigicircMatchmaking.DAL;
using DigicircMatchmaking.DAL.Queries;
namespace DigicircMatchmaking.BO
{
    /// <summary>
    /// The GraphQueries extensions
    /// </summary>
    public static class GraphQueriesExtensions
    {
        public static DigicircMatchmaking.BO.GraphBackendResponse Query(string queryText)
        {
            DigicircMatchmaking.ExternalStructs.GraphBackend.Query q = DigicircMatchmaking.BO.QueryExtensions.GetDefault();
            q.SearchText = queryText;
            DigicircMatchmaking.ExternalStructs.GraphBackend.GraphBackendResponse response = DigicircMatchmaking.BLL.ExternalRestServices.GraphBackendRestService.Query(q);
            return (new DigicircMatchmaking.BO.GraphBackendDataTransformation.Transformer()).GraphBackendResponse_To_GraphBackendResponseReversed(response);
        }


        public static string RawQuery(string queryText)
        {
            DigicircMatchmaking.ExternalStructs.GraphBackend.Query q = DigicircMatchmaking.BO.QueryExtensions.GetDefault();
            q.SearchText = queryText;
            return DigicircMatchmaking.BLL.ExternalRestServices.GraphBackendRestService.RawQuery(q);
        }


        public static DigicircMatchmaking.BO.GraphBackendResponse ExtenedQuery(System.Collections.Generic.List<DigicircMatchmaking.BO.ExElements> exElements)
        {
            DigicircMatchmaking.ExternalStructs.GraphBackend.QueryExtended q = DigicircMatchmaking.BO.QueryExtendedExtensions.GetDefault();
            q.MessageSearchData = DigicircMatchmaking.BO.GraphQueriesExtensions.GetExMessageSearchData();
            q.Elements = DigicircMatchmaking.BO.ExElementsExtensions.Transform(exElements).ToList();
            q.Relations = DigicircMatchmaking.BO.ExRelationsExtensions.GetDefaults().ToList();
            DigicircMatchmaking.ExternalStructs.GraphBackend.GraphBackendResponse response = DigicircMatchmaking.BLL.ExternalRestServices.GraphBackendRestService.ExtenedQuery(q);
            return (new DigicircMatchmaking.BO.GraphBackendDataTransformation.Transformer()).GraphBackendResponse_To_GraphBackendResponseReversed(response);
        }


        public static string RawExtenedQuery(System.Collections.Generic.List<DigicircMatchmaking.BO.ExElements> exElements)
        {
            DigicircMatchmaking.ExternalStructs.GraphBackend.QueryExtended q = DigicircMatchmaking.BO.QueryExtendedExtensions.GetDefault();
            q.MessageSearchData = DigicircMatchmaking.BO.GraphQueriesExtensions.GetExMessageSearchData();
            q.Elements = DigicircMatchmaking.BO.ExElementsExtensions.Transform(exElements).ToList();
            q.Relations = DigicircMatchmaking.BO.ExRelationsExtensions.GetDefaults().ToList();
            return DigicircMatchmaking.BLL.ExternalRestServices.GraphBackendRestService.RawExtenedQuery(q);
        }


        public static DigicircMatchmaking.ExternalStructs.GraphBackend.ExMessageSearchData GetExMessageSearchData()
        {
            DigicircMatchmaking.ExternalStructs.GraphBackend.ExMessageSearchData exMessage = new DigicircMatchmaking.ExternalStructs.GraphBackend.ExMessageSearchData();
            exMessage.LabelSearchType = "Whole";
            exMessage.DepthSearchLevel = "1";
            exMessage.JsonResponseFormat = "NotIndented";
            exMessage.AlgorithmName = "";
            DigicircMatchmaking.ExternalStructs.GraphBackend.ExSecurity exSecurity = new DigicircMatchmaking.ExternalStructs.GraphBackend.ExSecurity();
            exSecurity.ExAuthorization = "NoAuth";
            exSecurity.UserName = zAppDev.DotNet.Framework.Utilities.Common.GetConfigurationKey("GraphBackendUserName");
            exSecurity.Passwd = zAppDev.DotNet.Framework.Utilities.Common.GetConfigurationKey("GraphBackendPasswd");
            exMessage.ExSecurity = exSecurity;
            return exMessage;
        }




    }
}