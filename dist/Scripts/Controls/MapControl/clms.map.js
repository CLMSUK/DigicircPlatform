// http://jsfiddle.net/Lt7aP/1453/
// https://www.reonomy.com/creating-custom-google-map-markers-with-angular/
angular
    .module('jbMap', [])
    .service('jbMapMarkerConstructor', function () {
        const GoogleOverlayView = function (element, latlng) {
            this.element = element;
            this.childDiv = $(this.element.children().get(0));
            this.latlng = latlng;
            this.isOpen = true;
        };

        return {
            init: function () {
                if (typeof (google) == typeof (undefined) || typeof (GMaps) == typeof (undefined)) {
                    console.log("waiting for scripts to load...");
                    setTimeout(function () {
                        this.init();
                    }, 400);
                }
                else {
                    this.setUp();
                }
            },

            setUp: function () {
                GoogleOverlayView.prototype = new google.maps.OverlayView();
                GoogleOverlayView.prototype.draw = function () {
                    var panes = this.getPanes();
                    var point = this.getProjection().fromLatLngToDivPixel(this.latlng);
                    if (point) {
                        this.element.css('position', 'absolute')
                            .css('display', 'block')
                            .css('left', parseFloat(point.x.toString()).toFixed(2) + 'px')
                            .css('top', parseFloat(point.y.toString()).toFixed(2) + 'px');

                        if(this.childDiv!=null){
                            // user styling on a partial view goes on the first child of the div that encloses the partial view
                            // so if the partial view is hidden, attempt to show the bubble by changing the display
                            this.childDiv.css('display', 'block');
                        }

                    }
                    panes.overlayImage.appendChild(this.element[0]);
                };

                GoogleOverlayView.prototype.onRemove = function () {

                };

                this.GoogleOverlayView = GoogleOverlayView;
            }
        }
    })
    .provider('jbMap', function () {
        var default_Options = {};

        this.setOptions = function ($mapOptions) {
            default_$mapOptions = $mapOptions;
        };

        this.$get = function () {
            return {
                getOptions: function () {
                    return default_$mapOptions;
                }
            };
        };
    })
    .directive('jbMap', [
        '$timeout',
        '$interval',
        'jbMap',
        'jbMapMarkerConstructor',
        function ($timeout, $interval, ngRadio, jbMapMarkerConstructor) {
            return {
                priority: 1001,
                restrict: 'AE',
                scope: true, // todo: SOS if not isolated then I cannot use multiple maps within a view and ng-click not working - yet
                link: function ($scope, $element, $attrs, ngModelCtrl) {
                    if (Joove.Common.directiveScopeIsReady($element) === true) return;

                    Joove.Common.setDirectiveScope($element, $scope);

                    // variable declarations ---------------------------------------------------------------------------
                    var name = $element.attr("jb-id");
                    var alreadyInitialized = false;
                    var alreadyWatched = false;
                    var notVisible = true;
                    $scope.$map = null;
                    $scope.overlays = [];
                    $scope.layersToModel = {};
                    $scope.layersToMarkers = {};
                    $scope.layerToPolyline = {};
                    $scope.layerToCluster = {};
                    $scope.searchField = "";
                    $scope.polyLinesToMarkers = {};
                    $scope.selectedMarkers = [];
                    $scope.addedMarker = {};
                    $scope.$mapOptions = {};

                    var $model = null;
                    var selectedMarkerIcon = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";

                    try {
                        $model = Joove.Common.getMasterModel();
                    }
                    catch (e) {
                        $model = {};
                    }


                    // function declarations ---------------------------------------------------------------------------
                    $scope.init = function () {

                        if (typeof (google) == typeof (undefined) || typeof (GMaps) == typeof (undefined)) {
                            console.log("waiting for scripts to load...");
                            setTimeout(function () {
                                $scope.init();
                            }, 400);
                        }
                        else {
                            jbMapMarkerConstructor.init();
                            if (!alreadyInitialized) {
                                // Get $mapOptions and Model
                                eval('$scope.$mapOptions = ' + $element.data("options"));

                                // Set up Map with all events
                                $scope.$map = new GMaps({
                                    div: "#" + (name || "map"),  // assuming id todo: gmaps.js work with other selectors too
                                    lat: $scope.$mapOptions.centerCoords.lat || 50.88,
                                    lng: $scope.$mapOptions.centerCoords.lng || 5.97,
                                    zoom: $scope.$mapOptions.zoom || 1,
                                    mapTypeId: $scope.$mapOptions.mapTypeId || google.maps.MapTypeId.TERRAIN,
                                    /* on click event */
                                    click: function (e) {
                                        if ($scope.$mapOptions != null && $scope.$mapOptions.mapEvents.click)
                                            $scope.$mapOptions.mapEvents.click(e);
                                        if ($scope.$mapOptions.addMarkerOnClick != null) {
                                            // $scope.onMapClick(e);
                                        }

                                        $scope.onMapClick(e);
                                    },
                                    dblclick: function (e) {
                                        if ($scope.$mapOptions && $scope.$mapOptions.mapEvents.dblclick)
                                            $scope.$mapOptions.mapEvents.dblclick(e);

                                    },
                                    /* on dragstart event */
                                    dragstart: function (e) {
                                        if ($scope.$mapOptions != null && $scope.$mapOptions.mapEvents.dragstart)
                                            $scope.$mapOptions.mapEvents.dragstart(e);
                                    },
                                    /* on dragend event */
                                    dragend: function (e) {
                                        if ($scope.$mapOptions && $scope.$mapOptions.mapEvents.dragend)
                                            $scope.$mapOptions.mapEvents.dragend(e);
                                    },
                                    contextmenu: function (e) {
                                        if ($scope.$mapOptions && $scope.$mapOptions.mapEvents.contextmenu)
                                            $scope.$mapOptions.mapEvents.contextmenu(e);
                                    }

                                });
                                // Basic Options
                                $scope.$map.setContextMenu({
                                    control: 'map', //map or marker https://hpneo.github.io/gmaps/examples/context_menu.html
                                    options: [{
                                        title: 'Add marker',
                                        name: 'add_marker',
                                        action: function(e) {
                                            $scope.onMapClick(e);
                                        }
                                    }, {
                                        title: 'Center here',
                                        name: 'center_here',
                                        action: function(e) {
                                            this.setCenter(e.latLng.lat(), e.latLng.lng());
                                        }
                                    },
                                        {
                                            title:"Clear Selected Markers",
                                            name:"clear_selected_markers",
                                            action:function (e) {

                                                for(var i=0; i < $scope.$map.markers.length; i++){
                                                    if($scope.selectedMarkers.indexOf($scope.$map.markers[i])> -1){
                                                        $scope.$map.markers[i]._isSelected = false;
                                                        $scope.$map.markers[i]= $scope.markerToggleSelected($scope.$map.markers[i]);
                                                    }
                                                }
                                                $scope.selectedMarkers = [];
                                            }
                                        }

                                    ]
                                });

                                // Basic Options
                                $scope.$map.setContextMenu({
                                    control: 'marker', //map or marker https://hpneo.github.io/gmaps/examples/context_menu.html
                                    options: [{
                                        title: 'Remove marker',
                                        name: 'remove_marker',
                                        action: function(e) {
                                            $scope.removeMarker(e.marker);
                                        }
                                    }
                                    ]
                                });

                                $scope.removeMarker = function (marker) {
                                    var selectedInd = $scope.selectedMarkers.indexOf(marker);
                                    if(selectedInd > -1 ){
                                        $scope.selectedMarkers.splice(selectedInd, 1); // todo: removeBubbles;
                                        $scope.$parent.$digest();
                                    }
                                    $scope.$map.removeMarker(marker);
                                };

                                $scope.onMapClick = function(e){
                                    "use strict";
                                    return;
                                    var marker = $scope.$map.addMarker({
                                        lat: e.latLng.lat(),
                                        lng: e.latLng.lng(),
                                        title: 'New Marker',
                                        click: function(e) {
                                            console.log($scope.selectedMarkers)
                                        }
                                    });
                                    var m = {
                                        Latitude: e.latLng.lat(),
                                        Longitude: e.latLng.lng(),
                                        Title: 'New Marker'
                                    };
                                    marker.m = m;
                                    marker._isSelected = false;
                                    marker.layer = {};
                                    $scope.selectedMarkers.push(marker);
                                    $scope.selectedItem = marker;

                                    $scope.addMarkerBubble(marker);


                                    var formScope = Joove.Common.getScope(); //todo: is master page
                                    var method = formScope.eventCallbacks[name + "Clicked"];

                                    if (method == null) return;
                                    $scope.addedMarker  = m;
                                    method(null, m);
                                    $scope.markerToggle(marker);
                                };

                                $scope.createNewMarkerModel = function(options, data){
                                    "use strict";
                                    var m = {};

                                    if(options["LatitudeAttribute"]){
                                        m[options["LatitudeAttribute"]] = data.lat;
                                    }
                                    if(options["LongitudeAttribute"]){
                                        m[options["LongitudeAttribute"]] = data.lng;
                                    }
                                    if(options["AddressAttribute"]){
                                        m[options["AddressAttribute"]] = data.address;
                                    }

                                    return m;
                                };

                                //todo: create this semantic on map model?
                                /*$scope.$map.addControl({
                                 position: 'bottom_right',
                                 content: "Find Route",
                                 style: {
                                 margin: '5px',
                                 padding: '10px 6px',
                                 border: 'solid 1px #717B87',
                                 background: '#fff',
                                 width: "200px",
                                 height: "80px"
                                 },
                                 events: {
                                 click: function () {
                                 for(var i=0; i < $scope.selectedMarkers.length; i++){
                                 GMaps.geocode({
                                 callback: function(result){
                                 "use strict";
                                 console.log(result);
                                 },
                                 lat: $scope.selectedMarkers[i].position.lat(),
                                 lng: $scope.selectedMarkers[i].position.lng(),
                                 });
                                 }
                                 }
                                 }
                                 });*/

                                // temp to resolve issue with visibility
                                $("#" + (name || "map")).css("height", "100%").css("width", "100%");

                                // Add Markers on map
                                if ($scope.$mapOptions.markers != undefined) {
                                    for (var i = 0; i < $scope.$mapOptions.markers.length; i++) {
                                        $scope.$map.addMarker($scope.$mapOptions.markers[i]);
                                    }
                                }

                                // Add point overlays
                                if ($scope.$mapOptions.pointOverlays != undefined) {
                                    for (var i = 0; i < $scope.$mapOptions.pointOverlays.length; i++) {
                                        $scope.$map.drawOverlay($scope.$mapOptions.pointOverlays[i]);
                                    }
                                }

                                // Add layers
                                if ($scope.$mapOptions.mapOverlays != undefined) {
                                    $scope.addLayers($scope.$mapOptions);
                                }

                                $scope.focusOnTheLastMarker();

                                //if(!$element.is(":visible")){
                                //    notVisible = true;
                                //    setInterval(function(){
                                //        "use strict";

                                //        if($element.is(":visible") && !notVisible){
                                //            $scope.$map.refresh();
                                //            $scope.focusOnTheLastMarker();
                                //        }
                                //        notVisible = !$element.is(":visible");

                                //    }, 1000);
                                //}
                                google.maps.event.addListener($scope.$map.map, "bounds_changed", function () {
                                    //console.log("BOUNDS CHANGED");
                                    $scope.$map.refresh();
                                });

                                alreadyInitialized = true;
                            }
                        }

                        window.setTimeout(function () { $scope.$map.refresh(); }, 1000);
                    };

                    $scope.focusOnTheLastMarker = function(){
                        if($scope.$map.markers.length > 0){
                            var lastMarker = $scope.$map.markers[$scope.$map.markers.length -1];
                            $scope.$map.setCenter(lastMarker.position.lat(), lastMarker.position.lng());
                        }
                    };

                    $scope.addLayers = function ($mapOptions) {
                        for (var i = 0; i < $mapOptions.mapOverlays.length; i++) {
                            var layer = $mapOptions.mapOverlays[i];

                            if (layer.layerType == "Custom") {
                                // Add the overlay if any
                                $scope.$map.addOverlayMapType(layer);
                            }
                            else {
                                // predefined google layers
                                $scope.$map.addLayer(layer.layerType.toLowerCase())
                            }

                            $scope.paths = [];
                            var connectedPoints = layer.connectedPoints == "true";

                            if (layer.dataMapping != null && layer.dataMapping.length > 1) {
                                $scope.layersToMarkers[layer.name] = [];
                                $scope.layerToPolyline[layer.name] = [];

                                // find the bound model
                                $scope.layersToModel[layer.name] = $scope.findModel(layer.dataMapping);

                                for (var j = 0; j < $scope.layersToModel[layer.name].length; j++) {

                                    // the current marker model
                                    var m = $scope.layersToModel[layer.name][j];

                                    // the map marker
                                    var marker = {
                                        layer: layer,
                                        lat: $scope.getAttributeValue(m, layer.latitudeMapping),
                                        lng: $scope.getAttributeValue(m, layer.longitudeMapping), //m[layer.longitudeMapping],
                                        title: layer.titleMapping == "" ? layer.name : $scope.getAttributeValue(m, layer.titleMapping),
                                        draggable: layer.draggablePin == "true",
                                        animation: google.maps.Animation.DROP,
                                        m: m,
                                        _isSelected: false
                                    };

                                    if (marker.lat == null || marker.lng == null) {
                                        console.log("%c No valid data for marker ", "background-color:red; color:white;", m);
                                        continue;
                                    }

                                    if (marker.title != null) {
                                        marker.title = marker.title.toString(); // must be string else error
                                    }

                                    // Add icon to marker
                                    if (layer.iconField) {
                                        marker.icon = $scope.getAttributeValue(m, layer.iconField);
                                        marker.originalIcon = marker.icon;
                                    }

                                    // Keep lat lng in an array for the polyline
                                    if (connectedPoints) { // Add a polyline to connect markers
                                        $scope.paths.push([marker.lat, marker.lng]);
                                    }

                                    // Add marker to map and keep a reference
                                    marker = $scope.$map.addMarker(marker);

                                    // On dragend update model
                                    if (marker.draggable) {
                                        $scope.addElementEvent(marker, 'dragend', $scope.markerDragEnd);
                                    }
                                    if (layer.infoWindow == null) { // todo: change this when infoWindow is defined in ui and model

                                        $scope.addMarkerBubble(marker);

                                    }
                                    $scope.layersToMarkers[layer.name].push(marker);

                                }

                                // watch for changes
                                // todo: other components need to update parent scope in order for this to work
                                if (!alreadyWatched) {
                                    $scope.watchModel(layer);
                                    alreadyWatched = true;
                                }

                                if (layer.clusterMarkers == "true") {
                                    //$scope.addMarkerCluster(layer);
                                }
                            }
                            if (connectedPoints) {
                                $scope.addPolyline(layer, $scope.paths)
                            }
                            if (layer.canBeHidden == "true") {
                                $scope.addControl(layer);
                            }
                        }
                    };

                    $scope.getTile = function (coord, zoom, ownerDocument) {
                        var div = ownerDocument.createElement('div');
                        div.innerHTML = coord;
                        div.style.width = this.tileSize.width + 'px';
                        div.style.height = this.tileSize.height + 'px';
                        div.style.fontSize = '10';
                        div.style.fontWeight = 'bolder';
                        div.style.border = 'dotted 1px #aaa';
                        div.style.textAlign = 'center';
                        div.style.lineHeight = this.tileSize.height + 'px';
                        return div;
                    };

                    $scope.addOverlay = function () {
                        /* How to add tiles or custom overlays */
                        $scope.$map.addOverlayMapType({    // know this
                            index: 0,
                            tileSize: new google.maps.Size(256, 256),
                            getTile: $scope.getTile
                        });
                    };

                    $scope.drawRoute = function () {
                        /* How to add a route between two points */
                        $scope.$map.drawRoute({    // know this - bound to points
                            origin: [-12.044012922866312, -77.02470665341184],
                            destination: [-12.090814532191756, -77.02271108990476],
                            travelMode: 'driving',
                            strokeColor: '#131540',
                            strokeOpacity: 0.6,
                            strokeWeight: 6
                        });
                    };

                    $scope.applyStyle = function () {
                        /*  var mapStyle = new MapComponent.MapStyle({name: '', style$mapOptions:styles});
                         var stylers = [{"color": "red"}];
                         var selElType = $scope.selectedElementType + "." + $scope.selectedSubElementType ;
                         $scope.customMapStyle.style$mapOptions.push(new MapComponent.MapStyleOption({
                         featureType: $scope.selectedFeatureType, elementType: selElType, style$mapOptions:stylers}
                         ));
                         var styledMapType = new google.maps.StyledMapType($scope.customMapStyle.style$mapOptions, $scope.customMapStyle);
                         $scope.styles.push($scope.customMapStyle);
                         $scope.$map.map.mapTypes.set('map_style', styledMapType);
                         $scope.$map.setMapTypeId('map_style');*/
                    };

                    $scope.addMarkerCluster = function (layer) {
                        var clusterOptions = {
                            imagePath: window.location.pathname.split('/').slice(0, 2).join("/") + '/Scripts/Controls/MapControl/images/m'
                        };
                        $scope.layerToCluster[layer.name] = new MarkerClusterer($scope.$map.map, $scope.layersToMarkers[layer.name], clusterOptions);
                    };

                    $scope.watchModel = function (layer) {
                        $scope.$watchCollection('model.' + layer.dataMapping, function (newValue, oldValue) {
                            if (Joove.Common.collectionsAreEqual(newValue, oldValue)) return;

                            $scope.$map.removeMarkers();
                            $scope.$map.removePolylines();
                            $scope.$map.removeOverlays();

                            $scope.addLayers($scope.$mapOptions);

                            //if (newValue != oldValue) {
                            //    if (newValue.length > oldValue.length) {
                            //        // add marker
                            //        var m = $(newValue).not(oldValue).get();
                            //        console.log("ADDED", m);
                            //    }
                            //    if (newValue.length < oldValue.length) {
                            //        // remove marker
                            //        var removed = $(oldValue).not(newValue).get();
                            //        console.log("REMOVED", removed);
                            //        $scope.$map.removeMarker($scope.$map.markers[oldValue.indexOf(removed[0])]);

                            //    }
                            //    if (newValue.length == oldValue.length) {
                            //        // update data
                            //    }
                            //}
                        }, true);

                    };

                    $scope.findModel = function (dataMapping) {
                        var splitDataMapping = dataMapping.split('.');
                        var model = [];
                        for (var i = 0; i < splitDataMapping.length; i++) {
                            if (model.length == 0) {
                                model = $model[splitDataMapping[i]];
                            }
                            else {
                                model = model[splitDataMapping[i]];
                            }
                        }
                        return model;
                    };

                    $scope.getAttributeValue = function (model, layerAttributeMapping) {
                        var $m = $scope.findAttributeBinding(model, layerAttributeMapping);

                        return $m == null ? $m : $m[layerAttributeMapping.split('.').slice(-1)[0]]

                    };

                    $scope.setAttributeValue = function (model, layerAttributeMapping, value) {

                        if (layerAttributeMapping.indexOf(".") > -1) {
                            $scope.findAttributeBinding(model, layerAttributeMapping)[layerAttributeMapping.split('.').slice(-1)[0]] = value;
                        }
                        else {
                            model[layerAttributeMapping] = value;
                        }
                    };

                    function getNextAttr(model, currentAttr){
                        return typeof model[currentAttr] == 'object'
                            ? model[currentAttr]
                            : model;
                    }

                    $scope.findAttributeBinding = function (model, attributeMapping) {
                        "use strict";
                        var splitAttributeMapping = attributeMapping.split('.');
                        var counter = splitAttributeMapping.length;
                        if (attributeMapping.indexOf('.') == -1) {
                            counter = counter + 1;
                        }

                        var member = undefined;
                        for (var i = 0; i < counter - 1; i++) {
                            var $m = member == undefined
                                ? getNextAttr(model, splitAttributeMapping[i])
                                : getNextAttr(member, splitAttributeMapping[i]);

                            if (member == $m) {
                                break;
                            }
                            member = $m;
                        }
                        return member;
                    };

                    $scope.addControl = function (layer) {
                        //todo: create this semantic on map model?
                        $scope.$map.addControl({
                            position: 'top_right',
                            content: layer.name || "Layer",
                            style: {
                                margin: '5px',
                                padding: '1px 6px',
                                border: 'solid 1px #717B87',
                                background: '#fff'
                            },
                            events: {
                                click: function () {
                                    $scope.toggleLayerVisibility(layer);
                                }
                            }
                        });
                    };

                    $scope.toggleLayerVisibility = function (layer) {

                        if (layer.layerType != "Custom") {
                            if (layer.isVisible)
                                $scope.$map.removeLayer(layer.layerType.toLowerCase());
                            else
                                $scope.$map.addLayer(layer.layerType.toLowerCase())
                        }
                        layer.isVisible = !layer.isVisible;

                        var markers = $scope.layersToMarkers[layer.name];
                        if(markers!=null){
                            var l = markers.length;
                            for (var i = 0; i < l; i++) {
                                markers[i].setVisible(layer.isVisible);
                            }

                            if (layer.clusterMarkers == "true") {
                                var l2c = $scope.layerToCluster[layer.name].clusters_.length;
                                for (var i = 0; i < l2c; i++) {
                                    if (layer.isVisible) {
                                        $scope.layerToCluster[layer.name].clusters_[i].clusterIcon_.show();
                                    }
                                    else {
                                        $scope.layerToCluster[layer.name].clusters_[i].clusterIcon_.hide();
                                    }
                                }
                            }

                            if (layer.connectedPoints == "true") {
                                $scope.layerToPolyline[layer.name].setMap(layer.isVisible ? $scope.$map.map : null);
                            }
                        }

                    };

                    $scope.addPolyline = function (layer, paths) {
                        "use strict";
                        // todo: create the semantic for the polyline on map model?
                        var poly = {
                            path: paths,
                            strokeColor: 'red',
                            strokeOpacity: 1,
                            strokeWeight: 3,
                            editable: true
                        };
                        $scope.layerToPolyline[layer.name] = $scope.$map.drawPolyline(poly);
                    };

                    $scope.refreshPath = function (markerList) {
                        var path = [];

                        for (var i = 0; i < markerList.length; i++) {
                            var m = markerList[i];
                            path.push([markerList[i].position.lat(), markerList[i].position.lng()]);
                        }

                        return path;
                    };

                    $scope.addElementEvent = function (element, event, cb) {
                        google.maps.event.addListener(
                            element,
                            event,
                            function (e) {
                                cb && cb(e, element);
                            }
                        );
                    };

                    $scope.markerDragEnd = function (e, marker) {
                        var lat = e.latLng.lat();
                        var lng = e.latLng.lng();
                        if (marker.draggable && marker.layer.connectedPoints == "true") {
                            $scope.updatePolylines(marker, lat, lng);
                        }

                        // update original object
                        $scope.setAttributeValue(marker.m, marker.layer.latitudeMapping, lat);
                        $scope.setAttributeValue(marker.m, marker.layer.longitudeMapping, lng);

                        // update marker partial view binding:
                        if (marker.layer.partialViewModelBinding != null) {
                            $scope.setAttributeValue($scope.model, marker.layer.partialViewModelBinding, marker.m);
                            $scope.updateMarkerBubble(marker);
                            //jbMapMarkerConstructor.update(new google.maps.LatLng(marker.position.lat(), marker.position.lng()))
                        }
                        // update marker infoWindow:
                        if (marker.infoWindow != null) {
                            marker.infoWindow.close();
                            marker.infoWindow.content = '<p>Title: ' + marker.title + '</p><p>Coords: ' + lat + '-' + lng + '</p>';
                            marker.infoWindow.close($scope.$map.map, marker);
                        }
                        $scope.$parent.$digest();  // update the parent so that changes in model data are visible
                    };

                    $scope.updatePolylines = function (marker, lat, lng) {
                        "use strict";
                        if ($scope.layersToMarkers[marker.layer.name].indexOf(marker) > -1) {
                            $scope.$map.removePolyline($scope.layerToPolyline[marker.layer.name]);
                            $scope.addPolyline(marker.layer, $scope.refreshPath($scope.layersToMarkers[marker.layer.name]));
                        }
                    };

                    $scope.search = function (searchStr) {
                        "use strict";
                        if (searchStr == "")
                            return;
                        GMaps.geocode({
                            address: searchStr,
                            callback: function (results, status) {
                                if (status == 'OK') {
                                    var latlng = results[0].geometry.location;
                                    $scope.$map.setCenter(latlng.lat(), latlng.lng());
                                    $scope.$map.addMarker({
                                        lat: latlng.lat(),
                                        lng: latlng.lng()
                                    });
                                }
                                else {
                                    alert("NOT OK: TODO: Need handling");
                                }
                            }
                        });
                    };

                    $scope.markerToggle = function(e){

                        if(e.Ra != null){
                            e.Ra.preventDefault();
                            e.Ra.stopPropagation();

                        }
                        $scope.markerToggleBubble($scope.markerToggleSelected(this.layer!=null?this:e));
                    };

                    $scope.markerToggleSelected = function (marker) {

                        marker._isSelected = !marker._isSelected;

                        if(!marker._isSelected){
                            marker.setIcon(marker.originalIcon);
                        }
                        else{
                            marker.setIcon(selectedMarkerIcon);
                        }
                        return marker;
                    };

                    $scope.markerToggleBubble = function(marker){
                        "use strict";
                        if (marker.layer.partialViewModelBinding != "" && marker.layer.partialViewModelBinding != null) {
                            //this.infoWindow.close();
                            $scope.setAttributeValue($model, marker.layer.partialViewModelBinding, marker.m);
                            $scope.$parent.$digest();

                            var $partial = $("div[jb-id='" + "PartialViewForMarker" + "']");
                            if ($partial.length > 0) {
                                if(marker.googleOverlayView!=null){
                                    //var mapOrNull = this.googleOverlayView.isOpen? null: $scope.$map.map; !!! not working as expected
                                    //this.googleOverlayView.setMap(mapOrNull);
                                    marker.googleOverlayView.element.css("display", marker.googleOverlayView.isOpen?"none":"block");
                                    marker.googleOverlayView.isOpen =  !marker.googleOverlayView.isOpen;
                                }
                                else{
                                    var latlng = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
                                    marker.googleOverlayView = new jbMapMarkerConstructor.GoogleOverlayView($partial.clone(), latlng);
                                    marker.googleOverlayView.setMap($scope.$map.map);
                                    marker.googleOverlayView.draw();
                                }
                            }
                        }
                        else {
                            marker.infoWindow.open($scope.$map.map, marker);
                        }
                    };

                    $scope.updateMarkerBubble = function (marker) {
                        // since the partial view is cloned and set for marker, the model is not bound -
                        // $compile could provide a solution for this but that would mean that all partial copies
                        // would be updated when selected marker is changed.
                        if(marker.googleOverlayView != null){
                            // https://developers.google.com/maps/documentation/javascript/reference?csw=1
                            google.maps.event.clearListeners(marker, "click");
                            marker.googleOverlayView.element.remove();
                            marker.googleOverlayView.setMap(null);
                            marker.googleOverlayView = null;
                        }
                        $scope.addMarkerBubble(marker);
                    };

                    $scope.addMarkerBubble = function (marker) {

                        if (marker.layer.partialViewModelBinding == "" || marker.layer.partialViewModelBinding == null){
                            marker.infoWindow = new google.maps.InfoWindow({
                                content: '<p>Title: ' + marker.title + '</p><p>Coords: ' + marker.position.lat() + '-' + marker.position.lng() + '</p>',
                            });
                            marker.infoWindow.close();
                        }
                        marker.addListener("click", $scope.markerToggle);
                    };

                    $scope.init();

                    Joove.Common.markDirectiveScopeAsReady($element);
                }
            };
        }
    ])
;
