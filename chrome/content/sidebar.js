var sidebar = {
	
	onLoad: function()
	{
		window.top.document.getElementById("sidebar-splitter").hidden = true;
		beforeWidth = window.top.document.getElementById("sidebar-box").width;
		window.top.document.getElementById("sidebar-box").width = document.getElementById("easymath-sidebar").childNodes[2]["clientWidth"];
	},
	
	onUnload: function()
	{
		//alert(beforeWidth);
		window.top.document.getElementById("sidebar-box").width = beforeWidth;
		window.top.document.getElementById("sidebar-splitter").hidden = false;
	},
	
	addChar: function(c, root)
	{
		var element = content.document.activeElement;
		//alert(element.tagName + " " + element.type);
		if(((element.tagName == "INPUT") && (element.type == "text")) || (element.tagName == "TEXTAREA"))
		{
			var text = element.value;
			var start = element.selectionStart, end = element.selectionEnd;
			element.value = text.slice(0, start) + c + text.slice(end);
			element.focus();
			element.selectionStart = element.selectionEnd = start + c.length;
		}
		/*
		element.value += c;
		element.focus();
		*/
	}
};