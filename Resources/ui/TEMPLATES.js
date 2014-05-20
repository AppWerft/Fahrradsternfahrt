exports.nearme = {
	properties : {
		height : 60,
	},
	childTemplates : [{
		type : 'Ti.UI.Label',
		bindId : 'title',
		properties : {
			color : '#333',
			width : Ti.UI.FILL,
			height : '30dp',
			font : {
				fontSize : '20dp',
				fontWeight : 'bold',
				fontFamily : 'Designosaur'
			},
			left : '10dp',
			right : '10dp',
			top : '5dp'
		}
	}, {
		type : 'Ti.UI.Label',
		bindId : 'dist',
		properties : {
			color : '#333',
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			font : {
				fontSize : '14dip',
				fontWeight : 'bold',
				fontFamily : 'Designosaur'
			},
			right : '10dip',
			left : '10dip',
			top : '5dp'
		}
	}, {
		type : 'Ti.UI.Label',
		bindId : 'zeit',
		properties : {
			color : '#666',
			font : {
				fontSize : '32dp',
				fontWeight : 'bold',
				fontFamily : 'Monospace'
			},
			right : '15dip',
			
		}
	}, {
		type : 'Ti.UI.Label',
		bindId : 'subtitle',
		properties : {
			color : '#aaa',
			font : {
				fontSize : '16dp',
				
				fontFamily : 'Designosaur'
			},
			left : '10dp',
			bottom : '5dp'
		}
	}]
};

