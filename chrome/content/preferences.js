var preferences =
{	
	onLoad: function()
	{
		this.getGreek();
	},
	
	getGreek: function()
	{
		var checkboxes = document.getElementById("greekLetterBox").getElementsByTagName("checkbox");
		var pref = Application.prefs.get("extensions.easymath.greek").value;
		for(i = 0; i < pref.length; i++)
		{
			checkboxes[i].checked = pref[i] == "1";
		}
	},
	
	setGreek: function(richlistbox)
	{
		var letters = "";
		var checkboxes = richlistbox.getElementsByTagName("checkbox");
		var pref = "";
		for(i = 0; i < checkboxes.length; i++)
		{
			pref += checkboxes[i].checked ? "1" : "0";	
		}
		return pref;
	}
}
