// ==UserScript==
// @name        User bHlokkoló
// @namespace   bH
// @version     0.0.6
// @author      Vector
// @include     http://bithumen.be/forums.php?action=viewtopic&topicid=*
// @include     https://bithumen.be/forums.php?action=viewtopic&topicid=*
// @include     http://bithumen.ru/forums.php?action=viewtopic&topicid=*
// @include     https://bithumen.ru/forums.php?action=viewtopic&topicid=*
// @include     http://bithumen.be/forums.php?action=shortquotepost&topicid=*
// @include     https://bithumen.be/forums.php?action=shortquotepost&topicid=*
// @include     http://bithumen.ru/forums.php?action=shortquotepost&topicid=*
// @include     https://bithumen.ru/forums.php?action=shortquotepost&topicid=*
// @include     http://bithumen.be/forums.php?action=quotepost&topicid=*
// @include     https://bithumen.be/forums.php?action=quotepost&topicid=*
// @include     http://bithumen.ru/forums.php?action=quotepost&topicid=*
// @include     https://bithumen.ru/forums.php?action=quotepost&topicid=*
// @include     http://bithumen.be/details.php?id=*
// @include     https://bithumen.be/details.php?id=*
// @include     http://bithumen.ru/details.php?id=*
// @include     https://bithumen.ru/details.php?id=*
// @include     http://bithumen.be/forums.php?action=reply&topicid=*
// @include     https://bithumen.be/forums.php?action=reply&topicid=*
// @include     http://bithumen.ru/forums.php?action=reply&topicid=*
// @include     https://bithumen.ru/forums.php?action=reply&topicid=*
// @include     http://bithumen.be/comment.php?action=add&*
// @include     https://bithumen.be/comment.php?action=add&*
// @include     http://bithumen.ru/comment.php?action=add&*
// @include     https://bithumen.ru/comment.php?action=add&*

// ==/UserScript==
(function(){
// TODO: lista nagy input type text-ben barátok oldalon (sütibe mentődik)

var blokkoltak = 'madWolf ROPi21 vector GETUPP'; // nagy és kisbetű különbségekre NEM érzékeny!


var loc = document.location.pathname.substr(1).toLowerCase();
if(loc == 'forums.php') var span = document.getElementById('maintd').getElementsByTagName('span'), n = 1;
else if(loc == 'details.php') var span = document.getElementById('comments').getElementsByTagName('span'), n = 0;
else if(loc == 'comment.php') var span = document.getElementById('maintd').getElementsByTagName('span'), n = 0;

for(var i = 0; i < span.length; i++)
{
  if(document.location.search.substr(0, 22) == '?action=reply&topicid=' ||
     document.location.search.substr(0, 26) == '?action=quotepost&topicid=' ||
     document.location.search.substr(0, 31) == '?action=shortquotepost&topicid=')
  {
    if(span[i].innerHTML.substr(0, 1) == '#' && blokkoltak.toLowerCase().split(' ').indexOf(span[i].innerHTML.split(' ')[1].toLowerCase()) != -1) span[i].parentNode.parentNode.style.display = 'none';
  }
  else
  {
    var j = span[i].getElementsByTagName('a')[n];
    if(j && j.href.indexOf('userdetails.php?id=') != -1 && blokkoltak.toLowerCase().split(' ').indexOf(j.firstChild.innerHTML.toLowerCase()) != -1) span[i].parentNode.parentNode.style.display = 'none';
  }
}

})();