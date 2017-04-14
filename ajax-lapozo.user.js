// ==UserScript==
// @name           Ajax Lapozó
// @version        0.5.0 alpha
// @description    Torrentek és hsz.-ek lapozása oldal újratöltés nélkül.
// @namespace      bH
// @author         Vector
// @include        http://bithumen.be/browse.php*
// @include        https://bithumen.be/browse.php*
// @include        http://bithumen.ru/browse.php*
// @include        https://bithumen.ru/browse.php*
// @include        http://bithumen.be/details.php?id=*
// @include        https://bithumen.be/details.php?id=*
// @include        http://bithumen.ru/details.php?id=*
// @include        https://bithumen.ru/details.php?id=*
// @include        http://bithumen.be/forums.php?action=viewtopic&topicid=*
// @include        https://bithumen.be/forums.php?action=viewtopic&topicid=*
// @include        http://bithumen.ru/forums.php?action=viewtopic&topicid=*
// @include        https://bithumen.ru/forums.php?action=viewtopic&topicid=*
// ==/UserScript==
(function() {
var vegtelen_toltes = 300;
var allapotjelzo = true;
var kep_preload = true;

var dbg = false; // DEBUG
// FIXED: fórum lapozó, torrent borító oldal preloader

// TODO:
// első és utolsó, m_ids és lastid sütiket csak akkor kell babrálni ha nincs sort, vagy sort=added DESC (alap) és a browse.php-n vagyunk
// átfedések-et szűrni kell (responsetextben levágható a felesleg link=id alapján)

var max_tipus_id = 42; // ha új torrent kategória jelenik meg növelni kell :)

var pager_top = false;
var last_page = 0;
var this_page = 0;
var element_nr = false;
var loc = document.location.pathname.split('?')[0].substr(1).toLowerCase();
var domain = document.domain;
var tlcs = false;
if(dbg)console.log('dbg: true\n domain = '+domain+';\n loc = '+loc+';\n max_tipus_id = '+max_tipus_id+';');
var c_uj = false;
//var c_utolso = false;
//var id_elso = false;
var id_utolso = false;
var ajax_in_progress = false;
function ajax_lapozo(e)
{
  get_variables();
  
  if(loc == 'browse.php' || loc == 'details.php' || loc == 'forums.php') //if(loc == 'browse.php' || loc == 'details.php' )
  {
    this_page = (isNaN(_get['page'])) ? 0 : _get['page'] * 1;
    
    if(_get['addon'] != 'nextpage')
    {
      if(document.getElementById('pagertop0')) pager_top = document.getElementById('pagertop0').parentNode;
      else if(document.getElementById('pagertop1')) pager_top = document.getElementById('pagertop1').parentNode;
      else
      {
        if(dbg)console.log('dbg: nincs több oldal.');
        return false;
      }
      
      var pages_links = pager_top.getElementsByTagName('a');
      
      element_nr = pager_top.getElementsByTagName('b')[2].innerHTML.split('&nbsp;-&nbsp;')[1];
      if(dbg)console.log('dbg: element_nr = '+element_nr);
            
      var link_vars = get_variables(pages_links[pages_links.length - 1].href);
      if(pages_links.length > 1)
      {
        if(!isNaN(link_vars['page'])) last_page = link_vars['page'];
        else
        {
          if(dbg)console.log('dbg: érvénytelen utolsó oldal.');
          return false;
        }
      }
      else
      {
        if(dbg)console.log('dbg: csak egy oldal van.');
        return false;
      }
      
      if(loc == 'details.php' && isNaN(_get['page'])) 
      {
        /*this_page = -1;
        last_page++;
        
        insert_nextpage(false);*/
        this_page = ++last_page;
      }
      
      if(dbg)console.log('dbg: this_page = '+this_page);
      if(dbg)console.log('dbg: last_page = '+last_page);
      
      if(this_page >= last_page)
      {
        if(dbg)console.log('dbg: ez az utolsó oldal.');
        return false;
      }
      else
      {
        var pager_bottom = (!document.getElementById('pagerbottom0')) ? document.getElementById('pagerbottom1').parentNode : document.getElementById('pagerbottom0').parentNode;
        
        if(dbg)console.log('dbg: pager_bottom = '+pager_bottom);
        
        var d = '';
        //if((loc == 'browse.php' && _get['viewtype'] != 'covers') || !allapotjelzo || !kep_preload) d = 'display: none; ';
        if(!allapotjelzo || !kep_preload) d = 'display: none; '; // 

        pager_bottom.innerHTML = ''
                               + '<p><input id="nextpage" type="button" value="+ '+element_nr+'" style="font: 18px bold Verdana; margin: 0; padding: 0; cursor: pointer; height: 30px; width: 66%;-moz-border-radius-bottomleft:20px;-moz-border-radius-bottomright:20px;-webkit-border-radius-bottomleft:20px;-webkit-border-radius-bottomright:20px;border-radius-bottomleft:20px;border-radius-bottomright:20px;" onmouseover="this.style.color = \'#c00000\';" onmouseout="this.style.color = \'\';" /><div id="pre_szazalek" style="'+d+'color: green; margin:4px 0 0 0;text-align: center;">0%</div></p>';
        
          insert_nextpage(); //preload
          
          if(!vegtelen_toltes) {
            var button = document.getElementById('nextpage');
            eventon('mouseover', function(){if(!ajax_in_progress)insert_nextpage();}, button);
            eventon('click', inject_nextpage, button);
          }
          else {
            document.getElementById('nextpage').style.visibility='hidden';
            var options1 = {
              distance: (isNaN(vegtelen_toltes)) ? 300 : vegtelen_toltes,
              callback: function(done) {
                inject_nextpage(); //append
                if(!ajax_in_progress)
                {
                    insert_nextpage();
                }
                done();
              }
            }
            infiniteScroll(options1);
          }
      }
    }
  }
}

var insert = false;
function insert_nextpage(e)
{
  if(insert === false)
  {
    if(dbg)console.log('dbg: első betöltés. insert = false');
    
    if(loc == 'browse.php' && _get['viewtype'] != 'covers')
    {
      
      var ids = document.getElementById('torrenttable').childNodes[1].childNodes;
      //id_elso = ids[2].childNodes[3].childNodes[0].href.split('?id=')[1];
      
      if(!ids[ids.length-2].childNodes[3].getAttribute('width'))
      {
        id_utolso = ids[ids.length-2].childNodes[3].childNodes[0].href.split('?id=')[1];
      }
      else
      {
        id_utolso = ids[ids.length-2].childNodes[4].childNodes[0].href.split('?id=')[1];
        tlcs = true;
      }
      //if(dbg)console.log('dbg: [init] id_elso = '+id_elso+'; id_utolso = '+id_utolso+';');
      if(dbg)console.log('dbg: [init] id_utolso = '+id_utolso+';');
      
      // uj > lastid
      // m_ids[0] > uj > m_ids[1]
      
      c_uj = unescape(_cookie('m_ids')).split(':');
      if(dbg)console.log('dbg: [init] c_uj.valueOf() = '+c_uj.valueOf());
      //c_utolso = _cookie('lastid');
      //if(dbg)console.log('dbg: [init] c_uj.valueOf() = '+c_uj.valueOf()+'; c_utolso = '+c_utolso+';');
    }
    
    insert = '';
  }
  else if(typeof insert == 'string' && insert != '') return true;
  
  pre_lepteto(false);
  var link = get_variables(pager_top.getElementsByTagName('a')[0].href);
  var adatok = new Array();
  
  if(loc == 'browse.php')
  {
    // kategória
    if(!isNaN(link['cat'])) adatok['cat'] = link['cat'];
    
    // kategóriák
    for(var i = 1; i <= max_tipus_id; i++) if(link['c'+i] == '1') adatok['c'+i] = '1';
    
    // műfaj
    if(!isNaN(link['genre'])) adatok['genre'] = link['genre'];
    
    // keresés
    if(typeof link['search'] != 'undefined') adatok['search'] = link['search'];
    
    // csak a címekben
    if(link['onlytitle'] == 'yes') adatok['onlytitle'] = 'yes';
    
    // töröltben
    if(link['deletedtoo'] == 'yes') adatok['deletedtoo'] = 'yes';
    
    // rendezés / irány
    if(typeof link['sort'] == 'string')
    { // oldal bug: ha csak az egyik van meg, a mentett kategóriák nem érvényesülnek
      adatok['sort'] = link['sort'];
      adatok['d'] = 'DESC';
      if(link['d'] == 'ASC') adatok['d'] = 'ASC';
    }
    
    // letöltés almenük
    if(typeof _get['type'] != 'undefined') adatok['type'] = _get['type'];
    
    // borító listázás
    if(_get['viewtype'] == 'covers') adatok['viewtype'] = 'covers';
  }
  else if(loc == 'details.php')
  {
    if(!isNaN(link['id'])) adatok['id'] = link['id'];
  }
  else if(loc == 'forums.php')
  {
    if(!isNaN(link['topicid'])) adatok['topicid'] = link['topicid'];
    
    if(link['action'] == 'viewtopic') adatok['action'] = 'viewtopic';
  }
  
  // ajax
  adatok['addon'] = 'nextpage';
  
  // oldal
  adatok['page'] = ++this_page;
  
  if(dbg)
  {
    var ap = '';
    var ad = '';
    for(var i in adatok)
    {
      ap += ad + i + '=' + escape(adatok[i]);
      if(ad == '') ad = '&';
    }
    console.log('dbg: adatok = ('+ap+')');
  }
  
  if(this_page <= last_page)
  {
    ajax_in_progress = true;
    ajax_get(adatok, function(){
      if(getreq.readyState == 4)
      {
        ajax_in_progress = false;
        if(getreq.status == 200)
        {
          var t = getreq.responseText;
          
          if(loc == 'browse.php')
          {
            if(_get['viewtype'] == 'covers')
            {
              t = t.split("<table id='covertable' width=100% cellspacing=0 cellpadding=0>")[1].split("</table>")[0];
              insert += t;
              
              var cover_pic = t.split("<img src='");
              
              var images = new Array();
              for(var i = 0; i < cover_pic.length; i++)
              {
                cover_pic[i] = cover_pic[i].split("' width=150")[0];

                if(cover_pic[i].indexOf('http://media.'+domain) == -1 && (cover_pic[i].indexOf('http://') == 0 || cover_pic[i].indexOf('https://') == 0))
                {
                  images[images.length] = cover_pic[i];
                }
              }
              if(dbg)console.log('dbg: images.valueOf() = '+images.valueOf());
              if(kep_preload) img_preload(images);
            }
            else
            {
              t = t.split(' id="torrenttable" >')[1].split("</table>")[0].split('</tr>');
              t.shift();
              t = t.join('</tr>');
              
              var ids = t.split('<td align=left ><a href="details.php?id=');
              if(ids.length > 0)
              {
                //id_elso = ids[1].split('"><b>')[0];
                //if(id_elso.indexOf('" ') != -1) id_elso = id_elso.split('" ')[0];
                id_utolso = ids[ids.length-1].split('"><b>')[0];
                if(id_utolso.indexOf('" ') != -1) id_utolso = id_utolso.split('" ')[0];
                
                set_cookie('m_ids', escape(c_uj.join(':')));
              }
              //if(dbg)console.log('dbg: id_elso = '+id_elso+'; id_utolso = '+id_utolso+';');
              if(dbg)console.log('dbg: id_utolso = '+id_utolso+';');
              
              if(tlcs)
              {
                t = ids.join('<td></td><td align=left ><a href="details.php?id=');
              }
              
              insert += t;
              
              document.getElementById('pre_szazalek').innerHTML = '100%'; // 
            }
          }
          else if(loc == 'details.php')
          {
            t = t.split('</div><table width=100% border=1 cellspacing=0 cellpadding=10><tr><td>\n<div class="comment">')[1].split('</div></td></tr></table>\n</td></tr></table>\n<p align="center">')[0];
            
            insert += '<div class="comment">'+t+'</div>';
            
            var comment_pic = t.split('<img width=150 src=').concat(t.split('<img border=0 src="')).concat(t.split('<img border=0 style=\'max-width:600px\' src="')).concat(t.split('<img border=0 width=600 src="'));
            
            if(dbg)console.log('dbg: comment_pic.length = '+comment_pic.length);
            var images = new Array();
            for(var i = 0; i < comment_pic.length; i++)
            {
              comment_pic[i] = comment_pic[i].split('>')[0];
              if(comment_pic[i].indexOf('http://media.bithumen.') == -1 && (comment_pic[i].indexOf('http://') == 0 || comment_pic[i].indexOf('https://') == 0))
              {
                if(comment_pic[i].indexOf('"') == 0) comment_pic[i] = comment_pic[i].split('"')[1];
                else if(comment_pic[i].indexOf('"') != -1) comment_pic[i] = comment_pic[i].split('"')[0];
                images[images.length] = comment_pic[i];
              }
            }
            if(dbg)console.log('dbg: images.valueOf() = '+images.valueOf());
            if(kep_preload) img_preload(images);
          }
          else if(loc == 'forums.php')
          {
            insert += t.split('</form></td>\n</tr></table></p><center>\n<table class=main width=750 border=0 cellspacing=0 cellpadding=0 align="center" style="margin: 0px auto;"><tr><td class=embedded>\n<table width=100% border=1 cellspacing=0 cellpadding=10><tr><td>')[1].split('</td></tr></table>\n</td></tr></table>\n</div><p align="center">')[0].replace('<a name=last></a>', '');
            
            var forums_pic = t.split('<img width=150 src=').concat(t.split('<img border=0 src="')).concat(t.split('<img border=0 style=\'max-width:600px\' src="')).concat(t.split('<img border=0 width=600 src="'));
            
            if(dbg)console.log('dbg: forums_pic.length = '+forums_pic.length);
            var images = new Array();
            for(var i = 0; i < forums_pic.length; i++)
            {
              forums_pic[i] = forums_pic[i].split('>')[0];
              if(forums_pic[i].indexOf('http://media.bithumen.') == -1 && (forums_pic[i].indexOf('http://') == 0 || forums_pic[i].indexOf('https://') == 0))
              {
                if(forums_pic[i].indexOf('"') == 0) forums_pic[i] = forums_pic[i].split('"')[1];
                else if(forums_pic[i].indexOf('"') != -1) forums_pic[i] = forums_pic[i].split('"')[0];
                images[images.length] = forums_pic[i];
              }
            }
            if(dbg)console.log('dbg: images.valueOf() = '+images.valueOf());
            if(kep_preload) img_preload(images);
            
            if(dbg)console.log('dbg: (forums.php) insert.length = '+insert.length);
          }
        }
      }
    }, loc+'?');
    
  }
}

var acsl = false;
function inject_nextpage(e)
{
  if(typeof insert == 'string' && insert != '')
  {
    // frissítés után a böngésző megjegyzi a pozíciót;
    // ez viszont megakadályozza, hogy ilyenkor a görgetősáv legalul maradjon
    if(document.body.scrollTop >= (document.body.scrollHeight - document.body.clientHeight)) document.body.scrollTop--;
    
    if(loc == 'browse.php')
    {
      if(_get['viewtype'] == 'covers')
      {
        document.getElementById('covertable').getElementsByTagName('tr')[0].parentNode.innerHTML += insert;
        //document.getElementById('covertable').innerHTML += insert;
        pre_lepteto(false);
      }
      else
      {
        //document.getElementById('torrenttable').getElementsByTagName('tr')[0].parentNode.innerHTML += insert;
        //document.getElementById('torrenttable').innerHTML += insert;
        
        var tt = document.getElementById('torrenttable').getElementsByTagName('tr')[0].parentNode;
        var tr = document.createElement('TR');
        
        var sorok = insert.split('</tr>');
        
        if(acsl == false && _cookie('acs_lista') != null && typeof _get['search'] == 'undefined') // anticsillagozó
        {
          acsl = _cookie('acs_lista').split(',');
        }
        
        for(var n = 0; n < sorok.length; n++)
        {
          if(sorok[n].indexOf('<tr>') != -1)
          {
            tr.style.display = '';
            if(acsl != false) // anticsillagozó
            {
              var imdb = sorok[n].split('http://www.imdb.com/title/tt');
              if(imdb.length > 1)
              {
                imdb = imdb[1].split('/')[0];
                if(acsl.indexOf(imdb) != -1) tr.style.display = 'none';
              }
            }
            
            tr.innerHTML = sorok[n].split('<tr>')[1];
            tt.appendChild(tr.cloneNode(true));
          }
        }
        
        if(id_utolso < c_uj[0]) c_uj[0] = id_utolso;
        if(id_utolso < c_uj[1]) c_uj[1] = id_utolso;
        set_cookie('m_ids', escape(c_uj.join(':')));
        
        pre_lepteto(false); // 
      }
    }
    else if(loc == 'details.php')
    {
      document.getElementById('comments').getElementsByTagName('td')[1].innerHTML += insert;
      
    }
    else if(loc == 'forums.php')
    {
      document.getElementById('szethuzo').parentNode.lastChild.getElementsByTagName('td')[1].innerHTML += insert;
      pre_lepteto(false);
    }
    
    insert = '';
    
    if(this_page >= last_page) document.getElementById('nextpage').style.visibility = 'hidden';
    //todo: document.body.scrollTop++ ha volt -1
  }
  else if(dbg)console.log('dbg: insert = "" vagy insert = '+insert);
}

// ajax get
var getreq = false;
function ajax_get(data, func, file)
{
   if(!file) var file = "ajax.php?";
   getreq = false;
   if (window.XMLHttpRequest)
   {//Mozilla, Safari
      getreq = new XMLHttpRequest();
      if (getreq.overrideMimeType) getreq.overrideMimeType("text/html");
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
   if (!getreq) return false;
   //if (dbg && !getreq) alert('An error occurred during the XMLHttpRequest!');

   var parameters = '';
   var amp = '';
   for(var i in data)
   {
     parameters += amp + i + '=' + escape(encodeURI( data[i] ));
     if(amp == '') amp = '&';
   }
   
   getreq.onreadystatechange = func;
   getreq.open("GET", file + parameters, true);
   getreq.send();

   return true;
}

var _get = false;
function get_variables(link)
{
  var search = link;
  var a = new Array();
  
  if(!link) search = document.location.search;
  
  if(search.split('?').length > 1) search = search.split('?')[1];
  search = search.split('&');
  for(var i in search)
  {
    var j = search[i].split('=');
    a[j.shift()] = j.join('=');
  }
  
  if(!link) _get = a;
  return a;
}

// preloaders
var loading = false;
function img_preload(preImg)
{
  if(typeof preImg != 'object') return false;
  loading = true;
  
  var objImg = new Array();
  for(var i = 0; i < preImg.length; i++)
  {
    objImg[i] = new Image();
    objImg[i].src = preImg[i];
    // lepteto
    eventon('load',function(){pre_lepteto(preImg.length);}, objImg[i]);
		eventon('error',function(){pre_lepteto(preImg.length);}, objImg[i]);
  }
  if(dbg)console.log('dbg: '+i+'db kép betöltve.');
}

function pre_lepteto(length) {
  if(!length)
  {
    document.getElementById('pre_szazalek').innerHTML = '0%';
    loading = false;
    return true;
  }
  else if(loading == false) return false;
  
  var step = 100 / length;
  var leftover = 100 % length;
  
  var pre_szazalek = document.getElementById('pre_szazalek').innerHTML.split('%')[0] * 1;
  if(!isNaN(pre_szazalek))
  {
    var uj_szazalek;
    if(pre_szazalek + step >= 100 - leftover) uj_szazalek = '100';
	  else uj_szazalek = pre_szazalek + step;
	  
	  document.getElementById('pre_szazalek').innerHTML = Math.floor(uj_szazalek) + '%';
	}
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

//ajax_lapozo();
eventon('load', ajax_lapozo);

//})();

/**
 * Implement infinite scrolling
 * - Inspired by: http://ravikiranj.net/drupal/201106/code/javascript/how-implement-infinite-scrolling-using-native-javascript-and-yui3
 */
//(function() {
  var isIE = /msie/gi.test(navigator.userAgent); // http://pipwerks.com/2011/05/18/sniffing-internet-explorer-via-javascript/
  
  this.infiniteScroll = function(options) {
    var defaults = {
      callback: function() {},
      distance: 50
    }
    // Populate defaults
    for (var key in defaults) {
      if(typeof options[key] == 'undefined') options[key] = defaults[key];
    }  
    
    var scroller = {
      options: options,
      updateInitiated: false
    }
    
    window.onscroll = function(event) {
      handleScroll(scroller, event);
    }
    // For touch devices, try to detect scrolling by touching
    document.ontouchmove = function(event) {
      handleScroll(scroller, event);
    }
  }
  
  function getScrollPos() {
    // Handle scroll position in case of IE differently
    if (isIE) {
      return document.body.scrollTop;
    } else {
      return window.pageYOffset;
    }
  }
  
  var prevScrollPos = getScrollPos();
  
  // Respond to scroll events
  function handleScroll(scroller, event) {
    if (scroller.updateInitiated) {
      return;
    }   
    var scrollPos = getScrollPos();
    if (scrollPos == prevScrollPos) {
      return; // nothing to do
    }
    
    // Find the pageHeight and clientHeight(the no. of pixels to scroll to make the scrollbar reach max pos)
    var pageHeight = document.body.scrollHeight;
    var clientHeight = document.body.clientHeight;
    //console.log('scrollTop: '+scrollPos);
    //console.log('scrollHeight: '+pageHeight);
    //console.log('clientHeight: '+clientHeight);
    
    // Check if scroll bar position is just 50px above the max, if yes, initiate an update
    //console.log('pageHeight - (scrollPos + clientHeight): '+(pageHeight - (scrollPos + clientHeight))+' < scroller.options.distance: '+scroller.options.distance+' == '+(pageHeight - (scrollPos + clientHeight) < scroller.options.distance));
    if (pageHeight - (scrollPos + clientHeight) < scroller.options.distance) {
      if(dbg) console.log('dbg: infinity kickoff!');
      scroller.updateInitiated = true;
  
      scroller.options.callback(function() {
        scroller.updateInitiated = false;
      });
    }
    
    prevScrollPos = scrollPos;  
  }
})();