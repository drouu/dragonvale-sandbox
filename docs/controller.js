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

      d1.appendChild(build_option(key,name));
      d2.appendChild(build_option(key,name));
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

    results.replaceChildren();

    if (list) {
      list.sort().forEach(key => {
        let dragon = dragons[key];
        let tr = build_node('tr');

        tr.appendChild(build_node('td',dragon['name']));
        tr.appendChild(build_node('td',dragon['dhms']));
        tr.appendChild(build_node('td',dragon['habitats'].join(', ')));

        results.appendChild(tr);
      });
    } else {
      let tr = build_node('tr',build_node('td','No dragons'));
      results.appendChild(tr);
    }
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// build node

  function build_node (type, content) {
    let node = document.createElement(type); 

    if (content) {
      if (content instanceof HTMLElement) {
        node.appendChild(content);
      } else {
        node.appendChild(document.createTextNode(content));
      }
    }
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
