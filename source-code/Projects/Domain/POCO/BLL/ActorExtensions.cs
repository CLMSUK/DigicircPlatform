
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
    /// The Actor extensions
    /// </summary>
    public static class ActorExtensions
    {
        public static System.Collections.Generic.List<DigicircMatchmaking.BO.Actor> GetActorsDataset(System.Collections.Generic.List<string> names)
        {
            System.Collections.Generic.List<DigicircMatchmaking.BO.Actor> actors = new System.Collections.Generic.List<DigicircMatchmaking.BO.Actor>();
            if ((names.Count() == 0))
            {
                actors = new DigicircMatchmaking.DAL.Repository().GetAll<DigicircMatchmaking.BO.Actor>().ToList();
            }
            else
            {
                actors = new DigicircMatchmaking.DAL.Repository().GetAsQueryable<DigicircMatchmaking.BO.Actor>()?.Where((a) => names.Contains(a.Name)).ToList().ToList();
            }
            return actors;
        }


        public static System.Collections.Generic.List<DigicircMatchmaking.BO.Actor> GetActorsFromGraphResponse(DigicircMatchmaking.BO.GraphBackendResponse response)
        {
            System.Collections.Generic.List<DigicircMatchmaking.BO.Actor> actors = new System.Collections.Generic.List<DigicircMatchmaking.BO.Actor>();
            foreach (var node in response?.Nodes?.Where((n) => n.Label == "Company").ToList() ?? Enumerable.Empty<DigicircMatchmaking.BO.Nodes>())
            {
                var _var0 = node?.Name;
                DigicircMatchmaking.BO.Actor actor = new DigicircMatchmaking.DAL.Repository().GetAsQueryable<DigicircMatchmaking.BO.Actor>((a) => a.Name == _var0)?.FirstOrDefault();
                if ((actor == null))
                {
                    continue;
                }
                actors?.Add(actor);
            }
            return actors;
        }


        public static DigicircMatchmaking.BO.Actor InitNewActor()
        {
            DigicircMatchmaking.BO.Actor actor = new DigicircMatchmaking.BO.Actor();
            actor.CircularEconomyRequirements = new DigicircMatchmaking.BO.CircularEconomyReport();
            actor.EntityType = new DigicircMatchmaking.DAL.Repository().GetAsQueryable<DigicircMatchmaking.BO.EntityType>()?.FirstOrDefault();
            return actor;
        }


        public static string GetShortDescription(this BO.Actor @this)
        {
            int? descLength = (@this?.Description?.Length ?? 0);
            if ((descLength < 250))
            {
                return (@this?.Description ?? "");
            }
            return (@this?.Description?.Substring(0, 250) ?? "") + "...";
        }


        public static System.Collections.Generic.List<DigicircMatchmaking.BO.ActorNames> GetActorNamesFromGraphResponse(DigicircMatchmaking.BO.GraphBackendResponse response)
        {
            System.Collections.Generic.List<DigicircMatchmaking.BO.ActorNames> actorNames = new System.Collections.Generic.List<DigicircMatchmaking.BO.ActorNames>();
            System.Collections.Generic.List<string> types = new DigicircMatchmaking.DAL.Repository().GetAsQueryable<DigicircMatchmaking.BO.EntityType>()?.Select((a) => a.Code).ToList();
            foreach (var node in response?.Nodes?.Where((n) => types.Contains(n.Label)).ToList() ?? Enumerable.Empty<DigicircMatchmaking.BO.Nodes>())
            {
                DigicircMatchmaking.BO.ActorNames actorName = new DigicircMatchmaking.BO.ActorNames();
                actorName.Name = (node?.Name ?? "");
                actorNames?.Add(actorName);
            }
            return actorNames;
        }


        public static int? GetGetCountOfClusterMembers(this BO.Actor @this)
        {
            if (((@this?.EntityType?.IsCluster ?? false)))
            {
                return (@this?.Actors?.Count() ?? 0);
            }
            return 0;
        }


        public static void AddProductFromAPI(this BO.Actor @this, DigicircMatchmaking.BO.Product product, bool desired)
        {
            var _var1 = product?.Resource?.Type?.Name;
            if ((product?.Resource?.Type != null && new DigicircMatchmaking.DAL.Repository().GetCount<DigicircMatchmaking.BO.ProductType>((a) => a.Name == _var1) > 0))
            {
                var _var2 = product?.Resource?.Type?.Name;
                DigicircMatchmaking.BO.ProductType productTypeDb = new DigicircMatchmaking.DAL.Repository().GetAsQueryable<DigicircMatchmaking.BO.ProductType>((a) => a.Name == _var2)?.FirstOrDefault();
                product.Resource.Type = productTypeDb;
            }
            var _var3 = product?.Resource?.UnitOfMeasurement?.Code;
            if ((product?.Resource?.UnitOfMeasurement != null && new DigicircMatchmaking.DAL.Repository().GetCount<DigicircMatchmaking.BO.UnitOfMeasurement>((a) => a.Code == _var3) > 0))
            {
                var _var4 = product?.Resource?.UnitOfMeasurement?.Code;
                DigicircMatchmaking.BO.UnitOfMeasurement unitOfMeasurementDb = new DigicircMatchmaking.DAL.Repository().GetAsQueryable<DigicircMatchmaking.BO.UnitOfMeasurement>((a) => a.Code == _var4)?.FirstOrDefault();
                product.Resource.UnitOfMeasurement = unitOfMeasurementDb;
            }
            var _var5 = product?.Resource?.Name;
            if ((product?.Resource != null && new DigicircMatchmaking.DAL.Repository().GetCount<DigicircMatchmaking.BO.Material>((a) => a.Name == _var5) > 0))
            {
                var _var6 = product?.Resource?.Name;
                DigicircMatchmaking.BO.Material materialDb = new DigicircMatchmaking.DAL.Repository().GetAsQueryable<DigicircMatchmaking.BO.Material>((a) => a.Name == _var6)?.FirstOrDefault();
                product.Resource = materialDb;
            }
            var _var7 = product?.Resource?.PhysicalForm?.Code;
            if ((product?.Resource?.PhysicalForm != null && new DigicircMatchmaking.DAL.Repository().GetCount<DigicircMatchmaking.BO.PhysicalForm>((a) => a.Code == _var7) > 0))
            {
                var _var8 = product?.Resource?.PhysicalForm?.Code;
                DigicircMatchmaking.BO.PhysicalForm physicalFormDb = new DigicircMatchmaking.DAL.Repository().GetAsQueryable<DigicircMatchmaking.BO.PhysicalForm>((a) => a.Code == _var8)?.FirstOrDefault();
                product.Resource.PhysicalForm = physicalFormDb;
            }
            var _var9 = product?.Site?.Alias;
            if ((product?.Site != null && new DigicircMatchmaking.DAL.Repository().GetCount<DigicircMatchmaking.BO.Address>((a) => a.Alias == _var9) > 0))
            {
                var _var10 = product?.Site?.Alias;
                DigicircMatchmaking.BO.Address siteDb = new DigicircMatchmaking.DAL.Repository().GetAsQueryable<DigicircMatchmaking.BO.Address>((a) => a.Alias == _var10)?.FirstOrDefault();
                product.Site = siteDb;
            }
            if ((desired))
            {
                @this?.CircularEconomyRequirements?.AddDesiredResources(product);
            }
            else
            {
                @this?.CircularEconomyRequirements?.AddResources(product);
            }
            new DigicircMatchmaking.DAL.Repository().Save<DigicircMatchmaking.BO.Actor>(@this);
        }


        public static System.Collections.Generic.List<DigicircMatchmaking.BO.Address> GetAddresses(int? id)
        {
            System.Collections.Generic.List<DigicircMatchmaking.BO.Address> addresses = new System.Collections.Generic.List<DigicircMatchmaking.BO.Address>();
            DigicircMatchmaking.BO.Actor actor =  new DigicircMatchmaking.DAL.Repository().GetById<DigicircMatchmaking.BO.Actor>(id);
            if ((actor?.Address != null))
            {
                addresses?.Add(actor?.Address);
            }
            if (((actor?.HasSites ?? false)))
            {
                addresses?.AddRange(actor?.Sites);
            }
            return addresses;
        }


        public static System.Collections.Generic.List<DigicircMatchmaking.BO.ActorNames> GetActorNamesFromElasticResponse(DigicircMatchmaking.ExternalStructs.ElasticSearch.SearchResponse response)
        {
            System.Collections.Generic.List<DigicircMatchmaking.BO.ActorNames> actorNames = new System.Collections.Generic.List<DigicircMatchmaking.BO.ActorNames>();
            System.Collections.Generic.List<string> actors = response.Hits.Hits.ToList().Select((a) => a.Source.Name).ToList();
            foreach (var name in actors ?? Enumerable.Empty<string>())
            {
                DigicircMatchmaking.BO.ActorNames actorName = new DigicircMatchmaking.BO.ActorNames();
                actorName.Name = name;
                actorNames?.Add(actorName);
            }
            return actorNames;
        }


        public static void Match(this BO.Actor @this) {}


        public static System.Collections.Generic.List<DigicircMatchmaking.BO.ActorNames> ListPossibleMatches(this BO.Actor @this, bool offers)
        {
            DigicircMatchmaking.BO.ListProducersMaterialRequest req = new DigicircMatchmaking.BO.ListProducersMaterialRequest();
            DigicircMatchmaking.BO.ListProducersMaterialStatements stat = new DigicircMatchmaking.BO.ListProducersMaterialStatements();
            if ((offers))
            {
                stat.Statement = "MATCH p=(:Actor{Id: $props.ActorId})-[*]->(:Material)-[*]->(a:Actor) RETURN a";
            }
            else
            {
                stat.Statement = "MATCH p=(a:Actor)-[*]->(:Material)-[*]->(:Actor {Id: $props.ActorId}) RETURN a";
            }
            stat.Parameters = new DigicircMatchmaking.BO.ListProducersMaterialParameters();
            stat.Parameters.Properties = new DigicircMatchmaking.BO.ListProducersMaterialProps();
            stat.Parameters.Properties.ActorId = (@this?.Id ?? 0);
            req?.AddStatements(stat);
            DigicircMatchmaking.ExternalStructs.KnowledgeBase.ListProducersMaterialRequest reqParsed = (new DigicircMatchmaking.BO.KnowledgeBaseDataTransformation.Transformer()).ListProducersMaterialRequest_To_ListProducersMaterialRequest(req);
            zAppDev.DotNet.Framework.Utilities.Serializer<DigicircMatchmaking.ExternalStructs.KnowledgeBase.ListProducersMaterialRequest> ser = new zAppDev.DotNet.Framework.Utilities.Serializer<DigicircMatchmaking.ExternalStructs.KnowledgeBase.ListProducersMaterialRequest>();
            zAppDev.DotNet.Framework.Utilities.DebugHelper.Log(zAppDev.DotNet.Framework.Utilities.DebugMessageType.Info, "Actor", DigicircMatchmaking.Hubs.EventsHub.RaiseDebugMessage, "request " + ser.ToJson(reqParsed));
            DigicircMatchmaking.ExternalStructs.KnowledgeBase.KnowledgeBaseResult result = DigicircMatchmaking.BLL.ExternalRestServices.KnowledgeBaseRestService.ListPossibleMatches(reqParsed);
            zAppDev.DotNet.Framework.Utilities.Serializer<DigicircMatchmaking.ExternalStructs.KnowledgeBase.KnowledgeBaseResult> serRes = new zAppDev.DotNet.Framework.Utilities.Serializer<DigicircMatchmaking.ExternalStructs.KnowledgeBase.KnowledgeBaseResult>();
            zAppDev.DotNet.Framework.Utilities.DebugHelper.Log(zAppDev.DotNet.Framework.Utilities.DebugMessageType.Info, "Actor", DigicircMatchmaking.Hubs.EventsHub.RaiseDebugMessage, "result " + serRes.ToJson(result));
            System.Collections.Generic.List<DigicircMatchmaking.BO.ActorNames> names = new System.Collections.Generic.List<DigicircMatchmaking.BO.ActorNames>();
            if ((result.Results.Length > 0 && zAppDev.DotNet.Framework.Utilities.Common.GetItemFromArray(result.Results, 0).Data.Length > 0))
            {
                for (var i = 0; i < zAppDev.DotNet.Framework.Utilities.Common.GetItemFromArray(result.Results, 0).Data.Length; i = i + 1)
                {
                    DigicircMatchmaking.BO.ActorNames name = new DigicircMatchmaking.BO.ActorNames();
                    name.Name = zAppDev.DotNet.Framework.Utilities.Common.GetItemFromArray(zAppDev.DotNet.Framework.Utilities.Common.GetItemFromArray(zAppDev.DotNet.Framework.Utilities.Common.GetItemFromArray(result.Results, 0).Data, i).Row, 0).Name;
                    names?.Add(name);
                }
            }
            return names;
        }



        public static string DefaultFolderPathActorLogo(this BO.Actor @this)
        {
            return "ActorActorLogo";
        }


    }
}
