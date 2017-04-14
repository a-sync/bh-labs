// ==UserScript==
// @name           bhc64lol
// @include        http://*bithumen.be/*
// @include        http://*bithumen.ru/*
// ==/UserScript==

document.body.innerHTML+='<textarea id="t" style="width:0;height:0;border:0;"></textarea>';
var t=document.getElementById('t');

var main = document.getElementsByTagName('div')[0];
main.style.overflow = 'auto';
var txt_real=document.getElementsByTagName('div')[3];
var prompt=document.getElementsByTagName('img')[0];
var line='';

if(window.attachEvent) window.attachEvent('onkeydown',edit);
else window.addEventListener('keydown',edit,false);

function edit(event){
document.getElementById('t').focus();
txt_real.removeChild(prompt);

line=txt_real.lastChild.nodeValue;
if(line==null)line='';

if(event.keyCode==0xA||event.keyCode==0xD)
{
txt_real.appendChild(document.createElement('BR'));
line='';
}
else if(event.keyCode==8)
{
line=line.substring(0,line.length-1);
txt_real.lastChild.nodeValue=line;
}
else if(event.keyCode==16||event.keyCode==9||event.keyCode==20||event.keyCode==18||event.keyCode==17||event.keyCode==92){}
else {
line+=(event.keyCode==32&&line.substring(line.length-1)==' ')?String.fromCharCode(160):String.fromCharCode(event.keyCode);
if(!txt_real.lastChild.nodeValue) txt_real.appendChild(document.createTextNode(line));
else txt_real.lastChild.nodeValue=line;
}
txt_real.appendChild(prompt);
main.scrollTop = main.scrollHeight; 
return false;
}