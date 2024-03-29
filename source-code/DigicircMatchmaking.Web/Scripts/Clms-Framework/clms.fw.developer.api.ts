interface Window {
    $form: Joove.IJooveScope;
    $master: Joove.IJooveScope;    
    $actions: any;
    $masterActions: any;
    $api: any;
    $domain: any;
    $updateBindings: Function;
    $refreshLogic: Function;
    $controlChanged: Function;
    $showMessage: Function;
    $closeForm: Function;
    $redirectToUrl: Function;
    $redirectToAction: Function;
    $formExtend: Function;
    $onFormLoaded: Function;
    $events: { on: any, raise: any };
    $dataSets: any;
    $masterDataSets: any;
    $info: any;
    $localization: any;
}

namespace Joove {
    export class DeveloperApi {
        static init(formScope: IJooveScope, masterScope: IJooveScope) {    
			try {
				DeveloperApi.exportShortcuts(formScope, masterScope);
				DeveloperApi.extendScope(formScope);            
			}
			catch (e) {
				console.error("Could not initialize Js Developer API!");
				console.error(e);				
			}
        }

        private static exportShortcuts(formScope: IJooveScope, masterScope: IJooveScope) {            
            // Scopes
            window.$form = formScope;
            window.$master = masterScope;

            // Controller actions
            window.$actions = formScope.actions;
            window.$masterActions = masterScope.actions;

            // Apply scope shortcut
            window.$updateBindings = () => {
                Core.applyScope(formScope);
                Core.applyScope(masterScope);
            }

            // Rule Engine update
            window.$refreshLogic = (callback?) => {
                window._ruleEngine.update(EvaluationTimes.OnChange, undefined, callback);
            }

            // On Change
            window.$controlChanged = (element: HTMLElement, newValue: any, dontMakeDirty?: boolean) => {
                Core.onChange(element, newValue, dontMakeDirty);
            }

            // Close Form
            window.$closeForm = () => {
                window._commander.closeForm();
            }

            // Show Message
            window.$showMessage = (text: any, type: string, redirectUrl?: string) => {
                window._commander.showMessage([text, type, redirectUrl]);
            }

            // Redirect
            window.$redirectToUrl = (url: string, target?: string) => {
                if (target == null) {
                    window._commander.redirect([url]);
                }
                else {
                    window._commander.redirect([url, target]);
                }
            }

            // Redirect to Action
            window.$redirectToAction = (controller: string, action: string, ...params: Array<any>) => {
                Joove.Core.executeRedirectControllerAction(controller, action, "GET", params, null, null);
            }  

            // Events
            window.$events = {
                on: {},
                raise: (eventName: string, ...params: Array<any>) => {
                    Joove.Core.executeControllerAction(window._context.currentController,
                        "_Raise",
                        "POST",
                        [],
                        { 'eventName': eventName, 'parameters': params }, null, null, null);
                }
            };

            // DataSets
            window.$dataSets = {};
            window.$dataSets.get = (name: string, options: {
                pageSize?: number,
                startRow?: number,
                fields: Array<string>,
                args?: Array<IDatasetArgs>,
                done: Function,             
                error?: Function,
                complete?: Function
            }) => {                
                DeveloperApi.fetchDataSource(name, false, options);
            }

            // DataSets Master
            window.$masterDataSets = {};
            window.$masterDataSets.get = (name: string, options: {
                pageSize?: number,
                startRow?: number,
                fields: Array<string>,
                args?: Array<IDatasetArgs>,
                done: Function,
                error?: Function,
                complete?: Function
            }) => {                

                DeveloperApi.fetchDataSource(name, true, options);
            }

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
            }
        }
       
        private static extendScope(scope: IJooveScope) {
            // Resource local
            scope["$res"] = (key: string): string => {
                return window._resourcesManager.getLocalResource(key);
            }

            // Resource from master
            scope["$resMaster"] = (key: string): string => {
                return window._resourcesManager.getLocalResource(key, true);
            }

            // Resource from partial
            scope["$resPartial"] = (key: string, partialName: string): string => {
                return window._resourcesManager.getLocalResource(key, false, partialName);
            }

            // Global resource
            scope["$resGlobal"] = (key: string): string => {
                return window._resourcesManager.getGlobalResource(key);
            }

            // User Object
            scope["$user"] = window._context.currentUser;            

            // Username
            scope["$username"] = window._context.currentUsername;            

            // App Name
            scope["$appName"] = window._context.appName;            

            // User Has Permission
            scope["$userHasPermission"] = (permission: string): boolean => {
                return window._context.currentUserPermissions.indexOf(permission) > -1;
            }

            // User Has Role
            scope["$userHasRole"] = (role: string): boolean => {
                return window._context.currentUserRoles.indexOf(role) > -1;
            }            
        }

        private static addFilterInfo(info: IDatasetArgs, bag: Array<Joove.FilterInfo>) {
            if (info.filters == null) return;

            var col = new ColumnInfo(info.field, info.dataType);

            for (let i = 0; i < info.filters.length; i++) {
                var current = info.filters[i];

                var rowOp = current.rowOperator == null
                    ? Joove.RowOperators.OR
                    : Joove.RowOperators[current.rowOperator.toUpperCase()];

                var filterOp = current.operator == null
                    ? Joove.FilterOperators.LIKE
                    : Joove.FilterOperators[current.operator.toUpperCase()];

                bag.push(new FilterInfo(col, current.value, rowOp, filterOp, current.secondValue));

            }
        }

        private static addOrderByInfo(info: IDatasetArgs, bag: Array<Joove.OrderByInfo>) {
            if (info.orderBy == null) return;

            var col = new ColumnInfo(info.field, info.dataType);

            if (info.orderBy.toUpperCase() == 'ASC') {
                bag.push(new Joove.OrderByInfo(col, OrderByDirections.ASC));
            }
            else if (info.orderBy.toUpperCase() == 'DESC') {
                bag.push(new Joove.OrderByInfo(col, OrderByDirections.DESC));
            }

        }

        private static addGroupByInfo(info: IDatasetArgs, bag: Array<Joove.GroupByInfo>) {
            if (info.groupBy == null || info.groupBy == false) return;

            var col = new ColumnInfo(info.field, info.dataType);

            var value = info.groupBy.toString().toUpperCase();

            if (value != "GROUPS" && value != "DATA" && value != "TRUE") return;

            var closedGroups = value == 'GROUPS';

            bag.push(new GroupByInfo(col, GroupState.EXPANDED, false, closedGroups));
        }

        private static fetchDataSource(name: string, forMaster: boolean, options: {
            pageSize?: number,
            startRow?: number,
            fields: Array<string>,
            args?: Array<IDatasetArgs>,
            done: Function,
            error?: Function,
            complete?: Function
        }) {
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
            }

            if (options.args != null) {
                for (let i = 0; i < options.args.length; i++) {
                    var current = options.args[i];

                    if (current == null) continue;

                    // Filters
                    DeveloperApi.addFilterInfo(current, fetchOptions.filters);

                    // Ordering
                    DeveloperApi.addOrderByInfo(current, fetchOptions.ordering);

                    // Grouping
                    DeveloperApi.addGroupByInfo(current, fetchOptions.grouping);
                }
            }

            Joove.DatasourceManager.fetchDatasourceForJsApi(fetchOptions);
        }

        public static onDatasourceRequestCompleted(controlName: string, data: any, request: any) {
            if (window.$form.dataSets == null) {
                window.$form.dataSets = {};
            }

            window.$form.dataSets[controlName] = data;
            window.$form.dataSets[controlName].request = request;            
        }
    }
        
    export interface IDatasetArgs {
        field: string,
        dataType: string,
        orderBy: string,
        groupBy: any,        
        filters: Array<{
            value: any,
            secondValue?: any,
            operator?: string,
            rowOperator?: string,            
        }>
    }
}