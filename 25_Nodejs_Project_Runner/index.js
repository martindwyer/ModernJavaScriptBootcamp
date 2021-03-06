#!/usr/bin/env node

const chokidar = require("chokidar");
const debounce = require("lodash.debounce");
const program = require("caporal");
const fs = require("fs");
const { spawn } = require("child_process");

program
  .version("1.0.0")
  .argument("[filename]", "Name of file to execute")
  .action(async function ({ filename }, options, logger) {
    const name = filename || index.js;

    try {
      await fs.promises.access(name);
    } catch (err) {
      throw new Error(`Could not access the file ${name}`);
    }

    const start = debounce(() => {
      spawn("node", [name], { stdio: "inherit" });
    }, 100);

    chokidar
      .watch(".")
      .on("add", start)
      .on("change", start)
      .on("unlink", start);
  });

program.parse(process.argv);
