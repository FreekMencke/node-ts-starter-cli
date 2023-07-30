import { exec } from 'child_process';
import { mkdir, readFile, writeFile } from 'fs/promises';
import merge from 'lodash.merge';
import { dirname, join, resolve } from 'path';
import sortPackageJson from 'sort-package-json';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import { copyTemplate } from './utils/copy.js';
import { importJSON } from './utils/json.js';
import { task } from './utils/task.js';

export async function createProject(argv) {
  const templateFolder = join(dirname(fileURLToPath(import.meta.url)), '../templates');
  const projectFolder = resolve(process.cwd(), argv.name);

  console.log(`\nGenerating new project with name "${argv.name}"...\n`);

  // #region Preparing project folder

  await task('Creating folder...', 'Created folder.', () => mkdir(projectFolder));

  await task('Generating root files...', 'Generated root files.', () =>
    copyTemplate(templateFolder, 'base', projectFolder),
  );

  // Copy gitingore from template, because .npmignore removes it otherwise
  await writeFile(
    join(projectFolder, '.gitignore'),
    await readFile(new URL('../templates/template.gitignore', import.meta.url)),
  );

  // load the base package.json template, and modify it as we go.
  let packageJson = {
    ...(await importJSON(new URL('../templates/package.json', import.meta.url))),
    name: argv.name,
  };

  await task('Generating project files...', 'Generated project files.', async () => {
    const buildSrcTemplate = (() => {
      if (argv.minimal) return 'minimal';
      if (argv.maximal || argv.environments) return 'environments';
      return 'default';
    })();

    return Promise.all([
      await copyTemplate(templateFolder, `build/${buildSrcTemplate}`, join(projectFolder, 'build')),
      await copyTemplate(templateFolder, `src/${buildSrcTemplate}`, join(projectFolder, 'src')),
    ]);
  });

  // #endregion

  // #region Adding optional features

  if (argv.maximal || argv.eslint) {
    await task('Adding linting...', 'Added linting.', async () => {
      await copyTemplate(
        templateFolder,
        argv.maximal || argv.prettier ? 'eslint/prettier' : 'eslint/default',
        projectFolder,
      );

      packageJson = merge(
        packageJson,
        await importJSON(
          new URL(
            `../templates/eslint/${argv.maximal || argv.prettier ? 'prettier' : 'default'}/package.json`,
            import.meta.url,
          ),
        ),
      );
    });
  }

  if (argv.maximal || argv.prettier) {
    await task('Adding prettier...', 'Added prettier.', async () => {
      await copyTemplate(templateFolder, 'prettier/default', projectFolder);

      packageJson = merge(
        packageJson,
        await importJSON(new URL('../templates/prettier/default/package.json', import.meta.url)),
      );
    });
  }

  if (argv.maximal || argv.docker) {
    await task('Adding Docker...', 'Added Docker.', async () => {
      if (argv.maximal || (argv.eslint && argv.prettier))
        await copyTemplate(templateFolder, 'docker/prettier-eslint', projectFolder);
      else if (argv.eslint) await copyTemplate(templateFolder, 'docker/eslint', projectFolder);
      else if (argv.prettier) await copyTemplate(templateFolder, 'docker/prettier', projectFolder);
      else await copyTemplate(templateFolder, 'docker/default', projectFolder);

      packageJson = merge(
        packageJson,
        await importJSON(new URL('../templates/docker/default/package.json', import.meta.url)),
      );
    });
  }

  if (argv.maximal || argv.githubAction) {
    await task('Adding github-action...', 'Added github-action.', async () => {
      const githubActionTemplate = (() => {
        if (argv.maximal || argv.docker) return 'docker';
        if (argv.eslint && argv.prettier) return 'prettier-eslint';
        if (argv.eslint) return 'eslint';
        if (argv.prettier) return 'prettier';
        return 'default';
      })();

      return copyTemplate(
        templateFolder,
        `github-action/${githubActionTemplate}`,
        join(projectFolder, '.github/workflows'),
      );
    });
  }

  if (argv.maximal || argv.commitizen) {
    await task('Adding commitizen...', 'Added commitizen.', async () => {
      packageJson = merge(
        packageJson,
        await importJSON(new URL('../templates/commitizen/package.json', import.meta.url)),
      );
    });
  }

  // #endregion

  // #region finalizing project folder and installing dependencies

  await task('Generating package.json...', 'Generated package.json.', () =>
    writeFile(
      // Write our modified package.json template to our project folder
      join(projectFolder, 'package.json'),
      JSON.stringify(sortPackageJson(packageJson), null, 2).replaceAll(/\$npm_package_name/g, packageJson.name) + '\n', // \n required for prettier
    ),
  );

  await task('Initializing git repository...', null, async (ora) => {
    const { stdout } = await promisify(exec)('git init', { cwd: projectFolder });
    ora.succeed(stdout.replace(/\n$/, ''));
  });

  await task('Installing...', 'Installed dependencies.', () => promisify(exec)('npm i', { cwd: projectFolder }));

  // #endregion

  console.log('\nFinished generating project!');
}
