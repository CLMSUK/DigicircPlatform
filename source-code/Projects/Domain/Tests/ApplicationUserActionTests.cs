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
    ///This is a test class for ApplicationUserActionTest and is intended
    ///to contain all ApplicationUserActionTest NUnit Tests
    ///</summary>
    [TestFixture]
    [Description("ApplicationUserAction Repository Tests")]
    [Category("ApplicationUserAction Repository Tests")]
    internal class ApplicationUserActionTests : NHibernateFixture
    {
        /// <summary>
        ///A test for testing the persistence of an object from Db
        ///</summary>
        [Test]
        [Description("This tests the persistence of `ApplicationUserAction`")]
        [Order(0)]
        public void ApplicationUserAction_persistence_test()
        {
            DateTime now = DateTime.Now;
            // Get datetime without milliseconds
            now = new DateTime(now.Ticks - (now.Ticks % TimeSpan.TicksPerSecond), now.Kind);
            new PersistenceSpecification<zAppDev.DotNet.Framework.Identity.Model.ApplicationUserAction>(Session)
            .CheckProperty(p => p.UserName, "ApplicationUserAction_UserName")
            .CheckProperty(p => p.ActiveRoles, "ApplicationUserAction_ActiveRoles")
            .CheckProperty(p => p.ActivePermissions, "ApplicationUserAction_ActivePermissions")
            .CheckProperty(p => p.Action, "ApplicationUserAction_Action")
            .CheckProperty(p => p.Controller, "ApplicationUserAction_Controller")
            .CheckProperty(p => p.Date, now)
            .CheckProperty(p => p.ErrorMessage, "ApplicationUserAction_ErrorMessage")
            .CheckProperty(p => p.Success, true)
            .VerifyTheMappings();
        }

        /// <summary>
        ///A test for testing the filtering of an object from Db
        ///</summary>
        [Test]
        [Description("This tests the filtering of `ApplicationUserAction`")]
        [Order(1)]
        public void ApplicationUserAction_filtering_test()
        {
            DateTime now = DateTime.Now;
            // Get datetime without milliseconds
            now = new DateTime(now.Ticks - (now.Ticks % TimeSpan.TicksPerSecond), now.Kind);
            var repo = new Repository(Session);
            List<zAppDev.DotNet.Framework.Identity.Model.ApplicationUserAction> results = null;
            Assert.DoesNotThrow(() =>
            {
                results = repo.GetAsQueryable<zAppDev.DotNet.Framework.Identity.Model.ApplicationUserAction>(
                              a => true
                              && (a.UserName != string.Empty && a.UserName != null)
                              && (a.ActiveRoles != string.Empty && a.ActiveRoles != null)
                              && (a.ActivePermissions != string.Empty && a.ActivePermissions != null)
                              && (a.Action != string.Empty && a.Action != null)
                              && (a.Controller != string.Empty && a.Controller != null)
                              && a.Date.GetValueOrDefault().Date <= DateTime.UtcNow.Date
                              && (a.ErrorMessage != string.Empty && a.ErrorMessage != null)
                              && !a.Success
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