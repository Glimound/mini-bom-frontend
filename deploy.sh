#!/bin/bash

PROJECT_DIR=/root/mini-bom-frontend

cd $PROJECT_DIR
git pull origin master

docker-compose down
docker-compose up --build -d
