import { AssertionsGroupType } from "../enums/assertions-group-type.enum";
import { Assertion } from "./assertion.interface";

export interface AssertionsGroup {
  type?: AssertionsGroupType;
  assertions: Assertion[];
}
