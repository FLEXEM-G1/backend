const express = require('express');
const portfolioController = require('../controllers/portfolioController');

const router = express.Router();

// Define your routes here
router.get('/portfolios', portfolioController.GET);
router.get('/portfolios/:id', portfolioController.GET_BY_ID);
router.post('/portfolios', portfolioController.POST);
router.put('/portfolios/:id', portfolioController.PUT);
router.put('/portfolios/:id/tcea', portfolioController.PUT_TCEA);
router.delete('/portfolios/:id', portfolioController.DELETE);

module.exports = router;