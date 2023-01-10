const { exec } = require('child_process');
const { exists } = require('fs-extra');
const { copy } = require('fs-extra');
const { mkdir, rm, writeFile } = require('fs/promises');
const path = require('path');
const { cwd } = require('process');
const { promisify } = require('util');
const merge = require('lodash.merge');

module.exports = async function createProject(argv) {
  const packageFolder = path.join(__dirname, '..');
  const projectFolder = path.join(cwd(), argv.name);

  // Create folder for project
  await mkdir(projectFolder);

  // Copy project base to folder
  await copy(path.join(packageFolder, 'templates/base'), projectFolder);

  // load package.json template, and modify it as we go.
  let packageJson = {
    ...require(path.join(packageFolder, 'templates/package.json')),
    name: argv.name,
  };

  // copy build and source files
  console.log('Generating project base...');
  if (argv.minimal) {
    await copy(path.join(packageFolder, 'templates/build/minimal'), path.join(projectFolder, 'build'));
    await copy(path.join(packageFolder, 'templates/src/minimal'), path.join(projectFolder, 'src'));
  } else if (argv.maximal || argv.environments) {
    console.log('Adding environment feature...');
    await copy(path.join(packageFolder, 'templates/build/environments'), path.join(projectFolder, 'build'));
    await copy(path.join(packageFolder, 'templates/src/environments'), path.join(projectFolder, 'src'));
  } else {
    await copy(path.join(packageFolder, 'templates/build/default'), path.join(projectFolder, 'build'));
    await copy(path.join(packageFolder, 'templates/src/default'), path.join(projectFolder, 'src'));
  }

  // copy linting files & package.json
  if (argv.maximal || argv.eslint) {
    console.log('Adding linting feature...');
    await copy(path.join(packageFolder, 'templates/eslint/default'), projectFolder);
    packageJson = merge(packageJson, require(path.join(packageFolder, 'templates/eslint/package.json')));
  }

  // copy docker files && package.json
  if (argv.maximal || argv.docker) {
    console.log('Adding docker feature...');
    if (argv.maximal || argv.eslint) {
      await copy(path.join(packageFolder, 'templates/docker/eslint'), projectFolder);
    } else {
      await copy(path.join(packageFolder, 'templates/docker/default'), projectFolder);
    }
    packageJson = merge(packageJson, require(path.join(packageFolder, 'templates/docker/package.json')));
  }

  // copy github-action files && package.json
  if (argv.maximal || argv.githubAction) {
    console.log('Adding github-action feature...');
    if (argv.maximal || argv.docker) {
      await copy(path.join(packageFolder, 'templates/github-action/docker'), path.join(projectFolder, '.github/workflows'));
    } else if (argv.eslint)  {
      await copy(path.join(packageFolder, 'templates/github-action/eslint'), path.join(projectFolder, '.github/workflows'));
    } else {
      await copy(path.join(packageFolder, 'templates/github-action/default'), path.join(projectFolder, '.github/workflows'));
    }
  }

  // copy cz package.json
  if (argv.maximal || argv.commitizen) {
    console.log('Adding commitizen feature...');
    packageJson = merge(packageJson, require(path.join(packageFolder, 'templates/commitizen/package.json')));
  }

  // final step is to write our modified package.json template to our project folder, and do an install.
  writeFile(path.join(projectFolder, 'package.json'), JSON.stringify(packageJson, null, 2).replaceAll(/\$npm_package_name/g, packageJson.name));

  try {
    console.log('Installing packages...');
    // by removing a fake package, npm sorts the dependencies and devDependencies alphabetically.
    await promisify(exec)('npm remove -S example; npm remove -D example', { cwd: projectFolder });

    const { stdout, stderr } = await promisify(exec)('npm i', { cwd: projectFolder });
    console.log(stdout);
    console.log(stderr);
  } catch (e) {
    console.error(e);
  }
};
