const mongoose = require('mongoose');

const repaymentSchema = new mongoose.Schema({
    loan_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan' },
    amount: Number,
    due_date: Date,
    status: { type: String, default: 'PENDING' }, // PENDING, PAID
});

module.exports = mongoose.model('Repayment', repaymentSchema);
