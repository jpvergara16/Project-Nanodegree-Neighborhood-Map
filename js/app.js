// Create necessary map variables
var map,
infowindow,
markers = []; // array for listing markers

// Initialize map function
function initMap() {
  // styling for map
  var styles = [
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

  // Constructor creates a new map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 33.745472, lng: -117.867653},
    zoom: 11,
    styles: styles,
    mapTypeControl: false
  });

  // LatLng locations for restaurants
  var locations = [
    {
      title: 'Cham Sut Gol',
      location:{lat: 33.773451, lng: -117.969679}
    },
    {
      title: 'Gen Korean BBQ House',
      location:{lat : 33.7410417,lng : -117.8197316}
    },
    {
      title: 'Shik Do Rak',
      location : {lat : 33.6880437, lng : -117.7715683},
    },
    {
      title: 'Shik Do Rak',
      location : {lat : 33.7744226, lng : -117.9634719},
    },
    {
      title: 'Byul Daepo - Star BBQ',
      location:{lat : 33.7741566, lng : -117.9872909},
    },
    {
      title: 'Incheonwon BBQ House',
      location:{lat : 33.769312, lng : -117.9555207},
    },
    {
      title: 'Mr BBQ',
      location:{lat : 33.8726711, lng : -117.8899635},
    },
    {
      title: 'Cham Soot Gol',
      location:{lat : 33.8386232, lng : -117.994411},
    },
    {
      title: 'Mo Ran Gak Restaurant',
      location:{lat : 33.7742704, lng : -117.9642242},
    },
    {
      title: 'All That Barbeque',
      location:{lat : 33.6956663, lng : -117.7988465},
    }
  ];

  var largeInfowindow = new google.maps.InfoWindow();

  //Styling for markers, one for default, one for user mouse over.
  var defaultIcon = makeMarkerIcon('2F5F8F');
  var highlightedIcon = makeMarkerIcon('F0F5C3');

  // Loop through location array to create marker array on intialize
  for (var i = 0; i < locations.length; i++) {
    // Get position from location array
    var position = locations[i].location;
    var title = locations[i].title;
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
      populateInfoWindow(this, largeInfowindow);
    });
    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });
  }
}

// Function populates infowindow when marker is clicked
function populateInfoWindow(marker, infowindow) {
  // Check if infowindow is not already opened on current marker
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div>' + marker.title + '</div>');
    // Opens infowindowon correct marker
    infowindow.open(map, marker);
  }
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
