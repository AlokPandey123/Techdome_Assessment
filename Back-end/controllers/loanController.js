const Loan = require('../models/Lone.js');
const Repayment = require('../models/Repayment');


// Create a new loan
exports.createLoan = async (req, res) => {
    const { customer_id, amount, term, userId } = req.body;
    try {
        const loan = new Loan({ customer_id, amount, term, userId });
        await loan.save();

        // Create repayment schedule (weekly)
        let repayments = [];
        let repaymentAmount = (amount / term).toFixed(2);
        for (let i = 1; i <= term; i++) {
            let dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + (i * 7));
            repayments.push({
                loan_id: loan._id,
                amount: repaymentAmount,
                due_date: dueDate,
            });
        }
        await Repayment.insertMany(repayments);
        
        res.status(201).json({ loan, repayments });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Approve loan
exports.approveLoan = async (req, res) => {
    const { id } = req.params;
    try {
        let loan = await Loan.findById(id);
        if (!loan) return res.status(404).json({ error: 'Loan not found' });

        loan.status = 'APPROVED';
        await loan.save();
        
        res.status(200).json(loan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// View customer loan
exports.getCustomerLoan = async (req, res) => {
    const { userId } = req.query; // Change this line to get userId from query
    try {
        // Use find instead of findById to search by userId
        let loans = await Loan.find({ userId }); // Get loans for the specific userId
        if (!loans || loans.length === 0) return res.status(404).json({ error: 'Loans not found' });

        // Here, you may want to retrieve repayments for each loan if necessary
        let repayments = []; // Initialize repayments array
        for (let loan of loans) {
            const loanRepayments = await Repayment.find({ loan_id: loan._id });
            repayments.push({ loan, repayments: loanRepayments });
        }

        res.status(200).json(repayments); // Send loans and their repayments
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Repay loan installment
exports.addRepayment = async (req, res) => {
    const { loan_id, amount } = req.body;
    try {
        let repayment = await Repayment.findOne({
            loan_id,
            status: 'PENDING',
        }).sort('due_date');
        
        if (!repayment) return res.status(404).json({ error: 'No pending repayments' });

        if (amount >= repayment.amount) {
            repayment.status = 'PAID';
            await repayment.save();

            let pendingRepayments = await Repayment.countDocuments({
                loan_id,
                status: 'PENDING',
            });

            if (pendingRepayments === 0) {
                let loan = await Loan.findById(loan_id);
                loan.status = 'PAID';
                await loan.save();
            }

            res.status(200).json({ repayment });
        } else {
            res.status(400).json({ error: 'Amount less than required repayment' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
