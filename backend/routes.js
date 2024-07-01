const express = require('express');
const controller = require('./controller.js');

const router = express.Router();

// register new user
router.post('/register', controller.registerUser);
// login user
router.post('/login', controller.loginUser);
// logout user
router.post('/logout', controller.logoutUser);

// get all users
router.get('/users', controller.getAllUsers);
// get user by username
router.get('/users/:username', controller.getUserByUsername);
// delete user by username
router.delete('/users/:username', controller.deleteUser);
// get liked articles of the user
router.get('/users/:username/liked-articles', controller.getLikedArticlesOfUser);

// get all articles
router.get('/articles', controller.getAllArticles);
// get articles of a user
router.get('/articles/:username', controller.getArticlesByUsername);
// get article by name
router.get('/articles/:name', controller.getArticleByName);
// create article by name
router.post('/articles', controller.createArticle);
// update article by name
router.put('/articles/:name', controller.updateArticle);
// delete article by name
router.delete('/articles/:name', controller.deleteArticle);

// add comment 
router.post('/articles/:name/comment', controller.addCommentToArticle);
// get comment
router.get('/articles/:name/comments', controller.getCommentsOfArticle);
// like article
router.post('/articles/:name/like', controller.likeArticle);

module.exports = router;