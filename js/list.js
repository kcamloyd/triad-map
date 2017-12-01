// Model
var initialLocations = [
  {
    title: "Old Salem",
    lat: 36.087144,
    lng: -80.242494,
    interests: ["history", "education"],
    link: "http://www.oldsalem.org/",
    description: "Experience early American history in the unique Moravian settlement of Salem. Original structures, gardens, tours, artifacts, hands-on workshops, fun family events and shopping."
  },
  {
    title: "Greensboro Science Center",
    lat: 36.129938,
    lng: -79.834127,
    interests: ["science", "nature", "animals"],
    link: "http://www.greensboroscience.org/",
    description: "The Greensboro Science Center is committed to excellence in science education by providing the community with a dynamic, experiential and family-focused attraction designed to inspire scientific curiosity and encourage personal discovery about life and the natural world."
  },
  {
    title: "Elon University",
    lat: 36.103408,
    lng: -79.501255,
    interests: ["nature", "education"],
    link: "https://www.elon.edu/home/",
    description: "Elon is a selective, mid-sized private university renowned as a national model for engaged and experiential learning. The campus is a designated botanical garden and has several great spots to read or study."
  },
  {
    title: "Haw River State Park",
    lat: 36.250866,
    lng: -79.756397,
    interests: ["nature", "recreation"],
    link: "https://www.ncparks.gov/haw-river-state-park",
    description: "Located in the northern Piedmont Triad region, picturesque terrain makes Haw River State Park the perfect place to connect with nature. Housed within this natural setting is The Summit Environmental Education and Conference Center, N.C. State Park’s first residential environmental education center. Along with environmental education programming, The Summit Center offers conference center facilities for groups ranging in size from 10 to 180."
  },
  {
    title: "Greensboro Arboretum",
    lat: 36.07262,
    lng: -79.838784,
    interests: ["nature"],
    link: "http://www.greensborobeautiful.org/gardens/greensboro_arboretum.php",
    description: "This 17-acre site features 14 plant collections, special display gardens and distinct structural features. The extensive variety of plants offers rich educational opportunities for children and adults, landscape designers, and homeowners."
  }
]

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
}

// ViewModel
var ListViewModel = function() {
  var self = this;

  this.locationList = ko.observableArray([]);

  initialLocations.forEach(function(locationItem){
    self.locationList.push(new Location(locationItem))
  });

  // this.currentLocations = ko.observableArray(this.locationList()[indexes of selected filters])
  // this.currentLocations should initially be set to show all locations

  this.openInfoWindow = function(clickedLocation) {
    // self.currentLocations(clickedLocation);
    console.log("this will open the info window on the map");
  };
}

ko.applyBindings(new ListViewModel());

// View
