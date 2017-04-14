// ==UserScript==
// @name           Nightsurfer Epic Themes
// @version        1.8.2
// @author         Vector
// @description    Nightsurfer 3 Demo
// @namespace      bH
// @include        http://bithumen.be/*
// @include        https://bithumen.be/*
// @include        http://bithumen.ru/*
// @include        https://bithumen.ru/*
// ==/UserScript==
(function() {
var idozito = 60 * 5; // 5 precenként változik a kép; 0 = minden frissítésnél; -1 = nem vált magától
var kepvalto = 1; // háttér azonnali váltásához gomb; 0 = kikapcsolva; 1 = logó mellett; 2 = státusz ikonok mellett;
var hibas_atugrasa = false; // ha nem tudja betölteni a képet, azonnal ugorjon a következőre

var hatterek = [
'url("http://vector.uw.hu/hd/wp00.jpg") repeat fixed center top #1E1E1C',
'url("http://vector.uw.hu/hd/wp01.jpg") repeat fixed center top #111111',
'url("http://vector.uw.hu/hd/wp02.jpg") repeat fixed center top #111111',
'url("http://vector.uw.hu/hd/wp03.jpg") repeat fixed center top #020315',
'url("http://vector.uw.hu/hd/wp04.jpg") repeat fixed center top #010A13',
'url("http://vector.uw.hu/hd/wp05.jpg") repeat fixed center top #101417',
'url("http://vector.uw.hu/hd/wp06.jpg") repeat fixed center top #1B1B1D',
'url("http://vector.uw.hu/hd/wp07.jpg") repeat fixed center bottom #111111',
'url("http://vector.uw.hu/hd/wp08.jpg") repeat fixed center top #090C03',
'url("http://vector.uw.hu/hd/wp09.jpg") repeat fixed center top #030914',
'url("http://vector.uw.hu/hd/wp10.jpg") repeat fixed center top #020202',
'url("http://vector.uw.hu/hd/wp11.jpg") repeat fixed center top #040404',
'url("http://vector.uw.hu/hd/wp12.jpg") repeat fixed center top #020202',
'url("http://vector.uw.hu/hd/wp13.jpg") repeat fixed center top #1E1E1C',
'url("http://vector.uw.hu/hd/wp14.jpg") repeat fixed center top #111111',
'url("http://vector.uw.hu/hd/wp15.jpg") repeat fixed center bottom #101417',
'url("http://vector.uw.hu/hd/wp16.jpg") repeat fixed center top #101417',
'url("http://vector.uw.hu/hd/wp17.jpg") repeat fixed center top #202020',
'url("http://vector.uw.hu/hd/wp18.jpg") repeat fixed center center #010A13',
'url("http://vector.uw.hu/hd/wp19.jpg") repeat fixed center top #020202',
'url("http://vector.uw.hu/hd/wp20.jpg") repeat fixed center top #020202'
];

// túl bonyolult az időzítés
//időzítő helyett adott ora percei 10 kép / 60 perc
// 1k / 6p

var dbg = false;

var nextr = false;
var bg = false;
var timer = false;
var loc_file = document.location.pathname.split('?')[0].substring(1);

function nset(e)
{
  if(nset_prep())
  {
    if(idozito > 0)
    {
      var unix = Math.round((new Date()).getTime() / 1000);
      if(!nextr) nextr = _cookie('nset_refresh');
      if(dbg)console.log('dbg: nextr = '+nextr+'; unix = '+unix);
    }

    if(!bg) bg = _cookie('nset_bg') * 1;
    if(isNaN(bg) || bg >= hatterek.length) bg = 0;
    if(dbg)console.log('dbg: nset_bg = '+_cookie('nset_bg')+'; bg = '+bg);

    if((idozito > 0 && (isNaN(nextr) || nextr <= unix)) || idozito == 0 || e === true)
    {
      bg = (bg >= hatterek.length -1) ? 0 : bg + 1;
      set_cookie('nset_bg', bg);

      if(idozito > 0)
      {
        if(e !== true && !isNaN(_cookie('nset_refresh')) && _cookie('nset_refresh') > unix) nextr = _cookie('nset_refresh');
        else nextr = unix + idozito;
        
        set_cookie('nset_refresh', nextr);
        if(dbg)console.log('dbg: nextr = ' + nextr);
      }

      if(timer != false && idozito > 0)
      {
        clearTimeout(timer);
        timer = false;
      }
    }

    var h = new Image();
    h.src = hatterek[bg].split('url("')[1].split('")')[0];
    if(hibas_atugrasa)
    {
      eventon('error',function()
        {
          //hatterek.splice(bg, 1); //
          if(dbg)console.log('dbg: img error.');
          nset(true);
        }, h);
    }
    if(e === true || e === false)
    {
      eventon('load',function()
      {
        document.body.style.background = document.body.newBg;
        
        if(dbg)console.log('dbg: img load newBg = '+document.body.newBg);
      }, h);

      document.body.newBg = hatterek[bg];
    }
    else document.body.style.background = hatterek[bg];

    if(dbg)console.log('dbg: document.body.style.background = ' + document.body.style.background);

    if(timer == false && idozito > 0)
    {
      if(dbg)console.log('dbg: setTimeout( nset(false), ' + (nextr - unix) + 's )');
      timer = setTimeout(function(){nset(false);}, (nextr - unix) * 1000);
    }
  }
}

var kov = false;
var css3 = false;
function nset_prep()
{
  if(document.getElementsByTagName('link')[0].href.indexOf('nightsurfer.css') == -1) return false;
  
  if(css3 == false)
  {
    if(dbg)console.log('dbg: css3 init.');
    
    css3 = '' // Nightsurfer 3.0 Beta // Letöltés alkategóriák hibásan jelennek meg  <--- bugfixek nincsenek beültetve!
         + 'table { background-color: rgba(48,48,48,0.85); }'
         + 'table.mainouter { background-color: rgba(0,0,0,0); }'
         + '#maintd > table.main { background-color: rgba(0,0,0,0); }'
         + '#maintd > div > table.main { background-color: rgba(0,0,0,0); }'
         + '#maintd > center > table.main { background-color: rgba(0,0,0,0); }'
         + '#maintd > form > table.main { background-color: rgba(0,0,0,0); }'
         + '#maintd > p > table.main { background-color: rgba(0,0,0,0); }'
         + '#maintd > center > p > table.main { background-color: rgba(0,0,0,0); }'
         + '#lsForm table.main { background-color: rgba(0,0,0,0); }'
         + '#statusouter { background-color: rgba(48,48,48,0.6) !important; }'
         + '#status { background-color: rgba(0,0,0,0); }'
         + '#footer { background-color: rgba(0,0,0,0); }'
         + '#footer table { background-color: rgba(48,48,48,0.6); }'
         + '#footer tr td table tr td { border-left: 12px solid rgba(32,32,32,0.6) !important; }'
         + '#menu { background-color: rgba(0,0,0,0); }'
         + '.navigation a { text-shadow: 0 0 10px black; }'
         + '.navigation a:hover { background-color: rgba(0,0,0,0) !important; text-shadow: 0 0 5px black; }'
         + 'div#showFiltersDiv a { background-color: rgb(40,40,40); opacity: 0.7; border-radius: 5px; }'
         + 'div#showFiltersDiv a:hover { background-color: rgb(32,32,32); opacity: 1; box-shadow: 0 0px 10px -5px #0090CF; }'//box-shadow: 0 2px 15px -5px #0090CF;
         + 'h1, h2 { text-shadow: 0 0 4px black; }'
         + '#forum, #torrenttable { background-color: rgba(0,0,0,0) !important; }'
         + '#forum tr, #torrenttable tr { background-color: rgba(48,48,48,0.96); }'
         + '#forum > tbody > tr:hover, #torrenttable > tbody > tr:hover { background-color: rgba(34,34,34,0.96) !important; }'
         + '#forum tr td table { background-color: rgba(0,0,0,0); }'
         + '#forum tr td table tr { background-color: rgba(0,0,0,0); }'
         + '#forum > tbody > tr:hover td.embedded { background-color: rgba(0,0,0,0) !important; }'
         + '#forum > tbody > tr td.embedded { background-color: rgba(0,0,0,0); }'
         //+ '#logo { display:none; }'
         + '#nset_kov { cursor: pointer; }'
         + '#nset_kov:hover { opacity: 0.9 !important; }';
    
      var heade = document.getElementsByTagName('head')[0];
      if (!heade) { if(dbg)console.log('dbg: heade = '+heade); }
      var stylee = document.createElement('style');
      stylee.type = 'text/css';
      stylee.innerHTML = css3;
      heade.appendChild(stylee);
    
    if(dbg)console.log('dbg: css3.length = '+css3.length);

    if(kov == false && kepvalto != 0)
    {
      kov = document.createElement('IMG');
      kov.setAttribute('id', 'nset_kov');
      kov.setAttribute('title', 'Következő háttér');
      
      eventon('click', function(){nset(true);}, kov);
	    
      if(document.getElementById('logo').offsetHeight == 0 || kepvalto == 2)
      {
        kov.src = 'data:image/png;base64,'+picture_go();
        kov.style.margin = '1px 3px';
        kov.style.width = '13px';
        kov.style.height = '11px';
        kov.style.opacity = '0.7';
        var td = document.getElementsByTagName('td')[5];
        td.insertBefore(kov, td.firstChild);
      }
      else
      {
        kov.src = '/media/img/null.png';
        kov.setAttribute('class', 'spr_i sdropdown');
        kov.style.margin = '1px';
        kov.style.width = '13px';
        kov.style.height = '11px';
        kov.style.opacity = '0.3';
        var td = document.getElementsByTagName('td')[2];
        td.setAttribute('align', 'left');
        td.setAttribute('valign', 'top');
        td.appendChild(kov);
      }

      if(dbg)console.log('dbg: td = ' + td);
    }
  }
  
  return true;
}


function picture_go()
{
  return 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKISURBVDjLjdLNa1RXHMbx77lzZ+6dOBqZxMa3BBJBiG1alb4o4sZSceGiQl1VaBeluBV060pCKe0/UAqlrtUuisuKLVEQNMSFYqxpTFJjSJjEyWQy95x7zu/nIoqOL6XP7pzFh8NzHvPr76M/ipgvV52k1vN6tP1YjCEt8ss3n+89BRCLmhNHD/RuStPUGFPgv5IJBJ9z6cqDr4E1YNVKkiSpOX91iYwaDTNOf8885WIdr8Licpk7Dzrp0EFiujh9vJ8gxjxHY+chigpEBlw0R3/3PElpirpt4IMnThIGercw+c86Npa6EWl/VQwgQBQZrC5QKi7xpFXHhgznPV6bJElC05bpKkco2lbMC8AY1As25GTe0sotTjxBAJOjEogjg2p7qxGA6hqQsolGcx1KESsB6wPGlGg2KlRKWykUIlDzFiAyVArbeDTXQ1ar0KFV1psqfrGLuZktROt/Yio7Th5sO6AvA8V32Frew9LYEv72JIw9pHhvgb6uj7EhZ3v3IGcu7ieoNW0dqMJ47VuCCEGEnXaBOztSVBxOJrCtk2yr7mRw8yc0siaX/z224cIPtvLX6cWVWFUxwJG1YQFQGHrC7bHv+OzdrwgqBAkIymx9hqHtB1hxLW5N/1l//1xUjc0b9hrKG8m8I6gwVfubXDxecvKQs2wb7O49yEq+Gt2YHKnFadHUkbzzg559YMwzSsl8hg+eng19eAkEFR7Xp6lWNjM6c41rEyMLznPY/Pzb6PeiZr8LOvTyF1+pfdGZOYcTR+YdO7p3sW/gMDenrzMycX21YVc+mh3Wu+bVYbwt752Lmh/2Heq4ev+PR074dHZYxwH+NzBw1jSDFDpaEgbmh3Xy+f1Tcg5RdvF2jMwAAAAASUVORK5CYII=';
}

/* adott süti kinyerése */
function _cookie(name)
{
  var cookie_place = document.cookie.indexOf(name + '=');

  if(cookie_place != -1) return document.cookie.substr(cookie_place + name.length + 1).split('; ')[0];
  else return null;
}

/* süti beállítás / törlés */
function set_cookie(name, val, del)
{
  if(del) del = 'Thu, 01-Jan-1970 00:00:01 GMT';
  else del = 'Mon, 22 Aug 2087 03:14:15 GMT';

  document.cookie = name + '=' + val + '; expires=' + del + '; path=/';
}

function eventon(type, func, elem)
{
  if(!elem) elem = window;
  if(elem.attachEvent) elem.attachEvent('on'+type, func);
  else elem.addEventListener(type, func, false);
}

//eventon('load', nset);
if(window.opera) window.addEventListener('DOMContentLoaded', nset, false);
else nset();

})();