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
var System;
(function (System) {
    var NULL = null;
    System.EMPTY = "";
    var VOID0 = void (0), _BOOLEAN = typeof true, _NUMBER = typeof 0, _STRING = typeof "", _SYMBOL = "symbol", _OBJECT = typeof {}, _UNDEFINED = typeof VOID0, _FUNCTION = typeof (function () { }), LENGTH = "length";
    var typeInfoRegistry = {};
    var TypeInfo = /** @class */ (function () {
        function TypeInfo(target, onBeforeFreeze) {
            this.isBoolean = false;
            this.isNumber = false;
            this.isString = false;
            this.isTrueNaN = false;
            this.isObject = false;
            this.isFunction = false;
            this.isUndefined = false;
            this.isNull = false;
            this.isPrimitive = false;
            this.isSymbol = false;
            switch (this.type = typeof target) {
                case _BOOLEAN:
                    this.isBoolean = true;
                    this.isPrimitive = true;
                    break;
                case _NUMBER:
                    this.isNumber = true;
                    this.isTrueNaN = isNaN(target);
                    this.isFinite = isFinite(target);
                    this.isValidNumber = !this.isTrueNaN;
                    this.isPrimitive = true;
                    break;
                case _STRING:
                    this.isString = true;
                    this.isPrimitive = true;
                    break;
                case _SYMBOL:
                    this.isSymbol = true;
                    break;
                case _OBJECT:
                    this.target = target;
                    if (target === null) {
                        this.isNull = true;
                        this.isNullOrUndefined = true;
                        this.isPrimitive = true;
                    }
                    else {
                        this.isArray = (target) instanceof (Array);
                        this.isObject = true;
                    }
                    break;
                case _FUNCTION:
                    this.target = target;
                    this.isFunction = true;
                    break;
                case _UNDEFINED:
                    this.isUndefined = true;
                    this.isNullOrUndefined = true;
                    this.isPrimitive = true;
                    break;
                default:
                    throw "Fatal type failure.  Unknown type: " + this.type;
            }
            if (onBeforeFreeze)
                onBeforeFreeze(this);
            Object.freeze(this);
        }
        /**
         * Returns a TypeInfo for any member or non-member,
         * where non-members are of type undefined.
         * @param name
         * @returns {TypeInfo}
         */
        TypeInfo.prototype.member = function (name) {
            var t = this.target;
            return TypeInfo.getFor(t && (name) in (t)
                ? t[name]
                : VOID0);
        };
        /**
         * Returns a TypeInfo for any target object.
         * If the target object is of a primitive type, it returns the TypeInfo instance assigned to that type.
         * @param target
         * @returns {TypeInfo}
         */
        TypeInfo.getFor = function (target) {
            var type = typeof target;
            switch (type) {
                case _OBJECT:
                case _FUNCTION:
                    return new TypeInfo(target);
            }
            var info = typeInfoRegistry[type];
            if (!info)
                typeInfoRegistry[type] = info = new TypeInfo(target);
            return info;
        };
        /**
         * Returns true if the target matches the type (instanceof).
         * @param type
         * @returns {boolean}
         */
        TypeInfo.prototype.is = function (type) {
            return this.target instanceof type;
        };
        /**
         * Returns null if the target does not match the type (instanceof).
         * Otherwise returns the target as the type.
         * @param type
         * @returns {T|null}
         */
        TypeInfo.prototype.as = function (type) {
            return this.target instanceof type ? this.target : null;
        };
        return TypeInfo;
    }());
    System.TypeInfo = TypeInfo;
    function Type(target) {
        return new TypeInfo(target);
    }
    System.Type = Type;
    (function (Type) {
        /**
         * typeof true
         * @type {string}
         */
        Type.BOOLEAN = _BOOLEAN;
        /**
         * typeof 0
         * @type {string}
         */
        Type.NUMBER = _NUMBER;
        /**
         * typeof ""
         * @type {string}
         */
        Type.STRING = _STRING;
        /**
         * typeof {}
         * @type {string}
         */
        Type.OBJECT = _OBJECT;
        /**
         * typeof Symbol
         * @type {string}
         */
        Type.SYMBOL = _SYMBOL;
        /**
         * typeof undefined
         * @type {string}
         */
        Type.UNDEFINED = _UNDEFINED;
        /**
         * typeof function
         * @type {string}
         */
        Type.FUNCTION = _FUNCTION;
        /**
         * Returns true if the target matches the type (instanceof).
         * @param target
         * @param type
         * @returns {T|null}
         */
        function is(target, type) {
            return target instanceof type;
        }
        Type.is = is;
        /**
         * Returns null if the target does not match the type (instanceof).
         * Otherwise returns the target as the type.
         * @param target
         * @param type
         * @returns {T|null}
         */
        function as(target, type) {
            return target instanceof type ? target : null;
        }
        Type.as = as;
        /**
         * Returns true if the value parameter is null or undefined.
         * @param value
         * @returns {boolean}
         */
        function isNullOrUndefined(value) {
            return value == null;
        }
        Type.isNullOrUndefined = isNullOrUndefined;
        /**
         * Returns true if the value parameter is a boolean.
         * @param value
         * @returns {boolean}
         */
        function isBoolean(value) {
            return typeof value === _BOOLEAN;
        }
        Type.isBoolean = isBoolean;
        /**
         * Returns true if the value parameter is a number.
         * @param value
         * @param ignoreNaN Default is false. When true, NaN is not considered a number and will return false.
         * @returns {boolean}
         */
        function isNumber(value, ignoreNaN) {
            if (ignoreNaN === void 0) { ignoreNaN = false; }
            return typeof value === _NUMBER && (!ignoreNaN || !isNaN(value));
        }
        Type.isNumber = isNumber;
        /**
         * Returns true if is a number and is NaN.
         * @param value
         * @returns {boolean}
         */
        function isTrueNaN(value) {
            return typeof value === _NUMBER && isNaN(value);
        }
        Type.isTrueNaN = isTrueNaN;
        /**
         * Returns true if the value parameter is a string.
         * @param value
         * @returns {boolean}
         */
        function isString(value) {
            return typeof value === _STRING;
        }
        Type.isString = isString;
        /**
         * Returns true if the value is a boolean, string, number, null, or undefined.
         * @param value
         * @param allowUndefined if set to true will return true if the value is undefined.
         * @returns {boolean}
         */
        function isPrimitive(value, allowUndefined) {
            if (allowUndefined === void 0) { allowUndefined = false; }
            var t = typeof value;
            switch (t) {
                case _BOOLEAN:
                case _STRING:
                case _NUMBER:
                    return true;
                case _UNDEFINED:
                    return allowUndefined;
                case _OBJECT:
                    return value === null;
            }
            return false;
        }
        Type.isPrimitive = isPrimitive;
        /**
         * For detecting if the value can be used as a key.
         * @param value
         * @param allowUndefined
         * @returns {boolean|boolean}
         */
        function isPrimitiveOrSymbol(value, allowUndefined) {
            if (allowUndefined === void 0) { allowUndefined = false; }
            return typeof value === _SYMBOL ? true : isPrimitive(value, allowUndefined);
        }
        Type.isPrimitiveOrSymbol = isPrimitiveOrSymbol;
        /**
         * Returns true if the value is a string, number, or symbol.
         * @param value
         * @returns {boolean}
         */
        function isPropertyKey(value) {
            var t = typeof value;
            switch (t) {
                case _STRING:
                case _NUMBER:
                case _SYMBOL:
                    return true;
            }
            return false;
        }
        Type.isPropertyKey = isPropertyKey;
        /**
         * Returns true if the value parameter is a function.
         * @param value
         * @returns {boolean}
         */
        function isFunction(value) {
            return typeof value === _FUNCTION;
        }
        Type.isFunction = isFunction;
        /**
         * Returns true if the value parameter is an object.
         * @param value
         * @param allowNull If false (default) null is not considered an object.
         * @returns {boolean}
         */
        function isObject(value, allowNull) {
            if (allowNull === void 0) { allowNull = false; }
            return typeof value === _OBJECT && (allowNull || value !== null);
        }
        Type.isObject = isObject;
        /**
         * Guarantees a number value or NaN instead.
         * @param value
         * @returns {number}
         */
        function numberOrNaN(value) {
            return isNaN(value) ? NaN : value;
        }
        Type.numberOrNaN = numberOrNaN;
        /**
         * Returns a TypeInfo object for the target.
         * @param target
         * @returns {TypeInfo}
         */
        function of(target) {
            return TypeInfo.getFor(target);
        }
        Type.of = of;
        /**
         * Will detect if a member exists (using 'in').
         * Returns true if a property or method exists on the object or its prototype.
         * @param instance
         * @param property Name of the member.
         * @param ignoreUndefined When ignoreUndefined is true, if the member exists but is undefined, it will return false.
         * @returns {boolean}
         */
        function hasMember(instance, property, ignoreUndefined) {
            if (ignoreUndefined === void 0) { ignoreUndefined = true; }
            return instance &&
                !isPrimitive(instance) &&
                (property) in (instance) &&
                (ignoreUndefined || instance[property] !== VOID0);
        }
        Type.hasMember = hasMember;
        /**
         * Returns true if the member matches the type.
         * @param instance
         * @param property
         * @param type
         * @returns {boolean}
         */
        function hasMemberOfType(instance, property, type) {
            return hasMember(instance, property) && typeof (instance[property]) === type;
        }
        Type.hasMemberOfType = hasMemberOfType;
        function hasMethod(instance, property) {
            return hasMemberOfType(instance, property, _FUNCTION);
        }
        Type.hasMethod = hasMethod;
        function isArrayLike(instance) {
            /*
             * NOTE:
             *
             * Functions:
             * Enumerating a function although it has a .length property will yield nothing or unexpected results.
             * Effectively, a function is not like an array.
             *
             * Strings:
             * Behave like arrays but don't have the same exact methods.
             */
            return instance instanceof Array ||
                Type.isString(instance) ||
                !Type.isFunction(instance) && hasMember(instance, LENGTH);
        }
        Type.isArrayLike = isArrayLike;
    })(Type = System.Type || (System.Type = {}));
    /**
     * Returns a numerical (integer) hash code of the string.  Can be used for identifying inequality of contents, but two different strings in rare cases will have the same hash code.
     * @param source
     * @returns {number}
     */
    function getHashCode(source) {
        var hash = 0 | 0;
        if (source.length === 0)
            return hash;
        for (var i = 0, l = source.length; i < l; i++) {
            var ch = source.charCodeAt(i);
            hash = ((hash << 5) - hash) + ch;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }
    System.getHashCode = getHashCode;
    function repeat(source, count) {
        var result = System.EMPTY;
        if (!isNaN(count)) {
            for (var i = 0; i < count; i++) {
                result += source;
            }
        }
        return result;
    }
    System.repeat = repeat;
    function fromChars(chOrChars, count) {
        if (count === void 0) { count = 1; }
        if ((chOrChars) instanceof (Array)) {
            var result = System.EMPTY;
            for (var _i = 0, chOrChars_1 = chOrChars; _i < chOrChars_1.length; _i++) {
                var char = chOrChars_1[_i];
                result += String.fromCharCode(char);
            }
            return result;
        }
        else {
            return repeat(String.fromCharCode(chOrChars), count);
        }
    }
    System.fromChars = fromChars;
    /**
     * Escapes a RegExp sequence.
     * @param source
     * @returns {string}
     */
    function escapeRegExp(source) {
        return source.replace(/[-[\]\/{}()*+?.\\^$|]/g, "\\$&");
    }
    System.escapeRegExp = escapeRegExp;
    /**
     * Can trim any character or set of characters from the ends of a string.
     * Uses a Regex escapement to replace them with empty.
     * @param source
     * @param chars A string or array of characters desired to be trimmed.
     * @param ignoreCase
     * @returns {string}
     */
    function trim(source, chars, ignoreCase) {
        if (chars === System.EMPTY)
            return source;
        if (chars) {
            var escaped = escapeRegExp((chars) instanceof (Array) ? chars.join() : chars);
            return source.replace(new RegExp("^[" + escaped + "]+|[" + escaped + "]+$", "g" + (ignoreCase
                ? "i"
                : "")), System.EMPTY);
        }
        return source.replace(/^\s+|\s+$/g, System.EMPTY);
    }
    System.trim = trim;
    /**
     * Takes any arg
     * @param source
     * @param args
     * @returns {string}
     */
    function format(source) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return supplant(source, args);
    }
    System.format = format;
    //
    /**
     * This takes a string and replaces '{string}' with the respected parameter.
     * Also allows for passing an array in order to use '{n}' notation.
     * Not limited to an array's indexes.  For example, {length} is allowed.
     * Based upon Crockford's supplant function.
     * @param source
     * @param params
     * @returns {string}
     */
    function supplant(source, params) {
        var oIsArray = (params) instanceof (Array);
        return source.replace(/\{([^{}]*)}/g, function (a, b) {
            var n = b;
            if (oIsArray) {
                var i = parseInt(b);
                if (!isNaN(i))
                    n = i;
            }
            var r = params[n];
            switch (typeof r) {
                case Type.STRING:
                case Type.NUMBER:
                case Type.BOOLEAN:
                    return r;
                default:
                    return (r && Type.hasMemberOfType(r, "toString", Type.FUNCTION))
                        ? r.toString()
                        : a;
            }
        });
    }
    System.supplant = supplant;
    function canMatch(source, match) {
        if (!Type.isString(source) || !match)
            return false;
        if (source === match)
            return true;
        if (match.length < source.length)
            return null;
        return null;
    }
    /**
     * Returns true if the pattern matches the beginning of the source.
     * @param source
     * @param pattern
     * @returns {boolean}
     */
    function startsWith(source, pattern) {
        var m = canMatch(source, pattern);
        return Type.isBoolean(m) ? m : source.indexOf(pattern) === 0;
    }
    System.startsWith = startsWith;
    /**
     * Returns true if the pattern matches the end of the source.
     * @param source
     * @param pattern
     * @returns {boolean}
     */
    function endsWith(source, pattern) {
        var m = canMatch(source, pattern);
        return Type.isBoolean(m) ? m : source.lastIndexOf(pattern) === (source.length - pattern.length);
    }
    System.endsWith = endsWith;
    /**
     * Splits the source string into an array of strings, splitting it up using the provided delimiter
     * @param source - The string to split up
     * @param delimiter - The delimiter (single character, string or an array of chars/strings) to use when splitting the source string
     * @param removeEmpty - If true, all empty entries will be removed from the result
     * @returns {Array<string>} - Array of strings, made up from the split source
     */
    function split(source, delimiter, removeEmpty) {
        if (delimiter === void 0) { delimiter = ""; }
        if (source == null) {
            return null;
        }
        var clearDelimiter = delimiter.toString();
        if (Array.isArray(delimiter) == true) {
            clearDelimiter = delimiter.join('');
        }
        var result = source.split(new RegExp("[" + clearDelimiter + "]"));
        if (removeEmpty === true) {
            return result.linq.where(function (x) { return x != null && x.trim() != ""; }).toArray();
        }
        return result;
    }
    System.split = split;
    var Exception = /** @class */ (function () {
        /**
         * Initializes a new instance of the Exception class with a specified error message and optionally a reference to the inner exception that is the cause of this exception.
         * @param message
         * @param innerException
         * @param beforeSealing This delegate is used to allow actions to occur just before this constructor finishes.  Since some compilers do not allow the use of 'this' before super.
         */
        function Exception(message, innerException, beforeSealing) {
            this.message = message;
            var _ = this;
            this.name = _.getName();
            this.data = {};
            if (innerException)
                _.data["innerException"] = innerException;
            /* Originally intended to use 'get' accessors for properties,
             * But debuggers don't display these readily yet.
             * Object.freeze has to be used carefully, but will prevent overriding values at runtime.
             */
            if (beforeSealing)
                beforeSealing(_);
            // Node has a .stack, let's use it...
            try {
                var stack = eval("new System.Error()").stack;
                stack = stack &&
                    stack
                        .replace(/^Error\n/, "")
                        .replace(/(.|\n)+\s+at new.+/, "") ||
                    "";
                this.stack = _.toStringWithoutBrackets() + stack;
            }
            catch (ex) {
            }
            Object.freeze(_);
        }
        /**
         * A string representation of the error type.
         * The default is 'Error'.
         */
        Exception.prototype.getName = function () { return "Exception"; };
        /**
         * The string representation of the Exception instance.
         */
        Exception.prototype.toString = function () {
            return "[" + this.toStringWithoutBrackets() + "]";
        };
        Exception.prototype.toStringWithoutBrackets = function () {
            var _ = this;
            var m = _.message;
            return _.name + (m ? (": " + m) : "");
        };
        /**
         * Clears the data object.
         */
        Exception.prototype.dispose = function () {
            var data = this.data;
            for (var k in data) {
                if (data.hasOwnProperty(k))
                    delete data[k];
            }
        };
        return Exception;
    }());
    System.Exception = Exception;
    var Guid = /** @class */ (function () {
        function Guid(guid) {
            var _this = this;
            this.Equals = function (other) {
                // Comparing string `value` against provided `guid` will auto-call
                // toString on `guid` for comparison
                return Guid.IsGuid(other) && _this.value === other;
            };
            this.IsEmpty = function () {
                return _this.value === Guid.EMPTY;
            };
            this.ToString = function () {
                return _this.value;
            };
            this.toString = function () {
                return _this.value;
            };
            this.ToJSON = function () {
                return _this.value;
            };
            if (!guid)
                throw new TypeError("Invalid argument; `value` has no value.");
            this.value = Guid.EMPTY;
            if (guid && guid instanceof Guid) {
                this.value = guid.toString();
            }
            else if (guid && Object.prototype.toString.call(guid) === "[object String]" && Guid.IsGuid(guid)) {
                this.value = guid;
            }
        }
        Guid.gen = function (count) {
            var out = "";
            for (var i = 0; i < count; i++) {
                out += (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }
            return out;
        };
        Guid.IsGuid = function (value) {
            return value && (value instanceof Guid || this._validator.test(value.toString()));
        };
        Guid.NewGuid = function () {
            var gen = Guid.gen;
            return new Guid([gen(2), gen(1), gen(1), gen(1), gen(3)].join("-"));
        };
        Guid.Parse = function (guid) {
            if (this.IsGuid(guid)) {
                return new Guid(guid);
            }
            else {
                throw new Error("Can't parse this to Guid");
            }
        };
        Guid.Raw = function () {
            var gen = Guid.gen;
            return [gen(2), gen(1), gen(1), gen(1), gen(3)].join("-");
        };
        Guid._validator = new RegExp("^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$", "i");
        Guid.EMPTY = "00000000-0000-0000-0000-000000000000";
        return Guid;
    }());
    System.Guid = Guid;
    var Compare;
    (function (Compare) {
        var IsTrueNaN = Type.isTrueNaN;
        var TrueNaN = Type.isTrueNaN;
        var VOID0 = void 0;
        /**
         * Used for special comparison including NaN.
         * @param a
         * @param b
         * @param strict
         * @returns {boolean|any}
         */
        function areEqual(a, b, strict) {
            if (strict === void 0) { strict = true; }
            return a === b || !strict && a === b || IsTrueNaN(a) && TrueNaN(b);
        }
        Compare.areEqual = areEqual;
        var COMPARE_TO = "compareTo";
        function compare(a, b, strict) {
            if (strict === void 0) { strict = true; }
            if (areEqual(a, b, strict))
                return 0 /* Equal */;
            if (a && Type.hasMember(a, COMPARE_TO))
                return a.compareTo(b); // If a has compareTo, use it.
            else if (b && Type.hasMember(b, COMPARE_TO))
                return -b.compareTo(a); // a doesn't have compareTo? check if b does and invert.
            // Allow for special inequality..
            if (a > b || strict && (a === 0 && b === 0 || a === null && b === VOID0))
                return 1 /* Greater */;
            if (b > a || strict && (b === 0 && a === 0 || b === null && a === VOID0))
                return -1 /* Less */;
            return NaN;
        }
        Compare.compare = compare;
        /**
         * Determines if two primitives are equal or if two objects have the same key/value combinations.
         * @param a
         * @param b
         * @param nullEquivalency If true, null/undefined will be equivalent to an empty object {}.
         * @param extraDepth
         * @returns {boolean}
         */
        function areEquivalent(a, b, nullEquivalency, extraDepth) {
            if (nullEquivalency === void 0) { nullEquivalency = true; }
            if (extraDepth === void 0) { extraDepth = 0; }
            // Take a step by step approach to ensure efficiency.
            if (areEqual(a, b, true))
                return true;
            if (a == null || b == null) {
                if (!nullEquivalency)
                    return false;
                if (Type.isObject(a)) {
                    return !Object.keys(a).length;
                }
                if (Type.isObject(b)) {
                    return !Object.keys(b).length;
                }
                return a == null && b == null;
            }
            if (Type.isObject(a) && Type.isObject(b)) {
                var aKeys = Object.keys(a), bKeys = Object.keys(b), len = aKeys.length;
                if (len !== bKeys.length)
                    return false;
                aKeys.sort();
                bKeys.sort();
                for (var i = 0; i < len; i++) {
                    var key = aKeys[i];
                    if (key !== bKeys[i] || !areEqual(a[key], b[key], true))
                        return false;
                }
                // Doesn't track circular references but allows for controlling the amount of recursion.
                if (extraDepth > 0) {
                    for (var _i = 0, aKeys_1 = aKeys; _i < aKeys_1.length; _i++) {
                        var key = aKeys_1[_i];
                        if (!areEquivalent(a[key], b[key], nullEquivalency, extraDepth - 1))
                            return false;
                    }
                }
                return true;
            }
            return false;
        }
        Compare.areEquivalent = areEquivalent;
    })(Compare = System.Compare || (System.Compare = {}));
    var KeyValueExtractModule;
    (function (KeyValueExtractModule) {
        var VOID0 = void 0, DOT = ".", KEY = "key", VALUE = "value", ITEM = "item", ITEM_1 = ITEM + "[1]", ITEM_VALUE = ITEM + DOT + VALUE, INVALID_KVP_MESSAGE = "Invalid type.  Must be a KeyValuePair or Tuple of length 2.", CANNOT_BE_UNDEFINED = "Cannot equal undefined.";
        function isKeyValuePair(kvp) {
            return kvp && kvp.hasOwnProperty(KEY) && kvp.hasOwnProperty(VALUE);
        }
        KeyValueExtractModule.isKeyValuePair = isKeyValuePair;
        function assertKey(key, name) {
            if (name === void 0) { name = ITEM; }
            assertNotUndefined(key, name + DOT + KEY);
            if (key === null)
                throw new Exceptions.ArgumentNullException(name + DOT + KEY);
            return key;
        }
        KeyValueExtractModule.assertKey = assertKey;
        function assertTuple(tuple, name) {
            if (name === void 0) { name = ITEM; }
            if (tuple.length !== 2)
                throw new Exceptions.ArgumentException(name, "KeyValuePair tuples must be of length 2.");
            assertKey(tuple[0], name);
        }
        KeyValueExtractModule.assertTuple = assertTuple;
        function assertNotUndefined(value, name) {
            if (value === VOID0)
                throw new Exceptions.ArgumentException(name, CANNOT_BE_UNDEFINED);
            return value;
        }
        KeyValueExtractModule.assertNotUndefined = assertNotUndefined;
        function extractKeyValue(item, to) {
            var key, value;
            if (Type.isArrayLike(item)) {
                assertTuple(item);
                key = item[0];
                value = assertNotUndefined(item[1], ITEM_1);
            }
            else if (isKeyValuePair(item)) {
                key = assertKey(item.key);
                value = assertNotUndefined(item.value, ITEM_VALUE);
            }
            else {
                throw new Exceptions.ArgumentException(ITEM, INVALID_KVP_MESSAGE);
            }
            return to(key, value);
        }
        KeyValueExtractModule.extractKeyValue = extractKeyValue;
    })(KeyValueExtractModule = System.KeyValueExtractModule || (System.KeyValueExtractModule = {}));
    function Integer(n) {
        return Math.floor(n);
    }
    System.Integer = Integer;
    (function (Integer) {
        Integer.MAX_32_BIT = 2147483647;
        Integer.MAX_VALUE = 9007199254740991;
        var NUMBER = "number";
        /**
         * Converts any number to its 32bit counterpart.
         * Throws if conversion is not possible.
         * @param n
         * @returns {number}
         */
        function as32Bit(n) {
            var result = n | 0;
            if (isNaN(n))
                throw "'n' is not a number.";
            if (n !== -1 && result === -1)
                throw "'n' is too large to be a 32 bit integer.";
            return result;
        }
        Integer.as32Bit = as32Bit;
        /**
         * Returns true if the value is an integer.
         * @param n
         * @returns {boolean}
         */
        function is(n) {
            return typeof n === NUMBER && isFinite(n) && n === Math.floor(n);
        }
        Integer.is = is;
        /**
         * Returns true if the value is within a 32 bit range.
         * @param n
         * @returns {boolean}
         */
        function is32Bit(n) {
            return n === (n | 0);
        }
        Integer.is32Bit = is32Bit;
        /**
         * Throws if not an integer.
         * @param n
         * @param argumentName
         * @returns {boolean}
         */
        function assert(n, argumentName) {
            var i = is(n);
            if (!i)
                throw new Exceptions.ArgumentException(argumentName || "n", "Must be a integer.");
            return i;
        }
        Integer.assert = assert;
        /**
         * Throws if less than zero.
         * @param n
         * @param argumentName
         * @returns {boolean}
         */
        function assertZeroOrGreater(n, argumentName) {
            var i = assert(n, argumentName) && n >= 0;
            if (!i)
                throw new Exceptions.ArgumentOutOfRangeException(argumentName || "n", n, "Must be a valid integer greater than or equal to zero.");
            return i;
        }
        Integer.assertZeroOrGreater = assertZeroOrGreater;
        /**
         * Throws if not greater than zero.
         * @param n
         * @param argumentName
         * @returns {boolean}
         */
        function assertPositive(n, argumentName) {
            var i = assert(n, argumentName) && n > 0;
            if (!i)
                throw new Exceptions.ArgumentOutOfRangeException(argumentName || "n", n, "Must be greater than zero.");
            return i;
        }
        Integer.assertPositive = assertPositive;
    })(Integer = System.Integer || (System.Integer = {}));
    var Functions = /** @class */ (function () {
        function Functions() {
        }
        //noinspection JSMethodCanBeStatic
        /**
         * A typed method for use with simple selection of the parameter.
         * @returns {T}
         */
        Functions.prototype.Identity = function (x) { return x; };
        //noinspection JSMethodCanBeStatic
        /**
         * Returns true.
         * @returns {boolean}
         */
        Functions.prototype.True = function () { return true; };
        //noinspection JSMethodCanBeStatic
        /**
         * Returns false.
         * @returns {boolean}
         */
        Functions.prototype.False = function () { return false; };
        /**
         * Does nothing.
         */
        Functions.prototype.Blank = function () { };
        return Functions;
    }());
    System.Functions = Functions;
    var rootFunctions = new Functions();
    // Expose static versions.
    (function (Functions) {
        /**
         * A typed method for use with simple selection of the parameter.
         * @returns {boolean}
         */
        Functions.Identity = rootFunctions.Identity;
        /**
         * Returns false.
         * @returns {boolean}
         */
        Functions.True = rootFunctions.True;
        /**
         * Returns false.
         * @returns {boolean}
         */
        Functions.False = rootFunctions.False;
        /**
         * Does nothing.
         */
        Functions.Blank = rootFunctions.Blank;
    })(Functions = System.Functions || (System.Functions = {}));
    // Make this read only.  Should still allow for sub-classing since extra methods are added to prototype.
    Object.freeze(Functions);
    var Exceptions;
    (function (Exceptions) {
        var SystemException = /** @class */ (function (_super) {
            __extends(SystemException, _super);
            function SystemException() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            /*
                constructor(
                    message:string = null,
                    innerException:Error = null,
                    beforeSealing?:(ex:any)=>void)
                {
                    super(message, innerException, beforeSealing);
                }
            */
            SystemException.prototype.getName = function () {
                return "SystemException";
            };
            return SystemException;
        }(Exception));
        Exceptions.SystemException = SystemException;
        var ArgumentException = /** @class */ (function (_super) {
            __extends(ArgumentException, _super);
            // For simplicity and consistency, lets stick with 1 signature.
            function ArgumentException(paramName, message, innerException, beforeSealing) {
                var _this = this;
                var pn = paramName ? ("{" + paramName + "} ") : "";
                _this = _super.call(this, trim(pn + (message || "")), innerException, function (_) {
                    _.paramName = paramName;
                    if (beforeSealing)
                        beforeSealing(_);
                }) || this;
                return _this;
            }
            ArgumentException.prototype.getName = function () {
                return "ArgumentException";
            };
            return ArgumentException;
        }(SystemException));
        Exceptions.ArgumentException = ArgumentException;
        var ArgumentNullException = /** @class */ (function (_super) {
            __extends(ArgumentNullException, _super);
            function ArgumentNullException(paramName, message, innerException) {
                if (message === void 0) { message = "'" + paramName + "' is null (or undefined)."; }
                return _super.call(this, paramName, message, innerException) || this;
            }
            ArgumentNullException.prototype.getName = function () {
                return "ArgumentNullException";
            };
            return ArgumentNullException;
        }(ArgumentException));
        Exceptions.ArgumentNullException = ArgumentNullException;
        var ArgumentOutOfRangeException = /** @class */ (function (_super) {
            __extends(ArgumentOutOfRangeException, _super);
            function ArgumentOutOfRangeException(paramName, actualValue, message, innerException) {
                if (message === void 0) { message = " "; }
                return _super.call(this, paramName, "(" + actualValue + ") " + message, innerException, function (_) {
                    _.actualValue = actualValue;
                }) || this;
            }
            ArgumentOutOfRangeException.prototype.getName = function () {
                return "ArgumentOutOfRangeException";
            };
            return ArgumentOutOfRangeException;
        }(ArgumentException));
        Exceptions.ArgumentOutOfRangeException = ArgumentOutOfRangeException;
        var InvalidOperationException = /** @class */ (function (_super) {
            __extends(InvalidOperationException, _super);
            function InvalidOperationException() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            InvalidOperationException.prototype.getName = function () {
                return "InvalidOperationException";
            };
            return InvalidOperationException;
        }(SystemException));
        Exceptions.InvalidOperationException = InvalidOperationException;
        var NullReferenceException = /** @class */ (function (_super) {
            __extends(NullReferenceException, _super);
            function NullReferenceException() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            NullReferenceException.prototype.getName = function () {
                return "NullReferenceException";
            };
            return NullReferenceException;
        }(SystemException));
        Exceptions.NullReferenceException = NullReferenceException;
        var NotImplementedException = /** @class */ (function (_super) {
            __extends(NotImplementedException, _super);
            function NotImplementedException() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            NotImplementedException.prototype.getName = function () {
                return "NotImplementedException";
            };
            return NotImplementedException;
        }(SystemException));
        Exceptions.NotImplementedException = NotImplementedException;
    })(Exceptions = System.Exceptions || (System.Exceptions = {}));
    var Disposable;
    (function (Disposable) {
        var ObjectDisposedException = /** @class */ (function (_super) {
            __extends(ObjectDisposedException, _super);
            // For simplicity and consistency, lets stick with 1 signature.
            function ObjectDisposedException(objectName, message, innerException) {
                return _super.call(this, message || "", innerException, function (_) {
                    _.objectName = objectName;
                }) || this;
            }
            ObjectDisposedException.prototype.getName = function () {
                return "ObjectDisposedException";
            };
            ObjectDisposedException.prototype.toString = function () {
                var _ = this;
                var oName = _.objectName;
                oName = oName ? ("{" + oName + "} ") : "";
                return "[" + _.name + ": " + oName + _.message + "]";
            };
            ObjectDisposedException.throwIfDisposed = function (disposable, objectName, message) {
                if (disposable.wasDisposed)
                    throw new ObjectDisposedException(objectName, message);
                return true;
            };
            return ObjectDisposedException;
        }(Exceptions.InvalidOperationException));
        Disposable.ObjectDisposedException = ObjectDisposedException;
        var DisposableBase = /** @class */ (function () {
            function DisposableBase(__finalizer) {
                this.__finalizer = __finalizer;
                this.__wasDisposed = false;
            }
            Object.defineProperty(DisposableBase.prototype, "wasDisposed", {
                get: function () {
                    return this.__wasDisposed;
                },
                enumerable: false,
                configurable: true
            });
            DisposableBase.prototype.throwIfDisposed = function (message, objectName) {
                if (objectName === void 0) { objectName = this._disposableObjectName; }
                if (this.__wasDisposed)
                    throw new ObjectDisposedException(objectName, message);
                return true;
            };
            DisposableBase.prototype.dispose = function () {
                var _ = this;
                if (!_.__wasDisposed) {
                    // Preemptively set wasDisposed in order to prevent repeated disposing.
                    // NOTE: in true multi-threaded scenarios, this needs to be synchronized.
                    _.__wasDisposed = true;
                    try {
                        _._onDispose(); // Protected override.
                    }
                    finally {
                        if (_.__finalizer) // Private finalizer...
                         {
                            _.__finalizer();
                            _.__finalizer = void 0;
                        }
                    }
                }
            };
            // Placeholder for overrides.
            DisposableBase.prototype._onDispose = function () { };
            return DisposableBase;
        }());
        Disposable.DisposableBase = DisposableBase;
        /**
         * Takes any number of disposables as arguments and attempts to dispose them.
         * Any exceptions thrown within a dispose are not trapped.
         * Use 'disposeWithoutException' to automatically trap exceptions.
         *
         * Can accept <any> and will ignore objects that don't have a dispose() method.
         * @param disposables
         */
        function dispose() {
            var disposables = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                disposables[_i] = arguments[_i];
            }
            // The disposables arguments array is effectively localized so it's safe.
            disposeTheseInternal(disposables, false);
        }
        Disposable.dispose = dispose;
        (function (dispose) {
            /**
             * Use this when only disposing one object to avoid creation of arrays.
             * @param disposable
             * @param trapExceptions
             */
            function single(disposable, trapExceptions) {
                if (trapExceptions === void 0) { trapExceptions = false; }
                if (disposable)
                    disposeSingle(disposable, trapExceptions);
            }
            dispose.single = single;
            function deferred() {
                var disposables = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    disposables[_i] = arguments[_i];
                }
                these.deferred(disposables);
            }
            dispose.deferred = deferred;
            /**
             * Takes any number of disposables and traps any errors that occur when disposing.
             * Returns an array of the exceptions thrown.
             * @param disposables
             * @returns {any[]} Returns an array of exceptions that occurred, if there are any.
             */
            function withoutException() {
                var disposables = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    disposables[_i] = arguments[_i];
                }
                // The disposables arguments array is effectively localized so it's safe.
                return disposeTheseInternal(disposables, true);
            }
            dispose.withoutException = withoutException;
            /**
             * Takes an array of disposable objects and ensures they are disposed.
             * @param disposables
             * @param trapExceptions If true, prevents exceptions from being thrown when disposing.
             * @returns {any[]} If 'trapExceptions' is true, returns an array of exceptions that occurred, if there are any.
             */
            function these(disposables, trapExceptions) {
                return disposables && disposables.length
                    ? disposeTheseInternal(disposables.slice(), trapExceptions)
                    : void 0;
            }
            dispose.these = these;
            (function (these) {
                function deferred(disposables, delay) {
                    if (delay === void 0) { delay = 0; }
                    if (disposables && disposables.length) {
                        if (!(delay >= 0))
                            delay = 0;
                        setTimeout(disposeTheseInternal, delay, disposables.slice(), true);
                    }
                }
                these.deferred = deferred;
                /**
                 * Use this unsafe method when guaranteed not to cause events that will make modifications to the disposables array.
                 * @param disposables
                 * @param trapExceptions
                 * @returns {any[]}
                 */
                function noCopy(disposables, trapExceptions) {
                    return disposables && disposables.length
                        ? disposeTheseInternal(disposables, trapExceptions)
                        : void 0;
                }
                these.noCopy = noCopy;
            })(these = dispose.these || (dispose.these = {}));
        })(dispose = Disposable.dispose || (Disposable.dispose = {}));
        /**
         * Just like in C# this 'using' function will ensure the passed disposable is disposed when the closure has finished.
         *
         * Usage:
         * ```typescript
         * using(new DisposableObject(),(myObj)=>{
             *   // do work with myObj
             * });
         * // myObj automatically has it's dispose method called.
         * ```
         *
         * @param disposable Object to be disposed.
         * @param closure Function call to execute.
         * @returns {TReturn} Returns whatever the closure's return value is.
         */
        function using(disposable, closure) {
            try {
                return closure(disposable);
            }
            finally {
                disposeSingle(disposable, false);
            }
        }
        Disposable.using = using;
        /**
         * This private function makes disposing more robust for when there's no type checking.
         * If trapExceptions is 'true' it catches and returns any exception instead of throwing.
         */
        function disposeSingle(disposable, trapExceptions) {
            if (disposable
                && typeof disposable == Type.OBJECT
                && typeof disposable["dispose"] == "function") {
                if (trapExceptions) {
                    try {
                        disposable.dispose();
                    }
                    catch (ex) {
                        return ex;
                    }
                }
                else
                    disposable.dispose();
            }
            return null;
        }
        Disposable.disposeSingle = disposeSingle;
        /**
         * This dispose method assumes it's working on a local arrayCopy and is unsafe for external use.
         */
        function disposeTheseInternal(disposables, trapExceptions, index) {
            if (index === void 0) { index = 0; }
            var exceptions;
            var len = disposables ? disposables.length : 0;
            for (; index < len; index++) {
                var next = disposables[index];
                if (!next)
                    continue;
                if (trapExceptions) {
                    var ex = disposeSingle(next, true);
                    if (ex) {
                        if (!exceptions)
                            exceptions = [];
                        exceptions.push(ex);
                    }
                }
                else {
                    var success = false;
                    try {
                        disposeSingle(next, false);
                        success = true;
                    }
                    // Don't trap the exception in order to allow it to propagate the stack trace.
                    finally {
                        if (!success && index + 1 < len) {
                            /* If code is 'continued' by the debugger,
                             * need to ensure the rest of the disposables are cared for. */
                            disposeTheseInternal(disposables, false, index + 1);
                        }
                    }
                    // Just in case...  Should never happen, but asserts the intention.
                    if (!success)
                        break;
                }
            }
            return exceptions;
        }
        var OBJECT_POOL = "ObjectPool", _MAX_SIZE = "_maxSize", ABSOLUTE_MAX_SIZE = 65536, MUST_BE_GT1 = "Must be at valid number least 1.", MUST_BE_LTM = "Must be less than or equal to " + ABSOLUTE_MAX_SIZE + ".";
        var ObjectPool = /** @class */ (function (_super) {
            __extends(ObjectPool, _super);
            function ObjectPool(_maxSize, _generator, _recycler) {
                var _this = _super.call(this) || this;
                _this._maxSize = _maxSize;
                _this._generator = _generator;
                _this._recycler = _recycler;
                /**
                 * By default will clear after 5 seconds of non-use.
                 */
                _this.autoClearTimeout = 5000;
                if (isNaN(_maxSize) || _maxSize < 1)
                    throw new Exceptions.ArgumentOutOfRangeException(_MAX_SIZE, _maxSize, MUST_BE_GT1);
                if (_maxSize > ABSOLUTE_MAX_SIZE)
                    throw new Exceptions.ArgumentOutOfRangeException(_MAX_SIZE, _maxSize, MUST_BE_LTM);
                _this._localAbsMaxSize = Math.min(_maxSize * 2, ABSOLUTE_MAX_SIZE);
                var _ = _this;
                _._disposableObjectName = OBJECT_POOL;
                _._pool = [];
                _._trimmer = new Threading.Tasks.TaskHandler(function () { return _._trim(); });
                var clear = function () { return _._clear(); };
                _._flusher = new Threading.Tasks.TaskHandler(clear);
                _._autoFlusher = new Threading.Tasks.TaskHandler(clear);
                return _this;
            }
            Object.defineProperty(ObjectPool.prototype, "maxSize", {
                /**
                 * Defines the maximum at which trimming should allow.
                 * @returns {number}
                 */
                get: function () {
                    return this._maxSize;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(ObjectPool.prototype, "count", {
                /**
                 * Current number of objects in pool.
                 * @returns {number}
                 */
                get: function () {
                    var p = this._pool;
                    return p ? p.length : 0;
                },
                enumerable: false,
                configurable: true
            });
            ObjectPool.prototype._trim = function () {
                var pool = this._pool;
                while (pool.length > this._maxSize) {
                    dispose.single(pool.pop(), true);
                }
            };
            /**
             * Will trim ensure the pool is less than the maxSize.
             * @param defer A delay before trimming.  Will be overridden by later calls.
             */
            ObjectPool.prototype.trim = function (defer) {
                this.throwIfDisposed();
                this._trimmer.start(defer);
            };
            ObjectPool.prototype._clear = function () {
                var _ = this;
                var p = _._pool;
                _._trimmer.cancel();
                _._flusher.cancel();
                _._autoFlusher.cancel();
                dispose.these.noCopy(p, true);
                p.length = 0;
            };
            /**
             * Will clear out the pool.
             * Cancels any scheduled trims when executed.
             * @param defer A delay before clearing.  Will be overridden by later calls.
             */
            ObjectPool.prototype.clear = function (defer) {
                this.throwIfDisposed();
                this._flusher.start(defer);
            };
            ObjectPool.prototype.toArrayAndClear = function () {
                var _ = this;
                _.throwIfDisposed();
                _._trimmer.cancel();
                _._flusher.cancel();
                var p = _._pool;
                _._pool = [];
                return p;
            };
            /**
             * Shortcut for toArrayAndClear();
             */
            ObjectPool.prototype.dump = function () {
                return this.toArrayAndClear();
            };
            ObjectPool.prototype._onDispose = function () {
                _super.prototype._onDispose.call(this);
                var _ = this;
                _._generator = null;
                _._recycler = null;
                dispose(_._trimmer, _._flusher, _._autoFlusher);
                _._trimmer = null;
                _._flusher = null;
                _._autoFlusher = null;
                _._pool.length = 0;
                _._pool = null;
            };
            ObjectPool.prototype.extendAutoClear = function () {
                var _ = this;
                _.throwIfDisposed();
                var t = _.autoClearTimeout;
                if (isFinite(t) && !_._autoFlusher.isScheduled)
                    _._autoFlusher.start(t);
            };
            ObjectPool.prototype.add = function (o) {
                var _ = this;
                _.throwIfDisposed();
                if (_._pool.length >= _._localAbsMaxSize) {
                    // Getting too big, dispose immediately...
                    dispose(o);
                }
                else {
                    if (_._recycler)
                        _._recycler(o);
                    _._pool.push(o);
                    var m = _._maxSize;
                    if (m < ABSOLUTE_MAX_SIZE && _._pool.length > m)
                        _._trimmer.start(500);
                }
                _.extendAutoClear();
            };
            ObjectPool.prototype._onTaken = function () {
                var _ = this, len = _._pool.length;
                if (len <= _._maxSize)
                    _._trimmer.cancel();
                if (len)
                    _.extendAutoClear();
            };
            ObjectPool.prototype.tryTake = function () {
                var _ = this;
                _.throwIfDisposed();
                try {
                    return _._pool.pop();
                }
                finally {
                    _._onTaken();
                }
            };
            ObjectPool.prototype.take = function (factory) {
                var _ = this;
                _.throwIfDisposed();
                if (!_._generator && !factory)
                    throw new Exceptions.ArgumentException("factory", "Must provide a factory if on was not provided at construction time.");
                try {
                    return _._pool.pop() || factory && factory() || _._generator();
                }
                finally {
                    _._onTaken();
                }
            };
            return ObjectPool;
        }(DisposableBase));
        Disposable.ObjectPool = ObjectPool;
    })(Disposable = System.Disposable || (System.Disposable = {}));
    var Promises;
    (function (Promises) {
        var VOID0 = void 0, NULL = null, PROMISE = "Promise", PROMISE_STATE = PROMISE + "State", THEN = "then", TARGET = "target";
        function isPromise(value) {
            return Type.hasMemberOfType(value, THEN, Type.FUNCTION);
        }
        function resolve(value, resolver, promiseFactory) {
            var nextValue = resolver
                ? resolver(value)
                : value;
            return nextValue && isPromise(nextValue)
                ? Promise.wrap(nextValue)
                : promiseFactory(nextValue);
        }
        function handleResolution(p, value, resolver) {
            try {
                var v = resolver ? resolver(value) : value;
                if (p)
                    p.resolve(v);
                return null;
            }
            catch (ex) {
                if (p)
                    p.reject(ex);
                return ex;
            }
        }
        function handleResolutionMethods(targetFulfill, targetReject, value, resolver) {
            try {
                var v = resolver ? resolver(value) : value;
                if (targetFulfill)
                    targetFulfill(v);
            }
            catch (ex) {
                if (targetReject)
                    targetReject(ex);
            }
        }
        function handleDispatch(p, onFulfilled, onRejected) {
            if (p instanceof PromiseBase)
                p.thenThis(onFulfilled, onRejected);
            else
                p.then(onFulfilled, onRejected);
        }
        function handleSyncIfPossible(p, onFulfilled, onRejected) {
            if (p instanceof PromiseBase)
                return p.thenSynchronous(onFulfilled, onRejected);
            else
                return p.then(onFulfilled, onRejected);
        }
        function newODE() {
            return new Disposable.ObjectDisposedException("Promise", "An underlying promise-result was disposed.");
        }
        var PromiseState = /** @class */ (function (_super) {
            __extends(PromiseState, _super);
            function PromiseState(_state, _result, _error) {
                var _this = _super.call(this) || this;
                _this._state = _state;
                _this._result = _result;
                _this._error = _error;
                _this._disposableObjectName = PROMISE_STATE;
                return _this;
            }
            PromiseState.prototype._onDispose = function () {
                this._state = VOID0;
                this._result = VOID0;
                this._error = VOID0;
            };
            PromiseState.prototype.getState = function () {
                return this._state;
            };
            Object.defineProperty(PromiseState.prototype, "state", {
                get: function () {
                    return this._state;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(PromiseState.prototype, "isPending", {
                get: function () {
                    return this.getState() === Promise.State.Pending;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(PromiseState.prototype, "isSettled", {
                get: function () {
                    return this
                        .getState() !=
                        Promise.State.Pending; // Will also include undefined==0 aka disposed!=resolved.
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(PromiseState.prototype, "isFulfilled", {
                get: function () {
                    return this.getState() === Promise.State.Fulfilled;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(PromiseState.prototype, "isRejected", {
                get: function () {
                    return this.getState() === Promise.State.Rejected;
                },
                enumerable: false,
                configurable: true
            });
            /*
             * Providing overrides allows for special defer or lazy sub classes.
             */
            PromiseState.prototype.getResult = function () {
                return this._result;
            };
            Object.defineProperty(PromiseState.prototype, "result", {
                get: function () {
                    this.throwIfDisposed();
                    return this.getResult();
                },
                enumerable: false,
                configurable: true
            });
            PromiseState.prototype.getError = function () {
                return this._error;
            };
            Object.defineProperty(PromiseState.prototype, "error", {
                get: function () {
                    this.throwIfDisposed();
                    return this.getError();
                },
                enumerable: false,
                configurable: true
            });
            return PromiseState;
        }(Disposable.DisposableBase));
        Promises.PromiseState = PromiseState;
        var PromiseBase = /** @class */ (function (_super) {
            __extends(PromiseBase, _super);
            function PromiseBase() {
                var _this = _super.call(this, Promise.State.Pending) || this;
                _this._disposableObjectName = PROMISE;
                return _this;
            }
            /**
             * Standard .then method that defers execution until resolved.
             * @param onFulfilled
             * @param onRejected
             * @returns {Promise}
             */
            PromiseBase.prototype.then = function (onFulfilled, onRejected) {
                var _this = this;
                this.throwIfDisposed();
                return new Promise(function (resolve, reject) {
                    _this.thenThis(function (result) {
                        return handleResolutionMethods(resolve, reject, result, onFulfilled);
                    }, function (error) {
                        return onRejected
                            ? handleResolutionMethods(resolve, reject, error, onRejected)
                            : reject(error);
                    });
                });
            };
            /**
             * Same as .then but doesn't trap errors.  Exceptions may end up being fatal.
             * @param onFulfilled
             * @param onRejected
             * @returns {Promise}
             */
            PromiseBase.prototype.thenAllowFatal = function (onFulfilled, onRejected) {
                var _this = this;
                this.throwIfDisposed();
                return new Promise(function (resolve, reject) {
                    _this.thenThis(function (result) {
                        return resolve((onFulfilled ? onFulfilled(result) : result));
                    }, function (error) {
                        return reject(onRejected ? onRejected(error) : error);
                    });
                });
            };
            /**
             * .done is provided as a non-standard means that maps to similar functionality in other promise libraries.
             * As stated by promisejs.org: 'then' is to 'done' as 'map' is to 'forEach'.
             * @param onFulfilled
             * @param onRejected
             */
            PromiseBase.prototype.done = function (onFulfilled, onRejected) {
                var _this = this;
                Threading.defer(function () {
                    return _this.thenThis(onFulfilled, onRejected);
                });
            };
            /**
             * Will yield for a number of milliseconds from the time called before continuing.
             * @param milliseconds
             * @returns A promise that yields to the current execution and executes after a delay.
             */
            PromiseBase.prototype.delayFromNow = function (milliseconds) {
                var _this = this;
                if (milliseconds === void 0) { milliseconds = 0; }
                this.throwIfDisposed();
                return new Promise(function (resolve, reject) {
                    Threading.defer(function () {
                        _this.thenThis(function (v) { return resolve(v); }, function (e) { return reject(e); });
                    }, milliseconds);
                }, true // Since the resolve/reject is deferred.
                );
            };
            /**
             * Will yield for a number of milliseconds from after this promise resolves.
             * If the promise is already resolved, the delay will start from now.
             * @param milliseconds
             * @returns A promise that yields to the current execution and executes after a delay.
             */
            PromiseBase.prototype.delayAfterResolve = function (milliseconds) {
                var _this = this;
                if (milliseconds === void 0) { milliseconds = 0; }
                this.throwIfDisposed();
                if (this.isSettled)
                    return this.delayFromNow(milliseconds);
                return new Promise(function (resolve, reject) {
                    _this.thenThis(function (v) { return Threading.defer(function () { return resolve(v); }, milliseconds); }, function (e) { return Threading.defer(function () { return reject(e); }, milliseconds); });
                }, true // Since the resolve/reject is deferred.
                );
            };
            /**
             * Shortcut for trapping a rejection.
             * @param onRejected
             * @returns {PromiseBase<TResult>}
             */
            PromiseBase.prototype['catch'] = function (onRejected) {
                return this.then(VOID0, onRejected);
            };
            /**
             * Shortcut for trapping a rejection but will allow exceptions to propagate within the onRejected handler.
             * @param onRejected
             * @returns {PromiseBase<TResult>}
             */
            PromiseBase.prototype.catchAllowFatal = function (onRejected) {
                return this.thenAllowFatal(VOID0, onRejected);
            };
            /**
             * Shortcut to for handling either resolve or reject.
             * @param fin
             * @returns {PromiseBase<TResult>}
             */
            PromiseBase.prototype['finally'] = function (fin) {
                return this.then(fin, fin);
            };
            /**
             * Shortcut to for handling either resolve or reject but will allow exceptions to propagate within the handler.
             * @param fin
             * @returns {PromiseBase<TResult>}
             */
            PromiseBase.prototype.finallyAllowFatal = function (fin) {
                return this.thenAllowFatal(fin, fin);
            };
            /**
             * Shortcut to for handling either resolve or reject.  Returns the current promise instead.
             * You may not need an additional promise result, and this will not create a new one.
             * @param fin
             * @param synchronous
             * @returns {PromiseBase}
             */
            PromiseBase.prototype.finallyThis = function (fin, synchronous) {
                this.throwIfDisposed();
                var f = synchronous ? fin : function () { return Threading.deferImmediate(fin); };
                this.thenThis(f, f);
                return this;
            };
            return PromiseBase;
        }(PromiseState));
        Promises.PromiseBase = PromiseBase;
        var Resolvable = /** @class */ (function (_super) {
            __extends(Resolvable, _super);
            function Resolvable() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Resolvable.prototype.thenSynchronous = function (onFulfilled, onRejected) {
                this.throwIfDisposed();
                try {
                    switch (this.state) {
                        case Promise.State.Fulfilled:
                            return onFulfilled
                                ? resolve(this._result, onFulfilled, Promise.resolve)
                                : this; // Provided for catch cases.
                        case Promise.State.Rejected:
                            return onRejected
                                ? resolve(this._error, onRejected, Promise.resolve)
                                : this;
                    }
                }
                catch (ex) {
                    return new Rejected(ex);
                }
                throw new Error("Invalid state for a resolved promise.");
            };
            Resolvable.prototype.thenThis = function (onFulfilled, onRejected) {
                this.throwIfDisposed();
                switch (this.state) {
                    case Promise.State.Fulfilled:
                        if (onFulfilled)
                            onFulfilled(this._result);
                        break;
                    case Promise.State.Rejected:
                        if (onRejected)
                            onRejected(this._error);
                        break;
                }
                return this;
            };
            return Resolvable;
        }(PromiseBase));
        Promises.Resolvable = Resolvable;
        /**
         * The simplest usable version of a promise which returns synchronously the resolved state provided.
         */
        var Resolved = /** @class */ (function (_super) {
            __extends(Resolved, _super);
            function Resolved(state, result, error) {
                var _this = _super.call(this) || this;
                _this._result = result;
                _this._error = error;
                _this._state = state;
                return _this;
            }
            return Resolved;
        }(Resolvable));
        Promises.Resolved = Resolved;
        /**
         * A fulfilled Resolved<T>.  Provided for readability.
         */
        var Fulfilled = /** @class */ (function (_super) {
            __extends(Fulfilled, _super);
            function Fulfilled(value) {
                return _super.call(this, Promise.State.Fulfilled, value) || this;
            }
            return Fulfilled;
        }(Resolved));
        Promises.Fulfilled = Fulfilled;
        /**
         * A rejected Resolved<T>.  Provided for readability.
         */
        var Rejected = /** @class */ (function (_super) {
            __extends(Rejected, _super);
            function Rejected(error) {
                return _super.call(this, Promise.State.Rejected, VOID0, error) || this;
            }
            return Rejected;
        }(Resolved));
        Promises.Rejected = Rejected;
        /**
         * Provided as a means for extending the interface of other PromiseLike<T> objects.
         */
        var PromiseWrapper = /** @class */ (function (_super) {
            __extends(PromiseWrapper, _super);
            function PromiseWrapper(_target) {
                var _this = _super.call(this) || this;
                _this._target = _target;
                if (!_target)
                    throw new Exceptions.ArgumentNullException(TARGET);
                if (!isPromise(_target))
                    throw new Exceptions.ArgumentException(TARGET, "Must be a promise-like object.");
                _target.then(function (v) {
                    _this._state = Promise.State.Fulfilled;
                    _this._result = v;
                    _this._error = VOID0;
                    _this._target = VOID0;
                }, function (e) {
                    _this._state = Promise.State.Rejected;
                    _this._error = e;
                    _this._target = VOID0;
                });
                return _this;
            }
            PromiseWrapper.prototype.thenSynchronous = function (onFulfilled, onRejected) {
                this.throwIfDisposed();
                var t = this._target;
                if (!t)
                    return _super.prototype.thenSynchronous.call(this, onFulfilled, onRejected);
                return new Promise(function (resolve, reject) {
                    handleDispatch(t, function (result) { return handleResolutionMethods(resolve, reject, result, onFulfilled); }, function (error) { return onRejected
                        ? handleResolutionMethods(resolve, null, error, onRejected)
                        : reject(error); });
                }, true);
            };
            PromiseWrapper.prototype.thenThis = function (onFulfilled, onRejected) {
                this.throwIfDisposed();
                var t = this._target;
                if (!t)
                    return _super.prototype.thenThis.call(this, onFulfilled, onRejected);
                handleDispatch(t, onFulfilled, onRejected);
                return this;
            };
            PromiseWrapper.prototype._onDispose = function () {
                _super.prototype._onDispose.call(this);
                this._target = VOID0;
            };
            return PromiseWrapper;
        }(Resolvable));
        /**
         * This promise class that facilitates pending resolution.
         */
        var Promise = /** @class */ (function (_super) {
            __extends(Promise, _super);
            /*
             * A note about deferring:
             * The caller can set resolveImmediate to true if they intend to initialize code that will end up being deferred itself.
             * This eliminates the extra defer that will occur internally.
             * But for the most part, resolveImmediate = false (the default) will ensure the constructor will not block.
             *
             * resolveUsing allows for the same ability but does not defer by default: allowing the caller to take on the work load.
             * If calling resolve or reject and a deferred response is desired, then use deferImmediate with a closure to do so.
             */
            function Promise(resolver, forceSynchronous) {
                if (forceSynchronous === void 0) { forceSynchronous = false; }
                var _this = _super.call(this) || this;
                if (resolver)
                    _this.resolveUsing(resolver, forceSynchronous);
                return _this;
            }
            Promise.prototype.thenSynchronous = function (onFulfilled, onRejected) {
                this.throwIfDisposed();
                // Already fulfilled?
                if (this._state)
                    return _super.prototype.thenSynchronous.call(this, onFulfilled, onRejected);
                var p = new Promise();
                (this._waiting || (this._waiting = []))
                    .push(pools.PromiseCallbacks.init(onFulfilled, onRejected, p));
                return p;
            };
            Promise.prototype.thenThis = function (onFulfilled, onRejected) {
                this.throwIfDisposed();
                // Already fulfilled?
                if (this._state)
                    return _super.prototype.thenThis.call(this, onFulfilled, onRejected);
                (this._waiting || (this._waiting = []))
                    .push(pools.PromiseCallbacks.init(onFulfilled, onRejected));
                return this;
            };
            Promise.prototype._onDispose = function () {
                _super.prototype._onDispose.call(this);
                this._resolvedCalled = VOID0;
            };
            Promise.prototype.resolveUsing = function (resolver, forceSynchronous) {
                var _this = this;
                if (forceSynchronous === void 0) { forceSynchronous = false; }
                if (!resolver)
                    throw new Exceptions.ArgumentNullException("resolver");
                if (this._resolvedCalled)
                    throw new Exceptions.InvalidOperationException(".resolve() already called.");
                if (this.state)
                    throw new Exceptions.InvalidOperationException("Already resolved: " + Promise.State[this.state]);
                this._resolvedCalled = true;
                var state = 0;
                var rejectHandler = function (reason) {
                    if (state) {
                        // Someone else's promise handling down stream could double call this. :\
                        console.warn(state == -1
                            ? "Rejection called multiple times"
                            : "Rejection called after fulfilled.");
                    }
                    else {
                        state = -1;
                        _this._resolvedCalled = false;
                        _this.reject(reason);
                    }
                };
                var fulfillHandler = function (v) {
                    if (state) {
                        // Someone else's promise handling down stream could double call this. :\
                        console.warn(state == 1
                            ? "Fulfill called multiple times"
                            : "Fulfill called after rejection.");
                    }
                    else {
                        state = 1;
                        _this._resolvedCalled = false;
                        _this.resolve(v);
                    }
                };
                // There are some performance edge cases where there caller is not blocking upstream and does not need to defer.
                if (forceSynchronous)
                    resolver(fulfillHandler, rejectHandler);
                else
                    Threading.deferImmediate(function () { return resolver(fulfillHandler, rejectHandler); });
            };
            Promise.prototype._emitDisposalRejection = function (p) {
                var d = p.wasDisposed;
                if (d)
                    this._rejectInternal(newODE());
                return d;
            };
            Promise.prototype._resolveInternal = function (result) {
                var _this = this;
                if (this.wasDisposed)
                    return;
                // Note: Avoid recursion if possible.
                // Check ahead of time for resolution and resolve appropriately
                while (result instanceof PromiseBase) {
                    var r = result;
                    if (this._emitDisposalRejection(r))
                        return;
                    switch (r.state) {
                        case Promise.State.Pending:
                            r.thenSynchronous(function (v) { return _this._resolveInternal(v); }, function (e) { return _this._rejectInternal(e); });
                            return;
                        case Promise.State.Rejected:
                            this._rejectInternal(r.error);
                            return;
                        case Promise.State.Fulfilled:
                            result = r.result;
                            break;
                    }
                }
                if (isPromise(result)) {
                    result.then(function (v) { return _this._resolveInternal(v); }, function (e) { return _this._rejectInternal(e); });
                }
                else {
                    this._state = Promise.State.Fulfilled;
                    this._result = result;
                    this._error = VOID0;
                    var o = this._waiting;
                    if (o) {
                        this._waiting = VOID0;
                        for (var _i = 0, o_1 = o; _i < o_1.length; _i++) {
                            var c = o_1[_i];
                            var onFulfilled = c.onFulfilled, promise = c.promise;
                            pools.PromiseCallbacks.recycle(c);
                            //let ex =
                            handleResolution(promise, result, onFulfilled);
                            //if(!p && ex) console.error("Unhandled exception in onFulfilled:",ex);
                        }
                        o.length = 0;
                    }
                }
            };
            Promise.prototype._rejectInternal = function (error) {
                if (this.wasDisposed)
                    return;
                this._state = Promise.State.Rejected;
                this._error = error;
                var o = this._waiting;
                if (o) {
                    this._waiting = null; // null = finished. undefined = hasn't started.
                    for (var _i = 0, o_2 = o; _i < o_2.length; _i++) {
                        var c = o_2[_i];
                        var onRejected = c.onRejected, promise = c.promise;
                        pools.PromiseCallbacks.recycle(c);
                        if (onRejected) {
                            //let ex =
                            handleResolution(promise, error, onRejected);
                            //if(!p && ex) console.error("Unhandled exception in onRejected:",ex);
                        }
                        else if (promise)
                            promise.reject(error);
                    }
                    o.length = 0;
                }
            };
            Promise.prototype.resolve = function (result, throwIfSettled) {
                if (throwIfSettled === void 0) { throwIfSettled = false; }
                this.throwIfDisposed();
                if (result == this)
                    throw new Exceptions.InvalidOperationException("Cannot resolve a promise as itself.");
                if (this._state) {
                    // Same value? Ignore...
                    if (!throwIfSettled || this._state == Promise.State.Fulfilled && this._result === result)
                        return;
                    throw new Exceptions.InvalidOperationException("Changing the fulfilled state/value of a promise is not supported.");
                }
                if (this._resolvedCalled) {
                    if (throwIfSettled)
                        throw new Exceptions.InvalidOperationException(".resolve() already called.");
                    return;
                }
                this._resolveInternal(result);
            };
            Promise.prototype.reject = function (error, throwIfSettled) {
                if (throwIfSettled === void 0) { throwIfSettled = false; }
                this.throwIfDisposed();
                if (this._state) {
                    // Same value? Ignore...
                    if (!throwIfSettled || this._state == Promise.State.Rejected && this._error === error)
                        return;
                    throw new Exceptions.InvalidOperationException("Changing the rejected state/value of a promise is not supported.");
                }
                if (this._resolvedCalled) {
                    if (throwIfSettled)
                        throw new Exceptions.InvalidOperationException(".resolve() already called.");
                    return;
                }
                this._rejectInternal(error);
            };
            return Promise;
        }(Resolvable));
        Promises.Promise = Promise;
        /**
         * By providing an ArrayPromise we expose useful methods/shortcuts for dealing with array results.
         */
        var ArrayPromise = /** @class */ (function (_super) {
            __extends(ArrayPromise, _super);
            function ArrayPromise() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            /**
             * Simplifies the use of a map function on an array of results when the source is assured to be an array.
             * @param transform
             * @returns {PromiseBase<Array<any>>}
             */
            ArrayPromise.prototype.map = function (transform) {
                var _this = this;
                this.throwIfDisposed();
                return new ArrayPromise(function (resolve) {
                    _this.thenThis(function (result) { return resolve(result.map(transform)); });
                }, true);
            };
            /**
             * Simplifies the use of a reduce function on an array of results when the source is assured to be an array.
             * @param reduction
             * @param initialValue
             * @returns {PromiseBase<any>}
             */
            ArrayPromise.prototype.reduce = function (reduction, initialValue) {
                return this
                    .thenSynchronous(function (result) { return result.reduce(reduction, initialValue); });
            };
            ArrayPromise.fulfilled = function (value) {
                return new ArrayPromise(function (resolve) { return value; }, true);
            };
            return ArrayPromise;
        }(Promise));
        Promises.ArrayPromise = ArrayPromise;
        var PROMISE_COLLECTION = "PromiseCollection";
        /**
         * A Promise collection exposes useful methods for handling a collection of promises and their results.
         */
        var PromiseCollection = /** @class */ (function (_super) {
            __extends(PromiseCollection, _super);
            function PromiseCollection(source) {
                var _this = _super.call(this) || this;
                _this._disposableObjectName = PROMISE_COLLECTION;
                _this._source = source && source.slice() || [];
                return _this;
            }
            PromiseCollection.prototype._onDispose = function () {
                _super.prototype._onDispose.call(this);
                this._source.length = 0;
                this._source = null;
            };
            Object.defineProperty(PromiseCollection.prototype, "promises", {
                /**
                 * Returns a copy of the source promises.
                 * @returns {PromiseLike<PromiseLike<any>>[]}
                 */
                get: function () {
                    this.throwIfDisposed();
                    return this._source.slice();
                },
                enumerable: false,
                configurable: true
            });
            /**
             * Returns a promise that is fulfilled with an array containing the fulfillment value of each promise, or is rejected with the same rejection reason as the first promise to be rejected.
             * @returns {PromiseBase<any>}
             */
            PromiseCollection.prototype.all = function () {
                this.throwIfDisposed();
                return Promise.all(this._source);
            };
            /**
             * Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
             * or rejected.
             * @returns {PromiseBase<any>} A new Promise.
             */
            PromiseCollection.prototype.race = function () {
                this.throwIfDisposed();
                return Promise.race(this._source);
            };
            /**
             * Returns a promise that is fulfilled with array of provided promises when all provided promises have resolved (fulfill or reject).
             * Unlike .all this method waits for all rejections as well as fulfillment.
             * @returns {PromiseBase<PromiseLike<any>[]>}
             */
            PromiseCollection.prototype.waitAll = function () {
                this.throwIfDisposed();
                return Promise.waitAll(this._source);
            };
            /**
             * Waits for all the values to resolve and then applies a transform.
             * @param transform
             * @returns {PromiseBase<Array<any>>}
             */
            PromiseCollection.prototype.map = function (transform) {
                var _this = this;
                this.throwIfDisposed();
                return new ArrayPromise(function (resolve) {
                    _this.all()
                        .thenThis(function (result) { return resolve(result.map(transform)); });
                }, true);
            };
            /**
             * Applies a transform to each promise and defers the result.
             * Unlike map, this doesn't wait for all promises to resolve, ultimately improving the async nature of the request.
             * @param transform
             * @returns {PromiseCollection<U>}
             */
            PromiseCollection.prototype.pipe = function (transform) {
                this.throwIfDisposed();
                return new PromiseCollection(this._source.map(function (p) { return handleSyncIfPossible(p, transform); }));
            };
            /**
             * Behaves like array reduce.
             * Creates the promise chain necessary to produce the desired result.
             * @param reduction
             * @param initialValue
             * @returns {PromiseBase<PromiseLike<any>>}
             */
            PromiseCollection.prototype.reduce = function (reduction, initialValue) {
                this.throwIfDisposed();
                return Promise.wrap(this._source
                    .reduce(function (previous, current, i, array) {
                    return handleSyncIfPossible(previous, function (p) { return handleSyncIfPossible(current, function (c) { return reduction(p, c, i, array); }); });
                }, isPromise(initialValue)
                    ? initialValue
                    : new Fulfilled(initialValue)));
            };
            return PromiseCollection;
        }(Disposable.DisposableBase));
        Promises.PromiseCollection = PromiseCollection;
        var pools;
        (function (pools) {
            // export module pending
            // {
            //
            //
            // 	var pool:ObjectPool<Promise<any>>;
            //
            // 	function getPool()
            // 	{
            // 		return pool || (pool = new ObjectPool<Promise<any>>(40, factory, c=>c.dispose()));
            // 	}
            //
            // 	function factory():Promise<any>
            // 	{
            // 		return new Promise();
            // 	}
            //
            // 	export function get():Promise<any>
            // 	{
            // 		var p:any = getPool().take();
            // 		p.__wasDisposed = false;
            // 		p._state = Promise.State.Pending;
            // 		return p;
            // 	}
            //
            // 	export function recycle<T>(c:Promise<T>):void
            // 	{
            // 		if(c) getPool().add(c);
            // 	}
            //
            // }
            //
            // export function recycle<T>(c:PromiseBase<T>):void
            // {
            // 	if(!c) return;
            // 	if(c instanceof Promise && c.constructor==Promise) pending.recycle(c);
            // 	else c.dispose();
            // }
            var PromiseCallbacks;
            (function (PromiseCallbacks) {
                var pool;
                //noinspection JSUnusedLocalSymbols
                function getPool() {
                    return pool ||
                        (pool = new Disposable.ObjectPool(40, factory, function (c) {
                            c.onFulfilled = NULL;
                            c.onRejected = NULL;
                            c.promise = NULL;
                        }));
                }
                function factory() {
                    return {
                        onFulfilled: NULL,
                        onRejected: NULL,
                        promise: NULL
                    };
                }
                function init(onFulfilled, onRejected, promise) {
                    var c = getPool().take();
                    c.onFulfilled = onFulfilled;
                    c.onRejected = onRejected;
                    c.promise = promise;
                    return c;
                }
                PromiseCallbacks.init = init;
                function recycle(c) {
                    getPool().add(c);
                }
                PromiseCallbacks.recycle = recycle;
            })(PromiseCallbacks = pools.PromiseCallbacks || (pools.PromiseCallbacks = {}));
        })(pools || (pools = {}));
        (function (Promise) {
            /**
             * The state of a promise.
             * https://github.com/domenic/promises-unwrapping/blob/master/docs/states-and-fates.md
             * If a promise is disposed the value will be undefined which will also evaluate (promise.state)==false.
             */
            var State;
            (function (State) {
                State[State["Pending"] = 0] = "Pending";
                State[State["Fulfilled"] = 1] = "Fulfilled";
                State[State["Rejected"] = -1] = "Rejected";
            })(State = Promise.State || (Promise.State = {}));
            Object.freeze(State);
            function factory(e) {
                return new Promise(e);
            }
            Promise.factory = factory;
            function group(first) {
                var rest = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    rest[_i - 1] = arguments[_i];
                }
                if (!first && !rest.length)
                    throw new Exceptions.ArgumentNullException("promises");
                return new PromiseCollection(((first) instanceof (Array) ? first : [first])
                    .concat(rest));
            }
            Promise.group = group;
            function all(first) {
                var rest = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    rest[_i - 1] = arguments[_i];
                }
                if (!first && !rest.length)
                    throw new Exceptions.ArgumentNullException("promises");
                var promises = ((first) instanceof (Array) ? first : [first]).concat(rest); // yay a copy!
                if (!promises.length || promises.every(function (v) { return !v; }))
                    return new ArrayPromise(function (r) { return r(promises); }, true); // it's a new empty, reuse it. :|
                // Eliminate deferred and take the parent since all .then calls happen on next cycle anyway.
                return new ArrayPromise(function (resolve, reject) {
                    var result = [];
                    var len = promises.length;
                    result.length = len;
                    // Using a set instead of -- a number is more reliable if just in case one of the provided promises resolves twice.
                    var remaining = new Collections.Set(promises.map(function (v, i) { return i; })); // get all the indexes...
                    var cleanup = function () {
                        reject = VOID0;
                        resolve = VOID0;
                        promises.length = 0;
                        promises = VOID0;
                        remaining.dispose();
                        remaining = VOID0;
                    };
                    var checkIfShouldResolve = function () {
                        var r = resolve;
                        if (r && !remaining.count) {
                            cleanup();
                            r(result);
                        }
                    };
                    var onFulfill = function (v, i) {
                        if (resolve) {
                            result[i] = v;
                            remaining.remove(i);
                            checkIfShouldResolve();
                        }
                    };
                    var onReject = function (e) {
                        var r = reject;
                        if (r) {
                            cleanup();
                            r(e);
                        }
                    };
                    var _loop_1 = function (i) {
                        var p = promises[i];
                        if (p)
                            p.then(function (v) { return onFulfill(v, i); }, onReject);
                        else
                            remaining.remove(i);
                        checkIfShouldResolve();
                    };
                    for (var i = 0; remaining && i < len; i++) {
                        _loop_1(i);
                    }
                });
            }
            Promise.all = all;
            function waitAll(first) {
                var rest = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    rest[_i - 1] = arguments[_i];
                }
                if (!first && !rest.length)
                    throw new Exceptions.ArgumentNullException("promises");
                var promises = ((first) instanceof (Array) ? first : [first]).concat(rest); // yay a copy!
                if (!promises.length || promises.every(function (v) { return !v; }))
                    return new ArrayPromise(function (r) { return r(promises); }, true); // it's a new empty, reuse it. :|
                // Eliminate deferred and take the parent since all .then calls happen on next cycle anyway.
                return new ArrayPromise(function (resolve, reject) {
                    var len = promises.length;
                    // Using a set instead of -- a number is more reliable if just in case one of the provided promises resolves twice.
                    var remaining = new Collections.Set(promises.map(function (v, i) { return i; })); // get all the indexes...
                    var cleanup = function () {
                        reject = NULL;
                        resolve = NULL;
                        remaining.dispose();
                        remaining = NULL;
                    };
                    var checkIfShouldResolve = function () {
                        var r = resolve;
                        if (r && !remaining.count) {
                            cleanup();
                            r(promises);
                        }
                    };
                    var onResolved = function (i) {
                        if (remaining) {
                            remaining.remove(i);
                            checkIfShouldResolve();
                        }
                    };
                    var _loop_2 = function (i) {
                        var p = promises[i];
                        if (p)
                            p.then(function (v) { return onResolved(i); }, function (e) { return onResolved(i); });
                        else
                            onResolved(i);
                    };
                    for (var i = 0; remaining && i < len; i++) {
                        _loop_2(i);
                    }
                });
            }
            Promise.waitAll = waitAll;
            function race(first) {
                var rest = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    rest[_i - 1] = arguments[_i];
                }
                var promises = first && ((first) instanceof (Array) ? first : [first]).concat(rest); // yay a copy?
                if (!promises || !promises.length || !(promises = promises.filter(function (v) { return v != null; })).length)
                    throw new Exceptions.ArgumentException("Nothing to wait for.");
                var len = promises.length;
                // Only one?  Nothing to race.
                if (len == 1)
                    return wrap(promises[0]);
                // Look for already resolved promises and the first one wins.
                for (var i = 0; i < len; i++) {
                    var p = promises[i];
                    if (p instanceof PromiseBase && p.isSettled)
                        return p;
                }
                return new Promise(function (resolve, reject) {
                    var cleanup = function () {
                        reject = NULL;
                        resolve = NULL;
                        promises.length = 0;
                        promises = NULL;
                    };
                    var onResolve = function (r, v) {
                        if (r) {
                            cleanup();
                            r(v);
                        }
                    };
                    var onFulfill = function (v) { return onResolve(resolve, v); };
                    var onReject = function (e) { return onResolve(reject, e); };
                    for (var _i = 0, promises_1 = promises; _i < promises_1.length; _i++) {
                        var p = promises_1[_i];
                        if (!resolve)
                            break;
                        p.then(onFulfill, onReject);
                    }
                });
            }
            Promise.race = race;
            function resolve(value) {
                return isPromise(value) ? wrap(value) : new Fulfilled(value);
            }
            Promise.resolve = resolve;
            /**
             * Syntactic shortcut for avoiding 'new'.
             * @param resolver
             * @param forceSynchronous
             * @returns {Promise}
             */
            function using(resolver, forceSynchronous) {
                if (forceSynchronous === void 0) { forceSynchronous = false; }
                return new Promise(resolver, forceSynchronous);
            }
            Promise.using = using;
            function resolveAll(first) {
                var rest = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    rest[_i - 1] = arguments[_i];
                }
                if (!first && !rest.length)
                    throw new Exceptions.ArgumentNullException("resolutions");
                return new PromiseCollection(((first) instanceof (Array) ? first : [first])
                    .concat(rest)
                    .map(function (v) { return resolve(v); }));
            }
            Promise.resolveAll = resolveAll;
            /**
             * Creates a PromiseCollection containing promises that will resolve on the next tick using the transform function.
             * This utility function does not chain promises together to create the result,
             * it only uses one promise per transform.
             * @param source
             * @param transform
             * @returns {PromiseCollection<T>}
             */
            function map(source, transform) {
                return new PromiseCollection(source.map(function (d) { return new Promise(function (r, j) {
                    try {
                        r(transform(d));
                    }
                    catch (ex) {
                        j(ex);
                    }
                }); }));
            }
            Promise.map = map;
            /**
             * Creates a new rejected promise for the provided reason.
             * @param reason The reason the promise was rejected.
             * @returns A new rejected Promise.
             */
            function reject(reason) {
                return new Rejected(reason);
            }
            Promise.reject = reject;
            /**
             * Takes any Promise-Like object and ensures an extended version of it from this module.
             * @param target The Promise-Like object
             * @returns A new target that simply extends the target.
             */
            function wrap(target) {
                if (!target)
                    throw new Exceptions.ArgumentNullException(TARGET);
                return isPromise(target)
                    ? (target instanceof PromiseBase ? target : new PromiseWrapper(target))
                    : new Fulfilled(target);
            }
            Promise.wrap = wrap;
            /**
             * A function that acts like a 'then' method (aka then-able) can be extended by providing a function that takes an onFulfill and onReject.
             * @param then
             * @returns {PromiseWrapper<T>}
             */
            function createFrom(then) {
                if (!then)
                    throw new Exceptions.ArgumentNullException(THEN);
                return new PromiseWrapper({ then: then });
            }
            Promise.createFrom = createFrom;
        })(Promise = Promises.Promise || (Promises.Promise = {}));
        var LazyPromise = /** @class */ (function (_super) {
            __extends(LazyPromise, _super);
            function LazyPromise(_resolver) {
                var _this = _super.call(this) || this;
                _this._resolver = _resolver;
                if (!_resolver)
                    throw new Exceptions.ArgumentNullException("resolver");
                _this._resolvedCalled = true;
                return _this;
            }
            LazyPromise.prototype._onDispose = function () {
                _super.prototype._onDispose.call(this);
                this._resolver = VOID0;
            };
            LazyPromise.prototype._onThen = function () {
                var r = this._resolver;
                if (r) {
                    this._resolver = VOID0;
                    this._resolvedCalled = false;
                    this.resolveUsing(r);
                }
            };
            LazyPromise.prototype.thenSynchronous = function (onFulfilled, onRejected) {
                this._onThen();
                return _super.prototype.thenSynchronous.call(this, onFulfilled, onRejected);
            };
            LazyPromise.prototype.thenThis = function (onFulfilled, onRejected) {
                this._onThen();
                return _super.prototype.thenThis.call(this, onFulfilled, onRejected);
            };
            // NOTE: For a LazyPromise we need to be careful not to trigger the resolve for delay.
            /**
             * Will yield for a number of milliseconds from the time called before continuing.
             * @param milliseconds
             * @returns A promise that yields to the current execution and executes after a minimum delay.
             */
            LazyPromise.prototype.delayFromNow = function (milliseconds) {
                var _this = this;
                if (milliseconds === void 0) { milliseconds = 0; }
                this.throwIfDisposed();
                // If this is already guaranteed to resolve, the go ahead and pass to the super.
                if (!this._resolver || this.isSettled)
                    return _super.prototype.delayFromNow.call(this, milliseconds);
                /*
                 * If not triggered yet, then we create a special promise
                 * that only requests the resolution from the parent promise
                 * if a 'then' is called to ensure the lazy pattern.
                 */
                var pass;
                var timedOut = false;
                // Setup the timer.
                var timeout = Threading.defer(function () {
                    timedOut = true;
                    // If the promise was requested already go ahead and pass the request on to the parent.
                    if (pass)
                        pass();
                }, milliseconds);
                return new LazyPromise(function (resolve, reject) {
                    // A lazy promise only enters here if something called for a resolution.
                    pass = function () {
                        _this.thenThis(function (v) { return resolve(v); }, function (e) { return reject(e); });
                        timeout.dispose();
                        timeout = VOID0;
                        pass = VOID0;
                    };
                    // If the timeout completed already go ahead and pass the request on to the parent.
                    if (timedOut)
                        pass();
                    // Otherwise wait for the timeout to do it.
                });
            };
            /**
             * Will yield for a number of milliseconds from after this promise resolves.
             * If the promise is already resolved, the delay will start from now.
             * @param milliseconds
             * @returns A promise that yields to the current execution and executes after a delay.
             */
            LazyPromise.prototype.delayAfterResolve = function (milliseconds) {
                var _this = this;
                if (milliseconds === void 0) { milliseconds = 0; }
                this.throwIfDisposed();
                // If this is already guaranteed to resolve, the go ahead and pass to the super.
                if (!this._resolver || this.isSettled)
                    return _super.prototype.delayAfterResolve.call(this, milliseconds);
                /*
                 * If not triggered yet, then we create a special promise
                 * that only requests the resolution from the parent promise
                 * if a 'then' is called to ensure the lazy pattern.
                 */
                var pass;
                // Setup the timer.
                var timeout;
                var finalize = function () {
                    if (timeout) {
                        timeout.dispose();
                        timeout = VOID0;
                    }
                    // If the promise was requested already go ahead and pass the request on to the parent.
                    if (pass)
                        pass();
                    finalize = VOID0;
                };
                {
                    var detector = function () {
                        if (finalize) // We may already be wrapped up so never mind!
                            timeout = Threading.defer(finalize, milliseconds);
                    };
                    // Calling super.thenThis does not trigger resolution.
                    // This simply waits for resolution to happen.
                    // Is effectively the timer by when resolution has occurred.
                    _super.prototype.thenThis.call(this, detector, detector);
                    //noinspection JSUnusedAssignment
                    detector = null;
                }
                return new LazyPromise(function (resolve, reject) {
                    // Because of the lazy nature of this promise, this could enter here at any time.
                    if (_this.isPending) {
                        _this.thenThis(function (v) { return Threading.defer(function () { return resolve(v); }, milliseconds); }, function (e) { return Threading.defer(function () { return reject(e); }, milliseconds); });
                        finalize();
                    }
                    else {
                        // We don't know when this resolved and could have happened anytime after calling this delay method.
                        pass = function () {
                            _this.thenThis(function (v) { return resolve(v); }, function (e) { return reject(e); });
                        };
                        // Already finalized (aka resolved after a timeout)? Go now!
                        if (!finalize)
                            pass();
                    }
                });
            };
            return LazyPromise;
        }(Promise));
        Promises.LazyPromise = LazyPromise;
    })(Promises = System.Promises || (System.Promises = {}));
    var Threading;
    (function (Threading) {
        var Tasks;
        (function (Tasks) {
            var isNodeJS = false;
            self.onmessage = function (code) {
                try {
                    eval(code.data);
                }
                catch (e) {
                    // Do nothing
                }
            };
            var TaskStatus;
            (function (TaskStatus) {
                TaskStatus[TaskStatus["Created"] = 0] = "Created";
                TaskStatus[TaskStatus["WaitingToRun"] = 1] = "WaitingToRun";
                TaskStatus[TaskStatus["Running"] = 2] = "Running";
                TaskStatus[TaskStatus["RanToCompletion"] = 3] = "RanToCompletion";
                TaskStatus[TaskStatus["Cancelled"] = 4] = "Cancelled";
                TaskStatus[TaskStatus["Faulted"] = 5] = "Faulted";
            })(TaskStatus = Tasks.TaskStatus || (Tasks.TaskStatus = {}));
            var MAX_WORKERS = 16, VOID0 = void 0, URL = typeof self !== Type.UNDEFINED
                ? (self.URL ? self.URL : self.webkitURL)
                : null, _supports = !!(isNodeJS || self.Worker); // node always supports parallel
            var defaults = {
                evalPath: VOID0,
                maxConcurrency: (navigator.hardwareConcurrency || 4),
                allowSynchronous: true,
                env: {},
                envNamespace: "env"
            };
            function extend(from, to) {
                if (!to)
                    to = {};
                for (var _i = 0, _a = Object.keys(from); _i < _a.length; _i++) {
                    var i = _a[_i];
                    if (to[i] === VOID0)
                        to[i] = from[i];
                }
                return to;
            }
            function interact(w, onMessage, onError, message) {
                if (onMessage)
                    w.onmessage = onMessage;
                if (onError)
                    w.onerror = onError;
                if (message !== VOID0)
                    w.postMessage(message);
            }
            var WorkerPromise = /** @class */ (function (_super) {
                __extends(WorkerPromise, _super);
                function WorkerPromise(worker, data) {
                    return _super.call(this, function (resolve, reject) {
                        interact(worker, function (response) {
                            resolve(response.data);
                        }, function (e) {
                            reject(e);
                        }, data);
                    }, true) || this;
                }
                return WorkerPromise;
            }(Promises.Promise));
            var workers;
            (function (workers) {
                /*
                 * Note:
                 * Currently there is nothing preventing excessive numbers of workers from being generated.
                 * Eventually there will be a master pool count which will regulate these workers.
                 */
                function getPool(key) {
                    var pool = workerPools[key];
                    if (!pool) {
                        workerPools[key] = pool = new Disposable.ObjectPool(8);
                        pool.autoClearTimeout = 3000; // Fast cleanup... 1s.
                    }
                    return pool;
                }
                var workerPools = {};
                function recycle(w) {
                    if (w) {
                        w.onerror = null;
                        w.onmessage = null;
                        var k = w.__key;
                        if (k) {
                            getPool(k).add(w);
                        }
                        else {
                            Threading.deferImmediate(function () { return w.terminate(); });
                        }
                    }
                    return null;
                }
                workers.recycle = recycle;
                function tryGet(key) {
                    return getPool(key).tryTake();
                }
                workers.tryGet = tryGet;
                function getNew(key, url) {
                    var worker = new Threading.Worker(url);
                    worker.__key = key;
                    if (!worker.dispose) {
                        worker.dispose = function () {
                            worker.onmessage = null;
                            worker.onerror = null;
                            worker.dispose = null;
                            worker.terminate();
                        };
                    }
                    return worker;
                }
                workers.getNew = getNew;
            })(workers || (workers = {}));
            var Parallel = /** @class */ (function () {
                function Parallel(options) {
                    this.options = extend(defaults, options);
                    this._requiredScripts = [];
                    this._requiredFunctions = [];
                    this.ensureClampedMaxConcurrency();
                }
                Parallel.maxConcurrency = function (max) {
                    return new Parallel({ maxConcurrency: max });
                };
                Parallel.prototype._getWorkerSource = function (task, env) {
                    var scripts = this._requiredScripts, functions = this._requiredFunctions;
                    var preStr = "";
                    if (!isNodeJS && scripts.length) {
                        preStr += "importScripts(\"" + scripts.join('","') + "\");\r\n";
                    }
                    for (var _i = 0, functions_1 = functions; _i < functions_1.length; _i++) {
                        var _a = functions_1[_i], name_1 = _a.name, fn = _a.fn;
                        var source = fn.toString();
                        preStr += name_1
                            ? "var " + name_1 + " = " + source + ";"
                            : source;
                    }
                    env = JSON.stringify(env || {});
                    var ns = this.options.envNamespace;
                    return preStr + (isNodeJS
                        ? "process.on(\"message\", function(e) {global." + ns + " = " + env + ";process.send(JSON.stringify((" + task.toString() + ")(JSON.parse(e).data)))})"
                        : "self.onmessage = function(e) {var global = {}; global." + ns + " = " + env + ";self.postMessage((" + task.toString() + ")(e.data))}");
                };
                Parallel.prototype.require = function () {
                    var required = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        required[_i] = arguments[_i];
                    }
                    return this.requireThese(required);
                };
                Parallel.prototype.requireThese = function (required) {
                    for (var _i = 0, required_1 = required; _i < required_1.length; _i++) {
                        var a = required_1[_i];
                        switch (typeof a) {
                            case Type.STRING:
                                this._requiredScripts.push(a);
                                break;
                            case Type.FUNCTION:
                                this._requiredFunctions.push({ fn: a });
                                break;
                            case Type.OBJECT:
                                this._requiredFunctions.push(a);
                                break;
                            default:
                                throw new TypeError("Invalid type.");
                        }
                    }
                    return this;
                };
                Parallel.prototype._spawnWorker = function (task, env) {
                    var src = this._getWorkerSource(task, env);
                    if (Threading.Worker === VOID0)
                        return VOID0;
                    var worker = workers.tryGet(src);
                    if (worker)
                        return worker;
                    var scripts = this._requiredScripts;
                    var evalPath = this.options.evalPath;
                    if (!evalPath) {
                        if (isNodeJS)
                            throw new Error("Can't use NodeJS without eval.js!");
                        if (scripts.length)
                            throw new Error("Can't use required scripts without eval.js!");
                        if (!URL)
                            throw new Error("Can't create a blob URL in this browser!");
                    }
                    if (isNodeJS || scripts.length || !URL) {
                        worker = workers.getNew(src, evalPath);
                        worker.postMessage(src);
                    }
                    else if (URL) {
                        var blob = new Blob([src], { type: "text/javascript" });
                        var url = URL.createObjectURL(blob);
                        worker = workers.getNew(src, url);
                    }
                    return worker;
                };
                /**
                 * Schedules the task to be run in the worker pool.
                 * @param data
                 * @param task
                 * @param env
                 * @returns {Promise<U>|Promise}
                 */
                Parallel.prototype.startNew = function (data, task, env) {
                    var _ = this;
                    var maxConcurrency = this.ensureClampedMaxConcurrency();
                    var worker = maxConcurrency ? _._spawnWorker(task, extend(_.options.env, env || {})) : null;
                    if (worker) {
                        return new WorkerPromise(worker, data)
                            .finallyThis(function () { return workers.recycle(worker); });
                    }
                    if (_.options.allowSynchronous)
                        return this.startLocal(data, task);
                    throw new Error(maxConcurrency
                        ? "Workers do not exist and synchronous operation not allowed!"
                        : "'maxConcurrency' set to 0 but 'allowSynchronous' is false.");
                };
                /**
                 * Runs the task within the local thread/process.
                 * Is good for use with testing.
                 * @param data
                 * @param task
                 * @returns {Promise<U>|Promise}
                 */
                Parallel.prototype.startLocal = function (data, task) {
                    return new Promises.Promise(function (resolve, reject) {
                        try {
                            resolve(task(data));
                        }
                        catch (e) {
                            reject(e);
                        }
                    });
                };
                /**
                 * Returns an array of promises that each resolve after their task completes.
                 * Provides a potential performance benefit by not waiting for all promises to resolve before proceeding to next step.
                 * @param data
                 * @param task
                 * @param env
                 * @returns {PromiseCollection}
                 */
                Parallel.prototype.pipe = function (data, task, env) {
                    // The resultant promise collection will make an internal copy...
                    var result;
                    if (data && data.length) {
                        var len_1 = data.length;
                        var taskString = task.toString();
                        var maxConcurrency = this.ensureClampedMaxConcurrency();
                        var error_1;
                        var i_1 = 0;
                        var _loop_3 = function (w) {
                            var worker = maxConcurrency ? this_1._spawnWorker(taskString, env) : null;
                            if (!worker) {
                                if (!this_1.options.allowSynchronous)
                                    throw new Error(maxConcurrency
                                        ? "Workers do not exist and synchronous operation not allowed!"
                                        : "'maxConcurrency' set to 0 but 'allowSynchronous' is false.");
                                return { value: Promises.Promise.map(data, task) };
                            }
                            if (!result) {
                                // There is a small risk that the consumer could call .resolve() which would result in a double resolution.
                                // But it's important to minimize the number of objects created.
                                result = data.map(function (d) { return new Promises.Promise(); });
                            }
                            var next = function () {
                                if (error_1) {
                                    worker = workers.recycle(worker);
                                }
                                if (worker) {
                                    if (i_1 < len_1) {
                                        //noinspection JSReferencingMutableVariableFromClosure
                                        var ii = i_1++, p_1 = result[ii];
                                        var wp_1 = new WorkerPromise(worker, data[ii]);
                                        wp_1.thenSynchronous(function (r) {
                                            p_1.resolve(r);
                                            next();
                                        }, function (e) {
                                            if (!error_1) {
                                                error_1 = e;
                                                p_1.reject(e);
                                                worker = workers.recycle(worker);
                                            }
                                        })
                                            .finallyThis(function () {
                                            return wp_1.dispose();
                                        });
                                    }
                                    else {
                                        worker = workers.recycle(worker);
                                    }
                                }
                            };
                            next();
                        };
                        var this_1 = this;
                        for (var w = 0; !error_1 && i_1 < Math.min(len_1, maxConcurrency); w++) {
                            var state_1 = _loop_3(w);
                            if (typeof state_1 === "object")
                                return state_1.value;
                        }
                    }
                    return new Promises.PromiseCollection(result);
                };
                Parallel.prototype.ensureClampedMaxConcurrency = function () {
                    var maxConcurrency = this.options.maxConcurrency;
                    if (maxConcurrency && maxConcurrency > MAX_WORKERS) {
                        this.options.maxConcurrency = maxConcurrency = MAX_WORKERS;
                        console.warn("More than " + MAX_WORKERS + " workers can reach worker limits and cause unexpected results.  maxConcurrency reduced to " + MAX_WORKERS + ".");
                    }
                    return (maxConcurrency || maxConcurrency === 0) ? maxConcurrency : MAX_WORKERS;
                };
                /**
                 * Waits for all tasks to resolve and returns a promise with the results.
                 * @param data
                 * @param task
                 * @param env
                 * @returns {ArrayPromise}
                 */
                Parallel.prototype.map = function (data, task, env) {
                    var _this = this;
                    if (!data || !data.length)
                        return Promises.ArrayPromise.fulfilled(data && []);
                    // Would return the same result, but has extra overhead.
                    // return this.pipe(data,task).all();
                    data = data.slice(); // Never use the original.
                    return new Promises.ArrayPromise(function (resolve, reject) {
                        var result = [], len = data.length;
                        result.length = len;
                        var taskString = task.toString();
                        var maxConcurrency = _this.ensureClampedMaxConcurrency(), error;
                        var i = 0, resolved = 0;
                        var _loop_4 = function (w) {
                            var worker = _this._spawnWorker(taskString, env);
                            if (!worker) {
                                if (!_this.options.allowSynchronous)
                                    throw new Error("Workers do not exist and synchronous operation not allowed!");
                                // Concurrency doesn't matter in a single thread... Just queue it all up.
                                resolve(Promises.Promise.map(data, task).all());
                                return { value: void 0 };
                            }
                            var next = function () {
                                if (error) {
                                    worker = workers.recycle(worker);
                                }
                                if (worker) {
                                    if (i < len) {
                                        var ii_1 = i++;
                                        var wp_2 = new WorkerPromise(worker, data[ii_1]);
                                        wp_2.thenSynchronous(function (r) {
                                            result[ii_1] = r;
                                            next();
                                        }, function (e) {
                                            if (!error) {
                                                error = e;
                                                reject(e);
                                                worker = workers.recycle(worker);
                                            }
                                        })
                                            .thenThis(function () {
                                            resolved++;
                                            if (resolved > len)
                                                throw Error("Resolved count exceeds data length.");
                                            if (resolved === len)
                                                resolve(result);
                                        })
                                            .finallyThis(function () {
                                            return wp_2.dispose();
                                        });
                                    }
                                    else {
                                        worker = workers.recycle(worker);
                                    }
                                }
                            };
                            next();
                        };
                        for (var w = 0; !error && i < Math.min(len, maxConcurrency); w++) {
                            var state_2 = _loop_4(w);
                            if (typeof state_2 === "object")
                                return state_2.value;
                        }
                    });
                };
                Object.defineProperty(Parallel, "isSupported", {
                    get: function () { return _supports; },
                    enumerable: false,
                    configurable: true
                });
                Parallel.options = function (options) {
                    return new Parallel(options);
                };
                Parallel.require = function () {
                    var required = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        required[_i] = arguments[_i];
                    }
                    return (new Parallel()).requireThese(required);
                };
                Parallel.requireThese = function (required) {
                    return (new Parallel()).requireThese(required);
                };
                Parallel.startNew = function (data, task, env) {
                    return (new Parallel()).startNew(data, task, env);
                };
                //
                // forEach<T>(data:T[], task:(data:T) => void, env?:any):PromiseBase<void>
                // {}
                Parallel.map = function (data, task, env) {
                    return (new Parallel()).map(data, task, env);
                };
                return Parallel;
            }());
            Tasks.Parallel = Parallel;
            var TaskHandlerBase = /** @class */ (function (_super) {
                __extends(TaskHandlerBase, _super);
                function TaskHandlerBase() {
                    var _this = _super.call(this) || this;
                    _this._disposableObjectName = "TaskHandlerBase";
                    _this._timeoutId = null;
                    _this._status = TaskStatus.Created;
                    return _this;
                }
                Object.defineProperty(TaskHandlerBase.prototype, "isScheduled", {
                    get: function () {
                        return !!this._timeoutId;
                    },
                    enumerable: false,
                    configurable: true
                });
                /**
                 * Schedules/Reschedules triggering the task.
                 * @param defer Optional time to wait until triggering.
                 */
                TaskHandlerBase.prototype.start = function (defer) {
                    if (defer === void 0) { defer = 0; }
                    this.throwIfDisposed();
                    this.cancel();
                    this._status = TaskStatus.WaitingToRun;
                    if (!(defer > 0))
                        defer = 0; // A negation is used to catch edge cases.
                    if (isFinite(defer))
                        this._timeoutId = setTimeout(TaskHandlerBase._handler, defer, this);
                };
                TaskHandlerBase.prototype.runSynchronously = function () {
                    this.throwIfDisposed();
                    TaskHandlerBase._handler(this);
                };
                TaskHandlerBase.prototype.getStatus = function () {
                    return this._status;
                };
                Object.defineProperty(TaskHandlerBase.prototype, "status", {
                    get: function () {
                        return this.getStatus();
                    },
                    enumerable: false,
                    configurable: true
                });
                // Use a static function here to avoid recreating a new function every time.
                TaskHandlerBase._handler = function (d) {
                    d.cancel();
                    d._status = TaskStatus.Running;
                    try {
                        d._onExecute();
                        d._status = TaskStatus.RanToCompletion;
                    }
                    catch (ex) {
                        d._status = TaskStatus.Faulted;
                    }
                };
                TaskHandlerBase.prototype._onDispose = function () {
                    this.cancel();
                    this._status = null;
                };
                TaskHandlerBase.prototype.cancel = function () {
                    var id = this._timeoutId;
                    if (id) {
                        clearTimeout(id);
                        this._timeoutId = null;
                        this._status = TaskStatus.Cancelled;
                        return true;
                    }
                    return false;
                };
                return TaskHandlerBase;
            }(Disposable.DisposableBase));
            Tasks.TaskHandlerBase = TaskHandlerBase;
            var TaskHandler = /** @class */ (function (_super) {
                __extends(TaskHandler, _super);
                function TaskHandler(_action) {
                    var _this = _super.call(this) || this;
                    _this._action = _action;
                    if (!_action)
                        throw new Exceptions.ArgumentNullException("action");
                    return _this;
                }
                TaskHandler.prototype._onExecute = function () {
                    this._action();
                };
                TaskHandler.prototype._onDispose = function () {
                    _super.prototype._onDispose.call(this);
                    this._action = null;
                };
                return TaskHandler;
            }(TaskHandlerBase));
            Tasks.TaskHandler = TaskHandler;
            var Task = /** @class */ (function (_super) {
                __extends(Task, _super);
                function Task(valueFactory) {
                    var _this = _super.call(this) || this;
                    if (!valueFactory)
                        throw new Exceptions.ArgumentNullException("valueFactory");
                    _this._result = new Lazy(valueFactory, false);
                    return _this;
                }
                Task.prototype._onExecute = function () {
                    this._result.getValue();
                };
                Task.prototype.getResult = function () {
                    return this._result.value; // This will detect any potential recursion.
                };
                Task.prototype.getState = function () {
                    var r = this._result;
                    return r && {
                        status: this.getStatus(),
                        result: r.isValueCreated ? r.value : void 0,
                        error: r.error
                    };
                };
                Task.prototype.start = function (defer) {
                    if (this.getStatus() == TaskStatus.Created) {
                        _super.prototype.start.call(this, defer);
                    }
                };
                Task.prototype.runSynchronously = function () {
                    if (this.getStatus() == TaskStatus.Created) {
                        _super.prototype.runSynchronously.call(this);
                    }
                };
                Object.defineProperty(Task.prototype, "state", {
                    get: function () {
                        return this.getState();
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Task.prototype, "result", {
                    get: function () {
                        this.throwIfDisposed();
                        this.runSynchronously();
                        return this.getResult();
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Task.prototype, "error", {
                    get: function () {
                        this.throwIfDisposed();
                        return this._result.error;
                    },
                    enumerable: false,
                    configurable: true
                });
                Task.prototype._onDispose = function () {
                    _super.prototype._onDispose.call(this);
                    var r = this._result;
                    if (r) {
                        this._result = null;
                        r.dispose();
                    }
                };
                return Task;
            }(TaskHandlerBase));
            Tasks.Task = Task;
        })(Tasks = Threading.Tasks || (Threading.Tasks = {}));
        var Thread = /** @class */ (function () {
            function Thread() {
            }
            /**
                 * Suspends the current thread for the specified number of milliseconds. (Important: it's synchronous!!!)
                 * @param {Number} millisecondsTimeout The number of milliseconds for which the thread is suspended. If the value of the millisecondsTimeout argument is zero or negative, the operations is aborted.
                 */
            Thread.sleep = function (millisecondsTimeout) {
                if (millisecondsTimeout <= 0)
                    return;
                var start = new Date().getTime(), expire = start + millisecondsTimeout;
                while (new Date().getTime() < expire) {
                    //Hush... It will be over soon.
                }
            }; //end sleep()
            return Thread;
        }()); //end class Thread
        Threading.Thread = Thread;
    })(Threading = System.Threading || (System.Threading = {}));
    var Collections;
    (function (Collections) {
        var NAME = "CollectionBase", CMDC = "Cannot modify a disposed collection.", CMRO = "Cannot modify a read-only collection.", isRequireJS = false, isNodeJS = false, isCommonJS = false;
        var LINQ_PATH = "../../System.Linq/Linq";
        var STRING_EMPTY = "", ENDLESS_EXCEPTION_MESSAGE = "Cannot call forEach on an endless enumerable. " +
            "Would result in an infinite loop that could hang the current process.";
        var Enumeration;
        (function (Enumeration) {
            var VOID0 = void 0;
            var IteratorResult = /** @class */ (function () {
                function IteratorResult(value, index, done) {
                    if (done === void 0) { done = false; }
                    this.value = value;
                    if (typeof index == "boolean")
                        this.done = index;
                    else {
                        this.index = index;
                        this.done = done;
                    }
                    Object.freeze(this);
                }
                return IteratorResult;
            }());
            Enumeration.IteratorResult = IteratorResult;
            (function (IteratorResult) {
                IteratorResult.Done = new IteratorResult(VOID0, VOID0, true);
                function GetDone() { return IteratorResult.Done; }
                IteratorResult.GetDone = GetDone;
            })(IteratorResult = Enumeration.IteratorResult || (Enumeration.IteratorResult = {}));
            Object.freeze(IteratorResult);
            var EmptyEnumerable = /** @class */ (function () {
                function EmptyEnumerable() {
                    this.isEndless = false;
                }
                EmptyEnumerable.prototype.getEnumerator = function () {
                    return Enumeration.EmptyEnumerator;
                };
                return EmptyEnumerable;
            }());
            Enumeration.EmptyEnumerable = EmptyEnumerable;
            Enumeration.EmptyEnumerator = Object.freeze({
                current: void 0,
                moveNext: Functions.False,
                tryMoveNext: Functions.False,
                nextValue: Functions.Blank,
                next: IteratorResult.GetDone,
                "return": IteratorResult.GetDone,
                end: Functions.Blank,
                reset: Functions.Blank,
                dispose: Functions.Blank,
                isEndless: false
            });
            function throwIfEndless(isEndless) {
                if (isEndless)
                    throw new UnsupportedEnumerableException(ENDLESS_EXCEPTION_MESSAGE);
                return true;
            }
            Enumeration.throwIfEndless = throwIfEndless;
            function initArrayFrom(source, max) {
                if (max === void 0) { max = Infinity; }
                if (Type.isArrayLike(source)) {
                    var len = Math.min(source.length, max);
                    if (isFinite(len)) {
                        if (len > 65535)
                            return new Array(len);
                        var result = [];
                        result.length = len;
                        return result;
                    }
                }
                return [];
            }
            // Could be array, or IEnumerable...
            /**
             * Returns the enumerator for the specified collection, enumerator, or iterator.
             * If the source is identified as IEnumerator it will return the source as is.
             * @param source
             * @returns {any}
             */
            function from(source) {
                // To simplify and prevent null reference exceptions:
                if (!source)
                    return Enumeration.EmptyEnumerator;
                if ((source) instanceof (Array))
                    return new ArrayEnumerator(source);
                if (Type.isArrayLike(source)) {
                    return new IndexEnumerator(function () {
                        return {
                            source: source,
                            length: source.length,
                            pointer: 0,
                            step: 1
                        };
                    });
                }
                if (!Type.isPrimitive(source)) {
                    if (isEnumerable(source))
                        return source.getEnumerator();
                    if (Type.isFunction(source))
                        return new InfiniteEnumerator(source);
                    if (isEnumerator(source))
                        return source;
                    if (isIterator(source))
                        return new IteratorEnumerator(source);
                }
                throw new UnsupportedEnumerableException();
            }
            Enumeration.from = from;
            function isEnumerable(instance) {
                return Type.hasMemberOfType(instance, "getEnumerator", Type.FUNCTION);
            }
            Enumeration.isEnumerable = isEnumerable;
            function isEnumerableOrArrayLike(instance) {
                return Type.isArrayLike(instance) || isEnumerable(instance);
            }
            Enumeration.isEnumerableOrArrayLike = isEnumerableOrArrayLike;
            function isEnumerator(instance) {
                return Type.hasMemberOfType(instance, "moveNext", Type.FUNCTION);
            }
            Enumeration.isEnumerator = isEnumerator;
            function isIterator(instance) {
                return Type.hasMemberOfType(instance, "next", Type.FUNCTION);
            }
            Enumeration.isIterator = isIterator;
            function forEach(e, action, max) {
                if (max === void 0) { max = Infinity; }
                if (e === STRING_EMPTY)
                    return 0;
                if (e && max > 0) {
                    if (Type.isArrayLike(e)) {
                        // Assume e.length is constant or at least doesn't deviate to infinite or NaN.
                        throwIfEndless(!isFinite(max) && !isFinite(e.length));
                        var i = 0;
                        for (; i < Math.min(e.length, max); i++) {
                            if (action(e[i], i) === false)
                                break;
                        }
                        return i;
                    }
                    if (isEnumerator(e)) {
                        throwIfEndless(!isFinite(max) && e.isEndless);
                        var i = 0;
                        // Return value of action can be anything, but if it is (===) false then the forEach will discontinue.
                        while (max > i && e.moveNext()) {
                            if (action(e.current, i++) === false)
                                break;
                        }
                        return i;
                    }
                    if (isEnumerable(e)) {
                        throwIfEndless(!isFinite(max) && e.isEndless);
                        // For enumerators that aren't EnumerableBase, ensure dispose is called.
                        return Disposable.using(e.getEnumerator(), function (f) { return forEach(f, action, max); });
                    }
                    if (isIterator(e)) {
                        // For our purpose iterators are endless and a max must be specified before iterating.
                        throwIfEndless(!isFinite(max));
                        var i = 0, r = void 0;
                        // Return value of action can be anything, but if it is (===) false then the forEach will discontinue.
                        while (max > i && !(r = e.next()).done) {
                            if (action(r.value, i++) === false)
                                break;
                        }
                        return i;
                    }
                }
                return -1;
            }
            Enumeration.forEach = forEach;
            /**
             * Converts any enumerable to an array.
             * @param source
             * @param max Stops after max is reached.  Allows for forEach to be called on infinite enumerations.
             * @returns {any}
             */
            function toArray(source, max) {
                if (max === void 0) { max = Infinity; }
                if (source === STRING_EMPTY)
                    return [];
                if (!isFinite(max) && (source) instanceof (Array))
                    return source.slice();
                var result = initArrayFrom(source, max);
                if (-1 === forEach(source, function (e, i) { result[i] = e; }, max))
                    throw new UnsupportedEnumerableException();
                return result;
            }
            Enumeration.toArray = toArray;
            /**
             * Converts any enumerable to an array of selected values.
             * @param source
             * @param selector
             * @param max Stops after max is reached.  Allows for forEach to be called on infinite enumerations.
             * @returns {TResult[]}
             */
            function map(source, selector, max) {
                if (max === void 0) { max = Infinity; }
                if (source === STRING_EMPTY)
                    return [];
                if (!isFinite(max) && (source) instanceof (Array))
                    return source.map(selector);
                var result = initArrayFrom(source, max);
                if (-1 === forEach(source, function (e, i) { result[i] = selector(e, i); }, max))
                    throw new UnsupportedEnumerableException();
                return result;
            }
            Enumeration.map = map;
            var yielderPool;
            //noinspection JSUnusedLocalSymbols
            function yielder(recycle) {
                if (!yielderPool)
                    yielderPool
                        = new Disposable.ObjectPool(40, function () { return new Yielder(); }, function (y) { return y.yieldBreak(); });
                if (!recycle)
                    return yielderPool.take();
                yielderPool.add(recycle);
            }
            var Yielder = /** @class */ (function () {
                function Yielder() {
                    this._current = VOID0;
                    this._index = NaN;
                }
                Object.defineProperty(Yielder.prototype, "current", {
                    get: function () { return this._current; } // this class is not entirely local/private.  Still needs protection.
                    ,
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Yielder.prototype, "index", {
                    get: function () { return this._index; },
                    enumerable: false,
                    configurable: true
                });
                Yielder.prototype.yieldReturn = function (value) {
                    this._current = value;
                    if (isNaN(this._index))
                        this._index = 0;
                    else
                        this._index++;
                    return true;
                };
                Yielder.prototype.yieldBreak = function () {
                    this._current = VOID0;
                    this._index = NaN;
                    return false;
                };
                Yielder.prototype.dispose = function () {
                    this.yieldBreak();
                };
                return Yielder;
            }());
            var NAME = "EnumeratorBase";
            // "Enumerator" is conflict JScript's "Enumerator"
            // Naming this class EnumeratorBase to avoid collision with IE.
            var EnumeratorBase = /** @class */ (function (_super) {
                __extends(EnumeratorBase, _super);
                function EnumeratorBase(_initializer, _tryGetNext, disposer, isEndless) {
                    var _this = _super.call(this) || this;
                    _this._initializer = _initializer;
                    _this._tryGetNext = _tryGetNext;
                    _this._disposableObjectName = NAME;
                    _this.reset();
                    if (Type.isBoolean(isEndless))
                        _this._isEndless = isEndless;
                    else if (Type.isBoolean(disposer))
                        _this._isEndless = disposer;
                    if (Type.isFunction(disposer))
                        _this._disposer = disposer;
                    return _this;
                }
                Object.defineProperty(EnumeratorBase.prototype, "current", {
                    get: function () {
                        var y = this._yielder;
                        return y && y.current;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(EnumeratorBase.prototype, "index", {
                    get: function () {
                        var y = this._yielder;
                        return y ? y.index : NaN;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(EnumeratorBase.prototype, "isEndless", {
                    /*
                     * Provides a mechanism to indicate if this enumerable never ends.
                     * If set to true, some operations that expect a finite result may throw.
                     * Explicit false means it has an end.
                     * Implicit void means unknown.
                     */
                    get: function () {
                        return this._isEndless;
                    },
                    enumerable: false,
                    configurable: true
                });
                /**
                 * Added for compatibility but only works if the enumerator is active.
                 */
                EnumeratorBase.prototype.reset = function () {
                    var _ = this;
                    _.throwIfDisposed();
                    var y = _._yielder;
                    _._yielder = null;
                    _._state = 0 /* Before */;
                    if (y)
                        yielder(y); // recycle until actually needed.
                };
                EnumeratorBase.prototype._assertBadState = function () {
                    var _ = this;
                    switch (_._state) {
                        case 3 /* Faulted */:
                            _.throwIfDisposed("This enumerator caused a fault and was disposed.");
                            break;
                        case 5 /* Disposed */:
                            _.throwIfDisposed("This enumerator was manually disposed.");
                            break;
                    }
                };
                /**
                 * Passes the current value to the out callback if the enumerator is active.
                 * Note: Will throw ObjectDisposedException if this has faulted or manually disposed.
                 */
                EnumeratorBase.prototype.tryGetCurrent = function (out) {
                    this._assertBadState();
                    if (this._state === 1 /* Active */) {
                        out(this.current);
                        return true;
                    }
                    return false;
                };
                Object.defineProperty(EnumeratorBase.prototype, "canMoveNext", {
                    get: function () {
                        return this._state < 2 /* Completed */;
                    },
                    enumerable: false,
                    configurable: true
                });
                /**
                 * Safely moves to the next entry and returns true if there is one.
                 * Note: Will throw ObjectDisposedException if this has faulted or manually disposed.
                 */
                EnumeratorBase.prototype.moveNext = function () {
                    var _ = this;
                    _._assertBadState();
                    try {
                        switch (_._state) {
                            case 0 /* Before */:
                                _._yielder = _._yielder || yielder();
                                _._state = 1 /* Active */;
                                var initializer = _._initializer;
                                if (initializer)
                                    initializer();
                            // fall through
                            case 1 /* Active */:
                                if (_._tryGetNext(_._yielder)) {
                                    return true;
                                }
                                else {
                                    this.dispose();
                                    _._state = 2 /* Completed */;
                                    return false;
                                }
                            default:
                                return false;
                        }
                    }
                    catch (e) {
                        this.dispose();
                        _._state = 3 /* Faulted */;
                        throw e;
                    }
                };
                /**
                 * Moves to the next entry and emits the value through the out callback.
                 * Note: Will throw ObjectDisposedException if this has faulted or manually disposed.
                 */
                EnumeratorBase.prototype.tryMoveNext = function (out) {
                    if (this.moveNext()) {
                        out(this.current);
                        return true;
                    }
                    return false;
                };
                EnumeratorBase.prototype.nextValue = function () {
                    return this.moveNext()
                        ? this.current
                        : VOID0;
                };
                /**
                 * Exposed for compatibility with generators.
                 */
                EnumeratorBase.prototype.next = function () {
                    return this.moveNext()
                        ? new IteratorResult(this.current, this.index)
                        : IteratorResult.Done;
                };
                EnumeratorBase.prototype.end = function () {
                    this._ensureDisposeState(4 /* Interrupted */);
                };
                EnumeratorBase.prototype['return'] = function (value) {
                    var _ = this;
                    _._assertBadState();
                    try {
                        return value === VOID0 || _._state === 2 /* Completed */ || _._state === 4 /* Interrupted */
                            ? IteratorResult.Done
                            : new IteratorResult(value, VOID0, true);
                    }
                    finally {
                        _.end();
                    }
                };
                EnumeratorBase.prototype._ensureDisposeState = function (state) {
                    var _ = this;
                    if (!_.wasDisposed) {
                        _.dispose();
                        _._state = state;
                    }
                };
                EnumeratorBase.prototype._onDispose = function () {
                    var _ = this;
                    _._isEndless = false;
                    var disposer = _._disposer;
                    _._initializer = null;
                    _._disposer = null;
                    var y = _._yielder;
                    _._yielder = null;
                    this._state = 5 /* Disposed */;
                    if (y)
                        yielder(y);
                    if (disposer)
                        disposer();
                };
                return EnumeratorBase;
            }(Disposable.DisposableBase));
            Enumeration.EnumeratorBase = EnumeratorBase;
            var SimpleEnumerableBase = /** @class */ (function () {
                function SimpleEnumerableBase() {
                    this.reset();
                }
                Object.defineProperty(SimpleEnumerableBase.prototype, "current", {
                    get: function () {
                        return this._current;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(SimpleEnumerableBase.prototype, "canMoveNext", {
                    get: function () {
                        return this._canMoveNext();
                    },
                    enumerable: false,
                    configurable: true
                });
                SimpleEnumerableBase.prototype.tryMoveNext = function (out) {
                    if (this.moveNext()) {
                        out(this._current);
                        return true;
                    }
                    return false;
                };
                SimpleEnumerableBase.prototype.incrementIndex = function () {
                    var i = this._index;
                    this._index = i = isNaN(i) ? 0 : (i + 1);
                    return i;
                };
                SimpleEnumerableBase.prototype.nextValue = function () {
                    this.moveNext();
                    return this._current;
                };
                SimpleEnumerableBase.prototype.next = function () {
                    return this.moveNext()
                        ? new IteratorResult(this._current, this._index)
                        : IteratorResult.Done;
                };
                SimpleEnumerableBase.prototype.end = function () {
                    this.dispose();
                };
                SimpleEnumerableBase.prototype['return'] = function (value) {
                    try {
                        return value !== VOID0 && this._canMoveNext()
                            ? new IteratorResult(value, VOID0, true)
                            : IteratorResult.Done;
                    }
                    finally {
                        this.dispose();
                    }
                };
                SimpleEnumerableBase.prototype.reset = function () {
                    this._current = VOID0;
                    this._index = NaN;
                };
                SimpleEnumerableBase.prototype.dispose = function () {
                    this.reset();
                };
                SimpleEnumerableBase.prototype.getIsEndless = function () {
                    return this._canMoveNext();
                };
                Object.defineProperty(SimpleEnumerableBase.prototype, "isEndless", {
                    get: function () {
                        return this.getIsEndless();
                    },
                    enumerable: false,
                    configurable: true
                });
                return SimpleEnumerableBase;
            }());
            Enumeration.SimpleEnumerableBase = SimpleEnumerableBase;
            var IndexEnumerator = /** @class */ (function (_super) {
                __extends(IndexEnumerator, _super);
                function IndexEnumerator(sourceFactory) {
                    var _this = this;
                    var source;
                    _this = _super.call(this, function () {
                        source = sourceFactory();
                        if (source && source.source) {
                            var len = source.length;
                            if (len < 0) // Null is allowed but will exit immediately.
                                throw new Error("length must be zero or greater");
                            if (!isFinite(len))
                                throw new Error("length must finite number");
                            if (len && source.step === 0)
                                throw new Error("Invalid IndexEnumerator step value (0).");
                            var pointer = source.pointer;
                            if (!pointer)
                                pointer = 0;
                            else if (pointer != Math.floor(pointer))
                                throw new Error("Invalid IndexEnumerator pointer value (" + pointer + ") has decimal.");
                            source.pointer = pointer;
                            var step = source.step;
                            if (!step)
                                step = 1;
                            else if (step != Math.floor(step))
                                throw new Error("Invalid IndexEnumerator step value (" + step + ") has decimal.");
                            source.step = step;
                        }
                    }, function (yielder) {
                        var len = (source && source.source) ? source.length : 0;
                        if (!len || isNaN(len))
                            return yielder.yieldBreak();
                        var current = source.pointer;
                        if (source.pointer == null)
                            source.pointer = 0; // should never happen but is in place to negate compiler warnings.
                        if (!source.step)
                            source.step = 1; // should never happen but is in place to negate compiler warnings.
                        source.pointer = source.pointer + source.step;
                        return (current < len && current >= 0)
                            ? yielder.yieldReturn(source.source[current])
                            : yielder.yieldBreak();
                    }, function () {
                        if (source) {
                            source.source = null;
                        }
                    }) || this;
                    _this._isEndless = false;
                    return _this;
                }
                return IndexEnumerator;
            }(EnumeratorBase));
            Enumeration.IndexEnumerator = IndexEnumerator;
            var ArrayEnumerator = /** @class */ (function (_super) {
                __extends(ArrayEnumerator, _super);
                function ArrayEnumerator(arrayOrFactory, start, step) {
                    if (start === void 0) { start = 0; }
                    if (step === void 0) { step = 1; }
                    return _super.call(this, function () {
                        var array = Type.isFunction(arrayOrFactory) ? arrayOrFactory() : arrayOrFactory;
                        return {
                            source: array,
                            pointer: start,
                            length: array ? array.length : 0,
                            step: step
                        };
                    }) || this;
                }
                return ArrayEnumerator;
            }(IndexEnumerator));
            Enumeration.ArrayEnumerator = ArrayEnumerator;
            var InfiniteEnumerator = /** @class */ (function (_super) {
                __extends(InfiniteEnumerator, _super);
                /**
                 * See InfiniteValueFactory
                 * @param _factory
                 */
                function InfiniteEnumerator(_factory) {
                    var _this = _super.call(this) || this;
                    _this._factory = _factory;
                    return _this;
                }
                InfiniteEnumerator.prototype._canMoveNext = function () {
                    return this._factory != null;
                };
                InfiniteEnumerator.prototype.moveNext = function () {
                    var _ = this;
                    var f = _._factory;
                    if (f) {
                        _._current = f(_._current, _.incrementIndex());
                        return true;
                    }
                    return false;
                };
                InfiniteEnumerator.prototype.dispose = function () {
                    _super.prototype.dispose.call(this);
                    this._factory = null;
                };
                return InfiniteEnumerator;
            }(SimpleEnumerableBase));
            Enumeration.InfiniteEnumerator = InfiniteEnumerator;
            var IteratorEnumerator = /** @class */ (function (_super) {
                __extends(IteratorEnumerator, _super);
                /**
                 * @param _iterator
                 * @param _isEndless true and false are explicit where as undefined means 'unknown'.
                 */
                function IteratorEnumerator(_iterator, _isEndless) {
                    var _this = _super.call(this) || this;
                    _this._iterator = _iterator;
                    _this._isEndless = _isEndless;
                    return _this;
                }
                IteratorEnumerator.prototype._canMoveNext = function () {
                    return this._iterator != null;
                };
                IteratorEnumerator.prototype.moveNext = function (value) {
                    var _ = this;
                    var i = _._iterator;
                    if (i) {
                        var r = arguments.length ? i.next(value) : i.next();
                        _._current = r.value;
                        if (r.done)
                            _.dispose();
                        else
                            return true;
                    }
                    return false;
                };
                IteratorEnumerator.prototype.dispose = function () {
                    _super.prototype.dispose.call(this);
                    this._iterator = null;
                };
                IteratorEnumerator.prototype.getIsEndless = function () {
                    return Boolean(this._isEndless) && _super.prototype.getIsEndless.call(this);
                };
                return IteratorEnumerator;
            }(SimpleEnumerableBase));
            Enumeration.IteratorEnumerator = IteratorEnumerator;
            var Randomizer = /** @class */ (function (_super) {
                __extends(Randomizer, _super);
                function Randomizer(source, _allowReset) {
                    if (_allowReset === void 0) { _allowReset = false; }
                    var _this = _super.call(this) || this;
                    _this._allowReset = _allowReset;
                    _this._buffer = toArray(source);
                    _this._pointer = _this._buffer.length;
                    return _this;
                }
                Randomizer.prototype._canMoveNext = function () {
                    var p = this._pointer;
                    return !isNaN(p) && p > 0;
                };
                Randomizer.prototype.moveNext = function () {
                    var _ = this;
                    if (_._canMoveNext()) {
                        var p = this._pointer, // Where were we?
                        i = Math.floor(Math.random() * p), // Pick one.
                        b = this._buffer, value = b[i], last = p - 1;
                        b[i] = b[last]; // Take the last one and put it here.
                        b[last] = null; // clear possible reference.
                        if (!this._allowReset && last % 32 == 0) // Shrink?
                            b.length = last;
                        this._pointer = last;
                        _._current = value;
                        _.incrementIndex();
                        return true;
                    }
                    return false;
                };
                Randomizer.prototype.reset = function () {
                    if (this._allowReset) {
                        if (!this._buffer)
                            throw "Randomizer cannot be reset.  Already disposed.";
                        this._pointer = this._buffer.length;
                        _super.prototype.reset.call(this);
                    }
                    else
                        throw "Reset not allowed.  To allow for reset, specify so when constructing.";
                };
                Randomizer.prototype.dispose = function () {
                    _super.prototype.reset.call(this); // Note... don't call this.reset() :|
                    var b = this._buffer;
                    this._buffer = null;
                    this._pointer = NaN;
                    if (b)
                        b.length = 0;
                };
                Randomizer.prototype.getIsEndless = function () {
                    return false;
                };
                return Randomizer;
            }(SimpleEnumerableBase));
            Enumeration.Randomizer = Randomizer;
            var Error = /** @class */ (function (_super) {
                __extends(Error, _super);
                function Error() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return Error;
            }(Exception));
            Enumeration.Error = Error;
            var UnsupportedEnumerableException = /** @class */ (function (_super) {
                __extends(UnsupportedEnumerableException, _super);
                function UnsupportedEnumerableException(message) {
                    return _super.call(this, message || "Unsupported enumerable.") || this;
                }
                UnsupportedEnumerableException.prototype.getName = function () {
                    return NAME;
                };
                return UnsupportedEnumerableException;
            }(Exceptions.SystemException));
            Enumeration.UnsupportedEnumerableException = UnsupportedEnumerableException;
        })(Enumeration = Collections.Enumeration || (Collections.Enumeration = {}));
        var CollectionBase = /** @class */ (function (_super) {
            __extends(CollectionBase, _super);
            function CollectionBase(source, _equalityComparer) {
                if (_equalityComparer === void 0) { _equalityComparer = Compare.areEqual; }
                var _this = _super.call(this) || this;
                _this._equalityComparer = _equalityComparer;
                var _ = _this;
                _._disposableObjectName = NAME;
                _._importEntries(source);
                _._updateRecursion = 0;
                _._modifiedCount = 0;
                _._version = 0;
                return _this;
            }
            Object.defineProperty(CollectionBase.prototype, "count", {
                get: function () {
                    return this.getCount();
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(CollectionBase.prototype, "length", {
                get: function () {
                    return this.getCount();
                },
                enumerable: false,
                configurable: true
            });
            CollectionBase.prototype.getIsReadOnly = function () {
                return false;
            };
            Object.defineProperty(CollectionBase.prototype, "isReadOnly", {
                //noinspection JSUnusedGlobalSymbols
                get: function () {
                    return this.getIsReadOnly();
                },
                enumerable: false,
                configurable: true
            });
            CollectionBase.prototype.assertModifiable = function () {
                this.throwIfDisposed(CMDC);
                if (this.getIsReadOnly())
                    throw new Exceptions.InvalidOperationException(CMRO);
                return true;
            };
            CollectionBase.prototype.assertVersion = function (version) {
                if (version !== this._version)
                    throw new Exceptions.InvalidOperationException("Collection was modified.");
                return true;
            };
            CollectionBase.prototype._onModified = function () { };
            CollectionBase.prototype._signalModification = function (increment) {
                var _ = this;
                if (increment)
                    _._modifiedCount++;
                if (_._modifiedCount && !this._updateRecursion) {
                    _._modifiedCount = 0;
                    _._version++;
                    try {
                        _._onModified();
                    }
                    catch (ex) {
                        // Avoid fatal errors which may have been caused by consumer.
                        console.error(ex);
                    }
                    return true;
                }
                return false;
            };
            CollectionBase.prototype._incrementModified = function () { this._modifiedCount++; };
            Object.defineProperty(CollectionBase.prototype, "isUpdating", {
                //noinspection JSUnusedGlobalSymbols
                get: function () { return this._updateRecursion != 0; },
                enumerable: false,
                configurable: true
            });
            /**
             * Takes a closure that if returning true will propagate an update signal.
             * Multiple update operations can be occurring at once or recursively and the onModified signal will only occur once they're done.
             * @param closure
             * @returns {boolean}
             */
            CollectionBase.prototype.handleUpdate = function (closure) {
                if (!closure)
                    return false;
                var _ = this;
                _.assertModifiable();
                _._updateRecursion++;
                var updated = false;
                try {
                    if (updated = closure())
                        _._modifiedCount++;
                }
                finally {
                    _._updateRecursion--;
                }
                _._signalModification();
                return updated;
            };
            /*
             * Note: for a slight amount more code, we avoid creating functions/closures.
             * Calling handleUpdate is the correct pattern, but if possible avoid creating another function scope.
             */
            /**
             * Adds an entry to the collection.
             * @param entry
             */
            CollectionBase.prototype.add = function (entry) {
                var _ = this;
                _.assertModifiable();
                _._updateRecursion++;
                try {
                    if (_._addInternal(entry))
                        _._modifiedCount++;
                }
                finally {
                    _._updateRecursion--;
                }
                _._signalModification();
            };
            CollectionBase.prototype.push = function (entry) {
                this.add(entry);
            };
            /**
             * Removes entries from the collection allowing for a limit.
             * For example if the collection not a distinct set, more than one entry could be removed.
             * @param entry The entry to remove.
             * @param max Limit of entries to remove.  Will remove all matches if no max specified.
             * @returns {number} The number of entries removed.
             */
            CollectionBase.prototype.remove = function (entry, max) {
                if (max === void 0) { max = Infinity; }
                var _ = this;
                _.assertModifiable();
                _._updateRecursion++;
                var n = NaN;
                try {
                    if (n = _._removeInternal(entry, max))
                        _._modifiedCount++;
                }
                finally {
                    _._updateRecursion--;
                }
                _._signalModification();
                return n;
            };
            /**
             * Clears the contents of the collection resulting in a count of zero.
             * @returns {number}
             */
            CollectionBase.prototype.clear = function () {
                var _ = this;
                _.assertModifiable();
                _._updateRecursion++;
                var n = NaN;
                try {
                    if (n = _._clearInternal())
                        _._modifiedCount++;
                }
                finally {
                    _._updateRecursion--;
                }
                _._signalModification();
                return n;
            };
            CollectionBase.prototype._onDispose = function () {
                _super.prototype._onDispose.call(this);
                this._clearInternal();
                this._version = 0;
                this._updateRecursion = 0;
                this._modifiedCount = 0;
                var l = this._linq;
                this._linq = void 0;
                if (l)
                    l.dispose();
            };
            CollectionBase.prototype._importEntries = function (entries) {
                var _this = this;
                var added = 0;
                if (entries) {
                    if ((entries) instanceof (window["ARRAY_BUFFER"])) {
                        // Optimize for avoiding a new closure.
                        for (var _i = 0, _a = entries; _i < _a.length; _i++) {
                            var e = _a[_i];
                            if (this._addInternal(e))
                                added++;
                        }
                    }
                    else {
                        Enumeration.forEach(entries, function (e) {
                            if (_this._addInternal(e))
                                added++;
                        });
                    }
                }
                return added;
            };
            /**
             * Safely imports any array enumerator, or enumerable.
             * @param entries
             * @returns {number}
             */
            CollectionBase.prototype.importEntries = function (entries) {
                var _ = this;
                if (!entries)
                    return 0;
                _.assertModifiable();
                _._updateRecursion++;
                var n = NaN;
                try {
                    if (n = _._importEntries(entries))
                        _._modifiedCount++;
                }
                finally {
                    _._updateRecursion--;
                }
                _._signalModification();
                return n;
            };
            /**
             * Returns an array filtered by the provided predicate.
             * Provided for similarity to JS Array.
             * @param predicate
             * @returns {T[]}
             */
            CollectionBase.prototype.filter = function (predicate) {
                if (!predicate)
                    throw new Exceptions.ArgumentNullException("predicate");
                var count = !this.getCount();
                var result = [];
                if (count) {
                    this.forEach(function (e, i) {
                        if (predicate(e, i))
                            result.push(e);
                    });
                }
                return result;
            };
            /**
             * Returns true the first time predicate returns true.  Otherwise false.
             * Useful for searching through a collection.
             * @param predicate
             * @returns {any}
             */
            CollectionBase.prototype.any = function (predicate) {
                var count = this.getCount();
                if (!count)
                    return false;
                if (!predicate)
                    return Boolean(count);
                var found = false;
                this.forEach(function (e, i) { return !(found = predicate(e, i)); });
                return found;
            };
            /**
             * Returns true the first time predicate returns true.  Otherwise false.
             * See '.any(predicate)'.  As this method is just just included to have similarity with a JS Array.
             * @param predicate
             * @returns {any}
             */
            CollectionBase.prototype.some = function (predicate) {
                return this.any(predicate);
            };
            /**
             * Returns true if the equality comparer resolves true on any element in the collection.
             * @param entry
             * @returns {boolean}
             */
            CollectionBase.prototype.contains = function (entry) {
                var equals = this._equalityComparer;
                return this.any(function (e) { return equals(entry, e); });
            };
            CollectionBase.prototype.forEach = function (action, useCopy) {
                if (this.wasDisposed)
                    return 0;
                if (useCopy) {
                    var a = this.toArray();
                    try {
                        return Enumeration.forEach(a, action);
                    }
                    finally {
                        a.length = 0;
                    }
                }
                else {
                    return Enumeration.forEach(this.getEnumerator(), action);
                }
            };
            /**
             * Copies all values to numerically indexable object.
             * @param target
             * @param index
             * @returns {TTarget}
             */
            CollectionBase.prototype.copyTo = function (target, index) {
                if (index === void 0) { index = 0; }
                if (!target)
                    throw new Exceptions.ArgumentNullException("target");
                var count = this.getCount();
                if (count) {
                    var newLength = count + index;
                    if (target.length < newLength)
                        target.length = newLength;
                    var e = this.getEnumerator();
                    while (e.moveNext()) // Disposes when finished.
                     {
                        target[index++] = e.current;
                    }
                }
                return target;
            };
            /**
             * Returns an array of the collection contents.
             * @returns {any[]|Array}
             */
            CollectionBase.prototype.toArray = function () {
                var count = this.getCount();
                return count
                    ? this.copyTo(count > 65536 ? new Array(count) : [])
                    : [];
            };
            Object.defineProperty(CollectionBase.prototype, "linq", {
                /**
                 * .linq will return an ILinqEnumerable if .linqAsync() has completed successfully or the default module loader is NodeJS+CommonJS.
                 * @returns {ILinqEnumerable}
                 */
                get: function () {
                    this.throwIfDisposed();
                    var e = this._linq;
                    if (!e) {
                        var r = void 0;
                        try {
                            r = eval("require");
                        }
                        catch (ex) { }
                        this._linq = e = System.Linq.Enumerable.from(this);
                        if (!e) {
                            throw isRequireJS ? "using .linq to load and initialize a ILinqEnumerable is currently only supported within a NodeJS environment. Import System.Linq/Linq and use Enumerable.from(e) instead. You can also preload the Linq module as a dependency or use .linqAsync(callback) for AMD/RequireJS." : "There was a problem importing System.Linq/Linq";
                        }
                    }
                    return e;
                },
                enumerable: false,
                configurable: true
            });
            /**
             * .linqAsync() is for use with deferred loading.
             * Ensures an instance of the Linq extensions is available and then passes it to the callback.
             * Returns an ILinqEnumerable if one is already available, otherwise undefined.
             * Passing no parameters will still initiate loading and initializing the ILinqEnumerable which can be useful for pre-loading.
             * Any call to .linqAsync() where an ILinqEnumerable is returned can be assured that any subsequent calls to .linq will return the same instance.
             * @param callback
             * @returns {ILinqEnumerable}
             */
            CollectionBase.prototype.linqAsync = function (callback) {
                var _this = this;
                this.throwIfDisposed();
                var e = this._linq;
                if (!e) {
                    if (isRequireJS) {
                        eval("require")([LINQ_PATH], function (linq) {
                            // Could end up being called more than once, be sure to check for ._linq before setting...
                            e = _this._linq;
                            if (!e)
                                _this._linq = e = linq.default.from(_this);
                            if (!e)
                                throw "There was a problem importing System.Linq/Linq";
                            if (callback)
                                callback(e);
                            callback = void 0; // In case this is return synchronously..
                        });
                    }
                    else if (isNodeJS && isCommonJS) {
                        e = this.linq;
                    }
                    else {
                        throw "Cannot find a compatible loader for importing System.Linq/Linq";
                    }
                }
                if (e && callback)
                    callback(e);
                return e;
            };
            return CollectionBase;
        }(Disposable.DisposableBase));
        Collections.CollectionBase = CollectionBase;
        var ReadOnlyCollectionBase = /** @class */ (function (_super) {
            __extends(ReadOnlyCollectionBase, _super);
            function ReadOnlyCollectionBase() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            ReadOnlyCollectionBase.prototype.getCount = function () {
                return this._getCount();
            };
            ReadOnlyCollectionBase.prototype.getIsReadOnly = function () {
                return true;
            };
            //noinspection JSUnusedLocalSymbols
            ReadOnlyCollectionBase.prototype._addInternal = function (entry) {
                return false;
            };
            //noinspection JSUnusedLocalSymbols
            ReadOnlyCollectionBase.prototype._removeInternal = function (entry, max) {
                return 0;
            };
            ReadOnlyCollectionBase.prototype._clearInternal = function () {
                return 0;
            };
            ReadOnlyCollectionBase.prototype.getEnumerator = function () {
                return this._getEnumerator();
            };
            return ReadOnlyCollectionBase;
        }(CollectionBase));
        Collections.ReadOnlyCollectionBase = ReadOnlyCollectionBase;
        var enumeratorFrom = Enumeration.from;
        var ReadOnlyCollectionWrapper = /** @class */ (function (_super) {
            __extends(ReadOnlyCollectionWrapper, _super);
            function ReadOnlyCollectionWrapper(collection) {
                var _this = _super.call(this) || this;
                if (!collection)
                    throw new Exceptions.ArgumentNullException("collection");
                var _ = _this;
                // Attempting to avoid contact with the original collection.
                if (Type.isArrayLike(collection)) {
                    _._getCount = function () { return collection.length; };
                    _._getEnumerator = function () { return enumeratorFrom(collection); };
                }
                else {
                    _._getCount = function () { return collection.count; };
                    _._getEnumerator = function () { return collection.getEnumerator(); };
                }
                return _this;
            }
            ReadOnlyCollectionWrapper.prototype._getCount = function () {
                this.throwIfDisposed();
                return this.__getCount();
            };
            ReadOnlyCollectionWrapper.prototype._getEnumerator = function () {
                this.throwIfDisposed();
                return this.__getEnumerator();
            };
            ReadOnlyCollectionWrapper.prototype._onDispose = function () {
                _super.prototype._onDispose.call(this);
                this.__getCount = null;
                this.__getEnumerator = null;
            };
            return ReadOnlyCollectionWrapper;
        }(ReadOnlyCollectionBase));
        Collections.ReadOnlyCollectionWrapper = ReadOnlyCollectionWrapper;
        var LazyList = /** @class */ (function (_super) {
            __extends(LazyList, _super);
            function LazyList(source) {
                var _this = _super.call(this) || this;
                _this._enumerator = source.getEnumerator();
                _this._cached = [];
                return _this;
            }
            LazyList.prototype._onDispose = function () {
                _super.prototype._onDispose.call(this);
                var e = this._enumerator;
                this._enumerator = null;
                if (e)
                    e.dispose();
                var c = this._cached;
                this._cached = null;
                if (c)
                    c.length = 0;
            };
            LazyList.prototype._getCount = function () {
                this.finish();
                var c = this._cached;
                return c ? c.length : 0;
            };
            LazyList.prototype._getEnumerator = function () {
                var _this = this;
                var current;
                return new Enumeration.EnumeratorBase(function () {
                    current = 0;
                }, function (yielder) {
                    _this.throwIfDisposed();
                    var c = _this._cached;
                    return (current < c.length || _this.getNext())
                        ? yielder.yieldReturn(c[current++])
                        : yielder.yieldBreak();
                });
            };
            LazyList.prototype.get = function (index) {
                this.throwIfDisposed();
                Integer.assertZeroOrGreater(index);
                var c = this._cached;
                while (c.length <= index && this.getNext()) { }
                if (index < c.length)
                    return c[index];
                throw new Exceptions.ArgumentOutOfRangeException("index", "Greater than total count.");
            };
            LazyList.prototype.indexOf = function (item) {
                this.throwIfDisposed();
                var c = this._cached;
                var result = c.indexOf(item);
                while (result == -1 && this.getNext(function (value) {
                    if (value == item)
                        result = c.length - 1;
                })) { }
                return result;
            };
            LazyList.prototype.contains = function (item) {
                return this.indexOf(item) != -1;
            };
            LazyList.prototype.getNext = function (out) {
                var e = this._enumerator;
                if (!e)
                    return false;
                if (e.moveNext()) {
                    var value = e.current;
                    this._cached.push(value);
                    if (out)
                        out(value);
                    return true;
                }
                else {
                    e.dispose();
                    this._enumerator = null;
                }
                return false;
            };
            LazyList.prototype.finish = function () {
                while (this.getNext()) { }
            };
            return LazyList;
        }(ReadOnlyCollectionBase));
        Collections.LazyList = LazyList;
        var InternalNode = /** @class */ (function () {
            function InternalNode(value, previous, next) {
                this.value = value;
                this.previous = previous;
                this.next = next;
            }
            InternalNode.prototype.assertDetached = function () {
                if (this.next || this.previous)
                    throw new Exceptions.InvalidOperationException("Adding a node that is already placed.");
                return true;
            };
            return InternalNode;
        }());
        function ensureExternal(node, list) {
            if (!node)
                return null;
            if (!list)
                throw new Exceptions.ArgumentNullException("list");
            var external = node.external;
            if (!external)
                node.external = external = new LinkedListNode(list, node);
            return external || null;
        }
        function getInternal(node, list) {
            if (!node)
                throw new Exceptions.ArgumentNullException("node");
            if (!list)
                throw new Exceptions.ArgumentNullException("list");
            if (node.list != list)
                throw new Exceptions.InvalidOperationException("Provided node does not belong to this list.");
            var n = node._nodeInternal;
            if (!n)
                throw new Exceptions.InvalidOperationException("Provided node is not valid.");
            return n;
        }
        function detachExternal(node) {
            if (node) {
                var e = node.external;
                if (e) {
                    e._list = VOID0;
                    e._nodeInternal = VOID0;
                }
                node.external = VOID0;
            }
        }
        var LinkedList = /** @class */ (function (_super) {
            __extends(LinkedList, _super);
            function LinkedList(source, equalityComparer) {
                if (equalityComparer === void 0) { equalityComparer = Compare.areEqual; }
                var _this = _super.call(this, VOID0, equalityComparer) || this;
                _this._listInternal = new LinkedNodeList();
                _this._importEntries(source);
                return _this;
            }
            LinkedList.prototype.assertVersion = function (version) {
                if (this._listInternal)
                    return this._listInternal.assertVersion(version);
                else // In case it's been disposed.
                    return _super.prototype.assertVersion.call(this, version);
            };
            LinkedList.prototype._onDispose = function () {
                _super.prototype._onDispose.call(this);
                var l = this._listInternal;
                this._listInternal = null;
                l.dispose();
            };
            LinkedList.prototype.getCount = function () {
                var li = this._listInternal;
                return li ? li.unsafeCount : 0;
            };
            LinkedList.prototype._addInternal = function (entry) {
                this._listInternal.addNode(new InternalNode(entry));
                return true;
            };
            LinkedList.prototype._removeInternal = function (entry, max) {
                if (max === void 0) { max = Infinity; }
                var _ = this, equals = _._equalityComparer, list = _._listInternal;
                var removedCount = 0;
                list.forEach(function (node) {
                    if (node && equals(entry, node.value) && _._removeNodeInternal(node))
                        removedCount++;
                    return removedCount < max;
                }, true /* override versioning check */);
                return removedCount;
            };
            LinkedList.prototype._clearInternal = function () {
                var list = this._listInternal;
                list.forEach(function (node) { return detachExternal(node); });
                return list.clear();
            };
            LinkedList.prototype.forEach = function (action, useCopy) {
                if (useCopy === void 0) { useCopy = false; }
                this.throwIfDisposed();
                return useCopy
                    ? _super.prototype.forEach.call(this, action, useCopy)
                    : this._listInternal.forEach(function (node, i) { return action(node.value, i); });
            };
            // #endregion
            // #region IEnumerable<T>
            LinkedList.prototype.getEnumerator = function () {
                this.throwIfDisposed();
                return LinkedNodeList.valueEnumeratorFrom(this._listInternal);
            };
            // #endregion
            LinkedList.prototype._findFirst = function (entry) {
                //noinspection UnnecessaryLocalVariableJS
                var _ = this, equals = _._equalityComparer;
                var next = _._listInternal && _._listInternal.first;
                while (next) {
                    if (equals(entry, next.value))
                        return next;
                    next = next.next;
                }
                return null;
            };
            LinkedList.prototype._findLast = function (entry) {
                //noinspection UnnecessaryLocalVariableJS
                var _ = this, equals = _._equalityComparer;
                var prev = _._listInternal && _._listInternal.last;
                while (prev) {
                    if (equals(entry, prev.value))
                        return prev;
                    prev = prev.previous;
                }
                return null;
            };
            LinkedList.prototype.removeOnce = function (entry) {
                return this.remove(entry, 1) !== 0;
            };
            Object.defineProperty(LinkedList.prototype, "first", {
                get: function () {
                    var li = this._listInternal;
                    return li && ensureExternal(li.first, this);
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(LinkedList.prototype, "firstValue", {
                get: function () {
                    var li = this._listInternal, node = li && li.first;
                    return node ? node.value : VOID0;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(LinkedList.prototype, "last", {
                get: function () {
                    var li = this._listInternal;
                    return ensureExternal(li.last, this);
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(LinkedList.prototype, "lastValue", {
                get: function () {
                    var li = this._listInternal, node = li && li.last;
                    return node ? node.value : VOID0;
                },
                enumerable: false,
                configurable: true
            });
            // get methods are available for convenience but is an n*index operation.
            LinkedList.prototype.getValueAt = function (index) {
                var li = this._listInternal, node = li && li.getNodeAt(index);
                return node ? node.value : VOID0;
            };
            LinkedList.prototype.getNodeAt = function (index) {
                var li = this._listInternal;
                return li && ensureExternal(li.getNodeAt(index), this);
            };
            LinkedList.prototype.find = function (entry) {
                var li = this._listInternal;
                return li && ensureExternal(this._findFirst(entry), this);
            };
            LinkedList.prototype.findLast = function (entry) {
                var li = this._listInternal;
                return li && ensureExternal(this._findLast(entry), this);
            };
            LinkedList.prototype.addFirst = function (entry) {
                this.assertModifiable();
                this._listInternal.addNodeBefore(new InternalNode(entry));
                this._signalModification(true);
            };
            LinkedList.prototype.addLast = function (entry) {
                this.add(entry);
            };
            LinkedList.prototype._removeNodeInternal = function (node) {
                var _ = this;
                if (node && _._listInternal.removeNode(node)) {
                    detachExternal(node);
                    _._signalModification(true);
                    return true;
                }
                return false;
            };
            LinkedList.prototype.removeFirst = function () {
                var _ = this;
                _.assertModifiable();
                return _._removeNodeInternal(_._listInternal.first);
            };
            LinkedList.prototype.removeLast = function () {
                var _ = this;
                _.assertModifiable();
                return _._removeNodeInternal(_._listInternal.last);
            };
            LinkedList.prototype.removeAt = function (index) {
                var _ = this;
                _.assertModifiable();
                return _._removeNodeInternal(_._listInternal.getNodeAt(index));
            };
            // Returns true if successful and false if not found (already removed).
            LinkedList.prototype.removeNode = function (node) {
                var _ = this;
                _.assertModifiable();
                return _._removeNodeInternal(getInternal(node, _));
            };
            LinkedList.prototype.addBefore = function (before, entry) {
                var _ = this;
                _.assertModifiable();
                _._listInternal.addNodeBefore(new InternalNode(entry), getInternal(before, _));
                _._signalModification(true);
            };
            LinkedList.prototype.addAfter = function (after, entry) {
                var _ = this;
                _.assertModifiable();
                _._listInternal.addNodeAfter(new InternalNode(entry), getInternal(after, _));
                _._signalModification(true);
            };
            return LinkedList;
        }(CollectionBase));
        Collections.LinkedList = LinkedList;
        // Use an internal node class to prevent mucking up the LinkedList.
        var LinkedListNode = /** @class */ (function () {
            function LinkedListNode(_list, _nodeInternal) {
                this._list = _list;
                this._nodeInternal = _nodeInternal;
            }
            LinkedListNode.prototype.throwIfDetached = function () {
                if (!this._list)
                    throw new Error("This node has been detached from its list and is no longer valid.");
            };
            Object.defineProperty(LinkedListNode.prototype, "list", {
                get: function () {
                    return this._list;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(LinkedListNode.prototype, "previous", {
                get: function () {
                    this.throwIfDetached();
                    return ensureExternal(this._nodeInternal.previous, this._list);
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(LinkedListNode.prototype, "next", {
                get: function () {
                    this.throwIfDetached();
                    return ensureExternal(this._nodeInternal.next, this._list);
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(LinkedListNode.prototype, "value", {
                get: function () {
                    this.throwIfDetached();
                    return this._nodeInternal.value;
                },
                set: function (v) {
                    this.throwIfDetached();
                    this._nodeInternal.value = v;
                },
                enumerable: false,
                configurable: true
            });
            LinkedListNode.prototype.addBefore = function (entry) {
                this.throwIfDetached();
                this._list.addBefore(this, entry);
            };
            LinkedListNode.prototype.addAfter = function (entry) {
                this.throwIfDetached();
                this._list.addAfter(this, entry);
            };
            LinkedListNode.prototype.remove = function () {
                var _ = this;
                var list = _._list;
                if (list)
                    list.removeNode(this);
                _._list = VOID0;
                _._nodeInternal = VOID0;
            };
            LinkedListNode.prototype.dispose = function () {
                this.remove();
            };
            return LinkedListNode;
        }());
        var LinkedNodeList = /** @class */ (function () {
            function LinkedNodeList() {
                this._first = null;
                this._last = null;
                this.unsafeCount = 0;
                this._version = 0;
            }
            LinkedNodeList.prototype.assertVersion = function (version) {
                if (version !== this._version)
                    throw new Exceptions.InvalidOperationException("Collection was modified.");
                return true;
            };
            Object.defineProperty(LinkedNodeList.prototype, "first", {
                /**
                 * The first node.  Will be null if the collection is empty.
                 */
                get: function () {
                    return this._first;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(LinkedNodeList.prototype, "last", {
                /**
                 * The last node.
                 */
                get: function () {
                    return this._last;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(LinkedNodeList.prototype, "count", {
                /**
                 * Iteratively counts the number of linked nodes and returns the value.
                 * @returns {number}
                 */
                get: function () {
                    var next = this._first;
                    var i = 0;
                    while (next) {
                        i++;
                        next = next.next;
                    }
                    return i;
                },
                enumerable: false,
                configurable: true
            });
            // Note, no need for 'useCopy' since this avoids any modification conflict.
            // If iterating over a arrayCopy is necessary, a arrayCopy should be made manually.
            LinkedNodeList.prototype.forEach = function (action, ignoreVersioning) {
                var _ = this;
                var current = null, next = _.first; // Be sure to track the next node so if current node is removed.
                var version = _._version;
                var index = 0;
                do {
                    if (!ignoreVersioning)
                        _.assertVersion(version);
                    current = next;
                    next = current && current.next;
                } while (current
                    && action(current, index++) !== false);
                return index;
            };
            LinkedNodeList.prototype.map = function (selector) {
                if (!selector)
                    throw new Exceptions.ArgumentNullException("selector");
                var result = [];
                this.forEach(function (node, i) {
                    result.push(selector(node, i));
                });
                return result;
            };
            /**
             * Erases the linked node's references to each other and returns the number of nodes.
             * @returns {number}
             */
            LinkedNodeList.prototype.clear = function () {
                var _ = this;
                var n, cF = 0, cL = 0;
                // First, clear in the forward direction.
                n = _._first;
                _._first = null;
                while (n) {
                    cF++;
                    var current = n;
                    n = n.next;
                    current.next = null;
                }
                // Last, clear in the reverse direction.
                n = _._last;
                _._last = null;
                while (n) {
                    cL++;
                    var current = n;
                    n = n.previous;
                    current.previous = null;
                }
                if (cF !== cL)
                    console.warn("LinkedNodeList: Forward versus reverse count does not match when clearing. Forward: " + cF + ", Reverse: " + cL);
                _._version++;
                _.unsafeCount = 0;
                return cF;
            };
            /**
             * Clears the list.
             */
            LinkedNodeList.prototype.dispose = function () {
                this.clear();
            };
            /**
             * Iterates the list to see if a node exists.
             * @param node
             * @returns {boolean}
             */
            LinkedNodeList.prototype.contains = function (node) {
                return this.indexOf(node) != -1;
            };
            /**
             * Gets the index of a particular node.
             * @param index
             */
            LinkedNodeList.prototype.getNodeAt = function (index) {
                if (index < 0)
                    return null;
                var next = this._first;
                var i = 0;
                while (next && i++ < index) {
                    next = next.next || null;
                }
                return next;
            };
            LinkedNodeList.prototype.find = function (condition) {
                var node = null;
                this.forEach(function (n, i) {
                    if (condition(n, i)) {
                        node = n;
                        return false;
                    }
                });
                return node;
            };
            /**
             * Iterates the list to find the specified node and returns its index.
             * @param node
             * @returns {boolean}
             */
            LinkedNodeList.prototype.indexOf = function (node) {
                if (node && (node.previous || node.next)) {
                    var index = 0;
                    var c = void 0, n = this._first;
                    do {
                        c = n;
                        if (c === node)
                            return index;
                        index++;
                    } while ((n = c && c.next));
                }
                return -1;
            };
            /**
             * Removes the first node and returns true if successful.
             * @returns {boolean}
             */
            LinkedNodeList.prototype.removeFirst = function () {
                return !!this._first && this.removeNode(this._first);
            };
            /**
             * Removes the last node and returns true if successful.
             * @returns {boolean}
             */
            LinkedNodeList.prototype.removeLast = function () {
                return !!this._last && this.removeNode(this._last);
            };
            /**
             * Removes the specified node.
             * Returns true if successful and false if not found (already removed).
             * @param node
             * @returns {boolean}
             */
            LinkedNodeList.prototype.removeNode = function (node) {
                if (node == null)
                    throw new Exceptions.ArgumentNullException("node");
                var _ = this;
                var prev = node.previous || null, next = node.next || null;
                var a = false, b = false;
                if (prev)
                    prev.next = next;
                else if (_._first == node)
                    _._first = next;
                else
                    a = true;
                if (next)
                    next.previous = prev;
                else if (_._last == node)
                    _._last = prev;
                else
                    b = true;
                if (a !== b) {
                    throw new Exceptions.ArgumentException("node", format("Provided node is has no {0} reference but is not the {1} node!", a ? "previous" : "next", a ? "first" : "last"));
                }
                var removed = !a && !b;
                if (removed) {
                    _._version++;
                    _.unsafeCount--;
                    node.previous = null;
                    node.next = null;
                }
                return removed;
            };
            /**
             * Adds a node to the end of the list.
             * @param node
             */
            LinkedNodeList.prototype.addNode = function (node) {
                this.addNodeAfter(node);
            };
            /**
             * Inserts a node before the specified 'before' node.
             * If no 'before' node is specified, it inserts it as the first node.
             * @param node
             * @param before
             */
            LinkedNodeList.prototype.addNodeBefore = function (node, before) {
                if (before === void 0) { before = null; }
                assertValidDetached(node);
                var _ = this;
                if (!before) {
                    before = _._first;
                }
                if (before) {
                    var prev = before.previous;
                    node.previous = prev;
                    node.next = before;
                    before.previous = node;
                    if (prev)
                        prev.next = node;
                    if (before == _._first)
                        _._first = node;
                }
                else {
                    _._first = _._last = node;
                }
                _._version++;
                _.unsafeCount++;
            };
            /**
             * Inserts a node after the specified 'after' node.
             * If no 'after' node is specified, it appends it as the last node.
             * @param node
             * @param after
             */
            LinkedNodeList.prototype.addNodeAfter = function (node, after) {
                if (after === void 0) { after = null; }
                assertValidDetached(node);
                var _ = this;
                if (!after) {
                    after = _._last;
                }
                if (after) {
                    var next = after.next;
                    node.next = next;
                    node.previous = after;
                    after.next = node;
                    if (next)
                        next.previous = node;
                    if (after == _._last)
                        _._last = node;
                }
                else {
                    _._first = _._last = node;
                }
                _._version++;
                _.unsafeCount++;
            };
            /**
             * Takes and existing node and replaces it.
             * @param node
             * @param replacement
             */
            LinkedNodeList.prototype.replace = function (node, replacement) {
                if (node == null)
                    throw new Exceptions.ArgumentNullException("node");
                if (node == replacement)
                    return;
                assertValidDetached(replacement, "replacement");
                var _ = this;
                replacement.previous = node.previous;
                replacement.next = node.next;
                if (node.previous)
                    node.previous.next = replacement;
                if (node.next)
                    node.next.previous = replacement;
                if (node == _._first)
                    _._first = replacement;
                if (node == _._last)
                    _._last = replacement;
                _._version++;
            };
            LinkedNodeList.valueEnumeratorFrom = function (list) {
                if (!list)
                    throw new Exceptions.ArgumentNullException("list");
                var current, next, version;
                return new Enumeration.EnumeratorBase(function () {
                    // Initialize anchor...
                    current = null;
                    next = list.first;
                    version = list._version;
                }, function (yielder) {
                    if (next) {
                        list.assertVersion(version);
                        current = next;
                        next = current && current.next;
                        return yielder.yieldReturn(current.value);
                    }
                    return yielder.yieldBreak();
                });
            };
            LinkedNodeList.copyValues = function (list, array, index) {
                if (index === void 0) { index = 0; }
                if (list && list.first) {
                    if (!array)
                        throw new Exceptions.ArgumentNullException("array");
                    list.forEach(function (node, i) {
                        array[index + i] = node.value;
                    });
                }
                return array;
            };
            return LinkedNodeList;
        }());
        Collections.LinkedNodeList = LinkedNodeList;
        var List = /** @class */ (function (_super) {
            __extends(List, _super);
            function List(source, equalityComparer) {
                if (equalityComparer === void 0) { equalityComparer = Compare.areEqual; }
                var _this = _super.call(this, VOID0, equalityComparer) || this;
                if ((source) instanceof (Array)) {
                    _this._source = source.slice();
                }
                else {
                    _this._source = [];
                    _this._importEntries(source);
                }
                return _this;
            }
            List.prototype._onDispose = function () {
                _super.prototype._onDispose.call(this);
                this._source = null;
            };
            List.prototype.getCount = function () {
                return this._source.length;
            };
            List.prototype._addInternal = function (entry) {
                this._source.push(entry);
                return true;
            };
            List.prototype._removeInternal = function (entry, max) {
                if (max === void 0) { max = Infinity; }
                return ArrayModule.remove(this._source, entry, max, this._equalityComparer);
            };
            List.prototype._clearInternal = function () {
                var len = this._source.length;
                this._source.length = 0;
                return len;
            };
            List.prototype._importEntries = function (entries) {
                if (Type.isArrayLike(entries)) {
                    var len = entries.length;
                    if (!len)
                        return 0;
                    var s = this._source;
                    var first = s.length;
                    s.length += len;
                    for (var i = 0; i < len; i++) {
                        s[i + first] = entries[i];
                    }
                    return len;
                }
                else {
                    return _super.prototype._importEntries.call(this, entries);
                }
            };
            List.prototype.get = function (index) {
                return this._source[index];
            };
            List.prototype.set = function (index, value) {
                var s = this._source;
                if (index < s.length && Compare.areEqual(value, s[index]))
                    return false;
                s[index] = value;
                this._signalModification(true);
                return true;
            };
            List.prototype.indexOf = function (item) {
                return ArrayModule.indexOf(this._source, item, this._equalityComparer);
            };
            List.prototype.insert = function (index, value) {
                var _ = this;
                var s = _._source;
                if (index < s.length) {
                    _._source.splice(index, 0, value);
                }
                else {
                    _._source[index] = value;
                }
                _._signalModification(true);
            };
            List.prototype.removeAt = function (index) {
                if (ArrayModule.removeIndex(this._source, index)) {
                    this._signalModification(true);
                    return true;
                }
                return false;
            };
            List.prototype.contains = function (item) {
                return ArrayModule.contains(this._source, item, this._equalityComparer);
            };
            List.prototype.copyTo = function (target, index) {
                return ArrayModule.copyTo(this._source, target, 0, index);
            };
            List.prototype.getEnumerator = function () {
                var _ = this;
                _.throwIfDisposed();
                var source, index, version;
                return new Enumeration.EnumeratorBase(function () {
                    source = _._source;
                    version = _._version;
                    index = 0;
                }, function (yielder) {
                    if (index)
                        _.throwIfDisposed();
                    else if (_.wasDisposed) {
                        // We never actually started? Then no biggie.
                        return yielder.yieldBreak();
                    }
                    _.assertVersion(version);
                    if (index >= source.length) // Just in case the size changes as we enumerate use '>='.
                        return yielder.yieldBreak();
                    return yielder.yieldReturn(source[index++]);
                });
            };
            List.prototype.forEach = function (action, useCopy) {
                var s = this._source;
                return Enumeration.forEach(useCopy ? s.slice() : this, action);
            };
            List.prototype.addRange = function (entries) {
                var _this = this;
                entries.toArray().forEach(function (entry) { return _this.add(entry); });
            };
            return List;
        }(CollectionBase));
        Collections.List = List;
        var QueueModule;
        (function (QueueModule) {
            QueueModule.AU = ArrayModule;
            QueueModule.MINIMUM_GROW = 4;
            QueueModule.SHRINK_THRESHOLD = 32; // Unused?
            // var GROW_FACTOR: number = 200;  // double each time
            QueueModule.GROW_FACTOR_HALF = 100;
            QueueModule.DEFAULT_CAPACITY = QueueModule.MINIMUM_GROW;
            QueueModule.emptyArray = Object.freeze([]);
            function assertZeroOrGreater(value, property) {
                if (value < 0)
                    throw new Exceptions.ArgumentOutOfRangeException(property, value, "Must be greater than zero");
                return true;
            }
            QueueModule.assertZeroOrGreater = assertZeroOrGreater;
            function assertIntegerZeroOrGreater(value, property) {
                Integer.assert(value, property);
                return assertZeroOrGreater(value, property);
            }
            QueueModule.assertIntegerZeroOrGreater = assertIntegerZeroOrGreater;
        })(QueueModule || (QueueModule = {}));
        var Queue = /** @class */ (function (_super) {
            __extends(Queue, _super);
            function Queue(source, equalityComparer) {
                if (equalityComparer === void 0) { equalityComparer = Compare.areEqual; }
                var _this = _super.call(this, VOID0, equalityComparer) || this;
                var _ = _this;
                _._head = 0;
                _._tail = 0;
                _._size = 0;
                if (!source)
                    _._array = QueueModule.emptyArray;
                else {
                    if (Type.isNumber(source)) {
                        var capacity = source;
                        QueueModule.assertIntegerZeroOrGreater(capacity, "capacity");
                        _._array = capacity
                            ? QueueModule.AU.initialize(capacity)
                            : QueueModule.emptyArray;
                    }
                    else {
                        var se = source;
                        _._array = QueueModule.AU.initialize(Type.isArrayLike(se)
                            ? se.length
                            : QueueModule.DEFAULT_CAPACITY);
                        _._importEntries(se);
                    }
                }
                _._capacity = _._array.length;
                return _this;
            }
            Queue.prototype.getCount = function () {
                return this._size;
            };
            Queue.prototype._addInternal = function (item) {
                var _ = this;
                var size = _._size;
                var len = _._capacity;
                if (size == len) {
                    var newCapacity = len * QueueModule.GROW_FACTOR_HALF;
                    if (newCapacity < len + QueueModule.MINIMUM_GROW)
                        newCapacity = len + QueueModule.MINIMUM_GROW;
                    _.setCapacity(newCapacity);
                    len = _._capacity;
                }
                var tail = _._tail;
                _._array[tail] = item;
                _._tail = (tail + 1) % len;
                _._size = size + 1;
                return true;
            };
            //noinspection JSUnusedLocalSymbols
            Queue.prototype._removeInternal = function (item, max) {
                throw new Exceptions.NotImplementedException("ICollection\<T\>.remove is not implemented in Queue\<T\>" +
                    " since it would require destroying the underlying array to remove the item.");
            };
            Queue.prototype._clearInternal = function () {
                var _ = this;
                var array = _._array, head = _._head, tail = _._tail, size = _._size;
                if (head < tail)
                    QueueModule.AU.clear(array, head, tail);
                else {
                    QueueModule.AU.clear(array, head);
                    QueueModule.AU.clear(array, 0, tail);
                }
                _._head = 0;
                _._tail = 0;
                _._size = 0;
                _.trimExcess();
                return size;
            };
            Queue.prototype._onDispose = function () {
                _super.prototype._onDispose.call(this);
                var _ = this;
                if (_._array != QueueModule.emptyArray) {
                    _._array.length = _._capacity = 0;
                    _._array = QueueModule.emptyArray;
                }
            };
            /**
             * Dequeues entries into an array.
             */
            Queue.prototype.dump = function (max) {
                if (max === void 0) { max = Infinity; }
                var _ = this;
                var result = [];
                if (isFinite(max)) {
                    Integer.assertZeroOrGreater(max);
                    if (max !== 0) {
                        while (max-- && _._tryDequeueInternal(function (value) {
                            result.push(value);
                        })) { }
                    }
                }
                else {
                    while (_._tryDequeueInternal(function (value) {
                        result.push(value);
                    })) { }
                }
                _.trimExcess();
                _._signalModification();
                return result;
            };
            Queue.prototype.forEach = function (action) {
                return _super.prototype.forEach.call(this, action, true);
            };
            Queue.prototype.setCapacity = function (capacity) {
                var _ = this;
                QueueModule.assertIntegerZeroOrGreater(capacity, "capacity");
                var array = _._array, len = _._capacity;
                if (capacity > len)
                    _.throwIfDisposed();
                if (capacity == len)
                    return;
                var head = _._head, tail = _._tail, size = _._size;
                // Special case where we can simply extend the length of the array. (JavaScript only)
                if (array != QueueModule.emptyArray && capacity > len && head < tail) {
                    array.length = _._capacity = capacity;
                    _._version++;
                    return;
                }
                // We create a new array because modifying an existing one could be slow.
                var newArray = QueueModule.AU.initialize(capacity);
                if (size > 0) {
                    if (head < tail) {
                        QueueModule.AU.copyTo(array, newArray, head, 0, size);
                    }
                    else {
                        QueueModule.AU.copyTo(array, newArray, head, 0, len - head);
                        QueueModule.AU.copyTo(array, newArray, 0, len - head, tail);
                    }
                }
                _._array = newArray;
                _._capacity = capacity;
                _._head = 0;
                _._tail = (size == capacity) ? 0 : size;
                _._signalModification(true);
            };
            Queue.prototype.enqueue = function (item) {
                this.add(item);
            };
            Queue.prototype._tryDequeueInternal = function (out) {
                var _ = this;
                if (!_._size)
                    return false;
                var array = _._array, head = _._head;
                var removed = _._array[head];
                array[head] = null;
                _._head = (head + 1) % _._capacity;
                _._size--;
                _._incrementModified();
                out(removed);
                return true;
            };
            Queue.prototype.dequeue = function (throwIfEmpty) {
                if (throwIfEmpty === void 0) { throwIfEmpty = false; }
                var _ = this;
                _.assertModifiable();
                var result = VOID0;
                if (!this.tryDequeue(function (value) { result = value; }) && throwIfEmpty)
                    throw new Exceptions.InvalidOperationException("Cannot dequeue an empty queue.");
                return result;
            };
            /**
             * Checks to see if the queue has entries an pulls an entry from the head of the queue and passes it to the out handler.
             * @param out The 'out' handler that receives the value if it exists.
             * @returns {boolean} True if a value was retrieved.  False if not.
             */
            Queue.prototype.tryDequeue = function (out) {
                var _ = this;
                if (!_._size)
                    return false;
                _.assertModifiable();
                // A single dequeue shouldn't need update recursion tracking...
                if (this._tryDequeueInternal(out)) {
                    // This may preemptively trigger the _onModified.
                    if (_._size < _._capacity / 2)
                        _.trimExcess(QueueModule.SHRINK_THRESHOLD);
                    _._signalModification();
                    return true;
                }
                return false;
            };
            Queue.prototype._getElement = function (index) {
                QueueModule.assertIntegerZeroOrGreater(index, "index");
                var _ = this;
                return _._array[(_._head + index) % _._capacity];
            };
            Queue.prototype.peek = function (throwIfEmpty) {
                if (throwIfEmpty === void 0) { throwIfEmpty = false; }
                if (this._size == 0) {
                    if (throwIfEmpty)
                        throw new Exceptions.InvalidOperationException("Cannot call peek on an empty queue.");
                    return VOID0;
                }
                return this._array[this._head];
            };
            Queue.prototype.trimExcess = function (threshold) {
                var _ = this;
                var size = _._size;
                if (size < Math.floor(_._capacity * 0.9) && (!threshold && threshold !== 0 || isNaN(threshold) || threshold < size))
                    _.setCapacity(size);
            };
            Queue.prototype.getEnumerator = function () {
                var _ = this;
                _.throwIfDisposed();
                var index, version, size;
                return new Enumeration.EnumeratorBase(function () {
                    version = _._version;
                    size = _._size;
                    index = 0;
                }, function (yielder) {
                    _.throwIfDisposed();
                    _.assertVersion(version);
                    if (index == size)
                        return yielder.yieldBreak();
                    return yielder.yieldReturn(_._getElement(index++));
                });
            };
            return Queue;
        }(CollectionBase));
        Collections.Queue = Queue;
        var MapUtility;
        (function (MapUtility) {
            /**
             * Takes a target object and applies all source values to it.
             * @param target
             * @param source
             * @returns {any}
             */
            function apply(target, source) {
                var result = target || {};
                for (var key in source) {
                    if (source.hasOwnProperty(key)) {
                        result[key] = source[key];
                    }
                }
                return result;
            }
            MapUtility.apply = apply;
            /**
             * Takes a target object and ensures values exist.
             * @param target
             * @param defaults
             * @returns {any}
             */
            function ensure(target, defaults) {
                var result = target || {};
                for (var key in defaults) {
                    if (defaults.hasOwnProperty(key) && !result.hasOwnProperty(key)) {
                        result[key] = defaults[key];
                    }
                }
                return result;
            }
            MapUtility.ensure = ensure;
            /**
             * Make a copy of the source object.
             * @param source
             * @returns {Object}
             */
            function copy(source) {
                return apply({}, source);
            }
            MapUtility.copy = copy;
            /**
             * Takes two objects and creates another with the values of both.
             * B overwrites A.
             * @param a
             * @param b
             */
            function merge(a, b) {
                return apply(copy(a), b);
            }
            MapUtility.merge = merge;
            /**
             * Removes any keys that don't exist on the keyMap.
             * @param target
             * @param keyMap
             */
            function trim(target, keyMap) {
                for (var key in target) {
                    if (!keyMap.hasOwnProperty(key)) {
                        delete target[key];
                    }
                }
                //return <any>target;
            }
            MapUtility.trim = trim;
        })(MapUtility = Collections.MapUtility || (Collections.MapUtility = {}));
        function assertValidDetached(node, propName) {
            if (propName === void 0) { propName = "node"; }
            if (node == null)
                throw new Exceptions.ArgumentNullException(propName);
            if (node.next || node.previous)
                throw new Exceptions.InvalidOperationException("Cannot add a node to a LinkedNodeList that is already linked.");
        }
        function wipe(map, depth) {
            if (depth === void 0) { depth = 1; }
            if (map && depth) {
                for (var _i = 0, _a = Object.keys(map); _i < _a.length; _i++) {
                    var key = _a[_i];
                    var v = map[key];
                    delete map[key];
                    wipe(v, depth - 1);
                }
            }
        }
        var KeyNotFoundException = /** @class */ (function (_super) {
            __extends(KeyNotFoundException, _super);
            function KeyNotFoundException() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            KeyNotFoundException.prototype.getName = function () {
                return "KeyNotFoundException ";
            };
            return KeyNotFoundException;
        }(Exceptions.SystemException));
        Collections.KeyNotFoundException = KeyNotFoundException;
        var InternalSet;
        (function (InternalSet) {
            var using = Disposable.using;
            var areEqual = Compare.areEqual;
            var ArgumentNullException = Exceptions.ArgumentNullException;
            var forEach = Enumeration.forEach;
            var EmptyEnumerator = Enumeration.EmptyEnumerator;
            var VOID0 = void 0;
            var OTHER = 'other';
            function getId(obj) {
                return Dictionaries.getIdentifier(obj, typeof obj != Type.BOOLEAN);
            }
            InternalSet.getId = getId;
            var SetBase = /** @class */ (function (_super) {
                __extends(SetBase, _super);
                function SetBase(source) {
                    var _this = _super.call(this, VOID0, areEqual) || this;
                    _this._importEntries(source);
                    return _this;
                }
                SetBase.prototype._getSet = function () {
                    var s = this._set;
                    if (!s)
                        this._set = s = new LinkedNodeList();
                    return s;
                };
                SetBase.prototype.getCount = function () {
                    return this._set ? this._set.unsafeCount : 0;
                };
                SetBase.prototype.exceptWith = function (other) {
                    var _ = this;
                    if (!other)
                        throw new ArgumentNullException(OTHER);
                    forEach(other, function (v) {
                        if (_._removeInternal(v))
                            _._incrementModified();
                    });
                    _._signalModification();
                };
                SetBase.prototype.intersectWith = function (other) {
                    if (!other)
                        throw new ArgumentNullException(OTHER);
                    var _ = this;
                    if (other instanceof SetBase) {
                        var s = _._set;
                        if (s)
                            s.forEach(function (n) {
                                if (!other.contains(n.value) && _._removeInternal(n.value))
                                    _._incrementModified();
                            }, true);
                        _._signalModification();
                    }
                    else {
                        using(_.newUsing(other), function (o) { return _.intersectWith(o); });
                    }
                };
                SetBase.prototype.isProperSubsetOf = function (other) {
                    var _this = this;
                    if (!other)
                        throw new ArgumentNullException(OTHER);
                    return other instanceof SetBase
                        ? other.isProperSupersetOf(this)
                        : using(this.newUsing(other), function (o) { return o.isProperSupersetOf(_this); });
                };
                SetBase.prototype.isProperSupersetOf = function (other) {
                    var _this = this;
                    if (!other)
                        throw new ArgumentNullException(OTHER);
                    var result = true, count;
                    if (other instanceof SetBase) {
                        result = this.isSupersetOf(other);
                        count = other.getCount();
                    }
                    else {
                        count = using(this.newUsing(), function (o) {
                            forEach(other, function (v) {
                                o.add(v); // We have to add to another set in order to filter out duplicates.
                                // contains == false will cause this to exit.
                                return result = _this.contains(v);
                            });
                            return o.getCount();
                        });
                    }
                    return result && this.getCount() > count;
                };
                SetBase.prototype.isSubsetOf = function (other) {
                    var _this = this;
                    if (!other)
                        throw new ArgumentNullException(OTHER);
                    return other instanceof SetBase
                        ? other.isSupersetOf(this)
                        : using(this.newUsing(other), function (o) { return o.isSupersetOf(_this); });
                };
                SetBase.prototype.isSupersetOf = function (other) {
                    var _this = this;
                    if (!other)
                        throw new ArgumentNullException(OTHER);
                    var result = true;
                    forEach(other, function (v) {
                        return result = _this.contains(v);
                    });
                    return result;
                };
                SetBase.prototype.overlaps = function (other) {
                    var _this = this;
                    if (!other)
                        throw new ArgumentNullException(OTHER);
                    var result = false;
                    forEach(other, function (v) { return !(result = _this.contains(v)); });
                    return result;
                };
                SetBase.prototype.setEquals = function (other) {
                    if (!other)
                        throw new ArgumentNullException(OTHER);
                    return this.getCount() == (other instanceof SetBase
                        ? other.getCount()
                        : using(this.newUsing(other), function (o) { return o.getCount(); }))
                        && this.isSubsetOf(other);
                };
                SetBase.prototype.symmetricExceptWith = function (other) {
                    if (!other)
                        throw new ArgumentNullException(OTHER);
                    var _ = this;
                    if (other instanceof SetBase) {
                        forEach(other, function (v) {
                            if (_.contains(v)) {
                                if (_._removeInternal(v))
                                    _._incrementModified();
                            }
                            else {
                                if (_._addInternal(v))
                                    _._incrementModified();
                            }
                        });
                        _._signalModification();
                    }
                    else {
                        using(this.newUsing(other), function (o) { return _.symmetricExceptWith(o); });
                    }
                };
                SetBase.prototype.unionWith = function (other) {
                    this.importEntries(other);
                };
                SetBase.prototype._clearInternal = function () {
                    var s = this._set;
                    return s ? s.clear() : 0;
                };
                SetBase.prototype._onDispose = function () {
                    _super.prototype._onDispose.call(this);
                    this._set = null;
                };
                SetBase.prototype.contains = function (item) {
                    return !(!this.getCount() || !this._getNode(item));
                };
                SetBase.prototype.getEnumerator = function () {
                    var _ = this;
                    _.throwIfDisposed();
                    var s = _._set;
                    return s && _.getCount()
                        ? LinkedNodeList.valueEnumeratorFrom(s)
                        : EmptyEnumerator;
                };
                SetBase.prototype.forEach = function (action, useCopy) {
                    return useCopy
                        ? _super.prototype.forEach.call(this, action, useCopy)
                        : this._set.forEach(function (node, i) { return action(node.value, i); });
                };
                SetBase.prototype._removeNode = function (node) {
                    return !!node
                        && this.remove(node.value) != 0;
                };
                SetBase.prototype.removeFirst = function () {
                    var s = this._set;
                    return this._removeNode(s && s.first);
                };
                SetBase.prototype.removeLast = function () {
                    var s = this._set;
                    return this._removeNode(s && s.last);
                };
                return SetBase;
            }(CollectionBase));
            InternalSet.SetBase = SetBase;
            function wipe(map, depth) {
                if (depth === void 0) { depth = 1; }
                if (map && depth) {
                    for (var _i = 0, _a = Object.keys(map); _i < _a.length; _i++) {
                        var key = _a[_i];
                        var v = map[key];
                        delete map[key];
                        wipe(v, depth - 1);
                    }
                }
            }
        })(InternalSet = Collections.InternalSet || (Collections.InternalSet = {}));
        var SetBase = InternalSet.SetBase;
        var HashSet = /** @class */ (function (_super) {
            __extends(HashSet, _super);
            function HashSet(source, keyGenerator) {
                var _this = _super.call(this) || this;
                if (Type.isFunction(source)) {
                    _this._keyGenerator = source;
                }
                else {
                    if (!keyGenerator)
                        throw new Exceptions.ArgumentNullException("keyGenerator");
                    _this._keyGenerator = keyGenerator;
                    _this._importEntries(source);
                }
                return _this;
            }
            HashSet.prototype.newUsing = function (source) {
                return new HashSet(source, this._keyGenerator);
            };
            HashSet.prototype._addInternal = function (item) {
                var _ = this;
                var type = typeof item;
                var r = _._registry, t = r && r[type];
                var key = _._keyGenerator(item);
                if (!t || t[key] === VOID0) {
                    if (!r) {
                        //noinspection JSUnusedAssignment
                        _._registry = r = {};
                    }
                    if (!t) {
                        //noinspection JSUnusedAssignment
                        r[type] = t = {};
                    }
                    var node = { value: item };
                    _._getSet().addNode(node);
                    t[key] = node;
                    return true;
                }
                return false;
            };
            HashSet.prototype._clearInternal = function () {
                wipe(this._registry, 2);
                return _super.prototype._clearInternal.call(this);
            };
            HashSet.prototype._onDispose = function () {
                _super.prototype._onDispose.call(this);
                this._registry = null;
                this._keyGenerator = VOID0;
            };
            HashSet.prototype._getNode = function (item) {
                var r = this._registry, t = r && r[typeof item];
                return t && t[this._keyGenerator(item)];
            };
            HashSet.prototype._removeInternal = function (item, max) {
                if (max === void 0) { max = Infinity; }
                if (max === 0)
                    return 0;
                var r = this._registry, t = r && r[typeof item], node = t && t[item];
                if (node) {
                    delete t[item];
                    var s = this._set;
                    if (s && s.removeNode(node)) {
                        return 1;
                    }
                }
                return 0;
            };
            return HashSet;
        }(SetBase));
        Collections.HashSet = HashSet;
        var Set = /** @class */ (function (_super) {
            __extends(Set, _super);
            function Set(source) {
                return _super.call(this, source, InternalSet.getId) || this;
            }
            return Set;
        }(HashSet));
        Collections.Set = Set;
        var ArrayModule;
        (function (ArrayModule) {
            var Values = Compare;
            var Sorting;
            (function (Sorting) {
                function ensureArray(value) {
                    return (value) instanceof Array
                        ? value
                        : [value];
                }
                var QuickSort;
                (function (QuickSort) {
                    /**
                     * Quick internalSort O(n log (n))
                     * Warning: Uses recursion.
                     * @param target
                     * @returns {T[]}
                     */
                    function quickSort(target) {
                        if (!target)
                            throw new Exceptions.ArgumentNullException("target");
                        var len = target.length;
                        return target.length < 2 ? target : sort(target, 0, len - 1);
                    }
                    QuickSort.quickSort = quickSort;
                    function sort(target, low, high) {
                        if (low < high) {
                            // Partition first...
                            var swap = void 0;
                            var pivotIndex = Math.floor((low + high) / 2);
                            swap = target[pivotIndex];
                            target[pivotIndex] = target[high];
                            target[high] = swap;
                            var i = low;
                            for (var j = low; j < high; j++) {
                                if (target[j] < target[high]) {
                                    swap = target[i];
                                    target[i] = target[j];
                                    target[j] = swap;
                                    i++;
                                }
                            }
                            swap = target[i];
                            target[i] = target[high];
                            target[high] = swap;
                            sort(target, low, i - 1);
                            sort(target, i + 1, high);
                        }
                        return target;
                    }
                })(QuickSort = Sorting.QuickSort || (Sorting.QuickSort = {}));
                /**
                 * A factory function that creates a comparer to be used in multi-dimensional sorting.
                 *
                 * <h4>Example</h4>
                 * ```typescript
                 * var myArray = [{a:1:b:2},{a:3,b:4},{a:1,b:3}];
                 *
                 * // First sort by a, then by b.
                 * myArray.sort(
                 *   createComparer(
                 *     (e)=> [e.a, e.b],
                 *     [Order.Ascending, Order.Descending]
                 *   )
                 * );
                 *
                 * // result: [{a:1,b:3},{a:1:b:2},{a:3,b:4}]
                 * ```
                 *
                 * @param selector
                 * @param order
                 * @param equivalentToNaN
                 * @returns {(a:TSource, b:TSource)=>CompareResult}
                 */
                function createComparer(selector, order, equivalentToNaN) {
                    if (order === void 0) { order = 1 /* Ascending */; }
                    if (equivalentToNaN === void 0) { equivalentToNaN = NaN; }
                    var nanHasEquivalent = !Type.isTrueNaN(equivalentToNaN);
                    return function (a, b) {
                        // Use an array always to ensure a single code path.
                        var aValue = ensureArray(selector(a));
                        var bValue = ensureArray(selector(b));
                        var len = Math.min(aValue.length, bValue.length);
                        var oArray = (order) instanceof (Array) ? order : null;
                        for (var i = 0; i < len; i++) {
                            var vA = aValue[i], vB = bValue[i];
                            var o = oArray
                                ? (i < oArray.length ? oArray[i] : 1 /* Ascending */)
                                : order;
                            if (nanHasEquivalent) {
                                if (Type.isTrueNaN(vA))
                                    vA = equivalentToNaN;
                                if (Type.isTrueNaN(vB))
                                    vB = equivalentToNaN;
                            }
                            var r = Compare.compare(vA, vB);
                            if (r !== 0 /* Equal */)
                                return o * r;
                        }
                        return 0;
                    };
                }
                Sorting.createComparer = createComparer;
                function insertionSort(target) {
                    if (!target)
                        throw new Exceptions.ArgumentNullException("target");
                    var len = target.length;
                    for (var i = 1; i < len; i++) {
                        var j = i, j1 = void 0;
                        while (j > 0 && target[(j1 = j - 1)] > target[j]) {
                            var swap = target[j];
                            target[j] = target[j1];
                            target[j1] = swap;
                            j--;
                        }
                    }
                    return target;
                }
                Sorting.insertionSort = insertionSort;
                var MergeSort;
                (function (MergeSort) {
                    /**
                    * Merge internalSort O(n log (n))
                    * Warning: Uses recursion.
                    * @param target
                    * @returns {number[]}
                    */
                    function mergeSort(target) {
                        if (!target)
                            throw new Exceptions.ArgumentNullException("target");
                        var len = target.length;
                        return len < 2 ? target : sort(target, 0, len, initialize(len));
                    }
                    MergeSort.mergeSort = mergeSort;
                    function sort(target, start, end, temp) {
                        if (end - start > 1) {
                            // Step 1: Sort the left and right parts.
                            var middle = Math.floor((start + end) / 2);
                            sort(target, start, middle, temp);
                            sort(target, middle, end, temp);
                            // Step 2: Copy the original array
                            for (var i_2 = 0, len = target.length; i_2 < len; i_2++) {
                                temp[i_2] = target[i_2];
                            }
                            // Step 3: Create variables to traverse
                            var k = start, i = start, j = middle;
                            // Step 4: Merge: Move from the temp to target integers in order
                            while (i < middle && j < end) {
                                target[k++]
                                    = temp[i] > temp[j]
                                        ? temp[j++]
                                        : temp[i++];
                            }
                            // Step 5: Finalize merging in case right side of the array is bigger.
                            while (i < middle) {
                                target[k++] = temp[i++];
                            }
                        }
                        return target;
                    }
                })(MergeSort = Sorting.MergeSort || (Sorting.MergeSort = {}));
            })(Sorting = ArrayModule.Sorting || (ArrayModule.Sorting = {}));
            function initialize(length) {
                Integer.assert(length, "length");
                // This logic is based upon JS performance tests that show a significant difference at the level of 65536.
                var array;
                if (length > 65536)
                    array = new Array(length);
                else {
                    array = [];
                    array.length = length;
                }
                return array;
            }
            ArrayModule.initialize = initialize;
            function sum(source, ignoreNaN) {
                if (ignoreNaN === void 0) { ignoreNaN = false; }
                if (!source || !source.length)
                    return 0;
                var result = 0;
                if (ignoreNaN) {
                    for (var _i = 0, _a = source; _i < _a.length; _i++) {
                        var n = _a[_i];
                        if (!isNaN(n))
                            result += n;
                    }
                }
                else {
                    for (var _b = 0, _c = source; _b < _c.length; _b++) {
                        var n = _c[_b];
                        if (isNaN(n))
                            return NaN;
                        result += n;
                    }
                }
                return result;
            }
            ArrayModule.sum = sum;
            function average(source, ignoreNaN) {
                if (ignoreNaN === void 0) { ignoreNaN = false; }
                if (!source || !source.length)
                    return NaN;
                var result = 0, count;
                if (ignoreNaN) {
                    count = 0;
                    for (var _i = 0, _a = source; _i < _a.length; _i++) {
                        var n = _a[_i];
                        if (!isNaN(n)) {
                            result += n;
                            count++;
                        }
                    }
                }
                else {
                    count = source.length;
                    for (var _b = 0, _c = source; _b < _c.length; _b++) {
                        var n = _c[_b];
                        if (isNaN(n))
                            return NaN;
                        result += n;
                    }
                }
                return (!count || isNaN(result)) ? NaN : (result / count);
            }
            ArrayModule.average = average;
            function product(source, ignoreNaN) {
                if (ignoreNaN === void 0) { ignoreNaN = false; }
                if (!source || !source.length)
                    return NaN;
                var result = 1;
                if (ignoreNaN) {
                    var found = false;
                    for (var _i = 0, _a = source; _i < _a.length; _i++) {
                        var n = _a[_i];
                        if (!isNaN(n)) {
                            result *= n;
                            found = true;
                        }
                    }
                    if (!found)
                        return NaN;
                }
                else {
                    for (var _b = 0, _c = source; _b < _c.length; _b++) {
                        var n = _c[_b];
                        if (isNaN(n))
                            return NaN;
                        result *= n;
                    }
                }
                return result;
            }
            ArrayModule.product = product;
            /**
             * Takes the first number and divides it by all following.
             * @param source
             * @param ignoreNaN Will cause this skip any NaN values.
             * @returns {number}
             */
            function quotient(source, ignoreNaN) {
                if (ignoreNaN === void 0) { ignoreNaN = false; }
                var len = source ? source.length : 0;
                if (len < 2)
                    return NaN;
                var result = source[0];
                var found = false;
                for (var i = 1; i < len; i++) {
                    var n = source[i];
                    if (n === 0) {
                        return NaN;
                    }
                    if (isNaN(n)) {
                        if (!ignoreNaN) {
                            return NaN;
                        }
                    }
                    else {
                        result /= n;
                        if (!found)
                            found = true;
                    }
                }
                return found ? result : NaN;
            }
            ArrayModule.quotient = quotient;
            function ifSet(source, start, ignoreNaN, predicate) {
                if (!source || !source.length)
                    return NaN;
                var result = start;
                if (ignoreNaN) {
                    var found = false;
                    for (var _i = 0, _a = source; _i < _a.length; _i++) {
                        var n = _a[_i];
                        if (!isNaN(n)) {
                            if (predicate(n, result))
                                result = n;
                            if (!found)
                                found = true;
                        }
                    }
                    if (!found)
                        return NaN;
                }
                else {
                    for (var _b = 0, _c = source; _b < _c.length; _b++) {
                        var n = _c[_b];
                        if (isNaN(n))
                            return NaN;
                        if (predicate(n, result))
                            result = n;
                    }
                }
                return result;
            }
            function min(source, ignoreNaN) {
                if (ignoreNaN === void 0) { ignoreNaN = false; }
                return ifSet(source, +Infinity, ignoreNaN, function (n, result) { return n < result; });
            }
            ArrayModule.min = min;
            function max(source, ignoreNaN) {
                if (ignoreNaN === void 0) { ignoreNaN = false; }
                return ifSet(source, -Infinity, ignoreNaN, function (n, result) { return n > result; });
            }
            ArrayModule.max = max;
            function shuffle(target) {
                var i = target.length;
                while (--i) {
                    var j = Math.floor(Math.random() * (i + 1));
                    var temp = target[i];
                    target[i] = target[j];
                    target[j] = temp;
                }
                return target;
            }
            ArrayModule.shuffle = shuffle;
            var CB0 = "Cannot be zero.", VFN = "Must be a valid finite number";
            /**
             * Checks to see where the provided array contains an item/value.
             * If the array value is null, then -1 is returned.
             * @param array
             * @param item
             * @param {function?} equalityComparer
             * @returns {number}
             */
            function indexOf(array, item, equalityComparer) {
                if (equalityComparer === void 0) { equalityComparer = Compare.areEqual; }
                var len = array && array.length;
                if (len) {
                    // NaN NEVER evaluates its equality so be careful.
                    if ((array) instanceof (Array) && !Type.isTrueNaN(item))
                        return array.indexOf(item);
                    for (var i = 0; i < len; i++) {
                        // 'areEqual' includes NaN==NaN evaluation.
                        if (equalityComparer(array[i], item))
                            return i;
                    }
                }
                return -1;
            }
            ArrayModule.indexOf = indexOf;
            /**
             * Checks to see if the provided array contains an item.
             * If the array value is null, then false is returned.
             * @param array
             * @param item
             * @param {function?} equalityComparer
             * @returns {boolean}
             */
            function contains(array, item, equalityComparer) {
                if (equalityComparer === void 0) { equalityComparer = Compare.areEqual; }
                return indexOf(array, item, equalityComparer) != -1;
            }
            ArrayModule.contains = contains;
            /**
             * Finds and replaces a value from an array.  Will replaces all instances unless a maximum is specified.
             * @param array
             * @param old
             * @param newValue
             * @param max
             * @returns {number}
             */
            function replace(array, old, newValue, max) {
                if (max === void 0) { max = Infinity; }
                if (!array || !array.length || max === 0)
                    return 0;
                if (max < 0)
                    throw new Exceptions.ArgumentOutOfRangeException("max", max, CBL0);
                if (!max)
                    max = Infinity; // just in case.
                var count = 0;
                for (var i = 0, len = array.length; i < len; i++) {
                    if (array[i] === old) {
                        array[i] = newValue;
                        ++count;
                        if (count == max)
                            break;
                    }
                }
                return count;
            }
            ArrayModule.replace = replace;
            /**
             * Replaces values of an array across a range of indexes.
             * @param array
             * @param value
             * @param start
             * @param stop
             */
            function updateRange(array, value, start, stop) {
                if (start === void 0) { start = 0; }
                if (!array)
                    return;
                Integer.assertZeroOrGreater(start, "start");
                if (!stop && stop !== 0)
                    stop = array.length;
                Integer.assert(stop, "stop");
                if (stop < start)
                    throw new Exceptions.ArgumentOutOfRangeException("stop", stop, "is less than start");
                for (var i = start; i < stop; i++) {
                    array[i] = value;
                }
            }
            ArrayModule.updateRange = updateRange;
            /**
             * Clears (sets to null) values of an array across a range of indexes.
             * @param array
             * @param start
             * @param stop
             */
            function clear(array, start, stop) {
                if (start === void 0) { start = 0; }
                updateRange(array, null, start, stop);
            }
            ArrayModule.clear = clear;
            /**
             * Ensures a value exists within an array.  If not found, adds to the end.
             * @param array
             * @param item
             * @param {function?} equalityComparer
             * @returns {boolean}
             */
            function register(array, item, equalityComparer) {
                if (equalityComparer === void 0) { equalityComparer = Compare.areEqual; }
                if (!array)
                    throw new Exceptions.ArgumentNullException("array", CBN);
                var len = array.length; // avoid querying .length more than once. *
                var ok = !len || !contains(array, item, equalityComparer);
                if (ok)
                    array[len] = item; // * push would query length again.
                return ok;
            }
            ArrayModule.register = register;
            /**
             * Returns the first index of which the provided predicate returns true.
             * Returns -1 if always false.
             * @param array
             * @param predicate
             * @returns {number}
             */
            function findIndex(array, predicate) {
                if (!array)
                    throw new Exceptions.ArgumentNullException("array", CBN);
                if (!Type.isFunction(predicate))
                    throw new Exceptions.ArgumentException("predicate", "Must be a function.");
                var len = array.length;
                if (!Type.isNumber(len, true) || len < 0)
                    throw new Exceptions.ArgumentException("array", "Does not have a valid length.");
                if ((array) instanceof (Array)) {
                    for (var i = 0; i < len; i++) {
                        if (predicate(array[i], i))
                            return i;
                    }
                }
                else {
                    for (var i = 0; i < len; i++) {
                        if ((i) in (array) && predicate(array[i], i))
                            return i;
                    }
                }
                return -1;
            }
            ArrayModule.findIndex = findIndex;
            function forEach(source, action) {
                if (source && action) {
                    // Don't cache the length since it is possible that the underlying array changed.
                    for (var i = 0; i < source.length; i++) {
                        if (action(source[i], i) === false)
                            break;
                    }
                }
            }
            ArrayModule.forEach = forEach;
            /**
             * Is similar to Array.map() but instead of returning a new array, it updates the existing indexes.
             * Can also be applied to a structure that indexes like an array, but may not be.
             * @param target
             * @param fn
             */
            function applyTo(target, fn) {
                if (target && fn) {
                    for (var i = 0; i < target.length; i++) {
                        target[i] = fn(target[i], i);
                    }
                }
            }
            ArrayModule.applyTo = applyTo;
            /**
             * Removes an entry at a specified index.
             * @param array
             * @param index
             * @returns {boolean} True if the value was able to be removed.
             */
            function removeIndex(array, index) {
                if (!array)
                    throw new Exceptions.ArgumentNullException("array", CBN);
                Integer.assert(index, "index");
                if (index < 0)
                    throw new Exceptions.ArgumentOutOfRangeException("index", index, CBL0);
                var exists = index < array.length;
                if (exists)
                    array.splice(index, 1);
                return exists;
            }
            ArrayModule.removeIndex = removeIndex;
            /**
             * Finds and removes a value from an array.  Will remove all instances unless a maximum is specified.
             * @param array
             * @param value
             * @param max
             * @param {function?} equalityComparer
             * @returns {number} The number of times the value was found and removed.
             */
            function remove(array, value, max, equalityComparer) {
                if (max === void 0) { max = Infinity; }
                if (equalityComparer === void 0) { equalityComparer = Compare.areEqual; }
                if (!array || !array.length || max === 0)
                    return 0;
                if (max < 0)
                    throw new Exceptions.ArgumentOutOfRangeException("max", max, CBL0);
                var count = 0;
                if (!max || !isFinite(max)) {
                    // Don't track the indexes and remove in reverse.
                    for (var i = (array.length - 1); i >= 0; i--) {
                        if (equalityComparer(array[i], value)) {
                            array.splice(i, 1);
                            ++count;
                        }
                    }
                }
                else {
                    // Since the user will expect it to happen in forward order...
                    var found = []; // indexes;
                    for (var i = 0, len = array.length; i < len; i++) {
                        if (equalityComparer(array[i], value)) {
                            found.push(i);
                            ++count;
                            if (count == max)
                                break;
                        }
                    }
                    for (var i = found.length - 1; i >= 0; i--) {
                        array.splice(found[i], 1);
                    }
                }
                return count;
            }
            ArrayModule.remove = remove;
            /**
             * Simply repeats a value the number of times specified.
             * @param element
             * @param count
             * @returns {T[]}
             */
            function repeat(element, count) {
                Integer.assert(count, "count");
                if (count < 0)
                    throw new Exceptions.ArgumentOutOfRangeException("count", count, CBL0);
                var result = initialize(count);
                for (var i = 0; i < count; i++) {
                    result[i] = element;
                }
                return result;
            }
            ArrayModule.repeat = repeat;
            /**
             * Returns a range of numbers based upon the first value and the step value.
             * @param first
             * @param count
             * @param step
             * @returns {number[]}
             */
            function range(first, count, step) {
                if (step === void 0) { step = 1; }
                if (isNaN(first) || !isFinite(first))
                    throw new Exceptions.ArgumentOutOfRangeException("first", first, VFN);
                if (isNaN(count) || !isFinite(count))
                    throw new Exceptions.ArgumentOutOfRangeException("count", count, VFN);
                if (count < 0)
                    throw new Exceptions.ArgumentOutOfRangeException("count", count, CBL0);
                var result = initialize(count);
                for (var i = 0; i < count; i++) {
                    result[i] = first;
                    first += step;
                }
                return result;
            }
            ArrayModule.range = range;
            /**
             * Returns a range of numbers based upon the first value and the step value excluding any numbers at or beyond the until value.
             * @param first
             * @param until
             * @param step
             * @returns {number[]}
             */
            function rangeUntil(first, until, step) {
                if (step === void 0) { step = 1; }
                if (step == 0)
                    throw new Exceptions.ArgumentOutOfRangeException("step", step, CB0);
                return range(first, (until - first) / step, step);
            }
            ArrayModule.rangeUntil = rangeUntil;
            function distinct(source) {
                var seen = {};
                return source.filter(function (e) { return !(e in seen) && (seen[e] = true); });
            }
            ArrayModule.distinct = distinct;
            /**
             * Takes any arrays within an array and inserts the values contained within in place of that array.
             * For every count higher than 0 in recurseDepth it will attempt an additional pass.  Passing Infinity will flatten all arrays contained.
             * @param a
             * @param recurseDepth
             * @returns {any[]}
             */
            function flatten(a, recurseDepth) {
                if (recurseDepth === void 0) { recurseDepth = 0; }
                var result = [];
                for (var i = 0; i < a.length; i++) {
                    var x = a[i];
                    if ((x) instanceof (Array)) {
                        if (recurseDepth > 0)
                            x = flatten(x, recurseDepth - 1);
                        for (var n = 0; n < x.length; n++)
                            result.push(x[n]);
                    }
                    else
                        result.push(x);
                }
                return result;
            }
            ArrayModule.flatten = flatten;
            var ArraySort;
            (function (ArraySort) {
                ArraySort.quick = Sorting.QuickSort.quickSort;
                var createComparer = Sorting.createComparer;
                function using(target, selector, order, equivalentToNaN) {
                    if (order === void 0) { order = 1 /* Ascending */; }
                    if (equivalentToNaN === void 0) { equivalentToNaN = NaN; }
                    return target.sort(createComparer(selector, order, equivalentToNaN));
                }
                ArraySort.using = using;
            })(ArraySort = ArrayModule.ArraySort || (ArrayModule.ArraySort = {}));
            var ReadOnlyArrayWrapper = /** @class */ (function (_super) {
                __extends(ReadOnlyArrayWrapper, _super);
                function ReadOnlyArrayWrapper(array) {
                    var _this = _super.call(this, array) || this;
                    _this.__getValueAt = function (i) { return array[i]; };
                    return _this;
                }
                ReadOnlyArrayWrapper.prototype._onDispose = function () {
                    _super.prototype._onDispose.call(this);
                    this.__getValueAt = null;
                };
                ReadOnlyArrayWrapper.prototype.getValueAt = function (index) {
                    this.throwIfDisposed();
                    return this.__getValueAt(index);
                };
                return ReadOnlyArrayWrapper;
            }(ReadOnlyCollectionWrapper));
            ArrayModule.ReadOnlyArrayWrapper = ReadOnlyArrayWrapper;
            /*  validateSize: Utility for quick validation/invalidation of array equality.
            Why this way?  Why not pass a closure for the last return?
            Reason: Performance and avoiding the creation of new functions/closures. */
            function validateSize(a, b) {
                // Both valid and are same object, or both are null/undefined.
                if (a && b && a === b || !a && !b)
                    return true;
                // At this point, at least one has to be non-null.
                if (!a || !b)
                    return false;
                var len = a.length;
                if (len !== b.length)
                    return false;
                // If both are arrays and have zero length, they are equal.
                if (len === 0)
                    return true;
                // Return the length for downstream processing.
                return len;
            }
            function areAllEqual(arrays, strict, equalityComparer) {
                if (strict === void 0) { strict = true; }
                if (equalityComparer === void 0) { equalityComparer = Values.areEqual; }
                if (!arrays)
                    throw new Error("ArgumentNullException: 'arrays' cannot be null.");
                if (arrays.length < 2)
                    throw new Error("Cannot compare a set of arrays less than 2.");
                if (Type.isFunction(strict)) {
                    equalityComparer = strict;
                    strict = true;
                }
                var first = arrays[0];
                for (var i = 1, l = arrays.length; i < l; i++) {
                    if (!areEqual(first, arrays[i], strict, equalityComparer))
                        return false;
                }
                return true;
            }
            ArrayModule.areAllEqual = areAllEqual;
            function areEqual(a, b, strict, equalityComparer) {
                if (strict === void 0) { strict = true; }
                if (equalityComparer === void 0) { equalityComparer = Values.areEqual; }
                var len = validateSize(a, b);
                if (Type.isBoolean(len))
                    return len;
                if (Type.isFunction(strict)) {
                    equalityComparer = strict;
                    strict = true;
                }
                for (var i = 0; i < len; i++) {
                    if (!equalityComparer(a[i], b[i], strict))
                        return false;
                }
                return true;
            }
            ArrayModule.areEqual = areEqual;
            function internalSort(a, comparer) {
                if (!a || a.length < 2)
                    return a;
                var len = a.length;
                var b;
                if (len > 65536)
                    b = new Array(len);
                else {
                    b = [];
                    b.length = len;
                }
                for (var i = 0; i < len; i++) {
                    b[i] = a[i];
                }
                b.sort(comparer);
                return b;
            }
            function areEquivalent(a, b, comparer) {
                if (comparer === void 0) { comparer = Values.compare; }
                var len = validateSize(a, b);
                if (Type.isBoolean(len))
                    return len;
                // There might be a better more performant way to do this, but for the moment, this
                // works quite well.
                a = internalSort(a, comparer);
                b = internalSort(b, comparer);
                for (var i = 0; i < len; i++) {
                    if (comparer(a[i], b[i]) !== 0)
                        return false;
                }
                return true;
            }
            ArrayModule.areEquivalent = areEquivalent;
            /**
             *
             * @param source
             * @param sourceIndex
             * @param length
             * @returns {any}
             */
            function copy(source, sourceIndex, length) {
                if (sourceIndex === void 0) { sourceIndex = 0; }
                if (length === void 0) { length = Infinity; }
                if (!source)
                    return source; // may have passed zero? undefined? or null?
                return copyTo(source, initialize(Math.min(length, Math.max(source.length - sourceIndex, 0))), sourceIndex, 0, length);
            }
            ArrayModule.copy = copy;
            var CBN = "Cannot be null.", CBL0 = "Cannot be less than zero.";
            /**
             * Copies one array to another.
             * @param source
             * @param destination
             * @param sourceIndex
             * @param destinationIndex
             * @param length An optional limit to stop copying.
             * @returns The destination array.
             */
            function copyTo(source, destination, sourceIndex, destinationIndex, length) {
                if (sourceIndex === void 0) { sourceIndex = 0; }
                if (destinationIndex === void 0) { destinationIndex = 0; }
                if (length === void 0) { length = Infinity; }
                if (!source)
                    throw new Exceptions.ArgumentNullException("source", CBN);
                if (!destination)
                    throw new Exceptions.ArgumentNullException("destination", CBN);
                if (sourceIndex < 0)
                    throw new Exceptions.ArgumentOutOfRangeException("sourceIndex", sourceIndex, CBL0);
                var sourceLength = source.length;
                if (!sourceLength)
                    return destination;
                if (sourceIndex >= sourceLength)
                    throw new Exceptions.ArgumentOutOfRangeException("sourceIndex", sourceIndex, "Must be less than the length of the source array.");
                if (destination.length < 0)
                    throw new Exceptions.ArgumentOutOfRangeException("destinationIndex", destinationIndex, CBL0);
                var maxLength = source.length - sourceIndex;
                if (isFinite(length) && length > maxLength)
                    throw new Exceptions.ArgumentOutOfRangeException("sourceIndex", sourceIndex, "Source index + length cannot exceed the length of the source array.");
                length = Math.min(length, maxLength);
                var newLength = destinationIndex + length;
                if (newLength > destination.length)
                    destination.length = newLength;
                for (var i = 0; i < length; i++) {
                    destination[destinationIndex + i] = source[sourceIndex + i];
                }
                return destination;
            }
            ArrayModule.copyTo = copyTo;
            var VOID0 = void 0;
            /**
             * Simply takes a payload and passes it to all the listeners.
             * Makes a arrayCopy of the listeners before calling dispatchUnsafe.
             *
             * @param listeners
             * @param payload
             * @param trap
             */
            function dispatch(listeners, payload, trap) {
                dispatch.unsafe(copy(listeners), payload, trap);
            }
            ArrayModule.dispatch = dispatch;
            (function (dispatch) {
                /**
                 * Simply takes a payload and passes it to all the listeners.
                 *
                 * While dispatching:
                 * * This is an unsafe method if by chance any of the listeners modify the array.
                 * * It cannot prevent changes to the payload.
                 *
                 * Improving safety:
                 * * Only use a local array that isn't exposed to the listeners.
                 * * Use the dispatch method instead as it makes a arrayCopy of the listeners array.
                 * * Freeze the listeners array so it can't be modified.
                 * * Freeze the payload.
                 *
                 * Specifying trap will catch any errors and pass them along if trap is a function.
                 * A payload is used instead of arguments for easy typing.
                 *
                 *
                 * @param listeners
                 * @param payload
                 * @param trap
                 */
                function unsafe(listeners, payload, trap) {
                    if (listeners && listeners.length) {
                        for (var i = 0, len = listeners.length; i < len; i++) {
                            var fn = listeners[i];
                            if (!fn)
                                continue; // Ignore null refs.
                            try {
                                fn(payload);
                            }
                            catch (ex) {
                                if (!trap)
                                    throw ex;
                                else if (Type.isFunction(trap))
                                    trap(ex, i);
                            }
                        }
                    }
                }
                dispatch.unsafe = unsafe;
                /**
                 * Simply takes a payload and passes it to all the listeners.
                 * Returns the results in an array that matches the indexes of the listeners.
                 *
                 * @param listeners
                 * @param payload
                 * @param trap
                 * @returns {any}
                 */
                function mapped(listeners, payload, trap) {
                    if (!listeners)
                        return listeners;
                    // Reuse the arrayCopy as the array result.
                    var result = copy(listeners);
                    if (listeners.length) {
                        for (var i = 0, len = result.length; i < len; i++) {
                            var fn = result[i];
                            try {
                                result[i] = fn // Ignore null refs.
                                    ? fn(payload)
                                    : VOID0;
                            }
                            catch (ex) {
                                result[i] = VOID0;
                                if (!trap)
                                    throw ex;
                                else if (Type.isFunction(trap))
                                    trap(ex, i);
                            }
                        }
                    }
                    return result;
                }
                dispatch.mapped = mapped;
            })(dispatch = ArrayModule.dispatch || (ArrayModule.dispatch = {}));
        })(ArrayModule = Collections.ArrayModule || (Collections.ArrayModule = {}));
        var Dictionaries;
        (function (Dictionaries) {
            var ArgumentOutOfRangeException = Exceptions.ArgumentOutOfRangeException;
            var InvalidOperationException = Exceptions.InvalidOperationException;
            var VOID0 = void 0;
            var NULL = "null", GET_SYMBOL = "getSymbol", GET_HASH_CODE = "getHashCode";
            function getIdentifier(obj, throwIfUnknown) {
                if (throwIfUnknown === void 0) { throwIfUnknown = false; }
                if (Type.isPropertyKey(obj))
                    return obj;
                if (obj === null)
                    return NULL;
                if (obj === VOID0)
                    return Type.UNDEFINED;
                // See ISymbolizable.
                if (Type.hasMethod(obj, GET_SYMBOL)) {
                    return obj.getSymbol();
                }
                // See IHashable.
                if (Type.hasMethod(obj, GET_HASH_CODE)) {
                    return obj.getHashCode();
                }
                if (throwIfUnknown) {
                    if (Type.isFunction(throwIfUnknown))
                        return throwIfUnknown(obj);
                    else
                        throw "Cannot create known identity.";
                }
                return (typeof obj.toString == Type.FUNCTION)
                    ? obj.toString()
                    : Object.prototype.toString.call(obj);
            }
            Dictionaries.getIdentifier = getIdentifier;
            // Design Note: Should DictionaryAbstractBase be IDisposable?
            var DictionaryBase = /** @class */ (function (_super) {
                __extends(DictionaryBase, _super);
                function DictionaryBase(source) {
                    return _super.call(this, source) || this;
                }
                //noinspection JSUnusedLocalSymbols
                DictionaryBase.prototype._onValueModified = function (key, value, old) {
                };
                DictionaryBase.prototype._addInternal = function (item) {
                    var _this = this;
                    if (!item)
                        throw new Exceptions.ArgumentNullException("item", "Dictionaries must use a valid key/value pair. '" + item + "' is not allowed.");
                    return KeyValueExtractModule.extractKeyValue(item, function (key, value) { return _this.addByKeyValue(key, value); });
                };
                DictionaryBase.prototype._clearInternal = function () {
                    var _ = this;
                    var count = 0;
                    for (var _i = 0, _a = _.keys; _i < _a.length; _i++) {
                        var key = _a[_i];
                        if (_.removeByKey(key))
                            count++;
                    }
                    return count;
                };
                DictionaryBase.prototype.contains = function (item) {
                    var _this = this;
                    // Should never have a null object in the collection.
                    if (!item || !this.getCount())
                        return false;
                    return KeyValueExtractModule.extractKeyValue(item, function (key, value) {
                        // Leave as variable for debugging...
                        var v = _this.getValue(key);
                        return Compare.areEqual(value, v);
                    });
                };
                DictionaryBase.prototype._removeInternal = function (item) {
                    var _this = this;
                    if (!item)
                        return 0;
                    return KeyValueExtractModule.extractKeyValue(item, function (key, value) {
                        // Leave as variable for debugging...
                        var v = _this.getValue(key);
                        return (Compare.areEqual(value, v) && _this.removeByKey(key))
                            ? 1 : 0;
                    });
                };
                Object.defineProperty(DictionaryBase.prototype, "keys", {
                    get: function () { return this.getKeys(); },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(DictionaryBase.prototype, "values", {
                    get: function () { return this.getValues(); },
                    enumerable: false,
                    configurable: true
                });
                DictionaryBase.prototype.addByKeyValue = function (key, value) {
                    if (value === VOID0)
                        throw new InvalidOperationException("Cannot add 'undefined' as a value.");
                    var _ = this;
                    if (_.containsKey(key)) {
                        var ex = new InvalidOperationException("Adding a key/value when the key already exists.");
                        ex.data["key"] = key;
                        ex.data["value"] = value;
                        throw ex;
                    }
                    return _.setValue(key, value);
                };
                DictionaryBase.prototype.getAssuredValue = function (key) {
                    var value = this.getValue(key);
                    if (value === VOID0)
                        throw new KeyNotFoundException("Key '" + key + "' not found.");
                    return value;
                };
                DictionaryBase.prototype.tryGetValue = function (key, out) {
                    var value = this.getValue(key);
                    if (value !== VOID0) {
                        out(value);
                        return true;
                    }
                    return false;
                };
                /**
                 * Sets the value of an entry.
                 * It's important to know that 'undefined' cannot exist as a value in the dictionary and is used as a flag for removal.
                 * @param key
                 * @param value
                 * @returns {boolean}
                 */
                DictionaryBase.prototype.setValue = function (key, value) {
                    // setValue shouldn't need to worry about recursion...
                    var _ = this;
                    _.assertModifiable();
                    var changed = false;
                    var old = _.getValue(key); // get the old value here and pass to internal.
                    if (!Compare.areEqual(value, old) && _._setValueInternal(key, value)) {
                        changed = true;
                        _._onValueModified(key, value, old);
                    }
                    _._signalModification(changed);
                    return changed;
                };
                DictionaryBase.prototype.containsKey = function (key) {
                    return !!this._getEntry(key);
                };
                DictionaryBase.prototype.containsValue = function (value) {
                    var e = this.getEnumerator();
                    while (e.moveNext()) {
                        if (Compare.areEqual(e.current, value, true)) {
                            e.dispose();
                            return true;
                        }
                    }
                    return false;
                };
                DictionaryBase.prototype.removeByKey = function (key) {
                    return this.setValue(key, VOID0);
                };
                DictionaryBase.prototype.removeByValue = function (value) {
                    var _ = this;
                    var count = 0;
                    for (var _i = 0, _a = _.getKeys(); _i < _a.length; _i++) {
                        var key = _a[_i];
                        if (Compare.areEqual(_.getValue(key), value, true)) {
                            _.removeByKey(key);
                            count++;
                        }
                    }
                    return count;
                };
                DictionaryBase.prototype.importEntries = function (pairs) {
                    // Allow piping through to trigger onModified properly.
                    return _super.prototype.importEntries.call(this, pairs);
                };
                DictionaryBase.prototype._importEntries = function (pairs) {
                    var _ = this;
                    if (!pairs)
                        return 0;
                    var changed = 0;
                    Enumeration.forEach(pairs, function (pair) { return KeyValueExtractModule.extractKeyValue(pair, function (key, value) {
                        if (_._setValueInternal(key, value))
                            changed++;
                    }); });
                    return changed;
                };
                DictionaryBase.prototype.getEnumerator = function () {
                    var _ = this;
                    _.throwIfDisposed();
                    var ver, keys, len, index = 0;
                    return new Enumeration.EnumeratorBase(function () {
                        _.throwIfDisposed();
                        ver = _._version; // Track the version since getKeys is a copy.
                        keys = _.getKeys();
                        len = keys.length;
                    }, function (yielder) {
                        _.throwIfDisposed();
                        _.assertVersion(ver);
                        while (index < len) {
                            var key = keys[index++], value = _.getValue(key);
                            if (value !== VOID0) // Still valid?
                                return yielder.yieldReturn({ key: key, value: value });
                        }
                        return yielder.yieldBreak();
                    });
                };
                return DictionaryBase;
            }(CollectionBase));
            Dictionaries.DictionaryBase = DictionaryBase;
            // LinkedList for Dictionary
            var HashEntry = /** @class */ (function () {
                function HashEntry(key, value, previous, next) {
                    this.key = key;
                    this.value = value;
                    this.previous = previous;
                    this.next = next;
                }
                return HashEntry;
            }());
            var linkedListPool;
            //noinspection JSUnusedLocalSymbols
            function linkedNodeList(recycle) {
                if (!linkedListPool)
                    linkedListPool
                        = new Disposable.ObjectPool(20, function () { return new LinkedNodeList(); }, function (r) { return r.clear(); });
                if (!recycle)
                    return linkedListPool.take();
                linkedListPool.add(recycle);
            }
            var StringKeyDictionary = /** @class */ (function (_super) {
                __extends(StringKeyDictionary, _super);
                function StringKeyDictionary() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this._count = 0;
                    _this._map = {};
                    return _this;
                }
                StringKeyDictionary.prototype._onDispose = function () {
                    _super.prototype._onDispose.call(this);
                    this._map = null;
                };
                StringKeyDictionary.prototype._getEntry = function (key) {
                    return !this.containsKey(key)
                        ? null : {
                        key: key,
                        value: this.getAssuredValue(key)
                    };
                };
                StringKeyDictionary.prototype.containsKey = function (key) {
                    return key != null
                        && this._count != 0
                        && this._map[key] !== VOID0;
                };
                StringKeyDictionary.prototype.containsValue = function (value) {
                    if (!this._count)
                        return false;
                    var map = this._map;
                    for (var key in map) {
                        if (map.hasOwnProperty(key) && Compare.areEqual(map[key], value))
                            return true;
                    }
                    return false;
                };
                StringKeyDictionary.prototype.getValue = function (key) {
                    return key == null || !this._count
                        ? VOID0
                        : this._map[key];
                };
                StringKeyDictionary.prototype._setValueInternal = function (key, value) {
                    var _ = this;
                    var map = _._map, old = map[key];
                    if (old !== value) {
                        if (value === VOID0) {
                            if ((key) in (map)) {
                                delete map[key];
                                _._count--;
                            }
                        }
                        else {
                            if (!map.hasOwnProperty(key))
                                _._count++;
                            map[key] = value;
                        }
                        return true;
                    }
                    return false;
                };
                // Returns true if any value is updated...
                StringKeyDictionary.prototype.importMap = function (values) {
                    var _ = this;
                    return _.handleUpdate(function () {
                        var changed = false;
                        for (var key in values) {
                            if (values.hasOwnProperty(key) && _.setValue(key, values[key]))
                                changed = true;
                        }
                        return changed;
                    });
                };
                StringKeyDictionary.prototype.toMap = function (selector) {
                    var _ = this;
                    var result = {};
                    if (_._count)
                        for (var key in _._map) {
                            if (_._map.hasOwnProperty(key)) // This simply satisfies inspection.
                             {
                                var value = _._map[key];
                                if (selector)
                                    value = selector(key, value);
                                if (value !== VOID0)
                                    result[key] = value;
                            }
                        }
                    return result;
                };
                StringKeyDictionary.prototype.getKeys = function () {
                    return Object.keys(this._map);
                };
                StringKeyDictionary.prototype.getValues = function () {
                    if (!this._count)
                        return [];
                    var result = Object.keys(this._map);
                    for (var i = 0, len = result.length; i < len; i++) {
                        result[i] = this._map[result[i]];
                    }
                    return result;
                };
                StringKeyDictionary.prototype.getCount = function () {
                    return this._count;
                };
                return StringKeyDictionary;
            }(DictionaryBase));
            Dictionaries.StringKeyDictionary = StringKeyDictionary;
            var OrderedStringKeyDictionary = /** @class */ (function (_super) {
                __extends(OrderedStringKeyDictionary, _super);
                function OrderedStringKeyDictionary() {
                    var _this = _super.call(this) || this;
                    // noinspection JSMismatchedCollectionQueryUpdate
                    _this._order = []; // Maintains indexes.
                    return _this;
                }
                OrderedStringKeyDictionary.prototype.indexOfKey = function (key) {
                    var o = this._order;
                    return o.length ? o.indexOf(key, 0) : -1;
                };
                OrderedStringKeyDictionary.prototype.getValueByIndex = function (index) {
                    Integer.assertZeroOrGreater(index);
                    var o = this._order;
                    if (index < o.length)
                        return this.getAssuredValue(o[index]);
                    throw new ArgumentOutOfRangeException("index", index);
                };
                // adding keepIndex allows for clearing a value while still retaining it's index.
                OrderedStringKeyDictionary.prototype.setValue = function (key, value, keepIndex) {
                    // TODO: This may be inefficient and could be improved.
                    var _ = this;
                    var exists = _.indexOfKey(key) != -1;
                    if (!exists && (value !== VOID0 || keepIndex))
                        _._order.push(key);
                    else if (exists && value === VOID0 && !keepIndex)
                        ArrayModule.remove(_._order, key);
                    return _super.prototype.setValue.call(this, key, value);
                };
                OrderedStringKeyDictionary.prototype.setByIndex = function (index, value) {
                    var _ = this;
                    var order = _._order;
                    if (index < 0)
                        throw new ArgumentOutOfRangeException("index", index, "Is less than zero.");
                    if (index >= order.length)
                        throw new ArgumentOutOfRangeException("index", index, "Is greater than the count.");
                    return _.setValue(order[index], value);
                };
                // importValues([x,y,z]);
                OrderedStringKeyDictionary.prototype.importValues = function (values) {
                    var _ = this;
                    return _.handleUpdate(function () {
                        var changed = false;
                        for (var i = 0; i < values.length; i++) {
                            if (_.setByIndex(i, values[i]))
                                changed = true;
                        }
                        return changed;
                    });
                };
                // setValues(x,y,z);
                OrderedStringKeyDictionary.prototype.setValues = function () {
                    var values = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        values[_i] = arguments[_i];
                    }
                    return this.importValues(values);
                };
                OrderedStringKeyDictionary.prototype.removeByIndex = function (index) {
                    return this.setByIndex(index, VOID0);
                };
                OrderedStringKeyDictionary.prototype.getKeys = function () {
                    var _ = this;
                    var o = _._order;
                    return o.length && o.filter(function (key) { return _.containsKey(key); }) || [];
                };
                return OrderedStringKeyDictionary;
            }(StringKeyDictionary));
            Dictionaries.OrderedStringKeyDictionary = OrderedStringKeyDictionary;
            var Dictionary = /** @class */ (function (_super) {
                __extends(Dictionary, _super);
                function Dictionary(_keyGenerator) {
                    var _this = _super.call(this) || this;
                    _this._keyGenerator = _keyGenerator;
                    _this._entries = linkedNodeList();
                    _this._buckets = {};
                    return _this;
                }
                Dictionary.prototype._onDispose = function () {
                    _super.prototype._onDispose.call(this);
                    var _ = this;
                    _._entries = null;
                    _._buckets = null;
                    _._hashGenerator = null;
                };
                Dictionary.prototype.getCount = function () {
                    return this._entries && this._entries.unsafeCount || 0;
                };
                Dictionary.prototype._getBucket = function (hash, createIfMissing) {
                    if (hash == null || !createIfMissing && !this.getCount())
                        return null;
                    if (!Type.isPrimitiveOrSymbol(hash))
                        console.warn("Key type not indexable and could cause Dictionary to be extremely slow.");
                    var buckets = this._buckets;
                    var bucket = buckets[hash];
                    if (createIfMissing && !bucket)
                        buckets[hash]
                            = bucket
                                = linkedNodeList();
                    return bucket || null;
                };
                Dictionary.prototype._getBucketEntry = function (key, hash, bucket) {
                    if (key == null || !this.getCount())
                        return null;
                    var _ = this, comparer = _._keyGenerator, compareKey = comparer ? comparer(key) : key;
                    if (!bucket)
                        bucket = _._getBucket(hash || getIdentifier(compareKey));
                    return bucket
                        && (comparer
                            ? bucket.find(function (e) { return comparer(e.key) === compareKey; })
                            : bucket.find(function (e) { return e.key === compareKey; }));
                };
                Dictionary.prototype._getEntry = function (key) {
                    var e = this._getBucketEntry(key);
                    return e && e.value;
                };
                Dictionary.prototype.getValue = function (key) {
                    var e = this._getEntry(key);
                    return e ? e.value : VOID0;
                };
                Dictionary.prototype._setValueInternal = function (key, value) {
                    var _ = this;
                    var buckets = _._buckets, entries = _._entries, compareKey = _._keyGenerator ? _._keyGenerator(key) : key, hash = getIdentifier(compareKey);
                    var bucket = _._getBucket(hash);
                    var bucketEntry = bucket && _._getBucketEntry(key, hash, bucket);
                    // Entry exits? Delete or update
                    if (bucketEntry) {
                        var b = bucket;
                        if (value === VOID0) {
                            var x = b.removeNode(bucketEntry), y = entries.removeNode(bucketEntry.value);
                            if (x && !b.count) {
                                delete buckets[hash];
                                linkedNodeList(b);
                                bucket = null;
                            }
                            if (x !== y)
                                throw "Entries and buckets are out of sync.";
                            if (x)
                                return true;
                        }
                        else {
                            // We don't expose the internal hash entries so replacing the value is ok.
                            var old = bucketEntry.value.value;
                            bucketEntry.value.value = value;
                            return !Compare.areEqual(value, old);
                        }
                    }
                    else if (value !== VOID0) {
                        if (!bucket)
                            bucket = _._getBucket(hash, true);
                        if (!bucket)
                            throw new Error("\"" + hash + "\" cannot be added to lookup table.");
                        var entry = new HashEntry(key, value);
                        entries.addNode(entry);
                        bucket.addNode(new HashEntry(key, entry));
                        return true;
                    }
                    return false;
                };
                Dictionary.prototype._clearInternal = function () {
                    var _ = this;
                    var buckets = _._buckets;
                    // Ensure reset and clean...
                    for (var key in buckets) {
                        if (buckets.hasOwnProperty(key)) {
                            var bucket = buckets[key];
                            delete buckets[key];
                            linkedNodeList(bucket);
                        }
                    }
                    return _._entries.clear();
                };
                /*
                 * Note: super.getEnumerator() works perfectly well,
                 * but enumerating the internal linked node list is much more efficient.
                 */
                Dictionary.prototype.getEnumerator = function () {
                    var _ = this;
                    _.throwIfDisposed();
                    var ver, currentEntry;
                    return new Enumeration.EnumeratorBase(function () {
                        _.throwIfDisposed();
                        ver = _._version;
                        currentEntry = _._entries.first;
                    }, function (yielder) {
                        if (currentEntry) {
                            _.throwIfDisposed();
                            _.assertVersion(ver);
                            var result = { key: currentEntry.key, value: currentEntry.value };
                            currentEntry = currentEntry.next || null;
                            return yielder.yieldReturn(result);
                        }
                        return yielder.yieldBreak();
                    });
                };
                Dictionary.prototype.getKeys = function () {
                    var _ = this;
                    var result = [];
                    var e = _._entries && _._entries.first;
                    while (e) {
                        result.push(e.key);
                        e = e.next;
                    }
                    return result;
                };
                Dictionary.prototype.getValues = function () {
                    var _ = this;
                    var result = [];
                    var e = _._entries && _._entries.first;
                    while (e) {
                        result.push(e.value);
                        e = e.next;
                    }
                    return result;
                };
                return Dictionary;
            }(DictionaryBase));
            Dictionaries.Dictionary = Dictionary;
        })(Dictionaries = Collections.Dictionaries || (Collections.Dictionaries = {}));
        var Sorting;
        (function (Sorting) {
            var Values = Compare;
            var SortContext = /** @class */ (function () {
                function SortContext(_next, _comparer, _order) {
                    if (_comparer === void 0) { _comparer = Values.compare; }
                    if (_order === void 0) { _order = 1 /* Ascending */; }
                    this._next = _next;
                    this._comparer = _comparer;
                    this._order = _order;
                }
                Object.defineProperty(SortContext.prototype, "order", {
                    /**
                     * Direction of the comparison.
                     * @type {Order}
                     */
                    get: function () { return this._order; },
                    enumerable: false,
                    configurable: true
                });
                /**
                 * Generates an array of indexes from the source in order of their expected internalSort without modifying the source.
                 * @param source
                 * @returns {number[]}
                 */
                SortContext.prototype.generateSortedIndexes = function (source) {
                    var _this = this;
                    if (source == null)
                        return [];
                    var result = source.map(function (s, i) { return i; });
                    result.sort(function (a, b) { return _this.compare(source[a], source[b]); });
                    return result;
                };
                /**
                 * Compares two values based upon SortContext parameters.
                 * @param a
                 * @param b
                 * @returns {any}
                 */
                SortContext.prototype.compare = function (a, b) {
                    var _ = this;
                    var d = _._comparer(a, b);
                    if (d == 0 && _._next)
                        return _._next.compare(a, b);
                    return _._order * d;
                };
                return SortContext;
            }());
            Sorting.SortContext = SortContext;
            var KeySortedContext = /** @class */ (function (_super) {
                __extends(KeySortedContext, _super);
                function KeySortedContext(next, _keySelector, order, comparer) {
                    if (order === void 0) { order = 1 /* Ascending */; }
                    if (comparer === void 0) { comparer = Values.compare; }
                    var _this = _super.call(this, next, comparer, order) || this;
                    _this._keySelector = _keySelector;
                    return _this;
                }
                KeySortedContext.prototype.compare = function (a, b) {
                    var _ = this;
                    var ks = _._keySelector;
                    if (!ks || ks === Functions.Identity)
                        return _super.prototype.compare.call(this, a, b);
                    // We force <any> here since it can be a Primitive or IComparable<any>
                    var d = Values.compare(ks(a), ks(b));
                    if (d === 0 && _._next)
                        return _._next.compare(a, b);
                    return _._order * d;
                };
                return KeySortedContext;
            }(SortContext));
            Sorting.KeySortedContext = KeySortedContext;
        })(Sorting = Collections.Sorting || (Collections.Sorting = {}));
    })(Collections = System.Collections || (System.Collections = {}));
    var Random;
    (function (Random) {
        var arrayShuffle = System.Collections.ArrayModule.shuffle;
        function r(maxExclusive) {
            return Math.floor(Math.random() * maxExclusive);
        }
        function nr(boundary, inclusive) {
            var a = Math.abs(boundary);
            if (a === 0 || a === 1 && !inclusive)
                return 0;
            if (inclusive)
                boundary += boundary / a;
            return r(boundary);
        }
        function arrayCopy(source) {
            var len = source.length;
            var result = Collections.ArrayModule.initialize(len);
            for (var i = 0; i < len; i++) {
                result[i] = source[i];
            }
            return result;
        }
        /**
         * Returns a random integer from 0 to the maxExclusive.
         * Negative numbers are allowed.
         *
         * @param maxExclusive
         * @returns {number}
         */
        function integer(min, max) {
            if (max === void 0) { max = null; }
            if (max == null) {
                max = min;
                min = 0;
            }
            min = Math.ceil(min);
            max = Math.floor(max);
            return next(max - min) + min;
        }
        Random.integer = integer;
        /**
         * Returns a random integer from 0 to the boundary.
         * Return value will be less than the boundary unless inclusive is set to true.
         * Negative numbers are allowed.
         *
         * @param boundary
         * @param inclusive
         * @returns {number}
         */
        function next(boundary, inclusive) {
            Integer.assert(boundary, 'boundary');
            return nr(boundary, inclusive);
        }
        Random.next = next;
        (function (next) {
            function integer(boundary, inclusive) {
                return Random.next(boundary, inclusive);
            }
            next.integer = integer;
            function float(boundary) {
                if (boundary === void 0) { boundary = Number.MAX_VALUE; }
                if (isNaN(boundary))
                    throw "'boundary' is not a number.";
                return Math.random() * boundary;
            }
            next.float = float;
            function inRange(min, max, inclusive) {
                Integer.assert(min, 'min');
                Integer.assert(max, 'max');
                var range = max - min;
                if (range === 0)
                    return min;
                if (inclusive)
                    range += range / Math.abs(range);
                return min + r(range);
            }
            next.inRange = inRange;
        })(next = Random.next || (Random.next = {}));
        /**
         * Returns an array of random integers.
         * @param count
         * @param boundary
         * @param inclusive
         * @returns {number[]}
         */
        function integers(count, boundary, inclusive) {
            Integer.assert(count);
            var s = [];
            s.length = count;
            for (var i = 0; i < count; i++) {
                s[i] = nr(boundary, inclusive);
            }
            return s;
        }
        Random.integers = integers;
        /**
         * Shuffles an array.
         * @param target
         * @returns {T}
         */
        function shuffle(target) {
            return Collections.ArrayModule.shuffle(target);
        }
        Random.shuffle = shuffle;
        /**
         * Creates a copy of an array-like  and returns it shuffled.
         * @param source
         * @returns {T[]}
         */
        function copy(source) {
            return Collections.ArrayModule.shuffle(arrayCopy(source));
        }
        Random.copy = copy;
        /**
         * Returns a distinct random set from the source array up to the maxCount or the full length of the array.
         * @param source
         * @param maxCount
         * @returns {any}
         */
        function select(source, maxCount) {
            if (maxCount !== Infinity)
                Integer.assertZeroOrGreater(maxCount);
            switch (maxCount) {
                case 0:
                    return [];
                case 1:
                    return [select.one(source, true)];
                default:
                    var result = arrayShuffle(arrayCopy(source));
                    if (maxCount < result.length)
                        result.length = maxCount;
                    return result;
            }
        }
        Random.select = select;
        (function (select) {
            function one(source, throwIfEmpty) {
                if (source && source.length)
                    return source[r(source.length)];
                if (throwIfEmpty)
                    throw "Cannot select from an empty set.";
            }
            select.one = one;
        })(select = Random.select || (Random.select = {}));
    })(Random = System.Random || (System.Random = {}));
    var ResolverBase = /** @class */ (function (_super) {
        __extends(ResolverBase, _super);
        function ResolverBase(_valueFactory, _trapExceptions, _allowReset) {
            if (_allowReset === void 0) { _allowReset = false; }
            var _this = _super.call(this) || this;
            _this._valueFactory = _valueFactory;
            _this._trapExceptions = _trapExceptions;
            _this._allowReset = _allowReset;
            _this._disposableObjectName = "ResolverBase";
            if (!_valueFactory)
                throw new Exceptions.ArgumentNullException("valueFactory");
            _this._isValueCreated = false;
            return _this;
        }
        ResolverBase.prototype.getError = function () {
            return this._error;
        };
        Object.defineProperty(ResolverBase.prototype, "error", {
            get: function () {
                return this.getError();
            },
            enumerable: false,
            configurable: true
        });
        ResolverBase.prototype.getValue = function () {
            var _ = this;
            _.throwIfDisposed();
            if (_._isValueCreated === null)
                throw new Error("Recursion detected.");
            if (!_._isValueCreated && _._valueFactory) {
                _._isValueCreated = null; // Mark this as 'resolving'.
                try {
                    var c = void 0;
                    if (!_._isValueCreated && (c = _._valueFactory)) {
                        _._isValueCreated = null; // Mark this as 'resolving'.
                        if (!this._allowReset)
                            this._valueFactory = NULL;
                        var v = c();
                        _._value = v;
                        _._error = void 0;
                        return v;
                    }
                }
                catch (ex) {
                    _._error = ex;
                    if (!_._trapExceptions)
                        throw ex;
                }
                finally {
                    _._isValueCreated = true;
                }
            }
            return _._value;
        };
        Object.defineProperty(ResolverBase.prototype, "canReset", {
            get: function () {
                return this._allowReset && !!this._valueFactory;
            },
            enumerable: false,
            configurable: true
        });
        ResolverBase.prototype._onDispose = function () {
            this._valueFactory = NULL;
            this._value = NULL;
            this._isValueCreated = NULL;
        };
        ResolverBase.prototype.tryReset = function () {
            var _ = this;
            if (!_._valueFactory)
                return false;
            else {
                _._isValueCreated = false;
                _._value = NULL;
                _._error = void 0;
                return true;
            }
        };
        return ResolverBase;
    }(Disposable.DisposableBase));
    System.ResolverBase = ResolverBase;
    var Lazy = /** @class */ (function (_super) {
        __extends(Lazy, _super);
        function Lazy(valueFactory, trapExceptions, allowReset) {
            if (trapExceptions === void 0) { trapExceptions = false; }
            if (allowReset === void 0) { allowReset = false; }
            var _this = _super.call(this, valueFactory, trapExceptions, allowReset) || this;
            _this._disposableObjectName = "Lazy";
            _this._isValueCreated = false;
            return _this;
        }
        Object.defineProperty(Lazy.prototype, "isValueCreated", {
            get: function () {
                return !!this._isValueCreated;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Lazy.prototype, "value", {
            get: function () {
                return this.getValue();
            },
            enumerable: false,
            configurable: true
        });
        Lazy.prototype.equals = function (other) {
            return this === other;
        };
        Lazy.prototype.valueEquals = function (other) {
            return this.equals(other) || this.value === other.value;
        };
        Lazy.create = function (valueFactory, trapExceptions, allowReset) {
            if (trapExceptions === void 0) { trapExceptions = false; }
            if (allowReset === void 0) { allowReset = false; }
            return new Lazy(valueFactory, trapExceptions, allowReset);
        };
        return Lazy;
    }(ResolverBase));
    System.Lazy = Lazy;
    var ResettableLazy = /** @class */ (function (_super) {
        __extends(ResettableLazy, _super);
        function ResettableLazy(valueFactory, trapExceptions) {
            if (trapExceptions === void 0) { trapExceptions = false; }
            var _this = _super.call(this, valueFactory, trapExceptions, true) || this;
            _this._disposableObjectName = "ResettableLazy";
            return _this;
        }
        ResettableLazy.create = function (valueFactory, trapExceptions) {
            if (trapExceptions === void 0) { trapExceptions = false; }
            return new ResettableLazy(valueFactory, trapExceptions);
        };
        return ResettableLazy;
    }(Lazy));
    System.ResettableLazy = ResettableLazy;
    (function (Threading) {
        var isNodeJS = false;
        var requestTick;
        var flushing = false;
        var entryPool = new Disposable.ObjectPool(40, function () { return null; }, function (o) {
            o.task = null;
            o.domain = null;
            o.context = null;
            if (o.args)
                o.args.length = 0;
            o.args = null;
            o.canceller = null;
        });
        function runSingle(task, domain, context, params) {
            try {
                task.apply(context, params);
            }
            catch (e) {
                if (isNodeJS) {
                    // In node, uncaught exceptions are considered fatal errors.
                    // Re-throw them synchronously to interrupt flushing!
                    // Ensure continuation if the uncaught exception is suppressed
                    // listening "uncaughtException" events (as domains does).
                    // Continue in next event to avoid tick recursion.
                    if (domain) {
                        domain.exit();
                    }
                    setTimeout(flush, 0);
                    if (domain) {
                        domain.enter();
                    }
                    throw e;
                }
                else {
                    // In browsers, uncaught exceptions are not fatal.
                    // Re-throw them asynchronously to avoid slow-downs.
                    setTimeout(function () {
                        throw e;
                    }, 0);
                }
            }
            if (domain) {
                domain.exit();
            }
        }
        function requestFlush() {
            if (!flushing) {
                flushing = true;
                requestTick();
            }
        }
        function deferImmediate(task, context, args) {
            var entry = entryPool.take();
            entry.task = task;
            entry.domain = (isNodeJS && process["domain"]);
            entry.context = context;
            entry.args = args && args.slice();
            entry.canceller = function () {
                if (!entry)
                    return false;
                var r = Boolean(immediateQueue.removeNode(entry));
                entryPool.add(entry);
                return r;
            };
            immediateQueue.addNode(entry);
            requestFlush();
            return {
                cancel: entry.canceller,
                dispose: function () { entry && entry.canceller(); }
            };
        }
        Threading.deferImmediate = deferImmediate;
        // runs a task after all other tasks have been run
        // this is useful for unhandled rejection tracking that needs to happen
        // after all `then`d tasks have been run.
        function runAfterDeferred(task) {
            laterQueue.enqueue(task);
            requestFlush();
        }
        Threading.runAfterDeferred = runAfterDeferred;
        if (isNodeJS) {
            requestTick = function () {
                process.nextTick(flush);
            };
        }
        else if (typeof setImmediate === Type.FUNCTION) {
            // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
            if (typeof window !== Type.UNDEFINED) {
                requestTick = setImmediate.bind(window, flush);
            }
            else {
                requestTick = function () {
                    setImmediate(flush);
                };
            }
        }
        else if (typeof MessageChannel !== Type.UNDEFINED) {
            // modern browsers
            // http://www.nonblocking.io/2011/06/windownexttick.html
            var channel_1 = new MessageChannel();
            // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
            // working message ports the first time a page loads.
            channel_1.port1.onmessage = function () {
                requestTick = requestPortTick_1;
                channel_1.port1.onmessage = flush;
                flush();
            };
            var requestPortTick_1 = function () {
                // Opera requires us to provide a message payload, regardless of
                // whether we use it.
                channel_1.port2.postMessage(0);
            };
            requestTick = function () {
                setTimeout(flush, 0);
                requestPortTick_1();
            };
        }
        else {
            // old browsers
            requestTick = function () {
                setTimeout(flush, 0);
            };
        }
        function flush() {
            /* jshint loopfunc: true */
            var entry;
            while (entry = immediateQueue.first) {
                var task = entry.task, domain = entry.domain, context = entry.context, args = entry.args;
                entry.canceller();
                if (domain)
                    domain.enter();
                runSingle(task, domain, context, args);
            }
            while (laterQueue.tryDequeue(function (task) {
                runSingle(task);
            })) { }
            flushing = false;
        }
        var immediateQueue = new Collections.LinkedNodeList();
        var laterQueue = new Collections.Queue();
        var DeferBase = /** @class */ (function () {
            function DeferBase() {
            }
            DeferBase.prototype.dispose = function () {
                this.cancel();
            };
            return DeferBase;
        }());
        var Defer = /** @class */ (function (_super) {
            __extends(Defer, _super);
            function Defer(task, delay, payload) {
                if (delay === void 0) { delay = 0; }
                var _this = _super.call(this) || this;
                if (!(delay > 0))
                    delay = 0; // covers undefined and null.
                _this._id = setTimeout(Defer.handler, delay, task, _this, payload);
                return _this;
            }
            Defer.prototype.cancel = function () {
                var id = this._id;
                if (id) {
                    clearTimeout(id);
                    this._id = null;
                    return true;
                }
                return false;
            };
            // Use a static function here to avoid recreating a new function every time.
            Defer.handler = function (task, d, payload) {
                d.cancel();
                task(payload);
            };
            return Defer;
        }(DeferBase));
        var DeferInterval = /** @class */ (function (_super) {
            __extends(DeferInterval, _super);
            function DeferInterval(task, interval, _remaining) {
                if (_remaining === void 0) { _remaining = Infinity; }
                var _this = _super.call(this) || this;
                _this._remaining = _remaining;
                if (interval == null)
                    throw "'interval' must be a valid number.";
                if (interval < 0)
                    throw "'interval' cannot be negative.";
                _this._id = setInterval(DeferInterval.handler, interval, task, _this);
                return _this;
            }
            DeferInterval.prototype.cancel = function () {
                var id = this._id;
                if (id) {
                    clearInterval(id);
                    this._id = null;
                    return true;
                }
                return false;
            };
            DeferInterval.handler = function (task, d) {
                if (!(--d._remaining))
                    d.cancel();
                task();
            };
            return DeferInterval;
        }(DeferBase));
        function defer(task, delay, payload) {
            return new Defer(task, delay, payload);
        }
        Threading.defer = defer;
        function interval(task, interval, count) {
            if (count === void 0) { count = Infinity; }
            return new DeferInterval(task, interval, count);
        }
        Threading.interval = interval;
        Threading.Worker = self.Worker;
    })(Threading = System.Threading || (System.Threading = {}));
    var Uri;
    (function (Uri_1) {
        var UriHostNameType;
        (function (UriHostNameType) {
            UriHostNameType[UriHostNameType["Basic"] = 0] = "Basic";
            UriHostNameType[UriHostNameType["DNS"] = 1] = "DNS";
            UriHostNameType[UriHostNameType["IPv4"] = 2] = "IPv4";
            UriHostNameType[UriHostNameType["IPv6"] = 3] = "IPv6";
            UriHostNameType[UriHostNameType["Unknown"] = 4] = "Unknown";
        })(UriHostNameType = Uri_1.UriHostNameType || (Uri_1.UriHostNameType = {}));
        Object.freeze(UriHostNameType);
        var Scheme;
        (function (Scheme) {
            Scheme.File = "file";
            Scheme.FTP = "ftp";
            Scheme.GOPHER = "gopher";
            Scheme.HTTP = "http";
            Scheme.HTTPS = "https";
            Scheme.LDAP = "ldap";
            Scheme.MAILTO = "mailto";
            Scheme.PIPE = "net.pipe";
            Scheme.TCP = "net.tcp";
            Scheme.NEWS = "news";
            Scheme.NNTP = "nntp";
            Scheme.TELNET = "telnet";
            Scheme.UUID = "uuid";
            Scheme.All = Object.freeze([
                Scheme.File, Scheme.FTP, Scheme.GOPHER, Scheme.HTTP, Scheme.HTTPS, Scheme.LDAP, Scheme.MAILTO, Scheme.PIPE, Scheme.TCP, Scheme.NEWS, Scheme.NNTP, Scheme.TELNET, Scheme.UUID
            ]);
            function isValid(scheme) {
                return Scheme.All.indexOf(scheme) !== -1;
            }
            Scheme.isValid = isValid;
        })(Scheme = Uri_1.Scheme || (Uri_1.Scheme = {}));
        var QUERY_SEPARATOR = "?", ENTRY_SEPARATOR = "&", KEY_VALUE_SEPARATOR = "=", TO_URI_COMPONENT = "toUriComponent";
        Object.freeze(Scheme);
        var Separator;
        (function (Separator) {
            Separator.Query = QUERY_SEPARATOR;
            Separator.Entry = ENTRY_SEPARATOR;
            Separator.KeyValue = KEY_VALUE_SEPARATOR;
        })(Separator = Uri_1.Separator || (Uri_1.Separator = {}));
        var Uri = /** @class */ (function () {
            function Uri(scheme, userInfo, host, port, path, query, fragment) {
                var _ = this;
                this.scheme = getScheme(scheme) || null;
                this.userInfo = userInfo || null;
                this.host = host || null;
                this.port = getPort(port);
                this.authority = _.getAuthority() || null;
                this.path = path || null;
                if (!Type.isString(query))
                    query = encode(query);
                this.query = formatQuery(query) || null;
                Object.freeze(this.queryParams = _.query
                    ? parseToMap(_.query)
                    : {});
                this.pathAndQuery = _.getPathAndQuery() || null;
                this.fragment = formatFragment(fragment) || null;
                // This should validate the uri...
                this.absoluteUri = _.getAbsoluteUri();
                this.baseUri = _.absoluteUri.replace(/[?#].*/, "");
                // Intended to be read-only.  Call .toMap() to get a writable copy.
                Object.freeze(this);
            }
            /**
             *  Compares the values of another IUri via toString comparison.
             * @param other
             * @returns {boolean}
             */
            Uri.prototype.equals = function (other) {
                return this === other || this.absoluteUri == Uri.toString(other);
            };
            /**
             * Parses or clones values from existing Uri values.
             * @param uri
             * @param defaults
             * @returns {Uri}
             */
            Uri.from = function (uri, defaults) {
                var u = Type.isString(uri)
                    ? Uri
                        .parse(uri)
                    // Parsing a string should throw errors.  Null or undefined simply means empty.
                    : uri;
                return new Uri(u && u.scheme || defaults && defaults.scheme, u && u.userInfo || defaults && defaults.userInfo, u && u.host || defaults && defaults.host, u && Type.isNumber(u.port, true) ? u.port : defaults && defaults.port, u && u.path || defaults && defaults.path, u && u.query || defaults && defaults.query, u && u.fragment || defaults && defaults.fragment);
            };
            Uri.parse = function (url, throwIfInvalid) {
                if (throwIfInvalid === void 0) { throwIfInvalid = true; }
                var result = null;
                var ex = tryParse(url, function (out) { result = out; });
                if (throwIfInvalid && ex)
                    throw ex;
                return result;
            };
            /**
             * Parses a URL into it's components.
             * @param url The url to parse.
             * @param out A delegate to capture the value.
             * @returns {boolean} True if valid.  False if invalid.
             */
            Uri.tryParse = function (url, out) {
                return !tryParse(url, out); // return type is Exception.
            };
            Uri.copyOf = function (map) {
                return copyUri(map);
            };
            Uri.prototype.copyTo = function (map) {
                return copyUri(this, map);
            };
            Uri.prototype.updateQuery = function (query) {
                var map = this.toMap();
                map.query = query;
                return Uri.from(map);
            };
            /**
             * Is provided for sub classes to override this value.
             */
            Uri.prototype.getAbsoluteUri = function () {
                return uriToString(this);
            };
            /**
             * Is provided for sub classes to override this value.
             */
            Uri.prototype.getAuthority = function () {
                return getAuthority(this);
            };
            /**
             * Is provided for sub classes to override this value.
             */
            Uri.prototype.getPathAndQuery = function () {
                return getPathAndQuery(this);
            };
            Object.defineProperty(Uri.prototype, "pathSegments", {
                /**
                 * The segments that represent a path.<br/>
                 * https://msdn.microsoft.com/en-us/library/system.uri.segments%28v=vs.110%29.aspx
                 *
                 * <h5><b>Example:</b></h5>
                 * If the path value equals: ```/tree/node/index.html```<br/>
                 * The result will be: ```['/','tree/','node/','index.html']```
                 * @returns {string[]}
                 */
                get: function () {
                    return this.path && this.path.match(/^[/]|[^/]*[/]|[^/]+$/g) || [];
                },
                enumerable: false,
                configurable: true
            });
            /**
             * Creates a writable copy.
             * @returns {IUri}
             */
            Uri.prototype.toMap = function () {
                return this.copyTo({});
            };
            /**
             * @returns {string} The full absolute uri.
             */
            Uri.prototype.toString = function () {
                return this.absoluteUri;
            };
            /**
             * Properly converts an existing URI to a string.
             * @param uri
             * @returns {string}
             */
            Uri.toString = function (uri) {
                return uri instanceof Uri
                    ? uri.absoluteUri
                    : uriToString(uri);
            };
            /**
             * Returns the authority segment of an URI.
             * @param uri
             * @returns {string}
             */
            Uri.getAuthority = function (uri) {
                return getAuthority(uri);
            };
            return Uri;
        }());
        Uri_1.Uri = Uri;
        var Fields;
        (function (Fields) {
            Fields[Fields["scheme"] = 0] = "scheme";
            Fields[Fields["userInfo"] = 1] = "userInfo";
            Fields[Fields["host"] = 2] = "host";
            Fields[Fields["port"] = 3] = "port";
            Fields[Fields["path"] = 4] = "path";
            Fields[Fields["query"] = 5] = "query";
            Fields[Fields["fragment"] = 6] = "fragment";
        })(Fields = Uri_1.Fields || (Uri_1.Fields = {}));
        Object.freeze(Fields);
        function copyUri(from, to) {
            var i = 0, field;
            if (!to)
                to = {};
            while (field = Fields[i++]) {
                var value = from[field];
                if (value)
                    to[field] = value;
            }
            return to;
        }
        var SLASH = "/", SLASH2 = "//", QM = Separator.Query, HASH = "#", EMPTY = "", AT = "@";
        function getScheme(scheme) {
            var s = scheme;
            if (Type.isString(s)) {
                if (!s)
                    return null;
                s = trim(s)
                    .toLowerCase()
                    .replace(/[^a-z0-9+.-]+$/g, EMPTY);
                if (!s)
                    return null;
                if (Scheme.isValid(s))
                    return s;
            }
            else {
                if (s == null)
                    return s;
            }
            throw new Exceptions.ArgumentOutOfRangeException("scheme", scheme, "Invalid scheme.");
        }
        function getPort(port) {
            if (port === 0)
                return port;
            if (!port)
                return null;
            var p;
            if (Type.isNumber(port)) {
                p = port;
                if (p >= 0 && isFinite(p))
                    return p;
            }
            else if (Type.isString(port) && (p = parseInt(port)) && !isNaN(p)) {
                return getPort(p);
            }
            throw new Exceptions.ArgumentException("port", "invalid value");
        }
        function getAuthority(uri) {
            if (!uri.host) {
                if (uri.userInfo)
                    throw new Exceptions.ArgumentException("host", "Cannot include user info when there is no host.");
                if (Type.isNumber(uri.port, true))
                    throw new Exceptions.ArgumentException("host", "Cannot include a port when there is no host.");
            }
            /*
             * [//[user:password@]host[:port]]
             */
            var result = uri.host || EMPTY;
            if (result) {
                if (uri.userInfo)
                    result = uri.userInfo + AT + result;
                if (!isNaN((uri.port)))
                    result += ":" + uri.port;
                result = SLASH2 + result;
            }
            return result;
        }
        function formatQuery(query) {
            return query && ((query.indexOf(QM) !== 0 ? QM : EMPTY) + query);
        }
        function formatFragment(fragment) {
            return fragment && ((fragment.indexOf(HASH) !== 0 ? HASH : EMPTY) + fragment);
        }
        function getPathAndQuery(uri) {
            var path = uri.path, query = uri.query;
            return EMPTY + (path || EMPTY) + (formatQuery(query) || EMPTY);
        }
        function uriToString(uri) {
            // scheme:[//[user:password@]domain[:port]][/]path[?query][#fragment]
            // {scheme}{authority}{path}{query}{fragment}
            var scheme = getScheme(uri.scheme);
            var authority = getAuthority(uri);
            var pathAndQuery = getPathAndQuery(uri), fragment = formatFragment(uri.fragment);
            var part1 = EMPTY + ((scheme && (scheme + ":")) || EMPTY) + (authority || EMPTY);
            var part2 = EMPTY + (pathAndQuery || EMPTY) + (fragment || EMPTY);
            if (part1 && part2 && scheme && !authority)
                throw new Exceptions
                    .ArgumentException("authority", "Cannot format schemed Uri with missing authority.");
            if (part1 && pathAndQuery && pathAndQuery.indexOf(SLASH) !== 0)
                part2 = SLASH + part2;
            return part1 + part2;
        }
        function tryParse(url, out) {
            if (!url)
                return new Exceptions.ArgumentException("url", "Nothing to parse.");
            // Could use a regex here, but well follow some rules instead.
            // The intention is to 'gather' the pieces.  This isn't validation (yet).
            // scheme:[//[user:password@]domain[:port]][/]path[?query][#fragment]
            var i;
            var result = {};
            // Anything after the first # is the fragment.
            i = url.indexOf(HASH);
            if (i != -1) {
                result.fragment = url.substring(i + 1) || VOID0;
                url = url.substring(0, i);
            }
            // Anything after the first ? is the query.
            i = url.indexOf(QM);
            if (i != -1) {
                result.query = url.substring(i + 1) || VOID0;
                url = url.substring(0, i);
            }
            // Guarantees a separation.
            i = url.indexOf(SLASH2);
            if (i != -1) {
                var scheme = trim(url.substring(0, i));
                var c = /:$/;
                if (!c.test(scheme))
                    return new Exceptions.ArgumentException("url", "Scheme was improperly formatted");
                scheme = trim(scheme.replace(c, EMPTY));
                try {
                    result.scheme = getScheme(scheme) || VOID0;
                }
                catch (ex) {
                    return ex;
                }
                url = url.substring(i + 2);
            }
            // Find any path information.
            i = url.indexOf(SLASH);
            if (i != -1) {
                result.path = url.substring(i);
                url = url.substring(0, i);
            }
            // Separate user info.
            i = url.indexOf(AT);
            if (i != -1) {
                result.userInfo = url.substring(0, i) || VOID0;
                url = url.substring(i + 1);
            }
            // Remaining is host and port.
            i = url.indexOf(":");
            if (i != -1) {
                var port = parseInt(trim(url.substring(i + 1)));
                if (isNaN(port))
                    return new Exceptions.ArgumentException("url", "Port was invalid.");
                result.port = port;
                url = url.substring(0, i);
            }
            url = trim(url);
            if (url)
                result.host = url;
            out(copyUri(result));
            // null is good! (here)
            return null;
        }
        var QueryBuilder = /** @class */ (function (_super) {
            __extends(QueryBuilder, _super);
            function QueryBuilder(query, decodeValues) {
                if (decodeValues === void 0) { decodeValues = true; }
                var _this = _super.call(this) || this;
                _this.importQuery(query, decodeValues);
                return _this;
            }
            QueryBuilder.init = function (query, decodeValues) {
                if (decodeValues === void 0) { decodeValues = true; }
                return new QueryBuilder(query, decodeValues);
            };
            QueryBuilder.prototype.importQuery = function (query, decodeValues) {
                if (decodeValues === void 0) { decodeValues = true; }
                if (Type.isString(query)) {
                    this.importFromString(query, decodeValues);
                }
                else if (Collections.Enumeration.isEnumerableOrArrayLike(query)) {
                    this.importEntries(query);
                }
                else {
                    this.importMap(query);
                }
                return this;
            };
            /**
             * Property parses the components of an URI into their values or array of values.
             * @param values
             * @param deserialize
             * @param decodeValues
             * @returns {QueryBuilder}
             */
            QueryBuilder.prototype.importFromString = function (values, deserialize, decodeValues) {
                if (deserialize === void 0) { deserialize = true; }
                if (decodeValues === void 0) { decodeValues = true; }
                var _ = this;
                parse(values, function (key, value) {
                    if (_.containsKey(key)) {
                        var prev = _.getValue(key);
                        if ((prev) instanceof (Array))
                            prev.push(value);
                        else
                            _.setValue(key, [prev, value]);
                    }
                    else
                        _.setValue(key, value);
                }, deserialize, decodeValues);
                return this;
            };
            /**
             * Returns the encoded URI string
             */
            QueryBuilder.prototype.encode = function (prefixIfNotEmpty) {
                return encode(this, prefixIfNotEmpty);
            };
            QueryBuilder.prototype.toString = function () {
                return this.encode();
            };
            return QueryBuilder;
        }(Collections.Dictionaries
            .OrderedStringKeyDictionary));
        Uri_1.QueryBuilder = QueryBuilder;
        function encode(values, prefixIfNotEmpty) {
            if (!values)
                return EMPTY;
            var entries = [];
            if (Collections.Enumeration.isEnumerableOrArrayLike(values)) {
                Collections.ArrayModule.forEach(values, function (entry) {
                    return KeyValueExtractModule.extractKeyValue(entry, function (key, value) { return appendKeyValue(entries, key, value); });
                });
            }
            else {
                Object.keys(values).forEach(function (key) { return appendKeyValue(entries, key, values[key]); });
            }
            return (entries.length && prefixIfNotEmpty ? QUERY_SEPARATOR : EMPTY) + entries.join(ENTRY_SEPARATOR);
        }
        Uri_1.encode = encode;
        function appendKeyValueSingle(entries, key, value) {
            entries.push(key + KEY_VALUE_SEPARATOR + encodeValue(value));
        }
        // According to spec, if there is an array of values with the same key, then each value is replicated with that key.
        function appendKeyValue(entries, key, value) {
            if (Collections.Enumeration.isEnumerableOrArrayLike(value)) {
                Collections.ArrayModule.forEach(value, function (v) { return appendKeyValueSingle(entries, key, v); });
            }
            else {
                appendKeyValueSingle(entries, key, value);
            }
        }
        /**
         * Converts any primitive, serializable or uri-component object to an encoded string.
         * @param value
         * @returns {string}
         */
        function encodeValue(value) {
            if (isUriComponentFormattable(value)) {
                var v = value.toUriComponent();
                if (v && v.indexOf(ENTRY_SEPARATOR) != 1)
                    throw ".toUriComponent() did not encode the value.";
                return v;
            }
            else {
                return encodeURIComponent(Serialization.toString(value));
            }
        }
        Uri_1.encodeValue = encodeValue;
        /**
         * A shortcut for identifying an UriComponent.Formattable object.
         * @param instance
         * @returns {boolean}
         */
        function isUriComponentFormattable(instance) {
            return Type.hasMemberOfType(instance, TO_URI_COMPONENT, Type.FUNCTION);
        }
        Uri_1.isUriComponentFormattable = isUriComponentFormattable;
        /**
         * Parses a string for valid query param entries and pipes them through a handler.
         * @param query
         * @param entryHandler
         * @param deserialize Default is true.
         * @param decodeValues Default is true.
         */
        function parse(query, entryHandler, deserialize, decodeValues) {
            if (deserialize === void 0) { deserialize = true; }
            if (decodeValues === void 0) { decodeValues = true; }
            if (query && (query = query.replace(/^\s*\?+/, ""))) {
                var entries = query.split(ENTRY_SEPARATOR);
                for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                    var entry = entries_1[_i];
                    /*
                     * Since it is technically possible to have multiple '=' we need to identify the first one.
                     * And if there is no '=' then the entry is ignored.
                     */
                    var si = entry.indexOf(KEY_VALUE_SEPARATOR);
                    if (si != -1) {
                        var key = entry.substring(0, si);
                        var value = entry.substring(si + 1);
                        if (decodeValues)
                            value = decodeURIComponent(value);
                        if (deserialize)
                            value = Serialization.toPrimitive(value);
                        entryHandler(key, value);
                    }
                }
            }
        }
        Uri_1.parse = parse;
        /**
         * Parses a string for valid query params and returns a key-value map of the entries.
         * @param query
         * @param deserialize Default is true.
         * @param decodeValues Default is true.
         * @returns {IMap<Primitive>}
         */
        function parseToMap(query, deserialize, decodeValues) {
            if (deserialize === void 0) { deserialize = true; }
            if (decodeValues === void 0) { decodeValues = true; }
            var result = {};
            parse(query, function (key, value) {
                if ((key) in (result)) {
                    var prev = result[key];
                    if (!((prev) instanceof (Array)))
                        result[key] = prev = [prev];
                    prev.push(value);
                }
                else
                    result[key] = value;
            }, deserialize, decodeValues);
            return result;
        }
        Uri_1.parseToMap = parseToMap;
        /**
         * Parses a string for valid query params and returns a key-value pair array of the entries.
         * @param query
         * @param deserialize Default is true.
         * @param decodeValues Default is true.
         * @returns {IKeyValuePair<string, Primitive>[]}
         */
        function parseToArray(query, deserialize, decodeValues) {
            if (deserialize === void 0) { deserialize = true; }
            if (decodeValues === void 0) { decodeValues = true; }
            var result = [];
            parse(query, function (key, value) { result.push({ key: key, value: value }); }, deserialize, decodeValues);
            return result;
        }
        Uri_1.parseToArray = parseToArray;
    })(Uri = System.Uri || (System.Uri = {}));
    var Serialization;
    (function (Serialization) {
        var InvalidOperationException = Exceptions.InvalidOperationException;
        var EMPTY = "", TRUE = "true", FALSE = "false";
        function toString(value, defaultForUnknown) {
            var v = value;
            switch (typeof v) {
                case Type.STRING:
                    return v;
                case Type.BOOLEAN:
                    return v ? TRUE : FALSE;
                case Type.NUMBER:
                    return EMPTY + v;
                default:
                    if (v == null)
                        return v;
                    if (isSerializable(v))
                        return v.serialize();
                    else if (defaultForUnknown)
                        return defaultForUnknown;
                    var ex = new InvalidOperationException("Attempting to serialize unidentifiable type.");
                    ex.data["value"] = v;
                    throw ex;
            }
        }
        Serialization.toString = toString;
        function isSerializable(instance) {
            return Type.hasMemberOfType(instance, "serialize", Type.FUNCTION);
        }
        Serialization.isSerializable = isSerializable;
        function toPrimitive(value, caseInsensitive, unknownHandler) {
            if (value) {
                if (caseInsensitive)
                    value = value.toLowerCase();
                switch (value) {
                    case "null":
                        return null;
                    case Type.UNDEFINED:
                        return void (0);
                    case TRUE:
                        return true;
                    case FALSE:
                        return false;
                    default:
                        var cleaned = value.replace(/^\s+|,|\s+$/g, EMPTY);
                        if (cleaned) {
                            if (/^\d+$/g.test(cleaned)) {
                                var int = parseInt(cleaned);
                                if (!isNaN(int))
                                    return int;
                            }
                            else {
                                var number = parseFloat(value);
                                if (!isNaN(number))
                                    return number;
                            }
                        }
                        // Handle Dates...  Possibly JSON?
                        // Instead of throwing we allow for handling...
                        if (unknownHandler)
                            value = unknownHandler(value);
                        break;
                }
            }
            return value;
        }
        Serialization.toPrimitive = toPrimitive;
    })(Serialization = System.Serialization || (System.Serialization = {}));
    var Text;
    (function (Text) {
        var EMPTY = "";
        var _I = "i", _G = "g", _M = "m", _U = "u", _W = "w", _Y = "y";
        var RegexOptions;
        (function (RegexOptions) {
            /**
             * Specifies case-insensitive matching. For more information, see the "Case-Insensitive Matching " section in the Regular Expression Options topic.
             */
            RegexOptions.IGNORE_CASE = _I;
            RegexOptions.I = _I;
            /**
             * Specifies global matching instead of single.
             */
            RegexOptions.GLOBAL = _G;
            RegexOptions.G = _G;
            /**
             * treat beginning and end characters (^ and $) as working over multiple lines (i.e., match the beginning or end of each line (delimited by \n or \r), not only the very beginning or end of the whole input string)
             */
            RegexOptions.MULTI_LINE = _M;
            RegexOptions.M = _M;
            /**
             * treat pattern as a sequence of unicode code points
             */
            RegexOptions.UNICODE = _U;
            RegexOptions.U = _U;
            /**
             * matches only from the index indicated by the lastIndex property of this regular expression in the target string (and does not attempt to match from any later indexes).
             */
            RegexOptions.STICKY = _Y;
            RegexOptions.Y = _Y;
            /**
             * Modifies the pattern to ignore standard whitespace characters.
             */
            RegexOptions.IGNORE_PATTERN_WHITESPACE = _W;
            RegexOptions.W = _W;
        })(RegexOptions = Text.RegexOptions || (Text.RegexOptions = {}));
        var Regex = /** @class */ (function () {
            function Regex(pattern, options) {
                var extra = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    extra[_i - 2] = arguments[_i];
                }
                if (!pattern)
                    throw new Error("'pattern' cannot be null or empty.");
                var patternString, flags = (options && ((options) instanceof (Array) ? options : [options]).concat(extra) ||
                    extra)
                    .join(EMPTY)
                    .toLowerCase();
                if (pattern instanceof RegExp) {
                    var p = pattern;
                    if (p.ignoreCase && flags.indexOf(_I) === -1)
                        flags += _I;
                    if (p.multiline && flags.indexOf(_M) === -1)
                        flags += _M;
                    patternString = p.source;
                }
                else {
                    patternString = pattern;
                }
                var ignoreWhiteSpace = flags.indexOf(_W) != -1;
                // For the majority of expected behavior, we need to eliminate global and whitespace ignore.
                flags = flags.replace(/[gw]/g, EMPTY);
                // find the keys inside the pattern, and place in mapping array {0:'key1', 1:'key2', ...}
                var keys = [];
                {
                    var k = patternString.match(/(?!\(\?<)(\w+)(?=>)/g);
                    if (k) {
                        for (var i = 0, len = k.length; i < len; i++) {
                            keys[i + 1] = k[i];
                        }
                        // remove keys from regexp leaving standard regexp
                        patternString = patternString.replace(/\?<\w+>/g, EMPTY);
                        this._keys = keys;
                    }
                    if (ignoreWhiteSpace)
                        patternString = patternString.replace(/\s+/g, "\\s*");
                    this._re = new RegExp(patternString, flags);
                }
                Object.freeze(this);
            }
            Regex.prototype.match = function (input, startIndex) {
                if (startIndex === void 0) { startIndex = 0; }
                var _ = this;
                var r;
                if (!input || startIndex >= input.length || !(r = this._re.exec(input.substring(startIndex))))
                    return Match.Empty;
                if (!(startIndex > 0))
                    startIndex = 0;
                var first = startIndex + r.index;
                var loc = first;
                var groups = [], groupMap = {};
                for (var i = 0, len = r.length; i < len; ++i) {
                    var text = r[i];
                    var g = EmptyGroup;
                    if (text != null) {
                        // Empty string might mean \b match or similar.
                        g = new Group(text, loc);
                        g.freeze();
                    }
                    if (i && _._keys && i < _._keys.length)
                        groupMap[_._keys[i]] = g;
                    groups.push(g);
                    if (i !== 0)
                        loc += text.length;
                }
                var m = new Match(r[0], first, groups, groupMap);
                m.freeze();
                return m;
            };
            Regex.prototype.matches = function (input) {
                var matches = [];
                var m, p = 0;
                var end = input && input.length || 0;
                while (p < end && (m = this.match(input, p)) && m.success) {
                    matches.push(m);
                    p = m.index + m.length;
                }
                Object.freeze(matches);
                return matches;
            };
            Regex.prototype.replace = function (input, r, count) {
                if (count === void 0) { count = Infinity; }
                if (!input || r == null || !(count > 0))
                    return input;
                var result = [];
                var p = 0;
                var end = input.length, isEvaluator = typeof r == "function";
                var m, i = 0;
                while (i < count && p < end && (m = this.match(input, p)) && m.success) {
                    var index = m.index, length_1 = m.length;
                    if (p !== index)
                        result.push(input.substring(p, index));
                    result.push(isEvaluator ? r(m, i++) : r);
                    p = index + length_1;
                }
                if (p < end)
                    result.push(input.substring(p));
                return result.join(EMPTY);
            };
            Regex.prototype.isMatch = function (input) {
                return this._re.test(input);
            };
            Regex.isMatch = function (input, pattern, options) {
                var r = new Regex(pattern, options);
                return r.isMatch(input);
            };
            Regex.replace = function (input, pattern, e, options) {
                var r = new Regex(pattern, options);
                return r.replace(input, e);
            };
            return Regex;
        }());
        Text.Regex = Regex;
        var Capture = /** @class */ (function () {
            function Capture(value, index) {
                if (value === void 0) { value = EMPTY; }
                if (index === void 0) { index = -1; }
                this.value = value;
                this.index = index;
            }
            Object.defineProperty(Capture.prototype, "length", {
                get: function () {
                    var v = this.value;
                    return v && v.length || 0;
                },
                enumerable: false,
                configurable: true
            });
            Capture.prototype.freeze = function () {
                Object.freeze(this);
            };
            return Capture;
        }());
        Text.Capture = Capture;
        var Group = /** @class */ (function (_super) {
            __extends(Group, _super);
            function Group(value, index) {
                if (value === void 0) { value = EMPTY; }
                if (index === void 0) { index = -1; }
                return _super.call(this, value, index) || this;
            }
            Object.defineProperty(Group.prototype, "success", {
                get: function () {
                    return this.index != -1;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(Group, "Empty", {
                get: function () {
                    return EmptyGroup;
                },
                enumerable: false,
                configurable: true
            });
            return Group;
        }(Capture));
        Text.Group = Group;
        var EmptyGroup = new Group();
        EmptyGroup.freeze();
        var Match = /** @class */ (function (_super) {
            __extends(Match, _super);
            function Match(value, index, groups, namedGroups) {
                if (value === void 0) { value = EMPTY; }
                if (index === void 0) { index = -1; }
                if (groups === void 0) { groups = []; }
                if (namedGroups === void 0) { namedGroups = {}; }
                var _this = _super.call(this, value, index) || this;
                _this.groups = groups;
                _this.namedGroups = namedGroups;
                return _this;
            }
            Match.prototype.freeze = function () {
                if (!this.groups)
                    throw new Error("'groups' cannot be null.");
                if (!this.namedGroups)
                    throw new Error("'groupMap' cannot be null.");
                Object.freeze(this.groups);
                Object.freeze(this.namedGroups);
                _super.prototype.freeze.call(this);
            };
            Object.defineProperty(Match, "Empty", {
                get: function () {
                    return EmptyMatch;
                },
                enumerable: false,
                configurable: true
            });
            return Match;
        }(Group));
        Text.Match = Match;
        var EmptyMatch = new Match();
        EmptyMatch.freeze();
        var RegexMatchEnumerator = /** @class */ (function () {
            function RegexMatchEnumerator(pattern) {
                if (pattern instanceof Regex) {
                    this._pattern = pattern;
                }
                else {
                    this._pattern = new Regex(pattern);
                }
            }
            RegexMatchEnumerator.prototype.matches = function (input) {
                var _this = this;
                var p; // pointer
                return new Collections.Enumeration.EnumeratorBase(function () {
                    p = 0;
                }, function (yielder) {
                    var match = _this._pattern.match(input, p);
                    if (match.success) {
                        p = match.index + match.length;
                        return yielder.yieldReturn(match);
                    }
                    return yielder.yieldBreak();
                });
            };
            RegexMatchEnumerator.matches = function (input, pattern) {
                return input && pattern
                    ? (new RegexMatchEnumerator(pattern)).matches(input)
                    : Collections.Enumeration.EmptyEnumerator;
            };
            return RegexMatchEnumerator;
        }());
        Text.RegexMatchEnumerator = RegexMatchEnumerator;
        var Padding;
        (function (Padding) {
            var SPACE = " ";
            var ZERO = "0";
            function padStringLeft(source, minLength, pad) {
                if (pad === void 0) { pad = SPACE; }
                return pad && minLength > 0
                    ? (repeat(pad, minLength - source.length) + source)
                    : source;
            }
            Padding.padStringLeft = padStringLeft;
            function padStringRight(source, minLength, pad) {
                if (pad === void 0) { pad = SPACE; }
                return pad && minLength > 0
                    ? (source + repeat(pad, minLength - source.length))
                    : source;
            }
            Padding.padStringRight = padStringRight;
            function padNumberLeft(source, minLength, pad) {
                if (pad === void 0) { pad = ZERO; }
                if (!Type.isNumber(source, true))
                    throw new Error("Cannot pad non-number.");
                if (!source)
                    source = 0;
                return padStringLeft(source + EMPTY, minLength, pad + EMPTY);
            }
            Padding.padNumberLeft = padNumberLeft;
            function padNumberRight(source, minLength, pad) {
                if (pad === void 0) { pad = ZERO; }
                if (!Type.isNumber(source, true))
                    throw new Error("Cannot pad non-number.");
                if (!source)
                    source = 0;
                return padStringRight(source + EMPTY, minLength, pad + EMPTY);
            }
            Padding.padNumberRight = padNumberRight;
            function padLeft(source, minLength, pad) {
                if (Type.isString(source))
                    return padStringLeft(source, minLength, pad);
                if (Type.isNumber(source, true))
                    return padNumberLeft(source, minLength, pad);
                throw new Error("Invalid source type.");
            }
            Padding.padLeft = padLeft;
            function padRight(source, minLength, pad) {
                if (Type.isString(source))
                    return padStringRight(source, minLength, pad);
                if (Type.isNumber(source, true))
                    return padNumberRight(source, minLength, pad);
                throw new Error("Invalid source type.");
            }
            Padding.padRight = padRight;
        })(Padding = Text.Padding || (Text.Padding = {}));
        var StringBuilder = /** @class */ (function () {
            function StringBuilder() {
                var initial = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    initial[_i] = arguments[_i];
                }
                var _ = this;
                _._latest = null;
                _._partArray = [];
                _.appendThese(initial);
            }
            StringBuilder.prototype.appendSingle = function (item) {
                if (item != null) {
                    var _1 = this;
                    _1._latest = null;
                    switch (typeof item) {
                        case Type.OBJECT:
                        case Type.FUNCTION:
                            item = item.toString();
                            break;
                    }
                    _1._partArray
                        .push(item);
                    // Other primitive types can keep their format since a number or boolean is a smaller footprint than a string.
                }
            };
            StringBuilder.prototype.appendThese = function (items) {
                var _ = this;
                items.forEach(function (s) { return _.appendSingle(s); });
                return _;
            };
            StringBuilder.prototype.append = function () {
                var items = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    items[_i] = arguments[_i];
                }
                this.appendThese(items);
                return this;
            };
            StringBuilder.prototype.appendLine = function () {
                var items = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    items[_i] = arguments[_i];
                }
                this.appendLines(items);
                return this;
            };
            StringBuilder.prototype.appendLines = function (items) {
                var _ = this;
                items.forEach(function (i) {
                    if (i != null) {
                        _.appendSingle(i);
                        _._partArray.push("\r\n");
                    }
                });
                return _;
            };
            Object.defineProperty(StringBuilder.prototype, "isEmpty", {
                /** /// These methods can only efficiently be added if not using a single array.
                 insert(index: number, value: string, count: number = 1): StringBuilder
                 {
            
                }
            
                 remove(startIndex:number, length:number): StringBuilder
                 {
            
                }
                 /**/
                get: function () {
                    return this._partArray.length === 0;
                },
                enumerable: false,
                configurable: true
            });
            StringBuilder.prototype.toString = function () {
                var latest = this._latest;
                if (!latest == null)
                    this._latest = latest = this._partArray.join();
                return latest;
            };
            StringBuilder.prototype.join = function (delimiter) {
                return this._partArray.join(delimiter);
            };
            StringBuilder.prototype.clear = function () {
                this._partArray.length = 0;
                this._latest = null;
            };
            StringBuilder.prototype.dispose = function () {
                this.clear();
            };
            return StringBuilder;
        }());
        Text.StringBuilder = StringBuilder;
        var Encoding;
        (function (Encoding) {
            var UTF8 = /** @class */ (function () {
                function UTF8() {
                }
                UTF8.GetBytes = function (text) {
                    var buf = new ArrayBuffer(text.length * 2);
                    var bufView = new Uint16Array(buf);
                    for (var i = 0, strLen = text.length; i < strLen; i++) {
                        bufView[i] = text.charCodeAt(i);
                    }
                    return buf;
                };
                UTF8.GetString = function (buf) {
                    return String.fromCharCode.apply(null, new Uint16Array(buf));
                };
                return UTF8;
            }());
            Encoding.UTF8 = UTF8;
            Encoding.Unicode = UTF8;
        })(Encoding = Text.Encoding || (Text.Encoding = {}));
    })(Text = System.Text || (System.Text = {}));
    var Web;
    (function (Web) {
        var HttpUtility = /** @class */ (function () {
            function HttpUtility() {
            }
            HttpUtility.UrlEncode = function (uri) {
                return encodeURI(uri);
            };
            HttpUtility.UrlDecode = function (enc) {
                return decodeURI(enc);
            };
            return HttpUtility;
        }());
        Web.HttpUtility = HttpUtility;
    })(Web = System.Web || (System.Web = {}));
    var Time;
    (function (Time) {
        function getUnitQuantityFrom(q, units) {
            return TimeUnit.fromMilliseconds(q.getTotalMilliseconds(), units);
        }
        var TimeUnit;
        (function (TimeUnit) {
            TimeUnit[TimeUnit["Ticks"] = 0] = "Ticks";
            TimeUnit[TimeUnit["Milliseconds"] = 1] = "Milliseconds";
            TimeUnit[TimeUnit["Seconds"] = 2] = "Seconds";
            TimeUnit[TimeUnit["Minutes"] = 3] = "Minutes";
            TimeUnit[TimeUnit["Hours"] = 4] = "Hours";
            TimeUnit[TimeUnit["Days"] = 5] = "Days";
        })(TimeUnit = Time.TimeUnit || (Time.TimeUnit = {})); // Earth Days
        (function (TimeUnit) {
            function toMilliseconds(value, units) {
                if (units === void 0) { units = TimeUnit.Milliseconds; }
                // noinspection FallThroughInSwitchStatementJS
                switch (units) {
                    case TimeUnit.Days:
                        value *= 24 /* Day */;
                    case TimeUnit.Hours:
                        value *= 60 /* Hour */;
                    case TimeUnit.Minutes:
                        value *= 60 /* Minute */;
                    case TimeUnit.Seconds:
                        value *= 1000 /* Second */;
                    case TimeUnit.Milliseconds:
                        return value;
                    case TimeUnit.Ticks:
                        return value / 10000 /* Millisecond */;
                    default:
                        throw new Error("Invalid TimeUnit.");
                }
            }
            TimeUnit.toMilliseconds = toMilliseconds;
            function fromMilliseconds(ms, units) {
                switch (units) {
                    case TimeUnit.Days:
                        return ms / 86400000 /* Day */;
                    case TimeUnit.Hours:
                        return ms / 3600000 /* Hour */;
                    case TimeUnit.Minutes:
                        return ms / 60000 /* Minute */;
                    case TimeUnit.Seconds:
                        return ms / 1000 /* Second */;
                    case TimeUnit.Milliseconds:
                        return ms;
                    case TimeUnit.Ticks:
                        return ms * 10000 /* Millisecond */;
                    default:
                        throw new Error("Invalid TimeUnit.");
                }
            }
            TimeUnit.fromMilliseconds = fromMilliseconds;
            function from(quantity, unit) {
                return quantity && fromMilliseconds(quantity.getTotalMilliseconds(), unit);
            }
            TimeUnit.from = from;
            function assertValid(unit) {
                if (isNaN(unit) || unit > TimeUnit.Days || unit < TimeUnit.Ticks || Math.floor(unit) !== unit)
                    throw new Error("Invalid TimeUnit.");
                return true;
            }
            TimeUnit.assertValid = assertValid;
        })(TimeUnit = Time.TimeUnit || (Time.TimeUnit = {}));
        var AreEqual = Compare.areEqual;
        function pluralize(value, label) {
            if (Math.abs(value) !== 1)
                label += "s";
            return label;
        }
        var DateTime = /** @class */ (function () {
            function DateTime(value, kind) {
                if (value === void 0) { value = new Date(); }
                if (kind === void 0) { kind = 1 /* Local */; }
                this._kind = kind;
                if (value instanceof DateTime) {
                    this._value = value.toJsDate();
                    if (kind === VOID0)
                        this._kind = value._kind;
                }
                else if (value instanceof Date)
                    this._value = new Date(value.getTime());
                else
                    this._value = value === VOID0
                        ? new Date()
                        : new Date(value);
            }
            DateTime.prototype.toJsDate = function () {
                return new Date(this._value.getTime()); // return a clone.
            };
            Object.defineProperty(DateTime.prototype, "kind", {
                get: function () {
                    return this._kind;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(DateTime.prototype, "year", {
                get: function () {
                    return this._value.getFullYear();
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(DateTime.prototype, "month", {
                /**
                 * Returns the Gregorian Month (zero indexed).
                 * @returns {number}
                 */
                get: function () {
                    return this._value.getMonth();
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(DateTime.prototype, "calendarMonth", {
                /**
                 * Returns the month number (1-12).
                 * @returns {number}
                 */
                get: function () {
                    return this._value.getMonth() + 1;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(DateTime.prototype, "calendar", {
                get: function () {
                    return {
                        year: this.year,
                        month: this.calendarMonth,
                        day: this.day
                    };
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(DateTime.prototype, "day", {
                /**
                 * Returns the day of the month.  An integer between 1 and 31.
                 * @returns {number}
                 */
                get: function () {
                    return this._value.getDate();
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(DateTime.prototype, "dayIndex", {
                /**
                 * Returns the day of the month indexed starting at zero.
                 * @returns {number}
                 */
                get: function () {
                    return this._value.getDate() - 1;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(DateTime.prototype, "dayOfWeek", {
                /**
                 * Returns the zero indexed day of the week. (Sunday == 0)
                 * @returns {number}
                 */
                get: function () {
                    return this._value.getDay();
                },
                enumerable: false,
                configurable: true
            });
            DateTime.prototype.addMilliseconds = function (ms) {
                ms = ms || 0;
                return new DateTime(this._value.getTime() + ms, this._kind);
            };
            DateTime.prototype.addSeconds = function (seconds) {
                seconds = seconds || 0;
                return this.addMilliseconds(seconds * 1000 /* Second */);
            };
            DateTime.prototype.addMinutes = function (minutes) {
                minutes = minutes || 0;
                return this.addMilliseconds(minutes * 60000 /* Minute */);
            };
            DateTime.prototype.addHours = function (hours) {
                hours = hours || 0;
                return this.addMilliseconds(hours * 3600000 /* Hour */);
            };
            DateTime.prototype.addDays = function (days) {
                days = days || 0;
                return this.addMilliseconds(days * 86400000 /* Day */);
            };
            DateTime.prototype.addMonths = function (months) {
                months = months || 0;
                var d = this.toJsDate();
                d.setMonth(d.getMonth() + months);
                return new DateTime(d, this._kind);
            };
            DateTime.prototype.addYears = function (years) {
                years = years || 0;
                var d = this.toJsDate();
                d.setFullYear(d.getFullYear() + years);
                return new DateTime(d, this._kind);
            };
            /**
             * Receives an ITimeQuantity value and adds based on the total milliseconds.
             * @param {ITimeQuantity} time
             * @returns {DateTime}
             */
            DateTime.prototype.add = function (time) {
                return this.addMilliseconds(time.getTotalMilliseconds());
            };
            /**
             * Receives an ITimeQuantity value and subtracts based on the total milliseconds.
             * @param {ITimeQuantity} time
             * @returns {DateTime}
             */
            DateTime.prototype.subtract = function (time) {
                return this.addMilliseconds(-time.getTotalMilliseconds());
            };
            /**
             * Returns a TimeSpan representing the amount of time between two dates.
             * @param previous
             * @returns {TimeSpan}
             */
            DateTime.prototype.timePassedSince = function (previous) {
                return DateTime.between(previous, this);
            };
            Object.defineProperty(DateTime.prototype, "date", {
                /**
                 * Returns a DateTime object for 00:00 of this date.
                 */
                get: function () {
                    var _ = this;
                    return new DateTime(new Date(_.year, _.month, _.day), _._kind);
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(DateTime.prototype, "timeOfDay", {
                /**
                 * Returns the time of day represented by a ClockTime object.
                 * @returns {ClockTime}
                 */
                get: function () {
                    var _ = this;
                    var t = _._time;
                    if (!t) {
                        var d = this._value;
                        _._time = t = new ClockTime(d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
                    }
                    return t;
                },
                enumerable: false,
                configurable: true
            });
            /**
             * Returns a readonly object which contains all the date and time components.
             */
            DateTime.prototype.toTimeStamp = function () {
                return TimeStamp.from(this);
            };
            Object.defineProperty(DateTime, "now", {
                /**
                 * Returns the now local time.
                 * @returns {DateTime}
                 */
                get: function () {
                    return new DateTime();
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(DateTime.prototype, "toUniversalTime", {
                /**
                 * Returns a UTC version of this date if its kind is local.
                 * @returns {DateTime}
                 */
                get: function () {
                    var _ = this;
                    if (_._kind != 1 /* Local */)
                        return new DateTime(_, _._kind);
                    var d = _._value;
                    return new DateTime(new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds()), 2 /* Utc */);
                },
                enumerable: false,
                configurable: true
            });
            DateTime.prototype.equals = function (other, strict) {
                if (strict === void 0) { strict = false; }
                if (!other)
                    return false;
                if (other == this)
                    return true;
                if (other instanceof Date) {
                    var v = this._value;
                    return other == v || other.getTime() == v.getTime();
                }
                if (other instanceof DateTime) {
                    if (strict) {
                        var ok = other._kind;
                        if (!ok && this._kind || ok != this._kind)
                            return false;
                    }
                    return this.equals(other._value);
                }
                else if (strict)
                    return false;
                return this.equals(other.toJsDate());
            };
            // https://msdn.microsoft.com/en-us/library/system.icomparable.compareto(v=vs.110).aspx
            DateTime.prototype.compareTo = function (other) {
                if (!other)
                    throw new Exceptions.ArgumentNullException("other");
                if (other === this)
                    return 0;
                if (other instanceof DateTime) {
                    other = other._value;
                }
                var ms = this._value.getTime();
                if (other instanceof Date) {
                    return ms - other.getTime();
                }
                return ms - other.toJsDate().getTime();
            };
            DateTime.prototype.equivalent = function (other) {
                if (!other)
                    return false;
                if (other == this)
                    return true;
                if (other instanceof Date) {
                    var v = this._value;
                    // TODO: What is the best way to handle this when kinds match or don't?
                    return v.toUTCString() === other.toUTCString();
                }
                if (other instanceof DateTime) {
                    if (this.equals(other, true))
                        return true;
                }
                return this.equivalent(other.toJsDate());
            };
            Object.defineProperty(DateTime, "today", {
                /**
                 * The date component for now.
                 * @returns {DateTime}
                 */
                get: function () {
                    return DateTime.now.date;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(DateTime, "tomorrow", {
                /**
                 * Midnight tomorrow.
                 * @returns {DateTime}
                 */
                get: function () {
                    var today = DateTime.today;
                    return today.addDays(1);
                },
                enumerable: false,
                configurable: true
            });
            /**
             * Measures the difference between two dates as a TimeSpan.
             * @param first
             * @param last
             */
            DateTime.between = function (first, last) {
                var f = first instanceof DateTime ? first._value : first, l = last instanceof DateTime ? last._value : last;
                return new TimeSpan(l.getTime() - f.getTime());
            };
            /**
             * Calculates if the given year is a leap year using the formula:
             * ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)
             * @param year
             * @returns {boolean}
             */
            DateTime.isLeapYear = function (year) {
                return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
            };
            /**
             * Returns the number of days for the specific year and month.
             * @param year
             * @param month
             * @returns {any}
             */
            DateTime.daysInMonth = function (year, month) {
                // Basically, add 1 month, subtract a day... What's the date?
                return (new Date(year, month + 1, 0)).getDate();
            };
            DateTime.from = function (yearOrDate, month, day) {
                if (month === void 0) { month = 0; }
                if (day === void 0) { day = 1; }
                var year;
                if (typeof yearOrDate == "object") {
                    day = yearOrDate.day;
                    month = yearOrDate.month;
                    year = yearOrDate.year;
                }
                else {
                    year = yearOrDate;
                }
                return new DateTime(new Date(year, month, day));
            };
            DateTime.fromCalendarDate = function (yearOrDate, month, day) {
                if (month === void 0) { month = 1; }
                if (day === void 0) { day = 1; }
                var year;
                if (typeof yearOrDate == "object") {
                    day = yearOrDate.day;
                    month = yearOrDate.month;
                    year = yearOrDate.year;
                }
                else {
                    year = yearOrDate;
                }
                return new DateTime(new Date(year, month - 1, day));
            };
            return DateTime;
        }());
        Time.DateTime = DateTime;
        var TimeQuantity = /** @class */ (function () {
            function TimeQuantity(_quantity) {
                if (_quantity === void 0) { _quantity = 0; }
                this._quantity = _quantity;
                this._resetTotal();
            }
            // Provides an overridable mechanism for extending this class.
            TimeQuantity.prototype.getTotalMilliseconds = function () {
                return this._quantity;
            };
            Object.defineProperty(TimeQuantity.prototype, "direction", {
                /**
                 * +1, 0, or -1 depending on the time direction.
                 * @returns {number}
                 */
                get: function () {
                    return Compare.compare(this.getTotalMilliseconds(), 0);
                },
                enumerable: false,
                configurable: true
            });
            /**
             * Compares this instance against any other time quantity instance and return true if the amount of time is the same.
             * @param other
             * @returns {boolean}
             */
            TimeQuantity.prototype.equals = function (other) {
                return AreEqual(this.getTotalMilliseconds(), other && other.total && other.total.milliseconds);
            };
            /**
             * Compares this instance against any other time quantity instance.
             * @param other
             * @returns {CompareResult}
             */
            TimeQuantity.prototype.compareTo = function (other) {
                return Compare.compare(this.getTotalMilliseconds(), other && other.total && other.total.milliseconds);
            };
            TimeQuantity.prototype._resetTotal = function () {
                var _this = this;
                var t = this._total;
                if (!t || t.isValueCreated) {
                    this._total = Lazy.create(function () {
                        var ms = _this.getTotalMilliseconds();
                        return Object.freeze({
                            ticks: ms * 10000 /* Millisecond */,
                            milliseconds: ms,
                            seconds: ms / 1000 /* Second */,
                            minutes: ms / 60000 /* Minute */,
                            hours: ms / 3600000 /* Hour */,
                            days: ms / 86400000 /* Day */
                        });
                    });
                }
            };
            Object.defineProperty(TimeQuantity.prototype, "total", {
                /**
                 * Returns an object with all units exposed as totals.
                 * @returns {ITimeMeasurement}
                 */
                get: function () {
                    return this._total.value;
                },
                enumerable: false,
                configurable: true
            });
            /**
             * Returns the total amount of time measured in the requested TimeUnit.
             * @param units
             * @returns {number}
             */
            TimeQuantity.prototype.getTotal = function (units) {
                return TimeUnit.fromMilliseconds(this.getTotalMilliseconds(), units);
            };
            return TimeQuantity;
        }());
        Time.TimeQuantity = TimeQuantity;
        var TimeUnitValue = /** @class */ (function (_super) {
            __extends(TimeUnitValue, _super);
            function TimeUnitValue(value, _units) {
                var _this = _super.call(this, typeof value == "number"
                    ? value
                    : getUnitQuantityFrom(value, _units)) || this;
                _this._units = _units;
                TimeUnit.assertValid(_units);
                return _this;
            }
            Object.defineProperty(TimeUnitValue.prototype, "value", {
                get: function () {
                    return this._quantity;
                },
                set: function (v) {
                    this._quantity = v;
                    this._resetTotal();
                },
                enumerable: false,
                configurable: true
            });
            TimeUnitValue.prototype.getTotalMilliseconds = function () {
                return TimeUnit.toMilliseconds(this._quantity, this._units);
            };
            Object.defineProperty(TimeUnitValue.prototype, "units", {
                // To avoid confusion, the unit type can only be set once at construction.
                get: function () {
                    return this._units;
                },
                enumerable: false,
                configurable: true
            });
            TimeUnitValue.prototype.to = function (units) {
                if (units === void 0) { units = this.units; }
                return TimeUnitValue.from(this, units);
            };
            TimeUnitValue.from = function (value, units) {
                if (units === void 0) { units = TimeUnit.Milliseconds; }
                return new TimeUnitValue(value, units);
            };
            return TimeUnitValue;
        }(TimeQuantity));
        var ClockTime = /** @class */ (function (_super) {
            __extends(ClockTime, _super);
            function ClockTime() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var _this = _super.call(this, args.length > 1
                    ? ClockTime.millisecondsFromTime(args[0] || 0, args[1] || 0, args.length > 2 && args[2] || 0, args.length > 3 && args[3] || 0)
                    : (args.length > 0 && args[0] || 0)) || this;
                var ms = Math.abs(_this.getTotalMilliseconds());
                var msi = Math.floor(ms);
                _this.tick = (ms - msi) * 10000 /* Millisecond */;
                _this.days = (msi / 86400000 /* Day */) | 0;
                msi -= _this.days * 86400000 /* Day */;
                _this.hour = (msi / 3600000 /* Hour */) | 0;
                msi -= _this.hour * 3600000 /* Hour */;
                _this.minute = (msi / 60000 /* Minute */) | 0;
                msi -= _this.minute * 60000 /* Minute */;
                _this.second = (msi / 1000 /* Second */) | 0;
                msi -= _this.second * 1000 /* Second */;
                _this.millisecond = msi;
                Object.freeze(_this);
                return _this;
            }
            // Static version for relative consistency.  Constructor does allow this format.
            ClockTime.from = function (hours, minutes, seconds, milliseconds) {
                if (seconds === void 0) { seconds = 0; }
                if (milliseconds === void 0) { milliseconds = 0; }
                return new ClockTime(hours, minutes, seconds, milliseconds);
            };
            ClockTime.millisecondsFromTime = function (hours, minutes, seconds, milliseconds) {
                if (seconds === void 0) { seconds = 0; }
                if (milliseconds === void 0) { milliseconds = 0; }
                var value = hours;
                value *= 60 /* Hour */;
                value += minutes;
                value *= 60 /* Minute */;
                value += seconds;
                value *= 1000 /* Second */;
                value += milliseconds;
                return value;
            };
            ClockTime.prototype.toString = function ( /*format?:string, formatProvider?:IFormatProvider*/) {
                /* INSERT CUSTOM FORMATTING CODE HERE */
                var _ = this;
                var a = [];
                if (_.days)
                    a.push(pluralize(_.days, "day"));
                if (_.hour)
                    a.push(pluralize(_.hour, "hour"));
                if (_.minute)
                    a.push(pluralize(_.minute, "minute"));
                if (_.second)
                    a.push(pluralize(_.second, "second"));
                if (a.length > 1)
                    a.splice(a.length - 1, 0, "and");
                return a.join(", ").replace(", and, ", " and ");
            };
            return ClockTime;
        }(TimeQuantity));
        Time.ClockTime = ClockTime;
        var TimeStamp = /** @class */ (function () {
            function TimeStamp(year, month, day, hour, minute, second, millisecond, tick) {
                // Add validation or properly carry out of range values?
                if (day === void 0) { day = 1; }
                if (hour === void 0) { hour = 0; }
                if (minute === void 0) { minute = 0; }
                if (second === void 0) { second = 0; }
                if (millisecond === void 0) { millisecond = 0; }
                if (tick === void 0) { tick = 0; }
                this.year = year;
                this.month = month;
                this.day = day;
                this.hour = hour;
                this.minute = minute;
                this.second = second;
                this.millisecond = millisecond;
                this.tick = tick;
                Object.freeze(this);
            }
            TimeStamp.prototype.toJsDate = function () {
                var _ = this;
                return new Date(_.year, _.month, _.day, _.hour, _.minute, _.second, _.millisecond + _.tick / 10000 /* Millisecond */);
            };
            TimeStamp.from = function (d) {
                if (!(d instanceof Date) && System.Type.hasMember(d, "toJsDate"))
                    d = d.toJsDate();
                if (d instanceof Date) {
                    return new TimeStamp(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
                }
                else {
                    throw Error("Invalid date type.");
                }
            };
            return TimeStamp;
        }());
        Time.TimeStamp = TimeStamp;
        var timeSpanZero;
        var TimeSpan = /** @class */ (function (_super) {
            __extends(TimeSpan, _super);
            // In .NET the default type is Ticks, but for JavaScript, we will use Milliseconds.
            function TimeSpan(value, units) {
                if (units === void 0) { units = TimeUnit.Milliseconds; }
                var _this = this;
                var ms = TimeUnit.toMilliseconds(value, units);
                _this = _super.call(this, ms) || this;
                _this.ticks = ms * 10000 /* Millisecond */;
                _this.milliseconds = ms;
                _this.seconds = ms / 1000 /* Second */;
                _this.minutes = ms / 60000 /* Minute */;
                _this.hours = ms / 3600000 /* Hour */;
                _this.days = ms / 86400000 /* Day */;
                _this._time = Lazy.create(function () { return new ClockTime(_this.getTotalMilliseconds()); });
                Object.freeze(_this);
                return _this;
            }
            Object.defineProperty(TimeSpan.prototype, "total", {
                /**
                 * Provides an standard interface for acquiring the total time.
                 * @returns {TimeSpan}
                 */
                get: function () {
                    return this;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(TimeSpan.prototype, "time", {
                // Instead of the confusing getTotal versus unit name, expose a 'ClockTime' value which reports the individual components.
                get: function () {
                    return this._time.value;
                },
                enumerable: false,
                configurable: true
            });
            TimeSpan.prototype.add = function (other) {
                if (Type.isNumber(other))
                    throw new Error("Use .addUnit(value:number,units:TimeUnit) to add a numerical value amount.  Default units are milliseconds.\n" +
                        ".add only supports quantifiable time values (ITimeTotal).");
                return new TimeSpan(this.getTotalMilliseconds() + other.total.milliseconds);
            };
            TimeSpan.prototype.addUnit = function (value, units) {
                if (units === void 0) { units = TimeUnit.Milliseconds; }
                return new TimeSpan(this.getTotalMilliseconds() + TimeUnit.toMilliseconds(value, units));
            };
            TimeSpan.from = function (value, units) {
                return new TimeSpan(value, units);
            };
            TimeSpan.fromDays = function (value) {
                return new TimeSpan(value, TimeUnit.Days);
            };
            TimeSpan.fromHours = function (value) {
                return new TimeSpan(value, TimeUnit.Hours);
            };
            TimeSpan.fromMinutes = function (value) {
                return new TimeSpan(value, TimeUnit.Minutes);
            };
            TimeSpan.fromSeconds = function (value) {
                return new TimeSpan(value, TimeUnit.Seconds);
            };
            TimeSpan.fromMilliseconds = function (value) {
                return new TimeSpan(value, TimeUnit.Milliseconds);
            };
            TimeSpan.fromTicks = function (value) {
                return new TimeSpan(value, TimeUnit.Ticks);
            };
            Object.defineProperty(TimeSpan, "zero", {
                get: function () {
                    return timeSpanZero || (timeSpanZero = new TimeSpan(0));
                },
                enumerable: false,
                configurable: true
            });
            return TimeSpan;
        }(TimeQuantity));
        Time.TimeSpan = TimeSpan;
    })(Time = System.Time || (System.Time = {}));
    var Diagnostics;
    (function (Diagnostics) {
        var TimeSpan = Time.TimeSpan;
        function getTimestampMilliseconds() {
            return (new Date()).getTime();
        }
        var Stopwatch = /** @class */ (function () {
            function Stopwatch() {
                this.reset();
            }
            Stopwatch.getTimestampMilliseconds = function () {
                return getTimestampMilliseconds();
            };
            Object.defineProperty(Stopwatch.prototype, "isRunning", {
                get: function () {
                    return this._isRunning;
                },
                enumerable: false,
                configurable: true
            });
            Stopwatch.startNew = function () {
                var s = new Stopwatch();
                s.start();
                return s;
            };
            Stopwatch.measure = function (closure) {
                var start = getTimestampMilliseconds();
                closure();
                return new TimeSpan(getTimestampMilliseconds() - start);
            };
            Stopwatch.prototype.start = function () {
                var _ = this;
                if (!_._isRunning) {
                    _._startTimeStamp = getTimestampMilliseconds();
                    _._isRunning = true;
                }
            };
            Stopwatch.prototype.stop = function () {
                var _ = this;
                if (_._isRunning) {
                    _._elapsed += _.currentLapMilliseconds;
                    _._isRunning = false;
                }
            };
            Stopwatch.prototype.restart = function () {
                this.stop();
                this.start();
            };
            Stopwatch.prototype.reset = function () {
                var _ = this;
                _._elapsed = 0;
                _._isRunning = false;
                _._startTimeStamp = NaN;
            };
            // Effectively calls a stop start and continues timing...
            // Can also be called to effectively start a lap before calling it again to get the elapsed lap time.
            Stopwatch.prototype.lap = function () {
                var _ = this;
                if (_._isRunning) {
                    var t = getTimestampMilliseconds();
                    var s = _._startTimeStamp;
                    var e = t - s;
                    _._startTimeStamp = t;
                    _._elapsed += e;
                    return new TimeSpan(e);
                }
                else
                    return TimeSpan.zero;
            };
            Object.defineProperty(Stopwatch.prototype, "currentLapMilliseconds", {
                get: function () {
                    return this._isRunning
                        ? (getTimestampMilliseconds() - this._startTimeStamp)
                        : 0;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(Stopwatch.prototype, "currentLap", {
                get: function () {
                    return this._isRunning
                        ? new TimeSpan(this.currentLapMilliseconds)
                        : TimeSpan.zero;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(Stopwatch.prototype, "elapsedMilliseconds", {
                get: function () {
                    var _ = this;
                    var timeElapsed = _._elapsed;
                    if (_._isRunning)
                        timeElapsed += _.currentLapMilliseconds;
                    return timeElapsed;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(Stopwatch.prototype, "elapsed", {
                get: function () {
                    return new TimeSpan(this.elapsedMilliseconds);
                },
                enumerable: false,
                configurable: true
            });
            return Stopwatch;
        }());
        Diagnostics.Stopwatch = Stopwatch;
    })(Diagnostics = System.Diagnostics || (System.Diagnostics = {}));
    var Char;
    (function (Char) {
        function isWhiteSpace(ch) {
            return ch === 32 || (ch >= 9 && ch <= 13) || ch === 133 || ch === 160;
        }
        Char.isWhiteSpace = isWhiteSpace;
        function isLetter(ch) {
            return (65 <= ch && ch <= 90) || (97 <= ch && ch <= 122) || (ch >= 128 && ch !== 133 && ch !== 160);
        }
        Char.isLetter = isLetter;
        function isLetterOrDigit(ch) {
            return (48 <= ch && ch <= 57) ||
                (65 <= ch && ch <= 90) ||
                (97 <= ch && ch <= 122) ||
                (ch >= 128 && ch !== 133 && ch !== 160);
        }
        Char.isLetterOrDigit = isLetterOrDigit;
        function isDigit(chOrStr, index) {
            if (arguments.length === 1) {
                return 48 <= chOrStr && chOrStr <= 57;
            }
            else {
                var ch = chOrStr.charCodeAt(index);
                return 48 <= ch && ch <= 57;
            }
        }
        Char.isDigit = isDigit;
    })(Char = System.Char || (System.Char = {}));
})(System || (System = {}));
