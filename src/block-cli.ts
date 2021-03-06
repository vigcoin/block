#!/usr/bin/env node

import { resolve } from 'path';
import { Block } from './block';
import { BlockIndex } from './block-index';

import * as moment from 'moment';

const [, , ...pathes] = process.argv;
for (const path of pathes) {
  const absPath = resolve(process.cwd(), path);
  // tslint:disable-next-line: no-console
  console.log('Reading file = "' + absPath + '"');

  const blockIndex = new BlockIndex(resolve(absPath, './blockindexes.dat'));
  const block = new Block(resolve(absPath, './blocks.dat'));

  blockIndex.init();
  if (!blockIndex.empty()) {
    const height = blockIndex.height;
    // tslint:disable-next-line: no-console
    console.log('block height is ', height);

    const length = blockIndex.length;

    // tslint:disable-next-line: no-console
    console.log('block number is ', length);
    block.init(blockIndex.getOffsets());

    for (let i = 0; i < length; i++) {
      const entry = block.get(i);
      console.log('time : ', entry.block.header.timestamp);
      const time = moment(new Date(entry.block.header.timestamp * 1000)).format(
        'YYYY-MM-DD hh:mm:ss'
      );
      // tslint:disable-next-line: no-console
      console.log(
        time + ': ' + 'At height :',
        entry.height,
        ', generated coins is ',
        entry.generatedCoins,
        '.'
      );
      // tslint:disable-next-line: no-console
      console.log(
        'size is ',
        entry.size,
        ', have(s) ',
        entry.transactions.length,
        ' transactions'
      );
    }
  }
}
