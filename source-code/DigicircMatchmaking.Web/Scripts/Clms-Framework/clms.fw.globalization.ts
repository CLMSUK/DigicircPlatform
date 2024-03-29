namespace Joove {
    function Transform() {
        return (target, propertyKey: string, descriptor: PropertyDescriptor) => {
            try {
                const value = target[propertyKey];
                descriptor.value = () => {
                    let val = value() as string;

                    val = Joove.Common.changeDateTimeFormat(val);

                    return val;
                }    
            } catch (ex) {
                // 
            }

        }
    }

    export class DateTimeFormat {

        @Transform()
        LongDatePattern () {
            return window._context.longDatePattern;
        }

        @Transform()
        LongTimePattern () {
            return window._context.longTimePattern;
        }

        @Transform()
        ShortDatePattern () {
            return window._context.shortDatePattern;
        }

        @Transform()
        ShortTimePattern () {
            return window._context.shortTimePattern;
        }

        GeneralShortTimePattern () {
            return `${this.ShortDatePattern()} ${this.ShortTimePattern()}`;
        }

        GeneralLongTimePattern () {
            return `${this.ShortDatePattern()} ${this.LongTimePattern()}`;
        }
    }

    export class GlobalizationManager { 
        private static _instance: GlobalizationManager;
        private dateTimeFormat: DateTimeFormat;
        
        static GetCurrentLocaleManager(): GlobalizationManager {
            if (GlobalizationManager._instance != null) 
                return GlobalizationManager._instance;
            GlobalizationManager.init();
            return GlobalizationManager._instance;
        }

        get SortName () {
            return window._context.locale;
        }

        get SortNameLanguage() {
            return window._context.language;
        }

        get DateTimeFormat () {
            return this.dateTimeFormat;
        }

        private static init(): void {
            const manager = new GlobalizationManager();
            manager.dateTimeFormat = new DateTimeFormat();
            GlobalizationManager._instance = manager;
        }
    }
}