module.exports = function (grunt, options) {
  "use strict";

  function getOpenConfig() {
    var defaultURL = "http://0.0.0.0:9001/?p=all";
    if (options.custom.openBrowserAtStart !== true) {
      return options.custom.openBrowserAtStart;
    } else {
      return defaultURL;
    }
  }

  grunt.registerTask('startServer', ['connect:pl']);
  grunt.registerTask('buildPL', ['shell:pl_build']);
  grunt.registerTask('watchPL', ['watch:pl']);


  return {
    watch: {
      files: [
        'source/**/*',
        '!**/source/scss/**/*', // ignore sass compiles
        '!**/source/css/*.css.map', // ignore source map
        '!**/source/images/icons/src/**', // watch:icons has this
        '!**/source/images/icons/templates/*', // watch:icons has this
        '!**/source/images/icons/unused-library/*', // watch:icons has this
        //'!**/source/images/icons/output/**', // watch:icons has this
        '!**../bower_components/**' // IGNORE bower_components
      ],
      tasks: [
        'shell:pl_build',
        'shell:livereload'
      ]
    },
    shell__build: {
      command: 'php core/builder.php --generate --nocache'
    },
    //shell__watch: {
    //  command: 'php core/builder.php --watch --autoreload --nocache'
    //},
    connect: { // https://www.npmjs.org/package/grunt-contrib-connect
      options: {
        port: 9001,
        useAvailablePort: true,
        base: 'public',
        keepalive: true,
        livereload: true,
        open: getOpenConfig()
      }
    },
    pattern_lab_component_builder__colors: {
      options: {
        'regex': "^\\$color--.*",
        'allow_var_values': false
      },
      src: 'source/scss/00-global/02-variables/_colors.scss',
      dest: 'source/_patterns/00-atoms/01-global/00-colors.json'
    },
    //pattern_lab_component_builder__fonts: {
    //  options: {
    //    'regex': "^\\$type.*"
    //  },
    //  src: "source/scss/global/variables/_type-sizes.scss",
    //  dest: "source/_patterns/00-atoms/02-text/02-type-sizes.json"
    //},
    pattern_lab_component_builder__breakpoints: {
      options: {
        'regex': '^\\$bp--.*',
        'allow_var_values': false
      },
      src: "source/scss/00-global/02-variables/_breakpoints.scss",
      dest: "source/_patterns/01-molecules/01-layout/99-breakpoints.json"
    },
    pattern_lab_component_builder__animations: {
      options: {
        'regex': "^\\$default-tra.*"
      },
      src: "source/scss/00-global/02-variables/_settings.scss",
      dest: "source/_patterns/00-atoms/01-global/03-animations.json"
    }
  };
};
