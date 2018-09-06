const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
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
  token: {
    type: String
  }
});

UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({_id: user._id.toHexString()}, process.env.JWT_SECRET).toString();

	user.token = token;

  await user.save();

  return token;
};

UserSchema.methods.removeToken = function (token) {
	const user = this;

	return user.update({token: ''});
};

UserSchema.statics.findByToken = function (token) {
	const User = this;
	let decoded;

	try {
		decoded = jwt.verify(token, process.env.JWT_SECRET);
	} catch (e) {
		return Promise.reject();
	}

	return User.findOne({
		'_id': decoded._id,
		'token': token
	});
};

UserSchema.statics.findByCredentials = function (email, password) {
	var User = this;

	return User.findOne({email}).then(user => {
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

let User = mongoose.model('User', UserSchema);

module.exports = {User};