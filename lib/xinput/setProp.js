'use strict';

module.exports = setProp;

var exec = require('child_process').exec;
var debugModule = require('debug');
var format = require('util').format;

function setProp(id, name, value, cb){
  id = parseInt(id);
  var debug = debugModule('xinput:setProp');
  var command;

  if(isNaN(id)){
    debug('id was "%s"', id);
    return process.nextTick(function(){
      cb(new Error('id is required'));
    });
  }

  if(!name){
    debug('name was "%s"', name);
    return process.nextTick(function(){
      cb(new Error('name is required'));
    });
  }

  if(!value){
    debug('value was "%s"', value);
    return process.nextTick(function(){
      cb(new Error('value is required'));
    });
  }

  command = format('xinput --set-prop %s "%s" %s', id, name, value);

  debug('Executing `%s`', command);

  exec(command, function(err, stdout, stderr){
    debug('Executing `%s` finished.', command);
    debug('err was %j', err);
    debug('stdout was %s', stdout);
    debug('stderr was %s', stderr);

    cb(err);
  });
}
