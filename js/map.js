// *** Model ***
// Markers that appear when map is launched:
var initialMarkers = [
  {
    title: "Old Salem",
    lat: 36.087144,
    lng: -80.242494,
    interest: ["history", "education"],
    link: "http://www.oldsalem.org/"
  },
  {
    title: "Greensboro Science Center",
    lat: 36.129938,
    lng: -79.834127,
    interest: ["science", "nature", "animals"],
    link: "http://www.greensboroscience.org/"
  },
  {
    title: "Elon University",
    lat: 36.103408,
    lng: -79.501255,
    interest: ["nature", "education"],
    link: "https://www.elon.edu/home/"
  },
  {
    title: "Haw River State Park",
    lat: 36.250866,
    lng: -79.756397,
    interest: ["nature", "recreation"],
    link: "https://www.ncparks.gov/haw-river-state-park"
  },
  {
    title: "Greensboro Arboretum",
    lat: 36.07262,
    lng: -79.838784,
    interest: ["nature"],
    link: "http://www.greensborobeautiful.org/gardens/greensboro_arboretum.php"
  }
]

// Filter by Interest options:
// Values added to interest key in initialMarkers must be present here
var interests = [
  "history",
  "education",
  "science",
  "nature", 
  "animals",
  "recreation"]

// Class for creating new marker list instances for each location
var Marker = function(loc) {
  this.position = {lat: loc.lat, lng: loc.lng},
  this.title = loc.title
};


// *** ViewModels ***
// ** ViewModel for map **
// Get Flickr photo data for each location
function getAjax(marker) {
  // Set the Flickr api request url to search photos with the location name as a tag
  var flickrRequestUrl = "https://api.flickr.com/services/rest/?method=" +
    "flickr.photos.search&api_key=cd7a678487f7cec2b53ed11ba7a1de15&tags=" +
    marker.title + "&format=json&nojsoncallback=1";
  // Create an empty array to temporarily store links for each photo returned by ajax call
  // Should also clear the array before the ajax call for the next location
  var photoLinks = [];

  $.ajax({
    url: flickrRequestUrl,
    success: function(response) {
      var photoList = response.photos.photo;
      var hrefs = ["#one!", "#two!", "#three!", "#four!", "#five!", "#six!", "#seven!", "#eight!", "#nine!", "#ten!"]
      for (var i=0; i<10; i++){
        var photo = photoList[i];
        photoLinks.push(
          {"thumbSource": "https://farm" + photo.farm + ".staticflickr.com/" +
            photo.server + "/" + photo.id + "_" + photo.secret + "_q.jpg",
            "flickrLink": "https://www.flickr.com/photos/" + photo.owner +
            "/" + photo.id,
            "href": hrefs[i]}
        );
      };
      marker.photos = photoLinks;
    },
    error: function() {
      console.log("Error in ajax call")
    }
  });
};

// Initialize map with markers
function initMap() {
  var map = new google.maps.Map(document.getElementById("map"), {
    center: {lat: 36.109034, lng: -79.859619},
    zoom: 11
  });

  function getMarker(marker){
    // Displays marker on map
    var mark = new google.maps.Marker({
      position: {lat: marker.lat, lng: marker.lng},
      map: map,
      title: marker.title
    });

    // Displays info window when marker is clicked
    mark.addListener("click", function(){
      var info = new google.maps.InfoWindow({
        content: infoContent(marker),
        minWidth: 350,
        minHeight: 350
      });
      mark.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){
        mark.setAnimation(null);
      }, 1400)
      info.open(map, mark);
    });
  };

  for (var m=0; m<initialMarkers.length; m++){
    getAjax(initialMarkers[m]);
    getMarker(initialMarkers[m]);
  };
};


// ** ViewModel for list **
// Create observable array for displaying marker names in the sidebar list
var markers = ko.observableArray([]);

initialMarkers.forEach(function(markerLocation){
  markers.push(new Marker(markerLocation));
});


// *** View ***
// ** View for map **
// Generate HTML to render place link and Flickr photos in info window
function infoContent(placeData){
  var content = "<div style='width: 300px; height: 270px;'>" +
    "<a target='blank' href='" + placeData.link + "'>" +
      "<p class='center'>" + placeData.title + "</p>" +
    "</a>" +
  "<div class='carousel' style='width: 300px; height: 200px;'>";
    if (placeData.photos) {
      placeData.photos.forEach(function(photo){
        content +=  "<a class='carousel-item' href='" + photo.href + "'>" +
                      "<img src='" + photo.thumbSource + "'>" +
                    "</a>";
      });
      content += "</div>" +
        "<a target='blank' href='" + placeData.morePhotos + "'>" +
          "<p class='center'>View more photos on Flickr</p>" +
        "</a>" +
        "</div>" +
        "<script type='text/javascript'>" +
          "$(document).ready(function(){$('.carousel').carousel();});" +
        "</script>";
    } else {
        content += "<p>There was an error loading photos from Flickr. Please refresh the page or contact the site administrator.</p>"
    };
  return content;
};

// ** View for list **
// Initialize select dropdown
$(document).ready(function() {
   $('select').material_select();
 });
