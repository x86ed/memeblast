var getSText = function(){
  var t = '';
  if(window.getSelection){
    t = window.getSelection().toString();
  }
  return t;
}
var selectedText = ''
$(function() {
  $('body').mouseup(function(){
    selectedText = getSText();
    port = chrome.extension.connect({name: "selectedText"});
    port.postMessage({value: selectedText});
  });
 });
