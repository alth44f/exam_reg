var express = require('express');
var router = express.Router();
let studentHelper = require('../helper/studentHelper')
const fs = require('fs');
const path = require('path');
const { title } = require('process');


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
    res.render('login', { title: 'Login', err: req.session.loginErr, student: true });
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
  res.render('signup', { title: 'Sign up', student: true });
});
router.post('/signup', function (req, res) {
  studentHelper.doSignup(req.body).then(() => {
    res.redirect('/login')
  })
});
router.get('/register-exam', verifyLogin, async (req, res) => {
  let student = await studentHelper.getStudentDetails(req.session.student[0].email)
  // req.session.regExamErr = false
  res.render('registerExam', { student, err: req.session.regExamErr, title: "Register exam", login: true })
})
router.get('/student', verifyLogin, (req, res) => {
  // console.log(req.session)
  studentHelper.checkUpload(req.session.student[0].email).then((resp) => {
    res.render('userDashboard', { title: "Student Dashboard", student: req.session.student[0], login: true, status: resp.status })
  })
})
router.post('/register-exam', (req, res) => {
  studentHelper.registerExam(req.body).then((resp) => {
    if (resp.status) {
      req.session.regExamErr = true
      res.redirect('/register-exam')
    } else {
      req.session.regExamErr = false
      res.redirect('/student')
    }
  })
})
router.get('/logout', (req, res) => {
  req.session.loggedIn = null
  req.session.student = null
  res.redirect('/login')
})
router.get('/student-register', verifyLogin, (req, res) => {
  res.render('studentDetails', { title: "Student Register", student: true, login: true })
})
router.post('/student-register', verifyLogin, (req, res) => {
  const uploadDir = path.join(__dirname, '..', 'upload');

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // Creates 'pdf' directory if it doesn't exist
  }

  // Loop through each uploaded file and move it to the 'public/pdf' folder
  Object.keys(req.files).forEach((fileKey) => {
    const uploadedFile = req.files[fileKey];
    const uniqueName = `${req.session.student[0].email}-${fileKey}.pdf`
    const filePath = path.join(uploadDir, uniqueName);


    // Move the file
    uploadedFile.mv(filePath, (err) => {
      if (err) {
        return res.status(500).send(err);
      }
    });
  });
  console.log(req.body);

  studentHelper.SetStudentRegister(req.session.student[0].email, req.body.sslcno, req.body.plustwono).then(() => {
    res.redirect('/student')
  })
})

router.get('/profile', verifyLogin, (req, res) => {
  res.render('profile', { student: req.session.student[0], title: "Profile", login: true })
})

module.exports = router;