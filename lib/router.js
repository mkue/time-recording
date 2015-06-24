Router.configure({
    loadingTemplate: 'loading',
    layoutTemplate: 'layout',
    waitOn: function() {
        return [
            Meteor.subscribe('employees'),
            Meteor.subscribe('projects'),
            Meteor.subscribe('recordings'),
            Meteor.subscribe('machineTypes')
        ];
    }
});

Router.map(function() {
    this.route('home', {
        path: '/'
    });

    this.route('admin', {
        path: '/admin'
    });

    this.route('employees', {
        path: '/employees'
    });

    this.route('projects', {
        path: '/projects'
    });

    this.route('selectProject', {
        path: 'select-project/:_id',
        data: function() {
            return Employees.findOne({
                _id: this.params._id
            });
        }
    });

    this.route('employeeAdmin', {
        path: '/admin/employee-admin/:_id',
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