Ti.App.Moment = require('vendor/moment');
exports.create = function() {
	var self = require('vendor/window').create();
	self.backgroundColor = '#21308F';
	if (!Ti.Network.online)
		return self;
	var leafletmap = Ti.UI.createWebView({
		url : 'http://tools.webmasterei.com/fahrradsternfahrt/',
		enableZoomControls : false,
		disableBounce : true,
		borderWidth : 1,
		borderRadius : 2,
		bottom : 50,
	});
	self.add(leafletmap);
	var timestamp = Ti.UI.createLabel({
		bottom : 0,
		color : '#ddd',
		width : Ti.UI.FILL,
		right : 5,
		textAlign : 'right',
		font : {
			fontFamily : 'Quartz-Regular',
			fontSize : 45
		}
	});
	var restartbutton = Ti.UI.createImageView({
		bottom : 0,
		width : 50,
		height : 50,
		left : 5,
		image : '/assets/restart.png'
	});
	var activityIndicator = Ti.UI.createActivityIndicator({
		style : (Ti.Android) ? Ti.UI.ActivityIndicatorStyle.BIG : Ti.UI.iPhone.ActivityIndicatorStyle.BIG,
	});
	self.add(activityIndicator);
	leafletmap.addEventListener('load', function() {
		activityIndicator.hide();
		if (self.cron)
			clearInterval(self.cron);
		self.cron = setInterval(function() {
			var time = leafletmap.evalJS('api.time');
			if (time)
				timestamp.setText(Ti.App.Moment.unix(time).format('HH:mm'));
		}, 100);
		self.add(timestamp);
		self.add(restartbutton);
	});
	restartbutton.addEventListener('click', function() {
		Ti.Media.vibrate();
		leafletmap.reload();
		activityIndicator.show();
	});
	return self;
};
