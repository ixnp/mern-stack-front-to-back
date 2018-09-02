'use strict';
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('../../models/Posts');
const Profile = require('../../models/Profile');


const validatePostInput = require('../../validation/post');

//@route  GET api/post/test
//@desc   Test post route
//@access Private
router.get('/test', (req, res) => res.json({msg: 'Posts Works'}));

//@route  GET api/post
//@desc   Test post route
//@access public
router.get('/', (req, res) => {
  Post.find()
    .sort({date: -1})
    .then(post =>res.json(post))
    .catch(err => res.status(404));
});

//@route  GET api/post
//@desc   Test post route
//@access public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post =>res.json(post))
    .catch(err => res.status(404).json({nopostfound: 'No post found with that ID'}));
});

//@route  Post api/post
//@desc   create post
//@access Private
router.post('/', passport.authenticate('jwt', {session: false }), (req, res) => {
  const { errors, isValid} = validatePostInput(req.body);
  // Check Validation
  if(!isValid){
    return res.status(400).json(errors);
  }

  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });

  newPost.save().then(post => res.json(post));
});



//@route  DELETE api/post
//@desc   create post
//@access Private
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOne({user: req.user.id})
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // check for post owner
          if(post.user.toString() !== req.user.id) {
            return res.status(401).json({notauthorized: 'User not authorized'});
          }

          //Delete
          post.remove().then(() => res.json({ success: true}));
        })
        .catch(err => res.status(404).json({ postnotfound: 'no post found'}));
    });
});

//@route  POST api/post/like/:id
//@desc   like post
//@access Private
router.post('/like/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOne({user: req.user.id})
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
            return res.status(400).json({ alreadyliked: 'User already liked this post'});
          }
          // add user id to likes array
          post.likes.unshift({ user: req.user.id});
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'no post found'}));
    });
});



//@route  POST api/post/unlike/:id
//@desc   unlike post
//@access Private
router.post('/unlike/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOne({user: req.user.id})
    .then(profile => {
      Post.findById(req.params.id)
      .then(post => {
           console.log('108', post);
          if(
            post.likes.filter(like => like.user.toString() === req.user.id).length === 0)
          {
            // console.log('113');
            return res
            .status(400)
            .json({ notliked: 'You have not liked this post'});
          }
          console.log('117', post);
          // Get remove index
          const removeIndex = post.likes
          .map(item => item.user.toString()).indexOf(req.user.id);
          console.log('120', removeIndex, post);
          
          
          //Splice out of array
          post.likes.splice(removeIndex, 1);

          //save
          // console.log('124');
          post.save().then(post => res.json(post));
          console.log('129', post);
        })
        .catch(err => res.status(404).json({ postnotfound: 'no post'}));
    });
});


module.exports = router;
