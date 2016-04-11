#!/usr/bin/env bash
source bin/activate &&
python manage.py collectstatic &&
./node_modules/webpack/bin/webpack.js &&
python manage.py runserver
