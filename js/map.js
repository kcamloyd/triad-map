// Model
var map;
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
      center: {lat: 35.940212, lng: -79.823914},
      zoom: 10
  });
  var oldSalem = new google.maps.Marker({
      position: {lat: 36.087144, lng: -80.242494},
      map: map,
      title: "Old Salem"
      });
  var scienceCenter = new google.maps.Marker({
      position: {lat: 36.129938, lng: -79.834127},
      map: map,
      title: "Greensboro Science Center"
      });
  var elonUniversity = new google.maps.Marker({
      position: {lat: 36.103408, lng: -79.501255},
      map: map,
      title: "Elon University"
      });
  var hawRiver = new google.maps.Marker({
      position: {lat: 36.250866, lng: -79.756397},
      map: map,
      title: "Haw River State Park"
      });
  var printWorks = new google.maps.Marker({
      position: {lat: 36.088826, lng: -79.821446},
      map: map,
      title: "Print Works Bistro"
      });
};
