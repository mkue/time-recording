Template.admin.events({
    'click #remove-button': function() {
        var employeeId = $('#remove-button').attr('data-employee-id');
        var projectId = $('#remove-button').attr('data-project-id');
        var machineTypeId = $('#remove-button').attr('data-machine-type-id');
        var commentId = $('#remove-button').attr('data-comment-id');
        if (employeeId) {
            $('#remove-button').removeAttr('data-employee-id');
            Meteor.call('removeEmployee', employeeId);
        } else if (projectId) {
            $('#remove-button').removeAttr('data-project-id');
            Meteor.call('removeProject', projectId);
        } else if (machineTypeId) {
            $('#remove-button').removeAttr('data-machine-type-id');
            Meteor.call('removeMachineType', machineTypeId);
        } else if (commentId) {
            $('#remove-button').removeAttr('data-comment-id');
            Meteor.call('removeComment', commentId);
        }
        $('#remove-modal').modal('hide');
    }
});