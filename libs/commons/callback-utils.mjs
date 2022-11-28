/**
 * @package
 */
export default class CallbackUtils{
    /**
     * @template T
     * @param {(e: Event, data: *) => T|Promise<T>} cb
     * @return {(e: Event, data:*) => Promise<T>}
     */
    static parseDecorated(cb){
        return async (e, data) => await cb.call(null, e, JSON.parse(data))
    };
}