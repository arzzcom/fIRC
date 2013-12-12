<?php
header('Content-type: application/x-javascript; charset=UTF-8', true);
?>

if (isIncludeFIRC === undefined) {
	/*
	var _gaq = _gaq || [];
	_gaq.push(['_setAccount', 'UA-239651-12']);
	_gaq.push(['_setDomainName', 'none']);
	_gaq.push(['_setAllowLinker', true]);
	_gaq.push(['_trackPageview']);

	(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();
	*/
	var isIncludeFIRC = true;

	var FIRC = function(opt) {
		this.id = opt.id ? opt.id : "FIRC"+Math.random();
		this.FIRCFrame = null;
		
		opt.width = opt.width === undefined ? "100%" : opt.width.toString();
		opt.height = opt.height === undefined ? "100%" : opt.height.toString();
		this.width = opt.width.indexOf("%") == -1 ? opt.width+"px" : opt.width;
		this.height = opt.height.indexOf("%") == -1 ? opt.height+"px" : opt.height;
		
		delete opt.width;
		delete opt.height;

		this.render = function() {
			document.writeln('<iframe name="'+this.id+'" style="width:'+this.width+'; height:'+this.height+';" frameborder="0" scrolling="no"></iframe>');

			var f = document.createElement("form");
			f.setAttribute("method","post");
			f.setAttribute("target",this.id);
			f.setAttribute("action","./firc.php");
			f.style.display = "none";

			for (name in opt) {
				if (name != "width" && name != "height") {
					if (typeof opt[name] == "object") {
						var oF = document.createElement("textarea");
						oF.setAttribute("name","obj-"+name);
						oF.value = "";
						for (oName in opt[name]) {
							oF.value+= oName+":"+opt[name][oName].toString();
						}
					} else {
						var oF = document.createElement("input");
						oF.setAttribute("name",name);
						oF.value = opt[name];
					}
					f.appendChild(oF);
				}
			}
			
			document.body.appendChild(f);
			f.submit();
		}

		this.render();
	}
}