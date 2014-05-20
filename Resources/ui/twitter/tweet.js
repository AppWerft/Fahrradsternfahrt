exports.create = function(tweet) {
	var row = Ti.UI.createTableViewRow({
		user : tweet.user,
		tweet : tweet.text,
		hasDetails : true,
		height : Ti.UI.SIZE
	});
	if (!tweet)
		return row;
	row.add(Ti.UI.createLabel({
		text : tweet.user.name + ', ' + tweet.user.location,
		top : '5dp',
		left : '80dp',
		right : '5dp',
		color : 'silver',
		height : '24dp',
		font : {
			fontSize : '14dp',
			fontFamily : 'Centabel Book'

		}
	}));
	row.add(Ti.UI.createLabel({
		text : tweet.text.replace(/&amp;/g,'&'),
		top : '25dp',
		bottom : '10dp',
		left : '80dp',
		right : '5dp',
		color : 'black',
		font : {
			fontSize : '16dp',
			fontFamily : 'Centabel Book'

		},
		height : Ti.UI.SIZE
	}));
	row.add(Ti.UI.createImageView({
		left : 0,
		width : '60dp',
		height : '60dp',
		top : '10dp',
		image : tweet.user.profile_image_url

	}));
	return row;
};
