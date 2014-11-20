
///~~~~~How to organize PROJECT 4 JavaScript~~~~///

///GLOBAL VARIABLES

var cityName = ""
var lat =""
var lng =""

var flickrapi = “url.com”
var instaapi= “url.com/?tags=baseball”
var twitterapi = “twitter.com/…”

var apiArray = [flickrapi, instaapi, twitterapi]


///FUNCTIONS

$document.ready(){
	console.log(ready!);
	loadTwinCities();
	loadAPIdata(apiArray);
}

function loadTwinCities(data)
	$.ajax({
		type: "GET",
		dataType: "json",
		cache: false,
		url: "twincities.json",
		success: parseCities
		});

function parseCities(data) {
	console.log("success")
	//create an object from the JSON file
	dataObj = $.parseJSON(data);
	console.lob(dataObj)
	for (var i=0; i < dataObj.length; i++) {        
	    dates.push(dataObj[i].Year);
	    titles.push(dataObj[i].Title);
	    descriptions.push(dataObj[i].Desc);
	    links.push(dataObj[i].Link);
	}
}

function loadAPIdata(data) {
    for (var i=0; i < apiArray.length; i++) {
        $.ajax({
		type: "GET",
		dataType: "json",
		cache: false,
		url: data[i],
		success: parseData
		});
	function parseData(json){
		if (i == 0) {
		    //parse for the flickrapi
		}
		if (i == 1) {
		    //parse for the instaapi
		}
		if (i == 2) {
		    //parse for the twitterapi
		}
	}   
    }    
}

