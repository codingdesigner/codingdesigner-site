"use strict";
module.exports = function(grunt) {
  require('time-grunt')(grunt); // shows how long grunt tasks take ~ https://github.com/sindresorhus/time-grunt
  var drupalInfoJS = [];
  var files = {
    "js": [
      '<%= pkg.paths.drupal_base %>/js/*.js',
      '<%= pkg.paths.drupal_base %>/template_api/**/*.js', // times out due to too many errors - uh oh
      '!<%= pkg.paths.drupal_base %>/js/modernizr*.js',
      '<%= pkg.paths.patternlab %>/js/source/*.js'
    ]
  };
  var env = process.env;
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    shell: {// https://github.com/sindresorhus/grunt-shell
      pattern_lab_build: {
        command: 'php core/builder.php --generate --nocache'
      },
      pattern_lab_watch: {
        command: 'php core/builder.php --watch --autoreload --nocache'
      },
      update_bundler: {
        command: 'cd <%= pkg.paths.drupal_us %> && bundle install'
      },
      update_bower: {
        command: 'cd <%= pkg.paths.drupal_base %> && bower install'
      },
      compass_compile: {
        command: 'cd <%= pkg.paths.drupal_us %> && bundle exec compass compile'
      },
      compass_watch: {
        command: 'cd <%= pkg.paths.drupal_us %> && bundle exec compass watch'
      },
      update_node: {
        command: 'npm install && find node_modules/ -name "*.info" -type f -delete'
      },
      trigger_reload: {
        command: 'touch change-to-reload.txt'
      },
      report_pattern_states: {
        command: 'cd source/_patterns/ && find . -name "*@*.mustache"'
      },
      report_partials: {
        command: 'cd source/_patterns/ && grep -rin "{{>" . | sed "s,.*{>,,g" | sed "s,(.*,,g" | sed "s,}.*,,g" | tr -d " " | sort | uniq -c | sort -rn'
      },
      drupal_flush: {
        command: 'cd <%= pkg.paths.drupal_core %> && drush cc elc && drush cc all'
      },
      scsslint: {
        options: {
          failOnError: false
        },
        command: 'cd <%= pkg.paths.drupal_us %> && bundle exec scss-lint --config=../mac_base/.scss-lint.yml --exclude=../mac_base/scss/vendor/*.scss ../mac_base/scss/'
      }
    },

    connect: {// https://www.npmjs.org/package/grunt-contrib-connect
      server: {
        options: {
          port: 9001,
          useAvailablePort: true,
          base: '../../../../..',
          keepalive: true,
          livereload: true,
          open: "http://0.0.0.0:9001/sites/maccosmetics/themes/mac_base/pattern-lab/public/?p=pages-homepage-1"
        }
      }
    },

    watch: {// https://github.com/gruntjs/grunt-contrib-watch
      source: {
//        options: {
//          spawn: false
//        },
        files: [
          'source/**/*',
          '!**/source/images/icons/src/**', // watch:icons has this
          '!**/source/images/icons/templates/*', // watch:icons has this
          '!**/source/images/icons/unused-library/*', // watch:icons has this
          //'!**/source/images/icons/output/**', // watch:icons has this
          '!**../bower_components/**' // IGNORE bower_components
        ],
        tasks: [
          'shell:pattern_lab_build',
          'shell:trigger_reload'
        ]
      },
      scss: {
        files: [
          '<%= pkg.paths.drupal_base %>/scss/**/*.scss'
        ],
        tasks: [
          'compass_compile',
          'newer:pattern_lab_component_builder',
          //'shell:pattern_lab_build',
          'shell:trigger_reload',
          'newer:scsslint:scss'
        ]
      },
      reloader: {
        options: {
          livereload: true
        },
        files: ['change-to-reload.txt']
      },
      icons: {
        files: [
        '<%= pkg.paths.drupal_base %>/images/icons/src/**/*',
        '<%= pkg.paths.drupal_base %>/images/icons/templates/*'
        ],
        tasks: ['create_font_icons']
      },
      js: {
        files: files.js,
        tasks: [
          'shell:trigger_reload',
          'newer:jshint:js'
        ]
      },
      drupal_files: {
        files: [
          '<%= pkg.paths.drupal_core %>/template_api/**/*.mustache',
          '<%= pkg.paths.drupal_core %>/template_api/**/*.inc',
          '<%= pkg.paths.drupal_core %>/templates/**/*.tpl.php'
        ],
        tasks: [
          'shell:drupal_flush',
          'shell:trigger_reload'
        ]
      }
    },

    parallel: {// https://www.npmjs.org/package/grunt-parallel
      watch: {
        tasks: [
          {
            grunt: true,
            stream: false,
            args: ['connect:server']
          },
          {
            grunt: true,
            stream: true,
            args: ['watch:scss']
          },
          {
            grunt: true,
            stream: true,
            args: ['watch:js']
          },
          {
            grunt: true,
            stream: true,
            args: ['watch:source']
          },
          {
            grunt: true,
            stream: false,
            args: ['watch:reloader']
          },
          {
            grunt: true,
            stream: true,
            args: ['watch:icons']
          },
          {
            grunt: true,
            stream: true,
            args: ['watch:drupal_files']
          }
        ]
      }
    },

    jshint: {// https://www.npmjs.org/package/grunt-contrib-jshint
      options: {
        force: true,
        jshintrc: '../.jshintrc' // change settings there
      },
      js: {
        src: files.js
      }
    },

    scsslint: {// https://www.npmjs.org/package/grunt-scss-lint
      options: {
        bundleExec: '<%= pkg.paths.drupal_us %>',
        config: '../.scss-lint.yml',
        force: true,
        maxBuffer: 999999,
        //reporterOutput: 'scss-lint-report.xml',
        colorizeOutput: true,
        compact: true,
        exclude: '<%= pkg.paths.drupal_base %>/scss/patternlab/*.scss'
      },
      scss: {
        src: [
          '<%= pkg.paths.drupal_base %>/scss/**/*.scss',
          '!<%= pkg.paths.drupal_base %>/scss/vendor/*.scss',
          '!<%= pkg.paths.drupal_base %>/scss/_mac-base.scss'
        ]
      },
      strict: {
        options: {
          config: '../.scss-lint--strict.yml'
        },
        src: [
          '<%= pkg.paths.drupal_base %>/scss/**/*.scss',
          '!<%= pkg.paths.drupal_base %>/scss/vendor/*.scss',
          '!<%= pkg.paths.drupal_base %>/scss/_mac-base.scss'
        ]
      },
      json: {
        options: {
          format: 'JSON',
          out: 'temp-scsslint.json'
        },
        src: [
          '<%= pkg.paths.drupal_base %>/scss/**/*.scss',
          '!<%= pkg.paths.drupal_base %>/scss/vendor/*.scss',
          '!<%= pkg.paths.drupal_base %>/scss/_mac-base.scss'
        ]
      }
    },
    
    jsonlint: {
      pl: {
        src: 'source/_patterns/**/*.json'
      }
    },

    webfont: {// https://github.com/sapegin/grunt-webfont
      icons: {
        src: '<%= pkg.paths.drupal_base %>/images/icons/src/*.svg',
        dest: '<%= pkg.paths.drupal_base %>/images/icons/output/fonts',
        destCss: '<%= pkg.paths.drupal_base %>/scss/global/icons',
        options: {
          engine: "node",
          stylesheet: 'scss',
          relativeFontPath: '<%= pkg.paths.drupal_base %>/images/icons/output/fonts/',
          template: '<%= pkg.paths.drupal_base %>/images/icons/templates/icons.template.css',
          htmlDemo: true,
          htmlDemoTemplate: '<%= pkg.paths.drupal_base %>/images/icons/templates/08-icons.html',
          destHtml: 'source/_patterns/00-atoms/05-images/',
          hashes: false
        }
      }
    },

    notify: {// https://github.com/dylang/grunt-notify
      build: {
        options: {
          message: 'Build Complete'
        }
      },
      done: {
        options: {
          message: 'Done!'
        }
      }
    },

    prompt: {// https://github.com/dylang/grunt-prompt

    },

    open: {
      dev: {
        path: 'public/index.html',
        app: 'Google Chrome'
      },
      stage: {
        path: 'http://mac.elc.p2devcloud.com/',
        app: 'Google Chrome'
      },
      jira: {
        path: 'https://elcjira.atlassian.net/browse/MAC'
      },
      config_grunt: {
        path: 'Gruntfile.js'
      },
      config_bundler: {
        path: '<%= pkg.paths.drupal_us %>/Gemfile'
      },
      config_compass: {
        path: '<%= pkg.paths.drupal_us %>/config.rb'
      },
      config_bower: {
        path: '<%= pkg.paths.drupal_base %>/bower.json'
      },
      edit_readme: {
        path: 'README.md'
      },
      pl_docs: {
        path: "http://patternlab.io/docs/index.html"
      }
    },

    pattern_lab_component_builder: {
      colors: {
        options: {
          'regex': "^\\$color--.*",
          'allow_var_values': false
        },
        src: '<%= pkg.paths.drupal_base %>/scss/global/variables/_colors.scss',
        dest: 'source/_patterns/00-atoms/01-global/00-colors.json'
      },
      fonts: {
        options: {
          'regex': "^\\$type.*"
        },
        src: "<%= pkg.paths.drupal_base %>/scss/global/variables/_type-sizes.scss",
        dest: "source/_patterns/00-atoms/02-text/02-type-sizes.json"
      },
      breakpoints: {
        options: {
          'regex': '^\\$width.*',
          'allow_var_values': false
        },
        src: "<%= pkg.paths.drupal_base %>/scss/global/variables/_breakpoints.scss",
        dest: "source/_patterns/01-molecules/01-layout/99-breakpoints.json"
      },
      animations: {
        options: {
          'regex': "^\\$default-tra.*"
        },
        src: "<%= pkg.paths.drupal_base %>/scss/global/variables/_settings.scss",
        dest: "source/_patterns/00-atoms/01-global/03-animations.json"
      }
    },

    modernizr: {

      dist: {
        // [REQUIRED] Path to the build you're using for development.
        "devFile" : "<%= pkg.paths.drupal_base %>/js/modernizr-dev.js",

        // [REQUIRED] Path to save out the built file.
        "outputFile" : "<%= pkg.paths.drupal_base %>/js/modernizr-custom.js",

        // Based on default settings on http://modernizr.com/download/
        "extra" : {
          "shiv" : true,
          "printshiv" : false,
          "load" : true,
          "mq" : false,
          "cssclasses" : true
        },

        // Based on default settings on http://modernizr.com/download/
        "extensibility" : {
          "addtest" : false,
          "prefixed" : false,
          "teststyles" : false,
          "testprops" : false,
          "testallprops" : false,
          "hasevents" : false,
          "prefixes" : false,
          "domprefixes" : false
        },

        // By default, source is uglified before saving
        "uglify" : true,

        // Define any tests you want to implicitly include.
        "tests" : [],

        // By default, this task will crawl your project for references to Modernizr tests.
        // Set to false to disable.
        "parseFiles" : true,

        // When parseFiles = true, this task will crawl all *.js, *.css, *.scss files, except files that are in node_modules/.
        // You can override this by defining a "files" array below.
        "files" : {
          "src": [
              "<%= pkg.paths.drupal_base %>/js/**/*.js",
              "<%= pkg.paths.drupal_base %>/scss/**/*.scss"
          ]
        },

        // When parseFiles = true, matchCommunityTests = true will attempt to
        // match user-contributed tests.
        "matchCommunityTests" : false,

        // Have custom Modernizr tests? Add paths to their location here.
        "customTests" : []
      }

    },

    wiredep: {// https://github.com/stephenplusplus/grunt-wiredep

      patternlab: {

        // Point to the files that should be updated when you run `grunt wiredep`
        src: [
          'source/_patterns/00-atoms/00-meta/**/*.mustache'
        ],

        // Optional:
        // ---------
        directory: '<%= pkg.paths.drupal_base %>/js/bower_components',
        bowerJson: require('../bower.json'),
        //cwd: '<%= pkg.paths.drupal_base %>/',
        dependencies: true,
        devDependencies: false,
        // ignore js files used for IE shims, inject manually
        exclude: [
          '<%= pkg.paths.drupal_base %>/js/bower_components/html5shiv/dist/html5shiv.js',
          '<%= pkg.paths.drupal_base %>/js/bower_components/respond/dest/respond.src.js',
          '<%= pkg.paths.drupal_base %>/js/bower_components/selectivizr/selectivizr.js',
          '<%= pkg.paths.drupal_base %>/js/bower_components/select2/select2.css',
          '<%= pkg.paths.drupal_base %>/js/bower_components/sidr/index.js'
        ],
        ignorePath: '../../../../../',
        fileTypes: {
          mustache: {
            block: /(([ \t]*)<!--\s*bower:*(\S*)\s*-->)(\n|\r|.)*?(<!--\s*endbower\s*-->)/gi,
            detect: {
              js: /<script.*src=['"]([^'"]+)/gi,
              css: /<link.*href=['"]([^'"]+)/gi
            },
            replace: {
              js: '<script src="{{ drupal_theme_mac_base_path }}{{filePath}}"></script>',
              css: '<link rel="stylesheet" href="{{ drupal_theme_mac_base_path }}{{filePath}}" />'
            }
          }
        }
        //overrides: {}
      }
    //
    //  drupal: {
    //    src: '<%= pkg.paths.drupalTheme %>mac.info',
    //    devDependencies: false,
    //    exclude: [
    //      '../bower_components/html5shiv/dist/html5shiv.js',
    //      '../bower_components/respond/dest/respond.src.js',
    //      '../bower_components/selectivizr/selectivizr.js',
    //      '../bower_components/select2/select2.css',
    //      '../bower_components/sidr/index.js'
    //    ],
    //    fileTypes: {
    //      info: {
    //        block: /(([ \t]*);\s*bower:*(\S*))(\n|\r|.)*?(;\s*endbower)/gi,
    //        detect: {
    //          js: /<script.*src=['"]([^'"]+)/gi,
    //          css: /<link.*href=['"]([^'"]+)/gi
    //        },
    //        replace: {
    //          js: 'scripts[] = <%= pkg.paths.patternlab %>{{filePath}}',
    //          css: 'stylesheets[] = <%= pkg.paths.patternlab %>{{filePath}}'
    //        }
    //      }
    //    }
    //  }
    //
    },

    newer: {// https://github.com/tschaub/grunt-newer
      // In most cases, simply prepending `newer:` to a task, will make it only run if `src` is newer than `dest`; or if `src` is newer than last successful run.
    },

    // nearly all JS is added to PL this way (except a very small number of run-first JS in '_00-head.mustache'
    injector: {// https://github.com/klei/grunt-injector
      options: {
        addRootSlash: false,
        ignorePath: [],
        transform: function(filepath) {
          "use strict";
          var newfilepath = filepath.replace("../", "{{ drupal_theme_mac_base_path }}");
          return '<script src="' + newfilepath + '"></script>';
        }
      },
      drupal_info_JS_to_PL_head: {
        options: {
          starttag: '<!-- start:drupal_info:JS -->',
          endtag: '<!-- end:drupal_info:JS -->'
        },
        src: drupalInfoJS,
        dest: 'source/_patterns/00-atoms/00-meta/_00-head.mustache'
      },
      drupal_template_api_JS_to_PL_head: {
        options: {
          starttag: '<!-- start:drupal_template_api:JS -->',
          endtag: '<!-- end:drupal_template_api:JS -->'
        },
        src: ['../template_api/**/*.js'],
        dest: 'source/_patterns/00-atoms/00-meta/_01-foot.mustache'
      },
      //PL_only_JS_to_PL_head: {
      //  options: {
      //    starttag: '<!-- start:PL_only:JS -->',
      //    endtag: '<!-- end:PL_only:JS -->'
      //  },
      //  src: [
      //    '../js/pl/pl_load_page_data.js',
      //    '../js/bower_components/sidr/index.js',
      //    '../js/product.js',
      //    '../js/shared/product_data.js',
      //    '../js/shared/product_ui.js',
      //    '../js/modernizr-custom.js',
      //    '../pattern-lab/source/js/script.js',
      //    '../js/header.js'
      //  ],
      //  dest: 'source/_patterns/00-atoms/00-meta/_00-head.mustache'
      //},
      // this is ready to go; just needs items in `src` (or it throws errors)
      PL_only_JS_to_PL_foot: {
        options: {
          starttag: '<!-- start:foot:JS -->',
          endtag: '<!-- end:foot:JS -->'
        },
        src: [
          '../js/pl/pl_load_page_data.js',
          '../js/shared/product_data.js',
          '../js/shared/product_ui.js',
          '../js/product_product.js',
          '../js/product_modules.js',
          '../js/product_app.js',
          '../pattern-lab/source/js/script.js',
          '../js/bower_components/isotope/dist/isotope.pkgd.min.js'
        ],
        dest: 'source/_patterns/00-atoms/00-meta/_01-foot.mustache'
      },
      PL_only_JS_for_IE8_to_PL_head: {
        options: {
          starttag: '<!-- start:PL_only_JS_for_IE8:JS -->',
          endtag: '<!-- end:PL_only_JS_for_IE8:JS -->'
        },
        src: [
          '../js/bower_components/html5shiv/dist/html5shiv.js',
          '../js/bower_components/respond/dest/respond.src.js',
          '../js/bower_components/nwmatcher/src/nwmatcher.js',
          '../js/selectivizr.js'
        ],
        dest: 'source/_patterns/00-atoms/00-meta/_00-head.mustache'
      }
    }

  });

  require('load-grunt-tasks')(grunt); // loads ALL dependencies in package.json. So this is not needed: `grunt.loadNpmTasks('grunt-contrib-connect');`

  grunt.registerTask('get_JS_list_from_Drupal', "Find all the JS that Drupal is using", function() {
    var infoFiles = grunt.file.read("../mac_base_pc.info");
    infoFiles.match(/^script.*/gm).forEach(function(line) {
      "use strict";
      drupalInfoJS.push(line.replace(/^script.*= /, '../'));
    });
    //drupalInfoJS.push('../template_api/**/*.js');
    //grunt.log.writeln(JSON.stringify(drupalJS));
  });
  
  grunt.registerTask('scssJSON', '', function() {
    "use strict";
    var dest = 'source/_patterns/00-atoms/10-internals/scss-lint.json';
    var outFile = grunt.config.get('scsslint.json.options.out');
    var oldJSON = grunt.file.readJSON(outFile);
    grunt.file.delete(outFile);
    
    var newJSON = {
      "dateRan": new Date().toISOString(),
      "report": []
    };
    
    for (var prop in oldJSON) {
      if (oldJSON.hasOwnProperty(prop)) {
        newJSON.report.push({
          "file": prop,
          "errors": oldJSON[prop]
        });
      }
    }
    //console.log(JSON.stringify(newJSON, null, '\t'));
    grunt.file.write(dest, JSON.stringify(newJSON, null, '  '));
    
    //console.log(oldJSON);
  });

    //grunt.task.registerTask('foo', 'A sample task', function() {
    //    console.log(grunt.tasks);
    //});

  grunt.registerTask('compass_compile', 'shell:compass_compile');
  grunt.registerTask('compass_watch', 'shell:compass_watch');
  grunt.registerTask('plcb', 'pattern_lab_component_builder');
  grunt.registerTask('cleanup_font_icon_build', 'Renaming some stuff', function() {
    grunt.file.copy('source/_patterns/00-atoms/05-images/icons.html', 'source/_patterns/00-atoms/05-images/icons.mustache');
    grunt.file.delete('source/_patterns/00-atoms/05-images/icons.html');
  });
  grunt.registerTask('reportSCSS', [
    'scsslint:json',
    'scssJSON'
  ]);
  grunt.registerTask('watch_pl', 'shell:pattern_lab_watch');
  grunt.registerTask('build', [
    'update',
    'newer:pattern_lab_component_builder',
    'compass_compile',
    'modernizr',
    //'wiredep',
    'inject_drupal_js',
    'shell:pattern_lab_build',
    'shell:trigger_reload',
    'notify:build'
  ]);
  grunt.registerTask('update', [
    'shell:update_bundler',
    'shell:update_node',
    'shell:update_bower'
  ]);
  grunt.registerTask('qa', [
    'jsonlint',
    'jshint',
    'scsslint:scss'
  ]);
  grunt.registerTask('create_font_icons', [
    'webfont:icons',
    'cleanup_font_icon_build'
  ]);
  grunt.registerTask('inject_drupal_js', [
    'get_JS_list_from_Drupal',
    'injector'
  ]);
  grunt.registerTask('default', [
    'build',
    'parallel:watch'
  ]);

  grunt.registerTask('drush_cc_all', [
    'shell:drupal_flush',
    'shell:trigger_reload'
  ]);
};
