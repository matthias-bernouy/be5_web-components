// GENERATED CODE - DO NOT MODIFY

export class Administrator {
	private static _pool: Administrator[] = [];

	static readonly DOCUMENT_SIZE = 2080; // bytes

	static initMemory(nb: number): SharedArrayBuffer {
		return new SharedArrayBuffer(nb * Administrator.DOCUMENT_SIZE);
	}

	static init(buffer: SharedArrayBuffer) {
		Administrator._sharedBuffer = buffer;
		Administrator._int32View = new Int32Array(buffer);
	}

	private static _sharedBuffer: SharedArrayBuffer;
	private static _int32View: Int32Array;

	private _view: DataView;
	private _offset: number = 0;

	static find(index: number): Administrator {
		const instance = Administrator._pool.pop() ?? new Administrator();
		return instance.find(index);
	}

	find(index: number): this {
		this._offset = index * Administrator.DOCUMENT_SIZE;
		return this;
	}

	release(): void {
		Administrator._pool.push(this);
	}

	constructor() {
		if (!Administrator._sharedBuffer) throw new Error("Administrator not initialized");
		this._view = new DataView(Administrator._sharedBuffer);
	}

	async lockDocument(): Promise<void> {
		while (true) {
			if (
				Atomics.compareExchange(Administrator._int32View, this._offset / 4, 0, 1) ===
				0
			) {
				return;
			}

			const result = Atomics.waitAsync(
				Administrator._int32View,
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
				Administrator._int32View,
				this._offset / 4,
				0,
				1,
			);
			if (res === 0) return;
			Atomics.wait(Administrator._int32View, this._offset / 4, 1);
		}
	}

	unlockDocument(): void {
		Atomics.store(Administrator._int32View, this._offset / 4, 0);
		Atomics.notify(Administrator._int32View, this._offset / 4, 1);
	}

	get isLocked(): boolean {
		return Atomics.load(Administrator._int32View, this._offset / 4) === 1;
	}

	
get adminID(): number {
    return this._view.getUint8(this._offset + 4);
}
        
            set adminID(v: number) {
                this._view.setUint8(this._offset + 4, v);
            }
        

get pubKey(): Uint8Array {
    return new Uint8Array(
        this._view.buffer,
        this._view.byteOffset + this._offset + 5,
        2048
    );
}
        
    set pubKey(v: Uint8Array | number[]) {
        if (v.length > 2048) {
            throw new Error(`[AtomicState] Array overflow for "pubKey": expected 2048, got ${v.length}`);
        }
        const array = new Uint8Array(this._view.buffer, this._view.byteOffset + this._offset + 5, 2048);
        array.set(v);
    }

get canSendInstructions(): number {
    return this._view.getUint8(this._offset + 2053);
}
        
            set canSendInstructions(v: number) {
                this._view.setUint8(this._offset + 2053, v);
            }
        

get nonce(): bigint {
    return this._view.getBigUint64(this._offset + 2060, true);
}
        
            set nonce(v: bigint) {
                this._view.setBigUint64(this._offset + 2060, v, true);
            }
        
}
