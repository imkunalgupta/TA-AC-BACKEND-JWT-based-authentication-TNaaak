var express = require('express');
const User = require('../models/User');
var router = express.Router();
var auth = require('../middlewares/auth');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.json({ message: 'Users Information' });
});

router.post('/register', async (req, res, next) => {
  try {
    var user = await User.create(req.body);
    var token = await user.signToken();
    res.status(201).json({ user: user.userJson(token) });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email or Password Required' });
  }
  try {
    var user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Email not Registered' });
    }
    var result = await user.verifyPassword(password);
    if (!result) {
      return res.status(400).json({ error: 'Incorrrect Password' });
    }
    var token = await user.signToken();
    res.json({ user: user.userJson(token) });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
