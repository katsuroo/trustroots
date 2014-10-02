'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.jsonp(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Send User
 */
exports.me = function(req, res) {
    console.log('--------------------');
    console.log('=> me');
    console.log('--------------------');
	res.jsonp(req.user || null);
};


/**
 * Show the profile of the user
 */
exports.getUser = function(req, res) {
    console.log('--------------------');
    console.log('=> getUser');
    console.log('will push out: ' + req.user.username);
    console.log('--------------------');
	res.jsonp(req.user || null);
};

/**
 * Show the mini profile of the user
 * Pick only certain fields from whole profile @link http://underscorejs.org/#pick
 */
exports.getMiniUser = function(req, res) {
    console.log('--------------------');
    console.log('=> getMiniUser');
    console.log('will push out: ' + req.user.username);
    console.log('--------------------');

	res.jsonp( _.pick(req.user, 'id', 'displayName', 'username') || null );
};


/**
 * List of Profiles
 */
exports.list = function(req, res) {
    console.log('--------------------');
    console.log('=> list');
    console.log('--------------------');

	User.find().sort('-created').exec(function(err, users) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(users);
		}
	});
};


/**
 * Profile middleware
 */
exports.userByID = function(req, res, next, id) {
    console.log('--------------------');
    console.log('=> userById: ' + id);
    console.log('--------------------');
	User.findById(id).exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load user ' + id));
		req.user = user;
		next();
	});
};

exports.userByUsername = function(req, res, next, username) {
    console.log('--------------------');
    console.log('=> userByUsername: ' + username);
    console.log('--------------------');
	User.findOne({
    	username: username
	}).exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load user ' + username));
		req.user = user;
		next();
	});

/*
	User.findOne({
		username: username
	}).exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load user ' + username));
		req.user = user;
		next();
	});

	*/

	/*
	User.findOne({
		resetPasswordToken: req.params.token,
		resetPasswordExpires: {
			$gt: Date.now()
		}
	}, function(err, user) {
		if (!user) {
			return res.redirect('/#!/password/reset/invalid');
		}

		res.redirect('/#!/password/reset/' + req.params.token);
	});
	*/

};