var Joove;
(function (Joove) {
    var DeveloperApi = /** @class */ (function () {
        function DeveloperApi() {
        }
        DeveloperApi.init = function (formScope, masterScope) {
            try {
                DeveloperApi.exportShortcuts(formScope, masterScope);
                DeveloperApi.extendScope(formScope);
            }
            catch (e) {
                console.error("Could not initialize Js Developer API!");
                console.error(e);
            }
        };
        DeveloperApi.exportShortcuts = function (formScope, masterScope) {
            // Scopes
            window.$form = formScope;
            window.$master = masterScope;
            // Controller actions
            window.$actions = formScope.actions;
            window.$masterActions = masterScope.actions;
            // Apply scope shortcut
            window.$updateBindings = function () {
                Joove.Core.applyScope(formScope);
                Joove.Core.applyScope(masterScope);
            };
            // Rule Engine update
            window.$refreshLogic = function (callback) {
                window._ruleEngine.update(Joove.EvaluationTimes.OnChange, undefined, callback);
            };
            // On Change
            window.$controlChanged = function (element, newValue, dontMakeDirty) {
                Joove.Core.onChange(element, newValue, dontMakeDirty);
            };
            // Close Form
            window.$closeForm = function () {
                window._commander.closeForm();
            };
            // Show Message
            window.$showMessage = function (text, type, redirectUrl) {
                window._commander.showMessage([text, type, redirectUrl]);
            };
            // Redirect
            window.$redirectToUrl = function (url, target) {
                if (target == null) {
                    window._commander.redirect([url]);
                }
                else {
                    window._commander.redirect([url, target]);
                }
            };
            // Redirect to Action
            window.$redirectToAction = function (controller, action) {
                var params = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    params[_i - 2] = arguments[_i];
                }
                Joove.Core.executeRedirectControllerAction(controller, action, "GET", params, null, null);
            };
            // Events
            window.$events = {
                on: {},
                raise: function (eventName) {
                    var params = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        params[_i - 1] = arguments[_i];
                    }
                    Joove.Core.executeControllerAction(window._context.currentController, "_Raise", "POST", [], { 'eventName': eventName, 'parameters': params }, null, null, null);
                }
            };
            // DataSets
            window.$dataSets = {};
            window.$dataSets.get = function (name, options) {
                DeveloperApi.fetchDataSource(name, false, options);
            };
            // DataSets Master
            window.$masterDataSets = {};
            window.$masterDataSets.get = function (name, options) {
                DeveloperApi.fetchDataSource(name, true, options);
            };
            // Form Info
            window.$info = {
                action: window._context.currentAction,
                controller: window._context.currentController,
                masterForm: window._context.currentMasterPageController,
                siteRoot: window._context.siteRoot,
                pathAndQuery: window._context.urlQuery,
                devMode: window._context.mode == "Development",
                dirty: window._context.isDirty,
                modal: window._context.isModal
            };
            // Localization 
            window.$localization = {
                locale: window._context.locale,
                decimalSeparator: window._context.decimalSeparator,
                groupSeparator: window._context.groupSeparator
            };
        };
        DeveloperApi.extendScope = function (scope) {
            // Resource local
            scope["$res"] = function (key) {
                return window._resourcesManager.getLocalResource(key);
            };
            // Resource from master
            scope["$resMaster"] = function (key) {
                return window._resourcesManager.getLocalResource(key, true);
            };
            // Resource from partial
            scope["$resPartial"] = function (key, partialName) {
                return window._resourcesManager.getLocalResource(key, false, partialName);
            };
            // Global resource
            scope["$resGlobal"] = function (key) {
                return window._resourcesManager.getGlobalResource(key);
            };
            // User Object
            scope["$user"] = window._context.currentUser;
            // Username
            scope["$username"] = window._context.currentUsername;
            // App Name
            scope["$appName"] = window._context.appName;
            // User Has Permission
            scope["$userHasPermission"] = function (permission) {
                return window._context.currentUserPermissions.indexOf(permission) > -1;
            };
            // User Has Role
            scope["$userHasRole"] = function (role) {
                return window._context.currentUserRoles.indexOf(role) > -1;
            };
        };
        DeveloperApi.addFilterInfo = function (info, bag) {
            if (info.filters == null)
                return;
            var col = new Joove.ColumnInfo(info.field, info.dataType);
            for (var i = 0; i < info.filters.length; i++) {
                var current = info.filters[i];
                var rowOp = current.rowOperator == null
                    ? Joove.RowOperators.OR
                    : Joove.RowOperators[current.rowOperator.toUpperCase()];
                var filterOp = current.operator == null
                    ? Joove.FilterOperators.LIKE
                    : Joove.FilterOperators[current.operator.toUpperCase()];
                bag.push(new Joove.FilterInfo(col, current.value, rowOp, filterOp, current.secondValue));
            }
        };
        DeveloperApi.addOrderByInfo = function (info, bag) {
            if (info.orderBy == null)
                return;
            var col = new Joove.ColumnInfo(info.field, info.dataType);
            if (info.orderBy.toUpperCase() == 'ASC') {
                bag.push(new Joove.OrderByInfo(col, Joove.OrderByDirections.ASC));
            }
            else if (info.orderBy.toUpperCase() == 'DESC') {
                bag.push(new Joove.OrderByInfo(col, Joove.OrderByDirections.DESC));
            }
        };
        DeveloperApi.addGroupByInfo = function (info, bag) {
            if (info.groupBy == null || info.groupBy == false)
                return;
            var col = new Joove.ColumnInfo(info.field, info.dataType);
            var value = info.groupBy.toString().toUpperCase();
            if (value != "GROUPS" && value != "DATA" && value != "TRUE")
                return;
            var closedGroups = value == 'GROUPS';
            bag.push(new Joove.GroupByInfo(col, Joove.GroupState.EXPANDED, false, closedGroups));
        };
        DeveloperApi.fetchDataSource = function (name, forMaster, options) {
            var fetchOptions = {
                dsName: name,
                pageSize: options.pageSize || 50,
                startRow: options.startRow || 0,
                fields: options.fields,
                done: options.done,
                forMaster: forMaster,
                error: options.error,
                complete: options.complete,
                filters: [],
                ordering: [],
                grouping: []
            };
            if (options.args != null) {
                for (var i = 0; i < options.args.length; i++) {
                    var current = options.args[i];
                    if (current == null)
                        continue;
                    // Filters
                    DeveloperApi.addFilterInfo(current, fetchOptions.filters);
                    // Ordering
                    DeveloperApi.addOrderByInfo(current, fetchOptions.ordering);
                    // Grouping
                    DeveloperApi.addGroupByInfo(current, fetchOptions.grouping);
                }
            }
            Joove.DatasourceManager.fetchDatasourceForJsApi(fetchOptions);
        };
        DeveloperApi.onDatasourceRequestCompleted = function (controlName, data, request) {
            if (window.$form.dataSets == null) {
                window.$form.dataSets = {};
            }
            window.$form.dataSets[controlName] = data;
            window.$form.dataSets[controlName].request = request;
        };
        return DeveloperApi;
    }());
    Joove.DeveloperApi = DeveloperApi;
})(Joove || (Joove = {}));
