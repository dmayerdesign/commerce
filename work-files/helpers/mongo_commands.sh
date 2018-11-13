return;

# Local to cloud
cd /data/db
mongodump --db hyzershop --out /data/db/migrate
mongorestore -h ds117859.mlab.com:17859 -d hyzershop -u dannymayer -p Kounice372 /data/db/migrate/hyzershop

# Cloud to local
cd /data/db
mongodump -h ds117859.mlab.com:17859 -d hyzershop -u dannymayer -p Kounice372 -o /data/db/migrate
mongorestore --db hyzershop /data/db/migrate/hyzershop

# Local restore from local backup
mongorestore --db hyzershop /data/db/migrate/hyzershop

# Connect to shell
mongo ds117859.mlab.com:17859/hyzershop -u dannymayer -p Kounice372

# Export to JSON
mongoexport --db hyzershop --collection products --out /Users/danielmayer/Apps/angular-express-ecommerce/products.json --jsonArray --pretty
