const express = require('express');
const invoiceBillController = require('../controllers/invoiceBillController');

const router = express.Router();

// GET all invoice bills
router.get('/invoiceBills', invoiceBillController.GET_ALL);
router.get('/invoiceBills/:id', invoiceBillController.GET_BY_ID); 
router.get('/portfolio/:id/invoiceBills', invoiceBillController.GET_BY_PORTFOLIO_ID);
router.post('/invoiceBills', invoiceBillController.POST);
router.put('/invoiceBills/:id', invoiceBillController.PUT);
router.delete('/invoiceBills/:id', invoiceBillController.DELETE);

module.exports = router;