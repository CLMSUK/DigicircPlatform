namespace Joove {
    export enum DataValidationMessageType {
        INFO = 1,
        WARN,
        ERROR,
        SUCCESS,
        CUSTOM
    }

    export var RuleTypes = {
        ConditionalFormatting: "cf",
        DataValidation: "dv",
        CalculatedExpression: "ce"
    }

    export enum EvaluationTimes {
        OnLoad = 1,
        OnChange,
        OnSubmit
    }

    export class DataSetRuleEvaluationResult {
        ApplyToColumn: boolean;
        ApplyToRow: boolean;
        ColumnNames: Array<string>;
        Expression: any;
        Indexes: Array<number>;
        Key: any;
        RuleName: string;
        Status: boolean;

        get EvaluationScope(): IEvaluationScope {
            const that = this;
            const status = new Promise<boolean>((resolve, reject) => {
                resolve(that.Status);
            });
            const expression = new Promise<string>((resolve, reject) => {
                resolve(that.Expression);
            });
            return {
                Status: status,
                Expression: expression
            }
        }
    }

    export interface IJbRule {

    }

    export interface IEvaluationScope {
        Status: Promise<boolean>;
        Expression: Promise<string>;
    }

    export interface IJbRuleOptions {
        name?: string;
        type?: string;
        partialView?: string;
        getContext?: Function;
        evaluationTimes?: Array<Joove.EvaluationTimes>;
        group?: string;
        contextControlName?: string;
        dataValidationMessageType?: DataValidationMessageType;
        evaluatedAtServer?: boolean;
        condition?: (_parents: any) => any;
        expression?: (_parents: any) => any;
        isDataSetRule?: boolean;
        originalName?: string;
        evaluateInContext?: Function;
        fromMasterPage?: boolean;
        isRelatedToDataValidation?: boolean;
    }

    export interface IRuleInfo {
        Name: string;
        Type: string;
        Indexes: Array<string>;
        PartialViewControls: Array<string>;
    }

    export interface IServerRulesInfo {
        info: Array<IRuleInfo>;
        controls: any;
    }

    export class JbRule {
        name: string;
        type: string;
        partialView: string;
        getContext: Function;
        evaluationTimes: Array<EvaluationTimes>;
        evaluatedAtServer = false;
        serverSideEvaluations = null;
        runsAtServer = false;
        isDataSetRule = false;
        group: string;
        contextControlName: string;
        condition: (_parents: any) => Promise<any>;
        expression: (_parents: any) => Promise<any>;
        evaluatedCondition: boolean;
        dataValidationMessageType: DataValidationMessageType;
        originalName?: string;
        fromMasterPage?: boolean;
        evaluateInContext?: Function;
        isRelatedToDataValidation?: boolean;

        constructor(options: IJbRuleOptions) {
            this.init(options);
        }

        init(options: IJbRuleOptions) {
            this.name = options.name;
            this.contextControlName = options.contextControlName;
            this.isDataSetRule = options.isDataSetRule;
            this.type = options.type;
            this.partialView = options.partialView;
            this.getContext = options.getContext;
            this.evaluationTimes = options.evaluationTimes;
            this.group = options.group;
            this.evaluatedAtServer = options.evaluatedAtServer;
            this.dataValidationMessageType = options.dataValidationMessageType || DataValidationMessageType.ERROR;
            this.originalName = options.originalName;
            this.fromMasterPage = options.fromMasterPage;
            this.evaluateInContext = options.evaluateInContext;
            this.isRelatedToDataValidation = options.isRelatedToDataValidation;

            this.condition = options.condition == null
                ? null
                : this.assureIsPromise(options.condition);

            this.expression = options.expression == null
                ? null
                : this.assureIsPromise(options.expression);

            if (this.type === RuleTypes.ConditionalFormatting) {
                this.runsAtServer = options.condition == null;
            } else if (this.type === RuleTypes.CalculatedExpression) {
                this.runsAtServer = options.condition == null;
            } else if (this.type === RuleTypes.DataValidation) {
                this.runsAtServer = options.condition == null;
            }
        }

        assureIsPromise<T>(expression: (parents: any) => any): (parents: any) => Promise<T> {
            const errorMessage = new FriendlyMessage({
                Title: "Rule evaluation",
                OriginalExceptionMessage: ""
            });

            return (parents) => {
                return new Promise<T>((resolve, reject) => {
                    try {
                        resolve(expression(parents));
                    } catch (e) {
                        if (window._context.mode !== "Production") {
                            FriendlyMessageGenerator.showPopUp(errorMessage);
                        }
                        console.error(e);
                        reject("");
                    }
                });
            };
        }

        getRuleAttribute(): string {
            return `${this.type}-${this.name}`;
        }

        $affectedControls(): JQuery {
            return $(`[${this.getRuleAttribute()}]`);
        }

        /**
         * This method is called when Rule Engine requests the evaluation of this Rule instance.
         * It searches in the viewDTO Rule Arrays to find the Rule evaluation by name.
         *     
         * When found, the evaluation is marked so that next time the Rule is reevaluated,
         * since this will set this.serverSideEvaluations property to null.
         */
        findServerSideEvaluations(): void {
            this.serverSideEvaluations = null;

            let rulesArray = null;

            if (this.type === RuleTypes.ConditionalFormatting) {
                rulesArray = window.viewDTO.ConditionalFormattings;
            } else if (this.type === RuleTypes.CalculatedExpression) {
                rulesArray = window.viewDTO.CalculatedExpressions;
            } else if (this.type === RuleTypes.DataValidation) {
                rulesArray = window.viewDTO.DataValidations;
            }

            if (rulesArray == null) return;

            for (let i = 0; i < rulesArray.length; i++) {
                const current = rulesArray[i];

                if (current.Name === this.name && current.evaluated !== true) {
                    current.evaluated = true; // mark as evaluated
                    this.serverSideEvaluations = current.Evaluations;
                    break;
                }
            }
        }

        static createRulesForPartialControls(controls: Array<string>, createRule: (name: string) => Array<JbRule>): Array<JbRule> {
            let rules = [];
            for (let i = 0; i < controls.length; i++) {
                const rule = createRule(controls[i]);
                rules = rules.concat(rule);
            }
            return rules;
        }
    }

    export class RuleEngine {
        onLoadHasRun = false;
        conditionalFormattings: Array<JbRule> = [];
        dataValidations: Array<JbRule> = [];
        calculatedExpressions: Array<JbRule> = [];
        serverRules: Array<JbRule> = [];
        dataSetRules: Array<JbRule> = [];
        cfHelper = new ConditionalFormattingsHelper();
        latestServerRulesResults = null;        
	customRegisteredFunctions: Array<any> = [];
        private _lastOnSubmitDatavalidation: number;

        addServerRules(rules: Array<JbRule>): void {
            for (let i = 0; i < rules.length; i++) {
                if (rules[i].isDataSetRule === false &&
                    (rules[i].runsAtServer || rules[i].type === RuleTypes.DataValidation)) {
                    this.serverRules.push(rules[i]);
                }
            }
        }

        addDataSetRules(rules: Array<JbRule>): void {
            for (let i = 0; i < rules.length; i++) {
                if (rules[i].isDataSetRule) {
                    this.dataSetRules.push(rules[i]);
                }
            }
        }

        addConditionalFormattings(rules: Array<JbRule>): void {
            this.addServerRules(rules);
            this.addDataSetRules(rules);

            const concated = this.conditionalFormattings.concat(rules);
            this.conditionalFormattings = concated;
        }

        addDataValidations(rules: Array<JbRule>): void {
            this.addServerRules(rules);
            this.addDataSetRules(rules);

            const concated = this.dataValidations.concat(rules);
            this.dataValidations = concated;
        }

        addCalculatedExpressions(rules: Array<JbRule>): void {
            this.addServerRules(rules);
            this.addDataSetRules(rules);

            const concated = this.calculatedExpressions.concat(rules);
            this.calculatedExpressions = concated;
        }

        prepareRuleInfoForServerSideExecution(rules: Array<JbRule>): IServerRulesInfo {
            const ruleInfo: Array<IRuleInfo> = [];
            const controlsOfEachRuleCombination = {};

            for (let i = 0; i < rules.length; i++) {
                const rule = rules[i];

                const controls = rule.$affectedControls();

                if (controls.length === 0 && rule.getContext != null) continue;

                const key = rule.name + rule.type;

                const info = {
                    Name: rule.name,
                    Type: rule.type,
                    Indexes: [],
                    PartialViewControls: []
                };

                ruleInfo.push(info);

                // Rule is in Partial View
                if (rule.partialView != null) {
                    this.prepareRuleInfoForPartialViews(controls, info, controlsOfEachRuleCombination, rule, key);
                    continue;
                }

                if (rule.getContext == null) { // Rule is outside context
                    controlsOfEachRuleCombination[key] = controls;
                } else { // Rule is inside context 
                    const contextIndexesCache = [];

                    for (let j = 0; j < controls.length; j++) {
                        this.prepareRuleInfoForControlInsideContext(controls.eq(j),
                            info,
                            controlsOfEachRuleCombination,
                            contextIndexesCache,
                            key);
                    }
                }
            }

            return { info: ruleInfo, controls: controlsOfEachRuleCombination };
        }

        prepareRuleInfoForPartialViews(controls: JQuery, info, controlsOfEachRuleCombination, rule, key): void {
            const partialViewContextIndexesCache = [];

            for (let j = 0; j < controls.length; j++) {
                const $el = controls.eq(j);

                const partialViewControlName = $el.closest("[jb-type='PartialView']").attr("jb-id");
                const newKey = partialViewControlName + key;

                if (info.PartialViewControls.indexOf(partialViewControlName) === -1) {
                    info.PartialViewControls.push(partialViewControlName);
                }

                if (rule.getContext == null) {
                    if (controlsOfEachRuleCombination[newKey] == null) {
                        controlsOfEachRuleCombination[newKey] = [];
                    }

                    controlsOfEachRuleCombination[newKey].push($el);
                } else {
                    this.prepareRuleInfoForControlInsideContext($el,
                        info,
                        controlsOfEachRuleCombination,
                        partialViewContextIndexesCache,
                        newKey);
                }
            }
        }

        prepareRuleInfoForControlInsideContext(control: JQuery, info, controlsOfEachRuleCombination, cache, currentKey: string) {
            const indexInfo = Common.getIndexesOfControl(control);
            const indexes = indexInfo.indexes;
            const newKey = currentKey + indexInfo.key;

            if (controlsOfEachRuleCombination[newKey] == null) {
                controlsOfEachRuleCombination[newKey] = [];
            }

            if (cache.indexOf(indexInfo.key) === -1) {
                info.Indexes.push(indexes);
                cache.push(indexInfo.key);
            }

            controlsOfEachRuleCombination[newKey].push(control);
        }

        getRule(name: string, type: string, rules?): JbRule {
            if (rules == null) {
                let collection = this.conditionalFormattings;

                if (type === RuleTypes.DataValidation) {
                    collection = this.dataValidations;
                } else if (type === RuleTypes.CalculatedExpression) {
                    collection = this.calculatedExpressions;
                }

                rules = collection;
            }

            for (let i = 0; i < rules.length; i++) {
                const rule = rules[i];
                if (rule.name === name && rule.type === type) {
                    return rule;
                }
            }
            return null;
        }

        getServerRulesInfo(evalTime: EvaluationTimes): IServerRulesInfo {
            const toEvaluate = [];
            for (let i = 0; i < this.serverRules.length; i++) {
                const rule = this.serverRules[i];

                if (this.ruleMustBeEvaluatedAtEvaluationTime(rule, evalTime) === false) continue;

                toEvaluate.push(rule);
            }
            return this.prepareRuleInfoForServerSideExecution(toEvaluate);
        }

        ruleMustBeEvaluatedAtEvaluationTime(rule: JbRule, evalTime: EvaluationTimes) {
            if (evalTime == null) return false;

            if (evalTime !== EvaluationTimes.OnSubmit) {
                return rule.evaluationTimes.indexOf(evalTime) > -1;
            } else {
                // on submit: Evaluate OnChange & OnSubmit at the same time
                return rule.evaluationTimes.indexOf(evalTime) > -1 ||
                    rule.evaluationTimes.indexOf(EvaluationTimes.OnChange) > -1;
            }
        }

        evaluatesServerRules(rulesToEvaluate: any, evalTime: EvaluationTimes, groups: string[], cb?) {
            if (rulesToEvaluate.length === 0) {
                if (cb) cb();
                return;
            }

            const rulesInfo = this.getServerRulesInfo(evalTime);
            if (rulesInfo.info.length === 0) {
                if (cb) cb();
                return;
            }

            const model = Common.getModel();
            const data = { 'model': model, 'rules': rulesInfo.info, 'group': null };

            Core.executeControllerAction(window._context.currentController,
                "GetRulesEvaluation",
                "POST",
                [evalTime],
                data,
                null,
                cb,
                null,
                rulesInfo);
        }

        updateRulesOfControl($element: JQuery) {
            if (this.latestServerRulesResults == null) {
                return;
            }

            this.updateSpecificRulesOfControl($element,
                this.latestServerRulesResults.ConditionalFormattings || [],
                RuleTypes.ConditionalFormatting);
            this.updateSpecificRulesOfControl($element,
                this.latestServerRulesResults.CalculatedExpressions || [],
                RuleTypes.CalculatedExpression);
        }

        updateSpecificRulesOfControl($element: JQuery, ruleResults, type: string) {
            const controlIndexes = Common.getIndexesOfControl($element).key;

            for (let i = 0; i < ruleResults.length; i++) {
                const rule = this.getRule(ruleResults[i].Name, type);
                const attr = $element.attr(rule.getRuleAttribute());
                if (Common.stringIsNullOrEmpty(attr)) continue;

                let evalutationForElementIndex = ruleResults[i].Evaluations[0];
                //if more than one evaluation(= context) find the correct evaluation for this control
                if (ruleResults[i].Evaluations.length > 1) {
                    evalutationForElementIndex = null;
                    for (let j = 0; j < ruleResults[i].Evaluations.length; j++) {
                        const evaluation = ruleResults[i].Evaluations[j];
                        const indexes = Common.serializeIndexes(evaluation.Indexes);
                        if (controlIndexes === indexes) {
                            evalutationForElementIndex = eval;
                            break;
                        }
                    }
                }
                if (evalutationForElementIndex != null) {
                    this.applyCondionalFormatting(rule, evalutationForElementIndex, $($element));
                }
            }
        }

        applyServerRulesResult(results, rulesInfo) {
            this.latestServerRulesResults = results;

            this.applyServerRules(results.DataValidations || [], RuleTypes.DataValidation, rulesInfo).then((value) => {
                Validation.UiHelper.refreshPanel();
                return value;
            });
        }

        applyServerRules(rules, type, rulesInfo): Promise<boolean> {
            const rulesPromises = new Array<Promise<boolean>>();

            for (let i = 0; i < rules.length; i++) {
                const result = rules[i];
                const key = (result.PartialControl || "") + result.Name + type;
                const rule = this.getRule(result.Name, type);

                for (let j = 0; j < result.Evaluations.length; j++) {
                    const evaluation = result.Evaluations[j];
                    let currentKey = key;

                    if (evaluation.Indexes != null) {
                        let serializedIndexes = Common.serializeIndexes(evaluation.Indexes);

                        if (serializedIndexes === "_") {
                            serializedIndexes = "";
                        }

                        currentKey = key + serializedIndexes;
                    }

                    rulesPromises.push(this.applyRule(rule, evaluation, $(rulesInfo.controls[currentKey]), evaluation.Indexes));
                }
            }

            return Promise.all<boolean>(rulesPromises)
                .then((values) => {
                    return values.filter((value) => value).length <= 0;
                });
        }

        applyDataSetRulesResult(results: Array<DataSetRuleEvaluationResult>) {
            if (results == null || results.length === 0) return;

            for (let i = 0; i < results.length; i++) {
                const result = results[i];
                const rule = this.getRule(result.RuleName, RuleTypes.ConditionalFormatting, this.dataSetRules);

                if (rule == null || rule.contextControlName == null || rule.contextControlName.trim() === "") continue;

                const key = result.Key;
                const contextControlSelector = `[jb-id='${rule.contextControlName}']`;
                const rowSelector = `[data-key='${result.Key}']`;
                const controlsSelector = `[${RuleTypes.ConditionalFormatting}-${rule.name}]`;
                const $controls = $(contextControlSelector + " " + rowSelector + " " + controlsSelector);

                this.applyRule(rule, result.EvaluationScope, $controls, []);
            }
        }

        private static lastChangeRequest;
        private isRunning: boolean = false;

        // this is the entry point for externals that update all rules
        update(evaluationTime: EvaluationTimes, groups?: string[], done?: Function): Promise<void> {
            if (this.onLoadHasRun == false && evaluationTime == EvaluationTimes.OnChange) {
                return Promise.resolve();
            }

            if (evaluationTime == EvaluationTimes.OnChange) {

                if (this.isRunning == false) {
                    return this.actualUpdate(evaluationTime, groups, done);
                } else {
                    clearTimeout(RuleEngine.lastChangeRequest);
                    //todo: here promise should be returned
                    RuleEngine.lastChangeRequest = setTimeout(() => {
                        this.update(evaluationTime, groups, done);
                    }, 250);
                }

                return Promise.resolve();
            }

            return this.actualUpdate(evaluationTime, groups, done);
        }

        actualUpdate(evaluationTime: EvaluationTimes, groups?: string[], done?: Function): Promise<void> {
            this.isRunning = true;

            const finish = () => {
                this.isRunning = false;
                $(".hidden-before-rule-apply").removeClass("hidden-before-rule-apply");
                done && done();

                Core.applyScope();
                if (evaluationTime == EvaluationTimes.OnLoad) {
                    this.onLoadHasRun = true;
                }

                //Execute any custom registered functionalities
                for (var i = 0; i < this.customRegisteredFunctions.length; i++) {
                    this.customRegisteredFunctions[i].func && this.customRegisteredFunctions[i].func();
                }
            };            

            return this.evaluateRules(evaluationTime, groups)
                .then(() => {
                    finish();
                })
                .catch((e) => {
                    this.isRunning = false;
                    Joove.Logger.error("Rule engine error", e);
                });;
        }
	
	addCustomFunction(name: string, func: Function) {
            var existingEntry = $.grep(this.customRegisteredFunctions, (entry) => { return entry.name == name; })[0];
            if (existingEntry != undefined) {
                console.log("Custom function: " + name + " already exists! Overiding...");
                existingEntry.func = func;
            } else {
                console.log("Adding entry " + name);
                this.customRegisteredFunctions.push({ "name": name, "func": func });
            }
        }

        removeCustomFunction(name: string) {
            var existingEntry = $.grep(this.customRegisteredFunctions, (entry) => { return entry.name == name; })[0];
            if (existingEntry == undefined) {
                console.log("Entry " + name + " doesn't exist. Exiting ...");
                return;
            } else {
                console.log("Removing entry " + name);
                this.customRegisteredFunctions = $.grep(this.customRegisteredFunctions, (entry) => { return entry.name != name; });
            }
        }

        runClientDataValidations(groups: string[]) {
            this._lastOnSubmitDatavalidation = new Date().getTime();
            return this.evaluateDataValidations(EvaluationTimes.OnSubmit, groups);
        }

        updateDataValidationRelatedConditionals() {
            var rules = this.conditionalFormattings.filter(x => x.isRelatedToDataValidation === true);
           
            if (rules == null || rules.length == 0) return;

            rules.map(x => this.updateSingleRule(x.name, x.type, EvaluationTimes.OnChange, [x.group]));
        }

        // this is the entry point for externals that update single rule
        updateSingleRule(name: string, type: string, evaluationTime: EvaluationTimes, groups: string[]) {
            //console.log(`Updating rule ${name} for (1: load, 2: change, 3: submit) ->${evaluationTime}`);
        
            let rulesArray: Array<JbRule>;
            
            if (type === RuleTypes.ConditionalFormatting) {
                rulesArray = this.conditionalFormattings;
            }
            else if (type === RuleTypes.DataValidation) {
                rulesArray = this.dataValidations;
            }
            else if (type === RuleTypes.CalculatedExpression) {
                rulesArray = this.calculatedExpressions;
            }

            let matches = rulesArray.filter(x => x.name == name);
            let rule = matches == null || matches.length == 0 ? null : matches[0];
            
            if (rule == null) {
                console.error(`Could not find ${type} rule: ${name}`);
                return;
            }

            if (rule.evaluatedAtServer === true) {
                const ruleRequestData = {
                    name: rule.name,
                    type: rule.type
                };

                this.evaluatesServerRules([ruleRequestData], evaluationTime, groups);
            }
            else {
                this.evaluateRule(rule, groups, EvaluationTimes.OnChange);
            }
        }

        evaluateConditionalFormattings(evaluationTime: EvaluationTimes): Promise<boolean> {
            const rulesPromises = new Array<Promise<boolean>>();

            for (let i = 0; i < this.conditionalFormattings.length; i++) {
                const rule = this.conditionalFormattings[i];
                if (this.ruleMustBeEvaluatedAtEvaluationTime(rule, evaluationTime) === false) continue;
                rulesPromises.push(this.evaluateRule(rule, null, evaluationTime));
            }

            return (Promise.all<boolean>(rulesPromises as any) as any)
                .then(() => {
                    return true;
                });
        }

        evaluateCalculatedExpressions(evaluationTime: EvaluationTimes): Promise<boolean> {
            const rulesPromises = new Array<Promise<boolean>>();

            for (let i = 0; i < this.calculatedExpressions.length; i++) {
                const rule = this.calculatedExpressions[i];
                if (this.ruleMustBeEvaluatedAtEvaluationTime(rule, evaluationTime) === false) continue;
                rulesPromises.push(this.evaluateRule(rule, null, evaluationTime));
            }

            return (Promise.all<boolean>(rulesPromises as any) as any)
                .then(() => {
                    return true;
                });
        }

        /**
         *
         * @return true if all datavalidations for the group are ok
         */
        evaluateDataValidations(evaluationTime: EvaluationTimes, groups: string[]): Promise<boolean> {
            const rules = new Array<Promise<boolean>>();

            if (evaluationTime == EvaluationTimes.OnChange) {
                var ranBefore = new Date().getTime() - this._lastOnSubmitDatavalidation;
                if (ranBefore < 500) {
                    //This is to prevent running datavalidations running after a submit changes event
                    //and overriding the datavalidation outcome
                    return new Promise((resolve, reject) => {
                        resolve();
                    });
                }
            }

            if (groups == null || groups.length == 0) {
                groups = Validation.UiHelper.lastEvaluatedValidationGroups;
            }
            else {
                Validation.UiHelper.lastEvaluatedValidationGroups = groups;
            }

            var evaluateAllGroups = groups.indexOf(Validation.Constants.ALL_GROUPS) > -1;
            
            Validation.Bindings.removeValidationsThatDontBelongToGroups(groups);
                        
            for (let i = 0; i < this.dataValidations.length; i++) {
                const rule = this.dataValidations[i];

                if (this.ruleMustBeEvaluatedAtEvaluationTime(rule, evaluationTime) === false) continue;

                if (evaluateAllGroups === false && groups.filter(x => x == rule.group).length == 0) continue;
                
                const evaluation = this.evaluateRule(rule, groups, evaluationTime);

                rules.push(evaluation);
            }

            return Promise.all<boolean>(rules)
                .then((values) => {
                    return values.filter((value) => value).length <= 0;
                }).then((value) => {
                    Validation.UiHelper.refreshPanel();
                    return value;
                });
        }

        evaluateRules(evaluationTime: EvaluationTimes, groups: string[]): Promise<void> {
            return this.evaluateCalculatedExpressions(evaluationTime)
                .then(() => {
                    this.evaluateConditionalFormattings(evaluationTime);
                })
                .then(() => {
                    this.evaluateDataValidations(evaluationTime, groups);
                });
        }

        /**
         *
         * @return true if all datavalidations for the group are ok
         */
        evaluateRule(rule: JbRule, groups: string[], evaluationTime: EvaluationTimes): Promise<boolean> {
            if (rule.runsAtServer) {
                return new Promise<boolean>((resolve) => {
                    /* Changed this default return value since the logic in function evaluateDataValidations
                     * will return true (meaning all validations passed) when all the rule results are false:
                     *
                     *    return values.filter((value) => value).length <= 0;
                     * 
                     */
                    resolve(false);
                    //resolve(true);
                });
            }

            const $controls = rule.$affectedControls();
            const evaluationCache = new Array<IEvaluationScope>();
            const rules = new Array<Promise<boolean>>();

            if (rule.getContext == null) {
                return this.applyRule(rule,
                    {
                        Status: rule.condition(null),
                        Expression: rule.expression == null ? null : rule.expression(null)
                    },
                    $controls, []);
            }
            else {
                const context = rule.getContext();

                if (context != undefined &&
                    context.length === 1 &&
                    context[0] != undefined &&
                    context[0].length === 0) {
                    //This block is to avoid evaluating rules on a contect with zero items
                    rules.push(new Promise<boolean>((resolve) => {
                        resolve(false);
                    }));
                }
                else {
                    var _evaluate = (indexesInfo: { key: string, indexes: Array<number> }, $ctrl: JQuery) => {
                        const parents = this.getRuleParents(rule, indexesInfo.indexes);

                        if (parents == null) return;

                        let evaluation = evaluationCache[indexesInfo.key];

                        if (evaluation == null) {
                            evaluation = evaluationCache[indexesInfo.key] = {
                                Status: rule.condition(parents),
                                Expression: rule.expression == null
                                    ? null
                                    : rule.expression(parents)
                            };
                        }

                        const isRuleOk = this.applyRule(rule, evaluation, $ctrl, indexesInfo.indexes);

                        rules.push(isRuleOk);
                    };

                    if (rule.type === RuleTypes.DataValidation) {
                        Validation.Bindings.resetValidationOccurencesInSummary(rule);

                        rule.evaluateInContext((indexes) => {
                            const indexKey = indexes.join("_") + "_";
                            const indexesInfo = {
                                key: indexKey,
                                indexes: indexes
                            };

                            const $ctrl = $controls.filter((i, el) => Common.getIndexKeyOfControl($(el)) == indexKey).eq(0);                                                        

                            _evaluate(indexesInfo, $ctrl);                                                                               
                        });
                        
                        Validation.Bindings.removeFromSummaryWhenNotTriggered(rule);
                        Validation.Bindings.removeFromMasterSummaryWhenNotTriggered(rule);
                    }
                    else {
                        for (let i = 0; i < $controls.length; i++) {
                            const indexInfo = Common.getIndexesOfControl($controls.eq(i));                            
                            _evaluate(indexInfo, $controls.eq(i));                                
                        }                        
                    }                    
                }
            }

            return (Promise.all<boolean>(rules as any) as any).then((values) => {
                return values.filter((value) => !value).length <= 0;
            });
        }
        
        getRuleParents(rule: JbRule, indexes: Array<number>): Array<any> {            
            const parents = [];
            const context = rule.getContext(indexes);

            if (context == null) return null;

            for (let j = 0; j < context.length; j++) {
                if (context[j] == null) {
                    parents.push(null);
                    break;
                }
                parents.push(context[j][indexes[j]]);
            }

            const containsNull = parents.filter(a => a == null).length > 0;
            
            return containsNull ? null : parents;
        }
        
        // returns true if all datavalidations for the group are ok
        applyRule(rule: JbRule, evaluation: IEvaluationScope, $controls: JQuery, indexes: Array<number>): Promise<boolean> {
            /*evaluation: 
            bool Status;
            string Expression;
            int[] Indexes;       
            */

            // Convert 'flat' evaluations received from backend to promise based
            if (evaluation.Status instanceof Promise === false) {
                var clonedStatus = JSON.parse(JSON.stringify(evaluation));

                evaluation.Status = new Promise<boolean>((resolve) => {
                    resolve(clonedStatus.Status);
                });

                evaluation.Expression = new Promise<string>((resolve) => {
                    resolve(clonedStatus.Expression);
                });
            }
       
            return evaluation.Status.then((status) => {

                if (status === false && rule.type === RuleTypes.CalculatedExpression) {
                    return status;
                }

                //Save the evaluation result
                if (rule.type === RuleTypes.DataValidation) {
                    rule.evaluatedCondition = status;
                }
                //...but do not return true for Warning and Info data validations
                if (rule.type === RuleTypes.DataValidation && (rule.dataValidationMessageType == DataValidationMessageType.WARN || rule.dataValidationMessageType == DataValidationMessageType.INFO)) {                
                    return evaluation.Expression.then(() => {
                        this.applyDataValidation(rule, evaluation, indexes);
                        return false;
                    });
                }

                if (rule.type === RuleTypes.ConditionalFormatting) {
                    this.applyCondionalFormatting(rule, evaluation, $controls);
                }
                else if (rule.type === RuleTypes.DataValidation) {                    
                    return evaluation.Expression.then(() => {
                        this.applyDataValidation(rule, evaluation, indexes);
                        return status;
                    });
                }
                else if (rule.type === RuleTypes.CalculatedExpression) {
                    return evaluation.Expression.then(() => {
                        this.applyCalculatedExpression(rule, evaluation, $controls);
                        return status;
                    });
                }

                return status;

            }) as Promise<boolean>;
        }


        applyCondionalFormatting(rule: JbRule, evaluation: IEvaluationScope, $controls: JQuery) {
            $controls = $controls || rule.$affectedControls();
            const that = this;
            evaluation.Status.then((status) => {
                for (let i = 0; i < $controls.length; i++) {
                    const $control = $($controls[i]);
                    const attributeValue = $control.attr(rule.getRuleAttribute());

                    const actions = JSON.parse(Common.replaceAll(attributeValue, "`", "\""));
                    const toDoList = status ? actions.whenTrue : actions.whenFalse;

                    that.applyConditionalFormattingOnControl($control, status, toDoList);
                }
            });
        }

        applyConditionalFormattingOnControl($control: JQuery, status: boolean, toDoList: Array<string>) {
            if (toDoList == null) return;

            for (let j = 0; j < toDoList.length; j++) {
                const info = this.parseConditionalFormattingToDoString(toDoList[j]);
                this.cfHelper.applyFormatting($control, info.type, info.extraData, status);
            }
        }

        parseConditionalFormattingToDoString(toDoString: string): { type: string, extraData: string } {
            const toDoParts = toDoString.split("|");
            const type = toDoParts[0];
            const extraData = toDoParts.length > 1 ? toDoParts[1] : null;

            return { type: type, extraData: extraData };
        }

        applyDataValidation(rule: JbRule, evaluation: IEvaluationScope, indexes: Array<number>) {
            const that = this;

            evaluation.Status.then((status) => {
                evaluation.Expression.then((message) => {                    
                    Validation.Bindings.refresh(rule, message, status, indexes);                                        
                    return status;
                });
            });
        }
       
        applyCalculatedExpression(rule: JbRule, evaluation: IEvaluationScope, $controls: JQuery) {
            const expression = evaluation.Expression;

            if (expression == null) return; // null means leave unchanged...

            expression.then((value) => {
                for (let i = 0; i < $controls.length; i++) {
                    this.applyCalculatedExpressionOnControl($($controls[i]), value, rule.runsAtServer === false);
                }
            });
        }

        applyCalculatedExpressionOnControl($control: JQuery, expression: string, evaluatedOnClient: boolean) {
            if (expression == null || expression === NULL) return;

            const controlType = $control.attr("jb-type");
            let binding = null;
            let boundToDataSet = $control.attr("bound-to-dataset");

            switch (controlType) {
                case "Label":
                    binding = $control.attr("ng-bind");
                    break;

                case "TextBoxBase":
                case "TextBox":
                    if ($control.attr("ng-my-number") != null) {
                        binding = $control.attr("ng-my-number");
                    }
                    else {
                        binding = $control.attr("ng-model");
                    }
                    break;

                case "CheckBox":
                case "TextArea":
                case "DropDownBox":
                case "RichTextBox":
                case "PasswordTextBox":
                    binding = $control.attr("ng-model");
                    break;

                case "DateTimeBox":
                    binding = $control.attr("ng-target");
                    break;
                default:
                    console.error("Calculated Expression not implemented for control: " + controlType);
                    break;
            }

            if (evaluatedOnClient && Common.stringIsNullOrEmpty(binding) === false && boundToDataSet !== "true") {
                this.applyCalculatedExpressionToBinding($control, binding, expression);
            }
            else {
                var hasFormatting = $control.hasClass(ValueFormat.MarkClass);

                if (hasFormatting === true) {
                    var directive = Joove.Common.getDirectiveScope($control);

                    if (directive != null) {
                        var formatter = directive.getValueFormat();

                        expression = formatter == null
                            ? expression
                            : formatter.format(expression);
                    }
                }

                switch (controlType) {
                    case "Label":
                        $control.text(expression);
                        break;

                    case "TextBoxBase":
                    case "TextBox":
                    case "CheckBox":
                    case "TextArea":
                    case "DropDownBox":
                    case "RichTextBox":
                    case "PasswordTextBox":
                        $control.val(expression);
                        Core.elementData($control, "old-value", expression);
                        break;

                    default:
                        console.error("Calculated Expression not implemented for control: " + controlType);
                        break;
                }
            }
        }

        applyCalculatedExpressionToBinding($control: JQuery, binding, expression: string) {
            //update model (if control is bound)
            if (Common.stringIsNullOrEmpty(binding)) return;

            const bindingPath = Common.getFullBindingPathOfControl($control, binding);
            const bindingDataType = $control.attr("data-binding-type");

            switch (bindingDataType) {
                case "DateTime":
                    var tmpScopeVar = "__tmp" + bindingPath.replace(/[\[\]\.]/gi, "_");     // Hack here.                    
                    Common.getScope()[tmpScopeVar] = new Date(expression);                  // First assign date to a scope var
                    Common.getScope().$eval(`${bindingPath} = ${tmpScopeVar};`);            // then assign to binding path      
                    break;

                case "int":
                case "long":
                case "float":
                case "double":
                case "decimal":
                case "bool":
                    Common.getScope().$eval(`${bindingPath} = ${expression};`); // as is   
                    break;

                case "string":
                case "byte":
                case "Guid":
                case "char":
                    Common.getScope().$eval(`${bindingPath} = "${expression}";`); // as string
                    break;

                default:
                    console.error("Could not apply calculated expression to binding of datatype: " + bindingDataType);
                    break;
            }
        }
    }
}