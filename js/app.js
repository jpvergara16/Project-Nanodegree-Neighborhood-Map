//Initiates data binding & map when page loads
$(document).ready(function() {
/* ====== MODEL ======= */
// Global variables
  var self = this;
  var map, infoWindow;

// Array to hold all location info
  var resLocations = [];

/* ====== VIEWMODEL ======= */
  var ViewModel = function() {

    var self = this;

    var infoWindow = new google.maps.InfoWindow();

    self.allVenues = ko.observableArray();
    self.filteredVenues = ko.observableArray();
    self.markers = ko.observableArray([]);
    self.filter = ko.observable('');
    self.allVenues.subscribe(function(newValue) {
      filterFunction(self.filter(), self.allVenues, self.filteredVenues, self.markers);
    });
    self.filter.subscribe(function(newValue) {
      filterFunction(newValue, self.allVenues, self.filteredVenues, self.markers);
    });

    // Observables for food selections
    self.food = ['Korean', 'Japanese', 'Chinese', 'Filipino', 'Vietnamese', 'Mongolian'];
    self.foodSelect = ko.observable('Korean');
    self.foodSelect.subscribe(function(newValue) {
      updateMap(self.foodSelect, self.allVenues, true, self.markers, infoWindow);
    });
    updateMap(self.foodSelect, self.allVenues, false, self.markers, infoWindow);

  //Populates the marker of the Venue selected from the list
    self.populateInfoFromItem = function(item) {
      var marker = self.markers().find((mk) => {
        return mk.title === item.name;
      });
      populateInfoWindow(marker, infoWindow);
    };

  };


//functionality for filtering location in the DOM
  var filterFunction = function(term, allVenues, filteredVenues, markers) {
    term = term.toUpperCase();
    let tempArray = allVenues().filter((item) => {
      return term ? (item.name.toUpperCase()).indexOf(term) > -1 : true;
    });
    filteredVenues.removeAll();
    tempArray.forEach((item) => {
      filteredVenues.push(item);
    });
  };


//Updating map with marker & location data. Locations based on the user food selection
  var updateMap = function(foodSelect, allVenues, init, markers, infoWindow) {
  /* === FOURSQUARE API CREDENTIALS === */
    var client_id = 'GHE2SLTC2WDUUN2V0NGQ2JJUZW12DNKABZWYWPM1AU5PNO2V';
    var client_secret = 'WRW1ETHIVCIU12KR05BRIUVCDITOLGMD2PTYZMRZ42FFZ3ZS';
    var base_url = 'https://api.foursquare.com/v2/';
    var endpoint = 'venues/explore?&near=Irvine+CA&query=' + foodSelect() + '&limit=15';
    var key = '&client_id=' + client_id + '&client_secret=' + client_secret + '&v=' + '20170704';
    var url = base_url+endpoint+key;

  // AJAX request from foursquare to populate our resLocations array
    $.getJSON(url, function( data ) {
      resLocations = [];
      var foursquareLoc = data.response.groups[0].items;

    //Loop through the foursquare data and push each item into the Model
      for (i = 0; i < foursquareLoc.length; i++) {
      // Store our data variables for later use
        var name = foursquareLoc[i].venue.name;
        var lat = foursquareLoc[i].venue.location.lat;
        var lng = foursquareLoc[i].venue.location.lng;
        var position = {lng, lat};
        var address = foursquareLoc[i].venue.location.formattedAddress;
        var phone = foursquareLoc[i].venue.contact.formattedPhone;
        var rating = foursquareLoc[i].venue.rating;
      // Push our items returned to the locations array
        resLocations.push({
          name: name,
          position: position,
          address: address,
          phone: phone,
          rating: rating
        });
      }

      if (!init) {
        var map = initMap(true, markers, infoWindow);
      } else {
        initMap(false, markers, infoWindow);
      }

    // Push each item in resLocations array to the allVenues array and remove after each food choice chosen
      allVenues.removeAll();
      resLocations = resLocations.sort(function(a, b) {
        return a.name > b.name ? 1 : -1;
      });
      resLocations.forEach((item) => {
        allVenues.push(item);
      });

  // Alert fail if data is unable to be retrieved from foursquare
    }).fail(function () {
      alert("Failed to retreive data!");
    });
  };


/* ====== GOOGLEMAPS ======= */
  var buildMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: new google.maps.LatLng(33.7455, -117.8677),
        styles: mapStyles,
        mapTypeControl: false
      });
  };

// intialize markers on load and extend bounds
  function initMap(init, markers, infoWindow) {
    if (init) {
      buildMap();
    }

  // Set our markers to null each time choice is made to clear markers
    for (var i = 0; i < markers().length; i++) {
        markers()[i].setMap(null);
    }
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

  // Loop through the locaitons array and set marker info for info window content
    for (var i = 0; i < resLocations.length; i++) {
      var locations = resLocations[i];
      var latlng = locations.position;
      var name = locations.name;
      var address = locations.address;
      var phone = locations.phone;
      var rating = locations.rating;
      var marker = new google.maps.Marker({
        title: name,
        position: latlng,
        map: map,
        animation: google.maps.Animation.DROP,
        icon: defaultIcon,
        content: '<h2 style="margin-bottom: 0;">' + name + '</h2><h4>' + address[0] + '</br>' + address[1] + '</br>' + address[2] + '</h4><p style="font-weight: bold;">' + rating + '/10 Rating</p><a href="tel:"' + phone + '">' + phone + '</a>'
      });
      bounds.extend(resLocations[i].position);
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

  // simple function populates the infowindow when marker is clicked
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

  ko.applyBindings(new ViewModel());
});
