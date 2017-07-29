/* === FOURSQUARE API CREDENTIALS === */
var CLIENT_ID = 'GHE2SLTC2WDUUN2V0NGQ2JJUZW12DNKABZWYWPM1AU5PNO2V';
var CLIENT_SECRET = 'WRW1ETHIVCIU12KR05BRIUVCDITOLGMD2PTYZMRZ42FFZ3ZS';

// Global Variables
var map, infoWindow, viewModel;
var markers = [];

/* ====== GOOGLEMAPS ======= */
var initMap = function () {
  console.log("google maps initialized");
  var centreMap = {lat:33.696164,lng: -117.796927};
  // Create a map object and specify the DOM element for display.
  map = new google.maps.Map(document.getElementById('map'), {
    scrollwheel: false,
    zoom: 13,
    center: centreMap,
    styles: mapStyles,
    mapTypeControl: false
  });

  infoWindow = new google.maps.InfoWindow();

  for (var j = 0; j < iceCreamSpots.length; j++) {
      iceCreamSpots[j].zIndex = j;

      var fav = iceCreamSpots[j];

      var marker = new google.maps.Marker({
        position: {lat: fav.location.lat, lng: fav.location.lng},
        map: map,
        title: fav.title,
        icon: 'img/icecream_mark.png',
        zIndex: j,
        fourSquareID: fav.fourSqr_id,
      });

  markers.push(marker); //store marker info in markers array
  viewModel.topRatedList()[j].marker = marker;
  }
};

// Marker animation and click function
marker.addListener('click', function () {
  // show Foursquare info inside infowindow when clicked
  addFoursquare(this, infoWindow);
  infoWindow.open(map, this);
});

// Adds Foursquare info to infoWindow for the specific marker.
var addFoursquare = function (marker, infoWindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infoWindow.marker != marker) {
    infoWindow.marker = marker;
    infoWindow.setContent(marker.contents);
    // sets animation to bounce 2 times when marker is clicked
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
        marker.setAnimation(null);
    }, 1400);
    infoWindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infoWindow.addListener('closeclick', function() {
        infoWindow.setMarker = null;
    });
  }

  //Obtain foursquare info via JSON
  var fourURL = 'https://api.foursquare.com/v2/venues/' + marker.fourSquareID + '?client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&v=20170704';

  $.getJSON(fourURL, function (data) {
    console.log("foursquare info retrieved");
    var key = data.response.venue;

    var contents ='<div class="info_content"><h3 class="info_title">' + key.name + '</h3>' +
    '<p><h5>Address: </h5>' + key.location.formattedAddress + '</p>' +
    '<p><h5>Rating: </h5>' + key.rating + '/10</p>' +
    '<hr>' +
    '<p><h6>Map Built With:</h6></p>'+
    '<a href=https://foursquare.com/ target="_blank"><img src="img/foursqr_logo.png" alt="Foursquare Link"></img></a>' +
    '<a href=https://developers.google.com/maps/ target="_blank"><img src="img/googlemaps.png" alt="Google Maps API Link"></img></a>' +
    '<a href=http://knockoutjs.com/ target="_blank"><img src="img/knockout.png" alt="Knockout JS Link"></img></a></div>';

    infoWindow.setContent(contents);

    })
    .fail(function () {
    infoWindow.setContent('Unable to retrieve Foursquare data');
  });
};


// Triggers animation and info window for marker.
function triggerMarkerEvents (map, mark) {
  google.maps.event.trigger(marker, 'click');
}

/* === Locations constructor ==== */
var Location = function(data) {
  var self = this;
  this.title = data.title;
  this.location = data.location;
  this.showItem = ko.observable(true);
};

/* ====== VIEWMODEL ======= */
var ViewModel = function () {
  console.log("viewModel applied successfully");
  var maxSectWidth = 767;
  var self = this;

  //Tracks user input
  self.userInput = ko.observable('');
  //Stores all location info
  self.topRatedList = ko.observableArray([]);

  // Populate observable array from ice cream locations.
  for (i = 0; i < iceCreamSpots.length; i++) {
      var contentInfo = new Location(iceCreamSpots[i]);
      self.topRatedList.push(contentInfo);
  }

  // Triggers animation and info window for marker when name of marker is clicked on
  self.markerEvents = function (mark) {
    triggerMarkerEvents(map, markers[mark.zIndex]);
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

  //Filter by user input
  self.searchFilter = ko.computed(function() {
      var filter = self.userInput().toLowerCase(); // listens to what user types in to the input search bar
      // iterates through myLocations observable array
      for (j = 0; j < self.topRatedList().length; j++) {
        // it filters myLocations as user starts typing
          if (self.topRatedList()[j].title.toLowerCase().indexOf(filter) > -1) {
              self.topRatedList()[j].showItem(true); // shows locations according to match with user key words
              if (self.topRatedList()[j].marker) {
                  self.topRatedList()[j].marker.setVisible(true); // shows/filters map markers according to match with user key words
              }
          } else {
              self.topRatedList()[j].showItem(false); // hides locations according to match with user key words
              if (self.topRatedList()[j].marker) {

                  self.topRatedList()[j].marker.setVisible(false); // hides map markers according to match with user key words
              }
          }
      }
  });
};

viewModel = new ViewModel();

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