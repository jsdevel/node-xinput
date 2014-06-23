'use strict';

module.exports = listProps;

var exec = require('child_process').exec;
var debugModule = require('debug');

function listProps(id, cb){
  id = parseInt(id);

  var properties = [];
  var propertiesRegex = /.+/g;
  var nameRegex     = /([a-z0-9\/_-]+(?:\s[a-z0-9\/_-]+)*)/i;
  var valueRegex    = /:\s+(.+)$/;
  //var deviceIdRegex       = /id=([0-9]+)/;*/
  var debug = debugModule('xinput:listProps');

  if(isNaN(id)){
    debug('id %j was not a number', id);
    return process.nextTick(function(){
      cb(new Error('id is required'));
    });
  }

  debug('Executing `xinput --list-props %s`', id);

  exec('xinput --list-props ' + id, function(err, stdout, stderr){
    var property;
    var name;
    var value;
    debug('Executing `xinput --list-props %s` finished.');
    debug('err was %j', err);
    debug('stdout was \n%s', stdout);
    debug('stderr was \n%s', stderr);

    if(stdout){
      while(property = propertiesRegex.exec(stdout)){
        property = property[0];
        name = nameRegex.exec(property);
        name = name && name[0];
        value = valueRegex.exec(property);
        value = value && value[1].replace(/\s+/g, '');

        debug('property was: "%s"', property);
        debug('name     was: "%s"', name);
        debug('value    was: "%s"', value);

        if(name && value){
          if(value.indexOf(',') > -1){
            debug('"%s" was an Array', name);
            value = value.split(',');//.map(parseFloat);
          } else {
            debug('"%s" was an Number', name);
            //value = parseFloat(value);
          }
          debug('properties.push({name:"%s", value:"%s"});', name, value);
          properties.push({name: name, value: value});
        } else {
          debug('name (%s) or value (%s) was null!', name, value);
        }
      }
    }

    debug('Properties found: %j', properties);

    cb(err, properties);
  });
}
