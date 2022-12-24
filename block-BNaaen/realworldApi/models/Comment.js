var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Article = require('./Article');
var User = require('./User');

var commentsSchema = new Schema(
  {
    body: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    article: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
  },
  { timestamps: true }
);

commentsSchema.methods.getCommentFormat = function (currentLoggedInUserId) {
  return {
    id: this.id,
    body: this.body,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    author: {
      username: this.author.username,
      bio: this.author.bio,
      isFollowing: this.author.followers.includes(currentLoggedInUserId)
        ? true
        : false,
    },
  };
};

module.exports = mongoose.model('Comment', commentsSchema);
