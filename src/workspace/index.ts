import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  noop,
  apply,
  mergeWith,
  url,
  applyTemplates,
  filter,
  MergeStrategy
} from '@angular-devkit/schematics';

import { Schema as SchematicOptions } from './schema';
import { strings } from '@angular-devkit/core';
import { addPackageToPackageJson } from '../utils/package-config';
import { experimental } from '@angular-devkit/core';
import { getWorkspace, getWorkspacePath } from '@schematics/angular/utility/config';

function addPackage(host: Tree, context: SchematicContext, options: SchematicOptions) {
  if (options.prettier) {
    addPackageToPackageJson(host, 'prettier', '^1.19.1', true);
  }
  if (options.commitlint) {
    addPackageToPackageJson(host, '@commitlint/cli', '^8.2.0', true);
    addPackageToPackageJson(host, '@commitlint/config-angular', '^8.2.0', true);
  }

  if (options.prettier || options.commitlint || options.tslint) {
    addPackageToPackageJson(host, 'husky', '^3.1.0');
    addPackageToPackageJson(host, 'lint-staged', '^8.2.1');
    addGitHookToPackageJson(host, context, options);
  }

  return host
}

function replacePackageJsonScript(host: Tree) {
  if (host.exists('package.json')) {
    const sourceText = host.read('package.json')!.toString('utf-8');
    const json = JSON.parse(sourceText);

    if (!json.scripts) {
      json.scripts = {};
    }

    json.scripts.build = 'ng build --prod';

    host.overwrite('package.json', JSON.stringify(json, null, 2) + '\n');
  }

  return host;
}

function addGitHookToPackageJson(host: Tree, context: SchematicContext, options: SchematicOptions) {
  if (host.exists('package.json')) {
    const sourceText = host.read('package.json')!.toString('utf-8');
    const json = JSON.parse(sourceText);

    if (!json['lint-staged']) {
      json['lint-staged'] = {};
    }

    if (!json.husky) {
      json.husky = {};
    }

    if (!json.husky.hooks) {
      json.husky.hooks = {};
    }

    if (options.prettier) {
      json['lint-staged']['src/**/*.{ts,js,json,html,less,css,scss}'] = [
        "./node_modules/.bin/prettier --write",
        "git add"
      ];
    }
    if (options.tslint) {
      json['lint-staged']['src/**/*.ts'] = [
        "./node_modules/.bin/tslint --project tsconfig.app.json --fix",
        "git add"
      ];
    }

    json.husky.hooks['pre-commit'] = 'lint-staged';

    if (options.commitlint) {
      json.husky.hooks['commit-msg'] = 'commitlint -E HUSKY_GIT_PARAMS';

    }

    host.overwrite('package.json', JSON.stringify(json, null, 2) + '\n');
  }

  return host;
}

function setPathMapping(host: Tree, context: SchematicContext, options: SchematicOptions) {
  if (!options.pathMapping) {
    return host
  }
  const namespace = options.name;

  if (host.exists('tsconfig.json')) {
    const sourceText = host.read('tsconfig.json')!.toString('utf-8');
    const json = JSON.parse(sourceText);

    if (!json.compilerOptions) {
      json.compilerOptions = {};
    }

    if (!json.compilerOptions.paths) {
      json.compilerOptions.paths = {};
    }

    json.compilerOptions.paths[`@${namespace}/*`] = [
      "./src/app/*",
      "./src/environments/*"
    ];

    host.overwrite('tsconfig.json', JSON.stringify(json, null, 2) + '\n');
  }

  return host;
}

type WorkspaceSchema = experimental.workspace.WorkspaceSchema;

function updateWorkspace(host: Tree, key: keyof WorkspaceSchema, value: any) {
  const workspace = getWorkspace(host);
  const path = getWorkspacePath(host);
  (workspace[key] as any) = value;
  host.overwrite(path, JSON.stringify(workspace, null, 2));
}

function setAsDefaultSchematics() {
  const cli = {
    defaultCollection: '@ng-zorro/schematics',
  };
  return (host: Tree) => {
    updateWorkspace(host, 'cli', cli);
    return host;
  };
}


export default function (options: SchematicOptions): Rule {

  return chain([
    mergeWith(
      apply(
        url('./files'),
        [
          options.prettier ? noop() : filter(path => !path.endsWith('prettierignore.template')),
          options.prettier ? noop() : filter(path => !path.endsWith('prettierrc.template')),
          options.commitlint ? noop() : filter(path => !path.endsWith('commitlint.config.js.template')),
          options.tslint ? noop() : filter(path => !path.endsWith('tslint.json.template')),
          applyTemplates({
            utils: strings,
            ...options,
            'dot': '.'
          })
        ]
      ),
      MergeStrategy.Overwrite
    ),
    (host: Tree, context: SchematicContext) => addPackage(host, context, options),
    (host: Tree, context: SchematicContext) => setPathMapping(host, context, options),
    (host: Tree) => replacePackageJsonScript(host),
    setAsDefaultSchematics()
  ]);
}
