import { ParserConfiguration } from "./data-interfaces/parser-configuration.interface";
import { AssertionsGroupType } from "./enums/assertions-group-type.enum";

export class Configuration {

  static mainConfiguration: ParserConfiguration = {
    comments: [
      {
        id: "commentedLine",
        expression: /(?:\/\/.*?(?:\r?\n|\r))*/
      },
      {
        id: "commentedBlock",
        expression: /(?:\/\*.*?\*\/)*/
      }
    ],
    dictionary: {
      mainFileStructure: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "items",
            reference: "structureElement",
            iterator: "*"
          }
        ]
      },
      structureElement: {
        type: AssertionsGroupType.OR,
        assertions: [
          {
            id: "condition",
            reference: "conditionDeclaration",
          },
          {
            id: "script",
            reference: "script",
          },
          {
            id: "gameBlock",
            reference: "gameBlock",
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
            reference: "conditionMember"
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
            id: "function",
            reference: "functionInstruction"
          },
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
      functionInstruction: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "functionBody",
            reference: "functionCall"
          },
          {
            id: "closer",
            expression: /;/
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
      functionCall: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "functionName",
            expression: /([A-Za-z0-9]+)/,
            groups: ["name"]
          },
          {
            id: "leftParenthesis",
            expression: /\(/
          },
          {
            id: "arguments",
            reference: "argumentListElement",
            iterator: "*"
          },
          {
            id: "rightParenthesis",
            expression: /\)/
          }
        ]
      },
      argumentListElement: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "argument",
            reference: "basicArgument"
          },
          {
            id: "separator",
            expression: /,/,
            iterator: "?"
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
            reference: "conditionMember"
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
            id: "modifiers",
            reference: "blockModifier",
            iterator: "*"
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
            id: "linkItems",
            reference: "linkItem",
            iterator: "*"
          }
        ]
      },
      linkItem: {
        type: AssertionsGroupType.OR,
        assertions: [
          {
            id: "directLink",
            reference: "directLink",
          },
          {
            id: "blockLink",
            reference: "blockLink",
          }
        ]
      },
      blockModifier: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "modifierName",
            expression: /([A-Za-z]+):/,
            groups: ["name"]
          },
          {
            id: "blockId",
            reference: "blockId",
            iterator: "+"
          }
        ]
      },
      nestedGameBlock: {
        type: AssertionsGroupType.AND,
        assertions: [
          /*{
            id: "opener",
            expression: /##/
          },*/
          {
            id: "blockId",
            reference: "nestedBlockId"
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
          },
          {
            id: "closer",
            expression: /##/
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
      blockIdEOL: {
        assertions: [
          {
            id: "blockId",
            expression: /\#([A-Za-z0-9]+)[\n\r]/,
            groups: ["id"]
          }
        ]
      },
      nestedBlockId: {
        assertions: [
          {
            id: "blockId",
            expression: /\#\#([A-Za-z0-9]+)/,
            groups: ["id"]
          }
        ]
      },
      slink: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "ref",
            expression: /([A-Za-z0-9-/]+)?(?:#([A-Za-z0-9-]+))?/,
            groups: ["globalRef", "localRef"]
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
            id: "doubleBreak",
            expression: /[\r|\n|\n\r](?:[^\n]\s*?)[\r|\n|\n\r]/
          },
          {
            id: "blockline",
            // exp bizarre mais qui marche
            reference: "blockLine2"
          }
        ]
      },
      // nom temporaire
      blockLine2: {
        type: AssertionsGroupType.AND,
        assertions: [
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
            id: "blockline",
            expression: /(?!#|\s*\*|\s*\]|\s*\>|\s*\r\n)(.*?)(?=[\n\r\[\]\<\>])/,
            groups: ["text"]
          }
        ]
      },
      conditionLogicalExpression: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "operand1",
            reference: "conditionGroup"
          },
          {
            id: "operator",
            reference: "logicalOperator"
          },
          {
            id: "operand2",
            reference: "conditionMember"
          }
        ]
      },
      conditionMember: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "negated",
            expression: /!/,
            iterator: "?"
          },
          {
            id: "element",
            reference: "conditionMemberElement"
          }
        ]
      },
      conditionMemberElement: {
        type: AssertionsGroupType.OR,
        assertions: [
          {
            id: "expressionInParenthesis",
            reference: "conditionLogicalExpressionInParenthesis"
          },
          {
            id: "expression",
            reference: "conditionLogicalExpression"
          },
          {
            id: "conditionGroup",
            reference: "conditionGroup"
          }
        ]
      },
      conditionLogicalExpressionInParenthesis: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "opener",
            expression: /\(/
          },
          {
            id: "expression",
            reference: "conditionLogicalExpression",
          },
          {
            id: "closer",
            expression: /\)/
          }
        ]
      },
      logicalOperator: {
        type: AssertionsGroupType.OR,
        assertions: [
          {
            id: "and",
            expression: /&&/
          },
          {
            id: "or",
            expression: /\|\|/
          }
        ]
      },
      conditionGroup: {
        type: AssertionsGroupType.OR,
        assertions: [
          {
            id: "block",
            reference: "blockId"
          },
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
            id: "function",
            reference: "functionCall"
          },
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
            id: "superiorOrEqualsTo",
            expression: /\>=/
          },
          {
            id: "inferiorOrEqualsTo",
            expression: /\<=/
          },
          {
            id: "superiorTo",
            expression: /\>/
          },
          {
            id: "inferiorTo",
            expression: /\</
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
            id: "scripts",
            reference: "script",
            iterator: "*"
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
      // A implémenter
      conditionalBlockModifierItem: {
        type: AssertionsGroupType.OR,
        assertions: [
          {
            id: "condition",
            reference: "conditionInParenthesis",
          },
          {
            id: "condition",
            reference: "conditionInParenthesis",
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
            id: "modifiers",
            reference: "linkModifierItem",
            iterator: "*"
          },
          {
            id: "simpleLinkText",
            expression: /(.*?)\s*->/,
            groups: ["text"]
          },
          {
            id: "link",
            reference: "slink",
            iterator: "?"
          },
          {
            id: "nestedBlock",
            reference: "nestedGameBlock",
            iterator: "?"
          }
        ]
      },
      linkModifierItem: {
        type: AssertionsGroupType.OR,
        assertions: [
          {
            id: "linkDirective",
            reference: "linkDirectives",
          },
          {
            id: "condition",
            reference: "conditionInParenthesis",
          }
        ]
      },
      linkDirectives: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "opener",
            expression: /\[/
          },
          {
            id: "directives",
            reference: "linkDirective",
            iterator: "+"
          },
          {
            id: "closer",
            expression: /\]/
          }
        ]
      },
      linkDirective: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "directive",
            reference: "linkDirectiveItem"
          },
          {
            id: "separator",
            expression: /,/,
            iterator: "?"
          }
        ]
      },
      linkDirectiveItem: {
        type: AssertionsGroupType.OR,
        assertions: [
          {
            id: "function",
            reference: "functionCall"
          },
          {
            id: "basic",
            expression: /([A-Za-z0-9]+)/,
            groups: ["name"]
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
            expression: /\(\?/
          },
          {
            id: "conditionBody",
            reference: "conditionMember",
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
