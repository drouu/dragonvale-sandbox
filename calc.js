// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// dvbox/calc.js
//
// by drow <drow@bin.sh>
// http://creativecommons.org/publicdomain/zero/1.0/
//
// requires Prototype

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// configuration

  var weight = {
    'hybrid':           10,
    'primary':          2,
    'default':          1
  };

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// is element

  var element_list = [
    'plant', 'fire', 'earth', 'cold', 'lightning',
    'water', 'air', 'metal', 'light', 'dark'
  ];
  var epic_list = [
    'apocalypse', 'aura', 'chrysalis', 'dream', 'galaxy', 'hidden',
    'monolith', 'moon', 'olympus', 'ornamental', 'rainbow', 'seasonal',
    'snowflake', 'sun', 'treasure'
  ];
  var rift_list = [ 'rift' ];
  var gem_list = [ 'gemstone', 'crystalline' ];

  var breed_list = element_list.concat(epic_list,rift_list);
  var concat_list = breed_list.concat(gem_list);

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

  var opposite = {
    'plant':            'metal',
    'fire':             'cold',
    'earth':            'air',
    'lightning':        'water',
    'light':            'dark'
  };
  Object.keys(opposite).each(function (key) {
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
    var query = breed_query(d1,d2,beb);
    var list = [];

    if (opposite_primary(query)) {
      // opposite primaries cannot be bred directly
    } else if (same_primary(query)) {
      list = primary_dragons(query['elements']);
    } else {
      if (opposite_elements(query)) {
        list = primary_dragons(query['elements']);
      }
      Object.keys(dragons).each(function (dkey) {
        if (breedable(dragons[dkey],query)) { list.push(dkey); }
      });
    }
    if (list.length > 0) {
      return list.uniq();
    } else {
      return false;
    }
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// breed query

  function breed_query (d1, d2, beb) {
    var query = {
      'd1':     dragons[d1],
      'd2':     dragons[d2],
      'beb':    beb,
      'tags':   { 'any dragons': 1 }
    };
    $w('d1 d2').each(function (key) {
      var tags; if (query[key]['tags']) {
        tags = query[key]['tags'];
      } else {
        tags = dragon_tags(query[key]);
        query[key]['tags'] = tags;
      }
      Object.keys(tags).each(function (tag) {
        query['tags'][tag] = 1;
        query['tags'][key + '.' + tag] = 1;
      });
    });
    var list; if (list = breed_elements(query)) {
      var elements = Object.keys(list['any']);
      var n = elements.length;
      var d = Object.keys(list['dream']).length;

      query['elements'] = elements;
      query['n_elements'] = n;

      if (n >= 4) { query['tags']['four elements'] = 1; }
      if (d >= 2) { query['tags']['dream elements'] = 1; }
    }
    return query;
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// dragon tags

  function dragon_tags (dragon) {
    var tags = {};

    tags[dragon['name']] = 1;
    tags[dragon['type']] = 1;

    var list; if (list = dragon['elements']) {
      list.each(function (e) { tags[e] = 1; });
    }
    var latent; if (latent = dragon['latent']) {
      latent.each(function (e) { tags[e] = 1; });
    }
    if (dragon['rifty']) {
      tags['rifty'] = 1;
    }
    return tags;
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// compile breed elements

  function breed_elements (query) {
    var list = { 'any': {}, 'dream': {} };

    $w('d1 d2').each(function (key) {
      var tags; if (tags = query[key]['tags']) {
        Object.keys(tags).each(function (tag) {
          if (is_breed_element(tag)) {
            list['any'][tag] = tag;

            if (tag != 'light' && tag != 'dark') {
              list['dream'][tag] = tag;
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
    var list = query['elements'].filter(function (elem) {
      return is_base_element(elem);
    });
    return (list.length == 2 && is_opposite(list[0],list[1]));
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// list primary dragons by element

  function primary_dragons (elements) {
    var want = {}; elements.each(function (e) { want[e] = true; });
    var list = [];

    Object.keys(dragons).each(function (dkey) {
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

  function breedable (dragon, query) {
    if (check_available(dragon,query)) {
      var reqs; if (dragon['reqs_compiled']) {
        reqs = dragon['reqs_compiled'];
      } else {
        reqs = compile_reqs(dragon);
        dragon['reqs_compiled'] = reqs;
      }
      var yn = false; reqs.each(function (req) {
        if (! yn) {
          var need = Object.keys(req);
          var have = query['tags'];
          var miss = false;

          need.each(function (tag) {
            if (! have[tag]) { miss = true; }
          });
          if (! miss) { yn = true; }
        }
      });
      return yn;
    }
    return false;
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// check available

  function check_available (dragon, query) {
    if (dragon['available'] == 'never')   { return false; }
    if (query['beb'])                     { return true; }
    if (/^yes/.test(dragon['available'])) { return true; }

    var d1; if (d1 = query['d1']) {
      if (dragon['name'] == d1['name'])   { return true; }
    }
    var d2; if (d2 = query['d2']) {
      if (dragon['name'] == d2['name'])   { return true; }
    }
    return false;
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// compile requirements

  function compile_reqs (dragon) {
    var list = [ [ dragon['name'] ] ].concat(dragon['reqs']);
    var reqs = [];

    list.each(function (set) {
      var req = {}; set.each(function (tag) {
        req[tag] = 1;
      });
      if (dragon['type'] == 'rift') {
        req['d1.rifty'] = 1;
        req['d2.rifty'] = 1;
      }
      reqs.push(req);
    });
    return reqs;
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// sort by breed time

  function sort_by_time (list) {
    return list.sort(function (a, b) {
      if      (dragons[a]['time'] < dragons[b]['time']) { return -1; }
      else if (dragons[a]['time'] > dragons[b]['time']) { return  1; }
      else if (dragons[a]['name'] < dragons[b]['name']) { return -1; }
      else if (dragons[a]['name'] > dragons[b]['name']) { return  1; }
      return 0;
    });
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// weighted breed list

  function weight_calc (d1, d2, list) {
    var tidal = (d1 == 'Tidal_Dragon' || d2 == 'Tidal_Dragon');
    var total = 0;
    var weighted = {};

    list.each(function (key) {
      var w = dragon_weight(key);
      if (tidal) { w = (10 / w); }

      weighted[key] = w;
      if (key == d1) { weighted[key] *= 1.5; }
      if (key == d2) { weighted[key] *= 1.5; }

      total += weighted[key];
    });
    list.each(function (key) {
      weighted[key] = ((weighted[key] / total) * 100);
    });
    return weighted;
  }
  function dragon_weight (key) {
    var w; if (w = weight[key]) {
      return w;
    } else if (w = weight[dragons[key]['type']]) {
      return w;
    }
    return weight['default'];
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// format breed time

  function fmt_breed_time (key, fast) {
    var t; if (t = dragons[key]['time']) {
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
    if (t > 0 && t < 60) {
      var text = sprintf('%d sec',Math.floor(t + 0.5));
      var attr = { 'style': 'white-space: nowrap;' };

      return Builder.node('span',attr,text);
    } else {
      var d; if (t > 86400) {
          d = Math.floor(t / 86400);   t = (t % 86400);
      }
      var h = Math.floor(t /  3600);   t = (t %  3600);
      var m = Math.floor(t /    60);   t = (t %    60);
      var s = Math.floor(t);

      if (d) {
        return sprintf('%d:%02d:%02d:%02d',d,h,m,s);
      } else if (h) {
        return sprintf(     '%d:%02d:%02d',  h,m,s);
      } else {
        return sprintf(          '%d:%02d',    m,s);
      }
    }
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// hack dragons

  Object.keys(dragons).each(function (key) {
    dragons[key]['tags'] = dragon_tags(dragons[key]);
    dragons[key]['time'] = parseInt(dragons[key]['time']);
    dragons[key]['dhms'] = fmt_dhms(dragons[key]['time']);
  });

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
