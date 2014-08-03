'use strict';

var User = require('../models/user_model');

exports.index = function(req, res) {
  res.render('index');
};

exports.users = function(req, res) {
  res.end('users');
};