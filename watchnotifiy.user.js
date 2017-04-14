// ==UserScript==
// @name           watchnotifiy
// @namespace      wnotify
// @description    wnotify
// @include        http://bithumen.be/*
// @include        http://bithumen.ru/*
// ==/UserScript==

var wlConfig = new Object();
wlConfig.list = new Object();
	
function get_utime() {
	var mytime = new Date;
	var unixtime_ms = mytime.getTime();
	var unixtime = parseInt(unixtime_ms / 1000);
	return(unixtime);
}

function get_oldlist() {
	var wlist = GM_getValue("watchedlist","");
	if (wlist != "") {
		return(wlist.split(','));
	} else {
		var em_a = new Array();
		return(em_a);
	}
}

function gather_watchlist() {
	if (GM_getValue("lastupdate",0) < parseInt(get_utime()-300)) {
	GM_xmlhttpRequest
	(
		{
		method: 'GET',
		url: 'http://bithumen.be/watchlist.php',
		onload: function(results)
				{
					if (results.status == 200) {
						GM_setValue("lastupdate",get_utime());
						var mywhtml = document.createElement('HTML');
						mywhtml.innerHTML = results.responseText;
						wlConfig.list.ids = new Array();
						wlConfig.list.titles = new Array();
						var is_newtorrs = 0;
						var newWatched = "";
						var mytA = mywhtml.getElementsByTagName('TABLE');
						var wptable;
						for (var i=0;i<mytA.length;i++) {
							if (mytA[i].id == "torrenttable")
							{
								wptable = mytA[i];
							}
						}
						var trA = wptable.getElementsByTagName('TR');
						for (var i=1;i<trA.length;i++) {
							var infolink = trA[i].getElementsByTagName('TD')[2].getElementsByTagName('A')[0];
								if (infolink.href.match(/details\.php\?id=[0-9]+/)) {
								var myid = infolink.href.match(/details\.php\?id=([0-9]+)/)[1]
								var mytitle = infolink.innerHTML.replace(/<\/?b>/g,'');
								wlConfig.list.ids.push(myid);
								wlConfig.list.titles.push(mytitle);
									if (oldA.indexOf(myid) == -1 && oldA.length > 0) {
									is_newtorrs++;
										if (infolink.title) {
											newWatched += "<a href=\"/details.php?id="+myid+"\" title=\""+infolink.title+"\">"+mytitle+"</a><br>";
										} else {
											newWatched += "<a href=\"/details.php?id="+myid+"\">"+mytitle+"</a><br>";
										}
									}
								}
						}
		
						if (is_newtorrs != 0) {
							var myP = document.createElement('P');
							document.getElementById('szethuzo').nextSibling.appendChild(myP);
							var myalert = "<table border=0 cellspacing=0 cellpadding=10 bgcolor=red><tr><td style='padding: 10px; background: red'><b><center style=\"margin-bottom: 5px;\"><font color=white>Új megfigyelt torrent:</font></center>"+newWatched+"</b></td></tr></table>";
							myP.innerHTML = myalert;
						}		
						
						GM_setValue("watchedlist",wlConfig.list.ids.toString());
					}
				}
		}
	);
	}
}

var oldA = get_oldlist();
gather_watchlist();

