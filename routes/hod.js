var express = require('express');
var router = express.Router();
const hodHelper = require('../helper/hodHelper');
const path = require('path');
const { title } = require('process');

const verifyLogin = (req, res, next) => {
  if (req.session.hodLoggedIn) {
    next()
  } else {
    res.redirect('/hod/login')
  }
}

router.get('/', verifyLogin, async (req, res) => {
  let dashboard_data = await hodHelper.getDashboardData()
  let data = {
    reg: 122,
    nonreg: 56,
  }
  res.render('hod/dashboard', { title: 'Hod Admin Dashboard', hod: { name: 'Admin' }, data, details: dashboard_data })
});
router.get('/login', (req, res) => {
  res.render('hod/login', { err: req.session.hodLoginErr,title: 'Hod Login',student:true })
})
router.post('/login', (req, res) => {
  hodHelper.doLogin(req.body).then((resp) => {
    // console.log(resp)
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
router.get('/approve-students', verifyLogin, (req, res) => {
  hodHelper.getAllStudents().then((resp) => {
    // console.log(resp);
    res.render('hod/approveStudents', { title: "Student Details", hod: { name: 'Hod' }, students: resp })
  })
})
router.get('/change-status/:email/:status', verifyLogin, (req, res) => {
  hodHelper.changeStatus(req.params).then(() => {
    res.redirect('/hod/approve-students')
  })
})
router.get('/add-attandance/:email', verifyLogin, async (req, res) => {
  // hodHelper.addAttandance(req.params.email)
  res.render('hod/attandance', { title: "Add Attandance", hod: { name: 'Hod' }, email: req.params.email })
})

router.post('/add-attandance/', verifyLogin, async (req, res) => {
  hodHelper.addAttandance(req.body).then(() => {
    res.redirect('/hod/approve-students')
  })
  console.log(req.body)
})

router.get('/exam-details', verifyLogin, async (req, res) => {
  // let data = await hodHelper.getExamDetails()
  // console.log(data);
  res.render('hod/searchStudent', {title:'Exam Details', hod: { name: 'Hod' } })
})

router.post('/search-student', async (req, res) => {
  let data = await hodHelper.searchStudent(req.body)
  res.json(data)
})
router.get('/add-paper', verifyLogin, (req, res) => {
  res.render('hod/addPaper', {title:'Add Paper', hod: { name: 'Hod' } })
})

router.post('/add-paper', (req, res) => {
  hodHelper.addPaper(req.body).then(() => {
    res.redirect('/hod')
  })
})

router.get('/view-documents/:email', (req, res) => {
  res.render('hod/documents', { title:'Documents',email: req.params.email, hod: { name: 'Hod' } })
})

router.get('/logout', (req, res) => {
  req.session.hodLoggedIn = null
  req.session.hod = null
  res.redirect('/hod/login')
})

router.get('/birth-certificate/:email', verifyLogin, (req, res) => {
  const filename = req.params.email + '-birthcer.pdf';
  const filePath = path.join(__dirname, '../upload', filename);
  res.download(filePath, (err) => {
    if (err) {
      res.render('hod/error', { hod: { name: 'Hod' } })
    }
  })
})

router.get('/plustwo-certificate/:email', verifyLogin, (req, res) => {
  const filename = req.params.email + '-plustwo.pdf';
  const filePath = path.join(__dirname, '../upload', filename);
  res.download(filePath, (err) => {
    if (err) {
      res.render('hod/error', { hod: { name: 'Hod' } })
    }
  })
})

router.get('/sslc-certificate/:email', verifyLogin, (req, res) => {
  const filename = req.params.email + '-sslc.pdf';
  const filePath = path.join(__dirname, '../upload', filename);
  res.download(filePath, (err) => {
    if (err) {
      res.render('hod/error', { hod: { name: 'Hod' } })
    }
  })
})

module.exports = router;
