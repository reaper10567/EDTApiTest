"use strict";

	var keyURL = "&apikey=bzp5ysma7qqdkxfmawv6ak4qg46jg4et";
	
	var USLocaleURL = "?locale=en_US";
	var GBLocaleURL = "?locale=en_GB";
	
	var USBaseURL = "https://us.api.battle.net";
	var EUBaseURL = "https://eu.api.battle.net";
	var characterProfileURL = "/wow/character/";
	var realmStatusURL = "/wow/realm/status"
	
	var searchFields = "&fields=stats,items,guild"
	
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
			fullURL = USBaseURL + realmStatusURL + USLocaleURL + keyURL;
		}
		//jquery makes life so much easier. Q.Q , also anonymous functions are bae.
		$.getJSON(fullURL).done(function(data){
			//clear out the old stuff
			var selec = document.getElementById("realm");
			selec.options.length = 0;
			var realmData = data.realms;
			//in with the new
			for(var i=0; i < realmData.length; i++){
				var individualRealm = realmData[i];
				selec.options.add(new Option(individualRealm.name,individualRealm.name));
			}
		});
	}
	
	function Search(){
		//get which locale to search and build the full URL.
		var locale = document.getElementById("region").value;
		var fullURL;
		//get the character name and realm
		var characterName = document.querySelector("#characterName").value;
		var realm = document.querySelector("#realm");
		if(locale == "EU"){
			fullURL = EUBaseURL + characterProfileURL + realm + '/' + characterName + GBLocaleURL + searchFields + keyURL;
		}
		else{
			fullURL = USBaseURL + characterProfileURL + realm + '/' + characterName + USLocaleURL + searchFields + keyURL;
		}
		//jquery makes life so much easier. Q.Q, also deferred stuff is great. i love it.
		$.getJSON(fullURL).done(function(data){
			//use the data somehow
			console.log(data);
		}).fail(function(){
			//let the user know their data was bad. D:
			document.querySelector("#fail").innerHTML = "Failed to get that character/realm combination. make sure you all of the information is correct and try again.";
		});
	}