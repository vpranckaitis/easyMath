var sidebar = {
	
	onLoad: function()
	{
		window.top.document.getElementById("sidebar-splitter").hidden = true;
		this.loadSettings();
		this.beforeWidth = window.top.document.getElementById("sidebar-box").width;
		window.top.document.getElementById("sidebar-box").width = document.getElementById("container").clientWidth;
	},
	
	onUnload: function()
	{
		window.top.document.getElementById("sidebar-box").width = this.beforeWidth;
		window.top.document.getElementById("sidebar-splitter").hidden = false;
	},
	
	addChar: function(c, root)
	{
		var element = content.document.activeElement;
		if(((element.tagName == "INPUT") && (element.type == "text")) || (element.tagName == "TEXTAREA"))
		{
			var text = element.value;
			var start = element.selectionStart, end = element.selectionEnd;
			element.value = text.slice(0, start) + c + text.slice(end);
			element.focus();
			element.selectionStart = element.selectionEnd = start + c.length;
		}
	},
	
	loadSettings: function()
	{ 
		var strings = new Array("Common", "Comparison", "Fractions", "Superscript", "Other", "Greek");
		for(i = 0; i < strings.length; i++)
			document.getElementById("group" + strings[i]).hidden = Application.prefs.get("extensions.easymath.hide" + strings[i]).value;
		
		if(!document.getElementById("groupGreek").hidden)
		{	
			var greek = Application.prefs.get("extensions.easymath.greek").value;
			var letters = "ΑαΒβΓγΔδΕεΖζΗηΘθΙιΚκΛλΜμΝνΞξΟοΠπΡρΣσΤτΥυΦφΧχΨψΩω";
			var lettersNames = new Array("alpha", "beta", "gamma", "delta", "epsilon", "zeta", "eta", "theta", "iota",
										 "kappa" , "lambda", "mu", "nu", "xi", "omicron", "pi", "rho", "sigma", "tau", 
										 "upsilon", "phi", "chi", "psi", "omega");
			setTimeout(function(){
			var hbox = document.createElement("hbox");
			document.getElementById("groupGreek").appendChild(hbox);
			for(i = 0; i < greek.length; i++)
			{
				if(greek[i] == "1")
				{
					var button = document.createElement("button");
					hbox.appendChild(button);
					button.label = letters[i];
					button.tooltiptext = "&easymathGreek." + lettersNames[i] + ";";
					button.oncommand = "sidebar.addChar(this.label, false)";
					if(hbox.childNodes.length == 7)
					{
						hbox = document.createElement("hbox");
						document.getElementById("groupGreek").appendChild(hbox);
					}
				}
			}
			}, 0);
		}
	}
};