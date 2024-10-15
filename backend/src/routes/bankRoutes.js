const express = require('express');
const bankController = require('../controllers/bankController');

const router = express.Router();

// Define your routes here
router.get('/banks', bankController.GET);
router.get('/banks/:id', bankController.GET_BY_ID);
router.post('/banks', bankController.POST);
router.put('/banks/:id', bankController.PUT);
router.delete('/banks/:id', bankController.DELETE);

module.exports = router;