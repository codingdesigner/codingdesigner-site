module.exports = function (grunt, options) {
  "use strict";
  var _ = require('underscore');
  var files = {
    "all": [
      '<%= package.paths.patternlab %>/source/scss/**/*.scss',
      '!<%= package.paths.patternlab %>/source/scss/**/*scsslint_tmp*.scss'
    ],
    "lint": [
      '<%= package.paths.patternlab %>/source/scss/**/*.scss',
      '!<%= package.paths.patternlab %>/source/scss/vendor/*.scss',
    ]
  };

  var tasks = [
    'shell:scss_compile',
    'newer:pattern_lab_component_builder',
    'shell:livereload',
    'newer:scsslint:scss'
  ];

  if (options.custom.patternLab === false) {
    tasks = _.without(tasks, "newer:pattern_lab_component_builder");
  }

  grunt.registerTask('compass_compile', ['shell:scss_compile']);
  grunt.registerTask('compass_watch', ['shell:scss_watch']);

  return {
    watch: {
      files: files.all,
      tasks: tasks
    },
    shell__compile: {
      command: 'cd <%= package.paths.patternlab %> && bundle exec compass compile'
    },
    shell__watch: {
      command: 'cd <%= package.paths.patternlab %> && bundle exec compass watch'
    },
    scsslint: {// https://www.npmjs.org/package/grunt-scss-lint
      src: files.lint
    },
    scsslint__strict: {
      options: {
        config: '../.scss-lint--strict.yml'
      },
      src: files.lint
    }
  };
};
