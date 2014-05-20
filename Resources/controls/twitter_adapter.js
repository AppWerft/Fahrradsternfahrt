var TwitterAdapter = function(_options) {
	this.init(_options);
	return this;
};

// Init with application only authorization (bearer)
TwitterAdapter.prototype.init = function(_options) {
	this.service = _options && _options.service || 'twitter';
	var Codebird = require("vendor/codebird");
	this.cb = new Codebird();
	this.cb.setConsumerKey(Ti.App.Properties.getString('twitter.consumerkey'), Ti.App.Properties.getString('twitter.consumersecret'));
	this.accessToken = null;
	this.accessTokenSecret = null;
	var bearerToken = Ti.App.Properties.getString('TwitterBearerToken', null);
	var self = this;
	if (bearerToken == null) {
		console.log('Info: bearertoken missing => fetching one');
		this.fetch('oauth2_token', {}, function(reply) {
			var bearer_token = reply.access_token;
			console.log('Info: bearertoken =' + bearer_token);
			self.cb.setBearerToken(bearer_token);
			Ti.App.Properties.setString('TwitterBearerToken', bearer_token);
		});
	} else {
		console.log('Info: bearertoken always in system');
		this.cb.setBearerToken(bearerToken);
	}
};

// Helpers:
TwitterAdapter.prototype.loadAccessToken = function() {
	if (!Ti.App.Properties.hasProperty(this.service) || !Ti.App.Properties.getString(this.service)) {
		console.log('Info: missing accesstoken in local storage');
		return;
	}
	var config = undefined;
	try {
		config = JSON.parse(Ti.App.Properties.getString(this.service));
	} catch(ex) {
		console.log('Info: accesstoken invalice => removing it');
		Ti.App.Properties.removeProperty(this.service);
		return;
	}
	if (config.accessToken) {
		this.accessToken = config.accessToken;
	}
	if (config.accessTokenSecret) {
		this.accessTokenSecret = config.accessTokenSecret;
	}
};

TwitterAdapter.prototype.saveAccessToken = function() {
	Ti.App.Properties.setString(this.service, JSON.stringify({
		accessToken : this.accessToken,
		accessTokenSecret : this.accessTokenSecret
	}));
	Ti.API.info('Info: Saving access token: done.');
};

TwitterAdapter.prototype.clearAccessToken = function() {
	Ti.App.Properties.setString(this.service, JSON.stringify({
		accessToken : null,
		accessTokenSecret : null
	}));
	this.accessToken = null;
	this.accessTokenSecret = null;
};
// End of Helpers

// send a tweet (only if accesstoken is present)
TwitterAdapter.prototype.addTweet = function(_args) {
	if (!_args.tweet.match(/#ergobaby/i))
		_args.tweet += ('#E' +Ti.App.Properties.getString('twitter.handle'));
	this.cb.__call("statuses_update", {
		"status" : _args.tweet
	}, function(reply) {
		if (reply.httpstatus == 200) {
			Ti.Android && Ti.UI.createNotification({
				message : "Tweet erfolgreich publiziert.",
				duration : Ti.UI.NOTIFICATION_DURATION_LONG
			}).show();
			_args.ontweeted && _args.ontweeted(true);
		} else {
			_args.ontweeted && _args.ontweeted(false);
		}
	});
};

TwitterAdapter.prototype.authorize = function(_callback) {
	console.log('Info: starting with tweeting, test on tokens:');
	//this.clearAccessToken();
	this.loadAccessToken();
	if (this.accessTokenSecret != null && this.accessToken != null) {
		this.cb.setToken(this.accessToken, this.accessTokenSecret);
		_callback && _callback({
			success : true
		});
	} else {
		Ti.Android && Ti.UI.createNotification({
			message : "Starte Login bei Twitter.",
			duration : Ti.UI.NOTIFICATION_DURATION_LONG
		}).show();
		var self = this;
		this.cb.__call("oauth_requestToken", {
			oauth_callback : "oob"
		}, function(reply) {
			console.log('Info: got request token: ' + JSON.stringify(reply));
			self.cb.setToken(reply.oauth_token, reply.oauth_token_secret);
			self.cb.__call("oauth_authorize", {}, function(auth_url) {
				var win = Ti.UI.createWindow({
					fullscreen : true,
					enableZoomControls : false,
					disableBounce : true,
					modal : true,navBarHidden:true,
					hideLoadIndicator : true,
					transform : Ti.UI.create2DMatrix({
						scale : 0.95
					})
				});
				win.open();
				var webView = Ti.UI.createWebView({
					url : auth_url,
					width : Ti.UI.FILL,
					height : Ti.UI.FILL
				});
				win.add(webView);
				var destroyAuthorizeUI = function() {
					Ti.API.info('destroyAuthorizeUI');
					try {
						webView.removeEventListener('load', authorizeUICallback);
						win.remove(webView);
						webView = null;
						win.close();
					} catch(ex) {
						Ti.API.info('Cannot destroy the authorize UI. Ignoring.');
					}
				};
				var authorizeUICallback = function(e) {
					var val = webView.evalJS('window.document.querySelector(\'kbd[aria-labelledby="code-desc"] > code\').innerHTML');
					if (val) {
						destroyAuthorizeUI();
						self.cb.__call("oauth_accessToken", {
							oauth_verifier : val
						}, function(reply) {
							self.cb.setToken(reply.oauth_token, reply.oauth_token_secret);
							Ti.API.info(reply);

							self.accessToken = reply.oauth_token;
							self.accessTokenSecret = reply.oauth_token_secret;
							self.saveAccessToken();
							_callback && _callback({
								success : true
							});

						});
					}
				};
				webView.addEventListener('load', authorizeUICallback);
			});
		});
	}
};

//  anonymous fetching of twitter:
TwitterAdapter.prototype.fetch = function(_action, _needle, _callback) {
	this.cb.__call(_action, {
		q : Ti.Network.encodeURIComponent(_needle)
	}, function(reply) {
		if (reply.httpstatus == 200)
			_callback && _callback(reply);
	}, true);
};

module.exports = TwitterAdapter;
