var latlngArray = []
var citiesObj={}
var USCity = "USBorder"
var MexicoCity = "MexicoBorder"
var map
var newStyle = [
  {
    "featureType": "administrative.country",
    "elementType": "geometry.stroke",
    "stylers": [
      { "weight": 3.5 },
      { "hue": "#ff0080" },
      { "color": "#CC5A1E" }
    ]
  }
]


$(document).ready(function(){
	console.log("document ready!");
	loadTwinCities()
	$('[data-toggle="tooltip"]').tooltip({
		template: '<div class="tooltip tooltip-custom">	<div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
        })
	openDialog();
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
	console.log("parsing cities from json")
	//create an object from the JSON file
	citiesObj = $.parseJSON(data);
	initialize(citiesObj)
}


//~~~~~~~~~~~~~~~~~~~~BUILD MAP~~~~~~~~~~~~~~~~~~~~~~
function initialize() {
  USCity = "USBorder"
  MexicoCity = "MexicoBorder" 
  instagram(USCity, MexicoCity)
  twitter(USCity, MexicoCity)
  
  console.log("initializing google map")
 
  var marker, i
  var infowindow
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
	}, {
		"featureType": "water",
		"elementType": "geometry.fill",
		"stylers": [
		  { "lightness": 1 },
		  { "hue": "#0055ff" }
		]
	    }
  ]
  
  var styledMap = new google.maps.StyledMapType(styles,
    {name: "Styled Map"});
 
  var mapOptions = {
    zoom: 6,
    center: new google.maps.LatLng(29.925119, -106.5014018)
  };
  
  
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  
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
        });
	
	marker.set('id', i)
	
	
	setSearch(marker, i);
	
        centerPts.push(marker);
	
	
	
        google.maps.event.addListener(map, 'zoom_changed', function() {
                var zoom = map.getZoom();
                // iterate over markers and call setVisible
                for (i = 0; i < centerPts.length; i++) {
                    centerPts[i].setVisible(zoom < 9);
                }
        });
  }
  
  function setSearch(marker, num) {
	var i
	google.maps.event.addListener(marker, 'mouseover', function() {
		i = this.id
		infowindow = new google.maps.InfoWindow({
			content: '<p class="black" style="padding: 0; margin: 0;"><b>' + citiesObj[i].City + '</b> (USA) // <b>' + citiesObj[i+1].City + '</b> (Mexico) </p>'
		});
		console.log(citiesObj)
		infowindow.open(map, this);
	});
	google.maps.event.addListener(marker, 'mouseout', function() {
		infowindow.close(map, this);
	});
	
	google.maps.event.addListener(marker, 'click', function(click) {
		i = this.id
		if (i==2) {map.setZoom(11)}
		else if (i==6) {map.setZoom(11)}
		else if (i==10) {map.setZoom(15)}
		else if (i==10) {map.setZoom(12)}
		else if (i==16) {map.setZoom(12)}
		else if (i==26) {map.setZoom(12)}
		else {map.setZoom(13)}
		map.setCenter(click.latLng);
		//map.setOptions({styles: newStyle})
		map.setMapTypeId(google.maps.MapTypeId.SATELLITE)
		USCity = citiesObj[i].Search
		MexicoCity = citiesObj[i+1].Search
		instagram(USCity, MexicoCity)
		twitter(USCity, MexicoCity)	
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
  

  
// Load a GeoJSON from the same server as our demo.
  //map.data.loadGeoJson('data/boundary.json');
  //map.data.loadGeoJson('http://ellencurrin.com/boundary.json');

  
  map.data.setStyle({
    strokeColor: 'green',
    strokeWeight: 6
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
		//html += '<div><img src="images/chevron-left.png" class="next-left"><img src="images/chevron-right.png" class="next-right"></div>'
		$.each(json.data,function(i,data){		
			html += '<img src ="' + data.images.low_resolution.url + '" style="width: 250px; padding: 15px; display: inline">'
		});
		
		$("#results").html(html);
		var titleUS= "#" + USCity;
		$("#titleUS").html(titleUS)
		
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
		$("#results2").html(html2);
		var titleMex= "#" + MexicoCity
		$("#titleMex").html(titleMex)
	}	
	
};

function twitter(USCity, MexicoCity){
	$('#iframe').attr('src',"http://ellencurrin.com/twitterAPI/?USCity=" + USCity + "&MexicoCity=" + MexicoCity)
};

function openDialog() {
	bootbox.dialog({
		message: '<p style="color: black;"> I am a custom dialog</p>',
		title: '<h4 style="color: black;"> About the Twin Cities project. </h4>',
	})
}



	
	