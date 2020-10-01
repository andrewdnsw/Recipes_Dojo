var firstload = true;
var req = null; 
var target = null;
function processReqChange()
{
  try { 
    if (req.readyState == 4) { 
        if (req.status == 200) { 
            target.innerHTML = req.responseText; 
        } 
    }
  }
  catch( e ) {alert('Ajax error: ' + e.description + "readyState= " + req.readyState + "  status= " + req.status);}
}
function loadText(from, to) {
    req = null;
    target = to;
    if (window.XMLHttpRequest) {
        try {
            req = new XMLHttpRequest();
        } catch (e){}
    } else if (window.ActiveXObject) {
        try {
            req = new ActiveXObject('Msxml2.XMLHTTP');
        } catch (e){
            try {
                req = new ActiveXObject('Microsoft.XMLHTTP');
            } catch (e){alert('Ajax error: ' + e.description);}
        }
    }
    if (req) {       
        req.open('GET', from, true);
        req.onreadystatechange = processReqChange;
        req.send(null);
    }
}

function init() {
    if (firstload) {
        if (window.opera) {
            loadText("http://swim.obninsk.ru/dojo_tree/html/bad_browser.html", window.document.getElementById('banner'));
        }
        if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){      //test for MSIE x.x;
            var ieversion=new Number(RegExp.$1)                 // capture x.x portion and store as a number
            if (ieversion < 9) {
                loadText("http://swim.obninsk.ru/dojo_tree/html/bad_browser.html", window.document.getElementById('banner'));
            }
        }
        firstload = false;
    }
}

/* for Mozilla */
if (document.addEventListener) {
	document.addEventListener("DOMContentLoaded", init, false);
}
/* for Internet Explorer */
/*@cc_on @*/
/*@if (@_win32)
	document.write("<script id=__ie_onload defer src=javascript:void(0)><\/script>");
	var script = document.getElementById("__ie_onload");
	script.onreadystatechange = function() {
		if (this.readyState == "complete") {
			init(); // call the onload handler
		}
	};
/*@end @*/
/* for Safari */
if (/WebKit/i.test(navigator.userAgent)) { // sniff
	_timer = setInterval(function() {
	if (/loaded|complete/.test(document.readyState)) {
			init(); // call the onload handler
		}
	}, 10);
}
/* for other browsers */
window.onload = init;
