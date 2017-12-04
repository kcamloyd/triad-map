// *** Model ***
var initialLocations = [
  {
    title: "Old Salem",
    lat: 36.087144,
    lng: -80.242494,
    interests: ["History", "Education"],
    link: "http://www.oldsalem.org/",
    description: "Experience early American history in the unique Moravian settlement of Salem. Original structures, gardens, tours, artifacts, hands-on workshops, fun family events and shopping."
  },
  {
    title: "Greensboro Science Center",
    lat: 36.129938,
    lng: -79.834127,
    interests: ["Science", "Nature", "Animals"],
    link: "http://www.greensboroscience.org/",
    description: "The Greensboro Science Center is committed to excellence in science education by providing the community with a dynamic, experiential and family-focused attraction designed to inspire scientific curiosity and encourage personal discovery about life and the natural world."
  },
  {
    title: "Elon University",
    lat: 36.103408,
    lng: -79.501255,
    interests: ["Nature", "Education"],
    link: "https://www.elon.edu/home/",
    description: "Elon is a selective, mid-sized private university renowned as a national model for engaged and experiential learning. The campus is a designated botanical garden and has several great spots to read or study."
  },
  {
    title: "Haw River State Park",
    lat: 36.250866,
    lng: -79.756397,
    interests: ["Nature", "Recreation"],
    link: "https://www.ncparks.gov/haw-river-state-park",
    description: "Located in the northern Piedmont Triad region, picturesque terrain makes Haw River State Park the perfect place to connect with nature. Housed within this natural setting is The Summit Environmental Education and Conference Center, N.C. State Park’s first residential environmental education center. Along with environmental education programming, The Summit Center offers conference center facilities for groups ranging in size from 10 to 180."
  },
  {
    title: "Greensboro Arboretum",
    lat: 36.07262,
    lng: -79.838784,
    interests: ["Nature"],
    link: "http://www.greensborobeautiful.org/gardens/greensboro_arboretum.php",
    description: "This 17-acre site features 14 plant collections, special display gardens and distinct structural features. The extensive variety of plants offers rich educational opportunities for children and adults, landscape designers, and homeowners."
  }
];

// Get Flickr photo data for each location
function getAjax(location) {
  location.flickrLink = "https://www.flickr.com/search/?tags=" + location.title;
  // Set the Flickr api request url to search photos with the location name as a tag
  var flickrRequestUrl = "https://api.flickr.com/services/rest/?method=" +
    "flickr.photos.search&api_key=cd7a678487f7cec2b53ed11ba7a1de15&tags=" +
    location.title + "&sort=relevance&format=json&nojsoncallback=1";
  // Create an empty array to temporarily store links for each photo returned by ajax call
  // Also clears the array before the ajax call for the next location
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
            "href": hrefs[i]}
        );
      };
      location.photos = photoLinks;
    }
  });
};

initialLocations.forEach(function(location) {
  getAjax(location);
})

// Class for creating new knockout observable locations
var Location = function(data) {
  this.title = data.title;
  this.lat = data.lat;
  this.lng = data.lng;
  this.position = ko.computed(function() {
    return {lat: this.lat, lng: this.lng};
  }, this);
  this.interests = data.interests;
  this.link = data.link;
  this.description = data.description;
  this.photoLinks = data.photoLinks;
}


// *** ViewModels ***
// ** ViewModel for map **
// Initialize map with markers
var map, getMarker, clearMarker, showMarker;

function initMap() {
  // Generate new Google Map
  map = new google.maps.Map(document.getElementById("map"), {
    center: {lat: 36.109034, lng: -79.859619},
    zoom: 10
  });

  // Generate a marker for a given location
  getMarker = function (location){
    location.marker = new google.maps.Marker({
      position: {lat: location.lat, lng: location.lng},
      map: map,
      title: location.title
    });

    location.marker.addListener("click", function(){
      var info = new google.maps.InfoWindow({
          content: infoContent(location),
        });
      location.marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){
        location.marker.setAnimation(null);
      }, 1400);
      info.open(map, location.marker);
      showFlickrPhotos(location);
    });
  };

  clearMarker = function(location) {
    location.marker.setMap(null);
  }

  showMarker = function(location) {
    location.marker.setMap(map);
  }

  // Call marker generator function for each location
  initialLocations.forEach(function(location) {
    getMarker(location);
  });
}; // End initMap

// Error handling for Google Map API
function mapError() {
  document.getElementById("map").innerHTML = "<p>There was an error retreiving data from the " +
      "Google Maps API. Please refresh the page or <a target='blank' " +
      "href='https://twitter.com/KCamLoyd'>contact the site " +
      "administrator</a>.</p>"
};

// ** ViewModel for sidebar **
var ListViewModel = function() {
  var self = this;

  // Create observable array to hold all location items
  this.locationList = ko.observableArray([]);

  initialLocations.forEach(function(locationItem){
    // Populate locationList with all locations
    self.locationList.push(new Location(locationItem));
  });

  // Filter list of locations to only include titles that match the search query
  // Filter code source: https://opensoul.org/2011/06/23/live-search-with-knockoutjs/
  this.query = ko.observable("")

  this.search = function(value) {
    // Clear list of locations
    self.locationList.removeAll();
    // Clear all markers
    initialLocations.forEach(function(location) {
      clearMarker(location);
    });

    for(var l in initialLocations) {
      if(initialLocations[l].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
        self.locationList.push(initialLocations[l])
        showMarker(initialLocations[l]);
      };
    };
  };

  this.query.subscribe(this.search);

  // Open info window on map when item in list is clicked
  this.openInfoWindow = function(clickedLocation) {
    var clicked;
    initialLocations.forEach(function(location) {
      if(location.title === clickedLocation.title) {
        clicked = location
      }
    });
    var info = new google.maps.InfoWindow({
        content: infoContent(clicked),
      });
    clicked.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){
      clicked.marker.setAnimation(null);
    }, 1400);
    info.open(map, clicked.marker);
    showFlickrPhotos(clicked);
  };
};

ko.applyBindings(new ListViewModel());


// *** View ***
// ** View for map **
// Generate HTML to render place link and description in info window
function infoContent(location){
  var content =
    "<a target='blank' href='" + location.link + "'>" +
      "<h5 class='center'>" + location.title + "</h5>" +
    "</a>" +
    "<p>" + location.description + "</p>";
  return content;
};

// ** View for sidebar **
// Generate flickr photos view in sidebar
function showFlickrPhotos(location) {
  var photoDisplay = "<div class='flickr-photos col s12'>"
  if (location.photos) {
    photoDisplay += "<div class='carousel center' style='height: 200px; margin-top: 15px;'>";
    location.photos.forEach(function(photo){
      photoDisplay +=  "<a class='carousel-item' href='" + photo.href + "'>" +
                    "<img src='" + photo.thumbSource + "'>" +
                  "</a>";
    });
    photoDisplay += "</div>" +
      "<a target='blank' href='" + location.flickrLink + "'>" +
        "<p class='center'>View more photos on Flickr</p>" +
      "</a>" +
      "<script type='text/javascript'>" +
        "$(document).ready(function(){$('.carousel').carousel();});" +
      "</script>";
  }
  else {
    photoDisplay += "<p>There was an error loading photos from Flickr. " +
      "Please refresh the page or <a target='blank' " +
      "href='https://twitter.com/KCamLoyd'>contact the site " +
      "administrator</a>.</p>"
  };
  photoDisplay += "</div>"

  $('.flickr-photos').replaceWith(photoDisplay);
};
