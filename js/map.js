// *** Model ***
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
    title: "Greensboro Arboretum",
    lat: 36.07262,
    lng: -79.838784,
    link: "http://www.greensborobeautiful.org/gardens/greensboro_arboretum.php"
  }
]

// Get Flickr photo data for each object in initialMarkers
function jsonData(locationArray) {
  for (var m=0; m<locationArray.length; m++){
    var marker = initialMarkers[m];
    var flickrRequestUrl = "https://api.flickr.com/services/rest/?method=" +
      "flickr.photos.search&api_key=013b067090a28369bb3bb907d41b07e9&tags=%22" +
      marker.title + "%22&format=json";

    $.getJSON(flickrRequestUrl, function(data){
      var photoList = data.photos.photo;
      for (var i=0; i<10; i++){
        var photo = photoList[i];
        // Store photo URLs as new key/value pairs in the locations array
        marker.thumbSource = "https://farm" + photo.farm + ".staticflickr.com/" +
          photo.server + "/" + photo.id + "_" + photo.secret + "_t.jpg";
        marker.flickLink = "https://www.flickr.com/photos/" + photo.owner +
        "/" + photo.id};
    }).fail(function() {
      return "error"
    });
  };
};

// Class for creating new marker list instances for each location
var Marker = function(loc) {
  this.position = {lat: loc.lat, lng: loc.lng},
  this.title = loc.title
}


// *** ViewModels ***
// ** ViewModel for map **

// Call JSON function
jsonData(initialMarkers);

// Initialize map with markers
function initMap() {
  var map = new google.maps.Map(document.getElementById("map"), {
    center: {lat: 36.109034, lng: -79.859619},
    zoom: 11
  });

  // Create marker and info window for each place in initialMarkers
  initialMarkers.forEach(function(markerData) {
    // Displays marker on map
    var mark = new google.maps.Marker({
      position: {lat: markerData.lat, lng: markerData.lng},
      map: map,
      title: markerData.title
    });

    // Displays info window when marker is clicked
    var info = new google.maps.InfoWindow({
      content: infoContent(markerData)
    });
    mark.addListener("click", function(){
      info.open(map, mark);
    });
  });
};

// ** ViewModel for list **
// Create observable array for displaying marker names in the sidebar list
var markers = ko.observableArray([]);

initialMarkers.forEach(function(markerLocation){
  markers.push(new Marker(markerLocation));
});


// *** View ***
// ** View for map **
// Join HTML to render place link and Flickr photos
function infoContent(markerData){
  var content =
    "<a target=blank href='" + markerData.link + "'>" +
      "<h3>" + markerData.title + "</h3>" +
    "</a>" +
    "<div class='carousel'>";
  photos.forEach(function(photo){
    content.append(
      "<figure class='carousel-item'>" +
        "<img src='" + photo.thumbSource + "'>" +
        "<figcaption>" +
          "<a target='blank' href='" + photo.flickrLink + "'>" +
            "View this photo on Flickr" +
          "</a>" +
        "</figcaption>" +
      "</figure>"
    );
  });
  content.append(
    "</div>" +
    "<script type='text/javascript'>" +
      "$(document).ready(function(){" +
        "$('.carousel').carousel();" +
      "});" +
    "</script>"
  );
  return content
};

// ** View for list **
