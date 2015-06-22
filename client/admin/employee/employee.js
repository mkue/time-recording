var employeeId, startDate, stopDate, currentProject, currentTimestamp;

Template.employee.created = function() {
    employeeId = this.data._id;
};

Template.employee.rendered = function() {
    if (Employees.findOne(employeeId).nineOClockBreak) {
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
            userId: employeeId
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
    }
});

Template.employee.events({
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
        stopDate = false;
        currentProject = this.projectId;
        currentTimestamp = this._id;
        $('#time-input').val(moment(startDate).format('HH:mm'));
        $('#edit-timestamp-modal').modal();
    },

    'click .recording-stop-time': function() {
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
                    startDate: date.valueOf(),
                    automaticallyStopped: false
                }
            });
        } else {
            date = moment(stopDate).hour(hour).minute(min);
            Recordings.update({
                _id: currentTimestamp
            }, {
                $set: {
                    stopDate: date.valueOf(),
                    automaticallyStopped: false
                }
            });
        }
        $('#edit-timestamp-modal').modal('hide');
    },

    'click #export-employee': function() {
        Exporter.exportEmployee(employeeId);
    }
});