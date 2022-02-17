
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
    /// The Geocoder extensions
    /// </summary>
    public static class GeocoderExtensions
    {
        public static DigicircMatchmaking.BO.Address Query(DigicircMatchmaking.BO.Address address)
        {
            if (zAppDev.DotNet.Framework.Utilities.Common.GetConfigurationKey("DontCallKnowledgeGraph") == "true")
            {
                return address;
            }
            zAppDev.DotNet.Framework.Utilities.DebugHelper.Log(zAppDev.DotNet.Framework.Utilities.DebugMessageType.Info, "Geocoder", DigicircMatchmaking.Hubs.EventsHub.RaiseDebugMessage, (address?.FullAddress ?? ""));
            DigicircMatchmaking.ExternalStructs.Geocoder.ResultItems result = DigicircMatchmaking.BLL.ExternalRestServices.GeocoderRestService.Query((address?.FullAddress ?? ""), zAppDev.DotNet.Framework.Utilities.Common.GetConfigurationKey("OpenCageApiKey")).Results.FirstOrDefault();
            address.Latitude = result.Geometry.Latitude;
            address.Longitude = result.Geometry.Longitude;
            return address;
        }




    }
}
