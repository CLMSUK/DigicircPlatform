﻿namespace Joove.Widgets {

    export type DatasourceTerm = FilterInfo | GroupByInfo | OrderByInfo;

    export interface IDatasourceWidget {
        draw($target: JQuery);
        redraw(columns: DatasourceTerm[], options?: any);
        clear();
        getDataSourceTerms(options?: any): Array<DatasourceTerm>;
        getColumns(): ColumnInfo[];
    }

    export interface IGroupDatasourceWidgetResource {
        Column?;
        GroupingOrder?;
        GetGroupsClosed?;
    }

    export interface IOrderDatasourceWidgetResource {
        SortOrder?;
        Order?;
        Visible?;
        Column?;
        Sorting?;
    }

    export interface IExportDatasourceWidgetResource {
        ExportType;
        ExportRange;
        ExportRangeCurrent;
        ExportRange100;
        ExportRangeAll;
        FileName;
        ExportOnlyGroups;
        PortraitOrientation;
        IncludeGridLines;
        TotalNonGroupCount;
        DisplayColumns;
        GroupColor;
        HeaderColor;
        EvenColor;
        OddColor;
        AggregateColor;
    }

    export interface IFilterDatasourceWidgetResource {
        Or?: string;
        And?: string;
        Range?: string;
        Like?: string;
        EqualTo?: string;
        NotEqualTo?: string;
        GreaterThan?: string;
        GreaterThanOrEqualTo?: string;
        LessThan?: string;
        LessThanOrEqualTo?: string;
        HasValue?: string;
        HasNoValue?: string;
        DownloadCsv?: string;
        UploadCsv?: string;
        PreferedEncoding?: string;
        ColumnExport?: string;
        VisibleExport?: string;
        SumHeader?: string;
        AverageHeader?: string;
        CountHeader?: string;
        ViewName?: string;
        IsDefault?: string;
        SaveCurrentViewNameAlert?: string;
        OverwriteCurrentView?: string;
        DeleteCurrentViewCommand?: string;
        MakeDefaultConfirmation?: string;
        NoResults?: string;
        PreferencesPopUpTitle?: string;
        Apply?: string;
        ClearAll?: string;
        FiltersPopUpTitle?: string;
        Column?: string;
        GetGroupsClosed?: string;
        Operator?: string;
        Criteria?: string;
        RowOperator?: string;
        NoFiltersDefined?: string;
        AddFilter?: string;
        True?: string;
        False?: string;
        ShowQuickFilters?: string;
        HideQuickFilters?: string;
        ApplyQuickFilter?: string;
        ClearQuickFilter?: string;
        FiltersApplied?: string;
        SelectAllRecordsPromptText?: string;
    }

    export abstract class DatasourceWidget {
        protected _columns: Array<ColumnInfo>;
        protected _container: JQuery;
        protected _forceDraw: boolean;
        protected _controlName: string;

        constructor(options: {
            columns: Array<ColumnInfo>;
            container?: JQuery;
            forceDraw?: boolean;
            controlName?: string;
        }) {
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

        protected findColumnInfoByName(name) {
            for (let i = 0; i < this._columns.length; i++) {
                if (this._columns[i].name === name) {
                    this._columns[i].mambaDataType = this._columns[i].dataType;
                    return this._columns[i];
                }
            }
            return null;
        }

        protected flashElement($element) {
            var initalBGcolor = $element.css("background-color");

            $element.animate({
                    opacity: 0.5,
                    "background-color": "#99ccff"
                },
                750,
                () => {
                    $element.animate({
                            opacity: 1,
                            "background-color": initalBGcolor
                        },
                        750,
                        () => {
                            if (initalBGcolor !== "rgba(0, 0, 0, 0)") return;
                            $element.css("background-color", "");
                        });
                });
        }

        protected retrieveColumnInfo(cb?: Function): void {
            if (this._columns == null || this._columns.length === 0) {
                Core.executeControllerAction(Core.getControllerForElement(this._container),
                    this._controlName + "_ColumnInfo",
                    "GET",
                    null,
                    null,
                    null,
                    (data) => {
                        for (let i = 0; i < data.length; i++) {
                            const current = data[i];
                            this._columns.push(new ColumnInfo(current.Name, current.MambaDataType, current.Formatting));
                        }
                        cb && cb();
                    });
            } else {
                cb && cb();
            }
        }

        abstract draw($target: JQuery);

        abstract getDataSourceTerms(options?: any): Array<DatasourceTerm>;

        abstract getColumns(): ColumnInfo[];

        abstract redraw(columns: DatasourceTerm[], options?: any);

        clear() {
            this.redraw([]);
        }
    }

    export class FilterDatasourceWidget extends DatasourceWidget {
        protected _resources: IFilterDatasourceWidgetResource;
        protected _filters: Array<FilterInfo>;
        private _rowOperators: Array<{ value: RowOperators, text: string }>;
        private _operators: Array<{ value: FilterOperators, text: string }>;

        constructor(options: {
            columns: ColumnInfo[];
            container?: JQuery;
            resources?: IFilterDatasourceWidgetResource;
            filters?: FilterInfo[];
            forceDraw?: boolean;
            controlName?: string;
        }) {
            super(options);
            this._resources = options.resources || window._resourcesManager.resources;
            this._filters = options.filters || [];

            this._rowOperators = [
                { value: RowOperators.NONE, text: "" },
                { value: RowOperators.OR, text: this._resources.Or },
                { value: RowOperators.AND, text: this._resources.And }
            ];
            this._operators = [
                { value: FilterOperators.NONE, text: "" },
                { value: FilterOperators.RANGE, text: this._resources.Range },
                { value: FilterOperators.LIKE, text: this._resources.Like },
                { value: FilterOperators.EQUAL_TO, text: this._resources.EqualTo },
                { value: FilterOperators.NOT_EQUAL_TO, text: this._resources.NotEqualTo },
                { value: FilterOperators.GREATER_THAN, text: this._resources.GreaterThan },
                { value: FilterOperators.GREATER_THAN_OR_EQUAL_TO, text: this._resources.GreaterThanOrEqualTo },
                { value: FilterOperators.LESS_THAN, text: this._resources.LessThan },
                { value: FilterOperators.LESS_THAN_OR_EQUAL_TO, text: this._resources.LessThanOrEqualTo },
                { value: FilterOperators.HAS_VALUE, text: this._resources.HasValue },
                { value: FilterOperators.HAS_NO_VALUE, text: this._resources.HasNoValue }
            ];

            if (this._forceDraw) this.draw(options.container);
        }

        getColumns(): ColumnInfo[] {
            return this._columns;
        }

        draw($target: JQuery) {
            if (this._container == null)
                this._container = $target;

            this.retrieveColumnInfo(() => {
                const $content = $(this.drawPreferences());
                this.populate($content);
                $target.append($content);
            });
        }

        redraw(terms: DatasourceTerm[], options?: any) {
            this._container.empty();
            this._filters = terms as any;
            if (options) {
                this._columns = options.columns || this._columns;
            }
            this.draw(this._container);
        }

        getDataSourceTerms(options?: any): Array<DatasourceTerm> {
            let $filterRows = this._container.find(".filter-row");
            const filters = [];

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
                if (DatasourceManager.isMambaDataTypeNumber(dataType)) value = Common.forceNumberFormat(value);

                // Quick Validation
                if (operator === String(FilterOperators.NONE) || // Operator not set
                    ((value == null || typeof (value) == "undefined" || value.trim().length === "") &&
                        // Null or Undefined Value
                        operator !== FilterOperators.HAS_VALUE &&
                        operator !== FilterOperators.HAS_NO_VALUE) || // Empty Value
                    (rowOperator === RowOperators.NONE && i < $filterRows.length - 1)) {
                    // Row Operator not set (allowed only for last filter)

                    foundError = true;
                    $row.addClass("danger");
                    continue;
                } else if (operator === FilterOperators.RANGE) {
                    if (value.trim().length === "" || // Empty Value
                        additionalValue.trim().length === "" || // Empty Additional Value
                        (rowOperator === RowOperators.NONE && i < $filterRows.length - 1)) {
                        // Row Operator not set (allowed only for last filter)) {

                        foundError = true;
                        $row.addClass("danger");
                        continue;
                    }
                }

                $row.removeClass("danger");

                if (dataType === "DateTime") {
                    value = Common.getUtcDateFromRawString(value, DatePicker.getFormatOfDate(format, true));

                    if (operator === FilterOperators.RANGE) {
                        additionalValue = Common
                            .getUtcDateFromRawString(additionalValue, DatePicker.getFormatOfDate(format, true));
                    }
                }

                //Operator Equals / NotEquals handle
                if (operator === FilterOperators.HAS_VALUE || operator === FilterOperators.HAS_NO_VALUE
                ) value = "";

                filters.push(new FilterInfo(this.findColumnInfoByName(column),
                    value,
                    rowOperator,
                    operator,
                    additionalValue));
            }

            if (foundError) {
                alert("Please fill in all required filter fields.");
                return null;
            }

            this._filters = filters;

            return this._filters;
        }

        private drawFilters($contents: JQuery) {
            for (let i = 0; i < this._filters.length; i++) {
                const currentFilter = this._filters[i];
                const currentColumn = currentFilter.column;
                const $line = this.createFilterRow($contents);
                $line.find(".available-columns").val(currentFilter.column.name);
                $line.find(".available-operators").val(String(currentFilter.operator));
                $line.find(".filter-value-container")
                    .children()
                    .toggle(currentFilter.operator !== FilterOperators.HAS_VALUE &&
                        currentFilter.operator !== FilterOperators.HAS_NO_VALUE);
                this.handleFilterRow($line, currentColumn.mambaDataType, currentFilter.operator, currentFilter.value);

                // Last Filter's Row Operator must be NONE
                if (i < this._filters.length - 1) {
                    $line.find(".available-row-operators").val(String(currentFilter.rowOperator));
                }
                $contents.find(".filters-table-body").append($line);
            }
        }

        private populate($contents: JQuery) {
            const self = this;

            if (this._filters.length === 0) {
                $contents.find(".filters-table").hide();
                $contents.closest(".empty-filter-list").show();
            } else {
                $contents.find(".filters-table").show();
                $contents.closest(".empty-filter-list").hide();
            }

            this.drawFilters($contents);

            $contents.find(".add-filter-btn")
                .on("click",
                    (e: JQueryEventObject) => {
                        $(e.target).parent().hide();
                        $contents.find(".filters-table").show();
                        const $filterRow = self.createFilterRow($contents);
                        $contents.find(".filters-table-body").append($filterRow);
                        self.handleFilterRow($filterRow);
                    });
        }

        private createFilterRow($container?): JQuery {
            const self = this;

            const $lineTemplate = $("<tr class='filter-row'> \
                                        <td><select class='available-columns form-control'></select></td> \
                                        <td><select class='available-operators form-control'></select></td> \
                                        <td class='filter-value-container'></td> \
                                        <td><select class='available-row-operators form-control'></select></td> \
                                        <td><span class='remove-filter glyphicon glyphicon-remove'></span></td> \
                                    </tr>");


            for (let i = 0; i < this._rowOperators.length; i++) {
                const option = $(`<option value='${this._rowOperators[i]
                    .value}'>${this._rowOperators[i].text}</option>`);
                $lineTemplate.find(".available-row-operators").append(option);
            }

            for (let i = 0; i < this._operators.length; i++) {
                const option = $(`<option value='${this._operators[i].value}'>${this._operators[i].text}</option>`);
                $lineTemplate.find(".available-operators").append(option);
            }

            for (let i = 0; i < this._columns.length; i++) {
                if (this._columns[i].searchable === false) continue;
                const option = $(`<option value='${this._columns[i]
                    .name}'>${this._columns[i].caption}</option>`);
                $lineTemplate.find(".available-columns").append(option);
            }

            $lineTemplate.find(".remove-filter")
                .on("click",
                    (e: JQueryEventObject) => {
                        $(e.target).closest("tr").remove();

                        if ($container.find(".filter-row").length > 0) return;

                        $container.find(".filters-table").hide();
                        $container.closest(".empty-filter-list").show();
                    });

            $lineTemplate.find(".available-row-operators")
                .on("change",
                    (e: JQueryEventObject) => {
                        const $parentRow = $(e.target).closest("tr");
                        if (!$parentRow.is(":last-child")) return;

                        if ($(e.target).val() === RowOperators.NONE) return;

                        const $filterRow = self.createFilterRow($container);

                        $parentRow.after($filterRow);

                        self.handleFilterRow($filterRow);
                    });


            $lineTemplate.find(".available-columns, .available-operators")
                .on("change",
                    (e: JQueryEventObject) => {
                        const $parentRow = $(e.target).closest("tr");
                        self.handleFilterRow($parentRow);
                    });

            return $lineTemplate;
        }

        private drawPreferences() {
            return `<div class='list-filters-container'> \
            <table class='filters-table table table-hover'> \
                <thead>\
                    <th>${this._resources.Column}</th>\
                    <th>${this._resources.Operator}</th>\
                    <th>${this._resources.Criteria}</th>\
                    <th>${this._resources.RowOperator}</th>\
                    <th></th>\
                </thead>\
                <tbody class='filters-table-body'> \
                </tbody> \
            </table> \
        </div> \
        <div class='empty-filter-list'>\
            <!-- <span>${this._resources.NoFiltersDefined}</span>\
            <br/><br/> -->\
            <button type='button' class='btn btn-default add-filter-btn'>${this._resources.AddFilter}</button> \
        </div>`;
        }

        private handleFilterRow($container: JQuery, dataType?: string, operator?: FilterOperators, value?) {
            if ($container == null) return;

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
            $availableOperators.find(`option[value='${FilterOperators.RANGE}']`)
                .toggle(dataType === "DateTime");
            $availableOperators.find(`option[value='${FilterOperators
                    .GREATER_THAN}'], [value='${FilterOperators
                    .GREATER_THAN_OR_EQUAL_TO}'], [value='${FilterOperators.LESS_THAN}'], [value='${
                    FilterOperators.LESS_THAN_OR_EQUAL_TO}']`)
                .toggle(DatasourceManager.isMambaDataTypeNumber(dataType) || dataType === "DateTime");

            //Remove invalid selected operators
            var nonNumericInvalidOperators = [
                FilterOperators.GREATER_THAN, FilterOperators.GREATER_THAN_OR_EQUAL_TO,
                FilterOperators.LESS_THAN, FilterOperators.LESS_THAN_OR_EQUAL_TO
            ];
            if ((dataType !== "DateTime" && $availableOperators.val() === FilterOperators.RANGE) || //Datetime
            (!DatasourceManager.isMambaDataTypeNumber(dataType) &&
                dataType !== "DateTime" &&
                $.inArray($availableOperators.val(), nonNumericInvalidOperators) > 0)) { //Non-numeric
                $availableOperators.val("");
            }

            //Hide input controls on has/not value
            if (operator !== FilterOperators.HAS_VALUE && operator !== FilterOperators.HAS_NO_VALUE) {
                $filterValue.children().show();
            } else {
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

            var $boolTemplate = `<input type='radio' name='bool-val-${columnInfo.name}-${
                $container.siblings().length + 1}' value='true'> \
                                <span>True</span> \
                                <br /> \
                                <input type='radio' name='bool-val-${columnInfo.name}-${
                $container.siblings().length + 1}' value='false'> \
                                <span>False</span> \
                                <input type='hidden' class='filter-value' />`;
            switch (dataType) {

            case "bool":
                if (currentTemplate === "bool") return;
                $filterValue.children().remove();
                $filterValue.append($boolTemplate);
                $filterValue.attr("template", "bool");
                $filterValue.find("input[type='radio']")
                    .on("click",
                        (event: JQueryEventObject) => {
                            $(event.target).siblings(".filter-value").val($(event.target).val());
                        });
                if (value) {
                    $filterValue.find(`input[type='radio'][value='${value}']`).attr("checked", "checked");
                    $filterValue.find(".filter-value").val(value);
                }
                break;

            case "DateTime":
                if (operator === FilterOperators.RANGE) {
                    if (currentTemplate === "dateRange") return;
                    $filterValue.children().remove();
                    $filterValue.append($dateRangeTemplate);
                    $filterValue.attr("template", "dateRange");

                    DatePicker.convertElementToDatePicker($filterValue.find(".filter-value, .additional-filter-value"),
                        columnInfo.formatting);

                    $filterValue.find(".filter-value")
                        .on("change",
                            (event: JQueryEventObject) => {
                                if ($filterValue.find(".additional-filter-value").val().length === 0) {
                                    $filterValue.find(".additional-filter-value").val($(event.target).val());
                                }
                            });

                    if (value) {
                        try {
                            var multipleValues = value.split("|");
                            $filterValue.find(".filter-value").val(multipleValues[0]);
                            $filterValue.find(".additional-filter-value").val(multipleValues[1]);
                        } catch (e) {
                            console.log("Error setting date ranges");
                        }
                    }
                } else {
                    if (currentTemplate === "simpleDate") return;
                    $filterValue.children().remove();
                    $filterValue.append($defaultTemplate);
                    $filterValue.attr("template", "simpleDate");

                    DatePicker.convertElementToDatePicker($filterValue.find(".filter-value"), columnInfo.formatting);

                    if (value) $filterValue.find(".filter-value").val(value);
                }
                break;

            default:
                if (currentTemplate === "default") return;
                $filterValue.children().remove();
                $filterValue.append($defaultTemplate);
                $filterValue.attr("template", "default");
                if (value) $filterValue.find(".filter-value").val(value);
                break;
            }

        }
    }

    export class QuickFilterDatasourceWidget extends FilterDatasourceWidget {
        draw($target: JQuery) {
            if (this._container == null)
                this._container = $target;

            this.retrieveColumnInfo(() => {
                const $content = $(this.drawQuickFilterLayout());
                this.populateQuickFilters($content);
                $target.append($content);
            });
        }

        getDataSourceTerms(options?): DatasourceTerm[] {
            const $target = $(".filter-row", this._container);
            const filters = [];
            for (let i = 0; i < $target.length; i++) {
                const $row = $($target[i]);
                const columnFilter = $row.find(".filter-value").val();
                if (columnFilter.length === 0) continue;

                const column = this.findColumnInfoByName($row.find(".column-name").data("column-name"));
                const filter = new FilterInfo(column, columnFilter, RowOperators.AND, FilterOperators.LIKE, "");
                filters.push(filter);
            }

            if (filters.length === 1) {
                filters[0].rowOperator = RowOperators.NONE;
            }

            return filters;
        }

        getColumns(): ColumnInfo[] {
            return this._columns;
        }

        redraw(terms: DatasourceTerm[]) {
            this._container.empty();
            this._filters = terms as any;
            this.draw(this._container);
        }

        private drawQuickFilterLayout(): string {
            return `<div class='list-filters-container'> \
                        <br /> \
                        <table class='filters-table table table-hover'> \
                            <tbody class="filters-table-body"> \
                            </tbody> \
                        </table> \
                    </div>`;
        }

        private populateQuickFilters($content: JQuery) {
            const $target = $(".filters-table-body", $content);
            for (let i = 0; i < this._columns.length; i++) {
                const col = this._columns[i];
                const row = `<tr class="filter-row">
                                <th style="vertical-align: middle;" class="col-xs-2 column-name" data-column-name="${
                    col.name}">${col.name}</th>
                                <td class="col-xs-10"><input class="filter-value" style="width: 100%;"/></td>
                            </tr>`;
                $target.append(row);
            }
        }
    }

    export class GroupDatasourceWidget extends DatasourceWidget {
        private _resources: IGroupDatasourceWidgetResource;
        private _groupBy: Array<GroupByInfo>;
        private _getGroupsClosed: boolean;

        constructor(options: {
            columns: Array<ColumnInfo>;
            container?: JQuery;
            resources?: IGroupDatasourceWidgetResource;
            groupBy?: Array<GroupByInfo>;
            groupsClosed?: boolean;
            controlName?: string;
        }) {
            super(options);

            this._resources = options.resources || window._resourcesManager.resources;
            this._groupBy = options.groupBy;
            this._getGroupsClosed = options.groupsClosed;

            if (this._forceDraw) this.draw(options.container);
        }

        getColumns(): ColumnInfo[] {
            return this._columns;
        }

        draw($target: JQuery) {
            if (this._container == null)
                this._container = $target;

            this.retrieveColumnInfo(() => {
                const $content = $(this.getGroupingPreferencesMarkUp());
                this.populateGroupPreferencesContainer($content);
                $target.append($content);
            });
        }
        
        redraw(terms: DatasourceTerm[], options?: any) {
            this._container.empty();
            if (options) {
                this._columns = options.columns || this._columns;
            }
            this._groupBy = terms as any;
            this.draw(this._container);
        }

        getDataSourceTerms(options: any = {}): DatasourceTerm[] {
            const $grouped = this._container.find(".grouping-columns");
            const $groups = $grouped.children();
            const groupsArray = [];

            options.getGroupsClosed = options.getGroupsClosed ||
                this._container.find(".get-groups-closed").is(":checked");

            for (let i = 0; i < $groups.length; i++) {
                groupsArray.push(this.findColumnInfoByName($groups.eq(i).val()));
            }

            const groupBy = [];

            for (let i = 0; i < groupsArray.length; i++) {
                const state = options.getGroupsClosed === true && i === groupsArray.length - 1
                    ? "COLLAPSED"
                    : "EXPANDED";
                //groupBy.push(new Widgets.ListGroupByInfo(groupsArray[i], state, options.getGroupsClosed));
            }

            return groupBy;
        }

        getGroupingPreferencesMarkUp() {
            return `<div class='list-groups-container collapsible-grid-main-container'> \
            <table class='groups-table table'> \
                <thead>\
                    <th>${this._resources.Column}</th>\
                    <th></th>\
                    <th>${this._resources.GroupingOrder}</th>\
                    <th></th>\
                </thead>\
                <tbody class='filters-table-body'> \
                    <tr> \
                        <td> \
                            <select class='available-columns' multiple='multiple'> \
                            </select> \
                        </td> \
                        <td> \
                            <button type='button' class='btn btn-default add-group'><span class='glyphicon glyphicon-arrow-right'></span></button>\
                            <br/> \
                            <button type='button' class='btn btn-default remove-group'><span class='glyphicon glyphicon-arrow-left'></span></button>\
                        </td> \
                        <td> \
                            <select class='grouping-columns' multiple='multiple'> \
                            </select> \
                        </td> \
                        <td> \
                            <button class='btn btn-default move-up'><span class='glyphicon glyphicon-arrow-up'></span></button>\
                            <br/> \
                            <button class='btn btn-default move-down'><span class='glyphicon glyphicon-arrow-down'></span></button>\
                        </td> \
                </tbody> \
                <tfoot>\
                    <tr>\
                        <td colspan='4' style='text-align: left; padding-left: 15px'>\
                            <span>${this._resources.GetGroupsClosed}</span> \
                            <input type='checkbox' style='display: inline-block; position: relative; top: 3px; left: 10px' class='get-groups-closed'/>\
                        </td>\
                    </tr>\
                </tfoot>\
            </table> \
        </div>`;
        }

        populateGroupPreferencesContainer($container) {
            var $available = $container.find(".available-columns");
            var $grouped = $container.find(".grouping-columns");

            $container.find(".get-groups-closed").prop("checked", this._getGroupsClosed);
            for (let i = 0; i < this._columns.length; i++) {
                const columnName = this._columns[i].name;

                if (this._columns[i].groupable === false) continue;

                const option = `<option value='${columnName}'>${this._columns[i].caption}</option>`;

                $available.append(option);
            }

            for (let i = 0; i < this._groupBy.length; i++) {
                const column = this._groupBy[i].column;
                $container.find(".get-groups-closed").prop('checked', this._groupBy[i].getGroupsClosed);
                const option = `<option value='${column.name}'>${column.caption}</option>`;
                $grouped.append(option);

                $available.find(`option[value='${column.name}']`).hide();
            }

            $container.find(".add-group")
                .on("click",
                    () => {
                        const $selected = $available.find(":selected");
                        for (let i = 0; i < $selected.length; i++) {
                            if ($grouped.find(`option[value='${$selected.eq(i).val()}']`).length === 0) {
                                $grouped.append($selected.eq(i).clone());
                                $selected.eq(i).hide();
                            }
                        }
                        if ($available.children(":visible").length > 0) {
                            $available.val($available.children(":visible:first").val()).focus();
                        }
                    });

            $container.find(".remove-group")
                .on("click",
                    () => {
                        const $selected = $grouped.find(":selected");
                        for (let i = $selected.length - 1; i >= 0; i--) {
                            $available.find(`option[value='${$selected.eq(i).val()}']`).show();
                        }
                        $selected.remove();
                        if ($grouped.children(":visible").length > 0) {
                            $grouped.val($grouped.children(":visible:first").val()).focus();
                        }
                    });

            $container.find(".move-up")
                .on("click",
                    () => {
                        const $selected = $grouped.find(":selected");
                        $selected.eq(0).prev().before($selected);
                    });

            $container.find(".move-down")
                .on("click",
                    () => {
                        const $selected = $grouped.find(":selected");
                        $selected.eq($selected.length - 1).next().after($selected);
                    });

            $available.on("dblclick",
                () => {
                    $container.find(".add-group").click();
                });

            $grouped.on("dblclick",
                () => {
                    $container.find(".remove-group").click();
                });
        }
    }

    export class OrderDatasourceWidget extends DatasourceWidget {
        private _resources: IOrderDatasourceWidgetResource;
        private _orderBy: Array<OrderByInfo>;

        constructor(options: {
            columns: Array<ColumnInfo>;
            container?: JQuery;
            resources: IOrderDatasourceWidgetResource;
            orderBy?: Array<OrderByInfo>;
            controlName?: string;
        }) {
            super(options);

            this._resources = options.resources || window._resourcesManager.resources;
            this._orderBy = options.orderBy;

            if (this._forceDraw) this.draw(options.container);
        }

        draw($target: JQuery) {
            if (this._container == null)
                this._container = $target;

            this.retrieveColumnInfo(() => {
                const $content = $(this.getViewPreferencesMarkUp());
                this.populatePreferencesContainer($content);
                $target.append($content);
            });
        }

        redraw(terms: DatasourceTerm[], options?: any) {
            this._container.empty();
            if (options) {
                this._columns = options.columns || this._columns;
            }
            this._orderBy = terms as any;
            this.draw(this._container);
        }

        getColumns(): ColumnInfo[] {
            return this._columns;
        }

        getDataSourceTerms(options?): DatasourceTerm[] {
            const $rows = this._container.find(".row-preference");

            const columns = [];
            const orderInfos = [];

            let visibleFound = false;
            let visibilityChanged = false;

            for (let i = 0; i < $rows.length; i++) {
                const $row = $rows.eq(i);
                const columnName = $row.data("column");
                const sortOrder = $row.find(".column-sort-order").val().trim();
                const direction = $row.find(".sorting-direction:checked").val();
                const isVisible = $row.find(".column-is-visible").is(":checked");

                const originalColumn = this.findColumnInfoByName(columnName);

                if (isVisible) visibleFound = true;

                if (isVisible !== originalColumn.isVisible) visibilityChanged = true;

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

                if (sortOrder.length === 0) continue;

                //orderInfos.push(new Widgets.ListOrderByInfo(column, direction, sortOrder));
            }

            // Quick Validation
            if (visibleFound === false) {
                alert("Please select at least one visible column.");
                return [];
            }

            // Sort by Sort Order
            orderInfos.sort((a, b) => {
                if (a.sortOrder < b.sortOrder) return -1;
                if (a.sortOrder > b.sortOrder) return 1;
                return 0;
            });

            // Column Visibility changed. Reset widths, so that they are recalculated
            if (visibilityChanged) {
                for (let i = 0; i < columns.length; i++) {
                    columns[i].width = null;
                }
            }

            this._columns = columns;

            return orderInfos;
        }

        private getViewPreferencesMarkUp() {
            return `<div class='preferences-container collapsible-grid-main-container'> \
            <table class='preferences-table table table-hover'> \
                <thead>\
                    <th>${this._resources.Order}</th>\
                    <th>${this._resources.Visible}</th>\
                    <th>${this._resources.Column}</th>\
                    <th>${this._resources.Sorting}</th>\
                    <th>${this._resources.SortOrder}</th>\
                </thead>\
                <tbody class='preferences-table-body'> \
                </tbody> \
            </table> \
        </div>`;
        }

        private populatePreferencesContainer($container) {
            for (let i = 0; i < this._columns.length; i++) {
                const column = this._columns[i];
                const checkedAttr = column.isVisible === true ? "checked='checked'" : "";

                const $line = $(`<tr class='row-preference' data-column='${column.name}'>\
                                    <td style='text-align: center'>\
                                        <span class='move-row-up glyphicon glyphicon-chevron-up'></span>\
                                        <span class='move-row-down glyphicon glyphicon-chevron-down'></span>\
                                    </td>\
                                    <td style='text-align: center'>\
                                        <input type='checkbox' class='column-is-visible' ${checkedAttr}/>\
                                    </td>\
                                    <td>${column.caption}</td>\
                                    <td class='cell-for-sorting'> \
                                       <span class='sort-direction-icon glyphicon glyphicon-arrow-up'></span> \
                                       <input type='radio' value='${OrderByDirections.ASC}' name='${column.name
                    }sorting' class='sorting-direction form-control' /> \
                                       <span class='sort-direction-icon glyphicon glyphicon-arrow-down'></span> \
                                       <input type='radio' value='${OrderByDirections.DESC}' name='${column.name
                    }sorting' class='sorting-direction form-control' /> \
                                    </td>\
                                    <td class='cell-for-sorting'> \
                                        <input type='text' class='column-sort-order form-control' /> \
                                    </td>\
                                </tr>`);

                $container.find(".preferences-table-body").append($line);

                if (column.orderable === false) {
                    $line.find(".cell-for-sorting *").attr("disabled", "disabled");
                }
            }

            for (let i = 0; i < this._orderBy.length; i++) {
                const orderInfo = this._orderBy[i];
                const column = orderInfo.column;
                const $row = $container.find(`[data-column='${column.name}']`);

                $row.find(`.sorting-direction[value='${orderInfo.direction}']`).attr("checked", "checked");
                $row.find(".column-sort-order").val(parseInt(String(i + 1)));
            }

            $container.find(".move-row-up")
                .on("click",
                    (evt: JQueryEventObject) => {
                        const $row = $(evt.target).closest("tr");
                        const $prevRow = $row.prev();

                        if ($prevRow.length === 0) return;

                        $row.insertBefore($prevRow);

                        this.flashElement($row);
                    });

            $container.find(".move-row-down")
                .on("click",
                    (evt: JQueryEventObject) => {
                        const $row = $(evt.target).closest("tr");
                        const $nextRow = $row.next();

                        if ($nextRow.length === 0) return;

                        $row.insertAfter($nextRow);

                        this.flashElement($row);
                    });
        }

    }

}