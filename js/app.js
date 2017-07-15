/* ====== VIEWMODEL ======= */
// Location function to call location properties
var Location = function(data) {
	var self = this;
	self.title = data.title;
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

    // BEHAVIOUR
    self.onLocClick = function(location, caller) {
        if (location === self.selectedLocation()) {
          self.selectedLocation('undefined');
        } else {
          self.selectedLocation(location);
				};
        // avoid circular reference
        if (caller !== map) {
        	markerClicked(location.mapMarker, location, viewModel);
				};
    };

		self.onFilter = function(om) {
		var markersToShow = [];
		var markersToHide = [];
		var filterTag = om.selectedFilter();
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

var viewModel = new ViewModel();
ko.applyBindings(viewModel);

window.onresize = function() {
    // Idea from http://stackoverflow.com/questions/10854179/how-to-make-window-size-observable-using-knockout
    viewModel.windowWidth(window.innerWidth);
};
