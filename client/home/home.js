Template.home.helpers({
    employees: function() {
        return Employees.find();
    }
});

Template.home.events({
    'click #employee-button': function() {
        console.log(this);
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