


GO
PRINT N'Creating [dbo].[ActorNamesTbl]...';


GO
CREATE TABLE [dbo].[ActorNamesTbl] (
    [Id]   INT            NOT NULL,
    [Name] NVARCHAR (100) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [dbo].[Companies]...';


GO
CREATE TABLE [dbo].[Companies] (
    [Id]               INT            NOT NULL,
    [VersionTimestamp] INT            NOT NULL,
    [company_name]     NVARCHAR (100) NULL,
    [url]              NVARCHAR (100) NULL,
    [city]             NVARCHAR (100) NULL,
    [country]          NVARCHAR (100) NULL,
    [zip_code]         NVARCHAR (100) NULL,
    [company_category] NVARCHAR (100) NULL,
    [description]      NVARCHAR (MAX) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating unnamed constraint on [dbo].[Companies]...';


GO
ALTER TABLE [dbo].[Companies]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Update complete.';


GO
