/*jslint
    node: true
*/
'use strict';
let config          = require('./config');

const debug         = require('debug')('domotica');
const storage       = require('node-persist');

const Zway          = require('./zway');
const ZwayDevice    = require('./zway-device');
const Group         = require('./group');

const Events        = require('./events');

class Domotica {
    constructor() {
        storage.initSync();
        this.initVariables();
        this.initBindings();
        this.initDevices();
    }
    
    initVariables() {
        debug("Variables");
        this.variables = {};
        //this.variables.day = false;
        //storage.setItem('variables', this.variables);
        storage.getItem('variables')
        .then((value) => {
            this.variables = value;
        }, (reason) => {
            debug(reason);
        });
    }
    
    initBindings() {
        debug("Bindings");
        this.zway = new Zway(config.zway);
    }
    
    initDevices() {
        debug("Devices");
        let deviceConfig = {};
        //deviceConfig.zway['Fan Woonkamer'] = {id: 45, commandClasses: [37]};
        //storage.setItem('devices', deviceConfig);
        storage.getItem('devices')
        .then((value) => {
            deviceConfig = value;
            this.devices = {};
            for (let device in deviceConfig.zway) {
                this.devices[device] = new ZwayDevice(this, deviceConfig.zway[device].id, deviceConfig.zway[device].commandClasses);
            };
            this.initGroups();
        }, (reason) => {
            debug(reason);
        });
    }
    
    initGroups() {
        debug("Groups");
        let groupConfig = {};
        //groupConfig['Licht Woonkamer'] = ['RGBW Woonkamer 1', 'RGBW Woonkamer 3', 'DS Woonkamer 4'];
        //storage.setItem('groups', groupConfig);
        storage.getItem('groups')
        .then((value) => {
            groupConfig = value
            this.groups = {};
            for (let group in groupConfig) {
                let groupArray = [];
                groupConfig[group].forEach((device) => {
                    groupArray.push(this.devices[device]);
                });
                this.groups[group] = new Group(groupArray);
            };
            this.events = new Events(this);
        }, (reason) => {
            debug(reason);
        });
    }
    
    getDay(dayInt) {
        let currentDay = "zondag";
        if (dayInt === 0) {
            currentDay = "zondag";
        }
        else if (dayInt === 1) {
            currentDay = "maandag";
        }
        else if (dayInt === 2) {
            currentDay = "dinsdag";
        }
        else if (dayInt === 3) {
            currentDay = "woensdag";
        }
        else if (dayInt === 4) {
            currentDay = "donderdag";
        }
        else if (dayInt === 5) {
            currentDay = "vrijdag";
        }
        else if (dayInt === 6) {
            currentDay = "zaterdag";
        }
        return currentDay;
    }
}

if (config.daemonize) {
    require('daemon')();
}
let domotica = new Domotica();

