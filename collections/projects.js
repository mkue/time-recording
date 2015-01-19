Projects = new Meteor.Collection('projects');

Projects.allow({
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

Projects.addNewProject = function(name) {
    Projects.insert({
        name: name
    });
};