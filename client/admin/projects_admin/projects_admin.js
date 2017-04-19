Template.projectsAdmin.helpers({
    projects: function() {
        return Projects.find({}, {
            sort: {
                projectNr: 1
            }
        });
    },
    finished: function() {
        return Projects.findOne(this._id).finished;
    },
    machineTypes: function() {
        return MachineTypes.find({}, {
            sort: {
                name: 1
            }
        });
    },
    projectName: function() {
        return Projects.getProjectName(this);
    }
});
Template.projectsAdmin.events({
    'submit form': function(event) {
        event.preventDefault();
        var projectNr = event.target.projectNr.value;
        var machineNr = event.target.machineNr.value;
        var machineType = event.target.machineType.value;
        var customer = event.target.customer.value;
        Projects.insert({
            projectNr: projectNr,
            machineNr: machineNr,
            machineType: machineType,
            customer: customer,
            finished: false
        });
        document.getElementById('new-project-form').reset();
    },
    'click .export-project': function(event) {
        var projectId = $(event.target).attr('data-project-id');
        Exporter.exportProject(projectId);
    },
    'click .export-all-projects': function() {
        Exporter.exportAllTimestamps();
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
    'click .reopen-project': function() {
        Projects.update({
            _id: this._id
        }, {
            $set: {
                finished: false
            }
        });
    }
});