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
        var DatasourceWidget = /** @class */ (function () {
            function DatasourceWidget(options) {
                this._columns = options.columns;
                this._controlName = options.controlName || "";
                this._forceDraw = options.forceDraw !== false;
                this._container = options.container;
                if (!this._container) {
                    this._forceDraw = false;
                }
                if ((this._columns == undefined || this._columns == null || this._columns.length === 0) &&
                    (this._controlName == undefined || this._controlName == null || this._controlName == "")) {
                    console.log("Datasource Widget (WARNING): no columns or controlname are defined");
                }
            }
            DatasourceWidget.prototype.findColumnInfoByName = function (name) {
                for (var i = 0; i < this._columns.length; i++) {
                    if (this._columns[i].name === name) {
                        this._columns[i].mambaDataType = this._columns[i].dataType;
                        return this._columns[i];
                    }
                }
                return null;
            };
            DatasourceWidget.prototype.flashElement = function ($element) {
                var initalBGcolor = $element.css("background-color");
                $element.animate({
                    opacity: 0.5,
                    "background-color": "#99ccff"
                }, 750, function () {
                    $element.animate({
                        opacity: 1,
                        "background-color": initalBGcolor
                    }, 750, function () {
                        if (initalBGcolor !== "rgba(0, 0, 0, 0)")
                            return;
                        $element.css("background-color", "");
                    });
                });
            };
            DatasourceWidget.prototype.retrieveColumnInfo = function (cb) {
                var _this = this;
                if (this._columns == null || this._columns.length === 0) {
                    Joove.Core.executeControllerAction(Joove.Core.getControllerForElement(this._container), this._controlName + "_ColumnInfo", "GET", null, null, null, function (data) {
                        for (var i = 0; i < data.length; i++) {
                            var current = data[i];
                            _this._columns.push(new Joove.ColumnInfo(current.Name, current.MambaDataType, current.Formatting));
                        }
                        cb && cb();
                    });
                }
                else {
                    cb && cb();
                }
            };
            DatasourceWidget.prototype.clear = function () {
                this.redraw([]);
            };
            return DatasourceWidget;
        }());
        Widgets.DatasourceWidget = DatasourceWidget;
        var FilterDatasourceWidget = /** @class */ (function (_super) {
            __extends(FilterDatasourceWidget, _super);
            function FilterDatasourceWidget(options) {
                var _this = _super.call(this, options) || this;
                _this._resources = options.resources || window._resourcesManager.resources;
                _this._filters = options.filters || [];
                _this._rowOperators = [
                    { value: Joove.RowOperators.NONE, text: "" },
                    { value: Joove.RowOperators.OR, text: _this._resources.Or },
                    { value: Joove.RowOperators.AND, text: _this._resources.And }
                ];
                _this._operators = [
                    { value: Joove.FilterOperators.NONE, text: "" },
                    { value: Joove.FilterOperators.RANGE, text: _this._resources.Range },
                    { value: Joove.FilterOperators.LIKE, text: _this._resources.Like },
                    { value: Joove.FilterOperators.EQUAL_TO, text: _this._resources.EqualTo },
                    { value: Joove.FilterOperators.NOT_EQUAL_TO, text: _this._resources.NotEqualTo },
                    { value: Joove.FilterOperators.GREATER_THAN, text: _this._resources.GreaterThan },
                    { value: Joove.FilterOperators.GREATER_THAN_OR_EQUAL_TO, text: _this._resources.GreaterThanOrEqualTo },
                    { value: Joove.FilterOperators.LESS_THAN, text: _this._resources.LessThan },
                    { value: Joove.FilterOperators.LESS_THAN_OR_EQUAL_TO, text: _this._resources.LessThanOrEqualTo },
                    { value: Joove.FilterOperators.HAS_VALUE, text: _this._resources.HasValue },
                    { value: Joove.FilterOperators.HAS_NO_VALUE, text: _this._resources.HasNoValue }
                ];
                if (_this._forceDraw)
                    _this.draw(options.container);
                return _this;
            }
            FilterDatasourceWidget.prototype.getColumns = function () {
                return this._columns;
            };
            FilterDatasourceWidget.prototype.draw = function ($target) {
                var _this = this;
                if (this._container == null)
                    this._container = $target;
                this.retrieveColumnInfo(function () {
                    var $content = $(_this.drawPreferences());
                    _this.populate($content);
                    $target.append($content);
                });
            };
            FilterDatasourceWidget.prototype.redraw = function (terms, options) {
                this._container.empty();
                this._filters = terms;
                if (options) {
                    this._columns = options.columns || this._columns;
                }
                this.draw(this._container);
            };
            FilterDatasourceWidget.prototype.getDataSourceTerms = function (options) {
                var $filterRows = this._container.find(".filter-row");
                var filters = [];
                var foundError = false;
                for (var i = 0; i < $filterRows.length; i++) {
                    var $row = $filterRows.eq(i);
                    var column = $row.find(".available-columns").val();
                    var operator = $row.find(".available-operators").val();
                    var rowOperator = $row.find(".available-row-operators").val();
                    var columnInfo = this.findColumnInfoByName(column);
                    var dataType = columnInfo.dataType;
                    var $filterInput = $row.find(".filter-value");
                    var value = $filterInput.val();
                    var additionalValue = $row.find(".additional-filter-value").val();
                    var format = columnInfo.formatting;
                    // force number format
                    if (Joove.DatasourceManager.isMambaDataTypeNumber(dataType))
                        value = Joove.Common.forceNumberFormat(value);
                    // Quick Validation
                    if (operator === String(Joove.FilterOperators.NONE) || // Operator not set
                        ((value == null || typeof (value) == "undefined" || value.trim().length === "") &&
                            // Null or Undefined Value
                            operator !== Joove.FilterOperators.HAS_VALUE &&
                            operator !== Joove.FilterOperators.HAS_NO_VALUE) || // Empty Value
                        (rowOperator === Joove.RowOperators.NONE && i < $filterRows.length - 1)) {
                        // Row Operator not set (allowed only for last filter)
                        foundError = true;
                        $row.addClass("danger");
                        continue;
                    }
                    else if (operator === Joove.FilterOperators.RANGE) {
                        if (value.trim().length === "" || // Empty Value
                            additionalValue.trim().length === "" || // Empty Additional Value
                            (rowOperator === Joove.RowOperators.NONE && i < $filterRows.length - 1)) {
                            // Row Operator not set (allowed only for last filter)) {
                            foundError = true;
                            $row.addClass("danger");
                            continue;
                        }
                    }
                    $row.removeClass("danger");
                    if (dataType === "DateTime") {
                        value = Joove.Common.getUtcDateFromRawString(value, Widgets.DatePicker.getFormatOfDate(format, true));
                        if (operator === Joove.FilterOperators.RANGE) {
                            additionalValue = Joove.Common
                                .getUtcDateFromRawString(additionalValue, Widgets.DatePicker.getFormatOfDate(format, true));
                        }
                    }
                    //Operator Equals / NotEquals handle
                    if (operator === Joove.FilterOperators.HAS_VALUE || operator === Joove.FilterOperators.HAS_NO_VALUE)
                        value = "";
                    filters.push(new Joove.FilterInfo(this.findColumnInfoByName(column), value, rowOperator, operator, additionalValue));
                }
                if (foundError) {
                    alert("Please fill in all required filter fields.");
                    return null;
                }
                this._filters = filters;
                return this._filters;
            };
            FilterDatasourceWidget.prototype.drawFilters = function ($contents) {
                for (var i = 0; i < this._filters.length; i++) {
                    var currentFilter = this._filters[i];
                    var currentColumn = currentFilter.column;
                    var $line = this.createFilterRow($contents);
                    $line.find(".available-columns").val(currentFilter.column.name);
                    $line.find(".available-operators").val(String(currentFilter.operator));
                    $line.find(".filter-value-container")
                        .children()
                        .toggle(currentFilter.operator !== Joove.FilterOperators.HAS_VALUE &&
                        currentFilter.operator !== Joove.FilterOperators.HAS_NO_VALUE);
                    this.handleFilterRow($line, currentColumn.mambaDataType, currentFilter.operator, currentFilter.value);
                    // Last Filter's Row Operator must be NONE
                    if (i < this._filters.length - 1) {
                        $line.find(".available-row-operators").val(String(currentFilter.rowOperator));
                    }
                    $contents.find(".filters-table-body").append($line);
                }
            };
            FilterDatasourceWidget.prototype.populate = function ($contents) {
                var self = this;
                if (this._filters.length === 0) {
                    $contents.find(".filters-table").hide();
                    $contents.closest(".empty-filter-list").show();
                }
                else {
                    $contents.find(".filters-table").show();
                    $contents.closest(".empty-filter-list").hide();
                }
                this.drawFilters($contents);
                $contents.find(".add-filter-btn")
                    .on("click", function (e) {
                    $(e.target).parent().hide();
                    $contents.find(".filters-table").show();
                    var $filterRow = self.createFilterRow($contents);
                    $contents.find(".filters-table-body").append($filterRow);
                    self.handleFilterRow($filterRow);
                });
            };
            FilterDatasourceWidget.prototype.createFilterRow = function ($container) {
                var self = this;
                var $lineTemplate = $("<tr class='filter-row'> \
                                        <td><select class='available-columns form-control'></select></td> \
                                        <td><select class='available-operators form-control'></select></td> \
                                        <td class='filter-value-container'></td> \
                                        <td><select class='available-row-operators form-control'></select></td> \
                                        <td><span class='remove-filter glyphicon glyphicon-remove'></span></td> \
                                    </tr>");
                for (var i = 0; i < this._rowOperators.length; i++) {
                    var option = $("<option value='" + this._rowOperators[i]
                        .value + "'>" + this._rowOperators[i].text + "</option>");
                    $lineTemplate.find(".available-row-operators").append(option);
                }
                for (var i = 0; i < this._operators.length; i++) {
                    var option = $("<option value='" + this._operators[i].value + "'>" + this._operators[i].text + "</option>");
                    $lineTemplate.find(".available-operators").append(option);
                }
                for (var i = 0; i < this._columns.length; i++) {
                    if (this._columns[i].searchable === false)
                        continue;
                    var option = $("<option value='" + this._columns[i]
                        .name + "'>" + this._columns[i].caption + "</option>");
                    $lineTemplate.find(".available-columns").append(option);
                }
                $lineTemplate.find(".remove-filter")
                    .on("click", function (e) {
                    $(e.target).closest("tr").remove();
                    if ($container.find(".filter-row").length > 0)
                        return;
                    $container.find(".filters-table").hide();
                    $container.closest(".empty-filter-list").show();
                });
                $lineTemplate.find(".available-row-operators")
                    .on("change", function (e) {
                    var $parentRow = $(e.target).closest("tr");
                    if (!$parentRow.is(":last-child"))
                        return;
                    if ($(e.target).val() === Joove.RowOperators.NONE)
                        return;
                    var $filterRow = self.createFilterRow($container);
                    $parentRow.after($filterRow);
                    self.handleFilterRow($filterRow);
                });
                $lineTemplate.find(".available-columns, .available-operators")
                    .on("change", function (e) {
                    var $parentRow = $(e.target).closest("tr");
                    self.handleFilterRow($parentRow);
                });
                return $lineTemplate;
            };
            FilterDatasourceWidget.prototype.drawPreferences = function () {
                return "<div class='list-filters-container'>             <table class='filters-table table table-hover'>                 <thead>                    <th>" + this._resources.Column + "</th>                    <th>" + this._resources.Operator + "</th>                    <th>" + this._resources.Criteria + "</th>                    <th>" + this._resources.RowOperator + "</th>                    <th></th>                </thead>                <tbody class='filters-table-body'>                 </tbody>             </table>         </div>         <div class='empty-filter-list'>            <!-- <span>" + this._resources.NoFiltersDefined + "</span>            <br/><br/> -->            <button type='button' class='btn btn-default add-filter-btn'>" + this._resources.AddFilter + "</button>         </div>";
            };
            FilterDatasourceWidget.prototype.handleFilterRow = function ($container, dataType, operator, value) {
                if ($container == null)
                    return;
                var $filterValue = $container.find(".filter-value-container");
                var currentTemplate = $filterValue.attr("template");
                var $availableOperators = $container.find(".available-operators");
                var columnInfo = this.findColumnInfoByName($container.find(".available-columns").val());
                if (columnInfo == null) {
                    console.error("Could not find column info for:", $container.get(0));
                    return;
                }
                dataType = dataType || columnInfo.mambaDataType;
                operator = operator || $container.find(".available-operators").val();
                value = value || $filterValue.find(".filter-value").val();
                //Allow allow filters depending on their datatype
                $availableOperators.find("option[value='" + Joove.FilterOperators.RANGE + "']")
                    .toggle(dataType === "DateTime");
                $availableOperators.find("option[value='" + Joove.FilterOperators
                    .GREATER_THAN + "'], [value='" + Joove.FilterOperators
                    .GREATER_THAN_OR_EQUAL_TO + "'], [value='" + Joove.FilterOperators.LESS_THAN + "'], [value='" + Joove.FilterOperators.LESS_THAN_OR_EQUAL_TO + "']")
                    .toggle(Joove.DatasourceManager.isMambaDataTypeNumber(dataType) || dataType === "DateTime");
                //Remove invalid selected operators
                var nonNumericInvalidOperators = [
                    Joove.FilterOperators.GREATER_THAN, Joove.FilterOperators.GREATER_THAN_OR_EQUAL_TO,
                    Joove.FilterOperators.LESS_THAN, Joove.FilterOperators.LESS_THAN_OR_EQUAL_TO
                ];
                if ((dataType !== "DateTime" && $availableOperators.val() === Joove.FilterOperators.RANGE) || //Datetime
                    (!Joove.DatasourceManager.isMambaDataTypeNumber(dataType) &&
                        dataType !== "DateTime" &&
                        $.inArray($availableOperators.val(), nonNumericInvalidOperators) > 0)) { //Non-numeric
                    $availableOperators.val("");
                }
                //Hide input controls on has/not value
                if (operator !== Joove.FilterOperators.HAS_VALUE && operator !== Joove.FilterOperators.HAS_NO_VALUE) {
                    $filterValue.children().show();
                }
                else {
                    $filterValue.children().hide();
                    return;
                }
                var $dateRangeTemplate = "<div class='input-group'> \
                                    <span class='input-group-addon'>From:</span> \
                                    <input class='filter-value form-control' type='text'> \
                                </div>  \
                                <div class='input-group'> \
                                    <span class='input-group-addon'>To:</span> \
                                    <input class='additional-filter-value form-control' type='text'> \
                                </div>";
                var $defaultTemplate = "<input class='filter-value form-control' type='text'>";
                var $boolTemplate = "<input type='radio' name='bool-val-" + columnInfo.name + "-" + ($container.siblings().length + 1) + "' value='true'>                                 <span>True</span>                                 <br />                                 <input type='radio' name='bool-val-" + columnInfo.name + "-" + ($container.siblings().length + 1) + "' value='false'>                                 <span>False</span>                                 <input type='hidden' class='filter-value' />";
                switch (dataType) {
                    case "bool":
                        if (currentTemplate === "bool")
                            return;
                        $filterValue.children().remove();
                        $filterValue.append($boolTemplate);
                        $filterValue.attr("template", "bool");
                        $filterValue.find("input[type='radio']")
                            .on("click", function (event) {
                            $(event.target).siblings(".filter-value").val($(event.target).val());
                        });
                        if (value) {
                            $filterValue.find("input[type='radio'][value='" + value + "']").attr("checked", "checked");
                            $filterValue.find(".filter-value").val(value);
                        }
                        break;
                    case "DateTime":
                        if (operator === Joove.FilterOperators.RANGE) {
                            if (currentTemplate === "dateRange")
                                return;
                            $filterValue.children().remove();
                            $filterValue.append($dateRangeTemplate);
                            $filterValue.attr("template", "dateRange");
                            Widgets.DatePicker.convertElementToDatePicker($filterValue.find(".filter-value, .additional-filter-value"), columnInfo.formatting);
                            $filterValue.find(".filter-value")
                                .on("change", function (event) {
                                if ($filterValue.find(".additional-filter-value").val().length === 0) {
                                    $filterValue.find(".additional-filter-value").val($(event.target).val());
                                }
                            });
                            if (value) {
                                try {
                                    var multipleValues = value.split("|");
                                    $filterValue.find(".filter-value").val(multipleValues[0]);
                                    $filterValue.find(".additional-filter-value").val(multipleValues[1]);
                                }
                                catch (e) {
                                    console.log("Error setting date ranges");
                                }
                            }
                        }
                        else {
                            if (currentTemplate === "simpleDate")
                                return;
                            $filterValue.children().remove();
                            $filterValue.append($defaultTemplate);
                            $filterValue.attr("template", "simpleDate");
                            Widgets.DatePicker.convertElementToDatePicker($filterValue.find(".filter-value"), columnInfo.formatting);
                            if (value)
                                $filterValue.find(".filter-value").val(value);
                        }
                        break;
                    default:
                        if (currentTemplate === "default")
                            return;
                        $filterValue.children().remove();
                        $filterValue.append($defaultTemplate);
                        $filterValue.attr("template", "default");
                        if (value)
                            $filterValue.find(".filter-value").val(value);
                        break;
                }
            };
            return FilterDatasourceWidget;
        }(DatasourceWidget));
        Widgets.FilterDatasourceWidget = FilterDatasourceWidget;
        var QuickFilterDatasourceWidget = /** @class */ (function (_super) {
            __extends(QuickFilterDatasourceWidget, _super);
            function QuickFilterDatasourceWidget() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            QuickFilterDatasourceWidget.prototype.draw = function ($target) {
                var _this = this;
                if (this._container == null)
                    this._container = $target;
                this.retrieveColumnInfo(function () {
                    var $content = $(_this.drawQuickFilterLayout());
                    _this.populateQuickFilters($content);
                    $target.append($content);
                });
            };
            QuickFilterDatasourceWidget.prototype.getDataSourceTerms = function (options) {
                var $target = $(".filter-row", this._container);
                var filters = [];
                for (var i = 0; i < $target.length; i++) {
                    var $row = $($target[i]);
                    var columnFilter = $row.find(".filter-value").val();
                    if (columnFilter.length === 0)
                        continue;
                    var column = this.findColumnInfoByName($row.find(".column-name").data("column-name"));
                    var filter = new Joove.FilterInfo(column, columnFilter, Joove.RowOperators.AND, Joove.FilterOperators.LIKE, "");
                    filters.push(filter);
                }
                if (filters.length === 1) {
                    filters[0].rowOperator = Joove.RowOperators.NONE;
                }
                return filters;
            };
            QuickFilterDatasourceWidget.prototype.getColumns = function () {
                return this._columns;
            };
            QuickFilterDatasourceWidget.prototype.redraw = function (terms) {
                this._container.empty();
                this._filters = terms;
                this.draw(this._container);
            };
            QuickFilterDatasourceWidget.prototype.drawQuickFilterLayout = function () {
                return "<div class='list-filters-container'>                         <br />                         <table class='filters-table table table-hover'>                             <tbody class=\"filters-table-body\">                             </tbody>                         </table>                     </div>";
            };
            QuickFilterDatasourceWidget.prototype.populateQuickFilters = function ($content) {
                var $target = $(".filters-table-body", $content);
                for (var i = 0; i < this._columns.length; i++) {
                    var col = this._columns[i];
                    var row = "<tr class=\"filter-row\">\n                                <th style=\"vertical-align: middle;\" class=\"col-xs-2 column-name\" data-column-name=\"" + col.name + "\">" + col.name + "</th>\n                                <td class=\"col-xs-10\"><input class=\"filter-value\" style=\"width: 100%;\"/></td>\n                            </tr>";
                    $target.append(row);
                }
            };
            return QuickFilterDatasourceWidget;
        }(FilterDatasourceWidget));
        Widgets.QuickFilterDatasourceWidget = QuickFilterDatasourceWidget;
        var GroupDatasourceWidget = /** @class */ (function (_super) {
            __extends(GroupDatasourceWidget, _super);
            function GroupDatasourceWidget(options) {
                var _this = _super.call(this, options) || this;
                _this._resources = options.resources || window._resourcesManager.resources;
                _this._groupBy = options.groupBy;
                _this._getGroupsClosed = options.groupsClosed;
                if (_this._forceDraw)
                    _this.draw(options.container);
                return _this;
            }
            GroupDatasourceWidget.prototype.getColumns = function () {
                return this._columns;
            };
            GroupDatasourceWidget.prototype.draw = function ($target) {
                var _this = this;
                if (this._container == null)
                    this._container = $target;
                this.retrieveColumnInfo(function () {
                    var $content = $(_this.getGroupingPreferencesMarkUp());
                    _this.populateGroupPreferencesContainer($content);
                    $target.append($content);
                });
            };
            GroupDatasourceWidget.prototype.redraw = function (terms, options) {
                this._container.empty();
                if (options) {
                    this._columns = options.columns || this._columns;
                }
                this._groupBy = terms;
                this.draw(this._container);
            };
            GroupDatasourceWidget.prototype.getDataSourceTerms = function (options) {
                if (options === void 0) { options = {}; }
                var $grouped = this._container.find(".grouping-columns");
                var $groups = $grouped.children();
                var groupsArray = [];
                options.getGroupsClosed = options.getGroupsClosed ||
                    this._container.find(".get-groups-closed").is(":checked");
                for (var i = 0; i < $groups.length; i++) {
                    groupsArray.push(this.findColumnInfoByName($groups.eq(i).val()));
                }
                var groupBy = [];
                for (var i = 0; i < groupsArray.length; i++) {
                    var state = options.getGroupsClosed === true && i === groupsArray.length - 1
                        ? "COLLAPSED"
                        : "EXPANDED";
                    //groupBy.push(new Widgets.ListGroupByInfo(groupsArray[i], state, options.getGroupsClosed));
                }
                return groupBy;
            };
            GroupDatasourceWidget.prototype.getGroupingPreferencesMarkUp = function () {
                return "<div class='list-groups-container collapsible-grid-main-container'>             <table class='groups-table table'>                 <thead>                    <th>" + this._resources.Column + "</th>                    <th></th>                    <th>" + this._resources.GroupingOrder + "</th>                    <th></th>                </thead>                <tbody class='filters-table-body'>                     <tr>                         <td>                             <select class='available-columns' multiple='multiple'>                             </select>                         </td>                         <td>                             <button type='button' class='btn btn-default add-group'><span class='glyphicon glyphicon-arrow-right'></span></button>                            <br/>                             <button type='button' class='btn btn-default remove-group'><span class='glyphicon glyphicon-arrow-left'></span></button>                        </td>                         <td>                             <select class='grouping-columns' multiple='multiple'>                             </select>                         </td>                         <td>                             <button class='btn btn-default move-up'><span class='glyphicon glyphicon-arrow-up'></span></button>                            <br/>                             <button class='btn btn-default move-down'><span class='glyphicon glyphicon-arrow-down'></span></button>                        </td>                 </tbody>                 <tfoot>                    <tr>                        <td colspan='4' style='text-align: left; padding-left: 15px'>                            <span>" + this._resources.GetGroupsClosed + "</span>                             <input type='checkbox' style='display: inline-block; position: relative; top: 3px; left: 10px' class='get-groups-closed'/>                        </td>                    </tr>                </tfoot>            </table>         </div>";
            };
            GroupDatasourceWidget.prototype.populateGroupPreferencesContainer = function ($container) {
                var $available = $container.find(".available-columns");
                var $grouped = $container.find(".grouping-columns");
                $container.find(".get-groups-closed").prop("checked", this._getGroupsClosed);
                for (var i = 0; i < this._columns.length; i++) {
                    var columnName = this._columns[i].name;
                    if (this._columns[i].groupable === false)
                        continue;
                    var option = "<option value='" + columnName + "'>" + this._columns[i].caption + "</option>";
                    $available.append(option);
                }
                for (var i = 0; i < this._groupBy.length; i++) {
                    var column = this._groupBy[i].column;
                    $container.find(".get-groups-closed").prop('checked', this._groupBy[i].getGroupsClosed);
                    var option = "<option value='" + column.name + "'>" + column.caption + "</option>";
                    $grouped.append(option);
                    $available.find("option[value='" + column.name + "']").hide();
                }
                $container.find(".add-group")
                    .on("click", function () {
                    var $selected = $available.find(":selected");
                    for (var i = 0; i < $selected.length; i++) {
                        if ($grouped.find("option[value='" + $selected.eq(i).val() + "']").length === 0) {
                            $grouped.append($selected.eq(i).clone());
                            $selected.eq(i).hide();
                        }
                    }
                    if ($available.children(":visible").length > 0) {
                        $available.val($available.children(":visible:first").val()).focus();
                    }
                });
                $container.find(".remove-group")
                    .on("click", function () {
                    var $selected = $grouped.find(":selected");
                    for (var i = $selected.length - 1; i >= 0; i--) {
                        $available.find("option[value='" + $selected.eq(i).val() + "']").show();
                    }
                    $selected.remove();
                    if ($grouped.children(":visible").length > 0) {
                        $grouped.val($grouped.children(":visible:first").val()).focus();
                    }
                });
                $container.find(".move-up")
                    .on("click", function () {
                    var $selected = $grouped.find(":selected");
                    $selected.eq(0).prev().before($selected);
                });
                $container.find(".move-down")
                    .on("click", function () {
                    var $selected = $grouped.find(":selected");
                    $selected.eq($selected.length - 1).next().after($selected);
                });
                $available.on("dblclick", function () {
                    $container.find(".add-group").click();
                });
                $grouped.on("dblclick", function () {
                    $container.find(".remove-group").click();
                });
            };
            return GroupDatasourceWidget;
        }(DatasourceWidget));
        Widgets.GroupDatasourceWidget = GroupDatasourceWidget;
        var OrderDatasourceWidget = /** @class */ (function (_super) {
            __extends(OrderDatasourceWidget, _super);
            function OrderDatasourceWidget(options) {
                var _this = _super.call(this, options) || this;
                _this._resources = options.resources || window._resourcesManager.resources;
                _this._orderBy = options.orderBy;
                if (_this._forceDraw)
                    _this.draw(options.container);
                return _this;
            }
            OrderDatasourceWidget.prototype.draw = function ($target) {
                var _this = this;
                if (this._container == null)
                    this._container = $target;
                this.retrieveColumnInfo(function () {
                    var $content = $(_this.getViewPreferencesMarkUp());
                    _this.populatePreferencesContainer($content);
                    $target.append($content);
                });
            };
            OrderDatasourceWidget.prototype.redraw = function (terms, options) {
                this._container.empty();
                if (options) {
                    this._columns = options.columns || this._columns;
                }
                this._orderBy = terms;
                this.draw(this._container);
            };
            OrderDatasourceWidget.prototype.getColumns = function () {
                return this._columns;
            };
            OrderDatasourceWidget.prototype.getDataSourceTerms = function (options) {
                var $rows = this._container.find(".row-preference");
                var columns = [];
                var orderInfos = [];
                var visibleFound = false;
                var visibilityChanged = false;
                for (var i = 0; i < $rows.length; i++) {
                    var $row = $rows.eq(i);
                    var columnName = $row.data("column");
                    var sortOrder = $row.find(".column-sort-order").val().trim();
                    var direction = $row.find(".sorting-direction:checked").val();
                    var isVisible = $row.find(".column-is-visible").is(":checked");
                    var originalColumn = this.findColumnInfoByName(columnName);
                    if (isVisible)
                        visibleFound = true;
                    if (isVisible !== originalColumn.isVisible)
                        visibilityChanged = true;
                    var column = {
                        name: columnName,
                        dataType: originalColumn.dataType,
                        width: originalColumn.width,
                        minWidth: originalColumn.minWidth,
                        customWidth: originalColumn.customWidth,
                        supportsAggregators: originalColumn.supportsAggregators,
                        isVisible: isVisible,
                        caption: originalColumn.caption,
                        mambaDataType: originalColumn.dataType
                    };
                    columns.push(column);
                    if (sortOrder.length === 0)
                        continue;
                    //orderInfos.push(new Widgets.ListOrderByInfo(column, direction, sortOrder));
                }
                // Quick Validation
                if (visibleFound === false) {
                    alert("Please select at least one visible column.");
                    return [];
                }
                // Sort by Sort Order
                orderInfos.sort(function (a, b) {
                    if (a.sortOrder < b.sortOrder)
                        return -1;
                    if (a.sortOrder > b.sortOrder)
                        return 1;
                    return 0;
                });
                // Column Visibility changed. Reset widths, so that they are recalculated
                if (visibilityChanged) {
                    for (var i = 0; i < columns.length; i++) {
                        columns[i].width = null;
                    }
                }
                this._columns = columns;
                return orderInfos;
            };
            OrderDatasourceWidget.prototype.getViewPreferencesMarkUp = function () {
                return "<div class='preferences-container collapsible-grid-main-container'>             <table class='preferences-table table table-hover'>                 <thead>                    <th>" + this._resources.Order + "</th>                    <th>" + this._resources.Visible + "</th>                    <th>" + this._resources.Column + "</th>                    <th>" + this._resources.Sorting + "</th>                    <th>" + this._resources.SortOrder + "</th>                </thead>                <tbody class='preferences-table-body'>                 </tbody>             </table>         </div>";
            };
            OrderDatasourceWidget.prototype.populatePreferencesContainer = function ($container) {
                var _this = this;
                for (var i = 0; i < this._columns.length; i++) {
                    var column = this._columns[i];
                    var checkedAttr = column.isVisible === true ? "checked='checked'" : "";
                    var $line = $("<tr class='row-preference' data-column='" + column.name + "'>                                    <td style='text-align: center'>                                        <span class='move-row-up glyphicon glyphicon-chevron-up'></span>                                        <span class='move-row-down glyphicon glyphicon-chevron-down'></span>                                    </td>                                    <td style='text-align: center'>                                        <input type='checkbox' class='column-is-visible' " + checkedAttr + "/>                                    </td>                                    <td>" + column.caption + "</td>                                    <td class='cell-for-sorting'>                                        <span class='sort-direction-icon glyphicon glyphicon-arrow-up'></span>                                        <input type='radio' value='" + Joove.OrderByDirections.ASC + "' name='" + column.name + "sorting' class='sorting-direction form-control' />                                        <span class='sort-direction-icon glyphicon glyphicon-arrow-down'></span>                                        <input type='radio' value='" + Joove.OrderByDirections.DESC + "' name='" + column.name + "sorting' class='sorting-direction form-control' />                                     </td>                                    <td class='cell-for-sorting'>                                         <input type='text' class='column-sort-order form-control' />                                     </td>                                </tr>");
                    $container.find(".preferences-table-body").append($line);
                    if (column.orderable === false) {
                        $line.find(".cell-for-sorting *").attr("disabled", "disabled");
                    }
                }
                for (var i = 0; i < this._orderBy.length; i++) {
                    var orderInfo = this._orderBy[i];
                    var column = orderInfo.column;
                    var $row = $container.find("[data-column='" + column.name + "']");
                    $row.find(".sorting-direction[value='" + orderInfo.direction + "']").attr("checked", "checked");
                    $row.find(".column-sort-order").val(parseInt(String(i + 1)));
                }
                $container.find(".move-row-up")
                    .on("click", function (evt) {
                    var $row = $(evt.target).closest("tr");
                    var $prevRow = $row.prev();
                    if ($prevRow.length === 0)
                        return;
                    $row.insertBefore($prevRow);
                    _this.flashElement($row);
                });
                $container.find(".move-row-down")
                    .on("click", function (evt) {
                    var $row = $(evt.target).closest("tr");
                    var $nextRow = $row.next();
                    if ($nextRow.length === 0)
                        return;
                    $row.insertAfter($nextRow);
                    _this.flashElement($row);
                });
            };
            return OrderDatasourceWidget;
        }(DatasourceWidget));
        Widgets.OrderDatasourceWidget = OrderDatasourceWidget;
    })(Widgets = Joove.Widgets || (Joove.Widgets = {}));
})(Joove || (Joove = {}));
