exports.create = function() {
	Ti.Media.showCamera({
		success : function(event) {
			if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
				Ti.Geolocation.getCurrentPosition(function(_res) {
					if (!_res.error && _res.success) {
						console.log(_res);
						require('ui/cameradialog.widget').create({
							photo : event.media,
							title : 'mein Titel',
							latitude : _res.coords.latitude,
							longitude : _res.coords.longitude
						}, function(_data) {
							Ti.App.Apiomat.postPhoto(_data);
						});
					}
				});
			} else {
				alert("got the wrong type back =" + event.mediaType);
			}
		},
		cancel : function() {
		},
		error : function(error) {
			var a = Ti.UI.createAlertDialog({
				title : 'Camera'
			});
			if (error.code == Titanium.Media.NO_CAMERA) {
				a.setMessage('Please run this test on device');
			} else {
				a.setMessage('Unexpected error: ' + error.code);
			}
			a.show();
		},
		saveToPhotoGallery : false,
		mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO]
	});
};
