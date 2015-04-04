
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* admin.js
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */


Session.setDefault('currentSelection', null);


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Helpers
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
Template.admin.helpers({
	teammate: function () {
		return Teammates.find({}, {sort: {name: 1}}).fetch();
	},
	region: function () {
		return Regions.find({}, {sort: {name: 1}}).fetch();
	},
	client: function () {
		return Clients.find({}, {sort: {name: 1}}).fetch();
	},
	worktype: function () {
		return Worktypes.find({}, {sort: {name: 1}}).fetch();
	},
	country: function () {
		return Countries.find({}, {sort: {name: 1}}).fetch();
	},
	selected: function () {
		return Session.equals('currentSelection', this._id) ? 'selected' : '';
	},
});


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Helpers
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
Template.admin.events({

// Teammates
	'click .addTeammate': function (evt, template) {
		var teammateName = template.find('.addTeammateInput').value;
		if (teammateName.length > 0) {
			Teammates.insert({name: teammateName});
			template.find('.addTeammateInput').value = '';
		}
	},
	'keypress input.addTeammateInput': function (evt, template) {
		if (evt.which === 13) {
			var teammateName = template.find('.addTeammateInput').value;
			if (teammateName.length > 0) {
				Teammates.insert({name: teammateName});
				template.find('.addTeammateInput').value = '';
			}
		}
	},
	'keypress input.editTeammateInput': function (evt, template) {
		if (evt.which === 13) {
			var teammateName = template.find('.editTeammateInput').value;
			if (teammateName.length > 0) {
				Teammates.update(this._id, {$set: {name: teammateName}});
				Session.set('currentSelection', null);
			}
		}
	},
	'click .deleteTeammate': function (evt, template) {
		Teammates.remove({_id: this._id});
	},

// Regions
	'click .addRegion': function (evt, template) {
		var regionName = template.find('.addRegionInput').value;
		if (regionName.length > 0) {
			Regions.insert({name: regionName});
			template.find('.addRegionInput').value = '';
		}
	},
	'keypress input.addRegionInput': function (evt, template) {
		if (evt.which === 13) {
			var regionName = template.find('.addRegionInput').value;
			if (regionName.length > 0) {
				Regions.insert({name: regionName});
				template.find('.addRegionInput').value = '';
			}
		}
	},
	'keypress input.editRegionInput': function (evt, template) {
		if (evt.which === 13) {
			var regionName = template.find('.editRegionInput').value;
			if (regionName.length > 0) {
				Regions.update(this._id, {$set: {name: regionName}});
				Session.set('currentSelection', null);
			}
		}
	},
	'click .deleteRegion': function (evt, template) {
		Regions.remove({_id: this._id});
	},

// Clients
	'click .addClient': function (evt, template) {
		var clientName = template.find('.addClientInput').value;
		if (clientName.length > 0) {
			Clients.insert({name: clientName});
			template.find('.addClientInput').value = '';
		}
	},
	'keypress input.addClientInput': function (evt, template) {
		if (evt.which === 13) {
			var clientName = template.find('.addClientInput').value;
			if (clientName.length > 0) {
				Clients.insert({name: clientName});
				template.find('.addClientInput').value = '';
			}
		}
	},
	'keypress input.editClientInput': function (evt, template) {
		if (evt.which === 13) {
			var clientName = template.find('.editClientInput').value;
			if (clientName.length > 0) {
				Clients.update(this._id, {$set: {name: clientName}});
				Session.set('currentSelection', null);
			}
		}
	},
	'click .deleteClient': function (evt, template) {
		Clients.remove({_id: this._id});
	},

// Worktypes
	'click .addWorktype': function (evt, template) {
		var worktypeName = template.find('.addWorktypeInput').value;
		if (worktypeName.length > 0) {
			Worktypes.insert({name: worktypeName});
			template.find('.addWorktypeInput').value = '';
		}
	},
	'keypress input.addWorktypeInput': function (evt, template) {
		if (evt.which === 13) {
			var worktypeName = template.find('.addWorktypeInput').value;
			if (worktypeName.length > 0) {
				Worktypes.insert({name: worktypeName});
				template.find('.addWorktypeInput').value = '';
			}
		}
	},
	'keypress input.editWorktypeInput': function (evt, template) {
		if (evt.which === 13) {
			var worktypeName = template.find('.editWorktypeInput').value;
			if (worktypeName.length > 0) {
				Worktypes.update(this._id, {$set: {name: worktypeName}});
				Session.set('currentSelection', null);
			}
		}
	},
	'click .deleteWorktype': function (evt, template) {
		Worktypes.remove({_id: this._id});
	},

// Countries
	'click .addCountry': function (evt, template) {
		var countryName = template.find('.addCountryInput').value;
		if (countryName.length > 0) {
			Countries.insert({name: countryName});
			template.find('.addCountryInput').value = '';
		}
	},
	'keypress input.addCountryInput': function (evt, template) {
		if (evt.which === 13) {
			var countryName = template.find('.addCountryInput').value;
			if (countryName.length > 0) {
				Countries.insert({name: countryName});
				template.find('.addCountryInput').value = '';
			}
		}
	},
	'keypress input.editCountryInput': function (evt, template) {
		if (evt.which === 13) {
			var countryName = template.find('.editCountryInput').value;
			if (countryName.length > 0) {
				Countries.update(this._id, {$set: {name: countryName}});
				Session.set('currentSelection', null);
			}
		}
	},
	'click .deleteCountry': function (evt, template) {
		Countries.remove({_id: this._id});
	},

// All
	'click .currentSelection': function (evt, template) {
		Session.set('currentSelection', this._id);
	}
});