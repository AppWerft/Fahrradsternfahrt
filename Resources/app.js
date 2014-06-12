Ti.UI.setBackgroundColor('orange');
require('controls/georecord.dialog')();

Ti.App.Sternfahrt = new (require('controls/sternfahrt'))();
Ti.App.Twitter = new (require('controls/twitter_adapter'))();
var splash = require('ui/splash.window')(function(){
	require('ui/tabgroup').create().open();
});

Ti.App.Apiomat = new (require('controls/apiomat.adapter'))({
	ononline : function() {
		Ti.App.Apiomat.loginUser(null, {
		});
	},
	onoffline : function() {
	}
});

if (Ti.Android) {
	require('background.service')();
	require('vendor/versionsreminder')();
}