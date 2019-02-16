#!/bin/bash

mkdir -p bundle
# cp package.json bundle/
# cp tsconfig.json bundle/
# cp tsconfig-paths-bootstrap.js bundle/
cp dist/server/server.js bundle/
cd bundle
zip ../bundle.zip server.js
cd ..
