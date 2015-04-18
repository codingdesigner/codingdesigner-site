module.exports = function (grunt, options) {
  "use strict";
  var files = [
    '!<%= package.paths.patternlab %>/js/modernizr*.js',
    '<%= package.paths.patternlab %>/js/source/*.js'
  ];
  return {
    "watch": {
      files: files,
      tasks: [
        'shell:livereload',
        'newer:jshint:js'
      ]
    },
    "jshint": {
      "options": {
        "force": true,
        "jshintrc": ".jshintrc"
      },
      "src": files
    }
  };
};
