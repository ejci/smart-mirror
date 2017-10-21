#https://github.com/raspberrypi-ui/rc_gui/blob/master/src/rc_gui.c
sudo raspi-config nonint do_expand_rootfs
sudo raspi-config nonint do_hostname "mirror"
sudo raspi-config nonint do_overscan 1
sudo raspi-config nonint do_boot_behaviour B2
sudo raspi-config nonint do_ssh 0
sudo raspi-config nonint do_vnc 0

#install node
#sudo apt-get -y install nodejs npm

#node -v
#echo 'alias node="nodejs"' >> ~/.bashrc
#source ~/.bashrc
#nodejs -v
#sudo ln -s "$(which nodejs)" /usr/bin/node

sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get -y install git

#node
#wget http://node-arm.herokuapp.com/node_latest_armhf.deb 
#sudo dpkg -i node_latest_armhf.deb 

curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y build-essential

sudo npm install -g forever

#Redis
sudo apt-get install redis-server -y
redis-server --daemonize yes

#shairport-sync
sudo apt-get install autoconf libtool libdaemon-dev libasound2-dev libpopt-dev libconfig-dev avahi-daemon libavahi-client-dev git
cd /tmp
git clone https://github.com/abrasive/shairport.git
git clone https://github.com/mikebrady/shairport-sync
git clone https://github.com/mikebrady/shairport-sync-metadata-reader.git
cd /tmp/shairport
./configure
make
sudo make install
cd /tmp/shairport-sync
autoconf -i -f
./configure --with-alsa --with-avahi --with-metadata --with-ssl=openssl
make
sudo make install
cd /tmp/shairport-sync-metadata-reader
autoconf -i -f
./configure
make
sudo make install
cd ~/

# install other stuff...
#sudo apt-get -y install git
#sudo apt-get -y --no-install-recommends install xserver-xorg xserver-xorg-video-fbdev xinit pciutils xinput xfonts-100dpi xfonts-75dpi xfonts-scalable
#sudo apt-get -y install nodm unclutter
#sudo apt-get -y install ttf-mscorefonts-installer xwit sqlite3
#sudo apt-get -y install fbi
#sudo apt-get -y install chromium-browser
#sudo apt-get -y install vim

sudo apt-get -y install vim
sudo apt-get -y --force-yes --no-install-recommends install xserver-xorg xserver-xorg-video-fbdev xinit pciutils xinput xfonts-100dpi xfonts-75dpi xfonts-scalable 
sudo apt-get -y --force-yes install nodm unclutter ttf-mscorefonts-installer xwit sqlite3 fbi chromium-browser
sudo apt-get -y --force-yes install matchbox-window-manager
#sudo gpasswd -a pi tty

#append /etc/rc/local (before exit 0)
## Start the kiosk
#if [ -z "${SSH_TTY}" ]; then
#  if [ -f /home/pi/autostart.sh ]; then
#    chmod 0666 /dev/tty*
#    su - pi -c "startx /home/pi/autostart.sh &"
##    startx /home/pi/autostart.sh
#  fi
#fi

# splash
cp ~/splash/splashscreen.service /etc/systemd/system/splashscreen.service
sudo systemctl enable splashscreen

# append /boot/config.txt
disable_splash=1
display_rotate=1

# append /boot/cmdline.txt
... logo.nologo consoleblank=0 loglevel=1 quiet
change console=tty3

# Cleanup
rm -r ~/Desktop ~/Documents ~/Downloads ~/Music ~/Pictures ~/Public ~/Templates ~/Videos