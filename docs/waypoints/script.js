$('input[name="dates"]').daterangepicker({
   opens: 'center',
   timePicker: true,
   startDate: moment().startOf('day'),
   endDate: moment().endOf('day'),
   alwaysShowCalendars: true,
   ranges: {
      'Today': [moment().startOf('day'), moment().endOf('day')],
      'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
      'Last 7 Days': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
      'Last 30 Days': [moment().subtract(29, 'days').startOf('day'), moment().endOf('day')],
      'This Month': [moment().startOf('month').startOf('day'), moment().endOf('month').endOf('day')],
      'Last Month': [moment().subtract(1, 'month').startOf('month').startOf('day'), moment().subtract(1, 'month').endOf('month').endOf('day')]
   }
}, function (start, end) {
   parseData(start, end)
});

const mapboxUrl = 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
var map;
var locations = [];
var locationsView = [];

fetch('https://crud-app-y50p.onrender.com/get?uid=car-VERNA&rawoutput=true').then(res => {
   res.text().then(data => {
      locations = data.split('\n').map(r => {
         rec = r.slice(1, r.length - 1).split('][');
         return {
            car: rec[1],
            time: new Date(parseInt(rec[2]) * 1000),
            lat: parseFloat(rec[4].split(',')[0]),
            lng: parseFloat(rec[4].split(',')[1]),
            acc: rec[5],
            alt: rec[6],
            link: rec[7],
         }
      }).filter(r => r.car === 'VERNA').reverse().sort((a, b) => a.time - b.time);
      locations = _.unique(locations, (l) => (l.lat, l.lng));
      parseData();
   })
})

function parseData(start, end) {
   console.log('new', start, end)
   locationsView = locations.filter(loc => !start || !end || (start <= loc.time && loc.time <= end))
   construct();
   setMap(locationsView);
}

function construct() {
   if (map) {
      map.remove()
   }

   map = L.map('map', {
      center: [20.5937, 78.9629],
      zoom: 6
   });
   L.tileLayer(mapboxUrl).addTo(map);
}

function setMap(locations) {

   controller = L.Routing.control({
      "type": "LineString",
      waypoints: locations.map(l => L.latLng(l.lat, l.lng)),
   }).addTo(map)
      .on('routingerror', function (e) {
         try {
            map.getCenter();
         } catch (e) {
            map.fitBounds(L.latLngBounds(waypoints));
         }
         handleError(e);
      });
   controller.on('routesfound', function (e) {
      var routes = e.routes;
      var summary = routes[0].summary;
      // alert distance and time in km and minutes
      console.log(routes[0]);
      $('#summary').html(`<b>${routes[0].name}</b><br>${Math.round(summary.totalDistance / 10, 2) / 100} km, ${Math.round(summary.totalTime % 3600 / 60)} minutes`);
   });
   locations.forEach((l, i) => {
      markers = L.marker([l.lat, l.lng], {
         title: `#${i + 1} ${i === 0 ? 'Start' : i === locations.length - 1 ? 'End' : ''}`
      }).addTo(map)
         .bindPopup(`<center>#${i + 1} ${i === 0 ? 'Start' : i === locations.length - 1 ? 'End' : ''}<br>${moment(l.time).fromNow()}<br>${moment(l.time).calendar()}<br>${moment(l.time).format("MMM Do YY")}<a href="${l.link}"><br>GMap</a></center>`)
   })
   map.closePopup();


}