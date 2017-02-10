Template.home.helpers({
    employees: function() {
        return Employees.find({}, {
            sort: {
                name: 1
            }
        });
    }
});
Template.home.events({
    'click #employee-button': function() {
        window.location = 'select-project/' + this._id;
    }
});