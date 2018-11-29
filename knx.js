/*jslint
    node: true
*/
'use strict';
const debug     = require('debug')('domotica:knx');

const KNX       = require('knx');

class Knx {
    constructor(options) {
        let handlers = {
            connected: () => {
                debug('connected');
            },
            event: (event, source, destination, value) => {
                debug('**** KNX EVENT: ' + event + ', source: ' + source + ', destination: ' + destination);// + ', value: ' + value.toString());
                debug(value)
                console.log("%s **** KNX EVENT: %j, src: %j, dest: %j, value: %j", new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''), event, source, destination, value);
            },
            error: (connstatus) => {
                debug('**** ERROR: ' + connstatus);
            }
        };
        let connectionOptions = Object.assign(options, {handlers: handlers});
        debug(connectionOptions)
        this.knx = KNX;
        this.connection = KNX.Connection(connectionOptions);
    }
}

module.exports = Knx;
