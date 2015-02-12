var userId;

Template.selectProject.helpers({
    projects: function() {
        return Employees.getEmployeeProjects(this._id, true);
    },

    userId: function() {
        return userId;
    }
});

Template.selectProject.created = function() {
    userId = this.data._id;
};