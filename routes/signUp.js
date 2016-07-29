const Guid = require('guid');

module.exports = app => {
    app.route('/signup')

        /**
		 *	@api {post} /signup
		 *	@apiGroup Sign Up
		 *	@apiDescription Realiza cadastro na Api
		 *	@apiParam {String} nome Nome do usuário
		 *	@apiParam {String} email Email do usuário
		 *	@apiParam {String} senha Senha do usuário
		 *	@apiParam {Object[]} telefones Lista de telefones
		 *	@apiParam {Number} telefones.numero Número do telefone
		 *	@apiParam {Number} telefones.ddd DDD do telefone
		 *	@apiSuccess {Bollean} success Status da requisição true/false
		 *	@apiSuccess {Object} response Objeto de retorno
		 *	@apiSuccess {ObjectId} response.id Id do usuário
		 *	@apiSuccess {Date} response.data_atualizacao Data de atualização do usuário
		 *	@apiSuccess {Date} response.data_criacao Data de criação do usuário
		 *	@apiSuccess {Date} response.ultimo_login Data do ultimo login do usuário
		 *	@apiSuccess {String} response.token Token do usuário
		 *	@apiSuccessExample {json} Sucesso
		 *		{
		 *          "success": true,
		 *          "response": {
		 *              "id": "579ac0cb19675a2677cabf11",
		 *              "data_atualizacao": "2016-07-29T02:34:45.089Z",
		 *              "data_criacao": "2016-07-29T02:34:45.089Z",
		 *              "ultimo_login": "2016-07-29T04:41:55.479Z",
		 *              "token": "21752e72-6764-b1c8-8b57-141592be5c80"
		 *          }
		 *      }
		 *	@apiError {Bollean} success Status da requisição true/false
		 *	@apiError {String} mensagem Mensagem da requisição
		 *	@apiErrorExample {json} Erro 400
		 *		{
		 *			"success": false,
		 *			"mensagem": "Requisição inválida."
		 *		}
		 *	@apiErrorExample {json} Erro 401
		 *		{
		 *			"success": false,
		 *			"mensagem": "E-mail já existente."
		 *		}
		 */
        .post((req, res) => {
            app.helpers.validate.signUp(req.body, (err, values) => {
                if (err) {
                    const response = {
                        mensagem: 'Requisição inválida.'
                    };

                    app.helpers.request(res, false, response, 400);
                } else {
                    values.token = Guid.create();

                    app.adapters.db.save('user', values, (err, user) => {
                        if (err) {
                            const response = {
                                mensagem: 'E-mail já existente.'
                            };

                            app.helpers.request(res, false, response, 401);
                        } else {
                            const response = {
                                id: user.id,
                                data_atualizacao: user.data_atualizacao,
                                data_criacao: user.data_criacao,
                                ultimo_login: user.ultimo_login,
                                token: user.token
                            };

                            app.helpers.request(res, true, response, 201);
                        }
                    });
                }
            });
        });
};