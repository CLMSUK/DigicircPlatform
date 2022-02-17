


GO
PRINT N'Dropping unnamed constraint on [dbo].[Actors]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'DF__tmp_ms_xx__Versi__56E8E7AB' AND parent_object_id = object_id('[dbo].[Actors]')) ALTER TABLE [dbo].[Actors] DROP CONSTRAINT [DF__tmp_ms_xx__Versi__56E8E7AB];


GO
PRINT N'Dropping unnamed constraint on [dbo].[Addresses]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'DF__Addresses__Versi__0A9D95DB' AND parent_object_id = object_id('[dbo].[Addresses]')) ALTER TABLE [dbo].[Addresses] DROP CONSTRAINT [DF__Addresses__Versi__0A9D95DB];


GO
PRINT N'Dropping unnamed constraint on [security].[ApplicationUsers]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'DF__Applicati__Versi__01142BA1' AND parent_object_id = object_id('[security].[ApplicationUsers]')) ALTER TABLE [security].[ApplicationUsers] DROP CONSTRAINT [DF__Applicati__Versi__01142BA1];


GO
PRINT N'Dropping [dbo].[FK_Actors_To_Addresses_On_Address]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'FK_Actors_To_Addresses_On_Address' AND parent_object_id = object_id('[dbo].[Actors]')) ALTER TABLE [dbo].[Actors] DROP CONSTRAINT [FK_Actors_To_Addresses_On_Address];


GO
PRINT N'Dropping [dbo].[FK_Actors_To_DigicircUsers_On_AddedBy]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'FK_Actors_To_DigicircUsers_On_AddedBy' AND parent_object_id = object_id('[dbo].[Actors]')) ALTER TABLE [dbo].[Actors] DROP CONSTRAINT [FK_Actors_To_DigicircUsers_On_AddedBy];


GO
PRINT N'Dropping [dbo].[FK_Actors_To_EntityTypes_On_EntityType]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'FK_Actors_To_EntityTypes_On_EntityType' AND parent_object_id = object_id('[dbo].[Actors]')) ALTER TABLE [dbo].[Actors] DROP CONSTRAINT [FK_Actors_To_EntityTypes_On_EntityType];


GO
PRINT N'Dropping [dbo].[FK_Actors_To_CircularEconomyReports_On_CircularEconomyRequirements]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'FK_Actors_To_CircularEconomyReports_On_CircularEconomyRequirements' AND parent_object_id = object_id('[dbo].[Actors]')) ALTER TABLE [dbo].[Actors] DROP CONSTRAINT [FK_Actors_To_CircularEconomyReports_On_CircularEconomyRequirements];


GO
PRINT N'Dropping [dbo].[FK_Actors_To_CircularEconomyProviderReports_On_CircularEconomyProviderReport]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'FK_Actors_To_CircularEconomyProviderReports_On_CircularEconomyProviderReport' AND parent_object_id = object_id('[dbo].[Actors]')) ALTER TABLE [dbo].[Actors] DROP CONSTRAINT [FK_Actors_To_CircularEconomyProviderReports_On_CircularEconomyProviderReport];


GO
PRINT N'Dropping [dbo].[FK_Actors_To_FileDataTbl_On_ActorLogo]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'FK_Actors_To_FileDataTbl_On_ActorLogo' AND parent_object_id = object_id('[dbo].[Actors]')) ALTER TABLE [dbo].[Actors] DROP CONSTRAINT [FK_Actors_To_FileDataTbl_On_ActorLogo];


GO
PRINT N'Dropping [dbo].[FK_Actors_To_Actors_On_Actors]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'FK_Actors_To_Actors_On_Actors' AND parent_object_id = object_id('[dbo].[Actors]')) ALTER TABLE [dbo].[Actors] DROP CONSTRAINT [FK_Actors_To_Actors_On_Actors];


GO
PRINT N'Dropping [dbo].[FK_Actors_To_SectorTypes_On_SectorTypes]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'FK_Actors_To_SectorTypes_On_SectorTypes' AND parent_object_id = object_id('[dbo].[Actors_To_SectorTypes]')) ALTER TABLE [dbo].[Actors_To_SectorTypes] DROP CONSTRAINT [FK_Actors_To_SectorTypes_On_SectorTypes];


GO
PRINT N'Dropping [dbo].[FK_Actors_To_ContactInfos_On_ContactInfos]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'FK_Actors_To_ContactInfos_On_ContactInfos' AND parent_object_id = object_id('[dbo].[ContactInfos]')) ALTER TABLE [dbo].[ContactInfos] DROP CONSTRAINT [FK_Actors_To_ContactInfos_On_ContactInfos];


GO
PRINT N'Dropping [dbo].[FK_Actors_To_DigicircUsers_On_Administrators]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'FK_Actors_To_DigicircUsers_On_Administrators' AND parent_object_id = object_id('[dbo].[DigicircUsers_To_Actors]')) ALTER TABLE [dbo].[DigicircUsers_To_Actors] DROP CONSTRAINT [FK_Actors_To_DigicircUsers_On_Administrators];


GO
PRINT N'Dropping [dbo].[FK_Addresses_To_Countries_On_Country]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'FK_Addresses_To_Countries_On_Country' AND parent_object_id = object_id('[dbo].[Addresses]')) ALTER TABLE [dbo].[Addresses] DROP CONSTRAINT [FK_Addresses_To_Countries_On_Country];


GO
PRINT N'Dropping [dbo].[FK_SectorTypes_To_Actors_On_Actor]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'FK_SectorTypes_To_Actors_On_Actor' AND parent_object_id = object_id('[dbo].[Actors_To_SectorTypes]')) ALTER TABLE [dbo].[Actors_To_SectorTypes] DROP CONSTRAINT [FK_SectorTypes_To_Actors_On_Actor];


GO
PRINT N'Dropping [dbo].[FK_CircularEconomyReports_To_SectorTypes_On_DesiredSMESector]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'FK_CircularEconomyReports_To_SectorTypes_On_DesiredSMESector' AND parent_object_id = object_id('[dbo].[CircularEconomyReports]')) ALTER TABLE [dbo].[CircularEconomyReports] DROP CONSTRAINT [FK_CircularEconomyReports_To_SectorTypes_On_DesiredSMESector];


GO
PRINT N'Dropping [dbo].[FK_CircularEconomyProviderReports_To_GeographicalAreas_On_PlaceOperates]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'FK_CircularEconomyProviderReports_To_GeographicalAreas_On_PlaceOperates' AND parent_object_id = object_id('[dbo].[GeographicalAreas]')) ALTER TABLE [dbo].[GeographicalAreas] DROP CONSTRAINT [FK_CircularEconomyProviderReports_To_GeographicalAreas_On_PlaceOperates];


GO
PRINT N'Dropping [dbo].[FK_CircularEconomyReports_To_GeographicalAreas_On_DesiredGeographicalArea]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'FK_CircularEconomyReports_To_GeographicalAreas_On_DesiredGeographicalArea' AND parent_object_id = object_id('[dbo].[GeographicalAreas]')) ALTER TABLE [dbo].[GeographicalAreas] DROP CONSTRAINT [FK_CircularEconomyReports_To_GeographicalAreas_On_DesiredGeographicalArea];


GO
PRINT N'Dropping [dbo].[FK_CircularEconomyReports_To_ThematicExpertises_On_DesiredThematicExpertises]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'FK_CircularEconomyReports_To_ThematicExpertises_On_DesiredThematicExpertises' AND parent_object_id = object_id('[dbo].[ThematicExpertises_To_CircularEconomyReports]')) ALTER TABLE [dbo].[ThematicExpertises_To_CircularEconomyReports] DROP CONSTRAINT [FK_CircularEconomyReports_To_ThematicExpertises_On_DesiredThematicExpertises];


GO
PRINT N'Dropping [dbo].[FK_CircularEconomyProviderReports_To_Expertises_On_Expertises]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'FK_CircularEconomyProviderReports_To_Expertises_On_Expertises' AND parent_object_id = object_id('[dbo].[ValueTypes]')) ALTER TABLE [dbo].[ValueTypes] DROP CONSTRAINT [FK_CircularEconomyProviderReports_To_Expertises_On_Expertises];


GO
PRINT N'Dropping [dbo].[FK_CircularEconomyProviderReports_To_ServicesTbl_On_ServicesProvided]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'FK_CircularEconomyProviderReports_To_ServicesTbl_On_ServicesProvided' AND parent_object_id = object_id('[dbo].[ValueTypes]')) ALTER TABLE [dbo].[ValueTypes] DROP CONSTRAINT [FK_CircularEconomyProviderReports_To_ServicesTbl_On_ServicesProvided];


GO
PRINT N'Dropping [dbo].[FK_CircularEconomyProviderReports_To_ThematicExpertises_On_ThematicExpertises]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'FK_CircularEconomyProviderReports_To_ThematicExpertises_On_ThematicExpertises' AND parent_object_id = object_id('[dbo].[ValueTypes]')) ALTER TABLE [dbo].[ValueTypes] DROP CONSTRAINT [FK_CircularEconomyProviderReports_To_ThematicExpertises_On_ThematicExpertises];


GO
PRINT N'Starting rebuilding table [dbo].[Actors]...';


GO
BEGIN TRANSACTION;

SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

SET XACT_ABORT ON;

CREATE TABLE [dbo].[tmp_ms_xx_Actors] (
    [Id]                            INT              NOT NULL,
    [VersionTimestamp]              INT              DEFAULT ((1)) NOT NULL,
    [Name]                          NVARCHAR (255)   NULL,
    [Description]                   NVARCHAR (MAX)   NULL,
    [Url]                           NVARCHAR (MAX)   NULL,
    [Email]                         NVARCHAR (MAX)   NULL,
    [SpecifiedEnityType]            NVARCHAR (250)   NULL,
    [MemberOfCluster]               BIT              NULL,
    [ClusterName]                   NVARCHAR (100)   NULL,
    [Keywords]                      NVARCHAR (MAX)   NULL,
    [HasSites]                      BIT              NULL,
    [Address]                       INT              NULL,
    [AddedBy]                       NVARCHAR (255)   NULL,
    [CircularEconomyRequirements]   INT              NULL,
    [CircularEconomyProviderReport] INT              NULL,
    [ActorLogo]                     UNIQUEIDENTIFIER NULL,
    [Cluster]                       INT              NULL,
    [EntityType]                    INT              NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

IF EXISTS (SELECT TOP 1 1 
           FROM   [dbo].[Actors])
    BEGIN
        INSERT INTO [dbo].[tmp_ms_xx_Actors] ([Id], [VersionTimestamp], [Name], [Description], [Url], [Email], [SpecifiedEnityType], [MemberOfCluster], [ClusterName], [Address], [AddedBy], [CircularEconomyRequirements], [CircularEconomyProviderReport], [ActorLogo], [Cluster], [EntityType])
        SELECT   [Id],
                 [VersionTimestamp],
                 [Name],
                 [Description],
                 [Url],
                 [Email],
                 [SpecifiedEnityType],
                 [MemberOfCluster],
                 [ClusterName],
                 [Address],
                 [AddedBy],
                 [CircularEconomyRequirements],
                 [CircularEconomyProviderReport],
                 [ActorLogo],
                 [Cluster],
                 [EntityType]
        FROM     [dbo].[Actors]
        ORDER BY [Id] ASC;
    END

DROP TABLE [dbo].[Actors];

EXECUTE sp_rename N'[dbo].[tmp_ms_xx_Actors]', N'Actors';

COMMIT TRANSACTION;

SET TRANSACTION ISOLATION LEVEL READ COMMITTED;


GO
PRINT N'Starting rebuilding table [dbo].[Addresses]...';


GO
BEGIN TRANSACTION;

SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

SET XACT_ABORT ON;

CREATE TABLE [dbo].[tmp_ms_xx_Addresses] (
    [Id]               INT            NOT NULL,
    [VersionTimestamp] INT            DEFAULT ((1)) NOT NULL,
    [Latitude]         FLOAT (53)     NULL,
    [Longitude]        FLOAT (53)     NULL,
    [StreetName]       NVARCHAR (100) NULL,
    [Number]           INT            NULL,
    [Town]             NVARCHAR (100) NULL,
    [Zip]              NVARCHAR (100) NULL,
    [Alias]            NVARCHAR (500) NULL,
    [Country]          INT            NULL,
    [Actor_Sites]      INT            NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

IF EXISTS (SELECT TOP 1 1 
           FROM   [dbo].[Addresses])
    BEGIN
        INSERT INTO [dbo].[tmp_ms_xx_Addresses] ([Id], [VersionTimestamp], [Latitude], [Longitude], [StreetName], [Number], [Town], [Zip], [Country])
        SELECT   [Id],
                 [VersionTimestamp],
                 [Latitude],
                 [Longitude],
                 [StreetName],
                 [Number],
                 [Town],
                 [Zip],
                 [Country]
        FROM     [dbo].[Addresses]
        ORDER BY [Id] ASC;
    END

DROP TABLE [dbo].[Addresses];

EXECUTE sp_rename N'[dbo].[tmp_ms_xx_Addresses]', N'Addresses';

COMMIT TRANSACTION;

SET TRANSACTION ISOLATION LEVEL READ COMMITTED;


GO
PRINT N'Altering [security].[ApplicationUsers]...';


GO
ALTER TABLE [security].[ApplicationUsers] ALTER COLUMN [VersionTimestamp] INT NULL;


GO
PRINT N'Creating [dbo].[Materials]...';


GO
CREATE TABLE [dbo].[Materials] (
    [Id]               INT            NOT NULL,
    [VersionTimestamp] INT            NOT NULL,
    [Name]             NVARCHAR (MAX) NULL,
    [Description]      NVARCHAR (MAX) NULL,
    [HsSpecific]       NVARCHAR (MAX) NULL,
    [PendingGraph]     BIT            NULL,
    [RequestedBy]      NVARCHAR (255) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [dbo].[Processes]...';


GO
CREATE TABLE [dbo].[Processes] (
    [Id]               INT            NOT NULL,
    [VersionTimestamp] INT            NOT NULL,
    [Name]             NVARCHAR (MAX) NULL,
    [Notes]            NVARCHAR (MAX) NULL,
    [Ref]              NVARCHAR (MAX) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [dbo].[Processes_To_Materials]...';


GO
CREATE TABLE [dbo].[Processes_To_Materials] (
    [Product]     INT NOT NULL,
    [ConvertedBy] INT NOT NULL
);


GO
PRINT N'Creating [dbo].[Processes_To_Materials_1]...';


GO
CREATE TABLE [dbo].[Processes_To_Materials_1] (
    [Source]    INT NOT NULL,
    [ConvertBy] INT NOT NULL
);


GO
PRINT N'Creating [dbo].[Products]...';


GO
CREATE TABLE [dbo].[Products] (
    [Id]                                       INT      NOT NULL,
    [VersionTimestamp]                         INT      NOT NULL,
    [Quantity]                                 INT      NULL,
    [ValidFrom]                                DATETIME NULL,
    [ValidTo]                                  DATETIME NULL,
    [IsHazardous]                              BIT      NULL,
    [IsDesired]                                BIT      NULL,
    [Resource]                                 INT      NULL,
    [Type]                                     INT      NULL,
    [Site]                                     INT      NULL,
    [UnitOfMeasurement]                        INT      NULL,
    [PhysicalForm]                             INT      NULL,
    [CircularEconomyReport_Resources]          INT      NULL,
    [CircularEconomyReport_1_DesiredResources] INT      NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [dbo].[ProductTypes]...';


GO
CREATE TABLE [dbo].[ProductTypes] (
    [Id]                   INT            NOT NULL,
    [VersionTimestamp]     INT            NOT NULL,
    [Name]                 NVARCHAR (100) NULL,
    [ProductType_SybTypes] INT            NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [dbo].[SearchResponses]...';


GO
CREATE TABLE [dbo].[SearchResponses] (
    [Id]               INT NOT NULL,
    [VersionTimestamp] INT NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating unnamed constraint on [security].[ApplicationUsers]...';


GO
ALTER TABLE [security].[ApplicationUsers]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Creating unnamed constraint on [dbo].[Materials]...';


GO
ALTER TABLE [dbo].[Materials]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Creating unnamed constraint on [dbo].[Processes]...';


GO
ALTER TABLE [dbo].[Processes]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Creating unnamed constraint on [dbo].[Products]...';


GO
ALTER TABLE [dbo].[Products]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Creating unnamed constraint on [dbo].[ProductTypes]...';


GO
ALTER TABLE [dbo].[ProductTypes]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Creating unnamed constraint on [dbo].[SearchResponses]...';


GO
ALTER TABLE [dbo].[SearchResponses]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Creating [dbo].[FK_Actors_DigicircUsers_AddedBy]...';


GO
ALTER TABLE [dbo].[Actors] WITH NOCHECK
    ADD CONSTRAINT [FK_Actors_DigicircUsers_AddedBy] FOREIGN KEY ([AddedBy]) REFERENCES [dbo].[DigicircUsers] ([UserName]);


GO
PRINT N'Creating [dbo].[FK_Actors_CircularEconomyReports_CircularEconomyRequirements]...';


GO
ALTER TABLE [dbo].[Actors] WITH NOCHECK
    ADD CONSTRAINT [FK_Actors_CircularEconomyReports_CircularEconomyRequirements] FOREIGN KEY ([CircularEconomyRequirements]) REFERENCES [dbo].[CircularEconomyReports] ([Id]);


GO
PRINT N'Creating [dbo].[FK_Actors_CircularEconomyProv_CircularEconomyProv]...';


GO
ALTER TABLE [dbo].[Actors] WITH NOCHECK
    ADD CONSTRAINT [FK_Actors_CircularEconomyProv_CircularEconomyProv] FOREIGN KEY ([CircularEconomyProviderReport]) REFERENCES [dbo].[CircularEconomyProviderReports] ([Id]);


GO
PRINT N'Creating [dbo].[FK_Actors_FileDataTbl_ActorLogo]...';


GO
ALTER TABLE [dbo].[Actors] WITH NOCHECK
    ADD CONSTRAINT [FK_Actors_FileDataTbl_ActorLogo] FOREIGN KEY ([ActorLogo]) REFERENCES [security].[FileDataTbl] ([Id]);


GO
PRINT N'Creating [dbo].[FK_Actors_Actors_Actors]...';


GO
ALTER TABLE [dbo].[Actors] WITH NOCHECK
    ADD CONSTRAINT [FK_Actors_Actors_Actors] FOREIGN KEY ([Cluster]) REFERENCES [dbo].[Actors] ([Id]);


GO
PRINT N'Creating [dbo].[FK_Actors_EntityTypes_EntityType]...';


GO
ALTER TABLE [dbo].[Actors] WITH NOCHECK
    ADD CONSTRAINT [FK_Actors_EntityTypes_EntityType] FOREIGN KEY ([EntityType]) REFERENCES [dbo].[ValueTypes] ([Id]);


GO
PRINT N'Creating [dbo].[FK_Actors_Addresses_Address]...';


GO
ALTER TABLE [dbo].[Actors] WITH NOCHECK
    ADD CONSTRAINT [FK_Actors_Addresses_Address] FOREIGN KEY ([Address]) REFERENCES [dbo].[Addresses] ([Id]);


GO
PRINT N'Creating [dbo].[FK_Addresses_Countries_Country]...';


GO
ALTER TABLE [dbo].[Addresses] WITH NOCHECK
    ADD CONSTRAINT [FK_Addresses_Countries_Country] FOREIGN KEY ([Country]) REFERENCES [dbo].[Countries] ([Id]);


GO
PRINT N'Creating [dbo].[FK_Actors_Addresses_Sites]...';


GO
ALTER TABLE [dbo].[Addresses] WITH NOCHECK
    ADD CONSTRAINT [FK_Actors_Addresses_Sites] FOREIGN KEY ([Actor_Sites]) REFERENCES [dbo].[Actors] ([Id]);


GO
PRINT N'Creating [dbo].[FK_Materials_DigicircUsers_RequestedBy]...';


GO
ALTER TABLE [dbo].[Materials] WITH NOCHECK
    ADD CONSTRAINT [FK_Materials_DigicircUsers_RequestedBy] FOREIGN KEY ([RequestedBy]) REFERENCES [dbo].[DigicircUsers] ([UserName]);


GO
PRINT N'Creating [dbo].[FK_Processes_Materials_Product]...';


GO
ALTER TABLE [dbo].[Processes_To_Materials] WITH NOCHECK
    ADD CONSTRAINT [FK_Processes_Materials_Product] FOREIGN KEY ([ConvertedBy]) REFERENCES [dbo].[Processes] ([Id]);


GO
PRINT N'Creating [dbo].[FK_Materials_Processes_ConvertedBy]...';


GO
ALTER TABLE [dbo].[Processes_To_Materials] WITH NOCHECK
    ADD CONSTRAINT [FK_Materials_Processes_ConvertedBy] FOREIGN KEY ([Product]) REFERENCES [dbo].[Materials] ([Id]);


GO
PRINT N'Creating [dbo].[FK_Processes_Materials_Source]...';


GO
ALTER TABLE [dbo].[Processes_To_Materials_1] WITH NOCHECK
    ADD CONSTRAINT [FK_Processes_Materials_Source] FOREIGN KEY ([ConvertBy]) REFERENCES [dbo].[Processes] ([Id]);


GO
PRINT N'Creating [dbo].[FK_Materials_Processes_ConvertBy]...';


GO
ALTER TABLE [dbo].[Processes_To_Materials_1] WITH NOCHECK
    ADD CONSTRAINT [FK_Materials_Processes_ConvertBy] FOREIGN KEY ([Source]) REFERENCES [dbo].[Materials] ([Id]);


GO
PRINT N'Creating [dbo].[FK_Products_Materials_Resource]...';


GO
ALTER TABLE [dbo].[Products] WITH NOCHECK
    ADD CONSTRAINT [FK_Products_Materials_Resource] FOREIGN KEY ([Resource]) REFERENCES [dbo].[Materials] ([Id]);


GO
PRINT N'Creating [dbo].[FK_Products_ProductTypes_Type]...';


GO
ALTER TABLE [dbo].[Products] WITH NOCHECK
    ADD CONSTRAINT [FK_Products_ProductTypes_Type] FOREIGN KEY ([Type]) REFERENCES [dbo].[ProductTypes] ([Id]);


GO
PRINT N'Creating [dbo].[FK_Products_UnitOfMeasurements_UnitOfMeasurement]...';


GO
ALTER TABLE [dbo].[Products] WITH NOCHECK
    ADD CONSTRAINT [FK_Products_UnitOfMeasurements_UnitOfMeasurement] FOREIGN KEY ([UnitOfMeasurement]) REFERENCES [dbo].[ValueTypes] ([Id]);


GO
PRINT N'Creating [dbo].[FK_Products_PhysicalForms_PhysicalForm]...';


GO
ALTER TABLE [dbo].[Products] WITH NOCHECK
    ADD CONSTRAINT [FK_Products_PhysicalForms_PhysicalForm] FOREIGN KEY ([PhysicalForm]) REFERENCES [dbo].[ValueTypes] ([Id]);


GO
PRINT N'Creating [dbo].[FK_CircularEconomyReports_Products_Resources]...';


GO
ALTER TABLE [dbo].[Products] WITH NOCHECK
    ADD CONSTRAINT [FK_CircularEconomyReports_Products_Resources] FOREIGN KEY ([CircularEconomyReport_Resources]) REFERENCES [dbo].[CircularEconomyReports] ([Id]);


GO
PRINT N'Creating [dbo].[FK_CircularEconomyReports_Products_DesiredResources]...';


GO
ALTER TABLE [dbo].[Products] WITH NOCHECK
    ADD CONSTRAINT [FK_CircularEconomyReports_Products_DesiredResources] FOREIGN KEY ([CircularEconomyReport_1_DesiredResources]) REFERENCES [dbo].[CircularEconomyReports] ([Id]);


GO
PRINT N'Creating [dbo].[FK_Products_Addresses_Site]...';


GO
ALTER TABLE [dbo].[Products] WITH NOCHECK
    ADD CONSTRAINT [FK_Products_Addresses_Site] FOREIGN KEY ([Site]) REFERENCES [dbo].[Addresses] ([Id]);


GO
PRINT N'Creating [dbo].[FK_ProductTypes_ProductTypes_SybTypes]...';


GO
ALTER TABLE [dbo].[ProductTypes] WITH NOCHECK
    ADD CONSTRAINT [FK_ProductTypes_ProductTypes_SybTypes] FOREIGN KEY ([ProductType_SybTypes]) REFERENCES [dbo].[ProductTypes] ([Id]);


GO
PRINT N'Creating [dbo].[FK_Actors_SectorTypes_SectorTypes]...';


GO
ALTER TABLE [dbo].[Actors_To_SectorTypes] WITH NOCHECK
    ADD CONSTRAINT [FK_Actors_SectorTypes_SectorTypes] FOREIGN KEY ([Actor]) REFERENCES [dbo].[Actors] ([Id]);


GO
PRINT N'Creating [dbo].[FK_SectorTypes_Actors_Actor]...';


GO
ALTER TABLE [dbo].[Actors_To_SectorTypes] WITH NOCHECK
    ADD CONSTRAINT [FK_SectorTypes_Actors_Actor] FOREIGN KEY ([SectorTypes]) REFERENCES [dbo].[ValueTypes] ([Id]);


GO
PRINT N'Creating [dbo].[FK_CircularEconomyReports_SectorTypes_DesiredSMESector]...';


GO
ALTER TABLE [dbo].[CircularEconomyReports] WITH NOCHECK
    ADD CONSTRAINT [FK_CircularEconomyReports_SectorTypes_DesiredSMESector] FOREIGN KEY ([DesiredSMESector]) REFERENCES [dbo].[ValueTypes] ([Id]);


GO
PRINT N'Creating [dbo].[FK_Actors_DigicircUsers_Administrators]...';


GO
ALTER TABLE [dbo].[DigicircUsers_To_Actors] WITH NOCHECK
    ADD CONSTRAINT [FK_Actors_DigicircUsers_Administrators] FOREIGN KEY ([ActorsCanManage_Administrators]) REFERENCES [dbo].[Actors] ([Id]);


GO
PRINT N'Creating [dbo].[FK_CircularEconomyProviderReportsGeographicalAreasPlaceOperates]...';


GO
ALTER TABLE [dbo].[GeographicalAreas] WITH NOCHECK
    ADD CONSTRAINT [FK_CircularEconomyProviderReportsGeographicalAreasPlaceOperates] FOREIGN KEY ([CircularEconomyProviderReport_PlaceOperates]) REFERENCES [dbo].[CircularEconomyProviderReports] ([Id]);


GO
PRINT N'Creating [dbo].[FK_CircularEconomyRepo_GeographicalAreas_DesiredGeographical]...';


GO
ALTER TABLE [dbo].[GeographicalAreas] WITH NOCHECK
    ADD CONSTRAINT [FK_CircularEconomyRepo_GeographicalAreas_DesiredGeographical] FOREIGN KEY ([CircularEconomyInformation_DesiredGeographicalArea]) REFERENCES [dbo].[CircularEconomyReports] ([Id]);


GO
PRINT N'Creating [dbo].[FK_CircularEconomyRepo_ThematicExpertises_DesiredThematicExpe]...';


GO
ALTER TABLE [dbo].[ThematicExpertises_To_CircularEconomyReports] WITH NOCHECK
    ADD CONSTRAINT [FK_CircularEconomyRepo_ThematicExpertises_DesiredThematicExpe] FOREIGN KEY ([CircularEconomyInformation_DesiredThematicExpertises]) REFERENCES [dbo].[CircularEconomyReports] ([Id]);


GO
PRINT N'Creating [dbo].[FK_CircularEconomyProv_ThematicExpertises_ThematicExpertises]...';


GO
ALTER TABLE [dbo].[ValueTypes] WITH NOCHECK
    ADD CONSTRAINT [FK_CircularEconomyProv_ThematicExpertises_ThematicExpertises] FOREIGN KEY ([CircularEconomyProviderReport_ThematicExpertises]) REFERENCES [dbo].[CircularEconomyProviderReports] ([Id]);


GO
PRINT N'Creating [dbo].[FK_CircularEconomyProviderReports_Expertises_Expertises]...';


GO
ALTER TABLE [dbo].[ValueTypes] WITH NOCHECK
    ADD CONSTRAINT [FK_CircularEconomyProviderReports_Expertises_Expertises] FOREIGN KEY ([CircularEconomyProviderReport_Expertises]) REFERENCES [dbo].[CircularEconomyProviderReports] ([Id]);


GO
PRINT N'Creating [dbo].[FK_CircularEconomyProviderReports_ServicesTbl_ServicesProvided]...';


GO
ALTER TABLE [dbo].[ValueTypes] WITH NOCHECK
    ADD CONSTRAINT [FK_CircularEconomyProviderReports_ServicesTbl_ServicesProvided] FOREIGN KEY ([CircularEconomyProviderReport_ServicesProvided]) REFERENCES [dbo].[CircularEconomyProviderReports] ([Id]);


GO
PRINT N'Checking existing data against newly created constraints';


GO



GO
ALTER TABLE [dbo].[Actors] WITH CHECK CHECK CONSTRAINT [FK_Actors_DigicircUsers_AddedBy];

ALTER TABLE [dbo].[Actors] WITH CHECK CHECK CONSTRAINT [FK_Actors_CircularEconomyReports_CircularEconomyRequirements];

ALTER TABLE [dbo].[Actors] WITH CHECK CHECK CONSTRAINT [FK_Actors_CircularEconomyProv_CircularEconomyProv];

ALTER TABLE [dbo].[Actors] WITH CHECK CHECK CONSTRAINT [FK_Actors_FileDataTbl_ActorLogo];

ALTER TABLE [dbo].[Actors] WITH CHECK CHECK CONSTRAINT [FK_Actors_Actors_Actors];

ALTER TABLE [dbo].[Actors] WITH CHECK CHECK CONSTRAINT [FK_Actors_EntityTypes_EntityType];

ALTER TABLE [dbo].[Actors] WITH CHECK CHECK CONSTRAINT [FK_Actors_Addresses_Address];

ALTER TABLE [dbo].[Addresses] WITH CHECK CHECK CONSTRAINT [FK_Addresses_Countries_Country];

ALTER TABLE [dbo].[Addresses] WITH CHECK CHECK CONSTRAINT [FK_Actors_Addresses_Sites];

ALTER TABLE [dbo].[Materials] WITH CHECK CHECK CONSTRAINT [FK_Materials_DigicircUsers_RequestedBy];

ALTER TABLE [dbo].[Processes_To_Materials] WITH CHECK CHECK CONSTRAINT [FK_Processes_Materials_Product];

ALTER TABLE [dbo].[Processes_To_Materials] WITH CHECK CHECK CONSTRAINT [FK_Materials_Processes_ConvertedBy];

ALTER TABLE [dbo].[Processes_To_Materials_1] WITH CHECK CHECK CONSTRAINT [FK_Processes_Materials_Source];

ALTER TABLE [dbo].[Processes_To_Materials_1] WITH CHECK CHECK CONSTRAINT [FK_Materials_Processes_ConvertBy];

ALTER TABLE [dbo].[Products] WITH CHECK CHECK CONSTRAINT [FK_Products_Materials_Resource];

ALTER TABLE [dbo].[Products] WITH CHECK CHECK CONSTRAINT [FK_Products_ProductTypes_Type];

ALTER TABLE [dbo].[Products] WITH CHECK CHECK CONSTRAINT [FK_Products_UnitOfMeasurements_UnitOfMeasurement];

ALTER TABLE [dbo].[Products] WITH CHECK CHECK CONSTRAINT [FK_Products_PhysicalForms_PhysicalForm];

ALTER TABLE [dbo].[Products] WITH CHECK CHECK CONSTRAINT [FK_CircularEconomyReports_Products_Resources];

ALTER TABLE [dbo].[Products] WITH CHECK CHECK CONSTRAINT [FK_CircularEconomyReports_Products_DesiredResources];

ALTER TABLE [dbo].[Products] WITH CHECK CHECK CONSTRAINT [FK_Products_Addresses_Site];

ALTER TABLE [dbo].[ProductTypes] WITH CHECK CHECK CONSTRAINT [FK_ProductTypes_ProductTypes_SybTypes];

ALTER TABLE [dbo].[Actors_To_SectorTypes] WITH CHECK CHECK CONSTRAINT [FK_Actors_SectorTypes_SectorTypes];

ALTER TABLE [dbo].[Actors_To_SectorTypes] WITH CHECK CHECK CONSTRAINT [FK_SectorTypes_Actors_Actor];

ALTER TABLE [dbo].[CircularEconomyReports] WITH CHECK CHECK CONSTRAINT [FK_CircularEconomyReports_SectorTypes_DesiredSMESector];

ALTER TABLE [dbo].[DigicircUsers_To_Actors] WITH CHECK CHECK CONSTRAINT [FK_Actors_DigicircUsers_Administrators];

ALTER TABLE [dbo].[GeographicalAreas] WITH CHECK CHECK CONSTRAINT [FK_CircularEconomyProviderReportsGeographicalAreasPlaceOperates];

ALTER TABLE [dbo].[GeographicalAreas] WITH CHECK CHECK CONSTRAINT [FK_CircularEconomyRepo_GeographicalAreas_DesiredGeographical];

ALTER TABLE [dbo].[ThematicExpertises_To_CircularEconomyReports] WITH CHECK CHECK CONSTRAINT [FK_CircularEconomyRepo_ThematicExpertises_DesiredThematicExpe];

ALTER TABLE [dbo].[ValueTypes] WITH CHECK CHECK CONSTRAINT [FK_CircularEconomyProv_ThematicExpertises_ThematicExpertises];

ALTER TABLE [dbo].[ValueTypes] WITH CHECK CHECK CONSTRAINT [FK_CircularEconomyProviderReports_Expertises_Expertises];

ALTER TABLE [dbo].[ValueTypes] WITH CHECK CHECK CONSTRAINT [FK_CircularEconomyProviderReports_ServicesTbl_ServicesProvided];


GO
PRINT N'Update complete.';


GO
