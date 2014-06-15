exports.create = function(tweet) {
	var row = Ti.UI.createTableViewRow({
		user : tweet.user,
		tweet : tweet.text,
		hasDetails : true,
		height : Ti.UI.SIZE,backgroundColor:'white'
	});
	if (!tweet)
		return row;
	row.add(Ti.UI.createLabel({
		text : tweet.user.name + ', ' + tweet.user.location,
		top : 5,
		left : 80,
		right : 5,
		color : 'silver',
		height : 24,
		font : {
			fontSize : 14,
			fontFamily : 'PTSans-Narrow'

		}
	}));
	row.add(Ti.UI.createLabel({
		text : tweet.text.replace(/&amp;/g,'&'),
		top : 25,
		bottom : 10,
		left : 80,
		right : 5,
		color : '#222',
		font : {
			fontSize : 16,
			fontFamily : 'PTSans-Narrow'

		},
		height : Ti.UI.SIZE
	}));
	row.add(Ti.UI.createImageView({
		left : 0,
		width : 60,
		height : 60,
		top : 10,
		image : tweet.user.profile_image_url

	}));
	return row;
};
