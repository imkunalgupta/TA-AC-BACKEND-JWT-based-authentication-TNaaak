var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Comment = require('../models/Comment');
var User = require('./User');

var bookSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    numOfPages: { type: Number, required: true },
    description: { type: String, required: true },
    price: { type: Number },
    comment: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);
