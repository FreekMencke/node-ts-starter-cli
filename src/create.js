import { exec } from 'child_process';
import { mkdir, writeFile } from 'fs/promises';
import { join, resolve } from 'path';
import sortPackageJson from 'sort-package-json';
import { promisify } from 'util';
import { mergePackageJson } from './utils/json.js';
import { task } from './utils/task.js';
import { copyTemplate, readTemplate } from './utils/template.js';

export async function createProject(argv) {
  const projectFolder = resolve(process.cwd(), argv.name);

  console.log(`\nGenerating new project with name "${argv.name}"...\n`);

  // #region Preparing project folder

  await task('Creating folder...', 'Created folder.', () => mkdir(projectFolder));
  await task('Generating root files...', 'Generated root files.', () => copyTemplate('base', projectFolder));

  // Copy gitingore from template, because .npmignore removes it otherwise
  await writeFile(join(projectFolder, '.gitignore'), await readTemplate('template.gitignore'));

  // load the base package.json template, and modify it as we go.
  let packageJson = { ...JSON.parse(await readTemplate('package.json')), name: argv.name };

  await task('Generating project files...', 'Generated project files.', async () => {
    const buildSrcTemplate = (() => {
      if (argv.minimal) return 'minimal';
      if (argv.maximal || argv.environments) return 'environments';
      return 'default';
    })();

    return Promise.all([
      copyTemplate(`build/${buildSrcTemplate}`, join(projectFolder, 'build')),
      copyTemplate(`src/${buildSrcTemplate}`, join(projectFolder, 'src')),
    ]);
  });

  // #endregion

  // #region Adding optional features

  if (argv.maximal || argv.eslint) {
    await task('Adding linting...', 'Added linting.', async () => {
      const eslintTemplate = argv.maximal || argv.prettier ? 'prettier' : 'default';

      await copyTemplate(`eslint/${eslintTemplate}`, projectFolder);

      packageJson = await mergePackageJson(packageJson, `eslint/${eslintTemplate}/package.json`);
    });
  }

  if (argv.maximal || argv.prettier) {
    await task('Adding prettier...', 'Added prettier.', async () => {
      await copyTemplate('prettier/default', projectFolder);

      packageJson = await mergePackageJson(packageJson, 'prettier/default/package.json');
    });
  }

  if (argv.maximal || argv.docker) {
    await task('Adding Docker...', 'Added Docker.', async () => {
      const dockerTemplate = (() => {
        if (argv.maximal || (argv.eslint && argv.prettier)) return 'docker/prettier-eslint';
        if (argv.eslint) return 'docker/eslint';
        if (argv.prettier) return 'docker/prettier';
        return 'docker/default';
      })();

      await copyTemplate(dockerTemplate, projectFolder);

      packageJson = await mergePackageJson(packageJson, 'docker/default/package.json');
    });
  }

  if (argv.maximal || argv.githubAction) {
    await task('Adding github-action...', 'Added github-action.', () => {
      const githubActionTemplate = (() => {
        if (argv.maximal || argv.docker) return 'docker';
        if (argv.eslint && argv.prettier) return 'prettier-eslint';
        if (argv.eslint) return 'eslint';
        if (argv.prettier) return 'prettier';
        return 'default';
      })();

      return copyTemplate(`github-action/${githubActionTemplate}`, projectFolder);
    });
  }

  if (argv.maximal || argv.commitizen) {
    await task('Adding commitizen...', 'Added commitizen.', async () => {
      packageJson = await mergePackageJson(packageJson, 'commitizen/package.json');
    });
  }

  // #endregion

  // #region finalizing project folder and installing dependencies

  await task('Generating package.json...', 'Generated package.json.', () => {
    // Sort and stringify final package.json and add a newline at the end to comply with prettier validation
    let packageJsonString = JSON.stringify(sortPackageJson(packageJson), null, 2) + '\n';
    // Replace the template variable `$npm_package_name` with the actual name of the project
    packageJsonString = packageJsonString.replaceAll(/\$npm_package_name/g, packageJson.name);

    return writeFile(join(projectFolder, 'package.json'), packageJsonString);
  });

  await task('Initializing git repository...', null, async (ora) => {
    const { stdout } = await promisify(exec)('git init', { cwd: projectFolder });
    ora.succeed(stdout.replace(/\n$/, ''));
  });

  await task('Installing...', 'Installed dependencies.', () => promisify(exec)('npm i', { cwd: projectFolder }));

  // #endregion

  console.log('\nFinished generating project!');
}
