(function() {
    var map = L.map('worldmap', {
        zoomControl: false,
        zoomSnap: 0,
    }).setView([0, 0], 0);
    map.fitWorld(); 

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
    xhttp.open("GET", "https://gist.githubusercontent.com/moklick/c1cc83e18a6fafd9af81/raw/990220dca05c16bb80041f4306cfb3179aa8d88b/countries.topo.json");
    xhttp.send();

    function addTopoData(topoData) {
        topoLayer.addData(topoData);
        topoLayer.addTo(map);
        addPopupsToLayers();
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
                console.log(layer.feature.properties.name);
                if (layer.feature.properties.name.indexOf('Antarctic') > -1) {
                    layer.remove();
                }
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
        topoLayer.resetStyle(e.target);
        e.target.closePopup();
    }

    function updatePopupPosition(e) {
        let popup = e.target.getPopup();
        popup.setLatLng(e.latlng);
    }
})();
