var geojson;

document.addEventListener('DOMContentLoaded', function() {
    var URL = "1gF9_kZduMi_dSF0q9BZyOqTStoNaxXYeMd9pfbnz-Wc";
    Tabletop.init( { key: URL, callback: convertToGeoJSON, simpleSheet: true } )
})

function convertToGeoJSON(data) {
    console.log(data);
    places = []
    for(i = 0; i < data.length; i++) {
        console.log(data[i]);
        place = { type: 'Feature',             
        properties: {
                    title: data[i]["name"],
                    description: data[i]["description"],
                    'marker-color': '#336699',
                    'marker-size': 'large',
                    'marker-symbol': data[i]["marker-symbol"],
                },
                geometry: {
                    type: 'Point',
                    coordinates: [data[i]["longitude"], data[i]["latitude"]]
                }
        }
        if((!isNaN(data[i]["latitude"]) && !isNaN(data[i]["longitude"])) &&
                !(data[i]["latitude"]==="" && data[i]["longitude"]==="") ) {
            places.push(place);
        }
    }
    geojson = { type: 'FeaturesCollection', features: places};
    setupMap(geojson);
}

function setupMap(geo) {
    myLayer.setGeoJSON(geo); // Adds all of the points to the map
    map.fitBounds(myLayer.getBounds());
    map.legendControl.addLegend(document.getElementById('legend').innerHTML);
    m.openPopup();
    populateListing();
}


L.mapbox.accessToken = 'pk.eyJ1IjoiamVmZnN0ZXJuIiwiYSI6IlAzRFFiN0EifQ.mNWvayrLEw9wULuq0sopyA';
var map = L.mapbox.map('map', 'jeffstern.6878aba5')
  .setView([40.7120, -73.9940], 13);
var myLayer = L.mapbox.featureLayer().addTo(map);










// Creates a single, draggable marker on the page.
var m = L.marker(new L.LatLng(0, 0), {
    icon: L.mapbox.marker.icon({
        'marker-color': '32CF93'
    }),
    draggable: true
}).bindPopup('Drag me to find the closest place to get involved!').addTo(map);

m.on('dragend', function() {
    populateListing();
});

function populateListing() {
    // Clear out the listing container first.
    info.innerHTML = '';
    var listings = [];

    // Build a listing of markers
    myLayer.eachLayer(function(marker) {
        // Draggable marker coordinates.
        var home = m.getLatLng();
        var metresToMiles = 0.000621371192;
        var distance = (metresToMiles * home.distanceTo(marker.getLatLng())).toFixed(1);

        var link = document.createElement('a');
        link.className = 'item';
        link.href = '#';
        link.setAttribute('data-distance', distance);

        // Populate content from each markers object.
        link.innerHTML = marker.feature.properties.title +
            '<br /><small>' + distance + ' mi. away</small>';

        link.onclick = function() {
            if (/active/.test(this.className)) {
                this.className = this.className.replace(/active/, '').replace(/\s\s*$/, '');
            } else {
                var siblings = info.getElementsByTagName('a');
                for (var i = 0; i < siblings.length; i++) {
                    siblings[i].className = siblings[i].className
                    .replace(/active/, '').replace(/\s\s*$/, '');
                };
                this.className += ' active';

                // When a menu item is clicked, animate the map to center
                // its associated marker and open its popup.
                map.panTo(marker.getLatLng());
                marker.openPopup();
            }
            return false;
        };

        listings.push(link);
    });

    // Sort the listing based on the
    // assigned attribute, 'data-listing'
    listings.sort(function(a, b) {
        return a.getAttribute('data-distance') - b.getAttribute('data-distance');
    });

    $("#info").prepend("<h4>The closest places to get involved are:</h4>")

    listings.forEach(function(listing) {
        info.appendChild(listing);
    });
}
 
    function postContactToGoogle(){
        var name = $('#name').val();
        var description = $('#description').val();
        var latitude = $('#lat').val();
        var longitude = $('#long').val();
        var markersymbol = "park";
        var hexcolor = "#" + $('#color').val();
        if ((name !== "" && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180)) {
            $.ajax({
                url: "https://docs.google.com/spreadsheets/d/1gF9_kZduMi_dSF0q9BZyOqTStoNaxXYeMd9pfbnz-Wc/pubhtml",
                data: {"entry.531694062" : name, "entry.291569454" : description, "entry.2049661042": latitude, "entry.1397506178": longitude, "entry.296423143": markersymbol},
                type: "POST",
                dataType: "xml",
                crossDomain: 'true',
                statusCode: {
                    0: function (){
                        setTimeout(function () { window.location.reload(); }, 10)
                        //Success message
                    }
                }
            });
        } 
        else {
            //Error message
            alert("There are errors with your form submission. Latitudes are between -90 and 90. Long between -180 and 180. :(");
        }
    }