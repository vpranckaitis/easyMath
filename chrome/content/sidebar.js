var sidebar = {
	
	onLoad: function()
	{
		
		this.loadSettings();
		this.beforeWidth = window.top.document.getElementById("sidebar-box").width;
		window.top.document.getElementById("sidebar-box").width = 0;
		window.top.document.getElementById("sidebar-box").width	= document.getElementById("container").scrollWidth + 15;
		window.top.document.getElementById("sidebar-splitter").hidden = true;
	},
	
	onUnload: function()
	{
		window.top.document.getElementById("sidebar-splitter").hidden = false;
		window.top.document.getElementById("sidebar-box").width = this.beforeWidth;
	},
	
	addChar: function(c, code, offset)
	{
		var element = content.document.activeElement;
		if(((element.tagName == "INPUT") && (element.type == "text")) || (element.tagName == "TEXTAREA"))
		{
			var text = element.value;
			var start = element.selectionStart, end = element.selectionEnd;
			
			//if HTML or BBcode
			if(code && document.getElementById("html-bb").selectedIndex == 0)
			{
				c = c.replace(/\[/g, '<').replace(/\]/g, '>');
			}
			
			element.value = text.slice(0, start) + c + text.slice(end);
			element.focus();
			element.selectionStart = element.selectionEnd = start + c.length + (offset ? offset : 0);
			
		}
	},
	
	loadSettings: function()
	{ 
		var strings = new Array("Common", "Comparison", "Fractions", "Superscript", "Other", "Greek", "Specific");
		for(i = 0; i < strings.length; i++)
			document.getElementById("group" + strings[i]).hidden = Application.prefs.get("extensions.easymath.hide" + strings[i]).value;
		
		if(!document.getElementById("groupGreek").hidden)
		{	
			var greek = Application.prefs.get("extensions.easymath.greek").value;
			var letters = "ΑαΒβΓγΔδΕεΖζΗηΘθΙιΚκΛλΜμΝνΞξΟοΠπΡρΣσΤτΥυΦφΧχΨψΩω";
			var lettersNames = new Array("alpha", "beta", "gamma", "delta", "epsilon", "zeta", "eta", "theta", "iota",
										 "kappa" , "lambda", "mu", "nu", "xi", "omicron", "pi", "rho", "sigma", "tau", 
										 "upsilon", "phi", "chi", "psi", "omega");
			var stringbundle = document.getElementById("stringbundle");
			var hbox = document.createElement("hbox");
			document.getElementById("groupGreek").appendChild(hbox);
			
			for(i = 0; i < greek.length; i++)
			{
				if(greek[i] == "1")
				{
					var button = document.createElement("button");
					hbox.appendChild(button);
					button.setAttribute("label", letters[i]);
					button.setAttribute("tooltiptext", stringbundle.getString(lettersNames[(i - i%2)/2]));
					button.addEventListener("command", function(event){sidebar.addChar(event.target.label, false)});
					if(hbox.childNodes.length == 7)
					{
						hbox = document.createElement("hbox");
						document.getElementById("groupGreek").appendChild(hbox);
					}
				}
			}
		}
	}
};