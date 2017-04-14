// ==UserScript==
// @name           seedmark
// @namespace      seedmark
// @description    mark seed/leech torrent
// @include        http://bithumen.be/browse.php*
// ==/UserScript==

var http_request;
var sm = new Object();
sm.s_Color="#9fd589";
sm.l_Color="#e27873";
sm.leechlist = new Array();
sm.seedlist = new Array();

function get_utime()
{
	var mytime = new Date;
	var unixtime_ms = mytime.getTime();
	var unixtime = parseInt(unixtime_ms / 1000);
	return(unixtime);
}

function getCookie(c_name) {
if (document.cookie.length>0)
  {
  c_start=document.cookie.indexOf(c_name + "=");
  if (c_start!=-1)
    {
    c_start=c_start + c_name.length+1;
    c_end=document.cookie.indexOf(";",c_start);
    if (c_end==-1) c_end=document.cookie.length;
    return unescape(document.cookie.substring(c_start,c_end));
    }
  }
return "";
}

function isSeeding(tid) {
	for (var i=0; i<sm.seedlist.length; i++) {
		if (tid == sm.seedlist[i]) { return true; }
	}
	return false;
}

function isLeeching(tid) {
	for (var i=0; i<sm.seedlist.length; i++) {
		if (tid == sm.leechlist[i]) { return true; }
	}
	return false;
}

function getSLList(uid) {
	var url = "http://bithumen.be/userdetails.php?id="+uid;
	http_request = false;
    if (window.XMLHttpRequest) {
        http_request = new XMLHttpRequest();
        if (http_request.overrideMimeType) {
			http_request.overrideMimeType('text/xml');
        }
    } else if (window.ActiveXObject) {
        try {
            http_request = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                http_request = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {}
        }
    }
    
	if (!http_request) {
        alert('Giving up  Cannot create an XMLHTTP instance');
    return false;
    }
    http_request.onreadystatechange = function() { if (http_request.readyState == 4) { if (http_request.status == 200) { parseSLList(http_request.responseText); } else { alert('There was a problem with the request.'); } } };
    http_request.open('GET', url, true);
    http_request.send(null);
}

function parseSLList(input) {
	var htmlSL = document.createElement('HTML');
	htmlSL.innerHTML = input;
	var SList = new Array();
	var LList = new Array();
	var marray = htmlSL.getElementsByTagName('SCRIPT')[1].innerHTML.match(/var inner =(.*)/mg);
	if (marray[1].match(/details\.php\?id=[0-9]+/gm)) {
		var narray = marray[1].match(/details\.php\?id=([0-9]+)/gm);
		for (var i=0; i<narray.length; i++) {
			SList.push(narray[i].split("=")[1]);
		}
		document.cookie="slist="+SList;
	}
	if (marray[2].match(/details\.php\?id=[0-9]+/gm)) {
		var larray = marray[2].match(/details\.php\?id=([0-9]+)/gm);
		for (var i=0; i<larray.length; i++) {
			LList.push(larray[i].split("=")[1]);
		}
		document.cookie="llist="+LList;
	}
	var mytime = new Date;
	var unixtime_ms = mytime.getTime();
	var unixtime = parseInt(unixtime_ms / 1000);
	document.cookie="SStatsUpdate="+unixtime;
}

function init_marktorrents() {
	updateSMvar();
	var TMain = document.getElementById('torrenttable');
	var TRows = TMain.getElementsByTagName('TR');
	for (var i=1;i<TRows.length;i++) {
		TRows[i].id='torrentid_'+i;
		var torrentid = TRows[i].getElementsByTagName('TD')[1].getElementsByTagName('A')[0].href.match(/details\.php\?id=([0-9]+)$/)[1];
		if (isSeeding(torrentid)) {
			TRows[i].style.backgroundColor=sm.s_Color;
		} else if (isLeeching(torrentid)) {
			TRows[i].style.backgroundColor=sm.l_Color;
		}
	}
	if (getCookie("SStatsUpdate") == "") {
		setTimeout(init_marktorrents,1000);
	}
}

function init_getSLstats() {
	var addtime = 300;
	var timenow = get_utime();
	var c_time = parseInt(getCookie("SStatsUpdate"));
	if ((getCookie("slist") == "" && getCookie("llist") == "" && getCookie("SStatsUpdate") == "") || c_time < parseInt(timenow-addtime) ) {
		var uid = document.getElementById('status').getElementsByTagName('A')[0].href.match(/userdetails\.php\?id=([0-9]+)/)[1];
		getSLList(uid);
	} 
}

function updateSMvar() {
	var c_slist = getCookie("slist");
	var c_llist = getCookie("llist");
	var sArray = c_slist.split(",");
	var lArray = c_llist.split(",");
	for (var i=0;i<sArray.length;i++) { sm.seedlist.push(sArray[i]); }
	for (var i=0;i<lArray.length;i++) { sm.leechlist.push(lArray[i]); }
}


init_getSLstats();
init_marktorrents();
