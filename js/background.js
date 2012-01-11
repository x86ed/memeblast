var oldVal= "";
var sendVal= "";
var typeVal ="";
var sendMessageP = true;
var selectNotify = function(inString,badgeType){
  if(sendMessageP){
     var notification = webkitNotifications.createNotification(
        'icons/icon-48.png',  // icon url - can be relative
        'you have selected',  // notification title
        inString  // notification body text
      );
      notification.ondisplay = function(){
        chrome.browserAction.setBadgeBackgroundColor({color: [218 , 17 , 2 , 255]});
        chrome.browserAction.setBadgeText({text:badgeType});
      }
      notification.show();
      switch (badgeType){
        case 'b64':
          typeVal = '#bs-base64';
          break;
         case '010':
          typeVal = '#bs-binary';
          break;
         case 'dec':
          typeVal = '#bs-dec';
          break;
         case 'hex':
          typeVal = '#bs-hex';
          break;
         case 'url':
          typeVal = '#bs-url';
          break;
         case 'url+':
          typeVal = '#bs-urlC';
          break;
         default:
           typeVal ="#bs-string";   
      }
      sendMessageP = false;
  }
  return "SelectNotify()";
}

function encodeImage(info) {
          url = info.srcUrl;
        BinaryAjax(
        url,
        function(oHTTP) {
             // reuse componets from other parts of the code in the future for now though this section will be holy shit messy.
            var base64String ="";
            var base64Array = ["A", "B" , "C" , "D", "E", "F" , "G" , "H" , "I" , "J" , "K" , "L" , "M", "N", "O", "P" , "Q" ,"R" , "S" , "T" , "U" ,"V" , "W" , "X" , "Y", "Z" , "a" , "b" , "c" ,"d" , "e" , "f" , "g" , "h" , "i" , "j" , "k" , "l" ,"m" ,"n" , "o", "p", "q" , "r" ,"s" , "t" , "u" , "v" , "w" ,"x" ,"y" ,"z", "0", "1" , "2" , "3" , "4" , "5", "6" ,"7" , "8" ,"9" , "+", "/" ]
            var byteArray = oHTTP.binaryResponse.getBytesAt(0,oHTTP.binaryResponse.getLength());
            var counter = 0;
            while (counter < byteArray.length){
              var binVal = byteArray[counter].toString(2);
              while (binVal.length < 8)
                binVal = 0 + binVal;
              byteArray[counter] = binVal;
              counter ++;
            }
            base64String = byteArray.join("")
            var offset = base64String.length % 3;
            var eqPad = offset>1?eqPad="==":offset?eqPad ="=":eqPad ="";
            offset = offset>1?offset="0000":offset?offset ="00":offset ="";
            base64String += offset;
            counter = 0;
            byteArray =[];
            while (counter < base64String.length/6 ){
             byteArray[counter]= base64Array[parseInt(base64String.substr(counter*6,6),2)];
             counter ++;
            }
            base64String = byteArray.join("") + eqPad;
          sendVal = base64String;
        }
    )
		  typeVal = '#bs-base64';
          var notification = webkitNotifications.createNotification(
            'icons/icon-48.png',  // icon url - can be relative
            'you have encoded',  // notification title
             url  // notification body text
          );
          notification.ondisplay = function(){
            chrome.browserAction.setBadgeBackgroundColor({color: [218 , 17 , 2 , 255]});
            chrome.browserAction.setBadgeText({text:"img"});
          }
          notification.show();
}

$(function() {
	chrome.extension.onConnect.addListener(function(port) {
     if(port.name == "selectedText"){
       port.onMessage.addListener(function(msg) {
         if(msg.value.length && oldVal != msg.value)
           sendMessageP = true;
           sendVal = oldVal = msg.value;
       });
     }
  });
    //Selected menu options
    var stringContext = chrome.contextMenus.create({title: "ASCII", contexts:['selection'],onclick:function(){selectNotify(sendVal,'str')}});
    var base64Context = chrome.contextMenus.create({title: "Base64", contexts:['selection'],onclick:function(){selectNotify(sendVal,'b64')}});
    var binaryContext = chrome.contextMenus.create({title: "Binary", contexts:['selection'],onclick:function(){selectNotify(sendVal,'010')}});
    var decimalContext = chrome.contextMenus.create({title: "Decimal", contexts:['selection'],onclick:function(){selectNotify(sendVal,'dec')}});
    var hexContext = chrome.contextMenus.create({title: "Hexadecimal", contexts:['selection'],onclick:function(){selectNotify(sendVal,'hex')}});
    var urlContext = chrome.contextMenus.create({title: "URL Encoded", contexts:['selection'],onclick:function(){selectNotify(sendVal,'url')}});
    var urlComponentContext = chrome.contextMenus.create({title: "URL Component",contexts:['selection'],onclick:function(){selectNotify(sendVal,'url+')}});
    
    //Image menu options
    var imageContext = chrome.contextMenus.create({title: "base64 this", contexts:['image'],onclick:function(item){encodeImage(item)}});
});