// #f3f3f5
// #d0cfd7

(function() {
    const colorScale = chroma.scale(['#f3f3f5', '#d0cfd7']).domain([1, 3589769]);

    var map = L.map('worldmap', {
        zoomControl: false,
        zoomSnap: 0,
        attributionControl: false,
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

    const mapLayer = new L.geoJSON();

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // mapLayer.addData(JSON.parse(this.responseText));
            updateMap(JSON.parse(this.responseText));
       }
    };
    xhttp.open("GET", "https://raw.githubusercontent.com/sendmenas/leaflet-map/master/map.topojson");
    xhttp.send();

    L.TopoJSON = L.GeoJSON.extend({
        addData: function(jsonData) {
            if (jsonData.type === 'Topology') {
                for (key in jsonData.objects) {
                    geojson = topojson.feature(jsonData, jsonData.objects[key]);
                    console.log(geojson);
                    L.GeoJSON.prototype.addData.call(this, geojson);
                }
            }
            else {
                L.GeoJSON.prototype.addData.call(this, jsonData);
            }
        }
    });

    const topoLayer = new L.TopoJSON();

    function updateMap(topoData) {
        topoLayer.addData(topoData);
        topoLayer.addTo(map);
        // mapLayer.addTo(map);
        map.setView([40, 0], 1, true);
        addPopupsToLayers();
    }

    function addPopupsToLayers() {
        map.eachLayer(function(layer) {
            if (layer.feature) {
                let name = layer.feature.properties.name;
                let id = layer.feature.id;
                let fillColor = getColor(layer);

                let popup = L.popup({
                    className: 'popup',
                    closeButton: false,
                    autoPan: false,
                });
                
                if (countryData[id]) {
                    let count = countryData[id].ips_count;
                    popup.setContent(
                        "<div class='name'>" + name + "</div>" +
                        "<div class='count'>" + count + "</div>" +
                        "<div class='subname'>IPs</p>"
                    );
                } else {
                    popup.setContent(
                        "<div class='name'>" + name + "</div>"
                    );
                }

                layer.setStyle({
                    color: "white",
                    fillColor: fillColor,
                    fillOpacity: 1,
                });

                layer.bindPopup(popup);

                layer.on({
                    mouseover: highlightFeature,
                    mouseout: resetHighlight,
                    mousemove: updatePopupPosition
                });
            }
        });
    };

    function getColor(layer) {
        let fillColor = '#f3f3f5';
        let id = layer.feature.id;

        if (countryData[id]) {
            let count = countryData[id].ips_count;
            fillColor = typeof count === "string" ? colorScale(parseInt(count.replace(/,/g,''))).hex() : colorScale(count).hex();
        }

        return fillColor;
    }


    // highlight interaction on mouseover
    function highlightFeature(e) {
        let layer = e.target;

        let popup = e.target.getPopup();
        popup.setLatLng(e.latlng).openOn(map);

        layer.setStyle({
            color: '#23e6a8',
            fillColor: '#23e6a8',
            fillOpacity: 1
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    }

    function resetHighlight(e) {
        let layer = e.target;
        let fillColor = getColor(layer);
        layer.setStyle({
            color: "white",
            fillColor: fillColor,
            fillOpacity: 1,
        });
        layer.closePopup();
    }

    function updatePopupPosition(e) {
        let popup = e.target.getPopup();
        popup.setLatLng(e.latlng);
    }

    window.addEventListener('resize', function(evt) {
        // map.fitWorld();
        // map.setView([40, 0], 1.5, true);
    });

    const countryData = {
        "USA": {
            "ips_count": "3,589,769"
        },
        "IND": {
            "ips_count": "2,405,853"
        },
        "TUR": {
            "ips_count": "1,492,020"
        },
        "BRA": {
            "ips_count": "1,416,271"
        },
        "MEX": {
            "ips_count": "1,319,197"
        },
        "ESP": {
            "ips_count": "1,225,363"
        },
        "DEU": {
            "ips_count": "1,198,423"
        },
        "RUS": {
            "ips_count": "1,182,670"
        },
        "GBR": {
            "ips_count": "1,156,437"
        },
        "FRA": {
            "ips_count": "973,264"
        },
        "ARG": {
            "ips_count": "916,580"
        },
        "ITA": {
            "ips_count": "853,966"
        },
        "CAN": {
            "ips_count": "731,834"
        },
        "EGY": {
            "ips_count": "658,267"
        },
        "IDN": {
            "ips_count": "646,206"
        },
        "UKR": {
            "ips_count": "635,791"
        },
        "COL": {
            "ips_count": "574,544"
        },
        "KOR": {
            "ips_count": "550,293"
        },
        "NLD": {
            "ips_count": "527,200"
        },
        "POL": {
            "ips_count": "495,252"
        },
        "JPN": {
            "ips_count": "421,916"
        },
        "BGD": {
            "ips_count": "378,464"
        },
        "SAU": {
            "ips_count": "372,581"
        },
        "PAK": {
            "ips_count": "370,670"
        },
        "VNM": {
            "ips_count": "357,150"
        },
        "AUS": {
            "ips_count": "347,348"
        },
        "ROU": {
            "ips_count": "339,748"
        },
        "THA": {
            "ips_count": "332,476"
        },
        "ZAF": {
            "ips_count": "323,629"
        },
        "MAR": {
            "ips_count": "319,486"
        },
        "ISR": {
            "ips_count": "289,425"
        },
        "IRN": {
            "ips_count": "243,515"
        },
        "CHL": {
            "ips_count": "233,812"
        },
        "BOL": {
            "ips_count": "226,905"
        },
        "PHL": {
            "ips_count": "212,814"
        },
        "IRQ": {
            "ips_count": "209,038"
        },
        "CHN": {
            "ips_count": "208,513"
        },
        "ARE": {
            "ips_count": "207,193"
        },
        "TWN": {
            "ips_count": "182,293"
        },
        "DZA": {
            "ips_count": "176,992"
        },
        "PER": {
            "ips_count": "169,755"
        },
        "MYS": {
            "ips_count": "149,721"
        },
        "HND": {
            "ips_count": "148,989"
        },
        "KAZ": {
            "ips_count": "137,776"
        },
        "DOM": {
            "ips_count": "133,314"
        },
        "ECU": {
            "ips_count": "120,951"
        },
        "GTM": {
            "ips_count": "102,938"
        },
        "VEN": {
            "ips_count": "98,266"
        },
        "CRI": {
            "ips_count": "78,229"
        },
        "SGP": {
            "ips_count": "72,521"
        },
        "SLV": {
            "ips_count": "62,384"
        },
        "HKG": {
            "ips_count": "60,607"
        },
        "HUN": {
            "ips_count": "54,336"
        },
        "BEL": {
            "ips_count": "53,612"
        },
        "BGR": {
            "ips_count": "51,768"
        },
        "CZE": {
            "ips_count": "45,219"
        },
        "SWE": {
            "ips_count": "43,480"
        },
        "AUT": {
            "ips_count": "40,325"
        },
        "NGA": {
            "ips_count": "39,053"
        },
        "CHE": {
            "ips_count": "37,184"
        },
        "AZE": {
            "ips_count": "34,852"
        },
        "PRY": {
            "ips_count": "34,020"
        },
        "BLR": {
            "ips_count": "33,843"
        },
        "SYR": {
            "ips_count": "33,759"
        },
        "PAN": {
            "ips_count": "32,409"
        },
        "LKA": {
            "ips_count": "32,061"
        },
        "NPL": {
            "ips_count": "30,871"
        },
        "OMN": {
            "ips_count": "30,234"
        },
        "SVK": {
            "ips_count": "30,059"
        },
        "URY": {
            "ips_count": "29,958"
        },
        "HRV": {
            "ips_count": "29,397"
        },
        "UZB": {
            "ips_count": "29,023"
        },
        "PRT": {
            "ips_count": "28,997"
        },
        "GRC": {
            "ips_count": "28,829"
        },
        "IRL": {
            "ips_count": "25,082"
        },
        "LBN": {
            "ips_count": "24,722"
        },
        "PRI": {
            "ips_count": "24,656"
        },
        "NIC": {
            "ips_count": "23,807"
        },
        "TUN": {
            "ips_count": "23,779"
        },
        "NOR": {
            "ips_count": "23,680"
        },
        "JOR": {
            "ips_count": "20,431"
        },
        "DNK": {
            "ips_count": "20,081"
        },
        "NZL": {
            "ips_count": "19,685"
        },
        "FIN": {
            "ips_count": "19,388"
        },
        "KEN": {
            "ips_count": "19,307"
        },
        "QAT": {
            "ips_count": "19,206"
        },
        "KGZ": {
            "ips_count": "17,435"
        },
        "SRB": {
            "ips_count": "17,372"
        },
        "KWT": {
            "ips_count": "17,324"
        },
        "SVN": {
            "ips_count": "16,214"
        },
        "TZA": {
            "ips_count": "16,137"
        },
        "GHA": {
            "ips_count": "15,688"
        },
        "LVA": {
            "ips_count": "15,024"
        },
        "LBY": {
            "ips_count": "14,738"
        },
        "MDA": {
            "ips_count": "14,048"
        },
        "LTU": {
            "ips_count": "13,753"
        },
        "PSE": {
            "ips_count": "12,904"
        },
        "KHM": {
            "ips_count": "10,485"
        },
        "MMR": {
            "ips_count": "10,322"
        },
        "GEO": {
            "ips_count": "9,762"
        },
        "SDN": {
            "ips_count": "9,076"
        },
        "EST": {
            "ips_count": "8,865"
        },
        "YEM": {
            "ips_count": "8,634"
        },
        "SEN": {
            "ips_count": "8,592"
        },
        "CMR": {
            "ips_count": "8,328"
        },
        "ALB": {
            "ips_count": "8,181"
        },
        "BHR": {
            "ips_count": "7,259"
        },
        "BIH": {
            "ips_count": "7,180"
        },
        "JAM": {
            "ips_count": "6,532"
        },
        "TTO": {
            "ips_count": "6,069"
        },
        "ETH": {
            "ips_count": "5,993"
        },
        "ARM": {
            "ips_count": "5,902"
        },
        "TJK": {
            "ips_count": "5,850"
        },
        "AFG": {
            "ips_count": "5,846"
        },
        "MUS": {
            "ips_count": "5,808"
        },
        "SOM": {
            "ips_count": "5,484"
        },
        "UGA": {
            "ips_count": "5,422"
        },
        "ZMB": {
            "ips_count": "5,049"
        },
        "MNG": {
            "ips_count": "4,917"
        },
        "TKM": {
            "ips_count": "4,914"
        },
        "LUX": {
            "ips_count": "4,775"
        },
        "MKD": {
            "ips_count": "4,749"
        },
        "MOZ": {
            "ips_count": "4,670"
        },
        "CYP": {
            "ips_count": "4,486"
        },
        "CUB": {
            "ips_count": "4,378"
        },
        "BEN": {
            "ips_count": "4,221"
        },
        "ZWE": {
            "ips_count": "3,957"
        },
        "AGO": {
            "ips_count": "3,887"
        },
        "COD": {
            "ips_count": "3,717"
        },
        "COG": {
            "ips_count": "3,717"
        },
        "HTI": {
            "ips_count": "3,588"
        },
        "MDV": {
            "ips_count": "3,209"
        },
        "MLT": {
            "ips_count": "2,958"
        },
        "MLI": {
            "ips_count": "2,843"
        },
        "MNE": {
            "ips_count": "2,627"
        },
        "RWA": {
            "ips_count": "2,593"
        },
        "GUY": {
            "ips_count": "2,520"
        },
        "MDG": {
            "ips_count": "2,495"
        },
        "BRN": {
            "ips_count": "2,460"
        },
        "GAB": {
            "ips_count": "2,356"
        },
        "NAM": {
            "ips_count": "2,259"
        },
        "TGO": {
            "ips_count": "2,241"
        },
        "MRT": {
            "ips_count": "2,053"
        },
        "FJI": {
            "ips_count": "2,008"
        },
        "GIN": {
            "ips_count": "1,893"
        },
        "BFA": {
            "ips_count": "1,851"
        },
        "NER": {
            "ips_count": "1,737"
        },
        "BRB": {
            "ips_count": "1,726"
        },
        "MTQ": {
            "ips_count": "1,691"
        },
        "BHS": {
            "ips_count": "1,597"
        },
        "BLZ": {
            "ips_count": "1,528"
        },
        "SUR": {
            "ips_count": "1,503"
        },
        "GLP": {
            "ips_count": "1,364"
        },
        "ISL": {
            "ips_count": "1,070"
        },
        "LCA": {
            "ips_count": "1,037"
        },
        "BWA": {
            "ips_count": "1,020"
        },
        "PNG": {
            "ips_count": "1,016"
        },
        "MWI": {
            "ips_count": 978
        },
        "LBR": {
            "ips_count": 957
        },
        "AND": {
            "ips_count": 860
        },
        "GMB": {
            "ips_count": 853
        },
        "GNQ": {
            "ips_count": 794
        },
        "NCL": {
            "ips_count": 790
        },
        "BTN": {
            "ips_count": 759
        },
        "GUF": {
            "ips_count": 755
        },
        "SLE": {
            "ips_count": 755
        },
        "PYF": {
            "ips_count": 745
        },
        "ATG": {
            "ips_count": 707
        },
        "MAC": {
            "ips_count": 679
        },
        "SYC": {
            "ips_count": 599
        },
        "ABW": {
            "ips_count": 533
        },
        "BDI": {
            "ips_count": 533
        },
        "GUM": {
            "ips_count": 512
        },
        "DJI": {
            "ips_count": 505
        },
        "GRD": {
            "ips_count": 477
        },
        "MYT": {
            "ips_count": 449
        },
        "LSO": {
            "ips_count": 418
        },
        "DMA": {
            "ips_count": 331
        },
        "KNA": {
            "ips_count": 327
        },
        "CYM": {
            "ips_count": 320
        },
        "BMU": {
            "ips_count": 296
        },
        "COM": {
            "ips_count": 285
        },
        "SSD": {
            "ips_count": 254
        },
        "TLS": {
            "ips_count": 244
        },
        "TCD": {
            "ips_count": 230
        },
        "VUT": {
            "ips_count": 226
        },
        "GIB": {
            "ips_count": 219
        },
        "MNP": {
            "ips_count": 216
        },
        "JEY": {
            "ips_count": 209
        },
        "GNB": {
            "ips_count": 205
        },
        "SLB": {
            "ips_count": 198
        },
        "TCA": {
            "ips_count": 198
        },
        "IMN": {
            "ips_count": 195
        },
        "FSM": {
            "ips_count": 177
        },
        "GRL": {
            "ips_count": 174
        },
        "AIA": {
            "ips_count": 150
        },
        "BES": {
            "ips_count": 150
        },
        "PLW": {
            "ips_count": 143
        },
        "GGY": {
            "ips_count": 139
        },
        "ASM": {
            "ips_count": 136
        },
        "FRO": {
            "ips_count": 136
        },
        "KIR": {
            "ips_count": 129
        },
        "WSM": {
            "ips_count": 125
        },
        "LIE": {
            "ips_count": 118
        },
        "MCO": {
            "ips_count": 118
        },
        "STP": {
            "ips_count": 111
        },
        "SMR": {
            "ips_count": 90
        },
        "MHL": {
            "ips_count": 84
        },
        "CAF": {
            "ips_count": 80
        },
        "WLF": {
            "ips_count": 77
        },
        "TON": {
            "ips_count": 66
        },
        "MSR": {
            "ips_count": 45
        },
        "COK": {
            "ips_count": 38
        },
        "SPM": {
            "ips_count": 31
        },
        "FLK": {
            "ips_count": 28
        },
        "ESH": {
            "ips_count": 24
        },
        "TUV": {
            "ips_count": 24
        },
        "ERI": {
            "ips_count": 17
        },
        "NRU": {
            "ips_count": 17
        },
        "IOT": {
            "ips_count": 14
        },
        "PRK": {
            "ips_count": 7
        }
    };
})();
