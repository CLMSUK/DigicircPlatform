var Joove;
(function (Joove) {
    var SpamControlHelper = /** @class */ (function () {
        /**
         * Initializes a new Spam Control Helper that, if required, enables/disables an HTML Element.
         * Important: if [a] the element is not found or [b] it does not have a "jb-nospam=true" attribute or [c] anything else went wrong, this Helper does nothing (NO-OP)
         * @param event The event issued
         */
        function SpamControlHelper(event) {
            this.$element = this.findElement(event);
            if (this.$element == null || this.$element.attr == null)
                return;
            this.fromActiveElement = document.activeElement === this.$element.get(0);
            var nospam = this.$element.attr("jb-nospam");
            if (nospam === "true") {
                this.cfHelper = new Joove.ConditionalFormattingsHelper();
                this.shouldRun = true;
            }
        } //end constructor
        SpamControlHelper.prototype.findElement = function (event) {
            if (event == null)
                return null;
            if (event.currentTarget) {
                var foundControl_1 = $(event.currentTarget);
                if (foundControl_1 && foundControl_1.length > 0) {
                    return $(foundControl_1).eq(0);
                }
            }
            var foundControl = $("[jb-id='" + event + "']");
            if (foundControl && foundControl.length > 0) {
                return $(foundControl).eq(0);
            }
            return null;
        };
        /** Enables the control behind the event (using the ConditionalFormattingsHelper), if and only if, it has a "jb-nospam=true" attribute. */
        SpamControlHelper.prototype.Enable = function () {
            if (this.shouldRun != true)
                return;
            this.cfHelper.applyFormatting(this.$element, "Enable", null, null);
            if (this.fromActiveElement === false)
                return;
            var userChangedFocus = document.activeElement != null && document.activeElement != document.body;
            if (userChangedFocus === false) {
                this.$element.focus();
            }
        };
        /** Disables the control behind the event (using the ConditionalFormattingsHelper), if and only if, it has a "jb-nospam=true" attribute. */
        SpamControlHelper.prototype.Disable = function () {
            if (this.shouldRun != true)
                return;
            this.cfHelper.applyFormatting(this.$element, "Disable", null, null);
        };
        return SpamControlHelper;
    }()); //end class SpamControlHelper
    Joove.SpamControlHelper = SpamControlHelper;
    var ConditionalFormattingsHelper = /** @class */ (function () {
        function ConditionalFormattingsHelper() {
        }
        ConditionalFormattingsHelper.prototype.applyFormatting = function ($element, type, extraData, state) {
            var controlType = $element.attr("jb-type");
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
        };
        ConditionalFormattingsHelper.prototype.makeControlRequired = function ($element, controlType) {
            $element.addClass(Joove.Validation.Constants.nowRequiredMark).removeClass(Joove.Validation.Constants.nowNotRequiredMark);
            switch (controlType) {
                case "DropDownBox":
                    window._themeManager.setControlState($element, Joove.ThemeManager.States.Required);
                    this.applyOnSelect2Widget($element, function ($widget) {
                        window._themeManager.transferClassesOfStateToOtherElement($element, $widget, Joove.ThemeManager.States.Required);
                    });
                    break;
                default:
                    window._themeManager.setControlState($element, Joove.ThemeManager.States.Required);
                    break;
            }
        };
        ConditionalFormattingsHelper.prototype.makeControlNotRequired = function ($element, controlType) {
            $element.addClass(Joove.Validation.Constants.nowNotRequiredMark).removeClass(Joove.Validation.Constants.nowRequiredMark);
            Joove.Validation.UiHelper.unmarkEmptyRequired($element);
            switch (controlType) {
                case "DropDownBox":
                    this.applyOnSelect2Widget($element, function ($widget) {
                        window._themeManager.transferRemovalOfClassesOfStateToOtherElement($element, $widget, Joove.ThemeManager.States.Required);
                    });
                    window._themeManager.removeControlState($element, Joove.ThemeManager.States.Required);
                    break;
                default:
                    window._themeManager.removeControlState($element, Joove.ThemeManager.States.Required);
                    break;
            }
        };
        ConditionalFormattingsHelper.prototype.makeControlActive = function ($element, controlType) {
            switch (controlType) {
                case "TabPage":
                    var $pageTitle = this.getTabPageTitle($element);
                    $pageTitle.click();
                    break;
                default:
                    console.error("Activating control '" + controlType + "' is not implemented!");
                    break;
            }
        };
        ConditionalFormattingsHelper.prototype.hideControl = function ($element, controlType, extraData, repeatCounter) {
            var _this = this;
            if (repeatCounter === void 0) { repeatCounter = 0; }
            switch (controlType) {
                case "CheckBox":
                    var $checkBoxContainer = this.getCheckBoxContainer($element);
                    $checkBoxContainer.hide().addClass("cf-hidden");
                    break;
                case "TabPage":
                    var $pageTitle = this.getTabPageTitle($element);
                    $pageTitle.hide().addClass("cf-hidden");
                    $element.hide();
                    break;
                case "DropDownBox":
                    this.applyOnSelect2Widget($element, function ($widget) { $widget.hide(); });
                    break;
                case "RichTextBox":
                    $element.hide().prev("trix-toolbar").hide();
                    break;
                case "FileAttachment":
                    $element.hide();
                    var input = $element.next();
                    if (input != null && input[0] != null && input[0].type == "file") {
                        input.hide();
                        $("label[for='" + input[0].id + "']").hide();
                    }
                    break;
                case "DataList":
                    //Check if the CF is applied on columns
                    if (extraData != null) {
                        var columnNames = extraData.split("###");
                        var serverSideId = Joove.Core.GetElementNameFromId($element.attr("jb-id"));
                        var datalistInstance = Joove.Widgets.DataListControl.instancesDic[serverSideId];
                        if (datalistInstance == undefined) {
                            console.error("Could not get datalist control instance with id: " + serverSideId);
                        }
                        else {
                            if (datalistInstance.isInitialized) {
                                for (var j = datalistInstance.options.showRowNumbers ? 1 : 0; j < datalistInstance.dataTableInstance.columns().count(); j++) {
                                    var columnInfo = datalistInstance.getColumnInfoForElement($(datalistInstance.dataTableInstance.column(j).header()));
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
                                setTimeout(function () {
                                    _this.hideControl($element, controlType, extraData, ++repeatCounter);
                                }, 500);
                            }
                        }
                    }
                    else {
                        $element.parents(".datatables-wrapper").eq(0).hide();
                    }
                    break;
                default:
                    $element.hide();
                    break;
            }
            $element.addClass("cf-hidden");
        };
        ConditionalFormattingsHelper.prototype.showControl = function ($element, controlType, extraData, repeatCounter) {
            var _this = this;
            if (repeatCounter === void 0) { repeatCounter = 0; }
            switch (controlType) {
                case "CheckBox":
                    var $checkBoxContainer = this.getCheckBoxContainer($element);
                    $checkBoxContainer.show().removeClass("cf-hidden");
                    break;
                case "TabPage":
                    var $pageTitle = this.getTabPageTitle($element);
                    $pageTitle.show().removeClass("cf-hidden");
                    if ($element.hasClass("jb-active"))
                        $element.show();
                    break;
                case "DropDownBox":
                    this.applyOnSelect2Widget($element, function ($widget) { $widget.show(); });
                    break;
                case "RichTextBox":
                    $element.show().prev("trix-toolbar").show();
                    break;
                case "FileAttachment":
                    $element.show();
                    var input = $element.next();
                    if (input != null && input[0] != null && input[0].type == "file") {
                        input.show();
                        $("label[for='" + input[0].id + "']").show();
                    }
                    break;
                case "DataList":
                    //Check if the CF is applied on columns
                    if (extraData != null) {
                        var columnNames = extraData.split("###");
                        var serverSideId = Joove.Core.GetElementNameFromId($element.attr("jb-id"));
                        var datalistInstance = Joove.Widgets.DataListControl.instancesDic[serverSideId];
                        if (datalistInstance == undefined) {
                            console.error("Could not get datalist control instance with id: " + serverSideId);
                        }
                        else {
                            if (datalistInstance.isInitialized) {
                                for (var j = datalistInstance.options.showRowNumbers ? 1 : 0; j < datalistInstance.dataTableInstance.columns().count(); j++) {
                                    var columnInfo = datalistInstance.getColumnInfoForElement($(datalistInstance.dataTableInstance.column(j).header()));
                                    if (columnInfo == undefined) {
                                        datalistInstance.handleError("DATALIST ERROR: ColumnInfo not found for column with index " + j);
                                        continue;
                                    }
                                    if (columnNames.contains(columnInfo.name)) {
                                        datalistInstance.dataTableInstance.column(j).visible(true);
                                    }
                                }
                            }
                            else if (repeatCounter < 20) {
                                repeatCounter = repeatCounter || 0;
                                setTimeout(function () {
                                    _this.showControl($element, controlType, extraData, ++repeatCounter);
                                }, 500);
                            }
                        }
                    }
                    else {
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
        };
        ConditionalFormattingsHelper.prototype.changeStyleOfControl = function ($element, classes, state, controlType) {
            for (var i = 0; i < classes.length; i++) {
                var cls = classes[i];
                var className = cls.substring(0, cls.lastIndexOf("_"));
                // Add Class
                this.applyCssClassToControl($element, className + "_" + state, controlType);
                this.removeCssClassFromControl($element, className + "_" + !state, controlType);
            }
        };
        ConditionalFormattingsHelper.prototype.makeControlReadOnly = function ($element, controlType) {
            window._themeManager.setControlState($element, Joove.ThemeManager.States.Readonly);
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
        };
        ConditionalFormattingsHelper.prototype.makeControlEditable = function ($element, controlType) {
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
                    var oldOnClick = $element.data("oldclick");
                    if (oldOnClick == null || oldOnClick === "") {
                        $element.removeAttr("onclick");
                    }
                    else {
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
            window._themeManager.removeControlState($element, Joove.ThemeManager.States.Readonly);
        };
        ConditionalFormattingsHelper.prototype.expandControl = function ($element, controlType) {
            switch (controlType) {
                case "FieldSet":
                    var stateIcon_1 = $element.find(' > [jb-type="FieldSetHeader"] .toggle-state-icon');
                    var stateClasses = Joove.ThemeManager.DefaultClasses[Joove.ThemeManager.States.Expanded].split(' ');
                    if (!stateClasses.some(function (cssClass) { return stateIcon_1.hasClass(cssClass); })) {
                        $element.find('.toggle-state-icon').get(0).click();
                    }
                    //window._themeManager.setFieldsetState($element, ThemeManager.States.Expanded);
                    break;
                default:
                    console.error("Expanding control '" + controlType + "' is not implemented!");
                    break;
            }
        };
        ConditionalFormattingsHelper.prototype.collapseControl = function ($element, controlType) {
            switch (controlType) {
                case "FieldSet":
                    var stateIcon_2 = $element.find(' > [jb-type="FieldSetHeader"] .toggle-state-icon');
                    var stateClasses = Joove.ThemeManager.DefaultClasses[Joove.ThemeManager.States.Collapsed].split(' ');
                    if (!stateClasses.some(function (cssClass) { return stateIcon_2.hasClass(cssClass); })) {
                        $element.find('.toggle-state-icon').get(0).click();
                    }
                    //window._themeManager.setFieldsetState($element, ThemeManager.States.Collapsed);
                    break;
                default:
                    console.error("Collapsing control '" + controlType + "' is not implemented!");
                    break;
            }
        };
        ConditionalFormattingsHelper.prototype.applyCssClassToControl = function ($element, classesToAdd, controlType) {
            switch (controlType) {
                case "DropDownBox":
                    $element.addClass(classesToAdd);
                    this.applyOnSelect2Widget($element, function ($widget) {
                        $widget.addClass(classesToAdd);
                    });
                    break;
                case "CheckBox":
                    var id = $element.attr("jb-id");
                    $("[jb-id='" + id + "_State']", $element.parent()).addClass(classesToAdd);
                    break;
                default:
                    $element.addClass(classesToAdd);
                    break;
            }
        };
        ConditionalFormattingsHelper.prototype.removeCssClassFromControl = function ($element, classesToRemove, controlType) {
            switch (controlType) {
                case "CheckBox":
                    var id = $element.attr("jb-id");
                    $("[jb-id='" + id + "_State']", $element.parent()).removeClass(classesToRemove);
                    break;
                case "DropDownBox":
                    $element.removeClass(classesToRemove);
                    this.applyOnSelect2Widget($element, function ($widget) {
                        $widget.removeClass(classesToRemove);
                    });
                    break;
                default:
                    $element.removeClass(classesToRemove);
                    break;
            }
        };
        ConditionalFormattingsHelper.prototype.setColorRole = function ($element, newRole, controlType) {
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
        };
        ConditionalFormattingsHelper.prototype.disableControl = function ($element, controlType) {
            switch (controlType) {
                case "TabContainer":
                case "TabHeaderPageTitle":
                case "FieldSet":
                case "TabPage":
                    var $children = this.getChildrenOfContainer($element, controlType);
                    for (var i = 0; i < $children.length; i++) {
                        var $child = $children.eq(i);
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
            window._themeManager.setControlState($element, Joove.ThemeManager.States.Disabled);
        };
        ConditionalFormattingsHelper.prototype.enableControl = function ($element, controlType) {
            switch (controlType) {
                case "TabContainer":
                case "TabHeaderPageTitle":
                case "FieldSet":
                case "TabPage":
                    var $children = this.getChildrenOfContainer($element, controlType);
                    for (var i = 0; i < $children.length; i++) {
                        var $child = $children.eq(i);
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
            window._themeManager.removeControlState($element, Joove.ThemeManager.States.Disabled);
        };
        ConditionalFormattingsHelper.prototype.getChildrenOfContainer = function ($element, controlType) {
            switch (controlType) {
                case "TabContainer":
                    return $element.children("[jb-type='TabHeader']").children("[jb-type='TabHeaderPageTitle']");
                case "TabHeaderPageTitle":
                    var index = $element.data("index");
                    var $tabControl = $element.closest("[jb-type='TabContainer']");
                    var $pageContent = $tabControl.children("[jb-type='TabContent']")
                        .children("[data-index='" + index + "']")
                        .eq(0);
                    return $pageContent.find("[jb-type]");
                default:
                    return $element.find("[jb-type]");
            }
        };
        ConditionalFormattingsHelper.prototype.getCheckBoxContainer = function ($element) {
            return $element.parent();
        };
        ConditionalFormattingsHelper.prototype.getTabPageTitle = function ($element) {
            var index = $element.data("index");
            var $tabControl = $element.closest("[jb-type='TabContainer']");
            var $pageTitle = $tabControl.children("[jb-type='TabHeader']")
                .children("[data-index='" + index + "']").eq(0);
            return $pageTitle;
        };
        ConditionalFormattingsHelper.prototype.enableDropDown = function ($element) {
            $element.removeAttr("readonly");
            $element.prop("disabled", false);
            this.applyOnSelect2Widget($element, function ($widget) {
                window._themeManager.transferRemovalOfClassesOfStateToOtherElement($element, $widget, Joove.ThemeManager.States.Readonly);
            });
        };
        ConditionalFormattingsHelper.prototype.disableDropDown = function ($element) {
            $element.attr("readonly", "readonly");
            $element.prop("disabled", true);
            this.applyOnSelect2Widget($element, function ($widget) {
                window._themeManager.transferClassesOfStateToOtherElement($element, $widget, Joove.ThemeManager.States.Readonly);
            });
        };
        // Handles properly changes applied to select 2 widget,
        // taking into account the fact that it may initialize 
        // some time AFTER native select is rendered
        ConditionalFormattingsHelper.prototype.applyOnSelect2Widget = function ($nativeSelect, cb, attempt) {
            var _this = this;
            var $selectWidget = $nativeSelect.next(".select2");
            attempt = attempt || 0;
            if (($selectWidget == null || $selectWidget.length == 0) && attempt < 100) {
                setTimeout(function () {
                    _this.applyOnSelect2Widget($nativeSelect, cb, ++attempt);
                }, 50);
                return;
            }
            cb && cb($selectWidget);
        };
        return ConditionalFormattingsHelper;
    }());
    Joove.ConditionalFormattingsHelper = ConditionalFormattingsHelper;
})(Joove || (Joove = {}));
