var html = ""
var html2 = ""
        var USapiurl = "http://api.flickr.com/services/feeds/photos_public.gne?tags=brownsvilleTX,Brownsville%2C+TX&m&format=json&jsoncallback=?"
        var MXapiurl = "http://api.flickr.com/services/feeds/photos_public.gne?tags=matamorosMexico,Matamoros%2C+Mexico&m&format=json&jsoncallback=?"
        
        $(document).ready(function(){
           console.log("document ready") 
           $.getJSON(USapiurl, function(json){
                console.log(json);
                //html+='<h1>'+json.title+'</h1>';               
                
                $.each(json.items, function(i, data){
                    console.log(data.media.m);
                    console.log(data.author_id);
                    console.log(data.description);
                    html += '<div><p><img src="' + data.media.m +'"></p><p>#BrownsvilleTX</p><div>';
                    
                    })
                $("#results").html(html);
            });
           
           $.getJSON(MXapiurl, function(json2){
                console.log(json2);
                //html+='<h1>'+json2.title+'</h1>';                
                
                $.each(json2.items, function(i, data2){
                    console.log(data2.media.m);
                    console.log(data2.author_id);
                    console.log(data2.description);
                    html2 += '<div><p><img src="' + data2.media.m +'"></p><p>#MatamorosMexico</p><div>';
                    
                    })
                $("#results2").html(html2);
            })
            
        });