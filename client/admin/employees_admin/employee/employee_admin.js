var employeeId;
Template.employeeAdmin.created = function() {
    employeeId = this.data._id;
};

Template.employeeAdmin.helpers({
    recordings: function() {
        return Recordings.find({
            userId: employeeId
        }, {
            sort: {
                date: -1
            }
        });
    },
    getProject: function(id) {
        var project = Projects.findOne(id);
        return Projects.getProjectName(project);
    },
    getDate: function(date) {
        return moment(date).format('D.M.YY');
    },
    getDuration: function(duration) {
        var momentDuration = moment.duration(duration, 'minutes');
        return momentDuration.hours() + 'h ' + momentDuration.minutes() + 'min';
    }
});
Template.employeeAdmin.events({
    'click .remove-timestamp': function() {
        $('#remove-button').attr('data-timestamp-id', this._id);
        $('#remove-modal').modal();
    },
    'click #remove-button': function() {
        var timestamp = $('#remove-button').attr('data-timestamp-id');
        Recordings.remove({
            _id: timestamp
        });
        $('#remove-modal').modal('hide');
    },
    'click #export-employee': function() {
        Exporter.exportEmployee(employeeId);
    }
});