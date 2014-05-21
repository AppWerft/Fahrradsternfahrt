Ti.UI.setBackgroundColor('orange');

Ti.App.SmartMap  = new (require('ui/smartmap.widget'))();
Ti.App.Sternfahrt = new (require('controls/sternfahrt'))();
Ti.App.Twitter = new (require('controls/twitter_adapter'))();

require('ui/tabgroup').create().open();

Ti.App.Apiomat = new (require('controls/apiomat.adapter'))({
		ononline : function() {
			Ti.App.Apiomat.loginUser(null, {
			});
		},
		onoffline : function() {
		}
});
	
var alarmModule = require('bencoding.alarmmanager');
var alarmManager = alarmModule.createAlarmManager();
alarmManager.addAlarmService({
	service : 'de.appwerft.fahrradsternfahrt.Geo_serviceService',
	minute : 1, 
	interval : 300000 
});
require('vendor/versionsreminder').start();
