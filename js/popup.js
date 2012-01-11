//ZeroClipboard.setMoviePath( '../flash/ZeroClipboard.swf' );

//pads zeroes to output that needs it
var pad = function(number, base) {
	base = parseInt(base);
   	switch(base){
		case 2:
			base = 8;
			break;
		case 10:
			base = 3;
			break;
		case 16:
			base = 2;
			break;
		default:
			base = 0;
			break;
	}
    while (number.length < base)
        number = '0' + number;
    return number;

}

//takes string input outputs encoded data
var encodeBase = function(inString, base){
	var output = "";
	base = parseInt(base);
	if(base<63 && inString)
		for (var i = 0; i < inString.length; i++)
            if(base == 16)
                output +=  "&#x" + pad(inString.charCodeAt(i).toString(base), base) + "; ";
            else if(base == 10)
                output += "&#" + pad(inString.charCodeAt(i).toString(base), base) + "; ";
            else
                output +=  pad(inString.charCodeAt(i).toString(base), base) + " ";
	else if (base == 64)
		output = btoa(inString);
  else if (base == 641){
		var ttype = inString.substring(0,16);
		 if (ttype.search('JFIF') > -1) {
		  ttype = "jpeg";
		 }else if (ttype.search("GIF") > -1) {
		  ttype = "gif";
		 }else if (ttype.search("PNG") > -1) {
		  ttype = "png";
		 }else {
		  ttype = 0;
		 }
    if(ttype){
      output = '<img src="data:image/' + ttype + ';base64,' + btoa(inString); + '" alt="allyourbase64" />';
    }else{
      output = "";
    }
  //uri section
  }else if (base == 80)
		output = encodeURI(inString);
	else if (base == 443)
		output = encodeURIComponent(inString);
  //hash section
  else if (base == 555)
    output = hex_md5(inString);
  else if (base == 111)
    output = hex_sha1(inString);
  else if (base == 256)
    output = hex_sha256(inString);
  else if (base == 512)
    output = hex_sha512(inString);
  else if (base == 320)
    output = crc32(inString);
  else if (base == 160)
    output = hex_rmd160(inString);
	else
		output = inString;
	return output;
}

//takes encoded data outputs string
var decodeBase = function(inString,base){
	var output = "";
	base = parseInt(base);
	if(base<63 && inString){
		var baseArray = inString.split(" ");
		for (var i = 0; i < baseArray.length; i ++){
			output += String.fromCharCode(parseInt(baseArray[i].replace(/(&#x|&#|;\w)/, ""),base).toString(10));
			}
	}else if (base == 64){
		output = atob(inString);
	}else if (base == 80){
		output = decodeURI(inString);
	}else if (base == 443){
		output = decodeURIComponent(inString);
	}else{
		output = inString;
	}
	return output;
}

//var clip = new ZeroClipboard.Client();
//clip.setText( '' ); // will be set later on mouseDown
//clip.setHandCursor( true );
//clip.setCSSEffects( true );
//clip.addEventListener( 'mouseDown', function(client) { 
//                                clip.setText( document.getElementById('bs-string').value );
//} );
//clip.glue('bs-clipStr');
$(function() {
  chrome.browserAction.setBadgeText({text: ""});
	$("textarea").keyup(function(e){
		$("textarea").removeClass("selected");
		$(this).addClass("selected");
        //alert(e.keyCode);
		e.preventDefault();
		var pushVal = decodeBase($(this).val(),$(this).attr("rel"));
		$("textarea:not(.selected)").each(function (index, item) {
			//$(item).attr("id","");
			$(item).val(encodeBase(pushVal,$(item).attr("rel")));
		});
		
		//changes image
		var imgType = pushVal.substring(0,16);
			if (imgType.search('JFIF') > -1) {
				imgType = "jpeg";
			}else if (imgType.search("GIF") > -1) {
					imgType = "gif";
			}else if (imgType.search("PNG") > -1) {
					imgType = "png";
			}else {
					imgType = 0;
			}
    // image display options
		if (imgType) {
			$(".bs-imageOutput").attr("src", "data:image/" + imgType + ";base64," + $("#bs-base64").val());
			$(".bs-imageBox").css('display', 'block');
      $(".bs-imgTab").css('display','inline-block');
		}else{
			$(".bs-imageBox").css('display', 'none');
      $(".bs-imgTab").css('display','none');
		}	
	});
  // tab control
  $('.bs-tab').click(function(){
    $('.bs-tab').removeClass('selected');
    $(this).addClass('selected');
    $('.bs-tabBody').css('display','none');
    $($(this).attr('rel')).css('display', 'block');
  });
   
  // for scaling tabs
  $("span.bs-maximize").click(function(){
    var $thisOffset = $(this).parent().parent().offset();
    var thisID= $(this).attr('rel');
    var fieldVal= encodeBase($("#"+ thisID).val(),$("#" + thisID).attr('rel'));
    $('body').append('<div id="bs-floatOver" style="top:' + $thisOffset.top  + 'px;left:' + $thisOffset.left  + 'px" ><label for="bs-floatField">' + thisID.replace('bs-','') + '<!--<span class="bs-button"><span class="bs-clip" id="bs-clipStr" rel="bs-string"></span></span>--><span class="bs-button"><span class="bs-maximize bs-min" rel="' + thisID + '"></span></span></label><textarea id="bs-floatField" rel="99" rows="33">' + fieldVal  + '</textarea></div>');
   $('body').css('height',$('body').height());
   $("div.bs-wordBubble").fadeOut();
   $(".js-bs-mutable").fadeOut();
   $('.js-orange').css('height',$('body').height());
   $("#bs-floatOver").animate({ top: "10px", left:0, width: $('body').width() - 4 +"px", height: $('body').height() -4 +"px" },200,function(){
      $('span.bs-maximize.bs-min').click(function(e){
	e.preventDefault();
        $("#" + thisID).val(encodeBase($('#bs-floatField').val(),$("#" + thisID).attr('rel')));
        $("div.bs-wordBubble").fadeIn();
        $(".js-bs-mutable").fadeIn();
        $("#bs-floatOver").animate({ top: $thisOffset.top +"px", left: $thisOffset.left + "px", width:'235px', height:'103px'},200,function(){$("#bs-floatOver").remove();});
   });
  });
  });
  var bgOb = chrome.extension.getBackgroundPage();
  if(bgOb.sendVal.length && bgOb.typeVal.length)
    $(bgOb.typeVal).val(bgOb.sendVal).keyup();
});
