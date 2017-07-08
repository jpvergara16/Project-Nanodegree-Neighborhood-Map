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
	var self = this;
	//an array to store all the locations in
	this.locationList = ko.observableArray([]);

	//the list that will appear when being filtered by a keyword
	this.filter = ko.observable();

	//looping through each item in locations list and adding it to the array
	locations.forEach(function(locationItem) {
		self.locationList.push(new Location(locationItem));
	});

		//onclick event to open infoWindow updated to also toggleBounce
		location.marker.addListener('click', function() {
				populateInfoWindow(this,largeInfoWindow);
				toggleBounce(this);
			});

		bounds.extend(location.marker.position);


	map.fitBounds(bounds);

};

// Attribution for filter: http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
// Idea on how to organize it came from this blog with some modifications eg. display/hide markers
//It takes in a filter input
//if not input is given, displays all the locations and all the markers are set on the map
//if an input is given, it compares the input with the title of each location in locationList
//and also sets them on the map if they are true - this is after being placed in the locationList
//updated using indexOf rather than startsWith to make the filter less strict
this.filteredLocations = ko.computed(
	function() {
		var filter = self.filter();
		if (!self.filter()) {
			self.locationList().forEach(
				function(location) {
					location.marker.setMap(map);
				});
			return self.locationList();
		} else {
			return ko.utils.arrayFilter(self.locationList(),
				function(loc) {
					if (loc.title.toLowerCase().indexOf(
							filter.toLowerCase()) !== -1) {
						loc.marker.setMap(map);
					} else {
						loc.marker.setMap(null);
					}
					return loc.title.toLowerCase()
						.indexOf(filter.toLowerCase() !== -1);
				});
		}
	}, self);

	//bounce when location is clicked
	function toggleBounce(marker) {
		if (marker.getAnimation() !== null) {
			marker.setAnimation(null);
		} else {
			for (var i = 0; i < self.locationList().length; i++) {
				var mark = self.locationList()[i].marker;
				if (mark.getAnimation() !== null) {
					mark.setAnimation(null);
				}
			} marker.setAnimation(google.maps.Animation.BOUNCE);
		}
	}

	//initially sets the current location to the first item in locationList
	this.currentLocation = ko.observable(this.locationList()[0]);


	//this is where the location is set once it has been clicked on
	//it also makes the (marker bounce and infoWindow open when selected
	//from the list
	this.setLocation = function(clickedLocation) {
		toggleBounce(clickedLocation.marker);
		populateInfoWindow(clickedLocation.marker,largeInfoWindow);
		self.currentLocation(clickedLocation);
  };
};

var viewModel = new ViewModel();
ko.applyBindings(viewModel);

window.onresize = function() {
    // Idea from
    // http://stackoverflow.com/questions/10854179/how-to-make-window-size-observable-using-knockout
    viewModel.windowWidth(window.innerWidth);
};
