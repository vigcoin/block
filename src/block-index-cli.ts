#!/usr/bin/env node

import { resolve } from 'path';
import { BlockIndex } from './block-index';

const [, , ...files] = process.argv;
for (const file of files) {
  const absPath = resolve(process.cwd(), file);
  // tslint:disable-next-line: no-console
  console.log('Reading file = "' + absPath + '"');

  const bi = new BlockIndex(file);
  let idx = 0;
  bi.init(i => {
    // tslint:disable-next-line: no-console
    console.log(idx++, ':' + i);
  });
  // tslint:disable-next-line: no-console
  console.log('height = ' + bi.height);
}
