namespace Joove {
    
        export class ClientCommander {
            availableCommands = {                
                DATALIST_REFRESH: "dataListRefresh",
                DATALIST_CLEAR_SELECTED_ITEMS: "dataListClearItems",
                DATALIST_UPDATE_SIZE: "dataListUpdateSize",
                GRID_GOTO_LAST_PAGE: "gridGotoLastPage",
                GRID_GOTO_PREV_PAGE: "gridGotoPrevPage",
                GRID_GOTO_NEXT_PAGE: "gridGotoNextPage",
                GRID_GOTO_FIRST_PAGE: "gridGotoFirstPage",
                GRID_GOTO_PAGE: "gridGotoPage",
                GRID_SAVE_STATE: "gridSaveState",
                GRID_CLEAR_STATE: "gridClearState",
                GRID_GO_TO_SAVED_PAGE: "gridGoToSavedPage",
                SHOW_MESSAGE: "showMessage",
                SHOW_MODAL: "showModal",
                HIDE_MODAL: "hideModal",
                CHART_REFRESH: "chartRefresh",
                PUSH_TO_NAVIGATION_HISTORY: "pushToHistory",
                CLOSE_FORM: "closeForm",
                REDIRECT: "redirect",
                GRID_REFRESH: "gridRefresh",
                MAP_REFRESH: "mapRefresh",
                MAP_DIRECTIONS: "mapDirections",
                MAP_FITCONTENT: "mapFitToContent",
                EXPORT_FORM_TO_PDF: "exportFormToPdf",
                EXPORT_CONTROL_TO_PDF: "exportControlToPdf",
                EXECUTE_JS: "executeJs",
                DROPDOWN_REFRESH: "dropdownRefresh",
                COMMIT_ALL_FILES: "commitAllFiles",
                CALENDAR_REFRESH: "calendarRefresh",
                SET_DIRTY: "setDirty",
                DOWNLOAD: "download",
                ImageRefresh: "imageRefresh"
            }
    
            executeCommands(commandList: Array<any>): void {
                if (commandList == null) return;
    
                for (let i = 0; i < commandList.length; i++) {
                    const current = commandList[i];
                    const method = this.availableCommands[current.Command];
    
                    if (method == null) {
                        console.error(`Client command ${current.Command} does not exist in the command set!`);
                        continue;
                    }
                    this[method](current.Params);
                }
            }

            commitAllFiles(): void {
                
            }

            executeJs(args: Array<any>): void {
                eval(args[0]);
            }

            setDirty(args: Array<any>): void {                
                const dirty = args[0] == true;              
                window._context.isDirty = dirty;
            }

            calendarRefresh(args: Array<any>): void {
                const calendarName = args[0];
                const $el = $(`[jb-id='${calendarName}']`);
                const directiveScope = Joove.Common.getDirectiveScope($el);

                directiveScope._helper.clearCache();
                directiveScope._helper.refresh();
            }

            mapRefresh(args: Array<any>): void {
                const mapName = args[0];
    
                const mapInstance = Widgets.MapControl.instancesDic[mapName];
                if (mapInstance != undefined) {
                    mapInstance.getData(true);
                } else {
                console.log(`WARNING (Client Commander): Map instance ${mapName} not found in mapRefresh function`);
            }
            }

            mapDirections(args: Array<any>): void {
                const [mapName, origin, destination] = args;
                const mapInstance = Widgets.MapControl.instancesDic[mapName];
                if (mapInstance != undefined) {
                    mapInstance.displayDirections(origin, destination,google.maps.TravelMode.DRIVING);
                } else {
                    console.log(`WARNING (Client Commander): Map instance ${mapName} not found in mapDirections function`);
                }
            }

            mapFitToContent(args: Array<any>): void {
                const mapName = args[0];
    
                const mapInstance = Widgets.MapControl.instancesDic[mapName];
                if (mapInstance != undefined) {
                    mapInstance.fitToContent();
                } else {
                    console.log(`WARNING (Client Commander): Map instance ${mapName} not found in mapFitToContent function`);
                }
            }
    
            redirect(args: Array<any>): void {
                const url = args[0];
    
                if (url == null || url.length === 0) {
                    console.error("Url for redirection is null or empty!");
                    return;
                }
                
                if (args.length === 1) {
                    window.location.href = url;
                }
                else {
                    let target = "_parent";
                    if (args.length > 1) {
                        target = args[1];
                    }
    
                    const newWindow = window.open(url, target);
                    try {
                        newWindow.focus();
                    }
                    catch (e) {
                        console.error("Your browser does not allow popups. Please, disable it, or add this site to your exception list, if you are using a Pop-Up Blocker.");
                    }
                }
            }
    
            closeForm(): void {
                try {
                    if (window.location.href === window.parent.location.href) {
                        window._historyManager.back();
                    }
                    else {
                        window.parent._commander.hideModal("ControllerActionModal");
                    }
                }
                catch (e) {
                    console.error("Error closing form!", e);
                    window._historyManager.back();
                }
            }
    
            pushToHistory(): void {
                window._historyManager.pushToHistory(window.location.href);
            }
    
            showModal(modalName): void {
                if (Array.isArray(modalName)) { modalName = modalName[0]; }
                window._popUpManager.showModalControl(modalName);
            }
    
            hideModal(modalName): void {
                if (Array.isArray(modalName)) { modalName = modalName[0]; }
                window._popUpManager.hideModalControl(modalName);
            }
    
            showMessage(args: Array<any>): void {
                const message = args[0];
                const type = args.length > 1 ? args[1] : "Success";
                var redirectUrl = args.length > 2 ? args[2] : null;
    
                let redirectCb = null;
    
                if (Common.stringIsNullOrEmpty(redirectUrl) === false) {
                    redirectCb = () => {
                        window.location.href = redirectUrl;
                    }
                }

                let text: any = "";
                if (message != null) {
                    if ((typeof message) == "string") {
                        text = message;
                    }
                    else {
                        text = JSON.stringify(Cycles.decycleObject(message), null, 2);
                    }
                }
    
                switch (type) {
                    case "Error":
                        window._popUpManager.error("", text, redirectCb);
                        break;
    
                    case "Info":
                        window._popUpManager.info("", text, redirectCb);
                        break;
    
                    case "Warning":
                        window._popUpManager.warning("", text, redirectCb);
                        break;
    
                    case "Success":
                    default:
                        window._popUpManager.success("", text, redirectCb);
                        break;
                }
            }
    
            chartRefresh(args: Array<any>): void {
                const chartName = Widgets.ChartHelper.GetChartName(args[0]);

                const charts = Widgets.ChartHelper.instancesDic[chartName];

                if (charts == null) {
                    console.error(`Chart instance not found. Name: ${chartName}`);
                    return;
                }

                const index = Joove.Common.getIndexKeyOfControl($(Joove.Common.getLastClickedElement()));

                if (Joove.Common.stringIsNullOrEmpty(index) || charts[index] == null) {
                    for (let c in charts) {
                        charts[c].updateChart();
                    }
                } else {
                    charts[index].updateChart();
                }
            }

            dataListApplyPredefinedFilters(args: Array<any>): void {
                const dataListName = args[0];
                const dataListInstance = Widgets.DataListControl.instancesDic[dataListName];
                if (dataListInstance == null) {
                    console.log(`Datalist instance not found. Name:${dataListName}`);
                    return;
                }
                if (!dataListInstance.isInitialized) { return; }
                Joove.Common.getDirectiveScope(dataListInstance.$element).$applyFilters();
            }

            dataListClearFilters(args: Array<any>): void {
                const dataListName = args[0];
                const dataListInstance = Widgets.DataListControl.instancesDic[dataListName];
                if (dataListInstance == null) {
                    console.log(`Datalist instance not found. Name:${dataListName}`);
                    return;
                }
                if (!dataListInstance.isInitialized) { return; }
                dataListInstance.removeAllCustomFilters();
                dataListInstance.dataTableInstance.draw(false);
            }

            dataListRefresh(args: Array<any>): void {
                const dataListName = args[0];
                const dataListInstance = Widgets.DataListControl.instancesDic[dataListName];
                if (dataListInstance == null) {
                    console.log(`Datalist instance not found. Name:${dataListName}`);
                    return;
                }
                if (!dataListInstance.isInitialized) { return; }
                dataListInstance.dataTableInstance.draw(false);
            }

            dataListClearItems(args: Array<string>): void {
                const dataListName = args[0];
                const dataListInstance = Widgets.DataListControl.instancesDic[dataListName];
                if (dataListInstance == null) {
                    console.log(`Datalist instance not found. Name:${dataListName}`);
                    return;
                }
                if (!dataListInstance.isInitialized) { return; }
                dataListInstance.deselectAll();
            }

            dataListUpdateSize(args: Array<any>): void {
	            const dataListName = args[0];
	            const dataListInstance = Widgets.DataListControl.instancesDic[dataListName];
	            if (dataListInstance == null) {
	                console.log("Datalist instance not found. Name:" + dataListName);
	                return;
	            }
                if (!dataListInstance.isInitialized) { return; }
                //Give it some time before executing to allow possible transitions
                setTimeout(() => { dataListInstance.updateDataTableSize(); } , 100);
            }
			
            gridGotoLastPage(args: Array<any>): void {
                const gridName = args[0];
                let wait = false;
                if (args.length > 1) {
                    wait = args[1];
                }
    
                this.getGridDirectiveScope(gridName,
                    scope => {
                        scope.$gotoLastPage(wait);
                    });
            }
    
            gridGotoPrevPage(args: Array<any>): void {
                const gridName = args[0];
    
                this.getGridDirectiveScope(gridName,
                    scope => {
                        scope.$prevPage();
                    });
            }
    
            gridGotoNextPage(args: Array<any>): void {
                const gridName = args[0];
    
                this.getGridDirectiveScope(gridName,
                    scope => {
                        scope.$nextPage();
                    });
            }
    
            gridGotoFirstPage(args: Array<any>): void {
                const gridName = args[0];
    
                this.getGridDirectiveScope(gridName,
                    scope => {
                        scope.$gotoFirstPage();
                    });
            }
    
            gridGotoPage(args: Array<any>): void {
                const gridName = args[0];
                var page = args[1] - 1; // since pager is 1 based on appdev
    
                this.getGridDirectiveScope(gridName,
                    scope => {
                        scope.$gotoPage(page);
                    });
            }
    
            gridRefresh(args: Array<any>): void {
                const gridName = args[0];
    
                this.getGridDirectiveScope(gridName,
                    scope => {
                        if (scope.$refresh) {
                            scope.$refresh();
                        }
                        else {
                            scope.$gotoPage(0, false, true);
                        }
                    });
            }

            gridSaveState(args: Array<any>): void {
                const gridName = args[0];
    
                this.getGridDirectiveScope(gridName,
                    scope => {
                        var currentPage =  scope.$currentPage;
                        window.localStorage.setItem(gridName + "_currentPage", JSON.stringify(currentPage));
                    });
            }

            gridGoToSavedPage(args: Array<any>): void {
                const gridName = args[0];
    
                this.getGridDirectiveScope(gridName,
                    scope => {
                        var currentPage =  JSON.parse(window.localStorage.getItem(gridName + "_currentPage"));
                        if(currentPage !== null){
                            scope.$gotoPage(currentPage, false, true);
                        }
                    });
            }

            gridClearState(args: Array<any>): void {
                const gridName = args[0];
    
                window.localStorage.removeItem(gridName + "_currentPage")
            }
            
            imageRefresh(args: Array<any>): void {
                const imageName = args[0];

                this.getImageDirectiveScope(imageName,
                    scope => {
                        scope.download(true, (data) => {
                            scope.setImage(data);
                        });
                    });
            }

            exportFormToPdf(args: Array<any>) {
                const filename = args[0];
                const usePrintMedia = args[1] || false;
                Common.exportToPdf({ usePrintMedia, filename });
            }

            exportControlToPdf(args: Array<any>) {
                const [filename, controlName] = args;
                const usePrintMedia = args[2] || false;
                Common.exportToPdf({ filename, $element: $(`[jb-id='${controlName}']`), usePrintMedia });
            }

            dropdownRefresh(args: Array<any>): void {
                const controlName = args[0];

                $(`[jb-id='${controlName}']`).each(
                    function (i, el) {
                        Joove.Common.getDirectiveScope($(el)).fetchData();
                    }
                );
            }

            download(args: Array<any>): void {
                const id = args[0];
                window.open(window._context.siteRoot + window._context.currentController + "/DownloadFile?id=" + id , "_blank");
            }

            /* Helper Methods */
            
            getImageDirectiveScope(imageName: string, cb: Function, attemptNumber?: number): void {
                const $image = this.getControlByName(imageName);

                if ($image.length > 1) {
                    console.warn(`Client Commander: Image command affecting more than 1 Images with name '${imageName}' (propably inside context!)`);
                    $image.each(function (index, element) {
                        attemptNumber = attemptNumber || 0;

                        if (Common.directiveScopeIsReady($(this))) {
                            const scope = Common.getDirectiveScope($(this));

                            cb(scope);
                        } else if (attemptNumber < 30) {
                            setTimeout(() => {
                                this.getImageDirectiveScope(imageName, cb, ++attemptNumber);
                            }, 50);
                        }
                    });
                } else {
                    attemptNumber = attemptNumber || 0;

                    if (Common.directiveScopeIsReady($image)) {
                        const scope = Common.getDirectiveScope($image);

                        cb(scope);
                    } else if (attemptNumber < 30) {
                        setTimeout(() => {
                            this.getImageDirectiveScope(imageName, cb, ++attemptNumber);
                        }, 50);
                    }
                }
            }

            getGridDirectiveScope(gridName: string, cb: Function, attemptNumber?: number): void {
                const $grid = this.getControlByName(gridName);
    
                if ($grid.length > 1) {
                    console.warn(`Client Commander: Grid command affecting more than 1 Grids with name '${gridName}' (propably inside context!)`);
                }
    
                attemptNumber = attemptNumber || 0;
    
                if (Common.directiveScopeIsReady($grid)) {
                    const scope = Common.getDirectiveScope($grid);
    
                    cb(scope);
                } else if (attemptNumber < 30) {
                    setTimeout(() => {
                        this.getGridDirectiveScope(gridName, cb, ++attemptNumber);
                    },  50);
                }
            }
    
            getControlByName(name: string): JQuery {
                const $ctrl = $(`[jb-id='${name}']`);
    
                if ($ctrl.length === 0) {
                    console.error(`Client Commander: Control with name: '${name}' not Found`);
                }
    
                return $ctrl;
            }
        }
    
        export interface IHistoryManager {
            pushToHistory(url: string);
            clear();
            save();
            navigate(url: string);
            back();
        }
    
        export class DebugConsoleStatus {
            visible: boolean;
            minimized: boolean;
            width: number;
            bodyHeight: number;
            footerHeight: number;
            top: any;
            left: any;
        }
        export class DebugConsoleManager {
            private _storageKey: string = "_debugConsole";
            public debugConsoleStatus: DebugConsoleStatus;
    
            constructor() {
                this.debugConsoleStatus = JSON.parse(window.localStorage.getItem(this._storageKey));
                if (this.debugConsoleStatus == null) {
                    this.debugConsoleStatus = new DebugConsoleStatus();
                }
            }
    
            savePosition(top: any, left: any) {
                if (top != null) {
                    this.debugConsoleStatus.top = top;
                }
                if (left != null) {
                    this.debugConsoleStatus.left = left;
                }
                window.localStorage.setItem(this._storageKey, JSON.stringify(this.debugConsoleStatus));
            }
    
            saveSize(width: number = 0, bodyHeight: number = 0, footerHeight: number = 0) {
                if (width > 0) {
                    this.debugConsoleStatus.width = width;
                }
                if (bodyHeight > 0) {
                    this.debugConsoleStatus.bodyHeight = bodyHeight;
                }
                if (footerHeight > 0) {
                    this.debugConsoleStatus.footerHeight = footerHeight;
                }
                window.localStorage.setItem(this._storageKey, JSON.stringify(this.debugConsoleStatus));
            }
    
            saveVisibility(visible: boolean, minimized: boolean = false) {
                this.debugConsoleStatus.visible = visible;
                if (visible === false) {
                    this.debugConsoleStatus.minimized = false;
                }
                else {
                    this.debugConsoleStatus.minimized = minimized;
                }
                window.localStorage.setItem(this._storageKey, JSON.stringify(this.debugConsoleStatus));
            }
    
            clear() {
                window.localStorage.removeItem(this._storageKey);
            }
    
        }
        
        export class HistoryManager implements IHistoryManager {
            public urls: Array<string>;
            private _storageKey = "_navigationHistory";
            private _maxHistory = 20;
    
            constructor() {
                this.urls = JSON.parse(window.localStorage.getItem(this._storageKey));
    
                if (this.urls == null) {
                    this.urls = new Array<string>();
                }
            }
    
            pushToHistory(url: string) {
                const lastURL = this.urls.length > 0
                    ? this.urls[this.urls.length - 1]
                    : window._context.siteRoot;
    
                url = this.trimLastQuestionmarkFromURL(url);
    
                if (url == null || url.trim().length === 0 || url.trim() === lastURL) return;
    
                if (this.urls.length >= this._maxHistory) {
                    this.urls.splice(0, 1);
                }
    
                this.urls.push(url);
                this.save();
            }
    
            save() {
                window.localStorage.setItem(this._storageKey, JSON.stringify(this.urls));
            }
    
            clear() {
                window.localStorage.removeItem(this._storageKey);
            }
    
            navigate(url: string) {
                this.pushToHistory(url);
                window.location.href = url;
            }
    
            trimLastQuestionmarkFromURL(url: string):string {
                if (url != null && url[url.length - 1] === "?") {
                    url = url.substr(0, url.length - 1);
                }
    
                return url;
            }
    
            back() {
                let lastURL = this.urls.length > 0
                    ? this.urls[this.urls.length - 1]
                    : window._context.siteRoot;
    
                const currentHref = this.trimLastQuestionmarkFromURL(window.location.href);
    
                if (lastURL === currentHref) {
                    lastURL = this.urls.length > 1
                        ? this.urls[this.urls.length - 2]
                        : window._context.siteRoot;
                }
    
                this.navigate(lastURL);
            }        
        }
    
        export enum ScriptState {
            LOADED,
            LOADING
        }
    
        export class ScriptLoaderManager {
            constructor(private scriptsStates) {
                this.scriptsStates = {};
            }

            requireScript(id: string, src: string, callback?: () => void): Promise<boolean> {
                if (this.scriptsStates[id] === ScriptState.LOADED) {
                    return new Promise<boolean>((resolve) => {
                        resolve(true);
                    });
                }

                this.scriptsStates[id] = ScriptState.LOADING;

                return new Promise<boolean>((resolve) => {
                    const script = document.createElement("script");
                    script.setAttribute("src", src);

                    const onLoad = (): any => {
                        this.scriptsStates[id] = ScriptState.LOADED;
                        callback && callback();
                        resolve(true);
                    };

                    script.onload = onLoad;
                    document.head.appendChild(script);
                });
            }

            isScriptLoaded(id: string): boolean {
                return this.scriptsStates[id] === ScriptState.LOADED;
            }

            private waitForScriptLoad(lookFor: string, callback: () => void) {
                var interval = setInterval(() => {

                    if (eval(`typeof ${lookFor}`) !== "undefined") {
                        clearInterval(interval);
                        callback();
                    }

                }, 50);

            }
        }
    }
    