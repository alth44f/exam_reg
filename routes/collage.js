var express = require('express');
var router = express.Router();
const collageHelper = require('../helper/collageHelper');
const hodHelper = require('../helper/hodHelper');

const verifyLogin = (req, res, next) => {
    if (req.session.collageLoggedIn) {
        next()
    } else {
        res.redirect('/collage/login')
    }
}

router.get('/', verifyLogin, async (req, res) => {
    let dashboard_data = await collageHelper.getDashboardData()
    let fee = await hodHelper.getFee()
    let notreg = parseInt(dashboard_data.total_students) - parseInt(fee.count)
    res.render('collage/dashboard', { title: 'College Admin Dashboard', notreg, collage: { name: 'Collage' }, details: dashboard_data, fee: fee.price, examreg: fee.count })
});
router.get('/login', (req, res) => {
    res.render('collage/login', { title: 'College Login', err: req.session.collageLoginErr, student: true })
})
router.post('/login', (req, res) => {
    collageHelper.doLogin(req.body).then((resp) => {
        // console.log(resp)
        if (resp.err) {
            req.session.collageLoginErr = resp.err
            res.redirect('/collage/login')
        } else {
            req.session.collageLoggedIn = true
            req.session.collageLoginErr = null
            res.redirect('/collage')
        }
    })
})
router.get('/approve-students', verifyLogin, (req, res) => {
    collageHelper.getAllStudents().then((resp) => {
        // console.log(resp);
        res.render('collage/approveStudents', { title: "Student Details", collage: { name: 'Collage' }, students: resp })
    })
})
router.get('/change-status/:email/:status', verifyLogin, (req, res) => {
    collageHelper.changeStatus(req.params).then(() => {
        res.redirect('/collage/approve-students')
    })
})
router.get('/add-attandance/:email', verifyLogin, async (req, res) => {
    // collageHelper.addAttandance(req.params.email)
    res.render('collage/attandance', { title: "Add Attandance", collage: { name: 'Collage' }, email: req.params.email })
})

router.post('/add-attandance/', verifyLogin, async (req, res) => {
    collageHelper.addAttandance(req.body).then(() => {
        res.redirect('/collage/approve-students')
    })
    console.log(req.body)
})

router.get('/exam-details', verifyLogin, async (req, res) => {
    // let data = await collageHelper.getExamDetails()
    // console.log(data);
    res.render('collage/searchStudent', { title: 'Exam Details', collage: { name: 'Collage' } })
})

router.post('/search-student', async (req, res) => {
    let data = await collageHelper.searchStudent(req.body)
    res.json(data)
})
router.get('/add-paper', verifyLogin, (req, res) => {
    res.render('collage/addPaper', { collage: { name: 'Collage' } })
})

router.post('/add-paper', (req, res) => {
    collageHelper.addPaper(req.body).then(() => {
        res.redirect('/collage')
    })
})

router.get('/logout', (req, res) => {
    req.session.collageLoggedIn = null
    req.session.collage = null
    res.redirect('/collage/login')
})

router.get('/condonation', async (req, res) => {
    let students = await collageHelper.getCondonationStudents()
    res.render('collage/condonation', { collage: { name: 'Collage' }, title: 'Condonation', students })
})

router.get('/exam-fee', async (req, res) => {
    let courses = await collageHelper.getCourse();
    res.render('collage/examFee', { title: 'Exam Fee', collage: { name: 'Collage' }, courses })
})

router.get('/submit-fee/:course', (req, res) => {
    console.log(req.params.course)
    res.render('collage/submitFee', { collage: { name: 'Collage' }, course: req.params.course })
})

router.post('/submit-fee/', (req, res) => {
    collageHelper.storeFee(req.body).then(() => {
        res.redirect('/collage/exam-fee')
    })
})


module.exports = router;
