var easymath = {
	TABLE_CONTENT: "INSERT INTO usersymbols (code, priority) SELECT 43, 0 UNION ALL SELECT 8722, 1 UNION ALL SELECT 177, 2 UNION ALL SELECT 215, 3 UNION ALL SELECT 8729, 4 UNION ALL SELECT 247, 5 UNION ALL SELECT 8725, 6 UNION ALL SELECT -1, 7 UNION ALL SELECT 61, 8 UNION ALL SELECT 8800, 9 UNION ALL SELECT 8776, 10 UNION ALL SELECT 8801, 11 UNION ALL SELECT 60, 12 UNION ALL SELECT 62, 13 UNION ALL SELECT 8804, 14 UNION ALL SELECT 8805, 15 UNION ALL SELECT -1, 16 UNION ALL SELECT 189, 17 UNION ALL SELECT 8531, 18 UNION ALL SELECT 8532, 19 UNION ALL SELECT 188, 20 UNION ALL SELECT 190, 21 UNION ALL SELECT 8533, 22 UNION ALL SELECT 8534, 23 UNION ALL SELECT 8535, 24 UNION ALL SELECT 8536, 25 UNION ALL SELECT 8537, 26 UNION ALL SELECT 8538, 27 UNION ALL SELECT 8539, 28 UNION ALL SELECT 8540, 29 UNION ALL SELECT 8541, 30 UNION ALL SELECT 8542, 31 UNION ALL SELECT 8543, 32 UNION ALL SELECT 8260, 33 UNION ALL SELECT -1, 34 UNION ALL SELECT 8304, 35 UNION ALL SELECT 185, 36 UNION ALL SELECT 178, 37 UNION ALL SELECT 179, 38 UNION ALL SELECT 8308, 39 UNION ALL SELECT 8309, 40 UNION ALL SELECT 8310, 41 UNION ALL SELECT 8311, 42 UNION ALL SELECT 8312, 43 UNION ALL SELECT 8313, 44 UNION ALL SELECT 8314, 45 UNION ALL SELECT 8319, 46 UNION ALL SELECT -1, 47 UNION ALL SELECT 8320, 48 UNION ALL SELECT 8321, 49 UNION ALL SELECT 8322, 50 UNION ALL SELECT 8323, 51 UNION ALL SELECT 8324, 52 UNION ALL SELECT 8325, 53 UNION ALL SELECT 8326, 54 UNION ALL SELECT 8327, 55 UNION ALL SELECT 8328, 56 UNION ALL SELECT 8329, 57 UNION ALL SELECT 8330, 58 UNION ALL SELECT 8331, 59 UNION ALL SELECT 8332, 60 UNION ALL SELECT 8333, 61 UNION ALL SELECT 8334, 62 UNION ALL SELECT -1, 63 UNION ALL SELECT 8719, 64 UNION ALL SELECT 8721, 65 UNION ALL SELECT 8706, 66 UNION ALL SELECT 8747, 67 UNION ALL SELECT 8730, 68 UNION ALL SELECT 8710, 69 UNION ALL SELECT 8734, 70 UNION ALL SELECT 176, 71 UNION ALL SELECT 8745, 72 UNION ALL SELECT -1, 73 UNION ALL SELECT 945, 74 UNION ALL SELECT 946, 75 UNION ALL SELECT 960, 76 UNION ALL SELECT 937, 77 UNION ALL SELECT -1, 78",
	
	onLoad: function()
	{
		var btns = document.getElementById("symbols").getElementsByTagName("button");
		for(var i = 1; i < btns.length; i++)
		{
			btns[i].setAttribute("label", String.fromCharCode(btns[i].getAttribute("data-code")));
		}
		var di = document.createElement("div");
		document.appendChild(di);
	},
	
	onUnload: function()
	{
		
	},
	
	loadSymbols: function()
	{
		Components.utils.import("resource://gre/modules/Services.jsm");
		Components.utils.import("resource://gre/modules/FileUtils.jsm");
		
		var file = FileUtils.getFile("ProfD", ["easyMath", "easymath.sqlite"]);
		if(!file.exists())
		{
			var db = Services.storage.openDatabase(file);
			db.executeSimpleSQL("CREATE TABLE usersymbols (code INTEGER, priority INTEGER)");
			db.executeSimpleSQL(easymath.TABLE_CONTENT);
		}
		
		var dbConn = Services.storage.openDatabase(file); // Will also create the file if it does not exist
		
		var statement = dbConn.createStatement("SELECT code FROM usersymbols ORDER BY priority");
		
		statement.executeAsync({handleResult: easymath.resultHandler });
		dbConn.asyncClose();
	},
	
	resultHandler: function(aResultSet) 
	{
		var nameStrings = document.getElementById("nameStrings");
		var container = document.getElementById("symbols");
		for (let row = aResultSet.getNextRow(); row; row = aResultSet.getNextRow()) 
		{
			var code = row.getResultByName("code");
			switch(code)
			{
			case -1:
				dump("yeah, spacer\n");
				var newline = document.createElement("br");
				container.appendChild(newline);
				break;
			default:
				var btn = document.createElement("button");
				btn.setAttribute("label", String.fromCharCode(code));
				btn.addEventListener("click", easymath.addChar);
				try
				{
					btn.setAttribute("tooltiptext", nameStrings.getString(row.getResultByName("code")));
				}
				catch(e)
				{
				}
				container.appendChild(btn);
				break;
			}
		}
	},
	
	addChar: function(event)
	{
		var element = content.document.activeElement;
		if(((element.tagName == "INPUT") && (element.type == "text")) || (element.tagName == "TEXTAREA"))
		{
			var text = element.value;
			var start = element.selectionStart, end = element.selectionEnd;
			var scrolltop = element.scrollTop;
			var c = event.target.getAttribute("label");
			element.value = text.slice(0, start) + c + text.slice(end);
			element.focus();
			element.selectionStart = element.selectionEnd = start + c.length + (offset ? offset : 0);
			if(scrolltop)
				element.scrollTop = scrolltop;
		}
		e.stopPropagation();
	},
	
	loadSettings: function()
	{ 
		var strings = new Array("Common", "Comparison", "Fractions", "Superscript", "Arrows", "Other", "Greek", "Specific");
		for(i = 0; i < strings.length; i++)
			document.getElementById("group" + strings[i]).getElementsByTagName("vbox")[0].hidden = Application.prefs.get("extensions.easymath.hide" + strings[i]).value;
		
		if(!document.getElementById("groupGreek").hidden)
		{	
			var greek = Application.prefs.get("extensions.easymath.greek").value;
			var letters = "ΑαΒβΓγΔδΕεΖζΗηΘθΙιΚκΛλΜμΝνΞξΟοΠπΡρΣσΤτΥυΦφΧχΨψΩω";
			var lettersNames = new Array("alpha", "beta", "gamma", "delta", "epsilon", "zeta", "eta", "theta", "iota",
										 "kappa" , "lambda", "mu", "nu", "xi", "omicron", "pi", "rho", "sigma", "tau", 
										 "upsilon", "phi", "chi", "psi", "omega");
			var stringbundle = document.getElementById("stringbundle");
			var hbox = document.createElement("hbox");
			var container = document.getElementById("groupGreek").getElementsByTagName("vbox")[0];
			container.appendChild(hbox);
			
			for(i = 0; i < greek.length; i++)
			{
				if(greek[i] == "1")
				{
					var button = document.createElement("button");
					hbox.appendChild(button);
					button.setAttribute("label", letters[i]);
					button.setAttribute("tooltiptext", stringbundle.getString(lettersNames[(i - i%2)/2]));
					button.addEventListener("click", function(event){easymath.addChar(event, event.target.label, false)});
					if(hbox.childNodes.length == 7)
					{
						hbox = document.createElement("hbox");
						container.appendChild(hbox);
					}
				}
			}
		}
	},
	
	collapseGroup: function(e, element)
	{
		if(e.target == element || e.target.tagName == "caption")
		{
			var vbox = element.getElementsByTagName("vbox")[0];
			vbox.hidden = !vbox.hidden;
		}
	}
};