https://www.hackster.io/Salmanfarisvp/googlepi-google-assistant-on-raspberry-pi-9f3677

sudo apt-get install python3-dev python3-venv

sudo apt-get install portaudio19-dev libffi-dev libssl-dev

python3 -m venv env

env/bin/pip install setuptools --upgrade

source env/bin/activate 

python -m pip install google-assistant-sdk[samples]



###BETTER MANUAL####
https://developers.google.com/assistant/sdk/prototype/getting-started-pi-python/configure-audio
