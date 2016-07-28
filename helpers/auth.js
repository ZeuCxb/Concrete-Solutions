const passport = require('passport');
const Strategy = require('passport-jwt').Strategy;

module.exports = app => {
	// const User = app.models.user;
	const cfg = app.configs.auth;
	const strategy = new Strategy({secretOrKey: cfg.jwtSecret, jwtFromRequest: cfg.jwtFromRequest}, (payload, done) => {
		console.log('payload');
		// User.findById(payload)
		// 	.then(user => {
		// 		if(user) {
		// 			return done(null, {
		// 				id: user.id,
		// 				email: user.email
		// 			});
		// 		}
		// 		return done(null, false);
		// 	})
		// 	.catch(err => {
		// 		console.log(err);
		// 		done(err, null);
		// 	});
	});

	passport.use(strategy);

	return {
		initialize: () => {
			return passport.initialize();
		},
		authenticate: () => {
			return passport.authenticate('jwt', cfg.jwtSession);
		}
	};
};