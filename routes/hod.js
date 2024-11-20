var express = require('express');
var router = express.Router();
const hodHelper = require('../helper/hodHelper');

const verifyLogin = (req, res, next) => {
  if (req.session.hodLoggedIn) {
    next()
  } else {
    res.redirect('/hod/login')
  }
}

router.get('/', verifyLogin, (req, res) => {
  let data = {
    reg: 122,
    nonreg: 56
  }
  res.render('hod/dashboard', { hod: { name: 'Admin' }, data, err: req.session.hodLoginErr })
});
router.get('/login', (req, res) => {
  res.render('hod/login')
})
router.post('/login', (req, res) => {
  hodHelper.doLogin(req.body).then((resp) => {
    console.log(resp)
    if (resp.err) {
      req.session.hodLoginErr = resp.err
      res.redirect('/hod/login')
    } else {
      req.session.hodLoggedIn = true
      req.session.hodLoginErr = null
      res.redirect('/hod')
    }
  })
})
module.exports = router;
