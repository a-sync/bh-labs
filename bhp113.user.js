// ==UserScript==
// @name bitHUmen Plus
// @author Vector 
// @version 1.1.3
// @description bitHUmen stíluslap mod (Opera, GreaseMonkey)
// @namespace http://www.w3.org/1999/xhtml
// @include http://bithumen.*
// @include http://www.bithumen.*
// ==/UserScript==

/*** BEÁLLÍTÁSOK LENT! ***/

/*** VÉGREHAJTÓ ***/
var t = (typeof GM_addStyle != 'undefined') ? 1 : 0;
function kell(css)
{
	if(css)
	{
		if(t == 1) GM_addStyle(css);// GreaseMonkey esetén 
		else // önálló
		{
      var head = document.getElementsByTagName('head')[0];
      if (!head) { return; }
      var style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = css;
      head.appendChild(style);
		}
	}
}

/*** CSS PARANCSOK ***/
/* FONTOS: Ebben a szekcióban csak akkor módosíts
 * bármit is, ha tudod mit csinálsz!
 */

var css1 = 'img[src="pic/logo.gif"] { width: 0 !important; opacity: 1 !important; } #logoholderdiv { background-color: transparent !important; background-image: url("http://vector.extra.hu/vec/bh_logo_eperfagyi.png") !important; width: 925px !important; height: 117px !important; margin-bottom: 5px !important; margin-top: 0px !important; } #logoholderdiv img { visibility: visible; }';

var css2 = '#logo { display: none !important; }';

var css3 = "textarea { width: 600px !important; height: 300px !important; }";

var css4 = '.unlockednew { width: 24px !important; height: 24px !important; padding-left: 0 !important; background-image: none !important; opacity: 1 !important; }';

var css5 = '.unlocked { width: 24px !important; height: 24px !important; padding-left: 0 !important; background-image: none !important; opacity: 1 !important; }';

var css6 = '.unlockednew { width: 0 !important; height: 24px !important; padding-left: 24px !important; background-image: url("data:image/gif;base64,R0lGODlhGAAYAIAAAP///wAAACH5BAEAAAEALAAAAAAYABgAAAJMhI+py+3fglwymKpwnkAj/3HgVZWk1XEhqrXq4bLlmMr2ud01nsQ8PfPtIMRV8PgqQo61ialniUpDnU3VaXJapy8t9CrFeJXksnlRAAA7") !important; background-position: center center !important; background-repeat: no-repeat !important; opacity: 0.6 !important; }';

var css7 = '.unlocked { width: 0 !important; height: 24px !important; padding-left: 24px !important; background-image: url("data:image/gif;base64,R0lGODlhGAAYAIAAAP///wAAACH5BAEAAAEALAAAAAAYABgAAAJUhI+pGO0PYzCySjoxPI3nrj3eCIBlRJ7Yoq6uCWdtG6cJWLszLuf71wumeCwfz4IEspa0JFLHuDGUpapVVCVmKdIsdfIJcbVgbtQbcqJO6gvzfSgAADs=") !important; background-position: center center !important; background-repeat: no-repeat !important; opacity: 0.6 !important; }';

var css8 = "img[src*='pic/'] { opacity: 0.7 !important; }";

var css9 = '#torrenttable>tbody>tr>td[align="right"], #torrenttable>tbody>tr>td:last-child { display: none !important; }';

var css10 = '#torrenttable>tbody>tr { height: 36px !important; } #torrenttable>tbody>tr>td { height: 36px !important; } .colhead, #torrenttable>tbody>tr:first-child>td, #torrenttable>tbody>tr:first-child { height: 10px !important; } #torrenttable>tbody>tr>td[align="left"] { padding: 0 5px !important; } #torrenttable>tbody>tr>td[width="32"] { width: 36px !important; padding: 0 !important; } .cati img { height: 36px !important; width: 36px !important; } .cati { padding: 0 !important; text-align: left !important; }';

var css11 = 'body { padding-top: 20px !important; } #statusouter, #status { width: 100% !important; height: 20px !important; position: absolute !important; top: 0 !important; left: 0 !important; z-index: 314 !important; margin: 0 auto !important; padding: 0 !important; vertical-align: top !important; border-bottom: 3px double #020202 !important; } #statusouter { height: 45px !important; } #menu { position: absolute !important; top: 15px !important; left: 0 !important; height: 30px !important; width: 100% !important; z-index: 315 !important; background-color: transparent !important; background-image: none !important; } #logo { display: none !important; }';

var css11_1 = '#menu, #statusouter, #status { position: fixed !important; }';

var css12 = '#torrenttable>tbody>tr:hover>td[align="left"] { background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAgCAMAAAAynjhNAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAwBQTFRFTbUcRqoUydLBQqYQQaUPULIaVr0iSbEXWYY2bYtTRKgS//38VK0dx9G+eZ9f3eTWOZwEydC8VpgpTLUaj6l5YsYxT7kb9fXvULQeV7slXL0oR7AT/f/+/vz/P4kQVLke4eXZNZwEcKNKdpFeRZsW/f/8/f77ULQcdZZdTbYXZMsvSKwUXsQrb6JJPZ4LUbMdTbMdSLITVYgxQZgSOp8HULccS38lUrYgVLgi///9///8VbkjOp4IPaELS68ZP6MNWr4oPKAKSa0X4OHXTrIcPpcJTbEbVbkkXMAqXcEr/v78X8Mt/v/7///79vfz/f/5XMAp/v/6/v///v/8/v/9//78Urke//7+///6U4YwUbMe//7/W78qWb4lPokSQ6gQU7ocTYMpydO9PoYTWcskdZlg9PbwcaNML5wAxtS9V8IdNpkC/v79j6h7TbMe4+3dMpoERa8QVrUekqZ7fZtnOpsIV74kXcIqV7IffZxjULAcP54WZ8wwTaAZWKwo4uLeWr4hadA0bNA1XcEtQqwNXcUpU7YgYMUpPokRPpUKb5FYSrAc/fv6UbYeV64glquCYJVASrQVPYcPVrkkUrkhV7smULomzNbFU7wi2ePUU7YeWcIiWcEnWMUkTZ8cXsUnWnU0RJsQRZwRRp0UUpYnWJcoSLIaYckqYMguZc4tVLgj8fLs8/buTbAcQaMP+fj4SrQfT7Qf4eja1t7N5ejc5ufeN5kER6Eax9G7O5wFe5tgPq0Nf5ljUIMsfJ5m+PbzWoQ86uvkXMIpqr+bPaIKSasXVoIzrrmgU4Aw+/j2V4M0UK4aU7Ic3+PYSq4WOZkEP6QMU7MfU7ciZMgyZs80/v/+iKNyP5ERQpkPS6AcX5M6SKYY//79WK0iXsYhRJ4YRKYSWbsmV5kqV5orb6ZMaNAxXs4rKm0ANXYHP6ANQYUX3+HXW8MpZMczX8EuQasLcpRXRa4PX8YrUbofS7QYVLof4efZQJ8J2t3ST7IaU7cgi6d1YcUvQ48V///+////oWyHyQAAAAN0Uk5T//8A18oNQQAAAXtJREFUeNpiYEIFyqhcBlRu6nN80pULr+OR1lC5F4dbmnNeWZgcTumS6tkGX3FK8xnPNd2IU5pzceuvNv1pydilNbbPd7cwj5pSeytdV1dXCQyeTIBJ71JJYZtsYS7BKmUtZios/OULO7u0k+HOaxDpD8bLYx8CdUv87GbX5opnuXDExEQgO+N8Lli666ZWjIOkNVDaxc3OiZGLmcXe1tFGQNFVBCS95/6zcg+c0rturNR5F4BLWnlR4x9vT1y6991+elkUt/SBoqa3eKSZTkhcEdU5hNvlkWdqdHDrZmI6dVerOQC3NNPeiytghq/FIs2UeOZTLBswUNU3LDt3lOsBy7qXenql2wo6i6FRwtHXPhUUY8KfE8Q0NScaShd+bHm/+/tvWIQeq3jjvspcf1bdEiGhR0JgsPTxK0RyMGOdc8mU4eskXInJ6HRD78avHTiTIgdPWZ487pTKZFY1IwxPOmeKPJ3VgS8TcVT8xZsFjV7glWZagMoFCDAA4MKgkymgN/cAAAAASUVORK5CYII=") !important; background-position: center right; background-repeat: no-repeat !important; } #torrenttable>tbody>tr:hover>td.colhead[align="left"] { background-image: none !important; }';

var css13 = '#lsForm { height: 15px !important; border: 1px dashed royalblue !important; } #lsForm table#bottom { display: none !important; } #lsForm:hover { height: auto !important; padding-top: 0 !important; border: none !important; } #lsForm:hover table#bottom { display: table !important; } #lsForm:before { content: "Kategóriák / Keresés" !important; }';

var css14 = '.navigation { padding: 0 !important; } .navigation>a { margin: 5px !important; }';

var css14_1 = '.navigation>a[href="/invite.php"] { display: none !important; }';

var css14_2 = '.navigation>a[href="/rules.php"] { display: none !important; }';

var css14_3 = '.navigation>a[href="/faq.php"] { display: none !important; }';

var css14_4 = '.navigation>a[href="/dvdgame.php"] { display: none !important; }';

var css14_5 = '.navigation>a[href="/contact.php"] { display: none !important; }';

var css14_6 = '.navigation>a[href="/ircinvite.php"] { display: none !important; }';

var css14_7 = '.navigation>a[href="/log.php"], .navigation>a[href="/publog.php"] { display: none !important; }';

var css14_8 = '.navigation>a[href="/links.php"] { display: none !important; }';


/*** BEÁLLÍTÁSOK ***/
/* Minden parancs fölött van leírás arról hogy mit csinál.
 * Ha valami nem kell, ott a 'kell(xy);' elé tegyél dupla
 * perjelet, hogy kikommenteld! Ha valami kell, ne legyen
 * előtte dupla perjel.
 * Ha valamelyik beállítás egy másiknak a kiegészítése,
 * oda van írva, hogy, melyikhez tartozik.
 *
 * Nem minden funkció esztétikus mindegyik bH stílussal!
 */

// (1) eperfagyi féle logo használata
//kell(css1);

// (2) Logo leszedése
//kell(css2);

// (3) Oldal szövegdobozainak nagyobbítása (hozzászólás, pm, stb.)
kell(css3);

// (4) Alap 'Olvasatlan' topik ikon (NightSurferhez)
//kell(css4);

// (5) Alap 'Olvasott' topik ikon (NightSurferhez)
//kell(css5);

// (6) Szürke 'Olvasatlan' topik ikon
//kell(css6);

// (7) Szürke 'Olvasott' topik ikon
//kell(css7);

// (8) Az oldal képei mérsékelten áttetszőek (sötétebb, pasztelesebb színek)
kell(css8);

// (9) Torrentek táblánál csak a Típus, Név, Hozzáadva, Méret, Letöltve oszlopok maradjanak
//kell(css9);

// (10) Torrentek tábla összébb nyomása, ikonok kicsinyítése, tábla összehúzása
kell(css10);

// (11) Logó levétele, státuszsáv legfelülre kerül, menü szorosan alatta
//kell(css11);

// (11.1) Teljes menüszerkezet felülre fixálása (görgetésnél is ottmarad; (10) opcionális kiegészítője)
//kell(css11_1);

// (12) Torrentek táblánál egér főléhúzásra a név oszlop jobboldalán egy nyíl ikon jelenik meg
//kell(css12);

// (13) Kategóriák lista / keresés összecsukása (lenyitható)
//kell(css13);

// (14) Menü linkek eltüntetéséhez korrekció (lejebb pontonként, ez magában nem tüntet el semmit csak kiegyenlíti a helyközöket)
kell(css14);

// (14.1) Meghívó link eltüntetése
//kell(css14_1);

// (14.2) Szabályok link eltüntetése
//kell(css14_2);

// (14.3) GYIK link eltüntetése
//kell(css14_3);

// (14.4) Nyereményjáték link eltüntetése
//kell(css14_4);

// (14.5) Kontakt link eltüntetése
//kell(css14_5);

// (14.6) Chat link eltüntetése
//kell(css14_6);

// (14.7) Log link eltüntetése
//kell(css14_7);

// (14.8) Linkek link eltüntetése
//kell(css14_8);



/** Hála és köszönet ropi21-nek a segítségért,
 ötletekért és a tesztelésért Operán **/
/*** 2009.07.27 ***/