const ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports = {
	jwtSecret: 'socorrammesubinoonibusemmarrocos',
	jwtSession: {session: false},
	jwtFromRequest: ExtractJwt.fromAuthHeader()
};