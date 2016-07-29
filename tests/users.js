process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const Guid = require('guid');

const server = require('../server.js');
const User = require('../models/user')();

const should = chai.should();
chai.use(chaiHttp);

describe('Users', () => {

    User.collection.drop();

    afterEach(function(done) {
        User.collection.drop();
        done();
    });

    it('should SINGNUP /signup POST', (done) => {
        chai.request(server)
            .post('/signup')
            .send({
                'nome': 'Eliseu Codinhoto',
                'email': 'zeucb@gmail.com',
                'senha': 'Senha123',
                'telefones': {
                    'numero': '123456789',
                    'ddd': '11'
                }
            })
            .end(function(err, res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.should.have.property('response');
                res.body.success.should.be.true;
                res.body.response.should.be.a('object');
                done();
            });
    });

    it('should SINGNIN /signin POST', (done) => {
        const newUser = new User({
            nome: 'Eliseu Codinhoto',
            email: 'zeucxb986@gmail.com',
            senha: 'Senha123',
            telefones: {
                numero: '123456789',
                ddd: '11'
            },
            token: Guid.create()
        });

        newUser.save(() => {
            chai.request(server)
                .post('/signin')
                .send({
                    'email': 'zeucxb986@gmail.com',
                    'senha': 'Senha123'
                })
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('response');
                    res.body.success.should.be.true;
                    res.body.response.should.be.a('object');
                    done();
                });
        });
    });

    it('should SEARCH /search/:_id GET', (done) => {
        const newUser = new User({
            nome: 'Eliseu Codinhoto',
            email: 'zeucxb986@gmail.com',
            senha: 'Senha123',
            telefones: {
                numero: '123456789',
                ddd: '11'
            },
            token: Guid.create()
        });

        newUser.save((err, user) => {
            chai.request(server)
                .get(`/search/${user._id}`)
                .set({
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                })
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('response');
                    res.body.success.should.be.true;
                    res.body.response.should.be.a('object');
                    done();
                });
        });
    });

});