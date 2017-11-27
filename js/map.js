// Model
var initialMarkers = [
  {
    title: "Old Salem",
    lat: 36.087144,
    lng: -80.242494,
    link: "http://www.oldsalem.org/"
  },
  {
    title: "Greensboro Science Center",
    lat: 36.129938,
    lng: -79.834127,
    link: "http://www.greensboroscience.org/"
  },
  {
    title: "Elon University",
    lat: 36.103408,
    lng: -79.501255,
    link: "https://www.elon.edu/home/"
  },
  {
    title: "Haw River State Park",
    lat: 36.250866,
    lng: -79.756397,
    link: "https://www.ncparks.gov/haw-river-state-park"
  },
  {
    title: "Print Works Bistro",
    lat: 36.088826,
    lng: -79.821446,
    link: "https://www.printworksbistro.com/"
  }
]

// Class for creating new marker list instances for each location
var Marker = function(loc) {
  this.position = {lat: loc.lat, lng: loc.lng},
  this.title = loc.title
}

// ViewModel
// Create observable array for displaying marker names in the sidebar list
var markers = ko.observableArray([]);

initialMarkers.forEach(function(markerLocation){
  markers.push(new Marker(markerLocation));
});

// Initialize map with markers
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
