import { Tree } from '@angular-devkit/schematics';

/**
 * Sorts the keys of the given object.
 * @returns A new object instance with sorted keys
 */
function sortObjectByKeys(obj: object): object {
  return Object.keys(obj)
    .sort()
    .reduce((result, key) => {
      // @ts-ignore
      return (result[key] = obj[key]) && result;
    }, {});
}

/** Adds a package to the package.json in the given host tree. */
export function addPackageToPackageJson(host: Tree, pkg: string, version: string, dev = false): Tree {
  if (host.exists('package.json')) {
    const sourceText = host.read('package.json')!.toString('utf-8');
    const json = JSON.parse(sourceText);
    const dependenciesKey = dev ? 'devDependencies' : 'dependencies';
    if (!json[dependenciesKey]) {
      json[dependenciesKey] = {};
    }

    if (!json[dependenciesKey][pkg]) {
      json[dependenciesKey][pkg] = version;
      json[dependenciesKey] = sortObjectByKeys(json[dependenciesKey]);
    }

    host.overwrite('package.json', JSON.stringify(json, null, 2));
  }

  return host;
}

/** Gets the version of the specified package by looking at the package.json in the given tree. */
export function getPackageVersionFromPackageJson(tree: Tree, name: string): string | null {
  if (!tree.exists('package.json')) {
    return null;
  }

  const packageJson = JSON.parse(tree.read('package.json')!.toString('utf8'));

  if (packageJson.dependencies && packageJson.dependencies[name]) {
    return packageJson.dependencies[name];
  }

  return null;
}
