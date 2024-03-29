var Joove;
(function (Joove) {
    var DataValidationMessageType;
    (function (DataValidationMessageType) {
        DataValidationMessageType[DataValidationMessageType["INFO"] = 1] = "INFO";
        DataValidationMessageType[DataValidationMessageType["WARN"] = 2] = "WARN";
        DataValidationMessageType[DataValidationMessageType["ERROR"] = 3] = "ERROR";
        DataValidationMessageType[DataValidationMessageType["SUCCESS"] = 4] = "SUCCESS";
        DataValidationMessageType[DataValidationMessageType["CUSTOM"] = 5] = "CUSTOM";
    })(DataValidationMessageType = Joove.DataValidationMessageType || (Joove.DataValidationMessageType = {}));
    Joove.RuleTypes = {
        ConditionalFormatting: "cf",
        DataValidation: "dv",
        CalculatedExpression: "ce"
    };
    var EvaluationTimes;
    (function (EvaluationTimes) {
        EvaluationTimes[EvaluationTimes["OnLoad"] = 1] = "OnLoad";
        EvaluationTimes[EvaluationTimes["OnChange"] = 2] = "OnChange";
        EvaluationTimes[EvaluationTimes["OnSubmit"] = 3] = "OnSubmit";
    })(EvaluationTimes = Joove.EvaluationTimes || (Joove.EvaluationTimes = {}));
    var DataSetRuleEvaluationResult = /** @class */ (function () {
        function DataSetRuleEvaluationResult() {
        }
        Object.defineProperty(DataSetRuleEvaluationResult.prototype, "EvaluationScope", {
            get: function () {
                var that = this;
                var status = new Promise(function (resolve, reject) {
                    resolve(that.Status);
                });
                var expression = new Promise(function (resolve, reject) {
                    resolve(that.Expression);
                });
                return {
                    Status: status,
                    Expression: expression
                };
            },
            enumerable: false,
            configurable: true
        });
        return DataSetRuleEvaluationResult;
    }());
    Joove.DataSetRuleEvaluationResult = DataSetRuleEvaluationResult;
    var JbRule = /** @class */ (function () {
        function JbRule(options) {
            this.evaluatedAtServer = false;
            this.serverSideEvaluations = null;
            this.runsAtServer = false;
            this.isDataSetRule = false;
            this.init(options);
        }
        JbRule.prototype.init = function (options) {
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
            if (this.type === Joove.RuleTypes.ConditionalFormatting) {
                this.runsAtServer = options.condition == null;
            }
            else if (this.type === Joove.RuleTypes.CalculatedExpression) {
                this.runsAtServer = options.condition == null;
            }
            else if (this.type === Joove.RuleTypes.DataValidation) {
                this.runsAtServer = options.condition == null;
            }
        };
        JbRule.prototype.assureIsPromise = function (expression) {
            var errorMessage = new Joove.FriendlyMessage({
                Title: "Rule evaluation",
                OriginalExceptionMessage: ""
            });
            return function (parents) {
                return new Promise(function (resolve, reject) {
                    try {
                        resolve(expression(parents));
                    }
                    catch (e) {
                        if (window._context.mode !== "Production") {
                            Joove.FriendlyMessageGenerator.showPopUp(errorMessage);
                        }
                        console.error(e);
                        reject("");
                    }
                });
            };
        };
        JbRule.prototype.getRuleAttribute = function () {
            return this.type + "-" + this.name;
        };
        JbRule.prototype.$affectedControls = function () {
            return $("[" + this.getRuleAttribute() + "]");
        };
        /**
         * This method is called when Rule Engine requests the evaluation of this Rule instance.
         * It searches in the viewDTO Rule Arrays to find the Rule evaluation by name.
         *
         * When found, the evaluation is marked so that next time the Rule is reevaluated,
         * since this will set this.serverSideEvaluations property to null.
         */
        JbRule.prototype.findServerSideEvaluations = function () {
            this.serverSideEvaluations = null;
            var rulesArray = null;
            if (this.type === Joove.RuleTypes.ConditionalFormatting) {
                rulesArray = window.viewDTO.ConditionalFormattings;
            }
            else if (this.type === Joove.RuleTypes.CalculatedExpression) {
                rulesArray = window.viewDTO.CalculatedExpressions;
            }
            else if (this.type === Joove.RuleTypes.DataValidation) {
                rulesArray = window.viewDTO.DataValidations;
            }
            if (rulesArray == null)
                return;
            for (var i = 0; i < rulesArray.length; i++) {
                var current = rulesArray[i];
                if (current.Name === this.name && current.evaluated !== true) {
                    current.evaluated = true; // mark as evaluated
                    this.serverSideEvaluations = current.Evaluations;
                    break;
                }
            }
        };
        JbRule.createRulesForPartialControls = function (controls, createRule) {
            var rules = [];
            for (var i = 0; i < controls.length; i++) {
                var rule = createRule(controls[i]);
                rules = rules.concat(rule);
            }
            return rules;
        };
        return JbRule;
    }());
    Joove.JbRule = JbRule;
    var RuleEngine = /** @class */ (function () {
        function RuleEngine() {
            this.onLoadHasRun = false;
            this.conditionalFormattings = [];
            this.dataValidations = [];
            this.calculatedExpressions = [];
            this.serverRules = [];
            this.dataSetRules = [];
            this.cfHelper = new Joove.ConditionalFormattingsHelper();
            this.latestServerRulesResults = null;
            this.customRegisteredFunctions = [];
            this.isRunning = false;
        }
        RuleEngine.prototype.addServerRules = function (rules) {
            for (var i = 0; i < rules.length; i++) {
                if (rules[i].isDataSetRule === false &&
                    (rules[i].runsAtServer || rules[i].type === Joove.RuleTypes.DataValidation)) {
                    this.serverRules.push(rules[i]);
                }
            }
        };
        RuleEngine.prototype.addDataSetRules = function (rules) {
            for (var i = 0; i < rules.length; i++) {
                if (rules[i].isDataSetRule) {
                    this.dataSetRules.push(rules[i]);
                }
            }
        };
        RuleEngine.prototype.addConditionalFormattings = function (rules) {
            this.addServerRules(rules);
            this.addDataSetRules(rules);
            var concated = this.conditionalFormattings.concat(rules);
            this.conditionalFormattings = concated;
        };
        RuleEngine.prototype.addDataValidations = function (rules) {
            this.addServerRules(rules);
            this.addDataSetRules(rules);
            var concated = this.dataValidations.concat(rules);
            this.dataValidations = concated;
        };
        RuleEngine.prototype.addCalculatedExpressions = function (rules) {
            this.addServerRules(rules);
            this.addDataSetRules(rules);
            var concated = this.calculatedExpressions.concat(rules);
            this.calculatedExpressions = concated;
        };
        RuleEngine.prototype.prepareRuleInfoForServerSideExecution = function (rules) {
            var ruleInfo = [];
            var controlsOfEachRuleCombination = {};
            for (var i = 0; i < rules.length; i++) {
                var rule = rules[i];
                var controls = rule.$affectedControls();
                if (controls.length === 0 && rule.getContext != null)
                    continue;
                var key = rule.name + rule.type;
                var info = {
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
                }
                else { // Rule is inside context 
                    var contextIndexesCache = [];
                    for (var j = 0; j < controls.length; j++) {
                        this.prepareRuleInfoForControlInsideContext(controls.eq(j), info, controlsOfEachRuleCombination, contextIndexesCache, key);
                    }
                }
            }
            return { info: ruleInfo, controls: controlsOfEachRuleCombination };
        };
        RuleEngine.prototype.prepareRuleInfoForPartialViews = function (controls, info, controlsOfEachRuleCombination, rule, key) {
            var partialViewContextIndexesCache = [];
            for (var j = 0; j < controls.length; j++) {
                var $el = controls.eq(j);
                var partialViewControlName = $el.closest("[jb-type='PartialView']").attr("jb-id");
                var newKey = partialViewControlName + key;
                if (info.PartialViewControls.indexOf(partialViewControlName) === -1) {
                    info.PartialViewControls.push(partialViewControlName);
                }
                if (rule.getContext == null) {
                    if (controlsOfEachRuleCombination[newKey] == null) {
                        controlsOfEachRuleCombination[newKey] = [];
                    }
                    controlsOfEachRuleCombination[newKey].push($el);
                }
                else {
                    this.prepareRuleInfoForControlInsideContext($el, info, controlsOfEachRuleCombination, partialViewContextIndexesCache, newKey);
                }
            }
        };
        RuleEngine.prototype.prepareRuleInfoForControlInsideContext = function (control, info, controlsOfEachRuleCombination, cache, currentKey) {
            var indexInfo = Joove.Common.getIndexesOfControl(control);
            var indexes = indexInfo.indexes;
            var newKey = currentKey + indexInfo.key;
            if (controlsOfEachRuleCombination[newKey] == null) {
                controlsOfEachRuleCombination[newKey] = [];
            }
            if (cache.indexOf(indexInfo.key) === -1) {
                info.Indexes.push(indexes);
                cache.push(indexInfo.key);
            }
            controlsOfEachRuleCombination[newKey].push(control);
        };
        RuleEngine.prototype.getRule = function (name, type, rules) {
            if (rules == null) {
                var collection = this.conditionalFormattings;
                if (type === Joove.RuleTypes.DataValidation) {
                    collection = this.dataValidations;
                }
                else if (type === Joove.RuleTypes.CalculatedExpression) {
                    collection = this.calculatedExpressions;
                }
                rules = collection;
            }
            for (var i = 0; i < rules.length; i++) {
                var rule = rules[i];
                if (rule.name === name && rule.type === type) {
                    return rule;
                }
            }
            return null;
        };
        RuleEngine.prototype.getServerRulesInfo = function (evalTime) {
            var toEvaluate = [];
            for (var i = 0; i < this.serverRules.length; i++) {
                var rule = this.serverRules[i];
                if (this.ruleMustBeEvaluatedAtEvaluationTime(rule, evalTime) === false)
                    continue;
                toEvaluate.push(rule);
            }
            return this.prepareRuleInfoForServerSideExecution(toEvaluate);
        };
        RuleEngine.prototype.ruleMustBeEvaluatedAtEvaluationTime = function (rule, evalTime) {
            if (evalTime == null)
                return false;
            if (evalTime !== EvaluationTimes.OnSubmit) {
                return rule.evaluationTimes.indexOf(evalTime) > -1;
            }
            else {
                // on submit: Evaluate OnChange & OnSubmit at the same time
                return rule.evaluationTimes.indexOf(evalTime) > -1 ||
                    rule.evaluationTimes.indexOf(EvaluationTimes.OnChange) > -1;
            }
        };
        RuleEngine.prototype.evaluatesServerRules = function (rulesToEvaluate, evalTime, groups, cb) {
            if (rulesToEvaluate.length === 0) {
                if (cb)
                    cb();
                return;
            }
            var rulesInfo = this.getServerRulesInfo(evalTime);
            if (rulesInfo.info.length === 0) {
                if (cb)
                    cb();
                return;
            }
            var model = Joove.Common.getModel();
            var data = { 'model': model, 'rules': rulesInfo.info, 'group': null };
            Joove.Core.executeControllerAction(window._context.currentController, "GetRulesEvaluation", "POST", [evalTime], data, null, cb, null, rulesInfo);
        };
        RuleEngine.prototype.updateRulesOfControl = function ($element) {
            if (this.latestServerRulesResults == null) {
                return;
            }
            this.updateSpecificRulesOfControl($element, this.latestServerRulesResults.ConditionalFormattings || [], Joove.RuleTypes.ConditionalFormatting);
            this.updateSpecificRulesOfControl($element, this.latestServerRulesResults.CalculatedExpressions || [], Joove.RuleTypes.CalculatedExpression);
        };
        RuleEngine.prototype.updateSpecificRulesOfControl = function ($element, ruleResults, type) {
            var controlIndexes = Joove.Common.getIndexesOfControl($element).key;
            for (var i = 0; i < ruleResults.length; i++) {
                var rule = this.getRule(ruleResults[i].Name, type);
                var attr = $element.attr(rule.getRuleAttribute());
                if (Joove.Common.stringIsNullOrEmpty(attr))
                    continue;
                var evalutationForElementIndex = ruleResults[i].Evaluations[0];
                //if more than one evaluation(= context) find the correct evaluation for this control
                if (ruleResults[i].Evaluations.length > 1) {
                    evalutationForElementIndex = null;
                    for (var j = 0; j < ruleResults[i].Evaluations.length; j++) {
                        var evaluation = ruleResults[i].Evaluations[j];
                        var indexes = Joove.Common.serializeIndexes(evaluation.Indexes);
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
        };
        RuleEngine.prototype.applyServerRulesResult = function (results, rulesInfo) {
            this.latestServerRulesResults = results;
            this.applyServerRules(results.DataValidations || [], Joove.RuleTypes.DataValidation, rulesInfo).then(function (value) {
                Joove.Validation.UiHelper.refreshPanel();
                return value;
            });
        };
        RuleEngine.prototype.applyServerRules = function (rules, type, rulesInfo) {
            var rulesPromises = new Array();
            for (var i = 0; i < rules.length; i++) {
                var result = rules[i];
                var key = (result.PartialControl || "") + result.Name + type;
                var rule = this.getRule(result.Name, type);
                for (var j = 0; j < result.Evaluations.length; j++) {
                    var evaluation = result.Evaluations[j];
                    var currentKey = key;
                    if (evaluation.Indexes != null) {
                        var serializedIndexes = Joove.Common.serializeIndexes(evaluation.Indexes);
                        if (serializedIndexes === "_") {
                            serializedIndexes = "";
                        }
                        currentKey = key + serializedIndexes;
                    }
                    rulesPromises.push(this.applyRule(rule, evaluation, $(rulesInfo.controls[currentKey]), evaluation.Indexes));
                }
            }
            return Promise.all(rulesPromises)
                .then(function (values) {
                return values.filter(function (value) { return value; }).length <= 0;
            });
        };
        RuleEngine.prototype.applyDataSetRulesResult = function (results) {
            if (results == null || results.length === 0)
                return;
            for (var i = 0; i < results.length; i++) {
                var result = results[i];
                var rule = this.getRule(result.RuleName, Joove.RuleTypes.ConditionalFormatting, this.dataSetRules);
                if (rule == null || rule.contextControlName == null || rule.contextControlName.trim() === "")
                    continue;
                var key = result.Key;
                var contextControlSelector = "[jb-id='" + rule.contextControlName + "']";
                var rowSelector = "[data-key='" + result.Key + "']";
                var controlsSelector = "[" + Joove.RuleTypes.ConditionalFormatting + "-" + rule.name + "]";
                var $controls = $(contextControlSelector + " " + rowSelector + " " + controlsSelector);
                this.applyRule(rule, result.EvaluationScope, $controls, []);
            }
        };
        // this is the entry point for externals that update all rules
        RuleEngine.prototype.update = function (evaluationTime, groups, done) {
            var _this = this;
            if (this.onLoadHasRun == false && evaluationTime == EvaluationTimes.OnChange) {
                return Promise.resolve();
            }
            if (evaluationTime == EvaluationTimes.OnChange) {
                if (this.isRunning == false) {
                    return this.actualUpdate(evaluationTime, groups, done);
                }
                else {
                    clearTimeout(RuleEngine.lastChangeRequest);
                    //todo: here promise should be returned
                    RuleEngine.lastChangeRequest = setTimeout(function () {
                        _this.update(evaluationTime, groups, done);
                    }, 250);
                }
                return Promise.resolve();
            }
            return this.actualUpdate(evaluationTime, groups, done);
        };
        RuleEngine.prototype.actualUpdate = function (evaluationTime, groups, done) {
            var _this = this;
            this.isRunning = true;
            var finish = function () {
                _this.isRunning = false;
                $(".hidden-before-rule-apply").removeClass("hidden-before-rule-apply");
                done && done();
                Joove.Core.applyScope();
                if (evaluationTime == EvaluationTimes.OnLoad) {
                    _this.onLoadHasRun = true;
                }
                //Execute any custom registered functionalities
                for (var i = 0; i < _this.customRegisteredFunctions.length; i++) {
                    _this.customRegisteredFunctions[i].func && _this.customRegisteredFunctions[i].func();
                }
            };
            return this.evaluateRules(evaluationTime, groups)
                .then(function () {
                finish();
            })
                .catch(function (e) {
                _this.isRunning = false;
                Joove.Logger.error("Rule engine error", e);
            });
            ;
        };
        RuleEngine.prototype.addCustomFunction = function (name, func) {
            var existingEntry = $.grep(this.customRegisteredFunctions, function (entry) { return entry.name == name; })[0];
            if (existingEntry != undefined) {
                console.log("Custom function: " + name + " already exists! Overiding...");
                existingEntry.func = func;
            }
            else {
                console.log("Adding entry " + name);
                this.customRegisteredFunctions.push({ "name": name, "func": func });
            }
        };
        RuleEngine.prototype.removeCustomFunction = function (name) {
            var existingEntry = $.grep(this.customRegisteredFunctions, function (entry) { return entry.name == name; })[0];
            if (existingEntry == undefined) {
                console.log("Entry " + name + " doesn't exist. Exiting ...");
                return;
            }
            else {
                console.log("Removing entry " + name);
                this.customRegisteredFunctions = $.grep(this.customRegisteredFunctions, function (entry) { return entry.name != name; });
            }
        };
        RuleEngine.prototype.runClientDataValidations = function (groups) {
            this._lastOnSubmitDatavalidation = new Date().getTime();
            return this.evaluateDataValidations(EvaluationTimes.OnSubmit, groups);
        };
        RuleEngine.prototype.updateDataValidationRelatedConditionals = function () {
            var _this = this;
            var rules = this.conditionalFormattings.filter(function (x) { return x.isRelatedToDataValidation === true; });
            if (rules == null || rules.length == 0)
                return;
            rules.map(function (x) { return _this.updateSingleRule(x.name, x.type, EvaluationTimes.OnChange, [x.group]); });
        };
        // this is the entry point for externals that update single rule
        RuleEngine.prototype.updateSingleRule = function (name, type, evaluationTime, groups) {
            //console.log(`Updating rule ${name} for (1: load, 2: change, 3: submit) ->${evaluationTime}`);
            var rulesArray;
            if (type === Joove.RuleTypes.ConditionalFormatting) {
                rulesArray = this.conditionalFormattings;
            }
            else if (type === Joove.RuleTypes.DataValidation) {
                rulesArray = this.dataValidations;
            }
            else if (type === Joove.RuleTypes.CalculatedExpression) {
                rulesArray = this.calculatedExpressions;
            }
            var matches = rulesArray.filter(function (x) { return x.name == name; });
            var rule = matches == null || matches.length == 0 ? null : matches[0];
            if (rule == null) {
                console.error("Could not find " + type + " rule: " + name);
                return;
            }
            if (rule.evaluatedAtServer === true) {
                var ruleRequestData = {
                    name: rule.name,
                    type: rule.type
                };
                this.evaluatesServerRules([ruleRequestData], evaluationTime, groups);
            }
            else {
                this.evaluateRule(rule, groups, EvaluationTimes.OnChange);
            }
        };
        RuleEngine.prototype.evaluateConditionalFormattings = function (evaluationTime) {
            var rulesPromises = new Array();
            for (var i = 0; i < this.conditionalFormattings.length; i++) {
                var rule = this.conditionalFormattings[i];
                if (this.ruleMustBeEvaluatedAtEvaluationTime(rule, evaluationTime) === false)
                    continue;
                rulesPromises.push(this.evaluateRule(rule, null, evaluationTime));
            }
            return Promise.all(rulesPromises)
                .then(function () {
                return true;
            });
        };
        RuleEngine.prototype.evaluateCalculatedExpressions = function (evaluationTime) {
            var rulesPromises = new Array();
            for (var i = 0; i < this.calculatedExpressions.length; i++) {
                var rule = this.calculatedExpressions[i];
                if (this.ruleMustBeEvaluatedAtEvaluationTime(rule, evaluationTime) === false)
                    continue;
                rulesPromises.push(this.evaluateRule(rule, null, evaluationTime));
            }
            return Promise.all(rulesPromises)
                .then(function () {
                return true;
            });
        };
        /**
         *
         * @return true if all datavalidations for the group are ok
         */
        RuleEngine.prototype.evaluateDataValidations = function (evaluationTime, groups) {
            var rules = new Array();
            if (evaluationTime == EvaluationTimes.OnChange) {
                var ranBefore = new Date().getTime() - this._lastOnSubmitDatavalidation;
                if (ranBefore < 500) {
                    //This is to prevent running datavalidations running after a submit changes event
                    //and overriding the datavalidation outcome
                    return new Promise(function (resolve, reject) {
                        resolve();
                    });
                }
            }
            if (groups == null || groups.length == 0) {
                groups = Joove.Validation.UiHelper.lastEvaluatedValidationGroups;
            }
            else {
                Joove.Validation.UiHelper.lastEvaluatedValidationGroups = groups;
            }
            var evaluateAllGroups = groups.indexOf(Joove.Validation.Constants.ALL_GROUPS) > -1;
            Joove.Validation.Bindings.removeValidationsThatDontBelongToGroups(groups);
            var _loop_1 = function (i) {
                var rule = this_1.dataValidations[i];
                if (this_1.ruleMustBeEvaluatedAtEvaluationTime(rule, evaluationTime) === false)
                    return "continue";
                if (evaluateAllGroups === false && groups.filter(function (x) { return x == rule.group; }).length == 0)
                    return "continue";
                var evaluation = this_1.evaluateRule(rule, groups, evaluationTime);
                rules.push(evaluation);
            };
            var this_1 = this;
            for (var i = 0; i < this.dataValidations.length; i++) {
                _loop_1(i);
            }
            return Promise.all(rules)
                .then(function (values) {
                return values.filter(function (value) { return value; }).length <= 0;
            }).then(function (value) {
                Joove.Validation.UiHelper.refreshPanel();
                return value;
            });
        };
        RuleEngine.prototype.evaluateRules = function (evaluationTime, groups) {
            var _this = this;
            return this.evaluateCalculatedExpressions(evaluationTime)
                .then(function () {
                _this.evaluateConditionalFormattings(evaluationTime);
            })
                .then(function () {
                _this.evaluateDataValidations(evaluationTime, groups);
            });
        };
        /**
         *
         * @return true if all datavalidations for the group are ok
         */
        RuleEngine.prototype.evaluateRule = function (rule, groups, evaluationTime) {
            var _this = this;
            if (rule.runsAtServer) {
                return new Promise(function (resolve) {
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
            var $controls = rule.$affectedControls();
            var evaluationCache = new Array();
            var rules = new Array();
            if (rule.getContext == null) {
                return this.applyRule(rule, {
                    Status: rule.condition(null),
                    Expression: rule.expression == null ? null : rule.expression(null)
                }, $controls, []);
            }
            else {
                var context = rule.getContext();
                if (context != undefined &&
                    context.length === 1 &&
                    context[0] != undefined &&
                    context[0].length === 0) {
                    //This block is to avoid evaluating rules on a contect with zero items
                    rules.push(new Promise(function (resolve) {
                        resolve(false);
                    }));
                }
                else {
                    var _evaluate = function (indexesInfo, $ctrl) {
                        var parents = _this.getRuleParents(rule, indexesInfo.indexes);
                        if (parents == null)
                            return;
                        var evaluation = evaluationCache[indexesInfo.key];
                        if (evaluation == null) {
                            evaluation = evaluationCache[indexesInfo.key] = {
                                Status: rule.condition(parents),
                                Expression: rule.expression == null
                                    ? null
                                    : rule.expression(parents)
                            };
                        }
                        var isRuleOk = _this.applyRule(rule, evaluation, $ctrl, indexesInfo.indexes);
                        rules.push(isRuleOk);
                    };
                    if (rule.type === Joove.RuleTypes.DataValidation) {
                        Joove.Validation.Bindings.resetValidationOccurencesInSummary(rule);
                        rule.evaluateInContext(function (indexes) {
                            var indexKey = indexes.join("_") + "_";
                            var indexesInfo = {
                                key: indexKey,
                                indexes: indexes
                            };
                            var $ctrl = $controls.filter(function (i, el) { return Joove.Common.getIndexKeyOfControl($(el)) == indexKey; }).eq(0);
                            _evaluate(indexesInfo, $ctrl);
                        });
                        Joove.Validation.Bindings.removeFromSummaryWhenNotTriggered(rule);
                        Joove.Validation.Bindings.removeFromMasterSummaryWhenNotTriggered(rule);
                    }
                    else {
                        for (var i = 0; i < $controls.length; i++) {
                            var indexInfo = Joove.Common.getIndexesOfControl($controls.eq(i));
                            _evaluate(indexInfo, $controls.eq(i));
                        }
                    }
                }
            }
            return Promise.all(rules).then(function (values) {
                return values.filter(function (value) { return !value; }).length <= 0;
            });
        };
        RuleEngine.prototype.getRuleParents = function (rule, indexes) {
            var parents = [];
            var context = rule.getContext(indexes);
            if (context == null)
                return null;
            for (var j = 0; j < context.length; j++) {
                if (context[j] == null) {
                    parents.push(null);
                    break;
                }
                parents.push(context[j][indexes[j]]);
            }
            var containsNull = parents.filter(function (a) { return a == null; }).length > 0;
            return containsNull ? null : parents;
        };
        // returns true if all datavalidations for the group are ok
        RuleEngine.prototype.applyRule = function (rule, evaluation, $controls, indexes) {
            /*evaluation:
            bool Status;
            string Expression;
            int[] Indexes;
            */
            var _this = this;
            // Convert 'flat' evaluations received from backend to promise based
            if (evaluation.Status instanceof Promise === false) {
                var clonedStatus = JSON.parse(JSON.stringify(evaluation));
                evaluation.Status = new Promise(function (resolve) {
                    resolve(clonedStatus.Status);
                });
                evaluation.Expression = new Promise(function (resolve) {
                    resolve(clonedStatus.Expression);
                });
            }
            return evaluation.Status.then(function (status) {
                if (status === false && rule.type === Joove.RuleTypes.CalculatedExpression) {
                    return status;
                }
                //Save the evaluation result
                if (rule.type === Joove.RuleTypes.DataValidation) {
                    rule.evaluatedCondition = status;
                }
                //...but do not return true for Warning and Info data validations
                if (rule.type === Joove.RuleTypes.DataValidation && (rule.dataValidationMessageType == DataValidationMessageType.WARN || rule.dataValidationMessageType == DataValidationMessageType.INFO)) {
                    return evaluation.Expression.then(function () {
                        _this.applyDataValidation(rule, evaluation, indexes);
                        return false;
                    });
                }
                if (rule.type === Joove.RuleTypes.ConditionalFormatting) {
                    _this.applyCondionalFormatting(rule, evaluation, $controls);
                }
                else if (rule.type === Joove.RuleTypes.DataValidation) {
                    return evaluation.Expression.then(function () {
                        _this.applyDataValidation(rule, evaluation, indexes);
                        return status;
                    });
                }
                else if (rule.type === Joove.RuleTypes.CalculatedExpression) {
                    return evaluation.Expression.then(function () {
                        _this.applyCalculatedExpression(rule, evaluation, $controls);
                        return status;
                    });
                }
                return status;
            });
        };
        RuleEngine.prototype.applyCondionalFormatting = function (rule, evaluation, $controls) {
            $controls = $controls || rule.$affectedControls();
            var that = this;
            evaluation.Status.then(function (status) {
                for (var i = 0; i < $controls.length; i++) {
                    var $control = $($controls[i]);
                    var attributeValue = $control.attr(rule.getRuleAttribute());
                    var actions = JSON.parse(Joove.Common.replaceAll(attributeValue, "`", "\""));
                    var toDoList = status ? actions.whenTrue : actions.whenFalse;
                    that.applyConditionalFormattingOnControl($control, status, toDoList);
                }
            });
        };
        RuleEngine.prototype.applyConditionalFormattingOnControl = function ($control, status, toDoList) {
            if (toDoList == null)
                return;
            for (var j = 0; j < toDoList.length; j++) {
                var info = this.parseConditionalFormattingToDoString(toDoList[j]);
                this.cfHelper.applyFormatting($control, info.type, info.extraData, status);
            }
        };
        RuleEngine.prototype.parseConditionalFormattingToDoString = function (toDoString) {
            var toDoParts = toDoString.split("|");
            var type = toDoParts[0];
            var extraData = toDoParts.length > 1 ? toDoParts[1] : null;
            return { type: type, extraData: extraData };
        };
        RuleEngine.prototype.applyDataValidation = function (rule, evaluation, indexes) {
            var that = this;
            evaluation.Status.then(function (status) {
                evaluation.Expression.then(function (message) {
                    Joove.Validation.Bindings.refresh(rule, message, status, indexes);
                    return status;
                });
            });
        };
        RuleEngine.prototype.applyCalculatedExpression = function (rule, evaluation, $controls) {
            var _this = this;
            var expression = evaluation.Expression;
            if (expression == null)
                return; // null means leave unchanged...
            expression.then(function (value) {
                for (var i = 0; i < $controls.length; i++) {
                    _this.applyCalculatedExpressionOnControl($($controls[i]), value, rule.runsAtServer === false);
                }
            });
        };
        RuleEngine.prototype.applyCalculatedExpressionOnControl = function ($control, expression, evaluatedOnClient) {
            if (expression == null || expression === NULL)
                return;
            var controlType = $control.attr("jb-type");
            var binding = null;
            var boundToDataSet = $control.attr("bound-to-dataset");
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
            if (evaluatedOnClient && Joove.Common.stringIsNullOrEmpty(binding) === false && boundToDataSet !== "true") {
                this.applyCalculatedExpressionToBinding($control, binding, expression);
            }
            else {
                var hasFormatting = $control.hasClass(Joove.ValueFormat.MarkClass);
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
                        Joove.Core.elementData($control, "old-value", expression);
                        break;
                    default:
                        console.error("Calculated Expression not implemented for control: " + controlType);
                        break;
                }
            }
        };
        RuleEngine.prototype.applyCalculatedExpressionToBinding = function ($control, binding, expression) {
            //update model (if control is bound)
            if (Joove.Common.stringIsNullOrEmpty(binding))
                return;
            var bindingPath = Joove.Common.getFullBindingPathOfControl($control, binding);
            var bindingDataType = $control.attr("data-binding-type");
            switch (bindingDataType) {
                case "DateTime":
                    var tmpScopeVar = "__tmp" + bindingPath.replace(/[\[\]\.]/gi, "_"); // Hack here.                    
                    Joove.Common.getScope()[tmpScopeVar] = new Date(expression); // First assign date to a scope var
                    Joove.Common.getScope().$eval(bindingPath + " = " + tmpScopeVar + ";"); // then assign to binding path      
                    break;
                case "int":
                case "long":
                case "float":
                case "double":
                case "decimal":
                case "bool":
                    Joove.Common.getScope().$eval(bindingPath + " = " + expression + ";"); // as is   
                    break;
                case "string":
                case "byte":
                case "Guid":
                case "char":
                    Joove.Common.getScope().$eval(bindingPath + " = \"" + expression + "\";"); // as string
                    break;
                default:
                    console.error("Could not apply calculated expression to binding of datatype: " + bindingDataType);
                    break;
            }
        };
        return RuleEngine;
    }());
    Joove.RuleEngine = RuleEngine;
})(Joove || (Joove = {}));
