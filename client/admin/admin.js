Template.admin.events({

    'click #remove-button': function() {
        var employeeId = $('#remove-button').attr('data-employee-id');
        var projectId = $('#remove-button').attr('data-project-id');
        if (employeeId) {
            $('#remove-button').removeAttr('data-employee-id');
            Employees.remove(employeeId);
        } else if (projectId) {
            $('#remove-button').removeAttr('data-project-id');
            Projects.remove(projectId);
        }
        $('#remove-modal').modal('hide');
    }
});