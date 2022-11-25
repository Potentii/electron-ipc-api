import IpcApiEnvelope from "./ipc-api-envelope.mjs";
import * as uuid from "uuid";
import IpcApiTimeoutError from "./ipc-api-timeout-error.mjs";


const libname = `@potentii/electron-ipc-api`;

/**
 * @package
 */
export default class Sender{

    /**
     *
     * @param {{ on: (channel: string, handler:function) => void, removeListener: (channel: string, handler:function) => void, send: (channel:string, ...args:*) => void }} ipc
     * @param {string} channel The channel to send the request
     * @param {?*} [data] The payload to be sent
     * @param {?object} opts
     * @param {?number} [opts.timeout=0] The request timeout (0 = no timeout) (defaults to 0)
     * @param {?boolean} [opts.showLogs=false] Wheather it should log the messages on console
     * @returns {Promise<*|void>}
     * @throws {IpcApiTimeoutError} If the timeout reaches
     */
    static async send(ipc, channel, data, opts){
        if(!channel?.trim?.()?.length)
            throw new TypeError(`${libname}: Invalid channel "${channel}" to send request`);

        channel = channel.trim();

        const showLogs = !!opts?.showLogs;
        const timeout = opts?.timeout || 0;
        if(typeof timeout !== 'number' || Number.isNaN(timeout) || timeout < 0 || Math.round(timeout) != timeout)
            throw new TypeError(`${libname}: Invalid timeout value: "${timeout}"`);

        return new Promise((resolve, reject) => {
            const req = IpcApiEnvelope.data(uuid.v4(), data);

            const timer_id = (timeout !== 0)
                ? setTimeout(() => {
                    cb(null, IpcApiEnvelope.error(req.id, new IpcApiTimeoutError(`${libname}: Timeout of ${timeout}ms reached`)));
                }, timeout)
                : null;

            // *Declaring the response callback handler:
            var cb = (_, res) => {
                res = IpcApiEnvelope.from(JSON.parse(res));
                if(res.id != req.id)
                    return;

                ipc.removeListener(channel, cb);
                if(timer_id !== null)
                    clearTimeout(timer_id);

                if(res.error){
                    if(showLogs)
                        console.error(`${libname}: Received an IPC error response on "${channel}" ID(${res.id})`, res.error);
                    return reject(res.error);
                }

                if(showLogs)
                    console.log(`${libname}: IPC request resolved on "${channel}" ID(${req.id})`, res.data);

                resolve(res.data);
            };

            ipc.on(channel, cb);

            // *Sending the IPC request:
            ipc.send(channel, JSON.stringify(req));

            if(showLogs)
                console.log(`${libname}: IPC request sent to "${channel}" ID(${req.id})`, req.data);
        });
    }


}