export interface Schema {
  name: string;
  defaultCollection: boolean;
  tslint: boolean;
  pathMapping: boolean;
  commitlint: boolean;
  prettier: boolean;
  minimal?: boolean;
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
}
