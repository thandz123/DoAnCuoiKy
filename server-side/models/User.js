const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false } // Thêm trường này để nhận biết người dùng là admin
});

const User = mongoose.model('User', userSchema);

module.exports = User;
