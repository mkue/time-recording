Template.settingsAdmin.helpers({
    machineTypes: function() {
        return MachineTypes.find({}, {
            sort: {
                name: 1
            }
        });
    }
});

Template.settingsAdmin.events({
    'submit form': function(event) {
        event.preventDefault();
        var machineType = event.target.machineType.value;
        MachineTypes.insert({
            name: machineType
        });
        document.getElementById('new-machine-type-form').reset();
    },

    'click .remove-machine-type': function(event) {
        var machineTypeId = $(event.target).attr('data-machine-type-id');
        $('#remove-button').attr('data-machine-type-id', machineTypeId);
        $('#remove-modal').modal();
    }
});