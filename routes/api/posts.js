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
         
          if(
            post.likes.filter(like => like.user.toString() === req.user.id).length === 0)
          {
          
            return res
              .status(400)
              .json({ notliked: 'You have not liked this post'});
          }
          
          // Get remove index
          const removeIndex = post.likes
            .map(item => item.user.toString()).indexOf(req.user.id);
          
          
          
          //Splice out of array
          post.likes.splice(removeIndex, 1);

          //save
         
          post.save().then(post => res.json(post));
       
        })
        .catch(err => res.status(404).json({ postnotfound: 'no post'}));
    });
});
//@route  POST api/post/comment/:id
//@desc   add comment to post
//@access Private

router.post('/comment/:id', passport.authenticate('jwt',{ session: false}),(req, res) => {
  const { errors, isValid} = validatePostInput(req.body);
  // Check Validation
  if(!isValid){
    return res.status(400).json(errors);
  }

  Post.findById(req.params.id)
    .then(post => {

      
      const newComment = {
        text: req.body.text,
        name:req.body.name,
        avatar: req.body.avatar,
        user:req.user.id
      };

      //add to comments array
      post.comments.unshift(newComment);

      //Save
      post.save().then(post => res.json(post));
    })
    .catch(err => res.status(404).json({ postnotfound: 'No post found'}));
});

//@route  DELETE api/post/comment/:id
//@desc   remove comment to post
//@access Private

router.delete('/comment/:id/:comment_id', passport.authenticate('jwt',{ session: false}),(req, res) => {
  const { errors, isValid} = validatePostInput(req.body);
  // Check Validation
  if(!isValid){
    return res.status(400).json(errors);
  }

  Post.findById(req.params.id)
    .then(post => {
      // Check to see if comment exists
      
      if(
        post.comments.filter(
          comment => comment._id.toString() === req.params.comment_id
        ).length === 0){
         
        return res.status(404).json({commentnotenotexists: 'comment does not exist'});
      }
    ////////////////////
    // const removeIndex = post.likes
    // .map(item => item.user.toString()).indexOf(req.user.id);

    //////////
      // Get remove index
      const removeIndex = post.comments.map(item => item._id.toString()).indexOf(req.params.comment_id);
     
      //Splice comment out of array
      post.comments.splice(removeIndex, 1);
      
      post.save().then(post => res.json(post));

    })
    .catch(err => res.status(404).json({ postnotfound: 'No post found'}));
});



module.exports = router;
