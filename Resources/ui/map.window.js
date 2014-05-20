Ti.Map = require('ti.map');

exports.create = function() {
	var options = arguments[0] || {};
	var ready = false;
	var pins = [];
	var self = require('vendor/window').create({
		title : 'Fahrradsternfahrt Hamburg',
		subtitle : 'Rad fahren – Klima schützen!'
	});
	self.mapview = Ti.Map.createView({
		mapType : Ti.Map.TERRAIN_TYPE,
		enableZoomControls : false,
		region : {
			latitude : 53.553270540,
			longitude : 10.00963632,
			latitudeDelta : 0.4,
			longitudeDelta : 0.4
		},
		animate : true,
		regionFit : true,
		userLocation : true
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

	return self;
};

