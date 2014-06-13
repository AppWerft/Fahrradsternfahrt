Ti.UI.setBackgroundColor('orange');
if (!Ti.App.Properties.hasProperty('MEETING'))
	Ti.App.Properties.setBool('MEETING', true);
	
require('controls/georecord.dialog')();

Ti.App.Sternfahrt = new (require('controls/sternfahrt'))();
var splash = require('ui/splash.window')(function() {
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
Ti.Android && Ti.UI.createNotification({
	message : 'Gleichstellungshinweis:\nImmer wenn in dieser App die grammatikalisch männliche Form angesprochen wird, ist selbstverständlich auch die weibliche Welt angesprochen.'
}).show();
