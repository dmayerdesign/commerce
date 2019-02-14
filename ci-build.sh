#!/bin/bash

# Die on errors and echo when executing a command.
set -ex

# Build the project.
./qb build --env=$ENVIRONMENT

# Assemble the bundle.
mkdir bundle

cp -r dist bundle/
cp -r package.json bundle/
cp -r tsconfig.json bundle/
cp -r tsconfig-paths-bootstrap.js bundle/
cp -r node_modules bundle/

# Compress the bundle.
zip -r bundle.zip bundle/.
