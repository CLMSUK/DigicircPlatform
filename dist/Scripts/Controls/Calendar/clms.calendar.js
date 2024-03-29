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
var Joove;
(function (Joove) {
    var Widgets;
    (function (Widgets) {
        var JooveCalendarProvider = /** @class */ (function (_super) {
            __extends(JooveCalendarProvider, _super);
            function JooveCalendarProvider() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return JooveCalendarProvider;
        }(Joove.BaseAngularProvider));
        function jooveCalendar($timeout, jooveCalendar) {
            return {
                priority: 1001,
                restrict: "AE",
                scope: true,
                link: function ($scope, $element, $attrs) {
                    Joove.Common.setDirectiveScope($element, $scope);
                    $scope.selectedItems = [];
                    $scope._helper = new CalendarHelper($element, $scope);
                    Joove.Common.markDirectiveScopeAsReady($element);
                }
            };
        }
        angular
            .module("jooveCalendar", [])
            .provider("jooveCalendar", new JooveCalendarProvider())
            .directive("jooveCalendar", [
            "jooveCalendar",
            jooveCalendar
        ]);
        var CalendarHelper = /** @class */ (function () {
            function CalendarHelper($el, scope) {
                this.$element = $el;
                this.options = this.parseOptions();
                this.scope = scope;
                this.dateField = $el.attr("jb-date");
                this.endDateField = $el.attr("jb-endDate");
                this.captionField = $el.attr("jb-caption");
                this.cache = [];
                this.columnsInfo = Joove.DatasourceManager.getDataSetColumnInfoFromControl($el);
                this.init();
            }
            CalendarHelper.prototype.parseOptions = function () {
                var heightModeAttr = this.$element.attr("jb-heightMode");
                var heightAttr = this.$element.attr("jb-height");
                var defaultViewAttr = this.$element.attr("jb-defaultView");
                var viewsAttr = this.$element.attr("jb-availableViews");
                var ratioAttr = this.$element.attr("jb-ratio");
                var cacheAttr = this.$element.attr("jb-cache");
                var options = {};
                switch (heightModeAttr) {
                    case "Explicit":
                        options.height = parseInt(heightAttr);
                        break;
                    case "Auto":
                        options.height = "auto";
                        break;
                    case "MatchParent":
                        options.height = "parent";
                        break;
                    case "Default":
                    default:
                        options.ratio = parseFloat(ratioAttr); // this is the only case where aspect ratio is honored
                        break;
                }
                var availableViews = viewsAttr.split(";");
                options.availableViews = "";
                for (var i = 0; i < availableViews.length; i++) {
                    var parsedView = this.parseViewToFullCalendarString(availableViews[i]);
                    if (parsedView == null)
                        continue;
                    if (options.availableViews != "") {
                        options.availableViews += " ";
                    }
                    options.availableViews += parsedView;
                }
                options.defaultView = this.parseViewToFullCalendarString(defaultViewAttr);
                options.cache = cacheAttr == "true";
                return options;
            };
            CalendarHelper.prototype.parseViewToFullCalendarString = function (view) {
                switch (view) {
                    case "Month":
                        return "month";
                    case "Week":
                        return "basicWeek";
                    case "Day":
                        return "basicDay";
                    default:
                        return null;
                }
            };
            CalendarHelper.prototype.resolveLocale = function () {
                return window._context.locale == "el"
                    ? "el"
                    : "en";
            };
            CalendarHelper.prototype.init = function () {
                var _this = this;
                if (this.$element.is(":visible") === false) {
                    setTimeout(function () { _this.init(); }, 500);
                    return;
                }
                var self = this;
                this.$element["fullCalendar"]({
                    editable: false,
                    locale: this.resolveLocale(),
                    header: {
                        left: this.options.availableViews,
                        center: 'title',
                        right: 'today prev,next'
                    },
                    defaultView: this.options.defaultView,
                    aspectRatio: this.options.ratio,
                    height: this.options.height,
                    eventLimit: true,
                    views: {
                        month: {
                            eventLimit: 4
                        }
                    },
                    eventClick: function (calEvent, jsEvent, view) {
                        self.onEventClick(calEvent, jsEvent, view);
                    },
                    eventRender: function (event, $element) {
                        self.addEventIcon($element);
                    }
                    //eventDrop: $scope.alertOnDrop,
                    //eventResize: $scope.alertOnResize,
                    //eventRender: $scope.eventRender                
                });
                this.startClearCacheInterval();
                setTimeout(function () {
                    _this.$element["fullCalendar"]("today");
                    _this.initListeners();
                    _this.refresh();
                }, 1500);
            };
            CalendarHelper.prototype.startClearCacheInterval = function () {
                var _this = this;
                if (this.options.cache === true)
                    return;
                this.cacheClearInterval = setInterval(function () {
                    _this.clearCache();
                }, 5000);
            };
            CalendarHelper.prototype.createRangeKey = function (range) {
                return range.start.toString() + "_" + range.end.toString();
            };
            CalendarHelper.prototype.clearCache = function () {
                this.cache = [];
            };
            CalendarHelper.prototype.getCachedData = function (range) {
                var key = this.createRangeKey(range);
                for (var i = 0; i < this.cache.length; i++) {
                    var current = this.cache[i];
                    if (current.key == key) {
                        return current.data;
                    }
                }
                return null;
            };
            CalendarHelper.prototype.addToCache = function (data, range) {
                this.cache.push({
                    key: this.createRangeKey(range),
                    data: data
                });
            };
            CalendarHelper.prototype.addEventIcon = function ($eventElement) {
                $eventElement.find(".fc-content").prepend("<i class='event-icon glyphicon glyphicon-ok'></i>");
            };
            CalendarHelper.prototype.onEventClick = function (calEvent, jsEvent, view) {
                var formScope = Joove.Common.getScope(); // todo maybe in master ?
                var controlName = this.$element.attr("jb-id");
                var event = formScope.eventCallbacks[controlName + "Clicked"];
                if (event == null)
                    return;
                this.scope.selectedItems = [calEvent.instance];
                event(jsEvent, null, null);
            };
            CalendarHelper.prototype.refresh = function () {
                var _this = this;
                clearTimeout(this.refreshTimeout);
                this.refreshTimeout = setTimeout(function () {
                    clearInterval(_this.cacheClearInterval);
                    var visibleRange = _this.getCalendarVisibleRange();
                    var cached = _this.getCachedData(visibleRange);
                    if (cached == null) {
                        _this.fetchData(function (data, thatRange) {
                            var events = _this.createEventsArray(data);
                            _this.setCalendarData(events, thatRange);
                            _this.addToCache(events, thatRange);
                        });
                    }
                    else {
                        //console.log("CACHE HIT!");
                        _this.setCalendarData(cached, visibleRange);
                    }
                    _this.startClearCacheInterval();
                }, 500);
            };
            CalendarHelper.prototype.getCalendarVisibleRange = function () {
                var range = this.$element["fullCalendar"]("getView");
                return {
                    start: range.start._d,
                    end: range.end._d
                };
            };
            CalendarHelper.prototype.setCalendarData = function (data, range) {
                var requestedRangeKey = this.createRangeKey(range);
                var currentRangeKey = this.createRangeKey(this.getCalendarVisibleRange());
                // fast prev or next buttons pressed and requests finished in mixed order
                // this fixes the stuff
                if (requestedRangeKey != currentRangeKey) {
                    //console.log("request data again!!!")
                    this.refresh();
                    return;
                }
                this.$element["fullCalendar"]("removeEventSources");
                this.$element["fullCalendar"]("addEventSource", data);
            };
            CalendarHelper.prototype.initListeners = function () {
                var _this = this;
                this.$element.find(".fc-prev-button").on("click", function () {
                    _this.refresh();
                });
                this.$element.find(".fc-next-button").on("click", function () {
                    _this.refresh();
                });
                this.$element.find(".fc-today-button").on("click", function () {
                    _this.refresh();
                });
                this.$element.find(".fc-basicWeek-button").on("click", function () {
                    _this.refresh();
                });
                this.$element.find(".fc-basicDay-button").on("click", function () {
                    _this.refresh();
                });
                this.$element.find(".fc-month-button").on("click", function () {
                    _this.refresh();
                });
            };
            CalendarHelper.prototype.prepareRequest = function (range) {
                var startDateCol = this.getColumnInfoByName(this.dateField);
                var filters = [];
                // force this format, so that backend can successfully parse datetime filters
                var startFormated = moment(range.start).format("DD/MM/YYYY");
                var endFormated = moment(range.end).format("DD/MM/YYYY");
                if (this.endDateField != null && this.endDateField.trim() != "") {
                    var endDateCol = this.getColumnInfoByName(this.endDateField);
                    filters.push(new Joove.FilterInfo(endDateCol, endFormated, Joove.RowOperators.OR, Joove.FilterOperators.GREATER_THAN_OR_EQUAL_TO, null));
                    filters.push(new Joove.FilterInfo(startDateCol, startFormated, Joove.RowOperators.OR, Joove.FilterOperators.LESS_THAN, null));
                }
                filters.push(new Joove.FilterInfo(startDateCol, startFormated, Joove.RowOperators.OR, Joove.FilterOperators.RANGE, endFormated));
                var dsReq = new Joove.DatasourceRequest(this.$element, 0, 9999, filters);
                return dsReq;
            };
            CalendarHelper.prototype.createEventsArray = function (data) {
                var events = [];
                for (var i = 0; i < data.length; i++) {
                    var dato = data[i];
                    var event_1 = {
                        title: this.walkDataPath(dato, this.captionField),
                        start: this.walkDataPath(dato, this.dateField),
                        allDay: true,
                        instance: dato
                    };
                    if (this.endDateField != null && this.endDateField.trim() != "") {
                        /* From FullCalendar Docs: event.end is the moment immediately after the event has ended.
                        For example, if the last full day of an event is Thursday,
                        the exclusive end of the event will be 00:00:00 on Friday! */
                        var end = this.walkDataPath(dato, this.endDateField);
                        event_1.end = moment(end).add(1, 'days');
                    }
                    events.push(event_1);
                }
                return events;
            };
            CalendarHelper.prototype.walkDataPath = function (data, path) {
                var pathParts = path.split(".");
                var currentDato = data;
                for (var i = 0; i < pathParts.length; i++) {
                    var currentPart = pathParts[i];
                    currentDato = currentDato[currentPart];
                }
                return currentDato;
            };
            CalendarHelper.prototype.fetchData = function (cb) {
                var visibleRange = this.getCalendarVisibleRange();
                var requestInfo = this.prepareRequest(visibleRange);
                Joove.DatasourceManager.fetchDatasource(this.$element, Joove.Core.getElementName(this.$element), requestInfo, {
                    success: function (response) {
                        cb && cb(response.Data, visibleRange);
                    },
                    error: function () {
                        console.error("Error fetching calendar datasource");
                    }
                });
            };
            CalendarHelper.prototype.getColumnInfoByName = function (name) {
                for (var i = 0; i < this.columnsInfo.length; i++) {
                    var current = this.columnsInfo[i];
                    if (current.name == name)
                        return current;
                }
                return null;
            };
            return CalendarHelper;
        }());
        Widgets.CalendarHelper = CalendarHelper;
    })(Widgets = Joove.Widgets || (Joove.Widgets = {}));
})(Joove || (Joove = {}));
