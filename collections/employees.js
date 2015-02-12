Employees = new Meteor.Collection('employees');

Employees.allow({
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

Employees.addProject = function(employeeId, projectId) {
    Employees.update({
        _id: employeeId
    }, {
        $addToSet: {
            projects: projectId
        }
    });
};

Employees.removeProject = function(employeeId, projectId) {
    Employees.update({
        _id: employeeId
    }, {
        $pull: {
            projects: projectId
        }
    });
};

Employees.getEmployeeProjects = function(employeeId, onlyUnfinishedProjects) {
    var employee = Employees.findOne({
        _id: employeeId
    });
    var projectIds = employee ? employee.projects : undefined;
    if (projectIds) {
        if (onlyUnfinishedProjects) {
            return Projects.find({
                _id: {
                    $in: projectIds
                },
                finished: false
            }, {
                sort: {
                    name: 1
                }
            });
        } else {
            return Projects.find({
                _id: {
                    $in: projectIds
                }
            }, {
                sort: {
                    name: 1
                }
            });
        }
    }
};