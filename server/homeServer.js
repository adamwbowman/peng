
//////////////////////////////////////////////////////////////////////////////////
// Meteor Methods...
Meteor.methods({ 
	'removeFromCalendar': function (teammateName, taskId) {
		var collBookingCalendar = BookingCalendar.find({'teammates.task': taskId}).fetch();
		_.each(collBookingCalendar, function (item) {
			BookingCalendar.update({_id: item._id}, {$inc: {score: -1}});
			BookingCalendar.update({_id: item._id}, {$pull: {teammates: {task: taskId}}});
		});
		Tasks.remove({_id: taskId});
	},
	'updateCalendar': function (startDate, endDate, teammateName, taskId) {
		// create collection by task and remove
		var collBookingCalendar = BookingCalendar.find({'teammates.task': taskId}).fetch();
		_.each(collBookingCalendar, function (item) {
			BookingCalendar.update({_id: item._id}, {$inc: {score: -1}});
			BookingCalendar.update({_id: item._id}, {$pull: {teammates: {task: taskId}}});
		});
		// add task to calendar
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
	},
});