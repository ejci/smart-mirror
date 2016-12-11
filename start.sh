forever start -a --uid "server" ./server/bin/www

# forever start -a --uid "sensor_dht" ~/sensor/dht.js
forever start -a --uid "sensor_si7201" ~/sensor/si7021.js
forever start -a --uid "sensor_pir" ~/sensor/pir.js

forever start -a --uid "airplay" ~/airplay/airplay.js
