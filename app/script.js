var profiles = {
  'sinopy': ['Grapheme', 'IPA', 'STRUCTURE'],
  'sampa': ['Grapheme', 'IPA']
};

function addValue(value) {
  var i;
  PROFILE.column = [];
  for (i=0; i<value.options.length; i++) {
    if (value.options[i].selected) {
      PROFILE.column.push(value.options[i].value);
    }
  }
}


function loadProfile(profile){
  var i, header, inputs;
  header = PROFILE[profile+'_labels'];
  inputs = document.getElementById('converters');
  var text = '<select onchange="addValue(this)" id="selections" multiple>';
  text += '<option id="grapheme" selected value="'+header[0]+'" name="columns">Grapheme</option>';
  for (i=1; i<header.length; i++) {
    text += '<option id="'+header[i]+'" value="'+header[i]+'">'+header[i]+'</option>';
  }
  text += '</select>';
  inputs.innerHTML = text;
  PROFILE.current = PROFILE[profile];
  document.getElementById('currentprofile').innerHTML = profile;
  PROFILE.column = [header[i]];
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
  console.log(header);
  inputs = document.getElementById('converters');
  var text = '<select onchange="addValue(this)" id="selections" multiple>';
  text += '<option id="grapheme" selected value="'+header[0]+'" name="columns">Grapheme</option>';
  for (i=1; i<header.length; i++) {
    text += '<option id="'+header[i]+'" value="'+header[i]+'">'+header[i]+'</option>';
  }
  text += '</select>';
  inputs.innerHTML = text;
  document.getElementById('currentprofile').innerHTML = 'user-defined';
  PROFILE.column = [header[0]]; //'Grapheme';
}

function segmentize(word) {
  word = word.normalize('NFD');
  if (word.length == 0) {
    return [word];
  }
  var queue, scr, segmented, current, rest, outputs, option, j;
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
  outputs = [];
  for (j=0; j<PROFILE.column.length; j++) {
    queue = [];
    option = PROFILE.column[j];
    if (option.toLowerCase() == 'grapheme') {
      for (i=0; i<out.length; i++) {
	if (!(out[i] in PROFILE.current)) {
	  queue.push('«'+out[i]+'»');
	}
	else {
	  queue.push(out[i]);
	}
      }
      outputs.push(queue);
    }
    else {
      for (i=0; i<out.length; i++) {
        if (out[i] in PROFILE.current && option in PROFILE.current[out[i]]) {
	  cell = PROFILE.current[out[i]][option];
          queue.push(cell);
        }
        else {
          queue.push('«'+out[i]+'»');
        }
      }
      outputs.push(queue);
    }
  }
  
  //if (PROFILE.column.toLowerCase() == 'grapheme') {
  //  for (i=0; i<out.length; i++) {
  //    if (!(out[i] in PROFILE.current)) {
  //      out[i] = '«'+out[i]+'»';
  //    }
  //  }
  //  return out;
  //}
  //else {
  //  for (i=0; i<out.length; i++) {
  //    if (out[i] in PROFILE.current && PROFILE.column in PROFILE.current[out[i]]) {
  //      cell = PROFILE.current[out[i]][PROFILE.column];
  //        out[i] = cell;
  //    }
  //    else {
  //      out[i] = '«'+out[i]+'»';
  //    }
  //  }
  //  return out;
  //}
  return outputs
}

function segmentAndShow(value) {
  var segments = segmentize(value);
  var text = '<div>';
  for (var i=0; i<segments.length; i++) {
    text += '<span style="width:100px;display:table-cell;font-weight:bold;">'+PROFILE.column[i]+'</span><span class="tk">'+segments[i].join(' ').split(' ').join('</span><span class="tk">')+'</span><br>';
  }
  text += '</div>';
  document.getElementById('out').innerHTML = text; //segments.join(' ');
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
