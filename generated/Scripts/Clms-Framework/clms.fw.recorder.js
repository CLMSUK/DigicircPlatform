var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Joove;
(function (Joove) {
    var ActionType;
    (function (ActionType) {
        ActionType[ActionType["Click"] = 0] = "Click";
        ActionType[ActionType["Change"] = 1] = "Change";
        ActionType[ActionType["Stop"] = 2] = "Stop";
    })(ActionType = Joove.ActionType || (Joove.ActionType = {}));
    var StateType;
    (function (StateType) {
        StateType[StateType["UnChanged"] = 0] = "UnChanged";
        StateType[StateType["Changed"] = 1] = "Changed";
    })(StateType = Joove.StateType || (Joove.StateType = {}));
    var AssertError = /** @class */ (function (_super) {
        __extends(AssertError, _super);
        function AssertError() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return AssertError;
    }(Error));
    Joove.AssertError = AssertError;
    var RecorderUtilities = /** @class */ (function () {
        function RecorderUtilities() {
        }
        RecorderUtilities.sanitizeState = function (state) {
            var keys = Object.keys(state);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (key.indexOf("_") === 0 || key === "Domain") {
                    delete state[key];
                    continue;
                }
                if (Array.isArray(state[key])) {
                    state[key] = state[key].map(function (s) { return RecorderUtilities.sanitizeState(s); });
                }
                if (state[key] instanceof Object) {
                    state[key] = RecorderUtilities.sanitizeState(state[key]);
                }
            }
            try {
                return JSON.parse(JSON.stringify(state));
            }
            catch (e) {
                debugger;
                console.log(state);
            }
        };
        RecorderUtilities.getControlSelectorName = function (el) {
            var selector = "";
            var controlName = el.attr("jb-id");
            if (controlName != null) {
                selector = "[jb-id=\"" + controlName + "\"]";
            }
            else {
                var classes = el.attr('class').split(/\s+/).filter(function (cls) {
                    return cls.indexOf("ng-scope") != -1;
                });
                if (classes.lenght > 0) {
                    selector = classes.join(".");
                }
                else {
                    selector = el.prop("tagName").toLowerCase();
                }
            }
            return "" + selector;
        };
        RecorderUtilities.getControl = function (action) {
            return $($(action.controlName).get(action.index));
        };
        RecorderUtilities.fullPath = function (el) {
            var names = [];
            while (el.parent()) {
                if (el.attr("jb-type") === "Body") {
                    names.unshift("[jb-id=\"" + el.attr("jb-id") + "\"]");
                    break;
                }
                else {
                    names.unshift(RecorderUtilities.getControlSelectorName(el));
                }
                el = el.parent();
            }
            return names.join(" > ");
        };
        RecorderUtilities.getModelSnapshot = function (eventType) {
            return RecorderUtilities.sanitizeState(Joove.Common.cloneObject(window["$form"].model));
        };
        RecorderUtilities.getHtmlSnapshot = function () {
            var visitor = new System.Xml.HtmlVisitor();
            return visitor.toObject(document.body, function (parent, current) {
                var obj = {
                    childs: []
                };
                var classes = current.className;
                if (!Joove.Common.stringIsNullOrEmpty(classes)) {
                    obj.classes = classes;
                }
                var style = current.getAttribute("style");
                if (style != null) {
                    obj.style = style;
                }
                if (current.children.length === 0) {
                    var text = current.textContent;
                    if (!Joove.Common.stringIsNullOrEmpty(text)) {
                        obj.text = text;
                    }
                }
                if (parent != null) {
                    if (current.id !== "recorder") {
                        parent.childs.push(obj);
                    }
                }
                return obj;
            }, null);
        };
        return RecorderUtilities;
    }());
    Joove.RecorderUtilities = RecorderUtilities;
    var Recording = /** @class */ (function () {
        function Recording(steps) {
            if (steps === void 0) { steps = []; }
            this.steps = steps;
            this.stepId = 1;
            this.currentState = steps[0];
            this.delay = 1000;
            this.fns = [];
        }
        Recording.prototype.play = function () {
            var _this = this;
            var start = new Promise(function (resolve, reject) { resolve(true); });
            for (var i = 0; i < this.steps.length; i += 2) {
                start = start
                    .then(function () { return _this.notify(); })
                    .then(function () { return _this.step(); })
                    .then(function () { return _this.forward(); })
                    .then(function () { return _this.sleep(); })
                    .then(function () { return _this.assertCurrentState(); });
            }
            return start;
        };
        Recording.prototype.sleep = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                setTimeout(function () { return resolve(); }, _this.delay);
            });
        };
        Recording.prototype.step = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var currentStep = _this.getCurrentStep();
                if (currentStep == null) {
                    resolve(false);
                }
                else {
                    var targetElement = $($(currentStep.controlName).get(currentStep.index));
                    switch (currentStep.type) {
                        case ActionType.Click:
                            targetElement.click();
                            break;
                        case ActionType.Change:
                            targetElement.val(Joove.Common.autoParse(currentStep.newValue));
                            targetElement.change();
                            targetElement.blur();
                            targetElement.focus();
                            break;
                        default:
                            break;
                    }
                    _this.loadCurrentState();
                    resolve(true);
                }
            });
        };
        Recording.prototype.forward = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (!_this.finished()) {
                    var nextStep = _this.getNextStep();
                    resolve();
                }
                else {
                    resolve();
                }
            });
        };
        Recording.prototype.loadCurrentState = function () {
            var nextState = this.steps[this.stepId + 1];
            if (nextState.$type === StateType.Changed) {
                delete nextState.$type;
                this.currentState = nextState;
            }
        };
        Recording.prototype.finished = function () {
            return this.stepId > this.steps.length;
        };
        Recording.prototype.assertCurrentState = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var model = {
                    view: RecorderUtilities.getHtmlSnapshot(),
                    model: RecorderUtilities.sanitizeState(Joove.Common.cloneObject(window["$form"].model))
                };
                if (!Joove.Comparator.DeepEqual(_this.getCurrentState(), model)) {
                    reject(new AssertError("Model state is different"));
                }
                else {
                    resolve(true);
                }
            });
        };
        Recording.prototype.isAction = function (step) {
            if (step == null)
                return false;
            return step.type === ActionType.Click;
        };
        Recording.prototype.getCurrentStep = function () {
            return this.steps[this.stepId];
        };
        Recording.prototype.getCurrentState = function () {
            if (this.currentState != null) {
                delete this.currentState.$type;
            }
            return this.currentState;
        };
        Recording.prototype.getNextStep = function () {
            this.stepId = this.stepId + 2;
            return this.steps[this.stepId];
        };
        Recording.prototype.register = function (f) {
            this.fns.push(f);
        };
        Recording.prototype.notify = function () {
            var _this = this;
            this.fns.forEach(function (fn) { return fn(_this.stepId); });
        };
        Recording.prototype.numSteps = function () {
            return Math.floor(this.steps.length / 2);
        };
        return Recording;
    }());
    Joove.Recording = Recording;
    var Recorder = /** @class */ (function () {
        function Recorder() {
            var _this = this;
            this.currentState = null;
            this.beforeOnChangeState = null;
            this.states = [];
            var self = this;
            this.isRecording = false;
            setTimeout(function () { _this.initListenner(); }, 1000);
        }
        Recorder.prototype.listen = function (recordEvent) {
            if (!this.isRecording)
                return;
            this.saveModelSnapshot(true);
            if (recordEvent != null) {
                this.states.push(this.parseRecordEvent(recordEvent));
            }
        };
        Recorder.prototype.getRecording = function () {
            return new Recording(this.states);
        };
        Recorder.prototype.start = function () {
            this.isRecording = true;
            this.beforeOnChangeState = {
                view: RecorderUtilities.getHtmlSnapshot(),
                model: RecorderUtilities.sanitizeState(Joove.Common.cloneObject(window["$form"].model))
            };
        };
        Recorder.prototype.pause = function () {
            this.isRecording = false;
        };
        Recorder.prototype.stop = function () {
            if (!this.isRecording)
                return;
            this.saveModelSnapshot();
            this.isRecording = false;
            this.currentState = null;
        };
        Recorder.prototype.addState = function (event) {
            if (!this.isRecording)
                return;
            this.saveModelSnapshot();
            if (event != null) {
                this.states.push(this.parseEvent(event));
            }
        };
        Recorder.prototype.parseRecordEvent = function (event) {
            var element = $(event.element);
            var action = {
                type: event.type,
                controlName: RecorderUtilities.fullPath(element)
            };
            if (action.type === ActionType.Change) {
                action.newValue = Joove.Common.autoParse(element.val());
            }
            return this.setIndex(action, element);
        };
        Recorder.prototype.parseEvent = function (event) {
            var element = $(event.currentTarget);
            var action = {
                type: ActionType.Click,
                controlName: RecorderUtilities.fullPath(element)
            };
            return this.setIndex(action, element);
        };
        Recorder.prototype.setIndex = function (action, element) {
            var items = $(action.controlName);
            for (var index = 0; index < items.length; index++) {
                if (items.get(index) == element.get(0)) {
                    action.index = index;
                }
            }
            return action;
        };
        Recorder.prototype.saveModelSnapshot = function (isListen) {
            if (isListen === void 0) { isListen = false; }
            if (!this.isRecording)
                return;
            if (this.currentState == null) {
                this.states = [];
            }
            var currentState = this.getCurrentSnapshot();
            var state = this.getSnapshot(currentState, isListen);
            if (!Joove.Comparator.DeepEqual(currentState, state)) {
                state.$type = StateType.Changed;
                this.currentState = state;
                this.states.push(state);
            }
            else {
                this.states.push({
                    $type: StateType.UnChanged
                });
            }
        };
        Recorder.prototype.getSnapshot = function (currentState, isListen) {
            if (isListen === void 0) { isListen = false; }
            var viewState = RecorderUtilities.getHtmlSnapshot();
            var modelState = RecorderUtilities.sanitizeState(Joove.Common.cloneObject(window["$form"].model));
            var state = {
                model: modelState,
                view: viewState
            };
            if (currentState != null) {
                state.$type = currentState.$type;
            }
            if (isListen) {
                state = this.beforeOnChangeState;
                this.beforeOnChangeState = {
                    model: modelState,
                    view: viewState
                };
            }
            return state;
        };
        Recorder.prototype.getCurrentSnapshot = function () {
            return this.currentState;
        };
        Recorder.prototype.isLastItemSnapshot = function () {
            return this.getLastItem().$type != null;
        };
        Recorder.prototype.getLastItem = function () {
            return this.states[this.states.length - 1];
        };
        Recorder.prototype.download = function () {
            if (this.isRecording) {
                Joove.Logger.info("Recorder is recording");
                return;
            }
            if (this.states.length == 0) {
                Joove.Logger.info("Recording is empty");
                return;
            }
            var toSave = this.getInfo();
            toSave.states = this.states;
            var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(toSave));
            var downloadLink = document.createElement("a");
            downloadLink.href = dataStr;
            downloadLink.download = "recording-" + toSave.controller + "-" + toSave.action + "-" + moment().format("YYYYMMDDHHmmss") + ".json";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        };
        Recorder.prototype.initListenner = function () {
            this.initClickListener("TabHeaderPageTitle");
            this.initClickListener("FieldSetToggleStateIcon");
        };
        Recorder.prototype.initClickListener = function (controlType) {
            var self = this;
            $("[jb-type='" + controlType + "']").click(function () {
                self.listen({
                    type: ActionType.Click,
                    element: this,
                    controlType: controlType
                });
            });
        };
        Recorder.prototype.getInfo = function () {
            return {
                action: window._context.currentAction,
                controller: window._context.currentController
            };
        };
        return Recorder;
    }());
    Joove.Recorder = Recorder;
})(Joove || (Joove = {}));
