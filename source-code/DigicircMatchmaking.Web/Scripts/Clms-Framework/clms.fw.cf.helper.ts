﻿namespace Joove {

    export class SpamControlHelper {
        private cfHelper: ConditionalFormattingsHelper;
        private $element: JQuery;
        private shouldRun: boolean;        
        private fromActiveElement: boolean;


        private findElement(event: any): JQuery {
            if (event == null) return null;

            if (event.currentTarget) {
                let foundControl = $(event.currentTarget);
                if (foundControl && foundControl.length > 0) {
                    return $(foundControl).eq(0);
                }
            }

            let foundControl = $(`[jb-id='${event}']`);
            if (foundControl && foundControl.length > 0) {
                return $(foundControl).eq(0);
            }

            return null;
        }

        /**
         * Initializes a new Spam Control Helper that, if required, enables/disables an HTML Element.
         * Important: if [a] the element is not found or [b] it does not have a "jb-nospam=true" attribute or [c] anything else went wrong, this Helper does nothing (NO-OP)
         * @param event The event issued
         */
        constructor(event: any) {
            this.$element = this.findElement(event);

            if (this.$element == null || this.$element.attr == null) return;

            this.fromActiveElement = document.activeElement === this.$element.get(0);

            let nospam = this.$element.attr("jb-nospam");
            if (nospam === "true") {
                this.cfHelper = new Joove.ConditionalFormattingsHelper();
                this.shouldRun = true;
            }
        }//end constructor

        /** Enables the control behind the event (using the ConditionalFormattingsHelper), if and only if, it has a "jb-nospam=true" attribute. */
        public Enable() {
            if (this.shouldRun != true) return;

            this.cfHelper.applyFormatting(this.$element, "Enable", null, null);

            if (this.fromActiveElement === false) return;
            
            const userChangedFocus = document.activeElement != null && document.activeElement != document.body;
            
            if (userChangedFocus === false) {              
                this.$element.focus();                
            }
        }

        /** Disables the control behind the event (using the ConditionalFormattingsHelper), if and only if, it has a "jb-nospam=true" attribute. */
        public Disable() {
            if (this.shouldRun != true) return;

            this.cfHelper.applyFormatting(this.$element, "Disable", null, null);            
        }
    }//end class SpamControlHelper

    export class ConditionalFormattingsHelper {

        applyFormatting($element: JQuery, type: string, extraData: any, state: any): void {            
            const controlType = $element.attr("jb-type");

            switch (type) {
                case "Enable":
                    this.enableControl($element, controlType);
                    break;

                case "Hide":
                    this.hideControl($element, controlType, extraData);
                    break;

                case "Disable":
                    this.disableControl($element, controlType);
                    break;

                case "ChangeStyle":
                    this.changeStyleOfControl($element, [extraData], state, controlType);
                    break;

                case "MakeReadOnly":
                    this.makeControlReadOnly($element, controlType);
                    break;

                case "Show":
                    this.showControl($element, controlType, extraData);
                    break;

                case "MakeEditable":
                    this.makeControlEditable($element, controlType);
                    break;

                case "Expand":
                    this.expandControl($element, controlType);
                    break;

                case "Collapse":
                    this.collapseControl($element, controlType);
                    break;

                case "ApplyCssClass":
                    this.applyCssClassToControl($element, extraData, controlType);
                    break;

                case "RemoveCssClass":
                    this.removeCssClassFromControl($element, extraData, controlType);
                    break;

                case "Active":
                    this.makeControlActive($element, controlType);
                    break;

                case "Required":
                    this.makeControlRequired($element, controlType);
                    break;

                case "NotRequired":
                    this.makeControlNotRequired($element, controlType);
                    break;

                case "SetColorRole":
                    this.setColorRole($element, extraData, controlType);
                    break;
            }
        }

        makeControlRequired($element: JQuery, controlType: string): void {
            $element.addClass(Validation.Constants.nowRequiredMark).removeClass(Validation.Constants.nowNotRequiredMark);

            switch (controlType) {
                case "DropDownBox":
                    window._themeManager.setControlState($element, ThemeManager.States.Required);

                    this.applyOnSelect2Widget($element, ($widget) => {
                        window._themeManager.transferClassesOfStateToOtherElement($element, $widget, ThemeManager.States.Required);
                    });                    
                    break;

                default:
                    window._themeManager.setControlState($element, ThemeManager.States.Required);
                    break;
            }
        }

        makeControlNotRequired($element: JQuery, controlType: string): void {            
            $element.addClass(Validation.Constants.nowNotRequiredMark).removeClass(Validation.Constants.nowRequiredMark);
            Validation.UiHelper.unmarkEmptyRequired($element);
            
            switch (controlType) {
                case "DropDownBox":                    
                    this.applyOnSelect2Widget($element, ($widget) => {
                        window._themeManager.transferRemovalOfClassesOfStateToOtherElement($element, $widget, ThemeManager.States.Required);
                    });

                    window._themeManager.removeControlState($element, ThemeManager.States.Required);                    
                    break;

                default:
                    window._themeManager.removeControlState($element, ThemeManager.States.Required);
                    break;
            }
        }

        makeControlActive($element: JQuery, controlType: string): void {
            switch (controlType) {
                case "TabPage":
                    const $pageTitle = this.getTabPageTitle($element);
                    $pageTitle.click();
                    break;

                default:
                    console.error(`Activating control '${controlType}' is not implemented!`);
                    break;
            }
        }

        hideControl($element: JQuery, controlType: string, extraData: string, repeatCounter: number = 0): void {
            switch (controlType) {
                case "CheckBox":
                    const $checkBoxContainer = this.getCheckBoxContainer($element);
                    $checkBoxContainer.hide().addClass("cf-hidden");
                    break;

                case "TabPage":
                    const $pageTitle = this.getTabPageTitle($element);
                    $pageTitle.hide().addClass("cf-hidden");
                    $element.hide();
                    break;

                case "DropDownBox":
                    this.applyOnSelect2Widget($element, ($widget) => { $widget.hide(); });                    
                    break;

                case "RichTextBox":
                    $element.hide().prev("trix-toolbar").hide();
                    break;

                case "FileAttachment":
                    $element.hide();
                    var input = $element.next();
                    if (input != null && input[0] != null && (<any>input[0]).type == "file") {
                        input.hide();
						$(`label[for='${input[0].id}']`).hide();
                    }
                    break;

                case "DataList":
                    //Check if the CF is applied on columns
                    if (extraData != null) {
                        const columnNames = extraData.split("###");
                        const serverSideId = Core.GetElementNameFromId($element.attr("jb-id"));
                        const datalistInstance = Joove.Widgets.DataListControl.instancesDic[serverSideId];

                        if (datalistInstance == undefined) {
                            console.error("Could not get datalist control instance with id: " + serverSideId);
                        } else  {
                            if (datalistInstance.isInitialized) {
                                for (let j = datalistInstance.options.showRowNumbers ? 1 : 0; j < datalistInstance.dataTableInstance.columns().count(); j++) {
                                    const columnInfo = datalistInstance.getColumnInfoForElement($(datalistInstance.dataTableInstance.column(j).header()));
                                    if (columnInfo == undefined) {
                                        datalistInstance.handleError("DATALIST ERROR: ColumnInfo not found for column with index " + j);
                                        continue;
                                    }
                                    if (columnNames.contains(columnInfo.name)) {
                                        datalistInstance.dataTableInstance.column(j).visible(false);
                                    }
                                }
                            }
                            else if (repeatCounter < 20) {
                                repeatCounter = repeatCounter || 0;

                                setTimeout(() => {
                                    this.hideControl($element, controlType, extraData, ++repeatCounter);
                                }, 500);
                            }
                        }
                    } else {
                        $element.parents(".datatables-wrapper").eq(0).hide();
                    }
                    break;
                default:
                    $element.hide();
                    break;
            }

            $element.addClass("cf-hidden");
        }

        showControl($element: JQuery, controlType: string, extraData: string, repeatCounter: number = 0): void {
            switch (controlType) {
                case "CheckBox":
                    const $checkBoxContainer = this.getCheckBoxContainer($element);
                    $checkBoxContainer.show().removeClass("cf-hidden");
                    break;

                case "TabPage":
                    const $pageTitle = this.getTabPageTitle($element);
                    $pageTitle.show().removeClass("cf-hidden");
                    if ($element.hasClass("jb-active")) $element.show();
                    break;

                case "DropDownBox":
                    this.applyOnSelect2Widget($element, ($widget) => { $widget.show(); });                                        
                    break;

                case "RichTextBox":
                    $element.show().prev("trix-toolbar").show();
                    break;

                case "FileAttachment":
                    $element.show();
                    var input = $element.next();
                    if (input != null && input[0] != null && (<any>input[0]).type == "file") {
                        input.show();
						$(`label[for='${input[0].id}']`).show();
                    }
                    break;

                case "DataList":
                    //Check if the CF is applied on columns
                    if (extraData != null) {
                        const columnNames = extraData.split("###");
                        const serverSideId = Core.GetElementNameFromId($element.attr("jb-id"));
                        const datalistInstance = Joove.Widgets.DataListControl.instancesDic[serverSideId];

                        if (datalistInstance == undefined) {
                            console.error("Could not get datalist control instance with id: " + serverSideId);
                        } else {
                            if (datalistInstance.isInitialized) {

                                for (let j = datalistInstance.options.showRowNumbers ? 1 : 0; j < datalistInstance.dataTableInstance.columns().count(); j++) {
                                    const columnInfo = datalistInstance.getColumnInfoForElement($(datalistInstance.dataTableInstance.column(j).header()));
                                    if (columnInfo == undefined) {
                                        datalistInstance.handleError("DATALIST ERROR: ColumnInfo not found for column with index " + j);
                                        continue;
                                    }
                                    if (columnNames.contains(columnInfo.name)) {
                                        datalistInstance.dataTableInstance.column(j).visible(true);
                                    }
                                }
                            } else if (repeatCounter < 20) {
                                repeatCounter = repeatCounter || 0;

                                setTimeout(() => {
                                    this.showControl($element, controlType, extraData, ++repeatCounter);
                                }, 500);
                            }
                        }
                    } else {
                        $element.parents(".datatables-wrapper").eq(0).show();
                    }
                    break;
                default:
                    $element.show();
                    break;
            }
            // keep this here and not inside a switch case
            // since data list container is of HtmlControl Type
            if ($element.hasClass("data-list-control") === true) {
                $(window).trigger('resize');
            }
            $element.removeClass("cf-hidden");
        }

        changeStyleOfControl($element: JQuery, classes: Array<string>, state: boolean, controlType: string): void {
            for (let i = 0; i < classes.length; i++) {
                const cls = classes[i];

                const className = cls.substring(0, cls.lastIndexOf("_"));

                // Add Class
                this.applyCssClassToControl($element, `${className}_${state}`, controlType);
                this.removeCssClassFromControl($element, `${className}_${!state}`, controlType);
            }
        }

        makeControlReadOnly($element: JQuery, controlType: string): void {
            window._themeManager.setControlState($element, ThemeManager.States.Readonly);

            switch (controlType) {
                case "DropDownBox":
                    this.disableDropDown($element);                  
                    break;

                case "OptionButton":
                    $element.find("input[type='radio']").prop("disabled", true);
                    break;

                case "DateTimeBox":
                    $element.prop("disabled", true);
                    break;

                case "CheckBox":
                    $element.data("oldclick", $element.attr("onclick"));
                    $element.attr("onclick", "return false;");
                    break;

                case "FileAttachment":
                    $element.find(".remove").hide();
                    $element.next("input[type='file']").prop("disabled", true);
                    $element.next("input[type='file']").hide();
                    break;

                case "RichTextBox":
                    $element.get(0).contentEditable = "false";
                    break;

                default:
                    $element.prop("readonly", true);
                    break;
            }
        }

        makeControlEditable($element: JQuery, controlType: string): void {
            switch (controlType) {
                case "DropDownBox":
                    this.enableDropDown($element);                   
                    break;

                case "OptionButton":
                    $element.find("input[type='radio']").prop("disabled", false);
                    break;

                case "DateTimeBox":
                    $element.prop("disabled", false);
                    break;

                case "CheckBox":
                    const oldOnClick = $element.data("oldclick");
                    if (oldOnClick == null || oldOnClick === "") {
                        $element.removeAttr("onclick");
                    } else {
                        $element.attr("onclick", oldOnClick);
                    }
                    break;

                case "FileAttachment":
                    $element.find(".remove").show();
                    $element.next("input[type='file']").prop("disabled", false);
                    $element.next("input[type='file']").show();
                    break;

                case "RichTextBox":
                    $element.get(0).contentEditable = "true";
                    break;

                default:
                    $element.prop("readonly", false);
                    break;
            }

            window._themeManager.removeControlState($element, ThemeManager.States.Readonly);
        }

        expandControl($element: JQuery, controlType: string): void {
            switch (controlType) {
                case "FieldSet":
                    const stateIcon = $element.find(' > [jb-type="FieldSetHeader"] .toggle-state-icon');
                    const stateClasses = ThemeManager.DefaultClasses[ThemeManager.States.Expanded].split(' ');
                    if (!stateClasses.some(cssClass => { return stateIcon.hasClass(cssClass); })) {
                        $element.find('.toggle-state-icon').get(0).click();
                    }
                    //window._themeManager.setFieldsetState($element, ThemeManager.States.Expanded);
                    break;

                default:
                    console.error(`Expanding control '${controlType}' is not implemented!`);
                    break;
            }
        }

        collapseControl($element: JQuery, controlType: string): void {
            switch (controlType) {
                case "FieldSet":
                    const stateIcon = $element.find(' > [jb-type="FieldSetHeader"] .toggle-state-icon');
                    const stateClasses = ThemeManager.DefaultClasses[ThemeManager.States.Collapsed].split(' ');
                    if (!stateClasses.some(cssClass => { return stateIcon.hasClass(cssClass); })) {
                        $element.find('.toggle-state-icon').get(0).click();
                    }
                    //window._themeManager.setFieldsetState($element, ThemeManager.States.Collapsed);
                    break;

                default:
                    console.error(`Collapsing control '${controlType}' is not implemented!`);
                    break;
            }
        }

        applyCssClassToControl($element: JQuery, classesToAdd: string, controlType?: string): void {
            switch (controlType) {
                case "DropDownBox":
                    $element.addClass(classesToAdd);
                  
                    this.applyOnSelect2Widget($element, ($widget) => {
                        $widget.addClass(classesToAdd);
                    });

                    break;

                case "CheckBox":
                    const id = $element.attr("jb-id");
                    $(`[jb-id='${id}_State']`, $element.parent()).addClass(classesToAdd);
                    break;

                default:
                    $element.addClass(classesToAdd);
                    break;
            }
        }

        removeCssClassFromControl($element: JQuery, classesToRemove: string, controlType?: string): void {
            switch (controlType) {
                case "CheckBox":
                    const id = $element.attr("jb-id");
                    $(`[jb-id='${id}_State']`, $element.parent()).removeClass(classesToRemove);
                    break;

                case "DropDownBox":
                    $element.removeClass(classesToRemove);

                    this.applyOnSelect2Widget($element, ($widget) => {
                        $widget.removeClass(classesToRemove);
                    });

                    break;

                default:
                    $element.removeClass(classesToRemove);
                    break;
            }
        }

        setColorRole($element: JQuery, newRole: string, controlType?: string): void {
            var currentRole = $element.attr("ui-role-color");
            var classesToAdd = window._themeManager.getCssClassesByRole($element, newRole);
            var classesToRemove = currentRole == null || currentRole.trim() == ""
                ? ""
                : window._themeManager.getCssClassesByRole($element, currentRole);
            
            $element.attr("ui-role-color", newRole);
            $element.removeClass(classesToRemove);
            $element.addClass(classesToAdd);

            switch (controlType) {
                case "TabContainer":
                    this.setColorRole($element.find("[jb-type='TabHeader']").eq(0), newRole, "TabHeader");
                    this.setColorRole($element.find("[jb-type='TabContent']").eq(0), newRole, "TabContent");
                    this.setColorRole($element.find("[jb-type='TabPage']").eq(0), newRole, "TabPage");
                    break;     

                case "FieldSet":
                    this.setColorRole($element.find("[jb-type='FieldSetBody']").eq(0), newRole, "FieldSetBody");
                    this.setColorRole($element.find("[jb-type='FieldSetHeader']").eq(0), newRole, "FieldSetHeader");
                    this.setColorRole($element.find("[jb-type='FieldSetFooter']").eq(0), newRole, "FieldSetFooter");
                    break;

                case "Grid":
                case "DataSourceGrid":
                case "Table":
                    this.setColorRole($element.children("[jb-type='tHeader']").eq(0), newRole, "tHeader");
                    this.setColorRole($element.children("[jb-type='tBody']").eq(0), newRole, "tBody");
                    this.setColorRole($element.children("[jb-type='tFooter']").eq(0), newRole, "tFooter");
                    this.setColorRole($element.find("[jb-type='Pager']").eq(0), newRole, "Pager");
                    this.setColorRole($element.find("[jb-type='AddItemLabel']").eq(0), newRole, "AddItemLabel");
                    break;
            }            
        }

        disableControl($element: JQuery, controlType: string): void {
            switch (controlType) {
                case "TabContainer":
                case "TabHeaderPageTitle":
                case "FieldSet":
                case "TabPage":
                    const $children = this.getChildrenOfContainer($element, controlType);
                    for (let i = 0; i < $children.length; i++) {
                        const $child = $children.eq(i);
                        this.disableControl($child, $child.attr("jb-type"));
                    }
                    break;

                case "DropDownBox":
                    this.disableDropDown($element);
                    break;

                case "OptionButton":
                    $element.find("input[type='radio']").prop("disabled", true);
                    break;

                case "FileAttachment":
                    this.makeControlReadOnly($element, controlType);
                    break;

                case "RichTextBox":
                    $element.get(0).contentEditable = "false";
                    break;

                default:
                    $element.attr("disabled", "true");
                    $element.css("pointer-events", "none");
                    break;
            }

            window._themeManager.setControlState($element, ThemeManager.States.Disabled);
        }

        enableControl($element: JQuery, controlType: string): void {
            switch (controlType) {
                case "TabContainer":
                case "TabHeaderPageTitle":
                case "FieldSet":
                case "TabPage":
                    const $children = this.getChildrenOfContainer($element, controlType);

                    for (let i = 0; i < $children.length; i++) {
                        const $child = $children.eq(i);
                        this.enableControl($child, $child.attr("jb-type"));
                    }
                    break;

                case "DropDownBox":
                    this.enableDropDown($element);
                    break;

                case "OptionButton":
                    $element.find("input[type='radio']").prop("disabled", false);
                    break;

                case "FileAttachment":
                    this.makeControlEditable($element, controlType);
                    break;


                case "RichTextBox":
                    $element.get(0).contentEditable = "true";
                    break;

                default:
                    $element.removeAttr("disabled");
                    $element.css("pointer-events", "auto");
                    break;
            }

            window._themeManager.removeControlState($element, ThemeManager.States.Disabled);
        }

        getChildrenOfContainer($element: JQuery, controlType: string): JQuery {
            switch (controlType) {
                case "TabContainer":
                    return $element.children("[jb-type='TabHeader']").children("[jb-type='TabHeaderPageTitle']");

                case "TabHeaderPageTitle":
                    const index = $element.data("index");
                    const $tabControl = $element.closest("[jb-type='TabContainer']");
                    const $pageContent = $tabControl.children("[jb-type='TabContent']")
                        .children(`[data-index='${index}']`)
                        .eq(0);
                    return $pageContent.find("[jb-type]");
                default:
                    return $element.find("[jb-type]");
            }
        }

        getCheckBoxContainer($element: JQuery): JQuery {
            return $element.parent();
        }

        getTabPageTitle($element: JQuery): JQuery {
            const index = $element.data("index");
            const $tabControl = $element.closest("[jb-type='TabContainer']");
            const $pageTitle = $tabControl.children("[jb-type='TabHeader']")
                .children(`[data-index='${index}']`).eq(0);
            return $pageTitle;
        }

        enableDropDown($element: JQuery) {
            $element.removeAttr("readonly");
            $element.prop("disabled", false);
                        
            this.applyOnSelect2Widget($element, ($widget) => {
                window._themeManager.transferRemovalOfClassesOfStateToOtherElement($element, $widget, ThemeManager.States.Readonly);
            });  
        }

        disableDropDown($element: JQuery) {
            $element.attr("readonly", "readonly");
            $element.prop("disabled", true);

            this.applyOnSelect2Widget($element, ($widget) => {
                window._themeManager.transferClassesOfStateToOtherElement($element, $widget, ThemeManager.States.Readonly);
            });            
        }

        // Handles properly changes applied to select 2 widget,
        // taking into account the fact that it may initialize 
        // some time AFTER native select is rendered
        applyOnSelect2Widget($nativeSelect: JQuery, cb: Function, attempt?: number) {
            var $selectWidget = $nativeSelect.next(".select2");
            attempt = attempt || 0;

            if (($selectWidget == null || $selectWidget.length == 0) && attempt < 100) {
                setTimeout(() => {                                     
                    this.applyOnSelect2Widget($nativeSelect, cb, ++attempt);
                }, 50);
                return;
            }

            cb && cb($selectWidget);
        }
    }
}