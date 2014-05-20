exports.create = function() {
	var self = require('vendor/window').create();
	self.listview = Ti.UI.createListView({
		height : Ti.UI.FILL,
		templates : {
			'template' : require('ui/TEMPLATES').nearme
		},
		defaultItemTemplate : 'template',
	});
	var places = Ti.App.Sternfahrt.getAllPoints();
	var dataitems = [];
	for (var i = 0; i < places.length; i++) {
		var p = places[i];
		if (p.title != "")
			dataitems.push({
				properties : {
					itemId : p
				},
				title : {
					text : p.title,
					color : p.rgb
				},
				zeit : {
					text : p.zeit
				},
				subtitle : {
					text : p.subtitle,
					color : p.rgb
				}
			});
	}
	self.listview.sections = [Ti.UI.createListSection({
		items : dataitems
	})];
	self.add(self.listview);
	return self;
};

