var express = require('express');
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
  console.log(req.body);
  
});

module.exports = router;
