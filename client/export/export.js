var serializeRecording = function(recording) {
    var csv = '';
    var employee = Employees.findOne(recording.userId);
    var project = Projects.findOne(recording.projectId);
    if (employee && project) {
        csv += '\n' + employee.name + ',';
        csv += project.name + ',';
        var startDate = new Date(recording.startDate);
        var stopDate = new Date(recording.stopDate);
        csv += startDate.getDate() + '.' + (startDate.getMonth() + 1) + '.' + startDate.getFullYear() + ',';
        csv += startDate.getHours() + ':' + startDate.getMinutes() + ',';
        csv += startDate.getMinutes() < 10 ? '0' : '';
        csv += stopDate.getDate() + '.' + (stopDate.getMonth() + 1) + '.' + stopDate.getFullYear() + ',';
        csv += stopDate.getHours() + ':' + stopDate.getMinutes();
        csv += stopDate.getMinutes() < 10 ? '0' : '';
    }
    return csv;
};

Template.exporter.events({
    'submit form': function(event) {
        var isValidDate = function(d) {
            if (Object.prototype.toString.call(d) !== '[object Date]') {
                return false;
            }
            return !isNaN(d.getTime());
        };
        event.preventDefault();
        var start = new Date(event.target.start.value);
        var stop = new Date(event.target.stop.value);
        var recordings;
        if (isValidDate(start) && isValidDate(stop)) {
            recordings = Recordings.find({
                startDate: {
                    $gte: start.getTime(),
                    $lt: stop.getTime()
                }
            }, {
                sort: {
                    createdAt: -1
                }
            });
        } else {
            recordings = Recordings.find({}, {
                sort: {
                    createdAt: -1
                }
            });
        }
        var csv = 'data:text/csv;charset=utf-8,';
        csv += 'Mitarbeiter,Projekt,Start Datum,Start Zeit,End Datum,End Zeit';

        recordings.forEach(function(recording) {
            csv += serializeRecording(recording);
        });
        var encodedUri = encodeURI(csv);
        window.open(encodedUri);
    },

    'click #export-all-recordings': function() {
        var csv = 'data:text/csv;charset=utf-8,';
        csv += 'Mitarbeiter,Projekt,Start Datum,Start Zeit,End Datum,End Zeit';
        Recordings.find({}, {
            sort: {
                createdAt: -1
            }
        }).forEach(function(recording) {
            csv += serializeRecording(recording);
        });
        var encodedUri = encodeURI(csv);
        window.open(encodedUri);
    },

    'click #export-all-projects': function() {
        var csv = 'data:text/csv;charset=utf-8,';
        csv += 'Projekt ID,Name';
        Projects.find().forEach(function(project) {
            csv += '\n' + project._id + ',' + project.name;
        });
        var encodedUri = encodeURI(csv);
        window.open(encodedUri);
    },

    'click #export-all-employees': function() {
        var csv = 'data:text/csv;charset=utf-8,';
        csv += '\n' + 'Mitarbeiter ID,Name';
        Employees.find().forEach(function(employee) {
            csv += '\n' + employee._id + ',' + employee.name;
        });
        var encodedUri = encodeURI(csv);
        window.open(encodedUri);
    }
});