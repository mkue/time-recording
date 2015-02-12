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
    var millisUntil11 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 0, 0, 0) - now;
    if (millisUntil11 < 0) {
        millisUntil11 += 86400000; // it's after 23:00, try 23:00 tomorrow.
    }
    setTimeout(function() {
        setInterval(stopRunningProjects, 86400000);
    }, millisUntil11);
});

Meteor.methods({
    'stopProjects': function() {
        stopRunningProjects();
    }
});