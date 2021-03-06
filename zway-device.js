/*jslint
    node: true
*/
'use strict';
const debug     = require('debug')('domotica:zway-device');

const Device    = require('./device');

class ZwayDevice extends Device {
    constructor(domotica, name, address, commandClasses) {
        super(domotica, name, address);
        this.device = domotica.zway.deviceApi.getDevice(address, commandClasses);
    }
    
    command(action, options) {
        super.command(action, options);
    }
    
    on(eventId, cb) {
        this.device.on(eventId, cb);
    }
}

module.exports = ZwayDevice;
