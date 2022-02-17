var Joove;
(function (Joove) {
    var ClientCommander = /** @class */ (function () {
        function ClientCommander() {
            this.availableCommands = {
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
            };
        }
        ClientCommander.prototype.executeCommands = function (commandList) {
            if (commandList == null)
                return;
            for (var i = 0; i < commandList.length; i++) {
                var current = commandList[i];
                var method = this.availableCommands[current.Command];
                if (method == null) {
                    console.error("Client command " + current.Command + " does not exist in the command set!");
                    continue;
                }
                this[method](current.Params);
            }
        };
        ClientCommander.prototype.commitAllFiles = function () {
        };
        ClientCommander.prototype.executeJs = function (args) {
            eval(args[0]);
        };
        ClientCommander.prototype.setDirty = function (args) {
            var dirty = args[0] == true;
            window._context.isDirty = dirty;
        };
        ClientCommander.prototype.calendarRefresh = function (args) {
            var calendarName = args[0];
            var $el = $("[jb-id='" + calendarName + "']");
            var directiveScope = Joove.Common.getDirectiveScope($el);
            directiveScope._helper.clearCache();
            directiveScope._helper.refresh();
        };
        ClientCommander.prototype.mapRefresh = function (args) {
            var mapName = args[0];
            var mapInstance = Joove.Widgets.MapControl.instancesDic[mapName];
            if (mapInstance != undefined) {
                mapInstance.getData(true);
            }
            else {
                console.log("WARNING (Client Commander): Map instance " + mapName + " not found in mapRefresh function");
            }
        };
        ClientCommander.prototype.mapDirections = function (args) {
            var mapName = args[0], origin = args[1], destination = args[2];
            var mapInstance = Joove.Widgets.MapControl.instancesDic[mapName];
            if (mapInstance != undefined) {
                mapInstance.displayDirections(origin, destination, google.maps.TravelMode.DRIVING);
            }
            else {
                console.log("WARNING (Client Commander): Map instance " + mapName + " not found in mapDirections function");
            }
        };
        ClientCommander.prototype.mapFitToContent = function (args) {
            var mapName = args[0];
            var mapInstance = Joove.Widgets.MapControl.instancesDic[mapName];
            if (mapInstance != undefined) {
                mapInstance.fitToContent();
            }
            else {
                console.log("WARNING (Client Commander): Map instance " + mapName + " not found in mapFitToContent function");
            }
        };
        ClientCommander.prototype.redirect = function (args) {
            var url = args[0];
            if (url == null || url.length === 0) {
                console.error("Url for redirection is null or empty!");
                return;
            }
            if (args.length === 1) {
                window.location.href = url;
            }
            else {
                var target = "_parent";
                if (args.length > 1) {
                    target = args[1];
                }
                var newWindow = window.open(url, target);
                try {
                    newWindow.focus();
                }
                catch (e) {
                    console.error("Your browser does not allow popups. Please, disable it, or add this site to your exception list, if you are using a Pop-Up Blocker.");
                }
            }
        };
        ClientCommander.prototype.closeForm = function () {
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
        };
        ClientCommander.prototype.pushToHistory = function () {
            window._historyManager.pushToHistory(window.location.href);
        };
        ClientCommander.prototype.showModal = function (modalName) {
            if (Array.isArray(modalName)) {
                modalName = modalName[0];
            }
            window._popUpManager.showModalControl(modalName);
        };
        ClientCommander.prototype.hideModal = function (modalName) {
            if (Array.isArray(modalName)) {
                modalName = modalName[0];
            }
            window._popUpManager.hideModalControl(modalName);
        };
        ClientCommander.prototype.showMessage = function (args) {
            var message = args[0];
            var type = args.length > 1 ? args[1] : "Success";
            var redirectUrl = args.length > 2 ? args[2] : null;
            var redirectCb = null;
            if (Joove.Common.stringIsNullOrEmpty(redirectUrl) === false) {
                redirectCb = function () {
                    window.location.href = redirectUrl;
                };
            }
            var text = "";
            if (message != null) {
                if ((typeof message) == "string") {
                    text = message;
                }
                else {
                    text = JSON.stringify(Joove.Cycles.decycleObject(message), null, 2);
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
        };
        ClientCommander.prototype.chartRefresh = function (args) {
            var chartName = Joove.Widgets.ChartHelper.GetChartName(args[0]);
            var charts = Joove.Widgets.ChartHelper.instancesDic[chartName];
            if (charts == null) {
                console.error("Chart instance not found. Name: " + chartName);
                return;
            }
            var index = Joove.Common.getIndexKeyOfControl($(Joove.Common.getLastClickedElement()));
            if (Joove.Common.stringIsNullOrEmpty(index) || charts[index] == null) {
                for (var c in charts) {
                    charts[c].updateChart();
                }
            }
            else {
                charts[index].updateChart();
            }
        };
        ClientCommander.prototype.dataListApplyPredefinedFilters = function (args) {
            var dataListName = args[0];
            var dataListInstance = Joove.Widgets.DataListControl.instancesDic[dataListName];
            if (dataListInstance == null) {
                console.log("Datalist instance not found. Name:" + dataListName);
                return;
            }
            if (!dataListInstance.isInitialized) {
                return;
            }
            Joove.Common.getDirectiveScope(dataListInstance.$element).$applyFilters();
        };
        ClientCommander.prototype.dataListClearFilters = function (args) {
            var dataListName = args[0];
            var dataListInstance = Joove.Widgets.DataListControl.instancesDic[dataListName];
            if (dataListInstance == null) {
                console.log("Datalist instance not found. Name:" + dataListName);
                return;
            }
            if (!dataListInstance.isInitialized) {
                return;
            }
            dataListInstance.removeAllCustomFilters();
            dataListInstance.dataTableInstance.draw(false);
        };
        ClientCommander.prototype.dataListRefresh = function (args) {
            var dataListName = args[0];
            var dataListInstance = Joove.Widgets.DataListControl.instancesDic[dataListName];
            if (dataListInstance == null) {
                console.log("Datalist instance not found. Name:" + dataListName);
                return;
            }
            if (!dataListInstance.isInitialized) {
                return;
            }
            dataListInstance.dataTableInstance.draw(false);
        };
        ClientCommander.prototype.dataListClearItems = function (args) {
            var dataListName = args[0];
            var dataListInstance = Joove.Widgets.DataListControl.instancesDic[dataListName];
            if (dataListInstance == null) {
                console.log("Datalist instance not found. Name:" + dataListName);
                return;
            }
            if (!dataListInstance.isInitialized) {
                return;
            }
            dataListInstance.deselectAll();
        };
        ClientCommander.prototype.dataListUpdateSize = function (args) {
            var dataListName = args[0];
            var dataListInstance = Joove.Widgets.DataListControl.instancesDic[dataListName];
            if (dataListInstance == null) {
                console.log("Datalist instance not found. Name:" + dataListName);
                return;
            }
            if (!dataListInstance.isInitialized) {
                return;
            }
            //Give it some time before executing to allow possible transitions
            setTimeout(function () { dataListInstance.updateDataTableSize(); }, 100);
        };
        ClientCommander.prototype.gridGotoLastPage = function (args) {
            var gridName = args[0];
            var wait = false;
            if (args.length > 1) {
                wait = args[1];
            }
            this.getGridDirectiveScope(gridName, function (scope) {
                scope.$gotoLastPage(wait);
            });
        };
        ClientCommander.prototype.gridGotoPrevPage = function (args) {
            var gridName = args[0];
            this.getGridDirectiveScope(gridName, function (scope) {
                scope.$prevPage();
            });
        };
        ClientCommander.prototype.gridGotoNextPage = function (args) {
            var gridName = args[0];
            this.getGridDirectiveScope(gridName, function (scope) {
                scope.$nextPage();
            });
        };
        ClientCommander.prototype.gridGotoFirstPage = function (args) {
            var gridName = args[0];
            this.getGridDirectiveScope(gridName, function (scope) {
                scope.$gotoFirstPage();
            });
        };
        ClientCommander.prototype.gridGotoPage = function (args) {
            var gridName = args[0];
            var page = args[1] - 1; // since pager is 1 based on appdev
            this.getGridDirectiveScope(gridName, function (scope) {
                scope.$gotoPage(page);
            });
        };
        ClientCommander.prototype.gridRefresh = function (args) {
            var gridName = args[0];
            this.getGridDirectiveScope(gridName, function (scope) {
                if (scope.$refresh) {
                    scope.$refresh();
                }
                else {
                    scope.$gotoPage(0, false, true);
                }
            });
        };
        ClientCommander.prototype.gridSaveState = function (args) {
            var gridName = args[0];
            this.getGridDirectiveScope(gridName, function (scope) {
                var currentPage = scope.$currentPage;
                window.localStorage.setItem(gridName + "_currentPage", JSON.stringify(currentPage));
            });
        };
        ClientCommander.prototype.gridGoToSavedPage = function (args) {
            var gridName = args[0];
            this.getGridDirectiveScope(gridName, function (scope) {
                var currentPage = JSON.parse(window.localStorage.getItem(gridName + "_currentPage"));
                if (currentPage !== null) {
                    scope.$gotoPage(currentPage, false, true);
                }
            });
        };
        ClientCommander.prototype.gridClearState = function (args) {
            var gridName = args[0];
            window.localStorage.removeItem(gridName + "_currentPage");
        };
        ClientCommander.prototype.imageRefresh = function (args) {
            var imageName = args[0];
            this.getImageDirectiveScope(imageName, function (scope) {
                scope.download(true, function (data) {
                    scope.setImage(data);
                });
            });
        };
        ClientCommander.prototype.exportFormToPdf = function (args) {
            var filename = args[0];
            var usePrintMedia = args[1] || false;
            Joove.Common.exportToPdf({ usePrintMedia: usePrintMedia, filename: filename });
        };
        ClientCommander.prototype.exportControlToPdf = function (args) {
            var filename = args[0], controlName = args[1];
            var usePrintMedia = args[2] || false;
            Joove.Common.exportToPdf({ filename: filename, $element: $("[jb-id='" + controlName + "']"), usePrintMedia: usePrintMedia });
        };
        ClientCommander.prototype.dropdownRefresh = function (args) {
            var controlName = args[0];
            $("[jb-id='" + controlName + "']").each(function (i, el) {
                Joove.Common.getDirectiveScope($(el)).fetchData();
            });
        };
        ClientCommander.prototype.download = function (args) {
            var id = args[0];
            window.open(window._context.siteRoot + window._context.currentController + "/DownloadFile?id=" + id, "_blank");
        };
        /* Helper Methods */
        ClientCommander.prototype.getImageDirectiveScope = function (imageName, cb, attemptNumber) {
            var _this = this;
            var $image = this.getControlByName(imageName);
            if ($image.length > 1) {
                console.warn("Client Commander: Image command affecting more than 1 Images with name '" + imageName + "' (propably inside context!)");
                $image.each(function (index, element) {
                    var _this = this;
                    attemptNumber = attemptNumber || 0;
                    if (Joove.Common.directiveScopeIsReady($(this))) {
                        var scope = Joove.Common.getDirectiveScope($(this));
                        cb(scope);
                    }
                    else if (attemptNumber < 30) {
                        setTimeout(function () {
                            _this.getImageDirectiveScope(imageName, cb, ++attemptNumber);
                        }, 50);
                    }
                });
            }
            else {
                attemptNumber = attemptNumber || 0;
                if (Joove.Common.directiveScopeIsReady($image)) {
                    var scope = Joove.Common.getDirectiveScope($image);
                    cb(scope);
                }
                else if (attemptNumber < 30) {
                    setTimeout(function () {
                        _this.getImageDirectiveScope(imageName, cb, ++attemptNumber);
                    }, 50);
                }
            }
        };
        ClientCommander.prototype.getGridDirectiveScope = function (gridName, cb, attemptNumber) {
            var _this = this;
            var $grid = this.getControlByName(gridName);
            if ($grid.length > 1) {
                console.warn("Client Commander: Grid command affecting more than 1 Grids with name '" + gridName + "' (propably inside context!)");
            }
            attemptNumber = attemptNumber || 0;
            if (Joove.Common.directiveScopeIsReady($grid)) {
                var scope = Joove.Common.getDirectiveScope($grid);
                cb(scope);
            }
            else if (attemptNumber < 30) {
                setTimeout(function () {
                    _this.getGridDirectiveScope(gridName, cb, ++attemptNumber);
                }, 50);
            }
        };
        ClientCommander.prototype.getControlByName = function (name) {
            var $ctrl = $("[jb-id='" + name + "']");
            if ($ctrl.length === 0) {
                console.error("Client Commander: Control with name: '" + name + "' not Found");
            }
            return $ctrl;
        };
        return ClientCommander;
    }());
    Joove.ClientCommander = ClientCommander;
    var DebugConsoleStatus = /** @class */ (function () {
        function DebugConsoleStatus() {
        }
        return DebugConsoleStatus;
    }());
    Joove.DebugConsoleStatus = DebugConsoleStatus;
    var DebugConsoleManager = /** @class */ (function () {
        function DebugConsoleManager() {
            this._storageKey = "_debugConsole";
            this.debugConsoleStatus = JSON.parse(window.localStorage.getItem(this._storageKey));
            if (this.debugConsoleStatus == null) {
                this.debugConsoleStatus = new DebugConsoleStatus();
            }
        }
        DebugConsoleManager.prototype.savePosition = function (top, left) {
            if (top != null) {
                this.debugConsoleStatus.top = top;
            }
            if (left != null) {
                this.debugConsoleStatus.left = left;
            }
            window.localStorage.setItem(this._storageKey, JSON.stringify(this.debugConsoleStatus));
        };
        DebugConsoleManager.prototype.saveSize = function (width, bodyHeight, footerHeight) {
            if (width === void 0) { width = 0; }
            if (bodyHeight === void 0) { bodyHeight = 0; }
            if (footerHeight === void 0) { footerHeight = 0; }
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
        };
        DebugConsoleManager.prototype.saveVisibility = function (visible, minimized) {
            if (minimized === void 0) { minimized = false; }
            this.debugConsoleStatus.visible = visible;
            if (visible === false) {
                this.debugConsoleStatus.minimized = false;
            }
            else {
                this.debugConsoleStatus.minimized = minimized;
            }
            window.localStorage.setItem(this._storageKey, JSON.stringify(this.debugConsoleStatus));
        };
        DebugConsoleManager.prototype.clear = function () {
            window.localStorage.removeItem(this._storageKey);
        };
        return DebugConsoleManager;
    }());
    Joove.DebugConsoleManager = DebugConsoleManager;
    var HistoryManager = /** @class */ (function () {
        function HistoryManager() {
            this._storageKey = "_navigationHistory";
            this._maxHistory = 20;
            this.urls = JSON.parse(window.localStorage.getItem(this._storageKey));
            if (this.urls == null) {
                this.urls = new Array();
            }
        }
        HistoryManager.prototype.pushToHistory = function (url) {
            var lastURL = this.urls.length > 0
                ? this.urls[this.urls.length - 1]
                : window._context.siteRoot;
            url = this.trimLastQuestionmarkFromURL(url);
            if (url == null || url.trim().length === 0 || url.trim() === lastURL)
                return;
            if (this.urls.length >= this._maxHistory) {
                this.urls.splice(0, 1);
            }
            this.urls.push(url);
            this.save();
        };
        HistoryManager.prototype.save = function () {
            window.localStorage.setItem(this._storageKey, JSON.stringify(this.urls));
        };
        HistoryManager.prototype.clear = function () {
            window.localStorage.removeItem(this._storageKey);
        };
        HistoryManager.prototype.navigate = function (url) {
            this.pushToHistory(url);
            window.location.href = url;
        };
        HistoryManager.prototype.trimLastQuestionmarkFromURL = function (url) {
            if (url != null && url[url.length - 1] === "?") {
                url = url.substr(0, url.length - 1);
            }
            return url;
        };
        HistoryManager.prototype.back = function () {
            var lastURL = this.urls.length > 0
                ? this.urls[this.urls.length - 1]
                : window._context.siteRoot;
            var currentHref = this.trimLastQuestionmarkFromURL(window.location.href);
            if (lastURL === currentHref) {
                lastURL = this.urls.length > 1
                    ? this.urls[this.urls.length - 2]
                    : window._context.siteRoot;
            }
            this.navigate(lastURL);
        };
        return HistoryManager;
    }());
    Joove.HistoryManager = HistoryManager;
    var ScriptState;
    (function (ScriptState) {
        ScriptState[ScriptState["LOADED"] = 0] = "LOADED";
        ScriptState[ScriptState["LOADING"] = 1] = "LOADING";
    })(ScriptState = Joove.ScriptState || (Joove.ScriptState = {}));
    var ScriptLoaderManager = /** @class */ (function () {
        function ScriptLoaderManager(scriptsStates) {
            this.scriptsStates = scriptsStates;
            this.scriptsStates = {};
        }
        ScriptLoaderManager.prototype.requireScript = function (id, src, callback) {
            var _this = this;
            if (this.scriptsStates[id] === ScriptState.LOADED) {
                return new Promise(function (resolve) {
                    resolve(true);
                });
            }
            this.scriptsStates[id] = ScriptState.LOADING;
            return new Promise(function (resolve) {
                var script = document.createElement("script");
                script.setAttribute("src", src);
                var onLoad = function () {
                    _this.scriptsStates[id] = ScriptState.LOADED;
                    callback && callback();
                    resolve(true);
                };
                script.onload = onLoad;
                document.head.appendChild(script);
            });
        };
        ScriptLoaderManager.prototype.isScriptLoaded = function (id) {
            return this.scriptsStates[id] === ScriptState.LOADED;
        };
        ScriptLoaderManager.prototype.waitForScriptLoad = function (lookFor, callback) {
            var interval = setInterval(function () {
                if (eval("typeof " + lookFor) !== "undefined") {
                    clearInterval(interval);
                    callback();
                }
            }, 50);
        };
        return ScriptLoaderManager;
    }());
    Joove.ScriptLoaderManager = ScriptLoaderManager;
})(Joove || (Joove = {}));