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
        var project = Projects.findOne(projectId);
        var projectDesc = project.machineNr + '_' + project.machineType + '_' + project.customer;
        var csv = projectDesc + '\n';
        csv += project.machineNr + '\n';
        csv += project.projectNr + '\n';
        csv += project.machineType + '\n';
        csv += project.customer + '\n';
        csv += '\nMitarbeiter,Minuten';
        Employees.find().forEach(function(employee) {
            var employeeMinutes = 0;
            Recordings.find({
                projectId: projectId,
                userId: employee._id
            }).forEach(function(recording) {
                employeeMinutes += getMinutesFromRecording(recording, employee);
            });
            csv += '\n' + employee.name + ',' + employeeMinutes;
        });
        saveCSV(csv, projectDesc + '.csv');
    },

    exportEmployee: function(employeeId) {
        var csv = 'Projekt,Minuten\n';
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
                csv += '\n' + project.name + ',' + projectMinutes + '';
            }
        });
        saveCSV(csv, employee.name + '.csv');
    }
};