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
    var BaseAngularProvider = /** @class */ (function () {
        function BaseAngularProvider() {
            this._defaultOptions = {};
        }
        BaseAngularProvider.prototype.setOptions = function (options) {
            this._defaultOptions = options;
        };
        ;
        BaseAngularProvider.prototype.$get = function () {
            return {
                getOptions: function () {
                    return this._defaultOptions;
                }
            };
        };
        ;
        return BaseAngularProvider;
    }());
    Joove.BaseAngularProvider = BaseAngularProvider;
    var ClmsAngular = /** @class */ (function () {
        function ClmsAngular() {
        }
        ClmsAngular.getUsedAngularModules = function (extraModules) {
            var used = [];
            var toCheck = ClmsAngular.allModules.concat(extraModules || []);
            for (var i = 0; i < toCheck.length; i++) {
                var current = ClmsAngular.allModules[i];
                try {
                    angular.module(current);
                }
                catch (e) {
                    angular.module(current, []);
                }
            }
            return toCheck;
        };
        ClmsAngular.allModules = [
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
        return ClmsAngular;
    }());
    Joove.ClmsAngular = ClmsAngular;
    // Rule Apply Module
    var RuleApply = /** @class */ (function (_super) {
        __extends(RuleApply, _super);
        function RuleApply() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return RuleApply;
    }(BaseAngularProvider));
    function ruleApply($timeout, $interval, ngRadio) {
        return {
            priority: 1001,
            restrict: "AE",
            scope: false,
            link: function ($scope, $element, $attrs, ngModelCtrl) {
                setTimeout(function () {
                    window._ruleEngine.updateRulesOfControl($element);
                }, 15);
            }
        };
    }
    angular.module("ruleApply", [])
        .provider("ruleApply", new RuleApply())
        .directive("ruleApply", ["$timeout", "$interval", "ruleApply", ruleApply]);
    // Textarea autosize Module
    var JbAutosize = /** @class */ (function (_super) {
        __extends(JbAutosize, _super);
        function JbAutosize() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return JbAutosize;
    }(BaseAngularProvider));
    function jbAutosize($timeout, $interval, ngRadio) {
        return {
            priority: 1001,
            restrict: "AE",
            scope: {},
            link: function ($scope, $element, $attrs, ngModelCtrl) {
                if (Joove.Common.directiveScopeIsReady($element))
                    return;
                $element.css("min-height", "25px");
                $element.addClass("jb-autosize");
                setTimeout(function () {
                    //autosize($element);
                }, 600);
                Joove.Common.markDirectiveScopeAsReady($element);
            }
        };
    }
    angular.module("jbAutosize", [])
        .provider("jbAutosize", new JbAutosize())
        .directive("jbAutosize", ["$timeout", "$interval", "jbAutosize", jbAutosize]);
    // TextBox Mask Module
    var JbMask = /** @class */ (function (_super) {
        __extends(JbMask, _super);
        function JbMask() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return JbMask;
    }(BaseAngularProvider));
    function jbMask($timeout, $interval, ngRadio) {
        return {
            priority: 1001,
            restrict: "AE",
            scope: {
                model: "=ngModel",
                myNumber: "=ngMyNumber"
            },
            link: function ($scope, $element, $attrs, ngModelCtrl) {
                if (Joove.Common.directiveScopeIsReady($element))
                    return;
                Joove.Common.setDirectiveScope($element, $scope);
                var dt = $element.data("binding-type");
                $element.addClass(ValueFormat.MarkClass);
                if (dt == null) {
                    dt = "decimal"; // for unbound
                }
                var valueFormat;
                try {
                    var inputMaskAttr = $element.attr("data-mask");
                    var jsonRaw = Joove.Common.replaceAll(inputMaskAttr, "'", "\"");
                    var valueFormatOptions = JSON.parse(jsonRaw);
                    valueFormat = new ValueFormat(valueFormatOptions);
                }
                catch (e) {
                    console.error("Could not parse input mask attribute to ValueFormat object!");
                    valueFormat = new ValueFormat({ decimals: 2, groups: true });
                }
                var numericMask = null;
                var liveMask = null;
                if (valueFormat.live === true) {
                    liveMask = new LiveInputMask();
                    liveMask.init($element, $scope, valueFormat, dt);
                }
                else {
                    numericMask = new NumericMask();
                    numericMask.init($element, $scope, valueFormat);
                }
                $scope.valueIsValid = function () {
                    return valueFormat.live === true
                        ? liveMask.valueIsValidNumber()
                        : numericMask.valueIsValidNumber();
                };
                $scope.getValueFormat = function () {
                    return valueFormat;
                };
                Joove.Common.markDirectiveScopeAsReady($element);
            }
        };
    }
    angular
        .module("jbMask", [])
        .provider("jbMask", new JbMask())
        .directive("jbMask", ["$timeout", "$interval", "jbMask", jbMask]);
    var LiveInputMask = /** @class */ (function () {
        function LiveInputMask() {
        }
        LiveInputMask.prototype.init = function ($input, scope, format, dt) {
            var _this = this;
            this.$element = $input;
            this.scope = scope;
            this.dt = dt;
            this.isRetartedBrowser = typeof (Event) !== 'function';
            var inputMaskOptions = format.getJqueryInputMaskOptions();
            inputMaskOptions.onBeforeMask = function (initialValue, opts) {
                return _this.beforeMask(initialValue, opts);
            };
            $input.inputmask(inputMaskOptions);
            this.$element.on("change", function () {
                _this.onInputChange();
            });
            this.watchNumberBindingForChanges();
        };
        LiveInputMask.prototype.watchNumberBindingForChanges = function () {
            var _this = this;
            this.scope.$watch("myNumber", function (value) {
                if (_this.modelChangedByUserInput === true)
                    return;
                _this.$element.val(value);
            });
        };
        LiveInputMask.prototype.onInputChange = function () {
            var _this = this;
            this.modelChangedByUserInput = true;
            var number = this.getNumberUnformatted();
            this.updateBoundValueInModel(number);
            setTimeout(function () {
                _this.modelChangedByUserInput = false;
            }, 10);
        };
        LiveInputMask.prototype.getNumberUnformatted = function () {
            return this.$element.inputmask("unmaskedvalue");
        };
        LiveInputMask.prototype.updateBoundValueInModel = function (actualNumber) {
            this.scope.myNumber = actualNumber;
            Joove.Core.applyScope(this.scope);
        };
        LiveInputMask.prototype.valueIsValidNumber = function () {
            return true;
        };
        LiveInputMask.prototype.beforeMask = function (initialValue, opts) {
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
        };
        LiveInputMask.prototype.internetExplorerHack = function () {
            var _this = this;
            if (this.isRetartedBrowser === false || window._ruleEngine == null || window._ruleEngine.onLoadHasRun !== true)
                return;
            //Without this hack the angular model binding is not updated....
            setTimeout(function () {
                var oldModel = _this.scope.$eval(_this.scope.myNumber);
                var newModel = _this.getNumberUnformatted();
                if (oldModel != newModel) {
                    _this.$element.focus();
                    _this.$element.change();
                    $("body").focus();
                    _this.$element.focus();
                }
            }, 50);
        };
        return LiveInputMask;
    }());
    Joove.LiveInputMask = LiveInputMask;
    var ValueFormat = /** @class */ (function () {
        function ValueFormat(options) {
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
            this.dateMode = Joove.Common.stringIsNullOrEmpty(this.dateFormat) == false;
            if (this.dateMode === true) {
                this.setMomentJsFormat();
            }
            else {
                this.setNumeralJsFormat();
            }
        }
        // this is a moment.js compatible format
        // https://momentjs.com/docs/#/parsing/string-format/
        ValueFormat.prototype.setMomentJsFormat = function () {
            this.momentJsFormat = this.dateFormat; // 1-to-1 for the moment
        };
        // This is a numeral.js compatible format
        // http://numeraljs.com/#format
        ValueFormat.prototype.setNumeralJsFormat = function () {
            Joove.Common.setNumberLocalizationSettings();
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
        };
        // https://github.com/RobinHerbots/Inputmask
        ValueFormat.prototype.getJqueryInputMaskOptions = function () {
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
        };
        ValueFormat.prototype.formatNumber = function (actualNumber) {
            if (actualNumber == null)
                return "";
            var numeralInstance = numeral(actualNumber);
            if (numeralInstance.value() == null)
                return "";
            //var roundingFunc = numeralInstance.value() > 0 ? Math.floor : Math.ceil;
            var roundingFunc = Math.round;
            var formattedNumber = numeralInstance["format"](this.numeralJsFormat, roundingFunc);
            if (Joove.Common.stringIsNullOrEmpty(this.prefix) === false) {
                formattedNumber = this.prefix + formattedNumber;
            }
            if (Joove.Common.stringIsNullOrEmpty(this.postfix) === false) {
                formattedNumber += this.postfix;
            }
            return formattedNumber;
        };
        ValueFormat.prototype.unformatNumber = function (formattedNumber) {
            if (formattedNumber == null)
                return null;
            if (formattedNumber.trim && formattedNumber.trim() == "")
                return null;
            if (formattedNumber.toString && formattedNumber.toString() == "NaN")
                return null;
            if (typeof formattedNumber === "number")
                return formattedNumber;
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
        };
        ValueFormat.prototype.formatDate = function (actualDate) {
            return moment(actualDate).format(this.momentJsFormat);
        };
        ValueFormat.prototype.unformatDate = function (formattedDate) {
            return moment(formattedDate, this.momentJsFormat).toDate();
        };
        ValueFormat.prototype.format = function (actualValue, forceDateMode) {
            return this.dateMode === true || forceDateMode === true
                ? this.formatDate(actualValue)
                : this.formatNumber(actualValue);
        };
        ValueFormat.prototype.unformat = function (formattedValue) {
            return this.dateMode === true
                ? this.unformatDate(formattedValue)
                : this.unformatNumber(formattedValue);
        };
        ValueFormat.MarkClass = "jb-has-value-format";
        return ValueFormat;
    }());
    Joove.ValueFormat = ValueFormat;
    var NumericMask = /** @class */ (function () {
        function NumericMask() {
            this.numbersOnlyListenerClass = "numbers-only-listener";
        }
        NumericMask.prototype.init = function ($input, scope, format) {
            var _this = this;
            this.$input = $input;
            this.scope = scope;
            this.valueFormat = format;
            var bindingDt = $input.attr("data-binding-type");
            this.forceInteger = bindingDt == "long" || bindingDt == "int";
            this.$input.on("change", function () {
                _this.onInputChange();
            });
            this.$input.on("focus", function () {
                _this.addListenerForAllowingNumbersOnly();
            });
            this.watchNumberBindingForChanges();
        };
        NumericMask.prototype.watchNumberBindingForChanges = function () {
            var _this = this;
            this.scope.$watch("myNumber", function (value) {
                if (_this.modelChangedByUserInput === true)
                    return;
                var actualNumber = typeof value == "number"
                    ? value
                    : _this.valueFormat.unformat(value);
                _this.setDisplayValueToInput(actualNumber);
            });
        };
        NumericMask.prototype.onInputChange = function () {
            var _this = this;
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
                    if (decs == null)
                        decs = 0;
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
            setTimeout(function () {
                _this.modelChangedByUserInput = false;
            }, 10);
        };
        NumericMask.prototype.updateBoundValueInModel = function (actualNumber) {
            this.scope.myNumber = actualNumber;
            Joove.Core.applyScope(this.scope);
        };
        NumericMask.prototype.setDisplayValueToInput = function (actualNumber) {
            var formattedNumber = this.valueFormat.format(actualNumber);
            this.$input.val(formattedNumber);
        };
        NumericMask.prototype.addListenerForAllowingNumbersOnly = function () {
            var _this = this;
            if (this.$input.hasClass(this.numbersOnlyListenerClass) === true)
                return;
            this.$input.on("keypress", function (e) {
                var charCode = (e.which) ? e.which : e.keyCode;
                var isSign = charCode == 43 || charCode == 45;
                var isDot = charCode == 46;
                var isComma = charCode == 44;
                var isLetterOrCharacter = (charCode > 31 && (charCode < 48 || charCode > 57));
                if (isDot === true && window._context.decimalSeparator == ',') {
                    _this.insertTextAtCursor(',');
                    return false;
                }
                else if (isComma === true && window._context.decimalSeparator == '.') {
                    _this.insertTextAtCursor('.');
                    return false;
                }
                return isLetterOrCharacter == false || isDot || isComma || isSign;
            });
            this.$input.addClass(this.numbersOnlyListenerClass);
        };
        NumericMask.prototype.insertTextAtCursor = function (text) {
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
                }
                else {
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
            var currentValue = this.$input.val() || "";
            var startPart = currentValue.substr(0, selection.start);
            var lastPart = currentValue.substr(selection.end);
            var positionAfterInsert = selection.start + 1;
            this.$input.val(startPart + text + lastPart);
            setCaretPosition(input, positionAfterInsert, positionAfterInsert);
        };
        NumericMask.prototype.valueIsValidNumber = function () {
            var rawInputValue = this.$input.val();
            var actualNumber = this.valueFormat.unformat(rawInputValue);
            return actualNumber != null;
        };
        return NumericMask;
    }());
    Joove.NumericMask = NumericMask;
    // String Format Module
    var JbFormat = /** @class */ (function (_super) {
        __extends(JbFormat, _super);
        function JbFormat() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return JbFormat;
    }(BaseAngularProvider));
    function jbFormat($timeout, $interval, ngRadio) {
        return {
            priority: 1001,
            restrict: "AE",
            scope: {
                model: "=ngBind",
                format: "=jbFormat",
            },
            link: function ($scope, $element, $attrs, ngModelCtrl) {
                if (Joove.Common.directiveScopeIsReady($element))
                    return;
                Joove.Common.setDirectiveScope($element, $scope);
                $element.addClass(ValueFormat.MarkClass);
                var valueFormat;
                try {
                    valueFormat = new ValueFormat($scope.format);
                }
                catch (e) {
                    valueFormat = null;
                    console.error("Could not initialize ValueFormat with provided options!", e);
                }
                $scope.$watch("model", function (value) {
                    if (value == null) {
                        $element.text("");
                    }
                    else if (valueFormat != null) {
                        var formattedValue = valueFormat.format(value);
                        $element.text(formattedValue);
                    }
                });
                $scope.getValueFormat = function () {
                    return valueFormat;
                };
                Joove.Common.markDirectiveScopeAsReady($element);
            }
        };
    }
    angular
        .module("jbFormat", [])
        .provider("jbFormat", new JbFormat())
        .directive("jbFormat", ["$timeout", "$interval", "jbFormat", jbFormat]);
    // Html Mark up binding
    var JbMarkUp = /** @class */ (function (_super) {
        __extends(JbMarkUp, _super);
        function JbMarkUp() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return JbMarkUp;
    }(BaseAngularProvider));
    function jbMarkup($timeout, $interval) {
        return {
            priority: 1001,
            restrict: "AE",
            scope: {
                model: "=jbMarkup",
            },
            link: function ($scope, $element, $attrs) {
                if (Joove.Common.directiveScopeIsReady($element))
                    return;
                Joove.Common.setDirectiveScope($element, $scope);
                $scope.$watch("model", function (value) {
                    $element.empty();
                    if (value == null || value.trim() == "")
                        return;
                    if (value.indexOf("<") > -1) {
                        $element.html(value);
                    }
                    else {
                        $element.html(htmlDecode(value));
                    }
                });
                var htmlDecode = function (input) {
                    return $("<div/>").html(input).text();
                };
                if ($element.get(0).tagName == "TEXTAREA") {
                    $element.on("change", function (val) {
                        $scope.model = $element.val();
                    });
                }
                Joove.Common.markDirectiveScopeAsReady($element);
            }
        };
    }
    angular
        .module("jbMarkup", [])
        .provider("jbMarkup", new JbMarkUp())
        .directive("jbMarkup", ["$timeout", "$interval", "jbMarkup", jbMarkup]);
})(Joove || (Joove = {}));
