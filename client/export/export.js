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
        csv += '\n' + 'Mitarbeiter ID,Mitarbeiter,Projekt ID,Projekt,Start,Ende';

        recordings.forEach(function(recording) {
            var employee = Employees.findOne(recording.userId);
            var project = Projects.findOne(recording.projectId);
            if (employee && project) {
                csv += '\n' + employee._id + ',' + employee.name + ',';
                csv += project._id + ',' + project.name + ',';
                csv += new Date(recording.startDate) + ',' + new Date(recording.stopDate);
            }
        });
        var encodedUri = encodeURI(csv);
        window.open(encodedUri);
    },

    'click #export-all-recordings': function() {
        var csv = 'data:text/csv;charset=utf-8,';
        csv += '\n' + 'Mitarbeiter ID,Projekt ID,Start,Ende';
        Recordings.find({}, {
            sort: {
                createdAt: -1
            }
        }).forEach(function(recording) {
            csv += '\n' + recording.userId + ',' + recording.projectId + ',' + new Date(recording.startDate) + ',' + new Date(recording.stopDate);
        });
        var encodedUri = encodeURI(csv);
        window.open(encodedUri);
    },

    'click #export-all-projects': function() {
        var csv = 'data:text/csv;charset=utf-8,';
        csv += '\n' + 'Projekt ID,Name';
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