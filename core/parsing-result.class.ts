export class ParsingResult {

  groups: {[key: string]: string};
  results: {[key: string]: ParsingResult[]};

  constructor(
    public index: number
  ) {}

  addGroupResult(groupName: string, value: string) {
    if (!this.groups) {
      this.groups = {};
    }

    this.groups[groupName] = value;
  }

  addResults(assertionName: string, results: ParsingResult[]) {
    if (!this.results) {
      this.results = {};
    }

    //if (results.length > 0) {
      this.results[assertionName] = results;
      this.index = results.length > 0 ? results[results.length - 1].index : 0;
    //}
  }

  getValueAtKey(key: string): string {
    return this.groups[key];
  }

  getResultsAtKey(key: string): ParsingResult[] {
    return this.results[key];
  }

  private splitPath(path: string): string[] {
    return path.split("/");
  }

  getResults(path: string): ParsingResult[] {
    return this.getResultsByArray(this.splitPath(path));
  }

  getResultsByArray(splittedPath: string[], index: number = 0): ParsingResult[] {

    let pathElem: string = splittedPath[index];
    let currentRes: ParsingResult[] = this.getResultsAtKey(pathElem);

    if (!currentRes) return null;

    if (index === splittedPath.length - 1) {
      return this.getResultsAtKey(pathElem);
    } else {
      let results: ParsingResult[] = [];

      currentRes.forEach(res => {
        results.push(...res.getResultsByArray(splittedPath, index + 1));
      });

      return results;
    }
  }

  getFirstKey(path: string = null): string {
    if (!path) {
      if (this.results) {
        return Object.keys(this.results)[0];
      }
    } else {
      // à terminer
      //return this.getFirstValue(path)
    }
  }

  hasKey(keyName: string): boolean {
    return;
  }

  getFirstResult(path: string): ParsingResult {
    let results: ParsingResult[] = this.getResults(path);
    return results ? results[0] : null;
  }

  getFirstValue(path: string): string {
    let values: string[] = this.getValue(path);
    return values ? values[0] : null;
  }

  getValue(path: string): string[] {

    if (path.indexOf("@") === -1) {
      return null;
    }

    let splitted: string[] = path.split("@");
    let pathElem: string = splitted[0];
    let resName: string = splitted[1];

    let res: ParsingResult[] = this.getResults(pathElem);
    let groupsRes: string[] = [];

    if (res) {
      res.forEach(elem => {
        groupsRes.push(elem.getValueAtKey(resName));
      });
    }

    return groupsRes;
  }
}
