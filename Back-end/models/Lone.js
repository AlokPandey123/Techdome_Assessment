const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
    customer_id: String,
    amount: Number,
    term: Number,
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    created_at: { type: Date, default: Date.now },
    status: { type: String, default: 'PENDING' },
});

module.exports = mongoose.model('Loan', loanSchema);
