'use strict'; 
const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data){
  let errors = {};
  //Turns data into an empty string if data.name does not have a value 
 
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  
 

  
  if(Validator.isEmpty(data.email)){
    errors.email = 'Email field is required';
  }
  if(Validator.isEmpty(data.password)){
    errors.password = 'Password is invalid';
  }
 
 

  return {
    errors, 
    isValid: isEmpty(errors)
  };
};