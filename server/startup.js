var lastProjectStops;

var stopRunningProjects = function() {
    lastProjectStops = new Date();
    Recordings.update({
        stopDate: {
            $exists: false
        }
    }, {
        $set: {
            stopDate: new Date().getTime(),
            automaticallyStopped: true
        }
    }, {
        multi: true
    });
    Employees.update({}, {
        $set: {
            currentRecording: null
        }
    }, {
        multi: true
    });
};

Meteor.startup(function() {
    var now = new Date();
    var millisUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 0) - now;
    if (millisUntilMidnight < 0) {
        millisUntilMidnight += 86400000; // it's after 23:00, try 23:00 tomorrow.
    }
    Meteor.setTimeout(function() {
        stopRunningProjects();
        Meteor.setInterval(stopRunningProjects, 86400000);
    }, millisUntilMidnight);
});

Meteor.methods({
    'stopProjects': function() {
        stopRunningProjects();
    },

    'getLastProjectStops': function() {
        return lastProjectStops;
    }, // use Meteor.call('getLastProjectStops', function(error, result){console.log(result)}); to get the lastProjectStops variable

    'removeEmployee': function(employeeId) {
        Employees.remove(employeeId);
        Recordings.remove({
            userId: employeeId
        });
    },

    'removeProject': function(projectId) {
        Projects.remove(projectId);
        Recordings.remove({
            projectId: projectId
        });
        Employees.update({}, {
            $pull: {
                projects: projectId
            }
        });
    },

    'removeMachineType': function(machineTypeId) {
        MachineTypes.remove(machineTypeId);
    }
});