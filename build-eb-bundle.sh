#!/bin/bash

mkdir -p tmp
cp package.json tmp/
cp tsconfig.json tmp/
cp tsconfig-paths-bootstrap.js tmp/
# cp dist/server/server.js tmp/
cd tmp
# zip ../bundle.zip server.js
# zip -r ../bundle.zip ./
tar -zcvf ../bundle.tar.gz -C bundle .
# gtar -zcvf ../bundle.tar.gz --transform='!^[^\/]*\/!!' *
cd ..
