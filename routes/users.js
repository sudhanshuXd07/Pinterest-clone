const mongoose = require('mongoose');
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/clownapp1");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'posts',
  }],
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  fullname: {
    type: String,
    required: true,
    trim: true
  },

  // ✅ Add this field for profile image
  profileImage: {
    type: String,
    default: '' // or use a default image path if you prefer
  }

}, { timestamps: true });

userSchema.plugin(plm);

module.exports = mongoose.model('user', userSchema);
