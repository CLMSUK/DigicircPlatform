﻿namespace Joove.Widgets {
    class JooveCalendarProvider extends BaseAngularProvider {
    }

    interface ICalendarOptions {
        cache: boolean,
        defaultView: string,
        availableViews: string,
        height: any,
        ratio: number
    }

    export interface IJooveCalendarScope extends IJooveScope {
        selectedItems: Array<any>;
        _helper: CalendarHelper;
    }

    function jooveCalendar ($timeout: ng.ITimeoutService, jooveCalendar): ng.
        IDirective {

        return {
            priority: 1001,
            restrict: "AE",
            scope: true,
            link: ($scope: IJooveCalendarScope, $element: any, $attrs) => {
                Common.setDirectiveScope($element, $scope);

                $scope.selectedItems = [];
                $scope._helper = new CalendarHelper($element, $scope);

                Common.markDirectiveScopeAsReady($element);
            }
        };

    }

    angular
        .module("jooveCalendar", [])
        .provider("jooveCalendar", new JooveCalendarProvider())
        .directive("jooveCalendar",
        [
            "jooveCalendar",
            jooveCalendar
        ]);

    export class CalendarHelper {
        private $element: JQuery;
        private cacheClearInterval: any;
        private refreshTimeout: any;
        private dateField: string;
        private endDateField: string;
        private captionField: string;
        private columnsInfo: Array<ColumnInfo>;
        private scope: IJooveCalendarScope;
        private cache: Array<{ key: string, data: Array<any> }>;
        private options: ICalendarOptions;

        constructor ($el: JQuery, scope: IJooveCalendarScope) {
            this.$element = $el;
            this.options = this.parseOptions();
            this.scope = scope;
            this.dateField = $el.attr("jb-date");
            this.endDateField = $el.attr("jb-endDate");
            this.captionField = $el.attr("jb-caption");
            this.cache = [];
            this.columnsInfo = DatasourceManager.getDataSetColumnInfoFromControl($el);

            this.init();
        }

        private parseOptions (): ICalendarOptions {
            var heightModeAttr = this.$element.attr("jb-heightMode");
            var heightAttr = this.$element.attr("jb-height");
            var defaultViewAttr = this.$element.attr("jb-defaultView");
            var viewsAttr = this.$element.attr("jb-availableViews");
            var ratioAttr = this.$element.attr("jb-ratio");
            var cacheAttr = this.$element.attr("jb-cache");

            var options: ICalendarOptions = {} as any;

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

                if (parsedView == null) continue;

                if (options.availableViews != "") {
                    options.availableViews += " ";
                }

                options.availableViews += parsedView;
            }

            options.defaultView = this.parseViewToFullCalendarString(defaultViewAttr);
            options.cache = cacheAttr == "true";

            return options;
        }

        private parseViewToFullCalendarString (view: string): string {
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
        }

        private resolveLocale (): string {
            return window._context.locale == "el"
                ? "el"
                : "en";
        }

        private init() {
            if (this.$element.is(":visible") === false) {
                setTimeout(() => { this.init(); }, 500);
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
                eventClick: (calEvent, jsEvent, view) => {
                    self.onEventClick(calEvent, jsEvent, view);
                },
                eventRender: function (event, $element: JQuery) {
                    self.addEventIcon($element);
                }
                //eventDrop: $scope.alertOnDrop,
                //eventResize: $scope.alertOnResize,
                //eventRender: $scope.eventRender                
            });
            
            this.startClearCacheInterval();

            setTimeout(() => {
                this.$element["fullCalendar"]("today");

                this.initListeners();

                this.refresh();
            }, 1500);

        }        

        private startClearCacheInterval () {
            if (this.options.cache === true) return;

            this.cacheClearInterval = setInterval(() => {
                this.clearCache();
            }, 5000);
        }

        private createRangeKey (range: { start: Date, end: Date }): string {
            return range.start.toString() + "_" + range.end.toString();
        }

        public clearCache () {
            this.cache = [];
        }

        private getCachedData (range: { start: Date, end: Date }): Array<any> {
            var key = this.createRangeKey(range);

            for (let i = 0; i < this.cache.length; i++) {
                var current = this.cache[i];

                if (current.key == key) {
                    return current.data;
                }
            }

            return null;
        }

        private addToCache (data: Array<any>, range: { start: Date, end: Date }) {
            this.cache.push({
                key: this.createRangeKey(range),
                data: data
            });
        }

        private addEventIcon ($eventElement: JQuery) {
            $eventElement.find(".fc-content").prepend("<i class='event-icon glyphicon glyphicon-ok'></i>");
        }

        private onEventClick (calEvent, jsEvent, view) {
            var formScope = Joove.Common.getScope(); // todo maybe in master ?
            var controlName = this.$element.attr("jb-id");
            var event = formScope.eventCallbacks[controlName + "Clicked"];

            if (event == null) return;

            this.scope.selectedItems = [calEvent.instance];

            event(jsEvent, null, null);
        }

        public refresh () {
            clearTimeout(this.refreshTimeout);

            this.refreshTimeout = setTimeout(() => {
                clearInterval(this.cacheClearInterval);

                var visibleRange = this.getCalendarVisibleRange();
                var cached = this.getCachedData(visibleRange);

                if (cached == null) {
                    this.fetchData((data, thatRange) => {
                        var events = this.createEventsArray(data);

                        this.setCalendarData(events, thatRange);
                        this.addToCache(events, thatRange);
                    });
                }
                else {
                    //console.log("CACHE HIT!");
                    this.setCalendarData(cached, visibleRange);
                }

                this.startClearCacheInterval();
            }, 500);
        }

        private getCalendarVisibleRange (): { start: Date, end: Date } {
            var range = this.$element["fullCalendar"]("getView");

            return {
                start: range.start._d,
                end: range.end._d
            }
        }

        private setCalendarData (data: Array<any>, range: { start: Date, end: Date }) {
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
        }

        private initListeners () {
            this.$element.find(".fc-prev-button").on("click", () => {
                this.refresh();
            });

            this.$element.find(".fc-next-button").on("click", () => {
                this.refresh();
            });

            this.$element.find(".fc-today-button").on("click", () => {
                this.refresh();
            });

            this.$element.find(".fc-basicWeek-button").on("click", () => {
                this.refresh();
            });

            this.$element.find(".fc-basicDay-button").on("click", () => {
                this.refresh();
            });

            this.$element.find(".fc-month-button").on("click", () => {
                this.refresh();
            });
        }

        private prepareRequest (range: { start: Date, end: Date }): DatasourceRequest {
            var startDateCol = this.getColumnInfoByName(this.dateField);
            var filters = [];

            // force this format, so that backend can successfully parse datetime filters
            var startFormated = moment(range.start).format("DD/MM/YYYY");
            var endFormated = moment(range.end).format("DD/MM/YYYY");
            if (this.endDateField != null && this.endDateField.trim() != "") {
                var endDateCol = this.getColumnInfoByName(this.endDateField);
                filters.push(new Joove.FilterInfo(endDateCol, endFormated, RowOperators.OR, FilterOperators.GREATER_THAN_OR_EQUAL_TO, null));
                filters.push(new Joove.FilterInfo(startDateCol, startFormated, RowOperators.OR, FilterOperators.LESS_THAN, null));
            }

            filters.push(new Joove.FilterInfo(startDateCol, startFormated, RowOperators.OR, FilterOperators.RANGE, endFormated));


            var dsReq = new DatasourceRequest(this.$element, 0, 9999, filters);

            return dsReq;
        }

        public createEventsArray (data: Array<any>): Array<any> {
            var events = [];

            for (let i = 0; i < data.length; i++) {
                let dato = data[i];

                let event: any = {
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
                    event.end = moment(end).add(1, 'days');
                }

                events.push(event);
            }

            return events;
        }

        private walkDataPath (data: any, path): any {
            var pathParts = path.split(".");
            var currentDato = data;

            for (let i = 0; i < pathParts.length; i++) {
                var currentPart = pathParts[i];
                currentDato = currentDato[currentPart];
            }

            return currentDato;
        }

        public fetchData (cb?: Function) {
            const visibleRange = this.getCalendarVisibleRange();
            const requestInfo = this.prepareRequest(visibleRange);

            DatasourceManager.fetchDatasource(this.$element, Core.getElementName(this.$element), requestInfo,
                {
                    success: (response) => {
                        cb && cb(response.Data, visibleRange);
                    },
                    error: () => {
                        console.error("Error fetching calendar datasource");
                    }
                });
        }

        private getColumnInfoByName (name: string): ColumnInfo {
            for (let i = 0; i < this.columnsInfo.length; i++) {
                var current = this.columnsInfo[i];

                if (current.name == name) return current;
            }

            return null;
        }
    }
}