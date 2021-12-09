'use strict';

var http = require('http');
var https = require('https');
var cheerio = require('cheerio');

function parse(url, selectors, cb) {
  httpGet(url, function(err, htmlString) {
    if (err) {
      cb(err);
      return;
    }

    parseHtml(htmlString, selectors, cb);
  });
}

function httpGet(url, cb) {
  var protocol = url.indexOf('https://') > -1 ? https : http;
  var req = protocol.get(url, function(res) {
    if (res.statusCode !== 200) {
      cb(new Error('Status Code: ' + res.statusCode));
      return;
    }

    var buff = '';
    res.setEncoding('utf8');

    res.on('data', function(chunk) {
      buff += chunk;
    });

    res.on('end', function() {
      cb(null, buff);
    });

    res.on('error', function(err) {
      cb(err);
    });
  });

  req.on('error', function(err) {
    cb(err);
  });
}

function parseHtml(htmlString, selectors, cb) {
  var $ = cheerio.load(htmlString);
  cb(null, $, $(selectors));
}

module.exports = parse;
