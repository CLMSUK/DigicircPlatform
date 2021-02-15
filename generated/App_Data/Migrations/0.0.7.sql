


GO
PRINT N'Altering [dbo].[Companies]...';


GO
ALTER TABLE [dbo].[Companies]
    ADD [imported] BIT NULL;


GO
PRINT N'Update complete.';


GO
