const express = require('express');
const invoiceBillController = require('../controllers/invoiceBillController');

const router = express.Router();

// GET all invoice bills
router.get('/invoiceBills', invoiceBillController.GET_ALL);
router.get('/invoiceBills/:id', invoiceBillController.GET_BY_ID); 
router.get('/portfolio/:id/invoiceBills', invoiceBillController.GET_BY_PORTFOLIO_ID);
router.delete('/portfolio/:id/invoiceBills', invoiceBillController.DELETE_BY_PORTFOLIO_ID);
router.get('/invoiceBills/tcea', invoiceBillController.GET_TCEA);
router.post('/invoiceBills', invoiceBillController.POST);
router.put('/invoiceBills/:id', invoiceBillController.PUT);
router.delete('/invoiceBills/:id', invoiceBillController.DELETE);

module.exports = router;