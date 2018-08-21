'use strict';
const express = require('express');
const router = express.Router();

//@route  GET api/post/test
//@desc   Test post route
//@access Private
router.get('/test', (req, res) => res.json({msg: 'Posts Works'}));

module.exports = router;
