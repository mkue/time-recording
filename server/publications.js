Meteor.publish('employees', function() {
    return Employees.find();
});

Meteor.publish('projects', function() {
    return Projects.find();
});

Meteor.publish('recordings', function() {
    return Recordings.find();
});