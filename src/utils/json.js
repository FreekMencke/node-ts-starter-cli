import merge from 'lodash.merge';
import { readTemplate } from './template.js';

export async function mergePackageJson(packageJson, templatePath) {
  const templatePackageJson = JSON.parse(await readTemplate(templatePath));
  return merge(packageJson, templatePackageJson);
}
