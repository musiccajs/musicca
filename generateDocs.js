/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */

const { runGenerator } = require('@discordjs/ts-docgen');
const yargs = require('yargs');

const { argv } = yargs
  .option('verbose', {
    alias: 'v',
    description: 'Set verbose mode',
    type: 'boolean',
  })
  .option('dry-run', {
    alias: 'd',
    description: 'Only run generator without writing to output',
    type: 'boolean'
  })
  .help()
  .alias('help', 'h');

const config = {
  existingOutput: 'docs/tsdoc.json',
  custom: 'docs/index.yml',
  verbose: argv.verbose ?? false,
};

if (!argv['dry-run']) {
  config.output = 'docs/docs.json';
}

runGenerator(config);