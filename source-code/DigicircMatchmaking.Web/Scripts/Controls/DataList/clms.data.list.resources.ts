﻿namespace Joove.Widgets {

    //This interface is for autocomplete/validation purposes only
    export interface IDataListTextResources {
        Search?;
        NoResults?;
        Info?;
        PageSize?;
        Records?;
        All?;
        Loading?;
        Processing?;
        First?;
        Last?;
        Next?;
        Previous?;
        True?;
        False?;
        CalculateSum?;
        CalculateAverage?;
        CalculateCount?;
        ColumnVisibility?;
        Copy?;
        CopyTitle?;
        CopySuccessSingle?;
        CopySuccessMulti?;
        GrandTotal?: string;
        PageTotal?: string;
        GrandAverage?: string;
        PageAverage?: string;
        GrandCount?: string;
        PageCount?: string;
        SelectAllRecordsText?;
        DeselectAllRecordsText?;
        SelectAllPageRecordsText?;
        DeselectAllPageRecordsText?;
        ExportType?;
        ExportRange?;
        ExportRangeCurrent?;
        ExportRange100?;
        ExportRangeAll?;
        ExportOnlyGroups?;
        HeaderColor?;
        OddColor?;
        EvenColor?;
        GroupColor?;
        AggregateColor?;
        DisplayColumns?;
        TotalNonGroupCount?;
        PortraitOrientation?;
        IncludeGridLines?;
        FileName?;
        CountHeader?;
        VisibleExport?;
        ColumnExport?;
        SumHeader?;
        AverageHeader?;
        Export?;
        OneRowSelected?;
        MulitpleRowsSelected?;
        DialogOkButton?;
        DialogCancelButton?;
        Grouping?;
        Column?;
        GroupingOrder?;
        GetGroupsClosed?;
        MergedGroupLevels?;
        ViewName?;
        View?;
        Views?;
        DeleteView?;
        SaveView?;
        InvalidViewName?;
        IsViewDefault?;
        DeleteConfirmation?;
        QuickFilters?;
        Import?;
        ImportDownload?;
        ImportUpload?;
        ImportEncoding?;
        ImportResult?;
        ImportSuccess?;
        ImportError?;
        ImportErrorList?;
        ClearSearch?;
        MaxSelectedRowsLimitationTitle?;
        MaxSelectedRowsLimitationMessage?;
        Actions?;
        SelectionActions?;
        Refresh?;
        FiltersPopUpTitle?;
        ActiveView?;
        Reset?;
        ExportTitle?;
    }

    export class DataListControlResources {
        public readonly textResources: IDataListTextResources;
        public readonly dataTablesResources = {
            "decimal": "",
            "emptyTable": "No data available in table",
            "info": "Showing _START_ to _END_ of _TOTAL_ entries",
            "infoEmpty": "Showing 0 to 0 of 0 entries",
            "infoFiltered": "(filtered from _MAX_ total entries)",
            "infoPostFix": "",
            "thousands": ",",
            "lengthMenu": "Show _MENU_ entries",
            "loadingRecords": "Loading...",
            "processing": "Processing...",
            "search": "Search:",
            "zeroRecords": "No matching records found",
            "paginate": {
                "first": "First",
                "last": "Last",
                "next": "Next",
                "previous": "Previous"
            },
            "aria": {
                "sortAscending": ": activate to sort column ascending",
                "sortDescending": ": activate to sort column descending"
            },
            "buttons": {
                "colvis": "Column visibility",
                "copy": "Copy",
                "copyTitle": "Copy to clipboard",
                "copySuccess": {
                    1: "Copied one row to clipboard",
                    _: "Copied %d rows to clipboard"
                }
            },
            "select": {
                "rows": {
                    _: "%d rows selected",
                    0: "",
                    1: "1 row selected"
                }
            }
        };

        constructor(res) {
            this.textResources = res;

            //Set any defaults if some resources are missing
            this.textResources.DialogOkButton = res.DialogOkButton || "OK";
            //Overwrite the default datatables resources
            this.dataTablesResources.emptyTable = this.textResources.NoResults;
            this.dataTablesResources.info = this.textResources.Info;
            this.dataTablesResources.infoEmpty = "";
            this.dataTablesResources.lengthMenu = this.textResources.PageSize;
            this.dataTablesResources.loadingRecords = this.textResources.Loading;
            this.dataTablesResources.processing = this.textResources.Processing;
            this.dataTablesResources.search = "";
            this.dataTablesResources.paginate.first = this.textResources.First;
            this.dataTablesResources.paginate.last = this.textResources.Last;
            this.dataTablesResources.paginate.next = this.textResources.Next;
            this.dataTablesResources.paginate.previous = this.textResources.Previous;
            this.dataTablesResources.buttons.colvis = this.textResources.ColumnVisibility;
            this.dataTablesResources.buttons.copy = this.textResources.Copy;
            this.dataTablesResources.buttons.copyTitle = this.textResources.CopyTitle;
            this.dataTablesResources.buttons.copySuccess["1"] = this.textResources.CopySuccessSingle;
            this.dataTablesResources.buttons.copySuccess["_"] = this.textResources.CopySuccessMulti;
            this.dataTablesResources.select.rows["1"] = this.textResources.OneRowSelected;
            this.dataTablesResources.select.rows["_"] = this.textResources.MulitpleRowsSelected;
        }

        static icons = {
            remove: { bs: "glyphicon glyphicon-remove", fa: "fa fa-trash" },
            filter: { bs: "glyphicon glyphicon-filter", fa: "fa fa-filter" },
            search: { bs: "glyphicon glyphicon-search", fa: "fa fa-search" },
            aggregator: { bs: "glyphicon glyphicon-dashboard", fa: "fa fa-dashboard" },
            menuItem: { bs: "glyphicon glyphicon-circle-arrow-right", fa: "fa fa-circle" }
        }
    }
}