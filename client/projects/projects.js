Template.projects.helpers({
    projects: function() {
        return Projects.find({}, {
            sort: {
                name: 1
            }
        });
    }
});

Template.projects.events({
    'submit form': function(event) {
        event.preventDefault();
        var name = event.target.name.value;
        var checked = $('#assign-employees').prop('checked');
        var projectId = Projects.insert({
            name: name
        });
        if (checked) {
            Employees.find({}).forEach(function(employee) {
                Employees.addProject(employee._id, projectId);
            });
        }
        document.getElementById('new-project-form').reset();
    },

    'click .export-project': function(event) {
        var projectId = $(event.target).attr('data-project-id');
        Exporter.exportProject(projectId);
    },

    'click .remove-project': function(event) {
        var projectId = $(event.target).attr('data-project-id');
        $('#remove-button').attr('data-project-id', projectId);
        $('#remove-modal').modal();
    },

    'click #remove-button': function() {
        var projectId = $('#remove-button').attr('data-project-id');
        Projects.remove(projectId);
        $('#remove-modal').modal('hide');
    }
});