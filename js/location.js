/* ====== MODEL ======= */
// LatLng locations for restaurants
var type = [
  'All Restaurants', //0
  'All-You-Can-Eat (AYCE)', //1
  'Casual Style Dining', //2
  'Korean', //3
  'Japanese', //4
  'Chinese', //5
  'Filipino', //6
  'Vietnamese', //7
  'Mongolian', //8
];

var resLocations = [{
      title: 'Cham Sut Gol',
      location: {
          lat: 33.773451,
          lng: -117.969679
      },
      tags: [type[0], type[1], type[3]],
  },
  {
      title: 'Anjin',
      location: {
          lat: 33.681637,
          lng: -117.886386
      },
      tags: [type[0], type[1], type[4]],
  },
  {
      title: 'Gen Korean BBQ House',
      location: {
          lat: 33.7410417,
          lng: -117.8197316
      },
      tags: [type[0], type[1], type[3]],
  },
  {
      title: 'Manpuku Tokyo BBQ Dining',
      location: {
          lat: 33.679936,
          lng: -117.894240
      },
      tags: [type[0], type[2], type[4]],
  },
  {
      title: 'Shik Do Rak',
      location: {
          lat: 33.6880437,
          lng: -117.7715683
      },
      tags: [type[0], type[1], type[3]],
  },
  {
      title: 'Shik Do Rak',
      location: {
          lat: 33.7744226,
          lng: -117.9634719
      },
      tags: [type[0], type[1], type[3]],
  },
  {
      title: 'Gyukaku Japanese BBQ',
      location: {
          lat: 33.734783,
          lng: -117.826103
      },
      tags: [type[0], type[1], type[4]],
  },
  {
      title: 'Byul Daepo - Star BBQ',
      location: {
          lat: 33.7741566,
          lng: -117.9872909
      },
      tags: [type[0], type[1], type[3]],
  },
  {
      title: 'Makino Sushi & Seafood Buffet',
      location: {
          lat: 33.685049,
          lng: -117.856732
      },
      tags: [type[0], type[1], type[4]],
  },
  {
      title: 'Hamamori Restaurant and Sushi Bar',
      location: {
          lat: 33.692055,
          lng: -117.892900
      },
      tags: [type[0], type[2], type[4]],
  }
];