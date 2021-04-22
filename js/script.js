let map, infoWindow;
const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let labelIndex = 0;

function initMap() {
  // sets initial location
  const initialLatLon = { lat: 41.83, lng: -87.627 };
  map = new google.maps.Map(document.getElementById("map"), {
    center: initialLatLon,
    zoom: 15
  });
  
  // find current location
  infoWindow = new google.maps.InfoWindow();
  const locationButton = document.createElement("button");
  locationButton.textContent = "Find Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          infoWindow.setPosition(pos);
          let curLocation = ("(" + position.coords.latitude.toFixed(5) + ", " + position.coords.longitude.toFixed(5) + ")");
          infoWindow.setContent("<p>Your Current Location: </p>" + curLocation);
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });


  // code for Markers
  const marker = new google.maps.Marker({
    position: initialLatLon,
    animation: google.maps.Animation.DROP,
    map: map,
  });

  let contentString = '<h1><b>Illinois Institute of Technology</b></h1>' +
    "<p>Illinois Institute of Technology is a private research university in Chicago, Illinois. Tracing its history to 1890, the present name was adopted upon the merger of the Armour Institute and Lewis Institute in 1940.</p>" +
    "<p><b>Address:</b> 10 W 35th St, Chicago, IL 60616</p>" + 
    "<p><b>Phone:</b>(312) 567-3000</p>" + 
    '<p>Attribution: IIT <a href="https://en.wikipedia.org/wiki/Illinois_Institute_of_Technology">' +
    "https://en.wikipedia.org/wiki/Illinois_Institute_of_Technology</a></p>";
  
  const markerWindow = new google.maps.InfoWindow({
    content: contentString
  });

  // add location markers by clicking on other areas of map
  google.maps.event.addListener(marker, 'click', function(){
    markerWindow.open(map, marker);
  });

  google.maps.event.addListener(map, "click", (event) => {
    addMarker(event.latLng, map);
  });

}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

function addMarker(location, map) {
  // Add the marker at the clicked location, and add the next-available label
  // from the array of alphabetical characters.
  new google.maps.Marker({
    position: location,
    label: labels[labelIndex++ % labels.length],
    map: map,
  });
}