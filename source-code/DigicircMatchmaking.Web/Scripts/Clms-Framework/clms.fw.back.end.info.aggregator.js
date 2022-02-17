var Joove;
(function (Joove) {
    var BackEndInformationAggregator = /** @class */ (function () {
        function BackEndInformationAggregator(masterPageEntryPoint) {
            this.cmdStack = [];
            this._masterPageEntryPoint = masterPageEntryPoint;
        }
        BackEndInformationAggregator.prototype.checkSize = function (data) {
            var sizeInBytes = CLMS.Framework.Utilities.SizeOf(data);
            var sizeInMB = ((sizeInBytes / (1024 * 1024)));
            if (sizeInMB >= this._maximumModelSizeInMB) {
                console.error("Received a very large object: " + sizeInMB.toFixed(2) + " MB. Consider optimizing your Form Model.");
            }
        };
        BackEndInformationAggregator.prototype.get = function (forMaster, options) {
            var self = this;
            self.running = true;
            var controller = window._context.currentController;
            var action = window._context.currentAction;
            if (forMaster === true) {
                controller = window._context.currentMasterPageController;
                action = self._masterPageEntryPoint;
            }
            var query = window._context.urlQuery;
            if (window._context.isModal === true) {
                if (query.indexOf("?") == -1) {
                    query += "?";
                }
                else {
                    query += "&";
                }
                query += Joove.Core.isModalParamName + "=true";
            }
            $.ajax({
                url: "" + window._context.siteRoot + controller + "/_API_" + action + query,
                type: "GET",
                cache: false,
                success: function (data, textStatus, jqXhr) {
                    Joove.Session.ResetSessionExpirationTimeOut();
                    self.checkSize(data);
                    options && options.success(data, textStatus, jqXhr);
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    if (options && options.error) {
                        options.error(jqXhr, textStatus, errorThrown);
                    }
                    else {
                        Joove.Core.handleError(jqXhr);
                    }
                    //console.error(jqXhr, textStatus, errorThrown);
                },
                complete: function (jqXhr, textStatus) {
                    self.running = false;
                    setTimeout(function () {
                        self.runOnCompleteHook(jqXhr);
                    }, 500);
                    if (options && options.complete) {
                        options.complete(jqXhr, textStatus);
                    }
                }
            });
        }; //end getCurrentUserInformation()
        BackEndInformationAggregator.prototype.registerOnCompleteHook = function (action) {
            if (this.running) {
                this.cmdStack.push(action);
            }
            else {
                action(null);
            }
        };
        BackEndInformationAggregator.prototype.runOnCompleteHook = function (jqXhr) {
            while (this.cmdStack.length > 0) {
                var action = this.cmdStack.shift();
                action(jqXhr);
            }
        };
        return BackEndInformationAggregator;
    }());
    Joove.BackEndInformationAggregator = BackEndInformationAggregator;
})(Joove || (Joove = {})); //end namespace
