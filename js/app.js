/* === FOURSQUARE API CREDENTIALS === */
var client_id = 'GHE2SLTC2WDUUN2V0NGQ2JJUZW12DNKABZWYWPM1AU5PNO2V';
var client_secret = 'WRW1ETHIVCIU12KR05BRIUVCDITOLGMD2PTYZMRZ42FFZ3ZS';

// Global Variables
var map, info;
var markers = [];

/* ====== GOOGLEMAPS ======= */
var initMap = function () {
  // Create a map object and specify the DOM element for display.
  map = new google.maps.Map(document.getElementById('map'), {
    scrollwheel: false,
    zoom: 12,
    styles: mapStyles,
    mapTypeControl: false
  });

  info = new google.maps.InfoWindow();

  setMarkers(map, iceSpots);
};

// Adds markers to the map.
var setMarkers = function (map, topRatedList) {
  for (var i = 0; i < topRatedList.length; i++) {
    topRatedList[i].index = i;

    var fav = topRatedList[i];

    var marker = new google.maps.Marker({
      position: {lat: fav.location.lat, lng: fav.location.lng},
      map: map,
      title: fav.title,
      icon: 'img/icecream_mark.png',
      index: i,
    });

    addMarkerEvents(map, marker, fav);

    markers.push(marker);
  }
  map.setCenter({lat:33.696164,lng: -117.796927});
};

// Marker animation and click function
var addMarkerEvents = function (map, marker, fav) {
  marker.addListener('click', function () {
    map.setCenter(marker.getPosition());
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      marker.setAnimation(null);
    }, 1400);
    addFoursquare(fav);
    info.open(map, this);
  });
};

// Adds Foursquare info in Info Window for the specific marker.
var addFoursquare = function (fav) {
  var fourURL = 'https://api.foursquare.com/v2/venues/' + fav.fourSqr_id + '?client_id=' + client_id + '&client_secret=' + client_secret + '&v=20170704';

  $.getJSON(fourURL, function (data) {
    var key = data.response.venue;

    var contents ='<div class="info_content"><h3 class="info_title">' + key.name + '</h3>' +
    '<p><h5>Address: </h5>' + key.location.formattedAddress + '</p>' +
    '<p><h5>Rating: </h5>' + key.rating + '/10</p>' +
    '<hr>' +
    '<p><h6>Map Built With:</h6></p>'+
    '<a href="' + key.canonicalUrl + '" target="_blank"><img src="img/foursqr_logo.png" alt="Foursquare Link"></img></a>' +
    '<a href=https://developers.google.com/maps/ target="_blank"><img src="img/googlemaps.png" alt="Google Maps API Link"></img></a>' +
    '<a href=http://knockoutjs.com/ target="_blank"><img src="img/knockout.png" alt="Knockout JS Link"></img></a></div>';


    info.setContent(contents);
  })
    .fail(function () {
      info.setContent('Unable to retrieve Foursquare data');
    });

};

// Sets the map on all markers in the array.
function setMapOnAll (map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers () {
  clearMarkers();
  markers = [];
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers () {
  setMapOnAll(null);
}

// Triggers animation and info window for marker.
function triggerMarkerEvents (map, mark) {
  google.maps.event.trigger(mark, 'click');
}

/* ====== VIEWMODEL ======= */
var ViewModel = function () {
  var maxSectWidth = 767;
  var self = this;

  self.topRatedList = ko.observableArray([]);
  self.userInput = ko.observable('');

  // Populate observable array from ice cream locations.
  iceSpots.forEach(function (contentInfo) {
    self.topRatedList.push(contentInfo);
  });

  // Triggers animation and info window for marker when name of marker is clicked on
  self.markerEvents = function (mark) {
    triggerMarkerEvents(map, markers[mark.index]);
  };

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
      viewModel.windowWidth(window.innerWidth);
  };

  // Filters list and markers based on user input in the search bar.
  self.userInput.subscribe(function (loc) {

    // Runs code if the search bar is not blank.
    if (loc !== '') {
      var locLength = loc.length;

      // Clears observable array.
      self.topRatedList.removeAll();

      // Runs through each object in locations list to compare to user input.
      iceSpots.forEach(function (contentInfo) {
        var favTitle = contentInfo.title;

        // Runs through each letter in the location name.
        for (var i = 0; i < favTitle.length; i++) {
          var fav = '';

          // Adds on additional letters to match the user input string length.
          for (var j = 0; j < locLength; j++) {
            fav = fav + favTitle[i+j];
          }

          // Runs if the location name's string matches the user input's string.
          if (fav.toLowerCase() == loc.toLowerCase()) {
            // Adds location name to array and exits the loop for said location name.
            self.topRatedList.push(contentInfo);
            return;
          }
        }
      });

      // Clears markers from google maps and adds the new arrays.
      deleteMarkers();
      setMarkers(map, self.topRatedList());

    }else {
      // Clears observable array and then populates it with all of the locations lists' objects.
      self.topRatedList.removeAll();

      iceSpots.forEach(function (contentInfo) {
        self.topRatedList.push(contentInfo);
      });

      // Clears markers from google maps and adds the new arrays.
      deleteMarkers();
      setMarkers(map, self.topRatedList());
    }
  });
};

var viewModel = new ViewModel();

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

ko.applyBindings(viewModel);
