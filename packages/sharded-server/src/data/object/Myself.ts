// GENERATED CODE - DO NOT MODIFY

export class Myself {
	private static _pool: Myself[] = [];

	static readonly DOCUMENT_SIZE = 4128; // bytes

	static initMemory(nb: number): SharedArrayBuffer {
		return new SharedArrayBuffer(nb * Myself.DOCUMENT_SIZE);
	}

	static init(buffer: SharedArrayBuffer) {
		Myself._sharedBuffer = buffer;
		Myself._int32View = new Int32Array(buffer);
	}

	private static _sharedBuffer: SharedArrayBuffer;
	private static _int32View: Int32Array;

	private _view: DataView;
	private _offset: number = 0;

	static find(index: number): Myself {
		const instance = Myself._pool.pop() ?? new Myself();
		return instance.find(index);
	}

	find(index: number): this {
		this._offset = index * Myself.DOCUMENT_SIZE;
		return this;
	}

	release(): void {
		Myself._pool.push(this);
	}

	constructor() {
		if (!Myself._sharedBuffer) throw new Error("Myself not initialized");
		this._view = new DataView(Myself._sharedBuffer);
	}

	async lockDocument(): Promise<void> {
		while (true) {
			if (
				Atomics.compareExchange(Myself._int32View, this._offset / 4, 0, 1) ===
				0
			) {
				return;
			}

			const result = Atomics.waitAsync(
				Myself._int32View,
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
				Myself._int32View,
				this._offset / 4,
				0,
				1,
			);
			if (res === 0) return;
			Atomics.wait(Myself._int32View, this._offset / 4, 1);
		}
	}

	unlockDocument(): void {
		Atomics.store(Myself._int32View, this._offset / 4, 0);
		Atomics.notify(Myself._int32View, this._offset / 4, 1);
	}

	get isLocked(): boolean {
		return Atomics.load(Myself._int32View, this._offset / 4) === 1;
	}

	
get id(): number {
    return this._view.getUint8(this._offset + 4);
}
        
            set id(v: number) {
                this._view.setUint8(this._offset + 4, v);
            }
        

get currentEpoch(): number {
    return this._view.getUint32(this._offset + 8, true);
}
        
            set currentEpoch(v: number) {
                this._view.setUint32(this._offset + 8, v, true);
            }
        

get privKey(): Uint8Array {
    return new Uint8Array(
        this._view.buffer,
        this._view.byteOffset + this._offset + 12,
        4096
    );
}
        
    set privKey(v: Uint8Array | number[]) {
        if (v.length > 4096) {
            throw new Error(`[AtomicState] Array overflow for "privKey": expected 4096, got ${v.length}`);
        }
        const array = new Uint8Array(this._view.buffer, this._view.byteOffset + this._offset + 12, 4096);
        array.set(v);
    }
}
