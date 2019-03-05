import { AssertionsGroup } from "./assertions-group.interface";
import { Assertion } from "./assertion.interface";

export interface ParserConfiguration {
  comments?: Assertion[]; // sûrement à changer
  dictionary: {[key: string]: AssertionsGroup};
  entry: string;
}
