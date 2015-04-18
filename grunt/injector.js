module.exports = function(grunt, options) {
  "use strict";
  return {
    // https://github.com/klei/grunt-injector
    options: {
      addRootSlash: false,
      ignorePath: [],
      transform: function (filepath) {
        var newfilepath = filepath.replace("../", "../../");
        return '<script src="' + newfilepath + '"></script>';
      }
    }
  };
};
