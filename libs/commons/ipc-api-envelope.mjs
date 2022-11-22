/**
 * @package
 */
export default class IpcApiEnvelope {

	constructor(){
		/**
		 *
		 * @type {string}
		 * @private
		 */
		this._id = undefined;
		/**
		 *
		 * @type {?*}
		 * @private
		 */
		this._data = undefined;
		/**
		 *
		 * @type {?Error}
		 * @private
		 */
		this._error = undefined;
	}


	/**
	 *
	 * @param {object|IpcApiEnvelope} obj
	 * @returns {IpcApiEnvelope}
	 */
	static from(obj){
		const envelope = new IpcApiEnvelope();
		envelope.setId(obj._id);
		envelope.setData(obj._data);
		envelope.setError(obj._error);
		return envelope;
	}


	/**
	 *
	 * @param {string} id
	 * @param {?*} data
	 * @returns {IpcApiEnvelope}
	 */
	static data(id, data){
		return new IpcApiEnvelope().setId(id).setData(data);
	}


	/**
	 *
	 * @param {string} id
	 * @param {Error} error
	 * @returns {IpcApiEnvelope}
	 */
	static error(id, error){
		return new IpcApiEnvelope().setId(id).setError(error);
	}


	/**
	 *
	 * @param {?*} data
	 * @returns {IpcApiEnvelope}
	 */
	setData(data){
		this._data = data;
		return this;
	}


	/**
	 *
	 * @returns {?*}
	 */
	get data(){
		return this._data;
	}


	/**
	 *
	 * @param {?Error} error
	 * @returns {IpcApiEnvelope}
	 */
	setError(error){
		this._error = error;
		return this;
	}


	/**
	 *
	 * @returns {?Error}
	 */
	get error(){
		return this._error;
	}


	/**
	 *
	 * @param {string} id
	 * @returns {IpcApiEnvelope}
	 */
	setId(id){
		this._id = id;
		return this;
	}


	/**
	 *
	 * @returns {string}
	 */
	get id(){
		return this._id;
	}

}