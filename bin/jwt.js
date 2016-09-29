const authentication = require('../services/authentication');

module.exports = function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if(token) {
    authentication.authenticate(token, function(err, decoded) {
      if(err) {
        return res.json({success: false, message: 'Failed to authenticate.'})
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'no token provided'
    });
  }
};