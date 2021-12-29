#!/usr/bin/env node

import fs from "fs";
import util from "util";
import chalk from "chalk";
import path from "path";

// Method #2
// const lstat = util.promisify(fs.lstat);

// Method #3
const { lstat } = fs.promises;

const targetDir = process.argv[2] || process.cwd();

fs.readdir(targetDir, async (err, files) => {
  if (err) {
    console.log(err);
  } else {
    for (let file of files) {
      try {
        const stats = await lstat(path.join(targetDir, file));
        if (stats.isFile()) {
          console.log(file, stats.isFile());
        } else {
          console.log(chalk.blue(file), stats.isFile());
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
});

// Method #1
// const lstat = (file) => {
//   return new Promise((resolve, reject) => {
//     fs.lstat(file, (err, stats) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(stats);
//       }
//     });
//   });
// };
