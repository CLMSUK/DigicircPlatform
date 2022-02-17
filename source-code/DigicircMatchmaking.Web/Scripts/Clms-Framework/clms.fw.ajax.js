var Joove;
(function (Joove) {
    var Ajax = /** @class */ (function () {
        function Ajax() {
        }
        Ajax.ajax = function (settings) {
            settings.ignoreQueue = settings.ignoreQueue ? settings.ignoreQueue : false;
            if (settings.doInBackground !== true) {
                if (Ajax._isRequestInProgress && settings.ignoreQueue === false) {
                    Ajax._requestQueue.push(settings);
                    return;
                }
                if (settings.ignoreQueue === false) {
                    Ajax._pendingRequests++;
                }
                else {
                    Ajax._responseQueue.push(settings);
                }
                if (settings.modalOverlay !== false && settings.ignoreQueue === false) {
                    Ajax._pendingRequestsWithOverlay++;
                }
            }
            var clonedData = Joove.Common.cloneObject(settings.data);
            var reducedData = Ajax.reduceViewModelData(clonedData);
            var serializedData = JSON.stringify(reducedData);
            var ajaxSettings = {
                url: settings.url,
                async: (settings.async) ? settings.async : true,
                dataType: (settings.dataType) ? settings.dataType : null,
                method: (settings.method) ? settings.method : "GET",
                data: null,
                headers: null,
                processData: (settings.processData) ? settings.processData : true,
                cache: false,
                contentType: window._context.ajaxContentType,
                beforeSend: function (xhr, jQuerySettings) {
                    if (settings.doInBackground === true) {
                        settings.beforeSend && settings.beforeSend(xhr, jQuerySettings);
                    }
                    else {
                        if (settings.modalOverlay !== false && settings.ignoreQueue === false) {
                            Ajax.showProgressBar();
                        }
                        settings.beforeSend && settings.beforeSend(xhr, jQuerySettings);
                        if (settings.ignoreQueue === false) {
                            Ajax._isRequestInProgress = true;
                        }
                        else {
                            Ajax._requestQueue.push(settings);
                        }
                    }
                },
                complete: function () {
                    Joove.Session.ResetSessionExpirationTimeOut();
                    if (settings.doInBackground === true) {
                        settings.complete && settings.complete();
                    }
                    else {
                        if (settings.ignoreQueue === false) {
                            Ajax._pendingRequests--;
                        }
                        if (settings.modalOverlay !== false && settings.ignoreQueue === false) {
                            Ajax._pendingRequestsWithOverlay--;
                            Ajax.hideProgressBar();
                        }
                        settings.complete && settings.complete();
                        if (settings.ignoreQueue === false) {
                            Ajax._isRequestInProgress = false;
                            Ajax.checkForPending();
                        }
                    }
                },
                success: function (returnData, textStatus, xhr) {
                    if (settings.ignoreQueue === false || settings.doInBackground === true) {
                        settings.success(returnData, textStatus, xhr);
                    }
                    else {
                        var consumeRespone = function () {
                            if (Ajax._responseQueue[0] == settings) {
                                settings.success(returnData, textStatus, xhr);
                                Ajax._responseQueue.shift();
                            }
                            else {
                                setTimeout(function () {
                                    consumeRespone();
                                }, 50);
                            }
                        };
                        consumeRespone();
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    if (settings.error) {
                        settings.error(xhr, textStatus, errorThrown);
                    }
                }
            };
            if (ajaxSettings.method != "GET") {
                if (ajaxSettings.headers == null) {
                    ajaxSettings.headers = {};
                }
                ajaxSettings.headers["RequestVerificationToken"] = window["_antiForgeryKey"];
            }
            if (window._context.zipRequests === true && ajaxSettings.method != "GET" && window["JSZip"] != null && serializedData.length > 3000) {
                //var started = new Date();
                var zip = new window["JSZip"]();
                zip.file("form.data", serializedData);
                var zipped = zip.generateAsync({
                    compression: "DEFLATE",
                    type: "blob"
                }).then(function (content) {
                    //console.log("ZIPPING....", ajaxSettings.method + ":" + ajaxSettings.url);
                    //console.log("zip took: ", new Date() - started, "ms");
                    //console.log("bytes: " + serializedData.length, "->", content.size);
                    //console.log("compreation rate: " + (100 - ((content.size / serializedData.length) * 100)).toFixed(2));
                    var oldBeforeSend = ajaxSettings.beforeSend;
                    ajaxSettings.beforeSend = function (req, settings) {
                        if (oldBeforeSend != null) {
                            oldBeforeSend(req, settings);
                        }
                        req.setRequestHeader("IsZipped", true);
                    };
                    ajaxSettings.data = content;
                    ajaxSettings.processData = false;
                    delete ajaxSettings["contentType"];
                    $.ajax(ajaxSettings);
                });
            }
            else {
                ajaxSettings.data = this.sanitizeSerializedData(serializedData);
                $.ajax(ajaxSettings);
            }
        };
        /**
         * Returns an array containing the DEFAULT properties that are considered "unwanted" when sending JSON Objects to the Back-End
         */
        Ajax._getUnwantedProperties = function () {
            var result = new Array();
            result.add("DomainModel");
            return result;
        };
        /**
         * Deletes any unwanted properties from the Array/Object. (Returns the input value as is, if it is a primitive)
         * Returns a brand new object: a CLONED version of the input object with the unwanted properties missing
         * @param data  Any Object, Array, Value needs to be cleared out of unwanted properties
         * @param unwantedProperties Optional array that denotes which properties should be considered as "unwanted". If null, the default values will be used
         */
        Ajax.deleteUnwantedPropertiesSafe = function (data, unwantedProperties) {
            if (unwantedProperties === void 0) { unwantedProperties = null; }
            if (data == null)
                return data;
            if (Joove.Common.valueIsObject(data) == false && Joove.Common.isArray(data) == false)
                return data;
            if (unwantedProperties == null) {
                unwantedProperties = Ajax._getUnwantedProperties();
            }
            var postDataCloned = {};
            for (var i in data) {
                if (data.hasOwnProperty(i) == false)
                    continue;
                if (unwantedProperties.contains(i) == true)
                    continue;
                if (data[i] != null && Joove.Common.isArray(data[i]) == false) {
                    if (!unwantedProperties.contains(data[i])) {
                        console.info(data[i]);
                        postDataCloned[i] = Ajax._deleteUnwantedProperties(data[i], unwantedProperties);
                    }
                }
                else if (Joove.Common.isArray(data[i])) {
                    var newArr = [];
                    for (var c = 0; c < data[i].length; c++) {
                        if (!unwantedProperties.contains(data[i][c])) {
                            console.info(data[i][c]);
                            newArr.push(Ajax._deleteUnwantedProperties(data[i][c], unwantedProperties));
                        }
                    }
                    console.info(newArr);
                    postDataCloned[i] = newArr;
                }
                else {
                    if (!unwantedProperties.contains(data[i])) {
                        console.info(data[i]);
                        postDataCloned[i] = Ajax._deleteUnwantedProperties(data[i], unwantedProperties);
                    }
                }
            }
            return postDataCloned;
        };
        /**
         * Deletes any unwanted properties from and Object (no arrays here)
         * Returns the input object with its unwanted properties deleted (careful: mutates the actual input object)
         * @param data  Any Object that needs to be cleared out of unwanted properties
         * @param unwantedProperties Optional array that denotes which properties should be considered as "unwanted". If null, the default values will be used
         */
        Ajax._deleteUnwantedProperties = function (data, unwantedProperties) {
            if (unwantedProperties === void 0) { unwantedProperties = null; }
            if (data == null)
                return data;
            if (unwantedProperties == null) {
                unwantedProperties = Ajax._getUnwantedProperties();
            }
            for (var i = 0; i < unwantedProperties.length; i++) {
                var unwantedProperty = unwantedProperties[i];
                try {
                    delete data[unwantedProperty];
                }
                catch (e) {
                    console && console.error("Joove.Ajax._deleteUnwantedProperties caugh en exception while trying to remove property [" + unwantedProperty + "] from value [" + data + "]");
                }
            }
            return data;
        };
        Ajax.reduceViewModelData = function (data) {
            var postDataCloned = {};
            if (data != null && data._reduceData != null) {
                return data._reduceData(true);
            }
            for (var i in data) {
                if (data.hasOwnProperty(i) === false)
                    continue;
                if (data[i] != null && data[i]._reduceData != null) {
                    var reducedData = data[i]._reduceData(true);
                    postDataCloned[i] = reducedData;
                }
                else if (Joove.Common.isArray(data[i])) {
                    var newArr = [];
                    for (var c = 0; c < data[i].length; c++) {
                        var reducedData = data[i][c]._reduceData == null ? data[i][c] : data[i][c]._reduceData(true);
                        newArr.push(reducedData);
                    }
                    postDataCloned[i] = newArr;
                }
                else {
                    postDataCloned[i] = data[i];
                }
            }
            return postDataCloned;
        };
        Ajax.checkForPending = function () {
            if (Ajax._requestQueue.length > 0) {
                Ajax.ajax(Ajax._requestQueue.shift());
            }
        };
        ;
        Ajax.showProgressBar = function () {
            window._popUpManager.showLoadingPopUp();
        };
        Ajax.hideProgressBar = function () {
            window._popUpManager.hideLoadingPopUp();
        };
        Ajax.pendingRequestsWithOverlay = function () {
            return Ajax._pendingRequestsWithOverlay;
        };
        Ajax.sanitizeSerializedData = function (data) {
            var dic = window["_sanitizationDic"];
            if (dic == null || dic.length == 0)
                return data;
            for (var i = 0; i < dic.length; i++) {
                var entry = dic[i];
                if (data.indexOf(entry.what) == -1)
                    continue;
                data = Joove.Common.replaceAll(data, entry.what, entry.with);
            }
            return data;
        };
        Ajax._requestQueue = [];
        Ajax._responseQueue = [];
        Ajax._isRequestInProgress = false;
        Ajax._pendingRequests = 0;
        Ajax._pendingRequestsWithOverlay = 0;
        return Ajax;
    }());
    Joove.Ajax = Ajax;
})(Joove || (Joove = {}));
