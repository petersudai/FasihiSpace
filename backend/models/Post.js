const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  titleImage: { type: String },
  contentImages: [{ type: String }],
  body: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);