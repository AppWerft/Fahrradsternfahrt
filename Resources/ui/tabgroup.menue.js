exports.create = function(self) {
	self.addEventListener("open", function() {
		var activity = self.getActivity();
		if (activity && activity.actionBar) {
			activity.actionBar.setTitle('Fahrradsternfahrt Hamburg');
			activity.actionBar.setSubtitle('Rad fahren – Klima schützen!');
			activity.onCreateOptionsMenu = function(e) {
				
				
						e.menu.add({
							title : "Aufnahme",
							showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS,
							itemId : 3,
							visible : true,
							icon : Ti.App.Android.R.drawable.ic_action_camera
						}).addEventListener("click", function() {
							require('ui/camera.widget').create();
						});
		
				
				
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
						Ti.App.Properties.setString('MEETING', 'active');
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
						Ti.App.Properties.setString('RECORD', 'active');
						e.menu.getItem(1).checked = true;
					}
				});
			};
		}
	});

};
