'use strict';

var jwt = require('jsonwebtoken');
var SECRET = 'some secret here';

exports.secret = SECRET;

exports.issueToken = function (payload) {
  return jwt.sign(payload, process.env.TOKEN_SECRET || SECRET);
};

exports.verifyToken = function (token, verified) {
  return jwt.verify(token, process.env.TOKEN_SECRET || SECRET, {}, verified);
};