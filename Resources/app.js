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
	
//require('background.service').start();
require('vendor/versionsreminder').start();
