/*
 * this module is called by:
 * var SmartMap = new (require('ui/smartmap.widget'))();
 var  mapview = SmartMap.getView(mapoptions);
 *
 */

Ti.Map = require('ti.map');
// calling of native map module

/*Constructor */
var SmartMap = function() {
	// preventing of non 'new-call'
	if (!(this instanceof SmartMap)) {
		return new SmartMap();
	}
	this.annotationviews = [1, 2, 3];
	// dummy to test functionality
	return this;
};
// this runs, but it is without intances ;-((
var annotationviews = [];
var mapview = null;

SmartMap.prototype = {
	"getView" : function(_options) {
		console.log('this.annotationviews=');
		console.log(this.annotationviews);
		// "undefined", because this points to global"
		mapview = Ti.Map.createView(_options);
		return mapview;
		// better would be "this.mapview"
	},
	"updateAnnotations" : function() {
		Ti.App.Apiomat.getAllRadler(null, {
			onError : function() {
				console.log('Error: adapter.getallradler() sends error');
				if (mapview && annotationviews && annotationviews.length)
					mapview.removeAnnotations(annotationviews);
			},
			onOk : function(_radlerlist) {
				if (!_radlerlist)
					return;
				if (mapview && annotationviews && annotationviews.length)
					mapview.removeAnnotations(annotationviews);
				annotationviews = [], count = 0;
				for (var radlerid in _radlerlist) {
					annotationviews.push(Ti.Map.createAnnotation({
						latitude : _radlerlist[radlerid].latitude,
						longitude : _radlerlist[radlerid].longitude,
						itemId : radlerid,
						image : '/assets/' + Ti.Platform.displayCaps.density + '.png',
					}));
					count++;
				}
				mapview && mapview.fireEvent('changed', {
					text : count ? count + ' Radler' : 'kein Radler unterwegs?'
				});
				mapview && mapview.addAnnotations(annotationviews);
			}
		});
	},
	"startCron" : function() {
		setTimeout(this.updateAnnotations, 6000);
		this.cron = setInterval(this.updateAnnotations, 60000);
	},
	"stopCron" : function() {
		this.cron && clearInterval(this.cron);
	}
};

module.exports = SmartMap;
