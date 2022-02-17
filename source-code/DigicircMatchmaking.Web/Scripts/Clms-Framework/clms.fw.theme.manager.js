var Joove;
(function (Joove) {
    var ThemeManager = /** @class */ (function () {
        function ThemeManager(theme) {
            var _this = this;
            this.getControlVariableByElement = function (varName, $element) {
                var all = _this.getAllControlVariablesByElement($element);
                return _this.findVariableByNameInArray(varName, all);
            };
            this.getSControlVariable = function (varName, controlType, variation, colorRole, sizeRole) {
                var all = _this.getAllControlVariables(controlType, variation, colorRole, sizeRole);
                return _this.findVariableByNameInArray(varName, all);
            };
            this.getCssClassesByRole = function ($element, role) {
                var type = $element.attr("jb-type");
                var variation = $element.attr("ui-role-variation") || "";
                var key = type + "|" + role + "|" + variation;
                return _this.theme.controlRoleClasses[key];
            };
            this.getAllControlVariablesByElement = function ($element) {
                var type = $element.attr("jb-type");
                var colorRole = $element.attr("ui-role-color") || null;
                var sizeRole = $element.attr("ui-role-size") || null;
                var variation = $element.attr("ui-role-variation") || "";
                return _this.getAllControlVariables(type, variation, colorRole, sizeRole);
            };
            this.getAllControlVariables = function (controlType, variation, colorRole, sizeRole) {
                var globalKey = controlType + "||" + variation;
                var colorKey = controlType + "|" + colorRole + "|" + variation;
                var sizeKey = controlType + "|" + sizeRole + "|" + variation;
                var globalVariables = _this.theme.controlSpecificVariables[globalKey];
                var variablesForColorRole = _this.theme.controlSpecificVariables[colorKey];
                var variablesForSizeRole = _this.theme.controlSpecificVariables[sizeKey];
                // Merge global variables with role variables
                // if same variable is present in more a color or size role, it is overwritten
                // if same variable ise present in color role and size role, color wins.                        
                var _mergeVars = function (source, target) {
                    if (source == null)
                        return target;
                    for (var i = 0; i < source.length; i++) {
                        var currentSource = source[i];
                        var found = false;
                        for (var j = 0; j < target.length; j++) {
                            var currentTarget = target[j];
                            if (currentTarget.name == currentSource.name) {
                                found = true;
                                currentTarget.value = currentSource.value;
                                break;
                            }
                        }
                        if (found === false) {
                            target.push(currentSource);
                        }
                    }
                    return target;
                };
                var merged = _mergeVars(globalVariables, []);
                merged = _mergeVars(variablesForSizeRole, merged);
                merged = _mergeVars(variablesForColorRole, merged);
                return merged;
            };
            this.theme = theme || ThemeManager.DefaultTheme;
            if (this.theme.controlSpecificVariables == null) {
                this.theme.controlSpecificVariables = ThemeManager.DefaultControlSpecificVariables;
            }
            if (this.theme.defaultClassesByState == null) {
                this.theme.defaultClassesByState = ThemeManager.DefaultClasses;
            }
            if (this.theme.statesToClassMappings == null) {
                this.theme.statesToClassMappings = ThemeManager.DefaultStatesToClassMappings;
            }
        }
        ThemeManager.prototype.findVariableByNameInArray = function (varName, all) {
            if (all == null)
                return null;
            for (var i = 0; i < all.length; i++) {
                if (all[i].name.trim() == varName.trim())
                    return all[i];
            }
            return null;
        };
        // Returns the full DOM path (in joovebox terms) as a string.
        // It also contains the states for each part
        // e.g. Body.BodyContainer.Table.tBody.Row.Cell.FieldSet:COLLAPSED.FieldSetBody:EXPANDED
        ThemeManager.prototype.getControlTypeTree = function ($element) {
            var $parents = $element.parents("[jb-type]");
            var treeString = "";
            for (var i = $parents.length - 1; i >= 0; i--) {
                treeString += this.getControlTreePartOfControl($parents.eq(i));
                treeString += ".";
            }
            treeString += this.getControlTreePartOfControl($element);
            return treeString;
        };
        // Returns the DOM path part (in joovebox terms) of a specific control as a string.    
        // e.g. FieldSetBody:EXPANDED
        ThemeManager.prototype.getControlTreePartOfControl = function ($element) {
            var part = "";
            part += $element.attr("jb-type");
            var state = this.getControlStateAttribute($element);
            if (state.trim() !== "") {
                part += ":" + state;
            }
            return part;
        };
        // Returns the State of a control in a concated string
        // e.g. Expanded|Disabled
        ThemeManager.prototype.getControlStateAttribute = function ($element) {
            var stateStr = "";
            for (var property in ThemeManager.DefaultClasses) {
                if (ThemeManager.DefaultClasses.hasOwnProperty(property)) {
                    var currentClass = ThemeManager.DefaultClasses[property];
                    if (currentClass === "" || $element.hasClass(currentClass) === false)
                        continue;
                    if (stateStr !== "")
                        stateStr += "|";
                    stateStr += property;
                }
            }
            return stateStr;
        };
        // Check if two paths are matching in terms of joovebox theme model
        // usually this checks DOM Path vs Rule Path
        ThemeManager.prototype.pathsAreMatching = function (treePath, rulePath) {
            // a: Body.BodyContainer.Table.tBody.Row.Cell.FieldSet:Expanded.FieldSetHeader.FieldSetToggleStateIcon:Expanded
            // b: FieldSet.FieldSetHeader.FieldSetToggleStateIcon:Expanded
            if (treePath === rulePath)
                return true; // direct match (is this even possible ???)
            var treePathWithoutStates = this
                .getPathWithoutStates(treePath);
            // Body.BodyContainer.Table.tBody.Row.Cell.FieldSet.FieldSetHeader.FieldSetToggleStateIcon
            var rulePathWithoutStates = this
                .getPathWithoutStates(rulePath); // FieldSet.FieldSetHeader.FieldSetToggleStateIcon
            // Check if there is a possibility for matching.
            // Tree Path must contain the same sequence of controls
            // defined in the rule, even without states.
            // Most checks will stop here...
            if (treePathWithoutStates !== rulePathWithoutStates &&
                treePathWithoutStates["endsWith"]("." + rulePathWithoutStates) === false) {
                return false; // impossible to match
            }
            /* Create the Tree Sub Path that may be matching */
            var treePathParts = treePath.split(".");
            // ['Body', 'BodyContainer', 'Table', 'tBody', 'Row', 'Cell', 'FieldSet:Expanded', 'FieldSetHeader', 'FieldSetToggleStateIcon:Expanded']
            var rulePathParts = rulePath
                .split("."); // ['FieldSet', 'FieldSetHeader', 'FieldSetToggleStateIcon:Expanded']
            var treeSubPathToCheck = []; // ['FieldSet:Expanded', 'FieldSetHeader', 'FieldSetToggleStateIcon:Expanded']
            for (var i = treePathParts.length - rulePathParts.length; i < treePathParts.length; i++) {
                treeSubPathToCheck.push(treePathParts[i]);
            }
            /* End of Sub Path Creation */
            /* Check Tree part part by part for matching with the corresponding rule part */
            for (var i = 0; i < treeSubPathToCheck.length; i++) {
                var currentTreePart = treeSubPathToCheck[i]; // 'FieldSet:Expanded'
                var currentRulePart = rulePathParts[i]; // 'FieldSet'
                var treePartParts = currentTreePart.split(":"); // ['FieldSet', 'Expanded']
                var rulePartParts = currentRulePart.split(":"); // ['FieldSet']
                // we don't need to check that controls in both parts are the same
                // since it would be impossible to procced this far (see first early exit)
                var treePartStatesString = treePartParts.length > 1 ? treePartParts[1] : null; // 'Expanded|Active'
                var rulePartStatesString = rulePartParts.length > 1 ? rulePartParts[1] : null; // 'Active'
                if (treePartStatesString === rulePartStatesString || // states are exactly the same
                    rulePartStatesString == null || // rule does not care about states
                    rulePartStatesString.trim() == "") // same as above but safer
                 {
                    continue; // this part is matching, check next...
                }
                if ((treePartStatesString == null || treePartStatesString === "") && rulePartStatesString !== "") {
                    return false; // rule part defines at least one state, but tree part does not have any
                }
                // we use | to separate states, both while getting them from DOM
                // and in generated theme definition script
                var treePartStates = treePartStatesString.split("|"); // ['Expanded', 'Active']
                var rulePartStates = rulePartStatesString.split("|"); // ['Active']
                if (rulePartParts
                    .length >
                    treePartParts)
                    return false; // rule part defines more states than tree part has
                for (var j = 0; j < rulePartStates.length; j++) {
                    if (treePartStates
                        .indexOf(rulePartStates[j]) === -1)
                        return false; // tree part does not contain a rule state
                }
            }
            /* End of part by part check */
            return true; // everythink ok, rules match!
        };
        // Returns a DOM Path without any states
        ThemeManager.prototype.getPathWithoutStates = function (path) {
            var parts = path.split(".");
            var cleanPath = "";
            for (var i = 0; i < parts.length; i++) {
                if (cleanPath !== "")
                    cleanPath += ".";
                cleanPath += parts[i].split(":")[0];
            }
            return cleanPath;
        };
        // Returns the classes that are defined in Theme
        // for a specific control type. It includes ControlBase
        // that applies to all controls
        ThemeManager.prototype.getClassMappingsByTypeAndState = function ($element, type, state) {
            state = this.theme.statesToClassMappings[state];
            if (state == null || state === {})
                return [];
            var controlPath = this.getControlTypeTree($element);
            var typeMappings = [];
            for (var path in state) {
                if (state.hasOwnProperty(path)) {
                    if (this.pathsAreMatching(controlPath, path)) {
                        typeMappings = typeMappings.concat(state[path]);
                    }
                }
            }
            return typeMappings;
        };
        // Changes a Control State, by adding classes defined in Theme.
        // It also removes classes of the opposite state, if any
        ThemeManager.prototype.setControlState = function ($control, state) {
            // remove opposite state classes
            var oppositeState = this.getOppositeState(state);
            if (oppositeState != null) {
                this.removeControlState($control, oppositeState);
            }
            // first add default state
            var defaultClassForState = ThemeManager.DefaultClasses[state];
            $control.addClass(defaultClassForState);
            // then add theme defined
            var newStateClasses = this.getClassMappingsByTypeAndState($control, $control.attr("jb-type"), state);
            $control.addClass(newStateClasses.join(" "));
        };
        // Removes a Control State, by removing classes defined in Theme.    
        ThemeManager.prototype.removeControlState = function ($control, state) {
            var defaultClassForState = ThemeManager.DefaultClasses[state];
            var stateClasses = this.getClassMappingsByTypeAndState($control, $control.attr("jb-type"), state);
            $control.removeClass(defaultClassForState);
            $control.removeClass(stateClasses.join(" "));
        };
        // Gets the opposite state of a state
        // e.g. form COLLAPSED to EXPAND and vice versa
        ThemeManager.prototype.getOppositeState = function (state) {
            for (var i = 0; i < ThemeManager.StateTransitions.length; i++) {
                var current = ThemeManager.StateTransitions[i];
                if (current.from === state) {
                    return current.to;
                }
                if (current.inverse !== true)
                    continue;
                if (current.to === state) {
                    return current.from;
                }
            }
            return null;
        };
        // Returns the classes that are currently active on an element
        // and match the Theme definition for its control type
        ThemeManager.prototype.getActiveClassesOfElementByState = function ($element, state) {
            var themeClasses = this.getClassMappingsByTypeAndState($element, $element.attr("jb-type"), state);
            var setClasses = $element.attr("class").split(" ");
            var toReturn = [];
            for (var i = 0; i < themeClasses.length; i++) {
                var current = themeClasses[i];
                if (setClasses.indexOf(current) === -1)
                    continue;
                toReturn.push(current);
            }
            return toReturn;
        };
        // Tranfers the active Theme-defined state classes from an element to another.
        // Most commonly used for copying classes from original elements to runtime generated
        // elements, like the Chosen Dropdown container
        ThemeManager.prototype.transferClassesOfStateToOtherElement = function ($source, $destination, state) {
            var classesToTransfer = this.getActiveClassesOfElementByState($source, state);
            if (classesToTransfer == null || classesToTransfer.length === 0)
                return;
            $destination.addClass(classesToTransfer.join(" "));
        };
        // Removes the active Theme-defined state classes from an element to another.
        // Most commonly used for removing classes copied from original elements to runtime generated
        // elements, like the Chosen Dropdown container
        ThemeManager.prototype.transferRemovalOfClassesOfStateToOtherElement = function ($source, $destination, state) {
            var classesToRemove = this.getActiveClassesOfElementByState($source, state);
            if (classesToRemove == null || classesToRemove.length === 0)
                return;
            $destination.removeClass(classesToRemove.join(" "));
        };
        /* Control Specific Helpers */
        // This is called from the fieldset state toggle button
        // and does what is necessary :)
        ThemeManager.prototype.toggleFieldsetSate = function (btn) {
            var $btn = $(btn);
            var stateToSet = $btn.hasClass(ThemeManager.DefaultClasses[ThemeManager.States.Expanded]) === true
                ? ThemeManager.States.Collapsed
                : ThemeManager.States.Expanded;
            var $fieldset = $btn.closest("[jb-type='FieldSet']");
            var $body = $fieldset.children("[jb-type='FieldSetBody']").eq(0);
            if (stateToSet == ThemeManager.States.Expanded) {
                $btn.html("&#9650;");
                $body.show();
            }
            else {
                $btn.html("&#9660;");
                $body.hide();
            }
            this.setFieldsetState($fieldset, stateToSet);
        };
        ThemeManager.prototype.setFieldsetState = function ($fieldset, stateToSet) {
            var $btn = $fieldset.children("[jb-type='FieldSetHeader']")
                .children("[jb-type='FieldSetToggleStateIcon']")
                .eq(0);
            var $body = $fieldset.children("[jb-type='FieldSetBody']").eq(0);
            //Refresh the size of any nested datalist control
            if (stateToSet == ThemeManager.States.Expanded) {
                var datalistControls = $fieldset.find("table[jb-id][jb-type='DataList']");
                for (var i = 0; i < datalistControls.length; i++) {
                    var datalistId = Joove.Core.GetClientSideName(datalistControls.eq(i));
                    var datalistInstance = Joove.Widgets.DataListControl.instancesDic[datalistId];
                    if (datalistInstance != undefined) {
                        if (datalistInstance.isInitialized) {
                            datalistInstance.updateDataTableSize();
                        }
                    }
                    else {
                        console.error("Couldn't find instance of datalist control with client id: " + datalistId);
                    }
                }
            }
            this.setControlState($btn, stateToSet);
            this.setControlState($fieldset, stateToSet);
            this.setControlState($body, stateToSet);
        };
        ThemeManager.prototype.toggleTreeNodeState = function (el) {
            var $el = $(el).closest("[jb-type='TreeNodeItem']");
            var stateToSet = $el.hasClass(ThemeManager.DefaultClasses[ThemeManager.States.Expanded]) === true
                ? ThemeManager.States.Collapsed
                : ThemeManager.States.Expanded;
            this.applyTreeNodeState($el, stateToSet);
        };
        ThemeManager.prototype.applyTreeNodeState = function ($element, stateToSet) {
            $element.children("[jb-type='TreeNode']").toggle(stateToSet == ThemeManager.States.Expanded);
            this.setControlState($element, stateToSet);
        };
        ThemeManager.States = {
            None: "",
            Required: "Required",
            Readonly: "Readonly",
            Collapsed: "Collapsed",
            Expanded: "Expanded",
            Disabled: "Disabled",
            Active: "Active",
            GridWithAlternateRowStyle: "GridWithAlternateRowStyle",
            SimpleButton: "SimpleButton",
            ImageButton: "ImageButton",
            LinkButton: "LinkButton",
            SubMenu: "SubMenu",
            Direct: "Direct",
            NoIcon: "NoIcon",
            RequiredEmpty: "RequiredEmpty",
            DataValidationFailed: "DataValidationFailed",
            InvalidDataForBinding: "InvalidDataForBinding",
            TabsOrientationTop: "TabsOrientationTop",
            TabsOrientationBottom: "TabsOrientationBottom",
            TabsOrientationRight: "TabsOrientationRight",
            TabsOrientationLeft: "TabsOrientationLeft"
        };
        ThemeManager.StateTransitions = [
            { from: ThemeManager.States.Collapsed, to: ThemeManager.States.Expanded, inverse: true },
            { from: ThemeManager.States.Disabled, to: ThemeManager.States.Active, inverse: true }
        ];
        ThemeManager.DefaultStatesToClassMappings = {};
        ThemeManager.DefaultControlSpecificVariables = {};
        ThemeManager.DefaultClasses = {
            None: "",
            Required: "jb-required",
            Readonly: "jb-readonly",
            Collapsed: "jb-collapsed",
            Expanded: "jb-expanded",
            Disabled: "jb-disabled",
            Active: "jb-active",
            GridWithAlternateRowStyle: "jb-alternate-rows",
            SimpleButton: "jb-simple-btn",
            ImageButton: "jb-image-btn",
            LinkButton: "jb-link-btn",
            SubMenu: "jb-submenu",
            Direct: "jb-direct-link",
            NoIcon: "jb-no-icon",
            RequiredEmpty: "jb-required-empty",
            DataValidationFailed: "jb-dv-failed",
            InvalidDataForBinding: "jb-invalid-binding",
            TabsOrientationTop: "jb-tabs-top",
            TabsOrientationBottom: "jb-tabs-bottom",
            TabsOrientationRight: "jb-tabs-right",
            TabsOrientationLeft: "jb-tabs-left"
        };
        ThemeManager.DefaultTheme = {
            controlSpecificVariables: ThemeManager.DefaultControlSpecificVariables,
            defaultClassesByState: ThemeManager.DefaultClasses,
            statesToClassMappings: ThemeManager.DefaultStatesToClassMappings
        };
        return ThemeManager;
    }());
    Joove.ThemeManager = ThemeManager;
    var ThemeRPC = /** @class */ (function () {
        function ThemeRPC() {
        }
        ThemeRPC.prototype.enable = function () {
            var _this = this;
            window.addEventListener("message", function (event) {
                if (_this.validateOrigin(event) === false) {
                    console.log("ERROR! ThemeEditor RPC command is invalid!");
                }
                else {
                    _this.onCommandReceived(event.data);
                }
            });
            $(document).ready(function () {
                _this.sendReadyMessage();
            });
            this.sendReadyMessage();
        };
        ThemeRPC.prototype.sendReadyMessage = function () {
            window.top.postMessage({ command: "isReady" }, "*");
        };
        ThemeRPC.prototype.validateOrigin = function (event) {
            return true;
        };
        ThemeRPC.prototype.onCommandReceived = function (data) {
            switch (data.command) {
                case "refreshStyle":
                    this.updateStylesheet(data.style, data.imports);
                    this.applyDefaultRolesToElements(data.defaultRoles);
                    this.applyThemeRulesToElements(data.elementsData);
                    break;
                case "selectElement":
                    this.selelectElement(data.element);
                    break;
                case "drawIcons":
                    this.drawIcons(data.icons);
                    break;
                case "selectIcon":
                    this.selectIcon(data.icon);
                    break;
                default:
                    console.log("ERROR! ThemeEditor RPC unkown command: " + data.command);
                    break;
            }
        };
        ThemeRPC.prototype.drawIcons = function (icons) {
            var code = "";
            for (var i = 0; i < icons.length; i++) {
                var icon = icons[i];
                code += "<div class='icon-container' jb-icon=\"" + icon.Name + "\" style='margin: 1vw; display: inline-block; float: left; font-size: 4vh'><" + icon.TagName + " jb-type=\"Iconism\" class=\"" + icon.CssClasses + "\"></" + icon.TagName + "></div>";
            }
            $("#" + ThemeRPC.IconLibraryId).remove();
            $("[jb-type='BodyContainer'] .form-root-element").append("<section style='margin: 10px;' class='icon-lib' id='" + ThemeRPC.IconLibraryId + "'>" + code + "</section>");
        };
        ThemeRPC.prototype.updateStylesheet = function (stylesheet, imports) {
            console.log("Updating stylesheet...");
            $("link[jb-theme-import]").remove();
            $("style[jb-theme-import]").remove();
            $("head").append("<link jb-theme-import rel='stylesheet' type='text/css' href='" + imports + "'>");
            $("head").append("<style jb-theme-import>" + stylesheet + "</style>");
            $("head").append("<style>.jb-control." + ThemeRPC.SelectedMarkClass + "[jb-type][jb-default-classes], input[type='file']." + ThemeRPC.SelectedMarkClass + ", .select2-container." + ThemeRPC.SelectedMarkClass + ", .icon-container." + ThemeRPC.SelectedMarkClass + " { position: relative !important; outline: 4px solid #ffc107 !important; outline-offset: 2px !important; outline-style: dashed !important; }</style>");
        };
        ThemeRPC.prototype.selectIcon = function (icon) {
            var $el = $("#" + ThemeRPC.IconLibraryId + " > [jb-icon='" + icon + "']");
            $("." + ThemeRPC.SelectedMarkClass).removeClass(ThemeRPC.SelectedMarkClass);
            $el.addClass(ThemeRPC.SelectedMarkClass);
            this.scrollToElement($el);
        };
        ThemeRPC.prototype.selelectElement = function (element) {
            var onlyVisibleElements = ["Button"];
            var selector = "[jb-type='" + element + "']";
            if (onlyVisibleElements.indexOf(element) > -1) {
                selector += ":visible";
            }
            var $matchingElements = $(selector);
            var $firstMatch = $matchingElements.eq(0);
            this.scrollToElement($firstMatch);
            $("." + ThemeRPC.SelectedMarkClass).removeClass(ThemeRPC.SelectedMarkClass);
            switch (element) {
                case "DataList":
                    $matchingElements.closest(".data-list-control.jb-control").addClass(ThemeRPC.SelectedMarkClass);
                    break;
                case "DropDownBox":
                case "FileAttachment":
                    $matchingElements.next().addClass(ThemeRPC.SelectedMarkClass);
                    break;
                default:
                    $matchingElements.addClass(ThemeRPC.SelectedMarkClass);
                    break;
            }
            console.log($firstMatch[0]);
        };
        ThemeRPC.prototype.scrollToElement = function ($target) {
            var elOffset = $target.offset().top;
            var elHeight = $target.height();
            var windowHeight = $(window).height();
            var offset;
            if (elHeight < windowHeight) {
                offset = elOffset - ((windowHeight / 2) - (elHeight / 2));
            }
            else {
                offset = elOffset;
            }
            var speed = 700;
            $('html, body').animate({ scrollTop: offset }, speed);
        };
        ThemeRPC.prototype.clearThemeCssClassFromElement = function ($el) {
            var themeClasses = $el.attr("jb-theme-classes");
            if (themeClasses == null || themeClasses.trim() == "")
                return;
            $el.removeClass(themeClasses);
        };
        ThemeRPC.prototype.applyDefaultRolesToElements = function (data) {
            for (var i = 0; i < data.length; i++) {
                var current = data[i];
                var $elements = $("[jb-no-roles][jb-type='" + current.type + "']");
                $elements.removeAttr("ui-role-color").removeAttr("ui-role-element-size").removeAttr("ui-role-font-size");
                if (current.colorRole != null) {
                    $elements.attr("ui-role-color", current.colorRole);
                }
                if (current.sizeRole != null) {
                    if (current.type == "Label" || current.type == "Iconism" || current.type == "HyperLink") {
                        $elements.attr("ui-role-font-size", current.sizeRole);
                    }
                    else {
                        $elements.attr("ui-role-element-size", current.sizeRole);
                    }
                }
            }
        };
        ThemeRPC.prototype.applyThemeRulesToElements = function (data) {
            $("[data-theme-applied]").removeAttr("data-theme-applied");
            for (var i = 0; i < data.length; i++) {
                this.applyThemeRule(data[i]);
            }
        };
        ThemeRPC.prototype.applyThemeRule = function (data) {
            if (data.type == "ResponsiveColumn")
                return; // TODO: FIX THIS!
            var selector = this.createElementSelector(data);
            var $all = $(selector);
            for (var i = 0; i < $all.length; i++) {
                var $current = $all.eq(i);
                this.applyThemeDefinedClassesToElement($current, data.classes);
                this.applyThemeDefinedAttributesToElement($current, data.attributes);
                this.updateThemeVariables(data.variables, data.type);
                $current.attr("data-theme-applied", "true");
            }
        };
        ThemeRPC.prototype.applyThemeDefinedClassesToElement = function ($current, classes) {
            var themeClassesApplied = $current.attr("data-theme-applied") == "true";
            if (themeClassesApplied === false) {
                this.clearThemeCssClassFromElement($current);
            }
            $current.addClass(classes);
            if (themeClassesApplied === true) {
                var currentClasses = $current.attr("jb-theme-classes");
                $current.attr("jb-theme-classes", currentClasses + " " + classes);
            }
            else {
                $current.attr("jb-theme-classes", classes);
            }
        };
        ThemeRPC.prototype.applyThemeDefinedAttributesToElement = function ($el, attributes) {
            var themeAttributes = $el.attr("jb-theme-attributes");
            if (themeAttributes != null) {
                var attributesToRemove = themeAttributes.split(";");
                for (var j = 0; j < attributesToRemove.length; j++) {
                    $el.removeAttr(attributesToRemove[j]);
                }
            }
            $el.removeAttr("jb-theme-attributes");
            if (attributes == null || attributes.length == 0)
                return;
            var newValueForThemeAttribute = "";
            for (var j = 0; j < attributes.length; j++) {
                var currentAttr = attributes[j];
                $el.attr(currentAttr.Name, currentAttr.Value);
                newValueForThemeAttribute += currentAttr.Name + ";";
            }
            $el.attr("jb-theme-attributes", newValueForThemeAttribute);
        };
        ThemeRPC.prototype.createElementSelector = function (data) {
            var selector = "[jb-type='" + data.type + "']";
            if (data.colorRole != null) {
                selector += "[ui-role-color='" + data.colorRole + "']";
            }
            if (data.sizeRole != null) {
                selector += data.type == "Label" || data.type == "Iconism" || data.type == "HyperLink"
                    ? "[ui-role-font-size='" + data.sizeRole + "']"
                    : "[ui-role-element-size='" + data.sizeRole + "']";
            }
            if (data.variation != null && data.variation.trim() != "") {
                selector += "[ui-variation='" + data.variation + "']";
            }
            else {
                selector += ":not([ui-variation])";
            }
            return selector;
        };
        ThemeRPC.prototype.updateThemeVariables = function (variables, type) {
            if (variables == null)
                return;
            window._themeManager.theme.controlSpecificVariables[variables.key] = variables.value;
            if (type == "Chart") {
                this.reloadCharts();
            }
        };
        ThemeRPC.prototype.reloadCharts = function () {
            if (Joove.Widgets == null || Joove.Widgets.ChartHelper == null || Joove.Widgets.ChartHelper.instancesDic == null)
                return;
            var charts = Joove.Widgets.ChartHelper.instancesDic;
            for (var key in charts) {
                var chart = charts[key];
                if (chart == null)
                    continue;
                for (var index in chart) {
                    chart[index].Init();
                }
            }
        };
        ThemeRPC.SelectedMarkClass = "theme-editor-selection";
        ThemeRPC.IconLibraryId = "icons-library";
        return ThemeRPC;
    }());
    Joove.ThemeRPC = ThemeRPC;
})(Joove || (Joove = {}));
