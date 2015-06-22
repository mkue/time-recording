Template.admin.events({

    'click #remove-button': function() {
        var employeeId = $('#remove-button').attr('data-employee-id');
        var projectId = $('#remove-button').attr('data-project-id');
        if (employeeId) {
            $('#remove-button').removeAttr('data-employee-id');
            Meteor.call('removeEmployee', employeeId);
        } else if (projectId) {
            $('#remove-button').removeAttr('data-project-id');
            Meteor.call('removeProject', projectId);
        }
        $('#remove-modal').modal('hide');
    }
});