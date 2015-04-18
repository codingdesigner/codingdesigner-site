#!/bin/bash
cd `dirname $0`
cd ../
php core/builder.php --watch
cd -
