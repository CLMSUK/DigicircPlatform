


GO
PRINT N'Creating [wf].[QueryGeocoderContexts]...';


GO
CREATE TABLE [wf].[QueryGeocoderContexts] (
    [Id] UNIQUEIDENTIFIER NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [wf].[FK_51AA84FF]...';


GO
ALTER TABLE [wf].[QueryGeocoderContexts] WITH NOCHECK
    ADD CONSTRAINT [FK_51AA84FF] FOREIGN KEY ([Id]) REFERENCES [wf].[WorkflowContextBases] ([Id]);


GO
PRINT N'Checking existing data against newly created constraints';


GO



GO
ALTER TABLE [wf].[QueryGeocoderContexts] WITH CHECK CHECK CONSTRAINT [FK_51AA84FF];


GO
PRINT N'Update complete.';


GO
