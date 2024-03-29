var $$$ = (controlName: string, context?: JQuery): JQuery => {
    const elementQuery = `[jb-id='${controlName}']`;
    return (context == null) ? $(elementQuery) : context.find(elementQuery);
}

const timeout = (interval: number, flag: boolean = true) => {
    return (target, key: string, descriptor: PropertyDescriptor) => {
        try {
            if (descriptor === undefined) {
                descriptor = Object.getOwnPropertyDescriptor(target, key);
            }
            var originalMethod = descriptor.value;
            descriptor.value = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }

                if (flag != null || flag === true) {
                    setTimeout(() => {
                        originalMethod.apply(this, args);
                    }, interval);
                } else {
                    originalMethod.apply(this, args);
                }

            }
        } catch (ex) {
            // 
        }

    }
};

namespace Joove {
    export class ProgressBar {
        $label: JQuery;
        $bar: JQuery;

        constructor(private labelPrefix, labelQuery, barQuery, context) {
            this.$bar = $(barQuery, context);
            this.$label = $(labelQuery, context);
        }

        update(percent: number) {
            if (this.$bar != null) {
                this.$bar.attr("aria-valuenow", percent);
                this.$bar.css("width", percent + "%");
            }

            if (this.$label != null) {
                this.$label.html(`${this.labelPrefix} (${percent}%)`);
            }
        }

        clear() {
            if (this.$bar != null) {
                this.$bar.attr("aria-valuenow", 0);
                this.$bar.css("width", "0%");
            }
        }
    }

    export class DTOHelper {
        private AlreadySeen = new window["Map"]([]);
        public fillDb = false;
        private _db = {};

        constructor() {
            this.Reset();
        }

        public Reset() {
            this.AlreadySeen = new window["Map"]([]);
        }

        public Add(original, value) {
            this.AlreadySeen.set(DTOHelper.GetViewModelKeyForCaching(original), value);
        }

        public Has(original): boolean {
            return this.AlreadySeen.get(DTOHelper.GetViewModelKeyForCaching(original)) != null;
        }

        public Get(original): any {
            return this.AlreadySeen.get(DTOHelper.GetViewModelKeyForCaching(original));
        }

        public static GetViewModelKeyForCaching = (original) => {
            return original;
        }

        public addToDb(instance) {
            //todo: hanlde base classes
            if (this.fillDb == false || instance == null || instance._key == null || instance._originalTypeClassName == null) {
                return;
            }

            var key = instance._originalTypeClassName + "_" + instance._key;
            if (this._db[key] == null) {
                this._db[key] = {};
            }

            var entry = this._db[key];
            for (var prop in instance) {
                if (prop[0] == "_" || prop[0] == "$") {
                    continue;
                }

                entry[prop] = instance[prop]; 
            }
        }

        public getDb() {
            return this._db;
        }
    }

    export class Application {
        public static Name(): string {
            return window._context.appName;
        };
    }

    export class Session {
        public static CurrentLanguage() {
            return {
                Id: window._context.languageId,
                Code: window._context.language,
                Name: window._context.languageName,
                DateTimeFormat: {
                    LongDatePattern: window._context.longDatePattern,
                    LongTimePattern: window._context.longTimePattern,
                    MonthDayPattern: window._context.monthDayPattern,
                    RFC1123Pattern: window._context.RFC1123Pattern,
                    ShortDatePattern: window._context.shortDatePattern,
                    ShortTimePattern: window._context.shortTimePattern,
                    YearMonthPattern: window._context.yearMonthPattern,
                }
            };
        };

        public static CurrentLocale() {
            return {
                Id: window._context.localeId,
                Code: window._context.locale,
                Name: window._context.localeName,
                DateTimeFormat: {
                    LongDatePattern: window._context.longDatePattern,
                    LongTimePattern: window._context.longTimePattern,
                    MonthDayPattern: window._context.monthDayPattern,
                    RFC1123Pattern: window._context.RFC1123Pattern,
                    ShortDatePattern: window._context.shortDatePattern,
                    ShortTimePattern: window._context.shortTimePattern,
                    YearMonthPattern: window._context.yearMonthPattern,
                }
            };
        };

        private static SessionTimeOut: any;

        private static SessionAboutToExpireTimeOut: any; 

        public static ResetSessionExpirationTimeOut() {           
            clearTimeout(Session.SessionAboutToExpireTimeOut);
            clearTimeout(Session.SessionTimeOut);

            if (window._context.currentUsername == null || window._context.currentUsername == "") return;

            const msBeforeExpirationToShowWarning = 30 * 1000; // 30 seconds
            const expireDurationInMs = window._context.sessionTimeOutMins * 60 * 1000;
            const aboutToExpireDurationInMs = expireDurationInMs - msBeforeExpirationToShowWarning;

            /*
            This is a temp fix
            Session.SessionAboutToExpireTimeOut = setTimeout(() => {
                Session.ShowSessionIsAboutToExpireModal();
            }, aboutToExpireDurationInMs);

            Session.SessionTimeOut = setTimeout(() => {
                $.connection['eventsHub'].connection.stop();
                Session.ShowSessionExpiredModal();
            }, expireDurationInMs);
            */
        }

        private static ShowSessionIsAboutToExpireModal() {
            window._popUpManager.warning("", window._resourcesManager.getSesionAboutToExpireMessage(), () => {
                Session.RefreshSession();
            });
        }

        private static ShowSessionExpiredModal() {
            window._popUpManager.error("", window._resourcesManager.getSesionExpiredMessage());
        }    

        private static RefreshSession() {
            Session.PingServer(() => {
                window._popUpManager.success("", window._resourcesManager.getSesionRefreshedMessage());
            });
        }

        public static SessionConflict() {
            clearTimeout(Session.SessionAboutToExpireTimeOut);
            clearTimeout(Session.SessionTimeOut);

            window._popUpManager.alert('', `User <b>${window._context.currentUsername}</b> has signed in from another device.<br/><br/> Please refresh page to sign in again.`);
        }

        public static PingServer(cb: Function) {            
            Core.executeControllerActionNew({
                verb: "GET",
                action: "_ping",
                controller: window._context.currentMasterPageController,
                cb: () => {
                    cb && cb();                    
                }
            });
        }

    }

    export class ValidationException extends Error {
        name: string;
        stack: string;

        constructor(message: string) {
            super(message);
            this.name = "ValidationException";
            this.stack = (new Error()).stack;
        }
    }

    export class Core {
        private static _actionTimers: any;
        private static _scopeApplicationTimeout = null;
        private static _onChangeCallBacks: Array<Function> = [];
        public static currentControllerActionParamName = "_currentControllerAction";
        public static isModalParamName = "IsModal";
        private static _megaDictionary = {}

        static GetOptions(control: JQuery, prop: string) {
            const attrValue = control.attr(prop);

            if (attrValue == null) return {};

            try {
                return JSON.parse(Common.replaceAll(attrValue, "'", "\""));
            } catch (e) {
                console.error(`Could not parse options: ${attrValue}`);
                return {};
            }
        }

        static ApplicationLocale() {
            return Joove.GlobalizationManager.GetCurrentLocaleManager().SortName;
        }

        static ApplicationLanguage() {
            return Joove.GlobalizationManager.GetCurrentLocaleManager().SortNameLanguage;
        }

        static checkAppVersion() {
            const prevVersion = localStorage.getItem("_appVersion");
            const currentVersion = window._appVersion;

            if (prevVersion === currentVersion) return;

            console.warn(`New App Version '${currentVersion}' (old '${prevVersion}')! Clearing local storage...`);

            // TODO: maybe this must be more sophisticated...
            localStorage.clear();
            localStorage.setItem("_appVersion", currentVersion);
        }

        static checkDbStatus(masterController: string) {
            const lastErrTimestamp = localStorage.getItem("lastDbErrorShown");
            if (lastErrTimestamp != null) {
                const diff = +(new Date()) - +(new Date(lastErrTimestamp));
                if (diff < 90 * 1000) {
                    return;
                }
            }

            Core.executeControllerActionNew({
                controller: masterController,
                action: "_GetDbErrors",
                verb: "GET",
                cb: data => {
                    localStorage.setItem("lastDbErrorShown", (new Date()).toISOString());
                    if (data.Errors != null && data.Errors.length > 0) {
                        window._popUpManager.error("Database update errors",
                            data.Errors + "<hr><h2>Update script</h2>" + data.Script);
                    }
                }
            });
        }

        static isIE() {
            return typeof (Event) !== 'function';
        }

        /**
         * Encodes the Query part of a URL, if needed: if the verb is GET and the queryDataPart contains data regarding Date & Time.
         * (Whether encoding is required or not, returns the result with a "/" at the beginning)
         * @param verb - HTTP Verb, e.g. GET, POST
         * @param queryDataPart - The part of the URL's Query that may require encoding
         */
        static EncodeIfNeeded(verb: string, queryDataPart: any): string {

            const defaultResult = `/${queryDataPart}`;
            try {
                if (verb && verb.toLowerCase() != "get") return defaultResult;

                const dateTimeFormat = "YYYY-MM-DDThh:mm:ss.SSS";

                if (queryDataPart["_isAMomentObject"] === true) {
                    const dateTimeString = queryDataPart.utc().format(dateTimeFormat);
                    return `/${encodeURI(dateTimeString)}`;
                }
                else if (Object.prototype.toString.call(queryDataPart) === "[object Date]") {
                    console.log(queryDataPart);
                    const dateTimeString = moment.utc(queryDataPart).format(dateTimeFormat);
                    return `/${encodeURI(dateTimeString)}`;
                }
                else {
                    return `/${encodeURI(queryDataPart)}`;
                }
            }
            catch (e) {
                console && console.error(e);
                return defaultResult;
            }
        }


        static executeRedirectControllerAction(controller: string, action: string, verb: string, queryData: any,
            postData: any, modalOptions: any, openInNewWindow?: boolean) {
            let getParameters = "";

            if (queryData != null && typeof queryData == "object") {
                for (let i = 0; i < queryData.length; i++) {
                    getParameters += Core.EncodeIfNeeded(verb, queryData[i]);

                    //getParameters += `/${queryData[i]}`;
                }
            }

            $("#navigationForm > input[type='hidden']").remove();
            if (verb.toLowerCase() === "post") {
                postData = postData || {};
                // Clone data before altering, for keeping ViewModel intact!
                const postDataCloned = Common.cloneObject(postData);
                for (let i in postDataCloned) {
                    if (postDataCloned.hasOwnProperty(i)) {
                        const input = $('<input type="hidden" />');
                        //input.val(JSON.stringify(Cycles.decycleObject(postDataCloned[i])));
                        input.val(JSON.stringify(postDataCloned[i]));
                        input.attr("name", `data_${i}`);
                        $("#navigationForm").append(input);
                    }
                }
            }

            const $naviForm = $("#navigationForm");

            var actionPath = `${action}${getParameters}`;
            var url = `${window._context.siteRoot}${controller}`;
            if (actionPath != "") {
                url += `/${actionPath}`;
            }

            if (modalOptions != null || window._context.isModal === true) {
                if (url.indexOf('?') == -1) {
                    url += "?";
                }
                else {
                    url += "&";
                }
                
                url += `${Core.isModalParamName}=true`;                
            }
            
            $naviForm.attr({
                method: verb,
                action: url
            });

            if (Common.controlKeyWasPressed() || openInNewWindow) {
                $naviForm.attr("target", "_blank");
            }
            else {
                $naviForm.removeAttr("target");
            }

            if (modalOptions != null) {
                var $iframe = $("<iframe class='jb-modal-iframe'></iframe>");
                var $clonedForm = $naviForm.clone(true);

                window._popUpManager.registerPopUp({
                    name: `ControllerActionModal${modalOptions.mode}`,
                    width: modalOptions.width,
                    mode: modalOptions.mode,
                    height: modalOptions.height,
                    startMaximized: modalOptions.maximized,
                    title: modalOptions.title,
                    $elementContent: $iframe,
                    destroyOnHide: true,
                    draggable: true,
                    okButton: modalOptions.okButton,
                    cancelButton: modalOptions.cancelButton,
                    onShowCallback: () => {
                        $clonedForm.appendTo($iframe.contents().find("body"));
                        $clonedForm.submit();
                    },
                    closeCallback: modalOptions.onClose
                });

                window._popUpManager.showPopUp(`ControllerActionModal${modalOptions.mode}`);
            } else {
                $naviForm.submit();
            }
        }

        static executeControllerActionNew(options: {
            controller: string;
            action: string;
            verb?: string;
            postData?: any;
            rulesInfo?: any;
            queryData?: any;
            cb?: Function;
            onErrorCb?: Function;
            modalOptions?: any;
            rootModelInfo?: any;
            ignoreQueue?: boolean;
			event?: any;
        }) {
            if (options == null) {
                throw "Parameter 'options' cannot be null";
            }

            if (Common.stringIsNullOrEmpty(options.controller)) {
                throw "Parameter 'options.controller' must have a value";
            }

            if (Common.stringIsNullOrEmpty(options.action)) {
                throw "Parameter 'options.action' must have a value";
            }

            options.verb = (options.verb || "POST").toUpperCase();

            // Clone data before altering, for keeping ViewModel intact!
            const postData = options.postData || {};
            postData._isDirty = window._context.isDirty;

            // this means we execute an internal (=Submit) Action...
            // rulesInfo is not null only when we explicity request Rules Evaluation
            if (options.rulesInfo == null && options.verb !== "GET") {
                options.rulesInfo = window._ruleEngine.getServerRulesInfo(EvaluationTimes.OnSubmit);
                postData.rules = options.rulesInfo.info;
            }

            let getParameters = "";
            if (options.queryData != null && typeof options.queryData == "object") {
                for (let i = 0; i < options.queryData.length; i++) {
                    getParameters += `/${options.queryData[i]}`;
                }
            }

			const spamHelper = new Joove.SpamControlHelper(options.event);
			
            const onSuccess = (data) => {
                Core.handleServerResponse(options.controller,
                    data,
                    options.cb,
                    options.rulesInfo,
                    options.modalOptions,
                    options.rootModelInfo);
            }
            const onError = (data: JQueryXHR) => {
                if (options.onErrorCb == null) {
                    if (FriendlyMessageGenerator.isHandledError(data.statusText)) {
                        (data as any).responseText = FriendlyMessageGenerator.getAjaxErrorMessage(data.statusText);
                    }
                    Core.handleError(data);
                }
                else {
                    options.onErrorCb(data);
                }
            }

            Ajax.ajax({
                url: `${window._context.siteRoot}${options.controller}/${options.action}${getParameters}?${Core.currentControllerActionParamName}=${window._context.currentAction}&${Core.isModalParamName}=${window._context.isModal}`,
                method: options.verb,
                ignoreQueue: options.ignoreQueue,
                data: postData,
				beforeSend: () => {
                    spamHelper.Disable();
                },
                complete: () => {             
                    spamHelper.Enable();
					window._performanceManager && window._performanceManager.send();
                },
                success: data => {
                    window._performanceManager && window._performanceManager.start(window._context.currentController, "_ExecuteControllerAction", `${options.controller}/${options.action}${getParameters}`);
                    onSuccess(data);
                    window._performanceManager && window._performanceManager.stop(window._context.currentController, "_ExecuteControllerAction", `${options.controller}/${options.action}${getParameters}`);
                },
                error: data => {
                    if (data != null && data.status == 200) {
                        onSuccess(data.responseText);
                    }
                    else {
                        onError(data);
                    }
                }
            });
        }

        //DEPRECATED: call Core.executeControllerActionNew
        static executeControllerAction(
            controller: string,
            action: string,
            verb: string,
            queryData: any,
            postData: any,
            threshold: any,
            cb: any,
            modalOptions?: any,
            rulesInfo?: any,
            onError?: Function) {
            //threshold is optional
            if (typeof threshold === "function") {
                cb = threshold;
                threshold = null;
            }

            Core.executeControllerActionNew({
                controller: controller,
                action: action,
                verb: verb,
                queryData: queryData,
                postData: postData,
                cb: cb,
                onErrorCb: onError,
                modalOptions: modalOptions,
                rulesInfo: rulesInfo
            });
        }

        static prepareDataForFileAction($element: JQuery, model: any): any {
            const projectionSchema = window[$element.attr("jb-id") + "_ProjectionScema"];
                     
            if (projectionSchema != null) {               
                //A Projection Schema exists. Lets use it!
                const projectionResult = Common.project(model, projectionSchema);

                return projectionResult;
            }
            else {
                //If you're here, no Projection Schema was found. We're gonna need to send almost everything                
                const clonedData = Common.cloneObject(model);
                const reducedData = Ajax.reduceViewModelData(clonedData);

                return reducedData;
            }
        }

        static uploadFile(options: {
            model: string,
            files: Array<any>,
            indexesKey: any,
            $element: JQuery,
            $progressBar?: ProgressBar,
            targetUrl?: string,
            withProgressBar?: boolean,
            onSuccess: (data?: any, textStatus?: string, jqXhr?: JQueryXHR) => void,
            onError?: (jqXhr?: JQueryXHR, textStatus?: string, errorThrown?: string) => void,
            onComplete?: (jqXhr?: JQueryXHR, textStatus?: string) => void,
        }) {
            const data = new FormData();
            const clonnedModel = Common.cloneObject(options.model);
            //const decycledModel = Cycles.decycleObject(clonnedModel);
            //const serializedModel = JSON.stringify(decycledModel);
            const serializedModel = JSON.stringify(clonnedModel);
            
            for (let i = 0; i < options.files.length; i++) {
                data.append("files[]", options.files[i]);
            }

            data.append("model", serializedModel);
            data.append("indexes", options.indexesKey);

            var url = "";
            if (options.targetUrl == null) {
                const $partialView = Core.getPartialOwnerControlElement(options.$element);
                var controller = window._context.currentController;
                let action = "";
                if ($partialView.length > 0) {
                    action = Core.getPartialOwnerControl(options.$element);
                    data.append("actionName", `${Core.getElementName(options.$element)}_Upload`);
                    data.append("controlName", Core.getPartialOwnerControlElementId(options.$element));
                }
                else {
                    action = `${Core.getElementName(options.$element)}_Upload`;
                }

                let slash = '/';
                if (window._context.siteRoot.slice(-1) == '/') {
                    slash = '';
                }

                url = `${window._context.siteRoot}${slash}${controller}/${action}`;
            }
            else {
                url = options.targetUrl;
            }

            $.ajax({
                url: url,
                type: "POST",
                data: data,
                cache: false,
                headers: { "RequestVerificationToken": window["_antiForgeryKey"] },
                processData: false, // Don't process the files
                contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                success: (dataSuccess: any, textStatus: string, jqXhr: JQueryXHR) => {
                    Session.ResetSessionExpirationTimeOut();
                    if (options.onSuccess) {
                        options.onSuccess(dataSuccess, textStatus, jqXhr);
                    }
                    // check if response contains model update...
                    if (dataSuccess.Type === "Data") {
                        Core.handleServerResponse(controller, dataSuccess);
                    }
                },
                error: (jqXhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                    if (options.onError) {
                        options.onError(jqXhr, textStatus, errorThrown);
                    }
                    console.error(jqXhr, textStatus, errorThrown);
                },
                complete: (jqXhr: JQueryXHR, textStatus: string) => {
                    if (options.onComplete) {
                        options.onComplete(jqXhr, textStatus);
                    }
                    if (options.withProgressBar !== false) {
                        options.$progressBar.clear();
                    }
                },
                // Custom XMLHttpRequest
                xhr: () => {
                    var myXhr = $.ajaxSettings.xhr();

                    if (myXhr.upload && options.withProgressBar !== false) {
                        // For handling the progress of the upload
                        myXhr.upload.addEventListener("progress", (event) => {
                            if (event.lengthComputable) {
                                const percent = Math.floor(event.loaded * 100 / event.total);
                                options.$progressBar.update(percent);
                                // $progressBar.html(percent + "%");
                            }
                        }, false);
                    }
                    return myXhr;
                }
            });
        }

        static handleServerResponse(controller: string, data: any, cb?: Function, rulesInfo?: any, modalOptions?: any, rootModelInfo?: any) {            
            let afterRulesAppliedCb: Function = null;
            // Raw result
            if (data == null || data.Type == null) {
                cb && cb(data);
                return;
            }

            // Structured result
            switch (data.Type) {
                case "Redirect":
                    if (data.ClientCommands != null) {
                        try {
                            window._commander.executeCommands(data.ClientCommands);
                        } catch (e) {
                            console.warn("failed to execute client commands", data.ClientCommands);
                        }
                    }

                    if (data.Url != null && data.Url.trim() !== "") {
                        if (modalOptions != null) {
                            console.error("Redirecting to URL inside modal after ajax call not implemented!");
                        }
                        else if (data.Url === "CLOSE_FORM") {
                            window._commander.closeForm();
                        }
                        else {
                            window.location.href = data.Url;
                        }
                    }
                    else {
                        Core.executeRedirectControllerAction(data.Controller,
                            data.Action,
                            data.Method,
                            data.QueryParameters,
                            data.PostParameters,
                            modalOptions);
                    }
                    return;

                case "Data":
                    Core.updateViewModel(controller, data.Data, rootModelInfo);

                    window._ruleEngine.update(EvaluationTimes.OnChange, null, afterRulesAppliedCb);
                    if (cb && typeof cb === "function") cb(data.Data);
                    break;

                case "ActionReturnValue":
                    Core.updateViewModel(controller, data.Data, rootModelInfo);
                    if (cb) cb(data.Value);
                    break;

                case "Error":
                    FriendlyMessageGenerator.handleMessage(data);
                    break;

                case "UpdateInstance":
                    if (cb) cb(data.Data);

                    window._ruleEngine.update(EvaluationTimes.OnChange, null, afterRulesAppliedCb);
                    break;

                case "RuleEvaluation":
                    afterRulesAppliedCb = cb;

                    if (rulesInfo != null) {
                        const parsed = JSON.parse(data.Data);
                        if (parsed.Model != null) {
                            Core.updateViewModel(controller, parsed, rootModelInfo);
                        }

                        // Apply server side evaluated rules results
                        window._ruleEngine.applyServerRulesResult(parsed.RuleEvaluations, rulesInfo);

                        // Invoke after rules applied Callback
                        if (afterRulesAppliedCb) afterRulesAppliedCb();
                    }

                    break;

                case "Unauthorized":
                    alert("Unauthorized: TODO show appropriate message.");
                    break;

                default:
                    if (cb) cb(data);
                    break;
            }
        }

        static handleError(data: any) {
            FriendlyMessageGenerator.handleMessage(data);
        }

        //rootModelInfo, it is not null for partial views, and contains info for each property of the partial view
        //if it is not null, instead of updating the whole model, we should only update properties from rootModelInfo
        //rootModelInfo: Dicstionary<string, string>, key is property name, value is property path
        static updateViewModel(formName: string, updatedViewModel: any, rootModelInfo: any) {
            window._performanceManager && window._performanceManager.start(window._context.currentController, "_UpdateViewModel");

            const scope = Core.getScope(formName);
            if (scope.model == null) {
                scope.model = {};
            }

            const viewDTO = typeof updatedViewModel === "string" ? JSON.parse(updatedViewModel) : updatedViewModel;

            //viewDTO.Model = new ReferencesReconstructor().reconstructReferences(viewDTO.Model);
            //viewDTO.Model = Cycles.reconstructObject(viewDTO.Model);

            if (viewDTO.IsOptimized !== true) {
                if (rootModelInfo != null) {
                    for (let p in rootModelInfo) {
                        if (rootModelInfo.hasOwnProperty(p) && p.indexOf("__InitialSelection") == -1) {
                            Core.assignModelPath(scope.model, rootModelInfo[p], viewDTO.Model[p]);
                        }
                    }
                } else {
                    // sync properties
                    if (viewDTO.Model == null && viewDTO.ClientResponse != null) {
                        Core.parseClientResponse(scope.model, viewDTO.ClientResponse);
                    } else {
                        Core.syncProperties(scope.model, viewDTO.Model);
                    }
                }

                scope.model = scope.dehydrate();
                scope.model = new ReferencesReconstructor().reconstructReferences(scope.model);
            } else {
                //TODO: maybe this line isnt needed due to 
                scope.model = JSON.parse(JSON.stringify(scope.model));
                const context = new Joove.DTOHelper();
                context.fillDb = true;
                scope.model = scope.dehydrate(context);
                const updatedInstances = [];

                if (rootModelInfo != null) {
                    //TODO: handle partial views
                    for (let p in rootModelInfo) {
                        if (rootModelInfo.hasOwnProperty(p) && p.indexOf("__InitialSelection") == -1) {
                            Core.assignModelPath(scope.model, rootModelInfo[p], viewDTO.Model[p]);
                        }
                    }
                } else {
                    // sync properties
                    Core.syncPropertiesDeep(scope.model, viewDTO.Model, context.getDb(), updatedInstances);
                }

                scope.model = scope.dehydrate();
                scope.model = new ReferencesReconstructor(updatedInstances).reconstructReferences(scope.model);
            }

            Core.applyScope(scope);
            // Execute Client Commands
            window._commander.executeCommands(viewDTO.ClientCommands);

            // Clear Commands
            viewDTO.ClientCommands = [];
            window.viewDTO = viewDTO;

            //Copy all the model into the Master's Model
            if (window[`scope_${window._context.currentMasterPageController}`] && window[`scope_${window._context.currentMasterPageController}`].model) {
                window[`scope_${window._context.currentMasterPageController}`].model = scope.model;
            }

            window._performanceManager && window._performanceManager.stop(window._context.currentController, "_UpdateViewModel");
        }

        private static parseClientResponse(model: any, responseItems: ResponseData[]) {
            for (let i = 0; i < responseItems.length; i++) {
                const item = responseItems[i];
                Core.nullSafeValueAssignToPath(item.Value, item.Path, model);
            }
        }

        private static nullSafeValueAssignToPath(value: any, path: string, parent: any) {
            var parts = path.split(".");

            for (let i = 0; i < parts.length; i++) {
                var current = parts[i];

                if (parent[current] == null) {
                    parent[current] = {};
                }

                if (i == parts.length - 1) {
                    parent[current] = value;
                }
                else {
                    parent = parent[current];
                }
            }
        }

        static syncProperties(left: any, right: any) {
            for (let p in right) {
                if (right.hasOwnProperty(p) && p.indexOf("__InitialSelection") == -1) {
                    left[p] = right[p];
                }
            }
        }

        static syncPropertiesDeep(left: any, right: any, db, fresh: any[]) {
            if (left == null) {
                left = {};
            }

            const dbKey = right._originalTypeClassName + "_" + right._key;
            const dbEntry = db[dbKey];
            const updatedProperties = right["_updatedProperties"] == null ? [] : right["_updatedProperties"];

            for (let p in right) {
                if (!right.hasOwnProperty(p) || p.indexOf("__InitialSelection") != -1) {
                    continue;
                }

                const shouldKeepServersVersion =
                    p[0] == "_" || p[0] == "$" ||
                    dbEntry == null || dbEntry[p] === undefined ||
                    updatedProperties.indexOf(p) != -1;
                    
                if (Common.isArray(right[p])) {
                    if (left[p] == null) {
                        left[p] = [];
                    }

                    if (right[p] != null && left[p].length > right[p].length) { //length decreased
                        const itemsToRemove = left[p].length - right[p].length;
                        left[p].splice(right[p].length, itemsToRemove);
                    }
                    for (let i = 0; i < right[p].length; i++) {
                        if (left[p].length <= i) {
                            if (right[p][i] == null || Common.valueIsPrimitive(right[p][i])) {
                                left[p].push(right[p][i]);
                            } else {
                                const newArrayItem = {};
                                this.syncPropertiesDeep(newArrayItem, right[p][i], db, fresh);
                                left[p].push(newArrayItem);
                            }
                        } else {
                            this.syncPropertiesDeep(left[p][i], right[p][i], db, fresh);
                        }
                    }
                } if (Common.valueIsObject(right[p])) {
                    if (shouldKeepServersVersion) {
                        fresh.push(left[p]);
                    } else if (db[dbKey][p] === null) {
                        left[p] = null;
                        continue;
                    }
                    this.syncPropertiesDeep(left[p], right[p], db, fresh);
                } else  { // Primitiive
                    left[p] = shouldKeepServersVersion ? right[p] : dbEntry[p];
                }
            }
        }

        static getScope(formName?: string): IJooveScope {
            return window._context.currentMasterPageController === formName
                ? Common.getMasterScope()
                : Common.getScope();
        }

        static getModel(formName): IJooveScope {
            return window._context.currentMasterPageController === formName
                ? Common.getMasterModel()
                : Common.getModel();
        }

        /* NOTE: This change was made to give more time for the page to load and find the according elements.
         *       If the page is big in size the JQuery selector in function Core.getPartialByName will not return
         *       any elements and no ColumnInfo will be actually registered.
         *
         *       k.filippakos */
        //@timeout(2000)
        static registerPartialColumnInfo(partialName: string, controlName: string, info: any, context?: JQuery): void {
            const MAX_RETRIES = 20;
            const INTERVAL = 500;
            let retries = 0;
            let stateCheck = setInterval(() => {
                const elements = Core.getPartialByName(partialName, context);

                if (elements.length > 0 || retries >= MAX_RETRIES) {
                    if (elements.length == 0) { console.log("ERROR: Registering partial columns for control '" + controlName + "' did not find partial element after " + (MAX_RETRIES * INTERVAL) + "ms."); } else { console.log("REGISTRED!"); }
                    clearInterval(stateCheck);
                    elements.each((index, elem) => {
                        const element = $(elem);
                        const partialName = element.attr('jb-id');

                        window[`${partialName}_${controlName}_ColumnInfo`] = info;
                    });
                } else {
                    retries++;
                }
            }, INTERVAL);
        }

        @timeout(2000)
        static unRegisterPartialColumnInfo(partialName: string, controlName: string, context?: JQuery): void {
            const elements = Core.getPartialByName(partialName, context);

            elements.each((index, elem) => {
                const element = $(elem);
                const partialName = element.attr('jb-id');

                delete window[`${partialName}_${controlName}_ColumnInfo`];
            });
        }

        static getPartialByName(name: string, context?: JQuery): JQuery {
            const elements = (context == null) ? $(`[jb-partial-name="${name}"]`) : context.find(`[jb-partial-name="${name}"]`);
            return elements;
        }

        static getPartialModelValue(name: string, pathInPartial: string, $context?: JQuery): any {
            //const element = ($context == null)
            //    ? $(`[jb-id="${name}"]`)
            //    : $context.find(`[jb-id="${name}"]`);

            //const partialModelInfo = Core.getPartialControlModelInfo(element);

            //const partialPathParts = pathInPartial.split(".");
            //const partialPathRoot = partialPathParts[0];

            //const ownerFormModelRoot = partialModelInfo[partialPathRoot];

            //const partialPathConvertedToOwnerModelFullPath = partialPathParts.length > 1
            //    ? ownerFormModelRoot + pathInPartial.substring(pathInPartial.indexOf("."))
            //    : ownerFormModelRoot;
           
            // return Core.evaluateModelPath(Common.getModel(), pathInPartial);
            //console.log(Joove.Common.getModel());
            return eval(`Joove.Common.getModel().${pathInPartial}`);
        }

        static getPartialOwnerControlElement($control: JQuery): JQuery {
            return $control.closest("[jb-type='PartialView']");
        }

        static getPartialOwnerControlElementId($control: JQuery): string {
            return Core.getPartialOwnerControlElement($control).attr("jb-id");
        }

        static getPartialOwnerControl($control: JQuery): string {
            return Core.getPartialOwnerControlElement($control).attr("jb-partial-name");
        }

        static getPartialViewControlOriginalName($control: JQuery): string {
            const fullName = $control.attr("jb-id");
            const $partialViewControl = Core.getPartialOwnerControlElement($control);

            if ($partialViewControl.length === 0) return null;

            const partialControlName = Core.getPartialOwnerControlElementId($control);

            if (fullName.indexOf(partialControlName) !== 0) return null;

            return fullName.substring(partialControlName.length);
        }

        static getPartialControlModelInfo($control: JQuery) {
            const $partialViewControl = Core.getPartialOwnerControlElement($control);
            if ($partialViewControl.length === 0) return null;
            return JSON.parse($partialViewControl.attr("jb-partial-model"));
        }

        static getRootModelForControl($control: JQuery, forMasterPage: boolean) {
            let model = forMasterPage
                ? Common.getMasterModel()
                : Common.getModel();

            const $partialViewControl = Core.getPartialOwnerControlElement($control);
            if ($partialViewControl.length > 0) {
                const newModel = {};
                const modelInfo = Core.getPartialControlModelInfo($control);

                for (let prop in modelInfo) {
                    if (modelInfo.hasOwnProperty(prop)) {
                        const modelPath = modelInfo[prop];
                        newModel[prop] = Core.evaluateModelPath(model, modelPath);
                    }
                }

                //try to restore SelectedItemKeys
                const partialControlName = $partialViewControl.attr("jb-id");
                for (let prop in model) {
                    if (model.hasOwnProperty(prop)) {
                        if (prop.indexOf(partialControlName) === 0 && prop.indexOf("SelectedItemKeys") !== -1) {
                            const fixedName = prop.replace(partialControlName, "");
                            newModel[fixedName] = model[prop];
                        }
                    }
                }

                model = newModel;
            }

            return model;
        }

        static evaluateModelPath(root: any, path: string) {
            if (path.indexOf("model.") === -1) {
                throw "Partial views inside context are not yet supported";
            }
            path = path.substring("model.".length);

            const splitted = path.split(".");
            for (let i = 0; i < splitted.length; i++) {
                root = root[splitted[i]];
                if (root == null) {
                    break;
                }
            }
            return root;
        }

        static assignModelPath(root: Array<string>, path: string, value: any) {
            const prevValue = Core.evaluateModelPath(root, path);
            Core.syncProperties(prevValue, value);
        }

        static getControllerForElement($element: JQuery, forMasterPage?: boolean) {
            const $partialViewControl = $element.closest("[jb-type='PartialView']");
            if ($partialViewControl.length > 0) {
                return $partialViewControl.attr("jb-partial-name");
            }

            return forMasterPage
                ? window._context.currentMasterPageController
                : window._context.currentController;
        }

        static GetServerSideElementNameFromId(name: string, context?: JQuery): string {
            const element = $$$(name, context);
            return Core.GetServerSideElementName(element);
        }

        static GetServerSideElementName($element: JQuery): string {
            const partial = Core.getPartialOwnerControlElement($element);
            if (partial.length == 0) {
                return Core.getElementName($element);
            }
            return `${Core.getElementName($element)}`;
        }

        static GetElementNameFromId(name: string, context?: JQuery): string {
            const $element = $$$(name, context);
            return Core.GetClientSideName($element);
        }

        static GetClientSideName($element: JQuery): string {
            const partial = Core.getPartialOwnerControlElement($element);
            if (partial.length == 0) {
                return Core.getElementName($element);
            }

            const partialName = partial.attr("jb-id");
            return `${partialName}_${Core.getElementName($element)}`;
        }

        static getElementName($element: JQuery): string {
            const name = $element.attr("jb-id");

            const $partialViewControl = $element.closest("[jb-type='PartialView']");
            if ($partialViewControl.length > 0) {
                return name.replace($partialViewControl.attr("jb-id"), "");
            }

            return name;
        }

        static applyScope($scope?: IJooveScope, immediate?: boolean) {
            if ($scope == null) $scope = Common.getScope();

            clearTimeout(Core._scopeApplicationTimeout);

            if (immediate === true) {
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            }
            else {
                Core._scopeApplicationTimeout = setTimeout(() => {
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                }, 10);
            }
        }

        static onChange(element: HTMLElement, newValue: any, dontMakeDirty?: boolean) {
            if (Validation.Bindings.gridIsBoundToValidationsSummary(element) === true) return;

            const exceptionForIE = typeof (Event) !== 'function';
            // trigger blur so that our model is updated
            // this is needed because 'enter' natively triggers on change
            // but our angular model is updated on blur...
            if ($(element).attr("jb-type") !== "DateTimeBox" && document.activeElement === element && !exceptionForIE) {
                $(element).blur();
                $(element).focus();
            }

			// Check the Dirty States immediately. No time to wait!
			if (!dontMakeDirty && $(element).attr("joove-ds-filter") != "true") {
				window._context.isDirty = true;
			}
			
            setTimeout(() => {
                if ((element.tagName != null) && (element.tagName.toLowerCase() !== "table" && element.tagName.toLocaleLowerCase() !== "img")) {
                    const $element = $(element);
                    newValue = newValue || $element.val();
                    if ($(element).attr("jb-type") === "CheckBox") {
                        newValue = $(element).is(":checked");
                    }
                    const oldValue = Core.elementData($element, "old-value");
                    if (newValue === oldValue) return;
                    Core.elementData($element, "old-value", newValue);
                }

                Validation.UiHelper.updateEmptyRequiredFieldsState(Joove.Validation.UiHelper.lastEvaluatedValidationGroups, false);

                window._ruleEngine.update(EvaluationTimes.OnChange).then(() => {
                    setTimeout(() => {
                        Validation.UiHelper.markDataValidationRelatedControls(true);
                    }, 50);
                });
                
                // Callbacks
                for (let i = 0; i < Core._onChangeCallBacks.length; i++) {
                    Core._onChangeCallBacks[i]();
                }
            }, 50);
        }

        static elementData($element: JQuery, prop?: string, value?: string) {
            const indexes = Common.getIndexesOfControl($element).key;
            const key = $element.attr("jb-id") + indexes + "[data]";

            if (value !== undefined) {
                Core._megaDictionary[key] = value;
            }

            return Core._megaDictionary[key];
        }

        static setBoClassPropertyFromInstance(propertyName: string, instance: any, valueToSet: any): void {
            const classNameFull = instance._originalTypeClassName;

            if (classNameFull == null) {
                console.warn("Could not find full class name on instance!", instance);
                return;
            }

            const nameParts = classNameFull.split(".");
            const shortName = nameParts[nameParts.length - 1];

            Core.setBoClassProperty(shortName, propertyName, instance, valueToSet);
        }

        static setBoClassProperty(className: string, propertyName: string, instance: any, valueToSet: any): void {
            const boClass = window["_appDomain"][className];

            if (boClass == null) {
                console.warn(`Could not find BO class with name: ${className}`);
                return;
            }

            const method = boClass[`set${propertyName}`];

            if (method == null) {
                console.warn(`Could not find set method in class with name: set${propertyName} in class ${className}`);
                if (instance != null) {
                    instance[propertyName] = valueToSet;
                }
                return;
            }

            method(instance, valueToSet);
        }
    };

    class ResponseData {
        Path: string;
        Value: any;
    }
}