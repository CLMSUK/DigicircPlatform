


GO
PRINT N'Creating [dbo].[DigicircUsers_To_Actors]...';


GO
CREATE TABLE [dbo].[DigicircUsers_To_Actors] (
    [Actor_Administrators] INT            NOT NULL,
    [Administrators]       NVARCHAR (255) NOT NULL
);


GO
PRINT N'Creating [dbo].[FK_4A01ACCE]...';


GO
ALTER TABLE [dbo].[DigicircUsers_To_Actors] WITH NOCHECK
    ADD CONSTRAINT [FK_4A01ACCE] FOREIGN KEY ([Administrators]) REFERENCES [dbo].[DigicircUsers] ([UserName]);


GO
PRINT N'Creating [dbo].[FK_Actors_To_DigicircUsers_On_Administrators]...';


GO
ALTER TABLE [dbo].[DigicircUsers_To_Actors] WITH NOCHECK
    ADD CONSTRAINT [FK_Actors_To_DigicircUsers_On_Administrators] FOREIGN KEY ([Actor_Administrators]) REFERENCES [dbo].[Actors] ([Id]);


GO
PRINT N'Checking existing data against newly created constraints';


GO



GO
ALTER TABLE [dbo].[DigicircUsers_To_Actors] WITH CHECK CHECK CONSTRAINT [FK_4A01ACCE];

ALTER TABLE [dbo].[DigicircUsers_To_Actors] WITH CHECK CHECK CONSTRAINT [FK_Actors_To_DigicircUsers_On_Administrators];


GO
PRINT N'Update complete.';


GO
