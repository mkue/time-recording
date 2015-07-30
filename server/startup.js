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
    (function loop() {
        var now = new Date();
        if (now.getHours() === 23) {
            stopRunningProjects();
        }
        now = new Date();
        var delay =  3600000;
        setTimeout(loop, delay);
    })();
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