// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.

using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using zAppDev.DotNet.Framework.Data.DAL;
using zAppDev.DotNet.Framework.Workflow;
using zAppDev.DotNet.Framework.Auditing;
using zAppDev.DotNet.Framework.Identity;
using zAppDev.DotNet.Framework.Identity.Model;

namespace DigicircMatchmaking.DAL
{
    public interface IRepository: ICreateRepository, IIdentityRepository, IAuditingRepository, IDeleteRepository, IRetrieveRepository, IUpdateRepository, IWorkflowRepository
    {
        void DeleteDigicircUser(DigicircMatchmaking.BO.DigicircUser digicircuser, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteActor(DigicircMatchmaking.BO.Actor actor, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteCircularEconomyReport(DigicircMatchmaking.BO.CircularEconomyReport circulareconomyreport, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteCircularEconomyProviderReport(DigicircMatchmaking.BO.CircularEconomyProviderReport circulareconomyproviderreport, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteAddress(DigicircMatchmaking.BO.Address address, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteCountry(DigicircMatchmaking.BO.Country country, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteGeographicalArea(DigicircMatchmaking.BO.GeographicalArea geographicalarea, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteBusinessFunction(DigicircMatchmaking.BO.BusinessFunction businessfunction, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteBusinessType(DigicircMatchmaking.BO.BusinessType businesstype, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteActivities(DigicircMatchmaking.BO.Activities activities, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteActorNames(DigicircMatchmaking.BO.ActorNames actornames, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteSectorType(DigicircMatchmaking.BO.SectorType sectortype, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteEntityType(DigicircMatchmaking.BO.EntityType entitytype, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteValueType(DigicircMatchmaking.BO.ValueType valuetype, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteThematicExpertise(DigicircMatchmaking.BO.ThematicExpertise thematicexpertise, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteServices(DigicircMatchmaking.BO.Services services, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteExpertise(DigicircMatchmaking.BO.Expertise expertise, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeletePhysicalForm(DigicircMatchmaking.BO.PhysicalForm physicalform, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteUnitOfMeasurement(DigicircMatchmaking.BO.UnitOfMeasurement unitofmeasurement, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteCompany(DigicircMatchmaking.BO.Company company, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteMaterial(DigicircMatchmaking.BO.Material material, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteProcess(DigicircMatchmaking.BO.Process process, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteProduct(DigicircMatchmaking.BO.Product product, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteProductType(DigicircMatchmaking.BO.ProductType producttype, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteSearchResponse(DigicircMatchmaking.BO.SearchResponse searchresponse, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteMatch(DigicircMatchmaking.BO.Match match, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteApplicationUserAction(zAppDev.DotNet.Framework.Identity.Model.ApplicationUserAction applicationuseraction, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteApplicationUserExternalProfile(zAppDev.DotNet.Framework.Identity.Model.ApplicationUserExternalProfile applicationuserexternalprofile, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteApplicationSetting(zAppDev.DotNet.Framework.Identity.Model.ApplicationSetting applicationsetting, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteApplicationUser(zAppDev.DotNet.Framework.Identity.Model.ApplicationUser applicationuser, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteApplicationRole(zAppDev.DotNet.Framework.Identity.Model.ApplicationRole applicationrole, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteApplicationOperation(zAppDev.DotNet.Framework.Identity.Model.ApplicationOperation applicationoperation, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteApplicationPermission(zAppDev.DotNet.Framework.Identity.Model.ApplicationPermission applicationpermission, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteApplicationClient(zAppDev.DotNet.Framework.Identity.Model.ApplicationClient applicationclient, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteApplicationUserLogin(zAppDev.DotNet.Framework.Identity.Model.ApplicationUserLogin applicationuserlogin, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteApplicationUserClaim(zAppDev.DotNet.Framework.Identity.Model.ApplicationUserClaim applicationuserclaim, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteProfileSetting(zAppDev.DotNet.Framework.Identity.Model.ProfileSetting profilesetting, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteProfile(zAppDev.DotNet.Framework.Identity.Model.Profile profile, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteApplicationLanguage(zAppDev.DotNet.Framework.Identity.Model.ApplicationLanguage applicationlanguage, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteDateTimeFormat(zAppDev.DotNet.Framework.Identity.Model.DateTimeFormat datetimeformat, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteApplicationTheme(zAppDev.DotNet.Framework.Identity.Model.ApplicationTheme applicationtheme, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteFileData(DigicircMatchmaking.BO.FileData filedata, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteAuditEntityConfiguration(zAppDev.DotNet.Framework.Auditing.Model.AuditEntityConfiguration auditentityconfiguration, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteAuditPropertyConfiguration(zAppDev.DotNet.Framework.Auditing.Model.AuditPropertyConfiguration auditpropertyconfiguration, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteAuditLogEntry(zAppDev.DotNet.Framework.Auditing.Model.AuditLogEntry auditlogentry, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteAuditLogEntryType(zAppDev.DotNet.Framework.Auditing.Model.AuditLogEntryType auditlogentrytype, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteAuditLogPropertyActionType(zAppDev.DotNet.Framework.Auditing.Model.AuditLogPropertyActionType auditlogpropertyactiontype, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteWorkflowContextBase(zAppDev.DotNet.Framework.Workflow.WorkflowContextBase workflowcontextbase, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteWorkflowSchedule(zAppDev.DotNet.Framework.Workflow.WorkflowSchedule workflowschedule, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteQueryGeocoderContext(DigicircMatchmaking.BO.QueryGeocoderContext querygeocodercontext, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        void DeleteSuggestionsFlowContext(DigicircMatchmaking.BO.SuggestionsFlowContext suggestionsflowcontext, bool doNotCallDeleteForThis = false, bool isCascaded = false, object calledBy = null);
        List<T> Get<T>(Expression<Func<T, bool>> predicate, bool cacheQuery = true);
        List<T> Get<T>(Expression<Func<T, bool>> predicate,
                       int startRowIndex,
                       int pageSize,
                       Dictionary<Expression<Func<T, object>>, bool> orderBy,
                       out int totalRecords, bool cacheQuery = true);

        List<T> GetAll<T>(bool cacheQuery = true);
        List<T> GetAll<T>(int startRowIndex, int pageSize, out int totalRecords, bool cacheQuery = true);
    }
}