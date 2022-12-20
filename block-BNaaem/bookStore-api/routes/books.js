var express = require('express');
var router = express.Router();
var Book = require('../models/Book');
var Comment = require('../models/Comment');
var auth = require('../middlewares/auth');
var User = require('../models/User');

router.use(auth.verifyToken);

//post a book
router.post('/', async function (req, res, next) {
  req.body.author = req.user.userId;
  Book.create(req.body, async (err, book) => {
    if (err) return next(err);
    try {
      var user = await User.findByIdAndDelete(book.author, {
        $push: { books: book.id },
      });
    } catch (error) {
      return next(error);
    }
    return res.status(200).json({ book });
  });
});

//list all book

router.get('/', async (req, res, next) => {
  try {
    var books = await Book.find({});
    res.status(200).json({ books });
  } catch (error) {
    next(error);
  }
});

//fetch single book

router.get('/:id', (req, res, next) => {
  var bookId = req.params.id;
  Book.findById(bookId, (err, book) => {
    if (err) return next(err);
    return res.status(200).json({ book });
  });
});

//update a book
router.put('/', async (req, res, next) => {
  var bookId = req.params.id;
  var book = await Book.findById(bookId);
  try {
    if (req.user.userId == book.author) {
      var updatedBook = await Book.findByIdAndUpdate(bookId, req.body);
      return res.status(200).json({ updatedBook });
    } else {
      return res.status(400).json({ msg: " You can not update other's books" });
    }
  } catch (error) {
    return next(err);
  }
});

//delete a book
router.delete('/:id/delete', async (req, res, next) => {
  var bookId = req.params.id;
  var book = await Book.findById(bookId);
  try {
    if (req.user.userId == book.author) {
      var deletedBook = await Book.findByIdAndDelete(bookId);
      await User.findByIdAndUpdate(deletedBook.author, {
        $pull: { books: bookId },
      });
      return res.status(200).json({ deletedBook });
    } else {
      return res
        .status(400)
        .json({ msg: "You can't delete books which are created by others" });
    }
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
