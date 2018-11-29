/*jslint
    node: true
*/
'use strict';
const debug     = require('debug')('domotica:onkyo');
const { spawn } = require('child_process');

class Onkyo {
    constructor() {
    }

    setSource(source) {
        let argument = 'source=' + source;
        let onkyo = spawn('onkyo', [argument]); 
        onkyo.stdout.on('data', (data) => {
          debug(`stdout: ${data}`);
        });

        onkyo.stderr.on('data', (data) => {
          debug(`stderr: ${data}`);
        });

        onkyo.on('close', (code) => {
          debug(`child process exited with code ${code}`);
        });
    }



}

module.exports = Onkyo;

