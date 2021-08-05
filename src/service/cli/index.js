'use strict';

const generate = require(`./generate`);
const help = require(`./help`);
const version = require(`./version`);
const server = require(`./server`);
const fill = require(`./fill`);
const filldb = require(`./filldb`);

module.exports = {
  [generate.name]: generate,
  [help.name]: help,
  [version.name]: version,
  [server.name]: server,
  [fill.name]: fill,
  [filldb.name]: filldb,
};
