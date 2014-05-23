exports.create = function(_args, _onOK) {
	var data = _args;
	var androidview = Ti.UI.createView({
		layout : 'vertical'

	});
	var preview = Ti.UI.createImageView({
		image : data.photo,
		width : '50%'
	});
	androidview.add(preview);
	var title = Ti.UI.createTextField({
		top : 0,
		width : Ti.UI.FILL,
		bottom : 5,
		hintText : 'Kurztext zum Bild'
	});
	androidview.add(title);
	var dialog = Ti.UI.createAlertDialog({
		cancel : 1,
		androidView : androidview,
		buttonNames : ['OK', 'Abbruch'],
		//	message : 'Möchtest Du das Bild veröffentlichen?',
		title : 'Photoversand'
	});
	dialog.addEventListener('click', function(e) {
		if (e.index === e.source.cancel) {
			Ti.API.info('The cancel button was clicked');
		} else {
			data.title = title.getValue();
			data.ratio = preview.rect.width / preview.rect.height;
			_onOK(data);
		}
	});
	dialog.show();
	preview.addEventListener('postlayout', function(_e) {
	});
};
