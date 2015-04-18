module.exports = {
  // https://github.com/sindresorhus/grunt-shell
  update_bundler: {
    command: 'cd <%= package.paths.patternlab %> && bundle install'
  },
  update_bower: {
    command: 'cd <%= package.paths.patternlab %> && bower install'
  },
  update_node: {
    command: 'npm install && find node_modules/ -name "*.info" -type f -delete'
  },
  report_partials: {
    command: 'cd source/_patterns/ && grep -rin "{{>" . | sed "s,.*{>,,g" | sed "s,(.*,,g" | sed "s,}.*,,g" | tr -d " " | sort | uniq -c | sort -rn'
  }
};
