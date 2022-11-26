import IpcApiEnvelope from "../commons/ipc-api-envelope.mjs";
import Sender from "../commons/sender.mjs";

let _ipcMain = null;

/**
 * Manages IPC routes on the main electron process
 * @public
 */
export default class IpcApiMain {


	static get #ipcMain(){
		if(!_ipcMain)
			_ipcMain = require('electron').ipcMain;
		return _ipcMain;
	}


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
		win.webContents.send(channel, data);
	}


	/**
	 *
	 * @param {string} channel The channel name
	 * @param {(data: ?*) => Promise<*|void>} asyncCb
	 */
	static process(channel, asyncCb){
		IpcApiMain.#ipcMain.on(channel, async (e, req) => {
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
	 * @param {(data: ?*) => void} cb
	 */
	static once(channel, cb){
		IpcApiMain.#ipcMain.once(channel, cb);
	}

	/**
	 *
	 * @param {string} channel
	 * @param {(data: ?*) => void} cb
	 */
	static on(channel, cb){
		IpcApiMain.#ipcMain.on(channel, cb);
	}

	/**
	 *
	 * @param {string} channel
	 * @param {(data: ?*) => void} [cb]
	 */
	static off(channel, cb){
		if(cb)
			IpcApiMain.#ipcMain.off(channel, cb);
		else
			IpcApiMain.#ipcMain.off(channel);
	}

}
