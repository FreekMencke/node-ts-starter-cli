# 0.3.1 (2023-07-30)

- Created the `task.js` util to optimize code, and make it easier to add new features in the future.

# 0.3.0 (2023-07-30)

- Updated dependencies to the most recent version.
- Renamed `template-package.json` files to `package.json` to remain closer to the standard.
- Moved old `template-package.json` files to their respective sub folder, ex `/default`.
- Changed `copyTemplate` to ignore `package.json` files, so they won't get copied accidentally.

# 0.2.5 (2023-04-28)

- Fixed a bug causing docker files to be generated when using the `github-action` flag.

# 0.2.4 (2023-03-03)

- Fixed a bug causing `.gitignore` not to be bundled with the package.
- Removed `.editorconfig` since it was kind of redundant with `eslint` and `prettier`.

# 0.2.0

- Updated dependencies to latest version.

## Prettier

Added `prettier` feature! Can be used by providing the `-p` flag or the `-M` (maximal) flag. Also integrates properly
with eslint.

- `npm run prettier` command to format your code.
- `npm run prettier:ci` command to check if your code is formatted properly.

# 0.1.0 (2023-01-13)

Created `CHANGELOG.md`.

## Package.json

- Added description
- Homepage now directs to README.md

## Eslint

- Change `env` to `es2022` and `node`.

## Github Action

- Created github action to act as continuous integration.

## Templates

### Package.json

- Added `start:ci` command so we can run without a `--watch`.

### Base

- upped `tsconfig.json` to `es2022`
- added `useDefineForClassFields: false`.

### Eslint

- Change `env` to `es2022` and `node`.

---

### 0.0.3 (2023-01-11)

### 0.0.2 (2023-01-11)

### 0.0.1 (2023-01-11)
