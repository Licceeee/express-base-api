const jwt = require('jsonwebtoken');

const authorizeUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(400).send('No auth headers provided');
  // eslint-disable-next-line no-unused-vars
  const [bearer, token] = authHeader.split(' ');

  if (!token) return res.status(401).send('Access denied');

  return jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).send('Access denied');
    req.user = payload;
    return next();
  });
};

module.exports = authorizeUser;