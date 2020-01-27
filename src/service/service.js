'use strict';

const {USER_ARGV_INDEX, DEFAULT_COMMAND, ExitCode} = require(`../constants`);
const Cli = require(`./cli`);

const userArguments = process.argv.slice(USER_ARGV_INDEX);
const [userCommand, userMockItemsCount] = userArguments;

if (userArguments.length === 0 || !Cli[userCommand]) {
  Cli[DEFAULT_COMMAND].run();
  process.exit(ExitCode.success);
}

if (userMockItemsCount > 1000) {
  console.info(`Не больше 1000 публикаций`);
  process.exit(ExitCode.error);
}

Cli[userCommand].run(userMockItemsCount);
