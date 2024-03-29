namespace CLMS.Framework.Utilities {
	
	export enum DebugMessageType {
        Debug = 0,
        Info = 1,
        Warning = 2,
        Error = 3,
        IDEF0Trace = 4
    }
    
    export enum LoggerLevel {
        ALL,
        DEBUG,
        INFO,
        WARN,
        ERROR,
        FATAL,
        OFF
    }

    export class Logger {
        constructor(private _Name: string, private _Level?: LoggerLevel) {
            if (window._context.mode === "Development") {
                this._Level = LoggerLevel.ALL;
            } else {
                this._Level = LoggerLevel.OFF;
            }

            this._Name = _Name;
        }

        get IsDebugEnabled() {
            return this._Level == LoggerLevel.DEBUG;
        }

        get IsInfoEnabled() {
            return this._Level == LoggerLevel.INFO;
        }

        get IsWarnEnabled() {
            return this._Level == LoggerLevel.WARN;
        }

        get IsErrorEnabled() {
            return this._Level == LoggerLevel.ERROR;
        }

        get IsFatalEnabled() {
            return this._Level == LoggerLevel.FATAL;
        }

        private get Name() {
            return `[${moment()}] ${this._Name}`;
        }

        Debug(message: Array<any>, exception?: any): void {
            switch (this._Level) {
                case LoggerLevel.FATAL:
                case LoggerLevel.ERROR:
                case LoggerLevel.WARN:
                case LoggerLevel.INFO:
                case LoggerLevel.DEBUG:
                case LoggerLevel.ALL:
                    message.unshift(this.Name);
                    message.unshift("Debug");
                    console.debug(...message);
                    break;
            }
        }

        Info(message: Array<any>, exception?: any): void {
            switch (this._Level) {
                case LoggerLevel.FATAL:
                case LoggerLevel.ERROR:
                case LoggerLevel.WARN:
                case LoggerLevel.INFO:
                    message.unshift(this.Name);
                    message.unshift("INFO");
                    console.info(...message);
                    break;
            }
        }

        Warn(message: Array<any>, exception?: any): void {
            switch (this._Level) {
                case LoggerLevel.FATAL:
                case LoggerLevel.ERROR:
                case LoggerLevel.WARN:
                    message.unshift(this.Name);
                    message.unshift("Warn");
                    console.info(...message);
                    break;
            }
        }

        Error(message: Array<any>, exception?: any): void {
            switch (this._Level) {
                case LoggerLevel.FATAL:
                case LoggerLevel.ERROR:
                    message.unshift(this.Name);
                    message.unshift("Error");
                    console.error(...message);
                    break;
            }
        }

        Fatal(message: Array<any>, exception?: any): void {
            switch (this._Level) {
                case LoggerLevel.FATAL:
                    message.unshift(this.Name);
                    message.unshift("Fatal");
                    console.error(...message);
                    break;
            }
        }
    }

    export class DebugHelper {
        private static _instance: Logger;

        static Instance(): Logger {
            if (DebugHelper._instance != null) return DebugHelper._instance;
            DebugHelper._instance = new Logger("root");
            return DebugHelper._instance;
        }

		static Log(messageType: DebugMessageType, message: any, showInDebugConsole: boolean = false) {
			if(window.console != null){
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
			}/*end if console is available*/
					
            if (showInDebugConsole) {

                const messageTypeStr = messageType.toString();                                                         
                                                                                                                       
                const clonedData = Joove.Common.cloneObject(message);  
                                                               
                const cleanData = Joove.Ajax.deleteUnwantedPropertiesSafe(clonedData);

                let reducedData = cleanData;
                if (Joove.Common.valueIsObject(cleanData) || Joove.Common.isArray(cleanData)) {
                    reducedData = Joove.Ajax.reduceViewModelData(cleanData);                              
                }

                const serializedData = JSON.stringify(reducedData);                                                    
                const sanitizedData = Joove.Ajax.sanitizeSerializedData(serializedData);                               
                                                                                                                       
                const messageDataString = sanitizedData;                                                              
                Joove.Core.executeControllerAction(window._context.currentController, "_Raise", "POST", [], { 'eventName': "DebugMessage", 'parameters': [messageTypeStr, messageDataString ] }, null, null, null);
			}/*end if showInDebugConsole*/
        }
    }/*end class DebugHelper*/
} /*end namespace*/
