#!/bin/bash


# Run all of out data-scrapers
./node_modules/.bin/babel-node -- server/scripts/get-goalie-stats.js

./node_modules/.bin/babel-node -- server/scripts/get-player-stats.js
./node_modules/.bin/babel-node -- server/scripts/get-player-enh-stats.js
./node_modules/.bin/babel-node -- server/scripts/get-player-spc-stats.js