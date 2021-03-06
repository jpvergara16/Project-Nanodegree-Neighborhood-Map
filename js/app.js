/* === FOURSQUARE API CREDENTIALS === */
var CLIENT_ID = 'GHE2SLTC2WDUUN2V0NGQ2JJUZW12DNKABZWYWPM1AU5PNO2V';
var CLIENT_SECRET = 'WRW1ETHIVCIU12KR05BRIUVCDITOLGMD2PTYZMRZ42FFZ3ZS';

// Global Variables
var map, infoWindow, bounds;

/* ====== GOOGLEMAPS ======= */
function initMap() {
    console.log("google maps initialized");
    var centreMap = {
        lat: 33.696164,
        lng: -117.796927
    };
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
    this.fourSquareID = data.fourSqr_id;
    this.address = '';
    this.rating = '';
    this.phone = '';

    this.visible = ko.observable(true);

    // get JSON request of foursquare data
    var fourURL = 'https://api.foursquare.com/v2/venues/' + this.fourSquareID + '?client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&v=20170704';

    $.getJSON(fourURL).done(function(data) {
        console.log("foursquare info retrieved");
        var key = data.response.venue;

        self.address = key.location.formattedAddress;
        self.rating = key.rating;
        self.phone = key.contact.formattedPhone || "<p style='color:red;font-weight:bold'>No phone number available</p>";

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

    self.filterMarkers = ko.computed(function() {
        // set marker and extend bounds (showListings)
        if (self.visible() === true) {
            self.marker.setMap(map);
            bounds.extend(self.marker.position);
            google.maps.event.addDomListener(window, 'resize', function() {
                map.fitBounds(bounds); // `bounds` is a `LatLngBounds` object
            });
        } else {
            self.marker.setMap(null);
        }
    });

    // Opens an info window on selected location on clicked marker
    this.marker.addListener('click', function() {
        populateInfoWindow(this, self.address, self.rating, self.phone, infoWindow);
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

//function for marker bounce animation
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
    var maxSectWidth = 767;
    var self = this;

    // Stores user input
    this.userInput = ko.observable('');
    this.topRatedList = ko.observableArray([]);

    // get the locations from iceCreamSpots array & stores them in an observable array
    iceCreamSpots.forEach(function(location) {
        self.topRatedList.push(new Location(location));
    });

    // to detect when window is resized
    self.windowWidth = ko.observable(window.innerWidth);
    // hides intro section when browser is at certain size
    self.hideSect = ko.observable(self.windowWidth() < maxSectWidth);
    self.hideFilterSection = function() {
        self.hideSect(true);
    };

    self.showFilterSection = function() {
        self.hideSect(false);
    };

    self.viewIsSmall = function() {
        return self.windowWidth() < maxSectWidth;
    };

    window.onresize = function() {
        // Idea from http://stackoverflow.com/questions/10854179/how-to-make-window-size-observable-using-knockout
        self.windowWidth(window.innerWidth);
    };

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
function populateInfoWindow(marker, address, rating, phone, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        // Sets default infowindow content to give the streetview time to load.
        infowindow.setContent('<p>Loading foursquare data...<p>');
        infowindow.marker = marker;

        // TODO: fix proper streetview functionality
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });

        var mainContent = '<div class="info_content"><h4 class="info_title">' + marker.title + '</h4>' + '<p><h5>Address: </h5>' + address + '</p>' + '<p><h5>Rating: </h5>' + rating + '/10</p>' + '<p><h5>Phone: </h5>' + phone + '</p>';
        //sets content to be mainContent string
        infowindow.setContent(mainContent);
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
function googleErrorHandler() {
    window.alert('Google Maps failed to load, Please try again later');
    return true;
}