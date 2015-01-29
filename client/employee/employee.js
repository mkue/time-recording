var userId;

Template.employee.created = function() {
    userId = this.data._id;
};

Template.employee.rendered = function() {
    if (Employees.findOne(userId).nineOClockBreak) {
        $('#nine-o-clock-break').attr('checked', true);
    }
};

Template.employee.helpers({
    projects: function() {
        return Employees.getEmployeeProjects(this._id);
    },

    availableProjects: function() {
        return Projects.find({}, {
            sort: {
                name: 1
            }
        });
    }
});

Template.employee.events({
    'change #project-selector': function(event) {
        Employees.addProject(userId, event.target.value);
        $('#project-selector').prop('selectedIndex', 0);
    },

    'click #remove-project': function() {
        var projectId = $('#remove-project').attr('data-project-id');
        Employees.removeProject(userId, projectId);
    },

    'click #nine-o-clock-break': function() {
        var checked = $('#nine-o-clock-break').prop('checked');
        Employees.update(userId, {
            $set: {
                nineOClockBreak: checked
            }
        });
    }
});