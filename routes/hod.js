var express = require('express');
var router = express.Router();
const hodHelper = require('../helper/hodHelper');

router.get('/', (req, res) => {
  let data = {
    reg: 122,
    nonreg: 56
  }
  res.render('hod/dashboard', {hod: {name: 'Admin'}, data })
});
router.get('/login', (req, res) => {
  res.render('login')
})

module.exports = router;
