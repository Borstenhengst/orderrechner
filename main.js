'use strict';


var boersen = [
  new BoerseBerlin(),
  new BoerseDuesseldorf(),
  new BoerseFrankfurt(),
  new BoerseHamburgHannover(),
  new BoerseMuenchen(),
  new BoerseSuttgart(),
  new BoerseXETRA(),
  new DirekthandelUndGettex()
];


var flags    = [];


var stueck   = 0;
var kurs     = 0;
var kurswert;


var flagCBs, showDetailsCB;
var stueckInput, kursInput, kurswertSpan;


function aktualisiereGebuehren()
{
  flags = [];
  for (var i = 0; i < flagCBs.length; ++i) {
    if (flagCBs[i].checked) {
      flags.push(flagCBs[i].value);
    }
  }

  stueck = toNumber(stueckInput.value, stueck);
  kurs = toNumber(kursInput.value, kurs);

  kurswert = toNumber(stueck * kurs, kurswert);

  kurswertSpan.innerHTML = kurswert.toFixed(2);

  var table = document.createElement('table');
  var tr, td, tdText;
  var maxCols = 8;

  var trsMitGebuehr = [];

  boersen.forEach(function(boerse) {
    var gesamtGebuehr = 0;

    tr = document.createElement('tr');

    td = appendTD(tr, boerse.name, 'handelsplatz');
    td.colSpan = maxCols;

    var trs = [tr];

    [
      {
        entgelt : boerse.provision,
        name    : 'Provision'
      },
      {
        entgelt : boerse.courtagen,
        name    : 'Courtage'
      },
      {
        entgelt : boerse.transaktionsentgelte,
        name    : 'Transaktionsentgelt'
      },
      {
        entgelt : boerse.handelsentgelte,
        name    : 'Handelsentgelt'
      },
      {
        entgelt : boerse.regulierungskosten,
        name    : 'Regulierungskosten'
      },
      {
        entgelt : boerse.kommunikationsentgelte,
        name    : 'Kommunikationskosten'
      },
      {
        entgelt : boerse.schlussnotenentgelte,
        name    : 'Schlussnotenentgelt'
      }
    ].forEach(function(xs) {
      if (xs.entgelt === undefined) {
        return;
      }

      var x = passendesEntgelt(xs.entgelt, flags, kurswert);
      var gebuehr = berechneGebuehr(x, kurswert);
      var gebuehrPromille = toPromille(gebuehr, kurswert);

      gesamtGebuehr += gebuehr;

      tr = document.createElement('tr');

      tdText = xs.name;
      if (x.flags.length > 0) {
        tdText += ' (' + x.flags.join(', ') + ')';
      }
      appendTD(tr, tdText, 'name');

      if (showDetailsCB.checked) {
        tdText = '';
        if (x.volMin !== 0) {
          tdText += '&nbsp;ab ' + x.volMin.toFixed(2) + '&euro;';
        }
        if (x.volMax !== Infinity) {
          tdText += '&nbsp;bis ' + x.volMax.toFixed(2) + '&euro;';
        }
        appendTD(tr, tdText, 'limit');

        tdText = '';
        if (x.promille !== 0) {
          tdText = x.promille.toFixed(3) + '&permil;';
        } else if (x.fixum === 0) {
          tdText = '--';
        }
        appendTD(tr, tdText, 'promille');

        tdText = x.promille !== 0 && x.fixum !== 0 ? '+' : '';
        appendTD(tr, tdText, 'centering');

        tdText = x.fixum !== 0 ? x.fixum.toFixed(2) + '&euro;' : '';
        appendTD(tr, tdText, 'fixum');

        var minmax = [];
        if (x.min !== 0) {
          minmax.push('min. ' + x.min.toFixed(2) + '&euro;');
        }
        if (x.max !== Infinity) {
          minmax.push('max. ' + x.max.toFixed(2) + '&euro;');
        }
        tdText = minmax.length > 0 ? '&nbsp;(' + minmax.join(', ') + ')' : '';
        appendTD(tr, tdText, 'minmax');

        tdText = ['', '']
        if (gebuehr !== 0 && gebuehrPromille !== Infinity) {
          tdText = [gebuehrPromille.toFixed(3) + '&permil;', '='];
        }
        appendTD(tr, tdText[0], 'gebuehr gebuehr-promille');
        appendTD(tr, tdText[1], 'centering');
      }

      tdText = gebuehr !== 0 ? gebuehr.toFixed(2) + '&euro;' : '--';
      appendTD(tr, tdText, 'gebuehr');

      trs.push(tr);
    });

    tr = document.createElement('tr');

    var colSpanTmp = maxCols;

    if (showDetailsCB.checked) {
      var gesamtGebuehrPromille = toPromille(gesamtGebuehr, kurswert);

      tdText = ['', '']
      if (gesamtGebuehrPromille !== Infinity) {
        tdText = [gesamtGebuehrPromille.toFixed(3) + '&permil;', '='];
      }
      td = appendTD(tr, tdText[0], 'gesamtgebuehr gebuehr-promille');
      td.colSpan = maxCols - 1;
      appendTD(tr, tdText[1], 'centering gesamtgebuehr');

      colSpanTmp = 1;
    }

    tdText = gesamtGebuehr.toFixed(2) + '&euro;';
    td = appendTD(tr, tdText, 'gesamtgebuehr');
    td.colSpan = colSpanTmp;

    trs.push(tr);

    trsMitGebuehr.push({ trs : trs, gebuehr : gesamtGebuehr });
  });

  trsMitGebuehr.sort(function(x, y) {
    return x.gebuehr <= y.gebuehr ? -1 : 1;
  });

  trsMitGebuehr.forEach(function(x) {
    x.trs.forEach(function(tr) {
      table.appendChild(tr);
    });
  });

  var div = document.getElementById('gebuehrentabelle');
  div.innerHTML = '';
  div.appendChild(table);

  return table;
}


document.body.onload = function() {
  flagCBs       = document.getElementsByName('flags');
  showDetailsCB = document.getElementById('details');

  stueckInput   = document.getElementById('stueck');
  kursInput     = document.getElementById('kurs');
  kurswertSpan  = document.getElementById('kurswert');

  aktualisiereGebuehren();
}
