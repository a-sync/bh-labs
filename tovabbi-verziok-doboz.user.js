// ==UserScript==
// @name           További Verziók Doboz
// @version        0.2.4
// @description    A további verziókat tölti be közvetlenül a torrent alá.
// @namespace      bH
// @author         Vector
// @include        http://bithumen.be/browse.php*
// @include        https://bithumen.be/browse.php*
// @include        http://bithumen.ru/browse.php*
// @include        https://bithumen.ru/browse.php*
// ==/UserScript==
(function() {
//csak browse.php-n működik :)

var letoltes_ikon = 'gray'; // gray, blue, green, orange, yellow
//var letoltes_ikon = false; // ha nem kell

var szerkesztes_ikon = false; // true / false

var dbg = false; // DEBUG

var cat = [];
cat[24]='dvd_hun';
cat[20]='dvd';
cat[25]='720p_hun';
cat[5] ='720p';
cat[37]='1080p_hun';
cat[39]='1080p';
cat[23]='movies_hun';
cat[19]='movies';
cat[7] ='episodes_hun';
cat[26]='episodes';
cat[41]='episodes_hd_hun';
cat[42]='episodes_hd';
cat[33]='bd_hun';
cat[40]='bd';
cat[9] ='music_hun';
cat[6] ='music';
cat[35]='music_flac_hun';
cat[38]='music_flac';
cat[28]='book_hun';
cat[29]='book';
cat[4] ='games';
cat[21]='games_dox';
cat[31]='games_ps2';
cat[32]='games_xbox';
cat[36]='wii';
cat[1] ='apps';
cat[22] ='apps_other';
cat[27]='clips';
cat[30]='xxx';
cat[34]='xxx_hd';


var data = [];
data['others'] = '1';
var most = new Date();

function tovabbi_verziok()
{
  if(dbg)console.log('tovabbi_verziok()');
  
  var sor = document.createElement('TR');//tr
  sor.style.display = 'none';
  sor.style.padding = '0px';
  sor.appendChild(document.createElement('TD'));
  
  sor.firstChild.setAttribute('colspan', '99');//td
  sor.firstChild.setAttribute('align', 'center');//td
  sor.firstChild.appendChild(document.createElement('TABLE'));
  
  sor.firstChild.firstChild.className = 'main';//table
  //sor.firstChild.firstChild.setAttribute('id', 'others');
  sor.firstChild.firstChild.setAttribute('cellpadding', '5');
  sor.firstChild.firstChild.setAttribute('cellspacing', '0');
  sor.firstChild.firstChild.setAttribute('border', '1');
  sor.firstChild.firstChild.setAttribute('width', '98%');
  
  var fejlec = document.createElement('TR');//tr
  fejlec.innerHTML = '<td class="colhead" align="center" width="32"><span>Típus</span></td><td class="colhead" align="left" width="80%"><span>Név</span></td><td class="colhead" align="center"><span>Hozzáadva</span></td><td class="colhead" align="center"><span>Méret</span></td><td class="colhead" align="right"><span>Seed</span></td><td class="colhead" align="right"><span>Leech</span></td>';
  
  sor.firstChild.firstChild.appendChild(fejlec);
  
  if(dbg)console.log('sor sablon: ' + sor);
  
  var tv_linkek = document.getElementById('torrenttable').getElementsByTagName('a');
  
  if(dbg)console.log('tv_linkek.length: '+tv_linkek.length);
  for(var i = 0; i < tv_linkek.length; i++)
  {
    if(tv_linkek[i].getAttribute('href').indexOf('&others=1#others') != -1)
    {
      eventon('click', function()
      {
        if(isNaN(this.tid))
        {
          this.tid = this.getAttribute('href').split('?id=')[1].split('&')[0];
          this.setAttribute('href', 'javascript:;');
        }
        data['id'] = this.tid;
        this.setAttribute('id', 'others_i_'+this.tid);
        
        if(!document.getElementById('others_' + data['id']))
        {
          var szulo_sor = this.parentNode.parentNode.parentNode;
          var tvsor = szulo_sor.parentNode.insertBefore(sor.cloneNode(true), szulo_sor.nextSibling);
          tvsor.firstChild.firstChild.setAttribute('id', 'others_' + data['id']);
          
          ajax_get(data, function()
            {
              if (getreq.readyState == 4)
              {
                if (getreq.status == 200)
                {
                  var tv = eval('(' + getreq.responseText + ')').results;
                  if(dbg)console.log('torrentek: ' + tv);
                  
                  if(dbg)console.log('ID: '+data['id']+' / '+(tv.length)+' további verzió.');
                  var tv_i = 0;
                  for(var j = 0; j < tv.length; j++)
                  {
                    if(tv[j].id != data['id'])
                    {
                      var ujsor = document.createElement('TR');
                      
                      var ikonok = '';
                      if(letoltes_ikon != false)
                      {
                        ikonok += ' <a href="download.php/' + tv[j].id + '/%5BbHUm_%23' + tv[j].id + '%5D' + tv[j].filename + '" title="Letöltés" style="border: none">'
                              + '<img src="media/img/null.png" class="spr_b S' + letoltes_ikon + '-dl_icon" width="16" height="15"/>'
                              + '</a>';
                      }
                      
                      if(szerkesztes_ikon != false)
                      {
                        ikonok += ' <a href="edit.php?id=' + tv[j].id + '"><img src="media/img/null.png" class="spr_b sedit_icon" width="16" height="15"/></a>';
                      }
                      
                      var added = new Date(tv[j].added_unixtime * 1000);
                      
                      var d_m = (added.getMonth()+1 < 10) ? '0'+(added.getMonth()+1) : (added.getMonth()+1);
                      var d_d = (added.getDate() < 10) ? '0'+added.getDate() : added.getDate();
                      var d_h = (added.getHours() < 10) ? '0'+added.getHours() : added.getHours();
                      var d_mi = (added.getMinutes() < 10) ? '0'+added.getMinutes() : added.getMinutes();
                      
                      var hozzaadva = '';
                      if(added.toDateString() == most.toDateString()) hozzaadva = 'ma '+d_h+':'+d_mi;
                      else if(added.getFullYear() == most.getFullYear())
                      {
                        if(added.getDate() == most.getDate()-1 && added.getMonth() == most.getMonth()) hozzaadva = 'tegnap '+d_h+':'+d_mi;
                        else hozzaadva = '<u>'+d_m+'.'+d_d+'.</u> '+d_h+':'+d_mi;
                      }
                      else hozzaadva = added.getFullYear()+'-'+d_m+'-'+d_d+' '+d_h+':'+d_mi;
                      
                      if(tv[j].up_szorzo != 1)
                      {
                        hozzaadva += "<br><font color='#006600' style='display: block; margin-top: 3px'>"
                                  +  "<img src='media/img/null.png' class='spr_b Sarrow_up' width=12 height=9/> &times; "+tv[j].up_szorzo
                                  +  "</font>";
                      }
                      
                      var meret = tv[j].size;
                      
                      for(var n = 0; n <= 3; n++)
                      {
                        if(meret >= 1024 || n == 0) meret /= 1024;
                        else break;
                      }
                      
                      var egyseg = '';
                      switch(n)
                      {
                        case 1: egyseg = 'kB'; break;
                        case 2: egyseg = 'MB'; break;
                        case 3: egyseg = 'GB'; break;
                      }
                      
                      if(tv[j].down_szorzo != 1)
                      {
                        meret = "<u>"+meret.toFixed(2) + ' ' + egyseg + "</u><br><nobr><font color='#990000' style='display: block; margin-top: 3px'>"
                              + "<img src='media/img/null.png' class='spr_b Sarrow_down' width=12 height=9/> &times; " + tv[j].down_szorzo
                              + "</font></nobr>";
                      }
                      else meret = '<u>'+meret.toFixed(2) + '<br>' + egyseg+'</u>';
                      
                      ujsor.innerHTML = ''
                                      + '<td align="center" width="32" style="padding: 0px" class="cati">'
                                      + '<img class="spr_c Scat_'+cat[tv[j].category]+'" height="42" border="0" width="42" alt="'+tv[j].category_name+'" src="media/img/null.png">'
                                      + '</td>'
                                      + '<td align="left">'// width="80%"
                                      + '<a href="details.php?id='+tv[j].id+'"><b>'+tv[j].name+'</b></a>'
                                      + ikonok
                                      + '</td>'
                                      + '<td align="center" title="">'
                                      + '<nobr>'+hozzaadva+'</nobr>'
                                      + '</td>'
                                      + '<td align="center">'
                                      + '<nobr>'+meret+'</nobr>'
                                      + '</td>'
                                      + '<td align="right">'
                                      + '<b><a href="details.php?id='+tv[j].id+'&amp;dllist=1#seeders" class="green">'+tv[j].seeders+'</a></b>'
                                      + '</td>'
                                      + '<td align="right">'
                                      + '<b><a href="details.php?id='+tv[j].id+'&amp;dllist=1#leechers" class="green">'+tv[j].leechers+'</a></b>'
                                      + '</td>';
                       
                       document.getElementById('others_' + data['id']).appendChild(ujsor);
                       
                       tv_i++;
                     }
                  } //for
                  
                  
                  var tv_n = document.getElementById('others_i_' + data['id']).getAttribute('title').split(' ')[0];
                  if(dbg)console.log(tv_n+' / '+tv_n+'db');
                  
                  var osszes = document.createElement('CENTER');
                  if(tv_n-tv_i == 0) osszes.style.visibility = 'hidden';
                  osszes.innerHTML = '<a class="sublink" href="details.php?id='+data['id']+'&amp;others=1#others">'
                                   + '<img border="0" height="15" width="15" class="spr_b S'+(!letoltes_ikon?'gray':letoltes_ikon)+'-group_icon" src="media/img/null.png"> [Teljes lista <b>+'+(tv_n-tv_i)+'db</b>]</a>';
                  document.getElementById('others_' + data['id']).parentNode.appendChild(osszes);
                  
                  document.getElementById('others_' + data['id']).parentNode.parentNode.style.display = '';
                }
              }
            }, 'backend-details.php?');
        }
        else
        {
          var tvsor = document.getElementById('others_' + data['id']).parentNode.parentNode;
          if(tvsor.style.display == '') tvsor.style.display = 'none';
          else tvsor.style.display = '';
        }
        
      }, tv_linkek[i]);
    }
  }//for
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
   //if (!getreq) alert('An error occurred during the XMLHttpRequest!');

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

function eventon(type, func, elem)
{
  if(!elem) elem = window;
  if(elem.attachEvent) elem.attachEvent('on'+type,func);
  else elem.addEventListener(type, func, false);
}

//tovabbi_verziok();
eventon('load', tovabbi_verziok);

})();