export interface Assertion {
  id?: string;
  expression?: RegExp;
  groups?: string[];
  reference?: string;
  iterator?: string;
  stripStartSpaces?: boolean;
}
