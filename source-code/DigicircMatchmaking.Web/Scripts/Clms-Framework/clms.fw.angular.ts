﻿namespace Joove {
    export interface IWebPageScope extends ng.IScope {
        model;
        trackObject: (obj: any) => number;
        actions: any;
        eventCallbacks: any;
        getRules: Function;
        dehydrate: Function;
        connectedToSignals: Function;
        events: any;
    }

    export interface IJooveScope extends ng.IScope {
        actions;
        model;
        eventCallbacks;
        isDate;
        isNumber;
        format;
        dehydrate: Function;
        connectedToSignals: () => void;
		_partialModelStructure; //Keeps the mapping between the model properties of a Normal and a Partial Form
    }

    export class BaseAngularProvider implements angular.IServiceProvider {
        private _defaultOptions = {};

        setOptions(options): void {
            this._defaultOptions = options;
        };

        $get(): any {
            return {
                getOptions() {
                    return this._defaultOptions;
                }
            };
        };
    }

    export class ClmsAngular {
        static allModules = [
            "ngSanitize",
            "joovegrid",
            "treeNode",
            "ruleApply",
            "ngSimpleSelect",
            "jbDatepicker",
            "jbTabs",
            "jbAutosize",           
            "jbMask",
            "jbFormat",
            "jbImage",
            "jbAttachment",
            "jbMap",
            "jbChart",
            "jooveDsGrid",
            "jbProgress",
            "angularTrix",
            "jbDataList",
            "jbDataPickList",
            "jooveCalendar",
            "jbCompositeFilters",
            "jbQuickDateTimePicker",
            "jbValidationUi",
            "jbMarkup"
        ];

        static getUsedAngularModules(extraModules: Array<string>): Array<string> {
            const used = [];

            const toCheck = ClmsAngular.allModules.concat(extraModules || []);

            for (let i = 0; i < toCheck.length; i++) {
                const current = ClmsAngular.allModules[i];

                try {
                    angular.module(current);
                } catch (e) {
                    angular.module(current, []);
                }
            }

            return toCheck;
        }
    }

    // Rule Apply Module
    class RuleApply extends BaseAngularProvider { }

    function ruleApply($timeout: ng.ITimeoutService, $interval: ng.IIntervalService, ngRadio: any): ng.IDirective {
        return {
            priority: 1001,
            restrict: "AE",
            scope: false,
            link: ($scope: IJooveScope, $element: JQuery, $attrs: ng.IAttributes, ngModelCtrl: any): void => {
                setTimeout(() => {
                    window._ruleEngine.updateRulesOfControl($element);
                }, 15);
            }
        };
    }

    angular.module("ruleApply", [])
        .provider("ruleApply", new RuleApply())
        .directive("ruleApply", ["$timeout", "$interval", "ruleApply", ruleApply]);

    // Textarea autosize Module
    class JbAutosize extends BaseAngularProvider { }

    function jbAutosize($timeout: ng.ITimeoutService, $interval: ng.IIntervalService, ngRadio: any): ng.IDirective {
        return {
            priority: 1001,
            restrict: "AE",
            scope: {

            },
            link: ($scope: IJooveScope, $element: JQuery, $attrs: ng.IAttributes, ngModelCtrl: any): void => {
                if (Common.directiveScopeIsReady($element)) return;

                $element.css("min-height", "25px");
                $element.addClass("jb-autosize");
                setTimeout(() => {
                    //autosize($element);
                },
                    600);

                Common.markDirectiveScopeAsReady($element);
            }
        };
    }

    angular.module("jbAutosize", [])
        .provider("jbAutosize", new JbAutosize())
        .directive("jbAutosize", ["$timeout", "$interval", "jbAutosize", jbAutosize]);

    // TextBox Mask Module
    class JbMask extends BaseAngularProvider { }

    function jbMask($timeout: ng.ITimeoutService, $interval: ng.IIntervalService, ngRadio: any): ng.IDirective {
        return {
            priority: 1001,
            restrict: "AE",
            scope: {
                model: "=ngModel",
                myNumber: "=ngMyNumber"
            },
            link: ($scope: IJooveScope, $element: JQuery, $attrs: ng.IAttributes, ngModelCtrl: any): void => {
                if (Common.directiveScopeIsReady($element)) return;

                Common.setDirectiveScope($element, $scope);
                
                var dt = $element.data("binding-type");
                $element.addClass(ValueFormat.MarkClass);

                if (dt == null) {
                    dt = "decimal"; // for unbound
                }
                
                var valueFormat: ValueFormat;

                try {
                    var inputMaskAttr = $element.attr("data-mask");                    
                    var jsonRaw = Common.replaceAll(inputMaskAttr, "'", "\"");
                    var valueFormatOptions = JSON.parse(jsonRaw);

                    valueFormat = new ValueFormat(valueFormatOptions);
                }
                catch (e) {
                    console.error("Could not parse input mask attribute to ValueFormat object!");
                    valueFormat = new ValueFormat({ decimals: 2, groups: true });
                }

                var numericMask: NumericMask = null;
                var liveMask: LiveInputMask = null;

                if (valueFormat.live === true) {
                    liveMask = new LiveInputMask();
                    liveMask.init($element, $scope, valueFormat, dt);
                }
                else {
                    numericMask = new NumericMask();
                    numericMask.init($element, $scope, valueFormat);
                }

                $scope.valueIsValid = (): boolean => {
                    return valueFormat.live === true
                        ? liveMask.valueIsValidNumber()
                        : numericMask.valueIsValidNumber();
                }

                $scope.getValueFormat = (): ValueFormat => {
                    return valueFormat;
                }

                Common.markDirectiveScopeAsReady($element);
            }
        };
    }
    
    angular
        .module("jbMask", [])
        .provider("jbMask", new JbMask())
        .directive("jbMask", ["$timeout", "$interval", "jbMask", jbMask]);


    export class LiveInputMask {
        private $element: JQuery;
        private scope: IJooveScope;
        private dt: string;
        private isRetartedBrowser: boolean;
        private modelChangedByUserInput: boolean;

        public init($input: JQuery, scope: IJooveScope, format: ValueFormat, dt: string) {
            this.$element = $input;
            this.scope = scope;
            this.dt = dt;
            this.isRetartedBrowser = typeof (Event) !== 'function';
            
            var inputMaskOptions = format.getJqueryInputMaskOptions();
            inputMaskOptions.onBeforeMask = (initialValue: string, opts: JQueryInputMaskOptions): string => {
                return this.beforeMask(initialValue, opts);
            };

            $input.inputmask(inputMaskOptions);

            this.$element.on("change", () => {
                this.onInputChange();
            });

            this.watchNumberBindingForChanges();
        }

        private watchNumberBindingForChanges() {
            this.scope.$watch("myNumber", value => {
                if (this.modelChangedByUserInput === true) return;
                
                this.$element.val(value as any);
            });
        }

        private onInputChange() {
            this.modelChangedByUserInput = true;

            var number = this.getNumberUnformatted();

            this.updateBoundValueInModel(number);

            setTimeout(() => {
                this.modelChangedByUserInput = false;
            }, 10);
        }

        private getNumberUnformatted():number {
            return this.$element.inputmask("unmaskedvalue") as number;
        }

        private updateBoundValueInModel(actualNumber: number) {
            this.scope.myNumber = actualNumber;
            Joove.Core.applyScope(this.scope);
        }

        public valueIsValidNumber() {
            return true;
        }

        private beforeMask(initialValue: string, opts: JQueryInputMaskOptions): string {
            var newValue = initialValue;

            // Decimal Hack.
            // Server serializes floats omitting the .00 part 
            // we need to reconstruct it so that mask is still valid and complete
            if (this.dt == "decimal" || this.dt == "float" || this.dt == "double") {
                newValue = Joove.Common.localizeNumber(newValue, Joove.Common.getCurrenctNumberSeperator());

                if (newValue.indexOf(window._context.decimalSeparator) == -1) {
                    newValue += window._context.decimalSeparator;
                    newValue += "000";
                }
            }

            // This fixes weird behaviour when +/- prefix is toggled...
            opts["isNegative"] = false;
            
            this.internetExplorerHack();
            
            return newValue;        
        }

        private internetExplorerHack() {
            if (this.isRetartedBrowser === false || window._ruleEngine == null || window._ruleEngine.onLoadHasRun !== true) return;

            //Without this hack the angular model binding is not updated....
            setTimeout(() => {
                var oldModel = this.scope.$eval(this.scope.myNumber);
                var newModel = this.getNumberUnformatted();

                if (oldModel != newModel) {
                    this.$element.focus();
                    this.$element.change();
                    $("body").focus();
                    this.$element.focus();
                }
            }, 50);
        }
    }

    export class ValueFormat {
        public static MarkClass: string = "jb-has-value-format";
        public  live: boolean;
        public decimals: number;
        private dateMode: boolean;
        private dateFormat: string;
        public prefix: string;
        public postfix: string;
        private signed: boolean;
        private showOnlyDecimalPart: boolean;
        private groups: boolean;
        private asPercentage: boolean;

        private numeralJsFormat: string;
        private momentJsFormat: string;
        private backEndFormatting: string;
        private excelFormatting: string;

        constructor(options?: {
            dateFormat?: string,
            prefix?: string,
            postfix?: string,
            decimals?: number,
            signed?: boolean,
            showOnlyDecimalPart?: boolean,
            groups?: boolean,
            live?: boolean,
            asPercentage?: boolean;
        }) {           
            if (options == null) {
                this.decimals = 2;
                this.groups = true;
            }
            else {
                this.dateFormat = options.dateFormat;
                this.prefix = options.prefix;
                this.postfix = options.postfix;
                this.decimals = options.decimals;
                this.signed = options.signed;
                this.showOnlyDecimalPart = options.showOnlyDecimalPart;
                this.groups = options.groups;
                this.live = options.live;
                this.asPercentage = options.asPercentage;
            }

            this.dateMode = Common.stringIsNullOrEmpty(this.dateFormat) == false;

            if (this.dateMode === true) {
                this.setMomentJsFormat();
            }
            else {
                this.setNumeralJsFormat();
            }
        }

        // this is a moment.js compatible format
        // https://momentjs.com/docs/#/parsing/string-format/
        private setMomentJsFormat() {
            this.momentJsFormat = this.dateFormat; // 1-to-1 for the moment
        }

        // This is a numeral.js compatible format
        // http://numeraljs.com/#format
        private setNumeralJsFormat() {
            Common.setNumberLocalizationSettings();

            var format = "";

            if (this.asPercentage === true) {
                format = "0";

                if (this.decimals > 0) {                    
                    format += "." + new Array(this.decimals + 1).join("0");
                }

                format += "%";
                
            }
            else {             
                if (this.showOnlyDecimalPart === true) {
                    format = ".";
                }
                else if (this.groups === true) {
                    format += "0,0";
                }
                else {
                    format = "0";
                }

                if (this.signed === true) {
                    format = "+" + format;
                }

                if (this.decimals > 0) {
                    if (this.showOnlyDecimalPart !== true) {
                        format += ".";
                    }

                    format += new Array(this.decimals + 1).join("0");
                }
                else if (this.showOnlyDecimalPart === true) {
                    format = ".0";
                }
            }
            this.numeralJsFormat = format;
        }

        // https://github.com/RobinHerbots/Inputmask
        public getJqueryInputMaskOptions(): any {
            return {
                alias: this.decimals == 0 || this.decimals == null ? "integer" : "decimal",
                autoGroup: this.groups == true,
                digits: this.decimals,                
                radixPoint: window._context.decimalSeparator,
                groupSeparator: window._context.groupSeparator,
                suffix: this.postfix,
                prefix: this.prefix,
                allowMinus: true,
                rightAlign: false,
                unmaskAsNumber: true,                
            };            
        }

        private formatNumber(actualNumber): string {         
            if (actualNumber == null) return "";
            
            var numeralInstance = numeral(actualNumber) as any;

            if (numeralInstance.value() == null) return "";

            //var roundingFunc = numeralInstance.value() > 0 ? Math.floor : Math.ceil;
            var roundingFunc = Math.round;

            var formattedNumber = numeralInstance["format"](this.numeralJsFormat, roundingFunc);

            if (Common.stringIsNullOrEmpty(this.prefix) === false) {
                formattedNumber = this.prefix + formattedNumber;
            }

            if (Common.stringIsNullOrEmpty(this.postfix) === false) {
                formattedNumber += this.postfix;
            }

            return formattedNumber;
        }

        private unformatNumber(formattedNumber): number {            
            if (formattedNumber == null) return null;

            if (formattedNumber.trim && formattedNumber.trim() == "") return null;

            if (formattedNumber.toString && formattedNumber.toString() == "NaN") return null;

            if (typeof formattedNumber === "number") return formattedNumber;

            // remove group separators
            var groupSep = window._context.groupSeparator;
            formattedNumber = formattedNumber.replace(new RegExp("\\" + groupSep, 'g'), '');

            // replace decimal separator with dots
            var decSep = window._context.decimalSeparator;
            formattedNumber = formattedNumber.replace(new RegExp("\\" + decSep, 'g'), '.');

            // remove everything except from numbers, minus sign and dots
            formattedNumber = formattedNumber.replace(/[^\d.-]/g, '');

            var actualNumber = parseFloat(formattedNumber);

            return isNaN(actualNumber) === true
                ? null
                : actualNumber;
        }

        private formatDate(actualDate): string {
            return moment(actualDate).format(this.momentJsFormat);
        }

        private unformatDate(formattedDate): Date {
            return moment(formattedDate, this.momentJsFormat).toDate();            
        }

        public format(actualValue, forceDateMode?: boolean): string {
            return this.dateMode === true || forceDateMode === true
                ? this.formatDate(actualValue)
                : this.formatNumber(actualValue);
        }

        public unformat(formattedValue): any {
            return this.dateMode === true
                ? this.unformatDate(formattedValue)
                : this.unformatNumber(formattedValue);
        }
    }

    export class NumericMask {
        private $input: JQuery;       
        private scope: IJooveScope;
        private modelChangedByUserInput: boolean;
        private formatString: string;
        private valueFormat: ValueFormat;
        private forceInteger: boolean;
        private numbersOnlyListenerClass: string = "numbers-only-listener";

        public init($input: JQuery, scope: IJooveScope, format: ValueFormat) {
            this.$input = $input;
            this.scope = scope;            
            this.valueFormat = format;

            var bindingDt = $input.attr("data-binding-type");

            this.forceInteger = bindingDt == "long" || bindingDt == "int";

            this.$input.on("change", () => {
                this.onInputChange();
            });

            this.$input.on("focus", () => {
                this.addListenerForAllowingNumbersOnly();
            });

            this.watchNumberBindingForChanges();
        }

        private watchNumberBindingForChanges() {
            this.scope.$watch("myNumber", value => {                
                if (this.modelChangedByUserInput === true) return;

                var actualNumber = typeof value == "number"
                    ? value
                    : this.valueFormat.unformat(value); 
                
                this.setDisplayValueToInput(actualNumber);
            });
        }

        private onInputChange() {  
            this.modelChangedByUserInput = true;

            var rawInputValue = this.$input.val();
            var actualNumber = this.valueFormat.unformat(rawInputValue);
            var isValidNumber = actualNumber != null && Number(actualNumber) === actualNumber;

            if (isValidNumber === true) {
                // Do not propagate values after decimal point for integers
                if (this.forceInteger === true && actualNumber % 1 !== 0) {
                    actualNumber = parseInt(actualNumber);
                }
                // Do not propagate values after defined decimal point for other numbers
                else {
                    var decs = this.valueFormat.decimals;

                    if (decs == null) decs = 0;

                    var parts = actualNumber.toString().split(".");

                    if (decs == 0 || parts.length < 2) {
                        actualNumber = parseInt(parts[0]);
                    }
                    else {
                        if (parts[1] == "") {
                            parts[1] = "0";
                        }
                        actualNumber = parseFloat(parts[0] + "." + parts[1].substr(0, decs));
                    }
                }
            }
                        
            this.setDisplayValueToInput(actualNumber);
            this.updateBoundValueInModel(actualNumber);
            
            setTimeout(() => {
                this.modelChangedByUserInput = false;
            }, 10);            
        }

        private updateBoundValueInModel(actualNumber: number) {
            this.scope.myNumber = actualNumber;
            Joove.Core.applyScope(this.scope);
        }

        private setDisplayValueToInput(actualNumber: number) {
            var formattedNumber = this.valueFormat.format(actualNumber);
            
            this.$input.val(formattedNumber);             
        }
             
        private addListenerForAllowingNumbersOnly() {
            if (this.$input.hasClass(this.numbersOnlyListenerClass) === true) return;

            this.$input.on("keypress", (e) => {
                var charCode = (e.which) ? e.which : e.keyCode;                

                var isSign = charCode == 43 || charCode == 45;
                var isDot = charCode == 46;
                var isComma = charCode == 44;
                var isLetterOrCharacter = (charCode > 31 && (charCode < 48 || charCode > 57));
               
                if (isDot === true && window._context.decimalSeparator == ',') {                    
                    this.insertTextAtCursor(',');
                    return false;
                }
                else if (isComma === true && window._context.decimalSeparator == '.') {
                    this.insertTextAtCursor('.');                    
                    return false;
                }

                return isLetterOrCharacter == false || isDot || isComma || isSign;
            });

            this.$input.addClass(this.numbersOnlyListenerClass);
        }

        private insertTextAtCursor(text) {
            // Third party method
            function getCaretPosition(ctrl) {
                // IE < 9 Support
                if (document["selection"]) {
                    ctrl.focus();
                    var range = document["selection"].createRange();
                    var rangelen = range.text.length;
                    range.moveStart('character', -ctrl.value.length);
                    var start = range.text.length - rangelen;
                    return { 'start': start, 'end': start + rangelen };
                }
                // IE >=9 and other browsers
                else if (ctrl.selectionStart || ctrl.selectionStart == '0') {
                    return { 'start': ctrl.selectionStart, 'end': ctrl.selectionEnd };
                } else {
                    return { 'start': 0, 'end': 0 };
                }
            }

            // Third party method
            function setCaretPosition(ctrl, start, end) {
                // IE >= 9 and other browsers
                if (ctrl.setSelectionRange) {
                    ctrl.focus();
                    ctrl.setSelectionRange(start, end);
                }
                // IE < 9
                else if (ctrl.createTextRange) {
                    var range = ctrl.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', end);
                    range.moveStart('character', start);
                    range.select();
                }
            }

            var input = this.$input[0];
            var selection = getCaretPosition(input);            
            var currentValue = this.$input.val() as string || "";
            var startPart = currentValue.substr(0, selection.start);
            var lastPart = currentValue.substr(selection.end);
            var positionAfterInsert = selection.start + 1;

            this.$input.val(startPart + text + lastPart);

            setCaretPosition(input, positionAfterInsert, positionAfterInsert);
        }

        public valueIsValidNumber(): boolean {
            var rawInputValue = this.$input.val();
            var actualNumber = this.valueFormat.unformat(rawInputValue);

            return actualNumber != null;
        }        
    }

    // String Format Module
    class JbFormat extends BaseAngularProvider { }

    function jbFormat($timeout: ng.ITimeoutService, $interval: ng.IIntervalService, ngRadio: any): ng.IDirective {
        return {
            priority: 1001,
            restrict: "AE",
            scope: {
                model: "=ngBind",
                format: "=jbFormat",                
            },
            link: ($scope: IJooveScope, $element: JQuery, $attrs: ng.IAttributes, ngModelCtrl: any): void => {
                if (Common.directiveScopeIsReady($element)) return;

                Common.setDirectiveScope($element, $scope);

                $element.addClass(ValueFormat.MarkClass);
                
                var valueFormat: ValueFormat;

                try {                                                   
                    valueFormat = new ValueFormat($scope.format);
                }
                catch (e) {
                    valueFormat = null;
                    console.error("Could not initialize ValueFormat with provided options!", e);
                }

                $scope.$watch("model", value => {
                    if (value == null) {
                        $element.text("");
                    }
                    else if (valueFormat != null) {                        
                        var formattedValue = valueFormat.format(value);                        
                        $element.text(formattedValue);
                    }
                });

                $scope.getValueFormat = (): ValueFormat => {
                    return valueFormat;
                }

                Common.markDirectiveScopeAsReady($element);
            }
        };
    }

    angular
        .module("jbFormat", [])
        .provider("jbFormat", new JbFormat())
        .directive("jbFormat", ["$timeout", "$interval", "jbFormat", jbFormat]);

    // Html Mark up binding
    class JbMarkUp extends BaseAngularProvider { }
    function jbMarkup($timeout: ng.ITimeoutService, $interval: ng.IIntervalService): ng.IDirective {
        return {
            priority: 1001,
            restrict: "AE",
            scope: {
                model: "=jbMarkup",              
            },
            link: ($scope: IJooveScope, $element: JQuery, $attrs: ng.IAttributes): void => {
                if (Common.directiveScopeIsReady($element)) return;
                Common.setDirectiveScope($element, $scope);
                $scope.$watch("model", (value: string) => {
                    $element.empty();
                    if (value == null || value.trim() == "") return;
                    if (value.indexOf("<") > -1) {                        
                        $element.html(value);
                    }
                    else {
                    $element.html(htmlDecode(value));
                    }
                });
                var htmlDecode = (input: string) => {
                    return $("<div/>").html(input).text();
                }
                
                if ($element.get(0).tagName == "TEXTAREA"){
                    $element.on("change", function(val) {
                        $scope.model = $element.val();
                    });
                }
                
                Common.markDirectiveScopeAsReady($element);
            }
        };
    }
    angular
        .module("jbMarkup", [])
        .provider("jbMarkup", new JbMarkUp())
        .directive("jbMarkup", ["$timeout", "$interval", "jbMarkup", jbMarkup]);
}