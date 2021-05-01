set -u
set -e
# For developers (To trace error if any)
set -E

# POSTGRES ((1/6) INSTRUCTIONS ARE FROM OFFICIAL PAGE: https://www.postgresql.org/download/linux/ubuntu/)

echo "(1/6) Installing postgreSQL in your machine ..."
sleep 2
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update
sudo apt-get -y install postgresql

# CREATE DATABASE

echo "(2/6) Creating database 'crm' ..."
sleep 2
psql -f Database/create_db.sql -d postgres

# IMPORT TABLES TO 'crm' DATABASE

echo "(3/6) Importing tables into 'crm' database ..."
sleep 2
psql --single-transaction -f Database/import_tables.sql -d crm

# INSTALL NPM

echo "(4/6) Installing npm in your machine ..."
sleep 2
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
PATH="$PATH"

# INSTALL REDIS SERVER

echo "(5/6) Installing Redis-Server in your machine ..."
sleep 2
sudo apt update
sudo apt install redis-server
sudo systemctl restart redis-server

# INSTALL NODE MODULES TO RUN THE APP

echo "(5/6) Installing required packages from 'package.json' to run the app ..."
sleep 2
npm install