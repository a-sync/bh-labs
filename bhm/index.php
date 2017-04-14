<?php
// bHookMarks Könyvjelző adatbázis fájl 1.2.1
// hibajelentés = /sendmessage.php?receiver=55830&template=1

// a domaineket, stílusokat és kategória ikonokat magadnak kell karbantartanod
// kell php 5.3, iframe-ben meghivás engedélyezése és a mappán legyen írásjog a fájlok létrehozásához
// a fájlok uid_azonositokulcs.txt formátumban mentődnek el
// ha létrehozol egy _news.txt fájlt, a tartalma, a szerverhez csatlakozók bHookMarks dobozának tetején jelenik meg.
//if($_GET['uid'] != '55830') { error('Karbantartás! brb'); }


/* beállítások */
$free_reg     = true; // ha false, csak manuálisan (te általad) létrehozva a fájlt lehet regisztrálni
$use_session  = true; // ha false, a szkript nem használ sessiont
$change_key   = true; // ha false, a felhasználók nem változtathatnak azonosító kulcsot
$send_pm      = true; // ha false, a felhasználók nem kapnak PM-et regisztrációnál és azonosító kulcs változtatásánál

error_reporting(0); // nem kellenek php hibaüzenetek
$domains = Array('bithumen.ru' => 'http://bithumen.ru/',
                 'bithumen.be' => 'http://bithumen.be/'
                );
// enyhe módosítások, hogy jól nézzen ki a bHookMarks oldalon (többnyire table háttérszín a body-ba)
$sheets =  Array('nightsurfer.css' => 'styles/nightsurfer.css',
                 'alporng-kri2.css' => 'styles/alporng-kri2.css',
                 'bithu_tel.css' => 'styles/bithu_tel.css',
                 'buek.css' => 'styles/buek.css',
                 'elmtsbase-blue.css' => 'styles/elmtsbase-blue.css',
                 'endless.css' => 'styles/endless.css',
                 'filelist.css' => 'styles/filelist.css',
                 'filelist2.css' => 'styles/filelist2.css',
                 'filelist3.css' => 'styles/filelist3.css',
                 'grass.css' => 'styles/grass.css',
                 'gray1.css' => 'styles/gray1.css',
                 'gray2.css' => 'styles/gray2.css',
                 'griiny-kri2.css' => 'styles/griiny-kri2.css',
                 'gripen_blue.css' => 'styles/gripen_blue.css',
                 'gripen_imagine.css' => 'styles/gripen_imagine.css',
                 'gripen_orange.css' => 'styles/gripen_orange.css',
                 'large.css' => 'styles/large.css',
                 'nyar.css' => 'styles/nyar.css',
                 'oink.css' => 'styles/oink.css',
                 'osz.css' => 'styles/osz.css',
                 'tavasz_ie.css' => 'styles/tavasz_ie.css',
                 'torrentbits.css' => 'styles/torrentbits.css',
                 'pralinee-kri2.css' => 'styles/pralinee-kri2.css',
                 'bithumen.css' => 'styles/bithumen.css'
                );
// a szerveren is hivatkozhatsz a képekre ha nem akarod tárolni
$d = end($domains);
$cats =    Array('filmhundvdr' => $d.'pic/cat_dvd_hun.gif', // Film/Hun/DVD-R
                 'filmengdvdr' => $d.'pic/cat_dvd.gif', // Film/Eng/DVD-R
                 'dvd9' => $d.'pic/cat_dvd9.gif', // DVD-9
                 'filmhunhd' => $d.'pic/cat_hd_hun.gif', // Film/Hun/HD
                 'filmenghd' => $d.'pic/cat_hd.gif', // Film/Eng/HD
                 'filmhunxvid' => $d.'pic/cat_movies_hun.gif', // Film/Hun/XviD
                 'filmengxvid' => $d.'pic/cat_movies.gif', // Film/Eng/XviD
                 'sorozathun' => $d.'pic/cat_episodes_hun.gif', // Sorozat/Hun
                 'sorozateng' => $d.'pic/cat_episodes.gif', // Sorozat/Eng
                 'rajzfilmsorozatok' => $d.'pic/cat_rajzfilm.gif', // Rajzfilmsorozatok
                 'mp3hun' => $d.'pic/cat_music.gif', // Mp3/Hun
                 'mp3eng' => $d.'pic/cat_music.gif', // Mp3/Eng
                 'lossless' => $d.'pic/cat_music_flac.gif', // Lossless
                 'ebookhun' => $d.'pic/cat_book.gif', // eBook/Hun
                 'ebookeng' => $d.'pic/cat_book.gif', // eBook/Eng
                 'jtkokiso' => $d.'pic/cat_games.gif', // Játékok/ISO
                 'jtkokripdox' => $d.'pic/cat_games.gif', // Játékok/Rip/Dox
                 'jtkokps' => $d.'pic/cat_games_ps2.gif', // Játékok/PS
                 'jtkokxbox360' => $d.'pic/cat_games_xbox.gif', // Játékok/Xbox360
                 'jtkokwii' => $d.'pic/cat_wii.gif', // Játékok/Wii
                 'programokiso' => $d.'pic/cat_apps.gif', // Programok/ISO
                 'programokegyb' => $d.'pic/cat_apps.gif', // Programok/egyéb
                 'klipek' => $d.'pic/cat_clips.gif', // Klipek
                 'xxx' => $d.'pic/cat_xxx.gif', // XXX
                 'unknown' => 'styles/unknown.gif' // ismeretlen kategória
                );


/* funkciók */
function error($str) {
  if($_GET['bhm'] == 'browse') die('<html style="padding:0;margin:0;"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"/></head><body style="padding:0;margin:0;"><img style="cursor:help;margin:0;" alt="Hiba!" src="styles/fav2.png" title="'.$str.'" /></body></html>');
  else die('<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"/></head><body><h3 style="color: red;">'.$str.'</h3></body></html>');
}

function mklinkdata($a) {
  foreach($a as $i => $v) {
    $s[] = $i.'='.urlencode($v);
  }
  return implode('&', $s);
}


/* adatok szűrése */
if(is_numeric($_GET['uid']) && strlen($_GET['uid']) <= 32) { $user['uid'] = $_GET['uid']; }
else { error('Hibás azonosító ID. Menj a beállításokhoz.'); }

if(preg_match('/^[A-Za-z0-9]{8,32}$/', strtolower($_GET['bhm_key']))) { $user['bhm_key'] = strtolower($_GET['bhm_key']); }
else { error('Érvénytelen azonosítókulcs. Menj a beállításokhoz.'); }

if($sheets[strtolower($_GET['sheet'])]) {
  $user['sheet'] = $sheets[strtolower($_GET['sheet'])];
  $user['sheet_get'] = strtolower($_GET['sheet']);
}
else { $user['sheet'] = end($sheets); }

if($domains[strtolower($_GET['host'])]) {
  $user['domain'] = $domains[strtolower($_GET['host'])];
  $user['domain_get'] = strtolower($_GET['host']);
}
elseif($_GET['bhm'] == 'home') { error('Ismeretlen domain cím.'); }
else { $user['domain'] = end($domains); }

if($_GET['bhm'] == 'browse' || $_GET['bhm_action'] == 'add' || $_GET['bhm_action'] == 'remove') {
  if(is_numeric($_GET['tid']) && strlen($_GET['tid']) <= 16) { $torrent['tid'] = $_GET['tid']; }
  else { error('Érvénytelen torrent ID.'); }

  if($cats[strtolower($_GET['cat'])]) { $torrent['cat'] = strtolower($_GET['cat']); }
  else { $torrent['cat'] = 'unknown'; }


  // dátum
  if(substr($_GET['date'], 0, 1) == 'u' && substr($_GET['date'], 5, 1) == 'u') { // u0522u1028font
    $torrent['date'] = date('Y').substr($_GET['date'], 1, 4).substr($_GET['date'], 6, 4).'00';
  }
  elseif(substr($_GET['date'], 0, 2) == 'ma') { // ma0209
    $torrent['date'] = date('Ymd').substr($_GET['date'], 2, 4).'00';
  }
  elseif(substr($_GET['date'], 0, 6) == 'tegnap') { // tegnap2350
    $torrent['date'] = date('YmdHis', (mktime(substr($_GET['date'], 6, 2), substr($_GET['date'], 8, 2), 0) - (60 * 60 * 24)));
  }
  elseif(is_numeric(substr($_GET['date'], 0, 14))) { // 20071125212750
    $torrent['date'] = substr($_GET['date'], 0, 14);
  }
  elseif(is_numeric(substr($_GET['date'], 0, 12))) { // 200711252127fo
    $torrent['date'] = substr($_GET['date'], 0, 12).'00';
  }
  else {
    $torrent['date'] = '00000000000000';
  }


  if(is_numeric(substr($_GET['size'], 0, -2)) && preg_match('/^(kb|mb|gb|tb)$/i', substr($_GET['size'], -2)) && strlen($_GET['size']) <= 16) { $torrent['size'] = $_GET['size']; }
  else { $torrent['size'] = '0.00kB'; }

  if(strip_tags($_GET['title']) != '') { $torrent['title'] = (strlen(strip_tags($_GET['title'])) >= 64) ? substr(strip_tags($_GET['title']), 0, 60).'...' : strip_tags($_GET['title']); }
  else { $torrent['title'] = 'id-'.$torrent['tid']; }
}


/* adatbázis betöltése */
$user['bhm'] = false;
if(is_file($user['uid'].'_'.$user['bhm_key'].'.txt')) {
  if($use_session == true) {
    session_start();
  }

  if($use_session == true && $_SESSION['uid'] == $user['uid'] && $_SESSION['bhm_key'] == $user['bhm_key']) {
    $user['bhm'] = $_SESSION['bhm'];
  }
  else {
    $user['bhm'] = unserialize(file_get_contents('./'.$user['uid'].'_'.$user['bhm_key'].'.txt'));

    if($use_session == true) {
      $_SESSION['uid'] = $user['uid'];
      $_SESSION['bhm_key'] = $user['bhm_key'];
      $_SESSION['bhm'] = $user['bhm'];
    }
  }
}
else {
  $dir = scandir('.');
  $db = Array();
  foreach($dir as $row) {
    if(is_file($row)) {
      $ext = end(explode('.', $row));
      if($ext == 'txt') {
        $row = explode('_', $row);
        if(count($row) == 2 && is_numeric($row[0])) {
          $db[$row[0]] = $row[1];
        }
      }
    }
  }

  if($db[$user['uid']] != '' && $db[$user['uid']] != $user['bhm_key']) {
    error('Hibás azonosítókulcs. Menj a beállításokhoz.');
  }
  elseif($_GET['bhm'] == 'home') { // első alkalom
    if($free_reg != true) {
      error('Csak a tulajdonos hozhat létre felhasználókat ebben a könyvjelző adatbázisban.');
    }

    $user['bhm'] = Array();
    $file = './'.$user['uid'].'_'.$user['bhm_key'].'.txt';
    @touch($file);
    @chmod($file, 0777);
    file_put_contents($file, serialize($user['bhm']));
    $user['msg'] = 'Gratulálok, sikeresen beállítottad a bHookMarks szkriptet.'."\n\r"
                  .' [*] Könyvjelzö adatbázis: [b]http://'.$_SERVER['SERVER_NAME'].$_SERVER['PHP_SELF'].'[/b]'."\n\r"
                  .' [*] Azonosító kulcsod: [b]'.$user['bhm_key'].'[/b]'."\n\r\n\r"
                  .'Az azonosító kulcsot mentsd el (pl.: ne töröld ezt az üzenetet), őrizd meg és [u]soha ne add ki senkinek[/u]. A bHookMarks használatához mindig erre a kulcsra lesz szükséged.'."\n\r"
                  .'Ha még nem tetted meg, kérlek olvasd el a szkriptel kapcsolatos tudnivalókat a bHookMarks Beállítások oldalán.';
  }
  else {
    error('Regisztrálnod kell a bHookMarks beállításokban.');
  }
}


/* felhasználó könyvjelzői */
if($_GET['bhm_action'] == 'add' && !$user['bhm'][$torrent['tid']]) {
  $user['bhm'][$torrent['tid']]['cat'] = $torrent['cat'];
  $user['bhm'][$torrent['tid']]['date'] = $torrent['date'];
  $user['bhm'][$torrent['tid']]['size'] = $torrent['size'];
  $user['bhm'][$torrent['tid']]['title'] = strip_tags(urldecode($torrent['title']));

  file_put_contents('./'.$user['uid'].'_'.$user['bhm_key'].'.txt', serialize($user['bhm']));

  if($use_session == true && $_SESSION['uid'] == $user['uid'] && $_SESSION['bhm_key'] == $user['bhm_key']) {
    $_SESSION['bhm'] = $user['bhm'];
  }
}
elseif($_GET['bhm_action'] == 'remove' && $user['bhm'][$torrent['tid']]) {
  unset($user['bhm'][$torrent['tid']]);

  file_put_contents('./'.$user['uid'].'_'.$user['bhm_key'].'.txt', serialize($user['bhm']));

  if($use_session == true && $_SESSION['uid'] == $user['uid'] && $_SESSION['bhm_key'] == $user['bhm_key']) {
    $_SESSION['bhm'] = $user['bhm'];
  }
}
elseif($_GET['bhm_action'] == 'change_key' && $_GET['bhm_new_key'] != '' && strtolower($_GET['bhm_new_key']) != $user['bhm_key']) {
  if($change_key == true) {
    if(preg_match('/^[A-Za-z0-9]{8,32}$/', strtolower($_GET['bhm_new_key']))) {
      rename($user['uid'].'_'.$user['bhm_key'].'.txt', $user['uid'].'_'.strtolower($_GET['bhm_new_key']).'.txt');
      $user['bhm_key'] = strtolower($_GET['bhm_new_key']);
      $user['msg'] = 'Az új azonosító kulcsod beállítva.'."\n\r"
                    .' [*] Könyvjelzö adatbázis: [b]http://'.$_SERVER['SERVER_NAME'].$_SERVER['PHP_SELF'].'[/b]'."\n\r"
                    .' [*] Azonosító kulcsod: [b]'.$user['bhm_key'].'[/b]'."\n\r\n\r"
                    .'Az azonosító kulcsot mentsd el (pl.: ne töröld ezt az üzenetet), örizd meg és [u]soha ne add ki senkinek[/u]. A bHookMarks használatához mindig erre a kulcsra lesz szükséged.';
    }
    else { error('Érvénytelen új azonosítókulcs.'); }
  }
  else { $user['msg'] = 'Ennél a könyvjelzö adatbázisnál ([b]http://'.$_SERVER['SERVER_NAME'].$_SERVER['PHP_SELF'].'[/b]) nem engedélyezett az azonosító kulcs cseréje.'; }
}


/* kimenet */
if($_GET['bhm'] == 'home') {
  echo '<html><head><link type="text/css" href="'.$user['sheet'].'" rel="stylesheet"/><meta http-equiv="Content-Type" content="text/html; charset=utf-8"/></head><body>';

  if(is_file('_news.txt')) { echo '<h3 style="padding: 5px; border: 1px red dashed;">'.nl2br(file_get_contents('./_news.txt')).'</h3>'; }

  echo '<table width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td align="center">'
      .'<table class="main" id="torrenttable" width="100%" border="1" cellspacing="0" cellpadding="5">'
      .'<tr><td class="colhead" align="center" width="32"><span>Típus</span></td>'
      .'<td class="colhead" align="left" width="80%"><span>Név</span></td>'
      .'<td class="colhead" align="center"><span>Hozzáadva</span></td>'
      .'<td class="colhead" align="center"><span>Méret</span></td>'
      .'<td class="colhead" align="center"><span>Kedvenc</span></td></tr>';

  $user['bhm'] = array_reverse($user['bhm'], true); // legutóbb hozzáadott legfelülre
  foreach($user['bhm'] as $i => $t) {
    $date = str_split($t['date'], 2);
    $time = $date[4].':'.$date[5].':'.$date[6];
    $date = $date[0].$date[1].'-'.$date[2].'-'.$date[3];

    $link = '?bhm=home&bhm_action=remove&uid='.$user['uid'].'&bhm_key='.$user['bhm_key'].'&tid='.$i.'&sheet='.$user['sheet_get'].'&host='.$user['domain_get'];

    echo '<tr><td align="center" class="cati" width="32" style="padding: 0px"><img border="0" src="'.$cats[$t['cat']].'" alt="'.$t['cat'].'" /></td>'
        .'<td align="left" width="80%"><a target="_parent" href="'.$user['domain'].'details.php?id='.$i.'&amp;hit=1"><b>'.htmlspecialchars($t['title']).'</b></a></td>'
        .'<td align="center"><nobr>'.$date.'<br>'.$time.'</nobr></td>'
        .'<td align="center">'.substr($t['size'], 0, -2).'<br>'.substr($t['size'], -2).'</td>'
        .'<td align="center"><a href="'.$link.'"><img style="cursor:pointer;margin:0;border:0;" alt="Hiba!" src="styles/fav1.png" title="Eltávolítás könyvjelzőkből!"'
        .'onmouseout="this.src=\'styles/fav1.png\';" onmouseover="this.src=\'styles/fav0.png\';" /></a></td></tr>';
  }

  echo '</table>'
      .'</td></tr></table>';

  // üzenet küldés
  if($user['msg'] != '' && $send_pm == true) { echo '<iframe src="?bhm=msg&uid='.$user['uid'].'&bhm_key='.$user['bhm_key'].'&host='.$user['domain_get'].'&msg='.urlencode(utf8_decode($user['msg'])).'" style="border:0;" width="0" height="0" border="0" frameborder="0"></iframe>'; }

  echo '</body></html>';
}
elseif($_GET['bhm'] == 'browse') {
  echo '<html style="padding:0;margin:0;"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"/></head><body style="height:32px;padding:0;margin:0;background:url(styles/fav2.png) no-repeat top left;" title="Betöltés...">';

  if($user['bhm'][$torrent['tid']]) { // eltávolít
    $link = '?bhm=browse&bhm_action=remove&uid='.$user['uid'].'&bhm_key='.$user['bhm_key'].'&tid='.$torrent['tid'].'&'.mklinkdata($torrent);
    echo '<a href="'.$link.'">'
        .'<img style="cursor:pointer;margin:0;border:0;" alt="Hiba!" src="styles/fav1.png" title="Eltávolítás a könyvjelzőkből!"'
        .'onmouseout="this.src=\'styles/fav1.png\';" onmouseover="this.src=\'styles/fav0.png\';" />'
        .'</a>';
  }
  else { // hozzáad
    $link = '?bhm=browse&bhm_action=add&uid='.$user['uid'].'&bhm_key='.$user['bhm_key'].'&'.mklinkdata($torrent);
    echo '<a href="'.$link.'">'
        .'<img style="cursor:pointer;margin:0;border:0;" alt="Hiba!" src="styles/fav0.png" title="Hozzáadás a könyvjelzőkhöz!"'
        .'onmouseout="this.src=\'styles/fav0.png\';" onmouseover="this.src=\'styles/fav1.png\';" />'
        .'</a>';
  }

  echo '</body></html>';
}
elseif($_GET['bhm'] != 'msg' && $_GET['bhm'] != 'deleted') {
  error('Ismeretlen bHookMarks oldal.');
}


/* üzenet küldés */
if($_GET['bhm'] == 'msg' && $send_pm == true) {
  echo '<html><head><meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1"/></head><body>';

  echo '<form id="bhm_msg_form" name="form" method="post" action="'.$user['domain'].'takemessage.php">'
      .'<textarea name="msg">'.htmlspecialchars(strip_tags(urldecode($_GET['msg']))).'</textarea>'
      .'<input type="hidden" name="receiver" value="'.$user['uid'].'" />'
      .'<input type="hidden" value="'.$user['domain'].'ircinvite.php" name="returnto" />' // valami olyan oldalra dobjunk mindenkit a frame-ben ami gyorsan betöltődik
      .'<input type="hidden" value="" name="gm"/>'
      .'<input type="submit" value="k" />'
      .'</form>'
      .'<script>document.getElementById(\'bhm_msg_form\').submit();</script>'; // ha nincs javascript, vége a mókának

  echo '</body></html>';
}


/* "Az időm hadd menjen. Lábbal tolom odébb,
    Ha rám akad némi; Időhordalék..." */
?>