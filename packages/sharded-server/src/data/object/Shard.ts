// GENERATED CODE - DO NOT MODIFY

export class Shard {
	private static _pool: Shard[] = [];

	static readonly DOCUMENT_SIZE = 32; // bytes

	static initMemory(nb: number): SharedArrayBuffer {
		return new SharedArrayBuffer(nb * Shard.DOCUMENT_SIZE);
	}

	static init(buffer: SharedArrayBuffer) {
		Shard._sharedBuffer = buffer;
		Shard._int32View = new Int32Array(buffer);
	}

	private static _sharedBuffer: SharedArrayBuffer;
	private static _int32View: Int32Array;

	private _view: DataView;
	private _offset: number = 0;

	static find(index: number): Shard {
		const instance = Shard._pool.pop() ?? new Shard();
		return instance.find(index);
	}

	find(index: number): this {
		this._offset = index * Shard.DOCUMENT_SIZE;
		return this;
	}

	release(): void {
		Shard._pool.push(this);
	}

	constructor() {
		if (!Shard._sharedBuffer) throw new Error("Shard not initialized");
		this._view = new DataView(Shard._sharedBuffer);
	}

	async lockDocument(): Promise<void> {
		while (true) {
			if (
				Atomics.compareExchange(Shard._int32View, this._offset / 4, 0, 1) ===
				0
			) {
				return;
			}

			const result = Atomics.waitAsync(
				Shard._int32View,
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
				Shard._int32View,
				this._offset / 4,
				0,
				1,
			);
			if (res === 0) return;
			Atomics.wait(Shard._int32View, this._offset / 4, 1);
		}
	}

	unlockDocument(): void {
		Atomics.store(Shard._int32View, this._offset / 4, 0);
		Atomics.notify(Shard._int32View, this._offset / 4, 1);
	}

	get isLocked(): boolean {
		return Atomics.load(Shard._int32View, this._offset / 4) === 1;
	}

	
get currentWriteHost(): number {
    return this._view.getUint8(this._offset + 4);
}
        
            set currentWriteHost(v: number) {
                this._view.setUint8(this._offset + 4, v);
            }
        

get writeHosts(): Uint8Array {
    return new Uint8Array(
        this._view.buffer,
        this._view.byteOffset + this._offset + 5,
        8
    );
}
        
    set writeHosts(v: Uint8Array | number[]) {
        if (v.length > 8) {
            throw new Error(`[AtomicState] Array overflow for "writeHosts": expected 8, got ${v.length}`);
        }
        const array = new Uint8Array(this._view.buffer, this._view.byteOffset + this._offset + 5, 8);
        array.set(v);
    }

get writeHostCount(): number {
    return this._view.getUint8(this._offset + 13);
}
        
            set writeHostCount(v: number) {
                this._view.setUint8(this._offset + 13, v);
            }
        
}
