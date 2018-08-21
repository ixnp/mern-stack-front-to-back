'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  avatar: {
    type: String,
  
  },
  data: {
    type: Date,
    default: Date.now
  }
});
const User = mongoose.model('user', UserSchema);
module.exports = User;