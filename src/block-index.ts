import { closeSync, existsSync, openSync, readSync, writeSync } from 'fs';

export class BlockIndex {
  private filename: string;
  private offsets: number[];
  private fd: number;
  // tslint:disable-next-line:variable-name
  private _height: number;

  constructor(filename: string) {
    this.filename = filename;
    this.offsets = [];
    this.fd = 0;
    this._height = 0;
  }

  public init(iter?: (i: number) => void) {
    if (!existsSync(this.filename)) {
      this.fd = openSync(this.filename, 'w');
    } else {
      this.fd = openSync(this.filename, 'r+');
      this._height = this.readHeight();
      this.readItems(iter);
    }
  }

  public deinit() {
    closeSync(this.fd);
    this._height = 0;
    this.offsets = [];
    this.fd = 0;
  }

  public writeHeight(height: number) {
    const buffer = Buffer.alloc(4);
    buffer.writeInt32LE(height, 0);
    writeSync(this.fd, buffer);
    buffer.writeInt32LE(0, 0);
    writeSync(this.fd, buffer);
  }

  public writeItem(offset: number) {
    const buffer = Buffer.alloc(4);
    buffer.writeInt32LE(offset, 0);
    writeSync(this.fd, buffer);
  }

  public readHeight(): number {
    const buffer = Buffer.alloc(8);
    readSync(this.fd, buffer, 0, buffer.length, null);
    const low = buffer.readUInt32LE(0);
    // const height = buffer.readInt32LE(4);
    return low; // should be readUint64
  }

  public readItems(iter?: (i: number) => void) {
    for (let i = 0; i < this.height; i++) {
      const buffer = Buffer.alloc(4);
      readSync(this.fd, buffer, 0, buffer.length, null);
      const offset = buffer.readInt32LE(0);
      this.offsets[i] = offset;
      if (iter) {
        iter(offset);
      }
    }
  }

  public writeItems(items: number[]) {
    this.writeHeight(items.length);
    for (const item of items) {
      this.writeItem(item);
    }
  }

  public getOffsets() {
    return this.offsets;
  }

  public empty(): boolean {
    return this.offsets.length === 0;
  }
  get height(): number {
    return this._height;
  }

  get length() {
    return this.offsets.length;
  }

  public popOffsets() {
    this.offsets.pop();
    this.writeHeight(this.offsets.length);
  }
}
