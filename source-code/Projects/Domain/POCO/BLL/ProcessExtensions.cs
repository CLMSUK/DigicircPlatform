
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
    /// The Process extensions
    /// </summary>
    public static class ProcessExtensions
    {
        public static string GetProductName(this BO.Process @this)
        {
            System.Collections.Generic.List<string> productList = new System.Collections.Generic.List<string>();
            foreach (var product in @this?.Product ?? Enumerable.Empty<DigicircMatchmaking.BO.Material>())
            {
                productList.Add((product?.Name ?? ""));
            }
            return string.Join(",", productList);
        }


        public static string GetSourceName(this BO.Process @this)
        {
            System.Collections.Generic.List<string> productList = new System.Collections.Generic.List<string>();
            foreach (var product in @this?.Source ?? Enumerable.Empty<DigicircMatchmaking.BO.Material>())
            {
                productList.Add((product?.Name ?? ""));
            }
            return string.Join(",", productList);
        }


        public static string GetEnvironmentalEffects(this BO.Process @this)
        {
            if (((@this?.EnvironmentalEffects?.Length ?? 0) < 50))
            {
                return (@this?.EnvironmentalEffects ?? "");
            }
            else
            {
                return (@this?.EnvironmentalEffects?.Substring(0, 50) ?? "") + "...";
            }
        }




    }
}
