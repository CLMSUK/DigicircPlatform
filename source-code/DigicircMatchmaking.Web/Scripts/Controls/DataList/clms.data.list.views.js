var Joove;
(function (Joove) {
    var Widgets;
    (function (Widgets) {
        var ListView = /** @class */ (function () {
            function ListView() {
            }
            return ListView;
        }());
        Widgets.ListView = ListView;
        var UserViewsHelper = /** @class */ (function () {
            function UserViewsHelper(listRef, options) {
                this.listRef = listRef;
                this.options = options;
                this.lastStateName = "LastState";
                this.views = [];
                this.storedSelectedKeys = [];
                this.defaultView = null;
                this.currentView = null;
                this.initialized = false;
                this.initialViewName = null;
            }
            Object.defineProperty(UserViewsHelper.prototype, "loadViewFromHashInUrl", {
                get: function () {
                    return window.location.hash.indexOf(this.listRef.clientsideElementId) >= 0;
                },
                enumerable: false,
                configurable: true
            });
            UserViewsHelper.prototype.fetchAllAvailableViews = function () {
                var _this = this;
                Joove.Core.executeControllerActionNew({
                    action: "LoadListViews",
                    verb: "POST",
                    controller: window._context.currentController,
                    postData: {
                        ControlName: this.listRef.serversideElementId,
                    },
                    cb: function (response) {
                        _this.initialized = true;
                        if (response == null) {
                            response = { Data: { Views: [] } };
                        }
                        _this.views = response.Data.Views;
                        for (var i = 0; i < _this.views.length; i++) {
                            var current = _this.views[i];
                            if (current.ViewName == response.Data.DefaultView) {
                                current.IsDefault = true;
                                _this.defaultView = current;
                            }
                            else {
                                current.IsDefault = false;
                            }
                        }
                        _this.options.fetchCb && _this.options.fetchCb();
                    },
                    onErrorCb: function (data) {
                        console.error("Could not fetch User Views!");
                        _this.views = [];
                        _this.options.fetchCb && _this.options.fetchCb();
                    }
                });
            };
            UserViewsHelper.prototype.saveCurrentView = function (name, makeDefault) {
                var view = new ListView();
                view.SerializedStatus = this.currentViewSerializedStatus;
                view.ViewName = name;
                view.IsDefault = makeDefault;
                this.saveView(view);
            };
            UserViewsHelper.prototype.createKeyForLocalStorageState = function () {
                return "LIST_STATE_" + window._context.currentController + "|" + this.listRef.clientsideElementId + "|" + window._context.currentUsername;
            };
            UserViewsHelper.prototype.saveStateToLocalStorage = function () {
                if (Joove.Common.stringIsNullOrEmpty(window._context.currentUsername))
                    return;
                var view = new ListView();
                view.SerializedStatus = this.currentViewSerializedStatus;
                view.ViewName = this.lastStateName;
                view.IsDefault = false;
                var key = this.createKeyForLocalStorageState();
                try {
                    localStorage.setItem(key, JSON.stringify(view));
                }
                catch (error) {
                    var statusToSave = JSON.parse(view.SerializedStatus);
                    //Remove the selected item objects as they most probably be the cause for exceeding the quota exception
                    statusToSave.status.selectedItems = [];
                    view.SerializedStatus = JSON.stringify(statusToSave);
                    //...and retry to save the view
                    localStorage.setItem(key, JSON.stringify(view));
                }
            };
            UserViewsHelper.prototype.getStateFromLocalStorage = function () {
                var key = this.createKeyForLocalStorageState();
                var viewSerialized = localStorage.getItem(key);
                if (viewSerialized == null)
                    return null;
                var view = JSON.parse(viewSerialized);
                return view;
            };
            UserViewsHelper.prototype.saveView = function (view) {
                var _this = this;
                Joove.Core.executeControllerActionNew({
                    action: "SaveListView",
                    verb: "POST",
                    controller: window._context.currentController,
                    postData: {
                        ControlName: this.listRef.serversideElementId,
                        SerializedStatus: view.SerializedStatus,
                        ViewName: view.ViewName,
                        SetAsDefault: view.IsDefault
                    },
                    cb: function (data) {
                        // Remove Existing
                        var index = -1;
                        for (var i = 0; i < _this.views.length; i++) {
                            var current = _this.views[i];
                            if (current.ViewName == view.ViewName) {
                                index = i;
                                break;
                            }
                        }
                        if (index > -1) {
                            _this.views.splice(index, 1);
                        }
                        _this.views.push(view);
                        if (view.IsDefault === true) {
                            _this.defaultView = view;
                        }
                        _this.options.saveCb && _this.options.saveCb();
                    }
                });
            };
            UserViewsHelper.prototype.deleteView = function (view) {
                var _this = this;
                Joove.Core.executeControllerActionNew({
                    action: "DeleteListView",
                    verb: "POST",
                    controller: window._context.currentController,
                    postData: {
                        ControlName: this.listRef.serversideElementId,
                        ViewName: view.ViewName,
                    },
                    cb: function (data) {
                        var index = _this.views.indexOf(view);
                        if (index == -1)
                            return;
                        _this.views.splice(index, 1);
                        _this.options.loadCb && _this.options.loadCb();
                    }
                });
            };
            UserViewsHelper.prototype.loadInitialView = function (redraw) {
                if (this.initialViewName != null) {
                    if (this.loadViewByName(this.initialViewName, false)) {
                        this.initialViewName = null;
                        return;
                    }
                }
                //Try to load the view provided in Url hash if it exists
                if (this.loadViewFromHashInUrl) {
                    var viewNameInHash = this.getViewNameFromHashInUrl();
                    if (this.loadViewByName(viewNameInHash, false))
                        return;
                }
                var lastState = this.listRef.options.rememberLastState == true
                    ? this.getStateFromLocalStorage()
                    : null;
                if (lastState != null) {
                    this.loadView(lastState, redraw);
                    console.log("Loaded list state from local storage");
                    try {
                        this.storedSelectedKeys = this.listRef.options.rememberSelectedItems == true
                            ? JSON.parse(lastState.SerializedStatus).status.selectedKeys
                            : null;
                    }
                    catch (e) {
                        this.storedSelectedKeys = null;
                        console.error("Could not load selected keys from saved state!");
                    }
                }
                else {
                    this.loadDefaultView(redraw);
                }
            };
            UserViewsHelper.prototype.getStoredSelectedKeys = function (reset) {
                if (this.storedSelectedKeys == null)
                    return null;
                var copy = this.storedSelectedKeys.slice(0);
                if (reset === true) {
                    this.storedSelectedKeys = null;
                }
                return copy;
            };
            UserViewsHelper.prototype.loadDefaultView = function (redraw) {
                if (this.defaultView == null)
                    return;
                this.loadView(this.defaultView, redraw);
                console.log("Loaded default view");
            };
            UserViewsHelper.prototype.getViewNameFromHashInUrl = function () {
                var viewNameInHash = null;
                var currentListViews = window.location.hash.substr(1).split(";");
                for (var i = 0; i < currentListViews.length; i++) {
                    var listViewParts = currentListViews[i].split("|");
                    if (listViewParts[0] == this.listRef.clientsideElementId) {
                        viewNameInHash = listViewParts[1];
                        break;
                    }
                }
                return viewNameInHash;
            };
            UserViewsHelper.prototype.loadViewByName = function (viewName, redraw) {
                if (viewName == null || viewName.length == 0)
                    return;
                if (this.initialized !== true) {
                    this.initialViewName = viewName;
                    return false;
                }
                var selectedView = $.grep(this.views, function (v) { return v.ViewName == viewName; })[0];
                var viewFound = selectedView != undefined;
                if (viewFound) {
                    this.loadView(selectedView, redraw);
                }
                return viewFound;
            };
            UserViewsHelper.prototype.loadView = function (view, redraw) {
                this.currentView = view;
                this.currentViewSerializedStatus = view.SerializedStatus;
                this.options.loadCb && this.options.loadCb(redraw);
                //Handle the hashtag for the list state
                if (view.ViewName != this.lastStateName) {
                    var newListViews = [];
                    var currentListViews = window.location.hash.substr(1).split(";");
                    for (var i = 0; i < currentListViews.length; i++) {
                        var listViewParts = currentListViews[i].split("|");
                        if (listViewParts[0] == this.listRef.clientsideElementId || currentListViews[i].length == 0) {
                            newListViews.push(this.listRef.clientsideElementId + "|" + view.ViewName);
                        }
                        else {
                            newListViews.push(currentListViews[i]);
                        }
                    }
                    if (newListViews.length > 0) {
                        window.location.hash = newListViews.join("|");
                    }
                }
            };
            UserViewsHelper.prototype.getPopUpContent = function () {
                var self = this;
                var viewNameResource = this.listRef.resources.textResources.ViewName;
                var viewResource = this.listRef.resources.textResources.View;
                var delResource = this.listRef.resources.textResources.DeleteView;
                var saveResource = this.listRef.resources.textResources.SaveView;
                var emptyNameResource = this.listRef.resources.textResources.InvalidViewName;
                var makeDefaultResource = this.listRef.resources.textResources.IsViewDefault;
                var activeResource = this.listRef.resources.textResources.ActiveView;
                //    const saveBtn = `<a jb-type="Button" class='jb-control jb-simple-btn btn btn-sm btn-success save-view'
                //    ui-role-color="success" title='${saveResource}'>
                //    <i class='glyphicon glyphicon-floppy-save'></i>
                //</a>`;
                var saveBtn = "<i jb-type=\"Iconism\" class='jb-control glyphicon glyphicon-floppy-save save-view' ui-role-color=\"default\"></i>";
                var deleteBtn = "<i jb-type=\"Iconism\" class='jb-control glyphicon glyphicon-trash delete-view' ui-role-color=\"default\"></i>";
                //    const deleteBtn = `<a jb-type="Button" class='jb-control jb-simple-btn btn btn-sm btn-danger delete-view'
                //    ui-role-color="danger" title='${delResource}'>
                //    <i class='glyphicon glyphicon-trash'></i>
                //</a>`;
                var $content = $("<table jb-type=\"Table\" class=\"jb-control status-table\">\n    <thead>\n        <tr>\n            <th class=\"is-name-control\">" + viewResource + "</th>\n            <th class=\"is-default-control\">" + makeDefaultResource + "</th>\n            <th class=\"is-tool-control\"></th>\n        </tr>\n    </thead>\n    <tbody>\n    </tbody>\n</table>");
                var $tbody = $content.find("tbody");
                var $currentViewRow = $("<tr>\n    <td class=\"is-name-control\">\n        <input jb-type=\"TextBox\" class='jb-control form-control current-view-name' type='text'\n            placeholder='" + viewNameResource + "'> \n    </td>\n    <td class=\"is-default-control\">\n        <div jb-type=\"HtmlContainer\" class=\"pretty p-smooth p-default jb-control\" ui-role-color=\"default\">\n            <input type='checkbox' class='default-check'>\n            <div class=\"state\">\n                <label></label>\n            </div>\n        </div>\n    </td>\n    <td class=\"is-tool-control\">" + saveBtn + "</td>\n</tr>");
                $currentViewRow.appendTo($tbody);
                //$tbody.append("<tr><td colspan='4'>&nbsp;</td></tr>");
                var createViewRow = function (view) {
                    var checked = self.viewsAreEqual(self.defaultView, view) ? "checked = 'checked'" : "";
                    var saveCurrentBtn = self.viewsAreEqual(self.currentView, view)
                        ? "" + saveBtn
                        : "";
                    var checkboxInput = "<div jb-type=\"HtmlContainer\" class=\"pretty p-smooth p-default jb-control\" ui-role-color=\"default\">\n            <input class='default-check' type='checkbox' " + checked + "/>\n            <div class=\"state\">\n                <label></label>\n            </div>\n        </div>";
                    var viewName = self.viewsAreEqual(self.currentView, view) ? view.ViewName + " (" + activeResource + ")" : "" + view.ViewName;
                    var viewNameClasses = self.viewsAreEqual(self.currentView, view) ? "view-link btn btn-primary" : "view-link btn btn-default";
                    var viewNameRole = self.viewsAreEqual(self.currentView, view) ? "primary" : "default";
                    var viewElement = "<a jb-type=\"Button\" class='jb-control jb-link-btn " + viewNameClasses + "' ui-role-color=\"" + viewNameRole + "\">\n    <label jb-type=\"Label\" class=\"jb-control\">\n        " + viewName + "\n    </label>\n</a>\n";
                    var $tr = $("<tr><td class=\"is-name-control\">" + viewElement + "</td><td class=\"is-default-control\">" + checkboxInput + "</td>\n<td class=\"is-tool-control\">" + saveCurrentBtn + " " + deleteBtn + "</td></tr>");
                    $tr.data("view", view);
                    $tr.appendTo($tbody);
                };
                // Current View On Top
                for (var i = 0; i < this.views.length; i++) {
                    var view = this.views[i];
                    if (!this.viewsAreEqual(this.currentView, view))
                        continue;
                    createViewRow(view);
                }
                //$tbody.append("<tr><td colspan='4'>&nbsp;</td></tr>");
                // Other Views
                for (var i = 0; i < this.views.length; i++) {
                    var view = this.views[i];
                    if (this.viewsAreEqual(this.currentView, view))
                        continue;
                    createViewRow(view);
                }
                // listeners
                $tbody.find(".save-view").on("click", function () {
                    var $this = $(this);
                    var relatedView = $this.closest("tr").data("view");
                    var viewName = "";
                    var isDefault = false;
                    if (relatedView == null) {
                        viewName = $currentViewRow.find(".current-view-name").eq(0).val();
                        isDefault = $currentViewRow.find(".default-check").eq(0).is(":checked");
                        if (viewName == null || viewName.trim() == "") {
                            alert(emptyNameResource);
                            return;
                        }
                    }
                    else {
                        viewName = relatedView.ViewName;
                        isDefault = relatedView.IsDefault;
                    }
                    self.saveCurrentView(viewName, isDefault);
                    self.closePopUp($content);
                });
                $tbody.find("a.view-link").on("click", function () {
                    var $this = $(this);
                    var relatedView = $this.closest("tr").data("view");
                    self.closePopUp($content);
                    self.loadView(relatedView, true);
                });
                $tbody.find(".default-check").on("change", function () {
                    var $this = $(this);
                    var relatedView = $this.closest("tr").data("view");
                    if (relatedView == null)
                        return;
                    var isChecked = $this.is(":checked");
                    if (isChecked == true) {
                        $tbody.find(".default-check").prop("checked", false);
                        $this.prop("checked", true);
                        self.defaultView = relatedView;
                    }
                    relatedView.IsDefault = isChecked;
                    self.saveView(relatedView);
                });
                $tbody.find(".delete-view").on("click", function () {
                    if (!confirm(self.listRef.resources.textResources.DeleteConfirmation))
                        return;
                    var $this = $(this);
                    var $closestRow = $this.closest("tr");
                    var relatedView = $closestRow.data("view");
                    self.deleteView(relatedView);
                    $closestRow.remove();
                });
                return $content;
            };
            UserViewsHelper.prototype.viewsAreEqual = function (view1, view2) {
                if (view1 == undefined || view2 == undefined || view1.SerializedStatus == undefined || view2.SerializedStatus == undefined)
                    return false;
                if (view1.ViewName === view2.ViewName)
                    return true;
                var view1Status = JSON.parse(view1.SerializedStatus);
                var view2Status = JSON.parse(view2.SerializedStatus);
                //Remove timestamp and check everything else
                delete (view1Status.time);
                delete (view2Status.time);
                return Joove.Common.objectsAreEqualGenericDeepComparison(view1Status, view2Status);
            };
            UserViewsHelper.prototype.closePopUp = function ($popUpContent) {
                if (this.listRef.options.useCustomModal) {
                    this.listRef.hideCustomModal($popUpContent.closest(".modal"));
                }
                else {
                    $popUpContent.closest(".modal").modal("hide");
                }
            };
            UserViewsHelper.prototype.viewStatusIsValid = function (viewState) {
                try {
                    var listCols = window[this.listRef.serversideElementId + "_ColumnInfo"];
                    var statusCols = viewState.status.columnInfo;
                    // Status contains different number of columns than list definition
                    if (listCols.length != statusCols.length) {
                        console.error("Saved view has " + statusCols.length + " columns, list definition has " + listCols.length);
                        return false;
                    }
                    var findColByName = function (name) {
                        for (var i = 0; i < listCols.length; i++) {
                            var currentCol = listCols[i];
                            if (currentCol.name == name)
                                return currentCol;
                        }
                        return null;
                    };
                    for (var i = 0; i < statusCols.length; i++) {
                        var currentCol = statusCols[i];
                        var colInListDefinition = findColByName(currentCol.name);
                        // Status contains a column that does not exist in definition
                        if (colInListDefinition == null) {
                            console.error("Column '" + currentCol.name + "' of saved view not found in list definition");
                            return false;
                        }
                        // column exists but is of different DT
                        if (colInListDefinition.mambaDataType != currentCol.mambaDataType) {
                            console.error("Column '" + currentCol.name + "' of saved view has different datatype with list definition");
                            return false;
                        }
                        // searchable missmatch
                        if (colInListDefinition.searchable != currentCol.searchable) {
                            console.error("Column '" + currentCol.name + "' of saved view has different searchable flag with list definition");
                            return false;
                        }
                        // orderable missmatch
                        if (colInListDefinition.orderable != currentCol.orderable) {
                            console.error("Column '" + currentCol.name + "' of saved view has different orderable flag with list definition");
                            return false;
                        }
                        // groupable missmatch
                        if (colInListDefinition.groupable != currentCol.groupable) {
                            console.error("Column '" + currentCol.name + "' of saved view has different groupable flag with list definition");
                            return false;
                        }
                        // aggregators support missmatch  
                        if (colInListDefinition.supportsAggregators != currentCol.supportsAggregators) {
                            console.error("Column '" + currentCol.name + "' of saved view has different Aggregators Support flag with list definition");
                            return false;
                        }
                        // Set latest formatting!
                        currentCol.formatting = colInListDefinition.formatting;
                        //...and also for any possible filters
                        var columnFilters = $.grep(viewState.status.filters, function (f) { return f.column.name === currentCol.name; });
                        for (var j = 0; j < columnFilters.length; j++) {
                            columnFilters[j].column = colInListDefinition;
                        }
                        //Set latest caption
                        currentCol.caption = colInListDefinition.caption;
                    }
                    return true;
                }
                catch (e) {
                    console.error("Error trying to validate Saved view.", e);
                    return false;
                }
            };
            return UserViewsHelper;
        }());
        Widgets.UserViewsHelper = UserViewsHelper;
    })(Widgets = Joove.Widgets || (Joove.Widgets = {}));
})(Joove || (Joove = {}));
