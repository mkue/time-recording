var clock;

Template.recording.rendered = function() {
    clock = $('.my-clock').FlipClock({
        autoStart: false,
        defaultLanguage: 'deutsch'
    });

    var currentRecordingId = Recordings.getCurrentRecording(this.data.userId);
    if (currentRecordingId) {
        var recording = Recordings.findOne({
            _id: currentRecordingId
        });
        var now = new Date();
        clock.setTime(now.getTime() / 1000 - recording.startDate / 1000);
        clock.start();
    }
};

Template.recording.helpers({
    running: function() {
        var currentRecordingId = Recordings.getCurrentRecording(this.userId);
        return currentRecordingId ? true : false;
    },

    name: function() {
        return Employees.findOne({
            _id: this.userId
        }).name;
    },

    project: function() {
        console.log(this.projectId);
        return Projects.findOne({
            _id: this.projectId
        }).name;
    }
});

Template.recording.events({
    'click #start-button': function() {
        clock.start();
        var recordingId = Recordings.insert({
            projectId: this.projectId,
            userId: this.userId,
            startDate: new Date().getTime()
        });
        Employees.update({
            _id: this.userId
        }, {
            $set: {
                currentRecording: recordingId
            }
        });
    },

    'click #stop-button': function() {
        clock.stop();
        clock.setTime(0);
        var currentRecordingId = Recordings.getCurrentRecording(this.userId);
        Recordings.update({
            _id: currentRecordingId
        }, {
            $set: {
                stopDate: new Date().getTime()
            }
        });
        Employees.update({
            _id: this.userId
        }, {
            $set: {
                currentRecording: null
            }
        });
    }
});