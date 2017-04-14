// ==UserScript==
// @name           Komment Addon
// @version        0.3.5
// @author         Vector
// @namespace      bH
// @include        http://bithumen.be/forums.php?action=reply&topicid=*
// @include        https://bithumen.be/forums.php?action=reply&topicid=*
// @include        http://bithumen.ru/forums.php?action=reply&topicid=*
// @include        https://bithumen.ru/forums.php?action=reply&topicid=*
// @include        http://bithumen.be/forums.php?action=shortquotepost&topicid=*
// @include        https://bithumen.be/forums.php?action=shortquotepost&topicid=*
// @include        http://bithumen.ru/forums.php?action=shortquotepost&topicid=*
// @include        https://bithumen.ru/forums.php?action=shortquotepost&topicid=*
// @include        http://bithumen.be/forums.php?action=quotepost&topicid=*
// @include        https://bithumen.be/forums.php?action=quotepost&topicid=*
// @include        http://bithumen.ru/forums.php?action=quotepost&topicid=*
// @include        https://bithumen.ru/forums.php?action=quotepost&topicid=*
// @include        http://bithumen.be/forums.php?action=editpost&postid=*
// @include        https://bithumen.be/forums.php?action=editpost&postid=*
// @include        http://bithumen.ru/forums.php?action=editpost&postid=*
// @include        https://bithumen.ru/forums.php?action=editpost&postid=*
// @include        http://bithumen.be/comment.php?action=add&tid=*
// @include        https://bithumen.be/comment.php?action=add&tid=*
// @include        http://bithumen.ru/comment.php?action=add&tid=*
// @include        https://bithumen.ru/comment.php?action=add&tid=*
// @include        http://bithumen.be/comment.php?action=add&from=quote&cid=*
// @include        https://bithumen.be/comment.php?action=add&from=quote&cid=*
// @include        http://bithumen.ru/comment.php?action=add&from=quote&cid=*
// @include        https://bithumen.ru/comment.php?action=add&from=quote&cid=*
// @include        http://bithumen.be/comment.php?action=edit&cid=*
// @include        https://bithumen.be/comment.php?action=edit&cid=*
// @include        http://bithumen.ru/comment.php?action=edit&cid=*
// @include        https://bithumen.ru/comment.php?action=edit&cid=*
// @include        http://bithumen.be/sendmessage.php?receiver=*
// @include        https://bithumen.be/sendmessage.php?receiver=*
// @include        http://bithumen.ru/sendmessage.php?receiver=*
// @include        https://bithumen.ru/sendmessage.php?receiver=*
// ==/UserScript==
(function() {
// ##########
// Beállítások
// ##########
var alap_idezet = 2; // idézet megjelenési módja; 0 = sima, 1 = idézet linkel, 2 = válasz linkel, 3 = idézet ...
var idezett_link_topikban = true; // az idézett postra mutató link a topikon belül mutassa a hsz.-t
// ##########

// TODO -> 0.4.0
//  hsz. gomb lenyit egy hsz. dobozt új oldal helyett
//  plussz jelek (+) elvesznek előnézetnél
//  idézetes program részt "ki kell írtani"
//  *css igazítás

var dbg = false; // DEBUG
var szoveg_helyettesito = '$$';
var gomb_inaktiv = 'gray'; // gray, blue, green, orange, yellow
var gomb_aktiv = 'yellow'; // gray, blue, green, orange, yellow
var alap_parancsok = 'Félkövér:[b]#[/b]|Dőlt:[i]#[/i]|Aláhúzás:[u]#[/u]|URL:[url]#[/url]|Kép:[img]#[/img]|Idézés:[quote]#[/quote]|Kód:[pre]#[/pre]|Spoiler:[spoiler]#[/spoiler]';
var alap_ikonok = ':-) |:-D |:smile: |:-P |:-/ |:-( ';
var bh_ikonok = [[':-)','smile1'],[':)','smile1'],[':-D','grin'],[':D','grin'],[':-P','tongue'],[':P','tongue'],[';-)','wink'],[';)','wink'],[':-|','noexpression'],[':|','noexpression'],[':-/','confused'],[':-(','sad'],[':(','sad'],[':-O','ohmy'],[':o)','clown'],['8-)','cool1'],['|-)','sleeping'],[":'-(",'cry'],[":'(",'cry'],[':smile:','smile2'],[':lol:','laugh'],[':cool:','cool2'],[':?:','question'],[':!:','excl'],[':banana:','bananadance'],[':banana2:','bananadance2'],[':phead:','propellerhead'],[':arque:','argue'],[':ilovefirefox:','firefox8yb'],[':iloveopera:','opera8yb'],'weep','wink','w00t','whistle','unsure','closedeyes','fun','thumbsup','thumbsdown','blush','yes','no','love','idea','arrow','arrow2','hmm','hmmm','huh','geek','look','rolleyes','kiss','shifty','blink','smartass','sick','crazy','wacko','alien','wizard','wave','wavecry','baby','angry','ras','sly','devil','evil','evilmad','sneaky','axe','slap','wall','rant','jump','yucky','nugget','smart','shutup','shutup2','crockett','zorro','snap','beer','beer2','drunk','strongbench','weakbench','dumbells','music','poker','stupid','dots','offtopic','spam','oops','lttd','please','sorry','hi','yay','cake','hbd','band','punk','rofl','bounce','mbounce','thankyou','gathering','hang','chop','rip','whip','judge','chair','tease','box','boxing','guns','shoot','shoot2','flowers','wub','lovers','kissing','kissing2','console','group','hump','hooray','happy2','clap','clap2','weirdo','yawn','bow','dawgie','cylon','book','fish','mama','pepsi','medieval','rambo','ninja','hannibal','party','snorkle','evo','king','chef','mario','pope','fez','cap','cowboy','pirate','pirate2','rock','cigar','icecream','oldtimer','trampoline','smurf','yikes','osama','saddam','santa','indian','pimp','nuke','jacko','ike','greedy','super','wolverine','spidey','spider','bandana','construction','sheep','police','detective','bike','fishing','clover','horse','shit','soldiers','brownie','cake2','catfight','coffee','confused','cookies','dog','fist','handshake','harp','huhsign','ninjafist','ninjajig','partytime','pizza','rant2','rungun','smirk','sniper','stretcher','thumbup','w000t','wag','wbounce','zzz','beta','blowup','bump','busted','censored','censored2','dense','fighting','hurt','iron','irule','kewlpics','pile','protest','rockon','rtfm','shocking','sick2','smokin','starwars','throw','whacky','winkkiss','wow','yesmaster','fool','drinking','friends','hello','rofl2','secret','cold'];
// ##########


// ##########
// Komment addon
// ##########
var loc = document.location.pathname.split('?')[0].substr(1).toLowerCase();
var domain = document.domain;
var msg_form = false;
var ta = false;
var parancs_gombok = false;
var ikon_gombok = false;
var input_submit = false;
function komment_addon()
{
  if(dbg)console.log('dbg: '+navigator.userAgent+'\n\n');
  if(!msg_form) msg_form = document.getElementsByTagName('form')[0];
  if(!ta) ta = msg_form.getElementsByTagName('textarea')[0];
  if(!input_submit)
  {
    input_submit = msg_form.getElementsByTagName('input');
    for(var i = input_submit.length-1; i >= 0; i--)
    {
      if(input_submit[i].type == 'submit')
      {
        input_submit = input_submit[i];
        break;
      }
    }
  }
  if(!msg_form || !ta || !input_submit) return false;
  
  get_variables();
  
  if(loc == 'sendmessage.php')
  {
    ta.parentNode.removeAttribute('colspan');
    
    var ikonok_doboz = document.createElement('TD');
    ikonok_doboz.setAttribute('align', 'center');
    ikonok_doboz.setAttribute('width', '70');
    ikonok_doboz.innerHTML = '';
    ta.parentNode.parentNode.insertBefore(ikonok_doboz, ta.parentNode);
    
    var parancsok_doboz = document.createElement('TD');
    parancsok_doboz.setAttribute('align', 'center');
    parancsok_doboz.setAttribute('width', '80');
    parancsok_doboz.innerHTML = '';
    ta.parentNode.parentNode.appendChild(parancsok_doboz);
    
    if(_get['replyto'] != '' && !isNaN(_get['replyto']))
    {
      var a = ta.parentNode.parentNode.nextSibling.nextSibling.getElementsByTagName('td');
      a[0].innerHTML += '<br/>'+a[1].innerHTML;
      a[0].setAttribute('colspan', '3');
      a[0].parentNode.removeChild(a[1]);
    }
    else
    {
      ta.parentNode.parentNode.nextSibling.nextSibling.getElementsByTagName('td')[0].setAttribute('colspan', '3');
    }
    var b = ta.parentNode.parentNode.parentNode.getElementsByTagName('td');
    b[b.length-1].setAttribute('colspan', '3');
  }
  
  msg_form.getElementsByTagName('td')[0].innerHTML = '<b></b><br/><br/><a href="smilies.php" target="_blank">Ikonok</a>';
  ikon_gombok = msg_form.getElementsByTagName('td')[0].firstChild;
  
  msg_form.getElementsByTagName('td')[2].innerHTML = '<b></b><br/><br/><a href="tags.php" target="_blank">Parancsok</a>';
  parancs_gombok = msg_form.getElementsByTagName('td')[2].firstChild;
  
  elonezet_init();
  
  idezet_opciok(true, false);
  
  sajat_parancsok();
  
  return true;
}

// ##########
// Saját parancsok
// ##########
var spb = false;
var sib = false;
function sajat_parancsok(e)
{
  if(dbg)console.log('dbg: sajat_parancsok('+e+')');
  if(!msg_form || !input_submit) return false;
  
  if(spb == false || sib == false)
  {
    spb = document.createElement('DIV');
    spb.style.width = ta.offsetWidth+'px';
    if(dbg)console.log('dbg: ta.offsetWidth = '+ta.offsetWidth);
    if(dbg)console.log('dbg: ta.offsetHeight = '+ta.offsetHeight);
    spb.style.display = 'none';
    spb.style.textAlign = 'left';
    //spb.style.marginBottom = '8px';
    
    sib = spb.cloneNode(false);
    spb.setAttribute('id', 'spb');
    sib.setAttribute('id', 'sib');
    
    spb = ta.parentNode.appendChild(spb);
    sib = ta.parentNode.appendChild(sib);
    
    spb.parentNode.setAttribute('valign', 'top');
    
    var error_reset = " onchange=\"if(this.style.color=='red'){this.style.color='';this.setAttribute('title','');}\"";
    
    // ##### SPB ##### //
    var spb_inner = '<br/><table id="spb_lista" cellpadding="1" border="0" align="center">'
                  + '<tr><td border="0" align="center"><input onclick='+error_reset.substr(10)+' id="spb_save" type="button" value="Mentés" /></td>'
                   + '<td border="0" align="right">(<b>'+szoveg_helyettesito+'</b> reprezentálja a kijelölt szöveget)</td>'
                   + '<td border="0"><input id="spb_add" type="button" value="+" /></td></tr>'
                   + '<tr height="8"><td border="0" colspan="3" width="500"></td></tr>'
                  + '<tr><td align="center"><b>Név</b></td><td align="center" colspan="2"><b>Parancs</b></td></tr>';
    
    if(dbg)console.log('dbg: _cookie(spb) '+_cookie('spb'));
    
    if(typeof _cookie('spb') == 'string') alap_parancsok = _cookie('spb');
    if(dbg)console.log('dbg: alap_parancsok = '+alap_parancsok);
    
    var parancslista = mentett_parancsok(alap_parancsok);
    if(dbg)console.log('dbg: parancslista.valueOf() = '+parancslista.valueOf());
    
    for(var i = 0; i < parancslista.length; i++)
    {
      spb_inner += '<tr>'
                + '<td><input'+error_reset+' type="text" style="width: 80px; text-align: right;" value="'+parancslista[i][0].henc()+'"/></td>'
                + '<td><input'+error_reset+' type="text" style="width: 400px;" value="'+unescape(parancslista[i][1].join(szoveg_helyettesito)).henc()+'"/></td>'
                + '<td><input style="font-weight: bold;" onclick="this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);" type="button" value="-" /></td>'
                + '</tr>';
    }
    
    spb.innerHTML = spb_inner+'</table>';
    
    if(spb.offsetHeight < ta.offsetHeight) spb.style.minHeight = (ta.offsetHeight+2)+'px';
    
    // hozzáadás gomb
    eventon('click', function()
    {
      var tr = document.createElement('TR');
      this.parentNode.parentNode.parentNode.appendChild(tr);
      
      tr.innerHTML = ''
      + '<td><input'+error_reset+' type="text" title="" style="width: 80px; text-align: right;" value=""/></td>'
      + '<td><input'+error_reset+' type="text" title="" style="width: 400px;" value="'+szoveg_helyettesito+'"/></td>'
      + '<td><input style="font-weight: bold;" onclick="this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);" type="button" value="-" /></td>'
      + '';
      
    }, document.getElementById('spb_add'));
    
    // mentés gomb
    eventon('click', function()
    {
      var spb_inputs = document.getElementById('spb_lista').getElementsByTagName('input');
      var sp = [];
      if(0 == (spb_inputs.length-2) % 3)
      {
        for(var i = 0; i < (spb_inputs.length-2) / 3; i++)
        {
          var n = spb_inputs[i*3 + 2]; // név
          var c = spb_inputs[i*3 + 3]; // kód
          var d = spb_inputs[i*3 + 4]; // törlés
          
          if(n.value.trim() == '')
          {
            n.style.color = 'red';
            n.setAttribute('title', 'Adj meg valami nevet!');
          }
          if(c.value.trim() == '')
          {
            c.style.color = 'red';
            c.setAttribute('title', 'Adj meg valami szöveget!');
          }
          
          if(n.style.color != 'red' && c.style.color != 'red')
          {
            d.style.color = '';
            var z = c.value.split(szoveg_helyettesito);
            for(var j = 0; j < z.length; j++) z[j] = escape(z[j]);
            sp[sp.length] = escape(n.value.henc())+':'+z.join('#');
          }
          else d.style.color = 'red';
          
          if(dbg)console.log('dbg: '+n.value+' => '+c.value);
        }
      }
      
      var save_size = sp.join('|').length;
      
      if(dbg)console.log('dbg: sp.join(|).length = '+sp.join('|').length);
      if(save_size > 4000)
      {
        this.style.color = 'red';
        this.setAttribute('title', 'A megadott parancsok mentése meghaladja a 4KiB-et. (+'+(save_size-4000)+' bájt)');
      }
      else
      {
        if(sp.length > 0)
        {
          alap_parancsok = sp.join('|');
          this.setAttribute('title', 'Mentve: '+(save_size/1000).toFixed(3)+'KiB / 4KiB');
        }
        else alap_parancsok = '';
        
        set_cookie('spb', alap_parancsok);
        sajat_parancsok_megjelenites();
      }
    }, document.getElementById('spb_save'));
    // TODO: reset gomb
    
    // ##### SIB ##### //
    var sib_inner = '<br/><table id="sib_lista" cellpadding="1" border="0" align="center">'
                  + '<tr><td border="0" align="center"><input onclick='+error_reset.substr(10)+' id="sib_save" type="button" value="Mentés" /></td>'
                      + '<td border="0" colspan="2" align="right"><span title="szóközök lehetnek mellette">(ikon parancs, vagy kép url)</span> <input id="sib_add" type="button" value="+" /></td></tr>'
                  
                  + '<tr height="8"><td border="0" colspan="3" width="500"></td></tr>'
                  
                  + '<tr><td align="center"><b>Ikon</b></td>'
                      + '<td align="center" colspan="2"><b>Parancs</b></td></tr>';
    
    if(dbg)console.log('dbg: _cookie(sib) '+_cookie('sib'));
    
    if(typeof _cookie('sib') == 'string') alap_ikonok = _cookie('sib');
    if(dbg)console.log('dbg: alap_ikonok = '+alap_ikonok);
    
    var ikonlista = mentett_ikonok(alap_ikonok);
    if(dbg)console.log('dbg: ikonlista.valueOf() = '+ikonlista.valueOf());
    
    //document.styleSheets[0].insertRule('#sib #sib_lista tr td:first-child:hover img { max-height: none; max-width: none; }', style.cssRules.length);
    var ikon_hover = " onmouseover=\"this.i=this.parentNode.parentNode.getElementsByTagName('img')[0];this.i.style.zIndex='42';this.i.style.maxWidth='none';this.i.style.maxHeight='none';this.i.style.position='absolute';\" "
                     +" onmouseout=\"this.i.style.maxWidth='42px';this.i.style.maxHeight='25px';this.i.style.position='static';this.i.style.zIndex='33';\"";
    for(var i = 0; i < ikonlista.length; i++)
    {
      sib_inner += '<tr>'
                + '<td align="center" height="27"><img alt=" " style="max-width: 42px; max-height: 25px;" src="'+ikonlista[i][1].henc()+'"/></td>'
                + '<td><input'+error_reset+' type="text" style="width: 432px;" value="'+ikonlista[i][0].henc()+'" '+ikon_hover+'/></td>'
                + '<td><input style="font-weight: bold;" onclick="this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);" type="button" value="-" /></td>'
                + '</tr>';
    }
    
    sib.innerHTML = sib_inner+'</table>';
    
    if(sib.offsetHeight < ta.offsetHeight) sib.style.minHeight = (ta.offsetHeight+2)+'px';
    
    // hozzáadás gomb
    eventon('click', function()
    {
      var tr = document.createElement('TR');
      this.parentNode.parentNode.parentNode.appendChild(tr);
      
      tr.innerHTML = ''
      + '<td align="center" height="27"><img alt=" " style="max-width: 42px; max-height: 25px;" src="http://'+domain+'/media/img/null.png"/></td>'
      + '<td><input'+error_reset+' type="text" style="width: 432px;" value="" '+ikon_hover+'/></td>'
      + '<td><input style="font-weight: bold;" onclick="this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);" type="button" value="-" /></td>'
      + '';
      
    }, document.getElementById('sib_add'));
    
    // mentés gomb
    eventon('click', function()
    {
      var sib_inputs = document.getElementById('sib_lista').getElementsByTagName('input');
      var si = [];
      if(0 == (sib_inputs.length-2) % 2)
      {
        for(var i = 0; i < (sib_inputs.length-2) / 2; i++)
        {
          var n = sib_inputs[i*2 + 2]; // parancs
          var d = sib_inputs[i*2 + 3]; // törlés
          var k = n.parentNode.parentNode.firstChild.firstChild; // kép
          var c = n.value.trim();
          var j = bh_ikonok_kereses(c);
          
          if(c == '' || (c.indexOf('http://') != 0 && j == false))
          {
            n.style.color = 'red';
            n.setAttribute('title', 'Adj meg egy ikon parancsot vagy kép URL-t!');
            k.setAttribute('src', 'http://'+domain+'/media/img/null.png');
          }
          
          if(n.style.color != 'red')
          {
            d.style.color = '';
            
            // TODO: preload
            if(j == false)
            {
              k.setAttribute('src', c);
              eventon('error', function () {
                this.parentNode.nextSibling.nextSibling.firstChild.style.color = 'red';
                this.parentNode.nextSibling.firstChild.style.color = 'red';
                this.parentNode.nextSibling.firstChild.setAttribute('title', 'A képet nem sikerült betölteni.');
                this.setAttribute('src', 'http://'+domain+'/media/img/null.png');
              }, k);
            }
            else k.setAttribute('src', 'http://' +domain+ '/media/img/smilies/' +j[1]+ '.gif');
            
            si[si.length] = escape(n.value.henc());
          }
          else d.style.color = 'red';
          
          if(dbg)console.log('dbg: '+n.value);
        }
      }
      
      var save_size = si.join('|').length;
      
      if(dbg)console.log('dbg: si.join(|).length = '+si.join('|').length);
      if(save_size > 4000)
      {
        this.style.color = 'red';
        this.setAttribute('title', 'A megadott parancsok mentése meghaladja a 4KiB-et. (+'+(save_size-4000)+' bájt)');
      }
      else
      {
        if(si.length > 0)
        {
          alap_ikonok = si.join('|');
          this.setAttribute('title', 'Mentve: '+(save_size/1000).toFixed(3)+'KiB / 4KiB');
        }
        else alap_ikonok = '';
        
        set_cookie('sib', alap_ikonok);
        sajat_parancsok_megjelenites();
      }
      
    }, document.getElementById('sib_save'));
    // TODO: reset gomb
    
    sajat_parancsok_megjelenites();
    
    var pb = document.createElement('IMG');
    pb.className = 'spr_b S'+gomb_inaktiv+'-dl_icon';
    pb.width = '16';
    pb.height = '15';
      pb.style.marginTop = '8px';
      pb.style.marginBottom = '8px';
      pb.style.display = 'block';
    pb.style.cursor = 'pointer';
    pb.src = 'http://'+domain+'/media/img/null.png';
    
    var ib = pb.cloneNode(false);
    
    pb = parancs_gombok.parentNode.appendChild(pb);
    ib = ikon_gombok.parentNode.appendChild(ib);
    
    eventon('click', function()
    {
      if(input_submit != false)
      {
        if(spb.style.display == '')
        {
          spb.style.display = 'none';
          sib.style.display = 'none';
          ta.style.display = '';
          input_submit.style.visibility = 'visible';
          input_submit.disabled = false;
          elonezet_gomb.style.visibility = 'visible';
          elonezet_gomb.disabled = false;
          pb.className = 'spr_b S'+gomb_inaktiv+'-dl_icon';
          ib.className = 'spr_b S'+gomb_inaktiv+'-dl_icon';
        }
        else
        {
          input_submit.style.visibility = 'hidden';
          input_submit.disabled = true;
          elonezet_gomb.style.visibility = 'hidden';
          elonezet_gomb.disabled = true;
          ta.style.display = 'none';
          sib.style.display = 'none';
          spb.style.display = '';
          pb.className = 'spr_b S'+gomb_aktiv+'-dl_icon';
          ib.className = 'spr_b S'+gomb_inaktiv+'-dl_icon';
        }
      }
    }, pb);
    
    eventon('click',  function()
    {
      if(input_submit != false)
      {
        if(sib.style.display == '')
        {
          spb.style.display = 'none';
          sib.style.display = 'none';
          ta.style.display = '';
          input_submit.style.visibility = 'visible';
          input_submit.disabled = false;
          elonezet_gomb.style.visibility = 'visible';
          elonezet_gomb.disabled = false;
          ib.className = 'spr_b S'+gomb_inaktiv+'-dl_icon';
          pb.className = 'spr_b S'+gomb_inaktiv+'-dl_icon';
        }
        else
        {
          input_submit.style.visibility = 'hidden';
          input_submit.disabled = true;
          elonezet_gomb.style.visibility = 'hidden';
          elonezet_gomb.disabled = true;
          ta.style.display = 'none';
          sib.style.display = '';
          spb.style.display = 'none';
          ib.className = 'spr_b S'+gomb_aktiv+'-dl_icon';
          pb.className = 'spr_b S'+gomb_inaktiv+'-dl_icon';
        }
      }
    }, ib);
  }
  return true;
}

function bh_ikonok_kereses(kod)
{
  if(!kod || !bh_ikonok) return false;
  
  for(var i=0; i < bh_ikonok.length; i++)
  {
    if(typeof bh_ikonok[i] == 'string')
    {
      if(':'+bh_ikonok[i]+':' == kod) return [':'+bh_ikonok[i]+':', bh_ikonok[i]];
    }
    else
    {
      if(bh_ikonok[i][0] == kod) return bh_ikonok[i];
    }
  }
  
  return false;
}

function sajat_parancsok_megjelenites(e)
{
  if(!msg_form || !ta || !parancs_gombok || !ikon_gombok) return false;
  
  var parancslista = mentett_parancsok(alap_parancsok);
  var ikonlista = mentett_ikonok(alap_ikonok);
  
  parancs_gombok.innerHTML = '';
  ikon_gombok.innerHTML = '';
  if(parancslista.length > 0)
  {
    if(dbg)console.log('dbg: parancslista.length = '+parancslista.length);
    for(var i = 0; i < parancslista.length; i++)
    {
      var p = document.createElement('P');
      p.setAttribute('align', 'center');
      p.style.margin = '5px';
      p.innerHTML = '<a href="javascript:void(0);" title="'+unescape(parancslista[i][1].join(szoveg_helyettesito)).henc()+'" rel="'+parancslista[i][1].join('#')+'">'+parancslista[i][0].henc().split(' ').join('&nbsp;')+'</a>';
      
      p = parancs_gombok.appendChild(p);
      eventon('click', parancs_beszuras, p.firstChild);
    }
  }
  
  if(ikonlista.length > 0)
  {
    if(dbg)console.log('dbg: ikonlista.length = '+ikonlista.length);
    for(var i = 0; i < ikonlista.length; i++)
    {
      var p = document.createElement('P');
      p.setAttribute('align', 'center');
      p.style.margin = '5px';
      //p.style.paddingBottom = '2px';
      p.innerHTML = '<img alt=" " onerror="this.setAttribute(\'src\', \'http://'+domain+'/media/img/null.png\');" style="max-width: 47px; max-height: 25px; border: 0; cursor: pointer;" title="'+unescape(ikonlista[i][0].trim()).henc()+'" rel="'+escape(ikonlista[i][2])+'" src="'+ikonlista[i][1].henc()+'"/>';
      
      p = ikon_gombok.appendChild(p);
      eventon('click', parancs_beszuras, p.firstChild);
    }
  }
}

function mentett_ikonok(ikonok)
{
  var r = [];
  var k = ikonok.split('|');
  for(var j = 0; j < k.length; j++)
  {
    k[j] = unescape(k[j]);
    var c = k[j].trim();
    if(c.indexOf('http://') == 0)
    {
      r[r.length] = [k[j], c, k[j].replace(c, '[img='+c+']')];
    }
    else
    {
      c = bh_ikonok_kereses(c);
      if(c != false)
      {
        r[r.length] = [k[j], 'http://' +domain+ '/media/img/smilies/' +c[1]+ '.gif', k[j]];
      }
    }
  }
  
  return r;
}

function mentett_parancsok(parancsok)
{
  // | - sorok
  // : - név
  // # - szöveg elválasztó
  var r = [];
  var n = '';
  var p = parancsok.split('|');
  for(var i = 0; i < p.length; i++)
  {
    p[i] = p[i].split(':');
    if(p[i].length == 2 && p[i][0].length > 0)
    // if(p[i].length == 2 && p[i][0].trim().length > 0)
    {
      n = p[i].shift();
      p[i] = p[i][0].split('#');
      if(p[i].length > 0)
      {
        if(p[i].length > 1 || p[i][0].length > 0)
        {
          r[r.length] = [unescape(n), p[i]];
        }
      }
    }
  }
  
  return r;
}

// ##########
// Idézet opciók
// ##########
var ta_val = '';
var _qid = false;
var _qname = false;
var qlink = false;
var qlink2 = false;
function idezet_opciok(e, n)
{
  if(dbg)console.log('dbg: idezet_opciok('+e+', \n '+n+')');
  
  if(!n && n !== 0) n = false;
  if(!msg_form || !ta) return false;
  
  //if((loc == 'forums.php' && _get['action'] == 'quotepost' && !isNaN(_get['topicid'])) || (loc == 'comment.php' && _get['action'] == 'add' && _get['from'] == 'quote'))
  if(loc == 'comment.php' && _get['action'] == 'add' && _get['from'] == 'quote')
  {
    if(n === false)
    {
      if(dbg)console.log('dbg: idezet_opciok inicializálás.');
      
      var il_box = document.createElement('DIV');
      il_box.setAttribute('id', 'il_links');
      il_box.style.fontWeight = 'bold';
      il_box.style.fontSize = '10px';
      il_box.style.paddingBottom = '10px';
      il_box.style.visibility = 'hidden';
      
      il_box = msg_form.insertBefore(il_box, msg_form.firstChild);
      
      il_box.innerHTML = '<span id="il_0" style="text-decoration: underline; cursor: pointer;">Teljes idézet</span> &nbsp;-&nbsp '
                     + '<span id="il_3" style="text-decoration: underline; cursor: pointer;">Idézet <b>...</b></span> &nbsp;-&nbsp '
                     + '<span id="il_1" style="text-decoration: underline; cursor: pointer;">Idézet linkel</span> &nbsp;-&nbsp '
                     + '<span id="il_2" style="text-decoration: underline; cursor: pointer;">Válasz linkel</span>';
      
      eventon('click', function(){idezet_opciok(false, 0)}, document.getElementById('il_0'));
      eventon('click', function(){idezet_opciok(false, 1)}, document.getElementById('il_1'));
      eventon('click', function(){idezet_opciok(false, 2)}, document.getElementById('il_2'));
      eventon('click', function(){idezet_opciok(false, 3)}, document.getElementById('il_3'));
      
      if(!isNaN(_get['postid'])) _qid = _get['postid'];
      else if(!isNaN(_get['cid'])) _qid = _get['cid'];
      else _qid = false;
      
      if(isNaN(_qid)) return false;
      
      if(!isNaN(_get['postid']))
      {
        var post_link = (!idezett_link_topikban) ? '/forums.php?action=viewpost&postid=' : '/forums.php?action=skippost&postid=';
        qlink = '[url=http://' + domain + post_link + _qid + ']#' + _qid + '[/url]';
        qlink2 = '[url=http://' + domain + post_link + _qid + ']...[/url]';
      }
      else if(!isNaN(_get['cid']))
      {
        qlink = '#' + _qid;
        qlink2 = '...';
      }
      
      ta_val = ta.value + "\n";
      
      if(ta_val.indexOf('[quote=') == 0)
      {
        _qname = ta_val.substring(7).split(']')[0];
        idezet_opciok(false, alap_idezet);
      }
      else
      {
        if(dbg)console.log('dbg: refresh');
        var d = [];
        var l = '';
        if(!isNaN(_get['postid']))
        {
          d['action'] = 'quotepost';
          d['topicid'] = _get['topicid'];
          d['postid'] = _qid;
          l = 'forums.php';
        }
        else if(!isNaN(_get['cid']))
        {
          d['action'] = 'add';
          d['from'] = 'quote';
          d['cid'] = _qid;
          l = 'comment.php';
        }
        
        ajax_get(d, function(){
          if (getreq.readyState == 4 && getreq.status == 200)
          {
            if(dbg)console.log('dbg: getreq 4 / 200');
            ta_val = getreq.responseText.split(' tabindex=1>')[1].split('</textarea>')[0]+"\n";
            _qname = ta_val.split('[quote=')[1].split(']')[0];
            
            idezet_opciok(false, alap_idezet);
          }
        }, l);
      }
    }
    else if(qlink != false)
    {
      if(dbg)console.log('dbg: ta_val.length = '+ta_val.length+'; \n _qname = '+_qname+'; \n _qid = '+_qid+';');
      document.getElementById('il_links').style.visibility = 'visible';
      
      if(n == 1) ta.value = ' [quote=' + _qname + ']' + qlink + '[/quote]\n';
      else if(n == 3) ta.value = ' [quote=' + _qname + ']' + qlink2 + '[/quote]\n';
      else if(n == 2) ta.value = '\n\n[size=1]Válasz erre: ' + qlink + ' (' + _qname + ')[/size]\n';
      else ta.value = ta_val;
      
      ta.focus();
      if(n == 2)
      {
        ta.selectionStart = 0;
        ta.selectionEnd = 0;
      }
    }
  }
  return true;
}

// ##########
// Előnézet Gomb
// ##########
var cp = false;
var comment_preview = false;
var elonezet_gomb = false;
var elonezet_elozo = '';
function elonezet_init(e)
{
  if(!msg_form || !ta || !input_submit) return false;
  
  if(dbg)console.log('dbg: elonezet_init('+e+')');
  
  elonezet_gomb = document.createElement('INPUT');
  elonezet_gomb.className = 'btn';
  elonezet_gomb.style.marginLeft = '5px';
  elonezet_gomb.setAttribute('id', 'elonezet');
  elonezet_gomb.setAttribute('type', 'button');
  elonezet_gomb.setAttribute('value', 'Előnézet');
  
  elonezet_gomb = input_submit.parentNode.appendChild(elonezet_gomb);
  
  eventon('click', elonezet, elonezet_gomb);
  
  cp = document.createElement('CENTER');
  cp = msg_form.parentNode.insertBefore(cp,msg_form.nextSibling);
  return true;
}

function elonezet(e)
{
  if(dbg)console.log('dbg: elonezet('+e+')');
  if(!msg_form || !ta) return false;
  
  var adatok = [];
  adatok['test'] = ta.value;
  
  if(elonezet_elozo != adatok['test'])
  {
    if(adatok['test'].length > 0)
    {
      elonezet_elozo = adatok['test'];
      ajax_post(adatok, function()
      {
        if (postreq.readyState == 4 && postreq.status == 200)
        {
          var preview = unescape(postreq.responseText.split('<p><hr>')[1].split('<hr></p>')[0]);
          if(dbg)console.log('dbg: preview.length = '+preview.length);
          
          if(comment_preview === false)
          {
            cp.innerHTML += '<h2>Előnézet</h2><table cellspacing="0" cellpadding="15" border="1"><tr><td><table class="main" width="600" cellspacing="0" cellpadding="5" border="0"><tr valign="top"><td class="text" id="comment_preview">'+preview+'</td></tr></table></td></tr></table>';
            comment_preview = document.getElementById('comment_preview');
          }
          else comment_preview.innerHTML = preview;
        }
      }, 'tags.php');
    }
    else if(comment_preview != false) comment_preview.innerHTML = '';
  }
  return true;
}


// ##########
// Funkciók
// ##########
function parancs_beszuras(event)
{
  var elem = event.srcElement || event.currentTarget;
  if(!msg_form || !ta || !elem) return false;
  
  if(elem.getAttribute('rel'))
  {
    if(ta.style.display == '')
    {
      var parancs = elem.getAttribute('rel').split('#');
      for(var i = 0; i < parancs.length; i++) parancs[i] = unescape(parancs[i]);
      
      // W3
      var selection = [];
      var ta_st = ta.scrollTop;
      var replaced;
      if('selectionStart' in ta)
      {
        selection['start']  = ta.selectionStart;
        selection['end']  = ta.selectionEnd;
        selection['length'] = selection['end'] - selection['start'];
        if(selection['length'] > 0) selection['text'] = ta.value.substr(selection['start'], selection['length']);
        else selection['text'] = '';
        
        replaced = parancs.join(selection['text']);
        if(selection['length'] > 0)
        {
          /*// kijelölés megmarad
          selection['new_start'] = selection['start'] + parancs[0].length;
          selection['new_end'] = selection['new_start'] + selection['text'].length;
          */
          selection['new_start'] = selection['start'] + replaced.length;
          selection['new_end'] = selection['new_start'];
        }
        else
        {
          selection['new_start'] = selection['start'] + parancs[0].length;
          selection['new_end'] = selection['new_start'];
        }
        if(dbg)console.log('dbg: (w3) selection.valueOf() = '+selection.valueOf());
        
        ta.value = ta.value.substring(0, selection['start']) + replaced + ta.value.substring(selection['end'], ta.value.length);
        ta.selectionStart = selection['new_start'];
        ta.selectionEnd = selection['new_end'];
      }
      // MS
      else if(document.selection)
      {
        var r = document.selection.createRange();
        var tr = ta.createTextRange();
        var tr2 = tr.duplicate();
        tr2.moveToBookmark(r.getBookmark());
        tr.setEndPoint('EndToStart',tr2);
        if (r == null || tr == null)
        {
          selection['start'] = ta.value.length;
          selection['end'] = selection['new_start'];
          selection['text'] = '';
          selection['length'] = 0;
        }
        else
        {
          var text_part = r.text.replace(/[\r\n]/g,'.'); // IE fix
          selection['length'] = text_part.length;
          var text_whole = ta.value.replace(/[\r\n]/g,'.');
          selection['start'] = text_whole.indexOf(text_part,tr.text.length);
          selection['end'] = selection['new_start'] + selection['length'];
          selection['text'] = r.text;
        }
        
        replaced = parancs.join(selection['text']);
        if(selection['length'] > 0)
        {
          /*// kijelölés megmarad
          selection['new_start'] = selection['start'] + parancs[0].length;
          selection['new_end'] = selection['new_start'] + selection['length'];
          */
          selection['new_start'] = selection['start'] + replaced.length;
          selection['new_end'] = selection['new_start'];
        }
        else
        {
          selection['new_start'] = selection['start'] + parancs[0].length;
          selection['new_end'] = selection['new_start'];
        }
        if(dbg)console.log('dbg: (ms) selection.valueOf() = '+selection.valueOf());
        
        r.text = replaced;
        tr.collapse(true);
        tr.moveStart('character', selection['new_start']);
        tr.moveEnd('character', selection['new_end']);
        tr.select();
      }
      
      ta.focus();
      ta.scrollTop = ta_st;
    }
  }
  return true;
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
String.prototype.trim = function () {
  //return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  var str = this.replace(/^\s\s*/, ''), i = str.length, ws = /\s/;
  while(ws.test(str.charAt(--i)));
  return str.slice(0, i + 1);
};

// ajax poster
var postreq = false;
function ajax_post(data, func, file)
{
   if(!file) var file = "ajax.php";
   postreq = false;
   if (window.XMLHttpRequest)
   {//Mozilla, Safari
      postreq = new XMLHttpRequest();
      if (postreq.overrideMimeType) postreq.overrideMimeType("text/html;charset=iso-8859-2");
   }
   else if (window.ActiveXObject)
   {//IE
      try { postreq = new ActiveXObject("Msxml2.XMLHTTP"); }
      catch (e)
      {
        try { postreq = new ActiveXObject("Microsoft.XMLHTTP"); }
        catch (e) {}
      }
   }
   if (!postreq) return false;
   //if (!postreq) alert('An error occurred during the XMLHttpRequest!');

   var parameters = '';
   var amp = '';
   for(var i in data)
   {
     parameters += amp + i + '=' + escape(data[i]); // escape(encodeURI( ))
     if(amp == '') amp = '&';
   }

   postreq.onreadystatechange = func;
   postreq.open("POST", file, true);
   postreq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
   postreq.setRequestHeader("Content-length", parameters.length);
   postreq.setRequestHeader("Connection", "close");
   postreq.send(parameters);

   return true;
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
komment_addon();
//eventon('load', komment_addon);

})();