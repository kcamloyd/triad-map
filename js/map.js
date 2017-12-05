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

// flickr ajax function
function getAjax(location) {
  location.flickrLink = "https://www.flickr.com/search/?tags=" + location.title;
  // Set the Flickr api request url to search photos with the location name as a tag
  var flickrRequestUrl = "https://api.flickr.com/services/rest/?method=" +
    "flickr.photos.search&api_key=cd7a678487f7cec2b53ed11ba7a1de15" +
    "&content_type=1&per_page=10&tags=" + location.title +
    "&sort=relevance&format=json&nojsoncallback=1";
  // Create an empty array to temporarily store links for each photo returned by ajax call
  // Also clears the array before the ajax call for the next location
  var photoLinks = [];

  $.ajax({
    url: flickrRequestUrl,
    success: function(response) {
      var responseData = response.photos.photo;
      var hrefs = ["#one!", "#two!", "#three!", "#four!", "#five!", "#six!", "#seven!", "#eight!", "#nine!", "#ten!"]
      for (var i=0; i<responseData.length; i++){
        var photo = responseData[i];
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

// Send ajax requests for each location
initialLocations.forEach(function (location){
  getAjax(location);
});

// *** ViewModel ***
// Initialize map with markers
function initMap() {
  // Generate new Google Map
  var map = new google.maps.Map(document.getElementById("map"), {
    center: {lat: 36.109034, lng: -79.859619},
    zoom: 10
  });

  var infoWindowMain = new google.maps.InfoWindow({
    content: ""
  });

  // Generate a marker for a given location
  var getMarker = function (location) {
    location.marker = new google.maps.Marker({
      position: {lat: location.lat, lng: location.lng},
      map: map,
      title: location.title
    });

    // Add click event on marker to animate and open info window
    location.marker.addListener("click", function(){
      infoWindowMain.close();
      // Set marker animation
      location.marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){
        location.marker.setAnimation(null);
      }, 1400);
      // Set info window content
      infoWindowMain.setContent(location.info)
      // Open info window with new content
      infoWindowMain.open(map, location.marker);
    });
  };

  // Call marker generator and info window generator functions for each location
  initialLocations.forEach(function(location) {
    location.info = infoContent(location);
    getMarker(location);
  });

  // Clear marker (called in filter function in ListViewModel)
  var clearMarker = function(location) {
    location.marker.setMap(null);
  };

  // Show marker (called in filter function in ListViewModel)
  var showMarker = function(location) {
    location.marker.setMap(map);
  };

  var ListViewModel = function() {
    var self = this;

    this.showLink = ko.observable(false);

    // Create observable array to hold all location items
    this.locationList = ko.observableArray([]);

    // Populate locationList with all locations
    initialLocations.forEach(function(location){
      self.locationList.push(location);
    });

    // Filter list of locations to only include titles that match the search query
    // Filter code source: https://opensoul.org/2011/06/23/live-search-with-knockoutjs/
    // Set query value as observable
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

    // Create observable array to hold all photo links for one location
    this.photoList = ko.observableArray([]);

    // Function for list items to open info window and display Flickr photos
    this.infoPhotoDisplay = function(clickedLocation) {
      infoWindowMain.close();
      // Set marker animation
      clickedLocation.marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){
        clickedLocation.marker.setAnimation(null);
      }, 1400);
      // Set info window content
      infoWindowMain.setContent(clickedLocation.info)
      // Open info window with new content
      infoWindowMain.open(map, clickedLocation.marker);
      self.photoList.removeAll();
      clickedLocation.photos.forEach(function(photo) {
        self.photoList.push(photo);
      });
      self.flickrLink = ko.observable(clickedLocation.flickrLink);
      self.showLink(true);
      // Materialize JS to initialize carousel
      $('.carousel').carousel();
    };

    // *** when someone clicks on a list item or marker,
    // *** clear photo list
    // *** populate photo list with photos key from location object
    // *** change visible on photo div to true
    // *** Materialize JS to initialize carousel
          // $('.carousel').carousel();



  }; // End viewModel

  // Activate knockout bindings
  ko.applyBindings(new ListViewModel());
}; // End initMap

// Error handling for Google Map API
function mapError() {
  document.getElementById("map").innerHTML = "<p>There was an error retreiving data from the " +
      "Google Maps API. Please refresh the page or <a target='blank' " +
      "href='https://twitter.com/KCamLoyd'>contact the site " +
      "administrator</a>.</p>"
};

// *** View ***
// Generate HTML to render place link and description in info window
function infoContent(location){
  var content =
    "<a target='blank' href='" + location.link + "'>" +
      "<h5 class='center'>" + location.title + "</h5>" +
    "</a>" +
    "<p>" + location.description + "</p>";
  return content;
};
