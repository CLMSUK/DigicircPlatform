


GO
PRINT N'Creating [audit]...';


GO
exec('CREATE SCHEMA [audit]
    AUTHORIZATION [dbo];');


GO
PRINT N'Creating [security]...';


GO
exec('CREATE SCHEMA [security]
    AUTHORIZATION [dbo];');


GO
PRINT N'Creating [wf]...';


GO
exec('CREATE SCHEMA [wf]
    AUTHORIZATION [dbo];');


GO
PRINT N'Creating [audit].[hibernate_sequences]...';


GO
CREATE TABLE [audit].[hibernate_sequences] (
    [sequence_name] VARCHAR (255) NOT NULL,
    [next_val]      BIGINT        NULL,
    PRIMARY KEY CLUSTERED ([sequence_name] ASC)
);


GO
PRINT N'Creating [audit].[AuditEntityConfigurations]...';


GO
CREATE TABLE [audit].[AuditEntityConfigurations] (
    [Id]               INT             NOT NULL,
    [VersionTimestamp] INT             NOT NULL,
    [FullName]         NVARCHAR (4000) NULL,
    [ShortName]        NVARCHAR (4000) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [audit].[AuditLogEntries]...';


GO
CREATE TABLE [audit].[AuditLogEntries] (
    [Id]              INT             NOT NULL,
    [UserName]        NVARCHAR (4000) NULL,
    [IPAddress]       NVARCHAR (4000) NULL,
    [EntityFullName]  NVARCHAR (4000) NULL,
    [EntityShortName] NVARCHAR (4000) NULL,
    [EntityId]        NVARCHAR (4000) NULL,
    [Timestamp]       DATETIME        NULL,
    [EntryTypeId]     INT             NULL,
    [ActionTypeId]    INT             NULL,
    [OldValue]        NVARCHAR (4000) NULL,
    [NewValue]        NVARCHAR (4000) NULL,
    [PropertyName]    NVARCHAR (4000) NULL,
    [ExtraField1]     NVARCHAR (4000) NULL,
    [ExtraField2]     NVARCHAR (4000) NULL,
    [ExtraField3]     NVARCHAR (4000) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [audit].[AuditLogEntryTypes]...';


GO
CREATE TABLE [audit].[AuditLogEntryTypes] (
    [Id]               INT             NOT NULL,
    [VersionTimestamp] INT             NOT NULL,
    [Code]             NVARCHAR (4000) NULL,
    [Name]             NVARCHAR (4000) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [audit].[AuditLogPropertyActionTypes]...';


GO
CREATE TABLE [audit].[AuditLogPropertyActionTypes] (
    [Id]               INT             NOT NULL,
    [VersionTimestamp] INT             NOT NULL,
    [Code]             NVARCHAR (4000) NULL,
    [Name]             NVARCHAR (4000) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [audit].[AuditPropertyConfigurations]...';


GO
CREATE TABLE [audit].[AuditPropertyConfigurations] (
    [Id]               INT             NOT NULL,
    [VersionTimestamp] INT             NOT NULL,
    [Name]             NVARCHAR (4000) NULL,
    [DataType]         NVARCHAR (4000) NULL,
    [IsAuditable]      BIT             NULL,
    [IsComplex]        BIT             NULL,
    [IsCollection]     BIT             NULL,
    [Entity]           INT             NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [security].[hibernate_sequences]...';


GO
CREATE TABLE [security].[hibernate_sequences] (
    [sequence_name] VARCHAR (255) NOT NULL,
    [next_val]      BIGINT        NULL,
    PRIMARY KEY CLUSTERED ([sequence_name] ASC)
);


GO
PRINT N'Creating [security].[ApplicationClients]...';


GO
CREATE TABLE [security].[ApplicationClients] (
    [Id]               INT            NOT NULL,
    [VersionTimestamp] INT            NOT NULL,
    [ClientKey]        NVARCHAR (500) NULL,
    [IPAddress]        NVARCHAR (100) NULL,
    [SessionId]        NVARCHAR (100) NULL,
    [ConnectedOn]      DATETIME       NULL,
    [User]             NVARCHAR (255) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [security].[ApplicationLanguages]...';


GO
CREATE TABLE [security].[ApplicationLanguages] (
    [Id]               INT             NOT NULL,
    [VersionTimestamp] INT             NOT NULL,
    [Name]             NVARCHAR (100)  NULL,
    [Code]             NVARCHAR (100)  NULL,
    [Icon]             VARBINARY (100) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [security].[ApplicationOperations]...';


GO
CREATE TABLE [security].[ApplicationOperations] (
    [Id]                              INT            NOT NULL,
    [VersionTimestamp]                INT            NOT NULL,
    [Name]                            NVARCHAR (255) NOT NULL,
    [ParentControllerName]            NVARCHAR (100) NULL,
    [Type]                            NVARCHAR (100) NULL,
    [IsAvailableToAnonymous]          BIT            NULL,
    [IsAvailableToAllAuthorizedUsers] BIT            NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [security].[ApplicationOperations_To_ApplicationPermissions]...';


GO
CREATE TABLE [security].[ApplicationOperations_To_ApplicationPermissions] (
    [Operations]  INT NOT NULL,
    [Permissions] INT NOT NULL
);


GO
PRINT N'Creating [security].[ApplicationPermissions]...';


GO
CREATE TABLE [security].[ApplicationPermissions] (
    [Id]               INT             NOT NULL,
    [VersionTimestamp] INT             NOT NULL,
    [Name]             NVARCHAR (255)  NOT NULL,
    [Description]      NVARCHAR (1000) NULL,
    [IsCustom]         BIT             NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [security].[ApplicationPermissions_To_ApplicationUsers]...';


GO
CREATE TABLE [security].[ApplicationPermissions_To_ApplicationUsers] (
    [Permissions] INT            NOT NULL,
    [Users]       NVARCHAR (255) NOT NULL
);


GO
PRINT N'Creating [security].[ApplicationPermissions_To_ApplicationRoles]...';


GO
CREATE TABLE [security].[ApplicationPermissions_To_ApplicationRoles] (
    [Permissions] INT NOT NULL,
    [Roles]       INT NOT NULL
);


GO
PRINT N'Creating [security].[ApplicationRoles]...';


GO
CREATE TABLE [security].[ApplicationRoles] (
    [Id]               INT             NOT NULL,
    [VersionTimestamp] INT             NOT NULL,
    [Name]             NVARCHAR (255)  NOT NULL,
    [Description]      NVARCHAR (1000) NULL,
    [IsCustom]         BIT             NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [security].[ApplicationRoles_To_ApplicationUsers]...';


GO
CREATE TABLE [security].[ApplicationRoles_To_ApplicationUsers] (
    [Roles] INT            NOT NULL,
    [Users] NVARCHAR (255) NOT NULL
);


GO
PRINT N'Creating [security].[ApplicationSettings]...';


GO
CREATE TABLE [security].[ApplicationSettings] (
    [Id]               INT            NOT NULL,
    [VersionTimestamp] INT            NOT NULL,
    [Key]              NVARCHAR (500) NULL,
    [Value]            NVARCHAR (500) NULL,
    [IsCustom]         BIT            NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [security].[ApplicationThemes]...';


GO
CREATE TABLE [security].[ApplicationThemes] (
    [Id]               INT            NOT NULL,
    [VersionTimestamp] INT            NOT NULL,
    [Name]             NVARCHAR (100) NULL,
    [Description]      NVARCHAR (100) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [security].[ApplicationUsers]...';


GO
CREATE TABLE [security].[ApplicationUsers] (
    [UserName]             NVARCHAR (255) NOT NULL,
    [VersionTimestamp]     INT            NOT NULL,
    [PasswordHash]         NVARCHAR (MAX) NULL,
    [SecurityStamp]        NVARCHAR (MAX) NULL,
    [EmailConfirmed]       BIT            NULL,
    [LockoutEnabled]       BIT            NULL,
    [PhoneNumberConfirmed] BIT            NULL,
    [TwoFactorEnabled]     BIT            NULL,
    [AccessFailedCount]    INT            NULL,
    [Name]                 NVARCHAR (256) NULL,
    [Email]                NVARCHAR (255) NULL,
    [PhoneNumber]          NVARCHAR (255) NULL,
    [LockoutEndDate]       DATETIME       NULL,
    [Profile]              INT            NULL,
    PRIMARY KEY CLUSTERED ([UserName] ASC)
);


GO
PRINT N'Creating [security].[ApplicationUserActions]...';


GO
CREATE TABLE [security].[ApplicationUserActions] (
    [Id]                INT             NOT NULL,
    [UserName]          NVARCHAR (500)  NULL,
    [ActiveRoles]       NVARCHAR (4000) NULL,
    [ActivePermissions] NVARCHAR (4000) NULL,
    [Action]            NVARCHAR (500)  NULL,
    [Controller]        NVARCHAR (500)  NULL,
    [Date]              DATETIME        NULL,
    [ErrorMessage]      NVARCHAR (4000) NULL,
    [Success]           BIT             NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [security].[ApplicationUserClaims]...';


GO
CREATE TABLE [security].[ApplicationUserClaims] (
    [Id]               INT            NOT NULL,
    [VersionTimestamp] INT            NOT NULL,
    [ClaimType]        NVARCHAR (MAX) NULL,
    [ClaimValue]       NVARCHAR (MAX) NULL,
    [ClaimValueType]   NVARCHAR (100) NULL,
    [Issuer]           NVARCHAR (MAX) NULL,
    [OriginalIssuer]   NVARCHAR (MAX) NULL,
    [User]             NVARCHAR (255) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [security].[ApplicationUserExternalProfiles]...';


GO
CREATE TABLE [security].[ApplicationUserExternalProfiles] (
    [Id]               INT             NOT NULL,
    [VersionTimestamp] INT             NOT NULL,
    [Gender]           NVARCHAR (100)  NULL,
    [Name]             NVARCHAR (1000) NULL,
    [Surname]          NVARCHAR (1000) NULL,
    [DisplayName]      NVARCHAR (1000) NULL,
    [Email]            NVARCHAR (1000) NULL,
    [Provider]         NVARCHAR (1000) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [security].[ApplicationUserLogins]...';


GO
CREATE TABLE [security].[ApplicationUserLogins] (
    [Id]               INT            NOT NULL,
    [VersionTimestamp] INT            NOT NULL,
    [LoginProvider]    NVARCHAR (128) NULL,
    [ProviderKey]      NVARCHAR (128) NULL,
    [User]             NVARCHAR (255) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [security].[DateTimeFormats]...';


GO
CREATE TABLE [security].[DateTimeFormats] (
    [Id]                  INT            NOT NULL,
    [VersionTimestamp]    INT            NOT NULL,
    [LongDatePattern]     NVARCHAR (100) NULL,
    [LongTimePattern]     NVARCHAR (100) NULL,
    [MonthDayPattern]     NVARCHAR (100) NULL,
    [RFC1123Pattern]      NVARCHAR (100) NULL,
    [ShortDatePattern]    NVARCHAR (100) NULL,
    [ShortTimePattern]    NVARCHAR (100) NULL,
    [YearMonthPattern]    NVARCHAR (100) NULL,
    [ApplicationLanguage] INT            NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [security].[Profiles]...';


GO
CREATE TABLE [security].[Profiles] (
    [Id]               INT            NOT NULL,
    [VersionTimestamp] INT            NOT NULL,
    [LanguageLCID]     INT            NULL,
    [LocaleLCID]       INT            NULL,
    [TimezoneId]       NVARCHAR (100) NULL,
    [Theme]            NVARCHAR (100) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [security].[ProfileSettings]...';


GO
CREATE TABLE [security].[ProfileSettings] (
    [Id]               INT            NOT NULL,
    [VersionTimestamp] INT            NOT NULL,
    [Key]              NVARCHAR (100) NULL,
    [Value]            NVARCHAR (MAX) NULL,
    [ParentProfile]    INT            NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [security].[FileDataTbl]...';


GO
CREATE TABLE [security].[FileDataTbl] (
    [Id]                UNIQUEIDENTIFIER NOT NULL,
    [VersionTimestamp]  INT              NOT NULL,
    [FileName]          NVARCHAR (255)   NULL,
    [FolderPath]        NVARCHAR (255)   NULL,
    [MaxFileSize]       INT              NULL,
    [AllowedExtensions] NVARCHAR (MAX)   NULL,
    [Blob]              VARBINARY (MAX)  NULL,
    [StorageMedium]     INT              NULL,
    [UploadedBy]        NVARCHAR (1000)  NULL,
    [UploadDateTime]    DATETIME         NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [wf].[WorkflowContextBases]...';


GO
CREATE TABLE [wf].[WorkflowContextBases] (
    [Id]                  UNIQUEIDENTIFIER NOT NULL,
    [Name]                NVARCHAR (512)   NULL,
    [Error]               NVARCHAR (4000)  NULL,
    [Expires]             BIT              NULL,
    [ExpirationDateTime]  DATETIME         NULL,
    [PendingSince]        DATETIME         NULL,
    [PendingJobCreatedBy] NVARCHAR (512)   NULL,
    [PendingStep]         NVARCHAR (512)   NULL,
    [Status]              INT              NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [wf].[WorkflowSchedules]...';


GO
CREATE TABLE [wf].[WorkflowSchedules] (
    [Workflow]               NVARCHAR (255)  NOT NULL,
    [Description]            NVARCHAR (1000) NULL,
    [StartDateTime]          DATETIME        NULL,
    [ExpireOn]               DATETIME        NULL,
    [CronExpression]         NVARCHAR (100)  NULL,
    [LastExecution]          DATETIME        NULL,
    [LastExecutionMessage]   NVARCHAR (MAX)  NULL,
    [IsLastExecutionSuccess] BIT             NULL,
    [Active]                 BIT             NULL,
    [CronExpressionTimezone] NVARCHAR (255)  NULL,
    PRIMARY KEY CLUSTERED ([Workflow] ASC)
);


GO
PRINT N'Creating [dbo].[ActivitiesTbl]...';


GO
CREATE TABLE [dbo].[ActivitiesTbl] (
    [Id]               INT            NOT NULL,
    [VersionTimestamp] INT            NOT NULL,
    [Value]            NVARCHAR (100) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [dbo].[Actors]...';


GO
CREATE TABLE [dbo].[Actors] (
    [Id]                            INT            NOT NULL,
    [VersionTimestamp]              INT            NOT NULL,
    [Name]                          NVARCHAR (255) NULL,
    [Description]                   NVARCHAR (MAX) NULL,
    [Logo]                          NVARCHAR (255) NULL,
    [Url]                           NVARCHAR (MAX) NULL,
    [Email]                         NVARCHAR (MAX) NULL,
    [Address]                       INT            NULL,
    [AddedBy]                       NVARCHAR (255) NULL,
    [CircularEconomyRequirements]   INT            NULL,
    [CircularEconomyProviderReport] INT            NULL,
    [EntityType]                    INT            NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [dbo].[Actors_To_SectorTypes]...';


GO
CREATE TABLE [dbo].[Actors_To_SectorTypes] (
    [Actor]       INT NOT NULL,
    [SectorTypes] INT NOT NULL
);


GO
PRINT N'Creating [dbo].[Addresses]...';


GO
CREATE TABLE [dbo].[Addresses] (
    [Id]               INT            NOT NULL,
    [VersionTimestamp] INT            NOT NULL,
    [Latitude]         FLOAT (53)     NULL,
    [Longitude]        FLOAT (53)     NULL,
    [StreetName]       NVARCHAR (100) NULL,
    [Number]           INT            NULL,
    [Town]             NVARCHAR (100) NULL,
    [Zip]              NVARCHAR (100) NULL,
    [Country]          INT            NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [dbo].[BusinessFunctions]...';


GO
CREATE TABLE [dbo].[BusinessFunctions] (
    [Id]               INT            NOT NULL,
    [VersionTimestamp] INT            NOT NULL,
    [Value]            NVARCHAR (100) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [dbo].[BusinessTypes]...';


GO
CREATE TABLE [dbo].[BusinessTypes] (
    [Id]               INT            NOT NULL,
    [VersionTimestamp] INT            NOT NULL,
    [Value]            NVARCHAR (100) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [dbo].[CircularEconomyProviderReports]...';


GO
CREATE TABLE [dbo].[CircularEconomyProviderReports] (
    [Id]                         INT NOT NULL,
    [VersionTimestamp]           INT NOT NULL,
    [AvailableTestingFacilities] BIT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [dbo].[CircularEconomyReports]...';


GO
CREATE TABLE [dbo].[CircularEconomyReports] (
    [Id]                          INT NOT NULL,
    [VersionTimestamp]            INT NOT NULL,
    [ExperienceInCircularEconomy] BIT NULL,
    [DigitalExpertise]            INT NULL,
    [DigitalProviredNeeded]       BIT NULL,
    [ThematicExpertiseNeeded]     BIT NULL,
    [DesiredSMESector]            INT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [dbo].[ContactInfos]...';


GO
CREATE TABLE [dbo].[ContactInfos] (
    [Id]                 INT            NOT NULL,
    [VersionTimestamp]   INT            NOT NULL,
    [Email]              NVARCHAR (MAX) NULL,
    [Phone]              NVARCHAR (MAX) NULL,
    [Name]               NVARCHAR (MAX) NULL,
    [Actor_ContactInfos] INT            NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [dbo].[Countries]...';


GO
CREATE TABLE [dbo].[Countries] (
    [Id]               INT            NOT NULL,
    [VersionTimestamp] INT            NOT NULL,
    [Name]             NVARCHAR (255) NULL,
    [ShortName]        NVARCHAR (2)   NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [dbo].[DigicircUsers]...';


GO
CREATE TABLE [dbo].[DigicircUsers] (
    [UserName] NVARCHAR (255) NOT NULL,
    PRIMARY KEY CLUSTERED ([UserName] ASC)
);


GO
PRINT N'Creating [dbo].[GeographicalAreas]...';


GO
CREATE TABLE [dbo].[GeographicalAreas] (
    [Id]                                                 INT NOT NULL,
    [VersionTimestamp]                                   INT NOT NULL,
    [CircularEconomyProviderReport_PlaceOperates]        INT NULL,
    [CircularEconomyInformation_DesiredGeographicalArea] INT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [dbo].[hibernate_sequences]...';


GO
CREATE TABLE [dbo].[hibernate_sequences] (
    [sequence_name] VARCHAR (255) NOT NULL,
    [next_val]      BIGINT        NULL,
    PRIMARY KEY CLUSTERED ([sequence_name] ASC)
);


GO
PRINT N'Creating [dbo].[Migrations]...';


GO
CREATE TABLE [dbo].[Migrations] (
    [MigrationVersion] VARCHAR (25) NOT NULL,
    [UpdateDate]       DATETIME     NOT NULL,
    PRIMARY KEY CLUSTERED ([MigrationVersion] ASC)
);


GO
PRINT N'Creating [dbo].[ResourcesHash]...';


GO
CREATE TABLE [dbo].[ResourcesHash] (
    [Resource]   NVARCHAR (200) NOT NULL,
    [Hash]       NVARCHAR (MAX) NOT NULL,
    [Used]       BIT            NOT NULL,
    [UpdateDate] DATETIME       NOT NULL,
    CONSTRAINT [PK_ResourcesHash] PRIMARY KEY CLUSTERED ([Resource] ASC)
);


GO
PRINT N'Creating [dbo].[SynchronizeSchemaInfo]...';


GO
CREATE TABLE [dbo].[SynchronizeSchemaInfo] (
    [DifferenceHash]           NVARCHAR (100) NULL,
    [NhibernateFilesHash]      NVARCHAR (100) NULL,
    [TempDifferenceHash4Check] NVARCHAR (100) NULL,
    [UpdateDate]               DATETIME       NULL
);


GO
PRINT N'Creating [dbo].[SynchronizeSchemaInfoHistory]...';


GO
CREATE TABLE [dbo].[SynchronizeSchemaInfoHistory] (
    [ID]           INT            IDENTITY (1, 1) NOT NULL,
    [UpdateDate]   DATETIME       NOT NULL,
    [CreateScript] NVARCHAR (MAX) NOT NULL
);


GO
PRINT N'Creating [dbo].[ThematicExpertises_To_CircularEconomyReports]...';


GO
CREATE TABLE [dbo].[ThematicExpertises_To_CircularEconomyReports] (
    [CircularEconomyInformation_DesiredThematicExpertises] INT NOT NULL,
    [DesiredThematicExpertises]                            INT NOT NULL
);


GO
PRINT N'Creating [dbo].[ValueTypes]...';


GO
CREATE TABLE [dbo].[ValueTypes] (
    [Id]                                               INT            NOT NULL,
    [VALUETYPE_TYPE]                                   NVARCHAR (255) NOT NULL,
    [VersionTimestamp]                                 INT            NOT NULL,
    [Code]                                             NVARCHAR (255) NULL,
    [Value]                                            NVARCHAR (255) NULL,
    [IsProvider]                                       BIT            NULL,
    [CircularEconomyProviderReport_ThematicExpertises] INT            NULL,
    [CircularEconomyProviderReport_ServicesProvided]   INT            NULL,
    [CircularEconomyProviderReport_Expertises]         INT            NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating unnamed constraint on [audit].[AuditEntityConfigurations]...';


GO
ALTER TABLE [audit].[AuditEntityConfigurations]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Creating unnamed constraint on [audit].[AuditLogEntryTypes]...';


GO
ALTER TABLE [audit].[AuditLogEntryTypes]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Creating unnamed constraint on [audit].[AuditLogPropertyActionTypes]...';


GO
ALTER TABLE [audit].[AuditLogPropertyActionTypes]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Creating unnamed constraint on [audit].[AuditPropertyConfigurations]...';


GO
ALTER TABLE [audit].[AuditPropertyConfigurations]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Creating unnamed constraint on [security].[ApplicationClients]...';


GO
ALTER TABLE [security].[ApplicationClients]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Creating unnamed constraint on [security].[ApplicationLanguages]...';


GO
ALTER TABLE [security].[ApplicationLanguages]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Creating unnamed constraint on [security].[ApplicationOperations]...';


GO
ALTER TABLE [security].[ApplicationOperations]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Creating unnamed constraint on [security].[ApplicationPermissions]...';


GO
ALTER TABLE [security].[ApplicationPermissions]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Creating unnamed constraint on [security].[ApplicationRoles]...';


GO
ALTER TABLE [security].[ApplicationRoles]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Creating unnamed constraint on [security].[ApplicationSettings]...';


GO
ALTER TABLE [security].[ApplicationSettings]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Creating unnamed constraint on [security].[ApplicationThemes]...';


GO
ALTER TABLE [security].[ApplicationThemes]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Creating unnamed constraint on [security].[ApplicationUsers]...';


GO
ALTER TABLE [security].[ApplicationUsers]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Creating unnamed constraint on [security].[ApplicationUserClaims]...';


GO
ALTER TABLE [security].[ApplicationUserClaims]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Creating unnamed constraint on [security].[ApplicationUserExternalProfiles]...';


GO
ALTER TABLE [security].[ApplicationUserExternalProfiles]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Creating unnamed constraint on [security].[ApplicationUserLogins]...';


GO
ALTER TABLE [security].[ApplicationUserLogins]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Creating unnamed constraint on [security].[DateTimeFormats]...';


GO
ALTER TABLE [security].[DateTimeFormats]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Creating unnamed constraint on [security].[Profiles]...';


GO
ALTER TABLE [security].[Profiles]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Creating unnamed constraint on [security].[ProfileSettings]...';


GO
ALTER TABLE [security].[ProfileSettings]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Creating unnamed constraint on [security].[FileDataTbl]...';


GO
ALTER TABLE [security].[FileDataTbl]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Creating unnamed constraint on [dbo].[ActivitiesTbl]...';


GO
ALTER TABLE [dbo].[ActivitiesTbl]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Creating unnamed constraint on [dbo].[Actors]...';


GO
ALTER TABLE [dbo].[Actors]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Creating unnamed constraint on [dbo].[Addresses]...';


GO
ALTER TABLE [dbo].[Addresses]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Creating unnamed constraint on [dbo].[BusinessFunctions]...';


GO
ALTER TABLE [dbo].[BusinessFunctions]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Creating unnamed constraint on [dbo].[BusinessTypes]...';


GO
ALTER TABLE [dbo].[BusinessTypes]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Creating unnamed constraint on [dbo].[CircularEconomyProviderReports]...';


GO
ALTER TABLE [dbo].[CircularEconomyProviderReports]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Creating unnamed constraint on [dbo].[CircularEconomyReports]...';


GO
ALTER TABLE [dbo].[CircularEconomyReports]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Creating unnamed constraint on [dbo].[ContactInfos]...';


GO
ALTER TABLE [dbo].[ContactInfos]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Creating unnamed constraint on [dbo].[Countries]...';


GO
ALTER TABLE [dbo].[Countries]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Creating unnamed constraint on [dbo].[GeographicalAreas]...';


GO
ALTER TABLE [dbo].[GeographicalAreas]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Creating unnamed constraint on [dbo].[ValueTypes]...';


GO
ALTER TABLE [dbo].[ValueTypes]
    ADD DEFAULT ((1)) FOR [VersionTimestamp];


GO
PRINT N'Creating [audit].[FK_AuditPropertyConfigurations_Properties]...';


GO
ALTER TABLE [audit].[AuditPropertyConfigurations] WITH NOCHECK
    ADD CONSTRAINT [FK_AuditPropertyConfigurations_Properties] FOREIGN KEY ([Entity]) REFERENCES [audit].[AuditEntityConfigurations] ([Id]);


GO
PRINT N'Creating [security].[FK_ApplicationUsers_To_ApplicationClients_On_Clients]...';


GO
ALTER TABLE [security].[ApplicationClients] WITH NOCHECK
    ADD CONSTRAINT [FK_ApplicationUsers_To_ApplicationClients_On_Clients] FOREIGN KEY ([User]) REFERENCES [security].[ApplicationUsers] ([UserName]);


GO
PRINT N'Creating [security].[FK_ApplicationOperations_On_Operations]...';


GO
ALTER TABLE [security].[ApplicationOperations_To_ApplicationPermissions] WITH NOCHECK
    ADD CONSTRAINT [FK_ApplicationOperations_On_Operations] FOREIGN KEY ([Permissions]) REFERENCES [security].[ApplicationPermissions] ([Id]);


GO
PRINT N'Creating [security].[FK_Operations_To_Permissions_On_Permissions]...';


GO
ALTER TABLE [security].[ApplicationOperations_To_ApplicationPermissions] WITH NOCHECK
    ADD CONSTRAINT [FK_Operations_To_Permissions_On_Permissions] FOREIGN KEY ([Operations]) REFERENCES [security].[ApplicationOperations] ([Id]);


GO
PRINT N'Creating [security].[FK_Users_To_Permissions_On_Permissions]...';


GO
ALTER TABLE [security].[ApplicationPermissions_To_ApplicationUsers] WITH NOCHECK
    ADD CONSTRAINT [FK_Users_To_Permissions_On_Permissions] FOREIGN KEY ([Users]) REFERENCES [security].[ApplicationUsers] ([UserName]);


GO
PRINT N'Creating [security].[FK_ApplicationPermissions_To_ApplicationUsers_On_Users]...';


GO
ALTER TABLE [security].[ApplicationPermissions_To_ApplicationUsers] WITH NOCHECK
    ADD CONSTRAINT [FK_ApplicationPermissions_To_ApplicationUsers_On_Users] FOREIGN KEY ([Permissions]) REFERENCES [security].[ApplicationPermissions] ([Id]);


GO
PRINT N'Creating [security].[FK_Roles_To_Permissions_On_Permissions]...';


GO
ALTER TABLE [security].[ApplicationPermissions_To_ApplicationRoles] WITH NOCHECK
    ADD CONSTRAINT [FK_Roles_To_Permissions_On_Permissions] FOREIGN KEY ([Roles]) REFERENCES [security].[ApplicationRoles] ([Id]);


GO
PRINT N'Creating [security].[FK_ApplicationPermissions_To_ApplicationRoles_On_Roles]...';


GO
ALTER TABLE [security].[ApplicationPermissions_To_ApplicationRoles] WITH NOCHECK
    ADD CONSTRAINT [FK_ApplicationPermissions_To_ApplicationRoles_On_Roles] FOREIGN KEY ([Permissions]) REFERENCES [security].[ApplicationPermissions] ([Id]);


GO
PRINT N'Creating [security].[FK_ApplicationUsers_To_ApplicationRoles_On_Roles]...';


GO
ALTER TABLE [security].[ApplicationRoles_To_ApplicationUsers] WITH NOCHECK
    ADD CONSTRAINT [FK_ApplicationUsers_To_ApplicationRoles_On_Roles] FOREIGN KEY ([Users]) REFERENCES [security].[ApplicationUsers] ([UserName]);


GO
PRINT N'Creating [security].[FK_ApplicationRoles_To_ApplicationUsers_On_Users]...';


GO
ALTER TABLE [security].[ApplicationRoles_To_ApplicationUsers] WITH NOCHECK
    ADD CONSTRAINT [FK_ApplicationRoles_To_ApplicationUsers_On_Users] FOREIGN KEY ([Roles]) REFERENCES [security].[ApplicationRoles] ([Id]);


GO
PRINT N'Creating [security].[FK_ApplicationUsers_To_Profiles_On_Profile]...';


GO
ALTER TABLE [security].[ApplicationUsers] WITH NOCHECK
    ADD CONSTRAINT [FK_ApplicationUsers_To_Profiles_On_Profile] FOREIGN KEY ([Profile]) REFERENCES [security].[Profiles] ([Id]);


GO
PRINT N'Creating [security].[FK_ApplicationUsers_To_ApplicationUserClaims_On_Claims]...';


GO
ALTER TABLE [security].[ApplicationUserClaims] WITH NOCHECK
    ADD CONSTRAINT [FK_ApplicationUsers_To_ApplicationUserClaims_On_Claims] FOREIGN KEY ([User]) REFERENCES [security].[ApplicationUsers] ([UserName]);


GO
PRINT N'Creating [security].[FK_ApplicationUsers_To_ApplicationUserLogins_On_Logins]...';


GO
ALTER TABLE [security].[ApplicationUserLogins] WITH NOCHECK
    ADD CONSTRAINT [FK_ApplicationUsers_To_ApplicationUserLogins_On_Logins] FOREIGN KEY ([User]) REFERENCES [security].[ApplicationUsers] ([UserName]);


GO
PRINT N'Creating [security].[FK_ApplicationLanguages_ApplicationLanguage]...';


GO
ALTER TABLE [security].[DateTimeFormats] WITH NOCHECK
    ADD CONSTRAINT [FK_ApplicationLanguages_ApplicationLanguage] FOREIGN KEY ([ApplicationLanguage]) REFERENCES [security].[ApplicationLanguages] ([Id]);


GO
PRINT N'Creating [security].[FK_Profiles_To_ProfileSettings_On_Settings]...';


GO
ALTER TABLE [security].[ProfileSettings] WITH NOCHECK
    ADD CONSTRAINT [FK_Profiles_To_ProfileSettings_On_Settings] FOREIGN KEY ([ParentProfile]) REFERENCES [security].[Profiles] ([Id]);


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
PRINT N'Creating [dbo].[FK_SectorTypes_To_Actors_On_Actor]...';


GO
ALTER TABLE [dbo].[Actors_To_SectorTypes] WITH NOCHECK
    ADD CONSTRAINT [FK_SectorTypes_To_Actors_On_Actor] FOREIGN KEY ([SectorTypes]) REFERENCES [dbo].[ValueTypes] ([Id]);


GO
PRINT N'Creating [dbo].[FK_Actors_To_SectorTypes_On_SectorTypes]...';


GO
ALTER TABLE [dbo].[Actors_To_SectorTypes] WITH NOCHECK
    ADD CONSTRAINT [FK_Actors_To_SectorTypes_On_SectorTypes] FOREIGN KEY ([Actor]) REFERENCES [dbo].[Actors] ([Id]);


GO
PRINT N'Creating [dbo].[FK_Addresses_To_Countries_On_Country]...';


GO
ALTER TABLE [dbo].[Addresses] WITH NOCHECK
    ADD CONSTRAINT [FK_Addresses_To_Countries_On_Country] FOREIGN KEY ([Country]) REFERENCES [dbo].[Countries] ([Id]);


GO
PRINT N'Creating [dbo].[FK_CircularEconomyReports_To_SectorTypes_On_DesiredSMESector]...';


GO
ALTER TABLE [dbo].[CircularEconomyReports] WITH NOCHECK
    ADD CONSTRAINT [FK_CircularEconomyReports_To_SectorTypes_On_DesiredSMESector] FOREIGN KEY ([DesiredSMESector]) REFERENCES [dbo].[ValueTypes] ([Id]);


GO
PRINT N'Creating [dbo].[FK_Actors_To_ContactInfos_On_ContactInfos]...';


GO
ALTER TABLE [dbo].[ContactInfos] WITH NOCHECK
    ADD CONSTRAINT [FK_Actors_To_ContactInfos_On_ContactInfos] FOREIGN KEY ([Actor_ContactInfos]) REFERENCES [dbo].[Actors] ([Id]);


GO
PRINT N'Creating [dbo].[FK_C098B3C4]...';


GO
ALTER TABLE [dbo].[DigicircUsers] WITH NOCHECK
    ADD CONSTRAINT [FK_C098B3C4] FOREIGN KEY ([UserName]) REFERENCES [security].[ApplicationUsers] ([UserName]);


GO
PRINT N'Creating [dbo].[FK_CircularEconomyProviderReports_To_GeographicalAreas_On_PlaceOperates]...';


GO
ALTER TABLE [dbo].[GeographicalAreas] WITH NOCHECK
    ADD CONSTRAINT [FK_CircularEconomyProviderReports_To_GeographicalAreas_On_PlaceOperates] FOREIGN KEY ([CircularEconomyProviderReport_PlaceOperates]) REFERENCES [dbo].[CircularEconomyProviderReports] ([Id]);


GO
PRINT N'Creating [dbo].[FK_CircularEconomyReports_To_GeographicalAreas_On_DesiredGeographicalArea]...';


GO
ALTER TABLE [dbo].[GeographicalAreas] WITH NOCHECK
    ADD CONSTRAINT [FK_CircularEconomyReports_To_GeographicalAreas_On_DesiredGeographicalArea] FOREIGN KEY ([CircularEconomyInformation_DesiredGeographicalArea]) REFERENCES [dbo].[CircularEconomyReports] ([Id]);


GO
PRINT N'Creating [dbo].[FK_9FF6E37]...';


GO
ALTER TABLE [dbo].[ThematicExpertises_To_CircularEconomyReports] WITH NOCHECK
    ADD CONSTRAINT [FK_9FF6E37] FOREIGN KEY ([DesiredThematicExpertises]) REFERENCES [dbo].[ValueTypes] ([Id]);


GO
PRINT N'Creating [dbo].[FK_CircularEconomyReports_To_ThematicExpertises_On_DesiredThematicExpertises]...';


GO
ALTER TABLE [dbo].[ThematicExpertises_To_CircularEconomyReports] WITH NOCHECK
    ADD CONSTRAINT [FK_CircularEconomyReports_To_ThematicExpertises_On_DesiredThematicExpertises] FOREIGN KEY ([CircularEconomyInformation_DesiredThematicExpertises]) REFERENCES [dbo].[CircularEconomyReports] ([Id]);


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
ALTER TABLE [audit].[AuditPropertyConfigurations] WITH CHECK CHECK CONSTRAINT [FK_AuditPropertyConfigurations_Properties];

ALTER TABLE [security].[ApplicationClients] WITH CHECK CHECK CONSTRAINT [FK_ApplicationUsers_To_ApplicationClients_On_Clients];

ALTER TABLE [security].[ApplicationOperations_To_ApplicationPermissions] WITH CHECK CHECK CONSTRAINT [FK_ApplicationOperations_On_Operations];

ALTER TABLE [security].[ApplicationOperations_To_ApplicationPermissions] WITH CHECK CHECK CONSTRAINT [FK_Operations_To_Permissions_On_Permissions];

ALTER TABLE [security].[ApplicationPermissions_To_ApplicationUsers] WITH CHECK CHECK CONSTRAINT [FK_Users_To_Permissions_On_Permissions];

ALTER TABLE [security].[ApplicationPermissions_To_ApplicationUsers] WITH CHECK CHECK CONSTRAINT [FK_ApplicationPermissions_To_ApplicationUsers_On_Users];

ALTER TABLE [security].[ApplicationPermissions_To_ApplicationRoles] WITH CHECK CHECK CONSTRAINT [FK_Roles_To_Permissions_On_Permissions];

ALTER TABLE [security].[ApplicationPermissions_To_ApplicationRoles] WITH CHECK CHECK CONSTRAINT [FK_ApplicationPermissions_To_ApplicationRoles_On_Roles];

ALTER TABLE [security].[ApplicationRoles_To_ApplicationUsers] WITH CHECK CHECK CONSTRAINT [FK_ApplicationUsers_To_ApplicationRoles_On_Roles];

ALTER TABLE [security].[ApplicationRoles_To_ApplicationUsers] WITH CHECK CHECK CONSTRAINT [FK_ApplicationRoles_To_ApplicationUsers_On_Users];

ALTER TABLE [security].[ApplicationUsers] WITH CHECK CHECK CONSTRAINT [FK_ApplicationUsers_To_Profiles_On_Profile];

ALTER TABLE [security].[ApplicationUserClaims] WITH CHECK CHECK CONSTRAINT [FK_ApplicationUsers_To_ApplicationUserClaims_On_Claims];

ALTER TABLE [security].[ApplicationUserLogins] WITH CHECK CHECK CONSTRAINT [FK_ApplicationUsers_To_ApplicationUserLogins_On_Logins];

ALTER TABLE [security].[DateTimeFormats] WITH CHECK CHECK CONSTRAINT [FK_ApplicationLanguages_ApplicationLanguage];

ALTER TABLE [security].[ProfileSettings] WITH CHECK CHECK CONSTRAINT [FK_Profiles_To_ProfileSettings_On_Settings];

ALTER TABLE [dbo].[Actors] WITH CHECK CHECK CONSTRAINT [FK_Actors_To_Addresses_On_Address];

ALTER TABLE [dbo].[Actors] WITH CHECK CHECK CONSTRAINT [FK_Actors_To_DigicircUsers_On_AddedBy];

ALTER TABLE [dbo].[Actors] WITH CHECK CHECK CONSTRAINT [FK_Actors_To_EntityTypes_On_EntityType];

ALTER TABLE [dbo].[Actors] WITH CHECK CHECK CONSTRAINT [FK_Actors_To_CircularEconomyReports_On_CircularEconomyRequirements];

ALTER TABLE [dbo].[Actors] WITH CHECK CHECK CONSTRAINT [FK_Actors_To_CircularEconomyProviderReports_On_CircularEconomyProviderReport];

ALTER TABLE [dbo].[Actors_To_SectorTypes] WITH CHECK CHECK CONSTRAINT [FK_SectorTypes_To_Actors_On_Actor];

ALTER TABLE [dbo].[Actors_To_SectorTypes] WITH CHECK CHECK CONSTRAINT [FK_Actors_To_SectorTypes_On_SectorTypes];

ALTER TABLE [dbo].[Addresses] WITH CHECK CHECK CONSTRAINT [FK_Addresses_To_Countries_On_Country];

ALTER TABLE [dbo].[CircularEconomyReports] WITH CHECK CHECK CONSTRAINT [FK_CircularEconomyReports_To_SectorTypes_On_DesiredSMESector];

ALTER TABLE [dbo].[ContactInfos] WITH CHECK CHECK CONSTRAINT [FK_Actors_To_ContactInfos_On_ContactInfos];

ALTER TABLE [dbo].[DigicircUsers] WITH CHECK CHECK CONSTRAINT [FK_C098B3C4];

ALTER TABLE [dbo].[GeographicalAreas] WITH CHECK CHECK CONSTRAINT [FK_CircularEconomyProviderReports_To_GeographicalAreas_On_PlaceOperates];

ALTER TABLE [dbo].[GeographicalAreas] WITH CHECK CHECK CONSTRAINT [FK_CircularEconomyReports_To_GeographicalAreas_On_DesiredGeographicalArea];

ALTER TABLE [dbo].[ThematicExpertises_To_CircularEconomyReports] WITH CHECK CHECK CONSTRAINT [FK_9FF6E37];

ALTER TABLE [dbo].[ThematicExpertises_To_CircularEconomyReports] WITH CHECK CHECK CONSTRAINT [FK_CircularEconomyReports_To_ThematicExpertises_On_DesiredThematicExpertises];

ALTER TABLE [dbo].[ValueTypes] WITH CHECK CHECK CONSTRAINT [FK_CircularEconomyProviderReports_To_Expertises_On_Expertises];

ALTER TABLE [dbo].[ValueTypes] WITH CHECK CHECK CONSTRAINT [FK_CircularEconomyProviderReports_To_ServicesTbl_On_ServicesProvided];

ALTER TABLE [dbo].[ValueTypes] WITH CHECK CHECK CONSTRAINT [FK_CircularEconomyProviderReports_To_ThematicExpertises_On_ThematicExpertises];


GO
PRINT N'Update complete.';


GO
