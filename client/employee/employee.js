var userId, startDate, stopDate, currentProject, currentTimestamp;

Template.employee.created = function() {
    userId = this.data._id;
};

Template.employee.rendered = function() {
    if (Employees.findOne(userId).nineOClockBreak) {
        $('#nine-o-clock-break').attr('checked', true);
    }
};

Template.employee.helpers({
    projects: function() {
        return Employees.getEmployeeProjects(this._id);
    },

    availableProjects: function() {
        return Projects.find({}, {
            sort: {
                name: 1
            }
        });
    },
    recordings: function() {
        return Recordings.find({
            userId: userId
        }, {
            sort: {
                startDate: -1
            }
        });
    },

    getProject: function(id) {
        return Projects.findOne(id).name;
    },

    getDay: function(timeInMillis) {
        return moment(timeInMillis).format('DD.MM.YY');
    },

    getTime: function(timeInMillis) {
        return moment(timeInMillis).format('HH:mm');
    }
});

Template.employee.events({
    'change #project-selector': function(event) {
        Employees.addProject(userId, event.target.value);
        $('#project-selector').prop('selectedIndex', 0);
    },

    'click #remove-project': function() {
        var projectId = $('#remove-project').attr('data-project-id');
        Employees.removeProject(userId, projectId);
    },

    'click #nine-o-clock-break': function() {
        var checked = $('#nine-o-clock-break').prop('checked');
        Employees.update(userId, {
            $set: {
                nineOClockBreak: checked
            }
        });
    },

    'click .start-date': function() {
        startDate = this.startDate;
        stopDate = false;
        currentProject = this.projectId;
        currentTimestamp = this._id;
        $('#time-input').val(moment(startDate).format('HH:mm'));
        $('#edit-timestamp-modal').modal();
    },

    'click .stop-date': function() {
        stopDate = this.stopDate;
        startDate = false;
        currentProject = this.projectId;
        currentTimestamp = this._id;
        $('#time-input').val(moment(stopDate).format('HH:mm'));
        $('#edit-timestamp-modal').modal();
    },

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

    'click #edit-timestamp': function() {
        var date;
        var time = $('#time-input').val();
        var hour = time.substr(0, 2);
        var min = time.substr(3, 4);
        if (startDate) {
            date = moment(startDate).hour(hour).minute(min);
            Recordings.update({
                _id: currentTimestamp
            }, {
                $set: {
                    startDate: date.valueOf()
                }
            });
        } else {
            date = moment(stopDate).hour(hour).minute(min);
            Recordings.update({
                _id: currentTimestamp
            }, {
                $set: {
                    stopDate: date.valueOf()
                }
            });
        }
        $('#edit-timestamp-modal').modal('hide');
    }
});