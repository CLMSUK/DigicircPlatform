


GO
PRINT N'Dropping unnamed constraint on [dbo].[Actors]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'DF__tmp_ms_xx__Versi__395884C4' AND parent_object_id = object_id('[dbo].[Actors]')) ALTER TABLE [dbo].[Actors] DROP CONSTRAINT [DF__tmp_ms_xx__Versi__395884C4];


GO
PRINT N'Dropping unnamed constraint on [dbo].[CircularEconomyReports]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'DF__CircularE__Versi__0E6E26BF' AND parent_object_id = object_id('[dbo].[CircularEconomyReports]')) ALTER TABLE [dbo].[CircularEconomyReports] DROP CONSTRAINT [DF__CircularE__Versi__0E6E26BF];


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
PRINT N'Dropping [dbo].[FK_Actors_To_SectorTypes_On_SectorTypes]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'FK_Actors_To_SectorTypes_On_SectorTypes' AND parent_object_id = object_id('[dbo].[Actors_To_SectorTypes]')) ALTER TABLE [dbo].[Actors_To_SectorTypes] DROP CONSTRAINT [FK_Actors_To_SectorTypes_On_SectorTypes];


GO
PRINT N'Dropping [dbo].[FK_Actors_To_ContactInfos_On_ContactInfos]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'FK_Actors_To_ContactInfos_On_ContactInfos' AND parent_object_id = object_id('[dbo].[ContactInfos]')) ALTER TABLE [dbo].[ContactInfos] DROP CONSTRAINT [FK_Actors_To_ContactInfos_On_ContactInfos];


GO
PRINT N'Dropping [dbo].[FK_CircularEconomyReports_To_SectorTypes_On_DesiredSMESector]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'FK_CircularEconomyReports_To_SectorTypes_On_DesiredSMESector' AND parent_object_id = object_id('[dbo].[CircularEconomyReports]')) ALTER TABLE [dbo].[CircularEconomyReports] DROP CONSTRAINT [FK_CircularEconomyReports_To_SectorTypes_On_DesiredSMESector];


GO
PRINT N'Dropping [dbo].[FK_CircularEconomyReports_To_GeographicalAreas_On_DesiredGeographicalArea]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'FK_CircularEconomyReports_To_GeographicalAreas_On_DesiredGeographicalArea' AND parent_object_id = object_id('[dbo].[GeographicalAreas]')) ALTER TABLE [dbo].[GeographicalAreas] DROP CONSTRAINT [FK_CircularEconomyReports_To_GeographicalAreas_On_DesiredGeographicalArea];


GO
PRINT N'Dropping [dbo].[FK_CircularEconomyReports_To_ThematicExpertises_On_DesiredThematicExpertises]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'FK_CircularEconomyReports_To_ThematicExpertises_On_DesiredThematicExpertises' AND parent_object_id = object_id('[dbo].[ThematicExpertises_To_CircularEconomyReports]')) ALTER TABLE [dbo].[ThematicExpertises_To_CircularEconomyReports] DROP CONSTRAINT [FK_CircularEconomyReports_To_ThematicExpertises_On_DesiredThematicExpertises];


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
    [Address]                       INT              NULL,
    [AddedBy]                       NVARCHAR (255)   NULL,
    [CircularEconomyRequirements]   INT              NULL,
    [CircularEconomyProviderReport] INT              NULL,
    [ActorLogo]                     UNIQUEIDENTIFIER NULL,
    [EntityType]                    INT              NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

IF EXISTS (SELECT TOP 1 1 
           FROM   [dbo].[Actors])
    BEGIN
        INSERT INTO [dbo].[tmp_ms_xx_Actors] ([Id], [VersionTimestamp], [Name], [Description], [Url], [Email], [Address], [AddedBy], [CircularEconomyRequirements], [CircularEconomyProviderReport], [ActorLogo], [EntityType])
        SELECT   [Id],
                 [VersionTimestamp],
                 [Name],
                 [Description],
                 [Url],
                 [Email],
                 [Address],
                 [AddedBy],
                 [CircularEconomyRequirements],
                 [CircularEconomyProviderReport],
                 [ActorLogo],
                 [EntityType]
        FROM     [dbo].[Actors]
        ORDER BY [Id] ASC;
    END

DROP TABLE [dbo].[Actors];

EXECUTE sp_rename N'[dbo].[tmp_ms_xx_Actors]', N'Actors';

COMMIT TRANSACTION;

SET TRANSACTION ISOLATION LEVEL READ COMMITTED;


GO
PRINT N'Starting rebuilding table [dbo].[CircularEconomyReports]...';


GO
BEGIN TRANSACTION;

SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

SET XACT_ABORT ON;

CREATE TABLE [dbo].[tmp_ms_xx_CircularEconomyReports] (
    [Id]                                 INT            NOT NULL,
    [VersionTimestamp]                   INT            DEFAULT ((1)) NOT NULL,
    [ExperienceInCircularEconomy]        BIT            NULL,
    [SpecifyExperienceInCircularEconomy] NVARCHAR (250) NULL,
    [DigitalExpertise]                   INT            NULL,
    [DigitalProviredNeeded]              BIT            NULL,
    [ThematicExpertiseNeeded]            BIT            NULL,
    [DesiredSMESector]                   INT            NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

IF EXISTS (SELECT TOP 1 1 
           FROM   [dbo].[CircularEconomyReports])
    BEGIN
        INSERT INTO [dbo].[tmp_ms_xx_CircularEconomyReports] ([Id], [VersionTimestamp], [ExperienceInCircularEconomy], [DigitalExpertise], [DigitalProviredNeeded], [ThematicExpertiseNeeded], [DesiredSMESector])
        SELECT   [Id],
                 [VersionTimestamp],
                 [ExperienceInCircularEconomy],
                 [DigitalExpertise],
                 [DigitalProviredNeeded],
                 [ThematicExpertiseNeeded],
                 [DesiredSMESector]
        FROM     [dbo].[CircularEconomyReports]
        ORDER BY [Id] ASC;
    END

DROP TABLE [dbo].[CircularEconomyReports];

EXECUTE sp_rename N'[dbo].[tmp_ms_xx_CircularEconomyReports]', N'CircularEconomyReports';

COMMIT TRANSACTION;

SET TRANSACTION ISOLATION LEVEL READ COMMITTED;


GO
PRINT N'Creating [dbo].[FK_Actors_To_Addresses_On_Address]...';


GO
ALTER TABLE [dbo].[Actors] WITH NOCHECK
    ADD CONSTRAINT [FK_Actors_To_Addresses_On_Address] FOREIGN KEY ([Address]) REFERENCES [dbo].[Addresses] ([Id]);


GO
PRINT N'Creating [dbo].[FK_Actors_To_DigicircUsers_On_AddedBy]...';


GO
ALTER TABLE [dbo].[Actors] WITH NOCHECK
    ADD CONSTRAINT [FK_Actors_To_DigicircUsers_On_AddedBy] FOREIGN KEY ([AddedBy]) REFERENCES [dbo].[DigicircUsers] ([UserName]);


GO
PRINT N'Creating [dbo].[FK_Actors_To_EntityTypes_On_EntityType]...';


GO
ALTER TABLE [dbo].[Actors] WITH NOCHECK
    ADD CONSTRAINT [FK_Actors_To_EntityTypes_On_EntityType] FOREIGN KEY ([EntityType]) REFERENCES [dbo].[ValueTypes] ([Id]);


GO
PRINT N'Creating [dbo].[FK_Actors_To_CircularEconomyReports_On_CircularEconomyRequirements]...';


GO
ALTER TABLE [dbo].[Actors] WITH NOCHECK
    ADD CONSTRAINT [FK_Actors_To_CircularEconomyReports_On_CircularEconomyRequirements] FOREIGN KEY ([CircularEconomyRequirements]) REFERENCES [dbo].[CircularEconomyReports] ([Id]);


GO
PRINT N'Creating [dbo].[FK_Actors_To_CircularEconomyProviderReports_On_CircularEconomyProviderReport]...';


GO
ALTER TABLE [dbo].[Actors] WITH NOCHECK
    ADD CONSTRAINT [FK_Actors_To_CircularEconomyProviderReports_On_CircularEconomyProviderReport] FOREIGN KEY ([CircularEconomyProviderReport]) REFERENCES [dbo].[CircularEconomyProviderReports] ([Id]);


GO
PRINT N'Creating [dbo].[FK_Actors_To_FileDataTbl_On_ActorLogo]...';


GO
ALTER TABLE [dbo].[Actors] WITH NOCHECK
    ADD CONSTRAINT [FK_Actors_To_FileDataTbl_On_ActorLogo] FOREIGN KEY ([ActorLogo]) REFERENCES [security].[FileDataTbl] ([Id]);


GO
PRINT N'Creating [dbo].[FK_Actors_To_SectorTypes_On_SectorTypes]...';


GO
ALTER TABLE [dbo].[Actors_To_SectorTypes] WITH NOCHECK
    ADD CONSTRAINT [FK_Actors_To_SectorTypes_On_SectorTypes] FOREIGN KEY ([Actor]) REFERENCES [dbo].[Actors] ([Id]);


GO
PRINT N'Creating [dbo].[FK_Actors_To_ContactInfos_On_ContactInfos]...';


GO
ALTER TABLE [dbo].[ContactInfos] WITH NOCHECK
    ADD CONSTRAINT [FK_Actors_To_ContactInfos_On_ContactInfos] FOREIGN KEY ([Actor_ContactInfos]) REFERENCES [dbo].[Actors] ([Id]);


GO
PRINT N'Creating [dbo].[FK_CircularEconomyReports_To_SectorTypes_On_DesiredSMESector]...';


GO
ALTER TABLE [dbo].[CircularEconomyReports] WITH NOCHECK
    ADD CONSTRAINT [FK_CircularEconomyReports_To_SectorTypes_On_DesiredSMESector] FOREIGN KEY ([DesiredSMESector]) REFERENCES [dbo].[ValueTypes] ([Id]);


GO
PRINT N'Creating [dbo].[FK_CircularEconomyReports_To_GeographicalAreas_On_DesiredGeographicalArea]...';


GO
ALTER TABLE [dbo].[GeographicalAreas] WITH NOCHECK
    ADD CONSTRAINT [FK_CircularEconomyReports_To_GeographicalAreas_On_DesiredGeographicalArea] FOREIGN KEY ([CircularEconomyInformation_DesiredGeographicalArea]) REFERENCES [dbo].[CircularEconomyReports] ([Id]);


GO
PRINT N'Creating [dbo].[FK_CircularEconomyReports_To_ThematicExpertises_On_DesiredThematicExpertises]...';


GO
ALTER TABLE [dbo].[ThematicExpertises_To_CircularEconomyReports] WITH NOCHECK
    ADD CONSTRAINT [FK_CircularEconomyReports_To_ThematicExpertises_On_DesiredThematicExpertises] FOREIGN KEY ([CircularEconomyInformation_DesiredThematicExpertises]) REFERENCES [dbo].[CircularEconomyReports] ([Id]);


GO
PRINT N'Checking existing data against newly created constraints';


GO



GO
ALTER TABLE [dbo].[Actors] WITH CHECK CHECK CONSTRAINT [FK_Actors_To_Addresses_On_Address];

ALTER TABLE [dbo].[Actors] WITH CHECK CHECK CONSTRAINT [FK_Actors_To_DigicircUsers_On_AddedBy];

ALTER TABLE [dbo].[Actors] WITH CHECK CHECK CONSTRAINT [FK_Actors_To_EntityTypes_On_EntityType];

ALTER TABLE [dbo].[Actors] WITH CHECK CHECK CONSTRAINT [FK_Actors_To_CircularEconomyReports_On_CircularEconomyRequirements];

ALTER TABLE [dbo].[Actors] WITH CHECK CHECK CONSTRAINT [FK_Actors_To_CircularEconomyProviderReports_On_CircularEconomyProviderReport];

ALTER TABLE [dbo].[Actors] WITH CHECK CHECK CONSTRAINT [FK_Actors_To_FileDataTbl_On_ActorLogo];

ALTER TABLE [dbo].[Actors_To_SectorTypes] WITH CHECK CHECK CONSTRAINT [FK_Actors_To_SectorTypes_On_SectorTypes];

ALTER TABLE [dbo].[ContactInfos] WITH CHECK CHECK CONSTRAINT [FK_Actors_To_ContactInfos_On_ContactInfos];

ALTER TABLE [dbo].[CircularEconomyReports] WITH CHECK CHECK CONSTRAINT [FK_CircularEconomyReports_To_SectorTypes_On_DesiredSMESector];

ALTER TABLE [dbo].[GeographicalAreas] WITH CHECK CHECK CONSTRAINT [FK_CircularEconomyReports_To_GeographicalAreas_On_DesiredGeographicalArea];

ALTER TABLE [dbo].[ThematicExpertises_To_CircularEconomyReports] WITH CHECK CHECK CONSTRAINT [FK_CircularEconomyReports_To_ThematicExpertises_On_DesiredThematicExpertises];


GO
PRINT N'Update complete.';


GO
