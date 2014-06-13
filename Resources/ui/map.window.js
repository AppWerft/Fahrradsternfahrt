Ti.Map = require('ti.map');

exports.create = function() {
	var options = arguments[0] || {};
	var SmartMap = new (require('ui/smartmap.widget'))();
	var ready = false;
	var pins = [];
	var self = require('vendor/window').create({
		title : 'Fahrradsternfahrt Hamburg',
		subtitle : 'Rad fahren – Klima schützen!'
	});
	self.title = 'Fahrradsternfahrt Hamburg 2014';
	self.barColor = '#F7A900';
	var radlertext = Ti.UI.createLabel({
		color : '#eee',
		height : 20,
		textAlign : 'left',
		left : 25,
		bottom : 0,
		text : 'Wir warten auf die Radler-Daten …',
		font : {
			fontSize : 10
		}
	});
	var spinner = Ti.UI.createActivityIndicator({
		left : 7,
		bottom : 0,
		opacity : 0.6
	});
	var progressbar = Ti.UI.createView({
		backgroundColor : 'orange',
		bottom : 0,
		height : 1,
		width : 5
	});
	self.add(progressbar);
	self.add(spinner);
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
		userLocation : Ti.App.Properties.hasProperty('RECORD') ? true : false
	};
	self.mapview = SmartMap.getView(mapoptions);

	self.mapview.addEventListener('changed', function(_e) {
		if (self.cron)
			clearInterval(self.cron);
		progressbar.setWidth(1);
		self.cron = setInterval(function() {
			progressbar.setWidth(progressbar.getWidth() + 1);
		}, 100);
		radlertext.setText(_e.text);
		spinner.hide();
	});
	self.mapview.addEventListener('start', function(_e) {
		if (self.cron)
			clearInterval(self.cron);
		progressbar.setWidth(1);
		spinner.show();
	});
	self.mapview.addEventListener('longclick', function(_e) {
		self.mapview.setMapType((self.mapview.getMapType() == Ti.Map.NORMAL_TYPE) ? Ti.Map.TERRAIN_TYPE : Ti.Map.NORMAL_TYPE);
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
				if (Ti.App.Properties.getBool('MEETING'))
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
		Ti.App.Sternfahrt.getAllRoutes(null, function(routes) {
			console.log('Info: routes are in view and ready to render');
			for (var i = 0; i < routes.length; i++) {
				self.mapview.addRoute(Ti.Map.createRoute(routes[i]));
			}
		});

	});
	self.addEventListener('focus', function() {
		if (!ready) {
			self.add(self.mapview);
			//self.hintview = require('ui/routes.hint').create();
			//self.add(self.hintview);
			//self.hintview.slideup();
			ready = true;
		}
	});

	SmartMap.startCron();
	return self;
};

