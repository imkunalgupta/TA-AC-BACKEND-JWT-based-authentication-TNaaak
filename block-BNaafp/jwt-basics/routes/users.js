var express = require('express');
var router = express.Router();
var User = require('../models/Users');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.json({ message: 'Users Imformation' });
});

//registration
router.post('/register', async (req, res, next) => {
  try {
    var user = await User.create(req.body);
    console.log(user);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
});

//login
router.post('/login', async (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email/Password Required' });
  }
  try {
    var user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: ' Email is not registered' });
    }
    var result = await user.verifyPassword(password);
    console.log(user, result);
    if (!result) {
      return res.status(400).json({ error: 'Incorrect Password' });
    }
    //generated token
  } catch (error) {
    next(error);
  }
});

module.exports = router;
