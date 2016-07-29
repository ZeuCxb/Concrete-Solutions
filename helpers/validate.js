const Joi = require('joi');

module.exports = () => {
    let validate = {};

    validate.signUp = (body, callback) => {
        const schema = Joi.object().keys({
            nome: Joi.string().required(),
            email: Joi.string().email().required(),
            senha: Joi.string().alphanum().required(),
            telefones: Joi.object().keys({
                numero: Joi.number().required(),
                ddd: Joi.number().required()
            })
        });

        Joi.validate(body, schema, function (err, value) {
            callback(err, value);
        });
    };

    validate.signIn = (body, callback) => {
        const schema = Joi.object().keys({
            email: Joi.string().email().required(),
            senha: Joi.string().alphanum().required()
        });

        Joi.validate(body, schema, function (err, value) {
            callback(err, value);
        });
    };

    return validate;
};