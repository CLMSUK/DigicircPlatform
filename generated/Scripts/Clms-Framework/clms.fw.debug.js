var CLMS;
(function (CLMS) {
    var Framework;
    (function (Framework) {
        var Utilities;
        (function (Utilities) {
            var DebugMessageType;
            (function (DebugMessageType) {
                DebugMessageType[DebugMessageType["Debug"] = 0] = "Debug";
                DebugMessageType[DebugMessageType["Info"] = 1] = "Info";
                DebugMessageType[DebugMessageType["Warning"] = 2] = "Warning";
                DebugMessageType[DebugMessageType["Error"] = 3] = "Error";
                DebugMessageType[DebugMessageType["IDEF0Trace"] = 4] = "IDEF0Trace";
            })(DebugMessageType = Utilities.DebugMessageType || (Utilities.DebugMessageType = {}));
            var LoggerLevel;
            (function (LoggerLevel) {
                LoggerLevel[LoggerLevel["ALL"] = 0] = "ALL";
                LoggerLevel[LoggerLevel["DEBUG"] = 1] = "DEBUG";
                LoggerLevel[LoggerLevel["INFO"] = 2] = "INFO";
                LoggerLevel[LoggerLevel["WARN"] = 3] = "WARN";
                LoggerLevel[LoggerLevel["ERROR"] = 4] = "ERROR";
                LoggerLevel[LoggerLevel["FATAL"] = 5] = "FATAL";
                LoggerLevel[LoggerLevel["OFF"] = 6] = "OFF";
            })(LoggerLevel = Utilities.LoggerLevel || (Utilities.LoggerLevel = {}));
            var Logger = /** @class */ (function () {
                function Logger(_Name, _Level) {
                    this._Name = _Name;
                    this._Level = _Level;
                    if (window._context.mode === "Development") {
                        this._Level = LoggerLevel.ALL;
                    }
                    else {
                        this._Level = LoggerLevel.OFF;
                    }
                    this._Name = _Name;
                }
                Object.defineProperty(Logger.prototype, "IsDebugEnabled", {
                    get: function () {
                        return this._Level == LoggerLevel.DEBUG;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Logger.prototype, "IsInfoEnabled", {
                    get: function () {
                        return this._Level == LoggerLevel.INFO;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Logger.prototype, "IsWarnEnabled", {
                    get: function () {
                        return this._Level == LoggerLevel.WARN;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Logger.prototype, "IsErrorEnabled", {
                    get: function () {
                        return this._Level == LoggerLevel.ERROR;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Logger.prototype, "IsFatalEnabled", {
                    get: function () {
                        return this._Level == LoggerLevel.FATAL;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Logger.prototype, "Name", {
                    get: function () {
                        return "[" + moment() + "] " + this._Name;
                    },
                    enumerable: false,
                    configurable: true
                });
                Logger.prototype.Debug = function (message, exception) {
                    switch (this._Level) {
                        case LoggerLevel.FATAL:
                        case LoggerLevel.ERROR:
                        case LoggerLevel.WARN:
                        case LoggerLevel.INFO:
                        case LoggerLevel.DEBUG:
                        case LoggerLevel.ALL:
                            message.unshift(this.Name);
                            message.unshift("Debug");
                            console.debug.apply(console, message);
                            break;
                    }
                };
                Logger.prototype.Info = function (message, exception) {
                    switch (this._Level) {
                        case LoggerLevel.FATAL:
                        case LoggerLevel.ERROR:
                        case LoggerLevel.WARN:
                        case LoggerLevel.INFO:
                            message.unshift(this.Name);
                            message.unshift("INFO");
                            console.info.apply(console, message);
                            break;
                    }
                };
                Logger.prototype.Warn = function (message, exception) {
                    switch (this._Level) {
                        case LoggerLevel.FATAL:
                        case LoggerLevel.ERROR:
                        case LoggerLevel.WARN:
                            message.unshift(this.Name);
                            message.unshift("Warn");
                            console.info.apply(console, message);
                            break;
                    }
                };
                Logger.prototype.Error = function (message, exception) {
                    switch (this._Level) {
                        case LoggerLevel.FATAL:
                        case LoggerLevel.ERROR:
                            message.unshift(this.Name);
                            message.unshift("Error");
                            console.error.apply(console, message);
                            break;
                    }
                };
                Logger.prototype.Fatal = function (message, exception) {
                    switch (this._Level) {
                        case LoggerLevel.FATAL:
                            message.unshift(this.Name);
                            message.unshift("Fatal");
                            console.error.apply(console, message);
                            break;
                    }
                };
                return Logger;
            }());
            Utilities.Logger = Logger;
            var DebugHelper = /** @class */ (function () {
                function DebugHelper() {
                }
                DebugHelper.Instance = function () {
                    if (DebugHelper._instance != null)
                        return DebugHelper._instance;
                    DebugHelper._instance = new Logger("root");
                    return DebugHelper._instance;
                };
                DebugHelper.Log = function (messageType, message, showInDebugConsole) {
                    if (showInDebugConsole === void 0) { showInDebugConsole = false; }
                    if (window.console != null) {
                        switch (messageType) {
                            case DebugMessageType.Debug:
                                console.debug(message);
                                break;
                            case DebugMessageType.Info:
                                console.info(message);
                                break;
                            case DebugMessageType.Warning:
                                console.warn(message);
                                break;
                            case DebugMessageType.Error:
                                console.error(message);
                                break;
                            case DebugMessageType.IDEF0Trace:
                                console.trace(message);
                                break;
                            default:
                                break;
                        }
                    } /*end if console is available*/
                    if (showInDebugConsole) {
                        var messageTypeStr = messageType.toString();
                        var clonedData = Joove.Common.cloneObject(message);
                        var cleanData = Joove.Ajax.deleteUnwantedPropertiesSafe(clonedData);
                        var reducedData = cleanData;
                        if (Joove.Common.valueIsObject(cleanData) || Joove.Common.isArray(cleanData)) {
                            reducedData = Joove.Ajax.reduceViewModelData(cleanData);
                        }
                        var serializedData = JSON.stringify(reducedData);
                        var sanitizedData = Joove.Ajax.sanitizeSerializedData(serializedData);
                        var messageDataString = sanitizedData;
                        Joove.Core.executeControllerAction(window._context.currentController, "_Raise", "POST", [], { 'eventName': "DebugMessage", 'parameters': [messageTypeStr, messageDataString] }, null, null, null);
                    } /*end if showInDebugConsole*/
                };
                return DebugHelper;
            }()); /*end class DebugHelper*/
            Utilities.DebugHelper = DebugHelper;
        })(Utilities = Framework.Utilities || (Framework.Utilities = {}));
    })(Framework = CLMS.Framework || (CLMS.Framework = {}));
})(CLMS || (CLMS = {})); /*end namespace*/
