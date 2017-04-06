var dateSelector, timeSelector;
Template.recording.rendered = function() {
    dateSelector = $('.date-picker').datetimepicker({
        inline: true,
        format: 'yyyy-MM-dd'
    });
    timeSelector = $('.start-time-picker').datetimepicker({
        inline: true,
        format: 'HH:mm'
    });
};
Template.recording.helpers({
    name: function() {
        return Employees.findOne({
            _id: this.userId
        }).name;
    },
    
    projectName: function() {
        var project = Projects.findOne(this.projectId);
        return Projects.getProjectName(project);
    },
    
    comments: function() {
        return Comments.find({}, {
            sort: {
                comment: 1
            }
        });
    }
});
Template.recording.events({
    'click #finish-button': function() {
        var date = dateSelector.data('DateTimePicker').date();
        var time = timeSelector.data('DateTimePicker').date();
        var totalMinutes = time.hour() * 60 + time.minute();
        var comment = $('#comment').val();
        if (totalMinutes > 0) {
            Recordings.insert({
                projectId: this.projectId,
                userId: this.userId,
                date: date.toDate(),
                duration: totalMinutes,
                comment: comment
            });
            Router.go('home');
        }
    }
});