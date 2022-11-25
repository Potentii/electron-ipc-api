/**
 * @public
 */
export default class IpcApiTimeoutError extends Error{
	constructor(message){
		super(message);
		this.name = this.constructor.name;
		this.message = message;
		if('captureStackTrace' in Error)
			Error.captureStackTrace(this, IpcApiTimeoutError);
		else
			this.stack = (new Error()).stack;
	}
}