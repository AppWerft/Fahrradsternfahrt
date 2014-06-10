exports.create = function(_user) {
	console.log();
	var self = require('vendor/window').create({
		subtitle : _user.name,
		title : 'Twitterprofil'
	});
	self.exitOnClose = false;
	var w = Ti.Platform.displayCaps.platformWidth / Ti.Platform.displayCaps.logicalDensityFactor;
	var scroller = Ti.UI.createScrollView({
		scrollType : 'horizontal',
		width : Ti.UI.FILL,
		contentWidth : Ti.Platform.displayCaps.platformHeight * 1.4,
	});
	self.add(scroller);
	var bg = Ti.UI.createImageView({
		width : Ti.Platform.displayCaps.platformHeight * 1.4,
		height : Ti.Platform.displayCaps.platformHeight
	});
	scroller.add(bg);
	self.add(Ti.UI.createView({
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		bubbleParent : true,
		touchEnabled : false,
		opacity : '0.7',
		left : '30dp',
		right : '30dp',
		top : '30dp',
		borderWidth : 1,
		zIndex : 10,
		borderRadius : '10dp',
		backgroundColor : 'white'//_user['profile_background_color']
	}));
	if (_user.name)
		self.add(Ti.UI.createLabel({
			text : _user.name,
			top : '50dp',
			left : '50dp',
			right : '50dp',
			color : 'black',
			zIndex : 20,
			font : {
				fontSize : '36dp',
				fontWeight : 'bold',
				fontFamily : 'PTSans-Narrow'
			}
		}));
	if (_user.location)
		self.add(Ti.UI.createLabel({
			text : _user.location,
			top : '150dp',
			left : '50dp',
			right : '50dp',
			color : 'black',
			zIndex : 20,
			font : {
				fontSize : '25dp',
				fontWeight : 'bold',
				fontFamily : 'PTSans-Narrow'
			}
		}));
	if (_user.description)
		self.add(Ti.UI.createLabel({
			text : _user.description,
			top : '210dp',
			left : '50dp',
			right : '50dp',
			zIndex : 99,
			color : '#00597C',
			font : {
				fontSize : '20dp',
				fontWeight : 'bold',
				fontFamily : 'PTSans-Narrow'
			}
		}));
	if (_user["profile_use_background_image"] && _user['profile_background_image_url']) {
		var xhr = Ti.Network.createHTTPClient({
			onerror : function(e) {
				console.log(this.error + e.error);
			},
			onload : function(e) {
				if (this.status == 200) {
					console.log('Info: ' + this.responseData.length);

					bg.setImage(this.responseData);
					bg.animate(Ti.UI.createAnimation({
						contentOffset : {
							x : '500dp',
							y : 0
						},
						duration : 10000
					}));
				}
			}
		});
		xhr.open('GET', _user['profile_background_image_url']);
		xhr.send();
	}
	return self;
};

