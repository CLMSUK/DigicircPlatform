var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Joove;
(function (Joove) {
    var Widgets;
    (function (Widgets) {
        /*   Column Info
         *
         *   The configuration options for each column of the DataList control
         */
        var DataListColumnInfo = /** @class */ (function (_super) {
            __extends(DataListColumnInfo, _super);
            function DataListColumnInfo(options) {
                var _this = _super.call(this, Joove.Common.replaceAll(options.name, "\\.", "_"), options.dataType, options.formatting) || this;
                _this.mambaDataType = options.dataType;
                _this.mambaDataTypeIsEnum = options.dataTypeIsEnum;
                _this.dataType = options.dataType;
                _this.caption = options.caption;
                _this.visible = options.visible;
                _this.groupable = options.groupable;
                _this.searchable = options.searchable;
                _this.orderable = options.orderable;
                _this.editable = options.editable;
                _this.style = options.style;
                _this.classes = options.classes;
                _this.itemType = options.itemType;
                _this.importable = options.importable;
                _this.supportsAggregators = options.supportsAggregators;
                _this.width = options.width || null;
                _this.minWidth = options.minWidth || null;
                _this.customWidth = options.customWidth || null;
                _this.length = options.length || null;
                _this.css = options.css || "";
                _this.isEncrypted = options.isEncrypted;
                _this.showFullImage = options.showFullImage;
                return _this;
            }
            return DataListColumnInfo;
        }(Joove.ColumnInfo));
        Widgets.DataListColumnInfo = DataListColumnInfo;
        /*   Filter Info
         *
         *   Helper class used in the list status that describes filtering information
         */
        var DataListFilterInfo = /** @class */ (function (_super) {
            __extends(DataListFilterInfo, _super);
            function DataListFilterInfo(columnInfo, value, rowOp, op, secondValue, type, controlId) {
                var _this = _super.call(this, columnInfo, value, rowOp, op, secondValue) || this;
                _this.type = type;
                _this.controlId = controlId;
                return _this;
            }
            return DataListFilterInfo;
        }(Joove.FilterInfo));
        Widgets.DataListFilterInfo = DataListFilterInfo;
        /*   Aggregator Info
         *
         *   Helper class used in the list status that describes aggregator information
         */
        var DataListAggregatorInfo = /** @class */ (function () {
            function DataListAggregatorInfo(column, type, formatting) {
                this.column = column;
                this.type = type;
                this.formatting = formatting;
            }
            return DataListAggregatorInfo;
        }());
        Widgets.DataListAggregatorInfo = DataListAggregatorInfo;
        /*   Group By Info
         *
         *   Helper class used in the list status that describes group by information
         */
        var DataListGroupByInfo = /** @class */ (function (_super) {
            __extends(DataListGroupByInfo, _super);
            function DataListGroupByInfo(column, initialState, getGroupsClosed, inactive) {
                return _super.call(this, column, initialState, inactive, getGroupsClosed) || this;
            }
            return DataListGroupByInfo;
        }(Joove.GroupByInfo));
        Widgets.DataListGroupByInfo = DataListGroupByInfo;
        var DataListColumnItemType;
        (function (DataListColumnItemType) {
            DataListColumnItemType[DataListColumnItemType["HYPERLINK"] = 0] = "HYPERLINK";
            DataListColumnItemType[DataListColumnItemType["DOWNLOADLINK"] = 1] = "DOWNLOADLINK";
            DataListColumnItemType[DataListColumnItemType["CHECKBOX"] = 2] = "CHECKBOX";
            DataListColumnItemType[DataListColumnItemType["IMAGEBOX"] = 3] = "IMAGEBOX";
            DataListColumnItemType[DataListColumnItemType["TEXTBOX"] = 4] = "TEXTBOX";
            DataListColumnItemType[DataListColumnItemType["HTML"] = 5] = "HTML";
        })(DataListColumnItemType = Widgets.DataListColumnItemType || (Widgets.DataListColumnItemType = {}));
        var DataListFilterType;
        (function (DataListFilterType) {
            DataListFilterType[DataListFilterType["Quick"] = 0] = "Quick";
            DataListFilterType[DataListFilterType["Global"] = 1] = "Global";
            DataListFilterType[DataListFilterType["Custom"] = 2] = "Custom";
        })(DataListFilterType = Widgets.DataListFilterType || (Widgets.DataListFilterType = {}));
    })(Widgets = Joove.Widgets || (Joove.Widgets = {}));
})(Joove || (Joove = {}));
