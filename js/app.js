/* ====== MODEL ======= */
// Global variables
var self = this;
var map, infoWindow;

// Creating our resLocations list - which holds all locations info( name, position, address, phone )
var Model = [];

/* ====== VIEWMODEL ======= */
var ViewModel = function() {
  var maxSectWidth = 767;
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

	// to detect when window is resized
	self.windowWidth = ko.observable(window.innerWidth);
	// hides intro and filter section when browser is at certain size
	self.hideSect = ko.observable(self.windowWidth() < maxSectWidth);

  // Observables for food choices
  self.food = ['Korean', 'Japanese', 'Chinese', 'Vietnamese', 'Filipino'];
  self.foodChoice = ko.observable('Korean');
  self.foodChoice.subscribe(function(newValue) {
    updateMap(self.foodChoice, self.allVenues, true, self.markers, infoWindow);
  });
  updateMap(self.foodChoice, self.allVenues, false, self.markers, infoWindow);

// Populate the marker of the Venue selected from the list
  self.populateInfoFromItem = function(item) {
    var marker = self.markers().find((mk) => {
      return mk.title === item.name;
    });
    populateInfoWindow(marker, infoWindow);
  };

	self.viewIsSmall = function() {
		return self.windowWidth() < maxSectWidth;
	};
};

// Filter the list of venues in the DOM into a new observableArray
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

// Updating our map with markers and locations from the model
// We are fetching data based on the user's food selection in the DOM
var updateMap = function(foodChoice, allVenues, init, markers, infoWindow) {

// Provide client id, client secret, and set up foursquare api
// Foursqure Api necessities
  var client_id = 'GHE2SLTC2WDUUN2V0NGQ2JJUZW12DNKABZWYWPM1AU5PNO2V';
  var client_secret = 'WRW1ETHIVCIU12KR05BRIUVCDITOLGMD2PTYZMRZ42FFZ3ZS';
  var base_url = 'https://api.foursquare.com/v2/';
  var endpoint = 'venues/explore?&near=3900+Parkview+Ln+Irvine+CA&query=' + foodChoice() + '&limit=15';
  var key = '&client_id=' + client_id + '&client_secret=' + client_secret + '&v=' + '20170704';
  var url = base_url+endpoint+key;

// AJAX request from foursquare to populate our Model
  $.getJSON(url, function( data ) {

    Model = [];
    var foursquareLoc = data.response.groups[0].items;

  // Loop through the foursquare data and push each item into the Model
    for (i = 0; i < foursquareLoc.length; i++) {
    // Store our data variables for later use
      var name = foursquareLoc[i].venue.name;
      var lat = foursquareLoc[i].venue.location.lat;
      var lng = foursquareLoc[i].venue.location.lng;
      var position = {lng, lat};
      var address = foursquareLoc[i].venue.location.formattedAddress;
      var phone = foursquareLoc[i].venue.contact.formattedPhone;
      var rating = foursquareLoc[i].venue.rating;
    // Push our items returned to the model
      Model.push({
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

  // Push each item in Model to the allVenues array and remove after each food choice chosen
    allVenues.removeAll();
    Model = Model.sort(function(a, b) {
      return a.name > b.name ? 1 : -1;
    });
    Model.forEach((item) => {
      allVenues.push(item);
    });
// Alert fail if data is unable to be retrieved from foursquare
  }).fail(function () {
    alert("Data failed to retrieve!");
  });
};

var viewModel = new ViewModel();
ko.applyBindings(viewModel);

window.onresize = function() {
    // Idea from http://stackoverflow.com/questions/10854179/how-to-make-window-size-observable-using-knockout
    viewModel.windowWidth(window.innerWidth);
};

/*// Location function to call location properties
var Location = function(data) {
	var self = this;
	self.title = data.title;
	self.tags = data.type;
	self.location = data.location;
	self.mapMarker = null; // mapMarker will be updated when map markers are created
	self.visible = ko.observable(true); // this property will allow to filter the list of locations in UI
	return self;
};

var ViewModel = function() {
    var maxSectWidth = 767;
    var self = this;
    self.locations = new ko.observableArray([]);

    resLocations.forEach(function(location) {
      self.locations.push(new Location(location));
    });

		self.tags = ko.observableArray(type); // type filtering is displayed in UI drop down
    self.selectedFilter = ko.observable('undefined'); // updated when user selects a new tag from the drop down
    self.selectedLocation = ko.observable(undefined); // updated when user clicks on a location

    // to detect when window is resized
    self.windowWidth = ko.observable(window.innerWidth);
    // hides intro and filter section when browser is at certain size
    self.hideSect = ko.observable(self.windowWidth() < maxSectWidth);

    // BEHAVIOR
    self.onLocClick = function(location, caller) {
        if (location === self.selectedLocation()) {
          self.selectedLocation('undefined');
        } else {
          self.selectedLocation(location);
				}
        // avoid circular reference
        if (caller !== map) {
        	map.markerClicked(location.mapMarker, location, viewModel);
				}
    };

		self.onFilter = function(vm) {
		var filterTag = vm.selectedFilter();
		var markersToShow = [];
		var markersToHide = [];
		for (var i = 0; i < self.locations().length; i++) {
				var currentLocation = self.locations()[i];
				if (currentLocation.tags.includes(filterTag)) {
						currentLocation.visible(true);
						markersToShow.push(currentLocation.mapMarker);
				} else {
						currentLocation.visible(false);
						markersToHide.push(currentLocation.mapMarker);
				}
			}
			map.showMarkers(markersToShow);
			map.hideMarkers(markersToHide);
    };

		//filters selection when called
		self.hideFilterSection = function() {
		 self.hideSect(true);
	 	};

	 	self.showFilterSection = function() {
		 self.hideSect(false);
	 	};

    self.viewIsSmall = function() {
      return self.windowWidth() < maxSectWidth;
    };

};
