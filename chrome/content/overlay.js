var easymath = {
	onLoad: function() 
	{
		// initialization code
		this.initialized = true;
		this.strings = document.getElementById("easymath-strings");
		document.getElementById("contentAreaContextMenu")
          .addEventListener("popupshowing", function (e){ easymath.showFirefoxContextMenu(e); }, false);
	},

	onMenuItemCommand: function(e) 
	{
		
		var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
									.getService(Components.interfaces.nsIPromptService);
		promptService.alert(window, this.strings.getString("helloMessageTitle"),
									this.strings.getString("helloMessage"));
		
		//toggleSidebar("chrome://easymath/content/sidebar.xul");
	},

	onToolbarButtonCommand: function(e) 
	{
		// just reuse the function above.  you can change this, obviously!
		easymath.onMenuItemCommand(e);
	},
	
	showFirefoxContextMenu: function(e) 
	{
		// show or hide the menuitem based on what the context menu is on
		document.getElementById("context-easymath").hidden = gContextMenu.onImage;
	}
};

window.addEventListener("load", function () { easymath.onLoad(); }, false);
