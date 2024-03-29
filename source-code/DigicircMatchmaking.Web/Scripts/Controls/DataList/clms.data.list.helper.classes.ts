﻿namespace Joove.Widgets {

    /*   Datalist Configuration Options
     *
     *   Used only for initialization and configuration. They do not change
     *   their values in runtime
     */
    export interface IDataListOptions {
        isStandAlone?: boolean;
        isPickList?: boolean;
        waitForPredefinedFilters?: boolean;
        showRowNumbers?: boolean;
        hasPaging?: boolean;
        displayRecordsInfoRow?: boolean;
        hasMultiSelect?: boolean;
        hasReorderableColumns?: boolean;
        hasResizableColumns?: boolean;
        canHideShowColumns?: boolean;
        canCopyToClipboard?: boolean;
        showRefreshButton?: boolean;
        isExportable?: boolean;
        isGroupable?: boolean;
        isSearchable?: boolean;
        importData?: boolean;
        saveViews?: boolean;
        structuredFiltering?: boolean;
        rememberSelectedItems?: boolean;
        rememberLastState?: boolean;
        predefinedGroups?: Array<any>;
        predefinedAggregators?: Array<any>;
        onUpdateAction?: any;
        pageSizes?: Array<number>;
        userCanSelectPageSize?: boolean;
        maxSelectedRows?: number;
        minColumnWidth?: number;
        useExportV2?: boolean;
        useCustomModal?: boolean;
    }

    /*   Datalist Status
     *
     *   This reflects the current state of the list. Changes its state
     *   and values with each action
     */
    export interface IDataListStatus {
        startRow: number;
        pageSize: number;
        columnInfo: Array<DataListColumnInfo>; //This contains the column information in the order as
        filters: Array<DataListFilterInfo>;
        orderBy: Array<OrderByInfo>;
        aggregators: Array<DataListAggregatorInfo>;
        groupBy: Array<DataListGroupByInfo>;
        getGroupsClosed: boolean;
        mergeGroupLevels: boolean;
        excludedKeys: Array<any>;
        selectedKeys: Array<any>;
        selectedItems: Array<any>;
        allKeysSelected: boolean;
        exportSettings: {
            type: string;
            range: string;
            fileName: string;
            exportTitle: string;
            includeGridLines: boolean;
            portraitOrientation: boolean;
            columnInfo: Array<DataListColumnInfo>;
            groupInfo: Array<DataListGroupByInfo>;
            headerColor: string;
            evenColor: string;
            oddColor: string;
            groupColor: string;
            aggregateColor: string;
        }
    }

    /*   Column Info
     *
     *   The configuration options for each column of the DataList control
     */
    export class DataListColumnInfo extends ColumnInfo {
        constructor(options) {
            super(Common.replaceAll(options.name, "\\.", "_"), options.dataType, options.formatting);
            this.mambaDataType = options.dataType;
            this.mambaDataTypeIsEnum = options.dataTypeIsEnum;
            this.dataType = options.dataType;
            this.caption = options.caption;
            this.visible = options.visible;
            this.groupable = options.groupable;
            this.searchable = options.searchable;
            this.orderable = options.orderable;
            this.editable = options.editable;
            this.style = options.style;
            this.classes = options.classes;
            this.itemType = options.itemType;
            this.importable = options.importable;
            this.supportsAggregators = options.supportsAggregators;
            this.width = options.width || null;
            this.minWidth = options.minWidth || null;
            this.customWidth = options.customWidth || null;
            this.length = options.length || null;
            this.css = options.css || "";
            this.isEncrypted = options.isEncrypted;
            this.showFullImage = options.showFullImage;
        }
        mambaDataType;
        mambaDataTypeIsEnum;
        caption;
        dataType;
        visible;
        groupable;
        searchable;
        orderable;
        editable;
        style;
        classes;
        itemType;
        importable;
        supportsAggregators;
        width;
        minWidth;
        customWidth;
        length: number;
        css: string;
        showFullImage: boolean;
    }

    /*   Filter Info
     *
     *   Helper class used in the list status that describes filtering information
     */
    export class DataListFilterInfo extends FilterInfo {
        constructor(columnInfo: ColumnInfo, value: any, rowOp: RowOperators, op: FilterOperators, secondValue: any, type: DataListFilterType, controlId?: string) {
            super(columnInfo, value, rowOp, op, secondValue);

            this.type = type;
            this.controlId = controlId;
        }

        type: DataListFilterType;
        controlId: string;
    }

    /*   Aggregator Info
     *
     *   Helper class used in the list status that describes aggregator information
     */
    export class DataListAggregatorInfo {

        constructor(column, type, formatting?) {
            this.column = column;
            this.type = type;
            this.formatting = formatting;
        }

        formatting: any;
        column: string;
        type: AggregatorTypes;
        enabled: boolean;
        encrypted: boolean;
    }

    /*   Group By Info
     *
     *   Helper class used in the list status that describes group by information
     */
    export class DataListGroupByInfo extends GroupByInfo {
        constructor(column, initialState?, getGroupsClosed?: boolean, inactive?: boolean) {
            super(column, initialState, inactive, getGroupsClosed);
        }
    }

    export enum DataListColumnItemType {
        HYPERLINK = 0,
        DOWNLOADLINK,
        CHECKBOX,
        IMAGEBOX,
        TEXTBOX,
        HTML
    }

    export enum DataListFilterType {
        Quick,
        Global,
        Custom
    }

}