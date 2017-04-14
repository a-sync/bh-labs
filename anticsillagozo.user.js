// ==UserScript==
// @name        Anticsillagozó
// @namespace   bH
// @description IMDB link alapján elrejti a nem kívánatos torrenteket.
// @version     0.0.5
// @author      Vector
// @include     http://bithumen.be/browse.php*
// @include     https://bithumen.be/browse.php*
// @include     http://bithumen.ru/browse.php*
// @include     https://bithumen.ru/browse.php*
// @exclude     http://bithumen.be/browse.php?*search=*
// @exclude     https://bithumen.be/browse.php?*search=*
// @exclude     http://bithumen.ru/browse.php?*search=*
// @exclude     https://bithumen.ru/browse.php?*search=*
// ==/UserScript==
(function() {
var imdb_id_lista = ''; // állandóan szűrendő lista

// TODO: localStorage (ha a süti túl nagy, lehal a szerver (503))
var dbg = false;

var infos = document.getElementById('torrenttable').getElementsByTagName('div');
if(infos)
{
  var css = '#acs_doboz {position: fixed; bottom: 10px; right: 10px; text-align: right; z-index: 600;}'
          + '#acs_gomb { width: 16px; height: 16px; opacity: 0.4; }'
          + '#acs_ment { width: 16px; height: 16px; opacity: 0.6; margin-right: 5px; visibility: hidden; }'
          + '#acs_gomb:hover, #acs_ment:hover { cursor: pointer; opacity: 0.9; }'
          + '#acs_lista { width: 250px !important; height: 300px !important; text-align: left; display: none; }'
          + '.acs_ikon {width: 10px; height: 10px; cursor: pointer; margin: 2px 0 0 3px; opacity: 0.4; }'
          + '.acs_ikon:hover { opacity: 0.9; }';
  ////
    var head = document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
  ////
  
  for(var i = 0; i < infos.length; i++)
  {
    var b = infos[i].getElementsByTagName('b');
    if(b.length > 1)
    {
      if(b[0].parentNode.hasAttribute('href') && b[0].parentNode.href.indexOf('http://www.imdb.com/title/tt') != -1)
      {
        var ikon = document.createElement('IMG');
        ikon.setAttribute('class', 'acs_ikon');
        //ikon.setAttribute('title', 'Rejtés');
        ikon.setAttribute('src', cross_pic());
        
        eventon('click', function()
        {
          var add = this.previousSibling.href.split('http://www.imdb.com/title/tt')[1].split('/')[0];
          if(!isNaN(add))
          {
            var alista = _cookie('acs_lista').split(',');
            if(alista.indexOf(add) == -1)
            {
              alista[alista.length] = add;

              acs_szures(alista);

              document.getElementById('acs_lista').value = acs_idlista(alista);
              
              set_cookie('acs_lista', alista.join(','));
              if(dbg)console.log('dbg: alista = '+alista);
            }
          }
        }, ikon);
        
        infos[i].insertBefore(ikon, b[0].parentNode.nextSibling);
      }
    }
  }

  var acs_doboz = document.createElement('DIV');
  acs_doboz.setAttribute('id', 'acs_doboz');
  var l = '';
  
  var lista = _cookie('acs_lista');
  if(lista != null && lista != '')
  {
    lista = lista.split(',');
    
    acs_szures(lista);
    
    l = acs_idlista(lista);
  }
  else set_cookie('acs_lista', '');
  
  if(dbg)console.log('dbg: lista = '+lista);
  
  acs_doboz.innerHTML = '<textarea id="acs_lista">'+l+'</textarea><img title="Mentés" src="'+rotate_pic()+'" id="acs_ment"/><img title="Anticsillagozó" src="'+cross_pic()+'" id="acs_gomb"/>';
  document.body.appendChild(acs_doboz);
  
  eventon('click', function()
  {
    var acs_lista = document.getElementById('acs_lista');
    var acs_ment = document.getElementById('acs_ment');
    if(acs_lista.style.display == 'block')
    {
      this.setAttribute('title', 'Anticsillagozó');
      acs_lista.style.display = 'none';
      if(acs_ment.style.visibility == 'visible') acs_lista.value = acs_lista.innerBAK;
      acs_ment.style.visibility = 'hidden';
    }
    else
    {
      acs_lista.innerBAK = acs_lista.value;
      acs_lista.style.display = 'block';
      this.setAttribute('title', 'Bezárás');
    }
  }, document.getElementById('acs_gomb'));
  
  eventon('keyup', function()
  {
    var acs_ment = document.getElementById('acs_ment');
    if(this.value != this.innerBAK) acs_ment.style.visibility = 'visible';
    else acs_ment.style.visibility = 'hidden';
  }, document.getElementById('acs_lista'));
  
  eventon('click', function()
  {
    var acs_lista = document.getElementById('acs_lista');
    if(acs_lista.value != acs_lista.innerBAK)
    {
      var ujinput = acs_lista.value.replace(/http:\/\/www.imdb.com\/title\//g,'').replace(/\s/g,'');
      
      ujinput = ujinput.split(',');
      var ujlista = [];
      for(var i = 0; i < ujinput.length; i++)
      {
        if(ujinput[i].indexOf('tt') == 0)
        {
          var n = ujinput[i].substr(2).split('/')[0];
          if(!isNaN(n) && ujlista.indexOf(n) == -1) ujlista[ujlista.length] = n;
        }
      }
      
      acs_szures(ujlista);
      acs_lista.value = acs_idlista(ujlista);
      acs_lista.innerBAK = acs_lista.value;
      
      set_cookie('acs_lista', ujlista.join(','));
      if(dbg)console.log('dbg: ujlista = '+ujlista);
      
      this.style.visibility = 'hidden';
    }
  }, document.getElementById('acs_ment'));
}

function acs_idlista(idlista)
{
  var l = '';
  for(var i = 0; i < idlista.length; i++)
  {
    if(idlista[i] != '') l += 'http://www.imdb.com/title/tt'+idlista[i]+'/, ';
  }
  return l;
}

function acs_szures(idlist)
{
  if(infos.length > 0)
  {
    if(imdb_id_lista != '') idlist.concat(imdb_id_lista.replace(/http:\/\/www.imdb.com\/title\/tt/g,'').replace(/\//g,'').replace(/\s/g,'').split(','));
    for(var i = 0; i < infos.length; i++)
    {
      var link = infos[i].innerHTML.split('http://www.imdb.com/title/tt');
      if(link.length != 1)
      {
        link = link[1].split('/')[0];
        if(idlist.indexOf(link) != -1) infos[i].parentNode.parentNode.style.display = 'none';
        else infos[i].parentNode.parentNode.style.display = '';
      }
    }
  }
}

function cross_pic()
{
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIhSURBVDjLlZPrThNRFIWJicmJz6BWiYbIkYDEG0JbBiitDQgm0PuFXqSAtKXtpE2hNuoPTXwSnwtExd6w0pl2OtPlrphKLSXhx07OZM769qy19wwAGLhM1ddC184+d18QMzoq3lfsD3LZ7Y3XbE5DL6Atzuyilc5Ciyd7IHVfgNcDYTQ2tvDr5crn6uLSvX+Av2Lk36FFpSVENDe3OxDZu8apO5rROJDLo30+Nlvj5RnTlVNAKs1aCVFr7b4BPn6Cls21AWgEQlz2+Dl1h7IdA+i97A/geP65WhbmrnZZ0GIJpr6OqZqYAd5/gJpKox4Mg7pD2YoC2b0/54rJQuJZdm6Izcgma4TW1WZ0h+y8BfbyJMwBmSxkjw+VObNanp5h/adwGhaTXF4NWbLj9gEONyCmUZmd10pGgf1/vwcgOT3tUQE0DdicwIod2EmSbwsKE1P8QoDkcHPJ5YESjgBJkYQpIEZ2KEB51Y6y3ojvY+P8XEDN7uKS0w0ltA7QGCWHCxSWWpwyaCeLy0BkA7UXyyg8fIzDoWHeBaDN4tQdSvAVdU1Aok+nsNTipIEVnkywo/FHatVkBoIhnFisOBoZxcGtQd4B0GYJNZsDSiAEadUBCkstPtN3Avs2Msa+Dt9XfxoFSNYF/Bh9gP0bOqHLAm2WUF1YQskwrVFYPWkf3h1iXwbvqGfFPSGW9Eah8HSS9fuZDnS32f71m8KFY7xs/QZyu6TH2+2+FAAAAABJRU5ErkJggg==';
}

function rotate_pic()
{
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHsSURBVDjLtZPpTlpRFIV5Dt7AOESr1kYNThGnSomIihPoNVi5Qp3RgBgvEERpRW1BRBAcMEDUtIkdjKk4otK0Jdr2vgxZ3kA0MYoaG3+cX2evb529zt4sAKz/OawnASgCBNm5LaE7vjVDutkA4mMdLV4TkvcCuvba2Iqd1pDhWA33mQU+2oXVv07YfpoxuNWFuqVXoeqFCnZcgJwRm04p+Gk3Fs9t8PyZx/K5Hfbf03CGLRj62g2+rSR0K0D+vZXUB1Xw/ou5usJWjAaU0Gz3w/rjHey/ZjDLvKTD34KSyXzyBkC2JaYd4feMqyNa3OQTREQePlXjrqSq5ssj5hMjTMd66ALDKDLm0jcA0s+NID6JIFmvQaNXANEKX3l5x7NyqTcb7Zg8GYtCOLoXuPcbha6XV0VlU4WUzE9gPKjF2CGFbE3G3QAmafDnShETF3iKTZyIblcNza4Syi/deD6USscFCJwV6Fwn8NonQak5Hy1L9TAcjkJ/oAG1p0a1hYdnfcnkrQCBoxyyNYLp1YCJoB7GIwqGgxGod/oZsQoNDiHSepNCceeAN8uF1CvGxJE25rofc+3blKPqQ2VUnKxIYN85yty3eWh216LeKUTOSCayVGlIH0g5S+1JJB+8Cxxt1rWkH7WNTNIPAlwA9Gm7OcXUHxUAAAAASUVORK5CYII=';
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

})();