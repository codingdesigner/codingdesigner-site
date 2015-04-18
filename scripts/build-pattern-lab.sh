#!/bin/bash
cd `dirname $0`
cd ../
echo ""
echo "---Installing any Ruby Dependencies---"
bundle install
echo ""
echo "---Compiling CSS---"
bundle exec compass compile
echo ""
echo "---Building Pattern Lab---"
cd .
php core/builder.php --generate

