


GO
PRINT N'Altering [dbo].[DigicircUsers]...';


GO
ALTER TABLE [dbo].[DigicircUsers]
    ADD [FirstName] NVARCHAR (256) NULL,
        [LastName]  NVARCHAR (256) NULL;


GO
PRINT N'Update complete.';


GO
