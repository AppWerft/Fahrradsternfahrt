var ImageCache = require('vendor/imagecache');
var titouchgallery = require("com.gbaldera.titouchgallery");
exports.create = function() {
	var lastid = null;
	function getImage(_data) {
		var w = Ti.Platform.displayCaps.platformWidth / Ti.Platform.displayCaps.logicalDensityFactor;
		var self = Ti.UI.createView({
			top : 0,
			width : Ti.UI.FILL,
			height : w / _data.ratio,
			bottom : w / 50
		});
		/*var photo = titouchgallery.createTouchGallery({
		 top : 0,
		 images : [_data.bigimage]
		 });**/
		var photo = Ti.UI.createImageView({
			top : 0,
			width : Ti.UI.FILL,
			height : w / _data.ratio

		});
		require('vendor/imagecache')(_data.bigimage, photo);
		console.log(_data.bigimage);
		self.add(photo);
		//ImageCache(_data.bigimage, photo);
		self.add(Ti.UI.createView({
			backgroundColor : 'black',
			opacity : 0.6,
			height : 50,
			bottom : 0
		}));
		self.add(Ti.UI.createLabel({
			text : _data.title.replace(/\n/gm, ' '),
			width : Ti.UI.FILL,
			textAlign : 'left',
			left : 7,
			height : 30,
			right : 30,
			color : 'white',
			font : {
				fontSize : 21,
				fontFamily : 'Bebas',
				fontWeight : 'bold'
			}
		}));
		if (_data.id) {
			var trash = Ti.UI.createButton({
				right : 5,
				bottom : 0,
				width : 50,
				height : 50,
				backgroundImage : '/assets/trash.png'
			});
			self.add(trash);
			trash.addEventListener('click', function() {
				var dialog = Ti.UI.createAlertDialog({
					message : 'Du willst Dein Photo löschen?',
					ok : 'Jawoll!',
					title : 'Photo löschen'
				});
				dialog.show();
				dialog.addEventListener('click', function(_e) {
					if (_e.index == 0) {
						Ti.App.Apiomat.deletePhoto(_data.id, {
							ondeleted : updateView
						});
					}
				});

			});
		}
		return self;
	}

	var self = Ti.UI.createWindow({
		fullscreen : true,
		backgroundColor : 'white',
		layout : 'vertical'
	});
	self.container = Ti.UI.createScrollView({
		scrollType : 'vertical',
		layout : 'vertical',
		contentHeight : Ti.UI.SIZE,
		backgroundColor : 'red'
	});
	self.add(self.container);
	/*	self.listview = Ti.UI.createListView({
	sections : [Ti.UI.createListSection({
	headerTitle : null,
	})],
	templates : {
	'template' : {
	properties : {
	height : Ti.UI.SIZE,
	backgroundColor : 'white'
	},
	childTemplates : [{
	type : 'Ti.UI.ImageView',
	bindId : 'image',
	properties : {
	height : Ti.UI.SIZE,
	width : Ti.UI.FILL
	}
	}]
	}
	},
	defaultItemTemplate : 'template',
	});*/
	//self.add(self.listview);
	function updateView() {
		Ti.App.Apiomat.getAllPhotos(null, {
			onload : function(_data) {
				var pindata;
				if (lastid && _data[_data.length - 1].thumb == lastid)
					return;
				self.container.removeAllChildren();
				//var dataitems = [];
				var ndx = 0;
				while ( img = _data.pop()) {
					if (img && img.bigimage) {
						if (ndx == 0)
							lastid = img.thumb;
						self.container.add(getImage(img));
						ndx++;
					}
				}
				//self.listview.sections[0].setItems(dataitems);
			}
		});
	}


	self.addEventListener('focus', updateView);
	return self;
};

