Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function() {
        return [
            Meteor.subscribe('employees'),
            Meteor.subscribe('projects'),
            Meteor.subscribe('recordings')
        ];
    }
});

Router.map(function() {
    this.route('home', {
        path: '/'
    });

    this.route('employees', {
        path: '/employees'
    });

    this.route('projects', {
        path: '/projects'
    });

    this.route('exporter', {
        path: '/export'
    });

    this.route('selectProject', {
        path: 'select-project/:_id',
        data: function() {
            return Employees.findOne({
                _id: this.params._id
            });
        }
    });

    this.route('employee', {
        path: 'employee/:_id',
        data: function() {
            return Employees.findOne({
                _id: this.params._id
            });
        }
    });

    this.route('recording', {
        path: 'recording/:_userId/:_projectId',
        data: function() {
            return {
                userId: this.params._userId,
                projectId: this.params._projectId
            };
        }
    });
});