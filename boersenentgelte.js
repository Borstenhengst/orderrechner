'use strict';


var MWST = 1.19;


var courtageBuDuHHHuM = new Entgelt({
  promille : 0.8,
  min      : 0.75
});


var courtageBuDuHHHuM_halbiert =
  scalePromille(courtageBuDuHHHuM, 0.5);


var regulierungskostenSchaetzung = [
  new Entgelt({
    flags    : ['gesch&auml;tzt'],
    fixum    : 0.80
  })
];


var schlussnotenentgelteSchaetzung = [
  new Entgelt({
    flags    : ['gesch&auml;tzt'],
    fixum    : 0.07
  })
];


var provisionFlatexBoerse = [
  new Entgelt({
    flags    : ['flatex'],
    fixum    : 5.00
  })
];


var provisionFlatexDirekthandel = [
  new Entgelt({
    flags    : ['flatex'],
    fixum    : 5.90
  })
];


function DirekthandelUndGettex()
{
  this.name = 'Direkthandel und gettex';

  this.provision = provisionFlatexDirekthandel;
}


function BoerseBerlin()
{
  this.name = 'Berlin';

  this.transaktionsentgelte = [
    new EntgeltVorMWST({
      promille : 0.38,
      min      : 1.30,
      max      : 15.00
    })
  ];

  this.courtagen = [
    courtageBuDuHHHuM
  ].concat(
    splitAndFlag(
      ['DAX'],
      [],
      [courtageBuDuHHHuM_halbiert]
    )
  );

  this.regulierungskosten = regulierungskostenSchaetzung;
  this.schlussnotenentgelte = schlussnotenentgelteSchaetzung;
  this.provision = provisionFlatexBoerse;
}


function BoerseDuesseldorf()
{
  this.name = 'D&uuml;sseldorf';

  this.transaktionsentgelte = [
    new EntgeltVorMWST({
      promille : 0.38,
      min      : 1.30,
      max      : 19.00
    })
  ];

  this.courtagen = [
    courtageBuDuHHHuM
  ].concat(
    splitAndFlag(
      ['DAX'],
      [10000],
      [entgeltfrei, courtageBuDuHHHuM_halbiert]
    )
  );

  this.regulierungskosten = regulierungskostenSchaetzung;
  this.schlussnotenentgelte = schlussnotenentgelteSchaetzung;
  this.provision = provisionFlatexBoerse;
}


function BoerseFrankfurt()
{
  this.name = 'Frankfurt';

  this.transaktionsentgelte = [
    new Entgelt({
      flags    : ['DAX'],
      promille : 0.13138,
      min      : 0.82,
      max      : 98.53
    })
  ];

  this.handelsentgelte = [
    new EntgeltVorMWST({
      promille : 0.504,
      min      : 2.52
    })
  ];

  this.regulierungskosten = [
    new Entgelt({
      flags    : ['DAX'],
      promille : 0.01,
      fixum    : 0.11 + 0.66,
      max      : 7.25
    })
  ];

  this.kommunikationsentgelte = [
    new Entgelt({
      promille : 0.003,
      fixum    : 0.09
    })
  ];

  this.schlussnotenentgelte = [
    new Entgelt({
      fixum    : 0.07 + 0.275
    })
  ];

  this.provision = provisionFlatexBoerse;
}


function BoerseHamburgHannover()
{
  this.name = 'Hamburg und Hannover';

  this.transaktionsentgelte = [
    new EntgeltVorMWST({
      promille : 0.25,
      min      : 1.30,
      max      : 11.00
    })
  ];

  this.courtagen = [
    courtageBuDuHHHuM
  ].concat(
    splitAndFlag(
      ['DAX'],
      [50000],
      [entgeltfrei, courtageBuDuHHHuM_halbiert]
    )
  ).concat(
    splitAndFlag(
      ['MDAX', 'TecDAX', 'Ausland'],
      [25000],
      [entgeltfrei, courtageBuDuHHHuM]
    )
  );

  this.regulierungskosten = regulierungskostenSchaetzung;
  this.schlussnotenentgelte = schlussnotenentgelteSchaetzung;
  this.provision = provisionFlatexBoerse;
}


function BoerseMuenchen()
{
  this.name = 'M&uuml;nchen';

  this.transaktionsentgelte = [
    new EntgeltVorMWST({
      promille : 0.29,
      min      : 1.30,
      max      : 14.00
    })
  ];

  this.courtagen = [
    courtageBuDuHHHuM
  ].concat(
    splitAndFlag(
      ['DAX'],
      [],
      [courtageBuDuHHHuM_halbiert]
    )
  );

  this.schlussnotenentgelte = [
    new Entgelt({
      fixum    : 0.07
    })
  ];

  this.regulierungskosten = regulierungskostenSchaetzung;
  this.provision = provisionFlatexBoerse;
}


function BoerseSuttgart()
{
  this.name = 'Stuttgart';

  var transaktionsentgelte =
    new Entgelt({
      promille : 0.80,
      fixum    : 5.00,
      min      : 5.75
    });

  var transaktionsentgelte_DAX =
    addFlags(scalePromille(transaktionsentgelte, 0.5), ['DAX']);

  this.transaktionsentgelte = [
    transaktionsentgelte,
    transaktionsentgelte_DAX
  ];

  this.regulierungskosten = [
    new Entgelt({
      promille : 0.018,
      fixum    : 0.11 + 0.36,
      max      : 7.14
    })
  ];

  this.kommunikationsentgelte = [
    new Entgelt({
      fixum    : 0.09
    })
  ];

  this.schlussnotenentgelte = [
    new Entgelt({
      fixum    : 0.04
    })
  ];

  this.provision = provisionFlatexBoerse;
}


function BoerseXETRA()
{
  this.name = 'XETRA';

  this.courtagen = [
    new Entgelt({
      flags    : ['DAX'],
      promille : 0.0657,
      min      : 0.82,
      max      : 98.53
    })
  ];

  this.regulierungskosten = [
    new Entgelt({
      promille : 0.01,
      fixum    : 0.11 + 0.63,
      max      : 7.22
    })
  ];

  this.kommunikationsentgelte = [
    new Entgelt({
      promille : 0.003,
      fixum    : 0.09
    })
  ];

  this.schlussnotenentgelte = [
    new Entgelt({
      fixum    : 0.07 + 0.275
    })
  ];

  this.provision = provisionFlatexBoerse;
}
