'use strict';


function withDefault(x, defaultValue)
{
  return x !== undefined ? x : defaultValue;
}


function Entgelt(x)
{
  return {
    flags    : withDefault(x.flags,          []),

    volMin   : withDefault(x.volMin,          0),
    volMax   : withDefault(x.volMax,   Infinity),

    promille : withDefault(x.promille,        0),
    fixum    : withDefault(x.fixum,           0),
    min      : withDefault(x.min,             0),
    max      : withDefault(x.max,      Infinity)
  };
}


function EntgeltVorMWST(x)
{
  var entgelt = new Entgelt(x);

  [
    'promille',
    'fixum',
    'min',
    'max'
  ].forEach(function(key) {
    entgelt[key] *= MWST;
  });

  return entgelt;
}


var entgeltfrei = new Entgelt({});


function addFlags(x, flags)
{
  var y = new Entgelt(x);
  y.flags = y.flags.concat(flags);
  return y;
}


function scalePromille(x, factor)
{
  var y = new Entgelt(x);
  y.promille *= factor;
  return y;
}


function splitAndFlag(flags, grenzen, entgelte)
{
  var splitAndFlagged = [];

  entgelte.forEach(function(entgelt, i) {
    var x = new Entgelt(entgelt);
    x.flags = x.flags.concat(flags);
    x.volMin = i === 0 ? 0 : (grenzen[i-1] + 0.01);
    x.volMax = i === entgelte.length - 1 ? Infinity : grenzen[i];
    splitAndFlagged.push(x);
  });

  return splitAndFlagged;
}


function passendesEntgelt(entgelte, flags, kurswert)
{
  entgelte.forEach(function(entgelt) {
    if (entgelt.volMin <= kurswert && kurswert <= entgelt.volMax) {
      var sharedFlags = entgelt.flags.filter(function(flag) {
        return flags.indexOf(flag) !== -1;
      });
      entgelt.noflags = sharedFlags.length;
    } else {
      entgelt.noflags = -1;
    }
  });

  var i_max = -1, maxflags = -1;
  entgelte.forEach(function(entgelt, i) {
    if (entgelt.noflags > maxflags) {
      i_max = i;
      maxflags = entgelt.noflags;
    }
  });

  if (i_max === -1) {
    exit('Kein passendes Entgelt vorhanden');
  }

  return entgelte[i_max];
}


function berechneGebuehr(entgelt, kurswert)
{
  var res = kurswert * entgelt.promille / 1000 + entgelt.fixum;

  if (res < entgelt.min) {
    return entgelt.min;
  }

  if (res > entgelt.max) {
    return entgelt.max;
  }

  return res;
}


function appendTD(tr, innerHTML, className)
{
  var td = document.createElement('td');
  td.innerHTML = innerHTML;
  if (className !== undefined) {
    td.className = className;
  }
  tr.appendChild(td);
  return td;
}


function toNumber(x, defaultValue)
{
  return (isNaN(x) || x < 0 || x === Infinity) ? defaultValue : x;
}


function toPromille(x, y)
{
  return x / y * 1000;
}


function exit(errMsg)
{
  alert(errMsg);
  throw errMsg;
}
