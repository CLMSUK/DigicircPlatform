interface Date {
    addDays: (days: number) => Date;
    parseDate: (input: any, format: any) => Date;
    dateFormat: (format: any) => string;
}

interface Number {
    toString(format?: string): string;
}

interface Array<T> {
    add(item: T);
    clear();
    remove(item: T);
    contains(item: T): boolean;
    addRange(entries: any): void;
    linq: any;
    insert(pos: number, item: T);
    toArray(): Array<T>;
    addManyNew(times: number, valueGetter: () => T): Array<T>;
}

Date.prototype.addDays = function (days) {
    this.setDate(this.getDate() + days);
    return this;
};

if (!String.prototype["format"]) {
    String.prototype["format"] = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g,
            (match, number) => (typeof args[number] != "undefined"
                ? args[number]
                : match));
    };
}

if (!String.prototype["hashCode"]) {
    String.prototype["hashCode"] = function () {
        var h = 0, l = this.length, i = 0;
        if ( l > 0 )
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
        value: function (item: any) {
            if (this == null) return [item];
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
        value: function (times: number, valueGetter: () => any): Array<any> {
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
        value: function (): Array<any> {
            if (this == null) return this;
    
            this.splice(0, this.length);
            return this;
        },
        enumerable: false,
        configurable: true
    });
}

if (!Array.prototype["contains"]) {
    Object.defineProperty(Array.prototype, "contains", {    
        value: function (item: any): boolean {
            if (this == null) return false;
    
            const array = new System.Collections.List(this);
            return array.contains(item);
        },
        enumerable: false,
        configurable: true
    });
}

if (!Array.prototype["remove"]) {
    Object.defineProperty(Array.prototype, "remove", {    
        value: function (item: any): Array<any> {
            if (this == null) return;
    
            var indexToRemove = this.indexOf(item);
    
            if (indexToRemove == -1) return;
    
            this.splice(indexToRemove, 1);
    
            return this;
        },
        enumerable: false,
        configurable: true
    });
}

if (!Array.prototype["addRange"]) {
    Object.defineProperty(Array.prototype, "addRange", {    
        value: function (items: any): Array<any> {
            if (items == null || this == null) return;
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
        value: function (pos, item: any): void {
            this.splice(pos, 0, item);
        },
        enumerable: false,
        configurable: true
    });
}

if (!Array.prototype["toCollection"]) {
    Object.defineProperty(Array.prototype, "toCollection", {    
        value: function (): System.Collections.List<any> {
            return new System.Collections.List<any>(this);
        },
        enumerable: false,
        configurable: true
    });
}

if (!Math.round10) {
    Math.round10 = (value, exp) => Joove.Common.decimalAdjust("round", value, exp);
}
// Decimal floor
if (!Math.floor10) {
    Math.floor10 = (value, exp) => Joove.Common.decimalAdjust("floor", value, exp);
}
// Decimal ceil
if (!Math.ceil10) {
    Math.ceil10 = (value, exp) => Joove.Common.decimalAdjust("ceil", value, exp);
}

if (!Math.sign) {
    Math.sign = (x) => (Number(x > 0) - Number(x < 0)) || +x;
}

const NULL = Object.freeze({}) as any;

namespace CLMS.Framework {
    export var DomainModel: any;

    export namespace Timespan {
        export function Parse(value: string): System.Time.TimeSpan {
            let day;
            let milliseconds;
            let tokens = value.split(":");
            let [hours, minutes, seconds] = tokens; 
            
            if (hours.indexOf('.') !== -1) {
                [day, hours] = hours.split('.');
            }

            if (seconds.indexOf('.') !== -1) {
                [seconds, milliseconds] = seconds.split('.');
            }

            let tms = new System.Time.TimeSpan(0, System.Time.TimeUnit.Days);

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
    }

    export namespace DateTime {
        export function ToString(value: any, format?: string, locale?: { Code: string }) {
            const datetime = moment(value);
            if (locale != null) datetime.locale(locale.Code);
            if (format == null) datetime.format();
            return datetime.format(Joove.Common.changeDateTimeFormat(format)).toUpperCase();
        }

        export function ParseExact(value: string, locale?: string, formats?: string | Array<string>): any {
            if (formats != null) {
                if (typeof formats === "string") {
                    formats = Joove.Common.changeDateTimeFormat(formats);
                } else {
                    formats = formats.map((format) => {
                        if (typeof format === "string") return Joove.Common.changeDateTimeFormat(format);
                        return format;
                    });
                }

                return moment(value, formats as any, locale);
            }

            return moment(value, locale || "en-US");
        }

        export function Compare(left: Date, right: Date) {
            const x = Joove.Common.dateDiff(left, right);
            return Math.sign(x.milliseconds);
        }
    }

    export namespace Boolean {
        export function Parse(value: string): boolean {
            return value == "true";
        }
    }

    export namespace Integer {
        export function Parse(value: any): number {
            if (value == null) return null;

            var parsed = parseInt(value);

            return isNaN(parsed) ? null : parsed;             
        }
    }

    export namespace Long {
        export function Parse(value: any): number {
            if (value == null) return null;

            var parsed = parseInt(value);

            return isNaN(parsed) ? null : parsed;   
        }
    }

    export namespace Float {
        export function Parse(value: any): number {
            if (value == null) return null;

            var parsed = parseFloat(value);

            return isNaN(parsed) ? null : parsed;   
        }
    }

    export namespace Decimal {
        export function Parse(value: any): number {
            if (value == null) return null;

            var parsed = parseFloat(value);

            return isNaN(parsed) ? null : parsed;  
        }
    }

    export namespace Double {
        export function Parse(value: any): number {
            if (value == null) return null;

            var parsed = parseFloat(value);

            return isNaN(parsed) ? null : parsed;  
        }
    }

    export namespace String {
        export const Empty = "";

        export function Compare(left: string, right: string, ignoreCase: boolean = false): number {
            if (ignoreCase === true) {
                left = left == null ? "" : left.toLocaleLowerCase();
                right = right == null ? "" : right.toLocaleLowerCase();
            }
            return left.localeCompare(right);
        }

        export function Join(sep: string, values: Array<string>): string {
            return values.join(sep);
        }

        export function IsSingular(value: string): boolean {
            throw new System.Exceptions.NotImplementedException(
                "CLMS.Framework.String.IsSingular: Not Implemented yet!"
            );
        }

        export function IsPlural(value: string): boolean {
            throw new System.Exceptions.NotImplementedException(
                "CLMS.Framework.String.IsPlural: Not Implemented yet!"
            );
        }

        export function Singularize(value: string): string {
            throw new System.Exceptions.NotImplementedException(
                "CLMS.Framework.String.Singularize: Not Implemented yet!"
            );
        }

        export function Pluralize(value: string): string {
            throw new System.Exceptions.NotImplementedException(
                "CLMS.Framework.String.Pluralize: Not Implemented yet!"
            );
        }

        export function Format(format: string, ...args: Array<any>): string {
            return (format as any).format(...args);
        }

        export function Concat(values: Array<String> | String, right?: String): String {
            if (values instanceof Array) {
                return values.join("");
            } else {
                return values.toString() + right;
            }
        }

        export function SplitCamelCase(input: string, pattern: RegExp, replacement: string): String {
            return input.replace(new RegExp(pattern), replacement);
        }

        export function IsNullOrEmpty(value: string): boolean {
            return value === "undefined" || Joove.Common.stringIsNullOrEmpty(value);
        }

        export function FillWith(value: string, rep: number): string {
            return Array(rep + 1).join(value);
        }
    }

    export namespace Utilities {

        export function FocusOnFirstInputElementOfModal() {
            if (window._context.isModal === true) {
                setTimeout(() => {
                    $("[jb-type='TextBox'], [jb-type='TextArea'], [jb-type='RichTextBox'], [jb-type='PasswordTextBox'], [jb-type='DateTimeBox'], [jb-type='PasswordTextBox']").eq(0).focus();
                }, 500);
            }
        }	
	
        export function ExecuteRequest(req, args: Array<any>, cb: Function, err: Function): void {
            if (cb == NULL) cb = (response) => { };
            if (err == NULL) err = (error) => { };
            req(...args)
                .then(cb)
                .catch(err)
                .then(() => {
                    Joove.Core.applyScope(Joove.Common.getScope());
                });
        }

        export function ThrowException(name: string): any {
            throw new System.Exceptions.NotImplementedException(
                `${name}: Not Implemented yet!`
            );
        }

        export function OpenWindow(url: string, target: string = "_blank", showWarningIfBlocked: boolean = true): void {
            var newWindow =
                window.open(url, target);
            try {
                newWindow.focus();
            }
            catch (e) {
                if (showWarningIfBlocked == true) {
                    window._popUpManager.warning(window._resourcesManager.getPopupBlockedTitle(),
                        window._resourcesManager.getPopupBlockedMessage());
                }
            }
        }
		
        export function GetURIParameterValue(parameter: string): string {
            //Works for stuff like: http://localhost:56258/MemberList/GoTo?aNumber=500&astring=xaxa
            let urlParams = new URLSearchParams(location.search);
            if (urlParams && urlParams.has(parameter)) {
                return urlParams.get(parameter);
            }

            //Works for stuff like: http://localhost:56258/MemberList/GoTo/500/xaxa
            if (window._context && window._context.routeData && window._context.routeData.length && window._context.routeData.length>0) {
                for (var i = 0; i < window._context.routeData.length; i++) {
                    let record = window._context.routeData[i];
                    if (record["key"].toLowerCase() == parameter.toLowerCase()) {
                        return record["value"];
                    }
                }
            }

            return "";
        }
		
        export function SizeOf(object: any): number {
            var objects = [object];
            var size = 0;

            for (var index = 0; index < objects.length; index++) {

                switch (typeof objects[index]) {
                    case 'boolean': size += 4; break;
                    case 'number': size += 8; break;
                    case 'string': size += 2 * objects[index].length; break;
                    case 'object':
                        if (Object.prototype.toString.call(objects[index]) != '[object Array]') {
                            for (var key in objects[index]) size += 2 * key.length;
                        }

                        for (var key in objects[index]) {
                            var processed = false;
                            for (var search = 0; search < objects.length; search++) {
                                if (objects[search] === objects[index][key]) {
                                    processed = true;
                                    break;
                                }
                            }
                            if (!processed) objects.push(objects[index][key]);
                        }
                }
            }
            return size;
        }//end SizeOf()


        export class ValidationException extends System.Exceptions.NotImplementedException {
        }

        export class MambaRuntimeType {

        }

        export class Path {
            static GetServerPhysicalPath: (path: string) => string;
            static GetDataPath: (path: string) => string;
            static GetUploadsPath: (path: string) => string;
            static ResolveClientURL: (path: string) => string;
            static GetAttatchmentLink: (path: string) => string;
            static GetAttatchmentPath: (path: string) => string;
        }

        export class Email {
            static SendMail(subject: EMailMessage | string,
                body?: boolean | string,
                to?: string,
                cc = "",
                bcc = "",
                fromAddress = "",
                attachments = null,
                sendAsync = false): void {

                if (subject instanceof EMailMessage) {
                } else {

                }
            }
        }

        export class Serializer<T> {
            ToJson(instance: T): string {
                return JSON.stringify(instance);
            }

            FromJson(data: string): T {
                return Joove.Common.toJson(data) as any;
            }

            ToXml(instance: T, tab?: string): string {
                /*	This work is licensed under Creative Commons GNU LGPL License.
                    License: http://creativecommons.org/licenses/LGPL/2.1/
                   Version: 0.9
                    Author:  Stefan Goessner/2006
                    Web:     http://goessner.net/ 
                */
                let toXml = (v, name, ind) => {
                    let xmlParsed = "";
                    if (v instanceof Array) {
                        for (var i = 0, n = v.length; i < n; i++) {
                            xmlParsed += ind + toXml(v[i], name, ind + "\t") + "\n";
                        }
                    } else if (typeof (v) == "object") {
                        let hasChild = false;
                        xmlParsed += ind + "<" + name;
                        for (var m in v) {
                            if (v.hasOwnProperty(m)) {
                                if (m.charAt(0) === "@")
                                    xmlParsed += ` ${m.substr(1)}="${v[m].toString()}"`;
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
                                        xmlParsed += `<![CDATA[${v[m]}]]>`;
                                    else if (m.charAt(0) !== "@")
                                        xmlParsed += toXml(v[m], m, ind + "\t");
                                }
                            }
                            xmlParsed += (xmlParsed.charAt(xmlParsed.length - 1) === "\n"
                                ? ind : "") + "</" + name + ">";
                        }
                    } else {
                        xmlParsed += ind + "<" + name + ">" + v.toString() + "</" + name + ">";
                    }
                    return xmlParsed;
                }, xmlOutput = "";
                for (let m in instance) {
                    if (instance.hasOwnProperty(m)) {
                        xmlOutput += toXml(instance[m], m, "");
                    }
                }
                return tab ? xmlOutput.replace(/\t/g, tab) : xmlOutput.replace(/\t|\n/g, "");
            }

            FromXml(data: string): T {
                return jQuery.parseXML(data) as any;
            }

            ParseEnum(data: string): T {
                throw new System.Exceptions.NotImplementedException(
                    `${name}: Not Implemented yet!`
                );
            }
        }
        export class EMailMessage {
            constructor() {
                this.To = [];
                this.CC = [];
                this.Bcc = [];
            }

            From: string;
            Subject: string;
            Body: string;
            IsBodyHtml: boolean;
            To: string[];
            CC: string[];
            Bcc: string[];
        }

        export class DataAccessContext<T> {
            Filter: any;
            SortByColumnName: any;
            PageIndex: number;
            PageSize: number;
        }

        export class PagedResults<T> {
            Results: System.Collections.List<T>;
            TotalResults: number;
        }

        export class Common {
            static ConvertToDateTime(str: string, throwException = true): Date {
                return Joove.Common.convertToDateTime(str);
            }

            static ConvertToInt(str: string, throwException = true): number {
                return Joove.Common.convertToNumber(str);
            }

            static ConvertToDouble(str: string, throwException = true): number {
                return Joove.Common.convertToNumber(str);
            }

            static ConvertToGuid(str: string, throwException = true): System.Guid {
                return System.Guid.Parse(str);
            }

            static ConvertToDecimal(str: string, throwException = true): number {
                return Joove.Common.convertToNumber(str);
            }

            static ConvertToLong(str: string, throwException = true): number {
                return Joove.Common.convertToNumber(str);
            }

            static Base64Decode(base64EncodedData: string): string {
                return decodeURIComponent(window.escape(window.atob(base64EncodedData)));
            }

            static Base64Encode(base64EncodedData: string): string {
                return window.btoa(window.unescape(encodeURIComponent(base64EncodedData)));
            }

            static GetMD5Hash(data: string): string {
                throw new System.Exceptions.NotImplementedException(
                    "GetMD5: Not Implemented yet!"
                );
            }

            static IsTypePrimitiveOrSimple(data: any): boolean {
                throw new System.Exceptions.NotImplementedException(
                    "IsTypePrimitiveOrSimple: Not Implemented yet!"
                );
            }

            static IsTypeCollection(data: any): boolean {
                throw new System.Exceptions.NotImplementedException(
                    "IsTypeCollection: Not Implemented yet!"
                );
            }

            static IsPropertyPrimitiveOrSimple(data: any): boolean {
                throw new System.Exceptions.NotImplementedException(
                    "IsPropertyPrimitiveOrSimple: Not Implemented yet!"
                );
            }

            static IsPropertyCollection(data: any): boolean {
                throw new System.Exceptions.NotImplementedException(
                    "IsPropertyCollection: Not Implemented yet!"
                );
            }


        }
    }
    
    export namespace Data {
        export interface ISession {

        }

        export class DataManager {
            static IsPropertyDirty(obj: any, property: string): boolean {
                const session = MiniSessionManager.Instance.Session;
                throw new System.Exceptions.NotImplementedException(
                    "IsPropertyDirty: Not Implemented yet!"
                );
            }
        }

        export class MiniSessionManager {
            InstanceId: System.Guid;
            SingleUseSession: boolean;
            WillFlush: boolean;
            Session: ISession;
            LastAction: any;

            static Instance: MiniSessionManager;

            OpenSession(): any {
                throw new System.Exceptions.NotImplementedException(
                    "OpenSession: Not Implemented yet!"
                );
            };
            OpenSessionWithTransaction(): any {
                throw new System.Exceptions.NotImplementedException(
                    "OpenSessionWithTransaction: Not Implemented yet!"
                );
            }
            BeginTransaction(): any {
                throw new System.Exceptions.NotImplementedException(
                    "BeginTransaction: Not Implemented yet!"
                );
            }
            CommitChanges(exception = null): void {
                throw new System.Exceptions.NotImplementedException(
                    "CommitChanges: Not Implemented yet!"
                );
            }
            Dispose(): void {
                throw new System.Exceptions.NotImplementedException(
                    "BeginTransaction: Not Implemented yet!"
                );
            }
            ExecuteInTransaction<T>(func: System.Action<T> | System.Func<T>): void | T {
                throw new System.Exceptions.NotImplementedException(
                    "BeginTransaction: Not Implemented yet!"
                );
            }
        }
    }

    export namespace Number {
        export function Equal(left: () => number, right: () => number): boolean {
            var lvalue = Joove.Common.nullSafe<number>(left, null);
            var rvalue = Joove.Common.nullSafe<number>(right, null);

            return lvalue == rvalue;
        }

        export function NotEqual(left: () => number, right: () => number): boolean {
            var lvalue = Joove.Common.nullSafe<number>(left, null);
            var rvalue = Joove.Common.nullSafe<number>(right, null);

            return lvalue != rvalue;
        }

        export function LessThan(left: () => number, right: () => number): boolean {
            var lvalue = Joove.Common.nullSafe<number>(left, null);
            var rvalue = Joove.Common.nullSafe<number>(right, null);

            return lvalue < rvalue;
        }

        export function GreaterThan(left: () => number, right: () => number): boolean {
            var lvalue = Joove.Common.nullSafe<number>(left, null);
            var rvalue = Joove.Common.nullSafe<number>(right, null);

            return lvalue > rvalue;
        }

        export function LessThanOrEqual(left: () => number, right: () => number): boolean {
            var lvalue = Joove.Common.nullSafe<number>(left, null);
            var rvalue = Joove.Common.nullSafe<number>(right, null);

            return CLMS.Framework.Number.Equal(left, right) || lvalue <= rvalue;
        }

        export function GreaterThanOrEqual(left: () => number, right: () => number): boolean {
            var lvalue = Joove.Common.nullSafe<number>(left, null);
            var rvalue = Joove.Common.nullSafe<number>(right, null);

            return CLMS.Framework.Number.Equal(left, right) || lvalue >= rvalue;
        }
    }
}

namespace Joove {
    export enum Placement {
        TOP,
        TOP_RIGHT,
        TOP_LEFT,
        RIGHT,
        LEFT,
        BOTTOM_RIGHT,
        BOTTOM_LEFT,
        BOTTOM
    }

    export enum MambaDataType {
        COLLECTION,
        DICTIONARY,
        FUNC,
        COLLECTIONBASE,
        STRING,
        BOOL,
        INT,
        DOUBLE,
        DECIMAL,
        FLOAT,
        LONG,
        DATETIME,
        CHAR,
        GUID,
        BYTE,
        OBJECT,
        RUNTIMETYPE,
        RUNTIMEPROPERTY,
        EXCEPTION,
        TIMESPAN,
        BUSINESSEXCEPTION,
        NUMBER
    }

    var nextUniqueId = (() => {
        var currentId = 1;

        return () => (currentId++);

    })();

    export class Logger {    
        static info(...args: any[]): void {
            CLMS.Framework.Utilities.DebugHelper.Instance().Info(args);
        }

        static debug(...args: any[]): void {
            CLMS.Framework.Utilities.DebugHelper.Instance().Debug(args);
        }

        static error(...args: any[]): void {
            CLMS.Framework.Utilities.DebugHelper.Instance().Error(args);
        }
    }

    export class Comparator {
        static DeepEqual(left: any, right: any, skipProperty: Function = null): boolean {
            if (left === right) return true;

            const arrLeft = Array.isArray(left);
            const arrRight = Array.isArray(right);

            if (arrLeft != arrRight) {
                Joove.Logger.info("Array is not equal", left, right);
                return false;
            }

            if (arrLeft && arrLeft) {
                let length = left.length;
                if (length != right.length) {
                    return false;
                }
                for (let i = 0; i < length; i++) {
                    if (!Comparator.DeepEqual(left[i], right[i], skipProperty)) {
                        Joove.Logger.info("Array is not equal", left[i], right[i]);
                        return false;
                    }
                }
                return true;
            }

            const dateLeft = left instanceof Date;
            const dateRight = right instanceof Date;

            if (dateLeft != dateRight) return false;
            if (dateLeft && dateRight) return left.getTime() == right.getTime();

            const regexpLeft = left instanceof RegExp;
            const regexpRight = right instanceof RegExp;
            if (regexpLeft != regexpRight) return false;
            if (regexpLeft && regexpRight) return left.toString() == right.toString();

            if (left instanceof Object && right instanceof Object) { 
                const keys = Object.keys(left);
                const length = keys.length;

                if (length !== Object.keys(right).length) {
                    Joove.Logger.info("Object is not equal", left, right);
                    return false;
                }
                
                for (let i = 0; i < length; i++)
                {
                    if (!Object.prototype.hasOwnProperty.call(right, keys[i])) {
                        Joove.Logger.info("Property is missing", right, keys[i]);
                        return false;
                    }
                }

                for (let i = 0; i < length; i++) {
                    const key = keys[i];
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
        }

        static IsEqual(left: any, right: any, type: string): boolean {
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
        }
    }

    export class Common {
        public static safeDeepPropertySet(obj: any, key: Array<string>|string, val: any): void {
            let keys = typeof key === "string" ? key.split('.') : key;
            let i = 0, l = keys.length, t = obj, x;
            for (; i < l; ++i) {
                x = t[keys[i]];
                t = t[keys[i]] = (i === l - 1 ? val : (x == null ? {} : x));
            }
        }

        public static safeDeepPropertyAccess(obj: any, key: string, def?: any): any {
            let p = 0;
            let keys = key.split ? key.split('.') : key;
            while (obj && p < keys.length) obj = obj[keys[p++]];
            return obj === undefined ? def : obj;
        }

        static project(model: any, schema: any, indexes: Array<number> = null, iteration: number = null, ifEmptyFetchAll = false) {
            if (model == null || schema == null) {
                return null;
            }

            if (Common.valueIsPrimitive(model)) {
                return model;
            }

            const projectedModel = {
            };

            let projectSubset = false;
            if (indexes != null) {
                if (iteration == null) iteration = 0;
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
                    const newArr = [];
                    for (let c = 0; c < model[prop].length; c++) {
                        if (projectSubset == false || c == indexes[iteration]) {
                            newArr.push(Common.project(model[prop][c], schema[prop], indexes, iteration + 1, ifEmptyFetchAll));
                        }
                    }
                    projectedModel[prop] = newArr;
                } else if (Common.valueIsObject(model[prop])) {
                    projectedModel[prop] = Common.project(model[prop], schema[prop], indexes, iteration, ifEmptyFetchAll); 
                } else {
                    projectedModel[prop] = model[prop];
                }
            }

            return projectedModel;
        }

        static isEmptyObject(obj: any) {
            for (var prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                    return false;
                }
            }
            return true;
        }

        static dateDiff(date1: Date, date2: Date): System.Time.TimeSpan {
            var momentDate1 = moment(date1);
            var momentDate2 = moment(date2);
            return new System.Time.TimeSpan(momentDate1.diff(momentDate2));
        }

        static stringContains(str: string, otherStr: string, caseInsensitive = true): boolean {
            return caseInsensitive
                ? str.toLowerCase().indexOf(otherStr.toLowerCase()) !== -1
                : str.indexOf(otherStr) !== -1;
        }

        static stringIsNullOrEmpty(str: string): boolean {
            return str == null || str === "";
        }

        static stringEndsWith(str: string, suffix: string): boolean {
            return str.indexOf(suffix, this.length - suffix.length) !== -1;
        }

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
        static decimalAdjust(type: any, value: number, exp?: number): number {
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
            value = value.toString().split('e') as any;
            value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
            // Shift back
            value = value.toString().split('e') as any;
            return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
        }

        static round(value: number, decimals: number): number {
            return Common.decimalAdjust("round", value, decimals);
        }

        static ceil(value: number, decimals: number): number {
            return Common.decimalAdjust("ceil", value, decimals);
        }

        static floor(value: number, decimals: number): number {
            return Common.decimalAdjust("floor", value, decimals);
        }

        static sign(x: any): number {
            return (Number(x > 0) - Number(x < 0)) || +x;
        }

        static createDate(year: number, month: number, day: number, hours?: number, minutes?: number, seconds?: number):
            Date {
            const date = new Date();

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
        }

        static createEvent(eventName: string): any {
            if (typeof (Event) === 'function') { //For normal browsers
                return new Event(eventName);
            } else {
                //For retarded IE
                var event = document.createEvent('Event');
                event.initEvent(eventName, true, true);
                return event;
            }
        }
        static isVisibleOnViewPort(element: JQuery): Placement {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            const elementRectangle = element.get(0).getBoundingClientRect();

            if (elementRectangle.left < windowHeight - elementRectangle.width) {

            } else {

            }

            return null;
        }

        static toggleDebugMode(enable: boolean) {
            localStorage.setItem("__debug", enable + "");
        }
        static isInDebugMode() {
            return localStorage.getItem("__debug") == "true";
        }

        static getMatch(verbalExpression: RegExp, input: string, defaultValue: string = null): string {
            try {
                let result = verbalExpression.exec(input);
                if (result && result.length > 0) {
                    return result[0];
                }
                if (defaultValue) {
                    return defaultValue;
                }

                return null;

            } catch (e) {
                if (defaultValue) {
                    return defaultValue;
                }
                console.error(e);
            }
        }//end getMatch()

        static getMatches(verbalExpression: RegExp, input: string, defaultValues: Array<string> = null): Array<string> {
            try {
                let matches = input.match(verbalExpression);
                if (matches && matches.length > 0) {
                    return matches;
                }
                if (defaultValues) {
                    return defaultValues;
                }

                return null;

            } catch (e) {
                if (defaultValues) {
                    return defaultValues;
                }
                console.error(e);
            }
        }//end getMatches()		

        static isValidEmail(str: string): boolean {
            if (str == null) return false;
            const re =
                /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            return re.test(str);
        }

        static isValidUrl(str): boolean {
            if (str == null) return false;
            const pattern = new RegExp(
                "^" +
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
                "$", "i"
            );

            if (!pattern.test(str)) {
                return false;
            } else {
                return true;
            }
        }

        static modelToJson(input: string): JSON {
            //var model = JSON.parse(input.replace(/&quot;/g, '"').replace(/\0/g, "").replace(/\r\n/g, "\\n").replace(/\n/g, "\\n").replace(/\\/g, "\\\\"));
            const model = JSON.parse(input);
            //return Cycles.reconstructObject(model);

            return model;
        }

        static cloneObject(originalObject: any): any {
            if (originalObject == null) return null;

            if (Common.valueIsObject(originalObject) === false) return originalObject;

            // Based on:
            // https://github.com/cronvel/tree-kit/blob/master/lib/clone.js
            // (MIT licence)

            // First create an empty object with
            // same prototype of our original source
            let propertyIndex: number,
                descriptor: PropertyDescriptor,
                keys: string[],
                current: { source; target },
                nextSource: Object | typeof undefined[],
                indexOf: number;
            const copies = [{ source: originalObject, target: Object.create(Object.getPrototypeOf(originalObject)) }];
            const cloneObject = copies[0].target;
            const sourceReferences = [originalObject];
            const targetReferences = [cloneObject];

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
        }

        static valueIsObject(value: any): boolean {
            return typeof value === "object" &&
                value !== null &&
                ((value instanceof Boolean) === false) &&
                ((value instanceof Date) === false) &&
                ((value instanceof Number) === false) &&
                ((value instanceof RegExp) === false) &&
                ((value instanceof String) === false);
        }

        static valueIsPrimitive(value: any): boolean {
            return !Common.valueIsObject(value) && !Common.isArray(value);
        }

        static setKeyAsClientKey(obj: any) {
            if (obj == null || obj._clientKey != null || obj._key == null) return;

            obj._clientKey = obj._key;
        }

        static objectsAreEqual(objA: any, objB: any, typeCheck?: boolean): boolean {
            Common.setKeyAsClientKey(objA);
            Common.setKeyAsClientKey(objB);

            // Type Check
            if (typeCheck === true && objA != null && objB != null && objA._typeHash != objB._typeHash) return false;

            // Simple value equality
            if (objA === objB) return true;

            //handle case where one is null and other is undefined
            if ((objA == null || objA == undefined) && (objB == null || objB == undefined)) return true;

            // Client Key equality
            if ((objA != null && objB != null) &&
                (objA._clientKey || objB._clientKey) &&
                objB._clientKey === objA._clientKey) return true;

            // One of objects null, other not null
            if (objA == null || objB == null) return false;

            // Key equality
            if (typeof (objB._key) != "undefined" &&
                Common.keyHasDefaultValue(objA._key) === false &&
                objB._key === objA._key) return true;

            // Angular $$haskey equality
            if (typeof (objB.$$hashKey) != "undefined" && objB.$$hashKey === objA.$$hashKey) return true;

            return false;
        }

        static objectsAreEqualGenericDeepComparison = function(a, b) {
            // If a and b reference the same value, return true
            if (a === b) return true;

            // If a and b aren't the same type, return false
            if (typeof a != typeof b) return false;

            // Already know types are the same, so if type is number
            // and both NaN, return true
            if (typeof a == 'number' && isNaN(a) && isNaN(b)) return true;

            // Get internal [[Class]]
            var aClass = Object.prototype.toString.call(a);
            var bClass = Object.prototype.toString.call(b);

            // Return false if not same class
            if (aClass != bClass) return false;

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
                if (aClass == '[object Function]' && a.toString() != b.toString()) return false;

                var aKeys = Object.keys(a);
                var bKeys = Object.keys(b);

                // If they don't have the same number of keys, return false
                if (aKeys.length != bKeys.length) return false;

                // Check they have the same keys
                if (!aKeys.every(function (key) { return b.hasOwnProperty(key) })) return false;

                // Check key values - uses ES5 Object.keys
                return aKeys.every(function (key) {
                    return Common.objectsAreEqualGenericDeepComparison(a[key], b[key]);
                });
            }
            return false;
        }

        // TODO: Check that key has value not only by "0" but also for each Datatype...
        static keyHasDefaultValue = function (key): boolean {
            if (key == null) return true;

            var keyAsString = key.toString().trim();

            return keyAsString == "0" || keyAsString == "" || keyAsString == "00000000-0000-0000-0000-000000000000";
        }

        static changeDateTimeFormat = function (formatString: string): string {
            let val = formatString.replace(new RegExp('tt', 'g'), 'a');

            val = val.replace(new RegExp('d', 'g'), 'D');
            val = val.replace(new RegExp('y', 'g'), 'Y');
            val = val.replace(new RegExp('f', 'g'), 'S');

            return val;
        }

        static classInstancesAreSame = function (objectA, objectB) {
            if ((objectA["_originalTypeClassName"] != null && objectB["_originalTypeClassName"] != null) &&
                (objectA["_originalTypeClassName"] !== objectB["_originalTypeClassName"])) {
                return false;
            }

            if (objectA["_clientKey"] != null && objectA["_clientKey"] === objectB["_clientKey"]) return true;

            if ((objectA["_key"] != null && objectA["_key"] !== 0 && objectA["_key"] !== "" && objectA["_key"] === objectB["_key"])) return true;

            return false;
        };

        static getClassInstanceKey(instance: any) {
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
        }

        static classInstancesAreNotSame = function (objectA, objectB) {
            return Common.classInstancesAreSame(objectA, objectB) === false;
        };

        static collectionsAreEqual(collectionA: Array<any>, collectionB: Array<any>): boolean {
            // Both null
            if (collectionA == null && collectionB == null) return true;

            // One  null, other not null
            if ((collectionA == null && collectionB != null) || (collectionA != null && collectionB == null)
            ) return false;

            // Different Length, impossible to be equal
            if (collectionA.length != collectionB.length) return false;

            for (let i = 0; i < collectionA.length; i++) {
                if (Common.objectsAreEqual(collectionA[i], collectionB[i]) === false) return false;
            }

            return true;
        }

        static updateInstanceReferencesAccrossModel(obj: any) {
            var reconstructor = new ReferencesReconstructor();
            reconstructor.addFreshInstance(obj);
            reconstructor.reconstructReferences(window.$form.model);
        }

        static updateManyInstanceReferencesAccrossModel(obj: Array<any>) {
            var reconstructor = new ReferencesReconstructor();
            reconstructor.addFreshArrayOfInstances(obj);
            reconstructor.reconstructReferences(window.$form.model);
        }
        static replaceAll(value: string, search: string, replacement: string): string {
            return value == null
                ? null
                : value.split(search).join(replacement);
        }

        static getDirectiveScope($element: JQuery): any {
            const id = $element.data("jb-directive-id");
            return window[`directive_${id}`];
        }

        static setDirectiveScope($element: JQuery, directiveScope): any {
            const id = nextUniqueId();

            window[`directive_${id}`] = directiveScope;
            $element.data("jb-directive-id", id);
        }

        static directiveScopeIsReady($element: JQuery): boolean {
            return $element.data("jb-ready") === true;
        }

        static markDirectiveScopeAsReady($element: JQuery): JQuery {
            return $element.data("jb-ready", true);
        }

        static markDirectiveScopeAsNotReady($element: JQuery): JQuery {
            return $element.data("jb-ready", false);
        }

        static parentGridsAreReady($element: JQuery): boolean {
            const $grids = $element.parents("[jb-type='Grid']");

            for (let i = 0; i < $grids.length; i++) {
                const $grid = $grids.eq(0);
                if (Common.directiveScopeIsReady($grid) === false) return false;
            }

            return true;
        }

        static getContextFromElement($element: JQuery): Array<any> {
            const context = [];
            const parentsString = $element.attr("data-context-items");

            if (parentsString == null || parentsString.trim() == "") return context;

            const parentNames = parentsString.split(",");

            const $scope = angular.element($element.get(0)).scope();

            for (let i = 0; i < parentNames.length; i++) {
                context.push($scope[parentNames[i]]);
            }

            return context;
        }

		static getRepeatersOfElement($element: JQuery): any {
			const selector = "[ng-repeat], [ng-repeat-start], [ng-repeat-end]";
			
			//Best case scenario: simple list (one row per record). The data is just between the repeaters
			let $repeaters = $element.parents(selector);
            if ($repeaters.length !== 0) {
                return $repeaters;
            }
			
			//Worst case scenario: multiple rows per record. The data might be hidden between the repeaters (imagine a table that has 5 rows per a "for-each" statement, designed by the user
			//The "$element.parents()" won't work as easily here. We'll need to fly to the start of the dataset and get the repeaters from the subsequent siblings
			$repeaters = $element.parents('[jb-original-collection]').siblings(selector);
			
			return $repeaters;
		}
		
        static getFullBindingPathOfControl($element: JQuery, relativePathStr: string): string {
            const relativePath = relativePathStr.split(".");
            if (relativePath[0] === "model") {
                return relativePathStr;
            }

            // itemName: { positionInCollection: number, collectionName: string }
            var parents = {};
            const $parentContainers = Common.getRepeatersOfElement($element);

            //create structure for parent repeating elements
            $parentContainers.each((index, item) => {
                var ngRepeatValue = $(item).attr("ng-repeat") || $(item).attr("ng-repeat-start") || $(item).attr("ng-repeat-end");
                var parts = ngRepeatValue.split(" in ");
                if (parts.length !== 2) {
                    alert("getFullBindingPathOfControl: unexpeted syntax of ng-repeat");
                    return false;
                }

                let repeatedItemName = parts[0].trim();
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
            for (let i in parents) {
                if (parents.hasOwnProperty(i)) {
                    const pathInfo = parents[i];
                    pathInfo.collectionName = Common.fixBindingPath(parents, pathInfo.collectionName);
                }
            }

            return Common.fixBindingPath(parents, relativePathStr);
        }

        static fixBindingPath(parents: Object, pathStr: string): string {
            const path = pathStr.split(".");
            const start = path[0];
            if (start === "model") {
                return pathStr;
            }
            path.splice(0, 1);
            const parent = parents[start];
            if (parent == null) {
                alert("getFullBindingPathOfControl: I didn't find parent element");
                return null;
            }

            const part0 = `${parent.collectionName}[${parent.positionInCollection}]`;

            return part0 + "." + path.join(".");
        }

        static getAction(actionName: string, masterPage = false): Function {
            let defaultAction = () => { return null; };
            if (actionName == null || actionName.trim() == "") {
                return defaultAction;
            }

            let scope: IJooveScope = null;

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
        }

        // Todo
        static executeAction(actionName: string, ...args): void {
            const action = Common.getAction(actionName, true);
            if (action == null) {
                console.error(`Action '${actionName}' not found`);
                return;
            }
            //Array.prototype.splice.call(args, 0, 1);
            action.apply(null, args);
        }

        static executeEventCallback(name: string, ...args): void {
            let action = Common.getScope().eventCallbacks[name];
            if (action == null) {
                action = Common.getMasterScope().eventCallbacks[name];
            }
            if (action == null) {
                console.error(`Event callback '${name}' not found`);
                return;
            }

            Array.prototype.splice.call(args, 0, 1);
            action.apply(null, args);
        }

        static getScope(): IJooveScope {
            return window[`scope_${window._context.currentController}`];
        }

        static getModel(): any {
            return Common.getScope().model;
        }

        static getMasterScope(): IJooveScope {
            return window[`scope_${window._context.currentMasterPageController}`];
        }

        static getMasterModel(): any {
            return Common.getMasterScope().model;
        }

        static serializeIndexes(indexes: Array<string>): string {
            let indexKey = "";

            for (let j = 0; j < indexes.length; j++) {
                indexKey += indexes[j] + "_";
            }

            if (indexKey === "") {
                indexKey = "_";
            }

            return indexKey;
        }

        static getContextItemElement($el): JQuery {
            return $el.closest("[data-context-index]");
        }

        static getIndexesOfControl($control: JQuery): any {
            const $context = $control.parents("[data-context-index]").toArray();
            if ($control.attr("data-context-index") != null) {
                $context.unshift($control as any);
            }

            let indexes = [];
            let indexKey = "";
            for (let j = 0; j < $context.length; j++) {
                const index = parseInt($($context[j]).attr("data-context-index"));

                if (isNaN(index)) {
                    indexes = null;
                    indexKey = null;
                    break;
                }

                indexes.push(index);
                indexKey += index + "_";
            }

            return { indexes: indexes, key: indexKey };
        }

        static getContextOfControl($control: JQuery): any {
            const $context = $control.parents("[data-context-index]").toArray();
            if ($control.attr("data-context-index") != null) {
                $context.unshift($control as any);
            }

            let context = {};
            for (let j = 0; j < $context.length; j++) {
                const itemName = $($context[j]).attr("data-context-item");
                const scope = angular.element($context[j]).scope()[itemName];
                context[itemName] = scope;
            }
            return context;
        }

        static getIndexKeyOfControl($control: JQuery): string {
            var indexes = Joove.Common.getIndexesOfControl($control);
            return indexes == null ? null : indexes.key;
        }

        static toHTML(value: string): string {
            if (value == null) return value;
            try {
                var parser = new DOMParser;
                var dom = parser.parseFromString(value, "text/html");

                if (dom.body.textContent === "null") return value;

                return dom.body.textContent;

            } catch (e) {
                console.error("Failed to parse value as HTML");
                return value;
            }
        }

        static formatNumber(value: number, format: string): string {
            return numeral(value).format(format);
        }

        static formatDate(value: Date, format: string): string {
            //format = format.toUpperCase();

            const momentDate = moment(value);

            return momentDate.isValid()
                ? momentDate.format(format)
                : "";
        }
        
        static getUtcDateFromRawString(rawValue: string, fullFormat: string, setToMidday?: boolean): Date {
            if (rawValue == null || rawValue.trim() === "" || rawValue === "Invalid date") {
                return null;
            } else {
                const localTime = moment(rawValue, fullFormat);

                if (setToMidday === true) {
                    localTime.set("hours", 12);
                    localTime.set("minutes", 0);
                }

                const utcTime = moment.utc(localTime);

                return utcTime.toDate();
            }
        }

        static getDateStringFromUtc(value: Date, fullFormat: string): string {
            if (value == null) {
                return "";
            } else {
                const utcTime = moment.utc(value).toDate();
                const localTime = moment(utcTime);

                return localTime.format(fullFormat);
            }
        }

        static trackObject(obj: any): number {
            if (Common.valueIsObject(obj) === false || obj == null) return obj;

            if (obj._clientKey == null) {
                obj._clientKey = (nextUniqueId() * -1);
            }

            return obj._clientKey;
        }

        // todo: extend this method with more cases
        static eventPreventsDefaultFormAction(e: JQueryEventObject): boolean {
            const $target = $(e.target);

            if (window._popUpManager.popUpVisible || (window._popUpManager.isLoading)) return;

            if ($target.context != null) {
                const tagName = $target.context.tagName.toLowerCase();
                if (
                    (tagName == "trix-editor") ||
                    (tagName == "textarea") || 
                    (tagName == "button" && e.which === 13)
                ) 
				{
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
        }

        static setControlKeyPressed(e: JQueryEventObject, duration: number) {
            window["ctrlPressed"] = e != null && e.ctrlKey;

            setTimeout(() => {
                window["ctrlPressed"] = false;
            }, 1000);
        }

        static controlKeyWasPressed(): boolean {
            return window["ctrlPressed"] === true;
        }

        static setLastClickedElement(e: JQueryEventObject) {
            window["lastClickedElement"] = e == null || e.target == null ? null : e.target;
        }

        static getLastClickedElement(): Element {
            return window["lastClickedElement"];
        }

        static detectBrowser(): string {
            const isOpera = !!window.opera || navigator.userAgent.indexOf(" OPR/") >= 0;
            // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
            const isFirefox = typeof window.InstallTrigger !== "undefined"; // Firefox 1.0+
            const isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor") > 0;
            // At least Safari 3+: "[object HTMLElementConstructor]"
            const isChrome = !!window.chrome && !isOpera; // Chrome 1+
            const isInternetExplorer = /*@cc_on!@*/false || !!document.documentMode; // At least IE6

            if (isOpera) return "Opera";
            else if (isFirefox) return "Firefox";
            else if (isSafari) return "Safari";
            else if (isChrome) return "Chrome";
            else if (isInternetExplorer) return "IE";
            else return "";
        }

        static getScrollbarSize(): number {
            const inner = document.createElement("p");
            inner.style.width = "100%";
            inner.style.height = "200px";

            const outer = document.createElement("div");
            outer.style.position = "absolute";
            outer.style.top = "0px";
            outer.style.left = "0px";
            outer.style.visibility = "hidden";
            outer.style.width = "200px";
            outer.style.height = "150px";
            outer.style.overflow = "hidden";
            outer.appendChild(inner);

            document.body.appendChild(outer);
            const w1 = inner.offsetWidth;
            outer.style.overflow = "scroll";
            let w2 = inner.offsetWidth;
            if (w1 === w2) w2 = outer.clientWidth;

            document.body.removeChild(outer);

            return (w1 - w2);
        };

        static toJson(data: string): JSON {
            return JSON.parse(data.replace(/'/g, "\"").replace(/[\t\n\r]/g, ""));
        }

        static forceNumberFormat(number: string): string {
            if (!number) return;
            return number.replace(",", ".").trim();
        }

        static parseFloat(number: string): number {
            let unsafeValue = parseFloat(Common.forceNumberFormat(number));
            if (isNaN(unsafeValue))
                unsafeValue = 0;

            return unsafeValue;
        }

        static convertToNumber(value: string): number {
            if (value.toLowerCase() === "nan")
                return NaN;
            const num = Number(value);
            return isNaN(num) ? null : num;
        }

        static convertToBoolean(value: string): boolean {
            value.toLowerCase();
            return (value === "true" || value === "false") ? value === "true" : null;
        }

        static convertToDateTime(value: string): Date {
            const convertDate = new Date(Date.parse(value));

            if (isNaN(convertDate.getTime())) return null;

            return convertDate;
        }

        static guessStringMambaDataType(value: string): MambaDataType {
            if (Common.convertToBoolean(value) !== null)
                return MambaDataType.BOOL;

            if (Common.convertToNumber(value) !== null)
                return MambaDataType.NUMBER;

            if (Common.convertToDateTime(value) !== null)
                return MambaDataType.DATETIME;

            return MambaDataType.STRING;
        }

        static getMambaDataType(type: string): MambaDataType {
            const localType = type.toUpperCase();

            if (localType === "INT" ||
                localType === "DOUBLE" ||
                localType === "DECIMAL" ||
                localType === "FLOAT" ||
                localType === "LONG" ||
                localType === "BYTE")
                return MambaDataType.NUMBER;

            return MambaDataType[localType];
        }

        /**
         * 
         * @param value 
         * @param seperators [ groupSep, decimalSep ] 
         */
        static parseToDecimal(value: any, seperators: Array<string>): { integerPart: string, fractionPart: string } {
            if (value == null) return null;
            value = value.toString();

            let thousands = seperators[0];
            let decimal = seperators[1];

            let groupMinSize = true ? 3 : 1;
            const pattern = new RegExp("^\\s*([+\-]?(?:(?:\\d{1,3}(?:\\" + thousands + "\\d{" + groupMinSize + ",3})+)|\\d*))(?:\\" + decimal + "(\\d*))?\\s*$");

            const result = value.match(pattern);
            if (!((result != null) && result.length === 3)) {
                return null;
            }
            const integerPart = result[1];
            // const integerPart = result[1].replace(new RegExp("\\" + thousands, 'g'), '');
            const fractionPart = result[2];

            return { integerPart, fractionPart };
        }

        /**
         * 
         * @param value 
         * @param seperators [ groupSep, decimalSep ] 
         */
        static localizeNumber(value: any, seperators: Array<string> = null): string {
            if (value == null) return null;

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

            if (decimal == null) throw { msg: "Number has an invalid format" };

            var integerPart = Common.replaceAll(decimal.integerPart, seperators[0], window._context.groupSeparator);
            if (decimal.fractionPart != null) {
                return `${integerPart}${window._context.decimalSeparator}${decimal.fractionPart}`;
            }
            return `${integerPart}`;
        }

        /**
         * 
         * @param value 
         * @param seperators [ groupSep, decimalSep ] 
         */
        static delocalizeNumber(value: any, seperators: Array<string> = null, ): string {
            if (value == null) return null;

            value = value.toString();
            seperators = seperators || [window._context.groupSeparator, window._context.decimalSeparator];

            var decimal = Common.parseToDecimal(value, seperators);

            if (decimal == null) throw { msg: "Number has an invalid format" };

            var integerPart = Common.replaceAll(decimal.integerPart, seperators[0], "");
            if (decimal.fractionPart != null) {
                return `${integerPart}.${decimal.fractionPart}`;
            }
            return `${integerPart}`;
        }

        static getCurrenctNumberSeperator(): Array<string> {
            return [window._context.groupSeparator, window._context.decimalSeparator];
        }

        /**
         * 
         * @param value 
         * @param seperators [ groupSep, decimalSep ] 
         */
        static parseToNumber(value: any, seperators: Array<string> = null, enforceGroupSize: boolean = true): number {
            if (value == null) return null;
            if (typeof value === "number") return value;

            value = value.toString();
            seperators = seperators || [window._context.groupSeparator || ".", window._context.decimalSeparator || ","];

            var decimal = Common.parseToDecimal(value, seperators);

            if (decimal == null) return 0 / 0;

            const integerPart = decimal.integerPart.replace(new RegExp("\\" + seperators[0], 'g'), '');
            const parsedNumber = parseFloat(integerPart + "." + decimal.fractionPart);
            return parsedNumber;
        }

        static autoParse(value: string): any {
            const newValue = parseFloat(value);

            if (!isNaN(newValue)) return newValue;

            if (value === "true") return true;
            if (value === "false") return false;

            return value;
        }

        static setNumberLocalizationSettings() {
            if (window["numeral"] == null || numeral["locales"] == null || numeral["locales"]["_custom"] != null) return;

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
        }

        static isArray(instance: any): boolean {
            return instance != null && instance.constructor === Array && instance.length != null;
        }

        static safeNumber(num :any): number {
            if (num === undefined) {
                return 0;
            }

            return num;
        }

        static nullSafe<T>(expr: () => T, deffaultValue: T): T {
            try {
                return expr();
            } catch (e) {
                if (window._context.mode !== "Production") {
                    console.warn(`Expression '${expr}' throws null point exception`);
                }
                return deffaultValue;
            }
        }

        static autocompleteFix(): void {
            if ($("input[type='password'][ng-model]").length === 0) {
                return;
            }

            const inputs = [];
            inputs.push(...($("input[type='password'][ng-model]") as any));
            inputs.push(...($("input[jb-type='TextBox'][ng-model]") as any));

            const check = (input: Element) => {
                const $input = $(input);
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
            }

            for (let i = 0; i < inputs.length; i++) {
                check(inputs[i]);
            }
        }

        static createRandomId(length?: number): string {
            length = length || 5;
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < length; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        }

        static digestScope(scope?: ng.IScope) {
            if (scope == null) scope = Common.getScope();

            if (!scope.$$phase && (scope.$root != null && !scope.$root.$$phase)) {
                scope.$digest();
            }
        }

        static requireScript(id, src, callback?): Promise<boolean> {
            return window._scriptLoader.requireScript(id, src, callback);
        }

        static usePDFMaker(options: { filename: string, dd: any, tableLayouts?: any }): void {
            if (window._scriptLoader.isScriptLoaded("pdfmake")) {
                pdfMake.createPdf(options.dd).download(options.filename);
            } else {
                Common.loadPdfMakeDependencies(options)
                    .then(() => {
                        if (options.tableLayouts) {
                            pdfMake.tableLayouts = options.tableLayouts;
                        }
                        Common.usePDFMaker(options);
                    });
            }
        }

        static loadPdfMakeDependencies(options: { filename: string }): Promise<boolean> {
            const src = window._context.siteRoot + "/Scripts/Third-Party/pdfmaker";
            return Common.requireScript("pdfmake", `${src}/pdfmake.min.js`)
                .then(() => {
                    return Common.requireScript("vfs_fonts", `${src}/vfs_fonts.js`);
                }).then(() => {
                    return true;
                });
        }

        static loadJsPdfDependencies(options: { filename: string, $element?: JQuery, usePrintMedia?: boolean }): void {
            const src = window._context.siteRoot + "/Scripts/Third-Party/jspdf";
            Common.requireScript("jsPDF",
                `${src}/jspdf.min.js`,
                () => {
                    Common.requireScript("html2pdf",
                        `${src}/html2pdf.js`,
                        () => {
                            Common.exportToPdf(options);
                        });
                });
        }

        static exportToPdfUsePrintMedia(target: JQuery, options: { filename: string, $element?: JQuery, usePrintMedia?: boolean }): void {
            const doc = new jsPDF("p", "pt", "letter");
            $(".jb-modal-overlay").show();
            html2pdf(target, doc, (pdf) => {
                pdf.save(options.filename);
                $(".jb-modal-overlay").hide();
            });
        }

        static exportToPdf(options: { filename: string, $element?: JQuery, usePrintMedia?: boolean }): void {

            $(".jb-modal-overlay").show();

            if (window["jsPDF"] == null) {
                Common.loadJsPdfDependencies(options);
            } else {
                const target = options.$element || $("body");

                if (options.usePrintMedia) {
                    Common.exportToPdfUsePrintMedia(target, options);
                    return;
                }

                const width = target.width();
                const height = target.height();
                let bgColor = "rgba(0, 0, 0, 0)";

                if (options.$element != null) {
                    bgColor = options.$element.css("background-color");
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
                } else {
                    doc.addHTML($("body").get(0), 0, 0, {}, (w, cy, x, args) => {

                    });
                }

                // add again
                $(".jb-modal-overlay").show();
                setTimeout(() => {
                    doc.save(options.filename);
                    $(".jb-modal-overlay").hide();
                    if (options.$element != null) {
                        options.$element.css("background-color", bgColor);
                    }
                },
                    5000);
            }
        }

        static cast(instance, type) {
            if (instance == null || Common.stringIsNullOrEmpty(instance._originalTypeClassName)) {
                return instance;
            }

            //TODO: check inheritance list
            return instance._originalTypeClassName == type ? instance : null;
        }        
    }

    export interface IElementViewPortObserverOptions {
        $element: JQuery;
        interval: number;
        stopWhenEnters?: boolean;
        stopWhenExits?: boolean;
        onEnter?: Function;
        onExit?: Function;
        distanceThreshold?: number;
        visibilityCheck?: boolean;
    }

    export class ElementViewPortObserver {
        private $el: JQuery;
        private el: HTMLElement;
        private interval: number;
        private onEnterView: Function;
        private onExitView: Function;
        private intervalObject: any;
        private stopOnEnter: boolean;
        private stopOnExit: boolean;
        private visibilityCheck: boolean;
        private distanceThreshold: number;

        constructor(opts: IElementViewPortObserverOptions) {
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

        public start() {
            this.onLoop();

            this.intervalObject = setInterval(() => {
                this.onLoop();
            }, this.interval);
        }

        public stop() {
            clearInterval(this.intervalObject);
        }

        private onLoop() {
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
        }

        private isInViewPort(): boolean {
            var bounding = this.el.getBoundingClientRect();
            var distanceVertical = bounding.top - (window.innerHeight || document.documentElement.clientHeight);
            var distanceHorizontal = bounding.left - (window.innerWidth || document.documentElement.clientWidth);
            
            return bounding.top >= 0 && bounding.left >= 0 && distanceVertical <= this.distanceThreshold && distanceHorizontal <= this.distanceThreshold;
        }
    }

    export class LazyImageLoader {
        private observer: ElementViewPortObserver;
        private $img: JQuery;
        private checkVisibility: boolean;

        constructor($img: JQuery, checkVisibility: boolean) {
            this.$img = $img;
            this.observer = new ElementViewPortObserver({
                $element: this.$img,
                interval: 1000,
                stopWhenEnters: true,
                visibilityCheck: checkVisibility === true,
                onEnter: () => {
                    this.setImage();
                }
            });
            this.observer.start();
        }

        private setImage() {
            var src = this.$img.data("src");      
            this.$img.attr("src", src);
        }

    }
}