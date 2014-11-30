var userId;

Template.employee.created = function() {
    userId = this.data._id;
};

Template.employee.helpers({
    projects: function() {
        return Employees.getEmployeeProjects(this._id);
    },
    availableProjects: function() {
        return Projects.find();
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
    }
});