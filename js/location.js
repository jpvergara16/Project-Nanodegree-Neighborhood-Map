/* ====== MODEL ======= */
// LatLng locations for restaurants
var type = [
  'All Restaurants', //0
  'All-You-Can-Eat (AYCE)', //1
  'Casual Style Dining', //2
  'Asian Fusion', //3
  'Korean', //4
  'Japanese', //5
  'Chinese', //6
  'Filipino', //7
  'Vietnamese', //8
];

var resLocations = [
  {
      title: 'Cham Sut Gol',
      location: {
          lat: 33.773451,
          lng: -117.969679
      },
      tags: [type[0], type[1], type[4]],
  },
  {
      title: 'Gen Korean BBQ House',
      location: {
          lat: 33.741042,
          lng: -117.819732
      },
      tags: [type[0], type[1], type[4]],
  },
  {
      title: 'All That BBQ',
      location: {
          lat: 33.695666,
          lng: -117.798846
      },
      tags: [type[0], type[1], type[4]],
  },
  {
      title: 'Hashigo Korean Kitchen',
      location: {
          lat: 33.681637,
          lng: -117.886386
      },
      tags: [type[0], type[3], type[4]],
  },
  {
      title: 'Mr. BBQ',
      location: {
          lat: 33.872671,
          lng: -117.889964
      },
      tags: [type[0], type[1], type[4]],
  },
  {
      title: 'Tsuruhashi',
      location: {
          lat: 33.689935,
          lng: -117.953274
      },
      tags: [type[0], type[1], type[5]],
  },
  {
      title: 'Anjin',
      location: {
          lat: 33.681637,
          lng: -117.886386
      },
      tags: [type[0], type[1], type[5]],
  },
  {
      title: 'Manpuku Tokyo BBQ Dining',
      location: {
          lat: 33.679936,
          lng: -117.894240
      },
      tags: [type[0], type[1], type[5]],
  },
  {
      title: 'Yakiyan',
      location: {
          lat: 33.990500,
          lng: -117.932355
      },
      tags: [type[0], type[3], type[5]],
  },
  {
      title: 'Gyu-Kaku Japanese BBQ',
      location: {
          lat: 33.734783,
          lng: -117.826103
      },
      tags: [type[0], type[1], type[5]],
  },
  {
      title: 'Sam Woo Restaurant & BBQ Express',
      location: {
          lat: 33.695666,
          lng: -117.798846
      },
      tags: [type[0], type[2], type[6]],
  },
  {
      title: 'Lien Hoa BBQ Deli',
      location: {
          lat: 33.745411,
          lng: -117.966756
      },
      tags: [type[0], type[2], type[6]],
  },
  {
      title: 'Baos Hog',
      location: {
          lat: 33.760399,
          lng: -117.954600
      },
      tags: [type[0], type[3], type[6]],
  },
  {
      title: 'Leung Kee',
      location: {
          lat: 33.995297,
          lng: -117.890434
      },
      tags: [type[0], type[2], type[6]],
  },
  {
      title: 'Trieu Chau Restaurant',
      location: {
          lat: 33.745371,
          lng: -117.927947
      },
      tags: [type[0], type[2], type[6], type[8]],
  },
  {
      title: 'Mix Mix Kitchen Bar',
      location: {
          lat: 33.747273,
          lng: -117.867959
      },
      tags: [type[0], type[2], type[7]],
  },
  {
      title: 'Grill City',
      location: {
          lat: 33.699750,
          lng: -117.835010
      },
      tags: [type[0], type[2], type[7]],
  },
  {
      title: 'Cucina De Lipa',
      location: {
          lat: 33.787503,
          lng: -117.871837
      },
      tags: [type[0], type[2], type[7]],
  },
  {
      title: 'Irenia',
      location: {
          lat: 33.748231,
          lng: -117.869867
      },
      tags: [type[0], type[2], type[7]],
  },
  {
      title: 'Kapamilya Restaurant',
      location: {
          lat: 33.716213,
          lng: -117.937939
      },
      tags: [type[0], type[2], type[7]],
  },
  {
      title: 'Brodard Restaurant',
      location: {
          lat: 33.758307,
          lng: -117.956627
      },
      tags: [type[0], type[2], type[8]],
  },
  {
      title: 'Ha Long Vietnamese Cuisine',
      location: {
          lat: 33.684177,
          lng: -117.811984
      },
      tags: [type[0], type[2], type[8]],
  },
  {
      title: 'Com Tam Tran Quy Cap',
      location: {
          lat: 33.728449,
          lng: -117.920393
      },
      tags: [type[0], type[3], type[8]],
  },
  {
      title: 'Kim Huong Vietnamese and Chinese Restaurant',
      location: {
          lat: 33.734165,
          lng: -117.827683
      },
      tags: [type[0], type[2], type[8], type[6]],
  },
  {
      title: 'Com Tam Thuan Kieu',
      location: {
          lat: 33.755364,
          lng: -117.954370
      },
      tags: [type[0], type[3], type[8]],
  },
];