'use strict';

var xinput = require('../../lib/xinput');

function getTouchpad(cb){
  xinput.list(function(err, devices){
    var touchpad = devices.filter(function(device){
      return device.name.toLowerCase().indexOf('touchpad') !== -1;
    })[0];
    cb(err, process.env.TRAVIS ? devices[devices.length - 1] : touchpad);
  });
}

describe('xinput', function(){
  var touchpad;

  before(function(done){
    getTouchpad(function(err, device){
      touchpad = device;
      done(err);
    });
  });

  describe('.list(cb)', function(){
    it('should return JSON', function(done){
      xinput.list(function(err, devices){
        devices.should.be.an.instanceOf(Array);
        done();
      });
    });
  });

  describe('.listProps(id, cb)', function(){
    it('should require an id', function(done){
      xinput.listProps(null, function(err){
        err.message.should.equal('id is required');
        done();
      });
    });

    it('should return JSON', function(done){
      xinput.listProps(touchpad.id, function(err, properties){
        properties.should.be.an.instanceOf(Array);
        done();
      });
    });
  });

  describe('.setProp(id, name, value)', function(){
    var name = 'Device Enabled';


    after(function(done){
      xinput.setProp(touchpad.id, name, '1', function(err){
        done(err);
      });
    });

    it('should require id', function(done){
      xinput.setProp(null, name, 1, function(err){
        err.message.should.equal('id is required');
        done();
      });
    });

    it('should require name', function(done){
      xinput.setProp(touchpad.id, null, 1, function(err){
        err.message.should.equal('name is required');
        done();
      });
    });

    it('should require value', function(done){
      xinput.setProp(touchpad.id, name, null, function(err){
        err.message.should.equal('value is required');
        done();
      });
    });

    it('should set properties', function(done){
      xinput.setProp(touchpad.id, name, '0', function(err){
        console.log('Your touchpad should be disabled for 1.5 seconds.');
        setTimeout(function(){
          done(err);
        }, 1500);
      });
    });
  });
});
