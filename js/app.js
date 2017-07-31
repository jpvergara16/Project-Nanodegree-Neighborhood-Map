/* === FOURSQUARE API CREDENTIALS === */
var CLIENT_ID = 'GHE2SLTC2WDUUN2V0NGQ2JJUZW12DNKABZWYWPM1AU5PNO2V';
var CLIENT_SECRET = 'WRW1ETHIVCIU12KR05BRIUVCDITOLGMD2PTYZMRZ42FFZ3ZS';

// Global Variables
var map, infoWindow, bounds;

/* ====== GOOGLEMAPS ======= */
function initMap() {
  console.log("google maps initialized");
  var centreMap = {lat:33.696164,lng: -117.796927};
    map = new google.maps.Map(document.getElementById('map'), {
        scrollwheel: false,
        zoom: 13,
        center: centreMap,
        styles: mapStyles,
        mapTypeControl: false
    });

    infoWindow = new google.maps.InfoWindow();

    bounds = new google.maps.LatLngBounds();

    ko.applyBindings(new ViewModel());
}

/* === Location constructor ==== */
var Location = function(data) {
    var self = this;

    this.title = data.title;
    this.position = data.location;
    this.id = data.fourSqr_id;
    this.street = '';
    this.city = '';
    this.phone = '';

    this.visible = ko.observable(true);

    // get JSON request of foursquare data
    var reqURL = 'https://api.foursquare.com/v2/venues/search?ll=' + this.position.lat + ',' + this.position.lng + '&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&v=20170704' + '&query=' + this.title;

    $.getJSON(reqURL).done(function(data) {
    console.log("foursquare info retrieved");
		var results = data.response.venues[0];
        self.street = results.location.formattedAddress[0] ? results.location.formattedAddress[0]: 'N/A';
        self.city = results.location.formattedAddress[1] ? results.location.formattedAddress[1]: 'N/A';
        self.phone = results.contact.formattedPhone ? results.contact.formattedPhone : 'N/A';
    }).fail(function() {
        alert('Something went wrong with foursquare');
    });

    // Create a marker per location, and put into markers array
    this.marker = new google.maps.Marker({
        position: this.position,
        title: this.title,
        animation: google.maps.Animation.DROP,
        icon: 'img/icecream_mark.png'
    });

    self.filterMarkers = ko.computed(function () {
        // set marker and extend bounds (showListings)
        if(self.visible() === true) {
            self.marker.setMap(map);
            bounds.extend(self.marker.position);
            map.fitBounds(bounds);
        } else {
            self.marker.setMap(null);
        }
    });

    // Opens an info window on selected location on clicked marker
    this.marker.addListener('click', function() {
        populateInfoWindow(this, self.street, self.city, self.phone, infoWindow);
        toggleBounce(this);
        // Pans the map view to selected marker when list view Location is clicked
        map.panTo(this.getPosition());
    });

    // show item info when selected from list
    this.markerEvents = function(location) {
        google.maps.event.trigger(self.marker, 'click');
    };

    // creates bounce effect when item selected
    this.bounce = function(place) {
		google.maps.event.trigger(self.marker, 'click');
	};

};

function toggleBounce(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
        marker.setAnimation(null);
    }, 1400);
  }
}

/* ====== VIEWMODEL ======= */
var ViewModel = function() {
    console.log("ViewModel applied successfully");
    var self = this;

    // Stores user input
    this.userInput = ko.observable('');
    this.topRatedList = ko.observableArray([]);

    // get the locations from iceCreamSpots array & stores them in an observable array
    iceCreamSpots.forEach(function(location) {
        self.topRatedList.push( new Location(location) );
    });

    //Filter through observableArray and filter results using knockouts utils.arrayFilter();
    this.searchFilter = ko.computed(function() {
        var filter = self.userInput().toLowerCase();
        if (filter) {
            return ko.utils.arrayFilter(self.topRatedList(), function(location) {
                var str = location.title.toLowerCase();
                var result = str.includes(filter);
                location.visible(result);
				return result;
			});
        }
        self.topRatedList().forEach(function(location) {
            location.visible(true);
        });
        return self.topRatedList();
    }, self);
};

// This function populates the infowindow when the marker is clicked. We'll only allow
function populateInfoWindow(marker, street, city, phone, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        // Sets default infowindow content to give the streetview time to load.
        infowindow.setContent('<p>Loading foursquare data...<p>');
        infowindow.marker = marker;

        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;

        var windowContent = '<h4>' + marker.title + '</h4>' +
            '<p>' + street + "<br>" + city + '<br>' + phone + "</p>";

        // In case the status is OK, which means the pano was found, compute the
        // position of the streetview image, then calculate the heading, then get a
        // panorama from that and set the options
        var getStreetView = function (data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
                var nearStreetViewLocation = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(
                    nearStreetViewLocation, marker.position);
                infowindow.setContent(windowContent + '<div id="pano"></div>');
                var panoramaOptions = {
                    position: nearStreetViewLocation,
                    pov: {
                        heading: heading,
                        pitch: 20
                    }
                };
                var panorama = new google.maps.StreetViewPanorama(
                    document.getElementById('pano'), panoramaOptions);
            } else {
                infowindow.setContent(windowContent + '<div style="color: red">No Street View Found</div>');
            }
        };
        // Use streetview service to get the closest streetview image within
        // 50 meters of the markers position
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
    }
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
