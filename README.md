[![NPM package](https://img.shields.io/npm/v/node-ts-starter-cli.svg)](https://www.npmjs.com/package/node-ts-starter-cli)
[![CI](https://github.com/FreekMencke/node-ts-starter-cli/actions/workflows/main.yml/badge.svg?branch=master)](https://github.com/FreekMencke/node-ts-starter-cli/actions/workflows/main.yml)
[![GitHub issues](https://img.shields.io/github/issues/FreekMencke/node-ts-starter-cli.svg)](https://github.com/FreekMencke/node-ts-starter-cli/issues)
[![GitHub license](https://img.shields.io/github/license/FreekMencke/node-ts-starter-cli.svg)](https://github.com/FreekMencke/node-ts-starter-cli/blob/master/LICENSE)

# Node TS Starter CLI

Since I make a lot of projects, I created this **Node TS Starter CLI** to easily create a new Node project with
TypeScript.

## Getting started

To get started with the Node TS Starter CLI, simply run the following command in your command line interface:

```
npx node-ts-starter-cli create your-project-name -M
```

The command will generate your project in the `./your-project-name/` folder.

For an example of a generated project you can look at the
[example](https://github.com/FreekMencke/node-ts-starter-cli/tree/master/example).

## Features

- Strict TypeScript configuration
- Compiled and bundled with [esbuild](https://esbuild.github.io/)
- Commitizen (`-c`)
- ESLint (`-l`)
- Prettier (`-p`)
- Docker support (`-d`)
- Github Action CI (`-g`)
- Separate Dev/Prod config files (`-e`)

### Analyzing your bundle

With esbuild we can generate a `meta.json` file using the `npm run build:meta` or `npm run build:meta:prod` commands,
which we can then can be uploaded to [Bundle Buddy](https://bundle-buddy.com/esbuild) to perform a detailed bundle
analasys.

The Node TS Starter CLI offers additional options such as `--minimal` and `--maximal` for a minimal or maximal project
setup, as well as options for linting, Docker support, and config per environment. You can find a full list of options
by running `node-ts-starter-cli create --help`.

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
  -p, --prettier       Adds prettier configuration.                                        [boolean]

Options:
      --version  Show version number                                                       [boolean]
      --help     Show help                                                                 [boolean]
```

## Support

If you have any issues or questions, please feel free to open a
[GitHub issue](https://github.com/FreekMencke/node-ts-starter-cli/issues).
