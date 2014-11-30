Recordings = new Meteor.Collection('recordings');

Recordings.allow({
    insert: function() {
        return true;
    },
    update: function() {
        return true;
    },
    remove: function() {
        return true;
    }
});

Recordings.getCurrentRecording = function(userId) {
    var employee = Employees.findOne({
        _id: userId
    });
    return employee.currentRecording;
};