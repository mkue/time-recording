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
Projects.getProjectName = function(project) {
    var name = project.customer;
    if (project.machineType && project.machineType !== 'default') {
        name = project.machineType + '_' + name;
    }
    if (project.machineNr) {
        name = project.machineNr + '_' + name;
    }
    if (project.projectNr) {
        name = project.projectNr + '_' + name;
    }
    return name;
};