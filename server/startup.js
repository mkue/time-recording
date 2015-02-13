var stopRunningProjects = function() {
    Recordings.update({
        stopDate: {
            $exists: false
        }
    }, {
        stopDate: new Date().getTime()
    });
    Employees.update({}, {
        $set: {
            currentRecording: null
        }
    }, {
        multi: true
    });
};

Meteor.startup(function() {
    var now = new Date();
    var millisUntil23 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 0, 0, 0) - now;
    if (millisUntil23 < 0) {
        millisUntil23 += 86400000; // it's after 23:00, try 23:00 tomorrow.
    }
    setTimeout(function() {
        stopRunningProjects();
        setInterval(stopRunningProjects, 86400000);
    }, millisUntil23);
});

Meteor.methods({
    'stopProjects': function() {
        stopRunningProjects();
    }
});