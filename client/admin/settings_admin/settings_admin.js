Template.settingsAdmin.helpers({
    machineTypes: function() {
        return MachineTypes.find({}, {
            sort: {
                name: 1
            }
        });
    },
    comments: function() {
        return Comments.find({}, {
            sort: {
                comment: 1
            }
        });
    }
});
Template.settingsAdmin.events({
    'submit form': function(event) {
        event.preventDefault();
        var machineType = (event.target.machineType || {}).value;
        var comment = (event.target.comment || {}).value;
        if (machineType) {
            MachineTypes.insert({
                name: machineType
            });
            document.getElementById('new-machine-type-form').reset();
        }
        if (comment) {
            console.log(comment);
            Comments.insert({
                comment: comment
            });
            document.getElementById('new-comment-form').reset();
        }
    },
    'click .remove-machine-type': function(event) {
        var machineTypeId = $(event.target).attr('data-machine-type-id');
        $('#remove-button').attr('data-machine-type-id', machineTypeId);
        $('#remove-modal').modal();
    },
    'click .remove-comment': function(event) {
        var commentId = $(event.target).attr('data-comment-id');
        $('#remove-button').attr('data-comment-id', commentId);
        $('#remove-modal').modal();
    }
});