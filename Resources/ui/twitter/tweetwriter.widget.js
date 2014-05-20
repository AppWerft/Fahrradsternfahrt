exports.create = function() {
	var input = Ti.UI.createTextArea({
		barColor : '#00597C',
		value : '',
		opacity : 0.8,
		color : 'black',
		height : '170dp',
		backgroundColor : '#ccc',
		top : 0,
		font : {
			fontSize : '20dp'
		},
		bottom : '30dp',
		enableReturnKey : true,
		width : Ti.UI.FILL,
	});
	var progressbar = Ti.UI.createProgressBar({
		height : '30dp',
		width : Ti.UI.FILL,
		min : 0,
		value : 5,
		bottom : 0,
		max : 180
	});
	var androidview = Ti.UI.createView({
		height : '200dp'
	});
	androidview.add(progressbar);
	androidview.add(input);
	input.focus();
	input.addEventListener('return', function(_e) {
		input.blur();
	});
	var self = Ti.UI.createAlertDialog({
		cancel : 0,
		persistent : false,
		buttonNames : ['Abbruch', 'Twittern'],
		androidView : androidview,
		//message: 'Would you like to delete the file?',
		title : 'Twitterschreibmaschine'
	});
	self.addEventListener('click', function(e) {
		if (e.index === e.source.cancel) {
		}
	});

	input.addEventListener('change', function(_e) {
		progressbar.setValue(_e.source.value.length);

	});
	self.addEventListener('click', function(_e) {
		if (_e.index == 1)
			Ti.App.Twitter.addTweet({
				tweet : input.getValue(),
				ontweeted : function() {
					self.fireEvent('tweeted');
				}
			});
	});
	return self;
};

