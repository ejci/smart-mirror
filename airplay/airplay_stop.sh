#!/bin/bash

#curl http://127.0.0.1:3000/internal/airplay/stop
redis-cli publish "internal:airplay" "{\"command\":\"stop\"}"