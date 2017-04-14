// ==UserScript==
// @name           Inbox filter
// @version        1.1.6
// @author         Vector
// @namespace      bH
// @include        http://bithumen.be/inbox.php*
// @include        https://bithumen.be/inbox.php*
// @include        http://bithumen.ru/inbox.php*
// @include        https://bithumen.ru/inbox.php*
// ==/UserScript==
(function() {
var dbg = false; // DEBUG

var msgs_box = false;
var msgs_names = [];
var msgs_msg = [];
var filter_match = 0;
function inbox_filter_init(e)
{
  if(msgs_box === false) msgs_box = document.getElementById('messages');
  if(dbg)console.log('dbg: msgs_box = '+msgs_box);
  if(!msgs_box) return false;
  
  var filter_box = document.createElement('DIV');
  filter_box.id = 'filter_box';
  
  filter_box = msgs_box.parentNode.insertBefore(filter_box,msgs_box);
  
  filter_box.innerHTML = '<input type="text" id="filter_text" style="width:100px;"/> '
                        +'<img align="top" id="ajaxload" src="/media/img/null.png" style="margin:0 !important;"/> '
                        +'<input type="submit" id="filter_name" value="Név szűrése" style="display: none;"/> '
                        +'<span id="filter_match">(0)</span> ';
  
  if(dbg)console.log('dbg: msgs_box.childNodes = '+msgs_box.childNodes);
  for(var i = 0; i < msgs_box.childNodes.length; i++)
  {
    var e = msgs_box.childNodes[i];
    if(e.tagName == 'P')
    {
      var name = e.getElementsByTagName('b')[0];
      if(name.childNodes.length == 1 && name.childNodes[0].tagName == 'A') name = name.childNodes[0].innerHTML;
      else name = name.innerHTML;
      
      if(typeof name == 'string' && name != '')
      {
        msgs_names[msgs_names.length] = name.toLowerCase();
        msgs_msg[msgs_msg.length] = e;
      }
    }
    else if(e.tagName == 'INPUT') break;
  }
  filter_match = msgs_msg.length;
  
  document.getElementById('ajaxload').style.display = 'none';
  document.getElementById('filter_name').style.display = '';
  document.getElementById('filter_match').innerHTML = '('+filter_match+'/'+msgs_msg.length+')';
  
  eventon('click', inbox_filter, document.getElementById('filter_name'));
  eventon('keyup', inbox_filter, document.getElementById('filter_text'));
  
  if(dbg)console.log('dbg: msgs_names.length = '+msgs_names.length);
}

var filter_text = false;
function inbox_filter(e)
{
  if(e.type == 'keyup') if(e.keyCode != 13 || document.getElementById('filter_name').style.display != '') return;
  
  if(filter_text === false) filter_text = document.getElementById('filter_text');
  if(dbg)console.log('dbg: filter_text = '+filter_text);
  if(!filter_text) return false;
  
  document.getElementById('filter_name').style.display = 'none';
  document.getElementById('ajaxload').style.display = '';
  
  filter_match = 0;
  for(var i = 0; i < msgs_names.length; i++)
  {
    if(msgs_names[i].indexOf(filter_text.value.toLowerCase()) != -1 || filter_text.value.length < 1)
    {
      msgs_msg[i].getElementsByTagName('input')[0].disabled = false;
      msgs_msg[i].style.display = '';
      filter_match++;
    }
    else
    {
      msgs_msg[i].getElementsByTagName('input')[0].disabled = true;
      msgs_msg[i].style.display = 'none';
    }
  }
  
  document.getElementById('filter_match').innerHTML = '('+filter_match+'/'+msgs_msg.length+')';
  document.getElementById('ajaxload').style.display = 'none';
  document.getElementById('filter_name').style.display = '';
}

function eventon(type, func, elem)
{
  if(!elem) elem = window;
  if(elem.attachEvent) elem.attachEvent('on'+type, func);
  else elem.addEventListener(type, func, false);
}

inbox_filter_init();

})();