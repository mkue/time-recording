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
    }
});

Template.projectsAdmin.events({
    'submit form': function(event) {
        event.preventDefault();
        var projectNr = event.target.projectNr.value;
        var machineNr = event.target.machineNr.value;
        var machineType = event.target.machineType.value;
        var customer = event.target.customer.value;
        var projectId = Projects.insert({
            projectNr: projectNr,
            machineNr: machineNr,
            machineType: machineType,
            customer: customer,
            finished: false
        });
        var checked = $('#assign-employees').prop('checked');
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