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
    ///This is a test class for ProductTypeTest and is intended
    ///to contain all ProductTypeTest NUnit Tests
    ///</summary>
    [TestFixture]
    [Description("ProductType Repository Tests")]
    [Category("ProductType Repository Tests")]
    internal class ProductTypeTests : NHibernateFixture
    {
        /// <summary>
        ///A test for testing the persistence of an object from Db
        ///</summary>
        [Test]
        [Description("This tests the persistence of `ProductType`")]
        [Order(0)]
        public void ProductType_persistence_test()
        {
            DateTime now = DateTime.Now;
            // Get datetime without milliseconds
            now = new DateTime(now.Ticks - (now.Ticks % TimeSpan.TicksPerSecond), now.Kind);
            var _product_parenttype_sybtypes = new DigicircMatchmaking.BO.ProductType
            {
                Name = "ProductType_Name",
            };
            var _product_parenttype_sybtypes2 = new DigicircMatchmaking.BO.ProductType
            {
                Name = "ProductType_Name",
            };
            var _product_sybtypes_parenttype = new DigicircMatchmaking.BO.ProductType
            {
                Name = "ProductType_Name",
            };
            var _product_sybtypes_parenttype2 = new DigicircMatchmaking.BO.ProductType
            {
                Name = "ProductType_Name",
            };
            new PersistenceSpecification<DigicircMatchmaking.BO.ProductType>(Session)
            .CheckProperty(p => p.Name, "ProductType_Name")
            .CheckBag(p => p.ParentType, (new List<DigicircMatchmaking.BO.ProductType>
            {
                _product_parenttype_sybtypes,
                _product_parenttype_sybtypes2
            }))
            .CheckBag(p => p.SybTypes, (new List<DigicircMatchmaking.BO.ProductType>
            {
                _product_sybtypes_parenttype,
                _product_sybtypes_parenttype2
            }))
            .VerifyTheMappings();
        }

        /// <summary>
        ///A test for testing the filtering of an object from Db
        ///</summary>
        [Test]
        [Description("This tests the filtering of `ProductType`")]
        [Order(1)]
        public void ProductType_filtering_test()
        {
            DateTime now = DateTime.Now;
            // Get datetime without milliseconds
            now = new DateTime(now.Ticks - (now.Ticks % TimeSpan.TicksPerSecond), now.Kind);
            var repo = new Repository(Session);
            List<DigicircMatchmaking.BO.ProductType> results = null;
            Assert.DoesNotThrow(() =>
            {
                results = repo.GetAsQueryable<DigicircMatchmaking.BO.ProductType>(
                              a => true
                              && (a.Name != string.Empty && a.Name != null)
                              && a.ParentType.Any()
                              && a.SybTypes.Any()
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