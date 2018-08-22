'use strict';
//the validators npm package we are using only checks for a str this handles for everything else 
const isEmpty = value => 
  value === undefined ||
  value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0);
  
  module.exports = isEmpty;