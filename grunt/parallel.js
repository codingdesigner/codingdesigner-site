module.exports = function(grunt, options) {
  "use strict";
  // https://www.npmjs.org/package/grunt-parallel

  var tasks = [
    {
      grunt: true,
      stream: true,
      args: ['watch:js']
    },
    {
      grunt: true,
      stream: false,
      args: ['watch:livereload']
    },
    //{
    //  grunt: true,
    //  stream: true,
    //  args: ['watch:icons']
    //},
    {
      grunt: true,
      stream: true,
      args: ['watch:scss']
    }
  ];

  if (options.custom.patternLab) {
    tasks.push({
      grunt: true,
      stream: true,
      args: ['watch:pl']
    }, {
      grunt: true,
      stream: false,
      args: ['connect:pl']
    });
  }


  return {
    watch: {
      tasks: tasks
    }
  };
};
