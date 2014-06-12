module.exports = function() {
	if (!Ti.App.Properties.hasProperty('RECORD')) {
		var dialog = Ti.UI.createAlertDialog({
			cancel : 1,
			buttonNames : ['Nein','Jawoll!'],
			message : 'Möchtest Du anonym Deine Position veröffentlichen? \n\nDann könnte jeder sehen, wo die Sternfahrt gerade unterwegs ist',
			title : 'Position'
		});
		dialog.addEventListener('click', function(e) {
			if (e.index > 1) {
				console.log('Info: start recording');
				Ti.App.fireEvent('startrecording');
				Ti.App.Properties.setString('RECORD', 'active');
			}
		});
		dialog.show();
	}
};
