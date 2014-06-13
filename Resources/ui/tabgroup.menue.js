module.exports = function(self) {
	self.addEventListener("open", function() {
		var activity = self.getActivity();
		if (activity && activity.actionBar) {
			activity.actionBar.setTitle('Fahrradsternfahrt Hamburg');
			activity.actionBar.setSubtitle('Rad fahren – Klima schützen!');
			activity.onCreateOptionsMenu = function(e) {
				Ti.App.addEventListener('startrecording', function() {
					e.menu.findItem("1").setChecked(true);
				});
				e.menu.add({
					title : "Aufnahme",
					showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS,
					itemId : "3",
					visible : true,
					icon : Ti.App.Android.R.drawable.ic_action_camera
				}).addEventListener("click", function() {
					require('ui/camera.widget').create();
				});

				e.menu.add({
					title : "Treffpunkte anzeigen",
					showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER,
					itemId : "0",
					checked : (Ti.App.Properties.getBool('MEETING')) ? true : false,
					checkable : true,
					visible : true
				}).addEventListener("click", function() {
					var mapwindow = self.tabs[0].getWindow();
					if ((Ti.App.Properties.getBool('MEETING'))) {
						e.menu.findItem("0").setChecked(false);
						mapwindow.mapview.removeAnnotations(mapwindow.annotations);
						Ti.App.Properties.setBool('MEETING',false);
					} else {
						e.menu.findItem("0").setChecked(true);
						Ti.App.Properties.setBool('MEETING', true);
						mapwindow.mapview.addAnnotations(mapwindow.annotations);
					}

				});
				e.menu.add({
					title : "Standort senden",
					showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER,
					itemId : "1",
					checked : (Ti.App.Properties.hasProperty('RECORD')) ? true : false,
					checkable : true,
					visible : true
				}).addEventListener("click", function() {
					if ((Ti.App.Properties.hasProperty('RECORD'))) {
						e.menu.findItem("1").setChecked(false);
						Ti.App.Properties.removeProperty('RECORD');
						Ti.App.fireEvent('stoprecording');
					} else {
						Ti.App.Properties.setBool('RECORD',true);
						e.menu.findItem("1").setChecked(true);
						Ti.App.fireEvent('startrecording');
					}
				});
			};
		}
	});

};
