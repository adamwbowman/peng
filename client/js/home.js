
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* home.js
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

Session.setDefault('taskSelection', null);


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Helpers
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
Template.home.helpers({
	record: function () {
		return Tasks.find({}, {sort: {'dateCreated': -1}}).fetch();
	}
});

Template.tasks.helpers({
	xteammate: function () {
		return Teammates.find({}).fetch();
	},
	thisteammate: function (name) {
		var collTask = Tasks.find({'_id': Session.get('taskSelection')}).fetch();
		var teammate = _.chain(collTask).pluck('teammate').value();
		return (name == teammate) ? 'selected' : '';
	},	
	xclient: function () {
		return Clients.find({}).fetch();
	},
	thisclient: function (name) {
		var collTask = Tasks.find({'_id': Session.get('taskSelection')}).fetch();
		var client = _.chain(collTask).pluck('client').value();
		return (name == client) ? 'selected' : '';
	},	
	selected: function () {
		return Session.equals('taskSelection', this._id) ? 'selected' : '';
	},
});


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Events
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
Template.tasks.events({
	'click .task': function (event, template) {
		Session.set('taskSelection', this._id);
	},
	'click .update': function (event, template) {
		Tasks.update(this._id, {$set: {
			teammate: template.find('#teammate').value, 
			client: template.find('#client').value, 
			projectinfo: null,
			worktype: null,
			startDate: dateToUnix(template.find('#startDate').value),
			endDate: dateToUnix(template.find('#endDate').value),
			dateModified: new Date
		}});
		Meteor.call('updateCalendar', dateToUnix(template.find('#startDate').value), dateToUnix(template.find('#endDate').value), template.find('#teammate').value, this._id);
		Session.set('taskSelection', null);
	},
	'click .delete': function () {
		Meteor.call('removeFromCalendar', this.teammate, this._id);
	},
});


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Rendered
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
Template.home.rendered = function() {
	var teamCal = new CalHeatMap();	
	teamCal.init({
		itemSelector: "#team-cal",
		domain: "month",
		subDomain: "x_day",
		start: new Date(2015, 0, 5),
		cellSize: 11,
		cellPadding: 1,
		domainGutter: 14,
		range: 12,
		verticalOrientation: false,
		domainDynamicDimension: false,
		displayLegend: false,
		domainLabelFormat: '',
		legendColors: {
			min: "#ededed",
			max: "#000000",
			empty: "#ededed"
		},
		legend: [1, 3]
	});

	var teamCalData = Meteor.autorun( function () {
		var teammate = Session.get('currentTeammate');
		var calendarColl = BookingCalendar.find().fetch();			
 		var formattedColl = {};
		_.each(calendarColl, function (item) {
			if (_.contains(item.teammates, teammate)) {
				formattedColl[item.date] = item.score;	
			}
		});
		teamCal.update(formattedColl);
	});
};

Template.tasks.rendered = function () {
	// Date Picker
	$('.input-daterange').datepicker({
		autoclose: true,
		daysOfWeekDisabled: "0,6",
		beforeShowDay: function (date){
		if (date.getMonth() == (new Date()).getMonth())
			switch (date.getDate()){
				case 4:
					return {
						tooltip: 'Example tooltip',
						classes: 'active'
					};
				case 8:
					return false;
				case 12:
					return "green";
			}
		}
	});
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Handlebar Helpers
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

Handlebars.registerHelper("formatDate", function(date) {
	return moment.unix(date).format("MM/DD/YYYY");
});


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Functions
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

var fillCalendar = function (startDate, endDate, teammateName, taskId) {
	var startDate = moment.unix(startDate);
	var endDate = moment.unix(endDate);
	var dateDiff = moment(endDate).diff(moment(startDate));
	var duration = moment.duration(dateDiff);
	var days = duration.asDays();
	days = (parseInt(days)+1);
	var firstDate = moment(startDate);	
	while (days > 0) {
		if (firstDate.isoWeekday() !== 6 && firstDate.isoWeekday() !== 7) {
			var unixdate = moment(firstDate).unix();
			var xxx = BookingCalendar.find({date: unixdate}).fetch();
			BookingCalendar.update(xxx[0]._id, {$inc: {score: 1}});
			BookingCalendar.update(xxx[0]._id, {$push: { teammates: { teammate: teammateName, task: taskId }}});
		}
	days -= 1;
	firstDate = firstDate.add(1, 'days');
	}
}

var dateToUnix = function (date) {
	if (date != '') {
		return moment(date).unix();
	}
}

var dateFromUnix = function (date) {
	if (date != '') {
		return moment.unix(date).format("MM/DD/YYYY");
	}
}

