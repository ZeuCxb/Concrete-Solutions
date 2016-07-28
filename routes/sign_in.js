module.exports = app => {
    app.route('/signin')
        .post((req, res) => {
            const firstname = req.body.firstname;
            const lastname = req.body.lastname;

            if(firstname && lastname) {
                app.interpreters.db.save('user', {firstname, lastname}, (err, user) => {
                    app.helpers.request(res, true, user);
                });
            } else {
                app.helpers.request(res, false, 'Bad Request', 400);
            }
        });
};