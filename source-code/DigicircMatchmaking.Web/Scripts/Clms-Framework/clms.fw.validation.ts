namespace Joove.Validation {
    export class BindingEntry {
        public message?: string;
        public triggered?: boolean;
        public indexesInfo?: { key: string, indexes: Array<number> };        
        public rule?: JbRule;
        public requiredControlId?: string;
        public occurences?: number;
        public group?: string;
    } 

    export class FormValidationOptions {
        public groups: string[];
        public withDataValidationsCheck: boolean;
        public withRequiredFieldsCheck: boolean;    
    }

    export class Manager {
        public static validateFormAndExecute(executionCb: Function, options: FormValidationOptions) {
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
                window._ruleEngine.runClientDataValidations(options.groups).then((dataValidationStatus: boolean) => {
                    Manager.afterDataValidationsCheck(executionCb, requiredFieldsOk);
                });
            }
        }
        
        private static afterDataValidationsCheck(executionCb: Function, requiredFieldsOk: boolean) {
            var validations: Array<Joove.Validation.BindingEntry> = window.$form._validations == null
                ? []
                : window.$form._validations.summary;
            
            //data validation exception handles backend custom validation messages. i.e. object with same name already exist.
            var triggeredDataValidations = validations.filter(x => x.triggered === true && x.rule != null && x.group !== "_ValidationException_");

            UiHelper.markDataValidationRelatedControls(false);

            if (triggeredDataValidations.length == 0 && requiredFieldsOk === true) { // no DV fails and required fields OK: Execute!
                executionCb && executionCb();
                return;
            }
            else {
                UiHelper.showPanel(); // DV fails or empty required fields: Show panel, but continue checks below
            }

            var triggeredErrors = triggeredDataValidations.filter(x => x.rule.dataValidationMessageType == DataValidationMessageType.ERROR);

            if (requiredFieldsOk === false || triggeredErrors.length > 0) return; // DV errors, or missing required fields: block execution

            var triggeredWarnings = triggeredDataValidations.filter(x => x.rule.dataValidationMessageType == DataValidationMessageType.WARN);

            if (triggeredWarnings.length == 0) { // no DV warnings, no empty required (this means only DV infos were triggered): Execute!
                executionCb && executionCb();
            }
            else { // DV warnings: Show confirmation pop up
                window._popUpManager.question(
                    window._resourcesManager.getGlobalResource("RES_WEBFORM_VALIDATIONS_Warning"),
                    window._resourcesManager.getGlobalResource("RES_WEBFORM_VALIDATIONS_WarningConfirmation"),
                    (ignoreWarning: boolean) => {
                        if (ignoreWarning !== true) return;

                        setTimeout(() => {
                            executionCb && executionCb(); // user confirms: Execute!
                        }, 1000);
                    });
            }
        }  
    }

    export class Bindings {
        private static conditionalsTriggerTimeout: any = null;

        public static refresh(dv: JbRule, message: string, triggered: boolean, indexes: Array<number>) {                
            var newEntry: BindingEntry = {
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
        }

        public static removeBindingOfControl($el: JQuery) {
            const id = $el.attr("jb-id");

            delete window.$form._validations[id];
            delete window.$master._validations[id];

            var existing: Array<Joove.Validation.BindingEntry> = window.$form._validations.summary.filter(x => x.requiredControlId == id);

            if (existing.length == 0) return;

            var existingEntry = existing[0];
            var index = window.$form._validations.summary.indexOf(existingEntry);

            window.$form._validations.summary.splice(index, 1);
        }

        public static refreshEmptyRequired($control: JQuery, triggered: boolean) {
            const fromMaster = false; // todo
            const partialName = Core.getPartialOwnerControl($control)
            const controlId = $control.attr("jb-id");
            const controlKey = partialName == null || partialName.trim() == ""
                ? controlId
                : Core.getPartialViewControlOriginalName($control);
            const msg = window._resourcesManager.getEmptyRequiredFieldMessage(controlKey, fromMaster, partialName);
            const group = window["$$$"](controlId).eq(0).attr("dv-group");
           
            const newEntry: BindingEntry = {
                requiredControlId: controlId,
                message: msg,
                triggered: triggered,
                group: group,
                indexesInfo: Joove.Common.getIndexesOfControl($control)
            };

            Bindings.handleNewEntry(newEntry);            
        }

        public static clearSummary() {
            window.$form._validations.summary = [];
        }

        public static removeAllDataValidationsFromSummary() {
            var newArray = [];

            for (var i = 0; i < window.$form._validations.summary.length; i++) {
                var current: BindingEntry = window.$form._validations.summary[i];

                if (current.requiredControlId != null && current.requiredControlId.trim() != "") {
                    newArray.push(current); // keep only required fields entries
                }
            }

            window.$form._validations.summary = newArray;
        }

        public static removeAllRequiredFieldsFromSummary() {
            var newArray = [];

            for (var i = 0; i < window.$form._validations.summary.length; i++) {
                var current: BindingEntry = window.$form._validations.summary[i];

                if (current.rule != null) {
                    newArray.push(current); // keep data validation entries
                }
            }

            window.$form._validations.summary = newArray;
        }

        public static removeValidationsThatDontBelongToGroups(groups: string[]) {
            if (groups.indexOf(Constants.ALL_GROUPS) > -1) return; // keep all, since all belong to some group!

            var newArray = [];

            for (var i = 0; i < window.$form._validations.summary.length; i++) {
                var current: BindingEntry = window.$form._validations.summary[i];

                if (groups.indexOf(current.group) > -1) { // belongs to group: keep
                    newArray.push(current); 
                }                
            }

            window.$form._validations.summary = newArray;
        }

        private static handleNewEntry(entry: Joove.Validation.BindingEntry) {
            Bindings.updateBindings(entry);
            Bindings.updateValidationsSummary(entry);
            Bindings.updateMasterValidationsSummary(entry);
            Bindings.updateBoundControl(entry);

            Bindings.triggerDataValidationRelatedConditionals();
        }

        private static triggerDataValidationRelatedConditionals() {
            clearTimeout(Bindings.conditionalsTriggerTimeout);

            Bindings.conditionalsTriggerTimeout = setTimeout(() => {
                window._ruleEngine.updateDataValidationRelatedConditionals();
            }, 200);
        }


        private static entryHasContext(entry: Joove.Validation.BindingEntry): boolean {
            return entry.indexesInfo != null && entry.indexesInfo.indexes.length > 0;
        }

        private static updateBoundControl(entry: Joove.Validation.BindingEntry) {
            var prefix = entry.rule == null
                ? "jb_required_"
                : "";

            var targetName = entry.rule == null
                ? entry.requiredControlId
                : entry.rule.originalName;

            var $targets = $("[jb-validation-target='" + prefix + targetName + "']");

            if (Bindings.entryHasContext(entry) === true) {
                var $target = $targets.filter((i, el) => Common.getIndexKeyOfControl($(el)) == entry.indexesInfo.key);
                $target.toggle(entry.triggered); // update visibility
                $target.text(entry.message); // update text. Assuming control is label or something similar
            }
            else {
                $targets.toggle(entry.triggered); // toggle visibiliy only. Message handled by angular                
            }
        }

        private static updateBindings(entry: Joove.Validation.BindingEntry) {
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
        }

        private static updateValidationBindingWithoutContext(newEntry: Joove.Validation.BindingEntry, fromMasterPage: boolean, propName: string) {
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
        }

        private static updateValidationBindingInsideContext(entry: Joove.Validation.BindingEntry, fromMasterPage: boolean, propName: string) {
            if (fromMasterPage === true && window.$master._validations[propName] == null) {                
                window.$master._validations[propName] = [];                
            }
            else if (window.$form._validations[propName] == null) {
                window.$form._validations[propName] = [];
            }

            var existingEntries = fromMasterPage
                ? window.$master._validations[propName].filter(x => x.indexesInfo.key == entry.indexesInfo.key)
                : window.$form._validations[propName].filter(x => x.indexesInfo.key == entry.indexesInfo.key);

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
        }

        private static updateValidationsSummary(entry: Joove.Validation.BindingEntry) {
            var existing: Array<Joove.Validation.BindingEntry> = entry.rule == null
                ? window.$form._validations.summary.filter(x => x.requiredControlId == entry.requiredControlId)
                : window.$form._validations.summary.filter(x => x.rule != null && x.rule.name == entry.rule.name);

            var alreadyInSummary = existing.length > 0;
       
            if (Bindings.entryHasContext(entry) === true) {
                Bindings.updatedValidationSummaryForEntryInContext(entry, existing, alreadyInSummary);
            }
            else {
                Bindings.updatedValidationSummaryForEntryWithoutContext(entry, existing, alreadyInSummary);
            }
        }

        private static updateMasterValidationsSummary(entry: Joove.Validation.BindingEntry) {
            var existing: Array<Joove.Validation.BindingEntry> = entry.rule == null
                ? window.$form._validationsMaster.summary.filter(x => x.requiredControlId == entry.requiredControlId)
                : window.$form._validationsMaster.summary.filter(x => x.rule != null && x.rule.name == entry.rule.name);

            var alreadyInSummary = existing.length > 0;

            if (Bindings.entryHasContext(entry) === true) {
                Bindings.updatedMasterValidationSummaryForEntryInContext(entry, existing, alreadyInSummary);
            }
            else {
                Bindings.updatedMasterValidationSummaryForEntryWithoutContext(entry, existing, alreadyInSummary);
            }
        }

        public static resetAllRequiredFieldOccurencesInSummary() {
            for (var i in window.$form._validations.summary) {
                var entry: Validation.BindingEntry = window.$form._validations.summary[i];

                if (entry.requiredControlId == null || entry.requiredControlId.trim() == "") continue;

                entry.occurences = 0;
                entry.triggered = false;
            }
        }

        public static removeFromMasterSummaryNotTriggeredRequiredFields(controlNames: Array<string>) {
            if (controlNames == null) {
                controlNames = [];
            }

            const notRequiredNow = UiHelper.getRequiredFieldsThatMustBeIgnored();

            notRequiredNow.map(el => {
                const $el = $(el);
                const isInContext = Common.getIndexesOfControl($el).indexes.length > 0;

                if (isInContext === false) return true;

                controlNames.push($el.attr("jb-id"));
            });

            if (controlNames.length == 0) return;

            controlNames.map(id => {
                var existing: Array<Joove.Validation.BindingEntry> = window.$form._validationsMaster.summary.filter(x => x.requiredControlId == id);

                if (existing.length == 0) return;

                var existingEntry = existing[0];

                if (existingEntry.occurences > 0) return;

                var index = window.$form._validationsMaster.summary.indexOf(existingEntry);

                window.$form._validationsMaster.summary.splice(index, 1);
            });
        }

        public static removeFromSummaryNotTriggeredRequiredFields(controlNames: Array<string>) {            
            if (controlNames == null) {
                controlNames = [];
            }

            const notRequiredNow = UiHelper.getRequiredFieldsThatMustBeIgnored();

            notRequiredNow.map(el => {
                const $el = $(el);
                const isInContext = Common.getIndexesOfControl($el).indexes.length > 0;

                if (isInContext === false) return true; 

                controlNames.push($el.attr("jb-id"));
            });
            
            if (controlNames.length == 0) return;

            controlNames.map(id => {
                var existing: Array<Joove.Validation.BindingEntry> = window.$form._validations.summary.filter(x => x.requiredControlId == id);

                if (existing.length == 0) return;

                var existingEntry = existing[0];

                if (existingEntry.occurences > 0) return;

                var index = window.$form._validations.summary.indexOf(existingEntry);

                window.$form._validations.summary.splice(index, 1);
            });            
        }

        public static resetValidationOccurencesInSummary(dv: JbRule) {
            var existing: Array<Joove.Validation.BindingEntry>  = window.$form._validations.summary.filter(x => x.rule != null && x.rule.name == dv.name); 

            if (existing.length == 0) {
                return;
            }
            else {
                existing[0].occurences = 0;
            }
        }

        public static removeFromMasterSummaryWhenNotTriggered(dv: JbRule) {
            var existing: Array<Joove.Validation.BindingEntry> = window.$form._validationsMaster.summary.filter(x => x.rule != null && x.rule.name == dv.name);

            if (existing.length == 0) return;

            var existingEntry = existing[0];

            if (existingEntry.occurences > 0) return;

            var index = window.$form._validationsMaster.summary.indexOf(existingEntry);

            window.$form._validationsMaster.summary.splice(index, 1);
        }
       
        public static removeFromSummaryWhenNotTriggered(dv: JbRule) {
            var existing: Array<Joove.Validation.BindingEntry> = window.$form._validations.summary.filter(x => x.rule != null && x.rule.name == dv.name);

            if (existing.length == 0) return;

            var existingEntry = existing[0];

            if (existingEntry.occurences > 0) return;

            var index = window.$form._validations.summary.indexOf(existingEntry);

            window.$form._validations.summary.splice(index, 1);
        }

        private static updatedMasterValidationSummaryForEntryInContext(entry: Joove.Validation.BindingEntry, existing: Array<Joove.Validation.BindingEntry>, alreadyInSummary: boolean) {
            if (alreadyInSummary === false && entry.triggered === false) return; // not triggered, not in summary -> do nothing

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
        }

        private static updatedMasterValidationSummaryForEntryWithoutContext(entry: Joove.Validation.BindingEntry, existing: Array<Joove.Validation.BindingEntry>, alreadyInSummary: boolean) {
            if (alreadyInSummary === false && entry.triggered === false) return; // not triggered, not in summary -> do nothing

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
        }

        private static updatedValidationSummaryForEntryInContext(entry: Joove.Validation.BindingEntry, existing: Array<Joove.Validation.BindingEntry>, alreadyInSummary: boolean) {                                    
            if (alreadyInSummary === false && entry.triggered === false) return; // not triggered, not in summary -> do nothing

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
        }

        private static updatedValidationSummaryForEntryWithoutContext(entry: Joove.Validation.BindingEntry, existing: Array<Joove.Validation.BindingEntry>, alreadyInSummary: boolean) {            
            if (alreadyInSummary === false && entry.triggered === false) return; // not triggered, not in summary -> do nothing

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
        }

        public static gridIsBoundToValidationsSummary(grid: HTMLElement): boolean {
            return $(grid).attr("ng-model") == "_validations.summary";
        }
    }

    export class Constants {
        public static ALL_GROUPS = "_ALL_";
        public static dataValidationRoleMark = "has-dv-role";
        public static emptyRequiredMark = "has-required-role";
        public static nowRequiredMark = "jb-now-required";
        public static nowNotRequiredMark = "jb-now-not-required";
        public static prevColorAttr = "prev-role";
        public static errorRole = "danger";
        public static warningRole = "warning";
        public static infoRole = "info";
    }

    export class UiHelper {
        public static panelScope: Joove.Widgets.IValidationUiScope;
        public static lastEvaluatedValidationGroups: string[] = [Constants.ALL_GROUPS];
        public static disablePanel: boolean;

        public static showPanel() {
            if (UiHelper.disablePanel === true) return;

            UiHelper.panelScope.show();
        }

        public static getAllRequiredFields(): HTMLElement[] {
            var $allRequired = $(`.${window._themeManager.theme.defaultClassesByState.Required}`);

            var notHidden = $allRequired.toArray().filter((el) => {
                return $(el).hasClass("cf-hidden") === false && $(el).parents(".cf-hidden").length == 0;
            });

            return notHidden;
        }

        public static emptyRequiredFieldsExist(): boolean {
            return $(`.${window._themeManager.theme.defaultClassesByState.RequiredEmpty}`).length > 0;
        }

        public static updateEmptyRequiredFieldsState(groups: Array<string>, markEmpty: boolean) {
            if (groups == null || groups.length == 0) {
                groups = UiHelper.lastEvaluatedValidationGroups;
            }

            UiHelper.handleConditionallyHiddenAndNotRequiredFields();
     
            Validation.Bindings.removeValidationsThatDontBelongToGroups(groups);
            Validation.Bindings.resetAllRequiredFieldOccurencesInSummary();
            
            var controlsInsideContext: Array<string> = [];

            const required = UiHelper.getAllRequiredFields();

            for (let i = 0; i < required.length; i++) {
                const $current = $(required[i]);
                const controlGroup = $current.attr("dv-group");
                const isEmpty = UiHelper.fieldIsEmpty($current);
                const groupMustBeEvaluated = groups.indexOf(Constants.ALL_GROUPS) > -1 || groups.indexOf(controlGroup) > -1;
                const id = $current.attr("jb-id");
                const triggered = isEmpty === true && groupMustBeEvaluated === true;
                
                if (groupMustBeEvaluated === true) {
                    const isInContext = Common.getIndexesOfControl($current).indexes.length > 0;

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
        }

        public static getRequiredFieldsThatMustBeIgnored(): HTMLElement[] {
            var allRequired = UiHelper.getAllRequiredFields();

            var hidden = allRequired.filter((el) => {
                return $(el).hasClass("cf-hidden") === true || $(el).parents(".cf-hidden").length > 0;
            });

            var notNowRequired = $("." + Constants.nowNotRequiredMark).toArray();

            return hidden.concat(notNowRequired);
        }

        private static handleConditionallyHiddenAndNotRequiredFields() {
            const notRequiredNow = UiHelper.getRequiredFieldsThatMustBeIgnored();
          
            notRequiredNow.map(el => {
                const $el = $(el);
                const isInContext = Common.getIndexesOfControl($el).indexes.length > 0;

                if (isInContext === true) return true; // if inside context, occurences will reset before required fields state update
               
                Validation.Bindings.removeBindingOfControl($el);                
            });          
        }
        
        public static refreshPanel() {
            if (UiHelper.disablePanel === true) return;

            Joove.Core.applyScope(UiHelper.panelScope);
        }

        public static navigateFromDvBoundControl(el: HTMLElement) {
            const $el = $(el);
            const forMasterPage = false; // TODO !!!
            var targetValidation = $el.attr("jb-validation-target");

            const forRequiredControl = targetValidation.indexOf("jb_required_") == 0;

            if (forRequiredControl === true) {
                targetValidation = targetValidation.replace("jb_required_", "");
            }

            const dvBinding = forMasterPage
                ? window.$master._validations[targetValidation]
                : window.$form._validations[targetValidation];

            if (dvBinding == null) return;

            if (Array.isArray(dvBinding) === true) {
                var indexesInfo = Common.getIndexesOfControl($el);
                var entryMatches = (dvBinding as Validation.BindingEntry[]).filter(x => x.indexesInfo.key == indexesInfo.key);

                if (entryMatches != null && entryMatches.length > 0) {
                    UiHelper.navigateToRelatedControl(entryMatches[0]);
                }
            }
            else {
                UiHelper.navigateToRelatedControl(dvBinding);
            }
        }

        public static navigateToRelatedControl(dvEntry: Joove.Validation.BindingEntry) {
            var $controls = Validation.UiHelper.getAffectedControls(dvEntry);

            if (dvEntry.indexesInfo == null || dvEntry.indexesInfo.indexes == null || dvEntry.indexesInfo.indexes.length == 0) {
                Validation.UiHelper.setFocusOnField($controls.eq(0));
            }
            else {
                Validation.UiHelper.navigateToRelatedControlInGrid(dvEntry, $controls.eq(0));
            }
        }

        public static getAffectedControls(dvEntry: Joove.Validation.BindingEntry) {
            var $controls: JQuery = null;
            var forRequiredControl = dvEntry.requiredControlId != null && dvEntry.requiredControlId != "";

            if (forRequiredControl === true) {
                $controls = $("[jb-id='" + dvEntry.requiredControlId + "']");
            }
            else {
                $controls = dvEntry.rule.$affectedControls();
            }

            return $controls;
        }

        public static navigateToRelatedControlInGrid(dvEntry: Joove.Validation.BindingEntry, $controls: JQuery, recursionSettings?: any) {
            const MAX_RECURSIONS = 9;

            //The first call from navigateToRelatedControl should not have any recursionSettings defined
            if (recursionSettings == undefined) {
                recursionSettings = {
                    "currentGridIndex": dvEntry.indexesInfo.indexes.length - 1,
                    "$firstRowOfCurrentGrid": null,
                    "changePageIsActive": false,
                    "recursionsLeft": MAX_RECURSIONS,
                    "timeout": 50
                };
            } else {
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
                    var gridWidget = Common.getDirectiveScope($grid);
                    if (gridWidget != undefined) {
                        //Calculate the target page
                        var targetPage = Math.floor(dvEntry.indexesInfo.indexes[recursionSettings.currentGridIndex] / gridWidget.$pageSize);

                        if (targetPage != gridWidget.$currentPage) {
                            gridWidget.$gotoPage(targetPage);
                            recursionSettings.changePageIsActive = true;
                            recursionSettings.$firstRowOfCurrentGrid = $grid.children("tbody").children("tr:first");
                        } else {
                            recursionSettings.changePageIsActive = false;
                            recursionSettings.$firstRowOfCurrentGrid = null;
                            recursionSettings.currentGridIndex--;
                        }
                        Validation.UiHelper.navigateToRelatedControlInGrid(dvEntry, $controls, recursionSettings);
                    }
                } else {
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
                    } else {
                        //If we are on the same page wait a bit and retry again
                        recursionSettings.recursionsLeft--;
                        setTimeout(() => {
                            Validation.UiHelper.navigateToRelatedControlInGrid(dvEntry, $controls, recursionSettings);
                        }, recursionSettings.timeout);
                    }
                }
            } else {
                //This is where the grid pages have been properly set
                //Update again the controls since grid pages could be changed and refreshed the initial elements
                var controlsArray = Validation.UiHelper.getAffectedControls(dvEntry).toArray();
                for (var i = 0; i < controlsArray.length; i++) {
                    var $el = $(controlsArray[i]); 

                    if (Common.getIndexesOfControl($el).key != dvEntry.indexesInfo.key) continue;

                    Validation.UiHelper.setFocusOnField($el);   

                    break;
                }
            }
        }

        public static markDataValidationRelatedControls(forOnChange: boolean) {            
            var _loop = (validationsObject: any) => {
                if (validationsObject == null) return;

                for (var dv in validationsObject) {
                    if (dv == "summary") continue;

                    var property = validationsObject[dv];
                    var ruleHasContext = Array.isArray(property);

                    var entries = ruleHasContext === true
                        ? property as Array<Joove.Validation.BindingEntry>
                        : [property as Joove.Validation.BindingEntry];
                    
                    if (entries.length == 0) continue;

                    var rule = entries[0].rule;

                    if (rule == null) continue;
                    if (forOnChange === true && rule.evaluationTimes.indexOf(EvaluationTimes.OnChange) == -1) continue;
                    
                    entries.map(x => UiHelper.applyDataValidationColorRoleToAffectedControls(x));                                            
                }            
            }
            
            _loop(window.$master._validations);
            _loop(window.$form._validations);
        }

        private static applyDataValidationColorRoleToAffectedControls(dv: Joove.Validation.BindingEntry) {
            var $controls = dv.rule.$affectedControls();
            var controlsAffectedByCurrentIndexes = [];

            if (dv.indexesInfo != null) {                
                $controls.each((i, el) => {
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

            if (dv.rule.dataValidationMessageType == DataValidationMessageType.INFO) {
                newRole = Validation.Constants.infoRole;
            }
            else if (dv.rule.dataValidationMessageType == DataValidationMessageType.WARN) {
                newRole = Validation.Constants.warningRole;
            }

            controlsAffectedByCurrentIndexes.map(el => {
                if (dv.triggered === true &&
                    (UiHelper.lastEvaluatedValidationGroups.indexOf(Constants.ALL_GROUPS) > -1 || UiHelper.lastEvaluatedValidationGroups.indexOf(dv.group) > -1)) {
                    Validation.UiHelper.changeColorRole($(el), newRole, true);
                }
                else {
                    UiHelper.resetColorRole($(el), true);
                }
            });                        
        }

        private static changeColorRole($el: JQuery, role: string, fromDataValidation: boolean) {
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
        }

        private static resetColorRole($el: JQuery, fromDataValidation: boolean) {
            var markClass = fromDataValidation
                ? Constants.dataValidationRoleMark
                : Constants.emptyRequiredMark;

            $el.removeClass(markClass);

            var prevColorRole = $el.attr(Constants.prevColorAttr) || "";
            window._ruleEngine.cfHelper.setColorRole($el, prevColorRole, $el.attr("jb-type"));
        }        
       
        public static markEmptyRequired($el: JQuery) {
            UiHelper.changeColorRole($el, Constants.errorRole, false);
            UiHelper.addStateToField($el, ThemeManager.States.RequiredEmpty);                    
        }

        public static unmarkEmptyRequired($el: JQuery) {
            UiHelper.removeStateFromField($el, ThemeManager.States.RequiredEmpty);
            UiHelper.resetColorRole($el, false);            
        }

        private static fieldIsEmpty($element: JQuery): boolean {
            const type = $element.attr("jb-type");

            switch (type) {
                case "OptionButton":
                    const checkedItem = $('[type="radio"]:checked', $element);
                    return checkedItem.length === 0;

                case "DropDownBox":
                    const value = $element.val();

                    if (value == null) return true;

                    if (value.indexOf("?") === -1) return false;

                    const lastPosition = value.length - 1;

                    return value[0] === "?" && value[lastPosition] === "?";

                case "FileAttachment":
                    return $element.children("li").length === 0;

                case "ImageBox":
                    var $fileInput = $element.next("input");
                    return $fileInput.length > 0 && ($fileInput.val() == null || $fileInput.val().trim() === "");

                default:
                    return $element.val() == null || $element.val().trim() === "";
            }
        }

        private static getEmptyRequiredFields(groups: Array<string>): JQuery {
            const required = UiHelper.getAllRequiredFields();
            const empty = [];

            for (let i = 0; i < required.length; i++) {
                const $current = $(required[i]);
                const group = $current.attr("dv-group");
                const belongsToGroup = groups.indexOf(Constants.ALL_GROUPS) > -1 || groups.indexOf(group) > -1;

                if (belongsToGroup === false || UiHelper.fieldIsEmpty($current) === false) continue;
                
                empty.push($current);
            }

            return $(empty).map(function () { return this.toArray(); });
        }

        private static setFocusOnField($element: JQuery) {
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


            const type = $element.attr("jb-type");

            switch (type) {
                case "DropDownBox":
                    $element.trigger("chosen:activate");
                    break;

                default:
                    $element.focus();
                    break;
            }
        }

        private static addStateToField($element: JQuery, state) {
            window._themeManager.setControlState($element, state);

            const type = $element.attr("jb-type");

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
        }

        private static removeStateFromField($element: JQuery, state) {
            window._themeManager.removeControlState($element, state);
        }                
    }
}