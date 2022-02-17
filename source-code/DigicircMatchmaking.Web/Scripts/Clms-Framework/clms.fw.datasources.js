var Joove;
(function (Joove) {
    var DataSourceTypes;
    (function (DataSourceTypes) {
        DataSourceTypes[DataSourceTypes["None"] = 0] = "None";
        DataSourceTypes[DataSourceTypes["MANUAL"] = 1] = "MANUAL";
        DataSourceTypes[DataSourceTypes["BUSINESSOBJECT"] = 2] = "BUSINESSOBJECT";
        DataSourceTypes[DataSourceTypes["WEBSERVICE"] = 4] = "WEBSERVICE";
        DataSourceTypes[DataSourceTypes["VIEWMODEL"] = 8] = "VIEWMODEL";
        DataSourceTypes[DataSourceTypes["WORKITEM"] = 16] = "WORKITEM";
    })(DataSourceTypes = Joove.DataSourceTypes || (Joove.DataSourceTypes = {}));
    var FilterOperators;
    (function (FilterOperators) {
        FilterOperators[FilterOperators["NONE"] = 0] = "NONE";
        FilterOperators[FilterOperators["EQUAL_TO"] = 1] = "EQUAL_TO";
        FilterOperators[FilterOperators["NOT_EQUAL_TO"] = 2] = "NOT_EQUAL_TO";
        FilterOperators[FilterOperators["LESS_THAN"] = 3] = "LESS_THAN";
        FilterOperators[FilterOperators["GREATER_THAN"] = 4] = "GREATER_THAN";
        FilterOperators[FilterOperators["LESS_THAN_OR_EQUAL_TO"] = 5] = "LESS_THAN_OR_EQUAL_TO";
        FilterOperators[FilterOperators["GREATER_THAN_OR_EQUAL_TO"] = 6] = "GREATER_THAN_OR_EQUAL_TO";
        FilterOperators[FilterOperators["LIKE"] = 7] = "LIKE";
        FilterOperators[FilterOperators["RANGE"] = 8] = "RANGE";
        FilterOperators[FilterOperators["HAS_VALUE"] = 9] = "HAS_VALUE";
        FilterOperators[FilterOperators["HAS_NO_VALUE"] = 10] = "HAS_NO_VALUE";
    })(FilterOperators = Joove.FilterOperators || (Joove.FilterOperators = {}));
    var RowOperators;
    (function (RowOperators) {
        RowOperators[RowOperators["NONE"] = 0] = "NONE";
        RowOperators[RowOperators["AND"] = 1] = "AND";
        RowOperators[RowOperators["OR"] = 2] = "OR";
    })(RowOperators = Joove.RowOperators || (Joove.RowOperators = {}));
    var OrderByDirections;
    (function (OrderByDirections) {
        OrderByDirections[OrderByDirections["ASC"] = 0] = "ASC";
        OrderByDirections[OrderByDirections["DESC"] = 1] = "DESC";
        OrderByDirections[OrderByDirections["NONE"] = 2] = "NONE";
    })(OrderByDirections = Joove.OrderByDirections || (Joove.OrderByDirections = {}));
    var AggregatorTypes;
    (function (AggregatorTypes) {
        AggregatorTypes[AggregatorTypes["SUM"] = 0] = "SUM";
        AggregatorTypes[AggregatorTypes["AVERAGE"] = 1] = "AVERAGE";
        AggregatorTypes[AggregatorTypes["COUNT"] = 2] = "COUNT";
    })(AggregatorTypes = Joove.AggregatorTypes || (Joove.AggregatorTypes = {}));
    var GroupState;
    (function (GroupState) {
        GroupState[GroupState["EXPANDED"] = 0] = "EXPANDED";
        GroupState[GroupState["COLLAPSED"] = 1] = "COLLAPSED";
    })(GroupState = Joove.GroupState || (Joove.GroupState = {}));
    var IViewModelDataset = /** @class */ (function () {
        function IViewModelDataset(model, partialViewControlName) {
            if (partialViewControlName === void 0) { partialViewControlName = null; }
            this.model = model;
            this.partialViewControlName = partialViewControlName;
            this.limit = 0;
        }
        IViewModelDataset.prototype.GetSource = function (parents) {
            return null;
        };
        IViewModelDataset.prototype.GetContext = function ($control) {
            try {
                return Joove.Core.GetOptions($control, "joove-dataset-indexes");
            }
            catch (e) {
                return {};
            }
        };
        IViewModelDataset.prototype.Retrieve = function (inputs, requestInfo, aggregatorsInfo, context) {
            var sortBy = this.GetOrderBy(requestInfo);
            var filterBy = this.GetFilterBy(inputs, requestInfo);
            var options = sortBy(System.Linq.Enumerable.from(this.GetSource(context))
                .where(filterBy))
                .where(this.ExcludeKeys(requestInfo.excludeKeys))
                .toArray();
            var items = [];
            if (requestInfo.startRow == 0 && requestInfo.pageSize == -1) {
                items = options.toArray();
            }
            else {
                items = options.linq.skip(requestInfo.startRow).take(requestInfo.pageSize).toArray();
            }
            if (aggregatorsInfo.length <= 0) {
                return {
                    Data: items,
                    TotalRows: options.length,
                    Groups: this.GroupBy(options, requestInfo),
                    RuleEvaluations: null,
                };
            }
            else {
                return this.GroupBy(options, requestInfo, aggregatorsInfo);
            }
        };
        IViewModelDataset.prototype.ChartMapper = function (x, y, title, r) {
            if (r === void 0) { r = null; }
            return function (item) {
                return {
                    Item: item,
                    Radius: (r != null) ? r.map(function (name) { return item[name]; }) : [],
                    Label: item[x],
                    Values: y.map(function (name) { return item[name]; }),
                    ValueLabels: title
                };
            };
        };
        IViewModelDataset.prototype.ChartMapperAggregation = function (x, y, labels, dynamic) {
            if (dynamic === void 0) { dynamic = true; }
            var valueLabels = null;
            return function (item) {
                var group = {
                    Item: item,
                    Label: item.KeyFormatted,
                    Radius: [],
                    Values: [],
                    ValueLabels: valueLabels || []
                };
                if (dynamic) {
                    item.SubGroups.forEach(function (subGroup) {
                        if (subGroup.Aggregates.length > 0) {
                            group.ValueLabels.push(subGroup.KeyFormatted);
                            subGroup.Aggregates.forEach(function (col, index) {
                                if (index == 0) {
                                    group.Values[group.ValueLabels.indexOf(subGroup.KeyFormatted)] = col.Value;
                                }
                                else {
                                    group.Radius[group.ValueLabels.indexOf(subGroup.KeyFormatted)] = col.Value;
                                }
                            });
                        }
                    });
                }
                else {
                    item.Aggregates.forEach(function (col) {
                        group.Values.push(col.Value);
                        group.ValueLabels.push(labels[col.Column.toLowerCase()]);
                    });
                }
                if (valueLabels == null) {
                    valueLabels = group.ValueLabels;
                }
                return group;
            };
        };
        IViewModelDataset.prototype.GetOrderBy = function (requestInfo) {
            var sortBy = this.Sort;
            if (requestInfo.orderBy && requestInfo.orderBy.length > 0) {
                var name_1 = requestInfo.orderBy[0].column.name;
                var direction_1 = requestInfo.orderBy[0].direction;
                sortBy = function (items) {
                    return (direction_1 == 0) ? items.orderByDescending(function (i) { return i[name_1]; }) : items.orderBy(function (i) { return i[name_1]; });
                };
            }
            return sortBy;
        };
        IViewModelDataset.prototype.ExcludeKeys = function (keys) {
            return function (DataItem, index, items) {
                return keys == null || keys.indexOf(DataItem._key) == -1;
            };
        };
        IViewModelDataset.prototype.GetFilterBy = function (inputs, requestInfo) {
            var filterBy = this.Filter(inputs);
            if (requestInfo.filters && requestInfo.filters.length > 0) {
                var q = [];
                for (var i = 0; i < requestInfo.filters.length; i++) {
                    var filter = requestInfo.filters[i];
                    var name_2 = filter.column.name;
                    var operator = filter.operator;
                    var value = filter.value;
                    switch (operator) {
                        case FilterOperators.EQUAL_TO:
                            q.push("DataItem." + name_2 + " === '" + value + "'");
                            break;
                        case FilterOperators.LIKE:
                            q.push("String(DataItem." + name_2 + ").includes('" + value + "')");
                            break;
                        default:
                            break;
                    }
                }
                var datasetFilterBy_1 = filterBy;
                var qs_1 = q.join(" || ");
                filterBy = function (DataItem, index, items) {
                    return datasetFilterBy_1(DataItem, index, items) && eval(qs_1);
                };
            }
            return filterBy;
        };
        IViewModelDataset.prototype.GroupBy = function (items, requestInfo, aggregatorsInfo) {
            var _this = this;
            if (aggregatorsInfo === void 0) { aggregatorsInfo = []; }
            if (!requestInfo.groupBy || requestInfo.groupBy.length <= 0) {
                if (aggregatorsInfo.length > 0) {
                    return aggregatorsInfo.map(function (info) { return _this.CalculateAggregation(items, info); });
                }
                else {
                    return null;
                }
            }
            var root = this.GetGroup("", "ROOT", new GroupByInfo(new ColumnInfo("ROOT", "object", null), 0, 0, 0));
            root.SubGroups = this.RetrieveGroup(items, root, requestInfo.groupBy, "", 0, aggregatorsInfo);
            if (aggregatorsInfo.length > 0) {
                root.Aggregates = aggregatorsInfo.map(function (info) { return _this.CalculateAggregation(items, info); });
                return {
                    Data: null,
                    TotalRows: 0,
                    Groups: root,
                    RuleEvaluations: null,
                };
            }
            else {
                return root;
            }
        };
        IViewModelDataset.prototype.RetrieveGroup = function (items, root, groupBys, prefix, index, aggregatorsInfo) {
            var _this = this;
            if (aggregatorsInfo === void 0) { aggregatorsInfo = []; }
            var groupBy = groupBys[index];
            var name = groupBy.column.name;
            index++;
            root.SubGroups = items.linq
                .groupBy(function (c) { return c[name]; })
                .select(function (i) {
                var groupKey = name + "/---/" + String(i.key).replace(' ', '___');
                var group = _this.GetGroup(prefix + "___" + groupKey, i.key, groupBy);
                if (index < groupBys.length) {
                    group.SubGroups = _this.RetrieveGroup(i.source.toArray(), group, groupBys, groupKey, index, aggregatorsInfo);
                }
                else {
                    group.UniqueItemKeys = i.source.linq.select(function (c) { return c.Id; }).toArray();
                }
                group.Aggregates = aggregatorsInfo.map(function (info) { return _this.CalculateAggregation(i.source.toArray(), info); });
                group.Items = i.source.toArray();
                return group;
            }).toArray();
            return root.SubGroups;
        };
        IViewModelDataset.prototype.GetGroup = function (id, key, group) {
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
            };
        };
        IViewModelDataset.prototype.CalculateAggregation = function (items, aggregatorsInfo) {
            var result = {
                Column: aggregatorsInfo.column,
                Type: String(aggregatorsInfo.type),
                Value: null,
                ValueFormatted: null
            };
            var mapper = function recursiveParsePath(obj) {
                var parts = result.Column.split('.');
                for (var i = 0; i < parts.length; i++) {
                    if (obj == null)
                        return null;
                    obj = obj[parts[i]];
                }
                return obj;
            };
            if (aggregatorsInfo.type == AggregatorTypes.COUNT) {
                mapper = function (c) { return 1; };
            }
            result.Value = items
                .map(mapper)
                .linq
                .aggregate(function (c1, c2) { return c1 + c2; });
            if (aggregatorsInfo.type == AggregatorTypes.AVERAGE) {
                result.Value = result.Value / items.length;
            }
            if (aggregatorsInfo.formatting != null) {
                var valueFormat = new Joove.ValueFormat(aggregatorsInfo.formatting);
                result.ValueFormatted = valueFormat.format(result.Value);
            }
            else {
                result.ValueFormatted = String(result.Value);
            }
            return result;
        };
        return IViewModelDataset;
    }());
    Joove.IViewModelDataset = IViewModelDataset;
    var ColumnInfo = /** @class */ (function () {
        function ColumnInfo(name, dt, formatting, searchable, isEncrypted) {
            if (isEncrypted === void 0) { isEncrypted = false; }
            this.name = name;
            this.mambaDataType = dt;
            this.formatting = formatting;
            this.searchable = searchable || true;
            this.caption = name;
            this.dataType = dt;
            this.isEncrypted = isEncrypted;
        }
        ColumnInfo.prototype.getMambaDataType = function () {
            var localType = this.mambaDataType;
            return Joove.Common.getMambaDataType(localType);
        };
        return ColumnInfo;
    }());
    Joove.ColumnInfo = ColumnInfo;
    ;
    var FilterInfo = /** @class */ (function () {
        function FilterInfo(columnInfo, value, rowOp, op, secondValue) {
            this.column = columnInfo;
            this.value = value;
            this.rowOperator = rowOp;
            this.operator = op;
            this.secondValue = secondValue;
        }
        return FilterInfo;
    }());
    Joove.FilterInfo = FilterInfo;
    var OrderByInfo = /** @class */ (function () {
        function OrderByInfo(columnInfo, direction) {
            this.column = columnInfo;
            this.direction = direction;
        }
        return OrderByInfo;
    }());
    Joove.OrderByInfo = OrderByInfo;
    var GroupByInfo = /** @class */ (function () {
        function GroupByInfo(columnInfo, state, inactive, getGroupsClosed) {
            this.column = columnInfo;
            this.state = state;
            this.inactive = inactive;
            this.getGroupsClosed = getGroupsClosed;
        }
        return GroupByInfo;
    }());
    Joove.GroupByInfo = GroupByInfo;
    var DatasourceRequest = /** @class */ (function () {
        function DatasourceRequest($control, startRow, pageSize, filters, orderBy, excludeKeys, groupBy) {
            this.startRow = startRow;
            this.pageSize = pageSize;
            this.filters = filters;
            this.orderBy = orderBy;
            this.excludeKeys = excludeKeys;
            this.groupBy = groupBy;
            this.indexes = Joove.Common.getIndexesOfControl($control).indexes;
        }
        DatasourceRequest.prototype.setExludeKeys = function (excludeKeys) {
            this.excludeKeys = excludeKeys;
        };
        return DatasourceRequest;
    }());
    Joove.DatasourceRequest = DatasourceRequest;
    var DatasourceManager = /** @class */ (function () {
        function DatasourceManager() {
        }
        DatasourceManager.getFetchViewModelDatasetClientSideHandler = function ($control, forMasterPage, call) {
            var datasetName = DatasourceManager.getDataSetNameFromControl($control);
            var parentPartialViewName = Joove.Core.getPartialOwnerControl($control);
            if (parentPartialViewName != null) {
                if (call == true) {
                    var partialControlName = $control.closest("div[jb-partial-name='" + parentPartialViewName + "']").attr("jb-id");
                    return Joove.Common.getScope().datasets[parentPartialViewName][datasetName](partialControlName);
                }
                return Joove.Common.getScope().datasets[parentPartialViewName][datasetName];
            }
            else {
                if (call == true) {
                    return Joove.Common.getScope().datasets[datasetName]();
                }
                return Joove.Common.getScope().datasets[datasetName];
            }
        };
        DatasourceManager.couldUseFetchViewModelDataseClientSideHandler = function ($control, forMasterPage) {
            return DatasourceManager.getFetchViewModelDatasetClientSideHandler($control, forMasterPage, false) != null;
        };
        DatasourceManager.fetchItemFromViewModelDataset = function ($control, key, forMasterPage) {
            try {
                return DatasourceManager.fetchItemsFromViewModelDataset($control, [key], forMasterPage).linq.firstOrDefault();
            }
            catch (ex) {
                return null;
            }
        };
        DatasourceManager.fetchItemsFromViewModelDataset = function ($control, keys, forMasterPage) {
            try {
                var handler = DatasourceManager.getFetchViewModelDatasetClientSideHandler($control, forMasterPage, true);
                return handler.GetSource().linq.where(function (it) { return keys.indexOf(it._key) !== -1; }).toArray();
            }
            catch (ex) {
                return null;
            }
        };
        DatasourceManager.fetchViewModelDataset = function ($control, forMasterPage, request, aggregatorsInfo) {
            try {
                var handler = DatasourceManager.getFetchViewModelDatasetClientSideHandler($control, forMasterPage, true);
                var inputs = handler.PackInputs($control);
                var context = Joove.Common.getIndexesOfControl($control).indexes;
                if ($control.attr("jb-type") == "Chart") {
                    var parentPartialViewName = Joove.Core.getPartialOwnerControl($control);
                    if (parentPartialViewName == null) {
                        return handler[$control.attr("jb-id") + "Retrieve"](inputs, request, aggregatorsInfo, context);
                    }
                    else {
                        return handler[Joove.Core.getPartialViewControlOriginalName($control) + "Retrieve"](inputs, request, aggregatorsInfo, context);
                    }
                }
                else {
                    return handler.Retrieve(inputs, request, aggregatorsInfo, context);
                }
            }
            catch (ex) {
                console.error("Could not fetch VM DataSet", ex);
                return [];
            }
        };
        DatasourceManager.parseStringToFilterOperator = function (str) {
            if (str === "EQUAL_TO")
                return FilterOperators.EQUAL_TO;
            if (str === "NOT_EQUAL_TO")
                return FilterOperators.NOT_EQUAL_TO;
            if (str === "LESS_THAN")
                return FilterOperators.LESS_THAN;
            if (str === "GREATER_THAN")
                return FilterOperators.GREATER_THAN;
            if (str === "LESS_THAN_OR_EQUAL_TO")
                return FilterOperators.LESS_THAN_OR_EQUAL_TO;
            if (str === "GREATER_THAN_OR_EQUAL_TO")
                return FilterOperators.GREATER_THAN_OR_EQUAL_TO;
            if (str === "LIKE")
                return FilterOperators.LIKE;
            if (str === "RANGE")
                return FilterOperators.RANGE;
            if (str === "HAS_VALUE")
                return FilterOperators.HAS_VALUE;
            if (str === "HAS_NO_VALUE")
                return FilterOperators.HAS_NO_VALUE;
            if (str === "NONE")
                return FilterOperators.NONE;
            console.error("Could not parse string to Filter Operator! ->" + str);
            return FilterOperators.NONE;
        };
        DatasourceManager.parseStringToRowOperator = function (str) {
            if (str === "NONE")
                return RowOperators.NONE;
            if (str === "AND")
                return RowOperators.AND;
            if (str === "OR")
                return RowOperators.OR;
            console.error("Could not parse string to Row Operator! ->" + str);
            return RowOperators.NONE;
        };
        DatasourceManager.parseStringToOrderByDirection = function (str) {
            if (str === "NONE")
                return OrderByDirections.NONE;
            if (str === "DESC")
                return OrderByDirections.DESC;
            if (str === "ASC")
                return OrderByDirections.ASC;
            console.error("Could not parse string to Order By Direction! ->" + str);
            return OrderByDirections.NONE;
        };
        DatasourceManager.getDataSetColumnInfo = function (dsName) {
            return window[dsName + "_ColumnInfo"];
        };
        DatasourceManager.getDataSetColumnInfoFromControl = function ($el) {
            return this.getDataSetColumnInfo(this.getDataSetNameFromControl($el));
        };
        DatasourceManager.getDatasetType = function ($el) {
            return parseInt($el.attr("joove-dateset-type"));
        };
        DatasourceManager.getDataSetNameFromControl = function ($el) {
            return $el.attr("joove-dataset");
        };
        DatasourceManager.getDtoTypeFromControl = function ($el) {
            return $el.attr("jb-dto");
        };
        DatasourceManager.getControlsUsingDataSet = function (ds) {
            return $(".jb-control[joove-dataset='" + ds + "']");
        };
        DatasourceManager.getOnStartFetchDatasetActionForControl = function ($el, masterPage) {
            var actionName = $el.attr("joove-on-start-fetch-dataset");
            if (actionName == null) {
                return null;
            }
            return Joove.Common.getAction(actionName, masterPage);
        };
        DatasourceManager.getOnFinishFetchDatasetActionForControl = function ($el, masterPage) {
            var actionName = $el.attr("joove-on-finish-fetch-dataset");
            if (actionName == null) {
                return null;
            }
            return Joove.Common.getAction(actionName, masterPage);
        };
        DatasourceManager.getSelectedItems = function ($el, e) {
            if ($el.length > 1 && e != null) {
                var id = $el.eq(0).attr("jb-id");
                var $parentRow = Joove.Common.getContextItemElement($(e.target));
                $el = $parentRow.find($("[jb-id='" + id + "']")).eq(0);
            }
            var scope = Joove.Common.getDirectiveScope($el);
            return Array.isArray(scope.selectedItems)
                ? scope.selectedItems
                : [scope.selectedItems];
        };
        DatasourceManager.getSelectedItem = function ($el, e) {
            var items = DatasourceManager.getSelectedItems($el, e);
            return items.length === 0 ? null : items[0];
        };
        DatasourceManager.GetOnChangeHandler = function ($element) {
            var parentPartialViewName = Joove.Core.getPartialOwnerControl($element);
            var ngMaster = $element.attr("ng-master");
            var calledFromMaster = ngMaster && ngMaster.toString() && ngMaster.toString().toLowerCase() == "true";
            var formScope = ngMaster ? Joove.Common.getMasterScope() : Joove.Common.getScope();
            var scopeEventCallbacks = formScope["eventCallbacks"];
            if (scopeEventCallbacks == null)
                return null;
            if (parentPartialViewName == null) {
                var id = $element.attr("jb-id");
                return scopeEventCallbacks[id + "OnChange"];
            }
            else {
                var id = Joove.Core.getPartialViewControlOriginalName($element);
                return scopeEventCallbacks["" + parentPartialViewName][id + "OnChange"];
            }
        };
        DatasourceManager.HasOnChangeHandler = function ($element) {
            return DatasourceManager.GetOnChangeHandler($element) != null;
        };
        DatasourceManager.invokeOnChangeHandler = function ($element) {
            var onChangeMethod = DatasourceManager.GetOnChangeHandler($element);
            if (onChangeMethod == null || $element.hasClass("jb-disabled"))
                return;
            var evt = Joove.Common.createEvent("onchange");
            Object.defineProperty(evt, "target", { value: $element.get(0) });
            var parents = Joove.Common.getContextFromElement($element);
            setTimeout(function () {
                onChangeMethod(evt, null, parents);
            }, 500);
        };
        DatasourceManager.isMambaDataTypeNumber = function (dataType) {
            var numericTypes = ["int", "long", "float", "double", "decimal"];
            return numericTypes.indexOf(dataType) > -1;
        };
        DatasourceManager.getDatasetControlInputs = function ($control) {
            var parents = Joove.Common.getContextOfControl($control);
            var inputExpressions = Joove.Core.GetOptions($control, "joove-dataset-inputs");
            var inputs = {};
            var code = "";
            for (var p in parents) {
                code += "var " + p + " = parents['" + p + "'];";
            }
            for (var inp in inputExpressions) {
                code += "try { inputs['" + inp + "'] = " + inputExpressions[inp] + "; } catch (_e) { inputs['" + inp + "'] = null ;}";
            }
            eval(code);
            return inputs;
        };
        DatasourceManager.addToQueue = function (url, postData, callbacks) {
            var key = DatasourceManager.getQueueKey(url, postData, callbacks);
            var existing = DatasourceManager._queue[key];
            if (existing != null) {
                DatasourceManager._queue[key].callbacks.push(callbacks);
            }
            else {
                DatasourceManager._queue[key] = {
                    postData: postData,
                    url: url,
                    callbacks: callbacks == null ? [] : [callbacks]
                };
            }
        };
        DatasourceManager.removeFromQueue = function (url, postData, callbacks) {
            var key = DatasourceManager.getQueueKey(url, postData, callbacks);
            delete DatasourceManager._queue[key];
        };
        DatasourceManager.getFromQueue = function (url, postData, callbacks) {
            var key = DatasourceManager.getQueueKey(url, postData, callbacks);
            return DatasourceManager._queue[key];
        };
        DatasourceManager.getQueueKey = function (url, postData, callbacks) {
            return url + "_" + Joove.Common.serializeIndexes(postData.datasourceRequest.indexes);
        };
        DatasourceManager.requestForSameControlIsInQueue = function (url, postData, callbacks) {
            var key = DatasourceManager.getQueueKey(url, postData, callbacks);
            return DatasourceManager._queue[key] != null;
        };
        DatasourceManager.makeDatasourceRequest = function (url, postData, controlName, callbacks) {
            if (postData.datasourceRequest.indexes == null) {
                console.warn("Got null indexes for ds request. Aborting...");
                return;
            }
            // Append current controller action parameter to query string
            url += url.indexOf("?") > -1 ? "&" : "?";
            url += Joove.Core.currentControllerActionParamName + "=" + window._context.currentAction;
            url += "&" + Joove.Core.isModalParamName + "=" + window._context.isModal;
            var requestForSameControlExists = DatasourceManager.requestForSameControlIsInQueue(url, postData, callbacks);
            if (DatasourceManager.makeAsyncRequests === true) {
                if (requestForSameControlExists)
                    return;
                var callbacksArg = callbacks == null ? [] : [callbacks];
                callbacks.onStart && callbacks.onStart(postData);
                DatasourceManager.callBackEnd(url, postData, controlName, callbacksArg);
            }
            else {
                DatasourceManager.addToQueue(url, postData, callbacks);
                if (requestForSameControlExists)
                    return;
                setTimeout(function () {
                    var request = DatasourceManager.getFromQueue(url, postData, callbacks);
                    callbacks.onStart && callbacks.onStart(postData);
                    DatasourceManager.callBackEnd(request.url, request.postData, controlName, request.callbacks);
                }, DatasourceManager._throttle);
            }
        };
        DatasourceManager.callBackEnd = function (url, postData, controlName, callbacks) {
            Joove.Ajax.ajax({
                url: url,
                method: "POST",
                data: postData,
                doInBackground: DatasourceManager.makeAsyncRequests === true,
                success: function (data) {
                    var deserializedData = (Joove.Common.modelToJson(data.Data));
                    Joove.Cycles.reconstructObject(deserializedData);
                    for (var i = 0; i < callbacks.length; i++) {
                        if (callbacks[i].success)
                            callbacks[i].success(deserializedData);
                        if (callbacks[i].onFinish)
                            callbacks[i].onFinish(deserializedData.Data);
                    }
                    DatasourceManager.updateTotalRowValues(controlName, deserializedData);
                    Joove.DeveloperApi.onDatasourceRequestCompleted(controlName, deserializedData, postData);
                    window._ruleEngine.applyDataSetRulesResult(deserializedData.RuleEvaluations);
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    Joove.Core.handleError(jqXhr);
                    for (var i = 0; i < callbacks.length; i++) {
                        if (callbacks[i].error)
                            callbacks[i].error(jqXhr, textStatus, errorThrown);
                    }
                },
                complete: function (data) {
                    for (var i = 0; i < callbacks.length; i++) {
                        if (callbacks[i].complete)
                            callbacks[i].complete(data);
                    }
                    if (DatasourceManager.makeAsyncRequests === true)
                        return;
                    DatasourceManager.removeFromQueue(url, postData, callbacks);
                }
            });
        };
        DatasourceManager.updateTotalRowValues = function (controlName, data) {
            var value = data == null ? 0 : data.TotalRows;
            var $control = $("[jb-id='" + controlName + "']");
            var dsName = DatasourceManager.getDataSetNameFromControl($control);
            if (dsName == null || dsName.trim() == "")
                return;
            var propertyName = "$" + dsName + "_TotalRows";
            window.$form[propertyName] = value;
        };
        DatasourceManager.fetchDatasourceForJsApi = function (options) {
            var controller = options.forMaster === true
                ? window._context.currentMasterPageController
                : window._context.currentController;
            var url = "" + window._context.siteRoot + controller + "/" + controller + "_" + options.dsName + "_Datasource";
            var $body = $("[jb-type='Body']");
            var requestInfo = new DatasourceRequest($body, options.startRow, options.pageSize);
            requestInfo.DtoProperties = options.fields;
            requestInfo.filters = options.filters;
            requestInfo.orderBy = options.ordering;
            requestInfo.groupBy = options.grouping;
            var postData = {
                'model': window.$form.model,
                'datasourceRequest': requestInfo,
                'aggregatorsRequest': DatasourceManager.getAggregatorsRequest(requestInfo)
            };
            var callbacks = {};
            callbacks.success = function (data) {
                options.done && options.done(data);
            };
            callbacks.error = function (data) {
                options.error && options.error(data);
            };
            callbacks.complete = function (data) {
                options.complete && options.complete(data);
            };
            DatasourceManager.makeDatasourceRequest(url, postData, options.dsName, callbacks);
        };
        DatasourceManager.fetch = function ($control, controlName, requestInfo, callbacks, aggregatorsInfo, forMasterPage) {
            var type = DatasourceManager.getDatasetType($control);
            switch (type) {
                case Joove.DataSourceTypes.None:
                    break;
                case Joove.DataSourceTypes.MANUAL:
                    var serverSideElementId = Joove.Core.getElementName($control);
                    var args = [serverSideElementId, forMasterPage, requestInfo, aggregatorsInfo];
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
                        DatasourceManager.fetchDatasource($control, controlName, requestInfo, callbacks, forMasterPage);
                    }
                    else {
                        DatasourceManager.fetchDatasourceAggregators($control, controlName, requestInfo, aggregatorsInfo, callbacks, forMasterPage);
                    }
                    break;
            }
        };
        DatasourceManager.invokeClientSideDatasource = function (func, args, callbacks) {
            var options = func.apply(void 0, args);
            callbacks.onStart && callbacks.onStart();
            callbacks.success(options);
            callbacks.onFinish && callbacks.onFinish(options);
        };
        DatasourceManager.fetchManualDatasource = function (serverSideElementId, forMaster) {
            var dataContainerVariableName = "dataFor" + serverSideElementId;
            if (forMaster === true) {
                dataContainerVariableName += "Master";
            }
            var items = window[dataContainerVariableName];
            return {
                Data: items,
                TotalRows: items.length,
                Groups: null,
                RuleEvaluations: null,
            };
        };
        DatasourceManager.fetchDatasource = function ($control, controlName, requestInfo, callbacks, forMasterPage) {
            if ($control.attr("jb-type") === "DropDownBox") {
                var dropDownScope = Joove.Common.getDirectiveScope($control);
                if (dropDownScope.requestInitialValueOnly === true) {
                    var value = DatasourceManager.getInitialValue($control, controlName, callbacks);
                    if (value != DatasourceManager.NO_VALUE) {
                        return;
                    }
                }
            }
            var targetController = Joove.Core.getControllerForElement($control, forMasterPage);
            var projectionScema = window[Joove.Core.getElementName($control) + "_ProjectionScema"];
            var rootModel = Joove.Core.getRootModelForControl($control, forMasterPage);
            var postData = {
                'model': projectionScema == null ? rootModel : Joove.Common.project(rootModel, projectionScema),
                'datasourceRequest': requestInfo || new DatasourceRequest($control, 0, 99999),
                'aggregatorsRequest': DatasourceManager.getAggregatorsRequest(requestInfo)
            };
            Joove.Logger.debug("fetchDatasource(" + controlName + ")", postData);
            var url = "" + window._context.siteRoot + targetController + "/" + controlName + "_Datasource";
            callbacks.onStart = DatasourceManager.getOnStartFetchDatasetActionForControl($control, forMasterPage) || (function () { });
            callbacks.onFinish = DatasourceManager.getOnFinishFetchDatasetActionForControl($control, forMasterPage) ||
                (function (items) { });
            DatasourceManager.makeDatasourceRequest(url, postData, controlName, callbacks);
        };
        DatasourceManager.getAggregatorsRequest = function (requestInfo) {
            if (requestInfo == null)
                return null;
            if (requestInfo.aggregators == null)
                return null;
            return JSON.parse(JSON.stringify(requestInfo.aggregators));
        };
        DatasourceManager.fetchDatasourceAggregators = function ($control, controlName, requestInfo, aggregatorsInfo, callbacks, forMasterPage) {
            var targetController = Joove.Core.getControllerForElement($control, forMasterPage);
            var postData = {
                'model': Joove.Core.getRootModelForControl($control, forMasterPage),
                'datasourceRequest': requestInfo || new DatasourceRequest($control, 0, 99999),
                'aggregatorsRequest': JSON.parse(JSON.stringify(aggregatorsInfo || []))
            };
            var url = window._context.siteRoot + targetController + "/" + controlName + "_DatasourceAggregators";
            DatasourceManager.makeDatasourceRequest(url, postData, controlName, callbacks);
        };
        DatasourceManager.updateSelectedKeysInModel = function (controlName, keys, allRecordsSelected, indexes, forMasterPage) {
            var model = forMasterPage === true
                ? Joove.Common.getMasterModel()
                : Joove.Common.getModel();
            var indexesSerialized = Joove.Common.serializeIndexes(indexes);
            var selectedKeysVarName = controlName + "SelectedItemKeys";
            var keysEntryFoundInModel = false;
            var keyValueToSet = {
                Indexes: indexesSerialized,
                SelectedItems: keys,
                FullRecordsetSelected: allRecordsSelected
            };
            if (model[selectedKeysVarName] == null) {
                model[selectedKeysVarName] = [];
            }
            // update entry if found
            for (var i = 0; i < model[selectedKeysVarName].length; i++) {
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
        };
        DatasourceManager.requestSelectedItemsfromServer = function (controlName, $control, itemsDataType, requestFullRecordset, selectedKeys, keysToExclude, datasourceRequest, cb, fromMasterPage) {
            var targetController = Joove.Core.getControllerForElement($control, fromMasterPage);
            //const dt = DatasourceManager.getDataSetNameFromControl($control) + "_" + itemsDataType
            var dt = DatasourceManager.getDtoTypeFromControl($control); // + "_" + itemsDataType
            if (requestFullRecordset) {
                keysToExclude = keysToExclude || [];
                var postData = {
                    'model': Joove.Core.getRootModelForControl($control, fromMasterPage),
                    'dataType': dt,
                    'keys': keysToExclude.join(),
                    'indexes': Joove.Common.getIndexesOfControl($control).key,
                    'datasourceRequest': datasourceRequest || new DatasourceRequest($control, 0, 99999) //This is added to apply possible filters in the dataset
                };
                Joove.Core.executeControllerActionNew({
                    controller: targetController,
                    action: controlName + "_GetFullRecordset",
                    verb: "POST",
                    queryData: [],
                    postData: postData,
                    cb: function (data) {
                        cb(Joove.Common.modelToJson(data));
                    }
                });
            }
            else {
                var controlJBID = $control.attr("jb-id");
                Joove.Core.executeControllerActionNew({
                    controller: targetController,
                    action: "UpdateInstance",
                    verb: "POST",
                    queryData: [],
                    postData: {
                        keys: selectedKeys.join(),
                        dataType: dt,
                        jbID: controlJBID
                    },
                    cb: function (data) {
                        cb(Joove.Common.modelToJson(data));
                    }
                });
            }
        };
        DatasourceManager.getKeys = function (collection) {
            if (collection == null)
                return [];
            var keys = [];
            var key;
            if (collection.constructor === Array) {
                for (var i = 0; i < collection.length; i++) {
                    key = DatasourceManager.getObjectKey(collection[i]);
                    if (Joove.Common.keyHasDefaultValue(key) === true)
                        continue;
                    keys.push(key);
                }
            }
            else {
                key = DatasourceManager.getObjectKey(collection);
                if (Joove.Common.keyHasDefaultValue(key) === false) {
                    keys.push(key);
                }
            }
            return keys;
        };
        DatasourceManager.getObjectKey = function (obj) {
            return Joove.Common.valueIsObject(obj)
                ? obj._key
                : obj;
        };
        DatasourceManager.watchDependencies = function (formScope, $element, cb, dependenciesAttribute) {
            dependenciesAttribute = dependenciesAttribute || "data-dependencies";
            var dependencies = $element.attr(dependenciesAttribute);
            if (dependencies == null || dependencies.trim() === "")
                return;
            var dependencyPaths = dependencies.trim().split(";");
            for (var i = 0; i < dependencyPaths.length; i++) {
                var currentPath = dependencyPaths[i];
                var dependecyScope = void 0;
                if (currentPath.indexOf("$context") === 0) {
                    var contextItemName = currentPath.split(".")[1];
                    var $contextControl = $element.closest("[data-context-item='" + contextItemName + "']");
                    dependecyScope = angular.element($contextControl).scope(); // todo: this is slow. find another way
                    currentPath = currentPath.replace("$context.", "");
                }
                else {
                    dependecyScope = formScope;
                }
                if (currentPath.indexOf("[]") === -1) {
                    dependecyScope.$watch(currentPath, function (newValue, oldValue) {
                        if (Joove.Common.objectsAreEqual(newValue, oldValue))
                            return;
                        cb && cb(newValue);
                    });
                }
                else {
                    dependecyScope.$watchCollection(currentPath.replace("[]", ""), function (newValue, oldValue) {
                        if (Joove.Common.objectsAreEqual(newValue, oldValue))
                            return;
                        cb && cb(newValue);
                    });
                }
            }
        };
        DatasourceManager.getInitialValueModelPath = function (controlName, $control) {
            var parentPartialName = Joove.Core.getPartialOwnerControlElementId($control);
            return parentPartialName == null
                ? controlName + "__InitialSelection"
                : "" + parentPartialName + controlName + "__InitialSelection";
        };
        DatasourceManager.getInitialValueFromModel = function (controlName, $control) {
            return Joove.Common.getModel()[DatasourceManager.getInitialValueModelPath(controlName, $control)];
        };
        DatasourceManager.isInitialSelectionAvailable = function (controlName, $control) {
            var preselectedData = DatasourceManager.getInitialValueFromModel(controlName, $control);
            return typeof (preselectedData) !== "undefined";
        };
        ;
        DatasourceManager.removeInitialValue = function (controlName, $control) {
            delete Joove.Common.getModel()[DatasourceManager.getInitialValueModelPath(controlName, $control)];
        };
        DatasourceManager.getInitialValue = function ($control, controlName, callbacks) {
            var indexes = Joove.Common.getIndexesOfControl($control);
            var indexesSerialized = indexes.key;
            if (indexesSerialized === "") {
                indexesSerialized = "_";
            }
            var preselectedData = DatasourceManager.getInitialValueFromModel(controlName, $control);
            var invokeCallback = function (data) {
                var dropDownScope = Joove.Common.getDirectiveScope($control);
                dropDownScope.requestInitialValueOnly = false;
                dropDownScope.refreshDataFromServerOnFocus = true;
                if (callbacks.success)
                    callbacks.success({ Data: data });
            };
            if (preselectedData == null) {
                console.log("No preselected data found for " + controlName);
                return DatasourceManager.NO_VALUE;
            }
            var dataForThisIndex = null;
            for (var i = 0; i < preselectedData.length; i++) {
                var current = preselectedData[i];
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
        };
        DatasourceManager.sortControlsBoundToDataSet = function (ds, member, e) {
            var $controls = DatasourceManager.getControlsUsingDataSet(ds);
            for (var i = 0; i < $controls.length; i++) {
                var $control = $controls.eq(i);
                var directiveScope = Joove.Common.getDirectiveScope($control);
                if (directiveScope == null || directiveScope.$sortBy == null)
                    continue;
                directiveScope.$sortBy(e, member);
            }
        };
        DatasourceManager.applyFiltersToControlsBoundToDataSet = function (ds, e) {
            var $controls = DatasourceManager.getControlsUsingDataSet(ds);
            for (var i = 0; i < $controls.length; i++) {
                var $control = $controls.eq(i);
                var directiveScope = Joove.Common.getDirectiveScope($control);
                if (directiveScope == null || directiveScope.$applyFilters == null)
                    continue;
                directiveScope.$applyFilters(e);
            }
        };
        DatasourceManager.clearFiltersToControlsBoundToDataSet = function (ds, e) {
            var $controls = DatasourceManager.getControlsUsingDataSet(ds);
            for (var i = 0; i < $controls.length; i++) {
                var $control = $controls.eq(i);
                var directiveScope = Joove.Common.getDirectiveScope($control);
                if (directiveScope == null || directiveScope.$clearFilters == null)
                    continue;
                directiveScope.$clearFilters(e);
            }
        };
        DatasourceManager._throttle = 500;
        DatasourceManager._queue = {};
        DatasourceManager.makeAsyncRequests = false;
        DatasourceManager.NO_VALUE = "NO_VALUE";
        DatasourceManager.addFilterToDataSet = function (dsName, e, columnName, filterOp, rowOp, overwriteExisting, autoApply) {
            var $controls = DatasourceManager.getControlsUsingDataSet(dsName);
            for (var i = 0; i < $controls.length; i++) {
                var $current = $controls.eq(i);
                var directive = Joove.Common.getDirectiveScope($current);
                if (directive == null)
                    continue;
                var addFilterMethod = directive.$addFilter;
                if (addFilterMethod == null)
                    continue;
                directive.$addFilter(e, columnName, filterOp, rowOp, overwriteExisting, autoApply);
            }
        };
        DatasourceManager.addGlobalFilterToDataSet = function (dsName, e, autoApply) {
            var $controls = DatasourceManager.getControlsUsingDataSet(dsName);
            for (var i = 0; i < $controls.length; i++) {
                var $current = $controls.eq(i);
                var directive = Joove.Common.getDirectiveScope($current);
                if (directive == null)
                    continue;
                var addFilterMethod = directive.$globalFilter;
                if (addFilterMethod == null)
                    continue;
                directive.$globalFilter(e, autoApply);
            }
        };
        return DatasourceManager;
    }());
    Joove.DatasourceManager = DatasourceManager;
})(Joove || (Joove = {}));
