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
    ///This is a test class for BusinessFunctionTest and is intended
    ///to contain all BusinessFunctionTest NUnit Tests
    ///</summary>
    [TestFixture]
    [Description("BusinessFunction Repository Tests")]
    [Category("BusinessFunction Repository Tests")]
    internal class BusinessFunctionTests : NHibernateFixture
    {
        /// <summary>
        ///A test for testing the persistence of an object from Db
        ///</summary>
        [Test]
        [Description("This tests the persistence of `BusinessFunction`")]
        [Order(0)]
        public void BusinessFunction_persistence_test()
        {
            DateTime now = DateTime.Now;
            // Get datetime without milliseconds
            now = new DateTime(now.Ticks - (now.Ticks % TimeSpan.TicksPerSecond), now.Kind);
            new PersistenceSpecification<DigicircMatchmaking.BO.BusinessFunction>(Session)
            .CheckProperty(p => p.Value, "BusinessFunction_Value")
            .VerifyTheMappings();
        }

        /// <summary>
        ///A test for testing the filtering of an object from Db
        ///</summary>
        [Test]
        [Description("This tests the filtering of `BusinessFunction`")]
        [Order(1)]
        public void BusinessFunction_filtering_test()
        {
            DateTime now = DateTime.Now;
            // Get datetime without milliseconds
            now = new DateTime(now.Ticks - (now.Ticks % TimeSpan.TicksPerSecond), now.Kind);
            var repo = new Repository(Session);
            List<DigicircMatchmaking.BO.BusinessFunction> results = null;
            Assert.DoesNotThrow(() =>
            {
                results = repo.GetAsQueryable<DigicircMatchmaking.BO.BusinessFunction>(
                              a => true
                              && (a.Value != string.Empty && a.Value != null)
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