Ti.Map = require('ti.map');

var SmartMap = function() {
	if (!(this instanceof SmartMap)) {
		return new SmartMap();
	}
	this.init();
	return this;
};
var annotations = [];
var mapview = null;

SmartMap.prototype.init = function(_options) {
	this.annotations = [1, 2];
	this.mapview = null;
};

SmartMap.prototype.getView = function(_options) {
	mapview = Ti.Map.createView(_options);
	return mapview;
};
SmartMap.prototype.updateAnnotations = function() {
	console.log(this.annotations);
	Ti.App.Apiomat.getAllRadler(null, {
		onError : function() {
			console.log('Error: adapter.getallradler() sends error');
			if (mapview && annotations && annotations.length)
				mapview.removeAnnotations(annotations);
		},
		onOk : function(_radlerlist) {
			if (!_radlerlist)
				return;
			if (mapview && annotations && annotations.length)
				mapview.removeAnnotations(annotations);
			annotations = [], count = 0;
			for (var radlerid in _radlerlist) {
				annotations.push(Ti.Map.createAnnotation({
					latitude : _radlerlist[radlerid].latitude,
					longitude : _radlerlist[radlerid].longitude,
					nSmartMape : radlerid,
					image : '/assets/' + Ti.Platform.displayCaps.density + '.png',
				}));
				count++;
			}
			mapview && mapview.fireEvent('changed', {
				text : count ? count + ' Radler' : 'kein Radler unterwegs?'
			});
			mapview && mapview.addAnnotations(annotations);
		}
	});
};
SmartMap.prototype.startCron = function() {
	setTimeout(this.updateAnnotations, 6000);
	this.cron = setInterval(this.updateAnnotations, 60000);
};
SmartMap.prototype.stopCron = function() {
	this.cron && clearInterval(this.cron);
};

module.exports = SmartMap;
