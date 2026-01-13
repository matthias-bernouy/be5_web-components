// GENERATED CODE - DO NOT MODIFY

export class Config {
	private static _pool: Config[] = [];

	static readonly DOCUMENT_SIZE = 32; // bytes

	static initMemory(nb: number): SharedArrayBuffer {
		return new SharedArrayBuffer(nb * Config.DOCUMENT_SIZE);
	}

	static init(buffer: SharedArrayBuffer) {
		Config._sharedBuffer = buffer;
		Config._int32View = new Int32Array(buffer);
	}

	private static _sharedBuffer: SharedArrayBuffer;
	private static _int32View: Int32Array;

	private _view: DataView;
	private _offset: number = 0;

	static find(index: number): Config {
		const instance = Config._pool.pop() ?? new Config();
		return instance.find(index);
	}

	find(index: number): this {
		this._offset = index * Config.DOCUMENT_SIZE;
		return this;
	}

	release(): void {
		Config._pool.push(this);
	}

	constructor() {
		if (!Config._sharedBuffer) throw new Error("Config not initialized");
		this._view = new DataView(Config._sharedBuffer);
	}

	async lockDocument(): Promise<void> {
		while (true) {
			if (
				Atomics.compareExchange(Config._int32View, this._offset / 4, 0, 1) ===
				0
			) {
				return;
			}

			const result = Atomics.waitAsync(
				Config._int32View,
				this._offset / 4,
				1,
			);

			if (result.value === "not-equal") {
				continue;
			}

			await result.value;
		}
	}

	lockDocumentSync(): void {
		while (true) {
			const res = Atomics.compareExchange(
				Config._int32View,
				this._offset / 4,
				0,
				1,
			);
			if (res === 0) return;
			Atomics.wait(Config._int32View, this._offset / 4, 1);
		}
	}

	unlockDocument(): void {
		Atomics.store(Config._int32View, this._offset / 4, 0);
		Atomics.notify(Config._int32View, this._offset / 4, 1);
	}

	get isLocked(): boolean {
		return Atomics.load(Config._int32View, this._offset / 4) === 1;
	}

	
get aezr(): number {
    return this._view.getInt32(this._offset + 4, true);
}
        
            set aezr(v: number) {
                this._view.setInt32(this._offset + 4, v, true);
            }
        
}
