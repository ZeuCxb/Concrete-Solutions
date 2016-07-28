module.exports = app => {
    return (req, res, next) => {
        console.log(req);
        if (req.headers['content-type'] !== 'application/json') {
            const response = {
                mensagem: 'Requisição inválida.'
            };

            app.helpers.request(res, false, response, 400);
        } else {
            next();
        }
    };
};