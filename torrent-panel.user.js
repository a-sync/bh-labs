// ==UserScript==
// @name        Torrent Panel
// @version     0.1.6
// @author      Vector
// @namespace   bH
// @include     http://bithumen.be/*
// @include     https://bithumen.be/*
// @include     http://bithumen.ru/*
// @include     https://bithumen.ru/*
// @exclude     http://bithumen.be/tools/*
// @exclude     https://bithumen.be/tools/*
// @exclude     http://bithumen.ru/tools/*
// @exclude     https://bithumen.ru/tools/*
// @exclude     http://bithumen.be/wiki/*
// @exclude     https://bithumen.be/wiki/*
// @exclude     http://bithumen.ru/wiki/*
// @exclude     https://bithumen.ru/wiki/*
// @-exclude     http://bithumen.be/browse.php?*
// @-exclude     https://bithumen.be/browse.php?*
// @-exclude     http://bithumen.ru/browse.php?*
// @-exclude     https://bithumen.ru/browse.php?*
// ==/UserScript==
(function() {
// ##########
// Beállítások
// ##########
var tt_torrentek     = 25; // max. megjelenített torrentek száma
var tt_offset        = 0; //
var csak_uj          = true; // csak az új torrenteket mutassa
var minden_kat       = false; // minden kategóriát mutasson
var cim_max_meret    = 48; // ilyen hosszan vágja le a címeket (0 értékkel nem vág)
var doboz_css        = 'position: fixed; left: -2px; top: 80px; box-shadow: 0 0 4px -2px rgba(0,0,0,0.8); '; //panel stílusa pl.: position: absolute; opacity: 0.9; vagy background: white;
var torrent_checker  = 120; // ennyi másodpercenként ellenőrizzen (minimum 60)
// ##########
// TODO: tovabbi torrentek betöltesere gomb / (lapozo)
// Uj jelzesek torlesere gomb
// csak betoltott es ujnak jelzetteket torolje (tol-ig allitsa a sutit) / vagy mindent
// kategoria nev title-be
// levagott nev title-be
// csak a rejtett kategóriák mutatása
// loader gif 
/*
#ajaxload {
    background-image: url("data:image/png;base64,R0lGODlhEAAQAPIAACAgILq6ukNDQ5GRkbq6un5+fmpqamFhYSH+GkNyZWF0ZWQgd2l0aCBhamF4bG9hZC5pbmZvACH5BAAKAAAAIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQACgABACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkEAAoAAgAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkEAAoAAwAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkEAAoABAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQACgAFACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQACgAGACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAAKAAcALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==");
    background-position: left top;
    background-repeat: no-repeat;
    height: 16px;
    margin-left: -17px !important;
    margin-top: 5px;
    overflow: hidden;
    padding-left: 16px;
    width: 0;
}
*/

var dbg = false; // DEBUG

// ##########
var css = false;
var tt_doboz = false;
var livedata = false;
var tt_timer = false;
var loc = document.location.pathname + document.location.search;
//var loc_file = document.location.pathname.split('?')[0];
function tt()
{
  var status = document.getElementById('status');
  if(dbg)console.log('dbg: '+navigator.userAgent+'\n');
  
  if(loc == '/browse.php')
  {
    //if(!minden_kat)
    //{
      var chkboxes = document.getElementById('lsForm').getElementsByTagName('table')[1].getElementsByTagName('input');
      if(dbg)console.log('dbg: chkboxes.length = '+chkboxes.length);
      var c = 0;
      var cats = '';
      for(var a = 0; chkboxes.length > a; a++)
      {
        if(chkboxes[a].checked == true)
        {
          c++;
          if(cats != '') cats += ',';
          cats += chkboxes[a].getAttribute('name').substr(1);
        }
      }
      
      set_cookie('tp_cats', cats);
      if(dbg)console.log('dbg: cats = '+cats);
    //}
  }
  //else
  //{
    ajax_get([], function ()
      {
        if (getreq.readyState == 4)
        {
          if (getreq.status == 200)// || 304
          {
            eval( getreq.responseText ); // livedata[] deklarálás majd loadjscssfile() rögtön lefut aztán fileloaded()
            if(dbg)console.log('dbg: torrents-new.js; livedata.length = '+livedata.length);
            
            var cats_a = [];
            if(!_cookie('tp_cats')) set_cookie('tp_cats', '');
            else if(_cookie('tp_cats').length > 0 && !minden_kat) cats_a = _cookie('tp_cats').split(',');

            if(cats_a.length != 0)
            {
              for(var b = 0; livedata.length > b; b++)
              {
                if(typeof livedata[b] == 'object')
                {
                  if(cats_a.indexOf(livedata[b].c.toString()) == -1)
                  {
                    livedata.splice(b, 1);
                    b--;
                  }
                }
              }
            }
            
            if(dbg)console.log('dbg: torrents-new.js szűrve; livedata.length = '+livedata.length);
            //if(dbg)console.log(livedata);

            if(livedata.length >= tt_torrentek + tt_offset || (csak_uj && livedata[livedata.length-1].i <= _cookie('lastid')))
            {
              tt_load();
            }
            else
            {
              loadjscssfile('', 'bh');
            }
          }
        }
      },'/media/lscache/new/torrents-new.js?');
  //}
}

function tt_load()
{
    if(dbg)console.log('dbg: tt_load()');
    if(!css)
    {
      css = '#tt_doboz { padding: 0px; '+doboz_css+' } #tt_doboz tr td table { border-radius: 0; margin: 0; width: 100%; }'
              + '.tt_torrent a:link, .tt_torrent a:visited { border: none; display: block; height: 21px; text-decoration: none; line-height: 21px; padding: 2px; }'
              + '.tt_torrent a:hover { box-shadow: 0 0 4px -2px #0090cf; position: relative; left: 1px; }'
              + '.tt_torrent img { margin: 0; width: 21px; height: 21px; background-image: url(data:image/png;base64,'+merged_cats_mini()+'); background-repeat: no-repeat; }'
              + '#tt_doboz tr td { padding: 2px 5px; }'
              + '.tt_torrent { padding: 0 !important; }'
              + '.ms_c23 {background-position: 0 0;}     .ms_c24 {background-position: -21px 0;}     .ms_c25 {background-position: -42px 0;}     .ms_c37 {background-position: -63px 0;}     .ms_c33 {background-position: -84px 0;}     .ms_c30 {background-position: -105px 0;}'
              + '.ms_c19 {background-position: 0 -21px;} .ms_c20 {background-position: -21px -21px;} .ms_c5  {background-position: -42px -21px;} .ms_c39 {background-position: -63px -21px;} .ms_c40 {background-position: -84px -21px;} .ms_c34 {background-position: -105px -21px;}'
              + '.ms_c7  {background-position: 0 -42px;} .ms_c41 {background-position: -21px -42px;} .ms_c26 {background-position: -42px -42px;} .ms_c42 {background-position: -63px -42px;} .ms_c28 {background-position: -84px -42px;} .ms_c29 {background-position: -105px -42px;}'
              + '.ms_c9  {background-position: 0 -63px;} .ms_c35 {background-position: -21px -63px;} .ms_c1  {background-position: -42px -63px;} .ms_c4  {background-position: -63px -63px;} .ms_c31 {background-position: -84px -63px;} .ms_c36 {background-position: -105px -63px;}'
              + '.ms_c6  {background-position: 0 -84px;} .ms_c38 {background-position: -21px -84px;} .ms_c22 {background-position: -42px -84px;} .ms_c21 {background-position: -63px -84px;} .ms_c32 {background-position: -84px -84px;} .ms_c27 {background-position: -105px -84px;}'
              + ' #tt_doboz .tt_torrent span { display: none; padding-left: 5px;  } #tt_doboz:hover .tt_torrent span { display: inline; }';

       var head = document.getElementsByTagName('head')[0];
       if (!head) { if(dbg)console.log('dbg: head = '+head); }
       var style = document.createElement('style');
       style.type = 'text/css';
       style.innerHTML = css;
       head.appendChild(style);
    }
    
    // doboz beszúrása
    if(!tt_doboz)
    {
      tt_doboz = document.createElement('TABLE');
      tt_doboz.setAttribute('id', 'tt_doboz');
      tt_doboz.setAttribute('cellpadding', '2');
      tt_doboz.setAttribute('cellspacing', '2');
      
      document.body.appendChild(tt_doboz);
    }
    
	var temp_doboz = tt_doboz.cloneNode(true);
    temp_doboz.innerHTML = '';
    
    var cats_a = [];
    if(!_cookie('tp_cats')) set_cookie('tp_cats', '');
    else if(_cookie('tp_cats').length > 0 && !minden_kat) cats_a = _cookie('tp_cats').split(',');

    if(dbg){console.log('dbg: cats_a = ');console.log(cats_a);}
    
    var tr = document.createElement('TR');
    tr.innerHTML = '<td height="4"> </td>';
    temp_doboz.appendChild(tr.cloneNode(true));
    
    var t = 0;
    for(var i = tt_offset; t < tt_torrentek && typeof livedata[i] == 'object'; i++)
    {
      //if(i==0&&dbg)console.log(livedata[i]);
      if((!csak_uj || (csak_uj && livedata[i].i > _cookie('lastid'))) && (cats_a.length == 0 || cats_a.indexOf(livedata[i].c.toString()) != -1))
      {
        var name = livedata[i].n.split('|');
        if(cim_max_meret > 0 && name[0].length > cim_max_meret)
        {
            if(!name[1]) name[1] = name[0];
            name[0] = name[0].substr(0, cim_max_meret).trim() + '...';
        }
        
        tr.innerHTML = '<td><table class="main" cellpadding="0" cellspacing="0"><tr><td class="tt_torrent" valign="center"><a title="'+name[1]+'" href="/details.php?id='+livedata[i].i+'">'
                     + '<img class="ms_c'+livedata[i].c+'" src="media/img/null.png" align="left"/><span>'+name[0]+'</span></a></td></tr></table></td>';
        
        temp_doboz.appendChild(tr.cloneNode(true));
        t++;
      }
    }
    
    tr.innerHTML = '<td height="4"> </td>';
    temp_doboz.appendChild(tr.cloneNode(true));

    if(t == 0) tt_doboz.style.display = 'none';
    else
    {
        tt_doboz.innerHTML = temp_doboz.innerHTML;
        tt_doboz.style.display = 'table';
    }

    if(!tt_timer) tt_timer = setInterval(tt,((torrent_checker>=(10*(249%2+1)*3))?torrent_checker:99)*1000);//4n71n006
}

var loadjs = '';
function loadjscssfile(file, type)
{
  if(type == 'js' && file.indexOf('/lscache/archive/') != -1)
  {
    loadjs = file;
  }
  else if(type == 'bh')
  {
    if(dbg)console.log('dbg: loadjscssfile( '+file+' , '+type+' )');
    var file = loadjs.split('/lscache/archive/')[1];
    ajax_get([], function ()
      {
        if (getreq.readyState == 4)
        {
          if (getreq.status == 200)// || 304
          {
            eval( getreq.responseText );
            if(dbg)console.log('dbg: '+file+'; livedata.length = '+livedata.length);
            
            tt_load();
          }
        }
      },'/media/lscache/archive/'+file);
  }
}

function fileLoaded(file)
{
  if(dbg)console.log('dbg: fileLoaded( file ); --> '+file);
}

//kicsinyített kategória képek BASE64/png
function merged_cats_mini()
{
  return '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';
}

// ajax get
var getreq = false;
function ajax_get(data, func, file) // ;charset=iso-8859-2
{
   if(!file) var file = "ajax.php?";
   if(file.substr(-1) != '?') file += '?';
   
   getreq = false;
   if (window.XMLHttpRequest)
   {//Mozilla, Safari
      getreq = new XMLHttpRequest();
      if (getreq.overrideMimeType) getreq.overrideMimeType("text/html;charset=iso-8859-2");
   }
   else if (window.ActiveXObject)
   {//IE
      try { getreq = new ActiveXObject("Msxml2.XMLHTTP"); }
      catch (e)
      {
        try { getreq = new ActiveXObject("Microsoft.XMLHTTP"); }
        catch (e) {}
      }
   }
   if(!getreq)
   {
     if(dbg)console.log('An error occurred during the XMLHttpRequest!');
     return false;
   }

   var parameters = '';
   var amp = '';
   for(var i in data)
   {
     parameters += amp + i + '=' + escape(encodeURI( data[i] ));
     if(amp == '') amp = '&';
   }
   
   getreq.onreadystatechange = func;
   getreq.open("GET", file + parameters, true);
   //getreq.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
   getreq.send();

   return true;
}

// trim
String.prototype.trim = function()
{
  //return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  var str = this.replace(/^\s\s*/, ''), i = str.length, ws = /\s/;
  while(ws.test(str.charAt(--i)));
  return str.slice(0, i + 1);
};

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

// ##########
// Program inicializálása
// ##########
//tt();
eventon('load', tt);

})();