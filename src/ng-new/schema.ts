import { Schema as WorkspaceSchema } from '../workspace/schema'

export interface Schema extends AngularSchema, WorkspaceSchema {
  defaultCollection: boolean;
}

export interface AngularSchema {
  /** The directory name to create the workspace in. */
  directory: string;
  /** The name of the workspace. */
  name: string;
  /** Skip installing dependency packages. */
  skipInstall?: boolean;
  /** Link CLI to global version (internal development only). */
  linkCli?: boolean;
  /** Skip initializing a git repository. */
  skipGit?: boolean;
  /** Initial repository commit information. */
  commit?: { name: string, email: string, message?: string } | boolean;
  /** The path where new projects will be created. */
  newProjectRoot?: string;
  /** The version of the Angular CLI to use. */
  version?: string;
  /** Specifies if the style will be in the ts file. */
  inlineStyle?: boolean;
  /** Specifies if the template will be in the ts file. */
  inlineTemplate?: boolean;
  /** Specifies the view encapsulation strategy. */
  viewEncapsulation?: ('Emulated' | 'Native' | 'None');
  /** Generates a routing module. */
  routing?: boolean;
  /** The prefix to apply to generated selectors. */
  prefix?: string;
  /** The file extension to be used for style files. */
  style?: string;
  /** Skip creating spec files. */
  skipTests?: boolean;
  /** Specify serverless provider. */
  provider: ('aws' | 'gcloud' | 'firebase');
  /** Google Analytics tracking code. */
  gaTrackingCode?: string;
  /** Firebug lite. */
  firebug: boolean;
  /** Firebase project id */
  firebaseProject: string;
  /** The name of the project (internal). */
  clientProject?: string;
  packageManager: 'npm' | 'pnpm' | 'cnpm' | 'yarn'
}
