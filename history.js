/*jslint
    node: true
*/
'use strict';
const debug     = require('debug')('domotica:history');

class History {
    constructor(name = '', values = [], size = 100) {
        debug(name + ' values: ' + values);
        this.name = name;
        this.values = values;
        this.size = size;
    }
    
    add (value) {
        this.values.push(value);
        if (this.values.length > this.size) {
            this.values.pop();
        }
    }
    
    get latest() {
        if (this.values.length === 0) {
            return undefined;
        }
        return this.values[this.values.length - 1];
    }
    
    get max() {
        if (this.values.length === 0) {
            return NaN;
        }
        return Math.max.apply(Math, this.values);
    }
    
    get min() {
        if (this.values.length === 0) {
            return NaN;
        }
        return Math.min.apply(Math, this.values);
    }
    
    get length() {
        return this.values.length;
    }
}

module.exports = History;
