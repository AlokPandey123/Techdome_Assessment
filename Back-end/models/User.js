const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true, match: /^[0-9]{10}$/ }, // 10-digit mobile number
    password: { type: String, required: true },
});

// Hash the password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

// Export the User model
module.exports = mongoose.model('User', userSchema);
