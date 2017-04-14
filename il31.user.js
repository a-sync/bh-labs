// ==UserScript==
// @name           idézett link 3.1
// @namespace      redir.at/
// @description    A szöveg idézése helyett, egy linket szúr be az idézett posthoz
// @include        http://bithumen.be/forums.php?action=quotepost*
// @include        http://bithumen.ru/forums.php?action=quotepost*
// @include        http://bithumen.be/comment.php?action=add&from=quote*
// @include        http://bithumen.ru/comment.php?action=add&from=quote*
// ==/UserScript==

var _alap = 2; // alap megjelenési mód; 0 = sima, 1 = idézet linkel, 2 = válasz linkel, 3 = idézet ...
var idezett_link_topikban = true; // az idézett postra mutató link a topikon belül mutassa a hsz.-t

if(window.attachEvent) window.attachEvent('onload', idezett_link);
else window.addEventListener('load', idezett_link, false);
var ta_val = '';
var _qid = false;
var qlink = false;
var qlink2 = false;
var ta = false;
var domain = document.domain;

function idezett_link(e, n)
{
  if(!n && n !== 0) n = false;
  ta = document.getElementsByTagName('textarea')[0];
  
  if(n === false)
  {
    get_variables();
    
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
    
    var form = document.getElementsByTagName('form')[0];
    form.innerHTML = '<div id="il_links" style="font-weight: bold; font-size: 10px; padding-bottom: 10px;">'
                   + '<span id="il_0" style="text-decoration: underline; cursor: pointer;">Teljes idézet</span> &nbsp;-&nbsp '
                   + '<span id="il_3" style="text-decoration: underline; cursor: pointer;">Idézet <b>...</b></span> &nbsp;-&nbsp '
                   + '<span id="il_1" style="text-decoration: underline; cursor: pointer;">Idézet linkel</span> &nbsp;-&nbsp '
                   + '<span id="il_2" style="text-decoration: underline; cursor: pointer;">Válasz linkel</span>'
                   + '</div>'
                   + form.innerHTML;
    
    //todo: for ciklus..
    var il_0 = document.getElementById('il_0');
    if(il_0.attachEvent) il_0.attachEvent('onclick', function () { idezett_link(false, 0); } );
    else il_0.addEventListener('click', function () { idezett_link(false, 0); }, false);
    
    var il_1 = document.getElementById('il_1');
    if(il_1.attachEvent) il_1.attachEvent('onclick', function () { idezett_link(false, 1); } );
    else il_1.addEventListener('click', function () { idezett_link(false, 1); }, false);
    
    var il_2 = document.getElementById('il_2');
    if(il_2.attachEvent) il_2.attachEvent('onclick', function () { idezett_link(false, 2); } );
    else il_2.addEventListener('click', function () { idezett_link(false, 2); }, false);
    
    var il_3 = document.getElementById('il_3');
    if(il_3.attachEvent) il_3.attachEvent('onclick', function () { idezett_link(false, 3); } );
    else il_3.addEventListener('click', function () { idezett_link(false, 3); }, false);
    
    idezett_link(false, _alap);
  }
  else if(qlink != false)
  {
    if(n == 1) ta.value = ta_val.split(']')[0] + ']' + qlink + '[/quote]\n';
    else if(n == 3) ta.value = ta_val.split(']')[0] + ']' + qlink2 + '[/quote]\n';
    else if(n == 2) ta.value = '\n\n[size=1]Válasz erre: ' + qlink + ' (' + ta_val.split(']')[0].split('quote=')[1] + ')[/size]\n';
    else ta.value = ta_val;
    
    ta.focus();
    if(n == 2)
    {
      ta.selectionStart = 0;
      ta.selectionEnd = 0;
    }
  }
}


/* _get változók kigyűjtése */
var _get = [];
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

