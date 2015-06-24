var employeeId, startDate, stopDate, recordingId;

Template.employeeAdmin.created = function() {
    employeeId = this.data._id;
};

Template.employeeAdmin.rendered = function() {
    if (Employees.findOne(employeeId).nineOClockBreak) {
        $('#nine-o-clock-break').attr('checked', true);
    }
};

Template.employeeAdmin.helpers({
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
            userId: employeeId,
            stopDate: {
                $exists: true
            }
        }, {
            sort: {
                startDate: -1
            }
        });
    },

    getProject: function(id) {
        var project = Projects.findOne(id);
        return project.projectNr + " - " + project.machineNr + " " + project.machineType + " - " + project.customer;
    },

    getDay: function(timeInMillis) {
        return moment(timeInMillis).format('DD.MM.YY');
    },

    getTime: function(timeInMillis) {
        return moment(timeInMillis).format('HH:mm');
    },

    forgotToLogout: function() {
        if (this.automaticallyStopped)
            return "#F2DEDE"
    }

});

Template.employeeAdmin.events({
    'change #project-selector': function(event) {
        Employees.addProject(employeeId, event.target.value);
        $('#project-selector').prop('selectedIndex', 0);
    },

    'click .remove-project': function() {
        Employees.removeProject(employeeId, this._id);
    },

    'click #nine-o-clock-break': function() {
        var checked = $('#nine-o-clock-break').prop('checked');
        Employees.update(employeeId, {
            $set: {
                nineOClockBreak: checked
            }
        });
    },

    'click .recording-day': function() {
        var recordingMoment = moment(this.startDate);
        console.log(recordingMoment.format('DD.MM HH:mm'));
        recordingMoment.startOf('day');
        var startOfDayInMillis = recordingMoment.valueOf();
        recordingMoment.endOf('day');
        var endOfDayInMillis = recordingMoment.valueOf();
        var recordings = Recordings.find({
            userId: employeeId,
            startDate: {
                $gt: startOfDayInMillis
            },
            stopDate: {
                $lt: endOfDayInMillis
            }
        }).fetch();
        console.log(recordings);
    },

    'click .recording-start-time': function() {
        startDate = this.startDate;
        stopDate = this.stopDate;
        recordingId = this._id;
        $('#time-input').val(moment(startDate).format('HH:mm'));
        $('#time-input').attr('data-date-type', 'start');
        $('#edit-timestamp-modal').modal();
    },

    'click .recording-stop-time': function() {
        stopDate = this.stopDate;
        startDate = this.startDate;
        recordingId = this._id;
        $('#time-input').val(moment(stopDate).format('HH:mm'));
        $('#time-input').attr('data-date-type', 'stop');
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
        var time = $('#time-input').val();
        var hour = time.substr(0, time.indexOf(':'));
        var min = time.substr(time.indexOf(':') + 1, time.length - 1);
        var timeIsValid = hour >= 0 && hour <= 23 && min >= 0 && min <= 59
        var dateType = $('#time-input').attr('data-date-type');
        if (dateType == 'start') {
            startDate = moment(startDate).hour(hour).minute(min).valueOf();
        } else if (dateType = 'stop') {
            stopDate = moment(stopDate).hour(hour).minute(min).valueOf();
        }
        if (timeIsValid && startDate < stopDate) {
            Recordings.update({
                _id: recordingId
            }, {
                $set: {
                    startDate: startDate,
                    stopDate: stopDate,
                    automaticallyStopped: false
                }
            });
            $('#edit-timestamp-modal').modal('hide');
        }
    },

    'click #export-employee': function() {
        Exporter.exportEmployee(employeeId);
    }
});