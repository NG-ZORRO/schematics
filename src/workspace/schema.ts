export interface Schema {
  name: string;
  tslint: boolean;
  pathMapping: boolean;
  commitlint: boolean;
  prettier: boolean;
  routing?: boolean;
}
