Template.home.helpers({
    employees: function() {
        return Employees.find({}, {
            sort: {
                name: 1
            }
        });
    },
    color: function() {
        if (Recordings.getCurrentRecording(this._id)) {
            return '#0FAD4F';
        }
    }
});

Template.home.events({
    'click #employee-button': function() {
        var currentRecordingId = Recordings.getCurrentRecording(this._id);
        if (currentRecordingId) {
            var projectId = Recordings.findOne({
                _id: currentRecordingId
            }).projectId;
            window.location = 'recording/' + this._id + '/' + projectId;
        } else {
            window.location = 'select-project/' + this._id;
        }
    }
});