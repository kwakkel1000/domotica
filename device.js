/*jslint
    node: true
*/
'use strict';
const debug     = require('debug')('domotica:device');
const History   = require('./history');

class Device {
    constructor(domotica, name, address) {
        debug(name + ' address: ' + address);
        this.domotica = domotica;
        this.name = name;
        this.address = address;
        this.history = {};
        for (type in this.history) {
            
        }
        //new History(name, []);
    }
    
    
    
    command(action, options) {
        debug(this.name + ' command: ' + action + ' options: ' + options);
    }
    
    on(eventId, cb) {
        debug(this.name + ' command: ' + action + ' options: ' + options);
    }
}

module.exports = Device;
