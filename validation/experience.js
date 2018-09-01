'use strict'; 
const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperinceInput(data){
  let errors = {};
  //Turns data into an empty string if data.name does not have a value 
 
  data.title = !isEmpty(data.title) ? data.title : '';
  data.company = !isEmpty(data.company) ? data.company : '';
  data.from = !isEmpty(data.from) ? data.from : '';
  data.to = !isEmpty(data.to) ? data.to : '';
  
  
 

  
  if(Validator.isEmpty(data.title)){
    errors.title = 'Job Title field is required';
  }
  if(Validator.isEmpty(data.company)){
    errors.company = 'company Title field is required';
  }
  
  if(Validator.isEmpty(data.from)){
    errors.from = 'From date is required';
  }
  if(Validator.isEmpty(data.to)){
    errors.to = 'to date is required';
  }
  
  
 
 

  return {
    errors, 
    isValid: isEmpty(errors)
  };
};