var saveCSV = function(csv, fileName) {
    console.log(csv);
    var blob = new Blob([csv], {
        type: 'data:text/csv;charset=utf-8'
    });
    window.saveAs(blob, fileName);
};

var getMinutesFromRecording = function(recording, employee) {
    var start = moment(recording.startDate);
    var stop = moment(recording.stopDate);
    var recordingMinutes = stop.diff(start, 'minutes');
    // check if there was a break during recording
    var startMinuteOfDay = parseInt(start.format('H') * 60, 0) + parseInt(start.format('m'), 0);
    var stopMinuteOfDay = parseInt(stop.format('H') * 60, 0) + parseInt(stop.format('m'), 0);
    if (employee.nineOClockBreak && startMinuteOfDay < 540 && stopMinuteOfDay > 555) {
        recordingMinutes -= 15;
    }
    return recordingMinutes;
};

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
                employeeMinutes += getMinutesFromRecording(recording, employee);
            });
            totalMinutes += employeeMinutes;
            csv += '\n' + employee.name + ',' + employeeMinutes;
        });
        var projectName = Projects.findOne(projectId).name;
        csv += '\n\n' + 'Total ' + projectName + ',' + totalMinutes;
        saveCSV(csv, projectName + '.csv');
    },

    exportEmployee: function(employeeId) {
        var csv = '"Projekt","Minuten"\n';
        var employee = Employees.findOne(employeeId);
        _.each(employee.projects, function(projectId) {
            var project = Projects.findOne(projectId);
            if (project) {
                var projectMinutes = 0;
                Recordings.find({
                    projectId: projectId,
                    userId: employeeId
                }).forEach(function(recording) {
                    projectMinutes += getMinutesFromRecording(recording, employee);
                });
                csv += '\n"' + project.name + '","' + projectMinutes + '"';
            }
        });
        saveCSV(csv, employee.name + '.csv');
    }
};