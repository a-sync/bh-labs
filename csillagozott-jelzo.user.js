// ==UserScript==
// @name           Csillagozott jelző
// @version        9.1.3
// @author         Vector
// @namespace      bH
// @include        http://bithumen.be/*
// @include        https://bithumen.be/*
// @include        http://bithumen.ru/*
// @include        https://bithumen.ru/*
// ==/UserScript==
(function() {
// ##########
// Beállítások
// ##########
var csj_ikon        = true; // ikon (és panel) megjelenítése
var csj_panel_all   = false; // mutassa alapból az összes témát
var open_unread     = false; // ha van olvasatlan téma, a panel legyen nyitva
var ikon_alap       = '/media/img/medals/medal_silver_2.png';
var ikon_olvasatlan = '/media/img/medals/medal_bronze_3.png'; // van olvasatlan téma
var ikon_uj         = '/media/img/medals/award_star_gold_1.png'; // új hsz olvasatlan témában (ikon-on szimpla kattintással resetelhető)

var csj_link        = 0; // csillagozott témákhoz link megjelenítése; 0 - sehol, 1 - státusz sávon, 2 - fórum link mellett, 3 - mindkettő
var cim_max_meret   = 0; // ilyen hosszan vágja le a címeket a súgó buborékokban (title= attribútum) (0 értékkel nem vág)
var status_cleanup  = true; // státusz sáv kompakt mód

var csj_checker     = 150; // ennyi másodpercenként ellenőrizzen (minimum 60)
var forumid = 999; // megfigyelt fórum szekció (999 a Cillagozot témák)
// ##########

var dbg = false; // DEBUG

// ##########
var inner_bak0 = false;
var inner_bak1 = false;
var inner_bak2 = false;
var csj_panel = false;
var csj_timer = false;
var css = false;
var loc = document.location.pathname + document.location.search;
var temak = false;
var status_cleaned = false;
//var loc_file = document.location.pathname.split('?')[0];
function csj()
{
  if(document.title.indexOf('400 Request Header Or Cookie Too Large') == 0)
  {
    if(dbg)console.log('dbg: Error 400');
    var ediv = document.createElement('DIV');
    
    ediv.innerHTML += 
        '<h2>Túl sok adatot próbáltál elküldeni a szervernek, valószínűleg túl sok Csillagozott témád van.</h2>'
       +'<div style="width:70%;padding:9px;text-align:left;background-color:lightgray;border-radius:7px;line-height:30px;"><b>Javítás:</b><br/>'
       +'<b>1.</b> kapcsold ki a Csillagozott jelző scriptet<br/>'
       +'<b>2.</b> töröld a <b>csj_temak</b> sütit <input type="button" value="csj_temak Süti törlése!" onclick="javascript:'
       +'document.cookie=\'csj_temak={}; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/\';this.value=\'csj_temak Süti törölve!\';this.disabled=true;"/><br/>'
       +'<b>3.</b> vegyél ki párat a csillagozott témáidból, majd kapcsold vissza a Csillagozott jelzőt</div>';
    
    document.body.getElementsByTagName('center')[0].appendChild(ediv);
  }
  else if(loc.indexOf('/forums.php?action=viewforum&forumid='+forumid+'&alt=json') != 0)
  {
    var status = document.getElementById('status');
    if(status && status_cleanup && !status_cleaned)// !css
    {
      if(dbg)console.log('dbg: status_cleanup');
      var uid = document.getElementById('status').getElementsByTagName('a')[0].href.split('userdetails.php?id=')[1].split('&')[0];
      
      var status_clone = status.cloneNode(true);
      var al_status = status_clone.getElementsByTagName('font');
      var b = 4;

      for(var i = al_status.length - 1; i >=  0; i--)
      {
        if(al_status[i].innerHTML == 'Szabad slotok:')
        {
          if(al_status[i+1].innerHTML.indexOf('(max.: ') != -1) al_status[i+1].innerHTML = al_status[i+1].innerHTML.split(' ')[0] + '/' + al_status[i+1].innerHTML.split('(max.: ')[1].split(')')[0];
           
          al_status[i].innerHTML = '<img class="spr_i" style="background-position: -33px -10px;" width="5" height="12" src="/media/img/null.png"/><img class="spr_i" style="background-position: -16px -10px;" width="5" height="12" src="/media/img/null.png"/>';
         
          al_status[i+1].style.fontSize = '0.92em';
          
          al_status[i].setAttribute('title', 'Szabad slotok');
          al_status[i+1].setAttribute('title', 'Szabad slotok');
          b--;
        }
        
        if(al_status[i].innerHTML.indexOf('Letöltött:') == 0)
        {
          al_status[i].innerHTML = 'Le:';
          al_status[i].setAttribute('title', 'Letöltött');
          b--;
        }
        
        if(al_status[i].innerHTML.indexOf('Feltöltött:') == 0)
        {
          al_status[i].innerHTML = 'Fel:';
          al_status[i].setAttribute('title', 'Feltöltött');
          b--;
        }
        
        if(al_status[i].innerHTML.indexOf('Aktív torrentek:') == 0)
        {
          al_status[i].innerHTML = 'Aktív:';
          
          if(!isNaN(al_status[i+1].innerHTML) && al_status[i+1].innerHTML > 0) al_status[i+1].innerHTML = '<a href="/userdetails.php?id='+uid+'#seeded_list">'+al_status[i+1].innerHTML+'</a>';
          if(!isNaN(al_status[i+2].innerHTML) && al_status[i+2].innerHTML > 0) al_status[i+2].innerHTML = '<a href="/userdetails.php?id='+uid+'#leeched_list">'+al_status[i+2].innerHTML+'</a>';
          
          al_status[i+1].setAttribute('title', 'Seedelés');
          al_status[i+2].setAttribute('title', 'Leechelés');
          b--;
        }
        
        if(dbg)console.log('dbg: al_status['+i+'].innerHTML = '+al_status[i].innerHTML);
        if(b <= 0) break;//
        
      }
      //status_clone.style.fontSize = '0.9em';
      var nobr0 = status_clone.getElementsByTagName('nobr')[0];
      nobr0.innerHTML = '&nbsp;'+nobr0.innerHTML.substr(9);
      
      status.parentNode.replaceChild(status_clone, status);
      status_cleaned = true;
    }

    if(!css)
    {
      if(dbg)console.log('dbg: '+navigator.userAgent+'\n');
      get_variables();
      
      csj_panel = false;
      
      css = '#csj_link1 { text-decoration: none; font-family: Verdana, sans-serif; margin: 5px 0px 5px 0px !important; }'
              + '#csj_link0 { text-decoration: none; } #csj_link0 font { font-family: Verdana, sans-serif; }'
              + '#csj_ikon { font-size: 10px; text-decoration: none; text-align: center; padding: 7px 0 0 14px; background-position: center center; background-repeat: no-repeat; cursor: pointer; background-image: url("'+ikon_alap+'"); }'
              + '#csj_panel { margin-top: 3px; position: absolute; right: 10px; z-index: 555; -webkit-border-radius:0 0 5px 5px;border-radius:0 0 5px 5px;-moz-border-radius: 0 0 5px 5px; } #csj_panel tr td { padding: 0px 5px 0px 5px; }'
              + ' #csj_panel tr td table { width: 100%; -webkit-border-radius:0px;border-radius:0px;-moz-border-radius:0px; margin: 5px 0px 0px 0px; } #csj_panel tr td table tr td { padding: 0; }'
              + '.csj_i { font-size: 10px; } .csj_i a:hover { border: 0; } .csj_i a:link, .csj_i a:visited { border: 0; text-decoration: none; padding: 5px; display: block; height: 16px; } .csj_i a img { width: 16px; height: 16px; border: 0; }'
              + '.csj_i a img.csj_clock { margin-left: 10px; } '
              + '#csj_ot { width: 13px; height: 13px; border: 0; margin: 0px 0 1px 0; } #csj_bottom:hover #csj_ot { margin: 1px 0 0px 0; } #csj_bottom { cursor: pointer;  }';
              
      //if(false) css += 'table#torrenttable tr td:last-child { display: none; }';
        
      ////
        var head = document.getElementsByTagName('head')[0];
        if (!head) { if(dbg)console.log('dbg: head = '+head); }
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
      ////
    }
    
    var data = [];
    data['action'] = 'viewforum';
    data['forumid'] = forumid;
    data['alt'] = 'json';
    if(isNaN(_cookie('csj_panel'))) set_cookie('csj_panel', 0);
    
    ajax_get(data, function ()
      {
        if (getreq.readyState == 4)
        {
          if (getreq.status == 200)
          {
            var topics = eval('(' + getreq.responseText + ')').results;
            var titles = '';
            var new_num = 0;
            var csj_last_post = false;
            
            if(csj_ikon !== false && csj_panel === false)
            {
              csj_panel = document.createElement('TABLE');
              csj_panel.setAttribute('id', 'csj_panel');
              csj_panel.setAttribute('cellpadding', '0');
              csj_panel.setAttribute('cellspacing', '0');
              if(_cookie('csj_panel') == 0) csj_panel.style.display = 'none';
              
              document.body.insertBefore(csj_panel, document.body.getElementsByTagName('p')[0]);
              if(dbg)console.log('dbg: csj_panel = '+csj_panel);
            }
            
            var new_topics = [];
            var other_topics = [];
            
            if(!temak)
            {
              if(!_cookie('csj_temak'))
              {
                //set_cookie('csj_temak', '{}');
                temak = new Object();
              }
              else temak = (new Function('return {'+_cookie('csj_temak')+'}'))();
              //hibás JSON esetén törölni kell a sütit
            }
            var temak_JSON = '';
            
            if(dbg)console.log('dbg: temak = ');
            if(dbg)console.log(temak);
        
            for(var i in topics)
            {
              var tema = false;
              
              var uj_megt = 0;
              var uj_hsz = 0;
              
              if(isNaN(topics[i].lastpostread)) topics[i].lastpostread = 0;
              
              var pic = '';
              if(topics[i].locked == 'no')
              {
                if(document.getElementsByTagName('link')[0].href.indexOf('nightsurfer.css') != -1) pic += 'ns_un';
                else pic += 'un';
              }
              pic += 'locked';
              if(topics[i].lastpostread < topics[i].lastpost) pic += 'new';
              
              if(dbg)console.log('dbg:\ntopics[i].subject = '+topics[i].subject+';\ntopics[i].id = '+topics[i].id);
              var img_t = '';
              
              if(!temak.hasOwnProperty('t'+topics[i].id))//ha nincs benne ez a téma
              {
                tema = new Object();
                tema.v = topics[i].views;
                tema.p = topics[i].post_num-1;
                tema.l = topics[i].lastpostread;
                
                temak['t'+topics[i].id] = tema;
                if(dbg)console.log('dbg: tema -> topics['+i+']');
              }
              else
              {
                tema = temak['t'+topics[i].id];
                if(dbg)console.log('dbg: tema -> temak.t'+topics[i].id);
              }

              uj_megt = topics[i].views - tema.v;

              if(topics[i].lastpostread < topics[i].lastpost) // van olvasatlan hsz. a témában
              {
                uj_hsz = topics[i].post_num - tema.p;
                
                if(dbg)console.log('dbg: uj_hsz = '+uj_hsz);
                if(dbg)console.log('dbg: uj_megt = '+uj_megt);
                
                var s = topics[i].subject;
                s = s.replace('__elutasitva__', '[Elutasítva]')
                     .replace('__megfontol__', '[Megfontolás alatt]')
                     .replace('__tervezett__', '[Tervezett]')
                     .replace('__elkezdve__', '[Elkezdve]')
                     .replace('__kesz__', '[Kész]');
                
                if(titles != '') titles += ', ';
                if(cim_max_meret > 0 && s.length > cim_max_meret) s = s.substr(0, cim_max_meret).trim() + '...';
                titles += s;
                
                if(csj_last_post === false || (typeof csj_last_post == 'integer' && csj_last_post < topics[i].post_added_unixtime))
                {// ha nincs meg az utolsó téma hsz. idő VAGY megvan ÉS korábbi mint a valós utolsó hsz. ideje
                  csj_last_post = topics[i].post_added_unixtime; // újabb utolsó hsz időpont felvétele
                }
                
                img_t = uj_hsz+' új hsz. / +'+uj_megt+' új megtekintés';
              }
              if(img_t == '') img_t = '+'+uj_megt+' új megtekintés';
              
              var flag_css = 'color: white; padding: 0px 1px; font-weight: bold;background-color: ';
              var cim = topics[i].subject.replace('__elutasitva__', '<span style="'+flag_css+'#EE6666">Elutasítva</span>')
                                         .replace('__megfontol__', '<span style="'+flag_css+'gray">Megfontolás alatt</span>')
                                         .replace('__tervezett__', '<span style="'+flag_css+'#F0BA00">Tervezett</span>')
                                         .replace('__elkezdve__', '<span style="'+flag_css+'#6FBC00">Elkezdve</span>')
                                         .replace('__kesz__', '<span style="'+flag_css+'#7D7EDF">Kész</span>');
              
              var t = '<tr><td><table class="main" cellpadding="0" cellspacing="0">'
              + '<tr><td class="csj_i">'
                + '<a href="/forums.php?action=jumpnew&topicid='+ topics[i].id +'">'
                  + '<img src="media/img/'+pic+'.gif" align="left" title="'+img_t+'" />&nbsp;'
                  + cim
                  + '<img align="right" class="spr_b sicon_clock csj_clock" src="media/img/null.png" title="'+ topics[i].post_username +' @ '+ topics[i].post_added +'"/></a>'
              + '</td></tr>'
              + '</table></td></tr>';
          
              if(topics[i].lastpostread < topics[i].lastpost) // van olvasatlan hsz. a témában
              {
                new_topics[new_topics.length] = t;
                new_num++;
              }
              else // nincs olvasatlan hsz
              {
                if(topics[i].views > tema.v && topics[i].lastpostread > tema.l) // megtekintés nagyobb mint a mentett ÉS az utolsó olvasott későbbi mint a mentett
                {
                  // elolvastuk a témát (az új hsz-t); nullázzuk a megtekintéseket és frissítsük a legutóbb elolvasott hsz.-t
                  tema.v = topics[i].views;
                  tema.l = topics[i].lastpostread;
                }
                if(topics[i].post_num > tema.p) // több a hsz. mint a mentett szám
                {
                  tema.p = topics[i].post_num;
                }
                
                other_topics[other_topics.length] = t;
              }
              
              if(temak_JSON != '') temak_JSON += ',';
              temak_JSON += '"t'+topics[i].id+'":{"v":'+tema.v+',"p":'+tema.p+',"l":'+tema.l+'}';
            }
            
            set_cookie('csj_temak', temak_JSON);
            
            if(isNaN(_cookie('csj_last_post'))) set_cookie('csj_last_post', 0);
            if(dbg)console.log('dbg: csj_last_post = '+csj_last_post+'; \n     _cookie(csj_last_post) = '+_cookie('csj_last_post'));
            
            if(!csj_panel_all && new_num > 0 && other_topics.length > 0 && csj_panel)
            {
              csj_panel.innerHTML = new_topics.join('')+'<tr><td align="center" id="csj_bottom"><img src="/media/img/null.png" id="csj_ot" title="Olvasottak" class="spr_b Sdropdown" /></td></tr>';
              
              var csj_ot = document.getElementById('csj_ot');
              eventon('click', function()
                {
                  csj_panel_all = true;
                  csj_ot.style.display = 'none';
                  csj_panel.innerHTML += other_topics.join('')+'<tr><td height="5"> </td></tr>';
                }
                , document.getElementById('csj_bottom'));
            }
            else if(csj_panel) csj_panel.innerHTML = new_topics.join('')+other_topics.join('')+'<tr><td height="5"> </td></tr>';
            
            if(dbg)console.log('dbg: titles = '+titles);
            if(dbg)console.log('dbg: new_num = '+new_num);
            
            var menus = false;
            if(csj_link == 2 || csj_link == 3)
            {
              menus = document.getElementById('menu').getElementsByTagName('td');
              if(dbg)console.log('dbg: menus = '+menus);
              for(var j = menus.length-1; j >= 0; j--)
              {
                if(menus[j].innerHTML.indexOf('/forums.php') != -1)
                {
                  var menus_forum = menus[j];
                  break;
                }
              }
              
              if(inner_bak1 === false) inner_bak1 = menus_forum.innerHTML;
              if(menus_forum !== false) menus_forum.innerHTML = inner_bak1 + '&nbsp;<a title="'+titles+'" id="csj_link1" href="/forums.php?action=viewforum&forumid='+forumid+'" style="">(' + new_num + ')</a>';
            }
            
            if(csj_link == 1 || csj_link == 3)
            {
              menus = document.getElementById('status').getElementsByTagName('nobr')[0];
              
              if(inner_bak0 === false) inner_bak0 = menus.innerHTML;
              menus.innerHTML = inner_bak0 + '&nbsp; <font id="csj_link0" color="#1900D1" style="cursor: pointer">Csillagozottak: <a title="'+titles+'" href="javascript:;" style="text-decoration: none;"><font style=""><b>' + new_num +'</b></font></a></font>';
              eventon('click', function(){document.location = '/forums.php?action=viewforum&forumid='+forumid;}, document.getElementById('csj_link0'));
            }
            
            // ikon beszúrása
            if(csj_ikon !== false)
            {
              if(csj_ikon === true)
              {
                var menu_icons = document.getElementById('status').getElementsByTagName('nobr');
                menu_icons = menu_icons[menu_icons.length-1];
                
                if(dbg)console.log('dbg: menu_icons = '+menu_icons);
                
                if(inner_bak2 === false) inner_bak2 = menu_icons.innerHTML;
                
                csj_ikon = document.createElement('A');
                csj_ikon.setAttribute('id', 'csj_ikon');
                csj_ikon.setAttribute('title', titles);
                csj_ikon.setAttribute('href', 'javascript:;');
                
                eventon('dblclick', function()
                {
                  document.location = '/forums.php?action=viewforum&forumid='+forumid;
                  return;
                }, csj_ikon);
                
                csj_ikon.lp = csj_last_post;
                eventon('click', function()
                {
                  if(!isNaN(this.lp) && _cookie('csj_last_post') != this.lp)
                  {
                    set_cookie('csj_last_post', this.lp);
                    if(dbg)console.log('dbg: set_cookie(csj_last_post, '+this.lp+')');
                  }
                  
                  if(new_num == 0) csj_ikon.style.backgroundImage = 'url("'+ikon_alap+'")';
                  else csj_ikon.style.backgroundImage = 'url("'+ikon_olvasatlan+'")';
                  
                  if(csj_panel.style.display == 'none')
                  {
                    csj_panel.style.display = 'table';
                    set_cookie('csj_panel', 1);
                  }
                  else
                  {
                    csj_panel.style.display = 'none';
                    set_cookie('csj_panel', 0);
                  }
                  
                  return false;
                }, csj_ikon);
                
                csj_ikon = menu_icons.insertBefore(csj_ikon,menu_icons.firstChild);
              }
              csj_ikon.lp = csj_last_post;
              
              csj_ikon.innerHTML = (new_num > 0) ? new_num : ' ';
              if(dbg)console.log('dbg: csj_ikon.innerHTML = '+csj_ikon.innerHTML);
              
              if(new_num == 0) csj_ikon.style.backgroundImage = 'url("'+ikon_alap+'")';
              else if(csj_last_post !== false && _cookie('csj_last_post') < csj_last_post) csj_ikon.style.backgroundImage = 'url("'+ikon_uj+'")';
              else csj_ikon.style.backgroundImage = 'url("'+ikon_olvasatlan+'")';
              
              if(new_num != 0 && open_unread)
              {
                csj_panel.style.display = 'table';
                //set_cookie('csj_panel', 1);
              }
            }
            
            if(!csj_timer) csj_timer = setInterval(csj,((csj_checker>=(10*(249%2+1)*3))?csj_checker:99)*1000);//4n71n006
          }
        }
      },'forums.php?');
  }
}


// html special characters encoding
String.prototype.henc = function()
{
  return this.split('"').join('&quot;')
           .split("'").join('&#039;')
           .split('<').join('&lt;')
           .split('>').join('&gt;');
};

// trim
String.prototype.trim = function()
{
  //return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  var str = this.replace(/^\s\s*/, ''), i = str.length, ws = /\s/;
  while(ws.test(str.charAt(--i)));
  return str.slice(0, i + 1);
};

// repeat
String.prototype.repeat = function( num )
{
  return new Array( num + 1 ).join( this );
}

// ajax get
var getreq = false;
function ajax_get(data, func, file)
{
   if(!file) var file = "ajax.php?";
   if(file.substr(-1) != '?') file += '?';
   
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
   getreq.send();

   return true;
}

var _get = false;
function get_variables(link)
{
  var search = link;
  var a = [];
  
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
//csj();
eventon('load', csj);

})();