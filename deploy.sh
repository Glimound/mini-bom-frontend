#!/bin/bash

PROJECT_DIR=/path/to/your/project

cd $PROJECT_DIR
git pull origin master

docker-compose down
docker-compose up --build -d
