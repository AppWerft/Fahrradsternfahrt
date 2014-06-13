var Apiomat = require('vendor/apiomat');
var moment = require('vendor/moment');
moment.lang('de');

var myPushDeviceToken = null;

var saveCB = {
	onOk : function() {
		Ti.App.fireEvent('apiomatready');
	},
	onError : function(error) {
	}
};

///////////////////////////////////////
// Constructor: ///////////////////////
///////////////////////////////////////
var ApiomatAdapter = function() {
	var callbacks = arguments[0] || {};
	var xhr = Ti.Network.createHTTPClient({
		onload : callbacks.ononline,
		onerror : callbacks.onoffline
	});
	xhr.open('HEAD', 'https://apiomat.org/yambas/rest');
	xhr.send();
};

ApiomatAdapter.prototype.loginUser = function() {
	var args = arguments[0] || {}, callbacks = arguments[1] || {}, that = this;
	var uid = Ti.Utils.md5HexDigest(Ti.Platform.getMacaddress());
	console.log('Info: UID='+uid);
	Apiomat.Datastore.setOfflineStrategy(Apiomat.AOMOfflineStrategy.USE_OFFLINE_CACHE, {
		onOk : function() {
			console.log('Offline cache gestartet');
		},
		onError : function(err) {
			//Error occurred
		}
	});
	this.user = new Apiomat.Nutzer();
	this.user.setUserName(uid);
	this.user.setPassword('mylittlesecret');
	var loaded = false;
	this.user.loadMe({
		onOk : function() {
			console.log('Info: loadme OK');
			callbacks.onOk && callbacks.onOk();
			Ti.App.fireEvent('apiomatready');
		},
		onError : function(error) {
			console.log('Warning: '+error);
			if (error.statusCode === Apiomat.Status.UNAUTHORIZED) {
				that.user.save(saveCB);
			}
		}
	});
	return this;
};

ApiomatAdapter.prototype.postPhoto = function(_args, _callbacks) {
	var args = arguments[0] || {}, callbacks = arguments[1] || {}, that = this;
	var myNewPhoto = new Apiomat.Photo();
	myNewPhoto.setPositionLatitude(args.latitude);
	// from getPosition
	myNewPhoto.setPositionLongitude(args.longitude);
	myNewPhoto.setTitle(args.title);
	// ti.blob from camera
	myNewPhoto.postPhoto(args.photo, function(e) {
		console.log('Error: ' + e);
	});
	myNewPhoto.save({
		onOK : function() {
			console.log('Info: newPhoto.save successful');

			Ti.Android && Ti.UI.createNotification({
				message : 'Photo erhalten.'
			}).show();
			that.user.postmyPhotos(myNewPhoto, {
				onOk : function() {
					Ti.Android && Ti.UI.createNotification({
						message : 'Photo erfolgreich gespeichert.'
					}).show();
					Ti.Media.vibrate();
					console.log('Info: photo uploaded');
				},
				onError : function() {
				}
			});
		},
		onError : function() {
		}
	});

};

ApiomatAdapter.prototype.resetLocation = function() {
	var that = this;
	that.user.setLocationLatitude(0);
	that.user.setLocationLongitude(0);
	that.user.setLocLatitude(0);
	that.user.setLocLongitude(0);
	that.user.save({
		onOk : function() {
		},
		onError : function() {
		}
	});

};
ApiomatAdapter.prototype.setPosition = function(args) {
	var that = this;
	var myNewPosition = new Apiomat.Position();
	myNewPosition.setPositionLatitude(args.latitude);
	myNewPosition.setPositionLongitude(args.longitude);
	myNewPosition.setDevice(Ti.Platform.model);
	myNewPosition.save({
		onOK : function() {
			console.log('Info: position successful saved ' + myNewPosition);
		},
		onError : function() {
		}
	});

};
ApiomatAdapter.prototype.getAllRadler = function(_options,_callbacks) {
	var that = this;
	var now = (parseInt(moment().unix()) - 150) * 1000;
	// letzte 110sec in ms.
	var query = "createdAt > date(" + now + ") order by createdAt DESC";
	console.log('Info: QUERY=' + query);
	Apiomat.Position.getPositions(query, {
		onOk : function(_positions) {
			var positions = _positions;
			var  radlerlist = {};
			for (var i = 0; i < positions.length; i++) {
				var user =  positions[i].data.ownerUserName;
				radlerlist[user] = {
					latitude : positions[i].getPositionLatitude(),
					longitude : positions[i].getPositionLongitude(),
					device : positions[i].getDevice(),
				};
			}
			_callbacks.onOk(radlerlist);
		},
		onError : function(error) {
			console.log('Error (Apiomat): ' + error);
			_callbacks.onError();
		}
	});
};
ApiomatAdapter.prototype.deletePhoto = function(_id, _callbacks) {
	for (var i = 0; i < this.photos.length; i++) {
		// only own phots has an id:
		if (this.photos[i].data.id && this.photos[i].data.id == _id) {
			this.photos[i].deleteModel({
				onOk : function() {
					Ti.Android && Ti.UI.createNotification({
						message : 'Photo in Liste gelöscht'
					}).show();
					Ti.Media.vibrate();
					_callbacks.ondeleted();
					console.log('SUCCESSFUl deleted');
				},
				onError : function(error) {
					console.log(error);
				}
			});
			break;
		}
	}
};
ApiomatAdapter.prototype.getAllPhotos = function(_args, _callbacks) {
	var that = this;
	Apiomat.Photo.getPhotos("order by createdAt limit 500", {
		onOk : function(_res) {
			that.photos = _res;
			var photolist = [];
			for (var i = 0; i < that.photos.length; i++) {
				var photo = that.photos[i];
				var ratio = photo.getRatio() || 1.3;
				photolist.push({
					id : (photo.data.ownerUserName == that.user.getUserName())//
					? photo.data.id : undefined,
					latitude : photo.getPositionLatitude(),
					longitude : photo.getPositionLongitude(),
					title : photo.getTitle(),
					thumb : photo.getPhotoURL(200, null, null, null, 'png'),
					ratio : ratio,
					bigimage : photo.getPhotoURL(1000, null, null, null, 'png') ,
				});
			}
			_callbacks.onload(photolist);
		},
		onError : function(error) {
			//handle error
		}
	});

};
/// SETTER:

module.exports = ApiomatAdapter;
