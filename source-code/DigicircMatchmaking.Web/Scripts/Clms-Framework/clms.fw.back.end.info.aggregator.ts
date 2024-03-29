﻿namespace Joove {

    export class BackEndInformationAggregator {

        private _masterPageEntryPoint: string;
        private _maximumModelSizeInMB: 3;
        private cmdStack: Array<(status: JQueryXHR | null) => void> = [];

        public running: boolean;

        constructor(masterPageEntryPoint: string) {
            this._masterPageEntryPoint = masterPageEntryPoint;
        }

        private checkSize(data: any) {
            var sizeInBytes = CLMS.Framework.Utilities.SizeOf(data);
            var sizeInMB = ((sizeInBytes / (1024 * 1024)));
            if (sizeInMB >= this._maximumModelSizeInMB) {
                console.error(`Received a very large object: ${sizeInMB.toFixed(2)} MB. Consider optimizing your Form Model.`);
            }
        }

        get(forMaster: boolean, options?: JQueryAjaxSettings) {
            var self = this;
            self.running = true;

            let controller = window._context.currentController;
            let action = window._context.currentAction;

            if (forMaster === true) {
                controller = window._context.currentMasterPageController;
                action = self._masterPageEntryPoint;
            }

            let query = window._context.urlQuery;
            
            if (window._context.isModal === true) {
                if (query.indexOf("?") == -1) {
                    query += "?";
                }
                else {
                    query += "&";
                }

                query += `${Core.isModalParamName}=true`;       
            }

            $.ajax({
                url: `${window._context.siteRoot}${controller}/_API_${action}${query}`,
                type: "GET",
                cache: false,
                success: (data: any, textStatus: string, jqXhr: JQueryXHR) => {
                    Session.ResetSessionExpirationTimeOut();
                    self.checkSize(data);
                    options && options.success(data, textStatus, jqXhr);
                },
                error: (jqXhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                    if (options && options.error) {
                        options.error(jqXhr, textStatus, errorThrown);
                    }
                    else {
                        Core.handleError(jqXhr);
                    }
                    //console.error(jqXhr, textStatus, errorThrown);
                },
                complete: (jqXhr: JQueryXHR, textStatus: string) => {
                    self.running = false;

                    setTimeout(() => {
                        self.runOnCompleteHook(jqXhr);
                    }, 500);

                    if (options && options.complete) {
                        options.complete(jqXhr, textStatus);
                    }
                }
            });
        }//end getCurrentUserInformation()

        registerOnCompleteHook(action: (status: JQueryXHR | null) => void) {
            if (this.running) {
                this.cmdStack.push(action);
            } else {
                action(null);
            }
        }

        private runOnCompleteHook(jqXhr: JQueryXHR) {
            while (this.cmdStack.length > 0) {
                const action = this.cmdStack.shift();
                action(jqXhr);
            }
        }
    }

} //end namespace
