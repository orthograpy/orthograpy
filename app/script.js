var profiles = {
  'sinopy': ['Grapheme', 'IPA', 'STRUCTURE'],
  'sampa': ['Grapheme', 'IPA']
};


function loadProfile(profile){
  var i, header, inputs;
  inputs = document.getElementById('converters');
  inputs.innerHTML = '<input id="grapheme" type="radio" checked onchange="PROFILE.column=this.dataset[\'value\']" data-value="grapheme" name="columns" />' + 
    '<label for="grapheme">Grapheme</label>';
  header = PROFILE[profile+'_labels'];
  for (i=1; i<header.length; i++) {
    inputs.innerHTML += '<input type="radio" id="'+header[i]+'" onchange="PROFILE.column=this.dataset[\'value\']" data-value="'+header[i]+'" name="columns" />' +
      '<label for="'+header[i]+'">'+header[i].toUpperCase()+'</label>';
  }
  PROFILE.current = PROFILE[profile];
  document.getElementById('currentprofile').innerHTML = profile;
  PROFILE.column = 'Grapheme';
}

function profile() {
  var i, j, data, row, cell, header, inputs;
  PROFILE['current'] = {};
  data = document.getElementById('profile').value.replace(/>|\|/g, "\t").split(/\n|\n\r/g);
  header = data[0].split('\t');
  for (i=1; i<data.length; i++) {
    if (typeof data[i] != 'undefined' && data[i].replace(/\s/g, '').length != 0) {
      row = data[i].split("\t");
      if (typeof row != "undefined") {
	PROFILE['current'][row[0]] = {};
	for (j=1; j<header.length; j++) {
	  cell = row[j];
	  PROFILE['current'][row[0]][header[j]] = cell;
	}
      }
    }
  }
  inputs = document.getElementById('converters');
  inputs.innerHTML = '<input id="grapheme" type="radio" checked onchange="PROFILE.column=this.dataset[\'value\']" data-value="Grapheme" name="columns" />' + 
    '<label for="grapheme">GRAPHEME</label>';
  for (i=1; i<header.length; i++) {
    inputs.innerHTML += '<input type="checkbox" id="'+header[i]+'" onchange="PROFILE.column=this.dataset[\'value\']" data-value="'+header[i].toLowerCase()+'" name="columns" />' +
      '<label for="'+header[i].toLowerCase()+'">'+header[i].toUpperCase()+'</label>';
  }
  document.getElementById('currentprofile').innerHTML = 'user-defined';
  PROFILE.column = 'Grapheme';
}

function segmentize(word) {
  word = word.normalize('NFD');
  if (word.length == 0) {
    return [word];
  }
  var queue, scr, segmented, current, rest;
  queue = [[[], word, '']];
  out = [];
  while (queue.length > 0) {
    scr = queue.splice(0, 1)[0];
    segmented = scr[0];
    current = scr[1];
    rest = scr[2];

    if (current in PROFILE.current && !(rest)) {
      out = segmented.concat([current]);
    }
    else if (current.length == 1 && !(current in PROFILE.current)) {
      if (rest) {
	queue.push([segmented.concat([current]), rest, '']);
      }
      else {
	out = segmented.concat([current]);
      }
    }
    else if (!(current in PROFILE.current) && current) {
      queue.push([segmented, current.slice(0, current.length-1), current[current.length-1]+rest]);
    }
    else if (!(current) && rest) {
      queue.push([segmented, rest, '']);
    }
    else {
      queue.push([segmented.concat([current]), rest, '']);
    }
  }
  
  if (PROFILE.column.toLowerCase() == 'grapheme') {
    for (i=0; i<out.length; i++) {
      if (!(out[i] in PROFILE.current)) {
	out[i] = '«'+out[i]+'»';
      }
    }
    return out;
  }
  else {
    for (i=0; i<out.length; i++) {
      if (out[i] in PROFILE.current && PROFILE.column in PROFILE.current[out[i]]) {
	cell = PROFILE.current[out[i]][PROFILE.column];
	  out[i] = cell;
      }
      else {
	out[i] = '«'+out[i]+'»';
      }
    }
    return out;
  }
}

function segmentAndShow(value) {
  var segments = segmentize(value);
  document.getElementById('out').innerHTML = segments.join(' ');
}

console.log(segmentize(''));
//segmentAndShow('khabp');


var i;
var pfs = document.getElementById('profiles');
pfs.innerHTML = '<table><tr>';
for (i=0; i<PROFILE['_profiles_'].length; i++) {
  pfs.innerHTML += '<td><input class="sinput" type="button" onclick="loadProfile(\''+PROFILE['_profiles_'][i]+'\');" value="'+PROFILE['_profiles_'][i]+'" name="'+PROFILE['_profiles_'][i]+'" /></td>';
}
pfs.innerHTML += '</tr></table>';
loadProfile(PROFILE['_profiles_'][0]);
