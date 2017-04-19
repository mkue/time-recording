var saveCSV = function(csv, fileName) {
    var blob = new Blob([csv], {
        type: 'data:text/csv;charset=utf-8'
    });
    window.saveAs(blob, fileName);
};
Exporter = {
    exportProject: function(projectId) {
        // var csv = 'data:text/csv;charset=utf-8,';
        var project = Projects.findOne(projectId);
        var projectName = Projects.getProjectName(project);
        var csv = '"ID";"Mitarbeiter";"Datum";"Dauer(min)";"Kommentar";"Projektname"';
        Recordings.find({
            projectId: projectId
        }).forEach(function(recording) {
            var employee = Employees.findOne(recording.userId).name;
            var date = moment(recording.date);
            var comment = recording.comment ? recording.comment.replace(/(\r\n|\n|\r)/g, ' ').replace(/"/g, '\'') : '';
            csv += '\n"' + recording._id + '";"' + employee + '";"' + date.format('DD.MM.YYYY') + '";"' + recording.duration + '";"' + comment + '";"' + projectName + '"';
        });
        saveCSV(csv, 'zeiterfassung_export.csv');
    },
    exportEmployee: function(employeeId) {
        var csv = 'Projekt,Datum,Dauer (min)';
        Recordings.find({
            userId: employeeId
        }, {
            sort: {
                date: -1
            }
        }).forEach(function(recording) {
            var project = Projects.findOne(recording.projectId);
            csv += '\n' + Projects.getProjectName(project) + ',' + recording.date + ',' + recording.duration;
        });
        var employee = Employees.findOne(employeeId);
        saveCSV(csv, employee.name + '.csv');
    },
    exportAllTimestamps: function() {
        var csv = '"ID";"Mitarbeiter";"Datum";"Dauer(min)";"Kommentar";"Projektname"';
        Recordings.find().forEach(function(recording) {
            var employee = Employees.findOne(recording.userId).name;
            var project = Projects.findOne(recording.projectId);
            var projectName = Projects.getProjectName(project);
            var date = moment(recording.date);
            var comment = recording.comment ? recording.comment.replace(/(\r\n|\n|\r)/g, ' ').replace(/"/g, '\'') : ''; // replace new line char
            csv += '\n"' + recording._id + '";"' + employee + '";"' + date.format('DD.MM.YYYY') + '";"' + recording.duration + '";"' + comment + '";"' + projectName + '"';
        });
        saveCSV(csv, 'zeiterfassung_export.csv');
    }
};