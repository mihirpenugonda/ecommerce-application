// Gets all the node js releases that come with a Raspberry Pi compilation

'use strict';

var Parser = require('../index.js');

var url = 'https://nodejs.org/dist/';
Parser.parse(url, 'a', mainPage);

function mainPage(err, $, $elements) {
  if (err) {
    throw err;
  }

  $elements.each(function(index, element) {
    var $element = $(element);
    var href = $element.attr('href');

    if (href.charAt(0) === 'v') {
      Parser.parse(url + href, 'a', releasePage);
    }
  });
}

function releasePage(err, $, $elements) {
  if (err) {
    throw err;
  }

  $elements.each(function(index, element) {
    var $element = $(element);
    var text = $element.text();
    if (text.indexOf('pi') > -1) {
      console.log(text);
    }
  });
}
