module.exports = app => {
    app.use((req, res, next) => {
        if (req.method !== 'GET' && req.headers['content-type'] !== 'application/json') {
            const response = {
                mensagem: 'Requisição inválida.'
            };

            app.helpers.request(res, false, response, 400);
        } else {
            next();
        }
    });
};