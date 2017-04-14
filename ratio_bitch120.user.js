// @name           Ratio bitcH
// @author         Vector 
// @version        1.2.0
// @description    Kiszámolja a várható arányt adott torrent(ek) letöltése esetére. (Opera/Firefox/IE/Chrome)

//oldalbetöltéskor mehet a menet
if(window.attachEvent) window.attachEvent('onload', bh_init);
else window.addEventListener('load', bh_init, false);

// inicializálás
var bh_user = [];
function bh_init(e)
{
  dbg('bh_init: Start...', 4);
  
  bh_user = bh_getuserdata();

  //if(bh_user['uid'] != 55830) { dbg('sry, dev mode blocked...'); return; } // nincs kukkolás
  dbg(bh_user, 3);

  rb_init(true, true);

  /*// position fixed emu
  document.body.innerHTML = '<div id="container_fix" style="height: 100%; overflow: auto; position: relative; z-index: 2;">' + document.body.innerHTML + '</div>';
  document.body.style.height = '100%';
  document.body.style.overflow = 'hidden';
  document.body.style.cssText = 'height: 100%; overflow: hidden;';
  */

  //focus

  dbg('bh_init: Done...', 4);
}

// felhasználó adatainak kinyerése
function bh_getuserdata()
{
  var fonts = document.getElementById('status').getElementsByTagName('font');
  var namelink = document.getElementById('status').getElementsByTagName('a')[0];

  bh_user['nev'] = namelink.innerHTML;
  bh_user['uid'] = namelink.href.split('userdetails.php?id=')[1].split('&')[0];

  bh_user['arany'] = parseFloat(fonts[1].innerHTML);
  bh_user['feltoltott'] = rb_convert(fonts[3], ' ');
  bh_user['letoltott'] = rb_convert(fonts[5], ' ');

  bh_user['seed'] = (fonts[7]) ? parseFloat(fonts[7].innerHTML) : false;
  bh_user['leech'] = (fonts[7]) ? parseFloat(fonts[8].getElementsByTagName('span')[0].innerHTML) : false;

  dbg('bh_getuserdata: Done...', 4);

  return bh_user;
}

// fájlméret átalakító
function rb_convert(elem, delimiter)
{
  if(!delimiter) var delimiter = '<br>';

  var re = (elem.innerHTML) ? elem.innerHTML : elem;
  re = re.toLowerCase().split(delimiter);

  switch(re[1])
  {
    case 'kb': re = (re[0] / 1024 / 1024); break;
    case 'mb': re = (re[0] / 1024); break;
    case 'tb': re = (re[0] * 1024); break;
    default: re = parseFloat(re[0]);
  }

  //return parseFloat(re);
  return re;
}

// Ratio bitcH inicializálása
function rb_init(aranyKulonbseg, szamlaloFul, altSzamlalo)
{
  bh_user['rb_letoltott'] = 0;

  if(typeof(aranyKulonbseg) == 'undefined') var aranyKulonbseg = true;
  if(typeof(szamlaloFul) == 'undefined') var szamlaloFul = true;
  if(typeof(altSzamlalo) == 'undefined') var altSzamlalo = false;

  rb_titles(aranyKulonbseg, szamlaloFul, altSzamlalo);
  if(szamlaloFul) rb_counter();

  dbg('aranyKulonbseg: ' + aranyKulonbseg);
  dbg('szamlaloFul: ' + szamlaloFul);
  dbg('altSzamlalo: ' + altSzamlalo);

  dbg('rb_init: Done...', 4);
}

// méretek title beállításai, számlálófül kontroll hozzárendelése
function rb_titles(aranyKulonbseg, szamlaloFul, altSzamlalo)
{
  // fájlméretek kipörgetése és html-be írás
  var sizes = document.getElementById('torrenttable').getElementsByTagName('u');

  for (var i = 0; i < sizes.length; i++)
  {
    if(sizes[i].innerHTML.indexOf('<br') != -1)
    {
      var rb = [];
      rb['size_gb'] = rb_convert(sizes[i]);
      rb['ratio'] = (bh_user['feltoltott'] / (bh_user['letoltott'] + rb['size_gb'])) + 0.00000001;
      rb['title'] = rb['ratio'].toFixed(3);

      rb['change'] = (rb['ratio'] - bh_user['arany']) + 0.00000001; // a várható, és a jelenlegi arány különbsége
      if(aranyKulonbseg) rb['title'] = rb['title'] + ' (' + rb['change'].toFixed(3) + ')';

      if(szamlaloFul)
      {
        if(sizes[i].attachEvent) sizes[i].attachEvent('onclick', rb_box_add);
        else sizes[i].addEventListener('click', rb_box_add, false);

        /*if(altSzamlalo)
        {
          sizes[i].setAttribute('rel', rb['size_gb']);
        }*/
      }

      sizes[i].setAttribute('title', rb['title']);
      sizes[i].style.cssText = 'cursor: help;';
      sizes[i].setAttribute('style', 'cursor: help;');
    }
  }

  dbg('rb_titles: Done...', 4);
}

// számlálófül létrehozása
var rb_bg_img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAAyCAYAAAD1JPH3AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAOtJREFUeNrs3cEJwkAURdHJML1OG2kj1UYCCkEEI4L4H+cU4CJcHt/VLPu+tzlnu2ht8HuXutu2rQ0hUyjotx0OIZMUdhczSSdIFzNJUXcxkxR1FzNJUXffgyTdOpO00haayIW2zkSstIUm9oYGQYOgQdAgaAQNggZBg6BB0AgaBA2CBkGDoBE0CBoEDYIGQSNoEDQIGgQNgkbQIGgQNHwT9OpTUNxqoYk+Oaw0pdfZQhP/p9BKU3adD8vxeP3Z/SF7YVMu5uPxei/JEhHzlRta1JSK+eXJ8cwJQoWQHyfH+PCHhM3fhXx2E2AAH4ck31bZh0kAAAAASUVORK5CYII=';
function rb_counter()
{
  var rb_box = document.createElement('div');
  rb_box.innerHTML = '+ <span style="color: royalblue;">Ar&#225;ny:</span> <input value="' + bh_user['arany'] + '" id="rb_ratio" style="margin: 0 0 0 7px; padding: 1px; width: 68px; height: 15px; border: none; background-image: none; background-color: transparent; text-align: right;" type="text" readonly/><br/>+ <span style="color: firebrick;">Let&#246;lt&#246;tt:</span> <input value="0" id="rb_down" style="margin: 0; padding: 1px; width: 50px; height: 17px; border: 1px solid darkgray; background-color: transparent; opacity: 0.8; text-align: right;" type="text" readonly/> GB<br/><span onclick="document.getElementById(\'rb_box\').style.display=\'none\'" id="rb_box_x" title="F&#252;l bez&#225;r&#225;sa!" style="color: firebrick; font-size: 8px; position: relative; top: -32px; left: 126px; cursor: pointer;">[X]</span><span onclick="rb_box_add(false);" id="rb_box_o" title="Null&#225;z&#225;s!" style="color: royalblue; font-size: 8px; position: relative; top: -12px; left: 114px; cursor: pointer;">[O]</span>';

  rb_box.setAttribute('id', 'rb_box');
  var rb_box_style = 'display: none; width: 140px; height: 60px; margin: 0; padding: 10px 0 0 0; right: 0; top: 20px; z-index: 314; overflow: hidden; background-repeat: no-repeat; background-position: top left; font-size: 10px;';

  rb_box.style.cssText = 'position: absolute; background-color: #5a5a5a; border: 1px solid gray; border-left: none; ' + rb_box_style;
  rb_box.setAttribute('style', 'position: fixed; background-image: url(\'' + rb_bg_img + '\'); border: none; ' + rb_box_style);

  document.body.insertBefore(rb_box, null);

  dbg('rb_counter: Done...', 4);
}

// fül adatainak kezelése
function rb_box_add(event) {
  if(event == false)
  {
    bh_user['rb_letoltott'] = 0;
    document.getElementById('rb_down').value = 0;
    document.getElementById('rb_ratio').value = bh_user['arany'].toFixed(3);
  }
  else
  {
    var elem = event.currentTarget || event.srcElement;
    var rb = [];

    document.getElementById('rb_box').style.display = '';

    /*if(altSzamlalo)
    {
      rb['size_gb'] = parseFloat(elem.getAttribute('rel'));//tip
      //egyszeru iffel ha letezik
    }
    else
    {*/
      rb['size_gb'] = rb_convert(elem);
    //}

    bh_user['rb_letoltott'] = bh_user['rb_letoltott'] + rb['size_gb'];
    rb['rb_ratio'] = (bh_user['feltoltott'] / (bh_user['letoltott'] + bh_user['rb_letoltott'])) + 0.00000001;

    document.getElementById('rb_down').value = bh_user['rb_letoltott'].toFixed(2);
    document.getElementById('rb_ratio').value = rb['rb_ratio'].toFixed(3);
  }

  dbg('bh_user[rb_letoltott] => ' + bh_user['rb_letoltott'], 3);
  dbg(rb, 2);
}


//mégegyszer klikkelsz kivonja (megváltozik az aláhuzás szaggatottra v vmi, (nem szin a kulonbozo temak miatt))
//title-be hogy mennyivel romlik, esetleg a detailbe (statisztika) levo hulyesegek
//onkeydown helyett onkeypress az eval mezonel
//gomb(ok) a sarokban amivel togglezni lehet a konzol kiterjedtségét (esetleg szazalekban)
//a gigák a dobozba beirva maxlength ellenorzessel(?)/ (csak szamok és pont(pont csak egyszer(vesszore is pontot rak)))

function sn_init() {} // dummy

/* ---------- DEBUG ---------- */
var dbg_n = 0;
var dbg_box = false;
function dbg(a, color)
{
//return true;//cock blocker
  if(dbg_box == false)
  {
    // eval doboz
    var dbg_eval_style = 'z-index: 666; top: 10px; right: 10px; color: lavender; width: 242px; height: 19px; background-color: #101010; border: 1px solid darkgray; font-size: 12px; font-family: Arial, Verdna, Tahoma, serif;';

    dbg_eval_box = document.createElement('input');

    dbg_eval_box.setAttribute('type', 'text');

    if(dbg_eval_box.attachEvent) dbg_eval_box.attachEvent('onkeydown', function (event) { var o = event.currentTarget || event.srcElement; if(event.keyCode == 13 || event.which == 13) dbg(eval(o.value), 5); });
    else dbg_eval_box.addEventListener('keydown', function (event) { var o = event.currentTarget || event.srcElement; if(event.keyCode == 13 || event.which == 13) dbg(eval(o.value), 5); }, false);
    
    dbg_eval_box.style.cssText = 'position: absolute; ' + dbg_eval_style;
    dbg_eval_box.setAttribute('style', 'position: fixed; ' + dbg_eval_style);

    document.body.insertBefore(dbg_eval_box, null);

    // debug doboz
    var dbg_style = 'right: 10px; top: 32px; z-index: 666; width: 236px; height: 50px; margin: 0; padding: 2px; overflow: auto; font-size: 10px; background-color: black; font-family: Arial, Verdna, Tahoma, serif; border: 1px dotted darkgray; line-height: 12px; color: dimgray;';

    dbg_box = document.createElement('div');

    dbg_box.style.cssText = 'position: absolute; ' + dbg_style;
    dbg_box.setAttribute('style', 'position: fixed; ' + dbg_style);

/*
    if(dbg_box.attachEvent) dbg_box.attachEvent('onmouseover', function (event) { var o = event.currentTarget || event.srcElement; setTimeout('o.style.height = \'500px\';', 2000); });
    else dbg_box.addEventListener('mouseover', function (event) { var o = event.currentTarget || event.srcElement;  setTimeout('o.style.height = \'500px\';', 2000); }, false);

    if(dbg_box.attachEvent) dbg_box.attachEvent('onmouseout', function (event) { var o = event.currentTarget || event.srcElement; o.style.height = '50px'; o.scrollTop = o.scrollHeight; });
    else dbg_box.addEventListener('mouseout', function (event) { var o = event.currentTarget || event.srcElement;  o.style.height = '50px'; o.scrollTop = o.scrollHeight; }, false);
*/
    dbg_box.setAttribute('onmouseover', 'this.style.height = \'90%\';');
    dbg_box.setAttribute('onmouseout', 'this.style.height = \'50px\';');
    //dbg_box.setAttribute('ondblclick', 'this.style.height = (this.style.height == \'50px\') ? \'50px\' : \'500px\';');

    document.body.insertBefore(dbg_box, null);
  }

  var s = '';
  switch(color)
  {
    case 1: color = 'darkred'; break;
    case 2: color = 'orange'; break;
    case 3: color = 'royalblue'; break;
    case 4: color = 'linen'; break;
    case 5: color = 'purple'; break;
    default: color = 'limegreen';
  }

  if(a instanceof Array || typeof(a) == 'object')
  {
    dbg_n++;
    s += '<b>' + dbg_n + '.</b>&nbsp; <span style="color: ' + color + ';">Array (</span><br/>';

    for(var i in a)
    {
      dbg_n++;
      s += '<b>' + dbg_n + '.</b>&nbsp; &nbsp; <span style="color: ' + color + ';">[' + i + '] => ' + a[i] + '</span><br/>';
    }

    dbg_n++;
    s += '<b>' + dbg_n + '.</b>&nbsp; <span style="color: ' + color + ';">)</span><br/>';
  }
  else
  {
    dbg_n++;
    s += '<b>' + dbg_n + '.</b>&nbsp; <span style="color: ' + color + ';">' + a + '</span><br/>';
  }

  dbg_box.innerHTML += s;

  dbg_box.scrollTop = dbg_box.scrollHeight;
}