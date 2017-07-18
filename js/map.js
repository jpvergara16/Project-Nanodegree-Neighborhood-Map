/* ====== GOOGLEMAPS ======= */
/*
//Declare map variable
var map = {
  chart: null, // this will hold the map from Google
  infoWindow: null,
  //Declare initial marker animation
  currentAnimatedMarker: 'undefined',
  // Function populates infowindow when marker is clicked
  populateInfoWindow: function(marker, locationID) {
      if (this.infoWindow.marker != marker) {
          this.infoWindow.marker = marker;
          this.infoWindow.setContent('<p>Loading info for ' + marker.title + ' </p>');
          this.infoWindow.open(map, marker);
      } else {
          map.infoWindow.open(map, marker); // avoids info request from Foursquare
      }
  },

  markerClicked: function(marker, location, caller) {
        var markerAnimation = marker.getAnimation();
        // Quit the currently animated marker, if selected
        if (this.currentAnimatedMarker !== 'undefined') {
            this.currentAnimatedMarker.setAnimation(null);
        }
        // Stores a reference to this marker to quit when a marker is clicked again
        this.currentAnimatedMarker = marker;
        // if clicked marker was already animated, quit it
        if (markerAnimation !== null) {
            marker.setAnimation(null);
            map.infoWindow.close();
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            this.populateInfoWindow(marker, location.fourSqrID);
        }
        if (caller !== viewModel) {
            viewModel.onLocClick(location, map);
    }
    //functionality for filtering location markers
    function showMarkers(markers) {
        markers.forEach(function(marker) {
            marker.setVisible(true);
        });
    }
    function hideMarkers(markers) {
        markers.forEach(function(marker) {
            marker.setVisible(false);
        });
    }
  }
};

// Initialize map on load
function initMap() {
  // Constructor creates a new map
  map.chart = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 33.7455, lng: -117.8677},
    zoom: 11,
    styles: mapStyles,
    mapTypeControl: false
  });

  //Declare infowindow when map initializes
  map.infoWindow = new google.maps.InfoWindow();
  map.infoWindow.addListener('closeclick', function() {
        // Stop its marker's animation
      map.markerClicked(this.marker);
  });

  var addMarkerClicklistener = function(marker, location) {
     return function() {
         map.markerClicked(marker, location);
     };
  };

  // Loop through location array to create marker array on intialize
  var locations = viewModel.locations();
  for (var i = 0; i < locations.length; i++) {
    // Get position from location array
    var loc = locations[i];
    // Create marker per location & put markers into array.
    var mark = new google.maps.Marker({
      map: map.chart,
      position: loc.location,
      title: loc.title,
      icon: defaultIcon,
    });
    mark.setAnimation(null);
    loc.mapMarker = mark;
    mark.addListener('click', addMarkerClicklistener(mark, loc));
    // Two event listeners to change the colors back and forth.
    mark.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });
    mark.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });
  }
}
*/
// Build our map in the view
var buildMap = function() {
  map = new google.maps.Map(document.getElementById('map'), {
      zoom: 11,
      center: new google.maps.LatLng(33.7455, -117.8677),
      styles: mapStyles,
      mapTypeControl: false
    });
};

//  Set  up our map markers and extend bounds
function initMap(init, markers, infoWindow) {
  if (init) {
    buildMap();
  }

// Set our markers to null each time choice is made to clear markers
  for (var m = 0; m < markers().length; m++) {
      markers()[m].setMap(null);
  }

// Variables to create styled markers and extend map bounds
  var bounds = new google.maps.LatLngBounds();
  // Marker styles - this function takes in a COLOR, and then creates a new marker icon of that color.
  function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
  'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
  '|40|_|%E2%80%A2',
  new google.maps.Size(21, 34),
  new google.maps.Point(0, 0),
  new google.maps.Point(10, 34),
  new google.maps.Size(21,34));
  return markerImage;
}

  //Styling for markers, one for default, one for user mouse over.
  var defaultIcon = makeMarkerIcon('2F5F8F');
  var highlightedIcon = makeMarkerIcon('F0F5C3');

// Loop through the model and set Marker properties and info window content
  for (var i = 0; i < Model.length; i++) {
    var latlng = Model[i].position;
    var name = Model[i].name;
    var address = Model[i].address;
    var phone = Model[i].phone;
    var rating = Model[i].rating;
    var marker = new google.maps.Marker({
      title: name,
      position: latlng,
      map: map,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon,
      content: '<h2 style="margin-bottom: 0;">' + name + '</h2><h4>' + address[0] + '</br>' + address[1] + '</br>' + address[2] + '</h4><p style="font-weight: bold;">' + rating + '/10 Rating</p><a href="tel:"' + phone + '">' + phone + '</a>'
    });
    bounds.extend(Model[i].position);
    markers.push(marker);
    // Add event listeners for when markers are either clicked or focused on
      marker.addListener('click', function() {
        populateInfoWindow(this, infoWindow);
      });
      marker.addListener('mouseover', function() {
        this.setIcon(highlightedIcon);
      });
      marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
      });
    map.fitBounds(bounds);
  }
}

// Function populates the infowindow for when a marker on the map is interacted
function populateInfoWindow(marker, infowindow) {
  infowindow.marker = null;
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent(marker.content);
    infowindow.open(map, marker);
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
  }
}
//Error handling function when google maps api fails to return
function googleErrorHandler() {
	$('#map-error').html(
		'<h2>Unable to load Google Maps resources. Please try again later</h2>'
	);
}

var mapStyles = [
    {
        "featureType": "water",
        "stylers": [
            {
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
        "stylers": [
            {
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
        "stylers": [
            {
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
        "stylers": [
            {
                "color": "#ece2d9"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ccdca1"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#767676"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "poi",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#EBE5E0"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi.sports_complex",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    }
];

ko.applyBindings(viewModel);