export class MyAtomicState {
	private static _pool: MyAtomicState[] = [];

	static readonly DOCUMENT_SIZE = 8; // bytes

	static initMemory(nb: number): SharedArrayBuffer {
		return new SharedArrayBuffer(
			nb * MyAtomicState.DOCUMENT_SIZE,
		);
	}

	static init(buffer: SharedArrayBuffer) {
		MyAtomicState._sharedBuffer = buffer;
		MyAtomicState._int32View = new Int32Array(buffer);
	}

	private static _sharedBuffer: SharedArrayBuffer;
	private static _int32View: Int32Array;

	private _view: DataView;
	private _offset: number = 0;

	static find(index: number): MyAtomicState {
		const instance = MyAtomicState._pool.pop() ?? new MyAtomicState();
		return instance.find(index);
	}

	find(index: number): this {
		this._offset = index * MyAtomicState.DOCUMENT_SIZE;
		return this;
	}

	release(): void {
		MyAtomicState._pool.push(this);
	}

	constructor() {
		if (!MyAtomicState._sharedBuffer) throw new Error("MyAtomicState not initialized");
		this._view = new DataView(MyAtomicState._sharedBuffer);
	}

	async lockDocument(): Promise<void> {
		while (true) {
			if (
				Atomics.compareExchange(MyAtomicState._int32View, this._offset / 4, 0, 1) ===
				0
			) {
				return;
			}

			const result = Atomics.waitAsync(
				MyAtomicState._int32View,
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
				MyAtomicState._int32View,
				this._offset / 4,
				0,
				1,
			);
			if (res === 0) return;
			Atomics.wait(MyAtomicState._int32View, this._offset / 4, 1);
		}
	}

	unlockDocument(): void {
		Atomics.store(MyAtomicState._int32View, this._offset / 4, 0);
		Atomics.notify(MyAtomicState._int32View, this._offset / 4, 1);
	}

	get isLocked(): boolean {
		return Atomics.load(MyAtomicState._int32View, this._offset / 4) === 1;
	}

	
            get aezr(): number {
                return this._view.getInt32(this._offset + 4, true);
            }
        
            set aezr(v: number) {
                this._view.setInt32(this._offset + 4, v, true);
            }
        
}
