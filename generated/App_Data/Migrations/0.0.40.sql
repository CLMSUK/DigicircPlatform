


GO
PRINT N'Altering [security].[FileDataTbl]...';


GO
ALTER TABLE [security].[FileDataTbl]
    ADD [Description] NVARCHAR (1000) NULL;


GO
PRINT N'Update complete.';


GO
