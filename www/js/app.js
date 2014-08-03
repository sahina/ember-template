'use strict';


//
// application setup

window.ENV = window.ENV || {};
window.ENV.api = {
  urlBase: 'http://localhost:3000'  // change to fqdn per domain
};


//
// ember app
// 
window.App = Ember.Application.create({
  LOG_TRANSITIONS: true
  //  LOG_TRANSITIONS_INTERNAL:true ,
  //  LOG_ACTIVE_GENERATION: true
});


//
// ember data

App.ApplicationStore = DS.Store.extend({
  adapter: 'App.ApplicationAdapter'
});

App.ApplicationSerializer = DS.RESTSerializer.extend({});

App.ApplicationAdapter = DS.RESTAdapter.extend({
  host: ENV.api.urlBase,
  namespace: 'api'
});
