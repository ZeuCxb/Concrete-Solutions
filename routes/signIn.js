module.exports = app => {
    app.route('/signin')

        /**
		 *	@api {post} /signin
		 *	@apiGroup Sign In
		 *	@apiDescription Realiza login na Api
		 *	@apiParam {String} email Email válido do usuário
		 *	@apiParam {String} senha Senha válida do usuário
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
		 *			"mensagem": "Usuário e/ou senha inválidos."
		 *		}
		 */
        .post((req, res) => {
            app.helpers.validate.signIn(req.body, (err, values) => {
                if (err) {
                    const response = {
                        mensagem: 'Requisição inválida.'
                    };

                    app.helpers.request(res, false, response, 400);
                } else {
                    const query = {
                        email: values.email
                    };

                    const invalidResponse = () => {
                        const response = {
                            mensagem: 'Usuário e/ou senha inválidos.'
                        };

                        app.helpers.request(res, false, response, 401);
                    };

                    app.adapters.db.getOne('user', query, (err, user) => {
                        if (user) {
                            user.comparePassword(values.senha, (err, isMatch) => {
                                if (isMatch && !err) {
                                    app.adapters.db.alter('user', query, {ultimo_login: new Date()}, () => {
                                        const response = {
                                            id: user.id,
                                            data_atualizacao: user.data_atualizacao,
                                            data_criacao: user.data_criacao,
                                            ultimo_login: new Date(),
                                            token: user.token
                                        };

                                        app.helpers.request(res, true, response, 200);  
                                    }); 
                                } else {
                                    invalidResponse();
                                }
                            });
                        } else {
                            invalidResponse();
                        }
                    });
                }
            });
        });
};