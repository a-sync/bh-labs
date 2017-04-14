// ==UserScript==
// @name           bHookMarks
// @version        1.2.0
// @namespace      http://www.w3.org/1999/xhtml
// @description    Bookmarks + bH
// @include        http://bithumen.*
// @include        http://www.bithumen.*
// ==/UserScript==

// todo: elfelejtett kulcs visszaigénylése gomb

/* változók */
var home_frame_height = '455';
var safe_mode = false;
var bhm_php = 'http://nextserver.hu/bhm/';
var uid = '';
var bhm_key = '';
var sheet = false;
var host = false;

var version = '1.2.0';
var _get = [];

// betöltéskor mehet a menet
if(window.attachEvent) window.attachEvent('onload', bhm_init);
else window.addEventListener('load', bhm_init, false);


/* inicializálás */
function bhm_init()
{
  // bHookMarks menüpont beszúrása
  bh_add_menu('bHookMarks', 'ircinvite.php?bhm=home');

  /* változók */
  if(_cookie('bhm_home_frame_height') != '') home_frame_height = _cookie('bhm_home_frame_height');
  if(_cookie('bhm_safe_mode') != '') safe_mode = (_cookie('bhm_safe_mode') == 'true') ? true : false;
  if(_cookie('bhm_php') != '') bhm_php = _cookie('bhm_php');
  if(_cookie('uid') != '') uid = _cookie('uid');
  if(_cookie('bhm_key') != '') bhm_key = _cookie('bhm_key');
  if(sheet == false) sheet = document.getElementsByTagName('link')[0].href.split('/').pop();
  if(host == false) host = document.location.host;

  get_variables();

  var loc = document.location.pathname.split('?')[0];
  if(loc == '/ircinvite.php') // bHm oldala (Chat)
  {
    var title = document.getElementsByTagName('h2')[0];
    var content = title.parentNode.getElementsByTagName('td')[0];

    if(_get['bhm'] == 'settings' || (bhm_key == '' && _get['bhm'] == 'home')) // bHm settings
    {
      var settings = [];
      settings['chat_key'] = content.getElementsByTagName('b')[0].innerHTML.split('!invite ')[1];
      settings['safe_mode_check'] = (safe_mode) ? ' checked="checked"' : '';

      document.title = 'BitHUmen :: bHookMarks - Beállítások';
      title.innerHTML = '<a href="?bhm=home">bHookMarks</a> - Beállítások';
      content.innerHTML = ''
        + 'Azonosító kulcs: <input type="text" id="bhm_key" maxlength="32" style="width: 220px" value="' + bhm_key + '" /> <input type="button" value="+" title="Chat kulcs használata" id="bhm_chat_key" onclick="document.getElementById(\'bhm_key\').value=\'' + settings['chat_key'] + '\'" /> <b id="bhm_key_faq">(min. 8, max. 32 karakter, a-z, 0-9)</b><br />'

        + 'Új azonosító kulcs: <input type="text" id="bhm_new_key" maxlength="32" style="width: 220px" value="" /> <input type="button" value="+" title="Chat kulcs használata" id="bhm_chat_key_new" onclick="document.getElementById(\'bhm_new_key\').value=\'' + settings['chat_key'] + '\'" /> <b id="bhm_new_key_faq">(min. 8, max. 32 karakter, a-z, 0-9, jelenlegi kulcs is kell)</b><br />'

        + 'bHookMarks doboz magassága: <input type="text" id="bhm_home_frame_height" maxlength="32" style="width: 100px" value="' + home_frame_height + '" /> <b id="bhm_home_frame_height_faq">(pozitív egész szám, pixelben értendő)</b><br />'

        + 'Könyvjelző adatbázis: <input type="text" id="bhm_php" style="width: 320px" value="' + bhm_php + '" /> <b id="bhm_php_faq">(érvényes URL egy bHookMarks adatbázishoz)</b><br />'

        + 'Csökkentett mód: <input style="margin:0;" type="checkbox" value="true" id="bhm_safe_mode"' + settings['safe_mode_check'] + ' /><br />'

        + '<br /><input style="cursor:pointer;" type="submit" value="Beállítás!" id="bhm_submit" /> <b id="bhm_submit_faq"></b>'


        + '<br /><br /><br /><h2>Használat előtt olvasd el!</h2>'
        + 'Az <b>azonosító kulcs</b> tulajdonképpen a könyvjelző adatbázishoz a jelszavad. Nagyon nagy titkot nem véd és nem hashelve van tárolva ezért <u>ne egy rendes jelszavadat add meg</u>! Minimum 8, maximum 32 karakterből álló kulcsot kell kitalálnod magadnak, amely csak az angol ábécé betűiből és számokból áll. Ajánlott például a chat kulcs használata, amit azonnal betölthetsz a + (plussz) feliratú gombra kattintva. A már meglévő azonosító kulcsod segítségével állíthatsz <b>új azonosító kulcs</b>ot, ha engedélyezve van az adott könyvjelző adatbázis szerveren. Ez az azonosító kulcs hozzá lesz kötve az account azonosítódhoz, ezért mentsd el valahova, hogyha újra be kell állítani, ne legyen probléma. <u>Soha ne add ki senkinek ezt a kulcsot!</u> <i>(én sem kérem el soha, bármi történik is)</i><br /><br />'

        + 'A <b>chat kulcs</b> az oldal minden felhasználójának egyedi. Az irc-re történő bejelentkezéshez szükséges, de semmilyen más adatod nem nyerhető ki belőle. <u>Nem állandó</u>, azaz ha például megváltoztatod a passkey-edet a chat kulcsod is megváltozik, ezért ne számolj azzal, hogy innen mindig vissza tudod állítani az azonosító kulcsodat. Jól használható bHookMarks azonosító kulcsnak.<br /><br />'

        + 'A <b>könyvjelző adatbázis</b> helye, a szkript szerver oldali fájljainak az elérése. <u>Csak olyan könyvjelző adatbázist használj amit megbízható emberek üzemeltetnek, megbízható helyen!</u> <i>(haladó felhasználóknak)</i><br /><br />'

        + 'A <b>csökkentett mód</b> bekapcsolásával a torrentlista betöltési ideje lényegesen javítható ha nagy számú torrent van megjelenítve egyszerre a letöltés oldalon. A hátránya az, hogy ilyenkor a könyvjelző ikon nem fog másképp kinézni olyan torrenteknél amik már a könyvjelzők közt vannak. Ettől függetlenül egy torrent csak egyszer kerül a könyvjelző listába, és a torrent adatlapon továbbra is látszódik ha már fel van véve. A bHookMarks oldalon bármikor kivehetőek a könyvjelzők. A lassúság kompenzálható ha kevesebb torrentet jelenítesz meg oldalanként.<br /><br />'

        + 'A <b>könyvjelző ikonok</b>nak három típusa van, három szín. Piros állapotban a bHookMarks nem aktív, éppen betölt, vagy valamilyen hiba történt. A piros ikon fölé húzva az egeret, bővebb információkhoz juthatsz. A kék állapotú ikon azt jelöli, hogy a torrent nincsen a könyvjelzők közt, vagyis rákkattintva felvehető. Kivételt képez csökkentett módban a torrentlista, ugyanis ott nincsen jelölve, hogy melyik torrent van már a listában. A sárga ikon jelöli a már könyvjelzővel jelölt torrenteket. <i>(ezen kattintva a torrent lekerül a listából)</i><br /><br />'

        + 'A szkript újabb változatai a fórumban, a <a href="forums.php?action=viewtopic&topicid=1084">bH Extrákkal (bH Labs)</a> topikban lesznek közzétéve.<br />'
        + 'Köszönöm, hogy elolvastad a leírást. <a href="sendmessage.php?receiver=55830&template=1"><b>Hibabejelentések IDE!</b></a>'
        + '<p align="right"><i>v' + version + '</i></p>';

      if(document.getElementById('bhm_submit').attachEvent) document.getElementById('bhm_submit').attachEvent('onclick', bhm_apply_settings);
      else document.getElementById('bhm_submit').addEventListener('click', bhm_apply_settings, false);
    }
    else if(_get['bhm'] == 'home') // bHm home
    {
      document.title = 'BitHUmen :: bHookMarks';
      title.innerHTML = 'bHookMarks (<a href="?bhm=settings">Beállítások</a>)';
      content.innerHTML = '';

      var home_frame = open_frame('bhm=home', 'home_frame', '100%', home_frame_height);
      content.appendChild(home_frame);
    }
  }
  else if((loc == '/browse.php' || loc == '/index.php' || loc == '/') && bhm_key != '') // torrentek
  {
    var rows = document.getElementById('torrenttable').getElementsByTagName('tr');
    var rows_num = rows.length;

    // fejléc cella beszúrása
    var new_td = document.createElement('TD');
    new_td.innerHTML = '<span><a href="ircinvite.php?bhm=home">Kedvenc</a></span>';
    new_td.setAttribute('align', 'center');
    new_td.setAttribute('class', 'colhead');
    rows[0].appendChild(new_td);

    // sorok kipörgetése
    var tdata = [];
    for(var i = 1; i < rows_num; i++)
    {
      var cells = rows[i].getElementsByTagName('td');

      // adatgyűjtés
      tdata['tid'] = cells[1].getElementsByTagName('a')[0].href.split('id=')[1].split('&')[0];
      tdata['cat'] = cells[0].getElementsByTagName('img')[0].alt.replace(/\W/gi, '');
      tdata['title'] = cells[1].getElementsByTagName('b')[0].innerHTML.replace(/&/gi, '&amp;');
      if(loc == '/browse.php')
      {
        tdata['date'] = cells[4].getElementsByTagName('nobr')[0].innerHTML.replace(/<br>/gi, '').replace(/\W/gi, '');
        tdata['size'] = cells[5].getElementsByTagName('u')[0].innerHTML.replace(/<br>/gi, '');
      }
      else
      {
        tdata['date'] = cells[2].getElementsByTagName('nobr')[0].innerHTML.replace(/<br>/gi, '').replace(/\W/gi, '');
        tdata['size'] = cells[3].innerHTML.replace(/<br>/gi, '');
      }

      // cella beszúrása
      new_td = document.createElement('TD');
      new_td.setAttribute('align', 'center');
      rows[i].appendChild(new_td);

      // frame beszúrása
      if(safe_mode)
      {
        var lib = bhm_php.split('/');
        lib.pop();
        lib = lib.join('/') + '/';

        tdata['frame'] = document.createElement('IMG');
        tdata['frame'].setAttribute('id', 'bhm_add-' + tdata['tid']);
        tdata['frame'].setAttribute('style', 'cursor:pointer;');
        tdata['frame'].setAttribute('title', 'Hozzáadás a könyvjelzőkhöz!');

        tdata['frame'].setAttribute('src', lib + 'styles/fav0.png');
        tdata['frame'].setAttribute('onmouseover', 'this.src=\'' + lib + 'styles/fav1.png\';');
        tdata['frame'].setAttribute('onmouseout', 'this.src=\'' + lib + 'styles/fav0.png\';');

        tdata['frame'].setAttribute('rel', 'bhm=browse&bhm_action=add&tid=' + tdata['tid'] + '&cat=' + tdata['cat'] + '&date=' + tdata['date'] + '&size=' + tdata['size'] + '&title=' + escape(encodeURI(tdata['title'])));

        tdata['frame'].addEventListener('click', function () {
            open_frame(this.getAttribute('rel'));
        }, false);
      }
      else
      {
        tdata['frame'] = open_frame('bhm=browse&tid=' + tdata['tid'] + '&cat=' + tdata['cat'] + '&date=' + tdata['date'] + '&size=' + tdata['size'] + '&title=' + escape(encodeURI(tdata['title'])), 'bhm_add-' + tdata['tid'], '32', '32', false, true);
      }
      new_td.appendChild(tdata['frame']);
    }
  }
  else if(loc == '/details.php' && bhm_key != '') // torrent adatlap
  {
    if(document.getElementById('maintd').getElementsByTagName('h1').length == 0) // ha a torrent nem létezik
    {
      open_frame('bhm=deleted&bhm_action=remove&tid=' + _get['id']);
    }
    else
    {
      var tdata = [];
      var rows = document.getElementById('maintd').getElementsByTagName('table')[0].getElementsByTagName('tr');
      var rows_num = rows.length;

      tdata['title'] = document.getElementById('maintd').getElementsByTagName('h1')[0].innerHTML.replace(/&/gi, '&amp;');
      if(tdata['title'].length > 63) tdata['title'] = tdata['title'].substr(0, 60) + '...';
      tdata['tid'] = _get['id'];

      for(var i = 1; i < rows_num; i++)
      {
        var cells = rows[i].getElementsByTagName('td');

        if(cells[0].innerHTML == 'Típus') tdata['cat'] = cells[1].innerHTML.replace(/\W/gi, '');
        else if(cells[0].innerHTML == 'Méret') tdata['size'] = cells[1].innerHTML.split(' (')[0].replace(/ /gi, '');
        else if(cells[0].innerHTML == 'Létrehozva') tdata['date'] = cells[1].innerHTML.split(' (')[0].replace(/\W/gi, '');
      }

      // sor beszúrása
      tdata['frame'] = open_frame('bhm=browse&tid=' + tdata['tid'] + '&cat=' + tdata['cat'] + '&date=' + tdata['date'] + '&size=' + tdata['size'] + '&title=' + escape(encodeURI(tdata['title'])), 'bhm_add-' + tdata['tid'], '32', '32', 'margin:0 0 -8px 10px;', true);

      document.getElementById('maintd').getElementsByTagName('h1')[0].appendChild(tdata['frame']);
    }
  }
  else if(loc == '/sendmessage.php' && _get['receiver'] == '55830' && _get['template'] == '1') // hibabejelentő lap
  {
    document.getElementsByTagName('h1')[0].innerHTML = '<b>bHookMarks hibabejelentő lap</b>';
    document.getElementsByTagName('form')[0].innerHTML = '(Mivel csak a kapott adatokra, és a leírásodra támaszkodva tudom ellenőrizni a hibát, kérlek a működési adatokat ne módosítsd,<br /> csak ha úgy gondolod személyes információ van benne. Ha úgy gondolod, hogy hibás adat van benne, akkor a leírás végén jelezd!)<br /><br />'
    + document.getElementsByTagName('form')[0].innerHTML;
    
    document.getElementsByTagName('textarea')[0].innerHTML = 'Működési adatok (a hibabejelentéshez)' + "\n"
    + ' -------------------- ' + "\n"
    + 'Verzió: ' + version + "\n"
    + 'Könyvjelző adatbázis: ' + bhm_php + "\n"
    + 'Csökkentett mód: ' + ((safe_mode) ? 'bekapcsolva' : 'kikapcsolva') + "\n"
    + 'Stílus: ' + sheet + "\n"
    + 'Domain: ' + host + "\n"
    + 'Doboz magasság: ' + home_frame_height + "\n"
    + 'Böngésző adatok: ' + navigator.userAgent + "\n"
    + ' -------------------- ' + "\n\r\n\r"
    + document.getElementsByTagName('textarea')[0].innerHTML;
  }
}


/* beállítások alkalmazása */
function bhm_apply_settings()
{
  var settings = [];
  settings['error'] = false;

  settings['bhm_key'] = document.getElementById('bhm_key').value.toLowerCase();
  document.getElementById('bhm_key').value = settings['bhm_key'];
  settings['bhm_new_key'] = document.getElementById('bhm_new_key').value.toLowerCase();
  settings['bhm_php'] = document.getElementById('bhm_php').value;
  settings['safe_mode_check'] = document.getElementById('bhm_safe_mode').checked;
  settings['bhm_home_frame_height'] = document.getElementById('bhm_home_frame_height').value;

  settings['bhm_key_reg'] = /^[0-9a-z]{8,32}$/;
  settings['bhm_php_reg'] = /^(http|ftp)\:\/\/\w+([\.\-]\w+)*\.\w{2,4}(\:\d+)*([\/\.\-\?\&\%\#\=]\w+)*\/?$/i;
  settings['bhm_home_frame_height_reg'] = /^[0-9]{1,32}$/;

  if(!settings['bhm_key_reg'].test(settings['bhm_key']))
  {
    settings['error'] = true;
    document.getElementById('bhm_key_faq').style.backgroundColor = 'red';
    setTimeout('document.getElementById(\'bhm_key_faq\').style.backgroundColor = \'transparent\';', 300);
  }
  if(settings['bhm_new_key'] != '')
  {
    document.getElementById('bhm_new_key').value = settings['bhm_new_key'];
    if(!settings['bhm_key_reg'].test(settings['bhm_new_key']))
    {
      settings['error'] = true;
      document.getElementById('bhm_new_key_faq').style.backgroundColor = 'red';
      setTimeout('document.getElementById(\'bhm_new_key_faq\').style.backgroundColor = \'transparent\';', 300);
    }
  }
  if(!settings['bhm_php'].match(settings['bhm_php_reg']))
  {
    settings['error'] = true;
    document.getElementById('bhm_php_faq').style.backgroundColor = 'red';
    setTimeout('document.getElementById(\'bhm_php_faq\').style.backgroundColor = \'transparent\';', 300);
  }
  if(!settings['bhm_home_frame_height'].match(settings['bhm_home_frame_height_reg']))
  {
    settings['error'] = true;
    document.getElementById('bhm_home_frame_height_faq').style.backgroundColor = 'red';
    setTimeout('document.getElementById(\'bhm_home_frame_height_faq\').style.backgroundColor = \'transparent\';', 300);
  }

  if(settings['error'] == false)
  {
    if(settings['bhm_new_key'] == '') set_cookie('bhm_key', settings['bhm_key']);
    else
    {
      set_cookie('bhm_key', settings['bhm_new_key']);
      document.getElementById('bhm_key').value = settings['bhm_new_key'];
      document.getElementById('bhm_new_key').value = '';
    }

    set_cookie('bhm_php', settings['bhm_php']);

    if(settings['safe_mode_check']) set_cookie('bhm_safe_mode', 'true');
    else set_cookie('bhm_safe_mode', '', true);

    set_cookie('bhm_home_frame_height', settings['bhm_home_frame_height']);

    document.getElementById('bhm_submit_faq').innerHTML = ' (Beállítások elmentve!)';
    setTimeout('document.getElementById(\'bhm_submit_faq\').innerHTML = \'\';', 1200);

    open_frame('bhm=home&bhm_action=change_key&bhm_new_key=' + settings['bhm_new_key']);
  }
}

/* _get változók kigyűjtése */
function get_variables(search)
{
  _get = [];
  if(!search) search = document.location.search.substr(1).split('&');

  for(var i in search)
  {
    var j = search[i].split('=');
    _get[j.shift()] = j.join('=');
  }

  return _get;
}


/* menüpont beszúrása */
function bh_add_menu(name, link, force)
{
  var menu_tr = document.getElementById('menu').getElementsByTagName('tr')[0];

  if(force == true || menu_tr.getElementsByTagName('td').length > 3) // force vagy több mint 3 menü elem van (be van jelentkezve)
  {
    var new_td = document.createElement('TD');
    new_td.setAttribute('class', 'navigation');
    new_td.setAttribute('align', 'center');
    //new_td.innerHTML = '<a href="' + link + '"><font color="red">' + name + '</font></a>';
    new_td.innerHTML = '<a href="' + link + '">' + name + '</a>';

    menu_tr.appendChild(new_td);
  }
}


/* adott süti kinyerése */
function _cookie(name)
{
  var cookie_place = document.cookie.indexOf(name + '=');

  if(cookie_place != -1)
  {
    return document.cookie.substr(cookie_place + name.length + 1).split('; ')[0];
  }
  else
  {
    return '';
  }
}


/* süti beállítás / törlés */
function set_cookie(name, val, del)
{
  if(del) del = 'Thu, 01-Jan-1970 00:00:01 GMT';
  else del = 'Mon, 22 Aug 2087 03:14:15 GMT';

  document.cookie = name + '=' + val + '; expires=' + del + '; path=/';
}


/* iframe adatküldő */
function open_frame(data, id, w, h, style, noscroll)
{
  if(!id) id = 'data_frame';

  var iframe = document.getElementById(id);
  if(!iframe)
  {
    iframe = document.createElement('IFRAME');

    iframe.setAttribute('id', id);
    iframe.setAttribute('border', '0');
    iframe.setAttribute('frameborder', '0');

    if(id == 'data_frame')
    {
      document.body.appendChild(iframe);
      if(!w) w = '0';
      if(!h) h = '0';
    }
  }
  if(w) iframe.setAttribute('width', w);
  if(h) iframe.setAttribute('height', h);
  if(!style) style = '';
  iframe.setAttribute('style', 'border:none;' + style);
  if(noscroll) iframe.setAttribute('scrolling', 'no');

  iframe.setAttribute('src', bhm_php + '?uid=' + uid + '&bhm_key=' + bhm_key + '&ver=' + version + '&sheet=' + sheet + '&host=' + host + '&' + data);

  return iframe;
}


/* "Íme itt a zöld: egy lepedőnyi Föld,
    A fölénk kifeszült kék: egy takarónyi Ég..." */