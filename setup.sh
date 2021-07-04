set -u
# set -e
# For developers (To trace error if any)
set -E

# POSTGRES ((1/7) INSTRUCTIONS ARE FROM OFFICIAL PAGE: https://www.postgresql.org/download/linux/ubuntu/)

echo "(1/8) Installing postgreSQL in your machine ..."
sleep 2
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update
sudo apt-get -y install postgresql

# CREATE DATABASE

echo "(2/8) Creating database 'crm' ..."
sleep 2
psql -f Database/create_db.sql -d postgres

# IMPORT TABLES TO 'crm' DATABASE

echo "(3/8) Importing tables into 'crm' database ..."
sleep 2
psql --single-transaction -f Database/import_tables.sql -d crm

# INSTALL NPM

echo "(4/8) Installing npm in your machine ..."
sleep 2
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
npm install -g npm
PATH="$PATH"

# INSTALL REDIS SERVER

echo "(5/8) Installing Redis-Server in your machine ..."
sleep 2
sudo apt update
sudo apt install redis-server -y
sudo systemctl restart redis-server

# INSTALL NODE MODULES TO RUN THE APP

echo "(6/8) Installing required packages from 'package.json' to run the app ..."
sleep 2
npm install

# INSTALL RABBITMQ MESSAGE BROKER
echo "(6/8) Installing RabbitMQ Broker ..."
sleep 2
echo 'deb http://www.rabbitmq.com/debian/ testing main' | sudo tee /etc/apt/sources.list.d/rabbitmq.list
wget -O- https://www.rabbitmq.com/rabbitmq-release-signing-key.asc | sudo apt-key add -
sudo apt-get update
sudo apt-get install rabbitmq-server
sudo systemctl enable rabbitmq-server
sudo systemctl start rabbitmq-server
sudo rabbitmq-plugins enable rabbitmq_management
# to create administrator accoun in rabbitmq use below commands
# sudo rabbitmqctl add_user admin <password>
# sudo rabbitmqctl set_user_tags admin administrator
# sudo rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"

# CREATE app.log file inside logs directory

echo "(8/8) Ceating 'logs' folder and creating app.log file ..."
sleep 2
mkdir logs
touch logs/app.log

echo "You have successfully installed the app."
echo "Use 'npm start' command to run the application"