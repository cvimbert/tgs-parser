import { ParserConfiguration } from "./data-interfaces/parser-configuration.interface";
import { AssertionsGroupType } from "./enums/assertions-group-type.enum";
import { ScriptElements } from "./language-elements/script-elements.class";

export class Configuration {

  yo = ScriptElements.test;

  static mainConfiguration: ParserConfiguration = {
    comments: [
      {
        id: "commentedLine",
        expression: /\/\/(.*)$/,
        groups: ["text"]
      },
      {
        id: "commentedBlock",
        expression: /\/\*(.*)\*\//,
        groups: ["text"]
      }
    ],
    dictionary: {
      mainFileStructure: {
        type: AssertionsGroupType.AND,
        assertions: [
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
      script: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "scriptOpener",
            expression: /@([A-Za-z0-9]+)\s*\{/,
            groups: ["scriptId"]
          },
          {
            id: "instructions",
            reference: "instruction",
            iterator: "*"
          },
          {
            id: "scriptCloser",
            expression: /\}/,
          }
        ]
      },
      instruction: {
        assertions: [
          {
            id: "simpleInstruction",
            expression: /[A-Za-z0-9]+;/
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
            id: "closer",
            expression: /###/
          }
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
            reference: "blockId"
          }
        ]
      },
      blockLine: {
        type: AssertionsGroupType.OR,
        assertions: [
          {
            id: "blockline",
            // temp
            expression: /(?!###|\s*\*|\s*\])[\t ]*(.*)\n/,
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
            expression: /"([A-Za-z0-9]*)"/,
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
      conditionalBlock: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "opener",
            expression: /\[\(/
          },
          {
            id: "condition",
            reference: "condition"
          },
          {
            id: "conditionCloser",
            expression: /\)/
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
            id: "simpleLine",
            reference: "blockLine"
          }
        ]
      },
      blockLink: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "simpleLinkText",
            expression: /\*\s*(.*)\s*=>\s*/,
            groups: ["text"]
          },
          {
            id: "link",
            reference: "link"
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
