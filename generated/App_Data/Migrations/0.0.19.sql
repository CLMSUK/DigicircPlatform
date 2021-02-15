


GO
/*
The column [dbo].[DigicircUsers_To_Actors].[Actor_Administrators] is being dropped, data loss could occur.
*/

IF EXISTS (select top 1 1 from [dbo].[DigicircUsers_To_Actors])
    RAISERROR (N'Rows were detected. The schema update is terminating because data loss might occur.', 16, 127) WITH NOWAIT

GO
PRINT N'Dropping [dbo].[FK_4A01ACCE]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'FK_4A01ACCE' AND parent_object_id = object_id('[dbo].[DigicircUsers_To_Actors]')) ALTER TABLE [dbo].[DigicircUsers_To_Actors] DROP CONSTRAINT [FK_4A01ACCE];


GO
PRINT N'Dropping [dbo].[FK_Actors_To_DigicircUsers_On_Administrators]...';


GO
IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'FK_Actors_To_DigicircUsers_On_Administrators' AND parent_object_id = object_id('[dbo].[DigicircUsers_To_Actors]')) ALTER TABLE [dbo].[DigicircUsers_To_Actors] DROP CONSTRAINT [FK_Actors_To_DigicircUsers_On_Administrators];


GO
PRINT N'Starting rebuilding table [dbo].[DigicircUsers_To_Actors]...';


GO
BEGIN TRANSACTION;

SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

SET XACT_ABORT ON;

CREATE TABLE [dbo].[tmp_ms_xx_DigicircUsers_To_Actors] (
    [ActorsCanManage_Administrators] INT            NOT NULL,
    [Administrators]                 NVARCHAR (255) NOT NULL
);

ALTER TABLE [dbo].[tmp_ms_xx_DigicircUsers_To_Actors]
    ADD CONSTRAINT [SD_DigicircUsers_To_Actors_0263c5b56f7142a0b5089e46b0537808] DEFAULT 0 FOR [ActorsCanManage_Administrators];

IF EXISTS (SELECT TOP 1 1 
           FROM   [dbo].[DigicircUsers_To_Actors])
    BEGIN
        INSERT INTO [dbo].[tmp_ms_xx_DigicircUsers_To_Actors] ([Administrators])
        SELECT [Administrators]
        FROM   [dbo].[DigicircUsers_To_Actors];
    END

IF EXISTS(SELECT 1 FROM sys.objects WHERE name = 'SD_DigicircUsers_To_Actors_0263c5b56f7142a0b5089e46b0537808' AND parent_object_id = object_id('[dbo].[tmp_ms_xx_DigicircUsers_To_Actors]')) ALTER TABLE [dbo].[tmp_ms_xx_DigicircUsers_To_Actors] DROP CONSTRAINT [SD_DigicircUsers_To_Actors_0263c5b56f7142a0b5089e46b0537808];

DROP TABLE [dbo].[DigicircUsers_To_Actors];

EXECUTE sp_rename N'[dbo].[tmp_ms_xx_DigicircUsers_To_Actors]', N'DigicircUsers_To_Actors';

COMMIT TRANSACTION;

SET TRANSACTION ISOLATION LEVEL READ COMMITTED;


GO
PRINT N'Creating [dbo].[FK_4A01ACCE]...';


GO
ALTER TABLE [dbo].[DigicircUsers_To_Actors] WITH NOCHECK
    ADD CONSTRAINT [FK_4A01ACCE] FOREIGN KEY ([Administrators]) REFERENCES [dbo].[DigicircUsers] ([UserName]);


GO
PRINT N'Creating [dbo].[FK_Actors_To_DigicircUsers_On_Administrators]...';


GO
ALTER TABLE [dbo].[DigicircUsers_To_Actors] WITH NOCHECK
    ADD CONSTRAINT [FK_Actors_To_DigicircUsers_On_Administrators] FOREIGN KEY ([ActorsCanManage_Administrators]) REFERENCES [dbo].[Actors] ([Id]);


GO
PRINT N'Checking existing data against newly created constraints';


GO



GO
ALTER TABLE [dbo].[DigicircUsers_To_Actors] WITH CHECK CHECK CONSTRAINT [FK_4A01ACCE];

ALTER TABLE [dbo].[DigicircUsers_To_Actors] WITH CHECK CHECK CONSTRAINT [FK_Actors_To_DigicircUsers_On_Administrators];


GO
PRINT N'Update complete.';


GO
