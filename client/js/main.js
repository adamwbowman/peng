
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* main.js
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

Session.setDefault('showRequestModal', false);


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Helpers
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

Template.navbar.helpers({
	showRequestModal: function () {
		return Session.get('showRequestModal');
	},
});


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Events
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

Template.navbar.events({
	'click .requestService': function () {
		Session.set('showRequestModal', true);
	},
	'click .createCalendar': function () {
		createCalendar(dateToUnix('04/01/2015'), dateToUnix('05/31/2015'));
	},
});

Template.modals.events({
	'click .createRequest': function (event, template) {
		Tasks.insert({
			teammate: null, 
			client: template.find('#client').value, 
			projectinfo: null,
			worktype: null,
			product: template.find('#product').value,
			startDate: dateToUnix(template.find('#startDate').value),
			endDate: dateToUnix(template.find('#endDate').value),
			dateCreated: new Date
		});
		Session.set('showRequestModal', false);
	},
	'click .cancel': function () {
		Session.set('showRequestModal', false);
	},
});


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Rendered
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
Template.modals.rendered = function () {
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

var calcWorkingDays = function (startDate, endDate) {
	var startDate = moment.unix(startDate);
	var endDate = moment.unix(endDate);
	var dateDiff = moment(endDate).diff(moment(startDate));
	var duration = moment.duration(dateDiff);
	var days = duration.asDays();
	days = (parseInt(days)+1);
	var firstDate = moment(startDate);
	var workDays = 0;
	while (days > 0) {
		if (firstDate.isoWeekday() !== 5 && firstDate.isoWeekday() !== 6) {
			workDays += 1;
		}
		days -= 1;
		firstDate = firstDate.add(1, 'days');
	}
	return workDays;
}

var createCalendar = function (startDate, endDate) {
	var startDate = moment.unix(startDate);
	var endDate = moment.unix(endDate);
	var dateDiff = moment(endDate).diff(moment(startDate));
	var duration = moment.duration(dateDiff);
	var days = duration.asDays();
	days = (parseInt(days)+1);
	var firstDate = moment(startDate);
	var workDays = [];

	while (days > 0) {
		if (firstDate.isoWeekday() !== 6 && firstDate.isoWeekday() !== 7) {
		var xxx = moment(firstDate).unix();
		BookingCalendar.insert({date: xxx, teammates: []});
		}
		days -= 1;
		firstDate = firstDate.add(1, 'days');
	}
	console.log('Booking Calendar created ' + BookingCalendar.find().count() + ' days.');
}

