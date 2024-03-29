namespace Joove {
    export enum ActionType {
        Click,
        Change,
        Stop
    }

    export enum StateType {
        UnChanged,
        Changed
    }

    export interface Action {
        type?: ActionType,
        controlName?: string,
        index?: number,
        newValue?: string
    }

    export interface RecordEvent {
        element: Element,
        controlType: string,
        type: ActionType,
    }

    export class AssertError extends Error { }

    export class RecorderUtilities {

        static sanitizeState(state: any): any {
            let keys = Object.keys(state);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (key.indexOf("_") === 0 || key === "Domain") {
                    delete state[key];
                    continue;
                }

                if (Array.isArray(state[key])) {
                    state[key] = state[key].map(s => RecorderUtilities.sanitizeState(s));
                }

                if (state[key] instanceof Object) {
                    state[key] = RecorderUtilities.sanitizeState(state[key]);
                }
            }
            try {
                return JSON.parse(JSON.stringify(state));
            } catch (e) {
                debugger;
                console.log(state);
            }

        }

        static getControlSelectorName(el: any): string {
            let selector = "";
            let controlName = el.attr("jb-id");

            if (controlName != null) {
                selector = `[jb-id="${controlName}"]`;
            } else {
                const classes = el.attr('class').split(/\s+/).filter(cls => {
                    return cls.indexOf("ng-scope") != -1;
                });
                if (classes.lenght > 0) {
                    selector = classes.join(".");
                } else {
                    selector = el.prop("tagName").toLowerCase();
                }
            }
            return `${selector}`;
        }

        static getControl(action: Action) {
            return $($(action.controlName).get(action.index));
        }

        static fullPath(el: any): string {
            var names = [];
            while (el.parent()) {
                if (el.attr("jb-type") === "Body") {
                    names.unshift(`[jb-id="${el.attr("jb-id")}"]`);
                    break;
                } else {
                    names.unshift(RecorderUtilities.getControlSelectorName(el));
                }
                el = el.parent();
            }

            return names.join(" > ");
        }

        static getModelSnapshot(eventType): any {
            return RecorderUtilities.sanitizeState(Joove.Common.cloneObject(window["$form"].model));
        }

        static getHtmlSnapshot(): any {
            let visitor = new System.Xml.HtmlVisitor();
            return visitor.toObject(document.body, (parent, current) => {
                let obj: any = {
                    childs: []
                };

                const classes = current.className;
                if (!Joove.Common.stringIsNullOrEmpty(classes)) {
                    obj.classes = classes;
                }

                const style = current.getAttribute("style");
                if (style != null) {
                    obj.style = style;
                }

                if (current.children.length === 0) {
                    const text = current.textContent;
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
        }
    }

    export class Recording {

        private stepId: number;

        private currentState: any;

        private delay: number;

        private fns: Array<Function>;

        public name: string;

        constructor(private steps: Array<any> = []) {
            this.stepId = 1;
            this.currentState = steps[0];
            this.delay = 1000;
            this.fns = [];
        }

        play() {
            var start = new Promise((resolve, reject) => { resolve(true); });
            for (let i = 0; i < this.steps.length; i += 2) {
                start = start
                    .then(() => this.notify())
                    .then(() => this.step())
                    .then(() => this.forward())
                    .then(() => this.sleep())
                    .then(() => this.assertCurrentState());
            }
            return start;
        }

        sleep() {
            return new Promise((resolve, reject) => {
                setTimeout(() => resolve(), this.delay);
            });
        }

        step() {
            return new Promise((resolve, reject) => {
                const currentStep = this.getCurrentStep();
                if (currentStep == null) {
                    resolve(false);
                } else {
                    const targetElement = $($(currentStep.controlName).get(currentStep.index));

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

                    this.loadCurrentState();
                    resolve(true);
                }
            });
        }

        forward() {
            return new Promise((resolve, reject) => {
                if (!this.finished()) {
                    const nextStep = this.getNextStep();
                    resolve();
                } else {
                    resolve();
                }
            });
        }

        loadCurrentState() {
            let nextState = this.steps[this.stepId + 1];
            if (nextState.$type === StateType.Changed) {
                delete nextState.$type;
                this.currentState = nextState;
            }
        }

        finished() {
            return this.stepId > this.steps.length;
        }

        assertCurrentState() {
            return new Promise((resolve, reject) => {
                const model = {
                    view: RecorderUtilities.getHtmlSnapshot(),
                    model: RecorderUtilities.sanitizeState(Joove.Common.cloneObject(window["$form"].model))
                };

                if (!Joove.Comparator.DeepEqual(this.getCurrentState(), model)) {
                    reject(new AssertError("Model state is different"));
                } else {
                    resolve(true);
                }
            });
        }

        isAction(step: any) {
            if (step == null) return false;
            return step.type === ActionType.Click;
        }

        getCurrentStep() {
            return this.steps[this.stepId];
        }

        getCurrentState() {
            if (this.currentState != null) {
                delete this.currentState.$type;
            }
            return this.currentState;
        }

        getNextStep() {
            this.stepId = this.stepId + 2;
            return this.steps[this.stepId];
        }

        register(f: Function) {
            this.fns.push(f);
        }

        notify() {
            this.fns.forEach(fn => fn(this.stepId));
        }

        numSteps() {
            return Math.floor(this.steps.length / 2);
        }
    }

    export class Recorder {

        private currentState: any = null;
        private beforeOnChangeState: any = null;

        private states: Array<any> = [];

        private isRecording: boolean;
        
        constructor() {
            const self = this;

            this.isRecording = false;

            setTimeout(() => { this.initListenner(); }, 1000);
        }

        listen(recordEvent: RecordEvent): void {
            if (!this.isRecording) return;

            this.saveModelSnapshot(true);
            if (recordEvent != null) {
                this.states.push(this.parseRecordEvent(recordEvent));
            }
        }

        getRecording() {
            return new Recording(this.states);
        }

        start(): void {
            this.isRecording = true;
            this.beforeOnChangeState = {
                view: RecorderUtilities.getHtmlSnapshot(),
                model: RecorderUtilities.sanitizeState(Joove.Common.cloneObject(window["$form"].model))
            };
        }

        pause(): void {
            this.isRecording = false;
        }

        stop(): void {
            if (!this.isRecording) return;
            this.saveModelSnapshot();
            this.isRecording = false;
            this.currentState = null;
        }

        addState(event?: any): void {
            if (!this.isRecording) return;

            this.saveModelSnapshot();
            if (event != null) {
                this.states.push(this.parseEvent(event));
            }
        }

        parseRecordEvent(event: RecordEvent): Action {
            let element = $(event.element);
            let action: Action = {
                type: event.type,
                controlName: RecorderUtilities.fullPath(element)
            }

            if (action.type === ActionType.Change) {
                action.newValue = Joove.Common.autoParse(element.val());
            }
            return this.setIndex(action, element);
        }

        parseEvent(event: any): Action {
            let element = $(event.currentTarget);
            var action: Action = {
                type: ActionType.Click,
                controlName: RecorderUtilities.fullPath(element)
            }

            return this.setIndex(action, element);
        }

        setIndex(action: Action, element: JQuery): Action {
            var items = $(action.controlName);

            for (var index = 0; index < items.length; index++) {
                if (items.get(index) == element.get(0)) {
                    action.index = index;
                }
            }

            return action;
        }

        saveModelSnapshot(isListen = false): void {
            if (!this.isRecording) return;

            if (this.currentState == null) {
                this.states = [];
            }

            let currentState = this.getCurrentSnapshot();
            let state = this.getSnapshot(currentState, isListen);
            
            if (!Joove.Comparator.DeepEqual(currentState, state)) {
                state.$type = StateType.Changed;

                this.currentState = state;
                this.states.push(state);
            } else {
                this.states.push({
                    $type: StateType.UnChanged
                });
            }
        }

        getSnapshot(currentState: any, isListen = false): any {            
            let viewState = RecorderUtilities.getHtmlSnapshot();
            let modelState = RecorderUtilities.sanitizeState(Joove.Common.cloneObject(window["$form"].model));
            let state: any = {
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
        }
        
        getCurrentSnapshot(): any {
            return this.currentState;
        }

        isLastItemSnapshot(): any {
            return this.getLastItem().$type != null;
        }

        getLastItem(): any {
            return this.states[this.states.length - 1];
        }

        download(): void {
            if (this.isRecording) {
                Joove.Logger.info("Recorder is recording");
                return;
            }

            if (this.states.length == 0) {
                Joove.Logger.info("Recording is empty");
                return;
            }

            const toSave = this.getInfo();

            toSave.states = this.states;
            const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(toSave))}`;
            var downloadLink = document.createElement("a");
            downloadLink.href = dataStr;
            downloadLink.download = `recording-${toSave.controller}-${toSave.action}-${moment().format("YYYYMMDDHHmmss")}.json`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }

        private initListenner(): void {
            this.initClickListener("TabHeaderPageTitle");
            this.initClickListener("FieldSetToggleStateIcon");
        }

        private initClickListener(controlType: string): void {
            const self = this;

            $(`[jb-type='${controlType}']`).click(function () {
                self.listen({
                    type: ActionType.Click,
                    element: this,
                    controlType: controlType
                });
            });
        }

        private getInfo(): any {
            return {
                action: window._context.currentAction,
                controller: window._context.currentController
            }
        }
    }
}