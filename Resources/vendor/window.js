exports.create = function() {
	var options = arguments[0] || {};
	var self = Ti.UI.createWindow({
		fullscreen : true,
		backgroundColor : 'transparent',
		modal : false
	});
	if (Ti.Android) {
		self.addEventListener("open", function() {
			var activity = self.getActivity();
			if (activity && activity.actionBar) {
				activity.actionBar.setDisplayHomeAsUp(true);
				options.title && activity.actionBar.setTitle(options.title);
				options.subtitle && activity.actionBar.setSubtitle(options.subtitle);
				activity.actionBar.onHomeIconItemSelected = function() {
					self.close();
					console.log('Info: window closed (after click)');
				};
			}
		});
	};
	return self;
};
