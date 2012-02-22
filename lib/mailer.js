// The modules this hook requires
var Hook = require('hook.io').Hook,
    util = require('util'),
    mailerModule = require('mailer');

// Things we need to access in different functions   

// Set up the hook, and export it at the same time
var MailerHook = exports.MailerHook = function(options) {
  var self = this;
  Hook.call(self, options); // Basic initializations
  self.config.use('file', { file: './config.json'});

  // Register callback for hook::ready event
  self.on('hook::ready', function() {
    // When hook is ready, register callbacks for boxcar events
    self.on('*::send', function(data) {
      self.send(data);
    });
  });
  
};

// Set up inheritance from Hook
util.inherits(MailerHook, Hook);

// Callbacks defined below

MailerHook.prototype.send = function(options){

  var self = this,
      settings = self.config.get('mailer');

  console.log("Settings: "+settings);
  console.log("Options: "+options);
  mailerModule.send({
    ssl: true,
    to: options.to,
    from: options.from,
    host: settings.host,
    authentication: 'login',
    username: settings.username,
    password: settings.password,
    domain: settings.domain,
    subject: options.subject,
    body: options.body
  },
  function(err, result){
    if(err){ 
      return self.emit('error', err);
    }
      
    self.emit('emailSent', result);
    
  });

};
