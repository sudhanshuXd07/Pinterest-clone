const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true, 
  },
  imageText: {
    type: String,
    required: true,
    trim: true
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user',
  },
  likes: {
    type: Array,
    default: [],
  }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

module.exports = mongoose.model('posts', postSchema);


