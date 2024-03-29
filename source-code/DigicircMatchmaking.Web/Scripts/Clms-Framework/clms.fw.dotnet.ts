﻿namespace System {
    import ILinqEnumerable = System.Linq.ILinqEnumerable;

    const NULL: any = null;
    export const EMPTY = "";

    const
        VOID0 = void (0) as undefined,
        _BOOLEAN = typeof true as TypeValue.Boolean,
        _NUMBER = typeof 0 as TypeValue.Number,
        _STRING = typeof "" as TypeValue.String,
        _SYMBOL = "symbol" as TypeValue.Symbol,
        _OBJECT = typeof {} as TypeValue.Object,
        _UNDEFINED = typeof VOID0 as TypeValue.Undefined,
        _FUNCTION = typeof (() => { }) as TypeValue.Function,
        LENGTH = "length" as string;

    const typeInfoRegistry: { [key: string]: TypeInfo } = {};

    export class TypeInfo {
        // Not retained for primitives. Since they have no members.
        protected readonly target: any;

        readonly type: string;

        readonly isBoolean: boolean;
        readonly isNumber: boolean;
        readonly isFinite: boolean;
        readonly isValidNumber: boolean;
        readonly isString: boolean;
        readonly isTrueNaN: boolean;
        readonly isObject: boolean;
        readonly isArray: boolean;
        readonly isFunction: boolean;
        readonly isUndefined: boolean;
        readonly isNull: boolean;
        readonly isNullOrUndefined: boolean;
        readonly isPrimitive: boolean;
        readonly isSymbol: boolean;

        constructor(target: any, onBeforeFreeze?: (instance: any) => void) {
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
                    } else {
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
                    throw `Fatal type failure.  Unknown type: ${this.type}`;
            }

            if (onBeforeFreeze) onBeforeFreeze(this);
            Object.freeze(this);

        }

        /**
         * Returns a TypeInfo for any member or non-member,
         * where non-members are of type undefined.
         * @param name
         * @returns {TypeInfo}
         */
        member(name: string | number | symbol): TypeInfo {
            const t = this.target;
            return TypeInfo.getFor(
                t && (name) in (t)
                    ? t[name]
                    : VOID0);
        }

        /**
         * Returns a TypeInfo for any target object.
         * If the target object is of a primitive type, it returns the TypeInfo instance assigned to that type.
         * @param target
         * @returns {TypeInfo}
         */
        static getFor(target: any): TypeInfo {
            const type: string = typeof target;
            switch (type) {
                case _OBJECT:
                case _FUNCTION:
                    return new TypeInfo(target);
            }
            let info = typeInfoRegistry[type];
            if (!info) typeInfoRegistry[type] = info = new TypeInfo(target);
            return info;
        }

        /**
         * Returns true if the target matches the type (instanceof).
         * @param type
         * @returns {boolean}
         */
        is<T>(type: { new (...params: any[]): T }): boolean {
            return this.target instanceof type;
        }

        /**
         * Returns null if the target does not match the type (instanceof).
         * Otherwise returns the target as the type.
         * @param type
         * @returns {T|null}
         */
        as<T>(type: { new (...params: any[]): T }): T | null {
            return this.target instanceof type ? this.target : null;
        }

    }

    export function Type(target: any): TypeInfo {
        return new TypeInfo(target);
    }

    export module Type {
        /**
         * typeof true
         * @type {string}
         */
        export const BOOLEAN: TypeValue.Boolean = _BOOLEAN;

        /**
         * typeof 0
         * @type {string}
         */
        export const NUMBER: TypeValue.Number = _NUMBER;

        /**
         * typeof ""
         * @type {string}
         */
        export const STRING: TypeValue.String = _STRING;

        /**
         * typeof {}
         * @type {string}
         */
        export const OBJECT: TypeValue.Object = _OBJECT;


        /**
         * typeof Symbol
         * @type {string}
         */
        export const SYMBOL: TypeValue.Symbol = _SYMBOL;

        /**
         * typeof undefined
         * @type {string}
         */
        export const UNDEFINED: TypeValue.Undefined = _UNDEFINED;

        /**
         * typeof function
         * @type {string}
         */
        export const FUNCTION: TypeValue.Function = _FUNCTION;

        /**
         * Returns true if the target matches the type (instanceof).
         * @param target
         * @param type
         * @returns {T|null}
         */
        export function is<T>(target: Object, type: { new (...params: any[]): T }): target is T {
            return target instanceof type;
        }

        /**
         * Returns null if the target does not match the type (instanceof).
         * Otherwise returns the target as the type.
         * @param target
         * @param type
         * @returns {T|null}
         */
        export function as<T>(target: Object, type: { new (...params: any[]): T }): T | null {
            return target instanceof type ? target as T : null;
        }

        /**
         * Returns true if the value parameter is null or undefined.
         * @param value
         * @returns {boolean}
         */
        export function isNullOrUndefined(value: any): value is null | undefined {
            return value == null;
        }

        /**
         * Returns true if the value parameter is a boolean.
         * @param value
         * @returns {boolean}
         */
        export function isBoolean(value: any): value is boolean {
            return typeof value === _BOOLEAN;
        }

        /**
         * Returns true if the value parameter is a number.
         * @param value
         * @param ignoreNaN Default is false. When true, NaN is not considered a number and will return false.
         * @returns {boolean}
         */
        export function isNumber(value: any, ignoreNaN: boolean = false): value is number {
            return typeof value === _NUMBER && (!ignoreNaN || !isNaN(value));
        }

        /**
         * Returns true if is a number and is NaN.
         * @param value
         * @returns {boolean}
         */
        export function isTrueNaN(value: any): value is number {
            return typeof value === _NUMBER && isNaN(value);
        }

        /**
         * Returns true if the value parameter is a string.
         * @param value
         * @returns {boolean}
         */
        export function isString(value: any): value is string {
            return typeof value === _STRING;
        }

        /**
         * Returns true if the value is a boolean, string, number, null, or undefined.
         * @param value
         * @param allowUndefined if set to true will return true if the value is undefined.
         * @returns {boolean}
         */
        export function isPrimitive(value: any, allowUndefined: boolean = false): value is Primitive {
            const t = typeof value;
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

        /**
         * For detecting if the value can be used as a key.
         * @param value
         * @param allowUndefined
         * @returns {boolean|boolean}
         */
        export function isPrimitiveOrSymbol(
            value: any,
            allowUndefined: boolean = false): value is Primitive | symbol {
            return typeof value === _SYMBOL ? true : isPrimitive(value, allowUndefined);
        }

        /**
         * Returns true if the value is a string, number, or symbol.
         * @param value
         * @returns {boolean}
         */
        export function isPropertyKey(value: any): value is string | number | symbol {
            const t = typeof value;
            switch (t) {
                case _STRING:
                case _NUMBER:
                case _SYMBOL:
                    return true;
            }
            return false;
        }

        /**
         * Returns true if the value parameter is a function.
         * @param value
         * @returns {boolean}
         */
        export function isFunction(value: any): value is Function {
            return typeof value === _FUNCTION;
        }

        /**
         * Returns true if the value parameter is an object.
         * @param value
         * @param allowNull If false (default) null is not considered an object.
         * @returns {boolean}
         */
        export function isObject(value: any, allowNull: boolean = false): boolean {
            return typeof value === _OBJECT && (allowNull || value !== null);
        }

        /**
         * Guarantees a number value or NaN instead.
         * @param value
         * @returns {number}
         */
        export function numberOrNaN(value: any): number {
            return isNaN(value) ? NaN : value;
        }

        /**
         * Returns a TypeInfo object for the target.
         * @param target
         * @returns {TypeInfo}
         */
        export function of(target: any): TypeInfo {
            return TypeInfo.getFor(target);
        }

        /**
         * Will detect if a member exists (using 'in').
         * Returns true if a property or method exists on the object or its prototype.
         * @param instance
         * @param property Name of the member.
         * @param ignoreUndefined When ignoreUndefined is true, if the member exists but is undefined, it will return false.
         * @returns {boolean}
         */
        export function hasMember(instance: any, property: string, ignoreUndefined: boolean = true): boolean {
            return instance &&
                !isPrimitive(instance) &&
                (property) in (instance) &&
                (ignoreUndefined || instance[property] !== VOID0);
        }

        /**
         * Returns true if the member matches the type.
         * @param instance
         * @param property
         * @param type
         * @returns {boolean}
         */
        export function hasMemberOfType<T>(
            instance: any,
            property: string,
            type: TypeValue.Any): instance is T {
            return hasMember(instance, property) && typeof (instance[property]) === type;
        }

        export function hasMethod<T>(instance: any, property: string): instance is T {
            return hasMemberOfType<T>(instance, property, _FUNCTION);
        }

        export function isArrayLike<T>(instance: any): instance is Collections.ArrayLikeWritable<T> {
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
    }
    
    /**
     * Returns a numerical (integer) hash code of the string.  Can be used for identifying inequality of contents, but two different strings in rare cases will have the same hash code.
     * @param source
     * @returns {number}
     */
    export function getHashCode(source: string): number {
        let hash = 0 | 0;
        if (source.length === 0) return hash;
        for (let i = 0, l = source.length; i < l; i++) {
            const ch = source.charCodeAt(i);
            hash = ((hash << 5) - hash) + ch;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    export function repeat(source: string, count: number): string {
        let result = EMPTY;
        if (!isNaN(count)) {
            for (let i = 0; i < count; i++) {
                result += source;
            }
        }
        return result;
    }

    export function fromChars(ch: number, count: number): string;
    export function fromChars(chars: number[]): string;
    export function fromChars(chOrChars: any, count: number = 1): string {
        if ((chOrChars) instanceof (Array)) {
            let result = EMPTY;
            for (let char of chOrChars) {
                result += String.fromCharCode(char);
            }
            return result;
        } else {
            return repeat(String.fromCharCode(chOrChars), count);
        }
    }

    /**
     * Escapes a RegExp sequence.
     * @param source
     * @returns {string}
     */
    export function escapeRegExp(source: string): string {
        return source.replace(/[-[\]\/{}()*+?.\\^$|]/g, "\\$&");
    }

    /**
     * Can trim any character or set of characters from the ends of a string.
     * Uses a Regex escapement to replace them with empty.
     * @param source
     * @param chars A string or array of characters desired to be trimmed.
     * @param ignoreCase
     * @returns {string}
     */
    export function trim(source: string, chars?: string | string[], ignoreCase?: boolean): string {
        if (chars === EMPTY) return source;
        if (chars) {
            const escaped = escapeRegExp((chars) instanceof (Array) ? (chars as any).join() : (chars as string));
            return source.replace(new RegExp(`^[${escaped}]+|[${escaped}]+$`,
                `g${ignoreCase
                    ? "i"
                    : ""}`),
                EMPTY);
        }

        return source.replace(/^\s+|\s+$/g, EMPTY);
    }

    /**
     * Takes any arg
     * @param source
     * @param args
     * @returns {string}
     */
    export function format(source: string, ...args: any[]) {
        return supplant(source, args);
    }

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
    export function supplant(source: string, params: { [key: string]: any } | any[]): string {
        const oIsArray = (params) instanceof (Array);
        return source.replace(/\{([^{}]*)}/g,
            (a: string, b: string): any => {
                let n: any = b;
                if (oIsArray) {
                    const i = parseInt(b);
                    if (!isNaN(i)) n = i;
                }

                const r = (params as any)[n];
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
            }
        );
    }

    function canMatch(source: string, match: string): boolean | null | void {
        if (!Type.isString(source) || !match) return false;
        if (source === match) return true;
        if (match.length < source.length) return null;
        return null;
    }

    /**
     * Returns true if the pattern matches the beginning of the source.
     * @param source
     * @param pattern
     * @returns {boolean}
     */
    export function startsWith(source: string, pattern: string): boolean {
        const m = canMatch(source, pattern);
        return Type.isBoolean(m) ? m : source.indexOf(pattern) === 0;
    }

    /**
     * Returns true if the pattern matches the end of the source.
     * @param source
     * @param pattern
     * @returns {boolean}
     */
    export function endsWith(source: string, pattern: string): boolean {
        const m = canMatch(source, pattern);
        return Type.isBoolean(m) ? m : source.lastIndexOf(pattern) === (source.length - pattern.length);
    }

    /**
     * Splits the source string into an array of strings, splitting it up using the provided delimiter
     * @param source - The string to split up
     * @param delimiter - The delimiter (single character, string or an array of chars/strings) to use when splitting the source string
     * @param removeEmpty - If true, all empty entries will be removed from the result
     * @returns {Array<string>} - Array of strings, made up from the split source
     */
    export function split(source: string, delimiter: any = "", removeEmpty?: boolean): Array<string> {
        if (source == null) {
            return null;
        }

        let clearDelimiter: string = delimiter.toString();

        if (Array.isArray(delimiter) == true) {
            clearDelimiter = delimiter.join('');
        }

        let result = source.split(new RegExp(`[${clearDelimiter}]`));

        if (removeEmpty === true) {
            return result.linq.where(x => x != null && x.trim() != "").toArray();
        }

        return result;
    }

    export class Exception implements Error, Disposable.IDisposable {
        /**
         * A string representation of the error type.
         * The default is 'Error'.
         */
        readonly name: string;
        readonly stack: string;
        readonly data: IMap<any>;

        /**
         * Initializes a new instance of the Exception class with a specified error message and optionally a reference to the inner exception that is the cause of this exception.
         * @param message
         * @param innerException
         * @param beforeSealing This delegate is used to allow actions to occur just before this constructor finishes.  Since some compilers do not allow the use of 'this' before super.
         */
        constructor(
            readonly message: string,
            innerException?: Error,
            beforeSealing?: (ex: any) => void) {
            const _ = this;

            this.name = _.getName();
            this.data = {};

            if (innerException)
                _.data["innerException"] = innerException;

            /* Originally intended to use 'get' accessors for properties,
             * But debuggers don't display these readily yet.
             * Object.freeze has to be used carefully, but will prevent overriding values at runtime.
             */

            if (beforeSealing) beforeSealing(_);

            // Node has a .stack, let's use it...
            try {
                let stack: string = eval("new System.Error()").stack;
                stack = stack &&
                    stack
                        .replace(/^Error\n/, "")
                        .replace(/(.|\n)+\s+at new.+/, "") ||
                    "";

                this.stack = _.toStringWithoutBrackets() + stack;
            } catch (ex) {
            }

            Object.freeze(_);
        }


        /**
         * A string representation of the error type.
         * The default is 'Error'.
         */
        protected getName(): string { return "Exception"; }

        /**
         * The string representation of the Exception instance.
         */
        toString(): string {
            return `[${this.toStringWithoutBrackets()}]`;
        }

        protected toStringWithoutBrackets(): string {
            const _ = this;
            const m = _.message;
            return _.name + (m ? (`: ${m}`) : "");
        }

        /**
         * Clears the data object.
         */
        dispose(): void {
            const data = this.data;
            for (let k in data) {
                if (data.hasOwnProperty(k))
                    delete data[k];
            }
        }
    }

    export class Guid {
        private static _validator = new RegExp("^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$", "i");
        private value;
        static EMPTY = "00000000-0000-0000-0000-000000000000";

        private static gen(count) {
            let out = "";
            for (let i = 0; i < count; i++) {
                out += (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }
            return out;
        }

        constructor(guid: string | Guid) {
            if (!guid) throw new TypeError("Invalid argument; `value` has no value.");

            this.value = Guid.EMPTY;

            if (guid && guid instanceof Guid) {
                this.value = guid.toString();

            } else if (guid && Object.prototype.toString.call(guid) === "[object String]" && Guid.IsGuid(guid)) {
                this.value = guid;
            }
        }

        Equals = (other: Guid): boolean => {
            // Comparing string `value` against provided `guid` will auto-call
            // toString on `guid` for comparison
            return Guid.IsGuid(other) && this.value === other;
        };

        IsEmpty = (): boolean => {
            return this.value === Guid.EMPTY;
        };

        ToString = () => {
            return this.value;
        };

        toString = () => {
            return this.value;
        };

        ToJSON = () => {
            return this.value;
        };

        static IsGuid(value) {
            return value && (value instanceof Guid || this._validator.test(value.toString()));
        }

        static NewGuid() {
            const gen = Guid.gen;
            return new Guid([gen(2), gen(1), gen(1), gen(1), gen(3)].join("-"));
        }

        static Parse(guid: string): Guid {
            if (this.IsGuid(guid)) {
                return new Guid(guid);
            } else {
                throw new Error("Can't parse this to Guid");
            }
        }

        static Raw() {
            const gen = Guid.gen;
            return [gen(2), gen(1), gen(1), gen(1), gen(3)].join("-");
        }
    }
    
    export declare type Comparable = Primitive | IComparable<any>;
    
    export declare const enum CompareResult {
        Equal = 0,
        Greater = 1,
        Less = -1
    }

    export interface IComparer<T> {
        compare(a: T, b: T): number;
    }

    export interface IComparable<T> {
        compareTo(other: T): number;
    }

    export interface IEquatable<T> {
        equals(other: T): boolean;
    }

    export interface Error {
        name: string;
        message: string;
    }

    export interface IMap<TValue> {
        [key: string]: TValue
    }

    export interface Selector<TSource, TResult> {
        (source: TSource): TResult;
    }

    export interface SelectorWithIndex<TSource, TResult> {
        (source: TSource, index: number): TResult;
    }

    export interface Action<T> extends Selector<T, void> {
    }

    export interface ActionWithIndex<T> extends SelectorWithIndex<T, void> {
    }

    export interface Predicate<T> extends Selector<T, boolean> {
    }

    export interface PredicateWithIndex<T> extends SelectorWithIndex<T, boolean> {
    }

    export interface Comparison<T> {
        (a: T, b: T, strict?: boolean): number;
    }

    export interface EqualityComparison<T> {
        (a: T, b: T, strict?: boolean): boolean;
    }


    export interface Func<TResult> {
        (): TResult;
    }

    export interface Closure {
        (): void;
    }

    export interface IKeyValuePair<TKey, TValue> {
        key: TKey;
        value: TValue;
    }

    export declare type KeyValuePair<TKey, TValue> = IKeyValuePair<TKey, TValue> | [TKey, TValue];

    export interface IStringKeyValuePair<TValue> extends IKeyValuePair<string, TValue>
    { }

    export declare type StringKeyValuePair<TValue> = IStringKeyValuePair<TValue> | [string, TValue];

    export module Compare {
        import IsTrueNaN = Type.isTrueNaN;
        import TrueNaN = Type.isTrueNaN;
        const VOID0 = void 0;

        /**
         * Used for special comparison including NaN.
         * @param a
         * @param b
         * @param strict
         * @returns {boolean|any}
         */
        export function areEqual(a: any, b: any, strict: boolean = true): boolean {
            return a === b || !strict && a === b || IsTrueNaN(a) && TrueNaN(b);
        }

        const COMPARE_TO = "compareTo";

        /**
         * Compares two comparable objects or primitives.
         * @param a
         * @param b
         */
        export function compare<T>(a: IComparable<T>, b: IComparable<T>): number;
        export function compare<T extends Primitive>(a: T, b: T, strict?: boolean): CompareResult;
        export function compare(a: any, b: any, strict: boolean = true): CompareResult {

            if (areEqual(a, b, strict))
                return CompareResult.Equal;

            if (a && Type.hasMember(a, COMPARE_TO))
                return a.compareTo(b); // If a has compareTo, use it.
            else if (b && Type.hasMember(b, COMPARE_TO))
                return -b.compareTo(a); // a doesn't have compareTo? check if b does and invert.

            // Allow for special inequality..

            if (a > b || strict && (a === 0 && b === 0 || a === null && b === VOID0))
                return CompareResult.Greater;

            if (b > a || strict && (b === 0 && a === 0 || b === null && a === VOID0))
                return CompareResult.Less;

            return NaN;
        }

        /**
         * Determines if two primitives are equal or if two objects have the same key/value combinations.
         * @param a
         * @param b
         * @param nullEquivalency If true, null/undefined will be equivalent to an empty object {}.
         * @param extraDepth
         * @returns {boolean}
         */
        export function areEquivalent(
            a: any,
            b: any,
            nullEquivalency: boolean = true,
            extraDepth: number = 0): boolean {

            // Take a step by step approach to ensure efficiency.
            if (areEqual(a, b, true)) return true;

            if (a == null || b == null) {
                if (!nullEquivalency) return false;

                if (Type.isObject(a)) {
                    return !Object.keys(a).length;
                }

                if (Type.isObject(b)) {
                    return !Object.keys(b).length;
                }

                return a == null && b == null;
            }

            if (Type.isObject(a) && Type.isObject(b)) {

                const aKeys = Object.keys(a), bKeys = Object.keys(b), len = aKeys.length;
                if (len !== bKeys.length)
                    return false;

                aKeys.sort();
                bKeys.sort();

                for (let i = 0; i < len; i++) {
                    const key = aKeys[i];
                    if (key !== bKeys[i] || !areEqual(a[key], b[key], true)) return false;
                }

                // Doesn't track circular references but allows for controlling the amount of recursion.
                if (extraDepth > 0) {

                    for (let key of aKeys) {
                        if (!areEquivalent(a[key], b[key], nullEquivalency, extraDepth - 1)) return false;
                    }
                }

                return true;
            }

            return false;
        }
    }

    export module KeyValueExtractModule {
        const
            VOID0: undefined = void 0,
            DOT: string = ".",
            KEY: string = "key",
            VALUE: string = "value",
            ITEM: string = "item",
            ITEM_1: string = ITEM + "[1]",
            ITEM_VALUE: string = ITEM + DOT + VALUE,
            INVALID_KVP_MESSAGE: string = "Invalid type.  Must be a KeyValuePair or Tuple of length 2.",
            CANNOT_BE_UNDEFINED: string = "Cannot equal undefined.";

        export function isKeyValuePair<TKey, TValue>(kvp: any): kvp is IKeyValuePair<TKey, TValue> {
            return kvp && kvp.hasOwnProperty(KEY) && kvp.hasOwnProperty(VALUE);
        }

        export function assertKey<TKey>(key: TKey, name: string = ITEM): TKey | never {
            assertNotUndefined(key, name + DOT + KEY);
            if (key === null)
                throw new Exceptions.ArgumentNullException(name + DOT + KEY);

            return key;
        }


        export function assertTuple(tuple: ArrayLike<any>, name: string = ITEM): void | never {
            if (tuple.length !== 2)
                throw new Exceptions.ArgumentException(name, "KeyValuePair tuples must be of length 2.");

            assertKey(tuple[0], name);
        }


        export function assertNotUndefined<T>(value: T, name: string): T | never {
            if (value === VOID0)
                throw new Exceptions.ArgumentException(name, CANNOT_BE_UNDEFINED);

            return value;
        }


        export function extractKeyValue<TKey, TValue, TResult>(
            item: KeyValuePair<TKey, TValue>,
            to: (key: TKey, value: TValue) => TResult): TResult {


            let key: TKey, value: TValue;
            if (Type.isArrayLike(item)) {
                assertTuple(item);
                key = item[0];
                value = assertNotUndefined(item[1], ITEM_1);
            }
            else if (isKeyValuePair<TKey, TValue>(item)) {
                key = assertKey(item.key);
                value = assertNotUndefined(item.value, ITEM_VALUE);
            }
            else {
                throw new Exceptions.ArgumentException(ITEM, INVALID_KVP_MESSAGE);
            }

            return to(key, value);
        }
    }

    export function Integer(n: number): number {
        return Math.floor(n);
    }

    export module Integer {
        export const MAX_32_BIT: number = 2147483647;
        export const MAX_VALUE: number = 9007199254740991;
        const NUMBER: TypeValue.Number = "number";

        /**
         * Converts any number to its 32bit counterpart.
         * Throws if conversion is not possible.
         * @param n
         * @returns {number}
         */
        export function as32Bit(n: number): number {
            const result = n | 0;
            if (isNaN(n))
                throw "'n' is not a number.";
            if (n !== -1 && result === -1)
                throw "'n' is too large to be a 32 bit integer.";
            return result;
        }


        /**
         * Returns true if the value is an integer.
         * @param n
         * @returns {boolean}
         */
        export function is(n: number): boolean {
            return typeof n === NUMBER && isFinite(n) && n === Math.floor(n);
        }

        /**
         * Returns true if the value is within a 32 bit range.
         * @param n
         * @returns {boolean}
         */
        export function is32Bit(n: number): boolean {
            return n === (n | 0);
        }


        /**
         * Throws if not an integer.
         * @param n
         * @param argumentName
         * @returns {boolean}
         */
        export function assert(n: number, argumentName?: string): true | never {
            let i = is(n);
            if (!i)
                throw new Exceptions.ArgumentException(argumentName || "n", "Must be a integer.");
            return i as true;
        }

        /**
         * Throws if less than zero.
         * @param n
         * @param argumentName
         * @returns {boolean}
         */
        export function assertZeroOrGreater(n: number, argumentName?: string): true | never {
            const i = assert(n, argumentName) && n >= 0;
            if (!i)
                throw new Exceptions.ArgumentOutOfRangeException(argumentName || "n", n, "Must be a valid integer greater than or equal to zero.");
            return i as true;
        }

        /**
         * Throws if not greater than zero.
         * @param n
         * @param argumentName
         * @returns {boolean}
         */
        export function assertPositive(n: number, argumentName?: string): true | never {
            const i = assert(n, argumentName) && n > 0;
            if (!i)
                throw new Exceptions.ArgumentOutOfRangeException(argumentName || "n", n, "Must be greater than zero.");
            return i as true;
        }

    }

    export class Functions {

        //noinspection JSMethodCanBeStatic
        /**
         * A typed method for use with simple selection of the parameter.
         * @returns {T}
         */
        Identity<T>(x: T): T
        { return x; }

        //noinspection JSMethodCanBeStatic
        /**
         * Returns true.
         * @returns {boolean}
         */
        True(): boolean
        { return true; }

        //noinspection JSMethodCanBeStatic
        /**
         * Returns false.
         * @returns {boolean}
         */
        False(): boolean
        { return false; }

        /**
         * Does nothing.
         */
        Blank(): void
        { }
    }

    const rootFunctions: Functions = new Functions();

    // Expose static versions.

    export module Functions {
        /**
         * A typed method for use with simple selection of the parameter.
         * @returns {boolean}
         */
        export const Identity: <T>(x: T) => T
            = rootFunctions.Identity;

        /**
         * Returns false.
         * @returns {boolean}
         */
        export const True: () => boolean
            = rootFunctions.True;

        /**
         * Returns false.
         * @returns {boolean}
         */
        export const False: () => boolean
            = rootFunctions.False;

        /**
         * Does nothing.
         */
        export const Blank: () => void
            = rootFunctions.Blank;
    }

    // Make this read only.  Should still allow for sub-classing since extra methods are added to prototype.
    Object.freeze(Functions);

    export namespace Exceptions {
        export class SystemException extends Exception {
            /*
                constructor(
                    message:string = null,
                    innerException:Error = null,
                    beforeSealing?:(ex:any)=>void)
                {
                    super(message, innerException, beforeSealing);
                }
            */

            protected getName(): string {
                return "SystemException";
            }
        }

        export class ArgumentException extends SystemException {

            paramName: string;

            // For simplicity and consistency, lets stick with 1 signature.
            constructor(
                paramName: string,
                message?: string,
                innerException?: Error,
                beforeSealing?: (ex: any) => void) {
                const pn = paramName ? (`{${paramName}} `) : "";
                super(trim(pn + (message || "")),
                    innerException,
                    (_) => {
                        _.paramName = paramName;
                        if (beforeSealing) beforeSealing(_);
                    });
            }


            protected getName(): string {
                return "ArgumentException";
            }

        }

        export class ArgumentNullException extends ArgumentException {
            constructor(
                paramName: string,
                message: string = `'${paramName}' is null (or undefined).`,
                innerException?: Error) {
                super(paramName, message, innerException);
            }

            protected getName(): string {
                return "ArgumentNullException";
            }
        }

        export class ArgumentOutOfRangeException extends ArgumentException {
            actualValue: Primitive | null | undefined;

            constructor(
                paramName: string,
                actualValue: Primitive | null | undefined,
                message: string = " ",
                innerException?: Error) {
                super(paramName,
                    `(${actualValue}) ` + message,
                    innerException,
                    (_) => {
                        _.actualValue = actualValue;
                    });
            }


            protected getName(): string {
                return "ArgumentOutOfRangeException";
            }

        }

        export class InvalidOperationException extends SystemException {

            protected getName(): string {
                return "InvalidOperationException";
            }
        }

        export class NullReferenceException extends SystemException {
            protected getName(): string {
                return "NullReferenceException";
            }
        }

        export class NotImplementedException extends SystemException {

            protected getName(): string {
                return "NotImplementedException";
            }

        }
    }

    export namespace Disposable {
        export interface IDisposable {
            dispose(): void;
        }

        export interface IDisposableAware extends IDisposable {
            wasDisposed: boolean;
        }

        export class ObjectDisposedException extends Exceptions.InvalidOperationException {

            readonly objectName: string;

            // For simplicity and consistency, lets stick with 1 signature.
            constructor(
                objectName: string,
                message?: string,
                innerException?: Error) {
                super(message || "",
                    innerException,
                    (_) => {
                        (_ as any).objectName = objectName;
                    });
            }


            protected getName(): string {
                return "ObjectDisposedException";
            }

            toString(): string {
                const _ = this;
                let oName = _.objectName;
                oName = oName ? (`{${oName}} `) : "";

                return `[${_.name}: ${oName}${_.message}]`;
            }

            static throwIfDisposed(
                disposable: IDisposableAware,
                objectName: string,
                message?: string): true | never {
                if (disposable.wasDisposed)
                    throw new ObjectDisposedException(objectName, message);
                return true;
            }

        }

        export abstract class DisposableBase implements IDisposableAware {

            constructor(private readonly __finalizer?: Closure | null) {
            }

            private __wasDisposed: boolean = false;

            get wasDisposed(): boolean {
                return this.__wasDisposed;
            }

            // Allow for simple override of name.
            protected _disposableObjectName: string;

            protected throwIfDisposed(
                message?: string,
                objectName: string = this._disposableObjectName): true | never {
                if (this.__wasDisposed)
                    throw new ObjectDisposedException(objectName, message);
                return true;
            }


            dispose(): void {
                const _ = this;
                if (!_.__wasDisposed) {
                    // Preemptively set wasDisposed in order to prevent repeated disposing.
                    // NOTE: in true multi-threaded scenarios, this needs to be synchronized.
                    _.__wasDisposed = true;
                    try {
                        _._onDispose(); // Protected override.
                    } finally {
                        if (_.__finalizer) // Private finalizer...
                        {
                            _.__finalizer();
                            (_ as any).__finalizer = void 0;
                        }
                    }
                }
            }

            // Placeholder for overrides.
            protected _onDispose(): void { }

        }

        // Allows for more flexible parameters.
        export type DisposableItem = IDisposable | null | undefined;
        export type DisposableItemArray = Array<DisposableItem> | null | undefined;

        /**
         * Takes any number of disposables as arguments and attempts to dispose them.
         * Any exceptions thrown within a dispose are not trapped.
         * Use 'disposeWithoutException' to automatically trap exceptions.
         *
         * Can accept <any> and will ignore objects that don't have a dispose() method.
         * @param disposables
         */
        export function dispose(...disposables: DisposableItem[]): void {
            // The disposables arguments array is effectively localized so it's safe.
            disposeTheseInternal(disposables, false);
        }

        export module dispose {

            /**
             * Use this when only disposing one object to avoid creation of arrays.
             * @param disposable
             * @param trapExceptions
             */
            export function single(disposable: DisposableItem, trapExceptions: boolean = false): void {
                if (disposable)
                    disposeSingle(disposable, trapExceptions);
            }

            export function deferred(...disposables: DisposableItem[]): void {
                these.deferred(disposables);
            }


            /**
             * Takes any number of disposables and traps any errors that occur when disposing.
             * Returns an array of the exceptions thrown.
             * @param disposables
             * @returns {any[]} Returns an array of exceptions that occurred, if there are any.
             */
            export function withoutException(...disposables: DisposableItem[]): any[] | undefined {
                // The disposables arguments array is effectively localized so it's safe.
                return disposeTheseInternal(disposables, true);
            }

            /**
             * Takes an array of disposable objects and ensures they are disposed.
             * @param disposables
             * @param trapExceptions If true, prevents exceptions from being thrown when disposing.
             * @returns {any[]} If 'trapExceptions' is true, returns an array of exceptions that occurred, if there are any.
             */
            export function these(disposables: DisposableItemArray, trapExceptions?: boolean): any[] | undefined {
                return disposables && disposables.length
                    ? disposeTheseInternal(disposables.slice(), trapExceptions)
                    : void 0;
            }

            export module these {
                export function deferred(disposables: DisposableItemArray, delay: number = 0): void {
                    if (disposables && disposables.length) {
                        if (!(delay >= 0)) delay = 0;
                        setTimeout(disposeTheseInternal, delay, disposables.slice(), true);
                    }
                }

                /**
                 * Use this unsafe method when guaranteed not to cause events that will make modifications to the disposables array.
                 * @param disposables
                 * @param trapExceptions
                 * @returns {any[]}
                 */
                export function noCopy(disposables: DisposableItemArray, trapExceptions?: boolean): any[] | undefined {
                    return disposables && disposables.length
                        ? disposeTheseInternal(disposables, trapExceptions)
                        : void 0;
                }
            }

        }

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
        export function using<TDisposable extends IDisposable, TReturn>(
            disposable: TDisposable,
            closure: (disposable: TDisposable) => TReturn): TReturn {
            try {
                return closure(disposable);
            }
            finally {
                disposeSingle(disposable, false);
            }
        }


        /**
         * This private function makes disposing more robust for when there's no type checking.
         * If trapExceptions is 'true' it catches and returns any exception instead of throwing.
         */
        export function disposeSingle(
            disposable: IDisposable,
            trapExceptions: boolean): any {
            if (
                disposable
                && typeof disposable == Type.OBJECT
                && typeof disposable["dispose"] == "function"
            ) {
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

        /**
         * This dispose method assumes it's working on a local arrayCopy and is unsafe for external use.
         */
        function disposeTheseInternal(
            disposables: DisposableItemArray,
            trapExceptions?: boolean,
            index: number = 0): any[] | undefined {
            let exceptions: any[] | undefined;
            const len = disposables ? disposables.length : 0;

            for (; index < len; index++) {
                const next = disposables![index];
                if (!next) continue;
                if (trapExceptions) {
                    const ex = disposeSingle(next, true);
                    if (ex) {
                        if (!exceptions) exceptions = [];
                        exceptions.push(ex);
                    }
                }
                else {
                    let success = false;
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
                    if (!success) break;
                }
            }

            return exceptions;
        }

        const
            OBJECT_POOL = "ObjectPool",
            _MAX_SIZE = "_maxSize",
            ABSOLUTE_MAX_SIZE = 65536,
            MUST_BE_GT1 = "Must be at valid number least 1.",
            MUST_BE_LTM = `Must be less than or equal to ${ABSOLUTE_MAX_SIZE}.`;

        export class ObjectPool<T> extends DisposableBase {

            private _pool: T[];
            private _trimmer: Threading.Tasks.TaskHandler;
            private _flusher: Threading.Tasks.TaskHandler;
            private _autoFlusher: Threading.Tasks.TaskHandler;

            /**
             * A transient amount of object to exist over _maxSize until trim() is called.
             * But any added objects over _localAbsMaxSize will be disposed immediately.
             */
            private _localAbsMaxSize: number;

            /**
             * By default will clear after 5 seconds of non-use.
             */
            autoClearTimeout: number = 5000;

            constructor(
                private _maxSize: number,
                private _generator?: (...args: any[]) => T,
                private _recycler?: (o: T) => void) {
                super();
                if (isNaN(_maxSize) || _maxSize < 1)
                    throw new Exceptions.ArgumentOutOfRangeException(_MAX_SIZE, _maxSize, MUST_BE_GT1);
                if (_maxSize > ABSOLUTE_MAX_SIZE)
                    throw new Exceptions.ArgumentOutOfRangeException(_MAX_SIZE, _maxSize, MUST_BE_LTM);

                this._localAbsMaxSize = Math.min(_maxSize * 2, ABSOLUTE_MAX_SIZE);

                const _ = this;
                _._disposableObjectName = OBJECT_POOL;
                _._pool = [];
                _._trimmer = new Threading.Tasks.TaskHandler(() => _._trim());
                const clear = () => _._clear();
                _._flusher = new Threading.Tasks.TaskHandler(clear);
                _._autoFlusher = new Threading.Tasks.TaskHandler(clear);
            }

            /**
             * Defines the maximum at which trimming should allow.
             * @returns {number}
             */
            get maxSize(): number {
                return this._maxSize;
            }

            /**
             * Current number of objects in pool.
             * @returns {number}
             */
            get count(): number {
                const p = this._pool;
                return p ? p.length : 0;
            }

            protected _trim(): void {
                const pool = this._pool;
                while (pool.length > this._maxSize) {
                    dispose.single(pool.pop() as any, true);
                }
            }

            /**
             * Will trim ensure the pool is less than the maxSize.
             * @param defer A delay before trimming.  Will be overridden by later calls.
             */
            trim(defer?: number): void {
                this.throwIfDisposed();
                this._trimmer.start(defer);
            }

            protected _clear(): void {
                const _ = this;
                const p = _._pool;
                _._trimmer.cancel();
                _._flusher.cancel();
                _._autoFlusher.cancel();
                dispose.these.noCopy(p as any, true);
                p.length = 0;
            }

            /**
             * Will clear out the pool.
             * Cancels any scheduled trims when executed.
             * @param defer A delay before clearing.  Will be overridden by later calls.
             */
            clear(defer?: number): void {
                this.throwIfDisposed();
                this._flusher.start(defer);
            }

            toArrayAndClear(): T[] {
                const _ = this;
                _.throwIfDisposed();
                _._trimmer.cancel();
                _._flusher.cancel();
                const p = _._pool;
                _._pool = [];
                return p;
            }

            /**
             * Shortcut for toArrayAndClear();
             */
            dump(): T[] {
                return this.toArrayAndClear();
            }


            protected _onDispose(): void {
                super._onDispose();
                const _: any = this;
                _._generator = null;
                _._recycler = null;
                dispose(
                    _._trimmer,
                    _._flusher,
                    _._autoFlusher
                );
                _._trimmer = null;
                _._flusher = null;
                _._autoFlusher = null;

                _._pool.length = 0;
                _._pool = null;
            }

            extendAutoClear(): void {
                const _ = this;
                _.throwIfDisposed();
                const t = _.autoClearTimeout;
                if (isFinite(t) && !_._autoFlusher.isScheduled)
                    _._autoFlusher.start(t);
            }

            add(o: T): void {
                const _ = this;
                _.throwIfDisposed();
                if (_._pool.length >= _._localAbsMaxSize) {
                    // Getting too big, dispose immediately...
                    dispose(o as any);
                }
                else {
                    if (_._recycler) _._recycler(o);
                    _._pool.push(o);
                    const m = _._maxSize;
                    if (m < ABSOLUTE_MAX_SIZE && _._pool.length > m)
                        _._trimmer.start(500);
                }
                _.extendAutoClear();

            }

            private _onTaken(): void {
                const _ = this, len = _._pool.length;
                if (len <= _._maxSize)
                    _._trimmer.cancel();
                if (len)
                    _.extendAutoClear();
            }

            tryTake(): T | undefined {
                const _ = this;
                _.throwIfDisposed();

                try {
                    return _._pool.pop();
                }
                finally {
                    _._onTaken();
                }
            }

            take(factory?: () => T): T {
                const _ = this;
                _.throwIfDisposed();
                if (!_._generator && !factory)
                    throw new Exceptions.ArgumentException("factory", "Must provide a factory if on was not provided at construction time.");

                try {
                    return _._pool.pop() || factory && factory() || _._generator!();
                }
                finally {
                    _._onTaken();
                }
            }
        }
    }
    
    export namespace Promises {
        const VOID0: any = void 0, NULL: any = null, PROMISE = "Promise", PROMISE_STATE = PROMISE + "State", THEN = "then", TARGET = "target";

        function isPromise<T>(value: any): value is PromiseLike<T> {
            return Type.hasMemberOfType(value, THEN, Type.FUNCTION);
        }

        function resolve<T>(
            value: Promise.Resolution<T>,
            resolver: (v: Promise.Resolution<T>) => any,
            promiseFactory: (v: any) => PromiseBase<any>): PromiseBase<any> {
            let nextValue = resolver
                ? resolver(value)
                : value;

            return nextValue && isPromise(nextValue)
                ? Promise.wrap(nextValue)
                : promiseFactory(nextValue);
        }

        function handleResolution(
            p: Promise<any> | null | undefined,
            value: Promise.Resolution<any>,
            resolver?: (v: Promise.Resolution<any>) => any): any {
            try {
                let v = resolver ? resolver(value) : value;
                if (p) p.resolve(v);
                return null;
            } catch (ex) {
                if (p) p.reject(ex);
                return ex;
            }
        }

        function handleResolutionMethods(
            targetFulfill: Promise.Fulfill<any, any> | null | undefined,
            targetReject: Promise.Reject<any> | null | undefined,
            value: Promise.Resolution<any>,
            resolver?: (v: Promise.Resolution<any>) => any): void {
            try {
                let v = resolver ? resolver(value) : value;
                if (targetFulfill) targetFulfill(v);
            } catch (ex) {
                if (targetReject) targetReject(ex);
            }
        }

        function handleDispatch<T, TResult>(
            p: PromiseLike<T>,
            onFulfilled: Promise.Fulfill<T, TResult>,
            onRejected?: Promise.Reject<TResult>): void {
            if (p instanceof PromiseBase)
                p.thenThis(onFulfilled, onRejected);
            else
                p.then(onFulfilled as any, onRejected);
        }

        function handleSyncIfPossible<T, TResult>(
            p: PromiseLike<T>,
            onFulfilled: Promise.Fulfill<T, TResult>,
            onRejected?: Promise.Reject<TResult>): PromiseLike<TResult> {
            if (p instanceof PromiseBase)
                return p.thenSynchronous(onFulfilled, onRejected) as any;
            else
                return p.then(onFulfilled as any, onRejected) as any;
        }

        function newODE() {
            return new Disposable.ObjectDisposedException("Promise", "An underlying promise-result was disposed.");
        }

        export class PromiseState<T> extends Disposable.DisposableBase {

            constructor(
                protected _state: Promise.State,
                protected _result?: T,
                protected _error?: any) {
                super();
                this._disposableObjectName = PROMISE_STATE;
            }

            protected _onDispose(): void {
                this._state = VOID0;
                this._result = VOID0;
                this._error = VOID0;
            }

            protected getState(): Promise.State {
                return this._state;
            }

            get state(): Promise.State {
                return this._state;
            }

            get isPending(): boolean {
                return this.getState() === Promise.State.Pending;
            }

            get isSettled(): boolean {
                return this
                    .getState() !=
                    Promise.State.Pending; // Will also include undefined==0 aka disposed!=resolved.
            }

            get isFulfilled(): boolean {
                return this.getState() === Promise.State.Fulfilled;
            }

            get isRejected(): boolean {
                return this.getState() === Promise.State.Rejected;
            }

            /*
             * Providing overrides allows for special defer or lazy sub classes.
             */
            protected getResult(): T | undefined {
                return this._result;
            }

            get result(): T | undefined {
                this.throwIfDisposed();
                return this.getResult();
            }

            protected getError(): any {
                return this._error;
            }

            get error(): any {
                this.throwIfDisposed();
                return this.getError();
            }

        }

        export abstract class PromiseBase<T>
            extends PromiseState<T> implements PromiseLike<T> {
            constructor() {
                super(Promise.State.Pending);
                this._disposableObjectName = PROMISE;
            }

            /**
             * Calls the respective handlers once the promise is resolved.
             * @param onFulfilled
             * @param onRejected
             */
            abstract thenSynchronous<TResult>(
                onFulfilled: Promise.Fulfill<T, TResult>,
                onRejected?: Promise.Reject<TResult>): PromiseBase<TResult>;

            /**
             * Same as 'thenSynchronous' but does not return the result.  Returns the current promise instead.
             * You may not need an additional promise result, and this will not create a new one.
             * @param onFulfilled
             * @param onRejected
             */
            abstract thenThis(
                onFulfilled: Promise.Fulfill<T, any>,
                onRejected?: Promise.Reject<any>): this;

            abstract thenThis(
                onFulfilled: (v?: T) => any,
                onRejected?: (v?: any) => any): this;


            /**
             * Standard .then method that defers execution until resolved.
             * @param onFulfilled
             * @param onRejected
             * @returns {Promise}
             */
            then<TResult>(onFulfilled?, onRejected?) {
                this.throwIfDisposed();

                return new Promise<TResult>((resolve, reject) => {
                    this.thenThis(
                        result =>
                            handleResolutionMethods(resolve, reject, result, onFulfilled),
                        error =>
                            onRejected
                                ? handleResolutionMethods(resolve, reject, error, onRejected)
                                : reject(error)
                    );
                });
            }

            /**
             * Same as .then but doesn't trap errors.  Exceptions may end up being fatal.
             * @param onFulfilled
             * @param onRejected
             * @returns {Promise}
             */
            thenAllowFatal<TResult>(
                onFulfilled: Promise.Fulfill<T, TResult>,
                onRejected?: Promise.Reject<TResult>): PromiseBase<TResult> {
                this.throwIfDisposed();

                return new Promise<TResult>((resolve, reject) => {
                    this.thenThis(
                        result =>
                            resolve((onFulfilled ? onFulfilled(result) : result) as any),
                        error =>
                            reject(onRejected ? onRejected(error) : error)
                    );
                });
            }

            /**
             * .done is provided as a non-standard means that maps to similar functionality in other promise libraries.
             * As stated by promisejs.org: 'then' is to 'done' as 'map' is to 'forEach'.
             * @param onFulfilled
             * @param onRejected
             */
            done(
                onFulfilled: Promise.Fulfill<T, any>,
                onRejected?: Promise.Reject<any>): void {
                Threading.defer(() =>
                    this.thenThis(onFulfilled, onRejected));
            }

            /**
             * Will yield for a number of milliseconds from the time called before continuing.
             * @param milliseconds
             * @returns A promise that yields to the current execution and executes after a delay.
             */
            delayFromNow(milliseconds: number = 0): PromiseBase<T> {
                this.throwIfDisposed();

                return new Promise<T>(
                    (resolve, reject) => {
                        Threading.defer(() => {
                            this.thenThis(
                                v => resolve(v),
                                e => reject(e));
                        },
                            milliseconds);
                    },
                    true // Since the resolve/reject is deferred.
                );
            }

            /**
             * Will yield for a number of milliseconds from after this promise resolves.
             * If the promise is already resolved, the delay will start from now.
             * @param milliseconds
             * @returns A promise that yields to the current execution and executes after a delay.
             */
            delayAfterResolve(milliseconds: number = 0): PromiseBase<T> {
                this.throwIfDisposed();

                if (this.isSettled) return this.delayFromNow(milliseconds);

                return new Promise<T>(
                    (resolve, reject) => {
                        this.thenThis(
                            v => Threading.defer(() => resolve(v), milliseconds),
                            e => Threading.defer(() => reject(e), milliseconds));
                    },
                    true // Since the resolve/reject is deferred.
                );
            }

            /**
             * Shortcut for trapping a rejection.
             * @param onRejected
             * @returns {PromiseBase<TResult>}
             */
            'catch'<TResult>(onRejected: Promise.Reject<TResult>): PromiseBase<TResult> {
                return this.then(VOID0, onRejected);
            }

            /**
             * Shortcut for trapping a rejection but will allow exceptions to propagate within the onRejected handler.
             * @param onRejected
             * @returns {PromiseBase<TResult>}
             */
            catchAllowFatal<TResult>(onRejected: Promise.Reject<TResult>): PromiseBase<TResult> {
                return this.thenAllowFatal(VOID0, onRejected);
            }

            /**
             * Shortcut to for handling either resolve or reject.
             * @param fin
             * @returns {PromiseBase<TResult>}
             */
            'finally'<TResult>(fin: () => Promise.Resolution<TResult>): PromiseBase<TResult> {
                return this.then(fin, fin);
            }

            /**
             * Shortcut to for handling either resolve or reject but will allow exceptions to propagate within the handler.
             * @param fin
             * @returns {PromiseBase<TResult>}
             */
            finallyAllowFatal<TResult>(fin: () => Promise.Resolution<TResult>): PromiseBase<TResult> {
                return this.thenAllowFatal(fin, fin);
            }

            /**
             * Shortcut to for handling either resolve or reject.  Returns the current promise instead.
             * You may not need an additional promise result, and this will not create a new one.
             * @param fin
             * @param synchronous
             * @returns {PromiseBase}
             */
            finallyThis(fin: Closure, synchronous?: boolean): this {
                this.throwIfDisposed();
                const f: Closure = synchronous ? fin : () => Threading.deferImmediate(fin);
                this.thenThis(f, f);
                return this;
            }

        }

        export abstract class Resolvable<T> extends PromiseBase<T> {

            thenSynchronous<TResult>(
                onFulfilled: Promise.Fulfill<T, TResult>,
                onRejected?: Promise.Reject<TResult>): PromiseBase<TResult> {
                this.throwIfDisposed();

                try {
                    switch (this.state) {
                        case Promise.State.Fulfilled:
                            return onFulfilled
                                ? resolve(this._result, onFulfilled, Promise.resolve)
                                : (this as any); // Provided for catch cases.
                        case Promise.State.Rejected:
                            return onRejected
                                ? resolve(this._error, onRejected, Promise.resolve)
                                : (this as any);
                    }
                } catch (ex) {
                    return new Rejected<any>(ex);
                }

                throw new Error("Invalid state for a resolved promise.");
            }

            thenThis(
                onFulfilled: (v?: T) => any,
                onRejected?: (v?: any) => any): this {
                this.throwIfDisposed();

                switch (this.state) {
                    case Promise.State.Fulfilled:
                        if (onFulfilled) onFulfilled(this._result);
                        break;
                    case Promise.State.Rejected:
                        if (onRejected) onRejected(this._error);
                        break;
                }

                return this;
            }

        }

        /**
         * The simplest usable version of a promise which returns synchronously the resolved state provided.
         */
        export abstract class Resolved<T> extends Resolvable<T> {
            constructor(state: Promise.State, result: T, error?: any) {
                super();
                this._result = result;
                this._error = error;
                this._state = state;
            }


        }

        /**
         * A fulfilled Resolved<T>.  Provided for readability.
         */
        export class Fulfilled<T> extends Resolved<T> {
            constructor(value: T) {
                super(Promise.State.Fulfilled, value);
            }
        }

        /**
         * A rejected Resolved<T>.  Provided for readability.
         */
        export class Rejected<T> extends Resolved<T> {
            constructor(error: any) {
                super(Promise.State.Rejected, VOID0, error);
            }
        }


        /**
         * Provided as a means for extending the interface of other PromiseLike<T> objects.
         */
        class PromiseWrapper<T> extends Resolvable<T> {
            constructor(private _target: PromiseLike<T>) {
                super();

                if (!_target)
                    throw new Exceptions.ArgumentNullException(TARGET);

                if (!isPromise(_target))
                    throw new Exceptions.ArgumentException(TARGET, "Must be a promise-like object.");

                _target.then(
                    (v: T) => {
                        this._state = Promise.State.Fulfilled;
                        this._result = v;
                        this._error = VOID0;
                        this._target = VOID0;
                    },
                    e => {
                        this._state = Promise.State.Rejected;
                        this._error = e;
                        this._target = VOID0;
                    });
            }

            thenSynchronous<TResult>(
                onFulfilled: Promise.Fulfill<T, TResult>,
                onRejected?: Promise.Reject<TResult>): PromiseBase<TResult> {
                this.throwIfDisposed();

                let t = this._target;
                if (!t) return super.thenSynchronous(onFulfilled, onRejected);

                return new Promise<TResult>((resolve, reject) => {
                    handleDispatch(t,
                        result => handleResolutionMethods(resolve, reject, result, onFulfilled),
                        error => onRejected
                            ? handleResolutionMethods(resolve, null, error, onRejected)
                            : reject(error)
                    );
                },
                    true);
            }


            thenThis(
                onFulfilled: (v?: T) => any,
                onRejected?: (v?: any) => any): this {
                this.throwIfDisposed();

                let t = this._target;
                if (!t) return super.thenThis(onFulfilled, onRejected) as any;
                handleDispatch(t, onFulfilled, onRejected);
                return this;
            }

            protected _onDispose(): void {
                super._onDispose();
                this._target = VOID0;
            }

        }


        /**
         * This promise class that facilitates pending resolution.
         */
        export class Promise<T> extends Resolvable<T> {

            private _waiting: IPromiseCallbacks<any>[] | null | undefined;

            /*
             * A note about deferring:
             * The caller can set resolveImmediate to true if they intend to initialize code that will end up being deferred itself.
             * This eliminates the extra defer that will occur internally.
             * But for the most part, resolveImmediate = false (the default) will ensure the constructor will not block.
             *
             * resolveUsing allows for the same ability but does not defer by default: allowing the caller to take on the work load.
             * If calling resolve or reject and a deferred response is desired, then use deferImmediate with a closure to do so.
             */

            constructor(
                resolver?: Promise.Executor<T>,
                forceSynchronous: boolean = false) {
                super();

                if (resolver) this.resolveUsing(resolver, forceSynchronous);
            }


            thenSynchronous<TResult>(
                onFulfilled: Promise.Fulfill<T, TResult>,
                onRejected?: Promise.Reject<TResult>): PromiseBase<TResult> {
                this.throwIfDisposed();

                // Already fulfilled?
                if (this._state) return super.thenSynchronous(onFulfilled, onRejected);

                const p = new Promise<TResult>();
                (this._waiting || (this._waiting = []))
                    .push(pools.PromiseCallbacks.init(onFulfilled, onRejected, p));
                return p;
            }

            thenThis(
                onFulfilled: (v?: T) => any,
                onRejected?: (v?: any) => any): this {
                this.throwIfDisposed();

                // Already fulfilled?
                if (this._state)
                    return super.thenThis(onFulfilled, onRejected) as any;

                (this._waiting || (this._waiting = []))
                    .push(pools.PromiseCallbacks.init(onFulfilled, onRejected));

                return this;
            }


            protected _onDispose() {
                super._onDispose();
                this._resolvedCalled = VOID0;
            }

            // Protects against double calling.
            protected _resolvedCalled: boolean;

            resolveUsing(
                resolver: Promise.Executor<T>,
                forceSynchronous: boolean = false): void {
                if (!resolver)
                    throw new Exceptions.ArgumentNullException("resolver");
                if (this._resolvedCalled)
                    throw new Exceptions.InvalidOperationException(".resolve() already called.");
                if (this.state)
                    throw new Exceptions.InvalidOperationException(`Already resolved: ${Promise.State[this.state]}`);

                this._resolvedCalled = true;

                let state = 0;
                const rejectHandler = (reason: any) => {
                    if (state) {
                        // Someone else's promise handling down stream could double call this. :\
                        console.warn(state == -1
                            ? "Rejection called multiple times"
                            : "Rejection called after fulfilled.");
                    } else {
                        state = -1;
                        this._resolvedCalled = false;
                        this.reject(reason);
                    }
                };

                const fulfillHandler = (v: any) => {
                    if (state) {
                        // Someone else's promise handling down stream could double call this. :\
                        console.warn(state == 1
                            ? "Fulfill called multiple times"
                            : "Fulfill called after rejection.");
                    } else {
                        state = 1;
                        this._resolvedCalled = false;
                        this.resolve(v);
                    }
                };

                // There are some performance edge cases where there caller is not blocking upstream and does not need to defer.
                if (forceSynchronous)
                    resolver(fulfillHandler, rejectHandler);
                else
                    Threading.deferImmediate(() => resolver(fulfillHandler, rejectHandler));

            }


            private _emitDisposalRejection(p: PromiseBase<any>): boolean {
                const d = p.wasDisposed;
                if (d) this._rejectInternal(newODE());
                return d;
            }

            private _resolveInternal(result?: T | PromiseLike<T>): void {
                if (this.wasDisposed) return;

                // Note: Avoid recursion if possible.

                // Check ahead of time for resolution and resolve appropriately
                while (result instanceof PromiseBase) {
                    let r: PromiseBase<T> = result as any;
                    if (this._emitDisposalRejection(r)) return;
                    switch (r.state) {
                        case Promise.State.Pending:
                            r.thenSynchronous(
                                v => this._resolveInternal(v),
                                e => this._rejectInternal(e)
                            );
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
                    result.then(
                        v => this._resolveInternal(v),
                        e => this._rejectInternal(e)
                    );
                } else {
                    this._state = Promise.State.Fulfilled;

                    this._result = result;
                    this._error = VOID0;
                    const o = this._waiting;
                    if (o) {
                        this._waiting = VOID0;
                        for (let c of o) {
                            let { onFulfilled, promise } = c;
                            pools.PromiseCallbacks.recycle(c);
                            //let ex =
                            handleResolution(promise as any, result, onFulfilled);
                            //if(!p && ex) console.error("Unhandled exception in onFulfilled:",ex);
                        }
                        o.length = 0;
                    }
                }
            }

            private _rejectInternal(error: any): void {

                if (this.wasDisposed) return;

                this._state = Promise.State.Rejected;

                this._error = error;
                const o = this._waiting;
                if (o) {
                    this._waiting = null; // null = finished. undefined = hasn't started.
                    for (let c of o) {
                        let { onRejected, promise } = c;
                        pools.PromiseCallbacks.recycle(c);
                        if (onRejected) {
                            //let ex =
                            handleResolution(promise, error, onRejected);
                            //if(!p && ex) console.error("Unhandled exception in onRejected:",ex);
                        } else if (promise) promise.reject(error);
                    }
                    o.length = 0;
                }
            }

            resolve(result?: T | PromiseLike<T>, throwIfSettled: boolean = false): void {
                this.throwIfDisposed();
                if ((result as any) == this)
                    throw new Exceptions.InvalidOperationException("Cannot resolve a promise as itself.");

                if (this._state) {
                    // Same value? Ignore...
                    if (!throwIfSettled || this._state == Promise.State.Fulfilled && this._result === result) return;
                    throw new
                        Exceptions.InvalidOperationException("Changing the fulfilled state/value of a promise is not supported.");
                }

                if (this._resolvedCalled) {
                    if (throwIfSettled)
                        throw new Exceptions.InvalidOperationException(".resolve() already called.");
                    return;
                }

                this._resolveInternal(result);
            }


            reject(error: any, throwIfSettled: boolean = false): void {
                this.throwIfDisposed();
                if (this._state) {
                    // Same value? Ignore...
                    if (!throwIfSettled || this._state == Promise.State.Rejected && this._error === error) return;
                    throw new
                        Exceptions.InvalidOperationException("Changing the rejected state/value of a promise is not supported.");
                }

                if (this._resolvedCalled) {
                    if (throwIfSettled)
                        throw new Exceptions.InvalidOperationException(".resolve() already called.");
                    return;
                }

                this._rejectInternal(error);
            }
        }


        /**
         * By providing an ArrayPromise we expose useful methods/shortcuts for dealing with array results.
         */
        export class ArrayPromise<T> extends Promise<T[]> {

            /**
             * Simplifies the use of a map function on an array of results when the source is assured to be an array.
             * @param transform
             * @returns {PromiseBase<Array<any>>}
             */
            map<U>(transform: (value: T) => U): ArrayPromise<U> {
                this.throwIfDisposed();
                return new ArrayPromise<U>(resolve => {
                    this.thenThis((result: T[]) => resolve(result.map(transform)));
                },
                    true);
            }

            /**
             * Simplifies the use of a reduce function on an array of results when the source is assured to be an array.
             * @param reduction
             * @param initialValue
             * @returns {PromiseBase<any>}
             */
            reduce<U>(
                reduction: (previousValue: U, currentValue: T, i?: number, array?: T[]) => U,
                initialValue?: U): PromiseBase<U> {

                return this
                    .thenSynchronous((result: T[]) => result.reduce(reduction, initialValue));
            }

            static fulfilled<T>(value: T[]): ArrayPromise<T> {
                return new ArrayPromise<T>(resolve => value, true);
            }
        }

        const PROMISE_COLLECTION = "PromiseCollection";

        /**
         * A Promise collection exposes useful methods for handling a collection of promises and their results.
         */
        export class PromiseCollection<T> extends Disposable.DisposableBase {
            private _source: PromiseLike<T>[];

            constructor(source: PromiseLike<T>[] | null | undefined) {
                super();
                this._disposableObjectName = PROMISE_COLLECTION;
                this._source = source && source.slice() || [];
            }

            protected _onDispose() {
                super._onDispose();
                this._source.length = 0;
                (this as any)._source = null;
            }

            /**
             * Returns a copy of the source promises.
             * @returns {PromiseLike<PromiseLike<any>>[]}
             */
            get promises(): PromiseLike<T>[] {
                this.throwIfDisposed();
                return this._source.slice();
            }

            /**
             * Returns a promise that is fulfilled with an array containing the fulfillment value of each promise, or is rejected with the same rejection reason as the first promise to be rejected.
             * @returns {PromiseBase<any>}
             */
            all(): ArrayPromise<T> {
                this.throwIfDisposed();
                return Promise.all(this._source);
            }

            /**
             * Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
             * or rejected.
             * @returns {PromiseBase<any>} A new Promise.
             */
            race(): PromiseBase<T> {
                this.throwIfDisposed();
                return Promise.race(this._source);
            }

            /**
             * Returns a promise that is fulfilled with array of provided promises when all provided promises have resolved (fulfill or reject).
             * Unlike .all this method waits for all rejections as well as fulfillment.
             * @returns {PromiseBase<PromiseLike<any>[]>}
             */
            waitAll(): ArrayPromise<PromiseLike<T>> {
                this.throwIfDisposed();
                return Promise.waitAll(this._source);
            }

            /**
             * Waits for all the values to resolve and then applies a transform.
             * @param transform
             * @returns {PromiseBase<Array<any>>}
             */
            map<U>(transform: (value: T) => U): ArrayPromise<U> {
                this.throwIfDisposed();
                return new ArrayPromise<U>(resolve => {
                    this.all()
                        .thenThis((result: T[]) => resolve(result.map(transform)));
                },
                    true);
            }

            /**
             * Applies a transform to each promise and defers the result.
             * Unlike map, this doesn't wait for all promises to resolve, ultimately improving the async nature of the request.
             * @param transform
             * @returns {PromiseCollection<U>}
             */

            pipe<U>(transform: (value: T) => U | PromiseLike<U>): PromiseCollection<U> {
                this.throwIfDisposed();
                return new PromiseCollection<U>(this._source.map(p => handleSyncIfPossible(p, transform)));
            }

            /**
             * Behaves like array reduce.
             * Creates the promise chain necessary to produce the desired result.
             * @param reduction
             * @param initialValue
             * @returns {PromiseBase<PromiseLike<any>>}
             */
            reduce<U>(
                reduction: (previousValue: U, currentValue: T, i?: number, array?: PromiseLike<T>[]) => U,
                initialValue?: U | PromiseLike<U>): PromiseBase<U> {
                this.throwIfDisposed();
                return Promise.wrap(this._source
                    .reduce(
                    (
                        previous: PromiseLike<U>,
                        current: PromiseLike<T>,
                        i: number,
                        array: PromiseLike<T>[]) =>
                        handleSyncIfPossible(previous,
                            (p: U) => handleSyncIfPossible(current, (c: T) => reduction(p, c, i, array))),
                    isPromise(initialValue)
                        ? initialValue
                        : new Fulfilled(initialValue)
                    ) as any
                );
            }
        }

        module pools {

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


            export module PromiseCallbacks {

                let pool: Disposable.ObjectPool<IPromiseCallbacks<any>>;

                //noinspection JSUnusedLocalSymbols
                function getPool() {
                    return pool ||
                        (pool = new Disposable.ObjectPool<IPromiseCallbacks<any>>(40,
                            factory,
                            c => {
                                c.onFulfilled = NULL;
                                c.onRejected = NULL;
                                c.promise = NULL;
                            }));
                }

                function factory(): IPromiseCallbacks<any> {
                    return {
                        onFulfilled: NULL,
                        onRejected: NULL,
                        promise: NULL
                    };
                }

                export function init<T>(
                    onFulfilled: Promise.Fulfill<T, any>,
                    onRejected?: Promise.Reject<any>,
                    promise?: Promise<any>): IPromiseCallbacks<T> {

                    const c = getPool().take();
                    c.onFulfilled = onFulfilled;
                    c.onRejected = onRejected;
                    c.promise = promise;
                    return c;
                }

                export function recycle<T>(c: IPromiseCallbacks<T>): void {
                    getPool().add(c);
                }
            }
        }


        export module Promise {

            /**
             * The state of a promise.
             * https://github.com/domenic/promises-unwrapping/blob/master/docs/states-and-fates.md
             * If a promise is disposed the value will be undefined which will also evaluate (promise.state)==false.
             */
            export enum State {
                Pending = 0,
                Fulfilled = 1,
                Rejected = -1
            }

            Object.freeze(State);

            export type Resolution<TResult> = TResult | PromiseLike<TResult>;

            export interface Fulfill<T, TResult> {
                (value: T): Resolution<TResult>
            }

            export interface Reject<TResult> {
                (reason: any): TResult | PromiseLike<TResult>;
            }

            export interface Then<T, TResult> {
                (onfulfilled?: Fulfill<T, TResult>, onrejected?: Reject<TResult>): PromiseLike<TResult>;
                (onfulfilled?: Fulfill<T, TResult>, onrejected?: Reject<void>): PromiseLike<TResult>;
            }

            export interface Executor<T> {
                (
                    resolve: (value?: T | PromiseLike<T>) => void,
                    reject: (reason?: any) => void): void;
            }

            //noinspection JSUnusedGlobalSymbols
            export interface Factory {
                <T>(executor: Executor<T>): PromiseLike<T>;
            }

            export function factory<T>(e: Executor<T>): Promise<T> {
                return new Promise(e);
            }

            /**
             * Takes a set of promises and returns a PromiseCollection.
             * @param promises
             */
            export function group<T>(promises: PromiseLike<T>[]): PromiseCollection<T>;
            export function group<T>(
                promise: PromiseLike<T>,
                ...rest: PromiseLike<T>[]): PromiseCollection<T>;
            export function group(
                first: PromiseLike<any> | PromiseLike<any>[],
                ...rest: PromiseLike<any>[]): PromiseCollection<any> {

                if (!first && !rest.length) throw new Exceptions.ArgumentNullException("promises");
                return new PromiseCollection(
                    ((first) instanceof (Array) ? first : [first])
                        .concat(rest)
                );
            }

            /**
             * Returns a promise that is fulfilled with an array containing the fulfillment value of each promise, or is rejected with the same rejection reason as the first promise to be rejected.
             */
            export function all<T>(promises: PromiseLike<T>[]): ArrayPromise<T>;
            export function all<T>(promise: PromiseLike<T>, ...rest: PromiseLike<T>[]): ArrayPromise<T>;
            export function all(
                first: PromiseLike<any> | PromiseLike<any>[],
                ...rest: PromiseLike<any>[]): ArrayPromise<any> {
                if (!first && !rest.length) throw new Exceptions.ArgumentNullException("promises");
                let promises = ((first) instanceof (Array) ? first : [first]).concat(rest); // yay a copy!
                if (!promises.length || promises.every(v => !v))
                    return new ArrayPromise<any>(
                        r => r(promises),
                        true); // it's a new empty, reuse it. :|

                // Eliminate deferred and take the parent since all .then calls happen on next cycle anyway.
                return new ArrayPromise<any>((resolve, reject) => {
                    const result: any[] = [];
                    const len = promises.length;
                    result.length = len;
                    // Using a set instead of -- a number is more reliable if just in case one of the provided promises resolves twice.
                    let remaining = new Collections.Set(promises.map((v, i) => i)); // get all the indexes...

                    const cleanup = () => {
                        reject = VOID0;
                        resolve = VOID0;
                        promises.length = 0;
                        promises = VOID0;
                        remaining.dispose();
                        remaining = VOID0;
                    };

                    const checkIfShouldResolve = () => {
                        const r = resolve;
                        if (r && !remaining.count) {
                            cleanup();
                            r(result);
                        }
                    };

                    const onFulfill = (v: any, i: number) => {
                        if (resolve) {
                            result[i] = v;
                            remaining.remove(i);
                            checkIfShouldResolve();
                        }
                    };

                    const onReject = (e?: any) => {
                        const r = reject;
                        if (r) {
                            cleanup();
                            r(e);
                        }
                    };

                    for (let i = 0; remaining && i < len; i++) {
                        const p = promises[i];
                        if (p) p.then(v => onFulfill(v, i), onReject);
                        else remaining.remove(i);
                        checkIfShouldResolve();
                    }
                });
            }

            /**
             * Returns a promise that is fulfilled with array of provided promises when all provided promises have resolved (fulfill or reject).
             * Unlike .all this method waits for all rejections as well as fulfillment.
             */
            export function waitAll<T>(promises: PromiseLike<T>[]): ArrayPromise<PromiseLike<T>>;
            export function waitAll<T>(
                promise: PromiseLike<T>,
                ...rest: PromiseLike<T>[]): ArrayPromise<PromiseLike<T>>;
            export function waitAll(
                first: PromiseLike<any> | PromiseLike<any>[],
                ...rest: PromiseLike<any>[]): ArrayPromise<PromiseLike<any>> {
                if (!first && !rest.length) throw new Exceptions.ArgumentNullException("promises");
                const promises = ((first) instanceof (Array) ? first : [first]).concat(rest); // yay a copy!
                if (!promises.length || promises.every(v => !v))
                    return new ArrayPromise<any>(
                        r => r(promises),
                        true); // it's a new empty, reuse it. :|


                // Eliminate deferred and take the parent since all .then calls happen on next cycle anyway.
                return new ArrayPromise<any>((resolve, reject) => {
                    let len = promises.length;

                    // Using a set instead of -- a number is more reliable if just in case one of the provided promises resolves twice.
                    let remaining = new Collections.Set(promises.map((v, i) => i)); // get all the indexes...

                    let cleanup = () => {
                        reject = NULL;
                        resolve = NULL;
                        remaining.dispose();
                        remaining = NULL;
                    };

                    let checkIfShouldResolve = () => {
                        let r = resolve;
                        if (r && !remaining.count) {
                            cleanup();
                            r(promises);
                        }
                    };

                    let onResolved = (i: number) => {
                        if (remaining) {
                            remaining.remove(i);
                            checkIfShouldResolve();
                        }
                    };

                    for (let i = 0; remaining && i < len; i++) {
                        let p = promises[i];
                        if (p) p.then(v => onResolved(i), e => onResolved(i));
                        else onResolved(i);
                    }
                });

            }

            /**
             * Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
             * or rejected.
             * @param promises An array of Promises.
             * @returns A new Promise.
             */
            export function race<T>(promises: PromiseLike<T>[]): PromiseBase<T>;
            export function race<T>(promise: PromiseLike<T>, ...rest: PromiseLike<T>[]): PromiseBase<T>;
            export function race(
                first: PromiseLike<any> | PromiseLike<any>[],
                ...rest: PromiseLike<any>[]): PromiseBase<any> {
                let promises = first && ((first) instanceof (Array) ? first : [first]).concat(rest); // yay a copy?
                if (!promises || !promises.length || !(promises = promises.filter(v => v != null)).length)
                    throw new Exceptions.ArgumentException("Nothing to wait for.");

                const len = promises.length;

                // Only one?  Nothing to race.
                if (len == 1) return wrap(promises[0]);

                // Look for already resolved promises and the first one wins.
                for (let i = 0; i < len; i++) {
                    const p: any = promises[i];
                    if (p instanceof PromiseBase && p.isSettled) return p;
                }

                return new Promise((resolve, reject) => {
                    let cleanup = () => {
                        reject = NULL;
                        resolve = NULL;
                        promises.length = 0;
                        promises = NULL;
                    };

                    let onResolve = (r: (x: any) => void, v: any) => {
                        if (r) {
                            cleanup();
                            r(v);
                        }
                    };

                    let onFulfill = (v: any) => onResolve(resolve, v);
                    let onReject = (e?: any) => onResolve(reject, e);

                    for (let p of promises) {
                        if (!resolve) break;
                        p.then(onFulfill, onReject);
                    }
                });
            }

            // // race<T>(values: Iterable<T | PromiseLike<T>>): Promise<T>;

            /**
             * Creates a new resolved promise .
             * @returns A resolved promise.
             */
            export function resolve(): PromiseBase<void>;

            /**
             * Creates a new resolved promise for the provided value.
             * @param value A value or promise.
             * @returns A promise whose internal state matches the provided promise.
             */
            export function resolve<T>(value: T | PromiseLike<T>): PromiseBase<T>;
            export function resolve(value?: any): PromiseBase<any> {

                return isPromise(value) ? wrap(value) : new Fulfilled(value);
            }

            /**
             * Syntactic shortcut for avoiding 'new'.
             * @param resolver
             * @param forceSynchronous
             * @returns {Promise}
             */
            export function using<T>(
                resolver: Promise.Executor<T>,
                forceSynchronous: boolean = false): PromiseBase<T> {
                return new Promise<T>(resolver, forceSynchronous);
            }

            /**
             * Takes a set of values or promises and returns a PromiseCollection.
             * Similar to 'group' but calls resolve on each entry.
             * @param resolutions
             */
            export function resolveAll<T>(resolutions: Array<T | PromiseLike<T>>): PromiseCollection<T>;
            export function resolveAll<T>(
                promise: T | PromiseLike<T>,
                ...rest: Array<T | PromiseLike<T>>): PromiseCollection<T>;
            export function resolveAll(
                first: any | PromiseLike<any> | Array<any | PromiseLike<any>>,
                ...rest: Array<any | PromiseLike<any>>): PromiseCollection<any> {
                if (!first && !rest.length) throw new Exceptions.ArgumentNullException("resolutions");
                return new PromiseCollection(
                    ((first) instanceof (Array) ? first : [first])
                        .concat(rest)
                        .map((v: any) => resolve(v)) as any);
            }

            /**
             * Creates a PromiseCollection containing promises that will resolve on the next tick using the transform function.
             * This utility function does not chain promises together to create the result,
             * it only uses one promise per transform.
             * @param source
             * @param transform
             * @returns {PromiseCollection<T>}
             */
            export function map<T, U>(source: T[], transform: (value: T) => U): PromiseCollection<U> {
                return new PromiseCollection<U>(
                    source.map(d => new Promise<U>((r, j) => {
                        try {
                            r(transform(d));
                        } catch (ex) {
                            j(ex);
                        }
                    })) as any
                );
            }

            /**
             * Creates a new rejected promise for the provided reason.
             * @param reason The reason the promise was rejected.
             * @returns A new rejected Promise.
             */
            export function reject<T>(reason: T): PromiseBase<T> {
                return new Rejected<T>(reason);
            }

            /**
             * Takes any Promise-Like object and ensures an extended version of it from this module.
             * @param target The Promise-Like object
             * @returns A new target that simply extends the target.
             */
            export function wrap<T>(target: T | PromiseLike<T>): PromiseBase<T> {
                if (!target) throw new Exceptions.ArgumentNullException(TARGET);
                return isPromise(target)
                    ? (target instanceof PromiseBase ? target : new PromiseWrapper(target))
                    : new Fulfilled<T>(target);
            }

            /**
             * A function that acts like a 'then' method (aka then-able) can be extended by providing a function that takes an onFulfill and onReject.
             * @param then
             * @returns {PromiseWrapper<T>}
             */
            export function createFrom<T>(then: Then<T, any>): PromiseBase<T> {
                if (!then) throw new Exceptions.ArgumentNullException(THEN);
                return new PromiseWrapper<T>({ then: then });
            }

        }


        interface IPromiseCallbacks<T> {
            onFulfilled: Promise.Fulfill<T, any>;
            onRejected?: Promise.Reject<any>;
            promise?: Promise<any>;
        }

        export class LazyPromise<T> extends Promise<T> {

            constructor(private _resolver: Promise.Executor<T>) {
                super();
                if (!_resolver) throw new Exceptions.ArgumentNullException("resolver");
                this._resolvedCalled = true;
            }

            protected _onDispose(): void {
                super._onDispose();
                this._resolver = VOID0;
            }

            private _onThen(): void {
                const r = this._resolver;
                if (r) {
                    this._resolver = VOID0;
                    this._resolvedCalled = false;
                    this.resolveUsing(r);
                }
            }

            thenSynchronous<TResult>(
                onFulfilled: Promise.Fulfill<T, TResult>,
                onRejected?: Promise.Reject<TResult>): PromiseBase<TResult> {
                this._onThen();
                return super.thenSynchronous(onFulfilled, onRejected);
            }


            thenThis(
                onFulfilled: (v?: T) => any,
                onRejected?: (v?: any) => any): this {
                this._onThen();
                return super.thenThis(onFulfilled, onRejected) as any;
            }

            // NOTE: For a LazyPromise we need to be careful not to trigger the resolve for delay.

            /**
             * Will yield for a number of milliseconds from the time called before continuing.
             * @param milliseconds
             * @returns A promise that yields to the current execution and executes after a minimum delay.
             */
            delayFromNow(milliseconds: number = 0): PromiseBase<T> {
                this.throwIfDisposed();

                // If this is already guaranteed to resolve, the go ahead and pass to the super.
                if (!this._resolver || this.isSettled)
                    return super.delayFromNow(milliseconds);

                /*
                 * If not triggered yet, then we create a special promise
                 * that only requests the resolution from the parent promise
                 * if a 'then' is called to ensure the lazy pattern.
                 */
                let pass: Closure;
                let timedOut: boolean = false;

                // Setup the timer.
                let timeout = Threading.defer(() => {
                    timedOut = true;
                    // If the promise was requested already go ahead and pass the request on to the parent.
                    if (pass)
                        pass();
                },
                    milliseconds);

                return new LazyPromise<T>(
                    (resolve, reject) => {
                        // A lazy promise only enters here if something called for a resolution.
                        pass = () => {
                            this.thenThis(
                                v => resolve(v),
                                e => reject(e)
                            );
                            timeout.dispose();
                            timeout = VOID0;
                            pass = VOID0;
                        };

                        // If the timeout completed already go ahead and pass the request on to the parent.
                        if (timedOut)
                            pass();
                        // Otherwise wait for the timeout to do it.
                    });
            }

            /**
             * Will yield for a number of milliseconds from after this promise resolves.
             * If the promise is already resolved, the delay will start from now.
             * @param milliseconds
             * @returns A promise that yields to the current execution and executes after a delay.
             */
            delayAfterResolve(milliseconds: number = 0): PromiseBase<T> {
                this.throwIfDisposed();

                // If this is already guaranteed to resolve, the go ahead and pass to the super.
                if (!this._resolver || this.isSettled)
                    return super.delayAfterResolve(milliseconds);

                /*
                 * If not triggered yet, then we create a special promise
                 * that only requests the resolution from the parent promise
                 * if a 'then' is called to ensure the lazy pattern.
                 */
                let pass: Closure;


                // Setup the timer.
                let timeout: Threading.ICancellable;

                let finalize = () => {
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
                    let detector = () => {
                        if (finalize) // We may already be wrapped up so never mind!
                            timeout = Threading.defer(finalize, milliseconds);
                    };

                    // Calling super.thenThis does not trigger resolution.
                    // This simply waits for resolution to happen.
                    // Is effectively the timer by when resolution has occurred.
                    super.thenThis(detector, detector);
                    //noinspection JSUnusedAssignment
                    detector = (null as any);
                }

                return new LazyPromise<T>(
                    (resolve, reject) => {
                        // Because of the lazy nature of this promise, this could enter here at any time.
                        if (this.isPending) {
                            this.thenThis(
                                v => Threading.defer(() => resolve(v), milliseconds),
                                e => Threading.defer(() => reject(e), milliseconds)
                            );
                            finalize();
                        } else {
                            // We don't know when this resolved and could have happened anytime after calling this delay method.
                            pass = () => {
                                this.thenThis(
                                    v => resolve(v),
                                    e => reject(e)
                                );
                            };

                            // Already finalized (aka resolved after a timeout)? Go now!
                            if (!finalize)
                                pass();
                        }

                    });

            }
        }

    }
    
    export namespace Threading {
        export namespace Tasks {
            const isNodeJS = false;

            self.onmessage = (code: any) => {
                try {
                    eval(code.data);
                } catch (e) {
                    // Do nothing
                }
            };

            export enum TaskStatus {
                Created,
                WaitingToRun,
                Running,
                RanToCompletion,
                Cancelled,
                Faulted
            }

            export interface ITaskState<T> {
                status: TaskStatus;
                result?: T;
                error?: any;
            }

            declare const navigator: any;
            declare const __dirname: string;

            const
                MAX_WORKERS: number = 16,
                VOID0: undefined = void 0,
                URL = typeof self !== Type.UNDEFINED
                    ? (self.URL ? self.URL : (self as any).webkitURL)
                    : null,
                _supports = !!(isNodeJS || (self as any).Worker); // node always supports parallel

            export interface ParallelOptions {
                evalPath?: string;
                maxConcurrency?: number;
                allowSynchronous?: boolean;
                env?: any;
                envNamespace?: string;
            }

            const defaults: ParallelOptions = {
                evalPath: VOID0,
                maxConcurrency: (navigator.hardwareConcurrency || 4),
                allowSynchronous: true,
                env: {},
                envNamespace: "env"
            };

            function extend<TFrom extends any, TTo extends any>(from: TFrom, to: TTo): TFrom & TTo {
                if (!to) to = ({} as any);
                for (let i of Object.keys(from as any)) {
                    if (to[i] === VOID0) to[i] = from[i];
                }
                return to as any;
            }

            function interact(
                w: WorkerLike,
                onMessage: (msg: { data: any }) => void,
                onError: (e: any) => void,
                message?: any): void {
                if (onMessage) w.onmessage = onMessage;
                if (onError) w.onerror = onError;
                if (message !== VOID0) w.postMessage(message);
            }

            class WorkerPromise<T> extends Promises.Promise<T>
            {
                constructor(worker: WorkerLike, data: any) {
                    super((resolve, reject) => {
                        interact(
                            worker,
                            (response: { data: any }) => {
                                resolve(response.data);
                            },
                            (e: any) => {
                                reject(e);
                            },
                            data);
                    }, true);
                }
            }

            export type RequireType = string | Function | { name?: string, fn: Function };

            module workers {

                /*
                 * Note:
                 * Currently there is nothing preventing excessive numbers of workers from being generated.
                 * Eventually there will be a master pool count which will regulate these workers.
                 */

                function getPool(key: string): Disposable.ObjectPool<WorkerLike> {
                    let pool = workerPools[key];
                    if (!pool) {
                        workerPools[key] = pool = new Disposable.ObjectPool<WorkerLike>(8);
                        pool.autoClearTimeout = 3000; // Fast cleanup... 1s.
                    }
                    return pool;
                }

                const workerPools: IMap<Disposable.ObjectPool<WorkerLike>> = {};

                export function recycle(w: WorkerLike | null | undefined): null { // always returns null.
                    if (w) {
                        w.onerror = (null as any);
                        w.onmessage = (null as any);
                        const k = (w as any).__key;
                        if (k) {
                            getPool(k).add(w);
                        }
                        else {
                            deferImmediate(() => w.terminate());
                        }
                    }
                    return null;
                }

                export function tryGet(key: string): WorkerLike | undefined {
                    return getPool(key).tryTake();
                }

                export function getNew(key: string, url: string): WorkerLike {
                    const worker: any = new Worker(url);
                    worker.__key = key;
                    if (!worker.dispose) {
                        worker.dispose = () => {
                            worker.onmessage = null;
                            worker.onerror = null;
                            worker.dispose = null;
                            worker.terminate();
                        };
                    }
                    return worker;
                }
            }


            export class Parallel {

                options: ParallelOptions;
                _requiredScripts: string[];
                _requiredFunctions: { name?: string, fn: Function }[];

                constructor(options?: ParallelOptions) {
                    this.options = extend(defaults, options);
                    this._requiredScripts = [];
                    this._requiredFunctions = [];

                    this.ensureClampedMaxConcurrency();
                }

                static maxConcurrency(max: number): Parallel {
                    return new Parallel({ maxConcurrency: max });
                }

                protected _getWorkerSource(task: Function | string, env?: any): string {
                    const scripts = this._requiredScripts, functions = this._requiredFunctions;
                    let preStr = "";

                    if (!isNodeJS && scripts.length) {
                        preStr += `importScripts("${scripts.join('","')}");\r\n`;
                    }

                    for (let { name, fn } of functions) {
                        const source = fn.toString();
                        preStr += name
                            ? `var ${name} = ${source};`
                            : source;
                    }


                    env = JSON.stringify(env || {});

                    const ns = this.options.envNamespace;

                    return preStr + (
                        isNodeJS
                            ? `process.on("message", function(e) {global.${ns} = ${env};process.send(JSON.stringify((${task.toString()})(JSON.parse(e).data)))})`
                            : `self.onmessage = function(e) {var global = {}; global.${ns} = ${env};self.postMessage((${task.toString()})(e.data))}`
                    );
                }

                require(...required: RequireType[]): this {
                    return this.requireThese(required);
                }

                requireThese(required: RequireType[]): this {
                    for (let a of required) {
                        switch (typeof a) {
                            case Type.STRING:
                                this._requiredScripts.push(a as string);
                                break;
                            case Type.FUNCTION:
                                this._requiredFunctions.push({ fn: a as Function });
                                break;
                            case Type.OBJECT:
                                this._requiredFunctions.push(a as { name?: string; fn: Function });
                                break;
                            default:
                                throw new TypeError("Invalid type.");
                        }
                    }
                    return this;
                }

                protected _spawnWorker(task: Function | string, env?: any): WorkerLike | undefined {
                    const src = this._getWorkerSource(task, env);

                    if (Worker === VOID0) return VOID0;
                    let worker = workers.tryGet(src);
                    if (worker) return worker;

                    const scripts = this._requiredScripts;
                    let evalPath = this.options.evalPath;

                    if (!evalPath) {
                        if (isNodeJS)
                            throw new Error("Can't use NodeJS without eval.js!");
                        if (scripts.length)
                            throw new Error("Can't use required scripts without eval.js!");
                        if (!URL)
                            throw new Error("Can't create a blob URL in this browser!");
                    }

                    if (isNodeJS || scripts.length || !URL) {
                        worker = workers.getNew(src, evalPath as string);
                        worker.postMessage(src);
                    }
                    else if (URL) {
                        const blob = new Blob([src], { type: "text/javascript" });
                        const url = URL.createObjectURL(blob);

                        worker = workers.getNew(src, url);
                    }

                    return worker;
                }

                /**
                 * Schedules the task to be run in the worker pool.
                 * @param data
                 * @param task
                 * @param env
                 * @returns {Promise<U>|Promise}
                 */
                startNew<T, U>(data: T, task: (data: T) => U, env?: any): Promises.Promise<U> {
                    const _ = this;
                    const maxConcurrency = this.ensureClampedMaxConcurrency();

                    const worker = maxConcurrency ? _._spawnWorker(task, extend(_.options.env, env || {})) : null;
                    if (worker) {
                        return new WorkerPromise<U>(worker, data)
                            .finallyThis(() => workers.recycle(worker));
                    }

                    if (_.options.allowSynchronous)
                        return this.startLocal(data, task);

                    throw new Error(maxConcurrency
                        ? "Workers do not exist and synchronous operation not allowed!"
                        : "'maxConcurrency' set to 0 but 'allowSynchronous' is false.");
                }

                /**
                 * Runs the task within the local thread/process.
                 * Is good for use with testing.
                 * @param data
                 * @param task
                 * @returns {Promise<U>|Promise}
                 */
                startLocal<T, U>(data: T, task: (data: T) => U): Promises.Promise<U> {
                    return new Promises.Promise<U>(
                        (resolve, reject) => {
                            try {
                                resolve(task(data));
                            }
                            catch (e) {
                                reject(e);
                            }
                        });
                }

                /**
                 * Returns an array of promises that each resolve after their task completes.
                 * Provides a potential performance benefit by not waiting for all promises to resolve before proceeding to next step.
                 * @param data
                 * @param task
                 * @param env
                 * @returns {PromiseCollection}
                 */
                pipe<T, U>(data: T[], task: (data: T) => U, env?: any): Promises.PromiseCollection<U> {

                    // The resultant promise collection will make an internal copy...
                    let result: Promises.Promise<U>[] | undefined;

                    if (data && data.length) {
                        const len = data.length;
                        const taskString = task.toString();
                        const maxConcurrency = this.ensureClampedMaxConcurrency();
                        let error: any;
                        let i = 0;
                        for (let w = 0; !error && i < Math.min(len, maxConcurrency); w++) {
                            let worker: WorkerLike | null | undefined = maxConcurrency ? this._spawnWorker(taskString, env) : null;

                            if (!worker) {
                                if (!this.options.allowSynchronous)
                                    throw new Error(maxConcurrency
                                        ? "Workers do not exist and synchronous operation not allowed!"
                                        : "'maxConcurrency' set to 0 but 'allowSynchronous' is false.");

                                // Concurrency doesn't matter in a single thread... Just queue it all up.
                                return Promises.Promise.map(data, task);
                            }

                            if (!result) {
                                // There is a small risk that the consumer could call .resolve() which would result in a double resolution.
                                // But it's important to minimize the number of objects created.
                                result = data.map(d => new Promises.Promise<U>());
                            }

                            let next = () => {
                                if (error) {
                                    worker = workers.recycle(worker);
                                }

                                if (worker) {
                                    if (i < len) {
                                        //noinspection JSReferencingMutableVariableFromClosure
                                        let ii = i++, p = result![ii];
                                        let wp = new WorkerPromise<U>(worker, data[ii]);
                                        wp.thenSynchronous(
                                            r => {
                                                p.resolve(r);
                                                next();
                                            },
                                            e => {
                                                if (!error) {
                                                    error = e;
                                                    p.reject(e);
                                                    worker = workers.recycle(worker);
                                                }
                                            })
                                            .finallyThis(() =>
                                                wp.dispose());
                                    }
                                    else {
                                        worker = workers.recycle(worker);
                                    }
                                }
                            };
                            next();
                        }

                    }

                    return new Promises.PromiseCollection<U>(result as any);
                }

                private ensureClampedMaxConcurrency(): number {
                    let { maxConcurrency } = this.options;
                    if (maxConcurrency && maxConcurrency > MAX_WORKERS) {
                        this.options.maxConcurrency = maxConcurrency = MAX_WORKERS;
                        console.warn(`More than ${MAX_WORKERS} workers can reach worker limits and cause unexpected results.  maxConcurrency reduced to ${MAX_WORKERS}.`);
                    }
                    return (maxConcurrency || maxConcurrency === 0) ? maxConcurrency : MAX_WORKERS;
                }

                /**
                 * Waits for all tasks to resolve and returns a promise with the results.
                 * @param data
                 * @param task
                 * @param env
                 * @returns {ArrayPromise}
                 */
                map<T, U>(data: T[], task: (data: T) => U, env?: any): Promises.ArrayPromise<U> {
                    if (!data || !data.length)
                        return Promises.ArrayPromise.fulfilled(data && []);

                    // Would return the same result, but has extra overhead.
                    // return this.pipe(data,task).all();

                    data = data.slice(); // Never use the original.
                    return new Promises.ArrayPromise<U>((resolve, reject) => {
                        const result: U[] = [], len = data.length;
                        result.length = len;

                        const taskString = task.toString();
                        let maxConcurrency = this.ensureClampedMaxConcurrency(), error: any;
                        let i = 0, resolved = 0;
                        for (let w = 0; !error && i < Math.min(len, maxConcurrency); w++) {
                            let worker: WorkerLike | null | undefined = this._spawnWorker(taskString, env);

                            if (!worker) {
                                if (!this.options.allowSynchronous)
                                    throw new Error("Workers do not exist and synchronous operation not allowed!");

                                // Concurrency doesn't matter in a single thread... Just queue it all up.
                                resolve(Promises.Promise.map(data, task).all() as any);
                                return;
                            }

                            let next = () => {
                                if (error) {
                                    worker = workers.recycle(worker);
                                }

                                if (worker) {
                                    if (i < len) {
                                        let ii = i++;
                                        let wp = new WorkerPromise<U>(worker, data[ii]);
                                        wp.thenSynchronous(
                                            r => {
                                                result[ii] = (r as any);
                                                next();
                                            },
                                            e => {
                                                if (!error) {
                                                    error = e;
                                                    reject(e);
                                                    worker = workers.recycle(worker);
                                                }
                                            })
                                            .thenThis(() => {
                                                resolved++;
                                                if (resolved > len) throw Error("Resolved count exceeds data length.");
                                                if (resolved === len) resolve(result);
                                            })
                                            .finallyThis(() =>
                                                wp.dispose());
                                    }
                                    else {
                                        worker = workers.recycle(worker);
                                    }
                                }
                            };
                            next();
                        }

                    });

                }

                static get isSupported() { return _supports; }

                static options(options?: ParallelOptions): Parallel {
                    return new Parallel(options);
                }

                static require(...required: RequireType[]): Parallel {
                    return (new Parallel()).requireThese(required);
                }

                static requireThese(required: RequireType[]): Parallel {
                    return (new Parallel()).requireThese(required);
                }

                static startNew<T, U>(data: T, task: (data: T) => U, env?: any): Promises.PromiseBase<U> {
                    return (new Parallel()).startNew(data, task, env);
                }

                //
                // forEach<T>(data:T[], task:(data:T) => void, env?:any):PromiseBase<void>
                // {}

                static map<T, U>(data: T[], task: (data: T) => U, env?: any): Promises.ArrayPromise<U> {
                    return (new Parallel()).map(data, task, env);
                }
            }
            export abstract class TaskHandlerBase extends Disposable.DisposableBase implements ICancellable {
                private _status: TaskStatus;

                constructor() {
                    super();
                    this._disposableObjectName = "TaskHandlerBase";
                    this._timeoutId = null;
                    this._status = TaskStatus.Created;
                }

                private _timeoutId: any;

                get isScheduled(): boolean {
                    return !!this._timeoutId;
                }

                /**
                 * Schedules/Reschedules triggering the task.
                 * @param defer Optional time to wait until triggering.
                 */
                start(defer: number = 0): void {
                    this.throwIfDisposed();

                    this.cancel();
                    this._status = TaskStatus.WaitingToRun;
                    if (!(defer > 0)) defer = 0;  // A negation is used to catch edge cases.
                    if (isFinite(defer as any))
                        this._timeoutId = setTimeout(TaskHandlerBase._handler, defer, this);
                }

                runSynchronously(): void {
                    this.throwIfDisposed();
                    TaskHandlerBase._handler(this);
                }

                protected getStatus(): TaskStatus {
                    return this._status;
                }

                get status(): TaskStatus {
                    return this.getStatus();
                }

                // Use a static function here to avoid recreating a new function every time.
                private static _handler(d: TaskHandlerBase): void {
                    d.cancel();
                    d._status = TaskStatus.Running;
                    try {
                        d._onExecute();
                        d._status = TaskStatus.RanToCompletion;
                    }
                    catch (ex) {
                        d._status = TaskStatus.Faulted;
                    }
                }

                protected abstract _onExecute(): void;

                protected _onDispose(): void {
                    this.cancel();
                    (this as any)._status = null;
                }

                cancel(): boolean {
                    const id = this._timeoutId;
                    if (id) {
                        clearTimeout(id);
                        this._timeoutId = null;
                        this._status = TaskStatus.Cancelled;
                        return true;
                    }
                    return false;
                }
            }

            export class TaskHandler extends TaskHandlerBase {

                constructor(private readonly _action: Closure) {
                    super();
                    if (!_action) throw new Exceptions.ArgumentNullException("action");
                }

                protected _onExecute(): void {
                    this._action();
                }

                protected _onDispose(): void {
                    super._onDispose();
                    (this as any)._action = null;
                }
            }

            export class Task<T> extends TaskHandlerBase {
                private readonly _result: Lazy<T>;

                constructor(valueFactory: Func<T>) {
                    super();
                    if (!valueFactory) throw new Exceptions.ArgumentNullException("valueFactory");
                    this._result = new Lazy(valueFactory, false);
                }

                protected _onExecute(): void {
                    this._result.getValue();
                }

                protected getResult(): T {
                    return this._result.value; // This will detect any potential recursion.
                }

                protected getState(): ITaskState<T> {
                    const r = this._result;
                    return r && {
                        status: this.getStatus(),
                        result: r.isValueCreated ? r.value : void 0,
                        error: r.error
                    };
                }


                start(defer?: number): void {
                    if (this.getStatus() == TaskStatus.Created) {
                        super.start(defer);
                    }
                }

                runSynchronously(): void {
                    if (this.getStatus() == TaskStatus.Created) {
                        super.runSynchronously();
                    }
                }

                get state(): ITaskState<T> {
                    return this.getState();
                }

                get result(): T {
                    this.throwIfDisposed();
                    this.runSynchronously();
                    return this.getResult();
                }

                get error(): any {
                    this.throwIfDisposed();
                    return this._result.error;
                }

                protected _onDispose(): void {
                    super._onDispose();
                    const r = this._result;

                    if (r) {
                        (this as any)._result = null;
                        r.dispose();
                    }
                }
            }
        }

        export class Thread {
            /**
                 * Suspends the current thread for the specified number of milliseconds. (Important: it's synchronous!!!)
                 * @param {Number} millisecondsTimeout The number of milliseconds for which the thread is suspended. If the value of the millisecondsTimeout argument is zero or negative, the operations is aborted.
                 */
            static sleep(millisecondsTimeout: number) {
                if (millisecondsTimeout <= 0) return;
                var start = new Date().getTime(), expire = start + millisecondsTimeout;
                while (new Date().getTime() < expire) {
                    //Hush... It will be over soon.
                }
            }//end sleep()

        }//end class Thread
    }
    
    export namespace Collections {
        const
            NAME = "CollectionBase",
            CMDC = "Cannot modify a disposed collection.",
            CMRO = "Cannot modify a read-only collection.",
            isRequireJS = false,
            isNodeJS = false,
            isCommonJS = false;
        const
            LINQ_PATH = "../../System.Linq/Linq";

        const
            STRING_EMPTY: string = "",
            ENDLESS_EXCEPTION_MESSAGE =
                "Cannot call forEach on an endless enumerable. " +
                "Would result in an infinite loop that could hang the current process.";

        export namespace Enumeration {
            const VOID0: undefined = void 0;

            export declare type IEnumerableOrArray<T> = ArrayLike<T> | IEnumerable<T>;

             export class IteratorResult<T> implements IIteratorResult<T>
            {
                public readonly value: T;
                public readonly index?: number;
                public readonly done: boolean;

                constructor(
                    value: T,
                    done: boolean);
                constructor(
                    value: T,
                    index?: number,
                    done?: boolean);
                constructor(
                    value: T,
                    index?: number | boolean,
                    done: boolean = false) {
                    this.value = value;
                    if (typeof index == "boolean")
                        this.done = index as boolean;
                    else {
                        this.index = index as number;
                        this.done = done;
                    }
                    Object.freeze(this);
                }
            }

            export module IteratorResult {
                export const Done: IteratorResult<any> = new IteratorResult<any>(VOID0, VOID0, true);

                export function GetDone(): IteratorResult<any> { return Done; }
            }

            Object.freeze(IteratorResult);

            export class EmptyEnumerable implements IEnumerable<any>{

                constructor() {
                    this.isEndless = false;
                }

                getEnumerator(): IEnumerator<any> {
                    return EmptyEnumerator;
                }

                /**
                 * Provides a way of flagging endless enumerations that may cause issues.
                 */
                readonly isEndless: boolean;
            }

            export const EmptyEnumerator: IEnumerator<any> = Object.freeze({
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

           

            export function throwIfEndless(isEndless: false): true;
            export function throwIfEndless(isEndless: boolean | undefined): true | never;
            export function throwIfEndless(isEndless: boolean | undefined): true | never {
                if (isEndless)
                    throw new UnsupportedEnumerableException(ENDLESS_EXCEPTION_MESSAGE);
                return true;
            }

            function initArrayFrom(
                source: ForEachEnumerable<any>,
                max: number = Infinity): any[] {
                if (Type.isArrayLike(source)) {
                    const len = Math.min((source as any).length, max);
                    if (isFinite(len)) {
                        if (len > 65535) return new Array(len);
                        const result: any[] = [];
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
            export function from<T>(source: ForEachEnumerable<T> | InfiniteValueFactory<T>): IEnumerator<T> {
                // To simplify and prevent null reference exceptions:
                if (!source)
                    return EmptyEnumerator;

                if ((source) instanceof (Array))
                    return new ArrayEnumerator<T>(source as T[]);

                if (Type.isArrayLike<T>(source)) {
                    return new IndexEnumerator<T>(
                        (): IndexEnumeratorSource<T> => {
                            return {
                                source: source as any,
                                length: (source as any).length,
                                pointer: 0,
                                step: 1
                            };
                        }
                    );
                }

                if (!Type.isPrimitive(source)) {
                    if (isEnumerable<T>(source))
                        return (source as any).getEnumerator();

                    if (Type.isFunction(source))
                        return new InfiniteEnumerator<T>(source as InfiniteValueFactory<T>) as any;

                    if (isEnumerator<T>(source))
                        return source;

                    if (isIterator<T>(source))
                        return new IteratorEnumerator<T>(source);

                }

                throw new UnsupportedEnumerableException();
            }

            export function isEnumerable<T>(instance: any): instance is IEnumerable<T> {
                return Type.hasMemberOfType<IEnumerable<T>>(instance, "getEnumerator", Type.FUNCTION);
            }

            export function isEnumerableOrArrayLike<T>(instance: any): instance is IEnumerableOrArray<T> {
                return Type.isArrayLike(instance) || isEnumerable(instance);
            }

            export function isEnumerator<T>(instance: any): instance is IEnumerator<T> {
                return Type.hasMemberOfType<IEnumerator<T>>(instance, "moveNext", Type.FUNCTION);
            }

            export function isIterator<T>(instance: any): instance is IIterator<T> {
                return Type.hasMemberOfType<IIterator<T>>(instance, "next", Type.FUNCTION);
            }

            /**
             * Flexible method for iterating any enumerable, enumerable, iterator, array, or array-like object.
             * @param e The enumeration to loop on.
             * @param action The action to take on each.
             * @param max Stops after max is reached.  Allows for forEach to be called on infinite enumerations.
             * @returns the total times iterated.  If the enumerable is unrecognized then -1.
             */

            export function forEach<T>(
                e: ForEachEnumerable<T>,
                action: ActionWithIndex<T>,
                max?: number): number;

            export function forEach<T>(
                e: ForEachEnumerable<T>,
                action: PredicateWithIndex<T>,
                max?: number): number;

            export function forEach<T>(
                e: ForEachEnumerable<T>,
                action: ActionWithIndex<T> | PredicateWithIndex<T>,
                max: number = Infinity): number {
                if ((e as any) === STRING_EMPTY) return 0;

                if (e && max > 0) {
                    if (Type.isArrayLike<T>(e)) {
                        // Assume e.length is constant or at least doesn't deviate to infinite or NaN.
                        throwIfEndless(!isFinite(max) && !isFinite((e as any).length));
                        let i = 0;
                        for (; i < Math.min((e as any).length, max); i++) {
                            if (action(e[i], i) === false)
                                break;
                        }
                        return i;
                    }


                    if (isEnumerator<T>(e)) {
                        throwIfEndless(!isFinite(max) && (e as any).isEndless);

                        let i = 0;
                        // Return value of action can be anything, but if it is (===) false then the forEach will discontinue.
                        while (max > i && (e as any).moveNext()) {
                            if (action((e as any).current as any, i++) === false)
                                break;
                        }
                        return i;
                    }

                    if (isEnumerable<T>(e)) {
                        throwIfEndless(!isFinite(max) && (e as any).isEndless);

                        // For enumerators that aren't EnumerableBase, ensure dispose is called.
                        return Disposable.using(
                            (e as IEnumerable<T>).getEnumerator(),
                            f => forEach(f, action, max)
                        );
                    }

                    if (isIterator<T>(e)) {
                        // For our purpose iterators are endless and a max must be specified before iterating.
                        throwIfEndless(!isFinite(max));

                        let i = 0, r: IIteratorResult<T>;
                        // Return value of action can be anything, but if it is (===) false then the forEach will discontinue.
                        while (max > i && !(r = (e as any).next()).done) {
                            if (action(r.value as any, i++) === false)
                                break;
                        }
                        return i;
                    }
                }

                return -1;

            }

            /**
             * Converts any enumerable to an array.
             * @param source
             * @param max Stops after max is reached.  Allows for forEach to be called on infinite enumerations.
             * @returns {any}
             */
            export function toArray<T>(
                source: ForEachEnumerable<T>,
                max: number = Infinity): T[] {
                if ((source as any) === STRING_EMPTY) return [];

                if (!isFinite(max) && (source) instanceof (Array))
                    return source.slice();

                const result: T[] = initArrayFrom(source, max);
                if (-1 === forEach(source, (e, i) => { result[i] = e; }, max))
                    throw new UnsupportedEnumerableException();

                return result;
            }

            /**
             * Converts any enumerable to an array of selected values.
             * @param source
             * @param selector
             * @param max Stops after max is reached.  Allows for forEach to be called on infinite enumerations.
             * @returns {TResult[]}
             */

            export function map<T, TResult>(
                source: ForEachEnumerable<T>,
                selector: SelectorWithIndex<T, TResult>,
                max: number = Infinity): TResult[] {
                if ((source as any) === STRING_EMPTY) return [];

                if (!isFinite(max) && (source) instanceof (Array))
                    return (source as any).map(selector);

                const result: TResult[] = initArrayFrom(source, max);
                if (-1 === forEach(source, (e, i) => { result[i] = selector(e, i); }, max))
                    throw new UnsupportedEnumerableException();

                return result;
            }
            
            let yielderPool: Disposable.ObjectPool<Yielder<any>>;
            function yielder(): Yielder<any> | void;
            function yielder(recycle?: Yielder<any>): void;
            //noinspection JSUnusedLocalSymbols
            function yielder(recycle?: Yielder<any>): Yielder<any> | void {
                if (!yielderPool)
                    yielderPool
                        = new Disposable.ObjectPool<Yielder<any>>(40, () => new Yielder<any>(), y => y.yieldBreak());
                if (!recycle) return yielderPool.take();
                yielderPool.add(recycle);
            }

            class Yielder<T> implements IYield<T>, Disposable.IDisposable {
                private _current: T | undefined = VOID0;
                private _index: number = NaN;

                get current(): T | undefined { return this._current; } // this class is not entirely local/private.  Still needs protection.

                get index(): number { return this._index; }

                yieldReturn(value: T): boolean {
                    this._current = value;
                    if (isNaN(this._index))
                        this._index = 0;
                    else
                        this._index++;
                    return true;
                }

                yieldBreak(): boolean {
                    this._current = VOID0;
                    this._index = NaN;
                    return false;
                }

                dispose(): void {
                    this.yieldBreak();
                }
            }

            // IEnumerator State
            const enum EnumeratorState { Before, Active, Completed, Faulted, Interrupted, Disposed }

            const NAME = "EnumeratorBase";

            // "Enumerator" is conflict JScript's "Enumerator"
            // Naming this class EnumeratorBase to avoid collision with IE.
            export class EnumeratorBase<T> extends Disposable.DisposableBase implements IEnumerator<T>
            {

                private _yielder: Yielder<T>;
                private _state: EnumeratorState;
                private _disposer: () => void;

                get current(): T | undefined {
                    const y = this._yielder;
                    return y && y.current;
                }

                get index(): number {
                    const y = this._yielder;
                    return y ? y.index : NaN;
                }

                constructor(
                    initializer: Closure | null,
                    tryGetNext: (yielder: IYield<T>) => boolean,
                    isEndless?: boolean);
                constructor(
                    initializer: Closure | null,
                    tryGetNext: (yielder: IYield<T>) => boolean,
                    disposer?: Closure | null,
                    isEndless?: boolean);
                constructor(
                    private _initializer: Closure,
                    private _tryGetNext: (yielder: IYield<T>) => boolean,
                    disposer?: Closure | boolean | null,
                    isEndless?: boolean) {
                    super();
                    this._disposableObjectName = NAME;
                    this.reset();
                    if (Type.isBoolean(isEndless))
                        this._isEndless = isEndless;
                    else if (Type.isBoolean(disposer))
                        this._isEndless = disposer;

                    if (Type.isFunction(disposer))
                        this._disposer = disposer as () => void;
                }

                protected _isEndless: boolean;
                /*
                 * Provides a mechanism to indicate if this enumerable never ends.
                 * If set to true, some operations that expect a finite result may throw.
                 * Explicit false means it has an end.
                 * Implicit void means unknown.
                 */
                get isEndless(): boolean | undefined {
                    return this._isEndless;
                }

                /**
                 * Added for compatibility but only works if the enumerator is active.
                 */
                reset(): void {
                    const _ = this;
                    _.throwIfDisposed();
                    const y = _._yielder;
                    _._yielder = (null as any);

                    _._state = EnumeratorState.Before;

                    if (y) yielder(y); // recycle until actually needed.
                }

                private _assertBadState() {
                    const _ = this;
                    switch (_._state) {
                        case EnumeratorState.Faulted:
                            _.throwIfDisposed("This enumerator caused a fault and was disposed.");
                            break;
                        case EnumeratorState.Disposed:
                            _.throwIfDisposed("This enumerator was manually disposed.");
                            break;
                    }
                }

                /**
                 * Passes the current value to the out callback if the enumerator is active.
                 * Note: Will throw ObjectDisposedException if this has faulted or manually disposed.
                 */
                tryGetCurrent(out: Action<T>): boolean {
                    this._assertBadState();
                    if (this._state === EnumeratorState.Active) {
                        out(this.current as T);
                        return true;
                    }
                    return false;
                }

                get canMoveNext(): boolean {
                    return this._state < EnumeratorState.Completed;
                }

                /**
                 * Safely moves to the next entry and returns true if there is one.
                 * Note: Will throw ObjectDisposedException if this has faulted or manually disposed.
                 */
                moveNext(): boolean {
                    const _ = this;

                    _._assertBadState();

                    try {
                        switch (_._state) {
                            case EnumeratorState.Before:
                                _._yielder = _._yielder || yielder() as Yielder<T>;
                                _._state = EnumeratorState.Active;
                                const initializer = _._initializer;
                                if (initializer)
                                    initializer();
                            // fall through
                            case EnumeratorState.Active:
                                if (_._tryGetNext(_._yielder)) {
                                    return true;
                                }
                                else {
                                    this.dispose();
                                    _._state = EnumeratorState.Completed;
                                    return false;
                                }
                            default:
                                return false;
                        }
                    }
                    catch (e) {
                        this.dispose();
                        _._state = EnumeratorState.Faulted;
                        throw e;
                    }
                }

                /**
                 * Moves to the next entry and emits the value through the out callback.
                 * Note: Will throw ObjectDisposedException if this has faulted or manually disposed.
                 */
                tryMoveNext(out: Action<T>): boolean {
                    if (this.moveNext()) {
                        out(this.current as T);
                        return true;
                    }
                    return false;
                }

                nextValue(): T | undefined {
                    return this.moveNext()
                        ? this.current
                        : VOID0;
                }

                /**
                 * Exposed for compatibility with generators.
                 */
                next(): IIteratorResult<T> {
                    return this.moveNext()
                        ? new IteratorResult(this.current, this.index)
                        : IteratorResult.Done;
                }

                end(): void {
                    this._ensureDisposeState(EnumeratorState.Interrupted);
                }

                'return'(): IIteratorResult<void>;
                'return'<TReturn>(value: TReturn): IIteratorResult<TReturn>;
                'return'(value?: any): IIteratorResult<any> {
                    const _ = this;
                    _._assertBadState();

                    try {
                        return value === VOID0 || _._state === EnumeratorState.Completed || _._state === EnumeratorState.Interrupted
                            ? IteratorResult.Done
                            : new IteratorResult(value, VOID0, true);
                    }
                    finally {
                        _.end();
                    }
                }

                private _ensureDisposeState(state: EnumeratorState): void {
                    const _ = this;
                    if (!_.wasDisposed) {
                        _.dispose();
                        _._state = state;
                    }
                }

                protected _onDispose(): void {
                    const _ = this;
                    _._isEndless = false;
                    const disposer = _._disposer;

                    _._initializer = (null as any);
                    _._disposer = (null as any);


                    const y = _._yielder;
                    _._yielder = (null as any);
                    this._state = EnumeratorState.Disposed;

                    if (y) yielder(y);

                    if (disposer)
                        disposer();
                }

            }


            export type ForEachEnumerable<T> = IEnumerableOrArray<T> | IEnumerator<T> | IIterator<T>;

            export interface IEnumerable<T> {
                getEnumerator(): IEnumerator<T>;

                /**
                 * Provides a way of flagging endless enumerations that may cause issues.
                 */
                isEndless?: boolean;
            }

            export interface IEnumerateEach<T> {
                // Note: Enforcing an interface that allows operating on a arrayCopy can prevent changing underlying data while enumerating.

                /**
                 * If the action returns false, the enumeration will stop.
                 * @param action
                 * @param useCopy
                 */
                forEach(action: ActionWithIndex<T>, useCopy?: boolean): number;
                forEach(action: PredicateWithIndex<T>, useCopy?: boolean): number;
            }

            export interface IEnumerator<T> extends IIterator<T>, Disposable.IDisposable {

                /**
                 * The current value within the enumeration.
                 */
                current: T | undefined;

                /**
                 * Will indicate if moveNext is safe.
                 */
                canMoveNext?: boolean;

                /**
                 * Safely moves to the next entry and returns true if there is one.
                 */
                moveNext(value?: any): boolean;

                /**
                 * Moves to the next entry and emits the value through the out callback.
                 */
                tryMoveNext(out: (value: T) => void): boolean;

                /**
                 * Restarts the enumeration.
                 */
                reset(): void;

                /**
                 * Interrupts/completes the enumeration.
                 */
                end(): void;

                /**
                 * Calls .moveNext() and returns .current
                 */
                nextValue(value?: any): T | undefined;

                /**
                 * Provides a way of flagging endless enumerations that may cause issues.
                 */
                isEndless?: boolean;
            }

            export interface IIteratorResult<T> {
                done: boolean;
                value?: T;
                index?: number;
            }

            export interface IIterator<T> {
                next(value?: any): IIteratorResult<T>;
                'return'?<TReturn>(value?: TReturn): IIteratorResult<TReturn>;
                'throw'?(e?: any): IIteratorResult<T>;
            }

            export interface IndexEnumeratorSource<T> {
                source: { [index: number]: T };
                length: number;
                step?: number;

                pointer?: number;
            }

            export abstract class SimpleEnumerableBase<T> implements IEnumerator<T>
            {

                protected _current: T | undefined;
                protected _index: number;

                constructor() {
                    this.reset();
                }

                get current(): T | undefined {
                    return this._current;
                }

                protected abstract _canMoveNext(): boolean;

                get canMoveNext(): boolean {
                    return this._canMoveNext();
                }

                abstract moveNext(): boolean;

                tryMoveNext(out: Action<T>): boolean {
                    if (this.moveNext()) {
                        out(this._current as T);
                        return true;
                    }
                    return false;
                }


                protected incrementIndex(): number {
                    let i = this._index;
                    this._index = i = isNaN(i) ? 0 : (i + 1);
                    return i;
                }

                nextValue(): T | undefined {
                    this.moveNext();
                    return this._current;
                }

                next(): IIteratorResult<T> {
                    return this.moveNext()
                        ? new IteratorResult(this._current, this._index)
                        : IteratorResult.Done;
                }

                end(): void {
                    this.dispose();
                }

                'return'(): IIteratorResult<void>;
                'return'<TReturn>(value: TReturn): IIteratorResult<TReturn>;
                'return'(value?: any): IIteratorResult<any> {
                    try {
                        return value !== VOID0 && this._canMoveNext()
                            ? new IteratorResult(value, VOID0, true)
                            : IteratorResult.Done;
                    }
                    finally {
                        this.dispose();
                    }
                }

                reset(): void {
                    this._current = VOID0;
                    this._index = NaN;
                }

                dispose(): void {
                    this.reset();
                }

                protected getIsEndless(): boolean {
                    return this._canMoveNext();
                }

                get isEndless(): boolean | undefined {
                    return this.getIsEndless();
                }
            }

            export class IndexEnumerator<T> extends EnumeratorBase<T>
            {

                constructor(
                    sourceFactory: () => IndexEnumeratorSource<T>) {

                    let source: IndexEnumeratorSource<T>;
                    super(
                        () => {
                            source = sourceFactory();
                            if (source && source.source) {
                                const len = source.length;
                                if (len < 0) // Null is allowed but will exit immediately.
                                    throw new Error("length must be zero or greater");

                                if (!isFinite(len))
                                    throw new Error("length must finite number");

                                if (len && source.step === 0)
                                    throw new Error("Invalid IndexEnumerator step value (0).");
                                let pointer = source.pointer;
                                if (!pointer)
                                    pointer = 0;
                                else if (pointer != Math.floor(pointer))
                                    throw new Error("Invalid IndexEnumerator pointer value (" + pointer + ") has decimal.");
                                source.pointer = pointer;

                                let step = source.step;
                                if (!step)
                                    step = 1;
                                else if (step != Math.floor(step))
                                    throw new Error("Invalid IndexEnumerator step value (" + step + ") has decimal.");
                                source.step = step;
                            }
                        },

                        (yielder) => {
                            let len = (source && source.source) ? source.length : 0;
                            if (!len || isNaN(len))
                                return yielder.yieldBreak();
                            const current = source.pointer as number;
                            if (source.pointer == null) source.pointer = 0; // should never happen but is in place to negate compiler warnings.
                            if (!source.step) source.step = 1; // should never happen but is in place to negate compiler warnings.
                            source.pointer = source.pointer + source.step;
                            return (current < len && current >= 0)
                                ? yielder.yieldReturn(source.source[current])
                                : yielder.yieldBreak();
                        },

                        () => {
                            if (source) {
                                source.source = (null as any);
                            }
                        }
                    );
                    this._isEndless = false;
                }
            }

            export class ArrayEnumerator<T> extends IndexEnumerator<T>
            {
                constructor(arrayFactory: () => ArrayLike<T>, start?: number, step?: number);
                constructor(array: ArrayLike<T>, start?: number, step?: number);
                constructor(arrayOrFactory: any, start: number = 0, step: number = 1) {
                    super(
                        () => {
                            const array = Type.isFunction(arrayOrFactory) ? arrayOrFactory() : arrayOrFactory;
                            return {
                                source: array,
                                pointer: start,
                                length: array ? array.length : 0,
                                step: step
                            };
                        }
                    );
                }
            }

            export interface InfiniteValueFactory<T> {
                (previous: T | undefined, index: number): T;
            }

            export class InfiniteEnumerator<T> extends SimpleEnumerableBase<T>
            {
                /**
                 * See InfiniteValueFactory
                 * @param _factory
                 */
                constructor(private readonly _factory: InfiniteValueFactory<T>) {
                    super();
                }

                protected _canMoveNext(): boolean {
                    return this._factory != null;
                }

                moveNext(): boolean {
                    const _ = this;
                    const f = _._factory;
                    if (f) {
                        _._current = f(_._current, _.incrementIndex());
                        return true;
                    }
                    return false;
                }

                dispose(): void {
                    super.dispose();
                    (this as any)._factory = null;
                }

            }

            export class IteratorEnumerator<T> extends SimpleEnumerableBase<T>
            {
                /**
                 * @param _iterator
                 * @param _isEndless true and false are explicit where as undefined means 'unknown'.
                 */
                constructor(
                    private readonly _iterator: IIterator<T>,
                    private readonly _isEndless?: boolean) {
                    super();
                }

                protected _canMoveNext(): boolean {
                    return this._iterator != null;
                }

                moveNext(value?: any): boolean {
                    const _ = this;
                    const i = _._iterator;
                    if (i) {
                        const r = arguments.length ? i.next(value) : i.next();
                        _._current = r.value;
                        if (r.done) _.dispose();
                        else return true;
                    }
                    return false;
                }

                dispose(): void {
                    super.dispose();
                    (this as any)._iterator = null;
                }

                protected getIsEndless(): boolean {
                    return Boolean(this._isEndless) && super.getIsEndless();
                }
            }
            
            export interface IYield<T> {
                current: T | undefined;
                yieldReturn(value: T | undefined): boolean;
                yieldBreak(): boolean;
            }

            export class Randomizer<T> extends SimpleEnumerableBase<T>
            {
                private readonly _buffer: T[];
                private _pointer: number;

                constructor(
                    source: ForEachEnumerable<T>,
                    private readonly _allowReset: boolean = false) {
                    super();
                    this._buffer = toArray(source);
                    this._pointer = this._buffer.length;
                }

                protected _canMoveNext(): boolean {
                    const p = this._pointer;
                    return !isNaN(p) && p > 0;
                }

                moveNext(): boolean {
                    const _ = this;
                    if (_._canMoveNext()) {
                        const
                            p = this._pointer, // Where were we?
                            i = Math.floor(Math.random() * p), // Pick one.
                            b = this._buffer,
                            value = b[i],
                            last = p - 1;


                        b[i] = b[last]; // Take the last one and put it here.
                        b[last] = (null as any); // clear possible reference.

                        if (!this._allowReset && last % 32 == 0) // Shrink?
                            b.length = last;

                        this._pointer = last;
                        _._current = value;
                        _.incrementIndex();
                        return true;
                    }

                    return false;
                }

                reset(): void {
                    if (this._allowReset) {
                        if (!this._buffer) throw "Randomizer cannot be reset.  Already disposed.";
                        this._pointer = this._buffer.length;
                        super.reset();
                    }
                    else
                        throw "Reset not allowed.  To allow for reset, specify so when constructing.";
                }

                dispose(): void {
                    super.reset(); // Note... don't call this.reset() :|
                    let b = this._buffer;
                    (this as any)._buffer = null;
                    this._pointer = NaN;
                    if (b) b.length = 0;
                }

                protected getIsEndless(): boolean {
                    return false;
                }


            }

            export class Error extends Exception {
            }

            export class UnsupportedEnumerableException extends Exceptions.SystemException {

                constructor(message?: string) {
                    super(message || "Unsupported enumerable.");
                }

                protected getName(): string {
                    return NAME;
                }
            }
        }


        export interface ICollection<T> extends IReadOnlyCollection<T> {
            add(entry: T): void;
            remove(entry: T, max?: number): number;  // Number of times removed.
            clear(): number;

            importEntries(entries: Enumeration.IEnumerableOrArray<T> | Enumeration.IEnumerator<T>): number;
            toArray(): T[];
        }

        export interface ArrayLikeWritable<T> {
            length: number;
            [n: number]: T;
        }

        export interface ILinkedNodeList<TNode extends ILinkedNode<TNode>> {
            first: TNode | null;
            last: TNode | null;

            getNodeAt(index: number): TNode | null;
            removeNode(node: TNode): boolean;
        }

        export interface ILinkedList<T>
            extends ILinkedNodeList<ILinkedListNode<T>>,
            ICollection<T>,
            Enumeration.IEnumerateEach<T> {
            first: ILinkedListNode<T> | null;
            last: ILinkedListNode<T> | null;

            getValueAt(index: number): T | undefined;
            find(entry: T): ILinkedListNode<T> | null;
            findLast(entry: T): ILinkedListNode<T> | null;
            addFirst(entry: T): void;
            addLast(entry: T): void;
            removeFirst(): void;
            removeLast(): void;
            addAfter(node: ILinkedListNode<T>, entry: T): void;

        }

        export interface ILinkedNode<TNode extends ILinkedNode<TNode>> {
            previous?: any;
            next?: any;
        }

        export interface INodeWithValue<TValue> {
            value: TValue;
        }

        export interface ILinkedNodeWithValue<T>
            extends ILinkedNode<ILinkedListNode<T>>, INodeWithValue<T> {
        }

        // Use an interface in order to prevent external construction of LinkedListNode
        export interface ILinkedListNode<T>
            extends ILinkedNodeWithValue<T> {
            previous: ILinkedListNode<T> | null;
            next: ILinkedListNode<T> | null;

            list: ILinkedList<T>;

            addBefore(entry: T): void;
            addAfter(entry: T): void;

            remove(): void;
        }

        export interface IReadOnlyList<T> extends IReadOnlyCollection<T> {
            get(index: number): T;
            indexOf(item: T): number;
        }

        export interface IList<T> extends ICollection<T>, IReadOnlyList<T> {

            /* From ICollection<T>:
             count: number;
             isReadOnly: boolean;
        
             add(item: T): void;
             clear(): number;
             contains(item: T): boolean;
             copyTo(array: T[], index?: number): void;
             remove(item: T): number;
             */

            set(index: number, value: T): boolean;

            insert(index: number, value: T): void;

            removeAt(index: number): boolean;

            addRange(entries: IList<T>): void;

        }

        export interface IReadOnlyCollection<T>
            extends Enumeration.IEnumerable<T> {
            count: number;
            isReadOnly: boolean;

            contains(entry: T): boolean;
            copyTo<TTarget extends ArrayLikeWritable<any>>(target: TTarget, index?: number): TTarget;
            toArray(): T[];
        }

        export interface ISet<T> extends ICollection<T> {

            /**
             * Removes all elements in the specified collection from the current set.
             */
            exceptWith(
                other: Enumeration.IEnumerableOrArray<T>): void;

            /**
             * Modifies the current set so that it contains only elements that are also in a specified collection.
             */
            intersectWith(
                other: Enumeration.IEnumerableOrArray<T>): void;

            /**
             * Determines whether the current set is a proper (strict) subset of a specified collection.
             * The other set must have a value that does not exist in the current set.
             */
            isProperSubsetOf(
                other: Enumeration.IEnumerableOrArray<T>): boolean;

            /**
             * Determines whether the current set is a proper (strict) superset of a specified collection.
             * The current set must have a value that does not exist in the other set.
             */
            isProperSupersetOf(
                other: Enumeration.IEnumerableOrArray<T>): boolean;

            /**
             * Determines whether a set is a subset of a specified collection.
             * Equal sets return true.
             */
            isSubsetOf(
                other: Enumeration.IEnumerableOrArray<T>): boolean;

            /**
             * Determines whether the current set is a superset of a specified collection.
             * Equal sets return true.
             * @param other
             */
            isSupersetOf(
                other: Enumeration.IEnumerableOrArray<T>): boolean;

            /**
             * Determines whether the current set overlaps with the specified collection.
             */
            overlaps(
                other: Enumeration.IEnumerableOrArray<T>): boolean;

            /**
             * Determines whether the current set and the specified collection contain the same elements.
             */
            setEquals(
                other: Enumeration.IEnumerableOrArray<T>): boolean;

            /**
             * Modifies the current set so that it contains only elements that are present either in the current set or in the specified collection, but not both.
             */
            symmetricExceptWith(
                other: Enumeration.IEnumerableOrArray<T>): void;

            /**
             * Modifies the current set so that it contains all elements that are present in the current set, in the specified collection, or in both.
             */
            unionWith(
                other: Enumeration.IEnumerableOrArray<T>): void;
        }

        export abstract class CollectionBase<T> extends Disposable.DisposableBase implements ICollection<T>, Enumeration.IEnumerateEach<T>
        {
            constructor(
                source?: Enumeration.IEnumerableOrArray<T> | Enumeration.IEnumerator<T>,
                protected _equalityComparer: EqualityComparison<T | null | undefined> = Compare.areEqual) {
                super();
                const _ = this;
                _._disposableObjectName = NAME;
                _._importEntries(source);
                _._updateRecursion = 0;
                _._modifiedCount = 0;
                _._version = 0;
            }


            protected abstract getCount(): number;

            get count(): number {
                return this.getCount();
            }

            get length(): number {
                return this.getCount();
            }

            protected getIsReadOnly(): boolean {
                return false;
            }

            //noinspection JSUnusedGlobalSymbols
            get isReadOnly(): boolean {
                return this.getIsReadOnly();
            }

            protected assertModifiable(): true | never {
                this.throwIfDisposed(CMDC);
                if (this.getIsReadOnly())
                    throw new Exceptions.InvalidOperationException(CMRO);
                return true;
            }

            protected _version: number; // Provides an easy means of tracking changes and invalidating enumerables.


            protected assertVersion(version: number): true | never {
                if (version !== this._version)
                    throw new Exceptions.InvalidOperationException("Collection was modified.");

                return true;
            }

            /*
             * Note: Avoid changing modified count by any means but ++;
             * If setting modified count by the result of a closure it may be a negative number or NaN and ruin the pattern.
             */
            private _modifiedCount: number;
            private _updateRecursion: number;

            protected _onModified(): void { }

            protected _signalModification(increment?: boolean): boolean {
                const _ = this;
                if (increment) _._modifiedCount++;
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
            }

            protected _incrementModified(): void { this._modifiedCount++; }

            //noinspection JSUnusedGlobalSymbols
            get isUpdating(): boolean { return this._updateRecursion != 0; }

            /**
             * Takes a closure that if returning true will propagate an update signal.
             * Multiple update operations can be occurring at once or recursively and the onModified signal will only occur once they're done.
             * @param closure
             * @returns {boolean}
             */
            handleUpdate(closure?: () => boolean): boolean {
                if (!closure) return false;
                const _ = this;
                _.assertModifiable();
                _._updateRecursion++;
                let updated: boolean = false;

                try {
                    if (updated = closure())
                        _._modifiedCount++;
                }
                finally {
                    _._updateRecursion--;
                }

                _._signalModification();

                return updated;
            }

            protected abstract _addInternal(entry: T): boolean;

            /*
             * Note: for a slight amount more code, we avoid creating functions/closures.
             * Calling handleUpdate is the correct pattern, but if possible avoid creating another function scope.
             */

            /**
             * Adds an entry to the collection.
             * @param entry
             */
            add(entry: T): void {
                const _ = this;
                _.assertModifiable();
                _._updateRecursion++;

                try
                { if (_._addInternal(entry)) _._modifiedCount++; }
                finally
                { _._updateRecursion--; }

                _._signalModification();
            }
            push(entry: T): void {
                this.add(entry);
            }

            protected abstract _removeInternal(entry: T, max?: number): number;

            /**
             * Removes entries from the collection allowing for a limit.
             * For example if the collection not a distinct set, more than one entry could be removed.
             * @param entry The entry to remove.
             * @param max Limit of entries to remove.  Will remove all matches if no max specified.
             * @returns {number} The number of entries removed.
             */
            remove(entry: T, max: number = Infinity): number {
                const _ = this;
                _.assertModifiable();
                _._updateRecursion++;

                let n: number = NaN;
                try
                { if (n = _._removeInternal(entry, max)) _._modifiedCount++; }
                finally
                { _._updateRecursion--; }

                _._signalModification();
                return n;
            }

            protected abstract _clearInternal(): number;

            /**
             * Clears the contents of the collection resulting in a count of zero.
             * @returns {number}
             */
            clear(): number {
                const _ = this;
                _.assertModifiable();
                _._updateRecursion++;

                let n: number = NaN;
                try
                { if (n = _._clearInternal()) _._modifiedCount++; }
                finally
                { _._updateRecursion--; }

                _._signalModification();

                return n;
            }

            protected _onDispose(): void {
                super._onDispose();
                this._clearInternal();
                this._version = 0;
                this._updateRecursion = 0;
                this._modifiedCount = 0;
                const l = this._linq;
                this._linq = void 0;
                if (l) l.dispose();
            }

            protected _importEntries(entries: Enumeration.IEnumerableOrArray<T> | Enumeration.IEnumerator<T> | null | undefined): number {
                let added = 0;
                if (entries) {
                    if ((entries) instanceof (window["ARRAY_BUFFER"])) {
                        // Optimize for avoiding a new closure.
                        for (let e of (entries as Array<T>)) {
                            if (this._addInternal(e)) added++;
                        }
                    }
                    else {
                        Enumeration.forEach(entries, e => {
                            if (this._addInternal(e)) added++;
                        });
                    }
                }
                return added;
            }

            /**
             * Safely imports any array enumerator, or enumerable.
             * @param entries
             * @returns {number}
             */
            importEntries(entries: Enumeration.IEnumerableOrArray<T> | Enumeration.IEnumerator<T>): number {
                const _ = this;
                if (!entries) return 0;
                _.assertModifiable();
                _._updateRecursion++;

                let n: number = NaN;
                try
                { if (n = _._importEntries(entries)) _._modifiedCount++; }
                finally
                { _._updateRecursion--; }

                _._signalModification();
                return n;
            }

            // Fundamentally the most important part of the collection.

            /**
             * Returns a enumerator for this collection.
             */
            abstract getEnumerator(): Enumeration.IEnumerator<T>;

            /**
             * Returns an array filtered by the provided predicate.
             * Provided for similarity to JS Array.
             * @param predicate
             * @returns {T[]}
             */
            filter(predicate: PredicateWithIndex<T>): T[] {
                if (!predicate) throw new Exceptions.ArgumentNullException("predicate");
                let count = !this.getCount();
                let result: T[] = [];
                if (count) {
                    this.forEach((e, i) => {
                        if (predicate(e, i))
                            result.push(e);
                    });
                }
                return result;
            }

            /**
             * Returns true the first time predicate returns true.  Otherwise false.
             * Useful for searching through a collection.
             * @param predicate
             * @returns {any}
             */
            any(predicate?: PredicateWithIndex<T>): boolean {
                let count = this.getCount();
                if (!count) return false;
                if (!predicate) return Boolean(count);

                let found: boolean = false;
                this.forEach((e, i) => !(found = predicate(e, i)));
                return found;
            }

            /**
             * Returns true the first time predicate returns true.  Otherwise false.
             * See '.any(predicate)'.  As this method is just just included to have similarity with a JS Array.
             * @param predicate
             * @returns {any}
             */
            some(predicate?: PredicateWithIndex<T>): boolean {
                return this.any(predicate);
            }


            /**
             * Returns true if the equality comparer resolves true on any element in the collection.
             * @param entry
             * @returns {boolean}
             */
            contains(entry: T): boolean {
                const equals = this._equalityComparer;
                return this.any(e => equals(entry, e));
            }


            /**
             * Special implementation of 'forEach': If the action returns 'false' the enumeration will stop.
             * @param action
             * @param useCopy
             */
            forEach(action: ActionWithIndex<T>, useCopy?: boolean): number;
            forEach(action: PredicateWithIndex<T>, useCopy?: boolean): number;
            forEach(action: ActionWithIndex<T> | PredicateWithIndex<T>, useCopy?: boolean): number {
                if (this.wasDisposed)
                    return 0;

                if (useCopy) {
                    const a = this.toArray();
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
            }

            /**
             * Copies all values to numerically indexable object.
             * @param target
             * @param index
             * @returns {TTarget}
             */
            copyTo<TTarget extends ArrayLikeWritable<T>>(
                target: TTarget,
                index: number = 0): TTarget {
                if (!target) throw new Exceptions.ArgumentNullException("target");

                const count = this.getCount();
                if (count) {
                    const newLength = count + index;
                    if (target.length < newLength) target.length = newLength;

                    const e = this.getEnumerator();
                    while (e.moveNext()) // Disposes when finished.
                    {
                        target[index++] = (e.current as any);
                    }
                }
                return target;
            }

            /**
             * Returns an array of the collection contents.
             * @returns {any[]|Array}
             */
            toArray(): T[] {
                const count = this.getCount();
                return count
                    ? this.copyTo(count > 65536 ? new Array<T>(count) : [])
                    : [];
            }

            private _linq?: ILinqEnumerable<T>;

            /**
             * .linq will return an ILinqEnumerable if .linqAsync() has completed successfully or the default module loader is NodeJS+CommonJS.
             * @returns {ILinqEnumerable}
             */
            get linq(): ILinqEnumerable<T> {
                this.throwIfDisposed();
                let e = this._linq;

                if (!e) {

                    let r: any;
                    try { r = eval("require"); } catch (ex) { }

                    this._linq = e = System.Linq.Enumerable.from(this);
                    if (!e) {
                        throw isRequireJS ? `using .linq to load and initialize a ILinqEnumerable is currently only supported within a NodeJS environment. Import System.Linq/Linq and use Enumerable.from(e) instead. You can also preload the Linq module as a dependency or use .linqAsync(callback) for AMD/RequireJS.` : "There was a problem importing System.Linq/Linq";
                    }
                }

                return e;
            }

            /**
             * .linqAsync() is for use with deferred loading.
             * Ensures an instance of the Linq extensions is available and then passes it to the callback.
             * Returns an ILinqEnumerable if one is already available, otherwise undefined.
             * Passing no parameters will still initiate loading and initializing the ILinqEnumerable which can be useful for pre-loading.
             * Any call to .linqAsync() where an ILinqEnumerable is returned can be assured that any subsequent calls to .linq will return the same instance.
             * @param callback
             * @returns {ILinqEnumerable}
             */
            linqAsync(callback?: Action<ILinqEnumerable<T>>): ILinqEnumerable<T> | undefined {
                this.throwIfDisposed();
                let e = this._linq;

                if (!e) {
                    if (isRequireJS) {
                        eval("require")([LINQ_PATH], (linq: any) => {
                            // Could end up being called more than once, be sure to check for ._linq before setting...
                            e = this._linq;
                            if (!e) this._linq = e = linq.default.from(this);
                            if (!e) throw "There was a problem importing System.Linq/Linq";
                            if (callback) callback(e);
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

                if (e && callback) callback(e);

                return e;
            }
        }

        export abstract class ReadOnlyCollectionBase<T> extends CollectionBase<T>
        {

            protected abstract _getCount(): number;

            protected getCount(): number {
                return this._getCount();
            }

            protected getIsReadOnly(): boolean {
                return true;
            }

            //noinspection JSUnusedLocalSymbols
            protected _addInternal(entry: T): boolean {
                return false;
            }

            //noinspection JSUnusedLocalSymbols
            protected _removeInternal(entry: T, max?: number): number {
                return 0;
            }

            protected _clearInternal(): number {
                return 0;
            }

            protected abstract _getEnumerator(): Enumeration.IEnumerator<T>;

            getEnumerator(): Enumeration.IEnumerator<T> {
                return this._getEnumerator();
            }

        }

        import enumeratorFrom = Enumeration.from;
        export class ReadOnlyCollectionWrapper<T> extends ReadOnlyCollectionBase<T>
        {
            constructor(collection: ICollection<T> | ArrayLike<T>) {
                super();

                if (!collection)
                    throw new Exceptions.ArgumentNullException("collection");

                const _ = this;
                // Attempting to avoid contact with the original collection.
                if (Type.isArrayLike(collection)) {
                    _._getCount = () => collection.length;
                    _._getEnumerator = () => enumeratorFrom(collection);
                } else {
                    _._getCount = () => collection.count;
                    _._getEnumerator = () => collection.getEnumerator();
                }

            }

            private __getCount: () => number;
            private __getEnumerator: () => Enumeration.IEnumerator<T>;

            protected _getCount(): number {
                this.throwIfDisposed();
                return this.__getCount();
            }

            protected _getEnumerator(): Enumeration.IEnumerator<T> {
                this.throwIfDisposed();
                return this.__getEnumerator();
            }

            protected _onDispose() {
                super._onDispose();
                this.__getCount = (null as any);
                this.__getEnumerator = (null as any);
            }

        }

        export class LazyList<T> extends ReadOnlyCollectionBase<T> implements IReadOnlyList<T>
        {

            private _enumerator: Enumeration.IEnumerator<T> | null;
            private _cached: T[] | null;

            constructor(source: Enumeration.IEnumerable<T>) {
                super();
                this._enumerator = source.getEnumerator();
                this._cached = [];
            }

            protected _onDispose(): void {
                super._onDispose();
                const e = this._enumerator;
                this._enumerator = null;
                if (e) e.dispose();

                const c = this._cached;
                this._cached = null;
                if (c) c.length = 0;
            }

            protected _getCount(): number {
                this.finish();
                const c = this._cached;
                return c ? c.length : 0;
            }

            protected _getEnumerator(): Enumeration.IEnumerator<T> {
                let current: number;
                return new Enumeration.EnumeratorBase<T>(
                    () => {
                        current = 0;
                    },
                    yielder => {
                        this.throwIfDisposed();
                        const c = this._cached!;
                        return (current < c.length || this.getNext())
                            ? yielder.yieldReturn(c[current++])
                            : yielder.yieldBreak();
                    });
            }

            get(index: number): T {
                this.throwIfDisposed();
                Integer.assertZeroOrGreater(index);

                const c = this._cached!;
                while (c.length <= index && this.getNext())
                { }

                if (index < c.length)
                    return c[index];

                throw new Exceptions.ArgumentOutOfRangeException("index", "Greater than total count.");
            }

            indexOf(item: T): number {
                this.throwIfDisposed();
                const c = this._cached!;
                let result = c.indexOf(item);
                while (result == -1 && this.getNext(value => {
                    if (value == item)
                        result = c.length - 1;
                }))
                { }
                return result;
            }

            contains(item: T): boolean {
                return this.indexOf(item) != -1;
            }

            private getNext(out?: Action<T>): boolean {
                const e = this._enumerator;
                if (!e) return false;
                if (e.moveNext()) {
                    const value = e.current!;
                    this._cached!.push(value);
                    if (out) out(value);
                    return true;
                }
                else {
                    e.dispose();
                    this._enumerator = (null as any);
                }
                return false;
            }

            private finish(): void {
                while (this.getNext())
                { }
            }

        }

        class InternalNode<T>
            implements ILinkedNode<InternalNode<T>>, INodeWithValue<T>
        {
            constructor(
                public value: T,
                public previous?: InternalNode<T> | null,
                public next?: InternalNode<T> | null) {
            }

            external?: ILinkedListNode<T>;

            assertDetached(): true | never {
                if (this.next || this.previous)
                    throw new Exceptions.InvalidOperationException(
                        "Adding a node that is already placed.");
                return true;
            }

        }

        function ensureExternal<T>(
            node: InternalNode<T> | null | undefined,
            list: LinkedList<T>): ILinkedListNode<T> | null {
            if (!node)
                return null;
            if (!list)
                throw new Exceptions.ArgumentNullException("list");

            let external = node.external;
            if (!external)
                node.external = external = new LinkedListNode<T>(list, node);

            return external || null;
        }

        function getInternal<T>(node: ILinkedListNode<T>, list: LinkedList<T>): InternalNode<T> {
            if (!node)
                throw new Exceptions.ArgumentNullException("node");
            if (!list)
                throw new Exceptions.ArgumentNullException("list");

            if (node.list != list)
                throw new Exceptions.InvalidOperationException(
                    "Provided node does not belong to this list.");

            let n: InternalNode<T> = (node as any)._nodeInternal;
            if (!n)
                throw new Exceptions.InvalidOperationException(
                    "Provided node is not valid.");

            return n;
        }

        function detachExternal(node: InternalNode<any>): void {
            if (node) {
                const e: any = node.external;
                if (e) {
                    e._list = VOID0;
                    e._nodeInternal = VOID0;
                }
                node.external = VOID0;
            }
        }

        export class LinkedList<T> extends CollectionBase<T> implements ILinkedList<T>
        {
            private readonly _listInternal: LinkedNodeList<InternalNode<T>>;

            constructor(
                source?: Enumeration.IEnumerableOrArray<T>,
                equalityComparer: EqualityComparison<T> = Compare.areEqual) {
                super(VOID0, equalityComparer);
                this._listInternal = new LinkedNodeList<InternalNode<T>>();
                this._importEntries(source);
            }

            protected assertVersion(version: number): true | never {
                if (this._listInternal)
                    return this._listInternal.assertVersion(version);
                else // In case it's been disposed.
                    return super.assertVersion(version);
            }

            protected _onDispose(): void {
                super._onDispose();
                const l = this._listInternal;
                (this as any)._listInternal = null;
                l.dispose();
            }

            protected getCount(): number {
                const li = this._listInternal;
                return li ? li.unsafeCount : 0;
            }

            protected _addInternal(entry: T): boolean {
                this._listInternal.addNode(new InternalNode(entry));
                return true;
            }

            protected _removeInternal(entry: T, max: number = Infinity): number {
                const _ = this,
                    equals = _._equalityComparer,
                    list = _._listInternal;
                let removedCount = 0;

                list.forEach(node => {
                    if (node && equals(entry, node.value) && _._removeNodeInternal(node))
                        removedCount++;

                    return removedCount < max;
                }, true /* override versioning check */);

                return removedCount;
            }

            protected _clearInternal(): number {
                const list = this._listInternal;
                list.forEach(node => detachExternal(node));
                return list.clear();
            }

            forEach(action: ActionWithIndex<T>, useCopy?: boolean): number;
            forEach(action: PredicateWithIndex<T>, useCopy?: boolean): number;
            forEach(action: ActionWithIndex<T> | PredicateWithIndex<T>,
                useCopy: boolean = false): number {
                this.throwIfDisposed();
                return useCopy
                    ? super.forEach(action, useCopy)
                    : this._listInternal.forEach((node, i) => action(node.value as any, i));
            }

            // #endregion

            // #region IEnumerable<T>
            getEnumerator(): Enumeration.IEnumerator<T> {
                this.throwIfDisposed();
                return LinkedNodeList.valueEnumeratorFrom<T>(this._listInternal as any);
            }

            // #endregion

            private _findFirst(entry: T): InternalNode<T> | null {
                //noinspection UnnecessaryLocalVariableJS
                const
                    _ = this,
                    equals = _._equalityComparer;

                let next: any = _._listInternal && _._listInternal.first;
                while (next) {
                    if (equals(entry, next.value))
                        return next;
                    next = next.next;
                }
                return null;
            }

            private _findLast(entry: T): InternalNode<T> | null {
                //noinspection UnnecessaryLocalVariableJS
                const
                    _ = this,
                    equals = _._equalityComparer;

                let prev: any = _._listInternal && _._listInternal.last;
                while (prev) {
                    if (equals(entry, prev.value))
                        return prev;
                    prev = prev.previous;
                }
                return null;
            }

            removeOnce(entry: T): boolean {
                return this.remove(entry, 1) !== 0;
            }

            get first(): ILinkedListNode<T> | null {
                const li = this._listInternal;
                return li && ensureExternal(li.first, this);
            }

            get firstValue(): T | undefined {
                const li = this._listInternal, node = li && li.first;
                return node ? node.value : VOID0;
            }

            get last(): ILinkedListNode<T> | null {
                const li = this._listInternal;
                return ensureExternal(li.last, this);
            }

            get lastValue(): T | undefined {
                const li = this._listInternal, node = li && li.last;
                return node ? node.value : VOID0;
            }

            // get methods are available for convenience but is an n*index operation.


            getValueAt(index: number): T | undefined {
                const li = this._listInternal, node = li && li.getNodeAt(index);
                return node ? node.value : VOID0;
            }

            getNodeAt(index: number): ILinkedListNode<T> | null {
                const li = this._listInternal;
                return li && ensureExternal(li.getNodeAt(index), this);
            }

            find(entry: T): ILinkedListNode<T> | null {
                const li = this._listInternal;
                return li && ensureExternal(this._findFirst(entry), this);
            }

            findLast(entry: T): ILinkedListNode<T> | null {
                const li = this._listInternal;
                return li && ensureExternal(this._findLast(entry), this);
            }

            addFirst(entry: T): void {
                this.assertModifiable();
                this._listInternal.addNodeBefore(new InternalNode(entry));
                this._signalModification(true);
            }

            addLast(entry: T): void {
                this.add(entry);
            }

            private _removeNodeInternal(node: InternalNode<T> | null | undefined): boolean {
                const _ = this;
                if (node && _._listInternal.removeNode(node)) {
                    detachExternal(node);
                    _._signalModification(true);
                    return true;
                }
                return false;
            }

            removeFirst(): boolean {
                const _ = this;
                _.assertModifiable();
                return _._removeNodeInternal(_._listInternal.first);
            }

            removeLast(): boolean {
                const _ = this;
                _.assertModifiable();
                return _._removeNodeInternal(_._listInternal.last);
            }

            removeAt(index: number): boolean {
                const _ = this;
                _.assertModifiable();
                return _._removeNodeInternal(_._listInternal.getNodeAt(index));
            }

            // Returns true if successful and false if not found (already removed).
            removeNode(node: ILinkedListNode<T>): boolean {
                const _ = this;
                _.assertModifiable();
                return _._removeNodeInternal(getInternal(node, _));
            }

            addBefore(before: ILinkedListNode<T>, entry: T): void {
                const _ = this;
                _.assertModifiable();
                _._listInternal.addNodeBefore(
                    new InternalNode(entry),
                    getInternal(before, _)
                );

                _._signalModification(true);
            }

            addAfter(after: ILinkedListNode<T>, entry: T): void {
                const _ = this;
                _.assertModifiable();
                _._listInternal.addNodeAfter(
                    new InternalNode(entry),
                    getInternal(after, _)
                );

                _._signalModification(true);
            }

        }

        // Use an internal node class to prevent mucking up the LinkedList.
        class LinkedListNode<T> implements ILinkedListNode<T>, Disposable.IDisposable {
            constructor(
                private _list: LinkedList<T>,
                private _nodeInternal: InternalNode<T>) {
            }

            private throwIfDetached(): void {
                if (!this._list)
                    throw new Error("This node has been detached from its list and is no longer valid.");
            }

            get list(): LinkedList<T> {
                return this._list;
            }

            get previous(): ILinkedListNode<T> | null {
                this.throwIfDetached();
                return ensureExternal(this._nodeInternal.previous, this._list);
            }

            get next(): ILinkedListNode<T> | null {
                this.throwIfDetached();
                return ensureExternal(this._nodeInternal.next, this._list);
            }

            get value(): T {
                this.throwIfDetached();
                return this._nodeInternal.value;
            }

            set value(v: T) {
                this.throwIfDetached();
                this._nodeInternal.value = v;
            }

            addBefore(entry: T): void {
                this.throwIfDetached();
                this._list.addBefore(this, entry);
            }

            addAfter(entry: T): void {
                this.throwIfDetached();
                this._list.addAfter(this, entry);
            }


            remove(): void {
                const _: any = this;
                const list = _._list;
                if (list) list.removeNode(this);
                _._list = VOID0;
                _._nodeInternal = VOID0;
            }

            dispose(): void {
                this.remove();
            }

        }

        export class LinkedNodeList<TNode extends ILinkedNode<TNode>>
            implements ILinkedNodeList<TNode>, Enumeration.IEnumerateEach<TNode>, Disposable.IDisposable {

            private _first: TNode | null;
            private _last: TNode | null;
            unsafeCount: number;

            constructor() {
                this._first = null;
                this._last = null;
                this.unsafeCount = 0;
                this._version = 0;
            }

            private _version: number;

            assertVersion(version: number): true | never {
                if (version !== this._version)
                    throw new Exceptions.InvalidOperationException("Collection was modified.");
                return true;
            }

            /**
             * The first node.  Will be null if the collection is empty.
             */
            get first(): TNode | null {
                return this._first;
            }

            /**
             * The last node.
             */
            get last(): TNode | null {
                return this._last;
            }


            /**
             * Iteratively counts the number of linked nodes and returns the value.
             * @returns {number}
             */
            get count(): number {

                let next: TNode | null | undefined = this._first;

                let i: number = 0;
                while (next) {
                    i++;
                    next = next.next;
                }

                return i;
            }

            // Note, no need for 'useCopy' since this avoids any modification conflict.
            // If iterating over a arrayCopy is necessary, a arrayCopy should be made manually.
            forEach(
                action: ActionWithIndex<TNode> | PredicateWithIndex<TNode>, ignoreVersioning?: boolean): number {
                const _ = this;
                let current: TNode | null | undefined = null,
                    next: TNode | null | undefined = _.first; // Be sure to track the next node so if current node is removed.

                const version = _._version;
                let index: number = 0;
                do {
                    if (!ignoreVersioning) _.assertVersion(version);
                    current = next;
                    next = current && current.next;
                }
                while (current
                    && (action(current, index++) as any) !== false);

                return index;
            }

            map<T>(selector: Selector<TNode, T> |SelectorWithIndex<TNode, T>): T[] {
                if (!selector) throw new Exceptions.ArgumentNullException("selector");

                const result: T[] = [];
                this.forEach((node, i) => {
                    result.push((selector as any)(node, i));
                });
                return result;
            }

            /**
             * Erases the linked node's references to each other and returns the number of nodes.
             * @returns {number}
             */
            clear(): number {
                const _ = this;
                let n: TNode | null | undefined, cF: number = 0, cL: number = 0;

                // First, clear in the forward direction.
                n = _._first;
                _._first = null;

                while (n) {
                    cF++;
                    let current = n;
                    n = n.next;
                    current.next = null;
                }

                // Last, clear in the reverse direction.
                n = _._last;
                _._last = null;

                while (n) {
                    cL++;
                    let current = n;
                    n = n.previous;
                    current.previous = null;
                }

                if (cF !== cL) console.warn("LinkedNodeList: Forward versus reverse count does not match when clearing. Forward: " + cF + ", Reverse: " + cL);

                _._version++;
                _.unsafeCount = 0;

                return cF;
            }

            /**
             * Clears the list.
             */
            dispose(): void {
                this.clear();
            }

            /**
             * Iterates the list to see if a node exists.
             * @param node
             * @returns {boolean}
             */
            contains(node: TNode): boolean {
                return this.indexOf(node) != -1;
            }


            /**
             * Gets the index of a particular node.
             * @param index
             */
            getNodeAt(index: number): TNode | null {
                if (index < 0)
                    return null;

                let next = this._first;

                let i: number = 0;
                while (next && i++ < index) {
                    next = next.next || null;
                }

                return next;

            }

            find(condition: PredicateWithIndex<TNode>): TNode | null {
                let node: TNode | null = null;
                this.forEach((n, i) => {
                    if (condition(n, i)) {
                        node = n;
                        return false;
                    }
                });
                return node;
            }

            /**
             * Iterates the list to find the specified node and returns its index.
             * @param node
             * @returns {boolean}
             */
            indexOf(node: TNode): number {
                if (node && (node.previous || node.next)) {

                    let index = 0;
                    let c: TNode | null | undefined,
                        n: TNode | null | undefined = this._first;

                    do {
                        c = n;
                        if (c === node) return index;
                        index++;
                    }
                    while ((n = c && c.next));
                }

                return -1;
            }

            /**
             * Removes the first node and returns true if successful.
             * @returns {boolean}
             */
            removeFirst(): boolean {
                return !!this._first && this.removeNode(this._first);
            }

            /**
             * Removes the last node and returns true if successful.
             * @returns {boolean}
             */
            removeLast(): boolean {
                return !!this._last && this.removeNode(this._last);
            }


            /**
             * Removes the specified node.
             * Returns true if successful and false if not found (already removed).
             * @param node
             * @returns {boolean}
             */
            removeNode(node: TNode): boolean {
                if (node == null)
                    throw new Exceptions.ArgumentNullException("node");

                const _ = this;
                const prev: TNode | null = node.previous || null,
                    next: TNode | null = node.next || null;

                let a: boolean = false,
                    b: boolean = false;

                if (prev) prev.next = next;
                else if (_._first == node) _._first = next;
                else a = true;

                if (next) next.previous = prev;
                else if (_._last == node) _._last = prev;
                else b = true;

                if (a !== b) {
                    throw new Exceptions.ArgumentException(
                        "node", format(
                            "Provided node is has no {0} reference but is not the {1} node!",
                            a ? "previous" : "next", a ? "first" : "last"
                        )
                    );
                }

                const removed = !a && !b;
                if (removed) {
                    _._version++;
                    _.unsafeCount--;
                    node.previous = null;
                    node.next = null;
                }
                return removed;

            }

            /**
             * Adds a node to the end of the list.
             * @param node
             */
            addNode(node: TNode): void {
                this.addNodeAfter(node);
            }


            /**
             * Inserts a node before the specified 'before' node.
             * If no 'before' node is specified, it inserts it as the first node.
             * @param node
             * @param before
             */
            addNodeBefore(node: TNode, before: TNode | null = null): void {
                assertValidDetached(node);

                const _ = this;

                if (!before) {
                    before = _._first;
                }

                if (before) {
                    let prev = before.previous;
                    node.previous = prev;
                    node.next = before;

                    before.previous = node;
                    if (prev) prev.next = node;
                    if (before == _._first) _._first = node;
                }
                else {
                    _._first = _._last = node;
                }

                _._version++;
                _.unsafeCount++;
            }

            /**
             * Inserts a node after the specified 'after' node.
             * If no 'after' node is specified, it appends it as the last node.
             * @param node
             * @param after
             */
            addNodeAfter(node: TNode, after: TNode | null = null): void {
                assertValidDetached(node);
                const _ = this;

                if (!after) {
                    after = _._last;
                }

                if (after) {
                    let next = after.next;
                    node.next = next;
                    node.previous = after;

                    after.next = node;
                    if (next) next.previous = node;
                    if (after == _._last) _._last = node;
                }
                else {
                    _._first = _._last = node;
                }

                _._version++;
                _.unsafeCount++;

            }

            /**
             * Takes and existing node and replaces it.
             * @param node
             * @param replacement
             */
            replace(node: TNode, replacement: TNode): void {

                if (node == null)
                    throw new Exceptions.ArgumentNullException("node");

                if (node == replacement) return;

                assertValidDetached(replacement, "replacement");

                const _ = this;
                replacement.previous = node.previous;
                replacement.next = node.next;

                if (node.previous) node.previous.next = replacement;
                if (node.next) node.next.previous = replacement;

                if (node == _._first) _._first = replacement;
                if (node == _._last) _._last = replacement;

                _._version++;
            }

            static valueEnumeratorFrom<T>(list: LinkedNodeList<ILinkedNodeWithValue<T>>): Enumeration.IEnumerator<T> {

                if (!list) throw new Exceptions.ArgumentNullException("list");

                let current: ILinkedNodeWithValue<T> | null | undefined,
                    next: ILinkedNodeWithValue<T> | null | undefined,
                    version: number;

                return new Enumeration.EnumeratorBase<T>(
                    () => {
                        // Initialize anchor...
                        current = null;
                        next = list.first;
                        version = list._version;
                    },
                    (yielder) => {
                        if (next) {
                            list.assertVersion(version);

                            current = next;
                            next = current && current.next;
                            return yielder.yieldReturn(current.value);
                        }

                        return yielder.yieldBreak();
                    }
                );
            }

            static copyValues<T, TDestination extends ArrayLikeWritable<any>>(
                list: LinkedNodeList<ILinkedNodeWithValue<T>>,
                array: TDestination,
                index: number = 0): TDestination {
                if (list && list.first) {
                    if (!array) throw new Exceptions.ArgumentNullException("array");

                    list.forEach(
                        (node, i) => {
                            array[index + i] = node.value;
                        }
                    );
                }

                return array;
            }

        }

        export class List<T> extends CollectionBase<T> implements IList<T>, Enumeration.IEnumerateEach<T>
        {

            protected readonly _source: T[];

            constructor(
                source?: Enumeration.IEnumerableOrArray<T>,
                equalityComparer: EqualityComparison<T> = Compare.areEqual) {
                super(VOID0, equalityComparer);
                if ((source) instanceof (Array)) {
                    this._source = source.slice();
                }
                else {
                    this._source = [];
                    this._importEntries(source);
                }
            }

            protected _onDispose() {
                super._onDispose();
                (this as any)._source = null;
            }

            protected getCount(): number {
                return this._source.length;
            }

            protected _addInternal(entry: T): boolean {
                this._source.push(entry);
                return true;
            }

            protected _removeInternal(entry: T, max: number = Infinity): number {
                return ArrayModule.remove(
                    this._source, entry, max,
                    this._equalityComparer);
            }

            protected _clearInternal(): number {
                const len = this._source.length;
                this._source.length = 0;
                return len;
            }

            protected _importEntries(entries: Enumeration.IEnumerableOrArray<T> | null | undefined): number {
                if (Type.isArrayLike(entries)) {
                    let len = entries.length;
                    if (!len) return 0;
                    const s = this._source;

                    const first = s.length;
                    s.length += len;
                    for (let i = 0; i < len; i++) {
                        s[i + first] = entries[i];
                    }

                    return len;
                }
                else {
                    return super._importEntries(entries);
                }
            }

            get(index: number): T {
                return this._source[index];
            }

            set(index: number, value: T): boolean {
                const s = this._source;
                if (index < s.length && Compare.areEqual(value, s[index]))
                    return false;

                s[index] = value;
                this._signalModification(true);
                return true;
            }

            indexOf(item: T): number {
                return ArrayModule.indexOf(
                    this._source, item,
                    this._equalityComparer);
            }

            insert(index: number, value: T): void {
                const _ = this;
                const s = _._source;
                if (index < s.length) {
                    _._source.splice(index, 0, value);
                }
                else {
                    _._source[index] = value;
                }
                _._signalModification(true);
            }

            removeAt(index: number): boolean {
                if (ArrayModule.removeIndex(this._source, index)) {
                    this._signalModification(true);
                    return true;
                }
                return false;
            }

            contains(item: T): boolean {
                return ArrayModule.contains(
                    this._source, item,
                    this._equalityComparer);
            }

            copyTo<TTarget extends ArrayLikeWritable<any>>(target: TTarget, index?: number): TTarget {
                return ArrayModule.copyTo(this._source, target, 0, index);
            }

            getEnumerator(): Enumeration.IEnumerator<T> {
                const _ = this;
                _.throwIfDisposed();

                let source: T[], index: number, version: number;
                return new Enumeration.EnumeratorBase<T>(
                    () => {
                        source = _._source;
                        version = _._version;
                        index = 0;
                    },
                    (yielder) => {
                        if (index) _.throwIfDisposed();
                        else if (_.wasDisposed) {
                            // We never actually started? Then no biggie.
                            return yielder.yieldBreak();
                        }

                        _.assertVersion(version);

                        if (index >= source.length) // Just in case the size changes as we enumerate use '>='.
                            return yielder.yieldBreak();

                        return yielder.yieldReturn(source[index++]);
                    }
                );
            }


            forEach(action: ActionWithIndex<T>, useCopy?: boolean): number;
            forEach(action: PredicateWithIndex<T>, useCopy?: boolean): number;
            forEach(action: ActionWithIndex<T> | PredicateWithIndex<T>, useCopy?: boolean): number {
                const s = this._source;
                return Enumeration.forEach(useCopy ? s.slice() : this, action);
            }

            addRange(entries: IList<T>): void {
                entries.toArray().forEach(entry => this.add(entry));
            }

        }

        module QueueModule {
            export const AU = ArrayModule;

            export const MINIMUM_GROW: number = 4;
            export const SHRINK_THRESHOLD: number = 32; // Unused?
            // var GROW_FACTOR: number = 200;  // double each time
            export const GROW_FACTOR_HALF: number = 100;
            export const DEFAULT_CAPACITY: number = MINIMUM_GROW;
            export const emptyArray: any = Object.freeze([]);

            export function assertZeroOrGreater(value: number, property: string): true | never {
                if (value < 0)
                    throw new Exceptions.ArgumentOutOfRangeException(property, value, "Must be greater than zero");

                return true;
            }

            export function assertIntegerZeroOrGreater(value: number, property: string): true | never {
                Integer.assert(value, property);
                return assertZeroOrGreater(value, property);
            }
        }

        export class Queue<T> extends CollectionBase<T>
        {

            private _array: T[];
            private _head: number;       // First valid element in the queue
            private _tail: number;       // Last valid element in the queue
            private _size: number;       // Number of elements.
            private _capacity: number;   // Maps to _array.length;

            constructor(
                source?: Enumeration.IEnumerableOrArray<T> | number,
                equalityComparer: EqualityComparison<T> = Compare.areEqual) {
                super(VOID0, equalityComparer);
                const _ = this;
                _._head = 0;
                _._tail = 0;
                _._size = 0;

                if (!source)
                    _._array = QueueModule.emptyArray;
                else {
                    if (Type.isNumber(source)) {
                        const capacity = source as number;
                        QueueModule.assertIntegerZeroOrGreater(capacity, "capacity");

                        _._array = capacity
                            ? QueueModule.AU.initialize<T>(capacity)
                            : QueueModule.emptyArray;
                    }
                    else {
                        const se = source as Enumeration.IEnumerableOrArray<T>;
                        _._array = QueueModule.AU.initialize<T>(
                            Type.isArrayLike(se)
                                ? se.length
                                : QueueModule.DEFAULT_CAPACITY
                        );

                        _._importEntries(se);
                    }
                }

                _._capacity = _._array.length;
            }

            protected getCount(): number {
                return this._size;
            }

            protected _addInternal(item: T): boolean {
                const _ = this;
                const size = _._size;
                let len = _._capacity;
                if (size == len) {
                    let newCapacity = len * QueueModule.GROW_FACTOR_HALF;
                    if (newCapacity < len + QueueModule.MINIMUM_GROW)
                        newCapacity = len + QueueModule.MINIMUM_GROW;

                    _.setCapacity(newCapacity);
                    len = _._capacity;
                }

                const tail = _._tail;
                _._array[tail] = item;
                _._tail = (tail + 1) % len;
                _._size = size + 1;
                return true;
            }

            //noinspection JSUnusedLocalSymbols
            protected _removeInternal(item: T, max?: number): number {
                throw new Exceptions.NotImplementedException(
                    "ICollection\<T\>.remove is not implemented in Queue\<T\>" +
                    " since it would require destroying the underlying array to remove the item."
                );
            }

            protected _clearInternal(): number {
                const _ = this;
                const array = _._array, head = _._head, tail = _._tail, size = _._size;
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
            }

            protected _onDispose(): void {
                super._onDispose();
                const _ = this;
                if (_._array != QueueModule.emptyArray) {
                    _._array.length = _._capacity = 0;
                    _._array = QueueModule.emptyArray;
                }
            }


            /**
             * Dequeues entries into an array.
             */
            dump(max: number = Infinity): T[] {
                const _ = this;
                const result: T[] = [];

                if (isFinite(max)) {
                    Integer.assertZeroOrGreater(max);
                    if (max !== 0) {
                        while (max-- && _._tryDequeueInternal(value => {
                            result.push(value);
                        })) { }
                    }
                }
                else {
                    while (_._tryDequeueInternal(value => {
                        result.push(value);
                    })) { }
                }

                _.trimExcess();
                _._signalModification();

                return result;
            }

            forEach(action: ActionWithIndex<T>): number;
            forEach(action: PredicateWithIndex<T>): number;
            forEach(action: ActionWithIndex<T> | PredicateWithIndex<T>): number {
                return super.forEach(action, true);
            }

            setCapacity(capacity: number): void {
                const _ = this;
                QueueModule.assertIntegerZeroOrGreater(capacity, "capacity");

                const array = _._array, len = _._capacity;
                if (capacity > len) _.throwIfDisposed();
                if (capacity == len)
                    return;

                const head = _._head, tail = _._tail, size = _._size;

                // Special case where we can simply extend the length of the array. (JavaScript only)
                if (array != QueueModule.emptyArray && capacity > len && head < tail) {
                    array.length = _._capacity = capacity;
                    _._version++;
                    return;
                }

                // We create a new array because modifying an existing one could be slow.
                const newArray: T[] = QueueModule.AU.initialize<T>(capacity);
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
            }

            enqueue(item: T): void {
                this.add(item);
            }

            protected _tryDequeueInternal(out: Action<T>): boolean {
                const _ = this;
                if (!_._size) return false;

                const array = _._array, head = _._head;

                const removed = _._array[head];
                array[head] = (null as any);
                _._head = (head + 1) % _._capacity;

                _._size--;

                _._incrementModified();

                out(removed);

                return true;
            }

            /**
             * Pulls an entry from the head of the queue and returns it.
             * Returns undefined if the queue is already empty.
             */
            dequeue(): T | undefined;

            /**
             * Pulls an entry from the head of the queue and returns it.
             * Returns undefined if the queue is already empty and throwIfEmpty is false.
             * Throws an InvalidOperationException if the queue is already empty and throwIfEmpty is true.
             * @param throwIfEmpty
             */
            dequeue(throwIfEmpty: true): T;

            /**
             * Pulls an entry from the head of the queue and returns it.
             * Returns undefined if the queue is already empty and throwIfEmpty is false.
             * Throws an InvalidOperationException if the queue is already empty and throwIfEmpty is true.
             * @param throwIfEmpty
             */
            dequeue(throwIfEmpty: boolean): T | undefined;
            dequeue(throwIfEmpty: boolean = false): T | undefined {
                const _ = this;
                _.assertModifiable();

                let result: T | undefined = VOID0;
                if (!this.tryDequeue(value => { result = value; }) && throwIfEmpty)
                    throw new Exceptions.InvalidOperationException("Cannot dequeue an empty queue.");
                return result;
            }

            /**
             * Checks to see if the queue has entries an pulls an entry from the head of the queue and passes it to the out handler.
             * @param out The 'out' handler that receives the value if it exists.
             * @returns {boolean} True if a value was retrieved.  False if not.
             */
            tryDequeue(out: Action<T>): boolean {
                const _ = this;
                if (!_._size) return false;
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
            }

            private _getElement(index: number): T {
                QueueModule.assertIntegerZeroOrGreater(index, "index");

                const _ = this;
                return _._array[(_._head + index) % _._capacity];
            }

            /**
             * Returns the entry at the head of the queue.
             * Returns undefined if the queue is already empty.
             */
            peek(): T | undefined;

            /**
             * Returns the entry at the head of the queue.
             * Returns undefined if the queue is already empty and throwIfEmpty is false.
             * Throws an InvalidOperationException if the queue is already empty and throwIfEmpty is true.
             * @param throwIfEmpty
             */
            peek(throwIfEmpty: true): T;

            /**
             * Returns the entry at the head of the queue.
             * Returns undefined if the queue is already empty and throwIfEmpty is false.
             * Throws an InvalidOperationException if the queue is already empty and throwIfEmpty is true.
             * @param throwIfEmpty
             */
            peek(throwIfEmpty: boolean): T | undefined;
            peek(throwIfEmpty: boolean = false): T | undefined {
                if (this._size == 0) {
                    if (throwIfEmpty)
                        throw new Exceptions.InvalidOperationException("Cannot call peek on an empty queue.");
                    return VOID0;
                }


                return this._array[this._head];
            }

            trimExcess(threshold?: number): void {
                const _ = this;
                const size = _._size;
                if (size < Math.floor(_._capacity * 0.9) && (!threshold && threshold !== 0 || isNaN(threshold) || threshold < size))
                    _.setCapacity(size);
            }

            getEnumerator(): Enumeration.IEnumerator<T> {
                const _ = this;
                _.throwIfDisposed();

                let index: number, version: number, size: number;
                return new Enumeration.EnumeratorBase<T>(
                    () => {
                        version = _._version;
                        size = _._size;
                        index = 0;
                    },
                    (yielder) => {
                        _.throwIfDisposed();
                        _.assertVersion(version);

                        if (index == size)
                            return yielder.yieldBreak();

                        return yielder.yieldReturn(_._getElement(index++));
                    }
                );
            }
        }

        export module MapUtility {
            /**
             * Takes a target object and applies all source values to it.
             * @param target
             * @param source
             * @returns {any}
             */
            export function apply<T extends IMap<any>, U extends IMap<any>>(
                target: T,
                source: U): T & U {
                const result: any = target || {};
                for (const key in source) {
                    if (source.hasOwnProperty(key)) {
                        result[key] = (source as any)[key];
                    }
                }
                return result;
            }

            /**
             * Takes a target object and ensures values exist.
             * @param target
             * @param defaults
             * @returns {any}
             */
            export function ensure<T extends IMap<any>, U extends IMap<any>>(
                target: T,
                defaults: U): T & U {
                const result: any = target || {};
                for (const key in defaults) {
                    if (defaults.hasOwnProperty(key) && !result.hasOwnProperty(key)) {
                        result[key] = (defaults as any)[key];
                    }
                }
                return result;
            }

            /**
             * Make a copy of the source object.
             * @param source
             * @returns {Object}
             */
            export function copy<T extends IMap<any>>(source: T): T {
                return apply({}, source);
            }


            /**
             * Takes two objects and creates another with the values of both.
             * B overwrites A.
             * @param a
             * @param b
             */
            export function merge<A extends IMap<any>, B extends IMap<any>>(
                a: A,
                b: B): A & B {
                return apply(copy(a), b);
            }

            /**
             * Removes any keys that don't exist on the keyMap.
             * @param target
             * @param keyMap
             */
            export function trim<TResult extends IMap<any>>(target: IMap<any>, keyMap: TResult): void //Partial<TResult>
            {
                for (const key in target) {
                    if (!keyMap.hasOwnProperty(key)) {
                        delete target[key];
                    }
                }
                //return <any>target;
            }
        }

        function assertValidDetached<TNode extends ILinkedNode<TNode>>(
            node: TNode,
            propName: string = "node") {

            if (node == null)
                throw new Exceptions.ArgumentNullException(propName);

            if ((node as ILinkedNode<TNode>).next || (node as ILinkedNode<TNode>).previous)
                throw new Exceptions.InvalidOperationException("Cannot add a node to a LinkedNodeList that is already linked.");

        }

        function wipe(map: IMap<any>, depth: number = 1): void {
            if (map && depth) {
                for (let key of Object.keys(map)) {
                    let v = map[key];
                    delete map[key];
                    wipe(v, depth - 1);
                }
            }
        }

        export class KeyNotFoundException extends Exceptions.SystemException {
            protected getName(): string {
                return "KeyNotFoundException ";
            }
        }

        export namespace InternalSet {
            import IDisposable = Disposable.IDisposable;
            import using = Disposable.using;
            import IEnumerableOrArray = Enumeration.IEnumerableOrArray;
            import IEnumerator = Enumeration.IEnumerator;
            import areEqual = Compare.areEqual;
            import ArgumentNullException = Exceptions.ArgumentNullException;
            import forEach = Enumeration.forEach;
            import EmptyEnumerator = Enumeration.EmptyEnumerator;

            const VOID0: undefined = void 0;
            const OTHER = 'other';

            export function getId(obj: any): string | number | symbol {
                return Dictionaries.getIdentifier(obj, typeof obj != Type.BOOLEAN);
            }

            export abstract class SetBase<T>
                extends CollectionBase<T> implements ISet<T>, IDisposable {

                constructor(source?: IEnumerableOrArray<T>) {
                    super(VOID0, areEqual);
                    this._importEntries(source);
                }

                protected abstract newUsing(source?: IEnumerableOrArray<T>): SetBase<T>;

                protected _set: LinkedNodeList<ILinkedNodeWithValue<T>>;

                protected _getSet(): LinkedNodeList<ILinkedNodeWithValue<T>> {
                    let s = this._set;
                    if (!s) this._set = s = new LinkedNodeList<ILinkedNodeWithValue<T>>();
                    return s;
                }

                protected getCount(): number {
                    return this._set ? this._set.unsafeCount : 0;
                }

                exceptWith(other: IEnumerableOrArray<T>): void {
                    const _ = this;
                    if (!other) throw new ArgumentNullException(OTHER);

                    forEach(other, v => {
                        if (_._removeInternal(v))
                            _._incrementModified();
                    });

                    _._signalModification();
                }

                intersectWith(other: IEnumerableOrArray<T>): void {
                    if (!other) throw new ArgumentNullException(OTHER);

                    const _ = this;
                    if (other instanceof SetBase) {
                        let s = _._set;
                        if (s) s.forEach(n => {
                            if (!other.contains(n.value) && _._removeInternal(<any>n.value))
                                _._incrementModified();
                        }, true);

                        _._signalModification();
                    }
                    else {
                        using(_.newUsing(other), o => _.intersectWith(o));
                    }
                }

                isProperSubsetOf(other: IEnumerableOrArray<T>): boolean {
                    if (!other) throw new ArgumentNullException(OTHER);

                    return other instanceof SetBase
                        ? other.isProperSupersetOf(this)
                        : using(this.newUsing(other), o => o.isProperSupersetOf(this));
                }

                isProperSupersetOf(other: IEnumerableOrArray<T>): boolean {
                    if (!other) throw new ArgumentNullException(OTHER);

                    let result = true, count: number;
                    if (other instanceof SetBase) {
                        result = this.isSupersetOf(other);
                        count = (other as any).getCount();
                    }
                    else {
                        count = using(this.newUsing(), o => {
                            forEach(other, v => {
                                o.add(v); // We have to add to another set in order to filter out duplicates.
                                // contains == false will cause this to exit.
                                return result = this.contains(v);
                            });
                            return o.getCount();
                        });
                    }

                    return result && this.getCount() > count;
                }

                isSubsetOf(other: IEnumerableOrArray<T>): boolean {
                    if (!other) throw new ArgumentNullException(OTHER);

                    return other instanceof SetBase
                        ? other.isSupersetOf(this)
                        : using(this.newUsing(other), o => o.isSupersetOf(this));
                }

                isSupersetOf(other: IEnumerableOrArray<T>): boolean {
                    if (!other) throw new ArgumentNullException(OTHER);

                    let result = true;
                    forEach(other, v => {
                        return result = this.contains(v);
                    });
                    return result;
                }

                overlaps(other: IEnumerableOrArray<T>): boolean {
                    if (!other) throw new ArgumentNullException(OTHER);

                    let result = false;
                    forEach(other, v => !(result = this.contains(v)));
                    return result;
                }

                setEquals(other: IEnumerableOrArray<T>): boolean {
                    if (!other) throw new ArgumentNullException(OTHER);

                    return this.getCount() == (
                        other instanceof SetBase
                            ? (other as any).getCount()
                            : using(this.newUsing(other), o => o.getCount()))
                        && this.isSubsetOf(other);
                }

                symmetricExceptWith(other: IEnumerableOrArray<T>): void {
                    if (!other) throw new ArgumentNullException(OTHER);

                    const _ = this;
                    if (other instanceof SetBase) {
                        forEach(other, v => {
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
                        using(this.newUsing(other), o => _.symmetricExceptWith(o));
                    }
                }

                unionWith(other: IEnumerableOrArray<T>): void {
                    this.importEntries(other);
                }


                protected _clearInternal(): number {
                    const s = this._set;
                    return s ? s.clear() : 0;
                }

                protected _onDispose(): void {
                    super._onDispose();
                    this._set = <any>null;
                }

                protected abstract _getNode(item: T): ILinkedNodeWithValue<T> | undefined;

                contains(item: T): boolean {
                    return !(!this.getCount() || !this._getNode(item));
                }

                getEnumerator(): IEnumerator<T> {
                    const _ = this;
                    _.throwIfDisposed();
                    const s = _._set;
                    return s && _.getCount()
                        ? LinkedNodeList.valueEnumeratorFrom<T>(s)
                        : EmptyEnumerator;
                }

                forEach(action: ActionWithIndex<T>, useCopy?: boolean): number
                forEach(action: PredicateWithIndex<T>, useCopy?: boolean): number
                forEach(action: ActionWithIndex<T> | PredicateWithIndex<T>, useCopy?: boolean): number {
                    return useCopy
                        ? super.forEach(action, useCopy)
                        : this._set.forEach((node, i) => action(<any>node.value, i));
                }

                protected _removeNode(node: ILinkedNodeWithValue<T> | null | undefined): boolean {
                    return !!node
                        && this.remove(<any>node.value) != 0;
                }

                removeFirst(): boolean {
                    const s = this._set;
                    return this._removeNode(s && s.first);
                }

                removeLast(): boolean {
                    const s = this._set;
                    return this._removeNode(s && s.last);
                }


            }

            function wipe(map: IMap<any>, depth: number = 1): void {
                if (map && depth) {
                    for (let key of Object.keys(map)) {
                        const v = map[key];
                        delete map[key];
                        wipe(v, depth - 1);
                    }
                }
            }
        }

        import SetBase = InternalSet.SetBase;
        export class HashSet<T> extends SetBase<T>
        {
            private readonly _keyGenerator: Selector<T, string | number | symbol>;

            constructor(keyGenerator: Selector<T, string | number | symbol>);
            constructor(source: Enumeration.IEnumerableOrArray<T> | undefined, keyGenerator: Selector<T, string | number | symbol>);
            constructor(source: Enumeration.IEnumerableOrArray<T> | Selector<T, string | number | symbol> | undefined, keyGenerator?: Selector<T, string | number | symbol>) {
                super();
                if (Type.isFunction(source)) {
                    this._keyGenerator = source as any;
                } else {
                    if (!keyGenerator)
                        throw new Exceptions.ArgumentNullException("keyGenerator");
                    this._keyGenerator = keyGenerator;
                    this._importEntries(source as any);
                }
            }


            protected newUsing(source?: Enumeration.IEnumerableOrArray<T>): HashSet<T> {
                return new HashSet<T>(source, this._keyGenerator);
            }

            private _registry: IMap<IMap<ILinkedNodeWithValue<T>>>;

            protected _addInternal(item: T): boolean {
                const _ = this;
                const type = typeof item;
                let r = _._registry, t = r && r[type];
                const key = _._keyGenerator(item);
                if (!t || t[key as any] === VOID0) {
                    if (!r) {
                        //noinspection JSUnusedAssignment
                        _._registry = r = {};
                    }
                    if (!t) {
                        //noinspection JSUnusedAssignment
                        r[type] = t = {};
                    }

                    const node: ILinkedNodeWithValue<T> = { value: item };
                    _._getSet().addNode(node);
                    t[key as any] = node;
                    return true;
                }
                return false;
            }

            protected _clearInternal(): number {
                wipe(this._registry, 2);
                return super._clearInternal();
            }

            protected _onDispose(): void {
                super._onDispose();
                this._registry = (null as any);
                (this as any)._keyGenerator = VOID0;
            }

            protected _getNode(item: T): ILinkedNodeWithValue<T> | undefined {
                const r = this._registry, t = r && r[typeof item];
                return t && t[this._keyGenerator(item as any) as any];
            }

            protected _removeInternal(item: T, max: number = Infinity): number {
                if (max === 0) return 0;

                const r = this._registry,
                    t = r && r[typeof item],
                    node = t && t[item as any];

                if (node) {
                    delete t[item as any];
                    const s = this._set;
                    if (s && s.removeNode(node)) {
                        return 1;
                    }
                }

                return 0;
            }

        }

        export class Set<T extends Primitive | Dictionaries.ISymbolizable | symbol> extends HashSet<T>
        {
            constructor(source?: Enumeration.IEnumerableOrArray<T>) {
                super(source, InternalSet.getId);
            }
        }

        export module ArrayModule {
            const Values = Compare;

            export namespace Sorting {
                function ensureArray<T>(value: T | T[]): T[] {
                    return (value) instanceof Array
                        ? (value as T[])
                        : [value as T];
                }

                export module QuickSort {
                    /**
                     * Quick internalSort O(n log (n))
                     * Warning: Uses recursion.
                     * @param target
                     * @returns {T[]}
                     */
                    export function quickSort<T extends Primitive, TArray extends ArrayLikeWritable<T>>(target: TArray): TArray {
                        if (!target) throw new Exceptions.ArgumentNullException("target");
                        const len = target.length;
                        return target.length < 2 ? target : sort(target, 0, len - 1);
                    }

                    function sort<T extends Primitive, TArray extends ArrayLikeWritable<T>>(
                        target: TArray,
                        low: number,
                        high: number): TArray {
                        if (low < high) {
                            // Partition first...
                            let swap: T;
                            const pivotIndex = Math.floor((low + high) / 2);

                            swap = target[pivotIndex];
                            target[pivotIndex] = target[high];
                            target[high] = swap;

                            let i = low;
                            for (let j = low; j < high; j++) {
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
                }

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
                export function createComparer<TSource, TSelect extends Primitive>(
                    selector: Selector<TSource, TSelect | TSelect[]>,
                    order: Collections.Sorting.Order | Collections.Sorting.Order[] = Collections.Sorting.Order.Ascending,
                    equivalentToNaN: any = NaN): Comparison<TSource> {
                    const nanHasEquivalent = !Type.isTrueNaN(equivalentToNaN);

                    return (a: TSource, b: TSource): CompareResult => {
                        // Use an array always to ensure a single code path.
                        const aValue = ensureArray(selector(a));
                        const bValue = ensureArray(selector(b));
                        const len = Math.min(aValue.length, bValue.length);

                        const oArray = (order) instanceof (Array) ? order : null;
                        for (let i = 0; i < len; i++) {
                            let vA = aValue[i],
                                vB = bValue[i];
                            const o = oArray
                                ? (i < oArray.length ? oArray[i] : Collections.Sorting.Order.Ascending)
                                : (order as Collections.Sorting.Order);

                            if (nanHasEquivalent) {
                                if (Type.isTrueNaN(vA))
                                    vA = equivalentToNaN;
                                if (Type.isTrueNaN(vB))
                                    vB = equivalentToNaN;

                            }

                            const r = Compare.compare(vA, vB);
                            if (r !== CompareResult.Equal)
                                return o * r;

                        }

                        return 0;
                    };
                }

                export function insertionSort<T extends Primitive, TArray extends ArrayLikeWritable<T>>(target: TArray): TArray {
                    if (!target) throw new Exceptions.ArgumentNullException("target");
                    const len = target.length;

                    for (let i = 1; i < len; i++) {
                        let j = i, j1: number;

                        while (j > 0 && target[(j1 = j - 1)] > target[j]) {
                            let swap = target[j];
                            target[j] = target[j1];
                            target[j1] = swap;
                            j--;
                        }
                    }

                    return target;

                }

                export module MergeSort {
                    /**
                    * Merge internalSort O(n log (n))
                    * Warning: Uses recursion.
                    * @param target
                    * @returns {number[]}
                    */
                    export function mergeSort<T extends Primitive, TArray extends ArrayLikeWritable<T>>(target: TArray): TArray {
                        if (!target) throw new Exceptions.ArgumentNullException("target");
                        const len = target.length;
                        return len < 2 ? target : sort(target, 0, len, initialize<T>(len));
                    }

                    function sort<T extends Primitive, TArray extends ArrayLikeWritable<T>>(
                        target: TArray,
                        start: number,
                        end: number,
                        temp: ArrayLikeWritable<T>): TArray {
                        if (end - start > 1) {
                            // Step 1: Sort the left and right parts.
                            const middle = Math.floor((start + end) / 2);
                            sort(target, start, middle, temp);
                            sort(target, middle, end, temp);

                            // Step 2: Copy the original array
                            for (let i = 0, len = target.length; i < len; i++) {
                                temp[i] = target[i];
                            }

                            // Step 3: Create variables to traverse
                            let k = start, i = start, j = middle;

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
                }
            }

            export function initialize<T>(length: number): T[] {
                Integer.assert(length, "length");
                // This logic is based upon JS performance tests that show a significant difference at the level of 65536.
                let array: T[];
                if (length > 65536)
                    array = new Array(length);
                else {
                    array = [];
                    array.length = length;
                }
                return array;
            }

            export function sum(source: ArrayLike<number>, ignoreNaN: boolean = false): number {
                if (!source || !source.length)
                    return 0;

                let result = 0;
                if (ignoreNaN) {
                    for (let n of source as number[]) {
                        if (!isNaN(n)) result += n;
                    }
                }
                else {
                    for (let n of source as number[]) {
                        if (isNaN(n)) return NaN;
                        result += n;
                    }
                }

                return result;
            }

            export function average(source: ArrayLike<number>, ignoreNaN: boolean = false): number {
                if (!source || !source.length)
                    return NaN;

                let result = 0, count: number;
                if (ignoreNaN) {
                    count = 0;
                    for (let n of source as number[]) {
                        if (!isNaN(n)) {
                            result += n;
                            count++;
                        }
                    }
                }
                else {
                    count = source.length;
                    for (let n of source as number[]) {
                        if (isNaN(n)) return NaN;
                        result += n;
                    }
                }

                return (!count || isNaN(result)) ? NaN : (result / count);
            }

            export function product(source: ArrayLike<number>, ignoreNaN: boolean = false): number {
                if (!source || !source.length)
                    return NaN;

                let result = 1;
                if (ignoreNaN) {
                    let found = false;
                    for (let n of source as number[]) {
                        if (!isNaN(n)) {
                            result *= n;
                            found = true;
                        }
                    }
                    if (!found)
                        return NaN;
                }
                else {
                    for (let n of source as number[]) {
                        if (isNaN(n)) return NaN;
                        result *= n;
                    }
                }

                return result;
            }

            /**
             * Takes the first number and divides it by all following.
             * @param source
             * @param ignoreNaN Will cause this skip any NaN values.
             * @returns {number}
             */
            export function quotient(source: ArrayLike<number>, ignoreNaN: boolean = false): number {
                const len = source ? source.length : 0;
                if (len < 2)
                    return NaN;

                let result = source[0];

                let found = false;
                for (let i = 1; i < len; i++) {
                    let n = source[i];
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
                        if (!found) found = true;
                    }
                }

                return found ? result : NaN;
            }

            function ifSet(
                source: ArrayLike<number>,
                start: number,
                ignoreNaN: boolean,
                predicate: (n: number, result: number) => boolean): number {
                if (!source || !source.length)
                    return NaN;

                let result = start;
                if (ignoreNaN) {
                    let found = false;
                    for (let n of source as number[]) {
                        if (!isNaN(n)) {
                            if (predicate(n, result))
                                result = n;
                            if (!found) found = true;
                        }
                    }
                    if (!found)
                        return NaN;
                }
                else {
                    for (let n of source as number[]) {
                        if (isNaN(n))
                            return NaN;

                        if (predicate(n, result))
                            result = n;
                    }
                }
                return result;

            }

            export function min(source: ArrayLike<number>, ignoreNaN: boolean = false): number {
                return ifSet(source, +Infinity, ignoreNaN, (n, result) => n < result);
            }

            export function max(source: ArrayLike<number>, ignoreNaN: boolean = false): number {
                return ifSet(source, -Infinity, ignoreNaN, (n, result) => n > result);
            }

            export function shuffle<T extends ArrayLikeWritable<any>>(target: T): T {
                let i = target.length;
                while (--i) {
                    const j = Math.floor(Math.random() * (i + 1));
                    const temp = target[i];
                    target[i] = target[j];
                    target[j] = temp;
                }
                return target;
            }

            const
                CB0 = "Cannot be zero.",
                VFN = "Must be a valid finite number";

            /**
             * Checks to see where the provided array contains an item/value.
             * If the array value is null, then -1 is returned.
             * @param array
             * @param item
             * @param {function?} equalityComparer
             * @returns {number}
             */
            export function indexOf<T>(
                array: ArrayLike<T>, item: T,
                equalityComparer: EqualityComparison<T> = Compare.areEqual): number {

                const len = array && array.length;
                if (len) {
                    // NaN NEVER evaluates its equality so be careful.
                    if ((array) instanceof (Array) && !Type.isTrueNaN(item))
                        return array.indexOf(item);

                    for (let i = 0; i < len; i++) {
                        // 'areEqual' includes NaN==NaN evaluation.
                        if (equalityComparer(array[i], item))
                            return i;
                    }
                }

                return -1;
            }

            /**
             * Checks to see if the provided array contains an item.
             * If the array value is null, then false is returned.
             * @param array
             * @param item
             * @param {function?} equalityComparer
             * @returns {boolean}
             */
            export function contains<T>(
                array: ArrayLike<T>, item: T,
                equalityComparer: EqualityComparison<T> = Compare.areEqual): boolean {
                return indexOf(array, item, equalityComparer) != -1;
            }

            /**
             * Finds and replaces a value from an array.  Will replaces all instances unless a maximum is specified.
             * @param array
             * @param old
             * @param newValue
             * @param max
             * @returns {number}
             */
            export function replace<T>(
                array: ArrayLikeWritable<T>,
                old: T,
                newValue: T,
                max: number = Infinity): number {
                if (!array || !array.length || max === 0) return 0;
                if (max < 0) throw new Exceptions.ArgumentOutOfRangeException("max", max, CBL0);
                if (!max) max = Infinity; // just in case.

                let count = 0;

                for (let i = 0, len = array.length; i < len; i++) {
                    if (array[i] === old) {
                        (array as any)[i] = newValue;
                        ++count;
                        if (count == max) break;
                    }
                }

                return count;

            }

            /**
             * Replaces values of an array across a range of indexes.
             * @param array
             * @param value
             * @param start
             * @param stop
             */
            export function updateRange<T>(
                array: ArrayLike<T>,
                value: T,
                start: number = 0,
                stop?: number): void {
                if (!array) return;
                Integer.assertZeroOrGreater(start, "start");
                if (!stop && stop !== 0) stop = array.length;
                Integer.assert(stop, "stop");
                if (stop < start) throw new Exceptions.ArgumentOutOfRangeException("stop", stop, "is less than start");

                for (let i: number = start; i < stop; i++) {
                    (array as any)[i] = value;
                }
            }

            /**
             * Clears (sets to null) values of an array across a range of indexes.
             * @param array
             * @param start
             * @param stop
             */
            export function clear(
                array: ArrayLikeWritable<any>,
                start: number = 0,
                stop?: number): void {
                updateRange(array, null, start, stop);
            }

            /**
             * Ensures a value exists within an array.  If not found, adds to the end.
             * @param array
             * @param item
             * @param {function?} equalityComparer
             * @returns {boolean}
             */
            export function register<T>(
                array: ArrayLikeWritable<T>, item: T,
                equalityComparer: EqualityComparison<T> = Compare.areEqual): boolean {
                if (!array)
                    throw new Exceptions.ArgumentNullException("array", CBN);
                let len = array.length; // avoid querying .length more than once. *
                const ok = !len || !contains(array, item, equalityComparer);
                if (ok) (array as any)[len] = item; // * push would query length again.
                return ok;
            }

            /**
             * Returns the first index of which the provided predicate returns true.
             * Returns -1 if always false.
             * @param array
             * @param predicate
             * @returns {number}
             */
            export function findIndex<T>(array: ArrayLike<T>, predicate: PredicateWithIndex<T>): number {
                if (!array)
                    throw new Exceptions.ArgumentNullException("array", CBN);
                if (!Type.isFunction(predicate))
                    throw new Exceptions.ArgumentException("predicate", "Must be a function.");

                const len = array.length;
                if (!Type.isNumber(len, true) || len < 0)
                    throw new Exceptions.ArgumentException("array", "Does not have a valid length.");

                if ((array) instanceof (Array)) {
                    for (let i = 0; i < len; i++) {
                        if (predicate(array[i], i))
                            return i;
                    }
                }
                else {
                    for (let i = 0; i < len; i++) {
                        if ((i) in (array) && predicate(array[i], i))
                            return i;
                    }
                }

                return -1;
            }


            /**
             * Allows for using "false" to cause forEach to break.
             * Can also be applied to a structure that indexes like an array, but may not be.
             * @param source
             * @param action
             */
            export function forEach<T>(
                source: ArrayLike<T>,
                action: ActionWithIndex<T>): void;
            export function forEach<T>(
                source: ArrayLike<T>,
                action: PredicateWithIndex<T>): void;
            export function forEach<T>(
                source: ArrayLike<T>,
                action: ActionWithIndex<T> | PredicateWithIndex<T>): void {
                if (source && action) {
                    // Don't cache the length since it is possible that the underlying array changed.
                    for (let i = 0; i < source.length; i++) {
                        if (action(source[i], i) === false)
                            break;
                    }
                }
            }

            /**
             * Is similar to Array.map() but instead of returning a new array, it updates the existing indexes.
             * Can also be applied to a structure that indexes like an array, but may not be.
             * @param target
             * @param fn
             */
            export function applyTo<T>(target: ArrayLikeWritable<T>, fn: SelectorWithIndex<T, T>): void {
                if (target && fn) {
                    for (let i = 0; i < target.length; i++) {
                        (target as any)[i] = fn(target[i], i);
                    }
                }
            }

            /**
             * Removes an entry at a specified index.
             * @param array
             * @param index
             * @returns {boolean} True if the value was able to be removed.
             */
            export function removeIndex<T>(array: T[], index: number): boolean {
                if (!array)
                    throw new Exceptions.ArgumentNullException("array", CBN);

                Integer.assert(index, "index");
                if (index < 0) throw new Exceptions.ArgumentOutOfRangeException("index", index, CBL0);


                const exists = index < array.length;
                if (exists)
                    array.splice(index, 1);
                return exists;
            }

            /**
             * Finds and removes a value from an array.  Will remove all instances unless a maximum is specified.
             * @param array
             * @param value
             * @param max
             * @param {function?} equalityComparer
             * @returns {number} The number of times the value was found and removed.
             */
            export function remove<T>(
                array: T[], value: T, max: number = Infinity,
                equalityComparer: EqualityComparison<T> = Compare.areEqual): number {
                if (!array || !array.length || max === 0) return 0;
                if (max < 0) throw new Exceptions.ArgumentOutOfRangeException("max", max, CBL0);

                let count = 0;
                if (!max || !isFinite(max)) {
                    // Don't track the indexes and remove in reverse.
                    for (let i = (array.length - 1); i >= 0; i--) {
                        if (equalityComparer(array[i], value)) {
                            array.splice(i, 1);
                            ++count;
                        }
                    }
                }
                else {
                    // Since the user will expect it to happen in forward order...
                    const found: number[] = []; // indexes;
                    for (let i = 0, len = array.length; i < len; i++) {
                        if (equalityComparer(array[i], value)) {
                            found.push(i);
                            ++count;
                            if (count == max) break;
                        }
                    }

                    for (let i = found.length - 1; i >= 0; i--) {
                        array.splice(found[i], 1);
                    }
                }


                return count;
            }

            /**
             * Simply repeats a value the number of times specified.
             * @param element
             * @param count
             * @returns {T[]}
             */
            export function repeat<T>(element: T, count: number): T[] {
                Integer.assert(count, "count");
                if (count < 0) throw new Exceptions.ArgumentOutOfRangeException("count", count, CBL0);

                const result = initialize<T>(count);
                for (let i = 0; i < count; i++) {
                    result[i] = element;
                }

                return result;
            }

            /**
             * Returns a range of numbers based upon the first value and the step value.
             * @param first
             * @param count
             * @param step
             * @returns {number[]}
             */

            export function range(
                first: number,
                count: number,
                step: number = 1): number[] {
                if (isNaN(first) || !isFinite(first)) throw new Exceptions.ArgumentOutOfRangeException("first", first, VFN);
                if (isNaN(count) || !isFinite(count)) throw new Exceptions.ArgumentOutOfRangeException("count", count, VFN);
                if (count < 0) throw new Exceptions.ArgumentOutOfRangeException("count", count, CBL0);

                const result = initialize<number>(count);
                for (let i = 0; i < count; i++) {
                    result[i] = first;
                    first += step;
                }

                return result;
            }

            /**
             * Returns a range of numbers based upon the first value and the step value excluding any numbers at or beyond the until value.
             * @param first
             * @param until
             * @param step
             * @returns {number[]}
             */
            export function rangeUntil(
                first: number,
                until: number,
                step: number = 1): number[] {
                if (step == 0) throw new Exceptions.ArgumentOutOfRangeException("step", step, CB0);
                return range(first, (until - first) / step, step);
            }

            /**
             * Returns a unique reduced set of values.
             * @param source
             */
            export function distinct(source: string[]): string[];
            export function distinct(source: number[]): number[];
            export function distinct(source: any[]): any[] {
                const seen: any = {};
                return source.filter(e => !(e in seen) && (seen[e] = true));
            }

            /**
             * Takes any arrays within an array and inserts the values contained within in place of that array.
             * For every count higher than 0 in recurseDepth it will attempt an additional pass.  Passing Infinity will flatten all arrays contained.
             * @param a
             * @param recurseDepth
             * @returns {any[]}
             */
            export function flatten(a: any[], recurseDepth: number = 0): any[] {
                const result: any[] = [];
                for (let i = 0; i < a.length; i++) {
                    let x = a[i];
                    if ((x) instanceof (Array)) {
                        if (recurseDepth > 0) x = flatten(x, recurseDepth - 1);
                        for (let n = 0; n < x.length; n++) result.push(x[n]);
                    }
                    else result.push(x);
                }
                return result;
            }

            export module ArraySort {
                export const quick = Sorting.QuickSort.quickSort;
                const createComparer = Sorting.createComparer;

                export function using<TSource, TSelect extends Primitive>(
                    target: TSource[],
                    selector: Selector<TSource, TSelect | TSelect[]>,
                    order: Collections.Sorting.Order | Collections.Sorting.Order[] = Collections.Sorting.Order.Ascending,
                    equivalentToNaN: any = NaN): TSource[] {
                    return target.sort(createComparer(selector, order, equivalentToNaN));
                }
            }

            export class ReadOnlyArrayWrapper<T> extends ReadOnlyCollectionWrapper<T>
            {

                constructor(array: ArrayLike<T>) {
                    super(array);
                    this.__getValueAt = i => array[i];
                }

                protected _onDispose() {
                    super._onDispose();
                    this.__getValueAt = (null as any);
                }

                private __getValueAt: (i: number) => T;
                getValueAt(index: number): T {
                    this.throwIfDisposed();
                    return this.__getValueAt(index);
                }
            }

            /*  validateSize: Utility for quick validation/invalidation of array equality.
	        Why this way?  Why not pass a closure for the last return?
	        Reason: Performance and avoiding the creation of new functions/closures. */
            function validateSize(a: ArrayLike<any>, b: ArrayLike<any>): boolean | number {
                // Both valid and are same object, or both are null/undefined.
                if (a && b && a === b || !a && !b)
                    return true;

                // At this point, at least one has to be non-null.
                if (!a || !b)
                    return false;

                const len = a.length;
                if (len !== b.length)
                    return false;

                // If both are arrays and have zero length, they are equal.
                if (len === 0)
                    return true;

                // Return the length for downstream processing.
                return len;
            }

            export function areAllEqual(
                arrays: ArrayLike<ArrayLike<any>>,
                equalityComparer?: EqualityComparison<any>): boolean;
            export function areAllEqual(
                arrays: ArrayLike<ArrayLike<any>>,
                strict: boolean,
                equalityComparer?: EqualityComparison<any>): boolean;
            export function areAllEqual(
                arrays: ArrayLike<ArrayLike<any>>,
                strict: boolean | EqualityComparison<any> = true,
                equalityComparer: EqualityComparison<any> = Values.areEqual): boolean {
                if (!arrays)
                    throw new Error("ArgumentNullException: 'arrays' cannot be null.");
                if (arrays.length < 2)
                    throw new Error("Cannot compare a set of arrays less than 2.");

                if (Type.isFunction(strict)) {
                    equalityComparer = strict as any;
                    strict = true;
                }

                const first = arrays[0];
                for (let i = 1, l = arrays.length; i < l; i++) {
                    if (!areEqual(first, arrays[i], strict, equalityComparer))
                        return false;
                }
                return true;
            }

            /**
             * Compares two arrays for equality.
             * @param a
             * @param b
             * @param equalityComparer
             */
            export function areEqual<T>(
                a: ArrayLike<T>, b: ArrayLike<T>,
                equalityComparer?: EqualityComparison<T>): boolean;
            export function areEqual<T>(
                a: ArrayLike<T>, b: ArrayLike<T>,
                strict: boolean,
                equalityComparer?: EqualityComparison<T>): boolean;
            export function areEqual<T>(
                a: ArrayLike<T>, b: ArrayLike<T>,
                strict: boolean | EqualityComparison<T> = true,
                equalityComparer: EqualityComparison<T> = Values.areEqual): boolean {
                const len = validateSize(a, b);
                if (Type.isBoolean(len)) return len as boolean;

                if (Type.isFunction(strict)) {
                    equalityComparer = strict as any;
                    strict = true;
                }

                for (let i = 0; i < len; i++) {
                    if (!equalityComparer(a[i], b[i], strict))
                        return false;
                }

                return true;

            }

            function internalSort<T>(a: ArrayLike<T>, comparer: Comparison<T>): ArrayLike<T> {
                if (!a || a.length < 2) return a;

                const len = a.length;
                let b: T[];
                if (len > 65536)
                    b = new Array(len);
                else {
                    b = [];
                    b.length = len;
                }
                for (let i = 0; i < len; i++) {
                    b[i] = a[i];
                }

                b.sort(comparer);
                return b;
            }

            export function areEquivalent<T extends Primitive>(a: ArrayLike<T>, b: ArrayLike<T>): boolean;
            export function areEquivalent<T>(a: ArrayLike<IComparable<T>>, b: ArrayLike<IComparable<T>>): boolean;
            export function areEquivalent<T>(a: ArrayLike<T>, b: ArrayLike<T>, comparer: Comparison<T>): boolean;
            export function areEquivalent<T>(
                a: ArrayLike<T>, b: ArrayLike<T>,
                comparer: Comparison<T> = Values.compare): boolean {
                const len = validateSize(a, b);
                if (Type.isBoolean(len)) return len as boolean;

                // There might be a better more performant way to do this, but for the moment, this
                // works quite well.
                a = internalSort(a, comparer);
                b = internalSort(b, comparer);

                for (let i = 0; i < len; i++) {
                    if (comparer(a[i], b[i]) !== 0)
                        return false;
                }

                return true;
            }

            /**
             *
             * @param source
             * @param sourceIndex
             * @param length
             * @returns {any}
             */
            export function copy<T>(
                source: ArrayLike<T>,
                sourceIndex: number = 0,
                length: number = Infinity): T[] {
                if (!source) return source as any; // may have passed zero? undefined? or null?
                return copyTo(
                    source,
                    initialize<T>(Math.min(length, Math.max(source.length - sourceIndex, 0))),
                    sourceIndex, 0, length);
            }

            const
                CBN = "Cannot be null.",
                CBL0 = "Cannot be less than zero.";

            /**
             * Copies one array to another.
             * @param source
             * @param destination
             * @param sourceIndex
             * @param destinationIndex
             * @param length An optional limit to stop copying.
             * @returns The destination array.
             */
            export function copyTo<T, TDestination extends ArrayLikeWritable<T>>(
                source: ArrayLike<T>,
                destination: TDestination,
                sourceIndex: number = 0,
                destinationIndex: number = 0,
                length: number = Infinity): TDestination {
                if (!source)
                    throw new Exceptions.ArgumentNullException("source", CBN);

                if (!destination)
                    throw new Exceptions.ArgumentNullException("destination", CBN);

                if (sourceIndex < 0)
                    throw new Exceptions.ArgumentOutOfRangeException("sourceIndex", sourceIndex, CBL0);

                let sourceLength = source.length;
                if (!sourceLength)
                    return destination;
                if (sourceIndex >= sourceLength)
                    throw new Exceptions.ArgumentOutOfRangeException("sourceIndex", sourceIndex, "Must be less than the length of the source array.");

                if (destination.length < 0)
                    throw new Exceptions.ArgumentOutOfRangeException("destinationIndex", destinationIndex, CBL0);

                const maxLength = source.length - sourceIndex;
                if (isFinite(length) && length > maxLength)
                    throw new Exceptions.ArgumentOutOfRangeException("sourceIndex", sourceIndex, "Source index + length cannot exceed the length of the source array.");

                length = Math.min(length, maxLength);
                const newLength = destinationIndex + length;
                if (newLength > destination.length) destination.length = newLength;

                for (let i = 0; i < length; i++) {
                    destination[destinationIndex + i] = source[sourceIndex + i];
                }

                return destination;
            }

            const VOID0: undefined = void 0;

            export interface DispatchErrorHandler {
                (ex: any, index: number): void
            }

            /**
             * Simply takes a payload and passes it to all the listeners.
             * Makes a arrayCopy of the listeners before calling dispatchUnsafe.
             *
             * @param listeners
             * @param payload
             * @param trap
             */
            export function dispatch<T>(
                listeners: ArrayLike<Selector<T, any>>,
                payload: T, trap?: boolean | DispatchErrorHandler): void {
                dispatch.unsafe(copy(listeners), payload, trap);
            }

            export module dispatch {

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
                export function unsafe<T>(
                    listeners: ArrayLike<Selector<T, any>>,
                    payload: T, trap?: boolean | DispatchErrorHandler): void {
                    if (listeners && listeners.length) {
                        for (let i = 0, len = listeners.length; i < len; i++) {
                            let fn: Function = listeners[i];
                            if (!fn) continue; // Ignore null refs.
                            try {
                                fn(payload);
                            }
                            catch (ex) {
                                if (!trap)
                                    throw ex;
                                else if (Type.isFunction(trap))
                                    (trap as DispatchErrorHandler)(ex, i);
                            }
                        }
                    }
                }

                /**
                 * Simply takes a payload and passes it to all the listeners.
                 * Returns the results in an array that matches the indexes of the listeners.
                 *
                 * @param listeners
                 * @param payload
                 * @param trap
                 * @returns {any}
                 */
                export function mapped<T, TResult>(
                    listeners: ArrayLike<Selector<T, TResult>>,
                    payload: T, trap?: boolean | DispatchErrorHandler): TResult[] {

                    if (!listeners) return listeners as any;
                    // Reuse the arrayCopy as the array result.
                    const result: any[] = copy(listeners);
                    if (listeners.length) {

                        for (let i = 0, len = result.length; i < len; i++) {
                            let fn: Function = result[i];
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
                                    (trap as DispatchErrorHandler)(ex, i);
                            }
                        }
                    }

                    return result;

                }

            }
        }

        export namespace Dictionaries {
            import ArgumentOutOfRangeException = Exceptions.ArgumentOutOfRangeException;
            import InvalidOperationException = Exceptions.InvalidOperationException;

            const VOID0: undefined = void 0;

            const NULL = "null", GET_SYMBOL = "getSymbol", GET_HASH_CODE = "getHashCode";
            export function getIdentifier(obj: any, ): string | number | symbol;
            export function getIdentifier(obj: any, throwIfUnknown: false): string | number | symbol;
            export function getIdentifier(obj: any, throwIfUnknown: boolean): string | number | symbol | never;
            export function getIdentifier(obj: any, unknownHandler: Selector<any, string | number | symbol>): string | number | symbol;
            export function getIdentifier(obj: any, throwIfUnknown: boolean | Selector<any, string | number | symbol> = false): string | number | symbol | never {
                if (Type.isPropertyKey(obj)) return obj;
                if (obj === null) return NULL;
                if (obj === VOID0) return Type.UNDEFINED;

                // See ISymbolizable.
                if (Type.hasMethod<ISymbolizable>(obj, GET_SYMBOL)) {
                    return obj.getSymbol();
                }

                // See IHashable.
                if (Type.hasMethod<IHashable>(obj, GET_HASH_CODE)) {
                    return obj.getHashCode();
                }

                if (throwIfUnknown) {
                    if (Type.isFunction(throwIfUnknown))
                        return (throwIfUnknown as Selector<any, string | number | symbol>)(obj);
                    else
                        throw "Cannot create known identity.";
                }

                return (typeof obj.toString == Type.FUNCTION)
                    ? obj.toString()
                    : Object.prototype.toString.call(obj);
            }

            export interface IHashable {
                getHashCode(): string | number;
            }

            export interface ISymbolizable {
                getSymbol(): symbol;
            }

            export interface IDictionary<TKey, TValue> extends ICollection<IKeyValuePair<TKey, TValue>> {
                keys: TKey[];
                values: TValue[];

                addByKeyValue(key: TKey, value: TValue): boolean;
                setValue(key: TKey, value: TValue | undefined): boolean;
                getValue(key: TKey): TValue | undefined; // It's very common in JS to allow for undefined and check against it.
                getAssuredValue(key: TKey): TValue;
                tryGetValue(key: TKey, out: Action<TValue>): boolean;
                containsKey(key: TKey): boolean;
                containsValue(value: TValue): boolean;
                removeByKey(key: TKey): boolean;
                removeByValue(value: TValue): number;

                // See ICollection<T> for the rest.
            }


            export interface IStringKeyDictionary<TValue> extends IDictionary<string, TValue>, ICollection<IStringKeyValuePair<TValue>> {
                importMap(map: IMap<TValue>): boolean;
            }

            export interface IOrderedDictionary<TKey, TValue> extends IDictionary<TKey, TValue> {
                indexOfKey(key: TKey): number;
                getValueByIndex(index: number): TValue;
            }

            // Design Note: Should DictionaryAbstractBase be IDisposable?
            export abstract class DictionaryBase<TKey, TValue>
                extends CollectionBase<IKeyValuePair<TKey, TValue>> implements IDictionary<TKey, TValue>
            {
                constructor(source?: Enumeration.IEnumerableOrArray<IKeyValuePair<TKey, TValue>>) {
                    super(source);
                }


                //noinspection JSUnusedLocalSymbols
                protected _onValueModified(key: TKey, value: TValue | undefined, old: TValue | undefined): void {
                }

                protected _addInternal(item: KeyValuePair<TKey, TValue>): boolean {
                    if (!item)
                        throw new Exceptions.ArgumentNullException(
                            "item", "Dictionaries must use a valid key/value pair. '" + item + "' is not allowed."
                        );

                    return KeyValueExtractModule.extractKeyValue(item,
                        (key, value) => this.addByKeyValue(key, value));
                }

                protected _clearInternal(): number {
                    const _ = this;
                    let count = 0;

                    for (let key of _.keys) {
                        if (_.removeByKey(key)) count++;
                    }

                    return count;
                }

                contains(item: KeyValuePair<TKey, TValue>): boolean {
                    // Should never have a null object in the collection.
                    if (!item || !this.getCount()) return false;

                    return KeyValueExtractModule.extractKeyValue(item,
                        (key, value) => {
                            // Leave as variable for debugging...
                            const v = this.getValue(key);
                            return Compare.areEqual(value, v);
                        });

                }

                protected _removeInternal(item: IKeyValuePair<TKey, TValue> | [TKey, TValue]): number {
                    if (!item) return 0;

                    return KeyValueExtractModule.extractKeyValue(item,
                        (key, value) => {
                            // Leave as variable for debugging...
                            let v = this.getValue(key);
                            return (Compare.areEqual(value, v) && this.removeByKey(key))
                                ? 1 : 0;
                        });
                }

                /////////////////////////////////////////
                // IDictionary<TKey,TValue>
                /////////////////////////////////////////

                protected abstract getKeys(): TKey[];

                get keys(): TKey[] { return this.getKeys(); }

                protected abstract getValues(): TValue[];

                get values(): TValue[] { return this.getValues(); }


                addByKeyValue(key: TKey, value: TValue): boolean {
                    if (value === VOID0)
                        throw new InvalidOperationException("Cannot add 'undefined' as a value.");

                    const _ = this;
                    if (_.containsKey(key)) {
                        const ex = new InvalidOperationException("Adding a key/value when the key already exists.");
                        ex.data["key"] = key;
                        ex.data["value"] = value;
                        throw ex;
                    }

                    return _.setValue(key, value);
                }

                protected abstract _getEntry(key: TKey): IKeyValuePair<TKey, TValue> | null;

                abstract getValue(key: TKey): TValue | undefined;

                getAssuredValue(key: TKey): TValue {
                    const value = this.getValue(key);
                    if (value === VOID0)
                        throw new KeyNotFoundException(`Key '${key}' not found.`);
                    return value;
                }

                tryGetValue(key: TKey, out: Action<TValue>): boolean {
                    const value = this.getValue(key);
                    if (value !== VOID0) {
                        out(value);
                        return true;
                    }
                    return false;
                }

                protected abstract _setValueInternal(key: TKey, value: TValue | undefined): boolean;

                /**
                 * Sets the value of an entry.
                 * It's important to know that 'undefined' cannot exist as a value in the dictionary and is used as a flag for removal.
                 * @param key
                 * @param value
                 * @returns {boolean}
                 */
                setValue(key: TKey, value: TValue | undefined): boolean {
                    // setValue shouldn't need to worry about recursion...
                    const _ = this;
                    _.assertModifiable();

                    let changed = false;
                    const old = _.getValue(key); // get the old value here and pass to internal.
                    if (!Compare.areEqual(value, old) && _._setValueInternal(key, value)) {
                        changed = true;
                        _._onValueModified(key, value, old);
                    }

                    _._signalModification(changed);
                    return changed;
                }

                containsKey(key: TKey): boolean {
                    return !!this._getEntry(key);
                }

                containsValue(value: TValue): boolean {
                    const e = this.getEnumerator();
                    while (e.moveNext()) {
                        if (Compare.areEqual(e.current, value, true)) {
                            e.dispose();
                            return true;
                        }
                    }
                    return false;
                }

                removeByKey(key: TKey): boolean {
                    return this.setValue(key, VOID0);
                }

                removeByValue(value: TValue): number {
                    const _ = this;
                    let count = 0;
                    for (let key of _.getKeys()) {
                        if (Compare.areEqual(_.getValue(key), value, true)) {
                            _.removeByKey(key);
                            count++;
                        }
                    }
                    return count;
                }

                importEntries(pairs: Enumeration.IEnumerableOrArray<KeyValuePair<TKey, TValue>> | Enumeration.IEnumerator<KeyValuePair<TKey, TValue>> | null | undefined): number {
                    // Allow piping through to trigger onModified properly.
                    return super.importEntries(pairs as any);
                }

                protected _importEntries(pairs: Enumeration.IEnumerableOrArray<KeyValuePair<TKey, TValue>> | Enumeration.IEnumerator<KeyValuePair<TKey, TValue>> | null | undefined): number {
                    const _ = this;
                    if (!pairs) return 0;
                    let changed: number = 0;
                    Enumeration.forEach(pairs,
                        pair => KeyValueExtractModule.extractKeyValue(pair, (key, value) => {
                            if (_._setValueInternal(key, value))
                                changed++;
                        })
                    );
                    return changed;
                }

                getEnumerator(): Enumeration.IEnumerator<IKeyValuePair<TKey, TValue>> {
                    const _ = this;
                    _.throwIfDisposed();

                    let ver: number, keys: TKey[], len: number, index = 0;
                    return new Enumeration.EnumeratorBase<IKeyValuePair<TKey, TValue>>(
                        () => {
                            _.throwIfDisposed();
                            ver = _._version; // Track the version since getKeys is a copy.
                            keys = _.getKeys();
                            len = keys.length;
                        },

                        (yielder) => {
                            _.throwIfDisposed();
                            _.assertVersion(ver);

                            while (index < len) {
                                const key = keys[index++], value = _.getValue(key);
                                if (value !== VOID0) // Still valid?
                                    return yielder.yieldReturn({ key: key, value: value });
                            }

                            return yielder.yieldBreak();
                        }
                    );
                }
            }

            export interface IHashEntry<TKey, TValue>
                extends ILinkedNode<IHashEntry<TKey, TValue>>, IKeyValuePair<TKey, TValue> {

            }
            // LinkedList for Dictionary
            class HashEntry<TKey, TValue>
                implements IHashEntry<TKey, TValue>
            {
                constructor(
                    public key: TKey,
                    public value: TValue,
                    public previous?: IHashEntry<TKey, TValue> | null,
                    public next?: IHashEntry<TKey, TValue> | null) {

                }
            }

            type HashEntryLinkedList<TKey, TValue> = LinkedNodeList<IHashEntry<TKey, IHashEntry<TKey, TValue>>>;

            let linkedListPool: Disposable.ObjectPool<LinkedNodeList<any>>;
            function linkedNodeList(recycle?: LinkedNodeList<any>): void;
            //noinspection JSUnusedLocalSymbols
            function linkedNodeList(recycle?: LinkedNodeList<any>): LinkedNodeList<any> | void {
                if (!linkedListPool)
                    linkedListPool
                        = new Disposable.ObjectPool<LinkedNodeList<any>>(20, () => new LinkedNodeList<any>(), r => r.clear());
                if (!recycle) return linkedListPool.take();
                linkedListPool.add(recycle);
            }

            export class StringKeyDictionary<TValue>
                extends DictionaryBase<string, TValue> implements IStringKeyDictionary<TValue>
            {

                protected _onDispose() {
                    super._onDispose();
                    (this as any)._map = null;
                }

                private _count: number = 0;
                private readonly _map: IMap<TValue> = {};

                protected _getEntry(key: string): IKeyValuePair<string, TValue> | null {
                    return !this.containsKey(key)
                        ? null : {
                            key: key,
                            value: this.getAssuredValue(key)
                        };
                }

                containsKey(key: string): boolean {
                    return key != null
                        && this._count != 0
                        && this._map[key] !== VOID0;
                }

                containsValue(value: TValue): boolean {
                    if (!this._count) return false;
                    const map = this._map;
                    for (let key in map) {
                        if (map.hasOwnProperty(key) && Compare.areEqual(map[key], value))
                            return true;
                    }
                    return false;
                }


                getValue(key: string): TValue | undefined {
                    return key == null || !this._count
                        ? VOID0
                        : this._map[key];
                }


                protected _setValueInternal(key: string, value: TValue | undefined): boolean {
                    const _ = this;
                    const map = _._map, old = map[key];
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
                }

                // Returns true if any value is updated...
                importMap(values: IMap<TValue>): boolean {
                    const _ = this;
                    return _.handleUpdate(
                        () => {
                            let changed: boolean = false;
                            for (let key in values) {
                                if (values.hasOwnProperty(key) && _.setValue(key, values[key]))
                                    changed = true;
                            }
                            return changed;
                        }
                    );
                }

                toMap(selector?: (key: string, value: TValue) => TValue): IMap<TValue> {
                    const _ = this;
                    const result: IMap<TValue> = {};
                    if (_._count) for (let key in _._map) {
                        if (_._map.hasOwnProperty(key)) // This simply satisfies inspection.
                        {
                            let value = _._map[key];
                            if (selector)
                                value = selector(key, value);
                            if (value !== VOID0)
                                result[key] = value;
                        }
                    }
                    return result;
                }

                protected getKeys(): string[] {
                    return Object.keys(this._map);
                }

                protected getValues(): TValue[] {
                    if (!this._count) return [];
                    const result: any[] = Object.keys(this._map);
                    for (let i = 0, len = result.length; i < len; i++) {
                        result[i] = this._map[result[i]];
                    }

                    return result;
                }

                protected getCount(): number {
                    return this._count;
                }


            }

            export class OrderedStringKeyDictionary<TValue>
                extends StringKeyDictionary<TValue> implements IOrderedDictionary<string, TValue>
            {

                // noinspection JSMismatchedCollectionQueryUpdate
                private _order: string[] = []; // Maintains indexes.

                constructor() {
                    super();
                }

                indexOfKey(key: string): number {
                    const o = this._order;
                    return o.length ? o.indexOf(key, 0) : -1;
                }

                getValueByIndex(index: number): TValue {
                    Integer.assertZeroOrGreater(index);
                    const o = this._order;
                    if (index < o.length)
                        return this.getAssuredValue(o[index]);

                    throw new ArgumentOutOfRangeException("index", index);
                }

                // adding keepIndex allows for clearing a value while still retaining it's index.
                setValue(key: string, value: TValue | undefined, keepIndex?: boolean): boolean {
                    // TODO: This may be inefficient and could be improved.
                    const _ = this;
                    let exists = _.indexOfKey(key) != -1;
                    if (!exists && (value !== VOID0 || keepIndex))
                        _._order.push(key);
                    else if (exists && value === VOID0 && !keepIndex)
                        ArrayModule.remove(_._order, key);

                    return super.setValue(key, value);
                }

                setByIndex(index: number, value: TValue | undefined): boolean {
                    const _ = this;
                    const order = _._order;
                    if (index < 0)
                        throw new ArgumentOutOfRangeException("index", index, "Is less than zero.");
                    if (index >= order.length)
                        throw new ArgumentOutOfRangeException("index", index, "Is greater than the count.");
                    return _.setValue(order[index], value);
                }

                // importValues([x,y,z]);
                importValues(values: TValue[]): boolean {
                    const _ = this;
                    return _.handleUpdate(
                        () => {
                            let changed: boolean = false;
                            for (let i = 0; i < values.length; i++) {
                                if (_.setByIndex(i, values[i]))
                                    changed = true;
                            }
                            return changed;
                        }
                    );

                }

                // setValues(x,y,z);
                setValues(...values: TValue[]): boolean {
                    return this.importValues(values);
                }

                removeByIndex(index: number): boolean {
                    return this.setByIndex(index, VOID0);
                }

                protected getKeys(): string[] {
                    const _ = this;
                    const o = _._order;
                    return o.length && o.filter(key => _.containsKey(key)) || [];
                }

            }

            export class Dictionary<TKey, TValue> extends DictionaryBase<TKey, TValue>
            {
                // Retains the order...
                private readonly _entries: LinkedNodeList<IHashEntry<TKey, TValue>>;
                private readonly _buckets: IMap<LinkedNodeList<IHashEntry<TKey, IHashEntry<TKey, TValue>>>>;

                constructor(
                    private readonly _keyGenerator?: Selector<TKey, string | number | symbol>) {
                    super();
                    this._entries = linkedNodeList() as any;
                    this._buckets = {};
                }

                protected _onDispose() {
                    super._onDispose();
                    const _ = (this as any);
                    _._entries = null;
                    _._buckets = null;
                    _._hashGenerator = null;
                }

                protected getCount(): number {
                    return this._entries && this._entries.unsafeCount || 0;
                }

                private _getBucket(
                    hash: string | number | symbol,
                    createIfMissing?: boolean): HashEntryLinkedList<TKey, TValue> | null {
                    if (hash == null || !createIfMissing && !this.getCount())
                        return null;

                    if (!Type.isPrimitiveOrSymbol(hash))
                        console.warn("Key type not indexable and could cause Dictionary to be extremely slow.");

                    const buckets = this._buckets;
                    let bucket = buckets[hash as any];

                    if (createIfMissing && !bucket)
                        buckets[hash as any]
                            = bucket
                            = linkedNodeList() as any;

                    return bucket || null;
                }

                private _getBucketEntry(
                    key: TKey,
                    hash?: string | number | symbol,
                    bucket?: HashEntryLinkedList<TKey, TValue> | null): IHashEntry<TKey, IHashEntry<TKey, TValue>> | null {
                    if (key == null || !this.getCount())
                        return null;

                    const _ = this,
                        comparer = _._keyGenerator,
                        compareKey = comparer ? comparer(key) : key;

                    if (!bucket) bucket = _._getBucket(hash || getIdentifier(compareKey));

                    return bucket
                        && (comparer
                            ? bucket.find(e => comparer!(e.key) === compareKey)
                            : bucket.find(e => e.key === compareKey)
                        );
                }

                protected _getEntry(key: TKey): IHashEntry<TKey, TValue> | null {
                    const e = this._getBucketEntry(key);
                    return e && e.value;
                }

                getValue(key: TKey): TValue | undefined {
                    const e = this._getEntry(key);
                    return e ? e.value : VOID0;
                }

                protected _setValueInternal(key: TKey, value: TValue | undefined): boolean {
                    const _ = this;
                    const buckets = _._buckets,
                        entries = _._entries,
                        compareKey = _._keyGenerator ? _._keyGenerator(key) : key,
                        hash = getIdentifier(compareKey);
                    let bucket = _._getBucket(hash);
                    const bucketEntry = bucket && _._getBucketEntry(key, hash, bucket);

                    // Entry exits? Delete or update
                    if (bucketEntry) {
                        const b = bucket as HashEntryLinkedList<TKey, TValue>;
                        if (value === VOID0) {
                            let x = b.removeNode(bucketEntry),
                                y = entries.removeNode(bucketEntry.value);

                            if (x && !b.count) {
                                delete buckets[hash as any];
                                linkedNodeList(b);
                                bucket = null;
                            }

                            if (x !== y) throw "Entries and buckets are out of sync.";

                            if (x) return true;
                        }
                        else {
                            // We don't expose the internal hash entries so replacing the value is ok.
                            const old = bucketEntry.value.value;
                            bucketEntry.value.value = value;
                            return !Compare.areEqual(value, old);
                        }

                    }
                    else if (value !== VOID0) {
                        if (!bucket) bucket = _._getBucket(hash, true);
                        if (!bucket) throw new Error(`"${hash as any}" cannot be added to lookup table.`);
                        let entry = new HashEntry(key, value);
                        entries.addNode(entry);
                        bucket.addNode(new HashEntry(key, entry));
                        return true;
                    }

                    return false;
                }

                protected _clearInternal(): number {
                    const _ = this;
                    const buckets = _._buckets;

                    // Ensure reset and clean...
                    for (let key in buckets) {
                        if (buckets.hasOwnProperty(key)) {
                            let bucket = buckets[key];
                            delete buckets[key];
                            linkedNodeList(bucket);
                        }
                    }

                    return _._entries.clear();
                }

                /*
                 * Note: super.getEnumerator() works perfectly well,
                 * but enumerating the internal linked node list is much more efficient.
                 */
                getEnumerator(): Enumeration.IEnumerator<IKeyValuePair<TKey, TValue>> {
                    const _ = this;
                    _.throwIfDisposed();

                    let ver: number, currentEntry: IHashEntry<TKey, TValue> | null;
                    return new Enumeration.EnumeratorBase<IKeyValuePair<TKey, TValue>>(
                        () => {
                            _.throwIfDisposed();
                            ver = _._version;
                            currentEntry = _._entries.first;
                        },
                        (yielder) => {
                            if (currentEntry) {
                                _.throwIfDisposed();
                                _.assertVersion(ver);
                                const result = { key: currentEntry.key, value: currentEntry.value };
                                currentEntry = currentEntry.next || null;
                                return yielder.yieldReturn(result);
                            }
                            return yielder.yieldBreak();
                        }
                    );
                }


                protected getKeys(): TKey[] {
                    const _ = this;
                    const result: TKey[] = [];
                    let e: any = _._entries && _._entries.first;
                    while (e) {
                        result.push(e.key);
                        e = e.next;
                    }
                    return result;
                }

                protected getValues(): TValue[] {
                    const _ = this;
                    const result: TValue[] = [];
                    let e: any = _._entries && _._entries.first;
                    while (e) {
                        result.push(e.value);
                        e = e.next;
                    }
                    return result;
                }
            }
        }
        
        export namespace Sorting {
            const Values = Compare;

            export class SortContext<T> implements IComparer<T>
            {

                /**
                 * Direction of the comparison.
                 * @type {Order}
                 */
                get order(): Order
                { return this._order; }

                constructor(
                    protected _next: IComparer<T> | null,
                    protected _comparer: Comparison<T> = Values.compare,
                    protected _order: Order = Order.Ascending) {
                }


                /**
                 * Generates an array of indexes from the source in order of their expected internalSort without modifying the source.
                 * @param source
                 * @returns {number[]}
                 */
                generateSortedIndexes(source: T[]): number[] {
                    if (source == null) return [];
                    const result: number[] = source.map((s, i) => i);
                    result.sort((a, b) => this.compare(source[a], source[b]));
                    return result;
                }

                /**
                 * Compares two values based upon SortContext parameters.
                 * @param a
                 * @param b
                 * @returns {any}
                 */
                compare(a: T, b: T): number {
                    const _ = this;
                    const d = _._comparer(a, b);
                    if (d == 0 && _._next) return _._next.compare(a, b);
                    return _._order * d;
                }
            }

            export declare const enum Order {
                Ascending = +1,
                Descending = -1
            }

            export class KeySortedContext<T, TKey extends Comparable> extends SortContext<T>
            {
                constructor(
                    next: IComparer<T> | null,
                    protected _keySelector: Selector<T, TKey> | null,
                    order: Order = Order.Ascending,
                    comparer: Comparison<T> = Values.compare) {
                    super(next, comparer, order);
                }

                compare(a: T, b: T): number {
                    const _ = this;
                    const ks = _._keySelector;
                    if (!ks || ks === Functions.Identity) return super.compare(a, b);
                    // We force <any> here since it can be a Primitive or IComparable<any>
                    const d = Values.compare(ks(a) as any, ks(b) as any) as number;
                    if (d === 0 && _._next) return _._next.compare(a, b);
                    return _._order * d;
                }
            }
        }
    }

    export module Random {
        import arrayShuffle = System.Collections.ArrayModule.shuffle;

        function r(maxExclusive: number): number {
            return Math.floor(Math.random() * maxExclusive);
        }

        function nr(
            boundary: number,
            inclusive?: boolean): number {
            const a = Math.abs(boundary);
            if (a === 0 || a === 1 && !inclusive) return 0;
            if (inclusive) boundary += boundary / a;
            return r(boundary);
        }

        function arrayCopy<T>(source: ArrayLike<T>): T[] {
            const len = source.length;
            const result = Collections.ArrayModule.initialize<T>(len);
            for (let i = 0; i < len; i++) {
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
        export function integer(min: number, max: number = null) {
            if (max == null) {
                max = min;
                min = 0;
            }

            min = Math.ceil(min);
            max = Math.floor(max);
            return next(max - min) + min;
        }


        /**
         * Returns a random integer from 0 to the boundary.
         * Return value will be less than the boundary unless inclusive is set to true.
         * Negative numbers are allowed.
         *
         * @param boundary
         * @param inclusive
         * @returns {number}
         */
        export function next(
            boundary: number,
            inclusive?: boolean): number {
            Integer.assert(boundary, 'boundary');
            return nr(boundary, inclusive);
        }

        export module next {
            export function integer(
                boundary: number,
                inclusive?: boolean): number {
                return Random.next(boundary, inclusive);
            }

            export function float(boundary: number = Number.MAX_VALUE): number {
                if (isNaN(boundary))
                    throw "'boundary' is not a number.";
                return Math.random() * boundary;
            }

            export function inRange(
                min: number,
                max: number,
                inclusive?: boolean): number {
                Integer.assert(min, 'min');
                Integer.assert(max, 'max');
                let range = max - min;
                if (range === 0) return min;
                if (inclusive) range += range / Math.abs(range);
                return min + r(range);
            }
        }


        /**
         * Returns an array of random integers.
         * @param count
         * @param boundary
         * @param inclusive
         * @returns {number[]}
         */
        export function integers(
            count: number,
            boundary: number,
            inclusive?: boolean): number[] {
            Integer.assert(count);
            const s: number[] = [];
            s.length = count;
            for (let i = 0; i < count; i++) {
                s[i] = nr(boundary, inclusive);
            }
            return s;
        }

        /**
         * Shuffles an array.
         * @param target
         * @returns {T}
         */
        export function shuffle<T extends Collections.ArrayLikeWritable<any>>(target: T): T {
            return Collections.ArrayModule.shuffle(target);
        }

        /**
         * Creates a copy of an array-like  and returns it shuffled.
         * @param source
         * @returns {T[]}
         */
        export function copy<T>(source: ArrayLike<T>): T[] {
            return Collections.ArrayModule.shuffle(arrayCopy(source));
        }

        /**
         * Returns a distinct random set from the source array up to the maxCount or the full length of the array.
         * @param source
         * @param maxCount
         * @returns {any}
         */
        export function select<T>(source: ArrayLike<T>, maxCount: number): T[] {
            if (maxCount !== Infinity) Integer.assertZeroOrGreater(maxCount);
            switch (maxCount) {
                case 0:
                    return [];
                case 1:
                    return [select.one(source, true)];
                default:
                    let result = arrayShuffle(arrayCopy(source));
                    if (maxCount < result.length)
                        result.length = maxCount;
                    return result;

            }

        }

        export module select {
            /**
             * Returns random value from an array.
             * @param source
             * @param throwIfEmpty
             */
            export function one<T>(source: ArrayLike<T>, throwIfEmpty: true): T;
            export function one<T>(source: ArrayLike<T>, throwIfEmpty?: boolean): T | undefined;
            export function one<T>(source: ArrayLike<T>, throwIfEmpty?: boolean): T | undefined {
                if (source && source.length)
                    return source[r(source.length)];

                if (throwIfEmpty)
                    throw "Cannot select from an empty set.";
            }
        }
    }

    export abstract class ResolverBase<T> extends Disposable.DisposableBase {

        protected _isValueCreated: boolean | null; // null = 'creating'
        protected _value: T;

        constructor(
            protected _valueFactory: Func<T>,
            private readonly _trapExceptions: boolean,
            private readonly _allowReset: boolean = false) {
            super();
            this._disposableObjectName = "ResolverBase";
            if (!_valueFactory) throw new Exceptions.ArgumentNullException("valueFactory");
            this._isValueCreated = false;
        }

        protected _error: any;

        protected getError(): any {
            return this._error;
        }

        get error(): any {
            return this.getError();
        }

        getValue(): T {

            const _ = this;
            _.throwIfDisposed();

            if (_._isValueCreated === null)
                throw new Error("Recursion detected.");

            if (!_._isValueCreated && _._valueFactory) {
                _._isValueCreated = null; // Mark this as 'resolving'.
                try {
                    let c: Func<T>;
                    if (!_._isValueCreated && (c = _._valueFactory)) {
                        _._isValueCreated = null; // Mark this as 'resolving'.
                        if (!this._allowReset) this._valueFactory = NULL;
                        const v = c();
                        _._value = v;
                        _._error = void 0;
                        return v;
                    }
                } catch (ex) {
                    _._error = ex;
                    if (!_._trapExceptions) throw ex;
                } finally {
                    _._isValueCreated = true;
                }

            }


            return _._value;

        }

        get canReset(): boolean {
            return this._allowReset && !!this._valueFactory;
        }

        protected _onDispose(): void {
            this._valueFactory = NULL;
            this._value = NULL;
            this._isValueCreated = NULL;
        }

        tryReset(): boolean {
            const _ = this;

            if (!_._valueFactory)
                return false;
            else {
                _._isValueCreated = false;
                _._value = NULL;
                _._error = void 0;
                return true;
            }
        }

    }

    export interface ILazy<T> extends Disposable.IDisposable, IEquatable<ILazy<T>> {
        value: T;
        isValueCreated: boolean;
    }

    export class Lazy<T> extends ResolverBase<T> implements ILazy<T> {

        constructor(valueFactory: Func<T>, trapExceptions: boolean = false, allowReset: boolean = false) {
            super(valueFactory, trapExceptions, allowReset);
            this._disposableObjectName = "Lazy";
            this._isValueCreated = false;
        }

        get isValueCreated(): boolean {
            return !!this._isValueCreated;
        }

        get value(): T {
            return this.getValue();
        }

        equals(other: Lazy<T>): boolean {
            return this === other;
        }

        valueEquals(other: Lazy<T>): boolean {
            return this.equals(other) || this.value === other.value;
        }

        static create<T>(valueFactory: Func<T>, trapExceptions: boolean = false, allowReset: boolean = false) {
            return new Lazy<T>(valueFactory, trapExceptions, allowReset);
        }

    }

    export class ResettableLazy<T> extends Lazy<T> {
        constructor(valueFactory: Func<T>, trapExceptions: boolean = false) {
            super(valueFactory, trapExceptions, true);
            this._disposableObjectName = "ResettableLazy";
        }

        static create<T>(valueFactory: Func<T>, trapExceptions: boolean = false) {
            return new ResettableLazy<T>(valueFactory, trapExceptions);
        }
    }

    export namespace Threading {
        const isNodeJS = false;

        declare module process {
            export function nextTick(callback: Closure): void;

            export function toString(): string;
        }

        interface IDomain {
            enter(): void;
            exit(): void;
        }

        export interface WorkerLike {
            onmessage: (message: { data: any }) => void;
            onerror: (error: any) => void;

            postMessage(obj: any): void;
            terminate(): void;
        }

        export interface WorkerConstructor {
            new (url: string): WorkerLike;
        }

        export interface ICancellable extends Disposable.IDisposable {

            /**
             * Returns true if cancelled.
             * Returns false if already run or already cancelled or unable to cancel.
             */
            cancel(): boolean;
        }

        import ILinkedNode = Collections.ILinkedNode;
        interface ITaskQueueEntry extends ILinkedNode<ITaskQueueEntry> {
            task: Function;
            domain?: IDomain;
            context?: any;
            args?: any[];
            canceller: () => boolean;
        }


        let requestTick: () => void;
        let flushing: boolean = false;

        const entryPool = new Disposable.ObjectPool<ITaskQueueEntry>(40,
            (): ITaskQueueEntry => { return null; },
            (o: any) => {
                o.task = null;
                o.domain = null;
                o.context = null;
                if (o.args) o.args.length = 0;
                o.args = null;
                o.canceller = null;
            });

        function runSingle(task: Function, domain?: IDomain, context?: any, params?: any[]): void {
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
                    setTimeout(() => {
                        throw e;
                    }, 0);
                }
            }

            if (domain) {
                domain.exit();
            }
        }

        function requestFlush(): void {
            if (!flushing) {
                flushing = true;
                requestTick();
            }
        }

        export function deferImmediate(task: Closure, context?: any): ICancellable;
        export function deferImmediate(task: Function, context?: any, args?: any[]): ICancellable;
        export function deferImmediate(task: Closure | Function, context?: any, args?: any[]): ICancellable {
            let entry: ITaskQueueEntry = entryPool.take();
            entry.task = task;
            entry.domain = (isNodeJS && (process as any)["domain"]) as any;
            entry.context = context;
            entry.args = args && args.slice();
            entry.canceller = () => {
                if (!entry) return false;
                let r = Boolean(immediateQueue.removeNode(entry));
                entryPool.add(entry);
                return r;
            };

            immediateQueue.addNode(entry);

            requestFlush();

            return {
                cancel: entry.canceller,
                dispose: () => { entry && entry.canceller(); }
            };
        }

        // runs a task after all other tasks have been run
        // this is useful for unhandled rejection tracking that needs to happen
        // after all `then`d tasks have been run.
        export function runAfterDeferred(task: Closure): void {
            laterQueue.enqueue(task);
            requestFlush();
        }

        if (isNodeJS) {
            requestTick = () => {
                process.nextTick(flush);
            };

        }
        else if (typeof setImmediate === Type.FUNCTION) {
            // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
            if (typeof window !== Type.UNDEFINED) {
                requestTick = setImmediate.bind(window, flush);
            }
            else {
                requestTick = () => {
                    setImmediate(flush);
                };
            }

        }
        else if (typeof MessageChannel !== Type.UNDEFINED) {
            // modern browsers
            // http://www.nonblocking.io/2011/06/windownexttick.html
            const channel = new MessageChannel();
            // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
            // working message ports the first time a page loads.
            channel.port1.onmessage = () => {
                requestTick = requestPortTick;
                channel.port1.onmessage = flush;
                flush();
            };
            let requestPortTick = () => {
                // Opera requires us to provide a message payload, regardless of
                // whether we use it.
                channel.port2.postMessage(0);
            };
            requestTick = () => {
                setTimeout(flush, 0);
                requestPortTick();
            };

        }
        else {
            // old browsers
            requestTick = () => {
                setTimeout(flush, 0);
            };
        }

        function flush(): void {
            /* jshint loopfunc: true */
            let entry: ITaskQueueEntry | null;
            while (entry = immediateQueue.first) {
                let { task, domain, context, args } = entry;
                entry.canceller();
                if (domain) domain.enter();
                runSingle(task, domain, context, args);
            }

            while (laterQueue.tryDequeue(task => {
                runSingle(task);
            })) { }


            flushing = false;
        }

        const immediateQueue = new Collections.LinkedNodeList<ITaskQueueEntry>();

        const laterQueue = new Collections.Queue<Closure>();

        abstract class DeferBase implements ICancellable {
            // It may be a Timer in node, should not be restricted to number.
            protected _id: any;

            abstract cancel(): boolean;

            dispose(): void {
                this.cancel();
            }
        }

        class Defer extends DeferBase {


            constructor(task: Function, delay: number = 0, payload?: any) {
                super();
                if (!(delay > 0)) delay = 0; // covers undefined and null.
                this._id = setTimeout(Defer.handler, delay, task, this, payload);
            }

            cancel(): boolean {
                const id = this._id;
                if (id) {
                    clearTimeout(id);
                    this._id = null;
                    return true;
                }
                return false;
            }

            // Use a static function here to avoid recreating a new function every time.
            private static handler(task: Function, d: Defer, payload?: any): void {
                d.cancel();
                task(payload);
            }

        }

        class DeferInterval extends DeferBase {

            constructor(
                task: Function,
                interval: number,
                private _remaining: number = Infinity) {
                super();
                if (interval == null)
                    throw "'interval' must be a valid number.";
                if (interval < 0)
                    throw "'interval' cannot be negative.";

                this._id = setInterval(DeferInterval.handler, interval, task, this);
            }

            cancel(): boolean {
                const id = this._id;
                if (id) {
                    clearInterval(id);
                    this._id = null;
                    return true;
                }
                return false;
            }

            private static handler(task: Function, d: DeferInterval): void {
                if (!(--d._remaining)) d.cancel();
                task();
            }

        }

        export function defer(
            task: Closure,
            delay?: number): ICancellable;

        export function defer<T>(
            task: Func<T>,
            delay?: number,
            payload?: T): ICancellable;
        export function defer<T>(
            task: Function,
            delay?: number,
            payload?: any): ICancellable {
            return new Defer(task, delay, payload);
        }

        export function interval(
            task: Function,
            interval: number,
            count: number = Infinity): ICancellable {
            return new DeferInterval(task, interval, count);
        }

        export const Worker: WorkerConstructor = (self as any).Worker;

    }

    export namespace Uri {
        export enum UriHostNameType {
            Basic,
            DNS,
            IPv4,
            IPv6,
            Unknown
        }

        Object.freeze(UriHostNameType);

        export module SchemeValue {
            export type File = "file";
            export type Gopher = "gopher";
            export type FTP = "ftp";
            export type HTTP = "http";
            export type HTTPS = "https";
            export type LDAP = "ldap";
            export type MailTo = "mailto";
            export type Pipe = "net.pipe";
            export type TCP = "net.tcp";
            export type NNTP = "nntp" | "news";
            export type Telnet = "telnet";
            export type UUID = "uuid";

            /**
             * The allowed HTTP Method values.
             */
            export type Any
                = File
                | Gopher
                | FTP
                | HTTP
                | HTTPS
                | LDAP
                | MailTo
                | Pipe
                | TCP
                | NNTP
                | Telnet
                | UUID;
        }

        export module Scheme {
            export const File: SchemeValue.File = "file";
            export const FTP: SchemeValue.FTP = "ftp";
            export const GOPHER: SchemeValue.Gopher = "gopher";
            export const HTTP: SchemeValue.HTTP = "http";
            export const HTTPS: SchemeValue.HTTPS = "https";
            export const LDAP: SchemeValue.LDAP = "ldap";
            export const MAILTO: SchemeValue.MailTo = "mailto";
            export const PIPE: SchemeValue.Pipe = "net.pipe";
            export const TCP: SchemeValue.TCP = "net.tcp";
            export const NEWS: SchemeValue.NNTP = "news";
            export const NNTP: SchemeValue.NNTP = "nntp";
            export const TELNET: SchemeValue.Telnet = "telnet";
            export const UUID: SchemeValue.UUID = "uuid";
            export const All = Object.freeze([
                File, FTP, GOPHER, HTTP, HTTPS, LDAP, MAILTO, PIPE, TCP, NEWS, NNTP, TELNET, UUID
            ]);

            export function isValid(scheme: string): scheme is SchemeValue.Any {
                return All.indexOf(scheme as any) !== -1;
            }

        }

        const
            QUERY_SEPARATOR = "?",
            ENTRY_SEPARATOR = "&",
            KEY_VALUE_SEPARATOR = "=",
            TO_URI_COMPONENT = "toUriComponent";

        Object.freeze(Scheme);

        export module Separator {
            export const Query: string = QUERY_SEPARATOR;
            export const Entry: string = ENTRY_SEPARATOR;
            export const KeyValue: string = KEY_VALUE_SEPARATOR;
        }

        export interface IUrn {

            scheme?: SchemeValue.Any | null; // string literal

            path?: string | null;

        }

        export interface IUri extends IUrn {
            userInfo?: string | null;
            host?: string | null;
            port?: number | null;
            query?: string | null;
            fragment?: string | null;
        }

        interface IUriDotNet extends IUri, Serialization.ISerializable, IEquatable<IUri> {
            absoluteUri: string;
            authority: string;
            dnsSafeHost: string;
            hostNameType: UriHostNameType;
            idnHost: string;
            isAbsoluteUri: boolean;
            isDefaultPort: boolean;
            isFile: boolean;
            isLoopback: boolean;
            isUnc: boolean;

            /**
             * Gets a local operating-system representation of a file name.
             */
            localPath: string;


            /**
             * Gets the original URI string that was passed to the Uri constructor.
             */
            originalString: string;


            /**
             * Gets the AbsolutePath and Query properties separated by a question mark (?).
             */
            pathAndQuery: string;


            /**
             * Gets an array containing the path segments that make up the specified URI.
             */
            segments: string[];


            // UserEscaped = the user got away... LOL JK
            /**
             * Indicates that the URI string was completely escaped before the Uri instance was created.
             */
            userEscaped: boolean;
        }

        export class Uri implements IUri, IEquatable<IUri> {

            readonly scheme: SchemeValue.Any | null;
            readonly userInfo: string | null;
            readonly host: string | null;
            readonly port: number | null;
            readonly path: string | null;
            readonly query: string | null;
            readonly fragment: string | null;

            readonly queryParams: IMap<Primitive | Primitive[]>; //Readonly<IMap<Primitive|Primitive[]>>;

            constructor(
                scheme: SchemeValue.Any | null,
                userInfo: string | null,
                host: string | null,
                port: number | null,
                path: string | null,
                query?: QueryParam.Convertible,
                fragment?: string) {
                const _ = this;
                this.scheme = getScheme(scheme) || null;
                this.userInfo = userInfo || null;
                this.host = host || null;

                this.port = getPort(port);

                this.authority = _.getAuthority() || null;

                this.path = path || null;


                if (!Type.isString(query))
                    query = encode(query as UriComponent.Map | StringKeyValuePair<Primitive>[]);

                this.query = formatQuery(query as string) || null;
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
            equals(other: IUri): boolean {
                return this === other || this.absoluteUri == Uri.toString(other);
            }


            /**
             * Parses or clones values from existing Uri values.
             * @param uri
             * @param defaults
             * @returns {Uri}
             */
            static from(uri: string | IUri | null | undefined, defaults?: IUri): Uri {
                const u = Type.isString(uri)
                    ? Uri
                    .parse(uri as string)
// Parsing a string should throw errors.  Null or undefined simply means empty.
                    : (uri as IUri);

                return new Uri(
                    u && u.scheme || defaults && (defaults.scheme as any),
                    u && u.userInfo || defaults && (defaults.userInfo as any),
                    u && u.host || defaults && (defaults.host as any),
                    u && Type.isNumber(u.port, true) ? u.port : defaults && (defaults.port as any),
                    u && u.path || defaults && (defaults.path as any),
                    u && u.query || defaults && (defaults.query as any),
                    u && u.fragment || defaults && (defaults.fragment as any)
                );
            }


            /**
             * Parses a URL into it's components.
             * @param url The url to parse.
             * @returns {IUri} Will throw an exception if not able to parse.
             */
            static parse(url: string): IUri;
            static parse(url: string, throwIfInvalid: true): IUri;

            /**
             * Parses a URL into it's components.
             * @param url The url to parse.
             * @param throwIfInvalid Defaults to true.
             * @returns {IUri} Returns a map of the values or *null* if invalid and *throwIfInvalid* is <b>false</b>.
             */
            static parse(url: string, throwIfInvalid: boolean): IUri | null;
            static parse(url: string, throwIfInvalid: boolean = true): IUri | null {
                let result: IUri | null = null;
                const ex = tryParse(url, (out) => { result = out; });
                if (throwIfInvalid && ex) throw ex;
                return result;
            }

            /**
             * Parses a URL into it's components.
             * @param url The url to parse.
             * @param out A delegate to capture the value.
             * @returns {boolean} True if valid.  False if invalid.
             */
            static tryParse(url: string, out: (result: IUri) => void): boolean {
                return !tryParse(url, out); // return type is Exception.
            }

            static copyOf(map: IUri): IUri {
                return copyUri(map);
            }

            copyTo(map: IUri): IUri {
                return copyUri(this, map);
            }

            updateQuery(query: QueryParam.Convertible): Uri {
                const map = this.toMap();
                map.query = (query as any);
                return Uri.from(map);
            }


            /**
             * Is provided for sub classes to override this value.
             */
            protected getAbsoluteUri(): string {
                return uriToString(this);
            }

            /**
             * Is provided for sub classes to override this value.
             */
            protected getAuthority(): string {
                return getAuthority(this);
            }

            /**
             * Is provided for sub classes to override this value.
             */
            protected getPathAndQuery(): string {
                return getPathAndQuery(this);
            }

            /**
             * The absolute URI.
             */
            absoluteUri: string;

            /**
             * Gets the Domain Name System (DNS) host name or IP address and the port number for a server.
             */
            readonly authority: string | null;

            /**
             * Gets the path and Query properties separated by a question mark (?).
             */
            readonly pathAndQuery: string | null;

            /**
             * Gets the full path without the query or fragment.
             */
            readonly baseUri: string;

            /**
             * The segments that represent a path.<br/>
             * https://msdn.microsoft.com/en-us/library/system.uri.segments%28v=vs.110%29.aspx
             *
             * <h5><b>Example:</b></h5>
             * If the path value equals: ```/tree/node/index.html```<br/>
             * The result will be: ```['/','tree/','node/','index.html']```
             * @returns {string[]}
             */
            get pathSegments(): string[] {
                return this.path && this.path.match(/^[/]|[^/]*[/]|[^/]+$/g) || [];
            }

            /**
             * Creates a writable copy.
             * @returns {IUri}
             */
            toMap(): IUri {
                return this.copyTo({});
            }

            /**
             * @returns {string} The full absolute uri.
             */
            toString(): string {
                return this.absoluteUri;
            }

            /**
             * Properly converts an existing URI to a string.
             * @param uri
             * @returns {string}
             */
            static toString(uri: IUri): string {
                return uri instanceof (Uri as any)
                    ? (uri as Uri).absoluteUri
                    : uriToString(uri);
            }

            /**
             * Returns the authority segment of an URI.
             * @param uri
             * @returns {string}
             */
            static getAuthority(uri: IUri): string {
                return getAuthority(uri);
            }


        }

        export enum Fields {
            scheme,
            userInfo,
            host,
            port,
            path,
            query,
            fragment
        }

        Object.freeze(Fields);

        function copyUri(from: IUri, to?: IUri) {
            let i = 0, field: string;
            if (!to) to = {};
            while (field = Fields[i++]) {
                const value = (from as any)[field];
                if (value) (to as any)[field] = value;
            }
            return to;
        }

        const SLASH = "/", SLASH2 = "//", QM = Separator.Query, HASH = "#", EMPTY = "", AT = "@";

        function getScheme(scheme: SchemeValue.Any | string | null | undefined): SchemeValue.Any | null {
            let s: any = scheme;
            if (Type.isString(s)) {
                if (!s) return null;
                s = trim(s)
                    .toLowerCase()
                    .replace(/[^a-z0-9+.-]+$/g, EMPTY);
                if (!s) return null;
                if (Scheme.isValid(s)) return s as SchemeValue.Any;
            } else {
                if (s == null) return s as SchemeValue.Any;
            }
            throw new Exceptions.ArgumentOutOfRangeException("scheme", scheme, "Invalid scheme.");
        }

        function getPort(port: number | string | null | undefined): number | null {
            if (port === 0) return port as number;
            if (!port) return null;
            let p: number;

            if (Type.isNumber(port)) {
                p = (port as number);
                if (p >= 0 && isFinite(p))
                    return p;
            } else if (Type.isString(port) && (p = parseInt(port as string)) && !isNaN(p)) {
                return getPort(p);
            }

            throw new Exceptions.ArgumentException("port", "invalid value");
        }

        function getAuthority(uri: IUri): string {

            if (!uri.host) {
                if (uri.userInfo)
                    throw new Exceptions.ArgumentException("host", "Cannot include user info when there is no host.");

                if (Type.isNumber(uri.port, true))
                    throw new Exceptions.ArgumentException("host", "Cannot include a port when there is no host.");
            }

            /*
             * [//[user:password@]host[:port]]
             */

            let result = uri.host || EMPTY;

            if (result) {
                if (uri.userInfo) result = uri.userInfo + AT + result;
                if (!isNaN((uri.port) as any)) result += `:${uri.port}`;
                result = SLASH2 + result;
            }

            return result;
        }

        function formatQuery(query: string | null | undefined): string | null | undefined {
            return query && ((query.indexOf(QM) !== 0 ? QM : EMPTY) + query);
        }

        function formatFragment(fragment: string | null | undefined): string | null | undefined {
            return fragment && ((fragment.indexOf(HASH) !== 0 ? HASH : EMPTY) + fragment);
        }

        function getPathAndQuery(uri: IUri): string {

            const path = uri.path,
                query = uri.query;

            return EMPTY + (path || EMPTY) + (formatQuery(query) || EMPTY);

        }

        function uriToString(uri: IUri): string {
            // scheme:[//[user:password@]domain[:port]][/]path[?query][#fragment]
            // {scheme}{authority}{path}{query}{fragment}

            const scheme = getScheme(uri.scheme);
            let authority = getAuthority(uri);
            const pathAndQuery = getPathAndQuery(uri),
                fragment = formatFragment(uri.fragment);

            const part1 = EMPTY + ((scheme && (scheme + ":")) || EMPTY) + (authority || EMPTY);

            let part2 = EMPTY + (pathAndQuery || EMPTY) + (fragment || EMPTY);

            if (part1 && part2 && scheme && !authority)
                throw new Exceptions
                    .ArgumentException("authority", "Cannot format schemed Uri with missing authority.");

            if (part1 && pathAndQuery && pathAndQuery.indexOf(SLASH) !== 0)
                part2 = SLASH + part2;

            return part1 + part2;

        }


        function tryParse(url: string, out: Action<IUri>): null | Exception {
            if (!url)
                return new Exceptions.ArgumentException("url", "Nothing to parse.");


            // Could use a regex here, but well follow some rules instead.
            // The intention is to 'gather' the pieces.  This isn't validation (yet).

            // scheme:[//[user:password@]domain[:port]][/]path[?query][#fragment]
            let i: number;
            const result: IUri = {};

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
                let scheme = trim(url.substring(0, i));
                const c = /:$/;
                if (!c.test(scheme))
                    return new Exceptions.ArgumentException("url", "Scheme was improperly formatted");

                scheme = trim(scheme.replace(c, EMPTY));
                try {
                    result.scheme = getScheme(scheme) || VOID0;
                } catch (ex) {
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
                const port = parseInt(trim(url.substring(i + 1)));
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

        export module UriComponent {
            export interface Formattable {
                toUriComponent(): string;
            }

            export type Value
                = Primitive | Serialization.ISerializable | Formattable;

            export interface Map extends IMap<Value | Value[]> {

            }
        }

        export class QueryBuilder extends Collections.Dictionaries
            .OrderedStringKeyDictionary<UriComponent.Value | UriComponent.Value[]> {

            constructor(
                query: QueryParam.Convertible,
                decodeValues: boolean = true) {
                super();

                this.importQuery(query, decodeValues);
            }

            static init(
                query: QueryParam.Convertible,
                decodeValues: boolean = true): QueryBuilder {
                return new QueryBuilder(query, decodeValues);
            }

            importQuery(
                query: QueryParam.Convertible,
                decodeValues: boolean = true): QueryBuilder {

                if (Type.isString(query)) {
                    this.importFromString(query as string, decodeValues);
                } else if (Collections.Enumeration.isEnumerableOrArrayLike(query)) {
                    this.importEntries(query as any);
                } else {
                    this.importMap(query as UriComponent.Map);
                }

                return this;
            }

            /**
             * Property parses the components of an URI into their values or array of values.
             * @param values
             * @param deserialize
             * @param decodeValues
             * @returns {QueryBuilder}
             */
            importFromString(
                values: string,
                deserialize: boolean = true,
                decodeValues: boolean = true): QueryBuilder {
                const _ = this;
                parse(values,
                    (key, value) => {
                        if (_.containsKey(key)) {
                            const prev = _.getValue(key);
                            if ((prev) instanceof (Array))
                                prev.push(value);
                            else
                                _.setValue(key, [prev as UriComponent.Value, value]);
                        } else
                            _.setValue(key, value);
                    },
                    deserialize,
                    decodeValues);

                return this;
            }


            /**
             * Returns the encoded URI string
             */
            encode(prefixIfNotEmpty?: boolean): string {
                return encode(this, prefixIfNotEmpty);
            }

            toString(): string {
                return this.encode();
            }
        }

        export module QueryParam {
            export type Array
                = ArrayLike<StringKeyValuePair<UriComponent.Value | UriComponent.Value[]>>;

            export type Enumerable
                = Collections.Enumeration.IEnumerable<StringKeyValuePair<UriComponent.Value | UriComponent.Value[]>>;

            export type EnumerableOrArray
                = Collections.Enumeration.
                IEnumerableOrArray<StringKeyValuePair<UriComponent.Value | UriComponent.Value[]>>;

            export type Convertible
                = string | UriComponent.Map | EnumerableOrArray;
        }
        
        export function encode(
            values: UriComponent.Map | QueryParam.EnumerableOrArray,
            prefixIfNotEmpty?: boolean): string {
            if (!values) return EMPTY;
            const entries: string[] = [];

            if (Collections.Enumeration.isEnumerableOrArrayLike(values)) {
                Collections.ArrayModule.forEach(values as any,
                    entry =>
                    KeyValueExtractModule.extractKeyValue(entry as any,
                        (key, value) => appendKeyValue(entries, key as any, value as any))
                );
            } else {
                Object.keys(values).forEach(
                    key => appendKeyValue(entries, key, values[key])
                );
            }

            return (entries.length && prefixIfNotEmpty ? QUERY_SEPARATOR : EMPTY) + entries.join(ENTRY_SEPARATOR);
        }

        function appendKeyValueSingle(
            entries: string[],
            key: string,
            value: UriComponent.Value): void {
            entries.push(key + KEY_VALUE_SEPARATOR + encodeValue(value));
        }

        // According to spec, if there is an array of values with the same key, then each value is replicated with that key.
        function appendKeyValue(
            entries: string[],
            key: string,
            value: UriComponent.Value | Collections.Enumeration.IEnumerableOrArray<UriComponent.Value>): void {
            if (Collections.Enumeration.isEnumerableOrArrayLike(value)) {
                Collections.ArrayModule.forEach(value as any, v => appendKeyValueSingle(entries, key, v as any));
            } else {
                appendKeyValueSingle(entries, key, value);
            }
        }

        /**
         * Converts any primitive, serializable or uri-component object to an encoded string.
         * @param value
         * @returns {string}
         */
        export function encodeValue(value: UriComponent.Value): string {
            if (isUriComponentFormattable(value)) {
                const v: string = value.toUriComponent();
                if (v && v.indexOf(ENTRY_SEPARATOR) != 1)
                    throw ".toUriComponent() did not encode the value.";
                return v;
            } else {
                return encodeURIComponent(Serialization.toString(value));
            }
        }

        /**
         * A shortcut for identifying an UriComponent.Formattable object.
         * @param instance
         * @returns {boolean}
         */
        export function isUriComponentFormattable(instance: any): instance is UriComponent.Formattable {
            return Type.hasMemberOfType<UriComponent.Formattable>(instance, TO_URI_COMPONENT, Type.FUNCTION);
        }

        /**
         * Parses a string for valid query param entries and pipes them through a handler.
         * @param query
         * @param entryHandler
         * @param deserialize Default is true.
         * @param decodeValues Default is true.
         */
        export function parse(
            query: string,
            entryHandler: (key: string, value: Primitive) => void,
            deserialize: boolean = true,
            decodeValues: boolean = true): void {
            if (query && (query = query.replace(/^\s*\?+/, ""))) {
                const entries = query.split(ENTRY_SEPARATOR);
                for (let entry of entries) {
                    /*
                     * Since it is technically possible to have multiple '=' we need to identify the first one.
                     * And if there is no '=' then the entry is ignored.
                     */
                    const si = entry.indexOf(KEY_VALUE_SEPARATOR);
                    if (si != -1) {
                        let key = entry.substring(0, si);
                        let value = entry.substring(si + 1) as any;
                        if (decodeValues) value = decodeURIComponent(value);
                        if (deserialize) value = Serialization.toPrimitive(value);
                        entryHandler(key, value);
                    }
                }
            }
        }

        /**
         * Parses a string for valid query params and returns a key-value map of the entries.
         * @param query
         * @param deserialize Default is true.
         * @param decodeValues Default is true.
         * @returns {IMap<Primitive>}
         */
        export function parseToMap(
            query: string,
            deserialize: boolean = true,
            decodeValues: boolean = true): IMap<Primitive | Primitive[]> {
            const result: IMap<Primitive | Primitive[]> = {};
            parse(query,
                (key, value) => {
                    if ((key) in (result)) {
                        let prev: any = result[key];
                        if (!((prev) instanceof (Array)))
                            result[key] = prev = [prev];
                        prev.push(value);
                    } else
                        result[key] = value;
                },
                deserialize,
                decodeValues);
            return result;
        }

        /**
         * Parses a string for valid query params and returns a key-value pair array of the entries.
         * @param query
         * @param deserialize Default is true.
         * @param decodeValues Default is true.
         * @returns {IKeyValuePair<string, Primitive>[]}
         */
        export function parseToArray(
            query: string,
            deserialize: boolean = true,
            decodeValues: boolean = true): IStringKeyValuePair<Primitive>[] {
            const result: IStringKeyValuePair<Primitive>[] = [];
            parse(query,
                (key, value) => { result.push({ key: key, value: value }); },
                deserialize,
                decodeValues
            );
            return result;
        }

    }

    export namespace Serialization {
        import InvalidOperationException = Exceptions.InvalidOperationException;

        export interface ISerializable {
            serialize(): string;
        }

        const EMPTY = "", TRUE = "true", FALSE = "false";

        export function toString(
            value: Primitive | ISerializable | undefined | null,
            defaultForUnknown?: string): string {

            const v = value as any;
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

                    const ex = new InvalidOperationException("Attempting to serialize unidentifiable type.");
                    ex.data["value"] = v;
                    throw ex;

            }

        }

        export function isSerializable(instance: any): instance is ISerializable {
            return Type.hasMemberOfType<ISerializable>(instance, "serialize", Type.FUNCTION);
        }

        export function toPrimitive(
            value: string,
            caseInsensitive?: boolean,
            unknownHandler?: (v: string) => string): Primitive | null | undefined {


            if (value) {
                if (caseInsensitive) value = value.toLowerCase();

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

                        const cleaned = value.replace(/^\s+|,|\s+$/g, EMPTY);
                        if (cleaned) {

                            if (/^\d+$/g.test(cleaned)) {
                                const int = parseInt(cleaned);
                                if (!isNaN(int)) return int;
                            } else {
                                const number = parseFloat(value);
                                if (!isNaN(number)) return number;
                            }

                        }

                        // Handle Dates...  Possibly JSON?

                        // Instead of throwing we allow for handling...
                        if (unknownHandler) value = unknownHandler(value);

                        break;
                }

            }

            return value;

        }
    }

    export namespace Text {
        const EMPTY = "";

        const _I = "i", _G = "g", _M = "m", _U = "u", _W = "w", _Y = "y";

        export module RegexOptions {
            export type Global = "g";
            export type IgnoreCase = "i";
            export type MultiLine = "m";
            export type Unicode = "u";
            export type Sticky = "y";
            export type IgnorePatternWhitespace = "w";

            export type Literal = Global | IgnoreCase | MultiLine | Unicode | Sticky | IgnorePatternWhitespace;


            /**
             * Specifies case-insensitive matching. For more information, see the "Case-Insensitive Matching " section in the Regular Expression Options topic.
             */
            export const IGNORE_CASE: IgnoreCase = _I as IgnoreCase;
            export const I: IgnoreCase = _I as IgnoreCase;

            /**
             * Specifies global matching instead of single.
             */
            export const GLOBAL: Global = _G as Global;
            export const G: Global = _G as Global;

            /**
             * treat beginning and end characters (^ and $) as working over multiple lines (i.e., match the beginning or end of each line (delimited by \n or \r), not only the very beginning or end of the whole input string)
             */
            export const MULTI_LINE: MultiLine = _M as MultiLine;
            export const M: MultiLine = _M as MultiLine;

            /**
             * treat pattern as a sequence of unicode code points
             */
            export const UNICODE: Unicode = _U as Unicode;
            export const U: Unicode = _U as Unicode;

            /**
             * matches only from the index indicated by the lastIndex property of this regular expression in the target string (and does not attempt to match from any later indexes).
             */
            export const STICKY: Sticky = _Y as Sticky;
            export const Y: Sticky = _Y as Sticky;

            /**
             * Modifies the pattern to ignore standard whitespace characters.
             */
            export const IGNORE_PATTERN_WHITESPACE: IgnorePatternWhitespace = _W as IgnorePatternWhitespace;
            export const W: IgnorePatternWhitespace = _W as IgnorePatternWhitespace;

        }


        export class Regex {
            private readonly _re: RegExp;
            private readonly _keys: string[];

            constructor(
                pattern: string | RegExp,
                options?: RegexOptions.Literal | RegexOptions.Literal[],
                ...extra: RegexOptions.Literal[]) {
                if (!pattern) throw new Error("'pattern' cannot be null or empty.");

                let patternString: string,
                    flags: string = (options && ((options) instanceof (Array) ? options : [options]).concat(extra) ||
                        extra)
                        .join(EMPTY)
                        .toLowerCase();

                if (pattern instanceof RegExp) {
                    const p = pattern as RegExp;
                    if (p.ignoreCase && flags.indexOf(_I) === -1)
                        flags += _I;
                    if (p.multiline && flags.indexOf(_M) === -1)
                        flags += _M;
                    patternString = p.source;
                } else {
                    patternString = pattern;
                }
                const ignoreWhiteSpace = flags.indexOf(_W) != -1;

                // For the majority of expected behavior, we need to eliminate global and whitespace ignore.
                flags = flags.replace(/[gw]/g, EMPTY);

                // find the keys inside the pattern, and place in mapping array {0:'key1', 1:'key2', ...}
                const keys: string[] = [];
                {
                    const k = patternString.match(/(?!\(\?<)(\w+)(?=>)/g);
                    if (k) {
                        for (let i = 0, len = k.length; i < len; i++) {
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

            match(input: string, startIndex: number = 0): Match {
                const _ = this;
                let r: RegExpExecArray | null;
                if (!input || startIndex >= input.length || !(r = this._re.exec(input.substring(startIndex))))
                    return Match.Empty;

                if (!(startIndex > 0)) startIndex = 0;

                const first = startIndex + r.index;
                let loc = first;
                const groups: Group[] = [],
                    groupMap: IMap<Group> = {};

                for (let i = 0, len = r.length; i < len; ++i) {
                    const text = r[i];
                    let g = EmptyGroup;
                    if (text != null) {
                        // Empty string might mean \b match or similar.
                        g = new Group(text, loc);
                        g.freeze();
                    }
                    if (i && _._keys && i < _._keys.length) groupMap[_._keys[i]] = g;
                    groups.push(g);
                    if (i !== 0) loc += text.length;
                }

                const m = new Match(r[0], first, groups, groupMap);
                m.freeze();
                return m;
            }

            matches(input: string): Match[] //Readonly<Match[]>
            {
                const matches: Match[] = [];
                let m: Match, p = 0;
                const end = input && input.length || 0;
                while (p < end && (m = this.match(input, p)) && m.success) {
                    matches.push(m);
                    p = m.index + m.length;
                }
                Object.freeze(matches);
                return matches;
            }

            replace(
                input: string,
                replacement: Primitive,
                count?: number): string;
            replace(
                input: string,
                evaluator: SelectorWithIndex<Match, Primitive>,
                count?: number): string;
            replace(
                input: string,
                r: any,
                count: number = Infinity): string {
                if (!input || r == null || !(count > 0)) return input;
                const result: string[] = [];
                let p = 0;
                const end = input.length, isEvaluator = typeof r == "function";

                let m: Match, i: number = 0;
                while (i < count && p < end && (m = this.match(input, p)) && m.success) {
                    const { index, length } = m;
                    if (p !== index) result.push(input.substring(p, index));
                    result.push(isEvaluator ? r(m, i++) : r);
                    p = index + length;
                }

                if (p < end) result.push(input.substring(p));

                return result.join(EMPTY);
            }

            isMatch(input: string): boolean {
                return this._re.test(input);
            }

            static isMatch(
                input: string,
                pattern: string,
                options?: RegexOptions.Literal[]): boolean {
                const r = new Regex(pattern, options);
                return r.isMatch(input);
            }

            static replace(
                input: string,
                pattern: string,
                replacement: string,
                options?: RegexOptions.Literal[]): string;
            static replace(
                input: string,
                pattern: string,
                evaluator: SelectorWithIndex<Match, Primitive>,
                options?: RegexOptions.Literal[]): string;
            static replace(
                input: string,
                pattern: string,
                e: any,
                options?: RegexOptions.Literal[]): string {
                const r = new Regex(pattern, options);
                return r.replace(input, e);
            }
        }

        export class Capture {

            get length(): number {
                const v = this.value;
                return v && v.length || 0;
            }

            constructor(
                public readonly value: string = EMPTY,
                public readonly index: number = -1) {
            }

            freeze(): void {
                Object.freeze(this);
            }
        }

        export class Group extends Capture {
            get success(): boolean {
                return this.index != -1;
            }

            constructor(
                value: string = EMPTY,
                index: number = -1) {
                super(value, index);
            }

            static get Empty(): Group {
                return EmptyGroup;
            }

        }

        const EmptyGroup = new Group();
        EmptyGroup.freeze();

        export class Match extends Group {

            constructor(
                value: string = EMPTY,
                index: number = -1,
                public readonly groups: Group[] = [],
                public readonly namedGroups: IMap<Group> = {}) {
                super(value, index);
            }

            freeze(): void {
                if (!this.groups) throw new Error("'groups' cannot be null.");
                if (!this.namedGroups) throw new Error("'groupMap' cannot be null.");
                Object.freeze(this.groups);
                Object.freeze(this.namedGroups);
                super.freeze();
            }

            static get Empty(): Match {
                return EmptyMatch;
            }
        }

        const EmptyMatch = new Match();
        EmptyMatch.freeze();

        export class RegexMatchEnumerator {
            private readonly _pattern: Regex;

            constructor(pattern: string | RegExp | Regex) {
                if (pattern instanceof Regex) {
                    this._pattern = pattern;
                } else {
                    this._pattern = new Regex(pattern);
                }
            }

            matches(input: string): Collections.Enumeration.IEnumerator<Match> {
                let p: number; // pointer
                return new Collections.Enumeration.EnumeratorBase<Match>(
                    () => {
                        p = 0;
                    },
                    yielder => {
                        const match: Match = this._pattern.match(input, p);
                        if (match.success) {
                            p = match.index + match.length;
                            return yielder.yieldReturn(match);
                        }

                        return yielder.yieldBreak();
                    });
            }

            static matches(input: string, pattern: string | RegExp | Regex): Collections.Enumeration.IEnumerator<Match> {
                return input && pattern
                    ? (new RegexMatchEnumerator(pattern)).matches(input)
                    : Collections.Enumeration.EmptyEnumerator;
            }

        }

        export namespace Padding {
            const SPACE = " ";
            const ZERO = "0";

            export function padStringLeft(source: string, minLength: number, pad: string = SPACE): string {
                return pad && minLength > 0
                    ? (repeat(pad, minLength - source.length) + source)
                    : source;
            }

            export function padStringRight(source: string, minLength: number, pad: string = SPACE): string {
                return pad && minLength > 0
                    ? (source + repeat(pad, minLength - source.length))
                    : source;
            }

            export function padNumberLeft(source: number, minLength: number, pad: string | number = ZERO): string {
                if (!Type.isNumber(source, true))
                    throw new Error("Cannot pad non-number.");

                if (!source) source = 0;

                return padStringLeft(source + EMPTY, minLength, pad + EMPTY);
            }


            export function padNumberRight(source: number, minLength: number, pad: string | number = ZERO): string {
                if (!Type.isNumber(source, true))
                    throw new Error("Cannot pad non-number.");

                if (!source) source = 0;

                return padStringRight(source + EMPTY, minLength, pad + EMPTY);
            }

            export function padLeft(source: string, minLength: number, pad?: string): string;
            export function padLeft(source: number, minLength: number, pad?: string | number): string;
            export function padLeft(source: string | number, minLength: number, pad?: any): string {
                if (Type.isString(source)) return padStringLeft(source, minLength, pad);
                if (Type.isNumber(source, true)) return padNumberLeft(source, minLength, pad);
                throw new Error("Invalid source type.");
            }

            export function padRight(source: string, minLength: number, pad?: string): string;
            export function padRight(source: number, minLength: number, pad?: string | number): string;
            export function padRight(source: string | number, minLength: number, pad?: any): string {
                if (Type.isString(source)) return padStringRight(source, minLength, pad);
                if (Type.isNumber(source, true)) return padNumberRight(source, minLength, pad);
                throw new Error("Invalid source type.");
            }
        }

        export class StringBuilder implements Disposable.IDisposable
        // Adding IDisposable allows for use with System.using();
        // ... and since this may end up being a large array container, might be a good idea to allow for flexible cleanup.
        {
            //noinspection JSMismatchedCollectionQueryUpdate
            private _partArray: any[];
            private _latest: string | null; // AKA persistentString

            constructor(...initial: any[]) {
                const _ = this;
                _._latest = null;
                _._partArray = [];
                _.appendThese(initial);
            }

            private appendSingle(item: any): void {
                if (item != null) {
                    const _ = this;
                    _._latest = null;
                    switch (typeof item) {
                        case Type.OBJECT:
                        case Type.FUNCTION:
                            item = item.toString();
                            break;
                    }
                    _._partArray
                        .push(item);
                    // Other primitive types can keep their format since a number or boolean is a smaller footprint than a string.
                }

            }

            appendThese(items: any[]): StringBuilder {
                const _ = this;
                items.forEach(s => _.appendSingle(s));
                return _;
            }

            append(...items: any[]): StringBuilder {
                this.appendThese(items);
                return this;
            }

            appendLine(...items: any[]): StringBuilder {
                this.appendLines(items);
                return this;
            }

            appendLines(items: any[]): StringBuilder {
                const _ = this;
                items.forEach(
                    i => {
                        if (i != null) {
                            _.appendSingle(i);
                            _._partArray.push("\r\n");
                        }
                    }
                );
                return _;
            }

            /** /// These methods can only efficiently be added if not using a single array.
             insert(index: number, value: string, count: number = 1): StringBuilder
             {
        
            }
        
             remove(startIndex:number, length:number): StringBuilder
             {
        
            }
             /**/

            get isEmpty() {
                return this._partArray.length === 0;
            }

            toString() {
                let latest = this._latest;
                if (!latest == null)
                    this._latest = latest = this._partArray.join();

                return latest;
            }

            join(delimiter: string): string {
                return this._partArray.join(delimiter);
            }

            clear(): void {
                this._partArray.length = 0;
                this._latest = null;
            }

            dispose(): void {
                this.clear();
            }

        }

        export namespace Encoding {
            export class UTF8 {
                static GetBytes(text: string): ArrayBuffer {
                    const buf = new ArrayBuffer(text.length * 2);
                    const bufView = new Uint16Array(buf);
                    for (var i = 0, strLen = text.length; i < strLen; i++) {
                        bufView[i] = text.charCodeAt(i);
                    }
                    return buf;

                }

                static GetString(buf: ArrayBuffer): string {
                    return String.fromCharCode.apply(null, new Uint16Array(buf));
                }
            }

            export var Unicode = UTF8;
        }
    }

    export namespace Web {
        export class HttpUtility {
            static UrlEncode(uri: string): string {
                return encodeURI(uri);
            }

            static UrlDecode(enc: string): string {
                return decodeURI(enc);
            }
        }
    }

    export namespace Time {
        function getUnitQuantityFrom(q: ITimeQuantity, units: TimeUnit) {
            return TimeUnit.fromMilliseconds(q.getTotalMilliseconds(), units);
        }

        export module Hours {
            export const enum Per {
                Day = 24
            }
        }

        export module Minutes {
            export const enum Per {
                Hour = 60,
                Day = 60 * 24
            }

        }

        export module Seconds {
            export const enum Per {
                Minute = 60,
                Hour = 60 * 60,
                Day = 3600 * 24
            }

        }

        export module Milliseconds {
            export const enum Per {
                Second = 1000,
                Minute = 1000 * 60,
                Hour = 60000 * 60,
                Day = Hour * 24
            }

        }

        export module Ticks {
            export const enum Per {
                Millisecond = 10000,
                Second = Millisecond * 1000,
                Minute = Second * 60,
                Hour = Minute * 60,
                Day = Hour * 24
            }

        }

        export declare module Gregorian {
            export const enum Month {
                January,
                February,
                March,
                April,
                May,
                June,
                July,
                August,
                September,
                October,
                November,
                December
            }

            export const enum DayOfWeek {
                Sunday,
                Monday,
                Tuesday,
                Wednesday,
                Thursday,
                Friday,
                Saturday
            }
        }

        export interface ICalendarDate {
            year: number;
            month: number;
            day: number;
        }

        export interface IClockTime {
            hour: number;
            minute: number;
            second: number;
            millisecond: number;
            tick: number;
        }

        export interface ITimeStamp extends ICalendarDate, IClockTime {

        }

        export interface IDateTime {
            toJsDate(): Date;
        }

        export interface ITimeQuantity {
            getTotalMilliseconds(): number;
            total: ITimeMeasurement;
        }

        export interface ITimeMeasurement {
            ticks: number;
            milliseconds: number;
            seconds: number;
            minutes: number;
            hours: number;
            days: number;
        }

        export enum TimeUnit {
            Ticks,
            Milliseconds,
            Seconds,
            Minutes,
            Hours,
            Days
        } // Earth Days

        export module TimeUnit {

            export function toMilliseconds(
                value: number,
                units: TimeUnit = TimeUnit.Milliseconds): number {
                // noinspection FallThroughInSwitchStatementJS
                switch (units) {
                    case TimeUnit.Days:
                        value *= Time.Hours.Per.Day;
                    case TimeUnit.Hours:
                        value *= Time.Minutes.Per.Hour;
                    case TimeUnit.Minutes:
                        value *= Time.Seconds.Per.Minute;
                    case TimeUnit.Seconds:
                        value *= Time.Milliseconds.Per.Second;
                    case TimeUnit.Milliseconds:
                        return value;
                    case TimeUnit.Ticks:
                        return value / Time.Ticks.Per.Millisecond;
                    default:
                        throw new Error("Invalid TimeUnit.");
                }
            }

            export function fromMilliseconds(
                ms: number,
                units: TimeUnit) {
                switch (units) {
                    case TimeUnit.Days:
                        return ms / Time.Milliseconds.Per.Day;
                    case TimeUnit.Hours:
                        return ms / Time.Milliseconds.Per.Hour;
                    case TimeUnit.Minutes:
                        return ms / Time.Milliseconds.Per.Minute;
                    case TimeUnit.Seconds:
                        return ms / Time.Milliseconds.Per.Second;
                    case TimeUnit.Milliseconds:
                        return ms;
                    case TimeUnit.Ticks:
                        return ms * Time.Ticks.Per.Millisecond;
                    default:
                        throw new Error("Invalid TimeUnit.");
                }
            }

            export function from(quantity: ITimeQuantity, unit: TimeUnit): number {
                return quantity && fromMilliseconds(quantity.getTotalMilliseconds(), unit);
            }


            export function assertValid(unit: TimeUnit): true | never {
                if (isNaN(unit) || unit > TimeUnit.Days || unit < TimeUnit.Ticks || Math.floor(unit) !== unit)
                    throw new Error("Invalid TimeUnit.");

                return true;
            }

        }

        import AreEqual = Compare.areEqual;

        function pluralize(value: number, label: string): string {
            if (Math.abs(value) !== 1)
                label += "s";

            return label;
        }

        export module DateTime {
            export const enum Kind {
                Unspecified,
                Local,
                Utc,
            }
        }

        export class DateTime implements ICalendarDate, IDateTime, IEquatable<IDateTime>, IComparable<IDateTime> {
            private readonly _value: Date;

            toJsDate(): Date {
                return new Date(this._value.getTime()); // return a clone.
            }

            constructor();
            constructor(dateString: string, kind?: DateTime.Kind);
            constructor(milliseconds: number, kind?: DateTime.Kind);
            constructor(source: Date, kind?: DateTime.Kind);
            constructor(source: DateTime, kind?: DateTime.Kind);
            constructor(value: any = new Date(), kind: DateTime.Kind = DateTime.Kind.Local) {
                this._kind = kind;
                if (value instanceof DateTime) {
                    this._value = value.toJsDate();
                    if (kind === VOID0) this._kind = value._kind;
                } else if (value instanceof Date)
                    this._value = new Date(value.getTime());
                else
                    this._value = value === VOID0
                        ? new Date()
                        : new Date(value);
            }

            private readonly _kind: DateTime.Kind;

            get kind(): DateTime.Kind {
                return this._kind;
            }

            get year(): number {
                return this._value.getFullYear();
            }

            /**
             * Returns the Gregorian Month (zero indexed).
             * @returns {number}
             */
            get month(): Gregorian.Month {
                return this._value.getMonth();
            }

            /**
             * Returns the month number (1-12).
             * @returns {number}
             */
            get calendarMonth(): number {
                return this._value.getMonth() + 1;
            }

            get calendar(): ICalendarDate {
                return {
                    year: this.year,
                    month: this.calendarMonth,
                    day: this.day
                };
            }

            /**
             * Returns the day of the month.  An integer between 1 and 31.
             * @returns {number}
             */
            get day(): number {
                return this._value.getDate();
            }

            /**
             * Returns the day of the month indexed starting at zero.
             * @returns {number}
             */
            get dayIndex(): number {
                return this._value.getDate() - 1;
            }

            /**
             * Returns the zero indexed day of the week. (Sunday == 0)
             * @returns {number}
             */
            get dayOfWeek(): Gregorian.DayOfWeek {
                return this._value.getDay();
            }


            addMilliseconds(ms: number): DateTime {
                ms = ms || 0;
                return new DateTime(this._value.getTime() + ms, this._kind);
            }

            addSeconds(seconds: number): DateTime {
                seconds = seconds || 0;
                return this.addMilliseconds(seconds * Milliseconds.Per.Second);
            }

            addMinutes(minutes: number): DateTime {
                minutes = minutes || 0;
                return this.addMilliseconds(minutes * Milliseconds.Per.Minute);
            }

            addHours(hours: number): DateTime {
                hours = hours || 0;
                return this.addMilliseconds(hours * Milliseconds.Per.Hour);
            }

            addDays(days: number): DateTime {
                days = days || 0;
                return this.addMilliseconds(days * Milliseconds.Per.Day);
            }

            addMonths(months: number): DateTime {
                months = months || 0;
                const d = this.toJsDate();
                d.setMonth(d.getMonth() + months);
                return new DateTime(d, this._kind);
            }

            addYears(years: number): DateTime {
                years = years || 0;
                const d = this.toJsDate();
                d.setFullYear(d.getFullYear() + years);
                return new DateTime(d, this._kind);
            }


            /**
             * Receives an ITimeQuantity value and adds based on the total milliseconds.
             * @param {ITimeQuantity} time
             * @returns {DateTime}
             */
            add(time: ITimeQuantity): DateTime {
                return this.addMilliseconds(time.getTotalMilliseconds());
            }

            /**
             * Receives an ITimeQuantity value and subtracts based on the total milliseconds.
             * @param {ITimeQuantity} time
             * @returns {DateTime}
             */
            subtract(time: ITimeQuantity): DateTime {
                return this.addMilliseconds(-time.getTotalMilliseconds());
            }

            /**
             * Returns a TimeSpan representing the amount of time between two dates.
             * @param previous
             * @returns {TimeSpan}
             */
            timePassedSince(previous: Date | DateTime): TimeSpan {
                return DateTime.between(previous, this);
            }

            /**
             * Returns a DateTime object for 00:00 of this date.
             */
            get date(): DateTime {
                const _ = this;
                return new DateTime(
                    new Date(
                        _.year,
                        _.month,
                        _.day
                    ),
                    _._kind
                );
            }

            private _time: ClockTime | null;

            /**
             * Returns the time of day represented by a ClockTime object.
             * @returns {ClockTime}
             */
            get timeOfDay(): ClockTime {
                const _ = this;
                let t = _._time;
                if (!t) {
                    const d = this._value;
                    _._time = t = new ClockTime(
                        d.getHours(),
                        d.getMinutes(),
                        d.getSeconds(),
                        d.getMilliseconds());
                }
                return t;
            }

            /**
             * Returns a readonly object which contains all the date and time components.
             */
            toTimeStamp(): ITimeStamp {
                return TimeStamp.from(this);
            }

            /**
             * Returns the now local time.
             * @returns {DateTime}
             */
            static get now(): DateTime {
                return new DateTime();
            }

            /**
             * Returns a UTC version of this date if its kind is local.
             * @returns {DateTime}
             */
            get toUniversalTime(): DateTime {
                const _ = this;
                if (_._kind != DateTime.Kind.Local)
                    return new DateTime(_, _._kind);

                const d = _._value;
                return new DateTime(
                    new Date(
                        d.getUTCFullYear(),
                        d.getUTCMonth(),
                        d.getUTCDate(),
                        d.getUTCHours(),
                        d.getUTCMinutes(),
                        d.getUTCSeconds(),
                        d.getUTCMilliseconds()
                    ),
                    DateTime.Kind.Utc
                );
            }

            /**
             * Compares a JS Date with the current instance.  Does not evaluate the kind.
             * @param other
             * @returns {boolean}
             */
            equals(other: Date): boolean;

            /**
             * Compares another IDateTime object and returns true if they or their value are equal.
             * @param other The other IDateTime object.
             * @param strict When strict is true, the 'kind' also must match.
             * @returns {boolean}
             */
            equals(other: IDateTime, strict?: boolean): boolean;
            equals(other: IDateTime | Date, strict: boolean = false): boolean {
                if (!other) return false;
                if (other == this) return true;

                if (other instanceof Date) {
                    const v = this._value;
                    return other == v || other.getTime() == v.getTime();
                }

                if (other instanceof DateTime) {
                    if (strict) {
                        const ok = other._kind;
                        if (!ok && this._kind || ok != this._kind) return false;
                    }

                    return this.equals(other._value);
                } else if (strict)
                    return false;

                return this.equals(other.toJsDate());

            }

            // https://msdn.microsoft.com/en-us/library/system.icomparable.compareto(v=vs.110).aspx
            compareTo(other: IDateTime | Date): number {
                if (!other) throw new Exceptions.ArgumentNullException("other");
                if (other === this) return 0;

                if (other instanceof DateTime) {
                    other = other._value;
                }

                const ms = this._value.getTime();

                if (other instanceof Date) {
                    return ms - other.getTime();
                }

                return ms - other.toJsDate().getTime();
            }

            equivalent(other: IDateTime | Date): boolean {
                if (!other) return false;
                if (other == this) return true;

                if (other instanceof Date) {
                    const v = this._value;
                    // TODO: What is the best way to handle this when kinds match or don't?
                    return v.toUTCString() === other.toUTCString();
                }

                if (other instanceof DateTime) {
                    if (this.equals(other, true)) return true;
                }

                return this.equivalent(other.toJsDate());
            }

            /**
             * The date component for now.
             * @returns {DateTime}
             */
            static get today(): DateTime {
                return DateTime.now.date;
            }

            /**
             * Midnight tomorrow.
             * @returns {DateTime}
             */
            static get tomorrow(): DateTime {
                const today = DateTime.today;
                return today.addDays(1);
            }

            /**
             * Measures the difference between two dates as a TimeSpan.
             * @param first
             * @param last
             */
            static between(first: Date | DateTime, last: Date | DateTime): TimeSpan {
                const f: Date = first instanceof DateTime ? first._value : (first as Date),
                    l: Date = last instanceof DateTime ? last._value : (last as Date);

                return new TimeSpan(l.getTime() - f.getTime());
            }

            /**
             * Calculates if the given year is a leap year using the formula:
             * ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)
             * @param year
             * @returns {boolean}
             */
            static isLeapYear(year: number): boolean {
                return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
            }

            /**
             * Returns the number of days for the specific year and month.
             * @param year
             * @param month
             * @returns {any}
             */
            static daysInMonth(year: number, month: Gregorian.Month): number {
                // Basically, add 1 month, subtract a day... What's the date?
                return (new Date(year, month + 1, 0)).getDate();
            }

            static from(calendarDate: ICalendarDate): DateTime;
            static from(year: number, month: Gregorian.Month, day: number): DateTime;
            static from(
                yearOrDate: number | ICalendarDate,
                month: number = 0,
                day: number = 1): DateTime {
                let year: number;
                if (typeof yearOrDate == "object") {
                    day = (yearOrDate as ICalendarDate).day;
                    month = (yearOrDate as ICalendarDate).month;
                    year = (yearOrDate as ICalendarDate).year;
                } else {
                    year = yearOrDate as number;
                }

                return new DateTime(new Date(year, month, day));

            }


            static fromCalendarDate(calendarDate: ICalendarDate): DateTime;
            static fromCalendarDate(year: number, month: number, day: number): DateTime;
            static fromCalendarDate(
                yearOrDate: number | ICalendarDate,
                month: number = 1,
                day: number = 1): DateTime {
                let year: number;
                if (typeof yearOrDate == "object") {
                    day = (yearOrDate as ICalendarDate).day;
                    month = (yearOrDate as ICalendarDate).month;
                    year = (yearOrDate as ICalendarDate).year;
                } else {
                    year = yearOrDate as number;
                }

                return new DateTime(new Date(year, month - 1, day));

            }

        }

        export class TimeQuantity implements IEquatable<ITimeQuantity>, IComparable<ITimeQuantity>, ITimeQuantity {

            constructor(protected _quantity: number = 0) {
                this._resetTotal();
            }

            // Provides an overridable mechanism for extending this class.
            getTotalMilliseconds(): number {
                return this._quantity;
            }

            /**
             * +1, 0, or -1 depending on the time direction.
             * @returns {number}
             */
            get direction(): number {
                return Compare.compare(this.getTotalMilliseconds(), 0);
            }

            /**
             * Compares this instance against any other time quantity instance and return true if the amount of time is the same.
             * @param other
             * @returns {boolean}
             */
            equals(other: ITimeQuantity): boolean {
                return AreEqual(this.getTotalMilliseconds(), other && other.total && other.total.milliseconds);
            }

            /**
             * Compares this instance against any other time quantity instance.
             * @param other
             * @returns {CompareResult}
             */
            compareTo(other: ITimeQuantity): number {
                return Compare.compare(this.getTotalMilliseconds(), other && other.total && other.total.milliseconds);
            }

            protected _total: Lazy<ITimeMeasurement>;

            protected _resetTotal(): void {
                const t = this._total;
                if (!t || t.isValueCreated) {
                    this._total = Lazy.create(() => {
                        const ms = this.getTotalMilliseconds();

                        return Object.freeze({
                            ticks: ms * Ticks.Per.Millisecond,
                            milliseconds: ms,
                            seconds: ms / Milliseconds.Per.Second,
                            minutes: ms / Milliseconds.Per.Minute,
                            hours: ms / Milliseconds.Per.Hour,
                            days: ms / Milliseconds.Per.Day
                        }) as ITimeMeasurement;
                    });
                }
            }

            /**
             * Returns an object with all units exposed as totals.
             * @returns {ITimeMeasurement}
             */
            get total(): ITimeMeasurement {
                return this._total.value;
            }

            /**
             * Returns the total amount of time measured in the requested TimeUnit.
             * @param units
             * @returns {number}
             */
            getTotal(units: TimeUnit): number {
                return TimeUnit.fromMilliseconds(this.getTotalMilliseconds(), units);
            }
        }

        class TimeUnitValue extends TimeQuantity {

            constructor(value: number | ITimeQuantity, private _units: TimeUnit) {
                super(typeof value == "number"
                    ? value as number
                    : getUnitQuantityFrom(value as ITimeQuantity, _units));
                TimeUnit.assertValid(_units);
            }

            get value(): number {
                return this._quantity;
            }

            set value(v: number) {
                this._quantity = v;
                this._resetTotal();
            }

            getTotalMilliseconds(): number {
                return TimeUnit.toMilliseconds(this._quantity, this._units);
            }

            // To avoid confusion, the unit type can only be set once at construction.
            get units(): TimeUnit {
                return this._units;
            }

            to(units: TimeUnit = this.units): TimeUnitValue {
                return TimeUnitValue.from(this, units);
            }

            static from(value: number | ITimeQuantity, units: TimeUnit = TimeUnit.Milliseconds): TimeUnitValue {
                return new TimeUnitValue(value, units);
            }

        }

        export class ClockTime extends TimeQuantity implements IClockTime {

            readonly days: number;
            readonly hour: number;
            readonly minute: number;
            readonly second: number;
            readonly millisecond: number;
            readonly tick: number;

            constructor(milliseconds: number);
            constructor(hours: number, minutes: number, seconds?: number, milliseconds?: number);
            constructor(...args: number[]) {
                super(
                    args.length > 1
                        ? ClockTime.millisecondsFromTime(
                            args[0] || 0,
                            args[1] || 0,
                            args.length > 2 && args[2] || 0,
                            args.length > 3 && args[3] || 0
                        )
                        : (args.length > 0 && args[0] || 0)
                );

                const ms = Math.abs(this.getTotalMilliseconds());
                let msi = Math.floor(ms);

                this.tick = (ms - msi) * Ticks.Per.Millisecond;

                this.days = (msi / Milliseconds.Per.Day) | 0;
                msi -= this.days * Milliseconds.Per.Day;

                this.hour = (msi / Milliseconds.Per.Hour) | 0;
                msi -= this.hour * Milliseconds.Per.Hour;

                this.minute = (msi / Milliseconds.Per.Minute) | 0;
                msi -= this.minute * Milliseconds.Per.Minute;

                this.second = (msi / Milliseconds.Per.Second) | 0;
                msi -= this.second * Milliseconds.Per.Second;

                this.millisecond = msi;

                Object.freeze(this);
            }


            // Static version for relative consistency.  Constructor does allow this format.
            static from(hours: number, minutes: number, seconds: number = 0, milliseconds: number = 0): ClockTime {
                return new ClockTime(hours, minutes, seconds, milliseconds);
            }

            static millisecondsFromTime(
                hours: number,
                minutes: number,
                seconds: number = 0,
                milliseconds: number = 0): number {
                let value = hours;
                value *= Minutes.Per.Hour;
                value += minutes;
                value *= Seconds.Per.Minute;
                value += seconds;
                value *= Milliseconds.Per.Second;
                value += milliseconds;
                return value;
            }

            toString(/*format?:string, formatProvider?:IFormatProvider*/): string {
                /* INSERT CUSTOM FORMATTING CODE HERE */


                const _ = this;
                const a: string[] = [];

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
            }

        }

        export class TimeStamp implements ITimeStamp, IDateTime {

            constructor(
                public readonly year: number,
                public readonly month: Gregorian.Month,
                public readonly day: number = 1,
                public readonly hour: number = 0,
                public readonly minute: number = 0,
                public readonly second: number = 0,
                public readonly millisecond: number = 0,
                public readonly tick: number = 0) {

                // Add validation or properly carry out of range values?

                Object.freeze(this);
            }

            toJsDate(): Date {
                const _ = this;
                return new Date(_.year,
                    _.month,
                    _.day,
                    _.hour,
                    _.minute,
                    _.second,
                    _.millisecond + _.tick / Ticks.Per.Millisecond);
            }

            static from(d: Date | IDateTime): TimeStamp {
                if (!(d instanceof Date) && System.Type.hasMember(d, "toJsDate"))
                    d = (d as IDateTime).toJsDate();
                if (d instanceof Date) {
                    return new TimeStamp(
                        d.getFullYear(),
                        d.getMonth(),
                        d.getDate(),
                        d.getHours(),
                        d.getMinutes(),
                        d.getSeconds(),
                        d.getMilliseconds()
                    );
                } else {
                    throw Error("Invalid date type.");
                }
            }
        }

        let timeSpanZero: TimeSpan;

        export class TimeSpan extends TimeQuantity implements ITimeMeasurement {
            /**
             * The total number of ticks that represent this amount of time.
             */
            readonly ticks: number;

            /**
             * The total number of ticks that milliseconds this amount of time.
             */
            readonly milliseconds: number;

            /**
             * The total number of ticks that seconds this amount of time.
             */
            readonly seconds: number;

            /**
             * The total number of ticks that minutes this amount of time.
             */
            readonly minutes: number;

            /**
             * The total number of ticks that hours this amount of time.
             */
            readonly hours: number;

            /**
             * The total number of ticks that days this amount of time.
             */
            readonly days: number;

            // In .NET the default type is Ticks, but for JavaScript, we will use Milliseconds.
            constructor(value: number, units: TimeUnit = TimeUnit.Milliseconds) {
                const ms = TimeUnit.toMilliseconds(value, units);
                super(ms);

                this.ticks = ms * Ticks.Per.Millisecond;
                this.milliseconds = ms;
                this.seconds = ms / Milliseconds.Per.Second;
                this.minutes = ms / Milliseconds.Per.Minute;
                this.hours = ms / Milliseconds.Per.Hour;
                this.days = ms / Milliseconds.Per.Day;

                this._time = Lazy.create(() => new ClockTime(this.getTotalMilliseconds()));

                Object.freeze(this);
            }

            /**
             * Provides an standard interface for acquiring the total time.
             * @returns {TimeSpan}
             */
            get total(): TimeSpan {
                return this;
            }

            private _time: Lazy<ClockTime>;

            // Instead of the confusing getTotal versus unit name, expose a 'ClockTime' value which reports the individual components.
            get time(): ClockTime {
                return this._time.value;
            }

            add(other: ITimeQuantity): TimeSpan {
                if (Type.isNumber(other))
                    throw new Error(
                        "Use .addUnit(value:number,units:TimeUnit) to add a numerical value amount.  Default units are milliseconds.\n" +
                        ".add only supports quantifiable time values (ITimeTotal)."
                    );

                return new TimeSpan(this.getTotalMilliseconds() + other.total.milliseconds);
            }

            addUnit(value: number, units: TimeUnit = TimeUnit.Milliseconds): TimeSpan {
                return new TimeSpan(this.getTotalMilliseconds() + TimeUnit.toMilliseconds(value, units));
            }


            static from(value: number, units: TimeUnit) {
                return new TimeSpan(value, units);
            }

            static fromDays(value: number): TimeSpan {
                return new TimeSpan(value, TimeUnit.Days);
            }

            static fromHours(value: number): TimeSpan {
                return new TimeSpan(value, TimeUnit.Hours);
            }

            static fromMinutes(value: number): TimeSpan {
                return new TimeSpan(value, TimeUnit.Minutes);
            }

            static fromSeconds(value: number): TimeSpan {
                return new TimeSpan(value, TimeUnit.Seconds);
            }

            static fromMilliseconds(value: number): TimeSpan {
                return new TimeSpan(value, TimeUnit.Milliseconds);
            }

            static fromTicks(value: number): TimeSpan {
                return new TimeSpan(value, TimeUnit.Ticks);
            }


            static get zero(): TimeSpan {
                return timeSpanZero || (timeSpanZero = new TimeSpan(0));
            }
        }
    }

    export namespace Timers {
        export interface ITimer {
            isRunning: boolean;
            start(): void;
            stop(): void;
            reset(): void;
        }
    }

    export namespace Diagnostics {
        import TimeSpan = Time.TimeSpan;

        function getTimestampMilliseconds(): number {
            return (new Date()).getTime();
        }

        export class Stopwatch implements Timers.ITimer {
            static getTimestampMilliseconds(): number {
                return getTimestampMilliseconds();
            }

            private _elapsed: number;
            private _startTimeStamp: number;

            private _isRunning: boolean;

            get isRunning(): boolean {
                return this._isRunning;
            }

            constructor() {
                this.reset();
            }

            static startNew(): Stopwatch {
                const s = new Stopwatch();
                s.start();
                return s;
            }

            static measure(closure: () => void): Time.TimeSpan {
                const start = getTimestampMilliseconds();
                closure();
                return new TimeSpan(getTimestampMilliseconds() - start);
            }

            start(): void {
                const _ = this;
                if (!_._isRunning) {
                    _._startTimeStamp = getTimestampMilliseconds();
                    _._isRunning = true;
                }
            }

            stop(): void {
                const _ = this;
                if (_._isRunning) {
                    _._elapsed += _.currentLapMilliseconds;
                    _._isRunning = false;
                }
            }

            restart(): void {
                this.stop();
                this.start();
            }

            reset(): void {
                const _ = this;
                _._elapsed = 0;
                _._isRunning = false;
                _._startTimeStamp = NaN;
            }

            // Effectively calls a stop start and continues timing...
            // Can also be called to effectively start a lap before calling it again to get the elapsed lap time.
            lap(): TimeSpan {
                const _ = this;
                if (_._isRunning) {
                    const t = getTimestampMilliseconds();
                    const s = _._startTimeStamp;
                    const e = t - s;
                    _._startTimeStamp = t;
                    _._elapsed += e;
                    return new TimeSpan(e);
                } else
                    return TimeSpan.zero;
            }

            get currentLapMilliseconds(): number {
                return this._isRunning
                    ? (getTimestampMilliseconds() - this._startTimeStamp)
                    : 0;
            }

            get currentLap(): TimeSpan {
                return this._isRunning
                    ? new TimeSpan(this.currentLapMilliseconds)
                    : TimeSpan.zero;
            }

            get elapsedMilliseconds(): number {
                const _ = this;
                let timeElapsed = _._elapsed;

                if (_._isRunning)
                    timeElapsed += _.currentLapMilliseconds;

                return timeElapsed;
            }

            get elapsed(): TimeSpan {
                return new TimeSpan(this.elapsedMilliseconds);
            }
        }
    }

    export module TypeValue {
        export type Boolean = "boolean";
        export type Number = "number";
        export type String = "string";
        export type Symbol = "symbol";
        export type Object = "object";
        export type Undefined = "undefined";
        export type Function = "function";

        export type Primitive = String | Number | Boolean;

        export type Any = Primitive
            | Symbol
            | Undefined
            | Function;
    }

    export declare type Primitive = string | number | boolean;
    
    export module Char {
        export function isWhiteSpace(ch: number): boolean {
            return ch === 32 || (ch >= 9 && ch <= 13) || ch === 133 || ch === 160;
        }

        export function isLetter(ch: number): boolean {
            return (65 <= ch && ch <= 90) || (97 <= ch && ch <= 122) || (ch >= 128 && ch !== 133 && ch !== 160);
        }

        export function isLetterOrDigit(ch: number): boolean {
            return (48 <= ch && ch <= 57) ||
                (65 <= ch && ch <= 90) ||
                (97 <= ch && ch <= 122) ||
                (ch >= 128 && ch !== 133 && ch !== 160);
        }

        export function isDigit(ch: number): boolean;
        export function isDigit(str: string, index: number): boolean;
        export function isDigit(chOrStr: any, index?: number): boolean {
            if (arguments.length === 1) {
                return 48 <= chOrStr && chOrStr <= 57;
            } else {
                const ch = chOrStr.charCodeAt(index);
                return 48 <= ch && ch <= 57;
            }
        }
    }
}