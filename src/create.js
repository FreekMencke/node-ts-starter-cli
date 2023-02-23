import { exec } from 'child_process';
import { mkdir, writeFile } from 'fs/promises';
import merge from 'lodash.merge';
import ora from 'ora';
import { dirname, join, resolve } from 'path';
import sortPackageJson from 'sort-package-json';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import { copyTemplate } from './utils/copy.js';
import { importJSON } from './utils/json.js';

export async function createProject(argv) {
  const templateFolder = join(dirname(fileURLToPath(import.meta.url)), '../templates');
  const projectFolder = resolve(process.cwd(), argv.name);

  console.log(`\nGenerating new project with name "${argv.name}"...\n`);
  const spinner = ora();

  // Create folder for project
  spinner.start('Creating folder...');
  await mkdir(projectFolder);
  spinner.succeed('Created folder.');

  // Copy project base to folder
  spinner.start('Generating root files...');
  await copyTemplate(templateFolder, 'base', projectFolder);
  spinner.succeed('Generated root files.');

  // load package.json template, and modify it as we go.
  let packageJson = {
    ...(await importJSON(new URL('../templates/template-package.json', import.meta.url))),
    name: argv.name,
  };

  // copy build and source files
  spinner.start('Generating project files...');

  const buildSrcTemplate = (() => {
    if (argv.minimal) return 'minimal';
    if (argv.maximal || argv.environments) return 'environments';
    return 'default';
  })();

  await Promise.all([
    await copyTemplate(templateFolder, `build/${buildSrcTemplate}`, join(projectFolder, 'build')),
    await copyTemplate(templateFolder, `src/${buildSrcTemplate}`, join(projectFolder, 'src')),
  ]);
  spinner.succeed('Generated project files');

  // copy linting files & template-package.json
  if (argv.maximal || argv.eslint) {
    spinner.start('Adding linting...');

    await copyTemplate(
      templateFolder,
      argv.maximal || argv.prettier ? 'eslint/prettier' : 'eslint/default',
      projectFolder,
    );

    packageJson = merge(
      packageJson,
      await importJSON(
        new URL(
          `../templates/eslint/${argv.maximal || argv.prettier ? 'prettier-' : ''}template-package.json`,
          import.meta.url,
        ),
      ),
    );
    spinner.succeed('Added linting.');
  }

  // copy linting files & template-package.json
  if (argv.maximal || argv.prettier) {
    spinner.start('Adding prettier...');

    await copyTemplate(templateFolder, 'prettier/default', projectFolder);

    packageJson = merge(
      packageJson,
      await importJSON(new URL('../templates/prettier/template-package.json', import.meta.url)),
    );
    spinner.succeed('Added prettier.');
  }

  // copy docker files && template-package.json
  if (argv.maximal || argv.docker) {
    spinner.start('Adding Docker...');

    if (argv.maximal || (argv.eslint && argv.prettier))
      await copyTemplate(templateFolder, 'docker/prettier-eslint', projectFolder);
    else if (argv.eslint) await copyTemplate(templateFolder, 'docker/eslint', projectFolder);
    else if (argv.prettier) await copyTemplate(templateFolder, 'docker/prettier', projectFolder);
    else await copyTemplate(templateFolder, 'docker/default', projectFolder);

    packageJson = merge(
      packageJson,
      await importJSON(new URL('../templates/docker/template-package.json', import.meta.url)),
    );
    spinner.succeed('Added Docker.');
  }

  // copy github-action files
  if (argv.maximal || argv.githubAction) {
    spinner.start('Adding github-action...');

    if (argv.maximal || (argv.eslint && argv.prettier))
      await copyTemplate(templateFolder, 'docker/prettier-eslint', projectFolder);
    else if (argv.eslint) await copyTemplate(templateFolder, 'docker/eslint', projectFolder);
    else if (argv.prettier) await copyTemplate(templateFolder, 'docker/prettier', projectFolder);

    const githubActionTemplate = (() => {
      if (argv.maximal || argv.docker) return 'docker';
      if (argv.eslint && argv.prettier) return 'prettier-eslint';
      if (argv.eslint) return 'eslint';
      if (argv.prettier) return 'prettier';
      return 'default';
    })();

    await copyTemplate(
      templateFolder,
      `github-action/${githubActionTemplate}`,
      join(projectFolder, '.github/workflows'),
    );
    spinner.succeed('Added github-action.');
  }

  // copy commitizen template-package.json
  if (argv.maximal || argv.commitizen) {
    spinner.start('Adding commitizen...');

    packageJson = merge(
      packageJson,
      await importJSON(new URL('../templates/commitizen/template-package.json', import.meta.url)),
    );
    spinner.succeed('Added commitizen.');
  }

  // Write our modified package.json template to our project folder
  spinner.start('Generating package.json...');

  await writeFile(
    join(projectFolder, 'package.json'),
    JSON.stringify(sortPackageJson(packageJson), null, 2).replaceAll(/\$npm_package_name/g, packageJson.name),
  );
  spinner.succeed('Generated package.json');

  // initialize git repo
  spinner.start('Initializing git repository...');
  const { stdout } = await promisify(exec)('git init', { cwd: projectFolder });
  spinner.succeed(stdout.replace(/\n$/, ''));

  // finally do an `npm i`
  spinner.start('Installing...');
  await promisify(exec)('npm i', { cwd: projectFolder });
  spinner.succeed('Installed dependencies.');

  console.log('\nFinished generating project!');
}
