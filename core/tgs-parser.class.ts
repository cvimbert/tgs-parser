import { ParsingResult } from "./parsing-result.class";

export class TGSParser {

  constructor() {

  }

  loadTGSFile(filePath: string): void {

    // voir l'utilisation des promises
    /*let completionPromise: Promise<boolean> = new Promise<boolean>(() => {
      return true;
    });*/

    let req: XMLHttpRequest = new XMLHttpRequest();
    req.open("GET", filePath);
    req.send();

    req.onreadystatechange = () => {
      if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === 200) {
          console.log(req.responseText);
        }
      }
    };
  }


  parseTGSString(text: string): ParsingResult {
    return null;
  }
}
