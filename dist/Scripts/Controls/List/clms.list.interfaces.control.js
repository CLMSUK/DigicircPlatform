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
        var ListControlBase = /** @class */ (function () {
            function ListControlBase() {
                this.$list = null;
                this.$listHeader = null;
                this.$listColumnHeaderContainer = null;
                this.$listColumnHeader = null;
                this.$listDataContainer = null;
                this.$listData = null;
                this.$listPager = null;
                this.$listFooter = null;
                this.$listFooterContainer = null;
                this.$listVerticalScrollbar = null;
                this.$listHorizontalScrollbar = null;
                this.$titleContextMenu = null;
                this.$rowContextMenu = null;
                this.$listDockedGrids = null;
                this.$predefinedFiltersFieldSet = null;
                this.showInitializationLoadingTimeout = null;
                this.refreshDimentionsInterval = null;
                this.elementId = null;
                this.serverSideElementId = null;
                this.draggablePreferencesPosition = null;
                this.draggableFiltersPosition = null;
                this.draggableGroupingPosition = null;
                this.$preferencesContainer = null;
                this.$filtersContainer = null;
                this.$groupsContainer = null;
                this.scrollLock = null;
                this.scrollTimeout = null;
                this.initiallySelectedKeys = null;
                this.openedGroups = [];
                this.aggregatorsData = null;
                this.groupsDataInfoArray = null;
                this.data = null;
                this.groups = null;
                this.ruleEvaluations = null;
                this.requestQueue = [];
                this.$ownerButton = null;
            }
            return ListControlBase;
        }());
        Widgets.ListControlBase = ListControlBase;
        var ListControlColumn = /** @class */ (function (_super) {
            __extends(ListControlColumn, _super);
            function ListControlColumn(options) {
                var _this = _super.call(this, Joove.Common.replaceAll(options.name, "\\.", "_"), options.dataType, options.formatting) || this;
                _this.mambaDataType = options.dataType;
                _this.dataType = options.dataType;
                _this.caption = options.caption;
                _this.isVisible = options.isVisible;
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
                return _this;
            }
            return ListControlColumn;
        }(Joove.ColumnInfo));
        Widgets.ListControlColumn = ListControlColumn;
        var ListFilter = /** @class */ (function (_super) {
            __extends(ListFilter, _super);
            function ListFilter(column, operator, value, rowOperator, type, additionalValue) {
                var _this = _super.call(this, column, value, rowOperator, operator, additionalValue) || this;
                _this.type = type;
                _this.additionalValue = additionalValue;
                return _this;
            }
            return ListFilter;
        }(Joove.FilterInfo));
        Widgets.ListFilter = ListFilter;
        var ListOrderByInfo = /** @class */ (function (_super) {
            __extends(ListOrderByInfo, _super);
            function ListOrderByInfo(column, direction, sortOrder) {
                var _this = _super.call(this, column, direction) || this;
                _this.sortOrder = sortOrder;
                return _this;
            }
            return ListOrderByInfo;
        }(Joove.OrderByInfo));
        Widgets.ListOrderByInfo = ListOrderByInfo;
        var ListGroupByInfo = /** @class */ (function (_super) {
            __extends(ListGroupByInfo, _super);
            function ListGroupByInfo(column, initialState, getGroupsClosed, inactive) {
                return _super.call(this, column, initialState, inactive, getGroupsClosed) || this;
            }
            return ListGroupByInfo;
        }(Joove.GroupByInfo));
        Widgets.ListGroupByInfo = ListGroupByInfo;
        var ListGroupsDataInfo = /** @class */ (function () {
            function ListGroupsDataInfo(groupIdentifier) {
                this.identifier = groupIdentifier;
                this.filters = [];
                var parts = groupIdentifier.split(Widgets.ListControlAsset.GroupsDelimiter);
                for (var i = 0; i < parts.length; i++) {
                    this.filters.push({
                        column: parts[i].split(Widgets.ListControlAsset.GroupsValueDelimiter)[0],
                        value: parts[i].split(Widgets.ListControlAsset.GroupsValueDelimiter)[1]
                            .replace(new RegExp(Widgets.ListControlAsset.GroupsValueSpace, "g"), " ")
                    });
                }
            }
            return ListGroupsDataInfo;
        }());
        Widgets.ListGroupsDataInfo = ListGroupsDataInfo;
        var ListAggregatorInfo = /** @class */ (function () {
            function ListAggregatorInfo(column, type, origin) {
                this.column = column;
                this.type = type;
                this.origin = origin;
            }
            return ListAggregatorInfo;
        }());
        Widgets.ListAggregatorInfo = ListAggregatorInfo;
        var ListColumnItemType;
        (function (ListColumnItemType) {
            ListColumnItemType[ListColumnItemType["HYPERLINK"] = 0] = "HYPERLINK";
            ListColumnItemType[ListColumnItemType["DOWNLOADLINK"] = 1] = "DOWNLOADLINK";
            ListColumnItemType[ListColumnItemType["CHECKBOX"] = 2] = "CHECKBOX";
            ListColumnItemType[ListColumnItemType["IMAGEBOX"] = 3] = "IMAGEBOX";
            ListColumnItemType[ListColumnItemType["TEXTBOX"] = 4] = "TEXTBOX";
        })(ListColumnItemType = Widgets.ListColumnItemType || (Widgets.ListColumnItemType = {}));
    })(Widgets = Joove.Widgets || (Joove.Widgets = {}));
})(Joove || (Joove = {}));
