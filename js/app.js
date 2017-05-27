// Initialize map function
var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 33.745472, lng: -117.867653},
    zoom: 11
  });
  var tribeca = {lat: 33.773451, lng: -117.969679};
  var marker = new google.maps.Marker({
    position: tribeca,
    map: map,
    title: 'Top Rated KBBQ In Orange County! Cham Soot Gol'
  });
}