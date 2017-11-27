// Model
var initialMarkers = [
  {
    title: "Old Salem",
    lat: 36.087144,
    lng: -80.242494
  },
  {
    title: "Greensboro Science Center",
    lat: 36.129938,
    lng: -79.834127
  },
  {
    title: "Elon University",
    lat: 36.103408,
    lng: -79.501255
  },
  {
    title: "Haw River State Park",
    lat: 36.250866,
    lng: -79.756397
  },
  {
    title: "Print Works Bistro",
    lat: 36.088826,
    lng: -79.821446
  }
]

var Marker = function(loc) {
  this.position = {lat: loc.lat, lng: loc.lng},
  this.title = loc.title
}

// ViewModel
var markers = ko.observableArray([]);

initialMarkers.forEach(function(markerLocation){
  markers.push(new Marker(markerLocation));
});

function initMap() {
  var map = new google.maps.Map(document.getElementById("map"), {
    center: {lat: 36.109034, lng: -79.859619},
    zoom: 11
  });

  initialMarkers.forEach(function(markerData) {
    new google.maps.Marker({
    position: {lat: markerData.lat, lng: markerData.lng},
    map: map,
    title: markerData.title
    });
  });
};
