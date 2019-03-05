export class ParsingResult {

  groups: {[key: string]: string} = {};
  results: {[key: string]: ParsingResult[]} = {};

  constructor(
    public id: string,
    public index: number
  ) {}

  addGroupResult(groupName: string, value: string) {
    this.groups[groupName] = value;
  }

  addResults(assertionName: string, results: ParsingResult[]) {
    results[assertionName] = results;
  }

  addResult(assertionName: string, result: ParsingResult) {
    if (!this.results[assertionName]) {
      this.results[assertionName] = [];
    }

    this.results[assertionName].push(result);
  }
}
