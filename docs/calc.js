// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// dvbox/calc.js
//
// by drow <drow@bin.sh>
// http://unlicense.org/

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// is element

  let element_list = [
    'plant', 'fire', 'earth', 'cold', 'lightning',
    'water', 'air', 'metal', 'light', 'dark'
  ];
  let epic_list = [
    'apocalypse', 'aura', 'chrysalis', 'dream', 'galaxy', 'hidden',
    'melody', 'monolith', 'moon', 'olympus', 'ornamental', 'rainbow',
    'seasonal', 'snowflake', 'sun', 'surface', 'treasure', 'zodiac'
  ];
  let rift_list = [ 'rift' ];
  let gem_list = [ 'gemstone', 'crystalline' ];

  let breed_list = element_list.concat(epic_list,rift_list);
  let concat_list = breed_list.concat(gem_list);

  function is_base_element (tag) {
    return (element_list.indexOf(tag) > -1);
  }
  function is_breed_element (tag) {
    return (breed_list.indexOf(tag) > -1);
  }
  function is_element (tag) {
    return (concat_list.indexOf(tag) > -1);
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// is opposite

  let opposite = {
    'plant':            'metal',
    'fire':             'cold',
    'earth':            'air',
    'lightning':        'water',
    'light':            'dark'
  };
  Object.keys(opposite).forEach(key => {
    opposite[opposite[key]] = key;
  });
  function is_opposite (e1, e2) {
    return def_and_eq(opposite[e1],e2);
  }
  function def_and_eq (a, b) {
    return (a && b && (a == b));
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// breed two dragons

  function breed_calc (d1, d2, beb) {
    let query = breed_query(d1,d2,beb);
    let list = [];

    if (opposite_primary(query)) {
      // opposite primaries cannot be bred directly
    } else if (same_primary(query)) {
      list = primary_dragons(query['elements']);
    } else {
      if (opposite_elements(query)) {
        list = primary_dragons(query['elements']);
      }
      Object.keys(dragons).forEach(dkey => {
        if (is_breedable(dragons[dkey],query)) list.push(dkey);
      });
    }
    if (query['d1']['clonable']) list.push(d1);
    if (query['d2']['clonable']) list.push(d2);

    if (list.length > 0) {
      return list.filter((e,i,a) => (a.indexOf(e) == i));
    } else {
      return false;
    }
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// breed query

  function breed_query (d1, d2, beb) {
    let query = {
      d1:               dragons[d1],
      d2:               dragons[d2],
      tags:             { 'any dragons': true },
      beb:              (beb ?? false)
    };
    ['d1','d2'].forEach(key => {
      let tags; if (query[key]['tags']) {
        tags = query[key]['tags'];
      } else {
        tags = dragon_tags(query[key]);
        query[key]['tags'] = tags;
      }
      Object.keys(tags).forEach(tag => {
        query['tags'][tag] = true;
        query['tags'][`${key}.${tag}`] = true;
      });
    });
    let list; if (list = breed_elements(query)) {
      let elements = Object.keys(list['any']);
      let n = elements.length;
      let d = Object.keys(list['dream']).length;

      query['elements'] = elements;
      query['n_elements'] = n;

      query['tags']['four elements'] = (n >= 4);
      query['tags']['dream elements'] = (d >= 2);
    }
    return query;
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// dragon tags

  function dragon_tags (dragon) {
    let tags = {
      [dragon.name]:    true,
      [dragon.type]:    true,
      rifty:            (dragon.rifty ?? false)
    };
    let list; if (list = dragon['elements']) {
      list.forEach(e => tags[e] = true);
    }
    let latent; if (latent = dragon['latent']) {
      latent.forEach(e => tags[e] = true);
    }
    return tags;
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// compile breed elements

  function breed_elements (query) {
    let list = { any: {}, dream: {} };

    ['d1','d2'].forEach(key => {
      let tags; if (tags = query[key]['tags']) {
        Object.keys(tags).forEach(tag => {
          if (is_breed_element(tag)) {
            list['any'][tag] = true;

            if (tag != 'light' && tag != 'dark') {
              list['dream'][tag] = true;
            }
          }
        });
      }
    });
    return list;
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// opposite primary rule

  function opposite_primary (query) {
    return def_and_eq(query['d1']['primary'],query['d2']['opposite']);
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// same primary rule

  function same_primary (query) {
    return def_and_eq(query['d1']['primary'],query['d2']['primary']);
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// opposite elements rule

  function opposite_elements (query) {
    let list = query['elements'].filter(e => is_base_element(e));
    return (list.length == 2 && is_opposite(list[0],list[1]));
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// list primary dragons by element

  function primary_dragons (elements) {
    let want = {}; elements.forEach(e => { want[e] = true; });
    let list = [];

    Object.keys(dragons).forEach(dkey => {
      if (dragons[dkey]['type'] == 'primary'
        && want[dragons[dkey]['primary']]
      ) {
        list.push(dkey);
      }
    });
    return list;
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// check breedable

  function is_breedable (dragon, query) {
    if (! is_available(dragon,query)) {
      return false;
    }
    let reqs; if (dragon['reqs_compiled']) {
      reqs = dragon['reqs_compiled'];
    } else {
      reqs = compile_reqs(dragon);
      dragon['reqs_compiled'] = reqs;
    }
    let have = query['tags'];
    let breedable = false;

    reqs.forEach(req => {
      if (! breedable) {
        let need = Object.keys(req);
        let miss = false;

        need.forEach(tag => {
          if (! have[tag]) miss = true;
        });
        if (! miss) breedable = true;
      }
    });
    return breedable;
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// check available

  function is_available (dragon, query) {
    if (dragon['available'] == 'never')         return false;

    if (query['beb'])                           return true;
    if (dragon['available'] == 'permanent')     return true;
    if (/^yes/.test(dragon['available']))       return true;

    return false;
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// compile requirements

  function compile_reqs (dragon) {
    let reqs = [];

    dragon['reqs'].forEach(set => {
      let req = {}; set.forEach(tag => {
        req[tag] = true;
      });
      if (dragon['type'] == 'rift') {
        req['d1.rifty'] = true;
        req['d2.rifty'] = true;
      }
      reqs.push(req);
    });
    return reqs;
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// sort by breed time

  function sort_by_time (list) {
    return list.sort((a, b) => {
      if      (dragons[a]['time'] < dragons[b]['time']) return -1;
      else if (dragons[a]['time'] > dragons[b]['time']) return  1;
      else if (dragons[a]['name'] < dragons[b]['name']) return -1;
      else if (dragons[a]['name'] > dragons[b]['name']) return  1;
      return 0;
    });
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// format breed time

  function fmt_breed_time (key, fast) {
    let t; if (t = dragons[key]['time']) {
      if (fast) {
        return fmt_dhms(Math.floor(t * 0.80));
      } else {
        return fmt_dhms(t);
      }
    } else {
      return '??';
    }
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// format day:hour:min:sec

  function fmt_dhms (t) {
    let z2d = (i) => (i > 9) ? i : `0${i}`;

    if (t > 0 && t < 60) {
      let text = `${Math.floor(t + 0.5)} sec`;
      let node = document.createElement('span');

      node.style.whiteSpace = 'nowrap';
      node.appendChild(document.createTextNode(text));

      return node;
    } else {
      let d; if (t > 86400) {
          d = Math.floor(t / 86400);   t = (t % 86400);
      }
      let h = Math.floor(t /  3600);   t = (t %  3600);
      let m = Math.floor(t /    60);   t = (t %    60);
      let s = Math.floor(t);

      if (d) {
        return `${d}:${z2d(h)}:${z2d(m)}:${z2d(s)}`;
      } else if (h) {
        return `${h}:${z2d(m)}:${z2d(s)}`;
      } else {
        return `${m}:${z2d(s)}`;
      }
    }
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// hack dragons

  Object.keys(dragons).forEach(key => {
    dragons[key]['tags'] = dragon_tags(dragons[key]);
    dragons[key]['dhms'] = fmt_dhms(dragons[key]['time']);
  });

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
