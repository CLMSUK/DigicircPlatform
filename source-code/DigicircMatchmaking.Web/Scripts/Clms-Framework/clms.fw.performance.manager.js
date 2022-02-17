var Joove;
(function (Joove) {
    var PerformanceManagerWatch = /** @class */ (function () {
        function PerformanceManagerWatch(startImmediately) {
            if (startImmediately === void 0) { startImmediately = false; }
            this.clear();
            this._running = false;
            if (startImmediately) {
                this.start();
            }
        }
        PerformanceManagerWatch.prototype.clear = function () {
            this._startTime = 0;
            this._endTime = 0;
        };
        PerformanceManagerWatch.prototype.start = function () {
            this.clear();
            this._running = true;
            this._startTime = performance.now();
        };
        PerformanceManagerWatch.prototype.stop = function () {
            this._endTime = performance.now();
            this._running = false;
        };
        PerformanceManagerWatch.prototype.getMilliseconds = function () {
            if (this._running) {
                this.stop();
            }
            return this._endTime - this._startTime;
        };
        return PerformanceManagerWatch;
    }()); //end PerformanceManagerWatch class
    var PerformanceMetricsIdentifier = /** @class */ (function () {
        function PerformanceMetricsIdentifier(controller, action, information) {
            if (action === void 0) { action = null; }
            if (information === void 0) { information = null; }
            this.controller = controller;
            this.action = action;
            this.information = information;
        }
        PerformanceMetricsIdentifier.prototype.asString = function () {
            var result = this.controller;
            if (this.action)
                result = result + ";" + this.action;
            if (this.information)
                result = result + ";" + this.information;
            return result;
        };
        return PerformanceMetricsIdentifier;
    }());
    var FrontEndStatisticsDTO = /** @class */ (function () {
        function FrontEndStatisticsDTO() {
        }
        return FrontEndStatisticsDTO;
    }());
    var FrontEndMetricsDTO = /** @class */ (function () {
        function FrontEndMetricsDTO(id, elapsedMilliseconds) {
            this.ID = id;
            this.ElapsedMilliseconds = elapsedMilliseconds;
        }
        return FrontEndMetricsDTO;
    }());
    var PerformanceManager = /** @class */ (function () {
        function PerformanceManager(enabled) {
            this._enabled = enabled;
            this._watches = {};
        }
        PerformanceManager.prototype.start = function (controller, action, information) {
            if (action === void 0) { action = null; }
            if (information === void 0) { information = null; }
            if (this._enabled === false) {
                return;
            }
            this._watches[new PerformanceMetricsIdentifier(controller, action, information).asString()] = new PerformanceManagerWatch(true);
        };
        PerformanceManager.prototype.stop = function (controller, action, information) {
            if (action === void 0) { action = null; }
            if (information === void 0) { information = null; }
            if (this._enabled === false) {
                return;
            }
            this._watches[new PerformanceMetricsIdentifier(controller, action, information).asString()].stop();
        };
        PerformanceManager.prototype.waitAndSend = function (milliseconds) {
            var _this = this;
            if (milliseconds === void 0) { milliseconds = 1000; }
            setTimeout(function () {
                _this.send();
            }, milliseconds);
        };
        PerformanceManager.prototype.send = function () {
            if (this._watches == {}) {
                return;
            }
            var result = new Array();
            for (var key in this._watches) {
                result.add(new FrontEndMetricsDTO(key, this._watches[key].getMilliseconds()));
            }
            if (result.length > 0) {
                var postData = new FrontEndStatisticsDTO();
                postData.FrontEndMetricsDTOList = result;
                Joove.Ajax.ajax({
                    url: "" + window._context.siteRoot + window._context.currentController + "/_LogFrontEndPerformanceMeasurements",
                    method: "POST",
                    data: postData,
                    success: function (data) {
                        if (data.result == false) {
                            console.log("Error logging the Front End Performance Measurements. Exception Message: " + data.exception);
                        }
                    },
                    error: function (data) {
                        console.error("Error while sending the Front End Performance Measurements back to the Server:", data);
                    }
                });
            }
            this._watches = {};
        };
        return PerformanceManager;
    }()); //end PerformanceManager()
    Joove.PerformanceManager = PerformanceManager;
})(Joove || (Joove = {})); //end namespace