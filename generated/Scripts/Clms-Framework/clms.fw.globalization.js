var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Joove;
(function (Joove) {
    function Transform() {
        return function (target, propertyKey, descriptor) {
            try {
                var value_1 = target[propertyKey];
                descriptor.value = function () {
                    var val = value_1();
                    val = Joove.Common.changeDateTimeFormat(val);
                    return val;
                };
            }
            catch (ex) {
                // 
            }
        };
    }
    var DateTimeFormat = /** @class */ (function () {
        function DateTimeFormat() {
        }
        DateTimeFormat.prototype.LongDatePattern = function () {
            return window._context.longDatePattern;
        };
        DateTimeFormat.prototype.LongTimePattern = function () {
            return window._context.longTimePattern;
        };
        DateTimeFormat.prototype.ShortDatePattern = function () {
            return window._context.shortDatePattern;
        };
        DateTimeFormat.prototype.ShortTimePattern = function () {
            return window._context.shortTimePattern;
        };
        DateTimeFormat.prototype.GeneralShortTimePattern = function () {
            return this.ShortDatePattern() + " " + this.ShortTimePattern();
        };
        DateTimeFormat.prototype.GeneralLongTimePattern = function () {
            return this.ShortDatePattern() + " " + this.LongTimePattern();
        };
        __decorate([
            Transform()
        ], DateTimeFormat.prototype, "LongDatePattern", null);
        __decorate([
            Transform()
        ], DateTimeFormat.prototype, "LongTimePattern", null);
        __decorate([
            Transform()
        ], DateTimeFormat.prototype, "ShortDatePattern", null);
        __decorate([
            Transform()
        ], DateTimeFormat.prototype, "ShortTimePattern", null);
        return DateTimeFormat;
    }());
    Joove.DateTimeFormat = DateTimeFormat;
    var GlobalizationManager = /** @class */ (function () {
        function GlobalizationManager() {
        }
        GlobalizationManager.GetCurrentLocaleManager = function () {
            if (GlobalizationManager._instance != null)
                return GlobalizationManager._instance;
            GlobalizationManager.init();
            return GlobalizationManager._instance;
        };
        Object.defineProperty(GlobalizationManager.prototype, "SortName", {
            get: function () {
                return window._context.locale;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GlobalizationManager.prototype, "SortNameLanguage", {
            get: function () {
                return window._context.language;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GlobalizationManager.prototype, "DateTimeFormat", {
            get: function () {
                return this.dateTimeFormat;
            },
            enumerable: false,
            configurable: true
        });
        GlobalizationManager.init = function () {
            var manager = new GlobalizationManager();
            manager.dateTimeFormat = new DateTimeFormat();
            GlobalizationManager._instance = manager;
        };
        return GlobalizationManager;
    }());
    Joove.GlobalizationManager = GlobalizationManager;
})(Joove || (Joove = {}));
