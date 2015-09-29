var path = require('path');

var isNode = typeof module !== "undefined" && module.exports && typeof require === "function";
var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;

var pattern = function(file) {
  return {pattern: file, included: true, served: true, watched: false};
};

var endsWith = function(substr) {
  return function(str) {
    return str.indexOf(substr) >= 0 && str.indexOf(substr) === (str.length - substr.length);
  };
};

var _isDuplicate = function(files, file) {
  var result = false;
  for (var i = 0; i < files.length; i++) {
    var pattern = files[i].pattern
    result = result || endsWith(path.relative(__dirname, file))(pattern);
  }
  return result;
}

function loadDependencies(require, epxorts, module, lolex) {
    var core = require("./core");
    makeApi(core, lolex);
    module.exports = core;
}



var framework = function(files) {
  var isDuplicate = _isDuplicate.bind(this, files);
  
  var sinonRoot = path.resolve(require.resolve('sinon'), '../../');
  
  /* Lolex (needed for Sinon if no AMD or NodeJS) */
  var lolexPath = path.resolve(require.resolve('lolex'), '../../lolex.js');
  if (!isDuplicate(lolexPath)) {
    files.unshift(pattern(lolexPath));
  }
  
  /* Sinon */
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
