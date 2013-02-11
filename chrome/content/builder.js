var easymath = {
	TABLE_CONTENT: "INSERT INTO usersymbols (code, priority) SELECT 43, 0 UNION ALL SELECT 8722, 1 UNION ALL SELECT 177, 2 UNION ALL SELECT 215, 3 UNION ALL SELECT 8729, 4 UNION ALL SELECT 247, 5 UNION ALL SELECT 8725, 6 UNION ALL SELECT -1, 7 UNION ALL SELECT 61, 8 UNION ALL SELECT 8800, 9 UNION ALL SELECT 8776, 10 UNION ALL SELECT 8801, 11 UNION ALL SELECT 60, 12 UNION ALL SELECT 62, 13 UNION ALL SELECT 8804, 14 UNION ALL SELECT 8805, 15 UNION ALL SELECT -1, 16 UNION ALL SELECT 189, 17 UNION ALL SELECT 8531, 18 UNION ALL SELECT 8532, 19 UNION ALL SELECT 188, 20 UNION ALL SELECT 190, 21 UNION ALL SELECT 8533, 22 UNION ALL SELECT 8534, 23 UNION ALL SELECT 8535, 24 UNION ALL SELECT 8536, 25 UNION ALL SELECT 8537, 26 UNION ALL SELECT 8538, 27 UNION ALL SELECT 8539, 28 UNION ALL SELECT 8540, 29 UNION ALL SELECT 8541, 30 UNION ALL SELECT 8542, 31 UNION ALL SELECT 8543, 32 UNION ALL SELECT 8260, 33 UNION ALL SELECT -1, 34 UNION ALL SELECT 8304, 35 UNION ALL SELECT 185, 36 UNION ALL SELECT 178, 37 UNION ALL SELECT 179, 38 UNION ALL SELECT 8308, 39 UNION ALL SELECT 8309, 40 UNION ALL SELECT 8310, 41 UNION ALL SELECT 8311, 42 UNION ALL SELECT 8312, 43 UNION ALL SELECT 8313, 44 UNION ALL SELECT 8314, 45 UNION ALL SELECT 8319, 46 UNION ALL SELECT -1, 47 UNION ALL SELECT 8320, 48 UNION ALL SELECT 8321, 49 UNION ALL SELECT 8322, 50 UNION ALL SELECT 8323, 51 UNION ALL SELECT 8324, 52 UNION ALL SELECT 8325, 53 UNION ALL SELECT 8326, 54 UNION ALL SELECT 8327, 55 UNION ALL SELECT 8328, 56 UNION ALL SELECT 8329, 57 UNION ALL SELECT 8330, 58 UNION ALL SELECT 8331, 59 UNION ALL SELECT 8332, 60 UNION ALL SELECT 8333, 61 UNION ALL SELECT 8334, 62 UNION ALL SELECT -1, 63 UNION ALL SELECT 8719, 64 UNION ALL SELECT 8721, 65 UNION ALL SELECT 8706, 66 UNION ALL SELECT 8747, 67 UNION ALL SELECT 8730, 68 UNION ALL SELECT 8710, 69 UNION ALL SELECT 8734, 70 UNION ALL SELECT 176, 71 UNION ALL SELECT 8745, 72 UNION ALL SELECT -1, 73 UNION ALL SELECT 945, 74 UNION ALL SELECT 946, 75 UNION ALL SELECT 960, 76 UNION ALL SELECT 937, 77 UNION ALL SELECT -1, 78",
	
	updateList: function(t) 
	{
		dump(t.value + '\n');
		var strings = document.getElementById("nameStrings");
		var enumerator = document.getElementById("nameStrings").strings;
		
		var symbolList = document.getElementById("symbol-list");
		while(symbolList.hasChildNodes())
		{
			symbolList.removeChild(symbolList.firstChild);
		}
		for(var i = 0; i <= 0xff; i++)
		{
			var code = categories[t.value] + i;
			try
			{
				var name = strings.getString(code);
				if(name != null)
				{
					var label = document.createElement("label");
					label.setAttribute("draggable", true);
					label.setAttribute("value", String.fromCharCode(code));
					label.setAttribute("tooltiptext", name);
					label.setAttribute("data-symbol", "symbols");
					label.setAttribute("data-code", code);
					label.addEventListener("dragstart", easymath.onDragStart);
					label.addEventListener("dragend", easymath.onDragEnd);
					symbolList.appendChild(label);
				}
			}
			catch(e)
			{
			}
		}		
		return true;
	},
	
	loadUserSymbols: function()
	{
		easymath.loadSpecialSymbols();
	
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
		statement.executeAsync({handleResult: easymath.handleSQLiteResults});
		dbConn.asyncClose();
	},
	
	loadSpecialSymbols: function()
	{
		var specialList = document.getElementById("special-symbols");
		var builderStrings = document.getElementById("builderStrings");
		var label = document.createElement("label");
		label.setAttribute("draggable", true);
		try
		{
			label.setAttribute("value", String.fromCharCode(builderStrings.getString("arrow")));
			label.setAttribute("tooltiptext", builderStrings.getString("linebreak"));
		}
		catch(e)
		{
		}
		label.setAttribute("data-symbol", "symbols");
		label.setAttribute("data-code", -1);
		label.addEventListener("dragstart", easymath.onDragStart);
		label.addEventListener("dragend", easymath.onDragEnd);
		specialList.appendChild(label);
	},
	
	handleSQLiteResults: function(aResultSet)
	{
		var nameStrings = document.getElementById("nameStrings");
		var builderStrings = document.getElementById("builderStrings");
		var container = document.getElementById("user-symbols");
		for (var row = aResultSet.getNextRow(); row; row = aResultSet.getNextRow()) 
		{
			var code = row.getResultByName("code");
			var label = document.createElement("label");
			label.setAttribute("draggable", true);
			label.setAttribute("data-symbol", "user");
			label.setAttribute("data-code", code);
			if(code != -1)
			{
				label.setAttribute("value", String.fromCharCode(code));
				try
				{
					label.setAttribute("tooltiptext", nameStrings.getString(code));
				}
				catch(e)
				{
				}
			}
			else
			{
				label.setAttribute("value", String.fromCharCode(builderStrings.getString("arrow")));
				label.setAttribute("tooltiptext", builderStrings.getString("linebreak"));
				label.setAttribute("class", "linebreak");
			}
			label.addEventListener("dragstart", easymath.onDragStart);
			label.addEventListener("drop", easymath.onDrop);
			label.addEventListener("dragover", easymath.onDragOver);
			label.addEventListener("dragend", easymath.onDragEnd);
			container.appendChild(label);
		}
	},
	
	handleSQLiteSaving: function(aResultSet)
	{
		
	},
	
	onDragStart: function(event)
	{
		var elementCopy = document.getElementById("hidden-image");
		if(elementCopy == null)
		{
			elementCopy = event.target.cloneNode(event.target);
			elementCopy.id = "hidden-image";
			document.getElementById("hide-it").appendChild(elementCopy);
		}
		elementCopy.setAttribute("value", event.target.getAttribute("value"));
		//dump(event.pageX + " " + event.target.boxObject.x + " " + event.pageY + " " + event.target.boxObject.y + "\n");
		//var dx = event.pageX - event.target.boxObject.x;
		//var dy = event.pageY - event.target.boxObject.y;
		event.dataTransfer.setDragImage(elementCopy, event.target.boxObject.height / 4 * 3, event.target.boxObject.width / 4 * 3);
		event.target.id = "dragged-node";
		event.dataTransfer.setData('text/plain', event.target.id);
		var insertLabel = document.getElementById("insert-label");
		var userSymbols = document.getElementById("user-symbols");
		if(insertLabel == null)
		{
			insertLabel = easymath.createInsertLabel();
		}
		if(event.target.getAttribute("data-symbol") == "user")
		{
			//dump("user-symbol-picked\n");
			userSymbols.insertBefore(insertLabel, event.target);
		}
		else
		{
			//dump("to-the-back\n");
			userSymbols.appendChild(insertLabel);
		}
	},
	
	onDrop: function(event)
	{
		dump("onDrop\n");
		//dump(event.target.id + "\n");
		if(event.target.id == "insert-label")
		{
			var element = document.getElementById(event.dataTransfer.getData('text/plain'));
			element.id = null;
			if(element.getAttribute("data-symbol") == "user")
			{
				var userSymbols = document.getElementById("user-symbols");
				userSymbols.removeChild(element);
				userSymbols.replaceChild(element, event.target);
			}
			else if(element.getAttribute("data-symbol") == "symbols")
			{
				
				var userSymbols = document.getElementById("user-symbols");
				var elementCopy = element.cloneNode(false);
				elementCopy.setAttribute("draggable", true);
				elementCopy.setAttribute("value", element.getAttribute("value"));
				elementCopy.addEventListener("drop", easymath.onDrop);
				elementCopy.addEventListener("dragover", easymath.onDragOver);
				elementCopy.addEventListener("dragstart", easymath.onDragStart);
				elementCopy.addEventListener("dragend", easymath.onDragEnd);
				elementCopy.setAttribute("data-symbol", "user");
				elementCopy.setAttribute("data-code", element.getAttribute("data-code"));
				userSymbols.replaceChild(elementCopy, event.target);
			}
		}
		else
		{
			var element = document.getElementById(event.dataTransfer.getData('text/plain'));
			element.id = null;
			if(element.getAttribute("data-symbol") == "user")
			{
				element.parentNode.removeChild(element);
			}
		}
	},
	
	onDragEnd: function(event)
	{
		dump("dragend\n");
		var insertLabel = document.getElementById("insert-label");
		if(insertLabel != null)
		{
			insertLabel.parentNode.removeChild(insertLabel);
		}
		var dragged = document.getElementById(event.dataTransfer.getData('text/plain'));
		while(dragged != null)
		{
			dragged.id = null;
			dragged = document.getElementById(event.dataTransfer.getData('text/plain'));
		}
	},
	
	saveBuild: function()
	{
		Components.utils.import("resource://gre/modules/Services.jsm");
		Components.utils.import("resource://gre/modules/FileUtils.jsm");
 
		var file = FileUtils.getFile("ProfD", ["easyMath", "easymath.sqlite"]);
		var dbConn = Services.storage.openDatabase(file); // Will also create the file if it does not exist
		if(document.getElementById("user-symbols").getElementsByTagName("label").length > 0)
		{
			var elements = document.getElementById("user-symbols").getElementsByTagName("label");
			var s = "INSERT INTO usersymbols (code, priority) ";
			s += "SELECT " + elements[0].getAttribute("data-code") + ", " + 0;
			for(var i = 1; i < elements.length; i++)
			{
				s += " UNION ALL SELECT " + elements[i].getAttribute("data-code") + ", " + i;
			}
			dump(s + "\n");
			//alert(s);
			dbConn.executeSimpleSQL("DELETE FROM usersymbols");
			var statement = dbConn.createStatement(s);
			statement.executeAsync();
		}
		else
		{
			dbConn.executeSimpleSQL("DELETE FROM usersymbols");
		}
		dbConn.asyncClose();
	},
	
	onDragOver: function(event)
	{
		event.dataTransfer.dropEffect = "copy";
		if(event.target.tagName == "label")
		{
			var insertLabel = document.getElementById("insert-label");
			var userSymbols = document.getElementById("user-symbols");
			var jump = false;
			if(insertLabel == null)
			{
				insertLabel = easymath.createInsertLabel();
			}
			else
			{
				jump = (insertLabel.compareDocumentPosition(event.target) == 4) 
					&& (insertLabel.nextSibling == event.target);
				userSymbols.removeChild(insertLabel);
			}
			userSymbols.insertBefore(insertLabel, (jump ? event.target.nextSibling : event.target));
			
		}/*
		else if(event.target.id == "user-symbols")
		{
			event.preventDefault();
			var insertLabel = document.getElementById("insert-label");
			var userSymbols = document.getElementById("user-symbols");
			if(userSymbols.childNodes.length < 2)
			{
				if(insertLabel == null)
				{
					insertLabel = easymath.createInsertLabel();
				}
				else
				{
					insertLabel.parentNode.removeChild(insertLabel);
				}
				
					userSymbols.appendChild(insertLabel);
					event.preventDefault();
			}
		}*/
	},
	
	dragScroll : function(event)
	{
		dump(event.currentTarget.scrollTop + " " + event.currentTarget.scrollTopMax + " " + event.layerY + " " + event.currentTarget.boxObject.height + "\n");
		dump(event.target.tagName + " " + event.originalTarget.tagName + " " + event.currentTarget.tagName + "\n");
		var width = 30;
		if(event.layerY - event.currentTarget.scrollTop < width)
		{
			if(event.currentTarget.scrollTop > 0)
			{
				event.currentTarget.scrollTop--;
			}
		}
		else if(event.currentTarget.boxObject.height - (event.layerY - event.currentTarget.scrollTop) < width)
		{
			if(event.currentTarget.scrollTop < event.currentTarget.scrollTopMax)
			{
				event.currentTarget.scrollTop++;
			}
		}
		
	},
	
	createInsertLabel: function()
	{
		var insertLabel = document.createElement("label");
		insertLabel.id = "insert-label";
		insertLabel.setAttribute("class", "insert");
		insertLabel.setAttribute("data-symbol", "insert");
		insertLabel.addEventListener("drop", easymath.onDrop);
		insertLabel.addEventListener("dragover", function(event){event.preventDefault();});
		return insertLabel;
	}
};

var categories = [0, 0x100, 0x200, 0x300, 0x400, 0x2000, 0x2100, 0x2200, 0x2300, 0x2400, 0x2500,
				  0x2600, 0x2700, 0x2900, 0x2a00, 0x3000, 0xfb00, 0xfe00, 0x1d400, 0x1d500,
				  0x1d600, 0x1d700];

