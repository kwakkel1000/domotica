/*jslint
    node: true
*/
'use strict';
const debug     = require('debug')('domotica:group');

class Group {
    constructor(items) {
        this.items = items;
        /*if (items !== undefined && items !== null) {
            if (items.isArray) {
                items.forEach((item) => {
                    this.items.push(item);
                });
            }
            else {
                this.items.push(items);
            }
        }*/
    }
    
    addItem(item) {
        debug('add item: ' + item);
        this.items.push(item);
    }
    
    command(action, options) {
        debug('command: ' + action + ' options: ' + options);
        this.items.forEach((item) => {
            debug('command item: ' + item);
            item.command(action, options);
        });
    }
}

module.exports = Group;
