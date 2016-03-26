#!/bin/bash

# Run all of out data-scrapers
# babel-node --stage 0 -- server/scripts/get-goalie-stats.js erroring out with even str

./node_modules/.bin/babel-node -- server/scripts/get-player-stats.js
./node_modules/.bin/babel-node-- server/scripts/get-player-enh-stats.js
./node_modules/.bin/babel-node -- server/scripts/get-player-spc-stats.js
