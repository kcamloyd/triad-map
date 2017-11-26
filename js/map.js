// ViewModel
var map;
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
      center: {lat: 35.940212, lng: -79.823914},
      zoom: 10
  });
};
