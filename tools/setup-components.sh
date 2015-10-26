#!/bin/sh

TOP_DIR="`pwd`"

DIRS="
static/components/iron-collapse
static/components/polymer
"

SOFT_LINKS="
es6-promise
fetch
webcomponentsjs
"

TO_EXTERNALIZE="
iron-collapse/iron-collapse
polymer/polymer
polymer/polymer-micro
polymer/polymer-mini
"

echo "Setting up components..."
rm -rf static/components

for dir in $DIRS; do
  mkdir -p $dir
done

for soft_link in $SOFT_LINKS; do
  cd static/components
  ln -s ../../bower_components/$soft_link
  cd $TOP_DIR
done

for doc in $TO_EXTERNALIZE; do
  crisper --source bower_components/$doc.html --html static/components/$doc.html --js static/components/$doc.js
done
echo "Done."
