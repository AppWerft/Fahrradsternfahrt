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
		console.log('Warning: forced calling of "new" in SmartMap');
		return new SmartMap();
	}
	this.annotationviews = [];
	this.annotationrefs = {};
	this.dummy = 'dummy';
	this.mapview = null;
	return this;
};
// this runs, but it is without intances ;-((

SmartMap.prototype = {
	getView : function(_options) {
		this.mapview = Ti.Map.createView(_options);
		this.dummyview = 'dummyview';
		return this.mapview;
		// better would be "this.mapview"
	},
	updateAnnotations : function() {
		if (!Ti.Network.online) {
			Ti.Android && Ti.UI.createNotification({
				message : 'Netzt gerade weg.'
			}).show();
			return;
		}
		console.log('dummy    =' + this.dummy);
		console.log('dummyview=' + this.dummyview);

		console.log('Info: start retrieving radler');
		var that = this;
		Ti.App.Apiomat.getAllRadler(null, {
			onError : function() {
				console.log('Error: adapter.getallradler() sends error');
				that.mapview && that.mapview.fireEvent('changed', {
					text : 'Derweil keine neuen Radlerdaten. Probleme mit der Wolkenkommunikation'
				});
				if (that.mapview && that.annotationviews && that.annotationviews.length)
					that.mapview.removeAnnotations(that.annotationviews);
			},
			onOk : function(_radlerlist) {
				console.log('Info: Apiomat retrieved new positions');
				console.log(that.mapview);
				if (that.mapview && that.annotationviews && that.annotationviews.length)
					that.mapview.removeAnnotations(that.annotationviews);
				that.annotationviews = [], count = 0;
				that.mapview && that.mapview.fireEvent('changed', {
					text : count ? count + ' Radler' : 'kein Radler unterwegs?'
				});
				for (var radlerid in _radlerlist) {
					that.annotationviews.push(Ti.Map.createAnnotation({
						latitude : _radlerlist[radlerid].latitude,
						longitude : _radlerlist[radlerid].longitude,
						itemId : radlerid,
						image : '/assets/' + Ti.Platform.displayCaps.density + '.png',
					}));
					count++;
				}
				
				that.mapview && that.mapview.addAnnotations(that.annotationviews);
			}
		});
	},
	startCron : function() {
		setTimeout(this.updateAnnotations, 6000);
		this.cron = setInterval(this.updateAnnotations, 60000);
	},
	stopCron : function() {
		this.cron && clearInterval(this.cron);
	}
};

module.exports = SmartMap;
