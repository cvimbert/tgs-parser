export class Configuration {

  comment: RegExp = /^\s\/\/*$/;

  unities: Object = {
    rawText: {
      expression: /([A-Za-z0-9-]+)/,
      groups: ["value"]
    },
    sectionIdentifier: {
      expression: /#([A-Za-z0-9-]+)/, // ou un array d'expressions ?
      groups: ["name"]
    },
    sectionId2: {
      expression: [/#/, "sectionIdentifier"]
    }
  }

  configuration: Object = {
    // énumeration des objets définissant la structure du langage de script
    t1: {
      sub1: {
        list: [
          {
            id: "e1",
            expression: /ok/,
            groups: ["g1", "g2"],
            iteration: "*" // ou +, ?, voir un autre itérateur d'expression régulière
          },
          'idRef' // peut être une interface aussi
        ]
      },
      sub2: {

      }
    },
    t2: {

    }
  }

}
