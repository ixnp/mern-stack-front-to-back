'use strict';
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const users = require('./routes/api/users.js');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

//Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// DB Config
const db = require('./config/keys.js').mongoURI;

//Connect to MongoDB
mongoose
  .connect(db)
  .then(()=> console.log('MongoDB Connect'))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send('hello'));

//Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`server running on port ${port}`));