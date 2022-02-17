
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
    /// The Company extensions
    /// </summary>
    public static class CompanyExtensions
    {
        public static void TransformToActor(DigicircMatchmaking.BO.EntityType entityType)
        {
            foreach (var company in new DigicircMatchmaking.DAL.Repository().GetAll<DigicircMatchmaking.BO.Company>() ?? Enumerable.Empty<DigicircMatchmaking.BO.Company>())
            {
                DigicircMatchmaking.BO.Actor actor = new DigicircMatchmaking.BO.Actor();
                actor.EntityType = entityType;
                actor.Name = (company?.company_name ?? "");
                actor.Description = (company?.description ?? "");
                actor.Url = (company?.url ?? "");
                actor.Address = new DigicircMatchmaking.BO.Address();
                actor.Address.Town = (company?.city ?? "");
                actor.Address.Zip = (company?.zip_code ?? "");
                var _var0 = company?.country;
                actor.Address.Country = new DigicircMatchmaking.DAL.Repository().GetAsQueryable<DigicircMatchmaking.BO.Country>((a) => a.ShortName == _var0)?.FirstOrDefault();
                DigicircMatchmaking.BO.SectorType sector = new DigicircMatchmaking.BO.SectorType();
                var _var1 = company?.company_category;
                DigicircMatchmaking.BO.SectorType dbSector = new DigicircMatchmaking.DAL.Repository().GetAsQueryable<DigicircMatchmaking.BO.SectorType>((s) => s.Value == _var1)?.FirstOrDefault();
                if ((dbSector != null))
                {
                    sector = dbSector;
                }
                else
                {
                    sector.Value = (company?.company_category ?? "");
                }
                System.Collections.Generic.List<DigicircMatchmaking.BO.SectorType> types = new System.Collections.Generic.List<DigicircMatchmaking.BO.SectorType>();
                types?.Add(sector);
                actor.SectorTypes = types.ToList();
                actor.CircularEconomyRequirements = new DigicircMatchmaking.BO.CircularEconomyReport();
                new DigicircMatchmaking.DAL.Repository().Save<DigicircMatchmaking.BO.Actor>(actor);
            }
        }




    }
}
