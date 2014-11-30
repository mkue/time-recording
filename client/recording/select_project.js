var userId;

Template.selectProject.helpers({
    projects: function() {
        return Employees.getEmployeeProjects(this._id);
    },

    userId: function() {
        return userId;
    }
});

Template.selectProject.created = function() {
    userId = this.data._id;
};