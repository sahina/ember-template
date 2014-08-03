'use strict';

App.Router.map(function() {

  // /users
  this.resource('users', function() {
    
    // /users/123
    this.resource('user', { path: ':id' }, function() {
      // /users/123/details
      this.route('edit', { path: 'edit' });
      
    });
    
  });
  
});
