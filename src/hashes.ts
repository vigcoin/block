import { IHash, uint64 } from '@vigcoin/types';
import * as assert from 'assert';

export class BlockHashes {
  private blockHashes: IHash[] = [];

  public has(hash: IHash) {
    return this.blockHashes.indexOf(hash) !== -1;
  }

  public push(hash: IHash): boolean {
    if (this.blockHashes.indexOf(hash) !== -1) {
      return false;
    }
    this.blockHashes.push(hash);
    return true;
  }

  public pop() {
    return this.blockHashes.pop();
  }

  public getHeight(hash: IHash) {
    return this.blockHashes.indexOf(hash);
  }

  public size() {
    return this.blockHashes.length;
  }

  public clear() {
    this.blockHashes = [];
  }

  // Former getBlockId
  public getHash(idx: uint64) {
    assert(idx >= 0);
    assert(idx < this.blockHashes.length);
    return this.blockHashes[idx - 1];
  }

  // Former getBlockIds
  public getHashes(startIndex: uint64, maxCount: uint64) {
    const hashes: IHash[] = [];
    if (startIndex < 0 || startIndex >= this.blockHashes.length) {
      return hashes;
    }
    let maxIndex = this.blockHashes.length;
    if (startIndex + maxCount < maxIndex) {
      maxIndex = startIndex + maxIndex;
    }
    for (let i = startIndex; i < maxIndex; i++) {
      hashes.push(this.blockHashes[i]);
    }
    return hashes;
  }

  public findSupplement(hashes: IHash[]) {
    for (const hash of hashes) {
      const offset = this.getHeight(hash);
      if (offset) {
        return offset;
      }
    }
    return false;
  }

  public buildSparseChain(startHash: IHash) {
    const idx = this.getHeight(startHash);
    assert(idx >= 0);
    const sparseChainEnd = idx + 1;
    const result: IHash[] = [];
    for (let i = 1; i <= sparseChainEnd; i *= 2) {
      result.push(this.blockHashes[sparseChainEnd - i]);
    }
    if (!result[result.length - 1].equals(this.blockHashes[0])) {
      result.push(this.blockHashes[0]);
    }
    return result;
  }

  // getTailId
  public getTailHash() {
    assert(this.blockHashes.length);
    return this.blockHashes[this.blockHashes.length - 1];
  }

  get tail() {
    return this.getTailHash();
  }
}
