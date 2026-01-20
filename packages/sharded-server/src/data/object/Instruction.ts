// GENERATED CODE - DO NOT MODIFY

export class Instructions {
	private static _pool: Instructions[] = [];

	static readonly DOCUMENT_SIZE = 65568; // bytes

	static initMemory(nb: number): SharedArrayBuffer {
		return new SharedArrayBuffer(nb * Instructions.DOCUMENT_SIZE);
	}

	static init(buffer: SharedArrayBuffer) {
		Instructions._sharedBuffer = buffer;
		Instructions._int32View = new Int32Array(buffer);
	}

	private static _sharedBuffer: SharedArrayBuffer;
	private static _int32View: Int32Array;

	private _view: DataView;
	private _offset: number = 0;

	static find(index: number): Instructions {
		const instance = Instructions._pool.pop() ?? new Instructions();
		return instance.find(index);
	}

	find(index: number): this {
		this._offset = index * Instructions.DOCUMENT_SIZE;
		return this;
	}

	release(): void {
		Instructions._pool.push(this);
	}

	constructor() {
		if (!Instructions._sharedBuffer) throw new Error("Instructions not initialized");
		this._view = new DataView(Instructions._sharedBuffer);
	}

	async lockDocument(): Promise<void> {
		while (true) {
			if (
				Atomics.compareExchange(Instructions._int32View, this._offset / 4, 0, 1) ===
				0
			) {
				return;
			}

			const result = Atomics.waitAsync(
				Instructions._int32View,
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
				Instructions._int32View,
				this._offset / 4,
				0,
				1,
			);
			if (res === 0) return;
			Atomics.wait(Instructions._int32View, this._offset / 4, 1);
		}
	}

	unlockDocument(): void {
		Atomics.store(Instructions._int32View, this._offset / 4, 0);
		Atomics.notify(Instructions._int32View, this._offset / 4, 1);
	}

	get isLocked(): boolean {
		return Atomics.load(Instructions._int32View, this._offset / 4) === 1;
	}

	
get instructionID(): number {
    return this._view.getUint32(this._offset + 4, true);
}
        
            set instructionID(v: number) {
                this._view.setUint32(this._offset + 4, v, true);
            }
        

get message(): Uint8Array {
    return new Uint8Array(
        this._view.buffer,
        this._view.byteOffset + this._offset + 8,
        65536
    );
}
        
    set message(v: Uint8Array | number[]) {
        if (v.length > 65536) {
            throw new Error(`[AtomicState] Array overflow for "message": expected 65536, got ${v.length}`);
        }
        const array = new Uint8Array(this._view.buffer, this._view.byteOffset + this._offset + 8, 65536);
        array.set(v);
    }
}
