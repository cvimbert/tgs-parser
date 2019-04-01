import { ParserConfiguration } from "./data-interfaces/parser-configuration.interface";
import { AssertionsGroupType } from "./enums/assertions-group-type.enum";

export class Configuration {

  // à affiner
  static LINE_BREAK = /\r|\n|\r\n|\n\r/;

  static mainConfiguration: ParserConfiguration = {
    comments: [
      {
        id: "commentedLine",
        expression: /\/\/.*?[\r\n]/g
      },
      {
        id: "commentedBlock",
        expression: /\/\*.*?\*\//g
      }
    ],
    dictionary: {
      mainFileStructure: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "conditions",
            reference: "conditionDeclaration",
            iterator: "*"
          },
          {
            id: "scripts",
            reference: "script",
            iterator: "*"
          },
          {
            id: "gameBlocks",
            reference: "gameBlock",
            iterator: "*"
          }
        ]
      },
      conditionDeclaration: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "conditionName",
            expression: /\?([A-Za-z0-9]+)\s*\{/,
            groups: ["name"]
          },
          {
            id: "condition",
            reference: "condition"
          },
          {
            id: "closer",
            expression: /\}/
          }
        ]
      },
      script: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "scriptOpener",
            expression: /@([A-Za-z0-9]*)/,
            groups: ["scriptId"]
          },
          {
            id: "commandsGroup",
            reference: "commandsGroup"
          }
        ]
      },
      instruction: {
        type: AssertionsGroupType.OR,
        assertions: [
          {
            id: "commandWithArgs",
            reference: "commandWithArgs"
          },
          {
            id: "if",
            reference: "if"
          },
          {
            id: "assignation",
            reference: "assignation"
          }
        ]
      },
      assignation: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "variable",
            reference: "variable"
          },
          {
            id: "operator",
            reference: "assignationOperator"
          },
          {
            id: "value",
            reference: "basicArgument",
            iterator: "?"
          },
          {
            id: "closer",
            expression: /;/
          }
        ]
      },
      assignationOperator: {
        type: AssertionsGroupType.OR,
        assertions: [
          {
            id: "equals",
            expression: /=/
          },
          {
            id: "equalsNoOverride",
            expression: /\(=\)/
          },
          {
            id: "increments",
            expression: /\+\+/
          },
          {
            id: "decrements",
            expression: /--/
          },
          {
            id: "adds",
            expression: /\+=/
          },
          {
            id: "deletes",
            expression: /-=/
          }
        ]
      },
      commandWithArgs: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "command",
            expression: /([A-Za-z0-9]+)/,
            groups: ["name"]
          },
          {
            id: "arguments",
            reference: "basicArgument",
            iterator: "*"
          },
          {
            id: "closer",
            expression: /;/
          }
        ]
      },
      if: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "opener",
            expression: /if\s*\(/
          },
          {
            id: "condition",
            reference: "condition"
          },
          {
            id: "closer",
            expression: /\)/
          },
          {
            id: "commandsGroup",
            reference: "commandsGroup"
          },
          {
            id: "else",
            reference: "else",
            iterator: "?"
          }
        ]
      },
      else: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "opener",
            expression: /else/
          },
          {
            id: "commandsGroup",
            reference: "commandsGroup"
          }
        ]
      },
      commandsGroup: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "opener",
            expression: /\{/
          },
          {
            id: "instructions",
            reference: "instruction",
            iterator: "*"
          },
          {
            id: "closer",
            expression: /\}/
          }
        ]
      },
      gameBlock: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "blockId",
            reference: "blockId"
          },
          {
            id: "scripts",
            reference: "script",
            iterator: "*"
          },
          {
            id: "blockLines",
            reference: "complexTextBlock",
            iterator: "*"
          },
          {
            id: "blockLinks",
            reference: "blockLink",
            iterator: "*"
          },
          {
            id: "directLink",
            reference: "directLink",
            iterator: "*"
          }/*,
          {
            id: "closer",
            expression: /###/
          }*/
        ]
      },
      blockId: {
        assertions: [
          {
            id: "blockId",
            expression: /\#([A-Za-z0-9]+)/,
            groups: ["id"]
          }
        ]
      },
      link: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "globalRef",
            expression: /([A-Za-z0-9/]+)/,
            groups: ["ref"],
            iterator: "?"
          },
          {
            id: "localRef",
            reference: "blockId",
            iterator: "?"
          }
        ]
      },
      elementTag: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "tagName",
            expression: /\<([A-Za-z0-9]+)/,
            groups: ["name"]
          },
          {
            id: "attributes",
            reference: "elementAttribute",
            iterator: "+"
          },
          {
            id: "closer",
            expression: /\>/
          }
        ]
      },
      elementAttribute: {
        assertions: [
          {
            id: "attribute",
            expression: /([A-Za-z0-9]+)="(.*?)"/,
            groups: ["attributeName", "attributeValue"]
          }
        ]
      },
      blockLine: {
        type: AssertionsGroupType.OR,
        assertions: [
          {
            id: "simpleBreak",
            expression: /[\r\n]\s*?[\r\n]/
          },
          {
            id: "doubleBreak",
            expression: /(?:[\r\n]\s*?)+[\r\n]/
          },
          {
            id: "blockline",
            // exp bizarre mais qui marche
            expression: /(?!#|\s*\*|\s*\]|\s*\>|\s*\r\n)(.*?)(?=[\n\r\[\]\<\>])/,
            groups: ["text"]
          }
        ]
      },
      condition: {
        type: AssertionsGroupType.OR,
        assertions: [
          {
            id: "booleanValue",
            reference: "booleanValue"
          },
          {
            id: "conditionName",
            expression: /([A-Za-z0-9]+)/,
            groups: ["conditionId"]
          }
        ]
      },
      booleanValue: {
        type: AssertionsGroupType.OR,
        assertions: [
          {
            id: "boolean",
            expression: /(true|false)/,
            groups: ["value"]
          },
          {
            id: "comparison",
            reference: "comparison"
          },
          {
            id: "variable",
            reference: "variable"
          }
        ]
      },
      variable: {
        assertions: [
          {
            id: "variableName",
            expression: /([A-Za-z0-9\.]+)/,
            groups: ["name"]
          }
        ]
      },
      comparisonMember: {
        type: AssertionsGroupType.OR,
        assertions: [
          {
            id: "boolean",
            reference: "booleanRawValue"
          },
          {
            id: "number",
            reference: "numberRawValue"
          },
          {
            id: "string",
            reference: "stringRawValue"
          },
          {
            id: "variable",
            reference: "variable"
          }
        ]
      },
      basicArgument: {
        type: AssertionsGroupType.OR,
        assertions: [
          {
            id: "boolean",
            reference: "booleanRawValue"
          },
          {
            id: "number",
            reference: "numberRawValue"
          },
          {
            id: "string",
            reference: "stringRawValue"
          },
          {
            id: "variable",
            reference: "variable"
          }
        ]
      },
      booleanRawValue: {
        assertions: [
          {
            id: "value",
            expression: /(true|false)/,
            groups: ["value"]
          }
        ]
      },
      numberRawValue: {
        assertions: [
          {
            id: "value",
            expression: /([0-9]+(?:\.[0-9]+)?)/,
            groups: ["value"]
          }
        ]
      },
      stringRawValue: {
        assertions: [
          {
            id: "value",
            expression: /"(.*?)"/,
            groups: ["value"]
          }
        ]
      },
      comparison: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "operand1",
            reference: "comparisonMember"
          },
          {
            id: "operator",
            reference: "comparisonOperator"
          },
          {
            id: "operand2",
            reference: "comparisonMember"
          }
        ]
      },
      comparisonOperator: {
        type: AssertionsGroupType.OR,
        assertions: [
          {
            id: "equalsTo",
            expression: /==/
          },
          {
            id: "differentOf",
            expression: /!=/
          },
          {
            id: "superiorTo",
            expression: /\>/
          },
          {
            id: "inferiorTo",
            expression: /\</
          },
          {
            id: "superiorOrEqualsTo",
            expression: /\>=/
          },
          {
            id: "inferiorOrEqualsTo",
            expression: /\<=/
          }
        ]
      },
      formats: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "opener",
            expression: /\</
          },
          {
            id: "formatsList",
            expression: /([A-Za-z0-9]+)/,
            groups: ["name"],
            iterator: "+"
          },
          {
            id: "closer",
            expression: /\>/
          }
        ]
      },
      conditionalBlock: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "opener",
            expression: /\[/
          },
          {
            id: "condition",
            reference: "conditionInParenthesis",
            iterator: "?"
          },
          {
            id: "format",
            reference: "formats",
            iterator: "?"
          },
          {
            id: "blocks",
            reference: "complexTextBlock",
            iterator: "*"
          },
          {
            id: "closer",
            expression: /\]/
          }
        ]
      },
      complexTextBlock: {
        type: AssertionsGroupType.OR,
        assertions: [
          {
            id: "conditionalBlock",
            reference: "conditionalBlock"
          },
          {
            id: "tag",
            reference: "elementTag"
          },
          {
            id: "simpleLine",
            reference: "blockLine"
          }
        ]
      },
      blockLink: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "opener",
            expression: /\*/
          },
          {
            id: "condition",
            reference: "conditionInParenthesis",
            iterator: "?"
          },
          {
            id: "simpleLinkText",
            expression: /(.*)\s*->/,
            groups: ["text"]
          },
          {
            id: "link",
            reference: "link"
          }
        ]
      },
      directLink: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "opener",
            expression: /\*/
          },
          {
            id: "condition",
            reference: "conditionInParenthesis",
            iterator: "?"
          },
          {
            id: "arrow",
            expression: /=>/
          },
          {
            id: "link",
            reference: "blockId",
            iterator: "?"
          }
        ]
      },
      conditionInParenthesis: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "opener",
            expression: /\(/
          },
          {
            id: "conditionBody",
            reference: "condition",
          },
          {
            id: "closer",
            expression: /\)/
          }
        ]
      },
      entry: {
        assertions: [
          {
            id: "start",
            reference: "script",
            iterator: "*"
          }
        ]
      }
    },
    entry: "mainFileStructure"
  }
}
