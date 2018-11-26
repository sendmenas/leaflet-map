(function() {
    var map = L.map('worldmap', {
        zoomControl: false,
        zoomSnap: 0,
    });
    map.fitWorld();
    L.Path.mergeOptions({
        weight: 1,
    });

    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    map.dragging.disable();

    L.TopoJSON = L.GeoJSON.extend({  
      addData: function(jsonData) {    
        if (jsonData.type === 'Topology') {
          for (key in jsonData.objects) {
            geojson = topojson.feature(jsonData, jsonData.objects[key]);
            L.GeoJSON.prototype.addData.call(this, geojson);
          }
        }    
        else {
          L.GeoJSON.prototype.addData.call(this, jsonData);
        }
      }  
    });

    const topoLayer = new L.TopoJSON();

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            addTopoData(JSON.parse(this.responseText));
       }
    };
    xhttp.open("GET", "https://raw.githubusercontent.com/sendmenas/leaflet-map/master/custom.geo.json");
    xhttp.send();

    function addTopoData(topoData) {
        topoLayer.addData(topoData);
        topoLayer.addTo(map);
        // map.setView([40, 0]);
        updateMapStyles();
        addPopupsToLayers();
    }

    function updateMapStyles() {
        map.eachLayer(layer => {
            console.log(layer);
        });
    }

    function addPopupsToLayers() {
        map.eachLayer(function(layer) {
            if (layer.feature) {
                let name = layer.feature.properties.name;
                let popup = L.popup({
                    className: 'popup',
                    closeButton: false,
                    autoPan: false,
                });
                popup.setContent(name);
                layer.bindPopup(popup);

                layer.on({
                    mouseover: highlightFeature,
                    mouseout: resetHighlight,
                    mousemove: updatePopupPosition
                });
            }
        });
    };

    // highlight interaction on mouseover
    function highlightFeature(e) {
        let layer = e.target;

        let popup = e.target.getPopup();
        popup.setLatLng(e.latlng).openOn(map);

        layer.setStyle({
            weight: 1,
            color: '#666',
            fillColor: '#fff7bc',
            dashArray: '',
            fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    }

    function resetHighlight(e) {
        console.log(e.target);
        topoLayer.resetStyle(e.target);
        // e.target.closePopup();
    }

    function updatePopupPosition(e) {
        let popup = e.target.getPopup();
        popup.setLatLng(e.latlng);
    }
})();
