/* === FOURSQUARE API CREDENTIALS === */
var CLIENT_ID = 'GHE2SLTC2WDUUN2V0NGQ2JJUZW12DNKABZWYWPM1AU5PNO2V';
var CLIENT_SECRET = 'WRW1ETHIVCIU12KR05BRIUVCDITOLGMD2PTYZMRZ42FFZ3ZS';

// Global Variables
var map, infoWindow;

/* ====== MODEL ======= */
// LatLng info for ice cream locations
var iceCreamSpots = [{
    title: 'Stricklands Ice Cream',
    location: {
        lat: 33.649907,
        lng: -117.832047
    },
    zIndex: 1,
    fourSqr_id: '4b6f9268f964a52058f62ce3',
}, {
    title: 'Honey Mee',
    location: {
        lat: 33.718912,
        lng: -117.733302
    },
    zIndex: 2,
    fourSqr_id: '56133dc1498ed30d2084f448',
}, {
    title: 'Creamistry',
    location: {
        lat: 33.684908,
        lng: -117.810683
    },
    zIndex: 3,
    fourSqr_id: '522f75a111d25e25dde59723',
}, {
    title: 'Honey Mee',
    location: {
        lat: 33.677607,
        lng: -117.832913
    },
    zIndex: 4,
    fourSqr_id: '567ccac3498efd0ced213d7c',
}, {
    title: 'Afters Ice Cream',
    location: {
        lat: 33.688649,
        lng: -117.832173
    },
    zIndex: 5,
    fourSqr_id: "56b6659c498e8bc7cb3c7970",
}, {
    title: 'CREAM',
    location: {
        lat: 33.650252,
        lng: -117.745958
    },
    zIndex: 6,
    fourSqr_id: '55842d9f498e86d574f21236',
}, {
    title: 'Stax Cookie Bar',
    location: {
        lat: 33.650746,
        lng: -117.838995
    },
    zIndex: 7,
    fourSqr_id: '',
}, {
    title: 'Cold Stone Creamery',
    location: {
        lat: 33.650646,
        lng: -117.743507
    },
    zIndex: 8,
    fourSqr_id: '4ba44ba7f964a520c79338e3',
}, {
    title: 'Cold Stone Creamery',
    location: {
        lat: 33.705182,
        lng: -117.784864
    },
    zIndex: 9,
    fourSqr_id: '4bf75af75ec320a196fc86d3',
}, {
    title: 'Golden Spoon',
    location: {
        lat: 33.649917,
        lng: -117.838758
    },
    zIndex: 10,
    fourSqr_id: "4bedf78c946c0f470544a363",
}, ];

/* ====== GOOGLEMAPS ======= */
function initMap() {
  console.log("google maps initialized");
  var centreMap = {lat:33.696164,lng: -117.796927};
  // Create a map object and specify the DOM element for display.
    map = new google.maps.Map(document.getElementById("map"), {
      scrollwheel: false,
      zoom: 13,
      center: centreMap,
      styles: mapStyles,
      mapTypeControl: false
    });
}

// separate function for infowindow content
function contentString(location) {
    return ('<div class="info_content"><h3 class="info_title">' + location.title + '</h3>' +
        '<p><h5>Address: </h5>' + location.formattedAddress + '</p>' +
        '<p><h5>Rating: </h5>' + location.rating + '/10</p>' +
        '<p><h5>Phone: </h5>' + location.formattedPhone + '</p>' +
        '<hr>' +
        '<p><h6>Map Built With:</h6></p>'+
        '<a href=https://foursquare.com/ target="_blank"><img src="img/foursqr_logo.png" alt="Foursquare Link"></img></a>' +
        '<a href=https://developers.google.com/maps/ target="_blank"><img src="img/googlemaps.png" alt="Google Maps API Link"></img></a>' +
        '<a href=http://knockoutjs.com/ target="_blank"><img src="img/knockout.png" alt="Knockout JS Link"></img></a></div>');
}

/* ====== VIEWMODEL ======= */
function ViewModel() {
    console.log("ViewModel applied successfully");
    var self = this;
    self.markers = [];
    // get the locations from iceCreamSpots array & stores them in an observable array
    self.iceCreamSpots = ko.observableArray(iceCreamSpots);
    //creating markers in iceCreamSpots Array
    self.iceCreamSpots().forEach(function(location) {
        //marker parameters
        var marker = new google.maps.Marker({
            map: map,
            title: location.title,
            position: location.position,
            animation: google.maps.Animation.DROP,
            icon: 'img/icecream_mark.png',
        });
        location.marker = marker;
        marker.setVisible(true);
        //Pushes each marker into the markers array
        self.markers.push(marker);
        //Click on location name in list view
        self.markerEvents = function(location) {
            if (location.title) {
                map.setZoom(14);
                // Pans the map view to selected marker when list view Location is clicked
                map.panTo(location.position);
                location.marker.setAnimation(google.maps.Animation.BOUNCE); // Bounces marker when list view Location is clicked
                if (infoWindow !== undefined) {
                    infoWindow.close();
                }
                infoWindow = location.infoWindow;
                // Opens an info window on selected location name marker
                infoWindow.open(map, location.marker);
            }
            setTimeout(function() {
                location.marker.setAnimation(null);
            }, 1400);
        };
        //Foursquare api ajax request
        $.ajax({
            type: "GET",
            dataType: 'json',
            cache: false,
            url: 'https://api.foursquare.com/v2/venues/' + location.fourSqr_id + "?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + '&v=20170704',
            async: true,
            success: function(data) {
              	var key = data.response.venue;
                //bind infowindows to location in the markers array
                var infoWindow = new google.maps.InfoWindow({
                    content: contentString({
                        title: key.name,
                        formattedAddress: key.location.formattedAddress,
                        rating: key.rating,
                        formattedPhone: key.contact.formattedPhone,
                    })
                });
                location.infoWindow = infoWindow;
                location.marker.addListener('click', function() {
                    if (infoWindow !== undefined) {
                        infoWindow.close();
                    }
                    infoWindow = location.infoWindow;
                    location.infoWindow.open(map, this);
                    //adding bouncing effect to markers
                    location.marker.setAnimation(google.maps.Animation.BOUNCE);
                    setTimeout(function() {
                            location.marker.setAnimation(null);
                        },
                        2000); //markers will bounce for 2 seconds and then stop
                });
            },
            error: function(data) {
              alert('Unable to retrieve Foursquare data');
            }
        });
    });

    // Stores user input
    self.userInput = ko.observable('');
    //Filter through observableArray and filter results using knockouts utils.arrayFilter();
    self.searchFilter = ko.computed(function() {
        return ko.utils.arrayFilter(self.iceCreamSpots(), function(listResult) {
            var result = listResult.title.toLowerCase().indexOf(self.userInput().toLowerCase());
            //If-else statement used to display markers after meeting search criterion
            if (result === -1) {
                listResult.marker.setVisible(false);
            } else {
                listResult.marker.setVisible(true);
            }
            return result >= 0;
        });
    });
}

// Styling for Google Map
var mapStyles = [{
        "featureType": "water",
        "stylers": [{
                "saturation": 43
            },
            {
                "lightness": -11
            },
            {
                "hue": "#0088ff"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [{
                "hue": "#ff0000"
            },
            {
                "saturation": -100
            },
            {
                "lightness": 99
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [{
                "color": "#808080"
            },
            {
                "lightness": 54
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#ece2d9"
        }]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#ccdca1"
        }]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#767676"
        }]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": [{
            "color": "#ffffff"
        }]
    },
    {
        "featureType": "poi",
        "stylers": [{
            "visibility": "on"
        }]
    },
    {
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [{
                "visibility": "on"
            },
            {
                "color": "#EBE5E0"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "stylers": [{
            "visibility": "on"
        }]
    },
    {
        "featureType": "poi.sports_complex",
        "stylers": [{
            "visibility": "on"
        }]
    }
];

// Pops up a window if there is an error with the Google maps <script>.
var googleErrorHandler = function () {
  window.alert('Google Maps failed to load, Please try again later');
  return true;
};

//enabling knockout js and renders app on screen
function initApp() {
    initMap();
    ko.applyBindings(new ViewModel());
}