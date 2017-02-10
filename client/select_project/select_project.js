var userId;
Template.selectProject.helpers({
    projects: function() {
        return Projects.find({
            finished: false
        }, {
            sort: {
                projectNr: 1
            }
        });
    },
    userId: function() {
        return userId;
    },
    projectName: function() {
        return Projects.getProjectName(this);
    }
});

Template.selectProject.created = function() {
    userId = this.data._id;
};