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

    self.selectedLocation = ko.observable(undefined); // updated when user clicks on a location

    // to detect when window is resized
    self.windowWidth = ko.observable(window.innerWidth);
    // will be used to hide intro and filter section when browser is shrinked
    // or page is loaded from a small device
    self.HideSect = ko.observable(self.windowWidth() < maxSectWidth);

    // BEHAVIOUR
    self.onLocClick = function(location, caller) {
        if (location === self.selectedLocation())
            self.selectedLocation('undefined');
        else
            self.selectedLocation(location);
        // avoid circular reference
        if (caller !== map)
            map.onMarkerClick(location.mapMarker, location, viewModel);
    };

    self.windowIsSmall = function() {
      return self.windowWidth() < maxSectWidth;
    };

};

var viewModel = new ViewModel();
ko.applyBindings(viewModel);

window.onresize = function() {
    // Idea from
    // http://stackoverflow.com/questions/10854179/how-to-make-window-size-observable-using-knockout
    viewModel.windowWidth(window.innerWidth);
};
