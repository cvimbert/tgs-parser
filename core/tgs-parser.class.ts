import { ParsingResult } from "./parsing-result.class";
import { ParserConfiguration } from "./data-interfaces/parser-configuration.interface";
import { Configuration } from "./configuration.class";
import { AssertionsGroup } from "./data-interfaces/assertions-group.interface";
import { AssertionsGroupType } from "./enums/assertions-group-type.enum";
import { Assertion } from "./data-interfaces/assertion.interface";

export class TGSParser {

  private configuration: ParserConfiguration = Configuration.mainConfiguration;

  constructor() {

  }

  loadTGSFile(filePath: string): Promise<ParsingResult> {

    return new Promise<ParsingResult>((resolve: Function, reject: Function) => {
      let req: XMLHttpRequest = new XMLHttpRequest();
      req.open("GET", filePath);
      req.send();

      req.onreadystatechange = () => {
        if (req.readyState === XMLHttpRequest.DONE) {
          if (req.status === 200) {
            resolve(this.parseTGSString(req.responseText));
          } else {
            reject();
          }
        }
      };
    });
  }

  parseTGSString(text: string): ParsingResult {

    // comments stripping (à déplacer)
    /*this.configuration.comments.forEach(assertion => {
      text = text.replace(assertion.expression, "");
    });*/

    // pas bon
    //text = text.replace(/^\s*/, "");

    text = text.replace(/\r?\n|\r/g, "\n");

    let startTime: number = Date.now();
    let res: ParsingResult = this.parseStringAt(text, this.configuration.entry);
    // console.log("Evaluated in " + (Date.now() - startTime) + "ms");
    return res;
  }

  parseStringAt(text: string, dictionaryTerm: string, index: number = 0): ParsingResult {
    let group: AssertionsGroup = this.configuration.dictionary[dictionaryTerm];

    // pas possible de trouver un id pour le moment. D'ailleurs id pas nécessaire normalement.
    let globalResult: ParsingResult = new ParsingResult(text, index);

    let cc = text.charAt(index);

    while(cc && cc.match(/\s/)) {
      index++;
      cc = text.charAt(index);
    }

    // on parcourt chacune des assertions du groupe. Si l'une des assertions est ok
    // (elle retourne un tableau de ParsingResult non null, on continue, récursivement)

    if (group.type === AssertionsGroupType.AND) {
      // pour étre évalué comme vrai, toutes les assertions du groupes devront avoir une évaluation positive
      // le résultat sera alors un tableau des différents résultats (un par assertion)
      let results: ParsingResult[] = [];

      for (let assertion of group.assertions) {
        let res: ParsingResult[] = this.evaluateAssertion(text, assertion, index);

        if (res) {
          index = res.length > 0 ? res[res.length - 1].index : index;
          // temporairement
          results.push(...res);

          if (res.length > 0) {
            globalResult.addResults(assertion.id, res);
          }

          globalResult.index = index;
        } else {
          return null;
        }
      }

      return globalResult;

    } else if (group.type === AssertionsGroupType.OR) {
      // un seul résultat, le premier positif de la liste (évaluation dans l'ordre du tableau)

      for (let assertion of group.assertions) {
        let res: ParsingResult[] = this.evaluateAssertion(text, assertion, index);

        if (res) {
          if (res.length > 0) {
            globalResult.addResults(assertion.id, res);
            globalResult.index = res[res.length - 1].index;
          }

          return globalResult;
        }
      }

      // aucun résultat
      return null;

    } else {
      // pas de type, donc une seule assertion possible dans le groupe. Sinon erreur.
      if (group.assertions.length !== 1) {
        console.error(`No type for group: "${ dictionaryTerm }". One and only one assertion required.`);
      }

      let res: ParsingResult[] = this.evaluateAssertion(text, group.assertions[0], index);

      if (res && res.length > 0) {
        index = res ? res[0].index : index;

        if (res.length > 0) {
          globalResult.addResults(group.assertions[0].id, res);
        }

        return globalResult;
      }

      return null;
    }
  }

  evaluateAssertion(text: string, assertion: Assertion, index: number = 0): ParsingResult[] {
    // cas d'itération: * (0 et plus), + (1 et plus), ? (0 ou 1), et defaut (1)
    let subRes: ParsingResult[] = [];
    let currentRes: ParsingResult = this.evaluateAssertionIteration(text, assertion, index);

    if (assertion.iterator === "?" || assertion.iterator === "*") {
      if (!currentRes) {
        return [];
      }
    }

    if (!currentRes && (assertion.iterator === "+" || !assertion.iterator)) {
      return null;
    }

    let count: number = 0;

    while (currentRes) {
      //console.log("ici");
      subRes.push(currentRes);

      if (assertion.iterator === "*" || assertion.iterator === "+") {
        //console.log(currentRes.index);

        let lastIndex: number = currentRes.index;
        currentRes = this.evaluateAssertionIteration(text, assertion, currentRes.index);

        if (currentRes && currentRes.index === lastIndex) {
          // erreur bizarre de redondance de l'index. A voir
          break;
        }
      } else {
        break;
      }

      count++;

      // une petite sécurité qui ne devrait pas être nécessaire
      if (count > 100) {
        console.log("exit !!");
        break;
      }
    }

    return subRes;
  }

  evaluateAssertionIteration(text: string, assertion: Assertion, index: number): ParsingResult {
    let croppedText: string = text.substring(index);

    if (assertion.expression) {

      let regExpAdditions: string = "^";
      regExpAdditions += !assertion.leaveStartSpaces ? "\\s*" : "";

      // strip comments

      // pas bon du tout !!!
      
      this.configuration.comments.forEach(comment => {
        regExpAdditions += comment.expression.source;
      });

      regExpAdditions += !assertion.leaveStartSpaces ? "\\s*" : "";

      let exp = new RegExp(regExpAdditions + assertion.expression.source);

      let expRes: RegExpExecArray = exp.exec(croppedText);

      if (expRes) {
        let newIndex: number = index + expRes[0].length;

        //console.log(newIndex, index);

        let res = new ParsingResult(text, newIndex);

        if (assertion.groups) {
          for (let i = 1; i < expRes.length; i++) {
            res.addGroupResult(assertion.groups[i - 1], expRes[i]);
          }
        }

        return res;

      } else {
        return null;
      }

    } else if (assertion.reference) {

      let targetResult: ParsingResult = this.parseStringAt(text, assertion.reference, index);
      return targetResult;
    }

    return null;
  }

  verifyConfigurationIntegrity(): boolean {
    if (!this.configuration.dictionary[this.configuration.entry]) {
      console.warn(`Entry: "${this.configuration.entry}" unknown in syntax dictionary`);
      return false;
    }

    for (let dicKey in this.configuration.dictionary) {
      for (let assertion of this.configuration.dictionary[dicKey].assertions) {
        if (assertion.reference && !this.configuration.dictionary[assertion.reference]) {
          console.warn(`Unknown key "${assertion.reference}" in syntax dictionary`);
          return false;
        }
      }
    }

    // on doit aussi vérifier qu'il n'y a pas deux fois le même id dans un groupe d'assertions

    return true;
  }
}
