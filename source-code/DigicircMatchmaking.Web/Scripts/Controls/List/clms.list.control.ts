﻿/// <reference path="clms.list.interfaces.control.ts" />

namespace Joove.Widgets {
    // for debug
    var listInstance: ListControl = null;



    var listInstances: Array<IListControlInstance> = [];

    /** Refreshes a List Control. Usually called from server responce 
    *   @param {string} listId - The Id of the list to be refreshed
    */
    window._forceListRefresh = (listId) => {
        const list = getListInstanceById(listId);
        list.instance.status.startRow = 0;
        list.instance.status.selectedItemKeys = [];
        if (list.instance.isInitialized == true) {
        list.instance.updateData();
        } else {
            list.instance.enable();
        }
    }

    window._listSelectionClear = (listId) => {
        const list = getListInstanceById(listId);
        list.instance.clearSelectedItems();
    }

    window["_getListInstance"] = (listId) => {
        return getListInstanceById(listId);
    }
    window._listApplyPredefinedFilters = (listId) => {
        const list = getListInstanceById(listId);
        list.instance.applyPredefinedFilters();
    }

    window._listClearPredefinedFilters = (listId) => {
        $(`[data-filter-for-list='${listId}']:not(.quick-filter)`).val("");        
        window._listApplyPredefinedFilters(listId);
    }

    function getListInstanceById(listId: string): IListControlInstance {
        for (let i = 0; i < listInstances.length; i++) {
            if (listInstances[i].id === listId) {
                return listInstances[i];
            }
        }
        return null;
    }

    export class ListControlAsset {
        // ReSharper disable InconsistentNaming
        static GroupsDelimiter = " ";
        static GroupsValueDelimiter = "/---/";
        static GroupsValueSpace = "/___/";
        static NullString = "(empty)";

        static Errors = {
            UPDATE_DATA: { type: "UPDATE_DATA", message: "Could not update list data" },
            RESTORE_STATE: { type: "RESTORE_STATE", message: "Could not restore list state from session" },
            SAVE_STATE: { type: "SAVE_STATE", message: "Could not save list state to session" },
            UPDATE_AGGREGATORS: { type: "UPDATE_AGGREGATORS", message: "Could not update list aggregators" },
            LOAD_VIEWS_FROM_PROFILE: {
                type: "LOAD_VIEWS_FROM_PROFILE",
                message: "Could not load User defined Views from Profile"
            },
            SAVE_VIEW_TO_PROFILE: {
                type: "SAVE_VIEW_TO_PROFILE",
                message: "Could not save User defined View to Profile"
            },
            DELETE_VIEW_FROM_PROFILE: {
                type: "DELETE_VIEW_FROM_PROFILE",
                message: "Could not delete User defined View from Profile"
            },
            LOAD_RESOURCES: { type: "LOAD_RESOURCES", message: "Could not load list resources" },
            EXPORT: { type: "EXPORT", message: "Error during list export" },
            IMPORT: { type: "IMPORT", message: "Error during list import" }
        };

        static Icons = {
            refresh: { bs: "glyphicon glyphicon-refresh", fa: "fa fa-refresh" },
            reset: { bs: "glyphicon glyphicon-repeat", fa: "fa fa-history" },
            prefs: { bs: "glyphicon glyphicon-list-alt", fa: "fa fa-list-alt" },
            filters: { bs: "glyphicon glyphicon-zoom-in", fa: "fa fa-search" },
            groups: { bs: "glyphicon glyphicon-paperclip", fa: "fa fa-group" },
            save: { bs: "glyphicon glyphicon-floppy-save", fa: "fa fa-save" },
            remove: { bs: "glyphicon glyphicon-floppy-remove", fa: "fa fa-trash" },
            quickFilter: { bs: "glyphicon glyphicon-filter", fa: "fa fa-filter" },
            search: { bs: "glyphicon glyphicon-search", fa: "fa fa-search" },
            'export': { bs: "glyphicon glyphicon-export", fa: "fa fa-cloud-download" },
            'import': { bs: "glyphicon glyphicon-import", fa: "fa fa-cloud-upload" },
            exportPdf: { bs: "glyphicon glyphicon-book", fa: "fa fa-file-pdf-o" },
            next: { bs: "glyphicon glyphicon-forward", fa: "" },
            prev: { bs: "glyphicon glyphicon-backward", fa: "" },
            first: { bs: "glyphicon glyphicon-fast-backward", fa: "" },
            last: { bs: "glyphicon glyphicon-fast-forward", fa: "" },
            clearAllFilters: { bs: "glyphicon glyphicon-eye-close", fa: "fa fa-eye-slash" },
            clearAllAggregators: { bs: "glyphicon glyphicon-remove-circle", fa: "fa fa-eye-slash" },
            menuItem: { bs: "glyphicon glyphicon-circle-arrow-right", fa: "fa fa-circle" },
            aggregator: { bs: "glyphicon glyphicon-dashboard", fa: "fa fa-dashboard" },
            cogs: { bs: "glyphicon glyphicon-cog", fa: "fa fa-cogs" },
            prevState: { bs: "glyphicon glyphicon-arrow-left", fa: "fa fa-circle" }
        }
    }

    /**
     * This is the List Control Class
     *   @constructor
     */
    export class ListControl extends ListControlBase {
        private detectedScrollBarSize :number = Common.getScrollbarSize();
        //scrollbar size is 0 in mobile/table
        private scrollbarSize: number = this.detectedScrollBarSize > 0 ? this.detectedScrollBarSize : 17;
        constructor() {
            super();

            listInstance = this;

            this.MAX_ROWS = 10000;
            this.errorOccured = false;
            this.viewsCache = null;
            this.resources = {};

            this.refreshDimetionsCounter = 0;

            this.focusOnElement = "";

            this.resizeTime = new Date(1, 1, 2000, 12, 0, 0);
            this.resizeDelta = 200;
            this.resizeTimeout = false;

            this.isPreferencesMinimized = false;
            this.isFiltersMinimized = false;
            this.isGroupsMinimized = false;

            this.isMobileMode = false;
            this.hidingData = false;
            this.requestIsPending = false;

            this.status = {
                currentPage: 0,
                selectedItemKeys: [],
                startRow: 0,
                endRow: 0,
                pageSize: 25,
                totalRows: 0,
                totalPages: 0,
                filters: [],
                orderBy: [],
                groupBy: [],
                columns: [],
                aggregators: [],
                currentView: null,
                getGroupsClosed: false,
                allRecordsSelected: false,
                horizontalScrollPosition: 0,
                verticalScrollPosition: 0
            };

            this.isInitialized = false;

            this.timeout = 60000;

            this.defaultStatus = $.extend(true, {}, this.status);

            this.options = {
                $container: null,
                selectedRowClass: "selected-row",
                // this 'simulates' Bootstrap active class row. For some reason it does not work for table rows.
                hoverRowClass: "active",
                showRowNumbers: true,
                usePopUpsForPreferences: false,
                pagerPosition: "TOP",
                useContextMenuForRowActions: true,
                runRefreshDimentionsAtIntervals: true,
                refreshDimentionsInterval: 1000,
                maxIterationsForRefreshDimentions: 5
            };
        }

        /** Initializes a List Control.
        *   @param {HTMLElement} - The List Control container element
        *   @param {object} - A JSON Object containing options
        */
        init(element: HTMLElement, options: IListControlOptions): void {
            this.options = $.extend(this.options, options);

            this.options.$container = $(element);

            this.elementId = $(element).attr("jb-id");
            this.serverSideElementId = Core.getElementName($(element));

            this.$predefinedFiltersFieldSet = $(`[data-filter-for-list='${this.elementId}']:not(.quick-filter)`)
                .eq(0)
                .closest("[jb-type='FieldSet']");

            this.resources = window._resourcesManager.getListResources();

            this.addToListInstances();

            this.initializeDatepickerPlugIn();

            setTimeout(() => {
                    const shouldDisable = this.$predefinedFiltersFieldSet.is(":visible") === false &&
                        $(element).is(":visible") === false;
                    $(element).toggleClass("list-disabled", shouldDisable);

                    if ($(element).hasClass("list-disabled") || this.options.isPickList) return;

                    this.enable();
                },
                100);
        }

        enable(selectedKeys?): void {
            Common.setNumberLocalizationSettings();

            this.initiallySelectedKeys = selectedKeys;

            if (this.isInitialized === false) {
                // Show Loading
                this.showInitializationLoadingTimeout = window.setTimeout(() => {
                    this.createInitializationLoadingElement();
                });

                // Resize Listener
                $(window).resize(() => {
                    if (this.options.$container.css("opacity") == 0) return;

                    this.onResize();
                });

                this.onResize();

                this.initPredefinedFiltersListeners();

                // Initialization Sequence:

                // 1. Load Columns Info
                this.loadColumnInfo(() => {
                    // 2. Load Views
                    this.loadViewsFromProfile(() => {
                        // 3. Load State from Local Storage
                        var savedState = this.getStateFromLocalStorage();

                        // Use loaded state, or load default view
                        if (typeof (savedState) != "undefined" && savedState != null) {
                            this.status = savedState;
                            this.status.pageSize = this.options.pageSize;
                        } else {
                            this.getPredefinedAggregators();
                            this.loadDefaultViewOnInit();
                        }

                        // Show predefined filters fieldset and stop here if needed
                        if (this.options.waitForPredefinedFilters !== false) {
                            this.showOnlyPredefinedFiltersFieldSet();
                            return;
                        }

                        // 4. Request Collection Data                    
                        this.updateData({ refreshHeader: false, selectedKeys: selectedKeys });

                        // 5. Request Aggregators
                        this.updateAggregatorsData();

                        var updateScrollPosition = window.setInterval(() => {
                                if (this.$listHorizontalScrollbar != null && this.$listVerticalScrollbar != null) {
                                    this.$listHorizontalScrollbar.find(".scrollbar-content-wrapper")
                                        .scrollLeft(this.status.horizontalScrollPosition);
                                    this.$listVerticalScrollbar.find(".scrollbar-content-wrapper")
                                        .scrollTop(this.status.verticalScrollPosition);
                                    window.clearInterval(updateScrollPosition);
                                }
                            },
                            100);

                        this.isInitialized = true;
                    });
                });
            }
            else {
                if (selectedKeys != null) {
                    this.status.selectedItemKeys = selectedKeys;
                }

                if (this.options.isPickList && this.options.excludeSelected) {
                    this.status.allRecordsSelected = false;
                }

                this.showControl();               
                this.refreshDimensions();
            }
        }

        loadColumnInfo(cb: Function) {            
                var $controlInstace = this.options.isPickList ? this.$ownerButton : this.options.$container;

                var columnInfoVariableName = this.options.isPickList
                    ? $controlInstace.attr("jb-id")
                    : this.serverSideElementId;

                var data: Array<Widgets.ListControlColumn> = window[columnInfoVariableName + "_ColumnInfo"];
                
                for (let i = 0; i < data.length; i++) {
                    const current = data[i];

                    this.status.columns.push(new Widgets.ListControlColumn({
                        name: current.name,
                        caption: window._resourcesManager.getListColumnCaption($controlInstace, current.name, this.options.isPickList),
                        dataType: current.mambaDataType,
                        groupable: current.groupable,
                        searchable: current.searchable,
                        orderable: current.orderable,
                        editable: current.editable,
                        style: current.style,
                        classes: current.classes,
                        itemType: current.itemType,
                        importable: current.importable,
                        supportsAggregators: current.supportsAggregators,
                        formatting: current.formatting,
                        isVisible: typeof (this.options.hiddenColumns) == "undefined" ||
                        this.options.hiddenColumns.indexOf(current.name) === -1
                    }));
                }

              if (cb) cb();
        }

        addToListInstances() {
            for (let i = 0; i < listInstances.length; i++) {
                if (listInstances[i].id === this.elementId) return;
            }

            listInstances.push({
                id: this.elementId,
                instance: this
            });
        }

        goBackToClosedGroups() {
            this.toggleAllGroupsActivation(true);
            this.clearClosedGroupItemsFilters(true);
            this.status.getGroupsClosed = true;

            this.openedGroups = [];

            this.updateData({ refreshHeader: false });
        }

        listHasPredefinedView() {
            //todo: log
            //if (SESSION_DEBUG.options.LIST_DEBUG === true) console.log(viewsCache);

            return this.viewsCache != null &&
                this.viewsCache.DefaultView != null &&
                this.viewsCache.DefaultView.length > 0;
        }

        loadDefaultViewOnInit() {
            try {
                if (this.listHasPredefinedView()) {
                    for (let i = 0; i < this.viewsCache.Views.length; i++) {
                        const view = this.viewsCache.Views[i];

                        if (view.ViewName !== this.viewsCache.DefaultView) continue;
                        const statusToLoad = JSON.parse(view.SerializedStatus);

                        this.status = statusToLoad;
                        this.status.currentView = view.ViewName;
                        this.status.startRow = 0;
                    }
                } else {
                    this.status.pageSize = this.options.pageSize;

                    if (this.options.predefinedGroups != null) {                        
                        this.status.groupBy = [];
                        this.applyPredefinedGrouping();
                    }
                }
            } catch (e) {
            }
        }

        applyPredefinedGrouping() {
            for (let i = 0; i < this.options.predefinedGroups.length; i++) {
                var columnName = this.options.predefinedGroups[i].column;
                var state = this.options.predefinedGroups[i].state;
                var column = this.getColumnInfoByName(columnName);

                var groupInfo = new Widgets.ListGroupByInfo(column, state);

                this.status.groupBy.push(groupInfo);
            }
        }

        getPageSize() {
            if (this.options.userCanSelectPageSize !== false) {
                return parseInt(String(this.options.pageSize));
            } else if (this.options.isPaged === false) {
                return this.MAX_ROWS;
            }
            return this.status.pageSize;
        }

        getQueryStringParameters() {
            "use strict";
            const url = window.location.href.split("?")[1];
            return url == null ? "" : `&${url}`;
        }

        prepareRequestParameters(exportOptions) {
            if (typeof (exportOptions) == "undefined") exportOptions = {};
            if (typeof (exportOptions.type) == "undefined") exportOptions.type = "";
            if (typeof (exportOptions.range) == "undefined") exportOptions.exportRange = "";
            if (typeof (exportOptions.onlyGroups) == "undefined") exportOptions.exportOnlyGroups = "";
            if (typeof (exportOptions.filename) == "undefined") exportOptions.filename = "";
            if (typeof (exportOptions.includeGridLines) == "undefined") exportOptions.includeGridLines = "";
            if (typeof (exportOptions.portraitOrientation) == "undefined") exportOptions.portraitOrientation = "False";
            if (typeof (exportOptions.visibleColumns) == "undefined") exportOptions.visibleColumns = [];
            if (typeof (exportOptions.groupColor) == "undefined") exportOptions.groupColor = null;
            if (typeof (exportOptions.headerColor) == "undefined") exportOptions.headerColor = null;
            if (typeof (exportOptions.evenColor) == "undefined") exportOptions.evenColor = null;
            if (typeof (exportOptions.oddColor) == "undefined") exportOptions.oddColor = null;
            if (typeof (exportOptions.aggregateColor) == "undefined") exportOptions.aggregateColor = null;
            if (typeof (exportOptions.nonGroupCount) == "undefined") exportOptions.includeGridLines = "";

            /*
            var requestParameters = {
                StartRow: 0,
                RowSize: 25,
                Filters: this.status.filters,
                OrderBy: this.status.orderBy,
                Aggregators: aggregatorsArray,
                GroupsInfo: this.groupsDataInfoArray,
                handler: "GetAggregators_" + elementId
            };
            */

            return {
                StartRow: this.status.startRow,
                RowSize: this.getPageSize(),
                Filters: this.status.filters,
                OrderBy: this.status.orderBy,
                GroupBy: this.status.groupBy,
                Aggregators: this.status.getGroupsClosed || exportOptions.type !== ""
                    ? this.status.aggregators
                    : null,
                GetGroupsClosed: this.status.getGroupsClosed,
                handler: this.elementId,
                exportOptions: exportOptions
            }
        }

        prepareRequestUrl(opts?) {
            console.log(this.options.url);
            const defaultUrlOptions = {
                handler: this.elementId + "/GetData",
                listName: this.elementId,
                action: "",
                rowSize: this.getPageSize(),
                startRow: this.status.startRow,
                viewName: ""
            };

            const urlOptions: IActionOptions = {};
            $.extend(urlOptions, defaultUrlOptions, opts);

            return this.options.url +
                "/" +
                urlOptions.handler +
                "?action=" +
                urlOptions.action +
                "&RowSize=" +
                urlOptions.rowSize +
                "&StartRow=" +
                urlOptions.startRow +
                "&ListName=" +
                urlOptions.listName +
                "&ViewName=" +
                urlOptions.viewName +
                this.getQueryStringParameters();
        }

        prepareDatasourceRequestInfo(): DatasourceRequest {
            const $controlInstace = this.options.isPickList ? this.$ownerButton : this.options.$container;

            const request = new DatasourceRequest($controlInstace,
                this.status.startRow,
                this.getPageSize(),
                this.status.filters,
                this.status.orderBy,
                null,
                this.status.groupBy);

            if (this.options.isPickList && this.options.excludeSelected) {
                request.setExludeKeys(this.initiallySelectedKeys);
            }

            return request;
        }

        updateData(options?) {
            this.showLoadingOverlay();

            this.hideListData();

            //todo: log
            //if (SESSION_DEBUG.options.LIST_DEBUG === true) console.log(requestParameters);

            var focusOnSearch = this.$list == null &&
                !this.options.waitForPredefinedFilters &&
                this.options.standAlone !== false;

            const datasourceInfo = this.prepareDatasourceRequestInfo();

            const $controlInstace = this.options.isPickList ? this.$ownerButton : this.options.$container;

            DatasourceManager.fetchDatasource($controlInstace,
                this.serverSideElementId,
                datasourceInfo,
                {
                    success: response => {
                        this.data = response.Data;
                        this.groups = response.Groups;
                        this.ruleEvaluations = response.RuleEvaluations;
                        this.status.totalRows = response.TotalRows;
                        this.refreshList(options);
                        this.hideLoadingOverlay();
                        this.showListData();

                        if (focusOnSearch) {
                            this.$listHeader.find(".global-search-input").focus();
                        } else {
                            window.setTimeout(() => {
                                    $(this.focusOnElement).focus();
                                    this.focusOnElement = "";
                                },
                                500);
                        }
                    },
                    error: data => {
                        this.handleError(ListControlAsset.Errors.UPDATE_DATA, data);
                    }
                });
        }

        getAggregatorsForColumn(column, type) {
            //todo: log
            //if (SESSION_DEBUG.options.LIST_DEBUG === true) console.log("Requesting aggregator " + type + " for column " + column);

            this.pushToAggregatorsStatus(new Widgets.ListAggregatorInfo(column, type));

            this.updateAggregatorsData();
        }

        updateAggregatorsData() {
            const datasourceInfo = this.prepareDatasourceRequestInfo();
            const $controlInstace = this.options.isPickList ? this.$ownerButton : this.options.$container;
            
            DatasourceManager.fetchDatasourceAggregators($controlInstace,
                this.serverSideElementId,
                datasourceInfo,
                this.status.aggregators,
                {
                    success: (data) => {
                        this.hideLoadingOverlay();                       
                        //todo: log
                        //if (SESSION_DEBUG.options.LIST_DEBUG === true) console.log(data);
                        
                        if (this.aggregatorsData == null) this.aggregatorsData = [];

                        if (this.status.groupBy == null ||
                            this.status.groupBy.length === 0 /*||
                            this.status.getGroupsClosed === false*/) {
                            this.consumeAggregatorsDataListMode(data);
                        } else {
                            this.consumeAggregatorsDataGroupMode(data);
                        }

                        if (this.$list != null) {
                            this.$list.find(".clear-all-aggregators")
                                .toggle(typeof (this.status.aggregators) != "undefined" &&
                                this.status.aggregators.length > 0);
                        }
                    },
                    complete: () => {
                        this.updateControl({ refreshDimensions: true });
                    },
                    error: (data) => {
                        this.handleError(ListControlAsset.Errors.UPDATE_AGGREGATORS, data);
                    }
                }
            );
        }

        consumeAggregatorsDataGroupMode(data) {
            this.parseAggregatorsOfGroup(data.Groups);
            this.createGroupAggregatorRows();
        }

        parseAggregatorsOfGroup(group) {
            if (group == null) return;

            if (typeof (group.Aggregates) != "undefined") {
                for (let i = 0; i < group.Aggregates.length; i++) {
                    const currentAgg = group.Aggregates[i];

                    if (this.getColumnInfoByName(currentAgg.Column) == null) continue;

                    this.pushToAggregatorsData({
                        column: currentAgg.Column,
                        value: currentAgg.Value,
                        type: currentAgg.Type,
                        formattedValue: currentAgg.ValueFormatted,
                        groupIdentifier: group.Identifier
                    });
                }
            }

            if (typeof (group.SubGroups) != "undefined") {
                for (let i = 0; i < group.SubGroups.length; i++) {
                    this.parseAggregatorsOfGroup(group.SubGroups[i]);
                }
            }
        }

        consumeAggregatorsDataListMode(data) {
            for (let i = 0; i < data.length; i++) {
                this.pushToAggregatorsData({
                    column: data[i].Column,
                    value: data[i].Value,
                    type: data[i].Type,
                    formattedValue: data[i].ValueFormatted,
                    groupIdentifier: null
                });
            }

            this.createRecordSetAggregators(true);
        }

        pushToAggregatorsData(aggregator) {
            if (this.aggregatorsData == null) this.aggregatorsData = [];

            // Check if aggregator is already present
            let foundIndex = null;
            for (let i = 0; i < this.aggregatorsData.length; i++) {
                if (this.aggregatorsData[i].column === aggregator.column &&
                    this.aggregatorsData[i].type === aggregator.type &&
                    this.aggregatorsData[i].groupIdentifier === aggregator.groupIdentifier) {
                    foundIndex = i;
                    break;
                }
            }

            // Aggregator found, update
            if (foundIndex != null) {
                this.aggregatorsData[foundIndex].value = aggregator.value;
                this.aggregatorsData[foundIndex].formattedValue = aggregator.formattedValue;
            }
            // New, just push
            else {
                this.aggregatorsData.push(aggregator);
            }
        }

        pushToAggregatorsStatus(aggregator) {
            if (this.status.aggregators == null) this.status.aggregators = [];

            this.removeFromAggregatorsStatus(aggregator);
            this.status.aggregators.push(aggregator);
        }

        removeFromAggregatorsStatus(aggregator) {
            if (this.status.aggregators == null) this.status.aggregators = [];

            let indexToSplice = -1;

            // Check if aggregator is already present        
            for (let i = 0; i < this.status.aggregators.length; i++) {
                if (this.status.aggregators[i].column === aggregator.column &&
                    this.status.aggregators[i].type === aggregator.type) {
                    indexToSplice = i;
                    break;
                }
            }

            if (indexToSplice === -1) return;

            if (this.aggregatorsData != null) {
                for (let j = this.aggregatorsData.length - 1; j >= 0; j--) {
                    if (this.aggregatorsData[j].column === aggregator.column &&
                        this.aggregatorsData[j].type === aggregator.type)
                        this.aggregatorsData.splice(j, 1);
                }
            }

            this.status.aggregators.splice(indexToSplice, 1);
        }

        getPredefinedAggregators() {
            if (this.options.predefinedAggregators == null || this.options.predefinedAggregators.length === 0) return;

            //todo: log
            //if (SESSION_DEBUG.options.LIST_DEBUG === true) console.log("Getting Predefined Aggregators");

            for (let i = 0; i < this.options.predefinedAggregators.length; i++) {
                var current = this.options.predefinedAggregators[i];

                if (current.type == AggregatorTypes.SUM) {
                    current.type = 0;
                }
                else if (current.type == AggregatorTypes.AVERAGE) {
                    current.type = 1;
                }
                else if (current.type == AggregatorTypes.COUNT) {
                    current.type = 2;
                }                
            }

            this.status.aggregators = this.options.predefinedAggregators;

            this.updateAggregatorsData();
        }

        loadViewsFromProfile(cb: Function): void {            
            var $controlInstace = this.options.isPickList ? this.$ownerButton : this.options.$container;

            Joove.Core.executeControllerActionNew({
                action: "LoadListViews",
                verb: "POST",
                controller: Joove.Core.getControllerForElement($controlInstace),
                postData: {
                    ControlName: this.elementId,                    
                },
                cb: (response) => {                    
                    if (response == null) {
                        response = { Data: { Views: [] } };
                    }
                    this.viewsCache = response.Data;
                    cb();
                },
                onErrorCb: (data) => {
                    this.viewsCache = { Views: [] };
                    cb();
                }
            });    
        }

        saveViewToProfile(viewName: string, makeDefault: boolean) {
            // Remove unnecessary status properties
            const viewStatus = $.extend(true, {}, this.status);
            delete viewStatus.endRow;
            delete viewStatus.selectedItemKeys;
            delete viewStatus.allRecordsSelected;
            delete viewStatus.currentPage;
            delete viewStatus.totalPages;
            delete viewStatus.currentView;
            viewStatus.startRow = 0;
         
            var $controlInstace = this.options.isPickList ? this.$ownerButton : this.options.$container;

            Joove.Core.executeControllerActionNew({
                action: "SaveListView",
                verb: "POST",
                controller: Joove.Core.getControllerForElement($controlInstace),
                postData: {
                    ControlName: this.elementId,
                    SerializedStatus: JSON.stringify(viewStatus),
                    ViewName: viewName,
                    SetAsDefault: makeDefault
                },
                cb: (data) => {
                    
                }
            });            
        }

        deleteViewFromProfile(viewName) {
            //Add here the delete confirmation
            if (!confirm(this.resources.DeleteCurrentViewConfirmation)) return;

            var $controlInstace = this.options.isPickList ? this.$ownerButton : this.options.$container;

            Joove.Core.executeControllerActionNew({
                action: "DeleteListView",
                verb: "POST",
                controller: Joove.Core.getControllerForElement($controlInstace),
                postData: {
                    ControlName: this.elementId,                    
                    ViewName: viewName,                    
                },
                cb: (data) => {                  
                    if (this.$listHeader.find(".available-views:first option").length === 1) {
                        this.$listHeader.find(".btn-list-reset").show();
                    }

                    this.status.currentView = null;
                    this.populateViewsDropDown();
                    this.resetList(true);
                }
            });       
                        
            this.viewsCache = null;
        }

        getLocalStorageKey() {
            return this.options.parentForm + "_" + this.elementId + "_" + window._context.currentUsername + "_" + window.currentVersion;
        }

        getStateFromLocalStorage() {
            try {
                const stateSerialized = localStorage[this.getLocalStorageKey()];

                if (stateSerialized == null) return null;

                const state = JSON.parse(stateSerialized);

                // Ensure that columns are compatible (list structure is the same)            
                if (this.status.columns
                    .length !==
                    state.columns.length) return null; // different columns number, incompatible

                for (let i = 0; i < state.columns.length; i++) {
                    const stored = state.columns[i];
                    const existing = this.getColumnInfoByName(stored.name);

                    // if not found or something important has changed, incompatible
                    if (existing == null ||
                        existing.caption !== stored.caption ||
                        existing.dataType !== stored.dataType ||
                        existing.groupable !== stored.groupable ||
                        existing.importable !== stored.importable ||
                        existing.orderable !== stored.orderable ||
                        existing.searchable !== stored.searchable ||
                        existing.style !== stored.style ||
                        existing.classes !== stored.classes ||
                        existing.itemType !== stored.itemType ||
                        existing.supportsAggregators !== stored.supportsAggregators) {
                        return null;
                    }
                }

                return state;

            } catch (e) {
                console.error(`Could not parse stored state!${e}`);
                return null;
            }
        }

        saveStateToLocalStorage() {
            // Clone
            const viewStatus = $.extend(true, {}, this.status);

            // Remove or reset some props
            viewStatus.selectedItemKeys = [];
            viewStatus.allRecordsSelected = false;

            // Save
            localStorage[this.getLocalStorageKey()] = JSON.stringify(viewStatus);
        }

        populateViewsDropDown() {
            if (this.viewsCache == null) {
                this.loadViewsFromProfile(() => {
                    this.populateViewsDropDown();
                });
                return;
            }
            
            const $dropDown = this.$listHeader.find(".available-views");
            const data = this.viewsCache || { Views: [] };
            
            $dropDown.empty();
            
            for (let i = 0; i < data.Views.length; i++) {
                const current = data.Views[i];

                const $option = $("<option></option>");

                $option.text(current.ViewName);
                $option.val(current.ViewName);
                $option.data("status", current.SerializedStatus);

                $dropDown.append($option);
            }

            const predefinedView = $(`<option value='PREDEFINED'>${this.resources.PredefinedView}</option>`)
                .data("status", this.defaultStatus);

            $dropDown.prepend(predefinedView);

            $dropDown.val(this.status.currentView);

            if (this.status.currentView === "PREDEFINED" || this.status.currentView == null) {
                this.$listHeader.find(".btn-remove-view").attr("disabled", "disabled");
            } else {
                this.$listHeader.find(".btn-remove-view").removeAttr("disabled");
            }
        }

        downloadCsvTemplate() {
            window.location.href = `${this.options.url}/DownloadCsvTemplate_${this.elementId}`;
        }

        uploadCsvForImport(event) {
            // todo: ajax

            $.ajax({
                url: this.prepareRequestUrl({ handler: `UploadCsv_${this.elementId}` }),
                data: event.target.result,
                method: "POST",
                success: (data) => {
                    this.showImportResults(data);
                },
                complete: () => {
                    this.hideLoadingOverlay();
                },
                error: (jqXhr, textStatus, errorThrown) => {
                    this.handleError(ListControlAsset.Errors.IMPORT, jqXhr, textStatus, errorThrown);
                },
                timeout: 500000
            });
        }

        showImportResults(results) {
            //todo: popup manager
            return;

            // Hide Import PopUp
//            popUpManager.hide();
//
//            var hasErrors = results.Errors != null && results.Errors.length > 0;
//            var cls = hasErrors === true ? "import-results-pop-up" : "import-results-pop-up-mini";
//
//            // Standard
//            var contents = "<div class='" +
//                cls +
//                "'> \
//                            <span class='import-result'>" +
//                this.resources.ImportedRecords +
//                ":</span> \
//                            <b class='green'>" +
//                results.NumberImported +
//                "</b> \
//                            <br/> \
//                            <span class='import-result'>" +
//                this.resources.FailedRecords +
//                ":</span> \
//                            <b class='red'>" +
//                results.NumberFailled +
//                "</b>\
//                            <br/>";
//
//            // Errors
//            if (hasErrors === true) {
//                contents += "<h3>" +
//                    this.resources.ErrorDetails +
//                    "</h3>\
//                        <table class='errors-table table table-hover'>\
//                            <thead>\
//                                <th>" +
//                    this.resources.RowNumber +
//                    "</th>\
//                                <th>" +
//                    this.resources.ErrorDescription +
//                    "</th>\
//                                <th>" +
//                    this.resources.ErrorMessage +
//                    "</th>\
//                            </thead>\
//                            <tbody>";
//            }
//
//            for (var i = 0; i < results.Errors.length; i++) {
//                var error = results.Errors[i];
//
//                var row = "<tr>\
//                            <td>" +
//                    error.RowNumber +
//                    "</td> \
//                            <td>" +
//                    error.ErrorDescription +
//                    "</td> \
//                            <td>" +
//                    error.ErrorMessage +
//                    "</td> \
//                        </tr>";
//
//                contents += row;
//            }
//
//            if (hasErrors === true) {
//                contents += "</tbody></table>";
//            }
//
//            contents += "</div> \
//                    <div class='import-results-pop-up-footer list-pop-up-footer'> \
//                          <button class='btn btn-primary import-results-pop-up-btn-ok'>OK</button> \
//                    </div>";
//
//            //todo: popup manager
//            return;
//
//
//            popUpManager.show({
//                draggable: true,
//                startMaximized: false,
//                title: this.resources.ImportResults,
//                contentsHtml: contents,
//                height: hasErrors === true ? 450 : 150,
//                width: hasErrors === true > 0 ? 1000 : 400,
//                afterShowCallback: function($container) {
//                    $container.find(".import-results-pop-up-btn-ok")
//                        .on("click",
//                            function() {
//                                window.location.reload(true);
//                            });
//                }
//            });
        }

        refreshList(options) {
            //todo: log
            //if (SESSION_DEBUG.options.LIST_DEBUG === true) console.log("Refreshing List");

            options = options || {};

            if (options.selectedKeys != null) {
                this.status.selectedItemKeys = options.selectedKeys;
            } else {
                this.status.selectedItemKeys = this.status.selectedItemKeys || [];
            }

            this.status.totalPages = Math.ceil(this.status.totalRows / this.status.pageSize);
            this.status.endRow = this.status.startRow + this.status.pageSize;

            this.groupsDataInfoArray = [];

            if (this.status.endRow > this.status.totalRows) {
                this.status.endRow = this.status.totalRows;
            }

            this.status.currentPage = Math.ceil((this.status.endRow) / this.status.pageSize);

            // Force Paged List if we have too many rows        
            if (this.options.isPaged === false && this.status.totalRows > this.MAX_ROWS) {
                this.options.isPaged = true;
                this.options.pageSize = this.MAX_ROWS;
            }

            if (this.$list == null) {
                this.createListControl();
                this.updateControl({
                    updateActionButtonVisibility: true,
                    refreshDimensions: true,
                    applyConditionalFormattings: true
                });

                if (this.options.isPickList !== true) {
                    this.removeInitializationLoadingElement();
                }

                this.showListData();
                this.showControl();
                return;
            }            

            const updateOptions: IUpdateOptionsListTable = {};
            if (options.refreshHeader !== false) {
                updateOptions.createListHeader = true;
                updateOptions.createListColumnHeader = true;
            }

            updateOptions.createListData = true;
            updateOptions.updateUiElements = true;
            updateOptions.createRecordSetAggregators = true;
            updateOptions.updateGroupAggregators = true;
            updateOptions.keepAggregatorsOfFullRecordSet = options.keepAggregatorsOfFullRecordSet === true;
            updateOptions.updateActionButtonVisibility = true;
            updateOptions.refreshDimensions = true;
            updateOptions.applyConditionalFormattings = true;

            this.updateControl(updateOptions);

            this.saveStateToLocalStorage();

            if (options.showControl === true) {
                this.showControl();
            }

            //todo: log
            //if (SESSION_DEBUG.options.LIST_DEBUG === true) console.log("List Refreshed");
        }

        createGroupsData() {
            const $newData = $("<div class='list-data-container'> \
                                <div class='list-data-wrapper'> \
                                <table class='list-data-table table'> \
                                    <tbody>\
                                    </tbody>\
                                </table>\
                                </div> \
                                <div class='row-num-border'></div> \
                            </div>");

            const $dataBody = $newData.find("tbody");

            this.groupsDataInfoArray = [];

            this.createGroup(this.groups, $dataBody, "", 0);

            if (this.$listDataContainer == null) this.$listDataContainer = this.$list.find(".list-data-container");
            if (this.$listData == null) this.$listData = this.$list.find(".list-data-wrapper");

            $newData.find(".list-data-table").toggleClass("table-striped", this.options.stripped !== false);

            this.$listDataContainer.replaceWith($newData);


            this.$listDataContainer = $newData;
            this.$listData = this.$listDataContainer.find(".list-data-wrapper");

            this.restoreGroups();

            this.scrollInnerContent(this.$listDataContainer);

            return $newData;
        }

        refreshGroupsDataInfoArray() {
            const $groupHeaders = this.$listData.find("tr.group-header");
            this.groupsDataInfoArray = [];

            for (let i = 0; i < $groupHeaders.length; i++) {
                const groupPath = $groupHeaders.eq(i).attr("data-group");
                const info = new Widgets.ListGroupsDataInfo(groupPath);
                $groupHeaders.eq(i).data("groupInfo", info);
                this.groupsDataInfoArray.push(info);
            }
        }

        createGroup(group, $target, groupPath, level) {
            var groupIdentifier = "";
            var $groupRow = $("<tr class='group-header active'></tr>");

            $groupRow.toggleClass("with-row-nums", this.options.showRowNumbers);
            if (group.Key !== "ROOT") {
                $target.append($groupRow);
                groupIdentifier = group.Column.Name +
                    ListControlAsset.GroupsValueDelimiter +
                    (group.Key != null ? group.Key.toString() : ListControlAsset.NullString)
                    .replace(new RegExp(" ", "g"), ListControlAsset.GroupsValueSpace);

                if (groupPath.length > 0) groupPath += ListControlAsset.GroupsDelimiter;
                groupPath += groupIdentifier;

                $groupRow.attr("data-group", groupPath);
                $groupRow.attr("data-level", ++level);

                const groupInfo = new Widgets.ListGroupsDataInfo(groupPath);
                this.groupsDataInfoArray.push(groupInfo);
                $groupRow.data("groupInfo", groupInfo);
            }

            var state = group.State === 0 ? "EXPANDED" : "COLLAPSED";

            for (let i = 0; i < group.SubGroups.length; i++) {
                this.createGroup(group.SubGroups[i], $target, groupPath, level);
            }

            var colSpan = this.status.columns.length;

            if (this.options.showRowNumbers) colSpan++;

            if (group.UniqueItemKeys == null) group.UniqueItemKeys = [];

            var groupCollection = [];

            for (let i = 0; i < group.UniqueItemKeys.length; i++) {
                groupCollection.push(this.findItemByUniqueKey(group.UniqueItemKeys[i]));
            }

            if (!this.status.getGroupsClosed) {
                this.createDataRows(groupCollection, $target, groupPath, level);
            }

            if (group.UniqueItemKeys.length === 0 && group.SubGroups.length === 0) {
                var $notFoundRow = this.createNotFoundRow();
                if (groupPath.length > 0) $notFoundRow.attr("data-group", groupPath);
                $notFoundRow.addClass("group-row");
                $target.append($notFoundRow);
            }

            if (group.Key !== "ROOT") {
                var listColumn = this.getColumnInfoByName(group.Column.Name);

                const groupInfo = this.getGroupInfo(group);

                var icon = state === "COLLAPSED" ? "plus" : "minus";

                var $groupRowContents = $(`<td colspan='${colSpan}'> \
                                        <span class='group-toggle glyphicon glyphicon-${icon}-sign'></span> \
                                        <span class='group-caption'>${listColumn.caption}:</span> \
                                        <span class='group-key'>${group.KeyFormatted}</span> \
                                        <span class='display-group-items glyphicon glyphicon-resize-full' title='${
                    this.resources.DisplayGroupItems
                    }'></span> \
                                        <span class='group-details'>\
                                            <!-- <span class='group-items-count'>${groupInfo.itemsCount}</span> \
                                            <span class='group-items-count-caption'>Items</span> --> \
                                        </span> \
                                    </td>`);

                $groupRow.append($groupRowContents);

                if (!this.status.getGroupsClosed) {
                    $groupRowContents.find(".display-group-items").remove();
                }

                if (this.status.getGroupsClosed && group.SubGroups.length === 0) {
                    $groupRowContents.find(".group-toggle").remove();
                    state = "COLLAPSED";
                }

                $groupRow.data("status", state);
                $groupRow.data("initialState", state);

                if (state === "COLLAPSED") {
                    this.hideGroup($groupRow);
                } else {
                    this.showGroup($groupRow);
                }
            }
        }

        createGroupAggregatorRows() {
            if (this.$listFooterContainer != null) this.$listFooterContainer.find(".list-aggregators-row").remove();

            if (this.aggregatorsData == null) return;

            //todo: log
            //if (SESSION_DEBUG.options.LIST_DEBUG == true) console.log("Creating Aggregators for Groups...");

            const $groupHeaders = this.options.$container.find(".group-header[data-group]");

            for (let i = 0; i < $groupHeaders.length; i++) {
                const $current = $groupHeaders.eq(i);
                const groupIdentifier = $current.data("group");

                $current.next(".group-aggregators-row").remove();

                const rowCreationResult = this.createAggregatorsRow({
                    rowClass: "group-aggregators-row",
                    cellClass: "group-aggregators-cell",
                    currentPageRowsSelector: `.list-data-row.group-row[data-group~='${groupIdentifier
                        }'], .list-data-row.group-row[data-group='${groupIdentifier}']`,
                    aggregatorCaptionClass: "aggregator-caption",
                    aggregatorValueClass: "aggregator-value",
                    aggregatorContainerClass: "aggregator-container",
                    groupIdentifier: groupIdentifier,
                    groupMode: true,
                    showPageAggregators: false
                });

                const $row = rowCreationResult.$row;
                const aggregatorsFound = rowCreationResult.aggregatorsFound;

                if (aggregatorsFound === false) continue;

                $row.attr("data-level", $current.data("level"));
                $row.attr("data-group", $current.data("group"));

                $current.after($row);

                if ($current.is(":visible")) $row.show();
            }
        }

        findItemByUniqueKey(key) {
            for (let i = 0; i < this.data.length; i++) {
                if (this.data[i]._key === key) return this.data[i];
            }
            return null;
        }

        toggleGroup(groupToggleBtn) {
            const $groupToggleBtn = $(groupToggleBtn);
            const $groupRow = $groupToggleBtn.closest("tr");
            const groupStatus = $groupRow.data("status");
            const groupIdentifier = $groupRow.data("group");

            $groupRow.data("initialState", null);

            if (groupStatus === "EXPANDED") {
                this.hideGroup($groupRow);
            } else {
                this.showGroup($groupRow);
            }
            this.updateControl({ refreshDimensions: true });
        }

        hideGroup($groupRow, isNested?) {
            const groupIdentifier = $groupRow.data("group");
            const groupLevel = $groupRow.data("level");

            $groupRow.data("status", "COLLAPSED");

            for (let i = 0; i < this.openedGroups.length; i++) {
                if (this.openedGroups[i] === groupIdentifier) {
                    this.openedGroups.splice(i, 1);
                    break;
                }
            }

            $groupRow.find(".group-toggle").addClass("glyphicon-plus-sign").removeClass("glyphicon-minus-sign");

            if (isNested === true) $groupRow.hide();
            if (isNested === true) $groupRow.next(".group-aggregators-row").hide();
            $groupRow.siblings(`.group-row[data-group='${groupIdentifier}']`).hide();

            const $nestedGroups = $groupRow
                .siblings(`.group-header[data-group~='${groupIdentifier}'][data-level='${parseInt(groupLevel + 1)}']`);

            for (let i = 0; i < $nestedGroups.length; i++) {
                this.hideGroup($nestedGroups.eq(i), true);
            }
        }

        showGroup($groupRow, doNotStore?) {
            const groupIdentifier = $groupRow.data("group");
            const groupLevel = $groupRow.data("level");

            $groupRow.data("status", "EXPANDED");

            if (doNotStore !== true) this.openedGroups.push(groupIdentifier);

            $groupRow.find(".group-toggle").removeClass("glyphicon-plus-sign").addClass("glyphicon-minus-sign");
            $groupRow.show();
            $groupRow.next(".group-aggregators-row").show();

            $groupRow.siblings(`.group-row[data-group='${groupIdentifier}']`).show();
            $groupRow
                .siblings(`.group-header[data-group~='${groupIdentifier}'][data-level='${parseInt(groupLevel + 1)}']`)
                .show();
            $groupRow
                .siblings(`.group-aggregators-row[data-group~='${groupIdentifier}'][data-level='${
                    parseInt(groupLevel + 1)}']`)
                .show();

            const $nestedGroups = $groupRow
                .siblings(`.group-header[data-group~='${groupIdentifier}'][data-level='${parseInt(groupLevel + 1)}']`);

            for (let i = 0; i < $nestedGroups.length; i++) {
                const $group = $nestedGroups.eq(i);
                if ($group.data("initialState") == null || $group.data("initialState") === "COLLAPSED") continue;
                this.showGroup($group);
            }
        }

        restoreGroups() {
            for (let i = 0; i < this.openedGroups.length; i++) {
                const $group = this.$listData.find(`.group-header[data-group='${this.openedGroups[i]}']`);
                this.showGroup($group, true);
            }
        }

        getGroupInfo(group) {
            let itemsCount = group.UniqueItemKeys.length;
            const groupsCount = group.SubGroups.length;

            for (let i = 0; i < groupsCount; i++) {
                itemsCount += this.getGroupInfo(group.SubGroups[i]).itemsCount;
            }

            return {
                itemsCount: itemsCount,
                groupsCount: groupsCount
            }
        }

        updateUiElements() {
            var groupMode = this.status.groupBy.length > 0;

            // Current Page
            this.$listPager.find(".list-current-page").val(String(this.status.currentPage));

            // Total Items
            this.$listPager.find(".data-total").text(this.applyFormattingToNumber(this.status.totalRows));

            // Items Range
            var startRow = this.status.totalRows > 0 ? this.status.startRow + 1 : 0;
            this.$listPager.find(".data-start").text(startRow);
            this.$listPager.find(".data-end").text(this.status.endRow);

            // Items Per Page
            this.$listPager.find(".select-page-size").val(String(this.status.pageSize));

            // Total Pages
            this.$listPager.find(".data-total-pages").text(this.applyFormattingToNumber(this.status.totalPages));

            // Prev Page Button
            if (this.status.currentPage <= 1) {
                this.$listPager.find(".list-prev-page").attr("disabled", "disabled");
            } else {
                this.$listPager.find(".list-prev-page").removeAttr("disabled");
            }

            // Next Page Button
            if (this.status.currentPage == this.status.totalPages) {
                this.$listPager.find(".list-next-page").attr("disabled", "disabled");
            } else {
                this.$listPager.find(".list-next-page").removeAttr("disabled");
            }

            // First Page Button
            if (this.status.currentPage <= 1) {
                this.$listPager.find(".list-first-page").attr("disabled", "disabled");
            } else {
                this.$listPager.find(".list-first-page").removeAttr("disabled");
            }

            // Last Page Button
            if (this.status.currentPage === this.status.totalPages) {
                this.$listPager.find(".list-last-page").attr("disabled", "disabled");
            } else {
                this.$listPager.find(".list-last-page").removeAttr("disabled");
            }

            // Filters Applied Notification
            this.$listHeader.find(".clear-all-filters").toggle(this.status.filters.length > 0);

            // Filters Applied Notification
            this.$listHeader.find(".clear-all-aggregators")
                .toggle(typeof (this.status.aggregators) != "undefined" && this.status.aggregators.length > 0);

            // Global Search
            if (this.filtersCreatedByGlobalSearch()) {
                this.$listHeader.find(".global-search-input").val(this.status.filters[0].value);
                this.$listHeader.find(".global-search-clear").show();
            }

            // Global Search when combined with Predefined Filters        
            if (this.getGlobalFilterValue() !== null) {
                this.$listHeader.find(".global-search-input").val(this.getGlobalFilterValue());
                this.$listHeader.find(".global-search-clear").show();
            }

            // Quick Filters
            var quickFiltersApplied = false;
            var $toggleQuickFiltersRowBtn = this.$listHeader.find(".toggle-quick-filters");

            for (let i = 0; i < this.status.columns.length; i++) {
                var column = this.status.columns[i];
                var quickFilterValues = this.getColumnQuickFiltersValue(column);

                if (quickFilterValues.length === 0) continue;

                quickFiltersApplied = true;

                var $input = this.$listColumnHeader.find(`.column-quick-filter[data-column='${column.name}']`)
                    .find(".quick-filter")
                    .eq(0);

                $input.val(quickFilterValues.join(" "));
                $input.siblings(".remove-quick-filter").removeClass("hidden");
            }

            if (quickFiltersApplied && $toggleQuickFiltersRowBtn.hasClass("expanded") === false
            ) $toggleQuickFiltersRowBtn.click();

            // Quick Column Sorting 
            if (this.status.orderBy.length === 1) {
                var firstOrderInfo = this.status.orderBy[0];

                var $columnHeader = this.$listColumnHeader.find(`.column-title[data-column='${firstOrderInfo.column.name}']`)
                    .children(".title")
                    .eq(0);

                var classToAdd = firstOrderInfo.direction === OrderByDirections.DESC
                    ? "glyphicon-arrow-down"
                    : "glyphicon-arrow-up";

                var tooltip;

                if (firstOrderInfo.direction === OrderByDirections.DESC) {
                    tooltip = this.getColumnInfoByName(firstOrderInfo.column.name).dataType !== "DateTime"
                        ? this.resources.Unsort
                        : this.resources.SortASC;
                } else {
                    tooltip = this.getColumnInfoByName(firstOrderInfo.column.name).dataType !== "DateTime"
                        ? this.resources.SortDESC
                        : this.resources.Unsort;
                }

                $columnHeader.siblings(".sort-direction-icon").addClass(classToAdd);
                $columnHeader.attr("title", tooltip);
                $columnHeader.data("sort-direction", firstOrderInfo.direction);
            }

            //Reset list button
            var predefinedGroups = [];

            if (this.options.predefinedGroups != null)
                for (let i = 0; i < this.options.predefinedGroups.length; i++) {
                    var current = this.options.predefinedGroups[i];

                    var columnName = current.column;
                    var state = current.state;
                    var column = this.getColumnInfoByName(columnName);
                    var groupInfo = new Widgets.ListGroupByInfo(column, state);
                    
                    predefinedGroups.push(new Widgets.ListGroupByInfo(current, current.state));
                }

            if ((this.status.pageSize !== 25 ||
                this.status.filters.length !== 0 ||
                this.status.orderBy.length !== 0 ||
                JSON.stringify(this.status.groupBy) !== JSON.stringify(predefinedGroups) ||
                this.status.currentView !== "PREDEFINED") &&
                this.$list.hasClass(".list-no-preferences")) {
                this.$listHeader.find(".btn-list-reset").removeClass("hidden");
            }

            // Adjustments for Closed Groups Mode
            this.$list.find(".pager-container").toggle(!this.status.getGroupsClosed);
            this.$list.find(".btn-list-prev-state").toggle(this.listDisplaysClosedGroupItems());

            //Views
            var $viewsDropDown = this.$listHeader.find(".available-views");
            var selectedViewName = $viewsDropDown.val() === "PREDEFINED" ? "" : $viewsDropDown.val();
            var defaultViewName = this.viewsCache != null ? this.viewsCache.DefaultView : "";

            this.$listHeader.find(".btn-make-default-view")
                .toggleClass("selected", (selectedViewName === defaultViewName));

            if (selectedViewName === defaultViewName) {
                this.$listHeader.find(".btn-make-default-view").attr("disabled", "disabled");
            }
            else {
                this.$listHeader.find(".btn-make-default-view").removeAttr("disabled");
            }
        
            $viewsDropDown.find("option").removeClass("default");

            var defaultViewValue = defaultViewName != null && defaultViewName.length > 0
                ? defaultViewName
                : "PREDEFINED";

            $viewsDropDown.find(`option[value='${defaultViewValue}']`).addClass("default");
        }

        createListHeader() {
            var columnsNumber = this.status.columns.length;
            var colspan = columnsNumber > 1 ? columnsNumber : 2;

            var $newHeader = $(`<table class='list-header'> \
                                <thead><tr class='header-toolbar-container mobile'> \
                                        <th colspan='${colspan}'> \
                                            <div class='header-left'> \
                                                <div class='global-search-container'>\
                                                    <div class='global-search-area input-group input-group-sm'>\
                                                        <input class='global-search-input form-control' type='text' placeholder='${this.resources.Search}' />\
                                                        <span class='global-search-clear glyphicon glyphicon-remove'></span>\
                                                        <span class='input-group-btn'><button type='button' class='btn btn-default global-search-btn'><i class='${ListControlAsset.Icons.search.bs}'></i></btn></span>\
                                                    </div>\
                                                </div>\
                                                <div class='btn-group jb-list-btn-group'> \
                                                    <button type='button' class='toggle-quick-filters btn btn-default btn-sm'>\
                                                        <span class='${ListControlAsset.Icons.quickFilter.bs}'></span>\
                                                    </button>\
                                                </div>\
                                                <div class='btn-group jb-list-btn-group'> \
                                                    <button type='button' class='clear-all-filters btn btn-default btn-sm'>\
                                                        <span class='${ListControlAsset.Icons.clearAllFilters.bs
                }'></span>\
                                                    </button>\
                                                </div>  \
                                                <div class='btn-group jb-list-btn-group'> \
                                                    <button type='button' class='clear-all-aggregators btn btn-default btn-sm'>\
                                                        <span class='${ListControlAsset.Icons.clearAllAggregators.bs
                }'></span>\
                                                    </button>\
                                                </div>  \
                                                <div class='btn-group jb-list-btn-group'> \
                                                    <button type='button' class='select-all-page-rows btn btn-default btn-sm'>\
                                                    </button>\
                                                    <button type='button' class='select-all-rows btn btn-default btn-sm'>\
                                                    </button>\
                                                </div>\
                                            </div> \
                                            <div class='btn-group jb-list-btn-group mobile-menu-container'> \
                                                  <button type='button' class='mobile-menu btn btn-sm btn-default dropdown-toggle' data-toggle='dropdown' aria-expanded='false'> \
                                                    <span class='${ListControlAsset.Icons.cogs.bs}'></span> \
                                                  </button> \
                                                  <ul class='dropdown-menu mobile-dropdown-menu' role='menu'> \
                                                    <li class='divider actions-divider'></li> \
                                                    <li><span class='${ListControlAsset.Icons.refresh.bs
                }'></span><a href='#' class='btn-list-refresh'>${this.resources.RefreshTooltip}</a></li> \
                                                    <li><span class='${ListControlAsset.Icons.prevState.bs
                }'></span><a href='#' class='btn-list-prev-state'>${this.resources.PrevStateTooltip}</a></li> \
                                                    <li><span class='${ListControlAsset.Icons.prefs.bs
                }'></span><a href='#' class='btn-list-preferences'>${this.resources.PreferencesTooltip}</a></li> \
                                                    <li><span class='${ListControlAsset.Icons.filters.bs
                }'></span><a href='#' class='btn-list-filters'>${this.resources.FiltersTooltip}</a></li> \
                                                    <li><span class='${ListControlAsset.Icons.groups.bs
                }'></span><a href='#' class='btn-list-groups'>${this.resources.GroupingOrder}</a></li> \
                                                    <li><span class='${ListControlAsset.Icons.export.bs
                }'></span><a href='#' class='btn-list-export'>${this.resources.Export}</a></li> \
                                                    <li><span class='${ListControlAsset.Icons.import.bs
                }'></span><a href='#' class='btn-list-import'>${this.resources.Import}</a></li> \
                                                    <li><span class='${ListControlAsset.Icons.reset.bs
                }'><a href='#' class='btn-list-reset hidden'></span>${this.resources.ResetTooltip}</a></li> \
                                                  </ul> \
                                            </div>\
                                            <div class='header-right'> \
                                                <div class='tool-buttons-container btn-toolbar' role='toolbar'> \
                                                    <div class='btn-group jb-list-btn-group views'> \
                                                        <select class='available-views form-control'> \
                                                        </select> \
                                                    </div> \
                                                    <div class='btn-group jb-list-btn-group'> \
                                                        <button title='${this.resources.MakeDefault
                }' type='button' class='btn btn-default btn-make-default-view'>\
                                                            <span class='glyphicon glyphicon-check' aria-hidden='true'></span> \
                                                        </button> \
                                                        <button title='${this.resources.SaveCurrentView
                }' type='button' class='btn btn-default btn-save-view'>\
                                                            <span class='${ListControlAsset.Icons.save.bs}'></span> \
                                                        </button> \
                                                        <button title='${this.resources.DeleteCurrentView
                }' type='button' class='btn btn-default btn-remove-view'>\
                                                            <span class='${ListControlAsset.Icons.remove.bs}'></span> \
                                                        </button> \
                                                    </div> \
                                                </div> \
                                            </div> \
                                        </th> \
                                    </tr> \
                                    <tr class='header-toolbar-container'> \
                                        <th colspan='${colspan}'> \
                                            <div class='header-left'> \
                                                <div class='global-search-container'>\
                                                    <div class='global-search-area input-group input-group-sm'>\
                                                        <input class='global-search-input form-control' type='text' placeholder='${this.resources.Search}' />\
                                                        <span class='global-search-clear glyphicon glyphicon-remove'></span>\
                                                        <span class='input-group-btn'><button type='button' class='btn btn-default global-search-btn'><i class='${ListControlAsset.Icons.search.bs}'></i></btn></span>\
                                                    </div>\
                                                </div>\
                                                <div class='btn-group jb-list-btn-group'> \
                                                    <button type='button' class='toggle-quick-filters btn btn-default btn-sm'>\
                                                        <span class='toggle-quick-filters-caption'>${
                this.resources.ShowQuickFilters}</span>\
                                                        <span class='${ListControlAsset.Icons.quickFilter.bs}'></span>\
                                                    </button>\
                                                </div>\
                                                <div class='btn-group jb-list-btn-group'> \
                                                    <button type='button' class='clear-all-filters btn btn-default btn-sm'>\
                                                        <span class='clear-all-filters-caption'>${
                this.resources.FiltersApplied}</span>\
                                                        <span class='${ListControlAsset.Icons.clearAllFilters.bs
                }'></span>\
                                                    </button>\
                                                </div>\
                                                <div class='btn-group jb-list-btn-group'> \
                                                    <button type='button' class='clear-all-aggregators btn btn-default btn-sm'>\
                                                        <span class='clear-all-filters-aggregators'>${
                this.resources.ClearAggregators}</span>\
                                                        <span class='${ListControlAsset.Icons.clearAllAggregators.bs
                }'></span>\
                                                    </button>\
                                                </div>\
                                                <div class='btn-group jb-list-btn-group'> \
                                                    <button type='button' class='select-all-page-rows btn btn-default btn-sm'>\
                                                    </button>\
                                                    <button type='button' class='select-all-rows btn btn-default btn-sm'>\
                                                    </button>\
                                                </div>\
                                            </div>\
                                            <div class='header-right'> \
                                                <div class='tool-buttons-container btn-toolbar' role='toolbar'> \
                                                    <div class='btn-group jb-list-btn-group'>\
                                                        <button title='${this.resources.PrevStateTooltip
                }' type='button' class='btn btn-default btn-list-prev-state'>\
                                                            <span class='${ListControlAsset.Icons.prevState.bs
                }'></span> \
                                                        </button> \
                                                    </div> \
                                                    <div class='btn-group jb-list-btn-group'>\
                                                        <button title='${this.resources.RefreshTooltip
                }' type='button' class='btn btn-default btn-list-refresh'>\
                                                            <span class='${ListControlAsset.Icons.refresh.bs
                }'></span> \
                                                        </button> \
                                                    </div> \
                                                    <div class='btn-group jb-list-btn-group'>\
                                                        <button title='${this.resources.PreferencesTooltip
                }' type='button' class='btn btn-default btn-list-preferences'>\
                                                            <span class='${ListControlAsset.Icons.prefs.bs}'></span> \
                                                        </button> \
                                                        <button title='${this.resources.FiltersTooltip
                }' type='button' class='btn btn-default btn-list-filters'>\
                                                            <span class='${ListControlAsset.Icons.filters.bs
                }'></span> \
                                                        </button> \
                                                        <button title='${this.resources.GroupingOrder
                }' type='button' class='btn btn-default btn-list-groups'>\
                                                            <span class='${ListControlAsset.Icons.groups.bs}'></span> \
                                                        </button> \
                                                        <button title='${this.resources.Export
                }' type='button' class='btn btn-default btn-list-export'>\
                                                            <span class='${ListControlAsset.Icons.export.bs}'></span> \
                                                        </button> \
                                                        <button title='${this.resources.Import
                }' type='button' class='btn btn-default btn-list-import'>\
                                                            <span class='${ListControlAsset.Icons.import.bs}'></span> \
                                                        </button> \
                                                    </div> \
                                                    <div class='btn-group jb-list-btn-group'>\
                                                        <button title='${this.resources.ResetTooltip
                }' type='button' class='btn btn-default btn-list-reset hidden'>\
                                                            <span class='${ListControlAsset.Icons.reset.bs}'></span> \
                                                        </button> \
                                                    </div> \
                                                    <div class='btn-group jb-list-btn-group'> \
                                                        <select class='available-views form-control'> \
                                                        </select> \
                                                    </div> \
                                                    <div class='btn-group jb-list-btn-group'>  \
                                                        <button title='${this.resources.MakeDefault
                }' type='button' class='btn btn-default btn-make-default-view'>\
                                                            <span class='glyphicon glyphicon-check' aria-hidden='true'></span> \
                                                        </button> \
                                                        <button title='${this.resources.SaveCurrentView
                }' type='button' class='btn btn-default btn-save-view'>\
                                                            <span class='${ListControlAsset.Icons.save.bs}'></span> \
                                                        </button> \
                                                        <button title='${this.resources.DeleteCurrentView
                }' type='button' class='btn btn-default btn-remove-view'>\
                                                            <span class='${ListControlAsset.Icons.remove.bs}'></span> \
                                                        </button> \
                                                    </div> \
                                                </div> \
                                            </div> \
                                        </th> \
                                    </tr> \
                                    <tr class='list-preferences-fieldsets-container'> \
                                        <th class='list-preferences-fieldsets-wrapper' colspan='${colspan}'></th>\
                                    </tr> \
                                </thead> \
                            </table>`);

            var preferencesOpened = false;
            var filtersOpened = false;
            var groupingOpened = false;

            if (this.$listHeader == null) {
                this.$listHeader = this.$list.find(".list-header");
            } else {
                //Check for grid visibility state
                if (this.$preferencesContainer.find(".preferences-grid").is(":visible") &&
                    !this.$preferencesContainer.find(".preferences-grid").hasClass("draggable-docked")) {
                    preferencesOpened = true;
                }
                if (this.$filtersContainer.find(".filters-grid").is(":visible") &&
                    !this.$filtersContainer.find(".filters-grid").hasClass("draggable-docked")) {
                    filtersOpened = true;
                }
                if (this.$groupsContainer.find(".groups-grid").is(":visible") &&
                    !this.$groupsContainer.find(".groups-grid").hasClass("draggable-docked")) {
                    groupingOpened = true;
                }

                //Check for grid minimized state
                this.isPreferencesMinimized = this.$preferencesContainer
                    .find(".preferences-grid .collapsible-grid-main-container")
                    .css("display") ===
                    "none";
                this.isFiltersMinimized = this.$filtersContainer.find(".filters-grid .collapsible-grid-main-container")
                    .css("display") ===
                    "none";
                this.isGroupsMinimized = this.$groupsContainer.find(".groups-grid .collapsible-grid-main-container")
                    .css("display") ===
                    "none";
            }

            if (this.options.useContextMenuForRowActions) {
                var $actionButtonsContainer = this.options.$container.find(".list-action-buttons-container")
                    .addClass("jb-list-btn-group");
                $newHeader.find(".header-toolbar-container:not(.mobile) .header-left").after($actionButtonsContainer);
                //$actionButtonsContainer.appendTo($newHeader.find(".header-toolbar-actions th"));
                this.createCommonActionsDropDown($actionButtonsContainer, $newHeader);
            }

            this.$listHeader.replaceWith($newHeader);
            this.$listHeader = $newHeader;

            if (this.options.standAlone !== false) {
                if (this.$preferencesContainer == null) {
                    this.$preferencesContainer = this.$listDockedGrids;
                } else if (this.$preferencesContainer !== this.$listDockedGrids) {
                    this.$preferencesContainer = this.$listHeader.find(".list-preferences-fieldsets-container > th");
                }
                if (this.$filtersContainer == null) {
                    this.$filtersContainer = this.$listDockedGrids;
                } else if (this.$filtersContainer !== this.$listDockedGrids) {
                    this.$filtersContainer = this.$listHeader.find(".list-preferences-fieldsets-container > th");
                }
                if (this.$groupsContainer == null) {
                    this.$groupsContainer = this.$listDockedGrids;
                } else if (this.$groupsContainer !== this.$listDockedGrids) {
                    this.$groupsContainer = this.$listHeader.find(".list-preferences-fieldsets-container > th");
                }
            } else {
                this.$preferencesContainer = this.$listHeader.find(".list-preferences-fieldsets-container > th");
                this.$filtersContainer = this.$listHeader.find(".list-preferences-fieldsets-container > th");
                this.$groupsContainer = this.$listHeader.find(".list-preferences-fieldsets-container > th");
            }
            this.populateViewsDropDown();

            if (this.options.pagerPosition === "TOP") {
                $newHeader.append(this.createListPager());
            }

            this.$listHeader.find(".select-all-page-rows").toggle(this.options.hasMultiselection !== false);
            this.$listHeader.find(".select-all-rows").toggle(this.options.hasMultiselection !== false);

            if (this.options.usePopUpsForPreferences === false) {
                this.createPreferencesFieldSets();
            }

            //Restore tab visibility state
            if (preferencesOpened) {
                this.$preferencesContainer.find(".preferences-grid").addClass("shown").show();
            }
            if (filtersOpened) {
                this.$filtersContainer.find(".filters-grid").addClass("shown").show();
            }
            if (groupingOpened) {
                this.$groupsContainer.find(".groups-grid").addClass("shown").show();
            }
            this.$listHeader.find(".toggle-quick-filters").toggle(!this.options.showRowNumbers);

            if (this.options.isPickList) {
                this.$listHeader.find(".btn-list-filters").remove();
            }

            return $newHeader;
        }

        configureMobileMode() {
            var SINGLE_LINE_HEIGHT = 65;
            let isMobileMode = this.isMobileMode;

            //Reset web mode
            this.options.$container.find(".header-toolbar-container").show();
            this.$listPager.find(".total-records-web").toggle(true);
            this.$listPager.find(".total-records-mobile").toggle(false);
            this.$listPager.find(".rows-per-page-area, .pager-input-container").toggle(true);
            this.$listPager.find(".pager-input-container-mobile").toggle(false);
            this.$listHeader.find(".header-toolbar-container.mobile .mobile-dropdown-menu")
                .removeClass("small")
                .css("width", "");

            var containerIsSmall = this.options.$container.outerWidth() <
                this.options.$container.find(".header-toolbar-container:not(.mobile) .header-left").width() +
                this.options.$container.find(".header-toolbar-container:not(.mobile) .header-right").width() +
                this.options.$container.find(".header-toolbar-container:not(.mobile) .list-action-buttons-container")
                .width();

            var dimensionsAreSmall =
                this.options.$container.find(".header-toolbar-container:not(.mobile)").outerHeight() >
                    SINGLE_LINE_HEIGHT ||
                    (this.$listPager != null &&
                    (this.options.$container.outerWidth() <
                        this.$listPager.find(".pager-left").width() + this.$listPager.find(".pager-right").width())) ||
                    (this.$listPager != null &&
                        this.options.pagerPosition === "TOP" &&
                        this.$listPager.outerHeight() > SINGLE_LINE_HEIGHT);

            isMobileMode = containerIsSmall || dimensionsAreSmall;

            //$listHeader.find(".header-toolbar-actions").toggle(!isMobileMode);
            this.$listHeader.find(".header-toolbar-container.mobile").toggle(isMobileMode);
            this.$listHeader.find(".header-toolbar-container:not(.mobile)").toggle(!isMobileMode);
            this.$listPager.find(".total-records-web").toggle(!isMobileMode);
            this.$listPager.find(".total-records-mobile").toggle(isMobileMode);
            this.$listPager.find(".rows-per-page-area, .pager-input-container").toggle(!isMobileMode);
            this.$listPager.find(".pager-input-container-mobile").toggle(isMobileMode);

            //To use popups in mobile and control mode
            this.options.usePopUpsForPreferences = isMobileMode || (this.options.standAlone === false);

            if (isMobileMode) {
                //Global Search full width
                var $globalSearch = this.$listHeader
                    .find(".header-toolbar-container.mobile .header-left .global-search-container");
                var $availableViews = this.$listHeader
                    .find(".header-toolbar-container.mobile .header-right .available-views");
                var totalWidth = this.options.$container.width();
                var BORDER_SPACING_LEFT = 70;
                var BORDER_SPACING_RIGHT = 3;

                totalWidth -= BORDER_SPACING_LEFT;
                this.$listHeader.find(".header-toolbar-container.mobile .header-left .jb-list-btn-group")
                    .each(function() {
                        totalWidth -= $(this).outerWidth(true);
                    });

                totalWidth -= this.$listHeader.find(".mobile-menu-container").outerWidth();
                $globalSearch.css({ "width": totalWidth + "px" });
                totalWidth = this.options.$container.width();
                totalWidth -= BORDER_SPACING_RIGHT;
                this.$listHeader.find(".header-toolbar-container.mobile .header-right .jb-list-btn-group:not(.views)")
                    .each(function() {
                        totalWidth -= $(this).outerWidth(true);
                    });
                $availableViews.css({ "width": totalWidth + "px" });

                var containerWidth = this.options.$container.outerWidth();
                var $dropDownMenu = this.$listHeader.find(".header-toolbar-container.mobile .mobile-dropdown-menu");
                if ($dropDownMenu.outerWidth() >= containerWidth) {
                    $dropDownMenu.addClass("small").css("width", (containerWidth * 0.8) + "px");
                }
            }
        }

        createCommonActionsDropDown($actionButtonsContainer, $header) {
            if ($actionButtonsContainer.find(".common-actions-dropdown").length > 0) return;
            const $mobileMenu = $header.find(".mobile-dropdown-menu");

            const $dropDown = $(`<div class='dropdown common-actions-dropdown'> \
                                <button class='btn btn-primary btn-sm dropdown-toggle' type='button' data-toggle='dropdown'> \
                                    <span>${this.resources.CommonActions}</span> \
                                    <span class='caret'></span> \
                                </button> \
                                 <ul class='dropdown-menu' role='menu'>\
                                </ul>\
                            </div>`);

            const $buttons = $header.find(".show-always, .show-single, .show-multi");
            let $mobileActions = "";
            for (let i = 0; i < $buttons.length; i++) {
                var itemClass = $buttons.eq(i).hasClass("show-always")
                    ? "show-always"
                    : $buttons.eq(i).hasClass("show-single") ? "show-single" : "show-multi";
                var item = `<li role='presentation' data-target='${$buttons.eq(i).attr("jb-id")}' class='${itemClass
                    }'> \
                                <a role='menuitem' tabindex='-1' href='javascript:void(0)'> \
                                    <span>${$buttons.eq(i).find("[jb-type='Label']").text()}</span>\
                                </a> \
                            </li>`;

                $dropDown.find(".dropdown-menu").append(item);
                $mobileActions += `<li><a href='#' class='${itemClass}' data-target='${$buttons.eq(i).attr("id")}'>${
                    $buttons.eq(i).find("span").text()}</a></li>`;
            }
            $mobileMenu.prepend($mobileActions);
            $mobileMenu.find(".actions-divider").toggle($buttons.length > 0);

            $actionButtonsContainer.append($dropDown);
        }

        createListColumnHeader() {
            // Hide Temporary Quick Filters Container
            $(this.options.$container.find(".list-quick-filters-temp-container").hide());
            var columnsNumber = this.status.columns.length;
            var $newColumnHeader = $("<div class='list-column-header-container'> \
                                            <div class='list-column-header-wrapper'> \
                                                <table class='list-column-header'> \
                                                    <tr class='column-titles-container'> \
                                                    </tr> \
                                                    <tr class='quick-filters-container'> \
                                                    </tr> \
                                                </table> \
                                            </div> \
                                       </div>");

            var quickFiltersAreVisible = this.$listColumnHeaderContainer != null &&
                this.$listColumnHeaderContainer.find(".quick-filters-container").eq(0).is(":visible") === true;
            var $columnTitlesContainer = $newColumnHeader.find(".column-titles-container");
            var $quickFiltersContainer = $newColumnHeader.find(".quick-filters-container");

            if (this.options.showRowNumbers) {
                $newColumnHeader.addClass("with-row-numbering");
                var $columnRowNumber =
                    $("<th class='column-title row-number-header'><button type='button' class='show-quick-filters btn btn-default'><span class='glyphicon glyphicon-filter'></span></button></th>");
                var $columnRowNumberFilter =
                    $("<th class='column-quick-filter'><button type='button' class='hide-quick-filters btn btn-default'><span class='glyphicon glyphicon-remove'></span></button></th>");
                $columnTitlesContainer.append($columnRowNumber);
                $quickFiltersContainer.append($columnRowNumberFilter);
            }

            for (var i = 0; i < columnsNumber; i++) {
                var current = this.status.columns[i];

                if (this.columnMustBeRendered(current) === false) continue;

                var tooltip = current.orderable === true
                    ? (current.dataType == "DateTime" ? this.resources.SortDESC : this.resources.SortASC)
                    : "";
                var titleClass = current.orderable === true ? "title" : "title not-sortable";

                var $quickFilterInput = this.createQuickFilterInput(current);

                var $columnHeader = $(`<th class='column-title' data-column='${current.name}'> \
                                            <span class='move-column-left glyphicon glyphicon-chevron-left' title='${
                    this.resources.MoveColumnLeft
                    }'></span>\
                                            <div class='${titleClass}' title='${tooltip}'>${current.caption}</div>\
                                            <span class='sort-direction-icon glyphicon'></span>\
                                            <span class='move-column-right glyphicon glyphicon-chevron-right' title='${
                    this.resources.MoveColumnRight}'></span>\
                                        </th>`);

                var $filterHeader = $(`<th class='column-quick-filter' data-column='${current.name}'></th>`);

                if (this.options.hasResizableColumns !==
                    false) $columnHeader.append("<div class='row-resize-handler'></div>");

                $filterHeader.append($quickFilterInput);
                $quickFiltersContainer.append($filterHeader);
                $columnTitlesContainer.append($columnHeader);

                $columnHeader.find(".title").data("sort-direction", OrderByDirections.NONE);
            }

            // Make Resize Helpers Draggable
            const self = this;
            $newColumnHeader.find(".row-resize-handler")
                .draggable({
                    axis: "x",
                    containment: ".column-titles-container",
                    start: (event, ui) => {
                        $(event.target)
                            .css({
                                "opacity": "1"
                            });
                    },
                    drag: function(event, ui) {
                        const columnInfo = self.getColumnInfoByName($(this).parent().attr("data-column"));
                        if (ui.position.left < columnInfo.minWidth) {
                            ui.position.left = columnInfo.minWidth;
                        }
                    },
                    stop: (event, ui) => {
                        $(event.target).css("left", "");
                        this.onColumnResized(event, ui);
                    }
                });

            if (this.$listColumnHeaderContainer == null)
                this.$listColumnHeaderContainer = this.$list.find(".list-column-header-container");

            this.$listColumnHeaderContainer.replaceWith($newColumnHeader);

            this.$listColumnHeaderContainer = $newColumnHeader;

            this.$listColumnHeader = this.$listColumnHeaderContainer.find(".list-column-header-wrapper");
            this.populateViewsDropDown();

            if (quickFiltersAreVisible)
                this.toggleQuickFiltersRow(this.$listHeader
                    .find(".header-toolbar-container:visible .toggle-quick-filters"));

            return $newColumnHeader;
        }

        createQuickFilterInput(column) {
            if (column.searchable === false) return;

            const $container = $("<div class='quick-filter-wrapper'></div>");

            // User has defined a drop down box
            var $customDropDown = this.options.$container
                .find(`[jb-type='DropDownBox'][data-filter-for-column='${column.name}']`);

            var $input;

            if ($customDropDown.length > 0) {
                $customDropDown.appendTo($container);
                $customDropDown.find("input[onchange]").removeAttr("onchange");
            }

            switch (column.dataType) {
            case "bool":

                $input = $(`<select class='quick-filter form-control bool-quick-filter'> \
                                    <option value=''></option> \
                                    <option value='true'>${this.resources.True}</option> \
                                    <option value='false'>${this.resources.False}</option> \
                                 </select>`);

                $container.addClass("bool-quick-filter-container");
                break;

            case "DateTime":
                $input = $('<input type="text" class="quick-filter default-input form-control" />');

                this.convertElementToDatePicker($input, column.formatting);

                $input.on("change",
                    () => {
                        $input.siblings(".apply-quick-filter").toggle($input.val() !== "");
                    });

                break;

            default:
                $input = $("<input type='text' class='quick-filter default-input form-control' />");
                break;
            }

            const $removeFilter = $(`<span class='remove-quick-filter glyphicon glyphicon-remove hidden' title='${
                this.resources.ClearQuickFilter}'></span>`);
            const $applyFilter = $(`<span class='apply-quick-filter glyphicon glyphicon-search' title='${
                this.resources.ApplyQuickFilter}'></span>`);

            if ($customDropDown.length > 0) {
                $input.hide();
                $container.addClass("has-custom-drop-down");
                $container.append($input);

                if ($customDropDown.find(".remove-quick-filter").length === 0) {
                    $customDropDown.prepend($removeFilter);
                }
            } else {
                $container.append($removeFilter);
                $container.append($input);
                if (column.dataType !== "bool") {
                    $container.append($applyFilter);
                }
            }

            return $container;
        }

        convertElementToDatePicker($el, format) {
            $el.datetimepicker({
                format: this.getFormatOfDate(format),
                timepicker: false,
                datepicker: true
            });
        }

        getFormatOfDate(format, withTime?) {
            const defaultDateFormat = "DD/MM/YYYY";
            const defaultTimeFormat = "h:mm";
            const formatToUse = format == null || format.trim() === "" ? defaultDateFormat : format;

            return withTime === true
                ? formatToUse + " " + defaultTimeFormat
                : formatToUse;
        }

        initializeDatepickerPlugIn() {
            if (window.momentJsInitialized || window.moment == null || $.datetimepicker == null) return;

            // Configure Timepicker to use moment.js (only once)
            Date["parseDate"] = (input, format) => moment(input, format).toDate();

            Date.prototype.dateFormat = function(format) {
                return moment(this).format(format);
            };

            window.momentJsInitialized = true;

            // Apply Locales
            $.datetimepicker.setLocale(window._context.locale);
        }

        createListData() {
            this.currentRowNumber = this.status.startRow;

            if (this.status.groupBy.length > 0) {
                this.createGroupsData();
                return;
            }

            const $newData = $("<div class='list-data-container'> \
                                <div class='list-data-wrapper'> \
                                <table class='list-data-table table'> \
                                    <tbody>\
                                    </tbody>\
                                </table>\
                                </div> \
                                <div class='row-num-border'></div> \
                            </div>");

            const $dataBody = $newData.find("tbody");

            this.createDataRows(this.data, $dataBody);

            if (this.data.length === 0) {
                $dataBody.append(this.createNotFoundRow());
            }

            if (this.$listDataContainer == null) this.$listDataContainer = this.$list.find(".list-data-container");

            $newData.attr("style", this.$listDataContainer.attr("style"));

            $newData.find(".list-data-table").toggleClass("table-striped", this.options.stripped !== false);

            this.$listDataContainer.replaceWith($newData);

            this.$listDataContainer = $newData;

            this.$listData = this.$listDataContainer.find(".list-data-wrapper");

            this.scrollInnerContent(this.$listDataContainer);

            for (let i = 0; i < this.status.selectedItemKeys.length; i++) {
                this.$listDataContainer.find(`.list-data-row[data-key='${this.status.selectedItemKeys[i]}']`)
                    .addClass("selected-row");
                this.$listDataContainer.find(`.list-data-row[data-key='${this.status.selectedItemKeys[i]}']`)
                    .find(".list-data-cell span")
                    .removeClass("text-compact");
            }
            return $newData;
        }

        createDataRows(collection, $target, groupPath?, groupLevel?) {
            var groupMode = typeof (groupPath) != "undefined" && groupPath != null && groupPath.length > 0;

            for (var i = 0; i < collection.length; i++) {
                var current = collection[i];
                var $row = $("<tr class='list-data-row'></tr>");

                $row.attr("data-key", current._key);

                if (groupMode) {
                    $row.addClass("group-row");
                    $row.attr("data-group", groupPath);
                }

                if (this.options.showRowNumbers) {
                    this.currentRowNumber++;

                    var clsForDigit = "num-single-digit";
                    if (this.currentRowNumber > 9) clsForDigit = "num-double-digit";
                    if (this.currentRowNumber > 99) clsForDigit = "num-triple-digit";
                    var $rowNumCell = $(`<td class='list-data-cell row-number'><span class='circled-num ${clsForDigit
                        }'>${this.currentRowNumber}</span></td>`);

                    if (groupLevel != null) $rowNumCell.attr("data-parentGroupLevel", groupLevel);

                    $row.append($rowNumCell);
                }

                for (var j = 0; j < this.status.columns.length; j++) {
                    var currentColumn = this.status.columns[j];

                    if (this.columnMustBeRendered(currentColumn) === false) continue;

                    var $cell = $("<td class='list-data-cell'></td>");
                    var style = currentColumn.style;

                    if (typeof (style) != "undefined" && style != null && style.length > 0) $cell.attr("style", style);

                    var columnParts = currentColumn.name.split(".");

                    var value = current;
                    
                    for (let i = 0; i < columnParts.length; i++) {
                        if (value == null) {                            
                            break;
                        }

                        value = value[columnParts[i]];
                    }
                    
                    var itemType = currentColumn.itemType;

                    if (currentColumn.formatting != null) {
                        if (currentColumn.dataType === "DateTime") {
                            value = currentColumn.formatting.format(value, true);
                        }
                        else if (this.isDataTypeNumeric(currentColumn.dataType)) {
                            value = currentColumn.formatting.format(value);                      
                        }
                        else {
                            console.error(`Cannot format datatype ${currentColumn.dataType}`, currentColumn.formatting);
                        }
                    }

                    var cellContents = this.createCell(value, currentColumn);

                    $cell.append(cellContents);

                    if (this.options.showCellDataOnHover !== false) {
                        $cell.attr("title", value);
                    }

                    if (itemType == "CHECKBOX" || itemType == "IMAGEBOX") $cell.css("text-align", "center");

                    $row.append($cell);
                }

                $target.append($row);
            }
        }

        hideListData() {
            if (this.$listData == null || this.hidingData) return;

            this.$rowContextMenu.hide();

            this.hidingData = true;

            this.$list.find(".list-data-opacity-container")
                .animate({
                        "opacity": "0"
                    },
                    200,
                    () => {
                        this.hidingData = false;
                    });
        }

        showListData() {
            if (this.$listData == null) return;

            if (this.hidingData !== false) {
                setTimeout(() => {
                        this.showListData();
                    },
                    100);
                return;
            }

            this.$list.find(".list-data-opacity-container")
                .animate({
                        "opacity": "1"
                    },
                    500);
        }

        showControl() {
            var $header = this.options.$container.prev(".list-control-title-container");

            if (this.options.isPickList !== true) {
                this.options.$container.animate({
                    "opacity": "1"
                },
                    500);
            }

            $header.animate({
                    "opacity": "1"
                },
                500);

            this.$predefinedFiltersFieldSet.animate({
                    "opacity": "1"
                },
                500);

            if (this.options.isPickList == true) {
                this.options.$container.show();
            }

            // Low resolution fix for List inside Responsive row http://redmine.clmsuk.com:81/redmine/issues/8418        
            if (this.options.$container.parent(".form-group").parent().data("type") == "ResponsiveRow") {
                this.options.$container.parent(".form-group")
                    .css("height", (this.options.$container.outerHeight() + 100) + "px");
            }
            if (this.$list != null) {
                this.$list.find(".clear-all-aggregators")
                    .toggle(this.status.aggregators && this.status.aggregators.length > 0);
            }
        }

        hideControl(hidePredefinedFilters?) {
            const $header = this.options.$container.prev(".list-control-title-container");

            this.options.$container.animate({
                    "opacity": "0"
                },
                500);

            $header.animate({
                    "opacity": "0"
                },
                500);

            if (hidePredefinedFilters !== true) return;

            this.$predefinedFiltersFieldSet.animate({
                    "opacity": "1"
                },
                500);
        }

        createListPager(): JQuery {
            const columnsNumber = this.status.columns.length;
            const colspan = columnsNumber;

            const pagerClass = this.options.pagerPosition === "BOTTOM"
                ? "pager-bottom-container"
                : "pager-top-container";

            const newPagerStr = `<tr class='pager-container ${pagerClass}' style="display: table-row;"> \
                                        <th colspan='${colspan}'> \
                                            <div class='pager-left'> \
                                                <div class='list-pager'> \
                                                    <div class='input-append dropdown combobox pager-input-container'>\
                                                        <span class='page-caption'>${this.resources.Page}</span>\
                                                        <input class='list-current-page' type='text' value='1'>\
                                                        <span>${this.resources.Of}</span>\
                                                        <span class='data-total-pages'></span>\
                                                        <span>${this.resources.Pages}</span>\
                                                    </div>\
                                                   <div class='input-append dropdown combobox pager-input-container-mobile'>\
                                                        <span class='page-caption'>${this.resources.Page}</span>\
                                                        <input class='list-current-page' type='text' value='1'>\
                                                        <span>/</span>\
                                                        <span class='data-total-pages'></span>\
                                                    </div>\
                                                    <div class='btn-group jb-list-btn-group'> \
                                                        <button title='${this.resources.FirstPageTooltip
                }' type='button' class='btn btn-default list-first-page'> \
                                                            <i class='${ListControlAsset.Icons.first.bs}'></i> \
                                                        </button> \
                                                        <button title='${this.resources.PrevPageTooltip
                }' type='button' class='btn btn-default list-prev-page'> \
                                                            <i class='${ListControlAsset.Icons.prev.bs}'></i> \
                                                        </button> \
                                                        <button title='${this.resources.NextPageTooltip
                }' type='button' class='btn btn-default list-next-page'> \
                                                            <i class='${ListControlAsset.Icons.next.bs}'></i> \
                                                        </button> \
                                                        <button title='${this.resources.LastPageTooltip
                }' type='button' class='btn btn-default list-last-page'> \
                                                            <i class='${ListControlAsset.Icons.last.bs}'></i> \
                                                        </button> \
                                                    </div> \
                                                </div> \
                                            </div> \
                                             <div class='pager-right total-records'> \
                                                <div class='data-info total-records-web'> \
                                                    <span class='data-start'></span> \
                                                    <span>-</span> \
                                                    <span class='data-end'></span> \
                                                    <span>${this.resources.Of}</span> \
                                                    <span class='data-total'></span> \
                                                    <span>${this.resources.Items}</span> \
                                                </div> \
                                                <div class='data-info total-records-mobile'> \
                                                    <span class='page-caption'>${this.resources.Items}: </span> \
                                                    <span class='data-total'></span> \
                                                </div> \
                                                <div class='rows-per-page-area'> \
                                                    <select class='select-page-size'>\
                                                        <option value='10'>10</option>\
                                                        <option value='25'>25</option>\
                                                        <option value='50'>50</option>\
                                                        <option value='100'>100</option>\
                                                        <option value='200'>200</option>\
                                                    </select>\
                                                    <span class='fixed-page-size' style="display: inline-table;">${this.options.pageSize}</span>\
                                                    <span>${this.resources.PerPage}</span>\
                                                </div> \
                                            </div> \
                                        </th> \
                                    </tr>`;

            const $newPager = $(newPagerStr);

            if (this.options.displayRecordInfo === false) {
                $newPager.find(".total-records").addClass("hidden");
            }

            if (this.options.userCanSelectPageSize === false) {
                $newPager.find(".fixed-page-size").show();
                $newPager.find(".select-page-size").hide();
            }

            this.$listPager = $newPager;

            return $newPager;
        }

        createRecordSetAggregators(keepAggregatorsOfFullRecordSet) {
            //todo: log
            //if (SESSION_DEBUG.options.LIST_DEBUG === true) console.log("Requesting Aggregators Of Full RecordSet: " + (keepAggregatorsOfFullRecordSet !== true).toString());

            if (this.aggregatorsData == null) {
                this.getPredefinedAggregators();
                return;
            }

            if (keepAggregatorsOfFullRecordSet !== true) {
                this.updateAggregatorsData();
                return;
            }

            if (this.$listFooterContainer != null) {
                this.$listFooterContainer.find(".loading-aggregators-row").remove();
                this.$listFooterContainer.find(".list-aggregators-row").remove();
            }

            if (this.status.totalRows == 0) return;

            const rowCreationResult = this.createAggregatorsRow({
                rowClass: "list-aggregators-row",
                cellClass: "aggregator-cell",
                currentPageRowsSelector: ".list-data-row",
                aggregatorCaptionClass: "aggregator-caption",
                aggregatorValueClass: "aggregator-value",
                aggregatorContainerClass: "aggregator-container",
                groupIdentifier: null,
                groupMode: false,
                showPageAggregators: false
            });

            if (rowCreationResult != null && this.$listFooter != null) {
                const $row = rowCreationResult.$row;
                var aggregatorsFound = rowCreationResult.aggregatorsFound;

                this.$listFooter.find("tfoot").prepend($row);
            }

            if (this.$listFooter != null) this.$listFooter.toggle(aggregatorsFound);
        }

        aggregatorIsEnabled(col: ListControlColumn, aggregator) {
            if (col == null || aggregator == null || this.status.aggregators == null) return false;
           // debugger;
            for (let i = 0; i < this.status.aggregators.length; i++) {
                var current = this.status.aggregators[i];
                if (col.name == current.column) {
                    if (aggregator.type == AggregatorTypes.SUM && current.type == 0 ||
                        aggregator.type == AggregatorTypes.AVERAGE && current.type == 1 ||
                        aggregator.type == AggregatorTypes.COUNT && current.type == 2) {
                        return true;                      
                    }
                }
            }
            return false;
        }
        createAggregatorsRow(opts) {
            if (this.aggregatorsData == null || this.data == null) return;

            //todo: log
            //if (SESSION_DEBUG.options.LIST_DEBUG === true) console.log("Creating Aggegators Row");

            var aggregatorsFound = false;

            var columnsNumber = this.status.columns.length;

            var $row = $(`<tr class='${opts.rowClass}'></tr>`);
            if (this.options.showRowNumbers) {
                var $rowNumberCell = $(`<td class='${opts.cellClass} row-number'></td>`);
                $row.append($rowNumberCell);
            }

            for (let i = 0; i < columnsNumber; i++) {
                let current = this.status.columns[i];

                var index = this.options.$container.find(`.column-title[data-column='${current.name}']`).index();

                if (this.columnMustBeRendered(current) === false) continue;

                var columnAggregateInfo = [];

                for (let j = 0; j < this.aggregatorsData.length; j++) {
                    const item = this.aggregatorsData[j];
                    if (this.aggregatorIsEnabled(current, item) === false) continue;
                    var sanitizedGroupId = Joove.Common.replaceAll(item.groupIdentifier, "___", " ");
                    if (item.column === current.name &&
                        sanitizedGroupId == opts.groupIdentifier
                        /*item.groupIdentifier === opts.groupIdentifier*/) {
                        columnAggregateInfo.push(item);
                    }
                }

                let currentPageValues: Array<string> = [];
                var $currentPageRows = this.$listData.find(opts.currentPageRowsSelector);
                var $cell;
                if (columnAggregateInfo.length > 0) {
                    aggregatorsFound = true;

                    for (var j = 0; j < $currentPageRows.length; j++) {
                        $cell = $currentPageRows.eq(j).find(".list-data-cell").eq(index);
                        currentPageValues.push($cell.text());
                    }
                }
                $cell = $(`<td class='${opts.cellClass}'></td>`);
                for (let j = 0; j < columnAggregateInfo.length; j++) {
                    var item = columnAggregateInfo[j];
                    var captionGrand = "";
                    var captionPage = "";
                    var currentPageValue = 0;

                    var type = AggregatorTypes[item.type] as any;
                    
                    if (type == "SUM") {
                        captionGrand = this.resources.GrandTotal;
                        captionPage = this.resources.PageTotal;

                        if (opts.showPageAggregators !== true) {

                        for (let ii = 0; ii < currentPageValues.length; ii++) {
                            currentPageValue += Common.parseFloat(currentPageValues[ii]);
                        }
                        }
                    }

                    else if (type == "AVERAGE") {
                        captionGrand = this.resources.GrandAverage;
                        captionPage = this.resources.PageAverage;

                        if (opts.showPageAggregators !== true) {

                        for (let ii = 0; ii < currentPageValues.length; ii++) {
                            currentPageValue += Common.parseFloat(currentPageValues[ii]);
                        }

                        currentPageValue = currentPageValue / currentPageValues.length;
                        }
                    }
                    else if (type == "COUNT") {                       
                        captionGrand = this.resources.GrandCount;
                        captionPage = this.resources.PageCount;
                        currentPageValue = currentPageValues.length;
                    }
                                      
                    var span = `<span class='${opts.aggregatorCaptionClass}'>${captionGrand}</span>`;
                    var value = `<span class='${opts.aggregatorValueClass}' title='${item.value}'>${item.formattedValue}</span>`;
                    var seperator = "<br />";
                    var spanThisPage = `<span class='${opts.aggregatorCaptionClass}'>${captionPage}</span>`;
                    var currentPage = `<span class='${opts.aggregatorValueClass}' title='${currentPageValue}'>${this
                        .applyFormattingToNumber(currentPageValue)}</span>`;

                    var $container = $(`<div class='${opts.aggregatorContainerClass}'></div>`);
                    $container.append(span).append(value);

                    if (opts.groupMode === false) {
                        $container.append(seperator);
                    }

                    if (opts.showPageAggregators === true) {
                        $container.append(spanThisPage);
                        $container.append(currentPage);
                    }

                    $cell.append($container).append(seperator);
                }

                if (opts.groupMode === true) {
                    $cell.css("width",
                        this.$listColumnHeader.find(`.column-title[data-column='${current.name}']`).css("width"));
                }

                $row.append($cell);
            }

            return { $row: $row, aggregatorsFound: aggregatorsFound };
        }

        applyFormattingToNumber(number) {
            if (isNaN(number)) return 0;

            //var DECIMAL_DIGITS = 4;

            //number = number.toFixed(DECIMAL_DIGITS);

            // todo: numeral
            return number;
//            return numeral(number).format("0,0.[0000]");
        }

        createListControl() {
            //todo: log
            //if (SESSION_DEBUG.options.LIST_DEBUG === true) console.log("Creating List Control");

            this.$list = $(`<div class='list-wrapper'> \
                            <div class='list-header-container'>\
                            <table class='list-header'></table> \
                            </div> \
                            <div class='list-column-header-container'></div> \
                            <div class='list-docked-grids'></div> \
                            <div class='list-column-vertical-scrollbar'> \
                                <div class='top-right-corner'></div> \
                                <div class='scrollbar-content-wrapper'>\
                                    <div class='scrollbar-content'></div> \
                                </div> \
                                <div class='row-num-border'></div>\
                                <div class='bottom-right-corner'></div> \
                            </div> \
                            <div class='list-data-opacity-container'> \
                            <div class='list-data-container'></div> \
                            </div> \
                            <div class='list-footer-container'> \
                                <div class='list-footer-wrapper'> \
                                    <table class='list-footer'>\
                                        <tfoot>\<tr class='list-aggregators-row'></tr>\
                                        </tfoot>\
                                    </table>\
                                </div> \
                            </div> \
                            <div class='list-column-horzontal-scrollbar'> \
                                <div class='scrollbar-content-wrapper'> \
                                    <div class='scrollbar-content'></div> \
                                </div> \
                            </div> \
                            <ul class='title-context-menu dropdown-menu' role='menu' style='display:none'> \
                                <li data-action='${AggregatorTypes.SUM}'>\
                                    <a tabindex='-1' href='javascript:void(0)'> \
                                        <span class='${ListControlAsset.Icons.aggregator.bs}'></span>\
                                        <span>${this.resources.CalculateSum}</span>\
                                    </a> \
                                </li> \
                                <li data-action='${AggregatorTypes.AVERAGE}'>\
                                    <a tabindex='-1' href='javascript:void(0)'> \
                                        <span class='${ListControlAsset.Icons.aggregator.bs}'></span>\
                                        <span>${this.resources.CalculateAverage}</span>\
                                    </a> \
                                </li> \
                                <li data-action='${AggregatorTypes.COUNT}'> \
                                    <a tabindex='-1' href='javascript:void(0)'> \
                                        <span class='${ListControlAsset.Icons.aggregator.bs}'></span>\
                                        <span>${this.resources.CalculateCount}</span>\
                                    </a> \
                                </li> \
                            </ul> \
                        </div>`);

            this.$titleContextMenu = this.$list.find(".title-context-menu");
            this.$listFooterContainer = this.$list.find(".list-footer-container");
            this.$listFooter = this.$listFooterContainer.find(".list-footer-wrapper");
            this.$listDockedGrids = this.$list.find(".list-docked-grids");

            if (this.options.standAlone !== false) {
                this.goToStandAloneMode();
            }

            this.createRowContextMenu();

            if (this.options.pagerPosition === "BOTTOM") {
                this.$list.append("<table class='bottom-pager-table'></table>");
                this.$list.find(".bottom-pager-table").append(this.createListPager());
            }

            this.updateControl({
                createListHeader: true,
                createListColumnHeader: true,
                createListData: true,
                createListPager: true,
                createRecordSetAggregators: true,
                updateUiElements: true,
                updateGroupAggregators: true
            });

            this.options.$container.append(this.$list);

            if (this.$listVerticalScrollbar == null)
                this.$listVerticalScrollbar = this.$list.find(".list-column-vertical-scrollbar");
            if (this.$listHorizontalScrollbar == null)
                this.$listHorizontalScrollbar = this.$list.find(".list-column-horzontal-scrollbar");
            if (this.options.useCustomScrollbar === true) {
                this.$list.addClass("perfect-scrollbar");
                this.$listVerticalScrollbar.find(".scrollbar-content-wrapper")
                    .perfectScrollbar({ suppressScrollX: true });
                this.$listHorizontalScrollbar.find(".scrollbar-content-wrapper")
                    .perfectScrollbar({ suppressScrollY: true });
            }
            if (this.options.isSearchable === false ||
                this.anyColumnIsSearchable() === false) this.$list.addClass("list-not-searchable");
            if (this.options.isPaged === false) this.$list.addClass("list-not-paged");
            if (this.options.isExportable === false) this.$list.addClass("list-not-exportable");
            if (this.options.isImportable === false) this.$list.addClass("list-not-importable");
            if (this.options.userCanSelectPageSize === false) this.$list.addClass("list-fixed-page-size");
            if (this.options.hasPreferences === false) this.$list.addClass("list-no-preferences");
            if (this.options.isGroupable === false) this.$list.addClass("list-not-groupable");
            if (this.options.recordsInfoRow === false) this.$list.addClass("list-no-record-info");
            if (this.options.usePopUpsForPreferences === false) this.$list.addClass("list-no-popups");
            if (this.options.hasReorderableColumns === false) this.$list.addClass("list-not-reorderable");
            if (this.options.useContextMenuForRowActions)
                this.options.$container.addClass("list-no-row-action-buttons");
            if (this.options.standAlone !== false) this.options.$container.addClass("stand-alone");
            if (this.options.enableCompactText !== false) this.options.$container.addClass("with-compact-text");
            if (this.options.hasResizableColumns !== false) this.options.$container.addClass("resizable-cols");

            this.initGlobalListeners();

            //todo: log
            //if (SESSION_DEBUG.options.LIST_DEBUG === true) console.log("List Control Created");
        }

        anyColumnIsSearchable() {
            for (let i = 0; i < this.status.columns.length; i++) {
                if (this.status.columns[i].searchable === true) return true;
            }

            return false;
        }

        getColumnTitleWidth(width) {
            const moveIconsWidth = 0; //$listColumnHeader.find(".move-column-right").eq(0).width() * 2;
            const sortIconWidth = this.$listColumnHeader.find(".sort-direction-icon").eq(0).width();
            const PADDING = 10;
            const MARGIN = 30;
            return width - moveIconsWidth - sortIconWidth - MARGIN + PADDING;
        }

        getDefaultColumnMinWidth() {
            const titleMinWidth = 60;
            //var moveIconsWidth = $listColumnHeader.find(".move-column-right").eq(0).width() * 2;
            const sortIconWidth = this.$listColumnHeader.find(".sort-direction-icon").eq(0).width();
            const MARGIN = 0;
            return titleMinWidth + /*moveIconsWidth +*/ sortIconWidth + MARGIN;
        }

        getDefaultColumnWidth(column) {
            // it is based on header caption width, adjusted to fit all helper icons
            const $header = this.$listColumnHeader.find(`.column-title[data-column='${column.name}']`);

            const titleWidth = $header.find(".title").width();
            //var moveIconsWidth = $listColumnHeader.find(".move-column-right").eq(0).width() * 2;
            const sortIconWidth = this.$listColumnHeader.find(".sort-direction-icon").eq(0).width();

            const MARGIN = 15;

            return titleWidth + /*moveIconsWidth +*/ sortIconWidth + MARGIN;
        }

        scrollInnerContent($element) {
            if (this.isMobileMode) {
                setTimeout(() => { $element.niceScroll({ horizrailenabled: false }); }, 1000);
            } else {
                this.addScrollListener($element);
            }
        }

        addScrollListener($element) {
            $element.on("mousewheel",
                function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const scrollMovement = -(e.originalEvent.wheelDelta / 2);
                    $(this).scrollTop(scrollMovement + $(this).scrollTop());
                });
        }

        toggleVisibleRowsSelection(action) {
            const $rows = null;
            var select = action === "SELECT";

            if (select === false) {
                this.status.allRecordsSelected = false;
            }
            const self = this;
            this.$listData.find(".list-data-row")
                .each(function() {
                    var $row = $(this);
                    var key = $row.data("key");

                    if (select && self.status.selectedItemKeys.indexOf(key) === -1) {
                        self.addRowKeyToSelectedItems(key);
                    } else if (select === false) {
                        self.removeRowKeyFromSelectedItems(key);
                    }

                    self.toggleRowSelection($row, select);
                });


            if (!this.options.isPickList) {
                this.updateSelection();
            } else {
                this.updateControl({ refreshDimensions: true });
            }

            this.updateSelectionButtonsStatus();
        }

        toggleAllRowsSelection(action) {
            const self = this;
            var select = action === "SELECT";

            this.status.selectedItemKeys = [];
            this.status.allRecordsSelected = action === "SELECT";

            this.$listData.find(".list-data-row")
                .each(function() {
                    self.toggleRowSelection($(this), select);
                });

            if (!this.options.isPickList) {
                this.updateSelection();
            } else {
                this.updateControl({ refreshDimensions: true });
            }

            this.updateSelectionButtonsStatus();
        }

        updateSelectionButtonsStatus() {
            const allRowsSelected = this.status.allRecordsSelected;
            const allPageRowsSelected = allRowsSelected ||
                this.$listData.find(`.list-data-row:not(.${this.options.selectedRowClass})`).length === 0;
            const $selectPageRows = this.$listHeader.find(".select-all-page-rows");
            const $selectAllRows = this.$listHeader.find(".select-all-rows");

            $selectPageRows.data("action", allPageRowsSelected ? "DESELECT" : "SELECT");
            $selectAllRows.data("action", allRowsSelected ? "DESELECT" : "SELECT");

            $selectPageRows.html(allPageRowsSelected
                ? this.resources.DeselectAllPageRecordsText
                : this.resources.SelectAllPageRecordsText);
            $selectAllRows.html(allRowsSelected
                ? this.resources.DeselectAllRecordsPromptText
                : this.resources.SelectAllRecordsPromptText);
        }

        toggleRowSelection($row, select) {
            $row.toggleClass(this.options.selectedRowClass, select === true);

            if (this.options.enableCompactText !== false) {
                $row.find(".list-data-cell > span:not(.circled-num)").toggleClass("full-text", select === true);
            }
        }

        restoreSelectedItems() {
            if (this.$listData == null) return;

            const $visibleRows = this.$listData.find(".list-data-row");

            for (let i = 0; i < $visibleRows.length; i++) {
                const $row = $visibleRows.eq(i);

                const isSelected = this.status.selectedItemKeys.indexOf($row.data("key")) > -1 ||
                    this.status.allRecordsSelected;
                this.toggleRowSelection($row, isSelected);
            }
        }

        onRowClick(row) {
            const $row = $(row);
            const selectedClass = this.options.selectedRowClass;

            if (this.options.hasMultiselection === false) {
                this.status.selectedItemKeys = [];

                this.$listData.find(`.${selectedClass}`).addClass("previous-selection");

                if (this.options.enableCompactText !== false) {
                    this.$listData.find(`.${selectedClass} td.list-data-cell > span:not(.circled-num)`)
                        .addClass("full-text");
                }
            }

            this.$listData.find(".previous-selection").removeClass(selectedClass).removeClass("previous-selection");

            this.toggleRowSelection($row, $row.hasClass(selectedClass) === false);

            this.updateSelectionButtonsStatus();

            const key = $row.data("key");

            if ($row.hasClass(selectedClass)) {
                this.addRowKeyToSelectedItems(key);
            } else {
                this.removeRowKeyFromSelectedItems(key);
            }

            if (!this.options.isPickList) {
                this.updateSelection();
            } else {
                this.updateControl({ refreshDimensions: true });
            }
        }

        onRowDblClick(row) {
            const selectedClass = this.options.selectedRowClass;
            const $row = $(row);
            let $defaultActionBtn = this.options.$container.find(".list-default-action:not(.not-accessible)");

            this.clearSelectedItems();

            $row.addClass(selectedClass);

            this.status.selectedItemKeys.push($row.data("key"));

            if ($defaultActionBtn.length === 0) this.updateActionButtonVisibility();

            if (!this.options.isPickList) {
                this.updateSelection();
            } else {
                this.updateControl({ refreshDimensions: true });
            }

            //This is needed when multiple default buttons are selected and handled by conditional formattings
            $defaultActionBtn = this.options.$container.find(".list-default-action:not(.not-accessible)");

            if ($defaultActionBtn.length > 0) {
                //_popUpManager.showLoadingPopUp(0);
            }
            $defaultActionBtn.click();
        }

        clearSelectedItems() {
            const selectedClass = this.options.selectedRowClass;
            this.status.selectedItemKeys = [];
            this.status.allRecordsSelected = false;
            this.$listData.find(`.${selectedClass}`).removeClass(selectedClass);
        }

        addRowKeyToSelectedItems(key) {
            this.status.selectedItemKeys.push(key);
        }

        removeRowKeyFromSelectedItems(key) {
            let indexToSplice = -1;

            for (let i = 0; i < this.status.selectedItemKeys.length; i++) {
                if (this.status.selectedItemKeys[i] === key) {
                    indexToSplice = i;
                    break;
                }
            }

            if (indexToSplice > -1) {
                this.status.selectedItemKeys.splice(indexToSplice, 1);
            }
        }

        updateActionButtonVisibility() {
            if (this.status.selectedItemKeys != null && this.status.selectedItemKeys.length === 0 && this.status.allRecordsSelected === false) {
                this.options.$container.find(".show-single").addClass("hidden");
                this.options.$container.find(".show-multi").addClass("hidden");
            }
            else if (this.status.selectedItemKeys != null && this.status.selectedItemKeys.length === 1) {
                this.options.$container.find(".show-single").removeClass("hidden");
                this.options.$container.find(".show-multi").removeClass("hidden");
            }
            else {
                this.options.$container.find(".show-single").addClass("hidden");
                this.options.$container.find(".show-multi").removeClass("hidden");
            }

            // Hide From Context Menu
            var disabledFromCf = this.options.$container.find(".not-accessible");

            for (var i = 0; i < disabledFromCf.length; i++) {
                this.$rowContextMenu.find(`[data-target='${disabledFromCf.eq(i).attr("jb-id")}']`).addClass("hidden");
                this.options.$container.find(".list-action-buttons-container")
                    .find(`[data-target='${disabledFromCf.eq(i).attr("jb-id")}']`)
                    .addClass("hidden");
            }

            var actionButtonsAvailable = this.options.$container
                .find(".mobile-dropdown-menu .show-always:not(.hidden):not(.not-accessible), .mobile-dropdown-menu .show-single:not(.hidden):not(.not-accessible), .mobile-dropdown-menu .show-multi:not(.hidden):not(.not-accessible)")
                .length >
                0;
            var preferencesButtonsAvailable = false;

            this.options.$container.find(".mobile-dropdown-menu a:not([class*=show-])")
                .each(function() {
                    if ($(this).css("display") != "none") preferencesButtonsAvailable = true;
                });
            //Handle divider visibility
            this.options.$container.find(".header-toolbar-container.mobile .actions-divider")
                .toggle(actionButtonsAvailable && preferencesButtonsAvailable);
            //Handle dropdown menu visibility
            this.options.$container.find(".header-toolbar-container.mobile .mobile-menu")
                .toggle(actionButtonsAvailable || preferencesButtonsAvailable);
            //Handle top pager border
            var noBorder = this.options.pagerPosition === "TOP" &&
                this.options.hasPreferences === false &&
                this.options.isGroupable === false &&
                this.options.isSearchable === false &&
                ((this.$listHeader.find(".mobile-menu:visible").length === 0 && this.isMobileMode) ||
                (!this.isMobileMode &&
                    this.$listHeader
                    .find(".header-toolbar-container:not(.mobile) .btn-list-reset:visible")
                    .length ===
                    0));
            this.$listPager.toggleClass("no-border", noBorder);
        }

        updateSelection(cb?) {
            this.saveStateToLocalStorage();

            var scope = Common.getScope();
            var indexes = this.getControlIndexes();
            var $controlInstace = this.options.isPickList ? this.$ownerButton : this.options.$container;
            var someKeysAreExcluded = this.options.isPickList && this.options.excludeSelected;
            var self = this;
            var merge = someKeysAreExcluded === true && self.options.hasMultiselection !== false;
            var updateUsingKeys = false;

            if (!this.status.allRecordsSelected) {
                // Get selected instances from selected keys
                var selectedInstances = [];
                for (var i = 0; i < this.status.selectedItemKeys.length; i++) {
                    var currentKey = this.status.selectedItemKeys[i];
                    var item = this.getItemFromCollectionByKey(currentKey);

                    if (item == null &&
                            someKeysAreExcluded === true &&
                            this.initiallySelectedKeys.indexOf(currentKey) > -1
                    ) {
                        continue;
                    } else if (item == null) {
                        updateUsingKeys = true; // item is not present in our collection at the moment...
                        break;
                    } else {
                        selectedInstances.push(item);
                    }
                }
            }

            var directiveScope = Common.getDirectiveScope($controlInstace);

            if (this.status.allRecordsSelected === true) {
                directiveScope.fullRecordsetIsSelected = this.status.allRecordsSelected === true;
                directiveScope.requestSelectedItemsfromServer = true;
            } else if (updateUsingKeys === true) {
                directiveScope.fullRecordsetIsSelected = false;
                directiveScope.requestSelectedItemsfromServer = true;
            } else {
                directiveScope.fullRecordsetIsSelected = false;
                directiveScope.requestSelectedItemsfromServer = false;
            }
            
            if (this.options.isPickList === true || directiveScope.requestSelectedItemsfromServer === true) {
                // we need to call server and update inside callback
                DatasourceManager.requestSelectedItemsfromServer(
                    this.elementId,
                    $controlInstace,
                    directiveScope.itemDataType,
                    directiveScope.fullRecordsetIsSelected,
                    this.status.selectedItemKeys,
                    someKeysAreExcluded ? this.initiallySelectedKeys : [],
                    null,
                    selectedItemsData => {
                        this.onSelectedItemsDataReceived(directiveScope, selectedItemsData, merge, cb);
                    });
            } else {
                // directly update
                this.onSelectedItemsDataReceived(directiveScope, selectedInstances, merge, cb);
            }

            this.updateControl({ refreshDimensions: this.options.isPickList !== true });
        }

        onSelectedItemsDataReceived(directiveScope, selectedItemsData, merge, cb) {
            this.updateSelectionInDirective(directiveScope, selectedItemsData, merge);
            this.updateSelectedKeysInModel(directiveScope.selectedItemKeys);

            if (cb) cb(selectedItemsData);

            this.triggerOnChangeMethod();
        }

        updateSelectionInDirective(directiveScope, selectedItemsData, merge) {            
            // Ensure we deal with array when multiselection is enabled!
            if (this.options.hasMultiselection !== false && selectedItemsData != null && Array.isArray(selectedItemsData) === false) {
                selectedItemsData = [selectedItemsData];
            }

            // If Exclude Selected is true and picklist is bound to collection,
            // add to the collection (that's how it worked on previous versions)
            if (merge === true) {
                for (var i = 0; i < selectedItemsData.length; i++) {
                    directiveScope.selectedItems.push(selectedItemsData[i]);
                }
            }            
            else {
                directiveScope.selectedItems = selectedItemsData;
            }

            directiveScope.selectedItemKeys = DatasourceManager.getKeys(directiveScope.selectedItems);
        }

        updateSelectedKeysInModel(keys) {
            var controlName = this.options.isPickList !== true
                ? this.elementId
                : this.elementId.substring(0, this.elementId.length - "_PickList".length);

            DatasourceManager.updateSelectedKeysInModel(controlName,
                keys,
                this.status.allRecordsSelected,
                this.getControlIndexes().indexes); // TODO: there is a 5th parameter for master page...
        }

        triggerOnChangeMethod() {                        
            var $controlInstace = this.options.isPickList === true
                ? this.$ownerButton
                : this.options.$container;

            var partialControlName = Core.getPartialViewControlOriginalName($controlInstace);
            var controlName = partialControlName || this.elementId;
                        
            if (this.options.isPickList === true) {                                
                controlName = controlName.substring(0, controlName.length - "_PickList".length);
            }

            var $parentRow = Common.getContextItemElement($controlInstace);

            var $el = $parentRow.length == 0
                ? $("[jb-id='" + controlName + "']").eq(0)
                : $parentRow.find("[jb-id='" + controlName + "']").eq(0);

            DatasourceManager.invokeOnChangeHandler($el);            
        }

        getControlIndexes() {
            if (this.options.isPickList === true) {
                return Common.getIndexesOfControl(this.$ownerButton);
            } else {
                return Common.getIndexesOfControl(this.options.$container);
            }
        }

        getItemFromCollectionByKey(key) {
            for (var i = 0; i < this.data.length; i++) {
                if (this.data[i]._key == key) {
                    return this.data[i];
                }
            }
        }

        changePage(page) {
            var $pageInput = this.$listPager.find(".list-current-page:visible");
            var pageToGo = $pageInput.val();

            var startRow = null;

            if (page == "+") {
                pageToGo++;
            } else if (page == "-") {
                pageToGo--;
            }

            if (pageToGo == this.status.currentPage) return;

            startRow = (pageToGo * this.status.pageSize) - this.status.pageSize;

            if (startRow < 0 || (startRow > this.status.totalRows && this.status.groupBy.length == 0)) {
                $pageInput.val(String(this.status.currentPage));
                return;
            }

            $pageInput.val(pageToGo);

            this.status.startRow = startRow;

            var $verticalScroll = this.$listVerticalScrollbar.find(".scrollbar-content-wrapper");
            if ($verticalScroll != null) $verticalScroll.scrollTop(0);

            this.updateData({
                refreshHeader: false,
                keepAggregatorsOfFullRecordSet: true
            });
        }

        changePageSize(newSize) {
            this.status.pageSize = parseInt(newSize);
            this.status.startRow = 0;
            this.updateData({
                refreshHeader: false,
                keepAggregatorsOfFullRecordSet: true
            });
        }

        applyGlobalFilter() {
            const $searchInput = this.$listHeader.find(".header-toolbar-container:visible .global-search-input");
            const $clearGlobalFilter = this.$listHeader.find(".header-toolbar-container:visible .global-search-clear");

            const searchTerm = $searchInput.val();

            if (searchTerm.trim().length === 0) {
                this.clearGlobalSearch();
                return;
            }

            $clearGlobalFilter.show();

            const predefinedFiltersApplied = this.listHasPredefinedFilterApplied();

            this.status.filters = [];
            this.status.startRow = 0;
            const searchTermType = Common.guessStringMambaDataType(searchTerm);
            let operator: FilterOperators;

            for (let i = 0; i < this.status.columns.length; i++) {
                const currentColumn = this.status.columns[i];
                
                if (currentColumn.searchable === false ||
                    this.columnHasPredefinedFilterApplied(currentColumn.name)) {
                    continue;
                }

                // Skip non compatible columns.
                switch (searchTermType) {
                    case MambaDataType.BOOL:
                        if (!(Common.getMambaDataType(currentColumn.mambaDataType) === MambaDataType.BOOL ||
                            Common.getMambaDataType(currentColumn.mambaDataType) === MambaDataType.STRING))
                            continue;
                        break;
                    case MambaDataType.NUMBER:
                        if (!(Common.getMambaDataType(currentColumn.mambaDataType) === MambaDataType.NUMBER ||
                            Common.getMambaDataType(currentColumn.mambaDataType) === MambaDataType.STRING))
                            continue;
                        break;
                    case MambaDataType.STRING:
                        if (Common.getMambaDataType(currentColumn.mambaDataType) !== MambaDataType.STRING)
                            continue;
                        break;
                }

                // Select filter operation according column data type.
                if (Common.getMambaDataType(currentColumn.mambaDataType) === MambaDataType.STRING) {
                    operator = FilterOperators.LIKE;
                } else {
                    operator = FilterOperators.EQUAL_TO;
                }

                this.status.filters.push(new Widgets.ListFilter(currentColumn,
                    operator,
                    searchTerm,
                    RowOperators.OR,
                    "GLOBAL"));
            }

            if (predefinedFiltersApplied) {
                const lastFilter = this.status.filters[this.status.filters.length - 1];

                // Last Generated Filter must have row operator 'AND', so that predefined filters are honored
                if (lastFilter != null) lastFilter.rowOperator = RowOperators.AND;

                // Include Predefined Filters to Search, but don't refresh yet
                this.applyPredefinedFilters(true);
            }

            this.focusOnElement = ".header-toolbar-container:visible .global-search-input";
            this.updateData();
        }

        applyQuickFilters() {
            // Clear previous QuickFilters from status
            this.clearQuickFilters();

            // Include Predefined Filters to Search, but don't refresh yet
            this.applyPredefinedFilters(true);

            const quickFilterInputs = this.$listColumnHeader.find(".quick-filter, .clmscombobox-value-container");

            for (let i = 0; i < quickFilterInputs.length; i++) {
                const $input = quickFilterInputs.eq(i);
                const $wrapper = $input.closest(".quick-filter-wrapper");
                const isDropDown = $wrapper.hasClass("has-custom-drop-down");

                $input.removeClass("quick-filter-applied");

                const column = $input.closest("th").data("column");
                const columnInfo = this.getColumnInfoByName(column);

                let term = $input.val().trim();

                if (isDropDown) term = $wrapper.find(".clmscombobox.form-control").combobox("getValue");

                if (typeof (term) == "undefined" || term === null || term.length === 0) continue;

                let terms = [];

                // remove filter from column
                this.removeFilterFromColumn(column, true);

                if (columnInfo.dataType === "DateTime") {
                    terms = [
                        Common.getUtcDateFromRawString(term, this.getFormatOfDate(columnInfo.formatting, true))
                    ];
                } else if ($input.hasClass("default-input") && isDropDown === false) {
                    terms = $input.val().split(" ");
                } else {
                    terms = [term];
                }

                $input.closest(".column-quick-filter").find(".remove-quick-filter").removeClass("hidden");
                $input.siblings(".apply-quick-filter").show();

                $input.addClass("quick-filter-applied");

                for (let j = 0; j < terms.length; j++) {
                    const operator = isDropDown ? FilterOperators.EQUAL_TO : FilterOperators.LIKE;
                    this.status.filters.push(new Joove.Widgets
                        .ListFilter(columnInfo, operator, terms[j], RowOperators.AND, "QUICK"));
                }
            }

            this.updateData();
        }

        applyPredefinedFilters(doNotRefresh?) {
            if (doNotRefresh !== true) {
                // Clear Filters, but don't send request yet
                this.clearGlobalSearch(true);
                this.clearAllQuickFilters(true);
                this.updateData({
                    keepAggregatorsOfFullRecordSet: false,
                    showControl: true
                });
                return; //Remove this if clearGlobalSearch() will not call applyPredefinedFilters
            }

            var predefinedFilterInputs = $(`[data-filter-for-list='${this.elementId}']:not(.quick-filter)`);
            var seenColumns = [];

            for (var i = 0; i < predefinedFilterInputs.length; i++) {
                var $input = predefinedFilterInputs.eq(i);
                var isDropDown = $input.attr("jb-type") === "DropDown";
                var isRequired = $input.parent().hasClass("WebForms-Required");
                var column: string = $input.data("filter-for-column");
                var term = $input.val().trim();

                if (typeof (term) == "undefined" || term === null || term.length == 0) {
                    if (isRequired === false) continue;

                    for (let i = 0; i < this.status.filters.length; i++) {
                        if (this.status.filters[i].type !== "PREDEFINED") continue;
                        this.status.filters.splice(i, 1);
                    }
                    window._popUpManager.warning(this.resources.RequiredFiltersMissingTitle,
                        "Warning",
                        this.resources.RequiredFiltersMissingMessage);
//                    showRequired(); TODO Show required
                    return;
                }

                if (seenColumns.indexOf(column) > -1) continue; // normally when encountering 2nd DateTime Field

                seenColumns.push(column);

                // remove filter from column
                this.removeFilterFromColumn(column);

                if ($input.hasClass("date-filter-from") || $input.hasClass("date-filter-to")) {
                    var firstDate = $(`.date-filter-from[data-filter-for-column='${column}'][data-filter-for-list='${
                            this.elementId}']`)
                        .val()
                        .trim();
                    var secondDate = $(`.date-filter-to[data-filter-for-column='${column}'][data-filter-for-list='${
                            this.elementId}']`)
                        .val()
                        .trim();

                    // http://msdn.microsoft.com/en-us/library/ms187819.aspx
                    if (firstDate.length === 0) firstDate = "01/01/1753";
                    if (secondDate.length === 0) secondDate = "31/12/9999";

                    this.status.filters.push(new Joove.Widgets.ListFilter(this.getColumnInfoByName(column),
                        FilterOperators.RANGE,
                        firstDate + "|" + secondDate,
                        RowOperators.AND,
                        "PREDEFINED"));
                } else {
                    var operator = isDropDown ? FilterOperators.EQUAL_TO : FilterOperators.LIKE;
                    this.status.filters.push(new Joove.Widgets
                        .ListFilter(this.getColumnInfoByName(column), operator, term, RowOperators.AND, "PREDEFINED"));
                }
            }

            // todo: collapse control
            //collapseControl($predefinedFiltersFieldSet);

            if (doNotRefresh === true) return;

            this.updateData({
                keepAggregatorsOfFullRecordSet: false,
                showControl: true
            });
        }

        clearQuickFilter(btn, doNotRefresh?) {
            var $btn = $(btn);

            var $wrapper = $btn.closest(".quick-filter-wrapper");

            $wrapper.find("input.quick-filter").val("");
            $wrapper.find("select.bool-quick-filter").val("");
            $btn.siblings(".apply-quick-filter").hide();

            if ($wrapper.hasClass("has-custom-drop-down")) {
                var $customDropDown = $wrapper.find(".clmscombobox.form-control");

                $customDropDown.combobox("clear");
            }

            $btn.addClass("hidden");

            if (doNotRefresh) return;

            this.applyQuickFilters();
        }

        clearAllQuickFilters(doNotRefresh) {
            var allRemoveButtons = $(".remove-quick-filter");

            for (var i = 0; i < allRemoveButtons.length; i++) {
                this.clearQuickFilter(allRemoveButtons[i], true);
            }

            if (doNotRefresh === true) return;

            this.applyQuickFilters();
        }

        clearGlobalSearch(doNotRefresh?) {
            if (this.$listColumnHeader != null) {
                const $searchInput = this.$listColumnHeader.find(".global-search-input");
                const $clearGlobalFilter = this.$listColumnHeader.find(".global-search-clear");

                $searchInput.val("");
                $clearGlobalFilter.hide();
            }

            this.status.filters = [];
            this.status.startRow = 0;

            // Include Predefined Filters
            this.applyPredefinedFilters(true);

            if (doNotRefresh === true) return;

            this.updateData();
        }

        clearQuickFilters() {

            var nonQuickFilterFilters = this.status.filters.filter(fltr => (fltr.type !== "QUICK"));

            this.status.filters = nonQuickFilterFilters;
        }

        clearClosedGroupItemsFilters(doNotRefresh) {
            // reverse loop is needed here because elements are removed and length changes
            for (var i = this.status.filters.length - 1; i >= 0; i--) {
                if (this.status.filters[i].type != "FROM_CLOSED_GROUPS") continue;

                this.status.filters.splice(i, 1);
            }

            if (doNotRefresh === true) return;

            this.updateData({ refreshHeader: false });
        }

        listDisplaysClosedGroupItems() {
            for (var i = this.status.filters.length - 1; i >= 0; i--) {
                if (this.status.filters[i].type == "FROM_CLOSED_GROUPS") return true;
            }

            return false;
        }

        clearAllAggregators(doNotRefresh?) {
            this.status.aggregators = [];
            this.aggregatorsData = [];

            if (doNotRefresh === true) return;

            this.updateAggregatorsData();
        }

        clearAllFilters(doNotRefresh?) {
            this.clearAllQuickFilters(true);
            this.clearGlobalSearch(true);
            this.clearPredefinedFilters(true);
            this.status.currentPage = 1;
            this.status.startRow = 0;

            if (this.options.waitForPredefinedFilters !== false) {
                this.hideControl();
                return;
            }

            if (doNotRefresh === true) return;

            this.updateData();
        }

        clearPredefinedFilters(doNotRefresh) {
            const $textBoxes = $(`[jb-type='TextBox'][data-filter-for-list='${this.elementId}']:not(.quick-filter)`);
            const $dateTimeBoxes = $(`.WebForms-DateTimeBox[data-filter-for-list='${this.elementId
                }']:not(.quick-filter)`);
            const $dropDowns = $(`[jb-type='DropDownBox'][data-filter-for-list='${this.elementId
                }']:not(.quick-filter)`);

            $textBoxes.val("");
            $dateTimeBoxes.val("");

            for (let i = 0; i < $dropDowns.length; i++) {
                const $current = $dropDowns.eq(i);
                const pleaseSelectText = $current.find("input").eq(0).attr("pleaseselecttext");

                $current.find(".clmscombobox.form-control").combobox("clear");
            }

            //expandControl($predefinedFiltersFieldSet);

            if (doNotRefresh === true) return;

            this.updateData();
        }

        removeFilterFromColumn(column, keepPredefined?) {
            // reverse loop is needed here because elements are removed and length changes
            for (let i = this.status.filters.length - 1; i >= 0; i--) {
                if (this.status.filters[i].column !== column) continue;
                if (this.status.filters[i].type === "PREDEFINED" && keepPredefined === true) continue;

                this.status.filters.splice(i, 1);
            }
        }

        columnHasPredefinedFilterApplied(column) {
            for (let i = 0; i < this.status.filters.length; i++) {
                if (this.status.filters[i].type === "PREDEFINED" &&
                    this.status.filters[i].column === column) return true;
            }
            return false;
        }

        listHasPredefinedFilterApplied() {
            for (let i = 0; i < this.status.filters.length; i++) {
                if (this.status.filters[i].type === "PREDEFINED") return true;
            }
            return false;
        }

        getGlobalFilterValue() {
            for (let i = 0; i < this.status.filters.length; i++) {
                if (this.status.filters[i].type === "GLOBAL") return this.status.filters[i].value;
            }
            return null;
        }

        toggleQuickFiltersRow(btn) {
            const $btn = $(btn);
            const $quickFiltersContainer = this.$listColumnHeader.find(".quick-filters-container");

            if ($btn.hasClass("expanded")) {
                $btn.addClass("collapsed").removeClass("expanded");
                $btn.find(".toggle-quick-filters-caption").text(this.resources.ShowQuickFilters);
                $quickFiltersContainer.fadeOut((() => {
                    this.updateControl({ refreshDimensions: true });
                }) as any);
            } else {
                $btn.addClass("expanded").removeClass("collapsed");
                $btn.find(".toggle-quick-filters-caption").text(this.resources.HideQuickFilters);
                $quickFiltersContainer.fadeIn((() => {
                    this.updateControl({ refreshDimensions: true });
                }) as any).css('display', 'table-row');
            }
        };

        showQuickFiltersRow() {
            const $btn = this.$listHeader.find(".toggle-quick-filters");
            const $quickFiltersContainer = this.$listColumnHeader.find(".quick-filters-container");
            $btn.addClass("expanded").removeClass("collapsed");
            $btn.find(".toggle-quick-filters-caption").text(this.resources.HideQuickFilters);
            $quickFiltersContainer.css("display", "table-row"); 
            this.updateControl({ refreshDimensions: true });
        }

        hideQuickFiltersRow() {
            const $btn = this.$listHeader.find(".toggle-quick-filters");
            const $quickFiltersContainer = this.$listColumnHeader.find(".quick-filters-container");
            $btn.addClass("collapsed").removeClass("expanded");
            $btn.find(".toggle-quick-filters-caption").text(this.resources.ShowQuickFilters);
            $quickFiltersContainer.fadeOut((() => {
                this.updateControl({ refreshDimensions: true });
                return 100;
            }) as any);
        }

        resetList(bypassConfirm?) {
            if (bypassConfirm !== true)
                if (confirm(this.resources.ResetConfirmation) === false) return;

            this.clearAllFilters(true);

            this.status.currentPage = 0;
            this.status.selectedItemKeys = [];
            this.status.allRecordsSelected = false;
            this.status.startRow = 0;
            this.status.endRow = 0;
            this.status.pageSize = 25;
            this.status.totalRows = 0;
            this.status.totalPages = 0;
            this.status.filters = [];
            this.status.orderBy = [];
            this.status.groupBy = [];                        
            this.status.currentView = "PREDEFINED";

            for (let i = 0; i < this.status.columns.length; i++) {
                var current = this.status.columns[i];
                                
                current.width = 0;
                current.customWidth = 0;
                current.minWidth = 0;
                current.isVisible = typeof (this.options.hiddenColumns) == "undefined" ||
                    this.options.hiddenColumns.indexOf(current.name) === -1
            }



            if (this.options.predefinedGroups != null) {
                this.applyPredefinedGrouping();
            }

            this.updateData();
        }

        displayClosedGroupContents(groupInfo) {
            if (this.status.filters.length > 0) {
                this.status.filters[this.status.filters.length - 1].rowOperator = RowOperators.AND;
            }

            this.toggleAllGroupsActivation();

            for (let i = 0; i < groupInfo.filters.length; i++) {
                const column = this.getColumnInfoByName(groupInfo.filters[i].column);
                let value = groupInfo.filters[i].value;
                const dataType = column.dataType;
                const operator = value == null || value === ListControlAsset.NullString || value === "null" ? FilterOperators.HAS_NO_VALUE : FilterOperators.EQUAL_TO;

                // force number format
                if (this.isDataTypeNumeric(dataType))
                    value = this.forceNumberFormat(value);

                this.status.filters.push(new Widgets.ListFilter(column,
                    operator,
                    value,
                    RowOperators.AND,
                    "FROM_CLOSED_GROUPS"));

                this.toggleGroupActivation(column, true, true);
            }

            this.status.startRow = 0;
            this.status.getGroupsClosed = false;
            this.expandAllGroups(this.status.groupBy);
           

            this.updateData();
        }

        changeStateOnAllGroups(groups: ListGroupByInfo[], state: string, value: boolean) {
            for (let i = 0; i < groups.length; i++) {
                const current = groups[i];
                current.state = state;
                current.getGroupsClosed = value;
            }
        }

        expandAllGroups(groups: ListGroupByInfo[]) {
            this.changeStateOnAllGroups(groups, "EXPANDED", false);
        }

        collapseAllGroups(groups: ListGroupByInfo[]) {
            this.changeStateOnAllGroups(groups, "COLLAPSED", true);
        }

        toggleAllGroupsActivation(activate?: boolean) {
            for (let i = 0; i < this.status.groupBy.length; i++) {
                this.status.groupBy[i].inactive = !this.status.groupBy[i].inactive;
            }
        }

        toggleGroupActivation(column: ListControlColumn, activate: boolean, expand: boolean) {
            for (let i = 0; i < this.status.groupBy.length; i++) {
                const current = this.status.groupBy[i];
                if (current.column.name === column.name) current.inactive = !current.inactive;

                if (expand) current.initialState = "EXPANDED";
            }
        }

        forceNumberFormat(raw: string): string {
            let value = raw;

            // todo: decimal seperator

            //if (window.__decimalSeperator === ",") {
            //  value = value.replace(".", ",");
            //}
            //else if (window.__decimalSeperator === ".") {
            value = value.replace(",", ".");
            //}

            return value;
        }
        
        toggleGrids(targetCls) {
            if (this.options.standAlone !== false) {
                this.toggleStandAloneGrids(targetCls);
            } else {
                this.toggleControlModeGrids(targetCls);
            }
        }

        toggleControlModeGrids(targetCls) {
            var $gridsContainer = this.$list.find(".list-preferences-fieldsets-container");
            const $target = this.$list.find(`.list-preferences-fieldsets-container .${targetCls}`);
            const self = this;

            if ($target.is(":visible")) {
                $target.fadeOut((function() {
                    $gridsContainer.toggle($gridsContainer.find(".collapsible-grid:visible").length > 0);
                    self.updateControl({ refreshDimensions: true });
                }) as any);
            } else {
                $gridsContainer.find(".collapsible-grid").hide();
                $gridsContainer.show();
                $target.fadeIn();
                self.updateControl({ refreshDimensions: true });
            }
        }

        toggleStandAloneGrids(targetCls) {
            const $target = this.options.$container.find(`.${targetCls}`);
            const self = this;

            if ($target.hasClass("shown")) {
                //$target.fadeOut();
                $target.hide();
                $target.removeClass("shown");
                self.updateControl({ "refreshDimensions": true });
            } else {
                //$target.fadeIn();
                $target.show();
                $target.addClass("shown");
                if ($target.parent().hasClass("list-docked-grids")) {
                    this.restrictOneDockedGrid(targetCls);
                }

                self.updateControl({ "refreshDimensions": true });
            }
        }

        handleGridButtonState() {
            if (this.$listHeader != null) {
                this.$listHeader.find(".header-toolbar-container:not(.mobile) button.btn-list-preferences")
                    .toggleClass("active", this.$preferencesContainer.find(".preferences-grid").hasClass("shown"))
                    .blur();
                this.$listHeader.find(".header-toolbar-container:not(.mobile) button.btn-list-filters")
                    .toggleClass("active", this.$filtersContainer.find(".filters-grid").hasClass("shown"))
                    .blur();
                this.$listHeader.find(".header-toolbar-container:not(.mobile) button.btn-list-groups")
                    .toggleClass("active", this.$groupsContainer.find(".groups-grid").hasClass("shown"))
                    .blur();
            }
        }
        
        getExportDisplayColumns() {
            return `<div  id='exportDisplayColumns' class= "hideColumnsPopUp" jb-id='exportDisplayColumns' > \
                    <table class='table-headers-export-visible-columns'> \
                        <thead>\
                            <tr>\
                                <th style='width:181px; padding-left: 8px; '>\
                                    <span class='export-pop-up-subtitle'>${this.resources.ColumnExport}</span>\
                                </th>\
                                <th style='width:68px; text-align: center;'>\
                                    <span class='export-pop-up-subtitle'>${this.resources.VisibleExport}</span>\
                                </th>\
                                <th style='width:68px; text-align: center;'>\
                                    <span class='export-pop-up-subtitle'>${this.resources.SumHeader}</span>\
                                </th>\
                                <th style='width:68px; text-align: center;'>\
                                    <span class='export-pop-up-subtitle'>${this.resources.AverageHeader}</span>\
                                </th>\
                                <th style='width:67px; text-align: center;'>\
                                    <span class='export-pop-up-subtitle'>${this.resources.CountHeader}</span>\
                                </th>\
                                <th style='width:18px; text-align: center;'>\
                                </th>\
                            </tr>\
                            <tr>\
                                <th style='vertical-align: top; '>\
                                </th>\
                                <th style='vertical-align: top; text-align: center;'>\
                                    <input class='checkall-header-isvisible' type='checkbox' data-state='unchecked'/>\
                                </th>\
                                <th style='vertical-align: top; text-align: center;'>\
                                    <input class='checkall-header-issum' type='checkbox' data-state='unchecked'/>\
                                </th>\
                                <th style='vertical-align: top; text-align: center;'>\
                                    <input class='checkall-header-isaverage' type='checkbox' data-state='unchecked'/>\
                                </th>\
                                <th style='vertical-align: top; text-align: center;'>\
                                    <input class='checkall-header-iscount' type='checkbox' data-state='unchecked'/>\
                                </th>\
                                <th style='vertical-align: top; text-align: center;'>\
                                </th>\
                            </tr>\
                        </thead>\
                    </table> \
                        <div class='export-table-display-columns'> \
                            <table class='preferences-table table table-hover' style='width:452px'> \
                            <tbody> \
                                ${this.populateExportPopUpTableDisplyContainer()} \
                            </tbody> \
                            </table> \
                        </div> \
                    </div>`;
        }

        populateExportPopUpTableDisplyContainer() {
            var str = "";
            for (var i = 0; i < this.status.columns.length; i++) {
                var column = this.status.columns[i];
                var checkedAttr = column.isVisible === true ? "checked='checked'" : "";

                var line = `<tr class='row-preference' data-column='${column.name}'>\
                            <td style='width:181px; text-align:left;'>\
                                <span>${column.caption}</span>\
                            </td>\
                            <td style='width:68px; text-align:center;'>\
                                <input type='checkbox' class='column-is-visible checkbox-position' ${checkedAttr}/>\
                            </td>\
                            <td style='width:68px; text-align:center;'>\
                                <input type='checkbox' class='sum-is-visible checkbox-position' ${
                    this.resources.SumHeader}/>\
                            </td>\
                            <td style='width:68px; text-align:center;'>\
                                <input type='checkbox' class='average-is-visible checkbox-position' ${
                    this.resources.AverageHeader}/>\
                            </td>\
                            <td style='width:67px; text-align:center;'>\
                                <input type='checkbox' class='count-is-visible checkbox-position' ${
                    this.resources.CountHeader}/>\
                            </td>\
                        </tr>`;

                str += line;
            }
            return str;
        }

        sortByColumn(columnHeader) {
            const $columnHeader = $(columnHeader);

            const column = $columnHeader.parent().data("column");

            let sortDirection: OrderByDirections;

            if (this.getColumnInfoByName(column).dataType !== "DateTime") {
                if ($columnHeader.data("sort-direction") === OrderByDirections.ASC) {
                    sortDirection = OrderByDirections.DESC;
                    $columnHeader.attr("title", this.resources.Unsort);
                } else if ($columnHeader.data("sort-direction") === OrderByDirections.DESC) {
                    sortDirection = OrderByDirections.NONE;
                    $columnHeader.attr("title", this.resources.SortASC);
                } else {
                    sortDirection = OrderByDirections.ASC;
                    $columnHeader.attr("title", this.resources.SortDESC);
                }
            } else {
                if ($columnHeader.data("sort-direction") === OrderByDirections.ASC) {
                    sortDirection = OrderByDirections.NONE;
                    $columnHeader.attr("title", this.resources.SortDESC);
                } else if ($columnHeader.data("sort-direction") === OrderByDirections.DESC) {
                    sortDirection = OrderByDirections.ASC;
                    $columnHeader.attr("title", this.resources.Unsort);
                } else {
                    sortDirection = OrderByDirections.DESC;
                    $columnHeader.attr("title", this.resources.SortASC);
                }
            }

            const classToAdd = sortDirection === OrderByDirections.DESC
                ? "glyphicon-arrow-down"
                : "glyphicon-arrow-up";

            // Remove sorting icon from all columns and add the correct one to this column
            this.$listColumnHeader.find(".sort-direction-icon")
                .removeClass("glyphicon-arrow-down")
                .removeClass("glyphicon-arrow-up");

            if (sortDirection !== OrderByDirections.NONE) {
                $columnHeader.siblings(".sort-direction-icon").addClass(classToAdd);
            }

            $columnHeader.data("sort-direction", sortDirection);

            this.status.startRow = 0;

            if (sortDirection !== OrderByDirections.NONE) {
                this.status.orderBy = [new Widgets.ListOrderByInfo(this.getColumnInfoByName(column), sortDirection, 1)];
            } else {
                this.status.orderBy = [];
            }

            this.updateData({ keepAggregatorsOfFullRecordSet: true });
        }

        moveColumn(btn) {
            var $btn = $(btn);

            var direction = $btn.hasClass("move-column-right") ? "RIGHT" : "LEFT";
            var columnName = $btn.closest("th").data("column");

            var column = this.getColumnInfoByName(columnName);

            var columnIndex = this.status.columns.indexOf(column);
            var newIndex = direction == "RIGHT" ? columnIndex + 1 : columnIndex - 1;

            this.hideListData();

            while (this.columnMustBeRendered(this.status.columns[newIndex]) === false) {
                newIndex = direction == "RIGHT" ? newIndex + 1 : newIndex - 1;
            }

            var columnName1 = columnName;
            var columnName2 = this.status.columns[newIndex].name;
            this.status.columns.splice(columnIndex, 1);
            this.status.columns.splice(newIndex, 0, column);

            this.updateControl({
                createListHeader: true,
                createListColumnHeader: true,
                createListData: true,
                createRecordSetAggregators: true,
                updateUiElements: true,
                refreshDimensions: true,
                skipVertivalScrollbar: true,
                keepAggregatorsOfFullRecordSet: true,
                applyConditionalFormattings: true,
            });

            this.showListData();

            var childIndexToFlashFirstColumn = this.$listColumnHeaderContainer.find(`th[data-column='${columnName1}']`)
                .index() +
                1;
            var childIndexToFlashSecondColumn = this.$listColumnHeaderContainer.find(`th[data-column='${columnName2}']`)
                .index() +
                1;

            var $cellsToFlashFirstColumn = this.$listData
                .find(`.list-data-cell:nth-child(${childIndexToFlashFirstColumn})`);
            var $headerToFlashFirstColumn = this.$listColumnHeader
                .find(`.column-title:nth-child(${childIndexToFlashFirstColumn})`);

            var $cellsToFlashSecondColumn = this.$listData
                .find(`.list-data-cell:nth-child(${childIndexToFlashSecondColumn})`);
            var $headerToFlashSecondColumn = this.$listColumnHeader
                .find(`.column-title:nth-child(${childIndexToFlashSecondColumn})`);

            this.showListData();

            // Add vertical seperator just for this effect
            var borderToShow = direction == "RIGHT" ? "border-left" : "border-right";

            $cellsToFlashFirstColumn.css(borderToShow, "1px solid white");

            $cellsToFlashFirstColumn.css("transition", "none");
            $cellsToFlashSecondColumn.css("transition", "none");

            this.flashElements($cellsToFlashFirstColumn);
            this.flashElement($headerToFlashFirstColumn);

            //this.flashElements($cellsToFlashSecondColumn);
            //this.flashElement($headerToFlashSecondColumn);

            // Remove seperator when effect finishes
            window.setTimeout(function() {
                    $cellsToFlashFirstColumn.css("transition", "all ease 0.25s");
                    //$cellsToFlashSecondColumn.css("transition", "all ease 0.25s");
                    $cellsToFlashFirstColumn.css(borderToShow, "none");
                },
                1500);
            if (this.$listHeader.find(".available-views:visible").length == 0 ||
                this.$listHeader.find(".available-views:first option").length == 1)
                this.$listHeader.find(".btn-list-reset").removeClass("hidden");
        }

        refreshDimensions(skipVerticalScrollbar?) {
            const self = this;
            //todo: log
            //if (SESSION_DEBUG.options.LIST_DEBUG === true) console.log("Refreshing dimensions...");

            if (this.$list == null) return;
//This is for the usecase where the option 'Wait for predefined options to apply before loading' is enabled. It goes through the updateControl function and calls refreshDimensions by default

            //Remmove mobile view custom input widths
            if (this.$listHeader != null) {
                this.$listHeader
                    .find(".header-toolbar-container.mobile .header-left .global-search-container")
                    .width(0);
                this.$listHeader.find(".header-toolbar-container.mobile .header-right .available-views").width(0);
            }

            //Remove float from container and keep document scroll position
            var documentScroll = $(document).scrollTop();
            this.options.$container.css("float", "");

            if (this.options.standAlone !== false)
                this.$listVerticalScrollbar.css({ "position": "", "top": "", "left": "" });

            this.$listColumnHeader.find(".title").removeClass("too-small");

            var $containerElement = this.options.$container;
            if (this.options.$container.parents(".clms-pop-up-html-contents").length == 1) {
                $containerElement = this.options.$container.parents(".clms-pop-up-html-contents");
            }

            var containerDimensions = {
                height: parseInt($containerElement.outerHeight()),
                width: Math.floor($containerElement.get(0).getBoundingClientRect().width) -
                (parseInt($containerElement.css("padding-left")) +
                    parseInt($containerElement.css("padding-right")) +
                    parseInt($containerElement.css("border-right-width")) +
                    parseInt($containerElement.css("border-left-width")))
            }

            var totalWidth = this.options.showRowNumbers ? 45 : 0; //45px is the rownum width
            var totalHeight = 0;
            var footerHeight = this.$listFooterContainer != null ? this.$listFooterContainer.outerHeight() : 0;
            var dataContainerWidth = containerDimensions.width;
            var dataContainerHeight;
            var visibleColsNumber = 0;
            var FIXED_FOOTER = 80;
            var windowHeight = window.innerHeight;

            var containerMaxHeight = windowHeight - this.options.$container.offset().top - FIXED_FOOTER;
            var showHorizontalScrollbar;

            if (this.$listDockedGrids.children(".shown").length > 0) {
                //dataContainerWidth -= $listDockedGrids.children().eq(0).outerWidth(true);
                this.$listDockedGrids.width(this.$listDockedGrids.children().eq(0).outerWidth(true));
            } else {
                this.$listDockedGrids.width(0);
            }
            //Column header, row & data containers                
            dataContainerWidth -= this.scrollbarSize;
            this.$listColumnHeaderContainer.css("width", dataContainerWidth + "px");
            this.$listDataContainer.css("width", dataContainerWidth + "px");
            this.$listFooterContainer.css("width", dataContainerWidth + "px");
            this.$list.find(".bottom-pager-table").css("width", dataContainerWidth + this.scrollbarSize + "px");

            //todo: log
            /*if (SESSION_DEBUG.options.LIST_DEBUG === true) {
                var w = window,
                    d = document,
                    e = d.documentElement,
                    g = d.getElementsByTagName('body')[0];
                console.log(w.innerHeight + ", " + e.clientHeight + ", " + g.clientHeight);
            }*/

            var tempWidth = [];
            var regExpPatt = /(;|\s|^)+width\s*:\s*([0-9]*)px/i; //2nd group contains width in pixels

            //Synchronize width with column headers
            for (var i = 0; i < this.status.columns.length; i++) {
                var column = this.status.columns[i];
                if (this.columnMustBeRendered(column) === false) continue;

                var $titleContainer = this.$listColumnHeader.find(`.column-title[data-column='${column.name}']`)
                    .eq(0);
                var headerColumnIndex = $titleContainer.index();
                var columnCssWidth = column.style;
                var result = regExpPatt.exec(String(columnCssWidth));
                if (result == null) visibleColsNumber++;

                if (column.minWidth == null) column.minWidth = this.getDefaultColumnMinWidth();
                if (column.width == null)
                    column.width = result != null ? parseInt(result[2]) : this.getDefaultColumnWidth(column);

                tempWidth[headerColumnIndex] = column.customWidth != null
                    ? column.customWidth
                    : /*$listDockedGrids.children(".shown").length > 0 ? column.minWidth :*/ column.width;

                var $aggregatorsCells = this.$listFooterContainer.find(".list-aggregators-row .aggregator-cell")
                    .eq(headerColumnIndex);
                this.$listData.find(".group-aggregators-row")
                    .each(function() {
                        const $cell = $(this).find(".group-aggregators-cell").eq(Number(headerColumnIndex));
                        if (!$cell.hasClass("row-number")) $aggregatorsCells = $aggregatorsCells.add($cell);
                    });

                if ($aggregatorsCells.length > 0) {
                    var maxAggregatorWidth = 0;
                    var MARGIN = 25;
                    $aggregatorsCells.find(".aggregator-caption")
                        .each(function() {
                            var currentAggregatorWidth = $(this).outerWidth() + $(this).next().outerWidth() + MARGIN;
                            if (currentAggregatorWidth > maxAggregatorWidth
                            ) maxAggregatorWidth = currentAggregatorWidth;
                        });
                    if (maxAggregatorWidth > tempWidth[headerColumnIndex]) {
                        tempWidth[headerColumnIndex] = maxAggregatorWidth;
                    }
                }

                $titleContainer.css("width", tempWidth[headerColumnIndex] + "px");
                $titleContainer.find(".title")
                    .css("max-width", this.getColumnTitleWidth(tempWidth[headerColumnIndex]) + "px");
                this.$listData.find(".list-data-row, .group-aggregators-row")
                    .each(function() {
                        $(this)
                            .find(".group-aggregators-cell")
                            .eq(Number(headerColumnIndex))
                            .css("width", tempWidth[headerColumnIndex] + "px");
                        $(this)
                            .find(".list-data-cell")
                            .eq(Number(headerColumnIndex))
                            .css("width", tempWidth[headerColumnIndex] + "px");
                    });
                this.$listFooterContainer.find(".list-aggregators-row .aggregator-cell")
                    .eq(headerColumnIndex)
                    .css("width", tempWidth[headerColumnIndex] + "px");
                this.$listFooterContainer.find(".group-aggregators-row .group-aggregators-cell")
                    .eq(headerColumnIndex)
                    .css("width", tempWidth[headerColumnIndex] + "px");

                totalWidth += tempWidth[headerColumnIndex];
            }


            // Recalcute column width if no need to display horizontal scrollbar
            if (totalWidth < dataContainerWidth) {
                var fixedWidth = (dataContainerWidth - totalWidth) / visibleColsNumber;
                totalWidth = this.options.showRowNumbers ? 45 : 0; //45px is the rownum width

                for (var i = 0; i < self.status.columns.length; i++) {
                    var column = self.status.columns[i];
                    if (self.columnMustBeRendered(column) === false) continue;
                    var $titleContainer = this.$listColumnHeader.find(`.column-title[data-column='${column.name}']`)
                        .eq(0);
                    var headerColumnIndex = $titleContainer.index();
                    var columnCssWidth = column.style;
                    var result = regExpPatt.exec(columnCssWidth);

                    if (result == null) tempWidth[headerColumnIndex] += fixedWidth;

                    $titleContainer.css("width", tempWidth[headerColumnIndex] + "px");
                    $titleContainer.find(".title")
                        .css("max-width", this.getColumnTitleWidth(tempWidth[headerColumnIndex]) + "px");
                    this.$listData
                        .find(`.list-data-row .list-data-cell:nth-child(${visibleColsNumber}${
                            this.options
                            .showRowNumbers
                            ? 1
                            : 0}n + ${headerColumnIndex + (this.options.showRowNumbers ? 1 : 0)}):not(.row-number)`)
                        .css("width", tempWidth[headerColumnIndex] + "px");
                    this.$listData.find(".group-aggregators-row .group-aggregators-cell")
                        .eq(headerColumnIndex)
                        .css("width", tempWidth[headerColumnIndex] + "px");
                    this.$listFooterContainer.find(".list-aggregators-row .aggregator-cell")
                        .eq(headerColumnIndex)
                        .css("width", tempWidth[headerColumnIndex] + "px");
                    this.$listFooterContainer.find(".group-aggregators-row .group-aggregators-cell")
                        .eq(headerColumnIndex)
                        .css("width", tempWidth[headerColumnIndex] + "px");
                    totalWidth += tempWidth[headerColumnIndex];
                }
            }

            //Calculate total height
            var $dataRows = this.$listData.find("tr");

            for (var i = 0; i < $dataRows.length; i++) {
                if ($dataRows.eq(i).is(":visible")) {
                    totalHeight += $dataRows.eq(i).outerHeight();
                }
            }

            //totalHeight += $listData.find("tr:visible").length * $listData.find("tr td:first").outerHeight();

            //Inner content actual width
            this.$listColumnHeader.css("width", totalWidth + "px");
            this.$listData.css("width", totalWidth + "px");
            this.$listFooter.css("width", totalWidth + "px");


            if (this.options.standAlone !== false)
                this.$listVerticalScrollbar.css({
                    "position": "absolute",
                    "top": this.$listVerticalScrollbar.position().top + "px",
                    "left": this.$listVerticalScrollbar.position().left + "px"
                });

            showHorizontalScrollbar = parseInt(String(dataContainerWidth)) < parseInt(String(totalWidth));
            //Handle max-height
            if (self.options.standAlone !== false || self.options.$container.parents(".modal-dialog").length === 1) {
                var MARGIN = 15;

                var availableHeight = (self.options.$container.parents(".modal-dialog").length === 1
                        ? self.options.$container.parents(".modal-body").height()
                        : containerMaxHeight) -
                    this.$listHeader.outerHeight(true) -
                    this.$listColumnHeaderContainer.outerHeight(true) -
                    footerHeight -
                    (showHorizontalScrollbar ? this.scrollbarSize : 0) -
                    (this.$list.find(".bottom-pager-table").outerHeight() == null
                        ? 0
                        : $(".bottom-pager-table").outerHeight(true)) -
                    MARGIN;

                var minHeight = parseInt(this.$listDataContainer.css("min-height"));

                if (availableHeight < minHeight) availableHeight = minHeight;

                dataContainerHeight = availableHeight; //totalHeight < availableHeight ? totalHeight : availableHeight;
            } else {
                dataContainerHeight = totalHeight < parseInt(this.$listDataContainer.css("max-height"))
                    ? totalHeight
                    : parseInt(this.$listDataContainer.css("max-height"));
            }

            var standaloneRemainingHeight = dataContainerHeight - totalHeight - 1;
            standaloneRemainingHeight = standaloneRemainingHeight <= 0 ? 0 : standaloneRemainingHeight;

            //Standalone num row border
            if (self.options.standAlone !== false) {
                this.$listDataContainer.find(".row-num-border")
                    .toggle(self.options.showRowNumbers)
                    .css({
                        "height": standaloneRemainingHeight + "px", //1px is the top border width of .row-num-border
                        "margin-top": (standaloneRemainingHeight > 0 &&
                                this.$listData.find(".no-results-row").length == 1
                                ? totalHeight
                                : 0) +
                            "px"
                    });
            }

            //Resize handler
            this.$listColumnHeader.find(".row-resize-handler")
                .css("height", (this.$listColumnHeaderContainer.outerHeight() + dataContainerHeight) + "px");

            //Data container
            this.$listDataContainer.css({ "height": dataContainerHeight + "px" });

            //Dockable area
            var dockableAreaHeight = containerMaxHeight - this.$listHeader.outerHeight(true) - footerHeight;

            this.$listDockedGrids.css("height", dockableAreaHeight + "px");

            //Handle dockable grid max heights
            var collapsibleGridMainContainerMaxHeight = 0;
            if (this.$listDockedGrids.find(".preferences-grid.shown").length == 1) {
                collapsibleGridMainContainerMaxHeight += this.$listDockedGrids
                    .find(".preferences-grid.shown .grids-header")
                    .outerHeight();
                if (!this.isPreferencesMinimized) {
                    collapsibleGridMainContainerMaxHeight +=
                        this.$listDockedGrids.find(".preferences-grid.shown .collapsile-grid-footer").outerHeight();
                }
            }
            if (this.$listDockedGrids.find(".filters-grid.shown").length == 1) {
                collapsibleGridMainContainerMaxHeight += this.$listDockedGrids.find(".filters-grid.shown .grids-header")
                    .outerHeight();
                if (!this.isFiltersMinimized) {
                    collapsibleGridMainContainerMaxHeight +=
                        this.$listDockedGrids.find(".filters-grid.shown .collapsile-grid-footer").outerHeight();
                }
            }
            if (this.$listDockedGrids.find(".groups-grid.shown").length == 1) {
                collapsibleGridMainContainerMaxHeight += this.$listDockedGrids.find(".groups-grid.shown .grids-header")
                    .outerHeight();
                if (!this.isGroupsMinimized) {
                    collapsibleGridMainContainerMaxHeight +=
                        this.$listDockedGrids.find(".groups-grid.shown .collapsile-grid-footer").outerHeight();
                }
            }

            //Calculate visible margins
            collapsibleGridMainContainerMaxHeight += this.$listDockedGrids.find(".preferences-grid:visible")
                .outerHeight(true) -
                this.$listDockedGrids.find(".preferences-grid:visible").outerHeight();
            collapsibleGridMainContainerMaxHeight += this.$listDockedGrids.find(".filters-grid:visible")
                .outerHeight(true) -
                this.$listDockedGrids.find(".filters-grid:visible").outerHeight();
            collapsibleGridMainContainerMaxHeight += this.$listDockedGrids.find(".groups-grid:visible")
                .outerHeight(true) -
                this.$listDockedGrids.find(".groups-grid:visible").outerHeight();
            collapsibleGridMainContainerMaxHeight = dockableAreaHeight - collapsibleGridMainContainerMaxHeight;
            if (this.$listDockedGrids.find(".preferences-grid.shown").length == 1 && !this.isPreferencesMinimized) {
                this.$listDockedGrids.find(".preferences-grid.shown .collapsible-grid-main-container")
                    .css("max-height", collapsibleGridMainContainerMaxHeight + "px");
            }
            if (this.$listDockedGrids.find(".filters-grid.shown").length == 1 && !this.isFiltersMinimized) {
                this.$listDockedGrids.find(".filters-grid.shown .collapsible-grid-main-container")
                    .css("max-height", collapsibleGridMainContainerMaxHeight + "px");
            }
            if (this.$listDockedGrids.find(".groups-grid.shown").length == 1 && !this.isGroupsMinimized) {
                this.$listDockedGrids.find(".groups-grid.shown .collapsible-grid-main-container")
                    .css("max-height", collapsibleGridMainContainerMaxHeight + "px");
            }
            //For standalone draggable grids
            this.$listHeader.find(".collapsible-grid.ui-draggable.shown")
                .each(function() {
                    var headerHeight = $(this).find(".grids-header").outerHeight();
                    var footerHeight = $(this).find(".collapsile-grid-footer").outerHeight();
                    var totalHeight = this.$listDockedGrids.outerHeight();
                    $(this)
                        .find(".collapsible-grid-main-container")
                        .css("max-height", (totalHeight - (headerHeight + footerHeight)) + "px");
                });
            //Handle empty resultset
            if (this.$listData.find(".no-results-row").length == 1) {
                this.$listDataContainer.css("height", this.$listDataContainer.outerHeight() + "px");
                this.$listData.css({
                    "width": dataContainerWidth + "px",
                    "position": "absolute",
                    "top": "0",
                    "left": "0"
                });
            }

            //Horizontal scrollbar
            this.$listHorizontalScrollbar.css({
                width: (dataContainerWidth + this.scrollbarSize) + "px",
                height: this.scrollbarSize + "px"
            });
            this.$listHorizontalScrollbar.find(".scrollbar-content-wrapper")
                .css({ width: (dataContainerWidth + this.scrollbarSize) + "px", height: this.scrollbarSize + "px" });
            this.$listHorizontalScrollbar.find(".scrollbar-content")
                .css({ width: (totalWidth + this.scrollbarSize) + "px", height: this.scrollbarSize });

            //Vertical scrollbar
            if (skipVerticalScrollbar !== true) {
                this.$listVerticalScrollbar.css({
                    width: this.scrollbarSize + "px",
                    height: (this.$listColumnHeaderContainer.outerHeight() + dataContainerHeight + footerHeight) + "px"
                });
                this.$listVerticalScrollbar.find(".top-right-corner")
                    .css({ width: this.scrollbarSize + "px", height: this.$listColumnHeaderContainer.outerHeight() + "px" });
                this.$listVerticalScrollbar.find(".bottom-right-corner")
                    .css({ width: this.scrollbarSize + "px", height: footerHeight + "px" });
                this.$listVerticalScrollbar.find(".scrollbar-content")
                    .css({ width: this.scrollbarSize + "px", height: totalHeight + "px" });
                if (self.options.standAlone !== false) {
                    this.$listVerticalScrollbar.find(".row-num-border")
                        .css({ width: this.scrollbarSize + "px", height: standaloneRemainingHeight + "px" });
                    this.$listVerticalScrollbar.find(".scrollbar-content-wrapper")
                        .css({
                            width: this.scrollbarSize + "px",
                            height: (dataContainerHeight - standaloneRemainingHeight) + "px"
                        });
                } else {
                    this.$listVerticalScrollbar.find(".row-num-border").css({ "display": "none" });
                    this.$listVerticalScrollbar.find(".scrollbar-content-wrapper")
                        .css({ width: this.scrollbarSize + "px", height: dataContainerHeight + "px" });
                }
            }

            var showBottomCap = this.$listFooterContainer
                .find(".list-aggregators-row:visible")
                .children()
                .length ==
                0 &&
                !showHorizontalScrollbar &&
                (this.$listHeader
                    .outerHeight() +
                    this.$listColumnHeader.outerHeight() +
                    dataContainerHeight) <
                containerMaxHeight;
            this.$listFooterContainer.toggleClass("bottom-cap", showBottomCap);
            this.$listVerticalScrollbar.find(".bottom-right-corner").toggleClass("bottom-cap", showBottomCap);
            //Show-Hide scrollbars
            this.$listHorizontalScrollbar.toggle(showHorizontalScrollbar);
            if (dataContainerHeight < totalHeight) {
                this.$listVerticalScrollbar.find(".scrollbar-content-wrapper").css("overflow-y", "scroll");
            } else {
                this.$listVerticalScrollbar.find(".scrollbar-content-wrapper").css("overflow-y", "hidden");
            }

            //Update scroll position
            this.updateScrollPosition();

            //Set float to container and restore document scroll position
            this.options.$container.css({ "float": "left" });
            $(document).scrollTop(documentScroll);

            if (this.options.standAlone !== false) {
                this.options.$container.css({ "height": containerMaxHeight + "px" });
            }

            this.updateActionButtonVisibility();
            this.updateActionButtonsMode();
            this.configureMobileMode();

            if (this.isMobileMode) this.$listDataContainer.getNiceScroll().resize();
            if (this.options.useCustomScrollbar === true) {
                this.$listVerticalScrollbar.find(".scrollbar-content-wrapper").perfectScrollbar("update");
                this.$listHorizontalScrollbar.find(".scrollbar-content-wrapper").perfectScrollbar("update");
            }
        }

        updateActionButtonsMode() {
            if (this.options.useContextMenuForRowActions === false) return;

            var $actionButtons = this.$listHeader
                .find("button.show-always:not(.hidden):not(.not-accessible), button.show-single:not(.hidden):not(.not-accessible), button.show-multi:not(.hidden):not(.not-accessible)");
            var $actionButtonsContainer = this.$listHeader.find(".list-action-buttons-container");
            var $actionsDropDown = this.$listHeader.find(".common-actions-dropdown");
            var headerToolbarWidth = this.$listHeader.find(".header-toolbar-container:not(.mobile):visible").width();
            var headerToolbarHeight = this.$listHeader.find(".header-toolbar-container:not(.mobile):visible").height();
            var headerLeftWidth = this.$listHeader.find(".header-toolbar-container:not(.mobile):visible .header-left")
                .width();
            var headerRightWidth = this.$listHeader.find(".header-toolbar-container:not(.mobile):visible .header-right")
                .width();
            var totalActionButtonsWidth = 0;
            var MARGIN = 100;
            var SINGLE_LINE_HEIGHT = 65;

            //Set web mode visibility state
            var webViewVisibility = this.$listHeader.find(".header-toolbar-container:not(.mobile)").is(":visible");
            this.$listHeader.find(".header-toolbar-container:not(.mobile)").show();
            $actionButtons.show();

            for (var i = 0; i < $actionButtons.length; i++) {
                totalActionButtonsWidth += $actionButtons.eq(i).width();
            }

            //The following parts are commented because the actions were moved to a single line
            var notEnoughSpaceForButtons = headerToolbarWidth <
                headerLeftWidth + headerRightWidth + totalActionButtonsWidth + MARGIN ||
                headerToolbarHeight > SINGLE_LINE_HEIGHT;

            $actionButtons.toggle(notEnoughSpaceForButtons === false);
            $actionsDropDown.toggle(notEnoughSpaceForButtons === true && $actionButtons.length > 0);
            $actionButtonsContainer.toggleClass("minimal", notEnoughSpaceForButtons === true);

            this.$listHeader.find(".header-toolbar-container:not(.mobile)").toggle(webViewVisibility);
        }

        updateScrollPosition() {
            if (this.$listVerticalScrollbar != null) {
                var $verticalScroll = this.$listVerticalScrollbar.find(".scrollbar-content-wrapper");
                this.$listDataContainer.scrollTop($verticalScroll.scrollTop());
            }
            if (this.$listHorizontalScrollbar != null) {
                var $horizontalScroll = this.$listHorizontalScrollbar.find(".scrollbar-content-wrapper");
                this.$listColumnHeaderContainer.scrollLeft($horizontalScroll.scrollLeft());
                this.$listDataContainer.scrollLeft($horizontalScroll.scrollLeft());
                this.$listFooterContainer.scrollLeft($horizontalScroll.scrollLeft());
            }
        }

        updateDraggableElementPositions() {
            if (this.options.standAlone === false || this.$listHeader == null) return;

            if (this.draggableGroupingPosition != null) {
                this.$listHeader.find(".groups-grid")
                    .css({
                        "top": this.draggableGroupingPosition.top + "px",
                        "left": this.draggableGroupingPosition
                            .left +
                            "px"
                    });
            } else {
                this.$listHeader.find(".groups-grid")
                    .css({
                        "left": (this.$listHeader.find("button.btn-list-groups").offset().left -
                                this.$groupsContainer.find(".groups-grid").outerWidth()) +
                            "px"
                    });
            }

            if (this.draggablePreferencesPosition != null) {
                this.$listHeader.find(".preferences-grid")
                    .css({
                        "top": this.draggablePreferencesPosition.top + "px",
                        "left": this.draggablePreferencesPosition.left + "px"
                    });
            } else {
                this.$listHeader.find(".preferences-grid")
                    .css({
                        "left": (this.$listHeader.find("button.btn-list-preferences").offset().left -
                                this.$preferencesContainer.find(".preferences-grid").outerWidth()) +
                            "px"
                    });
            }

            if (this.draggableFiltersPosition != null) {
                this.$listHeader.find(".filters-grid")
                    .css({
                        "top": this.draggableFiltersPosition.top + "px",
                        "left": this.draggableFiltersPosition.left + "px"
                    });
            } else {
                this.$listHeader.find(".filters-grid")
                    .css({
                        "left": (this.$listHeader.find("button.btn-list-filters").offset().left -
                                this.$filtersContainer.find(".filters-grid").outerWidth()) +
                            "px"
                    });
            }
        }

        flashElement($element) {
            var initalBGcolor = $element.css("background-color");

            $element.animate({
                    opacity: 0.5,
                    "background-color": "#99ccff"
                },
                750,
                function() {
                    $element.animate({
                            opacity: 1,
                            "background-color": initalBGcolor
                        },
                        750,
                        function() {
                            if (initalBGcolor != "rgba(0, 0, 0, 0)") return;
                            $element.css("background-color", "");
                        });
                });
        }

        flashElements($elements) {
            for (var i = 0; i < $elements.length; i++) {
                this.flashElement($elements.eq(i));
            }
        }

        highlightCurrentHeaderAndRowNumber(cell) {
            const $cell = $(cell);
            this.$listColumnHeader.find(".highlighted-cell").removeClass("highlighted-cell");
            this.$listColumnHeader.find(".column-title").eq($cell.index()).addClass("highlighted-cell");
        }

        showLoadingOverlay(interval?, onInit?) {
            //_popUpManager.showLoadingPopUp(interval);
        }

        hideLoadingOverlay() {
            //_popUpManager.hideLoadingPopUp();
        }

        filtersCreatedByGlobalSearch() {
            const filters = this.status.filters;

            // Not every column has a filter, or a column has more than one
            if (filters.length === 0 || filters.length !== this.status.columns.length) return false;

            const filteredColumns = [];

            const term = filters[0].value;

            for (let i = 0; i < filters.length; i++) {
                const filter = filters[i];

                // A filter is not compatible with global search (Same search value, LIKE operator and OR row operators must be used)
                if (filter.operator !== FilterOperators.LIKE ||
                    filter.rowOperator === RowOperators.AND ||
                    filter.value !== term) return false;

                filteredColumns.push(filter.column);
            }

            for (let i = 0; i < this.status.columns.length; i++) {
                // Not every list column is filtered exactly once
                if (filteredColumns.indexOf(this.status.columns[i].name) == -1) return false;
            }

            // Filters were created by a global search
            return true;
        }

        getColumnQuickFiltersValue(column) {
            const filters = this.status.filters;

            const quickFilterValues = [];

            for (let i = 0; i < filters.length; i++) {
                const filter = filters[i];

                if (filter.column !== column.name) continue;

                if (filter
                    .operator !==
                    FilterOperators.LIKE ||
                    filter.rowOperator === RowOperators.OR) return [];

                if (column.dataType === "DateTime") {
                    const formatted = Common
                        .getDateStringFromUtc(filter.value, this.getFormatOfDate(column.formatting));
                    quickFilterValues.push(formatted);
                } else {
                    quickFilterValues.push(filter.value);
                }
            }

            // No quick filter applied to this column
            return quickFilterValues;
        }

        onColumnResized(event, ui) {
            var difference = ui.position.left - ui.originalPosition.left;
            var $handler = $(event.target);
            var columnName = $handler.closest("th").data("column");
            var column = this.getColumnInfoByName(columnName);
            var columnIndex = this.status.columns.indexOf(column);

            $handler.css("opacity", "0");

            for (var i = 0; i < this.status.columns.length; i++) {
                if (this.columnMustBeRendered(this.status.columns[i]) === false) continue;
                if (i != columnIndex && this.status.columns[i].customWidth == null) {
                    this.status.columns[i].customWidth = this.$listColumnHeader
                        .find(`th[data-column='${this.status.columns[i].name}']`)
                        .outerWidth();
                } else if (i == columnIndex) {
                    var oldWidth = this.$listColumnHeader.find(`th[data-column='${this.status.columns[i].name}']`)
                        .outerWidth();
                    var newWidth = oldWidth + difference;

                    newWidth = newWidth < this.status.columns[i].minWidth ? this.status.columns[i].minWidth : newWidth;

                    this.status.columns[i].customWidth = newWidth;
                }
            }

            this.updateControl({
                refreshDimensions: true,
                updateUiElements: true
            });
            if (this.$listHeader.find(".available-views:visible").length == 0 ||
                this.$listHeader.find(".available-views:first option").length == 1)
                this.$listHeader.find(".btn-list-reset").removeClass("hidden");
        }

        getColumnInfoByName(name) {
            for (var i = 0; i < this.status.columns.length; i++) {
                if (this.status.columns[i].name == name) return this.status.columns[i];
            }

            return null;
        }

        changeView(viewName) {            
            if (viewName === "PREDEFINED") {
                this.resetList(true);
                return;
            }

            const $dropDown = this.$listHeader.find(".available-views");

            const $selectedOption = $dropDown.find(`[value='${viewName}']`);

            if ($selectedOption.length === 0) return;

            const statusToLoad = JSON.parse($selectedOption.data("status"));

            this.status = statusToLoad;
            this.status.currentView = $selectedOption.val();
            this.status.startRow = 0;

            this.updateData();
        }
                      
        saveCurrentViewAsDefault() {
            if (confirm(this.resources.MakeDefaultConfirmation)) {
                var $viewsDropDown = this.$listHeader.find(".available-views");
                var selectedViewName = $viewsDropDown.val() == "PREDEFINED" ? "" : $viewsDropDown.val();
                var defaultViewName = this.viewsCache != null ? this.viewsCache.DefaultView : "";

                if (selectedViewName != defaultViewName && selectedViewName.length > 0) {
                    this.saveViewToProfile(selectedViewName, true);
                } else {
                    this.saveViewToProfile(defaultViewName, false);
                }

                this.viewsCache.DefaultView = selectedViewName;
                this.updateControl({ createListHeader: true, updateUiElements: true });
            }
        }

        createNotFoundRow() {
            var $row = $("<tr class='no-results-row warning'></tr>");
            var colspan = 0;


            for (var i = 0; i < this.status.columns.length; i++) {
                if (this.columnMustBeRendered(this.status.columns[i]) === true) colspan++;
            }

            if (this.options.showRowNumbers) {
                $row.append("<td class='list-data-cell row-number'></td>");
                colspan--;
            }

            $row.append(`<td colspan='${colspan}'>\
                        <span class='info-icon glyphicon glyphicon-info-sign'></span>\
                        <span class='info-description'>${this.resources.NoResults}</span>\
                    </td>`);

            return $row;
        }

        createCell(value, columnInfo): JQuery {
            let itemClass = columnInfo.classes;
            if (itemClass == null) itemClass = "";

            switch (columnInfo.itemType) {
            case Joove.Widgets.ListColumnItemType.HYPERLINK:
                return $(`<a class='${itemClass}' href="#" onclick="performRedirection('${value
                    }', '_blank'); return false">${value}</a>`);

                case Joove.Widgets.ListColumnItemType.DOWNLOADLINK:
                return $(`<a class='download-link ${itemClass}' target='_blank' href='DownloadFileByPath?path=${value}'>${value}</a>`);

            case Joove.Widgets.ListColumnItemType.CHECKBOX:
                const trueValues = ["true", "1", "yes", "ok"];
                const unsafeValue = String(value).toLowerCase();
                const isTrue = trueValues.indexOf(unsafeValue) > -1;
                const checked = isTrue ? "checked='checked'" : "";
                const $checkBox = $("<input type='checkbox' style='display:inline-block' />");

                if (isTrue) $checkBox.attr("checked", "checked");
                $checkBox.addClass(itemClass);
                $checkBox.toggleClass("list-editable", columnInfo.editable);
                $checkBox.toggleClass("checkbox-in-data-cell", !columnInfo.editable);

                return $checkBox;

            case Joove.Widgets.ListColumnItemType.IMAGEBOX:
                return $(`<img class="img-thumbnail ${itemClass}" src="../../Upload/${value}" >`);

            default:
                if (value != null && String(value).toLowerCase() === "true") value = this.resources.True;
                if (value != null && String(value).toLowerCase() === "false") value = this.resources.False;

                if (value == null) value = window._resourcesManager.getNullValueText();

                if (columnInfo.editable) {
                    const $inputArea = $(`<input type='text' class='default-input form-control list-editable ${itemClass
                        }'>`);
                    $inputArea.val(value);
                    if (columnInfo.dataType === "DateTime" || columnInfo.dataType === "System.DateTime") {
                        this.convertElementToDatePicker($inputArea, columnInfo.formatting);
                    }
                    return $inputArea;
                } else {
                    if (this.options.enableCompactText !== false)
                        return $(`<span class='text-compact ${itemClass}'>${value}</span>`);
                    else
                        return $(`<span class='${itemClass}'>${value}</span>`);
                }
            }
        }

        goToStandAloneMode() {
            //todo: log
            //if (SESSION_DEBUG.options.LIST_DEBUG === true) console.log("Going To Stand Alone Mode");

            $("[jb-type='BodyContainer']").css("width", "100%");

            $("body").css("overflow-x", "hidden");
            $("body").css("overflow-y", "hidden");

            if (this.$list != null) {
                this.$list.parent().addClass("stand-alone");
            }
        }

        showOnlyPredefinedFiltersFieldSet() {
            if (this.options.standAlone !== false) this.goToStandAloneMode();

            this.$predefinedFiltersFieldSet.animate(
                {
                    "opacity": "1"
                },
                500);

            return;
        }

        // For Stability Issues...
        startRefreshDimetionsInterval() {
            clearInterval(this.refreshDimentionsInterval);
            const self = this;
            this.refreshDimentionsInterval = setInterval(function() {
                    if (self.options.maxIterationsForRefreshDimentions < self.refreshDimetionsCounter) {
                        clearInterval(self.refreshDimentionsInterval);
                        return;
                    }
                    self.hidingData = false; //for opacity issues
                    self.refreshDimetionsCounter++;
                    self.refreshDimensions();

                    if (self.refreshDimetionsCounter == 1 && self.options.isPickList) {
                        self.options.$container.animate({
                            "opacity": 1
                        }, 500);
                        self.removeInitializationLoadingElement();                    
                    }

                },
                this.options.refreshDimentionsInterval);
        }

        createInitializationLoadingElement() {
            if (this.options.waitForPredefinedFilters !== false) return;

            if (this.options.standAlone !== false) {
                this.showLoadingOverlay(0, false);
                return;
            }

            var $loadingElement = $("<div class='list-init-loading'>\
                                        <div class='spinner'>\
                                            <div class='rect1'></div>\
                                            <div class='rect2'></div>\
                                            <div class='rect3'></div>\
                                            <div class='rect4'></div>\
                                            <div class='rect5'></div>\
                                        </div>\
                                      </div>");

            $loadingElement.css("width", "100%");

            this.options.$container.before($loadingElement);
        }

        removeInitializationLoadingElement() {
            if (this.options.standAlone !== false) {
                this.hideLoadingOverlay();
                return;
            }

            window.clearTimeout(this.showInitializationLoadingTimeout);            
            this.options.$container.prev(".list-init-loading").remove();
        }

        disableActionButtons() {
            const $btnContainer = this.options.$container.find(".list-action-buttons-container")
                .find("button")
                .attr("disabled", "disabled");
        }

        enableActionButtons() {
            const $btnContainer = this.options.$container.find(".list-action-buttons-container")
                .find("button")
                .removeAttr("disabled");
        }

        onResize() {
            if ($("#rootElement").width() < 910) {
                this.options.$container.addClass("small-width");
            } else {
                this.options.$container.removeClass("small-width");
            }
            this.resizeTime = new Date();
            if (this.$list != null && this.resizeTimeout === false) {
                this.resizeTimeout = true;
                const self = this;
                setTimeout(function() { return self.resizeEnd(); }, this.resizeDelta);
            }
        }

        resizeEnd() {
            if (+new Date() - +this.resizeTime < this.resizeDelta) {
                const self = this;
                setTimeout(function() { return self.resizeEnd(); }, this.resizeDelta);
            } else {
                this.resizeTimeout = false;
                this.updateControl({ refreshDimensions: true });
            }          
        };

        updateControl(updateOptions) {

            if (typeof (updateOptions) !== "undefined") {
                if (updateOptions.createListHeader === true) {
                    this.createListHeader();
                }

                if (updateOptions.createListColumnHeader === true) {
                    this.createListColumnHeader();
                }

                if (updateOptions.createListData === true) {
                    this.createListData();
                }

                if (updateOptions.createGroupsData === true) {
                    this.createGroupsData();
                }

                if (updateOptions.updateGroupAggregators === true) {
                    if (this.aggregatorsData == null) {
                        this.getPredefinedAggregators();
                    } else {
                        this.updateAggregatorsData();
                    }
                }

                if (updateOptions.createRecordSetAggregators === true && this.status.groupBy.length == 0) {
                    this.createRecordSetAggregators(updateOptions.keepAggregatorsOfFullRecordSet);
                }

                if (updateOptions.updateActionButtonVisibility === true) {
                    this.updateActionButtonVisibility();
                }

                if (updateOptions.updateUiElements === true) {
                    this.updateUiElements();
                }

                if (updateOptions.applyConditionalFormattings === true) {
                    this.applyConditionalFormattings();
                }

                if (updateOptions.refreshDimensions === true) {
                    this.refreshDimensions(updateOptions.skipVertivalScrollbar);

                    //Update draggable element positions and set fixed header
                    if (this.options.standAlone !== false) {
                        this.updateDraggableElementPositions();
                    }
                    if (//this.options.standAlone !== false &&
                        this.options.runRefreshDimentionsAtIntervals === true) {
                        this.refreshDimetionsCounter = 0;
                        this.startRefreshDimetionsInterval();
                    }
                }

                if (this.options.hasMultiselection !== false) {
                    this.updateSelectionButtonsStatus();
                }

                this.restoreSelectedItems();

                this.handleGridButtonState();
                this.synchronizeScrolling();
            }
        }

        synchronizeScrolling() {
            const self = this;
            let scrollLock = this.scrollLock;
            let scrollTimeout = this.scrollTimeout;

            if (this.$listHorizontalScrollbar != null && this.$listVerticalScrollbar != null) {
                var $horizontalScroll = this.$listHorizontalScrollbar.find(".scrollbar-content-wrapper");
                var $verticalScroll = this.$listVerticalScrollbar.find(".scrollbar-content-wrapper");

                $horizontalScroll.off("scroll");
                $horizontalScroll.on("scroll",
                    function(e) {
                        self.status.horizontalScrollPosition = $horizontalScroll.scrollLeft();

                        if (scrollLock == null || scrollLock == "horizontal") {
                            scrollLock = "horizontal";
                            clearTimeout(scrollTimeout);
                            self.$listColumnHeaderContainer.scrollLeft($(this).scrollLeft());
                            self.$listDataContainer.scrollLeft($(this).scrollLeft());
                            self.$listFooterContainer.scrollLeft($(this).scrollLeft());
                            scrollTimeout = setTimeout(function() {
                                    scrollLock = null;
                                },
                                300);
                        }
                    });

                $verticalScroll.off("scroll");
                $verticalScroll.on("scroll",
                    function(e) {
                        self.status.verticalScrollPosition = $verticalScroll.scrollTop();

                        self.$rowContextMenu.hide();

                        if (scrollLock == null || scrollLock == "vertical") {
                            scrollLock = "vertical";
                            clearTimeout(scrollTimeout);
                            self.$listDataContainer.scrollTop($(this).scrollTop());
                            scrollTimeout = setTimeout(function() {
                                    scrollLock = null;
                                },
                                300);
                        }
                    });

                this.$listDataContainer.off("scroll");
                this.$listDataContainer.on("scroll",
                    function(e) {
                        self.$rowContextMenu.hide();
                        if (scrollLock == null || scrollLock === "touch") {
                            scrollLock = "touch";
                            $verticalScroll.scrollTop($(this).scrollTop());
                            self.$listColumnHeaderContainer.scrollLeft($(this).scrollLeft());
                            $horizontalScroll.scrollLeft($(this).scrollLeft());
                            self.$listFooterContainer.scrollLeft($(this).scrollLeft());
                            scrollTimeout = setTimeout(function() {
                                    scrollLock = null;
                                },
                                777);
                        }
                    });
            }
        }

        userCameBack() {
            return window.location.href.indexOf("comeback=true") > -1;
        }

        populateExportPopUpContainer($container: JQuery, isNotPopUp: boolean) {
            const self = this;

            //On Load Export popUP initialize depend on group of ListForm and dataType of columns
            var groupColumns = this.status.groupBy;
            var allColumns = this.status.columns;
            var groupsDataOnly = this.status.getGroupsClosed;

            var row = $container.find(".row-table-export-pop-up[data-column='export-PDFportrait-orientation']")
                .attr("disabled", "disabled");
            var nonGroupCnt = $container.find(".row-table-export-pop-up[data-column='export-total-count']");
            var rowColor = $container.find(".row-table-colors-export-pop-up[data-column='row-table-aggregate-color']")
                .attr("disabled", "disabled");
            row.find(".export-portrait-orientation").attr("disabled", "disabled");

            $container.find(".export-include-grid-lines").attr("checked", "true");
            //For every checkbox in the display columns on the load of export-pop-up

            for (var i = 0; i < allColumns.length; i++) {
                var isVisibleNotChecked = $container.find(`.row-preference[data-column='${allColumns[i].name}']`)
                    .find(".column-is-visible")
                    .is(":checked") ===
                    false;
                var $temp = $container.find(`.row-preference[data-column='${allColumns[i].name}']`);
                $temp.find(".count-is-visible").attr("disabled", "disabled");
                if (isVisibleNotChecked) {
                    $temp.find(".sum-is-visible").attr("checked", "false");
                    $temp.find(".sum-is-visible").attr("disabled", "disabled");
                    $temp.find(".average-is-visible").attr("checked", "false");
                    $temp.find(".average-is-visible").attr("disabled", "disabled");
                    $temp.find(".count-is-visible").attr("checked", "false");
                    $temp.find(".count-is-visible").attr("disabled", "disabled");
                } else if (isVisibleNotChecked === false) {
                    if (allColumns[i].name == null || this.isDataTypeNumeric(allColumns[i].dataType) === false) {
                        var $nonNumericColumnsExport = $container
                            .find(`.row-preference[data-column='${allColumns[i].name}']`);
                        $nonNumericColumnsExport.find(".sum-is-visible").attr("checked", "false");
                        $nonNumericColumnsExport.find(".sum-is-visible").attr("disabled", "disabled");
                        $nonNumericColumnsExport.find(".average-is-visible").attr("checked", "false");
                        $nonNumericColumnsExport.find(".average-is-visible").attr("disabled", "disabled");
                        $nonNumericColumnsExport.addClass("non-numeric-column");
                    } else if (allColumns[i].name != null &&
                        this.isDataTypeNumeric(allColumns[i].dataType) &&
                        this.status.aggregators != null) {
                        for (var j = 0; j < this.status.aggregators.length; j++) {
                            var $NumericColumn = $container
                                .find(`.row-preference[data-column='${allColumns[i].name}']`);
                            if (this.status.aggregators[j].column == allColumns[i].name &&
                                this.status.aggregators[j].type === AggregatorTypes.SUM) {
                                $NumericColumn.find(".sum-is-visible").prop("checked", true);
                            }
                            if (this.status.aggregators[j].column == allColumns[i].name &&
                                this.status.aggregators[j].type === AggregatorTypes.AVERAGE) {
                                $NumericColumn.find(".average-is-visible").prop("checked", true);
                            }
                            if (this.status.aggregators[j].column == allColumns[i].name &&
                                this.status.aggregators[j].type === AggregatorTypes.COUNT) {
                                $NumericColumn.find(".count-is-visible").prop("checked", true);
                            }
                        }
                    }
                }
            }

            if (groupColumns.length != 0) {
                for (var i = 0; i < groupColumns.length; i++) {
                    var $currentRow = $container.find(`.row-preference[data-column='${groupColumns[i].column}']`);
                    if ($currentRow != null) {
                        $currentRow.find(".column-is-visible").prop("checked", true);
                        $currentRow.find(".column-is-visible").attr("disabled", "disabled");
                        $currentRow.find(".count-is-visible").removeAttr("disabled");
                    }
                }
                nonGroupCnt.attr("disabled", "disabled");
                nonGroupCnt.find(".export-non-group-count").attr("checked", "false");
                nonGroupCnt.find(".export-non-group-count").attr("disabled", "disabled");
            } else {
                var exportGroupData = $container.find(".row-table-export-pop-up[data-column='export-group-data']")
                    .attr("disabled", "disabled");
                exportGroupData.find(".export-only-group-data").attr("disabled", "disabled");
                $container.find(".row-table-colors-export-pop-up[data-column='row-table-group-color']")
                    .attr("disabled", "disabled");
                $container.find("#group-lines-color").attr("disabled", "disabled");
                nonGroupCnt.removeAttr("disabled");
                nonGroupCnt.find(".export-non-group-count").removeAttr("disabled");
            }
            //Listeners of the export PopUp
            $container.find(".checkall-header-isvisible")
                .on("click",
                    function() {
                        var checkAll = $(this).data("state") === "unchecked";
                        for (var i = 0; i < allColumns.length; i++) {
                            var rowWithNoVisibleDisabled = $container
                                .find(`.row-preference[data-column='${allColumns[i].name}']`)
                                .find(".column-is-visible")
                                .is(":disabled") ===
                                false;
                            var $temp = $container.find(`.row-preference[data-column='${allColumns[i].name}']`);
                            if (rowWithNoVisibleDisabled === false) continue;
                            $temp.find(".column-is-visible").prop("checked", checkAll).change();
                        }
                        $(this).data("state", checkAll === true ? "checked" : "unchecked");
                    });
            $container.find(".checkall-header-issum")
                .on("click",
                    function() {
                        var checkAll = $(this).data("state") === "unchecked";
                        for (var i = 0; i < allColumns.length; i++) {
                            var rowWithNoVisibleDisabled = $container
                                .find(`.row-preference[data-column='${allColumns[i].name}']`)
                                .find(".sum-is-visible")
                                .is(":disabled") ===
                                false;
                            var $temp = $container.find(`.row-preference[data-column='${allColumns[i].name}']`);

                            if (rowWithNoVisibleDisabled === false) continue;

                            $temp.find(".sum-is-visible").prop("checked", checkAll).change();
                        }
                        $(this).data("state", checkAll === true ? "checked" : "unchecked");
                    });

            $container.find(".checkall-header-isaverage")
                .on("click",
                    function() {
                        var checkAll = $(this).data("state") === "unchecked";
                        for (var i = 0; i < allColumns.length; i++) {
                            var rowWithNoVisibleDisabled = $container
                                .find(`.row-preference[data-column='${allColumns[i].name}']`)
                                .find(".average-is-visible")
                                .is(":disabled") ===
                                false;
                            var $temp = $container.find(`.row-preference[data-column='${allColumns[i].name}']`);

                            if (rowWithNoVisibleDisabled === false) continue;

                            $temp.find(".average-is-visible").prop("checked", checkAll).change();
                        }
                        $(this).data("state", checkAll === true ? "checked" : "unchecked");
                    });

            $container.find(".checkall-header-iscount")
                .on("click",
                    function() {
                        var checkAll = $(this).data("state") === "unchecked";
                        for (var i = 0; i < allColumns.length; i++) {
                            var rowWithNoVisibleDisabled = $container
                                .find(`.row-preference[data-column='${allColumns[i].name}']`)
                                .find(".count-is-visible")
                                .is(":disabled") ===
                                false;
                            var $temp = $container.find(`.row-preference[data-column='${allColumns[i].name}']`);

                            if (rowWithNoVisibleDisabled === false) continue;

                            $temp.find(".count-is-visible").prop("checked", checkAll);
                        }
                        $(this).data("state", checkAll === true ? "checked" : "unchecked");
                    });

            $container.find(".export-pop-up-btn-cancel")
                .on("click",
                    function() {
                        //todo: popup manager
                        return;
//                        popUpManager.hide();
                    });

            $container.find(".export-pop-up-btn-ok")
                .on("click",
                    function() {
                        var type = $container.find(".export-type").val();
                        var onlyGroups = $container.find(".export-only-group-data").is(":checked") === true;
                        var range = $container.find(".export-range").val();
                        var fileName = $container.find(".export-filename").val();
                        var includeGridLines = $container.find(".export-include-grid-lines").is(":checked") === true;
                        var portraitOrientation = $container.find(".export-portrait-orientation").is(":checked") ===
                            true;
                        var nonGroupCount = $container.find(".export-non-group-count").is(":checked") === true;
                        var visibleColumnsCollection = self.populateVisibleColumns($container);
                        var groupColor = $container.find("#group-lines-color").css("background-color");
                        var headerColor = $container.find("#header-line-color").css("background-color");
                        var evenColor = $container.find("#even-lines-color").css("background-color");
                        var oddColor = $container.find("#odd-lines-color").css("background-color");
                        var aggregateColor = $container.find("#aggregate-lines-color").css("background-color");

                        var allColumnsNoVisible = visibleColumnsCollection.every(function(x) {
                            for (var i = 0; i < visibleColumnsCollection.length; i++) {
                                if (x.isVisible == true) return false;
                            }
                            return true;
                        })

                        if (allColumnsNoVisible) {
                            alert("Error - None Visible Column");
                            return;
                        }

                        if (fileName == "") {
                            alert("Error - Empty FileName");
                            return;
                        }

                        var reservedChars = /^[^\\/:\*\?"<>\|]+$/;
                        if (!reservedChars.test(fileName)) {
                            alert("Error - FileName can not contain any of the following characters \/:*?\"<>| ");
                            return;
                        }

                        var forbiddenCharIndex = /^\./;
                        if (!reservedChars.test(fileName)) {
                            alert("Error - FileName can not start with char .");
                            return;
                        }

                        self.pushToAggregatorsStatusAtExportTime($container);
                        self.export({
                            type: type,
                            range: range,
                            onlyGroups: onlyGroups,
                            fileName: fileName,
                            includeGridLines: includeGridLines,
                            portraitOrientation: portraitOrientation,
                            visibleColumnsCollection: visibleColumnsCollection,
                            groupColor: groupColor,
                            headerColor: headerColor,
                            evenColor: evenColor,
                            oddColor: oddColor,
                            aggregateColor: aggregateColor,
                            nonGroupCount: nonGroupCount,
                        });


                        //todo: popup manager
                        return;
//                        popUpManager.hide();
                    });

            $container.find("#disCols")
                .click(function($container) {
                    var state = $(this).data("state");
                    $("#exportDisplayColumns").removeClass("hideColumnsPopUp");
                    if (state == "collapsed") {
                        $(this).closest(".clms-pop-up").css("height", "725px");
                        $("#exportDisplayColumns").slideDown("fast");
                        $(this).data("state", "expand");
                    } else {
                        var displayColumns = this;

                        $("#exportDisplayColumns")
                            .slideUp("fast",
                                function() {
                                    $(displayColumns).closest(".clms-pop-up").css("height", "470px");
                                });
                        $(this).data("state", "collapsed");
                    }

                });

            $container.find(".column-is-visible")
                .on("change",
                    function() {
                        var isVisible = $(this).is(":checked") === true;
                        var $parentRow = $(this).closest(".row-preference");
                        var $sumRowChkBox = $parentRow.find(".sum-is-visible");
                        var $avgRowChkBox = $parentRow.find(".average-is-visible");

                        if ($parentRow.hasClass("non-numeric-column") === true) return;

                        if (isVisible === false) {
                            $sumRowChkBox.attr("checked", "false");
                            $sumRowChkBox.attr("disabled", "disabled");
                            $avgRowChkBox.attr("checked", "false");
                            $avgRowChkBox.attr("disabled", "disabled");
                        } else if (isVisible === true) {
                            $sumRowChkBox.removeAttr("disabled");
                            $avgRowChkBox.removeAttr("disabled");
                        }
                    });

            $container.find(".sum-is-visible")
                .on("change",
                    function() {
                        var isSumChecked = $(this).is(":checked") === true;
                        if (isSumChecked === false) {
                            for (var i = 0; i < self.status.columns.length; i++) {
                                var column = self.status.columns[i];
                                var currentRow = $container.find(`.row-preference[data-column='${column.name}']`);

                                var isCurrentAverageChecked =
                                    currentRow.find(".average-is-visible").is(":checked") === true
                                if (isCurrentAverageChecked === true) return;

                                var isTotalCountChecked = $container.find(".export-non-group-count").is(":checked") ===
                                    true
                                if (isTotalCountChecked === true) return;
                            }
                            $container.find(".row-table-colors-export-pop-up[data-column='row-table-aggregate-color']")
                                .attr("disabled", "disabled");
                            $container.find("#aggregate-lines-color").attr("disabled", "disabled");
                        } else if (isSumChecked === true) {
                            rowColor.removeAttr("disabled");
                            (<any>$container.find("#aggregate-lines-color")).spectrum("enable");
                        }
                    });

            $container.find(".average-is-visible")
                .on("change",
                    function() {
                        var isAverageChecked = $(this).is(":checked") === true;
                        if (isAverageChecked === false) {
                            for (var i = 0; i < self.status.columns.length; i++) {
                                var column = self.status.columns[i];
                                var currentRow = $container.find(`.row-preference[data-column='${column.name}']`);

                                var isCurrentSumChecked = currentRow.find(".sum-is-visible").is(":checked") === true
                                if (isCurrentSumChecked === true) return;

                                var isTotalCountChecked = $container.find(".export-non-group-count").is(":checked") ===
                                    true
                                if (isTotalCountChecked === true) return;
                            }
                            $container.find(".row-table-colors-export-pop-up[data-column='row-table-aggregate-color']")
                                .attr("disabled", "disabled");
                            $container.find("#aggregate-lines-color").attr("disabled", "disabled");
                        } else if (isAverageChecked === true) {
                            rowColor.removeAttr("disabled");
                            (<any>$container.find("#aggregate-lines-color")).spectrum("enable");
                        }
                    });

            $container.find(".export-only-group-data")
                .on("change",
                    function() {
                        var exportOnlyGroupData = $(this).is(":checked") === true;
                        var allColumns = self.status.columns;
                        var nonGroupColumns = allColumns.filter(function(x) {
                            for (var i = 0; i < self.status.groupBy.length; i++) {
                                if (x.name == self.status.groupBy[i].column) return false;
                            }
                            return true;
                        });

                        if (exportOnlyGroupData === true) {
                            $container.find(".row-table-colors-export-pop-up[data-column='row-table-odd-color']")
                                .attr("disabled", "disabled");
                            $container.find("#odd-lines-color").attr("disabled", "disabled");

                            $container.find(".row-table-colors-export-pop-up[data-column='row-table-even-color']")
                                .attr("disabled", "disabled");
                            $container.find("#even-lines-color").attr("disabled", "disabled");
                            for (var i = 0; i < allColumns.length; i++) {
                                var $rowWithChkBoxes = $container
                                    .find(`.row-preference[data-column='${allColumns[i].name}']`);
                                var groupColumnsFiltered = groupColumns.filter(function(obj) {
                                    if (obj.column === allColumns[i].caption) return true;
                                    return false;
                                });
                                var flag;
                                if (groupColumnsFiltered.length == 0)
                                    flag = false;
                                else
                                    flag = groupColumnsFiltered[0].column === allColumns[i].caption

                                if (self.isDataTypeNumeric(allColumns[i].dataType) === true || flag) {
                                    $rowWithChkBoxes.find(".column-is-visible").prop("checked", true).change();
                                } else {
                                    $rowWithChkBoxes.find(".column-is-visible").attr("checked", "false");
                                    $rowWithChkBoxes.find(".column-is-visible").attr("disabled", "disabled");
                                    $rowWithChkBoxes.removeAttr("disabled");
                                }
                            }
                        } else {
                            $container.find(".row-table-colors-export-pop-up[data-column='row-table-odd-color']")
                                .removeAttr("disabled");
                            $container.find("#odd-lines-color").removeAttr("disabled");

                            $container.find(".row-table-colors-export-pop-up[data-column='row-table-even-color']")
                                .removeAttr("disabled");
                            $container.find("#even-lines-color").removeAttr("disabled");
                            for (var i = 0; i < nonGroupColumns.length; i++) {
                                var $rowWithChkBoxes = $container
                                    .find(`.row-preference[data-column='${nonGroupColumns[i].name}']`);
                                $rowWithChkBoxes.find(".column-is-visible").removeAttr("disabled");
                                $rowWithChkBoxes.find(".column-is-visible").prop("checked", true).change();
                                $rowWithChkBoxes.removeAttr("disabled");

                            }
                        }
                    });

            $container.find(".export-type")
                .on("change",
                    function() {
                        var $orientation = $container
                            .find(".row-table-export-pop-up[data-column='export-PDFportrait-orientation']");
                        if ($(this).val().toString() === "PDF") {
                            $orientation.removeAttr("disabled");
                            $orientation.find(".export-portrait-orientation").removeAttr("disabled");
                        } else {
                            $orientation.attr("disabled", "disabled");
                            $orientation.find(".export-portrait-orientation").attr("checked", "false");
                            $orientation.find(".export-portrait-orientation").attr("disabled", "disabled");
                        }
                    });

            $container.find(".export-non-group-count")
                .on("change",
                    function() {
                        var totalCountChecked = $(this).is(":checked") === true;
                        if (totalCountChecked === false) {
                            for (var i = 0; i < self.status.columns.length; i++) {
                                var column = self.status.columns[i];

                                var currentRow = $container.find(`.row-preference[data-column='${column.name}']`);
                                var isCurrentSumChecked = currentRow.find(".sum-is-visible").is(":checked") === true
                                if (isCurrentSumChecked === true) return;

                                var isCurrentAverageChecked =
                                    currentRow.find(".average-is-visible").is(":checked") === true
                                if (isCurrentAverageChecked === true) return;
                            }
                            $container.find(".row-table-colors-export-pop-up[data-column='row-table-aggregate-color']")
                                .attr("disabled", "disabled");
                            $container.find("#aggregate-lines-color").attr("disabled", "disabled");
                        }
                        else if (totalCountChecked === true) {
                            rowColor.removeAttr("disabled");
                            //$container.find("#aggregate-lines-color").spectrum("enable");
                        }
                    });

            this.addScrollListener($container.find(".export-table-display-columns"));

            //$container.find(".color-picker-button")
            //    .spectrum({
            //        showPaletteOnly: true,
            //        togglePaletteOnly: true,
            //        allowEmpty: true,
            //        showInitial: true,
            //        togglePaletteMoreText: "more",
            //        togglePaletteLessText: "less",
            //        //color: 'red',
            //        palette: [
            //            ["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
            //            ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
            //            ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
            //            ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
            //            ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
            //            ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
            //            ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
            //            ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
            //        ],
            //        hide: function(tinycolor) {
            //            var hexColor = tinycolor == null ? "" : tinycolor.toHexString();
            //            if (hexColor == "") $(this).css("background-color");
            //            else $(this).css("background-color", hexColor);
            //            //var input = $($(this).attr("background-color"));
            //            //$(input).val(hexColor).focus().blur().focus();
            //            //UpdateStyle(input[0]);
            //        }
            //    });

            //$container.find(".group-color-picker-button")
            //    .spectrum({
            //        showPaletteOnly: true,
            //        allowEmpty: true,
            //        showInitial: true,
            //        palette: [
            //            ["#a52a2a", "#008b8b", "#45818e", "#228b22", "#444", "#666", "#A0A0A0", "#999"],
            //            ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
            //            ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
            //        ],
            //        hide: function(tinycolor) {
            //            var hexColor = tinycolor == null ? "" : tinycolor.toHexString();
            //            if (hexColor == "") $(this).css("background-color");
            //            else $(this).css("background-color", hexColor);
            //            //var input = $($(this).attr("targetControlId"));
            //            //$(input).val(hexColor).focus().blur().focus();
            //            //UpdateStyle(input[0]);
            //        }
            //    });

            //rowColor.find("#aggregate-lines-color").spectrum("disable");
            //if (self.status.aggregators != null) {
            //    rowColor.attr("disabled", false);
            //    $container.find("#aggregate-lines-color").spectrum("enable");
            //}
            //if (groupsDataOnly) {
            //    $container.find(".row-table-export-pop-up[data-column='export-group-data']")
            //        .attr("disabled", "disabled");
            //    $container.find(".export-only-group-data").prop("checked", true).change();
            //    $container.find(".export-only-group-data").attr("disabled", "disabled");
            //}
        }

        populateVisibleColumns($container) {

            var $rows = $container.find(".row-preference");
            var JSONObj = [];
            for (var i = 0; i < $container.find(".row-preference").length; i++) {

                var $row = $rows.eq(i)
                var columnName = $row.data("column");
                var columnIsVisible = $row.find(".column-is-visible").is(":checked") === true;
                var sumIsVisible = $row.find(".sum-is-visible").is(":checked") === true;
                var averageIsVisible = $row.find(".average-is-visible").is(":checked") === true;
                var countIsVisible = $row.find(".count-is-visible").is(":checked") === true;
                var item = {};
                item["column"] = columnName;
                item["isVisible"] = columnIsVisible;
                item["sumIsVisible"] = sumIsVisible;
                item["averageIsVisible"] = averageIsVisible;
                item["countIsVisible"] = countIsVisible;

                JSONObj.push(item);
            }
            return JSONObj;
        }

        export(opts) {
            const self = this;
            var requestParameters = this.prepareRequestParameters({
                type: opts.type,
                range: opts.range,
                onlyGroups: opts.onlyGroups,
                filename: opts.fileName,
                includeGridLines: opts.includeGridLines,
                portraitOrientation: opts.portraitOrientation,
                columnOptions: opts.visibleColumnsCollection,
                groupColor: opts.groupColor,
                headerColor: opts.headerColor,
                evenColor: opts.evenColor,
                oddColor: opts.oddColor,
                aggregateColor: opts.aggregateColor,
                nonGroupCount: opts.nonGroupCount
            });

            var $controlInstace = this.options.isPickList === true ? this.$ownerButton : this.options.$container;
            var controlName = this.elementId;
                        
            Joove.Core.executeControllerActionNew({
                action: controlName + "_Export",
                controller: window._context.currentController,
                postData: {
                    model: "{}",
                    exportData: requestParameters,
                    datasourceRequest: this.prepareDatasourceRequestInfo()
                },
                verb: "POST",
                cb: (downloadInfo) => {
                    if (downloadInfo == null || downloadInfo.Data == null) {
                        window._popUpManager.error("Could not prepare list export file for download!");
                        return;
                    }

                    window.open(`${window._context.siteRoot}/${window._context.currentController}/DownloadFile?id=${downloadInfo.Data}`, "_blank");                    
                }
            });        
        }

        pushToAggregatorsStatusAtExportTime($container) {
            const self = this;


            for (let i = 0; i < self.status.columns.length; i++) {
                const temp = self.status.columns[i];
                const currentRow = $container.find(`.row-preference[data-column='${temp.name}']`);
                const isCurrentSumeChecked = currentRow.find(".sum-is-visible").is(":checked") === true;
                if (isCurrentSumeChecked)
                    self.pushToAggregatorsStatus(new Widgets
                        .ListAggregatorInfo(temp.name, AggregatorTypes.SUM, "PopUpMenu"));
                const isCurrentAverageChecked = currentRow.find(".average-is-visible").is(":checked") === true;
                if (isCurrentAverageChecked)
                    self
                        .pushToAggregatorsStatus(new
                            Widgets.ListAggregatorInfo(temp.name, AggregatorTypes.AVERAGE, "PopUpMenu"));
            }
        }

        spliceFromAggregatorsStatus() {
            const self = this;

            for (var i = self.status.aggregators.length - 1; i >= 0; i--) {
                if (self.status.aggregators[i].origin === "PopUpMenu") {
                    self.status.aggregators.splice(i, 1);
                }
            }
        }

        updateCellValue($item) {
            const requestParameters = {
                "key": $item.parents(".list-data-row").attr("data-key"),
                "property": this.$listColumnHeader.find(".column-titles-container")
                    .children(`th:nth-child(${$item.closest("td").index() + 1})`)
                    .data()
                    .column,
                "value": $item.is("input[type='checkbox']") ? $item.is(":checked") : $item.val()
            };

            if (typeof(this.options.onUpdateAction) === "undefined") {
                const options = {
                    controller: window._context.currentController,
                    action: this.elementId + "_UpdateCell",
                    postData: requestParameters
                };

                Core.executeControllerActionNew(options);
            } else {
                Core.getScope().actions[this.options
                    .onUpdateAction](requestParameters.key, requestParameters.property, requestParameters.value);
            }
        }

        initGlobalListeners() {
            /* TOOLBAR */
            const self = this;

            // Toggle Quick Filters Row
            self.$list.on("click",
                ".header-toolbar-container .toggle-quick-filters",
                function() {
                    self.toggleQuickFiltersRow(this);
                });
            self.$list.on("click",
                ".list-column-header .show-quick-filters",
                () => {
                    this.showQuickFiltersRow();
                });
            self.$list.on("click",
                ".list-column-header .hide-quick-filters",
                () => {
                    this.hideQuickFiltersRow();
                });

            // Perform Global Search
            self.$list.on("click",
                ".header-toolbar-container .global-search-btn",
                () => {
                    this.applyGlobalFilter();
                });

            // Perform Global Search on Enter
            self.$list.on("keydown",
                ".header-toolbar-container .global-search-input",
                e => {
                    if (e.keyCode === 13) this.applyGlobalFilter();
                });

            // Clear Global Search
            self.$list.on("click",
                ".header-toolbar-container .global-search-clear",
                () => {
                    this.clearGlobalSearch();
                });

            //Select all page rows
            self.$list.on("click",
                ".list-header .select-all-page-rows",
                (event: JQueryEventObject) => {
                    const action = $(event.target).data("action");
                    this.toggleVisibleRowsSelection(action);
                });

            //Select all rows
            self.$list.on("click",
                ".list-header .select-all-rows",
                (event: JQueryEventObject) => {
                    const action = $(event.target).data("action");

                    self.toggleAllRowsSelection(action);
                });

            // Reset List
            self.$list.on("click",
                ".header-toolbar-container .btn-list-reset",
                () => {
                    this.resetList();
                });

            // Refresh List
            self.$list.on("click",
                ".list-header .btn-list-refresh",
                () => {                    
                    //todo: log
                    /*if (SESSION_DEBUG.options.LIST_DEBUG === true) {
                        console.log("Clearing session");
                    }*/

                    // todo: ajax
                    //$.ajax({
                    //    url: self.prepareRequestUrl({ handler: "ClearSession" }),
                    //    data: {},
                    //    method: "POST",
                    //    success: (data) => {
                    //        if (data.length > 0) {
                    //            console.log(`Error clearing session: ${data}`);
                    //        }
                    //        self.updateData();
                    //    },
                    //    error: (jqXHR, textStatus, errorThrown) => {
                    //        self.handleError(ListControlAsset.Errors
                    //            .UPDATE_AGGREGATORS,
                    //            jqXHR,
                    //            textStatus,
                    //            errorThrown);
                    //    },
                    //    timeout: self.timeout
                    //});
                });

            // Go Back To Closed Groups
            self.$list.on("click",
                ".list-header .btn-list-prev-state",
                () => {
                    self.goBackToClosedGroups();
                });

            // Show Filters Pop Up
            self.$list.on("click",
                ".header-toolbar-container .btn-list-filters",
                () => {
                    if (this.options.usePopUpsForPreferences) {
                        this.showFiltersPopUp();
                    } else {
                        this.toggleGrids("filters-grid");
                    }
                });

            // Show Groups Pop Up
            self.$list.on("click",
                ".header-toolbar-container .btn-list-groups",
                () => {
                    if (self.options.usePopUpsForPreferences) {
                        self.showGroupsPopUp();
                    } else {
                        self.toggleGrids("groups-grid");
                    }
                });

            // Show Preferences Pop Up
            self.$list.on("click",
                ".header-toolbar-container .btn-list-preferences",
                () => {
                    if (self.options.usePopUpsForPreferences) {
                        self.showPreferencesPopUp();
                    } else {
                        self.toggleGrids("preferences-grid");
                    }
                });

            // Change Views
            self.$list.on("change",
                ".header-toolbar-container .available-views",
                (event: JQueryEventObject) => {
                    this.changeView($(event.target).val());
                });

            // Show Save View Pop Up
            self.$list.on("click",
                ".header-toolbar-container .btn-save-view",
                () => {
                    this.showSaveViewPopUp();
                });

            // Save current view as default
            self.$list.on("click",
                ".header-toolbar-container .btn-make-default-view",
                () => {
                    this.saveCurrentViewAsDefault();
                });

            // Show Delete View Pop Up
            self.$list.on("click",
                ".header-toolbar-container .btn-remove-view",
                () => {
                    this.showDeleteViewPopUp();
                });

            // Clear All Filters
            self.$list.on("click",
                ".header-toolbar-container .clear-all-filters",
                () => {
                    this.clearAllFilters();
                });

            // Clear All Aggregators
            self.$list.on("click",
                ".header-toolbar-container .clear-all-aggregators",
                () => {
                    this.clearAllAggregators();
                });

            // Export Excel
            self.$list.on("click",
                ".header-toolbar-container .btn-list-export",
                () => {
                    this.showExportPopUp();
                });

            // Import Pop Up
            self.$list.on("click",
                ".header-toolbar-container .btn-list-import",
                () => {
                    this.showImportPopUp();
                });

            /* TABLE HEADER */

            // Change Sorting on Column Header Click
            self.$list.on("click",
                ".column-title .title:not(.not-sortable)",
                function() {
                    self.sortByColumn(this);
                });

            // Move Column Right
            self.$list.on("click",
                ".column-title .move-column-right",
                function() {
                    self.moveColumn(this);
                });

            // Move Column Left
            self.$list.on("click",
                ".column-title .move-column-left",
                function() {
                    self.moveColumn(this);
                });

            // Resize Helpers Hide Move Left / Right on mouse enter
            self.$list.on("mouseenter",
                ".column-title .row-resize-handler",
                () => {
                    $(".move-column-right").addClass("no-opacity");
                    $(".move-column-left").addClass("no-opacity");
                });

            // Resize Helpers Hide Show Left / Right on mouse out
            self.$list.on("mouseleave",
                ".column-title .row-resize-handler",
                () => {
                    $(".move-column-right").removeClass("no-opacity");
                    $(".move-column-left").removeClass("no-opacity");
                });


            /* TABLE DATA */

            // Highlight Headers on Cell hover
            self.$list.on("mouseenter",
                ".list-data-table .list-data-cell",
                function() {
                    self.highlightCurrentHeaderAndRowNumber(this);
                    $(this).closest("tr").addClass("row-hover").addClass(self.options.hoverRowClass);
                });

            // Reset Headers on Cell out
            self.$list.on("mouseout",
                ".list-data-table .list-data-cell",
                () => {
                    this.$listHeader.find(".highlighted-cell").removeClass("highlighted-cell");
                    this.$listData.find(".row-hover").removeClass("row-hover").removeClass(this.options.hoverRowClass);
                });

            // Row Click
            // This Prevents double single click events on a double click
            self.$list.on("click",
                ".list-data-table .list-data-row",
                function(e) {
                    var clickedRow = this;
                    setTimeout(function() {
                            var dblclick = parseInt($(clickedRow).data("double"), 10);
                            if (dblclick > 0) {
                                $(clickedRow).data("double", dblclick - 1);
                            } else {
                                self.onRowClick(clickedRow);

                                if ($(clickedRow).hasClass(self.options.selectedRowClass) === false) return;

                                //self.showRowContextMenu(e);
                            }
                        },
                        300);
                });

            //Cell Click
            /*$list.on("click", ".list-data-table .list-data-row .list-data-cell", function (e) {
                var $data = $(this).children("span");
                if ($data.length == 1) {
                    if ($data.get(0).scrollHeight > $data.outerHeight() && $data.hasClass("text-compact")) {
                        $data.removeClass("text-compact");
                        self.updateControl({ refreshDimensions: true });
                    } else if (!$data.hasClass("text-compact")) {
                        $data.addClass("text-compact");
                        self.updateControl({ refreshDimensions: true });
                    }
                }
            });*/

            // Row Double Click
            if ($.inArray(true, this.status.columns.map(function(c) { return c.editable; }))) {
                self.$list.on("dblclick",
                    ".list-data-table .list-data-row",
                    function() {
                        $(this).data("double", 2);
                        self.onRowDblClick(this);
                    });
            }

            self.$list.on("change",
                ".list-data-table .list-data-row .list-editable",
                function() {
                    self.updateCellValue($(this));
                });

            self.$list.on("click",
                ".list-data-table .list-data-row .list-editable",
                function(e) {
                    const $row = $(this).closest(".list-data-row");
                    if ($row.hasClass(self.options.selectedRowClass)) {
                        e.stopPropagation();
                    }
                });

            // Row Right Click
            self.$list.on("contextmenu",
                ".list-data-table .list-data-row",
                function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    if ($(this).hasClass(self.options.selectedRowClass) === false) self.onRowClick(this);
                    self.showRowContextMenu(e);
                });

            // Row Hover
            self.$list.on("mouseenter",
                ".list-data-table .list-data-row",
                function() {
                    $(this).addClass("row-hover").addClass(self.options.hoverRowClass);
                });

            // Row Mouse Out
            self.$list.on("mouseout",
                ".list-data-table .list-data-row",
                () => {
                    this.$listData.find(".row-hover").removeClass("row-hover").removeClass(this.options.hoverRowClass);
                });

            // Do not change Checkboxes that display bool data
            self.$list.on("click",
                ".list-data-table .checkbox-in-data-cell",
                function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                });


            /* PAGER */

            // Prev Page
            self.$list.on("click",
                ".list-pager .list-prev-page",
                () => {
                    if (this.status.currentPage < 2) return;
                    this.changePage("-");
                });

            // Next Page
            self.$list.on("click",
                ".list-pager .list-next-page",
                () => {
                    this.changePage("+");
                });

            // First Page
            self.$list.on("click",
                ".list-pager .list-first-page",
                () => {
                    const $currentPageInput = this.$list.find(".list-pager .list-current-page:visible").eq(0);
                    $currentPageInput.val("1");
                    $currentPageInput.change();
                });

            // Last Page
            self.$list.on("click",
                ".list-pager .list-last-page",
                () => {
                    const $currentPageInput = this.$list.find(".list-pager .list-current-page:visible").eq(0);
                    $currentPageInput.val(String(this.status.totalPages));
                    $currentPageInput.change();
                });

            // Change Page Size
            self.$list.on("change",
                ".pager-container .select-page-size",
                function() {
                    self.changePageSize($(this).val());
                });

            // Change Page By Typing
            self.$list.on("change",
                ".list-pager .list-current-page",
                function() {
                    self.changePage($(this).val());
                });

            // Change Page By Typing When Enter
            self.$list.on("keydown",
                ".list-pager .list-current-page",
                function(e) {
                    if (e.keyCode === 13) self.changePage($(this).val());
                });


            /* GROUP MODE */

            // Highlight Group Header Badges
            self.$list.on("mouseover",
                ".list-data-table .group-header",
                function() {
                    $(".group-header").removeClass("hover");
                    $(".group-aggregators-row").removeClass("hover");
                    $(this).addClass("hover");
                    //$(this).next().addClass("hover");
                });

            // Highlight Group Header Badges
            self.$list.on("mouseout",
                ".list-data-table .group-header",
                () => {
                    $(".group-header").removeClass("hover");
                    $(".group-aggregators-row").removeClass("hover");
                });

            // Group Header Click
            self.$list.on("click",
                ".list-data-table .group-header",
                function() {
                    $(this).find(".group-toggle").eq(0).click();
                });

            // Toggle Group
            self.$list.on("click",
                ".group-header .group-toggle",
                (e: JQueryEventObject) => {
                    e.stopPropagation();
                    self.toggleGroup(e.target);
                });

            // Display Items of Closed Group
            self.$list.on("click",
                ".group-header .display-group-items", (e: JQueryEventObject) => {
                    e.stopPropagation();
                    const parentGroupInfo = $(e.target).closest(".group-header").data("groupInfo");
                    self.displayClosedGroupContents(parentGroupInfo);
                });

            // Display Items of Closed Group on header double click
            self.$list.on("dblclick",
                ".group-header", (e: JQueryEventObject) => {
                    $(e.target).find(".display-group-items").click();
                });

            /* AGGREGATORS ROW */

            // Aggregators Row Hover
            self.$list.on("mouseover",
                ".group-aggregators-row",
                function() {
                    $(".group-header").removeClass("hover");
                    $(".group-aggregators-row").removeClass("hover");
                    $(this).addClass("hover");
                    //$(this).prev().addClass("hover");
                });

            // Aggregators Row Mouse Out
            self.$list.on("mouseout",
                ".group-aggregators-row",
                () => {
                    $(".group-header").removeClass("hover");
                    $(".group-aggregators-row").removeClass("hover");
                });

            // Click on Aggregators Row
            self.$list.on("click",
                ".group-aggregators-row",
                (e: JQueryEventObject) => {
                    $(e.target).prev().click();
                });


            /* QUICK FILTERS */

            // Apply Quick Filter on Enter
            self.$list.on("keydown",
                ".quick-filters-container .quick-filter",
                function(e) {
                    if (e.keyCode !== 13) return;

                    if ($(this).val().trim() !== "") {
                        self.applyQuickFilters();
                    } else {
                        self.clearQuickFilter($(this).siblings(".remove-quick-filter").eq(0));
                    }
                });

            // Update Icons Visibility on key press
            self.$list.on("keyup",
                ".quick-filters-container .quick-filter",
                function(e) {
                    var isNotEmpty = $(this).val().trim() !== "";

                    $(this).siblings(".apply-quick-filter").toggle(isNotEmpty);

                    if (isNotEmpty === false && $(this).hasClass("quick-filter-applied") === true) {
                        $(this).siblings(".remove-quick-filter").addClass("alone");
                    } else {
                        $(this).siblings(".remove-quick-filter").removeClass("alone");
                    }
                });

            // Apply Quick Filter
            self.$list.on("click",
                ".quick-filters-container .apply-quick-filter",
                function() {
                    self.applyQuickFilters();
                });

            // Remove Quick Filter
            self.$list.on("click",
                ".quick-filters-container .remove-quick-filter",
                function() {
                    self.clearQuickFilter(this);
                });

            // Custom DropDown On Change Apply Quick Filter
            self.$list.on("change",
                ".quick-filters-container [jb-type='DropDownBox']",
                function(e) {
                    var value = $(this).find(".clmscombobox.form-control").combobox("getValue");
                    $(this).closest(".quick-filter-wrapper").find("input.quick-filter").val(value);
                    self.applyQuickFilters();
                });

            self.$list.on("change",
                ".quick-filters-container .bool-quick-filter",
                function(e) {
                    self.applyQuickFilters();
                });

            /* GRIDS */

            // Close Grids From Btn
            self.$list.on("click",
                ".collapsile-grid-footer .cancel-grid",
                function() {
                    self.toggleGrids($(this).data("cls"));

                    var $target = self.$list.find(".list-preferences-fieldsets-container");

                    // Reset Grid
                    switch ($(this).data("cls")) {
                    case "preferences-grid":
                        self.createViewPreferencesFieldSet($target);
                        break;

                    case "filters-grid":
                        self.createFiltersFieldSet($target);
                        break;

                    case "groups-grid":
                        self.createGroupsFieldSet($target);
                        break;
                    }
                });

            // Apply Filters
            self.$list.on("click",
                ".collapsile-grid-footer .apply-filters-from-grid",
                function() {
                    const $source = $(this).closest(".collapsible-grid").find(".filters-table-body");
                    self.updateFilters($source);
                });

            // Clear All Filters
            self.$list.on("click",
                ".collapsile-grid-footer .clear-filters-from-grid",
                function() {
                    $(this).closest(".collapsible-grid").find(".filters-table-body").children().remove();
                    const $source = $(this).closest(".collapsible-grid").find(".filters-table-body");
                    self.updateFilters($source);
                });
            // Apply Preferences
            self.$list.on("click",
                ".collapsile-grid-footer .apply-preferences-from-grid",
                function() {
                    const $source = $(this).closest(".collapsible-grid").find(".preferences-table-body");
                    self.updatePreferences($source);
                });

            // Apply Grouping
            self.$list.on("click",
                ".collapsile-grid-footer .apply-groups-from-grid",
                (evt: JQueryEventObject) => {
                    const getGroupsClosed = self.$list.find(".get-groups-closed").is(":checked");
                    self.updateGroups(this.groupWidget.getDataSourceTerms() as any,
                        getGroupsClosed);
                });

            // Clear all Groupings
            self.$list.on("click",
                ".collapsile-grid-footer .clear-groups-from-grid",
                (evt: JQueryEventObject) => {
                    $(evt.target).closest(".collapsible-grid").find(".grouping-columns").children().remove();
                    $(evt.target).closest(".collapsible-grid").find(".available-columns").children().show();
                    var groupsArray = [];
                    self.updateGroups(groupsArray, false);
                });

            /* CONTEXT MENUS */

            // Show Column Header context menu
            self.$list.on("contextmenu",
                ".column-titles-container .column-title",
                (evt: JQueryEventObject) => {
                    evt.stopPropagation();
                    evt.preventDefault();
                    self.showColumnTitleContextMenu(evt.target, evt);
                });

            // Hide context menus on body click
            $("body")
                .on("click",
                    (evt: JQueryEventObject) => {
                        $(".title-context-menu").hide();
                        $(".row-context-menu").hide();
                    });

            // Request Aggregator on Column Header menu item click
            this.$titleContextMenu.on("click",
                "[data-action]",
                function(e) {
                    $(".title-context-menu").hide();
                    var action = $(this).data("action");
                    var wasSelected = $(this).data("selected");
                    var column = self.$titleContextMenu.data("column");

                    if (wasSelected === true) {
                        self.removeFromAggregatorsStatus(new Joove.Widgets.ListAggregatorInfo(column, action));

                        if (self.status.groupBy == null ||
                            self.status.groupBy.length == 0 /*||
                            self.status.getGroupsClosed == false*/) {
                            self.createRecordSetAggregators(true);
                            self.updateControl({ refreshDimensions: true });
                        } else {
                            self.parseAggregatorsOfGroup(self.Groups);
                            self.createGroupAggregatorRows();
                        }

                    } else {
                        self.getAggregatorsForColumn(column, action);
                    }
                });

            // Execute Action on Row menu item click
            self.$rowContextMenu.on("click",
                "[data-target]",
                function(e) {
                    //e.preventBubble();            
                    e.preventDefault();
                    e.stopPropagation();
                    var $target = $(`[jb-id='${$(this).data("target")}']`);
                    $(".title-context-menu").hide();
                    if ($target.hasClass("not-accessible") === false) $target.click();
                });

            // Common Actions Drop Down
            self.$list.on("click",
                ".common-actions-dropdown [data-target], .mobile-dropdown-menu [data-target]",
                function() {
                    $(`[jb-id='${$(this).data("target")}']`).click();
                });
        }

        initPredefinedFiltersListeners() {
            const self = this;

            // Apply Predefined Filters on Enter
            $(`[data-filter-for-list='${this.elementId}']:not(.quick-filter)`)
                .on("keydown",
                    e => {
                        if (e.keyCode === 13) this.applyPredefinedFilters();
                    });

            // Apply Control
            //$(`[data-applies-filters-of='${this.elementId}']`)
            //    .on("click",
            //        () => {
            //            this.applyPredefinedFilters();
            //        });

            //// Clear Control
            //$(`[data-clears-filters-of='${this.elementId}']`)
            //    .on("click",
            //        () => {
            //            $(`[data-filter-for-list='${this.elementId}']:not(.quick-filter)`).val("");
            //            this.applyPredefinedFilters();
            //      });

            // Trigger list resize on fieldset header click
            this.$predefinedFiltersFieldSet.find(".panel-heading")
                .on("click",
                    function() {
                        setTimeout(function() {
                                self.refreshDimensions();
                            },
                            500);
                    });

            // Trigger list resize on fieldset arrow click
            this.$predefinedFiltersFieldSet.find(".panel-heading > span > span")
                .on("click",
                    function() {
                        setTimeout(function() {
                                self.refreshDimensions();
                            },
                            500);
                    });
        }

        createPreferencesFieldSets() {
            this.createViewPreferencesFieldSet(this.$preferencesContainer);
            this.createFiltersFieldSet(this.$filtersContainer);
            this.createGroupsFieldSet(this.$groupsContainer);
        }

        createViewPreferencesFieldSet($target) {
            const self = this;

            $target.find(".preferences-grid").remove();
            const docked = $target === this.$listDockedGrids ? " draggable-docked" : "";
            const arrowDirection = this.isPreferencesMinimized ? "down" : "up";

            const $contents = $(`<div class='preferences-grid collapsible-grid${docked}'>\
                             <div class='grids-header preferences-header'> \
                                  <span class='preferences-fieldset-caption'>${this.resources.PreferencesPopUpTitle
                }</span>\
                                  <span class='glyphicon glyphicon-remove draggable-action'></span>\
                                  <span class='glyphicon glyphicon-chevron-${arrowDirection} draggable-action'></span>\
                                  <span class='glyphicon glyphicon-screenshot draggable-action'></span>\
                              </div><div id="listsetting-preferences-container"></div><div class='collapsile-grid-footer'> \
                                 <input class='btn btn-sm btn-primary apply-preferences-from-grid' type='button' value='${this.resources.Apply}'/> \
                            </div> \
                         </div>`);

            this.orderWidget = new OrderDatasourceWidget({
                container: $("#listsetting-preferences-container", $contents),
                resources: this.resources,
                columns: this.status.columns,
                orderBy: this.status.orderBy,
                controlName: this.elementId
            });

            if (this.isPreferencesMinimized) {
                $contents.find(".collapsible-grid-main-container, .collapsile-grid-footer").css("display", "none");
            }
            $target.append($contents);

            //Actions listener
            $contents.find(".draggable-action")
                .on("click", function(event) { self.collapsibleGridActions($(this), "preferences-grid", event); });

            //Make this draggable
            if (this.options.standAlone !== false && docked.length == 0) {
                $contents.draggable({
                    stop: function(event, ui) {
                        self.draggablePreferencesPosition = ui.position;
                    },
                    containment: self.options.$container
                });
            }

            //if (this.options.standAlone !== false) {
            //    $contents.find(".grids-header").on("click", function () {
            //        if ($(this).parent().hasClass("draggable-docked")) {
            //            $(this).find(".glyphicon-chevron-up, .glyphicon-chevron-down").click();
            //        }
            //    });
            //}
        }

        createGroupsFieldSet($target) {
            const self = this;

            $target.find(".groups-grid").remove();
            const docked = $target === this.$listDockedGrids ? " draggable-docked" : "";
            const arrowDirection = this.isGroupsMinimized ? "down" : "up";

            const $contents = $(`<div class='groups-grid collapsible-grid${docked}'>\
                             <div class='grids-header groups-header'> \
                                  <span class='preferences-fieldset-caption'>${this.resources.GroupingOrder}</span>\
                                  <span class='glyphicon glyphicon-remove draggable-action'></span>\
                                  <span class='glyphicon glyphicon-chevron-${arrowDirection} draggable-action'></span>\
                                  <span class='glyphicon glyphicon-screenshot draggable-action'></span>\
                              </div><div class="groups-preferences-container"></div><div class='collapsile-grid-footer'> \
                                 <input class='btn btn-sm btn-default clear-groups-from-grid' type='button' value='${
                this.resources.ClearAll
                }'/> \
                                 <input class='btn btn-sm btn-primary apply-groups-from-grid' type='button' value='${
                this.resources.Apply
                }'/> \
                            </div> \
                            </div>`);

            this.groupWidget = new GroupDatasourceWidget({
                container: $(".groups-preferences-container", $contents),
                resources: this.resources,
                columns: this.status.columns,
                groupBy: this.status.groupBy,
                controlName: this.elementId
            });

            // populateGroupPreferencesContainer($contents, true);

            if (this.isGroupsMinimized) {
                $contents.find(".collapsible-grid-main-container, .collapsile-grid-footer").css("display", "none");
            }

            $target.append($contents);
            //Actions listener
            $contents.find(".draggable-action")
                .on("click", function(event) { self.collapsibleGridActions($(this), "groups-grid", event); });
            //Make this draggable
            if (this.options.standAlone !== false && docked.length === 0) {
                $contents.draggable({
                    stop: function(event, ui) {
                        self.draggableGroupingPosition = ui.position;
                    },
                    containment: self.options.$container
                });
            }
            if (this.options.standAlone !== false) {
                $contents.find(".grids-header")
                    .on("click",
                        function() {
                            if ($(this).parent().hasClass("draggable-docked")) {
                                $(this).find(".glyphicon-chevron-up, .glyphicon-chevron-down").click();
                            }
                        });
            }
        }

        createFiltersFieldSet($target) {
            const self = this;

            $target.find(".filters-grid").remove();
            const docked = $target === this.$listDockedGrids ? " draggable-docked" : "";
            const arrowDirection = this.isFiltersMinimized ? "down" : "up";

            const $contents = $(`<div class='filters-grid collapsible-grid${docked}'>\
                                <div class='grids-header filters-header'>\
                                    <span class='preferences-fieldset-caption'>${this.resources.FiltersPopUpTitle
                }</span>\
                                    <span class='glyphicon glyphicon-remove draggable-action'></span>\
                                    <span class='glyphicon glyphicon-chevron-${arrowDirection
                } draggable-action'></span>\
                                    <span class='glyphicon glyphicon-screenshot draggable-action'></span>\
                                </div>\
                                <div class='filters-container collapsible-grid-main-container'></div>\
                                <div class='collapsile-grid-footer'> \
                                    <input class='btn btn-sm btn-default clear-filters-from-grid' type='button' value='${this.resources.ClearAll}'/> \
                                    <input class='btn btn-sm btn-primary apply-filters-from-grid' type='button' value='${this.resources.Apply}'/> \
                                </div> \
                        </div>`);

            this.filterWidget = new Widgets.FilterDatasourceWidget({
                container: $(".filters-container", $contents),
                resources: this.resources,
                columns: this.status.columns,
                filters: this.status.filters,
                controlName: this.elementId
            });

            if (this.isFiltersMinimized) {
                $contents.find(".collapsible-grid-main-container, .collapsile-grid-footer").css("display", "none");
            }

            $target.append($contents);
            //Actions listener
            $contents.find(".draggable-action")
                .on("click", function(event) { self.collapsibleGridActions($(this), "filters-grid", event); });

            //Make this draggable
            if (this.options.standAlone !== false && docked.length === 0) {
                $contents.draggable({
                    stop: function(event, ui) {
                        self.draggableFiltersPosition = ui.position;
                    },
                    containment: self.options.$container
                });
            }
            if (this.options.standAlone !== false) {
                $contents.find(".grids-header")
                    .on("click",
                        function() {
                            if ($(this).parent().hasClass("draggable-docked")) {
                                $(this).find(".glyphicon-chevron-up, .glyphicon-chevron-down").click();
                            }
                        });
            }
        }

        collapsibleGridActions(target, gridClass, event) {
            const self = this;

            var insideDockArea = target.parent().parent().hasClass("draggable-docked");
            if (insideDockArea || target.hasClass("glyphicon-screenshot")) {
                event.stopPropagation();
            }
            if (target.hasClass("glyphicon-remove")) {
                self.toggleGrids(gridClass);
            } else if (target.hasClass("glyphicon-chevron-up")) {
                target.parent().siblings().hide();
                target.removeClass("glyphicon-chevron-up");
                target.addClass("glyphicon-chevron-down");
                switch (gridClass) {
                case "preferences-grid":
                    this.isPreferencesMinimized = true;
                    break;
                case "groups-grid":
                    this.isGroupsMinimized = true;
                    break;
                case "filters-grid":
                    this.isFiltersMinimized = true;
                    break;
                }
            } else if (target.hasClass("glyphicon-chevron-down")) {
                target.parent().siblings().show();
                target.removeClass("glyphicon-chevron-down");
                target.addClass("glyphicon-chevron-up");
                if (insideDockArea) {
                    this.restrictOneDockedGrid(gridClass);
                }
                switch (gridClass) {
                case "preferences-grid":
                    this.isPreferencesMinimized = false;
                    break;
                case "groups-grid":
                    this.isGroupsMinimized = false;
                    break;
                case "filters-grid":
                    this.isFiltersMinimized = false;
                    break;
                }
            } else if (target.hasClass("glyphicon-screenshot")) {
                var $gridContainer = this.$listHeader.find(`.${gridClass}`);
                var $dockedGridContainer = this.$listDockedGrids.find(`.${gridClass}`);
                var $resultContainer;
                if ($gridContainer.hasClass("ui-draggable")) {
                    $gridContainer.draggable("destroy");
                    $gridContainer.addClass("draggable-docked");
                    $gridContainer.appendTo(this.$listDockedGrids);
                    $resultContainer = this.$listDockedGrids;
                    this.restrictOneDockedGrid(gridClass);
                } else {
                    $dockedGridContainer.detach();
                    $dockedGridContainer.appendTo(this.$listHeader.find(".list-preferences-fieldsets-container"));
                    $resultContainer = this.$listHeader.find(".list-preferences-fieldsets-container");
                    $dockedGridContainer.draggable({
                        stop: (e, ui) => {
                            switch (gridClass) {
                            case "preferences-grid":
                                this.draggablePreferencesPosition = ui.position;
                                break;
                            case "groups-grid":
                                this.draggableGroupingPosition = ui.position;
                                break;
                            case "filters-grid":
                                this.draggableFiltersPosition = ui.position;
                                break;
                            }
                        },
                        containment: self.options.$container
                    });
                    $dockedGridContainer.removeClass("draggable-docked");
                    $dockedGridContainer.find("draggable-docked");
                    //Expand if minimized
                    $dockedGridContainer.find(".grids-header .glyphicon-chevron-down").click();
                }
                switch (gridClass) {
                case "preferences-grid":
                    this.$preferencesContainer = $resultContainer;
                    break;
                case "groups-grid":
                    this.$groupsContainer = $resultContainer;
                    break;
                case "filters-grid":
                    this.$filtersContainer = $resultContainer;
                    break;
                }
            }
            self.updateControl({ "refreshDimensions": true });
        }

        restrictOneDockedGrid(gridClass) {
            this.$listDockedGrids.children()
                .each(function() {
                    if (!$(this).hasClass(gridClass)) {
                        if ($(this).is(":visible")) {
                            $(this).find(".grids-header .glyphicon-chevron-up").click();
                        }
                    } else {
                        $(this).find(".grids-header .glyphicon-chevron-down").click();
                    }
                });
        }

        showColumnTitleContextMenu(element, event) {
            const self = this;
            $(".row-context-menu").hide();
            var $element = $(element);
            var column = null;
            if ($element.hasClass("column-title") === true) {
                column = this.getColumnInfoByName($element.data("column"));
            }
            else {
                column = this.getColumnInfoByName($element.closest(".column-title").data("column"));                
            }
            if (column == null) return;

            this.$titleContextMenu.children(`li[data-action!='${AggregatorTypes.COUNT}']`)
                .toggle(column.supportsAggregators);

            if (typeof (self.status.aggregators) == "undefined") self.status.aggregators = [];

            this.$titleContextMenu.children("li")
                .each(function() {
                    var isSelected = false;
                    var action = $(this).attr("data-action");

                    for (var i = 0; i < self.status.aggregators.length; i++) {
                        if (action == self.status.aggregators[i].type &&
                            column.name == self.status.aggregators[i].column) {
                            isSelected = true;
                            break;
                        }
                    }

                    $(this).toggleClass("bold", isSelected).data("selected", isSelected);
                });


            this.$titleContextMenu.data("column", column.name)
                .css({
                    "top": (event.pageY - self.options.$container.offset().top) + "px",
                    "left": (event.pageX - self.options.$container.offset().left) + "px"
                })
                .show();
        }

        createRowContextMenu(): void {
            var $defaultActionBtn = this.options.$container.find(".list-default-action");
            var $buttons = this.options.$container.find(".show-single, .show-multi, .show-always");

            var getMenuEntryClass = ($btn: JQuery): string => {
                return $btn.hasClass("show-always") === true
                    ? "show-always"
                    : $defaultActionBtn.hasClass("show-multi") === true ? "show-multi" : "show-single";
            }

            // No Context Menu Actions Found
            if ($defaultActionBtn.length == 0 && $buttons.length == 0) {
                this.$rowContextMenu = $("<ul></ul>");
                return;
            }

            this
                .$rowContextMenu =
                $("<ul class='row-context-menu dropdown-menu' role='menu' style='display:none'></ul>");

            // Default Action
            var extraClass = getMenuEntryClass($defaultActionBtn);

            if ($defaultActionBtn.length > 0) {
                this.$rowContextMenu.append(`<li data-target='${$defaultActionBtn
                    .attr("jb-id")}' class='default-action ${extraClass}'> \
                                    <a tabindex='-1' href='javascript:void(0)'> \
                                        <span class='${ListControlAsset.Icons.menuItem.bs}'></span> \
                                        <span>${$defaultActionBtn.find("[jb-type='Label']").text()}</span> \
                                    </a> \
                                </li>`);
            }

            // Other Actions
            for (var i = 0; i < $buttons.length; i++) {
                var $btn = $buttons.eq(i);

                if ($btn.hasClass("list-default-action") === true) continue; // already added

                extraClass = getMenuEntryClass($btn);

                this.$rowContextMenu.append(`<li data-target='${$btn.attr("jb-id")}' class='${extraClass}'> \
                                        <a tabindex='-1' href='javascript:void(0)'> \
                                            <span class='${ListControlAsset.Icons.menuItem.bs}'></span> \
                                            <span>${$btn.find("[jb-type='Label']").text()}</span> \
                                        </a> \
                                    </li>`);
            }

            this.options.$container.append(this.$rowContextMenu);
        }

        showRowContextMenu(event) {
            const self = this;

            this.$rowContextMenu.css({
                    "top": (event.pageY - self.options.$container.offset().top) + "px",
                    "left": (event.pageX - self.options.$container.offset().left) + "px"
                })
                .toggle(this.$rowContextMenu.find("li:not(.hidden)").length > 0);
        }

        applyConditionalFormattings() {
            if (this.ruleEvaluations == null || this.ruleEvaluations.length == 0) return;

            var rulesData = window[this.options.parentForm + "_" + this.elementId + "_ConditionalFormattings"];

            if (rulesData == null) {
                console.error("No c.f. Rules Data found for list!");
                return;
            }

            for (var i = 0; i < this.ruleEvaluations.length; i++) {
                var rule = this.ruleEvaluations[i];
                var state = rule.Status;
                var ruleInfo = rulesData[rule.RuleName];

                if (ruleInfo == null) {
                    console.error(`No data Rule Info found for list c.f. ${rule.RuleName}`);
                    continue;
                }

                // Row
                var $rowToApply = this.$list.find(`.list-data-row[data-key='${rule.Key}']`).eq(0);

                if (rule.ApplyToRow === true) {
                    var ruleInfoForRow = ruleInfo["forRow"];

                    if (ruleInfoForRow == null) {
                        console.error(`Row action cf data not found ${rule.RuleName}`);
                    } else {
                        var actions = state === true
                            ? ruleInfoForRow["whenTrue"]
                            : ruleInfoForRow["whenFalse"];

                        if (actions != null) {
                            window._ruleEngine.applyConditionalFormattingOnControl($rowToApply, state, actions);
                        }
                    }
                }

                // Cells
                if (rule.ApplyToColumn === true) {
                    for (let j = 0; j < rule.ColumnNames.length; j++) {
                        const columnToApply = this.options.$container
                            .find(`.column-title[data-column='${rule.ColumnNames[j]}']`);

                        if (columnToApply.length === 0) continue; // column not visible

                        const ruleInfoForColumn = ruleInfo["forColumns"][rule.ColumnNames[j]];

                        if (ruleInfoForColumn == null) {
                            console.error(`column action cf data not found ${rule.ColumnNames[j]}`);
                            continue; // column action data not found
                        }

                        var actions = state === true
                            ? ruleInfoForColumn["whenTrue"]
                            : ruleInfoForColumn["whenFalse"];

                        if (actions == null) continue; // state to do data not found

                        const index = columnToApply.index();
                        const $cellToApply = $rowToApply.children("td").eq(index);

                        window._ruleEngine.applyConditionalFormattingOnControl($cellToApply, state, actions);
                    }
                }
            }
        }

        isDataTypeNumeric(datatype) {
            const numericTypes = ["int", "long", "float", "double", "decimal"];
            return numericTypes.indexOf(datatype) > -1;
        }

        handleError(error, jqXhr, textStatus?, errorThrown?) {
            const ignoredErrorTypes = ["RESTORE_STATE"];
            if (ignoredErrorTypes.indexOf(error.type) > -1 || this.errorOccured) return;

            this.errorOccured = true;

            setTimeout(() => {
                    //todo: popup manager
                    return;
//                    window._popUpManager.createPopUp({
//                        "popUpType": "information",
//                        "title": "Server Error",
//                        "messageType": "Error",
//                        "message": error.message,
//                        "okCallBack": () => {
//                            this.errorOccured = false;
//                        }
//                    });
                },
                500);

            console.log(ListControlAsset.Errors.RESTORE_STATE, jqXhr, textStatus, errorThrown);
        }

        // Column must be rendered when is visible in options and 
        // no active 'hide-type' conditional formattings apply to it
        columnMustBeRendered(column) {
            if (this.data.ConditionalFormattings == null) return column.isVisible;

            for (let i = 0; i < this.data.ConditionalFormattings.length; i++) {
                const rule = this.data.ConditionalFormattings[i];

                if (rule.State === true &&
                    rule.ApplyToColumns.indexOf(column.name) > -1 &&
                    rule.ActionName.indexOf("_Hide_") > -1) return false;
            }

            return column.isVisible;
        }

        getExportPopUpMarkUp() {
            return `<div class='export-preferences-container'> \
            <table class='table' style='margin-bottom:0px;'>\
                <thead>\
                    <tr>\
                        <th style='vertical-align: middle'>${this.resources.ExportType}</th> \
                        <th> \
                            <select class='form-control export-type'>\
                                <option value='EXCEL'>Excel</option> \
                                <option value='WORD'>Word</option> \
                                <option value='PDF'>PDF</option> \
                            </select>\
                        </th>\
                    </tr>\
                    <tr>\
                        <th style='vertical-align: middle'>${this.resources.ExportRange}</th> \
                        <th> \
                            <select class='form-control export-range'>\
                                <option value='CURRENT'>${this.resources.ExportRangeCurrent}</option> \
                                <option value='TOP100'>${this.resources.ExportRange100}</option> \
                                <option value='ALL'>${this.resources.ExportRangeAll}</option> \
                            </select>\
                        </th>\
                    </tr>\
                    <tr> \
                        <th style='vertical-align: middle'>\
                            <span>${this.resources.FileName}</span>\
                        </th>\
                        <th>\
                            <input class='default-input form-control export-filename' type='text' value='${
                this.elementId}'> \
                        </th>\
                    </tr> \
                </thead> \
            </table>\
            <fieldset>\
            <table class='table' style='width:50%; float:left;'>\
                    <thead> \
                        <tr class='row-table-export-pop-up' data-column='export-group-data'> \
                            <th>\
                                <span>${this.resources.ExportOnlyGroups}</span>\
                            </th>\
                            <th>\
                                <input type='checkbox' class='export-only-group-data'> \
                            </th>\
                        </tr> \
                        <tr class='row-table-export-pop-up' data-column='export-PDFportrait-orientation'> \
                            <th>\
                                <span>${this.resources.PortraitOrientation}</span>\
                            </th>\
                            <th>\
                                <input type='checkbox' class='export-portrait-orientation'> \
                            </th>\
                        </tr> \
                        <tr>\
                            <th>\
                                <span>${this.resources.IncludeGridLines}</span>\
                            </th>\
                            <th>\
                                <input type='checkbox' class='export-include-grid-lines'> \
                            </th>\
                        </tr>\
                        <tr class='row-table-export-pop-up' data-column='export-total-count'>\
                            <th>\
                                <span>${this.resources.TotalNonGroupCount}</span>\
                            </th>\
                            <th>\
                                <input type='checkbox' class='export-non-group-count'> \
                            </th>\
                        </tr>\
                        <tr> \
                            <th>\
                            <span>${this.resources.DisplayColumns}</span>\
                            </th>\
                        <th style='padding:0px 0px 0px 0px; vertical-align:middle;'>\
                            <button id='disCols' jb-id='disCols' title='${this.resources.DisplayColumns
                }' type='button' class='btn btn-default btn-list-preferences' data-state='collapsed' style='padding:5px'>\
                                <span class='${ListControlAsset.Icons.prefs.bs}'></span> \
                                </button> \
                            </th>\
                        </tr> \
                    </thead>\
                </table>\
            <table class='table' style='width:50%'; float:right;>\
                <thead style='border-left: medium #DDDDDD; border-left-style: solid;'> \
                    <tr class='row-table-colors-export-pop-up' data-column='row-table-group-color'> \
                        <th>\
                            <span>${this.resources.GroupColor}</span>\
                        </th>\
                        <th style='padding:0px 0px 0px 0px; vertical-align:middle;'>\
                            <button id='group-lines-color' jb-id='group-lines-color' class="jscolor {closable:true,closeText:'OK', valueElement:null} color-picker-button" title='Select color'> \
                            </button> \
                        </th>\
                    </tr> \
                    <tr class='row-table-colors-export-pop-up' data-column='row-table-header-color'> \
                        <th>\
                            <span>${this.resources.HeaderColor}</span>\
                        </th>\
                        <th  style='padding:0px 0px 0px 0px; vertical-align:middle;'>\
                            <button id='header-line-color' jb-id='header-line-color' class="jscolor {closable:true ,closeText:'OK' , valueElement:null, value:'66ccff'} color-picker-button" title='Select color'> \
                        </th>\
                    </tr> \
                    <tr class='row-table-colors-export-pop-up' data-column='row-table-even-color'>\
                        <th>\
                            <span>${this.resources.EvenColor}</span>\
                        </th>\
                        <th  style='padding:0px 0px 0px 0px; vertical-align:middle;'>\
                            <button id='even-lines-color' jb-id='even-lines-color' class="jscolor {closable:true ,closeText:'OK', valueElement:null, value:'DBD7D0'} color-picker-button" title='Select color'> \
                        </th>\
                    </tr>\
                    <tr class='row-table-colors-export-pop-up' data-column='row-table-odd-color'> \
                        <th>\
                            <span>${this.resources.OddColor}</span>\
                        </th>\
                        <th  style='padding:0px 0px 0px 0px; vertical-align:middle;'>\
                            <button id='odd-lines-color' id='jb-odd-lines-color'  class="jscolor {closable:true ,closeText:'OK', valueElement:null, value:'D1BFDB'} color-picker-button" title='Select color'> \
                        </th>\
                    </tr> \
                    <tr class='row-table-colors-export-pop-up' data-column='row-table-aggregate-color'> \
                        <th>\
                            <span>${this.resources.AggregateColor}</span>\
                        </th>\
                        <th  style='padding:0px 0px 0px 0px; vertical-align:middle;'>\
                            <button id='aggregate-lines-color' jb-id='aggregate-lines-color' class="jscolor {closable:true,closeText:'OK', valueElement:null, value:'DBDBDB'} color-picker-button" title='Select color'> \
                        </th>\
                    </tr> \
                </thead> \
            </table>\
        </fieldset>\
        </div>`;
        }

        updateFilters($filtersTable, filterWidget?: FilterDatasourceWidget) {
            this.status.startRow = 0;
            this.status.filters = [];
            this.clearGlobalSearch(true);
            this.clearAllQuickFilters(true);

            const widget = filterWidget || this.filterWidget;

            this.status.filters = widget.getDataSourceTerms() as any;
           
            this.updateData();
        }

        updatePreferences($preferencesTable, orderWidget?: OrderDatasourceWidget) {
            this.status.startRow = 0;

            const widget = orderWidget || this.orderWidget;
            this.status.orderBy = widget.getDataSourceTerms() as any;
            this.status.columns = widget.getColumns() as any;

            this.updateData();
        }

        updateGroups(groupsArray: Array<ListGroupByInfo>, getGroupsClosed) {
            this.status.startRow = 0;
            this.status.currentPage = 1;
            this.status.groupBy = groupsArray;
            this.status.getGroupsClosed = getGroupsClosed;

            if (getGroupsClosed === true) this.openedGroups = [];

            this.updateData();
        }

        showPopUpNew(options: IListPopUpOptions) {
            window._popUpManager.destroyPopUp(options.name);

            window._popUpManager.registerPopUp({
                name: options.name,
                width: options.width || "80%",
                height: options.height || "60%",
                cancelButton: options.cancelButton || true,
                okButton: options.okButton || true,
                okCallback($container: JQuery) {
                    options.okCallback && options.okCallback($container);
                },
                title: options.title,
                cssClass: options.cssClass,
                $elementContent: options.$elementContent,
                onShowCallback: () => {
                    window["jscolor"].installByClassName("jscolor");
                }
            });

            window._popUpManager.showPopUp(options.name);
        }

        showPopUp(contents: JQuery, title: string, name: string, cb: ($el: JQuery) => void) {
            this.showPopUpNew({
                name: name,
                width: "80%",
                height: "60%",
                cancelButton: true,
                okButton:  true,
                okCallback($container: JQuery) {
                    cb && cb($container);
                },
                title: title,
                cssClass: null,
                $elementContent: contents
            });
        }

        showFiltersPopUp() {
            const self = this;
            const contents = $(`<div class='filters-pop-up'><div id="filter-preferences-popup-container"></div></div>`);
            this.filterPopUpWidget = new Widgets.FilterDatasourceWidget({
                container: $("#filter-preferences-popup-container", contents),
                resources: this.resources,
                columns: this.status.columns,
                filters: this.status.filters,
                controlName: this.elementId
            });
            this.showPopUp(contents, this.resources.FiltersPopUpTitle, "filter-preferences-popup", () => {
                const $source = $(this).closest(".collapsible-grid").find(".filters-table-body");
                self.updateFilters($source, this.filterPopUpWidget);
                this.filterWidget.redraw(this.status.filters);
            });
        }

        showGroupsPopUp() {
            const contents =
                $(`<div class='groups-pop-up'><div id="group-preferences-popup-container"></div></div>`);
            this.groupPopUpWidget = new GroupDatasourceWidget({
                container: $("#group-preferences-popup-container", contents),
                resources: this.resources,
                columns: this.status.columns,
                groupBy: this.status.groupBy,
                controlName: this.elementId
            });
            this.showPopUp(contents, this.resources.GroupingOrder, "group-preferences-popup", () => {
                const getGroupsClosed = this.$list.find(".get-groups-closed").is(":checked");
                this.updateGroups(this.groupPopUpWidget.getDataSourceTerms() as any, getGroupsClosed);
                this.groupWidget.redraw(this.status.groupBy);
            });
        }

        showPreferencesPopUp() {
            const contents = $(`<div class='preferences-pop-up'><div id="order-preferences-popup-container"></div></div>`);
            this.orderPopUpWidget = new OrderDatasourceWidget({
                container: $("#order-preferences-popup-container", contents),
                resources: this.resources,
                columns: this.status.columns,
                orderBy: this.status.orderBy,
                controlName: this.elementId
            });
            this.showPopUp(contents, this.resources.PreferencesPopUpTitle, "order-preferences-popup", ($source: JQuery) => {
                //const $source = $(e.target).closest(".collapsible-grid").find(".preferences-table-body");
                this.updatePreferences($source, this.orderPopUpWidget);
                this.orderWidget.redraw(this.status.orderBy, {columns: this.status.columns});
            });
        }
       
        showExportPopUp() {
            const $contents = $(`<div class='export-pop-up'>${this.getExportPopUpMarkUp()}${this.getExportDisplayColumns()}`);
            this.populateExportPopUpContainer($contents, false);
            var popUpOptions: IListPopUpOptions = {
                $elementContent: $contents,
                cancelButton: true,
                okButton: true,
                width: "40%",
                height: "60%",
                name: "export-list-popup",
                cssClass: "list-popup",
                title: this.resources.Export,
                okCallback: ($container: JQuery) => {
                    var type = $container.find(".export-type").val();
                    var onlyGroups = $container.find(".export-only-group-data").is(":checked") === true;
                    var range = $container.find(".export-range").val();
                    var fileName = $container.find(".export-filename").val();
                    var includeGridLines = $container.find(".export-include-grid-lines").is(":checked") === true;
                    var portraitOrientation = $container.find(".export-portrait-orientation").is(":checked") === true;
                    var nonGroupCount = $container.find(".export-non-group-count").is(":checked") === true;
                    var visibleColumnsCollection = this.populateVisibleColumns($container);
                    var groupColor = $container.find("#group-lines-color").css("background-color");
                    var headerColor = $container.find("#header-line-color").css("background-color");
                    var evenColor = $container.find("#even-lines-color").css("background-color");
                    var oddColor = $container.find("#odd-lines-color").css("background-color");
                    var aggregateColor = $container.find("#aggregate-lines-color").css("background-color");
                    var allColumnsNoVisible = visibleColumnsCollection.every(function (x) {
                        for (var i = 0; i < visibleColumnsCollection.length; i++) {
                            if (x.isVisible == true) return false;
                        }
                        return true;
                    })
                    if (allColumnsNoVisible) {
                        alert("Error - None Visible Column");
                        return;
                    }
                    if (fileName == "") {
                        alert("Error - Empty FileName");
                        return;
                    }
                    var reservedChars = /^[^\\/:\*\?"<>\|]+$/;
                    if (!reservedChars.test(fileName)) {
                        alert("Error - FileName can not contain any of the following characters \/:*?\"<>| ");
                        return;
                    }
                    var forbiddenCharIndex = /^\./;
                    if (!reservedChars.test(fileName)) {
                        alert("Error - FileName can not start with char .");
                        return;
                    }
                    this.pushToAggregatorsStatusAtExportTime($container);
                    this.export({
                        type: type,
                        range: range,
                        onlyGroups: onlyGroups,
                        fileName: fileName,
                        includeGridLines: includeGridLines,
                        portraitOrientation: portraitOrientation,
                        visibleColumnsCollection: visibleColumnsCollection,
                        groupColor: groupColor,
                        headerColor: headerColor,
                        evenColor: evenColor,
                        oddColor: oddColor,
                        aggregateColor: aggregateColor,
                        nonGroupCount: nonGroupCount,
                    });

                }
            };
            this.showPopUpNew(popUpOptions);
        }

        showImportPopUp() {
            const contents = `<div class='import-pop-up'> \
                            <button class='btn btn-default btn-csv-download'>${this.resources.DownloadCsv
                }</button> \
                            <button class='btn btn-primary btn-csv-upload'>${this.resources.UploadCsv}</button> \
                            </br>\
                            <i>${this.resources.PreferedEncoding}</i>\
                            <input class='hidden' type='file' id='csvFile' jb-id='csvFile' name='csvFile'> \
                        </div> \
                    </div>`;
            
            return;            
        }

        showSaveViewPopUp() {
            var contents = `<div class='save-view-pop-up'>\
                            <div class='save-view-container'> \
                                <table class='table'> \
                                    <thead>\
                                        <tr>\
                                            <th>${this.resources.ViewName}</th>\
                                            <th>${this.resources.IsDefault}</th>\
                                        </tr>\
                                    </thead>\
                                    <tbody> \
                                        <tr>\
                                            <td>\
                                                <input class='view-name form-control' type='text' />\
                                            </td>\
                                            <td>\
                                                <input class='view-is-default' type='checkbox' />\
                                            </td>\
                                        </tr>\
                                    </tbody> \
                                </table> \
                            </div> \
                        </div>`;

            var $container = $(contents);
            var $viewsDropDown = this.$listHeader.find(".available-views");
            var $viewName = $container.find(".view-name");
            var $isDefault = $container.find(".view-is-default");
            var selectedViewName = $viewsDropDown.val() == "PREDEFINED" ? "" : $viewsDropDown.val();

            $viewName.val(selectedViewName);

            if (this.viewsCache != null && this.viewsCache.DefaultView == selectedViewName && selectedViewName.length > 0) {
                $isDefault.prop("checked", true);
            }

            this.showPopUpNew({
                $elementContent: $container,                
                height: "200px",
                width: "500px",
                name: "ListExport",
                title: this.resources.SaveCurrentView,
                okCallback: () => {
                    var viewName = $viewName.val().trim();
                    var overwrite = false;

                    if (viewName.length == 0) {
                        alert(this.resources.SaveCurrentViewNameAlert);
                        return;
                    }

                    if ($viewsDropDown.find(`[value='${viewName}']`).length > 0) {
                        var ok = confirm(this.resources.OverwriteCurrentView);

                        if (ok === false) return;
                        overwrite = true;
                    }

                    this.viewsCache = null;

                    if (overwrite === false) {
                        $viewsDropDown.append(`<option value='${viewName}'>${viewName}</option>`);
                    }

                    $viewsDropDown.val(viewName);
                    this.status.currentView = viewName;
                    this.saveViewToProfile(viewName, $isDefault.is(":checked") === true);
                },
            });     

            window.setTimeout(function () {
                $viewName.focus();
            }, 500);
        }

        showDeleteViewPopUp() {
            var contents = `<div class='delete-view-pop-up'>\
                            <div class='delete-view-container'> \
                                <table class='table'> \
                                    <thead>\
                                        <tr>\
                                             <th>${this.resources.ViewName}</th>\
                                            <th>${this.resources.IsDefault}</th>\
                                        </tr>\
                                    </thead>\
                                    <tbody> \
                                        <tr>\
                                            <td>\
                                                <input class='view-name form-control disabled' type='text' disabled='disabled' />\
                                            </td>\
                                            <td>\
                                                <input class='view-is-default disabled' type='checkbox' disabled='disabled' />\
                                            </td>\
                                        </tr>\
                                    </tbody> \
                                </table> \
                            </div> \
                        </div>`;

            var $container = $(contents);

            var $viewsDropDown = this.$listHeader.find(".available-views");
            var $viewName = $container.find(".view-name");
            var $isDefault = $container.find(".view-is-default");
            var selectedViewName = $viewsDropDown.val() == "PREDEFINED" ? "" : $viewsDropDown.val();

            $viewName.val(selectedViewName);
            
            if (this.viewsCache != null && this.viewsCache.DefaultView == selectedViewName && selectedViewName.length > 0) {
                $isDefault.prop("checked", true);
            }
                             
            this.showPopUpNew({
                $elementContent: $container,
                height: "200px",
                width: "500px",
                name: "ListExport",
                title: this.resources.DeleteCurrentView,
                okCallback: () => {
                    this.deleteViewFromProfile(selectedViewName);
                },
            });     
        }
    }
}