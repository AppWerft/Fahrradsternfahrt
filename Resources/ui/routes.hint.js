exports.create = function() {
	var self = Ti.UI.createView({
		bottom : -200,
		height : 100
	});
	self.add(Ti.UI.createView({
		backgroundColor : 'black',
		opacity : 0.6
	}));
	self.add(Ti.UI.createLabel({
		color : 'white',
		left : 5,
		right : 5,
		top : 5,
		font : {
			fontFamily : 'Designosaur',
			fontSize : 18
		},
		text : 'Die Streckenführung ist nicht endgültig und kann jederzeit geändert werden. Sie dient hier lediglich der Vororientierung.'
	}));
	self.slideup = function() {
		self.animate({
			bottom : 0,
			duration : 500
		}, self.slidedown);
	};
	self.slidedown = function() {
		
		setTimeout(function() {
			self.animate({
				bottom : -100,
				duration : 700
			});
		}, 5000);
	};
	return self;
};
