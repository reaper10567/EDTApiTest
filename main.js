"use strict";

	var keyURL = "&apikey=bzp5ysma7qqdkxfmawv6ak4qg46jg4et";
	
	var USLocaleURL = "?locale=en_US";
	var GBLocaleURL = "?locale=en_GB";
	
	var USBaseURL = "https://us.api.battle.net";
	var EUBaseURL = "https://eu.api.battle.net";
	var characterProfileURL = "/wow/character/";
	var realmStatusURL = "/wow/realm/status"
	
	var achievementsURL = "/wow/achievement/"
	
	var searchFields = "&fields=stats,items,guild,achievements";
	
	
	var previousSearches = [];
	var previousSearchesLocale = [];
	
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
			document.querySelector("#chrName").innerHTML = data.name;
			document.querySelector("#chrLvl").innerHTML = data.level;
			document.querySelector("#guildName").innerHTML = data.guild.name;
			
			//more complex info
			HandleItems(data.items);
			HandleStats(data.stats);
			HandleAchievements(data.achievements);
			
			//store up to 6 searches for comparison purposes.
			if(previousSearches.length > 6)
			{
				for(var i =0; i < previousSearches.length-1; i++)
				{
					previousSearches[i] = previousSearches[i+1];
					previousSearchesLocale[i] = previousSearches[i+1];
				}
			}
			previousSearches.push(data);
			previousSearchesLocale.push(locale);
			RefreshComparisonChoices();
		}).fail(function(){
			//let the user know their data was bad. D:
			document.querySelector("#fail").innerHTML = "Failed to get that character/realm combination. make sure you all of the information is correct and try again.";
		});
	}
	
	function RefreshComparisonChoices(){
		
		for(var i=0; i < previousSearches.length; i++)
		{
			if(document.querySelector("#compare"+i).hasChildNodes()){
				document.querySelector("#compare"+i).removeChild(document.querySelector("#compare"+i).childNodes[0]);
			}
			var newButton = document.createElement("button");
			newButton.id = "compareButton";
			newButton.value = i;
			newButton.style.minHeight = "85px";
			newButton.style.minWidth = "100px";
			
			//THUMBNAIL URL is region + battlenet + static-render + region + string from API
			if(previousSearchesLocale[i] == "EU"){
				newButton.style.backgroundImage = "url(https://eu.battle.net/static-render/eu/"+previousSearches[i].thumbnail+")";
			}
			else{
				newButton.style.backgroundImage = "url(https://us.battle.net/static-render/us/"+previousSearches[i].thumbnail+")";
			}
			document.querySelector("#compare"+i).appendChild(newButton);
		}
	}
	
	function HandleItems(data){
		//populate character equipment info here
	}
	
	function HandleStats(data){
		//main stats
		document.querySelector("#strVal").innerHTML = data.str;
		document.querySelector("#agiVal").innerHTML = data.agi;
		document.querySelector("#intVal").innerHTML = data.int;
		document.querySelector("#stamVal").innerHTML = data.sta;
		
		//attack
		document.querySelector("#dmgVal").innerHTML = data.mainHandDmgMin + "-" + data.mainHandDmgMax + "/" + data.offHandDmgMin + "-" + data.offHandDmgMax;
		document.querySelector("#speedVal").innerHTML = data.mainHandSpeed + "/" + data.offHandSpeed;
		
		//spell
		document.querySelector("#manaRgnVal").innerHTML = data.mana5;
		document.querySelector("#spellCritVal").innerHTML = data.spellCrit + "%";
		document.querySelector("#spellPenVal").innerHTML = data.spellPen + "%";
		
		//defence
		document.querySelector("#armorVal").innerHTML = data.armor;
		document.querySelector("#dodgeVal").innerHTML = data.dodge + "%";
		document.querySelector("#parryVal").innerHTML = data.parry + "%";
		document.querySelector("#blockVal").innerHTML = data.block + "%";
		
		//enhancements
		document.querySelector("#critVal").innerHTML = data.crit + "%";
		document.querySelector("#hasteVal").innerHTML = data.hasteRatingPercent + "%";
		document.querySelector("#masteryVal").innerHTML = data.mastery + "%";
		document.querySelector("#leechVal").innerHTML = data.leech + "%";
		document.querySelector("#versatilityVal").innerHTML = data.versatility + "%";
	}
	
	function HandleAchievements(data){
		var mostRecent = 0;
		var indexOfMostRecent = 0;
		for(var i=0; i < data.achievementsCompletedTimestamp.length; i++){
			if(data.achievementsCompletedTimestamp[i] > mostRecent){
				mostRecent = data.achievementsCompletedTimestamp[i];
				indexOfMostRecent = i;
			}
		}
		
		var locale = document.getElementById("region").value;
		var fullURL;
		if(locale == "EU"){
			fullURL = EUBaseURL + achievementsURL + data.achievementsCompleted[indexOfMostRecent] + GBLocaleURL + keyURL;
		}
		else{
			fullURL = USBaseURL + achievementsURL + data.achievementsCompleted[indexOfMostRecent] + USLocaleURL + keyURL;
		}
		
		$.getJSON(fullURL).done(function(data){
			document.querySelector("#latestAchiev").innerHTML = data.title;
		});
	}