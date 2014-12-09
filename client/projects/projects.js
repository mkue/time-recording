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
        Projects.insert({
            name: name
        });
        document.getElementById('new-project-form').reset();
    },

    'click .remove-project': function(event) {
        var projectId = $(event.target).attr('data-project-id');
        Projects.remove(projectId);
    }
});