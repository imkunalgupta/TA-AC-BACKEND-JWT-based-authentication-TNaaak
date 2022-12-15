var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');

/* GET home page. */
router.get('/', function (req, res, next) {
  //res.render('index', { title: 'Express' });
  res.status(200).json({ msg: 'Welcome' });
});

router.get('/dashboard', auth.verifyToken, (req, res) => {
  //console.log(req.user);
  res.json({ access: 'Protected Resource' });
});

module.exports = router;
