import { Router } from 'express';
import { jsonParser } from '../../src/express-common.js';
import { createRequire } from 'module';
import { spawn } from 'child_process';
const require  = createRequire(import.meta.url);
const path = require('path');
const sanitize = require('sanitize-filename');
const fs = require('fs');
const { exec } = require('child_process');


/**
 *
 * @param {Router} router
 */
export async function init(router) {
	router.get('/', jsonParser, (req, res)=>{
		res.send('process plugin is active');
	});
	router.get('/exit', jsonParser, (req, res)=>{
        exec('systemctl --user stop silly-tavern.service', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Error in stderr: ${stderr}`);
                return;
            }
            res.send('shutting down SillyTavern WebServer');
        });
	});
	router.get('/restart', jsonParser, (req, res)=>{
        exec('systemctl --user stop silly-tavern.service', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Error in stderr: ${stderr}`);
                return;
            }
            res.send('restarting SillyTavern WebServer');
        });
	});
}

export async function exit() {}

const module = {
    init,
    exit,
    info: {
        id: 'process',
        name: 'process',
        description: 'Endpoints to help manage SillyTavern processes.',
    },
};
export default module;
