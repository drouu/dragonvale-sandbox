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
      var option = Builder.node('option', { 'value': key }, [ dragons[key]['name'] ]);
      $('d1').insert(option);
      $('d2').insert(option);
    });
    alert('done');
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// showtime

  document.observe('dom:loaded',init_sandbox);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
