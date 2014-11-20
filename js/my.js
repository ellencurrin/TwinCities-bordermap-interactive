var latlngArray = []
var citiesObj={}
var image
var USCity = "BorderUSA"
var MexicoCity = "BorderMexico"


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
	initialize(citiesObj)
}



//~~~~~~~~~~~~~~~~~~~~BUILD MAP~~~~~~~~~~~~~~~~~~~~~~
function initialize() {
  console.log("initializing")
 
  //var center, i
  var marker, i
  var centerPts = []
  var markers = []
  var styles = [
  {
    "elementType": "geometry",
    "stylers": [
      { "visibility": "on" },
      { "hue": "#00ffb3" }
    ]
  },{
    "featureType": "administrative.country",
    "elementType": "geometry.stroke",
    "stylers": [
      { "hue": "#00ff2b" },
      { "weight": 1.9 },
      { "gamma": 0.92 },
      { "lightness": -27 },
      { "saturation": -20 }
    ]
  },{
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      { "visibility": "off" }
    ]
  }
]
  
  var styledMap = new google.maps.StyledMapType(styles,
    {name: "Styled Map"});
 
  var mapOptions = {
    zoom: 6,
    center: new google.maps.LatLng(29.925119, -106.5014018)
  };
  
  
  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  
  map.mapTypes.set('map_style', styledMap);
  map.setMapTypeId('map_style');
  

  

  
  for (i=0; i < citiesObj.length; i=i+2) {
        var c_lat = ((citiesObj[i].latitude + citiesObj[i+1].latitude)/2)
        var c_lng = ((citiesObj[i].longitude + citiesObj[i+1].longitude)/2)
        var centerPt = new google.maps.LatLng(c_lat, c_lng);
        marker = new google.maps.Marker({
          position: centerPt,
          map: map,
          icon: 'images/marker3.png',
          title: citiesObj[i].City + ' (USA) // ' + citiesObj[i+1].City + ' (Mexico)',
	  tooltip: '<p>Sample Tooltip</p>',
        });
	//marker.set("id",i/2)
	//console.log("id=" + marker.id)
	
	/*var tooltip = new Tooltip({map: map}, marker);
        tooltip.bindTo("text", marker, "tooltip");
        google.maps.event.addListener(marker, 'mouseover', function() {
            tooltip.addTip();
            tooltip.getPos2(marker.getPosition());
        });
	google.maps.event.addListener(marker, 'mouseout', function() {
            tooltip.removeTip();
        });*/
	
	
        centerPts.push(marker);
	
	google.maps.event.addListener(marker, 'click', function(click) {
		map.setZoom(12);
		map.setCenter(click.latLng);
		console.log(i)
		//set variables for Twitter and Instagram searches
		USCity = 'USA'
		console.log(USCity);
		MexicoCity = 'Mexico'
		instagram(USCity, MexicoCity)
		
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
				  icon: 'images/marker3.png',
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



//INSTAGRAM
function instagram(){
	console.log("instagram()");
    //USA
	console.log(USCity)
	var apiurl = "https://api.instagram.com/v1/tags/"+ USCity + "/media/recent?&access_token=1362787493.08be6ee.d95c893eb957435ebd5c8543b2343794&callback=?"
	var access_token = location.hash.split('=')[1];
	var html = ""
	
	$.ajax({
		type: "GET",
		dataType: "json",
		cache: false,
		url: apiurl,
		success: parseData
	});
			
	
	function parseData(json){
		console.log(json);
		
		$.each(json.data,function(i,data){		
			html += '<img src ="' + data.images.low_resolution.url + '" style="width: 250px; padding: 15px; display: inline">'
		});
		
		$("#results").append(html);
		var titleUS= "#" + USCity
		$("#titleUS").append(titleUS)
		
	}
         

    //MEXICO	
	console.log(MexicoCity)
	var apiurl2 = "https://api.instagram.com/v1/tags/"+ MexicoCity + "/media/recent?&access_token=1362787493.08be6ee.d95c893eb957435ebd5c8543b2343794&callback=?"
	access_token2 = location.hash.split('=')[1];
	var html2 = ""
	
	$.ajax({
		type: "GET",
		dataType: "json",
		cache: false,
		url: apiurl2,
		success: parseData2
	});
			
	
	function parseData2(json){
		console.log(json);
		
		$.each(json.data,function(i,data){
			html2 += '<img src ="' + data.images.low_resolution.url + '" style="width: 250px; padding: 15px; display= inline">'
		});
		$("#results2").append(html2);
		var titleMex= "#" + MexicoCity
		$("#titleMex").append(titleMex)
	}	
	
};

function Twitter(USCity, MexicoCity){
	$('#iframe').src("http://ellencurrin.com/twitterAPI/?USCity=" + USCity + "&?MexicoCity=" + MexicoCity + ".com")

};
	
	