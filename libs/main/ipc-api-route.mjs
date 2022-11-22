import {ipcMain} from 'electron'
import IpcApiEnvelope from "../commons/ipc-api-envelope.mjs";

/**
 * Manages IPC routes on the main electron process
 * @public
 */
export default class IpcApiRoute{

	/**
	 *
	 * @param {string} channel The channel name
	 * @param {(data: ?*) => Promise<*|void>} asyncCb
	 */
	static on(channel, asyncCb){
		ipcMain.on(channel, async (e, req) => {
			try{
				req = IpcApiEnvelope.from(JSON.parse(req));
				e.sender.send(channel, JSON.stringify(IpcApiEnvelope.data(req.id, await asyncCb.call(null, req.data))));
			} catch(err){
				e.sender.send(channel, JSON.stringify(IpcApiEnvelope.error(req.id, err)));
			}
		});
	}

}
