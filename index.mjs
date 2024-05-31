import { Router } from 'express';
import { jsonParser } from '../../src/express-common.js';
import { createRequire } from 'module';
const require  = createRequire(import.meta.url);
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
        process.emit('SIGINT');
        res.send('shutting down SillyTavern WebServer');
    });
    router.get('/restart', jsonParser, (req, res)=>{
        spawn(process.argv0, process.argv.slice(1), {
            stdio: 'ignore',
            detached: true,
            shell: true,
        }).unref();
        process.emit('SIGINT');
        res.send('restarting SillyTavern WebServer');
    });
	router.get('/exit-linux', jsonParser, (req, res)=>{
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
	router.get('/restart-linux', jsonParser, (req, res)=>{
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
