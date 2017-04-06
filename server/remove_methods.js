Meteor.methods({
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
    },
    'removeComment': function(commentId) {
        Comments.remove(commentId);
    }
});