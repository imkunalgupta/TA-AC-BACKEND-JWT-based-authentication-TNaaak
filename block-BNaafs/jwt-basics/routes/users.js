var express = require('express');
var User = require('../models/User');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.json({ message: 'Users Information' });
});

router.post('/register', async (req, res, next) => {
  try {
    var user = await User.create(req.body);
    //console.log(user);
    var token = await user.signToken();
    res.status(201).json({ user: user.userJSON(token) });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email/Password required' });
  }
  try {
    var user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Email not registered' });
    }
    var result = await user.verifyPassword(password);
    //console.log(user, result);
    if (!result) {
      return res.status(400).json({ error: 'Incorrect Password' });
    }
    //generate token
    var token = await user.signToken();
    //console.log(token);
    //res.json({ user, token });
    res.json({ user: user.userJSON(token) });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
