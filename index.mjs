import { Router } from 'express';
import { jsonParser } from '../../src/express-common.js';
import { createRequire } from 'module';
const require  = createRequire(import.meta.url);
const { exec } = require('child_process');
const os = require('os');

/**
 *
 * @param {Router} router
 */
export async function init(router) {
	router.get('/', jsonParser, (req, res)=>{
		res.send('process plugin is active');
	});
    router.get('/exit', jsonParser, (req, res)=>{
        if(os.platform() === 'win32'){
            process.emit('SIGINT');
            res.send('shutting down SillyTavern WebServer');
        }
        else if (os.platform() === 'linux') {
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
        }
        else {
            console.error('Other OS detected.');
        }
    });
    router.get('/restart', jsonParser, (req, res)=>{
        if(os.platform() === 'win32'){
            spawn(process.argv0, process.argv.slice(1), {
                stdio: 'ignore',
                detached: true,
                shell: true,
            }).unref();
            process.emit('SIGINT');
            res.send('restarting SillyTavern WebServer');
        }
        else if (os.platform() === 'linux') {
            exec('systemctl --user restart silly-tavern.service', (error, stdout, stderr) => {
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
        }
        else {
            console.error('Other OS detected.');
        }
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
