[![NPM package](https://img.shields.io/npm/v/node-ts-starter-cli.svg)](https://www.npmjs.com/package/node-ts-starter-cli)
[![CI](https://github.com/FreekMencke/node-ts-starter-cli/actions/workflows/main.yml/badge.svg?branch=master)](https://github.com/FreekMencke/node-ts-starter-cli/actions/workflows/main.yml)
[![GitHub issues](https://img.shields.io/github/issues/FreekMencke/node-ts-starter-cli.svg)](https://github.com/FreekMencke/node-ts-starter-cli/issues)
[![GitHub license](https://img.shields.io/github/license/FreekMencke/node-ts-starter-cli.svg)](https://github.com/FreekMencke/node-ts-starter-cli/blob/master/LICENSE)

# Node TS Starter CLI

The Node TS Starter CLI is a command-line tool that helps developers quickly set up a new Node.js project with TypeScript. It offers a variety of features such as strict TypeScript configuration, esbuild, EditorConfig, and support for Docker, Github Action CI, linting, and config per environment.

## Getting started

To get started with the Node TS Starter CLI, simply run the following command in your command line interface:

```
npx node-ts-starter-cli create your-project-name -M
```

This command will generate a new project in the `./your-project-name/` folder. You can find an example of a generated project in the [node-typescript-starter](https://github.com/FreekMencke/node-typescript-starter) repository.

## Features

- Strict TypeScript configuration
- Compiled and bundled with [esbuild](https://esbuild.github.io/)
- EditorConfig
- Commitizen (`-c`)
- ESLint (`-l`)
- Docker support (`-d`)
- Github Action CI (`-g`)
- Separate Dev/Prod config files (`-e`)

### Analyzing your bundle

The Node TS Starter CLI also includes commands that will generate a meta.json file (`npm run build:meta` or `npm run build:meta:prod`). This file can be uploaded to [Bundle Buddy](https://bundle-buddy.com/esbuild) to perform a detailed bundle analasys.

### More options

The Node TS Starter CLI offers additional options such as `--minimal` and `--maximal` for a minimal or maximal project setup, as well as options for linting, Docker support, and config per environment. You can find a full list of options by running `node-ts-starter-cli create --help`.

```
node-ts-starter-cli create <name> [args]

Creates a new project.

Positionals:
  name  Project and folder name             [string] [required] [default: "node-typescript-starter"]

Creation options
  -m, --minimal        Project setup without any features and minimal code.                [boolean]
  -M, --maximal        Project setup with all features.                                    [boolean]
  -d, --docker         Adds support for Docker.                                            [boolean]
  -g, --github-action  Adds Github Action CI.                                              [boolean]
  -l, --eslint         Adds linting configuration.                                         [boolean]
  -e, --environments   Adds support for config per environment.                            [boolean]
  -c, --commitizen     Adds commitizen for clean commits.                                  [boolean]

Options:
      --version  Show version number                                                       [boolean]
      --help     Show help                                                                 [boolean]
```

## Support

If you have any issues or questions, please feel free to open a [GitHub issue](https://github.com/FreekMencke/node-ts-starter-cli/issues).
