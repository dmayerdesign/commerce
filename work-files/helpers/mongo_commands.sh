#!/bin/bash

## Local to cloud
mongodump --db hyzershop-test --out /data/db/migrate
mongorestore --host cubie-development-cluster-shard-0/cubie-development-cluster-shard-00-00-od2pv.mongodb.net:27017,cubie-development-cluster-shard-00-01-od2pv.mongodb.net:27017,cubie-development-cluster-shard-00-02-od2pv.mongodb.net:27017 \
  --ssl \
  --username cubie-developer \
  --password <PASSWORD> \
  --authenticationDatabase admin \
  /data/db/migrate/hyzershop
  

## Cloud to local
# mongodump -h ds117859.mlab.com:17859 -d hyzershop -u dannymayer -p Kounice372 -o /data/db/migrate
# mongorestore --db hyzershop /data/db/migrate/hyzershop

## Local restore from local backup
# mongo hyzershop-test --eval "db.dropDatabase()"
# mongorestore --db hyzershop-test /data/db/migrate/hyzershop

## Connect to shell
# mongo ds117859.mlab.com:17859/hyzershop -u dannymayer -p Kounice372

## Export to JSON
# mongoexport --db hyzershop --collection products --out /Users/danielmayer/Apps/angular-express-ecommerce/products.json --jsonArray --pretty
