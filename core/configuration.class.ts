import { ParserConfiguration } from "./data-interfaces/parser-configuration.interface";
import { AssertionsGroupType } from "./enums/assertions-group-type.enum";

export class Configuration {

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
            expression: /^\@([A-Za-z0-9-]+)\s*\{/,
            groups: ["scriptId"]
          },
          {
            id: "instructions",
            reference: "instruction",
            iterator: "*"
          },
          {
            id: "scriptCloser",
            expression: /^\s*\}/,
          }
        ]
      },
      instruction: {
        assertions: [
          {
            id: "simpleInstruction",
            expression: /[A-Za-z0-9-]+;/
          }
        ]
      },
      gameBlock: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "blockId", // si pas d'id, le nom de la réference est utilisé à la place
            reference: "blockId"
          },
          {
            id: "blockLines",
            reference: "blockLine",
            iterator: "*"
          },
          {
            id: "blockLinks",
            reference: "blockLink",
            iterator: "*"
          }
        ]
      },
      blockId: {
        assertions: [
          {
            id: "blockId",
            expression: /\#([A-Za-z0-9-]+)/,
            groups: ["id"]
          }
        ]
      },
      blockLine: {
        assertions: [
          {
            id: "simpleLine",
            expression: /^.*$/
          }
        ]
      },
      blockLink: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "simpleLinkText",
            expression: /\*(.*)\s*=>\s*/,
            groups: ["text"]
          },
          {
            id: "linkId",
            reference: "blockId"
          }
        ]
      }
    },
    entry: "blockId"
  }
}
