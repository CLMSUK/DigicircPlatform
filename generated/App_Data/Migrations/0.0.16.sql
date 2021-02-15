


GO
PRINT N'Dropping unnamed constraint on [dbo].[Actors]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'DF__tmp_ms_xx__Versi__46B27FE2' AND parent_object_id = object_id('[dbo].[Actors]')) ALTER TABLE [dbo].[Actors] DROP CONSTRAINT [DF__tmp_ms_xx__Versi__46B27FE2];


GO
PRINT N'Dropping unnamed constraint on [dbo].[ValueTypes]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'DF__ValueType__Versi__123EB7A3' AND parent_object_id = object_id('[dbo].[ValueTypes]')) ALTER TABLE [dbo].[ValueTypes] DROP CONSTRAINT [DF__ValueType__Versi__123EB7A3];


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
PRINT N'Dropping [dbo].[FK_SectorTypes_To_Actors_On_Actor]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'FK_SectorTypes_To_Actors_On_Actor' AND parent_object_id = object_id('[dbo].[Actors_To_SectorTypes]')) ALTER TABLE [dbo].[Actors_To_SectorTypes] DROP CONSTRAINT [FK_SectorTypes_To_Actors_On_Actor];


GO
PRINT N'Dropping [dbo].[FK_9FF6E37]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'FK_9FF6E37' AND parent_object_id = object_id('[dbo].[ThematicExpertises_To_CircularEconomyReports]')) ALTER TABLE [dbo].[ThematicExpertises_To_CircularEconomyReports] DROP CONSTRAINT [FK_9FF6E37];


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
        INSERT INTO [dbo].[tmp_ms_xx_Actors] ([Id], [VersionTimestamp], [Name], [Description], [Url], [Email], [SpecifiedEnityType], [Address], [AddedBy], [CircularEconomyRequirements], [CircularEconomyProviderReport], [ActorLogo], [EntityType])
        SELECT   [Id],
                 [VersionTimestamp],
                 [Name],
                 [Description],
                 [Url],
                 [Email],
                 [SpecifiedEnityType],
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
PRINT N'Starting rebuilding table [dbo].[ValueTypes]...';


GO
BEGIN TRANSACTION;

SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

SET XACT_ABORT ON;

CREATE TABLE [dbo].[tmp_ms_xx_ValueTypes] (
    [Id]                                               INT            NOT NULL,
    [VALUETYPE_TYPE]                                   NVARCHAR (255) NOT NULL,
    [VersionTimestamp]                                 INT            DEFAULT ((1)) NOT NULL,
    [Code]                                             NVARCHAR (255) NULL,
    [Value]                                            NVARCHAR (255) NULL,
    [IsProvider]                                       BIT            NULL,
    [IsCluster]                                        BIT            NULL,
    [CircularEconomyProviderReport_ThematicExpertises] INT            NULL,
    [CircularEconomyProviderReport_ServicesProvided]   INT            NULL,
    [CircularEconomyProviderReport_Expertises]         INT            NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

IF EXISTS (SELECT TOP 1 1 
           FROM   [dbo].[ValueTypes])
    BEGIN
        INSERT INTO [dbo].[tmp_ms_xx_ValueTypes] ([Id], [VALUETYPE_TYPE], [VersionTimestamp], [Code], [Value], [IsProvider], [CircularEconomyProviderReport_ThematicExpertises], [CircularEconomyProviderReport_ServicesProvided], [CircularEconomyProviderReport_Expertises])
        SELECT   [Id],
                 [VALUETYPE_TYPE],
                 [VersionTimestamp],
                 [Code],
                 [Value],
                 [IsProvider],
                 [CircularEconomyProviderReport_ThematicExpertises],
                 [CircularEconomyProviderReport_ServicesProvided],
                 [CircularEconomyProviderReport_Expertises]
        FROM     [dbo].[ValueTypes]
        ORDER BY [Id] ASC;
    END

DROP TABLE [dbo].[ValueTypes];

EXECUTE sp_rename N'[dbo].[tmp_ms_xx_ValueTypes]', N'ValueTypes';

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
PRINT N'Creating [dbo].[FK_Actors_To_Actors_On_Actors]...';


GO
ALTER TABLE [dbo].[Actors] WITH NOCHECK
    ADD CONSTRAINT [FK_Actors_To_Actors_On_Actors] FOREIGN KEY ([Cluster]) REFERENCES [dbo].[Actors] ([Id]);


GO
PRINT N'Creating [dbo].[FK_CircularEconomyReports_To_SectorTypes_On_DesiredSMESector]...';


GO
ALTER TABLE [dbo].[CircularEconomyReports] WITH NOCHECK
    ADD CONSTRAINT [FK_CircularEconomyReports_To_SectorTypes_On_DesiredSMESector] FOREIGN KEY ([DesiredSMESector]) REFERENCES [dbo].[ValueTypes] ([Id]);


GO
PRINT N'Creating [dbo].[FK_SectorTypes_To_Actors_On_Actor]...';


GO
ALTER TABLE [dbo].[Actors_To_SectorTypes] WITH NOCHECK
    ADD CONSTRAINT [FK_SectorTypes_To_Actors_On_Actor] FOREIGN KEY ([SectorTypes]) REFERENCES [dbo].[ValueTypes] ([Id]);


GO
PRINT N'Creating [dbo].[FK_9FF6E37]...';


GO
ALTER TABLE [dbo].[ThematicExpertises_To_CircularEconomyReports] WITH NOCHECK
    ADD CONSTRAINT [FK_9FF6E37] FOREIGN KEY ([DesiredThematicExpertises]) REFERENCES [dbo].[ValueTypes] ([Id]);


GO
PRINT N'Creating [dbo].[FK_CircularEconomyProviderReports_To_Expertises_On_Expertises]...';


GO
ALTER TABLE [dbo].[ValueTypes] WITH NOCHECK
    ADD CONSTRAINT [FK_CircularEconomyProviderReports_To_Expertises_On_Expertises] FOREIGN KEY ([CircularEconomyProviderReport_Expertises]) REFERENCES [dbo].[CircularEconomyProviderReports] ([Id]);


GO
PRINT N'Creating [dbo].[FK_CircularEconomyProviderReports_To_ServicesTbl_On_ServicesProvided]...';


GO
ALTER TABLE [dbo].[ValueTypes] WITH NOCHECK
    ADD CONSTRAINT [FK_CircularEconomyProviderReports_To_ServicesTbl_On_ServicesProvided] FOREIGN KEY ([CircularEconomyProviderReport_ServicesProvided]) REFERENCES [dbo].[CircularEconomyProviderReports] ([Id]);


GO
PRINT N'Creating [dbo].[FK_CircularEconomyProviderReports_To_ThematicExpertises_On_ThematicExpertises]...';


GO
ALTER TABLE [dbo].[ValueTypes] WITH NOCHECK
    ADD CONSTRAINT [FK_CircularEconomyProviderReports_To_ThematicExpertises_On_ThematicExpertises] FOREIGN KEY ([CircularEconomyProviderReport_ThematicExpertises]) REFERENCES [dbo].[CircularEconomyProviderReports] ([Id]);


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

ALTER TABLE [dbo].[Actors] WITH CHECK CHECK CONSTRAINT [FK_Actors_To_Actors_On_Actors];

ALTER TABLE [dbo].[CircularEconomyReports] WITH CHECK CHECK CONSTRAINT [FK_CircularEconomyReports_To_SectorTypes_On_DesiredSMESector];

ALTER TABLE [dbo].[Actors_To_SectorTypes] WITH CHECK CHECK CONSTRAINT [FK_SectorTypes_To_Actors_On_Actor];

ALTER TABLE [dbo].[ThematicExpertises_To_CircularEconomyReports] WITH CHECK CHECK CONSTRAINT [FK_9FF6E37];

ALTER TABLE [dbo].[ValueTypes] WITH CHECK CHECK CONSTRAINT [FK_CircularEconomyProviderReports_To_Expertises_On_Expertises];

ALTER TABLE [dbo].[ValueTypes] WITH CHECK CHECK CONSTRAINT [FK_CircularEconomyProviderReports_To_ServicesTbl_On_ServicesProvided];

ALTER TABLE [dbo].[ValueTypes] WITH CHECK CHECK CONSTRAINT [FK_CircularEconomyProviderReports_To_ThematicExpertises_On_ThematicExpertises];


GO
PRINT N'Update complete.';


GO
