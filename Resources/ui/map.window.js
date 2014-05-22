Ti.Map = require('ti.map');

exports.create = function() {
	var options = arguments[0] || {};
	var ready = false;
	var pins = [];
	var self = require('vendor/window').create({
		title : 'Fahrradsternfahrt Hamburg',
		subtitle : 'Rad fahren – Klima schützen!'
	});
	self.title = 'Fahrradsternfahrt Hamburg 2014';
	self.barColor = '#F7A900';
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
		var points = Ti.App.Sternfahrt.getAllPoints();
		self.annotations = [];
		for (var i = 0; i < points.length; i++) {
			if (points[i].title) {
				var pin = '/assets/' + Ti.Platform.displayCaps.density + points[i].color + '.png';
				var annotation = Ti.Map.createAnnotation({
					latitude : parseFloat(points[i].position[0]),
					longitude : parseFloat(points[i].position[1]),
					title : points[i].title,
					image : pin,
					subtitle : 'Treffpunkt um ' + points[i].zeit + ' Uhr'
				});
				self.mapview.addAnnotation(annotation);
				self.annotations.push(annotation);
			}
		}
		//self.mapview.addAnnotations(self.annotations);
		var mda = '/assets/' + Ti.Platform.displayCaps.density + 'mda.png';
		var museumderarbeitpin = Ti.Map.createAnnotation({
			latitude : 53.58593,
			longitude : 10.045752,
			title : 'Museum der Arbeit',
			image : mda,
			subtitle : 'Abschlussveranstaltung'
		});
		self.mapview.addAnnotation(museumderarbeitpin);
		self.mapview.selectAnnotation(museumderarbeitpin);

	});
	self.addEventListener('focus', function() {
		if (!ready) {
			self.add(self.mapview);
			ready = true;
		}
	});
	Ti.App.addEventListener('routes',function(_e){
		var routes = _e.routes;
		for (var i = 0; i < routes.length; i++) {
			self.mapview.addRoute(Ti.Map.createRoute(routes[i]));
		}
	});
	Ti.App.SmartMap.startCron();
	return self;
};

