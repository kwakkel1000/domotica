/*jslint
    node: true
*/
'use strict';
let config          = require('./config');

const debug         = require('debug')('domotica');
const storage       = require('node-persist');

const Zway          = require('./zway');
const ZwayDevice    = require('./zway-device');
const Knx           = require('./knx');
const KnxDevice     = require('./knx-device');
const Group         = require('./group');

const Events        = require('./events');

class Domotica {
    constructor (express, app, io) {
        this.domotica = {};
      	this.domotica.name = "Domotica";
      	this.domotica.express = express;
      	this.domotica.app = app;
      	this.domotica.io = io;
        this.domotica.sockets = [];
        
        this.domotica.handleNewSocket = ( socket ) => {
            debug("add socket");
            this.domotica.sockets.push(socket);
            socket.emit("variables", this.variables);
        };

      	this.init();
        return this.domotica;
    }
    
    init () {
        this.apiRouter = this.domotica.express.Router();
        this.domotica.app.use("/apps/domotica/", this.apiRouter);
        this.routeInit();
        
        this.staticInit();
        storage.initSync();
        this.initVariables();
        this.initBindings();
        this.initDevices();
    }
    
    staticInit() {
      	this.apiRouter.use('/' , this.domotica.express.static(__dirname + '/public'));
    }
    
    routeInit(objectType) {
        this.apiRouter.get('/variables', (req, res, next) => {
            res.send(JSON.stringify(this.variables));
        });
        this.apiRouter.post('/comfort', (req, res, next) => {
            debug(req.body);
            let data = req.body.data;
            this.variables.Comfort = data.value;
            this.events.setThermostaat();
            debug(this.variables);
            res.send(JSON.stringify({status: "succes"}));
            this.socketSendVariables({Comfort: this.variables.Comfort});
            //res.send(JSON.parse(this.variables));
        });
        this.apiRouter.post('/media', (req, res, next) => {
            debug(req.body);
            let data = req.body.data;
            this.variables[data.room].media = data.value;
            this.events.setMedia(data.room);
            this.events.setComfort();
            debug(this.variables);
            res.send(JSON.stringify({status: "succes"}));
            //res.send(JSON.parse(this.variables));
        });
        this.apiRouter.post('/scene', (req, res, next) => {
            debug(req.body);
            let data = req.body.data;
            this.variables[data.scene].scene = data.value;
            this.events.setScene(data.scene);
//            this.events.setMedia(data.room);
            this.events.setComfort();
            debug(this.variables);
            res.send(JSON.stringify({status: "succes"}));
            //res.send(JSON.parse(this.variables));
        });
    }

    initVariables() {
        debug("Variables");
        this.variables = {};
        //this.variables.day = false;
        //storage.setItem('variables', this.variables);
        this.variables = storage.getItem('variables');
        setInterval(() => {
            storage.setItem('variables', this.variables);
        }, 60 * 60 * 1000);
        /*storage.getItem('variables')
        .then((value) => {
            this.variables = value;
        // Save variables
            setInterval(() => {
                storage.setItem('variables', this.variables);
            }, 60 * 60 * 1000);
        }, (reason) => {
            debug(reason);
        });*/
        debug(this.variables);
    }
    
    initBindings() {
        debug("Bindings");
        this.zway = new Zway(config.zway);
        this.knx = new Knx(config.knx);
//        this.zway.deviceApi.onAny((data) => {
        this.zway.deviceApi.on('47', '*', '*', data => {
            debug('event data:', data);
        });
    }

    
    initDevices() {
        debug("Devices");
        let deviceConfig = {};
        //deviceConfig.zway['Fan Woonkamer'] = {id: 45, commandClasses: [37]};
        //storage.setItem('devices', deviceConfig);
        deviceConfig = storage.getItem('devices');
        debug(deviceConfig);
            this.devices = {};
            for (let device in deviceConfig.zway) {
                this.devices[device] = new ZwayDevice(this, device, deviceConfig.zway[device].id, deviceConfig.zway[device].commandClasses);
            };
            this.devices['DayNight'] = new KnxDevice(this, 'DayNight', '0/0/4', 'DPT1.002');
            this.devices['ComfortScene'] = new KnxDevice(this, 'ComfortScene', '0/1/0', 'DPT17.001');
            this.devices['WoonkamerScene'] = new KnxDevice(this, 'WoonkamerScene', '0/1/1', 'DPT17.001');
            this.devices['SlaapkamerScene'] = new KnxDevice(this, 'SlaapkamerScene', '0/1/2', 'DPT17.001');
            this.devices['HobbykamerScene'] = new KnxDevice(this, 'HobbykamerScene', '0/1/3', 'DPT17.001');
            
            this.knx.connection.on('GroupValue_Read_0/0/4', (src, dest) => {
                this.devices['DayNight'].device.write(this.variables.day);
            });
/*            this.knx.connection.on('GroupValue_Read_0/1/1', (src, dest) => {
                this.devices['DayNight'].device.write(this.variables.day);
            });
            this.knx.connection.on('GroupValue_Read_0/0/4', (src, dest) => {
                this.devices['DayNight'].device.write(this.variables.day);
            });*/
            


            this.initGroups();
/*        storage.getItem('devices')
        .then((value) => {
            deviceConfig = value;
            this.devices = {};
            for (let device in deviceConfig.zway) {
                this.devices[device] = new ZwayDevice(this, device, deviceConfig.zway[device].id, deviceConfig.zway[device].commandClasses);
            };
            this.initGroups();
        }, (reason) => {
            debug(reason);
        });*/
    }
    
    initGroups() {
        debug("Groups");
        let groupConfig = {};
        //groupConfig['Licht Woonkamer'] = ['RGBW Woonkamer 1', 'RGBW Woonkamer 3', 'DS Woonkamer 4'];
        //storage.setItem('groups', groupConfig);
        groupConfig = storage.getItem('groups')
        debug(groupConfig);
            this.groups = {};
            for (let group in groupConfig) {
                let groupArray = [];
                groupConfig[group].forEach((device) => {
                    groupArray.push(this.devices[device]);
                });
                this.groups[group] = new Group(group, groupArray);
            };
            this.events = new Events(this);
/*        storage.getItem('groups')
        .then((value) => {
            groupConfig = value
            this.groups = {};
            for (let group in groupConfig) {
                let groupArray = [];
                groupConfig[group].forEach((device) => {
                    groupArray.push(this.devices[device]);
                });
                this.groups[group] = new Group(group, groupArray);
            };
            this.events = new Events(this);
        }, (reason) => {
            debug(reason);
        });*/
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
    
    socketSendVariables(data) {
        this.domotica.sockets.forEach((socket) => {
            socket.emit("variables", data);
        });
    }

}

module.exports = (express, app, io) => {
    return new Domotica(express, app, io);
};
