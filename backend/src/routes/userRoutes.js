const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();


router.post('/users/signup', userController.SIGN_UP);
router.post('/users/signin', userController.SIGN_IN);
router.get('/users/:id', userController.GET_BY_ID);
router.put('/users/:id', userController.PUT);
router.delete('/users/:id', userController.DELETE);



module.exports = router;