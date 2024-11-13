var express = require('express');
var router = express.Router();

let hod={
  name: 'Admin'
}


/* GET users listing. */
router.get('/', function(req, res, next) {
  let data={
    reg: 122,
    nonreg: 56
  }
  res.render('hod/dashboard',{hod,data})
});

module.exports = router;
