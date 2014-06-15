var withicons = (!Ti.Android || Ti.Android && Ti.Platform.Android.API_LEVEL < 14) ? true : false;
var withcamera =  (!Ti.Android || Ti.Android && Ti.Platform.Android.API_LEVEL >= 14) ? true : false;
exports.create = function() {
	var self = Ti.UI.createTabGroup({
		fullscreen : true,
		exitOnClose : true,
		title : 'Fahrradsternfahrt Hamburg'
	});
	var tabs = [];
	tabs.push(Ti.UI.createTab({
		icon : (withicons) ?'/assets/icons/compass.png':null,
		title : 'Karte',
		window : require('ui/map.window').create()
	}));
	
	tabs.push(Ti.UI.createTab({
		icon : (withicons) ?'/assets/icons/list.png':null,
		title : 'Zeitleiste',
		window : require('ui/timelist.window').create()
	}));
	tabs.push(Ti.UI.createTab({
		icon : (withicons) ?'/assets/icons/location.png':null,
		title : 'Umgebung',
		window : require('ui/umgebung.window').create()
	}));
	if (withcamera)	
		tabs.push(Ti.UI.createTab({
			icon : (withicons) ?'/assets/icons/list.png':null,
			title : 'Radlerphotos',
			window : require('ui/photolist.window').create()
		}));
	if (!Ti.Android || Ti.Android && Ti.Platform.Android.API_LEVEL >= 14) {
		tabs.push(Ti.UI.createTab({
			icon : (withicons) ?'/assets/icons/twitterbird.png':null,
			title : 'Twitter',
			window : require('ui/twitter/window').create()
		}));
		tabs.push(Ti.UI.createTab({
			title : 'Zeitraffer',
			window : require('ui/archiv.window').create()
		}));
	}
	for (var i = 0; i < tabs.length; i++) {
		self.addTab(tabs[i]);
	}
	Ti.Android && require('ui/tabgroup.menue')(self);
	return self;
};

