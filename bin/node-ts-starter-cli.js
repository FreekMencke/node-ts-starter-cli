#!/usr/bin/env node

import yargs from 'yargs';
import { createProject } from '../src/create.js';

const yargsInstance = yargs(process.argv.slice(2));

yargsInstance
  .scriptName('node-ts-starter-cli.js')
  .wrap(Math.min(100, yargsInstance.terminalWidth()))
  .usage('$0 <cmd>')
  .strictCommands()
  .demandCommand(1)
  .command(
    'create <name> [args]',
    'Creates a new project.',
    (yargs) => {
      const creationOptions = [
        ['commitizen', 'c', 'Adds commitizen for clean commits.'],
        ['docker', 'd', 'Adds support for Docker.'],
        ['environments', 'e', 'Adds support for config per environment.'],
        ['eslint', 'l', 'Adds linting configuration.'],
        ['github-action', 'g', 'Adds Github Action CI.'],
        ['prettier', 'p', 'Adds prettier configuration.'],
      ];

      yargs
        .positional('name', {
          describe: 'Project and folder name',
          type: 'string',
        })
        .option('minimal', {
          alias: 'm',
          desc: 'Project setup without any features and minimal code.',
          type: 'boolean',
          group: 'Creation options',
          conflicts: [...creationOptions.map(([option]) => option), 'maximal'],
        })
        .option('maximal', {
          alias: 'M',
          desc: 'Project setup with all features.',
          type: 'boolean',
          group: 'Creation options',
          conflicts: [...creationOptions.map(([option]) => option), 'minimal'],
        });

      creationOptions.reduce(
        (yargs, [name, alias, desc]) =>
          yargs.option(name, {
            alias,
            desc,
            type: 'boolean',
            group: 'Creation options',
          }),
        yargs,
      );
    },
    (argv) => createProject(argv),
  )
  .help().argv;
