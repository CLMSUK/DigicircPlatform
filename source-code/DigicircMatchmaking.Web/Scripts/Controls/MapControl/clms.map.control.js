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
        var JbMap = /** @class */ (function (_super) {
            __extends(JbMap, _super);
            function JbMap() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return JbMap;
        }(Joove.BaseAngularProvider));
        var MapEvents;
        (function (MapEvents) {
            MapEvents[MapEvents["BoundsChanged"] = "bounds_changed"] = "BoundsChanged";
            MapEvents[MapEvents["CenterChanged"] = "center_changed"] = "CenterChanged";
            MapEvents[MapEvents["Click"] = "click"] = "Click";
            MapEvents[MapEvents["DoubleClick"] = "dblclick"] = "DoubleClick";
            MapEvents[MapEvents["RightClick"] = "rightclick"] = "RightClick";
            MapEvents[MapEvents["Drag"] = "drag"] = "Drag";
            MapEvents[MapEvents["DragStart"] = "dragstart"] = "DragStart";
            MapEvents[MapEvents["DragEnd"] = "dragend"] = "DragEnd";
            MapEvents[MapEvents["HeadingChanged"] = "heading_changed"] = "HeadingChanged";
            MapEvents[MapEvents["Idle"] = "idle"] = "Idle";
            MapEvents[MapEvents["MapTypeIdChanged"] = "maptypeid_changed"] = "MapTypeIdChanged";
            MapEvents[MapEvents["MouseMove"] = "mousemove"] = "MouseMove";
            MapEvents[MapEvents["MouseOut"] = "mouseout"] = "MouseOut";
            MapEvents[MapEvents["MouseOver"] = "mouseover"] = "MouseOver";
            MapEvents[MapEvents["ProjectionChanged"] = "projection_changed"] = "ProjectionChanged";
            MapEvents[MapEvents["Resize"] = "resize"] = "Resize";
            MapEvents[MapEvents["TilesLoaded"] = "tilesloaded"] = "TilesLoaded";
            MapEvents[MapEvents["TiltChanged"] = "tilt_changed"] = "TiltChanged";
            MapEvents[MapEvents["ZoomChanged"] = "zoom_changed"] = "ZoomChanged";
        })(MapEvents = Widgets.MapEvents || (Widgets.MapEvents = {}));
        var MapDataLayerEvents;
        (function (MapDataLayerEvents) {
            MapDataLayerEvents[MapDataLayerEvents["AddFeature"] = "addfeature"] = "AddFeature";
            MapDataLayerEvents[MapDataLayerEvents["Click"] = "click"] = "Click";
            MapDataLayerEvents[MapDataLayerEvents["DoubleClick"] = "dblclick"] = "DoubleClick";
            MapDataLayerEvents[MapDataLayerEvents["MouseDown"] = "mousedown"] = "MouseDown";
            MapDataLayerEvents[MapDataLayerEvents["MouseOut"] = "mouseout"] = "MouseOut";
            MapDataLayerEvents[MapDataLayerEvents["MouseOver"] = "mouseover"] = "MouseOver";
            MapDataLayerEvents[MapDataLayerEvents["MouseUp"] = "mouseup"] = "MouseUp";
            MapDataLayerEvents[MapDataLayerEvents["RemoveFeature"] = "removefeature"] = "RemoveFeature";
            MapDataLayerEvents[MapDataLayerEvents["RemoveProperty"] = "removeproperty"] = "RemoveProperty";
            MapDataLayerEvents[MapDataLayerEvents["RightClick"] = "rightclick"] = "RightClick";
            MapDataLayerEvents[MapDataLayerEvents["SetGeometry"] = "setgeometry"] = "SetGeometry";
            MapDataLayerEvents[MapDataLayerEvents["SetProperty"] = "setproperty"] = "SetProperty";
        })(MapDataLayerEvents = Widgets.MapDataLayerEvents || (Widgets.MapDataLayerEvents = {}));
        var MapControlStyle = /** @class */ (function () {
            function MapControlStyle(name, style, isType, isDefault) {
                this.name = name;
                this.style = style;
                this.isType = isType;
                this.isDefault = isDefault;
            }
            Object.defineProperty(MapControlStyle.prototype, "key", {
                get: function () {
                    return this.name.replace(/([^a-z0-9]+)/gi, '_');
                },
                enumerable: false,
                configurable: true
            });
            return MapControlStyle;
        }());
        Widgets.MapControlStyle = MapControlStyle;
        var MapControl = /** @class */ (function () {
            function MapControl(element, options) {
                this.autoBoundInProgress = false;
                this.isInitialized = false;
                this.unregisteredMapEvents = [];
                this.unregisteredMapDataLayerEvents = [];
                this._fromMasterPage = false; // TODO!!!
                this.$element = element;
                this.options = options;
                this.symbols = new Array();
                this.mapFeatures = new Array();
                this.mapEventListeners = new Dictionary();
                this.mapEventFunctions = new Dictionary();
                this.mapDataLayerEventListeners = new Dictionary();
                this.mapDataLayerEventFunctions = new Dictionary();
                this.customStyles = new Array();
                MapControl.instancesDic[Joove.Core.getElementName(this.$element)] = this;
                this.init();
            }
            Object.defineProperty(MapControl.prototype, "customTypeKeys", {
                get: function () {
                    var keys = [];
                    var types = this.customStyles.filter(function (style) { return (style.isType); });
                    for (var i = 0; i < types.length; i++) {
                        keys.push(types[i].key);
                    }
                    return keys;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(MapControl.prototype, "defaultStyle", {
                get: function () {
                    var defaultStyles = this.customStyles.filter(function (style) { return (!style.isType && style.isDefault); });
                    return defaultStyles.length > 0 ? defaultStyles[0].style : [];
                },
                enumerable: false,
                configurable: true
            });
            MapControl.prototype.init = function () {
                var _this = this;
                if (typeof (google) == "undefined" || typeof (google.maps) == "undefined" || this.$element.is(":visible") == false) {
                    setTimeout(function () {
                        _this.init();
                    }, 400);
                }
                else {
                    //Extract all custom styles
                    for (var i = 0; i < this.options.customStyles.length; i++) {
                        this.customStyles.push(new MapControlStyle(this.options.customStyles[i].name, this.options.customStyles[i].styleObject, this.options.customStyles[i].isType === true, this.options.customStyles[i].isDefault === true));
                    }
                    //Initialize map
                    this.map = new google.maps.Map(this.$element.get(0), {
                        zoom: this.options.zoom ? this.options.zoom : 1,
                        minZoom: 3,
                        center: new google.maps.LatLng(this.options.centerCoords.lat ? this.options.centerCoords.lat : 0, this.options.centerCoords.lng ? this.options.centerCoords.lng : 0),
                        mapTypeControlOptions: {
                            mapTypeIds: this.options.googleLayers.concat(this.customTypeKeys)
                        },
                        styles: this.defaultStyle
                    });
                    var self = this;
                    google.maps.event.addListener(this.map, 'bounds_changed', function () {
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
                    var customStyleTypes = this.customStyles.filter(function (style) { return (style.isType); });
                    for (var i = 0; i < customStyleTypes.length; i++) {
                        this.map.mapTypes.set(customStyleTypes[i].key, new google.maps.StyledMapType(customStyleTypes[i].style, { name: customStyleTypes[i].name }));
                        if (customStyleTypes[i].isDefault) {
                            this.map.setMapTypeId(customStyleTypes[i].key);
                        }
                    }
                    //Set google-provided layers
                    for (var i = 0; i < this.options.googleLayers.length; i++) {
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
                    setTimeout(function () {
                        //Because center/zoom don't work on new map constructor
                        if (_this.options.centerCoords.lat !== null && _this.options.centerCoords.lng !== null) {
                            _this.map.setCenter(new google.maps.LatLng(_this.options.centerCoords.lat ? _this.options.centerCoords.lat : 0, _this.options.centerCoords.lng ? _this.options.centerCoords.lng : 0));
                        }
                        _this.map.setZoom(_this.options.zoom);
                        //For random gray map needing resize to refresh/redraw itself
                        google.maps.event.trigger(_this.map, "resize");
                    }, 777);
                    this.isInitialized = true;
                    //Register requested events that were added before initialization was complete
                    for (var i = 0; i < this.unregisteredMapEvents.length; i++) {
                        this.addMapEvent(this.unregisteredMapEvents[i].type, this.unregisteredMapEvents[i].name, this.unregisteredMapEvents[i].callback);
                    }
                    for (var i = 0; i < this.unregisteredMapDataLayerEvents.length; i++) {
                        this.addMapDataLayerEvent(this.unregisteredMapDataLayerEvents[i].type, this.unregisteredMapDataLayerEvents[i].name, this.unregisteredMapDataLayerEvents[i].callback);
                    }
                }
            };
            /********* Map visual *********/
            MapControl.prototype.setZoom = function (zoomLevel) {
                this.map.setZoom(zoomLevel);
            };
            MapControl.prototype.getFeatureBounds = function () {
                var bounds = new google.maps.LatLngBounds();
                for (var i = 0; i < this.mapFeatures.length; i++) {
                    var currentFeatureGeometry;
                    currentFeatureGeometry = this.mapFeatures[i].getGeometry();
                    currentFeatureGeometry.forEachLatLng(function (latlng) {
                        bounds.extend(new google.maps.LatLng(latlng.lat(), latlng.lng()));
                    });
                }
                return bounds;
            };
            MapControl.prototype.showRelatedPartialView = function (lat, lng) {
                var partialViewElement = $("[jb-type='PartialView'][jb-partial-name='" + this.options.relatedPartialView + "']");
                if (partialViewElement.length === 0)
                    return;
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
                var partialViewY = /*mapOffset.top + */ clickedPoint.y;
                var partialViewX = /*mapOffset.left + */ clickedPoint.x;
                if (partialViewY - verticalScroll >= Math.round(viewportHeight / 2)) {
                    partialViewY = partialViewElement.parent().height() - partialViewY;
                    partialViewElement.css("bottom", partialViewY + "px");
                    partialViewElement.css("top", "");
                }
                else {
                    partialViewElement.css("top", partialViewY + "px");
                    partialViewElement.css("bottom", "");
                }
                if (partialViewX - horizontalScroll >= Math.round(viewportWidth / 2)) {
                    partialViewX = partialViewElement.parent().width() - partialViewX;
                    partialViewElement.css("right", partialViewX + "px");
                    partialViewElement.css("left", "");
                }
                else {
                    partialViewElement.css("left", partialViewX + "px");
                    partialViewElement.css("right", "");
                }
                partialViewElement.css("position", "absolute");
                partialViewElement.css("z-index", "100");
                partialViewElement.show();
            };
            /********* Map data *********/
            MapControl.prototype.prepareRequest = function () {
                if (this.options.groupBy == null)
                    return null;
                var groupColumn = new Joove.ColumnInfo(this.options.groupBy.member, this.options.groupBy.dataType);
                var groupInfo = new Joove.GroupByInfo(groupColumn, Joove.GroupState.EXPANDED, false, true);
                var request = new Joove.DatasourceRequest(this.$element, 0, 99999);
                request.filters = [];
                request.groupBy = [groupInfo];
                request.aggregators = [];
                for (var i = 0; i < this.options.values.length; i++) {
                    var current = this.options.values[i];
                    request.aggregators.push({
                        column: current.member,
                        type: current.type
                    });
                }
                return request;
            };
            MapControl.prototype.getData = function (fitToContent, tryNum) {
                var _this = this;
                if (tryNum === void 0) { tryNum = 0; }
                if (!this.isInitialized) {
                    if (tryNum == null) {
                        tryNum = 0;
                    }
                    if (tryNum > 10) {
                        return;
                    }
                    setTimeout(function () {
                        _this.getData(fitToContent, tryNum++);
                    }, 100);
                    return;
                }
                var requestInfo = this.prepareRequest();
                Joove.DatasourceManager.fetchDatasource(this.$element, Joove.Core.getElementName(this.$element), requestInfo, {
                    success: function (response) {
                        var featuresToRemove = _this.mapFeatures.slice();
                        _this._storedData = response.Data; //Save the response for possible re-use
                        _this.mapFeatures = _this.map.data.addGeoJson(response.Data);
                        setTimeout(function () { _this.clearData(featuresToRemove); }, 300);
                        _this.applyStyle();
                        if (fitToContent === true) {
                            _this.fitToContent();
                        }
                    },
                    error: function () {
                        console.error("Error fetching map datasource");
                    }
                }, this._fromMasterPage);
            };
            MapControl.prototype.applyStyle = function () {
                var _this = this;
                this.map.data.setStyle(function (feature) {
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
                                icon: _this.symbols["arrow"],
                                offset: '100%'
                            }];
                    }
                    return style;
                });
            };
            MapControl.prototype.displayDirections = function (from, to, travelMode) {
                if (!this.isInitialized)
                    return;
                var self = this;
                this.directionsService.route({
                    origin: from,
                    destination: to,
                    travelMode: travelMode
                }, function (response, status) {
                    if (status === google.maps.DirectionsStatus.OK) {
                        self.clearDirections();
                        self.directionsRenderer.setMap(self.map);
                        self._storedDirections = response;
                        self.directionsRenderer.setDirections(response);
                    }
                    else {
                        console.log("MAP CONTROL ERROR: Directions request failed due to " + status);
                    }
                });
            };
            MapControl.prototype.clearData = function (features) {
                if (!this.isInitialized)
                    return;
                if (features == undefined || features.length == undefined)
                    return;
                for (var i = features.length - 1; i >= 0; i--) {
                    this.map.data.remove(features.splice(i, 1)[0]);
                }
            };
            MapControl.prototype.clearDirections = function () {
                if (!this.isInitialized)
                    return;
                this.directionsRenderer.setMap(null);
            };
            MapControl.prototype.refreshData = function () {
                var _this = this;
                if (!this.isInitialized)
                    return;
                if (this._storedData != null) {
                    var featuresToRemove = this.mapFeatures.slice();
                    this.mapFeatures = this.map.data.addGeoJson(this._storedData);
                    setTimeout(function () { _this.clearData(featuresToRemove); }, 300);
                    this.applyStyle();
                }
            };
            MapControl.prototype.refreshDirections = function () {
                if (!this.isInitialized)
                    return;
                if (this._storedDirections != null) {
                    this.clearDirections();
                    this.directionsRenderer.setMap(this.map);
                    this.directionsRenderer.setDirections(this._storedDirections);
                }
            };
            /********* Map events *********/
            MapControl.prototype.addMapEvent = function (eventType, name, callback) {
                //If the map is not initialized add the event to the unregistered events array
                //which will be processed after initialization
                if (!this.isInitialized) {
                    this.unregisteredMapEvents.push({ "type": eventType, "name": name, "callback": callback });
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
            };
            MapControl.prototype.addMapDataLayerEvent = function (eventType, name, callback) {
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
                var listener = this.map.data.addListener(eventType.toString(), function (event) { callback(event); });
                this.mapDataLayerEventListeners.add(key, listener);
                this.mapDataLayerEventFunctions.add(key, callback);
                console.log("Added listener: " + key);
            };
            /********* Built-in functionalities *********/
            MapControl.prototype.highlightLinesOnHover = function () {
                var _this = this;
                this.addMapDataLayerEvent(MapDataLayerEvents.MouseOver, "autohighlight", function (event) {
                    _this.map.data.revertStyle();
                    var style = event.feature.getProperty("style");
                    if (style !== undefined) {
                        var strokeWeight = style["strokeWeight"];
                        console.log(strokeWeight);
                        if (strokeWeight !== undefined) {
                            _this.map.data.overrideStyle(event.feature, { strokeWeight: strokeWeight * 2 });
                        }
                    }
                });
                this.addMapDataLayerEvent(MapDataLayerEvents.MouseOut, "autohighlight", function () {
                    _this.map.data.revertStyle();
                });
            };
            MapControl.prototype.hidePartialViewOnMapChange = function () {
                var _this = this;
                var hidePartial = function (event) {
                    var $partialViewElement = $("[jb-type='PartialView'][jb-partial-name='" + _this.options.relatedPartialView + "']");
                    if ($partialViewElement.length === 0)
                        return;
                    $partialViewElement.hide();
                };
                this.addMapEvent(MapEvents.BoundsChanged, "hide-partial_bounds", hidePartial);
                this.addMapEvent(MapEvents.ZoomChanged, "hide-partial_zoom", hidePartial);
            };
            MapControl.prototype.fitToContent = function () {
                if (this.mapFeatures != null && this.mapFeatures.length > 0) {
                    this.autoBoundInProgress = true;
                    this.map.fitBounds(this.getFeatureBounds());
                }
            };
            MapControl.instancesDic = {};
            return MapControl;
        }());
        Widgets.MapControl = MapControl;
        function jbMap(jbMap) {
            return {
                restrict: "AE",
                scope: {
                    opts: "=?jbMapOptions",
                },
                link: function ($scope, $element) {
                    if (Joove.Common.directiveScopeIsReady($element))
                        return;
                    Joove.Common.setDirectiveScope($element, $scope);
                    $scope.map = new MapControl($element, $scope.opts);
                    Joove.Common.markDirectiveScopeAsReady($element);
                }
            };
        }
        angular.module("jbMap", [])
            .provider("jbMap", new JbMap())
            .directive("jbMap", ["jbMap", jbMap]);
        var Dictionary = /** @class */ (function () {
            function Dictionary() {
                this._items = {};
                this._count = 0;
            }
            Dictionary.prototype.containsKey = function (key) {
                return this._items.hasOwnProperty(key);
            };
            Dictionary.prototype.count = function () {
                return this._count;
            };
            Dictionary.prototype.add = function (key, value) {
                this._items[key] = value;
                this._count++;
            };
            Dictionary.prototype.remove = function (key) {
                var val = this._items[key];
                delete this._items[key];
                this._count--;
                return val;
            };
            Dictionary.prototype.item = function (key) {
                return this._items[key];
            };
            Dictionary.prototype.keys = function () {
                var keySet = [];
                for (var prop in this._items) {
                    if (this._items.hasOwnProperty(prop)) {
                        keySet.push(prop);
                    }
                }
                return keySet;
            };
            Dictionary.prototype.values = function () {
                var values = [];
                for (var prop in this._items) {
                    if (this._items.hasOwnProperty(prop)) {
                        values.push(this._items[prop]);
                    }
                }
                return values;
            };
            return Dictionary;
        }());
        Widgets.Dictionary = Dictionary;
    })(Widgets = Joove.Widgets || (Joove.Widgets = {}));
})(Joove || (Joove = {}));
