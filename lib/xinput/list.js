'use strict';

module.exports = list;

var exec = require('child_process').exec;
var debugModule = require('debug');

function list(cb){
  var devices = [];
  var deviceListingsRegex = /.+/g;
  var deviceNameRegex     = /([a-z0-9\/_-]+(?:\s[a-z0-9\/_-]+)*)/i;
  var deviceIdRegex       = /id=([0-9]+)/;
  var debug = debugModule('xinput:list');

  debug('Executing `xinput --list`');

  exec('xinput --list', function(err, stdout, stderr){
    var deviceName;
    var deviceListing;
    var deviceId;

    debug('Executing `xinput --list` finished.');
    debug('err was %j', err);
    debug('stdout was %s', stdout);
    debug('stderr was %s', stderr);

    if(stdout){
      while(deviceListing = deviceListingsRegex.exec(stdout)){
        deviceListing = deviceListing[0];
        deviceName = deviceNameRegex.exec(deviceListing);
        deviceName = deviceName && deviceName[0];
        deviceId   = deviceIdRegex.exec(deviceListing);
        deviceId   = deviceId && deviceId[1];

        debug('deviceListing was: "%s"', deviceListing);
        debug('deviceName    was: "%s"', deviceName);
        debug('deviceId      was: "%s"', deviceId);
        if(deviceId && deviceName){
          debug('devices.push({id:"%s", name:"%s"});', deviceId, deviceName);
          devices.push({id: deviceId, name: deviceName});
        } else {
          debug('deviceId (%s) or deviceName (%s) was null!', deviceId, deviceName);
        }
      }
    }

    debug('Devices found: %j', devices);

    cb(err, devices);
  });
}
