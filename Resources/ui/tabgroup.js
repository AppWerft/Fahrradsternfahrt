exports.create = function() {
	var self = Ti.UI.createTabGroup({
		fullscreen : true,
		exitOnClose : true,
	});
	var tabs = [Ti.UI.createTab({
		icon : Ti.Android ? null : '/assets/icons/compass.png',
		title : 'Karte',
		window : require('ui/map.window').create()
	}), Titanium.UI.createTab({
		icon : Ti.Android ? null : '/assets/icons/list.png',
		title : 'Zeitleiste',
		window : require('ui/timelist.window').create()
	}), Titanium.UI.createTab({
		icon : Ti.Android ? null : '/assets/icons/location.png',
		title : 'Umgebung',
		window : require('ui/umgebung.window').create()
	}),Titanium.UI.createTab({
		icon : Ti.Android ? null : '/assets/icons/twitterbird.png',
		title : '#fsfHH',
		window : require('ui/twitter/window').create()
	})];
	for (var i = 0; i < tabs.length; i++) {
		self.addTab(tabs[i]);
	}
	Ti.Android && require('ui/tabgroup.menue').create(self);
	return self;
};

