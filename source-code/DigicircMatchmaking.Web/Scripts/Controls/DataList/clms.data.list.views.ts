﻿namespace Joove.Widgets {

    export class ListView {
        public ViewName: string;
        public SerializedStatus: any;
        public IsDefault: boolean;
    }

    export class UserViewsHelper {
        constructor(private listRef: DataListControl, private options: {
            fetchCb?: Function,
            saveCb?: Function,
            loadCb?: Function
        }) { }

        private lastStateName: string = "LastState";
        private views: Array<ListView> = [];
        private storedSelectedKeys: Array<any> = [];
        public defaultView: ListView = null;
        public currentView: ListView = null;

        private initialized: Boolean = false;
        private initialViewName: string = null;

        public dataTablesLoadStateFunction: Function;
        public currentViewSerializedStatus: any;
        get loadViewFromHashInUrl(): boolean {
            return window.location.hash.indexOf(this.listRef.clientsideElementId) >= 0;
        }

        public fetchAllAvailableViews() {
            Joove.Core.executeControllerActionNew({
                action: "LoadListViews",
                verb: "POST",
                controller: window._context.currentController,
                postData: {
                    ControlName: this.listRef.serversideElementId,
                },
                cb: (response) => {
                    this.initialized = true;
                    if (response == null) {
                        response = { Data: { Views: [] } };
                    }

                    this.views = response.Data.Views;
                    

                    for (let i = 0; i < this.views.length; i++) {
                        var current = this.views[i];

                        if (current.ViewName == response.Data.DefaultView) {
                            current.IsDefault = true;
                            this.defaultView = current;
                        }
                        else {
                            current.IsDefault = false;
                        }
                    }

                    this.options.fetchCb && this.options.fetchCb();
                },
                onErrorCb: (data) => {
                    console.error("Could not fetch User Views!");
                    this.views = [];
                    this.options.fetchCb && this.options.fetchCb();
                }
            });
        }

        public saveCurrentView(name: string, makeDefault: boolean) {
            var view = new ListView();
            view.SerializedStatus = this.currentViewSerializedStatus;
            view.ViewName = name;
            view.IsDefault = makeDefault;

            this.saveView(view);
        }
        private createKeyForLocalStorageState(): string {
            return `LIST_STATE_${window._context.currentController}|${this.listRef.clientsideElementId}|${window._context.currentUsername}`;
        }
        public saveStateToLocalStorage() {
            if (Common.stringIsNullOrEmpty(window._context.currentUsername)) return;
            var view = new ListView();
            view.SerializedStatus = this.currentViewSerializedStatus;
            view.ViewName = this.lastStateName;
            view.IsDefault = false;
            var key = this.createKeyForLocalStorageState();
            try {
            localStorage.setItem(key, JSON.stringify(view));
            } catch (error) {
                var statusToSave = JSON.parse(view.SerializedStatus);
                //Remove the selected item objects as they most probably be the cause for exceeding the quota exception
                statusToSave.status.selectedItems = [];
                view.SerializedStatus = JSON.stringify(statusToSave);
                //...and retry to save the view
                localStorage.setItem(key, JSON.stringify(view));
            }
        }
        private getStateFromLocalStorage(): ListView {
            var key = this.createKeyForLocalStorageState();
            var viewSerialized = localStorage.getItem(key);
            if (viewSerialized == null) return null;
            var view: ListView = JSON.parse(viewSerialized);
            return view;
        }

        public saveView(view: ListView) {
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
                cb: (data) => {
                    // Remove Existing
                    var index = -1;
                    for (let i = 0; i < this.views.length; i++) {
                        var current = this.views[i];

                        if (current.ViewName == view.ViewName) {
                            index = i;
                            break;
                        }
                    }

                    if (index > -1) {
                        this.views.splice(index, 1);
                    }

                    this.views.push(view);

                    if (view.IsDefault === true) {
                        this.defaultView = view;
                    }

                    this.options.saveCb && this.options.saveCb();
                }
            });
        }

        public deleteView(view: ListView) {
            Joove.Core.executeControllerActionNew({
                action: "DeleteListView",
                verb: "POST",
                controller: window._context.currentController,
                postData: {
                    ControlName: this.listRef.serversideElementId,
                    ViewName: view.ViewName,
                },
                cb: (data) => {
                    var index = this.views.indexOf(view);

                    if (index == -1) return;

                    this.views.splice(index, 1);

                    this.options.loadCb && this.options.loadCb();
                }
            });
        }

        public loadInitialView(redraw: boolean) {
            if (this.initialViewName != null) {
                if (this.loadViewByName(this.initialViewName, false)) {
                    this.initialViewName = null;
                    return;
                }
            }

            //Try to load the view provided in Url hash if it exists
            if (this.loadViewFromHashInUrl) {
                const viewNameInHash = this.getViewNameFromHashInUrl();
                if (this.loadViewByName(viewNameInHash, false)) return;
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
        }
        public getStoredSelectedKeys(reset: boolean): Array<any> {
            if (this.storedSelectedKeys == null) return null;
            var copy = this.storedSelectedKeys.slice(0);
            if (reset === true) {
                this.storedSelectedKeys = null;
            }
            return copy;
        }
        public loadDefaultView(redraw: boolean) {
            if (this.defaultView == null) return;

            this.loadView(this.defaultView, redraw);
            console.log("Loaded default view");
        }

        private getViewNameFromHashInUrl() {
            let viewNameInHash = null;
            const currentListViews = window.location.hash.substr(1).split(";");

            for (let i = 0; i < currentListViews.length; i++) {
                const listViewParts = currentListViews[i].split("|");
                if (listViewParts[0] == this.listRef.clientsideElementId) {
                    viewNameInHash = listViewParts[1];
                    break;
                }
            }

            return viewNameInHash;
        }

        public loadViewByName(viewName: string, redraw: boolean) {
            if (viewName == null || viewName.length == 0) return;

            if (this.initialized !== true) {
                this.initialViewName = viewName;
                return false;
            }

            let selectedView = $.grep(this.views, (v) => { return v.ViewName == viewName; })[0];
            var viewFound = selectedView != undefined;
            if (viewFound) {
                this.loadView(selectedView, redraw);
            }
            
            return viewFound;
        }

        public loadView(view: ListView, redraw: boolean) {
            this.currentView = view;
            this.currentViewSerializedStatus = view.SerializedStatus;

            this.options.loadCb && this.options.loadCb(redraw);

            //Handle the hashtag for the list state
            if (view.ViewName != this.lastStateName) {
                let newListViews = [];
                const currentListViews = window.location.hash.substr(1).split(";");
                for (let i = 0; i < currentListViews.length; i++) {
                    const listViewParts = currentListViews[i].split("|");
                    if (listViewParts[0] == this.listRef.clientsideElementId || currentListViews[i].length == 0) {
                        newListViews.push(this.listRef.clientsideElementId + "|" + view.ViewName);
                    } else {
                        newListViews.push(currentListViews[i]);
                    }
                }

                if (newListViews.length > 0) {
                    window.location.hash = newListViews.join("|");
                }
            }
        }

        public getPopUpContent(): JQuery {
            const self = this;

            const viewNameResource = this.listRef.resources.textResources.ViewName;
            const viewResource = this.listRef.resources.textResources.View;
            const delResource = this.listRef.resources.textResources.DeleteView;
            const saveResource = this.listRef.resources.textResources.SaveView;
            const emptyNameResource = this.listRef.resources.textResources.InvalidViewName;
            const makeDefaultResource = this.listRef.resources.textResources.IsViewDefault;
            const activeResource = this.listRef.resources.textResources.ActiveView;

        //    const saveBtn = `<a jb-type="Button" class='jb-control jb-simple-btn btn btn-sm btn-success save-view'
        //    ui-role-color="success" title='${saveResource}'>
        //    <i class='glyphicon glyphicon-floppy-save'></i>
        //</a>`;

            const saveBtn = `<i jb-type="Iconism" class='jb-control glyphicon glyphicon-floppy-save save-view' ui-role-color="default"></i>`;

            const deleteBtn = `<i jb-type="Iconism" class='jb-control glyphicon glyphicon-trash delete-view' ui-role-color="default"></i>`;
        //    const deleteBtn = `<a jb-type="Button" class='jb-control jb-simple-btn btn btn-sm btn-danger delete-view'
        //    ui-role-color="danger" title='${delResource}'>
        //    <i class='glyphicon glyphicon-trash'></i>
        //</a>`;

            const $content = $(`<table jb-type="Table" class="jb-control status-table">
    <thead>
        <tr>
            <th class="is-name-control">${viewResource}</th>
            <th class="is-default-control">${makeDefaultResource}</th>
            <th class="is-tool-control"></th>
        </tr>
    </thead>
    <tbody>
    </tbody>
</table>`);
            const $tbody = $content.find("tbody");

            const $currentViewRow = $(`<tr>
    <td class="is-name-control">
        <input jb-type="TextBox" class='jb-control form-control current-view-name' type='text'
            placeholder='${viewNameResource}'> 
    </td>
    <td class="is-default-control">
        <div jb-type="HtmlContainer" class="pretty p-smooth p-default jb-control" ui-role-color="default">
            <input type='checkbox' class='default-check'>
            <div class="state">
                <label></label>
            </div>
        </div>
    </td>
    <td class="is-tool-control">${saveBtn}</td>
</tr>`);
            $currentViewRow.appendTo($tbody);

            //$tbody.append("<tr><td colspan='4'>&nbsp;</td></tr>");

            const createViewRow = (view: ListView) => {
                const checked = self.viewsAreEqual(self.defaultView, view) ? "checked = 'checked'" : ""
                const saveCurrentBtn = self.viewsAreEqual(self.currentView, view)
                    ? `${saveBtn}`
                    : "";

                const checkboxInput = `<div jb-type="HtmlContainer" class="pretty p-smooth p-default jb-control" ui-role-color="default">
            <input class='default-check' type='checkbox' ${checked}/>
            <div class="state">
                <label></label>
            </div>
        </div>`;

                const viewName = self.viewsAreEqual(self.currentView, view) ? `${view.ViewName} (${activeResource})` : `${view.ViewName}`;
                const viewNameClasses = self.viewsAreEqual(self.currentView, view) ? `view-link btn btn-primary` : `view-link btn btn-default`;
                const viewNameRole = self.viewsAreEqual(self.currentView, view) ? `primary` : `default`;

                const viewElement = `<a jb-type="Button" class='jb-control jb-link-btn ${viewNameClasses}' ui-role-color="${viewNameRole}">
    <label jb-type="Label" class="jb-control">
        ${viewName}
    </label>
</a>
`;
                const $tr = $(`<tr><td class="is-name-control">${viewElement}</td><td class="is-default-control">${checkboxInput}</td>
<td class="is-tool-control">${saveCurrentBtn} ${deleteBtn}</td></tr>`)

                $tr.data("view", view);

                $tr.appendTo($tbody);
            }

            // Current View On Top
            for (let i = 0; i < this.views.length; i++) {
                var view = this.views[i];

                if (!this.viewsAreEqual(this.currentView, view)) continue;

                createViewRow(view);
            }

            //$tbody.append("<tr><td colspan='4'>&nbsp;</td></tr>");

            // Other Views
            for (let i = 0; i < this.views.length; i++) {
                var view = this.views[i];

                if (this.viewsAreEqual(this.currentView, view)) continue;

                createViewRow(view);
            }

            // listeners
            $tbody.find(".save-view").on("click", function (this) {
                var $this = $(this);
                var relatedView: ListView = $this.closest("tr").data("view");
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

            $tbody.find("a.view-link").on("click", function (this) {
                var $this = $(this);
                var relatedView = $this.closest("tr").data("view");

                self.closePopUp($content);
                self.loadView(relatedView, true);
            });

            $tbody.find(".default-check").on("change", function (this) {
                var $this = $(this);
                var relatedView = $this.closest("tr").data("view");

                if (relatedView == null) return;

                var isChecked = $this.is(":checked");

                if (isChecked == true) {
                    $tbody.find(".default-check").prop("checked", false);
                    $this.prop("checked", true);
                    self.defaultView = relatedView;
                }

                relatedView.IsDefault = isChecked;
                self.saveView(relatedView);
            });

            $tbody.find(".delete-view").on("click", function (this) {
                if (!confirm(self.listRef.resources.textResources.DeleteConfirmation)) return;

                var $this = $(this);
                var $closestRow = $this.closest("tr");
                var relatedView = $closestRow.data("view");

                self.deleteView(relatedView);
                $closestRow.remove();
            });

            return $content;
        }

        private viewsAreEqual(view1: ListView, view2: ListView) {
            if (view1 == undefined || view2 == undefined || view1.SerializedStatus == undefined || view2.SerializedStatus == undefined) return false;
            if (view1.ViewName === view2.ViewName) return true;
            var view1Status = JSON.parse(view1.SerializedStatus);
            var view2Status = JSON.parse(view2.SerializedStatus);

            //Remove timestamp and check everything else
            delete (view1Status.time);
            delete (view2Status.time);

            return Common.objectsAreEqualGenericDeepComparison(view1Status, view2Status);
        }

        private closePopUp($popUpContent) {
            if (this.listRef.options.useCustomModal) {
                this.listRef.hideCustomModal($popUpContent.closest(".modal"));
            } else {
                $popUpContent.closest(".modal").modal("hide");
            }
        }

        public viewStatusIsValid(viewState: any): boolean {
            try {
                var listCols: Array<DataListColumnInfo> = window[this.listRef.serversideElementId + "_ColumnInfo"];
                var statusCols: Array<DataListColumnInfo> = viewState.status.columnInfo;

                // Status contains different number of columns than list definition
                if (listCols.length != statusCols.length) {
                    console.error(`Saved view has ${statusCols.length} columns, list definition has ${listCols.length}`);
                    return false;
                }

                var findColByName = (name: string): DataListColumnInfo => {
                    for (let i = 0; i < listCols.length; i++) {
                        var currentCol = listCols[i];
                        if (currentCol.name == name) return currentCol;
                    }

                    return null;
                }

                for (let i = 0; i < statusCols.length; i++) {
                    var currentCol = statusCols[i];
                    var colInListDefinition = findColByName(currentCol.name);

                    // Status contains a column that does not exist in definition
                    if (colInListDefinition == null) {
                        console.error(`Column '${currentCol.name}' of saved view not found in list definition`);
                        return false;
                    }

                    // column exists but is of different DT
                    if (colInListDefinition.mambaDataType != currentCol.mambaDataType) {
                        console.error(`Column '${currentCol.name}' of saved view has different datatype with list definition`);
                        return false;
                    }

                    // searchable missmatch
                    if (colInListDefinition.searchable != currentCol.searchable) {
                        console.error(`Column '${currentCol.name}' of saved view has different searchable flag with list definition`);
                        return false;
                    }

                    // orderable missmatch
                    if (colInListDefinition.orderable != currentCol.orderable) {
                        console.error(`Column '${currentCol.name}' of saved view has different orderable flag with list definition`);
                        return false;
                    }

                    // groupable missmatch
                    if (colInListDefinition.groupable != currentCol.groupable) {
                        console.error(`Column '${currentCol.name}' of saved view has different groupable flag with list definition`);
                        return false;
                    }

                    // aggregators support missmatch  
                    if (colInListDefinition.supportsAggregators != currentCol.supportsAggregators) {
                        console.error(`Column '${currentCol.name}' of saved view has different Aggregators Support flag with list definition`);
                        return false;
                    }

                    // Set latest formatting!
                    currentCol.formatting = colInListDefinition.formatting;
                    //...and also for any possible filters
                    const columnFilters = ($.grep(viewState.status.filters, (f) => { return (f as any).column.name === currentCol.name }) as any);
                    for (let j = 0; j < columnFilters.length; j++) {
                        columnFilters[j].column = colInListDefinition;
                    }
                    //Set latest caption
                    currentCol.caption = colInListDefinition.caption;
                }
                return true;
            }
            catch (e) {
                console.error(`Error trying to validate Saved view.`, e);
                return false;
            }
        }
    }
}