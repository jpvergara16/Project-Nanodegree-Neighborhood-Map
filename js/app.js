/* ====== VIEWMODEL ======= */
// Location function to call location properties
var Location = function(data) {
	this.title = data.title;
	this.location = data.location;
};

var ViewModel = function() {
	var self = this;
	//an array to store all the locations in
	this.locationList = ko.observableArray(
		[]);

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