﻿namespace Joove.Widgets {

    export abstract class ListControlBase {
        filterWidget: Widgets.FilterDatasourceWidget;
        groupWidget: Widgets.GroupDatasourceWidget;
        orderWidget: Widgets.OrderDatasourceWidget;

        filterPopUpWidget: Widgets.FilterDatasourceWidget;
        groupPopUpWidget: Widgets.GroupDatasourceWidget;
        orderPopUpWidget: Widgets.OrderDatasourceWidget;

        MAX_ROWS: number;
        errorOccured: boolean;
        viewsCache: any;
        resources: IListControlResource;
        Groups;

        $list: JQuery = null;
        $listHeader: JQuery = null;
        $listColumnHeaderContainer: JQuery = null;
        $listColumnHeader: JQuery = null;
        $listDataContainer: any = null;
        $listData: JQuery = null;
        $listPager: JQuery = null;
        $listFooter: JQuery = null;
        $listFooterContainer: JQuery = null;
        $listVerticalScrollbar: any = null;
        $listHorizontalScrollbar: any = null;
        $titleContextMenu: JQuery = null;
        $rowContextMenu: JQuery = null;
        $listDockedGrids: JQuery = null;
        $predefinedFiltersFieldSet: JQuery = null;

        showInitializationLoadingTimeout: any = null;
        refreshDimentionsInterval: any  = null;
        refreshDimetionsCounter: number;

        focusOnElement: string;

        resizeTime: Date;
        resizeDelta: number;
        resizeTimeout: boolean;
        elementId: string = null;
        serverSideElementId: string = null;
        draggablePreferencesPosition = null;
        draggableFiltersPosition = null;
        draggableGroupingPosition = null;
        $preferencesContainer = null;
        $filtersContainer = null;
        $groupsContainer = null;

        isPreferencesMinimized: boolean;
        isFiltersMinimized: boolean;
        isGroupsMinimized: boolean;

        scrollLock = null;
        scrollTimeout = null;
        isMobileMode: boolean;
        hidingData: boolean;
        initiallySelectedKeys = null;

        openedGroups = [];

        requestIsPending: boolean;

        currentRowNumber: number;

        status: IListControlStatus;

        aggregatorsData = null;

        groupsDataInfoArray = null;

        defaultStatus: IListControlStatus;

        isInitialized: boolean;

        timeout: number; // add this to list control options, currently are the same with picklist

        data = null;
        groups = null;
        ruleEvaluations: Array<Joove.DataSetRuleEvaluationResult> = null;

        requestQueue = [];

        $ownerButton = null;

        options: IListControlOptions;
    }

    export interface IListPopUpOptions {
        name?: string;
        width?: string;
        height?: string,
        cancelButton?: boolean;
        okButton?: boolean;
        okCallback?($container: JQuery);
        title?: string;
        $elementContent?: JQuery;
        cssClass?: string;
    }

    export interface IListControlInstance {
        id: string;
        instance: ListControl;
    }

    export interface IUpdateOptionsListTable {
        createListHeader?: boolean;
        createListColumnHeader?: boolean;
        createListData?: boolean;
        updateUiElements?: boolean;
        createRecordSetAggregators?: boolean;
        updateGroupAggregators?: boolean;
        keepAggregatorsOfFullRecordSet?: boolean;
        updateActionButtonVisibility?: boolean;
        refreshDimensions?: boolean;
        applyConditionalFormattings?: boolean;
    }

    export interface IListControlOptions {
        $container;
        selectedRowClass: string;
        hoverRowClass: string;
        showRowNumbers: boolean;
        usePopUpsForPreferences: boolean;
        pagerPosition: string;
        useContextMenuForRowActions: boolean;
        runRefreshDimentionsAtIntervals: boolean;
        refreshDimentionsInterval: number;
        maxIterationsForRefreshDimentions: number;
        isPickList?: boolean;
        pageSize?: number;
        waitForPredefinedFilters?: boolean;
        excludeSelected?: boolean;
        hiddenColumns?: any;
        predefinedGroups?: Array<any>;
        userCanSelectPageSize?: boolean;
        isPaged?: boolean;
        url?: string;
        standAlone?: boolean;
        predefinedAggregators?: any;
        parentForm?;
        stripped?: boolean;
        hasMultiselection?: boolean;
        hasResizableColumns?;
        enableCompactText?: boolean;
        displayRecordInfo?;
        useCustomScrollbar?;
        isSearchable?: boolean;
        isExportable?: boolean;
        isImportable?: boolean;
        hasPreferences?: boolean;
        isGroupable?: boolean;
        recordsInfoRow?: boolean;
        hasReorderableColumns?: boolean;
        showCellDataOnHover?: boolean;
        onUpdateAction?;
    }

    export interface IActionOptions {
        handler?: string;
        action?: string;
        rowSize?: string;
        startRow?: string;
        listName?: string;
        viewName?: string;
    }

    export interface IListControlStatus {
        currentPage: number;
        selectedItemKeys: Array<any>;
        startRow: number;
        endRow: number;
        pageSize: number;
        totalRows: number;
        totalPages: number;
        filters: Array<ListFilter>;
        orderBy: Array<ListOrderByInfo>;
        groupBy: Array<ListGroupByInfo>;
        columns: Array<ListControlColumn>;
        aggregators?: Array<any>;
        currentView: any;
        getGroupsClosed?: boolean;
        allRecordsSelected: boolean;
        horizontalScrollPosition?: number;
        verticalScrollPosition?: number;
        hiddenColumns?: Array<any>;
    }

    export interface IListControlResource {
        // ReSharper disable InconsistentNaming
        DeleteCurrentViewConfirmation?: string;
        PredefinedView?;
        DisplayGroupItems?;
        Unsort?;
        SortASC?;
        SortDESC?;
        Search?;
        RefreshTooltip?;
        PrevStateTooltip?;
        PreferencesTooltip?;
        FiltersTooltip?;
        GroupingOrder?;
        Export?;
        Import?;
        ResetTooltip?;
        MakeDefault?;
        SaveCurrentView?;
        DeleteCurrentView?;
        ShowQuickFilters?;
        FiltersApplied?;
        ClearAggregators?;
        CommonActions?;
        MoveColumnLeft?;
        MoveColumnRight?;
        True?;
        False?;
        ClearQuickFilter?;
        ApplyQuickFilter?;
        Page?;
        Of?;
        Pages?;
        FirstPageTooltip?;
        PrevPageTooltip?;
        NextPageTooltip?;
        LastPageTooltip?;
        Items?;
        PerPage?;
        GrandTotal?: string;
        PageTotal?: string;
        GrandAverage?: string;
        PageAverage?: string;
        GrandCount?: string;
        PageCount?: string;
        CalculateSum?;
        CalculateAverage?;
        CalculateCount?;
        DeselectAllPageRecordsText?;
        SelectAllPageRecordsText?;
        DeselectAllRecordsPromptText?;
        SelectAllRecordsPromptText?;
        RequiredFiltersMissingTitle?;
        RequiredFiltersMissingMessage?;
        HideQuickFilters?: string;
        ResetConfirmation?: string;
        Cancel?;
        Ok?;
        Or?;
        And?;
        Range?;
        Like?;
        EqualTo?;
        NotEqualTo?;
        GreaterThan?;
        GreaterThanOrEqualTo?;
        LessThan?;
        LessThanOrEqualTo?;
        HasValue?;
        HasNoValue?;
        DownloadCsv?;
        UploadCsv?;
        PreferedEncoding?;
        ColumnExport?;
        VisibleExport?;
        SumHeader?;
        AverageHeader?;
        CountHeader?;
        ViewName?;
        IsDefault?;
        SaveCurrentViewNameAlert?;
        OverwriteCurrentView?: string;
        DeleteCurrentViewCommand?;
        MakeDefaultConfirmation?: string;
        NoResults?;
        PreferencesPopUpTitle?;
        Apply?;
        ClearAll?;
        FiltersPopUpTitle?;
        Column?;
        GetGroupsClosed?;
        Operator?;
        Criteria?;
        RowOperator?;
        NoFiltersDefined?;
        AddFilter?;
        Order?;
        Visible?;
        Sorting?;
        SortOrder?;
        ExportType?;
        ExportRange?;
        ExportRangeCurrent?;
        ExportRange100?;
        ExportRangeAll?;
        FileName?;
        ExportOnlyGroups?;
        PortraitOrientation?;
        IncludeGridLines?;
        TotalNonGroupCount?;
        DisplayColumns?;
        GroupColor?;
        HeaderColor?;
        EvenColor?;
        OddColor?;
        AggregateColor?;
    }

    export class ListControlColumn extends ColumnInfo {

        constructor(options) {
            super(Common.replaceAll(options.name, "\\.", "_"), options.dataType, options.formatting);

            this.mambaDataType = options.dataType;
            this.dataType = options.dataType;
            this.caption = options.caption;
            this.isVisible = options.isVisible;
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
        }

        mambaDataType;
        caption;
        dataType;
        isVisible;
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
    }

    export class ListFilter extends FilterInfo {

        type;
        additionalValue;

        constructor(column: ListControlColumn, operator, value, rowOperator, type, additionalValue?) {
            super(column, value, rowOperator, operator, additionalValue);

            this.type = type;
            this.additionalValue = additionalValue;
        }
    }

    export class ListOrderByInfo extends OrderByInfo {

        constructor(column, direction, sortOrder?) {
            super(column, direction);
            this.sortOrder = sortOrder;
        }

        column;
        direction;
        sortOrder;
    }

    export class ListGroupByInfo extends GroupByInfo {

        constructor(column, initialState?, getGroupsClosed?:boolean, inactive?: boolean) {
            super(column, initialState, inactive, getGroupsClosed);
        }

        column;
        initialState;
        inactive: boolean;
    }

    export class ListGroupsDataInfo {

        constructor(groupIdentifier) {
            this.identifier = groupIdentifier;
            this.filters = [];

            const parts = groupIdentifier.split(ListControlAsset.GroupsDelimiter);

            for (let i = 0; i < parts.length; i++) {
                this.filters.push({
                    column: parts[i].split(ListControlAsset.GroupsValueDelimiter)[0],
                    value: parts[i].split(ListControlAsset.GroupsValueDelimiter)[1]
                        .replace(new RegExp(ListControlAsset.GroupsValueSpace, "g"), " ")
                });
            }
        }

        identifier;
        filters: typeof undefined[];
    }

    export class ListAggregatorInfo {

        constructor(column, type, origin?) {
            this.column = column;
            this.type = type;
            this.origin = origin;
        }

        column;
        origin;
        type;
    }

    export enum ListColumnItemType {
        HYPERLINK = 0,
        DOWNLOADLINK,
        CHECKBOX,
        IMAGEBOX,
        TEXTBOX
    }
}