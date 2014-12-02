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
		template: '<div class="tooltip tooltip-custom"><div class="tooltip-inner"></div></div>'
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
		html = '<div class="black"><b>' + citiesObj[i].City + '</b> (USA) // <b>' + citiesObj[i+1].City + ' </b> (Mexico) </div>'
		infowindow = new google.maps.InfoWindow({
			content: html
		});
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
		message: '<p style="color: black;"> The US-Mexico border divides 14 cities into 28 municipalities- half in one country, and half in another. The border is obvious when you look at it on a map, but what effect does it have on the lives of those who live in these severed cities? The Twin Cities project aims to explore this question via social media. </br></br><b>To use this tool:</b> Click on any one of the 14 twin cities on the map to compare Instagram and Twitter content from both sides of the border.  Reset the zoom and explore another pair of municipalities. What things are the same? What things seem different? How is the impact on individual lives the same or different from what is portrayed in the media?</br></br>This project was made using the <a href=�http://instagram.com/developer/�>Instagram API</a>, <a href=�https://dev.twitter.com/�>Twitter API</a>, and <a href=�https://developers.google.com/maps/�>Google Maps API</a>.</p>',

		title: '<h4 style="color: black;"> About the Twin Cities project. </h4>',
	})
}



	
	