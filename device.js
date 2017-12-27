/*jslint
    node: true
*/
'use strict';
const debug     = require('debug')('domotica:device');

class Device {
    constructor(domotica, address) {
        this.domotica = domotica;
        this.address = address;
    }
    
    command(action, options) {
        debug('command: ' + action + ' options: ' + options);
    }
    
    on(eventId, cb) {
        debug('command: ' + action + ' options: ' + options);
    }
}

module.exports = Device;
