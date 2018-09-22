const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const {uid} = require('rand-token');
const bcrypt = require('bcryptjs');

let UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
		trim: true,
		unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email.'
    }
  },
	password: {
		type: String,
		required: true,
    minlength: 6
	},
	tokens: [ {
		_id: false,
		client: String,
		refresh_token: String
	} ]
});

UserSchema.methods.generateTokens = async function () {
	const user = this;
  const access_token = jwt.sign({
		_id: user._id,
		email: user.email
	}, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
	});

	const client = uid(256);
	const refresh_token = jwt.sign({ client }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
	});

	this.tokens.push({client, refresh_token});

	await this.save();

	return {access_token, refresh_token, client};
};

UserSchema.statics.refreshToken = async function (refresh_token, client) {
	const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
	if (decoded.client !== client) throw new Error();

	const user = await this.findOne({'tokens.client': client, 'tokens.refresh_token': refresh_token});
	if (!user) throw new Error();

  const access_token = jwt.sign({
		_id: user._id,
		email: user.email
	}, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
	});

	return access_token;
};

UserSchema.statics.findByCredentials = async function (email, password) {
	const user = await this.findOne({email});
	if (!user) return Promise.reject();

	return new Promise((resolve, reject) => {
		bcrypt.compare(password, user.password, (err, res) => {
			if (res) {
				resolve(user);
			} else {
				reject();
			}
		});
	});
};

UserSchema.pre('save', function (next) {
	const user = this;

	if (user.isModified('password')) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash;
				next();
			});
		});
	} else {
		next();
	}
});

const User = mongoose.model('User', UserSchema);

module.exports = {User};