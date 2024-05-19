const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Route to get all users
router.get('/', usersController.getAllUsers);

router.delete('/:userId', usersController.deleteUser);

// Route to sign in
router.post('/signin', usersController.signIn);

// Route to sign up
router.post('/signup', usersController.signUp);

// Route to get user profile
router.get('/:id/profile', usersController.getUserProfile);

// Route to update user profile
router.put('/:id/profile', usersController.updateUserProfile);

module.exports = router;
