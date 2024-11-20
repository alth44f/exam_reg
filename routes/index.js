var express = require('express');
var router = express.Router();
let studentHelper = require('../helper/studentHelper')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'RegEx' });
});
router.get('/login', function (req, res) {
  res.render('login', { title: 'Users', err: req.session.loginErr });
});
router.post('/login', (req, res) => {
  studentHelper.doLogin(req.body).then((resp) => {
    if (resp.err) {
      req.session.loginErr = resp.err
      res.redirect('/login')
    } else {
      req.session.loginErr = null
      res.render('userDashboard', { user: resp.user[0].name, login: true })
    }
  })
})
router.get('/signup', function (req, res) {
  res.render('signup');
});
router.post('/signup', function (req, res) {
  studentHelper.doSignup(req.body).then(() => {
    res.redirect('/login')
  })
});
router.get('/register-exam',(req,res)=>{
  res.render('registerExam.hbs')
})

module.exports = router;
