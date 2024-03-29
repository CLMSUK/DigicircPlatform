namespace Joove {
    export enum DataSourceTypes {
        None = 0,
        MANUAL = 1,
        BUSINESSOBJECT = 2,
        WEBSERVICE = 4,
        VIEWMODEL = 8,
        WORKITEM = 16
    }

    export enum FilterOperators {
        NONE,
        EQUAL_TO,
        NOT_EQUAL_TO,
        LESS_THAN,
        GREATER_THAN,
        LESS_THAN_OR_EQUAL_TO,
        GREATER_THAN_OR_EQUAL_TO,
        LIKE,
        RANGE,
        HAS_VALUE,
        HAS_NO_VALUE
    }

    export enum RowOperators {
        NONE,
        AND,
        OR
    }

    export enum OrderByDirections {
        ASC,
        DESC,
        NONE
    }

    export enum AggregatorTypes {
        SUM,
        AVERAGE,
        COUNT
    }

    export enum GroupState {
        EXPANDED,
        COLLAPSED
    }

    export type ViewModelCollection = System.Linq.IOrderedEnumerable<any> | System.Linq.LinqEnumerable<any>;

    export interface IViewModelDatasetResult<T> {
        Data: Array<T>;
        TotalRows: number;
        Groups: any;
        RuleEvaluations: any,
    }

    export abstract class IViewModelDataset<T> {
        binding: string;
        context: string;
        limit: number;

        abstract Filter(inputs: any): (element: T, index: number, items: Array<T>) => boolean;
        abstract Sort(items: ViewModelCollection): ViewModelCollection;
        abstract PackInputs($control: JQuery): any;

        constructor(protected model, protected partialViewControlName:string = null) {
            this.limit = 0;
        }

        GetSource(parents: number[]): Joove.ViewModelCollection {
            return null;
        }

        GetContext($control: JQuery): any {
            try {
                return Joove.Core.GetOptions($control, "joove-dataset-indexes");
            } catch (e) {
                return {};
            }

        }

        Retrieve(inputs: any, requestInfo: DatasourceRequest, aggregatorsInfo: Array<any>, context: any): IViewModelDatasetResult<T> {            
            let sortBy = this.GetOrderBy(requestInfo);
            let filterBy = this.GetFilterBy(inputs, requestInfo);

            let options = sortBy(System.Linq.Enumerable.from(this.GetSource(context))
                .where(filterBy))
                .where(this.ExcludeKeys(requestInfo.excludeKeys))
                .toArray();

            let items = []
            if (requestInfo.startRow == 0 && requestInfo.pageSize == -1) {
                items = options.toArray();
            } else {
                items = options.linq.skip(requestInfo.startRow).take(requestInfo.pageSize).toArray();
            }

            if (aggregatorsInfo.length <= 0) {
                return {
                    Data: items,
                    TotalRows: options.length,
                    Groups: this.GroupBy(options, requestInfo),
                    RuleEvaluations: null,
                };
            } else {
                return this.GroupBy(options, requestInfo, aggregatorsInfo);
            }
        }

        ChartMapper(x: string, y: Array<string>, title: Array<string>, r: Array<string> = null) {        
            return (item) => {
                return {
                    Item: item,
                    Radius: (r != null) ? r.map(name => item[name]) : [],
                    Label: item[x],
                    Values: y.map(name => item[name]),
                    ValueLabels: title
                }
            };
        }

        ChartMapperAggregation(x: string, y: Array<string>, labels?, dynamic = true) {
            let valueLabels = null;

            return (item) => {
                const group = {
                    Item: item,
                    Label: item.KeyFormatted,
                    Radius: [],
                    Values: [],
                    ValueLabels: valueLabels || [] 
                };

                if (dynamic) {
                    item.SubGroups.forEach((subGroup) => {
                        if (subGroup.Aggregates.length > 0) {
                            group.ValueLabels.push(subGroup.KeyFormatted);
                            subGroup.Aggregates.forEach((col, index) => {
                                if (index == 0) {
                                    group.Values[group.ValueLabels.indexOf(subGroup.KeyFormatted)] = col.Value;
                                } else {
                                    group.Radius[group.ValueLabels.indexOf(subGroup.KeyFormatted)] = col.Value;
                                }

                            });
                        }
                    });
                } else {
                    item.Aggregates.forEach((col) => {
                        group.Values.push(col.Value);
                        group.ValueLabels.push(labels[col.Column.toLowerCase()]);
                    });
                }

                if (valueLabels == null) {
                    valueLabels = group.ValueLabels;
                }

                return group;
            };
        }

        private GetOrderBy(requestInfo: DatasourceRequest): any {
            let sortBy = this.Sort;

            if (requestInfo.orderBy && requestInfo.orderBy.length > 0) {
                const name = requestInfo.orderBy[0].column.name;
                const direction = requestInfo.orderBy[0].direction;

                sortBy = (items: ViewModelCollection) => {
                    return (direction == 0) ? items.orderByDescending(i => i[name]) : items.orderBy(i => i[name]);
                };
            }

            return sortBy;
        }

        private ExcludeKeys(keys) {
            return (DataItem, index, items) => {
                return keys == null || keys.indexOf(DataItem._key) == -1; 
            };
        }

        private GetFilterBy(inputs: any, requestInfo: DatasourceRequest): any {
            let filterBy = this.Filter(inputs) as any;

            if (requestInfo.filters && requestInfo.filters.length > 0) {
                let q = [];

                for (let i = 0; i < requestInfo.filters.length; i++) {
                    const filter = requestInfo.filters[i];

                    const name = filter.column.name;
                    const operator = filter.operator;
                    const value = filter.value;

                    switch (operator) {
                        case FilterOperators.EQUAL_TO:
                            q.push(`DataItem.${name} === '${value}'`);
                            break;
                        case FilterOperators.LIKE:
                            q.push(`String(DataItem.${name}).includes('${value}')`);
                            break;
                        default:
                            break;
                    }

                }

                const datasetFilterBy = filterBy;
                const qs = q.join(` || `);
                filterBy = (DataItem, index, items) => {
                    return datasetFilterBy(DataItem, index, items) && eval(qs);
                };
            }

            return filterBy;
        }

        private GroupBy(items: Array<T>, requestInfo: DatasourceRequest, aggregatorsInfo: Array<any> = []): any {
            if (!requestInfo.groupBy || requestInfo.groupBy.length <= 0) {
                if (aggregatorsInfo.length > 0) {
                    return aggregatorsInfo.map(info => this.CalculateAggregation(items, info));
                } else {
                    return null;
                }
            }

            const root = this.GetGroup("", "ROOT", new GroupByInfo(new ColumnInfo("ROOT", "object", null), 0, 0, 0));
            root.SubGroups = this.RetrieveGroup(items, root, requestInfo.groupBy, "", 0, aggregatorsInfo);

            if (aggregatorsInfo.length > 0) {
                root.Aggregates = aggregatorsInfo.map(info => this.CalculateAggregation(items, info));

                return {
                    Data: null,
                    TotalRows: 0,
                    Groups: root,
                    RuleEvaluations: null,
                };
            } else {
                return root;
            }
        }

        private RetrieveGroup(items: Array<T>, root: any, groupBys: Array<GroupByInfo>, prefix: string, index: number, aggregatorsInfo: Array<any> = []) {
            const groupBy = groupBys[index];
            const name = groupBy.column.name;
            index++;
            root.SubGroups = items.linq
                .groupBy(c => c[name])
                .select(i => {
                    const groupKey = `${name}/---/${String(i.key).replace(' ', '___')}`;
                    const group = this.GetGroup(`${prefix}___${groupKey}`, i.key, groupBy);
                    if (index < groupBys.length) {
                        group.SubGroups = this.RetrieveGroup(i.source.toArray(), group, groupBys, groupKey, index, aggregatorsInfo);
                    } else {
                        group.UniqueItemKeys = i.source.linq.select(c => c.Id).toArray();
                    }
                    group.Aggregates = aggregatorsInfo.map(info => this.CalculateAggregation(i.source.toArray(), info));
                    group.Items = i.source.toArray();
                    return group;
                }).toArray();

            return root.SubGroups;
        }

        private GetGroup(id: string, key: string, group: GroupByInfo): any {
            return {
                Aggregates: [],
                Column: {
                    Formatting: group.column.formatting,
                    IsEncrypted: group.column.isEncrypted,
                    MambaDataType: group.column.mambaDataType,
                    Name: group.column.name,
                },
                Identifier: id,
                Key: key,
                KeyFormatted: key,
                StateType: 0,
                SubGroups: [],
                UniqueItemKeys: null
            }
        }

        private CalculateAggregation(items: Array<T>, aggregatorsInfo: any) {
            const result = {
                Column: aggregatorsInfo.column,
                Type: String(aggregatorsInfo.type),
                Value: null,
                ValueFormatted: null
            };

            let mapper = function recursiveParsePath(obj) {
                var parts = result.Column.split('.');
                for (var i = 0; i < parts.length; i++) {
                    if (obj == null) 
                        return null;
                    obj = obj[parts[i]];
                }
                return obj;
            }
            
            if (aggregatorsInfo.type == AggregatorTypes.COUNT) {
                mapper = c => 1;
            }

            result.Value = items
                .map(mapper)
                .linq
                .aggregate((c1, c2) => c1 + c2);

            if (aggregatorsInfo.type == AggregatorTypes.AVERAGE) {
                result.Value = result.Value / items.length;
            }

            if (aggregatorsInfo.formatting != null) {
                var valueFormat = new ValueFormat(aggregatorsInfo.formatting as any);
                result.ValueFormatted = valueFormat.format(result.Value);
            } else {
                result.ValueFormatted = String(result.Value);
            }
            
            return result;
        }
    }

    export class ColumnInfo {
        name: string;
        mambaDataType: string;
        formatting: ValueFormat;
        searchable: boolean;
        groupable: boolean;
        isEncrypted: boolean;
        caption: string;
        dataType;

        isVisible;
        orderable;
        width;
        minWidth;
        customWidth;
        supportsAggregators;

        constructor(name: string, dt: string, formatting?: ValueFormat, searchable?: boolean, isEncrypted: boolean = false) {
            this.name = name;
            this.mambaDataType = dt;
            this.formatting = formatting;
            this.searchable = searchable || true;
            this.caption = name;
            this.dataType = dt;
            this.isEncrypted = isEncrypted;
        }

        getMambaDataType (): MambaDataType {
            const localType = this.mambaDataType;
            return Common.getMambaDataType(localType);
        }
    };

    export class FilterInfo {
        column: ColumnInfo;
        value: any;
        rowOperator: RowOperators;
        operator: FilterOperators; // FilterOperator
        secondValue: any;

        constructor (columnInfo: ColumnInfo, value: any, rowOp: RowOperators, op: FilterOperators, secondValue: any) {
            this.column = columnInfo;
            this.value = value;
            this.rowOperator = rowOp;
            this.operator = op;
            this.secondValue = secondValue;
        }
    }

    export class OrderByInfo {
        column: ColumnInfo;
        direction: OrderByDirections;

        constructor (columnInfo: ColumnInfo, direction: OrderByDirections) {
            this.column = columnInfo;
            this.direction = direction;
        }
    }

    export class GroupByInfo {
        column: ColumnInfo;
        state;
        inactive;
        getGroupsClosed;

        constructor (columnInfo: ColumnInfo, state, inactive, getGroupsClosed) {
            this.column = columnInfo;
            this.state = state;
            this.inactive = inactive;
            this.getGroupsClosed = getGroupsClosed;
        }
    }

    export class DatasourceRequest {
        startRow;
        pageSize: number;
        filters;
        orderBy: Array<OrderByInfo>;
        excludeKeys;
        groupBy: Array<GroupByInfo>;
        indexes: any[];
        aggregators;
        DtoProperties: Array<string>;

        constructor ($control: JQuery,
            startRow,
            pageSize: number,
            filters?,
            orderBy?: Array<OrderByInfo>,
            excludeKeys?,
            groupBy?: Array<GroupByInfo>) {
            this.startRow = startRow;
            this.pageSize = pageSize;
            this.filters = filters;
            this.orderBy = orderBy;
            this.excludeKeys = excludeKeys;
            this.groupBy = groupBy;
            this.indexes = Common.getIndexesOfControl($control).indexes;
        }

        setExludeKeys (excludeKeys) {
            this.excludeKeys = excludeKeys;
        }
    }

    export interface IDataSourceControlScope extends IJooveScope {
        $sortBy: (e: Event, member: string) => void;
        $clearFilters: (e: Event) => void;
        $applyFilters: (e: Event) => void;
        $addFilter: (e: Event,
            columnName: string,
            filterOp: string,
            rowOp: string,
            overwriteExisting: boolean,
            autoApply: boolean) => void;
        $globalFilter: (e: Event, autoApply: boolean) => void;
    }

    export interface IDatasoureCallbacks {
        success?: Function;
        error?: Function;
        complete?: Function;
        onStart?: Function;
        onFinish?: Function;
    }

    export class DatasourceManager {
        private static _throttle = 500;
        private static _queue = {};

        private static _partialControlNames: Array<{ JQuery, string}>

        public static makeAsyncRequests: boolean = false;

        static getFetchViewModelDatasetClientSideHandler($control: JQuery, forMasterPage: boolean, call: boolean): any {
            const datasetName = DatasourceManager.getDataSetNameFromControl($control);
            const parentPartialViewName = Core.getPartialOwnerControl($control);

            if (parentPartialViewName != null) {
                if (call == true) {
                    const partialControlName = $control.closest(`div[jb-partial-name='${parentPartialViewName}']`).attr("jb-id");                    
                    return Joove.Common.getScope().datasets[parentPartialViewName][datasetName](partialControlName);
                }
                return Joove.Common.getScope().datasets[parentPartialViewName][datasetName];
            } else {
                if (call == true) {
                    return Joove.Common.getScope().datasets[datasetName]();
                }
                return Joove.Common.getScope().datasets[datasetName];
            }
        }

        static couldUseFetchViewModelDataseClientSideHandler($control: JQuery, forMasterPage: boolean): boolean {
            return DatasourceManager.getFetchViewModelDatasetClientSideHandler($control, forMasterPage, false) != null;
        }
        
        static fetchItemFromViewModelDataset<T>($control: JQuery, key: any, forMasterPage: boolean): T {
            try {
                return DatasourceManager.fetchItemsFromViewModelDataset<T>($control, [key], forMasterPage).linq.firstOrDefault();
            } catch (ex) {
                return null;
            }
        }

        static fetchItemsFromViewModelDataset<T>($control: JQuery, keys: Array<any>, forMasterPage: boolean): Array<T> {
            try {
                const handler = DatasourceManager.getFetchViewModelDatasetClientSideHandler($control, forMasterPage, true);
                return handler.GetSource().linq.where(it => keys.indexOf(it._key) !== -1).toArray();
            } catch (ex) {
                return null;
            }
        }

        static fetchViewModelDataset($control: JQuery, forMasterPage: boolean, request: DatasourceRequest, aggregatorsInfo: Array<any>): Array<any> {
            try {
                const handler = DatasourceManager.getFetchViewModelDatasetClientSideHandler($control, forMasterPage, true);
                const inputs = handler.PackInputs($control);
                const context = Common.getIndexesOfControl($control).indexes;

                if ($control.attr("jb-type") == "Chart") {
                    const parentPartialViewName = Core.getPartialOwnerControl($control);
                    if (parentPartialViewName == null) {
                        return handler[`${$control.attr("jb-id")}Retrieve`](inputs, request, aggregatorsInfo, context);
                    } else {
                        return handler[`${Core.getPartialViewControlOriginalName($control)}Retrieve`](inputs, request, aggregatorsInfo, context);        
                    }
                } else {
                    return handler.Retrieve(inputs, request, aggregatorsInfo, context); 
                }
            }
            catch (ex) {
                console.error("Could not fetch VM DataSet", ex);
                return [];
            }
        }

        static parseStringToFilterOperator (str: string): FilterOperators {
            if (str === "EQUAL_TO") return FilterOperators.EQUAL_TO;
            if (str === "NOT_EQUAL_TO") return FilterOperators.NOT_EQUAL_TO;
            if (str === "LESS_THAN") return FilterOperators.LESS_THAN;
            if (str === "GREATER_THAN") return FilterOperators.GREATER_THAN;
            if (str === "LESS_THAN_OR_EQUAL_TO") return FilterOperators.LESS_THAN_OR_EQUAL_TO;
            if (str === "GREATER_THAN_OR_EQUAL_TO") return FilterOperators.GREATER_THAN_OR_EQUAL_TO;
            if (str === "LIKE") return FilterOperators.LIKE;
            if (str === "RANGE") return FilterOperators.RANGE;
            if (str === "HAS_VALUE") return FilterOperators.HAS_VALUE;
            if (str === "HAS_NO_VALUE") return FilterOperators.HAS_NO_VALUE;
            if (str === "NONE") return FilterOperators.NONE;

            console.error(`Could not parse string to Filter Operator! ->${str}`);

            return FilterOperators.NONE;
        }

        static parseStringToRowOperator (str: string): RowOperators {
            if (str === "NONE") return RowOperators.NONE;
            if (str === "AND") return RowOperators.AND;
            if (str === "OR") return RowOperators.OR;

            console.error(`Could not parse string to Row Operator! ->${str}`);

            return RowOperators.NONE;
        }

        static parseStringToOrderByDirection (str: string): OrderByDirections {
            if (str === "NONE") return OrderByDirections.NONE;
            if (str === "DESC") return OrderByDirections.DESC;
            if (str === "ASC") return OrderByDirections.ASC;

            console.error(`Could not parse string to Order By Direction! ->${str}`);

            return OrderByDirections.NONE;
        }

        static getDataSetColumnInfo (dsName: string): Array<ColumnInfo> {
            return window[dsName + "_ColumnInfo"];
        }

        static getDataSetColumnInfoFromControl ($el: JQuery): Array<ColumnInfo> {
            return this.getDataSetColumnInfo(this.getDataSetNameFromControl($el));
        }

        static getDatasetType($el: JQuery): Joove.DataSourceTypes {
            return parseInt($el.attr("joove-dateset-type")) as any;
        }
 
        static getDataSetNameFromControl ($el: JQuery): string {
            return $el.attr("joove-dataset");
        }

        static getDtoTypeFromControl ($el: JQuery): string {
            return $el.attr("jb-dto");
        }

        static getControlsUsingDataSet (ds: string): JQuery {
            return $(`.jb-control[joove-dataset='${ds}']`);
        }

        static getOnStartFetchDatasetActionForControl ($el: JQuery, masterPage?: boolean): () => void {
            const actionName = $el.attr("joove-on-start-fetch-dataset");
            if (actionName == null) {
                return null;
            }
            return Common.getAction(actionName, masterPage) as () => void;
        }

        static getOnFinishFetchDatasetActionForControl ($el: JQuery, masterPage?: boolean): (items: Array<any>) => void {
            const actionName = $el.attr("joove-on-finish-fetch-dataset");
            if (actionName == null) {
                return null;
            }
            return Common.getAction(actionName, masterPage) as (items: Array<any>) => void;
        }

        static getSelectedItems ($el: JQuery, e: Event): Array<any> {
            if ($el.length > 1 && e != null) {
                const id = $el.eq(0).attr("jb-id");

                const $parentRow = Common.getContextItemElement($(e.target));
                $el = $parentRow.find($(`[jb-id='${id}']`)).eq(0);
            }

            const scope = Common.getDirectiveScope($el);

            return Array.isArray(scope.selectedItems)
                ? scope.selectedItems
                : [scope.selectedItems];
        }

        static getSelectedItem ($el: JQuery, e: Event): any {
            const items = DatasourceManager.getSelectedItems($el, e);
            return items.length === 0 ? null : items[0];
        }

        static GetOnChangeHandler ($element: JQuery): Function {
            const parentPartialViewName = Core.getPartialOwnerControl($element);
            
            let ngMaster = $element.attr("ng-master");
            let calledFromMaster = ngMaster && ngMaster.toString() && ngMaster.toString().toLowerCase() == "true"
            
            let formScope = ngMaster ? Common.getMasterScope() : Common.getScope();
            
            const scopeEventCallbacks = formScope["eventCallbacks"];
            
            if (scopeEventCallbacks == null) return null;

            if (parentPartialViewName == null) {
                const id = $element.attr("jb-id");
                return scopeEventCallbacks[`${id}OnChange`];
            } else {
                const id = Joove.Core.getPartialViewControlOriginalName($element);
                return scopeEventCallbacks[`${parentPartialViewName}`][`${id}OnChange`]; 
            }         
        }

        static HasOnChangeHandler ($element: JQuery): boolean {
            return DatasourceManager.GetOnChangeHandler($element) != null;
        }

        static invokeOnChangeHandler ($element: JQuery) {
            const onChangeMethod = DatasourceManager.GetOnChangeHandler($element);

            if (onChangeMethod == null || $element.hasClass("jb-disabled")) return;

            var evt = Common.createEvent("onchange");

            Object.defineProperty(evt, "target", { value: $element.get(0) });

            var parents = Common.getContextFromElement($element);

            setTimeout(() => {
                    onChangeMethod(evt, null, parents);
                }, 500);
        }

        static isMambaDataTypeNumber (dataType: string): boolean {
            const numericTypes = ["int", "long", "float", "double", "decimal"];
            return numericTypes.indexOf(dataType) > -1;
        }

        static getDatasetControlInputs($control: JQuery): any {
            const parents = Joove.Common.getContextOfControl($control);
            var inputExpressions = Joove.Core.GetOptions($control, "joove-dataset-inputs");

            const inputs = {};

            var code = "";
            for (let p in parents) {
                code += "var " + p + " = parents['" + p + "'];";
            }
            for (let inp in inputExpressions) {
                code += "try { inputs['" + inp + "'] = " + inputExpressions[inp] + "; } catch (_e) { inputs['" + inp + "'] = null ;}";
            }
            eval(code);

            return inputs;
        }

        static addToQueue (url: string,
            postData: any,
            callbacks: IDatasoureCallbacks): void {
            const key = DatasourceManager.getQueueKey(url, postData, callbacks);

            const existing = DatasourceManager._queue[key];

            if (existing != null) {
                DatasourceManager._queue[key].callbacks.push(callbacks);
            } else {
                DatasourceManager._queue[key] = {
                    postData: postData,
                    url: url,
                    callbacks: callbacks == null ? [] : [callbacks]
                };
            }
        }

        static removeFromQueue (url: string,
            postData: any,
            callbacks: Array<IDatasoureCallbacks>): void {
            const key = DatasourceManager.getQueueKey(url, postData, callbacks);

            delete DatasourceManager._queue[key];
        }

        static getFromQueue (url: string,
            postData: any,
            callbacks: IDatasoureCallbacks): any {

            const key = DatasourceManager.getQueueKey(url, postData, callbacks);

            return DatasourceManager._queue[key];
        }

        static getQueueKey (url: string,
            postData: any,
            callbacks: IDatasoureCallbacks | Array<IDatasoureCallbacks>): string {
            return `${url}_${Common.serializeIndexes(postData.datasourceRequest.indexes)}`;
        }

        static requestForSameControlIsInQueue (url: string,
            postData: any,
            callbacks: IDatasoureCallbacks): any {
            const key = DatasourceManager.getQueueKey(url, postData, callbacks);

            return DatasourceManager._queue[key] != null;
        }

        static makeDatasourceRequest (url: string, postData: any, controlName: string, callbacks: IDatasoureCallbacks): void {
            if (postData.datasourceRequest.indexes == null) {
                console.warn("Got null indexes for ds request. Aborting...");
                return;
            }

            // Append current controller action parameter to query string
            url += url.indexOf("?") > -1 ? "&" : "?";
            url += Core.currentControllerActionParamName + "=" + window._context.currentAction;
            url += "&" + Core.isModalParamName + "=" + window._context.isModal;

            const requestForSameControlExists = DatasourceManager.requestForSameControlIsInQueue(url, postData, callbacks);
            
            if (DatasourceManager.makeAsyncRequests === true) {
                if (requestForSameControlExists) return;  

                var callbacksArg = callbacks == null ? [] : [callbacks];

                callbacks.onStart && callbacks.onStart(postData);
                DatasourceManager.callBackEnd(url, postData, controlName, callbacksArg);
            }
            else {
                DatasourceManager.addToQueue(url, postData, callbacks);

                if (requestForSameControlExists) return;                

                setTimeout(() => {
                    var request = DatasourceManager.getFromQueue(url, postData, callbacks);
                    callbacks.onStart && callbacks.onStart(postData);
                    DatasourceManager.callBackEnd(request.url, request.postData, controlName, request.callbacks);
                }, DatasourceManager._throttle);
            }            
        }

        static callBackEnd (url: string,
            postData: any,
            controlName: string,
            callbacks: Array<IDatasoureCallbacks>): void {            
            Ajax.ajax({
                url: url,
                method: "POST",
                data: postData,
                doInBackground: DatasourceManager.makeAsyncRequests === true,
                success: data => {
                    var deserializedData = (Common.modelToJson(data.Data)) as any;

                    Cycles.reconstructObject(deserializedData);

                    for (let i = 0; i < callbacks.length; i++) {
                        if (callbacks[i].success) callbacks[i].success(deserializedData);
                        if (callbacks[i].onFinish) callbacks[i].onFinish(deserializedData.Data);
                    }

                    DatasourceManager.updateTotalRowValues(controlName, deserializedData);
                    DeveloperApi.onDatasourceRequestCompleted(controlName, deserializedData, postData);
                    
                    window._ruleEngine.applyDataSetRulesResult(deserializedData.RuleEvaluations);
                },
                error: (jqXhr, textStatus, errorThrown) => {
                    Core.handleError(jqXhr);

                    for (let i = 0; i < callbacks.length; i++) {
                        if (callbacks[i].error) callbacks[i].error(jqXhr, textStatus, errorThrown);
                    }
                },
                complete: data => {
                    for (let i = 0; i < callbacks.length; i++) {
                        if (callbacks[i].complete) callbacks[i].complete(data);
                    }

                    if (DatasourceManager.makeAsyncRequests === true) return;

                    DatasourceManager.removeFromQueue(url, postData, callbacks);
                }
            });
        }

        static updateTotalRowValues(controlName: string, data: any) {
            const value = data == null ? 0 : data.TotalRows;
            const $control = $("[jb-id='" + controlName + "']");
            const dsName = DatasourceManager.getDataSetNameFromControl($control);

            if (dsName == null || dsName.trim() == "") return;

            const propertyName = "$" + dsName + "_TotalRows";

            window.$form[propertyName] = value;
        }

        static fetchDatasourceForJsApi(options: {            
            dsName: string,
            pageSize: number,
            startRow: number,
            fields: Array<string>,
            filters: Array<FilterInfo>,
            ordering: Array<OrderByInfo>,
            grouping: Array<GroupByInfo>,
            done: Function,
            forMaster: boolean,
            error?: Function,
            complete?: Function
        }) {
            const controller = options.forMaster === true
                ? window._context.currentMasterPageController
                : window._context.currentController;
            const url = `${window._context.siteRoot}${controller}/${controller}_${options.dsName}_Datasource`;

            var $body = $("[jb-type='Body']");
            var requestInfo = new DatasourceRequest($body, options.startRow, options.pageSize);

            requestInfo.DtoProperties = options.fields;
            requestInfo.filters = options.filters;
            requestInfo.orderBy = options.ordering;
            requestInfo.groupBy = options.grouping;

            const postData = {
                'model': window.$form.model,
                'datasourceRequest': requestInfo,
                'aggregatorsRequest': DatasourceManager.getAggregatorsRequest(requestInfo)
            };

            var callbacks: IDatasoureCallbacks = {};

            callbacks.success = (data) => {
                options.done && options.done(data);
            }

            callbacks.error = (data) => {
                options.error && options.error(data);
            }

            callbacks.complete = (data) => {
                options.complete && options.complete(data);
            }

            DatasourceManager.makeDatasourceRequest(url, postData, options.dsName, callbacks);
        }

        static NO_VALUE: string = "NO_VALUE";

        static fetch($control: JQuery,
            controlName: string,
            requestInfo: DatasourceRequest,
            callbacks: IDatasoureCallbacks,
            aggregatorsInfo: Array<any>,
            forMasterPage?: boolean) {

            const type = DatasourceManager.getDatasetType($control);

            switch (type) {
                case Joove.DataSourceTypes.None:
                    break;
                case Joove.DataSourceTypes.MANUAL:
                    const serverSideElementId = Core.getElementName($control);
                    let args: Array<any> = [serverSideElementId, forMasterPage, requestInfo, aggregatorsInfo];
                    DatasourceManager.invokeClientSideDatasource(DatasourceManager.fetchManualDatasource, args, callbacks);
                    break;
                case Joove.DataSourceTypes.VIEWMODEL:
                    args = [$control, forMasterPage, requestInfo || new DatasourceRequest($control, 0, -1), aggregatorsInfo];
                    DatasourceManager.invokeClientSideDatasource(DatasourceManager.fetchViewModelDataset, args, callbacks);
                    break;
                case Joove.DataSourceTypes.WEBSERVICE:
                case Joove.DataSourceTypes.BUSINESSOBJECT:
                case Joove.DataSourceTypes.WORKITEM:
                default:
                    if (aggregatorsInfo.length <= 0) {
                        DatasourceManager.fetchDatasource(
                            $control,
                            controlName,
                            requestInfo,
                            callbacks,
                            forMasterPage
                        );
                    } else {
                        DatasourceManager.fetchDatasourceAggregators(
                            $control,
                            controlName,
                            requestInfo,
                            aggregatorsInfo,
                            callbacks,
                            forMasterPage
                        );
                    }

                    break;
            }

        }

        static invokeClientSideDatasource(func: Function, args: Array<any>, callbacks: IDatasoureCallbacks) {
            let options = func(...args);
            callbacks.onStart && callbacks.onStart();
            callbacks.success(options);
            callbacks.onFinish && callbacks.onFinish(options);
        }

        static fetchManualDatasource(serverSideElementId: string, forMaster?: boolean): any {
            let dataContainerVariableName = `dataFor${serverSideElementId}`;

            if (forMaster === true) {
                dataContainerVariableName += "Master";
            }

            const items = window[dataContainerVariableName];

            return {
                Data: items,
                TotalRows: items.length,
                Groups: null,
                RuleEvaluations: null,
            };
        }

        static fetchDatasource ($control: JQuery,
            controlName: string,
            requestInfo: DatasourceRequest,
            callbacks: IDatasoureCallbacks,
            forMasterPage?): void {

            if ($control.attr("jb-type") === "DropDownBox") {
                const dropDownScope = Common.getDirectiveScope($control);
                
                if (dropDownScope.requestInitialValueOnly === true) {
                    var value = DatasourceManager.getInitialValue($control, controlName, callbacks);

                    if (value != DatasourceManager.NO_VALUE) {
                        return;
                    }                    
                }                
            }

            const targetController = Core.getControllerForElement($control, forMasterPage);

            const projectionScema = window[Joove.Core.getElementName($control) + "_ProjectionScema"];
            const rootModel = Core.getRootModelForControl($control, forMasterPage);

            const postData = {
                'model': projectionScema == null ? rootModel : Common.project(rootModel, projectionScema),
                'datasourceRequest': requestInfo || new DatasourceRequest($control, 0, 99999),
                'aggregatorsRequest': DatasourceManager.getAggregatorsRequest(requestInfo)
            };

            Joove.Logger.debug(`fetchDatasource(${controlName})`, postData); 

            const url = `${window._context.siteRoot}${targetController}/${controlName}_Datasource`;

            callbacks.onStart = DatasourceManager.getOnStartFetchDatasetActionForControl($control, forMasterPage) || (() => { });
            callbacks.onFinish = DatasourceManager.getOnFinishFetchDatasetActionForControl($control, forMasterPage) ||
                ((items: Array<any>) => { });

            DatasourceManager.makeDatasourceRequest(url, postData, controlName, callbacks);
        }

        static getAggregatorsRequest (requestInfo: DatasourceRequest) {
            if (requestInfo == null) 
                return null;

            if (requestInfo.aggregators == null)
                return null;
            
            return JSON.parse(JSON.stringify(requestInfo.aggregators));
        }

        static fetchDatasourceAggregators ($control,
            controlName: string,
            requestInfo: DatasourceRequest,
            aggregatorsInfo: any,
            callbacks: IDatasoureCallbacks,
            forMasterPage?): void {
            const targetController = Core.getControllerForElement($control, forMasterPage);

            const postData = {
                'model': Core.getRootModelForControl($control, forMasterPage),
                'datasourceRequest': requestInfo || new DatasourceRequest($control, 0, 99999),
                'aggregatorsRequest': JSON.parse(JSON.stringify(aggregatorsInfo || []))
            };

            const url = window._context.siteRoot + targetController + "/" + controlName + "_DatasourceAggregators";

            DatasourceManager.makeDatasourceRequest(url, postData, controlName, callbacks);
        }

        static updateSelectedKeysInModel (controlName: string,
            keys: any,
            allRecordsSelected: boolean,
            indexes: any,
            forMasterPage?: any): void {
            const model = forMasterPage === true
                ? Common.getMasterModel()
                : Common.getModel();

            const indexesSerialized = Common.serializeIndexes(indexes);
            const selectedKeysVarName = controlName + "SelectedItemKeys";
            let keysEntryFoundInModel = false;
            const keyValueToSet = {
                Indexes: indexesSerialized,
                SelectedItems: keys,
                FullRecordsetSelected: allRecordsSelected
            };
            if (model[selectedKeysVarName] == null) {
                model[selectedKeysVarName] = [];
            }
            // update entry if found
            for (let i = 0; i < model[selectedKeysVarName].length; i++) {
                if (model[selectedKeysVarName][i].Indexes === indexesSerialized) {
                    model[selectedKeysVarName][i] = keyValueToSet;
                    keysEntryFoundInModel = true;
                    break;
                }
            }
            // if corresponding index is not found, push new entry
            if (keysEntryFoundInModel === false) {
                model[selectedKeysVarName].push(keyValueToSet);
            }
        }

        static requestSelectedItemsfromServer (controlName: string,
            $control: JQuery,
            itemsDataType: string,
            requestFullRecordset: boolean,
            selectedKeys: any,
            keysToExclude: any,
            datasourceRequest: any,
            cb: Function,
            fromMasterPage?: any): void {

            const targetController = Core.getControllerForElement($control, fromMasterPage);
            //const dt = DatasourceManager.getDataSetNameFromControl($control) + "_" + itemsDataType

            const dt = DatasourceManager.getDtoTypeFromControl($control); // + "_" + itemsDataType

            if (requestFullRecordset) {
                keysToExclude = keysToExclude || [];

                const postData = {
                    'model': Core.getRootModelForControl($control, fromMasterPage),
                    'dataType': dt,
                    'keys': keysToExclude.join(),
                    'indexes': Common.getIndexesOfControl($control).key,
                    'datasourceRequest': datasourceRequest || new DatasourceRequest($control, 0, 99999) //This is added to apply possible filters in the dataset
                };

                Core.executeControllerActionNew({
                    controller: targetController,
                    action: controlName + "_GetFullRecordset",
                    verb: "POST",
                    queryData: [],
                    postData: postData,
                    cb: data => {
                        cb(Common.modelToJson(data));
                    }
                });
            } else {
				var controlJBID = $control.attr("jb-id");
                Core.executeControllerActionNew({
                    controller: targetController,
                    action: "UpdateInstance",
                    verb: "POST",
                    queryData: [],
                    postData: {
                        keys: selectedKeys.join(),
                        dataType: dt, 
						jbID: controlJBID
                    },
                    cb: data => {
                        cb(Common.modelToJson(data));
                    }
                });

            }
        }

        static getKeys (collection: any): Array<any> {
            if (collection == null) return [];

            const keys = [];
            let key: string;

            if (collection.constructor === Array) {
                for (let i = 0; i < collection.length; i++) {
                    key = DatasourceManager.getObjectKey(collection[i]);

                    if (Common.keyHasDefaultValue(key) === true) continue;

                    keys.push(key);
                }
            }
            else {
                key = DatasourceManager.getObjectKey(collection);

                if (Common.keyHasDefaultValue(key) === false) {
                    keys.push(key);
                }
            }

            return keys;
        }

        static getObjectKey (obj: any): string {
            return Common.valueIsObject(obj)
                ? obj._key
                : obj;
        }

        static watchDependencies (formScope: IJooveScope,
            $element: JQuery,
            cb: Function,
            dependenciesAttribute?: string): any {
            dependenciesAttribute = dependenciesAttribute || "data-dependencies";
            const dependencies = $element.attr(dependenciesAttribute);

            if (dependencies == null || dependencies.trim() === "") return;

            const dependencyPaths = dependencies.trim().split(";");

            for (let i = 0; i < dependencyPaths.length; i++) {
                let currentPath = dependencyPaths[i];
                let dependecyScope: angular.IScope;

                if (currentPath.indexOf("$context") === 0) {
                    const contextItemName = currentPath.split(".")[1];

                    const $contextControl = $element.closest(`[data-context-item='${contextItemName}']`);

                    dependecyScope = angular.element($contextControl).scope(); // todo: this is slow. find another way
                    currentPath = currentPath.replace("$context.", "");
                } else {
                    dependecyScope = formScope;
                }

                if (currentPath.indexOf("[]") === -1) {
                    dependecyScope.$watch(currentPath,
                        (newValue, oldValue) => {
                            if (Common.objectsAreEqual(newValue, oldValue)) return;

                            cb && cb(newValue);
                        });
                } else {
                    dependecyScope.$watchCollection(currentPath.replace("[]", ""),
                        (newValue, oldValue) => {
                            if (Common.objectsAreEqual(newValue, oldValue)) return;

                            cb && cb(newValue);
                        });
                }
            }
        }

        static getInitialValueModelPath(controlName: string, $control: JQuery): string {
            const parentPartialName = Core.getPartialOwnerControlElementId($control);
            return parentPartialName == null
                ? `${controlName}__InitialSelection`
                : `${parentPartialName}${controlName}__InitialSelection`
        }

        static getInitialValueFromModel(controlName: string, $control: JQuery) {
            return Common.getModel()[DatasourceManager.getInitialValueModelPath(controlName, $control)];
        }

        static isInitialSelectionAvailable (controlName: string, $control: JQuery) {
            const preselectedData = DatasourceManager.getInitialValueFromModel(controlName, $control);
            return typeof (preselectedData) !== "undefined";
        };

        static removeInitialValue(controlName: string, $control: JQuery): void {
            delete Common.getModel()[DatasourceManager.getInitialValueModelPath(controlName, $control)];
        }

        static getInitialValue ($control: JQuery,
            controlName: string,
            callbacks: IDatasoureCallbacks): any {
            const indexes = Common.getIndexesOfControl($control);
            let indexesSerialized = indexes.key;

            if (indexesSerialized === "") {
                indexesSerialized = "_";
            }

            const preselectedData = DatasourceManager.getInitialValueFromModel(controlName, $control);

            const invokeCallback = data => {
                var dropDownScope = Common.getDirectiveScope($control);

                dropDownScope.requestInitialValueOnly = false;
                dropDownScope.refreshDataFromServerOnFocus = true;

                if (callbacks.success) callbacks.success({ Data: data });
            };

            if (preselectedData == null) {
                console.log("No preselected data found for " + controlName);
                return DatasourceManager.NO_VALUE;
            }

            let dataForThisIndex = null;

            for (let i = 0; i < preselectedData.length; i++) {
                const current = preselectedData[i];

                if (current.Indexes === indexesSerialized) {
                    dataForThisIndex = current.SelectedItems;
                    break;
                }
            }

            if (dataForThisIndex == null) {
                console.log("No preselected data found for " + controlName + " at indexes: " + indexes.key);                
                return DatasourceManager.NO_VALUE;
            }


            invokeCallback(dataForThisIndex);
            return dataForThisIndex;
        }

        static addFilterToDataSet = (dsName: string,
            e: Event,
            columnName: string,
            filterOp: string,
            rowOp: string,
            overwriteExisting: boolean,
            autoApply: boolean) => {
            var $controls = DatasourceManager.getControlsUsingDataSet(dsName);

            for (let i = 0; i < $controls.length; i++) {
                const $current = $controls.eq(i);
                const directive: IDataSourceControlScope = Common.getDirectiveScope($current);

                if (directive == null) continue;

                const addFilterMethod = directive.$addFilter;

                if (addFilterMethod == null) continue;

                directive.$addFilter(e, columnName, filterOp, rowOp, overwriteExisting, autoApply);
            }
        };

        static addGlobalFilterToDataSet = (dsName: string, e: Event, autoApply: boolean) => {
            var $controls = DatasourceManager.getControlsUsingDataSet(dsName);

            for (let i = 0; i < $controls.length; i++) {
                const $current = $controls.eq(i);
                const directive: IDataSourceControlScope = Common.getDirectiveScope($current);

                if (directive == null) continue;

                const addFilterMethod = directive.$globalFilter;

                if (addFilterMethod == null) continue;

                directive.$globalFilter(e, autoApply);
            }
        };

        static sortControlsBoundToDataSet (ds: string, member: string, e: Event) {
            const $controls = DatasourceManager.getControlsUsingDataSet(ds);

            for (let i = 0; i < $controls.length; i++) {
                const $control = $controls.eq(i);
                const directiveScope: IDataSourceControlScope = Common.getDirectiveScope($control);

                if (directiveScope == null || directiveScope.$sortBy == null) continue;

                directiveScope.$sortBy(e, member);
            }
        }

        static applyFiltersToControlsBoundToDataSet (ds: string, e: Event) {
            const $controls = DatasourceManager.getControlsUsingDataSet(ds);

            for (let i = 0; i < $controls.length; i++) {
                const $control = $controls.eq(i);
                const directiveScope: IDataSourceControlScope = Common.getDirectiveScope($control);

                if (directiveScope == null || directiveScope.$applyFilters == null) continue;

                directiveScope.$applyFilters(e);
            }
        }

        static clearFiltersToControlsBoundToDataSet (ds: string, e: Event) {
            const $controls = DatasourceManager.getControlsUsingDataSet(ds);

            for (let i = 0; i < $controls.length; i++) {
                const $control = $controls.eq(i);
                const directiveScope: IDataSourceControlScope = Common.getDirectiveScope($control);

                if (directiveScope == null || directiveScope.$clearFilters == null) continue;

                directiveScope.$clearFilters(e);
            }
        }			            
    }
}