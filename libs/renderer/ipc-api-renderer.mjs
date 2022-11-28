import IpcApiEnvelope from "../commons/ipc-api-envelope.mjs";
import Sender from "../commons/sender.mjs";
import CallbackUtils from "../commons/callback-utils.mjs";

const libname = `@potentii/electron-ipc-api`;


let _ipcRenderer = null;
/**
 * @type {Map<function, function>}
 */
const cbs = new Map();



/**
 * Manages IPC routes on the renderer electron process
 * @public
 */
export default class IpcApiRenderer {
	constructor(){
	}


	static get #ipcRenderer(){
		if(!_ipcRenderer)
			_ipcRenderer = electron?.ipcRenderer;
		if(!_ipcRenderer)
			throw new Error(`${libname}: Electron IPC renderer is not available`);
		return _ipcRenderer;
	}


	/**
	 *
	 * @param {string} channel The channel to send the request
	 * @param {?*} [data] The payload to be sent
	 * @param {?object} opts
	 * @param {?number} [opts.timeout=0] The request timeout (0 = no timeout) (defaults to 0)
	 * @param {?boolean} [opts.showLogs=false] Wheather it should log the messages on console
	 * @returns {Promise<*|void>}
	 * @throws {IpcApiTimeoutError} If the timeout reaches
	 */
	static async send(channel, data = null, opts){
		return await Sender.send(IpcApiRenderer.#ipcRenderer, channel, data, opts);
	}


	/**
	 *
	 * @param {string} channel The channel to send the request
	 * @param {?*} [data] The payload to be sent
	 */
	static emit(channel, data = null){
		IpcApiRenderer.#ipcRenderer.send(channel, JSON.stringify(data));
	}


	/**
	 *
	 * @param {string} channel The channel name
	 * @param {(data: ?*) => Promise<*|void>} asyncCb
	 */
	static process(channel, asyncCb){
		IpcApiRenderer.#ipcRenderer.on(channel, async (e, req) => {
			try{
				req = IpcApiEnvelope.from(JSON.parse(req));
				IpcApiRenderer.#ipcRenderer.send(channel, JSON.stringify(IpcApiEnvelope.data(req.id, await asyncCb.call(null, req.data))));
			} catch(err){
				IpcApiRenderer.#ipcRenderer.send(channel, JSON.stringify(IpcApiEnvelope.error(req.id, err)));
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
		IpcApiRenderer.#ipcRenderer.once(channel, decorated);
	}

	/**
	 *
	 * @param {string} channel
	 * @param {(e: *, data: ?*) => *} cb
	 */
	static on(channel, cb){
		const decorated = CallbackUtils.parseDecorated(cb);
		cbs.set(cb, decorated);
		IpcApiRenderer.#ipcRenderer.on(channel, decorated);
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
			IpcApiRenderer.#ipcRenderer.off(channel, decorated);
		} else{
			IpcApiRenderer.#ipcRenderer.off(channel);
		}
	}

}
