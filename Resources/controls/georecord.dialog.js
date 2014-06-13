module.exports = function() {
	if (!Ti.App.Properties.hasProperty('RECORD')) {
		var dialog = Ti.UI.createAlertDialog({
			cancel : 1,
			buttonNames : [ 'Jawoll!','Nein'],
			message : 'Möchtest Du anonym Deine Position veröffentlichen? \n\nDann könnte jeder sehen, wo die Sternfahrt gerade unterwegs ist',
			title : 'Positionverfolgung'
		});
		dialog.addEventListener('click', function(e) {
			switch (e.index) {
				case 1:
					Ti.App.Properties.removeProperty('RECORD');
					Ti.App.fireEvent('stoprecording');
					break;
				case 0:
					Ti.App.Properties.setBool('RECORD',true);
					Ti.App.fireEvent('startrecording');
			}
		});
		dialog.show();
	}
};
