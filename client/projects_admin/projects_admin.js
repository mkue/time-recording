Template.projectsAdmin.helpers({
    projects: function() {
        return Projects.find({}, {
            sort: {
                name: 1
            }
        });
    },

    finished: function() {
        return Projects.findOne(this._id).finished;
    }
});

Template.projectsAdmin.events({
    'submit form': function(event) {
        event.preventDefault();
        var name = event.target.name.value;
        var checked = $('#assign-employees').prop('checked');
        var projectId = Projects.insert({
            name: name,
            finished: false
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

    'click .finish-project': function() {
        Projects.update({
            _id: this._id
        }, {
            $set: {
                finished: true
            }
        });
    },

    'click .open-project': function() {
        Projects.update({
            _id: this._id
        }, {
            $set: {
                finished: false
            }
        });
    }
});