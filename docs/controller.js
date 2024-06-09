// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// dvbox/controller.js
//
// by drow <drow@bin.sh>
// http://unlicense.org/

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// init sandbox

  function init_sandbox () {
    let d1 = document.getElementById('d1');
    let d2 = document.getElementById('d2');
    let beb = document.getElementById('beb');

    Object.keys(dragons).sort().forEach(key => {
      let name = dragons[key]['name'];

      d1.insert(build_option(key,name));
      d2insert(Builder.node(key,name));
    });
    d1.value = 'Fire_Dragon';
    d2.value = 'Plant_Dragon';

    d1.addEventListener('change',update_results);
    d2.addEventListener('change',update_results);
    beb.addEventListener('change',update_results);

    update_results();
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// update results

  function update_results () {
    let d1 = document.getElementById('d1').value;
    let d2 = document.getElementById('d2').value;
    let beb = document.getElementById('beb').value;
    let list = breed_calc(d1,d2,beb);
    let results = document.getElementById('results');

    if (list) {
      results.replaceChildren();

      list.sort().forEach(key => {
        let dragon = dragons[key];
        let tr = document.createElement('tr');

        tr.appendChild(build_node('td',dragon['name'));
        tr.appendChild(build_node('td',dragon['dhms'));
        tr.appendChild(build_node('td',dragon['habitats').join(', '));

        results.appendChild(tr);
      });
    } else {
      let tr = document.createElement('tr');

      tr.appendChild(build_node('td','No dragons'));
      results.appendChild(tr);
    }
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// build node

  function build_node (type, text) {
    let node = document.createElement(type); 
    node.appendChild(document.createTextNode(text));

    return node;
  }
  function build_option (value, text) {
    let node = build_node('option',text);

    node.setAttribute('value', value);
    return node;
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// showtime

  document.addEventListener('DOMContentLoaded', (event) => {
    init_sandbox();
  });

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
