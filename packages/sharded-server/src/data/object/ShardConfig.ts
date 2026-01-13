// GENERATED CODE - DO NOT MODIFY

export class ShardConfig {
	private static _pool: ShardConfig[] = [];

	static readonly DOCUMENT_SIZE = 32; // bytes

	static initMemory(nb: number): SharedArrayBuffer {
		return new SharedArrayBuffer(nb * ShardConfig.DOCUMENT_SIZE);
	}

	static init(buffer: SharedArrayBuffer) {
		ShardConfig._sharedBuffer = buffer;
		ShardConfig._int32View = new Int32Array(buffer);
	}

	private static _sharedBuffer: SharedArrayBuffer;
	private static _int32View: Int32Array;

	private _view: DataView;
	private _offset: number = 0;

	static find(index: number): ShardConfig {
		const instance = ShardConfig._pool.pop() ?? new ShardConfig();
		return instance.find(index);
	}

	find(index: number): this {
		this._offset = index * ShardConfig.DOCUMENT_SIZE;
		return this;
	}

	release(): void {
		ShardConfig._pool.push(this);
	}

	constructor() {
		if (!ShardConfig._sharedBuffer) throw new Error("ShardConfig not initialized");
		this._view = new DataView(ShardConfig._sharedBuffer);
	}

	async lockDocument(): Promise<void> {
		while (true) {
			if (
				Atomics.compareExchange(ShardConfig._int32View, this._offset / 4, 0, 1) ===
				0
			) {
				return;
			}

			const result = Atomics.waitAsync(
				ShardConfig._int32View,
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
				ShardConfig._int32View,
				this._offset / 4,
				0,
				1,
			);
			if (res === 0) return;
			Atomics.wait(ShardConfig._int32View, this._offset / 4, 1);
		}
	}

	unlockDocument(): void {
		Atomics.store(ShardConfig._int32View, this._offset / 4, 0);
		Atomics.notify(ShardConfig._int32View, this._offset / 4, 1);
	}

	get isLocked(): boolean {
		return Atomics.load(ShardConfig._int32View, this._offset / 4) === 1;
	}

	
get serverID(): number {
    return this._view.getInt8(this._offset + 4);
}
        
            set serverID(v: number) {
                this._view.setInt8(this._offset + 4, v);
            }
        
}
