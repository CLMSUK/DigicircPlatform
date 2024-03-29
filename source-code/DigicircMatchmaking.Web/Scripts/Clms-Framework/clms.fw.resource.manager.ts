namespace Joove {
    
    export class ResourcesManager {
        resources: any;
        partialViewResources: any;

        constructor() {
            this.partialViewResources = {};
            this.resources = null;
        }

        init(): void {
            try {
                this.resources = new DOMParser()
                    .parseFromString(this.prepareXmlString(window.resourcesXmlSerialized), "text/xml")
                    .documentElement;

                if (window.partialViewResources != null) {
                    for (let pv in window.partialViewResources) {
                        if (!this.partialViewResources.hasOwnProperty(pv)) {
                            this.partialViewResources[pv] = new DOMParser()
                                .parseFromString(this.prepareXmlString(window.partialViewResources[pv]), "text/xml")
                                .documentElement;
                        }
                    }
                }
            } catch (x) {
                console.error(`Could not load Resources: ${x.message}`);
            }

            document.title = this.getPageTitle();
        }

        prepareXmlString(str: string): string {
            str = Common.replaceAll(str, "&gt;", ">");
            str = Common.replaceAll(str, "&lt;", "<");
            return Common.replaceAll(str, "&quot;", "\"");
        }

        getResource(key: string, resourceOwner?: any): string {
            try {
                return (resourceOwner || this.resources)
                    .querySelector(`[Key='${key}']`)
                    .getAttribute("Value");
            } catch (x) {
                console.warn(`Could not get resource '${key}': ${x.message}`);
                return "";
            }
        }

        getGlobalResource(key: string): string {
            return this.getResource(`GLOBAL_${key}`);
        }

        getLocalResource(key: string, fromMaster?: boolean, partialViewName?: string): string {
            if (fromMaster) {
                key = `MASTER_${key}`;
            }

            let resourceOwner = null;
            if (!Common.stringIsNullOrEmpty(partialViewName)) {
                resourceOwner = this.partialViewResources[partialViewName];
            }

            return this.getResource(key, resourceOwner);
        }

        getPageTitle(): string {
            return this.getLocalResource(`RES_PAGETITLE_${window._context.currentAction}`) +
                " | " +
                this.getGlobalResource("RES_SITE_ApplicationTitle");
        }

        /* Control Specific */
        getListResources() {
            return {
                NextPage: this.getGlobalResource("RES_LIST_PAGER_NextPage"),
                PreviousPage: this.getGlobalResource("RES_LIST_PAGER_PreviousPage"),
                Ok: this.getGlobalResource("RES_LIST_VIEWS_Ok"),
                Cancel: this.getGlobalResource("RES_LIST_VIEWS_Cancel"),
                AddFilter: this.getGlobalResource("RES_LIST_FILTERS_AddFilter"),
                FiltersPopUpTitle: this.getGlobalResource("RES_LIST_FILTERS_DialogTitle"),
                NoFiltersDefined: this.getGlobalResource("RES_LIST_FILTERS_NoFilterDefined"),
                Column: this.getGlobalResource("RES_LIST_FILTERS_Column_Header"),
                Operator: this.getGlobalResource("RES_LIST_FILTERS_Operators_Header"),
                Criteria: this.getGlobalResource("RES_LIST_FILTERS_FilterValue_Header"),
                RowOperator: this.getGlobalResource("RES_LIST_FILTERS_RowOperator_Header"),
                Or: this.getGlobalResource("RES_LIST_FILTERS_RowOperatorTypes_Or"),
                And: this.getGlobalResource("RES_LIST_FILTERS_RowOperatorTypes_And"),
                Range: this.getGlobalResource("RES_LIST_FILTERS_Operators_Range"),
                EqualTo: this.getGlobalResource("RES_LIST_FILTERS_Operators_EqualTo"),
                Like: this.getGlobalResource("RES_LIST_FILTERS_Operators_Like"),
                NotEqualTo: this.getGlobalResource("RES_LIST_FILTERS_Operators_NotEqualTo"),
                GreaterThan: this.getGlobalResource("RES_LIST_FILTERS_Operators_GreaterThan"),
                GreaterThanOrEqualTo: this.getGlobalResource("RES_LIST_FILTERS_Operators_GreaterThanOrEqualTo"),
                LessThan: this.getGlobalResource("RES_LIST_FILTERS_Operators_LessThan"),
                LessThanOrEqualTo: this.getGlobalResource("RES_LIST_FILTERS_Operators_LessThanOrEqualTo"),
                Order: this.getGlobalResource("RES_LIST_PREFERENCES_Order"),
                Visible: this.getGlobalResource("RES_LIST_PREFERENCES_Visible"),
                Sorting: this.getGlobalResource("RES_LIST_PREFERENCES_Sorting"),
                SortOrder: this.getGlobalResource("RES_LIST_PREFERENCES_SortOrder"),
                PreferencesPopUpTitle: this.getGlobalResource("RES_LIST_PREFERENCES_DialogTitle"),
                Rearrange: this.getGlobalResource("RES_LIST_PREFERENCES_Rearrange"),
                Search: this.getGlobalResource("RES_LIST_TOOLBAR_Search"),
                ShowQuickFilters: this.getGlobalResource("RES_LIST_TOOLBAR_ShowQuickFilters"),
                HideQuickFilters: this.getGlobalResource("RES_LIST_TOOLBAR_HideQuickFilters"),
                Of: this.getGlobalResource("RES_LIST_PAGER_Of"),
                Items: this.getGlobalResource("RES_LIST_PAGER_Items"),
                PerPage: this.getGlobalResource("RES_LIST_PAGER_PerPage"),
                Pages: this.getGlobalResource("RES_LIST_PAGE_Pages"),
                PredefinedView: this.getGlobalResource("RES_LIST_TOOLBAR_PredefinedView"),
                ResetTooltip: this.getGlobalResource("RES_LIST_TOOLBAR_RefreshResetButtonTooltip"),
                ResetConfirmation: this.getGlobalResource("RES_LIST_TOOLBAR_ResetConfrmation"),
                RefreshTooltip: this.getGlobalResource("RES_LIST_TOOLBAR_RefreshButtonTooltip"),
                PreferencesTooltip: this.getGlobalResource("RES_LIST_TOOLBAR_PreferencesButtonTooltip"),
                FiltersTooltip: this.getGlobalResource("RES_LIST_TOOLBAR_FilterButtonTooltip"),
                SaveCurrentView: this.getGlobalResource("RES_LIST_VIEWS_Save"),
                OverwriteCurrentView: this.getGlobalResource("RES_LIST_VIEWS_Overwrite"),
                DeleteCurrentView: this.getGlobalResource("RES_LIST_VIEWS_Remove"),
                DeleteCurrentViewCommand: this.getGlobalResource("RES_LIST_VIEWS_Delete"),
                DeleteCurrentViewConfirmation: this.getGlobalResource("RES_LIST_VIEWS_RemovePrompt"),
                SaveCurrentViewNameAlert: this.getGlobalResource("RES_LIST_VIEWS_NameAlert"),
                ViewName: this.getGlobalResource("RES_LIST_VIEWS_Name"),
                IsDefault: this.getGlobalResource("RES_LIST_VIEWS_IsDefault"),
                MakeDefault: this.getGlobalResource("RES_LIST_VIEWS_MakeDefault"),
                MakeDefaultConfirmation: this.getGlobalResource("RES_LIST_VIEWS_MakeDefaultConfirmation"),
                PrevPageTooltip: this.getGlobalResource("RES_LIST_PAGER_PreviousPage"),
                NextPageTooltip: this.getGlobalResource("RES_LIST_PAGER_NextPage"),
                NoResults: this.getGlobalResource("RES_LISTFORM_NORESULTS_NoResults"),
                Ascending: this.getGlobalResource("RES_LIST_PREFERENCES_SortingType_ASC"),
                Descending: this.getGlobalResource("RES_LIST_PREFERENCES_SortingType_DESC"),
                FiltersApplied: this.getGlobalResource("RES_LISTFORM_FiltersApplied"),
                GrandTotal: this.getGlobalResource("RES_LIST_AGGREGATORS_GrandTotal"),
                PageTotal: this.getGlobalResource("RES_LIST_AGGREGATORS_PageTotal"),
                GrandAverage: this.getGlobalResource("RES_LIST_AGGREGATORS_GrandAverage"),
                PageAverage: this.getGlobalResource("RES_LIST_AGGREGATORS_PageAverage"),
                GrandCount: this.getGlobalResource("RES_LIST_AGGREGATORS_GrandCount"),
                PageCount: this.getGlobalResource("RES_LIST_AGGREGATORS_PageCount"),
                GroupingOrder: this.getGlobalResource("RES_LIST_TOOLBAR_GroupingOrder"),
                Page: this.getGlobalResource("RES_LIST_TOOLBAR_Page"),
                Export: this.getGlobalResource("RES_LIST_EXPORT_ExportOK"),
                MoveColumnLeft: this.getGlobalResource("RES_LIST_MoveColumnLeft_Tooltip"),
                MoveColumnRight: this.getGlobalResource("RES_LIST_MoveColumnRight_Tooltip"),
                SortASC: this.getGlobalResource("RES_LIST_SortASC_Tooltip"),
                SortDESC: this.getGlobalResource("RES_LIST_SortDESC_Tooltip"),
                Unsort: this.getGlobalResource("RES_LIST_UnSort_Tooltip"),
                FirstPageTooltip: this.getGlobalResource("RES_LIST_PAGER_FirstPage"),
                LastPageTooltip: this.getGlobalResource("RES_LIST_PAGER_LastPage"),
                HasNoValue: this.getGlobalResource("RES_LIST_FILTERS_Operators_HasNoValue"),
                HasValue: this.getGlobalResource("RES_LIST_FILTERS_Operators_HasValue"),
                CalculateCount: this.getGlobalResource("RES_LIST_AGGREGATORS_CalculateCount"),
                CalculateSum: this.getGlobalResource("RES_LIST_AGGREGATORS_CalculateSum"),
                CalculateAverage: this.getGlobalResource("RES_LIST_AGGREGATORS_CalculateAverage"),
                CommonActions: this.getGlobalResource("RES_LIST_TOOLBAR_CommonActions"),
                True: this.getGlobalResource("RES_LIST_FILTERS_True"),
                False: this.getGlobalResource("RES_LIST_FILTERS_False"),
                Apply: this.getGlobalResource("RES_LIST_FILTERS_Apply"),
                ClearAll: this.getGlobalResource("RES_LIST_FILTERS_ClearAll"),
                ApplyQuickFilter: this.getGlobalResource("RES_LIST_FILTERS_ApplyQuickFilter"),
                ClearQuickFilter: this.getGlobalResource("RES_LIST_FILTERS_ClearQuickFilter"),
                ExportType: this.getGlobalResource("RES_LIST_EXPORT_ExportTo"),
                ExportRange: this.getGlobalResource("RES_LIST_EXPORT_PrintRange"),
                ExportRangeCurrent: this.getGlobalResource("RES_LIST_EXPORT_ExportRange_CurrentPage"),
                ExportRange100: this.getGlobalResource("RES_LIST_EXPORT_ExportRange_Top100Pages"),
                ExportRangeAll: this.getGlobalResource("RES_LIST_EXPORT_ExportRange_AllPages"),
                ExportOnlyGroups: this.getGlobalResource("RES_LIST_EXPORT_ExportOnlyGroups"),
                RequiredFiltersMissingMessage: this.getGlobalResource("RES_LIST_RequiredFiltersMissingMessage"),
                RequiredFiltersMissingTitle: this.getGlobalResource("RES_LIST_RequiredFiltersMissingTitle"),
                SubGroups: this.getGlobalResource("RES_LISTFORM_SubGroups"),
                VisibleExport: this.getGlobalResource("RES_LIST_EXPORT_Visible"),
                ColumnExport: this.getGlobalResource("RES_LIST_EXPORT_Column"),
                SumHeader: this.getGlobalResource("RES_LIST_EXPORT_SumHeader"),
                AverageHeader: this.getGlobalResource("RES_LIST_EXPORT_AverageHeader"),
                PortraitOrientation: this.getGlobalResource("RES_LIST_EXPORT_PortraitOrientation"),
                IncludeGridLines: this.getGlobalResource("RES_LIST_EXPORT_IncludeGridLines"),
                FileName: this.getGlobalResource("RES_LIST_EXPORT_FileName"),
                DisplayColumns: this.getGlobalResource("RES_LIST_EXPORT_DisplayColumns"),
                HeaderColor: this.getGlobalResource("RES_LIST_EXPORT_HeaderColor"),
                OddColor: this.getGlobalResource("RES_LIST_EXPORT_OddColor"),
                EvenColor: this.getGlobalResource("RES_LIST_EXPORT_EvenColor"),
                GroupColor: this.getGlobalResource("RES_LIST_EXPORT_GroupColor"),
                AggregateColor: this.getGlobalResource("RES_LIST_EXPORT_AggregateColor"),
                CountHeader: this.getGlobalResource("RES_LIST_EXPORT_CountHeader"),
                TotalNonGroupCount: this.getGlobalResource("RES_LIST_EXPORT_TotalNonGroupCount"),
                GetGroupsClosed: this.getGlobalResource("RES_LISTFORM_GetGroupsClosed"),
                PrevStateTooltip: this.getGlobalResource("RES_LISTFORM_PrevStateTooltip"),
                DisplayGroupItems: this.getGlobalResource("RES_LISTFORM_DisplayGroupItems"),
                ClearAggregators: this.getGlobalResource("RES_LIST_AGGREGATORS_ClearAll"),
                DownloadCsv: this.getGlobalResource("RES_LIST_Import_DownloadCsv"),
                UploadCsv: this.getGlobalResource("RES_LIST_Import_UploadCsv"),
                Import: this.getGlobalResource("RES_LIST_Import_Import"),
                PreferedEncoding: this.getGlobalResource("RES_LIST_Import_PreferedEncoding"),
                ImportResults: this.getGlobalResource("RES_LIST_Import_ImportResults"),
                ImportedRecords: this.getGlobalResource("RES_LIST_Import_ImportedRecords"),
                FailedRecords: this.getGlobalResource("RES_LIST_Import_FailedRecords"),
                ErrorDetails: this.getGlobalResource("RES_LIST_Import_ErrorDetails"),
                RowNumber: this.getGlobalResource("RES_LIST_Import_RowNumber"),
                ErrorDescription: this.getGlobalResource("RES_LIST_Import_ErrorDescription"),
                ErrorMessage: this.getGlobalResource("RES_LIST_Import_ErrorMessage"),
                SelectAllRecordsPromptText: this.getGlobalResource("RES_LIST_FILTERS_SelectAll"),
                SelectAllPageRecordsText: this.getGlobalResource("RES_LIST_SelectAllCheckBox_Tooltip"),
                DeselectAllRecordsPromptText: this.getGlobalResource("RES_LIST_DeselectAllRecordsPromptText"),
                DeselectAllPageRecordsText: this.getGlobalResource("RES_LIST_DeselectAllPageRecordsText")
            }
        }

        getDataListResources() {
            return {
                Ok: this.getGlobalResource("RES_DATALIST_FILTERS_Ok"),
                Cancel: this.getGlobalResource("RES_DATALIST_FILTERS_Cancel"),
                ClearAll: this.getGlobalResource("RES_DATALIST_FILTERS_ClearAll"),
                RequiredFiltersMissingMessage: this.getGlobalResource("RES_DATALIST_FILTERS_RequiredFiltersMissingMessage"),
                AddFilter: this.getGlobalResource("RES_DATALIST_FILTERS_AddFilter"),
                FiltersPopUpTitle: this.getGlobalResource("RES_DATALIST_FILTERS_DialogTitle"),
                Operator: this.getGlobalResource("RES_DATALIST_FILTERS_Operators_Header"),
                Criteria: this.getGlobalResource("RES_DATALIST_FILTERS_FilterValue_Header"),
                RowOperator: this.getGlobalResource("RES_DATALIST_FILTERS_RowOperator_Header"),
                Or: this.getGlobalResource("RES_DATALIST_FILTERS_RowOperatorTypes_Or"),
                And: this.getGlobalResource("RES_DATALIST_FILTERS_RowOperatorTypes_And"),
                HasNoValue: this.getGlobalResource("RES_DATALIST_FILTERS_Operators_HasNoValue"),
                HasValue: this.getGlobalResource("RES_DATALIST_FILTERS_Operators_HasValue"),
                Range: this.getGlobalResource("RES_DATALIST_FILTERS_Operators_Range"),
                EqualTo: this.getGlobalResource("RES_DATALIST_FILTERS_Operators_EqualTo"),
                Like: this.getGlobalResource("RES_DATALIST_FILTERS_Operators_Like"),
                NotEqualTo: this.getGlobalResource("RES_DATALIST_FILTERS_Operators_NotEqualTo"),
                GreaterThan: this.getGlobalResource("RES_DATALIST_FILTERS_Operators_GreaterThan"),
                GreaterThanOrEqualTo: this.getGlobalResource("RES_DATALIST_FILTERS_Operators_GreaterThanOrEqualTo"),
                LessThan: this.getGlobalResource("RES_DATALIST_FILTERS_Operators_LessThan"),
                LessThanOrEqualTo: this.getGlobalResource("RES_DATALIST_FILTERS_Operators_LessThanOrEqualTo"),
                CountHeader: this.getGlobalResource("RES_DATALIST_EXPORT_CountHeader"),
                VisibleExport: this.getGlobalResource("RES_DATALIST_EXPORT_Visible"),
                ColumnExport: this.getGlobalResource("RES_DATALIST_EXPORT_Column"),
                SumHeader: this.getGlobalResource("RES_DATALIST_EXPORT_SumHeader"),
                AverageHeader: this.getGlobalResource("RES_DATALIST_EXPORT_AverageHeader"),
                Export: this.getGlobalResource("RES_DATALIST_EXPORT_ExportOK"),
                HeaderColor: this.getGlobalResource("RES_DATALIST_EXPORT_HeaderColor"),
                OddColor: this.getGlobalResource("RES_DATALIST_EXPORT_OddColor"),
                EvenColor: this.getGlobalResource("RES_DATALIST_EXPORT_EvenColor"),
                GroupColor: this.getGlobalResource("RES_DATALIST_EXPORT_GroupColor"),
                AggregateColor: this.getGlobalResource("RES_DATALIST_EXPORT_AggregateColor"),
                DisplayColumns: this.getGlobalResource("RES_DATALIST_EXPORT_DisplayColumns"),
                TotalNonGroupCount: this.getGlobalResource("RES_DATALIST_EXPORT_TotalNonGroupCount"),
                Search: this.getGlobalResource("RES_DATALIST_Search"),
                PortraitOrientation: this.getGlobalResource("RES_DATALIST_EXPORT_PortraitOrientation"),
                IncludeGridLines: this.getGlobalResource("RES_DATALIST_EXPORT_IncludeGridLines"),
                FileName: this.getGlobalResource("RES_DATALIST_EXPORT_FileName"),
                NoResults: this.getGlobalResource("RES_DATALIST_NoResults"),
                Info: this.getGlobalResource("RES_DATALIST_Info"),
                PageSize: this.getGlobalResource("RES_DATALIST_PageSize"),
                Records: this.getGlobalResource("RES_DATALIST_Records"),
                Refresh: this.getGlobalResource("RES_DATALIST_Refresh"),
                Reset: this.getGlobalResource("RES_DATALIST_Reset"),
                All: this.getGlobalResource("RES_DATALIST_All"),
                Loading: this.getGlobalResource("RES_DATALIST_Loading"),
                Processing: this.getGlobalResource("RES_DATALIST_Processing"),
                First: this.getGlobalResource("RES_DATALIST_PAGER_First"),
                Last: this.getGlobalResource("RES_DATALIST_PAGER_Last"),
                Next: this.getGlobalResource("RES_DATALIST_PAGER_Next"),
                Previous: this.getGlobalResource("RES_DATALIST_PAGER_Previous"),
                True: this.getGlobalResource("RES_DATALIST_FILTERS_True"),
                False: this.getGlobalResource("RES_DATALIST_FILTERS_False"),
                CalculateCount: this.getGlobalResource("RES_DATALIST_AGGREGATORS_CalculateCount"),
                CalculateSum: this.getGlobalResource("RES_DATALIST_AGGREGATORS_CalculateSum"),
                CalculateAverage: this.getGlobalResource("RES_DATALIST_AGGREGATORS_CalculateAverage"),
                ColumnVisibility: this.getGlobalResource("RES_DATALIST_BUTTONS_ColumnVisibility"),
                Copy: this.getGlobalResource("RES_DATALIST_BUTTONS_Copy"),
                CopyTitle: this.getGlobalResource("RES_DATALIST_BUTTONS_CopyTitle"),
                CopySuccessSingle: this.getGlobalResource("RES_DATALIST_BUTTONS_CopySuccessSingle"),
                CopySuccessMulti: this.getGlobalResource("RES_DATALIST_BUTTONS_CopySuccessMulti"),
                GrandTotal: this.getGlobalResource("RES_DATALIST_AGGREGATORS_GrandTotal"),
                PageTotal: this.getGlobalResource("RES_DATALIST_AGGREGATORS_PageTotal"),
                GrandAverage: this.getGlobalResource("RES_DATALIST_AGGREGATORS_GrandAverage"),
                PageAverage: this.getGlobalResource("RES_DATALIST_AGGREGATORS_PageAverage"),
                GrandCount: this.getGlobalResource("RES_DATALIST_AGGREGATORS_GrandCount"),
                PageCount: this.getGlobalResource("RES_DATALIST_AGGREGATORS_PageCount"),
                SelectAllRecordsText: this.getGlobalResource("RES_DATALIST_SelectAllRecordsText"),
                DeselectAllRecordsText: this.getGlobalResource("RES_DATALIST_DeselectAllRecordsText"),
                SelectAllPageRecordsText: this.getGlobalResource("RES_DATALIST_SelectAllPageRecordsText"),
                DeselectAllPageRecordsText: this.getGlobalResource("RES_DATALIST_DeselectAllPageRecordsText"),
                ExportType: this.getGlobalResource("RES_DATALIST_EXPORT_ExportTo"),
                ExportRange: this.getGlobalResource("RES_DATALIST_EXPORT_PrintRange"),
                ExportRangeCurrent: this.getGlobalResource("RES_DATALIST_EXPORT_ExportRange_CurrentPage"),
                ExportRange100: this.getGlobalResource("RES_DATALIST_EXPORT_ExportRange_Top100Pages"),
                ExportRangeAll: this.getGlobalResource("RES_DATALIST_EXPORT_ExportRange_AllPages"),
                ExportOnlyGroups: this.getGlobalResource("RES_DATALIST_EXPORT_ExportOnlyGroups"),
                OneRowSelected: this.getGlobalResource("RES_DATALIST_OneRowSelected"),
                MulitpleRowsSelected: this.getGlobalResource("RES_DATALIST_MulitpleRowsSelected"),
                DialogOkButton: this.getDefaultOkText(),
                DialogCancelButton: this.getDefaultCancelText(),
                Grouping: this.getGlobalResource("RES_DATALIST_Grouping"),
                Column: this.getGlobalResource("RES_DATALIST_Column"),
                GroupingOrder: this.getGlobalResource("RES_DATALIST_GroupingOrder"),
                GetGroupsClosed: this.getGlobalResource("RES_DATALIST_GetGroupsClosed"),
                MergedGroupLevels: this.getGlobalResource("RES_DATALIST_MergedGroupLevels"),
                ViewName: this.getGlobalResource("RES_DATALIST_VIEWS_ViewName"),
                View: this.getGlobalResource("RES_DATALIST_VIEWS_View"),
                Views: this.getGlobalResource("RES_DATALIST_VIEWS_Views"),
                DeleteView: this.getGlobalResource("RES_DATALIST_VIEWS_DeleteView"),
                SaveView: this.getGlobalResource("RES_DATALIST_VIEWS_SaveView"),
                InvalidViewName: this.getGlobalResource("RES_DATALIST_VIEWS_InvalidViewName"),
                IsViewDefault: this.getGlobalResource("RES_DATALIST_VIEWS_IsViewDefault"),
                DeleteConfirmation: this.getGlobalResource("RES_DATALIST_VIEWS_DeleteConfirmation"),
                ActiveView: this.getGlobalResource("RES_DATALIST_VIEWS_ActiveView"),
                Import: this.getGlobalResource("RES_DATALIST_Import"),
                ImportDownload: this.getGlobalResource("RES_DATALIST_DownloadImportTemplate"),
                ImportUpload: this.getGlobalResource("RES_DATALIST_UploadImportFile"),
                ImportEncoding: this.getGlobalResource("RES_DATALIST_ImportDataEncoding"),
                ImportResult: this.getGlobalResource("RES_DATALIST_ImportResult"),
                ImportSuccess: this.getGlobalResource("RES_DATALIST_ImportResultSuccess"),
                ImportError: this.getGlobalResource("RES_DATALIST_ImportResultErrors"),
                ImportErrorList: this.getGlobalResource("RES_DATALIST_ImportResultErrorList"),
                ClearSearch: this.getGlobalResource("RES_DATALIST_ClearSearch"),
                QuickFilters: this.getGlobalResource("RES_DATALIST_QuickFilters"),
                Actions: this.getGlobalResource("RES_DATALIST_Actions"),
                SelectionActions: this.getGlobalResource("RES_DATALIST_SelectionActions"),
                MaxSelectedRowsLimitationTitle: this.getGlobalResource("RES_DATALIST_MaxSelectedRowsLimitationTitle"),
                MaxSelectedRowsLimitationMessage: this.getGlobalResource("RES_DATALIST_MaxSelectedRowsLimitationMessage"),           
                ExportTitle: this.getGlobalResource("RES_DATALIST_ExportTitle"),                  
            }
        }
        getFilterWidgetResource(): Widgets.IFilterDatasourceWidgetResource {
            return {
                ClearAll: this.getGlobalResource("RES_LIST_FILTERS_ClearAll"),
                AddFilter: this.getGlobalResource("RES_LIST_FILTERS_AddFilter"),
                FiltersPopUpTitle: this.getGlobalResource("RES_LIST_FILTERS_DialogTitle"),
                NoFiltersDefined: this.getGlobalResource("RES_LIST_FILTERS_NoFilterDefined"),
                Column: this.getGlobalResource("RES_LIST_FILTERS_Column_Header"),
                Operator: this.getGlobalResource("RES_LIST_FILTERS_Operators_Header"),
                Criteria: this.getGlobalResource("RES_LIST_FILTERS_FilterValue_Header"),
                RowOperator: this.getGlobalResource("RES_LIST_FILTERS_RowOperator_Header"),
                Or: this.getGlobalResource("RES_LIST_FILTERS_RowOperatorTypes_Or"),
                And: this.getGlobalResource("RES_LIST_FILTERS_RowOperatorTypes_And"),
                Range: this.getGlobalResource("RES_LIST_FILTERS_Operators_Range"),
                EqualTo: this.getGlobalResource("RES_LIST_FILTERS_Operators_EqualTo"),
                Like: this.getGlobalResource("RES_LIST_FILTERS_Operators_Like"),
                NotEqualTo: this.getGlobalResource("RES_LIST_FILTERS_Operators_NotEqualTo"),
                GreaterThan: this.getGlobalResource("RES_LIST_FILTERS_Operators_GreaterThan"),
                GreaterThanOrEqualTo: this.getGlobalResource("RES_LIST_FILTERS_Operators_GreaterThanOrEqualTo"),
                LessThan: this.getGlobalResource("RES_LIST_FILTERS_Operators_LessThan"),
                LessThanOrEqualTo: this.getGlobalResource("RES_LIST_FILTERS_Operators_LessThanOrEqualTo"),
                HasNoValue: this.getGlobalResource("RES_LIST_FILTERS_Operators_HasNoValue"),
                HasValue: this.getGlobalResource("RES_LIST_FILTERS_Operators_HasValue"),
                SelectAllRecordsPromptText: this.getGlobalResource("RES_LIST_FILTERS_SelectAll"),
                True: this.getGlobalResource("RES_LIST_FILTERS_True"),
                False: this.getGlobalResource("RES_LIST_FILTERS_False"),
                Apply: this.getGlobalResource("RES_LIST_FILTERS_Apply"),
                ApplyQuickFilter: this.getGlobalResource("RES_LIST_FILTERS_ApplyQuickFilter"),
                ClearQuickFilter: this.getGlobalResource("RES_LIST_FILTERS_ClearQuickFilter"),
                FiltersApplied: this.getGlobalResource("RES_LISTFORM_FiltersApplied"),
                ShowQuickFilters: this.getGlobalResource("RES_LIST_TOOLBAR_ShowQuickFilters"),
                HideQuickFilters: this.getGlobalResource("RES_LIST_TOOLBAR_HideQuickFilters")
            }
        }

        getChartResources(): Widgets.IChartResource {
            return $.extend(this.getFilterWidgetResource(), {
                Ok: this.getGlobalResource("RES_LIST_VIEWS_Ok"),
                Cancel: this.getGlobalResource("RES_LIST_VIEWS_Cancel"),
                QuickFilters: this.getGlobalResource("RES_WEBFORM_QuickFilters"),
                NoRecords: this.getGlobalResource("RES_WEBFORM_NoRecordsFound_MessageTitle"),
                PreferencesPopUpTitle: this.getGlobalResource("RES_LIST_PREFERENCES_DialogTitle")
            });

        }

        getComboBoxDefaultText($element: JQuery, fromMaster: boolean): string {
            const controlName = Core.getElementName($element);
            const partialViewName = $element.closest("[jb-type='PartialView']").attr("jb-partial-name");

            let defaultText = this
                .getLocalResource(`RES_COMBO_${controlName}_PROMPT`, fromMaster, partialViewName);

            if (defaultText == null) {
                defaultText = "Please select"; //todo: get global resource
            }

            return defaultText;
        }

        getEmptyRequiredFieldMessage(controlName: string, fromMaster: boolean, partialViewName?: string) {            
            var specialResource = this.getLocalResource(`RES_CONTROL_${controlName}_RequiredMessage`, fromMaster, partialViewName);

            return specialResource == null || specialResource.trim().length == 0
                ? `${this.getRequiredFieldsMissingText()} (${controlName})`
                : specialResource;            
        }

        getComboBoxManualValueDisplay(dataSetName: string,
            value: string,
            fromMaster: boolean,
            partialViewName:
            string) {
            return this.getLocalResource(`RES_${dataSetName}_VALUE_${value}`,
                fromMaster,
                partialViewName);
        }

        getRadioButtonManualValueDisplay(dataSetName: string,
            value: string,
            fromMaster: boolean,
            partialViewName:
                string) {
            return this.getLocalResource(`RES_${dataSetName}_VALUE_${value}`,
                fromMaster,
                partialViewName);
        }

        getComboBoxNoDataText($element: JQuery, fromMaster: boolean): string {
            const controlName = Core.getElementName($element);
            const partialViewName = $element.closest("[jb-type='PartialView']").attr("jb-partial-name");

            let noDataText = this.getLocalResource(`RES_COMBO_${controlName}_NODATA`, fromMaster, partialViewName);

            if (noDataText == null || noDataText.trim() === "") {
                noDataText = "No data!"; //todo: get global resource
            }

            return noDataText;
        }

        getDataListColumnCaption(elementId: string, columnName: string, isPickList?: boolean, partialViewName?: string, fromMaster?: boolean): string {
            //const partialViewName = $("div[jb-id='" + elementId + "'][jb-type='DataList']").closest("[jb-type='PartialView']").attr("jb-partial-name");
            if (columnName === "_key") {
                columnName = "key";
            }
            //TODO: Change RES_LIST to RES_DATALIST to completly separate Datalist from List
            //      This has to be changed also in the IDE. The resource keys are generated there...
            const prefix = isPickList ? "PICKLIST" : "LIST";
            return this.getLocalResource("RES_" + prefix + "_" + elementId + "_COLUMN_" + columnName, fromMaster, partialViewName);
        }
        getListColumnCaption($element: JQuery, columnName: string, isPickList: boolean, fromMaster?: boolean): string {

            const controlName = Core.getElementName($element);
            const partialViewName = $element.closest("[jb-type='PartialView']").attr("jb-partial-name");

            if (columnName === "_key") {
                columnName = "key";
            }
            
            const prefix = isPickList ? "RES_PICKLIST_" : "RES_LIST_";
            const name = isPickList ? controlName.replace("_PickList", "") : controlName;

            return this.getLocalResource(prefix + name + "_COLUMN_" + columnName, fromMaster, partialViewName);
        }

        getPickListModalTitle($element: JQuery, fromMaster: boolean): string {
            const controlName = Core.getElementName($element);
            const partialViewName = $element.closest("[jb-type='PartialView']").attr("jb-partial-name");

            return this.getLocalResource(`RES_PICKLIST_${controlName}_PAGETITLE`, fromMaster, partialViewName);
        }

        getDefaultOkText(): string {
            return this.getGlobalResource("RES_SITE_PREFS_OKButtonText");
        }

        getDefaultCancelText(): string {
            return this.getGlobalResource("RES_SITE_PREFS_CancelButtonText");
        }

        getNullValueText(): string {
            return this.getGlobalResource("RES_SITE_NullValue");
        }

        getRequiredFieldsMissingText(): string {
            return this.getGlobalResource("RES_WEBFORM_FIELD_RequiredMissingTitle");
        }

        getInvalidBindingFieldsText(): string {
            return this.getGlobalResource("RES_WEBFORM_FIELD_InvalidBindingsTitle");
        }

        getItemsRequireAttentionText(): string {
            return this.getGlobalResource("RES_WEBFORM_VALIDATIONS_RequireYourAttention");
        }

        getFileUploadTitle(): string {
            return this.getGlobalResource("RES_WEBFORM_FileUploadTitle");
        }

        getImageUploadTitle(): string {
            return this.getGlobalResource("RES_WEBFORM_ImageUploadTitle");
        }

        getFileUploadSuccess(): string {
            return this.getGlobalResource("RES_WEBFORM_FileUploadSuccess");
        }

        getFileUploadLoading(): string {
            return this.getGlobalResource("RES_WEBFORM_FileUploadLoading");
        }

        getFileUploadError(): string {
            return this.getGlobalResource("RES_WEBFORM_FileUploadError");
        }

        getFileNotFound(): string {
            return this.getGlobalResource("RES_WEBFORM_FileNotFound");
        }

        getLoadingMessage(): string {
            return this.getGlobalResource("RES_WEBFORM_LoadingMessage");
        }

        getButtonConfirmation(btnName: string, fromMaster: boolean, partialViewName?: string): string {
            return this.getLocalResource(`RES_BUTTON_${btnName}_ConfirmationMessage`, fromMaster, partialViewName);
        }
        getEventConfirmation(controlName: string, fromMaster: boolean, partialViewName?: string): string {              
            var resource = this.getLocalResource(`RES_${controlName}_ConfirmationMessage`, fromMaster, partialViewName);
            return resource == null || resource.trim() == ""
                ? this.getButtonConfirmation(controlName, fromMaster, partialViewName) // legacy
                : resource;
        }

        getPopupBlockedTitle(): string { 
            return this.getGlobalResource("RES_SITE_POPUP_BLOCKED_TITLE");
        }

        getPopupBlockedMessage(): string { 
            return this.getGlobalResource("RES_SITE_POPUP_BLOCKED_MESSAGE");
        }

        getPicklistClearConfirmation(): string {
            return this.getGlobalResource("RES_WEBFORM_Picklist_ClearAllConfirmation");
        }

        getSesionExpiredMessage(): string {
            return this.getGlobalResource("RES_SITE_SessionExpiredErrorMessage");
        }

        getSesionAboutToExpireMessage(): string {
            return this.getGlobalResource("RES_SITE_SessionRefreshMessage");
        }

        getSesionRefreshedMessage(): string {
            return this.getGlobalResource("RES_SITE_SessionRefreshedMessage");
        }        

        getTooLargeFileMessage(file: string, size: number, maxAllowed: number): string {
            var msg = this.getGlobalResource("RES_WEBFORM_Too_Large_File");
			
			if (msg == null || msg.trim() == "") {
                msg = "File [{FILE}] is too large";
            }

            const sizeInKb = size / 1024;
            const maxSizeInKb = maxAllowed / 1024;

            msg = msg.replace("{FILE}", file);
            msg = msg.replace("{SIZE}", sizeInKb.toFixed(1) + "");
            msg = msg.replace("{MAX}", maxSizeInKb.toFixed(1) + "");

            return msg;
        }
    }
}