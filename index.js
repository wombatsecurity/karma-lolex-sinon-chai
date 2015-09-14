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
  var isDuplicate = function(file) {
    return !!_(files).map('pattern').find(endsWith(path.relative(__dirname, file)));
  }

  /* Sinon */
  var sinonRoot = path.resolve(require.resolve('sinon'), '../../')
  var sinonPath = path.resolve(sinonRoot, 'pkg/sinon.js');
  var sinonTimersPath = path.resolve(sinonRoot, 'pkg/sinon-timers.js');
  if (!isDuplicate(sinonPath)) {
    files.unshift(pattern(sinonTimersPath));
    files.unshift(pattern(sinonPath));
  }

  /* Chai */
  var chaiPath = path.resolve(require.resolve('chai'), '../chai.js');
  if (!isDuplicate(chaiPath)) {
    files.unshift(pattern(chaiPath));
    files.push(pattern(path.join(__dirname, 'chai-adapter.js')));
  }

  /* Sinon-Chai */
  var sinonChaiPath = path.resolve(require.resolve('sinon-chai'));
  if (!isDuplicate(sinonChaiPath)) {
    files.push(pattern(sinonChaiPath))
  }
};

framework.$inject = ['config.files'];
module.exports = {'framework:sinon-chai': ['factory', framework]};
