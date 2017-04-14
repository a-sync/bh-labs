// ==UserScript==
// @name        Torrent Lista Csillagozó
// @namespace   bH
// @version     0.2.1
// @author      Vector
// @include     http://bithumen.be/browse.php*
// @include     https://bithumen.be/browse.php*
// @include     http://bithumen.ru/browse.php*
// @include     https://bithumen.ru/browse.php*
// @include     http://bithumen.be/bookmarks.php
// @include     https://bithumen.be/bookmarks.php
// @include     http://bithumen.ru/bookmarks.php
// @include     https://bithumen.ru/bookmarks.php
// @include     http://bithumen.be/details.php?id=*
// @include     https://bithumen.be/details.php?id=*
// @include     http://bithumen.ru/details.php?id=*
// @include     https://bithumen.ru/details.php?id=*
// ==/UserScript==

(function() {
var dbg = false; // DEBUG
var varjvalaszt = true; // megvárja-e az ikoncserével az ajax választ
var tt = false;
var csillagok = [];
var bm = (document.location.pathname.split('?')[0] == '/bookmarks.php') ? true : false;
var details = (document.location.pathname.split('?')[0] == '/details.php') ? true : false;

function tlcs(e)
{
  if(dbg)console.log('TLCs init...');
  
  if(!_cookie('tlcs')) set_cookie('tlcs', '');
  
  if(details)
  {
    var cs = document.getElementById('comments').parentNode.getElementsByTagName('h1')[0].firstChild;
    cs.firstChild.setAttribute('onclick', '');
    cs.firstChild.setAttribute('href', 'javascript:;');
    
    csillagok = _cookie('tlcs').split(',');
    if(dbg)console.log(csillagok.length + 'db elmentve.');
    
    eventon('click', tlcs_klikk, cs.firstChild);
  }
  else
  {
    
    tt = document.getElementById('torrenttable').getElementsByTagName('tr');
    if(!tt&&dbg)console.log('Nincs #torrenttable!');
    else
    {
      if(bm)
      {
        var i = document.createElement('center');
        i.className = 'sublink';
        i.style.visibility = 'hidden';
        i.setAttribute('id', 'tlcs_info');
        document.getElementById('torrenttable').parentNode.appendChild(i);
        
        csillagok = [];
        if(dbg)console.log('Csillagozottak szinkronizálása...');
      }
      else
      {
        var c = document.createElement('TD');
        c.setAttribute('align', 'center');
        c.setAttribute('width', '20');
        c.style.borderRight = '0px';
        c.style.padding = '2px';
        c.style.paddingLeft = '4px';
        
        var cd = document.createElement('DIV');
        cd.style.display = 'inline';
        
        var cl = document.createElement('A');
        cl.setAttribute('href', 'javascript:;');
        cl.className = 'noborder';
        cl.style.padding = '2px';
        
        var ck = document.createElement('IMG');
        ck.setAttribute('title', 'Torrent elmentése csillagozott torrentek közé');
        ck.setAttribute('src', 'media/img/null.png');//obj. értékként
        ck.className = 'spr_i Sicon_bookmark_disable';
        ck.setAttribute('width', '16');
        ck.setAttribute('height', '16');
        
        cl.appendChild(ck);
        cd.appendChild(cl);
        c.appendChild(cd);
        //ck, cl, cd = null;
        
        csillagok = _cookie('tlcs').split(',');
        if(dbg)console.log(csillagok.length + 'db elmentve.');
      }
      
      if(dbg)console.log(tt.length + ' sor.');
      for(var i = 0; i < tt.length; i++)
      {
        if(i != 0)
        {
          if(bm) var cella = tt[i].getElementsByTagName('td')[1];
          else var cella = tt[i].insertBefore(c.cloneNode(true), tt[i].getElementsByTagName('td')[1]);
          
          //var tid = cella.nextSibling.getElementsByTagName('a')[0].getAttribute('href').split('details.php?id=')[1].split('&')[0];
          var tid = cella.nextSibling.firstChild.getAttribute('href').split('details.php?id=')[1].split('&')[0];
          
          if(!isNaN(tid))
          {
            if(bm)
            {
              csillagok.push(tid);
              cella.firstChild.firstChild.setAttribute('onclick', '');
              cella.firstChild.firstChild.setAttribute('href', 'javascript:;');
            }
            else
            {
              if(csillagok.indexOf(tid) != -1)
              {
                cella.firstChild.firstChild.firstChild.className = 'spr_i Sicon_bookmark';
                cella.firstChild.firstChild.firstChild.setAttribute('title', 'Torrent törlése csillagozott torrentekből');
              }
            }
            
            cella.firstChild.setAttribute('id', 'bookmark_' + tid);
                                
            eventon('click', tlcs_klikk, cella.firstChild.firstChild);
            
          }
        }
        else // i == 0 // fejléc
        {
          tt[i].getElementsByTagName('td')[1].setAttribute('colspan', '2');
          tt[i].getElementsByTagName('td')[1].setAttribute('style', 'padding-left: 30px !important;');
          //tt[i].getElementsByTagName('td')[1].style.paddingLeft = '30px';
        }
      }//for
      
      if(bm)
      {
        set_cookie('tlcs', csillagok.join(','));
        
        document.getElementById('tlcs_info').innerHTML = '[Csillagozott torrentek szinkronizálva! <b>' + csillagok.length + 'db</b>]';
        document.getElementById('tlcs_info').style.visibility = 'visible';
      }
    }
  }
}

function tlcs_klikk() {
  var vars = [];
  vars['torrentid'] = this.parentNode.getAttribute('id').split('bookmark_')[1];
  
  var csi = csillagok.indexOf(vars['torrentid']);
  
  if(csi == -1)
  {
    vars['type'] = 'add';
    if(!varjvalaszt)
    {
      csillagok.push(vars['torrentid']);
      set_cookie('tlcs', csillagok.join(','));
    }
  }
  else
  {
    vars['type'] = 'remove';
    if(!varjvalaszt)
    {
      csillagok.splice(csi, 1);
      set_cookie('tlcs', csillagok.join(','));
    }
  }
  
  if(dbg)console.log('torrentid = ' + vars['torrentid']);
  
  ajax_post(vars, function() {
    if (_postreq.readyState == 4 && _postreq.status == 200)
    {
      var id = 0;
      if(_postreq.responseText.indexOf('("remove", ') != -1)
      {
        id = _postreq.responseText.split('("remove", ')[1].split(');')[0];
        document.getElementById('bookmark_' + id).firstChild.firstChild.className = 'spr_i Sicon_bookmark';
        document.getElementById('bookmark_' + id).firstChild.firstChild.setAttribute('title', 'Torrent törlése csillagozott torrentekből');
        if(varjvalaszt)
        {
          csillagok.push(id);
          set_cookie('tlcs', csillagok.join(','));
        }
      }
      else
      {
        id = _postreq.responseText.split('("add", ')[1].split(');')[0];
        document.getElementById('bookmark_' + id).firstChild.firstChild.className = 'spr_i Sicon_bookmark_disable';
        document.getElementById('bookmark_' + id).firstChild.firstChild.setAttribute('title', 'Torrent elmentése csillagozott torrentek közé');
        if(varjvalaszt)
        {
          var csi = csillagok.indexOf(id);
          if(csi != -1)
          {
            csillagok.splice(csi, 1);
            set_cookie('tlcs', csillagok.join(','));
          }
        }
      }
    }
  }, 'takebookmark.php');
}

// ajax poster
var _postreq = false;
function ajax_post(data, func, file)
{
   if(!file) var file = "ajax.php";
   _postreq = false;
   if (window.XMLHttpRequest)
   {//Mozilla, Safari
      _postreq = new XMLHttpRequest();
      if (_postreq.overrideMimeType) _postreq.overrideMimeType("text/html");
   }
   else if (window.ActiveXObject)
   {//IE
      try { _postreq = new ActiveXObject("Msxml2.XMLHTTP"); }
      catch (e)
      {
        try { _postreq = new ActiveXObject("Microsoft.XMLHTTP"); }
        catch (e) {}
      }
   }
   if (!_postreq) return false;
   //if (!_postreq) alert('An error occurred during the XMLHttpRequest!');

   var parameters = '';
   var amp = '';
   for(var i in data)
   {
     parameters += amp + i + '=' + escape(data[i]); // escape(encodeURI( ))
     if(amp == '') amp = '&';
   }

   _postreq.onreadystatechange = func;
   _postreq.open("POST", file, true);
   _postreq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
   _postreq.setRequestHeader("Content-length", parameters.length);
   _postreq.setRequestHeader("Connection", "close");
   _postreq.send(parameters);

   return true;
}

function _cookie(name)
{
  var cookie_place = document.cookie.indexOf(name + '=');
  
  if(cookie_place != -1) return document.cookie.substr(cookie_place + name.length + 1).split('; ')[0];
  else return;
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
tlcs();
//eventon('load', tlcs);

})();
