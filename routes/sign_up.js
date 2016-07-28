module.exports = app => {
    app.route('/signup')
        .all((req, res, next) => {
            app.helpers.contentTypeValidation(req, res, next);
        })
        .post((req, res) => {
            app.helpers.validate.signup(req.body, (err, values) => {
                if (err) {
                    const response = {
                        mensagem: 'Requisição inválida.'
                    };

                    app.helpers.request(res, false, response, 400);
                } else {
                    values.token = 'TOKEN12345';

                    app.adapters.db.save('user', values, (err, user) => {
                        if (err) {
                            const response = {
                                mensagem: 'E-mail já existente.'
                            };

                            app.helpers.request(res, false, response, 401);
                        } else {
                            app.helpers.request(res, true, user);
                        }
                    });
                }
            });
        });
};