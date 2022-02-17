
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
    /// The ElasticDoc extensions
    /// </summary>
    public static class ElasticDocExtensions
    {
        public static DigicircMatchmaking.ExternalStructs.ElasticSearch.ActorDoc CreateActorDoc(DigicircMatchmaking.BO.Actor actor)
        {
            DigicircMatchmaking.ExternalStructs.ElasticSearch.ActorDoc actorDoc = new DigicircMatchmaking.ExternalStructs.ElasticSearch.ActorDoc();
            actorDoc.ID = (actor?.Id ?? 0);
            actorDoc.Name = (actor?.Name ?? "");
            actorDoc.Description = (actor?.Description ?? "");
            actorDoc.Tags = (actor?.Keywords ?? "");
            if ((actor?.Address != null && actor?.Address?.Country != null))
            {
                actorDoc.Country = (actor?.Address?.Country?.Name ?? "");
            }
            if ((actor?.SectorTypes?.Count() != 0))
            {
                actorDoc.Sector = (zAppDev.DotNet.Framework.Utilities.Common.GetItemFromList(actor?.SectorTypes, 0)?.Value ?? "");
            }
            System.Collections.Generic.List<string> material = new System.Collections.Generic.List<string>();
            if (((actor?.CircularEconomyRequirements?.Resources?.Count() ?? 0) > 0))
            {
                material.AddRange(actor?.CircularEconomyRequirements?.Resources?.Select((m) => m.Resource.Name).ToList());
            }
            actorDoc.Resources = material.ToList();
            System.Collections.Generic.List<string> requestedMaterial = new System.Collections.Generic.List<string>();
            if (((actor?.CircularEconomyRequirements?.DesiredResources?.Count() ?? 0) > 0))
            {
                requestedMaterial.AddRange(actor?.CircularEconomyRequirements?.DesiredResources?.Select((m) => m.Resource.Name).ToList());
            }
            actorDoc.RequestedResources = requestedMaterial.ToList();
            return actorDoc;
        }


        public static string SendActorDoc(DigicircMatchmaking.BO.Actor actor)
        {
            if (zAppDev.DotNet.Framework.Utilities.Common.GetConfigurationKey("DontCallKnowledgeGraph") == "true")
            {
                return "";
            }
            DigicircMatchmaking.ExternalStructs.ElasticSearch.ActorDoc doc = DigicircMatchmaking.BO.ElasticDocExtensions.CreateActorDoc(actor);
            zAppDev.DotNet.Framework.Utilities.Serializer<DigicircMatchmaking.ExternalStructs.ElasticSearch.ActorDoc> ser = new zAppDev.DotNet.Framework.Utilities.Serializer<DigicircMatchmaking.ExternalStructs.ElasticSearch.ActorDoc>();
            zAppDev.DotNet.Framework.Utilities.DebugHelper.Log(zAppDev.DotNet.Framework.Utilities.DebugMessageType.Info, "ElasticDoc", DigicircMatchmaking.Hubs.EventsHub.RaiseDebugMessage, "Elastic request " + ser.ToJson(doc));
            return DigicircMatchmaking.BLL.ExternalRestServices.ElasticSearchRestService.CreateDoc((actor?.Id ?? 0), doc);
        }




    }
}
