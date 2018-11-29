/*jslint
    node: true
*/
'use strict';
const debug     = require('debug')('domotica:knx-device');

const Device    = require('./device');

class KnxDevice extends Device {
    constructor(domotica, name, address, dpt) {
        super(domotica, name, address);
        this.device = new domotica.knx.knx.Datapoint({ga: address, dpt: dpt}, domotica.knx.connection);
    }
    
    command(action, options) {
        super.command(action, options);
    }
    
    on(eventId, cb) {
        this.device.on(eventId, cb);
    }
}

module.exports = KnxDevice;
