import { Schema as WorkspaceSchema } from '../workspace/schema'

export interface Schema extends AngularSchema, WorkspaceSchema {
  defaultCollection: boolean;
}

export interface AngularSchema {
  minimal?: boolean;
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
