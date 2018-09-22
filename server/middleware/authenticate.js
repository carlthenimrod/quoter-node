const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization').split(' ')[1];
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = user;
		next();
  } catch (e) {
		res.status(401).send(e);
  }
};

module.exports = {authenticate};