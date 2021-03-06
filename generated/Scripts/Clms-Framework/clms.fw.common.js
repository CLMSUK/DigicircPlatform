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
Date.prototype.addDays = function (days) {
    this.setDate(this.getDate() + days);
    return this;
};
if (!String.prototype["format"]) {
    String.prototype["format"] = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) { return (typeof args[number] != "undefined"
            ? args[number]
            : match); });
    };
}
if (!String.prototype["hashCode"]) {
    String.prototype["hashCode"] = function () {
        var h = 0, l = this.length, i = 0;
        if (l > 0)
            while (i < l)
                h = (h << 5) - h + this.charCodeAt(i++) | 0;
        return h;
    };
}
if (!Array.prototype["linq"]) {
    Object.defineProperty(Array.prototype, "linq", {
        get: function () {
            return System.Linq.Enumerable.from(this);
        },
        enumerable: false,
        configurable: true
    });
}
if (!Array.prototype["add"]) {
    Object.defineProperty(Array.prototype, "add", {
        value: function (item) {
            if (this == null)
                return [item];
            return this.push(item);
        },
        enumerable: false,
        configurable: true
    });
}
if (!Array.prototype["toArray"]) {
    Object.defineProperty(Array.prototype, "toArray", {
        value: function () {
            return this;
        },
        enumerable: false,
        configurable: true
    });
}
if (!Array.prototype["addManyNew"]) {
    Object.defineProperty(Array.prototype, "addManyNew", {
        value: function (times, valueGetter) {
            for (var index = 0; index < times; index++) {
                this.push(valueGetter());
            }
            return this;
        },
        enumerable: false,
        configurable: true
    });
}
if (!Array.prototype["clear"]) {
    Object.defineProperty(Array.prototype, "clear", {
        value: function () {
            if (this == null)
                return this;
            this.splice(0, this.length);
            return this;
        },
        enumerable: false,
        configurable: true
    });
}
if (!Array.prototype["contains"]) {
    Object.defineProperty(Array.prototype, "contains", {
        value: function (item) {
            if (this == null)
                return false;
            var array = new System.Collections.List(this);
            return array.contains(item);
        },
        enumerable: false,
        configurable: true
    });
}
if (!Array.prototype["remove"]) {
    Object.defineProperty(Array.prototype, "remove", {
        value: function (item) {
            if (this == null)
                return;
            var indexToRemove = this.indexOf(item);
            if (indexToRemove == -1)
                return;
            this.splice(indexToRemove, 1);
            return this;
        },
        enumerable: false,
        configurable: true
    });
}
if (!Array.prototype["addRange"]) {
    Object.defineProperty(Array.prototype, "addRange", {
        value: function (items) {
            if (items == null || this == null)
                return;
            for (var i = 0; i < items.length; i++) {
                this.push(items[i]);
            }
            return this;
        },
        enumerable: false,
        configurable: true
    });
}
if (!Array.prototype["insert"]) {
    Object.defineProperty(Array.prototype, "insert", {
        value: function (pos, item) {
            this.splice(pos, 0, item);
        },
        enumerable: false,
        configurable: true
    });
}
if (!Array.prototype["toCollection"]) {
    Object.defineProperty(Array.prototype, "toCollection", {
        value: function () {
            return new System.Collections.List(this);
        },
        enumerable: false,
        configurable: true
    });
}
if (!Math.round10) {
    Math.round10 = function (value, exp) { return Joove.Common.decimalAdjust("round", value, exp); };
}
// Decimal floor
if (!Math.floor10) {
    Math.floor10 = function (value, exp) { return Joove.Common.decimalAdjust("floor", value, exp); };
}
// Decimal ceil
if (!Math.ceil10) {
    Math.ceil10 = function (value, exp) { return Joove.Common.decimalAdjust("ceil", value, exp); };
}
if (!Math.sign) {
    Math.sign = function (x) { return (Number(x > 0) - Number(x < 0)) || +x; };
}
var NULL = Object.freeze({});
var CLMS;
(function (CLMS) {
    var Framework;
    (function (Framework) {
        var Timespan;
        (function (Timespan) {
            function Parse(value) {
                var _a, _b;
                var day;
                var milliseconds;
                var tokens = value.split(":");
                var hours = tokens[0], minutes = tokens[1], seconds = tokens[2];
                if (hours.indexOf('.') !== -1) {
                    _a = hours.split('.'), day = _a[0], hours = _a[1];
                }
                if (seconds.indexOf('.') !== -1) {
                    _b = seconds.split('.'), seconds = _b[0], milliseconds = _b[1];
                }
                var tms = new System.Time.TimeSpan(0, System.Time.TimeUnit.Days);
                if (day != null) {
                    tms = tms.addUnit(parseInt(day), System.Time.TimeUnit.Days);
                }
                if (hours != null) {
                    tms = tms.addUnit(parseInt(hours), System.Time.TimeUnit.Hours);
                }
                if (minutes != null) {
                    tms = tms.addUnit(parseInt(minutes), System.Time.TimeUnit.Minutes);
                }
                if (seconds != null) {
                    tms = tms.addUnit(parseInt(seconds), System.Time.TimeUnit.Seconds);
                }
                if (milliseconds != null) {
                    tms = tms.addUnit(parseInt(milliseconds), System.Time.TimeUnit.Milliseconds);
                }
                return tms;
            }
            Timespan.Parse = Parse;
        })(Timespan = Framework.Timespan || (Framework.Timespan = {}));
        var DateTime;
        (function (DateTime) {
            function ToString(value, format, locale) {
                var datetime = moment(value);
                if (locale != null)
                    datetime.locale(locale.Code);
                if (format == null)
                    datetime.format();
                return datetime.format(Joove.Common.changeDateTimeFormat(format)).toUpperCase();
            }
            DateTime.ToString = ToString;
            function ParseExact(value, locale, formats) {
                if (formats != null) {
                    if (typeof formats === "string") {
                        formats = Joove.Common.changeDateTimeFormat(formats);
                    }
                    else {
                        formats = formats.map(function (format) {
                            if (typeof format === "string")
                                return Joove.Common.changeDateTimeFormat(format);
                            return format;
                        });
                    }
                    return moment(value, formats, locale);
                }
                return moment(value, locale || "en-US");
            }
            DateTime.ParseExact = ParseExact;
            function Compare(left, right) {
                var x = Joove.Common.dateDiff(left, right);
                return Math.sign(x.milliseconds);
            }
            DateTime.Compare = Compare;
        })(DateTime = Framework.DateTime || (Framework.DateTime = {}));
        var Boolean;
        (function (Boolean) {
            function Parse(value) {
                return value == "true";
            }
            Boolean.Parse = Parse;
        })(Boolean = Framework.Boolean || (Framework.Boolean = {}));
        var Integer;
        (function (Integer) {
            function Parse(value) {
                if (value == null)
                    return null;
                var parsed = parseInt(value);
                return isNaN(parsed) ? null : parsed;
            }
            Integer.Parse = Parse;
        })(Integer = Framework.Integer || (Framework.Integer = {}));
        var Long;
        (function (Long) {
            function Parse(value) {
                if (value == null)
                    return null;
                var parsed = parseInt(value);
                return isNaN(parsed) ? null : parsed;
            }
            Long.Parse = Parse;
        })(Long = Framework.Long || (Framework.Long = {}));
        var Float;
        (function (Float) {
            function Parse(value) {
                if (value == null)
                    return null;
                var parsed = parseFloat(value);
                return isNaN(parsed) ? null : parsed;
            }
            Float.Parse = Parse;
        })(Float = Framework.Float || (Framework.Float = {}));
        var Decimal;
        (function (Decimal) {
            function Parse(value) {
                if (value == null)
                    return null;
                var parsed = parseFloat(value);
                return isNaN(parsed) ? null : parsed;
            }
            Decimal.Parse = Parse;
        })(Decimal = Framework.Decimal || (Framework.Decimal = {}));
        var Double;
        (function (Double) {
            function Parse(value) {
                if (value == null)
                    return null;
                var parsed = parseFloat(value);
                return isNaN(parsed) ? null : parsed;
            }
            Double.Parse = Parse;
        })(Double = Framework.Double || (Framework.Double = {}));
        var String;
        (function (String) {
            String.Empty = "";
            function Compare(left, right, ignoreCase) {
                if (ignoreCase === void 0) { ignoreCase = false; }
                if (ignoreCase === true) {
                    left = left == null ? "" : left.toLocaleLowerCase();
                    right = right == null ? "" : right.toLocaleLowerCase();
                }
                return left.localeCompare(right);
            }
            String.Compare = Compare;
            function Join(sep, values) {
                return values.join(sep);
            }
            String.Join = Join;
            function IsSingular(value) {
                throw new System.Exceptions.NotImplementedException("CLMS.Framework.String.IsSingular: Not Implemented yet!");
            }
            String.IsSingular = IsSingular;
            function IsPlural(value) {
                throw new System.Exceptions.NotImplementedException("CLMS.Framework.String.IsPlural: Not Implemented yet!");
            }
            String.IsPlural = IsPlural;
            function Singularize(value) {
                throw new System.Exceptions.NotImplementedException("CLMS.Framework.String.Singularize: Not Implemented yet!");
            }
            String.Singularize = Singularize;
            function Pluralize(value) {
                throw new System.Exceptions.NotImplementedException("CLMS.Framework.String.Pluralize: Not Implemented yet!");
            }
            String.Pluralize = Pluralize;
            function Format(format) {
                var _a;
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                return (_a = format).format.apply(_a, args);
            }
            String.Format = Format;
            function Concat(values, right) {
                if (values instanceof Array) {
                    return values.join("");
                }
                else {
                    return values.toString() + right;
                }
            }
            String.Concat = Concat;
            function SplitCamelCase(input, pattern, replacement) {
                return input.replace(new RegExp(pattern), replacement);
            }
            String.SplitCamelCase = SplitCamelCase;
            function IsNullOrEmpty(value) {
                return value === "undefined" || Joove.Common.stringIsNullOrEmpty(value);
            }
            String.IsNullOrEmpty = IsNullOrEmpty;
            function FillWith(value, rep) {
                return Array(rep + 1).join(value);
            }
            String.FillWith = FillWith;
        })(String = Framework.String || (Framework.String = {}));
        var Utilities;
        (function (Utilities) {
            function FocusOnFirstInputElementOfModal() {
                if (window._context.isModal === true) {
                    setTimeout(function () {
                        $("[jb-type='TextBox'], [jb-type='TextArea'], [jb-type='RichTextBox'], [jb-type='PasswordTextBox'], [jb-type='DateTimeBox'], [jb-type='PasswordTextBox']").eq(0).focus();
                    }, 500);
                }
            }
            Utilities.FocusOnFirstInputElementOfModal = FocusOnFirstInputElementOfModal;
            function ExecuteRequest(req, args, cb, err) {
                if (cb == NULL)
                    cb = function (response) { };
                if (err == NULL)
                    err = function (error) { };
                req.apply(void 0, args).then(cb)
                    .catch(err)
                    .then(function () {
                    Joove.Core.applyScope(Joove.Common.getScope());
                });
            }
            Utilities.ExecuteRequest = ExecuteRequest;
            function ThrowException(name) {
                throw new System.Exceptions.NotImplementedException(name + ": Not Implemented yet!");
            }
            Utilities.ThrowException = ThrowException;
            function OpenWindow(url, target, showWarningIfBlocked) {
                if (target === void 0) { target = "_blank"; }
                if (showWarningIfBlocked === void 0) { showWarningIfBlocked = true; }
                var newWindow = window.open(url, target);
                try {
                    newWindow.focus();
                }
                catch (e) {
                    if (showWarningIfBlocked == true) {
                        window._popUpManager.warning(window._resourcesManager.getPopupBlockedTitle(), window._resourcesManager.getPopupBlockedMessage());
                    }
                }
            }
            Utilities.OpenWindow = OpenWindow;
            function GetURIParameterValue(parameter) {
                //Works for stuff like: http://localhost:56258/MemberList/GoTo?aNumber=500&astring=xaxa
                var urlParams = new URLSearchParams(location.search);
                if (urlParams && urlParams.has(parameter)) {
                    return urlParams.get(parameter);
                }
                //Works for stuff like: http://localhost:56258/MemberList/GoTo/500/xaxa
                if (window._context && window._context.routeData && window._context.routeData.length && window._context.routeData.length > 0) {
                    for (var i = 0; i < window._context.routeData.length; i++) {
                        var record = window._context.routeData[i];
                        if (record["key"].toLowerCase() == parameter.toLowerCase()) {
                            return record["value"];
                        }
                    }
                }
                return "";
            }
            Utilities.GetURIParameterValue = GetURIParameterValue;
            function SizeOf(object) {
                var objects = [object];
                var size = 0;
                for (var index = 0; index < objects.length; index++) {
                    switch (typeof objects[index]) {
                        case 'boolean':
                            size += 4;
                            break;
                        case 'number':
                            size += 8;
                            break;
                        case 'string':
                            size += 2 * objects[index].length;
                            break;
                        case 'object':
                            if (Object.prototype.toString.call(objects[index]) != '[object Array]') {
                                for (var key in objects[index])
                                    size += 2 * key.length;
                            }
                            for (var key in objects[index]) {
                                var processed = false;
                                for (var search = 0; search < objects.length; search++) {
                                    if (objects[search] === objects[index][key]) {
                                        processed = true;
                                        break;
                                    }
                                }
                                if (!processed)
                                    objects.push(objects[index][key]);
                            }
                    }
                }
                return size;
            } //end SizeOf()
            Utilities.SizeOf = SizeOf;
            var ValidationException = /** @class */ (function (_super) {
                __extends(ValidationException, _super);
                function ValidationException() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return ValidationException;
            }(System.Exceptions.NotImplementedException));
            Utilities.ValidationException = ValidationException;
            var MambaRuntimeType = /** @class */ (function () {
                function MambaRuntimeType() {
                }
                return MambaRuntimeType;
            }());
            Utilities.MambaRuntimeType = MambaRuntimeType;
            var Path = /** @class */ (function () {
                function Path() {
                }
                return Path;
            }());
            Utilities.Path = Path;
            var Email = /** @class */ (function () {
                function Email() {
                }
                Email.SendMail = function (subject, body, to, cc, bcc, fromAddress, attachments, sendAsync) {
                    if (cc === void 0) { cc = ""; }
                    if (bcc === void 0) { bcc = ""; }
                    if (fromAddress === void 0) { fromAddress = ""; }
                    if (attachments === void 0) { attachments = null; }
                    if (sendAsync === void 0) { sendAsync = false; }
                    if (subject instanceof EMailMessage) {
                    }
                    else {
                    }
                };
                return Email;
            }());
            Utilities.Email = Email;
            var Serializer = /** @class */ (function () {
                function Serializer() {
                }
                Serializer.prototype.ToJson = function (instance) {
                    return JSON.stringify(instance);
                };
                Serializer.prototype.FromJson = function (data) {
                    return Joove.Common.toJson(data);
                };
                Serializer.prototype.ToXml = function (instance, tab) {
                    /*	This work is licensed under Creative Commons GNU LGPL License.
                        License: http://creativecommons.org/licenses/LGPL/2.1/
                       Version: 0.9
                        Author:  Stefan Goessner/2006
                        Web:     http://goessner.net/
                    */
                    var toXml = function (v, name, ind) {
                        var xmlParsed = "";
                        if (v instanceof Array) {
                            for (var i = 0, n = v.length; i < n; i++) {
                                xmlParsed += ind + toXml(v[i], name, ind + "\t") + "\n";
                            }
                        }
                        else if (typeof (v) == "object") {
                            var hasChild = false;
                            xmlParsed += ind + "<" + name;
                            for (var m in v) {
                                if (v.hasOwnProperty(m)) {
                                    if (m.charAt(0) === "@")
                                        xmlParsed += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
                                    else
                                        hasChild = true;
                                }
                            }
                            xmlParsed += hasChild ? ">" : "/>";
                            if (hasChild) {
                                for (var m in v) {
                                    if (v.hasOwnProperty(m)) {
                                        if (m === "#text")
                                            xmlParsed += v[m];
                                        else if (m === "#cdata")
                                            xmlParsed += "<![CDATA[" + v[m] + "]]>";
                                        else if (m.charAt(0) !== "@")
                                            xmlParsed += toXml(v[m], m, ind + "\t");
                                    }
                                }
                                xmlParsed += (xmlParsed.charAt(xmlParsed.length - 1) === "\n"
                                    ? ind : "") + "</" + name + ">";
                            }
                        }
                        else {
                            xmlParsed += ind + "<" + name + ">" + v.toString() + "</" + name + ">";
                        }
                        return xmlParsed;
                    }, xmlOutput = "";
                    for (var m in instance) {
                        if (instance.hasOwnProperty(m)) {
                            xmlOutput += toXml(instance[m], m, "");
                        }
                    }
                    return tab ? xmlOutput.replace(/\t/g, tab) : xmlOutput.replace(/\t|\n/g, "");
                };
                Serializer.prototype.FromXml = function (data) {
                    return jQuery.parseXML(data);
                };
                Serializer.prototype.ParseEnum = function (data) {
                    throw new System.Exceptions.NotImplementedException(name + ": Not Implemented yet!");
                };
                return Serializer;
            }());
            Utilities.Serializer = Serializer;
            var EMailMessage = /** @class */ (function () {
                function EMailMessage() {
                    this.To = [];
                    this.CC = [];
                    this.Bcc = [];
                }
                return EMailMessage;
            }());
            Utilities.EMailMessage = EMailMessage;
            var DataAccessContext = /** @class */ (function () {
                function DataAccessContext() {
                }
                return DataAccessContext;
            }());
            Utilities.DataAccessContext = DataAccessContext;
            var PagedResults = /** @class */ (function () {
                function PagedResults() {
                }
                return PagedResults;
            }());
            Utilities.PagedResults = PagedResults;
            var Common = /** @class */ (function () {
                function Common() {
                }
                Common.ConvertToDateTime = function (str, throwException) {
                    if (throwException === void 0) { throwException = true; }
                    return Joove.Common.convertToDateTime(str);
                };
                Common.ConvertToInt = function (str, throwException) {
                    if (throwException === void 0) { throwException = true; }
                    return Joove.Common.convertToNumber(str);
                };
                Common.ConvertToDouble = function (str, throwException) {
                    if (throwException === void 0) { throwException = true; }
                    return Joove.Common.convertToNumber(str);
                };
                Common.ConvertToGuid = function (str, throwException) {
                    if (throwException === void 0) { throwException = true; }
                    return System.Guid.Parse(str);
                };
                Common.ConvertToDecimal = function (str, throwException) {
                    if (throwException === void 0) { throwException = true; }
                    return Joove.Common.convertToNumber(str);
                };
                Common.ConvertToLong = function (str, throwException) {
                    if (throwException === void 0) { throwException = true; }
                    return Joove.Common.convertToNumber(str);
                };
                Common.Base64Decode = function (base64EncodedData) {
                    return decodeURIComponent(window.escape(window.atob(base64EncodedData)));
                };
                Common.Base64Encode = function (base64EncodedData) {
                    return window.btoa(window.unescape(encodeURIComponent(base64EncodedData)));
                };
                Common.GetMD5Hash = function (data) {
                    throw new System.Exceptions.NotImplementedException("GetMD5: Not Implemented yet!");
                };
                Common.IsTypePrimitiveOrSimple = function (data) {
                    throw new System.Exceptions.NotImplementedException("IsTypePrimitiveOrSimple: Not Implemented yet!");
                };
                Common.IsTypeCollection = function (data) {
                    throw new System.Exceptions.NotImplementedException("IsTypeCollection: Not Implemented yet!");
                };
                Common.IsPropertyPrimitiveOrSimple = function (data) {
                    throw new System.Exceptions.NotImplementedException("IsPropertyPrimitiveOrSimple: Not Implemented yet!");
                };
                Common.IsPropertyCollection = function (data) {
                    throw new System.Exceptions.NotImplementedException("IsPropertyCollection: Not Implemented yet!");
                };
                return Common;
            }());
            Utilities.Common = Common;
        })(Utilities = Framework.Utilities || (Framework.Utilities = {}));
        var Data;
        (function (Data) {
            var DataManager = /** @class */ (function () {
                function DataManager() {
                }
                DataManager.IsPropertyDirty = function (obj, property) {
                    var session = MiniSessionManager.Instance.Session;
                    throw new System.Exceptions.NotImplementedException("IsPropertyDirty: Not Implemented yet!");
                };
                return DataManager;
            }());
            Data.DataManager = DataManager;
            var MiniSessionManager = /** @class */ (function () {
                function MiniSessionManager() {
                }
                MiniSessionManager.prototype.OpenSession = function () {
                    throw new System.Exceptions.NotImplementedException("OpenSession: Not Implemented yet!");
                };
                ;
                MiniSessionManager.prototype.OpenSessionWithTransaction = function () {
                    throw new System.Exceptions.NotImplementedException("OpenSessionWithTransaction: Not Implemented yet!");
                };
                MiniSessionManager.prototype.BeginTransaction = function () {
                    throw new System.Exceptions.NotImplementedException("BeginTransaction: Not Implemented yet!");
                };
                MiniSessionManager.prototype.CommitChanges = function (exception) {
                    if (exception === void 0) { exception = null; }
                    throw new System.Exceptions.NotImplementedException("CommitChanges: Not Implemented yet!");
                };
                MiniSessionManager.prototype.Dispose = function () {
                    throw new System.Exceptions.NotImplementedException("BeginTransaction: Not Implemented yet!");
                };
                MiniSessionManager.prototype.ExecuteInTransaction = function (func) {
                    throw new System.Exceptions.NotImplementedException("BeginTransaction: Not Implemented yet!");
                };
                return MiniSessionManager;
            }());
            Data.MiniSessionManager = MiniSessionManager;
        })(Data = Framework.Data || (Framework.Data = {}));
        var Number;
        (function (Number) {
            function Equal(left, right) {
                var lvalue = Joove.Common.nullSafe(left, null);
                var rvalue = Joove.Common.nullSafe(right, null);
                return lvalue == rvalue;
            }
            Number.Equal = Equal;
            function NotEqual(left, right) {
                var lvalue = Joove.Common.nullSafe(left, null);
                var rvalue = Joove.Common.nullSafe(right, null);
                return lvalue != rvalue;
            }
            Number.NotEqual = NotEqual;
            function LessThan(left, right) {
                var lvalue = Joove.Common.nullSafe(left, null);
                var rvalue = Joove.Common.nullSafe(right, null);
                return lvalue < rvalue;
            }
            Number.LessThan = LessThan;
            function GreaterThan(left, right) {
                var lvalue = Joove.Common.nullSafe(left, null);
                var rvalue = Joove.Common.nullSafe(right, null);
                return lvalue > rvalue;
            }
            Number.GreaterThan = GreaterThan;
            function LessThanOrEqual(left, right) {
                var lvalue = Joove.Common.nullSafe(left, null);
                var rvalue = Joove.Common.nullSafe(right, null);
                return CLMS.Framework.Number.Equal(left, right) || lvalue <= rvalue;
            }
            Number.LessThanOrEqual = LessThanOrEqual;
            function GreaterThanOrEqual(left, right) {
                var lvalue = Joove.Common.nullSafe(left, null);
                var rvalue = Joove.Common.nullSafe(right, null);
                return CLMS.Framework.Number.Equal(left, right) || lvalue >= rvalue;
            }
            Number.GreaterThanOrEqual = GreaterThanOrEqual;
        })(Number = Framework.Number || (Framework.Number = {}));
    })(Framework = CLMS.Framework || (CLMS.Framework = {}));
})(CLMS || (CLMS = {}));
var Joove;
(function (Joove) {
    var Placement;
    (function (Placement) {
        Placement[Placement["TOP"] = 0] = "TOP";
        Placement[Placement["TOP_RIGHT"] = 1] = "TOP_RIGHT";
        Placement[Placement["TOP_LEFT"] = 2] = "TOP_LEFT";
        Placement[Placement["RIGHT"] = 3] = "RIGHT";
        Placement[Placement["LEFT"] = 4] = "LEFT";
        Placement[Placement["BOTTOM_RIGHT"] = 5] = "BOTTOM_RIGHT";
        Placement[Placement["BOTTOM_LEFT"] = 6] = "BOTTOM_LEFT";
        Placement[Placement["BOTTOM"] = 7] = "BOTTOM";
    })(Placement = Joove.Placement || (Joove.Placement = {}));
    var MambaDataType;
    (function (MambaDataType) {
        MambaDataType[MambaDataType["COLLECTION"] = 0] = "COLLECTION";
        MambaDataType[MambaDataType["DICTIONARY"] = 1] = "DICTIONARY";
        MambaDataType[MambaDataType["FUNC"] = 2] = "FUNC";
        MambaDataType[MambaDataType["COLLECTIONBASE"] = 3] = "COLLECTIONBASE";
        MambaDataType[MambaDataType["STRING"] = 4] = "STRING";
        MambaDataType[MambaDataType["BOOL"] = 5] = "BOOL";
        MambaDataType[MambaDataType["INT"] = 6] = "INT";
        MambaDataType[MambaDataType["DOUBLE"] = 7] = "DOUBLE";
        MambaDataType[MambaDataType["DECIMAL"] = 8] = "DECIMAL";
        MambaDataType[MambaDataType["FLOAT"] = 9] = "FLOAT";
        MambaDataType[MambaDataType["LONG"] = 10] = "LONG";
        MambaDataType[MambaDataType["DATETIME"] = 11] = "DATETIME";
        MambaDataType[MambaDataType["CHAR"] = 12] = "CHAR";
        MambaDataType[MambaDataType["GUID"] = 13] = "GUID";
        MambaDataType[MambaDataType["BYTE"] = 14] = "BYTE";
        MambaDataType[MambaDataType["OBJECT"] = 15] = "OBJECT";
        MambaDataType[MambaDataType["RUNTIMETYPE"] = 16] = "RUNTIMETYPE";
        MambaDataType[MambaDataType["RUNTIMEPROPERTY"] = 17] = "RUNTIMEPROPERTY";
        MambaDataType[MambaDataType["EXCEPTION"] = 18] = "EXCEPTION";
        MambaDataType[MambaDataType["TIMESPAN"] = 19] = "TIMESPAN";
        MambaDataType[MambaDataType["BUSINESSEXCEPTION"] = 20] = "BUSINESSEXCEPTION";
        MambaDataType[MambaDataType["NUMBER"] = 21] = "NUMBER";
    })(MambaDataType = Joove.MambaDataType || (Joove.MambaDataType = {}));
    var nextUniqueId = (function () {
        var currentId = 1;
        return function () { return (currentId++); };
    })();
    var Logger = /** @class */ (function () {
        function Logger() {
        }
        Logger.info = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            CLMS.Framework.Utilities.DebugHelper.Instance().Info(args);
        };
        Logger.debug = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            CLMS.Framework.Utilities.DebugHelper.Instance().Debug(args);
        };
        Logger.error = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            CLMS.Framework.Utilities.DebugHelper.Instance().Error(args);
        };
        return Logger;
    }());
    Joove.Logger = Logger;
    var Comparator = /** @class */ (function () {
        function Comparator() {
        }
        Comparator.DeepEqual = function (left, right, skipProperty) {
            if (skipProperty === void 0) { skipProperty = null; }
            if (left === right)
                return true;
            var arrLeft = Array.isArray(left);
            var arrRight = Array.isArray(right);
            if (arrLeft != arrRight) {
                Joove.Logger.info("Array is not equal", left, right);
                return false;
            }
            if (arrLeft && arrLeft) {
                var length_1 = left.length;
                if (length_1 != right.length) {
                    return false;
                }
                for (var i = 0; i < length_1; i++) {
                    if (!Comparator.DeepEqual(left[i], right[i], skipProperty)) {
                        Joove.Logger.info("Array is not equal", left[i], right[i]);
                        return false;
                    }
                }
                return true;
            }
            var dateLeft = left instanceof Date;
            var dateRight = right instanceof Date;
            if (dateLeft != dateRight)
                return false;
            if (dateLeft && dateRight)
                return left.getTime() == right.getTime();
            var regexpLeft = left instanceof RegExp;
            var regexpRight = right instanceof RegExp;
            if (regexpLeft != regexpRight)
                return false;
            if (regexpLeft && regexpRight)
                return left.toString() == right.toString();
            if (left instanceof Object && right instanceof Object) {
                var keys = Object.keys(left);
                var length_2 = keys.length;
                if (length_2 !== Object.keys(right).length) {
                    Joove.Logger.info("Object is not equal", left, right);
                    return false;
                }
                for (var i = 0; i < length_2; i++) {
                    if (!Object.prototype.hasOwnProperty.call(right, keys[i])) {
                        Joove.Logger.info("Property is missing", right, keys[i]);
                        return false;
                    }
                }
                for (var i = 0; i < length_2; i++) {
                    var key = keys[i];
                    if (skipProperty != null && skipProperty(key)) {
                        continue;
                    }
                    if (!Comparator.DeepEqual(left[key], right[key], skipProperty)) {
                        Joove.Logger.info("Object is not equal", left[key], right[key]);
                        return false;
                    }
                }
                return true;
            }
            return false;
        };
        Comparator.IsEqual = function (left, right, type) {
            switch (type) {
                case "bool":
                case "int":
                case "float":
                case "double":
                case "decimal":
                case "char":
                    return String(left) === String(right);
                default:
                    return left == right;
            }
        };
        return Comparator;
    }());
    Joove.Comparator = Comparator;
    var Common = /** @class */ (function () {
        function Common() {
        }
        Common.safeDeepPropertySet = function (obj, key, val) {
            var keys = typeof key === "string" ? key.split('.') : key;
            var i = 0, l = keys.length, t = obj, x;
            for (; i < l; ++i) {
                x = t[keys[i]];
                t = t[keys[i]] = (i === l - 1 ? val : (x == null ? {} : x));
            }
        };
        Common.safeDeepPropertyAccess = function (obj, key, def) {
            var p = 0;
            var keys = key.split ? key.split('.') : key;
            while (obj && p < keys.length)
                obj = obj[keys[p++]];
            return obj === undefined ? def : obj;
        };
        Common.project = function (model, schema, indexes, iteration, ifEmptyFetchAll) {
            if (indexes === void 0) { indexes = null; }
            if (iteration === void 0) { iteration = null; }
            if (ifEmptyFetchAll === void 0) { ifEmptyFetchAll = false; }
            if (model == null || schema == null) {
                return null;
            }
            if (Common.valueIsPrimitive(model)) {
                return model;
            }
            var projectedModel = {};
            var projectSubset = false;
            if (indexes != null) {
                if (iteration == null)
                    iteration = 0;
                projectSubset = true;
            }
            if (ifEmptyFetchAll === true) {
                if (Common.isEmptyObject(schema)) {
                    return model;
                }
            }
            for (var prop in schema) {
                if (model[prop] === undefined || schema[prop] === null) {
                    continue;
                }
                if (model[prop] == null) {
                    projectedModel[prop] = null;
                    continue;
                }
                if (Common.isArray(model[prop])) {
                    var newArr = [];
                    for (var c = 0; c < model[prop].length; c++) {
                        if (projectSubset == false || c == indexes[iteration]) {
                            newArr.push(Common.project(model[prop][c], schema[prop], indexes, iteration + 1, ifEmptyFetchAll));
                        }
                    }
                    projectedModel[prop] = newArr;
                }
                else if (Common.valueIsObject(model[prop])) {
                    projectedModel[prop] = Common.project(model[prop], schema[prop], indexes, iteration, ifEmptyFetchAll);
                }
                else {
                    projectedModel[prop] = model[prop];
                }
            }
            return projectedModel;
        };
        Common.isEmptyObject = function (obj) {
            for (var prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                    return false;
                }
            }
            return true;
        };
        Common.dateDiff = function (date1, date2) {
            var momentDate1 = moment(date1);
            var momentDate2 = moment(date2);
            return new System.Time.TimeSpan(momentDate1.diff(momentDate2));
        };
        Common.stringContains = function (str, otherStr, caseInsensitive) {
            if (caseInsensitive === void 0) { caseInsensitive = true; }
            return caseInsensitive
                ? str.toLowerCase().indexOf(otherStr.toLowerCase()) !== -1
                : str.indexOf(otherStr) !== -1;
        };
        Common.stringIsNullOrEmpty = function (str) {
            return str == null || str === "";
        };
        Common.stringEndsWith = function (str, suffix) {
            return str.indexOf(suffix, this.length - suffix.length) !== -1;
        };
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
        Common.decimalAdjust = function (type, value, exp) {
            // If the exp is undefined or zero...
            if (typeof exp === 'undefined' || +exp === 0) {
                return Math[type](value);
            }
            value = +value;
            exp = +exp;
            // If the value is not a number or the exp is not an integer...
            if (value === null || isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
                return NaN;
            }
            // If the value is negative...
            if (value < 0) {
                return -Common.decimalAdjust(type, -value, exp);
            }
            // Shift
            value = value.toString().split('e');
            value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
            // Shift back
            value = value.toString().split('e');
            return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
        };
        Common.round = function (value, decimals) {
            return Common.decimalAdjust("round", value, decimals);
        };
        Common.ceil = function (value, decimals) {
            return Common.decimalAdjust("ceil", value, decimals);
        };
        Common.floor = function (value, decimals) {
            return Common.decimalAdjust("floor", value, decimals);
        };
        Common.sign = function (x) {
            return (Number(x > 0) - Number(x < 0)) || +x;
        };
        Common.createDate = function (year, month, day, hours, minutes, seconds) {
            var date = new Date();
            date.setFullYear(year, month, day);
            if (hours != null) {
                date.setHours(hours);
            }
            if (minutes != null) {
                date.setMinutes(minutes);
            }
            if (seconds != null) {
                date.setSeconds(seconds);
            }
            return date;
        };
        Common.createEvent = function (eventName) {
            if (typeof (Event) === 'function') { //For normal browsers
                return new Event(eventName);
            }
            else {
                //For retarded IE
                var event = document.createEvent('Event');
                event.initEvent(eventName, true, true);
                return event;
            }
        };
        Common.isVisibleOnViewPort = function (element) {
            var windowWidth = window.innerWidth;
            var windowHeight = window.innerHeight;
            var elementRectangle = element.get(0).getBoundingClientRect();
            if (elementRectangle.left < windowHeight - elementRectangle.width) {
            }
            else {
            }
            return null;
        };
        Common.toggleDebugMode = function (enable) {
            localStorage.setItem("__debug", enable + "");
        };
        Common.isInDebugMode = function () {
            return localStorage.getItem("__debug") == "true";
        };
        Common.getMatch = function (verbalExpression, input, defaultValue) {
            if (defaultValue === void 0) { defaultValue = null; }
            try {
                var result = verbalExpression.exec(input);
                if (result && result.length > 0) {
                    return result[0];
                }
                if (defaultValue) {
                    return defaultValue;
                }
                return null;
            }
            catch (e) {
                if (defaultValue) {
                    return defaultValue;
                }
                console.error(e);
            }
        }; //end getMatch()
        Common.getMatches = function (verbalExpression, input, defaultValues) {
            if (defaultValues === void 0) { defaultValues = null; }
            try {
                var matches = input.match(verbalExpression);
                if (matches && matches.length > 0) {
                    return matches;
                }
                if (defaultValues) {
                    return defaultValues;
                }
                return null;
            }
            catch (e) {
                if (defaultValues) {
                    return defaultValues;
                }
                console.error(e);
            }
        }; //end getMatches()		
        Common.isValidEmail = function (str) {
            if (str == null)
                return false;
            var re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            return re.test(str);
        };
        Common.isValidUrl = function (str) {
            if (str == null)
                return false;
            var pattern = new RegExp("^" +
                // protocol identifier
                "(?:(?:https?|ftp)://)" +
                // user:pass authentication
                "(?:\\S+(?::\\S*)?@)?" +
                "(?:" +
                // IP address exclusion
                // private & local networks
                "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
                "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
                "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
                // IP address dotted notation octets
                // excludes loopback network 0.0.0.0
                // excludes reserved space >= 224.0.0.0
                // excludes network & broacast addresses
                // (first & last IP address of each class)
                "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
                "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
                "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
                "|" +
                // host name
                "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
                // domain name
                "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
                // TLD identifier
                "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
                // TLD may end with dot
                "\\.?" +
                ")" +
                // port number
                "(?::\\d{2,5})?" +
                // resource path
                "(?:[/?#]\\S*)?" +
                "$", "i");
            if (!pattern.test(str)) {
                return false;
            }
            else {
                return true;
            }
        };
        Common.modelToJson = function (input) {
            //var model = JSON.parse(input.replace(/&quot;/g, '"').replace(/\0/g, "").replace(/\r\n/g, "\\n").replace(/\n/g, "\\n").replace(/\\/g, "\\\\"));
            var model = JSON.parse(input);
            //return Cycles.reconstructObject(model);
            return model;
        };
        Common.cloneObject = function (originalObject) {
            if (originalObject == null)
                return null;
            if (Common.valueIsObject(originalObject) === false)
                return originalObject;
            // Based on:
            // https://github.com/cronvel/tree-kit/blob/master/lib/clone.js
            // (MIT licence)
            // First create an empty object with
            // same prototype of our original source
            var propertyIndex, descriptor, keys, current, nextSource, indexOf;
            var copies = [{ source: originalObject, target: Object.create(Object.getPrototypeOf(originalObject)) }];
            var cloneObject = copies[0].target;
            var sourceReferences = [originalObject];
            var targetReferences = [cloneObject];
            // First in, first out
            while ((current = copies.shift())) // jshint ignore:line
             {
                keys = Object.getOwnPropertyNames(current.source);
                for (propertyIndex = 0; propertyIndex < keys.length; propertyIndex++) {
                    // Save the source's descriptor
                    descriptor = Object.getOwnPropertyDescriptor(current.source, keys[propertyIndex]);
                    if (!descriptor.value || Common.valueIsObject(descriptor.value) === false) {
                        Object.defineProperty(current.target, keys[propertyIndex], descriptor);
                        continue;
                    }
                    nextSource = descriptor.value;
                    descriptor.value = Array
                        .isArray(nextSource)
                        ? []
                        : Object.create(Object.getPrototypeOf(nextSource));
                    indexOf = sourceReferences.indexOf(nextSource);
                    if (indexOf !== -1) {
                        // The source is already referenced, just assign reference
                        descriptor.value = targetReferences[indexOf];
                        Object.defineProperty(current.target, keys[propertyIndex], descriptor);
                        continue;
                    }
                    sourceReferences.push(nextSource);
                    targetReferences.push(descriptor.value);
                    Object.defineProperty(current.target, keys[propertyIndex], descriptor);
                    copies.push({ source: nextSource, target: descriptor.value });
                }
            }
            return cloneObject;
        };
        Common.valueIsObject = function (value) {
            return typeof value === "object" &&
                value !== null &&
                ((value instanceof Boolean) === false) &&
                ((value instanceof Date) === false) &&
                ((value instanceof Number) === false) &&
                ((value instanceof RegExp) === false) &&
                ((value instanceof String) === false);
        };
        Common.valueIsPrimitive = function (value) {
            return !Common.valueIsObject(value) && !Common.isArray(value);
        };
        Common.setKeyAsClientKey = function (obj) {
            if (obj == null || obj._clientKey != null || obj._key == null)
                return;
            obj._clientKey = obj._key;
        };
        Common.objectsAreEqual = function (objA, objB, typeCheck) {
            Common.setKeyAsClientKey(objA);
            Common.setKeyAsClientKey(objB);
            // Type Check
            if (typeCheck === true && objA != null && objB != null && objA._typeHash != objB._typeHash)
                return false;
            // Simple value equality
            if (objA === objB)
                return true;
            //handle case where one is null and other is undefined
            if ((objA == null || objA == undefined) && (objB == null || objB == undefined))
                return true;
            // Client Key equality
            if ((objA != null && objB != null) &&
                (objA._clientKey || objB._clientKey) &&
                objB._clientKey === objA._clientKey)
                return true;
            // One of objects null, other not null
            if (objA == null || objB == null)
                return false;
            // Key equality
            if (typeof (objB._key) != "undefined" &&
                Common.keyHasDefaultValue(objA._key) === false &&
                objB._key === objA._key)
                return true;
            // Angular $$haskey equality
            if (typeof (objB.$$hashKey) != "undefined" && objB.$$hashKey === objA.$$hashKey)
                return true;
            return false;
        };
        Common.getClassInstanceKey = function (instance) {
            if (instance["_originalTypeClassName"] == null) {
                return null;
            }
            var key = instance["_originalTypeClassName"];
            if (instance["_clientKey"] != null) {
                return key + "_" + instance["_clientKey"];
            }
            if (instance["_key"] == null || instance["_key"] == 0 || instance["_key"] == "") {
                return null;
            }
            return key + "_" + instance["_key"];
        };
        Common.collectionsAreEqual = function (collectionA, collectionB) {
            // Both null
            if (collectionA == null && collectionB == null)
                return true;
            // One  null, other not null
            if ((collectionA == null && collectionB != null) || (collectionA != null && collectionB == null))
                return false;
            // Different Length, impossible to be equal
            if (collectionA.length != collectionB.length)
                return false;
            for (var i = 0; i < collectionA.length; i++) {
                if (Common.objectsAreEqual(collectionA[i], collectionB[i]) === false)
                    return false;
            }
            return true;
        };
        Common.updateInstanceReferencesAccrossModel = function (obj) {
            var reconstructor = new Joove.ReferencesReconstructor();
            reconstructor.addFreshInstance(obj);
            reconstructor.reconstructReferences(window.$form.model);
        };
        Common.updateManyInstanceReferencesAccrossModel = function (obj) {
            var reconstructor = new Joove.ReferencesReconstructor();
            reconstructor.addFreshArrayOfInstances(obj);
            reconstructor.reconstructReferences(window.$form.model);
        };
        Common.replaceAll = function (value, search, replacement) {
            return value == null
                ? null
                : value.split(search).join(replacement);
        };
        Common.getDirectiveScope = function ($element) {
            var id = $element.data("jb-directive-id");
            return window["directive_" + id];
        };
        Common.setDirectiveScope = function ($element, directiveScope) {
            var id = nextUniqueId();
            window["directive_" + id] = directiveScope;
            $element.data("jb-directive-id", id);
        };
        Common.directiveScopeIsReady = function ($element) {
            return $element.data("jb-ready") === true;
        };
        Common.markDirectiveScopeAsReady = function ($element) {
            return $element.data("jb-ready", true);
        };
        Common.markDirectiveScopeAsNotReady = function ($element) {
            return $element.data("jb-ready", false);
        };
        Common.parentGridsAreReady = function ($element) {
            var $grids = $element.parents("[jb-type='Grid']");
            for (var i = 0; i < $grids.length; i++) {
                var $grid = $grids.eq(0);
                if (Common.directiveScopeIsReady($grid) === false)
                    return false;
            }
            return true;
        };
        Common.getContextFromElement = function ($element) {
            var context = [];
            var parentsString = $element.attr("data-context-items");
            if (parentsString == null || parentsString.trim() == "")
                return context;
            var parentNames = parentsString.split(",");
            var $scope = angular.element($element.get(0)).scope();
            for (var i = 0; i < parentNames.length; i++) {
                context.push($scope[parentNames[i]]);
            }
            return context;
        };
        Common.getRepeatersOfElement = function ($element) {
            var selector = "[ng-repeat], [ng-repeat-start], [ng-repeat-end]";
            //Best case scenario: simple list (one row per record). The data is just between the repeaters
            var $repeaters = $element.parents(selector);
            if ($repeaters.length !== 0) {
                return $repeaters;
            }
            //Worst case scenario: multiple rows per record. The data might be hidden between the repeaters (imagine a table that has 5 rows per a "for-each" statement, designed by the user
            //The "$element.parents()" won't work as easily here. We'll need to fly to the start of the dataset and get the repeaters from the subsequent siblings
            $repeaters = $element.parents('[jb-original-collection]').siblings(selector);
            return $repeaters;
        };
        Common.getFullBindingPathOfControl = function ($element, relativePathStr) {
            var relativePath = relativePathStr.split(".");
            if (relativePath[0] === "model") {
                return relativePathStr;
            }
            // itemName: { positionInCollection: number, collectionName: string }
            var parents = {};
            var $parentContainers = Common.getRepeatersOfElement($element);
            //create structure for parent repeating elements
            $parentContainers.each(function (index, item) {
                var ngRepeatValue = $(item).attr("ng-repeat") || $(item).attr("ng-repeat-start") || $(item).attr("ng-repeat-end");
                var parts = ngRepeatValue.split(" in ");
                if (parts.length !== 2) {
                    alert("getFullBindingPathOfControl: unexpeted syntax of ng-repeat");
                    return false;
                }
                var repeatedItemName = parts[0].trim();
                if (repeatedItemName == "") {
                    alert("getFullBindingPathOfControl: unexpeted syntax of ng-repeat");
                    return false;
                }
                var expression = $(item).attr("jb-original-collection");
                if (expression == null || expression.trim() == "") {
                    alert("getFullBindingPathOfControl: could not find the 'jb-original-collection' attribute");
                    return false;
                }
                parents[repeatedItemName] = {
                    collectionName: expression,
                    positionInCollection: $(item).attr("data-context-index")
                };
            });
            //fix relative paths of parents
            for (var i in parents) {
                if (parents.hasOwnProperty(i)) {
                    var pathInfo = parents[i];
                    pathInfo.collectionName = Common.fixBindingPath(parents, pathInfo.collectionName);
                }
            }
            return Common.fixBindingPath(parents, relativePathStr);
        };
        Common.fixBindingPath = function (parents, pathStr) {
            var path = pathStr.split(".");
            var start = path[0];
            if (start === "model") {
                return pathStr;
            }
            path.splice(0, 1);
            var parent = parents[start];
            if (parent == null) {
                alert("getFullBindingPathOfControl: I didn't find parent element");
                return null;
            }
            var part0 = parent.collectionName + "[" + parent.positionInCollection + "]";
            return part0 + "." + path.join(".");
        };
        Common.getAction = function (actionName, masterPage) {
            if (masterPage === void 0) { masterPage = false; }
            var defaultAction = function () { return null; };
            if (actionName == null || actionName.trim() == "") {
                return defaultAction;
            }
            var scope = null;
            if (masterPage === true) {
                scope = Common.getMasterScope();
            }
            else {
                scope = Common.getScope();
            }
            if (scope == null) {
                console.error("Could not find the required scope!");
                return defaultAction;
            }
            return scope.actions[actionName];
            //let action = Common.getScope().actions[actionName];
            //if (masterPage && action == null) {
            //    action = Common.getMasterScope().actions[actionName];
            //}
            //return action;
        };
        // Todo
        Common.executeAction = function (actionName) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var action = Common.getAction(actionName, true);
            if (action == null) {
                console.error("Action '" + actionName + "' not found");
                return;
            }
            //Array.prototype.splice.call(args, 0, 1);
            action.apply(null, args);
        };
        Common.executeEventCallback = function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var action = Common.getScope().eventCallbacks[name];
            if (action == null) {
                action = Common.getMasterScope().eventCallbacks[name];
            }
            if (action == null) {
                console.error("Event callback '" + name + "' not found");
                return;
            }
            Array.prototype.splice.call(args, 0, 1);
            action.apply(null, args);
        };
        Common.getScope = function () {
            return window["scope_" + window._context.currentController];
        };
        Common.getModel = function () {
            return Common.getScope().model;
        };
        Common.getMasterScope = function () {
            return window["scope_" + window._context.currentMasterPageController];
        };
        Common.getMasterModel = function () {
            return Common.getMasterScope().model;
        };
        Common.serializeIndexes = function (indexes) {
            var indexKey = "";
            for (var j = 0; j < indexes.length; j++) {
                indexKey += indexes[j] + "_";
            }
            if (indexKey === "") {
                indexKey = "_";
            }
            return indexKey;
        };
        Common.getContextItemElement = function ($el) {
            return $el.closest("[data-context-index]");
        };
        Common.getIndexesOfControl = function ($control) {
            var $context = $control.parents("[data-context-index]").toArray();
            if ($control.attr("data-context-index") != null) {
                $context.unshift($control);
            }
            var indexes = [];
            var indexKey = "";
            for (var j = 0; j < $context.length; j++) {
                var index = parseInt($($context[j]).attr("data-context-index"));
                if (isNaN(index)) {
                    indexes = null;
                    indexKey = null;
                    break;
                }
                indexes.push(index);
                indexKey += index + "_";
            }
            return { indexes: indexes, key: indexKey };
        };
        Common.getContextOfControl = function ($control) {
            var $context = $control.parents("[data-context-index]").toArray();
            if ($control.attr("data-context-index") != null) {
                $context.unshift($control);
            }
            var context = {};
            for (var j = 0; j < $context.length; j++) {
                var itemName = $($context[j]).attr("data-context-item");
                var scope = angular.element($context[j]).scope()[itemName];
                context[itemName] = scope;
            }
            return context;
        };
        Common.getIndexKeyOfControl = function ($control) {
            var indexes = Joove.Common.getIndexesOfControl($control);
            return indexes == null ? null : indexes.key;
        };
        Common.toHTML = function (value) {
            if (value == null)
                return value;
            try {
                var parser = new DOMParser;
                var dom = parser.parseFromString(value, "text/html");
                if (dom.body.textContent === "null")
                    return value;
                return dom.body.textContent;
            }
            catch (e) {
                console.error("Failed to parse value as HTML");
                return value;
            }
        };
        Common.formatNumber = function (value, format) {
            return numeral(value).format(format);
        };
        Common.formatDate = function (value, format) {
            //format = format.toUpperCase();
            var momentDate = moment(value);
            return momentDate.isValid()
                ? momentDate.format(format)
                : "";
        };
        Common.getUtcDateFromRawString = function (rawValue, fullFormat, setToMidday) {
            if (rawValue == null || rawValue.trim() === "" || rawValue === "Invalid date") {
                return null;
            }
            else {
                var localTime = moment(rawValue, fullFormat);
                if (setToMidday === true) {
                    localTime.set("hours", 12);
                    localTime.set("minutes", 0);
                }
                var utcTime = moment.utc(localTime);
                return utcTime.toDate();
            }
        };
        Common.getDateStringFromUtc = function (value, fullFormat) {
            if (value == null) {
                return "";
            }
            else {
                var utcTime = moment.utc(value).toDate();
                var localTime = moment(utcTime);
                return localTime.format(fullFormat);
            }
        };
        Common.trackObject = function (obj) {
            if (Common.valueIsObject(obj) === false || obj == null)
                return obj;
            if (obj._clientKey == null) {
                obj._clientKey = (nextUniqueId() * -1);
            }
            return obj._clientKey;
        };
        // todo: extend this method with more cases
        Common.eventPreventsDefaultFormAction = function (e) {
            var $target = $(e.target);
            if (window._popUpManager.popUpVisible || (window._popUpManager.isLoading))
                return;
            if ($target.context != null) {
                var tagName = $target.context.tagName.toLowerCase();
                if ((tagName == "trix-editor") ||
                    (tagName == "textarea") ||
                    (tagName == "button" && e.which === 13)) {
                    return true;
                }
            }
            if ($target.parent().hasClass("chosen-search")) { // chosen select search active
                $target.blur();
                return true;
            }
            if ($target.hasClass("quick-filter")) {
                return false;
            }
            return false;
        };
        Common.setControlKeyPressed = function (e, duration) {
            window["ctrlPressed"] = e != null && e.ctrlKey;
            setTimeout(function () {
                window["ctrlPressed"] = false;
            }, 1000);
        };
        Common.controlKeyWasPressed = function () {
            return window["ctrlPressed"] === true;
        };
        Common.setLastClickedElement = function (e) {
            window["lastClickedElement"] = e == null || e.target == null ? null : e.target;
        };
        Common.getLastClickedElement = function () {
            return window["lastClickedElement"];
        };
        Common.detectBrowser = function () {
            var isOpera = !!window.opera || navigator.userAgent.indexOf(" OPR/") >= 0;
            // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
            var isFirefox = typeof window.InstallTrigger !== "undefined"; // Firefox 1.0+
            var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor") > 0;
            // At least Safari 3+: "[object HTMLElementConstructor]"
            var isChrome = !!window.chrome && !isOpera; // Chrome 1+
            var isInternetExplorer = /*@cc_on!@*/ false || !!document.documentMode; // At least IE6
            if (isOpera)
                return "Opera";
            else if (isFirefox)
                return "Firefox";
            else if (isSafari)
                return "Safari";
            else if (isChrome)
                return "Chrome";
            else if (isInternetExplorer)
                return "IE";
            else
                return "";
        };
        Common.getScrollbarSize = function () {
            var inner = document.createElement("p");
            inner.style.width = "100%";
            inner.style.height = "200px";
            var outer = document.createElement("div");
            outer.style.position = "absolute";
            outer.style.top = "0px";
            outer.style.left = "0px";
            outer.style.visibility = "hidden";
            outer.style.width = "200px";
            outer.style.height = "150px";
            outer.style.overflow = "hidden";
            outer.appendChild(inner);
            document.body.appendChild(outer);
            var w1 = inner.offsetWidth;
            outer.style.overflow = "scroll";
            var w2 = inner.offsetWidth;
            if (w1 === w2)
                w2 = outer.clientWidth;
            document.body.removeChild(outer);
            return (w1 - w2);
        };
        ;
        Common.toJson = function (data) {
            return JSON.parse(data.replace(/'/g, "\"").replace(/[\t\n\r]/g, ""));
        };
        Common.forceNumberFormat = function (number) {
            if (!number)
                return;
            return number.replace(",", ".").trim();
        };
        Common.parseFloat = function (number) {
            var unsafeValue = parseFloat(Common.forceNumberFormat(number));
            if (isNaN(unsafeValue))
                unsafeValue = 0;
            return unsafeValue;
        };
        Common.convertToNumber = function (value) {
            if (value.toLowerCase() === "nan")
                return NaN;
            var num = Number(value);
            return isNaN(num) ? null : num;
        };
        Common.convertToBoolean = function (value) {
            value.toLowerCase();
            return (value === "true" || value === "false") ? value === "true" : null;
        };
        Common.convertToDateTime = function (value) {
            var convertDate = new Date(Date.parse(value));
            if (isNaN(convertDate.getTime()))
                return null;
            return convertDate;
        };
        Common.guessStringMambaDataType = function (value) {
            if (Common.convertToBoolean(value) !== null)
                return MambaDataType.BOOL;
            if (Common.convertToNumber(value) !== null)
                return MambaDataType.NUMBER;
            if (Common.convertToDateTime(value) !== null)
                return MambaDataType.DATETIME;
            return MambaDataType.STRING;
        };
        Common.getMambaDataType = function (type) {
            var localType = type.toUpperCase();
            if (localType === "INT" ||
                localType === "DOUBLE" ||
                localType === "DECIMAL" ||
                localType === "FLOAT" ||
                localType === "LONG" ||
                localType === "BYTE")
                return MambaDataType.NUMBER;
            return MambaDataType[localType];
        };
        /**
         *
         * @param value
         * @param seperators [ groupSep, decimalSep ]
         */
        Common.parseToDecimal = function (value, seperators) {
            if (value == null)
                return null;
            value = value.toString();
            var thousands = seperators[0];
            var decimal = seperators[1];
            var groupMinSize = true ? 3 : 1;
            var pattern = new RegExp("^\\s*([+\-]?(?:(?:\\d{1,3}(?:\\" + thousands + "\\d{" + groupMinSize + ",3})+)|\\d*))(?:\\" + decimal + "(\\d*))?\\s*$");
            var result = value.match(pattern);
            if (!((result != null) && result.length === 3)) {
                return null;
            }
            var integerPart = result[1];
            // const integerPart = result[1].replace(new RegExp("\\" + thousands, 'g'), '');
            var fractionPart = result[2];
            return { integerPart: integerPart, fractionPart: fractionPart };
        };
        /**
         *
         * @param value
         * @param seperators [ groupSep, decimalSep ]
         */
        Common.localizeNumber = function (value, seperators) {
            if (seperators === void 0) { seperators = null; }
            if (value == null)
                return null;
            var rawNumber = value;
            value = value.toString();
            // convert exponential format to 'normal' js number
            if (value != null && (value.indexOf("e") > -1 || value.indexOf("E") > -1)) {
                value = rawNumber.toFixed(20);
            }
            seperators = seperators || [".", ","];
            var decimal = Common.parseToDecimal(value, seperators);
            if (decimal == null) {
                seperators = [",", "."];
                decimal = Common.parseToDecimal(value, seperators);
            }
            if (decimal == null)
                throw { msg: "Number has an invalid format" };
            var integerPart = Common.replaceAll(decimal.integerPart, seperators[0], window._context.groupSeparator);
            if (decimal.fractionPart != null) {
                return "" + integerPart + window._context.decimalSeparator + decimal.fractionPart;
            }
            return "" + integerPart;
        };
        /**
         *
         * @param value
         * @param seperators [ groupSep, decimalSep ]
         */
        Common.delocalizeNumber = function (value, seperators) {
            if (seperators === void 0) { seperators = null; }
            if (value == null)
                return null;
            value = value.toString();
            seperators = seperators || [window._context.groupSeparator, window._context.decimalSeparator];
            var decimal = Common.parseToDecimal(value, seperators);
            if (decimal == null)
                throw { msg: "Number has an invalid format" };
            var integerPart = Common.replaceAll(decimal.integerPart, seperators[0], "");
            if (decimal.fractionPart != null) {
                return integerPart + "." + decimal.fractionPart;
            }
            return "" + integerPart;
        };
        Common.getCurrenctNumberSeperator = function () {
            return [window._context.groupSeparator, window._context.decimalSeparator];
        };
        /**
         *
         * @param value
         * @param seperators [ groupSep, decimalSep ]
         */
        Common.parseToNumber = function (value, seperators, enforceGroupSize) {
            if (seperators === void 0) { seperators = null; }
            if (enforceGroupSize === void 0) { enforceGroupSize = true; }
            if (value == null)
                return null;
            if (typeof value === "number")
                return value;
            value = value.toString();
            seperators = seperators || [window._context.groupSeparator || ".", window._context.decimalSeparator || ","];
            var decimal = Common.parseToDecimal(value, seperators);
            if (decimal == null)
                return 0 / 0;
            var integerPart = decimal.integerPart.replace(new RegExp("\\" + seperators[0], 'g'), '');
            var parsedNumber = parseFloat(integerPart + "." + decimal.fractionPart);
            return parsedNumber;
        };
        Common.autoParse = function (value) {
            var newValue = parseFloat(value);
            if (!isNaN(newValue))
                return newValue;
            if (value === "true")
                return true;
            if (value === "false")
                return false;
            return value;
        };
        Common.setNumberLocalizationSettings = function () {
            if (window["numeral"] == null || numeral["locales"] == null || numeral["locales"]["_custom"] != null)
                return;
            numeral["register"]("locale", "_custom", {
                delimiters: {
                    thousands: window._context.groupSeparator,
                    decimal: window._context.decimalSeparator
                },
                abbreviations: {
                    thousand: "k",
                    million: "m",
                    billion: "b",
                    trillion: "t"
                },
                ordinal: function (number) {
                    return number === 1 ? "st" : "nd";
                },
                currency: {
                    symbol: "€"
                }
            });
            numeral["locale"]("_custom");
        };
        Common.isArray = function (instance) {
            return instance != null && instance.constructor === Array && instance.length != null;
        };
        Common.safeNumber = function (num) {
            if (num === undefined) {
                return 0;
            }
            return num;
        };
        Common.nullSafe = function (expr, deffaultValue) {
            try {
                return expr();
            }
            catch (e) {
                if (window._context.mode !== "Production") {
                    console.warn("Expression '" + expr + "' throws null point exception");
                }
                return deffaultValue;
            }
        };
        Common.autocompleteFix = function () {
            if ($("input[type='password'][ng-model]").length === 0) {
                return;
            }
            var inputs = [];
            inputs.push.apply(inputs, $("input[type='password'][ng-model]"));
            inputs.push.apply(inputs, $("input[jb-type='TextBox'][ng-model]"));
            var check = function (input) {
                var $input = $(input);
                var model = $input.attr("ng-model");
                var expression = model.replace("model.", "Joove.Common.getModel().");
                try {
                    if (eval(expression) !== $input.val()) {
                        eval(expression + " = '" + $input.val() + "'");
                    }
                }
                catch (e) {
                    console.warn("Autocomplete error!", e);
                }
            };
            for (var i = 0; i < inputs.length; i++) {
                check(inputs[i]);
            }
        };
        Common.createRandomId = function (length) {
            length = length || 5;
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < length; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        };
        Common.digestScope = function (scope) {
            if (scope == null)
                scope = Common.getScope();
            if (!scope.$$phase && (scope.$root != null && !scope.$root.$$phase)) {
                scope.$digest();
            }
        };
        Common.requireScript = function (id, src, callback) {
            return window._scriptLoader.requireScript(id, src, callback);
        };
        Common.usePDFMaker = function (options) {
            if (window._scriptLoader.isScriptLoaded("pdfmake")) {
                pdfMake.createPdf(options.dd).download(options.filename);
            }
            else {
                Common.loadPdfMakeDependencies(options)
                    .then(function () {
                    if (options.tableLayouts) {
                        pdfMake.tableLayouts = options.tableLayouts;
                    }
                    Common.usePDFMaker(options);
                });
            }
        };
        Common.loadPdfMakeDependencies = function (options) {
            var src = window._context.siteRoot + "/Scripts/Third-Party/pdfmaker";
            return Common.requireScript("pdfmake", src + "/pdfmake.min.js")
                .then(function () {
                return Common.requireScript("vfs_fonts", src + "/vfs_fonts.js");
            }).then(function () {
                return true;
            });
        };
        Common.loadJsPdfDependencies = function (options) {
            var src = window._context.siteRoot + "/Scripts/Third-Party/jspdf";
            Common.requireScript("jsPDF", src + "/jspdf.min.js", function () {
                Common.requireScript("html2pdf", src + "/html2pdf.js", function () {
                    Common.exportToPdf(options);
                });
            });
        };
        Common.exportToPdfUsePrintMedia = function (target, options) {
            var doc = new jsPDF("p", "pt", "letter");
            $(".jb-modal-overlay").show();
            html2pdf(target, doc, function (pdf) {
                pdf.save(options.filename);
                $(".jb-modal-overlay").hide();
            });
        };
        Common.exportToPdf = function (options) {
            $(".jb-modal-overlay").show();
            if (window["jsPDF"] == null) {
                Common.loadJsPdfDependencies(options);
            }
            else {
                var target = options.$element || $("body");
                if (options.usePrintMedia) {
                    Common.exportToPdfUsePrintMedia(target, options);
                    return;
                }
                var width = target.width();
                var height = target.height();
                var bgColor_1 = "rgba(0, 0, 0, 0)";
                if (options.$element != null) {
                    bgColor_1 = options.$element.css("background-color");
                    if (options.$element.css("background-color") === "rgba(0, 0, 0, 0)") {
                        options.$element.css("background-color", $("body").css("background-color"));
                    }
                }
                var doc = new jsPDF({
                    orientation: "portrait",
                    format: "custom",
                    unit: "pt",
                    pageWidth: width,
                    pageHeight: height
                });
                // hide before adding body
                $(".jb-modal-overlay").hide();
                if (options.$element != null) {
                    doc.addHTML(options.$element.get(0));
                }
                else {
                    doc.addHTML($("body").get(0), 0, 0, {}, function (w, cy, x, args) {
                    });
                }
                // add again
                $(".jb-modal-overlay").show();
                setTimeout(function () {
                    doc.save(options.filename);
                    $(".jb-modal-overlay").hide();
                    if (options.$element != null) {
                        options.$element.css("background-color", bgColor_1);
                    }
                }, 5000);
            }
        };
        Common.cast = function (instance, type) {
            if (instance == null || Common.stringIsNullOrEmpty(instance._originalTypeClassName)) {
                return instance;
            }
            //TODO: check inheritance list
            return instance._originalTypeClassName == type ? instance : null;
        };
        Common.objectsAreEqualGenericDeepComparison = function (a, b) {
            // If a and b reference the same value, return true
            if (a === b)
                return true;
            // If a and b aren't the same type, return false
            if (typeof a != typeof b)
                return false;
            // Already know types are the same, so if type is number
            // and both NaN, return true
            if (typeof a == 'number' && isNaN(a) && isNaN(b))
                return true;
            // Get internal [[Class]]
            var aClass = Object.prototype.toString.call(a);
            var bClass = Object.prototype.toString.call(b);
            // Return false if not same class
            if (aClass != bClass)
                return false;
            // If they're Boolean, String or Number objects, check values
            if (aClass == '[object Boolean]' || aClass == '[object String]' || aClass == '[object Number]') {
                return a.valueOf() == b.valueOf();
            }
            // If they're RegExps, Dates or Error objects, check stringified values
            if (aClass == '[object RegExp]' || aClass == '[object Date]' || aClass == '[object Error]') {
                return a.toString() == b.toString();
            }
            // Otherwise they're Objects, Functions or Arrays or some kind of host object
            if (typeof a == 'object' || typeof a == 'function') {
                // For functions, check stringigied values are the same
                // Almost certainly false if a and b aren't trivial
                // and are different functions
                if (aClass == '[object Function]' && a.toString() != b.toString())
                    return false;
                var aKeys = Object.keys(a);
                var bKeys = Object.keys(b);
                // If they don't have the same number of keys, return false
                if (aKeys.length != bKeys.length)
                    return false;
                // Check they have the same keys
                if (!aKeys.every(function (key) { return b.hasOwnProperty(key); }))
                    return false;
                // Check key values - uses ES5 Object.keys
                return aKeys.every(function (key) {
                    return Common.objectsAreEqualGenericDeepComparison(a[key], b[key]);
                });
            }
            return false;
        };
        // TODO: Check that key has value not only by "0" but also for each Datatype...
        Common.keyHasDefaultValue = function (key) {
            if (key == null)
                return true;
            var keyAsString = key.toString().trim();
            return keyAsString == "0" || keyAsString == "" || keyAsString == "00000000-0000-0000-0000-000000000000";
        };
        Common.changeDateTimeFormat = function (formatString) {
            var val = formatString.replace(new RegExp('tt', 'g'), 'a');
            val = val.replace(new RegExp('d', 'g'), 'D');
            val = val.replace(new RegExp('y', 'g'), 'Y');
            val = val.replace(new RegExp('f', 'g'), 'S');
            return val;
        };
        Common.classInstancesAreSame = function (objectA, objectB) {
            if ((objectA["_originalTypeClassName"] != null && objectB["_originalTypeClassName"] != null) &&
                (objectA["_originalTypeClassName"] !== objectB["_originalTypeClassName"])) {
                return false;
            }
            if (objectA["_clientKey"] != null && objectA["_clientKey"] === objectB["_clientKey"])
                return true;
            if ((objectA["_key"] != null && objectA["_key"] !== 0 && objectA["_key"] !== "" && objectA["_key"] === objectB["_key"]))
                return true;
            return false;
        };
        Common.classInstancesAreNotSame = function (objectA, objectB) {
            return Common.classInstancesAreSame(objectA, objectB) === false;
        };
        return Common;
    }());
    Joove.Common = Common;
    var ElementViewPortObserver = /** @class */ (function () {
        function ElementViewPortObserver(opts) {
            this.el = opts.$element.get(0);
            this.$el = opts.$element;
            this.interval = opts.interval || 1000;
            this.onEnterView = opts.onEnter;
            this.onExitView = opts.onExit;
            this.stopOnEnter = opts.stopWhenEnters;
            this.stopOnExit = opts.stopWhenExits;
            this.visibilityCheck = opts.visibilityCheck;
            this.distanceThreshold = opts.distanceThreshold || 100;
        }
        ElementViewPortObserver.prototype.start = function () {
            var _this = this;
            this.onLoop();
            this.intervalObject = setInterval(function () {
                _this.onLoop();
            }, this.interval);
        };
        ElementViewPortObserver.prototype.stop = function () {
            clearInterval(this.intervalObject);
        };
        ElementViewPortObserver.prototype.onLoop = function () {
            var isVisible = this.visibilityCheck === false
                ? true
                : this.$el.is(":visible") === true;
            var isInView = isVisible === false
                ? false
                : this.isInViewPort() === true;
            if (isVisible && isInView) {
                this.onEnterView && this.onEnterView();
                if (this.stopOnEnter === true) {
                    this.stop();
                }
            }
            else {
                this.onExitView && this.onExitView();
                if (this.stopOnExit === true) {
                    this.stop();
                }
            }
        };
        ElementViewPortObserver.prototype.isInViewPort = function () {
            var bounding = this.el.getBoundingClientRect();
            var distanceVertical = bounding.top - (window.innerHeight || document.documentElement.clientHeight);
            var distanceHorizontal = bounding.left - (window.innerWidth || document.documentElement.clientWidth);
            return bounding.top >= 0 && bounding.left >= 0 && distanceVertical <= this.distanceThreshold && distanceHorizontal <= this.distanceThreshold;
        };
        return ElementViewPortObserver;
    }());
    Joove.ElementViewPortObserver = ElementViewPortObserver;
    var LazyImageLoader = /** @class */ (function () {
        function LazyImageLoader($img, checkVisibility) {
            var _this = this;
            this.$img = $img;
            this.observer = new ElementViewPortObserver({
                $element: this.$img,
                interval: 1000,
                stopWhenEnters: true,
                visibilityCheck: checkVisibility === true,
                onEnter: function () {
                    _this.setImage();
                }
            });
            this.observer.start();
        }
        LazyImageLoader.prototype.setImage = function () {
            var src = this.$img.data("src");
            this.$img.attr("src", src);
        };
        return LazyImageLoader;
    }());
    Joove.LazyImageLoader = LazyImageLoader;
})(Joove || (Joove = {}));
