// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// dvbox/controller.js
//
// by drow <drow@bin.sh>
// http://creativecommons.org/publicdomain/zero/1.0/
//
// requires Prototype

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// init sandbox

  function init_sandbox () {
    Object.keys(dragons).sort().each(function (key) {
      var attr = { 'value': key };
      var name = dragons[key]['name'];

      $('d1').insert(Builder.node('option',attr,name));
      $('d2').insert(Builder.node('option',attr,name));
    });
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// showtime

  document.observe('dom:loaded',init_sandbox);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
