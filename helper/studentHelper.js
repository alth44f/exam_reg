let db = require('../connection/connection')
// db.query('insert ignore into students values(?,?,?,?,?,?,?,?) ', [userData.name, userData.email, userData.course, userData.phone, userData.aadhar, userData.gender, userData.dob, userData.password], (err, data) => {
//     if (err) throw err
//     resolve()
// })

module.exports = {
    doSignup: (userData) => {
        return new Promise((resolve, reject) => {
            
        })
    }
}