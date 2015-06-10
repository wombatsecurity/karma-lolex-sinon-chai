var path = require('path');
var _ = require('lodash');

var pattern = function(file) {
  return {pattern: file, included: true, served: true, watched: false};
};

var endsWith = function(substr) {
  return function(str) {
    return str.indexOf(substr) >= 0 && str.indexOf(substr) === (str.length - substr.length);
  };
};

var framework = function(files) {
  files.unshift(pattern(path.resolve(require.resolve('sinon-chai'))));

  var sinonPath = path.resolve(require.resolve('sinon'), '../sinon.js');
  if (!_(files).map('pattern').find(endsWith(path.relative(__dirname, sinonPath)))) {
    var sinonBasePath = path.dirname(sinonPath);
    var sinonFiles = [
      "./sinon.js",
      "./sinon/util/core.js",
      "./sinon/extend.js",
      "./sinon/typeOf.js",
      "./sinon/times_in_words.js",
      "./sinon/spy.js",
      "./sinon/call.js",
      "./sinon/behavior.js",
      "./sinon/stub.js",
      "./sinon/mock.js",
      "./sinon/collection.js",
      "./sinon/assert.js",
      "./sinon/sandbox.js",
      "./sinon/test.js",
      "./sinon/test_case.js",
      "./sinon/match.js",
      "./sinon/format.js",
      "./sinon/log_error.js"
    ];

    _.forEach(sinonFiles.reverse(), function(relativeFile) {
      var absoluteFile = path.join(sinonBasePath, relativeFile);

      files.unshift(pattern(absoluteFile));
    });
  }

  var chaiPath = path.resolve(require.resolve('chai'), '../chai.js');
  if (!_(files).map('pattern').find(endsWith(path.relative(__dirname, chaiPath)))) {
    files.unshift(pattern(chaiPath));
    files.push(pattern(path.join(__dirname, 'chai-adapter.js')));
  }
};

framework.$inject = ['config.files'];
module.exports = {'framework:sinon-chai': ['factory', framework]};
