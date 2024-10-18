const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, loanController.createLoan);
router.put('/:id/approve', authMiddleware, loanController.approveLoan);
// This route definition works for query parameters
router.get('/', authMiddleware, loanController.getCustomerLoan);
router.post('/repayment', authMiddleware, loanController.addRepayment);

module.exports = router;
