#!/bin/bash

# disable DPMS (Energy Star) features.
xset -dpms

# disable screen saver
xset s off

# don't blank the video device
xset s noblank

# disable mouse pointer
unclutter &

# run window manager
#matchbox-window-manager -use_cursor no -use_titlebar no  &

#start services
/home/pi/start.sh

#sleep
sleep 3

# run browser
rm -R /home/pi/.config/chromium/ 
chromium-browser --start-maximized --window-size=900,1600 --kiosk --noerrdialogs --no-first-run --disable-session-crashed-bubble --disable-infobars http://127.0.0.1:3000 --incognito
#chromium-browser --start-maximized --window-size=900,1600 --noerrdialogs --no-first-run --disable-session-crashed-bubble --disable-infobars http://127.0.0.1:3000
