var express = require('express');
var router = express.Router();
let studentHelper = require('../helper/studentHelper')

const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'RegEx', student: true });
});
router.get('/login', function (req, res) {
  if (req.session.loggedIn) {
    res.redirect('/student')
  } else {
    res.render('login', { title: 'Users', err: req.session.loginErr, student: true });
    req.session.loginErr = false
  }
});
router.post('/login', (req, res) => {
  studentHelper.doLogin(req.body).then((resp) => {
    if (resp.err) {
      req.session.loginErr = resp.err
      res.redirect('/login')
    } else {
      req.session.loggedIn = true
      req.session.student = resp.data
      res.redirect('/student')
    }
  })
})
router.get('/signup', function (req, res) {
  res.render('signup', { student: true });
});
router.post('/signup', function (req, res) {
  studentHelper.doSignup(req.body).then(() => {
    res.redirect('/login')
  })
});
router.get('/register-exam', verifyLogin, (req, res) => {
  res.render('registerExam', { student: true })
})
router.get('/student', verifyLogin, (req, res) => {
  // console.log(req.session)
  res.render('userDashboard', { student: req.session.student[0], login: true })
})
router.post('/register-exam', (req, res) => {
  console.log(req.body);
})
module.exports = router;