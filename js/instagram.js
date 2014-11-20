// JavaScript Document


//Use this url below to get your access token
//https://instagram.com/oauth/authorize/?display=touch&client_id=08be6ee3321149528ae3c106d6fa9081&redirect_uri=http://ellencurrin.com/project4/redirect&response_type=token 

//if you need a user id for yourself or someone else use:
//http://jelled.com/instagram/lookup-user-id

//use "API Console" to build queries (i.e. for location) to search/filter for photos!	
						

	
	//var apiurl = "https://api.instagram.com/v1/tags/baseball/media/recent?access_token=248660894.1305eca.efae36b51a1947b98c083d9ef9f820a4&callback=?"


var MexicoCity = "Tijuana"
var USCity = "SanDiego"

/*$(document).ready(function(){
	console.log("ready!");
	loadTwinCities()
});

function loadTwinCities(){
	$.ajax({
		type: "GET",
		dataType: "text",
		cache: false,
		url: "data/twincities.json",
		success: parseCities,
		});
}*/



$(function() {
	
	//USA
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
	
});
		
		
		
		
	

		
