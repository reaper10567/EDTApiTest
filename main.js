"use strict";

	var keyURL = "&apikey=bzp5ysma7qqdkxfmawv6ak4qg46jg4et";
	
	var USLocaleURL = "?locale=en_US";
	var GBLocaleURL = "?locale=en_GB";
	
	var USBaseURL = "https://us.api.battle.net";
	var EUBaseURL = "https://eu.api.battle.net";
	var characterProfileURL = "/wow/character/";
	var realmStatusURL = "/wow/realm/status"
	
	var achievementsURL = "/wow/Achievement/"
	
	var searchFields = "&fields=stats,items,guild,achievements";
	//THUMBNAIL URL is region + battlenet + static-render + region + string from API
	
	var previousSearches = [];
	
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
		document.querySelector("#fail").innerHTML = "";
		//get which locale to search and build the full URL.
		var locale = document.getElementById("region").value;
		var fullURL;
		//get the character name and realm
		var characterName = document.querySelector("#characterName").value;
		var realm = document.querySelector("#realm").value;
		if(locale == "EU"){
			fullURL = EUBaseURL + characterProfileURL + realm + '/' + characterName + GBLocaleURL + searchFields + keyURL;
		}
		else{
			fullURL = USBaseURL + characterProfileURL + realm + '/' + characterName + USLocaleURL + searchFields + keyURL;
		}
		//jquery makes life so much easier. Q.Q, also deferred stuff is great. i love it.
		$.getJSON(fullURL).done(function(data){
			//basic info
			document.querySelector("#chrName").value = data.name;
			document.querySelector("#chrLvl").value = data.level;
			docment.querySelector("#guildName").value = data.guild.name;
			
			//more complex info
			HandleItems(data.items);
			HandleStats(data.stats);
			HandleAchievements(data.achievements);
		}).fail(function(){
			//let the user know their data was bad. D:
			document.querySelector("#fail").innerHTML = "Failed to get that character/realm combination. make sure you all of the information is correct and try again.";
		});
	}
	
	function HandleItems(data){
	}
	
	function HandleStats(data){
		//main stats
		document.querySelector("#strVal").value = data.str;
		document.querySelector("#agiVal").value = data.agi;
		document.querySelector("#intVal").value = data.int;
		document.querySelector("#stamVal").value = data.sta;
		
		//attack
		document.querySelector("#dmgVal").value = data.mainHandDmgMin + "-" + data.mainHandDmgMax + "/" + data.offHandDmgMin + "-" + data.offHandDmgMax;
		document.querySelector("#speedVal").value = data.mainHandSpeed + "/" + data.offHandSpeed;
		
		//spell
		document.querySelector("#manaRgnVal").value = data.mana5;
		document.querySelector("#spellCritVal").value = data.spellCrit + "%";
		document.querySelector("#spellPenVal").value = data.spellPen + "%";
		
		//defence
		document.querySelector("#armorVal").value = data.armor;
		document.querySelector("#dodgeVal").value = data.dodge + "%";
		document.querySelector("#parryVal").value = data.parry + "%";
		document.querySelector("#blockVal").value = data.block + "%";
		
		//enhancements
		document.querySelector("#critVal").value = data.crit + "%";
		document.querySelector("#hasteVal").value = data.hasteRatingPercent + "%";
		document.querySelector("#masteryVal").value = data.mastery + "%";
		document.querySelector("#leechVal").value = data.leech + "%";
		document.querySelector("#versatilityVal").value = data.versatility + "%";
	}
	
	function HandleAchievements(data){
		var mostRecent = 0;
		var indexOfMostRecent = 0;
		for(var i=0; i < data.achievementsCompletedTimestamp; i++)
		{
			if(data.achievementsCompletedTimestamp[i] > mostRecent)
			{
				mostRecent = data.achievementsCompletedTimestamp[i];
				indexOfMostRecent = i;
			}
		}
		
		var locale = document.getElementById("region").value;
		var fullURL;
		if(locale == "EU"){
			fullURL = EUBaseURL + achievementsURL + data.achievements.achievementsCompleted[indexOfMostRecent] + GBLocaleURL + keyURL;
		}
		else{
			fullURL = USBaseURL + achievementsURL + data.achievements.achievementsCompleted[indexOfMostRecent] + USLocaleURL + keyURL;
		}
		
		$.getJSON(fullURL).done(function(data){
			document.querySelector("#latestAchiev").value = data.title;
		});
	}