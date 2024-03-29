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
    ///This is a test class for ProfileSettingTest and is intended
    ///to contain all ProfileSettingTest NUnit Tests
    ///</summary>
    [TestFixture]
    [Description("ProfileSetting Repository Tests")]
    [Category("ProfileSetting Repository Tests")]
    internal class ProfileSettingTests : NHibernateFixture
    {
        /// <summary>
        ///A test for testing the persistence of an object from Db
        ///</summary>
        [Test]
        [Description("This tests the persistence of `ProfileSetting`")]
        [Order(0)]
        public void ProfileSetting_persistence_test()
        {
            DateTime now = DateTime.Now;
            // Get datetime without milliseconds
            now = new DateTime(now.Ticks - (now.Ticks % TimeSpan.TicksPerSecond), now.Kind);
            var _applicationsystembo_parentprofile_settings = new zAppDev.DotNet.Framework.Identity.Model.Profile
            {
                LanguageLCID = 618,
                LocaleLCID = 6452,
                TimezoneInfoID = "Profile_TimezoneInfoID",
                Theme = "Profile_Theme",
            };
            new PersistenceSpecification<zAppDev.DotNet.Framework.Identity.Model.ProfileSetting>(Session)
            .CheckProperty(p => p.Key, "ProfileSetting_Key")
            .CheckProperty(p => p.Value, "ProfileSetting_Value")
            .CheckReference(p => p.ParentProfile, _applicationsystembo_parentprofile_settings)
            .VerifyTheMappings();
        }

        /// <summary>
        ///A test for testing the filtering of an object from Db
        ///</summary>
        [Test]
        [Description("This tests the filtering of `ProfileSetting`")]
        [Order(1)]
        public void ProfileSetting_filtering_test()
        {
            DateTime now = DateTime.Now;
            // Get datetime without milliseconds
            now = new DateTime(now.Ticks - (now.Ticks % TimeSpan.TicksPerSecond), now.Kind);
            var repo = new Repository(Session);
            List<zAppDev.DotNet.Framework.Identity.Model.ProfileSetting> results = null;
            Assert.DoesNotThrow(() =>
            {
                results = repo.GetAsQueryable<zAppDev.DotNet.Framework.Identity.Model.ProfileSetting>(
                              a => true
                              && (a.Key != string.Empty && a.Key != null)
                              && (a.Value != string.Empty && a.Value != null)
                              && a.ParentProfile != null
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