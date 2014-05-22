Ti.Map = require('ti.map');

exports.create = function() {
	var options = arguments[0] || {};
	var ready = false;
	var pins = [];
	var self = require('vendor/window').create({
		title : 'Fahrradsternfahrt Hamburg',
		subtitle : 'Rad fahren – Klima schützen!'
	});
	self.title = 'Fahrradsternfahrt';
	self.barColor='#F7A900';
	var radlertext = Ti.UI.createLabel({
		color : 'white',
		height : 20,
		textAlign : 'left',
		left : 10,
		bottom : 0,
		text : 'Wir warten auf die Radler-Daten …',
		font : {
			fontSize : 10
		}
	});
	self.backgroundColor = 'black';
	self.add(radlertext);
	var mapoptions = {
		mapType : Ti.Map.TERRAIN_TYPE,
		bottom : 20,
		enableZoomControls : false,
		region : {
			latitude : 53.553,
			longitude : 10.01,
			latitudeDelta : 0.5,
			longitudeDelta : 0.5
		},
		animate : true,
		regionFit : true,
		userLocation : false
	};
	self.mapview = Ti.App.SmartMap.getView(mapoptions);
	self.mapview.addEventListener('changed', function(_e) {
		radlertext.setText(_e.text);
	});
	self.mapview.addEventListener('complete', function() {
		var routes = Ti.App.Sternfahrt.getAllRoutes();
		for (var i = 0; i < routes.length; i++) {
			self.mapview.addRoute(Ti.Map.createRoute(routes[i]));
		}
		var points = Ti.App.Sternfahrt.getAllPoints();
		self.annotations = [];
		for (var i = 0; i < points.length; i++) {
			if (points[i].title) {
				var pin = '/assets/' + Ti.Platform.displayCaps.density + '-' + points[i].color + '.png';
				self.annotations.push(Ti.Map.createAnnotation({
					latitude : parseFloat(points[i].position[0]),
					longitude : parseFloat(points[i].position[1]),
					title : points[i].title,
					image : pin,
					subtitle : 'Treffpunkt um ' + points[i].zeit + ' Uhr'
				}));
			}
		}
		self.annotations.push(Ti.Map.createAnnotation({
			latitude : 53.58593,
			longitude : 10.045752,
			title : 'Museum der Arbeit',
			image : '/assets/' + Ti.Platform.displayCaps.density + '-mda.png',
			subtitle : 'Abschlussveranstaltungs'
		}));
		self.mapview.addAnnotations(self.annotations);

	});
	self.addEventListener('focus', function() {
		if (!ready) {
			self.add(self.mapview);
			ready = true;
		}
	});
	self.addEventListener('blur', function() {
	});
	self.mapview.addEventListener('click', function(_e) {

	});
	Ti.App.SmartMap.startCron();
	return self;
};

