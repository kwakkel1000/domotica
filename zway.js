/*jslint
    node: true
*/
'use strict';
const debug     = require('debug')('domotica:zway');

const NodeZway  = require('node-zway');

class Zway {
    constructor(options) {
        this.deviceApi = new NodeZway.DeviceApi(options);
        this.deviceApi.poll(1000);
    }
}

module.exports = Zway;
