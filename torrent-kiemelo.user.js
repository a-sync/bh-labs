// ==UserScript==
// @name          Torrent kiemelő
// @version       0.1.0
// @description   Kiemeli a megadott névvel, letöltöltésszámmal, vagy seederszámmal rendelkező torrenteket a kiválasztott háttérszínekkel.
// @namespace     bH
// @author        Vector
// @include       http://bithumen.be/browse.php*
// @include       https://bithumen.be/browse.php*
// @include       http://bithumen.ru/browse.php*
// @include       https://bithumen.ru/browse.php*
// @grant         none
// ==/UserScript==
(function() {
// ha valamelyik kiemelést nem akarod érvényesíteni, hagyd üresen a színét

// min. letöltés
var mindls      = 500;
var mindlsszin  = 'powderblue'; // #8080ee

// min. seeder (nem számolva a nem valós leechereket)
var minseed     = 50;
var minseedszin = 'salmon'; // #ee8080

// kiemeltek
var kiemeltszin = 'grey'; // #cccccc
var kiemeltek   = /mwt|1080p.bluray|the.vampire.diaries|dexter|misfits|alcatraz|south.park|banshee|homeland|the.cleveland.show|family.guy|boardawalk.empire|sherlock|game.of.thrones|true.blood|amerikai.fater|ppb|helix|intelligence|modern.family/i;

/* ################################################## */
var tttr = document.getElementById('torrenttable').getElementsByTagName('tr');
for(var i = 1; i < tttr.length; i++)
{
  var szin = '';

  var tttrtd = tttr[i].getElementsByTagName('td');

  var seed = tttrtd[7].innerText ||  tttrtd[7].textContent;
  var dls = tttrtd[6].innerText ||  tttrtd[6].textContent;
  
  if(tttr[i].getElementsByTagName('a')[1].textContent.match(kiemeltek) && kiemeltszin != '') // kiemeletek
  {
    szin = kiemeltszin;
  }
  else if(seed >= minseed && minseedszin != '') 
  {
    szin = minseedszin;
  }
  else if(dls >= mindls && mindlsszin != '') 
  {
    szin = mindlsszin;
  }
  
  if(szin != '')
  {
    for(var j = 0;j < tttrtd.length; j++) tttrtd[j].style.backgroundColor = szin;
  }
}

})();