var Joove;
(function (Joove) {
    var FriendlyMessageDTO = /** @class */ (function () {
        function FriendlyMessageDTO() {
        }
        return FriendlyMessageDTO;
    }());
    Joove.FriendlyMessageDTO = FriendlyMessageDTO;
    var FriendlyMessage = /** @class */ (function () {
        function FriendlyMessage(dto) {
            this.dto = dto;
            if (this.dto.Entries == null)
                return;
            for (var i = 0; i < this.dto.Entries.length; i++) {
                FriendlyMessageEntryDTO.enchance(this.dto.Entries[i]);
            }
        }
        return FriendlyMessage;
    }());
    Joove.FriendlyMessage = FriendlyMessage;
    var FriendlyMessageEntryDTO = /** @class */ (function () {
        function FriendlyMessageEntryDTO() {
        }
        FriendlyMessageEntryDTO.enchance = function (dto) {
            FriendlyMessageGenerator.initDict();
            var dictionaryEntry = FriendlyMessageGenerator.SemanticsDictionary[dto.AppdevSemantic.toString()];
            dto.friendlyMessage = dictionaryEntry.FriendlyMessage;
            dto.icon = dictionaryEntry.Icon;
        };
        return FriendlyMessageEntryDTO;
    }());
    Joove.FriendlyMessageEntryDTO = FriendlyMessageEntryDTO;
    var SemanticCollection = /** @class */ (function () {
        function SemanticCollection(msg, icon) {
            if (icon === void 0) { icon = "default"; }
            this.FriendlyMessage = msg;
            this.Icon = icon;
        }
        return SemanticCollection;
    }());
    Joove.SemanticCollection = SemanticCollection;
    var AppDevSemantic;
    (function (AppDevSemantic) {
        AppDevSemantic[AppDevSemantic["None"] = 0] = "None";
        AppDevSemantic[AppDevSemantic["CalculatedExpression"] = 1] = "CalculatedExpression";
        AppDevSemantic[AppDevSemantic["CondionalFormating"] = 2] = "CondionalFormating";
        AppDevSemantic[AppDevSemantic["ControllerAction"] = 3] = "ControllerAction";
        AppDevSemantic[AppDevSemantic["Form"] = 4] = "Form";
        AppDevSemantic[AppDevSemantic["Logic"] = 5] = "Logic";
        AppDevSemantic[AppDevSemantic["ControllerActionEntry"] = 6] = "ControllerActionEntry";
        AppDevSemantic[AppDevSemantic["ControllerActionImplementation"] = 7] = "ControllerActionImplementation";
        AppDevSemantic[AppDevSemantic["Datasource"] = 8] = "Datasource";
        AppDevSemantic[AppDevSemantic["DataSourceDataBinding"] = 9] = "DataSourceDataBinding";
        AppDevSemantic[AppDevSemantic["DataSourceGetFullRecordset"] = 10] = "DataSourceGetFullRecordset";
        AppDevSemantic[AppDevSemantic["DataSourceEntryPoint"] = 11] = "DataSourceEntryPoint";
        AppDevSemantic[AppDevSemantic["DataSourceFilter"] = 12] = "DataSourceFilter";
        AppDevSemantic[AppDevSemantic["DataSourceGroupBy"] = 13] = "DataSourceGroupBy";
        AppDevSemantic[AppDevSemantic["DataSourceDataAccess"] = 14] = "DataSourceDataAccess";
        AppDevSemantic[AppDevSemantic["DataSourceGrid"] = 15] = "DataSourceGrid";
        AppDevSemantic[AppDevSemantic["DataSourceGridEntry"] = 16] = "DataSourceGridEntry";
        AppDevSemantic[AppDevSemantic["DataSourceAggregators"] = 17] = "DataSourceAggregators";
        AppDevSemantic[AppDevSemantic["DataValidation"] = 18] = "DataValidation";
        AppDevSemantic[AppDevSemantic["DataValidationCondition"] = 19] = "DataValidationCondition";
        AppDevSemantic[AppDevSemantic["DataValidationMesage"] = 20] = "DataValidationMesage";
        AppDevSemantic[AppDevSemantic["ConditionalFormatting"] = 21] = "ConditionalFormatting";
        AppDevSemantic[AppDevSemantic["ConditionalFormattingEvaluation"] = 22] = "ConditionalFormattingEvaluation";
        AppDevSemantic[AppDevSemantic["ControlOnChangeAction"] = 23] = "ControlOnChangeAction";
        AppDevSemantic[AppDevSemantic["ControllerEntryPoint"] = 24] = "ControllerEntryPoint";
        AppDevSemantic[AppDevSemantic["CalculatedExpressionValueMethod"] = 25] = "CalculatedExpressionValueMethod";
    })(AppDevSemantic = Joove.AppDevSemantic || (Joove.AppDevSemantic = {}));
    var FriendlyMessageGenerator = /** @class */ (function () {
        function FriendlyMessageGenerator() {
        }
        FriendlyMessageGenerator.initDict = function () {
            if (this.SemanticsDictionary != null)
                return;
            this.SemanticsDictionary = {};
            this.SemanticsDictionary[AppDevSemantic[AppDevSemantic.None]] = new SemanticCollection("", ""); //katia
            this.SemanticsDictionary[AppDevSemantic[AppDevSemantic.CalculatedExpression]] = new SemanticCollection("Calculated Expression", "glyphicon glyphicon-text-background");
            this.SemanticsDictionary[AppDevSemantic[AppDevSemantic.CondionalFormating]] = new SemanticCollection("Conditional Formatting", "glyphicon glyphicon-pencil");
            this.SemanticsDictionary[AppDevSemantic[AppDevSemantic.ControllerAction]] = new SemanticCollection("Controller Action", "glyphicon glyphicon-random");
            this.SemanticsDictionary[AppDevSemantic[AppDevSemantic.Form]] = new SemanticCollection("Form", "glyphicon glyphicon-modal-window");
            this.SemanticsDictionary[AppDevSemantic[AppDevSemantic.Logic]] = new SemanticCollection("Logic", "glyphicon glyphicon-retweet");
            this.SemanticsDictionary[AppDevSemantic[AppDevSemantic.ControllerActionEntry]] = new SemanticCollection("Controller Action Entry", "glyphicon glyphicon-log-in");
            this.SemanticsDictionary[AppDevSemantic[AppDevSemantic.ControllerActionImplementation]] = new SemanticCollection("Controller Action Implementation", "glyphicon glyphicon-indent-left");
            this.SemanticsDictionary[AppDevSemantic[AppDevSemantic.Datasource]] = new SemanticCollection("Data Set", "glyphicon glyphicon-tasks");
            this.SemanticsDictionary[AppDevSemantic[AppDevSemantic.DataSourceDataBinding]] = new SemanticCollection("Data Set Binding", "glyphicon glyphicon-tasks");
            this.SemanticsDictionary[AppDevSemantic[AppDevSemantic.DataSourceGetFullRecordset]] = new SemanticCollection("Data Set Get Full Record Set", "glyphicon glyphicon-tasks");
            this.SemanticsDictionary[AppDevSemantic[AppDevSemantic.DataSourceEntryPoint]] = new SemanticCollection("Data Set Entry Point", "glyphicon glyphicon-log-in");
            this.SemanticsDictionary[AppDevSemantic[AppDevSemantic.DataSourceFilter]] = new SemanticCollection("Data Set Filter", "glyphicon glyphicon-filter");
            this.SemanticsDictionary[AppDevSemantic[AppDevSemantic.DataSourceGroupBy]] = new SemanticCollection("Data Set GroupBy", "glyphicon glyphicon-duplicate");
            this.SemanticsDictionary[AppDevSemantic[AppDevSemantic.DataSourceDataAccess]] = new SemanticCollection("Data Set Data Access", "glyphicon glyphicon-equalizer");
            this.SemanticsDictionary[AppDevSemantic[AppDevSemantic.DataSourceGrid]] = new SemanticCollection("Data Set Grid", "glyphicon glyphicon-list");
            this.SemanticsDictionary[AppDevSemantic[AppDevSemantic.DataSourceGridEntry]] = new SemanticCollection("Data Set Grid Entry", "glyphicon glyphicon-list");
            this.SemanticsDictionary[AppDevSemantic[AppDevSemantic.DataSourceAggregators]] = new SemanticCollection("Data Source Aggregators", "glyphicon glyphicon-sort-by-attributes");
            this.SemanticsDictionary[AppDevSemantic[AppDevSemantic.DataValidation]] = new SemanticCollection("Data Validation", "glyphicon glyphicon-ok");
            this.SemanticsDictionary[AppDevSemantic[AppDevSemantic.DataValidationCondition]] = new SemanticCollection("Data Validation Condition", "glyphicon glyphicon-saved");
            this.SemanticsDictionary[AppDevSemantic[AppDevSemantic.DataValidationMesage]] = new SemanticCollection("Data  Validation Message", "glyphicon glyphicon-comment");
            this.SemanticsDictionary[AppDevSemantic[AppDevSemantic.ConditionalFormatting]] = new SemanticCollection("Conditional Formatting", "glyphicon glyphicon-pencil");
            this.SemanticsDictionary[AppDevSemantic[AppDevSemantic.ConditionalFormattingEvaluation]] = new SemanticCollection("Conditional Formatting Evaluation", "glyphicon glyphicon-refresh");
            this.SemanticsDictionary[AppDevSemantic[AppDevSemantic.ControlOnChangeAction]] = new SemanticCollection("Control OnChange Action", "glyphicon glyphicon-flash");
            this.SemanticsDictionary[AppDevSemantic[AppDevSemantic.ControllerEntryPoint]] = new SemanticCollection("Controller Entry Point", "glyphicon glyphicon-log-in");
            this.SemanticsDictionary[AppDevSemantic[AppDevSemantic.CalculatedExpressionValueMethod]] = new SemanticCollection("Calculated Expression Value Method", "glyphicon glyphicon-text-size");
        };
        FriendlyMessageGenerator.isHandledError = function (errorType) {
            if (errorType == null || !errorType.trim || errorType.trim() == "") {
                return false;
            }
            errorType = errorType.toLowerCase().trim();
            if ((errorType == "timeout") || (errorType == "error") || (errorType == "abort") || (errorType == "parsererror")) {
                return true;
            }
            return false;
        };
        FriendlyMessageGenerator.getMessageStringForAjaxError = function (errorType, errorAs) {
            var defaultTitle = "Error";
            var defaultMessage = "Caught an unknown error, while communicating with the Server.";
            var resource = "";
            switch (errorType.toLowerCase().trim()) {
                case "timeout":
                    resource = "Timeout";
                    break;
                case "abort":
                    resource = "Abort";
                    break;
                case "parsererror":
                    resource = "Parser";
                    break;
                default:
                    resource = "Generic";
                    break;
            }
            var resourceKey = "RES_CONTROLLER_ACTION_" + resource + "Error" + errorAs;
            var message = window.$form.$resGlobal(resourceKey);
            if (message == null || message == "") {
                switch (errorAs) {
                    case "Title":
                        return defaultTitle;
                    case "Message":
                        return defaultMessage;
                    default:
                        return "";
                }
            }
            return message;
        };
        FriendlyMessageGenerator.getAjaxErrorMessage = function (errorType) {
            var title = FriendlyMessageGenerator.getMessageStringForAjaxError("", "Title");
            var message = FriendlyMessageGenerator.getMessageStringForAjaxError("", "Message");
            if (errorType) {
                title = FriendlyMessageGenerator.getMessageStringForAjaxError(errorType.toLowerCase().trim(), "Title");
                message = FriendlyMessageGenerator.getMessageStringForAjaxError(errorType.toLowerCase().trim(), "Message");
            }
            var result = {
                Type: 'Error',
                Data: JSON.stringify({
                    Title: title,
                    OriginalExceptionMessage: message
                })
            };
            return JSON.stringify(result);
        };
        FriendlyMessageGenerator.getMessageObject = function (data) {
            try {
                var content = Joove.Common.modelToJson(data.responseText);
                var dto = JSON.parse(content.Data);
                return new FriendlyMessage(dto);
            }
            catch (e) {
                console.error("Could not parse Exception Message Object!", e);
                return new FriendlyMessage({
                    Entries: [],
                    ExceptionType: "Unknown",
                    OriginalExceptionMessage: "",
                    OriginalStackTrace: "",
                    Title: ""
                });
            }
        };
        FriendlyMessageGenerator.showPopUp = function (msg, errorPageURL) {
            if (errorPageURL === void 0) { errorPageURL = ""; }
            var htmlContent = "";
            var list = "";
            // Message Title
            if (msg.dto.Title != null && msg.dto.Title.trim() !== "") {
                htmlContent += "<div class=\"row\"><h4>" + msg.dto.Title + "</h4></div>";
            }
            if (window._context.mode === "Development") {
                // Original Error Message
                //htmlContent += `<div class="row"><p id="OriginalMessage"><i>${msg.dto.OriginalExceptionMessage}</i></p></div></br>`;
                // zAppDev Semantic Entries
                if (msg.dto.Entries != null) {
                    for (var i = 0; i < msg.dto.Entries.length; i++) {
                        var heading = "";
                        if (msg.dto.Entries[i].icon != null && msg.dto.Entries[i].icon.trim() !== "") {
                            heading += "<span style=\"margin-right: 5px\" class=\"" + msg.dto.Entries[i].icon + "\"></span>";
                        }
                        if (msg.dto.Entries[i].friendlyMessage != null && msg.dto.Entries[i].friendlyMessage.trim() !== "") {
                            heading += "<span>" + msg.dto.Entries[i].friendlyMessage + "</span>: ";
                        }
                        list += "<li class=\"list-group-item\">" + heading + "<b>" + msg.dto.Entries[i].AppdevIdentifier + "</b></li>";
                    }
                    htmlContent += "<ul id=\"errorlist\" class=\"list-group\">" + list + "</ul>";
                }
                console.log(msg.dto.OriginalExceptionMessage, msg.dto.OriginalStackTrace, msg.dto);
            }
            // Contanct Admin Propmt, only if the Exception is not a BusinessException
            var exceptionType = msg.dto.ExceptionType;
            if (exceptionType && exceptionType.toLowerCase && exceptionType.toLowerCase() != "businessexception"
                && exceptionType.toLowerCase() != "constraintexception"
                && exceptionType.toLocaleLowerCase() != "staleobjectstateexception") {
                if (errorPageURL != null && errorPageURL.trim() !== "") {
                    htmlContent += "<div class=\"row\"><p>If this error persists, please <a href=\"" + errorPageURL + "\" target=\"_blank\">contact Administrator</a></p></div>";
                }
                else {
                    htmlContent += '<div class="row"><p>If this error persists, please contact Administrator</p></div>';
                }
            }
            window._popUpManager.error(window._resourcesManager.getGlobalResource("RES_WEBFORM_GenericErrorTitle"), htmlContent);
        };
        FriendlyMessageGenerator.errorIsHtml = function (serializedError) {
            return serializedError != null &&
                serializedError.responseText != null &&
                serializedError.responseText.trim().toLowerCase().indexOf("<!doctype html>") == 0;
        };
        FriendlyMessageGenerator.displayHtmlError = function (serializedError, fullscreeen) {
            var html = serializedError.responseText;
            if (fullscreeen === true) {
                document.open();
                document.write(html);
                document.close();
            }
            else {
                window._popUpManager.error("Request Error", "See console for details");
                $("body").show();
                console.log(html);
            }
        };
        FriendlyMessageGenerator.handleMessage = function (serializedError) {
            var formHasLoaded = document.body.style.display === "none";
            if (FriendlyMessageGenerator.errorIsHtml(serializedError) === true) {
                FriendlyMessageGenerator.displayHtmlError(serializedError, formHasLoaded);
                return;
            }
            var content = Joove.Common.modelToJson(serializedError.responseText);
            var redirectURL = window._context.siteRoot + content.RedirectURL;
            var errorForcesRedirection = formHasLoaded === true && content.RedirectURL != null;
            if (errorForcesRedirection === true) {
                window.location.href = redirectURL;
                return;
            }
            this.initDict();
            var msg;
            try {
                msg = this.getMessageObject(serializedError);
            }
            catch (ex) {
                var dto = new FriendlyMessageDTO();
                dto.OriginalExceptionMessage = serializedError;
                msg = new FriendlyMessage(dto);
            }
            var exceptionType = msg.dto.ExceptionType;
            if (exceptionType && exceptionType.toLowerCase && (exceptionType.toLowerCase() == "validationexception")) {
                var rule = new Joove.JbRule({ name: "Dummy", group: "_ValidationException_" });
                Joove.Validation.Bindings.refresh(rule, msg.dto.OriginalExceptionMessage, true, new Array());
            }
            else {
                this.showPopUp(msg, redirectURL);
            }
        };
        FriendlyMessageGenerator.SemanticsDictionary = null;
        return FriendlyMessageGenerator;
    }());
    Joove.FriendlyMessageGenerator = FriendlyMessageGenerator;
})(Joove || (Joove = {}));
