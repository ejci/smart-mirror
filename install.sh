#!/bin/bash

#install node
wget http://node-arm.herokuapp.com/node_latest_armhf.deb 
sudo dpkg -i node_latest_armhf.deb

sudo apt-get install x11-xserver-utils unclutter
sudo apt-get install xorg nodm chromium-browser
sudo apt-get install ttf-mscorefonts-installer xwit sqlite3 libnss3
sudo apt-get install fbi
