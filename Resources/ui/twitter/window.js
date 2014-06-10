exports.create = function() {
	var self = Ti.UI.createWindow({
		fullscreen : true,
		backgroundColor : '#fff',
		barColor : '#CF6500',
		title : Ti.App.Properties.getString('twitter.handle') + ' @ twitter'
	});
	self.add(Ti.UI.createImageView({
		top : 0,
		width : Ti.Platform.displayCaps.platformWidth / Ti.Platform.displayCaps.logicalDensityFactor,
		height : 'auto',
		image : '/assets/radlerbg.jpg'
	}));
	self.add(Ti.UI.createLabel({
		top : 15,
		color : 'white',
		height : 70,
		text : 'echte Medienkompetenz – Danke und Respekt!'
	}));
	var ai = Ti.UI.createActivityIndicator({
		top : 20,
		left : 10

	});
	self.add(ai);
	ai.show();
	self.tweetList = Ti.UI.createTableView({
		height : Ti.UI.FILL,
		backgroundColor : 'black'
	});

	self.tweetList.addEventListener('click', function(_e) {
		require('ui/twitter/dialog.widget').create(self, _e);
	});

	function updateTweetsOnGUI() {
		Ti.App.Twitter.fetch('search_tweets', Ti.App.Properties.getString('twitter.handle'), function(_response) {
			self.tweetList.animate({
				top : 0,
				duration : 500
			});
			if (!_response || !_response.statuses)
				return;
			var data = [];
			for (var i = 0; i < _response.statuses.length; i++) {
				data.push(require('ui/twitter/tweet').create(_response.statuses[i]));
			}
			self.tweetList.setData(data);
		});
	}
	self.add(self.tweetList);
	self.addEventListener('reload!', function() {
		updateTweetsOnGUI();
	});
	self.dialog = require('ui/twitter/tweetwriter.widget').create();
	self.addEventListener('write!', function() {
		Ti.App.Twitter.authorize(function(_reply) {
			if (_reply.success == true) {
				self.dialog.show();
			}
		});
	});
	updateTweetsOnGUI();
	var touchstart = 9999;
	self.addEventListener('touchstart', function(_e) {
		touchstart = _e.y;
	});
	self.addEventListener('swipe', function(_e) {
		console.log(touchstart);
		console.log(_e.y / Ti.Platform.displayCaps.logicalDensityFactor);
		if (_e.direction == 'down' && touchstart < 150 * Ti.Platform.displayCaps.logicalDensityFactor) {// actionbar, tabgroup
			touchstart = 9999;
			self.tweetList.animate({
				top : 70,
				duration : 700
			});
			updateTweetsOnGUI();
		}
	});
	return self;
};

