const Guid = require('guid');

module.exports = app => {
    app.route('/search/:_id')
        .all((req, res, next) => {
            const invalidReq = () => {
                const response = {
                    mensagem: 'Requisição inválida.'
                };

                app.helpers.request(res, false, response, 400);
            };

            if (req.headers.authorization) {
                let token = req.headers.authorization;

                if (token.search('Bearer ') === 0) {
                    token = token.replace('Bearer ', '');

                    if (Guid.isGuid(token)) {
                        next();
                    } else {
                        const response = {
                            mensagem: 'Não autorizado.'
                        };

                        app.helpers.request(res, false, response, 401);
                    }
                } else {
                    invalidReq();
                }
            } else {
                invalidReq();
            }
        })

        /**
		 *	@api {get} /search/:_id
		 *	@apiGroup Search
		 *	@apiDescription Realiza uma busca
		 *	@apiParam {String} _id Id do usuário
		 *	@apiSuccess {Bollean} success Status da requisição true/false
		 *	@apiSuccess {Object} response Objeto de retorno
		 *	@apiSuccess {ObjectId} response.id Id do usuário
         *	@apiParam {String} response.nome Nome do usuário
         *	@apiParam {String} response.email Email do usuário
		 *	@apiParam {Object[]} response.telefones Lista de telefones
		 *	@apiParam {Number} response.telefones.numero Número do telefone
		 *	@apiParam {Number} response.telefones.ddd DDD do telefone
		 *	@apiParam {ObjectId} response.telefones._id Id do telefone
		 *	@apiSuccess {Date} response.data_atualizacao Data de atualização do usuário
		 *	@apiSuccess {Date} response.data_criacao Data de criação do usuário
		 *	@apiSuccess {Date} response.ultimo_login Data do ultimo login do usuário
		 *	@apiSuccess {String} response.token Token do usuário
		 *	@apiSuccessExample {json} Sucesso
		 *		{
         *          "success": true,
         *          "response": {
         *              "id": "579ac0cb19675a2677cabf11",
         *              "nome": "Eliseu Codinhoto",
         *              "email": "zeucxb986@gmail.com",
         *              "telefones": [
         *              {
         *                  "numero": "123456789",
         *                  "ddd": "11",
         *                  "_id": "579ac0cb19675a2677cabf12"
         *              }
         *              ],
         *              "data_atualizacao": "2016-07-29T02:34:45.089Z",
         *              "data_criacao": "2016-07-29T02:34:45.089Z",
         *              "ultimo_login": "2016-07-29T05:23:38.415Z",
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
		 *			"mensagem": "Não autorizado."
		 *		}
		 */
        .get((req, res) => {
            const token = req.headers.authorization.replace('Bearer ', '');
            const _id = req.params._id;

            const unauthorized = () => {
                const response = {
                    mensagem: 'Não autorizado.'
                };

                app.helpers.request(res, false, response, 401);
            };

            const query = {
                token,
                _id
            };
            
            app.adapters.db.getOne('user', query, (err, user) => {
                if (user) {
                    const lastLoggin = user.ultimo_login;
                    const now = new Date();

                    let diff = now.getTime() - lastLoggin.getTime();

                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    diff -=  days * (1000 * 60 * 60 * 24);

                    const hours = Math.floor(diff / (1000 * 60 * 60));
                    diff -= hours * (1000 * 60 * 60);

                    const mins = Math.floor(diff / (1000 * 60));

                    if (days === 0 && hours === 0 && mins < 30) {
                        const response = {
                            id: user.id,
                            nome: user.nome,
                            email: user.email,
                            telefones: user.telefones,
                            data_atualizacao: user.data_atualizacao,
                            data_criacao: user.data_criacao,
                            ultimo_login: user.ultimo_login,
                            token: user.token
                        };

                        app.helpers.request(res, true, response, 200);
                    } else {
                        unauthorized();
                    }
                } else {
                    unauthorized();
                }
            });
        });
};