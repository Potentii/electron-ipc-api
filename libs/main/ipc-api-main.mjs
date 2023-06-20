import IpcApiEnvelope from "../commons/ipc-api-envelope.mjs";
import Sender from "../commons/sender.mjs";
import CallbackUtils from "../commons/callback-utils.mjs";

const libname = `@potentii/electron-ipc-api`;

let _ipcMain = null;

/**
 * @type {Map<function, function>}
 */
const cbs = new Map();


function getIpcMain(){
	if(!_ipcMain)
		_ipcMain = require('electron').ipcMain;
	return _ipcMain;
}

/**
 * Manages IPC routes on the main electron process
 * @public
 */
export default class IpcApiMain {


	/**
	 *
	 * @param {BrowserWindow} win The browser-window to send the request
	 * @param {string} channel The channel to send the request
	 * @param {?*} [data] The payload to be sent
	 * @param {?object} opts
	 * @param {?number} [opts.timeout=0] The request timeout (0 = no timeout) (defaults to 0)
	 * @param {?boolean} [opts.showLogs=false] Wheather it should log the messages on console
	 * @returns {Promise<*|void>}
	 * @throws {IpcApiTimeoutError} If the timeout reaches
	 */
	static async send(win, channel, data = null, opts){
		return await Sender.send(win.webContents, channel, data, opts);
	}


	/**
	 *
	 * @param {BrowserWindow} win The browser-window to send the request
	 * @param {string} channel The channel to send the request
	 * @param {?*} [data] The payload to be sent
	 */
	static emit(win, channel, data = null){
		win.webContents.send(channel, JSON.stringify(data));
	}


	/**
	 *
	 * @param {string} channel The channel name
	 * @param {(data: ?*) => Promise<*|void>} asyncCb
	 */
	static process(channel, asyncCb){
		getIpcMain().on(channel, async (e, req) => {
			try{
				req = IpcApiEnvelope.from(JSON.parse(req));
				e.sender.send(channel, JSON.stringify(IpcApiEnvelope.data(req.id, await asyncCb.call(null, req.data))));
			} catch(err){
				e.sender.send(channel, JSON.stringify(IpcApiEnvelope.error(req.id, err)));
			}
		});
	}



	/**
	 *
	 * @param {string} channel
	 * @param {(e: *, data: ?*) => *} cb
	 */
	static once(channel, cb){
		const decorated = CallbackUtils.parseDecorated(cb);
		cbs.set(cb, decorated);
		getIpcMain().once(channel, decorated);
	}

	/**
	 *
	 * @param {string} channel
	 * @param {(e: *, data: ?*) => *} cb
	 */
	static on(channel, cb){
		const decorated = CallbackUtils.parseDecorated(cb);
		cbs.set(cb, decorated);
		getIpcMain().on(channel, decorated);
	}

	/**
	 *
	 * @param {string} channel
	 * @param {(e: *, data: ?*) => *} [cb]
	 */
	static off(channel, cb){
		if(cb){
			const decorated = cbs.get(cb);
			if(!decorated)
				throw new Error(`${libname}: Could not unregister listener, callback could not be found "${cb}"`);
			getIpcMain().off(channel, decorated);
		} else{
			getIpcMain().off(channel);
		}
	}

}
