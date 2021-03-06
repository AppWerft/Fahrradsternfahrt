exports.timeline = {
	properties : {
		height : Ti.UI.SIZE,
	},
	childTemplates : [{
		type : 'Ti.UI.Label',
		bindId : 'starttime',
		properties : {
			color : '#666',
			top : 10,
			font : {
				fontSize : 36,
				fontWeight : 'bold',
				fontFamily : 'Monospace'
			},
			right : 15,

		}
	}, {
		type : 'Ti.UI.View',
		properties : {
			layout : 'vertical',
			right : 110,
			height : Ti.UI.SIZE,
			left : 10
		},
		childTemplates : [{
			type : 'Ti.UI.Label',
			bindId : 'title',
			properties : {
				color : '#333',
				width : Ti.UI.FILL,
				height : Ti.UI.SIZE,
				font : {
					fontSize : 20,
					fontWeight : 'bold',
					fontFamily : 'PTSans-NarrowBold'
				},
				left : 0,
				right : 0,
				top : 5
			}
		}, {
			type : 'Ti.UI.Label',
			bindId : 'distance',
			properties : {
				color : '#aaa',
				width : Ti.UI.SIZE,
				height : Ti.UI.SIZE,
				text : '',
				font : {
					fontSize : 16,
					fontFamily : 'PTSans-Narrow'
				},
				left : 0,
				bottom : 0
			}
		}, {
			type : 'Ti.UI.Label',
			bindId : 'fulltext',
			properties : {
				color : '#666',
				height : Ti.UI.SIZE,
				font : {
					fontSize : 14,
					fontFamily : 'PTSans-Narrow'
				},
				left : 0,
				bottom : 5
			}
		}]
	}],
};

exports.nearme = {
	properties : {
		height : Ti.UI.SIZE,
	},
	childTemplates : [{
		type : 'Ti.UI.Label',
		bindId : 'starttime',
		properties : {
			color : '#666',
			top : 10,
			font : {
				fontSize : 36,
				fontWeight : 'bold',
				fontFamily : 'Monospace'
			},
			right : '15dip',

		}
	}, {
		type : 'Ti.UI.View',
		properties : {
			layout : 'vertical',
			right : 110,
			left : 10,height : Ti.UI.SIZE,
		},
		childTemplates : [{
			type : 'Ti.UI.Label',
			bindId : 'title',
			properties : {
				color : '#333',
				width : Ti.UI.FILL,
				height : Ti.UI.SIZE,
				font : {
					fontSize : 20,
					fontWeight : 'bold',
					fontFamily : 'PTSans-NarrowBold'
				},
				left : 0,
				right : 0,
				top : 5
			}
		}, {
			type : 'Ti.UI.Label',
			bindId : 'distance',
			properties : {
				color : '#555',
				width : Ti.UI.SIZE,
				height : Ti.UI.SIZE,
				text : '',
				font : {
					fontSize : 18,
					fontFamily : 'PTSans-Narrow'
				},
				left : 0,
				top : 5,
			}
		}, {
			type : 'Ti.UI.Label',
			bindId : 'fulltext',
			properties : {
				color : '#666',
				height : Ti.UI.SIZE,
				font : {
					fontSize : 14,
					fontFamily : 'PTSans-Narrow'
				},
				left : 0,
				text : '',
				bottom : 5
			}
		}]
	}],
};
