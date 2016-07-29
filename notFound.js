module.exports = app => {
    app.route('*')
        .all((req, res) => {
            const response = {
                mensagem: 'EndPoint não encontrado.'
            };

            app.helpers.request(res, false, response, 400);
        });
};