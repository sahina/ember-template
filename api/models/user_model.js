'use strict';

var app = require('../index');
var COLLECTION = 'users';

var User = function(attrs) {
  this.attrs = attrs || {};
};

User.findAll = function () {
  return app.db.findAll(COLLECTION);
};

User.prototype.save = function() {
  return app.db.insert(COLLECTION, this.attrs);
};

module.exports = User;