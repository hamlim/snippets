type PromiseResolver<Value> = (value: Value | PromiseLike<Value>) => void;
type PromiseRejecter = (reason?: unknown) => void;

type PromiseCallback<Value> = (
	res: PromiseResolver<Value>,
	rej: PromiseRejecter,
) => void;

type ResolvedCallback<Value> = (value: Value | PromiseLike<Value>) => void;
type RejectedCallback = (reason?: unknown) => void;

class AbortablePromise<Value> {
	resolve: PromiseResolver<Value>;
	reject: PromiseRejecter;
	promise: Promise<Value>;

	constructor(cb: PromiseCallback<Value>, signal: AbortSignal) {
		this.promise = new Promise<Value>((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
			cb(resolve, reject);
		});

		if (signal.aborted) {
			this.reject(signal.reason);
		}

		signal.addEventListener("abort", () => {
			this.reject(signal.reason);
		});
	}

	catch(callback: RejectedCallback) {
		this.promise.catch(callback);
	}

	then(...args: Array<ResolvedCallback<Value> | RejectedCallback>) {
		this.promise.then(...args);
	}
}
