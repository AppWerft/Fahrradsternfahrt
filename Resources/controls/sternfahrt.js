var Sternfahrt = function() {
	this.init();
	return this;
};
const COLORS = {
	"green" : "#438A5A",
	"blue" : "#1E1E65",
	"pink" : "#DE6421",
	"red" : "#D53B81",
	"lightblue" : "#73B532"
};
var getDistance = function(lat1, lon1, lat2, lon2) {
	var R = 6371000;
	// m (change this constant to get miles)
	var dLat = (lat2 - lat1) * Math.PI / 180;
	var dLon = (lon2 - lon1) * Math.PI / 180;
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c;
	return Math.round(d);
};

Sternfahrt.prototype = {
	init : function() {
		var that = this;
		var styles = [];
		function getColorFromStyle(style) {
			for (var i = 0; i < styles.length; i++) {
				if (styles[i].id== style) {
					//console.log(styles[i].IconStyle.Icon.href);
					return	styles[i].IconStyle.Icon.href.replace(/http:\/\/maps\.gstatic\.com\/mapfiles\/ms2\/micons\//gm, '');
				}
			}
		}

		//var jsonfile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, '/models/points.json');
		var kml = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, '/models/StartpunkeFahrradsternfahrt.kml').read().text;
		var document = new (require("vendor/XMLTools"))(kml).toObject().Document;
		styles = document.Style;
		var placemarks = document.Placemark;
		this.points = [];
		for (var i = 0; i < placemarks.length; i++) {
			var description = placemarks[i].description
				.replace(/<!\[CDATA\[/gm, '')
				.replace(/\]\]>/gm, '')
				.replace(/&nbsp;/gm, '')
				.replace(/<.*?>/gm, '')
				.replace(/<\/.*?>/gm, '')
				.replace(/\(/gm, '\n(');
			var zeit = description.split(';')[0]
				.replace(/Startzeit: /, '')
				.replace(/Abschlußkundgebung/, '')
				.replace(/( Uhr|Uhr)/, '')
				.replace(/^0/,'')
				.replace(/[\s]+/,'');
			var style = getColorFromStyle(placemarks[i].styleUrl.replace(/#/gm, ''));
			var color = style.replace('.png','');
			var point = {
				title : placemarks[i].name.replace('Bhf.','Bahnhof'),
				position : [placemarks[i].Point.coordinates.split(',')[1], placemarks[i].Point.coordinates.split(',')[0]],
				description : description.split('; ')[1],
				zeit : zeit,
				color : color ,
				rgb : COLORS[color],
				min : parseInt(zeit.split(':')[0]) * 60 + parseInt(zeit.split(':')[1])
			};
			if (color != 'volcano') this.points.push(point);
		}
//		this.points = JSON.parse(jsonfile.read());
//		for (var i = 0; i < this.points.length; i++) {
//			this.points[i].min = parseInt(this.points[i].zeit.split(':')[0]) * 60 + parseInt(this.points[i].zeit.split(':')[1]);
//			this.points[i].rgb = COLORS[this.points[i].color];
//		}
		this.points.sort(function(a, b) {
			return a.min - b.min;
		});
		return this;
	},
	getAllRoutes : function(_options, _callback) {
		console.log('Info: CONTROL start retrieving routes. ==========================');
		var routes = [];
		var xhr = Ti.Network.createHTTPClient({
			timeout : 60000,
			onload : function() {
				console.log('Info: start parsing of json of routes');
				try {
					routes = JSON.parse(this.responseText);
					console.log('Info: JSON parsing successful');
				} catch(E) {
					console.log(E);
					var jsonfile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, '/models/routes.json');
					routes = JSON.parse(jsonfile.read());
				}
				var maprouteoptions = [];
				for (var i = 0; i < routes.length; i++) {
					var listoflocations = routes[i].route;
					var len = listoflocations.length;
					var width = (routes[i].width) ? 5 * Ti.Platform.displayCaps.logicalDensityFactor : 2 * Ti.Platform.displayCaps.logicalDensityFactor;
					if (!Ti.Android)
						width = 3;
					maprouteoptions[i] = {
						point : [],
						width : width,
						color : routes[i].color
					};
					for (var p = 0; p < len; p++) {
						if (p == 0) {
							maprouteoptions[i].points = [];
						}
						maprouteoptions[i].points.push({
							latitude : listoflocations[p][0],
							longitude : listoflocations[p][1]
						});
					}
				};
				console.log('Info: CONTROL routes parsing complete');
				_callback && _callback(maprouteoptions);
			}
		});
		xhr.open('GET', 'http://familientagebuch.de/tideradar/sternfahrtrouten.json');
		xhr.send();
	},
	getAllPoints : function() {
		this.points.sort(function(a, b) {
			return a.min - b.min;
		});
		return this.points;
	},
	getAllPointsByPosition : function(_callback) {
		var that = this;
		Ti.Geolocation.purpose = "Ermittle Position";
		Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
		Ti.Geolocation.getCurrentPosition(function(e) {
			if (e.error) {
				var mylat = 53.5;
				var mylng = 10;
			} else {
				var mylat = e.coords.latitude;
				var mylng = e.coords.longitude;
			}
			for (var i = 0; i < that.points.length; i++) {
				var dist = getDistance(parseFloat(that.points[i].position[0]), parseFloat(that.points[i].position[1]), mylat, mylng);
				that.points[i].dist = dist;
				if (dist < 1000)
					that.points[i].disttext = dist + 'm';
				else if (dist < 10000)
					that.points[i].disttext = (dist / 1000).toFixed(1) + 'km';
				else if (dist < 100000)
					that.points[i].disttext = Math.round(dist / 1000) + 'km';

			}
			that.points.sort(function(a, b) {
				if (a.dist < b.dist) {
					return -1;
				}
				if (a.dist > b.dist) {
					return 1;
				}
				return 0;
			});
			_callback(that.points);
		});
	}
};
module.exports = Sternfahrt;
