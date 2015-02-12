Exporter = {
    exportProject: function(projectId) {
        // var csv = 'data:text/csv;charset=utf-8,';
        var csv = 'Mitarbeiter,Minuten\n';
        var totalMinutes = 0;
        Employees.find().forEach(function(employee) {
            var employeeMinutes = 0;
            Recordings.find({
                projectId: projectId,
                userId: employee._id
            }).forEach(function(recording) {
                var start = moment(recording.startDate);
                var stop = moment(recording.stopDate);
                employeeMinutes += stop.diff(start, 'minutes');
                // check if there was a break during recording
                var startMinuteOfDay = parseInt(start.format('H') * 60, 0) + parseInt(start.format('m'), 0);
                var stopMinuteOfDay = parseInt(stop.format('H') * 60, 0) + parseInt(stop.format('m'), 0);
                if (employee.nineOClockBreak && startMinuteOfDay < 540 && stopMinuteOfDay > 555) {
                    employeeMinutes -= 15;
                }
            });
            totalMinutes += employeeMinutes;
            csv += '\n' + employee.name + ',' + employeeMinutes;
        });
        var projectName = Projects.findOne(projectId).name;
        csv += '\n\n' + 'Total ' + projectName + ',' + totalMinutes;
        console.log(csv);
        var blob = new Blob([csv], {
            type: 'data:text/csv;charset=utf-8'
        });
        var fileName = projectName + '.csv';
        window.saveAs(blob, fileName);
    }
};