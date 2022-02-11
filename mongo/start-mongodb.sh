#!/bin/bash
#Filename: /home/tujiawei/github/blogs/mongo/start-mongodb.sh
#Author: Mr Prince
#Date: 2022-02-10 18:49:42
sudo docker run -itd --name mongo -p 27017:27017 mongo --auth
