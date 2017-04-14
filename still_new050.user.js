// ==UserScript==
// @name           Still New
// @author         Vector 
// @version        0.5.0
// @namespace      http://www.w3.org/1999/xhtml
// @description    Torrenteknél (Új) jelzés manuális frissítéssel. (Opera/Greasemonkey)
// @include        http://bithumen.*/browse.php*
// @include        http://www.bithumen.*/browse.php*
// ==/UserScript==


var frissitoGomb = '<br/>&lt;(<font color="red">Új</font>) jelzés frissítése!&gt;';// html-be beleírt frissítő gomb
var frissitoGombCSS = 'cursor: pointer; font-weight: bold; font-size: 12px;';// frissítő gombhoz CSS


//* felhasználó adatainak kigyujtése
var sn_user = [];
sn_user['sn_last'] = getCookie('sn_last');
sn_user['lastid'] = getCookie('lastid');


//* frissítő gomb inicializálása
var sn_box = document.createElement('span');
sn_box.innerHTML = frissitoGomb;
sn_box.setAttribute('id', 'sn_box');
sn_box.setAttribute('style', frissitoGombCSS);

var sn_place = document.getElementById('maintd').getElementsByTagName('form')[0];
//sn_place.insertBefore(sn_box, sn_place.firstChild);
sn_place.insertBefore(sn_box, null);
sn_box = document.getElementById('sn_box');

sn_box.addEventListener('click', function () { sn_refresh(this); }, false);


//* új jelzés / tárolásához / fixálásához sütik beállítása
if(sn_user['sn_last'] === false)// friss indítás
{
  document.cookie = 'sn_last=' + sn_user['lastid'] + '; expires=Mon, 22 Aug 2087 03:14:15 GMT; path=/';
}
else
{
  document.cookie = 'lastid=' + sn_user['sn_last'] + '; expires=Mon, 22 Aug 2087 03:14:15 GMT; path=/';
}


//* új jelzés frissítése
function sn_refresh(elem)
{
  document.cookie = 'sn_last=' + sn_user['lastid'] + '; expires=Mon, 22 Aug 2087 03:14:15 GMT; path=/';
  document.cookie = 'lastid=' + sn_user['sn_last'] + '; expires=Mon, 22 Aug 2087 03:14:15 GMT; path=/';
  location.reload(true);
}


//* adott süti kinyerése
function getCookie(name)
{
  var _cookies = document.cookie;
  var cookie_place = _cookies.indexOf(name + '=');

  if(cookie_place != -1)
  {
    return _cookies.substr(cookie_place + name.length + 1, 10);
  }
  else
  {
    return false;
  }
}


/* "A rétek halványak, Letérdelni nincs idő,
    A házam almafa, Autóm a cél..." */

/** 2008.09.18. **/