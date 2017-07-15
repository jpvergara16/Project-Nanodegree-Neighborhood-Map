/* ====== GOOGLEMAPS ======= */
var map;
var markers = [];

// Initialize map function
function initMap() {
  // Constructor creates a new map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 33.745472, lng: -117.867653},
    zoom: 11,
    styles: mapStyles,
    mapTypeControl: false
  });

  //Declare info window when map initializes
  var newInfoWindow = new google.maps.InfoWindow();
  //Declare initial marker animation
  var currentAnimatedMarker = 'undefined';

  // Loop through location array to create marker array on intialize
  for (var i = 0; i < resLocations.length; i++) {
    // Get position from location array
    var position = resLocations[i].location;
    var title = resLocations[i].title;
    // Create marker per location & put markers into array.
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon,
      id: i
    });
    //Pushes the marker to marker array
    markers.push(marker);
    // Creates onclick event to open infowindow for each marker
    marker.addListener('click', function() {
      populateInfoWindow(this, newInfoWindow);
    });
    //Styling for markers, one for default, one for user mouse over.
    var defaultIcon = makeMarkerIcon('2F5F8F');
    var highlightedIcon = makeMarkerIcon('F0F5C3');
    // Two event listeners - one for mouseover, one for mouseout, to change the colors back and forth.
    marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });
  }

  function onMarkerClick(marker, location, caller) {
        var markerAnimation = marker.getAnimation();
        // Quit the currently animated marker, if selected
        if (this.currentAnimatedMarker !== 'undefined')
            this.currentAnimatedMarker.setAnimation(null);
        // Store a reference to this marker, to quit when a marker is clicked again
        this.currentAnimatedMarker = marker;
        // if clicked marker was already animated, quit it
        if (markerAnimation !== null) {
            marker.setAnimation(null);
            map.infoWindow.close();
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
        if (caller !== viewModel)
            viewModel.onItemClick(location, map);
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

// Function populates infowindow when marker is clicked
function populateInfoWindow(marker, infoWindow) {
    var infoWindow = newInfoWindow;
    if (infoWindow.marker != marker) {
        infoWindow.marker = marker;
        infoWindow.open(map, marker);
    } else {
        infoWindow.setContent('<div>' + marker.title + '</div>' +
            '<div>No Street View Found</div>');
    }
    // Make sure the marker property is cleared if the infowindow is closed.
    infoWindow.addListener('closeclick', function() {
        infowindow.marker = null;
        infowindow.close();
        marker.setAnimation(null);
    });
}


// This function takes in a COLOR, and then creates a new marker icon of that color.
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

//Error handling function when google maps api fails to return
function googleErrorHandler() {
	$('#map-error').html(
		'<h2>Unable to load Google Maps resources. Please try again later</h2>'
	);
}

//hamburger menu functionality from udacity's
//responsive web design fundamentals
//updated to use knockout click binding
var main = document.querySelector(
	'.main');
var drawer = document.querySelector(
	'#drawer')

//when the menu icon is clicked, the filter menu slides in
//and the map/menu shift to the right
this.openMenu = function() {
	drawer.classList.toggle('open');
	main.classList.toggle('moveRight');
};

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

