export class ParsingResult {

  groups: {[key: string]: string} = {};
  results: {[key: string]: ParsingResult[]} = {};

  constructor(
    // pas certain que l'id soit vraiment utile
    public id: string,
    public index: number
  ) {}

  addGroupResult(groupName: string, value: string) {
    this.groups[groupName] = value;
  }

  addResults(assertionName: string, results: ParsingResult[]) {
    this.results[assertionName] = results;
    /*if (!this.results[assertionName]) {
      this.results[assertionName] = [];
    }

    results.forEach(res => {
      this.results
    });*/

  }

  addResult(assertionName: string, result: ParsingResult) {
    if (!this.results[assertionName]) {
      this.results[assertionName] = [];
    }

    this.results[assertionName].push(result);
  }
}
