﻿namespace Joove {

    export class FriendlyMessageDTO {
        Title: string; 
        OriginalStackTrace?: string;
        OriginalExceptionMessage: string;
        ExceptionType?: string;
        Entries?: Array<FriendlyMessageEntryDTO>;
    }

    export class FriendlyMessage {
        constructor(dto: FriendlyMessageDTO) {
            this.dto = dto;

            if (this.dto.Entries == null) return;

            for (let i = 0; i < this.dto.Entries.length; i++) {
                FriendlyMessageEntryDTO.enchance(this.dto.Entries[i]);
            }
        }

        dto: FriendlyMessageDTO;
    }

    export class FriendlyMessageEntryDTO {
        // As deserialized
        AppdevIdentifier: string;
        AppdevSemantic: string;

        // Filled client side
        icon: string;
        friendlyMessage: string;

        public static enchance(dto: FriendlyMessageEntryDTO) {
            FriendlyMessageGenerator.initDict();
            const dictionaryEntry = FriendlyMessageGenerator.SemanticsDictionary[dto.AppdevSemantic.toString()];

            dto.friendlyMessage = dictionaryEntry.FriendlyMessage;
            dto.icon = dictionaryEntry.Icon;
        }
    }

    export class SemanticCollection {
        FriendlyMessage: string;
        Icon: string;

        constructor(msg: string, icon = "default") {
            this.FriendlyMessage = msg;
            this.Icon = icon;
        }
    }

    export enum AppDevSemantic {
        None = 0,
        CalculatedExpression,
        CondionalFormating,
        ControllerAction,
        Form,
        Logic,
        ControllerActionEntry,
        ControllerActionImplementation,
        Datasource,
        DataSourceDataBinding,
        DataSourceGetFullRecordset,
        DataSourceEntryPoint,
        DataSourceFilter,
        DataSourceGroupBy,
        DataSourceDataAccess,
        DataSourceGrid,
        DataSourceGridEntry,
        DataSourceAggregators,
        DataValidation,
        DataValidationCondition,
        DataValidationMesage,
        ConditionalFormatting,
        ConditionalFormattingEvaluation,
        ControlOnChangeAction,
        ControllerEntryPoint,
        CalculatedExpressionValueMethod
    }

    export class FriendlyMessageGenerator {
        public static SemanticsDictionary: { [index: string]: SemanticCollection; } = null;

        public static initDict() {
            if (this.SemanticsDictionary != null) return;

            this.SemanticsDictionary = {};
            this.SemanticsDictionary[AppDevSemantic[AppDevSemantic.None]] = new SemanticCollection("", "");//katia
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
        }

        public static isHandledError(errorType: string):boolean {
            if (errorType == null || !errorType.trim || errorType.trim() == "") {
                return false;
            }
            errorType = errorType.toLowerCase().trim();
            if ((errorType == "timeout") || (errorType == "error") || (errorType == "abort") || (errorType == "parsererror")) {
                return true;
            }
            return false;
        }

        private static getMessageStringForAjaxError(errorType: string, errorAs: string): string {
            let defaultTitle = "Error";
            let defaultMessage = "Caught an unknown error, while communicating with the Server.";

            let resource = "";
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
                    resource = "Generic"
                    break;
            }

            let resourceKey = `RES_CONTROLLER_ACTION_${resource}Error${errorAs}`;
            let message = window.$form.$resGlobal(resourceKey);

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
        }

        public static getAjaxErrorMessage(errorType: string): string {
            let title = FriendlyMessageGenerator.getMessageStringForAjaxError("", "Title");
            let message = FriendlyMessageGenerator.getMessageStringForAjaxError("", "Message");

            if (errorType) {
                title = FriendlyMessageGenerator.getMessageStringForAjaxError(errorType.toLowerCase().trim(), "Title");
                message = FriendlyMessageGenerator.getMessageStringForAjaxError(errorType.toLowerCase().trim(), "Message");
            }

            let result = {
                Type: 'Error', 
                Data: JSON.stringify({
                    Title: title,
                    OriginalExceptionMessage: message
                })
            }
            return JSON.stringify(result);
        }

        private static getMessageObject(data: any): FriendlyMessage {
            try {
                const content = <any>Common.modelToJson(data.responseText);
                const dto = JSON.parse(content.Data);

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
        }

        public static showPopUp(msg: FriendlyMessage, errorPageURL: string = "") {
            let htmlContent = "";

            let list = "";            

            // Message Title
            if (msg.dto.Title != null && msg.dto.Title.trim() !== "") {
                htmlContent += `<div class="row"><h4>${msg.dto.Title}</h4></div>`;                
            }
           
            if (window._context.mode === "Development") {
                // Original Error Message
                //htmlContent += `<div class="row"><p id="OriginalMessage"><i>${msg.dto.OriginalExceptionMessage}</i></p></div></br>`;

                // zAppDev Semantic Entries
                if (msg.dto.Entries != null) {
                    for (let i = 0; i < msg.dto.Entries.length; i++) {
                        let heading = "";
                        if (msg.dto.Entries[i].icon != null && msg.dto.Entries[i].icon.trim() !== "") {
                            heading += `<span style="margin-right: 5px" class="${msg.dto.Entries[i].icon}"></span>`;
                        }
                        if (msg.dto.Entries[i].friendlyMessage != null && msg.dto.Entries[i].friendlyMessage.trim() !== "") {
                            heading += `<span>${msg.dto.Entries[i].friendlyMessage}</span>: `;
                        }
                        list += `<li class="list-group-item">${heading}<b>${msg.dto.Entries[i].AppdevIdentifier}</b></li>`;
                    }

                    htmlContent += `<ul id="errorlist" class="list-group">${list}</ul>`;
                }                
               
                console.log(msg.dto.OriginalExceptionMessage, msg.dto.OriginalStackTrace, msg.dto);
            }
			
			// Contanct Admin Propmt, only if the Exception is not a BusinessException
            let exceptionType = msg.dto.ExceptionType;
            if (exceptionType && exceptionType.toLowerCase && exceptionType.toLowerCase() != "businessexception" 
                && exceptionType.toLowerCase() != "constraintexception"
                && exceptionType.toLocaleLowerCase() != "staleobjectstateexception") {
                
                    if (errorPageURL != null && errorPageURL.trim() !== "") {
                    htmlContent += `<div class="row"><p>If this error persists, please <a href="${errorPageURL}" target="_blank">contact Administrator</a></p></div>`;
                }
                else {
                    htmlContent += '<div class="row"><p>If this error persists, please contact Administrator</p></div>';
                } 
            } 
			
            window._popUpManager.error(window._resourcesManager.getGlobalResource("RES_WEBFORM_GenericErrorTitle"), htmlContent);            
        }

        private static errorIsHtml(serializedError: any): boolean {
            return serializedError != null &&
                serializedError.responseText != null &&
                serializedError.responseText.trim().toLowerCase().indexOf("<!doctype html>") == 0;
        }

        private static displayHtmlError(serializedError: any, fullscreeen: boolean) {
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
        }
       
        public static handleMessage(serializedError: any) {
            const formHasLoaded = document.body.style.display === "none";

            if (FriendlyMessageGenerator.errorIsHtml(serializedError) === true) {
                FriendlyMessageGenerator.displayHtmlError(serializedError, formHasLoaded);
                return;
            }
            
         
            const content = Common.modelToJson(serializedError.responseText) as any;
            const redirectURL = window._context.siteRoot + content.RedirectURL;
            const errorForcesRedirection = formHasLoaded === true && content.RedirectURL != null;

            if (errorForcesRedirection === true) {                
                window.location.href = redirectURL;
                return;
            }
        	
            this.initDict();

            let msg: FriendlyMessage;

            try {
                msg = this.getMessageObject(serializedError);
            }
            catch (ex) {
                const dto = new FriendlyMessageDTO();
                dto.OriginalExceptionMessage = serializedError;

                msg = new FriendlyMessage(dto);
            }
            let exceptionType = msg.dto.ExceptionType;
            if (exceptionType && exceptionType.toLowerCase && (exceptionType.toLowerCase() == "validationexception")) {
                let rule = new JbRule({ name: "Dummy", group: "_ValidationException_" });
                Joove.Validation.Bindings.refresh(rule, msg.dto.OriginalExceptionMessage, true, new Array<number>());
            } else {
                this.showPopUp(msg, redirectURL);
            }
        }
    }
}