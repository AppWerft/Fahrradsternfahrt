exports.create = function() {
	var self = Ti.UI.createTabGroup({
		fullscreen : true,
		exitOnClose : true,
	});
	var tabs = [Ti.UI.createTab({
		icon : Ti.Android ? null : '/assets/map.png',
		title : 'Karte',
		window : require('ui/map.window').create()
	}), Titanium.UI.createTab({
		icon : Ti.Android ? null : 'assets/location.png',
		title : 'Zeitleiste',
		window : require('ui/timelist.window').create()
	}),Titanium.UI.createTab({
		icon : Ti.Android ? null : 'assets/location.png',
		title : '#fsfhh @ Twitter',
		window : require('ui/twitter/window').create()
	})];
	for (var i = 0; i < tabs.length; i++) {
		self.addTab(tabs[i]);
	}
	if (Ti.Android) {

		self.addEventListener("open", function() {
			var activity = self.getActivity();
			if (activity && activity.actionBar) {
				activity.actionBar.setTitle('Fahrradsternfahrt Hamburg');
				activity.actionBar.setSubtitle('Rad fahren – Klima schützen!');
				activity.onCreateOptionsMenu = function(e) {
					e.menu.add({
						title : "Treffpunkte anzeigen",
						showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER,
						itemId : 0,
						checked : (Ti.App.Properties.hasProperty('MEETING')) ? true : false,
						checkable : true,
						visible : true
					}).addEventListener("click", function() {
						var mapwindow = self.tabs[0].getWindow();
						if ((Ti.App.Properties.hasProperty('MEETING'))) {
							e.menu.getItem(0).checked = false;
							mapwindow.mapview.removeAnnotations(mapwindow.annotations);
							Ti.App.Properties.removeProperty('MEETING');
						} else {
							e.menu.getItem(0).checked = true;
							Ti.App.Properties.setString('MEETING','active');
							mapwindow.mapview.addAnnotations(mapwindow.annotations);
						}
						
					});
					e.menu.add({
						title : "Standort senden",
						showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER,
						itemId : 1,
						checked : (Ti.App.Properties.hasProperty('RECORD')) ? true : false,
						checkable : true,
						visible : true
					}).addEventListener("click", function() {
						if ((Ti.App.Properties.hasProperty('RECORD'))) {
							e.menu.getItem(1).checked = false;
							Ti.App.Properties.removeProperty('RECORD');
						} else {
							Ti.App.Properties.setString('RECORD','active');
							e.menu.getItem(1).checked = true;
						}	
					});
				};
			}
		});
	}

	return self;
};

