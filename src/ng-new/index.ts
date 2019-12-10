import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  externalSchematic,
  schematic
} from '@angular-devkit/schematics';

import { Schema as SchematicOptions } from './schema';
import { Schema as WorkspaceSchematicOption } from '../workspace/schema';


export default function(options: SchematicOptions): Rule {
  if (!options.directory) {
    options.directory = options.name;
  }
  return (host: Tree, context: SchematicContext) => {

    const { defaultCollection, tslint, pathMapping, commitlint, prettier, ...angularOptions } = options;

    const workspaceSchema: WorkspaceSchematicOption = {
      name: options.name,
      routing: options.routing,
      tslint,
      pathMapping,
      commitlint,
      prettier
    };

    return chain([
      externalSchematic('@schematics/angular', 'ng-new', angularOptions),
      schematic('nz-workspace', workspaceSchema, { scope: options.directory })
    ])(host, context);
  };
}
