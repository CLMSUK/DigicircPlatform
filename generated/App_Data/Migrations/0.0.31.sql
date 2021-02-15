


GO
/*
The column [dbo].[ProductTypes].[ProductType_SybTypes] is being dropped, data loss could occur.
*/

IF EXISTS (select top 1 1 from [dbo].[ProductTypes])
    RAISERROR (N'Rows were detected. The schema update is terminating because data loss might occur.', 16, 127) WITH NOWAIT

GO
PRINT N'Dropping unnamed constraint on [dbo].[Materials]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'DF__Materials__Versi__01D345B0' AND parent_object_id = object_id('[dbo].[Materials]')) ALTER TABLE [dbo].[Materials] DROP CONSTRAINT [DF__Materials__Versi__01D345B0];


GO
PRINT N'Dropping [dbo].[FK_Materials_DigicircUsers_RequestedBy]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'FK_Materials_DigicircUsers_RequestedBy' AND parent_object_id = object_id('[dbo].[Materials]')) ALTER TABLE [dbo].[Materials] DROP CONSTRAINT [FK_Materials_DigicircUsers_RequestedBy];


GO
PRINT N'Dropping [dbo].[FK_Materials_Processes_ConvertedBy]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'FK_Materials_Processes_ConvertedBy' AND parent_object_id = object_id('[dbo].[Processes_To_Materials]')) ALTER TABLE [dbo].[Processes_To_Materials] DROP CONSTRAINT [FK_Materials_Processes_ConvertedBy];


GO
PRINT N'Dropping [dbo].[FK_Materials_Processes_ConvertBy]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'FK_Materials_Processes_ConvertBy' AND parent_object_id = object_id('[dbo].[Processes_To_Materials_1]')) ALTER TABLE [dbo].[Processes_To_Materials_1] DROP CONSTRAINT [FK_Materials_Processes_ConvertBy];


GO
PRINT N'Dropping [dbo].[FK_Products_Materials_Resource]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'FK_Products_Materials_Resource' AND parent_object_id = object_id('[dbo].[Products]')) ALTER TABLE [dbo].[Products] DROP CONSTRAINT [FK_Products_Materials_Resource];


GO
PRINT N'Dropping [dbo].[FK_ProductTypes_ProductTypes_SybTypes]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'FK_ProductTypes_ProductTypes_SybTypes' AND parent_object_id = object_id('[dbo].[ProductTypes]')) ALTER TABLE [dbo].[ProductTypes] DROP CONSTRAINT [FK_ProductTypes_ProductTypes_SybTypes];


GO
PRINT N'Starting rebuilding table [dbo].[Materials]...';


GO
BEGIN TRANSACTION;

SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

SET XACT_ABORT ON;

CREATE TABLE [dbo].[tmp_ms_xx_Materials] (
    [Id]                INT            NOT NULL,
    [VersionTimestamp]  INT            DEFAULT ((1)) NOT NULL,
    [Name]              NVARCHAR (MAX) NULL,
    [Description]       NVARCHAR (MAX) NULL,
    [HsSpecific]        NVARCHAR (MAX) NULL,
    [PendingGraph]      BIT            NULL,
    [IsHazardous]       BIT            NULL,
    [RequestedBy]       NVARCHAR (255) NULL,
    [Type]              INT            NULL,
    [PhysicalForm]      INT            NULL,
    [UnitOfMeasurement] INT            NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

IF EXISTS (SELECT TOP 1 1 
           FROM   [dbo].[Materials])
    BEGIN
        INSERT INTO [dbo].[tmp_ms_xx_Materials] ([Id], [VersionTimestamp], [Name], [Description], [HsSpecific], [PendingGraph], [RequestedBy])
        SELECT   [Id],
                 [VersionTimestamp],
                 [Name],
                 [Description],
                 [HsSpecific],
                 [PendingGraph],
                 [RequestedBy]
        FROM     [dbo].[Materials]
        ORDER BY [Id] ASC;
    END

DROP TABLE [dbo].[Materials];

EXECUTE sp_rename N'[dbo].[tmp_ms_xx_Materials]', N'Materials';

COMMIT TRANSACTION;

SET TRANSACTION ISOLATION LEVEL READ COMMITTED;


GO
PRINT N'Altering [dbo].[ProductTypes]...';


GO
ALTER TABLE [dbo].[ProductTypes] DROP COLUMN [ProductType_SybTypes];


GO
PRINT N'Creating [dbo].[Matches]...';


GO
CREATE TABLE [dbo].[Matches] (
    [Id]               INT      NOT NULL,
    [VersionTimestamp] INT      NOT NULL,
    [ValidFrom]        DATETIME NULL,
    [ValidTo]          DATETIME NULL,
    [QuantityLack]     INT      NULL,
    [ActorOffer]       INT      NULL,
    [ActorRequest]     INT      NULL,
    [Resource]         INT      NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [dbo].[ProductTypes_To_ProductTypes]...';


GO
CREATE TABLE [dbo].[ProductTypes_To_ProductTypes] (
    [SybTypes]   INT NOT NULL,
    [ParentType] INT NOT NULL
);


GO
PRINT N'Creating unnamed constraint on [dbo].[Matches]...';


GO
ALTER TABLE [dbo].[Matches]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Creating [dbo].[FK_Materials_DigicircUsers_RequestedBy]...';


GO
ALTER TABLE [dbo].[Materials] WITH NOCHECK
    ADD CONSTRAINT [FK_Materials_DigicircUsers_RequestedBy] FOREIGN KEY ([RequestedBy]) REFERENCES [dbo].[DigicircUsers] ([UserName]);


GO
PRINT N'Creating [dbo].[FK_Materials_Processes_ConvertedBy]...';


GO
ALTER TABLE [dbo].[Processes_To_Materials] WITH NOCHECK
    ADD CONSTRAINT [FK_Materials_Processes_ConvertedBy] FOREIGN KEY ([Product]) REFERENCES [dbo].[Materials] ([Id]);


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
PRINT N'Creating [dbo].[FK_Materials_ProductTypes_Type]...';


GO
ALTER TABLE [dbo].[Materials] WITH NOCHECK
    ADD CONSTRAINT [FK_Materials_ProductTypes_Type] FOREIGN KEY ([Type]) REFERENCES [dbo].[ProductTypes] ([Id]);


GO
PRINT N'Creating [dbo].[FK_Materials_PhysicalForms_PhysicalForm]...';


GO
ALTER TABLE [dbo].[Materials] WITH NOCHECK
    ADD CONSTRAINT [FK_Materials_PhysicalForms_PhysicalForm] FOREIGN KEY ([PhysicalForm]) REFERENCES [dbo].[ValueTypes] ([Id]);


GO
PRINT N'Creating [dbo].[FK_Materials_UnitOfMeasurements_UnitOfMeasurement]...';


GO
ALTER TABLE [dbo].[Materials] WITH NOCHECK
    ADD CONSTRAINT [FK_Materials_UnitOfMeasurements_UnitOfMeasurement] FOREIGN KEY ([UnitOfMeasurement]) REFERENCES [dbo].[ValueTypes] ([Id]);


GO
PRINT N'Creating [dbo].[FK_Matches_Materials_Resource]...';


GO
ALTER TABLE [dbo].[Matches] WITH NOCHECK
    ADD CONSTRAINT [FK_Matches_Materials_Resource] FOREIGN KEY ([Resource]) REFERENCES [dbo].[Materials] ([Id]);


GO
PRINT N'Creating [dbo].[FK_Matches_Actors_ActorOffer]...';


GO
ALTER TABLE [dbo].[Matches] WITH NOCHECK
    ADD CONSTRAINT [FK_Matches_Actors_ActorOffer] FOREIGN KEY ([ActorOffer]) REFERENCES [dbo].[Actors] ([Id]);


GO
PRINT N'Creating [dbo].[FK_Matches_Actors_ActorRequest]...';


GO
ALTER TABLE [dbo].[Matches] WITH NOCHECK
    ADD CONSTRAINT [FK_Matches_Actors_ActorRequest] FOREIGN KEY ([ActorRequest]) REFERENCES [dbo].[Actors] ([Id]);


GO
PRINT N'Creating [dbo].[FK_ProductTypes_ProductTypes_SybTypes]...';


GO
ALTER TABLE [dbo].[ProductTypes_To_ProductTypes] WITH NOCHECK
    ADD CONSTRAINT [FK_ProductTypes_ProductTypes_SybTypes] FOREIGN KEY ([ParentType]) REFERENCES [dbo].[ProductTypes] ([Id]);


GO
PRINT N'Creating [dbo].[FK_ProductTypes_ProductTypes_ParentType]...';


GO
ALTER TABLE [dbo].[ProductTypes_To_ProductTypes] WITH NOCHECK
    ADD CONSTRAINT [FK_ProductTypes_ProductTypes_ParentType] FOREIGN KEY ([SybTypes]) REFERENCES [dbo].[ProductTypes] ([Id]);


GO
PRINT N'Checking existing data against newly created constraints';


GO



GO
ALTER TABLE [dbo].[Materials] WITH CHECK CHECK CONSTRAINT [FK_Materials_DigicircUsers_RequestedBy];

ALTER TABLE [dbo].[Processes_To_Materials] WITH CHECK CHECK CONSTRAINT [FK_Materials_Processes_ConvertedBy];

ALTER TABLE [dbo].[Processes_To_Materials_1] WITH CHECK CHECK CONSTRAINT [FK_Materials_Processes_ConvertBy];

ALTER TABLE [dbo].[Products] WITH CHECK CHECK CONSTRAINT [FK_Products_Materials_Resource];

ALTER TABLE [dbo].[Materials] WITH CHECK CHECK CONSTRAINT [FK_Materials_ProductTypes_Type];

ALTER TABLE [dbo].[Materials] WITH CHECK CHECK CONSTRAINT [FK_Materials_PhysicalForms_PhysicalForm];

ALTER TABLE [dbo].[Materials] WITH CHECK CHECK CONSTRAINT [FK_Materials_UnitOfMeasurements_UnitOfMeasurement];

ALTER TABLE [dbo].[Matches] WITH CHECK CHECK CONSTRAINT [FK_Matches_Materials_Resource];

ALTER TABLE [dbo].[Matches] WITH CHECK CHECK CONSTRAINT [FK_Matches_Actors_ActorOffer];

ALTER TABLE [dbo].[Matches] WITH CHECK CHECK CONSTRAINT [FK_Matches_Actors_ActorRequest];

ALTER TABLE [dbo].[ProductTypes_To_ProductTypes] WITH CHECK CHECK CONSTRAINT [FK_ProductTypes_ProductTypes_SybTypes];

ALTER TABLE [dbo].[ProductTypes_To_ProductTypes] WITH CHECK CHECK CONSTRAINT [FK_ProductTypes_ProductTypes_ParentType];


GO
PRINT N'Update complete.';


GO
