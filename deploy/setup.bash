#!/usr/bin/env bash
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash - &&
sudo apt-get install -y nodejs npm &&
source ../bin/activate &&
pip install -r requirements.txt &&
npm install &&
bower install &&
mkdir ../run &&
mkdir ../logs &&
touch ../logs/gunicorn_supervisor.log &&
cp deploy/gunicorn_start.bash ../bin/gunicorn_start.bash &&
chmod u+x ../bin/gunicorn_start.bash &&
nano ../bin/gunicorn_start.bash &&
python manage.py collectstatic &&
logout &&
sudo chown someone:somegroup ../../GRVTY -R
sudo cp somefolder/GRVTY/deploy/grvty.conf /etc/supervisor/conf.d/something.conf &&
sudo nano /etc/supervisor/conf.d/something.conf &&
sudo supervisorctl reread &&
sudo supervisorctl update &&
sudo cp somefolder/GRVTY/deploy/grvty.nginxconfig /etc/nginx/sites-available/something.nginxconf
sudo nano /etc/nginx/sites-available/something.nginxconf &&
sudo ln -s /etc/nginx/sites-available/something.nginxconf /etc/nginx/sites-enabled/something.nginxconf &&
sudo service nginx restart
