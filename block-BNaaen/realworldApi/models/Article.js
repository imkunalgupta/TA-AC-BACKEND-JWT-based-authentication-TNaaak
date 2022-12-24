var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./User');
var slugger = require('slugger');
var Comment = require('./Comment');

var articleSchema = new Schema(
  {
    slug: { type: String, require: true, unique: true },
    title: { type: String, require: true },
    description: { type: String },
    body: { type: String },
    tagList: [{ type: String }],
    favoritedBy: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    favoritesCount: { type: Number, default: 0 },
    author: { type: Object, require: true },
    comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true }
);

articleSchema.pre('save', async function (next) {
  if (this.title && this.isModified('title')) {
    this.slug = slugger(this.title);
    next();
  } else {
    next();
  }
});

articleSchema.methods.getArticleFormat = function (currentLoggedInUser = null) {
  return {
    slug: this.slug,
    title: this.title,
    description: this.description,
    body: this.body,
    taglist: this.taglist,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    favouritesCounts: this.favouritedBy.length,
    favourited:
      Boolean(currentLoggedInUser) &&
      this.favouritedBy.includes(currentLoggedInUser.id),
    author: this.author.getUserFormat(currentLoggedInUser),
  };
};

module.exports = mongoose.model('Article', articleSchema);
