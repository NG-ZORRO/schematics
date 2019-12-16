import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  externalSchematic,
  schematic,
  mergeWith,
  apply,
  empty
} from '@angular-devkit/schematics';

import { Schema as SchematicOptions } from './schema';
import { Schema as WorkspaceSchematicOption } from '../workspace/schema';
import { validateProjectName } from '@schematics/angular/utility/validation';
import {
  NodePackageInstallTask,
  NodePackageLinkTask,
  RepositoryInitializerTask
} from '@angular-devkit/schematics/tasks';


export default function(options: SchematicOptions): Rule {
  if (!options.directory) {
    options.directory = options.name;
  }

  validateProjectName(options.directory);

  return (host: Tree, context: SchematicContext) => {

    const { defaultCollection, tslint, pathMapping, commitlint, prettier, ...angularOptions } = options;

    const workspaceSchema: WorkspaceSchematicOption = {
      tslint,
      pathMapping,
      commitlint,
      prettier,
      defaultCollection,
      ...angularOptions
    };

    return chain([
      mergeWith(
        apply(empty(), [
          externalSchematic('@schematics/angular', 'ng-new', {
            ...angularOptions,
            skipInstall: true,
            skipGit: true,
            linkCli: false
          }, {
            interactive: false
          }),
          schematic('nz-workspace', workspaceSchema, { scope: options.directory })
        ]),
      ),
      (host: Tree, context: SchematicContext) => {
        let packageTask;
        if (!options.skipGit) {
          const commit = typeof options.commit == 'object'
            ? options.commit
            : (!!options.commit ? {} : false);

          packageTask = context.addTask(
            new RepositoryInitializerTask(
              options.directory,
              commit,
            )
          );
        }
        if (!options.skipInstall) {
          packageTask = context.addTask(
            new NodePackageInstallTask({
              workingDirectory: options.directory,
              packageManager: options.packageManager,
            }),
            packageTask ? [packageTask] : []
          );
          if (options.linkCli) {
            context.addTask(
              new NodePackageLinkTask('@angular/cli', options.directory),
              [packageTask],
            );
          }
        }
      }
    ])(host, context);
  };
}
