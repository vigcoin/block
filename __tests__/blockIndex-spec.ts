import { unlinkSync } from 'fs';
import * as path from 'path';
import { BlockIndex } from '../src/block-index';

let blockIndex: BlockIndex;

describe('test block indexes', () => {
  const indexFile = path.resolve(__dirname, './data/blockindexes.dat');

  test('Should create block index', () => {
    blockIndex = new BlockIndex(indexFile);
    expect(blockIndex.empty()).toBeTruthy();
  });

  test('Should test block index loading', () => {
    blockIndex.init(i => {
      console.log(i);
    });
    expect(!blockIndex.empty()).toBeTruthy();
    expect(blockIndex.height).toBeTruthy();
  });
});

describe('test raw block', () => {
  const indexFile = path.resolve(__dirname, './data/blockindexes1.dat');
  const items = [100, 1122, 2, 1010, 0x7fffffff];

  test('Should create block index', () => {
    blockIndex = new BlockIndex(indexFile);
  });

  test('Should test block index saving', () => {
    blockIndex.init();
    blockIndex.writeItems(items);
    blockIndex.deinit();
  });

  test('Should test block index loading', () => {
    const b = new BlockIndex(indexFile);
    b.init();
    const items1 = b.getOffsets();
    expect(items.length === items1.length).toBeTruthy();
    for (let i = 0; i < items.length; i++) {
      expect(items[i] === items1[i]).toBeTruthy();
    }
  });

  test('Should remove block index', () => {
    unlinkSync(indexFile);
  });
});
