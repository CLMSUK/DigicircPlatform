// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.

using System;
using System.Collections.Generic;
using System.Linq;
using NUnit.Framework;
using FluentNHibernate.Testing;
using DigicircMatchmaking.BO;
using DigicircMatchmaking.BoTesting.Tests.Common;
using DigicircMatchmaking.DAL;

namespace DigicircMatchmaking.BoTesting.Tests
{
    /// <summary>
    ///This is a test class for ProcessTest and is intended
    ///to contain all ProcessTest NUnit Tests
    ///</summary>
    [TestFixture]
    [Description("Process Repository Tests")]
    [Category("Process Repository Tests")]
    internal class ProcessTests : NHibernateFixture
    {
        /// <summary>
        ///A test for testing the persistence of an object from Db
        ///</summary>
        [Test]
        [Description("This tests the persistence of `Process`")]
        [Order(0)]
        public void Process_persistence_test()
        {
            DateTime now = DateTime.Now;
            // Get datetime without milliseconds
            now = new DateTime(now.Ticks - (now.Ticks % TimeSpan.TicksPerSecond), now.Kind);
            var _materialsbase_product_convertedby = new DigicircMatchmaking.BO.Material
            {
                Name = "Material_Name",
                Description = "Material_Description",
                HsSpecific = "Material_HsSpecific",
                PendingGraph = true,
                IsHazardous = true,
            };
            var _materialsbase_product_convertedby2 = new DigicircMatchmaking.BO.Material
            {
                Name = "Material_Name",
                Description = "Material_Description",
                HsSpecific = "Material_HsSpecific",
                PendingGraph = true,
                IsHazardous = true,
            };
            var _materialsbase_source_convertby = new DigicircMatchmaking.BO.Material
            {
                Name = "Material_Name",
                Description = "Material_Description",
                HsSpecific = "Material_HsSpecific",
                PendingGraph = true,
                IsHazardous = true,
            };
            var _materialsbase_source_convertby2 = new DigicircMatchmaking.BO.Material
            {
                Name = "Material_Name",
                Description = "Material_Description",
                HsSpecific = "Material_HsSpecific",
                PendingGraph = true,
                IsHazardous = true,
            };
            new PersistenceSpecification<DigicircMatchmaking.BO.Process>(Session)
            .CheckProperty(p => p.Name, "Process_Name")
            .CheckProperty(p => p.Notes, "Process_Notes")
            .CheckProperty(p => p.Ref, "Process_Ref")
            .CheckProperty(p => p.EnvironmentalEffects, "Process_EnvironmentalEffects")
            .CheckBag(p => p.Product, (new List<DigicircMatchmaking.BO.Material>
            {
                _materialsbase_product_convertedby,
                _materialsbase_product_convertedby2
            }))
            .CheckBag(p => p.Source, (new List<DigicircMatchmaking.BO.Material>
            {
                _materialsbase_source_convertby,
                _materialsbase_source_convertby2
            }))
            .VerifyTheMappings();
        }

        /// <summary>
        ///A test for testing the filtering of an object from Db
        ///</summary>
        [Test]
        [Description("This tests the filtering of `Process`")]
        [Order(1)]
        public void Process_filtering_test()
        {
            DateTime now = DateTime.Now;
            // Get datetime without milliseconds
            now = new DateTime(now.Ticks - (now.Ticks % TimeSpan.TicksPerSecond), now.Kind);
            var repo = new Repository(Session);
            List<DigicircMatchmaking.BO.Process> results = null;
            Assert.DoesNotThrow(() =>
            {
                results = repo.GetAsQueryable<DigicircMatchmaking.BO.Process>(
                              a => true
                              && (a.Name != string.Empty && a.Name != null)
                              && (a.Notes != string.Empty && a.Notes != null)
                              && (a.Ref != string.Empty && a.Ref != null)
                              && (a.EnvironmentalEffects != string.Empty && a.EnvironmentalEffects != null)
                              && a.Product.Any()
                              && a.Source.Any()
                              ,
                              cacheQuery: true)
                          .OrderBy(a => a)
                          .Skip(0)
                          .Take(3)
                          .ToList();
            });
            Assert.AreNotEqual(null, results);
        }
    }
}