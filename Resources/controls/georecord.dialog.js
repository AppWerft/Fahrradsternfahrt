exports.create = function() {
	if (!Ti.App.Properties.hasProperty('RECORD')) {
		var dialog = Ti.UI.createAlertDialog({
			cancel : 1,
			buttonNames : ['Jawoll!', 'Nein'],
			message : 'Möchtest Du anonym Deine Position veröffentlichen? \n\nDann könnte jeder sehen, wo die Sternfahrt gerade unterwegs ist',
			title : 'Position'
		});
		dialog.addEventListener('click', function(e) {
			if (e.index === e.source.cancel) {

			}
			Ti.App.Properties.setString('RECORD', 'active');
		});
		dialog.show();
	}
};
