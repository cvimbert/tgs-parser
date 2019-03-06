import { ParsingResult } from "./parsing-result.class";
import { ParserConfiguration } from "./data-interfaces/parser-configuration.interface";
import { Configuration } from "./configuration.class";
import { AssertionsGroup } from "./data-interfaces/assertions-group.interface";
import { AssertionsGroupType } from "./enums/assertions-group-type.enum";
import { Assertion } from "./data-interfaces/assertion.interface";

export class TGSParser {

  private configuration: ParserConfiguration = Configuration.mainConfiguration;
  private parsedText: string;

  constructor() {
    /*let exp = /\s*ab(.*)ab/;
    console.log(exp.exec("kkkk      abcoucouab"));*/
    //console.log("integrity", this.verifyConfigurationIntegrity());
  }

  loadTGSFile(filePath: string): Promise<ParsingResult[]> {

    return new Promise<ParsingResult[]>((resolve: Function, reject: Function) => {
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

  parseTGSString(text: string): ParsingResult[] {
    return this.parseStringAt(text, this.configuration.entry);
  }

  parseStringAtEntryPoint() {

  }

  parseStringAt(text: string, dictionaryTerm: string, index: number = 0): ParsingResult[] {
    let group: AssertionsGroup = this.configuration.dictionary[dictionaryTerm];
    let subString: string = text.substring(index);

    // on parcourt chacune des assertions du groupe. Si l'une des assertions est ok
    // (elle retourne un tableau de ParsingResult non null, on continue, récursivement)

    if (group.type === AssertionsGroupType.AND) {
      // pour étre évalué comme vrai, toutes les assertions du groupes devront avoir une évaluation positive
      // le résultat sera alors un tableau des différents résultats (un par assertion)
      let results: ParsingResult[] = [];

      for (let assertion of group.assertions) {
        let res: ParsingResult[] = this.evaluateAssertion(text, assertion, index);

        //let yep = text.substring(index);

        if (res) {
          index = res[res.length - 1].index;
          // temporairement
          results.push(...res);
        } else {
          return null;
        }
      }

      return results;

    } else if (group.type === AssertionsGroupType.OR) {
      // un seul résultat, le premier positif de la liste (évaluation dans l'ordre du tableau)

      for (let assertion of group.assertions) {
        let res: ParsingResult[] = this.evaluateAssertion(text, assertion, index);
        return res;
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
      }

      return res;
    }
  }

  evaluateAssertion(text: string, assertion: Assertion, index: number = 0): ParsingResult[] {
    // cas d'itération: * (0 et plus), + (1 et plus), ? (0 ou 1), et defaut (1)
    let subRes: ParsingResult[] = [];

    let currentRes: ParsingResult = this.evaluateAssertionIteration(text, assertion, index);

    if (!currentRes) {
      return null;
    }

    if (!currentRes && (assertion.iterator === "?" || assertion.iterator === "*")) {
      return [];
    }

    if (!currentRes && assertion.iterator === "+") {
      return null;
    }

    while (currentRes) {
      subRes.push(currentRes);
      currentRes = this.evaluateAssertionIteration(text, assertion, currentRes.index);

      if (currentRes && (!assertion.iterator || assertion.iterator === "?")) {
        return null;
      }
    }

    return subRes;
  }

  evaluateAssertionIteration(text: string, assertion: Assertion, index: number): ParsingResult {
    let croppedText: string = text.substring(index);

    if (assertion.expression) {

      let regExpAdditions: string = "^";

      if (assertion.stripStartSpaces) {
        regExpAdditions += "\s*";
      }

      let exp = new RegExp(regExpAdditions + assertion.expression.source);

      let expRes: RegExpExecArray = exp.exec(croppedText);

      if (expRes) {
        let newIndex: number = index + expRes[0].length;
        let res = new ParsingResult(assertion.id , newIndex);

        for (let i = 1; i < expRes.length; i++) {
          res.addGroupResult(assertion.groups[i - 1], expRes[i]);
        }

        return res;

      } else {
        return null;
      }

    } else if (assertion.reference) {
      let targetResults: ParsingResult[] = this.parseStringAt(text, assertion.reference, index);

      if (targetResults) {
        let lastIndex: number = targetResults.length > 0 ? targetResults[targetResults.length - 1].index : index;
        let res = new ParsingResult(assertion.id || assertion.reference, lastIndex);
        res.addResults(assertion.id || assertion.reference, targetResults);
        return res;
      }

      return null;
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
