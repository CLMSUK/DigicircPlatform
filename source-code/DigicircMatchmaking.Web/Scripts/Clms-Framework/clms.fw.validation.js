var Joove;
(function (Joove) {
    var Validation;
    (function (Validation) {
        var BindingEntry = /** @class */ (function () {
            function BindingEntry() {
            }
            return BindingEntry;
        }());
        Validation.BindingEntry = BindingEntry;
        var FormValidationOptions = /** @class */ (function () {
            function FormValidationOptions() {
            }
            return FormValidationOptions;
        }());
        Validation.FormValidationOptions = FormValidationOptions;
        var Manager = /** @class */ (function () {
            function Manager() {
            }
            Manager.validateFormAndExecute = function (executionCb, options) {
                // don't validate anything, just execute!
                if (options.withDataValidationsCheck === false && options.withRequiredFieldsCheck === false) {
                    executionCb && executionCb();
                    return;
                }
                var requiredFieldsOk = true;
                // check required fields
                if (options.withRequiredFieldsCheck === true) {
                    UiHelper.updateEmptyRequiredFieldsState(options.groups, true);
                    if (UiHelper.emptyRequiredFieldsExist() === true) { // empty fields: block execution
                        requiredFieldsOk = false;
                        if (options.withDataValidationsCheck === false) {
                            UiHelper.showPanel(); // no need to check DVs, show error panel
                            return;
                        }
                    }
                    else { // no empty fields
                        if (options.withDataValidationsCheck === false) {
                            executionCb && executionCb(); // no need to check DVs, execute!
                            return;
                        }
                    }
                }
                // check data validations
                if (options.withDataValidationsCheck === true) {
                    window._ruleEngine.runClientDataValidations(options.groups).then(function (dataValidationStatus) {
                        Manager.afterDataValidationsCheck(executionCb, requiredFieldsOk);
                    });
                }
            };
            Manager.afterDataValidationsCheck = function (executionCb, requiredFieldsOk) {
                var validations = window.$form._validations == null
                    ? []
                    : window.$form._validations.summary;
                //data validation exception handles backend custom validation messages. i.e. object with same name already exist.
                var triggeredDataValidations = validations.filter(function (x) { return x.triggered === true && x.rule != null && x.group !== "_ValidationException_"; });
                UiHelper.markDataValidationRelatedControls(false);
                if (triggeredDataValidations.length == 0 && requiredFieldsOk === true) { // no DV fails and required fields OK: Execute!
                    executionCb && executionCb();
                    return;
                }
                else {
                    UiHelper.showPanel(); // DV fails or empty required fields: Show panel, but continue checks below
                }
                var triggeredErrors = triggeredDataValidations.filter(function (x) { return x.rule.dataValidationMessageType == Joove.DataValidationMessageType.ERROR; });
                if (requiredFieldsOk === false || triggeredErrors.length > 0)
                    return; // DV errors, or missing required fields: block execution
                var triggeredWarnings = triggeredDataValidations.filter(function (x) { return x.rule.dataValidationMessageType == Joove.DataValidationMessageType.WARN; });
                if (triggeredWarnings.length == 0) { // no DV warnings, no empty required (this means only DV infos were triggered): Execute!
                    executionCb && executionCb();
                }
                else { // DV warnings: Show confirmation pop up
                    window._popUpManager.question(window._resourcesManager.getGlobalResource("RES_WEBFORM_VALIDATIONS_Warning"), window._resourcesManager.getGlobalResource("RES_WEBFORM_VALIDATIONS_WarningConfirmation"), function (ignoreWarning) {
                        if (ignoreWarning !== true)
                            return;
                        setTimeout(function () {
                            executionCb && executionCb(); // user confirms: Execute!
                        }, 1000);
                    });
                }
            };
            return Manager;
        }());
        Validation.Manager = Manager;
        var Bindings = /** @class */ (function () {
            function Bindings() {
            }
            Bindings.refresh = function (dv, message, triggered, indexes) {
                var newEntry = {
                    rule: dv,
                    message: message,
                    triggered: triggered,
                    group: dv.group,
                    indexesInfo: {
                        key: indexes.join("_") + "_",
                        indexes: indexes
                    }
                };
                Bindings.handleNewEntry(newEntry);
            };
            Bindings.removeBindingOfControl = function ($el) {
                var id = $el.attr("jb-id");
                delete window.$form._validations[id];
                delete window.$master._validations[id];
                var existing = window.$form._validations.summary.filter(function (x) { return x.requiredControlId == id; });
                if (existing.length == 0)
                    return;
                var existingEntry = existing[0];
                var index = window.$form._validations.summary.indexOf(existingEntry);
                window.$form._validations.summary.splice(index, 1);
            };
            Bindings.refreshEmptyRequired = function ($control, triggered) {
                var fromMaster = false; // todo
                var partialName = Joove.Core.getPartialOwnerControl($control);
                var controlId = $control.attr("jb-id");
                var controlKey = partialName == null || partialName.trim() == ""
                    ? controlId
                    : Joove.Core.getPartialViewControlOriginalName($control);
                var msg = window._resourcesManager.getEmptyRequiredFieldMessage(controlKey, fromMaster, partialName);
                var group = window["$$$"](controlId).eq(0).attr("dv-group");
                var newEntry = {
                    requiredControlId: controlId,
                    message: msg,
                    triggered: triggered,
                    group: group,
                    indexesInfo: Joove.Common.getIndexesOfControl($control)
                };
                Bindings.handleNewEntry(newEntry);
            };
            Bindings.clearSummary = function () {
                window.$form._validations.summary = [];
            };
            Bindings.removeAllDataValidationsFromSummary = function () {
                var newArray = [];
                for (var i = 0; i < window.$form._validations.summary.length; i++) {
                    var current = window.$form._validations.summary[i];
                    if (current.requiredControlId != null && current.requiredControlId.trim() != "") {
                        newArray.push(current); // keep only required fields entries
                    }
                }
                window.$form._validations.summary = newArray;
            };
            Bindings.removeAllRequiredFieldsFromSummary = function () {
                var newArray = [];
                for (var i = 0; i < window.$form._validations.summary.length; i++) {
                    var current = window.$form._validations.summary[i];
                    if (current.rule != null) {
                        newArray.push(current); // keep data validation entries
                    }
                }
                window.$form._validations.summary = newArray;
            };
            Bindings.removeValidationsThatDontBelongToGroups = function (groups) {
                if (groups.indexOf(Constants.ALL_GROUPS) > -1)
                    return; // keep all, since all belong to some group!
                var newArray = [];
                for (var i = 0; i < window.$form._validations.summary.length; i++) {
                    var current = window.$form._validations.summary[i];
                    if (groups.indexOf(current.group) > -1) { // belongs to group: keep
                        newArray.push(current);
                    }
                }
                window.$form._validations.summary = newArray;
            };
            Bindings.handleNewEntry = function (entry) {
                Bindings.updateBindings(entry);
                Bindings.updateValidationsSummary(entry);
                Bindings.updateMasterValidationsSummary(entry);
                Bindings.updateBoundControl(entry);
                Bindings.triggerDataValidationRelatedConditionals();
            };
            Bindings.triggerDataValidationRelatedConditionals = function () {
                clearTimeout(Bindings.conditionalsTriggerTimeout);
                Bindings.conditionalsTriggerTimeout = setTimeout(function () {
                    window._ruleEngine.updateDataValidationRelatedConditionals();
                }, 200);
            };
            Bindings.entryHasContext = function (entry) {
                return entry.indexesInfo != null && entry.indexesInfo.indexes.length > 0;
            };
            Bindings.updateBoundControl = function (entry) {
                var prefix = entry.rule == null
                    ? "jb_required_"
                    : "";
                var targetName = entry.rule == null
                    ? entry.requiredControlId
                    : entry.rule.originalName;
                var $targets = $("[jb-validation-target='" + prefix + targetName + "']");
                if (Bindings.entryHasContext(entry) === true) {
                    var $target = $targets.filter(function (i, el) { return Joove.Common.getIndexKeyOfControl($(el)) == entry.indexesInfo.key; });
                    $target.toggle(entry.triggered); // update visibility
                    $target.text(entry.message); // update text. Assuming control is label or something similar
                }
                else {
                    $targets.toggle(entry.triggered); // toggle visibiliy only. Message handled by angular                
                }
            };
            Bindings.updateBindings = function (entry) {
                var propName = entry.rule == null
                    ? entry.requiredControlId
                    : entry.rule.originalName;
                var fromMasterPage = entry.rule == null
                    ? window.$master != null && window.$master._validations != null && window.$master._validations[entry.requiredControlId] != null
                    : entry.rule.fromMasterPage;
                if (Bindings.entryHasContext(entry) === true) {
                    Bindings.updateValidationBindingInsideContext(entry, fromMasterPage, propName);
                }
                else {
                    Bindings.updateValidationBindingWithoutContext(entry, fromMasterPage, propName);
                }
            };
            Bindings.updateValidationBindingWithoutContext = function (newEntry, fromMasterPage, propName) {
                if (fromMasterPage) {
                    if (window.$master._validations[propName] == null) {
                        window.$master._validations[propName] = new Joove.Validation.BindingEntry();
                    }
                    window.$master._validations[propName].message = newEntry.triggered === true ? newEntry.message : null;
                    window.$master._validations[propName].triggered = newEntry.triggered;
                }
                else {
                    if (window.$form._validations[propName] == null) {
                        window.$form._validations[propName] = new Joove.Validation.BindingEntry();
                    }
                    window.$form._validations[propName].message = newEntry.triggered === true ? newEntry.message : null;
                    window.$form._validations[propName].triggered = newEntry.triggered;
                }
            };
            Bindings.updateValidationBindingInsideContext = function (entry, fromMasterPage, propName) {
                if (fromMasterPage === true && window.$master._validations[propName] == null) {
                    window.$master._validations[propName] = [];
                }
                else if (window.$form._validations[propName] == null) {
                    window.$form._validations[propName] = [];
                }
                var existingEntries = fromMasterPage
                    ? window.$master._validations[propName].filter(function (x) { return x.indexesInfo.key == entry.indexesInfo.key; })
                    : window.$form._validations[propName].filter(function (x) { return x.indexesInfo.key == entry.indexesInfo.key; });
                var existing = existingEntries == null || existingEntries.length == 0
                    ? null
                    : existingEntries[0];
                var indexOfExisting = fromMasterPage
                    ? window.$master._validations[propName].indexOf(existing)
                    : window.$form._validations[propName].indexOf(existing);
                if (fromMasterPage === true) {
                    if (existing != null && indexOfExisting > -1) {
                        window.$master._validations[propName][indexOfExisting] = entry;
                    }
                    else {
                        window.$master._validations[propName].push(entry);
                    }
                }
                else {
                    if (existing != null && indexOfExisting > -1) {
                        window.$form._validations[propName][indexOfExisting] = entry;
                    }
                    else {
                        window.$form._validations[propName].push(entry);
                    }
                }
            };
            Bindings.updateValidationsSummary = function (entry) {
                var existing = entry.rule == null
                    ? window.$form._validations.summary.filter(function (x) { return x.requiredControlId == entry.requiredControlId; })
                    : window.$form._validations.summary.filter(function (x) { return x.rule != null && x.rule.name == entry.rule.name; });
                var alreadyInSummary = existing.length > 0;
                if (Bindings.entryHasContext(entry) === true) {
                    Bindings.updatedValidationSummaryForEntryInContext(entry, existing, alreadyInSummary);
                }
                else {
                    Bindings.updatedValidationSummaryForEntryWithoutContext(entry, existing, alreadyInSummary);
                }
            };
            Bindings.updateMasterValidationsSummary = function (entry) {
                var existing = entry.rule == null
                    ? window.$form._validationsMaster.summary.filter(function (x) { return x.requiredControlId == entry.requiredControlId; })
                    : window.$form._validationsMaster.summary.filter(function (x) { return x.rule != null && x.rule.name == entry.rule.name; });
                var alreadyInSummary = existing.length > 0;
                if (Bindings.entryHasContext(entry) === true) {
                    Bindings.updatedMasterValidationSummaryForEntryInContext(entry, existing, alreadyInSummary);
                }
                else {
                    Bindings.updatedMasterValidationSummaryForEntryWithoutContext(entry, existing, alreadyInSummary);
                }
            };
            Bindings.resetAllRequiredFieldOccurencesInSummary = function () {
                for (var i in window.$form._validations.summary) {
                    var entry = window.$form._validations.summary[i];
                    if (entry.requiredControlId == null || entry.requiredControlId.trim() == "")
                        continue;
                    entry.occurences = 0;
                    entry.triggered = false;
                }
            };
            Bindings.removeFromMasterSummaryNotTriggeredRequiredFields = function (controlNames) {
                if (controlNames == null) {
                    controlNames = [];
                }
                var notRequiredNow = UiHelper.getRequiredFieldsThatMustBeIgnored();
                notRequiredNow.map(function (el) {
                    var $el = $(el);
                    var isInContext = Joove.Common.getIndexesOfControl($el).indexes.length > 0;
                    if (isInContext === false)
                        return true;
                    controlNames.push($el.attr("jb-id"));
                });
                if (controlNames.length == 0)
                    return;
                controlNames.map(function (id) {
                    var existing = window.$form._validationsMaster.summary.filter(function (x) { return x.requiredControlId == id; });
                    if (existing.length == 0)
                        return;
                    var existingEntry = existing[0];
                    if (existingEntry.occurences > 0)
                        return;
                    var index = window.$form._validationsMaster.summary.indexOf(existingEntry);
                    window.$form._validationsMaster.summary.splice(index, 1);
                });
            };
            Bindings.removeFromSummaryNotTriggeredRequiredFields = function (controlNames) {
                if (controlNames == null) {
                    controlNames = [];
                }
                var notRequiredNow = UiHelper.getRequiredFieldsThatMustBeIgnored();
                notRequiredNow.map(function (el) {
                    var $el = $(el);
                    var isInContext = Joove.Common.getIndexesOfControl($el).indexes.length > 0;
                    if (isInContext === false)
                        return true;
                    controlNames.push($el.attr("jb-id"));
                });
                if (controlNames.length == 0)
                    return;
                controlNames.map(function (id) {
                    var existing = window.$form._validations.summary.filter(function (x) { return x.requiredControlId == id; });
                    if (existing.length == 0)
                        return;
                    var existingEntry = existing[0];
                    if (existingEntry.occurences > 0)
                        return;
                    var index = window.$form._validations.summary.indexOf(existingEntry);
                    window.$form._validations.summary.splice(index, 1);
                });
            };
            Bindings.resetValidationOccurencesInSummary = function (dv) {
                var existing = window.$form._validations.summary.filter(function (x) { return x.rule != null && x.rule.name == dv.name; });
                if (existing.length == 0) {
                    return;
                }
                else {
                    existing[0].occurences = 0;
                }
            };
            Bindings.removeFromMasterSummaryWhenNotTriggered = function (dv) {
                var existing = window.$form._validationsMaster.summary.filter(function (x) { return x.rule != null && x.rule.name == dv.name; });
                if (existing.length == 0)
                    return;
                var existingEntry = existing[0];
                if (existingEntry.occurences > 0)
                    return;
                var index = window.$form._validationsMaster.summary.indexOf(existingEntry);
                window.$form._validationsMaster.summary.splice(index, 1);
            };
            Bindings.removeFromSummaryWhenNotTriggered = function (dv) {
                var existing = window.$form._validations.summary.filter(function (x) { return x.rule != null && x.rule.name == dv.name; });
                if (existing.length == 0)
                    return;
                var existingEntry = existing[0];
                if (existingEntry.occurences > 0)
                    return;
                var index = window.$form._validations.summary.indexOf(existingEntry);
                window.$form._validations.summary.splice(index, 1);
            };
            Bindings.updatedMasterValidationSummaryForEntryInContext = function (entry, existing, alreadyInSummary) {
                if (alreadyInSummary === false && entry.triggered === false)
                    return; // not triggered, not in summary -> do nothing
                if (alreadyInSummary === true) {
                    var existingEntry = existing[0];
                    var index = window.$form._validationsMaster.summary.indexOf(existingEntry);
                    if (entry.triggered === true) {
                        existingEntry.occurences++;
                    }
                }
                else { // not in summary, triggered -> push                
                    entry.occurences = 1;
                    window.$form._validationsMaster.summary.push(entry);
                }
            };
            Bindings.updatedMasterValidationSummaryForEntryWithoutContext = function (entry, existing, alreadyInSummary) {
                if (alreadyInSummary === false && entry.triggered === false)
                    return; // not triggered, not in summary -> do nothing
                if (alreadyInSummary === true) { // in summary
                    var index = window.$form._validationsMaster.summary.indexOf(existing[0]);
                    if (entry.triggered === true) { // triggered -> update
                        window.$form._validationsMaster.summary[index] = entry;
                    }
                    else { // not triggered -> remove
                        window.$form._validationsMaster.summary.splice(index, 1);
                    }
                }
                else { // not in summary, triggered -> push
                    window.$form._validationsMaster.summary.push(entry);
                }
            };
            Bindings.updatedValidationSummaryForEntryInContext = function (entry, existing, alreadyInSummary) {
                if (alreadyInSummary === false && entry.triggered === false)
                    return; // not triggered, not in summary -> do nothing
                if (alreadyInSummary === true) {
                    var existingEntry = existing[0];
                    var index = window.$form._validations.summary.indexOf(existingEntry);
                    if (entry.triggered === true) {
                        existingEntry.occurences++;
                    }
                }
                else { // not in summary, triggered -> push                
                    entry.occurences = 1;
                    window.$form._validations.summary.push(entry);
                }
            };
            Bindings.updatedValidationSummaryForEntryWithoutContext = function (entry, existing, alreadyInSummary) {
                if (alreadyInSummary === false && entry.triggered === false)
                    return; // not triggered, not in summary -> do nothing
                if (alreadyInSummary === true) { // in summary
                    var index = window.$form._validations.summary.indexOf(existing[0]);
                    if (entry.triggered === true) { // triggered -> update
                        window.$form._validations.summary[index] = entry;
                    }
                    else { // not triggered -> remove
                        window.$form._validations.summary.splice(index, 1);
                    }
                }
                else { // not in summary, triggered -> push
                    window.$form._validations.summary.push(entry);
                }
            };
            Bindings.gridIsBoundToValidationsSummary = function (grid) {
                return $(grid).attr("ng-model") == "_validations.summary";
            };
            Bindings.conditionalsTriggerTimeout = null;
            return Bindings;
        }());
        Validation.Bindings = Bindings;
        var Constants = /** @class */ (function () {
            function Constants() {
            }
            Constants.ALL_GROUPS = "_ALL_";
            Constants.dataValidationRoleMark = "has-dv-role";
            Constants.emptyRequiredMark = "has-required-role";
            Constants.nowRequiredMark = "jb-now-required";
            Constants.nowNotRequiredMark = "jb-now-not-required";
            Constants.prevColorAttr = "prev-role";
            Constants.errorRole = "danger";
            Constants.warningRole = "warning";
            Constants.infoRole = "info";
            return Constants;
        }());
        Validation.Constants = Constants;
        var UiHelper = /** @class */ (function () {
            function UiHelper() {
            }
            UiHelper.showPanel = function () {
                if (UiHelper.disablePanel === true)
                    return;
                UiHelper.panelScope.show();
            };
            UiHelper.getAllRequiredFields = function () {
                var $allRequired = $("." + window._themeManager.theme.defaultClassesByState.Required);
                var notHidden = $allRequired.toArray().filter(function (el) {
                    return $(el).hasClass("cf-hidden") === false && $(el).parents(".cf-hidden").length == 0;
                });
                return notHidden;
            };
            UiHelper.emptyRequiredFieldsExist = function () {
                return $("." + window._themeManager.theme.defaultClassesByState.RequiredEmpty).length > 0;
            };
            UiHelper.updateEmptyRequiredFieldsState = function (groups, markEmpty) {
                if (groups == null || groups.length == 0) {
                    groups = UiHelper.lastEvaluatedValidationGroups;
                }
                UiHelper.handleConditionallyHiddenAndNotRequiredFields();
                Validation.Bindings.removeValidationsThatDontBelongToGroups(groups);
                Validation.Bindings.resetAllRequiredFieldOccurencesInSummary();
                var controlsInsideContext = [];
                var required = UiHelper.getAllRequiredFields();
                for (var i = 0; i < required.length; i++) {
                    var $current = $(required[i]);
                    var controlGroup = $current.attr("dv-group");
                    var isEmpty = UiHelper.fieldIsEmpty($current);
                    var groupMustBeEvaluated = groups.indexOf(Constants.ALL_GROUPS) > -1 || groups.indexOf(controlGroup) > -1;
                    var id = $current.attr("jb-id");
                    var triggered = isEmpty === true && groupMustBeEvaluated === true;
                    if (groupMustBeEvaluated === true) {
                        var isInContext = Joove.Common.getIndexesOfControl($current).indexes.length > 0;
                        if (isInContext === true) {
                            controlsInsideContext.push(id);
                        }
                    }
                    if (triggered === true && markEmpty === true) {
                        Validation.UiHelper.markEmptyRequired($current);
                        Validation.Bindings.refreshEmptyRequired($current, true);
                    }
                    else if (triggered === false) {
                        Validation.UiHelper.unmarkEmptyRequired($current);
                        Validation.Bindings.refreshEmptyRequired($current, false);
                    }
                }
                Validation.Bindings.removeFromSummaryNotTriggeredRequiredFields(controlsInsideContext);
                Validation.Bindings.removeFromMasterSummaryNotTriggeredRequiredFields(controlsInsideContext);
            };
            UiHelper.getRequiredFieldsThatMustBeIgnored = function () {
                var allRequired = UiHelper.getAllRequiredFields();
                var hidden = allRequired.filter(function (el) {
                    return $(el).hasClass("cf-hidden") === true || $(el).parents(".cf-hidden").length > 0;
                });
                var notNowRequired = $("." + Constants.nowNotRequiredMark).toArray();
                return hidden.concat(notNowRequired);
            };
            UiHelper.handleConditionallyHiddenAndNotRequiredFields = function () {
                var notRequiredNow = UiHelper.getRequiredFieldsThatMustBeIgnored();
                notRequiredNow.map(function (el) {
                    var $el = $(el);
                    var isInContext = Joove.Common.getIndexesOfControl($el).indexes.length > 0;
                    if (isInContext === true)
                        return true; // if inside context, occurences will reset before required fields state update
                    Validation.Bindings.removeBindingOfControl($el);
                });
            };
            UiHelper.refreshPanel = function () {
                if (UiHelper.disablePanel === true)
                    return;
                Joove.Core.applyScope(UiHelper.panelScope);
            };
            UiHelper.navigateFromDvBoundControl = function (el) {
                var $el = $(el);
                var forMasterPage = false; // TODO !!!
                var targetValidation = $el.attr("jb-validation-target");
                var forRequiredControl = targetValidation.indexOf("jb_required_") == 0;
                if (forRequiredControl === true) {
                    targetValidation = targetValidation.replace("jb_required_", "");
                }
                var dvBinding = forMasterPage
                    ? window.$master._validations[targetValidation]
                    : window.$form._validations[targetValidation];
                if (dvBinding == null)
                    return;
                if (Array.isArray(dvBinding) === true) {
                    var indexesInfo = Joove.Common.getIndexesOfControl($el);
                    var entryMatches = dvBinding.filter(function (x) { return x.indexesInfo.key == indexesInfo.key; });
                    if (entryMatches != null && entryMatches.length > 0) {
                        UiHelper.navigateToRelatedControl(entryMatches[0]);
                    }
                }
                else {
                    UiHelper.navigateToRelatedControl(dvBinding);
                }
            };
            UiHelper.navigateToRelatedControl = function (dvEntry) {
                var $controls = Validation.UiHelper.getAffectedControls(dvEntry);
                if (dvEntry.indexesInfo == null || dvEntry.indexesInfo.indexes == null || dvEntry.indexesInfo.indexes.length == 0) {
                    Validation.UiHelper.setFocusOnField($controls.eq(0));
                }
                else {
                    Validation.UiHelper.navigateToRelatedControlInGrid(dvEntry, $controls.eq(0));
                }
            };
            UiHelper.getAffectedControls = function (dvEntry) {
                var $controls = null;
                var forRequiredControl = dvEntry.requiredControlId != null && dvEntry.requiredControlId != "";
                if (forRequiredControl === true) {
                    $controls = $("[jb-id='" + dvEntry.requiredControlId + "']");
                }
                else {
                    $controls = dvEntry.rule.$affectedControls();
                }
                return $controls;
            };
            UiHelper.navigateToRelatedControlInGrid = function (dvEntry, $controls, recursionSettings) {
                var MAX_RECURSIONS = 9;
                //The first call from navigateToRelatedControl should not have any recursionSettings defined
                if (recursionSettings == undefined) {
                    recursionSettings = {
                        "currentGridIndex": dvEntry.indexesInfo.indexes.length - 1,
                        "$firstRowOfCurrentGrid": null,
                        "changePageIsActive": false,
                        "recursionsLeft": MAX_RECURSIONS,
                        "timeout": 50
                    };
                }
                else {
                    //Update $controls
                    $controls = Validation.UiHelper.getAffectedControls(dvEntry);
                }
                //This is where the recursion happens
                if (recursionSettings.currentGridIndex >= 0) {
                    //Each time get a parent grid element starting from the outter
                    var $grid = $controls.eq(0).parents("table[jb-type='Grid']").eq(recursionSettings.currentGridIndex);
                    //If not a page change is in progress
                    if (!recursionSettings.changePageIsActive) {
                        //Get the related widget class
                        var gridWidget = Joove.Common.getDirectiveScope($grid);
                        if (gridWidget != undefined) {
                            //Calculate the target page
                            var targetPage = Math.floor(dvEntry.indexesInfo.indexes[recursionSettings.currentGridIndex] / gridWidget.$pageSize);
                            if (targetPage != gridWidget.$currentPage) {
                                gridWidget.$gotoPage(targetPage);
                                recursionSettings.changePageIsActive = true;
                                recursionSettings.$firstRowOfCurrentGrid = $grid.children("tbody").children("tr:first");
                            }
                            else {
                                recursionSettings.changePageIsActive = false;
                                recursionSettings.$firstRowOfCurrentGrid = null;
                                recursionSettings.currentGridIndex--;
                            }
                            Validation.UiHelper.navigateToRelatedControlInGrid(dvEntry, $controls, recursionSettings);
                        }
                    }
                    else {
                        //A page change is in progress and we must detect if its completed
                        var $firstRowOfCurrentGrid = $grid.children("tbody").children("tr:first");
                        if ($firstRowOfCurrentGrid.get(0) != recursionSettings.$firstRowOfCurrentGrid.get(0) || recursionSettings.recursionsLeft < 0) {
                            //If the first row of the grid is not the same as the one that was passed in the recursionSettings
                            //object then the grid is updated and it can continue with it's checks. If recursionsLeft is below zero something
                            //went wrong and we must stop
                            recursionSettings.currentGridIndex--;
                            recursionSettings.recursionsLeft = MAX_RECURSIONS;
                            recursionSettings.changePageIsActive = false;
                            Validation.UiHelper.navigateToRelatedControlInGrid(dvEntry, $controls, recursionSettings);
                        }
                        else {
                            //If we are on the same page wait a bit and retry again
                            recursionSettings.recursionsLeft--;
                            setTimeout(function () {
                                Validation.UiHelper.navigateToRelatedControlInGrid(dvEntry, $controls, recursionSettings);
                            }, recursionSettings.timeout);
                        }
                    }
                }
                else {
                    //This is where the grid pages have been properly set
                    //Update again the controls since grid pages could be changed and refreshed the initial elements
                    var controlsArray = Validation.UiHelper.getAffectedControls(dvEntry).toArray();
                    for (var i = 0; i < controlsArray.length; i++) {
                        var $el = $(controlsArray[i]);
                        if (Joove.Common.getIndexesOfControl($el).key != dvEntry.indexesInfo.key)
                            continue;
                        Validation.UiHelper.setFocusOnField($el);
                        break;
                    }
                }
            };
            UiHelper.markDataValidationRelatedControls = function (forOnChange) {
                var _loop = function (validationsObject) {
                    if (validationsObject == null)
                        return;
                    for (var dv in validationsObject) {
                        if (dv == "summary")
                            continue;
                        var property = validationsObject[dv];
                        var ruleHasContext = Array.isArray(property);
                        var entries = ruleHasContext === true
                            ? property
                            : [property];
                        if (entries.length == 0)
                            continue;
                        var rule = entries[0].rule;
                        if (rule == null)
                            continue;
                        if (forOnChange === true && rule.evaluationTimes.indexOf(Joove.EvaluationTimes.OnChange) == -1)
                            continue;
                        entries.map(function (x) { return UiHelper.applyDataValidationColorRoleToAffectedControls(x); });
                    }
                };
                _loop(window.$master._validations);
                _loop(window.$form._validations);
            };
            UiHelper.applyDataValidationColorRoleToAffectedControls = function (dv) {
                var $controls = dv.rule.$affectedControls();
                var controlsAffectedByCurrentIndexes = [];
                if (dv.indexesInfo != null) {
                    $controls.each(function (i, el) {
                        var $el = $(el);
                        var controlIndexes = Joove.Common.getIndexesOfControl($el);
                        if (controlIndexes.key == dv.indexesInfo.key) {
                            controlsAffectedByCurrentIndexes.push(el);
                        }
                    });
                }
                else {
                    controlsAffectedByCurrentIndexes = $.makeArray($controls);
                }
                var newRole = Validation.Constants.errorRole;
                if (dv.rule.dataValidationMessageType == Joove.DataValidationMessageType.INFO) {
                    newRole = Validation.Constants.infoRole;
                }
                else if (dv.rule.dataValidationMessageType == Joove.DataValidationMessageType.WARN) {
                    newRole = Validation.Constants.warningRole;
                }
                controlsAffectedByCurrentIndexes.map(function (el) {
                    if (dv.triggered === true &&
                        (UiHelper.lastEvaluatedValidationGroups.indexOf(Constants.ALL_GROUPS) > -1 || UiHelper.lastEvaluatedValidationGroups.indexOf(dv.group) > -1)) {
                        Validation.UiHelper.changeColorRole($(el), newRole, true);
                    }
                    else {
                        UiHelper.resetColorRole($(el), true);
                    }
                });
            };
            UiHelper.changeColorRole = function ($el, role, fromDataValidation) {
                var markClass = fromDataValidation
                    ? Constants.dataValidationRoleMark
                    : Constants.emptyRequiredMark;
                var mustStoreCurrentRole = $el.hasClass(Constants.dataValidationRoleMark) === false &&
                    $el.hasClass(Constants.emptyRequiredMark) === false;
                if (mustStoreCurrentRole === true) {
                    $el.attr(Constants.prevColorAttr, $el.attr("ui-role-color"));
                }
                $el.addClass(markClass);
                window._ruleEngine.cfHelper.setColorRole($el, role, $el.attr("jb-type"));
            };
            UiHelper.resetColorRole = function ($el, fromDataValidation) {
                var markClass = fromDataValidation
                    ? Constants.dataValidationRoleMark
                    : Constants.emptyRequiredMark;
                $el.removeClass(markClass);
                var prevColorRole = $el.attr(Constants.prevColorAttr) || "";
                window._ruleEngine.cfHelper.setColorRole($el, prevColorRole, $el.attr("jb-type"));
            };
            UiHelper.markEmptyRequired = function ($el) {
                UiHelper.changeColorRole($el, Constants.errorRole, false);
                UiHelper.addStateToField($el, Joove.ThemeManager.States.RequiredEmpty);
            };
            UiHelper.unmarkEmptyRequired = function ($el) {
                UiHelper.removeStateFromField($el, Joove.ThemeManager.States.RequiredEmpty);
                UiHelper.resetColorRole($el, false);
            };
            UiHelper.fieldIsEmpty = function ($element) {
                var type = $element.attr("jb-type");
                switch (type) {
                    case "OptionButton":
                        var checkedItem = $('[type="radio"]:checked', $element);
                        return checkedItem.length === 0;
                    case "DropDownBox":
                        var value = $element.val();
                        if (value == null)
                            return true;
                        if (value.indexOf("?") === -1)
                            return false;
                        var lastPosition = value.length - 1;
                        return value[0] === "?" && value[lastPosition] === "?";
                    case "FileAttachment":
                        return $element.children("li").length === 0;
                    case "ImageBox":
                        var $fileInput = $element.next("input");
                        return $fileInput.length > 0 && ($fileInput.val() == null || $fileInput.val().trim() === "");
                    default:
                        return $element.val() == null || $element.val().trim() === "";
                }
            };
            UiHelper.getEmptyRequiredFields = function (groups) {
                var required = UiHelper.getAllRequiredFields();
                var empty = [];
                for (var i = 0; i < required.length; i++) {
                    var $current = $(required[i]);
                    var group = $current.attr("dv-group");
                    var belongsToGroup = groups.indexOf(Constants.ALL_GROUPS) > -1 || groups.indexOf(group) > -1;
                    if (belongsToGroup === false || UiHelper.fieldIsEmpty($current) === false)
                        continue;
                    empty.push($current);
                }
                return $(empty).map(function () { return this.toArray(); });
            };
            UiHelper.setFocusOnField = function ($element) {
                var $parents = $element.parents("div[class*='tab-pane'], div[jb-type='FieldSet']");
                for (var i = 0; i < $parents.length; i++) {
                    var $parentElement = $parents.eq(i);
                    // Click to the appropriate tab that contains the focused element
                    if ($parentElement.hasClass("tab-pane")) {
                        $parentElement.parent().siblings("ul[jb-type='TabHeader']").find("li[jb-type='TabHeaderPageTitle'][data-index='" + $parentElement.attr("data-index") + "']").click();
                    }
                    //Expand a collapsed fieldset that contains the focused element
                    if ($parentElement.attr("jb-type") == "FieldSet" && $parentElement.hasClass("jb-collapsed")) {
                        $parentElement.children("div[jb-type='FieldSetHeader']").children('.toggle-state-icon').click();
                    }
                }
                //TODO: Smooth scroll into view before focusing
                var type = $element.attr("jb-type");
                switch (type) {
                    case "DropDownBox":
                        $element.trigger("chosen:activate");
                        break;
                    default:
                        $element.focus();
                        break;
                }
            };
            UiHelper.addStateToField = function ($element, state) {
                window._themeManager.setControlState($element, state);
                var type = $element.attr("jb-type");
                switch (type) {
                    case "DropDownBox":
                        window._themeManager.transferClassesOfStateToOtherElement($element, $element.next(), state);
                        break;
                    case "FileAttachment":
                        window._themeManager.transferClassesOfStateToOtherElement($element, $element.next("input[type='file']"), state);
                        break;
                    default:
                        break;
                }
            };
            UiHelper.removeStateFromField = function ($element, state) {
                window._themeManager.removeControlState($element, state);
            };
            UiHelper.lastEvaluatedValidationGroups = [Constants.ALL_GROUPS];
            return UiHelper;
        }());
        Validation.UiHelper = UiHelper;
    })(Validation = Joove.Validation || (Joove.Validation = {}));
})(Joove || (Joove = {}));
