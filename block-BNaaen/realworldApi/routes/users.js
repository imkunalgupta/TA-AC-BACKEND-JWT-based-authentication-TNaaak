var express = require('express');
const User = require('../models/User');
var router = express.Router();
var auth = require('../middlewares/auth');

/* GET login user */
router.get('/', auth.isLoggedIn, async function (req, res, next) {
  console.log(req.body);
  try {
    if (req.user) {
      var token = await data.signToken();
      return res.status(200).json({ user: data.userJSON(token) });
    } else {
      return res.status(200).json({ error: 'You are not logged in yet' });
    }
  } catch (error) {
    return next(error);
  }
});

//register new user
router.post('/register', async (req, res, next) => {
  var data = req.body;
  try {
    var user = await User.findOne({ username: data.username });
    if (user) {
      return res.status(400).json({ error: 'User already exist' });
    } else {
      let createdUser = await User.create(data);
      return res.status(200).json({ user: createdUser });
    }
  } catch (error) {
    next(error);
  }
});

//login router
router.post('/login', async function (req, res, next) {
  var { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email/Password is required' });
  }
  try {
    var user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not Exist' });
    }
    var result = user.verifyPassword(password);
    if (!result) {
      return res.status(400).json({ error: 'Incorrect Password' });
    }
    let token = await user.signToken();
    return res.status(200).json({ user, token });
  } catch (error) {
    next(error);
  }
});

//update user
router.put('/', auth.isLoggedIn, async (req, res, next) => {
  let data = req.body;
  console.log(data);
  try {
    let updatedUser = await User.findOneAndUpdate(
      {
        email: req.user.email,
      },
      data
    );
    res.json({ user: updatedUser });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
