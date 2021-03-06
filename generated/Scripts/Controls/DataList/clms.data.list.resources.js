var Joove;
(function (Joove) {
    var Widgets;
    (function (Widgets) {
        var DataListControlResources = /** @class */ (function () {
            function DataListControlResources(res) {
                this.dataTablesResources = {
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
            DataListControlResources.icons = {
                remove: { bs: "glyphicon glyphicon-remove", fa: "fa fa-trash" },
                filter: { bs: "glyphicon glyphicon-filter", fa: "fa fa-filter" },
                search: { bs: "glyphicon glyphicon-search", fa: "fa fa-search" },
                aggregator: { bs: "glyphicon glyphicon-dashboard", fa: "fa fa-dashboard" },
                menuItem: { bs: "glyphicon glyphicon-circle-arrow-right", fa: "fa fa-circle" }
            };
            return DataListControlResources;
        }());
        Widgets.DataListControlResources = DataListControlResources;
    })(Widgets = Joove.Widgets || (Joove.Widgets = {}));
})(Joove || (Joove = {}));
