import { exec } from 'child_process';
import { copy } from 'fs-extra';
import { mkdir, readFile, writeFile } from 'fs/promises';
import merge from 'lodash.merge';
import ora from 'ora';
import path, { dirname } from 'path';
import sortPackageJson from 'sort-package-json';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

async function importJSON(path) {
  // eslint-disable-next-line
  return JSON.parse(await readFile(new URL(path, import.meta.url)));
}

export async function createProject(argv) {
  const packageFolder = path.join(dirname(fileURLToPath(import.meta.url)), '..');
  const projectFolder = path.join(process.cwd(), argv.name);

  console.log(`\nGenerating new project with name "${argv.name}"...\n`);
  const spinner = ora({ stream: process.stdout });

  // Create folder for project
  spinner.start('Creating folder...');
  await mkdir(projectFolder);
  spinner.succeed('Created folder.')

  // Copy project base to folder
  spinner.start('Generating root files...');
  await copy(path.join(packageFolder, 'templates/base'), projectFolder);
  spinner.succeed('Generated root files.')

  // load package.json template, and modify it as we go.
  let packageJson = {
    ...await importJSON('../templates/package.json'),
    name: argv.name,
  };

  // copy build and source files
  spinner.start('Generating project files...');
  const buildSrcTemplate = (() => {
    if (argv.minimal) return 'minimal';
    if (argv.maximal || argv.environments) return 'environments';
    return 'default';
  })();
  await copy(path.join(packageFolder, `templates/build/${buildSrcTemplate}`), path.join(projectFolder, 'build'));
  await copy(path.join(packageFolder, `templates/src/${buildSrcTemplate}`), path.join(projectFolder, 'src'));
  spinner.succeed('Generated project files')

  // copy linting files & package.json
  if (argv.maximal || argv.eslint) {
    spinner.start('Adding linting...');
    await copy(path.join(packageFolder, 'templates/eslint/default'), projectFolder);
    packageJson = merge(packageJson, await importJSON('../templates/eslint/package.json'));
    spinner.succeed('Added linting.')
  }

  // copy docker files && package.json
  if (argv.maximal || argv.docker) {
    spinner.start('Adding Docker...');
    if (argv.maximal || argv.eslint) {
      await copy(path.join(packageFolder, 'templates/docker/eslint'), projectFolder);
    } else {
      await copy(path.join(packageFolder, 'templates/docker/default'), projectFolder);
    }
    packageJson = merge(packageJson, await importJSON('../templates/docker/package.json'));
    spinner.succeed('Added Docker.')
  }

  // copy github-action files && package.json
  if (argv.maximal || argv.githubAction) {
    spinner.start('Adding github-action...');
    const githubActionTemplate = (() => {
      if (argv.maximal || argv.docker) return 'docker';
      if (argv.eslint) return 'eslint';
      return 'default';
    })();
    await copy(path.join(packageFolder, `templates/github-action/${githubActionTemplate}`), path.join(projectFolder, '.github/workflows'));
    spinner.succeed('Added github-action.')
  }

  // copy cz package.json
  if (argv.maximal || argv.commitizen) {
    spinner.start('Adding commitizen...');
    packageJson = merge(packageJson, await importJSON('../templates/commitizen/package.json'));
    spinner.succeed('Added commitizen.')
  }

  // Write our modified package.json template to our project folder
  spinner.start('Generating package.json...');
  await writeFile(
    path.join(projectFolder, 'package.json'),
    JSON.stringify(sortPackageJson(packageJson), null, 2).replaceAll(/\$npm_package_name/g, packageJson.name),
  );
  spinner.succeed('Generated package.json')

  // initialize git repo
  spinner.start('Initializing git repository...');
  const { stdout } = await promisify(exec)('git init', { cwd: projectFolder })
  spinner.succeed(stdout.replace(/\n$/, ''));

  // finally do an `npm i`
  spinner.start('Installing...');
  await promisify(exec)('npm i', { cwd: projectFolder });
  spinner.succeed('Installed dependencies.');

  console.log('\nFinished generating project!');
};
