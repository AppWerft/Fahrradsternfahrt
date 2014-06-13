exports.create = function() {
	var self = require('vendor/window').create();
	self.barColor = '#F7A900';
	self.title = 'Treffpunkte in der Nähe';
	function addList() {
		self.listview = Ti.UI.createListView({
			height : Ti.UI.FILL,backgroundColor : 'white',
			templates : {
				'template' : require('ui/TEMPLATES').nearme
			},
			defaultItemTemplate : 'template',
		});
		Ti.App.Sternfahrt.getAllPointsByPosition(function(places) {
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
						starttime : {
							text : p.zeit
						},
						distance : {
							text : 'Entfernung: ' + p.disttext
						},
						fulltext : {
							text : p.description
						}
					});
			}
			self.listview.sections = [Ti.UI.createListSection({
				items : dataitems
			})];
			self.add(self.listview);

		});
	};
	self.addEventListener('focus', function() {
		if (!self.listadded) {
			self.listadded = true;
			addList();
		}
	});
	return self;
};

