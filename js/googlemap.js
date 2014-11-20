var latlngArray = []
var citiesObj={}
var image


$(document).ready(function(){
	console.log("ready!");
	loadTwinCities()
});

function loadTwinCities(data) {
	$.ajax({
		type: "GET",
		dataType: "text",
		cache: false,
		url: "data/twincities.json",
		success: parseCities
		});
}
                
function parseCities(data) {
	console.log("parseCities")
	//create an object from the JSON file
	citiesObj = $.parseJSON(data);
	console.log(citiesObj)
}



//~~~~~~~~~~~~~~~~~~~~BUILD MAP~~~~~~~~~~~~~~~~~~~~~~
function initialize() {
  console.log("initializing")
 
  var mapOptions = {
    zoom: 6,
    center: new google.maps.LatLng(29.925119, -106.5014018)
  };
  
  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  
  var center, i
  var centerPts = []
  var markers = []

  
  for (i=0; i < citiesObj.length; i=i+2) {
        var c_lat = ((citiesObj[i].latitude + citiesObj[i+1].latitude)/2)
        var c_lng = ((citiesObj[i].longitude + citiesObj[i+1].longitude)/2)
        var centerPt = new google.maps.LatLng(c_lat, c_lng);
        center = new google.maps.Marker({
          position: centerPt,
          map: map,
          /*icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 5,
                fillColor: 'red'
          },*/
          title: citiesObj[i].City + ' (USA) // ' + citiesObj[i+1].City + ' (Mexico)',
        });
        centerPts.push(center);
        google.maps.event.addListener(center, 'click', function(click) {
                map.setZoom(12);
                map.setCenter(click.latLng);
		//set variables for Twitter and Instagram searches
		USCity = '"'+ citiesObj[i].Search + '"'
		MexicoCity = '"'+ citiesObj[i+1].Search + '"'
		//InstagramFunction()
		//TwitterFunction()
		
        });
        google.maps.event.addListener(map, 'zoom_changed', function() {
                var zoom = map.getZoom();
                // iterate over markers and call setVisible
                for (i = 0; i < centerPts.length; i++) {
                    centerPts[i].setVisible(zoom < 9);
                }
        });
  }

  google.maps.event.addListener(map, 'zoom_changed', function() {
                var zoom = map.getZoom();
                if (zoom >= 9) {
                        for (i=0; i < citiesObj.length; i++) {
                                var myLatlng = new google.maps.LatLng((citiesObj[i].latitude), citiesObj[i].longitude);
                                var marker = new google.maps.Marker({
                                  position: myLatlng,
                                  map: map,
                                  title: citiesObj[i].City,
				});
				markers.push(marker);
			}
                }
                // iterate over markers and call setVisible
                for (i = 0; i < markers.length; i++) {
                    markers[i].setVisible(zoom >= 9);
                }
        });
}

google.maps.event.addDomListener(window, 'load', initialize);

