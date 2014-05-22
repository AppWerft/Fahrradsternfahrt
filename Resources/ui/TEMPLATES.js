exports.nearme = {
	properties : {
		height : 70,
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
			color : '#aaa',
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			text : '',
			font : {
				fontSize : 12,
				fontFamily : 'Designosaur'
			},
			right : '20dip',
			bottom : '1dp'
		}
	}, {
		type : 'Ti.UI.Label',
		bindId : 'zeit',
		properties : {
			color : '#666',
			top : 10,
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

