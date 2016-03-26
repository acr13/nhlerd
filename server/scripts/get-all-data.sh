#!/bin/bash

# Run all of out data-scrapers
# babel-node --stage 0 -- server/scripts/get-goalie-stats.js erroring out with even str

babel-node --stage 0 -- server/scripts/get-player-stats.js
babel-node --stage 0 -- server/scripts/get-player-enh-stats.js
babel-node --stage 0 -- server/scripts/get-player-spc-stats.js
