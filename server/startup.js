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
    var millisUntil23 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 0, 0, 0) - now;
    if (millisUntil23 < 0) {
        millisUntil23 += 86400000; // it's after 23:00, try 23:00 tomorrow.
    }
    Meteor.setTimeout(function() {
        stopRunningProjects();
        Meteor.setInterval(stopRunningProjects, 86400000);
    }, millisUntil23);
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
    }
});