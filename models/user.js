const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
	nome: {
		type: String,
		required: true
	},
    email: {
		type: String,
		required: true,
        unique: true
	},
	senha: {
		type: String,
		required: true
	},
	telefones: [{
        ddd: {
            type: String,
            required: true
        },
        numero: {
            type: String,
            required: true
        }
	}],
    data_criacao: {
        type: Date,
        required: true,
        default: new Date()
    },
    data_atualizacao: {
        type: Date,
        required: true,
        default: new Date()
    },
    ultimo_login: {
        type: Date,
        required: true,
        default: new Date()
    },
    token: {
        type: String,
        required: true   
    }
});

User.pre('save', function (next) {

    var user = this;

    if (this.isModified('senha') || this.isNew) {

        bcrypt.genSalt(10, function (err, salt) {

            if (err) {
                return next(err);
            }

            bcrypt.hash(user.senha, salt, function (err, hash) {
                
                if (err) {
                    return next(err);
                }

                user.senha = hash;

                next();
            });
        });
    } else {
        return next();
    }
});


User.methods.comparesenha = function (passw, cb) {
    bcrypt.compare(passw, this.senha, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = () => mongoose.model('User', User);