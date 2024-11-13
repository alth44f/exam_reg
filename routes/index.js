var express = require('express');
let studentHelper = require('../helper/studentHelper')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'RegEx' });
});
router.get('/login', function(req, res) {
  res.render('login', { title: 'Users' });
});
router.post('/login',(req,res)=>{
  console.log(req.body.password)
  res.render('userDashboard',{user: req.body.email,login: true})
})
router.get('/signup', function(req, res) {
  res.render('signup');
});
router.post('/signup', function(req, res) {
  studentHelper.doSignup(req.body).then(()=>{
    res.render('userDashboard')
  })
});

module.exports = router;
