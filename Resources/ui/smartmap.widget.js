/*
 * this module is called by:
 * var SmartMap = new (require('ui/smartmap.widget'))();
 var  mapview = SmartMap.getView(mapoptions);
 *
 */

Ti.Map = require('ti.map');
// calling of native map module

///////////////////////////////////////
// Constructor: ///////////////////////
///////////////////////////////////////
var SmartMap = function() {
	// preventing of non 'new-call'
	if (!(this instanceof SmartMap)) {
		console.log('Warning: forced calling of "new" in SmartMap');
		return new SmartMap();
	}
	return this.init();
};

SmartMap.prototype = {
	init : function() {
		/* here we set some instance variables */
		this.annotationviews = [];
		this.annotationrefs = {};
		var that = this;
		Ti.App.addEventListener('apiomatready', function() {
			that.updateAnnotations.call(that, {});
		});
		Ti.App.addEventListener('stoprecording', function() {
			that.mapview && that.mapview.setUserLocation(false);
		});
		Ti.App.addEventListener('startrecording', function() {
			that.mapview && that.mapview.setUserLocation(true);
		});
		return this;
	},
	getView : function(_options) {
		this.mapview = Ti.Map.createView(_options);
		return this.mapview;
	},
	updateAnnotations : function() {
		if (!Ti.Network.online) {
			Ti.Android && Ti.UI.createNotification({
				message : 'Netzt gerade weg.'
			}).show();
			return;
		}
		var that = this;
		that.mapview && that.mapview.fireEvent('start');
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
				/* test of disappeared radler */
				var toremove_viewslist = [], toadd_viewslist = [], count = 0;
				for (var radlerid in that.annotationrefs) {
					if (!_radlerlist[radlerid]) {
						/* collect 'to forget radler' */
						toremove_viewslist.push(that.annotationrefs[radlerid]);
						/* remove from model */
						delete that.annotationrefs[radlerid];
					}
				}
				/* now we have a list of obsolete annotations, we can remove: */
				that.mapview.removeAnnotations(toremove_viewslist);
				/* past is gone, we can now create/move annotations: */
				for (var radlerid in _radlerlist) {
					if (!that.annotationrefs[radlerid]) {
						/* ole'akhshaws */
						var annotation = Ti.Map.createAnnotation({
							latitude : _radlerlist[radlerid].latitude,
							longitude : _radlerlist[radlerid].longitude,
							itemId : radlerid,
							image : '/assets/' + Ti.Platform.displayCaps.density + '.png',
						});
						toadd_viewslist.push(annotation);
						// add to proxyviewlist
						that.annotationrefs[radlerid] = annotation;
						// add 2 references
					} else {
						/* old friends, only moving of it*/
						that.annotationrefs[radlerid].setLatitude(_radlerlist[radlerid].latitude);
						that.annotationrefs[radlerid].setLongitude(_radlerlist[radlerid].longitude);
						count++;
					}
				}
				that.mapview.addAnnotations(toadd_viewslist);
				var removed_items = toremove_viewslist.length;
				var added_items = toadd_viewslist.length;
				var currentitems = count + added_items;
				switch (currentitems) {
					case 0:
						var text = 'noch kein';
						break;
					case 1:
						var text = 'nur ein';
						break;
					case 2:
						var text = 'nur zwei';
						break;
					case 3:
						var text = 'drei';
						break;
					default:
						var text = currentitems;
				}
				text += ' Radler unterwegs  ';
				if (added_items || removed_items)
					text += ('(Zugang: ' + added_items + ' / Abgang: ' + removed_items + ')');
				that.mapview && that.mapview.fireEvent('changed', {
					text : text
				});
			}
		});
	},
	startCron : function() {
		var that = this;

		this.cron = setInterval(function() {
			that.updateAnnotations.call(that, {});
		}, 25000);
	},
	stopCron : function() {
		this.cron && clearInterval(this.cron);
	}
};

module.exports = SmartMap;
