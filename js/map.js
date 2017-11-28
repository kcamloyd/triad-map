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

// Get Flickr photo data for each location
function ajaxCall(locations) {
  // Iterate through each location
  for (var m=0; m<locations.length; m++){
    // Set current location to the "marker" variable for easy reference
    var marker = locations[m];
    // Set the Flickr api request url to search photos with the location name as a tag
    var flickrRequestUrl = "https://api.flickr.com/services/rest/?method=" +
      "flickr.photos.search&api_key=cd7a678487f7cec2b53ed11ba7a1de15&tags=" +
      marker.title + "&format=json&nojsoncallback=1";
    // Create an empty array to temporarily store links for each photo returned by ajax call
    // Should also clear the array before the ajax call for the next location
    var photoLinks = [];

    function getPhotoLinks(loc) {
      $.ajax({
        url: flickrRequestUrl,
        success: function(response) {
          var photoList = response.photos.photo;
          for (var i=0; i<10; i++){
            var photo = photoList[i];
            photoLinks.push(
              {"thumbSource": "https://farm" + photo.farm + ".staticflickr.com/" +
                photo.server + "/" + photo.id + "_" + photo.secret + "_t.jpg",
                "flickrLink": "https://www.flickr.com/photos/" + photo.owner +
                "/" + photo.id});
          };
          loc.photos = photoLinks;
        },
        error: function() {
          console.log("Error in ajax call")
        }
      });
    };

    getPhotoLinks(marker);
  };
};

ajaxCall(initialMarkers);

// Class for creating new marker list instances for each location
var Marker = function(loc) {
  this.position = {lat: loc.lat, lng: loc.lng},
  this.title = loc.title
};


// *** ViewModels ***
// ** ViewModel for map **
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
// Generate HTML to render place link and Flickr photos in info window
function infoContent(placeData){
  var content = "<a target=blank href='" + placeData.link + "'>" +
      "<h5>" + placeData.title + "</h5>" +
    "</a>" +
    "<div class='carousel'>"
    var photoList = placeData.photos
    if (photoList) {
      photoList.forEach(function(photo){
        content += "<figure class='carousel-item'>" +
            "<img src='" + photo.thumbSource + "'>" +
            "<figcaption>" +
              "<a target='blank' href='" + photo.flickrLink + "'>" +
                "View this photo on Flickr" +
              "</a>" +
            "</figcaption>" +
          "</figure>"
      });
      content += "</div>" +
        "<script type='text/javascript'>" +
          "$(document).ready(function(){" +
            "$('.carousel').carousel();" +
          "});" +
        "</script>"
    } else {
        content += "<p>There was an error loading photos from Flickr.</p>"
    };
  return content;
};

// ** View for list **
