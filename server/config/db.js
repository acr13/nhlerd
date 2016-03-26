'use strict';

const localDevUri = 'mongodb://localhost/nhlerd';

module.exports = {
  uri : process.env.MONGOLAB_URI || localDevUri
};
