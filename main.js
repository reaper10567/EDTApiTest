"use strict";

	var keyURL = "&apikey=bzp5ysma7qqdkxfmawv6ak4qg46jg4et";
	
	var USLocaleURL = "?locale=en_US";
	var GBLocaleURL = "?locale=en_GB";
	
	var USBaseURL = "https://us.api.battle.net";
	var EUBaseURL = "https://eu.api.battle.net";
	var characterProfileURL = "/wow/character/";
	var realmStatusURL = "/wow/realm/status"
	
	window.onload = function(){
		//setup the function on the button to do stuffs
		document.querySelector("#search").onclick = Search;
		document.getElementById("region").onchange = GetRealmInformation;
		GetRealmInformation();
	}
	
	function GetRealmInformation(){
		//query for the available realms and replace the current ones with the new ones
		
		var locale = document.getElementById("region").value;
		var fullURL;
		if(locale == "EU"){
			fullURL = EUBaseURL + realmStatusURL + GBLocaleURL + keyURL;
		}
		else{
			fullURL = USBaseURL + realmStatusURL + USBaseURL + keyURL;
		}
		//jquery makes life so much easier. Q.Q
		$.getJSON(fullURL).done(function(data){
			//clear out the old stuff
			var selec = document.getElementById("realm");
			selec.options.length = 0;
			var realmData = data.realms;
			//in with the new
			for(int i=0; i < realmData.length; i++){
				var individualRealm = realmData[i];
				select.options.add(new Option(individualRealm.name,individualRealm.name));
			}
		});
	}
	
	function Search(){
		//get which locale to search and build the full URL.
	}