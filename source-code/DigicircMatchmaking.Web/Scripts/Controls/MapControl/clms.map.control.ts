﻿namespace Joove.Widgets {

    class JbMap extends BaseAngularProvider {
    }

    export enum MapEvents {
        BoundsChanged = <any>"bounds_changed",
        CenterChanged = <any>"center_changed",
        Click = <any>"click",
        DoubleClick = <any>"dblclick",
        RightClick = <any>"rightclick",
        Drag = <any>"drag",
        DragStart = <any>"dragstart",
        DragEnd = <any>"dragend",
        HeadingChanged = <any>"heading_changed",
        Idle = <any>"idle",
        MapTypeIdChanged = <any>"maptypeid_changed",
        MouseMove = <any>"mousemove",
        MouseOut = <any>"mouseout",
        MouseOver = <any>"mouseover",
        ProjectionChanged = <any>"projection_changed",
        Resize = <any>"resize",
        TilesLoaded = <any>"tilesloaded",
        TiltChanged = <any>"tilt_changed",
        ZoomChanged = <any>"zoom_changed"
    }

    export enum MapDataLayerEvents {
        AddFeature = <any>"addfeature",
        Click = <any>"click",
        DoubleClick = <any>"dblclick",
        MouseDown = <any>"mousedown",
        MouseOut = <any>"mouseout",
        MouseOver = <any>"mouseover",
        MouseUp = <any>"mouseup",
        RemoveFeature = <any>"removefeature",
        RemoveProperty = <any>"removeproperty",
        RightClick = <any>"rightclick",
        SetGeometry = <any>"setgeometry",
        SetProperty = <any>"setproperty"
    }

    export class MapControlStyle {
        name: string;
        style: google.maps.MapTypeStyle[];
        isType: boolean;
        isSelected: boolean;
        isDefault: boolean;

        get key(): string {
            return this.name.replace(/([^a-z0-9]+)/gi, '_');
        }

        constructor(name: string, style: google.maps.MapTypeStyle[], isType: boolean, isDefault: boolean) {
            this.name = name;
            this.style = style;
            this.isType = isType;
            this.isDefault = isDefault;
        }
    }

    export class MapControl {
        private map: google.maps.Map;   //Google Maps object reference
        private directionsService: google.maps.DirectionsService;
        private directionsRenderer: google.maps.DirectionsRenderer;
        private $element: JQuery;        //JQuery container element
        private options: any;           //Map options
        private symbols: Array<any>;
        private autoBoundInProgress = false;
        private isInitialized = false;
        private unregisteredMapEvents: Array<any> = [];
        private unregisteredMapDataLayerEvents: Array<any> = [];
        private _storedData: any;
        private _storedDirections: any;
        private _fromMasterPage = false; // TODO!!!
        public static instancesDic: { [name: string]: MapControl } = {};

        //Events
        mapFeatures: google.maps.Data.Feature[];
        mapDataLayerEventListeners: Dictionary<google.maps.MapsEventListener>;
        mapDataLayerEventFunctions: Dictionary<Function>; //this is for debug purposes
        mapEventListeners: Dictionary<google.maps.MapsEventListener>;
        mapEventFunctions: Dictionary<Function>; //this is for debug purposes
        //Styles
        customStyles: Array<MapControlStyle>;
        get customTypeKeys(): string[] {
            var keys = [];
            var types = this.customStyles.filter((style: MapControlStyle) => (style.isType));
            for (let i = 0; i < types.length; i++) {
                keys.push(types[i].key);
            }
            return keys;
        }
        get defaultStyle(): google.maps.MapTypeStyle[] {
            var defaultStyles = this.customStyles.filter((style: MapControlStyle) => (!style.isType && style.isDefault));
            return defaultStyles.length > 0 ? defaultStyles[0].style : [];
        }

        constructor(element: JQuery, options: any) {
            this.$element = element;
            this.options = options;
            this.symbols = new Array<any>();
            this.mapFeatures = new Array<google.maps.Data.Feature>();
            this.mapEventListeners = new Dictionary<google.maps.MapsEventListener>();
            this.mapEventFunctions = new Dictionary<Function>();
            this.mapDataLayerEventListeners = new Dictionary<google.maps.MapsEventListener>();
            this.mapDataLayerEventFunctions = new Dictionary<Function>();
            this.customStyles = new Array<MapControlStyle>();

            MapControl.instancesDic[Core.getElementName(this.$element)] = this;

            this.init();
        }

        init() {
            if (typeof (google) == "undefined" || typeof (google.maps) == "undefined" || this.$element.is(":visible") == false) {
                setTimeout(() => {
                    this.init();
                }, 400);
            }
            else {
                //Extract all custom styles
                for (let i = 0; i < this.options.customStyles.length; i++) {
                    this.customStyles.push(new MapControlStyle(
                        this.options.customStyles[i].name,
                        this.options.customStyles[i].styleObject,
                        this.options.customStyles[i].isType === true,
                        this.options.customStyles[i].isDefault === true
                    ));
                }

                //Initialize map
                this.map = new google.maps.Map(this.$element.get(0),
                    {
                        zoom: this.options.zoom ? this.options.zoom : 1,
                        minZoom: 3,
                        center: new google.maps.LatLng(
                            this.options.centerCoords.lat ? this.options.centerCoords.lat : 0,
                            this.options.centerCoords.lng ? this.options.centerCoords.lng : 0
                        ),
                        mapTypeControlOptions: {
                            mapTypeIds: this.options.googleLayers.concat(this.customTypeKeys)
                        },
                        styles: this.defaultStyle
                    });

                var self = this;
                google.maps.event.addListener(this.map, 'bounds_changed', function() {
                    if (self.autoBoundInProgress && this.getZoom() > 15) {
                        var zoom = self.options.zoom ? self.options.zoom : 7;
                        this.setZoom(zoom);
                    }
                    self.autoBoundInProgress = false;
                });
                //Initialize symbols
                this.symbols["arrow"] = {
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
                };

                //Initialize directions services
                this.directionsService = new google.maps.DirectionsService;
                this.directionsRenderer = new google.maps.DirectionsRenderer;

                //Set custom style buttons
                var customStyleTypes = this.customStyles.filter((style: MapControlStyle) => (style.isType));
                for (let i = 0; i < customStyleTypes.length; i++) {
                    this.map.mapTypes.set(customStyleTypes[i].key, new google.maps.StyledMapType(customStyleTypes[i].style, { name: customStyleTypes[i].name }));
                    if (customStyleTypes[i].isDefault) {
                        this.map.setMapTypeId(customStyleTypes[i].key);
                    }
                }

                //Set google-provided layers
                for (let i = 0; i < this.options.googleLayers.length; i++) {
                    switch (this.options.googleLayers[i]) {
                        case "bicycle":
                            var bicycleLayer = new google.maps.BicyclingLayer();
                            bicycleLayer.setMap(this.map);
                            break;
                        case "transit":
                            var transitLayer = new google.maps.TransitLayer();
                            transitLayer.setMap(this.map);
                            break;
                        case "traffic":
                            var trafficLayer = new google.maps.TrafficLayer();
                            trafficLayer.setMap(this.map);
                            break;
                    }
                }

                //Set events
                //this.addMapDataLayerEvent();

                //Set built-in functionalities
                this.highlightLinesOnHover();
                this.hidePartialViewOnMapChange();

                //Request data
                this.getData(true);

                setTimeout(() => {
                    //Because center/zoom don't work on new map constructor
                    if (this.options.centerCoords.lat !== null && this.options.centerCoords.lng !== null) {
                        this.map.setCenter(new google.maps.LatLng(
                            this.options.centerCoords.lat ? this.options.centerCoords.lat : 0,
                            this.options.centerCoords.lng ? this.options.centerCoords.lng : 0
                        ));
                    }
                    this.map.setZoom(this.options.zoom);
                    //For random gray map needing resize to refresh/redraw itself
                    google.maps.event.trigger(this.map, "resize");
                }, 777);

                this.isInitialized = true;

                //Register requested events that were added before initialization was complete
                for (let i = 0; i < this.unregisteredMapEvents.length; i++) {
                    this.addMapEvent(this.unregisteredMapEvents[i].type, this.unregisteredMapEvents[i].name, this.unregisteredMapEvents[i].callback);
                }
                for (let i = 0; i < this.unregisteredMapDataLayerEvents.length; i++) {
                    this.addMapDataLayerEvent(this.unregisteredMapDataLayerEvents[i].type, this.unregisteredMapDataLayerEvents[i].name, this.unregisteredMapDataLayerEvents[i].callback);
                }
            }
        }

        /********* Map visual *********/
        setZoom(zoomLevel: number) {
            this.map.setZoom(zoomLevel);
        }

        getFeatureBounds() {
            var bounds = new google.maps.LatLngBounds();

            for (var i = 0; i < this.mapFeatures.length; i++) {
                var currentFeatureGeometry: any;
                currentFeatureGeometry = this.mapFeatures[i].getGeometry();

                currentFeatureGeometry.forEachLatLng((latlng) => {
                    bounds.extend(new google.maps.LatLng(latlng.lat(), latlng.lng()));
                });
            }

            return bounds;

        }

        showRelatedPartialView(lat: number, lng: number) {
            var partialViewElement = $("[jb-type='PartialView'][jb-partial-name='" + this.options.relatedPartialView + "']");
            if (partialViewElement.length === 0) return;

            var topRight = this.map.getProjection().fromLatLngToPoint(this.map.getBounds().getNorthEast());
            var bottomLeft = this.map.getProjection().fromLatLngToPoint(this.map.getBounds().getSouthWest());
            var scale = Math.pow(2, this.map.getZoom());
            var worldPoint = this.map.getProjection().fromLatLngToPoint(new google.maps.LatLng(lat, lng));
            var clickedPoint = new google.maps.Point(Math.round((worldPoint.x - bottomLeft.x) * scale), Math.round((worldPoint.y - topRight.y) * scale));

            var viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

            var mapOffset = this.$element.offset();
            var horizontalScroll = $(window).scrollLeft();
            var verticalScroll = $(window).scrollTop();

            var partialViewY = /*mapOffset.top + */clickedPoint.y;
            var partialViewX = /*mapOffset.left + */clickedPoint.x;

            if (partialViewY - verticalScroll >= Math.round(viewportHeight / 2)) {
                partialViewY = partialViewElement.parent().height() - partialViewY;
                partialViewElement.css("bottom", partialViewY + "px");
                partialViewElement.css("top", "");
            } else {
                partialViewElement.css("top", partialViewY + "px");
                partialViewElement.css("bottom", "");
            }
            if (partialViewX - horizontalScroll >= Math.round(viewportWidth / 2)) {
                partialViewX = partialViewElement.parent().width() - partialViewX;
                partialViewElement.css("right", partialViewX + "px");
                partialViewElement.css("left", "");
            } else {
                partialViewElement.css("left", partialViewX + "px");
                partialViewElement.css("right", "");
            }

            partialViewElement.css("position", "absolute");
            partialViewElement.css("z-index", "100");
            partialViewElement.show();
        }

        /********* Map data *********/
        prepareRequest(): DatasourceRequest {
            if (this.options.groupBy == null) return null;

            const groupColumn = new ColumnInfo(this.options.groupBy.member, this.options.groupBy.dataType);
            const groupInfo = new GroupByInfo(groupColumn, GroupState.EXPANDED, false, true);

            const request = new DatasourceRequest(this.$element, 0, 99999);

            request.filters = [];
            request.groupBy = [groupInfo];
            request.aggregators = [];

            for (let i = 0; i < this.options.values.length; i++) {
                const current = this.options.values[i];

                request.aggregators.push({
                    column: current.member,
                    type: current.type
                });
            }

            return request;
        }

        getData(fitToContent?: boolean, tryNum = 0) {
            if (!this.isInitialized) {
                if (tryNum == null) {
                    tryNum = 0;
                }
                if (tryNum > 10) {
                    return;
                }
                setTimeout(() => {
                    this.getData(fitToContent, tryNum++);
                }, 100);
                return;
            }

            const requestInfo = this.prepareRequest();

            DatasourceManager.fetchDatasource(this.$element,
                Core.getElementName(this.$element),
                requestInfo,
                {
                    success: (response) => {
                        var featuresToRemove = this.mapFeatures.slice();
                        this._storedData = response.Data; //Save the response for possible re-use
                        this.mapFeatures = this.map.data.addGeoJson(response.Data);
                        setTimeout(() => { this.clearData(featuresToRemove); }, 300);
                        this.applyStyle();

                        if (fitToContent === true) {
                            this.fitToContent();
                        }
                    },
                    error: () => {
                        console.error("Error fetching map datasource");
                    }
                },
                this._fromMasterPage);

        }

        applyStyle() {
            this.map.data.setStyle(feature => {
                var style = feature.getProperty("style");

                switch (style["animation"]) {
                    case "google.maps.Animation.DROP":
                        style["animation"] = google.maps.Animation.DROP;
                        break;
                    case "google.maps.Animation.BOUNCE":
                        style["animation"] = google.maps.Animation.BOUNCE;
                        break;
                }

                if (style["arrowSymbol"] === true) {
                    style["icons"] = [{
                        icon: this.symbols["arrow"],
                        offset: '100%'
                    }];
                }
                return style;
            });
        }

        displayDirections(from: string | google.maps.LatLng | google.maps.Place, to: string | google.maps.LatLng | google.maps.Place, travelMode: google.maps.TravelMode) {
            if (!this.isInitialized) return;

            var self = this;
            this.directionsService.route({
                origin: from,
                destination: to,
                travelMode: travelMode
            }, (response, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    self.clearDirections();
                    self.directionsRenderer.setMap(self.map);
                    self._storedDirections = response;
                    self.directionsRenderer.setDirections(response);
                } else {
                    console.log("MAP CONTROL ERROR: Directions request failed due to " + status);
                }
            });
        }

        clearData(features: Array<google.maps.Data.Feature>) {
            if (!this.isInitialized) return;

            if (features == undefined || features.length == undefined) return;
            for (let i = features.length - 1; i >= 0; i--) {
                this.map.data.remove(features.splice(i, 1)[0]);
            }
        }
        clearDirections() {
            if (!this.isInitialized) return;

            this.directionsRenderer.setMap(null);
        }
        refreshData() {
            if (!this.isInitialized) return;

            if (this._storedData != null) {
                var featuresToRemove = this.mapFeatures.slice();
                this.mapFeatures = this.map.data.addGeoJson(this._storedData);
                setTimeout(() => { this.clearData(featuresToRemove); }, 300);
                this.applyStyle();
            }
        }
        refreshDirections() {
            if (!this.isInitialized) return;

            if (this._storedDirections != null) {
                this.clearDirections();
                this.directionsRenderer.setMap(this.map);
                this.directionsRenderer.setDirections(this._storedDirections);
            }
        }

        /********* Map events *********/
        addMapEvent(eventType: MapEvents, name: string, callback: Function) {
            //If the map is not initialized add the event to the unregistered events array
            //which will be processed after initialization
            if (!this.isInitialized) {
                this.unregisteredMapEvents.push({"type": eventType, "name": name, "callback": callback });
                return;
            }

            var eventName = MapEvents[eventType];
            var key = eventName + "_" + name;

            if (this.mapEventListeners.containsKey(key)) {
                console.log("Found listener with key: " + key + " Removing...");
                google.maps.event.removeListener(this.mapEventListeners.item(key));
                this.mapEventListeners.remove(key);
                this.mapEventFunctions.remove(key);
            }

            var listener = google.maps.event.addListener(this.map, eventType.toString(), callback);

            this.mapEventListeners.add(key, listener);
            this.mapEventFunctions.add(key, callback);
            console.log("Added listener: " + key);
        }

        addMapDataLayerEvent(eventType: MapDataLayerEvents, name: string, callback: Function) {
            //If the map is not initialized add the event to the unregistered events array
            //which will be processed after initialization
            if (!this.isInitialized) {
                this.unregisteredMapDataLayerEvents.push({ "type": eventType, "name": name, "callback": callback });
                return;
            }

            var eventName = MapDataLayerEvents[eventType];
            var key = eventName + "_" + name;

            if (this.mapDataLayerEventListeners.containsKey(key)) {
                console.log("Found data layer listener with key: " + key + " Removing...");
                this.mapDataLayerEventListeners.item(key).remove();
                this.mapDataLayerEventListeners.remove(key);
                this.mapDataLayerEventFunctions.remove(key);
            }

            var listener = this.map.data.addListener(eventType.toString(), (event) => { callback(event) });

            this.mapDataLayerEventListeners.add(key, listener);
            this.mapDataLayerEventFunctions.add(key, callback);
            console.log("Added listener: " + key);
        }

        /********* Built-in functionalities *********/
        highlightLinesOnHover() {
            this.addMapDataLayerEvent(MapDataLayerEvents.MouseOver, "autohighlight", (event) => {
                this.map.data.revertStyle();
                var style = event.feature.getProperty("style");
                if (style !== undefined) {
                    var strokeWeight = style["strokeWeight"];
                    console.log(strokeWeight);
                    if (strokeWeight !== undefined) {
                        this.map.data.overrideStyle(event.feature, { strokeWeight: strokeWeight * 2 });
                    }
                }
            });
            this.addMapDataLayerEvent(MapDataLayerEvents.MouseOut, "autohighlight", () => {
                this.map.data.revertStyle();
            });
        }

        hidePartialViewOnMapChange() {
            const hidePartial = (event) => {
                const $partialViewElement = $("[jb-type='PartialView'][jb-partial-name='" + this.options.relatedPartialView + "']");
                if ($partialViewElement.length === 0) return;

                $partialViewElement.hide();
            };

            this.addMapEvent(MapEvents.BoundsChanged, "hide-partial_bounds", hidePartial);
            this.addMapEvent(MapEvents.ZoomChanged, "hide-partial_zoom", hidePartial);
        }

        fitToContent() {
            if (this.mapFeatures != null && this.mapFeatures.length > 0) {
                this.autoBoundInProgress = true;
                this.map.fitBounds(this.getFeatureBounds());
            }
        }
    }

    interface IJbMapScope extends IJooveScope {
        map: MapControl;
        opts: any;
        selectedPoints: typeof undefined[];
    }

    function jbMap(jbMap: JbMap): ng.IDirective {
        return {
            restrict: "AE",
            scope: {
                opts: "=?jbMapOptions",
            },
            link: ($scope: IJbMapScope, $element: JQuery) => {
                if (Common.directiveScopeIsReady($element)) return;

                Common.setDirectiveScope($element, $scope);

                $scope.map = new MapControl($element, $scope.opts);

                Common.markDirectiveScopeAsReady($element);
            }
        }
    }

    angular.module("jbMap", [])
        .provider("jbMap", new JbMap())
        .directive("jbMap", ["jbMap", jbMap]);

    /********* Generic-Helper Classes *********/

    export interface IDictionary<T> {
        add(key: string, value: T);
        containsKey(key: string): boolean;
        count(): number;
        item(key: string): T;
        keys(): string[];
        remove(key: string): T;
        values(): T[];
    }

    export class Dictionary<T> implements IDictionary<T> {
        private _items: { [index: string]: T } = {};

        private _count: number = 0;

        public containsKey(key: string): boolean {
            return this._items.hasOwnProperty(key);
        }

        public count(): number {
            return this._count;
        }

        public add(key: string, value: T) {
            this._items[key] = value;
            this._count++;
        }

        public remove(key: string): T {
            var val = this._items[key];
            delete this._items[key];
            this._count--;
            return val;
        }

        public item(key: string): T {
            return this._items[key];
        }

        public keys(): string[] {
            var keySet: string[] = [];

            for (var prop in this._items) {
                if (this._items.hasOwnProperty(prop)) {
                    keySet.push(prop);
                }
            }

            return keySet;
        }

        public values(): T[] {
            var values: T[] = [];

            for (var prop in this._items) {
                if (this._items.hasOwnProperty(prop)) {
                    values.push(this._items[prop]);
                }
            }

            return values;
        }
    }
}
