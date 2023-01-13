[![NPM package](https://img.shields.io/npm/v/node-ts-starter-cli.svg)](https://www.npmjs.com/package/node-ts-starter-cli)
[![CI](https://github.com/FreekMencke/node-ts-starter-cli/actions/workflows/main.yml/badge.svg?branch=master)](https://github.com/FreekMencke/node-ts-starter-cli/actions/workflows/main.yml)
[![GitHub issues](https://img.shields.io/github/issues/FreekMencke/node-ts-starter-cli.svg)](https://github.com/FreekMencke/node-ts-starter-cli/issues)
[![GitHub license](https://img.shields.io/github/license/FreekMencke/node-ts-starter-cli.svg)](https://github.com/FreekMencke/node-ts-starter-cli/blob/master/LICENSE)

# Node TS Starter CLI

Since I make a lot of projects, I created this **Node TS Starter CLI** to easily create a new Node project with TypeScript.

## Getting started

Getting started is as easy as running 1 command in your cli:

```
npx node-ts-starter-cli create your-project-name -M
```

The command will generate your project in the `./your-project-name/` folder. 

For an example of a generated project you can look at [node-typescript-starter](https://github.com/FreekMencke/node-typescript-starter).

## Features

- Strict TSConfig
- [esbuild](https://esbuild.github.io/)
- EditorConfig
- Commitizen (`-c`)
- ESLint (`-l`)
- Docker support (`-d`)
- Github Action CI (`-g`)
- Separate Dev/Prod config files (`-e`)

### Analyzing your bundle

With esbuild we can generate a `meta.json` file using the `npm run build:meta` or `npm run build:meta:prod` commands, which we can then can be uploaded to [Bundle Buddy](https://bundle-buddy.com/esbuild) to perform a detailed bundle analasys.

## More options

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
