#!/bin/sh

DIRS="
static/components/iron-collapse
static/components/polymer
"

for dir in $DIRS; do
  mkdir -p $dir
done

TO_EXTERNALIZE="
iron-collapse/iron-collapse
polymer/polymer
polymer/polymer-micro
polymer/polymer-mini
"

echo "Externalizing scripts..."
for doc in $TO_EXTERNALIZE; do
  crisper --source bower_components/$doc.html --html static/components/$doc.html --js static/components/$doc.js
done
echo "Done."
