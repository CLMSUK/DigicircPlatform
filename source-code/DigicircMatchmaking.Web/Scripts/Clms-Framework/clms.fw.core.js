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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $$$ = function (controlName, context) {
    var elementQuery = "[jb-id='" + controlName + "']";
    return (context == null) ? $(elementQuery) : context.find(elementQuery);
};
var timeout = function (interval, flag) {
    if (flag === void 0) { flag = true; }
    return function (target, key, descriptor) {
        try {
            if (descriptor === undefined) {
                descriptor = Object.getOwnPropertyDescriptor(target, key);
            }
            var originalMethod = descriptor.value;
            descriptor.value = function () {
                var _this = this;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                if (flag != null || flag === true) {
                    setTimeout(function () {
                        originalMethod.apply(_this, args);
                    }, interval);
                }
                else {
                    originalMethod.apply(this, args);
                }
            };
        }
        catch (ex) {
            // 
        }
    };
};
var Joove;
(function (Joove) {
    var ProgressBar = /** @class */ (function () {
        function ProgressBar(labelPrefix, labelQuery, barQuery, context) {
            this.labelPrefix = labelPrefix;
            this.$bar = $(barQuery, context);
            this.$label = $(labelQuery, context);
        }
        ProgressBar.prototype.update = function (percent) {
            if (this.$bar != null) {
                this.$bar.attr("aria-valuenow", percent);
                this.$bar.css("width", percent + "%");
            }
            if (this.$label != null) {
                this.$label.html(this.labelPrefix + " (" + percent + "%)");
            }
        };
        ProgressBar.prototype.clear = function () {
            if (this.$bar != null) {
                this.$bar.attr("aria-valuenow", 0);
                this.$bar.css("width", "0%");
            }
        };
        return ProgressBar;
    }());
    Joove.ProgressBar = ProgressBar;
    var DTOHelper = /** @class */ (function () {
        function DTOHelper() {
            this.AlreadySeen = new window["Map"]([]);
            this.fillDb = false;
            this._db = {};
            this.Reset();
        }
        DTOHelper.prototype.Reset = function () {
            this.AlreadySeen = new window["Map"]([]);
        };
        DTOHelper.prototype.Add = function (original, value) {
            this.AlreadySeen.set(DTOHelper.GetViewModelKeyForCaching(original), value);
        };
        DTOHelper.prototype.Has = function (original) {
            return this.AlreadySeen.get(DTOHelper.GetViewModelKeyForCaching(original)) != null;
        };
        DTOHelper.prototype.Get = function (original) {
            return this.AlreadySeen.get(DTOHelper.GetViewModelKeyForCaching(original));
        };
        DTOHelper.prototype.addToDb = function (instance) {
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
        };
        DTOHelper.prototype.getDb = function () {
            return this._db;
        };
        DTOHelper.GetViewModelKeyForCaching = function (original) {
            return original;
        };
        return DTOHelper;
    }());
    Joove.DTOHelper = DTOHelper;
    var Application = /** @class */ (function () {
        function Application() {
        }
        Application.Name = function () {
            return window._context.appName;
        };
        ;
        return Application;
    }());
    Joove.Application = Application;
    var Session = /** @class */ (function () {
        function Session() {
        }
        Session.CurrentLanguage = function () {
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
        ;
        Session.CurrentLocale = function () {
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
        ;
        Session.ResetSessionExpirationTimeOut = function () {
            clearTimeout(Session.SessionAboutToExpireTimeOut);
            clearTimeout(Session.SessionTimeOut);
            if (window._context.currentUsername == null || window._context.currentUsername == "")
                return;
            var msBeforeExpirationToShowWarning = 30 * 1000; // 30 seconds
            var expireDurationInMs = window._context.sessionTimeOutMins * 60 * 1000;
            var aboutToExpireDurationInMs = expireDurationInMs - msBeforeExpirationToShowWarning;
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
        };
        Session.ShowSessionIsAboutToExpireModal = function () {
            window._popUpManager.warning("", window._resourcesManager.getSesionAboutToExpireMessage(), function () {
                Session.RefreshSession();
            });
        };
        Session.ShowSessionExpiredModal = function () {
            window._popUpManager.error("", window._resourcesManager.getSesionExpiredMessage());
        };
        Session.RefreshSession = function () {
            Session.PingServer(function () {
                window._popUpManager.success("", window._resourcesManager.getSesionRefreshedMessage());
            });
        };
        Session.SessionConflict = function () {
            clearTimeout(Session.SessionAboutToExpireTimeOut);
            clearTimeout(Session.SessionTimeOut);
            window._popUpManager.alert('', "User <b>" + window._context.currentUsername + "</b> has signed in from another device.<br/><br/> Please refresh page to sign in again.");
        };
        Session.PingServer = function (cb) {
            Core.executeControllerActionNew({
                verb: "GET",
                action: "_ping",
                controller: window._context.currentMasterPageController,
                cb: function () {
                    cb && cb();
                }
            });
        };
        return Session;
    }());
    Joove.Session = Session;
    var ValidationException = /** @class */ (function (_super) {
        __extends(ValidationException, _super);
        function ValidationException(message) {
            var _this = _super.call(this, message) || this;
            _this.name = "ValidationException";
            _this.stack = (new Error()).stack;
            return _this;
        }
        return ValidationException;
    }(Error));
    Joove.ValidationException = ValidationException;
    var Core = /** @class */ (function () {
        function Core() {
        }
        Core.GetOptions = function (control, prop) {
            var attrValue = control.attr(prop);
            if (attrValue == null)
                return {};
            try {
                return JSON.parse(Joove.Common.replaceAll(attrValue, "'", "\""));
            }
            catch (e) {
                console.error("Could not parse options: " + attrValue);
                return {};
            }
        };
        Core.ApplicationLocale = function () {
            return Joove.GlobalizationManager.GetCurrentLocaleManager().SortName;
        };
        Core.ApplicationLanguage = function () {
            return Joove.GlobalizationManager.GetCurrentLocaleManager().SortNameLanguage;
        };
        Core.checkAppVersion = function () {
            var prevVersion = localStorage.getItem("_appVersion");
            var currentVersion = window._appVersion;
            if (prevVersion === currentVersion)
                return;
            console.warn("New App Version '" + currentVersion + "' (old '" + prevVersion + "')! Clearing local storage...");
            // TODO: maybe this must be more sophisticated...
            localStorage.clear();
            localStorage.setItem("_appVersion", currentVersion);
        };
        Core.checkDbStatus = function (masterController) {
            var lastErrTimestamp = localStorage.getItem("lastDbErrorShown");
            if (lastErrTimestamp != null) {
                var diff = +(new Date()) - +(new Date(lastErrTimestamp));
                if (diff < 90 * 1000) {
                    return;
                }
            }
            Core.executeControllerActionNew({
                controller: masterController,
                action: "_GetDbErrors",
                verb: "GET",
                cb: function (data) {
                    localStorage.setItem("lastDbErrorShown", (new Date()).toISOString());
                    if (data.Errors != null && data.Errors.length > 0) {
                        window._popUpManager.error("Database update errors", data.Errors + "<hr><h2>Update script</h2>" + data.Script);
                    }
                }
            });
        };
        Core.isIE = function () {
            return typeof (Event) !== 'function';
        };
        /**
         * Encodes the Query part of a URL, if needed: if the verb is GET and the queryDataPart contains data regarding Date & Time.
         * (Whether encoding is required or not, returns the result with a "/" at the beginning)
         * @param verb - HTTP Verb, e.g. GET, POST
         * @param queryDataPart - The part of the URL's Query that may require encoding
         */
        Core.EncodeIfNeeded = function (verb, queryDataPart) {
            var defaultResult = "/" + queryDataPart;
            try {
                if (verb && verb.toLowerCase() != "get")
                    return defaultResult;
                var dateTimeFormat = "YYYY-MM-DDThh:mm:ss.SSS";
                if (queryDataPart["_isAMomentObject"] === true) {
                    var dateTimeString = queryDataPart.utc().format(dateTimeFormat);
                    return "/" + encodeURI(dateTimeString);
                }
                else if (Object.prototype.toString.call(queryDataPart) === "[object Date]") {
                    console.log(queryDataPart);
                    var dateTimeString = moment.utc(queryDataPart).format(dateTimeFormat);
                    return "/" + encodeURI(dateTimeString);
                }
                else {
                    return "/" + encodeURI(queryDataPart);
                }
            }
            catch (e) {
                console && console.error(e);
                return defaultResult;
            }
        };
        Core.executeRedirectControllerAction = function (controller, action, verb, queryData, postData, modalOptions, openInNewWindow) {
            var getParameters = "";
            if (queryData != null && typeof queryData == "object") {
                for (var i = 0; i < queryData.length; i++) {
                    getParameters += Core.EncodeIfNeeded(verb, queryData[i]);
                    //getParameters += `/${queryData[i]}`;
                }
            }
            $("#navigationForm > input[type='hidden']").remove();
            if (verb.toLowerCase() === "post") {
                postData = postData || {};
                // Clone data before altering, for keeping ViewModel intact!
                var postDataCloned = Joove.Common.cloneObject(postData);
                for (var i in postDataCloned) {
                    if (postDataCloned.hasOwnProperty(i)) {
                        var input = $('<input type="hidden" />');
                        //input.val(JSON.stringify(Cycles.decycleObject(postDataCloned[i])));
                        input.val(JSON.stringify(postDataCloned[i]));
                        input.attr("name", "data_" + i);
                        $("#navigationForm").append(input);
                    }
                }
            }
            var $naviForm = $("#navigationForm");
            var actionPath = "" + action + getParameters;
            var url = "" + window._context.siteRoot + controller;
            if (actionPath != "") {
                url += "/" + actionPath;
            }
            if (modalOptions != null || window._context.isModal === true) {
                if (url.indexOf('?') == -1) {
                    url += "?";
                }
                else {
                    url += "&";
                }
                url += Core.isModalParamName + "=true";
            }
            $naviForm.attr({
                method: verb,
                action: url
            });
            if (Joove.Common.controlKeyWasPressed() || openInNewWindow) {
                $naviForm.attr("target", "_blank");
            }
            else {
                $naviForm.removeAttr("target");
            }
            if (modalOptions != null) {
                var $iframe = $("<iframe class='jb-modal-iframe'></iframe>");
                var $clonedForm = $naviForm.clone(true);
                window._popUpManager.registerPopUp({
                    name: "ControllerActionModal" + modalOptions.mode,
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
                    onShowCallback: function () {
                        $clonedForm.appendTo($iframe.contents().find("body"));
                        $clonedForm.submit();
                    },
                    closeCallback: modalOptions.onClose
                });
                window._popUpManager.showPopUp("ControllerActionModal" + modalOptions.mode);
            }
            else {
                $naviForm.submit();
            }
        };
        Core.executeControllerActionNew = function (options) {
            if (options == null) {
                throw "Parameter 'options' cannot be null";
            }
            if (Joove.Common.stringIsNullOrEmpty(options.controller)) {
                throw "Parameter 'options.controller' must have a value";
            }
            if (Joove.Common.stringIsNullOrEmpty(options.action)) {
                throw "Parameter 'options.action' must have a value";
            }
            options.verb = (options.verb || "POST").toUpperCase();
            // Clone data before altering, for keeping ViewModel intact!
            var postData = options.postData || {};
            postData._isDirty = window._context.isDirty;
            // this means we execute an internal (=Submit) Action...
            // rulesInfo is not null only when we explicity request Rules Evaluation
            if (options.rulesInfo == null && options.verb !== "GET") {
                options.rulesInfo = window._ruleEngine.getServerRulesInfo(Joove.EvaluationTimes.OnSubmit);
                postData.rules = options.rulesInfo.info;
            }
            var getParameters = "";
            if (options.queryData != null && typeof options.queryData == "object") {
                for (var i = 0; i < options.queryData.length; i++) {
                    getParameters += "/" + options.queryData[i];
                }
            }
            var spamHelper = new Joove.SpamControlHelper(options.event);
            var onSuccess = function (data) {
                Core.handleServerResponse(options.controller, data, options.cb, options.rulesInfo, options.modalOptions, options.rootModelInfo);
            };
            var onError = function (data) {
                if (options.onErrorCb == null) {
                    if (Joove.FriendlyMessageGenerator.isHandledError(data.statusText)) {
                        data.responseText = Joove.FriendlyMessageGenerator.getAjaxErrorMessage(data.statusText);
                    }
                    Core.handleError(data);
                }
                else {
                    options.onErrorCb(data);
                }
            };
            Joove.Ajax.ajax({
                url: "" + window._context.siteRoot + options.controller + "/" + options.action + getParameters + "?" + Core.currentControllerActionParamName + "=" + window._context.currentAction + "&" + Core.isModalParamName + "=" + window._context.isModal,
                method: options.verb,
                ignoreQueue: options.ignoreQueue,
                data: postData,
                beforeSend: function () {
                    spamHelper.Disable();
                },
                complete: function () {
                    spamHelper.Enable();
                    window._performanceManager && window._performanceManager.send();
                },
                success: function (data) {
                    window._performanceManager && window._performanceManager.start(window._context.currentController, "_ExecuteControllerAction", options.controller + "/" + options.action + getParameters);
                    onSuccess(data);
                    window._performanceManager && window._performanceManager.stop(window._context.currentController, "_ExecuteControllerAction", options.controller + "/" + options.action + getParameters);
                },
                error: function (data) {
                    if (data != null && data.status == 200) {
                        onSuccess(data.responseText);
                    }
                    else {
                        onError(data);
                    }
                }
            });
        };
        //DEPRECATED: call Core.executeControllerActionNew
        Core.executeControllerAction = function (controller, action, verb, queryData, postData, threshold, cb, modalOptions, rulesInfo, onError) {
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
        };
        Core.prepareDataForFileAction = function ($element, model) {
            var projectionSchema = window[$element.attr("jb-id") + "_ProjectionScema"];
            if (projectionSchema != null) {
                //A Projection Schema exists. Lets use it!
                var projectionResult = Joove.Common.project(model, projectionSchema);
                return projectionResult;
            }
            else {
                //If you're here, no Projection Schema was found. We're gonna need to send almost everything                
                var clonedData = Joove.Common.cloneObject(model);
                var reducedData = Joove.Ajax.reduceViewModelData(clonedData);
                return reducedData;
            }
        };
        Core.uploadFile = function (options) {
            var data = new FormData();
            var clonnedModel = Joove.Common.cloneObject(options.model);
            //const decycledModel = Cycles.decycleObject(clonnedModel);
            //const serializedModel = JSON.stringify(decycledModel);
            var serializedModel = JSON.stringify(clonnedModel);
            for (var i = 0; i < options.files.length; i++) {
                data.append("files[]", options.files[i]);
            }
            data.append("model", serializedModel);
            data.append("indexes", options.indexesKey);
            var url = "";
            if (options.targetUrl == null) {
                var $partialView = Core.getPartialOwnerControlElement(options.$element);
                var controller = window._context.currentController;
                var action = "";
                if ($partialView.length > 0) {
                    action = Core.getPartialOwnerControl(options.$element);
                    data.append("actionName", Core.getElementName(options.$element) + "_Upload");
                    data.append("controlName", Core.getPartialOwnerControlElementId(options.$element));
                }
                else {
                    action = Core.getElementName(options.$element) + "_Upload";
                }
                var slash = '/';
                if (window._context.siteRoot.slice(-1) == '/') {
                    slash = '';
                }
                url = "" + window._context.siteRoot + slash + controller + "/" + action;
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
                processData: false,
                contentType: false,
                success: function (dataSuccess, textStatus, jqXhr) {
                    Session.ResetSessionExpirationTimeOut();
                    if (options.onSuccess) {
                        options.onSuccess(dataSuccess, textStatus, jqXhr);
                    }
                    // check if response contains model update...
                    if (dataSuccess.Type === "Data") {
                        Core.handleServerResponse(controller, dataSuccess);
                    }
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    if (options.onError) {
                        options.onError(jqXhr, textStatus, errorThrown);
                    }
                    console.error(jqXhr, textStatus, errorThrown);
                },
                complete: function (jqXhr, textStatus) {
                    if (options.onComplete) {
                        options.onComplete(jqXhr, textStatus);
                    }
                    if (options.withProgressBar !== false) {
                        options.$progressBar.clear();
                    }
                },
                // Custom XMLHttpRequest
                xhr: function () {
                    var myXhr = $.ajaxSettings.xhr();
                    if (myXhr.upload && options.withProgressBar !== false) {
                        // For handling the progress of the upload
                        myXhr.upload.addEventListener("progress", function (event) {
                            if (event.lengthComputable) {
                                var percent = Math.floor(event.loaded * 100 / event.total);
                                options.$progressBar.update(percent);
                                // $progressBar.html(percent + "%");
                            }
                        }, false);
                    }
                    return myXhr;
                }
            });
        };
        Core.handleServerResponse = function (controller, data, cb, rulesInfo, modalOptions, rootModelInfo) {
            var afterRulesAppliedCb = null;
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
                        }
                        catch (e) {
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
                        Core.executeRedirectControllerAction(data.Controller, data.Action, data.Method, data.QueryParameters, data.PostParameters, modalOptions);
                    }
                    return;
                case "Data":
                    Core.updateViewModel(controller, data.Data, rootModelInfo);
                    window._ruleEngine.update(Joove.EvaluationTimes.OnChange, null, afterRulesAppliedCb);
                    if (cb && typeof cb === "function")
                        cb(data.Data);
                    break;
                case "ActionReturnValue":
                    Core.updateViewModel(controller, data.Data, rootModelInfo);
                    if (cb)
                        cb(data.Value);
                    break;
                case "Error":
                    Joove.FriendlyMessageGenerator.handleMessage(data);
                    break;
                case "UpdateInstance":
                    if (cb)
                        cb(data.Data);
                    window._ruleEngine.update(Joove.EvaluationTimes.OnChange, null, afterRulesAppliedCb);
                    break;
                case "RuleEvaluation":
                    afterRulesAppliedCb = cb;
                    if (rulesInfo != null) {
                        var parsed = JSON.parse(data.Data);
                        if (parsed.Model != null) {
                            Core.updateViewModel(controller, parsed, rootModelInfo);
                        }
                        // Apply server side evaluated rules results
                        window._ruleEngine.applyServerRulesResult(parsed.RuleEvaluations, rulesInfo);
                        // Invoke after rules applied Callback
                        if (afterRulesAppliedCb)
                            afterRulesAppliedCb();
                    }
                    break;
                case "Unauthorized":
                    alert("Unauthorized: TODO show appropriate message.");
                    break;
                default:
                    if (cb)
                        cb(data);
                    break;
            }
        };
        Core.handleError = function (data) {
            Joove.FriendlyMessageGenerator.handleMessage(data);
        };
        //rootModelInfo, it is not null for partial views, and contains info for each property of the partial view
        //if it is not null, instead of updating the whole model, we should only update properties from rootModelInfo
        //rootModelInfo: Dicstionary<string, string>, key is property name, value is property path
        Core.updateViewModel = function (formName, updatedViewModel, rootModelInfo) {
            window._performanceManager && window._performanceManager.start(window._context.currentController, "_UpdateViewModel");
            var scope = Core.getScope(formName);
            if (scope.model == null) {
                scope.model = {};
            }
            var viewDTO = typeof updatedViewModel === "string" ? JSON.parse(updatedViewModel) : updatedViewModel;
            //viewDTO.Model = new ReferencesReconstructor().reconstructReferences(viewDTO.Model);
            //viewDTO.Model = Cycles.reconstructObject(viewDTO.Model);
            if (viewDTO.IsOptimized !== true) {
                if (rootModelInfo != null) {
                    for (var p in rootModelInfo) {
                        if (rootModelInfo.hasOwnProperty(p) && p.indexOf("__InitialSelection") == -1) {
                            Core.assignModelPath(scope.model, rootModelInfo[p], viewDTO.Model[p]);
                        }
                    }
                }
                else {
                    // sync properties
                    if (viewDTO.Model == null && viewDTO.ClientResponse != null) {
                        Core.parseClientResponse(scope.model, viewDTO.ClientResponse);
                    }
                    else {
                        Core.syncProperties(scope.model, viewDTO.Model);
                    }
                }
                scope.model = scope.dehydrate();
                scope.model = new Joove.ReferencesReconstructor().reconstructReferences(scope.model);
            }
            else {
                //TODO: maybe this line isnt needed due to 
                scope.model = JSON.parse(JSON.stringify(scope.model));
                var context = new Joove.DTOHelper();
                context.fillDb = true;
                scope.model = scope.dehydrate(context);
                var updatedInstances = [];
                if (rootModelInfo != null) {
                    //TODO: handle partial views
                    for (var p in rootModelInfo) {
                        if (rootModelInfo.hasOwnProperty(p) && p.indexOf("__InitialSelection") == -1) {
                            Core.assignModelPath(scope.model, rootModelInfo[p], viewDTO.Model[p]);
                        }
                    }
                }
                else {
                    // sync properties
                    Core.syncPropertiesDeep(scope.model, viewDTO.Model, context.getDb(), updatedInstances);
                }
                scope.model = scope.dehydrate();
                scope.model = new Joove.ReferencesReconstructor(updatedInstances).reconstructReferences(scope.model);
            }
            Core.applyScope(scope);
            // Execute Client Commands
            window._commander.executeCommands(viewDTO.ClientCommands);
            // Clear Commands
            viewDTO.ClientCommands = [];
            window.viewDTO = viewDTO;
            //Copy all the model into the Master's Model
            if (window["scope_" + window._context.currentMasterPageController] && window["scope_" + window._context.currentMasterPageController].model) {
                window["scope_" + window._context.currentMasterPageController].model = scope.model;
            }
            window._performanceManager && window._performanceManager.stop(window._context.currentController, "_UpdateViewModel");
        };
        Core.parseClientResponse = function (model, responseItems) {
            for (var i = 0; i < responseItems.length; i++) {
                var item = responseItems[i];
                Core.nullSafeValueAssignToPath(item.Value, item.Path, model);
            }
        };
        Core.nullSafeValueAssignToPath = function (value, path, parent) {
            var parts = path.split(".");
            for (var i = 0; i < parts.length; i++) {
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
        };
        Core.syncProperties = function (left, right) {
            for (var p in right) {
                if (right.hasOwnProperty(p) && p.indexOf("__InitialSelection") == -1) {
                    left[p] = right[p];
                }
            }
        };
        Core.syncPropertiesDeep = function (left, right, db, fresh) {
            if (left == null) {
                left = {};
            }
            var dbKey = right._originalTypeClassName + "_" + right._key;
            var dbEntry = db[dbKey];
            var updatedProperties = right["_updatedProperties"] == null ? [] : right["_updatedProperties"];
            for (var p in right) {
                if (!right.hasOwnProperty(p) || p.indexOf("__InitialSelection") != -1) {
                    continue;
                }
                var shouldKeepServersVersion = p[0] == "_" || p[0] == "$" ||
                    dbEntry == null || dbEntry[p] === undefined ||
                    updatedProperties.indexOf(p) != -1;
                if (Joove.Common.isArray(right[p])) {
                    if (left[p] == null) {
                        left[p] = [];
                    }
                    if (right[p] != null && left[p].length > right[p].length) { //length decreased
                        var itemsToRemove = left[p].length - right[p].length;
                        left[p].splice(right[p].length, itemsToRemove);
                    }
                    for (var i = 0; i < right[p].length; i++) {
                        if (left[p].length <= i) {
                            if (right[p][i] == null || Joove.Common.valueIsPrimitive(right[p][i])) {
                                left[p].push(right[p][i]);
                            }
                            else {
                                var newArrayItem = {};
                                this.syncPropertiesDeep(newArrayItem, right[p][i], db, fresh);
                                left[p].push(newArrayItem);
                            }
                        }
                        else {
                            this.syncPropertiesDeep(left[p][i], right[p][i], db, fresh);
                        }
                    }
                }
                if (Joove.Common.valueIsObject(right[p])) {
                    if (shouldKeepServersVersion) {
                        fresh.push(left[p]);
                    }
                    else if (db[dbKey][p] === null) {
                        left[p] = null;
                        continue;
                    }
                    this.syncPropertiesDeep(left[p], right[p], db, fresh);
                }
                else { // Primitiive
                    left[p] = shouldKeepServersVersion ? right[p] : dbEntry[p];
                }
            }
        };
        Core.getScope = function (formName) {
            return window._context.currentMasterPageController === formName
                ? Joove.Common.getMasterScope()
                : Joove.Common.getScope();
        };
        Core.getModel = function (formName) {
            return window._context.currentMasterPageController === formName
                ? Joove.Common.getMasterModel()
                : Joove.Common.getModel();
        };
        /* NOTE: This change was made to give more time for the page to load and find the according elements.
         *       If the page is big in size the JQuery selector in function Core.getPartialByName will not return
         *       any elements and no ColumnInfo will be actually registered.
         *
         *       k.filippakos */
        //@timeout(2000)
        Core.registerPartialColumnInfo = function (partialName, controlName, info, context) {
            var MAX_RETRIES = 20;
            var INTERVAL = 500;
            var retries = 0;
            var stateCheck = setInterval(function () {
                var elements = Core.getPartialByName(partialName, context);
                if (elements.length > 0 || retries >= MAX_RETRIES) {
                    if (elements.length == 0) {
                        console.log("ERROR: Registering partial columns for control '" + controlName + "' did not find partial element after " + (MAX_RETRIES * INTERVAL) + "ms.");
                    }
                    else {
                        console.log("REGISTRED!");
                    }
                    clearInterval(stateCheck);
                    elements.each(function (index, elem) {
                        var element = $(elem);
                        var partialName = element.attr('jb-id');
                        window[partialName + "_" + controlName + "_ColumnInfo"] = info;
                    });
                }
                else {
                    retries++;
                }
            }, INTERVAL);
        };
        Core.unRegisterPartialColumnInfo = function (partialName, controlName, context) {
            var elements = Core.getPartialByName(partialName, context);
            elements.each(function (index, elem) {
                var element = $(elem);
                var partialName = element.attr('jb-id');
                delete window[partialName + "_" + controlName + "_ColumnInfo"];
            });
        };
        Core.getPartialByName = function (name, context) {
            var elements = (context == null) ? $("[jb-partial-name=\"" + name + "\"]") : context.find("[jb-partial-name=\"" + name + "\"]");
            return elements;
        };
        Core.getPartialModelValue = function (name, pathInPartial, $context) {
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
            return eval("Joove.Common.getModel()." + pathInPartial);
        };
        Core.getPartialOwnerControlElement = function ($control) {
            return $control.closest("[jb-type='PartialView']");
        };
        Core.getPartialOwnerControlElementId = function ($control) {
            return Core.getPartialOwnerControlElement($control).attr("jb-id");
        };
        Core.getPartialOwnerControl = function ($control) {
            return Core.getPartialOwnerControlElement($control).attr("jb-partial-name");
        };
        Core.getPartialViewControlOriginalName = function ($control) {
            var fullName = $control.attr("jb-id");
            var $partialViewControl = Core.getPartialOwnerControlElement($control);
            if ($partialViewControl.length === 0)
                return null;
            var partialControlName = Core.getPartialOwnerControlElementId($control);
            if (fullName.indexOf(partialControlName) !== 0)
                return null;
            return fullName.substring(partialControlName.length);
        };
        Core.getPartialControlModelInfo = function ($control) {
            var $partialViewControl = Core.getPartialOwnerControlElement($control);
            if ($partialViewControl.length === 0)
                return null;
            return JSON.parse($partialViewControl.attr("jb-partial-model"));
        };
        Core.getRootModelForControl = function ($control, forMasterPage) {
            var model = forMasterPage
                ? Joove.Common.getMasterModel()
                : Joove.Common.getModel();
            var $partialViewControl = Core.getPartialOwnerControlElement($control);
            if ($partialViewControl.length > 0) {
                var newModel = {};
                var modelInfo = Core.getPartialControlModelInfo($control);
                for (var prop in modelInfo) {
                    if (modelInfo.hasOwnProperty(prop)) {
                        var modelPath = modelInfo[prop];
                        newModel[prop] = Core.evaluateModelPath(model, modelPath);
                    }
                }
                //try to restore SelectedItemKeys
                var partialControlName = $partialViewControl.attr("jb-id");
                for (var prop in model) {
                    if (model.hasOwnProperty(prop)) {
                        if (prop.indexOf(partialControlName) === 0 && prop.indexOf("SelectedItemKeys") !== -1) {
                            var fixedName = prop.replace(partialControlName, "");
                            newModel[fixedName] = model[prop];
                        }
                    }
                }
                model = newModel;
            }
            return model;
        };
        Core.evaluateModelPath = function (root, path) {
            if (path.indexOf("model.") === -1) {
                throw "Partial views inside context are not yet supported";
            }
            path = path.substring("model.".length);
            var splitted = path.split(".");
            for (var i = 0; i < splitted.length; i++) {
                root = root[splitted[i]];
                if (root == null) {
                    break;
                }
            }
            return root;
        };
        Core.assignModelPath = function (root, path, value) {
            var prevValue = Core.evaluateModelPath(root, path);
            Core.syncProperties(prevValue, value);
        };
        Core.getControllerForElement = function ($element, forMasterPage) {
            var $partialViewControl = $element.closest("[jb-type='PartialView']");
            if ($partialViewControl.length > 0) {
                return $partialViewControl.attr("jb-partial-name");
            }
            return forMasterPage
                ? window._context.currentMasterPageController
                : window._context.currentController;
        };
        Core.GetServerSideElementNameFromId = function (name, context) {
            var element = $$$(name, context);
            return Core.GetServerSideElementName(element);
        };
        Core.GetServerSideElementName = function ($element) {
            var partial = Core.getPartialOwnerControlElement($element);
            if (partial.length == 0) {
                return Core.getElementName($element);
            }
            return "" + Core.getElementName($element);
        };
        Core.GetElementNameFromId = function (name, context) {
            var $element = $$$(name, context);
            return Core.GetClientSideName($element);
        };
        Core.GetClientSideName = function ($element) {
            var partial = Core.getPartialOwnerControlElement($element);
            if (partial.length == 0) {
                return Core.getElementName($element);
            }
            var partialName = partial.attr("jb-id");
            return partialName + "_" + Core.getElementName($element);
        };
        Core.getElementName = function ($element) {
            var name = $element.attr("jb-id");
            var $partialViewControl = $element.closest("[jb-type='PartialView']");
            if ($partialViewControl.length > 0) {
                return name.replace($partialViewControl.attr("jb-id"), "");
            }
            return name;
        };
        Core.applyScope = function ($scope, immediate) {
            if ($scope == null)
                $scope = Joove.Common.getScope();
            clearTimeout(Core._scopeApplicationTimeout);
            if (immediate === true) {
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            }
            else {
                Core._scopeApplicationTimeout = setTimeout(function () {
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                }, 10);
            }
        };
        Core.onChange = function (element, newValue, dontMakeDirty) {
            if (Joove.Validation.Bindings.gridIsBoundToValidationsSummary(element) === true)
                return;
            var exceptionForIE = typeof (Event) !== 'function';
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
            setTimeout(function () {
                if ((element.tagName != null) && (element.tagName.toLowerCase() !== "table" && element.tagName.toLocaleLowerCase() !== "img")) {
                    var $element = $(element);
                    newValue = newValue || $element.val();
                    if ($(element).attr("jb-type") === "CheckBox") {
                        newValue = $(element).is(":checked");
                    }
                    var oldValue = Core.elementData($element, "old-value");
                    if (newValue === oldValue)
                        return;
                    Core.elementData($element, "old-value", newValue);
                }
                Joove.Validation.UiHelper.updateEmptyRequiredFieldsState(Joove.Validation.UiHelper.lastEvaluatedValidationGroups, false);
                window._ruleEngine.update(Joove.EvaluationTimes.OnChange).then(function () {
                    setTimeout(function () {
                        Joove.Validation.UiHelper.markDataValidationRelatedControls(true);
                    }, 50);
                });
                // Callbacks
                for (var i = 0; i < Core._onChangeCallBacks.length; i++) {
                    Core._onChangeCallBacks[i]();
                }
            }, 50);
        };
        Core.elementData = function ($element, prop, value) {
            var indexes = Joove.Common.getIndexesOfControl($element).key;
            var key = $element.attr("jb-id") + indexes + "[data]";
            if (value !== undefined) {
                Core._megaDictionary[key] = value;
            }
            return Core._megaDictionary[key];
        };
        Core.setBoClassPropertyFromInstance = function (propertyName, instance, valueToSet) {
            var classNameFull = instance._originalTypeClassName;
            if (classNameFull == null) {
                console.warn("Could not find full class name on instance!", instance);
                return;
            }
            var nameParts = classNameFull.split(".");
            var shortName = nameParts[nameParts.length - 1];
            Core.setBoClassProperty(shortName, propertyName, instance, valueToSet);
        };
        Core.setBoClassProperty = function (className, propertyName, instance, valueToSet) {
            var boClass = window["_appDomain"][className];
            if (boClass == null) {
                console.warn("Could not find BO class with name: " + className);
                return;
            }
            var method = boClass["set" + propertyName];
            if (method == null) {
                console.warn("Could not find set method in class with name: set" + propertyName + " in class " + className);
                if (instance != null) {
                    instance[propertyName] = valueToSet;
                }
                return;
            }
            method(instance, valueToSet);
        };
        Core._scopeApplicationTimeout = null;
        Core._onChangeCallBacks = [];
        Core.currentControllerActionParamName = "_currentControllerAction";
        Core.isModalParamName = "IsModal";
        Core._megaDictionary = {};
        __decorate([
            timeout(2000)
        ], Core, "unRegisterPartialColumnInfo", null);
        return Core;
    }());
    Joove.Core = Core;
    ;
    var ResponseData = /** @class */ (function () {
        function ResponseData() {
        }
        return ResponseData;
    }());
})(Joove || (Joove = {}));
